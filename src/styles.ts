export const FONT_FAMILY = "system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue','Noto Sans','Liberation Sans',Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";

export const STYLES = {
    modal: 'background-color:white;display:flex;flex-flow:column;height:100vh;left:0;position:absolute;top:0;width:100%;z-index:2147483647;',
    header: `display:flex;align-items:center;flex-direction:row;justify-content:space-between;padding:16px;font-family:${FONT_FAMILY};border-bottom:1px solid #dadada;`,
    closeButton: 'cursor:pointer;height:16px;width:16px',
    body: 'display:flex;flex:1 1 auto;justify-content:center',
    iframe: 'border:none;width:100%;',
    error: `align-items:center;display:flex;flex-direction:column;justify-content:center;font-family:${FONT_FAMILY};padding:0 24px;`,
    errorText: 'font-size:18px;font-weight:600;margin-top:20px;text-align:center;line-height:1.6;',
};

export const BUTTON_STYLES_ID = 'sde__button-styles';

const BUTTON_DARK_VARS =
    '--sde-btn-bg:#131314;' +
    '--sde-btn-fg:#e3e3e3;' +
    '--sde-btn-border:#8e918f;' +
    '--sde-btn-hover-bg:#1f1f20;' +
    '--sde-btn-active-bg:#2a2a2b;' +
    '--sde-btn-ring:rgba(227,227,227,.35);';

// Stylesheet for the built-in drawing button. Injected into <head> once, only when `styled` is not false.
// Everything is scoped to `.sde__button--entd`, so a bare `.sde__button` (styled: false) is never touched.
// Colors are exposed as CSS custom properties so shops can tune them without replacing the whole stylesheet.
export const BUTTON_CSS =
    `.sde__button--entd{` +
    '--sde-btn-bg:#ffffff;' +
    '--sde-btn-fg:#1f1f1f;' +
    '--sde-btn-border:#747775;' +
    '--sde-btn-hover-bg:#f3f3f3;' +
    '--sde-btn-active-bg:#e8e8e8;' +
    '--sde-btn-ring:rgba(31,31,31,.25);' +
    'appearance:none;-webkit-appearance:none;box-sizing:border-box;' +
    'display:inline-flex;align-items:center;justify-content:center;' +
    'height:40px;margin:0;padding:0 14px;max-width:100%;' +
    'border:1px solid var(--sde-btn-border);border-radius:4px;' +
    'background:var(--sde-btn-bg);color:var(--sde-btn-fg);' +
    `font-family:${FONT_FAMILY};font-size:14px;font-weight:500;line-height:1;letter-spacing:.25px;` +
    'white-space:nowrap;text-decoration:none;cursor:pointer;user-select:none;-webkit-user-select:none;' +
    'transition:background-color .15s ease,box-shadow .15s ease;' +
    `}` +
    `.sde__button--entd:hover{background:var(--sde-btn-hover-bg);}` +
    `.sde__button--entd:active{background:var(--sde-btn-active-bg);}` +
    `.sde__button--entd:focus{outline:none;}` +
    `.sde__button--entd:focus-visible{box-shadow:0 0 0 3px var(--sde-btn-ring);}` +
    `.sde__button--entd[data-theme="dark"]{${BUTTON_DARK_VARS}}` +
    `@media (prefers-color-scheme:dark){.sde__button--entd[data-theme="auto"]{${BUTTON_DARK_VARS}}}` +
    `.sde__button--entd[data-shape="pill"]{border-radius:999px;}` +
    `.sde__button--entd[data-size="small"]{height:32px;padding:0 10px;font-size:12px;}` +
    `.sde__button--entd[data-size="large"]{height:48px;padding:0 18px;font-size:16px;}` +
    `.sde__button--entd[data-width="full"]{display:flex;width:100%;}` +
    `.sde__button--entd .sde__button-mark{display:inline-flex;align-items:center;font-weight:700;letter-spacing:.2em;margin-right:.55em;}` +
    `.sde__button--entd .sde__button-bar{display:block;width:.2em;height:1.15em;border-radius:.1em;background:currentColor;margin-right:.5em;}` +
    `.sde__button--entd .sde__button-label{font-weight:400;}`;
