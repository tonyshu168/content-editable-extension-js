(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.CEExtension = factory());
})(this, (function () { 'use strict';

  /*
  * Is in content-editable dom
  * This needs to be bound
  */
  function isInEditableElement(range) {
      var _a;
      var commonAncestorContainer = range.commonAncestorContainer;
      var isIn = 1, isBreak = 0;
      if (commonAncestorContainer === this.dom) {
          return isIn;
      }
      while ((commonAncestorContainer = commonAncestorContainer.parentElement) && !isBreak) {
          var nodeName = commonAncestorContainer.nodeName;
          if (nodeName === 'BODY') {
              _a = [0, 1], isIn = _a[0], isBreak = _a[1];
          }
          else if (commonAncestorContainer === this.dom) {
              isBreak = 1;
          }
      }
      return isIn;
  }

  /*
  * Determine if you need to associate, exmple: @ewwe
  */
  function isNeedAssoicate(inputStr) {
      var obj = {
          isNeed: 0,
          inputStr: '',
      };
      var reg = /@(\w|[\u4e00-\u9fa5])+$/;
      if (reg.test(inputStr)) {
          obj.isNeed = 1;
          var matchStr = reg.exec(inputStr) || [];
          obj.inputStr = matchStr[0] || '';
      }
      return obj;
  }

  /*
  * @params dom: Set content-editable dom
  * @params isNeedAssociate: Determine if you need to associate
  * @params associateHandleCb: associate callback
  */
  var CEExtension = /** @class */ (function () {
      function CEExtension(dom, isNeedAssociate, associateHandleCb) {
          if (isNeedAssociate === void 0) { isNeedAssociate = 0; }
          if (associateHandleCb === void 0) { associateHandleCb = function () { }; }
          if (!dom) {
              throw Error('Params dom is not null');
          }
          this.dom = dom;
          this.associateHandleCb = associateHandleCb;
          this.setContentEditable();
          isNeedAssociate && this.addChangeEvent();
      }
      CEExtension.prototype.setContentEditable = function () {
          var dom = this.dom;
          var contenteditableValue = dom.getAttribute('contenteditable');
          if (!contenteditableValue || contenteditableValue === 'false') {
              dom.setAttribute('contenteditable', 'true');
          }
      };
      CEExtension.prototype.addChangeEvent = function () {
          var _this = this;
          var dom = this.dom;
          dom.addEventListener('input', function (e) {
              var target = e.target;
              var innerHTML = target.innerHTML;
              var isNeedObj = isNeedAssoicate(innerHTML);
              console.log(isNeedObj);
              // ??????
              _this.associateHandleCb(isNeedObj);
          });
      };
      /*
      * Params htmlStr: <img src="./img/oip-c.jpg" alt="??????" />
      * Params isAssociate: @ associate
      */
      CEExtension.prototype.insert = function (htmlStr, isAssociate) {
          if (isAssociate) {
              CEExtension.setCursorToLast(this.dom);
          }
          if (window.getSelection) {
              var selection = window.getSelection();
              var range = selection.getRangeAt(0);
              // If the selection is not inside the content-editable dom element, it is not processed
              if (!isInEditableElement.call(this, range)) {
                  return;
              }
              if ((selection === null || selection === void 0 ? void 0 : selection.getRangeAt) && selection.rangeCount) {
                  var el = document.createElement('div');
                  el.innerHTML = htmlStr;
                  var frag = document.createDocumentFragment();
                  var node = void 0, lastNode = void 0;
                  while (node = el.firstChild) {
                      lastNode = frag.appendChild(node);
                  }
                  // Deletes the '@esdss' characters entered
                  if (isAssociate) {
                      var childNodes = range.commonAncestorContainer.childNodes;
                      for (var i = childNodes.length - 1; i >= 0; i--) {
                          var element = childNodes[i];
                          var textContent = element.textContent;
                          if (textContent && textContent.includes('@')) {
                              var position = textContent.lastIndexOf('@');
                              element.textContent = textContent.substring(0, position + 1);
                              break;
                          }
                      }
                  }
                  range === null || range === void 0 ? void 0 : range.insertNode(frag);
                  if (lastNode) {
                      range = range === null || range === void 0 ? void 0 : range.cloneRange();
                      range === null || range === void 0 ? void 0 : range.setStartAfter(lastNode);
                      range === null || range === void 0 ? void 0 : range.collapse(true);
                      selection.removeAllRanges();
                      selection.addRange(range);
                  }
              }
              else if (document.selection.type !== 'Control') {
                  document.selection.createRange().pastHTML(htmlStr);
              }
          }
      };
      // Sets the rear side of the cursor positioning content.
      CEExtension.setCursorToLast = function (dom) {
          if (!dom) {
              throw Error('Params dom is not null');
          }
          if (window.getSelection) {
              dom.focus();
              var selection = window.getSelection();
              selection === null || selection === void 0 ? void 0 : selection.selectAllChildren(dom);
              selection === null || selection === void 0 ? void 0 : selection.collapseToEnd();
          }
          else if (document.selection) { // IE10 9 8 7 6 5
              var range = document.selection.createRange();
              range.moveToElementText(dom);
              range.collapse(false);
              range.select();
          }
      };
      CEExtension.prototype.getValue = function () {
          return this.dom.innerHTML;
      };
      return CEExtension;
  }());

  return CEExtension;

}));
//# sourceMappingURL=content-editable-extension-umd.js.map
