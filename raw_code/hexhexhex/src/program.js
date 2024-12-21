class Program {
  constructor(gl, vertShader, fragShader) {
    const program = gl.createProgram();
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertShader);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);

    gl.shaderSource(fragmentShader, fragShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log(gl.getShaderInfoLog(vertexShader));
      console.log(gl.getShaderInfoLog(fragmentShader));
    }
    this.program = program;
  }
}

export { Program };
