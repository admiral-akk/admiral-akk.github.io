(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&l(s)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function l(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();var L=document.getElementById("drawflow");const a=new Drawflow(L);var p=new(window.AudioContext||window.webkitAudioContext);a.reroute=!0;a.start();const d=new Map,q="synth";function A(e){const t=new URL(window.location.href),n=window.btoa(JSON.stringify(e));t.searchParams.set("d",n),window.history.pushState(null,"",t.toString())}function P(){const t=new URLSearchParams(window.location.search).get("d");return t?window.atob(t):null}function F(){const t=P()??localStorage.getItem(q);if(console.log(t),t&&t!="undefined"){const{data:n}=JSON.parse(t).drawflow.Home,l={},o={};for(const[i,s]of Object.entries(n)){const{id:r,name:h,data:f,html:c,inputs:g,outputs:m,pos_x:u,pos_y:w}=s;console.log(s,Object.keys(g).length,Object.keys(m).length);const v=a.addNode(h,Object.keys(g).length,Object.keys(m).length,u,w,s.class,f,c);d[v].updateData(f),o[r]=v,l[v]={};for(const[y,b]of Object.entries(m)){l[v][y]=[];for(let k=0;k<b.connections.length;k++)l[v][y].push(b.connections[k])}}for(const[i,s]of Object.entries(l))for(const[r,h]of Object.entries(s))for(let f=0;f<h.length;f++){const{node:c,output:g}=h[f];a.addConnection(i,o[c],r,g)}}A(a.export())}function D(){const e=a.export();localStorage.setItem(q,JSON.stringify(e)),A(e)}var M=a.export();a.import(M);function I(){var t,n;p.resume();const e=Date.now();for(const[l,o]of Object.entries(d)){const i=o.canvas,s=o.analyser;if(i&&s){const r=i.getContext("2d"),h=s.frequencyBinCount,f=new Uint8Array(h);s.getByteTimeDomainData(f),o.history.push([e,f]);const c=500;o.history=o.history.filter(([v,y])=>v>e-c);const g=1e3*s.frequencyBinCount/p.sampleRate,m=g/s.frequencyBinCount;r.clearRect(0,0,i.width,i.height),r.fillStyle="rgb(200 200 200)",r.fillRect(0,0,i.width,i.height),r.lineWidth=2,r.strokeStyle="rgb(0 0 0)",r.beginPath();let u=0,w=o.history[0][0]-g;for(let v=0;v<o.history.length;v++){const y=o.history[v][1];for(let b=0;b<y.length;b++){const S=y[b]/128*(i.height/2);if(v===0&&b==0?r.moveTo(i.width*u,S):r.lineTo(i.width*u,S),u+=m/c,w+=m,w>((n=(t=o.history)==null?void 0:t[v+1])==null?void 0:n[0])-g)break}}r.stroke()}}requestAnimationFrame(I)}a.on("nodeCreated",function(e){console.log("Node created "+e);const t=a.getNodeFromId(e);switch(t.class){case"oscillator":d[e]=p.createOscillator(),d[e].start();break;case"output":d[e]=p;break;case"gain":d[e]=p.createGain();break;case"envelope":d[e]=new j;break;case"filter":d[e]=p.createBiquadFilter();break;case"noise":d[e]=new z;break}switch(t.class){case"oscillator":case"gain":case"envelope":case"filter":case"noise":const n=document.getElementById(`node-${e}`).getElementsByClassName("drawflow_content_node")[0].children[0],l=document.createElement("canvas");l.width=180,l.height=180,n.appendChild(l);const o=p.createAnalyser();o.fftSize=2048;const i=o.frequencyBinCount,s=new Uint8Array(i);o.getByteTimeDomainData(s),d[e].connect(o),d[e].canvas=l,d[e].analyser=o,d[e].history=[]}D()});a.on("nodeRemoved",function(e){D(),console.log("Node removed "+e)});a.on("nodeSelected",function(e){console.log("Node selected "+e)});a.on("moduleCreated",function(e){console.log("Module Created "+e)});a.on("moduleChanged",function(e){console.log("Module Changed "+e)});console.log("sample rate",p.sampleRate);class z extends AudioBufferSourceNode{constructor(){super(p);const t=2*p.sampleRate,n=p.createBuffer(1,t,p.sampleRate);this.type="white",this.buffer=n,this.loop=!0,this.regenerateBuffer(),this.start(0)}regenerateBuffer(){const t=this.buffer.getChannelData(0),n=2*p.sampleRate;switch(this.type){case"pink":var l,o,i,s,r,h,f;l=o=i=s=r=h=f=0;for(var c=0;c<n;c++){const u=Math.random()*2-1;l=.99886*l+u*.0555179,o=.99332*o+u*.0750759,i=.969*i+u*.153852,s=.8665*s+u*.3104856,r=.55*r+u*.5329522,h=-.7616*h-u*.016898,t[c]=l+o+i+s+r+h+f+u*.5362,t[c]*=.11,f=u*.115926}break;case"brown":for(var g=0,c=0;c<n;c++){var m=Math.random()*2-1;t[c]=(g+.02*m)/1.02,g=t[c],t[c]*=3.5}break;case"white":default:for(var c=0;c<n;c++)t[c]=Math.random()*2-1;break}}getInput(t){return this}updateData(t){this.type!=t.type&&(this.type=t.type,this.regenerateBuffer())}}class j extends GainNode{constructor(){super(p),this.constantNode=p.createConstantSource(),this.constantNode.connect(this),this.constantNode.start(),this.data={ramptype:"exp",peak:1,attack:1,decay:1}}applyEnvelope(){var t,n=p.currentTime;switch(console.log(this.data),this.gain.cancelScheduledValues(n),this.data.ramptype){case"linear":t=(o,i)=>this.gain.linearRampToValueAtTime(o,i);break;case"instant":t=(o,i)=>this.gain.setValueAtTime(o,i);break;default:case"exp":t=(o,i)=>this.gain.exponentialRampToValueAtTime(o,i);break}const l=(o,i)=>{i>0&&(n+=i,t(o,n))};this.data.attack>0&&this.gain.setValueAtTime(.001,n),l(this.data.peak,this.data.attack),l(.001,this.data.decay)}getInput(t){return this}updateData(t){this.data.ramptype=t.ramptype,this.data.peak=Number(t.peak),this.data.attack=Number(t.attack),this.data.decay=Number(t.decay),this.applyEnvelope()}}BiquadFilterNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.frequency}};AudioContext.prototype.getInput=function(e){switch(e){default:return this.destination}};GainNode.prototype.getInput=function(e){switch(e){case"input_1":return this;case"input_2":default:return this.gain}};OscillatorNode.prototype.getInput=function(e){switch(e){default:return this.frequency}};AudioContext.prototype.updateData=()=>{};OscillatorNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=e.frequency};GainNode.prototype.updateData=function(e){this.gain.value=e.gain};BiquadFilterNode.prototype.updateData=function(e){this.type=e.type,this.frequency.value=e.frequency};a.on("connectionCreated",function(e){console.log("Connection created"),console.log(e);const t=d[e.output_id],n=d[e.input_id];t&&n&&t.connect(n.getInput(e.input_class)),D()});a.on("connectionRemoved",function(e){var t;console.log("Connection removed"),console.log(e),(t=d[e.output_id])==null||t.disconnect(d[e.input_id].getInput(e.input_class)),D()});a.on("mouseMove",function(e){});a.on("nodeDataChanged",function(e){const{data:t}=a.getNodeFromId(e);console.log(t,d[e]),d[e].updateData(t),D()});a.on("nodeMoved",function(e){console.log("Node moved "+e)});a.on("zoom",function(e){console.log("Zoom level "+e)});a.on("translate",function(e){});a.on("addReroute",function(e){console.log("Reroute added "+e)});a.on("removeReroute",function(e){console.log("Reroute removed "+e)});var C=document.getElementsByClassName("drag-drawflow");for(var N=0;N<C.length;N++)C[N].addEventListener("touchend",T,!1),C[N].addEventListener("touchmove",G,!1),C[N].addEventListener("touchstart",R,!1);var B="",x=null;function G(e){x=e}function V(e){e.preventDefault()}function R(e){e.type==="touchstart"?B=e.target.closest(".drag-drawflow").getAttribute("data-node"):e.dataTransfer.setData("node",e.target.getAttribute("data-node"))}function T(e){if(e.type==="touchend"){var t=document.elementFromPoint(x.touches[0].clientX,x.touches[0].clientY).closest("#drawflow");t!=null&&O(B,x.touches[0].clientX,x.touches[0].clientY),B=""}else{e.preventDefault();var n=e.dataTransfer.getData("node");O(n,e.clientX,e.clientY)}}function O(e,t,n){if(a.editor_mode==="fixed")return!1;switch(t=t*(a.precanvas.clientWidth/(a.precanvas.clientWidth*a.zoom))-a.precanvas.getBoundingClientRect().x*(a.precanvas.clientWidth/(a.precanvas.clientWidth*a.zoom)),n=n*(a.precanvas.clientHeight/(a.precanvas.clientHeight*a.zoom))-a.precanvas.getBoundingClientRect().y*(a.precanvas.clientHeight/(a.precanvas.clientHeight*a.zoom)),e){case"output":var l=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;a.addNode("output",1,0,t,n,"output",{},l);break;case"gain":var o=`
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;a.addNode("gain",2,1,t,n,"gain",{gain:1},o);break;case"env":var i=`
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
      `;a.addNode("envelope",0,1,t,n,"envelope",{ramptype:"exp",attack:1,peak:1,decay:1},i);break;case"noise":var s=`
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
        `;a.addNode("noise",0,1,t,n,"noise",{type:"white"},s);break;case"filter":var r=`
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
      `;a.addNode("filter",2,1,t,n,"filter",{type:"lowpass",frequency:200},r);break;case"osc":var h=`
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
    `;a.addNode("oscillator",1,1,t,n,"oscillator",{type:"sine",frequency:260},h);break;case"facebook":var f=`
  <div>
    <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
  </div>
  `;a.addNode("facebook",0,1,t,n,"facebook",{},f);break;case"slack":var c=`
    <div>
      <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
    </div>
    `;a.addNode("slack",1,0,t,n,"slack",{},c);break;case"github":var g=`
    <div>
      <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
      <div class="box">
        <p>Enter repository url</p>
      <input type="text" df-name>
      </div>
    </div>
    `;a.addNode("github",0,1,t,n,"github",{name:""},g);break;case"telegram":var m=`
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
    `;a.addNode("telegram",1,0,t,n,"telegram",{channel:"channel_3"},m);break;case"aws":var u=`
    <div>
      <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
      <div class="box">
        <p>Save in aws</p>
        <input type="text" df-db-dbname placeholder="DB name"><br><br>
        <input type="text" df-db-key placeholder="DB key">
        <p>Output Log</p>
      </div>
    </div>
    `;a.addNode("aws",1,1,t,n,"aws",{db:{dbname:"",key:""}},u);break;case"log":var w=`
      <div>
        <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
      </div>
      `;a.addNode("log",1,0,t,n,"log",{},w);break;case"google":var v=`
      <div>
        <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
      </div>
      `;a.addNode("google",1,0,t,n,"google",{},v);break;case"email":var y=`
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
      </div>
      `;a.addNode("email",1,0,t,n,"email",{},y);break;case"template":var b=`
      <div>
        <div class="title-box"><i class="fas fa-code"></i> Template</div>
        <div class="box">
          Ger Vars
          <textarea df-template></textarea>
          Output template with vars
        </div>
      </div>
      `;a.addNode("template",1,1,t,n,"template",{template:"Write your template"},b);break;case"multiple":var k=`
      <div>
        <div class="box">
          Multiple!
        </div>
      </div>
      `;a.addNode("multiple",3,4,t,n,"multiple",{},k);break;case"personalized":var S=`
      <div>
        Personalized
      </div>
      `;a.addNode("personalized",1,1,t,n,"personalized",{},S);break;case"dbclick":var E=`
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
      `;a.addNode("dbclick",1,1,t,n,"dbclick",{name:""},E);break}}function W(){for(const[e,t]of Object.entries(d))console.log(t),t.applyEnvelope&&t.applyEnvelope()}window.drop=T;window.drag=R;window.allowDrop=V;window.editor=a;window.trigger=W;F();requestAnimationFrame(I);
//# sourceMappingURL=index-658daff3.js.map
