export interface DrawingData {
    external_id: string;
    source: string;
    [key: string]: unknown;
}
export declare class ENTD {
    static apiUrl: string;
    readonly connectionId: string;
    inited: boolean;
    success?: boolean;
    private bodyOverflowY;
    constructor(connectionId: string);
    init: () => Promise<void>;
    attachDrawingModal(cssSelector: string, shopDrawingID: string, data: DrawingData): void;
    openDrawingModal(shopDrawingID: string, data: DrawingData): Promise<void>;
    private createModalElement;
    private closeModal;
    private buildModalBody;
    private buildIframeSrc;
}
