# content-editable-extension-js

Extend the content-editable-js to insert emoji images, common format images, and implement the @input association function.

* [Demo](https://tonyshu168.github.io/content-editable-extension-js/examples/index.html)
* [Getting started](#getting-started)
* [Documentation](#documentation)
* [Extend](#extend)
* [Contribute](#contribute)
* [Licence](#licence)

## Getting started

### Add the library
```html
<!-- With CDN -->
<script src="https://unpkg.com/content-editable-extension-js/dist/content-editable-extension.js"></script>
<!-- Locally -->
<script src="dist/content-editable-extension.js"></script>
```
### Installation
```bash
npm install content-editable-extension-js --save
```

### Usage
```html
<div class="div-text"></div>
<script src="https://unpkg.com/content-editable-extension-js/dist/content-editable-extension.js"></script>
<script>
const textarea = document.getElementsByClassName('div-text')[0];
const ceExtension = new CEExtension(
  textarea,                   // Set content-editable dom
  1,                          // Determine if you need to associate, default value 1
  autoCompleteHandle          // associate callback, default empty method
);

function autoCompleteHandle(isNeedObj) {
  // your logic
}
</script>
```

## Documentation

### Methods

#### insert()
The function `inset( htmlStr: string, isAssociate: boolean | number )` inserts content into the cursor in the current element
```js
const img = '<img src="./images/oip-c.jpg" alt="图片" />';
ceExtension.insert(img);
```

#### static setCursorToLast()
The function `CeExtension.setCursorToLast( dom: HTMLElement )` sets the rear side of the cursor positioning content.
```js
CEExtension.setCursorToLast( textarea );
```

#### getValue()
The function `getValue()` get element value.
```js
const value = ceExtension.getValue();
```

## Support

Content Editable is built for modern web browsers. Supports for IE.
For bugs and suggestions, [open an issue here](https://github.com/tonyshu168/content-editable-extension-js/issues).

## Contribute

Feel free to make a PR! Once cloned, use these commands:

```
npm install # or yarn install
npm run dev
npm run build # before commit 
```

## Licence

MIT
