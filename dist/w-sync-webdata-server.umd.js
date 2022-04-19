/*!
 * w-sync-webdata-server v1.0.18
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("path"),require("fs")):"function"==typeof define&&define.amd?define(["path","fs"],n):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-sync-webdata-server"]=n(t.path,t.fs)}(this,(function(t,n){"use strict";function r(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var e=r(t),o=r(n),i=Array.isArray;function u(t){return u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(t)}var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function c(t){var n={exports:{}};return t(n,n.exports),n.exports}var s="object"==u(a)&&a&&a.Object===Object&&a,f="object"==("undefined"==typeof self?"undefined":u(self))&&self&&self.Object===Object&&self,l=s||f||Function("return this")(),v=l.Symbol,h=Object.prototype,p=h.hasOwnProperty,d=h.toString,y=v?v.toStringTag:void 0;var b=function(t){var n=p.call(t,y),r=t[y];try{t[y]=void 0;var e=!0}catch(t){}var o=d.call(t);return e&&(n?t[y]=r:delete t[y]),o},_=Object.prototype.toString;var g=function(t){return _.call(t)},m=v?v.toStringTag:void 0;var $=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":m&&m in Object(t)?b(t):g(t)};var j=function(t){return null!=t&&"object"==u(t)};var w=function(t){return"symbol"==u(t)||j(t)&&"[object Symbol]"==$(t)},O=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,S=/^\w*$/;var T=function(t,n){if(i(t))return!1;var r=u(t);return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!w(t))||(S.test(t)||!O.test(t)||null!=n&&t in Object(n))};var M=function(t){var n=u(t);return null!=t&&("object"==n||"function"==n)};var x,D=function(t){if(!M(t))return!1;var n=$(t);return"[object Function]"==n||"[object GeneratorFunction]"==n||"[object AsyncFunction]"==n||"[object Proxy]"==n},A=l["__core-js_shared__"],z=(x=/[^.]+$/.exec(A&&A.keys&&A.keys.IE_PROTO||""))?"Symbol(src)_1."+x:"";var C=function(t){return!!z&&z in t},F=Function.prototype.toString;var N=function(t){if(null!=t){try{return F.call(t)}catch(t){}try{return t+""}catch(t){}}return""},P=/^\[object .+?Constructor\]$/,L=Function.prototype,Y=Object.prototype,I=L.toString,k=Y.hasOwnProperty,H=RegExp("^"+I.call(k).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var E=function(t){return!(!M(t)||C(t))&&(D(t)?H:P).test(N(t))};var U=function(t,n){return null==t?void 0:t[n]};var W=function(t,n){var r=U(t,n);return E(r)?r:void 0},J=W(Object,"create");var B=function(){this.__data__=J?J(null):{},this.size=0};var q=function(t){var n=this.has(t)&&delete this.__data__[t];return this.size-=n?1:0,n},Z=Object.prototype.hasOwnProperty;var V=function(t){var n=this.__data__;if(J){var r=n[t];return"__lodash_hash_undefined__"===r?void 0:r}return Z.call(n,t)?n[t]:void 0},R=Object.prototype.hasOwnProperty;var G=function(t){var n=this.__data__;return J?void 0!==n[t]:R.call(n,t)};var Q=function(t,n){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=J&&void 0===n?"__lodash_hash_undefined__":n,this};function K(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}K.prototype.clear=B,K.prototype.delete=q,K.prototype.get=V,K.prototype.has=G,K.prototype.set=Q;var X=K;var tt=function(){this.__data__=[],this.size=0};var nt=function(t,n){return t===n||t!=t&&n!=n};var rt=function(t,n){for(var r=t.length;r--;)if(nt(t[r][0],n))return r;return-1},et=Array.prototype.splice;var ot=function(t){var n=this.__data__,r=rt(n,t);return!(r<0)&&(r==n.length-1?n.pop():et.call(n,r,1),--this.size,!0)};var it=function(t){var n=this.__data__,r=rt(n,t);return r<0?void 0:n[r][1]};var ut=function(t){return rt(this.__data__,t)>-1};var at=function(t,n){var r=this.__data__,e=rt(r,t);return e<0?(++this.size,r.push([t,n])):r[e][1]=n,this};function ct(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}ct.prototype.clear=tt,ct.prototype.delete=ot,ct.prototype.get=it,ct.prototype.has=ut,ct.prototype.set=at;var st=ct,ft=W(l,"Map");var lt=function(){this.size=0,this.__data__={hash:new X,map:new(ft||st),string:new X}};var vt=function(t){var n=u(t);return"string"==n||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==t:null===t};var ht=function(t,n){var r=t.__data__;return vt(n)?r["string"==typeof n?"string":"hash"]:r.map};var pt=function(t){var n=ht(this,t).delete(t);return this.size-=n?1:0,n};var dt=function(t){return ht(this,t).get(t)};var yt=function(t){return ht(this,t).has(t)};var bt=function(t,n){var r=ht(this,t),e=r.size;return r.set(t,n),this.size+=r.size==e?0:1,this};function _t(t){var n=-1,r=null==t?0:t.length;for(this.clear();++n<r;){var e=t[n];this.set(e[0],e[1])}}_t.prototype.clear=lt,_t.prototype.delete=pt,_t.prototype.get=dt,_t.prototype.has=yt,_t.prototype.set=bt;var gt=_t;function mt(t,n){if("function"!=typeof t||null!=n&&"function"!=typeof n)throw new TypeError("Expected a function");var r=function r(){var e=arguments,o=n?n.apply(this,e):e[0],i=r.cache;if(i.has(o))return i.get(o);var u=t.apply(this,e);return r.cache=i.set(o,u)||i,u};return r.cache=new(mt.Cache||gt),r}mt.Cache=gt;var $t=mt;var jt=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,wt=/\\(\\)?/g,Ot=function(t){var n=$t(t,(function(t){return 500===r.size&&r.clear(),t})),r=n.cache;return n}((function(t){var n=[];return 46===t.charCodeAt(0)&&n.push(""),t.replace(jt,(function(t,r,e,o){n.push(e?o.replace(wt,"$1"):r||t)})),n}));var St=function(t,n){for(var r=-1,e=null==t?0:t.length,o=Array(e);++r<e;)o[r]=n(t[r],r,t);return o},Tt=v?v.prototype:void 0,Mt=Tt?Tt.toString:void 0;var xt=function t(n){if("string"==typeof n)return n;if(i(n))return St(n,t)+"";if(w(n))return Mt?Mt.call(n):"";var r=n+"";return"0"==r&&1/n==-Infinity?"-0":r};var Dt=function(t){return null==t?"":xt(t)};var At=function(t,n){return i(t)?t:T(t,n)?[t]:Ot(Dt(t))};var zt=function(t){if("string"==typeof t||w(t))return t;var n=t+"";return"0"==n&&1/t==-Infinity?"-0":n};var Ct=function(t,n){for(var r=0,e=(n=At(n,t)).length;null!=t&&r<e;)t=t[zt(n[r++])];return r&&r==e?t:void 0};var Ft=function(t,n,r){var e=null==t?void 0:Ct(t,n);return void 0===e?r:e},Nt=function(){return l.Date.now()},Pt=/\s/;var Lt=function(t){for(var n=t.length;n--&&Pt.test(t.charAt(n)););return n},Yt=/^\s+/;var It=function(t){return t?t.slice(0,Lt(t)+1).replace(Yt,""):t},kt=/^[-+]0x[0-9a-f]+$/i,Ht=/^0b[01]+$/i,Et=/^0o[0-7]+$/i,Ut=parseInt;var Wt=function(t){if("number"==typeof t)return t;if(w(t))return NaN;if(M(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=M(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=It(t);var r=Ht.test(t);return r||Et.test(t)?Ut(t.slice(2),r?2:8):kt.test(t)?NaN:+t},Jt=Math.max,Bt=Math.min;var qt=function(t,n,r){var e,o,i,u,a,c,s=0,f=!1,l=!1,v=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function h(n){var r=e,i=o;return e=o=void 0,s=n,u=t.apply(i,r)}function p(t){return s=t,a=setTimeout(y,n),f?h(t):u}function d(t){var r=t-c;return void 0===c||r>=n||r<0||l&&t-s>=i}function y(){var t=Nt();if(d(t))return b(t);a=setTimeout(y,function(t){var r=n-(t-c);return l?Bt(r,i-(t-s)):r}(t))}function b(t){return a=void 0,v&&e?h(t):(e=o=void 0,u)}function _(){var t=Nt(),r=d(t);if(e=arguments,o=this,c=t,r){if(void 0===a)return p(c);if(l)return clearTimeout(a),a=setTimeout(y,n),h(c)}return void 0===a&&(a=setTimeout(y,n)),u}return n=Wt(n)||0,M(r)&&(f=!!r.leading,i=(l="maxWait"in r)?Jt(Wt(r.maxWait)||0,n):i,v="trailing"in r?!!r.trailing:v),_.cancel=function(){void 0!==a&&clearTimeout(a),s=0,e=c=o=a=void 0},_.flush=function(){return void 0===a?u:b(Nt())},_};var Zt=function(){this.__data__=new st,this.size=0};var Vt=function(t){var n=this.__data__,r=n.delete(t);return this.size=n.size,r};var Rt=function(t){return this.__data__.get(t)};var Gt=function(t){return this.__data__.has(t)};var Qt=function(t,n){var r=this.__data__;if(r instanceof st){var e=r.__data__;if(!ft||e.length<199)return e.push([t,n]),this.size=++r.size,this;r=this.__data__=new gt(e)}return r.set(t,n),this.size=r.size,this};function Kt(t){var n=this.__data__=new st(t);this.size=n.size}Kt.prototype.clear=Zt,Kt.prototype.delete=Vt,Kt.prototype.get=Rt,Kt.prototype.has=Gt,Kt.prototype.set=Qt;var Xt=Kt,tn=function(){try{var t=W(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var nn=function(t,n,r){"__proto__"==n&&tn?tn(t,n,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[n]=r};var rn=function(t,n,r){(void 0!==r&&!nt(t[n],r)||void 0===r&&!(n in t))&&nn(t,n,r)};var en=function(t){return function(n,r,e){for(var o=-1,i=Object(n),u=e(n),a=u.length;a--;){var c=u[t?a:++o];if(!1===r(i[c],c,i))break}return n}}(),on=c((function(t,n){var r=n&&!n.nodeType&&n,e=r&&t&&!t.nodeType&&t,o=e&&e.exports===r?l.Buffer:void 0,i=o?o.allocUnsafe:void 0;t.exports=function(t,n){if(n)return t.slice();var r=t.length,e=i?i(r):new t.constructor(r);return t.copy(e),e}})),un=l.Uint8Array;var an=function(t){var n=new t.constructor(t.byteLength);return new un(n).set(new un(t)),n};var cn=function(t,n){var r=n?an(t.buffer):t.buffer;return new t.constructor(r,t.byteOffset,t.length)};var sn=function(t,n){var r=-1,e=t.length;for(n||(n=Array(e));++r<e;)n[r]=t[r];return n},fn=Object.create,ln=function(){function t(){}return function(n){if(!M(n))return{};if(fn)return fn(n);t.prototype=n;var r=new t;return t.prototype=void 0,r}}();var vn=function(t,n){return function(r){return t(n(r))}}(Object.getPrototypeOf,Object),hn=Object.prototype;var pn=function(t){var n=t&&t.constructor;return t===("function"==typeof n&&n.prototype||hn)};var dn=function(t){return"function"!=typeof t.constructor||pn(t)?{}:ln(vn(t))};var yn=function(t){return j(t)&&"[object Arguments]"==$(t)},bn=Object.prototype,_n=bn.hasOwnProperty,gn=bn.propertyIsEnumerable,mn=yn(function(){return arguments}())?yn:function(t){return j(t)&&_n.call(t,"callee")&&!gn.call(t,"callee")},$n=mn;var jn=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var wn=function(t){return null!=t&&jn(t.length)&&!D(t)};var On=function(t){return j(t)&&wn(t)};var Sn=function(){return!1},Tn=c((function(t,n){var r=n&&!n.nodeType&&n,e=r&&t&&!t.nodeType&&t,o=e&&e.exports===r?l.Buffer:void 0,i=(o?o.isBuffer:void 0)||Sn;t.exports=i})),Mn=Function.prototype,xn=Object.prototype,Dn=Mn.toString,An=xn.hasOwnProperty,zn=Dn.call(Object);var Cn=function(t){if(!j(t)||"[object Object]"!=$(t))return!1;var n=vn(t);if(null===n)return!0;var r=An.call(n,"constructor")&&n.constructor;return"function"==typeof r&&r instanceof r&&Dn.call(r)==zn},Fn={};Fn["[object Float32Array]"]=Fn["[object Float64Array]"]=Fn["[object Int8Array]"]=Fn["[object Int16Array]"]=Fn["[object Int32Array]"]=Fn["[object Uint8Array]"]=Fn["[object Uint8ClampedArray]"]=Fn["[object Uint16Array]"]=Fn["[object Uint32Array]"]=!0,Fn["[object Arguments]"]=Fn["[object Array]"]=Fn["[object ArrayBuffer]"]=Fn["[object Boolean]"]=Fn["[object DataView]"]=Fn["[object Date]"]=Fn["[object Error]"]=Fn["[object Function]"]=Fn["[object Map]"]=Fn["[object Number]"]=Fn["[object Object]"]=Fn["[object RegExp]"]=Fn["[object Set]"]=Fn["[object String]"]=Fn["[object WeakMap]"]=!1;var Nn=function(t){return j(t)&&jn(t.length)&&!!Fn[$(t)]};var Pn=function(t){return function(n){return t(n)}},Ln=c((function(t,n){var r=n&&!n.nodeType&&n,e=r&&t&&!t.nodeType&&t,o=e&&e.exports===r&&s.process,i=function(){try{var t=e&&e.require&&e.require("util").types;return t||o&&o.binding&&o.binding("util")}catch(t){}}();t.exports=i})),Yn=Ln&&Ln.isTypedArray,In=Yn?Pn(Yn):Nn;var kn=function(t,n){if(("constructor"!==n||"function"!=typeof t[n])&&"__proto__"!=n)return t[n]},Hn=Object.prototype.hasOwnProperty;var En=function(t,n,r){var e=t[n];Hn.call(t,n)&&nt(e,r)&&(void 0!==r||n in t)||nn(t,n,r)};var Un=function(t,n,r,e){var o=!r;r||(r={});for(var i=-1,u=n.length;++i<u;){var a=n[i],c=e?e(r[a],t[a],a,r,t):void 0;void 0===c&&(c=t[a]),o?nn(r,a,c):En(r,a,c)}return r};var Wn=function(t,n){for(var r=-1,e=Array(t);++r<t;)e[r]=n(r);return e},Jn=/^(?:0|[1-9]\d*)$/;var Bn=function(t,n){var r=u(t);return!!(n=null==n?9007199254740991:n)&&("number"==r||"symbol"!=r&&Jn.test(t))&&t>-1&&t%1==0&&t<n},qn=Object.prototype.hasOwnProperty;var Zn=function(t,n){var r=i(t),e=!r&&$n(t),o=!r&&!e&&Tn(t),u=!r&&!e&&!o&&In(t),a=r||e||o||u,c=a?Wn(t.length,String):[],s=c.length;for(var f in t)!n&&!qn.call(t,f)||a&&("length"==f||o&&("offset"==f||"parent"==f)||u&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||Bn(f,s))||c.push(f);return c};var Vn=function(t){var n=[];if(null!=t)for(var r in Object(t))n.push(r);return n},Rn=Object.prototype.hasOwnProperty;var Gn=function(t){if(!M(t))return Vn(t);var n=pn(t),r=[];for(var e in t)("constructor"!=e||!n&&Rn.call(t,e))&&r.push(e);return r};var Qn=function(t){return wn(t)?Zn(t,!0):Gn(t)};var Kn=function(t){return Un(t,Qn(t))};var Xn=function(t,n,r,e,o,u,a){var c=kn(t,r),s=kn(n,r),f=a.get(s);if(f)rn(t,r,f);else{var l=u?u(c,s,r+"",t,n,a):void 0,v=void 0===l;if(v){var h=i(s),p=!h&&Tn(s),d=!h&&!p&&In(s);l=s,h||p||d?i(c)?l=c:On(c)?l=sn(c):p?(v=!1,l=on(s,!0)):d?(v=!1,l=cn(s,!0)):l=[]:Cn(s)||$n(s)?(l=c,$n(c)?l=Kn(c):M(c)&&!D(c)||(l=dn(s))):v=!1}v&&(a.set(s,l),o(l,s,e,u,a),a.delete(s)),rn(t,r,l)}};var tr=function t(n,r,e,o,i){n!==r&&en(r,(function(u,a){if(i||(i=new Xt),M(u))Xn(n,r,a,e,t,o,i);else{var c=o?o(kn(n,a),u,a+"",n,r,i):void 0;void 0===c&&(c=u),rn(n,a,c)}}),Qn)};var nr=function(t){return t};var rr=function(t,n,r){switch(r.length){case 0:return t.call(n);case 1:return t.call(n,r[0]);case 2:return t.call(n,r[0],r[1]);case 3:return t.call(n,r[0],r[1],r[2])}return t.apply(n,r)},er=Math.max;var or=function(t,n,r){return n=er(void 0===n?t.length-1:n,0),function(){for(var e=arguments,o=-1,i=er(e.length-n,0),u=Array(i);++o<i;)u[o]=e[n+o];o=-1;for(var a=Array(n+1);++o<n;)a[o]=e[o];return a[n]=r(u),rr(t,this,a)}};var ir=function(t){return function(){return t}},ur=tn?function(t,n){return tn(t,"toString",{configurable:!0,enumerable:!1,value:ir(n),writable:!0})}:nr,ar=Date.now;var cr=function(t){var n=0,r=0;return function(){var e=ar(),o=16-(e-r);if(r=e,o>0){if(++n>=800)return arguments[0]}else n=0;return t.apply(void 0,arguments)}},sr=cr(ur);var fr=function(t,n){return sr(or(t,n,nr),t+"")};var lr=function(t,n,r){if(!M(r))return!1;var e=u(n);return!!("number"==e?wn(r)&&Bn(n,r.length):"string"==e&&n in r)&&nt(r[n],t)};var vr=function(t){return fr((function(n,r){var e=-1,o=r.length,i=o>1?r[o-1]:void 0,u=o>2?r[2]:void 0;for(i=t.length>3&&"function"==typeof i?(o--,i):void 0,u&&lr(r[0],r[1],u)&&(i=o<3?void 0:i,o=1),n=Object(n);++e<o;){var a=r[e];a&&t(n,a,e,i)}return n}))}((function(t,n,r){tr(t,n,r)})),hr=c((function(t,n){t.exports=function(){var t=1e3,n=6e4,r=36e5,e="millisecond",o="second",i="minute",a="hour",c="day",s="week",f="month",l="quarter",v="year",h="date",p="Invalid Date",d=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,b={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},_=function(t,n,r){var e=String(t);return!e||e.length>=n?t:""+Array(n+1-e.length).join(r)+t},g={s:_,z:function(t){var n=-t.utcOffset(),r=Math.abs(n),e=Math.floor(r/60),o=r%60;return(n<=0?"+":"-")+_(e,2,"0")+":"+_(o,2,"0")},m:function t(n,r){if(n.date()<r.date())return-t(r,n);var e=12*(r.year()-n.year())+(r.month()-n.month()),o=n.clone().add(e,f),i=r-o<0,u=n.clone().add(e+(i?-1:1),f);return+(-(e+(r-o)/(i?o-u:u-o))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:f,y:v,w:s,d:c,D:h,h:a,m:i,s:o,ms:e,Q:l}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},m="en",$={};$[m]=b;var j=function(t){return t instanceof T},w=function t(n,r,e){var o;if(!n)return m;if("string"==typeof n){var i=n.toLowerCase();$[i]&&(o=i),r&&($[i]=r,o=i);var u=n.split("-");if(!o&&u.length>1)return t(u[0])}else{var a=n.name;$[a]=n,o=a}return!e&&o&&(m=o),o||!e&&m},O=function(t,n){if(j(t))return t.clone();var r="object"==u(n)?n:{};return r.date=t,r.args=arguments,new T(r)},S=g;S.l=w,S.i=j,S.w=function(t,n){return O(t,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var T=function(){function u(t){this.$L=w(t.locale,null,!0),this.parse(t)}var b=u.prototype;return b.parse=function(t){this.$d=function(t){var n=t.date,r=t.utc;if(null===n)return new Date(NaN);if(S.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var e=n.match(d);if(e){var o=e[2]-1||0,i=(e[7]||"0").substring(0,3);return r?new Date(Date.UTC(e[1],o,e[3]||1,e[4]||0,e[5]||0,e[6]||0,i)):new Date(e[1],o,e[3]||1,e[4]||0,e[5]||0,e[6]||0,i)}}return new Date(n)}(t),this.$x=t.x||{},this.init()},b.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},b.$utils=function(){return S},b.isValid=function(){return!(this.$d.toString()===p)},b.isSame=function(t,n){var r=O(t);return this.startOf(n)<=r&&r<=this.endOf(n)},b.isAfter=function(t,n){return O(t)<this.startOf(n)},b.isBefore=function(t,n){return this.endOf(n)<O(t)},b.$g=function(t,n,r){return S.u(t)?this[n]:this.set(r,t)},b.unix=function(){return Math.floor(this.valueOf()/1e3)},b.valueOf=function(){return this.$d.getTime()},b.startOf=function(t,n){var r=this,e=!!S.u(n)||n,u=S.p(t),l=function(t,n){var o=S.w(r.$u?Date.UTC(r.$y,n,t):new Date(r.$y,n,t),r);return e?o:o.endOf(c)},p=function(t,n){return S.w(r.toDate()[t].apply(r.toDate("s"),(e?[0,0,0,0]:[23,59,59,999]).slice(n)),r)},d=this.$W,y=this.$M,b=this.$D,_="set"+(this.$u?"UTC":"");switch(u){case v:return e?l(1,0):l(31,11);case f:return e?l(1,y):l(0,y+1);case s:var g=this.$locale().weekStart||0,m=(d<g?d+7:d)-g;return l(e?b-m:b+(6-m),y);case c:case h:return p(_+"Hours",0);case a:return p(_+"Minutes",1);case i:return p(_+"Seconds",2);case o:return p(_+"Milliseconds",3);default:return this.clone()}},b.endOf=function(t){return this.startOf(t,!1)},b.$set=function(t,n){var r,u=S.p(t),s="set"+(this.$u?"UTC":""),l=(r={},r[c]=s+"Date",r[h]=s+"Date",r[f]=s+"Month",r[v]=s+"FullYear",r[a]=s+"Hours",r[i]=s+"Minutes",r[o]=s+"Seconds",r[e]=s+"Milliseconds",r)[u],p=u===c?this.$D+(n-this.$W):n;if(u===f||u===v){var d=this.clone().set(h,1);d.$d[l](p),d.init(),this.$d=d.set(h,Math.min(this.$D,d.daysInMonth())).$d}else l&&this.$d[l](p);return this.init(),this},b.set=function(t,n){return this.clone().$set(t,n)},b.get=function(t){return this[S.p(t)]()},b.add=function(e,u){var l,h=this;e=Number(e);var p=S.p(u),d=function(t){var n=O(h);return S.w(n.date(n.date()+Math.round(t*e)),h)};if(p===f)return this.set(f,this.$M+e);if(p===v)return this.set(v,this.$y+e);if(p===c)return d(1);if(p===s)return d(7);var y=(l={},l[i]=n,l[a]=r,l[o]=t,l)[p]||1,b=this.$d.getTime()+e*y;return S.w(b,this)},b.subtract=function(t,n){return this.add(-1*t,n)},b.format=function(t){var n=this,r=this.$locale();if(!this.isValid())return r.invalidDate||p;var e=t||"YYYY-MM-DDTHH:mm:ssZ",o=S.z(this),i=this.$H,u=this.$m,a=this.$M,c=r.weekdays,s=r.months,f=function(t,r,o,i){return t&&(t[r]||t(n,e))||o[r].substr(0,i)},l=function(t){return S.s(i%12||12,t,"0")},v=r.meridiem||function(t,n,r){var e=t<12?"AM":"PM";return r?e.toLowerCase():e},h={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:S.s(a+1,2,"0"),MMM:f(r.monthsShort,a,s,3),MMMM:f(s,a),D:this.$D,DD:S.s(this.$D,2,"0"),d:String(this.$W),dd:f(r.weekdaysMin,this.$W,c,2),ddd:f(r.weekdaysShort,this.$W,c,3),dddd:c[this.$W],H:String(i),HH:S.s(i,2,"0"),h:l(1),hh:l(2),a:v(i,u,!0),A:v(i,u,!1),m:String(u),mm:S.s(u,2,"0"),s:String(this.$s),ss:S.s(this.$s,2,"0"),SSS:S.s(this.$ms,3,"0"),Z:o};return e.replace(y,(function(t,n){return n||h[t]||o.replace(":","")}))},b.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},b.diff=function(e,u,h){var p,d=S.p(u),y=O(e),b=(y.utcOffset()-this.utcOffset())*n,_=this-y,g=S.m(this,y);return g=(p={},p[v]=g/12,p[f]=g,p[l]=g/3,p[s]=(_-b)/6048e5,p[c]=(_-b)/864e5,p[a]=_/r,p[i]=_/n,p[o]=_/t,p)[d]||_,h?g:S.a(g)},b.daysInMonth=function(){return this.endOf(f).$D},b.$locale=function(){return $[this.$L]},b.locale=function(t,n){if(!t)return this.$L;var r=this.clone(),e=w(t,n,!0);return e&&(r.$L=e),r},b.clone=function(){return S.w(this.$d,this)},b.toDate=function(){return new Date(this.valueOf())},b.toJSON=function(){return this.isValid()?this.toISOString():null},b.toISOString=function(){return this.$d.toISOString()},b.toString=function(){return this.$d.toUTCString()},u}(),M=T.prototype;return O.prototype=M,[["$ms",e],["$s",o],["$m",i],["$H",a],["$W",c],["$M",f],["$y",v],["$D",h]].forEach((function(t){M[t[1]]=function(n){return this.$g(n,t[0],t[1])}})),O.extend=function(t,n){return t.$i||(t(n,T,O),t.$i=!0),O},O.locale=w,O.isDayjs=j,O.unix=function(t){return O(1e3*t)},O.en=$[m],O.Ls=$,O.p={},O}()}));function pr(){return hr().format("YYYY-MM-DDTHH:mm:ssZ")}var dr=1/0;var yr=function(t){return t?(t=Wt(t))===dr||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var br=function(t){var n=yr(t),r=n%1;return n==n?r?n-r:n:0};var _r=function(t){return"number"==typeof t&&t==br(t)};function gr(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function mr(t){var n=!1;return gr(t)?n=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(n=!0),n}function $r(t){return mr(t)?yr(t):0}var jr=l.isFinite,wr=Math.min;var Or=function(t){var n=Math[t];return function(t,r){if(t=Wt(t),(r=null==r?0:wr(br(r),292))&&jr(t)){var e=(Dt(t)+"e").split("e"),o=n(e[0]+"e"+(+e[1]+r));return+((e=(Dt(o)+"e").split("e"))[0]+"e"+(+e[1]-r))}return n(t)}}("round");function Sr(t){if(!mr(t))return 0;t=$r(t);var n=Or(t);return"0"===String(n)?0:n}function Tr(t){return!!function(t){return!!mr(t)&&(t=$r(t),_r(t))}(t)&&Sr(t)>0}var Mr="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),xr=Mr.length;function Dr(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,n=[];t=Tr(t)?Sr(t):32;for(var r=0;r<t;r++)n[r]=Mr[0|Math.random()*xr];var e=n.join("");return e}var Ar=c((function(t){var n=Object.prototype.hasOwnProperty,r="~";function e(){}function o(t,n,r){this.fn=t,this.context=n,this.once=r||!1}function i(t,n,e,i,u){if("function"!=typeof e)throw new TypeError("The listener must be a function");var a=new o(e,i||t,u),c=r?r+n:n;return t._events[c]?t._events[c].fn?t._events[c]=[t._events[c],a]:t._events[c].push(a):(t._events[c]=a,t._eventsCount++),t}function u(t,n){0==--t._eventsCount?t._events=new e:delete t._events[n]}function a(){this._events=new e,this._eventsCount=0}Object.create&&(e.prototype=Object.create(null),(new e).__proto__||(r=!1)),a.prototype.eventNames=function(){var t,e,o=[];if(0===this._eventsCount)return o;for(e in t=this._events)n.call(t,e)&&o.push(r?e.slice(1):e);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(t)):o},a.prototype.listeners=function(t){var n=r?r+t:t,e=this._events[n];if(!e)return[];if(e.fn)return[e.fn];for(var o=0,i=e.length,u=new Array(i);o<i;o++)u[o]=e[o].fn;return u},a.prototype.listenerCount=function(t){var n=r?r+t:t,e=this._events[n];return e?e.fn?1:e.length:0},a.prototype.emit=function(t,n,e,o,i,u){var a=r?r+t:t;if(!this._events[a])return!1;var c,s,f=this._events[a],l=arguments.length;if(f.fn){switch(f.once&&this.removeListener(t,f.fn,void 0,!0),l){case 1:return f.fn.call(f.context),!0;case 2:return f.fn.call(f.context,n),!0;case 3:return f.fn.call(f.context,n,e),!0;case 4:return f.fn.call(f.context,n,e,o),!0;case 5:return f.fn.call(f.context,n,e,o,i),!0;case 6:return f.fn.call(f.context,n,e,o,i,u),!0}for(s=1,c=new Array(l-1);s<l;s++)c[s-1]=arguments[s];f.fn.apply(f.context,c)}else{var v,h=f.length;for(s=0;s<h;s++)switch(f[s].once&&this.removeListener(t,f[s].fn,void 0,!0),l){case 1:f[s].fn.call(f[s].context);break;case 2:f[s].fn.call(f[s].context,n);break;case 3:f[s].fn.call(f[s].context,n,e);break;case 4:f[s].fn.call(f[s].context,n,e,o);break;default:if(!c)for(v=1,c=new Array(l-1);v<l;v++)c[v-1]=arguments[v];f[s].fn.apply(f[s].context,c)}}return!0},a.prototype.on=function(t,n,r){return i(this,t,n,r,!1)},a.prototype.once=function(t,n,r){return i(this,t,n,r,!0)},a.prototype.removeListener=function(t,n,e,o){var i=r?r+t:t;if(!this._events[i])return this;if(!n)return u(this,i),this;var a=this._events[i];if(a.fn)a.fn!==n||o&&!a.once||e&&a.context!==e||u(this,i);else{for(var c=0,s=[],f=a.length;c<f;c++)(a[c].fn!==n||o&&!a[c].once||e&&a[c].context!==e)&&s.push(a[c]);s.length?this._events[i]=1===s.length?s[0]:s:u(this,i)}return this},a.prototype.removeAllListeners=function(t){var n;return t?(n=r?r+t:t,this._events[n]&&u(this,n)):(this._events=new e,this._eventsCount=0),this},a.prototype.off=a.prototype.removeListener,a.prototype.addListener=a.prototype.on,a.prefixed=r,a.EventEmitter=a,t.exports=a}));function zr(){return new Ar}function Cr(t){if(function(t){return"[object Object]"===Object.prototype.toString.call(t)}(t)){for(var n in t)return!0;return!1}return!1}function Fr(t){if(!gr(t))return{};var n={};try{n=JSON.parse(t)}catch(t){n={}}return n}function Nr(t){return"[object Undefined]"===Object.prototype.toString.call(t)}function Pr(t){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(Nr(t))return"";var r="";try{r=n?JSON.stringify(t,null,2):JSON.stringify(t)}catch(t){r=""}return r}var Lr=e.default.resolve();return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n={},r=Ft(t,"fnTableTags");gr(r)||(r="tableTags.json"),r="".concat(Lr,"/").concat(r);var e=zr();function i(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];setTimeout((function(){e.emit.apply(e,[t].concat(r))}),1)}function u(){var t={};try{if(o.default.existsSync(r)){var n=Fr(o.default.readFileSync(r,"utf8"));Cr(n)&&(t=n)}}catch(t){i("error",{msg:"readTableTags catch",err:t})}return t}function a(){try{var t=Pr(n);o.default.writeFileSync(r,t,"utf8")}catch(t){i("error",{msg:"writeTableTags catch",err:t})}}function c(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"useInputFirst";n="useStorageFirst"===r?vr(t,u()):"useInputOnly"===r?t:"useStorageOnly"===r?u():vr(u(),t),a()}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};n=vr(n,t),a()}function f(){return n}var l=qt((function(){a(),i("changeTableTags",n)}),200);function v(t){n[t]=pr()+"|"+Dr(6),l()}return e.readTableTags=u,e.writeTableTags=a,e.initTableTags=c,e.setTableTags=s,e.getTableTags=f,e.updateTableTag=v,e}}));
//# sourceMappingURL=w-sync-webdata-server.umd.js.map
