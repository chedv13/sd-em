// Типы для src/lib/entd.js (ES-обёртка над сборкой sd-em). Совпадают с src/index.ts корневого проекта.
export interface DrawingData {
  external_id: string;
  source: string;
  [key: string]: unknown;
}

export interface DrawingButtonOptions {
  styled?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'small' | 'medium' | 'large';
  shape?: 'rectangular' | 'pill';
  text?: string;
  logo?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export declare class ENTD {
  static apiUrl: string;
  readonly connectionId: string;
  inited: boolean;
  success?: boolean;
  constructor(connectionId: string);
  init: () => Promise<void>;
  attachDrawingModal(cssSelector: string, shopDrawingID: string, data: DrawingData): void;
  renderDrawingButton(
    cssSelector: string,
    shopDrawingID: string,
    data: DrawingData,
    options?: DrawingButtonOptions,
  ): HTMLButtonElement[];
  openDrawingModal(shopDrawingID: string, data: DrawingData): Promise<void>;
}
