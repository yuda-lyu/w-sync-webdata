/*!
 * w-sync-webdata-server v1.0.4
 * (c) 2018-2019 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,r){"object"==typeof exports&&"undefined"!=typeof module?module.exports=r(require("path"),require("fs"),require("events")):"function"==typeof define&&define.amd?define(["path","fs","events"],r):(t=t||self)["w-sync-webdata-server"]=r(t.path,t.fs,t.events)}(this,(function(t,r,n){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function i(t,r){return t(r={exports:{}},r.exports),r.exports}var o=i((function(t){function r(n){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=r=function(t){return typeof t}:t.exports=r=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(n)}t.exports=r}));var u=function(t){var r=o(t);return null!=t&&("object"==r||"function"==r)},a="object"==o(e)&&e&&e.Object===Object&&e,c="object"==("undefined"==typeof self?"undefined":o(self))&&self&&self.Object===Object&&self,s=a||c||Function("return this")(),f=function(){return s.Date.now()},l=s.Symbol,v=Object.prototype,h=v.hasOwnProperty,d=v.toString,p=l?l.toStringTag:void 0;var y=function(t){var r=h.call(t,p),n=t[p];try{t[p]=void 0;var e=!0}catch(t){}var i=d.call(t);return e&&(r?t[p]=n:delete t[p]),i},b=Object.prototype.toString;var g=function(t){return b.call(t)},_=l?l.toStringTag:void 0;var m=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":_&&_ in Object(t)?y(t):g(t)};var $=function(t){return null!=t&&"object"==o(t)};var j=function(t){return"symbol"==o(t)||$(t)&&"[object Symbol]"==m(t)},O=/^\s+|\s+$/g,w=/^[-+]0x[0-9a-f]+$/i,S=/^0b[01]+$/i,T=/^0o[0-7]+$/i,M=parseInt;var D=function(t){if("number"==typeof t)return t;if(j(t))return NaN;if(u(t)){var r="function"==typeof t.valueOf?t.valueOf():t;t=u(r)?r+"":r}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(O,"");var n=S.test(t);return n||T.test(t)?M(t.slice(2),n?2:8):w.test(t)?NaN:+t},A=Math.max,x=Math.min;var z=function(t,r,n){var e,i,o,a,c,s,l=0,v=!1,h=!1,d=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function p(r){var n=e,o=i;return e=i=void 0,l=r,a=t.apply(o,n)}function y(t){return l=t,c=setTimeout(g,r),v?p(t):a}function b(t){var n=t-s;return void 0===s||n>=r||n<0||h&&t-l>=o}function g(){var t=f();if(b(t))return _(t);c=setTimeout(g,function(t){var n=r-(t-s);return h?x(n,o-(t-l)):n}(t))}function _(t){return c=void 0,d&&e?p(t):(e=i=void 0,a)}function m(){var t=f(),n=b(t);if(e=arguments,i=this,s=t,n){if(void 0===c)return y(s);if(h)return clearTimeout(c),c=setTimeout(g,r),p(s)}return void 0===c&&(c=setTimeout(g,r)),a}return r=D(r)||0,u(n)&&(v=!!n.leading,o=(h="maxWait"in n)?A(D(n.maxWait)||0,r):o,d="trailing"in n?!!n.trailing:d),m.cancel=function(){void 0!==c&&clearTimeout(c),l=0,e=s=i=c=void 0},m.flush=function(){return void 0===c?a:_(f())},m};var F=function(){this.__data__=[],this.size=0};var N=function(t,r){return t===r||t!=t&&r!=r};var P=function(t,r){for(var n=t.length;n--;)if(N(t[n][0],r))return n;return-1},Y=Array.prototype.splice;var I=function(t){var r=this.__data__,n=P(r,t);return!(n<0)&&(n==r.length-1?r.pop():Y.call(r,n,1),--this.size,!0)};var H=function(t){var r=this.__data__,n=P(r,t);return n<0?void 0:r[n][1]};var U=function(t){return P(this.__data__,t)>-1};var W=function(t,r){var n=this.__data__,e=P(n,t);return e<0?(++this.size,n.push([t,r])):n[e][1]=r,this};function L(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}L.prototype.clear=F,L.prototype.delete=I,L.prototype.get=H,L.prototype.has=U,L.prototype.set=W;var k=L;var C=function(){this.__data__=new k,this.size=0};var E=function(t){var r=this.__data__,n=r.delete(t);return this.size=r.size,n};var J=function(t){return this.__data__.get(t)};var q=function(t){return this.__data__.has(t)};var B,Z=function(t){if(!u(t))return!1;var r=m(t);return"[object Function]"==r||"[object GeneratorFunction]"==r||"[object AsyncFunction]"==r||"[object Proxy]"==r},V=s["__core-js_shared__"],R=(B=/[^.]+$/.exec(V&&V.keys&&V.keys.IE_PROTO||""))?"Symbol(src)_1."+B:"";var G=function(t){return!!R&&R in t},Q=Function.prototype.toString;var K=function(t){if(null!=t){try{return Q.call(t)}catch(t){}try{return t+""}catch(t){}}return""},X=/^\[object .+?Constructor\]$/,tt=Function.prototype,rt=Object.prototype,nt=tt.toString,et=rt.hasOwnProperty,it=RegExp("^"+nt.call(et).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var ot=function(t){return!(!u(t)||G(t))&&(Z(t)?it:X).test(K(t))};var ut=function(t,r){return null==t?void 0:t[r]};var at=function(t,r){var n=ut(t,r);return ot(n)?n:void 0},ct=at(s,"Map"),st=at(Object,"create");var ft=function(){this.__data__=st?st(null):{},this.size=0};var lt=function(t){var r=this.has(t)&&delete this.__data__[t];return this.size-=r?1:0,r},vt=Object.prototype.hasOwnProperty;var ht=function(t){var r=this.__data__;if(st){var n=r[t];return"__lodash_hash_undefined__"===n?void 0:n}return vt.call(r,t)?r[t]:void 0},dt=Object.prototype.hasOwnProperty;var pt=function(t){var r=this.__data__;return st?void 0!==r[t]:dt.call(r,t)};var yt=function(t,r){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=st&&void 0===r?"__lodash_hash_undefined__":r,this};function bt(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}bt.prototype.clear=ft,bt.prototype.delete=lt,bt.prototype.get=ht,bt.prototype.has=pt,bt.prototype.set=yt;var gt=bt;var _t=function(){this.size=0,this.__data__={hash:new gt,map:new(ct||k),string:new gt}};var mt=function(t){var r=o(t);return"string"==r||"number"==r||"symbol"==r||"boolean"==r?"__proto__"!==t:null===t};var $t=function(t,r){var n=t.__data__;return mt(r)?n["string"==typeof r?"string":"hash"]:n.map};var jt=function(t){var r=$t(this,t).delete(t);return this.size-=r?1:0,r};var Ot=function(t){return $t(this,t).get(t)};var wt=function(t){return $t(this,t).has(t)};var St=function(t,r){var n=$t(this,t),e=n.size;return n.set(t,r),this.size+=n.size==e?0:1,this};function Tt(t){var r=-1,n=null==t?0:t.length;for(this.clear();++r<n;){var e=t[r];this.set(e[0],e[1])}}Tt.prototype.clear=_t,Tt.prototype.delete=jt,Tt.prototype.get=Ot,Tt.prototype.has=wt,Tt.prototype.set=St;var Mt=Tt;var Dt=function(t,r){var n=this.__data__;if(n instanceof k){var e=n.__data__;if(!ct||e.length<199)return e.push([t,r]),this.size=++n.size,this;n=this.__data__=new Mt(e)}return n.set(t,r),this.size=n.size,this};function At(t){var r=this.__data__=new k(t);this.size=r.size}At.prototype.clear=C,At.prototype.delete=E,At.prototype.get=J,At.prototype.has=q,At.prototype.set=Dt;var xt=At,zt=function(){try{var t=at(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var Ft=function(t,r,n){"__proto__"==r&&zt?zt(t,r,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[r]=n};var Nt=function(t,r,n){(void 0!==n&&!N(t[r],n)||void 0===n&&!(r in t))&&Ft(t,r,n)};var Pt=function(t){return function(r,n,e){for(var i=-1,o=Object(r),u=e(r),a=u.length;a--;){var c=u[t?a:++i];if(!1===n(o[c],c,o))break}return r}}(),Yt=i((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n?s.Buffer:void 0,o=i?i.allocUnsafe:void 0;t.exports=function(t,r){if(r)return t.slice();var n=t.length,e=o?o(n):new t.constructor(n);return t.copy(e),e}})),It=s.Uint8Array;var Ht=function(t){var r=new t.constructor(t.byteLength);return new It(r).set(new It(t)),r};var Ut=function(t,r){var n=r?Ht(t.buffer):t.buffer;return new t.constructor(n,t.byteOffset,t.length)};var Wt=function(t,r){var n=-1,e=t.length;for(r||(r=Array(e));++n<e;)r[n]=t[n];return r},Lt=Object.create,kt=function(){function t(){}return function(r){if(!u(r))return{};if(Lt)return Lt(r);t.prototype=r;var n=new t;return t.prototype=void 0,n}}();var Ct=function(t,r){return function(n){return t(r(n))}}(Object.getPrototypeOf,Object),Et=Object.prototype;var Jt=function(t){var r=t&&t.constructor;return t===("function"==typeof r&&r.prototype||Et)};var qt=function(t){return"function"!=typeof t.constructor||Jt(t)?{}:kt(Ct(t))};var Bt=function(t){return $(t)&&"[object Arguments]"==m(t)},Zt=Object.prototype,Vt=Zt.hasOwnProperty,Rt=Zt.propertyIsEnumerable,Gt=Bt(function(){return arguments}())?Bt:function(t){return $(t)&&Vt.call(t,"callee")&&!Rt.call(t,"callee")},Qt=Array.isArray;var Kt=function(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=9007199254740991};var Xt=function(t){return null!=t&&Kt(t.length)&&!Z(t)};var tr=function(t){return $(t)&&Xt(t)};var rr=function(){return!1},nr=i((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n?s.Buffer:void 0,o=(i?i.isBuffer:void 0)||rr;t.exports=o})),er=Function.prototype,ir=Object.prototype,or=er.toString,ur=ir.hasOwnProperty,ar=or.call(Object);var cr=function(t){if(!$(t)||"[object Object]"!=m(t))return!1;var r=Ct(t);if(null===r)return!0;var n=ur.call(r,"constructor")&&r.constructor;return"function"==typeof n&&n instanceof n&&or.call(n)==ar},sr={};sr["[object Float32Array]"]=sr["[object Float64Array]"]=sr["[object Int8Array]"]=sr["[object Int16Array]"]=sr["[object Int32Array]"]=sr["[object Uint8Array]"]=sr["[object Uint8ClampedArray]"]=sr["[object Uint16Array]"]=sr["[object Uint32Array]"]=!0,sr["[object Arguments]"]=sr["[object Array]"]=sr["[object ArrayBuffer]"]=sr["[object Boolean]"]=sr["[object DataView]"]=sr["[object Date]"]=sr["[object Error]"]=sr["[object Function]"]=sr["[object Map]"]=sr["[object Number]"]=sr["[object Object]"]=sr["[object RegExp]"]=sr["[object Set]"]=sr["[object String]"]=sr["[object WeakMap]"]=!1;var fr=function(t){return $(t)&&Kt(t.length)&&!!sr[m(t)]};var lr=function(t){return function(r){return t(r)}},vr=i((function(t,r){var n=r&&!r.nodeType&&r,e=n&&t&&!t.nodeType&&t,i=e&&e.exports===n&&a.process,o=function(){try{var t=e&&e.require&&e.require("util").types;return t||i&&i.binding&&i.binding("util")}catch(t){}}();t.exports=o})),hr=vr&&vr.isTypedArray,dr=hr?lr(hr):fr;var pr=function(t,r){if(("constructor"!==r||"function"!=typeof t[r])&&"__proto__"!=r)return t[r]},yr=Object.prototype.hasOwnProperty;var br=function(t,r,n){var e=t[r];yr.call(t,r)&&N(e,n)&&(void 0!==n||r in t)||Ft(t,r,n)};var gr=function(t,r,n,e){var i=!n;n||(n={});for(var o=-1,u=r.length;++o<u;){var a=r[o],c=e?e(n[a],t[a],a,n,t):void 0;void 0===c&&(c=t[a]),i?Ft(n,a,c):br(n,a,c)}return n};var _r=function(t,r){for(var n=-1,e=Array(t);++n<t;)e[n]=r(n);return e},mr=/^(?:0|[1-9]\d*)$/;var $r=function(t,r){var n=o(t);return!!(r=null==r?9007199254740991:r)&&("number"==n||"symbol"!=n&&mr.test(t))&&t>-1&&t%1==0&&t<r},jr=Object.prototype.hasOwnProperty;var Or=function(t,r){var n=Qt(t),e=!n&&Gt(t),i=!n&&!e&&nr(t),o=!n&&!e&&!i&&dr(t),u=n||e||i||o,a=u?_r(t.length,String):[],c=a.length;for(var s in t)!r&&!jr.call(t,s)||u&&("length"==s||i&&("offset"==s||"parent"==s)||o&&("buffer"==s||"byteLength"==s||"byteOffset"==s)||$r(s,c))||a.push(s);return a};var wr=function(t){var r=[];if(null!=t)for(var n in Object(t))r.push(n);return r},Sr=Object.prototype.hasOwnProperty;var Tr=function(t){if(!u(t))return wr(t);var r=Jt(t),n=[];for(var e in t)("constructor"!=e||!r&&Sr.call(t,e))&&n.push(e);return n};var Mr=function(t){return Xt(t)?Or(t,!0):Tr(t)};var Dr=function(t){return gr(t,Mr(t))};var Ar=function(t,r,n,e,i,o,a){var c=pr(t,n),s=pr(r,n),f=a.get(s);if(f)Nt(t,n,f);else{var l=o?o(c,s,n+"",t,r,a):void 0,v=void 0===l;if(v){var h=Qt(s),d=!h&&nr(s),p=!h&&!d&&dr(s);l=s,h||d||p?Qt(c)?l=c:tr(c)?l=Wt(c):d?(v=!1,l=Yt(s,!0)):p?(v=!1,l=Ut(s,!0)):l=[]:cr(s)||Gt(s)?(l=c,Gt(c)?l=Dr(c):u(c)&&!Z(c)||(l=qt(s))):v=!1}v&&(a.set(s,l),i(l,s,e,o,a),a.delete(s)),Nt(t,n,l)}};var xr=function t(r,n,e,i,o){r!==n&&Pt(n,(function(a,c){if(o||(o=new xt),u(a))Ar(r,n,c,e,t,i,o);else{var s=i?i(pr(r,c),a,c+"",r,n,o):void 0;void 0===s&&(s=a),Nt(r,c,s)}}),Mr)};var zr=function(t){return t};var Fr=function(t,r,n){switch(n.length){case 0:return t.call(r);case 1:return t.call(r,n[0]);case 2:return t.call(r,n[0],n[1]);case 3:return t.call(r,n[0],n[1],n[2])}return t.apply(r,n)},Nr=Math.max;var Pr=function(t,r,n){return r=Nr(void 0===r?t.length-1:r,0),function(){for(var e=arguments,i=-1,o=Nr(e.length-r,0),u=Array(o);++i<o;)u[i]=e[r+i];i=-1;for(var a=Array(r+1);++i<r;)a[i]=e[i];return a[r]=n(u),Fr(t,this,a)}};var Yr=function(t){return function(){return t}},Ir=zt?function(t,r){return zt(t,"toString",{configurable:!0,enumerable:!1,value:Yr(r),writable:!0})}:zr,Hr=Date.now;var Ur=function(t){var r=0,n=0;return function(){var e=Hr(),i=16-(e-n);if(n=e,i>0){if(++r>=800)return arguments[0]}else r=0;return t.apply(void 0,arguments)}}(Ir);var Wr=function(t,r){return Ur(Pr(t,r,zr),t+"")};var Lr=function(t,r,n){if(!u(n))return!1;var e=o(r);return!!("number"==e?Xt(n)&&$r(r,n.length):"string"==e&&r in n)&&N(n[r],t)};var kr=function(t){return Wr((function(r,n){var e=-1,i=n.length,o=i>1?n[i-1]:void 0,u=i>2?n[2]:void 0;for(o=t.length>3&&"function"==typeof o?(i--,o):void 0,u&&Lr(n[0],n[1],u)&&(o=i<3?void 0:o,i=1),r=Object(r);++e<i;){var a=n[e];a&&t(r,a,e,o)}return r}))}((function(t,r,n){xr(t,r,n)})),Cr=i((function(t,r){t.exports=function(){var t="millisecond",r="second",n="minute",e="hour",i="day",u="week",a="month",c="quarter",s="year",f=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,l=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,v=function(t,r,n){var e=String(t);return!e||e.length>=r?t:""+Array(r+1-e.length).join(n)+t},h={s:v,z:function(t){var r=-t.utcOffset(),n=Math.abs(r),e=Math.floor(n/60),i=n%60;return(r<=0?"+":"-")+v(e,2,"0")+":"+v(i,2,"0")},m:function(t,r){var n=12*(r.year()-t.year())+(r.month()-t.month()),e=t.clone().add(n,a),i=r-e<0,o=t.clone().add(n+(i?-1:1),a);return Number(-(n+(r-e)/(i?e-o:o-e))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(o){return{M:a,y:s,w:u,d:i,D:"date",h:e,m:n,s:r,ms:t,Q:c}[o]||String(o||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},d={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},p="en",y={};y[p]=d;var b=function(t){return t instanceof $},g=function(t,r,n){var e;if(!t)return p;if("string"==typeof t)y[t]&&(e=t),r&&(y[t]=r,e=t);else{var i=t.name;y[i]=t,e=i}return!n&&e&&(p=e),e||!n&&p},_=function(t,r){if(b(t))return t.clone();var n="object"==o(r)?r:{};return n.date=t,n.args=arguments,new $(n)},m=h;m.l=g,m.i=b,m.w=function(t,r){return _(t,{locale:r.$L,utc:r.$u,$offset:r.$offset})};var $=function(){function o(t){this.$L=this.$L||g(t.locale,null,!0),this.parse(t)}var v=o.prototype;return v.parse=function(t){this.$d=function(t){var r=t.date,n=t.utc;if(null===r)return new Date(NaN);if(m.u(r))return new Date;if(r instanceof Date)return new Date(r);if("string"==typeof r&&!/Z$/i.test(r)){var e=r.match(f);if(e)return n?new Date(Date.UTC(e[1],e[2]-1,e[3]||1,e[4]||0,e[5]||0,e[6]||0,e[7]||0)):new Date(e[1],e[2]-1,e[3]||1,e[4]||0,e[5]||0,e[6]||0,e[7]||0)}return new Date(r)}(t),this.init()},v.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},v.$utils=function(){return m},v.isValid=function(){return!("Invalid Date"===this.$d.toString())},v.isSame=function(t,r){var n=_(t);return this.startOf(r)<=n&&n<=this.endOf(r)},v.isAfter=function(t,r){return _(t)<this.startOf(r)},v.isBefore=function(t,r){return this.endOf(r)<_(t)},v.$g=function(t,r,n){return m.u(t)?this[r]:this.set(n,t)},v.year=function(t){return this.$g(t,"$y",s)},v.month=function(t){return this.$g(t,"$M",a)},v.day=function(t){return this.$g(t,"$W",i)},v.date=function(t){return this.$g(t,"$D","date")},v.hour=function(t){return this.$g(t,"$H",e)},v.minute=function(t){return this.$g(t,"$m",n)},v.second=function(t){return this.$g(t,"$s",r)},v.millisecond=function(r){return this.$g(r,"$ms",t)},v.unix=function(){return Math.floor(this.valueOf()/1e3)},v.valueOf=function(){return this.$d.getTime()},v.startOf=function(t,o){var c=this,f=!!m.u(o)||o,l=m.p(t),v=function(t,r){var n=m.w(c.$u?Date.UTC(c.$y,r,t):new Date(c.$y,r,t),c);return f?n:n.endOf(i)},h=function(t,r){return m.w(c.toDate()[t].apply(c.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(r)),c)},d=this.$W,p=this.$M,y=this.$D,b="set"+(this.$u?"UTC":"");switch(l){case s:return f?v(1,0):v(31,11);case a:return f?v(1,p):v(0,p+1);case u:var g=this.$locale().weekStart||0,_=(d<g?d+7:d)-g;return v(f?y-_:y+(6-_),p);case i:case"date":return h(b+"Hours",0);case e:return h(b+"Minutes",1);case n:return h(b+"Seconds",2);case r:return h(b+"Milliseconds",3);default:return this.clone()}},v.endOf=function(t){return this.startOf(t,!1)},v.$set=function(o,u){var c,f=m.p(o),l="set"+(this.$u?"UTC":""),v=(c={},c.day=l+"Date",c.date=l+"Date",c[a]=l+"Month",c[s]=l+"FullYear",c[e]=l+"Hours",c[n]=l+"Minutes",c[r]=l+"Seconds",c[t]=l+"Milliseconds",c)[f],h=f===i?this.$D+(u-this.$W):u;if(f===a||f===s){var d=this.clone().set("date",1);d.$d[v](h),d.init(),this.$d=d.set("date",Math.min(this.$D,d.daysInMonth())).toDate()}else v&&this.$d[v](h);return this.init(),this},v.set=function(t,r){return this.clone().$set(t,r)},v.get=function(t){return this[m.p(t)]()},v.add=function(t,o){var c,f=this;t=Number(t);var l=m.p(o),v=function(r){var n=_(f);return m.w(n.date(n.date()+Math.round(r*t)),f)};if(l===a)return this.set(a,this.$M+t);if(l===s)return this.set(s,this.$y+t);if(l===i)return v(1);if(l===u)return v(7);var h=(c={},c[n]=6e4,c[e]=36e5,c[r]=1e3,c)[l]||1,d=this.$d.getTime()+t*h;return m.w(d,this)},v.subtract=function(t,r){return this.add(-1*t,r)},v.format=function(t){var r=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",e=m.z(this),i=this.$locale(),o=this.$H,u=this.$m,a=this.$M,c=i.weekdays,s=i.months,f=function(t,e,i,o){return t&&(t[e]||t(r,n))||i[e].substr(0,o)},v=function(t){return m.s(o%12||12,t,"0")},h=i.meridiem||function(t,r,n){var e=t<12?"AM":"PM";return n?e.toLowerCase():e},d={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:m.s(a+1,2,"0"),MMM:f(i.monthsShort,a,s,3),MMMM:f(s,a),D:this.$D,DD:m.s(this.$D,2,"0"),d:String(this.$W),dd:f(i.weekdaysMin,this.$W,c,2),ddd:f(i.weekdaysShort,this.$W,c,3),dddd:c[this.$W],H:String(o),HH:m.s(o,2,"0"),h:v(1),hh:v(2),a:h(o,u,!0),A:h(o,u,!1),m:String(u),mm:m.s(u,2,"0"),s:String(this.$s),ss:m.s(this.$s,2,"0"),SSS:m.s(this.$ms,3,"0"),Z:e};return n.replace(l,(function(t,r){return r||d[t]||e.replace(":","")}))},v.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},v.diff=function(t,i,o){var f,l=m.p(i),v=_(t),h=6e4*(v.utcOffset()-this.utcOffset()),d=this-v,p=m.m(this,v);return p=(f={},f[s]=p/12,f[a]=p,f[c]=p/3,f[u]=(d-h)/6048e5,f.day=(d-h)/864e5,f[e]=d/36e5,f[n]=d/6e4,f[r]=d/1e3,f)[l]||d,o?p:m.a(p)},v.daysInMonth=function(){return this.endOf(a).$D},v.$locale=function(){return y[this.$L]},v.locale=function(t,r){if(!t)return this.$L;var n=this.clone(),e=g(t,r,!0);return e&&(n.$L=e),n},v.clone=function(){return m.w(this.$d,this)},v.toDate=function(){return new Date(this.valueOf())},v.toJSON=function(){return this.isValid()?this.toISOString():null},v.toISOString=function(){return this.$d.toISOString()},v.toString=function(){return this.$d.toUTCString()},o}();return _.prototype=$.prototype,_.extend=function(t,r){return t(r,$,_),_},_.locale=g,_.isDayjs=b,_.unix=function(t){return _(1e3*t)},_.en=y[p],_.Ls=y,_}()}));function Er(){return Cr().format("YYYY-MM-DDTHH:mm:ssZ")}var Jr=function(t){return t?(t=D(t))===1/0||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var qr=function(t){var r=Jr(t),n=r%1;return r==r?n?r-n:r:0};var Br=function(t){return"number"==typeof t&&t==qr(t)};function Zr(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Vr(t){var r=!1;return Zr(t)?r=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(r=!0),r}function Rr(t){return Vr(t)?Jr(t):0}var Gr=function(t,r){for(var n=-1,e=null==t?0:t.length,i=Array(e);++n<e;)i[n]=r(t[n],n,t);return i},Qr=l?l.prototype:void 0,Kr=Qr?Qr.toString:void 0;var Xr=function t(r){if("string"==typeof r)return r;if(Qt(r))return Gr(r,t)+"";if(j(r))return Kr?Kr.call(r):"";var n=r+"";return"0"==n&&1/r==-1/0?"-0":n};var tn=function(t){return null==t?"":Xr(t)},rn=s.isFinite,nn=Math.min;var en=function(t){var r=Math[t];return function(t,n){if(t=D(t),(n=null==n?0:nn(qr(n),292))&&rn(t)){var e=(tn(t)+"e").split("e"),i=r(e[0]+"e"+(+e[1]+n));return+((e=(tn(i)+"e").split("e"))[0]+"e"+(+e[1]-n))}return r(t)}}("round");function on(t){if(!Vr(t))return 0;t=Rr(t);var r=en(t);return"0"===String(r)?0:r}function un(t){return!!function(t){return!!Vr(t)&&(t=Rr(t),Br(t))}(t)&&on(t)>0}var an="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),cn=an.length;function sn(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,r=[];t=un(t)?on(t):32;for(var n=0;n<t;n++)r[n]=an[0|Math.random()*cn];var e=r.join("");return e}function fn(t){if(function(t){return"[object Object]"===Object.prototype.toString.call(t)}(t)){for(var r in t)return!0;return!1}return!1}function ln(t){if(!Zr(t))return{};var r={};try{r=JSON.parse(t)}catch(t){r={}}return r}function vn(t){return"[object Undefined]"===Object.prototype.toString.call(t)}function hn(t){var r=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(vn(t))return"";var n="";try{n=r?JSON.stringify(t,null,2):JSON.stringify(t)}catch(t){n=""}return n}var dn=t.resolve();return function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e={};t.fnTableTags||(t.fnTableTags="tableTags.json");var i="".concat(dn,"/").concat(t.fnTableTags),o=new n.EventEmitter;function u(t){for(var r=arguments.length,n=new Array(r>1?r-1:0),e=1;e<r;e++)n[e-1]=arguments[e];setTimeout((function(){o.emit.apply(o,[t].concat(n))}),1)}function a(){var t={};try{if(r.existsSync(i)){var n=ln(r.readFileSync(i,"utf8"));fn(n)&&(t=n)}}catch(t){u("error",{msg:"readTableTags catch",err:t})}return t}function c(){try{var t=hn(e);r.writeFileSync(i,t,"utf8")}catch(t){u("error",{msg:"writeTableTags catch",err:t})}}function s(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"useInputFirst";e="useStorageFirst"===r?kr(t,a()):"useInputOnly"===r?t:"useStorageOnly"===r?a():kr(a(),t),c()}function f(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e=kr(e,t),c()}function l(){return e}var v=z((function(){c(),u("changeTableTags",e)}),200);function h(t){e[t]=Er()+"|"+sn(6),v()}return o.readTableTags=a,o.writeTableTags=c,o.initTableTags=s,o.setTableTags=f,o.getTableTags=l,o.updateTableTag=h,o}}));
//# sourceMappingURL=w-sync-webdata-server.umd.js.map
