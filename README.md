### Official ENTD JS-library.

##### Minimal example:

```ecmascript 6
const entdInstance = new ENTD(
    // Unique identifier of your shop in ENTD system.
    'd9c7b289-e8ac-40da-92a3-18d0ca13c927'
);

entdInstance.init();
entdInstance.attachDrawingModal(
    '.entd-draw-btn', // CSS selector of the element that will trigger the drawing modal.
    '80fee286-888b-414a-b2b9-349b56c7c6c6', // ID of shop drawing in ENTD system that will be used in the drawing modal.
    {
        // User ID in your system or any other unique identifier of the user.
        external_id: '1234567890',
        // Source of the drawing (e.g. name of the store, website, etc.).
        source: 'Test Store'
    }
);
```

##### Built-in drawing button:

Instead of styling your own trigger element, let the library render an ENTD-branded button
(similar to the Google Sign-In button). It is inserted into every element matching the selector
and opens the drawing modal on click.

```ecmascript 6
entdInstance.renderDrawingButton(
    '#entd-draw', // CSS selector of the container(s) the button will be rendered into.
    '80fee286-888b-414a-b2b9-349b56c7c6c6',
    {external_id: '1234567890', source: 'Test Store'},
    {
        theme: 'light',       // 'light' (default) | 'dark' | 'auto' (follows prefers-color-scheme)
        size: 'medium',       // 'small' | 'medium' (default) | 'large'
        shape: 'rectangular', // 'rectangular' (default) | 'pill'
        text: 'enter_draw',   // 'enter_draw' (default) | 'join_giveaway' | 'participate' | 'try_your_luck' | any custom string
        logo: true,           // show the ENTD mark before the text
        fullWidth: false,     // stretch to the container width
        className: '',        // extra class names for the <button>
    }
);
```

Colors of the built-in styles can be tuned via CSS custom properties on `.sde__button`:
`--sde-btn-bg`, `--sde-btn-fg`, `--sde-btn-border`, `--sde-btn-hover-bg`, `--sde-btn-active-bg`, `--sde-btn-ring`.

To use your own styles entirely, pass `styled: false`. The library will not inject any CSS, and the
button will be rendered as a bare `<button class="sde__button ...">` with `.sde__button-mark`
(ENTD wordmark, hidden with `logo: false`) and `.sde__button-label` (text) inside:

```ecmascript 6
entdInstance.renderDrawingButton('#entd-draw', shopDrawingID, data, {
    styled: false,
    className: 'my-shop-button',
    text: 'Участвовать в розыгрыше',
});
```

##### Build and publish:

###### Production

```
API_HOST=api.entd.tech WEB_HOST=entd.tech npm run build
npm publish
```

###### Staging

```
API_HOST=api.aientd.space WEB_HOST=aientd.space npm run build
```

###### Development

```
API_HOST=api.entd.tech:3004 WEB_HOST=entd.tech:3037 npm run build
```
