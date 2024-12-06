var Q=Object.defineProperty;var Y=(o,t,e)=>t in o?Q(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var v=(o,t,e)=>(Y(o,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function e(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(n){if(n.ep)return;n.ep=!0;const a=e(n);fetch(n.href,a)}})();class E{async compressStrToBase64(t){return btoa(t)}async decompressBase64ToStr(t){return atob(t)}}class Z{async jsonToString(t){return JSON.stringify(t)}async jsonFromString(t){return JSON.parse(t)}}class X{constructor(t=new E,e=new Z){this.compressor=t,this.preprocessor=e}async saveData(t){const e=await this.preprocessor.jsonToString(t);console.log("URL param processed",e);const s=await this.compressor.compressStrToBase64(e);console.log("URL param length",s.length);const n=s.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"."),a=new URL(window.location.href);a.searchParams.set("d",n),window.history.pushState(null,"",a.toString())}async fetchData(){const e=new URLSearchParams(window.location.search).get("d");if(!e)return null;const s=e.replace(/-/g,"+").replace(/_/g,"/").replace(/\./g,"="),n=await this.compressor.decompressBase64ToStr(s);return await this.preprocessor.jsonFromString(n)}}const D=class D extends GainNode{constructor(t){super(t),this.constantNode=t.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.gain.value=0,this.data={ramptype:"exp",peak:1,attack:1,decay:1}}static dataToString(t){const{ramptype:e,peak:s,attack:n,decay:a}=t;return`${D.types.indexOf(e)}${s},${n},${a}`}static dataFromString(t){const e=D.types[Number(t[0])],[s,n,a]=t.substring(1).split(",");return{ramptype:e,attack:Number(n),decay:Number(a),peak:Number(s)}}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay)}applyEnvelope(t){var e,s=t;switch(this.gain.cancelAndHoldAtTime(s),this.data.ramptype){case"linear":e=(a,i)=>this.gain.linearRampToValueAtTime(a,i);break;case"instant":e=(a,i)=>this.gain.setValueAtTime(a,i);break;default:case"exp":e=(a,i)=>this.gain.exponentialRampToValueAtTime(a,i);break}const n=(a,i)=>{i>0&&(s+=i,e(a,s))};this.data.attack>0&&this.gain.setValueAtTime(.001,s),n(this.data.peak,this.data.attack),n(.001,this.data.decay),this.gain.setTargetAtTime(0,s,.013)}};v(D,"types",["linear","instant","exp"]),v(D,"shortName","e");let $=D;class z extends AudioBufferSourceNode{constructor(t){super(t);const e=2*t.sampleRate,s=t.createBuffer(1,e,t.sampleRate);this.type="white",this.buffer=s,this.loop=!0,this.regenerateBuffer(),this.start(0)}static dataToString(t){switch(t.type){default:case"white":return"0";case"pink":return"1";case"brown":return"2"}}static dataFromString(t){switch(Number(t)){default:case"0":return"white";case"1":return"pink";case"2":return"brown"}}regenerateBuffer(){const t=this.buffer.getChannelData(0),e=2*this.context.sampleRate;switch(this.type){case"pink":var s,n,a,i,c,p,d;s=n=a=i=c=p=d=0;for(var u=0;u<e;u++){const m=Math.random()*2-1;s=.99886*s+m*.0555179,n=.99332*n+m*.0750759,a=.969*a+m*.153852,i=.8665*i+m*.3104856,c=.55*c+m*.5329522,p=-.7616*p-m*.016898,t[u]=s+n+a+i+c+p+d+m*.5362,t[u]*=.11,d=m*.115926}break;case"brown":for(var b=0,u=0;u<e;u++){var S=Math.random()*2-1;t[u]=(b+.02*S)/1.02,b=t[u],t[u]*=3.5}break;case"white":default:for(var u=0;u<e;u++)t[u]=Math.random()*2-1;break}}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}v(z,"shortName","n");class H{constructor(t){this.context=t,this.bpm=60,this.connections=[],this.schedule()}static dataToString(t){return`${t.bpm}`}schedule(){const t=this.context.currentTime,e=Math.max(1,this.bpm),s=t+60/e-t%(60/e),n=s+60/e;for(let a=0;a<this.connections.length;a++){const i=this.connections[a];i.applyEnvelope(s),i.applyEnvelope(n)}setTimeout(()=>{this.schedule()},30/Math.max(60,e))}static dataFromString(t){return{bpm:Number(t)}}getInput(t){return this}updateData(t){this.bpm=Number(t.bpm)}connect(t){console.log("current",this.context.currentTime),this.connections.push(t)}disconnect(t){const e=this.connections.indexOf(t);e>-1&&(this.connections=this.connections.splice(e,1))}}v(H,"shortName","c");const j=class j extends BiquadFilterNode{constructor(t){super(t)}updateData(t){this.type=t.type,this.frequency.value=Number(t.frequency)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.frequency}}static dataToString(t){const{type:e,frequency:s}=t;return`${j.types.indexOf(e)}${s}`}static dataFromString(t){return{type:j.types[Number(t[0])],frequency:Number(t.substring(1))}}};v(j,"shortName","f"),v(j,"types",["lowpass","highpass","bandpass","lowshelf","peaking","notch","allpass"]);let F=j;const x=class x extends OscillatorNode{constructor(t){super(t),this.start()}getInput(t){switch(t){default:return this.frequency}}updateData(t){this.type=t.type,this.frequency.value=Number(t.frequency)}};v(x,"shortName","o"),v(x,"types",["sine","square","sawtooth","triangle"]),v(x,"dataToString",function(t){const{type:e,frequency:s}=t;return`${x.types.indexOf(e)}${s}`}),v(x,"dataFromString",function(t){return{type:x.types[Number(t[0])],frequency:Number(t.substring(1))}});let P=x;class _ extends GainNode{constructor(t){super(t)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.gain}}static dataToString(t){return`${t.gain}`}static dataFromString(t){return{gain:Number(t)}}updateData(t){this.gain.value=Number(t.gain)}}v(_,"shortName","g");class M{constructor(t){this.context=t}getInput(t){switch(t){default:return this.context.destination}}updateData(){}}v(M,"shortName","s"),v(M,"dataToString",function(t){return""}),v(M,"dataFromString",function(t){return{}});class U extends DelayNode{constructor(t){super(t)}getInput(t){switch(t){case"input_1":return this;case"input_2":default:return this.delayTime}}updateData(t){this.delayTime.value=Number(t.delay)}static dataFromString(t){return{delay:Number(t)}}static dataToString(t){const{delay:e}=t;return`${e}`}}v(U,"shortName","d");var tt=document.getElementById("drawflow");const r=new Drawflow(tt);var I=new(window.AudioContext||window.webkitAudioContext);r.reroute=!0;r.start();var T={};class et{minifyConnections(t){var e="";for(const[s,{connections:n}]of Object.entries(t)){const a=s.replace("output_","");for(let i=0;i<n.length;i++){const{node:c,output:p}=n[i],d=p.replace("input_","");e!==""&&(e+=","),e+=`${a},${c},${d}`}}return e}unminifyConnections(t){if(t==="")return{};const e={},s=t.split(",");for(let n=0;n<s.length/3;n++){const a=`output_${s[3*n]}`,i=`${s[3*n+1]}`,c=`input_${s[3*n+2]}`;a in e||(e[a]={connections:[]}),e[a].connections.push({node:i,output:c})}return e}async jsonToString(t){const e=[];for(const[s,n]of Object.entries(t)){const{data:a,id:i,name:c,outputs:p,pos_x:d,pos_y:u}=n,b=[];for(const[h,y]of Object.entries(p)){const w=y.connections;w.length>0&&b.push([h.replace("output_",""),w])}const S=Math.round(d),m=Math.round(u),f=this.minifyConnections(p);console.log(c),console.log(T.get(c.toString()));const l=T.get(c.toString()).dataToString(a),g=`${i}|${c}|${S}|${m}|${f}|${l}`;b.length>0,Object.keys(a).length>0,e.push(g)}return JSON.stringify(e)}async jsonFromString(t){const e=JSON.parse(t),s={};for(let n=0;n<e.length;n++){const a=e[n],[i,c,p,d,u,b]=a.split("|"),S=T.get(c.toString()).dataFromString(b),m=this.unminifyConnections(u);console.log(m),s[i]={data:S,id:i,name:c,outputs:m,pos_x:Number(p),pos_y:Number(d)}}return s}}const W=new X(new E,new et),N=new Map;function nt(o){if(typeof o!="object"||o===null)return null;const t={};for(const[e,s]of Object.entries(o.drawflow.Home.data)){const{data:n,id:a,name:i,outputs:c,pos_x:p,pos_y:d}=s;t[e]={data:n,id:a,name:i,outputs:c,pos_x:p,pos_y:d}}return t}function ot(o){return typeof o!="object"||o===null?null:{drawflow:{Home:{data:o}}}}async function O(){return W.saveData(nt(r.export()))}async function at(){const o=ot(await W.fetchData());if(o&&o!="undefined"&&o!==null){const{data:i}=o.drawflow.Home,c={},p={};for(const[f,l]of Object.entries(i)){const{id:g,outputs:h}=l;c[g]={};for(const[y,w]of Object.entries(h)){c[g][y]=[];for(let k=0;k<w.connections.length;k++){const{node:q,output:K}=w.connections[k];c[g][y].push({id:q,inputName:K})}}}const d={};for(const[f,l]of Object.entries(c))Object.keys(l).length===0&&(d[f]=0);for(var t={};;){for(const[f,l]of Object.entries(c))if(!(f.toString()in d))for(const[g,h]of Object.entries(l))for(let y=0;y<h.length;y++){const w=h[y],k=d[Number(w.id)];if(k!==void 0){t[f]!==void 0?t[f]=Math.min(t[f],k):t[f]=k;break}}if(Object.keys(t).length===0)break;for(const[f,l]of Object.entries(t))d[f]=l+1;t={}}for(const[f,l]of Object.entries(i))d[f];var e=-1e6,s=-e,n=e,a=-n;for(const[f,l]of Object.entries(i)){const{pos_x:g,pos_y:h}=l;e=Math.max(g,e),s=Math.min(g,s),n=Math.max(h,n),a=Math.min(h,a)}const u=document.getElementsByClassName("col-right")[0].clientHeight,b=document.getElementsByClassName("col-right")[0].clientWidth,S=-(e+s)/2+b/2+200,m=-(a+n)/2+u/2;for(const[f,l]of Object.entries(i)){const{id:g,name:h,data:y,pos_x:w,pos_y:k}=l,q=R(h,w+S,k+m,y);N[q].updateData(y),p[g]=q}for(const[f,l]of Object.entries(c))for(const[g,h]of Object.entries(l))for(let y=0;y<h.length;y++){const w=h[y].id,k=h[y].inputName;r.addConnection(p[f],p[w],g,k)}}await O()}function V(){var t,e;I.resume();const o=Date.now();for(const[s,n]of Object.entries(N)){const a=n.canvas,i=n.analyser;if(a&&i){const c=a.getContext("2d"),p=i.frequencyBinCount,d=new Uint8Array(p);i.getByteTimeDomainData(d),n.history.push([o,d]);const u=500;n.history=n.history.filter(([l,g])=>l>o-u);const b=1e3*i.frequencyBinCount/I.sampleRate,S=b/i.frequencyBinCount;c.clearRect(0,0,a.width,a.height),c.fillStyle="rgb(200 200 200)",c.fillRect(0,0,a.width,a.height),c.lineWidth=2,c.strokeStyle="rgb(0 0 0)",c.beginPath();let m=0,f=n.history[0][0]-b;for(let l=0;l<n.history.length;l++){const g=n.history[l][1];for(let h=0;h<g.length;h++){const w=g[h]/128*(a.height/2);if(l===0&&h==0?c.moveTo(a.width*m,w):c.lineTo(a.width*m,w),m+=S/u,f+=S,f>((e=(t=n.history)==null?void 0:t[l+1])==null?void 0:e[0])-b)break}}c.stroke()}}requestAnimationFrame(V)}function st(o){const t=r.getNodeFromId(o);switch(console.log(t.class.toString()),console.log(T.get(t.class.toString())),N[o]=new(T.get(t.class.toString())).prototype.constructor(I),t.class){case"o":case"g":case"e":case"f":case"n":const e=document.getElementById(`node-${o}`).getElementsByClassName("drawflow_content_node")[0].children[0],s=document.createElement("canvas");s.width=180,s.height=180,e.appendChild(s);const n=I.createAnalyser();n.fftSize=2048;const a=n.frequencyBinCount,i=new Uint8Array(a);n.getByteTimeDomainData(i),N[o].connect(n),N[o].canvas=s,N[o].analyser=n,N[o].history=[]}}r.on("nodeCreated",()=>{O()});r.on("nodeRemoved",function(o){O()});r.on("nodeSelected",function(o){});r.on("moduleCreated",function(o){});r.on("moduleChanged",function(o){});r.on("connectionCreated",function(o){const t=N[o.output_id],e=N[o.input_id];t&&e&&t.connect(e.getInput(o.input_class)),O()});r.on("connectionRemoved",function(o){var t;(t=N[o.output_id])==null||t.disconnect(N[o.input_id].getInput(o.input_class)),O()});r.on("mouseMove",function(o){});r.on("nodeDataChanged",function(o){const{data:t}=r.getNodeFromId(o);console.log(t),N[o].updateData(t),O()});r.on("nodeMoved",function(o){});r.on("zoom",function(o){});r.on("translate",function(o){});r.on("addReroute",function(o){});r.on("removeReroute",function(o){});var A=document.getElementsByClassName("drag-drawflow");for(var B=0;B<A.length;B++)A[B].addEventListener("touchend",J,!1),A[B].addEventListener("touchmove",it,!1),A[B].addEventListener("touchstart",G,!1);var L="",C=null;function it(o){C=o}function rt(o){o.preventDefault()}function G(o){o.type==="touchstart"?L=o.target.closest(".drag-drawflow").getAttribute("data-node"):o.dataTransfer.setData("node",o.target.getAttribute("data-node"))}function J(o){if(o.type==="touchend"){var t=document.elementFromPoint(C.touches[0].clientX,C.touches[0].clientY).closest("#drawflow");t!=null&&R(L,C.touches[0].clientX,C.touches[0].clientY),L=""}else{o.preventDefault();var e=o.dataTransfer.getData("node");R(e,o.clientX,o.clientY)}}function R(o,t,e,s=null){if(r.editor_mode==="fixed")return null;t=t*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom))-r.precanvas.getBoundingClientRect().x*(r.precanvas.clientWidth/(r.precanvas.clientWidth*r.zoom)),e=e*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom))-r.precanvas.getBoundingClientRect().y*(r.precanvas.clientHeight/(r.precanvas.clientHeight*r.zoom));var n=null;switch(o){case"s":var a=`
      <div>
        <div class="title-box"><i class="fas fa-volume-up"></i> Audio Out </div>
      </div>
      `;n=r.addNode("s",1,0,t,e,"s",s??{},a);break;case"g":var i=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;n=r.addNode("g",2,1,t,e,"g",s??{gain:1},i);break;case"e":var c=`
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
      `;n=r.addNode("e",1,1,t,e,"e",s??{ramptype:"exp",attack:1,peak:1,decay:1},c);break;case"n":var p=`
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
        `;n=r.addNode("n",0,1,t,e,"n",s??{type:"white"},p);break;case"f":var d=`
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
      `;n=r.addNode("f",2,1,t,e,"f",s??{type:"lowpass",frequency:200},d);break;case"c":var u=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Clock</div>
        <div class="box">
          <p>BPM</p>
          <input type="number" value=60 df-bpm>
        </div>
      </div>
      `;n=r.addNode("c",0,1,t,e,"c",s??{bpm:60},u);break;case"o":var b=`
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
    `;n=r.addNode("o",1,1,t,e,"o",s??{type:"sine",frequency:260},b);break;case"d":var S=`
      <div>
        <div class="title-box"><i class="fab fa-telegram-plane"></i> Delay</div>
        <div class="box">
          <p>Delay Time</p>
          <input type="number" df-delay>
        </div>
      </div>
      `;n=r.addNode("d",2,1,t,e,"d",s??{delay:.2},S);break;default:return null}return st(n),n}function ct(){for(const[o,t]of Object.entries(N))t.applyEnvelope&&t.applyEnvelope(I.currentTime)}window.drop=J;window.drag=G;window.allowDrop=rt;window.trigger=ct;window.editor=r;const ut=[M,_,$,z,F,P,H,U];T=new Map(ut.map(o=>[o.shortName,o]));console.log(T);at();requestAnimationFrame(V);
//# sourceMappingURL=index-cdfe84c7.js.map
