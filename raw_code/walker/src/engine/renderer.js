import { window } from "./window.js";

const gl = window.canvas.getContext("webgl2");
gl.getExtension("EXT_color_buffer_float");
gl.getExtension("OES_texture_float_linear");
gl.getExtension("WEBGL_depth_texture");

export { gl };
