import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Projects, suggestName } from '../src/storage.js';

// A stand-in for localStorage
const memory = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};
const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };

const code = (html) => ({ html, css: '', js: '' });

test('keeps a draft of the current code', () => {
  const p = new Projects(memory());
  assert.equal(p.draft(), null);
  p.saveDraft(code('<p>a</p>'));
  assert.deepEqual(p.draft(), code('<p>a</p>'));
});

test('saves, lists newest first, opens and deletes projects', () => {
  const p = new Projects(memory());
  p.save('First', code('1'), 1000);
  p.save('Second', code('2'), 2000);
  assert.deepEqual(p.list().map((x) => x.name), ['Second', 'First']);
  assert.equal(p.open('First').html, '1');
  p.remove('First');
  assert.deepEqual(p.list().map((x) => x.name), ['Second']);
});

test('saving with an existing name replaces it (ignoring case)', () => {
  const p = new Projects(memory());
  p.save('Demo', code('old'), 1);
  p.save('demo', code('new'), 2);
  assert.equal(p.list().length, 1);
  assert.equal(p.list()[0].html, 'new');
});

test('needs a name', () => {
  assert.throws(() => new Projects(memory()).save('   ', code('x')), /name/);
});

test('blocked storage never crashes; saving explains the problem', () => {
  const p = new Projects(blocked);
  assert.equal(p.draft(), null);
  assert.deepEqual(p.list(), []);
  assert.equal(p.saveDraft(code('x')), false);
  assert.throws(() => p.save('A', code('x')), /blocking storage/);
});

test('suggests a name from the title or first heading', () => {
  assert.equal(suggestName('<title>My Page</title><h1>Other</h1>'), 'My Page');
  assert.equal(suggestName('<main><h1 class="x">Hello!</h1></main>'), 'Hello!');
  assert.equal(suggestName('<p>none</p>'), 'Untitled');
});
