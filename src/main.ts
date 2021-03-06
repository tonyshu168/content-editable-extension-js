import isInEditableElement from './isInEditableElement';
import isNeedAssoicate from './isNeedAssociate';

type selectionType = {
  ['type']: string,
  createRange: Function,
}

declare global {
  interface Document {
      selection: typeof Selection & selectionType;
  }
}

/*
* @params dom: Set content-editable dom
* @params isNeedAssociate: Determine if you need to associate
* @params associateHandleCb: associate callback
*/
export default class CEExtension {
  constructor(dom: HTMLElement, isNeedAssociate: number | boolean = 0, associateHandleCb = () => {}) {
    if (!dom) { throw Error('Params dom is not null'); }

    this.dom = dom;
    this.associateHandleCb = associateHandleCb;
    this.setContentEditable();
    isNeedAssociate && this.addChangeEvent();
  }

  private dom: HTMLElement;
  private associateHandleCb: Function;

  private setContentEditable( ) {
    const { dom } = this;
    const contenteditableValue = dom.getAttribute('contenteditable');
    const styleBorder = getComputedStyle(dom).border;

    if (!contenteditableValue || contenteditableValue === 'false' ) {
      dom.setAttribute('contenteditable', 'true');
    }

    if ( !styleBorder || styleBorder === '0px none rgb(0, 0, 0)' ) {
      dom.style.border = '1px solid #eee';
    }
  }

  private addChangeEvent() {
    const { dom } = this;
    dom.addEventListener('input', e => {
      const { target } = e;
      const innerHTML = (< HTMLElement>target).innerHTML;
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const textNode = range!.commonAncestorContainer;
      const isNeedObj = isNeedAssoicate(textNode.textContent || '');
      console.log(isNeedObj);
      // Calculate whether input association processing is required
      this.associateHandleCb(isNeedObj);
    })
  }

  /*
  * Params htmlStr: <img src="./img/oip-c.jpg" alt="图片" />
  * Params isAssociate: @ associate
  */
  insert( htmlStr: string, isAssociate: boolean | number ) {
    if ( isAssociate ) { CEExtension.setCursorToLast(this.dom); }
    if ( window.getSelection ) {
      const selection = window.getSelection();
      let range = selection!.getRangeAt(0);

      // If the selection is not inside the content-editable dom element, it is not processed
      if ( !isInEditableElement.call(this, range) ) { return; }

      if ( selection?.getRangeAt && selection.rangeCount ) {
        const el = document.createElement('div');
        let rangeLastNode: Node | null = null;
        el.innerHTML = htmlStr;

        const frag = document.createDocumentFragment();
        let node: ChildNode | null, lastNode!: ChildNode;

        while ( node = el.firstChild ) {
          lastNode = frag.appendChild(node);
        }

        // Deletes the '@esdss' characters entered
        if ( isAssociate ) {
          const { childNodes } = range.commonAncestorContainer;
          const childNodeLen = childNodes.length;
          rangeLastNode = childNodes[childNodeLen -1];

          for (let i = childNodeLen -1; i >= 0; i--) {
            const element = childNodes[i];
            const { textContent } = element;

            if ( textContent && textContent.includes('@') ) {
              const position = textContent.lastIndexOf('@');
              element.textContent = textContent.substring(0, position + 1);
              break;
            }
          }
        }

        // Append is used if the element is DIV, insertNode is used otherwise
        if ( rangeLastNode && rangeLastNode.nodeName === 'DIV' ) {
          rangeLastNode.appendChild(frag)
        }
        else {
          range?.insertNode( frag );
        }

        if ( lastNode ) {
          range = range?.cloneRange();
          range?.setStartAfter(lastNode);
          range?.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      else if ( document.selection.type !== 'Control' ) {
        document.selection.createRange().pastHTML(htmlStr);
      }
    }
  }

  // Sets the rear side of the cursor positioning content.
  static setCursorToLast( dom: HTMLElement ) {
    if (!dom) { throw Error('Params dom is not null'); }

    if ( window.getSelection ) {
      dom.focus();

      const selection = window.getSelection();
      selection?.selectAllChildren( dom );
      selection?.collapseToEnd();
    }
    else if ( document.selection ) {  // IE10 9 8 7 6 5
      const range = document.selection.createRange();
      range.moveToElementText( dom );
      range.collapse( false );
      range.select();
    }
  }

  // Sets the position of the association list
  static setPositionOfAssociateList(associateList: HTMLElement, outermostEleForAssociateList: HTMLElement) {
    if (!associateList) { throw Error('Params associateList is not null'); }

    if ( window.getSelection ) {
      const selection = window.getSelection();
      const range = selection!.getRangeAt(0);
      const textNode = range.commonAncestorContainer;
      const tempRange = document.createRange();
      tempRange.selectNodeContents(textNode);
      const outermostEleRects = outermostEleForAssociateList.getBoundingClientRect();
      const rects = Object.prototype.hasOwnProperty.call(tempRange, 'getBoundingClientRect')
        ? tempRange.getBoundingClientRect() : tempRange.getClientRects()[0];

      // 'sdwes@ew'字符串中@之前的字符长度
      const beforeStrLen = textNode.textContent?.lastIndexOf('@') || 0;
      const CORRECT_WIDTH_VALUE = 12, CORRECT_HEIGHT_VALUE = 20;

      associateList.style.position = 'absolute';
      associateList.style.left = rects.left - outermostEleRects.left + CORRECT_WIDTH_VALUE * beforeStrLen + 'px';
      associateList.style.top = rects.top - outermostEleRects.top + CORRECT_HEIGHT_VALUE + 'px';
    }
  }
  
  getValue() {
    return this.dom.innerHTML;
  }
}