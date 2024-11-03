var ti=Object.defineProperty;var ni=(t,e,n)=>e in t?ti(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var I=(t,e,n)=>(ni(t,typeof e!="symbol"?e+"":e,n),n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();class ri{constructor(e){this.sizes={width:window.innerWidth,height:window.innerHeight,buffer:0,aspect:e},this.listeners=[];const n=document.querySelector("div.container"),r=document.querySelector("div.relative");this.update=()=>{const{buffer:i}=this.sizes,o=window.innerHeight-2*i,s=window.innerWidth-2*i;o*this.sizes.aspect>s?(this.sizes.width=s,this.sizes.height=s/this.sizes.aspect,this.sizes.verticalOffset=i+(o-this.sizes.height)/2,this.sizes.horizontalOffset=i):(this.sizes.width=o*this.sizes.aspect,this.sizes.height=o,this.sizes.verticalOffset=i,this.sizes.horizontalOffset=i+(s-this.sizes.width)/2),r.style.top=this.sizes.verticalOffset.toString()+"px",r.style.left=this.sizes.horizontalOffset.toString()+"px",this.listeners.forEach(a=>{a.updateSize(this.sizes)})},window.addEventListener("resize",this.update),window.addEventListener("orientationchange",this.update),window.addEventListener("dblclick",i=>{if(i.target.className!=="webgl")return;document.fullscreenElement||document.webkitFullscreenElement?document.exitFullscreen():n.requestFullscreen()})}}/**
 * lil-gui
 * https://lil-gui.georgealways.com
 * @version 0.19.2
 * @author George Michael Brower
 * @license MIT
 */class re{constructor(e,n,r,i,o="div"){this.parent=e,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("controller"),this.domElement.classList.add(i),this.$name=document.createElement("div"),this.$name.classList.add("name"),re.nextNameID=re.nextNameID||0,this.$name.id=`lil-gui-name-${++re.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const n=this.parent.add(this.object,this.property,e);return n.name(this._name),this.destroy(),n}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class ii extends re{constructor(e,n,r){super(e,n,r,"boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function $t(t){let e,n;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?n=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),n?"#"+n:!1}const oi={isPrimitive:!0,match:t=>typeof t=="string",fromHexString:$t,toHexString:$t},Ue={isPrimitive:!0,match:t=>typeof t=="number",fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},si={isPrimitive:!1,match:t=>Array.isArray(t),fromHexString(t,e,n=1){const r=Ue.fromHexString(t);e[0]=(r>>16&255)/255*n,e[1]=(r>>8&255)/255*n,e[2]=(r&255)/255*n},toHexString([t,e,n],r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return Ue.toHexString(i)}},ai={isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,e,n=1){const r=Ue.fromHexString(t);e.r=(r>>16&255)/255*n,e.g=(r>>8&255)/255*n,e.b=(r&255)/255*n},toHexString({r:t,g:e,b:n},r=1){r=255/r;const i=t*r<<16^e*r<<8^n*r<<0;return Ue.toHexString(i)}},li=[oi,Ue,si,ai];function ci(t){return li.find(e=>e.match(t))}class ui extends re{constructor(e,n,r,i){super(e,n,r,"color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=ci(this.initialValue),this._rgbScale=i,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=$t(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const n=this._format.fromHexString(e);this.setValue(n)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Rt extends re{constructor(e,n,r){super(e,n,r,"function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",i=>{i.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class fi extends re{constructor(e,n,r,i,o,s){super(e,n,r,"number"),this._initInput(),this.min(i),this.max(o);const a=s!==void 0;this.step(a?s:this._getImplicitStep(),a),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,n=!0){return this._step=e,this._stepExplicit=n,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let n=(e-this._min)/(this._max-this._min);n=Math.max(0,Math.min(n,1)),this.$fill.style.width=n*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const n=()=>{let x=parseFloat(this.$input.value);isNaN(x)||(this._stepExplicit&&(x=this._snap(x)),this.setValue(this._clamp(x)))},r=x=>{const y=parseFloat(this.$input.value);isNaN(y)||(this._snapClampSetValue(y+x),this.$input.value=this.getValue())},i=x=>{x.key==="Enter"&&this.$input.blur(),x.code==="ArrowUp"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x))),x.code==="ArrowDown"&&(x.preventDefault(),r(this._step*this._arrowKeyMultiplier(x)*-1))},o=x=>{this._inputFocused&&(x.preventDefault(),r(this._step*this._normalizeMouseWheel(x)))};let s=!1,a,l,c,f,u;const h=5,p=x=>{a=x.clientX,l=c=x.clientY,s=!0,f=this.getValue(),u=0,window.addEventListener("mousemove",d),window.addEventListener("mouseup",b)},d=x=>{if(s){const y=x.clientX-a,_=x.clientY-l;Math.abs(_)>h?(x.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(y)>h&&b()}if(!s){const y=x.clientY-c;u-=y*this._step*this._arrowKeyMultiplier(x),f+u>this._max?u=this._max-f:f+u<this._min&&(u=this._min-f),this._snapClampSetValue(f+u)}c=x.clientY},b=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",b)},E=()=>{this._inputFocused=!0},v=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",n),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",p),this.$input.addEventListener("focus",E),this.$input.addEventListener("blur",v)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("hasSlider");const e=(v,x,y,_,S)=>(v-x)/(y-x)*(S-_)+_,n=v=>{const x=this.$slider.getBoundingClientRect();let y=e(v,x.left,x.right,this._min,this._max);this._snapClampSetValue(y)},r=v=>{this._setDraggingStyle(!0),n(v.clientX),window.addEventListener("mousemove",i),window.addEventListener("mouseup",o)},i=v=>{n(v.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",i),window.removeEventListener("mouseup",o)};let s=!1,a,l;const c=v=>{v.preventDefault(),this._setDraggingStyle(!0),n(v.touches[0].clientX),s=!1},f=v=>{v.touches.length>1||(this._hasScrollBar?(a=v.touches[0].clientX,l=v.touches[0].clientY,s=!0):c(v),window.addEventListener("touchmove",u,{passive:!1}),window.addEventListener("touchend",h))},u=v=>{if(s){const x=v.touches[0].clientX-a,y=v.touches[0].clientY-l;Math.abs(x)>Math.abs(y)?c(v):(window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h))}else v.preventDefault(),n(v.touches[0].clientX)},h=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",u),window.removeEventListener("touchend",h)},p=this._callOnFinishChange.bind(this),d=400;let b;const E=v=>{if(Math.abs(v.deltaX)<Math.abs(v.deltaY)&&this._hasScrollBar)return;v.preventDefault();const y=this._normalizeMouseWheel(v)*this._step;this._snapClampSetValue(this.getValue()+y),this.$input.value=this.getValue(),clearTimeout(b),b=setTimeout(p,d)};this.$slider.addEventListener("mousedown",r),this.$slider.addEventListener("touchstart",f,{passive:!1}),this.$slider.addEventListener("wheel",E,{passive:!1})}_setDraggingStyle(e,n="horizontal"){this.$slider&&this.$slider.classList.toggle("active",e),document.body.classList.toggle("lil-gui-dragging",e),document.body.classList.toggle(`lil-gui-${n}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:n,deltaY:r}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(n=0,r=-e.wheelDelta/120,r*=this._stepExplicit?1:10),n+-r}_arrowKeyMultiplier(e){let n=this._stepExplicit?1:10;return e.shiftKey?n*=10:e.altKey&&(n/=10),n}_snap(e){const n=Math.round(e/this._step)*this._step;return parseFloat(n.toPrecision(15))}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class hi extends re{constructor(e,n,r,i){super(e,n,r,"option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(i)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(n=>{const r=document.createElement("option");r.textContent=n,this.$select.appendChild(r)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),n=this._values.indexOf(e);return this.$select.selectedIndex=n,this.$display.textContent=n===-1?e:this._names[n],this}}class di extends re{constructor(e,n,r){super(e,n,r,"string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",i=>{i.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}const mi=`.lil-gui {
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
}`;function pi(t){const e=document.createElement("style");e.innerHTML=t;const n=document.querySelector("head link[rel=stylesheet], head style");n?document.head.insertBefore(e,n):document.head.appendChild(e)}let Rn=!1;class Jt{constructor({parent:e,autoPlace:n=e===void 0,container:r,width:i,title:o="Controls",closeFolders:s=!1,injectStyles:a=!0,touchStyles:l=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("div"),this.$title.classList.add("title"),this.$title.setAttribute("role","button"),this.$title.setAttribute("aria-expanded",!0),this.$title.setAttribute("tabindex",0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("keydown",c=>{(c.code==="Enter"||c.code==="Space")&&(c.preventDefault(),this.$title.click())}),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("root"),l&&this.domElement.classList.add("allow-touch-styles"),!Rn&&a&&(pi(mi),Rn=!0),r?r.appendChild(this.domElement):n&&(this.domElement.classList.add("autoPlace"),document.body.appendChild(this.domElement)),i&&this.domElement.style.setProperty("--width",i+"px"),this._closeFolders=s}add(e,n,r,i,o){if(Object(r)===r)return new hi(this,e,n,r);const s=e[n];switch(typeof s){case"number":return new fi(this,e,n,r,i,o);case"boolean":return new ii(this,e,n);case"string":return new di(this,e,n);case"function":return new Rt(this,e,n)}console.error(`gui.add failed
	property:`,n,`
	object:`,e,`
	value:`,s)}addColor(e,n,r=1){return new ui(this,e,n,r)}addFolder(e){const n=new Jt({parent:this,title:e});return this.root._closeFolders&&n.close(),n}load(e,n=!0){return e.controllers&&this.controllers.forEach(r=>{r instanceof Rt||r._name in e.controllers&&r.load(e.controllers[r._name])}),n&&e.folders&&this.folders.forEach(r=>{r._title in e.folders&&r.load(e.folders[r._title])}),this}save(e=!0){const n={controllers:{},folders:{}};return this.controllers.forEach(r=>{if(!(r instanceof Rt)){if(r._name in n.controllers)throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);n.controllers[r._name]=r.save()}}),e&&this.folders.forEach(r=>{if(r._title in n.folders)throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);n.folders[r._title]=r.save()}),n}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const n=this.$children.clientHeight;this.$children.style.height=n+"px",this.domElement.classList.add("transition");const r=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("transition"),this.$children.removeEventListener("transitionend",r))};this.$children.addEventListener("transitionend",r);const i=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("closed",!e),requestAnimationFrame(()=>{this.$children.style.height=i+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(r=>r.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(n=>{e=e.concat(n.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(n=>{e=e.concat(n.foldersRecursive())}),e}}const xi=Jt,Ft="state",Dt="config";class vi{constructor(){this.added=[],this.listeners=[],this.serializedConfig={},this.config={},this.state={}}init(){const e=new xi;this.variables=e.addFolder("Variables"),this.buttons=e.addFolder("Buttons"),this.readData(),this.addButton({name:"Clear Data",fn:()=>this.clearData()}),e.hide()}addEnum({displayName:e,defaultValue:n,options:r,callback:i=null}){var o;if(!this.config[e]){const s=((o=this.serializedConfig[e])==null?void 0:o.value)??n;this.config[e]={name:e,defaultValue:n,value:s,minOrOptions:r},this.addConfigData(e,i),this.added.push(e)}return this.config[e]}addNumber({displayName:e,defaultValue:n,min:r=null,max:i=null,step:o=null,callback:s=null}){var a;if(!this.config[e]){const l=((a=this.serializedConfig[e])==null?void 0:a.value)??n;this.config[e]={name:e,defaultValue:n,value:l,minOrOptions:r,max:i,step:o},r!==null&&(this.config[e].value=Math.max(r,this.config[e].value)),i!==null&&(this.config[e].value=Math.min(i,this.config[e].value)),this.addConfigData(e,s),this.added.push(e)}return this.config[e]}addColor({displayName:e,defaultValue:n,callback:r=null}){var i;if(!this.config[e]){const o=((i=this.serializedConfig[e])==null?void 0:i.value)??n;this.config[e]={name:e,defaultValue:n,value:o},this.variables.addColor(this.config[e],"value").name(e).onChange(s=>{this.saveData(),this.notify(),r&&r(s)}).listen(),this.added.push(e)}return this.config[e]}addButton({fn:e,name:n}){const r={};r[n]=e,this.buttons.add(r,n)}addConfigData(e,n){const{minOrOptions:r=null,max:i=null,step:o=null,name:s}=this.config[e];this.variables.add(this.config[e],"value",r,i,o).name(s).onChange(a=>{this.saveData(),this.notify(),n&&n(a)}).listen()}notify(){this.listeners.forEach(e=>e.configUpdated(this.config))}readData(){const e=localStorage.getItem(Ft);e&&e!="undefined"?this.state=JSON.parse(e):this.state={};const n=localStorage.getItem(Dt);n&&n!="undefined"?this.serializedConfig=JSON.parse(n):this.serializedConfig={}}saveData(){}clearData(){localStorage.getItem(Ft)&&localStorage.removeItem(Ft),this.state={},localStorage.getItem(Dt)&&localStorage.removeItem(Dt);for(const[e,n]of Object.entries(this.config))n.value=n.defaultValue;this.notify()}addListener(e){this.listeners.push(e)}}var bi=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function yi(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Yn={exports:{}};(function(t,e){(function(n,r){t.exports=r()})(bi,function(){var n=function(){var r=0,i=document.createElement("div");function o(p){return i.appendChild(p.dom),p}function s(p){for(var d=0;d<i.children.length;d++)i.children[d].style.display=d===p?"block":"none";r=p}i.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",i.addEventListener("click",function(p){p.preventDefault(),s(++r%i.children.length)},!1);var a=(performance||Date).now(),l=a,c=0,f=o(new n.Panel("FPS","#0ff","#002")),u=o(new n.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var h=o(new n.Panel("MB","#f08","#201"));return s(0),{REVISION:16,dom:i,addPanel:o,showPanel:s,begin:function(){a=(performance||Date).now()},end:function(){c++;var p=(performance||Date).now();if(u.update(p-a,200),l+1e3<=p&&(f.update(1e3*c/(p-l),100),l=p,c=0,h)){var d=performance.memory;h.update(d.usedJSHeapSize/1048576,d.jsHeapSizeLimit/1048576)}return p},update:function(){a=this.end()},domElement:i,setMode:s}};return n.Panel=function(r,i,o){var s=1/0,a=0,l=Math.round,c=l(window.devicePixelRatio||1),f=80*c,u=48*c,h=3*c,p=2*c,d=3*c,b=15*c,E=74*c,v=30*c,x=document.createElement("canvas");x.width=f,x.height=u,x.style.cssText="width:80px;height:48px";var y=x.getContext("2d");return y.font="bold "+9*c+"px Helvetica,Arial,sans-serif",y.textBaseline="top",y.fillStyle=o,y.fillRect(0,0,f,u),y.fillStyle=i,y.fillText(r,h,p),y.fillRect(d,b,E,v),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(d,b,E,v),{dom:x,update:function(_,S){s=Math.min(s,_),a=Math.max(a,_),y.fillStyle=o,y.globalAlpha=1,y.fillRect(0,0,f,b),y.fillStyle=i,y.fillText(l(_)+" "+r+" ("+l(s)+"-"+l(a)+")",h,p),y.drawImage(x,d+c,b,E-c,v,d,b,E-c,v),y.fillRect(d+E-c,b,c,v),y.fillStyle=o,y.globalAlpha=.9,y.fillRect(d+E-c,b,c,l((1-_/S)*v))}}},n})})(Yn);var Ei=Yn.exports;const gi=yi(Ei);/* @license twgl.js 5.5.4 Copyright (c) 2015, Gregg Tavares All Rights Reserved.
Available via the MIT license.
see: http://github.com/greggman/twgl.js for details */let pt=Float32Array;function ue(t,e,n){const r=new pt(3);return t&&(r[0]=t),e&&(r[1]=e),n&&(r[2]=n),r}function Ai(t,e,n){return n=n||new pt(3),n[0]=t[0]-e[0],n[1]=t[1]-e[1],n[2]=t[2]-e[2],n}function Fn(t,e,n){n=n||new pt(3);const r=t[2]*e[0]-t[0]*e[2],i=t[0]*e[1]-t[1]*e[0];return n[0]=t[1]*e[2]-t[2]*e[1],n[1]=r,n[2]=i,n}function Pt(t,e){e=e||new pt(3);const n=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],r=Math.sqrt(n);return r>1e-5?(e[0]=t[0]/r,e[1]=t[1]/r,e[2]=t[2]/r):(e[0]=0,e[1]=0,e[2]=0),e}let C=Float32Array;function wi(t){const e=C;return C=t,e}function _i(t,e){return e=e||new C(16),e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=-t[3],e[4]=-t[4],e[5]=-t[5],e[6]=-t[6],e[7]=-t[7],e[8]=-t[8],e[9]=-t[9],e[10]=-t[10],e[11]=-t[11],e[12]=-t[12],e[13]=-t[13],e[14]=-t[14],e[15]=-t[15],e}function Ti(){return new C(16).fill(0)}function Wn(t,e){return e=e||new C(16),e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function jn(t){return t=t||new C(16),t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Si(t,e){if(e=e||new C(16),e===t){let x;return x=t[1],t[1]=t[4],t[4]=x,x=t[2],t[2]=t[8],t[8]=x,x=t[3],t[3]=t[12],t[12]=x,x=t[6],t[6]=t[9],t[9]=x,x=t[7],t[7]=t[13],t[13]=x,x=t[11],t[11]=t[14],t[14]=x,e}const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],f=t[2*4+0],u=t[2*4+1],h=t[2*4+2],p=t[2*4+3],d=t[3*4+0],b=t[3*4+1],E=t[3*4+2],v=t[3*4+3];return e[0]=n,e[1]=s,e[2]=f,e[3]=d,e[4]=r,e[5]=a,e[6]=u,e[7]=b,e[8]=i,e[9]=l,e[10]=h,e[11]=E,e[12]=o,e[13]=c,e[14]=p,e[15]=v,e}function qn(t,e){e=e||new C(16);const n=t[0*4+0],r=t[0*4+1],i=t[0*4+2],o=t[0*4+3],s=t[1*4+0],a=t[1*4+1],l=t[1*4+2],c=t[1*4+3],f=t[2*4+0],u=t[2*4+1],h=t[2*4+2],p=t[2*4+3],d=t[3*4+0],b=t[3*4+1],E=t[3*4+2],v=t[3*4+3],x=h*v,y=E*p,_=l*v,S=E*c,P=l*p,F=h*c,$=i*v,k=E*o,G=i*p,V=h*o,H=i*c,X=l*o,Y=f*b,W=d*u,j=s*b,q=d*a,K=s*u,He=f*a,Xe=n*b,Ye=d*r,We=n*u,je=f*r,qe=n*a,Ke=s*r,_n=x*a+S*u+P*b-(y*a+_*u+F*b),Tn=y*r+$*u+V*b-(x*r+k*u+G*b),Sn=_*r+k*a+H*b-(S*r+$*a+X*b),Cn=F*r+G*a+X*u-(P*r+V*a+H*u),B=1/(n*_n+s*Tn+f*Sn+d*Cn);return e[0]=B*_n,e[1]=B*Tn,e[2]=B*Sn,e[3]=B*Cn,e[4]=B*(y*s+_*f+F*d-(x*s+S*f+P*d)),e[5]=B*(x*n+k*f+G*d-(y*n+$*f+V*d)),e[6]=B*(S*n+$*s+X*d-(_*n+k*s+H*d)),e[7]=B*(P*n+V*s+H*f-(F*n+G*s+X*f)),e[8]=B*(Y*c+q*p+K*v-(W*c+j*p+He*v)),e[9]=B*(W*o+Xe*p+je*v-(Y*o+Ye*p+We*v)),e[10]=B*(j*o+Ye*c+qe*v-(q*o+Xe*c+Ke*v)),e[11]=B*(He*o+We*c+Ke*p-(K*o+je*c+qe*p)),e[12]=B*(j*h+He*E+W*l-(K*E+Y*l+q*h)),e[13]=B*(We*E+Y*i+Ye*h-(Xe*h+je*E+W*i)),e[14]=B*(Xe*l+Ke*E+q*i-(qe*E+j*i+Ye*l)),e[15]=B*(qe*h+K*i+je*l-(We*l+Ke*h+He*i)),e}function Ci(t,e,n){n=n||new C(16);const r=t[0],i=t[1],o=t[2],s=t[3],a=t[4+0],l=t[4+1],c=t[4+2],f=t[4+3],u=t[8+0],h=t[8+1],p=t[8+2],d=t[8+3],b=t[12+0],E=t[12+1],v=t[12+2],x=t[12+3],y=e[0],_=e[1],S=e[2],P=e[3],F=e[4+0],$=e[4+1],k=e[4+2],G=e[4+3],V=e[8+0],H=e[8+1],X=e[8+2],Y=e[8+3],W=e[12+0],j=e[12+1],q=e[12+2],K=e[12+3];return n[0]=r*y+a*_+u*S+b*P,n[1]=i*y+l*_+h*S+E*P,n[2]=o*y+c*_+p*S+v*P,n[3]=s*y+f*_+d*S+x*P,n[4]=r*F+a*$+u*k+b*G,n[5]=i*F+l*$+h*k+E*G,n[6]=o*F+c*$+p*k+v*G,n[7]=s*F+f*$+d*k+x*G,n[8]=r*V+a*H+u*X+b*Y,n[9]=i*V+l*H+h*X+E*Y,n[10]=o*V+c*H+p*X+v*Y,n[11]=s*V+f*H+d*X+x*Y,n[12]=r*W+a*j+u*q+b*K,n[13]=i*W+l*j+h*q+E*K,n[14]=o*W+c*j+p*q+v*K,n[15]=s*W+f*j+d*q+x*K,n}function Ri(t,e,n){return n=n||jn(),t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11]),n[12]=e[0],n[13]=e[1],n[14]=e[2],n[15]=1,n}function Fi(t,e){return e=e||ue(),e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function Di(t,e,n){n=n||ue();const r=e*4;return n[0]=t[r+0],n[1]=t[r+1],n[2]=t[r+2],n}function Pi(t,e,n,r){r!==t&&(r=Wn(t,r));const i=n*4;return r[i+0]=e[0],r[i+1]=e[1],r[i+2]=e[2],r}function Ii(t,e,n,r,i){i=i||new C(16);const o=Math.tan(Math.PI*.5-.5*t),s=1/(n-r);return i[0]=o/e,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=(n+r)*s,i[11]=-1,i[12]=0,i[13]=0,i[14]=n*r*s*2,i[15]=0,i}function Li(t,e,n,r,i,o,s){return s=s||new C(16),s[0]=2/(e-t),s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2/(r-n),s[6]=0,s[7]=0,s[8]=0,s[9]=0,s[10]=2/(i-o),s[11]=0,s[12]=(e+t)/(t-e),s[13]=(r+n)/(n-r),s[14]=(o+i)/(i-o),s[15]=1,s}function Mi(t,e,n,r,i,o,s){s=s||new C(16);const a=e-t,l=r-n,c=i-o;return s[0]=2*i/a,s[1]=0,s[2]=0,s[3]=0,s[4]=0,s[5]=2*i/l,s[6]=0,s[7]=0,s[8]=(t+e)/a,s[9]=(r+n)/l,s[10]=o/c,s[11]=-1,s[12]=0,s[13]=0,s[14]=i*o/c,s[15]=0,s}let le,xe,oe;function Bi(t,e,n,r){return r=r||new C(16),le=le||ue(),xe=xe||ue(),oe=oe||ue(),Pt(Ai(t,e,oe),oe),Pt(Fn(n,oe,le),le),Pt(Fn(oe,le,xe),xe),r[0]=le[0],r[1]=le[1],r[2]=le[2],r[3]=0,r[4]=xe[0],r[5]=xe[1],r[6]=xe[2],r[7]=0,r[8]=oe[0],r[9]=oe[1],r[10]=oe[2],r[11]=0,r[12]=t[0],r[13]=t[1],r[14]=t[2],r[15]=1,r}function Ui(t,e){return e=e||new C(16),e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function Ni(t,e,n){n=n||new C(16);const r=e[0],i=e[1],o=e[2],s=t[0],a=t[1],l=t[2],c=t[3],f=t[1*4+0],u=t[1*4+1],h=t[1*4+2],p=t[1*4+3],d=t[2*4+0],b=t[2*4+1],E=t[2*4+2],v=t[2*4+3],x=t[3*4+0],y=t[3*4+1],_=t[3*4+2],S=t[3*4+3];return t!==n&&(n[0]=s,n[1]=a,n[2]=l,n[3]=c,n[4]=f,n[5]=u,n[6]=h,n[7]=p,n[8]=d,n[9]=b,n[10]=E,n[11]=v),n[12]=s*r+f*i+d*o+x,n[13]=a*r+u*i+b*o+y,n[14]=l*r+h*i+E*o+_,n[15]=c*r+p*i+v*o+S,n}function zi(t,e){e=e||new C(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=n,e[6]=r,e[7]=0,e[8]=0,e[9]=-r,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Oi(t,e,n){n=n||new C(16);const r=t[4],i=t[5],o=t[6],s=t[7],a=t[8],l=t[9],c=t[10],f=t[11],u=Math.cos(e),h=Math.sin(e);return n[4]=u*r+h*a,n[5]=u*i+h*l,n[6]=u*o+h*c,n[7]=u*s+h*f,n[8]=u*a-h*r,n[9]=u*l-h*i,n[10]=u*c-h*o,n[11]=u*f-h*s,t!==n&&(n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function $i(t,e){e=e||new C(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=0,e[2]=-r,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=r,e[9]=0,e[10]=n,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function ki(t,e,n){n=n||new C(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[2*4+0],l=t[2*4+1],c=t[2*4+2],f=t[2*4+3],u=Math.cos(e),h=Math.sin(e);return n[0]=u*r-h*a,n[1]=u*i-h*l,n[2]=u*o-h*c,n[3]=u*s-h*f,n[8]=u*a+h*r,n[9]=u*l+h*i,n[10]=u*c+h*o,n[11]=u*f+h*s,t!==n&&(n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Gi(t,e){e=e||new C(16);const n=Math.cos(t),r=Math.sin(t);return e[0]=n,e[1]=r,e[2]=0,e[3]=0,e[4]=-r,e[5]=n,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Vi(t,e,n){n=n||new C(16);const r=t[0*4+0],i=t[0*4+1],o=t[0*4+2],s=t[0*4+3],a=t[1*4+0],l=t[1*4+1],c=t[1*4+2],f=t[1*4+3],u=Math.cos(e),h=Math.sin(e);return n[0]=u*r+h*a,n[1]=u*i+h*l,n[2]=u*o+h*c,n[3]=u*s+h*f,n[4]=u*a-h*r,n[5]=u*l-h*i,n[6]=u*c-h*o,n[7]=u*f-h*s,t!==n&&(n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function Hi(t,e,n){n=n||new C(16);let r=t[0],i=t[1],o=t[2];const s=Math.sqrt(r*r+i*i+o*o);r/=s,i/=s,o/=s;const a=r*r,l=i*i,c=o*o,f=Math.cos(e),u=Math.sin(e),h=1-f;return n[0]=a+(1-a)*f,n[1]=r*i*h+o*u,n[2]=r*o*h-i*u,n[3]=0,n[4]=r*i*h-o*u,n[5]=l+(1-l)*f,n[6]=i*o*h+r*u,n[7]=0,n[8]=r*o*h+i*u,n[9]=i*o*h-r*u,n[10]=c+(1-c)*f,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function Xi(t,e,n,r){r=r||new C(16);let i=e[0],o=e[1],s=e[2];const a=Math.sqrt(i*i+o*o+s*s);i/=a,o/=a,s/=a;const l=i*i,c=o*o,f=s*s,u=Math.cos(n),h=Math.sin(n),p=1-u,d=l+(1-l)*u,b=i*o*p+s*h,E=i*s*p-o*h,v=i*o*p-s*h,x=c+(1-c)*u,y=o*s*p+i*h,_=i*s*p+o*h,S=o*s*p-i*h,P=f+(1-f)*u,F=t[0],$=t[1],k=t[2],G=t[3],V=t[4],H=t[5],X=t[6],Y=t[7],W=t[8],j=t[9],q=t[10],K=t[11];return r[0]=d*F+b*V+E*W,r[1]=d*$+b*H+E*j,r[2]=d*k+b*X+E*q,r[3]=d*G+b*Y+E*K,r[4]=v*F+x*V+y*W,r[5]=v*$+x*H+y*j,r[6]=v*k+x*X+y*q,r[7]=v*G+x*Y+y*K,r[8]=_*F+S*V+P*W,r[9]=_*$+S*H+P*j,r[10]=_*k+S*X+P*q,r[11]=_*G+S*Y+P*K,t!==r&&(r[12]=t[12],r[13]=t[13],r[14]=t[14],r[15]=t[15]),r}function Yi(t,e){return e=e||new C(16),e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Wi(t,e,n){n=n||new C(16);const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0],n[1]=r*t[0*4+1],n[2]=r*t[0*4+2],n[3]=r*t[0*4+3],n[4]=i*t[1*4+0],n[5]=i*t[1*4+1],n[6]=i*t[1*4+2],n[7]=i*t[1*4+3],n[8]=o*t[2*4+0],n[9]=o*t[2*4+1],n[10]=o*t[2*4+2],n[11]=o*t[2*4+3],t!==n&&(n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15]),n}function ji(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2],s=r*t[0*4+3]+i*t[1*4+3]+o*t[2*4+3]+t[3*4+3];return n[0]=(r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0]+t[3*4+0])/s,n[1]=(r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1]+t[3*4+1])/s,n[2]=(r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2]+t[3*4+2])/s,n}function qi(t,e,n){n=n||ue();const r=e[0],i=e[1],o=e[2];return n[0]=r*t[0*4+0]+i*t[1*4+0]+o*t[2*4+0],n[1]=r*t[0*4+1]+i*t[1*4+1]+o*t[2*4+1],n[2]=r*t[0*4+2]+i*t[1*4+2]+o*t[2*4+2],n}function Ki(t,e,n){n=n||ue();const r=qn(t),i=e[0],o=e[1],s=e[2];return n[0]=i*r[0*4+0]+o*r[0*4+1]+s*r[0*4+2],n[1]=i*r[1*4+0]+o*r[1*4+1]+s*r[1*4+2],n[2]=i*r[2*4+0]+o*r[2*4+1]+s*r[2*4+2],n}var Qi=Object.freeze({__proto__:null,axisRotate:Xi,axisRotation:Hi,copy:Wn,create:Ti,frustum:Mi,getAxis:Di,getTranslation:Fi,identity:jn,inverse:qn,lookAt:Bi,multiply:Ci,negate:_i,ortho:Li,perspective:Ii,rotateX:Oi,rotateY:ki,rotateZ:Vi,rotationX:zi,rotationY:$i,rotationZ:Gi,scale:Wi,scaling:Yi,setAxis:Pi,setDefaultType:wi,setTranslation:Ri,transformDirection:qi,transformNormal:Ki,transformPoint:ji,translate:Ni,translation:Ui,transpose:Si});const en=5120,Ne=5121,tn=5122,nn=5123,rn=5124,on=5125,sn=5126,Zi=32819,Ji=32820,eo=33635,to=5131,no=33640,ro=35899,io=35902,oo=36269,so=34042,Kn={};{const t=Kn;t[en]=Int8Array,t[Ne]=Uint8Array,t[tn]=Int16Array,t[nn]=Uint16Array,t[rn]=Int32Array,t[on]=Uint32Array,t[sn]=Float32Array,t[Zi]=Uint16Array,t[Ji]=Uint16Array,t[eo]=Uint16Array,t[to]=Uint16Array,t[no]=Uint32Array,t[ro]=Uint32Array,t[io]=Uint32Array,t[oo]=Uint32Array,t[so]=Uint32Array}function an(t){if(t instanceof Int8Array)return en;if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)return Ne;if(t instanceof Int16Array)return tn;if(t instanceof Uint16Array)return nn;if(t instanceof Int32Array)return rn;if(t instanceof Uint32Array)return on;if(t instanceof Float32Array)return sn;throw new Error("unsupported typed array type")}function Qn(t){if(t===Int8Array)return en;if(t===Uint8Array||t===Uint8ClampedArray)return Ne;if(t===Int16Array)return tn;if(t===Uint16Array)return nn;if(t===Int32Array)return rn;if(t===Uint32Array)return on;if(t===Float32Array)return sn;throw new Error("unsupported typed array type")}function Zn(t){const e=Kn[t];if(!e)throw new Error("unknown gl type");return e}const st=typeof SharedArrayBuffer<"u"?function(e){return e&&e.buffer&&(e.buffer instanceof ArrayBuffer||e.buffer instanceof SharedArrayBuffer)}:function(e){return e&&e.buffer&&e.buffer instanceof ArrayBuffer};function Jn(...t){console.error(...t)}function ao(...t){console.warn(...t)}const Dn=new Map;function xt(t,e){if(!t||typeof t!="object")return!1;let n=Dn.get(e);n||(n=new WeakMap,Dn.set(e,n));let r=n.get(t);if(r===void 0){const i=Object.prototype.toString.call(t);r=i.substring(8,i.length-1)===e,n.set(t,r)}return r}function lo(t,e){return typeof WebGLBuffer<"u"&&xt(e,"WebGLBuffer")}function co(t,e){return typeof WebGLRenderbuffer<"u"&&xt(e,"WebGLRenderbuffer")}function ln(t,e){return typeof WebGLTexture<"u"&&xt(e,"WebGLTexture")}function uo(t,e){return typeof WebGLSampler<"u"&&xt(e,"WebGLSampler")}const er=35044,ge=34962,fo=34963,ho=34660,mo=5120,po=5121,xo=5122,vo=5123,bo=5124,yo=5125,tr=5126,nr={attribPrefix:""};function Eo(t,e,n,r,i){t.bindBuffer(e,n),t.bufferData(e,r,i||er)}function rr(t,e,n,r){if(lo(t,e))return e;n=n||ge;const i=t.createBuffer();return Eo(t,n,i,e,r),i}function ir(t){return t==="indices"}function go(t){return t===Int8Array||t===Uint8Array}function Ao(t){return t.length?t:t.data}const wo=/coord|texture/i,_o=/color|colour/i;function To(t,e){let n;if(wo.test(t)?n=2:_o.test(t)?n=4:n=3,e%n>0)throw new Error(`Can not guess numComponents for attribute '${t}'. Tried ${n} but ${e} values is not evenly divisible by ${n}. You should specify it.`);return n}function So(t,e,n){return t.numComponents||t.size||To(e,n||Ao(t).length)}function or(t,e){if(st(t))return t;if(st(t.data))return t.data;Array.isArray(t)&&(t={data:t});let n=t.type?cn(t.type):void 0;return n||(ir(e)?n=Uint16Array:n=Float32Array),new n(t.data)}function Co(t){return typeof t=="number"?t:t?Qn(t):tr}function cn(t){return typeof t=="number"?Zn(t):t||Float32Array}function Ro(t,e){return{buffer:e.buffer,numValues:2*3*4,type:Co(e.type),arrayType:cn(e.type)}}function Fo(t,e){const n=e.data||e,r=cn(e.type),i=n*r.BYTES_PER_ELEMENT,o=t.createBuffer();return t.bindBuffer(ge,o),t.bufferData(ge,i,e.drawType||er),{buffer:o,numValues:n,type:Qn(r),arrayType:r}}function Do(t,e,n){const r=or(e,n);return{arrayType:r.constructor,buffer:rr(t,r,void 0,e.drawType),type:an(r),numValues:0}}function Po(t,e){const n={};return Object.keys(e).forEach(function(r){if(!ir(r)){const i=e[r],o=i.attrib||i.name||i.attribName||nr.attribPrefix+r;if(i.value){if(!Array.isArray(i.value)&&!st(i.value))throw new Error("array.value is not array or typedarray");n[o]={value:i.value}}else{let s;i.buffer&&i.buffer instanceof WebGLBuffer?s=Ro:typeof i=="number"||typeof i.data=="number"?s=Fo:s=Do;const{buffer:a,type:l,numValues:c,arrayType:f}=s(t,i,r),u=i.normalize!==void 0?i.normalize:go(f),h=So(i,r,c);n[o]={buffer:a,numComponents:h,type:l,normalize:u,stride:i.stride||0,offset:i.offset||0,divisor:i.divisor===void 0?void 0:i.divisor,drawType:i.drawType}}}}),t.bindBuffer(ge,null),n}function Io(t,e){return e===mo||e===po?1:e===xo||e===vo?2:e===bo||e===yo||e===tr?4:0}const It=["position","positions","a_position"];function Lo(t,e){let n,r;for(r=0;r<It.length&&(n=It[r],!(n in e||(n=nr.attribPrefix+n,n in e)));++r);r===It.length&&(n=Object.keys(e)[0]);const i=e[n];if(!i.buffer)return 1;t.bindBuffer(ge,i.buffer);const o=t.getBufferParameter(ge,ho);t.bindBuffer(ge,null);const s=Io(t,i.type),a=o/s,l=i.numComponents||i.size,c=a/l;if(c%1!==0)throw new Error(`numComponents ${l} not correct for length ${length}`);return c}function sr(t,e,n){const r=Po(t,e),i=Object.assign({},n||{});i.attribs=Object.assign({},n?n.attribs:{},r);const o=e.indices;if(o){const s=or(o,"indices");i.indices=rr(t,s,fo),i.numElements=s.length,i.elementType=an(s)}else i.numElements||(i.numElements=Lo(t,i.attribs));return i}function $e(t){return!!t.texStorage2D}const at=function(){const t={},e={};function n(r){const i=r.constructor.name;if(!t[i]){for(const o in r)if(typeof r[o]=="number"){const s=e[r[o]];e[r[o]]=s?`${s} | ${o}`:o}t[i]=!0}}return function(i,o){return n(i),e[o]||(typeof o=="number"?`0x${o.toString(16)}`:o)}}(),he={textureColor:new Uint8Array([128,192,255,255]),textureOptions:{},crossOrigin:void 0},ze=st,ar=function(){let t;return function(){return t=t||(typeof document<"u"&&document.createElement?document.createElement("canvas").getContext("2d"):null),t}}(),Pn=6406,ne=6407,D=6408,In=6409,Ln=6410,Ie=6402,Mn=34041,lt=33071,Mo=9728,Bo=9729,de=3553,fe=34067,Ae=32879,we=35866,un=34069,Uo=34070,No=34071,zo=34072,Oo=34073,$o=34074,kt=10241,Gt=10240,ct=10242,ut=10243,Bn=32882,ko=33082,Go=33083,Vo=33084,Ho=33085,Xo=34892,Yo=34893,fn=3317,lr=3314,cr=32878,ur=3316,fr=3315,hr=32877,Wo=37443,jo=37441,qo=37440,Ko=33321,Qo=36756,Zo=33325,Jo=33326,es=33330,ts=33329,ns=33338,rs=33337,is=33340,os=33339,ss=33323,as=36757,ls=33327,cs=33328,us=33336,fs=33335,hs=33332,ds=33331,ms=33334,ps=33333,xs=32849,vs=35905,bs=36194,ys=36758,Es=35898,gs=35901,As=34843,ws=34837,_s=36221,Ts=36239,Ss=36215,Cs=36233,Rs=36209,Fs=36227,Ds=32856,Ps=35907,Is=36759,Ls=32855,Ms=32854,Bs=32857,Us=34842,Ns=34836,zs=36220,Os=36238,$s=36975,ks=36214,Gs=36232,Vs=36226,Hs=36208,Xs=33189,Ys=33190,Ws=36012,js=36013,qs=35056,ce=5120,R=5121,Qe=5122,Te=5123,Ze=5124,ve=5125,U=5126,Un=32819,Nn=32820,zn=33635,J=5131,Le=36193,Lt=33640,Ks=35899,Qs=35902,Zs=36269,Js=34042,Je=33319,Se=33320,et=6403,Ce=36244,Re=36248,be=36249;let Mt;function vt(t){if(!Mt){const e={};e[Pn]={textureFormat:Pn,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[R,J,Le,U]},e[In]={textureFormat:In,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1,2,2,4],type:[R,J,Le,U]},e[Ln]={textureFormat:Ln,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2,4,4,8],type:[R,J,Le,U]},e[ne]={textureFormat:ne,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,6,6,12,2],type:[R,J,Le,U,zn]},e[D]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,8,8,16,2,2],type:[R,J,Le,U,Un,Nn]},e[Ie]={textureFormat:Ie,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[ve,Te]},e[Ko]={textureFormat:et,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[1],type:[R]},e[Qo]={textureFormat:et,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[1],type:[ce]},e[Zo]={textureFormat:et,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4,2],type:[U,J]},e[Jo]={textureFormat:et,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[4],type:[U]},e[es]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[R]},e[ts]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[1],type:[ce]},e[hs]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[Te]},e[ds]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[Qe]},e[ms]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[ps]={textureFormat:Ce,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Ze]},e[ss]={textureFormat:Je,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[2],type:[R]},e[as]={textureFormat:Je,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[2],type:[ce]},e[ls]={textureFormat:Je,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[8,4],type:[U,J]},e[cs]={textureFormat:Je,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[8],type:[U]},e[us]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[R]},e[fs]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2],type:[ce]},e[ns]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Te]},e[rs]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Qe]},e[is]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[ve]},e[os]={textureFormat:Se,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[Ze]},e[xs]={textureFormat:ne,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3],type:[R]},e[vs]={textureFormat:ne,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[R]},e[bs]={textureFormat:ne,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[3,2],type:[R,zn]},e[ys]={textureFormat:ne,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[3],type:[ce]},e[Es]={textureFormat:ne,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[U,J,Ks]},e[gs]={textureFormat:ne,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6,4],type:[U,J,Qs]},e[As]={textureFormat:ne,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[12,6],type:[U,J]},e[ws]={textureFormat:ne,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[U]},e[_s]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[R]},e[Ts]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[3],type:[ce]},e[Ss]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[Te]},e[Cs]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[6],type:[Qe]},e[Rs]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[ve]},e[Fs]={textureFormat:Re,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[12],type:[Ze]},e[Ds]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[R]},e[Ps]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[R]},e[Is]={textureFormat:D,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[4],type:[ce]},e[Ls]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2,4],type:[R,Nn,Lt]},e[Ms]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4,2],type:[R,Un]},e[Bs]={textureFormat:D,colorRenderable:!0,textureFilterable:!0,bytesPerElement:[4],type:[Lt]},e[Us]={textureFormat:D,colorRenderable:!1,textureFilterable:!0,bytesPerElement:[16,8],type:[U,J]},e[Ns]={textureFormat:D,colorRenderable:!1,textureFilterable:!1,bytesPerElement:[16],type:[U]},e[zs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[R]},e[Os]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ce]},e[$s]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Lt]},e[ks]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[Te]},e[Gs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[8],type:[Qe]},e[Vs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[Ze]},e[Hs]={textureFormat:be,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[16],type:[ve]},e[Xs]={textureFormat:Ie,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[2,4],type:[Te,ve]},e[Ys]={textureFormat:Ie,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[ve]},e[Ws]={textureFormat:Ie,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[U]},e[qs]={textureFormat:Mn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Js]},e[js]={textureFormat:Mn,colorRenderable:!0,textureFilterable:!1,bytesPerElement:[4],type:[Zs]},Object.keys(e).forEach(function(n){const r=e[n];r.bytesPerElementMap={},r.bytesPerElement.forEach(function(i,o){const s=r.type[o];r.bytesPerElementMap[s]=i})}),Mt=e}return Mt[t]}function ea(t,e){const n=vt(t);if(!n)throw"unknown internal format";const r=n.bytesPerElementMap[e];if(r===void 0)throw"unknown internal format";return r}function ke(t){const e=vt(t);if(!e)throw"unknown internal format";return{format:e.textureFormat,type:e.type[0]}}function On(t){return(t&t-1)===0}function ta(t,e,n,r){if(!$e(t))return On(e)&&On(n);const i=vt(r);if(!i)throw"unknown internal format";return i.colorRenderable&&i.textureFilterable}function na(t){const e=vt(t);if(!e)throw"unknown internal format";return e.textureFilterable}function ra(t,e,n){return ze(e)?an(e):n||R}function tt(t,e,n,r,i){if(i%1!==0)throw"can't guess dimensions";if(!n&&!r){const o=Math.sqrt(i/(e===fe?6:1));o%1===0?(n=o,r=o):(n=i,r=1)}else if(r){if(!n&&(n=i/r,n%1))throw"can't guess dimensions"}else if(r=i/n,r%1)throw"can't guess dimensions";return{width:n,height:r}}function Pe(t,e){e.colorspaceConversion!==void 0&&t.pixelStorei(Wo,e.colorspaceConversion),e.premultiplyAlpha!==void 0&&t.pixelStorei(jo,e.premultiplyAlpha),e.flipY!==void 0&&t.pixelStorei(qo,e.flipY)}function dr(t){t.pixelStorei(fn,4),$e(t)&&(t.pixelStorei(lr,0),t.pixelStorei(cr,0),t.pixelStorei(ur,0),t.pixelStorei(fr,0),t.pixelStorei(hr,0))}function ia(t,e,n,r){r.minMag&&(n.call(t,e,kt,r.minMag),n.call(t,e,Gt,r.minMag)),r.min&&n.call(t,e,kt,r.min),r.mag&&n.call(t,e,Gt,r.mag),r.wrap&&(n.call(t,e,ct,r.wrap),n.call(t,e,ut,r.wrap),(e===Ae||uo(t,e))&&n.call(t,e,Bn,r.wrap)),r.wrapR&&n.call(t,e,Bn,r.wrapR),r.wrapS&&n.call(t,e,ct,r.wrapS),r.wrapT&&n.call(t,e,ut,r.wrapT),r.minLod!==void 0&&n.call(t,e,ko,r.minLod),r.maxLod!==void 0&&n.call(t,e,Go,r.maxLod),r.baseLevel!==void 0&&n.call(t,e,Vo,r.baseLevel),r.maxLevel!==void 0&&n.call(t,e,Ho,r.maxLevel),r.compareFunc!==void 0&&n.call(t,e,Yo,r.compareFunc),r.compareMode!==void 0&&n.call(t,e,Xo,r.compareMode)}function mr(t,e,n){const r=n.target||de;t.bindTexture(r,e),ia(t,r,t.texParameteri,n)}function oa(t){return t=t||he.textureColor,ze(t)?t:new Uint8Array([t[0]*255,t[1]*255,t[2]*255,t[3]*255])}function Vt(t,e,n,r,i,o){n=n||he.textureOptions,o=o||D;const s=n.target||de;if(r=r||n.width,i=i||n.height,t.bindTexture(s,e),ta(t,r,i,o))t.generateMipmap(s);else{const a=na(o)?Bo:Mo;t.texParameteri(s,kt,a),t.texParameteri(s,Gt,a),t.texParameteri(s,ct,lt),t.texParameteri(s,ut,lt)}}function Oe(t){return t.auto===!0||t.auto===void 0&&t.level===void 0}function Ht(t,e){return e=e||{},e.cubeFaceOrder||[un,Uo,No,zo,Oo,$o]}function Xt(t,e){const r=Ht(t,e).map(function(i,o){return{face:i,ndx:o}});return r.sort(function(i,o){return i.face-o.face}),r}function pr(t,e,n,r){r=r||he.textureOptions;const i=r.target||de,o=r.level||0;let s=n.width,a=n.height;const l=r.internalFormat||r.format||D,c=ke(l),f=r.format||c.format,u=r.type||c.type;if(Pe(t,r),t.bindTexture(i,e),i===fe){const h=n.width,p=n.height;let d,b;if(h/6===p)d=p,b=[0,0,1,0,2,0,3,0,4,0,5,0];else if(p/6===h)d=h,b=[0,0,0,1,0,2,0,3,0,4,0,5];else if(h/3===p/2)d=h/3,b=[0,0,1,0,2,0,0,1,1,1,2,1];else if(h/2===p/3)d=h/2,b=[0,0,1,0,0,1,1,1,0,2,1,2];else throw"can't figure out cube map from element: "+(n.src?n.src:n.nodeName);const E=ar();E?(E.canvas.width=d,E.canvas.height=d,s=d,a=d,Xt(t,r).forEach(function(v){const x=b[v.ndx*2+0]*d,y=b[v.ndx*2+1]*d;E.drawImage(n,x,y,d,d,0,0,d,d),t.texImage2D(v.face,o,l,f,u,E.canvas)}),E.canvas.width=1,E.canvas.height=1):typeof createImageBitmap<"u"&&(s=d,a=d,Xt(t,r).forEach(function(v){const x=b[v.ndx*2+0]*d,y=b[v.ndx*2+1]*d;t.texImage2D(v.face,o,l,d,d,0,f,u,null),createImageBitmap(n,x,y,d,d,{premultiplyAlpha:"none",colorSpaceConversion:"none"}).then(function(_){Pe(t,r),t.bindTexture(i,e),t.texImage2D(v.face,o,l,f,u,_),Oe(r)&&Vt(t,e,r,s,a,l)})}))}else if(i===Ae||i===we){const h=Math.min(n.width,n.height),p=Math.max(n.width,n.height),d=p/h;if(d%1!==0)throw"can not compute 3D dimensions of element";const b=n.width===p?1:0,E=n.height===p?1:0;t.pixelStorei(fn,1),t.pixelStorei(lr,n.width),t.pixelStorei(cr,0),t.pixelStorei(hr,0),t.texImage3D(i,o,l,h,h,h,0,f,u,null);for(let v=0;v<d;++v){const x=v*h*b,y=v*h*E;t.pixelStorei(ur,x),t.pixelStorei(fr,y),t.texSubImage3D(i,o,0,0,v,h,h,1,f,u,n)}dr(t)}else t.texImage2D(i,o,l,f,u,n);Oe(r)&&Vt(t,e,r,s,a,l),mr(t,e,r)}function Ge(){}function sa(t){if(typeof document<"u"){const e=document.createElement("a");return e.href=t,e.hostname===location.hostname&&e.port===location.port&&e.protocol===location.protocol}else{const e=new URL(location.href).origin;return new URL(t,location.href).origin===e}}function aa(t,e){return e===void 0&&!sa(t)?"anonymous":e}function la(t,e,n){n=n||Ge;let r;if(e=e!==void 0?e:he.crossOrigin,e=aa(t,e),typeof Image<"u"){r=new Image,e!==void 0&&(r.crossOrigin=e);const i=function(){r.removeEventListener("error",o),r.removeEventListener("load",s),r=null},o=function(){const l="couldn't load image: "+t;Jn(l),n(l,r),i()},s=function(){n(null,r),i()};return r.addEventListener("error",o),r.addEventListener("load",s),r.src=t,r}else if(typeof ImageBitmap<"u"){let i,o;const s=function(){n(i,o)},a={};e&&(a.mode="cors"),fetch(t,a).then(function(l){if(!l.ok)throw l;return l.blob()}).then(function(l){return createImageBitmap(l,{premultiplyAlpha:"none",colorSpaceConversion:"none"})}).then(function(l){o=l,setTimeout(s)}).catch(function(l){i=l,setTimeout(s)}),r=null}return r}function xr(t){return typeof ImageBitmap<"u"&&t instanceof ImageBitmap||typeof ImageData<"u"&&t instanceof ImageData||typeof HTMLElement<"u"&&t instanceof HTMLElement}function hn(t,e,n){return xr(t)?(setTimeout(function(){n(null,t)}),t):la(t,e,n)}function dn(t,e,n){n=n||he.textureOptions;const r=n.target||de;if(t.bindTexture(r,e),n.color===!1)return;const i=oa(n.color);if(r===fe)for(let o=0;o<6;++o)t.texImage2D(un+o,0,D,1,1,0,D,R,i);else r===Ae||r===we?t.texImage3D(r,0,D,1,1,1,0,D,R,i):t.texImage2D(r,0,D,1,1,0,D,R,i)}function ca(t,e,n,r){return r=r||Ge,n=n||he.textureOptions,dn(t,e,n),n=Object.assign({},n),hn(n.src,n.crossOrigin,function(o,s){o?r(o,e,s):(pr(t,e,s,n),r(null,e,s))})}function ua(t,e,n,r){r=r||Ge;const i=n.src;if(i.length!==6)throw"there must be 6 urls for a cubemap";const o=n.level||0,s=n.internalFormat||n.format||D,a=ke(s),l=n.format||a.format,c=n.type||R,f=n.target||de;if(f!==fe)throw"target must be TEXTURE_CUBE_MAP";dn(t,e,n),n=Object.assign({},n);let u=6;const h=[],p=Ht(t,n);let d;function b(E){return function(v,x){--u,v?h.push(v):x.width!==x.height?h.push("cubemap face img is not a square: "+x.src):(Pe(t,n),t.bindTexture(f,e),u===5?Ht().forEach(function(y){t.texImage2D(y,o,s,l,c,x)}):t.texImage2D(E,o,s,l,c,x),Oe(n)&&t.generateMipmap(f)),u===0&&r(h.length?h:void 0,e,d)}}d=i.map(function(E,v){return hn(E,n.crossOrigin,b(p[v]))})}function fa(t,e,n,r){r=r||Ge;const i=n.src,o=n.internalFormat||n.format||D,s=ke(o),a=n.format||s.format,l=n.type||R,c=n.target||we;if(c!==Ae&&c!==we)throw"target must be TEXTURE_3D or TEXTURE_2D_ARRAY";dn(t,e,n),n=Object.assign({},n);let f=i.length;const u=[];let h;const p=n.level||0;let d=n.width,b=n.height;const E=i.length;let v=!0;function x(y){return function(_,S){if(--f,_)u.push(_);else{if(Pe(t,n),t.bindTexture(c,e),v){v=!1,d=n.width||S.width,b=n.height||S.height,t.texImage3D(c,p,o,d,b,E,0,a,l,null);for(let P=0;P<E;++P)t.texSubImage3D(c,p,0,0,P,d,b,1,a,l,S)}else{let P=S,F;(S.width!==d||S.height!==b)&&(F=ar(),P=F.canvas,F.canvas.width=d,F.canvas.height=b,F.drawImage(S,0,0,d,b)),t.texSubImage3D(c,p,0,0,y,d,b,1,a,l,P),F&&P===F.canvas&&(F.canvas.width=0,F.canvas.height=0)}Oe(n)&&t.generateMipmap(c)}f===0&&r(u.length?u:void 0,e,h)}}h=i.map(function(y,_){return hn(y,n.crossOrigin,x(_))})}function ha(t,e,n,r){r=r||he.textureOptions;const i=r.target||de;t.bindTexture(i,e);let o=r.width,s=r.height,a=r.depth;const l=r.level||0,c=r.internalFormat||r.format||D,f=ke(c),u=r.format||f.format,h=r.type||ra(t,n,f.type);if(ze(n))n instanceof Uint8ClampedArray&&(n=new Uint8Array(n.buffer));else{const E=Zn(h);n=new E(n)}const p=ea(c,h),d=n.byteLength/p;if(d%1)throw"length wrong size for format: "+at(t,u);let b;if(i===Ae||i===we)if(!o&&!s&&!a){const E=Math.cbrt(d);if(E%1!==0)throw"can't guess cube size of array of numElements: "+d;o=E,s=E,a=E}else o&&(!s||!a)?(b=tt(t,i,s,a,d/o),s=b.width,a=b.height):s&&(!o||!a)?(b=tt(t,i,o,a,d/s),o=b.width,a=b.height):(b=tt(t,i,o,s,d/a),o=b.width,s=b.height);else b=tt(t,i,o,s,d),o=b.width,s=b.height;if(dr(t),t.pixelStorei(fn,r.unpackAlignment||1),Pe(t,r),i===fe){const E=p/n.BYTES_PER_ELEMENT,v=d/6*E;Xt(t,r).forEach(x=>{const y=v*x.ndx,_=n.subarray(y,y+v);t.texImage2D(x.face,l,c,o,s,0,u,h,_)})}else i===Ae||i===we?t.texImage3D(i,l,c,o,s,a,0,u,h,n):t.texImage2D(i,l,c,o,s,0,u,h,n);return{width:o,height:s,depth:a,type:h}}function da(t,e,n){const r=n.target||de;t.bindTexture(r,e);const i=n.level||0,o=n.internalFormat||n.format||D,s=ke(o),a=n.format||s.format,l=n.type||s.type;if(Pe(t,n),r===fe)for(let c=0;c<6;++c)t.texImage2D(un+c,i,o,n.width,n.height,0,a,l,null);else r===Ae||r===we?t.texImage3D(r,i,o,n.width,n.height,n.depth,0,a,l,null):t.texImage2D(r,i,o,n.width,n.height,0,a,l,null)}function ma(t,e,n){n=n||Ge,e=e||he.textureOptions;const r=t.createTexture(),i=e.target||de;let o=e.width||1,s=e.height||1;const a=e.internalFormat||D;t.bindTexture(i,r),i===fe&&(t.texParameteri(i,ct,lt),t.texParameteri(i,ut,lt));let l=e.src;if(l)if(typeof l=="function"&&(l=l(t,e)),typeof l=="string")ca(t,r,e,n);else if(ze(l)||Array.isArray(l)&&(typeof l[0]=="number"||Array.isArray(l[0])||ze(l[0]))){const c=ha(t,r,l,e);o=c.width,s=c.height}else Array.isArray(l)&&(typeof l[0]=="string"||xr(l[0]))?i===fe?ua(t,r,e,n):fa(t,r,e,n):(pr(t,r,l,e),o=l.width,s=l.height);else da(t,r,e);return Oe(e)&&Vt(t,r,e,o,s,a),mr(t,r,e),r}const mn=Jn;function vr(t){return typeof document<"u"&&document.getElementById?document.getElementById(t):null}const ft=33984,bt=34962,pa=34963,xa=35713,va=35714,ba=35632,ya=35633,Ea=35981,br=35718,ga=35721,Aa=35971,wa=35382,_a=35396,Ta=35398,Sa=35392,Ca=35395,yt=5126,yr=35664,Er=35665,gr=35666,pn=5124,Ar=35667,wr=35668,_r=35669,Tr=35670,Sr=35671,Cr=35672,Rr=35673,Fr=35674,Dr=35675,Pr=35676,Ra=35678,Fa=35680,Da=35679,Pa=35682,Ia=35685,La=35686,Ma=35687,Ba=35688,Ua=35689,Na=35690,za=36289,Oa=36292,$a=36293,xn=5125,Ir=36294,Lr=36295,Mr=36296,ka=36298,Ga=36299,Va=36300,Ha=36303,Xa=36306,Ya=36307,Wa=36308,ja=36311,Et=3553,gt=34067,vn=32879,At=35866,w={};function Br(t,e){return w[e].bindPoint}function qa(t,e){return function(n){t.uniform1f(e,n)}}function Ka(t,e){return function(n){t.uniform1fv(e,n)}}function Qa(t,e){return function(n){t.uniform2fv(e,n)}}function Za(t,e){return function(n){t.uniform3fv(e,n)}}function Ja(t,e){return function(n){t.uniform4fv(e,n)}}function Ur(t,e){return function(n){t.uniform1i(e,n)}}function Nr(t,e){return function(n){t.uniform1iv(e,n)}}function zr(t,e){return function(n){t.uniform2iv(e,n)}}function Or(t,e){return function(n){t.uniform3iv(e,n)}}function $r(t,e){return function(n){t.uniform4iv(e,n)}}function el(t,e){return function(n){t.uniform1ui(e,n)}}function tl(t,e){return function(n){t.uniform1uiv(e,n)}}function nl(t,e){return function(n){t.uniform2uiv(e,n)}}function rl(t,e){return function(n){t.uniform3uiv(e,n)}}function il(t,e){return function(n){t.uniform4uiv(e,n)}}function ol(t,e){return function(n){t.uniformMatrix2fv(e,!1,n)}}function sl(t,e){return function(n){t.uniformMatrix3fv(e,!1,n)}}function al(t,e){return function(n){t.uniformMatrix4fv(e,!1,n)}}function ll(t,e){return function(n){t.uniformMatrix2x3fv(e,!1,n)}}function cl(t,e){return function(n){t.uniformMatrix3x2fv(e,!1,n)}}function ul(t,e){return function(n){t.uniformMatrix2x4fv(e,!1,n)}}function fl(t,e){return function(n){t.uniformMatrix4x2fv(e,!1,n)}}function hl(t,e){return function(n){t.uniformMatrix3x4fv(e,!1,n)}}function dl(t,e){return function(n){t.uniformMatrix4x3fv(e,!1,n)}}function N(t,e,n,r){const i=Br(t,e);return $e(t)?function(o){let s,a;!o||ln(t,o)?(s=o,a=null):(s=o.texture,a=o.sampler),t.uniform1i(r,n),t.activeTexture(ft+n),t.bindTexture(i,s),t.bindSampler(n,a)}:function(o){t.uniform1i(r,n),t.activeTexture(ft+n),t.bindTexture(i,o)}}function z(t,e,n,r,i){const o=Br(t,e),s=new Int32Array(i);for(let a=0;a<i;++a)s[a]=n+a;return $e(t)?function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(ft+s[c]);let f,u;!l||ln(t,l)?(f=l,u=null):(f=l.texture,u=l.sampler),t.bindSampler(n,u),t.bindTexture(o,f)})}:function(a){t.uniform1iv(r,s),a.forEach(function(l,c){t.activeTexture(ft+s[c]),t.bindTexture(o,l)})}}w[yt]={Type:Float32Array,size:4,setter:qa,arraySetter:Ka};w[yr]={Type:Float32Array,size:8,setter:Qa,cols:2};w[Er]={Type:Float32Array,size:12,setter:Za,cols:3};w[gr]={Type:Float32Array,size:16,setter:Ja,cols:4};w[pn]={Type:Int32Array,size:4,setter:Ur,arraySetter:Nr};w[Ar]={Type:Int32Array,size:8,setter:zr,cols:2};w[wr]={Type:Int32Array,size:12,setter:Or,cols:3};w[_r]={Type:Int32Array,size:16,setter:$r,cols:4};w[xn]={Type:Uint32Array,size:4,setter:el,arraySetter:tl};w[Ir]={Type:Uint32Array,size:8,setter:nl,cols:2};w[Lr]={Type:Uint32Array,size:12,setter:rl,cols:3};w[Mr]={Type:Uint32Array,size:16,setter:il,cols:4};w[Tr]={Type:Uint32Array,size:4,setter:Ur,arraySetter:Nr};w[Sr]={Type:Uint32Array,size:8,setter:zr,cols:2};w[Cr]={Type:Uint32Array,size:12,setter:Or,cols:3};w[Rr]={Type:Uint32Array,size:16,setter:$r,cols:4};w[Fr]={Type:Float32Array,size:32,setter:ol,rows:2,cols:2};w[Dr]={Type:Float32Array,size:48,setter:sl,rows:3,cols:3};w[Pr]={Type:Float32Array,size:64,setter:al,rows:4,cols:4};w[Ia]={Type:Float32Array,size:32,setter:ll,rows:2,cols:3};w[La]={Type:Float32Array,size:32,setter:ul,rows:2,cols:4};w[Ma]={Type:Float32Array,size:48,setter:cl,rows:3,cols:2};w[Ba]={Type:Float32Array,size:48,setter:hl,rows:3,cols:4};w[Ua]={Type:Float32Array,size:64,setter:fl,rows:4,cols:2};w[Na]={Type:Float32Array,size:64,setter:dl,rows:4,cols:3};w[Ra]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:Et};w[Fa]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:gt};w[Da]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:vn};w[Pa]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:Et};w[za]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:At};w[Oa]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:At};w[$a]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:gt};w[ka]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:Et};w[Ga]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:vn};w[Va]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:gt};w[Ha]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:At};w[Xa]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:Et};w[Ya]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:vn};w[Wa]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:gt};w[ja]={Type:null,size:0,setter:N,arraySetter:z,bindPoint:At};function wt(t,e){return function(n){if(n.value)switch(t.disableVertexAttribArray(e),n.value.length){case 4:t.vertexAttrib4fv(e,n.value);break;case 3:t.vertexAttrib3fv(e,n.value);break;case 2:t.vertexAttrib2fv(e,n.value);break;case 1:t.vertexAttrib1fv(e,n.value);break;default:throw new Error("the length of a float constant value must be between 1 and 4!")}else t.bindBuffer(bt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribPointer(e,n.numComponents||n.size,n.type||yt,n.normalize||!1,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function me(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4iv(e,n.value);else throw new Error("The length of an integer constant value must be 4!");else t.bindBuffer(bt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||pn,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function _t(t,e){return function(n){if(n.value)if(t.disableVertexAttribArray(e),n.value.length===4)t.vertexAttrib4uiv(e,n.value);else throw new Error("The length of an unsigned integer constant value must be 4!");else t.bindBuffer(bt,n.buffer),t.enableVertexAttribArray(e),t.vertexAttribIPointer(e,n.numComponents||n.size,n.type||xn,n.stride||0,n.offset||0),t.vertexAttribDivisor&&t.vertexAttribDivisor(e,n.divisor||0)}}function bn(t,e,n){const r=n.size,i=n.count;return function(o){t.bindBuffer(bt,o.buffer);const s=o.size||o.numComponents||r,a=s/i,l=o.type||yt,f=w[l].size*s,u=o.normalize||!1,h=o.offset||0,p=f/i;for(let d=0;d<i;++d)t.enableVertexAttribArray(e+d),t.vertexAttribPointer(e+d,a,l,u,f,h+p*d),t.vertexAttribDivisor&&t.vertexAttribDivisor(e+d,o.divisor||0)}}const L={};L[yt]={size:4,setter:wt};L[yr]={size:8,setter:wt};L[Er]={size:12,setter:wt};L[gr]={size:16,setter:wt};L[pn]={size:4,setter:me};L[Ar]={size:8,setter:me};L[wr]={size:12,setter:me};L[_r]={size:16,setter:me};L[xn]={size:4,setter:_t};L[Ir]={size:8,setter:_t};L[Lr]={size:12,setter:_t};L[Mr]={size:16,setter:_t};L[Tr]={size:4,setter:me};L[Sr]={size:8,setter:me};L[Cr]={size:12,setter:me};L[Rr]={size:16,setter:me};L[Fr]={size:4,setter:bn,count:2};L[Dr]={size:9,setter:bn,count:3};L[Pr]={size:16,setter:bn,count:4};const ml=/ERROR:\s*\d+:(\d+)/gi;function pl(t,e="",n=0){const r=[...e.matchAll(ml)],i=new Map(r.map((o,s)=>{const a=parseInt(o[1]),l=r[s+1],c=l?l.index:e.length,f=e.substring(o.index,c);return[a-1,f]}));return t.split(`
`).map((o,s)=>{const a=i.get(s);return`${s+1+n}: ${o}${a?`

^^^ ${a}`:""}`}).join(`
`)}const $n=/^[ \t]*\n/;function kr(t){let e=0;return $n.test(t)&&(e=1,t=t.replace($n,"")),{lineOffset:e,shaderSource:t}}function xl(t,e){return t.errorCallback(e),t.callback&&setTimeout(()=>{t.callback(`${e}
${t.errors.join(`
`)}`)}),null}function vl(t,e,n,r){if(r=r||mn,!t.getShaderParameter(n,xa)){const o=t.getShaderInfoLog(n),{lineOffset:s,shaderSource:a}=kr(t.getShaderSource(n)),l=`${pl(a,o,s)}
Error compiling ${at(t,e)}: ${o}`;return r(l),l}return""}function yn(t,e,n){let r,i,o;if(typeof e=="function"&&(n=e,e=void 0),typeof t=="function")n=t,t=void 0;else if(t&&!Array.isArray(t)){const c=t;n=c.errorCallback,t=c.attribLocations,r=c.transformFeedbackVaryings,i=c.transformFeedbackMode,o=c.callback}const s=n||mn,a=[],l={errorCallback(c,...f){a.push(c),s(c,...f)},transformFeedbackVaryings:r,transformFeedbackMode:i,callback:o,errors:a};{let c={};Array.isArray(t)?t.forEach(function(f,u){c[f]=e?e[u]:u}):c=t||{},l.attribLocations=c}return l}const bl=["VERTEX_SHADER","FRAGMENT_SHADER"];function yl(t,e){if(e.indexOf("frag")>=0)return ba;if(e.indexOf("vert")>=0)return ya}function El(t,e,n){const r=t.getAttachedShaders(e);for(const i of r)n.has(i)&&t.deleteShader(i);t.deleteProgram(e)}const gl=(t=0)=>new Promise(e=>setTimeout(e,t));function Al(t,e,n){const r=t.createProgram(),{attribLocations:i,transformFeedbackVaryings:o,transformFeedbackMode:s}=yn(n);for(let a=0;a<e.length;++a){let l=e[a];if(typeof l=="string"){const c=vr(l),f=c?c.text:l;let u=t[bl[a]];c&&c.type&&(u=yl(t,c.type)||u),l=t.createShader(u),t.shaderSource(l,kr(f).shaderSource),t.compileShader(l),t.attachShader(r,l)}}Object.entries(i).forEach(([a,l])=>t.bindAttribLocation(r,l,a));{let a=o;a&&(a.attribs&&(a=a.attribs),Array.isArray(a)||(a=Object.keys(a)),t.transformFeedbackVaryings(r,a,s||Ea))}return t.linkProgram(r),r}function wl(t,e,n,r,i){const o=yn(n,r,i),s=new Set(e),a=Al(t,e,o);function l(c,f){const u=Tl(c,f,o.errorCallback);return u&&El(c,f,s),u}if(o.callback){_l(t,a).then(()=>{const c=l(t,a);o.callback(c,c?void 0:a)});return}return l(t,a)?void 0:a}async function _l(t,e){const n=t.getExtension("KHR_parallel_shader_compile"),r=n?(o,s)=>o.getProgramParameter(s,n.COMPLETION_STATUS_KHR):()=>!0;let i=0;do await gl(i),i=1e3/60;while(!r(t,e))}function Tl(t,e,n){if(n=n||mn,!t.getProgramParameter(e,va)){const i=t.getProgramInfoLog(e);n(`Error in program linking: ${i}`);const s=t.getAttachedShaders(e).map(a=>vl(t,t.getShaderParameter(a,t.SHADER_TYPE),a,n));return`${i}
${s.filter(a=>a).join(`
`)}`}}function Sl(t,e,n,r,i){return wl(t,e,n,r,i)}function Gr(t){const e=t.name;return e.startsWith("gl_")||e.startsWith("webgl_")}const Cl=/(\.|\[|]|\w+)/g,Rl=t=>t>="0"&&t<="9";function Fl(t,e,n,r){const i=t.split(Cl).filter(a=>a!=="");let o=0,s="";for(;;){const a=i[o++];s+=a;const l=Rl(a[0]),c=l?parseInt(a):a;if(l&&(s+=i[o++]),o===i.length){n[c]=e;break}else{const u=i[o++],h=u==="[",p=n[c]||(h?[]:{});n[c]=p,n=p,r[s]=r[s]||function(d){return function(b){Vr(d,b)}}(p),s+=u}}}function Dl(t,e){let n=0;function r(a,l,c){const f=l.name.endsWith("[0]"),u=l.type,h=w[u];if(!h)throw new Error(`unknown type: 0x${u.toString(16)}`);let p;if(h.bindPoint){const d=n;n+=l.size,f?p=h.arraySetter(t,u,d,c,l.size):p=h.setter(t,u,d,c,l.size)}else h.arraySetter&&f?p=h.arraySetter(t,c):p=h.setter(t,c);return p.location=c,p}const i={},o={},s=t.getProgramParameter(e,br);for(let a=0;a<s;++a){const l=t.getActiveUniform(e,a);if(Gr(l))continue;let c=l.name;c.endsWith("[0]")&&(c=c.substr(0,c.length-3));const f=t.getUniformLocation(e,l.name);if(f){const u=r(e,l,f);i[c]=u,Fl(c,u,o,i)}}return i}function Pl(t,e){const n={},r=t.getProgramParameter(e,Aa);for(let i=0;i<r;++i){const o=t.getTransformFeedbackVarying(e,i);n[o.name]={index:i,type:o.type,size:o.size}}return n}function Il(t,e){const n=t.getProgramParameter(e,br),r=[],i=[];for(let a=0;a<n;++a){i.push(a),r.push({});const l=t.getActiveUniform(e,a);r[a].name=l.name}[["UNIFORM_TYPE","type"],["UNIFORM_SIZE","size"],["UNIFORM_BLOCK_INDEX","blockNdx"],["UNIFORM_OFFSET","offset"]].forEach(function(a){const l=a[0],c=a[1];t.getActiveUniforms(e,i,t[l]).forEach(function(f,u){r[u][c]=f})});const o={},s=t.getProgramParameter(e,wa);for(let a=0;a<s;++a){const l=t.getActiveUniformBlockName(e,a),c={index:t.getUniformBlockIndex(e,l),usedByVertexShader:t.getActiveUniformBlockParameter(e,a,_a),usedByFragmentShader:t.getActiveUniformBlockParameter(e,a,Ta),size:t.getActiveUniformBlockParameter(e,a,Sa),uniformIndices:t.getActiveUniformBlockParameter(e,a,Ca)};c.used=c.usedByVertexShader||c.usedByFragmentShader,o[l]=c}return{blockSpecs:o,uniformData:r}}function Vr(t,e){for(const n in e){const r=t[n];typeof r=="function"?r(e[n]):Vr(t[n],e[n])}}function Hr(t,...e){const n=t.uniformSetters||t,r=e.length;for(let i=0;i<r;++i){const o=e[i];if(Array.isArray(o)){const s=o.length;for(let a=0;a<s;++a)Hr(n,o[a])}else for(const s in o){const a=n[s];a&&a(o[s])}}}function Ll(t,e){const n={},r=t.getProgramParameter(e,ga);for(let i=0;i<r;++i){const o=t.getActiveAttrib(e,i);if(Gr(o))continue;const s=t.getAttribLocation(e,o.name),a=L[o.type],l=a.setter(t,s,a);l.location=s,n[o.name]=l}return n}function Ml(t,e){for(const n in e){const r=t[n];r&&r(e[n])}}function En(t,e,n){n.vertexArrayObject?t.bindVertexArray(n.vertexArrayObject):(Ml(e.attribSetters||e,n.attribs),n.indices&&t.bindBuffer(pa,n.indices))}function kn(t,e){const n=Dl(t,e),r=Ll(t,e),i={program:e,uniformSetters:n,attribSetters:r};return $e(t)&&(i.uniformBlockSpec=Il(t,e),i.transformFeedbackInfo=Pl(t,e)),i}const Bl=/\s|{|}|;/;function ie(t,e,n,r,i){const o=yn(n,r,i),s=[];if(e=e.map(function(c){if(!Bl.test(c)){const f=vr(c);if(f)c=f.text;else{const u=`no element with id: ${c}`;o.errorCallback(u),s.push(u)}}return c}),s.length)return xl(o,"");const a=o.callback;a&&(o.callback=(c,f)=>{a(c,c?void 0:kn(t,f))});const l=Sl(t,e,o);return l?kn(t,l):null}const Ul=4,Gn=5123;function Xr(t,e,n,r,i,o){n=n===void 0?Ul:n;const s=e.indices,a=e.elementType,l=r===void 0?e.numElements:r;i=i===void 0?0:i,a||s?o!==void 0?t.drawElementsInstanced(n,l,a===void 0?Gn:e.elementType,i,o):t.drawElements(n,l,a===void 0?Gn:e.elementType,i):o!==void 0?t.drawArraysInstanced(n,i,l,o):t.drawArrays(n,i,l)}const Yr=36160,nt=36161,Nl=3553,zl=5121,Ol=6402,$l=6408,kl=33190,Gl=36012,Vl=35056,Hl=36013,Xl=32854,Yl=32855,Wl=36194,Wr=33189,jr=6401,qr=36168,gn=34041,Yt=36064,Tt=36096,Kr=36128,An=33306,Wt=33071,jt=9729,jl=[{format:$l,type:zl,min:jt,wrap:Wt},{format:gn}],te={};te[gn]=An;te[jr]=Kr;te[qr]=Kr;te[Ol]=Tt;te[Wr]=Tt;te[kl]=Tt;te[Gl]=Tt;te[Vl]=An;te[Hl]=An;function ql(t,e){return te[t]||te[e]}const pe={};pe[Xl]=!0;pe[Yl]=!0;pe[Wl]=!0;pe[gn]=!0;pe[Wr]=!0;pe[jr]=!0;pe[qr]=!0;function Kl(t){return pe[t]}const Ql=32;function Zl(t){return t>=Yt&&t<Yt+Ql}function ye(t,e,n,r){const i=Yr,o=t.createFramebuffer();t.bindFramebuffer(i,o),n=n||t.drawingBufferWidth,r=r||t.drawingBufferHeight,e=e||jl;const s=[],a={framebuffer:o,attachments:[],width:n,height:r};return e.forEach(function(l,c){let f=l.attachment;const u=l.samples,h=l.format;let p=l.attachmentPoint||ql(h,l.internalFormat);if(p||(p=Yt+c),Zl(p)&&s.push(p),!f)if(u!==void 0||Kl(h))f=t.createRenderbuffer(),t.bindRenderbuffer(nt,f),u>1?t.renderbufferStorageMultisample(nt,u,h,n,r):t.renderbufferStorage(nt,h,n,r);else{const d=Object.assign({},l);d.width=n,d.height=r,d.auto===void 0&&(d.auto=!1,d.min=d.min||d.minMag||jt,d.mag=d.mag||d.minMag||jt,d.wrapS=d.wrapS||d.wrap||Wt,d.wrapT=d.wrapT||d.wrap||Wt),f=ma(t,d)}if(co(t,f))t.framebufferRenderbuffer(i,p,nt,f);else if(ln(t,f))l.layer!==void 0?t.framebufferTextureLayer(i,p,f,l.level||0,l.layer):t.framebufferTexture2D(i,p,l.target||Nl,f,l.level||0);else throw new Error("unknown attachment type");a.attachments.push(f)}),t.drawBuffers&&t.drawBuffers(s),a}function Qr(t,e,n){n=n||Yr,e?(t.bindFramebuffer(n,e.framebuffer),t.viewport(0,0,e.width,e.height)):(t.bindFramebuffer(n,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight))}function Jl(t,e,n){const r=t.createVertexArray();return t.bindVertexArray(r),e.length||(e=[e]),e.forEach(function(i){En(t,i,n)}),t.bindVertexArray(null),{numElements:n.numElements,elementType:n.elementType,vertexArrayObject:r}}const ec=/^(.*?)_/;function tc(t,e){at(t,0);const n=t.getExtension(e);if(n){const r={},i=ec.exec(e)[1],o="_"+i;for(const s in n){const a=n[s],l=typeof a=="function",c=l?i:o;let f=s;s.endsWith(c)&&(f=s.substring(0,s.length-c.length)),t[f]!==void 0?!l&&t[f]!==a&&ao(f,t[f],a,s):l?t[f]=function(u){return function(){return u.apply(n,arguments)}}(a):(t[f]=a,r[f]=a)}r.constructor={name:n.constructor.name},at(r,0)}return n}const Vn=["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_color_buffer_float","EXT_color_buffer_half_float","EXT_disjoint_timer_query","EXT_disjoint_timer_query_webgl2","EXT_frag_depth","EXT_sRGB","EXT_shader_texture_lod","EXT_texture_filter_anisotropic","OES_element_index_uint","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_color_buffer_float","WEBGL_compressed_texture_atc","WEBGL_compressed_texture_etc1","WEBGL_compressed_texture_pvrtc","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_depth_texture","WEBGL_draw_buffers"];function nc(t){for(let e=0;e<Vn.length;++e)tc(t,Vn[e])}function rc(t,e){e=e||1,e=Math.max(0,e);const n=t.clientWidth*e|0,r=t.clientHeight*e|0;return t.width!==n||t.height!==r?(t.width=n,t.height=r,!0):!1}Number.prototype.clamp=function(t,e){return Math.min(Math.max(this,t),e)};Number.prototype.mix=function(t,e){return this*(1-e)+t*e};class ic{fetchUpdates(){const e=this.events;return this.events=[],e}getState(){return this.state}storeEvent(e){switch(e.frame=this.frame,e.type){case"blur":case"focusout":this.state={};break;case"keyup":delete this.state[e.key];break;case"keydown":this.state[e.key]||(this.state[e.key]={frame:this.frame});break;case"pointerup":case"pointermove":case"pointerdown":this.state.mouse={pos:e.pos,buttons:e.buttons};break;case"wheel":this.state.wheel||(this.state.wheel={y:0}),this.state.wheel.y+=e.deltaYl;break}}constructor(e){this.state={},this.frame=0,this.events=[],this.sizes={width:1,height:1},this.listeners=[],window.addEventListener("blur",i=>{this.storeEvent({type:i.type})}),window.addEventListener("focusout",i=>{this.storeEvent({type:i.type})}),window.addEventListener("keydown",i=>{const o=i.key.toLowerCase();o!=="f12"&&(i.preventDefault(),this.storeEvent({key:o,type:i.type}))}),window.addEventListener("keyup",i=>{const o=i.key.toLowerCase();i.preventDefault(),this.storeEvent({key:o,type:i.type})});const n=i=>{const{sizes:o}=this;if(i.target.className!=="webgl")return;const s=[(i.clientX-o.horizontalOffset)/o.width*2-1,-((i.clientY-o.verticalOffset)/o.height)*2+1];this.storeEvent({type:i.type,pos:s,buttons:i.buttons})},r=i=>{this.storeEvent({type:i.type,deltaY:i.deltaY})};window.addEventListener("wheel",r),window.addEventListener("pointerdown",n),window.addEventListener("pointerup",n),window.addEventListener("pointermove",n),window.addEventListener("contextmenu",i=>(i.preventDefault(),!1),!1),e.listeners.push(this),e.update()}updateTime({frame:e}){this.frame=e}updateSize(e){this.sizes=e}}const T=class T{constructor(e,n,r=null,i=null){this.x=e,this.y=n,r!==null?(this.z=r,i!==null?(this.w=i,this.length=4):this.length=3):this.length=2}copy(e){return this.x=e.x,this.y=e.y,this.length>3&&(this.w=e.w??0),this.length>2&&(this.z=e.z??0),this}add(e){const n=typeof e=="number";return this.x+=n?e:e.x,this.y+=n?e:e.y,this.length>2&&(this.z+=n?e:e.z??0),this.length>3&&(this.w+=n?e:e.w??0),this}sub(e){const n=typeof e=="number";return this.x-=n?e:e.x,this.y-=n?e:e.y,this.length>2&&(this.z-=n?e:e.z??0),this.length>3&&(this.w-=n?e:e.w??0),this}mul(e){const n=typeof e=="number";return this.x*=n?e:e.x,this.y*=n?e:e.y,this.length>2&&(this.z*=n?e:e.z??0),this.length>3&&(this.w*=n?e:e.w??0),this}div(e){const n=typeof e=="number";return this.x/=n?e:e.x,this.y/=n?e:e.y,this.length>2&&(this.z/=n?e:e.z??0),this.length>3&&(this.w/=n?e:e.w??0),this}dot(e){let n=0;return n+=this.x*e.x,n+=this.y*e.y,n+=(this.z??0)*(e.z??0),n+=(this.w??0)*(e.w??0),n}min(e){const n=typeof e=="number";return this.x=Math.min(this.x,n?e:e.x),this.y=Math.min(this.y,n?e:e.y),this.length>2&&(this.z=Math.min(this.z,n?e:e.z??0)),this.length>3&&(this.w=Math.min(this.w,n?e:e.w??0)),this}clamp(e,n){return this.x=this.x.clamp(e,n),this.y=this.y.clamp(e,n),this.length>2&&(this.z=this.z.clamp(e,n)),this.length>3&&(this.w=this.w.clamp(e,n)),this}max(e){const n=typeof e=="number";return this.x=Math.max(this.x,n?e:e.x),this.y=Math.max(this.y,n?e:e.y),this.length>2&&(this.z=Math.max(this.z,n?e:e.z??0)),this.length>3&&(this.w=Math.max(this.w,n?e:e.w??0)),this}normalize(){const e=this.len();return this.x/=e,this.y/=e,this.length>2&&(this.z/=e),this.length>3&&(this.w/=e),this}cross(e){if(this.length===2)return this.x*e.y-this.y*e.x;if(this.length===3){const n=e.z??0,r=this.y*n-this.z*e.y,i=this.z*e.x-this.x*n,o=this.x*e.y-this.y*e.x;return this.x=r,this.y=i,this.z=o,this}else throw new Error("Can't do 4D cross (yet?)")}len(){return Math.sqrt(this.lenSq())}lenSq(){return this.dot(this)}clone(){return new T(this.x,this.y,this.z!==void 0?this.z:null,this.w!==void 0?this.w:null)}abs(){return this.x=Math.abs(this.x),this.y=Math.abs(this.y),this.length>2&&(this.z=Math.abs(this.z)),this.length>3&&(this.w=Math.abs(this.w)),this}};I(T,"X2",new T(1,0)),I(T,"X3",new T(1,0,0)),I(T,"X4",new T(1,0,0,0)),I(T,"Y2",new T(0,1)),I(T,"Y3",new T(0,1,0)),I(T,"Y4",new T(0,1,0,0)),I(T,"Z3",new T(0,0,1)),I(T,"Z4",new T(0,0,1,0)),I(T,"W4",new T(0,0,0,1)),I(T,"ONE2",new T(1,1)),I(T,"ONE3",new T(1,1,1)),I(T,"ONE4",new T(1,1,1,1)),I(T,"ZERO2",new T(0,0)),I(T,"ZERO3",new T(0,0,0)),I(T,"ZERO4",new T(0,0,0,0));let g=T;const De=class De{constructor(e,n,r){switch(this.scale=n,this.color=r,e){case"box":this.vertices=De.boxVertices;break;case"sphere":this.vertices=De.circleVertices;break;default:throw new Error("Unknown Mesh Type")}}};I(De,"circleVertices",(()=>{const e=[];for(var r=0;r<=32;r++)e.push(Math.sin(r*Math.PI*2/32),Math.cos(r*Math.PI*2/32));return e})()),I(De,"boxVertices",[1,1,1,-1,-1,-1,-1,1]);let _e=De;class St{constructor(e,n){switch(this.scale=n,e){case"box":this.type=e;break;case"sphere":this.type=e;break;default:throw new Error("Unknown Mesh Type")}}}function oc(t,e,n){const r=n.clone().sub(e),o=(t.clone().sub(e).dot(r)/r.lenSq()).clamp(0,1);return e.clone().add(r.mul(o)).sub(t).len()}class O{constructor({normal:e}){this.normal=e}}class Ve{constructor({position:e=new g(0,0),velocity:n=new g(0,0),collider:r=null,mesh:i=null}){this.position=e,this.velocity=n,i&&(this.mesh=i),r&&(this.collider=r)}collides(e){if(!this.collider||!e.collider)return!1;const n=this.collider.scale,r=e.collider.scale,i=this.position.clone().sub(e.position),o=i.clone().abs();switch(this.collider.type){case"sphere":switch(e.collider.type){case"sphere":const s=this.position.clone(),a=s.clone().add(i.clone().mul(-1).mul(n).normalize().mul(n));return s.sub(e.position).div(r),a.sub(e.position).div(r),oc(e.position,s,a)<=1?new O({normal:i.normalize().mul(-1)}):i.clone().div(n).len()<=1||i.clone().div(r).len()<=1?new O({normal:i.normalize().mul(-1)}):null;case"box":return o.sub(r).div(n),o.x<=0&&o.y<=0?new O({normal:i.normalize().mul(-1)}):o.x<=0&&o.y<=1?i.y>0?new O({normal:new g(0,1)}):new O({normal:new g(0,-1)}):o.x<=1&&o.y<=0?i.x>0?new O({normal:new g(1,0)}):new O({normal:new g(-1,0)}):o.lenSq()<=1?(console.log("corner"),new O({normal:o.normalize().mul(-1)})):null;default:return new Error("Unknown type.")}case"box":switch(e.collider.type){case"sphere":return o.sub(n).div(r),o.x<=0&&o.y<=0?new O({normal:i.normalize().mul(-1)}):o.x<=0&&o.y<=1?i.y>0?new O({normal:new g(0,1)}):new O({normal:new g(0,-1)}):o.x<=1&&o.y<=0?i.x>0?new O({normal:new g(1,0)}):new O({normal:new g(-1,0)}):o.lenSq()<=1?(console.log("corner"),new O({normal:o.normalize().mul(-1)})):null;case"box":return o.sub(n).sub(r),o.x<=2&&o.y<=2;default:return new Error("Unknown type.")}default:return new Error("Unknown type.")}}}function sc(){Array.prototype.peek=function(){return this.length?this[this.length-1]:null},Array.prototype.equals=function(t){if(!Array.isArray(t)||t.length!==this.length)return!1;for(var e=0;e<this.length;e++)if(this[e]!==t[e])return!1;return!0}}sc();class ac{constructor(){this.states=[]}stateParams(){return{}}cleanup(){for(;this.states.length;)this.cleanupState(this.states.pop())}currentState(){return this.states.peek()}addState(e){e.init(this),this.states.push(e)}cleanupState(e){e&&e.cleanup(this)}replaceState(e){this.cleanupState(this.states.pop()),this.addState(e)}pushState(e){var n;(n=this.currentState())==null||n.pause(),this.addState(e)}popState(){var e;this.cleanupState(this.states.pop()),(e=this.currentState())==null||e.resume()}}class lc{constructor(){}init(e){}cleanup(){}pause(){}resume(){}}const qt={enabled:!1},cc=console.log;console.log=function(){qt.enabled&&cc.apply(this,arguments)};function uc(t){qt.enabled=!0;const e=t();return qt.enabled=!1,e}function Fe({min:t=0,max:e,steps:n=2}){return Math.floor(n*Math.random())/(n-1)*(e-t)+t}class wn{constructor(){this.type=Object.getPrototypeOf(this).constructor}}class Kt extends wn{constructor(e){super(),this.playerIndex=e}}class Qt extends wn{constructor(e,n){super(),this.playerIndex=e,this.direction=n}}class Hn extends wn{constructor(e){super(),this.delta=e}}class fc extends lc{update(e,n,r){const i=(r.w!==void 0)-+(r.s!==void 0),o=(r.arrowup!==void 0)-+(r.arrowdown!==void 0);e.commands.push(new Qt(0,i)),r.d!==void 0&&e.commands.push(new Kt(0)),e.commands.push(new Qt(1,o)),r.arrowleft!==void 0&&e.commands.push(new Kt(1))}}class hc extends ac{constructor(){super(),this.pushState(new fc)}init(){}update(e,n){var r;(r=this.currentState())==null||r.update(e,this,n)}}const se=class se extends Ve{constructor({position:e,color:n,attackDir:r}){super({position:e,collider:new St("box",new g(.02,.2)),mesh:new _e("box",new g(.02,.2),n)}),this.origin=e.clone(),this.attackDir=r.mul(se.attackDistance),this.size=new g(.02,.2),this.direction=0,this.attackData={time:0}}isAttacking(){return this.attackData.time>.8*se.attackTime}attackAnimation(){this.position.x=this.origin.x+this.attackDir.x.mix(0,1-(this.attackData.time/se.attackTime).clamp(0,1))}update(e){this.position.y+=e*this.direction*2,this.position.y=Math.min(Math.max(this.position.y,-1+this.size.y),1-this.size.y),this.attackData.time-=e,this.attackAnimation()}attack(){this.attackData.time>0||(this.attackData.time=se.attackTime,this.position.add(this.attackDir.clone().mul(se.attackDistance)))}};I(se,"attackTime",.2),I(se,"attackDistance",.1);let ht=se;class dc extends Ve{constructor({position:e,velocity:n}){const r=new g(1,1,1,1);super({position:e,velocity:n,collider:new St("sphere",new g(.05,.05)),mesh:new _e("sphere",new g(.05,.05),r)}),this.size=.05}}class mc extends Ve{constructor({position:e,size:n,triggerSize:r}){const i=new g(0,0,0,1);super({position:e,collider:new St("sphere",new g(r,r)),mesh:new _e("sphere",new g(n,n),i)}),this.size=n,this.origin=e.clone()}}class pc extends Ve{constructor({position:e,color:n,size:r,velocity:i,totalTime:o,timeToLive:s}){super({position:e,velocity:i,mesh:new _e("sphere",new g(r,r),n)}),this.size=r,this.orginalColor=n.clone(),this.originalScale=r,this.totalTime=o,this.timeToLive=o}}class rt extends Ve{constructor({position:e,scale:n}){super({position:e,collider:new St("box",n),mesh:new _e("box",new g(n,n))})}}class xc{constructor(e){this.commands=[],this.data=e,e.listeners.push(this),this.data.state.balls=this.setupBalls(),this.data.state.ball=new dc({position:new g(0,0),velocity:new g(.6,.8).mul(2)}),this.data.state.paddles=[new ht({position:new g(-1.9,0),color:new g(1,0,0,1),attackDir:new g(1,0)}),new ht({position:new g(1.9,0),color:new g(0,1,0,1),attackDir:new g(-1,0)})],this.data.state.walls=[new rt({position:new g(-3,0),scale:new g(1,2)}),new rt({position:new g(3,0),scale:new g(1,2)}),new rt({position:new g(0,2),scale:new g(3,1)}),new rt({position:new g(0,-2),scale:new g(3,1)})],this.data.state.particles=[]}setupBalls(){const e=[];for(var n=0;n<1e3;n++){const r=new g(Fe({max:1.2,min:-1.5,steps:200}),Fe({max:.95,min:-.95,steps:100})),i=Fe({max:.02,min:.01,steps:5});e.push(new mc({position:r,size:i,triggerSize:.1}))}return e}configUpdated(){this.data.state.lines||(this.data.state.lines=[])}updateColor(e){this.activeColor=structuredClone(e),this.activeColor.push(1),this.currLine.color=this.activeColor}moveBall(e){const{ball:n,walls:r,paddles:i}=this.data.state;n.position.x+=e*n.velocity.x,n.position.y+=e*n.velocity.y;var o={hit:!1};for(let s=0;s<r.length;s++){const a=r[s],l=n.collides(a);if(l&&n.velocity.dot(l.normal)<0){o.startVelocity=n.velocity.clone(),o.normal=l.normal;const c=g.Z3.clone().cross(l.normal).normalize();c.mul(c.dot(n.velocity));const f=n.velocity.clone().sub(c);n.velocity.add(f.mul(-2)),o.hit=!0,o.endVelocity=n.velocity.clone()}}for(let s=0;s<i.length;s++){const a=i[s],l=n.collides(a);if(l&&n.velocity.dot(l.normal)<0){o.startVelocity=n.velocity.clone(),o.normal=l.normal;const c=g.Z3.clone().cross(l.normal).normalize();c.mul(c.dot(n.velocity));const f=n.velocity.clone().sub(c);n.velocity.add(f.mul(-2)),n.mesh.color=a.mesh.color,o.hit=!0,a.isAttacking()&&n.velocity.add(f.mul(.4)),a.direction&&(n.velocity.y+=a.direction*1),o.endVelocity=n.velocity.clone()}}return o}spawnParticles({startVelocity:e,endVelocity:n,normal:r}){const{ball:i,particles:o}=this.data.state;n.normalize().dot(e.normalize())>0;{const s=n.clone().add(e).normalize(),a=s.clone().mul(-1);Math.atan2(a.y,a.x)+Math.PI,e.mul(-1),Math.atan2(e.y,e.x)+Math.PI,Math.atan2(n.y,n.x)+Math.PI,Math.atan2(s.y,s.x)+Math.PI;for(let l=0;l<10;l++){const c=Math.atan2(r.x,r.y),f=Fe({max:Math.PI/2,min:Math.PI/3,steps:200}),u=c+f*Fe({max:1,min:-1,steps:2});o.push(new pc({position:i.position.clone(),color:new g(1,1,1,1),size:.01,velocity:new g(Math.sin(u),Math.cos(u)).mul(Fe({max:1,min:.4,steps:200})),totalTime:.4}))}}}applyCommand(e){switch(e.type){case Qt:this.data.state.paddles[e.playerIndex].direction=e.direction;break;case Kt:this.data.state.paddles[e.playerIndex].attack();break;case Hn:const{delta:r}=e,{ball:i,balls:o,paddles:s,particles:a}=this.data.state;var n=this.moveBall(r);for(let l=0;l<o.length;l++){const c=o[l];c.mesh.color.sub(g.ONE3.clone().mul(2*r)).max(g.ZERO3),c.collides(i)&&c.mesh.color.copy(i.mesh.color).mul(3)}for(let l=a.length-1;l>=0;l--){const c=a[l];c.position.add(c.velocity.clone().mul(r)),c.timeToLive-=r,uc(()=>console.log(c.timeToLive/c.totalTime)),c.mesh.scale=g.ONE2.clone().mul(c.size*c.timeToLive/c.totalTime),c.timeToLive<=0&&a.splice(l,1)}for(let l=0;l<s.length;l++)s[l].update(r);n.hit&&this.spawnParticles(n);break}}update(e){this.commands.push(new Hn(e)),this.commands.forEach(n=>{this.applyCommand(n)}),this.commands.length=0}}var vc=`#version 300 es\r
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
}`,bc=`#version 300 es\r
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
}`,dt=new gi;dt.showPanel(0);document.body.appendChild(dt.dom);const m=document.getElementById("webgl").getContext("webgl2");nc(m);function Q(t,e,n,r,i=null,o=null){t.useProgram(e.program),En(t,e,n),Hr(e,r),Qr(t,i),o&&t.viewport(o[0],o[1],o[2],o[3]),Xr(t,n)}const yc={position:{numComponents:3,data:[-1,-1,0,1,-1,0,-1,1,0,-1,1,0,1,-1,0,1,1,0]}},Z=sr(m,yc),M=new vi;M.init();const Ct=new ri(2),Ec=new ic(Ct),gc=new hc,Me=new xc(M),ae=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,Ac=`#version 300 es
precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`,wc=`#version 300 es
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
`,_c=`#version 300 es
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
`,Zr=`#version 300 es
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

`,Tc=`#version 300 es
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
`,Sc=`#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tPrev;

out vec4 outColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  outColor = pow(texture(tPrev, uv), vec4(1./2.2));
}
`,Cc=`#version 300 es
in vec2 position;
in vec4 color;
in mat4 matrix;

out vec4 v_color;
  void main() {
    // Multiply the position by the matrix.
    gl_Position = matrix * vec4(position, 0.0, 1.0);
    v_color = color;
  }
`,Rc=`#version 300 es

precision mediump float;

in vec4 v_color;

out vec4 outColor;
void main() {
  outColor = v_color;
}`,Bt=ie(m,[Cc,Rc]);ie(m,[ae,wc]);const Fc=ie(m,[ae,Tc]),Dc=ie(m,[ae,Zr]);ie(m,[ae,Zr]);const mt=ie(m,[ae,Ac]),Pc=ie(m,[ae,_c]),Zt=ie(m,[ae,Sc]),Ic=ie(m,[ae,vc]),Ut=Qi,Lc=ie(m,[ae,bc]);function it(t,e){if(t.length===0)return;const n=[],r=[],i=t[0].mesh.vertices;for(let l=0;l<t.length;l++){const c=t[l],{position:f,mesh:u}=c,{scale:h,color:p}=u,d=Ut.scaling([h.x/Ct.sizes.aspect,h.y,1]),b=Ut.translation([f.x/h.x,f.y/h.y,0]);Ut.multiply(d,b).forEach((v,x)=>{n.push(v)}),r.push(p.x,p.y,p.z,p.w)}const s=sr(m,{position:{numComponents:2,data:i},color:{numComponents:4,data:r,divisor:1},matrix:{numComponents:16,data:n,divisor:1}}),a=Jl(m,Bt,s);m.useProgram(Bt.program),En(m,Bt,a),Qr(m,e),Xr(m,a,m.TRIANGLE_FAN,a.numElements,0,t.length)}function Jr(t,e){it([e.data.state.ball],t),it(e.data.state.paddles,t),it(e.data.state.balls,t),it(e.data.state.particles,t)}Ct.listeners.push({updateSize:({width:t,height:e})=>{m.canvas.width=t,m.canvas.height=e}});let Be={requested:!1,lastRequest:0};const Mc=()=>{if(Be.requested=!1,Date.now()-Be.lastRequest<500)return;var e=document.getElementById("webgl").toDataURL(),n=document.createElement("a");n.download="canvas_image.png",n.href=e,n.click(),Be.lastRequest=Date.now()},ee=8*128,Ee=ee,A={lightEmittersWithCurrent:ye(m,[{internalFormat:m.RGBA8,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],ee,Ee),distance:ye(m,[{internalFormat:m.R8,format:m.R,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],ee,Ee),fill:ye(m,[{internalFormat:m.RGB8,format:m.RGB,mag:m.NEAREST,min:m.NEAREST,wrap:m.CLAMP_TO_EDGE}],ee,Ee),spare:ye(m,[{internalFormat:m.RGB8,format:m.RGB,mag:m.NEAREST,min:m.NEAREST,wrap:m.CLAMP_TO_EDGE}],ee,Ee),quadCascadeRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],ee,Ee),spareQuadCascadeRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],ee,Ee),spareQuadCascadeFinalRT:ye(m,[{internalFormat:m.RGBA32F,format:m.RGBA,mag:m.LINEAR,min:m.LINEAR,wrap:m.CLAMP_TO_EDGE}],ee,Ee)};M.addColor({displayName:"Color",defaultValue:[1,1,1],callback:t=>{Me.commands.push(new UpdateColorCommand(t))}});const ot=m.getExtension("EXT_disjoint_timer_query_webgl2"),Nt=m.createQuery();var zt=!1,Xn=!1;function Bc(t){m.viewport(0,0,m.canvas.width,m.canvas.height),Q(m,mt,Z,{color:[0,0,0,0]},A.lightEmittersWithCurrent),Jr(A.lightEmittersWithCurrent,Me)}function Uc(t,e){const r=2*Math.SQRT2/A.quadCascadeRT.width,o=Math.log2(Math.SQRT2/r),s=e===0?0:r*Math.pow(2,o*(e-1)/5),a=e==5?Math.SQRT2:r*Math.pow(2,o*e/5),l=r*Math.pow(2,o*(e+1)/5);Q(m,Ic,Z,{renderResolution:[m.canvas.width,m.canvas.height],resolution:[A.quadCascadeRT.width,A.quadCascadeRT.height],maxSteps:M.addNumber({displayName:"Max Steps",defaultValue:32,min:1,max:128,step:1}).value,tDistance:A.distance.attachments[0],tColor:A.lightEmittersWithCurrent.attachments[0],startDepth:5,current:{depth:e,minDistance:s,maxDistance:a},deeper:{depth:e,minDistance:a,maxDistance:l},debug:{continousBilinearFix:M.addNumber({displayName:"Continuous Bilinear Fix",defaultValue:!0}).value,cornerProbes:M.addNumber({displayName:"Corner Probes",defaultValue:!0}).value,showSampleUv:M.addNumber({displayName:"Show Sample Uv",defaultValue:!1}).value,showProbeUv:M.addNumber({displayName:"Show Probe Uv",defaultValue:!1}).value,showDirection:M.addNumber({displayName:"Show Direction Uv",defaultValue:!1}).value,noFix:M.addNumber({displayName:"No Fix",defaultValue:!1}).value,quadSample:M.addNumber({displayName:"Quad Sample",defaultValue:!1}).value,finalDepth:M.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value},tPrevCascade:A.quadCascadeRT.attachments[0]},A.spareQuadCascadeRT),[A.spareQuadCascadeRT,A.quadCascadeRT]=[A.quadCascadeRT,A.spareQuadCascadeRT]}function Nc(t){Q(m,mt,Z,{color:[0,0,0,0]},A.spare),[A.fill,A.spare]=[A.spare,A.fill];for(var e=Math.ceil(Math.log2(ee));e>=0;e--)Q(m,Pc,Z,{resolution:[A.fill.width,A.fill.height],jumpSize:1<<e,tPrev:A.fill.attachments[0],tLine:A.lightEmittersWithCurrent.attachments[0]},A.spare),[A.fill,A.spare]=[A.spare,A.fill];Q(m,Dc,Z,{resolution:[A.fill.width,A.fill.height],tPrev:A.fill.attachments[0]},A.distance)}function zc(){Q(m,Fc,Z,{renderTarget:[M.addNumber({displayName:"minx",defaultValue:0,min:0,max:1,step:.01}).value,M.addNumber({displayName:"miny",defaultValue:0,min:0,max:1,step:.01}).value,M.addNumber({displayName:"maxx",defaultValue:1,min:0,max:1,step:.01}).value,M.addNumber({displayName:"maxy",defaultValue:1,min:0,max:1,step:.01}).value],resolution:[A.quadCascadeRT.width,A.quadCascadeRT.height],tPrev:A.quadCascadeRT.attachments[0]},A.spareQuadCascadeFinalRT),Q(m,Zt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:A.spareQuadCascadeFinalRT.attachments[0]})}function Oc(){Q(m,Lc,Z,{resolution:[A.spareQuadCascadeRT.width,A.spareQuadCascadeRT.height],tPrevCascade:A.quadCascadeRT.attachments[0]},A.spareQuadCascadeFinalRT)}class $c{constructor({fps:e=60}){this.frame=0,this.fps=e,this.initialTime=Date.now(),this.lastDelta=Date.now()}getDeltaTime(){const n=Date.now()-this.lastDelta;return this.lastDelta=Date.now(),Math.min(1e3/this.fps,n)}timeToNextRender(){this.frame++;const e=Date.now()-this.initialTime,n=1e3/this.fps;return e%n}}const Ot=new $c({fps:60});function ei(t){dt.begin(),Ct.update();const e=Ec.getState();gc.update(Me,e),(e.control||e.meta)&&e.s&&(Be.requested=!0),Me.update(Ot.getDeltaTime()/1e3),rc(m.canvas),Bc(),Nc();let n=M.addNumber({displayName:"Initial Depth",defaultValue:Math.log2(ee)-3,min:1,max:Math.log2(ee)-3,step:1}).value;for(Q(m,mt,Z,{color:[0,0,0,0]},A.quadCascadeRT),Q(m,mt,Z,{color:[0,0,0,0]},A.spareQuadCascadeFinalRT),!zt&&ot&&(m.beginQuery(ot.TIME_ELAPSED_EXT,Nt),zt=!0);n>=M.addNumber({displayName:"Final Depth",defaultValue:0,min:0,max:8,step:1}).value;)Uc(Ot,n),n--;switch(zt&&!Xn&&ot&&(Xn=!0,m.endQuery(ot.TIME_ELAPSED_EXT)),Q(m,Zt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:A.lightEmittersWithCurrent.attachments[0]}),M.addEnum({displayName:"Render Mode",defaultValue:"Render Cascade",options:["Render Cascade","Cascade Levels"]}).value){case"Cascade Levels":zc();break;case"Render Cascade":default:Oc();break}Jr(A.spareQuadCascadeFinalRT,Me),Q(m,Zt,Z,{resolution:[m.canvas.width,m.canvas.height],tPrev:A.spareQuadCascadeFinalRT.attachments[0]}),Be.requested&&Mc(),m.getQueryParameter(Nt,m.QUERY_RESULT_AVAILABLE)&&m.getQueryParameter(Nt,m.QUERY_RESULT),setTimeout(()=>{requestAnimationFrame(ei)},Ot.timeToNextRender()),dt.end()}requestAnimationFrame(ei);
//# sourceMappingURL=index-0b9d7044.js.map
