var R=Object.defineProperty;var M=(e,t,o)=>t in e?R(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o;var j=(e,t,o)=>(M(e,typeof t!="symbol"?t+"":t,o),o);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(n){if(n.ep)return;n.ep=!0;const a=o(n);fetch(n.href,a)}})();class A{async compressStrToBase64(t){return btoa(t)}async decompressBase64ToStr(t){return atob(t)}}class E{async jsonToString(t){return JSON.stringify(t)}async jsonFromString(t){return JSON.parse(t)}}class z{constructor(t=new A,o=new E){this.compressor=t,this.preprocessor=o}async saveData(t){const o=await this.preprocessor.jsonToString(t);console.log("URL param processed",o);const i=await this.compressor.compressStrToBase64(o);console.log("URL param length",i.length);const n=i.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"."),a=new URL(window.location.href);a.searchParams.set("d",n),window.history.pushState(null,"",a.toString())}async fetchData(){const o=new URLSearchParams(window.location.search).get("d");if(!o)return null;const i=o.replace(/-/g,"+").replace(/_/g,"/").replace(/\./g,"="),n=await this.compressor.decompressBase64ToStr(i);return await this.preprocessor.jsonFromString(n)}}var G=document.getElementById("drawflow");const r=new Drawflow(G);var y=new(window.AudioContext||window.webkitAudioContext);r.reroute=!0;r.start();var T={};class H{minifyConnections(t){var o="";for(const[i,{connections:n}]of Object.entries(t)){const a=i.replace("output_","");for(let c=0;c<n.length;c++){const{node:s,output:d}=n[c],l=d.replace("input_","");o!==""&&(o+=","),o+=`${a},${s},${l}`}}return o}unminifyConnections(t){if(t==="")return{};const o={},i=t.split(",");for(let n=0;n<i.length/3;n++){const a=`output_${i[3*n]}`,c=`${i[3*n+1]}`,s=`input_${i[3*n+2]}`;a in o||(o[a]={connections:[]}),o[a].connections.push({node:c,output:s})}return o}async jsonToString(t){const o=[];for(const[i,n]of Object.entries(t)){const{data:a,id:c,name:s,outputs:d,pos_x:l,pos_y:u}=n,f=[];for(const[w,F]of Object.entries(d)){const S=F.connections;S.length>0&&f.push([w.replace("output_",""),S])}const m=Math.round(l),p=Math.round(u),v=this.minifyConnections(d),g=T[s].dataToString(a),N=`${c}|${s}|${m}|${p}|${v}|${g}`;f.length>0,Object.keys(a).length>0,o.push(N)}return JSON.stringify(o)}async jsonFromString(t){const o=JSON.parse(t),i={};for(let n=0;n<o.length;n++){const a=o[n],[c,s,d,l,u,f]=a.split("|"),m=T[s].dataFromString(f),p=this.unminifyConnections(u);console.log(p),i[c]={data:m,id:c,name:s,outputs:p,pos_x:Number(d),pos_y:Number(l)}}return i}}const I=new z(new A,new H),h=new Map;function U(e){if(typeof e!="object"||e===null)return null;const t={};for(const[o,i]of Object.entries(e.drawflow.Home.data)){const{data:n,id:a,name:c,outputs:s,pos_x:d,pos_y:l}=i;t[o]={data:n,id:a,name:c,outputs:s,pos_x:d,pos_y:l}}return t}function V(e){return typeof e!="object"||e===null?null:{drawflow:{Home:{data:e}}}}async function b(){return I.saveData(U(r.export()))}async function W(){const e=V(await I.fetchData());if(e&&e!="undefined"&&e!==null){const{data:o}=e.drawflow.Home,i={},n={};for(const[s,d]of Object.entries(o)){const{id:l,outputs:u}=d;i[l]={};for(const[f,m]of Object.entries(u)){i[l][f]=[];for(let p=0;p<m.connections.length;p++){const{node:v,output:g}=m.connections[p];i[l][f].push({id:v,inputName:g})}}}const a={};for(const[s,d]of Object.entries(i))Object.keys(d).length===0&&(a[s]=0);for(var t={};;){for(const[s,d]of Object.entries(i))if(!(s.toString()in a))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f],p=a[Number(m.id)];if(p!==void 0){t[s]!==void 0?t[s]=Math.min(t[s],p):t[s]=p;break}}if(Object.keys(t).length===0)break;for(const[s,d]of Object.entries(t))a[s]=d+1;t={}}for(const[s,d]of Object.entries(o))a[s];const c={};for(const[s,d]of Object.entries(o)){const l=a[s];c[l]===void 0?c[l]=1:c[l]=c[l]+1,c[l]}for(const[s,d]of Object.entries(o)){const{id:l,name:u,data:f,pos_x:m,pos_y:p}=d,v=D(u,m,p,f);h[v].updateData(f),n[l]=v}for(const[s,d]of Object.entries(i))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f].id,p=u[f].inputName;r.addConnection(n[s],n[m],l,p)}}await b()}function $(){var t,o;y.resume();const e=Date.now();for(const[i,n]of Object.entries(h)){const a=n.canvas,c=n.analyser;if(a&&c){const s=a.getContext("2d"),d=c.frequencyBinCount,l=new Uint8Array(d);c.getByteTimeDomainData(l),n.history.push([e,l]);const u=500;n.history=n.history.filter(([g,N])=>g>e-u);const f=1e3*c.frequencyBinCount/y.sampleRate,m=f/c.frequencyBinCount;s.clearRect(0,0,a.width,a.height),s.fillStyle="rgb(200 200 200)",s.fillRect(0,0,a.width,a.height),s.lineWidth=2,s.strokeStyle="rgb(0 0 0)",s.beginPath();let p=0,v=n.history[0][0]-f;for(let g=0;g<n.history.length;g++){const N=n.history[g][1];for(let w=0;w<N.length;w++){const S=N[w]/128*(a.height/2);if(g===0&&w==0?s.moveTo(a.width*p,S):s.lineTo(a.width*p,S),p+=m/u,v+=m,v>((o=(t=n.history)==null?void 0:t[g+1])==null?void 0:o[0])-f)break}}s.stroke()}}requestAnimationFrame($)}function J(e){const t=r.getNodeFromId(e);switch(t.class){case"o":h[e]=y.createOscillator(),h[e].start();break;case"s":h[e]=y;break;case"g":h[e]=y.createGain();break;case"e":h[e]=new B;break;case"f":h[e]=y.createBiquadFilter();break;case"n":h[e]=new L;break}switch(t.class){case"o":case"g":case"e":case"f":case"n":const o=document.getElementById(`node-${e}`).getElementsByClassName("drawflow_content_node")[0].children[0],i=document.createElement("canvas");i.width=180,i.height=180,o.appendChild(i);const n=y.createAnalyser();n.fftSize=2048;const a=n.frequencyBinCount,c=new Uint8Array(a);n.getByteTimeDomainData(c),h[e].connect(n),h[e].canvas=i,h[e].analyser=n,h[e].history=[]}}r.on("nodeCreated",()=>{b()});r.on("nodeRemoved",function(e){b()});r.on("nodeSelected",function(e){});r.on("moduleCreated",function(e){});r.on("moduleChanged",function(e){});class L extends AudioBufferSourceNode{constructor(){super(y);const t=2*y.sampleRate,o=y.createBuffer(1,t,y.sampleRate);this.type="white",this.buffer=o,this.loop=!0,this.regenerateBuffer(),this.start(0)}static dataToString(t){switch(t.type){default:case"white":return"0";case"pink":return"1";case"brown":return"2"}}static dataFromString(t){switch(Number(t)){default:case"0":return"white";case"1":return"pink";case"2":return"brown"}}regenerateBuffer(){const t=this.buffer.getChannelData(0),o=2*y.sampleRate;switch(this.type){case"pink":var i,n,a,c,s,d,l;i=n=a=c=s=d=l=0;for(var u=0;u<o;u++){const p=Math.random()*2-1;i=.99886*i+p*.0555179,n=.99332*n+p*.0750759,a=.969*a+p*.153852,c=.8665*c+p*.3104856,s=.55*s+p*.5329522,d=-.7616*d-p*.016898,t[u]=i+n+a+c+s+d+l+p*.5362,t[u]*=.11,l=p*.115926}break;case"brown":for(var f=0,u=0;u<o;u++){var m=Math.random()*2-1;t[u]=(f+.02*m)/1.02,f=t[u],t[u]*=3.5}break;case"white":default:for(var u=0;u<o;u++)t[u]=Math.random()*2-1;break}}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}const O=class O extends GainNode{constructor(){super(y),this.constantNode=y.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}static dataToString(t){const{ramptype:o,peak:i,attack:n,decay:a}=t;return`${O.types.indexOf(o)}${i},${n},${a}`}static dataFromString(t){const o=O.types[Number(t[0])],[i,n,a]=t.substring(1).split(",");return{ramptype:o,attack:Number(n),decay:Number(a),peak:Number(i)}}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay),this.applyEnvelope()}applyEnvelope(){var t,o=y.currentTime;switch(this.gain.cancelScheduledValues(o),this.data.ramptype){case"linear":t=(n,a)=>this.gain.linearRampToValueAtTime(n,a);break;case"instant":t=(n,a)=>this.gain.setValueAtTime(n,a);break;default:case"exp":t=(n,a)=>this.gain.exponentialRampToValueAtTime(n,a);break}const i=(n,a)=>{a>0&&(o+=a,t(n,o))};this.data.attack>0&&this.gain.setValueAtTime(.001,o),i(this.data.peak,this.data.attack),i(.001,this.data.decay)}};j(O,"types",["linear","instant","exp"]);let B=O;BiquadFilterNode.types=["lowpass","highpass","bandpass","lowshelf","peaking","notch","allpass"];BiquadFilterNode.dataToString=function(e){const{type:t,frequency:o}=e;return`${BiquadFilterNode.types.indexOf(t)}${o}`};BiquadFilterNode.dataFromString=function(e){return{type:BiquadFilterNode.types[Number(e[0])],frequency:Number(e.substring(1))}};BiquadFilterNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(e){switch(e){default:return this.destination}};AudioContext.dataToString=function(e){return""};AudioContext.dataFromString=function(e){return{}};GainNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.gain}};GainNode.dataToString=function(e){return`${e.gain}`};GainNode.dataFromString=function(e){return{gain:Number(e)}};OscillatorNode.types=["sine","square","sawtooth","triangle"];OscillatorNode.prototype.getInput=function(e){switch(e){default:return this.frequency}};OscillatorNode.dataToString=function(e){const{type:t,frequency:o}=e;return`${OscillatorNode.types.indexOf(t)}${o}`};OscillatorNode.dataFromString=function(e){return{type:OscillatorNode.types[Number(e[0])],frequency:Number(e.substring(1))}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};GainNode.prototype.updateData=function(e){this.gain.value=Number(e.gain)};BiquadFilterNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};r.on("connectionCreated",function(e){const t=h[e.output_id],o=h[e.input_id];t&&o&&t.connect(o.getInput(e.input_class)),b()});r.on("connectionRemoved",function(e){var t;(t=h[e.output_id])==null||t.disconnect(h[e.input_id].getInput(e.input_class)),b()});r.on("mouseMove",function(e){});r.on("nodeDataChanged",function(e){const{data:t}=r.getNodeFromId(e);h[e].updateData(t),b()});r.on("nodeMoved",function(e){});r.on("zoom",function(e){});r.on("translate",function(e){});r.on("addReroute",function(e){});r.on("removeReroute",function(e){});var q=document.getElementsByClassName("drag-drawflow");for(var k=0;k<q.length;k++)q[k].addEventListener("touchend",_,!1),q[k].addEventListener("touchmove",X,!1),q[k].addEventListener("touchstart",P,!1);var C="",x=null;function X(e){x=e}function Y(e){e.preventDefault()}function P(e){e.type==="touchstart"?C=e.target.closest(".drag-drawflow").getAttribute("data-node"):e.dataTransfer.setData("node",e.target.getAttribute("data-node"))}function _(e){if(e.type==="touchend"){var t=document.elementFromPoint(x.touches[0].clientX,x.touches[0].clientY).closest("#drawflow");t!=null&&D(C,x.touches[0].clientX,x.touches[0].clientY),C=""}else{e.preventDefault();var o=e.dataTransfer.getData("node");D(o,e.clientX,e.clientY)}}function D(e,t,o,i=null){if(r.editor_mode==="fixed")return null;t=t*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom))-r.precanvas.getBoundingClientRect().x*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom)),o=o*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom))-r.precanvas.getBoundingClientRect().y*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom));var n=null;switch(e){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;n=r.addNode("s",1,0,t,o,"s",i??{},a);break;case"g":var c=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;n=r.addNode("g",2,1,t,o,"g",i??{gain:1},c);break;case"e":var s=`
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
      `;n=r.addNode("e",0,1,t,o,"e",i??{ramptype:"exp",attack:1,peak:1,decay:1},s);break;case"n":var d=`
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
        `;n=r.addNode("n",0,1,t,o,"n",i??{type:"white"},d);break;case"f":var l=`
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
      `;n=r.addNode("f",2,1,t,o,"f",i??{type:"lowpass",frequency:200},l);break;case"o":var u=`
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
    `;n=r.addNode("o",1,1,t,o,"o",{type:"sine",frequency:260},u);break;default:return null}return J(n),n}function K(){for(const[e,t]of Object.entries(h))t.applyEnvelope&&t.applyEnvelope()}window.drop=_;window.drag=P;window.allowDrop=Y;window.trigger=K;window.editor=r;T={s:AudioContext,g:GainNode,e:B,n:L,f:BiquadFilterNode,o:OscillatorNode};W();requestAnimationFrame($);
//# sourceMappingURL=index-9958ace5.js.map
