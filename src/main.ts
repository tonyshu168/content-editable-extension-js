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

    if (!contenteditableValue || contenteditableValue === 'false' ) {
      dom.setAttribute('contenteditable', 'true');
    }
  }

  private addChangeEvent() {
    const { dom } = this;
    dom.addEventListener('input', e => {
      const { target } = e;
      const innerHTML = (< HTMLElement>target).innerHTML;
      const isNeedObj = isNeedAssoicate(innerHTML);
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
        el.innerHTML = htmlStr;

        const frag = document.createDocumentFragment();
        let node: ChildNode | null, lastNode!: ChildNode;

        while ( node = el.firstChild ) {
          lastNode = frag.appendChild(node);
        }

        // Deletes the '@esdss' characters entered
        if ( isAssociate ) {
          const { childNodes } = range.commonAncestorContainer;

          for (let i = childNodes.length -1; i >= 0; i--) {
            const element = childNodes[i];
            const { textContent } = element;

            if ( textContent && textContent.includes('@') ) {
              const position = textContent.lastIndexOf('@');
              element.textContent = textContent.substring(0, position + 1);
              break;
            }
          }
        }

        range?.insertNode( frag );

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
  
  getValue() {
    return this.dom.innerHTML;
  }
}