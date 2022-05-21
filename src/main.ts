type selectionType = {
  ['type']: string,
  createRange: Function,
}

declare global {
  interface Document {
      selection: typeof Selection & selectionType;
  }
}


export default class CEExtension {
  constructor(dom: HTMLElement) {
    if (!dom) { throw Error('Params dom is not null'); }

    this.dom = dom;
    this.setContentEditable();
  }

  private dom: HTMLElement;

  private setContentEditable( ) {
    const { dom } = this;
    const contenteditableValue = dom.getAttribute('contenteditable');

    if (!contenteditableValue || contenteditableValue === 'false' ) {
      dom.setAttribute('contenteditable', 'true');
    }
  }

  /*
  * Params htmlStr: <img src="./img/oip-c.jpg" alt="图片" />
  * Params isAssociate: @ associate
  */
  insert( htmlStr: string, isAssociate: boolean | number ) {
    if ( window.getSelection ) {
      const selection = window.getSelection();
      let range = <Range>selection?.getRangeAt(0);

      if ( selection?.getRangeAt && selection.rangeCount ) {
        const el = document.createElement('div');
        el.innerHTML = htmlStr;

        const frag = document.createDocumentFragment();
        let node: ChildNode | null, lastNode!: ChildNode;

        while ( node = el.firstChild ) {
          lastNode = frag.appendChild(node);
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

      const range = window.getSelection();
      range?.selectAllChildren( dom );
      range?.collapseToEnd();
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