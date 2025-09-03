import express from "express";
import { WebSocketServer } from "ws";
import wrtc from "@koush/wrtc";
import { randomUUID } from "crypto";

const app = express();
app.use(express.static("public")); // serve browser files

const server = app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);

// WebSocket server for signaling
const wss = new WebSocketServer({ server });

// keep alive
const rooms = {};
const players = {};

const addPlayer = ({ dc, playerId = randomUUID() }) => {
  players[playerId] = { dc };
  return playerId;
};

const createRoom = ({ name, capacity, hostId }) => {
  const roomId = randomUUID();
  rooms[roomId] = {
    name,
    capacity,
    players: [{ playerId: hostId, latest: 0 }],
    messages: [],
  };
  return roomId;
};

const joinRoom = ({ playerId, roomId }) => {
  rooms[roomId].players.push({ playerId, latest: 0 });
};

wss.on("connection", (ws) => {
  console.log("Browser connected via WS");

  const pc = new wrtc.RTCPeerConnection();

  // Listen for incoming DataChannel from browser
  pc.ondatachannel = (event) => {
    const dc = event.channel;
    dc.onopen = () => console.log("DataChannel open on Node");
    dc.onmessage = (msg) => {
      for (const [key, value] of Object.entries(players)) {
        value.dc.send(JSON.stringify(msg.data));
      }
    };
    const playerId = addPlayer({ dc });

    // send a reply
    dc.send(JSON.stringify({ type: "id", data: { playerId } }));
  };

  // ICE candidates from Node → browser
  pc.onicecandidate = ({ candidate }) => {
    if (candidate) ws.send(JSON.stringify({ type: "ice", candidate }));
  };
  pc.onconnectionstatechange = () => {
    console.log("Connection state:", pc.connectionState);

    switch (pc.connectionState) {
      case "connected":
        console.log("Peer connected ✅");

        break;
      case "disconnected":
        console.log("Peer disconnected ⚠️");
        break;
      case "failed":
        console.log("Connection failed ❌");
        break;
      case "closed":
        console.log("Connection closed ⏹");
        break;
    }
  };

  // Handle signaling messages from browser
  ws.on("message", async (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.type === "offer") {
      await pc.setRemoteDescription(data);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      ws.send(JSON.stringify(pc.localDescription));
    } else if (data.type === "ice") {
      try {
        await pc.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    }
  });
});
