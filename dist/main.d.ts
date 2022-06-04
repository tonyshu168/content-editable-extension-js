declare type selectionType = {
    ['type']: string;
    createRange: Function;
};
declare global {
    interface Document {
        selection: typeof Selection & selectionType;
    }
}
export default class CEExtension {
    constructor(dom: HTMLElement, isNeedAssociate?: number | boolean, associateHandleCb?: () => void);
    private dom;
    private associateHandleCb;
    private setContentEditable;
    private addChangeEvent;
    insert(htmlStr: string, isAssociate: boolean | number): void;
    static setCursorToLast(dom: HTMLElement): void;
    static setPositionOfAssociateList(associateList: HTMLElement, outermostEleForAssociateList: HTMLElement): void;
    getValue(): string;
}
export {};
