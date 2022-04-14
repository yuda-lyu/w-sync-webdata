/*!
 * w-sync-webdata-client v1.0.17
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r():"function"==typeof define&&define.amd?define(r):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-client"]=r()}(this,(function(){"use strict";function t(t,r,e,n,o,a,i){try{var u=t[a](i),c=u.value}catch(t){return void e(t)}u.done?r(c):Promise.resolve(c).then(n,o)}function r(r){return function(){var e=this,n=arguments;return new Promise((function(o,a){var i=r.apply(e,n);function u(r){t(i,o,a,u,c,"next",r)}function c(r){t(i,o,a,u,c,"throw",r)}u(void 0)}))}}function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function o(t){var r={exports:{}};return t(r,r.exports),r.exports}var a=o((function(t){var r=function(t){var r,n=Object.prototype,o=n.hasOwnProperty,a="function"==typeof Symbol?Symbol:{},i=a.iterator||"@@iterator",u=a.asyncIterator||"@@asyncIterator",c=a.toStringTag||"@@toStringTag";function f(t,r,e){return Object.defineProperty(t,r,{value:e,enumerable:!0,configurable:!0,writable:!0}),t[r]}try{f({},"")}catch(t){f=function(t,r,e){return t[r]=e}}function s(t,r,e,n){var o=r&&r.prototype instanceof d?r:d,a=Object.create(o.prototype),i=new L(n||[]);return a._invoke=function(t,r,e){var n=v;return function(o,a){if(n===h)throw new Error("Generator is already running");if(n===y){if("throw"===o)throw a;return k()}for(e.method=o,e.arg=a;;){var i=e.delegate;if(i){var u=A(i,e);if(u){if(u===b)continue;return u}}if("next"===e.method)e.sent=e._sent=e.arg;else if("throw"===e.method){if(n===v)throw n=y,e.arg;e.dispatchException(e.arg)}else"return"===e.method&&e.abrupt("return",e.arg);n=h;var c=l(t,r,e);if("normal"===c.type){if(n=e.done?y:p,c.arg===b)continue;return{value:c.arg,done:e.done}}"throw"===c.type&&(n=y,e.method="throw",e.arg=c.arg)}}}(t,e,i),a}function l(t,r,e){try{return{type:"normal",arg:t.call(r,e)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var v="suspendedStart",p="suspendedYield",h="executing",y="completed",b={};function d(){}function g(){}function j(){}var _={};f(_,i,(function(){return this}));var w=Object.getPrototypeOf,m=w&&w(w(P([])));m&&m!==n&&o.call(m,i)&&(_=m);var O=j.prototype=d.prototype=Object.create(_);function x(t){["next","throw","return"].forEach((function(r){f(t,r,(function(t){return this._invoke(r,t)}))}))}function T(t,r){function n(a,i,u,c){var f=l(t[a],t,i);if("throw"!==f.type){var s=f.arg,v=s.value;return v&&"object"===e(v)&&o.call(v,"__await")?r.resolve(v.__await).then((function(t){n("next",t,u,c)}),(function(t){n("throw",t,u,c)})):r.resolve(v).then((function(t){s.value=t,u(s)}),(function(t){return n("throw",t,u,c)}))}c(f.arg)}var a;this._invoke=function(t,e){function o(){return new r((function(r,o){n(t,e,r,o)}))}return a=a?a.then(o,o):o()}}function A(t,e){var n=t.iterator[e.method];if(n===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=r,A(t,e),"throw"===e.method))return b;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return b}var o=l(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,b;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=r),e.delegate=null,b):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,b)}function S(t){var r={tryLoc:t[0]};1 in t&&(r.catchLoc=t[1]),2 in t&&(r.finallyLoc=t[2],r.afterLoc=t[3]),this.tryEntries.push(r)}function E(t){var r=t.completion||{};r.type="normal",delete r.arg,t.completion=r}function L(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(S,this),this.reset(!0)}function P(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,a=function e(){for(;++n<t.length;)if(o.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=r,e.done=!0,e};return a.next=a}}return{next:k}}function k(){return{value:r,done:!0}}return g.prototype=j,f(O,"constructor",j),f(j,"constructor",g),g.displayName=f(j,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var r="function"==typeof t&&t.constructor;return!!r&&(r===g||"GeneratorFunction"===(r.displayName||r.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,j):(t.__proto__=j,f(t,c,"GeneratorFunction")),t.prototype=Object.create(O),t},t.awrap=function(t){return{__await:t}},x(T.prototype),f(T.prototype,u,(function(){return this})),t.AsyncIterator=T,t.async=function(r,e,n,o,a){void 0===a&&(a=Promise);var i=new T(s(r,e,n,o),a);return t.isGeneratorFunction(e)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},x(O),f(O,c,"Generator"),f(O,i,(function(){return this})),f(O,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var r=[];for(var e in t)r.push(e);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},t.values=P,L.prototype={constructor:L,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=r,this.done=!1,this.delegate=null,this.method="next",this.arg=r,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&o.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=r)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(n,o){return u.type="throw",u.arg=t,e.next=n,o&&(e.method="next",e.arg=r),!!o}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],u=i.completion;if("root"===i.tryLoc)return n("end");if(i.tryLoc<=this.prev){var c=o.call(i,"catchLoc"),f=o.call(i,"finallyLoc");if(c&&f){if(this.prev<i.catchLoc)return n(i.catchLoc,!0);if(this.prev<i.finallyLoc)return n(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return n(i.catchLoc,!0)}else{if(!f)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return n(i.finallyLoc)}}}},abrupt:function(t,r){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc<=this.prev&&o.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var a=n;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=r&&r<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=r,a?(this.method="next",this.next=a.finallyLoc,b):this.complete(i)},complete:function(t,r){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&r&&(this.next=r),b},finish:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.finallyLoc===t)return this.complete(e.completion,e.afterLoc),E(e),b}},catch:function(t){for(var r=this.tryEntries.length-1;r>=0;--r){var e=this.tryEntries[r];if(e.tryLoc===t){var n=e.completion;if("throw"===n.type){var o=n.arg;E(e)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:P(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=r),b}},t}(t.exports);try{regeneratorRuntime=r}catch(t){"object"===("undefined"==typeof globalThis?"undefined":e(globalThis))?globalThis.regeneratorRuntime=r:Function("r","regeneratorRuntime = r")(r)}})),i=a;var u=function(t,r){for(var e=-1,n=null==t?0:t.length;++e<n&&!1!==r(t[e],e,t););return t};var c=function(t){return function(r,e,n){for(var o=-1,a=Object(r),i=n(r),u=i.length;u--;){var c=i[t?u:++o];if(!1===e(a[c],c,a))break}return r}}();var f=function(t,r){for(var e=-1,n=Array(t);++e<t;)n[e]=r(e);return n},s="object"==e(n)&&n&&n.Object===Object&&n,l="object"==("undefined"==typeof self?"undefined":e(self))&&self&&self.Object===Object&&self,v=s||l||Function("return this")(),p=v.Symbol,h=Object.prototype,y=h.hasOwnProperty,b=h.toString,d=p?p.toStringTag:void 0;var g=function(t){var r=y.call(t,d),e=t[d];try{t[d]=void 0;var n=!0}catch(t){}var o=b.call(t);return n&&(r?t[d]=e:delete t[d]),o},j=Object.prototype.toString;var _=function(t){return j.call(t)},w=p?p.toStringTag:void 0;var m=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":w&&w in Object(t)?g(t):_(t)};var O=function(t){return null!=t&&"object"==e(t)};var x=function(t){return O(t)&&"[object Arguments]"==m(t)},T=Object.prototype,A=T.hasOwnProperty,S=T.propertyIsEnumerable,E=x(function(){return arguments}())?x:function(t){return O(t)&&A.call(t,"callee")&&!S.call(t,"callee")},L=E,P=Array.isArray;var k=function(){return!1},I=o((function(t,r){var e=r&&!r.nodeType&&r,n=e&&t&&!t.nodeType&&t,o=n&&n.exports===e?v.Buffer:void 0,a=(o?o.isBuffer:void 0)||k;t.exports=a})),N=/^(?:0|[1-9]\d*)$/;var F=function(t,r){var n=e(t);return!!(r=null==r?9007199254740991:r)&&("number"==n||"symbol"!=n&&N.test(t))&&t>-1&&t%1==0&&t<r};var z=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991},U={};U["[object Float32Array]"]=U["[object Float64Array]"]=U["[object Int8Array]"]=U["[object Int16Array]"]=U["[object Int32Array]"]=U["[object Uint8Array]"]=U["[object Uint8ClampedArray]"]=U["[object Uint16Array]"]=U["[object Uint32Array]"]=!0,U["[object Arguments]"]=U["[object Array]"]=U["[object ArrayBuffer]"]=U["[object Boolean]"]=U["[object DataView]"]=U["[object Date]"]=U["[object Error]"]=U["[object Function]"]=U["[object Map]"]=U["[object Number]"]=U["[object Object]"]=U["[object RegExp]"]=U["[object Set]"]=U["[object String]"]=U["[object WeakMap]"]=!1;var M=function(t){return O(t)&&z(t.length)&&!!U[m(t)]};var B=function(t){return function(r){return t(r)}},C=o((function(t,r){var e=r&&!r.nodeType&&r,n=e&&t&&!t.nodeType&&t,o=n&&n.exports===e&&s.process,a=function(){try{var t=n&&n.require&&n.require("util").types;return t||o&&o.binding&&o.binding("util")}catch(t){}}();t.exports=a})),R=C&&C.isTypedArray,$=R?B(R):M,G=Object.prototype.hasOwnProperty;var D=function(t,r){var e=P(t),n=!e&&L(t),o=!e&&!n&&I(t),a=!e&&!n&&!o&&$(t),i=e||n||o||a,u=i?f(t.length,String):[],c=u.length;for(var s in t)!r&&!G.call(t,s)||i&&("length"==s||o&&("offset"==s||"parent"==s)||a&&("buffer"==s||"byteLength"==s||"byteOffset"==s)||F(s,c))||u.push(s);return u},V=Object.prototype;var W=function(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||V)};var q=function(t,r){return function(e){return t(r(e))}},Y=q(Object.keys,Object),H=Object.prototype.hasOwnProperty;var J=function(t){if(!W(t))return Y(t);var r=[];for(var e in Object(t))H.call(t,e)&&"constructor"!=e&&r.push(e);return r};var K=function(t){var r=e(t);return null!=t&&("object"==r||"function"==r)};var Q=function(t){if(!K(t))return!1;var r=m(t);return"[object Function]"==r||"[object GeneratorFunction]"==r||"[object AsyncFunction]"==r||"[object Proxy]"==r};var X=function(t){return null!=t&&z(t.length)&&!Q(t)};var Z=function(t){return X(t)?D(t):J(t)};var tt=function(t,r){return function(e,n){if(null==e)return e;if(!X(e))return t(e,n);for(var o=e.length,a=r?o:-1,i=Object(e);(r?a--:++a<o)&&!1!==n(i[a],a,i););return e}}((function(t,r){return t&&c(t,r,Z)}));var rt=function(t){return t};var et=function(t){return"function"==typeof t?t:rt};var nt=function(t,r){return(P(t)?u:tt)(t,et(r))};var ot=function(){this.__data__=[],this.size=0};var at=function(t,r){return t===r||t!=t&&r!=r};var it=function(t,r){for(var e=t.length;e--;)if(at(t[e][0],r))return e;return-1},ut=Array.prototype.splice;var ct=function(t){var r=this.__data__,e=it(r,t);return!(e<0)&&(e==r.length-1?r.pop():ut.call(r,e,1),--this.size,!0)};var ft=function(t){var r=this.__data__,e=it(r,t);return e<0?void 0:r[e][1]};var st=function(t){return it(this.__data__,t)>-1};var lt=function(t,r){var e=this.__data__,n=it(e,t);return n<0?(++this.size,e.push([t,r])):e[n][1]=r,this};function vt(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}vt.prototype.clear=ot,vt.prototype.delete=ct,vt.prototype.get=ft,vt.prototype.has=st,vt.prototype.set=lt;var pt=vt;var ht=function(){this.__data__=new pt,this.size=0};var yt=function(t){var r=this.__data__,e=r.delete(t);return this.size=r.size,e};var bt=function(t){return this.__data__.get(t)};var dt,gt=function(t){return this.__data__.has(t)},jt=v["__core-js_shared__"],_t=(dt=/[^.]+$/.exec(jt&&jt.keys&&jt.keys.IE_PROTO||""))?"Symbol(src)_1."+dt:"";var wt=function(t){return!!_t&&_t in t},mt=Function.prototype.toString;var Ot=function(t){if(null!=t){try{return mt.call(t)}catch(t){}try{return t+""}catch(t){}}return""},xt=/^\[object .+?Constructor\]$/,Tt=Function.prototype,At=Object.prototype,St=Tt.toString,Et=At.hasOwnProperty,Lt=RegExp("^"+St.call(Et).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var Pt=function(t){return!(!K(t)||wt(t))&&(Q(t)?Lt:xt).test(Ot(t))};var kt=function(t,r){return null==t?void 0:t[r]};var It=function(t,r){var e=kt(t,r);return Pt(e)?e:void 0},Nt=It(v,"Map"),Ft=It(Object,"create");var zt=function(){this.__data__=Ft?Ft(null):{},this.size=0};var Ut=function(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r},Mt=Object.prototype.hasOwnProperty;var Bt=function(t){var r=this.__data__;if(Ft){var e=r[t];return"__lodash_hash_undefined__"===e?void 0:e}return Mt.call(r,t)?r[t]:void 0},Ct=Object.prototype.hasOwnProperty;var Rt=function(t){var r=this.__data__;return Ft?void 0!==r[t]:Ct.call(r,t)};var $t=function(t,r){var e=this.__data__;return this.size+=this.has(t)?0:1,e[t]=Ft&&void 0===r?"__lodash_hash_undefined__":r,this};function Gt(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}Gt.prototype.clear=zt,Gt.prototype.delete=Ut,Gt.prototype.get=Bt,Gt.prototype.has=Rt,Gt.prototype.set=$t;var Dt=Gt;var Vt=function(){this.size=0,this.__data__={hash:new Dt,map:new(Nt||pt),string:new Dt}};var Wt=function(t){var r=e(t);return"string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==t:null===t};var qt=function(t,r){var e=t.__data__;return Wt(r)?e["string"==typeof r?"string":"hash"]:e.map};var Yt=function(t){var r=qt(this,t).delete(t);return this.size-=r?1:0,r};var Ht=function(t){return qt(this,t).get(t)};var Jt=function(t){return qt(this,t).has(t)};var Kt=function(t,r){var e=qt(this,t),n=e.size;return e.set(t,r),this.size+=e.size==n?0:1,this};function Qt(t){var r=-1,e=null==t?0:t.length;for(this.clear();++r<e;){var n=t[r];this.set(n[0],n[1])}}Qt.prototype.clear=Vt,Qt.prototype.delete=Yt,Qt.prototype.get=Ht,Qt.prototype.has=Jt,Qt.prototype.set=Kt;var Xt=Qt;var Zt=function(t,r){var e=this.__data__;if(e instanceof pt){var n=e.__data__;if(!Nt||n.length<199)return n.push([t,r]),this.size=++e.size,this;e=this.__data__=new Xt(n)}return e.set(t,r),this.size=e.size,this};function tr(t){var r=this.__data__=new pt(t);this.size=r.size}tr.prototype.clear=ht,tr.prototype.delete=yt,tr.prototype.get=bt,tr.prototype.has=gt,tr.prototype.set=Zt;var rr=tr,er=function(){try{var t=It(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var nr=function(t,r,e){"__proto__"==r&&er?er(t,r,{configurable:!0,enumerable:!0,value:e,writable:!0}):t[r]=e},or=Object.prototype.hasOwnProperty;var ar=function(t,r,e){var n=t[r];or.call(t,r)&&at(n,e)&&(void 0!==e||r in t)||nr(t,r,e)};var ir=function(t,r,e,n){var o=!e;e||(e={});for(var a=-1,i=r.length;++a<i;){var u=r[a],c=n?n(e[u],t[u],u,e,t):void 0;void 0===c&&(c=t[u]),o?nr(e,u,c):ar(e,u,c)}return e};var ur=function(t,r){return t&&ir(r,Z(r),t)};var cr=function(t){var r=[];if(null!=t)for(var e in Object(t))r.push(e);return r},fr=Object.prototype.hasOwnProperty;var sr=function(t){if(!K(t))return cr(t);var r=W(t),e=[];for(var n in t)("constructor"!=n||!r&&fr.call(t,n))&&e.push(n);return e};var lr=function(t){return X(t)?D(t,!0):sr(t)};var vr=function(t,r){return t&&ir(r,lr(r),t)},pr=o((function(t,r){var e=r&&!r.nodeType&&r,n=e&&t&&!t.nodeType&&t,o=n&&n.exports===e?v.Buffer:void 0,a=o?o.allocUnsafe:void 0;t.exports=function(t,r){if(r)return t.slice();var e=t.length,n=a?a(e):new t.constructor(e);return t.copy(n),n}}));var hr=function(t,r){var e=-1,n=t.length;for(r||(r=Array(n));++e<n;)r[e]=t[e];return r};var yr=function(t,r){for(var e=-1,n=null==t?0:t.length,o=0,a=[];++e<n;){var i=t[e];r(i,e,t)&&(a[o++]=i)}return a};var br=function(){return[]},dr=Object.prototype.propertyIsEnumerable,gr=Object.getOwnPropertySymbols,jr=gr?function(t){return null==t?[]:(t=Object(t),yr(gr(t),(function(r){return dr.call(t,r)})))}:br;var _r=function(t,r){return ir(t,jr(t),r)};var wr=function(t,r){for(var e=-1,n=r.length,o=t.length;++e<n;)t[o+e]=r[e];return t},mr=q(Object.getPrototypeOf,Object),Or=Object.getOwnPropertySymbols?function(t){for(var r=[];t;)wr(r,jr(t)),t=mr(t);return r}:br;var xr=function(t,r){return ir(t,Or(t),r)};var Tr=function(t,r,e){var n=r(t);return P(t)?n:wr(n,e(t))};var Ar=function(t){return Tr(t,Z,jr)};var Sr=function(t){return Tr(t,lr,Or)},Er=It(v,"DataView"),Lr=It(v,"Promise"),Pr=It(v,"Set"),kr=It(v,"WeakMap"),Ir="[object Map]",Nr="[object Promise]",Fr="[object Set]",zr="[object WeakMap]",Ur="[object DataView]",Mr=Ot(Er),Br=Ot(Nt),Cr=Ot(Lr),Rr=Ot(Pr),$r=Ot(kr),Gr=m;(Er&&Gr(new Er(new ArrayBuffer(1)))!=Ur||Nt&&Gr(new Nt)!=Ir||Lr&&Gr(Lr.resolve())!=Nr||Pr&&Gr(new Pr)!=Fr||kr&&Gr(new kr)!=zr)&&(Gr=function(t){var r=m(t),e="[object Object]"==r?t.constructor:void 0,n=e?Ot(e):"";if(n)switch(n){case Mr:return Ur;case Br:return Ir;case Cr:return Nr;case Rr:return Fr;case $r:return zr}return r});var Dr=Gr,Vr=Object.prototype.hasOwnProperty;var Wr=function(t){var r=t.length,e=new t.constructor(r);return r&&"string"==typeof t[0]&&Vr.call(t,"index")&&(e.index=t.index,e.input=t.input),e},qr=v.Uint8Array;var Yr=function(t){var r=new t.constructor(t.byteLength);return new qr(r).set(new qr(t)),r};var Hr=function(t,r){var e=r?Yr(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.byteLength)},Jr=/\w*$/;var Kr=function(t){var r=new t.constructor(t.source,Jr.exec(t));return r.lastIndex=t.lastIndex,r},Qr=p?p.prototype:void 0,Xr=Qr?Qr.valueOf:void 0;var Zr=function(t){return Xr?Object(Xr.call(t)):{}};var te=function(t,r){var e=r?Yr(t.buffer):t.buffer;return new t.constructor(e,t.byteOffset,t.length)};var re=function(t,r,e){var n=t.constructor;switch(r){case"[object ArrayBuffer]":return Yr(t);case"[object Boolean]":case"[object Date]":return new n(+t);case"[object DataView]":return Hr(t,e);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return te(t,e);case"[object Map]":case"[object Set]":return new n;case"[object Number]":case"[object String]":return new n(t);case"[object RegExp]":return Kr(t);case"[object Symbol]":return Zr(t)}},ee=Object.create,ne=function(){function t(){}return function(r){if(!K(r))return{};if(ee)return ee(r);t.prototype=r;var e=new t;return t.prototype=void 0,e}}();var oe=function(t){return"function"!=typeof t.constructor||W(t)?{}:ne(mr(t))};var ae=function(t){return O(t)&&"[object Map]"==Dr(t)},ie=C&&C.isMap,ue=ie?B(ie):ae;var ce=function(t){return O(t)&&"[object Set]"==Dr(t)},fe=C&&C.isSet,se=fe?B(fe):ce,le="[object Arguments]",ve="[object Function]",pe="[object Object]",he={};he[le]=he["[object Array]"]=he["[object ArrayBuffer]"]=he["[object DataView]"]=he["[object Boolean]"]=he["[object Date]"]=he["[object Float32Array]"]=he["[object Float64Array]"]=he["[object Int8Array]"]=he["[object Int16Array]"]=he["[object Int32Array]"]=he["[object Map]"]=he["[object Number]"]=he[pe]=he["[object RegExp]"]=he["[object Set]"]=he["[object String]"]=he["[object Symbol]"]=he["[object Uint8Array]"]=he["[object Uint8ClampedArray]"]=he["[object Uint16Array]"]=he["[object Uint32Array]"]=!0,he["[object Error]"]=he[ve]=he["[object WeakMap]"]=!1;var ye=function t(r,e,n,o,a,i){var c,f=1&e,s=2&e,l=4&e;if(n&&(c=a?n(r,o,a,i):n(r)),void 0!==c)return c;if(!K(r))return r;var v=P(r);if(v){if(c=Wr(r),!f)return hr(r,c)}else{var p=Dr(r),h=p==ve||"[object GeneratorFunction]"==p;if(I(r))return pr(r,f);if(p==pe||p==le||h&&!a){if(c=s||h?{}:oe(r),!f)return s?xr(r,vr(c,r)):_r(r,ur(c,r))}else{if(!he[p])return a?r:{};c=re(r,p,f)}}i||(i=new rr);var y=i.get(r);if(y)return y;i.set(r,c),se(r)?r.forEach((function(o){c.add(t(o,e,n,o,r,i))})):ue(r)&&r.forEach((function(o,a){c.set(a,t(o,e,n,a,r,i))}));var b=v?void 0:(l?s?Sr:Ar:s?lr:Z)(r);return u(b||r,(function(o,a){b&&(o=r[a=o]),ar(c,a,t(o,e,n,a,r,i))})),c};var be=function(t){return ye(t,5)};function de(){var t,r,e=new Promise((function(){t=arguments[0],r=arguments[1]}));return e.resolve=t,e.reject=r,e}var ge=/\s/;var je=function(t){for(var r=t.length;r--&&ge.test(t.charAt(r)););return r},_e=/^\s+/;var we=function(t){return t?t.slice(0,je(t)+1).replace(_e,""):t};var me=function(t){return"symbol"==e(t)||O(t)&&"[object Symbol]"==m(t)},Oe=/^[-+]0x[0-9a-f]+$/i,xe=/^0b[01]+$/i,Te=/^0o[0-7]+$/i,Ae=parseInt;var Se=function(t){if("number"==typeof t)return t;if(me(t))return NaN;if(K(t)){var r="function"==typeof t.valueOf?t.valueOf():t;t=K(r)?r+"":r}if("string"!=typeof t)return 0===t?t:+t;t=we(t);var e=xe.test(t);return e||Te.test(t)?Ae(t.slice(2),e?2:8):Oe.test(t)?NaN:+t},Ee=1/0;var Le=function(t){return t?(t=Se(t))===Ee||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var Pe=function(t){var r=Le(t),e=r%1;return r==r?e?r-e:r:0};var ke=function(t,r){for(var e=-1,n=null==t?0:t.length,o=Array(n);++e<n;)o[e]=r(t[e],e,t);return o},Ie=p?p.prototype:void 0,Ne=Ie?Ie.toString:void 0;var Fe=function t(r){if("string"==typeof r)return r;if(P(r))return ke(r,t)+"";if(me(r))return Ne?Ne.call(r):"";var e=r+"";return"0"==e&&1/r==-Infinity?"-0":e};var ze=function(t){return null==t?"":Fe(t)},Ue=v.isFinite,Me=Math.min;var Be=function(t){var r=Math[t];return function(t,e){if(t=Se(t),(e=null==e?0:Me(Pe(e),292))&&Ue(t)){var n=(ze(t)+"e").split("e"),o=r(n[0]+"e"+(+n[1]+e));return+((n=(ze(o)+"e").split("e"))[0]+"e"+(+n[1]-e))}return r(t)}}("round");function Ce(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Re(t){var r=!1;return Ce(t)?r=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(r=!0),r}function $e(t){if(!Re(t))return 0;t=function(t){return Re(t)?Le(t):0}(t);var r=Be(t);return"0"===String(r)?0:r}var Ge=function(t){return ze(t).toLowerCase()};var De=function(t,r,e){var n=-1,o=t.length;r<0&&(r=-r>o?0:o+r),(e=e>o?o:e)<0&&(e+=o),o=r>e?0:e-r>>>0,r>>>=0;for(var a=Array(o);++n<o;)a[n]=t[n+r];return a};var Ve=function(t,r,e){var n=t.length;return e=void 0===e?n:e,!r&&e>=n?t:De(t,r,e)};var We=function(t,r,e,n){for(var o=t.length,a=e+(n?1:-1);n?a--:++a<o;)if(r(t[a],a,t))return a;return-1};var qe=function(t){return t!=t};var Ye=function(t,r,e){for(var n=e-1,o=t.length;++n<o;)if(t[n]===r)return n;return-1};var He=function(t,r,e){return r==r?Ye(t,r,e):We(t,qe,e)};var Je=function(t,r){for(var e=t.length;e--&&He(r,t[e],0)>-1;);return e};var Ke=function(t,r){for(var e=-1,n=t.length;++e<n&&He(r,t[e],0)>-1;);return e};var Qe=function(t){return t.split("")},Xe=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]");var Ze=function(t){return Xe.test(t)},tn="[\\ud800-\\udfff]",rn="[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]",en="\\ud83c[\\udffb-\\udfff]",nn="[^\\ud800-\\udfff]",on="(?:\\ud83c[\\udde6-\\uddff]){2}",an="[\\ud800-\\udbff][\\udc00-\\udfff]",un="(?:"+rn+"|"+en+")"+"?",cn="[\\ufe0e\\ufe0f]?",fn=cn+un+("(?:\\u200d(?:"+[nn,on,an].join("|")+")"+cn+un+")*"),sn="(?:"+[nn+rn+"?",rn,on,an,tn].join("|")+")",ln=RegExp(en+"(?="+en+")|"+sn+fn,"g");var vn=function(t){return t.match(ln)||[]};var pn=function(t){return Ze(t)?vn(t):Qe(t)};var hn=function(t,r,e){if((t=ze(t))&&(e||void 0===r))return we(t);if(!t||!(r=Fe(r)))return t;var n=pn(t),o=pn(r),a=Ke(n,o),i=Je(n,o)+1;return Ve(n,a,i).join("")};var yn=function(t){return!0===t||!1===t||O(t)&&"[object Boolean]"==m(t)};function bn(t){if(function(t){return yn(t)}(t))return t;if(0===t)return!1;if(1===t)return!0;var r=!1;return Ce(t)&&"true"===(t=Ge(hn(t)))&&(r=!0),r}function dn(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;Re(t)||(t=10);var r=de();return setTimeout((function(){r.resolve()}),t),r}var gn=o((function(t){var r=Object.prototype.hasOwnProperty,e="~";function n(){}function o(t,r,e){this.fn=t,this.context=r,this.once=e||!1}function a(t,r,n,a,i){if("function"!=typeof n)throw new TypeError("The listener must be a function");var u=new o(n,a||t,i),c=e?e+r:r;return t._events[c]?t._events[c].fn?t._events[c]=[t._events[c],u]:t._events[c].push(u):(t._events[c]=u,t._eventsCount++),t}function i(t,r){0==--t._eventsCount?t._events=new n:delete t._events[r]}function u(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(e=!1)),u.prototype.eventNames=function(){var t,n,o=[];if(0===this._eventsCount)return o;for(n in t=this._events)r.call(t,n)&&o.push(e?n.slice(1):n);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(t)):o},u.prototype.listeners=function(t){var r=e?e+t:t,n=this._events[r];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,a=n.length,i=new Array(a);o<a;o++)i[o]=n[o].fn;return i},u.prototype.listenerCount=function(t){var r=e?e+t:t,n=this._events[r];return n?n.fn?1:n.length:0},u.prototype.emit=function(t,r,n,o,a,i){var u=e?e+t:t;if(!this._events[u])return!1;var c,f,s=this._events[u],l=arguments.length;if(s.fn){switch(s.once&&this.removeListener(t,s.fn,void 0,!0),l){case 1:return s.fn.call(s.context),!0;case 2:return s.fn.call(s.context,r),!0;case 3:return s.fn.call(s.context,r,n),!0;case 4:return s.fn.call(s.context,r,n,o),!0;case 5:return s.fn.call(s.context,r,n,o,a),!0;case 6:return s.fn.call(s.context,r,n,o,a,i),!0}for(f=1,c=new Array(l-1);f<l;f++)c[f-1]=arguments[f];s.fn.apply(s.context,c)}else{var v,p=s.length;for(f=0;f<p;f++)switch(s[f].once&&this.removeListener(t,s[f].fn,void 0,!0),l){case 1:s[f].fn.call(s[f].context);break;case 2:s[f].fn.call(s[f].context,r);break;case 3:s[f].fn.call(s[f].context,r,n);break;case 4:s[f].fn.call(s[f].context,r,n,o);break;default:if(!c)for(v=1,c=new Array(l-1);v<l;v++)c[v-1]=arguments[v];s[f].fn.apply(s[f].context,c)}}return!0},u.prototype.on=function(t,r,e){return a(this,t,r,e,!1)},u.prototype.once=function(t,r,e){return a(this,t,r,e,!0)},u.prototype.removeListener=function(t,r,n,o){var a=e?e+t:t;if(!this._events[a])return this;if(!r)return i(this,a),this;var u=this._events[a];if(u.fn)u.fn!==r||o&&!u.once||n&&u.context!==n||i(this,a);else{for(var c=0,f=[],s=u.length;c<s;c++)(u[c].fn!==r||o&&!u[c].once||n&&u[c].context!==n)&&f.push(u[c]);f.length?this._events[a]=1===f.length?f[0]:f:i(this,a)}return this},u.prototype.removeAllListeners=function(t){var r;return t?(r=e?e+t:t,this._events[r]&&i(this,r)):(this._events=new n,this._eventsCount=0),this},u.prototype.off=u.prototype.removeListener,u.prototype.addListener=u.prototype.on,u.prefixed=e,u.EventEmitter=u,t.exports=u}));function jn(){return new gn}return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e={},n=!1;t.usePollingTableTags?t.usePollingTableTags=bn(t.usePollingTableTags):t.usePollingTableTags=!1,t.pollingIntervalTime?t.pollingIntervalTime=$e(t.pollingIntervalTime):t.pollingIntervalTime=2e3;var o=new jn;function a(t){for(var r=arguments.length,e=new Array(r>1?r-1:0),n=1;n<r;n++)e[n-1]=arguments[n];setTimeout((function(){o.emit.apply(o,[t].concat(e))}),1)}function u(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e=t}function c(){return f.apply(this,arguments)}function f(){return f=r(i.mark((function t(){var r,n,o,u=arguments;return i.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=u.length>0&&void 0!==u[0]?u[0]:{},n=[],a("beforeUpdateTableTags",{oldTableTags:be(e),newTableTags:be(r)}),o=!1,nt(r,(function(t,r){e[r]!==t&&(o=!0)})),a("refreshState",{needToRefresh:o,oldTableTags:be(e),newTableTags:be(r)}),nt(r,(function(t,r){if(e[r]!==t){var o=de(),i={tableName:r,timeTag:t,pm:o};n.push(o),a("refreshTable",i),o.then((function(n){e[r]=t,a("getData",{tableName:r,timeTag:t,data:n})})).catch((function(t){a("error",{msg:"can not get table data: "+r,err:t})}))}})),t.next=9,Promise.all(n);case 9:a("afterUpdateTableTags",{oldTableTags:be(e),newTableTags:be(r)});case 10:case"end":return t.stop()}}),t)}))),f.apply(this,arguments)}function s(){return l.apply(this,arguments)}function l(){return(l=r(i.mark((function r(){var e,o;return i.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(!n){r.next=2;break}return r.abrupt("return");case 2:return n=!0,a("beforePollingTableTags"),a("refreshTags",{pm:e=de()}),r.next=8,e.catch((function(t){a("error",{msg:"can not get tags data",err:t})}));case 8:if(!(o=r.sent)){r.next=12;break}return r.next=12,c(o);case 12:return r.next=14,dn(t.pollingIntervalTime);case 14:a("afterPollingTableTags"),n=!1;case 16:case"end":return r.stop()}}),r)})))).apply(this,arguments)}return t.usePollingTableTags&&"undefined"!=typeof window&&window.addEventListener("mouseover",(function(t){s()}),!1),o.setTableTags=u,o.updateTableTags=c,o.pollingTableTags=s,o}}));
//# sourceMappingURL=w-sync-webdata-client.umd.js.map
