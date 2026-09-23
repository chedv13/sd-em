# ENTD Draw Button — Google Tag Manager template

Adds an [ENTD](https://entd.tech) draw button to any website through Google Tag Manager.
Visitors enter a shop drawing in the ENTD modal without leaving the page.

## Setup

1. In Google Tag Manager: **Tags → New → Tag Configuration → Discover more tag types in the Community Template Gallery**,
   search for **ENTD Draw Button** and add it.
   (Or: **Templates → Tag Templates → New → ⋮ → Import** and pick `template.tpl` from this repository.)
2. Fill in:
   - **Connection ID** — your shop identifier in ENTD.
   - **Drawing ID** — the drawing to open. Can be a variable (e.g. a Data Layer Variable per product page).
   - **Mode**
     - *Render the ENTD button into a container* — put an empty element on your page, e.g. `<div id="entd-draw"></div>`,
       and set **CSS selector** to `#entd-draw`.
     - *Open the modal on click of my own element* — set **CSS selector** to your own button or link.
   - **User ID** (optional) — ID of the logged-in user, usually a Data Layer Variable. When empty, the visitor either
     enters with an anonymous ID stored in the browser, or is sent to your **Login URL**.
3. Trigger: **Page View — DOM Ready** on the pages with the drawing. For single-page apps, also add a
   **History Change** trigger; containers that appear later are picked up automatically.
4. Preview, then Submit.

The tag loads `https://entd.tech/em/entd-gtm.js` (the ENTD embed library).

## Data sent to ENTD

`external_id` (User ID or `anon:<uuid>`), `source` (the Source field or the page hostname), the page URL,
and the fields from **Additional data**.

## License

Apache 2.0
