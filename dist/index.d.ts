import { BUTTON_TEXTS } from './texts';
export interface DrawingData {
    external_id: string;
    source: string;
    [key: string]: unknown;
}
export type DrawingButtonText = keyof typeof BUTTON_TEXTS;
export interface DrawingButtonOptions {
    styled?: boolean;
    theme?: 'light' | 'dark' | 'auto';
    size?: 'small' | 'medium' | 'large';
    shape?: 'rectangular' | 'pill';
    text?: DrawingButtonText | (string & {});
    logo?: boolean;
    fullWidth?: boolean;
    className?: string;
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
    renderDrawingButton(cssSelector: string, shopDrawingID: string, data: DrawingData, options?: DrawingButtonOptions): HTMLButtonElement[];
    openDrawingModal(shopDrawingID: string, data: DrawingData): Promise<void>;
    private createModalElement;
    private closeModal;
    private buildModalBody;
    private buildIframeSrc;
}
