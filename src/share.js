// Share a project in the URL, so a link is all someone needs (no server, no account).
//
// The three panes are saved as JSON, compressed with the browser's built-in CompressionStream
// (deflate), and written as URL-safe base64 after the #. The part after # is never sent to a server.

const PREFIX = 'z:';

const toBase64Url = (bytes) => {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const fromBase64Url = (text) => {
  const bin = atob(text.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function pipe(bytes, stream) {
  const out = new Blob([bytes]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(out).arrayBuffer());
}

/** { html, css, js } → short text for the URL hash. */
export async function encodeProject({ html = '', css = '', js = '' }) {
  const json = new TextEncoder().encode(JSON.stringify({ html, css, js }));
  return PREFIX + toBase64Url(await pipe(json, new CompressionStream('deflate-raw')));
}

/** The reverse of encodeProject. Returns null for a hash that isn't a shared project. */
export async function decodeProject(hash) {
  const text = String(hash).replace(/^#/, '');
  if (!text.startsWith(PREFIX)) return null;
  try {
    const bytes = await pipe(fromBase64Url(text.slice(PREFIX.length)), new DecompressionStream('deflate-raw'));
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (typeof data !== 'object' || data === null) return null;
    return { html: String(data.html ?? ''), css: String(data.css ?? ''), js: String(data.js ?? '') };
  } catch {
    return null;                                 // a cut-off or edited link
  }
}
