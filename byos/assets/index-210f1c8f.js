var G=Object.defineProperty;var J=(o,t,e)=>t in o?G(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var m=(o,t,e)=>(J(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();class M{async compressStrToBase64(t){return btoa(t)}async decompressBase64ToStr(t){return atob(t)}}class X{async jsonToString(t){return JSON.stringify(t)}async jsonFromString(t){return JSON.parse(t)}}class Y{constructor(t=new M,e=new X){this.compressor=t,this.preprocessor=e}async saveData(t){const e=await this.preprocessor.jsonToString(t);console.log("URL param processed",e);const s=await this.compressor.compressStrToBase64(e);console.log("URL param length",s.length);const n=s.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"."),a=new URL(window.location.href);a.searchParams.set("d",n),window.history.pushState(null,"",a.toString())}async fetchData(){const e=new URLSearchParams(window.location.search).get("d");if(!e)return null;const s=e.replace(/-/g,"+").replace(/_/g,"/").replace(/\./g,"="),n=await this.compressor.decompressBase64ToStr(s);return await this.preprocessor.jsonFromString(n)}}const S=class S extends GainNode{constructor(t){super(t),this.constantNode=t.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.gain.value=0,this.data={ramptype:"exp",peak:1,attack:1,decay:1}}static dataToString(t){const{ramptype:e,peak:s,attack:n,decay:a}=t;return`${S.types.indexOf(e)}${s},${n},${a}`}static dataFromString(t){const e=S.types[Number(t[0])],[s,n,a]=t.substring(1).split(",");return{ramptype:e,attack:Number(n),decay:Number(a),peak:Number(s)}}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay)}applyEnvelope(t){var e,s=t;switch(this.gain.cancelAndHoldAtTime(s),this.data.ramptype){case"linear":e=(a,i)=>this.gain.linearRampToValueAtTime(a,i);break;case"instant":e=(a,i)=>this.gain.setValueAtTime(a,i);break;default:case"exp":e=(a,i)=>this.gain.exponentialRampToValueAtTime(a,i);break}const n=(a,i)=>{i>0&&(s+=i,e(a,s))};this.data.attack>0&&this.gain.setValueAtTime(.001,s),n(this.data.peak,this.data.attack),n(.001,this.data.decay),this.gain.setTargetAtTime(0,s,.013)}};m(S,"types",["linear","instant","exp"]),m(S,"shortName","e");let q=S;class R extends AudioBufferSourceNode{constructor(t){super(t);const e=2*t.sampleRate,s=t.createBuffer(1,e,t.sampleRate);this.type="white",this.buffer=s,this.loop=!0,this.regenerateBuffer(),this.start(0)}static dataToString(t){switch(t.type){default:case"white":return"0";case"pink":return"1";case"brown":return"2"}}static dataFromString(t){switch(Number(t)){default:case"0":return"white";case"1":return"pink";case"2":return"brown"}}regenerateBuffer(){const t=this.buffer.getChannelData(0),e=2*this.context.sampleRate;switch(this.type){case"pink":var s,n,a,i,r,d,l;s=n=a=i=r=d=l=0;for(var u=0;u<e;u++){const p=Math.random()*2-1;s=.99886*s+p*.0555179,n=.99332*n+p*.0750759,a=.969*a+p*.153852,i=.8665*i+p*.3104856,r=.55*r+p*.5329522,d=-.7616*d-p*.016898,t[u]=s+n+a+i+r+d+l+p*.5362,t[u]*=.11,l=p*.115926}break;case"brown":for(var f=0,u=0;u<e;u++){var h=Math.random()*2-1;t[u]=(f+.02*h)/1.02,f=t[u],t[u]*=3.5}break;case"white":default:for(var u=0;u<e;u++)t[u]=Math.random()*2-1;break}}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}m(R,"shortName","n");class E{constructor(t){this.context=t,this.bpm=60,this.connections=[],this.schedule()}static dataToString(t){return`${t.bpm}`}schedule(){const t=this.context.currentTime,e=Math.max(1,this.bpm),s=t+60/e-t%(60/e),n=s+60/e;for(let a=0;a<this.connections.length;a++){const i=this.connections[a];i.applyEnvelope(s),i.applyEnvelope(n)}setTimeout(()=>{this.schedule()},30/Math.max(60,e))}static dataFromString(t){return{bpm:Number(t)}}getInput(t){return this}updateData(t){this.bpm=Number(t.bpm)}connect(t){console.log("current",this.context.currentTime),this.connections.push(t)}disconnect(t){const e=this.connections.indexOf(t);e>-1&&(this.connections=this.connections.splice(e,1))}}m(E,"shortName","c");const x=class x extends BiquadFilterNode{constructor(t){super(t)}updateData(t){this.type=t.type,this.frequency.value=Number(t.frequency)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.frequency}}static dataToString(t){const{type:e,frequency:s}=t;return`${x.types.indexOf(e)}${s}`}static dataFromString(t){return{type:x.types[Number(t[0])],frequency:Number(t.substring(1))}}};m(x,"shortName","f"),m(x,"types",["lowpass","highpass","bandpass","lowshelf","peaking","notch","allpass"]);let A=x;const b=class b extends OscillatorNode{constructor(t){super(t),this.start()}getInput(t){switch(t){default:return this.frequency}}updateData(t){this.type=t.type,this.frequency.value=Number(t.frequency)}};m(b,"shortName","o"),m(b,"types",["sine","square","sawtooth","triangle"]),m(b,"dataToString",function(t){const{type:e,frequency:s}=t;return`${b.types.indexOf(e)}${s}`}),m(b,"dataFromString",function(t){return{type:b.types[Number(t[0])],frequency:Number(t.substring(1))}});let $=b;class z extends GainNode{constructor(t){super(t)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.gain}}static dataToString(t){return`${t.gain}`}static dataFromString(t){return{gain:Number(t)}}updateData(t){this.gain.value=Number(t.gain)}}m(z,"shortName","g");class C{constructor(t){this.context=t}getInput(t){switch(t){default:return this.context.destination}}updateData(){}}m(C,"shortName","s"),m(C,"dataToString",function(t){return""}),m(C,"dataFromString",function(t){return{}});class H extends DelayNode{constructor(t){super(t)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.delayTime}}updateData(t){this.delayTime.value=Number(t.delay)}static dataFromString(t){return{delay:Number(t)}}static dataToString(t){const{delay:e}=t;return`${e}`}}m(H,"shortName","d");var K=document.getElementById("drawflow");const c=new Drawflow(K);var I=new(window.AudioContext||window.webkitAudioContext);c.reroute=!0;c.start();var w={};class Q{minifyConnections(t){var e="";for(const[s,{connections:n}]of Object.entries(t)){const a=s.replace("output_","");for(let i=0;i<n.length;i++){const{node:r,output:d}=n[i],l=d.replace("input_","");e!==""&&(e+=","),e+=`${a},${r},${l}`}}return e}unminifyConnections(t){if(t==="")return{};const e={},s=t.split(",");for(let n=0;n<s.length/3;n++){const a=`output_${s[3*n]}`,i=`${s[3*n+1]}`,r=`input_${s[3*n+2]}`;a in e||(e[a]={connections:[]}),e[a].connections.push({node:i,output:r})}return e}async jsonToString(t){const e=[];for(const[s,n]of Object.entries(t)){const{data:a,id:i,name:r,outputs:d,pos_x:l,pos_y:u}=n,f=[];for(const[N,L]of Object.entries(d)){const D=L.connections;D.length>0&&f.push([N.replace("output_",""),D])}const h=Math.round(l),p=Math.round(u),v=this.minifyConnections(d);console.log(r),console.log(w.get(r.toString()));const y=w.get(r.toString()).dataToString(a),T=`${i}|${r}|${h}|${p}|${v}|${y}`;f.length>0,Object.keys(a).length>0,e.push(T)}return JSON.stringify(e)}async jsonFromString(t){const e=JSON.parse(t),s={};for(let n=0;n<e.length;n++){const a=e[n],[i,r,d,l,u,f]=a.split("|"),h=w.get(r.toString()).dataFromString(f),p=this.unminifyConnections(u);console.log(p),s[i]={data:h,id:i,name:r,outputs:p,pos_x:Number(d),pos_y:Number(l)}}return s}}const U=new Y(new M,new Q),g=new Map;function Z(o){if(typeof o!="object"||o===null)return null;const t={};for(const[e,s]of Object.entries(o.drawflow.Home.data)){const{data:n,id:a,name:i,outputs:r,pos_x:d,pos_y:l}=s;t[e]={data:n,id:a,name:i,outputs:r,pos_x:d,pos_y:l}}return t}function tt(o){return typeof o!="object"||o===null?null:{drawflow:{Home:{data:o}}}}async function k(){return U.saveData(Z(c.export()))}async function et(){const o=tt(await U.fetchData());if(o&&o!="undefined"&&o!==null){const{data:e}=o.drawflow.Home,s={},n={};for(const[r,d]of Object.entries(e)){const{id:l,outputs:u}=d;s[l]={};for(const[f,h]of Object.entries(u)){s[l][f]=[];for(let p=0;p<h.connections.length;p++){const{node:v,output:y}=h.connections[p];s[l][f].push({id:v,inputName:y})}}}const a={};for(const[r,d]of Object.entries(s))Object.keys(d).length===0&&(a[r]=0);for(var t={};;){for(const[r,d]of Object.entries(s))if(!(r.toString()in a))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const h=u[f],p=a[Number(h.id)];if(p!==void 0){t[r]!==void 0?t[r]=Math.min(t[r],p):t[r]=p;break}}if(Object.keys(t).length===0)break;for(const[r,d]of Object.entries(t))a[r]=d+1;t={}}for(const[r,d]of Object.entries(e))a[r];const i={};for(const[r,d]of Object.entries(e)){const l=a[r];i[l]===void 0?i[l]=1:i[l]=i[l]+1,i[l]}for(const[r,d]of Object.entries(e)){const{id:l,name:u,data:f,pos_x:h,pos_y:p}=d,v=P(u,h,p,f);g[v].updateData(f),n[l]=v}for(const[r,d]of Object.entries(s))for(const[l,u]of Object.entries(d))for(let f=0;f<u.length;f++){const h=u[f].id,p=u[f].inputName;c.addConnection(n[r],n[h],l,p)}}await k()}function _(){var t,e;I.resume();const o=Date.now();for(const[s,n]of Object.entries(g)){const a=n.canvas,i=n.analyser;if(a&&i){const r=a.getContext("2d"),d=i.frequencyBinCount,l=new Uint8Array(d);i.getByteTimeDomainData(l),n.history.push([o,l]);const u=500;n.history=n.history.filter(([y,T])=>y>o-u);const f=1e3*i.frequencyBinCount/I.sampleRate,h=f/i.frequencyBinCount;r.clearRect(0,0,a.width,a.height),r.fillStyle="rgb(200 200 200)",r.fillRect(0,0,a.width,a.height),r.lineWidth=2,r.strokeStyle="rgb(0 0 0)",r.beginPath();let p=0,v=n.history[0][0]-f;for(let y=0;y<n.history.length;y++){const T=n.history[y][1];for(let N=0;N<T.length;N++){const D=T[N]/128*(a.height/2);if(y===0&&N==0?r.moveTo(a.width*p,D):r.lineTo(a.width*p,D),p+=h/u,v+=h,v>((e=(t=n.history)==null?void 0:t[y+1])==null?void 0:e[0])-f)break}}r.stroke()}}requestAnimationFrame(_)}function nt(o){const t=c.getNodeFromId(o);switch(console.log(t.class.toString()),console.log(w.get(t.class.toString())),g[o]=new(w.get(t.class.toString())).prototype.constructor(I),t.class){case"o":case"g":case"e":case"f":case"n":const e=document.getElementById(`node-${o}`).getElementsByClassName("drawflow_content_node")[0].children[0],s=document.createElement("canvas");s.width=180,s.height=180,e.appendChild(s);const n=I.createAnalyser();n.fftSize=2048;const a=n.frequencyBinCount,i=new Uint8Array(a);n.getByteTimeDomainData(i),g[o].connect(n),g[o].canvas=s,g[o].analyser=n,g[o].history=[]}}c.on("nodeCreated",()=>{k()});c.on("nodeRemoved",function(o){k()});c.on("nodeSelected",function(o){});c.on("moduleCreated",function(o){});c.on("moduleChanged",function(o){});c.on("connectionCreated",function(o){const t=g[o.output_id],e=g[o.input_id];t&&e&&t.connect(e.getInput(o.input_class)),k()});c.on("connectionRemoved",function(o){var t;(t=g[o.output_id])==null||t.disconnect(g[o.input_id].getInput(o.input_class)),k()});c.on("mouseMove",function(o){});c.on("nodeDataChanged",function(o){const{data:t}=c.getNodeFromId(o);console.log(t),g[o].updateData(t),k()});c.on("nodeMoved",function(o){});c.on("zoom",function(o){});c.on("translate",function(o){});c.on("addReroute",function(o){});c.on("removeReroute",function(o){});var B=document.getElementsByClassName("drag-drawflow");for(var O=0;O<B.length;O++)B[O].addEventListener("touchend",V,!1),B[O].addEventListener("touchmove",ot,!1),B[O].addEventListener("touchstart",W,!1);var F="",j=null;function ot(o){j=o}function at(o){o.preventDefault()}function W(o){o.type==="touchstart"?F=o.target.closest(".drag-drawflow").getAttribute("data-node"):o.dataTransfer.setData("node",o.target.getAttribute("data-node"))}function V(o){if(o.type==="touchend"){var t=document.elementFromPoint(j.touches[0].clientX,j.touches[0].clientY).closest("#drawflow");t!=null&&P(F,j.touches[0].clientX,j.touches[0].clientY),F=""}else{o.preventDefault();var e=o.dataTransfer.getData("node");P(e,o.clientX,o.clientY)}}function P(o,t,e,s=null){if(c.editor_mode==="fixed")return null;t=t*(c.precanvas.clientWidth/(c.precanvas.clientWidth*c.zoom))-c.precanvas.getBoundingClientRect().x*(c.precanvas.clientWidth/(c.precanvas.clientWidth*c.zoom)),e=e*(c.precanvas.clientHeight/(c.precanvas.clientHeight*c.zoom))-c.precanvas.getBoundingClientRect().y*(c.precanvas.clientHeight/(c.precanvas.clientHeight*c.zoom));var n=null;switch(o){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-volume-up"></i> Audio Out </div>
      </div>
      `;n=c.addNode("s",1,0,t,e,"s",s??{},a);break;case"g":var i=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;n=c.addNode("g",2,1,t,e,"g",s??{gain:1},i);break;case"e":var r=`
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
      `;n=c.addNode("e",1,1,t,e,"e",s??{ramptype:"exp",attack:1,peak:1,decay:1},r);break;case"n":var d=`
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
        `;n=c.addNode("n",0,1,t,e,"n",s??{type:"white"},d);break;case"f":var l=`
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
      `;n=c.addNode("f",2,1,t,e,"f",s??{type:"lowpass",frequency:200},l);break;case"c":var u=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Clock</div>
        <div class="box">
          <p>BPM</p>
          <input type="number" value=60 df-bpm>
        </div>
      </div>
      `;n=c.addNode("c",0,1,t,e,"c",s??{bpm:60},u);break;case"o":var f=`
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
    `;n=c.addNode("o",1,1,t,e,"o",s??{type:"sine",frequency:260},f);break;case"d":var h=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Delay</div>
        <div class="box">
          <p>Delay Time</p>
          <input type="number" df-delay>
        </div>
      </div>
      `;n=c.addNode("d",2,1,t,e,"d",s??{delay:.2},h);break;default:return null}return nt(n),n}function st(){for(const[o,t]of Object.entries(g))t.applyEnvelope&&t.applyEnvelope(I.currentTime)}window.drop=V;window.drag=W;window.allowDrop=at;window.trigger=st;window.editor=c;const it=[C,z,q,R,A,$,E,H];w=new Map(it.map(o=>[o.shortName,o]));console.log(w);et();requestAnimationFrame(_);
//# sourceMappingURL=index-210f1c8f.js.map
