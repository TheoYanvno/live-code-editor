import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDocument, escapeScript, debounce } from '../src/preview.js';

test('wraps plain markup in a page with the CSS in the head and JS at the end of the body', () => {
  const doc = buildDocument({ html: '<h1>Hi</h1>', css: 'h1 { color: red }', js: 'console.log(1)' });
  assert.match(doc, /^<!doctype html>/);
  assert.ok(doc.indexOf('h1 { color: red }') < doc.indexOf('<body>'));
  assert.ok(doc.indexOf('<h1>Hi</h1>') < doc.indexOf('console.log(1)'));
});

test('leaves out the script tag when there is no JS', () => {
  assert.doesNotMatch(buildDocument({ html: '<p>x</p>' }), /<script>/);
});

test('a "</script>" inside the JS does not end the script early', () => {
  const js = 'const s = "</script><b>oops</b>";';
  const doc = buildDocument({ js });
  assert.equal(doc.match(/<\/script>/g).length, 1);
  assert.match(doc, /"<\\\/script><b>oops<\/b>"/);
  assert.equal(escapeScript('</SCRIPT>'), '<\\/SCRIPT>');
});

test('a "</style>" inside the CSS is escaped too', () => {
  const doc = buildDocument({ css: 'a::after { content: "</style>" }' });
  assert.equal(doc.match(/<\/style>/g).length, 1);
});

test('a full page keeps its own structure and gets the CSS and JS added', () => {
  const html = '<!doctype html><html><head><title>Mine</title></head><body><p>x</p></body></html>';
  const doc = buildDocument({ html, css: 'p{}', js: 'go()' });
  assert.equal(doc.match(/<body/g).length, 1);
  assert.ok(doc.indexOf('p{}') < doc.indexOf('</head>'));
  assert.ok(doc.indexOf('go()') > doc.indexOf('<p>x</p>') && doc.indexOf('go()') < doc.indexOf('</body>'));
});

test('a page with <body> but no <head> gets one', () => {
  const doc = buildDocument({ html: '<body class="a"><p>x</p></body>', css: 'p{}' });
  assert.match(doc, /<head>[\s\S]*p\{\}[\s\S]*<\/head>\s*<body class="a">/);
});

test('extra head content (like the console bridge) goes before the user CSS', () => {
  const doc = buildDocument({ css: 'p{}' }, { head: '<script>bridge()</script>' });
  assert.ok(doc.indexOf('bridge()') < doc.indexOf('p{}'));
});

test('debounce runs once after calls stop', async () => {
  let calls = 0;
  const run = debounce(() => calls++, 20);
  run(); run(); run();
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(calls, 1);
});
