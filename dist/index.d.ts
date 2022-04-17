export declare class SD {
    static apiUrl: string;
    connectionID: string;
    success?: boolean;
    constructor(connectionID: string);
    attachDrawingModal(cssSelector: string, shopDrawingID: string): void;
    openDrawingModal(shopDrawingID: string): void;
    private buildModalBody;
    private validateConnectionID;
    private static createInvalidResponse;
}
