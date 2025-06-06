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
      }

      var [x, y] = this.state["mpos"].val;
      // we can fake motion at the edge
      this.updateValue("mpos", [
        Math.clamp(x + ev.movementX / width, 0, 1),
        Math.clamp(y + ev.movementY / height, 0, 1),
      ]);

      this.updateValue("lmb", ev.buttons & 1 ? 1 : 0);
      this.updateValue("rmb", ev.buttons & 2 ? 1 : 0);
    };
    const canvas = document.getElementById("webgl");
    canvas.addEventListener("click", async (ev) => {
      if (document.pointerLockElement === null) {
        await canvas.requestPointerLock({
          unadjustedMovement: true,
        });
        const { width, height, verticalOffset, horizontalOffset } =
          window.sizes;
        this.updateValue("mpos", [
          (ev.clientX - horizontalOffset) / width,
          (ev.clientY - verticalOffset) / height,
        ]);
      }
    });
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
