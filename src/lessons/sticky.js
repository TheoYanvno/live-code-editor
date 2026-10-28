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
  }
 ],
 "finish": "### What you learned\n\n- Keeping state as plain objects, changed only by small functions that return copies\n- Drawing the page from data with a tiny `el()` helper, and keeping typed text out of HTML\n- Rules that live with the data: a limit of three, free colors, fitting new notes on screen\n- Reversible features: a checklist that turns back into text without losing a word\n- Keeping focus and the cursor across redraws with stable keys\n- Pointer events and pointer capture for dragging, CSS `resize` and `ResizeObserver` for resizing\n- Debounced saving to `localStorage`, failing gracefully, and repairing whatever comes back\n\n### Challenges\n\n1. **Phones:** below 600 pixels wide, stack the notes in a column instead of floating them (hint: a media query with `position: static`).\n2. **Keyboard shortcut:** make Ctrl+Shift+N add a note, like the desktop app.\n3. **Delete with undo:** instead of a second click, delete at once and show \"Undo\" for five seconds.\n4. **Export:** a button that downloads your notes as a `.json` file (hint: `Blob` and `URL.createObjectURL`).\n5. **Window titles:** write `label(note)`: the first line of text, or the first checklist item, cut to 40 characters with \"…\".\n\nCompare your notes with the [live demo](https://theoyanvno.github.io/sticky-notes/app/) and the [source code](https://github.com/TheoYanvno/sticky-notes)."
};
