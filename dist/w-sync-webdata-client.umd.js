/*!
 * w-sync-webdata-client v1.0.28
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-client"]=e()}(this,(function(){"use strict";var t=Array.isArray,e="object"==typeof global&&global&&global.Object===Object&&global,r="object"==typeof self&&self&&self.Object===Object&&self,n=e||r||Function("return this")(),o=n.Symbol,a=Object.prototype,i=a.hasOwnProperty,c=a.toString,u=o?o.toStringTag:void 0;var s=Object.prototype.toString;var f="[object Null]",l="[object Undefined]",p=o?o.toStringTag:void 0;function v(t){return null==t?void 0===t?l:f:p&&p in Object(t)?function(t){var e=i.call(t,u),r=t[u];try{t[u]=void 0;var n=!0}catch(t){}var o=c.call(t);return n&&(e?t[u]=r:delete t[u]),o}(t):function(t){return s.call(t)}(t)}function b(t){return null!=t&&"object"==typeof t}var y="[object Symbol]";function h(t){return"symbol"==typeof t||b(t)&&v(t)==y}var j=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,d=/^\w*$/;function _(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}var g="[object AsyncFunction]",w="[object Function]",m="[object GeneratorFunction]",O="[object Proxy]";function A(t){if(!_(t))return!1;var e=v(t);return e==w||e==m||e==g||e==O}var T,x=n["__core-js_shared__"],S=(T=/[^.]+$/.exec(x&&x.keys&&x.keys.IE_PROTO||""))?"Symbol(src)_1."+T:"";var P=Function.prototype.toString;function E(t){if(null!=t){try{return P.call(t)}catch(t){}try{return t+""}catch(t){}}return""}var z=/^\[object .+?Constructor\]$/,C=Function.prototype,F=Object.prototype,U=C.toString,I=F.hasOwnProperty,$=RegExp("^"+U.call(I).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function M(t){return!(!_(t)||(e=t,S&&S in e))&&(A(t)?$:z).test(E(t));var e}function N(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return M(r)?r:void 0}var k=N(Object,"create");var B=Object.prototype.hasOwnProperty;var L=Object.prototype.hasOwnProperty;function D(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function W(t,e){return t===e||t!=t&&e!=e}function R(t,e){for(var r=t.length;r--;)if(W(t[r][0],e))return r;return-1}D.prototype.clear=function(){this.__data__=k?k(null):{},this.size=0},D.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},D.prototype.get=function(t){var e=this.__data__;if(k){var r=e[t];return"__lodash_hash_undefined__"===r?void 0:r}return B.call(e,t)?e[t]:void 0},D.prototype.has=function(t){var e=this.__data__;return k?void 0!==e[t]:L.call(e,t)},D.prototype.set=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=k&&void 0===e?"__lodash_hash_undefined__":e,this};var V=Array.prototype.splice;function q(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}q.prototype.clear=function(){this.__data__=[],this.size=0},q.prototype.delete=function(t){var e=this.__data__,r=R(e,t);return!(r<0)&&(r==e.length-1?e.pop():V.call(e,r,1),--this.size,!0)},q.prototype.get=function(t){var e=this.__data__,r=R(e,t);return r<0?void 0:e[r][1]},q.prototype.has=function(t){return R(this.__data__,t)>-1},q.prototype.set=function(t,e){var r=this.__data__,n=R(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this};var G=N(n,"Map");function H(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function J(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}J.prototype.clear=function(){this.size=0,this.__data__={hash:new D,map:new(G||q),string:new D}},J.prototype.delete=function(t){var e=H(this,t).delete(t);return this.size-=e?1:0,e},J.prototype.get=function(t){return H(this,t).get(t)},J.prototype.has=function(t){return H(this,t).has(t)},J.prototype.set=function(t,e){var r=H(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this};var K="Expected a function";function Q(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(K);var r=function(){var n=arguments,o=e?e.apply(this,n):n[0],a=r.cache;if(a.has(o))return a.get(o);var i=t.apply(this,n);return r.cache=a.set(o,i)||a,i};return r.cache=new(Q.Cache||J),r}Q.Cache=J;var X,Y,Z,tt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,et=/\\(\\)?/g,rt=(X=function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(tt,(function(t,r,n,o){e.push(n?o.replace(et,"$1"):r||t)})),e},Y=Q(X,(function(t){return 500===Z.size&&Z.clear(),t})),Z=Y.cache,Y),nt=rt;var ot=1/0,at=o?o.prototype:void 0,it=at?at.toString:void 0;function ct(e){if("string"==typeof e)return e;if(t(e))return function(t,e){for(var r=-1,n=null==t?0:t.length,o=Array(n);++r<n;)o[r]=e(t[r],r,t);return o}(e,ct)+"";if(h(e))return it?it.call(e):"";var r=e+"";return"0"==r&&1/e==-ot?"-0":r}function ut(t){return null==t?"":ct(t)}function st(e,r){return t(e)?e:function(e,r){if(t(e))return!1;var n=typeof e;return!("number"!=n&&"symbol"!=n&&"boolean"!=n&&null!=e&&!h(e))||d.test(e)||!j.test(e)||null!=r&&e in Object(r)}(e,r)?[e]:nt(ut(e))}var ft=1/0;function lt(t){if("string"==typeof t||h(t))return t;var e=t+"";return"0"==e&&1/t==-ft?"-0":e}function pt(t,e,r){var n=null==t?void 0:function(t,e){for(var r=0,n=(e=st(e,t)).length;null!=t&&r<n;)t=t[lt(e[r++])];return r&&r==n?t:void 0}(t,e);return void 0===n?r:n}function vt(t,e){for(var r=-1,n=null==t?0:t.length;++r<n&&!1!==e(t[r],r,t););return t}var bt,yt=function(t,e,r){for(var n=-1,o=Object(t),a=r(t),i=a.length;i--;){var c=a[bt?i:++n];if(!1===e(o[c],c,o))break}return t};function ht(t){return b(t)&&"[object Arguments]"==v(t)}var jt=Object.prototype,dt=jt.hasOwnProperty,_t=jt.propertyIsEnumerable,gt=ht(function(){return arguments}())?ht:function(t){return b(t)&&dt.call(t,"callee")&&!_t.call(t,"callee")},wt=gt;var mt="object"==typeof exports&&exports&&!exports.nodeType&&exports,Ot=mt&&"object"==typeof module&&module&&!module.nodeType&&module,At=Ot&&Ot.exports===mt?n.Buffer:void 0,Tt=(At?At.isBuffer:void 0)||function(){return!1},xt=9007199254740991,St=/^(?:0|[1-9]\d*)$/;function Pt(t,e){var r=typeof t;return!!(e=null==e?xt:e)&&("number"==r||"symbol"!=r&&St.test(t))&&t>-1&&t%1==0&&t<e}var Et=9007199254740991;function zt(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=Et}var Ct={};function Ft(t){return function(e){return t(e)}}Ct["[object Float32Array]"]=Ct["[object Float64Array]"]=Ct["[object Int8Array]"]=Ct["[object Int16Array]"]=Ct["[object Int32Array]"]=Ct["[object Uint8Array]"]=Ct["[object Uint8ClampedArray]"]=Ct["[object Uint16Array]"]=Ct["[object Uint32Array]"]=!0,Ct["[object Arguments]"]=Ct["[object Array]"]=Ct["[object ArrayBuffer]"]=Ct["[object Boolean]"]=Ct["[object DataView]"]=Ct["[object Date]"]=Ct["[object Error]"]=Ct["[object Function]"]=Ct["[object Map]"]=Ct["[object Number]"]=Ct["[object Object]"]=Ct["[object RegExp]"]=Ct["[object Set]"]=Ct["[object String]"]=Ct["[object WeakMap]"]=!1;var Ut="object"==typeof exports&&exports&&!exports.nodeType&&exports,It=Ut&&"object"==typeof module&&module&&!module.nodeType&&module,$t=It&&It.exports===Ut&&e.process,Mt=function(){try{var t=It&&It.require&&It.require("util").types;return t||$t&&$t.binding&&$t.binding("util")}catch(t){}}(),Nt=Mt&&Mt.isTypedArray,kt=Nt?Ft(Nt):function(t){return b(t)&&zt(t.length)&&!!Ct[v(t)]},Bt=Object.prototype.hasOwnProperty;function Lt(e,r){var n=t(e),o=!n&&wt(e),a=!n&&!o&&Tt(e),i=!n&&!o&&!a&&kt(e),c=n||o||a||i,u=c?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(e.length,String):[],s=u.length;for(var f in e)!r&&!Bt.call(e,f)||c&&("length"==f||a&&("offset"==f||"parent"==f)||i&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||Pt(f,s))||u.push(f);return u}var Dt=Object.prototype;function Wt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Dt)}function Rt(t,e){return function(r){return t(e(r))}}var Vt=Rt(Object.keys,Object),qt=Object.prototype.hasOwnProperty;function Gt(t){return null!=t&&zt(t.length)&&!A(t)}function Ht(t){return Gt(t)?Lt(t):function(t){if(!Wt(t))return Vt(t);var e=[];for(var r in Object(t))qt.call(t,r)&&"constructor"!=r&&e.push(r);return e}(t)}var Jt=function(t,e){return function(r,n){if(null==r)return r;if(!Gt(r))return t(r,n);for(var o=r.length,a=e?o:-1,i=Object(r);(e?a--:++a<o)&&!1!==n(i[a],a,i););return r}}((function(t,e){return t&&yt(t,e,Ht)})),Kt=Jt;function Qt(t){return t}function Xt(e,r){var n;return(t(e)?vt:Kt)(e,"function"==typeof(n=r)?n:Qt)}function Yt(t){var e=this.__data__=new q(t);this.size=e.size}Yt.prototype.clear=function(){this.__data__=new q,this.size=0},Yt.prototype.delete=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r},Yt.prototype.get=function(t){return this.__data__.get(t)},Yt.prototype.has=function(t){return this.__data__.has(t)},Yt.prototype.set=function(t,e){var r=this.__data__;if(r instanceof q){var n=r.__data__;if(!G||n.length<199)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new J(n)}return r.set(t,e),this.size=r.size,this};var Zt=function(){try{var t=N(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),te=Zt;function ee(t,e,r){"__proto__"==e&&te?te(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}var re=Object.prototype.hasOwnProperty;function ne(t,e,r){var n=t[e];re.call(t,e)&&W(n,r)&&(void 0!==r||e in t)||ee(t,e,r)}function oe(t,e,r,n){var o=!r;r||(r={});for(var a=-1,i=e.length;++a<i;){var c=e[a],u=n?n(r[c],t[c],c,r,t):void 0;void 0===u&&(u=t[c]),o?ee(r,c,u):ne(r,c,u)}return r}var ae=Object.prototype.hasOwnProperty;function ie(t){if(!_(t))return function(t){var e=[];if(null!=t)for(var r in Object(t))e.push(r);return e}(t);var e=Wt(t),r=[];for(var n in t)("constructor"!=n||!e&&ae.call(t,n))&&r.push(n);return r}function ce(t){return Gt(t)?Lt(t,!0):ie(t)}var ue="object"==typeof exports&&exports&&!exports.nodeType&&exports,se=ue&&"object"==typeof module&&module&&!module.nodeType&&module,fe=se&&se.exports===ue?n.Buffer:void 0,le=fe?fe.allocUnsafe:void 0;function pe(){return[]}var ve=Object.prototype.propertyIsEnumerable,be=Object.getOwnPropertySymbols,ye=be?function(t){return null==t?[]:(t=Object(t),function(t,e){for(var r=-1,n=null==t?0:t.length,o=0,a=[];++r<n;){var i=t[r];e(i,r,t)&&(a[o++]=i)}return a}(be(t),(function(e){return ve.call(t,e)})))}:pe,he=ye;function je(t,e){for(var r=-1,n=e.length,o=t.length;++r<n;)t[o+r]=e[r];return t}var de=Rt(Object.getPrototypeOf,Object),_e=Object.getOwnPropertySymbols?function(t){for(var e=[];t;)je(e,he(t)),t=de(t);return e}:pe,ge=_e;function we(e,r,n){var o=r(e);return t(e)?o:je(o,n(e))}function me(t){return we(t,Ht,he)}function Oe(t){return we(t,ce,ge)}var Ae=N(n,"DataView"),Te=N(n,"Promise"),xe=N(n,"Set"),Se=N(n,"WeakMap"),Pe="[object Map]",Ee="[object Promise]",ze="[object Set]",Ce="[object WeakMap]",Fe="[object DataView]",Ue=E(Ae),Ie=E(G),$e=E(Te),Me=E(xe),Ne=E(Se),ke=v;(Ae&&ke(new Ae(new ArrayBuffer(1)))!=Fe||G&&ke(new G)!=Pe||Te&&ke(Te.resolve())!=Ee||xe&&ke(new xe)!=ze||Se&&ke(new Se)!=Ce)&&(ke=function(t){var e=v(t),r="[object Object]"==e?t.constructor:void 0,n=r?E(r):"";if(n)switch(n){case Ue:return Fe;case Ie:return Pe;case $e:return Ee;case Me:return ze;case Ne:return Ce}return e});var Be=ke,Le=Object.prototype.hasOwnProperty;var De=n.Uint8Array;function We(t){var e=new t.constructor(t.byteLength);return new De(e).set(new De(t)),e}var Re=/\w*$/;var Ve=o?o.prototype:void 0,qe=Ve?Ve.valueOf:void 0;var Ge="[object Boolean]",He="[object Date]",Je="[object Map]",Ke="[object Number]",Qe="[object RegExp]",Xe="[object Set]",Ye="[object String]",Ze="[object Symbol]",tr="[object ArrayBuffer]",er="[object DataView]",rr="[object Float32Array]",nr="[object Float64Array]",or="[object Int8Array]",ar="[object Int16Array]",ir="[object Int32Array]",cr="[object Uint8Array]",ur="[object Uint8ClampedArray]",sr="[object Uint16Array]",fr="[object Uint32Array]";function lr(t,e,r){var n,o=t.constructor;switch(e){case tr:return We(t);case Ge:case He:return new o(+t);case er:return function(t,e){var r=e?We(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.byteLength)}(t,r);case rr:case nr:case or:case ar:case ir:case cr:case ur:case sr:case fr:return function(t,e){var r=e?We(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)}(t,r);case Je:return new o;case Ke:case Ye:return new o(t);case Qe:return function(t){var e=new t.constructor(t.source,Re.exec(t));return e.lastIndex=t.lastIndex,e}(t);case Xe:return new o;case Ze:return n=t,qe?Object(qe.call(n)):{}}}var pr=Object.create,vr=function(){function t(){}return function(e){if(!_(e))return{};if(pr)return pr(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}(),br=vr;var yr=Mt&&Mt.isMap,hr=yr?Ft(yr):function(t){return b(t)&&"[object Map]"==Be(t)};var jr=Mt&&Mt.isSet,dr=jr?Ft(jr):function(t){return b(t)&&"[object Set]"==Be(t)},_r=1,gr=2,wr=4,mr="[object Arguments]",Or="[object Function]",Ar="[object GeneratorFunction]",Tr="[object Object]",xr={};function Sr(e,r,n,o,a,i){var c,u=r&_r,s=r&gr,f=r&wr;if(n&&(c=a?n(e,o,a,i):n(e)),void 0!==c)return c;if(!_(e))return e;var l=t(e);if(l){if(c=function(t){var e=t.length,r=new t.constructor(e);return e&&"string"==typeof t[0]&&Le.call(t,"index")&&(r.index=t.index,r.input=t.input),r}(e),!u)return function(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}(e,c)}else{var p=Be(e),v=p==Or||p==Ar;if(Tt(e))return function(t,e){if(e)return t.slice();var r=t.length,n=le?le(r):new t.constructor(r);return t.copy(n),n}(e,u);if(p==Tr||p==mr||v&&!a){if(c=s||v?{}:function(t){return"function"!=typeof t.constructor||Wt(t)?{}:br(de(t))}(e),!u)return s?function(t,e){return oe(t,ge(t),e)}(e,function(t,e){return t&&oe(e,ce(e),t)}(c,e)):function(t,e){return oe(t,he(t),e)}(e,function(t,e){return t&&oe(e,Ht(e),t)}(c,e))}else{if(!xr[p])return a?e:{};c=lr(e,p,u)}}i||(i=new Yt);var b=i.get(e);if(b)return b;i.set(e,c),dr(e)?e.forEach((function(t){c.add(Sr(t,r,n,t,e,i))})):hr(e)&&e.forEach((function(t,o){c.set(o,Sr(t,r,n,o,e,i))}));var y=l?void 0:(f?s?Oe:me:s?ce:Ht)(e);return vt(y||e,(function(t,o){y&&(t=e[o=t]),ne(c,o,Sr(t,r,n,o,e,i))})),c}xr[mr]=xr["[object Array]"]=xr["[object ArrayBuffer]"]=xr["[object DataView]"]=xr["[object Boolean]"]=xr["[object Date]"]=xr["[object Float32Array]"]=xr["[object Float64Array]"]=xr["[object Int8Array]"]=xr["[object Int16Array]"]=xr["[object Int32Array]"]=xr["[object Map]"]=xr["[object Number]"]=xr[Tr]=xr["[object RegExp]"]=xr["[object Set]"]=xr["[object String]"]=xr["[object Symbol]"]=xr["[object Uint8Array]"]=xr["[object Uint8ClampedArray]"]=xr["[object Uint16Array]"]=xr["[object Uint32Array]"]=!0,xr["[object Error]"]=xr[Or]=xr["[object WeakMap]"]=!1;var Pr=1,Er=4;function zr(t){return Sr(t,Pr|Er)}function Cr(){let t,e,r=new Promise((function(){t=arguments[0],e=arguments[1]}));return r.resolve=t,r.reject=e,r}var Fr={};!function(t){var e=Object.prototype.hasOwnProperty,r="~";function n(){}function o(t,e,r){this.fn=t,this.context=e,this.once=r||!1}function a(t,e,n,a,i){if("function"!=typeof n)throw new TypeError("The listener must be a function");var c=new o(n,a||t,i),u=r?r+e:e;return t._events[u]?t._events[u].fn?t._events[u]=[t._events[u],c]:t._events[u].push(c):(t._events[u]=c,t._eventsCount++),t}function i(t,e){0==--t._eventsCount?t._events=new n:delete t._events[e]}function c(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),c.prototype.eventNames=function(){var t,n,o=[];if(0===this._eventsCount)return o;for(n in t=this._events)e.call(t,n)&&o.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(t)):o},c.prototype.listeners=function(t){var e=r?r+t:t,n=this._events[e];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,a=n.length,i=new Array(a);o<a;o++)i[o]=n[o].fn;return i},c.prototype.listenerCount=function(t){var e=r?r+t:t,n=this._events[e];return n?n.fn?1:n.length:0},c.prototype.emit=function(t,e,n,o,a,i){var c=r?r+t:t;if(!this._events[c])return!1;var u,s,f=this._events[c],l=arguments.length;if(f.fn){switch(f.once&&this.removeListener(t,f.fn,void 0,!0),l){case 1:return f.fn.call(f.context),!0;case 2:return f.fn.call(f.context,e),!0;case 3:return f.fn.call(f.context,e,n),!0;case 4:return f.fn.call(f.context,e,n,o),!0;case 5:return f.fn.call(f.context,e,n,o,a),!0;case 6:return f.fn.call(f.context,e,n,o,a,i),!0}for(s=1,u=new Array(l-1);s<l;s++)u[s-1]=arguments[s];f.fn.apply(f.context,u)}else{var p,v=f.length;for(s=0;s<v;s++)switch(f[s].once&&this.removeListener(t,f[s].fn,void 0,!0),l){case 1:f[s].fn.call(f[s].context);break;case 2:f[s].fn.call(f[s].context,e);break;case 3:f[s].fn.call(f[s].context,e,n);break;case 4:f[s].fn.call(f[s].context,e,n,o);break;default:if(!u)for(p=1,u=new Array(l-1);p<l;p++)u[p-1]=arguments[p];f[s].fn.apply(f[s].context,u)}}return!0},c.prototype.on=function(t,e,r){return a(this,t,e,r,!1)},c.prototype.once=function(t,e,r){return a(this,t,e,r,!0)},c.prototype.removeListener=function(t,e,n,o){var a=r?r+t:t;if(!this._events[a])return this;if(!e)return i(this,a),this;var c=this._events[a];if(c.fn)c.fn!==e||o&&!c.once||n&&c.context!==n||i(this,a);else{for(var u=0,s=[],f=c.length;u<f;u++)(c[u].fn!==e||o&&!c[u].once||n&&c[u].context!==n)&&s.push(c[u]);s.length?this._events[a]=1===s.length?s[0]:s:i(this,a)}return this},c.prototype.removeAllListeners=function(t){var e;return t?(e=r?r+t:t,this._events[e]&&i(this,e)):(this._events=new n,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=r,c.EventEmitter=c,t.exports=c}({get exports(){return Fr},set exports(t){Fr=t}});var Ur=Fr;function Ir(t){return"[object Object]"===Object.prototype.toString.call(t)}function $r(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Mr(t){let e=!1;if($r(t))e=!isNaN(Number(t));else if(function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)){if(function(t){return t!=t}(t))return!1;e=!0}return e}var Nr="[object Boolean]";function kr(t){return!0===(e=t)||!1===e||b(e)&&v(e)==Nr;var e}var Br=/\s/;var Lr=/^\s+/;function Dr(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&Br.test(t.charAt(e)););return e}(t)+1).replace(Lr,""):t}var Wr=NaN,Rr=/^[-+]0x[0-9a-f]+$/i,Vr=/^0b[01]+$/i,qr=/^0o[0-7]+$/i,Gr=parseInt;function Hr(t){if("number"==typeof t)return t;if(h(t))return Wr;if(_(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=_(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=Dr(t);var r=Vr.test(t);return r||qr.test(t)?Gr(t.slice(2),r?2:8):Rr.test(t)?Wr:+t}var Jr=1/0,Kr=17976931348623157e292;function Qr(t){return t?(t=Hr(t))===Jr||t===-Jr?(t<0?-1:1)*Kr:t==t?t:0:0===t?t:0}function Xr(t){var e=Qr(t),r=e%1;return e==e?r?e-r:e:0}function Yr(t){if(!Mr(t))return 0;return Qr(t)}function Zr(t){return!!Mr(t)&&(t=Yr(t),"number"==typeof(e=t)&&e==Xr(e));var e}var tn=n.isFinite,en=Math.min;var rn=function(t){var e=Math[t];return function(t,r){if(t=Hr(t),(r=null==r?0:en(Xr(r),292))&&tn(t)){var n=(ut(t)+"e").split("e");return+((n=(ut(e(n[0]+"e"+(+n[1]+r)))+"e").split("e"))[0]+"e"+(+n[1]-r))}return e(t)}}("round"),nn=rn;function on(t){if(!Mr(t))return 0;t=Yr(t);let e=nn(t);return"0"===String(e)?0:e}return function(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r={},n=!1;if(function(t){if(Ir(t)){for(let e in t)return!0;return!1}return!1}(t)||(console.log("instWConverClient is not an effective object, and set instWConverClient to an EventEmitter"),t=new Ur),a="emit",!Ir(o=t)||!$r(a)&&!Mr(a)||!(a in o))throw new Error("instWConverClient is not an EventEmitter");var o,a;let i=pt(e,"autoPollingTableTagsForActive");kr(i)||(i=!1);let c=pt(e,"pollingDelayTime");var u;Zr(u=c)&&on(u)>0||(c=2e3),c=on(c);let s=function(e){for(var r=arguments.length,n=new Array(r>1?r-1:0),o=1;o<r;o++)n[o-1]=arguments[o];setTimeout((()=>{t.emit(e,...n)}),1)};async function f(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=[];s("beforeUpdateTableTags",{oldTableTags:zr(r),newTableTags:zr(t)});let n=!1;Xt(t,((t,e)=>{r[e]!==t&&(n=!0)})),s("refreshState",{needToRefresh:n,oldTableTags:zr(r),newTableTags:zr(t)}),Xt(t,((t,n)=>{if(r[n]!==t){let o=Cr(),a={tableName:n,timeTag:t,pm:o};e.push(o),s("refreshTable",a),o.then((e=>{r[n]=t,s("getData",{tableName:n,timeTag:t,data:e})})).catch((t=>{s("error",{msg:"can not get table data: "+n,err:t})}))}})),await Promise.all(e),s("afterUpdateTableTags",{oldTableTags:zr(r),newTableTags:zr(t)})}async function l(){if(n)return;n=!0,s("beforePollingTableTags");let t=Cr();s("refreshTags",{pm:t});let e=await t.catch((t=>{s("error",{msg:"can not get tags data",err:t})}));e&&await f(e),await function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;Mr(t)||(t=10);let e=Cr();return setTimeout((function(){e.resolve()}),t),e}(c),s("afterPollingTableTags"),n=!1}return i&&"undefined"!=typeof window&&(window.addEventListener("mouseover",(t=>{l()}),!1),window.addEventListener("touchmove",(t=>{l()}),!1)),t.setTableTags=function(){r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}},t.updateTableTags=f,t.pollingTableTags=l,t}}));
//# sourceMappingURL=w-sync-webdata-client.umd.js.map
