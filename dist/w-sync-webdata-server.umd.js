/*!
 * w-sync-webdata-server v1.0.36
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e(require("fs")):"function"==typeof define&&define.amd?define(["fs"],e):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-server"]=e(t.fs)}(this,(function(t){"use strict";var e=Array.isArray,n="object"==typeof global&&global&&global.Object===Object&&global,r="object"==typeof self&&self&&self.Object===Object&&self,o=n||r||Function("return this")(),i=o.Symbol,u=Object.prototype,a=u.hasOwnProperty,c=u.toString,s=i?i.toStringTag:void 0;var f=Object.prototype.toString;var l="[object Null]",h="[object Undefined]",p=i?i.toStringTag:void 0;function v(t){return null==t?void 0===t?h:l:p&&p in Object(t)?function(t){var e=a.call(t,s),n=t[s];try{t[s]=void 0;var r=!0}catch(t){}var o=c.call(t);return r&&(e?t[s]=n:delete t[s]),o}(t):function(t){return f.call(t)}(t)}function d(t){return null!=t&&"object"==typeof t}var y="[object Symbol]";function b(t){return"symbol"==typeof t||d(t)&&v(t)==y}var g=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,_=/^\w*$/;function m(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}var j="[object AsyncFunction]",w="[object Function]",$="[object GeneratorFunction]",O="[object Proxy]";function S(t){if(!m(t))return!1;var e=v(t);return e==w||e==$||e==j||e==O}var T,x=o["__core-js_shared__"],M=(T=/[^.]+$/.exec(x&&x.keys&&x.keys.IE_PROTO||""))?"Symbol(src)_1."+T:"";var D=Function.prototype.toString;var A=/^\[object .+?Constructor\]$/,z=Function.prototype,k=Object.prototype,C=z.toString,F=k.hasOwnProperty,E=RegExp("^"+C.call(F).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");function P(t){return!(!m(t)||(e=t,M&&M in e))&&(S(t)?E:A).test(function(t){if(null!=t){try{return D.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t));var e}function L(t,e){var n=function(t,e){return null==t?void 0:t[e]}(t,e);return P(n)?n:void 0}var N=L(Object,"create");var Y=Object.prototype.hasOwnProperty;var I=Object.prototype.hasOwnProperty;function W(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}function H(t,e){return t===e||t!=t&&e!=e}function U(t,e){for(var n=t.length;n--;)if(H(t[n][0],e))return n;return-1}W.prototype.clear=function(){this.__data__=N?N(null):{},this.size=0},W.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},W.prototype.get=function(t){var e=this.__data__;if(N){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return Y.call(e,t)?e[t]:void 0},W.prototype.has=function(t){var e=this.__data__;return N?void 0!==e[t]:I.call(e,t)},W.prototype.set=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=N&&void 0===e?"__lodash_hash_undefined__":e,this};var J=Array.prototype.splice;function B(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}B.prototype.clear=function(){this.__data__=[],this.size=0},B.prototype.delete=function(t){var e=this.__data__,n=U(e,t);return!(n<0)&&(n==e.length-1?e.pop():J.call(e,n,1),--this.size,!0)},B.prototype.get=function(t){var e=this.__data__,n=U(e,t);return n<0?void 0:e[n][1]},B.prototype.has=function(t){return U(this.__data__,t)>-1},B.prototype.set=function(t,e){var n=this.__data__,r=U(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this};var Z=L(o,"Map");function q(t,e){var n,r,o=t.__data__;return("string"==(r=typeof(n=e))||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==n:null===n)?o["string"==typeof e?"string":"hash"]:o.map}function V(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}V.prototype.clear=function(){this.size=0,this.__data__={hash:new W,map:new(Z||B),string:new W}},V.prototype.delete=function(t){var e=q(this,t).delete(t);return this.size-=e?1:0,e},V.prototype.get=function(t){return q(this,t).get(t)},V.prototype.has=function(t){return q(this,t).has(t)},V.prototype.set=function(t,e){var n=q(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this};var R="Expected a function";function G(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError(R);var n=function(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var u=t.apply(this,r);return n.cache=i.set(o,u)||i,u};return n.cache=new(G.Cache||V),n}G.Cache=V;var Q,K,X,tt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,et=/\\(\\)?/g,nt=(Q=function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(tt,(function(t,n,r,o){e.push(r?o.replace(et,"$1"):n||t)})),e},K=G(Q,(function(t){return 500===X.size&&X.clear(),t})),X=K.cache,K),rt=nt;var ot=1/0,it=i?i.prototype:void 0,ut=it?it.toString:void 0;function at(t){if("string"==typeof t)return t;if(e(t))return function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o}(t,at)+"";if(b(t))return ut?ut.call(t):"";var n=t+"";return"0"==n&&1/t==-ot?"-0":n}function ct(t){return null==t?"":at(t)}function st(t,n){return e(t)?t:function(t,n){if(e(t))return!1;var r=typeof t;return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!b(t))||_.test(t)||!g.test(t)||null!=n&&t in Object(n)}(t,n)?[t]:rt(ct(t))}var ft=1/0;function lt(t){if("string"==typeof t||b(t))return t;var e=t+"";return"0"==e&&1/t==-ft?"-0":e}function ht(t,e,n){var r=null==t?void 0:function(t,e){for(var n=0,r=(e=st(e,t)).length;null!=t&&n<r;)t=t[lt(e[n++])];return n&&n==r?t:void 0}(t,e);return void 0===r?n:r}var pt=function(){return o.Date.now()},vt=/\s/;var dt=/^\s+/;function yt(t){return t?t.slice(0,function(t){for(var e=t.length;e--&&vt.test(t.charAt(e)););return e}(t)+1).replace(dt,""):t}var bt=NaN,gt=/^[-+]0x[0-9a-f]+$/i,_t=/^0b[01]+$/i,mt=/^0o[0-7]+$/i,jt=parseInt;function wt(t){if("number"==typeof t)return t;if(b(t))return bt;if(m(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=m(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=yt(t);var n=_t.test(t);return n||mt.test(t)?jt(t.slice(2),n?2:8):gt.test(t)?bt:+t}var $t="Expected a function",Ot=Math.max,St=Math.min;function Tt(t,e,n){var r,o,i,u,a,c,s=0,f=!1,l=!1,h=!0;if("function"!=typeof t)throw new TypeError($t);function p(e){var n=r,i=o;return r=o=void 0,s=e,u=t.apply(i,n)}function v(t){var n=t-c;return void 0===c||n>=e||n<0||l&&t-s>=i}function d(){var t=pt();if(v(t))return y(t);a=setTimeout(d,function(t){var n=e-(t-c);return l?St(n,i-(t-s)):n}(t))}function y(t){return a=void 0,h&&r?p(t):(r=o=void 0,u)}function b(){var t=pt(),n=v(t);if(r=arguments,o=this,c=t,n){if(void 0===a)return function(t){return s=t,a=setTimeout(d,e),f?p(t):u}(c);if(l)return clearTimeout(a),a=setTimeout(d,e),p(c)}return void 0===a&&(a=setTimeout(d,e)),u}return e=wt(e)||0,m(n)&&(f=!!n.leading,i=(l="maxWait"in n)?Ot(wt(n.maxWait)||0,e):i,h="trailing"in n?!!n.trailing:h),b.cancel=function(){void 0!==a&&clearTimeout(a),s=0,r=c=o=a=void 0},b.flush=function(){return void 0===a?u:y(pt())},b}function xt(t){var e=this.__data__=new B(t);this.size=e.size}xt.prototype.clear=function(){this.__data__=new B,this.size=0},xt.prototype.delete=function(t){var e=this.__data__,n=e.delete(t);return this.size=e.size,n},xt.prototype.get=function(t){return this.__data__.get(t)},xt.prototype.has=function(t){return this.__data__.has(t)},xt.prototype.set=function(t,e){var n=this.__data__;if(n instanceof B){var r=n.__data__;if(!Z||r.length<199)return r.push([t,e]),this.size=++n.size,this;n=this.__data__=new V(r)}return n.set(t,e),this.size=n.size,this};var Mt=function(){try{var t=L(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),Dt=Mt;function At(t,e,n){"__proto__"==e&&Dt?Dt(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n}function zt(t,e,n){(void 0!==n&&!H(t[e],n)||void 0===n&&!(e in t))&&At(t,e,n)}var kt,Ct=function(t,e,n){for(var r=-1,o=Object(t),i=n(t),u=i.length;u--;){var a=i[kt?u:++r];if(!1===e(o[a],a,o))break}return t},Ft="object"==typeof exports&&exports&&!exports.nodeType&&exports,Et=Ft&&"object"==typeof module&&module&&!module.nodeType&&module,Pt=Et&&Et.exports===Ft?o.Buffer:void 0,Lt=Pt?Pt.allocUnsafe:void 0;var Nt=o.Uint8Array;function Yt(t,e){var n=e?function(t){var e=new t.constructor(t.byteLength);return new Nt(e).set(new Nt(t)),e}(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)}var It=Object.create,Wt=function(){function t(){}return function(e){if(!m(e))return{};if(It)return It(e);t.prototype=e;var n=new t;return t.prototype=void 0,n}}(),Ht=Wt;var Ut=function(t,e){return function(n){return t(e(n))}}(Object.getPrototypeOf,Object),Jt=Ut,Bt=Object.prototype;function Zt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||Bt)}function qt(t){return d(t)&&"[object Arguments]"==v(t)}var Vt=Object.prototype,Rt=Vt.hasOwnProperty,Gt=Vt.propertyIsEnumerable,Qt=qt(function(){return arguments}())?qt:function(t){return d(t)&&Rt.call(t,"callee")&&!Gt.call(t,"callee")},Kt=Qt,Xt=9007199254740991;function te(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=Xt}function ee(t){return null!=t&&te(t.length)&&!S(t)}var ne="object"==typeof exports&&exports&&!exports.nodeType&&exports,re=ne&&"object"==typeof module&&module&&!module.nodeType&&module,oe=re&&re.exports===ne?o.Buffer:void 0,ie=(oe?oe.isBuffer:void 0)||function(){return!1},ue="[object Object]",ae=Function.prototype,ce=Object.prototype,se=ae.toString,fe=ce.hasOwnProperty,le=se.call(Object);var he={};he["[object Float32Array]"]=he["[object Float64Array]"]=he["[object Int8Array]"]=he["[object Int16Array]"]=he["[object Int32Array]"]=he["[object Uint8Array]"]=he["[object Uint8ClampedArray]"]=he["[object Uint16Array]"]=he["[object Uint32Array]"]=!0,he["[object Arguments]"]=he["[object Array]"]=he["[object ArrayBuffer]"]=he["[object Boolean]"]=he["[object DataView]"]=he["[object Date]"]=he["[object Error]"]=he["[object Function]"]=he["[object Map]"]=he["[object Number]"]=he["[object Object]"]=he["[object RegExp]"]=he["[object Set]"]=he["[object String]"]=he["[object WeakMap]"]=!1;var pe="object"==typeof exports&&exports&&!exports.nodeType&&exports,ve=pe&&"object"==typeof module&&module&&!module.nodeType&&module,de=ve&&ve.exports===pe&&n.process,ye=function(){try{var t=ve&&ve.require&&ve.require("util").types;return t||de&&de.binding&&de.binding("util")}catch(t){}}(),be=ye&&ye.isTypedArray,ge=be?function(t){return function(e){return t(e)}}(be):function(t){return d(t)&&te(t.length)&&!!he[v(t)]},_e=ge;function me(t,e){if(("constructor"!==e||"function"!=typeof t[e])&&"__proto__"!=e)return t[e]}var je=Object.prototype.hasOwnProperty;function we(t,e,n){var r=t[e];je.call(t,e)&&H(r,n)&&(void 0!==n||e in t)||At(t,e,n)}var $e=9007199254740991,Oe=/^(?:0|[1-9]\d*)$/;function Se(t,e){var n=typeof t;return!!(e=null==e?$e:e)&&("number"==n||"symbol"!=n&&Oe.test(t))&&t>-1&&t%1==0&&t<e}var Te=Object.prototype.hasOwnProperty;function xe(t,n){var r=e(t),o=!r&&Kt(t),i=!r&&!o&&ie(t),u=!r&&!o&&!i&&_e(t),a=r||o||i||u,c=a?function(t,e){for(var n=-1,r=Array(t);++n<t;)r[n]=e(n);return r}(t.length,String):[],s=c.length;for(var f in t)!n&&!Te.call(t,f)||a&&("length"==f||i&&("offset"==f||"parent"==f)||u&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||Se(f,s))||c.push(f);return c}var Me=Object.prototype.hasOwnProperty;function De(t){if(!m(t))return function(t){var e=[];if(null!=t)for(var n in Object(t))e.push(n);return e}(t);var e=Zt(t),n=[];for(var r in t)("constructor"!=r||!e&&Me.call(t,r))&&n.push(r);return n}function Ae(t){return ee(t)?xe(t,!0):De(t)}function ze(t){return function(t,e,n,r){var o=!n;n||(n={});for(var i=-1,u=e.length;++i<u;){var a=e[i],c=r?r(n[a],t[a],a,n,t):void 0;void 0===c&&(c=t[a]),o?At(n,a,c):we(n,a,c)}return n}(t,Ae(t))}function ke(t,n,r,o,i,u,a){var c=me(t,r),s=me(n,r),f=a.get(s);if(f)zt(t,r,f);else{var l,h=u?u(c,s,r+"",t,n,a):void 0,p=void 0===h;if(p){var y=e(s),b=!y&&ie(s),g=!y&&!b&&_e(s);h=s,y||b||g?e(c)?h=c:d(l=c)&&ee(l)?h=function(t,e){var n=-1,r=t.length;for(e||(e=Array(r));++n<r;)e[n]=t[n];return e}(c):b?(p=!1,h=function(t,e){if(e)return t.slice();var n=t.length,r=Lt?Lt(n):new t.constructor(n);return t.copy(r),r}(s,!0)):g?(p=!1,h=Yt(s,!0)):h=[]:function(t){if(!d(t)||v(t)!=ue)return!1;var e=Jt(t);if(null===e)return!0;var n=fe.call(e,"constructor")&&e.constructor;return"function"==typeof n&&n instanceof n&&se.call(n)==le}(s)||Kt(s)?(h=c,Kt(c)?h=ze(c):m(c)&&!S(c)||(h=function(t){return"function"!=typeof t.constructor||Zt(t)?{}:Ht(Jt(t))}(s))):p=!1}p&&(a.set(s,h),i(h,s,o,u,a),a.delete(s)),zt(t,r,h)}}function Ce(t,e,n,r,o){t!==e&&Ct(e,(function(i,u){if(o||(o=new xt),m(i))ke(t,e,u,n,Ce,r,o);else{var a=r?r(me(t,u),i,u+"",t,e,o):void 0;void 0===a&&(a=i),zt(t,u,a)}}),Ae)}function Fe(t){return t}var Ee=Math.max;var Pe=Dt?function(t,e){return Dt(t,"toString",{configurable:!0,enumerable:!1,value:(n=e,function(){return n}),writable:!0});var n}:Fe,Le=Pe,Ne=Date.now;var Ye=function(t){var e=0,n=0;return function(){var r=Ne(),o=16-(r-n);if(n=r,o>0){if(++e>=800)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(Le),Ie=Ye;function We(t,e){return Ie(function(t,e,n){return e=Ee(void 0===e?t.length-1:e,0),function(){for(var r=arguments,o=-1,i=Ee(r.length-e,0),u=Array(i);++o<i;)u[o]=r[e+o];o=-1;for(var a=Array(e+1);++o<e;)a[o]=r[o];return a[e]=n(u),function(t,e,n){switch(n.length){case 0:return t.call(e);case 1:return t.call(e,n[0]);case 2:return t.call(e,n[0],n[1]);case 3:return t.call(e,n[0],n[1],n[2])}return t.apply(e,n)}(t,this,a)}}(t,e,Fe),t+"")}var He,Ue=(He=function(t,e,n){Ce(t,e,n)},We((function(t,e){var n=-1,r=e.length,o=r>1?e[r-1]:void 0,i=r>2?e[2]:void 0;for(o=He.length>3&&"function"==typeof o?(r--,o):void 0,i&&function(t,e,n){if(!m(n))return!1;var r=typeof e;return!!("number"==r?ee(n)&&Se(e,n.length):"string"==r&&e in n)&&H(n[e],t)}(e[0],e[1],i)&&(o=r<3?void 0:o,r=1),t=Object(t);++n<r;){var u=e[n];u&&He(t,u,n,o)}return t}))),Je=("undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self,{});!function(t,e){t.exports=function(){var t=1e3,e=6e4,n=36e5,r="millisecond",o="second",i="minute",u="hour",a="day",c="week",s="month",f="quarter",l="year",h="date",p="Invalid Date",v=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,d=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,y={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},b=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:b,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),o=n%60;return(e<=0?"+":"-")+b(r,2,"0")+":"+b(o,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),o=e.clone().add(r,s),i=n-o<0,u=e.clone().add(r+(i?-1:1),s);return+(-(r+(n-o)/(i?o-u:u-o))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:s,y:l,w:c,d:a,D:h,h:u,m:i,s:o,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},_="en",m={};m[_]=y;var j="$isDayjsObject",w=function(t){return t instanceof T||!(!t||!t[j])},$=function t(e,n,r){var o;if(!e)return _;if("string"==typeof e){var i=e.toLowerCase();m[i]&&(o=i),n&&(m[i]=n,o=i);var u=e.split("-");if(!o&&u.length>1)return t(u[0])}else{var a=e.name;m[a]=e,o=a}return!r&&o&&(_=o),o||!r&&_},O=function(t,e){if(w(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new T(n)},S=g;S.l=$,S.i=w,S.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var T=function(){function y(t){this.$L=$(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[j]=!0}var b=y.prototype;return b.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(S.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(v);if(r){var o=r[2]-1||0,i=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],o,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)):new Date(r[1],o,r[3]||1,r[4]||0,r[5]||0,r[6]||0,i)}}return new Date(e)}(t),this.init()},b.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},b.$utils=function(){return S},b.isValid=function(){return!(this.$d.toString()===p)},b.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},b.isAfter=function(t,e){return O(t)<this.startOf(e)},b.isBefore=function(t,e){return this.endOf(e)<O(t)},b.$g=function(t,e,n){return S.u(t)?this[e]:this.set(n,t)},b.unix=function(){return Math.floor(this.valueOf()/1e3)},b.valueOf=function(){return this.$d.getTime()},b.startOf=function(t,e){var n=this,r=!!S.u(e)||e,f=S.p(t),p=function(t,e){var o=S.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?o:o.endOf(a)},v=function(t,e){return S.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},d=this.$W,y=this.$M,b=this.$D,g="set"+(this.$u?"UTC":"");switch(f){case l:return r?p(1,0):p(31,11);case s:return r?p(1,y):p(0,y+1);case c:var _=this.$locale().weekStart||0,m=(d<_?d+7:d)-_;return p(r?b-m:b+(6-m),y);case a:case h:return v(g+"Hours",0);case u:return v(g+"Minutes",1);case i:return v(g+"Seconds",2);case o:return v(g+"Milliseconds",3);default:return this.clone()}},b.endOf=function(t){return this.startOf(t,!1)},b.$set=function(t,e){var n,c=S.p(t),f="set"+(this.$u?"UTC":""),p=(n={},n[a]=f+"Date",n[h]=f+"Date",n[s]=f+"Month",n[l]=f+"FullYear",n[u]=f+"Hours",n[i]=f+"Minutes",n[o]=f+"Seconds",n[r]=f+"Milliseconds",n)[c],v=c===a?this.$D+(e-this.$W):e;if(c===s||c===l){var d=this.clone().set(h,1);d.$d[p](v),d.init(),this.$d=d.set(h,Math.min(this.$D,d.daysInMonth())).$d}else p&&this.$d[p](v);return this.init(),this},b.set=function(t,e){return this.clone().$set(t,e)},b.get=function(t){return this[S.p(t)]()},b.add=function(r,f){var h,p=this;r=Number(r);var v=S.p(f),d=function(t){var e=O(p);return S.w(e.date(e.date()+Math.round(t*r)),p)};if(v===s)return this.set(s,this.$M+r);if(v===l)return this.set(l,this.$y+r);if(v===a)return d(1);if(v===c)return d(7);var y=(h={},h[i]=e,h[u]=n,h[o]=t,h)[v]||1,b=this.$d.getTime()+r*y;return S.w(b,this)},b.subtract=function(t,e){return this.add(-1*t,e)},b.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||p;var r=t||"YYYY-MM-DDTHH:mm:ssZ",o=S.z(this),i=this.$H,u=this.$m,a=this.$M,c=n.weekdays,s=n.months,f=n.meridiem,l=function(t,n,o,i){return t&&(t[n]||t(e,r))||o[n].slice(0,i)},h=function(t){return S.s(i%12||12,t,"0")},v=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(d,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return S.s(e.$y,4,"0");case"M":return a+1;case"MM":return S.s(a+1,2,"0");case"MMM":return l(n.monthsShort,a,s,3);case"MMMM":return l(s,a);case"D":return e.$D;case"DD":return S.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return l(n.weekdaysMin,e.$W,c,2);case"ddd":return l(n.weekdaysShort,e.$W,c,3);case"dddd":return c[e.$W];case"H":return String(i);case"HH":return S.s(i,2,"0");case"h":return h(1);case"hh":return h(2);case"a":return v(i,u,!0);case"A":return v(i,u,!1);case"m":return String(u);case"mm":return S.s(u,2,"0");case"s":return String(e.$s);case"ss":return S.s(e.$s,2,"0");case"SSS":return S.s(e.$ms,3,"0");case"Z":return o}return null}(t)||o.replace(":","")}))},b.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},b.diff=function(r,h,p){var v,d=this,y=S.p(h),b=O(r),g=(b.utcOffset()-this.utcOffset())*e,_=this-b,m=function(){return S.m(d,b)};switch(y){case l:v=m()/12;break;case s:v=m();break;case f:v=m()/3;break;case c:v=(_-g)/6048e5;break;case a:v=(_-g)/864e5;break;case u:v=_/n;break;case i:v=_/e;break;case o:v=_/t;break;default:v=_}return p?v:S.a(v)},b.daysInMonth=function(){return this.endOf(s).$D},b.$locale=function(){return m[this.$L]},b.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=$(t,e,!0);return r&&(n.$L=r),n},b.clone=function(){return S.w(this.$d,this)},b.toDate=function(){return new Date(this.valueOf())},b.toJSON=function(){return this.isValid()?this.toISOString():null},b.toISOString=function(){return this.$d.toISOString()},b.toString=function(){return this.$d.toUTCString()},y}(),x=T.prototype;return O.prototype=x,[["$ms",r],["$s",o],["$m",i],["$H",u],["$W",a],["$M",s],["$y",l],["$D",h]].forEach((function(t){x[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,T,O),t.$i=!0),O},O.locale=$,O.isDayjs=w,O.unix=function(t){return O(1e3*t)},O.en=m[_],O.Ls=m,O.p={},O}()}({get exports(){return Je},set exports(t){Je=t}});var Be=Je;function Ze(t){let e=Object.prototype.toString.call(t);return"[object Function]"===e||"[object AsyncFunction]"===e}var qe=1/0,Ve=17976931348623157e292;function Re(t){return t?(t=wt(t))===qe||t===-qe?(t<0?-1:1)*Ve:t==t?t:0:0===t?t:0}function Ge(t){var e=Re(t),n=e%1;return e==e?n?e-n:e:0}function Qe(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Ke(t){let e=!1;if(Qe(t))e=!isNaN(Number(t));else if(function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)){if(function(t){return t!=t}(t))return!1;e=!0}return e}function Xe(t){if(!Ke(t))return 0;return Re(t)}function tn(t){return!!Ke(t)&&(t=Xe(t),"number"==typeof(e=t)&&e==Ge(e));var e}var en=o.isFinite,nn=Math.min;var rn=function(t){var e=Math[t];return function(t,n){if(t=wt(t),(n=null==n?0:nn(Ge(n),292))&&en(t)){var r=(ct(t)+"e").split("e");return+((r=(ct(e(r[0]+"e"+(+r[1]+n)))+"e").split("e"))[0]+"e"+(+r[1]-n))}return e(t)}}("round"),on=rn;function un(t){if(!Ke(t))return 0;t=Xe(t);let e=on(t);return"0"===String(e)?0:e}let an="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),cn=an.length;function sn(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,e=[];var n;t=tn(n=t)&&un(n)>0?un(t):32;for(let n=0;n<t;n++)e[n]=an[0|Math.random()*cn];return e.join("")}var fn={};!function(t){var e=Object.prototype.hasOwnProperty,n="~";function r(){}function o(t,e,n){this.fn=t,this.context=e,this.once=n||!1}function i(t,e,r,i,u){if("function"!=typeof r)throw new TypeError("The listener must be a function");var a=new o(r,i||t,u),c=n?n+e:e;return t._events[c]?t._events[c].fn?t._events[c]=[t._events[c],a]:t._events[c].push(a):(t._events[c]=a,t._eventsCount++),t}function u(t,e){0==--t._eventsCount?t._events=new r:delete t._events[e]}function a(){this._events=new r,this._eventsCount=0}Object.create&&(r.prototype=Object.create(null),(new r).__proto__||(n=!1)),a.prototype.eventNames=function(){var t,r,o=[];if(0===this._eventsCount)return o;for(r in t=this._events)e.call(t,r)&&o.push(n?r.slice(1):r);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(t)):o},a.prototype.listeners=function(t){var e=n?n+t:t,r=this._events[e];if(!r)return[];if(r.fn)return[r.fn];for(var o=0,i=r.length,u=new Array(i);o<i;o++)u[o]=r[o].fn;return u},a.prototype.listenerCount=function(t){var e=n?n+t:t,r=this._events[e];return r?r.fn?1:r.length:0},a.prototype.emit=function(t,e,r,o,i,u){var a=n?n+t:t;if(!this._events[a])return!1;var c,s,f=this._events[a],l=arguments.length;if(f.fn){switch(f.once&&this.removeListener(t,f.fn,void 0,!0),l){case 1:return f.fn.call(f.context),!0;case 2:return f.fn.call(f.context,e),!0;case 3:return f.fn.call(f.context,e,r),!0;case 4:return f.fn.call(f.context,e,r,o),!0;case 5:return f.fn.call(f.context,e,r,o,i),!0;case 6:return f.fn.call(f.context,e,r,o,i,u),!0}for(s=1,c=new Array(l-1);s<l;s++)c[s-1]=arguments[s];f.fn.apply(f.context,c)}else{var h,p=f.length;for(s=0;s<p;s++)switch(f[s].once&&this.removeListener(t,f[s].fn,void 0,!0),l){case 1:f[s].fn.call(f[s].context);break;case 2:f[s].fn.call(f[s].context,e);break;case 3:f[s].fn.call(f[s].context,e,r);break;case 4:f[s].fn.call(f[s].context,e,r,o);break;default:if(!c)for(h=1,c=new Array(l-1);h<l;h++)c[h-1]=arguments[h];f[s].fn.apply(f[s].context,c)}}return!0},a.prototype.on=function(t,e,n){return i(this,t,e,n,!1)},a.prototype.once=function(t,e,n){return i(this,t,e,n,!0)},a.prototype.removeListener=function(t,e,r,o){var i=n?n+t:t;if(!this._events[i])return this;if(!e)return u(this,i),this;var a=this._events[i];if(a.fn)a.fn!==e||o&&!a.once||r&&a.context!==r||u(this,i);else{for(var c=0,s=[],f=a.length;c<f;c++)(a[c].fn!==e||o&&!a[c].once||r&&a[c].context!==r)&&s.push(a[c]);s.length?this._events[i]=1===s.length?s[0]:s:u(this,i)}return this},a.prototype.removeAllListeners=function(t){var e;return t?(e=n?n+t:t,this._events[e]&&u(this,e)):(this._events=new r,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=n,a.EventEmitter=a,t.exports=a}({get exports(){return fn},set exports(t){fn=t}});var ln=fn;function hn(t){return"[object Object]"===Object.prototype.toString.call(t)}function pn(t){if(hn(t)){for(let e in t)return!0;return!1}return!1}function vn(t){let e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(function(t){return"[object Undefined]"===Object.prototype.toString.call(t)}(t))return"";let n="";try{n=e?JSON.stringify(t,null,2):JSON.stringify(t)}catch(t){n=""}return n}return function(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r={};if(pn(e)||(console.log("instWConverServer is not an effective object, and set instWConverServer to an EventEmitter"),e=new ln),i="emit",!hn(o=e)||!Qe(i)&&!Ke(i)||!(i in o))throw new Error("instWConverServer is not an EventEmitter");var o,i;let u=ht(n,"fpTableTags","");Qe(u)||(u="./tableTags.json");let a=ht(n,"genTag");Ze(a)||(a=()=>function(){if(!Ze(Be))throw new Error("invalid dayjs");return Be().format("YYYY-MM-DDTHH:mm:ssZ")}()+"|"+sn(6));let c=function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];setTimeout((()=>{e.emit(t,...r)}),1)};function s(){let e={};try{if(t.existsSync(u)){let n=function(t){if(!Qe(t))return{};let e={};try{e=JSON.parse(t)}catch(t){e={}}return e}(t.readFileSync(u,"utf8"));pn(n)&&(e=n)}}catch(t){c("error",{msg:"readTableTags catch",err:t})}return e}function f(){try{let e=vn(r);t.writeFileSync(u,e,"utf8")}catch(t){c("error",{msg:"writeTableTags catch",err:t})}}let l=Tt((()=>{f(),c("changeTableTags",r)}),200);return e.readTableTags=s,e.writeTableTags=f,e.initTableTags=function(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"useInputFirst";if("useInputOnly"===e)r=t;else if("useStorageOnly"===e)r=s();else if("useInputFirst"===e)r=Ue(s(),t);else{if("useStorageFirst"!==e)throw new Error(`invalid mode[${e}]`);r=Ue(t,s())}f()},e.setTableTags=function(){r=Ue(r,arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),f()},e.getTableTags=function(){return r},e.updateTableTag=function(t){r[t]=a(),l()},e}}));
//# sourceMappingURL=w-sync-webdata-server.umd.js.map
