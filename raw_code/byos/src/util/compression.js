// https://evanhahn.com/javascript-compression-streams-api-with-strings/
async function concatUint8Arrays(uint8arrays) {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

class ApiCompressor {
  constructor(compressionType = "gzip") {
    this.compressionType = compressionType;
  }

  // https://evanhahn.com/javascript-compression-streams-api-with-strings/
  async compressJSONToBase64(jsonData) {
    const jsonString = JSON.stringify(jsonData);
    // Convert the string to a byte stream.
    const stream = new Blob([jsonString]).stream();

    // Create a compressed stream.
    const compressedStream = stream.pipeThrough(
      new CompressionStream(this.compressionType)
    );

    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of compressedStream) {
      chunks.push(chunk);
    }
    const uint8Array = await concatUint8Arrays(chunks);
    return btoa(String.fromCharCode.apply(null, uint8Array));
  }

  // https://evanhahn.com/javascript-compression-streams-api-with-strings/
  async decompressBase64ToJSON(base64) {
    const uint8Array = new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    // Convert the bytes to a stream.
    const stream = new Blob([uint8Array]).stream();

    // Create a decompressed stream.
    const decompressedStream = stream.pipeThrough(
      new DecompressionStream(this.compressionType)
    );

    // Read all the bytes from this stream.
    const chunks = [];
    for await (const chunk of decompressedStream) {
      chunks.push(chunk);
    }
    const stringBytes = await concatUint8Arrays(chunks);
    const jsonString = new TextDecoder().decode(stringBytes);

    // Convert the bytes to a string.
    return JSON.parse(jsonString);
  }
}

class DataManager {
  constructor(compressor) {
    this.compressor = compressor;
  }

  async saveData(jsonData) {
    const base64 = await this.compressor.compressJSONToBase64(jsonData);
    const base64UrlStr = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, ".");
    const url = new URL(window.location.href);
    url.searchParams.set("d", base64UrlStr);

    console.log("string length", base64UrlStr.length);
    window.history.pushState(null, "", url.toString());
  }

  async fetchData() {
    const urlParams = new URLSearchParams(window.location.search);
    const base64UrlStr = urlParams.get("d");
    if (!base64UrlStr) {
      return null;
    }
    const base64 = base64UrlStr
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .replace(/\./g, "=");
    return await this.compressor.decompressBase64ToJSON(base64);
  }
}

export { DataManager, ApiCompressor };
