### Official Sneakerdraws JS-library.

##### Example:

```ecmascript 6
const sneakerDrawsInstance = new SD('d9c7b289-e8ac-40da-92a3-18d0ca13c927');

sneakerDrawsInstance.init();
sneakerDrawsInstance.attachDrawingModal('.sd-draw-btn', '80fee286-888b-414a-b2b9-349b56c7c6c6');
```
##### Build and publish:
```
npx webpack build --mode production
npm publish
```
