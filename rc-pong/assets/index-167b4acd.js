var qr=Object.defineProperty;var Qr=(t,e,n)=>e in t?qr(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var M=(t,e,n)=>(Qr(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();class Zr{constructor(e){this.sizes={width:window.innerWidth,height:window.innerHeight,buffer:20,aspect:e},this.listeners=[],document.querySelector("div.container");const n=document.querySelector("div.relative");this.update=()=>{const{buffer:r}=this.sizes,i=window.innerHeight-2*r,o=window.innerWidth-2*r;i*this.sizes.aspect>o?(this.sizes.width=o,this.sizes.height=o/this.sizes.aspect,this.sizes.verticalOffset=r+(i-this.sizes.height)/2,this.sizes.horizontalOffset=r):(this.sizes.width=i*this.sizes.aspect,this.sizes.height=i,this.sizes.verticalOffset=r,this.sizes.horizontalOffset=r+(o-this.sizes.width)/2),n.style.top=this.sizes.verticalOffset.toString()+"px",n.style.left=this.sizes.horizontalOffset.toString()+"px",this.listeners.forEach(s=>{s.updateSize(this.sizes)})},window.addEventListener("resize",this.update),window.addEventListener("orientationchange",this.update),window.addEventListener("dblclick",r=>{})}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class ne{constructor(e,n,r,i,o="div"){this.parent=e,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("controller"),this.domElement.classList.add(i),this.$name=document.createElement("div"),this.$name.classList.add("name"),ne.nextNameID=ne.nextNameID||0,this.$name.id=`lil-gui-name-${++ne.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const n=this.parent.add(this.object,this.property,e);return n.name(this._name),this.destroy(),n}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Jr extends ne{constructor(e,n,r){super(e,n,r,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Ut(t){let e,n;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?n=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),n?"#"+n:!1}const ei={isPrimitive:!0,match:t=>typeof t=="string",fromHexString:Ut,toHexString:Ut},Ie={isPrimitive:!0,match:t=>typeof t=="number",fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},ti={isPrimitive:!1,match:t=>Array.isArray(t),fromHexString(t,e,n=1){const r=Ie.fromHexString(t);e[0]=(r>>16&255)/255*n,e[1]=(r>>8&255)/255*n,e[2]=(r&255)/255*n},toHexString([t,e,n],r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return Ie.toHexString(i)}},ni={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,e,n=1){const r=Ie.fromHexString(t);e.r=(r>>16&255)/255*n,e.g=(r>>8&255)/255*n,e.b=(r&255)/255*n},toHexString({r:t,g:e,b:n},r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return Ie.toHexString(i)}},ri=[ei,Ie,ti,ni];function ii(t){return ri.find(e=>e.match(t))}class oi extends ne{constructor(e,n,r,i){super(e,n,r,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ii(this.initialValue),this._rgbScale=i,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=Ut(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const n=this._format.fromHexString(e);this.setValue(n)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Tt extends ne{constructor(e,n,r){super(e,n,r,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",i=>{i.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class si extends ne{constructor(e,n,r,i,o,s){super(e,n,r,"number"),this._initInput(),this.min(i),this.max(o);const a=s!==void 0;this.step(a?s:this._getImplicitStep(),a),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,n=!0){return this._step=e,this._stepExplicit=n,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let n=(e-this._min)/(this._max-this._min);n=Math.max(0,Math.min(n,1)),this.$fill.style.width=n*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const n=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},r=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},i=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x)*-1))},o=x=>{this._inputFocused&&(x.preventDefault(),r(this._step*this._normalizeMouseWheel(x)))};let s=!1,a,l,c,u,f;const h=5,p=x=>{a=x.clientX,l=c=x.clientY,s=!0,u=this.getValue(),f=0,window.addEventListener("mousemove",d),window.addEventListener("mouseup",b)},d=x=>{if(s){const y=x.clientX-a,_=x.clientY-l;Math.abs(_)>h?(x.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>h&&b()}if(!s){const y=x.clientY-c;f-=y*this._step*this._arrowKeyMultiplier(x),u+f>this._max?f=this._max-u:u+f<this._min&&(f=this._min-u),this._snapClampSetValue(u+f)}c=x.clientY},b=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",b)},E=()=>{this._inputFocused=!0},v=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",n),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",E),this.$input.addEventListener("blur",v)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(v,x,y,_,T)=>(v-x)/(y-x)*(T-_)+_,n=v=>{const x=this.$slider.getBoundingClientRect();let y=e(v,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},r=v=>{this._setDraggingStyle(!0),n(v.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",o)},i=v=>{n(v.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",o)};let s=!1,a,l;const c=v=>{v.preventDefault(),this._setDraggingStyle(!0),n(v.touches[0].clientX),s=!1},u=v=>{v.touches.length>1||(this._hasScrollBar?(a=v.touches[0].clientX,l=v.touches[0].clientY,s=!0):c(v),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=v=>{if(s){const x=v.touches[0].clientX-a,y=v.touches[0].clientY-l;Math.abs(x)>Math.abs(y)?c(v):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else v.preventDefault(),n(v.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},p=this._callOnFinishChange.bind(this),d=400;let b;const E=v=>{if(Math.abs(v.deltaX)<Math.abs(v.deltaY)&&this._hasScrollBar)return;v.preventDefault();const y=this._normalizeMouseWheel(v)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(b),b=setTimeout(p,d)};this.$slider.addEventListener("mousedown",r),this.$slider.addEventListener("touchstart",u,{passive:!1}),this.$slider.addEventListener("wheel",E,{passive:!1})}_setDraggingStyle(e,n="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${n}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:n,deltaY:r}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(n=0,r=-e.wheelDelta/120,r*=this._stepExplicit?1:10),n+-r}_arrowKeyMultiplier(e){let n=this._stepExplicit?1:10;return e.shiftKey?n*=10:e.altKey&&(n/=10),n}_snap(e){const n=Math.round(e/this._step)*this._step;return parseFloat(n.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class ai extends ne{constructor(e,n,r,i){super(e,n,r,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(i)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(n=>{const r=document.createElement("option");r.textContent=n,this.$select.appendChild(r)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),n=this._values.indexOf(e);return this.$select.selectedIndex=n,this.$display.textContent=n===-1?e:this._names[n],this}}class li extends ne{constructor(e,n,r){super(e,n,r,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",i=>{i.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const ci=`.lil-gui {
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
}`;function ui(t){const e=document.createElement("style");e.innerHTML=t;const n=document.querySelector("head link[rel=stylesheet], head style");n?document.head.insertBefore(e,n):document.head.appendChild(e)}let wn=!1;class Wt{constructor({parent:e,autoPlace:n=e===void 0,container:r,width:i,title:o="Controls",closeFolders:s=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!wn&&a&&(ui(ci),wn=!0),r?r.appendChild(this.domElement):n&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),i&&this.domElement.style.setProperty("--width",i+"px"),this._closeFolders=s}add(e,n,r,i,o){if(Object(r)===r)return new ai(this,e,n,r);const s=e[n];switch(typeof s){case"number":return new si(this,e,n,r,i,o);case"boolean":return new Jr(this,e,n);case"string":return new li(this,e,n);case"function":return new Tt(this,e,n)}console.error(`gui.add failed
	property:`,n,`
	object:`,e,`
	value:`,s)}addColor(e,n,r=1){return new oi(this,e,n,r)}addFolder(e){const n=new Wt({parent:this,title:e});return this.root._closeFolders&&n.close(),n}load(e,n=!0){return e.controllers&&this.controllers.forEach(r=>{r instanceof Tt||r._name in e.controllers&&r.load(e.controllers[r._name])}),n&&e.folders&&this.folders.forEach(r=>{r._title in e.folders&&r.load(e.folders[r._title])}),this}save(e=!0){const n={controllers:{},folders:{}};return this.controllers.forEach(r=>{if(!(r instanceof Tt)){if(r._name in n.controllers)throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);n.controllers[r._name]=r.save()}}),e&&this.folders.forEach(r=>{if(r._title in n.folders)throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);n.folders[r._title]=r.save()}),n}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const n=this.$children.clientHeight;this.$children.style.height=n+"px",this.domElement.classList.add("transition");const r=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",r))};this.$children.addEventListener("transitionend",r);const i=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=i+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(r=>r.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(n=>{e=e.concat(n.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(n=>{e=e.concat(n.foldersRecursive())}),e}}const fi=Wt,St="state",Ct="config";class hi{constructor(){this.added=[],this.listeners=[],this.serializedConfig={},this.config={},this.state={}}init(){const e=new fi;this.variables=e.addFolder("Variables"),this.buttons=e.addFolder("Buttons"),this.readData(),this.addButton({name:"Clear Data",fn:()=>this.clearData()}),e.hide()}addEnum({displayName:e,defaultValue:n,options:r,callback:i=null}){var o;if(!this.config[e]){const s=((o=this.serializedConfig[e])==null?void 0:o.value)??n;this.config[e]={name:e,defaultValue:n,value:s,minOrOptions:r},this.addConfigData(e,i),this.added.push(e)}return this.config[e]}addNumber({displayName:e,defaultValue:n,min:r=null,max:i=null,step:o=null,callback:s=null}){var a;if(!this.config[e]){const l=((a=this.serializedConfig[e])==null?void 0:a.value)??n;this.config[e]={name:e,defaultValue:n,value:l,minOrOptions:r,max:i,step:o},r!==null&&(this.config[e].value=Math.max(r,this.config[e].value)),i!==null&&(this.config[e].value=Math.min(i,this.config[e].value)),this.addConfigData(e,s),this.added.push(e)}return this.config[e]}addColor({displayName:e,defaultValue:n,callback:r=null}){var i;if(!this.config[e]){const o=((i=this.serializedConfig[e])==null?void 0:i.value)??n;this.config[e]={name:e,defaultValue:n,value:o},this.variables.addColor(this.config[e],"value").name(e).onChange(s=>{this.saveData(),this.notify(),r&&r(s)}).listen(),this.added.push(e)}return this.config[e]}addButton({fn:e,name:n}){const r={};r[n]=e,this.buttons.add(r,n)}addConfigData(e,n){const{minOrOptions:r=null,max:i=null,step:o=null,name:s}=this.config[e];this.variables.add(this.config[e],"value",r,i,o).name(s).onChange(a=>{this.saveData(),this.notify(),n&&n(a)}).listen()}notify(){this.listeners.forEach(e=>e.configUpdated(this.config))}readData(){const e=localStorage.getItem(St);e&&e!="undefined"?this.state=JSON.parse(e):this.state={};const n=localStorage.getItem(Ct);n&&n!="undefined"?this.serializedConfig=JSON.parse(n):this.serializedConfig={}}saveData(){}clearData(){localStorage.getItem(St)&&localStorage.removeItem(St),this.state={},localStorage.getItem(Ct)&&localStorage.removeItem(Ct);for(const[e,n]of Object.entries(this.config))n.value=n.defaultValue;this.notify()}addListener(e){this.listeners.push(e)}}var di=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function mi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var kn={exports:{}};(function(t,e){(function(n,r){t.exports=r()})(di,function(){var n=function(){var r=0,i=document.createElement("div");function o(p){return i.appendChild(p.dom),p}function s(p){for(var d=0;d<i.children.length;d++)i.children[d].style.display=d===p?"block":"none";r=p}i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(p){p.preventDefault(),s(++r%i.children.length)},!1);var a=(performance||Date).now(),l=a,c=0,u=o(new n.Panel("FPS","#0ff","#002")),f=o(new n.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var h=o(new n.Panel("MB","#f08","#201"));return s(0),{REVISION:16,dom:i,addPanel:o,showPanel:s,begin:function(){a=(performance||Date).now()},end:function(){c++;var p=(performance||Date).now();if(f.update(p-a,200),l+1e3<=p&&(u.update(1e3*c/(p-l),100),l=p,c=0,h)){var d=performance.memory;h.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return p},update:function(){a=this.end()},domElement:i,setMode:s}};return n.Panel=function(r,i,o){var s=1/0,a=0,l=Math.round,c=l(window.devicePixelRatio||1),u=80*c,f=48*c,h=3*c,p=2*c,d=3*c,b=15*c,E=74*c,v=30*c,x=document.createElement("canvas");x.width=u,x.height=f,x.style.cssText="width:80px;height:48px";var y=x.getContext("2d");return y.font="bold "+9*c+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=o,y.fillRect(0,0,u,f),y.fillStyle=i,y.fillText(r,h,p),y.fillRect(d,b,E,v),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(d,b,E,v),{dom:x,update:function(_,T){s=Math.min(s,_),a=Math.max(a,_),y.fillStyle=o,y.globalAlpha=1,y.fillRect(0,0,u,b),y.fillStyle=i,y.fillText(l(_)+" "+r+" ("+l(s)+"-"+l(a)+")",h,p),y.drawImage(x,d+c,b,E-c,v,d,b,E-c,v),y.fillRect(d+E-c,b,c,v),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(d+E-c,b,c,l((1-_/T)*v))}}},n})})(kn);var pi=kn.exports;const xi=mi(pi);/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */let ft=Float32Array;function ue(t,e,n){const r=new ft(3);return t&&(r[0]=t),e&&(r[1]=e),n&&(r[2]=n),r}function vi(t,e,n){return n=n||new ft(3),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n}function Tn(t,e,n){n=n||new ft(3);const r=t[2]*e[0]-t[0]*e[2],i=t[0]*e[1]-t[1]*e[0];return n[0]=t[1]*e[2]-t[2]*e[1],n[1]=r,n[2]=i,n}function Rt(t,e){e=e||new ft(3);const n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=Math.sqrt(n);return r>1e-5?(e[0]=t[0]/r,e[1]=t[1]/r,e[2]=t[2]/r):(e[0]=0,e[1]=0,e[2]=0),e}let S=Float32Array;function bi(t){const e=S;return S=t,e}function yi(t,e){return e=e||new S(16),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e[9]=-t[9],e[10]=-t[10],e[11]=-t[11],e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=-t[15],e}function Ei(){return new S(16).fill(0)}function Vn(t,e){return e=e||new S(16),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Hn(t){return t=t||new S(16),t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function gi(t,e){if(e=e||new S(16),e===t){let x;return x=t[1],t[1]=t[4],t[4]=x,x=t[2],t[2]=t[8],t[8]=x,x=t[3],t[3]=t[12],t[12]=x,x=t[6],t[6]=t[9],t[9]=x,x=t[7],t[7]=t[13],t[13]=x,x=t[11],t[11]=t[14],t[14]=x,e}const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],u=t[2*4+0],f=t[2*4+1],h=t[2*4+2],p=t[2*4+3],d=t[3*4+0],b=t[3*4+1],E=t[3*4+2],v=t[3*4+3];return e[0]=n,e[1]=s,e[2]=u,e[3]=d,e[4]=r,e[5]=a,e[6]=f,e[7]=b,e[8]=i,e[9]=l,e[10]=h,e[11]=E,e[12]=o,e[13]=c,e[14]=p,e[15]=v,e}function Xn(t,e){e=e||new S(16);const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],u=t[2*4+0],f=t[2*4+1],h=t[2*4+2],p=t[2*4+3],d=t[3*4+0],b=t[3*4+1],E=t[3*4+2],v=t[3*4+3],x=h*v,y=E*p,_=l*v,T=E*c,D=l*p,R=h*c,$=i*v,z=E*o,G=i*p,k=h*o,V=i*c,H=l*o,X=u*b,Y=d*f,W=s*b,j=d*a,K=s*f,ze=u*a,Ge=n*b,ke=d*r,Ve=n*f,He=u*r,Xe=n*a,Ye=s*r,En=x*a+T*f+D*b-(y*a+_*f+R*b),gn=y*r+$*f+k*b-(x*r+z*f+G*b),An=_*r+z*a+V*b-(T*r+$*a+H*b),_n=R*r+G*a+H*f-(D*r+k*a+V*f),B=1/(n*En+s*gn+u*An+d*_n);return e[0]=B*En,e[1]=B*gn,e[2]=B*An,e[3]=B*_n,e[4]=B*(y*s+_*u+R*d-(x*s+T*u+D*d)),e[5]=B*(x*n+z*u+G*d-(y*n+$*u+k*d)),e[6]=B*(T*n+$*s+H*d-(_*n+z*s+V*d)),e[7]=B*(D*n+k*s+V*u-(R*n+G*s+H*u)),e[8]=B*(X*c+j*p+K*v-(Y*c+W*p+ze*v)),e[9]=B*(Y*o+Ge*p+He*v-(X*o+ke*p+Ve*v)),e[10]=B*(W*o+ke*c+Xe*v-(j*o+Ge*c+Ye*v)),e[11]=B*(ze*o+Ve*c+Ye*p-(K*o+He*c+Xe*p)),e[12]=B*(W*h+ze*E+Y*l-(K*E+X*l+j*h)),e[13]=B*(Ve*E+X*i+ke*h-(Ge*h+He*E+Y*i)),e[14]=B*(Ge*l+Ye*E+j*i-(Xe*E+W*i+ke*l)),e[15]=B*(Xe*h+K*i+He*l-(Ve*l+Ye*h+ze*i)),e}function Ai(t,e,n){n=n||new S(16);const r=t[0],i=t[1],o=t[2],s=t[3],a=t[4+0],l=t[4+1],c=t[4+2],u=t[4+3],f=t[8+0],h=t[8+1],p=t[8+2],d=t[8+3],b=t[12+0],E=t[12+1],v=t[12+2],x=t[12+3],y=e[0],_=e[1],T=e[2],D=e[3],R=e[4+0],$=e[4+1],z=e[4+2],G=e[4+3],k=e[8+0],V=e[8+1],H=e[8+2],X=e[8+3],Y=e[12+0],W=e[12+1],j=e[12+2],K=e[12+3];return n[0]=r*y+a*_+f*T+b*D,n[1]=i*y+l*_+h*T+E*D,n[2]=o*y+c*_+p*T+v*D,n[3]=s*y+u*_+d*T+x*D,n[4]=r*R+a*$+f*z+b*G,n[5]=i*R+l*$+h*z+E*G,n[6]=o*R+c*$+p*z+v*G,n[7]=s*R+u*$+d*z+x*G,n[8]=r*k+a*V+f*H+b*X,n[9]=i*k+l*V+h*H+E*X,n[10]=o*k+c*V+p*H+v*X,n[11]=s*k+u*V+d*H+x*X,n[12]=r*Y+a*W+f*j+b*K,n[13]=i*Y+l*W+h*j+E*K,n[14]=o*Y+c*W+p*j+v*K,n[15]=s*Y+u*W+d*j+x*K,n}function _i(t,e,n){return n=n||Hn(),t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11]),n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function wi(t,e){return e=e||ue(),e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function Ti(t,e,n){n=n||ue();const r=e*4;return n[0]=t[r+0],n[1]=t[r+1],n[2]=t[r+2],n}function Si(t,e,n,r){r!==t&&(r=Vn(t,r));const i=n*4;return r[i+0]=e[0],r[i+1]=e[1],r[i+2]=e[2],r}function Ci(t,e,n,r,i){i=i||new S(16);const o=Math.tan(Math.PI*.5-.5*t),s=1/(n-r);return i[0]=o/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=(n+r)*s,i[11]=-1,i[12]=0,i[13]=0,i[14]=n*r*s*2,i[15]=0,i}function Ri(t,e,n,r,i,o,s){return s=s||new S(16),s[0]=2/(e-t),s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2/(r-n),s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=2/(i-o),s[11]=0,s[12]=(e+t)/(t-e),s[13]=(r+n)/(n-r),s[14]=(o+i)/(i-o),s[15]=1,s}function Fi(t,e,n,r,i,o,s){s=s||new S(16);const a=e-t,l=r-n,c=i-o;return s[0]=2*i/a,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2*i/l,s[6]=0,s[7]=0,s[8]=(t+e)/a,s[9]=(r+n)/l,s[10]=o/c,s[11]=-1,s[12]=0,s[13]=0,s[14]=i*o/c,s[15]=0,s}let le,xe,ie;function Di(t,e,n,r){return r=r||new S(16),le=le||ue(),xe=xe||ue(),ie=ie||ue(),Rt(vi(t,e,ie),ie),Rt(Tn(n,ie,le),le),Rt(Tn(ie,le,xe),xe),r[0]=le[0],r[1]=le[1],r[2]=le[2],r[3]=0,r[4]=xe[0],r[5]=xe[1],r[6]=xe[2],r[7]=0,r[8]=ie[0],r[9]=ie[1],r[10]=ie[2],r[11]=0,r[12]=t[0],r[13]=t[1],r[14]=t[2],r[15]=1,r}function Pi(t,e){return e=e||new S(16),e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function Ii(t,e,n){n=n||new S(16);const r=e[0],i=e[1],o=e[2],s=t[0],a=t[1],l=t[2],c=t[3],u=t[1*4+0],f=t[1*4+1],h=t[1*4+2],p=t[1*4+3],d=t[2*4+0],b=t[2*4+1],E=t[2*4+2],v=t[2*4+3],x=t[3*4+0],y=t[3*4+1],_=t[3*4+2],T=t[3*4+3];return t!==n&&(n[0]=s,n[1]=a,n[2]=l,n[3]=c,n[4]=u,n[5]=f,n[6]=h,n[7]=p,n[8]=d,n[9]=b,n[10]=E,n[11]=v),n[12]=s*r+u*i+d*o+x,n[13]=a*r+f*i+b*o+y,n[14]=l*r+h*i+E*o+_,n[15]=c*r+p*i+v*o+T,n}function Li(t,e){e=e||new S(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Bi(t,e,n){n=n||new S(16);const r=t[4],i=t[5],o=t[6],s=t[7],a=t[8],l=t[9],c=t[10],u=t[11],f=Math.cos(e),h=Math.sin(e);return n[4]=f*r+h*a,n[5]=f*i+h*l,n[6]=f*o+h*c,n[7]=f*s+h*u,n[8]=f*a-h*r,n[9]=f*l-h*i,n[10]=f*c-h*o,n[11]=f*u-h*s,t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Mi(t,e){e=e||new S(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Ui(t,e,n){n=n||new S(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[2*4+0],l=t[2*4+1],c=t[2*4+2],u=t[2*4+3],f=Math.cos(e),h=Math.sin(e);return n[0]=f*r-h*a,n[1]=f*i-h*l,n[2]=f*o-h*c,n[3]=f*s-h*u,n[8]=f*a+h*r,n[9]=f*l+h*i,n[10]=f*c+h*o,n[11]=f*u+h*s,t!==n&&(n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Ni(t,e){e=e||new S(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Oi(t,e,n){n=n||new S(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[1*4+0],l=t[1*4+1],c=t[1*4+2],u=t[1*4+3],f=Math.cos(e),h=Math.sin(e);return n[0]=f*r+h*a,n[1]=f*i+h*l,n[2]=f*o+h*c,n[3]=f*s+h*u,n[4]=f*a-h*r,n[5]=f*l-h*i,n[6]=f*c-h*o,n[7]=f*u-h*s,t!==n&&(n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function $i(t,e,n){n=n||new S(16);let r=t[0],i=t[1],o=t[2];const s=Math.sqrt(r*r+i*i+o*o);r/=s,i/=s,o/=s;const a=r*r,l=i*i,c=o*o,u=Math.cos(e),f=Math.sin(e),h=1-u;return n[0]=a+(1-a)*u,n[1]=r*i*h+o*f,n[2]=r*o*h-i*f,n[3]=0,n[4]=r*i*h-o*f,n[5]=l+(1-l)*u,n[6]=i*o*h+r*f,n[7]=0,n[8]=r*o*h+i*f,n[9]=i*o*h-r*f,n[10]=c+(1-c)*u,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function zi(t,e,n,r){r=r||new S(16);let i=e[0],o=e[1],s=e[2];const a=Math.sqrt(i*i+o*o+s*s);i/=a,o/=a,s/=a;const l=i*i,c=o*o,u=s*s,f=Math.cos(n),h=Math.sin(n),p=1-f,d=l+(1-l)*f,b=i*o*p+s*h,E=i*s*p-o*h,v=i*o*p-s*h,x=c+(1-c)*f,y=o*s*p+i*h,_=i*s*p+o*h,T=o*s*p-i*h,D=u+(1-u)*f,R=t[0],$=t[1],z=t[2],G=t[3],k=t[4],V=t[5],H=t[6],X=t[7],Y=t[8],W=t[9],j=t[10],K=t[11];return r[0]=d*R+b*k+E*Y,r[1]=d*$+b*V+E*W,r[2]=d*z+b*H+E*j,r[3]=d*G+b*X+E*K,r[4]=v*R+x*k+y*Y,r[5]=v*$+x*V+y*W,r[6]=v*z+x*H+y*j,r[7]=v*G+x*X+y*K,r[8]=_*R+T*k+D*Y,r[9]=_*$+T*V+D*W,r[10]=_*z+T*H+D*j,r[11]=_*G+T*X+D*K,t!==r&&(r[12]=t[12],r[13]=t[13],r[14]=t[14],r[15]=t[15]),r}function Gi(t,e){return e=e||new S(16),e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ki(t,e,n){n=n||new S(16);const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0],n[1]=r*t[0*4+1],n[2]=r*t[0*4+2],n[3]=r*t[0*4+3],n[4]=i*t[1*4+0],n[5]=i*t[1*4+1],n[6]=i*t[1*4+2],n[7]=i*t[1*4+3],n[8]=o*t[2*4+0],n[9]=o*t[2*4+1],n[10]=o*t[2*4+2],n[11]=o*t[2*4+3],t!==n&&(n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Vi(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2],s=r*t[0*4+3]+i*t[1*4+3]+o*t[2*4+3]+t[3*4+3];return n[0]=(r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0]+t[3*4+0])/s,n[1]=(r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1]+t[3*4+1])/s,n[2]=(r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2]+t[3*4+2])/s,n}function Hi(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0],n[1]=r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1],n[2]=r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2],n}function Xi(t,e,n){n=n||ue();const r=Xn(t),i=e[0],o=e[1],s=e[2];return n[0]=i*r[0*4+0]+o*r[0*4+1]+s*r[0*4+2],n[1]=i*r[1*4+0]+o*r[1*4+1]+s*r[1*4+2],n[2]=i*r[2*4+0]+o*r[2*4+1]+s*r[2*4+2],n}var Yi=Object.freeze({__proto__:null,axisRotate:zi,axisRotation:$i,copy:Vn,create:Ei,frustum:Fi,getAxis:Ti,getTranslation:wi,identity:Hn,inverse:Xn,lookAt:Di,multiply:Ai,negate:yi,ortho:Ri,perspective:Ci,rotateX:Bi,rotateY:Ui,rotateZ:Oi,rotationX:Li,rotationY:Mi,rotationZ:Ni,scale:ki,scaling:Gi,setAxis:Si,setDefaultType:bi,setTranslation:_i,transformDirection:Hi,transformNormal:Xi,transformPoint:Vi,translate:Ii,translation:Pi,transpose:gi});const jt=5120,Le=5121,Kt=5122,qt=5123,Qt=5124,Zt=5125,Jt=5126,Wi=32819,ji=32820,Ki=33635,qi=5131,Qi=33640,Zi=35899,Ji=35902,eo=36269,to=34042,Yn={};{const t=Yn;t[jt]=Int8Array,t[Le]=Uint8Array,t[Kt]=Int16Array,t[qt]=Uint16Array,t[Qt]=Int32Array,t[Zt]=Uint32Array,t[Jt]=Float32Array,t[Wi]=Uint16Array,t[ji]=Uint16Array,t[Ki]=Uint16Array,t[qi]=Uint16Array,t[Qi]=Uint32Array,t[Zi]=Uint32Array,t[Ji]=Uint32Array,t[eo]=Uint32Array,t[to]=Uint32Array}function en(t){if(t instanceof Int8Array)return jt;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)return Le;if(t instanceof Int16Array)return Kt;if(t instanceof Uint16Array)return qt;if(t instanceof Int32Array)return Qt;if(t instanceof Uint32Array)return Zt;if(t instanceof Float32Array)return Jt;throw new Error("unsupported typed array type")}function Wn(t){if(t===Int8Array)return jt;if(t===Uint8Array||t===Uint8ClampedArray)return Le;if(t===Int16Array)return Kt;if(t===Uint16Array)return qt;if(t===Int32Array)return Qt;if(t===Uint32Array)return Zt;if(t===Float32Array)return Jt;throw new Error("unsupported typed array type")}function jn(t){const e=Yn[t];if(!e)throw new Error("unknown gl type");return e}const rt=typeof SharedArrayBuffer<"u"?function(e){return e&&e.buffer&&(e.buffer instanceof ArrayBuffer||e.buffer instanceof SharedArrayBuffer)}:function(e){return e&&e.buffer&&e.buffer instanceof ArrayBuffer};function Kn(...t){console.error(...t)}function no(...t){console.warn(...t)}const Sn=new Map;function ht(t,e){if(!t||typeof t!="object")return!1;let n=Sn.get(e);n||(n=new WeakMap,Sn.set(e,n));let r=n.get(t);if(r===void 0){const i=Object.prototype.toString.call(t);r=i.substring(8,i.length-1)===e,n.set(t,r)}return r}function ro(t,e){return typeof WebGLBuffer<"u"&&ht(e,"WebGLBuffer")}function io(t,e){return typeof WebGLRenderbuffer<"u"&&ht(e,"WebGLRenderbuffer")}function tn(t,e){return typeof WebGLTexture<"u"&&ht(e,"WebGLTexture")}function oo(t,e){return typeof WebGLSampler<"u"&&ht(e,"WebGLSampler")}const qn=35044,ge=34962,so=34963,ao=34660,lo=5120,co=5121,uo=5122,fo=5123,ho=5124,mo=5125,Qn=5126,Zn={attribPrefix:""};function po(t,e,n,r,i){t.bindBuffer(e,n),t.bufferData(e,r,i||qn)}function Jn(t,e,n,r){if(ro(t,e))return e;n=n||ge;const i=t.createBuffer();return po(t,n,i,e,r),i}function er(t){return t==="indices"}function xo(t){return t===Int8Array||t===Uint8Array}function vo(t){return t.length?t:t.data}const bo=/coord|texture/i,yo=/color|colour/i;function Eo(t,e){let n;if(bo.test(t)?n=2:yo.test(t)?n=4:n=3,e%n>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);return n}function go(t,e,n){return t.numComponents||t.size||Eo(e,n||vo(t).length)}function tr(t,e){if(rt(t))return t;if(rt(t.data))return t.data;Array.isArray(t)&&(t={data:t});let n=t.type?nn(t.type):void 0;return n||(er(e)?n=Uint16Array:n=Float32Array),new n(t.data)}function Ao(t){return typeof t=="number"?t:t?Wn(t):Qn}function nn(t){return typeof t=="number"?jn(t):t||Float32Array}function _o(t,e){return{buffer:e.buffer,numValues:2*3*4,type:Ao(e.type),arrayType:nn(e.type)}}function wo(t,e){const n=e.data||e,r=nn(e.type),i=n*r.BYTES_PER_ELEMENT,o=t.createBuffer();return t.bindBuffer(ge,o),t.bufferData(ge,i,e.drawType||qn),{buffer:o,numValues:n,type:Wn(r),arrayType:r}}function To(t,e,n){const r=tr(e,n);return{arrayType:r.constructor,buffer:Jn(t,r,void 0,e.drawType),type:en(r),numValues:0}}function So(t,e){const n={};return Object.keys(e).forEach(function(r){if(!er(r)){const i=e[r],o=i.attrib||i.name||i.attribName||Zn.attribPrefix+r;if(i.value){if(!Array.isArray(i.value)&&!rt(i.value))throw new Error("array.value is not array or typedarray");n[o]={value:i.value}}else{let s;i.buffer&&i.buffer instanceof WebGLBuffer?s=_o:typeof i=="number"||typeof i.data=="number"?s=wo:s=To;const{buffer:a,type:l,numValues:c,arrayType:u}=s(t,i,r),f=i.normalize!==void 0?i.normalize:xo(u),h=go(i,r,c);n[o]={buffer:a,numComponents:h,type:l,normalize:f,stride:i.stride||0,offset:i.offset||0,divisor:i.divisor===void 0?void 0:i.divisor,drawType:i.drawType}}}}),t.bindBuffer(ge,null),n}function Co(t,e){return e===lo||e===co?1:e===uo||e===fo?2:e===ho||e===mo||e===Qn?4:0}const Ft=["position","positions","a_position"];function Ro(t,e){let n,r;for(r=0;r<Ft.length&&(n=Ft[r],!(n in e||(n=Zn.attribPrefix+n,n in e)));++r);r===Ft.length&&(n=Object.keys(e)[0]);const i=e[n];if(!i.buffer)return 1;t.bindBuffer(ge,i.buffer);const o=t.getBufferParameter(ge,ao);t.bindBuffer(ge,null);const s=Co(t,i.type),a=o/s,l=i.numComponents||i.size,c=a/l;if(c%1!==0)throw new Error(`numComponents ${l} not correct for length ${length}`);return c}function dt(t,e,n){const r=So(t,e),i=Object.assign({},n||{});i.attribs=Object.assign({},n?n.attribs:{},r);const o=e.indices;if(o){const s=tr(o,"indices");i.indices=Jn(t,s,so),i.numElements=s.length,i.elementType=en(s)}else i.numElements||(i.numElements=Ro(t,i.attribs));return i}function Ue(t){return!!t.texStorage2D}const it=function(){const t={},e={};function n(r){const i=r.constructor.name;if(!t[i]){for(const o in r)if(typeof r[o]=="number"){const s=e[r[o]];e[r[o]]=s?`${s} | ${o}`:o}t[i]=!0}}return function(i,o){return n(i),e[o]||(typeof o=="number"?`0x${o.toString(16)}`:o)}}(),he={textureColor:new Uint8Array([128,192,255,255]),textureOptions:{},crossOrigin:void 0},Be=rt,nr=function(){let t;return function(){return t=t||(typeof document<"u"&&document.createElement?document.createElement("canvas").getContext("2d"):null),t}}(),Cn=6406,te=6407,F=6408,Rn=6409,Fn=6410,De=6402,Dn=34041,ot=33071,Fo=9728,Do=9729,de=3553,fe=34067,Ae=32879,_e=35866,rn=34069,Po=34070,Io=34071,Lo=34072,Bo=34073,Mo=34074,Nt=10241,Ot=10240,st=10242,at=10243,Pn=32882,Uo=33082,No=33083,Oo=33084,$o=33085,zo=34892,Go=34893,on=3317,rr=3314,ir=32878,or=3316,sr=3315,ar=32877,ko=37443,Vo=37441,Ho=37440,Xo=33321,Yo=36756,Wo=33325,jo=33326,Ko=33330,qo=33329,Qo=33338,Zo=33337,Jo=33340,es=33339,ts=33323,ns=36757,rs=33327,is=33328,os=33336,ss=33335,as=33332,ls=33331,cs=33334,us=33333,fs=32849,hs=35905,ds=36194,ms=36758,ps=35898,xs=35901,vs=34843,bs=34837,ys=36221,Es=36239,gs=36215,As=36233,_s=36209,ws=36227,Ts=32856,Ss=35907,Cs=36759,Rs=32855,Fs=32854,Ds=32857,Ps=34842,Is=34836,Ls=36220,Bs=36238,Ms=36975,Us=36214,Ns=36232,Os=36226,$s=36208,zs=33189,Gs=33190,ks=36012,Vs=36013,Hs=35056,ce=5120,C=5121,We=5122,we=5123,je=5124,ve=5125,U=5126,In=32819,Ln=32820,Bn=33635,J=5131,Pe=36193,Dt=33640,Xs=35899,Ys=35902,Ws=36269,js=34042,Ke=33319,Te=33320,qe=6403,Se=36244,Ce=36248,be=36249;let Pt;function mt(t){if(!Pt){const e={};e[Cn]={textureFormat:Cn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[C,J,Pe,U]},e[Rn]={textureFormat:Rn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[C,J,Pe,U]},e[Fn]={textureFormat:Fn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2,4,4,8],type:[C,J,Pe,U]},e[te]={textureFormat:te,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,6,6,12,2],type:[C,J,Pe,U,Bn]},e[F]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,8,8,16,2,2],type:[C,J,Pe,U,In,Ln]},e[De]={textureFormat:De,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[ve,we]},e[Xo]={textureFormat:qe,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1],type:[C]},e[Yo]={textureFormat:qe,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[1],type:[ce]},e[Wo]={textureFormat:qe,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4,2],type:[U,J]},e[jo]={textureFormat:qe,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[4],type:[U]},e[Ko]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[C]},e[qo]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[ce]},e[as]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[we]},e[ls]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[We]},e[cs]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[us]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[je]},e[ts]={textureFormat:Ke,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2],type:[C]},e[ns]={textureFormat:Ke,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[2],type:[ce]},e[rs]={textureFormat:Ke,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[8,4],type:[U,J]},e[is]={textureFormat:Ke,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[8],type:[U]},e[os]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[C]},e[ss]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[ce]},e[Qo]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[we]},e[Zo]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[We]},e[Jo]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[ve]},e[es]={textureFormat:Te,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[je]},e[fs]={textureFormat:te,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3],type:[C]},e[hs]={textureFormat:te,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[C]},e[ds]={textureFormat:te,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,2],type:[C,Bn]},e[ms]={textureFormat:te,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[ce]},e[ps]={textureFormat:te,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[U,J,Xs]},e[xs]={textureFormat:te,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[U,J,Ys]},e[vs]={textureFormat:te,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6],type:[U,J]},e[bs]={textureFormat:te,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[U]},e[ys]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[C]},e[Es]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[ce]},e[gs]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[we]},e[As]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[We]},e[_s]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[ve]},e[ws]={textureFormat:Ce,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[je]},e[Ts]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[C]},e[Ss]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[C]},e[Cs]={textureFormat:F,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4],type:[ce]},e[Rs]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2,4],type:[C,Ln,Dt]},e[Fs]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2],type:[C,In]},e[Ds]={textureFormat:F,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[Dt]},e[Ps]={textureFormat:F,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[16,8],type:[U,J]},e[Is]={textureFormat:F,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[16],type:[U]},e[Ls]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[C]},e[Bs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ce]},e[Ms]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Dt]},e[Us]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[we]},e[Ns]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[We]},e[Os]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[je]},e[$s]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[ve]},e[zs]={textureFormat:De,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[we,ve]},e[Gs]={textureFormat:De,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[ks]={textureFormat:De,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[U]},e[Hs]={textureFormat:Dn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[js]},e[Vs]={textureFormat:Dn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Ws]},Object.keys(e).forEach(function(n){const r=e[n];r.bytesPerElementMap={},r.bytesPerElement.forEach(function(i,o){const s=r.type[o];r.bytesPerElementMap[s]=i})}),Pt=e}return Pt[t]}function Ks(t,e){const n=mt(t);if(!n)throw"unknown internal format";const r=n.bytesPerElementMap[e];if(r===void 0)throw"unknown internal format";return r}function Ne(t){const e=mt(t);if(!e)throw"unknown internal format";return{format:e.textureFormat,type:e.type[0]}}function Mn(t){return(t&t-1)===0}function qs(t,e,n,r){if(!Ue(t))return Mn(e)&&Mn(n);const i=mt(r);if(!i)throw"unknown internal format";return i.colorRenderable&&i.textureFilterable}function Qs(t){const e=mt(t);if(!e)throw"unknown internal format";return e.textureFilterable}function Zs(t,e,n){return Be(e)?en(e):n||C}function Qe(t,e,n,r,i){if(i%1!==0)throw"can't guess dimensions";if(!n&&!r){const o=Math.sqrt(i/(e===fe?6:1));o%1===0?(n=o,r=o):(n=i,r=1)}else if(r){if(!n&&(n=i/r,n%1))throw"can't guess dimensions"}else if(r=i/n,r%1)throw"can't guess dimensions";return{width:n,height:r}}function Re(t,e){e.colorspaceConversion!==void 0&&t.pixelStorei(ko,e.colorspaceConversion),e.premultiplyAlpha!==void 0&&t.pixelStorei(Vo,e.premultiplyAlpha),e.flipY!==void 0&&t.pixelStorei(Ho,e.flipY)}function lr(t){t.pixelStorei(on,4),Ue(t)&&(t.pixelStorei(rr,0),t.pixelStorei(ir,0),t.pixelStorei(or,0),t.pixelStorei(sr,0),t.pixelStorei(ar,0))}function Js(t,e,n,r){r.minMag&&(n.call(t,e,Nt,r.minMag),n.call(t,e,Ot,r.minMag)),r.min&&n.call(t,e,Nt,r.min),r.mag&&n.call(t,e,Ot,r.mag),r.wrap&&(n.call(t,e,st,r.wrap),n.call(t,e,at,r.wrap),(e===Ae||oo(t,e))&&n.call(t,e,Pn,r.wrap)),r.wrapR&&n.call(t,e,Pn,r.wrapR),r.wrapS&&n.call(t,e,st,r.wrapS),r.wrapT&&n.call(t,e,at,r.wrapT),r.minLod!==void 0&&n.call(t,e,Uo,r.minLod),r.maxLod!==void 0&&n.call(t,e,No,r.maxLod),r.baseLevel!==void 0&&n.call(t,e,Oo,r.baseLevel),r.maxLevel!==void 0&&n.call(t,e,$o,r.maxLevel),r.compareFunc!==void 0&&n.call(t,e,Go,r.compareFunc),r.compareMode!==void 0&&n.call(t,e,zo,r.compareMode)}function cr(t,e,n){const r=n.target||de;t.bindTexture(r,e),Js(t,r,t.texParameteri,n)}function ea(t){return t=t||he.textureColor,Be(t)?t:new Uint8Array([t[0]*255,t[1]*255,t[2]*255,t[3]*255])}function $t(t,e,n,r,i,o){n=n||he.textureOptions,o=o||F;const s=n.target||de;if(r=r||n.width,i=i||n.height,t.bindTexture(s,e),qs(t,r,i,o))t.generateMipmap(s);else{const a=Qs(o)?Do:Fo;t.texParameteri(s,Nt,a),t.texParameteri(s,Ot,a),t.texParameteri(s,st,ot),t.texParameteri(s,at,ot)}}function Me(t){return t.auto===!0||t.auto===void 0&&t.level===void 0}function zt(t,e){return e=e||{},e.cubeFaceOrder||[rn,Po,Io,Lo,Bo,Mo]}function Gt(t,e){const r=zt(t,e).map(function(i,o){return{face:i,ndx:o}});return r.sort(function(i,o){return i.face-o.face}),r}function ur(t,e,n,r){r=r||he.textureOptions;const i=r.target||de,o=r.level||0;let s=n.width,a=n.height;const l=r.internalFormat||r.format||F,c=Ne(l),u=r.format||c.format,f=r.type||c.type;if(Re(t,r),t.bindTexture(i,e),i===fe){const h=n.width,p=n.height;let d,b;if(h/6===p)d=p,b=[0,0,1,0,2,0,3,0,4,0,5,0];else if(p/6===h)d=h,b=[0,0,0,1,0,2,0,3,0,4,0,5];else if(h/3===p/2)d=h/3,b=[0,0,1,0,2,0,0,1,1,1,2,1];else if(h/2===p/3)d=h/2,b=[0,0,1,0,0,1,1,1,0,2,1,2];else throw"can't figure out cube map from element: "+(n.src?n.src:n.nodeName);const E=nr();E?(E.canvas.width=d,E.canvas.height=d,s=d,a=d,Gt(t,r).forEach(function(v){const x=b[v.ndx*2+0]*d,y=b[v.ndx*2+1]*d;E.drawImage(n,x,y,d,d,0,0,d,d),t.texImage2D(v.face,o,l,u,f,E.canvas)}),E.canvas.width=1,E.canvas.height=1):typeof createImageBitmap<"u"&&(s=d,a=d,Gt(t,r).forEach(function(v){const x=b[v.ndx*2+0]*d,y=b[v.ndx*2+1]*d;t.texImage2D(v.face,o,l,d,d,0,u,f,null),createImageBitmap(n,x,y,d,d,{premultiplyAlpha:"none",colorSpaceConversion:"none"}).then(function(_){Re(t,r),t.bindTexture(i,e),t.texImage2D(v.face,o,l,u,f,_),Me(r)&&$t(t,e,r,s,a,l)})}))}else if(i===Ae||i===_e){const h=Math.min(n.width,n.height),p=Math.max(n.width,n.height),d=p/h;if(d%1!==0)throw"can not compute 3D dimensions of element";const b=n.width===p?1:0,E=n.height===p?1:0;t.pixelStorei(on,1),t.pixelStorei(rr,n.width),t.pixelStorei(ir,0),t.pixelStorei(ar,0),t.texImage3D(i,o,l,h,h,h,0,u,f,null);for(let v=0;v<d;++v){const x=v*h*b,y=v*h*E;t.pixelStorei(or,x),t.pixelStorei(sr,y),t.texSubImage3D(i,o,0,0,v,h,h,1,u,f,n)}lr(t)}else t.texImage2D(i,o,l,u,f,n);Me(r)&&$t(t,e,r,s,a,l),cr(t,e,r)}function Oe(){}function ta(t){if(typeof document<"u"){const e=document.createElement("a");return e.href=t,e.hostname===location.hostname&&e.port===location.port&&e.protocol===location.protocol}else{const e=new URL(location.href).origin;return new URL(t,location.href).origin===e}}function na(t,e){return e===void 0&&!ta(t)?"anonymous":e}function ra(t,e,n){n=n||Oe;let r;if(e=e!==void 0?e:he.crossOrigin,e=na(t,e),typeof Image<"u"){r=new Image,e!==void 0&&(r.crossOrigin=e);const i=function(){r.removeEventListener("error",o),r.removeEventListener("load",s),r=null},o=function(){const l="couldn't load image: "+t;Kn(l),n(l,r),i()},s=function(){n(null,r),i()};return r.addEventListener("error",o),r.addEventListener("load",s),r.src=t,r}else if(typeof ImageBitmap<"u"){let i,o;const s=function(){n(i,o)},a={};e&&(a.mode="cors"),fetch(t,a).then(function(l){if(!l.ok)throw l;return l.blob()}).then(function(l){return createImageBitmap(l,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}).then(function(l){o=l,setTimeout(s)}).catch(function(l){i=l,setTimeout(s)}),r=null}return r}function fr(t){return typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof ImageData<"u"&&t instanceof ImageData||typeof HTMLElement<"u"&&t instanceof HTMLElement}function sn(t,e,n){return fr(t)?(setTimeout(function(){n(null,t)}),t):ra(t,e,n)}function an(t,e,n){n=n||he.textureOptions;const r=n.target||de;if(t.bindTexture(r,e),n.color===!1)return;const i=ea(n.color);if(r===fe)for(let o=0;o<6;++o)t.texImage2D(rn+o,0,F,1,1,0,F,C,i);else r===Ae||r===_e?t.texImage3D(r,0,F,1,1,1,0,F,C,i):t.texImage2D(r,0,F,1,1,0,F,C,i)}function ia(t,e,n,r){return r=r||Oe,n=n||he.textureOptions,an(t,e,n),n=Object.assign({},n),sn(n.src,n.crossOrigin,function(o,s){o?r(o,e,s):(ur(t,e,s,n),r(null,e,s))})}function oa(t,e,n,r){r=r||Oe;const i=n.src;if(i.length!==6)throw"there must be 6 urls for a cubemap";const o=n.level||0,s=n.internalFormat||n.format||F,a=Ne(s),l=n.format||a.format,c=n.type||C,u=n.target||de;if(u!==fe)throw"target must be TEXTURE_CUBE_MAP";an(t,e,n),n=Object.assign({},n);let f=6;const h=[],p=zt(t,n);let d;function b(E){return function(v,x){--f,v?h.push(v):x.width!==x.height?h.push("cubemap face img is not a square: "+x.src):(Re(t,n),t.bindTexture(u,e),f===5?zt().forEach(function(y){t.texImage2D(y,o,s,l,c,x)}):t.texImage2D(E,o,s,l,c,x),Me(n)&&t.generateMipmap(u)),f===0&&r(h.length?h:void 0,e,d)}}d=i.map(function(E,v){return sn(E,n.crossOrigin,b(p[v]))})}function sa(t,e,n,r){r=r||Oe;const i=n.src,o=n.internalFormat||n.format||F,s=Ne(o),a=n.format||s.format,l=n.type||C,c=n.target||_e;if(c!==Ae&&c!==_e)throw"target must be TEXTURE_3D or TEXTURE_2D_ARRAY";an(t,e,n),n=Object.assign({},n);let u=i.length;const f=[];let h;const p=n.level||0;let d=n.width,b=n.height;const E=i.length;let v=!0;function x(y){return function(_,T){if(--u,_)f.push(_);else{if(Re(t,n),t.bindTexture(c,e),v){v=!1,d=n.width||T.width,b=n.height||T.height,t.texImage3D(c,p,o,d,b,E,0,a,l,null);for(let D=0;D<E;++D)t.texSubImage3D(c,p,0,0,D,d,b,1,a,l,T)}else{let D=T,R;(T.width!==d||T.height!==b)&&(R=nr(),D=R.canvas,R.canvas.width=d,R.canvas.height=b,R.drawImage(T,0,0,d,b)),t.texSubImage3D(c,p,0,0,y,d,b,1,a,l,D),R&&D===R.canvas&&(R.canvas.width=0,R.canvas.height=0)}Me(n)&&t.generateMipmap(c)}u===0&&r(f.length?f:void 0,e,h)}}h=i.map(function(y,_){return sn(y,n.crossOrigin,x(_))})}function aa(t,e,n,r){r=r||he.textureOptions;const i=r.target||de;t.bindTexture(i,e);let o=r.width,s=r.height,a=r.depth;const l=r.level||0,c=r.internalFormat||r.format||F,u=Ne(c),f=r.format||u.format,h=r.type||Zs(t,n,u.type);if(Be(n))n instanceof Uint8ClampedArray&&(n=new Uint8Array(n.buffer));else{const E=jn(h);n=new E(n)}const p=Ks(c,h),d=n.byteLength/p;if(d%1)throw"length wrong size for format: "+it(t,f);let b;if(i===Ae||i===_e)if(!o&&!s&&!a){const E=Math.cbrt(d);if(E%1!==0)throw"can't guess cube size of array of numElements: "+d;o=E,s=E,a=E}else o&&(!s||!a)?(b=Qe(t,i,s,a,d/o),s=b.width,a=b.height):s&&(!o||!a)?(b=Qe(t,i,o,a,d/s),o=b.width,a=b.height):(b=Qe(t,i,o,s,d/a),o=b.width,s=b.height);else b=Qe(t,i,o,s,d),o=b.width,s=b.height;if(lr(t),t.pixelStorei(on,r.unpackAlignment||1),Re(t,r),i===fe){const E=p/n.BYTES_PER_ELEMENT,v=d/6*E;Gt(t,r).forEach(x=>{const y=v*x.ndx,_=n.subarray(y,y+v);t.texImage2D(x.face,l,c,o,s,0,f,h,_)})}else i===Ae||i===_e?t.texImage3D(i,l,c,o,s,a,0,f,h,n):t.texImage2D(i,l,c,o,s,0,f,h,n);return{width:o,height:s,depth:a,type:h}}function la(t,e,n){const r=n.target||de;t.bindTexture(r,e);const i=n.level||0,o=n.internalFormat||n.format||F,s=Ne(o),a=n.format||s.format,l=n.type||s.type;if(Re(t,n),r===fe)for(let c=0;c<6;++c)t.texImage2D(rn+c,i,o,n.width,n.height,0,a,l,null);else r===Ae||r===_e?t.texImage3D(r,i,o,n.width,n.height,n.depth,0,a,l,null):t.texImage2D(r,i,o,n.width,n.height,0,a,l,null)}function ca(t,e,n){n=n||Oe,e=e||he.textureOptions;const r=t.createTexture(),i=e.target||de;let o=e.width||1,s=e.height||1;const a=e.internalFormat||F;t.bindTexture(i,r),i===fe&&(t.texParameteri(i,st,ot),t.texParameteri(i,at,ot));let l=e.src;if(l)if(typeof l=="function"&&(l=l(t,e)),typeof l=="string")ia(t,r,e,n);else if(Be(l)||Array.isArray(l)&&(typeof l[0]=="number"||Array.isArray(l[0])||Be(l[0]))){const c=aa(t,r,l,e);o=c.width,s=c.height}else Array.isArray(l)&&(typeof l[0]=="string"||fr(l[0]))?i===fe?oa(t,r,e,n):sa(t,r,e,n):(ur(t,r,l,e),o=l.width,s=l.height);else la(t,r,e);return Me(e)&&$t(t,r,e,o,s,a),cr(t,r,e),r}const ln=Kn;function hr(t){return typeof document<"u"&&document.getElementById?document.getElementById(t):null}const lt=33984,pt=34962,ua=34963,fa=35713,ha=35714,da=35632,ma=35633,pa=35981,dr=35718,xa=35721,va=35971,ba=35382,ya=35396,Ea=35398,ga=35392,Aa=35395,xt=5126,mr=35664,pr=35665,xr=35666,cn=5124,vr=35667,br=35668,yr=35669,Er=35670,gr=35671,Ar=35672,_r=35673,wr=35674,Tr=35675,Sr=35676,_a=35678,wa=35680,Ta=35679,Sa=35682,Ca=35685,Ra=35686,Fa=35687,Da=35688,Pa=35689,Ia=35690,La=36289,Ba=36292,Ma=36293,un=5125,Cr=36294,Rr=36295,Fr=36296,Ua=36298,Na=36299,Oa=36300,$a=36303,za=36306,Ga=36307,ka=36308,Va=36311,vt=3553,bt=34067,fn=32879,yt=35866,A={};function Dr(t,e){return A[e].bindPoint}function Ha(t,e){return function(n){t.uniform1f(e,n)}}function Xa(t,e){return function(n){t.uniform1fv(e,n)}}function Ya(t,e){return function(n){t.uniform2fv(e,n)}}function Wa(t,e){return function(n){t.uniform3fv(e,n)}}function ja(t,e){return function(n){t.uniform4fv(e,n)}}function Pr(t,e){return function(n){t.uniform1i(e,n)}}function Ir(t,e){return function(n){t.uniform1iv(e,n)}}function Lr(t,e){return function(n){t.uniform2iv(e,n)}}function Br(t,e){return function(n){t.uniform3iv(e,n)}}function Mr(t,e){return function(n){t.uniform4iv(e,n)}}function Ka(t,e){return function(n){t.uniform1ui(e,n)}}function qa(t,e){return function(n){t.uniform1uiv(e,n)}}function Qa(t,e){return function(n){t.uniform2uiv(e,n)}}function Za(t,e){return function(n){t.uniform3uiv(e,n)}}function Ja(t,e){return function(n){t.uniform4uiv(e,n)}}function el(t,e){return function(n){t.uniformMatrix2fv(e,!1,n)}}function tl(t,e){return function(n){t.uniformMatrix3fv(e,!1,n)}}function nl(t,e){return function(n){t.uniformMatrix4fv(e,!1,n)}}function rl(t,e){return function(n){t.uniformMatrix2x3fv(e,!1,n)}}function il(t,e){return function(n){t.uniformMatrix3x2fv(e,!1,n)}}function ol(t,e){return function(n){t.uniformMatrix2x4fv(e,!1,n)}}function sl(t,e){return function(n){t.uniformMatrix4x2fv(e,!1,n)}}function al(t,e){return function(n){t.uniformMatrix3x4fv(e,!1,n)}}function ll(t,e){return function(n){t.uniformMatrix4x3fv(e,!1,n)}}function N(t,e,n,r){const i=Dr(t,e);return Ue(t)?function(o){let s,a;!o||tn(t,o)?(s=o,a=null):(s=o.texture,a=o.sampler),t.uniform1i(r,n),t.activeTexture(lt+n),t.bindTexture(i,s),t.bindSampler(n,a)}:function(o){t.uniform1i(r,n),t.activeTexture(lt+n),t.bindTexture(i,o)}}function O(t,e,n,r,i){const o=Dr(t,e),s=new Int32Array(i);for(let a=0;a<i;++a)s[a]=n+a;return Ue(t)?function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(lt+s[c]);let u,f;!l||tn(t,l)?(u=l,f=null):(u=l.texture,f=l.sampler),t.bindSampler(n,f),t.bindTexture(o,u)})}:function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(lt+s[c]),t.bindTexture(o,l)})}}A[xt]={Type:Float32Array,size:4,setter:Ha,arraySetter:Xa};A[mr]={Type:Float32Array,size:8,setter:Ya,cols:2};A[pr]={Type:Float32Array,size:12,setter:Wa,cols:3};A[xr]={Type:Float32Array,size:16,setter:ja,cols:4};A[cn]={Type:Int32Array,size:4,setter:Pr,arraySetter:Ir};A[vr]={Type:Int32Array,size:8,setter:Lr,cols:2};A[br]={Type:Int32Array,size:12,setter:Br,cols:3};A[yr]={Type:Int32Array,size:16,setter:Mr,cols:4};A[un]={Type:Uint32Array,size:4,setter:Ka,arraySetter:qa};A[Cr]={Type:Uint32Array,size:8,setter:Qa,cols:2};A[Rr]={Type:Uint32Array,size:12,setter:Za,cols:3};A[Fr]={Type:Uint32Array,size:16,setter:Ja,cols:4};A[Er]={Type:Uint32Array,size:4,setter:Pr,arraySetter:Ir};A[gr]={Type:Uint32Array,size:8,setter:Lr,cols:2};A[Ar]={Type:Uint32Array,size:12,setter:Br,cols:3};A[_r]={Type:Uint32Array,size:16,setter:Mr,cols:4};A[wr]={Type:Float32Array,size:32,setter:el,rows:2,cols:2};A[Tr]={Type:Float32Array,size:48,setter:tl,rows:3,cols:3};A[Sr]={Type:Float32Array,size:64,setter:nl,rows:4,cols:4};A[Ca]={Type:Float32Array,size:32,setter:rl,rows:2,cols:3};A[Ra]={Type:Float32Array,size:32,setter:ol,rows:2,cols:4};A[Fa]={Type:Float32Array,size:48,setter:il,rows:3,cols:2};A[Da]={Type:Float32Array,size:48,setter:al,rows:3,cols:4};A[Pa]={Type:Float32Array,size:64,setter:sl,rows:4,cols:2};A[Ia]={Type:Float32Array,size:64,setter:ll,rows:4,cols:3};A[_a]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:vt};A[wa]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:bt};A[Ta]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:fn};A[Sa]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:vt};A[La]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:yt};A[Ba]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:yt};A[Ma]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:bt};A[Ua]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:vt};A[Na]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:fn};A[Oa]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:bt};A[$a]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:yt};A[za]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:vt};A[Ga]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:fn};A[ka]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:bt};A[Va]={Type:null,size:0,setter:N,arraySetter:O,bindPoint:yt};function Et(t,e){return function(n){if(n.value)switch(t.disableVertexAttribArray(e),n.value.length){case 4:t.vertexAttrib4fv(e,n.value);break;case 3:t.vertexAttrib3fv(e,n.value);break;case 2:t.vertexAttrib2fv(e,n.value);break;case 1:t.vertexAttrib1fv(e,n.value);break;default:throw new Error("the length of a float constant value must be between 1 and 4!")}else t.bindBuffer(pt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n.numComponents||n.size,n.type||xt,n.normalize||!1,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function me(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4iv(e,n.value);else throw new Error("The length of an integer constant value must be 4!");else t.bindBuffer(pt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||cn,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function gt(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4uiv(e,n.value);else throw new Error("The length of an unsigned integer constant value must be 4!");else t.bindBuffer(pt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||un,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function hn(t,e,n){const r=n.size,i=n.count;return function(o){t.bindBuffer(pt,o.buffer);const s=o.size||o.numComponents||r,a=s/i,l=o.type||xt,u=A[l].size*s,f=o.normalize||!1,h=o.offset||0,p=u/i;for(let d=0;d<i;++d)t.enableVertexAttribArray(e+d),t.vertexAttribPointer(e+d,a,l,f,u,h+p*d),t.vertexAttribDivisor&&t.vertexAttribDivisor(e+d,o.divisor||0)}}const L={};L[xt]={size:4,setter:Et};L[mr]={size:8,setter:Et};L[pr]={size:12,setter:Et};L[xr]={size:16,setter:Et};L[cn]={size:4,setter:me};L[vr]={size:8,setter:me};L[br]={size:12,setter:me};L[yr]={size:16,setter:me};L[un]={size:4,setter:gt};L[Cr]={size:8,setter:gt};L[Rr]={size:12,setter:gt};L[Fr]={size:16,setter:gt};L[Er]={size:4,setter:me};L[gr]={size:8,setter:me};L[Ar]={size:12,setter:me};L[_r]={size:16,setter:me};L[wr]={size:4,setter:hn,count:2};L[Tr]={size:9,setter:hn,count:3};L[Sr]={size:16,setter:hn,count:4};const cl=/ERROR:\s*\d+:(\d+)/gi;function ul(t,e="",n=0){const r=[...e.matchAll(cl)],i=new Map(r.map((o,s)=>{const a=parseInt(o[1]),l=r[s+1],c=l?l.index:e.length,u=e.substring(o.index,c);return[a-1,u]}));return t.split(`
`).map((o,s)=>{const a=i.get(s);return`${s+1+n}: ${o}${a?`

^^^ ${a}`:""}`}).join(`
`)}const Un=/^[ \t]*\n/;function Ur(t){let e=0;return Un.test(t)&&(e=1,t=t.replace(Un,"")),{lineOffset:e,shaderSource:t}}function fl(t,e){return t.errorCallback(e),t.callback&&setTimeout(()=>{t.callback(`${e}
${t.errors.join(`
`)}`)}),null}function hl(t,e,n,r){if(r=r||ln,!t.getShaderParameter(n,fa)){const o=t.getShaderInfoLog(n),{lineOffset:s,shaderSource:a}=Ur(t.getShaderSource(n)),l=`${ul(a,o,s)}
Error compiling ${it(t,e)}: ${o}`;return r(l),l}return""}function dn(t,e,n){let r,i,o;if(typeof e=="function"&&(n=e,e=void 0),typeof t=="function")n=t,t=void 0;else if(t&&!Array.isArray(t)){const c=t;n=c.errorCallback,t=c.attribLocations,r=c.transformFeedbackVaryings,i=c.transformFeedbackMode,o=c.callback}const s=n||ln,a=[],l={errorCallback(c,...u){a.push(c),s(c,...u)},transformFeedbackVaryings:r,transformFeedbackMode:i,callback:o,errors:a};{let c={};Array.isArray(t)?t.forEach(function(u,f){c[u]=e?e[f]:f}):c=t||{},l.attribLocations=c}return l}const dl=["VERTEX_SHADER","FRAGMENT_SHADER"];function ml(t,e){if(e.indexOf("frag")>=0)return da;if(e.indexOf("vert")>=0)return ma}function pl(t,e,n){const r=t.getAttachedShaders(e);for(const i of r)n.has(i)&&t.deleteShader(i);t.deleteProgram(e)}const xl=(t=0)=>new Promise(e=>setTimeout(e,t));function vl(t,e,n){const r=t.createProgram(),{attribLocations:i,transformFeedbackVaryings:o,transformFeedbackMode:s}=dn(n);for(let a=0;a<e.length;++a){let l=e[a];if(typeof l=="string"){const c=hr(l),u=c?c.text:l;let f=t[dl[a]];c&&c.type&&(f=ml(t,c.type)||f),l=t.createShader(f),t.shaderSource(l,Ur(u).shaderSource),t.compileShader(l),t.attachShader(r,l)}}Object.entries(i).forEach(([a,l])=>t.bindAttribLocation(r,l,a));{let a=o;a&&(a.attribs&&(a=a.attribs),Array.isArray(a)||(a=Object.keys(a)),t.transformFeedbackVaryings(r,a,s||pa))}return t.linkProgram(r),r}function bl(t,e,n,r,i){const o=dn(n,r,i),s=new Set(e),a=vl(t,e,o);function l(c,u){const f=El(c,u,o.errorCallback);return f&&pl(c,u,s),f}if(o.callback){yl(t,a).then(()=>{const c=l(t,a);o.callback(c,c?void 0:a)});return}return l(t,a)?void 0:a}async function yl(t,e){const n=t.getExtension("KHR_parallel_shader_compile"),r=n?(o,s)=>o.getProgramParameter(s,n.COMPLETION_STATUS_KHR):()=>!0;let i=0;do await xl(i),i=1e3/60;while(!r(t,e))}function El(t,e,n){if(n=n||ln,!t.getProgramParameter(e,ha)){const i=t.getProgramInfoLog(e);n(`Error in program linking: ${i}`);const s=t.getAttachedShaders(e).map(a=>hl(t,t.getShaderParameter(a,t.SHADER_TYPE),a,n));return`${i}
${s.filter(a=>a).join(`
`)}`}}function gl(t,e,n,r,i){return bl(t,e,n,r,i)}function Nr(t){const e=t.name;return e.startsWith("gl_")||e.startsWith("webgl_")}const Al=/(\.|\[|]|\w+)/g,_l=t=>t>="0"&&t<="9";function wl(t,e,n,r){const i=t.split(Al).filter(a=>a!=="");let o=0,s="";for(;;){const a=i[o++];s+=a;const l=_l(a[0]),c=l?parseInt(a):a;if(l&&(s+=i[o++]),o===i.length){n[c]=e;break}else{const f=i[o++],h=f==="[",p=n[c]||(h?[]:{});n[c]=p,n=p,r[s]=r[s]||function(d){return function(b){Or(d,b)}}(p),s+=f}}}function Tl(t,e){let n=0;function r(a,l,c){const u=l.name.endsWith("[0]"),f=l.type,h=A[f];if(!h)throw new Error(`unknown type: 0x${f.toString(16)}`);let p;if(h.bindPoint){const d=n;n+=l.size,u?p=h.arraySetter(t,f,d,c,l.size):p=h.setter(t,f,d,c,l.size)}else h.arraySetter&&u?p=h.arraySetter(t,c):p=h.setter(t,c);return p.location=c,p}const i={},o={},s=t.getProgramParameter(e,dr);for(let a=0;a<s;++a){const l=t.getActiveUniform(e,a);if(Nr(l))continue;let c=l.name;c.endsWith("[0]")&&(c=c.substr(0,c.length-3));const u=t.getUniformLocation(e,l.name);if(u){const f=r(e,l,u);i[c]=f,wl(c,f,o,i)}}return i}function Sl(t,e){const n={},r=t.getProgramParameter(e,va);for(let i=0;i<r;++i){const o=t.getTransformFeedbackVarying(e,i);n[o.name]={index:i,type:o.type,size:o.size}}return n}function Cl(t,e){const n=t.getProgramParameter(e,dr),r=[],i=[];for(let a=0;a<n;++a){i.push(a),r.push({});const l=t.getActiveUniform(e,a);r[a].name=l.name}[["UNIFORM_TYPE","type"],["UNIFORM_SIZE","size"],["UNIFORM_BLOCK_INDEX","blockNdx"],["UNIFORM_OFFSET","offset"]].forEach(function(a){const l=a[0],c=a[1];t.getActiveUniforms(e,i,t[l]).forEach(function(u,f){r[f][c]=u})});const o={},s=t.getProgramParameter(e,ba);for(let a=0;a<s;++a){const l=t.getActiveUniformBlockName(e,a),c={index:t.getUniformBlockIndex(e,l),usedByVertexShader:t.getActiveUniformBlockParameter(e,a,ya),usedByFragmentShader:t.getActiveUniformBlockParameter(e,a,Ea),size:t.getActiveUniformBlockParameter(e,a,ga),uniformIndices:t.getActiveUniformBlockParameter(e,a,Aa)};c.used=c.usedByVertexShader||c.usedByFragmentShader,o[l]=c}return{blockSpecs:o,uniformData:r}}function Or(t,e){for(const n in e){const r=t[n];typeof r=="function"?r(e[n]):Or(t[n],e[n])}}function $r(t,...e){const n=t.uniformSetters||t,r=e.length;for(let i=0;i<r;++i){const o=e[i];if(Array.isArray(o)){const s=o.length;for(let a=0;a<s;++a)$r(n,o[a])}else for(const s in o){const a=n[s];a&&a(o[s])}}}function Rl(t,e){const n={},r=t.getProgramParameter(e,xa);for(let i=0;i<r;++i){const o=t.getActiveAttrib(e,i);if(Nr(o))continue;const s=t.getAttribLocation(e,o.name),a=L[o.type],l=a.setter(t,s,a);l.location=s,n[o.name]=l}return n}function Fl(t,e){for(const n in e){const r=t[n];r&&r(e[n])}}function $e(t,e,n){n.vertexArrayObject?t.bindVertexArray(n.vertexArrayObject):(Fl(e.attribSetters||e,n.attribs),n.indices&&t.bindBuffer(ua,n.indices))}function Nn(t,e){const n=Tl(t,e),r=Rl(t,e),i={program:e,uniformSetters:n,attribSetters:r};return Ue(t)&&(i.uniformBlockSpec=Cl(t,e),i.transformFeedbackInfo=Sl(t,e)),i}const Dl=/\s|{|}|;/;function re(t,e,n,r,i){const o=dn(n,r,i),s=[];if(e=e.map(function(c){if(!Dl.test(c)){const u=hr(c);if(u)c=u.text;else{const f=`no element with id: ${c}`;o.errorCallback(f),s.push(f)}}return c}),s.length)return fl(o,"");const a=o.callback;a&&(o.callback=(c,u)=>{a(c,c?void 0:Nn(t,u))});const l=gl(t,e,o);return l?Nn(t,l):null}const Pl=4,On=5123;function At(t,e,n,r,i,o){n=n===void 0?Pl:n;const s=e.indices,a=e.elementType,l=r===void 0?e.numElements:r;i=i===void 0?0:i,a||s?o!==void 0?t.drawElementsInstanced(n,l,a===void 0?On:e.elementType,i,o):t.drawElements(n,l,a===void 0?On:e.elementType,i):o!==void 0?t.drawArraysInstanced(n,i,l,o):t.drawArrays(n,i,l)}const zr=36160,Ze=36161,Il=3553,Ll=5121,Bl=6402,Ml=6408,Ul=33190,Nl=36012,Ol=35056,$l=36013,zl=32854,Gl=32855,kl=36194,Gr=33189,kr=6401,Vr=36168,mn=34041,kt=36064,_t=36096,Hr=36128,pn=33306,Vt=33071,Ht=9729,Vl=[{format:Ml,type:Ll,min:Ht,wrap:Vt},{format:mn}],ee={};ee[mn]=pn;ee[kr]=Hr;ee[Vr]=Hr;ee[Bl]=_t;ee[Gr]=_t;ee[Ul]=_t;ee[Nl]=_t;ee[Ol]=pn;ee[$l]=pn;function Hl(t,e){return ee[t]||ee[e]}const pe={};pe[zl]=!0;pe[Gl]=!0;pe[kl]=!0;pe[mn]=!0;pe[Gr]=!0;pe[kr]=!0;pe[Vr]=!0;function Xl(t){return pe[t]}const Yl=32;function Wl(t){return t>=kt&&t<kt+Yl}function ye(t,e,n,r){const i=zr,o=t.createFramebuffer();t.bindFramebuffer(i,o),n=n||t.drawingBufferWidth,r=r||t.drawingBufferHeight,e=e||Vl;const s=[],a={framebuffer:o,attachments:[],width:n,height:r};return e.forEach(function(l,c){let u=l.attachment;const f=l.samples,h=l.format;let p=l.attachmentPoint||Hl(h,l.internalFormat);if(p||(p=kt+c),Wl(p)&&s.push(p),!u)if(f!==void 0||Xl(h))u=t.createRenderbuffer(),t.bindRenderbuffer(Ze,u),f>1?t.renderbufferStorageMultisample(Ze,f,h,n,r):t.renderbufferStorage(Ze,h,n,r);else{const d=Object.assign({},l);d.width=n,d.height=r,d.auto===void 0&&(d.auto=!1,d.min=d.min||d.minMag||Ht,d.mag=d.mag||d.minMag||Ht,d.wrapS=d.wrapS||d.wrap||Vt,d.wrapT=d.wrapT||d.wrap||Vt),u=ca(t,d)}if(io(t,u))t.framebufferRenderbuffer(i,p,Ze,u);else if(tn(t,u))l.layer!==void 0?t.framebufferTextureLayer(i,p,u,l.level||0,l.layer):t.framebufferTexture2D(i,p,l.target||Il,u,l.level||0);else throw new Error("unknown attachment type");a.attachments.push(u)}),t.drawBuffers&&t.drawBuffers(s),a}function wt(t,e,n){n=n||zr,e?(t.bindFramebuffer(n,e.framebuffer),t.viewport(0,0,e.width,e.height)):(t.bindFramebuffer(n,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight))}function xn(t,e,n){const r=t.createVertexArray();return t.bindVertexArray(r),e.length||(e=[e]),e.forEach(function(i){$e(t,i,n)}),t.bindVertexArray(null),{numElements:n.numElements,elementType:n.elementType,vertexArrayObject:r}}const jl=/^(.*?)_/;function Kl(t,e){it(t,0);const n=t.getExtension(e);if(n){const r={},i=jl.exec(e)[1],o="_"+i;for(const s in n){const a=n[s],l=typeof a=="function",c=l?i:o;let u=s;s.endsWith(c)&&(u=s.substring(0,s.length-c.length)),t[u]!==void 0?!l&&t[u]!==a&&no(u,t[u],a,s):l?t[u]=function(f){return function(){return f.apply(n,arguments)}}(a):(t[u]=a,r[u]=a)}r.constructor={name:n.constructor.name},it(r,0)}return n}const $n=["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_color_buffer_float","EXT_color_buffer_half_float","EXT_disjoint_timer_query","EXT_disjoint_timer_query_webgl2","EXT_frag_depth","EXT_sRGB","EXT_shader_texture_lod","EXT_texture_filter_anisotropic","OES_element_index_uint","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_color_buffer_float","WEBGL_compressed_texture_atc","WEBGL_compressed_texture_etc1","WEBGL_compressed_texture_pvrtc","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_depth_texture","WEBGL_draw_buffers"];function ql(t){for(let e=0;e<$n.length;++e)Kl(t,$n[e])}function Ql(t,e){e=e||1,e=Math.max(0,e);const n=t.clientWidth*e|0,r=t.clientHeight*e|0;return t.width!==n||t.height!==r?(t.width=n,t.height=r,!0):!1}Number.prototype.clamp=function(t,e){return Math.min(Math.max(this,t),e)};Number.prototype.mix=function(t,e){return this*(1-e)+t*e};class Zl{fetchUpdates(){const e=this.events;return this.events=[],e}getState(){return this.state}storeEvent(e){switch(e.frame=this.frame,e.type){case"blur":case"focusout":this.state={};break;case"keyup":delete this.state[e.key];break;case"keydown":this.state[e.key]||(this.state[e.key]={frame:this.frame});break;case"pointerup":case"pointermove":case"pointerdown":this.state.mouse={pos:e.pos,buttons:e.buttons};break;case"wheel":this.state.wheel||(this.state.wheel={y:0}),this.state.wheel.y+=e.deltaYl;break}}constructor(e){this.state={},this.frame=0,this.events=[],this.sizes={width:1,height:1},this.listeners=[],window.addEventListener("blur",i=>{this.storeEvent({type:i.type})}),window.addEventListener("focusout",i=>{this.storeEvent({type:i.type})}),window.addEventListener("keydown",i=>{const o=i.key.toLowerCase();o!=="f12"&&(i.preventDefault(),this.storeEvent({key:o,type:i.type}))}),window.addEventListener("keyup",i=>{const o=i.key.toLowerCase();i.preventDefault(),this.storeEvent({key:o,type:i.type})});const n=i=>{const{sizes:o}=this;if(i.target.className!=="webgl")return;const s=[(i.clientX-o.horizontalOffset)/o.width*2-1,-((i.clientY-o.verticalOffset)/o.height)*2+1];this.storeEvent({type:i.type,pos:s,buttons:i.buttons})},r=i=>{this.storeEvent({type:i.type,deltaY:i.deltaY})};window.addEventListener("wheel",r),window.addEventListener("pointerdown",n),window.addEventListener("pointerup",n),window.addEventListener("pointermove",n),window.addEventListener("contextmenu",i=>(i.preventDefault(),!1),!1),e.listeners.push(this),e.update()}updateTime({frame:e}){this.frame=e}updateSize(e){this.sizes=e}}function Jl(){Array.prototype.peek=function(){return this.length?this[this.length-1]:null},Array.prototype.equals=function(t){if(!Array.isArray(t)||t.length!==this.length)return!1;for(var e=0;e<this.length;e++)if(this[e]!==t[e])return!1;return!0}}Jl();class ec{constructor(){this.states=[]}stateParams(){return{}}cleanup(){for(;this.states.length;)this.cleanupState(this.states.pop())}currentState(){return this.states.peek()}addState(e){e.init(this),this.states.push(e)}cleanupState(e){e&&e.cleanup(this)}replaceState(e){this.cleanupState(this.states.pop()),this.addState(e)}pushState(e){var n;(n=this.currentState())==null||n.pause(),this.addState(e)}popState(){var e;this.cleanupState(this.states.pop()),(e=this.currentState())==null||e.resume()}}class tc{constructor(){}init(e){}cleanup(){}pause(){}resume(){}}class Je extends Array{constructor(e,n){super(),this.push(e,n)}distanceTo(e){const n=this[1].clone().sub(this[0]);n.len();const i=(e.clone().sub(this[0]).dot(n)/n.lenSq()).clamp(0,1);return this[0].clone().add(n.mul(i)).sub(e).len()}}const w=class w extends Array{constructor(e,n=null,r=null,i=null){if(super(),Array.isArray(e))for(let o=0;o<e.length;o++)this.push(e[o]);else{if(typeof e!="number"||n===null)throw new Error("Invalid construction");this.push(e,n),r!==null&&this.push(r),i!==null&&this.push(i)}}copy(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]=e[n];return this}add(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]+=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]+=e[n];else throw new Error("Invalid add");return this}sub(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]-=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]-=e[n];else throw new Error("Invalid sub");return this}mul(e){if(typeof e=="number")for(let n=0;n<this.length;n++)this[n]*=e;else if(e.length===this.length)for(let n=0;n<this.length;n++)this[n]*=e[n];else throw new Error("Invalid mul");return this}dot(e){if(e.length===this.length){let n=0;for(let r=0;r<this.length;r++)n+=this[r]*e[r];return n}else throw new Error("Invalid dot")}mix(e,n){for(let r=0;r<this.length;r++)this[r]=this[r].mix(e[r],n[r]);return this}min(e){for(let n=0;n<this.length;n++)this[n]=Math.min(this[n],e[n]);return this}clamp(e,n){for(let r=0;r<this.length;r++)this[r]=this[r].clamp(e,n);return this}max(e){for(let n=0;n<this.length;n++)this[n]=Math.max(this[n],e[n]);return this}normalize(){var e=0;for(let n=0;n<this.length;n++)e+=this[n]*this[n];for(let n=0;n<this.length;n++)this[n]/=e;return this}cross(e){if(e.length===this.length){if(this.length===2)return this[0]*e[1]-this[1]*e[0];if(this.length===3)return new w([this[1]*e[2]-this[2]*e[1],this[2]*e[0]-this[0]*e[2],this[0]*e[1]-this[1]*e[0]]);throw new Error("Can't do 4D cross (yet?)")}else throw new Error("Dimensions need to match for cross.")}len(){return Math.sqrt(this.lenSq())}lenSq(){var e=0;for(let n=0;n<this.length;n++)e+=this[n]*this[n];return e}clone(){return new w(this)}};M(w,"X2",new w([1,0])),M(w,"X3",new w([1,0,0])),M(w,"X4",new w([1,0,0,0])),M(w,"Y2",new w([0,1])),M(w,"Y3",new w([0,1,0])),M(w,"Y4",new w([0,1,0,0])),M(w,"Z3",new w([0,0,1])),M(w,"Z4",new w([0,0,1,0])),M(w,"W4",new w([0,0,0,1])),M(w,"ONE2",new w(1,1)),M(w,"ONE3",new w(1,1,1)),M(w,"ONE4",new w(1,1,1,1)),M(w,"ZERO2",new w(0,0)),M(w,"ZERO3",new w(0,0,0)),M(w,"ZERO4",new w(0,0,0,0));let P=w;function It({min:t=0,max:e,steps:n=2}){return Math.floor(n*Math.random())/(n-1)*(e-t)+t}class Xr{constructor(){this.type=Object.getPrototypeOf(this).constructor}}class Xt extends Xr{constructor(e,n){super(),this.playerIndex=e,this.direction=n}}class zn extends Xr{constructor(e){super(),this.delta=e}}class nc extends tc{update(e,n,r){const i=(r.w!==void 0)-+(r.s!==void 0),o=(r.arrowup!==void 0)-+(r.arrowdown!==void 0);e.commands.push(new Xt(0,i)),e.commands.push(new Xt(1,o))}}class Yr extends ec{constructor(){super(),this.pushState(new nc)}init(){}update(e,n){var r;(r=this.currentState())==null||r.update(e,this,n)}}new Yr;class rc{constructor(e){this.commands=[],this.data=e,e.listeners.push(this),this.data.state.ball&&(this.data.state.ball.size=.1),this.data.state.balls=this.setupBalls(),this.data.state.ball={position:new P(0,0),color:new P(1,1,1),size:.05,velocity:new P(.8,.4).mul(2)},this.data.state.paddles=[{position:new P(-.9,0),size:new P(.02,.2),color:new P(1,0,0),direction:0},{position:new P(.9,0),size:new P(.02,.2),color:new P(0,1,0),direction:0}],this.data.saveData(),this.activeColor=[1,1,1,1],this.currLine={start:[0,0],end:[0,0],color:this.activeColor}}setupBalls(){const e=[];for(var n=0;n<200;n++){const r=new P(It({max:.2,min:-.2,steps:40}),It({max:.9,min:-.9,steps:100}));e.push({origin:r,position:r.clone(),color:new P(0,0,0),size:It({max:.02,min:.01,steps:5})})}return e}configUpdated(){this.data.state.lines||(this.data.state.lines=[])}updateColor(e){this.activeColor=structuredClone(e),this.activeColor.push(1),this.currLine.color=this.activeColor}moveBall(e){const{ball:n}=this.data.state;n.position[0]+=e*n.velocity[0],n.position[1]+=e*n.velocity[1],Math.abs(n.position[0])+n.size>=1&&(n.velocity[0]*=-1),Math.abs(n.position[1])+n.size>=1&&(n.velocity[1]*=-1)}applyCommand(e){switch(e.type){case Xt:this.data.state.paddles[e.playerIndex].direction=e.direction;break;case zn:const{delta:n}=e,{ball:r,balls:i,paddles:o}=this.data.state;this.moveBall(n);for(let s=0;s<i.length;s++){const a=i[s];a.color.sub(P.ONE3.clone().mul(2*n)).max(P.ZERO3),a.position.clone().sub(r.position).len()<.15&&a.color.copy(r.color).mul(3);for(let c=0;c<o.length;c++){const u=o[c];u.position[1]+=n*u.direction*.01,u.position[1]=Math.min(Math.max(u.position[1],-1+u.size[1]),1-u.size[1]);const f=new P(u.size),h=new P(u.position).add(u.size),p=new P(u.position).sub(u.size),d=[new Je(h.clone(),h.clone().sub(f.clone().mul(P.X2).mul(2))),new Je(h.clone(),h.clone().sub(f.clone().mul(P.Y2).mul(2))),new Je(p.clone(),p.clone().add(f.clone().mul(P.X2).mul(2))),new Je(p.clone(),p.clone().add(f.clone().mul(P.Y2).mul(2)))];for(let b=0;b<d.length;b++)d[b].distanceTo(r.position)<r.size&&(r.color=u.color,Math.sign(r.velocity[0])!=Math.sign(.5-c)&&(r.velocity[0]*=-1))}this.data.saveData()}break}}update(e){this.commands.push(new zn(e)),this.commands.forEach(n=>{this.applyCommand(n)}),this.commands.length=0}}var ic=`#version 300 es\r
precision lowp float;

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
}`,oc=`#version 300 es\r
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
}`,ct=new xi;ct.showPanel(0);document.body.appendChild(ct.dom);const m=document.getElementById("webgl").getContext("webgl2");ql(m);function Q(t,e,n,r,i=null,o=null){t.useProgram(e.program),$e(t,e,n),$r(e,r),wt(t,i),o&&t.viewport(o[0],o[1],o[2],o[3]),At(t,n)}const sc={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}},Z=dt(m,sc),I=new hi;I.init();const vn=new Zr(1),ac=new Zl(vn),lc=new Yr,Fe=new rc(I),ae=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,cc=`#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`,uc=`#version 300 es
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
`,fc=`#version 300 es
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
`,Wr=`#version 300 es
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

`,hc=`#version 300 es
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
`,dc=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = pow(texture(tPrev, uv), vec4(1./2.2));
}
`,mc=`#version 300 es
in vec2 position;
in vec4 color;
in mat4 matrix;

out vec4 v_color;
  void main() {
    // Multiply the position by the matrix.
    gl_Position = matrix * vec4(position, 0.0, 1.0);
    v_color = color;
  }
`,pc=`#version 300 es

precision mediump float;

in vec4 v_color;

out vec4 outColor;
void main() {
  outColor = v_color;
}`,oe=re(m,[mc,pc]);re(m,[ae,uc]);const xc=re(m,[ae,hc]),vc=re(m,[ae,Wr]);re(m,[ae,Wr]);const ut=re(m,[ae,cc]),bc=re(m,[ae,fc]),Yt=re(m,[ae,dc]),yc=re(m,[ae,ic]),se=Yi,Ec=re(m,[ae,oc]),bn=[],Lt=32;for(var et=0;et<=Lt;et++)bn.push(Math.sin(et*Math.PI*2/Lt),Math.cos(et*Math.PI*2/Lt));function gc(t,e){const n=[],r=[],{ball:i}=Fe.data.state,o=se.scaling([i.size*e,i.size*e,i.size*e]),s=se.translation([i.position[0]/(i.size*e),i.position[1]/(i.size*e),0]),a=se.multiply(o,s);a.forEach((f,h)=>{n.push(f)}),r.push(i.color[0],i.color[1],i.color[2],1),a.forEach((f,h)=>{n.push(f)}),r.push(i.color[0],i.color[1],i.color[2],1);const c=dt(m,{position:{numComponents:2,data:bn},color:{numComponents:4,data:r,divisor:1},matrix:{numComponents:16,data:n,divisor:1}}),u=xn(m,oe,c);m.useProgram(oe.program),$e(m,oe,u),wt(m,t),At(m,u,m.TRIANGLE_FAN,u.numElements,0,1)}function Ac(t,e){const n=[],r=[],{balls:i}=Fe.data.state;for(let l=0;l<i.length;l++){const c=i[l],u=se.scaling([c.size*e,c.size*e,c.size*e]),f=se.translation([c.position[0]/(c.size*e),c.position[1]/(c.size*e),0]);se.multiply(u,f).forEach((p,d)=>{n.push(p)}),r.push(c.color[0],c.color[1],c.color[2],1)}const s=dt(m,{position:{numComponents:2,data:bn},color:{numComponents:4,data:r,divisor:1},matrix:{numComponents:16,data:n,divisor:1}}),a=xn(m,oe,s);m.useProgram(oe.program),$e(m,oe,a),wt(m,t),At(m,a,m.TRIANGLE_FAN,a.numElements,0,i.length)}function _c(t,e){const n=[],r=[],{paddles:i}=Fe.data.state;for(let c=0;c<i.length;c++){const u=i[c],f=se.scaling([u.size[0]*e,u.size[1]*e,1]),h=se.translation([u.position[0]/(u.size[0]*e),u.position[1]/(u.size[1]*e),0]);se.multiply(f,h).forEach((d,b)=>{n.push(d)}),r.push(u.color[0],u.color[1],u.color[2],1)}const a=dt(m,{position:{numComponents:2,data:[1,1,1,-1,-1,-1,-1,1]},color:{numComponents:4,data:r,divisor:1},matrix:{numComponents:16,data:n,divisor:1}}),l=xn(m,oe,a);m.useProgram(oe.program),$e(m,oe,l),wt(m,t),At(m,l,m.TRIANGLE_FAN,l.numElements,0,i.length)}function jr(t,e,n,r){gc(e,n),Ac(e,n),_c(e,n)}vn.listeners.push({updateSize:({width:t,height:e})=>{m.canvas.width=t,m.canvas.height=e}});let yn=!1;I.addButton({name:"Save Image",fn:()=>{yn=!0}});const wc=()=>{var e=document.getElementById("webgl").toDataURL(),n=document.createElement("a");n.download="canvas_image.png",n.href=e,n.click(),yn=!1},q=8*128,Ee=q,g={lightEmittersWithCurrent:ye(m,[{internalFormat:m.RGBA8,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],q,Ee),distance:ye(m,[{internalFormat:m.R8,format:m.R,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],q,Ee),fill:ye(m,[{internalFormat:m.RGB8,format:m.RGB,mag:m.NEAREST,min:m.NEAREST,wrap:m.CLAMP_TO_EDGE}],q,Ee),spare:ye(m,[{internalFormat:m.RGB8,format:m.RGB,mag:m.NEAREST,min:m.NEAREST,wrap:m.CLAMP_TO_EDGE}],q,Ee),quadCascadeRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],q,Ee),spareQuadCascadeRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],q,Ee),spareQuadCascadeFinalRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],q,Ee)};I.addColor({displayName:"Color",defaultValue:[1,1,1],callback:t=>{Fe.commands.push(new UpdateColorCommand(t))}});const tt=m.getExtension("EXT_disjoint_timer_query_webgl2"),Bt=m.createQuery();var Mt=!1,Gn=!1;function Tc(t){m.viewport(0,0,m.canvas.width,m.canvas.height),Q(m,ut,Z,{color:[0,0,0,0]},g.lightEmittersWithCurrent),jr(t,g.lightEmittersWithCurrent,1)}function Sc(t,e){const n=Math.log2(q)-5,r=2*Math.SQRT2/g.quadCascadeRT.width,o=Math.log2(Math.SQRT2/r),s=e===0?0:r*Math.pow(2,o*(e-1)/n),a=e==n?Math.SQRT2:r*Math.pow(2,o*e/n),l=r*Math.pow(2,o*(e+1)/n);Q(m,yc,Z,{renderResolution:[m.canvas.width,m.canvas.height],resolution:[g.quadCascadeRT.width,g.quadCascadeRT.height],maxSteps:I.addNumber({displayName:"Max Steps",defaultValue:32,min:1,max:128,step:1}).value,tDistance:g.distance.attachments[0],tColor:g.lightEmittersWithCurrent.attachments[0],startDepth:n,current:{depth:e,minDistance:s,maxDistance:a},deeper:{depth:e,minDistance:a,maxDistance:l},debug:{continousBilinearFix:I.addNumber({displayName:"Continuous Bilinear Fix",defaultValue:!0}).value,cornerProbes:I.addNumber({displayName:"Corner Probes",defaultValue:!0}).value,showSampleUv:I.addNumber({displayName:"Show Sample Uv",defaultValue:!1}).value,showProbeUv:I.addNumber({displayName:"Show Probe Uv",defaultValue:!1}).value,showDirection:I.addNumber({displayName:"Show Direction Uv",defaultValue:!1}).value,noFix:I.addNumber({displayName:"No Fix",defaultValue:!1}).value,quadSample:I.addNumber({displayName:"Quad Sample",defaultValue:!1}).value,finalDepth:I.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value},tPrevCascade:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeRT),[g.spareQuadCascadeRT,g.quadCascadeRT]=[g.quadCascadeRT,g.spareQuadCascadeRT]}function Cc(t){Q(m,ut,Z,{color:[0,0,0,0]},g.spare),[g.fill,g.spare]=[g.spare,g.fill];for(var e=Math.ceil(Math.log2(q));e>=0;e--)Q(m,bc,Z,{resolution:[g.fill.width,g.fill.height],jumpSize:1<<e,tPrev:g.fill.attachments[0],tLine:g.lightEmittersWithCurrent.attachments[0]},g.spare),[g.fill,g.spare]=[g.spare,g.fill];Q(m,vc,Z,{resolution:[g.fill.width,g.fill.height],tPrev:g.fill.attachments[0]},g.distance)}function Rc(){Q(m,xc,Z,{renderTarget:[I.addNumber({displayName:"minx",defaultValue:0,min:0,max:1,step:.01}).value,I.addNumber({displayName:"miny",defaultValue:0,min:0,max:1,step:.01}).value,I.addNumber({displayName:"maxx",defaultValue:1,min:0,max:1,step:.01}).value,I.addNumber({displayName:"maxy",defaultValue:1,min:0,max:1,step:.01}).value],resolution:[g.quadCascadeRT.width,g.quadCascadeRT.height],tPrev:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeFinalRT),Q(m,Yt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:g.spareQuadCascadeFinalRT.attachments[0]})}function Fc(){Q(m,Ec,Z,{resolution:[g.spareQuadCascadeRT.width,g.spareQuadCascadeRT.height],tPrevCascade:g.quadCascadeRT.attachments[0]},g.spareQuadCascadeFinalRT)}class Dc{constructor({fps:e=60}){this.frame=0,this.fps=e,this.initialTime=Date.now(),this.lastDelta=Date.now()}getDeltaTime(){const n=Date.now()-this.lastDelta;return this.lastDelta=Date.now(),Math.min(1e3/this.fps,n)}timeToNextRender(){this.frame++;const e=Date.now()-this.initialTime,n=1e3/this.fps;return e%n}}const nt=new Dc({fps:60});function Kr(t){ct.begin(),vn.update(),lc.update(Fe,ac.getState()),Fe.update(nt.getDeltaTime()/1e3),Ql(m.canvas),Tc(t),Cc();let e=I.addNumber({displayName:"Initial Depth",defaultValue:Math.log2(q)-3,min:1,max:Math.log2(q)-3,step:1}).value;for(Q(m,ut,Z,{color:[0,0,0,0]},g.quadCascadeRT),Q(m,ut,Z,{color:[0,0,0,0]},g.spareQuadCascadeFinalRT),!Mt&&tt&&(m.beginQuery(tt.TIME_ELAPSED_EXT,Bt),Mt=!0);e>=I.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value;)Sc(nt,e),e--;switch(Mt&&!Gn&&tt&&(Gn=!0,m.endQuery(tt.TIME_ELAPSED_EXT)),Q(m,Yt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:g.lightEmittersWithCurrent.attachments[0]}),I.addEnum({displayName:"Render Mode",defaultValue:"Render Cascade",options:["Render Cascade","Cascade Levels"]}).value){case"Cascade Levels":Rc();break;case"Render Cascade":default:Fc();break}if(jr(nt,g.spareQuadCascadeFinalRT,1),Q(m,Yt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:g.spareQuadCascadeFinalRT.attachments[0]}),yn&&wc(),m.getQueryParameter(Bt,m.QUERY_RESULT_AVAILABLE)){const r=m.getQueryParameter(Bt,m.QUERY_RESULT);console.log("ELAPSED: ",r/1e6)}setTimeout(()=>{requestAnimationFrame(Kr)},nt.timeToNextRender()),ct.end()}requestAnimationFrame(Kr);
//# sourceMappingURL=index-167b4acd.js.map