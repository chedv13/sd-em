import {BUTTON_TEXTS, TEXTS} from './texts';
import {CLOSE_ICON_SVG, ERROR_ICON_SVG} from './icons';
import {BUTTON_CSS, BUTTON_STYLES_ID, STYLES} from './styles';

export interface DrawingData {
    // User ID in the shop's system or any other unique identifier of the user.
    external_id: string;
    // Source of the drawing (e.g. name of the store, website, etc.).
    source: string;

    [key: string]: unknown;
}

export type DrawingButtonText = keyof typeof BUTTON_TEXTS;

export interface DrawingButtonOptions {
    // `true` (default) renders the button with built-in ENTD styles.
    // `false` renders a bare <button> with class names only, so the shop applies its own CSS.
    styled?: boolean;
    // Color scheme of the built-in styles: 'light' (default), 'dark', or 'auto' to follow the visitor's `prefers-color-scheme`.
    theme?: 'light' | 'dark' | 'auto';
    size?: 'small' | 'medium' | 'large';
    shape?: 'rectangular' | 'pill';
    // One of the built-in presets ('enter_draw', 'join_giveaway', 'participate', 'try_your_luck') or any custom label.
    text?: DrawingButtonText | (string & {});
    // Show the ENTD mark before the label. Default `true`.
    logo?: boolean;
    // Stretch the button to the width of its container.
    fullWidth?: boolean;
    // Extra class names appended to the <button>.
    className?: string;
}

export class ENTD {
    static apiUrl: string = `https://${process.env.API_HOST}/v1/em`;

    readonly connectionId: string;
    inited: boolean = false;
    success?: boolean;

    private bodyOverflowY: string = '';

    constructor(connectionId: string) {
        this.connectionId = connectionId;
    }

    init = async (): Promise<void> => {
        this.inited = true;

        try {
            const response = await fetch(`${ENTD.apiUrl}/connections/validate`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-SD-ConnectionID': this.connectionId,
                    'X-SD-Host': window.location.host,
                },
            });
            const data = await response.json();

            this.success = data?.success === true;
        } catch {
            this.success = false;
        }
    };

    attachDrawingModal(cssSelector: string, shopDrawingID: string, data: DrawingData): void {
        document.querySelectorAll(cssSelector).forEach((element) => {
            element.addEventListener('click', () => this.openDrawingModal(shopDrawingID, data));
        });
    }

    // Renders an ENTD drawing button inside every element matching `cssSelector`
    // and wires it to open the drawing modal. Returns the created buttons.
    renderDrawingButton(
        cssSelector: string,
        shopDrawingID: string,
        data: DrawingData,
        options: DrawingButtonOptions = {},
    ): HTMLButtonElement[] {
        const styled = options.styled !== false;
        const buttons: HTMLButtonElement[] = [];

        if (styled) {
            ensureButtonStyles();
        }

        document.querySelectorAll(cssSelector).forEach((container) => {
            const button = buildButtonElement(options, styled);

            button.addEventListener('click', () => this.openDrawingModal(shopDrawingID, data));
            container.appendChild(button);
            buttons.push(button);
        });

        return buttons;
    }

    async openDrawingModal(shopDrawingID: string, data: DrawingData): Promise<void> {
        this.bodyOverflowY = document.body.style.overflowY;

        const modalEl = this.createModalElement();

        document.body.appendChild(modalEl);
        document.body.style.overflowY = 'hidden';
        window.scrollTo(0, 0);

        modalEl.querySelector('.sde__modal-body')!.innerHTML = await this.buildModalBody(shopDrawingID, data);
    }

    private createModalElement(): HTMLDivElement {
        const modalEl = document.createElement('div');

        modalEl.className = 'sde__modal';
        modalEl.setAttribute('style', STYLES.modal);
        modalEl.innerHTML =
            `<div style="${STYLES.header}">` +
            `${buildBrandLogo()}` +
            `<div class="sde__modal-close" style="${STYLES.closeButton}">${CLOSE_ICON_SVG}</div>` +
            `</div>` +
            `<div class="sde__modal-body" style="${STYLES.body}"></div>`;

        modalEl.querySelector('.sde__modal-close')!.addEventListener('click', () => this.closeModal(modalEl));

        return modalEl;
    }

    private closeModal(modalEl: HTMLElement): void {
        modalEl.remove();
        document.body.style.overflowY = this.bodyOverflowY;
    }

    private async buildModalBody(shopDrawingID: string, data: DrawingData): Promise<string> {
        if (!this.inited) {
            return buildErrorBody(TEXTS.ERROR_NOT_INITIALIZED);
        }

        if (!this.success) {
            return buildErrorBody(TEXTS.ERROR_TRY_AGAIN_LATER);
        }

        if (!shopDrawingID) {
            return buildErrorBody(TEXTS.ERROR_DRAWING_NOT_FOUND);
        }

        if (!data.external_id || !data.source) {
            // TODO: Здесь сделать более внятную ошибку в будущем
            return buildErrorBody(TEXTS.ERROR_TRY_AGAIN_LATER);
        }

        const iframeSrc = this.buildIframeSrc(shopDrawingID, data);

        try {
            // no-cors: ответ будет opaque, проверяем только сетевую доступность страницы.
            const res = await fetch(iframeSrc, {method: 'HEAD', mode: 'no-cors'});

            if (!res.ok && res.type !== 'opaque') {
                return buildErrorBody(TEXTS.ERROR_TRY_AGAIN_LATER);
            }

            return `<iframe src="${iframeSrc}" style="${STYLES.iframe}"></iframe>`;
        } catch {
            return buildErrorBody(TEXTS.ERROR_TRY_AGAIN_LATER);
        }
    }

    private buildIframeSrc(shopDrawingID: string, data: DrawingData): string {
        const params = new URLSearchParams({
            meta: btoa(JSON.stringify({url: window.location.href})),
            data: btoa(JSON.stringify(data)),
        });

        return `https://${this.connectionId}.${process.env.WEB_HOST}/em/${shopDrawingID}?${params.toString()}`;
    }
}

function buildBrandLogo(): string {
    return `<svg width="280" height="36" viewBox="0 0 280 36" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="8" width="3" height="20" rx="1.5" fill="#222222"/><text x="12" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="400" letter-spacing="1" fill="#8888a0">${TEXTS.POWERED_BY}</text><text x="100" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="3" fill="#222222">${TEXTS.BRAND_NAME}</text></svg>`;
}

function ensureButtonStyles(): void {
    if (document.getElementById(BUTTON_STYLES_ID)) {
        return;
    }

    const styleEl = document.createElement('style');

    styleEl.id = BUTTON_STYLES_ID;
    styleEl.textContent = BUTTON_CSS;
    document.head.appendChild(styleEl);
}

function buildButtonElement(options: DrawingButtonOptions, styled: boolean): HTMLButtonElement {
    const button = document.createElement('button');
    const label = resolveButtonText(options.text);

    const classNames = ['sde__button'];

    if (styled) {
        classNames.push('sde__button--entd');
    }

    if (options.className) {
        classNames.push(options.className);
    }

    button.type = 'button';
    button.className = classNames.join(' ');
    button.setAttribute('aria-label', `${label} (${TEXTS.BRAND_NAME})`);

    if (styled) {
        button.setAttribute('data-theme', options.theme || 'light');
        button.setAttribute('data-size', options.size || 'medium');
        button.setAttribute('data-shape', options.shape || 'rectangular');

        if (options.fullWidth) {
            button.setAttribute('data-width', 'full');
        }
    }

    const mark = options.logo === false
        ? ''
        : `<span class="sde__button-mark" aria-hidden="true"><span class="sde__button-bar"></span>${TEXTS.BRAND_NAME}</span>`;

    button.innerHTML = `${mark}<span class="sde__button-label">${escapeHtml(label)}</span>`;

    return button;
}

function resolveButtonText(text: DrawingButtonOptions['text']): string {
    if (!text) {
        return BUTTON_TEXTS.enter_draw;
    }

    return (BUTTON_TEXTS as Record<string, string>)[text] || text;
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildErrorBody(text: string): string {
    return `<div style="${STYLES.error}">${ERROR_ICON_SVG}<div style="${STYLES.errorText}">${text}</div></div>`;
}
