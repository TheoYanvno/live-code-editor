import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeProject, decodeProject } from '../src/share.js';
import { TEMPLATES } from '../src/templates.js';

test('a project survives the trip through the URL', async () => {
  const project = { html: '<h1>Hi ✨</h1>', css: 'h1 { color: red }', js: 'console.log("a & b", `x`)' };
  const hash = await encodeProject(project);
  assert.match(hash, /^z:[A-Za-z0-9_-]+$/);           // URL-safe, no + / or =
  assert.deepEqual(await decodeProject('#' + hash), project);
});

test('compression keeps links short for typical code', async () => {
  const t = TEMPLATES.todo;
  const raw = JSON.stringify({ html: t.html, css: t.css, js: t.js }).length;
  const hash = await encodeProject(t);
  assert.ok(hash.length < raw * 0.75, `${hash.length} vs ${raw}`);
});

test('ignores hashes that are not shared projects or are damaged', async () => {
  assert.equal(await decodeProject('#section-2'), null);
  assert.equal(await decodeProject(''), null);
  const hash = await encodeProject({ html: 'x' });
  assert.equal(await decodeProject(hash.slice(0, -6)), null);
});

test('every template has a name and all three panes', () => {
  for (const [id, t] of Object.entries(TEMPLATES)) {
    assert.ok(t.name, id);
    for (const k of ['html', 'css', 'js']) assert.equal(typeof t[k], 'string', `${id}.${k}`);
  }
});
