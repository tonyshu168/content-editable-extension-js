/*
* Is in content-editable dom
* This needs to be bound
*/
export default function isInEditableElement(this: any, range: Range): number {
  let { commonAncestorContainer } = range;
  let isIn = 1, isBreak = 0;

  if ( commonAncestorContainer === this.dom ) { return isIn; }

  while ( (commonAncestorContainer = commonAncestorContainer.parentElement as Node) && !isBreak ) {
    const { nodeName } = commonAncestorContainer;
    if ( nodeName === 'BODY' ) {
      [isIn, isBreak] = [0, 1];
    }
    else if ( commonAncestorContainer === this.dom ) {
      isBreak = 1;
    }
  }
  
  return isIn;
}
