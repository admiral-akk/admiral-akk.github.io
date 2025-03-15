import glsl from "vite-plugin-glsl";
import wasm from "vite-plugin-wasm";

export default {
  optimizeDeps: {
    include: ["linked-dep"],
  },
  root: "src/",
  publicDir: "../static/",
  base: "./",
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
    outDir: "../../../wasm", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [glsl(), wasm()],
};
