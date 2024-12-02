var _=Object.defineProperty;var E=(e,t,n)=>t in e?_(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var x=(e,t,n)=>(E(e,typeof t!="symbol"?t+"":t,n),n);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=n(o);fetch(o.href,a)}})();class ${async compressStrToBase64(t){return btoa(t)}async decompressBase64ToStr(t){return atob(t)}}class z{async jsonToString(t){return JSON.stringify(t)}async jsonFromString(t){return JSON.parse(t)}}class G{constructor(t=new $,n=new z){this.compressor=t,this.preprocessor=n}async saveData(t){const n=await this.preprocessor.jsonToString(t);console.log("URL param processed",n);const i=await this.compressor.compressStrToBase64(n);console.log("URL param length",i.length);const o=i.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"."),a=new URL(window.location.href);a.searchParams.set("d",o),window.history.pushState(null,"",a.toString())}async fetchData(){const n=new URLSearchParams(window.location.search).get("d");if(!n)return null;const i=n.replace(/-/g,"+").replace(/_/g,"/").replace(/\./g,"="),o=await this.compressor.decompressBase64ToStr(i);return await this.preprocessor.jsonFromString(o)}}const w=class w extends GainNode{constructor(t){super(t),this.constantNode=t.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}static dataToString(t){const{ramptype:n,peak:i,attack:o,decay:a}=t;return`${w.types.indexOf(n)}${i},${o},${a}`}static dataFromString(t){const n=w.types[Number(t[0])],[i,o,a]=t.substring(1).split(",");return{ramptype:n,attack:Number(o),decay:Number(a),peak:Number(i)}}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay)}applyEnvelope(t){var n,i=t;switch(this.gain.cancelAndHoldAtTime(i),this.data.ramptype){case"linear":n=(a,s)=>this.gain.linearRampToValueAtTime(a,s);break;case"instant":n=(a,s)=>this.gain.setValueAtTime(a,s);break;default:case"exp":n=(a,s)=>this.gain.exponentialRampToValueAtTime(a,s);break}const o=(a,s)=>{s>0&&(i+=s,n(a,i))};this.data.attack>0&&this.gain.setValueAtTime(.001,i),o(this.data.peak,this.data.attack),o(.001,this.data.decay),this.gain.setTargetAtTime(0,i,.013)}};x(w,"types",["linear","instant","exp"]),x(w,"shortName","e");let q=w;class j extends AudioBufferSourceNode{constructor(t){super(t);const n=2*t.sampleRate,i=t.createBuffer(1,n,t.sampleRate);this.type="white",this.buffer=i,this.loop=!0,this.regenerateBuffer(),this.start(0)}static dataToString(t){switch(t.type){default:case"white":return"0";case"pink":return"1";case"brown":return"2"}}static dataFromString(t){switch(Number(t)){default:case"0":return"white";case"1":return"pink";case"2":return"brown"}}regenerateBuffer(){const t=this.buffer.getChannelData(0),n=2*this.context.sampleRate;switch(this.type){case"pink":var i,o,a,s,r,d,l;i=o=a=s=r=d=l=0;for(var u=0;u<n;u++){const p=Math.random()*2-1;i=.99886*i+p*.0555179,o=.99332*o+p*.0750759,a=.969*a+p*.153852,s=.8665*s+p*.3104856,r=.55*r+p*.5329522,d=-.7616*d-p*.016898,t[u]=i+o+a+s+r+d+l+p*.5362,t[u]*=.11,l=p*.115926}break;case"brown":for(var f=0,u=0;u<n;u++){var m=Math.random()*2-1;t[u]=(f+.02*m)/1.02,f=t[u],t[u]*=3.5}break;case"white":default:for(var u=0;u<n;u++)t[u]=Math.random()*2-1;break}}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}x(j,"shortName","n");class A{constructor(t){this.context=t,this.bpm=60,this.connections=[],this.schedule()}static dataToString(t){return`${t.bpm}`}schedule(){const t=this.context.currentTime,n=Math.max(1,this.bpm),i=t+60/n-t%(60/n),o=i+60/n;for(let a=0;a<this.connections.length;a++){const s=this.connections[a];s.applyEnvelope(i),s.applyEnvelope(o)}setTimeout(()=>{this.schedule()},30/Math.max(60,n))}static dataFromString(t){return{bpm:Number(t)}}getInput(t){return this}updateData(t){this.bpm=Number(t.bpm)}connect(t){console.log("current",this.context.currentTime),this.connections.push(t)}disconnect(t){const n=this.connections.indexOf(t);n>-1&&(this.connections=this.connections.splice(n,1))}}x(A,"shortName","c");var H=document.getElementById("drawflow");const c=new Drawflow(H);var g=new(window.AudioContext||window.webkitAudioContext);c.reroute=!0;c.start();var D={};class U{minifyConnections(t){var n="";for(const[i,{connections:o}]of Object.entries(t)){const a=i.replace("output_","");for(let s=0;s<o.length;s++){const{node:r,output:d}=o[s],l=d.replace("input_","");n!==""&&(n+=","),n+=`${a},${r},${l}`}}return n}unminifyConnections(t){if(t==="")return{};const n={},i=t.split(",");for(let o=0;o<i.length/3;o++){const a=`output_${i[3*o]}`,s=`${i[3*o+1]}`,r=`input_${i[3*o+2]}`;a in n||(n[a]={connections:[]}),n[a].connections.push({node:s,output:r})}return n}async jsonToString(t){const n=[];for(const[i,o]of Object.entries(t)){const{data:a,id:s,name:r,outputs:d,pos_x:l,pos_y:u}=o,f=[];for(const[b,I]of Object.entries(d)){const S=I.connections;S.length>0&&f.push([b.replace("output_",""),S])}const m=Math.round(l),p=Math.round(u),v=this.minifyConnections(d),y=D[r].dataToString(a),k=`${s}|${r}|${m}|${p}|${v}|${y}`;f.length>0,Object.keys(a).length>0,n.push(k)}return JSON.stringify(n)}async jsonFromString(t){const n=JSON.parse(t),i={};for(let o=0;o<n.length;o++){const a=n[o],[s,r,d,l,u,f]=a.split("|"),m=D[r].dataFromString(f),p=this.unminifyConnections(u);console.log(p),i[s]={data:m,id:s,name:r,outputs:p,pos_x:Number(d),pos_y:Number(l)}}return i}}const P=new G(new $,new U),h=new Map;function W(e){if(typeof e!="object"||e===null)return null;const t={};for(const[n,i]of Object.entries(e.drawflow.Home.data)){const{data:o,id:a,name:s,outputs:r,pos_x:d,pos_y:l}=i;t[n]={data:o,id:a,name:s,outputs:r,pos_x:d,pos_y:l}}return t}function V(e){return typeof e!="object"||e===null?null:{drawflow:{Home:{data:e}}}}async function N(){return P.saveData(W(c.export()))}async function J(){const e=V(await P.fetchData());if(e&&e!="undefined"&&e!==null){const{data:n}=e.drawflow.Home,i={},o={};for(const[r,d]of Object.entries(n)){const{id:l,outputs:u}=d;i[l]={};for(const[f,m]of Object.entries(u)){i[l][f]=[];for(let p=0;p<m.connections.length;p++){const{node:v,output:y}=m.connections[p];i[l][f].push({id:v,inputName:y})}}}const a={};for(const[r,d]of Object.entries(i))Object.keys(d).length===0&&(a[r]=0);for(var t={};;){for(const[r,d]of Object.entries(i))if(!(r.toString()in a))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f],p=a[Number(m.id)];if(p!==void 0){t[r]!==void 0?t[r]=Math.min(t[r],p):t[r]=p;break}}if(Object.keys(t).length===0)break;for(const[r,d]of Object.entries(t))a[r]=d+1;t={}}for(const[r,d]of Object.entries(n))a[r];const s={};for(const[r,d]of Object.entries(n)){const l=a[r];s[l]===void 0?s[l]=1:s[l]=s[l]+1,s[l]}for(const[r,d]of Object.entries(n)){const{id:l,name:u,data:f,pos_x:m,pos_y:p}=d,v=C(u,m,p,f);h[v].updateData(f),o[l]=v}for(const[r,d]of Object.entries(i))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const m=u[f].id,p=u[f].inputName;c.addConnection(o[r],o[m],l,p)}}await N()}function L(){var t,n;g.resume();const e=Date.now();for(const[i,o]of Object.entries(h)){const a=o.canvas,s=o.analyser;if(a&&s){const r=a.getContext("2d"),d=s.frequencyBinCount,l=new Uint8Array(d);s.getByteTimeDomainData(l),o.history.push([e,l]);const u=500;o.history=o.history.filter(([y,k])=>y>e-u);const f=1e3*s.frequencyBinCount/g.sampleRate,m=f/s.frequencyBinCount;r.clearRect(0,0,a.width,a.height),r.fillStyle="rgb(200 200 200)",r.fillRect(0,0,a.width,a.height),r.lineWidth=2,r.strokeStyle="rgb(0 0 0)",r.beginPath();let p=0,v=o.history[0][0]-f;for(let y=0;y<o.history.length;y++){const k=o.history[y][1];for(let b=0;b<k.length;b++){const S=k[b]/128*(a.height/2);if(y===0&&b==0?r.moveTo(a.width*p,S):r.lineTo(a.width*p,S),p+=m/u,v+=m,v>((n=(t=o.history)==null?void 0:t[y+1])==null?void 0:n[0])-f)break}}r.stroke()}}requestAnimationFrame(L)}function X(e){const t=c.getNodeFromId(e);switch(t.class){case"o":h[e]=g.createOscillator(),h[e].start();break;case"s":h[e]=g;break;case"g":h[e]=g.createGain();break;case"e":h[e]=new q(g);break;case"f":h[e]=g.createBiquadFilter();break;case"n":h[e]=new j(g);break;case"c":h[e]=new A(g);break}switch(t.class){case"o":case"g":case"e":case"f":case"n":const n=document.getElementById(`node-${e}`).getElementsByClassName("drawflow_content_node")[0].children[0],i=document.createElement("canvas");i.width=180,i.height=180,n.appendChild(i);const o=g.createAnalyser();o.fftSize=2048;const a=o.frequencyBinCount,s=new Uint8Array(a);o.getByteTimeDomainData(s),h[e].connect(o),h[e].canvas=i,h[e].analyser=o,h[e].history=[]}}c.on("nodeCreated",()=>{N()});c.on("nodeRemoved",function(e){N()});c.on("nodeSelected",function(e){});c.on("moduleCreated",function(e){});c.on("moduleChanged",function(e){});BiquadFilterNode.types=["lowpass","highpass","bandpass","lowshelf","peaking","notch","allpass"];BiquadFilterNode.dataToString=function(e){const{type:t,frequency:n}=e;return`${BiquadFilterNode.types.indexOf(t)}${n}`};BiquadFilterNode.dataFromString=function(e){return{type:BiquadFilterNode.types[Number(e[0])],frequency:Number(e.substring(1))}};BiquadFilterNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(e){switch(e){default:return this.destination}};AudioContext.dataToString=function(e){return""};AudioContext.dataFromString=function(e){return{}};GainNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.gain}};GainNode.dataToString=function(e){return`${e.gain}`};GainNode.dataFromString=function(e){return{gain:Number(e)}};OscillatorNode.types=["sine","square","sawtooth","triangle"];OscillatorNode.prototype.getInput=function(e){switch(e){default:return this.frequency}};OscillatorNode.dataToString=function(e){const{type:t,frequency:n}=e;return`${OscillatorNode.types.indexOf(t)}${n}`};OscillatorNode.dataFromString=function(e){return{type:OscillatorNode.types[Number(e[0])],frequency:Number(e.substring(1))}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};GainNode.prototype.updateData=function(e){this.gain.value=Number(e.gain)};BiquadFilterNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=Number(e.frequency)};c.on("connectionCreated",function(e){const t=h[e.output_id],n=h[e.input_id];t&&n&&t.connect(n.getInput(e.input_class)),N()});c.on("connectionRemoved",function(e){var t;(t=h[e.output_id])==null||t.disconnect(h[e.input_id].getInput(e.input_class)),N()});c.on("mouseMove",function(e){});c.on("nodeDataChanged",function(e){const{data:t}=c.getNodeFromId(e);console.log(t),h[e].updateData(t),N()});c.on("nodeMoved",function(e){});c.on("zoom",function(e){});c.on("translate",function(e){});c.on("addReroute",function(e){});c.on("removeReroute",function(e){});var B=document.getElementsByClassName("drag-drawflow");for(var O=0;O<B.length;O++)B[O].addEventListener("touchend",R,!1),B[O].addEventListener("touchmove",Y,!1),B[O].addEventListener("touchstart",M,!1);var F="",T=null;function Y(e){T=e}function K(e){e.preventDefault()}function M(e){e.type==="touchstart"?F=e.target.closest(".drag-drawflow").getAttribute("data-node"):e.dataTransfer.setData("node",e.target.getAttribute("data-node"))}function R(e){if(e.type==="touchend"){var t=document.elementFromPoint(T.touches[0].clientX,T.touches[0].clientY).closest("#drawflow");t!=null&&C(F,T.touches[0].clientX,T.touches[0].clientY),F=""}else{e.preventDefault();var n=e.dataTransfer.getData("node");C(n,e.clientX,e.clientY)}}function C(e,t,n,i=null){if(c.editor_mode==="fixed")return null;t=t*(c.precanvas.clientWidth/(c.precanvas.clientWidth*c.zoom))-c.precanvas.getBoundingClientRect().x*(c.precanvas.clientWidth/(c.precanvas.clientWidth*c.zoom)),n=n*(c.precanvas.clientHeight/(c.precanvas.clientHeight*c.zoom))-c.precanvas.getBoundingClientRect().y*(c.precanvas.clientHeight/(c.precanvas.clientHeight*c.zoom));var o=null;switch(e){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-volume-up"></i> Audio Out </div>
      </div>
      `;o=c.addNode("s",1,0,t,n,"s",i??{},a);break;case"g":var s=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;o=c.addNode("g",2,1,t,n,"g",i??{gain:1},s);break;case"e":var r=`
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
      `;o=c.addNode("e",1,1,t,n,"e",i??{ramptype:"exp",attack:1,peak:1,decay:1},r);break;case"n":var d=`
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
        `;o=c.addNode("n",0,1,t,n,"n",i??{type:"white"},d);break;case"f":var l=`
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
      `;o=c.addNode("f",2,1,t,n,"f",i??{type:"lowpass",frequency:200},l);break;case"c":var u=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Clock</div>
        <div class="box">
          <p>BPM</p>
          <input type="number" value=60 df-bpm>
        </div>
      </div>
      `;o=c.addNode("c",0,1,t,n,"c",i??{bpm:60},u);break;case"o":var f=`
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
    `;o=c.addNode("o",1,1,t,n,"o",i??{type:"sine",frequency:260},f);break;default:return null}return X(o),o}function Q(){for(const[e,t]of Object.entries(h))t.applyEnvelope&&t.applyEnvelope(g.currentTime)}window.drop=R;window.drag=M;window.allowDrop=K;window.trigger=Q;window.editor=c;D={s:AudioContext,g:GainNode,e:q,n:j,f:BiquadFilterNode,o:OscillatorNode,c:A};J();requestAnimationFrame(L);
//# sourceMappingURL=index-143e01a1.js.map
