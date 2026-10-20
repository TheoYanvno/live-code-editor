// The preview frame is sandboxed (its own origin), so the editor can't read its console directly.
// This small script is injected at the top of the preview page. It wraps console.log and friends and
// forwards everything to the editor with postMessage. Each run has an id, so messages from an old run
// that arrive late are ignored.

/** Turns any value into a short readable string, like a browser console would. */
export function describe(value, depth = 0, seen = new WeakSet()) {
  if (typeof value === 'string') return depth ? JSON.stringify(value) : value;
  if (value === undefined) return 'undefined';
  if (value === null || typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'bigint') return `${value}n`;
  if (typeof value === 'symbol') return value.toString();
  if (typeof value === 'function') return `ƒ ${value.name || '(anonymous)'}()`;
  if (value instanceof Error) return `${value.name}: ${value.message}`;
  if (seen.has(value)) return '[Circular]';
  if (depth > 2) return Array.isArray(value) ? '[…]' : '{…}';
  seen.add(value);
  if (typeof Element !== 'undefined' && value instanceof Element) {
    return `<${value.tagName.toLowerCase()}${value.id ? `#${value.id}` : ''}${value.className && typeof value.className === 'string' ? `.${value.className.trim().split(/\s+/).join('.')}` : ''}>`;
  }
  if (Array.isArray(value)) {
    const items = value.slice(0, 50).map((v) => describe(v, depth + 1, seen));
    return `[${items.join(', ')}${value.length > 50 ? `, … ${value.length - 50} more` : ''}]`;
  }
  if (value instanceof Map) return `Map(${value.size}) {${[...value].slice(0, 20).map(([k, v]) => `${describe(k, depth + 1, seen)} => ${describe(v, depth + 1, seen)}`).join(', ')}}`;
  if (value instanceof Set) return `Set(${value.size}) {${[...value].slice(0, 20).map((v) => describe(v, depth + 1, seen)).join(', ')}}`;
  if (value instanceof Date) return value.toISOString();
  const keys = Object.keys(value);
  const name = value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : '';
  const body = keys.slice(0, 30).map((k) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${describe(value[k], depth + 1, seen)}`);
  return `${name}{${body.join(', ')}${keys.length > 30 ? ', …' : ''}}`;
}

/** The script that goes in the preview's <head>. `jsLine` is the line where the user's JS starts in the page. */
export function bridgeScript(runId, jsLine) {
  return `<script>
(() => {
  const RUN = ${JSON.stringify(runId)};
  const JS_LINE = ${Number(jsLine) || 0};
  const describe = ${describe.toString()};
  const send = (level, args, line) => {
    try { parent.postMessage({ lce: RUN, level, text: args.map((a) => describe(a)).join(' '), line }, '*'); } catch (e) {}
  };
  for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
    const original = console[level];
    console[level] = (...args) => { send(level, args); original.apply(console, args); };
  }
  const originalClear = console.clear;
  console.clear = () => { send('clear', []); originalClear.call(console); };
  // Turn a line number in the whole page into a line number in the JS pane
  const jsLineOf = (line) => (line && JS_LINE && line >= JS_LINE ? line - JS_LINE + 1 : null);
  addEventListener('error', (e) => {
    send('error', [e.error instanceof Error ? e.error : e.message], jsLineOf(e.lineno));
  });
  addEventListener('unhandledrejection', (e) => send('error', ['Uncaught (in promise)', e.reason]));
  // Expressions typed in the console box run here, inside the preview page
  addEventListener('message', (e) => {
    if (e.source !== parent || !e.data || e.data.lceEval !== RUN) return;
    try {
      send('result', [(0, eval)(e.data.code)]);
    } catch (err) {
      send('error', [err]);
    }
  });
})();
</script>`;
}
