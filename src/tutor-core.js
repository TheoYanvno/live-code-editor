// Code Tutor: the parts with no DOM code, so they can be tested in Node.
//  - assemble() turns a guide's steps into the full HTML/CSS/JS after each step
//  - renderMarkdown() turns a step's explanation into safe HTML
//  - lineDiff() shows what a step adds or changes
//  - runChecks() looks at the learner's code for what a step asks for
//  - Progress remembers where each guide was left off

const PANES = ['html', 'css', 'js'];

/**
 * A guide's code is built from named blocks per pane (for example js: { state, draw, keys }).
 * Each step adds blocks, replaces a block by name (it keeps its place) or removes one with null.
 * Blocks listed in `start` with an empty string keep their order until a step fills them in.
 * The result is the full code after every step, so "Load the answer" and the diff are always exact.
 */
export function assemble(start, steps) {
  const panes = Object.fromEntries(PANES.map((p) => [p, new Map(Object.entries(start[p] ?? {}))]));
  // Empty blocks hold a place, so a guide can list its blocks up front in the order they should appear
  const snapshot = () => Object.fromEntries(PANES.map((p) => [p, [...panes[p].values()].filter(Boolean).join('\n\n')]));
  const startCode = snapshot();
  const out = steps.map((step) => {
    for (const p of PANES) {
      for (const [name, text] of Object.entries(step[p] ?? {})) {
        if (text === null) panes[p].delete(name);
        else panes[p].set(name, text.replace(/^\n+|\s+$/g, ''));
      }
    }
    return { ...step, code: snapshot() };
  });
  return { start: startCode, steps: out };
}

/** The code a step starts from: the guide's start for step 0, otherwise the previous step's answer. */
export const startOf = (guide, i) => (i === 0 ? guide.start : guide.steps[i - 1].code);

// ---------------------------------------------------------------------------------------------
// Markdown (a small, safe subset): ### headings, paragraphs, - and 1. lists, > tips, ```code```,
// `inline code`, **bold**, *italic* and [links](https://...). Everything is escaped first.

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function inline(text) {
  const codes = [];
  let s = escapeHtml(text).replace(/`([^`]+)`/g, (_, c) => `\u0000${codes.push(c) - 1}\u0000`);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${codes[i]}</code>`);
}

export function renderMarkdown(md) {
  const lines = md.replace(/\r/g, '').split('\n');
  const html = [];
  let para = [];
  let list = null;                                    // { tag, items }
  const flushPara = () => { if (para.length) html.push(`<p>${inline(para.join(' '))}</p>`); para = []; };
  const flushList = () => { if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`); list = null; };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)\s*$/);
    if (fence) {
      flushPara(); flushList();
      const body = [];
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      html.push(`<pre class="snippet"${fence[1] ? ` data-lang="${fence[1]}"` : ''}><code>${escapeHtml(body.join('\n'))}</code></pre>`);
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const tip = line.match(/^>\s?(.*)$/);
    if (heading) { flushPara(); flushList(); html.push(`<h${heading[1].length + 1}>${inline(heading[2])}</h${heading[1].length + 1}>`); }
    else if (bullet || numbered) {
      flushPara();
      const tag = bullet ? 'ul' : 'ol';
      if (list?.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push((bullet ?? numbered)[1]);
    } else if (tip) { flushPara(); flushList(); html.push(`<aside class="tip">${inline(tip[1])}</aside>`); }
    else if (!line.trim()) { flushPara(); flushList(); }
    else if (list && /^\s{2,}\S/.test(line)) list.items[list.items.length - 1] += ` ${line.trim()}`;   // wrapped list item
    else { flushList(); para.push(line.trim()); }
  }
  flushPara(); flushList();
  return html.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Line diff (longest common subsequence), enough for showing what one step changes.

export function lineDiff(before, after) {
  const a = before ? before.split('\n') : [];
  const b = after ? after.split('\n') : [];
  const n = a.length, m = b.length;
  const lcs = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
  }
  const out = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push({ type: 'same', text: a[i] }); i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) out.push({ type: 'del', text: a[i++] });
    else out.push({ type: 'add', text: b[j++] });
  }
  while (i < n) out.push({ type: 'del', text: a[i++] });
  while (j < m) out.push({ type: 'add', text: b[j++] });
  return out;
}

/** Only the changed lines, with up to `context` unchanged lines around them ('gap' marks skipped lines). */
export function changedLines(diff, context = 2) {
  const keep = diff.map((d) => d.type !== 'same');
  const show = diff.map((_, i) => keep.slice(Math.max(0, i - context), i + context + 1).some(Boolean));
  const out = [];
  diff.forEach((d, i) => {
    if (show[i]) out.push(d);
    else if (out.at(-1)?.type !== 'gap') out.push({ type: 'gap', text: '' });
  });
  return out[0]?.type === 'gap' ? out.slice(1) : out;
}

// ---------------------------------------------------------------------------------------------
// Checks: each one looks for something in a pane, e.g. { pane: 'js', label: 'a step() function', test: /function step\s*\(/ }.
// Comments are ignored, so a commented-out answer doesn't pass.

const stripComments = (code, pane) => (pane === 'html'
  ? code.replace(/<!--[\s\S]*?-->/g, '')
  : code.replace(/\/\*[\s\S]*?\*\//g, '').replace(pane === 'js' ? /(^|[^:"'`\\])\/\/.*$/gm : /$^/, '$1'));

/** A RegExp, or a string written like one ("/pattern/flags", as guides store them). */
function toRegExp(test) {
  if (test instanceof RegExp) return test;
  const m = String(test).match(/^\/(.+)\/([a-z]*)$/s);
  return m ? new RegExp(m[1], m[2]) : new RegExp(test);
}

export function runChecks(code, checks = []) {
  return checks.map(({ pane, label, test, hint }) => {
    const text = stripComments(code[pane] ?? '', pane);
    const ok = typeof test === 'function' ? Boolean(test(text)) : toRegExp(test).test(text);
    return { pane, label, ok, hint };
  });
}

// ---------------------------------------------------------------------------------------------
// Progress per guide: the step you're on and the steps you've checked off. Storage can be blocked
// (private windows), so every read and write is wrapped and the tutor still works without it.

export class Progress {
  constructor(storage = globalThis.localStorage, key = 'code-tutor-progress') {
    this.storage = storage;
    this.key = key;
    try { this.data = JSON.parse(storage?.getItem(key)) ?? {}; } catch { this.data = {}; }
  }
  get(id) { return this.data[id] ?? { step: 0, done: [] }; }
  set(id, { step, done }) {
    this.data[id] = { step, done: [...new Set(done)].sort((a, b) => a - b) };
    try { this.storage?.setItem(this.key, JSON.stringify(this.data)); } catch { /* not saved, still works */ }
    return this.data[id];
  }
  complete(id, step) { const p = this.get(id); return this.set(id, { step: p.step, done: [...p.done, step] }); }
  goTo(id, step) { const p = this.get(id); return this.set(id, { ...p, step }); }
  reset(id) { delete this.data[id]; try { this.storage?.setItem(this.key, JSON.stringify(this.data)); } catch { /* ignore */ } }
}
