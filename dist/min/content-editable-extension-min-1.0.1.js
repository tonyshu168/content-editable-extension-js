!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).CEExtension=t()}(this,(function(){"use strict";function e(e){var t,n=e.commonAncestorContainer,o=1,i=0;if(n===this.dom)return o;for(;(n=n.parentElement)&&!i;){"BODY"===n.nodeName?(o=(t=[0,1])[0],i=t[1]):n===this.dom&&(i=1)}return o}return function(){function t(e,t,n){if(void 0===t&&(t=0),void 0===n&&(n=function(){}),!e)throw Error("Params dom is not null");this.dom=e,this.associateHandleCb=n,this.setContentEditable(),t&&this.addChangeEvent()}return t.prototype.setContentEditable=function(){var e=this.dom,t=e.getAttribute("contenteditable"),n=getComputedStyle(e).border;t&&"false"!==t||e.setAttribute("contenteditable","true"),n&&"0px none rgb(0, 0, 0)"!==n||(e.style.border="1px solid #eee")},t.prototype.addChangeEvent=function(){var e=this;this.dom.addEventListener("input",(function(t){t.target.innerHTML;var n=window.getSelection(),o=function(e){var t={isNeed:0,inputStr:""},n=/@(\w|[\u4e00-\u9fa5])+$/;if(n.test(e)){t.isNeed=1;var o=n.exec(e)||[];t.inputStr=o[0]||""}return t}((null==n?void 0:n.getRangeAt(0)).commonAncestorContainer.textContent||"");console.log(o),e.associateHandleCb(o)}))},t.prototype.insert=function(n,o){if(o&&t.setCursorToLast(this.dom),window.getSelection){var i=window.getSelection(),r=i.getRangeAt(0);if(!e.call(this,r))return;if((null==i?void 0:i.getRangeAt)&&i.rangeCount){var l=document.createElement("div"),s=null;l.innerHTML=n;for(var a=document.createDocumentFragment(),d=void 0,c=void 0;d=l.firstChild;)c=a.appendChild(d);if(o){var u=r.commonAncestorContainer.childNodes,f=u.length;s=u[f-1];for(var g=f-1;g>=0;g--){var m=u[g],p=m.textContent;if(p&&p.includes("@")){var v=p.lastIndexOf("@");m.textContent=p.substring(0,v+1);break}}}s&&"DIV"===s.nodeName?s.appendChild(a):null==r||r.insertNode(a),c&&(null==(r=null==r?void 0:r.cloneRange())||r.setStartAfter(c),null==r||r.collapse(!0),i.removeAllRanges(),i.addRange(r))}else"Control"!==document.selection.type&&document.selection.createRange().pastHTML(n)}},t.setCursorToLast=function(e){if(!e)throw Error("Params dom is not null");if(window.getSelection){e.focus();var t=window.getSelection();null==t||t.selectAllChildren(e),null==t||t.collapseToEnd()}else if(document.selection){var n=document.selection.createRange();n.moveToElementText(e),n.collapse(!1),n.select()}},t.setPositionOfAssociateList=function(e,t){var n;if(!e)throw Error("Params associateList is not null");if(window.getSelection){var o=window.getSelection().getRangeAt(0).commonAncestorContainer,i=document.createRange();i.selectNodeContents(o);var r=t.getBoundingClientRect(),l=Object.prototype.hasOwnProperty.call(i,"getBoundingClientRect")?i.getBoundingClientRect():i.getClientRects()[0],s=(null===(n=o.textContent)||void 0===n?void 0:n.lastIndexOf("@"))||0;e.style.position="absolute",e.style.left=l.left-r.left+12*s+"px",e.style.top=l.top-r.top+20+"px"}},t.prototype.getValue=function(){return this.dom.innerHTML},t}()}));
