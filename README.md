### Official ENTD JS-library.

##### Example:

```ecmascript 6
const entdInstance = new ENTD('d9c7b289-e8ac-40da-92a3-18d0ca13c927');

entdInstance.init();
entdInstance.attachDrawingModal('.entd-draw-btn', '80fee286-888b-414a-b2b9-349b56c7c6c6');
```

##### Build and publish:

###### Production

```
API_HOST=api.entd.tech npx webpack build --mode production
npm publish
```

###### Staging

```
API_HOST=api.sentd.tech npx webpack build --mode development
```

###### Development

```
API_HOST=api.entd.tech:3037 npx webpack build --mode development
```
