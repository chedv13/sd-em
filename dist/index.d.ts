export declare class SD {
    static apiUrl: string;
    connectionId: string;
    bodyOverflowY: string;
    inited: boolean;
    success?: boolean;
    constructor(connectionId: string);
    attachDrawingModal(cssSelector: string, shopDrawingID: string, data?: object): void;
    init: () => Promise<void>;
    openDrawingModal(shopDrawingID: string, data?: object): void;
    private buildModalBody;
    private static createInvalidResponse;
    private static createLoaderResponse;
}
