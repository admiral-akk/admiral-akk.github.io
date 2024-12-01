import {
  DataManager,
  ApiCompressor,
  DefaultCompressor,
} from "./util/compression.js";

var id = document.getElementById("drawflow");
const editor = new Drawflow(id);
var audioContext = new (window.AudioContext || window.webkitAudioContext)();
editor.reroute = true;
editor.start();

var toAudioNodeType = {};
class DrawflowPreprocessor {
  minifyConnections(outputs) {
    var str = "";
    for (const [outputName, { connections }] of Object.entries(outputs)) {
      const shortName = outputName.replace("output_", "");
      for (let i = 0; i < connections.length; i++) {
        const { node, output } = connections[i];
        const shortInputName = output.replace("input_", "");
        if (str !== "") {
          str += ",";
        }
        str += `${shortName},${node},${shortInputName}`;
      }
    }
    return str;
  }

  unminifyConnections(outputStr) {
    if (outputStr === "") {
      return {};
    }

    const outputs = {};

    const splitStr = outputStr.split(",");

    for (let i = 0; i < splitStr.length / 3; i++) {
      const outputName = `output_${splitStr[3 * i]}`;
      const node = `${splitStr[3 * i + 1]}`;
      const output = `input_${splitStr[3 * i + 2]}`;
      if (!(outputName in outputs)) {
        outputs[outputName] = { connections: [] };
      }
      outputs[outputName].connections.push({ node, output });
    }

    return outputs;
  }

  async jsonToString(jsonData) {
    const arrayForm = [];
    for (const [key, value] of Object.entries(jsonData)) {
      const { data, id, name, outputs, pos_x, pos_y } = value;

      const outputList = [];
      for (const [outputName, c] of Object.entries(outputs)) {
        const connections = c.connections;
        if (connections.length > 0) {
          outputList.push([outputName.replace("output_", ""), connections]);
        }
      }
      const x = Math.round(pos_x);
      const y = Math.round(pos_y);
      const compressedObj = {
        id,
        name,
        x,
        y,
      };

      const outputListNullable = this.minifyConnections(outputs);
      const dataNullable = toAudioNodeType[name].dataToString(data);

      const compressedStr = `${id}|${name}|${x}|${y}|${outputListNullable}|${dataNullable}`;

      if (outputList.length > 0) {
        compressedObj.o = outputList;
      }
      if (Object.keys(data).length > 0) {
        compressedObj.data = data;
      }

      arrayForm.push(compressedStr);
    }

    return JSON.stringify(arrayForm);
  }
  async jsonFromString(jsonStr) {
    const arrayForm = JSON.parse(jsonStr);

    const drawflowData = {};
    for (let i = 0; i < arrayForm.length; i++) {
      const compressedStr = arrayForm[i];

      const [id, name, x, y, outputsNullable, dataNullable] =
        compressedStr.split("|");

      const data = toAudioNodeType[name].dataFromString(dataNullable);
      const outputs = this.unminifyConnections(outputsNullable);
      console.log(outputs);
      drawflowData[id] = {
        data,
        id: id,
        name: name,
        outputs,
        pos_x: Number(x),
        pos_y: Number(y),
      };
    }

    return drawflowData;
  }
}

const dataManager = new DataManager(
  new DefaultCompressor(),
  new DrawflowPreprocessor()
);

// Events!
const audioNodes = new Map();

// compression scheme:

function minifyData(editorData) {
  if (typeof editorData !== "object" || editorData === null) {
    return null;
  }
  const newData = {};
  for (const [key, value] of Object.entries(editorData.drawflow.Home.data)) {
    const { data, id, name, outputs, pos_x, pos_y } = value;
    newData[key] = {
      data,
      id,
      name,
      outputs,
      pos_x,
      pos_y,
    };
  }

  return newData;
}

function unminifyData(urlData) {
  if (typeof urlData !== "object" || urlData === null) {
    return null;
  }
  const newData = { drawflow: { Home: { data: urlData } } };
  return newData;
}

async function saveTransformedData() {
  return dataManager.saveData(minifyData(editor.export()));
}

async function readData() {
  const dataP = unminifyData(await dataManager.fetchData());
  if (dataP && dataP != "undefined" && dataP !== null) {
    const { data } = dataP.drawflow.Home;

    const connectionsMap = {};
    const idMap = {};
    const newIdMap = {};

    // first identify the network graph

    for (const [_, value] of Object.entries(data)) {
      const { id, outputs } = value;
      connectionsMap[id] = {};
      for (const [outputName, value] of Object.entries(outputs)) {
        connectionsMap[id][outputName] = [];
        for (let i = 0; i < value.connections.length; i++) {
          const { node, output } = value.connections[i];
          connectionsMap[id][outputName].push({ id: node, inputName: output });
        }
      }
    }

    // identify sink nodes, then measure distance to sink, and that's the x value
    // then use different y per node

    const sinkIds = [];
    const distanceToSink = {};
    // identify sink nodes
    for (const [id, connections] of Object.entries(connectionsMap)) {
      if (Object.keys(connections).length === 0) {
        sinkIds.push(id);
        distanceToSink[id] = 0;
      }
    }

    // measure distance to sink
    var newDist = {};
    while (true) {
      for (const [id, connections] of Object.entries(connectionsMap)) {
        if (id.toString() in distanceToSink) {
          continue;
        }

        for (const [outputName, connections2] of Object.entries(connections)) {
          for (let i = 0; i < connections2.length; i++) {
            const connection = connections2[i];
            const d = distanceToSink[Number(connection.id)];
            if (d !== undefined) {
              if (newDist[id] !== undefined) {
                newDist[id] = Math.min(newDist[id], d);
              } else {
                newDist[id] = d;
              }
              break;
            }
          }
        }
      }

      if (Object.keys(newDist).length === 0) {
        break;
      } else {
        for (const [id, d] of Object.entries(newDist)) {
          distanceToSink[id] = d + 1;
        }
        newDist = {};
      }
    }

    for (const [id, value] of Object.entries(data)) {
      if (distanceToSink[id] === undefined) {
      }
    }

    // calculate positions of nodes

    const countOfDist = {};
    const position = {};
    for (const [id, value] of Object.entries(data)) {
      const dist = distanceToSink[id];
      if (countOfDist[dist] === undefined) {
        countOfDist[dist] = 1;
      } else {
        countOfDist[dist] = countOfDist[dist] + 1;
      }
      const count = countOfDist[dist];

      position[id] = { posX: -dist * 300 + 800, posY: 500 * count };
    }

    // then figure out which positions to put nodes in and create the nodes

    for (const [_, value] of Object.entries(data)) {
      const { id, name, data, pos_x, pos_y } = value;

      const newId = addNodeToDrawFlow(name, pos_x, pos_y, data);

      audioNodes[newId].updateData(data);

      idMap[id] = newId;
      newIdMap[newId] = id;
    }
    // then connect the nodes
    for (const [id, connections] of Object.entries(connectionsMap)) {
      for (const [outputName, connectionList] of Object.entries(connections)) {
        for (let i = 0; i < connectionList.length; i++) {
          const inputId = connectionList[i].id;
          const inputName = connectionList[i].inputName;
          editor.addConnection(
            idMap[id],
            idMap[inputId],
            outputName,
            inputName
          );
        }
      }
    }
  }
  await saveTransformedData();
}

function draw() {
  audioContext.resume();
  const timestamp = Date.now();
  for (const [_, audioNode] of Object.entries(audioNodes)) {
    const canvas = audioNode.canvas;
    const analyser = audioNode.analyser;
    if (canvas && analyser) {
      const canvasCtx = canvas.getContext("2d");
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      audioNode.history.push([timestamp, dataArray]);

      const windowSize = 500;

      audioNode.history = audioNode.history.filter(
        ([time, _]) => time > timestamp - windowSize
      );

      const bufferTimeLength =
        (1000 * analyser.frequencyBinCount) / audioContext.sampleRate;
      const sampleTick = bufferTimeLength / analyser.frequencyBinCount;

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      canvasCtx.fillStyle = "rgb(200 200 200)";
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0 0 0)";
      canvasCtx.beginPath();
      let x = 0;
      let time = audioNode.history[0][0] - bufferTimeLength;
      for (let i = 0; i < audioNode.history.length; i++) {
        const data = audioNode.history[i][1];

        for (let j = 0; j < data.length; j++) {
          const v = data[j] / 128.0;
          const y = v * (canvas.height / 2);

          if (i === 0 && j == 0) {
            canvasCtx.moveTo(canvas.width * x, y);
          } else {
            canvasCtx.lineTo(canvas.width * x, y);
          }

          x += sampleTick / windowSize;
          time += sampleTick;
          if (time > audioNode.history?.[i + 1]?.[0] - bufferTimeLength) {
            break;
          }
        }
      }
      canvasCtx.stroke();
    }
  }

  requestAnimationFrame(draw);
}

function nodeCreated(id) {
  const node = editor.getNodeFromId(id);

  switch (node.class) {
    case "o":
      audioNodes[id] = audioContext.createOscillator();
      audioNodes[id].start();
      break;
    case "s":
      audioNodes[id] = audioContext;
      break;
    case "g":
      audioNodes[id] = audioContext.createGain();
      break;
    case "e":
      audioNodes[id] = new Envelope();
      break;
    case "f":
      audioNodes[id] = audioContext.createBiquadFilter();
      break;
    case "n":
      audioNodes[id] = new NoiseNode();
      break;
    default:
      break;
  }

  switch (node.class) {
    case "o":
    case "g":
    case "e":
    case "f":
    case "n":
      const htmlBody = document
        .getElementById(`node-${id}`)
        .getElementsByClassName("drawflow_content_node")[0].children[0];
      const canvas = document.createElement("canvas");
      canvas.width = 180;
      canvas.height = 180;
      htmlBody.appendChild(canvas);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      audioNodes[id].connect(analyser);

      audioNodes[id].canvas = canvas;
      audioNodes[id].analyser = analyser;
      audioNodes[id].history = [];
    default:
      break;
  }
}

editor.on("nodeCreated", () => {
  saveTransformedData();
});

editor.on("nodeRemoved", function (id) {
  saveTransformedData();
  // remove connections
});

editor.on("nodeSelected", function (id) {});

editor.on("moduleCreated", function (name) {});

editor.on("moduleChanged", function (name) {});

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

  static dataToString(data) {
    switch (data.type) {
      default:
      case "white":
        return "0";
      case "pink":
        return "1";
      case "brown":
        return "2";
    }
  }

  static dataFromString(str) {
    const num = Number(str);
    switch (num) {
      default:
      case "0":
        return "white";
      case "1":
        return "pink";
      case "2":
        return "brown";
    }
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
  static types = ["linear", "instant", "exp"];
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

  static dataToString(data) {
    const { ramptype, peak, attack, decay } = data;
    const typeIndex = Envelope.types.indexOf(ramptype);
    const dataStr = `${typeIndex}${peak},${attack},${decay}`;

    return dataStr;
  }

  static dataFromString(str) {
    const ramptype = Envelope.types[Number(str[0])];
    const [peak, attack, decay] = str.substring(1).split(",");
    return {
      ramptype,
      attack: Number(attack),
      decay: Number(decay),
      peak: Number(peak),
    };
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

  applyEnvelope() {
    var setValue;
    var currentTime = audioContext.currentTime;

    this.gain.cancelScheduledValues(currentTime);
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
}

BiquadFilterNode.types = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "peaking",
  "notch",
  "allpass",
];
BiquadFilterNode.dataToString = function (data) {
  const { type, frequency } = data;
  const typeIndex = BiquadFilterNode.types.indexOf(type);
  return `${typeIndex}${frequency}`;
};
BiquadFilterNode.dataFromString = function (str) {
  return {
    type: BiquadFilterNode.types[Number(str[0])],
    frequency: Number(str.substring(1)),
  };
};

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
AudioContext.dataToString = function (data) {
  return ``;
};
AudioContext.dataFromString = function (str) {
  return {};
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
GainNode.dataToString = function (data) {
  return `${data.gain}`;
};
GainNode.dataFromString = function (str) {
  return {
    gain: Number(str),
  };
};

OscillatorNode.types = ["sine", "square", "sawtooth", "triangle"];
OscillatorNode.prototype.getInput = function (key) {
  switch (key) {
    default:
      return this.frequency;
  }
};
OscillatorNode.dataToString = function (data) {
  const { type, frequency } = data;
  const typeIndex = OscillatorNode.types.indexOf(type);
  return `${typeIndex}${frequency}`;
};
OscillatorNode.dataFromString = function (str) {
  return {
    type: OscillatorNode.types[Number(str[0])],
    frequency: Number(str.substring(1)),
  };
};

AudioContext.prototype.updateData = () => {};
OscillatorNode.prototype.updateData = function (data) {
  this.type = data.type;
  this.frequency.value = Number(data.frequency);
};
GainNode.prototype.updateData = function (data) {
  this.gain.value = Number(data.gain);
};
BiquadFilterNode.prototype.updateData = function (data) {
  this.type = data.type;
  this.frequency.value = Number(data.frequency);
};

editor.on("connectionCreated", function (connection) {
  const sendingNode = audioNodes[connection.output_id];
  const recievingNode = audioNodes[connection.input_id];
  if (sendingNode && recievingNode) {
    sendingNode.connect(recievingNode.getInput(connection.input_class));
  }
  saveTransformedData();
});

editor.on("connectionRemoved", function (connection) {
  audioNodes[connection.output_id]?.disconnect(
    audioNodes[connection.input_id].getInput(connection.input_class)
  );
  saveTransformedData();
});

editor.on("mouseMove", function (position) {
  //
});

editor.on("nodeDataChanged", function (id) {
  const { data } = editor.getNodeFromId(id);

  audioNodes[id].updateData(data);
  saveTransformedData();
});

editor.on("nodeMoved", function (id) {});

editor.on("zoom", function (zoom) {});

editor.on("translate", function (position) {
  //
});

editor.on("addReroute", function (id) {});

editor.on("removeReroute", function (id) {});

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

function addNodeToDrawFlow(name, pos_x, pos_y, data = null) {
  if (editor.editor_mode === "fixed") {
    return null;
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
  var nodeId = null;
  switch (name) {
    case "s":
      var output = `
      <div>
        <div class="title-box"><i class="fas fa-at"></i> Audio Out </div>
      </div>
      `;
      nodeId = editor.addNode("s", 1, 0, pos_x, pos_y, "s", data ?? {}, output);
      break;
    case "g":
      var gain = `
        <div>
          <div class="title-box"><i class="fas fa-at"></i> Gain</div>
      <div class="box">
        <p>Gain</p>
        <input type="number" df-gain>
      </div>
        </div>
        `;
      nodeId = editor.addNode(
        "g",
        2,
        1,
        pos_x,
        pos_y,
        "g",
        data ?? { gain: 1 },
        gain
      );
      break;

    case "e":
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
      nodeId = editor.addNode(
        "e",
        0,
        1,
        pos_x,
        pos_y,
        "e",
        data ?? { ramptype: "exp", attack: 1, peak: 1, decay: 1 },
        env
      );
      break;

    case "n":
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
      nodeId = editor.addNode(
        "n",
        0,
        1,
        pos_x,
        pos_y,
        "n",
        data ?? { type: "white" },
        noise
      );
      break;

    case "f":
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
      nodeId = editor.addNode(
        "f",
        2,
        1,
        pos_x,
        pos_y,
        "f",
        data ?? { type: "lowpass", frequency: 200 },
        filter
      );
      break;

    case "o":
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
      nodeId = editor.addNode(
        "o",
        1,
        1,
        pos_x,
        pos_y,
        "o",
        data ?? { type: "sine", frequency: 260 },
        osc
      );
      break;

    default:
      return null;
  }
  nodeCreated(nodeId);
  return nodeId;
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
  //
  if (option == "lock") {
    lock.style.display = "none";
    unlock.style.display = "block";
  } else {
    lock.style.display = "block";
    unlock.style.display = "none";
  }
}

function trigger() {
  for (const [_, audioNode] of Object.entries(audioNodes)) {
    if (audioNode.applyEnvelope) {
      audioNode.applyEnvelope();
    }
  }
}

window.drop = drop;
window.drag = drag;
window.allowDrop = allowDrop;
window.trigger = trigger;
window.editor = editor;

toAudioNodeType = {
  s: AudioContext,
  g: GainNode,
  e: Envelope,
  n: NoiseNode,
  f: BiquadFilterNode,
  o: OscillatorNode,
};

readData();
requestAnimationFrame(draw);
