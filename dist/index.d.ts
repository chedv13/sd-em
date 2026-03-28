export declare class ENTD {
    static apiUrl: string;
    connectionId: string;
    bodyOverflowY: string;
    inited: boolean;
    success?: boolean;
    constructor(connectionId: string);
    attachDrawingModal(cssSelector: string, shopDrawingID: string, data?: object): void;
    init: () => Promise<void>;
    openDrawingModal(shopDrawingID: string, data?: object): Promise<void>;
    private buildBrandLogo;
    private buildModalBody;
    private static createInvalidResponse;
}
