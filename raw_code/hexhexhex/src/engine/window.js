class WindowManager {
  constructor(aspect) {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      buffer: 0,
      aspect,
    };
    this.listeners = [];
    const container = document.createElement("div");
    container.classList.add("container");
    const canvasContainer = document.createElement("div");
    canvasContainer.classList.add("relative");
    document.querySelector("div.relative");
    const ui = document.createElement("div");
    ui.classList.add("ui", "uiContainer");
    const canvas = document.createElement("canvas");
    canvas.className = "webgl";
    canvas.id = "webgl";
    canvas.addEventListener("click", async () => {
      await canvas.requestPointerLock({
        unadjustedMovement: true,
      });
    });
    document.body.appendChild(container);
    container.appendChild(canvasContainer);
    canvasContainer.appendChild(ui);
    canvasContainer.appendChild(canvas);

    this.canvas = canvas;

    this.update = () => {
      const { buffer } = this.sizes;
      const adjustedHeight = window.innerHeight - 2 * buffer;
      const adjustedWidth = window.innerWidth - 2 * buffer;
      if (adjustedHeight * this.sizes.aspect > adjustedWidth) {
        this.sizes.width = adjustedWidth;
        this.sizes.height = adjustedWidth / this.sizes.aspect;
        this.sizes.verticalOffset =
          buffer + (adjustedHeight - this.sizes.height) / 2;
        this.sizes.horizontalOffset = buffer;
      } else {
        this.sizes.width = adjustedHeight * this.sizes.aspect;
        this.sizes.height = adjustedHeight;
        this.sizes.verticalOffset = buffer;
        this.sizes.horizontalOffset =
          buffer + (adjustedWidth - this.sizes.width) / 2;
      }
      canvasContainer.style.top = this.sizes.verticalOffset.toString() + "px";
      canvasContainer.style.left =
        this.sizes.horizontalOffset.toString() + "px";
      canvas.width = this.sizes.width;
      canvas.height = this.sizes.height;

      this.listeners.forEach((l) => {
        l.updateSize(this.sizes);
      });
    };

    window.addEventListener("resize", this.update);
    window.addEventListener("orientationchange", this.update);
    window.addEventListener("dblclick", (event) => {
      if (event.target.className !== "webgl") {
        return;
      }
      const fullscreenElement =
        document.fullscreenElement || document.webkitFullscreenElement;

      if (fullscreenElement) {
        //document.exitFullscreen();
      } else {
        //container.requestFullscreen();
      }
    });
    this.update();
  }
}

const windowManager = new WindowManager(16 / 9);

export { windowManager as window };
