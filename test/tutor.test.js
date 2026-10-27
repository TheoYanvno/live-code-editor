import test from 'node:test';
import assert from 'node:assert';
import { assemble, startOf, renderMarkdown, lineDiff, changedLines, runChecks, Progress, lessonPlan, pace, clock, gradeQuiz } from '../src/tutor-core.js';

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
  assert.deepStrictEqual(p.get('snake'), { step: 0, done: [], time: {}, quiz: {} });
  p.goTo('snake', 3);
  p.complete('snake', 2);
  p.complete('snake', 0);
  p.complete('snake', 2);
  assert.deepStrictEqual(new Progress(storage).get('snake'), { step: 3, done: [0, 2], time: {}, quiz: {} });
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const q = new Progress(blocked);
  assert.deepStrictEqual(q.goTo('snake', 1), { step: 1, done: [], time: {}, quiz: {} });
  // progress saved before quizzes and timers existed still loads
  const old = new Progress({ getItem: () => JSON.stringify({ snake: { step: 2, done: [0, 1] } }), setItem() {} });
  assert.deepStrictEqual(old.get('snake'), { step: 2, done: [0, 1], time: {}, quiz: {} });
});

test('time spent and quiz answers are saved; a question keeps its first answer', () => {
  const store = new Map();
  const p = new Progress({ getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) });
  p.addTime('snake', 0, 30.4);
  p.addTime('snake', 0, 30);
  p.addTime('snake', 1, 90);
  p.answer('snake', '0.0', 2);
  p.answer('snake', '0.0', 1);
  const saved = new Progress({ getItem: (k) => store.get(k) ?? null, setItem() {} }).get('snake');
  assert.deepStrictEqual(saved.time, { 0: 60, 1: 90 });
  assert.deepStrictEqual(saved.quiz, { '0.0': 2 });
  assert.strictEqual(p.totalTime('snake'), 150);
});

test('lesson plan groups steps into sessions and adds up the minutes', () => {
  const guide = { title: 'G', sessions: [{ title: 'One', from: 0, to: 1 }, { title: 'Two', from: 2, to: 2 }],
    steps: [{ title: 'a', minutes: 10 }, { title: 'b', minutes: 15 }, { title: 'c' }] };
  const plan = lessonPlan(guide);
  assert.deepStrictEqual(plan.sessions.map((x) => x.minutes), [25, 0]);
  assert.strictEqual(plan.minutes, 25);
  assert.deepStrictEqual(plan.sessions[1].steps, [{ index: 2, title: 'c', minutes: 0 }]);
  assert.strictEqual(lessonPlan({ title: 'G', steps: [{ minutes: 5 }, { minutes: 5 }] }).sessions.length, 1, 'no sessions = one session');
});

test('pace says how a step is going against its planned time', () => {
  assert.strictEqual(pace(10, 120).status, 'early');
  assert.strictEqual(pace(10, 540).status, 'on');
  assert.strictEqual(pace(10, 700).status, 'over');
  assert.strictEqual(pace(10, 1000).status, 'long');
  assert.strictEqual(pace(0, 99).status, 'none');
  assert.strictEqual(clock(65), '1:05');
  assert.strictEqual(clock(3725), '1:02:05');
});

test('quizzes are graded from saved answers', () => {
  const steps = [{ quiz: [{ answer: 1 }, { answer: 0 }] }, {}, { quiz: [{ answer: 2 }] }];
  assert.deepStrictEqual(gradeQuiz(steps, { '0.0': 1, '0.1': 3 }), { total: 3, answered: 2, right: 1, percent: 50 });
  assert.deepStrictEqual(gradeQuiz(steps), { total: 3, answered: 0, right: 0, percent: 0 });
});

test('diagrams and tables render safely', () => {
  const fig = renderMarkdown('```svg The <grid>\n<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>\n```');
  assert.match(fig, /^<figure class="diagram"><img src="data:image\/svg\+xml;charset=utf-8,%3Csvg/);
  assert.doesNotMatch(fig, /<script/, 'the svg is URL-encoded inside an <img>, never inline');
  assert.match(fig, /alt="The &lt;grid&gt;"/);
  assert.match(fig, /<figcaption>The &lt;grid&gt;<\/figcaption>/);
  const table = renderMarkdown('| key | moves |\n|---|---|\n| up | `y - 1` |');
  assert.strictEqual(table, '<table class="t-table"><thead><tr><th>key</th><th>moves</th></tr></thead><tbody><tr><td>up</td><td><code>y - 1</code></td></tr></tbody></table>');
});
