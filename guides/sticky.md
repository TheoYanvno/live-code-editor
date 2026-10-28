---
id: sticky
title: Sticky Notes
blocks-html: page
blocks-css: base
blocks-js: notes, view, storage, ui, go
goals: Keep app state as plain objects and change them only through small functions that return copies; Build a page from data with a tiny element helper, without ever putting typed text into HTML; Turn a note into a checklist and back without losing a word; Drag and resize with pointer events and a ResizeObserver; Save to localStorage safely and repair whatever comes back
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects); Array map and filter, and the ... spread syntax; Events like click and input
---

## Session: One note on the desk

## Step: A note as data, drawn on the page
time: 15

Welcome! In this guide you'll rebuild the browser version of my [Sticky Notes](https://theoyanvno.github.io/sticky-notes/app/) app: up to three notes in four colors, each one plain text or a checklist, dragged and resized wherever you like, and remembered when you come back. The real project is also a Windows app; the last step shows how the same code powers that.

Every note is a **plain object**:

```svg A note on screen, and the object behind it
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 210" font-family="sans-serif"><rect x="20" y="20" width="220" height="170" rx="4" fill="#fff3a3" stroke="#d6c25a"/><rect x="20" y="20" width="220" height="28" fill="#f7e36b"/><circle cx="36" cy="34" r="6" fill="#f7e36b" stroke="#2c2620"/><circle cx="52" cy="34" r="6" fill="#f9aec6" stroke="#8a6a70"/><circle cx="68" cy="34" r="6" fill="#a8d0fb" stroke="#5a7a9a"/><circle cx="84" cy="34" r="6" fill="#a9e5a0" stroke="#5a8a55"/><text x="170" y="39" font-size="13">☑</text><text x="192" y="40" font-size="15" font-weight="700">+</text><text x="212" y="39" font-size="12">🗑</text><text x="32" y="74" font-size="12" fill="#2c2620">Milk</text><text x="32" y="92" font-size="12" fill="#2c2620">Call the dentist</text><line x1="240" y1="34" x2="262" y2="34" stroke="#475569"/><text x="266" y="30" font-size="11">bar: 4 colors, checklist,</text><text x="266" y="44" font-size="11">new note, delete (drag here)</text><line x1="200" y1="84" x2="262" y2="84" stroke="#475569"/><text x="266" y="88" font-size="11">content: text or a checklist</text><text x="266" y="128" font-size="11" fill="#475569">the data behind it:</text><text x="266" y="144" font-size="10" fill="#475569">{ id, body, list, checklist,</text><text x="266" y="158" font-size="10" fill="#475569">  color, x, y, w, h,</text><text x="266" y="172" font-size="10" fill="#475569">  created, updated }</text></svg>
```

| Field | Example | Meaning |
|---|---|---|
| `id` | `'3f9c…'` | a random id from `crypto.randomUUID()` (with a fallback where that's missing) |
| `body` | `'Milk'` | the text, when it isn't a checklist |
| `list`, `checklist` | `false`, `[]` | checklist mode and its items |
| `color` | `'yellow'` | one of four |
| `x`, `y`, `w`, `h` | `40, 40, 260, 260` | where it sits and how big it is |
| `created`, `updated` | ISO dates | when it was made and last changed |

The page is drawn **from** that data. `el(tag, props, ...children)` is a tiny helper that makes an element and sets its class, attributes and event handlers in one line, so `renderNote()` reads almost like the HTML it builds: a `<header>` bar with four color swatches, then a `<textarea>` for the text.

**Changes never edit a note in place.** `updateNote(note, patch)` returns a **copy** with the changes (`{ ...note, ...patch }`) and keeps sizes usable. `update(id, fn)` swaps the old note for the new one in the `notes` array and redraws. When everything goes through one path like this, the page can never show something different from the data.

### What to write

- **HTML:** a header, `<main id="desk">` where notes go, and an "empty" message for later.
- **CSS:** each note is `position: absolute` on the desk. Its colors come from `--note` and `--bar`, which `.note-yellow`, `.note-pink`… set, so changing a note's color is just changing its class.
- **JavaScript:** `createNote()`, `updateNote()`, `el()`, `renderNote()`, and `render()` placing each card at its `x`, `y`, `w`, `h`.

Typing updates the data **without** redrawing (`text` passes `false`). Redrawing replaces the `<textarea>`, which would throw away your cursor after every letter. Step 6 fixes that properly.

### Try it

Click the color dots. Type in the note.

check: html | the desk where notes go | /id=["']desk["']/
check: js | an updateNote() that returns a copy | /const\s+next\s*=\s*\{\s*\.\.\.note\s*,\s*\.\.\.patch/
check: js | an el() helper | /function\s+el\s*\(/
check: js | a renderNote() function | /function\s+renderNote\s*\(/
check: js | one place for every change | /function\s+update\s*\(/

quiz: Why does updateNote() return a copy instead of changing the note it was given?
- [ ] Copies use less memory
- [x] Every change then goes through update(), so the data and the page can't drift apart, and old values are never changed by surprise
- [ ] Objects in JavaScript can't be changed
why: With one path for changes, whatever is in notes is what's on screen.
quiz: How does a note change from yellow to pink on screen?
- [x] Its class changes from note-yellow to note-pink, and the CSS custom properties give it the new colors
- [ ] Every element's style is rewritten in JavaScript
- [ ] The page reloads
why: .note-pink sets --note and --bar; the rest of the note's CSS just uses those two variables.

```html page
<header class="top">
  <h1>Sticky Notes</h1>
  <p class="muted">Drag a note by its top bar · ☑ makes a checklist · + for another note (up to 3)</p>
</header>

<main id="desk" class="desk" aria-label="Your notes"></main>

<div id="empty" class="empty" hidden>
  <p>No notes. Deleted notes are gone for good.</p>
  <button id="firstNote" type="button">+ New sticky note</button>
</div>
```

```css base
* { box-sizing: border-box; }
:root {
  --yellow: #fff3a3; --yellow-bar: #f7e36b;
  --pink: #ffd3e1;   --pink-bar: #f9aec6;
  --blue: #cfe6ff;   --blue-bar: #a8d0fb;
  --green: #d4f5cf;  --green-bar: #a9e5a0;
}
body { margin: 0; height: 100vh; display: flex; flex-direction: column; font: 15px/1.45 system-ui, sans-serif; background: #ece6da; color: #2c2620; }
button, input, textarea { font: inherit; color: inherit; }
button { cursor: pointer; }
[hidden] { display: none !important; }
.top { padding: 8px 16px; }
.top h1 { margin: 0; font-size: 1.2rem; }
.muted { margin: 2px 0 0; color: #6b6257; font-size: 13px; }
.desk { position: relative; flex: 1; overflow: hidden; }
.empty { position: fixed; inset: 0; display: grid; place-content: center; text-align: center; color: #6b6257; pointer-events: none; }
.empty button { pointer-events: auto; justify-self: center; padding: 8px 14px; border: 0; border-radius: 10px; background: #c2410c; color: #fff; font-weight: 600; }

/* A note: its color comes from two custom properties set by .note-<color> */
.note { position: absolute; display: flex; flex-direction: column; background: var(--note); border-radius: 4px 4px 16px 4px;
        box-shadow: 0 1px 2px rgba(60, 40, 10, .12), 0 8px 22px rgba(60, 40, 10, .14); overflow: hidden; }
.note-yellow { --note: var(--yellow); --bar: var(--yellow-bar); }
.note-pink   { --note: var(--pink);   --bar: var(--pink-bar); }
.note-blue   { --note: var(--blue);   --bar: var(--blue-bar); }
.note-green  { --note: var(--green);  --bar: var(--green-bar); }
.note.dragging { box-shadow: 0 14px 40px rgba(60, 40, 10, .3); }
.note-bar { display: flex; align-items: center; gap: 4px; padding: 5px 6px 5px 9px; background: var(--bar); cursor: grab; user-select: none; touch-action: none; }
.swatches { display: flex; gap: 6px; }
.swatch { width: 16px; height: 16px; padding: 0; border-radius: 50%; border: 1px solid rgba(0, 0, 0, .28); }
.swatch[aria-checked="true"] { box-shadow: 0 0 0 2px var(--bar), 0 0 0 3.5px #2c2620; }
.swatch-yellow { background: #f7e36b; } .swatch-pink { background: #f9aec6; }
.swatch-blue { background: #a8d0fb; } .swatch-green { background: #a9e5a0; }
.spacer { flex: 1; }
.progress { font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, .55); border-radius: 999px; padding: 0 7px; }
.icon { border: 0; background: none; padding: 3px 6px; border-radius: 6px; font-size: 15px; line-height: 1; opacity: .72; }
.icon:hover:not(:disabled) { opacity: 1; background: rgba(0, 0, 0, .09); }
.icon[aria-pressed="true"] { opacity: 1; background: rgba(0, 0, 0, .12); }
.icon:disabled { opacity: .3; cursor: not-allowed; }
.icon.add { font-size: 20px; font-weight: 600; padding: 0 7px 2px; }
.icon.small { font-size: 11px; }
.icon.delete.confirm { opacity: 1; background: #b42318; color: #fff; font-size: 12px; font-weight: 600; }
.note-content { flex: 1; display: flex; flex-direction: column; overflow: auto; padding: 8px 12px 12px; }
.note-body, .item-text, .add-item input { border: 0; background: transparent; width: 100%; }
.note-body { flex: 1; resize: none; padding: 0; line-height: 1.5; }
.note input:focus, .note textarea:focus { outline: none; }
.checklist { list-style: none; margin: 0; padding: 0; }
.checklist li { display: flex; align-items: center; gap: 7px; padding: 1px 0; }
.checklist li.done .item-text { text-decoration: line-through; opacity: .55; }
.checklist input[type="checkbox"] { width: 16px; height: 16px; accent-color: #2c2620; flex: none; margin: 0; }
.add-item input { padding: 4px 0 4px 23px; font-size: 14px; }
```

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();

// A new empty note. No title: just text (or a checklist), a color, and where it sits.
function createNote(notes, { x = 40, y = 40 } = {}) {
  const t = stamp();
  return { id: uid(), body: '', list: false, checklist: [], color: 'yellow', x, y, w: SIZE.w, h: SIZE.h, created: t, updated: t };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}
```

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions) {

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
  );

  const content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',
      oninput: (e) => actions.text(e.target.value),
    });

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note));
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
}
```

```js go
render();
```

## Step: Four colors, a + button and a limit of three
time: 15

The app keeps the desktop tidy with one rule: **at most three notes**. The rules live with the data, as small functions any part of the app can ask:

| Function | What it answers |
|---|---|
| `canAdd(notes)` | is there room for another note? |
| `freeColor(notes)` | the first of the four colors no note is using |
| `nextPosition(notes)` | a spot for a new note that isn't on top of another one |
| `createNote(notes)` | a new note, or `null` if there are already three |

Each new note takes a **free color**, so three notes always look different. Delete the pink one and the next new note is pink again.

The **+** button on every note calls `addNote()`. When `canAdd()` is false, `renderNote()` gets `canAdd: false` and the + is **disabled**, with a tooltip that says why: "You can have 3 notes at a time. Delete one to make another." A greyed-out button with a reason is friendlier than a click that silently does nothing.

`createNote()` itself refuses a fourth note too. The button is a hint for people; the rule in `createNote()` is what actually enforces it, so no other path (a keyboard shortcut, a bug) can get around it.

### Try it

Press + twice: yellow, then pink, then blue, each one a little lower and to the right. The + buttons turn grey.

check: js | a limit of three | /const\s+MAX_NOTES\s*=\s*3/
check: js | new notes take a free color | /function\s+freeColor\s*\(/
check: js | createNote refuses a fourth note | /if\s*\(\s*!canAdd\(\s*notes\s*\)\s*\)\s*return\s+null/
check: js | the + button is disabled at the limit | /disabled:\s*!canAdd/

quiz: Why does createNote() check the limit when the + button is already disabled?
- [ ] It doesn't need to
- [x] The rule should hold however a note is created, not just through one button
- [ ] Disabled buttons still work
why: The button tells people the rule; the function enforces it for every caller.
quiz: There are yellow and blue notes. What color is the next one?
- [ ] Yellow
- [x] Pink
- [ ] Green
why: freeColor() goes through the list yellow, pink, blue, green and returns the first one nobody is using.

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.
function nextPosition(notes) {
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 36;
    const y = 40 + i * 36;
    if (free(x, y)) return { x, y };
  }
  return { x: 40, y: 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}
```

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions, { canAdd = true } = {}) {

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
    el('button', {
      class: 'icon add', type: 'button', disabled: !canAdd,
      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,
      'aria-label': 'New sticky note',
      onclick: () => actions.add(),
    }, '+'),
  );

  const content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',
      oninput: (e) => actions.text(e.target.value),
    });

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) render();
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
}
```

## Step: Deleting, safely
time: 15

The 🗑 button deletes a note, and deleted notes are gone for good. So deleting a note that has something in it takes **two clicks**: the first turns the button red and says "Delete?", and the second, within three seconds, deletes. An empty note goes on the first click: there's nothing to lose.

`isEmpty(note)` decides: no text, and no checklist item with text. The timer puts the button back to 🗑 if you don't click again, so a stray click never leaves a loaded "Delete?" waiting.

`remove(list, id)` returns the array without that note (`filter` makes a new array, like everything else here). When the last note is gone, `render()` shows the empty message with a **+ New sticky note** button.

| Note | First click | Second click |
|---|---|---|
| empty | deleted | — |
| has text | "Delete?" (red) | deleted |
| has text, no second click | back to 🗑 after 3 seconds | — |

### Try it

Type something in a note and press 🗑 once: it asks. Wait three seconds and it resets. Delete every note to see the empty desk.

check: js | a remove() helper | /const\s+remove\s*=/
check: js | empty notes delete on the first click | /const\s+isEmpty\s*=/
check: js | a second click confirms | /classList\.contains\(\s*['"]confirm['"]\s*\)/
check: js | the empty message shows when there are no notes | /getElementById\(\s*['"]empty['"]\s*\)\.hidden/

quiz: Why does an empty note delete on the first click?
- [x] There's nothing to lose, so asking would just be in the way
- [ ] Empty notes can't show "Delete?"
- [ ] It's a bug
why: Confirmation is for protecting work; with no work, one click is kinder.
quiz: Why does "Delete?" go back to 🗑 after three seconds?
- [ ] To save memory
- [x] So a click much later, maybe by accident, doesn't delete a note you forgot was armed
- [ ] The browser requires it
why: A confirmation should be fresh; an old armed button is a trap.

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.
function nextPosition(notes) {
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 36;
    const y = 40 + i * 36;
    if (free(x, y)) return { x, y };
  }
  return { x: 40, y: 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}

const remove = (list, id) => list.filter((x) => x.id !== id);

// True when the note has nothing in it, so deleting it needs no second click.
const isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());
```

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions, { canAdd = true } = {}) {

  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing
  let confirmTimer = null;
  const del = el('button', {
    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',
    onclick: () => {
      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }
      del.classList.add('confirm');
      del.textContent = 'Delete?';
      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);
    },
  }, '🗑');

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
    el('button', {
      class: 'icon add', type: 'button', disabled: !canAdd,
      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,
      'aria-label': 'New sticky note',
      onclick: () => actions.add(),
    }, '+'),
    del,
  );

  const content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',
      oninput: (e) => actions.text(e.target.value),
    });

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) render();
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Session: Checklists

## Step: Turning a note into a checklist
time: 15

The ☑ button switches a note between text and a checklist. The promise: **switching never loses anything you typed.**

```svg Lines become checklist items, and items become lines again
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 150" font-family="sans-serif"><rect x="15" y="20" width="150" height="90" rx="4" fill="#fff3a3" stroke="#d6c25a"/><text x="25" y="42" font-size="12">body:</text><text x="25" y="60" font-size="12">"Milk</text><text x="25" y="76" font-size="12"> Eggs</text><text x="25" y="92" font-size="12"> Bread"</text><rect x="265" y="20" width="150" height="90" rx="4" fill="#fff3a3" stroke="#d6c25a"/><text x="275" y="42" font-size="12">checklist:</text><text x="275" y="60" font-size="12">☐ Milk</text><text x="275" y="76" font-size="12">☐ Eggs</text><text x="275" y="92" font-size="12">☐ Bread</text><line x1="170" y1="52" x2="258" y2="52" stroke="#1d4ed8" stroke-width="2"/><text x="214" y="46" text-anchor="middle" font-size="11" fill="#1d4ed8">☑ on: each line → an item</text><line x1="258" y1="82" x2="170" y2="82" stroke="#16a34a" stroke-width="2"/><text x="214" y="98" text-anchor="middle" font-size="11" fill="#16a34a">☑ off: items → lines</text><text x="215" y="134" text-anchor="middle" font-size="11" fill="#475569">switching back and forth never loses anything you typed</text></svg>
```

`setList(note, on)`:

- **On:** split the text into lines, trim them, drop the blank ones, and turn each into an item `{ id, text, done: false }`. The body becomes empty.
- **Off:** join the items' text back into lines (after any text already in the body). The checklist becomes empty.
- Already in that mode: return the same note unchanged.

Each item gets its own `id`. That matters in the next step: ticking or editing an item finds it by id, not by its position in the list, so nothing goes wrong if items are removed in between.

`renderNote()` now has two kinds of content: the `<textarea>`, or a `<ul class="checklist">`. For this step the items are read-only text; ticking and editing come next. The ☑ button has `aria-pressed`, so screen readers announce whether checklist mode is on, and CSS gives it a pressed look.

### Try it

Type three lines ("Milk", "Eggs", "Bread"), press ☑: three items. Press ☑ again: three lines.

check: js | a setList() function | /function\s+setList\s*\(/
check: js | each line becomes an item | /lines\.map\(\s*\(\s*text\s*\)\s*=>\s*\(\s*\{\s*id:\s*uid\(\)/
check: js | items go back into lines | /\.join\(\s*['"]\\n['"]\s*\)/
check: js | the ☑ button | /actions\.list\(\s*!note\.list\s*\)/

quiz: A note says "Milk\n\n  Eggs ". How many checklist items does ☑ make?
- [ ] Three: Milk, an empty one and Eggs
- [x] Two: Milk and Eggs
- [ ] One: the whole text
why: Lines are trimmed and blank ones are dropped, so only the two real lines become items.
quiz: Why does each checklist item have its own id?
- [x] So ticking or editing finds the right item even after others are removed
- [ ] Ids make the list sort itself
- [ ] The browser needs ids for checkboxes
why: Positions change when items come and go; an id always points at the same item.

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.
function nextPosition(notes) {
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 36;
    const y = 40 + i * 36;
    if (free(x, y)) return { x, y };
  }
  return { x: 40, y: 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}

const remove = (list, id) => list.filter((x) => x.id !== id);

// True when the note has nothing in it, so deleting it needs no second click.
const isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());

// Turns the checklist on or off without losing anything: lines become items, and items become lines again.
function setList(note, on) {
  if (on === note.list) return note;
  if (on) {
    const lines = note.body.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];
    return updateNote(note, { list: true, checklist: items, body: '' });
  }
  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\n');
  const body = [note.body.trim(), text].filter(Boolean).join('\n');
  return updateNote(note, { list: false, checklist: [], body });
}
```

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions, { canAdd = true } = {}) {

  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing
  let confirmTimer = null;
  const del = el('button', {
    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',
    onclick: () => {
      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }
      del.classList.add('confirm');
      del.textContent = 'Delete?';
      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);
    },
  }, '🗑');

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
    el('button', {
      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',
      'aria-label': 'Checklist', 'aria-pressed': String(note.list),
      onclick: () => actions.list(!note.list),
    }, '☑'),
    el('button', {
      class: 'icon add', type: 'button', disabled: !canAdd,
      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,
      'aria-label': 'New sticky note',
      onclick: () => actions.add(),
    }, '+'),
    del,
  );

  let content;
  if (!note.list) {
    content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',
      oninput: (e) => actions.text(e.target.value),
    });
  } else {
    // the items, read-only for now: ticking and editing come in the next step
    content = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', {}, el('span', { class: 'item-text' }, item.text))));
  }

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) render();
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Step: Ticking, editing and adding items
time: 20

Now the checklist works. Each item is a row with a checkbox, a text field and a small ✕, and below the list is a "+ Add an item" field.

| Action | Function | Redraw? |
|---|---|---|
| tick or untick | `toggleItem(note, id)` | yes, to cross it out |
| type in an item | `editItem(note, id, text)` | no (keep the cursor) |
| ✕ | `removeItem(note, id)` | yes |
| Enter in "Add an item" | `addItem(note, text)` | yes |

Every one of these returns a new note with a **new checklist array**, made with `map` or `filter` (or `[...old, newItem]`). The item being changed becomes a new object too: `{ ...i, done: !i.done }`.

`progress(note)` counts done items, and the bar shows a little badge like **1/3**. Done items are crossed out with CSS (`li.done .item-text`).

The add field is a `<form>`, so pressing Enter submits it; `e.preventDefault()` stops the browser from reloading the page, which is what forms do by default.

### Try it

Make a checklist, tick an item, add one with Enter. Notice that after adding, your cursor isn't in the add field any more: you'd have to click it again for every item. That's what the next step fixes.

check: js | tick and untick | /const\s+toggleItem\s*=/
check: js | an addItem() function | /function\s+addItem\s*\(/
check: js | a done count | /function\s+progress\s*\(/
check: js | Enter doesn't reload the page | /e\.preventDefault\(\)\s*;\s*if\s*\(\s*addInput\.value\.trim\(\)\s*\)/

quiz: Why does editing an item's text not redraw the note, while ticking it does?
- [x] Ticking changes how the item looks (crossed out); redrawing while you type would knock the cursor out of the field
- [ ] Text can't be redrawn
- [ ] Ticking is slower
why: Text fields already show what you typed; only changes the page must display need a redraw.
quiz: What does e.preventDefault() do in the add-item form?
- [ ] Clears the field
- [x] Stops the form's default action, which is to submit and reload the page
- [ ] Prevents empty items
why: Forms submit by reloading; the app handles Enter itself instead.

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.
function nextPosition(notes) {
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 36;
    const y = 40 + i * 36;
    if (free(x, y)) return { x, y };
  }
  return { x: 40, y: 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}

const remove = (list, id) => list.filter((x) => x.id !== id);

// True when the note has nothing in it, so deleting it needs no second click.
const isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());

// Turns the checklist on or off without losing anything: lines become items, and items become lines again.
function setList(note, on) {
  if (on === note.list) return note;
  if (on) {
    const lines = note.body.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];
    return updateNote(note, { list: true, checklist: items, body: '' });
  }
  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\n');
  const body = [note.body.trim(), text].filter(Boolean).join('\n');
  return updateNote(note, { list: false, checklist: [], body });
}

// Checklist items: each change returns a new note with a new checklist array.
function addItem(note, text) {
  const clean = text.trim();
  if (!clean) return note;
  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });
}
const toggleItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });
const editItem = (note, itemId, text) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });
const removeItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });

function progress(note) {
  const total = note.checklist.length;
  const done = note.checklist.filter((i) => i.done).length;
  return { done, total, label: total ? `${done}/${total}` : '' };
}
```

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions, { canAdd = true } = {}) {
  const p = progress(note);

  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing
  let confirmTimer = null;
  const del = el('button', {
    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',
    onclick: () => {
      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }
      del.classList.add('confirm');
      del.textContent = 'Delete?';
      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);
    },
  }, '🗑');

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
    p.total ? el('span', { class: 'progress', title: 'Checklist items done' }, p.label) : null,
    el('button', {
      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',
      'aria-label': 'Checklist', 'aria-pressed': String(note.list),
      onclick: () => actions.list(!note.list),
    }, '☑'),
    el('button', {
      class: 'icon add', type: 'button', disabled: !canAdd,
      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,
      'aria-label': 'New sticky note',
      onclick: () => actions.add(),
    }, '+'),
    del,
  );

  let content;
  if (!note.list) {
    content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',
      oninput: (e) => actions.text(e.target.value),
    });
  } else {
    const list = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', { class: item.done ? 'done' : '' },
      el('input', { type: 'checkbox', checked: item.done, 'aria-label': `Done: ${item.text}`, onchange: () => actions.toggleItem(item.id) }),
      el('input', { class: 'item-text', type: 'text', value: item.text, maxLength: 500, 'aria-label': 'Checklist item', oninput: (e) => actions.editItem(item.id, e.target.value) }),
      el('button', { class: 'icon small', type: 'button', title: 'Remove item', 'aria-label': `Remove ${item.text}`, onclick: () => actions.removeItem(item.id) }, '✕'),
    )));
    const addInput = el('input', { type: 'text', placeholder: '+ Add an item', 'aria-label': 'Add a checklist item', maxLength: 500 });
    const add = el('form', {
      class: 'add-item',
      onsubmit: (e) => { e.preventDefault(); if (addInput.value.trim()) actions.addItem(addInput.value); },
    }, addInput);
    content = el('div', { class: 'list-wrap' }, list, add);
  }

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) render();
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Step: Keeping your cursor when the page redraws
time: 10

Redrawing from data is simple and reliable, but it has one cost: every element is new, so the field you were typing in is gone, and so is your cursor. The fix is small and general.

```svg keepFocus(): remember the field and cursor, redraw, then put them back
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 428 115" font-family="sans-serif"><rect x="8" y="20" width="130" height="56" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="73" y="40" text-anchor="middle" font-size="10">remember the focused</text><text x="73" y="53" text-anchor="middle" font-size="10">field's data-focus</text><text x="73" y="66" text-anchor="middle" font-size="10">key and cursor</text><line x1="138" y1="48" x2="148" y2="48" stroke="#475569" stroke-width="2"/><rect x="148" y="20" width="130" height="56" rx="6" fill="#fef9c3" stroke="#475569"/><text x="213" y="40" text-anchor="middle" font-size="10">redraw the note</text><line x1="278" y1="48" x2="288" y2="48" stroke="#475569" stroke-width="2"/><rect x="288" y="20" width="130" height="56" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="353" y="40" text-anchor="middle" font-size="10">find the new field</text><text x="353" y="53" text-anchor="middle" font-size="10">with the same key,</text><text x="353" y="66" text-anchor="middle" font-size="10">put the cursor back</text><text x="214" y="102" text-anchor="middle" font-size="11" fill="#475569">keys like "note-id:item-3" stay the same across redraws, so the right field gets focus back</text></svg>
```

1. Every field that can have focus gets a **stable key** in `data-focus`, like `"3f9c…:add"` or `"3f9c…:item-7a1e…"`: the note's id plus which field it is. The key is the same on every redraw.
2. `keepFocus(render)` reads `document.activeElement`'s key and its cursor position (`selectionStart`, `selectionEnd`) **before** redrawing.
3. After redrawing, it finds the new element with the same key, focuses it, and puts the cursor back.

`CSS.escape()` makes the key safe to use inside a selector. `update()` now calls `keepFocus(render)` instead of `render()`, so every redraw keeps the cursor without any other code knowing about it.

### Try it

Add three items in a row by typing and pressing Enter: the cursor stays in the add field. Tick an item with the keyboard (Tab to it, press Space): focus stays on the checkbox.

check: js | fields have stable focus keys | /dataset:\s*\{\s*focus:\s*key\(/
check: js | a keepFocus() function | /function\s+keepFocus\s*\(/
check: js | the cursor position is remembered | /selectionStart/
check: js | every redraw keeps focus | /keepFocus\(\s*render\s*\)/

quiz: Why does each field need a key that stays the same across redraws?
- [x] The redrawn field is a brand-new element, so the key is the only way to find "the same" field again
- [ ] Keys make fields faster
- [ ] Browsers need data attributes
why: Element references die with the old elements; a key made from the note id and the field name survives.
quiz: Why does keepFocus() wrap render instead of each button handling focus itself?
- [x] One place handles focus for every change, so new buttons get it for free
- [ ] Buttons can't set focus
- [ ] It's required by CSS.escape
why: update() calls keepFocus(render), so the whole app benefits without repeating code.

```js view
// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.
// What people type only ever goes in through .value or text nodes, never as HTML.
function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  node.append(...children.filter((c) => c != null && c !== false));
  return node;
}

const COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };

// Draws one note: the bar across the top, then the text or the checklist.
function renderNote(note, actions, { canAdd = true } = {}) {
  const key = (part) => `${note.id}:${part}`;   // stays the same every time the note is redrawn
  const p = progress(note);

  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing
  let confirmTimer = null;
  const del = el('button', {
    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',
    onclick: () => {
      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }
      del.classList.add('confirm');
      del.textContent = 'Delete?';
      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);
    },
  }, '🗑');

  const bar = el('header', { class: 'note-bar' },
    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },
      ...COLORS.map((c) => el('button', {
        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',
        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],
        onclick: () => actions.color(c),
      }))),
    el('span', { class: 'spacer' }),
    p.total ? el('span', { class: 'progress', title: 'Checklist items done' }, p.label) : null,
    el('button', {
      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',
      'aria-label': 'Checklist', 'aria-pressed': String(note.list), dataset: { focus: key('list') },
      onclick: () => actions.list(!note.list),
    }, '☑'),
    el('button', {
      class: 'icon add', type: 'button', disabled: !canAdd,
      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,
      'aria-label': 'New sticky note',
      onclick: () => actions.add(),
    }, '+'),
    del,
  );

  let content;
  if (!note.list) {
    content = el('textarea', {
      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text', dataset: { focus: key('body') },
      oninput: (e) => actions.text(e.target.value),
    });
  } else {
    const list = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', { class: item.done ? 'done' : '' },
      el('input', { type: 'checkbox', checked: item.done, 'aria-label': `Done: ${item.text}`, dataset: { focus: key(`check-${item.id}`) }, onchange: () => actions.toggleItem(item.id) }),
      el('input', { class: 'item-text', type: 'text', value: item.text, maxLength: 500, 'aria-label': 'Checklist item', dataset: { focus: key(`item-${item.id}`) }, oninput: (e) => actions.editItem(item.id, e.target.value) }),
      el('button', { class: 'icon small', type: 'button', title: 'Remove item', 'aria-label': `Remove ${item.text}`, onclick: () => actions.removeItem(item.id) }, '✕'),
    )));
    const addInput = el('input', { type: 'text', placeholder: '+ Add an item', 'aria-label': 'Add a checklist item', maxLength: 500, dataset: { focus: key('add') } });
    const add = el('form', {
      class: 'add-item',
      onsubmit: (e) => { e.preventDefault(); if (addInput.value.trim()) actions.addItem(addInput.value); },
    }, addInput);
    content = el('div', { class: 'list-wrap' }, list, add);
  }

  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },
    bar, el('div', { class: 'note-content' }, content));
}

// Redrawing replaces every element, which would drop the cursor. Remember where it was and put it back.
function keepFocus(rerender) {
  const active = document.activeElement;
  const focusKey = active?.dataset?.focus;
  const sel = focusKey && 'selectionStart' in active ? [active.selectionStart, active.selectionEnd] : null;
  rerender();
  if (!focusKey) return;
  const again = document.querySelector(`[data-focus="${CSS.escape(focusKey)}"]`);
  if (!again) return;
  again.focus({ preventScroll: true });
  if (sel && again.setSelectionRange && again.type !== 'checkbox') {
    try { again.setSelectionRange(...sel); } catch { /* not a text field */ }
  }
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) keepFocus(render);
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Session: Move and resize

## Step: Dragging a note by its top bar
time: 20

Notes are dragged by their colored top bar, using **pointer events**, which work the same for a mouse, a pen and a finger.

```svg Dragging: remember where it started, move by how far the pointer went, save on release
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 160" font-family="sans-serif"><rect x="20" y="30" width="110" height="80" rx="4" fill="#cfe6ff" stroke="#7aa6d6" stroke-dasharray="4 3"/><rect x="20" y="30" width="110" height="18" fill="#a8d0fb" opacity="0.6"/><rect x="200" y="60" width="110" height="80" rx="4" fill="#cfe6ff" stroke="#5a7a9a"/><rect x="200" y="60" width="110" height="18" fill="#a8d0fb"/><circle cx="60" cy="39" r="4" fill="#1d4ed8"/><circle cx="240" cy="69" r="4" fill="#1d4ed8"/><line x1="64" y1="41" x2="236" y2="67" stroke="#1d4ed8" stroke-width="2" stroke-dasharray="5 3"/><text x="40" y="22" font-size="11">pointerdown: remember start</text><text x="150" y="44" font-size="11" fill="#1d4ed8">pointermove: left = start + (now - start)</text><text x="320" y="100" font-size="11">pointerup:</text><text x="320" y="114" font-size="11">save x and y</text><text x="215" y="154" text-anchor="middle" font-size="11" fill="#475569">setPointerCapture keeps the moves coming even if the pointer slips off the bar</text></svg>
```

| Event | What happens |
|---|---|
| `pointerdown` on the bar | ignore it if it's a button or not the main mouse button; bring the note to the front; remember where the pointer and the note started |
| `pointermove` | new position = start position + how far the pointer has moved, kept inside the desk |
| `pointerup` / `pointercancel` | save the new `x` and `y` |

Three details make it feel right:

- **`setPointerCapture()`** sends every move to the bar until you let go, even if the pointer races ahead of the note or leaves the window.
- **Clamping** with `Math.max(0, Math.min(…))` keeps the note on the desk, so it can never be dragged out of reach.
- **`toFront()`** moves the note to the end of the array, and the last note is drawn on top. During the drag, `desk.append(card)` moves the element to the end too, without a full redraw.

The note moves by setting `card.style.left` and `top` directly during the drag; only on release does the data change (with no redraw, since the note is already where it should be). CSS `touch-action: none` on the bar stops a phone from scrolling the page instead of dragging.

### Try it

Drag notes around and stack them; the one you drag comes to the front.

check: js | a draggable() function | /function\s+draggable\s*\(/
check: js | moves follow the pointer even off the bar | /setPointerCapture\(\s*e\.pointerId\s*\)/
check: js | the note stays on the desk | /Math\.max\(\s*0\s*,\s*Math\.min\(/
check: js | the dragged note comes to the front | /function\s+toFront\s*\(/

quiz: What does setPointerCapture() fix?
- [x] Moving the pointer quickly off the bar would otherwise stop the drag
- [ ] It makes the note snap to a grid
- [ ] It saves the position
why: With capture, every move goes to the bar until the pointer is released, wherever it is.
quiz: Why is the data only updated on pointerup, not on every pointermove?
- [x] Moving the element directly is enough while dragging; one save at the end avoids dozens of updates per second
- [ ] pointermove can't change data
- [ ] To make dragging slower
why: The style follows the pointer cheaply, and the final position is recorded once.

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.
function nextPosition(notes) {
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  for (let i = 0; i < 12; i++) {
    const x = 40 + i * 36;
    const y = 40 + i * 36;
    if (free(x, y)) return { x, y };
  }
  return { x: 40, y: 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}

const remove = (list, id) => list.filter((x) => x.id !== id);

// True when the note has nothing in it, so deleting it needs no second click.
const isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());

// Turns the checklist on or off without losing anything: lines become items, and items become lines again.
function setList(note, on) {
  if (on === note.list) return note;
  if (on) {
    const lines = note.body.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];
    return updateNote(note, { list: true, checklist: items, body: '' });
  }
  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\n');
  const body = [note.body.trim(), text].filter(Boolean).join('\n');
  return updateNote(note, { list: false, checklist: [], body });
}

// Checklist items: each change returns a new note with a new checklist array.
function addItem(note, text) {
  const clean = text.trim();
  if (!clean) return note;
  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });
}
const toggleItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });
const editItem = (note, itemId, text) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });
const removeItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });

function progress(note) {
  const total = note.checklist.length;
  const done = note.checklist.filter((i) => i.done).length;
  return { done, total, label: total ? `${done}/${total}` : '' };
}

// Brings a note to the front: the last one in the list is drawn on top.
function toFront(notes, id) {
  const note = notes.find((n) => n.id === id);
  return note ? [...remove(notes, id), note] : notes;
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

const area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) keepFocus(render);
}

function addNote(fromId) {
  const note = createNote(notes);
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

// Dragging a note by its top bar (but not by its buttons).
function draggable(card, note) {
  const bar = card.querySelector('.note-bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    notes = toFront(notes, note.id);
    desk.append(card);                                   // on top while dragging
    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };
    card.classList.add('dragging');
    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar
    const move = (ev) => {
      const a = area();
      // keep the whole note on the desk
      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));
      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    };
    const up = () => {
      card.classList.remove('dragging');
      bar.removeEventListener('pointermove', move);
      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up, { once: true });
    bar.addEventListener('pointercancel', up, { once: true });
  });
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    draggable(card, note);
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Step: Resizing, and where new notes go
time: 15

**Resizing** needs almost no code: CSS `resize: both` makes the browser draw a grip in the note's bottom corner, and `min-width` / `min-height` stop a note getting too small to use. The app only has to *notice* the new size, and that's what a **`ResizeObserver`** is for: it calls back whenever the element's size changes, whatever caused it.

The observer compares the card's size with the saved `w` and `h`, and saves only when they differ by more than a pixel. Rounding means tiny differences come up all the time; without that check, every redraw would trigger a save.

**Placing new notes.** Now that notes can be anywhere, cascading from the top-left isn't good enough. `nextPosition()` gets the note the + was pressed on (`from`) and the visible `area`, and tries, in order:

| Try | Where |
|---|---|
| 1 | to the right of that note |
| 2 | below it |
| 3 | to its left |
| 4 | slightly down and right of it |
| then | the cascade from the top-left |

Each spot must **fit** in the visible area and be **free** (not within 40 pixels of another note). That's the same function the desktop app uses, with the screen as the area; it even works on a second monitor, because the area can start at any `x` and `y`.

### Try it

Resize a note from its corner, then press + on it: the new note appears beside it. Move a note to the right edge and press +: the new one goes below instead.

check: css | the browser's resize grip | /resize:\s*both/ | Add .note { resize: both; min-width: 200px; min-height: 160px; }
check: js | new sizes are noticed | /new\s+ResizeObserver\(/
check: js | new notes try the spot beside the one + was pressed on | /from\.x\s*\+\s*from\.w\s*\+\s*gap/
check: js | they must fit on screen | /const\s+fits\s*=/

quiz: Why does the ResizeObserver ignore differences of a pixel or less?
- [x] Rounding makes tiny differences constantly, and saving each one would cause a stream of pointless saves
- [ ] Pixels can't be compared
- [ ] ResizeObserver is inaccurate
why: Only real resizes should be saved.
quiz: A note sits at the right edge of the screen. Where does + put the new note?
- [ ] Off screen to the right
- [x] Below it, because "to the right" doesn't fit
- [ ] On top of it
why: Each candidate spot is checked with fits() and free(); the first that passes wins.

```css base
* { box-sizing: border-box; }
:root {
  --yellow: #fff3a3; --yellow-bar: #f7e36b;
  --pink: #ffd3e1;   --pink-bar: #f9aec6;
  --blue: #cfe6ff;   --blue-bar: #a8d0fb;
  --green: #d4f5cf;  --green-bar: #a9e5a0;
}
body { margin: 0; height: 100vh; display: flex; flex-direction: column; font: 15px/1.45 system-ui, sans-serif; background: #ece6da; color: #2c2620; }
button, input, textarea { font: inherit; color: inherit; }
button { cursor: pointer; }
[hidden] { display: none !important; }
.top { padding: 8px 16px; }
.top h1 { margin: 0; font-size: 1.2rem; }
.muted { margin: 2px 0 0; color: #6b6257; font-size: 13px; }
.desk { position: relative; flex: 1; overflow: hidden; }
.empty { position: fixed; inset: 0; display: grid; place-content: center; text-align: center; color: #6b6257; pointer-events: none; }
.empty button { pointer-events: auto; justify-self: center; padding: 8px 14px; border: 0; border-radius: 10px; background: #c2410c; color: #fff; font-weight: 600; }

/* A note: its color comes from two custom properties set by .note-<color> */
.note { position: absolute; display: flex; flex-direction: column; background: var(--note); border-radius: 4px 4px 16px 4px;
        box-shadow: 0 1px 2px rgba(60, 40, 10, .12), 0 8px 22px rgba(60, 40, 10, .14); overflow: hidden; }
.note-yellow { --note: var(--yellow); --bar: var(--yellow-bar); }
.note-pink   { --note: var(--pink);   --bar: var(--pink-bar); }
.note-blue   { --note: var(--blue);   --bar: var(--blue-bar); }
.note-green  { --note: var(--green);  --bar: var(--green-bar); }
.note.dragging { box-shadow: 0 14px 40px rgba(60, 40, 10, .3); }
.note-bar { display: flex; align-items: center; gap: 4px; padding: 5px 6px 5px 9px; background: var(--bar); cursor: grab; user-select: none; touch-action: none; }
.swatches { display: flex; gap: 6px; }
.swatch { width: 16px; height: 16px; padding: 0; border-radius: 50%; border: 1px solid rgba(0, 0, 0, .28); }
.swatch[aria-checked="true"] { box-shadow: 0 0 0 2px var(--bar), 0 0 0 3.5px #2c2620; }
.swatch-yellow { background: #f7e36b; } .swatch-pink { background: #f9aec6; }
.swatch-blue { background: #a8d0fb; } .swatch-green { background: #a9e5a0; }
.spacer { flex: 1; }
.progress { font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, .55); border-radius: 999px; padding: 0 7px; }
.icon { border: 0; background: none; padding: 3px 6px; border-radius: 6px; font-size: 15px; line-height: 1; opacity: .72; }
.icon:hover:not(:disabled) { opacity: 1; background: rgba(0, 0, 0, .09); }
.icon[aria-pressed="true"] { opacity: 1; background: rgba(0, 0, 0, .12); }
.icon:disabled { opacity: .3; cursor: not-allowed; }
.icon.add { font-size: 20px; font-weight: 600; padding: 0 7px 2px; }
.icon.small { font-size: 11px; }
.icon.delete.confirm { opacity: 1; background: #b42318; color: #fff; font-size: 12px; font-weight: 600; }
.note-content { flex: 1; display: flex; flex-direction: column; overflow: auto; padding: 8px 12px 12px; }
.note-body, .item-text, .add-item input { border: 0; background: transparent; width: 100%; }
.note-body { flex: 1; resize: none; padding: 0; line-height: 1.5; }
.note input:focus, .note textarea:focus { outline: none; }
.checklist { list-style: none; margin: 0; padding: 0; }
.checklist li { display: flex; align-items: center; gap: 7px; padding: 1px 0; }
.checklist li.done .item-text { text-decoration: line-through; opacity: .55; }
.checklist input[type="checkbox"] { width: 16px; height: 16px; accent-color: #2c2620; flex: none; margin: 0; }
.add-item input { padding: 4px 0 4px 23px; font-size: 14px; }

/* The browser draws a resize grip in the bottom corner; min sizes keep the note usable */
.note { resize: both; min-width: 200px; min-height: 160px; }
```

```js notes
// Sticky notes are plain objects, changed only through these functions.
const COLORS = ['yellow', 'pink', 'blue', 'green'];
const SIZE = { w: 260, h: 260, minW: 200, minH: 160 };
const uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
const stamp = () => new Date().toISOString();
const MAX_NOTES = 3;
const canAdd = (notes) => notes.length < MAX_NOTES;

// The first color no other note is using, so three notes are easy to tell apart.
function freeColor(notes) {
  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];
}

// Where a new note goes: beside the note + was pressed on (right, then below, then left), or cascading
// from the top-left. `area` is the visible space, so a new note never lands off screen.
function nextPosition(notes, { from, area = { x: 0, y: 0, width: 1200, height: 800 } } = {}) {
  const gap = 24;
  const fits = (x, y) => x >= area.x && y >= area.y && x + SIZE.w <= area.x + area.width && y + SIZE.h <= area.y + area.height;
  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);
  if (from) {
    const tries = [[from.x + from.w + gap, from.y], [from.x, from.y + from.h + gap], [from.x - SIZE.w - gap, from.y], [from.x + 40, from.y + 40]];
    for (const [x, y] of tries) if (fits(x, y) && free(x, y)) return { x, y };
  }
  for (let i = 0; i < 12; i++) {
    const x = area.x + 40 + i * 36;
    const y = area.y + 40 + i * 36;
    if (fits(x, y) && free(x, y)) return { x, y };
  }
  return { x: area.x + 40, y: area.y + 40 };
}

// A new empty note, or null when three already exist.
function createNote(notes, options = {}) {
  if (!canAdd(notes)) return null;
  const t = stamp();
  return {
    id: uid(), body: '', list: false, checklist: [],
    color: freeColor(notes),
    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,
  };
}

// Returns a changed COPY of the note, with its size and position kept at usable values.
function updateNote(note, patch) {
  const next = { ...note, ...patch, updated: stamp() };
  next.x = Math.round(next.x);
  next.y = Math.round(next.y);
  next.w = Math.max(SIZE.minW, Math.round(next.w));
  next.h = Math.max(SIZE.minH, Math.round(next.h));
  if (!COLORS.includes(next.color)) next.color = note.color;
  return next;
}

const remove = (list, id) => list.filter((x) => x.id !== id);

// True when the note has nothing in it, so deleting it needs no second click.
const isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());

// Turns the checklist on or off without losing anything: lines become items, and items become lines again.
function setList(note, on) {
  if (on === note.list) return note;
  if (on) {
    const lines = note.body.split('\n').map((l) => l.trim()).filter(Boolean);
    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];
    return updateNote(note, { list: true, checklist: items, body: '' });
  }
  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\n');
  const body = [note.body.trim(), text].filter(Boolean).join('\n');
  return updateNote(note, { list: false, checklist: [], body });
}

// Checklist items: each change returns a new note with a new checklist array.
function addItem(note, text) {
  const clean = text.trim();
  if (!clean) return note;
  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });
}
const toggleItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });
const editItem = (note, itemId, text) =>
  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });
const removeItem = (note, itemId) =>
  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });

function progress(note) {
  const total = note.checklist.length;
  const done = note.checklist.filter((i) => i.done).length;
  return { done, total, label: total ? `${done}/${total}` : '' };
}

// Brings a note to the front: the last one in the list is drawn on top.
function toFront(notes, id) {
  const note = notes.find((n) => n.id === id);
  return note ? [...remove(notes, id), note] : notes;
}
```

```js ui
const desk = document.getElementById('desk');
let notes = [createNote([])];

const area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  if (rerender) keepFocus(render);
}

function addNote(fromId) {
  const from = notes.find((n) => n.id === fromId);
  const note = createNote(notes, { from, area: area() });
  if (!note) return;                     // already three
  notes = [...notes, note];
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

// Dragging a note by its top bar (but not by its buttons).
function draggable(card, note) {
  const bar = card.querySelector('.note-bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    notes = toFront(notes, note.id);
    desk.append(card);                                   // on top while dragging
    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };
    card.classList.add('dragging');
    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar
    const move = (ev) => {
      const a = area();
      // keep the whole note on the desk
      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));
      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    };
    const up = () => {
      card.classList.remove('dragging');
      bar.removeEventListener('pointermove', move);
      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up, { once: true });
    bar.addEventListener('pointercancel', up, { once: true });
  });
  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes
  new ResizeObserver(() => {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const current = notes.find((n) => n.id === note.id);
    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {
      update(note.id, (n) => updateNote(n, { w, h }), false);
    }
  }).observe(card);
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    draggable(card, note);
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Session: Remembering your notes

## Step: Saving in localStorage
time: 15

Notes should still be there tomorrow. The browser version keeps them in **`localStorage`**: a small store of text, per website, that survives closing the tab.

- `save()` writes `{ app, version, notes }` as JSON. It waits **250 milliseconds** after the last change (`clearTimeout` + `setTimeout`), so typing a sentence writes once, not once per key. This is called **debouncing**.
- `load()` reads it back. If there's nothing saved, the app starts with one welcome note.
- `update()`, `addNote()` and `removeNote()` all call `save()`.

**Storage can fail**, so both are wrapped in `try`/`catch`. Private browsing, a full disk, a browser setting or a sandboxed page can all make `localStorage` throw. When it does, the app keeps working in memory instead of breaking.

This editor's preview is exactly one of those cases: it runs your page in a sandbox where storage is blocked, so here the notes reset when the preview reloads, and nothing crashes. To see them remembered, run your finished page from a file or a local server, or try the [live demo](https://theoyanvno.github.io/sticky-notes/app/).

The saved object has a `version` number. That's for the future: if the format ever changes, the app can tell an old file from a new one (the real app does exactly that with notes from version 1.0).

check: js | a save() function | /function\s+save\s*\(/
check: js | saving waits for a pause | /clearTimeout\(\s*saveTimer\s*\)/
check: js | notes are written to localStorage | /localStorage\.setItem\(/
check: js | notes load at start | /let\s+notes\s*=\s*load\(\)/

quiz: Why does save() wait 250 ms instead of saving on every change?
- [x] Typing makes a change per key; waiting for a pause writes once per burst instead
- [ ] localStorage only works every 250 ms
- [ ] To lose fewer notes
why: That's debouncing: each new change restarts the timer.
quiz: What happens in this guide's preview when localStorage is blocked?
- [ ] The page crashes
- [x] The catch block keeps the app working in memory; notes just aren't remembered
- [ ] The notes are saved somewhere else
why: Code that might fail for reasons outside your control should fail gracefully.

```js storage
const KEY = 'sticky-notes-guide';
let saveTimer = null;

// Saves a quarter of a second after the last change, so typing doesn't write on every key.
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ app: 'sticky-notes', version: 2, notes }));
    } catch { /* storage blocked (private mode, a sandbox): keep working in memory */ }
  }, 250);
}

function load() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved).notes;
  } catch { /* blocked or damaged: start fresh */ }
  const first = createNote([]);
  return [{ ...first, body: 'Hi! Pick a color at the top, ☑ makes a checklist, + makes another note (up to 3).' }];
}
```

```js ui
const desk = document.getElementById('desk');
let notes = load();

const area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  save();
  if (rerender) keepFocus(render);
}

function addNote(fromId) {
  const from = notes.find((n) => n.id === fromId);
  const note = createNote(notes, { from, area: area() });
  if (!note) return;                     // already three
  notes = [...notes, note];
  save();
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  save();
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

// Dragging a note by its top bar (but not by its buttons).
function draggable(card, note) {
  const bar = card.querySelector('.note-bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    notes = toFront(notes, note.id);
    desk.append(card);                                   // on top while dragging
    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };
    card.classList.add('dragging');
    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar
    const move = (ev) => {
      const a = area();
      // keep the whole note on the desk
      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));
      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    };
    const up = () => {
      card.classList.remove('dragging');
      bar.removeEventListener('pointermove', move);
      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up, { once: true });
    bar.addEventListener('pointercancel', up, { once: true });
  });
  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes
  new ResizeObserver(() => {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const current = notes.find((n) => n.id === note.id);
    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {
      update(note.id, (n) => updateNote(n, { w, h }), false);
    }
  }).observe(card);
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    draggable(card, note);
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
```

## Step: Never trust saved data
time: 15

Whatever comes out of storage might be old, edited by hand, or damaged. Instead of trusting it, **`normalize()`** rebuilds clean data from anything:

| Problem | What `cleanNote()` does |
|---|---|
| missing or strange id | drops the note |
| text that isn't a string, or is huge | empty string, or cut to 20,000 characters |
| unknown color | the first color |
| position or size out of range, or not a number | clamped, or a default |
| checklist items without ids | dropped; at most 500 kept |
| the same note twice | only the first is kept |
| more than three notes | the three edited most recently stay |

Helpers make each rule one line: `text()` for strings, `num()` for clamped numbers, `validId()` for ids (letters, digits, `_` and `-`, up to 64). `load()` now returns `normalize(JSON.parse(saved)).notes`, so the rest of the app can assume every note is valid.

**Other tabs.** If the app is open in two tabs, a change in one should show in the other. The browser fires a **`storage`** event in every *other* tab when `localStorage` changes, so the app listens for its own key and reloads its notes.

### Try it

In the console, try `normalize({ notes: [{ id: 'a', color: 'purple', x: 1e9 }, { id: 'a' }, null] })`: one note, yellow, with `x` clamped to 5,000.

check: js | a normalize() function | /function\s+normalize\s*\(/
check: js | numbers are clamped | /const\s+num\s*=/
check: js | loading repairs the data | /return\s+normalize\(\s*JSON\.parse\(\s*saved\s*\)\s*\)\.notes/
check: js | other tabs stay in sync | /addEventListener\(\s*['"]storage['"]/

quiz: Why rebuild saved notes field by field instead of using JSON.parse() directly?
- [ ] JSON.parse is slow
- [x] The saved text could be old, hand-edited or damaged, and one bad field shouldn't break the whole app
- [ ] JSON can't store notes
why: Validating at the edge means the rest of the code can trust every note it sees.
quiz: When does the storage event fire?
- [ ] In the same tab after every save
- [x] In the other tabs of the same site when localStorage changes
- [ ] When the page loads
why: It's how tabs tell each other that the shared storage changed.

```js storage
// Saved data can be old, hand-edited or damaged. Turn anything into valid notes, dropping what can't be fixed.
const text = (v, max = 20000) => (typeof v === 'string' ? v.slice(0, max) : '');
const num = (v, fallback, min, max) => (Number.isFinite(v) ? Math.round(Math.min(max, Math.max(min, v))) : fallback);
const validId = (v) => (typeof v === 'string' && /^[\w-]{1,64}$/.test(v) ? v : null);

function cleanNote(n) {
  if (!n || typeof n !== 'object' || !validId(n.id)) return null;
  const now = stamp();
  const checklist = Array.isArray(n.checklist)
    ? n.checklist.filter((i) => i && validId(i.id)).slice(0, 500).map((i) => ({ id: i.id, text: text(i.text, 500), done: i.done === true }))
    : [];
  return {
    id: n.id,
    body: text(n.body),
    list: n.list === true,
    checklist,
    color: COLORS.includes(n.color) ? n.color : COLORS[0],
    x: num(n.x, 40, 0, 5000), y: num(n.y, 40, 0, 5000),
    w: num(n.w, SIZE.w, SIZE.minW, 1200), h: num(n.h, SIZE.h, SIZE.minH, 1200),
    created: typeof n.created === 'string' ? n.created : now,
    updated: typeof n.updated === 'string' ? n.updated : now,
  };
}

// Only three notes are allowed; if a file has more, the three edited most recently stay.
function normalize(raw) {
  const seen = new Set();
  let list = (Array.isArray(raw?.notes) ? raw.notes : []).map(cleanNote).filter((n) => n && !seen.has(n.id) && seen.add(n.id));
  if (list.length > MAX_NOTES) {
    const keep = new Set([...list].sort((a, b) => Date.parse(b.updated) - Date.parse(a.updated)).slice(0, MAX_NOTES).map((n) => n.id));
    list = list.filter((n) => keep.has(n.id));
  }
  return { app: 'sticky-notes', version: 2, notes: list };
}

const KEY = 'sticky-notes-guide';
let saveTimer = null;

// Saves a quarter of a second after the last change, so typing doesn't write on every key.
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ app: 'sticky-notes', version: 2, notes }));
    } catch { /* storage blocked (private mode, a sandbox): keep working in memory */ }
  }, 250);
}

function load() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return normalize(JSON.parse(saved)).notes;
  } catch { /* blocked or damaged: start fresh */ }
  const first = createNote([]);
  return [{ ...first, body: 'Hi! Pick a color at the top, ☑ makes a checklist, + makes another note (up to 3).' }];
}
```

```js ui
const desk = document.getElementById('desk');
let notes = load();

const area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });

// Every change goes through here: replace the note with a changed copy, then redraw.
function update(id, fn, rerender = true) {
  notes = notes.map((n) => (n.id === id ? fn(n) : n));
  save();
  if (rerender) keepFocus(render);
}

function addNote(fromId) {
  const from = notes.find((n) => n.id === fromId);
  const note = createNote(notes, { from, area: area() });
  if (!note) return;                     // already three
  notes = [...notes, note];
  save();
  render();
  desk.querySelector(`[data-id="${note.id}"] textarea`)?.focus();
}

function removeNote(id) {
  notes = remove(notes, id);
  save();
  render();
}

// What each button and field on a note does.
function actionsFor(note) {
  const change = (fn, rerender = true) => update(note.id, fn, rerender);
  return {
    color: (color) => change((n) => updateNote(n, { color })),
    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw
    add: () => addNote(note.id),
    remove: () => removeNote(note.id),
    list: (on) => change((n) => setList(n, on)),
    addItem: (text) => change((n) => addItem(n, text)),
    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),
    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),
    removeItem: (itemId) => change((n) => removeItem(n, itemId)),
  };
}

// Dragging a note by its top bar (but not by its buttons).
function draggable(card, note) {
  const bar = card.querySelector('.note-bar');
  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button')) return;
    e.preventDefault();
    notes = toFront(notes, note.id);
    desk.append(card);                                   // on top while dragging
    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };
    card.classList.add('dragging');
    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar
    const move = (ev) => {
      const a = area();
      // keep the whole note on the desk
      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));
      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));
      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
    };
    const up = () => {
      card.classList.remove('dragging');
      bar.removeEventListener('pointermove', move);
      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);
    };
    bar.addEventListener('pointermove', move);
    bar.addEventListener('pointerup', up, { once: true });
    bar.addEventListener('pointercancel', up, { once: true });
  });
  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes
  new ResizeObserver(() => {
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const current = notes.find((n) => n.id === note.id);
    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {
      update(note.id, (n) => updateNote(n, { w, h }), false);
    }
  }).observe(card);
}

function render() {
  desk.replaceChildren(...notes.map((note) => {
    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });
    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });
    draggable(card, note);
    return card;
  }));
  document.getElementById('empty').hidden = notes.length > 0;
}

document.getElementById('firstNote').addEventListener('click', () => addNote());
// Another tab changed the notes: show the latest
window.addEventListener('storage', (e) => { if (e.key === KEY) { notes = load(); keepFocus(render); } });
```

## Finish

### What you learned

- Keeping state as plain objects, changed only by small functions that return copies
- Drawing the page from data with a tiny `el()` helper, and keeping typed text out of HTML
- Rules that live with the data: a limit of three, free colors, fitting new notes on screen
- Reversible features: a checklist that turns back into text without losing a word
- Keeping focus and the cursor across redraws with stable keys
- Pointer events and pointer capture for dragging, CSS `resize` and `ResizeObserver` for resizing
- Debounced saving to `localStorage`, failing gracefully, and repairing whatever comes back

### Challenges

1. **Phones:** below 600 pixels wide, stack the notes in a column instead of floating them (hint: a media query with `position: static`).
2. **Keyboard shortcut:** make Ctrl+Shift+N add a note, like the desktop app.
3. **Delete with undo:** instead of a second click, delete at once and show "Undo" for five seconds.
4. **Export:** a button that downloads your notes as a `.json` file (hint: `Blob` and `URL.createObjectURL`).
5. **Window titles:** write `label(note)`: the first line of text, or the first checklist item, cut to 40 characters with "…".

Compare your notes with the [live demo](https://theoyanvno.github.io/sticky-notes/app/) and the [source code](https://github.com/TheoYanvno/sticky-notes).
