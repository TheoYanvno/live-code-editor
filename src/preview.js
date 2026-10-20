// Builds the HTML page shown in the preview frame from the three editor panes.
// No DOM code here, so it can be tested in Node.

/**
 * Text inside <script> and <style> ends at the first "</script" or "</style", even inside a JS string.
 * Escaping the slash keeps the user's code intact: "<\/script>" means the same thing in JS.
 */
export const escapeScript = (code) => code.replace(/<\/(script)/gi, '<\\/$1');
export const escapeStyle = (code) => code.replace(/<\/(style)/gi, '<\\/$1');

/** The line (counting from 1) where the user's JS begins in a built page, for error line numbers. */
export function jsStartLine(doc, js) {
  const at = doc.lastIndexOf(`<script>\n${escapeScript(js)}`);
  return at < 0 ? 0 : doc.slice(0, at).split('\n').length + 1;
}

/** If the user wrote a full page (<html> or <body>), put our CSS and JS inside it; otherwise wrap their markup. */
export function buildDocument({ html = '', css = '', js = '' }, { head = '' } = {}) {
  const style = `<style>\n${escapeStyle(css)}\n</style>`;
  const script = js.trim() ? `<script>\n${escapeScript(js)}\n</script>` : '';
  const isFullPage = /<html[\s>]|<body[\s>]/i.test(html);

  if (!isFullPage) {
    return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${head}
${style}
</head>
<body>
${html}
${script}
</body>
</html>`;
  }

  let page = html;
  const addToHead = `${head}\n${style}`;
  page = /<\/head>/i.test(page) ? page.replace(/<\/head>/i, `${addToHead}\n</head>`)
    : page.replace(/<body([\s>])/i, `<head>${addToHead}</head>\n<body$1`);
  page = /<\/body>/i.test(page) ? page.replace(/<\/body>(?![\s\S]*<\/body>)/i, `${script}\n</body>`) : page + script;
  return page;
}

/** Waits until calls stop for `ms` before running `fn` (used to re-run the preview after typing pauses). */
export function debounce(fn, ms) {
  let t;
  const run = (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  run.cancel = () => clearTimeout(t);
  return run;
}
