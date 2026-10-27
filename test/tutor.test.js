import test from 'node:test';
import assert from 'node:assert';
import { assemble, startOf, renderMarkdown, lineDiff, changedLines, runChecks, Progress } from '../src/tutor-core.js';

test('assemble builds the full code after each step from named blocks', () => {
  const guide = assemble({ html: { page: '<canvas></canvas>' }, js: { setup: 'const a = 1;' } }, [
    { title: 'one', js: { draw: '\nfunction draw() {}\n' } },
    { title: 'two', js: { setup: 'const a = 2;' }, css: { body: 'body { margin: 0; }' } },
    { title: 'three', js: { draw: null } },
  ]);
  assert.deepStrictEqual(guide.start, { html: '<canvas></canvas>', css: '', js: 'const a = 1;' });
  assert.strictEqual(guide.steps[0].code.js, 'const a = 1;\n\nfunction draw() {}');
  assert.strictEqual(guide.steps[1].code.js, 'const a = 2;\n\nfunction draw() {}', 'a replaced block keeps its place');
  assert.strictEqual(guide.steps[1].code.css, 'body { margin: 0; }');
  assert.strictEqual(guide.steps[2].code.js, 'const a = 2;');
  assert.strictEqual(startOf(guide, 0), guide.start);
  const ordered = assemble({ js: { a: '', b: '', c: '' } }, [{ js: { c: 'C' } }, { js: { a: 'A' } }]);
  assert.strictEqual(ordered.start.js, '');
  assert.strictEqual(ordered.steps[1].code.js, 'A\n\nC', 'placeholders keep the order');
  assert.strictEqual(startOf(guide, 2), guide.steps[1].code);
});

test('markdown subset renders safely', () => {
  const html = renderMarkdown('### Why\nUse `step()` to **move**, see [MDN](https://developer.mozilla.org).\n\n- one\n- two\n\n1. first\n2. second\n\n> Tip: <b>not bold</b>\n\n```js\nif (a < b) {}\n```');
  assert.match(html, /<h4>Why<\/h4>/);
  assert.match(html, /<code>step\(\)<\/code>/);
  assert.match(html, /<strong>move<\/strong>/);
  assert.match(html, /<a href="https:\/\/developer.mozilla.org" target="_blank" rel="noopener">MDN<\/a>/);
  assert.match(html, /<ul><li>one<\/li><li>two<\/li><\/ul>/);
  assert.match(html, /<ol><li>first<\/li><li>second<\/li><\/ol>/);
  assert.match(html, /<aside class="tip">Tip: &lt;b&gt;not bold&lt;\/b&gt;<\/aside>/);
  assert.match(html, /<pre class="snippet" data-lang="js"><code>if \(a &lt; b\) \{\}<\/code><\/pre>/);
  assert.doesNotMatch(renderMarkdown('[x](javascript:alert(1))'), /href/, 'only https links');
  assert.doesNotMatch(renderMarkdown('<img src=x onerror=alert(1)>'), /<img/);
});

test('lineDiff marks added and removed lines', () => {
  const d = lineDiff('a\nb\nc', 'a\nB\nc\nd');
  assert.deepStrictEqual(d.map((x) => x.type), ['same', 'del', 'add', 'same', 'add']);
  assert.deepStrictEqual(lineDiff('', 'x').map((x) => x.type), ['add']);
  const lines = Array.from({ length: 20 }, (_, i) => `line ${i}`);
  const changed = changedLines(lineDiff(lines.join('\n'), [...lines.slice(0, 10), 'new', ...lines.slice(10)].join('\n')), 1);
  assert.deepStrictEqual(changed.map((x) => x.type), ['same', 'add', 'same', 'gap']);
});

test('checks look for what a step asks for, ignoring comments', () => {
  const code = { html: '<canvas id="board"></canvas><!-- <button id="start"> -->', css: '', js: '// function step() {}\nconst snake = [];' };
  const results = runChecks(code, [
    { pane: 'html', label: 'a canvas', test: /<canvas[^>]+id="board"/ },
    { pane: 'html', label: 'a start button', test: /id="start"/, hint: 'Add <button id="start">' },
    { pane: 'js', label: 'a step function', test: /function step\s*\(/ },
    { pane: 'js', label: 'a snake array', test: (js) => js.includes('const snake = [') },
  ]);
  assert.deepStrictEqual(results.map((r) => r.ok), [true, false, false, true]);
  assert.strictEqual(results[1].hint, 'Add <button id="start">');
  assert.ok(runChecks({ js: 'fetch("https://example.com")' }, [{ pane: 'js', label: 'url kept', test: /https:\/\// }])[0].ok);
});

test('progress is remembered per guide and survives blocked storage', () => {
  const store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const p = new Progress(storage);
  assert.deepStrictEqual(p.get('snake'), { step: 0, done: [] });
  p.goTo('snake', 3);
  p.complete('snake', 2);
  p.complete('snake', 0);
  p.complete('snake', 2);
  assert.deepStrictEqual(new Progress(storage).get('snake'), { step: 3, done: [0, 2] });
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const q = new Progress(blocked);
  assert.deepStrictEqual(q.goTo('snake', 1), { step: 1, done: [] });
});
