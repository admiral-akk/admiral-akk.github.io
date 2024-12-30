// listens for input events and stores them in an easy to use format.

import { vec2 } from "gl-matrix";
import { time } from "./time";
import { window } from "./window";
import { equals } from "../util/equals";

// keeps track of:

//  {}
//
// 1. last known mouse position - useful for delta
// 2. what buttons are currently pressed, and how long they've been pressed for
class InputListener {
  updateValue(key, val) {
    if (!(key in this.state)) {
      this.state[key] = { prev: {}, frame: time.frame, val };
    }

    if (!equals(this.state[key].val, val)) {
      this.state[key].prev.frame = this.state[key].frame;
      this.state[key].prev.val = this.state[key].val;
      this.state[key].frame = time.frame;
      this.state[key].val = val;
    }
  }

  constructor() {
    this.state = {};

    // left click
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "F12") {
        return;
      }
      this.updateValue(ev.key, 1);
    });

    document.addEventListener("keyup", (ev) => {
      if (ev.key === "F12") {
        return;
      }
      this.updateValue(ev.key, 0);
    });

    const updateMouseEv = (ev) => {
      if (ev.target.id !== "webgl") {
        return;
      }
      const { width, height } = window.sizes;
      if (!("mpos" in this.state)) {
        this.updateValue("mpos", [0.5, 0.5]);
        this.updateValue("mpointer", [0.5, 0.5]);
      }

      const [x, y] = this.state["mpointer"].val;
      this.updateValue("mpointer", [
        x + ev.movementX / width,
        y + ev.movementY / height,
      ]);
      const [newX, newY] = this.state["mpointer"].val;
      console.log([newX, newY]);
      this.updateValue("mpos", [
        Math.clamp(newX, 0, 1),
        Math.clamp(newY, 0, 1),
      ]);

      this.updateValue("lmb", ev.buttons & 1 ? 1 : 0);
      this.updateValue("rmb", ev.buttons & 2 ? 1 : 0);
    };
    // click
    document.addEventListener("mousedown", updateMouseEv);
    document.addEventListener("mouseup", updateMouseEv);
    // mouse moved
    document.addEventListener("mousemove", updateMouseEv);
    // scroll wheel
    document.addEventListener("wheel", (ev) => {
      if (!("wheel" in this.state)) {
        this.updateValue("wheel", 0);
      }
      this.updateValue("wheel", this.state["wheel"].val + ev.deltaY);
    });
    // right click, avoid menu opening
    document.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      return false;
    });

    // exit screen
    document.addEventListener("blur", () => this.onExit());
    document.addEventListener("focusout", () => this.onExit());
    document.addEventListener("mouseleave", () => {});

    // resume
    document.addEventListener("focusin", () => {});

    // can ask if they really wanna leave
    document.addEventListener("beforeunload", () => {});
  }
}
const input = new InputListener();

export { input };
