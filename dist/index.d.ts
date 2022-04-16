export declare class SD {
    static apiUrl: string;
    success?: boolean;
    attachDrawingModal(cssSelector: string, shopDrawingID: string): void;
    openDrawingModal(shopDrawingID: string): void;
    private buildModalBody;
    private validateConnectionID;
    private static createInvalidResponse;
}
