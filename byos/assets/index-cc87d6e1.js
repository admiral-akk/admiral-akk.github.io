(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();var P=document.getElementById("drawflow");const o=new Drawflow(P);var p=new(window.AudioContext||window.webkitAudioContext);o.reroute=!0;o.start();const d=new Map,O="synth";async function z(e){const n=new Blob([e]).stream().pipeThrough(new CompressionStream("gzip")),s=[];for await(const a of n)s.push(a);return await q(s)}async function F(e){const n=new Blob([e]).stream().pipeThrough(new DecompressionStream("gzip")),s=[];for await(const i of n)s.push(i);const a=await q(s);return new TextDecoder().decode(a)}async function q(e){const n=await new Blob(e).arrayBuffer();return new Uint8Array(n)}async function T(e){const t=JSON.stringify(e);z(t).then(n=>{const a=btoa(String.fromCharCode.apply(null,n)).replace(/\+/g,"-").replace(/\//g,"_"),i=new URL(window.location.href);i.searchParams.set("d",a),window.history.pushState(null,"",i.toString())})}async function M(){const t=new URLSearchParams(window.location.search).get("d");if(!t)return null;let n=t.replace(/-/g,"+").replace(/_/g,"/"),s=new Uint8Array(atob(n).split("").map(a=>a.charCodeAt(0)));return F(s).then(a=>a)}async function j(){const t=await M()??localStorage.getItem(O);if(t&&t!="undefined"){const{data:n}=JSON.parse(t).drawflow.Home,s={},a={};for(const[i,r]of Object.entries(n)){const{id:l,name:h,data:f,html:c,inputs:m,outputs:g,pos_x:u,pos_y:w}=r;console.log(r,Object.keys(m).length,Object.keys(g).length);const v=o.addNode(h,Object.keys(m).length,Object.keys(g).length,u,w,r.class,f,c);d[v].updateData(f),a[l]=v,s[v]={};for(const[y,b]of Object.entries(g)){s[v][y]=[];for(let k=0;k<b.connections.length;k++)s[v][y].push(b.connections[k])}}for(const[i,r]of Object.entries(s))for(const[l,h]of Object.entries(r))for(let f=0;f<h.length;f++){const{node:c,output:m}=h[f];o.addConnection(i,a[c],l,m)}}await T(o.export())}async function S(){const e=o.export();localStorage.setItem(O,JSON.stringify(e)),await T(e)}var U=o.export();o.import(U);function R(){var t,n;p.resume();const e=Date.now();for(const[s,a]of Object.entries(d)){const i=a.canvas,r=a.analyser;if(i&&r){const l=i.getContext("2d"),h=r.frequencyBinCount,f=new Uint8Array(h);r.getByteTimeDomainData(f),a.history.push([e,f]);const c=500;a.history=a.history.filter(([v,y])=>v>e-c);const m=1e3*r.frequencyBinCount/p.sampleRate,g=m/r.frequencyBinCount;l.clearRect(0,0,i.width,i.height),l.fillStyle="rgb(200 200 200)",l.fillRect(0,0,i.width,i.height),l.lineWidth=2,l.strokeStyle="rgb(0 0 0)",l.beginPath();let u=0,w=a.history[0][0]-m;for(let v=0;v<a.history.length;v++){const y=a.history[v][1];for(let b=0;b<y.length;b++){const C=y[b]/128*(i.height/2);if(v===0&&b==0?l.moveTo(i.width*u,C):l.lineTo(i.width*u,C),u+=g/c,w+=g,w>((n=(t=a.history)==null?void 0:t[v+1])==null?void 0:n[0])-m)break}}l.stroke()}}requestAnimationFrame(R)}o.on("nodeCreated",function(e){const t=o.getNodeFromId(e);switch(t.class){case"oscillator":d[e]=p.createOscillator(),d[e].start();break;case"output":d[e]=p;break;case"gain":d[e]=p.createGain();break;case"envelope":d[e]=new V;break;case"filter":d[e]=p.createBiquadFilter();break;case"noise":d[e]=new G;break}switch(t.class){case"oscillator":case"gain":case"envelope":case"filter":case"noise":const n=document.getElementById(`node-${e}`).getElementsByClassName("drawflow_content_node")[0].children[0],s=document.createElement("canvas");s.width=180,s.height=180,n.appendChild(s);const a=p.createAnalyser();a.fftSize=2048;const i=a.frequencyBinCount,r=new Uint8Array(i);a.getByteTimeDomainData(r),d[e].connect(a),d[e].canvas=s,d[e].analyser=a,d[e].history=[]}S()});o.on("nodeRemoved",function(e){S()});o.on("nodeSelected",function(e){});o.on("moduleCreated",function(e){});o.on("moduleChanged",function(e){});console.log("sample rate",p.sampleRate);class G extends AudioBufferSourceNode{constructor(){super(p);const t=2*p.sampleRate,n=p.createBuffer(1,t,p.sampleRate);this.type="white",this.buffer=n,this.loop=!0,this.regenerateBuffer(),this.start(0)}regenerateBuffer(){const t=this.buffer.getChannelData(0),n=2*p.sampleRate;switch(this.type){case"pink":var s,a,i,r,l,h,f;s=a=i=r=l=h=f=0;for(var c=0;c<n;c++){const u=Math.random()*2-1;s=.99886*s+u*.0555179,a=.99332*a+u*.0750759,i=.969*i+u*.153852,r=.8665*r+u*.3104856,l=.55*l+u*.5329522,h=-.7616*h-u*.016898,t[c]=s+a+i+r+l+h+f+u*.5362,t[c]*=.11,f=u*.115926}break;case"brown":for(var m=0,c=0;c<n;c++){var g=Math.random()*2-1;t[c]=(m+.02*g)/1.02,m=t[c],t[c]*=3.5}break;case"white":default:for(var c=0;c<n;c++)t[c]=Math.random()*2-1;break}this.buffer=this.buffer}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}class V extends GainNode{constructor(){super(p),this.constantNode=p.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}applyEnvelope(){var t,n=p.currentTime;switch(console.log(this.data),this.gain.cancelScheduledValues(n),this.data.ramptype){case"linear":t=(a,i)=>this.gain.linearRampToValueAtTime(a,i);break;case"instant":t=(a,i)=>this.gain.setValueAtTime(a,i);break;default:case"exp":t=(a,i)=>this.gain.exponentialRampToValueAtTime(a,i);break}const s=(a,i)=>{i>0&&(n+=i,t(a,n))};this.data.attack>0&&this.gain.setValueAtTime(.001,n),s(this.data.peak,this.data.attack),s(.001,this.data.decay)}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay),this.applyEnvelope()}}BiquadFilterNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(e){switch(e){default:return this.destination}};GainNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.gain}};OscillatorNode.prototype.getInput=function(e){switch(e){default:return this.frequency}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=e.frequency};GainNode.prototype.updateData=function(e){this.gain.value=e.gain};BiquadFilterNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=e.frequency};o.on("connectionCreated",function(e){console.log("Connection created"),console.log(e);const t=d[e.output_id],n=d[e.input_id];t&&n&&t.connect(n.getInput(e.input_class)),S()});o.on("connectionRemoved",function(e){var t;console.log("Connection removed"),console.log(e),(t=d[e.output_id])==null||t.disconnect(d[e.input_id].getInput(e.input_class)),S()});o.on("mouseMove",function(e){});o.on("nodeDataChanged",function(e){const{data:t}=o.getNodeFromId(e);console.log(t,d[e]),d[e].updateData(t),S()});o.on("nodeMoved",function(e){console.log("Node moved "+e)});o.on("zoom",function(e){console.log("Zoom level "+e)});o.on("translate",function(e){});o.on("addReroute",function(e){console.log("Reroute added "+e)});o.on("removeReroute",function(e){console.log("Reroute removed "+e)});var D=document.getElementsByClassName("drag-drawflow");for(var N=0;N<D.length;N++)D[N].addEventListener("touchend",I,!1),D[N].addEventListener("touchmove",W,!1),D[N].addEventListener("touchstart",E,!1);var B="",x=null;function W(e){x=e}function H(e){e.preventDefault()}function E(e){e.type==="touchstart"?B=e.target.closest(".drag-drawflow").getAttribute("data-node"):e.dataTransfer.setData("node",e.target.getAttribute("data-node"))}function I(e){if(e.type==="touchend"){var t=document.elementFromPoint(x.touches[0].clientX,x.touches[0].clientY).closest("#drawflow");t!=null&&A(B,x.touches[0].clientX,x.touches[0].clientY),B=""}else{e.preventDefault();var n=e.dataTransfer.getData("node");A(n,e.clientX,e.clientY)}}function A(e,t,n){if(o.editor_mode==="fixed")return!1;switch(t=t*(o.precanvas.clientWidth/(o.precanvas.clientWidth*o.zoom))-o.precanvas.getBoundingClientRect().x*(o.precanvas.clientWidth/(o.precanvas.clientWidth*o.zoom)),n=n*(o.precanvas.clientHeight/(o.precanvas.clientHeight*o.zoom))-o.precanvas.getBoundingClientRect().y*(o.precanvas.clientHeight/(o.precanvas.clientHeight*o.zoom)),e){case"output":var s=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;o.addNode("output",1,0,t,n,"output",{},s);break;case"gain":var a=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;o.addNode("gain",2,1,t,n,"gain",{gain:1},a);break;case"env":var i=`
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
      `;o.addNode("envelope",0,1,t,n,"envelope",{ramptype:"exp",attack:1,peak:1,decay:1},i);break;case"noise":var r=`
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
        `;o.addNode("noise",0,1,t,n,"noise",{type:"white"},r);break;case"filter":var l=`
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
      `;o.addNode("filter",2,1,t,n,"filter",{type:"lowpass",frequency:200},l);break;case"osc":var h=`
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
    `;o.addNode("oscillator",1,1,t,n,"oscillator",{type:"sine",frequency:260},h);break;case"facebook":var f=`
  <div>
    <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
  </div>
  `;o.addNode("facebook",0,1,t,n,"facebook",{},f);break;case"slack":var c=`
    <div>
      <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
    </div>
    `;o.addNode("slack",1,0,t,n,"slack",{},c);break;case"github":var m=`
    <div>
      <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
      <div class="box">
        <p>Enter repository url</p>
      <input type="text" df-name>
      </div>
    </div>
    `;o.addNode("github",0,1,t,n,"github",{name:""},m);break;case"telegram":var g=`
    <div>
      <div class="title-box"><i class="fab fa-telegram-plane"></i> Telegram bot</div>
      <div class="box">
        <p>Send to telegram</p>
        <p>select channel</p>
        <select df-channel>
          <option value="channel_1">Channel 1</option>
          <option value="channel_2">Channel 2</option>
          <option value="channel_3">Channel 3</option>
          <option value="channel_4">Channel 4</option>
        </select>
      </div>
    </div>
    `;o.addNode("telegram",1,0,t,n,"telegram",{channel:"channel_3"},g);break;case"aws":var u=`
    <div>
      <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
      <div class="box">
        <p>Save in aws</p>
        <input type="text" df-db-dbname placeholder="DB name"><br><br>
        <input type="text" df-db-key placeholder="DB key">
        <p>Output Log</p>
      </div>
    </div>
    `;o.addNode("aws",1,1,t,n,"aws",{db:{dbname:"",key:""}},u);break;case"log":var w=`
      <div>
        <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
      </div>
      `;o.addNode("log",1,0,t,n,"log",{},w);break;case"google":var v=`
      <div>
        <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
      </div>
      `;o.addNode("google",1,0,t,n,"google",{},v);break;case"email":var y=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
      </div>
      `;o.addNode("email",1,0,t,n,"email",{},y);break;case"template":var b=`
      <div>
        <div class="title-box"><i class="fas fa-code"></i> Template</div>
        <div class="box">
          Ger Vars
          <textarea df-template></textarea>
          Output template with vars
        </div>
      </div>
      `;o.addNode("template",1,1,t,n,"template",{template:"Write your template"},b);break;case"multiple":var k=`
      <div>
        <div class="box">
          Multiple!
        </div>
      </div>
      `;o.addNode("multiple",3,4,t,n,"multiple",{},k);break;case"personalized":var C=`
      <div>
        Personalized
      </div>
      `;o.addNode("personalized",1,1,t,n,"personalized",{},C);break;case"dbclick":var L=`
      <div>
      <div class="title-box"><i class="fas fa-mouse"></i> Db Click</div>
        <div class="box dbclickbox" ondblclick="showpopup(event)">
          Db Click here
          <div class="modal" style="display:none">
            <div class="modal-content">
              <span class="close" onclick="closemodal(event)">&times;</span>
              Change your variable {name} !
              <input type="text" df-name>
            </div>

          </div>
        </div>
      </div>
      `;o.addNode("dbclick",1,1,t,n,"dbclick",{name:""},L);break}}function J(){for(const[e,t]of Object.entries(d))console.log(t),t.applyEnvelope&&t.applyEnvelope()}window.drop=I;window.drag=E;window.allowDrop=H;window.editor=o;window.trigger=J;j();requestAnimationFrame(R);
//# sourceMappingURL=index-cc87d6e1.js.map
