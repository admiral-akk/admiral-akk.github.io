// https://evanhahn.com/javascript-compression-streams-api-with-strings/
async function concatUint8Arrays(uint8arrays) {
  const blob = new Blob(uint8arrays);
  const buffer = await blob.arrayBuffer();
  return new Uint8Array(buffer);
}

// https://evanhahn.com/javascript-compression-streams-api-with-strings/
async function compressToBase64UrlStr(data) {
  const jsonString = JSON.stringify(data);
  // Convert the string to a byte stream.
  const stream = new Blob([jsonString]).stream();

  // Create a compressed stream.
  const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));

  // Read all the bytes from this stream.
  const chunks = [];
  for await (const chunk of compressedStream) {
    chunks.push(chunk);
  }
  const uint8Array = await concatUint8Arrays(chunks);
  const base64 = btoa(String.fromCharCode.apply(null, uint8Array));
  return base64.replace(/\+/g, "-").replace(/\//g, "_");
}

// https://evanhahn.com/javascript-compression-streams-api-with-strings/
async function decompressFromBase64UrlStr(base64UrlStr) {
  const base64 = base64UrlStr.replace(/-/g, "+").replace(/_/g, "/");
  const uint8Array = new Uint8Array(
    atob(base64)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  // Convert the bytes to a stream.
  const stream = new Blob([uint8Array]).stream();

  // Create a decompressed stream.
  const decompressedStream = stream.pipeThrough(
    new DecompressionStream("gzip")
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

function minifyData(data) {
  return data;
}

function unminifyData(data) {
  return data;
}

async function saveData(data) {
  const minifiedData = minifyData(data);
  const base64UrlStr = await compressToBase64UrlStr(minifiedData);
  const url = new URL(window.location.href);
  url.searchParams.set("d", base64UrlStr);
  window.history.pushState(null, "", url.toString());
}

async function fetchData() {
  const urlParams = new URLSearchParams(window.location.search);
  const base64UrlStr = urlParams.get("d");
  if (!base64UrlStr) {
    return null;
  }
  const minifiedData = await decompressFromBase64UrlStr(base64UrlStr);
  const data = unminifyData(minifiedData);
  return data;
}

export { saveData, fetchData };
