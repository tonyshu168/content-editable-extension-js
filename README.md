# content-editable-extension-js

Extend the content-editable-js to insert emoji images, common format images, and implement the @input association function.

* [Demo](https://tonyshu168.github.io/content-editable-extension-js/examples/index.html)
* [Getting started](#getting-started)
* [Documentation](#documentation)
* [Input the completion](#input-the-completion)
* [Contribute](#contribute)
* [Licence](#licence)

## Getting started

### Add the library
```html
<!-- With CDN -->
<script src="https://unpkg.com/content-editable-extension-js/dist/content-editable-extension-1.0.0.js"></script>
<!-- Locally -->
<script src="dist/content-editable-extension-1.0.0.js"></script>
```
### Installation
```bash
npm install content-editable-extension-js --save
```

### Usage
```html
<div class="div-text"></div>
<script src="https://unpkg.com/content-editable-extension-js/dist/content-editable-extension-1.0.0.js"></script>
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

#### static setPositionOfAssociateList()
The function `static setPositionOfAssociateList(associateList: HTMLElement, outermostEleForAssociateList: HTMLElement)` Sets the position of the association list.

#### getValue()
The function `getValue()` get element value.
```js
const value = ceExtension.getValue();
```

## Input the completion
Input '@ds', automatically associate 'dsewsd', 'dseewwe', 'dsios', etc. [You can watch the demo](https://tonyshu168.github.io/content-editable-extension-js/examples/index.html)

### Usage

* First you need to specify a parent container for the association list and set position to relative.
* The association list needs to be customized, And abbreviate the click event, and insert the current value when clicking.
* Entering' @sew' will trigger associations. At this time, you need to request the background interface to get the entered associations and render the association list.
* You need to call the CEExtension.SetPositionOfAssociateList() method to reposition the associative list.

```html
<!DOCTYPE html>
<html>
<head>
  <title>Div contenteditable</title>
  <meta charset="utf-8"/>
  <meta httP-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <style>
    * { box-sizing: border-box;}
    .container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      position:relative;
    }
    .div-text {
      width: 500px;
      height: 300px;
      overflow: hidden;
      border: 1px solid #eee;
      outline: blue;
    }
    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .auto-complete {
      display: none;
      min-width: 200px;
      border: solid 1px #eee;
      background: #fff;
    }
    .auto-complete:last-child {
      border-bottom: 0;
    }
    .auto-complete li {
      height: 40px;
      padding: 0px 10px;
      line-height: 40px;
      border-bottom: solid 1px #eee;
      cursor: pointer;
    }

  </style>
</head>
<body>
<div class="container">
  <div class="div-text"></div>
  <div>
    weasdfkalsdfjawefwwwe
    safsasfa
  </div>
  <!-- Auto-complete as you enter -->
  <ul class="auto-complete">
    <li>eweeewwwe</li>
    <li>uuiiius</li>
  </ul>
</div>

<script src="../dist/content-editable-extension-1.0.0.js"></script>
<script>
(function(){
  const textarea = document.getElementsByClassName('div-text')[0];
  const outermostEleForAssociateList = document.querySelector('.container');
  const autoCompleteContainer = document.getElementsByClassName('auto-complete')[0];
  const ceExtension = new CEExtension(textarea, 1, autoCompleteHandle);

  // Input associative callback processing
  function autoCompleteHandle(isNeedObj) {
    const timer = setTimeout(function() {
      const { isNeed, inputStr } = isNeedObj;
      let data = [];
      if ( isNeed ) {
        const res = httpGet(inputStr);
        const { status } = res;

        if ( status === 200 ) {
          data = res.data;
        }

        CEExtension.setPositionOfAssociateList(autoCompleteContainer, outermostEleForAssociateList);
      }
      let lis = ''
      data.forEach(function(value) {
        lis += `<li>${value}</li>`;
      });
      autoCompleteContainer.innerHTML = lis;
      const { display } = getComputedStyle(autoCompleteContainer);
      
      if ( display === 'none' ) {
        autoCompleteContainer.style.display = 'block';
      }
    }, 500);
  }

  // Mock HTTP requests (input associations)
  function httpGet(inputStr) {
    return {
      status: 200,
      data: inputStr ? ['eweeewwwe', 'uuiiius', 'ooowwwtt', 'ppssssewwe', 'ewxxsssekk'] : [],
      message: 'success'
    };
  }

  autoCompleteContainer.addEventListener('click', function(e) {
    const target = e.target || e.srcElement;
    const { tagName } = target;

    if ( tagName === 'LI' ) {
      const [value, isAssociate] = [target.innerHTML, 1]
      ceExtension.insert(`${value}&nbsp;`, isAssociate);
      autoCompleteContainer.style.display = 'none';
    }
  })
})()
</script>
</body>
</html>
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
