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
