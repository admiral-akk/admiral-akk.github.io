var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
editor.reroute = true;
editor.start();

// Events!
const audioNodes = new Map();

editor.on("nodeCreated", function (id) {
  console.log("Node created " + id);
  const node = editor.getNodeFromId(id);
  console.log(node.class);
  switch (node.class) {
    case "oscillator":
      audioNodes[id] = audioContext.createOscillator();
      audioNodes[id].start();
      break;
    case "output":
      audioNodes[id] = audioContext;
      break;
    case "gain":
      audioNodes[id] = audioContext.createGain();
      break;
    case "envelope":
      audioNodes[id] = new Envelope();
      break;
    case "filter":
      audioNodes[id] = audioContext.createBiquadFilter();
      break;
    case "noise":
      audioNodes[id] = new NoiseNode();
      break;
    default:
      break;
  }
});

editor.on("nodeRemoved", function (id) {
  console.log("Node removed " + id);
  // remove connections
});

editor.on("nodeSelected", function (id) {
  console.log("Node selected " + id);
});

editor.on("moduleCreated", function (name) {
  console.log("Module Created " + name);
});

editor.on("moduleChanged", function (name) {
  console.log("Module Changed " + name);
});

class NoiseNode extends AudioBufferSourceNode {
  constructor() {
    super(audioContext);
    const bufferSize = 2 * audioContext.sampleRate;
    const noiseBuffer = audioContext.createBuffer(
      1,
      bufferSize,
      audioContext.sampleRate
    );

    this.type = "white";
    this.buffer = noiseBuffer;
    this.loop = true;

    this.regenerateBuffer();
    this.start(0);
  }

  regenerateBuffer() {
    // https://noisehack.com/generate-noise-web-audio-api/
    const output = this.buffer.getChannelData(0);
    const bufferSize = 2 * audioContext.sampleRate;
    switch (this.type) {
      case "pink":
        var b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        for (var i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // (roughly) compensate for gain
          b6 = white * 0.115926;
        }
        break;
      case "brown":
        var lastOut = 0;
        for (var i = 0; i < bufferSize; i++) {
          var white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // (roughly) compensate for gain
        }
        break;
      case "white":
      default:
        for (var i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
        break;
    }
  }

  getInput(key) {
    return this;
  }

  updateData(data) {
    if (this.type != data.type) {
      this.type = data.type;
      this.regenerateBuffer();
    }
  }
}

class Envelope extends GainNode {
  constructor() {
    super(audioContext);
    this.constantNode = audioContext.createConstantSource();
    this.constantNode.connect(this);
    this.constantNode.start();
    this.data = {
      ramptype: "exp",
      peak: 1,
      attack: 1,
      decay: 1,
    };
  }

  applyEnvelope() {
    var setValue;
    var currentTime = audioContext.currentTime;
    console.log(this.data);
    this.gain.cancelScheduledValues(currentTime + 1);
    switch (this.data.ramptype) {
      case "linear":
        setValue = (val, t) => this.gain.linearRampToValueAtTime(val, t);
        break;
      case "instant":
        setValue = (val, t) => this.gain.setValueAtTime(val, t);
        break;
      default:
      case "exp":
        setValue = (val, t) => this.gain.exponentialRampToValueAtTime(val, t);
        break;
    }
    const addStep = (val, deltaTime) => {
      if (deltaTime > 0) {
        currentTime += deltaTime;
        setValue(val, currentTime);
      }
    };
    if (this.data.attack > 0) {
      this.gain.setValueAtTime(0.001, currentTime);
    }

    addStep(this.data.peak, this.data.attack);
    addStep(0.001, this.data.decay);
  }

  getInput(key) {
    return this;
  }

  updateData(data) {
    this.data.ramptype = data.ramptype;
    this.data.peak = Number(data.peak);
    this.data.attack = Number(data.attack);
    this.data.decay = Number(data.decay);
    this.applyEnvelope();
  }
}

BiquadFilterNode.prototype.getInput = function (key) {
  switch (key) {
    case "input_1":
      return this;
    case "input_2":
    default:
      return this.frequency;
  }
};

AudioContext.prototype.getInput = function (key) {
  switch (key) {
    default:
      return this.destination;
  }
};

GainNode.prototype.getInput = function (key) {
  switch (key) {
    case "input_1":
      return this;
    case "input_2":
    default:
      return this.gain;
  }
};

OscillatorNode.prototype.getInput = function (key) {
  switch (key) {
    default:
      return this.frequency;
  }
};

AudioContext.prototype.updateData = () => {};
OscillatorNode.prototype.updateData = function (data) {
  this.type = data.type;
  this.frequency.value = data.frequency;
};
GainNode.prototype.updateData = function (data) {
  this.gain.value = data.gain;
};
BiquadFilterNode.prototype.updateData = function (data) {
  this.type = data.type;
  this.frequency.value = data.frequency;
};

editor.on("connectionCreated", function (connection) {
  console.log("Connection created");
  console.log(connection);

  const sendingNode = audioNodes[connection.output_id];
  const recievingNode = audioNodes[connection.input_id];
  if (sendingNode && recievingNode) {
    sendingNode.connect(recievingNode.getInput(connection.input_class));
  }
});

editor.on("connectionRemoved", function (connection) {
  console.log("Connection removed");
  console.log(connection);
  audioNodes[connection.output_id]?.disconnect();
});

editor.on("mouseMove", function (position) {
  //console.log("Position mouse x:" + position.x + " y:" + position.y);
});

editor.on("nodeDataChanged", function (id) {
  const { data } = editor.getNodeFromId(id);
  console.log(data, audioNodes[id]);
  audioNodes[id].updateData(data);
});

editor.on("nodeMoved", function (id) {
  console.log("Node moved " + id);
});

editor.on("zoom", function (zoom) {
  console.log("Zoom level " + zoom);
});

editor.on("translate", function (position) {
  //console.log("Translate x:" + position.x + " y:" + position.y);
});

editor.on("addReroute", function (id) {
  console.log("Reroute added " + id);
});

editor.on("removeReroute", function (id) {
  console.log("Reroute removed " + id);
});

/* DRAG EVENT */

/* Mouse and Touch Actions */

var elements = document.getElementsByClassName("drag-drawflow");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("touchend", drop, false);
  elements[i].addEventListener("touchmove", positionMobile, false);
  elements[i].addEventListener("touchstart", drag, false);
}

var mobile_item_selec = "";
var mobile_last_move = null;
function positionMobile(ev) {
  mobile_last_move = ev;
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  if (ev.type === "touchstart") {
    mobile_item_selec = ev.target
      .closest(".drag-drawflow")
      .getAttribute("data-node");
  } else {
    ev.dataTransfer.setData("node", ev.target.getAttribute("data-node"));
  }
}

function drop(ev) {
  if (ev.type === "touchend") {
    var parentdrawflow = document
      .elementFromPoint(
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      )
      .closest("#drawflow");
    if (parentdrawflow != null) {
      addNodeToDrawFlow(
        mobile_item_selec,
        mobile_last_move.touches[0].clientX,
        mobile_last_move.touches[0].clientY
      );
    }
    mobile_item_selec = "";
  } else {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("node");
    addNodeToDrawFlow(data, ev.clientX, ev.clientY);
  }
}

function addNodeToDrawFlow(name, pos_x, pos_y) {
  if (editor.editor_mode === "fixed") {
    return false;
  }
  pos_x =
    pos_x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().x *
      (editor.precanvas.clientWidth /
        (editor.precanvas.clientWidth * editor.zoom));
  pos_y =
    pos_y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom)) -
    editor.precanvas.getBoundingClientRect().y *
      (editor.precanvas.clientHeight /
        (editor.precanvas.clientHeight * editor.zoom));
  switch (name) {
    case "output":
      var output = `
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;
      editor.addNode("output", 1, 0, pos_x, pos_y, "output", {}, output);
      break;
    case "gain":
      var gain = `
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;
      editor.addNode("gain", 2, 1, pos_x, pos_y, "gain", { gain: 1 }, gain);
      break;

    case "env":
      var env = `
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
      `;
      editor.addNode(
        "envelope",
        0,
        1,
        pos_x,
        pos_y,
        "envelope",
        { ramptype: "exp", attack: 1, peak: 1, decay: 1 },
        env
      );
      break;

    case "noise":
      var noise = `
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
        `;
      editor.addNode(
        "noise",
        0,
        1,
        pos_x,
        pos_y,
        "noise",
        { type: "white" },
        noise
      );
      break;

    case "filter":
      var filter = `
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
      `;
      editor.addNode(
        "filter",
        2,
        1,
        pos_x,
        pos_y,
        "filter",
        { type: "lowpass", frequency: 200 },
        filter
      );
      break;

    case "osc":
      var osc = `
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
    `;
      editor.addNode(
        "oscillator",
        1,
        1,
        pos_x,
        pos_y,
        "oscillator",
        { type: "sine", frequency: 260 },
        osc
      );
      break;
    case "facebook":
      var facebook = `
  <div>
    <div class="title-box"><i class="fab fa-facebook"></i> Facebook Message</div>
  </div>
  `;
      editor.addNode("facebook", 0, 1, pos_x, pos_y, "facebook", {}, facebook);
      break;
    case "slack":
      var slackchat = `
    <div>
      <div class="title-box"><i class="fab fa-slack"></i> Slack chat message</div>
    </div>
    `;
      editor.addNode("slack", 1, 0, pos_x, pos_y, "slack", {}, slackchat);
      break;
    case "github":
      var githubtemplate = `
    <div>
      <div class="title-box"><i class="fab fa-github "></i> Github Stars</div>
      <div class="box">
        <p>Enter repository url</p>
      <input type="text" df-name>
      </div>
    </div>
    `;
      editor.addNode(
        "github",
        0,
        1,
        pos_x,
        pos_y,
        "github",
        { name: "" },
        githubtemplate
      );
      break;
    case "telegram":
      var telegrambot = `
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
    `;
      editor.addNode(
        "telegram",
        1,
        0,
        pos_x,
        pos_y,
        "telegram",
        { channel: "channel_3" },
        telegrambot
      );
      break;
    case "aws":
      var aws = `
    <div>
      <div class="title-box"><i class="fab fa-aws"></i> Aws Save </div>
      <div class="box">
        <p>Save in aws</p>
        <input type="text" df-db-dbname placeholder="DB name"><br><br>
        <input type="text" df-db-key placeholder="DB key">
        <p>Output Log</p>
      </div>
    </div>
    `;
      editor.addNode(
        "aws",
        1,
        1,
        pos_x,
        pos_y,
        "aws",
        { db: { dbname: "", key: "" } },
        aws
      );
      break;
    case "log":
      var log = `
      <div>
        <div class="title-box"><i class="fas fa-file-signature"></i> Save log file </div>
      </div>
      `;
      editor.addNode("log", 1, 0, pos_x, pos_y, "log", {}, log);
      break;
    case "google":
      var google = `
      <div>
        <div class="title-box"><i class="fab fa-google-drive"></i> Google Drive save </div>
      </div>
      `;
      editor.addNode("google", 1, 0, pos_x, pos_y, "google", {}, google);
      break;
    case "email":
      var email = `
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Send Email </div>
      </div>
      `;
      editor.addNode("email", 1, 0, pos_x, pos_y, "email", {}, email);
      break;

    case "template":
      var template = `
      <div>
        <div class="title-box"><i class="fas fa-code"></i> Template</div>
        <div class="box">
          Ger Vars
          <textarea df-template></textarea>
          Output template with vars
        </div>
      </div>
      `;
      editor.addNode(
        "template",
        1,
        1,
        pos_x,
        pos_y,
        "template",
        { template: "Write your template" },
        template
      );
      break;
    case "multiple":
      var multiple = `
      <div>
        <div class="box">
          Multiple!
        </div>
      </div>
      `;
      editor.addNode("multiple", 3, 4, pos_x, pos_y, "multiple", {}, multiple);
      break;
    case "personalized":
      var personalized = `
      <div>
        Personalized
      </div>
      `;
      editor.addNode(
        "personalized",
        1,
        1,
        pos_x,
        pos_y,
        "personalized",
        {},
        personalized
      );
      break;
    case "dbclick":
      var dbclick = `
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
      `;
      editor.addNode(
        "dbclick",
        1,
        1,
        pos_x,
        pos_y,
        "dbclick",
        { name: "" },
        dbclick
      );
      break;

    default:
  }
}

var transform = "";
function showpopup(e) {
  e.target.closest(".drawflow-node").style.zIndex = "9999";
  e.target.children[0].style.display = "block";
  //document.getElementById("modalfix").style.display = "block";

  //e.target.children[0].style.transform = 'translate('+translate.x+'px, '+translate.y+'px)';
  transform = editor.precanvas.style.transform;
  editor.precanvas.style.transform = "";
  editor.precanvas.style.left = editor.canvas_x + "px";
  editor.precanvas.style.top = editor.canvas_y + "px";
  console.log(transform);

  //e.target.children[0].style.top  =  -editor.canvas_y - editor.container.offsetTop +'px';
  //e.target.children[0].style.left  =  -editor.canvas_x  - editor.container.offsetLeft +'px';
  editor.editor_mode = "fixed";
}

function closemodal(e) {
  e.target.closest(".drawflow-node").style.zIndex = "2";
  e.target.parentElement.parentElement.style.display = "none";
  //document.getElementById("modalfix").style.display = "none";
  editor.precanvas.style.transform = transform;
  editor.precanvas.style.left = "0px";
  editor.precanvas.style.top = "0px";
  editor.editor_mode = "edit";
}

function changeModule(event) {
  var all = document.querySelectorAll(".menu ul li");
  for (var i = 0; i < all.length; i++) {
    all[i].classList.remove("selected");
  }
  event.target.classList.add("selected");
}

function changeMode(option) {
  //console.log(lock.id);
  if (option == "lock") {
    lock.style.display = "none";
    unlock.style.display = "block";
  } else {
    lock.style.display = "block";
    unlock.style.display = "none";
  }
}

window.drop = drop;
window.drag = drag;
window.allowDrop = allowDrop;
window.editor = editor;