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

##### Build and publish:

###### Production

```
API_HOST=api.entd.tech WEB_HOST=entd.tech npx webpack build --mode production
npm publish
```

###### Staging

```
API_HOST=api.sentd.tech WEB_HOST=sentd.tech npx webpack build --mode production
```

###### Development

```
API_HOST=api.entd.tech:3004 WEB_HOST=entd.tech:3037 npx webpack build --mode production
```
