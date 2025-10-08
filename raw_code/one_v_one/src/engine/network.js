import { io } from "socket.io-client";
import { getFrame } from "./time";

// client / server
//
// message schema
//
// { frame: number, playerId: number, input: any }

const ROOM_ID = "room1";
export class Network {
  constructor(username, url) {
    const socket = io(url, {
      transports: ["websocket"], // force websocket
      autoConnect: false, // log on after picking username
    });
    socket.on("connect", () => {
      console.log("Connected to signaling server");

      // Join room
      socket.emit("join", { roomId: ROOM_ID });
    });
    socket.auth = { username };
    socket.connect();
    this.socket = socket;
    this.messages = [];

    this.server = { name: ROOM_ID, clients: [] };

    this.socket.on("message", (data) => {
      this.messages.push(data);
    });

    socket.on("server_update", (data) => {
      this.server = data;
      console.log(data);
    });
  }

  emit(msg) {
    this.socket.emit("message", {
      frame: getFrame(),
      msg,
    });
  }
}
