var R=Object.defineProperty;var M=(t,e,o)=>e in t?R(t,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[e]=o;var j=(t,e,o)=>(M(t,typeof e!="symbol"?e+"":e,o),o);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();class A{async compressStrToBase64(e){return btoa(e)}async decompressBase64ToStr(e){return atob(e)}}class E{async jsonToString(e){return JSON.stringify(e)}async jsonFromString(e){return JSON.parse(e)}}class z{constructor(e=new A,o=new E){this.compressor=e,this.preprocessor=o}async saveData(e){const o=await this.preprocessor.jsonToString(e);console.log("URL param processed",o);const i=await this.compressor.compressStrToBase64(o);console.log("URL param length",i.length);const n=i.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"."),a=new URL(window.location.href);a.searchParams.set("d",n),window.history.pushState(null,"",a.toString())}async fetchData(){const o=new URLSearchParams(window.location.search).get("d");if(!o)return null;const i=o.replace(/-/g,"+").replace(/_/g,"/").replace(/\./g,"="),n=await this.compressor.decompressBase64ToStr(i);return await this.preprocessor.jsonFromString(n)}}const O=class O extends GainNode{constructor(e){super(e),this.audioContext=e,this.constantNode=e.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}static dataToString(e){const{ramptype:o,peak:i,attack:n,decay:a}=e;return`${O.types.indexOf(o)}${i},${n},${a}`}static dataFromString(e){const o=O.types[Number(e[0])],[i,n,a]=e.substring(1).split(",");return{ramptype:o,attack:Number(n),decay:Number(a),peak:Number(i)}}getInput(e){return this}updateData(e){this.data.ramptype=e.ramptype,this.data.peak=Number(e.peak),this.data.attack=Number(e.attack),this.data.decay=Number(e.decay),this.applyEnvelope()}applyEnvelope(){var e,o=this.audioContext.currentTime;switch(this.gain.cancelScheduledValues(o),this.data.ramptype){case"linear":e=(n,a)=>this.gain.linearRampToValueAtTime(n,a);break;case"instant":e=(n,a)=>this.gain.setValueAtTime(n,a);break;default:case"exp":e=(n,a)=>this.gain.exponentialRampToValueAtTime(n,a);break}const i=(n,a)=>{a>0&&(o+=a,e(n,o))};this.data.attack>0&&this.gain.setValueAtTime(.001,o),i(this.data.peak,this.data.attack),i(.001,this.data.decay)}};j(O,"types",["linear","instant","exp"]);let B=O;class I extends AudioBufferSourceNode{constructor(e){super(e);const o=2*e.sampleRate,i=e.createBuffer(1,o,e.sampleRate);this.type="white",this.buffer=i,this.loop=!0,this.regenerateBuffer(),this.start(0)}static dataToString(e){switch(e.type){default:case"white":return"0";case"pink":return"1";case"brown":return"2"}}static dataFromString(e){switch(Number(e)){default:case"0":return"white";case"1":return"pink";case"2":return"brown"}}regenerateBuffer(){const e=this.buffer.getChannelData(0),o=2*audioContext.sampleRate;switch(this.type){case"pink":var i,n,a,c,s,d,l;i=n=a=c=s=d=l=0;for(var u=0;u<o;u++){const p=Math.random()*2-1;i=.99886*i+p*.0555179,n=.99332*n+p*.0750759,a=.969*a+p*.153852,c=.8665*c+p*.3104856,s=.55*s+p*.5329522,d=-.7616*d-p*.016898,e[u]=i+n+a+c+s+d+l+p*.5362,e[u]*=.11,l=p*.115926}break;case"brown":for(var f=0,u=0;u<o;u++){var m=Math.random()*2-1;e[u]=(f+.02*m)/1.02,f=e[u],e[u]*=3.5}break;case"white":default:for(var u=0;u<o;u++)e[u]=Math.random()*2-1;break}}getInput(e){return this}updateData(e){this.type!=e.type&&(this.type=e.type,this.regenerateBuffer())}}var G=document.getElementById("drawflow");const r=new Drawflow(G);var v=new(window.AudioContext||window.webkitAudioContext);r.reroute=!0;r.start();var T={};class H{minifyConnections(e){var o="";for(const[i,{connections:n}]of Object.entries(e)){const a=i.replace("output_","");for(let c=0;c<n.length;c++){const{node:s,output:d}=n[c],l=d.replace("input_","");o!==""&&(o+=","),o+=`${a},${s},${l}`}}return o}unminifyConnections(e){if(e==="")return{};const o={},i=e.split(",");for(let n=0;n<i.length/3;n++){const a=`output_${i[3*n]}`,c=`${i[3*n+1]}`,s=`input_${i[3*n+2]}`;a in o||(o[a]={connections:[]}),o[a].connections.push({node:c,output:s})}return o}async jsonToString(e){const o=[];for(const[i,n]of Object.entries(e)){const{data:a,id:c,name:s,outputs:d,pos_x:l,pos_y:u}=n,f=[];for(const[w,F]of Object.entries(d)){const S=F.connections;S.length>0&&f.push([w.replace("output_",""),S])}const m=Math.round(l),p=Math.round(u),g=this.minifyConnections(d),y=T[s].dataToString(a),N=`${c}|${s}|${m}|${p}|${g}|${y}`;f.length>0,Object.keys(a).length>0,o.push(N)}return JSON.stringify(o)}async jsonFromString(e){const o=JSON.parse(e),i={};for(let n=0;n<o.length;n++){const a=o[n],[c,s,d,l,u,f]=a.split("|"),m=T[s].dataFromString(f),p=this.unminifyConnections(u);console.log(p),i[c]={data:m,id:c,name:s,outputs:p,pos_x:Number(d),pos_y:Number(l)}}return i}}const $=new z(new A,new H),h=new Map;function U(t){if(typeof t!="object"||t===null)return null;const e={};for(const[o,i]of Object.entries(t.drawflow.Home.data)){const{data:n,id:a,name:c,outputs:s,pos_x:d,pos_y:l}=i;e[o]={data:n,id:a,name:c,outputs:s,pos_x:d,pos_y:l}}return e}function V(t){return typeof t!="object"||t===null?null:{drawflow:{Home:{data:t}}}}async function b(){return $.saveData(U(r.export()))}async function W(){const t=V(await $.fetchData());if(t&&t!="undefined"&&t!==null){const{data:o}=t.drawflow.Home,i={},n={};for(const[s,d]of Object.entries(o)){const{id:l,outputs:u}=d;i[l]={};for(const[f,m]of Object.entries(u)){i[l][f]=[];for(let p=0;p<m.connections.length;p++){const{node:g,output:y}=m.connections[p];i[l][f].push({id:g,inputName:y})}}}const a={};for(const[s,d]of Object.entries(i))Object.keys(d).length===0&&(a[s]=0);for(var e={};;){for(const[s,d]of Object.entries(i))if(!(s.toString()in a))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f],p=a[Number(m.id)];if(p!==void 0){e[s]!==void 0?e[s]=Math.min(e[s],p):e[s]=p;break}}if(Object.keys(e).length===0)break;for(const[s,d]of Object.entries(e))a[s]=d+1;e={}}for(const[s,d]of Object.entries(o))a[s];const c={};for(const[s,d]of Object.entries(o)){const l=a[s];c[l]===void 0?c[l]=1:c[l]=c[l]+1,c[l]}for(const[s,d]of Object.entries(o)){const{id:l,name:u,data:f,pos_x:m,pos_y:p}=d,g=D(u,m,p,f);h[g].updateData(f),n[l]=g}for(const[s,d]of Object.entries(i))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f].id,p=u[f].inputName;r.addConnection(n[s],n[m],l,p)}}await b()}function L(){var e,o;v.resume();const t=Date.now();for(const[i,n]of Object.entries(h)){const a=n.canvas,c=n.analyser;if(a&&c){const s=a.getContext("2d"),d=c.frequencyBinCount,l=new Uint8Array(d);c.getByteTimeDomainData(l),n.history.push([t,l]);const u=500;n.history=n.history.filter(([y,N])=>y>t-u);const f=1e3*c.frequencyBinCount/v.sampleRate,m=f/c.frequencyBinCount;s.clearRect(0,0,a.width,a.height),s.fillStyle="rgb(200 200 200)",s.fillRect(0,0,a.width,a.height),s.lineWidth=2,s.strokeStyle="rgb(0 0 0)",s.beginPath();let p=0,g=n.history[0][0]-f;for(let y=0;y<n.history.length;y++){const N=n.history[y][1];for(let w=0;w<N.length;w++){const S=N[w]/128*(a.height/2);if(y===0&&w==0?s.moveTo(a.width*p,S):s.lineTo(a.width*p,S),p+=m/u,g+=m,g>((o=(e=n.history)==null?void 0:e[y+1])==null?void 0:o[0])-f)break}}s.stroke()}}requestAnimationFrame(L)}function J(t){const e=r.getNodeFromId(t);switch(e.class){case"o":h[t]=v.createOscillator(),h[t].start();break;case"s":h[t]=v;break;case"g":h[t]=v.createGain();break;case"e":h[t]=new B(v);break;case"f":h[t]=v.createBiquadFilter();break;case"n":h[t]=new I(v);break}switch(e.class){case"o":case"g":case"e":case"f":case"n":const o=document.getElementById(`node-${t}`).getElementsByClassName("drawflow_content_node")[0].children[0],i=document.createElement("canvas");i.width=180,i.height=180,o.appendChild(i);const n=v.createAnalyser();n.fftSize=2048;const a=n.frequencyBinCount,c=new Uint8Array(a);n.getByteTimeDomainData(c),h[t].connect(n),h[t].canvas=i,h[t].analyser=n,h[t].history=[]}}r.on("nodeCreated",()=>{b()});r.on("nodeRemoved",function(t){b()});r.on("nodeSelected",function(t){});r.on("moduleCreated",function(t){});r.on("moduleChanged",function(t){});BiquadFilterNode.types=["lowpass","highpass","bandpass","lowshelf","peaking","notch","allpass"];BiquadFilterNode.dataToString=function(t){const{type:e,frequency:o}=t;return`${BiquadFilterNode.types.indexOf(e)}${o}`};BiquadFilterNode.dataFromString=function(t){return{type:BiquadFilterNode.types[Number(t[0])],frequency:Number(t.substring(1))}};BiquadFilterNode.prototype.getInput=function(t){switch(t){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(t){switch(t){default:return this.destination}};AudioContext.dataToString=function(t){return""};AudioContext.dataFromString=function(t){return{}};GainNode.prototype.getInput=function(t){switch(t){case"input_1":return this;case"input_2":default:return this.gain}};GainNode.dataToString=function(t){return`${t.gain}`};GainNode.dataFromString=function(t){return{gain:Number(t)}};OscillatorNode.types=["sine","square","sawtooth","triangle"];OscillatorNode.prototype.getInput=function(t){switch(t){default:return this.frequency}};OscillatorNode.dataToString=function(t){const{type:e,frequency:o}=t;return`${OscillatorNode.types.indexOf(e)}${o}`};OscillatorNode.dataFromString=function(t){return{type:OscillatorNode.types[Number(t[0])],frequency:Number(t.substring(1))}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(t){this.type=t.type,this.frequency.value=Number(t.frequency)};GainNode.prototype.updateData=function(t){this.gain.value=Number(t.gain)};BiquadFilterNode.prototype.updateData=function(t){this.type=t.type,this.frequency.value=Number(t.frequency)};r.on("connectionCreated",function(t){const e=h[t.output_id],o=h[t.input_id];e&&o&&e.connect(o.getInput(t.input_class)),b()});r.on("connectionRemoved",function(t){var e;(e=h[t.output_id])==null||e.disconnect(h[t.input_id].getInput(t.input_class)),b()});r.on("mouseMove",function(t){});r.on("nodeDataChanged",function(t){const{data:e}=r.getNodeFromId(t);h[t].updateData(e),b()});r.on("nodeMoved",function(t){});r.on("zoom",function(t){});r.on("translate",function(t){});r.on("addReroute",function(t){});r.on("removeReroute",function(t){});var q=document.getElementsByClassName("drag-drawflow");for(var k=0;k<q.length;k++)q[k].addEventListener("touchend",_,!1),q[k].addEventListener("touchmove",X,!1),q[k].addEventListener("touchstart",P,!1);var C="",x=null;function X(t){x=t}function Y(t){t.preventDefault()}function P(t){t.type==="touchstart"?C=t.target.closest(".drag-drawflow").getAttribute("data-node"):t.dataTransfer.setData("node",t.target.getAttribute("data-node"))}function _(t){if(t.type==="touchend"){var e=document.elementFromPoint(x.touches[0].clientX,x.touches[0].clientY).closest("#drawflow");e!=null&&D(C,x.touches[0].clientX,x.touches[0].clientY),C=""}else{t.preventDefault();var o=t.dataTransfer.getData("node");D(o,t.clientX,t.clientY)}}function D(t,e,o,i=null){if(r.editor_mode==="fixed")return null;e=e*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom))-r.precanvas.getBoundingClientRect().x*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom)),o=o*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom))-r.precanvas.getBoundingClientRect().y*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom));var n=null;switch(t){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-volume-up"></i> Audio Out </div>
      </div>
      `;n=r.addNode("s",1,0,e,o,"s",i??{},a);break;case"g":var c=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;n=r.addNode("g",2,1,e,o,"g",i??{gain:1},c);break;case"e":var s=`
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
      `;n=r.addNode("e",0,1,e,o,"e",i??{ramptype:"exp",attack:1,peak:1,decay:1},s);break;case"n":var d=`
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
        `;n=r.addNode("n",0,1,e,o,"n",i??{type:"white"},d);break;case"f":var l=`
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
      `;n=r.addNode("f",2,1,e,o,"f",i??{type:"lowpass",frequency:200},l);break;case"o":var u=`
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
    `;n=r.addNode("o",1,1,e,o,"o",i??{type:"sine",frequency:260},u);break;default:return null}return J(n),n}function K(){for(const[t,e]of Object.entries(h))e.applyEnvelope&&e.applyEnvelope()}window.drop=_;window.drag=P;window.allowDrop=Y;window.trigger=K;window.editor=r;T={s:AudioContext,g:GainNode,e:B,n:I,f:BiquadFilterNode,o:OscillatorNode};W();requestAnimationFrame(L);
//# sourceMappingURL=index-f4e1c7b5.js.map
