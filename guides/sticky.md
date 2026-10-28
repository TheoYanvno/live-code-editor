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
