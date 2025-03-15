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
  async compressStrToBase64(str) {
    // Convert the string to a byte stream.
    const stream = new Blob([str]).stream();

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
  async decompressBase64ToStr(base64) {
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
    return new TextDecoder().decode(stringBytes);
  }
}

class DefaultCompressor {
  async compressStrToBase64(str) {
    return btoa(str);
  }
  async decompressBase64ToStr(base64) {
    return atob(base64);
  }
}

class DefaultPreprocessor {
  async jsonToString(jsonData) {
    return JSON.stringify(jsonData);
  }

  async jsonFromString(jsonData) {
    return JSON.parse(jsonData);
  }
}

class DataManager {
  constructor(
    compressor = new DefaultCompressor(),
    preprocessor = new DefaultPreprocessor()
  ) {
    this.compressor = compressor;
    this.preprocessor = preprocessor;
  }

  async saveData(jsonData) {
    const str = await this.preprocessor.jsonToString(jsonData);
    const base64 = await this.compressor.compressStrToBase64(str);
    const base64UrlStr = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, ".");
    const url = new URL(window.location.href);
    url.searchParams.set("d", base64UrlStr);
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
    const str = await this.compressor.decompressBase64ToStr(base64);
    return await this.preprocessor.jsonFromString(str);
  }
}

export { DataManager, DefaultCompressor, ApiCompressor, DefaultPreprocessor };
