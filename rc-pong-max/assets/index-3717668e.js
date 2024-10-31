var Hn=Object.defineProperty;var Xn=(t,e,n)=>e in t?Hn(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var R=(t,e,n)=>(Xn(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function n(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=n(i);fetch(i.href,s)}})();class Yn{constructor(e){this.sizes={width:window.innerWidth,height:window.innerHeight,buffer:20,aspect:e},this.listeners=[],document.querySelector("div.container");const n=document.querySelector("div.relative");this.update=()=>{const{buffer:r}=this.sizes,i=window.innerHeight-2*r,s=window.innerWidth-2*r;i*this.sizes.aspect>s?(this.sizes.width=s,this.sizes.height=s/this.sizes.aspect,this.sizes.verticalOffset=r+(i-this.sizes.height)/2,this.sizes.horizontalOffset=r):(this.sizes.width=i*this.sizes.aspect,this.sizes.height=i,this.sizes.verticalOffset=r,this.sizes.horizontalOffset=r+(s-this.sizes.width)/2),n.style.top=this.sizes.verticalOffset.toString()+"px",n.style.left=this.sizes.horizontalOffset.toString()+"px",this.listeners.forEach(a=>{a.updateSize(this.sizes)})},window.addEventListener("resize",this.update),window.addEventListener("orientationchange",this.update),window.addEventListener("dblclick",r=>{})}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class z{constructor(e,n,r,i,s="div"){this.parent=e,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(s),this.domElement.classList.add("controller"),this.domElement.classList.add(i),this.$name=document.createElement("div"),this.$name.classList.add("name"),z.nextNameID=z.nextNameID||0,this.$name.id=`lil-gui-name-${++z.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",a=>a.stopPropagation()),this.domElement.addEventListener("keyup",a=>a.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const n=this.parent.add(this.object,this.property,e);return n.name(this._name),this.destroy(),n}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Wn extends z{constructor(e,n,r){super(e,n,r,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function We(t){let e,n;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?n=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),n?"#"+n:!1}const jn={isPrimitive:!0,match:t=>typeof t=="string",fromHexString:We,toHexString:We},le={isPrimitive:!0,match:t=>typeof t=="number",fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},Kn={isPrimitive:!1,match:t=>Array.isArray(t),fromHexString(t,e,n=1){const r=le.fromHexString(t);e[0]=(r>>16&255)/255*n,e[1]=(r>>8&255)/255*n,e[2]=(r&255)/255*n},toHexString([t,e,n],r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return le.toHexString(i)}},Jn={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,e,n=1){const r=le.fromHexString(t);e.r=(r>>16&255)/255*n,e.g=(r>>8&255)/255*n,e.b=(r&255)/255*n},toHexString({r:t,g:e,b:n},r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return le.toHexString(i)}},qn=[jn,le,Kn,Jn];function Zn(t){return qn.find(e=>e.match(t))}class Qn extends z{constructor(e,n,r,i){super(e,n,r,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Zn(this.initialValue),this._rgbScale=i,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const s=We(this.$text.value);s&&this._setValueFromHexString(s)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const n=this._format.fromHexString(e);this.setValue(n)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class $e extends z{constructor(e,n,r){super(e,n,r,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",i=>{i.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class er extends z{constructor(e,n,r,i,s,a){super(e,n,r,"number"),this._initInput(),this.min(i),this.max(s);const o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,n=!0){return this._step=e,this._stepExplicit=n,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let n=(e-this._min)/(this._max-this._min);n=Math.max(0,Math.min(n,1)),this.$fill.style.width=n*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const n=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},r=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},i=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x)*-1))},s=x=>{this._inputFocused&&(x.preventDefault(),r(this._step*this._normalizeMouseWheel(x)))};let a=!1,o,l,c,d,f;const h=5,m=x=>{o=x.clientX,l=c=x.clientY,a=!0,d=this.getValue(),f=0,window.addEventListener("mousemove",u),window.addEventListener("mouseup",b)},u=x=>{if(a){const y=x.clientX-o,C=x.clientY-l;Math.abs(C)>h?(x.preventDefault(),this.$input.blur(),a=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>h&&b()}if(!a){const y=x.clientY-c;f-=y*this._step*this._arrowKeyMultiplier(x),d+f>this._max?f=this._max-d:d+f<this._min&&(f=this._min-d),this._snapClampSetValue(d+f)}c=x.clientY},b=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",u),window.removeEventListener("mouseup",b)},E=()=>{this._inputFocused=!0},p=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",n),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",s,{passive:!1}),this.$input.addEventListener("mousedown",m),this.$input.addEventListener("focus",E),this.$input.addEventListener("blur",p)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(p,x,y,C,D)=>(p-x)/(y-x)*(D-C)+C,n=p=>{const x=this.$slider.getBoundingClientRect();let y=e(p,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},r=p=>{this._setDraggingStyle(!0),n(p.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",s)},i=p=>{n(p.clientX)},s=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",s)};let a=!1,o,l;const c=p=>{p.preventDefault(),this._setDraggingStyle(!0),n(p.touches[0].clientX),a=!1},d=p=>{p.touches.length>1||(this._hasScrollBar?(o=p.touches[0].clientX,l=p.touches[0].clientY,a=!0):c(p),window.addEventListener("touchmove",f,{passive:!1}),window.addEventListener("touchend",h))},f=p=>{if(a){const x=p.touches[0].clientX-o,y=p.touches[0].clientY-l;Math.abs(x)>Math.abs(y)?c(p):(window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h))}else p.preventDefault(),n(p.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",f),window.removeEventListener("touchend",h)},m=this._callOnFinishChange.bind(this),u=400;let b;const E=p=>{if(Math.abs(p.deltaX)<Math.abs(p.deltaY)&&this._hasScrollBar)return;p.preventDefault();const y=this._normalizeMouseWheel(p)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(b),b=setTimeout(m,u)};this.$slider.addEventListener("mousedown",r),this.$slider.addEventListener("touchstart",d,{passive:!1}),this.$slider.addEventListener("wheel",E,{passive:!1})}_setDraggingStyle(e,n="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${n}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:n,deltaY:r}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(n=0,r=-e.wheelDelta/120,r*=this._stepExplicit?1:10),n+-r}_arrowKeyMultiplier(e){let n=this._stepExplicit?1:10;return e.shiftKey?n*=10:e.altKey&&(n/=10),n}_snap(e){const n=Math.round(e/this._step)*this._step;return parseFloat(n.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class tr extends z{constructor(e,n,r,i){super(e,n,r,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(i)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(n=>{const r=document.createElement("option");r.textContent=n,this.$select.appendChild(r)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),n=this._values.indexOf(e);return this.$select.selectedIndex=n,this.$display.textContent=n===-1?e:this._names[n],this}}class nr extends z{constructor(e,n,r){super(e,n,r,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",i=>{i.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const rr=`.lil-gui {
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
}`;function ir(t){const e=document.createElement("style");e.innerHTML=t;const n=document.querySelector("head link[rel=stylesheet], head style");n?document.head.insertBefore(e,n):document.head.appendChild(e)}let Tt=!1;class rt{constructor({parent:e,autoPlace:n=e===void 0,container:r,width:i,title:s="Controls",closeFolders:a=!1,injectStyles:o=!0,touchStyles:l=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(s),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Tt&&o&&(ir(rr),Tt=!0),r?r.appendChild(this.domElement):n&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),i&&this.domElement.style.setProperty("--width",i+"px"),this._closeFolders=a}add(e,n,r,i,s){if(Object(r)===r)return new tr(this,e,n,r);const a=e[n];switch(typeof a){case"number":return new er(this,e,n,r,i,s);case"boolean":return new Wn(this,e,n);case"string":return new nr(this,e,n);case"function":return new $e(this,e,n)}console.error(`gui.add failed
	property:`,n,`
	object:`,e,`
	value:`,a)}addColor(e,n,r=1){return new Qn(this,e,n,r)}addFolder(e){const n=new rt({parent:this,title:e});return this.root._closeFolders&&n.close(),n}load(e,n=!0){return e.controllers&&this.controllers.forEach(r=>{r instanceof $e||r._name in e.controllers&&r.load(e.controllers[r._name])}),n&&e.folders&&this.folders.forEach(r=>{r._title in e.folders&&r.load(e.folders[r._title])}),this}save(e=!0){const n={controllers:{},folders:{}};return this.controllers.forEach(r=>{if(!(r instanceof $e)){if(r._name in n.controllers)throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);n.controllers[r._name]=r.save()}}),e&&this.folders.forEach(r=>{if(r._title in n.folders)throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);n.folders[r._title]=r.save()}),n}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const n=this.$children.clientHeight;this.$children.style.height=n+"px",this.domElement.classList.add("transition");const r=s=>{s.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",r))};this.$children.addEventListener("transitionend",r);const i=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=i+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(r=>r.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(n=>{e=e.concat(n.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(n=>{e=e.concat(n.foldersRecursive())}),e}}const sr=rt,Ge="state",ke="config";class or{constructor(){this.added=[],this.listeners=[],this.serializedConfig={},this.config={},this.state={}}init(){const e=new sr;this.variables=e.addFolder("Variables"),this.buttons=e.addFolder("Buttons"),this.readData(),this.addButton({name:"Clear Data",fn:()=>this.clearData()}),e.hide()}addEnum({displayName:e,defaultValue:n,options:r,callback:i=null}){var s;if(!this.config[e]){const a=((s=this.serializedConfig[e])==null?void 0:s.value)??n;this.config[e]={name:e,defaultValue:n,value:a,minOrOptions:r},this.addConfigData(e,i),this.added.push(e)}return this.config[e]}addNumber({displayName:e,defaultValue:n,min:r=null,max:i=null,step:s=null,callback:a=null}){var o;if(!this.config[e]){const l=((o=this.serializedConfig[e])==null?void 0:o.value)??n;this.config[e]={name:e,defaultValue:n,value:l,minOrOptions:r,max:i,step:s},r!==null&&(this.config[e].value=Math.max(r,this.config[e].value)),i!==null&&(this.config[e].value=Math.min(i,this.config[e].value)),this.addConfigData(e,a),this.added.push(e)}return this.config[e]}addColor({displayName:e,defaultValue:n,callback:r=null}){var i;if(!this.config[e]){const s=((i=this.serializedConfig[e])==null?void 0:i.value)??n;this.config[e]={name:e,defaultValue:n,value:s},this.variables.addColor(this.config[e],"value").name(e).onChange(a=>{this.saveData(),this.notify(),r&&r(a)}).listen(),this.added.push(e)}return this.config[e]}addButton({fn:e,name:n}){const r={};r[n]=e,this.buttons.add(r,n)}addConfigData(e,n){const{minOrOptions:r=null,max:i=null,step:s=null,name:a}=this.config[e];this.variables.add(this.config[e],"value",r,i,s).name(a).onChange(o=>{this.saveData(),this.notify(),n&&n(o)}).listen()}notify(){this.listeners.forEach(e=>e.configUpdated(this.config))}readData(){const e=localStorage.getItem(Ge);e&&e!="undefined"?this.state=JSON.parse(e):this.state={};const n=localStorage.getItem(ke);n&&n!="undefined"?this.serializedConfig=JSON.parse(n):this.serializedConfig={}}saveData(){}clearData(){localStorage.getItem(Ge)&&localStorage.removeItem(Ge),this.state={},localStorage.getItem(ke)&&localStorage.removeItem(ke);for(const[e,n]of Object.entries(this.config))n.value=n.defaultValue;this.notify()}addListener(e){this.listeners.push(e)}}var ar=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function lr(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var $t={exports:{}};(function(t,e){(function(n,r){t.exports=r()})(ar,function(){var n=function(){var r=0,i=document.createElement("div");function s(m){return i.appendChild(m.dom),m}function a(m){for(var u=0;u<i.children.length;u++)i.children[u].style.display=u===m?"block":"none";r=m}i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(m){m.preventDefault(),a(++r%i.children.length)},!1);var o=(performance||Date).now(),l=o,c=0,d=s(new n.Panel("FPS","#0ff","#002")),f=s(new n.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var h=s(new n.Panel("MB","#f08","#201"));return a(0),{REVISION:16,dom:i,addPanel:s,showPanel:a,begin:function(){o=(performance||Date).now()},end:function(){c++;var m=(performance||Date).now();if(f.update(m-o,200),l+1e3<=m&&(d.update(1e3*c/(m-l),100),l=m,c=0,h)){var u=performance.memory;h.update(u.usedJSHeapSize/1048576,u.jsHeapSizeLimit/1048576)}return m},update:function(){o=this.end()},domElement:i,setMode:a}};return n.Panel=function(r,i,s){var a=1/0,o=0,l=Math.round,c=l(window.devicePixelRatio||1),d=80*c,f=48*c,h=3*c,m=2*c,u=3*c,b=15*c,E=74*c,p=30*c,x=document.createElement("canvas");x.width=d,x.height=f,x.style.cssText="width:80px;height:48px";var y=x.getContext("2d");return y.font="bold "+9*c+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=s,y.fillRect(0,0,d,f),y.fillStyle=i,y.fillText(r,h,m),y.fillRect(u,b,E,p),y.fillStyle=s,y.globalAlpha=.9,y.fillRect(u,b,E,p),{dom:x,update:function(C,D){a=Math.min(a,C),o=Math.max(o,C),y.fillStyle=s,y.globalAlpha=1,y.fillRect(0,0,d,b),y.fillStyle=i,y.fillText(l(C)+" "+r+" ("+l(a)+"-"+l(o)+")",h,m),y.drawImage(x,u+c,b,E-c,p,u,b,E-c,p),y.fillRect(u+E-c,b,c,p),y.fillStyle=s,y.globalAlpha=.9,y.fillRect(u+E-c,b,c,l((1-C/D)*p))}}},n})})($t);var cr=$t.exports;const ur=lr(cr);/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */const it=5120,ce=5121,st=5122,ot=5123,at=5124,lt=5125,ct=5126,dr=32819,fr=32820,hr=33635,mr=5131,pr=33640,xr=35899,vr=35902,br=36269,yr=34042,Gt={};{const t=Gt;t[it]=Int8Array,t[ce]=Uint8Array,t[st]=Int16Array,t[ot]=Uint16Array,t[at]=Int32Array,t[lt]=Uint32Array,t[ct]=Float32Array,t[dr]=Uint16Array,t[fr]=Uint16Array,t[hr]=Uint16Array,t[mr]=Uint16Array,t[pr]=Uint32Array,t[xr]=Uint32Array,t[vr]=Uint32Array,t[br]=Uint32Array,t[yr]=Uint32Array}function ut(t){if(t instanceof Int8Array)return it;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)return ce;if(t instanceof Int16Array)return st;if(t instanceof Uint16Array)return ot;if(t instanceof Int32Array)return at;if(t instanceof Uint32Array)return lt;if(t instanceof Float32Array)return ct;throw new Error("unsupported typed array type")}function kt(t){if(t===Int8Array)return it;if(t===Uint8Array||t===Uint8ClampedArray)return ce;if(t===Int16Array)return st;if(t===Uint16Array)return ot;if(t===Int32Array)return at;if(t===Uint32Array)return lt;if(t===Float32Array)return ct;throw new Error("unsupported typed array type")}function Vt(t){const e=Gt[t];if(!e)throw new Error("unknown gl type");return e}const Ae=typeof SharedArrayBuffer<"u"?function(e){return e&&e.buffer&&(e.buffer instanceof ArrayBuffer||e.buffer instanceof SharedArrayBuffer)}:function(e){return e&&e.buffer&&e.buffer instanceof ArrayBuffer};function Ht(...t){console.error(...t)}function gr(...t){console.warn(...t)}const St=new Map;function Fe(t,e){if(!t||typeof t!="object")return!1;let n=St.get(e);n||(n=new WeakMap,St.set(e,n));let r=n.get(t);if(r===void 0){const i=Object.prototype.toString.call(t);r=i.substring(8,i.length-1)===e,n.set(t,r)}return r}function Er(t,e){return typeof WebGLBuffer<"u"&&Fe(e,"WebGLBuffer")}function Ar(t,e){return typeof WebGLRenderbuffer<"u"&&Fe(e,"WebGLRenderbuffer")}function dt(t,e){return typeof WebGLTexture<"u"&&Fe(e,"WebGLTexture")}function _r(t,e){return typeof WebGLSampler<"u"&&Fe(e,"WebGLSampler")}const Xt=35044,Z=34962,wr=34963,Tr=34660,Sr=5120,Cr=5121,Rr=5122,Fr=5123,Ir=5124,Pr=5125,Yt=5126,Wt={attribPrefix:""};function Dr(t,e,n,r,i){t.bindBuffer(e,n),t.bufferData(e,r,i||Xt)}function jt(t,e,n,r){if(Er(t,e))return e;n=n||Z;const i=t.createBuffer();return Dr(t,n,i,e,r),i}function Kt(t){return t==="indices"}function Lr(t){return t===Int8Array||t===Uint8Array}function Br(t){return t.length?t:t.data}const Ur=/coord|texture/i,zr=/color|colour/i;function Or(t,e){let n;if(Ur.test(t)?n=2:zr.test(t)?n=4:n=3,e%n>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);return n}function Mr(t,e,n){return t.numComponents||t.size||Or(e,n||Br(t).length)}function Jt(t,e){if(Ae(t))return t;if(Ae(t.data))return t.data;Array.isArray(t)&&(t={data:t});let n=t.type?ft(t.type):void 0;return n||(Kt(e)?n=Uint16Array:n=Float32Array),new n(t.data)}function Nr(t){return typeof t=="number"?t:t?kt(t):Yt}function ft(t){return typeof t=="number"?Vt(t):t||Float32Array}function $r(t,e){return{buffer:e.buffer,numValues:2*3*4,type:Nr(e.type),arrayType:ft(e.type)}}function Gr(t,e){const n=e.data||e,r=ft(e.type),i=n*r.BYTES_PER_ELEMENT,s=t.createBuffer();return t.bindBuffer(Z,s),t.bufferData(Z,i,e.drawType||Xt),{buffer:s,numValues:n,type:kt(r),arrayType:r}}function kr(t,e,n){const r=Jt(e,n);return{arrayType:r.constructor,buffer:jt(t,r,void 0,e.drawType),type:ut(r),numValues:0}}function Vr(t,e){const n={};return Object.keys(e).forEach(function(r){if(!Kt(r)){const i=e[r],s=i.attrib||i.name||i.attribName||Wt.attribPrefix+r;if(i.value){if(!Array.isArray(i.value)&&!Ae(i.value))throw new Error("array.value is not array or typedarray");n[s]={value:i.value}}else{let a;i.buffer&&i.buffer instanceof WebGLBuffer?a=$r:typeof i=="number"||typeof i.data=="number"?a=Gr:a=kr;const{buffer:o,type:l,numValues:c,arrayType:d}=a(t,i,r),f=i.normalize!==void 0?i.normalize:Lr(d),h=Mr(i,r,c);n[s]={buffer:o,numComponents:h,type:l,normalize:f,stride:i.stride||0,offset:i.offset||0,divisor:i.divisor===void 0?void 0:i.divisor,drawType:i.drawType}}}}),t.bindBuffer(Z,null),n}function Hr(t,e){return e===Sr||e===Cr?1:e===Rr||e===Fr?2:e===Ir||e===Pr||e===Yt?4:0}const Ve=["position","positions","a_position"];function Xr(t,e){let n,r;for(r=0;r<Ve.length&&(n=Ve[r],!(n in e||(n=Wt.attribPrefix+n,n in e)));++r);r===Ve.length&&(n=Object.keys(e)[0]);const i=e[n];if(!i.buffer)return 1;t.bindBuffer(Z,i.buffer);const s=t.getBufferParameter(Z,Tr);t.bindBuffer(Z,null);const a=Hr(t,i.type),o=s/a,l=i.numComponents||i.size,c=o/l;if(c%1!==0)throw new Error(`numComponents ${l} not correct for length ${length}`);return c}function Yr(t,e,n){const r=Vr(t,e),i=Object.assign({},n||{});i.attribs=Object.assign({},n?n.attribs:{},r);const s=e.indices;if(s){const a=Jt(s,"indices");i.indices=jt(t,a,wr),i.numElements=a.length,i.elementType=ut(a)}else i.numElements||(i.numElements=Xr(t,i.attribs));return i}function fe(t){return!!t.texStorage2D}const _e=function(){const t={},e={};function n(r){const i=r.constructor.name;if(!t[i]){for(const s in r)if(typeof r[s]=="number"){const a=e[r[s]];e[r[s]]=a?`${a} | ${s}`:s}t[i]=!0}}return function(i,s){return n(i),e[s]||(typeof s=="number"?`0x${s.toString(16)}`:s)}}(),V={textureColor:new Uint8Array([128,192,255,255]),textureOptions:{},crossOrigin:void 0},ue=Ae,qt=function(){let t;return function(){return t=t||(typeof document<"u"&&document.createElement?document.createElement("canvas").getContext("2d"):null),t}}(),Ct=6406,U=6407,w=6408,Rt=6409,Ft=6410,oe=6402,It=34041,we=33071,Wr=9728,jr=9729,H=3553,k=34067,Q=32879,ee=35866,ht=34069,Kr=34070,Jr=34071,qr=34072,Zr=34073,Qr=34074,je=10241,Ke=10240,Te=10242,Se=10243,Pt=32882,ei=33082,ti=33083,ni=33084,ri=33085,ii=34892,si=34893,mt=3317,Zt=3314,Qt=32878,en=3316,tn=3315,nn=32877,oi=37443,ai=37441,li=37440,ci=33321,ui=36756,di=33325,fi=33326,hi=33330,mi=33329,pi=33338,xi=33337,vi=33340,bi=33339,yi=33323,gi=36757,Ei=33327,Ai=33328,_i=33336,wi=33335,Ti=33332,Si=33331,Ci=33334,Ri=33333,Fi=32849,Ii=35905,Pi=36194,Di=36758,Li=35898,Bi=35901,Ui=34843,zi=34837,Oi=36221,Mi=36239,Ni=36215,$i=36233,Gi=36209,ki=36227,Vi=32856,Hi=35907,Xi=36759,Yi=32855,Wi=32854,ji=32857,Ki=34842,Ji=34836,qi=36220,Zi=36238,Qi=36975,es=36214,ts=36232,ns=36226,rs=36208,is=33189,ss=33190,os=36012,as=36013,ls=35056,$=5120,_=5121,pe=5122,te=5123,xe=5124,j=5125,F=5126,Dt=32819,Lt=32820,Bt=33635,L=5131,ae=36193,He=33640,cs=35899,us=35902,ds=36269,fs=34042,ve=33319,ne=33320,be=6403,re=36244,ie=36248,K=36249;let Xe;function Ie(t){if(!Xe){const e={};e[Ct]={textureFormat:Ct,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[_,L,ae,F]},e[Rt]={textureFormat:Rt,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[_,L,ae,F]},e[Ft]={textureFormat:Ft,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2,4,4,8],type:[_,L,ae,F]},e[U]={textureFormat:U,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,6,6,12,2],type:[_,L,ae,F,Bt]},e[w]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,8,8,16,2,2],type:[_,L,ae,F,Dt,Lt]},e[oe]={textureFormat:oe,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[j,te]},e[ci]={textureFormat:be,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1],type:[_]},e[ui]={textureFormat:be,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[1],type:[$]},e[di]={textureFormat:be,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4,2],type:[F,L]},e[fi]={textureFormat:be,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[4],type:[F]},e[hi]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[_]},e[mi]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[$]},e[Ti]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[te]},e[Si]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[pe]},e[Ci]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[j]},e[Ri]={textureFormat:re,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[xe]},e[yi]={textureFormat:ve,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2],type:[_]},e[gi]={textureFormat:ve,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[2],type:[$]},e[Ei]={textureFormat:ve,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[8,4],type:[F,L]},e[Ai]={textureFormat:ve,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[8],type:[F]},e[_i]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[_]},e[wi]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[$]},e[pi]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[te]},e[xi]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[pe]},e[vi]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[j]},e[bi]={textureFormat:ne,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[xe]},e[Fi]={textureFormat:U,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3],type:[_]},e[Ii]={textureFormat:U,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[_]},e[Pi]={textureFormat:U,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,2],type:[_,Bt]},e[Di]={textureFormat:U,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[$]},e[Li]={textureFormat:U,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[F,L,cs]},e[Bi]={textureFormat:U,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[F,L,us]},e[Ui]={textureFormat:U,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6],type:[F,L]},e[zi]={textureFormat:U,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[F]},e[Oi]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[_]},e[Mi]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[$]},e[Ni]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[te]},e[$i]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[pe]},e[Gi]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[j]},e[ki]={textureFormat:ie,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[xe]},e[Vi]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[_]},e[Hi]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[_]},e[Xi]={textureFormat:w,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4],type:[$]},e[Yi]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2,4],type:[_,Lt,He]},e[Wi]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2],type:[_,Dt]},e[ji]={textureFormat:w,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[He]},e[Ki]={textureFormat:w,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[16,8],type:[F,L]},e[Ji]={textureFormat:w,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[16],type:[F]},e[qi]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[_]},e[Zi]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[$]},e[Qi]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[He]},e[es]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[te]},e[ts]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[pe]},e[ns]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[xe]},e[rs]={textureFormat:K,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[j]},e[is]={textureFormat:oe,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[te,j]},e[ss]={textureFormat:oe,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[j]},e[os]={textureFormat:oe,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[F]},e[ls]={textureFormat:It,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[fs]},e[as]={textureFormat:It,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ds]},Object.keys(e).forEach(function(n){const r=e[n];r.bytesPerElementMap={},r.bytesPerElement.forEach(function(i,s){const a=r.type[s];r.bytesPerElementMap[a]=i})}),Xe=e}return Xe[t]}function hs(t,e){const n=Ie(t);if(!n)throw"unknown internal format";const r=n.bytesPerElementMap[e];if(r===void 0)throw"unknown internal format";return r}function he(t){const e=Ie(t);if(!e)throw"unknown internal format";return{format:e.textureFormat,type:e.type[0]}}function Ut(t){return(t&t-1)===0}function ms(t,e,n,r){if(!fe(t))return Ut(e)&&Ut(n);const i=Ie(r);if(!i)throw"unknown internal format";return i.colorRenderable&&i.textureFilterable}function ps(t){const e=Ie(t);if(!e)throw"unknown internal format";return e.textureFilterable}function xs(t,e,n){return ue(e)?ut(e):n||_}function ye(t,e,n,r,i){if(i%1!==0)throw"can't guess dimensions";if(!n&&!r){const s=Math.sqrt(i/(e===k?6:1));s%1===0?(n=s,r=s):(n=i,r=1)}else if(r){if(!n&&(n=i/r,n%1))throw"can't guess dimensions"}else if(r=i/n,r%1)throw"can't guess dimensions";return{width:n,height:r}}function se(t,e){e.colorspaceConversion!==void 0&&t.pixelStorei(oi,e.colorspaceConversion),e.premultiplyAlpha!==void 0&&t.pixelStorei(ai,e.premultiplyAlpha),e.flipY!==void 0&&t.pixelStorei(li,e.flipY)}function rn(t){t.pixelStorei(mt,4),fe(t)&&(t.pixelStorei(Zt,0),t.pixelStorei(Qt,0),t.pixelStorei(en,0),t.pixelStorei(tn,0),t.pixelStorei(nn,0))}function vs(t,e,n,r){r.minMag&&(n.call(t,e,je,r.minMag),n.call(t,e,Ke,r.minMag)),r.min&&n.call(t,e,je,r.min),r.mag&&n.call(t,e,Ke,r.mag),r.wrap&&(n.call(t,e,Te,r.wrap),n.call(t,e,Se,r.wrap),(e===Q||_r(t,e))&&n.call(t,e,Pt,r.wrap)),r.wrapR&&n.call(t,e,Pt,r.wrapR),r.wrapS&&n.call(t,e,Te,r.wrapS),r.wrapT&&n.call(t,e,Se,r.wrapT),r.minLod!==void 0&&n.call(t,e,ei,r.minLod),r.maxLod!==void 0&&n.call(t,e,ti,r.maxLod),r.baseLevel!==void 0&&n.call(t,e,ni,r.baseLevel),r.maxLevel!==void 0&&n.call(t,e,ri,r.maxLevel),r.compareFunc!==void 0&&n.call(t,e,si,r.compareFunc),r.compareMode!==void 0&&n.call(t,e,ii,r.compareMode)}function sn(t,e,n){const r=n.target||H;t.bindTexture(r,e),vs(t,r,t.texParameteri,n)}function bs(t){return t=t||V.textureColor,ue(t)?t:new Uint8Array([t[0]*255,t[1]*255,t[2]*255,t[3]*255])}function Je(t,e,n,r,i,s){n=n||V.textureOptions,s=s||w;const a=n.target||H;if(r=r||n.width,i=i||n.height,t.bindTexture(a,e),ms(t,r,i,s))t.generateMipmap(a);else{const o=ps(s)?jr:Wr;t.texParameteri(a,je,o),t.texParameteri(a,Ke,o),t.texParameteri(a,Te,we),t.texParameteri(a,Se,we)}}function de(t){return t.auto===!0||t.auto===void 0&&t.level===void 0}function qe(t,e){return e=e||{},e.cubeFaceOrder||[ht,Kr,Jr,qr,Zr,Qr]}function Ze(t,e){const r=qe(t,e).map(function(i,s){return{face:i,ndx:s}});return r.sort(function(i,s){return i.face-s.face}),r}function on(t,e,n,r){r=r||V.textureOptions;const i=r.target||H,s=r.level||0;let a=n.width,o=n.height;const l=r.internalFormat||r.format||w,c=he(l),d=r.format||c.format,f=r.type||c.type;if(se(t,r),t.bindTexture(i,e),i===k){const h=n.width,m=n.height;let u,b;if(h/6===m)u=m,b=[0,0,1,0,2,0,3,0,4,0,5,0];else if(m/6===h)u=h,b=[0,0,0,1,0,2,0,3,0,4,0,5];else if(h/3===m/2)u=h/3,b=[0,0,1,0,2,0,0,1,1,1,2,1];else if(h/2===m/3)u=h/2,b=[0,0,1,0,0,1,1,1,0,2,1,2];else throw"can't figure out cube map from element: "+(n.src?n.src:n.nodeName);const E=qt();E?(E.canvas.width=u,E.canvas.height=u,a=u,o=u,Ze(t,r).forEach(function(p){const x=b[p.ndx*2+0]*u,y=b[p.ndx*2+1]*u;E.drawImage(n,x,y,u,u,0,0,u,u),t.texImage2D(p.face,s,l,d,f,E.canvas)}),E.canvas.width=1,E.canvas.height=1):typeof createImageBitmap<"u"&&(a=u,o=u,Ze(t,r).forEach(function(p){const x=b[p.ndx*2+0]*u,y=b[p.ndx*2+1]*u;t.texImage2D(p.face,s,l,u,u,0,d,f,null),createImageBitmap(n,x,y,u,u,{premultiplyAlpha:"none",colorSpaceConversion:"none"}).then(function(C){se(t,r),t.bindTexture(i,e),t.texImage2D(p.face,s,l,d,f,C),de(r)&&Je(t,e,r,a,o,l)})}))}else if(i===Q||i===ee){const h=Math.min(n.width,n.height),m=Math.max(n.width,n.height),u=m/h;if(u%1!==0)throw"can not compute 3D dimensions of element";const b=n.width===m?1:0,E=n.height===m?1:0;t.pixelStorei(mt,1),t.pixelStorei(Zt,n.width),t.pixelStorei(Qt,0),t.pixelStorei(nn,0),t.texImage3D(i,s,l,h,h,h,0,d,f,null);for(let p=0;p<u;++p){const x=p*h*b,y=p*h*E;t.pixelStorei(en,x),t.pixelStorei(tn,y),t.texSubImage3D(i,s,0,0,p,h,h,1,d,f,n)}rn(t)}else t.texImage2D(i,s,l,d,f,n);de(r)&&Je(t,e,r,a,o,l),sn(t,e,r)}function me(){}function ys(t){if(typeof document<"u"){const e=document.createElement("a");return e.href=t,e.hostname===location.hostname&&e.port===location.port&&e.protocol===location.protocol}else{const e=new URL(location.href).origin;return new URL(t,location.href).origin===e}}function gs(t,e){return e===void 0&&!ys(t)?"anonymous":e}function Es(t,e,n){n=n||me;let r;if(e=e!==void 0?e:V.crossOrigin,e=gs(t,e),typeof Image<"u"){r=new Image,e!==void 0&&(r.crossOrigin=e);const i=function(){r.removeEventListener("error",s),r.removeEventListener("load",a),r=null},s=function(){const l="couldn't load image: "+t;Ht(l),n(l,r),i()},a=function(){n(null,r),i()};return r.addEventListener("error",s),r.addEventListener("load",a),r.src=t,r}else if(typeof ImageBitmap<"u"){let i,s;const a=function(){n(i,s)},o={};e&&(o.mode="cors"),fetch(t,o).then(function(l){if(!l.ok)throw l;return l.blob()}).then(function(l){return createImageBitmap(l,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}).then(function(l){s=l,setTimeout(a)}).catch(function(l){i=l,setTimeout(a)}),r=null}return r}function an(t){return typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof ImageData<"u"&&t instanceof ImageData||typeof HTMLElement<"u"&&t instanceof HTMLElement}function pt(t,e,n){return an(t)?(setTimeout(function(){n(null,t)}),t):Es(t,e,n)}function xt(t,e,n){n=n||V.textureOptions;const r=n.target||H;if(t.bindTexture(r,e),n.color===!1)return;const i=bs(n.color);if(r===k)for(let s=0;s<6;++s)t.texImage2D(ht+s,0,w,1,1,0,w,_,i);else r===Q||r===ee?t.texImage3D(r,0,w,1,1,1,0,w,_,i):t.texImage2D(r,0,w,1,1,0,w,_,i)}function As(t,e,n,r){return r=r||me,n=n||V.textureOptions,xt(t,e,n),n=Object.assign({},n),pt(n.src,n.crossOrigin,function(s,a){s?r(s,e,a):(on(t,e,a,n),r(null,e,a))})}function _s(t,e,n,r){r=r||me;const i=n.src;if(i.length!==6)throw"there must be 6 urls for a cubemap";const s=n.level||0,a=n.internalFormat||n.format||w,o=he(a),l=n.format||o.format,c=n.type||_,d=n.target||H;if(d!==k)throw"target must be TEXTURE_CUBE_MAP";xt(t,e,n),n=Object.assign({},n);let f=6;const h=[],m=qe(t,n);let u;function b(E){return function(p,x){--f,p?h.push(p):x.width!==x.height?h.push("cubemap face img is not a square: "+x.src):(se(t,n),t.bindTexture(d,e),f===5?qe().forEach(function(y){t.texImage2D(y,s,a,l,c,x)}):t.texImage2D(E,s,a,l,c,x),de(n)&&t.generateMipmap(d)),f===0&&r(h.length?h:void 0,e,u)}}u=i.map(function(E,p){return pt(E,n.crossOrigin,b(m[p]))})}function ws(t,e,n,r){r=r||me;const i=n.src,s=n.internalFormat||n.format||w,a=he(s),o=n.format||a.format,l=n.type||_,c=n.target||ee;if(c!==Q&&c!==ee)throw"target must be TEXTURE_3D or TEXTURE_2D_ARRAY";xt(t,e,n),n=Object.assign({},n);let d=i.length;const f=[];let h;const m=n.level||0;let u=n.width,b=n.height;const E=i.length;let p=!0;function x(y){return function(C,D){if(--d,C)f.push(C);else{if(se(t,n),t.bindTexture(c,e),p){p=!1,u=n.width||D.width,b=n.height||D.height,t.texImage3D(c,m,s,u,b,E,0,o,l,null);for(let W=0;W<E;++W)t.texSubImage3D(c,m,0,0,W,u,b,1,o,l,D)}else{let W=D,M;(D.width!==u||D.height!==b)&&(M=qt(),W=M.canvas,M.canvas.width=u,M.canvas.height=b,M.drawImage(D,0,0,u,b)),t.texSubImage3D(c,m,0,0,y,u,b,1,o,l,W),M&&W===M.canvas&&(M.canvas.width=0,M.canvas.height=0)}de(n)&&t.generateMipmap(c)}d===0&&r(f.length?f:void 0,e,h)}}h=i.map(function(y,C){return pt(y,n.crossOrigin,x(C))})}function Ts(t,e,n,r){r=r||V.textureOptions;const i=r.target||H;t.bindTexture(i,e);let s=r.width,a=r.height,o=r.depth;const l=r.level||0,c=r.internalFormat||r.format||w,d=he(c),f=r.format||d.format,h=r.type||xs(t,n,d.type);if(ue(n))n instanceof Uint8ClampedArray&&(n=new Uint8Array(n.buffer));else{const E=Vt(h);n=new E(n)}const m=hs(c,h),u=n.byteLength/m;if(u%1)throw"length wrong size for format: "+_e(t,f);let b;if(i===Q||i===ee)if(!s&&!a&&!o){const E=Math.cbrt(u);if(E%1!==0)throw"can't guess cube size of array of numElements: "+u;s=E,a=E,o=E}else s&&(!a||!o)?(b=ye(t,i,a,o,u/s),a=b.width,o=b.height):a&&(!s||!o)?(b=ye(t,i,s,o,u/a),s=b.width,o=b.height):(b=ye(t,i,s,a,u/o),s=b.width,a=b.height);else b=ye(t,i,s,a,u),s=b.width,a=b.height;if(rn(t),t.pixelStorei(mt,r.unpackAlignment||1),se(t,r),i===k){const E=m/n.BYTES_PER_ELEMENT,p=u/6*E;Ze(t,r).forEach(x=>{const y=p*x.ndx,C=n.subarray(y,y+p);t.texImage2D(x.face,l,c,s,a,0,f,h,C)})}else i===Q||i===ee?t.texImage3D(i,l,c,s,a,o,0,f,h,n):t.texImage2D(i,l,c,s,a,0,f,h,n);return{width:s,height:a,depth:o,type:h}}function Ss(t,e,n){const r=n.target||H;t.bindTexture(r,e);const i=n.level||0,s=n.internalFormat||n.format||w,a=he(s),o=n.format||a.format,l=n.type||a.type;if(se(t,n),r===k)for(let c=0;c<6;++c)t.texImage2D(ht+c,i,s,n.width,n.height,0,o,l,null);else r===Q||r===ee?t.texImage3D(r,i,s,n.width,n.height,n.depth,0,o,l,null):t.texImage2D(r,i,s,n.width,n.height,0,o,l,null)}function Cs(t,e,n){n=n||me,e=e||V.textureOptions;const r=t.createTexture(),i=e.target||H;let s=e.width||1,a=e.height||1;const o=e.internalFormat||w;t.bindTexture(i,r),i===k&&(t.texParameteri(i,Te,we),t.texParameteri(i,Se,we));let l=e.src;if(l)if(typeof l=="function"&&(l=l(t,e)),typeof l=="string")As(t,r,e,n);else if(ue(l)||Array.isArray(l)&&(typeof l[0]=="number"||Array.isArray(l[0])||ue(l[0]))){const c=Ts(t,r,l,e);s=c.width,a=c.height}else Array.isArray(l)&&(typeof l[0]=="string"||an(l[0]))?i===k?_s(t,r,e,n):ws(t,r,e,n):(on(t,r,l,e),s=l.width,a=l.height);else Ss(t,r,e);return de(e)&&Je(t,r,e,s,a,o),sn(t,r,e),r}const vt=Ht;function ln(t){return typeof document<"u"&&document.getElementById?document.getElementById(t):null}const Ce=33984,Pe=34962,Rs=35713,Fs=35714,Is=35632,Ps=35633,Ds=35981,cn=35718,Ls=35721,Bs=35971,Us=35382,zs=35396,Os=35398,Ms=35392,Ns=35395,De=5126,un=35664,dn=35665,fn=35666,bt=5124,hn=35667,mn=35668,pn=35669,xn=35670,vn=35671,bn=35672,yn=35673,gn=35674,En=35675,An=35676,$s=35678,Gs=35680,ks=35679,Vs=35682,Hs=35685,Xs=35686,Ys=35687,Ws=35688,js=35689,Ks=35690,Js=36289,qs=36292,Zs=36293,yt=5125,_n=36294,wn=36295,Tn=36296,Qs=36298,eo=36299,to=36300,no=36303,ro=36306,io=36307,so=36308,oo=36311,Le=3553,Be=34067,gt=32879,Ue=35866,g={};function Sn(t,e){return g[e].bindPoint}function ao(t,e){return function(n){t.uniform1f(e,n)}}function lo(t,e){return function(n){t.uniform1fv(e,n)}}function co(t,e){return function(n){t.uniform2fv(e,n)}}function uo(t,e){return function(n){t.uniform3fv(e,n)}}function fo(t,e){return function(n){t.uniform4fv(e,n)}}function Cn(t,e){return function(n){t.uniform1i(e,n)}}function Rn(t,e){return function(n){t.uniform1iv(e,n)}}function Fn(t,e){return function(n){t.uniform2iv(e,n)}}function In(t,e){return function(n){t.uniform3iv(e,n)}}function Pn(t,e){return function(n){t.uniform4iv(e,n)}}function ho(t,e){return function(n){t.uniform1ui(e,n)}}function mo(t,e){return function(n){t.uniform1uiv(e,n)}}function po(t,e){return function(n){t.uniform2uiv(e,n)}}function xo(t,e){return function(n){t.uniform3uiv(e,n)}}function vo(t,e){return function(n){t.uniform4uiv(e,n)}}function bo(t,e){return function(n){t.uniformMatrix2fv(e,!1,n)}}function yo(t,e){return function(n){t.uniformMatrix3fv(e,!1,n)}}function go(t,e){return function(n){t.uniformMatrix4fv(e,!1,n)}}function Eo(t,e){return function(n){t.uniformMatrix2x3fv(e,!1,n)}}function Ao(t,e){return function(n){t.uniformMatrix3x2fv(e,!1,n)}}function _o(t,e){return function(n){t.uniformMatrix2x4fv(e,!1,n)}}function wo(t,e){return function(n){t.uniformMatrix4x2fv(e,!1,n)}}function To(t,e){return function(n){t.uniformMatrix3x4fv(e,!1,n)}}function So(t,e){return function(n){t.uniformMatrix4x3fv(e,!1,n)}}function I(t,e,n,r){const i=Sn(t,e);return fe(t)?function(s){let a,o;!s||dt(t,s)?(a=s,o=null):(a=s.texture,o=s.sampler),t.uniform1i(r,n),t.activeTexture(Ce+n),t.bindTexture(i,a),t.bindSampler(n,o)}:function(s){t.uniform1i(r,n),t.activeTexture(Ce+n),t.bindTexture(i,s)}}function P(t,e,n,r,i){const s=Sn(t,e),a=new Int32Array(i);for(let o=0;o<i;++o)a[o]=n+o;return fe(t)?function(o){t.uniform1iv(r,a),o.forEach(function(l,c){t.activeTexture(Ce+a[c]);let d,f;!l||dt(t,l)?(d=l,f=null):(d=l.texture,f=l.sampler),t.bindSampler(n,f),t.bindTexture(s,d)})}:function(o){t.uniform1iv(r,a),o.forEach(function(l,c){t.activeTexture(Ce+a[c]),t.bindTexture(s,l)})}}g[De]={Type:Float32Array,size:4,setter:ao,arraySetter:lo};g[un]={Type:Float32Array,size:8,setter:co,cols:2};g[dn]={Type:Float32Array,size:12,setter:uo,cols:3};g[fn]={Type:Float32Array,size:16,setter:fo,cols:4};g[bt]={Type:Int32Array,size:4,setter:Cn,arraySetter:Rn};g[hn]={Type:Int32Array,size:8,setter:Fn,cols:2};g[mn]={Type:Int32Array,size:12,setter:In,cols:3};g[pn]={Type:Int32Array,size:16,setter:Pn,cols:4};g[yt]={Type:Uint32Array,size:4,setter:ho,arraySetter:mo};g[_n]={Type:Uint32Array,size:8,setter:po,cols:2};g[wn]={Type:Uint32Array,size:12,setter:xo,cols:3};g[Tn]={Type:Uint32Array,size:16,setter:vo,cols:4};g[xn]={Type:Uint32Array,size:4,setter:Cn,arraySetter:Rn};g[vn]={Type:Uint32Array,size:8,setter:Fn,cols:2};g[bn]={Type:Uint32Array,size:12,setter:In,cols:3};g[yn]={Type:Uint32Array,size:16,setter:Pn,cols:4};g[gn]={Type:Float32Array,size:32,setter:bo,rows:2,cols:2};g[En]={Type:Float32Array,size:48,setter:yo,rows:3,cols:3};g[An]={Type:Float32Array,size:64,setter:go,rows:4,cols:4};g[Hs]={Type:Float32Array,size:32,setter:Eo,rows:2,cols:3};g[Xs]={Type:Float32Array,size:32,setter:_o,rows:2,cols:4};g[Ys]={Type:Float32Array,size:48,setter:Ao,rows:3,cols:2};g[Ws]={Type:Float32Array,size:48,setter:To,rows:3,cols:4};g[js]={Type:Float32Array,size:64,setter:wo,rows:4,cols:2};g[Ks]={Type:Float32Array,size:64,setter:So,rows:4,cols:3};g[$s]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Le};g[Gs]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Be};g[ks]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:gt};g[Vs]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Le};g[Js]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Ue};g[qs]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Ue};g[Zs]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Be};g[Qs]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Le};g[eo]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:gt};g[to]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Be};g[no]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Ue};g[ro]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Le};g[io]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:gt};g[so]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Be};g[oo]={Type:null,size:0,setter:I,arraySetter:P,bindPoint:Ue};function ze(t,e){return function(n){if(n.value)switch(t.disableVertexAttribArray(e),n.value.length){case 4:t.vertexAttrib4fv(e,n.value);break;case 3:t.vertexAttrib3fv(e,n.value);break;case 2:t.vertexAttrib2fv(e,n.value);break;case 1:t.vertexAttrib1fv(e,n.value);break;default:throw new Error("the length of a float constant value must be between 1 and 4!")}else t.bindBuffer(Pe,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n.numComponents||n.size,n.type||De,n.normalize||!1,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function X(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4iv(e,n.value);else throw new Error("The length of an integer constant value must be 4!");else t.bindBuffer(Pe,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||bt,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function Oe(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4uiv(e,n.value);else throw new Error("The length of an unsigned integer constant value must be 4!");else t.bindBuffer(Pe,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||yt,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function Et(t,e,n){const r=n.size,i=n.count;return function(s){t.bindBuffer(Pe,s.buffer);const a=s.size||s.numComponents||r,o=a/i,l=s.type||De,d=g[l].size*a,f=s.normalize||!1,h=s.offset||0,m=d/i;for(let u=0;u<i;++u)t.enableVertexAttribArray(e+u),t.vertexAttribPointer(e+u,o,l,f,d,h+m*u),t.vertexAttribDivisor&&t.vertexAttribDivisor(e+u,s.divisor||0)}}const S={};S[De]={size:4,setter:ze};S[un]={size:8,setter:ze};S[dn]={size:12,setter:ze};S[fn]={size:16,setter:ze};S[bt]={size:4,setter:X};S[hn]={size:8,setter:X};S[mn]={size:12,setter:X};S[pn]={size:16,setter:X};S[yt]={size:4,setter:Oe};S[_n]={size:8,setter:Oe};S[wn]={size:12,setter:Oe};S[Tn]={size:16,setter:Oe};S[xn]={size:4,setter:X};S[vn]={size:8,setter:X};S[bn]={size:12,setter:X};S[yn]={size:16,setter:X};S[gn]={size:4,setter:Et,count:2};S[En]={size:9,setter:Et,count:3};S[An]={size:16,setter:Et,count:4};const Co=/ERROR:\s*\d+:(\d+)/gi;function Ro(t,e="",n=0){const r=[...e.matchAll(Co)],i=new Map(r.map((s,a)=>{const o=parseInt(s[1]),l=r[a+1],c=l?l.index:e.length,d=e.substring(s.index,c);return[o-1,d]}));return t.split(`
`).map((s,a)=>{const o=i.get(a);return`${a+1+n}: ${s}${o?`

^^^ ${o}`:""}`}).join(`
`)}const zt=/^[ \t]*\n/;function Dn(t){let e=0;return zt.test(t)&&(e=1,t=t.replace(zt,"")),{lineOffset:e,shaderSource:t}}function Fo(t,e){return t.errorCallback(e),t.callback&&setTimeout(()=>{t.callback(`${e}
${t.errors.join(`
`)}`)}),null}function Io(t,e,n,r){if(r=r||vt,!t.getShaderParameter(n,Rs)){const s=t.getShaderInfoLog(n),{lineOffset:a,shaderSource:o}=Dn(t.getShaderSource(n)),l=`${Ro(o,s,a)}
Error compiling ${_e(t,e)}: ${s}`;return r(l),l}return""}function At(t,e,n){let r,i,s;if(typeof e=="function"&&(n=e,e=void 0),typeof t=="function")n=t,t=void 0;else if(t&&!Array.isArray(t)){const c=t;n=c.errorCallback,t=c.attribLocations,r=c.transformFeedbackVaryings,i=c.transformFeedbackMode,s=c.callback}const a=n||vt,o=[],l={errorCallback(c,...d){o.push(c),a(c,...d)},transformFeedbackVaryings:r,transformFeedbackMode:i,callback:s,errors:o};{let c={};Array.isArray(t)?t.forEach(function(d,f){c[d]=e?e[f]:f}):c=t||{},l.attribLocations=c}return l}const Po=["VERTEX_SHADER","FRAGMENT_SHADER"];function Do(t,e){if(e.indexOf("frag")>=0)return Is;if(e.indexOf("vert")>=0)return Ps}function Lo(t,e,n){const r=t.getAttachedShaders(e);for(const i of r)n.has(i)&&t.deleteShader(i);t.deleteProgram(e)}const Bo=(t=0)=>new Promise(e=>setTimeout(e,t));function Uo(t,e,n){const r=t.createProgram(),{attribLocations:i,transformFeedbackVaryings:s,transformFeedbackMode:a}=At(n);for(let o=0;o<e.length;++o){let l=e[o];if(typeof l=="string"){const c=ln(l),d=c?c.text:l;let f=t[Po[o]];c&&c.type&&(f=Do(t,c.type)||f),l=t.createShader(f),t.shaderSource(l,Dn(d).shaderSource),t.compileShader(l),t.attachShader(r,l)}}Object.entries(i).forEach(([o,l])=>t.bindAttribLocation(r,l,o));{let o=s;o&&(o.attribs&&(o=o.attribs),Array.isArray(o)||(o=Object.keys(o)),t.transformFeedbackVaryings(r,o,a||Ds))}return t.linkProgram(r),r}function zo(t,e,n,r,i){const s=At(n,r,i),a=new Set(e),o=Uo(t,e,s);function l(c,d){const f=Mo(c,d,s.errorCallback);return f&&Lo(c,d,a),f}if(s.callback){Oo(t,o).then(()=>{const c=l(t,o);s.callback(c,c?void 0:o)});return}return l(t,o)?void 0:o}async function Oo(t,e){const n=t.getExtension("KHR_parallel_shader_compile"),r=n?(s,a)=>s.getProgramParameter(a,n.COMPLETION_STATUS_KHR):()=>!0;let i=0;do await Bo(i),i=1e3/60;while(!r(t,e))}function Mo(t,e,n){if(n=n||vt,!t.getProgramParameter(e,Fs)){const i=t.getProgramInfoLog(e);n(`Error in program linking: ${i}`);const a=t.getAttachedShaders(e).map(o=>Io(t,t.getShaderParameter(o,t.SHADER_TYPE),o,n));return`${i}
${a.filter(o=>o).join(`
`)}`}}function No(t,e,n,r,i){return zo(t,e,n,r,i)}function Ln(t){const e=t.name;return e.startsWith("gl_")||e.startsWith("webgl_")}const $o=/(\.|\[|]|\w+)/g,Go=t=>t>="0"&&t<="9";function ko(t,e,n,r){const i=t.split($o).filter(o=>o!=="");let s=0,a="";for(;;){const o=i[s++];a+=o;const l=Go(o[0]),c=l?parseInt(o):o;if(l&&(a+=i[s++]),s===i.length){n[c]=e;break}else{const f=i[s++],h=f==="[",m=n[c]||(h?[]:{});n[c]=m,n=m,r[a]=r[a]||function(u){return function(b){Bn(u,b)}}(m),a+=f}}}function Vo(t,e){let n=0;function r(o,l,c){const d=l.name.endsWith("[0]"),f=l.type,h=g[f];if(!h)throw new Error(`unknown type: 0x${f.toString(16)}`);let m;if(h.bindPoint){const u=n;n+=l.size,d?m=h.arraySetter(t,f,u,c,l.size):m=h.setter(t,f,u,c,l.size)}else h.arraySetter&&d?m=h.arraySetter(t,c):m=h.setter(t,c);return m.location=c,m}const i={},s={},a=t.getProgramParameter(e,cn);for(let o=0;o<a;++o){const l=t.getActiveUniform(e,o);if(Ln(l))continue;let c=l.name;c.endsWith("[0]")&&(c=c.substr(0,c.length-3));const d=t.getUniformLocation(e,l.name);if(d){const f=r(e,l,d);i[c]=f,ko(c,f,s,i)}}return i}function Ho(t,e){const n={},r=t.getProgramParameter(e,Bs);for(let i=0;i<r;++i){const s=t.getTransformFeedbackVarying(e,i);n[s.name]={index:i,type:s.type,size:s.size}}return n}function Xo(t,e){const n=t.getProgramParameter(e,cn),r=[],i=[];for(let o=0;o<n;++o){i.push(o),r.push({});const l=t.getActiveUniform(e,o);r[o].name=l.name}[["UNIFORM_TYPE","type"],["UNIFORM_SIZE","size"],["UNIFORM_BLOCK_INDEX","blockNdx"],["UNIFORM_OFFSET","offset"]].forEach(function(o){const l=o[0],c=o[1];t.getActiveUniforms(e,i,t[l]).forEach(function(d,f){r[f][c]=d})});const s={},a=t.getProgramParameter(e,Us);for(let o=0;o<a;++o){const l=t.getActiveUniformBlockName(e,o),c={index:t.getUniformBlockIndex(e,l),usedByVertexShader:t.getActiveUniformBlockParameter(e,o,zs),usedByFragmentShader:t.getActiveUniformBlockParameter(e,o,Os),size:t.getActiveUniformBlockParameter(e,o,Ms),uniformIndices:t.getActiveUniformBlockParameter(e,o,Ns)};c.used=c.usedByVertexShader||c.usedByFragmentShader,s[l]=c}return{blockSpecs:s,uniformData:r}}function Bn(t,e){for(const n in e){const r=t[n];typeof r=="function"?r(e[n]):Bn(t[n],e[n])}}function Yo(t,e){const n={},r=t.getProgramParameter(e,Ls);for(let i=0;i<r;++i){const s=t.getActiveAttrib(e,i);if(Ln(s))continue;const a=t.getAttribLocation(e,s.name),o=S[s.type],l=o.setter(t,a,o);l.location=a,n[s.name]=l}return n}function Ot(t,e){const n=Vo(t,e),r=Yo(t,e),i={program:e,uniformSetters:n,attribSetters:r};return fe(t)&&(i.uniformBlockSpec=Xo(t,e),i.transformFeedbackInfo=Ho(t,e)),i}const Wo=/\s|{|}|;/;function O(t,e,n,r,i){const s=At(n,r,i),a=[];if(e=e.map(function(c){if(!Wo.test(c)){const d=ln(c);if(d)c=d.text;else{const f=`no element with id: ${c}`;s.errorCallback(f),a.push(f)}}return c}),a.length)return Fo(s,"");const o=s.callback;o&&(s.callback=(c,d)=>{o(c,c?void 0:Ot(t,d))});const l=No(t,e,s);return l?Ot(t,l):null}const jo=36160,ge=36161,Ko=3553,Jo=5121,qo=6402,Zo=6408,Qo=33190,ea=36012,ta=35056,na=36013,ra=32854,ia=32855,sa=36194,Un=33189,zn=6401,On=36168,_t=34041,Qe=36064,Me=36096,Mn=36128,wt=33306,et=33071,tt=9729,oa=[{format:Zo,type:Jo,min:tt,wrap:et},{format:_t}],B={};B[_t]=wt;B[zn]=Mn;B[On]=Mn;B[qo]=Me;B[Un]=Me;B[Qo]=Me;B[ea]=Me;B[ta]=wt;B[na]=wt;function aa(t,e){return B[t]||B[e]}const Y={};Y[ra]=!0;Y[ia]=!0;Y[sa]=!0;Y[_t]=!0;Y[Un]=!0;Y[zn]=!0;Y[On]=!0;function la(t){return Y[t]}const ca=32;function ua(t){return t>=Qe&&t<Qe+ca}function J(t,e,n,r){const i=jo,s=t.createFramebuffer();t.bindFramebuffer(i,s),n=n||t.drawingBufferWidth,r=r||t.drawingBufferHeight,e=e||oa;const a=[],o={framebuffer:s,attachments:[],width:n,height:r};return e.forEach(function(l,c){let d=l.attachment;const f=l.samples,h=l.format;let m=l.attachmentPoint||aa(h,l.internalFormat);if(m||(m=Qe+c),ua(m)&&a.push(m),!d)if(f!==void 0||la(h))d=t.createRenderbuffer(),t.bindRenderbuffer(ge,d),f>1?t.renderbufferStorageMultisample(ge,f,h,n,r):t.renderbufferStorage(ge,h,n,r);else{const u=Object.assign({},l);u.width=n,u.height=r,u.auto===void 0&&(u.auto=!1,u.min=u.min||u.minMag||tt,u.mag=u.mag||u.minMag||tt,u.wrapS=u.wrapS||u.wrap||et,u.wrapT=u.wrapT||u.wrap||et),d=Cs(t,u)}if(Ar(t,d))t.framebufferRenderbuffer(i,m,ge,d);else if(dt(t,d))l.layer!==void 0?t.framebufferTextureLayer(i,m,d,l.level||0,l.layer):t.framebufferTexture2D(i,m,l.target||Ko,d,l.level||0);else throw new Error("unknown attachment type");o.attachments.push(d)}),t.drawBuffers&&t.drawBuffers(a),o}const da=/^(.*?)_/;function fa(t,e){_e(t,0);const n=t.getExtension(e);if(n){const r={},i=da.exec(e)[1],s="_"+i;for(const a in n){const o=n[a],l=typeof o=="function",c=l?i:s;let d=a;a.endsWith(c)&&(d=a.substring(0,a.length-c.length)),t[d]!==void 0?!l&&t[d]!==o&&gr(d,t[d],o,a):l?t[d]=function(f){return function(){return f.apply(n,arguments)}}(o):(t[d]=o,r[d]=o)}r.constructor={name:n.constructor.name},_e(r,0)}return n}const Mt=["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_color_buffer_float","EXT_color_buffer_half_float","EXT_disjoint_timer_query","EXT_disjoint_timer_query_webgl2","EXT_frag_depth","EXT_sRGB","EXT_shader_texture_lod","EXT_texture_filter_anisotropic","OES_element_index_uint","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_color_buffer_float","WEBGL_compressed_texture_atc","WEBGL_compressed_texture_etc1","WEBGL_compressed_texture_pvrtc","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_depth_texture","WEBGL_draw_buffers"];function ha(t){for(let e=0;e<Mt.length;++e)fa(t,Mt[e])}Number.prototype.clamp=function(t,e){return Math.min(Math.max(this,t),e)};Number.prototype.mix=function(t,e){return this*(1-e)+t*e};class ma{fetchUpdates(){const e=this.events;return this.events=[],e}getState(){return this.state}storeEvent(e){switch(e.frame=this.frame,e.type){case"blur":case"focusout":this.state={};break;case"keyup":delete this.state[e.key];break;case"keydown":this.state[e.key]||(this.state[e.key]={frame:this.frame});break;case"pointerup":case"pointermove":case"pointerdown":this.state.mouse={pos:e.pos,buttons:e.buttons};break;case"wheel":this.state.wheel||(this.state.wheel={y:0}),this.state.wheel.y+=e.deltaYl;break}}constructor(e){this.state={},this.frame=0,this.events=[],this.sizes={width:1,height:1},this.listeners=[],window.addEventListener("blur",i=>{this.storeEvent({type:i.type})}),window.addEventListener("focusout",i=>{this.storeEvent({type:i.type})}),window.addEventListener("keydown",i=>{const s=i.key.toLowerCase();s!=="f12"&&(i.preventDefault(),this.storeEvent({key:s,type:i.type}))}),window.addEventListener("keyup",i=>{const s=i.key.toLowerCase();i.preventDefault(),this.storeEvent({key:s,type:i.type})});const n=i=>{const{sizes:s}=this;if(i.target.className!=="webgl")return;const a=[(i.clientX-s.horizontalOffset)/s.width*2-1,-((i.clientY-s.verticalOffset)/s.height)*2+1];this.storeEvent({type:i.type,pos:a,buttons:i.buttons})},r=i=>{this.storeEvent({type:i.type,deltaY:i.deltaY})};window.addEventListener("wheel",r),window.addEventListener("pointerdown",n),window.addEventListener("pointerup",n),window.addEventListener("pointermove",n),window.addEventListener("contextmenu",i=>(i.preventDefault(),!1),!1),e.listeners.push(this),e.update()}updateTime({frame:e}){this.frame=e}updateSize(e){this.sizes=e}}function pa(){Array.prototype.peek=function(){return this.length?this[this.length-1]:null},Array.prototype.equals=function(t){if(!Array.isArray(t)||t.length!==this.length)return!1;for(var e=0;e<this.length;e++)if(this[e]!==t[e])return!1;return!0}}pa();class xa{constructor(){this.states=[]}stateParams(){return{}}cleanup(){for(;this.states.length;)this.cleanupState(this.states.pop())}currentState(){return this.states.peek()}addState(e){e.init(this),this.states.push(e)}cleanupState(e){e&&e.cleanup(this)}replaceState(e){this.cleanupState(this.states.pop()),this.addState(e)}pushState(e){var n;(n=this.currentState())==null||n.pause(),this.addState(e)}popState(){var e;this.cleanupState(this.states.pop()),(e=this.currentState())==null||e.resume()}}class va{constructor(){}init(e){}cleanup(){}pause(){}resume(){}}class Ee extends Array{constructor(e,n){super(),this.push(e,n)}distanceTo(e){const n=this[1].clone().sub(this[0]);n.len();const i=(e.clone().sub(this[0]).dot(n)/n.lenSq()).clamp(0,1);return this[0].clone().add(n.mul(i)).sub(e).len()}}const A=class A{constructor(e,n,r=null,i=null){this.x=e,this.y=n,r!==null?(this.z=r,i!==null?(this.w=i,this.length=4):this.length=3):this.length=2}copy(e){return this.x=e.x,this.y=e.y,this.length>3&&(this.w=e.w??0),this.length>2&&(this.z=e.z??0),this}add(e){const n=typeof e=="number";return this.x+=n?e:e.x,this.y+=n?e:e.y,this.length>2&&(this.z+=n?e:e.z??0),this.length>3&&(this.w+=n?e:e.w??0),this}sub(e){const n=typeof e=="number";return this.x-=n?e:e.x,this.y-=n?e:e.y,this.length>2&&(this.z-=n?e:e.z??0),this.length>3&&(this.w-=n?e:e.w??0),this}mul(e){const n=typeof e=="number";return this.x*=n?e:e.x,this.y*=n?e:e.y,this.length>2&&(this.z*=n?e:e.z??0),this.length>3&&(this.w*=n?e:e.w??0),this}dot(e){let n=0;return n+=this.x*e.x,n+=this.y*e.y,n+=(this.z??0)*(e.z??0),n+=(this.w??0)*(e.w??0),n}min(e){const n=typeof e=="number";return this.x=Math.min(this.x,n?e:e.x),this.y=Math.min(this.y,n?e:e.y),this.length>2&&(this.z=Math.min(this.z,n?e:e.z??0)),this.length>3&&(this.w=Math.min(this.w,n?e:e.w??0)),this}clamp(e,n){return this.x=this.x.clamp(e,n),this.y=this.y.clamp(e,n),this.length>2&&(this.z=this.z.clamp(e,n)),this.length>3&&(this.w=this.w.clamp(e,n)),this}max(e){const n=typeof e=="number";return this.x=Math.max(this.x,n?e:e.x),this.y=Math.max(this.y,n?e:e.y),this.length>2&&(this.z=Math.max(this.z,n?e:e.z??0)),this.length>3&&(this.w=Math.max(this.w,n?e:e.w??0)),this}normalize(){const e=this.dot(this);return this.x/=e,this.y/=e,this.length>2&&(this.z=Math.max(this.z,other.z??0)),this.length>3&&(this.w=Math.max(this.w,other.w??0)),this}cross(e){if(e.length===this.length){if(this.length===2)return this.x*e.y-this.y*e.x;if(this.length===3)return new A([this.y*e.z-this.z*e.y,this.z*e.x-this.x*e.z,this.x*e.y-this.y*e.x]);throw new Error("Can't do 4D cross (yet?)")}else throw new Error("Dimensions need to match for cross.")}len(){return Math.sqrt(this.lenSq())}lenSq(){return this.dot(this)}clone(){return new A(this.x,this.y,this.z!==void 0?this.z:null,this.w!==void 0?this.w:null)}};R(A,"X2",new A(1,0)),R(A,"X3",new A(1,0,0)),R(A,"X4",new A(1,0,0,0)),R(A,"Y2",new A(0,1)),R(A,"Y3",new A(0,1,0)),R(A,"Y4",new A(0,1,0,0)),R(A,"Z3",new A(0,0,1)),R(A,"Z4",new A(0,0,1,0)),R(A,"W4",new A(0,0,0,1)),R(A,"ONE2",new A(1,1)),R(A,"ONE3",new A(1,1,1)),R(A,"ONE4",new A(1,1,1,1)),R(A,"ZERO2",new A(0,0)),R(A,"ZERO3",new A(0,0,0)),R(A,"ZERO4",new A(0,0,0,0));let T=A;function Ye({min:t=0,max:e,steps:n=2}){return Math.floor(n*Math.random())/(n-1)*(e-t)+t}class Nn{constructor(){this.type=Object.getPrototypeOf(this).constructor}}class nt extends Nn{constructor(e,n){super(),this.playerIndex=e,this.direction=n}}class Nt extends Nn{constructor(e){super(),this.delta=e}}class ba extends va{update(e,n,r){const i=(r.w!==void 0)-+(r.s!==void 0),s=(r.arrowup!==void 0)-+(r.arrowdown!==void 0);e.commands.push(new nt(0,i)),e.commands.push(new nt(1,s))}}class $n extends xa{constructor(){super(),this.pushState(new ba)}init(){}update(e,n){var r;(r=this.currentState())==null||r.update(e,this,n)}}new $n;class ya{constructor(e){this.commands=[],this.data=e,e.listeners.push(this),this.data.state.ball&&(this.data.state.ball.size=.1),this.data.state.balls=this.setupBalls(),this.data.state.ball={position:new T(0,0),color:new T(1,1,1),size:.05,velocity:new T(.8,.4).mul(2)},this.data.state.paddles=[{position:new T(-1.9,0),size:new T(.02,.2),color:new T(1,0,0),direction:0},{position:new T(1.9,0),size:new T(.02,.2),color:new T(0,1,0),direction:0}],this.data.saveData(),this.activeColor=[1,1,1,1],this.currLine={start:[0,0],end:[0,0],color:this.activeColor}}setupBalls(){const e=[];for(var n=0;n<1;n++){const r=new T(Ye({max:1.2,min:-1.5,steps:200}),Ye({max:.95,min:-.95,steps:100}));e.push({origin:r,position:r.clone(),color:new T(0,0,0),size:Ye({max:.02,min:.01,steps:5})})}return e}configUpdated(){this.data.state.lines||(this.data.state.lines=[])}updateColor(e){this.activeColor=structuredClone(e),this.activeColor.push(1),this.currLine.color=this.activeColor}moveBall(e){const{ball:n}=this.data.state;n.position.x+=e*n.velocity.x,n.position.y+=e*n.velocity.y,Math.abs(n.position.x)+n.size>=2&&(n.velocity.x*=-1),Math.abs(n.position.y)+n.size>=1&&(n.velocity.y*=-1)}applyCommand(e){switch(e.type){case nt:this.data.state.paddles[e.playerIndex].direction=e.direction;break;case Nt:const{delta:n}=e,{ball:r,balls:i,paddles:s}=this.data.state;this.moveBall(n);for(let a=0;a<i.length;a++){const o=i[a];o.color.sub(T.ONE3.clone().mul(2*n)).max(T.ZERO3),o.position.clone().sub(r.position).len()<.15&&o.color.copy(r.color).mul(3)}for(let a=0;a<s.length;a++){const o=s[a];o.position.y+=n*o.direction*2,o.position.y=Math.min(Math.max(o.position.y,-1+o.size.y),1-o.size.y);const l=new T(o.size),c=new T(o.position).add(o.size),d=new T(o.position).sub(o.size),f=[new Ee(c.clone(),c.clone().sub(l.clone().mul(T.X2).mul(2))),new Ee(c.clone(),c.clone().sub(l.clone().mul(T.Y2).mul(2))),new Ee(d.clone(),d.clone().add(l.clone().mul(T.X2).mul(2))),new Ee(d.clone(),d.clone().add(l.clone().mul(T.Y2).mul(2)))];for(let h=0;h<f.length;h++)f[h].distanceTo(r.position)<r.size&&(r.color=o.color,Math.sign(r.velocity.x)!=Math.sign(.5-a)&&(r.velocity.x*=-1))}this.data.saveData();break}}update(e){this.commands.push(new Nt(e)),this.commands.forEach(n=>{this.applyCommand(n)}),this.commands.length=0}}var ga=`#version 300 es\r
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
    vec2 dir = vec2(cos(angle), -sin(angle)) / renderResolution;\r
    dir = normalize(dir);\r

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
}`,Ea=`#version 300 es\r
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
}`,Re=new ur;Re.showPanel(0);document.body.appendChild(Re.dom);const v=document.getElementById("webgl").getContext("webgl2");ha(v);const Aa={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}};Yr(v,Aa);const Ne=new or;Ne.init();const Gn=new Yn(2);new ma(Gn);new $n;const _a=new ya(Ne),N=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,wa=`#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`,Ta=`#version 300 es
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
`,Sa=`#version 300 es
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
`,kn=`#version 300 es
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

`,Ca=`#version 300 es
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
`,Ra=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = pow(texture(tPrev, uv), vec4(1./2.2));
}
`,Fa=`#version 300 es
in vec2 position;
in vec4 color;
in mat4 matrix;

out vec4 v_color;
  void main() {
    // Multiply the position by the matrix.
    gl_Position = matrix * vec4(position, 0.0, 1.0);
    v_color = color;
  }
`,Ia=`#version 300 es

precision mediump float;

in vec4 v_color;

out vec4 outColor;
void main() {
  outColor = v_color;
}`;O(v,[Fa,Ia]);O(v,[N,Ta]);O(v,[N,Ca]);O(v,[N,kn]);O(v,[N,kn]);O(v,[N,wa]);O(v,[N,Sa]);O(v,[N,Ra]);O(v,[N,ga]);O(v,[N,Ea]);Gn.listeners.push({updateSize:({width:t,height:e})=>{v.canvas.width=t,v.canvas.height=e}});Ne.addButton({name:"Save Image",fn:()=>{}});const G=8*128,q=G;J(v,[{internalFormat:v.RGBA8,format:v.RGBA,mag:v.LINEAR,min:v.LINEAR,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.R8,format:v.R,mag:v.LINEAR,min:v.LINEAR,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.RGB8,format:v.RGB,mag:v.NEAREST,min:v.NEAREST,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.RGB8,format:v.RGB,mag:v.NEAREST,min:v.NEAREST,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.RGBA32F,format:v.RGBA,mag:v.LINEAR,min:v.LINEAR,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.RGBA32F,format:v.RGBA,mag:v.LINEAR,min:v.LINEAR,wrap:v.CLAMP_TO_EDGE}],G,q),J(v,[{internalFormat:v.RGBA32F,format:v.RGBA,mag:v.LINEAR,min:v.LINEAR,wrap:v.CLAMP_TO_EDGE}],G,q);Ne.addColor({displayName:"Color",defaultValue:[1,1,1],callback:t=>{_a.commands.push(new UpdateColorCommand(t))}});v.getExtension("EXT_disjoint_timer_query_webgl2");v.createQuery();function Vn(t){Re.begin(),Re.end(),requestAnimationFrame(Vn)}requestAnimationFrame(Vn);
//# sourceMappingURL=index-3717668e.js.map
