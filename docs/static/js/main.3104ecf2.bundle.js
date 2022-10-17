"use strict";(self.webpackChunkreact_typescript=self.webpackChunkreact_typescript||[]).push([[179],{108:(t,i,n)=>{var r=n(745),e=n(942),s=n(152),o=n(294),a=n(376);const c=n.p+"static/images/c4cf532ead4844987d7f.png";var l=n(951),h=n(976),u=n(649),f=n(790),y=400,x=400,m=function(){function t(){var i,n,r,e,s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};(0,l.Z)(this,t),(0,u.Z)(this,"options",void 0),(0,u.Z)(this,"matrix",new f.G9),(0,u.Z)(this,"transformOrigin",{x:0,y:0}),(0,u.Z)(this,"transform",{scale:1,rotation:0,scaleX:1,scaleY:1,skewX:0,skewY:0,flipX:!1,flipY:!1}),(0,u.Z)(this,"width",y),(0,u.Z)(this,"height",x),this.options=s,this.width=null!==(i=s.width)&&void 0!==i?i:y,this.height=null!==(n=s.height)&&void 0!==n?n:x,this.transformOrigin=s.transformOrigin||this.transformOrigin,this.x=null!==(r=s.x)&&void 0!==r?r:0,this.y=null!==(e=s.y)&&void 0!==e?e:0}return(0,h.Z)(t,[{key:"decompose",value:function(){return this.matrix.decompose()}},{key:"cx",get:function(){return this.transformOrigin.x}},{key:"cy",get:function(){return this.transformOrigin.y}},{key:"setTransformOrigin",value:function(t,i){this.transformOrigin={x:t,y:i}}},{key:"getTransformOrigin",value:function(){return{x:this.cx,y:this.cy}}},{key:"x",get:function(){return this.matrix.tx},set:function(t){var i=t-this.x;this.translate(i,0)}},{key:"y",get:function(){return this.matrix.ty},set:function(t){var i=t-this.y;this.translate(0,i)}},{key:"zoom",get:function(){return this.transform.scaleX},set:function(t){this.setZoom(t)}},{key:"getMatrix",value:function(){return this.matrix.clone()}},{key:"globalToLocal",value:function(t,i){return this.getMatrix().invert().transformPoint(t,i)}},{key:"localToGlobal",value:function(t,i){return this.matrix.transformPoint(t,i)}},{key:"translate",value:function(t,i){var n=this.globalToLocal(0,0),r=this.globalToLocal(t,i);return this.matrix.translate(r.x-n.x,r.y-n.y),this}},{key:"translateX",value:function(t){return this.translate(t,0)}},{key:"translateY",value:function(t){return this.translate(0,t)}},{key:"scale",value:function(t,i,n,r){var e=this.globalToLocal(null!=n?n:this.cx,null!=r?r:this.cy);return this.matrix.scale(t,i,e.x,e.y),this.transform.scaleX+=t,this.transform.scaleY+=i,this}},{key:"rotate",value:function(t,i,n){var r=this.globalToLocal(null!=i?i:this.cx,null!=n?n:this.cy);return this.matrix.rotate(t,r.x,r.y),this.transform.rotation+=t,this}},{key:"flipX",value:function(t,i){var n=this.globalToLocal(null!=t?t:this.cx,null!=i?i:this.cy);return this.matrix.scale(-1,1,n.x,n.y),this.transform.flipX=!this.transform.flipX,this}},{key:"flipY",value:function(t,i){var n=this.globalToLocal(null!=t?t:this.cx,null!=i?i:this.cy);return this.matrix.scale(1,-1,n.x,n.y),this.transform.flipY=!this.transform.flipY,this}},{key:"skewX",value:function(t,i,n){var r=this.globalToLocal(null!=i?i:this.cx,null!=n?n:this.cy);return this.matrix.translate(r.x,r.y),this.matrix.skewX(t),this.matrix.translate(-r.x,-r.y),this.transform.skewX+=t,this}},{key:"skewY",value:function(t,i,n){var r=this.globalToLocal(null!=i?i:this.cx,null!=n?n:this.cy);return this.matrix.translate(r.x,r.y),this.matrix.skewY(t),this.matrix.translate(-r.x,-r.y),this.transform.skewY+=t,this}},{key:"getZoom",value:function(){return this.zoom}},{key:"setZoom",value:function(t,i,n){var r=this.transform.scaleX,e=this.transform.scaleY,s=this.globalToLocal(null!=i?i:this.cx,null!=n?n:this.cy);return this.matrix.scale(t/r,t/e,s.x,s.y),this.transform.scaleX=t,this.transform.scaleY=t,this}},{key:"setRotation",value:function(t,i,n){var r=this.globalToLocal(null!=i?i:this.cx,null!=n?n:this.cy),e=this.transform;return this.matrix.rotate(t-e.rotation,r.x,r.y),this.transform.rotation=t,this}},{key:"zoomToRect",value:function(t){var i,n,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=null!==(i=r.padding)&&void 0!==i?i:0,s=this.width-2*e,o=this.height-2*e,a=null!==(n=r.scale)&&void 0!==n?n:Math.min(s/t.width,o/t.height),c=r.transformOrigin?r.transformOrigin.x:this.cx,l=r.transformOrigin?r.transformOrigin.y:this.cy,h=t.x+t.width/2,u=t.y+t.height/2,f=this.localToGlobal(h,u),y={x:c,y:l};this.setZoom(a,f.x,f.y);var x=y.x-f.x,m=y.y-f.y;return this.translate(x,m),this}},{key:"reset",value:function(){return this.matrix=new f.G9,this.transform={scale:1,rotation:0,scaleX:1,scaleY:1,skewX:0,skewY:0,flipX:!1,flipY:!1},this}},{key:"toCSS",value:function(){var t=this.getMatrix();return"matrix(".concat(t.a,",").concat(t.b,",").concat(t.c,",").concat(t.d,",").concat(t.tx,",").concat(t.ty,")")}}]),t}(),g=n(893);function d(t,i){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);i&&(r=r.filter((function(i){return Object.getOwnPropertyDescriptor(t,i).enumerable}))),n.push.apply(n,r)}return n}function v(t){for(var i=1;i<arguments.length;i++){var n=null!=arguments[i]?arguments[i]:{};i%2?d(Object(n),!0).forEach((function(i){(0,e.Z)(t,i,n[i])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):d(Object(n)).forEach((function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(n,i))}))}return t}var p=600,k=400,w={left:440,top:240,width:70,height:80};function b(){var t=o.useState("matrix(1,0,0,1,0,0)"),i=(0,s.Z)(t,2),n=i[0],r=i[1],e=o.useState({x:300,y:200}),l=(0,s.Z)(e,2),h=l[0],u=l[1];return o.useEffect((function(){var t=0,i=0,n=0,e=0,s={cx:300,cy:200,x:0,y:0,zoom:1,rotation:0,skewX:0,skewY:0,flipX:!1,flipY:!1,zoomToFit:!1},o=new m({width:p,height:k,transformOrigin:h}),c=function(){r(o.toCSS()),console.log(o.getMatrix().decompose())},l=new a.NR.GUI;l.add(s,"x",-p,p,1).onChange((function(i){var n=i-t;t=i,o.translateX(n),c()})),l.add(s,"y",-k,k,1).onChange((function(t){var n=t-i;i=t,o.translateY(n),c()})),l.add(s,"zoom",.1,50,.1).onChange((function(t){o.setZoom(t,s.cx,s.cy),c()})),l.add(s,"rotation",0,360,1).onChange((function(t){o.setRotation(t,s.cx,s.cy),c()})),l.add(s,"skewX",-90,90,1).onChange((function(t){o.skewX(t-n,s.cx,s.cy),n=t,c()})),l.add(s,"skewY",-90,90,1).onChange((function(t){o.skewY(t-e,s.cx,s.cy),e=t,c()})),l.add(s,"flipX").onChange((function(){o.flipX(s.cx,s.cy),c()})),l.add(s,"flipY").onChange((function(){o.flipY(s.cx,s.cy),c()})),l.add(s,"zoomToFit").onChange((function(){o.zoomToRect(v({x:w.left,y:w.top},w)),c()}));var f=l.addFolder("transform center");f.add(s,"cx",0,p,1).onChange((function(t){u({x:s.cx,y:s.cy}),o.setTransformOrigin(s.cx,s.cy)})),f.add(s,"cy",0,k,1).onChange((function(t){u({x:s.cx,y:s.cy}),o.setTransformOrigin(s.cx,s.cy)}))}),[]),(0,g.jsxs)("div",{className:"App",children:[(0,g.jsxs)("div",{className:"viewbox",style:{position:"relative",width:p,height:k,overflow:"hidden"},children:[(0,g.jsxs)("div",{className:"content",style:{transformOrigin:"0 0",transform:n},children:[(0,g.jsx)("img",{width:p,height:k,src:c}),(0,g.jsx)("div",{style:v(v({position:"absolute"},w),{},{opacity:.3,backgroundColor:"red"})})]}),(0,g.jsx)("div",{style:{zIndex:9,position:"absolute",left:h.x-3,top:h.y-3,width:6,height:6,borderRadius:"50%",opacity:.9,background:"red"}})]}),(0,g.jsx)("div",{children:n})]})}var O=document.getElementById("root");r.s(O).render((0,g.jsx)(b,{}))}},t=>{t.O(0,[578],(()=>{return i=108,t(t.s=i);var i}));t.O()}]);