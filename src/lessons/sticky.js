// Built from guides/sticky.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "sticky",
 "title": "Sticky Notes",
 "goals": [
  "Keep app state as plain objects and change them only through small functions that return copies",
  "Build a page from data with a tiny element helper, without ever putting typed text into HTML",
  "Turn a note into a checklist and back without losing a word",
  "Drag and resize with pointer events and a ResizeObserver",
  "Save to localStorage safely and repair whatever comes back"
 ],
 "prereqs": [
  "HTML, CSS and JavaScript basics (functions, arrays, objects)",
  "Array map and filter, and the ... spread syntax",
  "Events like click and input"
 ],
 "sessions": [
  {
   "title": "One note on the desk",
   "from": 0,
   "to": 2
  },
  {
   "title": "Checklists",
   "from": 3,
   "to": 5
  },
  {
   "title": "Move and resize",
   "from": 6,
   "to": 7
  },
  {
   "title": "Remembering your notes",
   "from": 8,
   "to": 9
  },
  {
   "title": "How the real project is built",
   "from": 10,
   "to": 10
  }
 ],
 "start": {
  "html": {
   "page": ""
  },
  "css": {
   "base": ""
  },
  "js": {
   "notes": "",
   "view": "",
   "storage": "",
   "ui": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "A note as data, drawn on the page",
   "body": "Welcome! In this guide you'll rebuild the browser version of my [Sticky Notes](https://theoyanvno.github.io/sticky-notes/app/) app: up to three notes in four colors, each one plain text or a checklist, dragged and resized wherever you like, and remembered when you come back. The real project is also a Windows app; the last step shows how the same code powers that.\n\nEvery note is a **plain object**:\n\n```svg A note on screen, and the object behind it\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 210\" font-family=\"sans-serif\"><rect x=\"20\" y=\"20\" width=\"220\" height=\"170\" rx=\"4\" fill=\"#fff3a3\" stroke=\"#d6c25a\"/><rect x=\"20\" y=\"20\" width=\"220\" height=\"28\" fill=\"#f7e36b\"/><circle cx=\"36\" cy=\"34\" r=\"6\" fill=\"#f7e36b\" stroke=\"#2c2620\"/><circle cx=\"52\" cy=\"34\" r=\"6\" fill=\"#f9aec6\" stroke=\"#8a6a70\"/><circle cx=\"68\" cy=\"34\" r=\"6\" fill=\"#a8d0fb\" stroke=\"#5a7a9a\"/><circle cx=\"84\" cy=\"34\" r=\"6\" fill=\"#a9e5a0\" stroke=\"#5a8a55\"/><text x=\"170\" y=\"39\" font-size=\"13\">☑</text><text x=\"192\" y=\"40\" font-size=\"15\" font-weight=\"700\">+</text><text x=\"212\" y=\"39\" font-size=\"12\">🗑</text><text x=\"32\" y=\"74\" font-size=\"12\" fill=\"#2c2620\">Milk</text><text x=\"32\" y=\"92\" font-size=\"12\" fill=\"#2c2620\">Call the dentist</text><line x1=\"240\" y1=\"34\" x2=\"262\" y2=\"34\" stroke=\"#475569\"/><text x=\"266\" y=\"30\" font-size=\"11\">bar: 4 colors, checklist,</text><text x=\"266\" y=\"44\" font-size=\"11\">new note, delete (drag here)</text><line x1=\"200\" y1=\"84\" x2=\"262\" y2=\"84\" stroke=\"#475569\"/><text x=\"266\" y=\"88\" font-size=\"11\">content: text or a checklist</text><text x=\"266\" y=\"128\" font-size=\"11\" fill=\"#475569\">the data behind it:</text><text x=\"266\" y=\"144\" font-size=\"10\" fill=\"#475569\">{ id, body, list, checklist,</text><text x=\"266\" y=\"158\" font-size=\"10\" fill=\"#475569\">  color, x, y, w, h,</text><text x=\"266\" y=\"172\" font-size=\"10\" fill=\"#475569\">  created, updated }</text></svg>\n```\n\n| Field | Example | Meaning |\n|---|---|---|\n| `id` | `'3f9c…'` | a random id from `crypto.randomUUID()` (with a fallback where that's missing) |\n| `body` | `'Milk'` | the text, when it isn't a checklist |\n| `list`, `checklist` | `false`, `[]` | checklist mode and its items |\n| `color` | `'yellow'` | one of four |\n| `x`, `y`, `w`, `h` | `40, 40, 260, 260` | where it sits and how big it is |\n| `created`, `updated` | ISO dates | when it was made and last changed |\n\nThe page is drawn **from** that data. `el(tag, props, ...children)` is a tiny helper that makes an element and sets its class, attributes and event handlers in one line, so `renderNote()` reads almost like the HTML it builds: a `<header>` bar with four color swatches, then a `<textarea>` for the text.\n\n**Changes never edit a note in place.** `updateNote(note, patch)` returns a **copy** with the changes (`{ ...note, ...patch }`) and keeps sizes usable. `update(id, fn)` swaps the old note for the new one in the `notes` array and redraws. When everything goes through one path like this, the page can never show something different from the data.\n\n### What to write\n\n- **HTML:** a header, `<main id=\"desk\">` where notes go, and an \"empty\" message for later.\n- **CSS:** each note is `position: absolute` on the desk. Its colors come from `--note` and `--bar`, which `.note-yellow`, `.note-pink`… set, so changing a note's color is just changing its class.\n- **JavaScript:** `createNote()`, `updateNote()`, `el()`, `renderNote()`, and `render()` placing each card at its `x`, `y`, `w`, `h`.\n\nTyping updates the data **without** redrawing (`text` passes `false`). Redrawing replaces the `<textarea>`, which would throw away your cursor after every letter. Step 6 fixes that properly.\n\n### Try it\n\nClick the color dots. Type in the note.",
   "checks": [
    {
     "pane": "html",
     "label": "the desk where notes go",
     "test": "/id=[\"']desk[\"']/"
    },
    {
     "pane": "js",
     "label": "an updateNote() that returns a copy",
     "test": "/const\\s+next\\s*=\\s*\\{\\s*\\.\\.\\.note\\s*,\\s*\\.\\.\\.patch/"
    },
    {
     "pane": "js",
     "label": "an el() helper",
     "test": "/function\\s+el\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a renderNote() function",
     "test": "/function\\s+renderNote\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "one place for every change",
     "test": "/function\\s+update\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why does updateNote() return a copy instead of changing the note it was given?",
     "options": [
      "Copies use less memory",
      "Every change then goes through update(), so the data and the page can't drift apart, and old values are never changed by surprise",
      "Objects in JavaScript can't be changed"
     ],
     "answer": 1,
     "why": "With one path for changes, whatever is in notes is what's on screen."
    },
    {
     "q": "How does a note change from yellow to pink on screen?",
     "options": [
      "Its class changes from note-yellow to note-pink, and the CSS custom properties give it the new colors",
      "Every element's style is rewritten in JavaScript",
      "The page reloads"
     ],
     "answer": 0,
     "why": ".note-pink sets --note and --bar; the rest of the note's CSS just uses those two variables."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<header class=\"top\">\n  <h1>Sticky Notes</h1>\n  <p class=\"muted\">Drag a note by its top bar · ☑ makes a checklist · + for another note (up to 3)</p>\n</header>\n\n<main id=\"desk\" class=\"desk\" aria-label=\"Your notes\"></main>\n\n<div id=\"empty\" class=\"empty\" hidden>\n  <p>No notes. Deleted notes are gone for good.</p>\n  <button id=\"firstNote\" type=\"button\">+ New sticky note</button>\n</div>"
   },
   "css": {
    "base": "* { box-sizing: border-box; }\n:root {\n  --yellow: #fff3a3; --yellow-bar: #f7e36b;\n  --pink: #ffd3e1;   --pink-bar: #f9aec6;\n  --blue: #cfe6ff;   --blue-bar: #a8d0fb;\n  --green: #d4f5cf;  --green-bar: #a9e5a0;\n}\nbody { margin: 0; height: 100vh; display: flex; flex-direction: column; font: 15px/1.45 system-ui, sans-serif; background: #ece6da; color: #2c2620; }\nbutton, input, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; }\n[hidden] { display: none !important; }\n.top { padding: 8px 16px; }\n.top h1 { margin: 0; font-size: 1.2rem; }\n.muted { margin: 2px 0 0; color: #6b6257; font-size: 13px; }\n.desk { position: relative; flex: 1; overflow: hidden; }\n.empty { position: fixed; inset: 0; display: grid; place-content: center; text-align: center; color: #6b6257; pointer-events: none; }\n.empty button { pointer-events: auto; justify-self: center; padding: 8px 14px; border: 0; border-radius: 10px; background: #c2410c; color: #fff; font-weight: 600; }\n\n/* A note: its color comes from two custom properties set by .note-<color> */\n.note { position: absolute; display: flex; flex-direction: column; background: var(--note); border-radius: 4px 4px 16px 4px;\n        box-shadow: 0 1px 2px rgba(60, 40, 10, .12), 0 8px 22px rgba(60, 40, 10, .14); overflow: hidden; }\n.note-yellow { --note: var(--yellow); --bar: var(--yellow-bar); }\n.note-pink   { --note: var(--pink);   --bar: var(--pink-bar); }\n.note-blue   { --note: var(--blue);   --bar: var(--blue-bar); }\n.note-green  { --note: var(--green);  --bar: var(--green-bar); }\n.note.dragging { box-shadow: 0 14px 40px rgba(60, 40, 10, .3); }\n.note-bar { display: flex; align-items: center; gap: 4px; padding: 5px 6px 5px 9px; background: var(--bar); cursor: grab; user-select: none; touch-action: none; }\n.swatches { display: flex; gap: 6px; }\n.swatch { width: 16px; height: 16px; padding: 0; border-radius: 50%; border: 1px solid rgba(0, 0, 0, .28); }\n.swatch[aria-checked=\"true\"] { box-shadow: 0 0 0 2px var(--bar), 0 0 0 3.5px #2c2620; }\n.swatch-yellow { background: #f7e36b; } .swatch-pink { background: #f9aec6; }\n.swatch-blue { background: #a8d0fb; } .swatch-green { background: #a9e5a0; }\n.spacer { flex: 1; }\n.progress { font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, .55); border-radius: 999px; padding: 0 7px; }\n.icon { border: 0; background: none; padding: 3px 6px; border-radius: 6px; font-size: 15px; line-height: 1; opacity: .72; }\n.icon:hover:not(:disabled) { opacity: 1; background: rgba(0, 0, 0, .09); }\n.icon[aria-pressed=\"true\"] { opacity: 1; background: rgba(0, 0, 0, .12); }\n.icon:disabled { opacity: .3; cursor: not-allowed; }\n.icon.add { font-size: 20px; font-weight: 600; padding: 0 7px 2px; }\n.icon.small { font-size: 11px; }\n.icon.delete.confirm { opacity: 1; background: #b42318; color: #fff; font-size: 12px; font-weight: 600; }\n.note-content { flex: 1; display: flex; flex-direction: column; overflow: auto; padding: 8px 12px 12px; }\n.note-body, .item-text, .add-item input { border: 0; background: transparent; width: 100%; }\n.note-body { flex: 1; resize: none; padding: 0; line-height: 1.5; }\n.note input:focus, .note textarea:focus { outline: none; }\n.checklist { list-style: none; margin: 0; padding: 0; }\n.checklist li { display: flex; align-items: center; gap: 7px; padding: 1px 0; }\n.checklist li.done .item-text { text-decoration: line-through; opacity: .55; }\n.checklist input[type=\"checkbox\"] { width: 16px; height: 16px; accent-color: #2c2620; flex: none; margin: 0; }\n.add-item input { padding: 4px 0 4px 23px; font-size: 14px; }"
   },
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\n\n// A new empty note. No title: just text (or a checklist), a color, and where it sits.\nfunction createNote(notes, { x = 40, y = 40 } = {}) {\n  const t = stamp();\n  return { id: uid(), body: '', list: false, checklist: [], color: 'yellow', x, y, w: SIZE.w, h: SIZE.h, created: t, updated: t };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}",
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions) {\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n  );\n\n  const content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',\n      oninput: (e) => actions.text(e.target.value),\n    });\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note));\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n}",
    "go": "render();"
   }
  },
  {
   "title": "Four colors, a + button and a limit of three",
   "body": "The app keeps the desktop tidy with one rule: **at most three notes**. The rules live with the data, as small functions any part of the app can ask:\n\n| Function | What it answers |\n|---|---|\n| `canAdd(notes)` | is there room for another note? |\n| `freeColor(notes)` | the first of the four colors no note is using |\n| `nextPosition(notes)` | a spot for a new note that isn't on top of another one |\n| `createNote(notes)` | a new note, or `null` if there are already three |\n\nEach new note takes a **free color**, so three notes always look different. Delete the pink one and the next new note is pink again.\n\nThe **+** button on every note calls `addNote()`. When `canAdd()` is false, `renderNote()` gets `canAdd: false` and the + is **disabled**, with a tooltip that says why: \"You can have 3 notes at a time. Delete one to make another.\" A greyed-out button with a reason is friendlier than a click that silently does nothing.\n\n`createNote()` itself refuses a fourth note too. The button is a hint for people; the rule in `createNote()` is what actually enforces it, so no other path (a keyboard shortcut, a bug) can get around it.\n\n### Try it\n\nPress + twice: yellow, then pink, then blue, each one a little lower and to the right. The + buttons turn grey.",
   "checks": [
    {
     "pane": "js",
     "label": "a limit of three",
     "test": "/const\\s+MAX_NOTES\\s*=\\s*3/"
    },
    {
     "pane": "js",
     "label": "new notes take a free color",
     "test": "/function\\s+freeColor\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "createNote refuses a fourth note",
     "test": "/if\\s*\\(\\s*!canAdd\\(\\s*notes\\s*\\)\\s*\\)\\s*return\\s+null/"
    },
    {
     "pane": "js",
     "label": "the + button is disabled at the limit",
     "test": "/disabled:\\s*!canAdd/"
    }
   ],
   "quiz": [
    {
     "q": "Why does createNote() check the limit when the + button is already disabled?",
     "options": [
      "It doesn't need to",
      "The rule should hold however a note is created, not just through one button",
      "Disabled buttons still work"
     ],
     "answer": 1,
     "why": "The button tells people the rule; the function enforces it for every caller."
    },
    {
     "q": "There are yellow and blue notes. What color is the next one?",
     "options": [
      "Yellow",
      "Pink",
      "Green"
     ],
     "answer": 1,
     "why": "freeColor() goes through the list yellow, pink, blue, green and returns the first one nobody is using."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.\nfunction nextPosition(notes) {\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  for (let i = 0; i < 12; i++) {\n    const x = 40 + i * 36;\n    const y = 40 + i * 36;\n    if (free(x, y)) return { x, y };\n  }\n  return { x: 40, y: 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}",
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions, { canAdd = true } = {}) {\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n    el('button', {\n      class: 'icon add', type: 'button', disabled: !canAdd,\n      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,\n      'aria-label': 'New sticky note',\n      onclick: () => actions.add(),\n    }, '+'),\n  );\n\n  const content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',\n      oninput: (e) => actions.text(e.target.value),\n    });\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) render();\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n}"
   }
  },
  {
   "title": "Deleting, safely",
   "body": "The 🗑 button deletes a note, and deleted notes are gone for good. So deleting a note that has something in it takes **two clicks**: the first turns the button red and says \"Delete?\", and the second, within three seconds, deletes. An empty note goes on the first click: there's nothing to lose.\n\n`isEmpty(note)` decides: no text, and no checklist item with text. The timer puts the button back to 🗑 if you don't click again, so a stray click never leaves a loaded \"Delete?\" waiting.\n\n`remove(list, id)` returns the array without that note (`filter` makes a new array, like everything else here). When the last note is gone, `render()` shows the empty message with a **+ New sticky note** button.\n\n| Note | First click | Second click |\n|---|---|---|\n| empty | deleted | — |\n| has text | \"Delete?\" (red) | deleted |\n| has text, no second click | back to 🗑 after 3 seconds | — |\n\n### Try it\n\nType something in a note and press 🗑 once: it asks. Wait three seconds and it resets. Delete every note to see the empty desk.",
   "checks": [
    {
     "pane": "js",
     "label": "a remove() helper",
     "test": "/const\\s+remove\\s*=/"
    },
    {
     "pane": "js",
     "label": "empty notes delete on the first click",
     "test": "/const\\s+isEmpty\\s*=/"
    },
    {
     "pane": "js",
     "label": "a second click confirms",
     "test": "/classList\\.contains\\(\\s*['\"]confirm['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "the empty message shows when there are no notes",
     "test": "/getElementById\\(\\s*['\"]empty['\"]\\s*\\)\\.hidden/"
    }
   ],
   "quiz": [
    {
     "q": "Why does an empty note delete on the first click?",
     "options": [
      "There's nothing to lose, so asking would just be in the way",
      "Empty notes can't show \"Delete?\"",
      "It's a bug"
     ],
     "answer": 0,
     "why": "Confirmation is for protecting work; with no work, one click is kinder."
    },
    {
     "q": "Why does \"Delete?\" go back to 🗑 after three seconds?",
     "options": [
      "To save memory",
      "So a click much later, maybe by accident, doesn't delete a note you forgot was armed",
      "The browser requires it"
     ],
     "answer": 1,
     "why": "A confirmation should be fresh; an old armed button is a trap."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.\nfunction nextPosition(notes) {\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  for (let i = 0; i < 12; i++) {\n    const x = 40 + i * 36;\n    const y = 40 + i * 36;\n    if (free(x, y)) return { x, y };\n  }\n  return { x: 40, y: 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}\n\nconst remove = (list, id) => list.filter((x) => x.id !== id);\n\n// True when the note has nothing in it, so deleting it needs no second click.\nconst isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());",
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions, { canAdd = true } = {}) {\n\n  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing\n  let confirmTimer = null;\n  const del = el('button', {\n    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',\n    onclick: () => {\n      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }\n      del.classList.add('confirm');\n      del.textContent = 'Delete?';\n      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);\n    },\n  }, '🗑');\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n    el('button', {\n      class: 'icon add', type: 'button', disabled: !canAdd,\n      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,\n      'aria-label': 'New sticky note',\n      onclick: () => actions.add(),\n    }, '+'),\n    del,\n  );\n\n  const content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',\n      oninput: (e) => actions.text(e.target.value),\n    });\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) render();\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Turning a note into a checklist",
   "body": "The ☑ button switches a note between text and a checklist. The promise: **switching never loses anything you typed.**\n\n```svg Lines become checklist items, and items become lines again\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 150\" font-family=\"sans-serif\"><rect x=\"15\" y=\"20\" width=\"150\" height=\"90\" rx=\"4\" fill=\"#fff3a3\" stroke=\"#d6c25a\"/><text x=\"25\" y=\"42\" font-size=\"12\">body:</text><text x=\"25\" y=\"60\" font-size=\"12\">\"Milk</text><text x=\"25\" y=\"76\" font-size=\"12\"> Eggs</text><text x=\"25\" y=\"92\" font-size=\"12\"> Bread\"</text><rect x=\"265\" y=\"20\" width=\"150\" height=\"90\" rx=\"4\" fill=\"#fff3a3\" stroke=\"#d6c25a\"/><text x=\"275\" y=\"42\" font-size=\"12\">checklist:</text><text x=\"275\" y=\"60\" font-size=\"12\">☐ Milk</text><text x=\"275\" y=\"76\" font-size=\"12\">☐ Eggs</text><text x=\"275\" y=\"92\" font-size=\"12\">☐ Bread</text><line x1=\"170\" y1=\"52\" x2=\"258\" y2=\"52\" stroke=\"#1d4ed8\" stroke-width=\"2\"/><text x=\"214\" y=\"46\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1d4ed8\">☑ on: each line → an item</text><line x1=\"258\" y1=\"82\" x2=\"170\" y2=\"82\" stroke=\"#16a34a\" stroke-width=\"2\"/><text x=\"214\" y=\"98\" text-anchor=\"middle\" font-size=\"11\" fill=\"#16a34a\">☑ off: items → lines</text><text x=\"215\" y=\"134\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">switching back and forth never loses anything you typed</text></svg>\n```\n\n`setList(note, on)`:\n\n- **On:** split the text into lines, trim them, drop the blank ones, and turn each into an item `{ id, text, done: false }`. The body becomes empty.\n- **Off:** join the items' text back into lines (after any text already in the body). The checklist becomes empty.\n- Already in that mode: return the same note unchanged.\n\nEach item gets its own `id`. That matters in the next step: ticking or editing an item finds it by id, not by its position in the list, so nothing goes wrong if items are removed in between.\n\n`renderNote()` now has two kinds of content: the `<textarea>`, or a `<ul class=\"checklist\">`. For this step the items are read-only text; ticking and editing come next. The ☑ button has `aria-pressed`, so screen readers announce whether checklist mode is on, and CSS gives it a pressed look.\n\n### Try it\n\nType three lines (\"Milk\", \"Eggs\", \"Bread\"), press ☑: three items. Press ☑ again: three lines.",
   "checks": [
    {
     "pane": "js",
     "label": "a setList() function",
     "test": "/function\\s+setList\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "each line becomes an item",
     "test": "/lines\\.map\\(\\s*\\(\\s*text\\s*\\)\\s*=>\\s*\\(\\s*\\{\\s*id:\\s*uid\\(\\)/"
    },
    {
     "pane": "js",
     "label": "items go back into lines",
     "test": "/\\.join\\(\\s*['\"]\\\\n['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "the ☑ button",
     "test": "/actions\\.list\\(\\s*!note\\.list\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "A note says \"Milk\\n\\n  Eggs \". How many checklist items does ☑ make?",
     "options": [
      "Three: Milk, an empty one and Eggs",
      "Two: Milk and Eggs",
      "One: the whole text"
     ],
     "answer": 1,
     "why": "Lines are trimmed and blank ones are dropped, so only the two real lines become items."
    },
    {
     "q": "Why does each checklist item have its own id?",
     "options": [
      "So ticking or editing finds the right item even after others are removed",
      "Ids make the list sort itself",
      "The browser needs ids for checkboxes"
     ],
     "answer": 0,
     "why": "Positions change when items come and go; an id always points at the same item."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.\nfunction nextPosition(notes) {\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  for (let i = 0; i < 12; i++) {\n    const x = 40 + i * 36;\n    const y = 40 + i * 36;\n    if (free(x, y)) return { x, y };\n  }\n  return { x: 40, y: 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}\n\nconst remove = (list, id) => list.filter((x) => x.id !== id);\n\n// True when the note has nothing in it, so deleting it needs no second click.\nconst isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());\n\n// Turns the checklist on or off without losing anything: lines become items, and items become lines again.\nfunction setList(note, on) {\n  if (on === note.list) return note;\n  if (on) {\n    const lines = note.body.split('\\n').map((l) => l.trim()).filter(Boolean);\n    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];\n    return updateNote(note, { list: true, checklist: items, body: '' });\n  }\n  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\\n');\n  const body = [note.body.trim(), text].filter(Boolean).join('\\n');\n  return updateNote(note, { list: false, checklist: [], body });\n}",
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions, { canAdd = true } = {}) {\n\n  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing\n  let confirmTimer = null;\n  const del = el('button', {\n    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',\n    onclick: () => {\n      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }\n      del.classList.add('confirm');\n      del.textContent = 'Delete?';\n      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);\n    },\n  }, '🗑');\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n    el('button', {\n      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',\n      'aria-label': 'Checklist', 'aria-pressed': String(note.list),\n      onclick: () => actions.list(!note.list),\n    }, '☑'),\n    el('button', {\n      class: 'icon add', type: 'button', disabled: !canAdd,\n      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,\n      'aria-label': 'New sticky note',\n      onclick: () => actions.add(),\n    }, '+'),\n    del,\n  );\n\n  let content;\n  if (!note.list) {\n    content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',\n      oninput: (e) => actions.text(e.target.value),\n    });\n  } else {\n    // the items, read-only for now: ticking and editing come in the next step\n    content = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', {}, el('span', { class: 'item-text' }, item.text))));\n  }\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) render();\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Ticking, editing and adding items",
   "body": "Now the checklist works. Each item is a row with a checkbox, a text field and a small ✕, and below the list is a \"+ Add an item\" field.\n\n| Action | Function | Redraw? |\n|---|---|---|\n| tick or untick | `toggleItem(note, id)` | yes, to cross it out |\n| type in an item | `editItem(note, id, text)` | no (keep the cursor) |\n| ✕ | `removeItem(note, id)` | yes |\n| Enter in \"Add an item\" | `addItem(note, text)` | yes |\n\nEvery one of these returns a new note with a **new checklist array**, made with `map` or `filter` (or `[...old, newItem]`). The item being changed becomes a new object too: `{ ...i, done: !i.done }`.\n\n`progress(note)` counts done items, and the bar shows a little badge like **1/3**. Done items are crossed out with CSS (`li.done .item-text`).\n\nThe add field is a `<form>`, so pressing Enter submits it; `e.preventDefault()` stops the browser from reloading the page, which is what forms do by default.\n\n### Try it\n\nMake a checklist, tick an item, add one with Enter. Notice that after adding, your cursor isn't in the add field any more: you'd have to click it again for every item. That's what the next step fixes.",
   "checks": [
    {
     "pane": "js",
     "label": "tick and untick",
     "test": "/const\\s+toggleItem\\s*=/"
    },
    {
     "pane": "js",
     "label": "an addItem() function",
     "test": "/function\\s+addItem\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a done count",
     "test": "/function\\s+progress\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "Enter doesn't reload the page",
     "test": "/e\\.preventDefault\\(\\)\\s*;\\s*if\\s*\\(\\s*addInput\\.value\\.trim\\(\\)\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why does editing an item's text not redraw the note, while ticking it does?",
     "options": [
      "Ticking changes how the item looks (crossed out); redrawing while you type would knock the cursor out of the field",
      "Text can't be redrawn",
      "Ticking is slower"
     ],
     "answer": 0,
     "why": "Text fields already show what you typed; only changes the page must display need a redraw."
    },
    {
     "q": "What does e.preventDefault() do in the add-item form?",
     "options": [
      "Clears the field",
      "Stops the form's default action, which is to submit and reload the page",
      "Prevents empty items"
     ],
     "answer": 1,
     "why": "Forms submit by reloading; the app handles Enter itself instead."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.\nfunction nextPosition(notes) {\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  for (let i = 0; i < 12; i++) {\n    const x = 40 + i * 36;\n    const y = 40 + i * 36;\n    if (free(x, y)) return { x, y };\n  }\n  return { x: 40, y: 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}\n\nconst remove = (list, id) => list.filter((x) => x.id !== id);\n\n// True when the note has nothing in it, so deleting it needs no second click.\nconst isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());\n\n// Turns the checklist on or off without losing anything: lines become items, and items become lines again.\nfunction setList(note, on) {\n  if (on === note.list) return note;\n  if (on) {\n    const lines = note.body.split('\\n').map((l) => l.trim()).filter(Boolean);\n    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];\n    return updateNote(note, { list: true, checklist: items, body: '' });\n  }\n  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\\n');\n  const body = [note.body.trim(), text].filter(Boolean).join('\\n');\n  return updateNote(note, { list: false, checklist: [], body });\n}\n\n// Checklist items: each change returns a new note with a new checklist array.\nfunction addItem(note, text) {\n  const clean = text.trim();\n  if (!clean) return note;\n  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });\n}\nconst toggleItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });\nconst editItem = (note, itemId, text) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });\nconst removeItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });\n\nfunction progress(note) {\n  const total = note.checklist.length;\n  const done = note.checklist.filter((i) => i.done).length;\n  return { done, total, label: total ? `${done}/${total}` : '' };\n}",
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions, { canAdd = true } = {}) {\n  const p = progress(note);\n\n  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing\n  let confirmTimer = null;\n  const del = el('button', {\n    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',\n    onclick: () => {\n      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }\n      del.classList.add('confirm');\n      del.textContent = 'Delete?';\n      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);\n    },\n  }, '🗑');\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n    p.total ? el('span', { class: 'progress', title: 'Checklist items done' }, p.label) : null,\n    el('button', {\n      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',\n      'aria-label': 'Checklist', 'aria-pressed': String(note.list),\n      onclick: () => actions.list(!note.list),\n    }, '☑'),\n    el('button', {\n      class: 'icon add', type: 'button', disabled: !canAdd,\n      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,\n      'aria-label': 'New sticky note',\n      onclick: () => actions.add(),\n    }, '+'),\n    del,\n  );\n\n  let content;\n  if (!note.list) {\n    content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text',\n      oninput: (e) => actions.text(e.target.value),\n    });\n  } else {\n    const list = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', { class: item.done ? 'done' : '' },\n      el('input', { type: 'checkbox', checked: item.done, 'aria-label': `Done: ${item.text}`, onchange: () => actions.toggleItem(item.id) }),\n      el('input', { class: 'item-text', type: 'text', value: item.text, maxLength: 500, 'aria-label': 'Checklist item', oninput: (e) => actions.editItem(item.id, e.target.value) }),\n      el('button', { class: 'icon small', type: 'button', title: 'Remove item', 'aria-label': `Remove ${item.text}`, onclick: () => actions.removeItem(item.id) }, '✕'),\n    )));\n    const addInput = el('input', { type: 'text', placeholder: '+ Add an item', 'aria-label': 'Add a checklist item', maxLength: 500 });\n    const add = el('form', {\n      class: 'add-item',\n      onsubmit: (e) => { e.preventDefault(); if (addInput.value.trim()) actions.addItem(addInput.value); },\n    }, addInput);\n    content = el('div', { class: 'list-wrap' }, list, add);\n  }\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) render();\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Keeping your cursor when the page redraws",
   "body": "Redrawing from data is simple and reliable, but it has one cost: every element is new, so the field you were typing in is gone, and so is your cursor. The fix is small and general.\n\n```svg keepFocus(): remember the field and cursor, redraw, then put them back\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 428 115\" font-family=\"sans-serif\"><rect x=\"8\" y=\"20\" width=\"130\" height=\"56\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"73\" y=\"40\" text-anchor=\"middle\" font-size=\"10\">remember the focused</text><text x=\"73\" y=\"53\" text-anchor=\"middle\" font-size=\"10\">field's data-focus</text><text x=\"73\" y=\"66\" text-anchor=\"middle\" font-size=\"10\">key and cursor</text><line x1=\"138\" y1=\"48\" x2=\"148\" y2=\"48\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"148\" y=\"20\" width=\"130\" height=\"56\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"213\" y=\"40\" text-anchor=\"middle\" font-size=\"10\">redraw the note</text><line x1=\"278\" y1=\"48\" x2=\"288\" y2=\"48\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"288\" y=\"20\" width=\"130\" height=\"56\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"353\" y=\"40\" text-anchor=\"middle\" font-size=\"10\">find the new field</text><text x=\"353\" y=\"53\" text-anchor=\"middle\" font-size=\"10\">with the same key,</text><text x=\"353\" y=\"66\" text-anchor=\"middle\" font-size=\"10\">put the cursor back</text><text x=\"214\" y=\"102\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">keys like \"note-id:item-3\" stay the same across redraws, so the right field gets focus back</text></svg>\n```\n\n1. Every field that can have focus gets a **stable key** in `data-focus`, like `\"3f9c…:add\"` or `\"3f9c…:item-7a1e…\"`: the note's id plus which field it is. The key is the same on every redraw.\n2. `keepFocus(render)` reads `document.activeElement`'s key and its cursor position (`selectionStart`, `selectionEnd`) **before** redrawing.\n3. After redrawing, it finds the new element with the same key, focuses it, and puts the cursor back.\n\n`CSS.escape()` makes the key safe to use inside a selector. `update()` now calls `keepFocus(render)` instead of `render()`, so every redraw keeps the cursor without any other code knowing about it.\n\n### Try it\n\nAdd three items in a row by typing and pressing Enter: the cursor stays in the add field. Tick an item with the keyboard (Tab to it, press Space): focus stays on the checkbox.",
   "checks": [
    {
     "pane": "js",
     "label": "fields have stable focus keys",
     "test": "/dataset:\\s*\\{\\s*focus:\\s*key\\(/"
    },
    {
     "pane": "js",
     "label": "a keepFocus() function",
     "test": "/function\\s+keepFocus\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "the cursor position is remembered",
     "test": "/selectionStart/"
    },
    {
     "pane": "js",
     "label": "every redraw keeps focus",
     "test": "/keepFocus\\(\\s*render\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why does each field need a key that stays the same across redraws?",
     "options": [
      "The redrawn field is a brand-new element, so the key is the only way to find \"the same\" field again",
      "Keys make fields faster",
      "Browsers need data attributes"
     ],
     "answer": 0,
     "why": "Element references die with the old elements; a key made from the note id and the field name survives."
    },
    {
     "q": "Why does keepFocus() wrap render instead of each button handling focus itself?",
     "options": [
      "One place handles focus for every change, so new buttons get it for free",
      "Buttons can't set focus",
      "It's required by CSS.escape"
     ],
     "answer": 0,
     "why": "update() calls keepFocus(render), so the whole app benefits without repeating code."
    }
   ],
   "session": 1,
   "minutes": 10,
   "js": {
    "view": "// el('button', { class: 'icon', onclick: fn }, '+') builds an element in one line.\n// What people type only ever goes in through .value or text nodes, never as HTML.\nfunction el(tag, props = {}, ...children) {\n  const node = document.createElement(tag);\n  for (const [k, v] of Object.entries(props)) {\n    if (k === 'class') node.className = v;\n    else if (k === 'dataset') Object.assign(node.dataset, v);\n    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);\n    else if (k in node) node[k] = v;\n    else node.setAttribute(k, v);\n  }\n  node.append(...children.filter((c) => c != null && c !== false));\n  return node;\n}\n\nconst COLOR_NAMES = { yellow: 'Yellow', pink: 'Pink', blue: 'Blue', green: 'Green' };\n\n// Draws one note: the bar across the top, then the text or the checklist.\nfunction renderNote(note, actions, { canAdd = true } = {}) {\n  const key = (part) => `${note.id}:${part}`;   // stays the same every time the note is redrawn\n  const p = progress(note);\n\n  // Deleting a note with something in it takes a second click, so a slip of the mouse loses nothing\n  let confirmTimer = null;\n  const del = el('button', {\n    class: 'icon delete', type: 'button', title: 'Delete note', 'aria-label': 'Delete note',\n    onclick: () => {\n      if (isEmpty(note) || del.classList.contains('confirm')) { clearTimeout(confirmTimer); actions.remove(); return; }\n      del.classList.add('confirm');\n      del.textContent = 'Delete?';\n      confirmTimer = setTimeout(() => { del.classList.remove('confirm'); del.textContent = '🗑'; }, 3000);\n    },\n  }, '🗑');\n\n  const bar = el('header', { class: 'note-bar' },\n    el('div', { class: 'swatches', role: 'radiogroup', 'aria-label': 'Note color' },\n      ...COLORS.map((c) => el('button', {\n        class: `swatch swatch-${c}`, type: 'button', title: COLOR_NAMES[c], role: 'radio',\n        'aria-checked': String(c === note.color), 'aria-label': COLOR_NAMES[c],\n        onclick: () => actions.color(c),\n      }))),\n    el('span', { class: 'spacer' }),\n    p.total ? el('span', { class: 'progress', title: 'Checklist items done' }, p.label) : null,\n    el('button', {\n      class: 'icon', type: 'button', title: note.list ? 'Back to plain text' : 'Make this a checklist',\n      'aria-label': 'Checklist', 'aria-pressed': String(note.list), dataset: { focus: key('list') },\n      onclick: () => actions.list(!note.list),\n    }, '☑'),\n    el('button', {\n      class: 'icon add', type: 'button', disabled: !canAdd,\n      title: canAdd ? 'New sticky note' : `You can have ${MAX_NOTES} notes at a time. Delete one to make another.`,\n      'aria-label': 'New sticky note',\n      onclick: () => actions.add(),\n    }, '+'),\n    del,\n  );\n\n  let content;\n  if (!note.list) {\n    content = el('textarea', {\n      class: 'note-body', value: note.body, placeholder: 'Write something…', 'aria-label': 'Note text', dataset: { focus: key('body') },\n      oninput: (e) => actions.text(e.target.value),\n    });\n  } else {\n    const list = el('ul', { class: 'checklist' }, ...note.checklist.map((item) => el('li', { class: item.done ? 'done' : '' },\n      el('input', { type: 'checkbox', checked: item.done, 'aria-label': `Done: ${item.text}`, dataset: { focus: key(`check-${item.id}`) }, onchange: () => actions.toggleItem(item.id) }),\n      el('input', { class: 'item-text', type: 'text', value: item.text, maxLength: 500, 'aria-label': 'Checklist item', dataset: { focus: key(`item-${item.id}`) }, oninput: (e) => actions.editItem(item.id, e.target.value) }),\n      el('button', { class: 'icon small', type: 'button', title: 'Remove item', 'aria-label': `Remove ${item.text}`, onclick: () => actions.removeItem(item.id) }, '✕'),\n    )));\n    const addInput = el('input', { type: 'text', placeholder: '+ Add an item', 'aria-label': 'Add a checklist item', maxLength: 500, dataset: { focus: key('add') } });\n    const add = el('form', {\n      class: 'add-item',\n      onsubmit: (e) => { e.preventDefault(); if (addInput.value.trim()) actions.addItem(addInput.value); },\n    }, addInput);\n    content = el('div', { class: 'list-wrap' }, list, add);\n  }\n\n  return el('article', { class: `note note-${note.color}`, dataset: { id: note.id }, 'aria-label': 'Sticky note' },\n    bar, el('div', { class: 'note-content' }, content));\n}\n\n// Redrawing replaces every element, which would drop the cursor. Remember where it was and put it back.\nfunction keepFocus(rerender) {\n  const active = document.activeElement;\n  const focusKey = active?.dataset?.focus;\n  const sel = focusKey && 'selectionStart' in active ? [active.selectionStart, active.selectionEnd] : null;\n  rerender();\n  if (!focusKey) return;\n  const again = document.querySelector(`[data-focus=\"${CSS.escape(focusKey)}\"]`);\n  if (!again) return;\n  again.focus({ preventScroll: true });\n  if (sel && again.setSelectionRange && again.type !== 'checkbox') {\n    try { again.setSelectionRange(...sel); } catch { /* not a text field */ }\n  }\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) keepFocus(render);\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Dragging a note by its top bar",
   "body": "Notes are dragged by their colored top bar, using **pointer events**, which work the same for a mouse, a pen and a finger.\n\n```svg Dragging: remember where it started, move by how far the pointer went, save on release\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 160\" font-family=\"sans-serif\"><rect x=\"20\" y=\"30\" width=\"110\" height=\"80\" rx=\"4\" fill=\"#cfe6ff\" stroke=\"#7aa6d6\" stroke-dasharray=\"4 3\"/><rect x=\"20\" y=\"30\" width=\"110\" height=\"18\" fill=\"#a8d0fb\" opacity=\"0.6\"/><rect x=\"200\" y=\"60\" width=\"110\" height=\"80\" rx=\"4\" fill=\"#cfe6ff\" stroke=\"#5a7a9a\"/><rect x=\"200\" y=\"60\" width=\"110\" height=\"18\" fill=\"#a8d0fb\"/><circle cx=\"60\" cy=\"39\" r=\"4\" fill=\"#1d4ed8\"/><circle cx=\"240\" cy=\"69\" r=\"4\" fill=\"#1d4ed8\"/><line x1=\"64\" y1=\"41\" x2=\"236\" y2=\"67\" stroke=\"#1d4ed8\" stroke-width=\"2\" stroke-dasharray=\"5 3\"/><text x=\"40\" y=\"22\" font-size=\"11\">pointerdown: remember start</text><text x=\"150\" y=\"44\" font-size=\"11\" fill=\"#1d4ed8\">pointermove: left = start + (now - start)</text><text x=\"320\" y=\"100\" font-size=\"11\">pointerup:</text><text x=\"320\" y=\"114\" font-size=\"11\">save x and y</text><text x=\"215\" y=\"154\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">setPointerCapture keeps the moves coming even if the pointer slips off the bar</text></svg>\n```\n\n| Event | What happens |\n|---|---|\n| `pointerdown` on the bar | ignore it if it's a button or not the main mouse button; bring the note to the front; remember where the pointer and the note started |\n| `pointermove` | new position = start position + how far the pointer has moved, kept inside the desk |\n| `pointerup` / `pointercancel` | save the new `x` and `y` |\n\nThree details make it feel right:\n\n- **`setPointerCapture()`** sends every move to the bar until you let go, even if the pointer races ahead of the note or leaves the window.\n- **Clamping** with `Math.max(0, Math.min(…))` keeps the note on the desk, so it can never be dragged out of reach.\n- **`toFront()`** moves the note to the end of the array, and the last note is drawn on top. During the drag, `desk.append(card)` moves the element to the end too, without a full redraw.\n\nThe note moves by setting `card.style.left` and `top` directly during the drag; only on release does the data change (with no redraw, since the note is already where it should be). CSS `touch-action: none` on the bar stops a phone from scrolling the page instead of dragging.\n\n### Try it\n\nDrag notes around and stack them; the one you drag comes to the front.",
   "checks": [
    {
     "pane": "js",
     "label": "a draggable() function",
     "test": "/function\\s+draggable\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "moves follow the pointer even off the bar",
     "test": "/setPointerCapture\\(\\s*e\\.pointerId\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "the note stays on the desk",
     "test": "/Math\\.max\\(\\s*0\\s*,\\s*Math\\.min\\(/"
    },
    {
     "pane": "js",
     "label": "the dragged note comes to the front",
     "test": "/function\\s+toFront\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "What does setPointerCapture() fix?",
     "options": [
      "Moving the pointer quickly off the bar would otherwise stop the drag",
      "It makes the note snap to a grid",
      "It saves the position"
     ],
     "answer": 0,
     "why": "With capture, every move goes to the bar until the pointer is released, wherever it is."
    },
    {
     "q": "Why is the data only updated on pointerup, not on every pointermove?",
     "options": [
      "Moving the element directly is enough while dragging; one save at the end avoids dozens of updates per second",
      "pointermove can't change data",
      "To make dragging slower"
     ],
     "answer": 0,
     "why": "The style follows the pointer cheaply, and the final position is recorded once."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: cascading down from the top-left, skipping spots another note already uses.\nfunction nextPosition(notes) {\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  for (let i = 0; i < 12; i++) {\n    const x = 40 + i * 36;\n    const y = 40 + i * 36;\n    if (free(x, y)) return { x, y };\n  }\n  return { x: 40, y: 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}\n\nconst remove = (list, id) => list.filter((x) => x.id !== id);\n\n// True when the note has nothing in it, so deleting it needs no second click.\nconst isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());\n\n// Turns the checklist on or off without losing anything: lines become items, and items become lines again.\nfunction setList(note, on) {\n  if (on === note.list) return note;\n  if (on) {\n    const lines = note.body.split('\\n').map((l) => l.trim()).filter(Boolean);\n    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];\n    return updateNote(note, { list: true, checklist: items, body: '' });\n  }\n  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\\n');\n  const body = [note.body.trim(), text].filter(Boolean).join('\\n');\n  return updateNote(note, { list: false, checklist: [], body });\n}\n\n// Checklist items: each change returns a new note with a new checklist array.\nfunction addItem(note, text) {\n  const clean = text.trim();\n  if (!clean) return note;\n  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });\n}\nconst toggleItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });\nconst editItem = (note, itemId, text) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });\nconst removeItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });\n\nfunction progress(note) {\n  const total = note.checklist.length;\n  const done = note.checklist.filter((i) => i.done).length;\n  return { done, total, label: total ? `${done}/${total}` : '' };\n}\n\n// Brings a note to the front: the last one in the list is drawn on top.\nfunction toFront(notes, id) {\n  const note = notes.find((n) => n.id === id);\n  return note ? [...remove(notes, id), note] : notes;\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\nconst area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) keepFocus(render);\n}\n\nfunction addNote(fromId) {\n  const note = createNote(notes);\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\n// Dragging a note by its top bar (but not by its buttons).\nfunction draggable(card, note) {\n  const bar = card.querySelector('.note-bar');\n  bar.addEventListener('pointerdown', (e) => {\n    if (e.button !== 0 || e.target.closest('button')) return;\n    e.preventDefault();\n    notes = toFront(notes, note.id);\n    desk.append(card);                                   // on top while dragging\n    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };\n    card.classList.add('dragging');\n    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar\n    const move = (ev) => {\n      const a = area();\n      // keep the whole note on the desk\n      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));\n      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));\n      card.style.left = `${x}px`;\n      card.style.top = `${y}px`;\n    };\n    const up = () => {\n      card.classList.remove('dragging');\n      bar.removeEventListener('pointermove', move);\n      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);\n    };\n    bar.addEventListener('pointermove', move);\n    bar.addEventListener('pointerup', up, { once: true });\n    bar.addEventListener('pointercancel', up, { once: true });\n  });\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    draggable(card, note);\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Resizing, and where new notes go",
   "body": "**Resizing** needs almost no code: CSS `resize: both` makes the browser draw a grip in the note's bottom corner, and `min-width` / `min-height` stop a note getting too small to use. The app only has to *notice* the new size, and that's what a **`ResizeObserver`** is for: it calls back whenever the element's size changes, whatever caused it.\n\nThe observer compares the card's size with the saved `w` and `h`, and saves only when they differ by more than a pixel. Rounding means tiny differences come up all the time; without that check, every redraw would trigger a save.\n\n**Placing new notes.** Now that notes can be anywhere, cascading from the top-left isn't good enough. `nextPosition()` gets the note the + was pressed on (`from`) and the visible `area`, and tries, in order:\n\n| Try | Where |\n|---|---|\n| 1 | to the right of that note |\n| 2 | below it |\n| 3 | to its left |\n| 4 | slightly down and right of it |\n| then | the cascade from the top-left |\n\nEach spot must **fit** in the visible area and be **free** (not within 40 pixels of another note). That's the same function the desktop app uses, with the screen as the area; it even works on a second monitor, because the area can start at any `x` and `y`.\n\n### Try it\n\nResize a note from its corner, then press + on it: the new note appears beside it. Move a note to the right edge and press +: the new one goes below instead.",
   "checks": [
    {
     "pane": "css",
     "label": "the browser's resize grip",
     "test": "/resize:\\s*both/",
     "hint": "Add .note { resize: both; min-width: 200px; min-height: 160px; }"
    },
    {
     "pane": "js",
     "label": "new sizes are noticed",
     "test": "/new\\s+ResizeObserver\\(/"
    },
    {
     "pane": "js",
     "label": "new notes try the spot beside the one + was pressed on",
     "test": "/from\\.x\\s*\\+\\s*from\\.w\\s*\\+\\s*gap/"
    },
    {
     "pane": "js",
     "label": "they must fit on screen",
     "test": "/const\\s+fits\\s*=/"
    }
   ],
   "quiz": [
    {
     "q": "Why does the ResizeObserver ignore differences of a pixel or less?",
     "options": [
      "Rounding makes tiny differences constantly, and saving each one would cause a stream of pointless saves",
      "Pixels can't be compared",
      "ResizeObserver is inaccurate"
     ],
     "answer": 0,
     "why": "Only real resizes should be saved."
    },
    {
     "q": "A note sits at the right edge of the screen. Where does + put the new note?",
     "options": [
      "Off screen to the right",
      "Below it, because \"to the right\" doesn't fit",
      "On top of it"
     ],
     "answer": 1,
     "why": "Each candidate spot is checked with fits() and free(); the first that passes wins."
    }
   ],
   "session": 2,
   "minutes": 15,
   "css": {
    "base": "* { box-sizing: border-box; }\n:root {\n  --yellow: #fff3a3; --yellow-bar: #f7e36b;\n  --pink: #ffd3e1;   --pink-bar: #f9aec6;\n  --blue: #cfe6ff;   --blue-bar: #a8d0fb;\n  --green: #d4f5cf;  --green-bar: #a9e5a0;\n}\nbody { margin: 0; height: 100vh; display: flex; flex-direction: column; font: 15px/1.45 system-ui, sans-serif; background: #ece6da; color: #2c2620; }\nbutton, input, textarea { font: inherit; color: inherit; }\nbutton { cursor: pointer; }\n[hidden] { display: none !important; }\n.top { padding: 8px 16px; }\n.top h1 { margin: 0; font-size: 1.2rem; }\n.muted { margin: 2px 0 0; color: #6b6257; font-size: 13px; }\n.desk { position: relative; flex: 1; overflow: hidden; }\n.empty { position: fixed; inset: 0; display: grid; place-content: center; text-align: center; color: #6b6257; pointer-events: none; }\n.empty button { pointer-events: auto; justify-self: center; padding: 8px 14px; border: 0; border-radius: 10px; background: #c2410c; color: #fff; font-weight: 600; }\n\n/* A note: its color comes from two custom properties set by .note-<color> */\n.note { position: absolute; display: flex; flex-direction: column; background: var(--note); border-radius: 4px 4px 16px 4px;\n        box-shadow: 0 1px 2px rgba(60, 40, 10, .12), 0 8px 22px rgba(60, 40, 10, .14); overflow: hidden; }\n.note-yellow { --note: var(--yellow); --bar: var(--yellow-bar); }\n.note-pink   { --note: var(--pink);   --bar: var(--pink-bar); }\n.note-blue   { --note: var(--blue);   --bar: var(--blue-bar); }\n.note-green  { --note: var(--green);  --bar: var(--green-bar); }\n.note.dragging { box-shadow: 0 14px 40px rgba(60, 40, 10, .3); }\n.note-bar { display: flex; align-items: center; gap: 4px; padding: 5px 6px 5px 9px; background: var(--bar); cursor: grab; user-select: none; touch-action: none; }\n.swatches { display: flex; gap: 6px; }\n.swatch { width: 16px; height: 16px; padding: 0; border-radius: 50%; border: 1px solid rgba(0, 0, 0, .28); }\n.swatch[aria-checked=\"true\"] { box-shadow: 0 0 0 2px var(--bar), 0 0 0 3.5px #2c2620; }\n.swatch-yellow { background: #f7e36b; } .swatch-pink { background: #f9aec6; }\n.swatch-blue { background: #a8d0fb; } .swatch-green { background: #a9e5a0; }\n.spacer { flex: 1; }\n.progress { font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, .55); border-radius: 999px; padding: 0 7px; }\n.icon { border: 0; background: none; padding: 3px 6px; border-radius: 6px; font-size: 15px; line-height: 1; opacity: .72; }\n.icon:hover:not(:disabled) { opacity: 1; background: rgba(0, 0, 0, .09); }\n.icon[aria-pressed=\"true\"] { opacity: 1; background: rgba(0, 0, 0, .12); }\n.icon:disabled { opacity: .3; cursor: not-allowed; }\n.icon.add { font-size: 20px; font-weight: 600; padding: 0 7px 2px; }\n.icon.small { font-size: 11px; }\n.icon.delete.confirm { opacity: 1; background: #b42318; color: #fff; font-size: 12px; font-weight: 600; }\n.note-content { flex: 1; display: flex; flex-direction: column; overflow: auto; padding: 8px 12px 12px; }\n.note-body, .item-text, .add-item input { border: 0; background: transparent; width: 100%; }\n.note-body { flex: 1; resize: none; padding: 0; line-height: 1.5; }\n.note input:focus, .note textarea:focus { outline: none; }\n.checklist { list-style: none; margin: 0; padding: 0; }\n.checklist li { display: flex; align-items: center; gap: 7px; padding: 1px 0; }\n.checklist li.done .item-text { text-decoration: line-through; opacity: .55; }\n.checklist input[type=\"checkbox\"] { width: 16px; height: 16px; accent-color: #2c2620; flex: none; margin: 0; }\n.add-item input { padding: 4px 0 4px 23px; font-size: 14px; }\n\n/* The browser draws a resize grip in the bottom corner; min sizes keep the note usable */\n.note { resize: both; min-width: 200px; min-height: 160px; }"
   },
   "js": {
    "notes": "// Sticky notes are plain objects, changed only through these functions.\nconst COLORS = ['yellow', 'pink', 'blue', 'green'];\nconst SIZE = { w: 260, h: 260, minW: 200, minH: 160 };\nconst uid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;\nconst stamp = () => new Date().toISOString();\nconst MAX_NOTES = 3;\nconst canAdd = (notes) => notes.length < MAX_NOTES;\n\n// The first color no other note is using, so three notes are easy to tell apart.\nfunction freeColor(notes) {\n  return COLORS.find((c) => !notes.some((n) => n.color === c)) ?? COLORS[0];\n}\n\n// Where a new note goes: beside the note + was pressed on (right, then below, then left), or cascading\n// from the top-left. `area` is the visible space, so a new note never lands off screen.\nfunction nextPosition(notes, { from, area = { x: 0, y: 0, width: 1200, height: 800 } } = {}) {\n  const gap = 24;\n  const fits = (x, y) => x >= area.x && y >= area.y && x + SIZE.w <= area.x + area.width && y + SIZE.h <= area.y + area.height;\n  const free = (x, y) => !notes.some((n) => Math.abs(n.x - x) < 40 && Math.abs(n.y - y) < 40);\n  if (from) {\n    const tries = [[from.x + from.w + gap, from.y], [from.x, from.y + from.h + gap], [from.x - SIZE.w - gap, from.y], [from.x + 40, from.y + 40]];\n    for (const [x, y] of tries) if (fits(x, y) && free(x, y)) return { x, y };\n  }\n  for (let i = 0; i < 12; i++) {\n    const x = area.x + 40 + i * 36;\n    const y = area.y + 40 + i * 36;\n    if (fits(x, y) && free(x, y)) return { x, y };\n  }\n  return { x: area.x + 40, y: area.y + 40 };\n}\n\n// A new empty note, or null when three already exist.\nfunction createNote(notes, options = {}) {\n  if (!canAdd(notes)) return null;\n  const t = stamp();\n  return {\n    id: uid(), body: '', list: false, checklist: [],\n    color: freeColor(notes),\n    ...nextPosition(notes, options), w: SIZE.w, h: SIZE.h, created: t, updated: t,\n  };\n}\n\n// Returns a changed COPY of the note, with its size and position kept at usable values.\nfunction updateNote(note, patch) {\n  const next = { ...note, ...patch, updated: stamp() };\n  next.x = Math.round(next.x);\n  next.y = Math.round(next.y);\n  next.w = Math.max(SIZE.minW, Math.round(next.w));\n  next.h = Math.max(SIZE.minH, Math.round(next.h));\n  if (!COLORS.includes(next.color)) next.color = note.color;\n  return next;\n}\n\nconst remove = (list, id) => list.filter((x) => x.id !== id);\n\n// True when the note has nothing in it, so deleting it needs no second click.\nconst isEmpty = (note) => !note.body.trim() && !note.checklist.some((i) => i.text.trim());\n\n// Turns the checklist on or off without losing anything: lines become items, and items become lines again.\nfunction setList(note, on) {\n  if (on === note.list) return note;\n  if (on) {\n    const lines = note.body.split('\\n').map((l) => l.trim()).filter(Boolean);\n    const items = [...note.checklist, ...lines.map((text) => ({ id: uid(), text, done: false }))];\n    return updateNote(note, { list: true, checklist: items, body: '' });\n  }\n  const text = note.checklist.map((i) => i.text).filter((t) => t.trim()).join('\\n');\n  const body = [note.body.trim(), text].filter(Boolean).join('\\n');\n  return updateNote(note, { list: false, checklist: [], body });\n}\n\n// Checklist items: each change returns a new note with a new checklist array.\nfunction addItem(note, text) {\n  const clean = text.trim();\n  if (!clean) return note;\n  return updateNote(note, { checklist: [...note.checklist, { id: uid(), text: clean, done: false }] });\n}\nconst toggleItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) });\nconst editItem = (note, itemId, text) =>\n  updateNote(note, { checklist: note.checklist.map((i) => (i.id === itemId ? { ...i, text } : i)) });\nconst removeItem = (note, itemId) =>\n  updateNote(note, { checklist: note.checklist.filter((i) => i.id !== itemId) });\n\nfunction progress(note) {\n  const total = note.checklist.length;\n  const done = note.checklist.filter((i) => i.done).length;\n  return { done, total, label: total ? `${done}/${total}` : '' };\n}\n\n// Brings a note to the front: the last one in the list is drawn on top.\nfunction toFront(notes, id) {\n  const note = notes.find((n) => n.id === id);\n  return note ? [...remove(notes, id), note] : notes;\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = [createNote([])];\n\nconst area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  if (rerender) keepFocus(render);\n}\n\nfunction addNote(fromId) {\n  const from = notes.find((n) => n.id === fromId);\n  const note = createNote(notes, { from, area: area() });\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\n// Dragging a note by its top bar (but not by its buttons).\nfunction draggable(card, note) {\n  const bar = card.querySelector('.note-bar');\n  bar.addEventListener('pointerdown', (e) => {\n    if (e.button !== 0 || e.target.closest('button')) return;\n    e.preventDefault();\n    notes = toFront(notes, note.id);\n    desk.append(card);                                   // on top while dragging\n    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };\n    card.classList.add('dragging');\n    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar\n    const move = (ev) => {\n      const a = area();\n      // keep the whole note on the desk\n      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));\n      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));\n      card.style.left = `${x}px`;\n      card.style.top = `${y}px`;\n    };\n    const up = () => {\n      card.classList.remove('dragging');\n      bar.removeEventListener('pointermove', move);\n      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);\n    };\n    bar.addEventListener('pointermove', move);\n    bar.addEventListener('pointerup', up, { once: true });\n    bar.addEventListener('pointercancel', up, { once: true });\n  });\n  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes\n  new ResizeObserver(() => {\n    const w = card.offsetWidth;\n    const h = card.offsetHeight;\n    const current = notes.find((n) => n.id === note.id);\n    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {\n      update(note.id, (n) => updateNote(n, { w, h }), false);\n    }\n  }).observe(card);\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    draggable(card, note);\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Saving in localStorage",
   "body": "Notes should still be there tomorrow. The browser version keeps them in **`localStorage`**: a small store of text, per website, that survives closing the tab.\n\n- `save()` writes `{ app, version, notes }` as JSON. It waits **250 milliseconds** after the last change (`clearTimeout` + `setTimeout`), so typing a sentence writes once, not once per key. This is called **debouncing**.\n- `load()` reads it back. If there's nothing saved, the app starts with one welcome note.\n- `update()`, `addNote()` and `removeNote()` all call `save()`.\n\n**Storage can fail**, so both are wrapped in `try`/`catch`. Private browsing, a full disk, a browser setting or a sandboxed page can all make `localStorage` throw. When it does, the app keeps working in memory instead of breaking.\n\nThis editor's preview is exactly one of those cases: it runs your page in a sandbox where storage is blocked, so here the notes reset when the preview reloads, and nothing crashes. To see them remembered, run your finished page from a file or a local server, or try the [live demo](https://theoyanvno.github.io/sticky-notes/app/).\n\nThe saved object has a `version` number. That's for the future: if the format ever changes, the app can tell an old file from a new one (the real app does exactly that with notes from version 1.0).",
   "checks": [
    {
     "pane": "js",
     "label": "a save() function",
     "test": "/function\\s+save\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "saving waits for a pause",
     "test": "/clearTimeout\\(\\s*saveTimer\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "notes are written to localStorage",
     "test": "/localStorage\\.setItem\\(/"
    },
    {
     "pane": "js",
     "label": "notes load at start",
     "test": "/let\\s+notes\\s*=\\s*load\\(\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why does save() wait 250 ms instead of saving on every change?",
     "options": [
      "Typing makes a change per key; waiting for a pause writes once per burst instead",
      "localStorage only works every 250 ms",
      "To lose fewer notes"
     ],
     "answer": 0,
     "why": "That's debouncing: each new change restarts the timer."
    },
    {
     "q": "What happens in this guide's preview when localStorage is blocked?",
     "options": [
      "The page crashes",
      "The catch block keeps the app working in memory; notes just aren't remembered",
      "The notes are saved somewhere else"
     ],
     "answer": 1,
     "why": "Code that might fail for reasons outside your control should fail gracefully."
    }
   ],
   "session": 3,
   "minutes": 15,
   "js": {
    "storage": "const KEY = 'sticky-notes-guide';\nlet saveTimer = null;\n\n// Saves a quarter of a second after the last change, so typing doesn't write on every key.\nfunction save() {\n  clearTimeout(saveTimer);\n  saveTimer = setTimeout(() => {\n    try {\n      localStorage.setItem(KEY, JSON.stringify({ app: 'sticky-notes', version: 2, notes }));\n    } catch { /* storage blocked (private mode, a sandbox): keep working in memory */ }\n  }, 250);\n}\n\nfunction load() {\n  try {\n    const saved = localStorage.getItem(KEY);\n    if (saved) return JSON.parse(saved).notes;\n  } catch { /* blocked or damaged: start fresh */ }\n  const first = createNote([]);\n  return [{ ...first, body: 'Hi! Pick a color at the top, ☑ makes a checklist, + makes another note (up to 3).' }];\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = load();\n\nconst area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  save();\n  if (rerender) keepFocus(render);\n}\n\nfunction addNote(fromId) {\n  const from = notes.find((n) => n.id === fromId);\n  const note = createNote(notes, { from, area: area() });\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  save();\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  save();\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\n// Dragging a note by its top bar (but not by its buttons).\nfunction draggable(card, note) {\n  const bar = card.querySelector('.note-bar');\n  bar.addEventListener('pointerdown', (e) => {\n    if (e.button !== 0 || e.target.closest('button')) return;\n    e.preventDefault();\n    notes = toFront(notes, note.id);\n    desk.append(card);                                   // on top while dragging\n    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };\n    card.classList.add('dragging');\n    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar\n    const move = (ev) => {\n      const a = area();\n      // keep the whole note on the desk\n      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));\n      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));\n      card.style.left = `${x}px`;\n      card.style.top = `${y}px`;\n    };\n    const up = () => {\n      card.classList.remove('dragging');\n      bar.removeEventListener('pointermove', move);\n      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);\n    };\n    bar.addEventListener('pointermove', move);\n    bar.addEventListener('pointerup', up, { once: true });\n    bar.addEventListener('pointercancel', up, { once: true });\n  });\n  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes\n  new ResizeObserver(() => {\n    const w = card.offsetWidth;\n    const h = card.offsetHeight;\n    const current = notes.find((n) => n.id === note.id);\n    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {\n      update(note.id, (n) => updateNote(n, { w, h }), false);\n    }\n  }).observe(card);\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    draggable(card, note);\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());"
   }
  },
  {
   "title": "Never trust saved data",
   "body": "Whatever comes out of storage might be old, edited by hand, or damaged. Instead of trusting it, **`normalize()`** rebuilds clean data from anything:\n\n| Problem | What `cleanNote()` does |\n|---|---|\n| missing or strange id | drops the note |\n| text that isn't a string, or is huge | empty string, or cut to 20,000 characters |\n| unknown color | the first color |\n| position or size out of range, or not a number | clamped, or a default |\n| checklist items without ids | dropped; at most 500 kept |\n| the same note twice | only the first is kept |\n| more than three notes | the three edited most recently stay |\n\nHelpers make each rule one line: `text()` for strings, `num()` for clamped numbers, `validId()` for ids (letters, digits, `_` and `-`, up to 64). `load()` now returns `normalize(JSON.parse(saved)).notes`, so the rest of the app can assume every note is valid.\n\n**Other tabs.** If the app is open in two tabs, a change in one should show in the other. The browser fires a **`storage`** event in every *other* tab when `localStorage` changes, so the app listens for its own key and reloads its notes.\n\n### Try it\n\nIn the console, try `normalize({ notes: [{ id: 'a', color: 'purple', x: 1e9 }, { id: 'a' }, null] })`: one note, yellow, with `x` clamped to 5,000.",
   "checks": [
    {
     "pane": "js",
     "label": "a normalize() function",
     "test": "/function\\s+normalize\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "numbers are clamped",
     "test": "/const\\s+num\\s*=/"
    },
    {
     "pane": "js",
     "label": "loading repairs the data",
     "test": "/return\\s+normalize\\(\\s*JSON\\.parse\\(\\s*saved\\s*\\)\\s*\\)\\.notes/"
    },
    {
     "pane": "js",
     "label": "other tabs stay in sync",
     "test": "/addEventListener\\(\\s*['\"]storage['\"]/"
    }
   ],
   "quiz": [
    {
     "q": "Why rebuild saved notes field by field instead of using JSON.parse() directly?",
     "options": [
      "JSON.parse is slow",
      "The saved text could be old, hand-edited or damaged, and one bad field shouldn't break the whole app",
      "JSON can't store notes"
     ],
     "answer": 1,
     "why": "Validating at the edge means the rest of the code can trust every note it sees."
    },
    {
     "q": "When does the storage event fire?",
     "options": [
      "In the same tab after every save",
      "In the other tabs of the same site when localStorage changes",
      "When the page loads"
     ],
     "answer": 1,
     "why": "It's how tabs tell each other that the shared storage changed."
    }
   ],
   "session": 3,
   "minutes": 15,
   "js": {
    "storage": "// Saved data can be old, hand-edited or damaged. Turn anything into valid notes, dropping what can't be fixed.\nconst text = (v, max = 20000) => (typeof v === 'string' ? v.slice(0, max) : '');\nconst num = (v, fallback, min, max) => (Number.isFinite(v) ? Math.round(Math.min(max, Math.max(min, v))) : fallback);\nconst validId = (v) => (typeof v === 'string' && /^[\\w-]{1,64}$/.test(v) ? v : null);\n\nfunction cleanNote(n) {\n  if (!n || typeof n !== 'object' || !validId(n.id)) return null;\n  const now = stamp();\n  const checklist = Array.isArray(n.checklist)\n    ? n.checklist.filter((i) => i && validId(i.id)).slice(0, 500).map((i) => ({ id: i.id, text: text(i.text, 500), done: i.done === true }))\n    : [];\n  return {\n    id: n.id,\n    body: text(n.body),\n    list: n.list === true,\n    checklist,\n    color: COLORS.includes(n.color) ? n.color : COLORS[0],\n    x: num(n.x, 40, 0, 5000), y: num(n.y, 40, 0, 5000),\n    w: num(n.w, SIZE.w, SIZE.minW, 1200), h: num(n.h, SIZE.h, SIZE.minH, 1200),\n    created: typeof n.created === 'string' ? n.created : now,\n    updated: typeof n.updated === 'string' ? n.updated : now,\n  };\n}\n\n// Only three notes are allowed; if a file has more, the three edited most recently stay.\nfunction normalize(raw) {\n  const seen = new Set();\n  let list = (Array.isArray(raw?.notes) ? raw.notes : []).map(cleanNote).filter((n) => n && !seen.has(n.id) && seen.add(n.id));\n  if (list.length > MAX_NOTES) {\n    const keep = new Set([...list].sort((a, b) => Date.parse(b.updated) - Date.parse(a.updated)).slice(0, MAX_NOTES).map((n) => n.id));\n    list = list.filter((n) => keep.has(n.id));\n  }\n  return { app: 'sticky-notes', version: 2, notes: list };\n}\n\nconst KEY = 'sticky-notes-guide';\nlet saveTimer = null;\n\n// Saves a quarter of a second after the last change, so typing doesn't write on every key.\nfunction save() {\n  clearTimeout(saveTimer);\n  saveTimer = setTimeout(() => {\n    try {\n      localStorage.setItem(KEY, JSON.stringify({ app: 'sticky-notes', version: 2, notes }));\n    } catch { /* storage blocked (private mode, a sandbox): keep working in memory */ }\n  }, 250);\n}\n\nfunction load() {\n  try {\n    const saved = localStorage.getItem(KEY);\n    if (saved) return normalize(JSON.parse(saved)).notes;\n  } catch { /* blocked or damaged: start fresh */ }\n  const first = createNote([]);\n  return [{ ...first, body: 'Hi! Pick a color at the top, ☑ makes a checklist, + makes another note (up to 3).' }];\n}",
    "ui": "const desk = document.getElementById('desk');\nlet notes = load();\n\nconst area = () => ({ x: 0, y: 0, width: Math.max(desk.clientWidth, SIZE.w + 80), height: Math.max(desk.clientHeight, SIZE.h + 80) });\n\n// Every change goes through here: replace the note with a changed copy, then redraw.\nfunction update(id, fn, rerender = true) {\n  notes = notes.map((n) => (n.id === id ? fn(n) : n));\n  save();\n  if (rerender) keepFocus(render);\n}\n\nfunction addNote(fromId) {\n  const from = notes.find((n) => n.id === fromId);\n  const note = createNote(notes, { from, area: area() });\n  if (!note) return;                     // already three\n  notes = [...notes, note];\n  save();\n  render();\n  desk.querySelector(`[data-id=\"${note.id}\"] textarea`)?.focus();\n}\n\nfunction removeNote(id) {\n  notes = remove(notes, id);\n  save();\n  render();\n}\n\n// What each button and field on a note does.\nfunction actionsFor(note) {\n  const change = (fn, rerender = true) => update(note.id, fn, rerender);\n  return {\n    color: (color) => change((n) => updateNote(n, { color })),\n    text: (body) => change((n) => updateNote(n, { body }), false),   // typing: save it, but don't redraw\n    add: () => addNote(note.id),\n    remove: () => removeNote(note.id),\n    list: (on) => change((n) => setList(n, on)),\n    addItem: (text) => change((n) => addItem(n, text)),\n    toggleItem: (itemId) => change((n) => toggleItem(n, itemId)),\n    editItem: (itemId, text) => change((n) => editItem(n, itemId, text), false),\n    removeItem: (itemId) => change((n) => removeItem(n, itemId)),\n  };\n}\n\n// Dragging a note by its top bar (but not by its buttons).\nfunction draggable(card, note) {\n  const bar = card.querySelector('.note-bar');\n  bar.addEventListener('pointerdown', (e) => {\n    if (e.button !== 0 || e.target.closest('button')) return;\n    e.preventDefault();\n    notes = toFront(notes, note.id);\n    desk.append(card);                                   // on top while dragging\n    const start = { x: e.clientX, y: e.clientY, left: note.x, top: note.y };\n    card.classList.add('dragging');\n    bar.setPointerCapture(e.pointerId);                 // keep getting moves even off the bar\n    const move = (ev) => {\n      const a = area();\n      // keep the whole note on the desk\n      const x = Math.max(0, Math.min(start.left + ev.clientX - start.x, a.width - card.offsetWidth));\n      const y = Math.max(0, Math.min(start.top + ev.clientY - start.y, a.height - Math.min(card.offsetHeight, a.height)));\n      card.style.left = `${x}px`;\n      card.style.top = `${y}px`;\n    };\n    const up = () => {\n      card.classList.remove('dragging');\n      bar.removeEventListener('pointermove', move);\n      update(note.id, (n) => updateNote(n, { x: parseFloat(card.style.left), y: parseFloat(card.style.top) }), false);\n    };\n    bar.addEventListener('pointermove', move);\n    bar.addEventListener('pointerup', up, { once: true });\n    bar.addEventListener('pointercancel', up, { once: true });\n  });\n  // Resizing uses the grip the browser draws (CSS resize); remember the new size when it changes\n  new ResizeObserver(() => {\n    const w = card.offsetWidth;\n    const h = card.offsetHeight;\n    const current = notes.find((n) => n.id === note.id);\n    if (current && (Math.abs(current.w - w) > 1 || Math.abs(current.h - h) > 1)) {\n      update(note.id, (n) => updateNote(n, { w, h }), false);\n    }\n  }).observe(card);\n}\n\nfunction render() {\n  desk.replaceChildren(...notes.map((note) => {\n    const card = renderNote(note, actionsFor(note), { canAdd: canAdd(notes) });\n    Object.assign(card.style, { left: `${note.x}px`, top: `${note.y}px`, width: `${note.w}px`, height: `${note.h}px` });\n    draggable(card, note);\n    return card;\n  }));\n  document.getElementById('empty').hidden = notes.length > 0;\n}\n\ndocument.getElementById('firstNote').addEventListener('click', () => addNote());\n// Another tab changed the notes: show the latest\nwindow.addEventListener('storage', (e) => { if (e.key === KEY) { notes = load(); keepFocus(render); } });"
   }
  },
  {
   "title": "From the browser to the Windows desktop",
   "body": "You've now built the same notes that run in my [Sticky Notes demo](https://theoyanvno.github.io/sticky-notes/app/). The real project is also a **Windows app** made with **Electron**, and it shares almost all of this code:\n\n| File | What it does |\n|---|---|\n| `src/notes.js` | the rules you wrote: colors, the limit of three, positions, checklists |\n| `src/storage.js` | `normalize()`, plus crash-safe saving to a file |\n| `app/note-view.js` | `renderNote()`, `keepFocus()`: one note's look, shared by the desktop and the browser |\n| `app/app.js` | the browser demo: the desk, dragging, `localStorage` |\n| `main.js` | the Electron main process: one window per note, the tray icon, Ctrl+Shift+N, start with Windows |\n| `preload.cjs` | the only bridge between a note window and the main process |\n\n`src/` is plain JavaScript with no browser or Electron code, so the desktop app, the demo and the tests all use the same rules.\n\n**A window that's just a note.** On the desktop, each note is its own window with no frame and a see-through background, so only the note and its shadow show:\n\n```js\nconst win = new BrowserWindow({\n  x: n.x, y: n.y, width: n.w + 2 * MARGIN, height: n.h + 2 * MARGIN,\n  title: label(n), icon: ICON, frame: false, transparent: true, backgroundColor: '#00000000', hasShadow: false,\n  // Transparent windows can't be resized from their edges, so the note has its own corner grip (note:resize)\n  resizable: false, maximizable: false, fullscreenable: false,\n  show: false, skipTaskbar: true, webPreferences: secureWebPreferences,\n});\n```\n\n**Security.** Note pages run with `contextIsolation: true`, `nodeIntegration: false` and `sandbox: true`, so a page can't touch files or run system commands. `preload.cjs` hands each page exactly five functions with `contextBridge` (get, save, new, delete, resize) and nothing else.\n\n**Who owns what.** The page owns what's written on a note; the window owns where it is. When a page saves, the main process takes only the text, checklist and color from it, and position and size come from the window's own move and resize events. Neither can overwrite the other with an old value.\n\n**Saving without ever losing a file.** The desktop app saves to `sticky-notes.json`, and a crash or power cut in the middle of writing could leave half a file. So it never writes over the real file directly:\n\n```svg Crash-safe saving: a temporary file, flushed, then renamed over the old one\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 428 100\" font-family=\"sans-serif\"><rect x=\"6\" y=\"20\" width=\"97\" height=\"44\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"54\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">write</text><text x=\"54\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">sticky-notes.json.tmp</text><line x1=\"103\" y1=\"42\" x2=\"111\" y2=\"42\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"111\" y=\"20\" width=\"97\" height=\"44\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"159\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">flush it</text><text x=\"159\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">to disk</text><line x1=\"208\" y1=\"42\" x2=\"216\" y2=\"42\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"216\" y=\"20\" width=\"97\" height=\"44\" rx=\"6\" fill=\"#ffedd5\" stroke=\"#475569\"/><text x=\"264\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">copy old file</text><text x=\"264\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">to .bak</text><line x1=\"313\" y1=\"42\" x2=\"321\" y2=\"42\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"321\" y=\"20\" width=\"97\" height=\"44\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"369\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">rename .tmp over</text><text x=\"369\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">the old file</text><text x=\"214\" y=\"88\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">a crash at any point leaves either the old file or the new one, never half of one</text></svg>\n```\n\nRenaming is atomic on the same disk: at any moment there's either the whole old file or the whole new one. If the main file is ever damaged anyway, the app loads `.bak` and keeps the damaged copy as `.corrupt` for inspection.\n\n**Tests.** Unit tests check the rules and saving with `node --test`. On GitHub Actions, an **end-to-end test** starts the real Electron app under a virtual screen, types in a note, makes a checklist, presses + up to the limit, deletes a note, restarts and checks what was saved. Then it builds the Windows installer.",
   "session": 4,
   "minutes": 10,
   "kind": "read"
  }
 ],
 "finish": "### What you learned\n\n- Keeping state as plain objects, changed only by small functions that return copies\n- Drawing the page from data with a tiny `el()` helper, and keeping typed text out of HTML\n- Rules that live with the data: a limit of three, free colors, fitting new notes on screen\n- Reversible features: a checklist that turns back into text without losing a word\n- Keeping focus and the cursor across redraws with stable keys\n- Pointer events and pointer capture for dragging, CSS `resize` and `ResizeObserver` for resizing\n- Debounced saving to `localStorage`, failing gracefully, and repairing whatever comes back\n\n### Challenges\n\n1. **Phones:** below 600 pixels wide, stack the notes in a column instead of floating them (hint: a media query with `position: static`).\n2. **Keyboard shortcut:** make Ctrl+Shift+N add a note, like the desktop app.\n3. **Delete with undo:** instead of a second click, delete at once and show \"Undo\" for five seconds.\n4. **Export:** a button that downloads your notes as a `.json` file (hint: `Blob` and `URL.createObjectURL`).\n5. **Window titles:** write `label(note)`: the first line of text, or the first checklist item, cut to 40 characters with \"…\".\n\nCompare your notes with the [live demo](https://theoyanvno.github.io/sticky-notes/app/) and the [source code](https://github.com/TheoYanvno/sticky-notes)."
};
