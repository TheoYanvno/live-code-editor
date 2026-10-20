import { test } from 'node:test';
import assert from 'node:assert/strict';
import { describe, bridgeScript } from '../src/console-bridge.js';

test('describes values the way a console would', () => {
  assert.equal(describe('hi'), 'hi');
  assert.equal(describe(['a', 1, null, undefined]), '["a", 1, null, undefined]');
  assert.equal(describe({ a: 1, 'b-c': [true] }), '{a: 1, "b-c": [true]}');
  assert.equal(describe(new Error('boom')), 'Error: boom');
  assert.equal(describe(function greet() {}), 'ƒ greet()');
  assert.equal(describe(new Map([['k', 2]])), 'Map(1) {"k" => 2}');
  assert.equal(describe(10n), '10n');
});

test('handles circular and deeply nested objects without crashing', () => {
  const a = { name: 'a' };
  a.self = a;
  assert.equal(describe(a), '{name: "a", self: [Circular]}');
  assert.equal(describe({ x: { y: { z: { w: 1 } } } }), '{x: {y: {z: {…}}}}');
});

test('the bridge script is valid JavaScript and carries the run id', () => {
  const src = bridgeScript('run-7', 12).replace(/^<script>|<\/script>$/g, '');
  assert.doesNotThrow(() => new Function(src));
  assert.match(src, /"run-7"/);
  assert.match(src, /JS_LINE = 12/);
});
