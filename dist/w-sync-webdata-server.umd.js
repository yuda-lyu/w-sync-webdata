/*!
 * w-sync-webdata-server v1.0.12
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r(require("path"),require("fs"),require("events")):"function"==typeof define&&define.amd?define(["path","fs","events"],r):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-server"]=r(t.path,t.fs,t.events)}(this,(function(t,r,n){"use strict";function e(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var i=e(t),o=e(r),u=e(n);function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var c=function(t){var r=a(t);return null!=t&&("object"==r||"function"==r)},s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function f(t){var r={exports:{}};return t(r,r.exports),r.exports}var l="object"==a(s)&&s&&s.Object===Object&&s,v="object"==("undefined"==typeof self?"undefined":a(self))&&self&&self.Object===Object&&self,h=l||v||Function("return this")(),d=function(){return h.Date.now()},p=/\s/;var y=function(t){for(var r=t.length;r--&&p.test(t.charAt(r)););return r},b=/^\s+/;var g=function(t){return t?t.slice(0,y(t)+1).replace(b,""):t},_=h.Symbol,m=Object.prototype,$=m.hasOwnProperty,j=m.toString,O=_?_.toStringTag:void 0;var w=function(t){var r=$.call(t,O),n=t[O];try{t[O]=void 0;var e=!0}catch(t){}var i=j.call(t);return e&&(r?t[O]=n:delete t[O]),i},S=Object.prototype.toString;var T=function(t){return S.call(t)},M=_?_.toStringTag:void 0;var D=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":M&&M in Object(t)?w(t):T(t)};var A=function(t){return null!=t&&"object"==a(t)};var x=function(t){return"symbol"==a(t)||A(t)&&"[object Symbol]"==D(t)},z=/^[-+]0x[0-9a-f]+$/i,F=/^0b[01]+$/i,N=/^0o[0-7]+$/i,Y=parseInt;var I=function(t){if("number"==typeof t)return t;if(x(t))return NaN;if(c(t)){var r="function"==typeof t.valueOf?t.valueOf():t;t=c(r)?r+"":r}if("string"!=typeof t)return 0===t?t:+t;t=g(t);var n=F.test(t);return n||N.test(t)?Y(t.slice(2),n?2:8):z.test(t)?NaN:+t},P=Math.max,H=Math.min;var U=function(t,r,n){var e,i,o,u,a,s,f=0,l=!1,v=!1,h=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(r){var n=e,o=i;return e=i=void 0,f=r,u=t.apply(o,n)}function y(t){return f=t,a=setTimeout(g,r),l?p(t):u}function b(t){var n=t-s;return void 0===s||n>=r||n<0||v&&t-f>=o}function g(){var t=d();if(b(t))return _(t);a=setTimeout(g,function(t){var n=r-(t-s);return v?H(n,o-(t-f)):n}(t))}function _(t){return a=void 0,h&&e?p(t):(e=i=void 0,u)}function m(){var t=d(),n=b(t);if(e=arguments,i=this,s=t,n){if(void 0===a)return y(s);if(v)return clearTimeout(a),a=setTimeout(g,r),p(s)}return void 0===a&&(a=setTimeout(g,r)),u}return r=I(r)||0,c(n)&&(l=!!n.leading,o=(v="maxWait"in n)?P(I(n.maxWait)||0,r):o,h="trailing"in n?!!n.trailing:h),m.cancel=function(){void 0!==a&&clearTimeout(a),f=0,e=s=i=a=void 0},m.flush=function(){return void 0===a?u:_(d())},m};var W=function(){this.__data__=[],this.size=0};var k=function(t,r){return t===r||t!=t&&r!=r};var E=function(t,r){for(var n=t.length;n--;)if(k(t[n][0],r))return n;return-1},L=Array.prototype.splice;var C=function(t){var r=this.__data__,n=E(r,t);return!(n<0)&&(n==r.length-1?r.pop():L.call(r,n,1),--this.size,!0)};var J=function(t){var r=this.__data__,n=E(r,t);return n<0?void 0:r[n][1]};var q=function(t){return E(this.__data__,t)>-1};var B=function(t,r){var n=this.__data__,e=E(n,t);return e<0?(++this.size,n.push([t,r])):n[e][1]=r,this};function Z(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}Z.prototype.clear=W,Z.prototype.delete=C,Z.prototype.get=J,Z.prototype.has=q,Z.prototype.set=B;var V=Z;var R=function(){this.__data__=new V,this.size=0};var G=function(t){var r=this.__data__,n=r.delete(t);return this.size=r.size,n};var Q=function(t){return this.__data__.get(t)};var K=function(t){return this.__data__.has(t)};var X,tt=function(t){if(!c(t))return!1;var r=D(t);return"[object Function]"==r||"[object GeneratorFunction]"==r||"[object AsyncFunction]"==r||"[object Proxy]"==r},rt=h["__core-js_shared__"],nt=(X=/[^.]+$/.exec(rt&&rt.keys&&rt.keys.IE_PROTO||""))?"Symbol(src)_1."+X:"";var et=function(t){return!!nt&&nt in t},it=Function.prototype.toString;var ot=function(t){if(null!=t){try{return it.call(t)}catch(t){}try{return t+""}catch(t){}}return""},ut=/^\[object .+?Constructor\]$/,at=Function.prototype,ct=Object.prototype,st=at.toString,ft=ct.hasOwnProperty,lt=RegExp("^"+st.call(ft).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var vt=function(t){return!(!c(t)||et(t))&&(tt(t)?lt:ut).test(ot(t))};var ht=function(t,r){return null==t?void 0:t[r]};var dt=function(t,r){var n=ht(t,r);return vt(n)?n:void 0},pt=dt(h,"Map"),yt=dt(Object,"create");var bt=function(){this.__data__=yt?yt(null):{},this.size=0};var gt=function(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r},_t=Object.prototype.hasOwnProperty;var mt=function(t){var r=this.__data__;if(yt){var n=r[t];return"__lodash_hash_undefined__"===n?void 0:n}return _t.call(r,t)?r[t]:void 0},$t=Object.prototype.hasOwnProperty;var jt=function(t){var r=this.__data__;return yt?void 0!==r[t]:$t.call(r,t)};var Ot=function(t,r){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=yt&&void 0===r?"__lodash_hash_undefined__":r,this};function wt(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}wt.prototype.clear=bt,wt.prototype.delete=gt,wt.prototype.get=mt,wt.prototype.has=jt,wt.prototype.set=Ot;var St=wt;var Tt=function(){this.size=0,this.__data__={hash:new St,map:new(pt||V),string:new St}};var Mt=function(t){var r=a(t);return"string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==t:null===t};var Dt=function(t,r){var n=t.__data__;return Mt(r)?n["string"==typeof r?"string":"hash"]:n.map};var At=function(t){var r=Dt(this,t).delete(t);return this.size-=r?1:0,r};var xt=function(t){return Dt(this,t).get(t)};var zt=function(t){return Dt(this,t).has(t)};var Ft=function(t,r){var n=Dt(this,t),e=n.size;return n.set(t,r),this.size+=n.size==e?0:1,this};function Nt(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}Nt.prototype.clear=Tt,Nt.prototype.delete=At,Nt.prototype.get=xt,Nt.prototype.has=zt,Nt.prototype.set=Ft;var Yt=Nt;var It=function(t,r){var n=this.__data__;if(n instanceof V){var e=n.__data__;if(!pt||e.length<199)return e.push([t,r]),this.size=++n.size,this;n=this.__data__=new Yt(e)}return n.set(t,r),this.size=n.size,this};function Pt(t){var r=this.__data__=new V(t);this.size=r.size}Pt.prototype.clear=R,Pt.prototype.delete=G,Pt.prototype.get=Q,Pt.prototype.has=K,Pt.prototype.set=It;var Ht=Pt,Ut=function(){try{var t=dt(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var Wt=function(t,r,n){"__proto__"==r&&Ut?Ut(t,r,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[r]=n};var kt=function(t,r,n){(void 0!==n&&!k(t[r],n)||void 0===n&&!(r in t))&&Wt(t,r,n)};var Et=function(t){return function(r,n,e){for(var i=-1,o=Object(r),u=e(r),a=u.length;a--;){var c=u[t?a:++i];if(!1===n(o[c],c,o))break}return r}}(),Lt=f((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n?h.Buffer:void 0,o=i?i.allocUnsafe:void 0;t.exports=function(t,r){if(r)return t.slice();var n=t.length,e=o?o(n):new t.constructor(n);return t.copy(e),e}})),Ct=h.Uint8Array;var Jt=function(t){var r=new t.constructor(t.byteLength);return new Ct(r).set(new Ct(t)),r};var qt=function(t,r){var n=r?Jt(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)};var Bt=function(t,r){var n=-1,e=t.length;for(r||(r=Array(e));++n<e;)r[n]=t[n];return r},Zt=Object.create,Vt=function(){function t(){}return function(r){if(!c(r))return{};if(Zt)return Zt(r);t.prototype=r;var n=new t;return t.prototype=void 0,n}}();var Rt=function(t,r){return function(n){return t(r(n))}}(Object.getPrototypeOf,Object),Gt=Object.prototype;var Qt=function(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||Gt)};var Kt=function(t){return"function"!=typeof t.constructor||Qt(t)?{}:Vt(Rt(t))};var Xt=function(t){return A(t)&&"[object Arguments]"==D(t)},tr=Object.prototype,rr=tr.hasOwnProperty,nr=tr.propertyIsEnumerable,er=Xt(function(){return arguments}())?Xt:function(t){return A(t)&&rr.call(t,"callee")&&!nr.call(t,"callee")},ir=Array.isArray;var or=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var ur=function(t){return null!=t&&or(t.length)&&!tt(t)};var ar=function(t){return A(t)&&ur(t)};var cr=function(){return!1},sr=f((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n?h.Buffer:void 0,o=(i?i.isBuffer:void 0)||cr;t.exports=o})),fr=Function.prototype,lr=Object.prototype,vr=fr.toString,hr=lr.hasOwnProperty,dr=vr.call(Object);var pr=function(t){if(!A(t)||"[object Object]"!=D(t))return!1;var r=Rt(t);if(null===r)return!0;var n=hr.call(r,"constructor")&&r.constructor;return"function"==typeof n&&n instanceof n&&vr.call(n)==dr},yr={};yr["[object Float32Array]"]=yr["[object Float64Array]"]=yr["[object Int8Array]"]=yr["[object Int16Array]"]=yr["[object Int32Array]"]=yr["[object Uint8Array]"]=yr["[object Uint8ClampedArray]"]=yr["[object Uint16Array]"]=yr["[object Uint32Array]"]=!0,yr["[object Arguments]"]=yr["[object Array]"]=yr["[object ArrayBuffer]"]=yr["[object Boolean]"]=yr["[object DataView]"]=yr["[object Date]"]=yr["[object Error]"]=yr["[object Function]"]=yr["[object Map]"]=yr["[object Number]"]=yr["[object Object]"]=yr["[object RegExp]"]=yr["[object Set]"]=yr["[object String]"]=yr["[object WeakMap]"]=!1;var br=function(t){return A(t)&&or(t.length)&&!!yr[D(t)]};var gr=function(t){return function(r){return t(r)}},_r=f((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n&&l.process,o=function(){try{var t=e&&e.require&&e.require("util").types;return t||i&&i.binding&&i.binding("util")}catch(t){}}();t.exports=o})),mr=_r&&_r.isTypedArray,$r=mr?gr(mr):br;var jr=function(t,r){if(("constructor"!==r||"function"!=typeof t[r])&&"__proto__"!=r)return t[r]},Or=Object.prototype.hasOwnProperty;var wr=function(t,r,n){var e=t[r];Or.call(t,r)&&k(e,n)&&(void 0!==n||r in t)||Wt(t,r,n)};var Sr=function(t,r,n,e){var i=!n;n||(n={});for(var o=-1,u=r.length;++o<u;){var a=r[o],c=e?e(n[a],t[a],a,n,t):void 0;void 0===c&&(c=t[a]),i?Wt(n,a,c):wr(n,a,c)}return n};var Tr=function(t,r){for(var n=-1,e=Array(t);++n<t;)e[n]=r(n);return e},Mr=/^(?:0|[1-9]\d*)$/;var Dr=function(t,r){var n=a(t);return!!(r=null==r?9007199254740991:r)&&("number"==n||"symbol"!=n&&Mr.test(t))&&t>-1&&t%1==0&&t<r},Ar=Object.prototype.hasOwnProperty;var xr=function(t,r){var n=ir(t),e=!n&&er(t),i=!n&&!e&&sr(t),o=!n&&!e&&!i&&$r(t),u=n||e||i||o,a=u?Tr(t.length,String):[],c=a.length;for(var s in t)!r&&!Ar.call(t,s)||u&&("length"==s||i&&("offset"==s||"parent"==s)||o&&("buffer"==s||"byteLength"==s||"byteOffset"==s)||Dr(s,c))||a.push(s);return a};var zr=function(t){var r=[];if(null!=t)for(var n in Object(t))r.push(n);return r},Fr=Object.prototype.hasOwnProperty;var Nr=function(t){if(!c(t))return zr(t);var r=Qt(t),n=[];for(var e in t)("constructor"!=e||!r&&Fr.call(t,e))&&n.push(e);return n};var Yr=function(t){return ur(t)?xr(t,!0):Nr(t)};var Ir=function(t){return Sr(t,Yr(t))};var Pr=function(t,r,n,e,i,o,u){var a=jr(t,n),s=jr(r,n),f=u.get(s);if(f)kt(t,n,f);else{var l=o?o(a,s,n+"",t,r,u):void 0,v=void 0===l;if(v){var h=ir(s),d=!h&&sr(s),p=!h&&!d&&$r(s);l=s,h||d||p?ir(a)?l=a:ar(a)?l=Bt(a):d?(v=!1,l=Lt(s,!0)):p?(v=!1,l=qt(s,!0)):l=[]:pr(s)||er(s)?(l=a,er(a)?l=Ir(a):c(a)&&!tt(a)||(l=Kt(s))):v=!1}v&&(u.set(s,l),i(l,s,e,o,u),u.delete(s)),kt(t,n,l)}};var Hr=function t(r,n,e,i,o){r!==n&&Et(n,(function(u,a){if(o||(o=new Ht),c(u))Pr(r,n,a,e,t,i,o);else{var s=i?i(jr(r,a),u,a+"",r,n,o):void 0;void 0===s&&(s=u),kt(r,a,s)}}),Yr)};var Ur=function(t){return t};var Wr=function(t,r,n){switch(n.length){case 0:return t.call(r);case 1:return t.call(r,n[0]);case 2:return t.call(r,n[0],n[1]);case 3:return t.call(r,n[0],n[1],n[2])}return t.apply(r,n)},kr=Math.max;var Er=function(t,r,n){return r=kr(void 0===r?t.length-1:r,0),function(){for(var e=arguments,i=-1,o=kr(e.length-r,0),u=Array(o);++i<o;)u[i]=e[r+i];i=-1;for(var a=Array(r+1);++i<r;)a[i]=e[i];return a[r]=n(u),Wr(t,this,a)}};var Lr=function(t){return function(){return t}},Cr=Ut?function(t,r){return Ut(t,"toString",{configurable:!0,enumerable:!1,value:Lr(r),writable:!0})}:Ur,Jr=Date.now;var qr=function(t){var r=0,n=0;return function(){var e=Jr(),i=16-(e-n);if(n=e,i>0){if(++r>=800)return arguments[0]}else r=0;return t.apply(void 0,arguments)}}(Cr);var Br=function(t,r){return qr(Er(t,r,Ur),t+"")};var Zr=function(t,r,n){if(!c(n))return!1;var e=a(r);return!!("number"==e?ur(n)&&Dr(r,n.length):"string"==e&&r in n)&&k(n[r],t)};var Vr=function(t){return Br((function(r,n){var e=-1,i=n.length,o=i>1?n[i-1]:void 0,u=i>2?n[2]:void 0;for(o=t.length>3&&"function"==typeof o?(i--,o):void 0,u&&Zr(n[0],n[1],u)&&(o=i<3?void 0:o,i=1),r=Object(r);++e<i;){var a=n[e];a&&t(r,a,e,o)}return r}))}((function(t,r,n){Hr(t,r,n)})),Rr=f((function(t,r){t.exports=function(){var t=1e3,r=6e4,n=36e5,e="millisecond",i="second",o="minute",u="hour",c="day",s="week",f="month",l="quarter",v="year",h="date",d="Invalid Date",p=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,b={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},g=function(t,r,n){var e=String(t);return!e||e.length>=r?t:""+Array(r+1-e.length).join(n)+t},_={s:g,z:function(t){var r=-t.utcOffset(),n=Math.abs(r),e=Math.floor(n/60),i=n%60;return(r<=0?"+":"-")+g(e,2,"0")+":"+g(i,2,"0")},m:function t(r,n){if(r.date()<n.date())return-t(n,r);var e=12*(n.year()-r.year())+(n.month()-r.month()),i=r.clone().add(e,f),o=n-i<0,u=r.clone().add(e+(o?-1:1),f);return+(-(e+(n-i)/(o?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:v,w:s,d:c,D:h,h:u,m:o,s:i,ms:e,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},m="en",$={};$[m]=b;var j=function(t){return t instanceof T},O=function(t,r,n){var e;if(!t)return m;if("string"==typeof t)$[t]&&(e=t),r&&($[t]=r,e=t);else{var i=t.name;$[i]=t,e=i}return!n&&e&&(m=e),e||!n&&m},w=function(t,r){if(j(t))return t.clone();var n="object"==a(r)?r:{};return n.date=t,n.args=arguments,new T(n)},S=_;S.l=O,S.i=j,S.w=function(t,r){return w(t,{locale:r.$L,utc:r.$u,x:r.$x,$offset:r.$offset})};var T=function(){function a(t){this.$L=O(t.locale,null,!0),this.parse(t)}var b=a.prototype;return b.parse=function(t){this.$d=function(t){var r=t.date,n=t.utc;if(null===r)return new Date(NaN);if(S.u(r))return new Date;if(r instanceof Date)return new Date(r);if("string"==typeof r&&!/Z$/i.test(r)){var e=r.match(p);if(e){var i=e[2]-1||0,o=(e[7]||"0").substring(0,3);return n?new Date(Date.UTC(e[1],i,e[3]||1,e[4]||0,e[5]||0,e[6]||0,o)):new Date(e[1],i,e[3]||1,e[4]||0,e[5]||0,e[6]||0,o)}}return new Date(r)}(t),this.$x=t.x||{},this.init()},b.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},b.$utils=function(){return S},b.isValid=function(){return!(this.$d.toString()===d)},b.isSame=function(t,r){var n=w(t);return this.startOf(r)<=n&&n<=this.endOf(r)},b.isAfter=function(t,r){return w(t)<this.startOf(r)},b.isBefore=function(t,r){return this.endOf(r)<w(t)},b.$g=function(t,r,n){return S.u(t)?this[r]:this.set(n,t)},b.unix=function(){return Math.floor(this.valueOf()/1e3)},b.valueOf=function(){return this.$d.getTime()},b.startOf=function(t,r){var n=this,e=!!S.u(r)||r,a=S.p(t),l=function(t,r){var i=S.w(n.$u?Date.UTC(n.$y,r,t):new Date(n.$y,r,t),n);return e?i:i.endOf(c)},d=function(t,r){return S.w(n.toDate()[t].apply(n.toDate("s"),(e?[0,0,0,0]:[23,59,59,999]).slice(r)),n)},p=this.$W,y=this.$M,b=this.$D,g="set"+(this.$u?"UTC":"");switch(a){case v:return e?l(1,0):l(31,11);case f:return e?l(1,y):l(0,y+1);case s:var _=this.$locale().weekStart||0,m=(p<_?p+7:p)-_;return l(e?b-m:b+(6-m),y);case c:case h:return d(g+"Hours",0);case u:return d(g+"Minutes",1);case o:return d(g+"Seconds",2);case i:return d(g+"Milliseconds",3);default:return this.clone()}},b.endOf=function(t){return this.startOf(t,!1)},b.$set=function(t,r){var n,a=S.p(t),s="set"+(this.$u?"UTC":""),l=(n={},n[c]=s+"Date",n[h]=s+"Date",n[f]=s+"Month",n[v]=s+"FullYear",n[u]=s+"Hours",n[o]=s+"Minutes",n[i]=s+"Seconds",n[e]=s+"Milliseconds",n)[a],d=a===c?this.$D+(r-this.$W):r;if(a===f||a===v){var p=this.clone().set(h,1);p.$d[l](d),p.init(),this.$d=p.set(h,Math.min(this.$D,p.daysInMonth())).$d}else l&&this.$d[l](d);return this.init(),this},b.set=function(t,r){return this.clone().$set(t,r)},b.get=function(t){return this[S.p(t)]()},b.add=function(e,a){var l,h=this;e=Number(e);var d=S.p(a),p=function(t){var r=w(h);return S.w(r.date(r.date()+Math.round(t*e)),h)};if(d===f)return this.set(f,this.$M+e);if(d===v)return this.set(v,this.$y+e);if(d===c)return p(1);if(d===s)return p(7);var y=(l={},l[o]=r,l[u]=n,l[i]=t,l)[d]||1,b=this.$d.getTime()+e*y;return S.w(b,this)},b.subtract=function(t,r){return this.add(-1*t,r)},b.format=function(t){var r=this,n=this.$locale();if(!this.isValid())return n.invalidDate||d;var e=t||"YYYY-MM-DDTHH:mm:ssZ",i=S.z(this),o=this.$H,u=this.$m,a=this.$M,c=n.weekdays,s=n.months,f=function(t,n,i,o){return t&&(t[n]||t(r,e))||i[n].substr(0,o)},l=function(t){return S.s(o%12||12,t,"0")},v=n.meridiem||function(t,r,n){var e=t<12?"AM":"PM";return n?e.toLowerCase():e},h={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:S.s(a+1,2,"0"),MMM:f(n.monthsShort,a,s,3),MMMM:f(s,a),D:this.$D,DD:S.s(this.$D,2,"0"),d:String(this.$W),dd:f(n.weekdaysMin,this.$W,c,2),ddd:f(n.weekdaysShort,this.$W,c,3),dddd:c[this.$W],H:String(o),HH:S.s(o,2,"0"),h:l(1),hh:l(2),a:v(o,u,!0),A:v(o,u,!1),m:String(u),mm:S.s(u,2,"0"),s:String(this.$s),ss:S.s(this.$s,2,"0"),SSS:S.s(this.$ms,3,"0"),Z:i};return e.replace(y,(function(t,r){return r||h[t]||i.replace(":","")}))},b.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},b.diff=function(e,a,h){var d,p=S.p(a),y=w(e),b=(y.utcOffset()-this.utcOffset())*r,g=this-y,_=S.m(this,y);return _=(d={},d[v]=_/12,d[f]=_,d[l]=_/3,d[s]=(g-b)/6048e5,d[c]=(g-b)/864e5,d[u]=g/n,d[o]=g/r,d[i]=g/t,d)[p]||g,h?_:S.a(_)},b.daysInMonth=function(){return this.endOf(f).$D},b.$locale=function(){return $[this.$L]},b.locale=function(t,r){if(!t)return this.$L;var n=this.clone(),e=O(t,r,!0);return e&&(n.$L=e),n},b.clone=function(){return S.w(this.$d,this)},b.toDate=function(){return new Date(this.valueOf())},b.toJSON=function(){return this.isValid()?this.toISOString():null},b.toISOString=function(){return this.$d.toISOString()},b.toString=function(){return this.$d.toUTCString()},a}(),M=T.prototype;return w.prototype=M,[["$ms",e],["$s",i],["$m",o],["$H",u],["$W",c],["$M",f],["$y",v],["$D",h]].forEach((function(t){M[t[1]]=function(r){return this.$g(r,t[0],t[1])}})),w.extend=function(t,r){return t.$i||(t(r,T,w),t.$i=!0),w},w.locale=O,w.isDayjs=j,w.unix=function(t){return w(1e3*t)},w.en=$[m],w.Ls=$,w.p={},w}()}));function Gr(){return Rr().format("YYYY-MM-DDTHH:mm:ssZ")}var Qr=1/0;var Kr=function(t){return t?(t=I(t))===Qr||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var Xr=function(t){var r=Kr(t),n=r%1;return r==r?n?r-n:r:0};var tn=function(t){return"number"==typeof t&&t==Xr(t)};function rn(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function nn(t){var r=!1;return rn(t)?r=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(r=!0),r}function en(t){return nn(t)?Kr(t):0}var on=function(t,r){for(var n=-1,e=null==t?0:t.length,i=Array(e);++n<e;)i[n]=r(t[n],n,t);return i},un=_?_.prototype:void 0,an=un?un.toString:void 0;var cn=function t(r){if("string"==typeof r)return r;if(ir(r))return on(r,t)+"";if(x(r))return an?an.call(r):"";var n=r+"";return"0"==n&&1/r==-Infinity?"-0":n};var sn=function(t){return null==t?"":cn(t)},fn=h.isFinite,ln=Math.min;var vn=function(t){var r=Math[t];return function(t,n){if(t=I(t),(n=null==n?0:ln(Xr(n),292))&&fn(t)){var e=(sn(t)+"e").split("e"),i=r(e[0]+"e"+(+e[1]+n));return+((e=(sn(i)+"e").split("e"))[0]+"e"+(+e[1]-n))}return r(t)}}("round");function hn(t){if(!nn(t))return 0;t=en(t);var r=vn(t);return"0"===String(r)?0:r}function dn(t){return!!function(t){return!!nn(t)&&(t=en(t),tn(t))}(t)&&hn(t)>0}var pn="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),yn=pn.length;function bn(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,r=[];t=dn(t)?hn(t):32;for(var n=0;n<t;n++)r[n]=pn[0|Math.random()*yn];var e=r.join("");return e}function gn(t){if(function(t){return"[object Object]"===Object.prototype.toString.call(t)}(t)){for(var r in t)return!0;return!1}return!1}function _n(t){if(!rn(t))return{};var r={};try{r=JSON.parse(t)}catch(t){r={}}return r}function mn(t){return"[object Undefined]"===Object.prototype.toString.call(t)}function $n(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(mn(t))return"";var n="";try{n=r?JSON.stringify(t,null,2):JSON.stringify(t)}catch(t){n=""}return n}var jn=i.default.resolve();return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r={};t.fnTableTags||(t.fnTableTags="tableTags.json");var n="".concat(jn,"/").concat(t.fnTableTags),e=new u.default.EventEmitter;function i(t){for(var r=arguments.length,n=new Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];setTimeout((function(){e.emit.apply(e,[t].concat(n))}),1)}function a(){var t={};try{if(o.default.existsSync(n)){var r=_n(o.default.readFileSync(n,"utf8"));gn(r)&&(t=r)}}catch(t){i("error",{msg:"readTableTags catch",err:t})}return t}function c(){try{var t=$n(r);o.default.writeFileSync(n,t,"utf8")}catch(t){i("error",{msg:"writeTableTags catch",err:t})}}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"useInputFirst";r="useStorageFirst"===n?Vr(t,a()):"useInputOnly"===n?t:"useStorageOnly"===n?a():Vr(a(),t),c()}function f(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};r=Vr(r,t),c()}function l(){return r}var v=U((function(){c(),i("changeTableTags",r)}),200);function h(t){r[t]=Gr()+"|"+bn(6),v()}return e.readTableTags=a,e.writeTableTags=c,e.initTableTags=s,e.setTableTags=f,e.getTableTags=l,e.updateTableTag=h,e}}));
//# sourceMappingURL=w-sync-webdata-server.umd.js.map
