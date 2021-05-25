/*!
 * w-sync-webdata-client v1.0.8
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-client"]=e()}(this,(function(){"use strict";function t(t,e,r,n,o,i,u){try{var a=t[i](u),c=a.value}catch(t){return void r(t)}a.done?e(c):Promise.resolve(c).then(n,o)}function e(e){return function(){var r=this,n=arguments;return new Promise((function(o,i){var u=e.apply(r,n);function a(e){t(u,o,i,a,c,"next",e)}function c(e){t(u,o,i,a,c,"throw",e)}a(void 0)}))}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function o(t){var e={exports:{}};return t(e,e.exports),e.exports}var i=o((function(t){var e=function(t){var e,n=Object.prototype,o=n.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},u=i.iterator||"@@iterator",a=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(t){f=function(t,e,r){return t[e]=r}}function l(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),u=new S(n||[]);return i._invoke=function(t,e,r){var n=v;return function(o,i){if(n===h)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw i;return N()}for(r.method=o,r.arg=i;;){var u=r.delegate;if(u){var a=L(u,r);if(a){if(a===d)continue;return a}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===v)throw n=y,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var c=s(t,e,r);if("normal"===c.type){if(n=r.done?y:p,c.arg===d)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n=y,r.method="throw",r.arg=c.arg)}}}(t,r,u),i}function s(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=l;var v="suspendedStart",p="suspendedYield",h="executing",y="completed",d={};function g(){}function b(){}function m(){}var w={};w[u]=function(){return this};var j=Object.getPrototypeOf,x=j&&j(j(P([])));x&&x!==n&&o.call(x,u)&&(w=x);var O=m.prototype=g.prototype=Object.create(w);function T(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function _(t,e){function n(i,u,a,c){var f=s(t[i],t,u);if("throw"!==f.type){var l=f.arg,v=l.value;return v&&"object"===r(v)&&o.call(v,"__await")?e.resolve(v.__await).then((function(t){n("next",t,a,c)}),(function(t){n("throw",t,a,c)})):e.resolve(v).then((function(t){l.value=t,a(l)}),(function(t){return n("throw",t,a,c)}))}c(f.arg)}var i;this._invoke=function(t,r){function o(){return new e((function(e,o){n(t,r,e,o)}))}return i=i?i.then(o,o):o()}}function L(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,L(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=s(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function E(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function A(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(E,this),this.reset(!0)}function P(t){if(t){var r=t[u];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,i=function r(){for(;++n<t.length;)if(o.call(t,n))return r.value=t[n],r.done=!1,r;return r.value=e,r.done=!0,r};return i.next=i}}return{next:N}}function N(){return{value:e,done:!0}}return b.prototype=O.constructor=m,m.constructor=b,b.displayName=f(m,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===b||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,m):(t.__proto__=m,f(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return{__await:t}},T(_.prototype),_.prototype[a]=function(){return this},t.AsyncIterator=_,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var u=new _(l(e,r,n,o),i);return t.isGeneratorFunction(r)?u:u.next().then((function(t){return t.done?t.value:u.next()}))},T(O),f(O,c,"Generator"),O[u]=function(){return this},O.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=P,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(A),!t)for(var r in this)"t"===r.charAt(0)&&o.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return a.type="throw",a.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var u=this.tryEntries[i],a=u.completion;if("root"===u.tryLoc)return n("end");if(u.tryLoc<=this.prev){var c=o.call(u,"catchLoc"),f=o.call(u,"finallyLoc");if(c&&f){if(this.prev<u.catchLoc)return n(u.catchLoc,!0);if(this.prev<u.finallyLoc)return n(u.finallyLoc)}else if(c){if(this.prev<u.catchLoc)return n(u.catchLoc,!0)}else{if(!f)throw new Error("try statement without catch or finally");if(this.prev<u.finallyLoc)return n(u.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var i=n;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var u=i?i.completion:{};return u.type=t,u.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(u)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),A(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;A(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:P(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}}));var u=function(t,e){for(var r=-1,n=null==t?0:t.length;++r<n&&!1!==e(t[r],r,t););return t};var a=function(t){return function(e,r,n){for(var o=-1,i=Object(e),u=n(e),a=u.length;a--;){var c=u[t?a:++o];if(!1===r(i[c],c,i))break}return e}}();var c=function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n},f="object"==r(n)&&n&&n.Object===Object&&n,l="object"==("undefined"==typeof self?"undefined":r(self))&&self&&self.Object===Object&&self,s=f||l||Function("return this")(),v=s.Symbol,p=Object.prototype,h=p.hasOwnProperty,y=p.toString,d=v?v.toStringTag:void 0;var g=function(t){var e=h.call(t,d),r=t[d];try{t[d]=void 0;var n=!0}catch(t){}var o=y.call(t);return n&&(e?t[d]=r:delete t[d]),o},b=Object.prototype.toString;var m=function(t){return b.call(t)},w=v?v.toStringTag:void 0;var j=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":w&&w in Object(t)?g(t):m(t)};var x=function(t){return null!=t&&"object"==r(t)};var O=function(t){return x(t)&&"[object Arguments]"==j(t)},T=Object.prototype,_=T.hasOwnProperty,L=T.propertyIsEnumerable,E=O(function(){return arguments}())?O:function(t){return x(t)&&_.call(t,"callee")&&!L.call(t,"callee")},A=Array.isArray;var S=function(){return!1},P=o((function(t,e){var r=e&&!e.nodeType&&e,n=r&&t&&!t.nodeType&&t,o=n&&n.exports===r?s.Buffer:void 0,i=(o?o.isBuffer:void 0)||S;t.exports=i})),N=/^(?:0|[1-9]\d*)$/;var k=function(t,e){var n=r(t);return!!(e=null==e?9007199254740991:e)&&("number"==n||"symbol"!=n&&N.test(t))&&t>-1&&t%1==0&&t<e};var F=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991},I={};I["[object Float32Array]"]=I["[object Float64Array]"]=I["[object Int8Array]"]=I["[object Int16Array]"]=I["[object Int32Array]"]=I["[object Uint8Array]"]=I["[object Uint8ClampedArray]"]=I["[object Uint16Array]"]=I["[object Uint32Array]"]=!0,I["[object Arguments]"]=I["[object Array]"]=I["[object ArrayBuffer]"]=I["[object Boolean]"]=I["[object DataView]"]=I["[object Date]"]=I["[object Error]"]=I["[object Function]"]=I["[object Map]"]=I["[object Number]"]=I["[object Object]"]=I["[object RegExp]"]=I["[object Set]"]=I["[object String]"]=I["[object WeakMap]"]=!1;var G=function(t){return x(t)&&F(t.length)&&!!I[j(t)]};var C=function(t){return function(e){return t(e)}},B=o((function(t,e){var r=e&&!e.nodeType&&e,n=r&&t&&!t.nodeType&&t,o=n&&n.exports===r&&f.process,i=function(){try{var t=n&&n.require&&n.require("util").types;return t||o&&o.binding&&o.binding("util")}catch(t){}}();t.exports=i})),R=B&&B.isTypedArray,U=R?C(R):G,M=Object.prototype.hasOwnProperty;var $=function(t,e){var r=A(t),n=!r&&E(t),o=!r&&!n&&P(t),i=!r&&!n&&!o&&U(t),u=r||n||o||i,a=u?c(t.length,String):[],f=a.length;for(var l in t)!e&&!M.call(t,l)||u&&("length"==l||o&&("offset"==l||"parent"==l)||i&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||k(l,f))||a.push(l);return a},D=Object.prototype;var q=function(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||D)};var Y=function(t,e){return function(r){return t(e(r))}}(Object.keys,Object),V=Object.prototype.hasOwnProperty;var W=function(t){if(!q(t))return Y(t);var e=[];for(var r in Object(t))V.call(t,r)&&"constructor"!=r&&e.push(r);return e};var z=function(t){var e=r(t);return null!=t&&("object"==e||"function"==e)};var H=function(t){if(!z(t))return!1;var e=j(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e};var J=function(t){return null!=t&&F(t.length)&&!H(t)};var K=function(t){return J(t)?$(t):W(t)};var Q=function(t,e){return function(r,n){if(null==r)return r;if(!J(r))return t(r,n);for(var o=r.length,i=e?o:-1,u=Object(r);(e?i--:++i<o)&&!1!==n(u[i],i,u););return r}}((function(t,e){return t&&a(t,e,K)}));var X=function(t){return t};var Z=function(t){return"function"==typeof t?t:X};var tt=function(t,e){return(A(t)?u:Q)(t,Z(e))};function et(){var t,e,r=new Promise((function(){t=arguments[0],e=arguments[1]}));return r.resolve=t,r.reject=e,r}var rt=/\s/;var nt=function(t){for(var e=t.length;e--&&rt.test(t.charAt(e)););return e},ot=/^\s+/;var it=function(t){return t?t.slice(0,nt(t)+1).replace(ot,""):t};var ut=function(t){return"symbol"==r(t)||x(t)&&"[object Symbol]"==j(t)},at=/^[-+]0x[0-9a-f]+$/i,ct=/^0b[01]+$/i,ft=/^0o[0-7]+$/i,lt=parseInt;var st=function(t){if("number"==typeof t)return t;if(ut(t))return NaN;if(z(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=z(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=it(t);var r=ct.test(t);return r||ft.test(t)?lt(t.slice(2),r?2:8):at.test(t)?NaN:+t},vt=1/0;var pt=function(t){return t?(t=st(t))===vt||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var ht=function(t){var e=pt(t),r=e%1;return e==e?r?e-r:e:0};var yt=function(t,e){for(var r=-1,n=null==t?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o},dt=v?v.prototype:void 0,gt=dt?dt.toString:void 0;var bt=function t(e){if("string"==typeof e)return e;if(A(e))return yt(e,t)+"";if(ut(e))return gt?gt.call(e):"";var r=e+"";return"0"==r&&1/e==-Infinity?"-0":r};var mt=function(t){return null==t?"":bt(t)},wt=s.isFinite,jt=Math.min;var xt=function(t){var e=Math[t];return function(t,r){if(t=st(t),(r=null==r?0:jt(ht(r),292))&&wt(t)){var n=(mt(t)+"e").split("e"),o=e(n[0]+"e"+(+n[1]+r));return+((n=(mt(o)+"e").split("e"))[0]+"e"+(+n[1]-r))}return e(t)}}("round");function Ot(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Tt(t){var e=!1;return Ot(t)?e=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(e=!0),e}function _t(t){if(!Tt(t))return 0;t=function(t){return Tt(t)?pt(t):0}(t);var e=xt(t);return"0"===String(e)?0:e}var Lt=function(t){return mt(t).toLowerCase()};var Et=function(t,e,r){var n=-1,o=t.length;e<0&&(e=-e>o?0:o+e),(r=r>o?o:r)<0&&(r+=o),o=e>r?0:r-e>>>0,e>>>=0;for(var i=Array(o);++n<o;)i[n]=t[n+e];return i};var At=function(t,e,r){var n=t.length;return r=void 0===r?n:r,!e&&r>=n?t:Et(t,e,r)};var St=function(t,e,r,n){for(var o=t.length,i=r+(n?1:-1);n?i--:++i<o;)if(e(t[i],i,t))return i;return-1};var Pt=function(t){return t!=t};var Nt=function(t,e,r){for(var n=r-1,o=t.length;++n<o;)if(t[n]===e)return n;return-1};var kt=function(t,e,r){return e==e?Nt(t,e,r):St(t,Pt,r)};var Ft=function(t,e){for(var r=t.length;r--&&kt(e,t[r],0)>-1;);return r};var It=function(t,e){for(var r=-1,n=t.length;++r<n&&kt(e,t[r],0)>-1;);return r};var Gt=function(t){return t.split("")},Ct=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");var Bt=function(t){return Ct.test(t)},Rt="[\\ud800-\\udfff]",Ut="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",Mt="\\ud83c[\\udffb-\\udfff]",$t="[^\\ud800-\\udfff]",Dt="(?:\\ud83c[\\udde6-\\uddff]){2}",qt="[\\ud800-\\udbff][\\udc00-\\udfff]",Yt="(?:"+Ut+"|"+Mt+")"+"?",Vt="[\\ufe0e\\ufe0f]?",Wt=Vt+Yt+("(?:\\u200d(?:"+[$t,Dt,qt].join("|")+")"+Vt+Yt+")*"),zt="(?:"+[$t+Ut+"?",Ut,Dt,qt,Rt].join("|")+")",Ht=RegExp(Mt+"(?="+Mt+")|"+zt+Wt,"g");var Jt=function(t){return t.match(Ht)||[]};var Kt=function(t){return Bt(t)?Jt(t):Gt(t)};var Qt=function(t,e,r){if((t=mt(t))&&(r||void 0===e))return it(t);if(!t||!(e=bt(e)))return t;var n=Kt(t),o=Kt(e),i=It(n,o),u=Ft(n,o)+1;return At(n,i,u).join("")};var Xt=function(t){return!0===t||!1===t||x(t)&&"[object Boolean]"==j(t)};function Zt(t){if(function(t){return Xt(t)}(t))return t;if(0===t)return!1;if(1===t)return!0;var e=!1;return Ot(t)&&"true"===(t=Lt(Qt(t)))&&(e=!0),e}function te(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;Tt(t)||(t=10);var e=et();return setTimeout((function(){e.resolve()}),t),e}var ee=o((function(t){var e=Object.prototype.hasOwnProperty,r="~";function n(){}function o(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function i(t,e,n,i,u){if("function"!=typeof n)throw new TypeError("The listener must be a function");var a=new o(n,i||t,u),c=r?r+e:e;return t._events[c]?t._events[c].fn?t._events[c]=[t._events[c],a]:t._events[c].push(a):(t._events[c]=a,t._eventsCount++),t}function u(t,e){0==--t._eventsCount?t._events=new n:delete t._events[e]}function a(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),a.prototype.eventNames=function(){var t,n,o=[];if(0===this._eventsCount)return o;for(n in t=this._events)e.call(t,n)&&o.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(t)):o},a.prototype.listeners=function(t){var e=r?r+t:t,n=this._events[e];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,i=n.length,u=new Array(i);o<i;o++)u[o]=n[o].fn;return u},a.prototype.listenerCount=function(t){var e=r?r+t:t,n=this._events[e];return n?n.fn?1:n.length:0},a.prototype.emit=function(t,e,n,o,i,u){var a=r?r+t:t;if(!this._events[a])return!1;var c,f,l=this._events[a],s=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),s){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,n),!0;case 4:return l.fn.call(l.context,e,n,o),!0;case 5:return l.fn.call(l.context,e,n,o,i),!0;case 6:return l.fn.call(l.context,e,n,o,i,u),!0}for(f=1,c=new Array(s-1);f<s;f++)c[f-1]=arguments[f];l.fn.apply(l.context,c)}else{var v,p=l.length;for(f=0;f<p;f++)switch(l[f].once&&this.removeListener(t,l[f].fn,void 0,!0),s){case 1:l[f].fn.call(l[f].context);break;case 2:l[f].fn.call(l[f].context,e);break;case 3:l[f].fn.call(l[f].context,e,n);break;case 4:l[f].fn.call(l[f].context,e,n,o);break;default:if(!c)for(v=1,c=new Array(s-1);v<s;v++)c[v-1]=arguments[v];l[f].fn.apply(l[f].context,c)}}return!0},a.prototype.on=function(t,e,r){return i(this,t,e,r,!1)},a.prototype.once=function(t,e,r){return i(this,t,e,r,!0)},a.prototype.removeListener=function(t,e,n,o){var i=r?r+t:t;if(!this._events[i])return this;if(!e)return u(this,i),this;var a=this._events[i];if(a.fn)a.fn!==e||o&&!a.once||n&&a.context!==n||u(this,i);else{for(var c=0,f=[],l=a.length;c<l;c++)(a[c].fn!==e||o&&!a[c].once||n&&a[c].context!==n)&&f.push(a[c]);f.length?this._events[i]=1===f.length?f[0]:f:u(this,i)}return this},a.prototype.removeAllListeners=function(t){var e;return t?(e=r?r+t:t,this._events[e]&&u(this,e)):(this._events=new n,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=r,a.EventEmitter=a,t.exports=a}));function re(){return new ee}return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r={},n=!1;t.usePollingTableTags?t.usePollingTableTags=Zt(t.usePollingTableTags):t.usePollingTableTags=!1,t.pollingIntervalTime?t.pollingIntervalTime=_t(t.pollingIntervalTime):t.pollingIntervalTime=2e3;var o=new re;function u(t){for(var e=arguments.length,r=new Array(e>1?e-1:0),n=1;n<e;n++)r[n-1]=arguments[n];setTimeout((function(){o.emit.apply(o,[t].concat(r))}),1)}function a(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};r=t}function c(){return f.apply(this,arguments)}function f(){return(f=e(i.mark((function t(){var e,n,o=arguments;return i.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=o.length>0&&void 0!==o[0]?o[0]:{},n=[],tt(e,(function(t,e){if(r[e]!==t){var o=et(),i={tableName:e,timeTag:t,pm:o};n.push(o),u("refreshTable",i),o.then((function(n){r[e]=t,u("getData",{tableName:e,timeTag:t,data:n})})).catch((function(t){u("error",{msg:"can not get table data: "+e,err:t})}))}})),t.next=5,Promise.all(n);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function l(){return s.apply(this,arguments)}function s(){return(s=e(i.mark((function e(){var r,o;return i.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=2;break}return e.abrupt("return");case 2:return n=!0,u("refreshTags",{pm:r=et()}),e.next=7,r.catch((function(t){u("error",{msg:"can not get tags data",err:t})}));case 7:if(!(o=e.sent)){e.next=11;break}return e.next=11,c(o);case 11:return e.next=13,te(t.pollingIntervalTime);case 13:n=!1;case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return t.usePollingTableTags&&"undefined"!=typeof window&&window.addEventListener("mouseover",(function(t){l()}),!1),o.setTableTags=a,o.updateTableTags=c,o.pollingTableTags=l,o}}));
//# sourceMappingURL=w-sync-webdata-client.umd.js.map
