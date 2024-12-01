(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const u of a.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function o(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(t){if(t.ep)return;t.ep=!0;const a=o(t);fetch(t.href,a)}})();var L=document.getElementById("drawflow");const i=new Drawflow(L);var v=new(window.AudioContext||window.webkitAudioContext);i.reroute=!0;i.start();const f=new Map,A="synth";async function P(e){const o=new Blob([e]).stream().pipeThrough(new CompressionStream("gzip")),s=[];for await(const t of o)s.push(t);return await D(s)}async function j(e){const o=new Blob([e]).stream().pipeThrough(new DecompressionStream("gzip")),s=[];for await(const a of o)s.push(a);const t=await D(s);return new TextDecoder().decode(t)}async function D(e){const o=await new Blob(e).arrayBuffer();return new Uint8Array(o)}function R(e){return JSON.stringify(e)}async function q(e){const n=R(e);P(n).then(o=>{const t=btoa(String.fromCharCode.apply(null,o)).replace(/\+/g,"-").replace(/\//g,"_"),a=new URL(window.location.href);a.searchParams.set("d",t),window.history.pushState(null,"",a.toString())})}async function F(){const n=new URLSearchParams(window.location.search).get("d");if(!n)return null;let o=n.replace(/-/g,"+").replace(/_/g,"/"),s=new Uint8Array(atob(o).split("").map(t=>t.charCodeAt(0)));return j(s).then(t=>t)}async function z(){const n=await F()??localStorage.getItem(A);if(n&&n!="undefined"&&n!==null){const{data:s}=JSON.parse(n).drawflow.Home;console.log("data",s);const t={},a={};for(const[d,r]of Object.entries(s)){const{id:l,outputs:h}=r;t[l]={};for(const[c,g]of Object.entries(h)){t[l][c]=[];for(let m=0;m<g.connections.length;m++){const{node:b,output:w}=g.connections[m];t[l][c].push({id:b,inputName:w})}}}const u={};for(const[d,r]of Object.entries(t))Object.keys(r).length===0&&(u[d]=0);for(var o={};;){for(const[d,r]of Object.entries(t))if(!(d.toString()in u))for(const[l,h]of Object.entries(r))for(let c=0;c<h.length;c++){const g=h[c],m=u[Number(g.id)];if(m!==void 0){o[d]!==void 0?o[d]=Math.min(o[d],m):o[d]=m;break}}if(Object.keys(o).length===0)break;for(const[d,r]of Object.entries(o))u[d]=r+1;o={}}for(const[d,r]of Object.entries(s))if(u[d]===void 0)throw new Error;const p={},y={};for(const[d,r]of Object.entries(s)){const l=u[d];p[l]===void 0?p[l]=1:p[l]=p[l]+1;const h=p[l];y[d]={posX:-l*300+800,posY:500*h}}for(const[d,r]of Object.entries(s)){const{id:l,name:h,data:c}=r,g=C(h,y[l].posX,y[l].posY,c);console.log(c),f[g].updateData(c),a[l]=g}for(const[d,r]of Object.entries(t))for(const[l,h]of Object.entries(r))for(let c=0;c<h.length;c++){const g=h[c].id,m=h[c].inputName;i.addConnection(a[d],a[g],l,m)}}await q(i.export())}async function S(){const e=i.export();localStorage.setItem(A,JSON.stringify(e)),await q(e)}function T(){var n,o;v.resume();const e=Date.now();for(const[s,t]of Object.entries(f)){const a=t.canvas,u=t.analyser;if(a&&u){const p=a.getContext("2d"),y=u.frequencyBinCount,d=new Uint8Array(y);u.getByteTimeDomainData(d),t.history.push([e,d]);const r=500;t.history=t.history.filter(([m,b])=>m>e-r);const l=1e3*u.frequencyBinCount/v.sampleRate,h=l/u.frequencyBinCount;p.clearRect(0,0,a.width,a.height),p.fillStyle="rgb(200 200 200)",p.fillRect(0,0,a.width,a.height),p.lineWidth=2,p.strokeStyle="rgb(0 0 0)",p.beginPath();let c=0,g=t.history[0][0]-l;for(let m=0;m<t.history.length;m++){const b=t.history[m][1];for(let w=0;w<b.length;w++){const O=b[w]/128*(a.height/2);if(m===0&&w==0?p.moveTo(a.width*c,O):p.lineTo(a.width*c,O),c+=h/r,g+=h,g>((o=(n=t.history)==null?void 0:n[m+1])==null?void 0:o[0])-l)break}}p.stroke()}}requestAnimationFrame(T)}function M(e){const n=i.getNodeFromId(e);switch(n.class){case"o":f[e]=v.createOscillator(),f[e].start();break;case"s":f[e]=v;break;case"g":f[e]=v.createGain();break;case"e":f[e]=new _;break;case"f":f[e]=v.createBiquadFilter();break;case"n":f[e]=new U;break}switch(n.class){case"o":case"g":case"e":case"f":case"n":const o=document.getElementById(`node-${e}`).getElementsByClassName("drawflow_content_node")[0].children[0],s=document.createElement("canvas");s.width=180,s.height=180,o.appendChild(s);const t=v.createAnalyser();t.fftSize=2048;const a=t.frequencyBinCount,u=new Uint8Array(a);t.getByteTimeDomainData(u),f[e].connect(t),f[e].canvas=s,f[e].analyser=t,f[e].history=[]}}i.on("nodeCreated",()=>{S()});i.on("nodeRemoved",function(e){S()});i.on("nodeSelected",function(e){});i.on("moduleCreated",function(e){});i.on("moduleChanged",function(e){});class U extends AudioBufferSourceNode{constructor(){super(v);const n=2*v.sampleRate,o=v.createBuffer(1,n,v.sampleRate);this.type="white",this.buffer=o,this.loop=!0,this.regenerateBuffer(),this.start(0)}regenerateBuffer(){const n=this.buffer.getChannelData(0),o=2*v.sampleRate;switch(this.type){case"pink":var s,t,a,u,p,y,d;s=t=a=u=p=y=d=0;for(var r=0;r<o;r++){const c=Math.random()*2-1;s=.99886*s+c*.0555179,t=.99332*t+c*.0750759,a=.969*a+c*.153852,u=.8665*u+c*.3104856,p=.55*p+c*.5329522,y=-.7616*y-c*.016898,n[r]=s+t+a+u+p+y+d+c*.5362,n[r]*=.11,d=c*.115926}break;case"brown":for(var l=0,r=0;r<o;r++){var h=Math.random()*2-1;n[r]=(l+.02*h)/1.02,l=n[r],n[r]*=3.5}break;case"white":default:for(var r=0;r<o;r++)n[r]=Math.random()*2-1;break}}getInput(n){return this}updateData(n){this.type!=n.type&&(this.type=n.type,this.regenerateBuffer())}}class _ extends GainNode{constructor(){super(v),this.constantNode=v.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}applyEnvelope(){var n,o=v.currentTime;switch(this.gain.cancelScheduledValues(o),this.data.ramptype){case"linear":n=(t,a)=>this.gain.linearRampToValueAtTime(t,a);break;case"instant":n=(t,a)=>this.gain.setValueAtTime(t,a);break;default:case"exp":n=(t,a)=>this.gain.exponentialRampToValueAtTime(t,a);break}const s=(t,a)=>{a>0&&(o+=a,n(t,o))};this.data.attack>0&&this.gain.setValueAtTime(.001,o),s(this.data.peak,this.data.attack),s(.001,this.data.decay)}getInput(n){return this}updateData(n){this.data.ramptype=n.ramptype,this.data.peak=Number(n.peak),this.data.attack=Number(n.attack),this.data.decay=Number(n.decay),this.applyEnvelope()}}BiquadFilterNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(e){switch(e){default:return this.destination}};GainNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.gain}};OscillatorNode.prototype.getInput=function(e){switch(e){default:return this.frequency}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};GainNode.prototype.updateData=function(e){this.gain.value=Number(e.gain)};BiquadFilterNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};i.on("connectionCreated",function(e){const n=f[e.output_id],o=f[e.input_id];n&&o&&n.connect(o.getInput(e.input_class)),S()});i.on("connectionRemoved",function(e){var n;(n=f[e.output_id])==null||n.disconnect(f[e.input_id].getInput(e.input_class)),S()});i.on("mouseMove",function(e){});i.on("nodeDataChanged",function(e){const{data:n}=i.getNodeFromId(e);f[e].updateData(n),S()});i.on("nodeMoved",function(e){});i.on("zoom",function(e){});i.on("translate",function(e){});i.on("addReroute",function(e){});i.on("removeReroute",function(e){});var x=document.getElementsByClassName("drag-drawflow");for(var N=0;N<x.length;N++)x[N].addEventListener("touchend",E,!1),x[N].addEventListener("touchmove",G,!1),x[N].addEventListener("touchstart",I,!1);var B="",k=null;function G(e){k=e}function H(e){e.preventDefault()}function I(e){e.type==="touchstart"?B=e.target.closest(".drag-drawflow").getAttribute("data-node"):e.dataTransfer.setData("node",e.target.getAttribute("data-node"))}function E(e){if(e.type==="touchend"){var n=document.elementFromPoint(k.touches[0].clientX,k.touches[0].clientY).closest("#drawflow");n!=null&&C(B,k.touches[0].clientX,k.touches[0].clientY),B=""}else{e.preventDefault();var o=e.dataTransfer.getData("node");C(o,e.clientX,e.clientY)}}function C(e,n,o,s=null){if(i.editor_mode==="fixed")return null;n=n*(i.precanvas.clientWidth/(i.precanvas.clientWidth*i.zoom))-i.precanvas.getBoundingClientRect().x*(i.precanvas.clientWidth/(i.precanvas.clientWidth*i.zoom)),o=o*(i.precanvas.clientHeight/(i.precanvas.clientHeight*i.zoom))-i.precanvas.getBoundingClientRect().y*(i.precanvas.clientHeight/(i.precanvas.clientHeight*i.zoom));var t=null;switch(e){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;t=i.addNode("s",1,0,n,o,"s",s??{},a);break;case"g":var u=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;t=i.addNode("g",2,1,n,o,"g",s??{gain:1},u);break;case"e":var p=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Envelope</div>
        <div class="box">
          <p>Select type</p>
          <select df-ramptype>
            <option value="exp">Exponential</option>
            <option value="linear">Linear</option>
            <option value="instant">Instant</option>
          </select>
        </div>
        <div class="box">
          <p>Attack</p>
          <input type="number" df-attack>
        </div>
        <div class="box">
          <p>Decay</p>
          <input type="number" df-decay>
        </div>
        <div class="box">
          <p>Peak</p>
          <input type="number" df-peak>
        </div>
      </div>
      `;t=i.addNode("e",0,1,n,o,"e",s??{ramptype:"exp",attack:1,peak:1,decay:1},p);break;case"n":var y=`
        <div>
          <div class="title-box"><i class="fab fa-telegram-plane"></i> Noise</div>
          <div class="box">
            <p>Select type</p>
            <select df-type>
              <option value="white">White</option>
              <option value="pink">Pink</option>
              <option value="brown">Brown</option>
            </select>
          </div>
        </div>
        `;t=i.addNode("n",0,1,n,o,"n",s??{type:"white"},y);break;case"f":var d=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Filter</div>
        <div class="box">
          <p>Select type</p>
          <select df-type>
            <option value="lowpass">Low Pass</option>
            <option value="highpass">High Pass</option>
            <option value="bandpass">Band Pass</option>
            <option value="lowshelf">Low Shelf</option>
            <option value="peaking">Peaking</option>
            <option value="notch">Notch</option>
            <option value="allpass">All Pass</option>
          </select>
        </div>
        <div class="box">
          <p>Frequency</p>
          <input type="number" df-frequency>
        </div>
      </div>
      `;t=i.addNode("f",2,1,n,o,"f",s??{type:"lowpass",frequency:200},d);break;case"o":var r=`
    <div>
      <div class="title-box"><i class="fab fa-telegram-plane"></i> Oscillator</div>
      <div class="box">
        <p>Select type</p>
        <select df-type>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>
      <div class="box">
        <p>Frequency</p>
        <input type="number" df-frequency>
      </div>
    </div>
    `;t=i.addNode("o",1,1,n,o,"o",s??{type:"sine",frequency:260},r);break;default:return null}return M(t),t}function V(){for(const[e,n]of Object.entries(f))n.applyEnvelope&&n.applyEnvelope()}window.drop=E;window.drag=I;window.allowDrop=H;window.trigger=V;window.editor=i;z();requestAnimationFrame(T);
//# sourceMappingURL=index-f9cb0c13.js.map
