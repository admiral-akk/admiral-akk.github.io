var Gr=Object.defineProperty;var kr=(t,e,n)=>e in t?Gr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var G=(t,e,n)=>(kr(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();class Vr{constructor(e){this.sizes={width:window.innerWidth,height:window.innerHeight,buffer:20,aspect:e},this.listeners=[],document.querySelector("div.container");const n=document.querySelector("div.relative");this.update=()=>{const{buffer:r}=this.sizes,i=window.innerHeight-2*r,o=window.innerWidth-2*r;i*this.sizes.aspect>o?(this.sizes.width=o,this.sizes.height=o/this.sizes.aspect,this.sizes.verticalOffset=r+(i-this.sizes.height)/2,this.sizes.horizontalOffset=r):(this.sizes.width=i*this.sizes.aspect,this.sizes.height=i,this.sizes.verticalOffset=r,this.sizes.horizontalOffset=r+(o-this.sizes.width)/2),n.style.top=this.sizes.verticalOffset.toString()+"px",n.style.left=this.sizes.horizontalOffset.toString()+"px",this.listeners.forEach(s=>{s.updateSize(this.sizes)})},window.addEventListener("resize",this.update),window.addEventListener("orientationchange",this.update),window.addEventListener("dblclick",r=>{})}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ie{constructor(e,n,r,i,o="div"){this.parent=e,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("controller"),this.domElement.classList.add(i),this.$name=document.createElement("div"),this.$name.classList.add("name"),ie.nextNameID=ie.nextNameID||0,this.$name.id=`lil-gui-name-${++ie.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const n=this.parent.add(this.object,this.property,e);return n.name(this._name),this.destroy(),n}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Hr extends ie{constructor(e,n,r){super(e,n,r,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Ct(t){let e,n;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?n=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),n?"#"+n:!1}const Xr={isPrimitive:!0,match:t=>typeof t=="string",fromHexString:Ct,toHexString:Ct},De={isPrimitive:!0,match:t=>typeof t=="number",fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},Yr={isPrimitive:!1,match:t=>Array.isArray(t),fromHexString(t,e,n=1){const r=De.fromHexString(t);e[0]=(r>>16&255)/255*n,e[1]=(r>>8&255)/255*n,e[2]=(r&255)/255*n},toHexString([t,e,n],r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return De.toHexString(i)}},Wr={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,e,n=1){const r=De.fromHexString(t);e.r=(r>>16&255)/255*n,e.g=(r>>8&255)/255*n,e.b=(r&255)/255*n},toHexString({r:t,g:e,b:n},r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return De.toHexString(i)}},jr=[Xr,De,Yr,Wr];function Kr(t){return jr.find(e=>e.match(t))}class qr extends ie{constructor(e,n,r,i){super(e,n,r,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Kr(this.initialValue),this._rgbScale=i,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=Ct(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const n=this._format.fromHexString(e);this.setValue(n)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class bt extends ie{constructor(e,n,r){super(e,n,r,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",i=>{i.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Qr extends ie{constructor(e,n,r,i,o,s){super(e,n,r,"number"),this._initInput(),this.min(i),this.max(o);const a=s!==void 0;this.step(a?s:this._getImplicitStep(),a),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,n=!0){return this._step=e,this._stepExplicit=n,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let n=(e-this._min)/(this._max-this._min);n=Math.max(0,Math.min(n,1)),this.$fill.style.width=n*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const n=()=>{let v=parseFloat(this.$input.value);isNaN(v)||(this._stepExplicit&&(v=this._snap(v)),this.setValue(this._clamp(v)))},r=v=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+v),this.$input.value=this.getValue())},i=v=>{v.key==="Enter"&&this.$input.blur(),v.code==="ArrowUp"&&(v.preventDefault(),r(this._step*this._arrowKeyMultiplier(v))),v.code==="ArrowDown"&&(v.preventDefault(),r(this._step*this._arrowKeyMultiplier(v)*-1))},o=v=>{this._inputFocused&&(v.preventDefault(),r(this._step*this._normalizeMouseWheel(v)))};let s=!1,a,l,c,u,f;const h=5,p=v=>{a=v.clientX,l=c=v.clientY,s=!0,u=this.getValue(),f=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",b)},m=v=>{if(s){const y=v.clientX-a,_=v.clientY-l;Math.abs(_)>h?(v.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>h&&b()}if(!s){const y=v.clientY-c;f-=y*this._step*this._arrowKeyMultiplier(v),u+f>this._max?f=this._max-u:u+f<this._min&&(f=this._min-u),this._snapClampSetValue(u+f)}c=v.clientY},b=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",b)},E=()=>{this._inputFocused=!0},x=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",n),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",E),this.$input.addEventListener("blur",x)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(x,v,y,_,S)=>(x-v)/(y-v)*(S-_)+_,n=x=>{const v=this.$slider.getBoundingClientRect();let y=e(x,v.left,v.right,this._min,this._max);this._snapClampSetValue(y)},r=x=>{this._setDraggingStyle(!0),n(x.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",o)},i=x=>{n(x.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",o)};let s=!1,a,l;const c=x=>{x.preventDefault(),this._setDraggingStyle(!0),n(x.touches[0].clientX),s=!1},u=x=>{x.touches.length>1||(this._hasScrollBar?(a=x.touches[0].clientX,l=x.touches[0].clientY,s=!0):c(x),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=x=>{if(s){const v=x.touches[0].clientX-a,y=x.touches[0].clientY-l;Math.abs(v)>Math.abs(y)?c(x):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else x.preventDefault(),n(x.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},p=this._callOnFinishChange.bind(this),m=400;let b;const E=x=>{if(Math.abs(x.deltaX)<Math.abs(x.deltaY)&&this._hasScrollBar)return;x.preventDefault();const y=this._normalizeMouseWheel(x)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(b),b=setTimeout(p,m)};this.$slider.addEventListener("mousedown",r),this.$slider.addEventListener("touchstart",u,{passive:!1}),this.$slider.addEventListener("wheel",E,{passive:!1})}_setDraggingStyle(e,n="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${n}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:n,deltaY:r}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(n=0,r=-e.wheelDelta/120,r*=this._stepExplicit?1:10),n+-r}_arrowKeyMultiplier(e){let n=this._stepExplicit?1:10;return e.shiftKey?n*=10:e.altKey&&(n/=10),n}_snap(e){const n=Math.round(e/this._step)*this._step;return parseFloat(n.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Zr extends ie{constructor(e,n,r,i){super(e,n,r,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(i)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(n=>{const r=document.createElement("option");r.textContent=n,this.$select.appendChild(r)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),n=this._values.indexOf(e);return this.$select.selectedIndex=n,this.$display.textContent=n===-1?e:this._names[n],this}}class Jr extends ie{constructor(e,n,r){super(e,n,r,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",i=>{i.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const ei=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.root > .title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.root > .children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.root > .children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.root > .children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.allow-touch-styles, .lil-gui.allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.force-touch-styles, .lil-gui.force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-gui .controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-gui .controller.disabled {
  opacity: 0.5;
}
.lil-gui .controller.disabled, .lil-gui .controller.disabled * {
  pointer-events: none !important;
}
.lil-gui .controller > .name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-gui .controller .widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-gui .controller.string input {
  color: var(--string-color);
}
.lil-gui .controller.boolean {
  cursor: pointer;
}
.lil-gui .controller.color .display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-gui .controller.color .display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-gui .controller.color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-gui .controller.color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-gui .controller.option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-gui .controller.option .display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-gui .controller.option .display.focus {
    background: var(--focus-color);
  }
}
.lil-gui .controller.option .display.active {
  background: var(--focus-color);
}
.lil-gui .controller.option .display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-gui .controller.option .widget,
.lil-gui .controller.option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-gui .controller.option .widget:hover .display {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number input {
  color: var(--number-color);
}
.lil-gui .controller.number.hasSlider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-gui .controller.number .slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-gui .controller.number .slider:hover {
    background: var(--hover-color);
  }
}
.lil-gui .controller.number .slider.active {
  background: var(--focus-color);
}
.lil-gui .controller.number .slider.active .fill {
  opacity: 0.95;
}
.lil-gui .controller.number .fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-gui-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-gui-dragging * {
  cursor: ew-resize !important;
}

.lil-gui-dragging.lil-gui-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .title {
  height: var(--title-height);
  line-height: calc(var(--title-height) - 4px);
  font-weight: 600;
  padding: 0 var(--padding);
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
  outline: none;
  text-decoration-skip: objects;
}
.lil-gui .title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-gui-dragging) .lil-gui .title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.root > .title:focus {
  text-decoration: none !important;
}
.lil-gui.closed > .title:before {
  content: "▸";
}
.lil-gui.closed > .children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.closed:not(.transition) > .children {
  display: none;
}
.lil-gui.transition > .children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.root > .children > .lil-gui > .title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.root > .children > .lil-gui.closed > .title {
  border-bottom-color: transparent;
}
.lil-gui + .controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  border: none;
}
@media (hover: hover) {
  .lil-gui button:hover {
    background: var(--hover-color);
  }
  .lil-gui button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAAUsAAsAAAAACJwAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABHU1VCAAABCAAAAH4AAADAImwmYE9TLzIAAAGIAAAAPwAAAGBKqH5SY21hcAAAAcgAAAD0AAACrukyyJBnbHlmAAACvAAAAF8AAACEIZpWH2hlYWQAAAMcAAAAJwAAADZfcj2zaGhlYQAAA0QAAAAYAAAAJAC5AHhobXR4AAADXAAAABAAAABMAZAAAGxvY2EAAANsAAAAFAAAACgCEgIybWF4cAAAA4AAAAAeAAAAIAEfABJuYW1lAAADoAAAASIAAAIK9SUU/XBvc3QAAATEAAAAZgAAAJCTcMc2eJxVjbEOgjAURU+hFRBK1dGRL+ALnAiToyMLEzFpnPz/eAshwSa97517c/MwwJmeB9kwPl+0cf5+uGPZXsqPu4nvZabcSZldZ6kfyWnomFY/eScKqZNWupKJO6kXN3K9uCVoL7iInPr1X5baXs3tjuMqCtzEuagm/AAlzQgPAAB4nGNgYRBlnMDAysDAYM/gBiT5oLQBAwuDJAMDEwMrMwNWEJDmmsJwgCFeXZghBcjlZMgFCzOiKOIFAB71Bb8AeJy1kjFuwkAQRZ+DwRAwBtNQRUGKQ8OdKCAWUhAgKLhIuAsVSpWz5Bbkj3dEgYiUIszqWdpZe+Z7/wB1oCYmIoboiwiLT2WjKl/jscrHfGg/pKdMkyklC5Zs2LEfHYpjcRoPzme9MWWmk3dWbK9ObkWkikOetJ554fWyoEsmdSlt+uR0pCJR34b6t/TVg1SY3sYvdf8vuiKrpyaDXDISiegp17p7579Gp3p++y7HPAiY9pmTibljrr85qSidtlg4+l25GLCaS8e6rRxNBmsnERunKbaOObRz7N72ju5vdAjYpBXHgJylOAVsMseDAPEP8LYoUHicY2BiAAEfhiAGJgZWBgZ7RnFRdnVJELCQlBSRlATJMoLV2DK4glSYs6ubq5vbKrJLSbGrgEmovDuDJVhe3VzcXFwNLCOILB/C4IuQ1xTn5FPilBTj5FPmBAB4WwoqAHicY2BkYGAA4sk1sR/j+W2+MnAzpDBgAyEMQUCSg4EJxAEAwUgFHgB4nGNgZGBgSGFggJMhDIwMqEAYAByHATJ4nGNgAIIUNEwmAABl3AGReJxjYAACIQYlBiMGJ3wQAEcQBEV4nGNgZGBgEGZgY2BiAAEQyQWEDAz/wXwGAAsPATIAAHicXdBNSsNAHAXwl35iA0UQXYnMShfS9GPZA7T7LgIu03SSpkwzYTIt1BN4Ak/gKTyAeCxfw39jZkjymzcvAwmAW/wgwHUEGDb36+jQQ3GXGot79L24jxCP4gHzF/EIr4jEIe7wxhOC3g2TMYy4Q7+Lu/SHuEd/ivt4wJd4wPxbPEKMX3GI5+DJFGaSn4qNzk8mcbKSR6xdXdhSzaOZJGtdapd4vVPbi6rP+cL7TGXOHtXKll4bY1Xl7EGnPtp7Xy2n00zyKLVHfkHBa4IcJ2oD3cgggWvt/V/FbDrUlEUJhTn/0azVWbNTNr0Ens8de1tceK9xZmfB1CPjOmPH4kitmvOubcNpmVTN3oFJyjzCvnmrwhJTzqzVj9jiSX911FjeAAB4nG3HMRKCMBBA0f0giiKi4DU8k0V2GWbIZDOh4PoWWvq6J5V8If9NVNQcaDhyouXMhY4rPTcG7jwYmXhKq8Wz+p762aNaeYXom2n3m2dLTVgsrCgFJ7OTmIkYbwIbC6vIB7WmFfAAAA==") format("woff");
}`;function ti(t){const e=document.createElement("style");e.innerHTML=t;const n=document.querySelector("head link[rel=stylesheet], head style");n?document.head.insertBefore(e,n):document.head.appendChild(e)}let pn=!1;class $t{constructor({parent:e,autoPlace:n=e===void 0,container:r,width:i,title:o="Controls",closeFolders:s=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!pn&&a&&(ti(ei),pn=!0),r?r.appendChild(this.domElement):n&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),i&&this.domElement.style.setProperty("--width",i+"px"),this._closeFolders=s}add(e,n,r,i,o){if(Object(r)===r)return new Zr(this,e,n,r);const s=e[n];switch(typeof s){case"number":return new Qr(this,e,n,r,i,o);case"boolean":return new Hr(this,e,n);case"string":return new Jr(this,e,n);case"function":return new bt(this,e,n)}console.error(`gui.add failed
	property:`,n,`
	object:`,e,`
	value:`,s)}addColor(e,n,r=1){return new qr(this,e,n,r)}addFolder(e){const n=new $t({parent:this,title:e});return this.root._closeFolders&&n.close(),n}load(e,n=!0){return e.controllers&&this.controllers.forEach(r=>{r instanceof bt||r._name in e.controllers&&r.load(e.controllers[r._name])}),n&&e.folders&&this.folders.forEach(r=>{r._title in e.folders&&r.load(e.folders[r._title])}),this}save(e=!0){const n={controllers:{},folders:{}};return this.controllers.forEach(r=>{if(!(r instanceof bt)){if(r._name in n.controllers)throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);n.controllers[r._name]=r.save()}}),e&&this.folders.forEach(r=>{if(r._title in n.folders)throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);n.folders[r._title]=r.save()}),n}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const n=this.$children.clientHeight;this.$children.style.height=n+"px",this.domElement.classList.add("transition");const r=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",r))};this.$children.addEventListener("transitionend",r);const i=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=i+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(r=>r.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(n=>{e=e.concat(n.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(n=>{e=e.concat(n.foldersRecursive())}),e}}const ni=$t,yt="state",Et="config";class ri{constructor(){this.added=[],this.listeners=[],this.serializedConfig={},this.config={},this.state={}}init(){const e=new ni;this.variables=e.addFolder("Variables"),this.buttons=e.addFolder("Buttons"),this.readData(),this.addButton({name:"Clear Data",fn:()=>this.clearData()}),e.hide()}addEnum({displayName:e,defaultValue:n,options:r,callback:i=null}){var o;if(!this.config[e]){const s=((o=this.serializedConfig[e])==null?void 0:o.value)??n;this.config[e]={name:e,defaultValue:n,value:s,minOrOptions:r},this.addConfigData(e,i),this.added.push(e)}return this.config[e]}addNumber({displayName:e,defaultValue:n,min:r=null,max:i=null,step:o=null,callback:s=null}){var a;if(!this.config[e]){const l=((a=this.serializedConfig[e])==null?void 0:a.value)??n;this.config[e]={name:e,defaultValue:n,value:l,minOrOptions:r,max:i,step:o},r!==null&&(this.config[e].value=Math.max(r,this.config[e].value)),i!==null&&(this.config[e].value=Math.min(i,this.config[e].value)),this.addConfigData(e,s),this.added.push(e)}return this.config[e]}addColor({displayName:e,defaultValue:n,callback:r=null}){var i;if(!this.config[e]){const o=((i=this.serializedConfig[e])==null?void 0:i.value)??n;this.config[e]={name:e,defaultValue:n,value:o},this.variables.addColor(this.config[e],"value").name(e).onChange(s=>{this.saveData(),this.notify(),r&&r(s)}).listen(),this.added.push(e)}return this.config[e]}addButton({fn:e,name:n}){const r={};r[n]=e,this.buttons.add(r,n)}addConfigData(e,n){const{minOrOptions:r=null,max:i=null,step:o=null,name:s}=this.config[e];this.variables.add(this.config[e],"value",r,i,o).name(s).onChange(a=>{this.saveData(),this.notify(),n&&n(a)}).listen()}notify(){this.listeners.forEach(e=>e.configUpdated(this.config))}readData(){const e=localStorage.getItem(yt);e&&e!="undefined"?this.state=JSON.parse(e):this.state={};const n=localStorage.getItem(Et);n&&n!="undefined"?this.serializedConfig=JSON.parse(n):this.serializedConfig={}}saveData(){}clearData(){localStorage.getItem(yt)&&localStorage.removeItem(yt),this.state={},localStorage.getItem(Et)&&localStorage.removeItem(Et);for(const[e,n]of Object.entries(this.config))n.value=n.defaultValue;this.notify()}addListener(e){this.listeners.push(e)}}var ii=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function oi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Mn={exports:{}};(function(t,e){(function(n,r){t.exports=r()})(ii,function(){var n=function(){var r=0,i=document.createElement("div");function o(p){return i.appendChild(p.dom),p}function s(p){for(var m=0;m<i.children.length;m++)i.children[m].style.display=m===p?"block":"none";r=p}i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(p){p.preventDefault(),s(++r%i.children.length)},!1);var a=(performance||Date).now(),l=a,c=0,u=o(new n.Panel("FPS","#0ff","#002")),f=o(new n.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var h=o(new n.Panel("MB","#f08","#201"));return s(0),{REVISION:16,dom:i,addPanel:o,showPanel:s,begin:function(){a=(performance||Date).now()},end:function(){c++;var p=(performance||Date).now();if(f.update(p-a,200),l+1e3<=p&&(u.update(1e3*c/(p-l),100),l=p,c=0,h)){var m=performance.memory;h.update(m.usedJSHeapSize/1048576,m.jsHeapSizeLimit/1048576)}return p},update:function(){a=this.end()},domElement:i,setMode:s}};return n.Panel=function(r,i,o){var s=1/0,a=0,l=Math.round,c=l(window.devicePixelRatio||1),u=80*c,f=48*c,h=3*c,p=2*c,m=3*c,b=15*c,E=74*c,x=30*c,v=document.createElement("canvas");v.width=u,v.height=f,v.style.cssText="width:80px;height:48px";var y=v.getContext("2d");return y.font="bold "+9*c+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=o,y.fillRect(0,0,u,f),y.fillStyle=i,y.fillText(r,h,p),y.fillRect(m,b,E,x),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(m,b,E,x),{dom:v,update:function(_,S){s=Math.min(s,_),a=Math.max(a,_),y.fillStyle=o,y.globalAlpha=1,y.fillRect(0,0,u,b),y.fillStyle=i,y.fillText(l(_)+" "+r+" ("+l(s)+"-"+l(a)+")",h,p),y.drawImage(v,m+c,b,E-c,x,m,b,E-c,x),y.fillRect(m+E-c,b,c,x),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(m+E-c,b,c,l((1-_/S)*x))}}},n})})(Mn);var si=Mn.exports;const ai=oi(si);/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */let at=Float32Array;function ue(t,e,n){const r=new at(3);return t&&(r[0]=t),e&&(r[1]=e),n&&(r[2]=n),r}function li(t,e,n){return n=n||new at(3),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n}function xn(t,e,n){n=n||new at(3);const r=t[2]*e[0]-t[0]*e[2],i=t[0]*e[1]-t[1]*e[0];return n[0]=t[1]*e[2]-t[2]*e[1],n[1]=r,n[2]=i,n}function gt(t,e){e=e||new at(3);const n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=Math.sqrt(n);return r>1e-5?(e[0]=t[0]/r,e[1]=t[1]/r,e[2]=t[2]/r):(e[0]=0,e[1]=0,e[2]=0),e}let F=Float32Array;function ci(t){const e=F;return F=t,e}function ui(t,e){return e=e||new F(16),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e[9]=-t[9],e[10]=-t[10],e[11]=-t[11],e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=-t[15],e}function fi(){return new F(16).fill(0)}function Nn(t,e){return e=e||new F(16),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Un(t){return t=t||new F(16),t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function hi(t,e){if(e=e||new F(16),e===t){let v;return v=t[1],t[1]=t[4],t[4]=v,v=t[2],t[2]=t[8],t[8]=v,v=t[3],t[3]=t[12],t[12]=v,v=t[6],t[6]=t[9],t[9]=v,v=t[7],t[7]=t[13],t[13]=v,v=t[11],t[11]=t[14],t[14]=v,e}const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],u=t[2*4+0],f=t[2*4+1],h=t[2*4+2],p=t[2*4+3],m=t[3*4+0],b=t[3*4+1],E=t[3*4+2],x=t[3*4+3];return e[0]=n,e[1]=s,e[2]=u,e[3]=m,e[4]=r,e[5]=a,e[6]=f,e[7]=b,e[8]=i,e[9]=l,e[10]=h,e[11]=E,e[12]=o,e[13]=c,e[14]=p,e[15]=x,e}function On(t,e){e=e||new F(16);const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],u=t[2*4+0],f=t[2*4+1],h=t[2*4+2],p=t[2*4+3],m=t[3*4+0],b=t[3*4+1],E=t[3*4+2],x=t[3*4+3],v=h*x,y=E*p,_=l*x,S=E*c,R=l*p,C=h*c,K=i*x,q=E*o,V=i*p,H=h*o,P=i*c,w=l*o,U=u*b,O=m*f,X=s*b,z=m*a,Y=s*f,Ue=u*a,Oe=n*b,ze=m*r,$e=n*f,Ge=u*r,ke=n*a,Ve=s*r,fn=v*a+S*f+R*b-(y*a+_*f+C*b),hn=y*r+K*f+H*b-(v*r+q*f+V*b),dn=_*r+q*a+P*b-(S*r+K*a+w*b),mn=C*r+V*a+w*f-(R*r+H*a+P*f),$=1/(n*fn+s*hn+u*dn+m*mn);return e[0]=$*fn,e[1]=$*hn,e[2]=$*dn,e[3]=$*mn,e[4]=$*(y*s+_*u+C*m-(v*s+S*u+R*m)),e[5]=$*(v*n+q*u+V*m-(y*n+K*u+H*m)),e[6]=$*(S*n+K*s+w*m-(_*n+q*s+P*m)),e[7]=$*(R*n+H*s+P*u-(C*n+V*s+w*u)),e[8]=$*(U*c+z*p+Y*x-(O*c+X*p+Ue*x)),e[9]=$*(O*o+Oe*p+Ge*x-(U*o+ze*p+$e*x)),e[10]=$*(X*o+ze*c+ke*x-(z*o+Oe*c+Ve*x)),e[11]=$*(Ue*o+$e*c+Ve*p-(Y*o+Ge*c+ke*p)),e[12]=$*(X*h+Ue*E+O*l-(Y*E+U*l+z*h)),e[13]=$*($e*E+U*i+ze*h-(Oe*h+Ge*E+O*i)),e[14]=$*(Oe*l+Ve*E+z*i-(ke*E+X*i+ze*l)),e[15]=$*(ke*h+Y*i+Ge*l-($e*l+Ve*h+Ue*i)),e}function di(t,e,n){n=n||new F(16);const r=t[0],i=t[1],o=t[2],s=t[3],a=t[4+0],l=t[4+1],c=t[4+2],u=t[4+3],f=t[8+0],h=t[8+1],p=t[8+2],m=t[8+3],b=t[12+0],E=t[12+1],x=t[12+2],v=t[12+3],y=e[0],_=e[1],S=e[2],R=e[3],C=e[4+0],K=e[4+1],q=e[4+2],V=e[4+3],H=e[8+0],P=e[8+1],w=e[8+2],U=e[8+3],O=e[12+0],X=e[12+1],z=e[12+2],Y=e[12+3];return n[0]=r*y+a*_+f*S+b*R,n[1]=i*y+l*_+h*S+E*R,n[2]=o*y+c*_+p*S+x*R,n[3]=s*y+u*_+m*S+v*R,n[4]=r*C+a*K+f*q+b*V,n[5]=i*C+l*K+h*q+E*V,n[6]=o*C+c*K+p*q+x*V,n[7]=s*C+u*K+m*q+v*V,n[8]=r*H+a*P+f*w+b*U,n[9]=i*H+l*P+h*w+E*U,n[10]=o*H+c*P+p*w+x*U,n[11]=s*H+u*P+m*w+v*U,n[12]=r*O+a*X+f*z+b*Y,n[13]=i*O+l*X+h*z+E*Y,n[14]=o*O+c*X+p*z+x*Y,n[15]=s*O+u*X+m*z+v*Y,n}function mi(t,e,n){return n=n||Un(),t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11]),n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function pi(t,e){return e=e||ue(),e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function xi(t,e,n){n=n||ue();const r=e*4;return n[0]=t[r+0],n[1]=t[r+1],n[2]=t[r+2],n}function vi(t,e,n,r){r!==t&&(r=Nn(t,r));const i=n*4;return r[i+0]=e[0],r[i+1]=e[1],r[i+2]=e[2],r}function bi(t,e,n,r,i){i=i||new F(16);const o=Math.tan(Math.PI*.5-.5*t),s=1/(n-r);return i[0]=o/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=(n+r)*s,i[11]=-1,i[12]=0,i[13]=0,i[14]=n*r*s*2,i[15]=0,i}function yi(t,e,n,r,i,o,s){return s=s||new F(16),s[0]=2/(e-t),s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2/(r-n),s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=2/(i-o),s[11]=0,s[12]=(e+t)/(t-e),s[13]=(r+n)/(n-r),s[14]=(o+i)/(i-o),s[15]=1,s}function Ei(t,e,n,r,i,o,s){s=s||new F(16);const a=e-t,l=r-n,c=i-o;return s[0]=2*i/a,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2*i/l,s[6]=0,s[7]=0,s[8]=(t+e)/a,s[9]=(r+n)/l,s[10]=o/c,s[11]=-1,s[12]=0,s[13]=0,s[14]=i*o/c,s[15]=0,s}let le,xe,se;function gi(t,e,n,r){return r=r||new F(16),le=le||ue(),xe=xe||ue(),se=se||ue(),gt(li(t,e,se),se),gt(xn(n,se,le),le),gt(xn(se,le,xe),xe),r[0]=le[0],r[1]=le[1],r[2]=le[2],r[3]=0,r[4]=xe[0],r[5]=xe[1],r[6]=xe[2],r[7]=0,r[8]=se[0],r[9]=se[1],r[10]=se[2],r[11]=0,r[12]=t[0],r[13]=t[1],r[14]=t[2],r[15]=1,r}function Ai(t,e){return e=e||new F(16),e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function _i(t,e,n){n=n||new F(16);const r=e[0],i=e[1],o=e[2],s=t[0],a=t[1],l=t[2],c=t[3],u=t[1*4+0],f=t[1*4+1],h=t[1*4+2],p=t[1*4+3],m=t[2*4+0],b=t[2*4+1],E=t[2*4+2],x=t[2*4+3],v=t[3*4+0],y=t[3*4+1],_=t[3*4+2],S=t[3*4+3];return t!==n&&(n[0]=s,n[1]=a,n[2]=l,n[3]=c,n[4]=u,n[5]=f,n[6]=h,n[7]=p,n[8]=m,n[9]=b,n[10]=E,n[11]=x),n[12]=s*r+u*i+m*o+v,n[13]=a*r+f*i+b*o+y,n[14]=l*r+h*i+E*o+_,n[15]=c*r+p*i+x*o+S,n}function wi(t,e){e=e||new F(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Ti(t,e,n){n=n||new F(16);const r=t[4],i=t[5],o=t[6],s=t[7],a=t[8],l=t[9],c=t[10],u=t[11],f=Math.cos(e),h=Math.sin(e);return n[4]=f*r+h*a,n[5]=f*i+h*l,n[6]=f*o+h*c,n[7]=f*s+h*u,n[8]=f*a-h*r,n[9]=f*l-h*i,n[10]=f*c-h*o,n[11]=f*u-h*s,t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Si(t,e){e=e||new F(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Ci(t,e,n){n=n||new F(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[2*4+0],l=t[2*4+1],c=t[2*4+2],u=t[2*4+3],f=Math.cos(e),h=Math.sin(e);return n[0]=f*r-h*a,n[1]=f*i-h*l,n[2]=f*o-h*c,n[3]=f*s-h*u,n[8]=f*a+h*r,n[9]=f*l+h*i,n[10]=f*c+h*o,n[11]=f*u+h*s,t!==n&&(n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Ri(t,e){e=e||new F(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Fi(t,e,n){n=n||new F(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[1*4+0],l=t[1*4+1],c=t[1*4+2],u=t[1*4+3],f=Math.cos(e),h=Math.sin(e);return n[0]=f*r+h*a,n[1]=f*i+h*l,n[2]=f*o+h*c,n[3]=f*s+h*u,n[4]=f*a-h*r,n[5]=f*l-h*i,n[6]=f*c-h*o,n[7]=f*u-h*s,t!==n&&(n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Di(t,e,n){n=n||new F(16);let r=t[0],i=t[1],o=t[2];const s=Math.sqrt(r*r+i*i+o*o);r/=s,i/=s,o/=s;const a=r*r,l=i*i,c=o*o,u=Math.cos(e),f=Math.sin(e),h=1-u;return n[0]=a+(1-a)*u,n[1]=r*i*h+o*f,n[2]=r*o*h-i*f,n[3]=0,n[4]=r*i*h-o*f,n[5]=l+(1-l)*u,n[6]=i*o*h+r*f,n[7]=0,n[8]=r*o*h+i*f,n[9]=i*o*h-r*f,n[10]=c+(1-c)*u,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function Pi(t,e,n,r){r=r||new F(16);let i=e[0],o=e[1],s=e[2];const a=Math.sqrt(i*i+o*o+s*s);i/=a,o/=a,s/=a;const l=i*i,c=o*o,u=s*s,f=Math.cos(n),h=Math.sin(n),p=1-f,m=l+(1-l)*f,b=i*o*p+s*h,E=i*s*p-o*h,x=i*o*p-s*h,v=c+(1-c)*f,y=o*s*p+i*h,_=i*s*p+o*h,S=o*s*p-i*h,R=u+(1-u)*f,C=t[0],K=t[1],q=t[2],V=t[3],H=t[4],P=t[5],w=t[6],U=t[7],O=t[8],X=t[9],z=t[10],Y=t[11];return r[0]=m*C+b*H+E*O,r[1]=m*K+b*P+E*X,r[2]=m*q+b*w+E*z,r[3]=m*V+b*U+E*Y,r[4]=x*C+v*H+y*O,r[5]=x*K+v*P+y*X,r[6]=x*q+v*w+y*z,r[7]=x*V+v*U+y*Y,r[8]=_*C+S*H+R*O,r[9]=_*K+S*P+R*X,r[10]=_*q+S*w+R*z,r[11]=_*V+S*U+R*Y,t!==r&&(r[12]=t[12],r[13]=t[13],r[14]=t[14],r[15]=t[15]),r}function Ii(t,e){return e=e||new F(16),e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Li(t,e,n){n=n||new F(16);const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0],n[1]=r*t[0*4+1],n[2]=r*t[0*4+2],n[3]=r*t[0*4+3],n[4]=i*t[1*4+0],n[5]=i*t[1*4+1],n[6]=i*t[1*4+2],n[7]=i*t[1*4+3],n[8]=o*t[2*4+0],n[9]=o*t[2*4+1],n[10]=o*t[2*4+2],n[11]=o*t[2*4+3],t!==n&&(n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Bi(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2],s=r*t[0*4+3]+i*t[1*4+3]+o*t[2*4+3]+t[3*4+3];return n[0]=(r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0]+t[3*4+0])/s,n[1]=(r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1]+t[3*4+1])/s,n[2]=(r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2]+t[3*4+2])/s,n}function Mi(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0],n[1]=r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1],n[2]=r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2],n}function Ni(t,e,n){n=n||ue();const r=On(t),i=e[0],o=e[1],s=e[2];return n[0]=i*r[0*4+0]+o*r[0*4+1]+s*r[0*4+2],n[1]=i*r[1*4+0]+o*r[1*4+1]+s*r[1*4+2],n[2]=i*r[2*4+0]+o*r[2*4+1]+s*r[2*4+2],n}var Ui=Object.freeze({__proto__:null,axisRotate:Pi,axisRotation:Di,copy:Nn,create:fi,frustum:Ei,getAxis:xi,getTranslation:pi,identity:Un,inverse:On,lookAt:gi,multiply:di,negate:ui,ortho:yi,perspective:bi,rotateX:Ti,rotateY:Ci,rotateZ:Fi,rotationX:wi,rotationY:Si,rotationZ:Ri,scale:Li,scaling:Ii,setAxis:vi,setDefaultType:ci,setTranslation:mi,transformDirection:Mi,transformNormal:Ni,transformPoint:Bi,translate:_i,translation:Ai,transpose:hi});const Gt=5120,Pe=5121,kt=5122,Vt=5123,Ht=5124,Xt=5125,Yt=5126,Oi=32819,zi=32820,$i=33635,Gi=5131,ki=33640,Vi=35899,Hi=35902,Xi=36269,Yi=34042,zn={};{const t=zn;t[Gt]=Int8Array,t[Pe]=Uint8Array,t[kt]=Int16Array,t[Vt]=Uint16Array,t[Ht]=Int32Array,t[Xt]=Uint32Array,t[Yt]=Float32Array,t[Oi]=Uint16Array,t[zi]=Uint16Array,t[$i]=Uint16Array,t[Gi]=Uint16Array,t[ki]=Uint32Array,t[Vi]=Uint32Array,t[Hi]=Uint32Array,t[Xi]=Uint32Array,t[Yi]=Uint32Array}function Wt(t){if(t instanceof Int8Array)return Gt;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)return Pe;if(t instanceof Int16Array)return kt;if(t instanceof Uint16Array)return Vt;if(t instanceof Int32Array)return Ht;if(t instanceof Uint32Array)return Xt;if(t instanceof Float32Array)return Yt;throw new Error("unsupported typed array type")}function $n(t){if(t===Int8Array)return Gt;if(t===Uint8Array||t===Uint8ClampedArray)return Pe;if(t===Int16Array)return kt;if(t===Uint16Array)return Vt;if(t===Int32Array)return Ht;if(t===Uint32Array)return Xt;if(t===Float32Array)return Yt;throw new Error("unsupported typed array type")}function Gn(t){const e=zn[t];if(!e)throw new Error("unknown gl type");return e}const Ze=typeof SharedArrayBuffer<"u"?function(e){return e&&e.buffer&&(e.buffer instanceof ArrayBuffer||e.buffer instanceof SharedArrayBuffer)}:function(e){return e&&e.buffer&&e.buffer instanceof ArrayBuffer};function kn(...t){console.error(...t)}function Wi(...t){console.warn(...t)}const vn=new Map;function lt(t,e){if(!t||typeof t!="object")return!1;let n=vn.get(e);n||(n=new WeakMap,vn.set(e,n));let r=n.get(t);if(r===void 0){const i=Object.prototype.toString.call(t);r=i.substring(8,i.length-1)===e,n.set(t,r)}return r}function ji(t,e){return typeof WebGLBuffer<"u"&&lt(e,"WebGLBuffer")}function Ki(t,e){return typeof WebGLRenderbuffer<"u"&&lt(e,"WebGLRenderbuffer")}function jt(t,e){return typeof WebGLTexture<"u"&&lt(e,"WebGLTexture")}function qi(t,e){return typeof WebGLSampler<"u"&&lt(e,"WebGLSampler")}const Vn=35044,ye=34962,Qi=34963,Zi=34660,Ji=5120,eo=5121,to=5122,no=5123,ro=5124,io=5125,Hn=5126,Xn={attribPrefix:""};function oo(t,e,n,r,i){t.bindBuffer(e,n),t.bufferData(e,r,i||Vn)}function Yn(t,e,n,r){if(ji(t,e))return e;n=n||ye;const i=t.createBuffer();return oo(t,n,i,e,r),i}function Wn(t){return t==="indices"}function so(t){return t===Int8Array||t===Uint8Array}function ao(t){return t.length?t:t.data}const lo=/coord|texture/i,co=/color|colour/i;function uo(t,e){let n;if(lo.test(t)?n=2:co.test(t)?n=4:n=3,e%n>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);return n}function fo(t,e,n){return t.numComponents||t.size||uo(e,n||ao(t).length)}function jn(t,e){if(Ze(t))return t;if(Ze(t.data))return t.data;Array.isArray(t)&&(t={data:t});let n=t.type?Kt(t.type):void 0;return n||(Wn(e)?n=Uint16Array:n=Float32Array),new n(t.data)}function ho(t){return typeof t=="number"?t:t?$n(t):Hn}function Kt(t){return typeof t=="number"?Gn(t):t||Float32Array}function mo(t,e){return{buffer:e.buffer,numValues:2*3*4,type:ho(e.type),arrayType:Kt(e.type)}}function po(t,e){const n=e.data||e,r=Kt(e.type),i=n*r.BYTES_PER_ELEMENT,o=t.createBuffer();return t.bindBuffer(ye,o),t.bufferData(ye,i,e.drawType||Vn),{buffer:o,numValues:n,type:$n(r),arrayType:r}}function xo(t,e,n){const r=jn(e,n);return{arrayType:r.constructor,buffer:Yn(t,r,void 0,e.drawType),type:Wt(r),numValues:0}}function vo(t,e){const n={};return Object.keys(e).forEach(function(r){if(!Wn(r)){const i=e[r],o=i.attrib||i.name||i.attribName||Xn.attribPrefix+r;if(i.value){if(!Array.isArray(i.value)&&!Ze(i.value))throw new Error("array.value is not array or typedarray");n[o]={value:i.value}}else{let s;i.buffer&&i.buffer instanceof WebGLBuffer?s=mo:typeof i=="number"||typeof i.data=="number"?s=po:s=xo;const{buffer:a,type:l,numValues:c,arrayType:u}=s(t,i,r),f=i.normalize!==void 0?i.normalize:so(u),h=fo(i,r,c);n[o]={buffer:a,numComponents:h,type:l,normalize:f,stride:i.stride||0,offset:i.offset||0,divisor:i.divisor===void 0?void 0:i.divisor,drawType:i.drawType}}}}),t.bindBuffer(ye,null),n}function bo(t,e){return e===Ji||e===eo?1:e===to||e===no?2:e===ro||e===io||e===Hn?4:0}const At=["position","positions","a_position"];function yo(t,e){let n,r;for(r=0;r<At.length&&(n=At[r],!(n in e||(n=Xn.attribPrefix+n,n in e)));++r);r===At.length&&(n=Object.keys(e)[0]);const i=e[n];if(!i.buffer)return 1;t.bindBuffer(ye,i.buffer);const o=t.getBufferParameter(ye,Zi);t.bindBuffer(ye,null);const s=bo(t,i.type),a=o/s,l=i.numComponents||i.size,c=a/l;if(c%1!==0)throw new Error(`numComponents ${l} not correct for length ${length}`);return c}function Rt(t,e,n){const r=vo(t,e),i=Object.assign({},n||{});i.attribs=Object.assign({},n?n.attribs:{},r);const o=e.indices;if(o){const s=jn(o,"indices");i.indices=Yn(t,s,Qi),i.numElements=s.length,i.elementType=Wt(s)}else i.numElements||(i.numElements=yo(t,i.attribs));return i}function Be(t){return!!t.texStorage2D}const Je=function(){const t={},e={};function n(r){const i=r.constructor.name;if(!t[i]){for(const o in r)if(typeof r[o]=="number"){const s=e[r[o]];e[r[o]]=s?`${s} | ${o}`:o}t[i]=!0}}return function(i,o){return n(i),e[o]||(typeof o=="number"?`0x${o.toString(16)}`:o)}}(),he={textureColor:new Uint8Array([128,192,255,255]),textureOptions:{},crossOrigin:void 0},Ie=Ze,Kn=function(){let t;return function(){return t=t||(typeof document<"u"&&document.createElement?document.createElement("canvas").getContext("2d"):null),t}}(),bn=6406,re=6407,I=6408,yn=6409,En=6410,Ce=6402,gn=34041,et=33071,Eo=9728,go=9729,de=3553,fe=34067,Ee=32879,ge=35866,qt=34069,Ao=34070,_o=34071,wo=34072,To=34073,So=34074,Ft=10241,Dt=10240,tt=10242,nt=10243,An=32882,Co=33082,Ro=33083,Fo=33084,Do=33085,Po=34892,Io=34893,Qt=3317,qn=3314,Qn=32878,Zn=3316,Jn=3315,er=32877,Lo=37443,Bo=37441,Mo=37440,No=33321,Uo=36756,Oo=33325,zo=33326,$o=33330,Go=33329,ko=33338,Vo=33337,Ho=33340,Xo=33339,Yo=33323,Wo=36757,jo=33327,Ko=33328,qo=33336,Qo=33335,Zo=33332,Jo=33331,es=33334,ts=33333,ns=32849,rs=35905,is=36194,os=36758,ss=35898,as=35901,ls=34843,cs=34837,us=36221,fs=36239,hs=36215,ds=36233,ms=36209,ps=36227,xs=32856,vs=35907,bs=36759,ys=32855,Es=32854,gs=32857,As=34842,_s=34836,ws=36220,Ts=36238,Ss=36975,Cs=36214,Rs=36232,Fs=36226,Ds=36208,Ps=33189,Is=33190,Ls=36012,Bs=36013,Ms=35056,ce=5120,D=5121,He=5122,Ae=5123,Xe=5124,ve=5125,k=5126,_n=32819,wn=32820,Tn=33635,te=5131,Re=36193,_t=33640,Ns=35899,Us=35902,Os=36269,zs=34042,Ye=33319,_e=33320,We=6403,we=36244,Te=36248,be=36249;let wt;function ct(t){if(!wt){const e={};e[bn]={textureFormat:bn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[D,te,Re,k]},e[yn]={textureFormat:yn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[D,te,Re,k]},e[En]={textureFormat:En,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2,4,4,8],type:[D,te,Re,k]},e[re]={textureFormat:re,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,6,6,12,2],type:[D,te,Re,k,Tn]},e[I]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,8,8,16,2,2],type:[D,te,Re,k,_n,wn]},e[Ce]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[ve,Ae]},e[No]={textureFormat:We,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1],type:[D]},e[Uo]={textureFormat:We,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[1],type:[ce]},e[Oo]={textureFormat:We,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4,2],type:[k,te]},e[zo]={textureFormat:We,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[4],type:[k]},e[$o]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[D]},e[Go]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[ce]},e[Zo]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[Ae]},e[Jo]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[He]},e[es]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[ts]={textureFormat:we,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Xe]},e[Yo]={textureFormat:Ye,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2],type:[D]},e[Wo]={textureFormat:Ye,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[2],type:[ce]},e[jo]={textureFormat:Ye,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[8,4],type:[k,te]},e[Ko]={textureFormat:Ye,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[8],type:[k]},e[qo]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[D]},e[Qo]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[ce]},e[ko]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Ae]},e[Vo]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[He]},e[Ho]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[ve]},e[Xo]={textureFormat:_e,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[Xe]},e[ns]={textureFormat:re,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3],type:[D]},e[rs]={textureFormat:re,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[D]},e[is]={textureFormat:re,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,2],type:[D,Tn]},e[os]={textureFormat:re,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[ce]},e[ss]={textureFormat:re,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[k,te,Ns]},e[as]={textureFormat:re,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[k,te,Us]},e[ls]={textureFormat:re,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6],type:[k,te]},e[cs]={textureFormat:re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[k]},e[us]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[D]},e[fs]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[ce]},e[hs]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[Ae]},e[ds]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[He]},e[ms]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[ve]},e[ps]={textureFormat:Te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[Xe]},e[xs]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[D]},e[vs]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[D]},e[bs]={textureFormat:I,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4],type:[ce]},e[ys]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2,4],type:[D,wn,_t]},e[Es]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2],type:[D,_n]},e[gs]={textureFormat:I,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[_t]},e[As]={textureFormat:I,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[16,8],type:[k,te]},e[_s]={textureFormat:I,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[16],type:[k]},e[ws]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[D]},e[Ts]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ce]},e[Ss]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[_t]},e[Cs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[Ae]},e[Rs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[He]},e[Fs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[Xe]},e[Ds]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[ve]},e[Ps]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[Ae,ve]},e[Is]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[Ls]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[k]},e[Ms]={textureFormat:gn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[zs]},e[Bs]={textureFormat:gn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Os]},Object.keys(e).forEach(function(n){const r=e[n];r.bytesPerElementMap={},r.bytesPerElement.forEach(function(i,o){const s=r.type[o];r.bytesPerElementMap[s]=i})}),wt=e}return wt[t]}function $s(t,e){const n=ct(t);if(!n)throw"unknown internal format";const r=n.bytesPerElementMap[e];if(r===void 0)throw"unknown internal format";return r}function Me(t){const e=ct(t);if(!e)throw"unknown internal format";return{format:e.textureFormat,type:e.type[0]}}function Sn(t){return(t&t-1)===0}function Gs(t,e,n,r){if(!Be(t))return Sn(e)&&Sn(n);const i=ct(r);if(!i)throw"unknown internal format";return i.colorRenderable&&i.textureFilterable}function ks(t){const e=ct(t);if(!e)throw"unknown internal format";return e.textureFilterable}function Vs(t,e,n){return Ie(e)?Wt(e):n||D}function je(t,e,n,r,i){if(i%1!==0)throw"can't guess dimensions";if(!n&&!r){const o=Math.sqrt(i/(e===fe?6:1));o%1===0?(n=o,r=o):(n=i,r=1)}else if(r){if(!n&&(n=i/r,n%1))throw"can't guess dimensions"}else if(r=i/n,r%1)throw"can't guess dimensions";return{width:n,height:r}}function Se(t,e){e.colorspaceConversion!==void 0&&t.pixelStorei(Lo,e.colorspaceConversion),e.premultiplyAlpha!==void 0&&t.pixelStorei(Bo,e.premultiplyAlpha),e.flipY!==void 0&&t.pixelStorei(Mo,e.flipY)}function tr(t){t.pixelStorei(Qt,4),Be(t)&&(t.pixelStorei(qn,0),t.pixelStorei(Qn,0),t.pixelStorei(Zn,0),t.pixelStorei(Jn,0),t.pixelStorei(er,0))}function Hs(t,e,n,r){r.minMag&&(n.call(t,e,Ft,r.minMag),n.call(t,e,Dt,r.minMag)),r.min&&n.call(t,e,Ft,r.min),r.mag&&n.call(t,e,Dt,r.mag),r.wrap&&(n.call(t,e,tt,r.wrap),n.call(t,e,nt,r.wrap),(e===Ee||qi(t,e))&&n.call(t,e,An,r.wrap)),r.wrapR&&n.call(t,e,An,r.wrapR),r.wrapS&&n.call(t,e,tt,r.wrapS),r.wrapT&&n.call(t,e,nt,r.wrapT),r.minLod!==void 0&&n.call(t,e,Co,r.minLod),r.maxLod!==void 0&&n.call(t,e,Ro,r.maxLod),r.baseLevel!==void 0&&n.call(t,e,Fo,r.baseLevel),r.maxLevel!==void 0&&n.call(t,e,Do,r.maxLevel),r.compareFunc!==void 0&&n.call(t,e,Io,r.compareFunc),r.compareMode!==void 0&&n.call(t,e,Po,r.compareMode)}function nr(t,e,n){const r=n.target||de;t.bindTexture(r,e),Hs(t,r,t.texParameteri,n)}function Xs(t){return t=t||he.textureColor,Ie(t)?t:new Uint8Array([t[0]*255,t[1]*255,t[2]*255,t[3]*255])}function Pt(t,e,n,r,i,o){n=n||he.textureOptions,o=o||I;const s=n.target||de;if(r=r||n.width,i=i||n.height,t.bindTexture(s,e),Gs(t,r,i,o))t.generateMipmap(s);else{const a=ks(o)?go:Eo;t.texParameteri(s,Ft,a),t.texParameteri(s,Dt,a),t.texParameteri(s,tt,et),t.texParameteri(s,nt,et)}}function Le(t){return t.auto===!0||t.auto===void 0&&t.level===void 0}function It(t,e){return e=e||{},e.cubeFaceOrder||[qt,Ao,_o,wo,To,So]}function Lt(t,e){const r=It(t,e).map(function(i,o){return{face:i,ndx:o}});return r.sort(function(i,o){return i.face-o.face}),r}function rr(t,e,n,r){r=r||he.textureOptions;const i=r.target||de,o=r.level||0;let s=n.width,a=n.height;const l=r.internalFormat||r.format||I,c=Me(l),u=r.format||c.format,f=r.type||c.type;if(Se(t,r),t.bindTexture(i,e),i===fe){const h=n.width,p=n.height;let m,b;if(h/6===p)m=p,b=[0,0,1,0,2,0,3,0,4,0,5,0];else if(p/6===h)m=h,b=[0,0,0,1,0,2,0,3,0,4,0,5];else if(h/3===p/2)m=h/3,b=[0,0,1,0,2,0,0,1,1,1,2,1];else if(h/2===p/3)m=h/2,b=[0,0,1,0,0,1,1,1,0,2,1,2];else throw"can't figure out cube map from element: "+(n.src?n.src:n.nodeName);const E=Kn();E?(E.canvas.width=m,E.canvas.height=m,s=m,a=m,Lt(t,r).forEach(function(x){const v=b[x.ndx*2+0]*m,y=b[x.ndx*2+1]*m;E.drawImage(n,v,y,m,m,0,0,m,m),t.texImage2D(x.face,o,l,u,f,E.canvas)}),E.canvas.width=1,E.canvas.height=1):typeof createImageBitmap<"u"&&(s=m,a=m,Lt(t,r).forEach(function(x){const v=b[x.ndx*2+0]*m,y=b[x.ndx*2+1]*m;t.texImage2D(x.face,o,l,m,m,0,u,f,null),createImageBitmap(n,v,y,m,m,{premultiplyAlpha:"none",colorSpaceConversion:"none"}).then(function(_){Se(t,r),t.bindTexture(i,e),t.texImage2D(x.face,o,l,u,f,_),Le(r)&&Pt(t,e,r,s,a,l)})}))}else if(i===Ee||i===ge){const h=Math.min(n.width,n.height),p=Math.max(n.width,n.height),m=p/h;if(m%1!==0)throw"can not compute 3D dimensions of element";const b=n.width===p?1:0,E=n.height===p?1:0;t.pixelStorei(Qt,1),t.pixelStorei(qn,n.width),t.pixelStorei(Qn,0),t.pixelStorei(er,0),t.texImage3D(i,o,l,h,h,h,0,u,f,null);for(let x=0;x<m;++x){const v=x*h*b,y=x*h*E;t.pixelStorei(Zn,v),t.pixelStorei(Jn,y),t.texSubImage3D(i,o,0,0,x,h,h,1,u,f,n)}tr(t)}else t.texImage2D(i,o,l,u,f,n);Le(r)&&Pt(t,e,r,s,a,l),nr(t,e,r)}function Ne(){}function Ys(t){if(typeof document<"u"){const e=document.createElement("a");return e.href=t,e.hostname===location.hostname&&e.port===location.port&&e.protocol===location.protocol}else{const e=new URL(location.href).origin;return new URL(t,location.href).origin===e}}function Ws(t,e){return e===void 0&&!Ys(t)?"anonymous":e}function js(t,e,n){n=n||Ne;let r;if(e=e!==void 0?e:he.crossOrigin,e=Ws(t,e),typeof Image<"u"){r=new Image,e!==void 0&&(r.crossOrigin=e);const i=function(){r.removeEventListener("error",o),r.removeEventListener("load",s),r=null},o=function(){const l="couldn't load image: "+t;kn(l),n(l,r),i()},s=function(){n(null,r),i()};return r.addEventListener("error",o),r.addEventListener("load",s),r.src=t,r}else if(typeof ImageBitmap<"u"){let i,o;const s=function(){n(i,o)},a={};e&&(a.mode="cors"),fetch(t,a).then(function(l){if(!l.ok)throw l;return l.blob()}).then(function(l){return createImageBitmap(l,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}).then(function(l){o=l,setTimeout(s)}).catch(function(l){i=l,setTimeout(s)}),r=null}return r}function ir(t){return typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof ImageData<"u"&&t instanceof ImageData||typeof HTMLElement<"u"&&t instanceof HTMLElement}function Zt(t,e,n){return ir(t)?(setTimeout(function(){n(null,t)}),t):js(t,e,n)}function Jt(t,e,n){n=n||he.textureOptions;const r=n.target||de;if(t.bindTexture(r,e),n.color===!1)return;const i=Xs(n.color);if(r===fe)for(let o=0;o<6;++o)t.texImage2D(qt+o,0,I,1,1,0,I,D,i);else r===Ee||r===ge?t.texImage3D(r,0,I,1,1,1,0,I,D,i):t.texImage2D(r,0,I,1,1,0,I,D,i)}function Ks(t,e,n,r){return r=r||Ne,n=n||he.textureOptions,Jt(t,e,n),n=Object.assign({},n),Zt(n.src,n.crossOrigin,function(o,s){o?r(o,e,s):(rr(t,e,s,n),r(null,e,s))})}function qs(t,e,n,r){r=r||Ne;const i=n.src;if(i.length!==6)throw"there must be 6 urls for a cubemap";const o=n.level||0,s=n.internalFormat||n.format||I,a=Me(s),l=n.format||a.format,c=n.type||D,u=n.target||de;if(u!==fe)throw"target must be TEXTURE_CUBE_MAP";Jt(t,e,n),n=Object.assign({},n);let f=6;const h=[],p=It(t,n);let m;function b(E){return function(x,v){--f,x?h.push(x):v.width!==v.height?h.push("cubemap face img is not a square: "+v.src):(Se(t,n),t.bindTexture(u,e),f===5?It().forEach(function(y){t.texImage2D(y,o,s,l,c,v)}):t.texImage2D(E,o,s,l,c,v),Le(n)&&t.generateMipmap(u)),f===0&&r(h.length?h:void 0,e,m)}}m=i.map(function(E,x){return Zt(E,n.crossOrigin,b(p[x]))})}function Qs(t,e,n,r){r=r||Ne;const i=n.src,o=n.internalFormat||n.format||I,s=Me(o),a=n.format||s.format,l=n.type||D,c=n.target||ge;if(c!==Ee&&c!==ge)throw"target must be TEXTURE_3D or TEXTURE_2D_ARRAY";Jt(t,e,n),n=Object.assign({},n);let u=i.length;const f=[];let h;const p=n.level||0;let m=n.width,b=n.height;const E=i.length;let x=!0;function v(y){return function(_,S){if(--u,_)f.push(_);else{if(Se(t,n),t.bindTexture(c,e),x){x=!1,m=n.width||S.width,b=n.height||S.height,t.texImage3D(c,p,o,m,b,E,0,a,l,null);for(let R=0;R<E;++R)t.texSubImage3D(c,p,0,0,R,m,b,1,a,l,S)}else{let R=S,C;(S.width!==m||S.height!==b)&&(C=Kn(),R=C.canvas,C.canvas.width=m,C.canvas.height=b,C.drawImage(S,0,0,m,b)),t.texSubImage3D(c,p,0,0,y,m,b,1,a,l,R),C&&R===C.canvas&&(C.canvas.width=0,C.canvas.height=0)}Le(n)&&t.generateMipmap(c)}u===0&&r(f.length?f:void 0,e,h)}}h=i.map(function(y,_){return Zt(y,n.crossOrigin,v(_))})}function Zs(t,e,n,r){r=r||he.textureOptions;const i=r.target||de;t.bindTexture(i,e);let o=r.width,s=r.height,a=r.depth;const l=r.level||0,c=r.internalFormat||r.format||I,u=Me(c),f=r.format||u.format,h=r.type||Vs(t,n,u.type);if(Ie(n))n instanceof Uint8ClampedArray&&(n=new Uint8Array(n.buffer));else{const E=Gn(h);n=new E(n)}const p=$s(c,h),m=n.byteLength/p;if(m%1)throw"length wrong size for format: "+Je(t,f);let b;if(i===Ee||i===ge)if(!o&&!s&&!a){const E=Math.cbrt(m);if(E%1!==0)throw"can't guess cube size of array of numElements: "+m;o=E,s=E,a=E}else o&&(!s||!a)?(b=je(t,i,s,a,m/o),s=b.width,a=b.height):s&&(!o||!a)?(b=je(t,i,o,a,m/s),o=b.width,a=b.height):(b=je(t,i,o,s,m/a),o=b.width,s=b.height);else b=je(t,i,o,s,m),o=b.width,s=b.height;if(tr(t),t.pixelStorei(Qt,r.unpackAlignment||1),Se(t,r),i===fe){const E=p/n.BYTES_PER_ELEMENT,x=m/6*E;Lt(t,r).forEach(v=>{const y=x*v.ndx,_=n.subarray(y,y+x);t.texImage2D(v.face,l,c,o,s,0,f,h,_)})}else i===Ee||i===ge?t.texImage3D(i,l,c,o,s,a,0,f,h,n):t.texImage2D(i,l,c,o,s,0,f,h,n);return{width:o,height:s,depth:a,type:h}}function Js(t,e,n){const r=n.target||de;t.bindTexture(r,e);const i=n.level||0,o=n.internalFormat||n.format||I,s=Me(o),a=n.format||s.format,l=n.type||s.type;if(Se(t,n),r===fe)for(let c=0;c<6;++c)t.texImage2D(qt+c,i,o,n.width,n.height,0,a,l,null);else r===Ee||r===ge?t.texImage3D(r,i,o,n.width,n.height,n.depth,0,a,l,null):t.texImage2D(r,i,o,n.width,n.height,0,a,l,null)}function ea(t,e,n){n=n||Ne,e=e||he.textureOptions;const r=t.createTexture(),i=e.target||de;let o=e.width||1,s=e.height||1;const a=e.internalFormat||I;t.bindTexture(i,r),i===fe&&(t.texParameteri(i,tt,et),t.texParameteri(i,nt,et));let l=e.src;if(l)if(typeof l=="function"&&(l=l(t,e)),typeof l=="string")Ks(t,r,e,n);else if(Ie(l)||Array.isArray(l)&&(typeof l[0]=="number"||Array.isArray(l[0])||Ie(l[0]))){const c=Zs(t,r,l,e);o=c.width,s=c.height}else Array.isArray(l)&&(typeof l[0]=="string"||ir(l[0]))?i===fe?qs(t,r,e,n):Qs(t,r,e,n):(rr(t,r,l,e),o=l.width,s=l.height);else Js(t,r,e);return Le(e)&&Pt(t,r,e,o,s,a),nr(t,r,e),r}const en=kn;function or(t){return typeof document<"u"&&document.getElementById?document.getElementById(t):null}const rt=33984,ut=34962,ta=34963,na=35713,ra=35714,ia=35632,oa=35633,sa=35981,sr=35718,aa=35721,la=35971,ca=35382,ua=35396,fa=35398,ha=35392,da=35395,ft=5126,ar=35664,lr=35665,cr=35666,tn=5124,ur=35667,fr=35668,hr=35669,dr=35670,mr=35671,pr=35672,xr=35673,vr=35674,br=35675,yr=35676,ma=35678,pa=35680,xa=35679,va=35682,ba=35685,ya=35686,Ea=35687,ga=35688,Aa=35689,_a=35690,wa=36289,Ta=36292,Sa=36293,nn=5125,Er=36294,gr=36295,Ar=36296,Ca=36298,Ra=36299,Fa=36300,Da=36303,Pa=36306,Ia=36307,La=36308,Ba=36311,ht=3553,dt=34067,rn=32879,mt=35866,A={};function _r(t,e){return A[e].bindPoint}function Ma(t,e){return function(n){t.uniform1f(e,n)}}function Na(t,e){return function(n){t.uniform1fv(e,n)}}function Ua(t,e){return function(n){t.uniform2fv(e,n)}}function Oa(t,e){return function(n){t.uniform3fv(e,n)}}function za(t,e){return function(n){t.uniform4fv(e,n)}}function wr(t,e){return function(n){t.uniform1i(e,n)}}function Tr(t,e){return function(n){t.uniform1iv(e,n)}}function Sr(t,e){return function(n){t.uniform2iv(e,n)}}function Cr(t,e){return function(n){t.uniform3iv(e,n)}}function Rr(t,e){return function(n){t.uniform4iv(e,n)}}function $a(t,e){return function(n){t.uniform1ui(e,n)}}function Ga(t,e){return function(n){t.uniform1uiv(e,n)}}function ka(t,e){return function(n){t.uniform2uiv(e,n)}}function Va(t,e){return function(n){t.uniform3uiv(e,n)}}function Ha(t,e){return function(n){t.uniform4uiv(e,n)}}function Xa(t,e){return function(n){t.uniformMatrix2fv(e,!1,n)}}function Ya(t,e){return function(n){t.uniformMatrix3fv(e,!1,n)}}function Wa(t,e){return function(n){t.uniformMatrix4fv(e,!1,n)}}function ja(t,e){return function(n){t.uniformMatrix2x3fv(e,!1,n)}}function Ka(t,e){return function(n){t.uniformMatrix3x2fv(e,!1,n)}}function qa(t,e){return function(n){t.uniformMatrix2x4fv(e,!1,n)}}function Qa(t,e){return function(n){t.uniformMatrix4x2fv(e,!1,n)}}function Za(t,e){return function(n){t.uniformMatrix3x4fv(e,!1,n)}}function Ja(t,e){return function(n){t.uniformMatrix4x3fv(e,!1,n)}}function W(t,e,n,r){const i=_r(t,e);return Be(t)?function(o){let s,a;!o||jt(t,o)?(s=o,a=null):(s=o.texture,a=o.sampler),t.uniform1i(r,n),t.activeTexture(rt+n),t.bindTexture(i,s),t.bindSampler(n,a)}:function(o){t.uniform1i(r,n),t.activeTexture(rt+n),t.bindTexture(i,o)}}function j(t,e,n,r,i){const o=_r(t,e),s=new Int32Array(i);for(let a=0;a<i;++a)s[a]=n+a;return Be(t)?function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(rt+s[c]);let u,f;!l||jt(t,l)?(u=l,f=null):(u=l.texture,f=l.sampler),t.bindSampler(n,f),t.bindTexture(o,u)})}:function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(rt+s[c]),t.bindTexture(o,l)})}}A[ft]={Type:Float32Array,size:4,setter:Ma,arraySetter:Na};A[ar]={Type:Float32Array,size:8,setter:Ua,cols:2};A[lr]={Type:Float32Array,size:12,setter:Oa,cols:3};A[cr]={Type:Float32Array,size:16,setter:za,cols:4};A[tn]={Type:Int32Array,size:4,setter:wr,arraySetter:Tr};A[ur]={Type:Int32Array,size:8,setter:Sr,cols:2};A[fr]={Type:Int32Array,size:12,setter:Cr,cols:3};A[hr]={Type:Int32Array,size:16,setter:Rr,cols:4};A[nn]={Type:Uint32Array,size:4,setter:$a,arraySetter:Ga};A[Er]={Type:Uint32Array,size:8,setter:ka,cols:2};A[gr]={Type:Uint32Array,size:12,setter:Va,cols:3};A[Ar]={Type:Uint32Array,size:16,setter:Ha,cols:4};A[dr]={Type:Uint32Array,size:4,setter:wr,arraySetter:Tr};A[mr]={Type:Uint32Array,size:8,setter:Sr,cols:2};A[pr]={Type:Uint32Array,size:12,setter:Cr,cols:3};A[xr]={Type:Uint32Array,size:16,setter:Rr,cols:4};A[vr]={Type:Float32Array,size:32,setter:Xa,rows:2,cols:2};A[br]={Type:Float32Array,size:48,setter:Ya,rows:3,cols:3};A[yr]={Type:Float32Array,size:64,setter:Wa,rows:4,cols:4};A[ba]={Type:Float32Array,size:32,setter:ja,rows:2,cols:3};A[ya]={Type:Float32Array,size:32,setter:qa,rows:2,cols:4};A[Ea]={Type:Float32Array,size:48,setter:Ka,rows:3,cols:2};A[ga]={Type:Float32Array,size:48,setter:Za,rows:3,cols:4};A[Aa]={Type:Float32Array,size:64,setter:Qa,rows:4,cols:2};A[_a]={Type:Float32Array,size:64,setter:Ja,rows:4,cols:3};A[ma]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:ht};A[pa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:dt};A[xa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:rn};A[va]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:ht};A[wa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:mt};A[Ta]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:mt};A[Sa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:dt};A[Ca]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:ht};A[Ra]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:rn};A[Fa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:dt};A[Da]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:mt};A[Pa]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:ht};A[Ia]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:rn};A[La]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:dt};A[Ba]={Type:null,size:0,setter:W,arraySetter:j,bindPoint:mt};function pt(t,e){return function(n){if(n.value)switch(t.disableVertexAttribArray(e),n.value.length){case 4:t.vertexAttrib4fv(e,n.value);break;case 3:t.vertexAttrib3fv(e,n.value);break;case 2:t.vertexAttrib2fv(e,n.value);break;case 1:t.vertexAttrib1fv(e,n.value);break;default:throw new Error("the length of a float constant value must be between 1 and 4!")}else t.bindBuffer(ut,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n.numComponents||n.size,n.type||ft,n.normalize||!1,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function me(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4iv(e,n.value);else throw new Error("The length of an integer constant value must be 4!");else t.bindBuffer(ut,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||tn,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function xt(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4uiv(e,n.value);else throw new Error("The length of an unsigned integer constant value must be 4!");else t.bindBuffer(ut,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||nn,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function on(t,e,n){const r=n.size,i=n.count;return function(o){t.bindBuffer(ut,o.buffer);const s=o.size||o.numComponents||r,a=s/i,l=o.type||ft,u=A[l].size*s,f=o.normalize||!1,h=o.offset||0,p=u/i;for(let m=0;m<i;++m)t.enableVertexAttribArray(e+m),t.vertexAttribPointer(e+m,a,l,f,u,h+p*m),t.vertexAttribDivisor&&t.vertexAttribDivisor(e+m,o.divisor||0)}}const M={};M[ft]={size:4,setter:pt};M[ar]={size:8,setter:pt};M[lr]={size:12,setter:pt};M[cr]={size:16,setter:pt};M[tn]={size:4,setter:me};M[ur]={size:8,setter:me};M[fr]={size:12,setter:me};M[hr]={size:16,setter:me};M[nn]={size:4,setter:xt};M[Er]={size:8,setter:xt};M[gr]={size:12,setter:xt};M[Ar]={size:16,setter:xt};M[dr]={size:4,setter:me};M[mr]={size:8,setter:me};M[pr]={size:12,setter:me};M[xr]={size:16,setter:me};M[vr]={size:4,setter:on,count:2};M[br]={size:9,setter:on,count:3};M[yr]={size:16,setter:on,count:4};const el=/ERROR:\s*\d+:(\d+)/gi;function tl(t,e="",n=0){const r=[...e.matchAll(el)],i=new Map(r.map((o,s)=>{const a=parseInt(o[1]),l=r[s+1],c=l?l.index:e.length,u=e.substring(o.index,c);return[a-1,u]}));return t.split(`
`).map((o,s)=>{const a=i.get(s);return`${s+1+n}: ${o}${a?`

^^^ ${a}`:""}`}).join(`
`)}const Cn=/^[ \t]*\n/;function Fr(t){let e=0;return Cn.test(t)&&(e=1,t=t.replace(Cn,"")),{lineOffset:e,shaderSource:t}}function nl(t,e){return t.errorCallback(e),t.callback&&setTimeout(()=>{t.callback(`${e}
${t.errors.join(`
`)}`)}),null}function rl(t,e,n,r){if(r=r||en,!t.getShaderParameter(n,na)){const o=t.getShaderInfoLog(n),{lineOffset:s,shaderSource:a}=Fr(t.getShaderSource(n)),l=`${tl(a,o,s)}
Error compiling ${Je(t,e)}: ${o}`;return r(l),l}return""}function sn(t,e,n){let r,i,o;if(typeof e=="function"&&(n=e,e=void 0),typeof t=="function")n=t,t=void 0;else if(t&&!Array.isArray(t)){const c=t;n=c.errorCallback,t=c.attribLocations,r=c.transformFeedbackVaryings,i=c.transformFeedbackMode,o=c.callback}const s=n||en,a=[],l={errorCallback(c,...u){a.push(c),s(c,...u)},transformFeedbackVaryings:r,transformFeedbackMode:i,callback:o,errors:a};{let c={};Array.isArray(t)?t.forEach(function(u,f){c[u]=e?e[f]:f}):c=t||{},l.attribLocations=c}return l}const il=["VERTEX_SHADER","FRAGMENT_SHADER"];function ol(t,e){if(e.indexOf("frag")>=0)return ia;if(e.indexOf("vert")>=0)return oa}function sl(t,e,n){const r=t.getAttachedShaders(e);for(const i of r)n.has(i)&&t.deleteShader(i);t.deleteProgram(e)}const al=(t=0)=>new Promise(e=>setTimeout(e,t));function ll(t,e,n){const r=t.createProgram(),{attribLocations:i,transformFeedbackVaryings:o,transformFeedbackMode:s}=sn(n);for(let a=0;a<e.length;++a){let l=e[a];if(typeof l=="string"){const c=or(l),u=c?c.text:l;let f=t[il[a]];c&&c.type&&(f=ol(t,c.type)||f),l=t.createShader(f),t.shaderSource(l,Fr(u).shaderSource),t.compileShader(l),t.attachShader(r,l)}}Object.entries(i).forEach(([a,l])=>t.bindAttribLocation(r,l,a));{let a=o;a&&(a.attribs&&(a=a.attribs),Array.isArray(a)||(a=Object.keys(a)),t.transformFeedbackVaryings(r,a,s||sa))}return t.linkProgram(r),r}function cl(t,e,n,r,i){const o=sn(n,r,i),s=new Set(e),a=ll(t,e,o);function l(c,u){const f=fl(c,u,o.errorCallback);return f&&sl(c,u,s),f}if(o.callback){ul(t,a).then(()=>{const c=l(t,a);o.callback(c,c?void 0:a)});return}return l(t,a)?void 0:a}async function ul(t,e){const n=t.getExtension("KHR_parallel_shader_compile"),r=n?(o,s)=>o.getProgramParameter(s,n.COMPLETION_STATUS_KHR):()=>!0;let i=0;do await al(i),i=1e3/60;while(!r(t,e))}function fl(t,e,n){if(n=n||en,!t.getProgramParameter(e,ra)){const i=t.getProgramInfoLog(e);n(`Error in program linking: ${i}`);const s=t.getAttachedShaders(e).map(a=>rl(t,t.getShaderParameter(a,t.SHADER_TYPE),a,n));return`${i}
${s.filter(a=>a).join(`
`)}`}}function hl(t,e,n,r,i){return cl(t,e,n,r,i)}function Dr(t){const e=t.name;return e.startsWith("gl_")||e.startsWith("webgl_")}const dl=/(\.|\[|]|\w+)/g,ml=t=>t>="0"&&t<="9";function pl(t,e,n,r){const i=t.split(dl).filter(a=>a!=="");let o=0,s="";for(;;){const a=i[o++];s+=a;const l=ml(a[0]),c=l?parseInt(a):a;if(l&&(s+=i[o++]),o===i.length){n[c]=e;break}else{const f=i[o++],h=f==="[",p=n[c]||(h?[]:{});n[c]=p,n=p,r[s]=r[s]||function(m){return function(b){Pr(m,b)}}(p),s+=f}}}function xl(t,e){let n=0;function r(a,l,c){const u=l.name.endsWith("[0]"),f=l.type,h=A[f];if(!h)throw new Error(`unknown type: 0x${f.toString(16)}`);let p;if(h.bindPoint){const m=n;n+=l.size,u?p=h.arraySetter(t,f,m,c,l.size):p=h.setter(t,f,m,c,l.size)}else h.arraySetter&&u?p=h.arraySetter(t,c):p=h.setter(t,c);return p.location=c,p}const i={},o={},s=t.getProgramParameter(e,sr);for(let a=0;a<s;++a){const l=t.getActiveUniform(e,a);if(Dr(l))continue;let c=l.name;c.endsWith("[0]")&&(c=c.substr(0,c.length-3));const u=t.getUniformLocation(e,l.name);if(u){const f=r(e,l,u);i[c]=f,pl(c,f,o,i)}}return i}function vl(t,e){const n={},r=t.getProgramParameter(e,la);for(let i=0;i<r;++i){const o=t.getTransformFeedbackVarying(e,i);n[o.name]={index:i,type:o.type,size:o.size}}return n}function bl(t,e){const n=t.getProgramParameter(e,sr),r=[],i=[];for(let a=0;a<n;++a){i.push(a),r.push({});const l=t.getActiveUniform(e,a);r[a].name=l.name}[["UNIFORM_TYPE","type"],["UNIFORM_SIZE","size"],["UNIFORM_BLOCK_INDEX","blockNdx"],["UNIFORM_OFFSET","offset"]].forEach(function(a){const l=a[0],c=a[1];t.getActiveUniforms(e,i,t[l]).forEach(function(u,f){r[f][c]=u})});const o={},s=t.getProgramParameter(e,ca);for(let a=0;a<s;++a){const l=t.getActiveUniformBlockName(e,a),c={index:t.getUniformBlockIndex(e,l),usedByVertexShader:t.getActiveUniformBlockParameter(e,a,ua),usedByFragmentShader:t.getActiveUniformBlockParameter(e,a,fa),size:t.getActiveUniformBlockParameter(e,a,ha),uniformIndices:t.getActiveUniformBlockParameter(e,a,da)};c.used=c.usedByVertexShader||c.usedByFragmentShader,o[l]=c}return{blockSpecs:o,uniformData:r}}function Pr(t,e){for(const n in e){const r=t[n];typeof r=="function"?r(e[n]):Pr(t[n],e[n])}}function it(t,...e){const n=t.uniformSetters||t,r=e.length;for(let i=0;i<r;++i){const o=e[i];if(Array.isArray(o)){const s=o.length;for(let a=0;a<s;++a)it(n,o[a])}else for(const s in o){const a=n[s];a&&a(o[s])}}}function yl(t,e){const n={},r=t.getProgramParameter(e,aa);for(let i=0;i<r;++i){const o=t.getActiveAttrib(e,i);if(Dr(o))continue;const s=t.getAttribLocation(e,o.name),a=M[o.type],l=a.setter(t,s,a);l.location=s,n[o.name]=l}return n}function El(t,e){for(const n in e){const r=t[n];r&&r(e[n])}}function ot(t,e,n){n.vertexArrayObject?t.bindVertexArray(n.vertexArrayObject):(El(e.attribSetters||e,n.attribs),n.indices&&t.bindBuffer(ta,n.indices))}function Rn(t,e){const n=xl(t,e),r=yl(t,e),i={program:e,uniformSetters:n,attribSetters:r};return Be(t)&&(i.uniformBlockSpec=bl(t,e),i.transformFeedbackInfo=vl(t,e)),i}const gl=/\s|{|}|;/;function oe(t,e,n,r,i){const o=sn(n,r,i),s=[];if(e=e.map(function(c){if(!gl.test(c)){const u=or(c);if(u)c=u.text;else{const f=`no element with id: ${c}`;o.errorCallback(f),s.push(f)}}return c}),s.length)return nl(o,"");const a=o.callback;a&&(o.callback=(c,u)=>{a(c,c?void 0:Rn(t,u))});const l=hl(t,e,o);return l?Rn(t,l):null}const Al=4,Fn=5123;function Bt(t,e,n,r,i,o){n=n===void 0?Al:n;const s=e.indices,a=e.elementType,l=r===void 0?e.numElements:r;i=i===void 0?0:i,a||s?o!==void 0?t.drawElementsInstanced(n,l,a===void 0?Fn:e.elementType,i,o):t.drawElements(n,l,a===void 0?Fn:e.elementType,i):o!==void 0?t.drawArraysInstanced(n,i,l,o):t.drawArrays(n,i,l)}const Ir=36160,Ke=36161,_l=3553,wl=5121,Tl=6402,Sl=6408,Cl=33190,Rl=36012,Fl=35056,Dl=36013,Pl=32854,Il=32855,Ll=36194,Lr=33189,Br=6401,Mr=36168,an=34041,Mt=36064,vt=36096,Nr=36128,ln=33306,Nt=33071,Ut=9729,Bl=[{format:Sl,type:wl,min:Ut,wrap:Nt},{format:an}],ne={};ne[an]=ln;ne[Br]=Nr;ne[Mr]=Nr;ne[Tl]=vt;ne[Lr]=vt;ne[Cl]=vt;ne[Rl]=vt;ne[Fl]=ln;ne[Dl]=ln;function Ml(t,e){return ne[t]||ne[e]}const pe={};pe[Pl]=!0;pe[Il]=!0;pe[Ll]=!0;pe[an]=!0;pe[Lr]=!0;pe[Br]=!0;pe[Mr]=!0;function Nl(t){return pe[t]}const Ul=32;function Ol(t){return t>=Mt&&t<Mt+Ul}function J(t,e,n,r){const i=Ir,o=t.createFramebuffer();t.bindFramebuffer(i,o),n=n||t.drawingBufferWidth,r=r||t.drawingBufferHeight,e=e||Bl;const s=[],a={framebuffer:o,attachments:[],width:n,height:r};return e.forEach(function(l,c){let u=l.attachment;const f=l.samples,h=l.format;let p=l.attachmentPoint||Ml(h,l.internalFormat);if(p||(p=Mt+c),Ol(p)&&s.push(p),!u)if(f!==void 0||Nl(h))u=t.createRenderbuffer(),t.bindRenderbuffer(Ke,u),f>1?t.renderbufferStorageMultisample(Ke,f,h,n,r):t.renderbufferStorage(Ke,h,n,r);else{const m=Object.assign({},l);m.width=n,m.height=r,m.auto===void 0&&(m.auto=!1,m.min=m.min||m.minMag||Ut,m.mag=m.mag||m.minMag||Ut,m.wrapS=m.wrapS||m.wrap||Nt,m.wrapT=m.wrapT||m.wrap||Nt),u=ea(t,m)}if(Ki(t,u))t.framebufferRenderbuffer(i,p,Ke,u);else if(jt(t,u))l.layer!==void 0?t.framebufferTextureLayer(i,p,u,l.level||0,l.layer):t.framebufferTexture2D(i,p,l.target||_l,u,l.level||0);else throw new Error("unknown attachment type");a.attachments.push(u)}),t.drawBuffers&&t.drawBuffers(s),a}function Ot(t,e,n){n=n||Ir,e?(t.bindFramebuffer(n,e.framebuffer),t.viewport(0,0,e.width,e.height)):(t.bindFramebuffer(n,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight))}function Dn(t,e,n){const r=t.createVertexArray();return t.bindVertexArray(r),e.length||(e=[e]),e.forEach(function(i){ot(t,i,n)}),t.bindVertexArray(null),{numElements:n.numElements,elementType:n.elementType,vertexArrayObject:r}}const zl=/^(.*?)_/;function $l(t,e){Je(t,0);const n=t.getExtension(e);if(n){const r={},i=zl.exec(e)[1],o="_"+i;for(const s in n){const a=n[s],l=typeof a=="function",c=l?i:o;let u=s;s.endsWith(c)&&(u=s.substring(0,s.length-c.length)),t[u]!==void 0?!l&&t[u]!==a&&Wi(u,t[u],a,s):l?t[u]=function(f){return function(){return f.apply(n,arguments)}}(a):(t[u]=a,r[u]=a)}r.constructor={name:n.constructor.name},Je(r,0)}return n}const Pn=["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_color_buffer_float","EXT_color_buffer_half_float","EXT_disjoint_timer_query","EXT_disjoint_timer_query_webgl2","EXT_frag_depth","EXT_sRGB","EXT_shader_texture_lod","EXT_texture_filter_anisotropic","OES_element_index_uint","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_color_buffer_float","WEBGL_compressed_texture_atc","WEBGL_compressed_texture_etc1","WEBGL_compressed_texture_pvrtc","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_depth_texture","WEBGL_draw_buffers"];function Gl(t){for(let e=0;e<Pn.length;++e)$l(t,Pn[e])}function kl(t,e){e=e||1,e=Math.max(0,e);const n=t.clientWidth*e|0,r=t.clientHeight*e|0;return t.width!==n||t.height!==r?(t.width=n,t.height=r,!0):!1}Number.prototype.clamp=function(t,e){return Math.min(Math.max(this,t),e)};Number.prototype.mix=function(t,e){return this*(1-e)+t*e};class Vl{fetchUpdates(){const e=this.events;return this.events=[],e}getState(){return this.state}storeEvent(e){switch(e.frame=this.frame,e.type){case"blur":case"focusout":this.state={};break;case"keyup":delete this.state[e.key];break;case"keydown":this.state[e.key]||(this.state[e.key]={frame:this.frame});break;case"pointerup":case"pointermove":case"pointerdown":this.state.mouse={pos:e.pos,buttons:e.buttons};break;case"wheel":this.state.wheel||(this.state.wheel={y:0}),this.state.wheel.y+=e.deltaYl;break}}constructor(e){this.state={},this.frame=0,this.events=[],this.sizes={width:1,height:1},this.listeners=[],window.addEventListener("blur",i=>{this.storeEvent({type:i.type})}),window.addEventListener("focusout",i=>{this.storeEvent({type:i.type})}),window.addEventListener("keydown",i=>{const o=i.key.toLowerCase();o!=="f12"&&(i.preventDefault(),this.storeEvent({key:o,type:i.type}))}),window.addEventListener("keyup",i=>{const o=i.key.toLowerCase();i.preventDefault(),this.storeEvent({key:o,type:i.type})});const n=i=>{const{sizes:o}=this;if(i.target.className!=="webgl")return;const s=[(i.clientX-o.horizontalOffset)/o.width*2-1,-((i.clientY-o.verticalOffset)/o.height)*2+1];this.storeEvent({type:i.type,pos:s,buttons:i.buttons})},r=i=>{this.storeEvent({type:i.type,deltaY:i.deltaY})};window.addEventListener("wheel",r),window.addEventListener("pointerdown",n),window.addEventListener("pointerup",n),window.addEventListener("pointermove",n),window.addEventListener("contextmenu",i=>(i.preventDefault(),!1),!1),e.listeners.push(this),e.update()}updateTime({frame:e}){this.frame=e}updateSize(e){this.sizes=e}}function Hl(){Array.prototype.peek=function(){return this.length?this[this.length-1]:null},Array.prototype.equals=function(t){if(!Array.isArray(t)||t.length!==this.length)return!1;for(var e=0;e<this.length;e++)if(this[e]!==t[e])return!1;return!0}}Hl();class Xl{constructor(){this.states=[]}stateParams(){return{}}cleanup(){for(;this.states.length;)this.cleanupState(this.states.pop())}currentState(){return this.states.peek()}addState(e){e.init(this),this.states.push(e)}cleanupState(e){e&&e.cleanup(this)}replaceState(e){this.cleanupState(this.states.pop()),this.addState(e)}pushState(e){var n;(n=this.currentState())==null||n.pause(),this.addState(e)}popState(){var e;this.cleanupState(this.states.pop()),(e=this.currentState())==null||e.resume()}}class Yl{constructor(){}init(e){}cleanup(){}pause(){}resume(){}}class qe extends Array{constructor(e,n){super(),this.push(e,n)}distanceTo(e){const n=this[1].clone().sub(this[0]);n.len();const i=(e.clone().sub(this[0]).dot(n)/n.lenSq()).clamp(0,1);return this[0].clone().add(n.mul(i)).sub(e).len()}}const T=class T extends Array{constructor(e,n=null,r=null,i=null){if(super(),Array.isArray(e))for(let o=0;o<e.length;o++)this.push(e[o]);else{if(typeof e!="number"||n===null)throw new Error("Invalid construction");this.push(e,n),r!==null&&this.push(r),i!==null&&this.push(i)}}copy(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]=e[n];return this}add(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]+=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]+=e[n];else throw new Error("Invalid add");return this}sub(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]-=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]-=e[n];else throw new Error("Invalid sub");return this}mul(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]*=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]*=e[n];else throw new Error("Invalid mul");return this}dot(e){if(e.length===this.length){let n=0;for(let r=0;r<this.length;r++)n+=this[r]*e[r];return n}else throw new Error("Invalid dot")}mix(e,n){for(let r=0;r<this.length;r++)this[r]=this[r].mix(e[r],n[r]);return this}min(e){for(let n=0;n<this.length;n++)this[n]=Math.min(this[n],e[n]);return this}clamp(e,n){for(let r=0;r<this.length;r++)this[r]=this[r].clamp(e,n);return this}max(e){for(let n=0;n<this.length;n++)this[n]=Math.max(this[n],e[n]);return this}normalize(){var e=0;for(let n=0;n<this.length;n++)e+=this[n]*this[n];for(let n=0;n<this.length;n++)this[n]/=e;return this}cross(e){if(e.length===this.length){if(this.length===2)return this[0]*e[1]-this[1]*e[0];if(this.length===3)return new T([this[1]*e[2]-this[2]*e[1],this[2]*e[0]-this[0]*e[2],this[0]*e[1]-this[1]*e[0]]);throw new Error("Can't do 4D cross (yet?)")}else throw new Error("Dimensions need to match for cross.")}len(){return Math.sqrt(this.lenSq())}lenSq(){var e=0;for(let n=0;n<this.length;n++)e+=this[n]*this[n];return e}clone(){return new T(this)}};G(T,"X2",new T([1,0])),G(T,"X3",new T([1,0,0])),G(T,"X4",new T([1,0,0,0])),G(T,"Y2",new T([0,1])),G(T,"Y3",new T([0,1,0])),G(T,"Y4",new T([0,1,0,0])),G(T,"Z3",new T([0,0,1])),G(T,"Z4",new T([0,0,1,0])),G(T,"W4",new T([0,0,0,1])),G(T,"ONE2",new T(1,1)),G(T,"ONE3",new T(1,1,1)),G(T,"ONE4",new T(1,1,1,1)),G(T,"ZERO2",new T(0,0)),G(T,"ZERO3",new T(0,0,0)),G(T,"ZERO4",new T(0,0,0,0));let L=T;function Tt({min:t=0,max:e,steps:n=2}){return Math.floor(n*Math.random())/(n-1)*(e-t)+t}class Ur{constructor(){this.type=Object.getPrototypeOf(this).constructor}}class zt extends Ur{constructor(e,n){super(),this.playerIndex=e,this.direction=n}}class In extends Ur{constructor(e){super(),this.delta=e}}class Wl extends Yl{update(e,n,r){const i=(r.w!==void 0)-+(r.s!==void 0),o=(r.arrowup!==void 0)-+(r.arrowdown!==void 0);e.commands.push(new zt(0,i)),e.commands.push(new zt(1,o))}}class Or extends Xl{constructor(){super(),this.pushState(new Wl)}init(){}update(e,n){var r;(r=this.currentState())==null||r.update(e,this,n)}}new Or;class jl{constructor(e){this.commands=[],this.data=e,e.listeners.push(this),this.data.state.ball&&(this.data.state.ball.size=.1),this.data.state.balls=this.setupBalls(),this.data.state.ball={position:new L(0,0),color:new L(1,1,1),size:.05,velocity:new L(.8,.4)},this.data.state.paddles=[{position:new L(-.9,0),size:new L(.02,.2),color:new L(1,0,0),direction:0},{position:new L(.9,0),size:new L(.02,.2),color:new L(0,1,0),direction:0}],this.data.saveData(),this.activeColor=[1,1,1,1],this.currLine={start:[0,0],end:[0,0],color:this.activeColor}}setupBalls(){const e=[];for(var n=0;n<200;n++){const r=new L(Tt({max:.2,min:-.2,steps:40}),Tt({max:.9,min:-.9,steps:100}));e.push({origin:r,position:r.clone(),color:new L(0,0,0),size:Tt({max:.02,min:.01,steps:5})})}return e}configUpdated(){this.data.state.lines||(this.data.state.lines=[])}updateColor(e){this.activeColor=structuredClone(e),this.activeColor.push(1),this.currLine.color=this.activeColor}moveBall(e){const{ball:n}=this.data.state;n.position[0]+=e*n.velocity[0],n.position[1]+=e*n.velocity[1],Math.abs(n.position[0])+n.size>=1&&(n.velocity[0]*=-1),Math.abs(n.position[1])+n.size>=1&&(n.velocity[1]*=-1)}applyCommand(e){switch(e.type){case zt:this.data.state.paddles[e.playerIndex].direction=e.direction;break;case In:const{delta:n}=e,{ball:r,balls:i,paddles:o}=this.data.state;this.moveBall(n);for(let s=0;s<i.length;s++){const a=i[s];a.color.sub(L.ONE3.clone().mul(2*n)).max(L.ZERO3),a.position.clone().sub(r.position).len()<.2&&a.color.copy(r.color).mul(3);for(let c=0;c<o.length;c++){const u=o[c];u.position[1]+=n*u.direction*.01,u.position[1]=Math.min(Math.max(u.position[1],-1+u.size[1]),1-u.size[1]);const f=new L(u.size),h=new L(u.position).add(u.size),p=new L(u.position).sub(u.size),m=[new qe(h.clone(),h.clone().sub(f.clone().mul(L.X2).mul(2))),new qe(h.clone(),h.clone().sub(f.clone().mul(L.Y2).mul(2))),new qe(p.clone(),p.clone().add(f.clone().mul(L.X2).mul(2))),new qe(p.clone(),p.clone().add(f.clone().mul(L.Y2).mul(2)))];for(let b=0;b<m.length;b++)m[b].distanceTo(r.position)<r.size&&(r.color=u.color,Math.sign(r.velocity[0])!=Math.sign(.5-c)&&(r.velocity[0]*=-1))}this.data.saveData()}break}}update(){this.commands.push(new In(.04)),this.commands.forEach(e=>{this.applyCommand(e)}),this.commands.length=0}}var Kl=`#version 300 es\r
precision mediump float;

#define PI 3.141592654 \r
#define TAU (2.0*PI)\r
#define BAD_PROBE_INDEX_COLOR vec4(1.,1.,0.,1.);\r
#define DEBUG_COLOR vec4(0.,1.,1.,1.);\r
#define RESERVED_COLOR vec4(0.5,0.5,0.,1.);

struct CascadeConfig { \r
  int depth;\r
  float minDistance;\r
  float maxDistance;\r
};

struct DebugInfo {\r
  bool continousBilinearFix;\r
  bool cornerProbes;\r
  bool showSampleUv;\r
  bool showProbeUv;\r
  bool showDirection;\r
  bool noFix;\r
  bool quadSample;\r
  int finalDepth;\r
};

uniform vec2 resolution;\r
uniform vec2 renderResolution;\r
uniform int maxSteps;\r
uniform sampler2D tDistance;\r
uniform sampler2D tColor;\r
uniform int startDepth;\r
uniform CascadeConfig current;\r
uniform CascadeConfig deeper;\r
uniform DebugInfo debug;\r
uniform sampler2D tPrevCascade;

out vec4 outColor;

bool outOfBounds(vec2 uv) {\r
  return uv.x < 0. || uv.x > 1. || uv.y < 0. || uv.y > 1.;\r
}

vec4 sampleSky(vec2 dir) {\r
  return vec4(0., 0., 0., 1.);\r
}

vec4 castRay(vec2 start, vec2 end) {\r
vec2 initialStart = start;\r
  vec2 delta = end - start;\r
  float distanceLeft = length(delta);\r
  float minStep = 2. / float(textureSize(tColor, 0).x);\r
  vec2 dir = delta / distanceLeft;\r
  for (int i = 0; i < maxSteps; i++) {\r
    if (distanceLeft < 0.) {\r
        return vec4(0.);\r
    }

    if (outOfBounds(start)) {\r
      return sampleSky(dir);\r
    }\r
    \r
    float sdf = texture(tDistance, start).r ;\r
    vec4 color = texture(tColor, start);\r
    if (color.a > 0.9) {\r
      color *= pow(0.01, length(start - initialStart));\r
      return color;\r
    }

    sdf += minStep;\r
    start += sdf * dir;\r
    distanceLeft -= sdf;\r
  }\r
  return vec4(0.);\r
}

vec2 indicesToProbeUv(ivec4 probeIndex) {\r
    float probeCount = float(textureSize(tPrevCascade, 0).x >> (probeIndex.w + 1));\r
    vec2 zeroToOne = vec2(probeIndex.xy) / (probeCount - 1.);\r
    vec2 delta = 1. / renderResolution;\r
    return zeroToOne * (1. - delta) + 0.5 * delta; \r
}

int imod(int v, int m) {\r
    return int(mod(float(v),float(m)));\r
}

ivec2 imod(ivec2 v, int m) {\r
    return ivec2(mod(vec2(v),float(m)));\r
}

ivec3 imod(ivec3 v, int m) {\r
    return ivec3(mod(vec3(v),float(m)));\r
}

ivec4 imod(ivec4 v, int m) {\r
    return ivec4(mod(vec4(v),float(m)));\r
}

vec2 indicesToSampleUv(ivec4 index) {\r
    ivec2 texSize = textureSize(tPrevCascade, 0);\r
    vec2 pixelSizeInUv = 1. / vec2(texSize); 

    vec2 probeOffset = (vec2(index.xy) + 0.5) * pixelSizeInUv;

    int probePerDim = texSize.x >>  (index.w + 1);\r
    int dirDivison = texSize.x / probePerDim;\r
    ivec2 gridCoord = ivec2( imod(index.z,dirDivison),index.z / dirDivison);

    vec2 directionOffset = vec2(gridCoord) * pixelSizeInUv * float(probePerDim);

    return probeOffset + directionOffset;\r
}

vec4 indicesToProbeDir(ivec4 index) {\r
    float tauOverIndexRayCount = TAU / float(4 << (2 * index.w));\r
    float angle = tauOverIndexRayCount * (float(index.z) + 0.5);\r
    vec2 dir = vec2(cos(angle), -sin(angle));

    float probeCount = float(textureSize(tPrevCascade, 0).x >> (index.w + 1));\r
    vec2 zeroToOne = vec2(index.xy) / (probeCount - 1.);\r
    vec2 delta = 1. / renderResolution;\r
    vec2 probeUv = zeroToOne * (1. - delta) + 0.5 * delta; 

    return vec4(probeUv, dir);\r
}

ivec4 sampleUvToIndices(ivec2 coord) {\r
    int probePerDim = textureSize(tPrevCascade, 0).x >> (current.depth + 1);\r
    ivec2 gridCoord = coord / probePerDim;\r
    ivec2 probeCoord = imod(coord, probePerDim);

    int sqrtDirectionCount = textureSize(tPrevCascade, 0).x / probePerDim;

    int direction = gridCoord.x + sqrtDirectionCount * gridCoord.y;\r
    return ivec4(probeCoord, direction, current.depth);\r
}

vec2 lineSegmentUv(ivec4 probeIndex, float distance) {\r
  vec4 probeUvDir = indicesToProbeDir(probeIndex);\r
  return probeUvDir.xy + distance * probeUvDir.zw;\r
}

ivec4 topLeftIndex(ivec4 probeIndex) {\r
    float probeCount = float(textureSize(tPrevCascade, 0).x >> (probeIndex.w + 1));\r
    vec2 zeroToOne = vec2(probeIndex.xy) / (probeCount - 1.);\r
    int deeperProbeCount = int(0.5 * probeCount  - 1.);\r
    ivec2 topLeftProbe = ivec2(floor(float(deeperProbeCount) * zeroToOne));\r
    if (topLeftProbe.x == deeperProbeCount ) {\r
        topLeftProbe.x = deeperProbeCount - 1;\r
    }\r
    if (topLeftProbe.y == deeperProbeCount) {\r
        topLeftProbe.y = deeperProbeCount - 1;\r
    }\r
    return ivec4(\r
        topLeftProbe.x,\r
        topLeftProbe.y, \r
        4 * probeIndex.z,\r
        probeIndex.w + 1\r
    );\r
}

vec4 sampleCascade(ivec4 deeperIndex) {\r
    vec4 rad = vec4(0.);\r
    if (rad.a < 0.5) {\r
        for (int i = 0; i < 4; i++) {\r
            rad += texture(tPrevCascade, indicesToSampleUv(deeperIndex + ivec4(0,0,i,0)));\r
        }\r
        rad *= 0.25;\r
    } \r
    return rad;

}

vec4 bilinearRaycast(\r
    vec2 start,\r
    vec2 end,\r
    vec2 probeUv,\r
    vec2 deeperUv,\r
    ivec4 deeperIndex\r
) {\r
    vec4 rad = castRay(start, end + (deeperUv - probeUv));\r
    if (rad.a < 0.05) {\r
        rad = sampleCascade(deeperIndex);\r
        rad *= pow(0.01, current.maxDistance - current.minDistance);\r
    } \r
    return rad;\r
}

void main() {\r
    ivec4 index = sampleUvToIndices(ivec2(gl_FragCoord.xy));\r
    \r
    if (debug.noFix) {\r
        vec2 start = lineSegmentUv(index, current.minDistance);\r
        vec2 end = lineSegmentUv(index, current.maxDistance);\r
        outColor = castRay(start, end);\r
    \r
        if (outColor.w < 0.5) {\r
            ivec4 indexTL = topLeftIndex(index);\r
            ivec4 indexBR = indexTL + ivec4(1,1,0,0);

            vec2 probe = indicesToProbeUv(index);\r
            vec2 probeTL = indicesToProbeUv(indexTL);\r
            vec2 probeBR = indicesToProbeUv(indexBR);

            vec2 weights = (probe - probeTL) / (probeBR - probeTL);

            vec2 sample1 = mix(indicesToSampleUv(indexTL), indicesToSampleUv(indexBR), weights);\r
            vec2 sample2 = mix(indicesToSampleUv(indexTL + ivec4(0,0,1,0)), \r
                                indicesToSampleUv(indexBR + ivec4(0,0,1,0)), \r
                                weights);\r
            vec2 sample3 = mix(indicesToSampleUv(indexTL + ivec4(0,0,2,0)), \r
                                indicesToSampleUv(indexBR + ivec4(0,0,2,0)), \r
                                weights);\r
            vec2 sample4 = mix(indicesToSampleUv(indexTL + ivec4(0,0,3,0)), \r
                                indicesToSampleUv(indexBR + ivec4(0,0,3,0)), \r
                                weights);

            outColor = 0.25 * (\r
                texture(tPrevCascade, sample1) +\r
                texture(tPrevCascade, sample2) +\r
                texture(tPrevCascade, sample3) +\r
                texture(tPrevCascade, sample4) \r
            );\r
        }\r
    } else {\r
        vec4 probeUvDir = indicesToProbeDir(index);\r
        ivec4 indexTL = topLeftIndex(index);\r
        vec2 probeTL = indicesToProbeUv(indexTL);\r
        ivec4 indexTR = indexTL + ivec4(1, 0, 0, 0);\r
        vec2 probeTR = indicesToProbeUv(indexTR); \r
        ivec4 indexBL = indexTL + ivec4(0, 1, 0, 0);\r
        vec2 probeBL = indicesToProbeUv(indexBL);\r
        ivec4 indexBR = indexTL + ivec4(1, 1, 0, 0);\r
        vec2 probeBR = indicesToProbeUv(indexBR);\r
        \r
        vec2 start = probeUvDir.xy + current.minDistance * probeUvDir.zw;\r
        vec2 end = probeUvDir.xy + current.maxDistance * probeUvDir.zw;

        vec4 radTL = bilinearRaycast(start, end,probeUvDir.xy, probeTL, indexTL);\r
        vec4 radTR = bilinearRaycast(start, end,probeUvDir.xy, probeTR, indexTR);\r
        vec4 radBL = bilinearRaycast(start, end,probeUvDir.xy, probeBL, indexBL);\r
        vec4 radBR = bilinearRaycast(start, end,probeUvDir.xy, probeBR, indexBR);

        vec2 weights = (probeUvDir.xy - probeTL) / (probeBR - probeTL);

        vec4 top = mix(radTL, radTR, vec4(weights.x));\r
        vec4 bot = mix(radBL, radBR, vec4(weights.x));

        outColor =  mix(top, bot, vec4(weights.y));\r
    }\r

    outColor.w = 1.;\r
}`,ql=`#version 300 es\r
struct DebugInfo {\r
  bool continousBilinearFix;\r
  bool cornerProbes;\r
  bool showSampleUv;\r
  bool showProbeUv;\r
  bool showDirection;\r
  bool noFix;\r
  bool quadSample;\r
};

precision mediump float;\r
uniform sampler2D tPrevCascade;\r
uniform vec2 resolution;\r
uniform DebugInfo debug;

out vec4 outColor;

vec2 cascadeUvOffset(int cascadeIndex) {\r
  return vec2(0.5 * float(cascadeIndex / 2), 0.5 * mod(float(cascadeIndex), 2.));\r
}

vec2 sampleUvMapped(vec2 sampleUv) {\r
  vec2 fuv = fwidth(sampleUv);\r
  vec2 minUvRemap = 0.5  * fuv;\r
  vec2 maxUvRemap = 1. - minUvRemap;\r
  vec2 zeroToOne = (sampleUv - minUvRemap) / (maxUvRemap - minUvRemap);\r
  vec2 delta = 1. / vec2(textureSize(tPrevCascade, 0));\r
  vec2 newMax = vec2(0.5 - delta) ;\r
  vec2 newMin = delta;\r
  return zeroToOne * (newMax - newMin) + newMin;\r
}

vec4 radiance(vec2 uv) {\r
  vec4 rad = vec4(0.);\r
  vec2 remapped = sampleUvMapped(uv);\r
  for (int i = 0; i < 4; i++) {\r
    vec2 offsetUv = cascadeUvOffset(i) + remapped;\r
    rad += texture(tPrevCascade, offsetUv);\r
  }\r
  return rad / 4.;\r
}

void main() {\r
  vec2 uv = gl_FragCoord.xy / resolution;\r
  outColor = radiance(uv);\r
  outColor.w = 1.;\r
}`,st=new ai;st.showPanel(0);document.body.appendChild(st.dom);const d=document.getElementById("webgl").getContext("webgl2");Gl(d);function Q(t,e,n,r,i=null,o=null){t.useProgram(e.program),ot(t,e,n),it(e,r),Ot(t,i),o&&t.viewport(o[0],o[1],o[2],o[3]),Bt(t,n)}const Ql={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}},Z=Rt(d,Ql),B=new ri;B.init();const cn=new Vr(1),Zl=new Vl(cn),Jl=new Or,Fe=new jl(B),ae=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ec=`#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`,tc=`#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float time;
uniform vec2 lineStart;
uniform vec4 color;
uniform vec2 lineEnd;
uniform float pixelLineSize;
uniform sampler2D tPrev;

out vec4 outColor;

float lineDist() {
  vec2 uv = gl_FragCoord.xy / resolution;
  if (lineStart == lineEnd) {
    return length(lineStart - uv);
  } else {
   vec2 delta = (lineEnd - lineStart);
    vec2 dir = uv - lineStart;
    float t = dot(dir, delta) / dot(delta,delta);
    if (t < 0. || t > 1.) {
      return min(length(uv - lineStart), length(uv - lineEnd));
    } else {
     return length(lineStart + t * delta - uv);
    }
   return 0.;
  }
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float dist = step(lineDist(), pixelLineSize / resolution.x);
  outColor = mix(texture(tPrev, uv).xyzw, color.rgba,  dist);
}
`,nc=`#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform float jumpSize; 
uniform sampler2D tPrev;
uniform sampler2D tLine;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  
  vec3 prevClosestPos = texture(tPrev, uv).xyz;

  for (int i = -1; i <= 1; i++) {
    for (int j = -1; j <= 1; j++) {
      vec2 delta = vec2(float(i), float(j)) * jumpSize / resolution;
      vec2 sampleUv = uv + delta;
      vec3 closestPos = texture(tPrev, sampleUv).xyz;
      float lineVal = texture(tLine, sampleUv).a;

      if (lineVal > 0.1) {
        closestPos = vec3(sampleUv, 1.);
      }

      if (closestPos.z > 0.) {
        if (prevClosestPos.z > 0.) {
          if (length(closestPos.xy - uv) < length(prevClosestPos.xy - uv)) {
            prevClosestPos = closestPos;
          }
        } else {
          prevClosestPos = closestPos;
        }
      }
    }
  }
  outColor = vec4( prevClosestPos , 0.);
}
`,zr=`#version 300 es
precision mediump float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float dist = length(texture(tPrev, uv).xy - uv);
  outColor = vec4(float(gl_FragCoord.x == resolution.x - 0.5), float(gl_FragCoord.y == resolution.y - 0.5), 0. ,1.);
  outColor = vec4(vec3(dist), 1.0);
}

`,rc=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform vec4 renderTarget;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 targetUv = (renderTarget.zw - renderTarget.xy) * uv + renderTarget.xy;
  outColor = texture(tPrev, targetUv).rgba;
}
`,ic=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = pow(texture(tPrev, uv), vec4(1./2.2));
}
`;oe(d,[ae,tc]);const St=oe(d,[ae,rc]),oc=oe(d,[ae,zr]),sc=oe(d,[ae,zr]),Qe=oe(d,[ae,ec]),ac=oe(d,[ae,nc]),Ln=oe(d,[ae,ic]),lc=oe(d,[ae,Kl]),cc=oe(d,[ae,ql]);function Bn(t,e,n,r){const s=oe(d,[`#version 300 es
    in vec2 position;
    in vec4 color;
    in mat4 matrix;
    
    out vec4 v_color;
      void main() {
        // Multiply the position by the matrix.
        gl_Position = matrix * vec4(position, 0.0, 1.0);
        v_color = color;
      }
    `,`#version 300 es

    precision mediump float;
    
    in vec4 v_color;
    
    out vec4 outColor;
    void main() {
      outColor = v_color;
    }`]),a=Ui,l=[],c=[],{ball:u,balls:f}=r.data.state;for(let P=0;P<f.length;P++){const w=f[P],U=a.scaling([w.size,w.size,w.size]),O=a.translation([w.position[0]/w.size,w.position[1]/w.size,0]);a.multiply(U,O).forEach((z,Y)=>{l.push(z)}),c.push(w.color[0],w.color[1],w.color[2],1)}const h=a.scaling([u.size,u.size,u.size]),p=a.translation([u.position[0]/u.size,u.position[1]/u.size,0]);a.multiply(h,p).forEach((P,w)=>{l.push(P)}),c.push(u.color[0],u.color[1],u.color[2],1);const b=[],E=32;for(var x=0;x<=E;x++)b.push(Math.sin(x*Math.PI*2/E),Math.cos(x*Math.PI*2/E));const y=Rt(d,{position:{numComponents:2,data:b},color:{numComponents:4,data:c,divisor:1},matrix:{numComponents:16,data:l,divisor:1}}),_=Dn(d,s,y);d.useProgram(s.program),ot(d,s,_),it(s,{}),Ot(d,e),Bt(d,_,d.TRIANGLE_FAN,_.numElements,0,f.length+1);const S=[],R=[],{paddles:C}=r.data.state;for(let P=0;P<C.length;P++){const w=C[P],U=a.scaling([w.size[0],w.size[1],1]),O=a.translation([w.position[0]/w.size[0],w.position[1]/w.size[1],0]);a.multiply(U,O).forEach((z,Y)=>{S.push(z)}),R.push(w.color[0],w.color[1],w.color[2],1)}const V=Rt(d,{position:{numComponents:2,data:[1,1,1,-1,-1,-1,-1,1]},color:{numComponents:4,data:R,divisor:1},matrix:{numComponents:16,data:S,divisor:1}}),H=Dn(d,s,V);d.useProgram(s.program),ot(d,s,H),it(s,{}),Ot(d,e),Bt(d,_,d.TRIANGLE_FAN,_.numElements,0,C.length)}cn.listeners.push({updateSize:({width:t,height:e})=>{d.canvas.width=t,d.canvas.height=e}});let un=!1;B.addButton({name:"Save Image",fn:()=>{un=!0}});const uc=()=>{var e=document.getElementById("webgl").toDataURL(),n=document.createElement("a");n.download="canvas_image.png",n.href=e,n.click(),un=!1},N=8*128,ee=N,g={lightEmitters:J(d,[{internalFormat:d.RGBA8,format:d.RGBA,mag:d.NEAREST,min:d.NEAREST,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),lightEmittersWithCurrent:J(d,[{internalFormat:d.RGBA8,format:d.RGBA,mag:d.NEAREST,min:d.NEAREST,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),distance:J(d,[{internalFormat:d.RGBA8,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),fill:J(d,[{internalFormat:d.RGBA8,format:d.RGBA,mag:d.NEAREST,min:d.NEAREST,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),spare:J(d,[{internalFormat:d.RGBA8,format:d.RGBA,mag:d.NEAREST,min:d.NEAREST,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),cascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],2*N,ee),spareCascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],2*N,ee),linearCascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],2*N,ee),quadCascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),spareQuadCascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),finalCascadeRT:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee),finalCascadeRTSpare:J(d,[{internalFormat:d.RGBA32F,format:d.RGBA,mag:d.LINEAR,min:d.LINEAR,wrap:d.CLAMP_TO_EDGE,auto:!0}],N,ee)};B.addColor({displayName:"Color",defaultValue:[1,1,1],callback:t=>{Fe.commands.push(new UpdateColorCommand(t))}});function $r(t){st.begin(),cn.update(),Jl.update(Fe,Zl.getState()),Fe.update(),kl(d.canvas),d.viewport(0,0,d.canvas.width,d.canvas.height),Q(d,Qe,Z,{color:[0,0,0,0]},g.lightEmittersWithCurrent),Bn(t,g.lightEmittersWithCurrent,.05,Fe),Q(d,Qe,Z,{color:[0,0,0,0]},g.spare),[g.fill,g.spare]=[g.spare,g.fill];for(var e=Math.ceil(Math.log2(N));e>=0;e--)Q(d,ac,Z,{resolution:[g.fill.width,g.fill.height],jumpSize:1<<e,tPrev:g.fill.attachments[0],tLine:g.lightEmittersWithCurrent.attachments[0]},g.spare),[g.fill,g.spare]=[g.spare,g.fill];Q(d,oc,Z,{resolution:[g.fill.width,g.fill.height],tPrev:g.fill.attachments[0]},g.distance);const n=B.addNumber({displayName:"Start Depth",defaultValue:Math.log2(N)-3,min:1,max:Math.log2(N)-3,step:1}).value,r=B.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value;let o=B.addNumber({displayName:"Initial Depth",defaultValue:Math.log2(N)-3,min:1,max:Math.log2(N)-3,step:1}).value;for(Q(d,Qe,Z,{color:[0,0,0,0]},g.cascadeRT),Q(d,Qe,Z,{color:[0,0,0,0]},g.quadCascadeRT),g.cascadeRT.width;o>=r;){const s=10*Math.SQRT2/g.cascadeRT.width,l=Math.log2(Math.SQRT2/s),c=o===0?0:s*Math.pow(2,l*(o-1)/n),u=o==n?Math.SQRT2:s*Math.pow(2,l*o/n),f=s*Math.pow(2,l*(o+1)/n);Q(d,lc,Z,{renderResolution:[d.canvas.width,d.canvas.height],resolution:[g.quadCascadeRT.width,g.quadCascadeRT.height],maxSteps:B.addNumber({displayName:"Max Steps",defaultValue:32,min:1,max:128,step:1}).value,tDistance:g.distance.attachments[0],tColor:g.lightEmittersWithCurrent.attachments[0],startDepth:n,current:{depth:o,minDistance:c,maxDistance:u},deeper:{depth:o,minDistance:u,maxDistance:f},debug:{continousBilinearFix:B.addNumber({displayName:"Continuous Bilinear Fix",defaultValue:!0}).value,cornerProbes:B.addNumber({displayName:"Corner Probes",defaultValue:!0}).value,showSampleUv:B.addNumber({displayName:"Show Sample Uv",defaultValue:!1}).value,showProbeUv:B.addNumber({displayName:"Show Probe Uv",defaultValue:!1}).value,showDirection:B.addNumber({displayName:"Show Direction Uv",defaultValue:!1}).value,noFix:B.addNumber({displayName:"No Fix",defaultValue:!1}).value,quadSample:B.addNumber({displayName:"Quad Sample",defaultValue:!1}).value,finalDepth:B.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value},tPrevCascade:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeRT),[g.spareQuadCascadeRT,g.quadCascadeRT]=[g.quadCascadeRT,g.spareQuadCascadeRT],o--}switch(Q(d,St,Z,{resolution:[g.linearCascadeRT.width,g.linearCascadeRT.height],renderTarget:[0,0,1,1],tPrev:g.cascadeRT.attachments[0]},g.linearCascadeRT),Q(d,sc,Z,{resolution:[d.canvas.width,d.canvas.height],tPrev:g.fill.attachments[0]}),Q(d,St,Z,{resolution:[d.canvas.width,d.canvas.height],tPrev:g.cascadeRT.attachments[0]}),B.addEnum({displayName:"Render Mode",defaultValue:"Render Cascade",options:["Render Cascade","Cascade Levels"]}).value){case"Cascade Levels":Q(d,St,Z,{renderTarget:[B.addNumber({displayName:"minx",defaultValue:0,min:0,max:1,step:.01}).value,B.addNumber({displayName:"miny",defaultValue:0,min:0,max:1,step:.01}).value,B.addNumber({displayName:"maxx",defaultValue:1,min:0,max:1,step:.01}).value,B.addNumber({displayName:"maxy",defaultValue:1,min:0,max:1,step:.01}).value],resolution:[g.quadCascadeRT.width,g.quadCascadeRT.height],tPrev:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeRT),Q(d,Ln,Z,{resolution:[d.canvas.width,d.canvas.height],tPrev:g.spareQuadCascadeRT.attachments[0]});case"Render Cascade":default:Q(d,cc,Z,{resolution:[g.spareQuadCascadeRT.width,g.spareQuadCascadeRT.height],tPrevCascade:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeRT);break}Bn(t,g.spareQuadCascadeRT,.05,Fe),Q(d,Ln,Z,{resolution:[d.canvas.width,d.canvas.height],tPrev:g.spareQuadCascadeRT.attachments[0]}),un&&uc(),st.end(),requestAnimationFrame($r)}requestAnimationFrame($r);
//# sourceMappingURL=index-3888b92e.js.map
