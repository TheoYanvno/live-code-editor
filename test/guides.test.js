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

  test(`${file}: the guide list knows how many steps it has`, () => {
    const entry = GUIDES.find((g) => g.id === source.id);
    assert.ok(entry, `${source.id} is missing from src/lessons/index.js`);
    assert.strictEqual(entry.steps, source.steps.length);
  });
}

test('every guide in the list that is available has a lesson file', () => {
  for (const g of GUIDES.filter((x) => x.available)) assert.ok(sources.includes(`${g.id}.md`), g.id);
});
