import test from 'node:test';
import assert from 'node:assert';
import { readFileSync, readdirSync } from 'node:fs';
import { parseGuide } from '../scripts/build-guides.js';
import { assemble, runChecks, startOf } from '../src/tutor-core.js';
import { GUIDES } from '../src/lessons/index.js';

const guidesDir = new URL('../guides/', import.meta.url);
const sources = readdirSync(guidesDir).filter((f) => f.endsWith('.md') && f !== 'README.md');

for (const file of sources) {
  const source = parseGuide(readFileSync(new URL(file, guidesDir), 'utf8'), file);

  test(`${file}: the built lesson matches the Markdown (run npm run guides)`, async () => {
    const built = (await import(`../src/lessons/${source.id}.js`)).default;
    assert.deepStrictEqual(built, JSON.parse(JSON.stringify(source)));
  });

  test(`${file}: every step's answer passes its checks, and the checks aren't already met at the start`, () => {
    const guide = assemble(source.start, source.steps);
    guide.steps.forEach((step, i) => {
      if (!step.checks) { assert.strictEqual(step.kind, 'read', `step ${i + 1} has no checks, so it must be a read-along`); return; }
      const failing = runChecks(step.code, step.checks).filter((r) => !r.ok).map((r) => r.label);
      assert.deepStrictEqual(failing, [], `step ${i + 1} "${step.title}"`);
      const already = runChecks(startOf(guide, i), step.checks).every((r) => r.ok);
      assert.ok(!already, `step ${i + 1} "${step.title}" passes before any code is written`);
    });
  });

  test(`${file}: a full lesson: a plan, a planned time and a quiz for every step, and diagrams`, () => {
    assert.ok(source.goals.length >= 3, 'list at least 3 goals in the front matter');
    assert.ok(source.sessions.length >= 1, 'split the guide into sessions (one per sitting / push)');
    for (const x of source.sessions) assert.ok(x.to - x.from < 6, `session "${x.title}" is too long for one sitting (5 steps at most)`);
    assert.strictEqual(source.sessions[0].from, 0, 'the first session starts at step 1');
    assert.strictEqual(source.sessions.at(-1).to, source.steps.length - 1, 'the last session ends at the last step');
    source.steps.forEach((step, i) => {
      assert.ok(step.minutes > 0, `step ${i + 1} "${step.title}" needs a time: line`);
      if (step.kind !== 'read') assert.ok(step.quiz?.length, `step ${i + 1} "${step.title}" needs at least one quiz question`);
      for (const q of step.quiz ?? []) {
        assert.ok(q.options.length >= 3, `"${q.q}" needs at least 3 options`);
        assert.ok(q.why, `"${q.q}" needs a why: line explaining the answer`);
      }
    });
    const diagrams = source.steps.reduce((t, st) => t + (st.body.match(/^```svg/gm)?.length ?? 0), 0);
    assert.ok(diagrams >= 3, `at least 3 diagrams (found ${diagrams})`);
  });

  test(`${file}: the guide list knows how many steps it has`, () => {
    const entry = GUIDES.find((g) => g.id === source.id);
    assert.ok(entry, `${source.id} is missing from src/lessons/index.js`);
    assert.strictEqual(entry.steps, source.steps.length);
  });
}

test('every guide in the list that is available has a lesson file', () => {
  for (const g of GUIDES.filter((x) => x.available)) assert.ok(sources.includes(`${g.id}.md`), g.id);
});
