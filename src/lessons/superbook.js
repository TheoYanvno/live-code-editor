// Built from guides/superbook.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "superbook",
 "title": "SuperBook",
 "goals": [
  "Lay out a scene in CSS and draw simple symbols in SVG",
  "Load chapters from three public web APIs with fetch, async and await, and handle slow or failed requests",
  "Turn three different API answers into one shape, and cache them",
  "Match a free-typed question to a topic by normalizing, stemming and scoring keywords",
  "Animate text being written into sand on a canvas, with particles and a wind effect",
  "Switch the page between languages, including right-to-left Hebrew"
 ],
 "prereqs": [
  "HTML, CSS and JavaScript basics (functions, arrays, objects, template literals)",
  "Arrow functions and array map, filter and some",
  "Promises help: async and await are explained in step 3"
 ],
 "sessions": [
  {
   "title": "Three books in the desert",
   "from": 0,
   "to": 1
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
   "lang": "",
   "books": "",
   "reader": "",
   "topics": "",
   "ask": "",
   "sand": "",
   "ui": ""
  }
 },
 "steps": [
  {
   "title": "A desert with three books",
   "body": "Welcome! In this guide you'll rebuild my [SuperBook](https://theoyanvno.github.io/SuperBook/): three books resting in a desert at dusk, the **Tanakh**, the **Holy Bible** and the **Qur'an**. Click one to read it, chapter by chapter, loaded live from free public APIs. Ask a question about how they differ and the answer is **written into the sand**, letter by letter.\n\nThis first step is the scene:\n\n```svg The scene is layers of CSS gradients behind three buttons\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 190\" font-family=\"sans-serif\" font-size=\"11\"><defs><linearGradient id=\"sk\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2a1a4a\"/><stop offset=\".55\" stop-color=\"#8a3b5c\"/><stop offset=\"1\" stop-color=\"#f7c873\"/></linearGradient></defs><rect x=\"10\" y=\"10\" width=\"220\" height=\"170\" rx=\"8\" fill=\"url(#sk)\"/><circle cx=\"120\" cy=\"112\" r=\"22\" fill=\"#fde68a\" opacity=\".9\"/><ellipse cx=\"110\" cy=\"190\" rx=\"150\" ry=\"62\" fill=\"#c8924d\"/><ellipse cx=\"140\" cy=\"200\" rx=\"140\" ry=\"44\" fill=\"#e9c98f\"/><rect x=\"70\" y=\"60\" width=\"26\" height=\"36\" rx=\"3\" fill=\"#2b4fb3\"/><rect x=\"107\" y=\"60\" width=\"26\" height=\"36\" rx=\"3\" fill=\"#a33232\"/><rect x=\"144\" y=\"60\" width=\"26\" height=\"36\" rx=\"3\" fill=\"#1f7a43\"/><g fill=\"#1f2937\"><text x=\"244\" y=\"30\">.sky  fixed, behind everything</text><text x=\"244\" y=\"52\">  linear-gradient: night to sunset</text><text x=\"244\" y=\"80\">.sun  radial-gradient circle</text><text x=\"244\" y=\"108\">.dune  wide ellipses: border-radius</text><text x=\"244\" y=\"124\">  50% 50% 0 0 / 100% 100% 0 0</text><text x=\"244\" y=\"152\">.book  buttons with an SVG symbol,</text><text x=\"244\" y=\"168\">  a spine shadow and a hover lift</text></g></svg>\n```\n\n- **The sky** is a `div` with `position: fixed; inset: 0; z-index: -1`, so it fills the window behind everything and stays put when the page scrolls. A `linear-gradient` goes from night purple to sunset gold.\n- **The sun** is a circle drawn with a `radial-gradient` that fades to transparent at the edge, so it glows.\n- **The dunes** are very wide boxes with `border-radius: 50% 50% 0 0 / 100% 100% 0 0`: before the slash is the horizontal radius of each corner, after it the vertical one. Rounding only the top corners, as tall as the box, makes a smooth hill.\n\n**The books are buttons**, not `div`s: they can be reached with Tab and pressed with Enter or Space, with no extra code. Each has a cover symbol in inline SVG:\n\n```svg Each cover symbol is two or three simple shapes\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 170\" font-family=\"sans-serif\"><g transform=\"translate(20 10)\"><rect width=\"110\" height=\"110\" rx=\"8\" fill=\"#0f172a\"/><svg x=\"5\" y=\"5\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" fill=\"none\" stroke=\"#e8c46a\" stroke-width=\"4\"><polygon points=\"50,14 82,70 18,70\"/><polygon points=\"50,86 18,30 82,30\"/></svg><text x=\"55\" y=\"132\" text-anchor=\"middle\" font-size=\"10\">two triangles, one upside down</text></g><g transform=\"translate(160 10)\"><rect width=\"110\" height=\"110\" rx=\"8\" fill=\"#0f172a\"/><svg x=\"5\" y=\"5\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" fill=\"none\" stroke=\"#e8c46a\" stroke-width=\"4\"><path d=\"M44 14h12v24h20v12H56v36H44V50H24V38h20z\"/></svg><text x=\"55\" y=\"132\" text-anchor=\"middle\" font-size=\"10\">one path: 12 corners</text></g><g transform=\"translate(300 10)\"><rect width=\"110\" height=\"110\" rx=\"8\" fill=\"#0f172a\"/><svg x=\"5\" y=\"5\" width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" fill=\"none\" stroke=\"#e8c46a\" stroke-width=\"4\"><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\"/><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\" transform=\"rotate(45 50 50)\"/><circle cx=\"50\" cy=\"50\" r=\"9\"/></svg><text x=\"55\" y=\"132\" text-anchor=\"middle\" font-size=\"10\">two squares, one turned 45°</text></g><text x=\"215\" y=\"162\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">each symbol is a few shapes in a 100 × 100 box, drawn with a stroke</text></svg>\n```\n\nThe SVGs have `fill: none` and a gold `stroke`, so they're drawn as outlines, and `aria-hidden=\"true\"`, because the title under them already says which book it is.\n\n**The reader** is a `<dialog>`. `showModal()` opens it on top of the page, dims everything behind it with the `::backdrop`, keeps keyboard focus inside it, and closes on Escape. A click on the dark backdrop lands on the dialog element itself, so `e.target === $('reader')` means \"clicked outside the content\": close it.\n\n### Try it\n\nHover a book; open each one; close with ✕, Escape and a click outside.",
   "checks": [
    {
     "pane": "html",
     "label": "three books as buttons",
     "test": "/class=\"book tanakh\"/"
    },
    {
     "pane": "html",
     "label": "a dialog for reading",
     "test": "/<dialog id=\"reader\"/"
    },
    {
     "pane": "js",
     "label": "open it on top of the page",
     "test": "/showModal\\(\\)/"
    },
    {
     "pane": "js",
     "label": "an openBook() function",
     "test": "/function\\s+openBook\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why make the books <button>s instead of clickable <div>s?",
     "options": [
      "Buttons are faster to draw",
      "Buttons can be reached with Tab and pressed from the keyboard, with no extra code",
      "Divs can't have click listeners"
     ],
     "answer": 1,
     "why": "Use the element that already behaves the way you need."
    },
    {
     "q": "What does showModal() give you that setting the dialog visible with CSS does not?",
     "options": [
      "Nothing",
      "A backdrop, focus kept inside the dialog, and closing on Escape",
      "Automatic loading of the text"
     ],
     "answer": 1,
     "why": "The browser handles the hard parts of a modal for you."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<div class=\"sky\" aria-hidden=\"true\"><div class=\"sun\"></div><div class=\"dune far\"></div><div class=\"dune near\"></div></div>\n<header class=\"top\">\n  <h1>SuperBook</h1>\n  <p class=\"tagline\">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>\n</header>\n<main>\n  <div class=\"books\">\n    <button class=\"book tanakh\" data-book=\"tanakh\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><polygon points=\"50,14 82,70 18,70\"/><polygon points=\"50,86 18,30 82,30\"/></svg>\n      <span class=\"title\">Tanakh</span>\n      <span class=\"faith\">Judaism</span>\n    </button>\n    <button class=\"book bible\" data-book=\"bible\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><path d=\"M44 14h12v24h20v12H56v36H44V50H24V38h20z\"/></svg>\n      <span class=\"title\">Holy Bible</span>\n      <span class=\"faith\">Christianity</span>\n    </button>\n    <button class=\"book quran\" data-book=\"quran\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\"/><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\" transform=\"rotate(45 50 50)\"/><circle cx=\"50\" cy=\"50\" r=\"9\"/></svg>\n      <span class=\"title\">Qur'an</span>\n      <span class=\"faith\">Islam</span>\n    </button>\n  </div>\n</main>\n<dialog id=\"reader\" class=\"reader\">\n  <header>\n    <div><h2 id=\"readerTitle\"></h2><p id=\"readerFaith\" class=\"muted\"></p></div>\n    <button id=\"close\" class=\"close\" aria-label=\"Close book\">✕</button>\n  </header>\n  <div id=\"verses\" class=\"verses\"></div>\n</dialog>"
   },
   "css": {
    "base": ":root { --ink: #2b1a0e; --sand: #e9c98f; --sand-dark: #c89a55; --tanakh: #1e3a8a; --bible: #7f1d1d; --quran: #14532d; --gold: #e8c46a; }\n* { box-sizing: border-box; }\nbody { margin: 0; min-height: 100vh; font-family: Georgia, \"Times New Roman\", serif; color: #fff7e6; background: #2a1a3a; overflow-x: hidden; }\n.sky { position: fixed; inset: 0; z-index: -1; background: linear-gradient(#2a1a4a 0%, #8a3b5c 40%, #f08a4b 62%, #f7c873 72%); }\n.sun { position: absolute; left: 50%; top: 52%; width: 140px; height: 140px; margin-left: -70px; border-radius: 50%; background: radial-gradient(circle, #fff3c4, #f7b955 60%, transparent 70%); }\n.dune { position: absolute; left: -10%; right: -10%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; }\n.dune.far { bottom: 0; height: 38%; background: linear-gradient(#d9a35c, #b77b3a); }\n.dune.near { bottom: -6%; height: 30%; left: -30%; background: linear-gradient(var(--sand), var(--sand-dark)); }\n.top { text-align: center; padding: 28px 16px 6px; position: relative; }\nh1 { margin: 0; font-size: clamp(2.2rem, 7vw, 3.4rem); letter-spacing: .08em; text-shadow: 0 2px 14px rgba(0, 0, 0, .35); }\n.tagline { max-width: 560px; margin: 6px auto 0; opacity: .92; }\n.lang { position: absolute; top: 12px; inset-inline-end: 14px; font-size: .85rem; }\n.lang select, .ask input, .pickers select { font: inherit; border-radius: 8px; border: 1px solid #c8a46a; background: #fffaf0; color: var(--ink); padding: 6px 8px; }\nmain { max-width: 900px; margin: 0 auto; padding: 18px 16px 40px; }\n.books { display: flex; justify-content: center; gap: clamp(12px, 4vw, 36px); flex-wrap: wrap; margin: 14px 0 26px; }\n.book { width: 150px; height: 200px; border: 0; border-radius: 6px 12px 12px 6px; cursor: pointer; color: var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;\n        box-shadow: inset 8px 0 0 rgba(0, 0, 0, .25), 0 14px 22px rgba(0, 0, 0, .35); transition: transform .25s; font: inherit; }\n.book:hover, .book:focus-visible { transform: translateY(-8px) rotate(-1deg); }\n.book.tanakh { background: linear-gradient(135deg, #2b4fb3, var(--tanakh)); }\n.book.bible { background: linear-gradient(135deg, #a33232, var(--bible)); }\n.book.quran { background: linear-gradient(135deg, #1f7a43, var(--quran)); }\n.symbol { width: 70px; height: 70px; fill: none; stroke: var(--gold); stroke-width: 4; stroke-linejoin: round; }\n.title { font-size: 1.15rem; font-weight: bold; }\n.faith { font-size: .8rem; opacity: .85; }\n.ask label { display: block; text-align: center; font-size: 1.4rem; margin-bottom: 8px; text-shadow: 0 1px 8px rgba(0, 0, 0, .4); }\n.ask .row { display: flex; gap: 8px; }\n.ask input { flex: 1; padding: 10px 12px; }\nbutton { font: inherit; }\n.ask button, .smooth, .reader footer button { border: 0; border-radius: 8px; padding: 8px 16px; background: #6b3f1d; color: #fff7e6; cursor: pointer; }\n.answer, .sand-wrap { margin-top: 16px; border-radius: 14px; color: var(--ink);\n        background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, .25) 0 1px, transparent 2px) 0 0 / 7px 7px, linear-gradient(#efd3a0, #ddb67a); box-shadow: inset 0 2px 10px rgba(110, 70, 20, .35); }\n.answer { padding: 14px 20px; }\n.answer h3 { margin: 0 0 8px; }\n.sand-wrap { padding: 6px; }\n#sand { display: block; width: 100%; height: 0; }\n.smooth { margin: 6px auto 8px; display: block; }\n.reader { width: min(760px, 94vw); max-height: 88vh; border: 0; border-radius: 14px; padding: 0; color: var(--ink); background: #fdf6e7; display: flex; flex-direction: column; }\n.reader:not([open]) { display: none; }\n.reader::backdrop { background: rgba(20, 10, 30, .6); }\n.reader header { display: flex; justify-content: space-between; align-items: start; padding: 16px 20px 6px; color: #fff7e6; }\n.reader.tanakh header { background: var(--tanakh); } .reader.bible header { background: var(--bible); } .reader.quran header { background: var(--quran); }\n.reader h2 { margin: 0; }\n.muted { margin: 2px 0 8px; opacity: .8; }\n.close { background: none; border: 0; color: inherit; font-size: 1.3rem; cursor: pointer; }\n.pickers { display: flex; flex-wrap: wrap; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #ead9b8; }\n.verses { overflow-y: auto; padding: 8px 20px; flex: 1; line-height: 1.6; }\n.verse sup { color: #a0682d; margin-inline-end: 3px; }\n.original { display: block; font-size: 1.15rem; color: #4b3621; margin-top: 2px; }\n.loading { color: #7a5a3a; font-style: italic; }\n.reader footer { display: flex; justify-content: space-between; padding: 10px 20px 14px; border-top: 1px solid #ead9b8; }\n.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }\n@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }"
   },
   "js": {
    "reader": "const INFO = {\n  tanakh: { title: 'Tanakh', faith: 'Judaism' },\n  bible: { title: 'Holy Bible', faith: 'Christianity' },\n  quran: { title: \"Qur'an\", faith: 'Islam' },\n};\n\nfunction openBook(key) {\n  $('reader').className = `reader ${key}`;            // the header takes the book's color\n  $('readerTitle').textContent = INFO[key].title;\n  $('readerFaith').textContent = INFO[key].faith;\n  $('verses').innerHTML = '<p class=\"loading\">The pages arrive in the next sessions.</p>';\n  $('reader').showModal();\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));\n\n// ---------- Reader ----------\ndocument.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));\n$('close').onclick = () => $('reader').close();\n// A click on the dark backdrop lands on the dialog itself: close it\n$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });"
   }
  },
  {
   "title": "A table of contents",
   "body": "Each book needs a **table of contents**: its books (or surahs) and how many chapters each has. The `books` block holds the real lists from SuperBook:\n\n| Book | Contents | Order |\n|---|---|---|\n| Tanakh | 39 books, as `[name, chapters]` | the Jewish order: Torah, Prophets, Writings |\n| Holy Bible | 79 entries covering the Eastern Orthodox Bible, as `[api id, chapters, label]` | the Septuagint order, then the New Testament |\n| Qur'an | 114 surahs, each read whole | for now just numbered; their names come from the web in step 4 |\n\nThe Bible's entries have a separate **label** because the API and the reader want different names: the API knows `1 Samuel`, but Orthodox Bibles call it `1 Kingdoms`. `([id, chapters, label = id]) => …` destructures each entry and uses the id when there's no label.\n\n`BOOKS` gives all three the same fields (`sections`, `sectionWord`), so one reader works for any of them.\n\n**Two pickers.** Opening a book fills the first `<select>` with its sections, and `fillChapters()` fills the second with `1 … n` for the chosen one. A surah is read whole, so the chapter picker is hidden for the Qur'an.\n\n**Previous and next cross books.** `step(dir)` adds `+1` or `-1` to the chapter, and when that runs off either end of a book, moves to the neighbouring book:\n\n```svg Next and Previous continue into the next or previous book\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 130\" font-family=\"sans-serif\" font-size=\"11\"><rect x=\"10\" y=\"20\" width=\"180\" height=\"40\" rx=\"6\" fill=\"#e2e8f0\"/><text x=\"20\" y=\"38\" font-weight=\"700\">Genesis</text><text x=\"20\" y=\"53\">chapters 1 … 50</text><rect x=\"240\" y=\"20\" width=\"180\" height=\"40\" rx=\"6\" fill=\"#e2e8f0\"/><text x=\"250\" y=\"38\" font-weight=\"700\">Exodus</text><text x=\"250\" y=\"53\">chapters 1 … 40</text><path d=\"M150 50 C 190 90, 230 90, 262 52\" fill=\"none\" stroke=\"#15803d\" stroke-width=\"2\"/><text x=\"200\" y=\"98\" text-anchor=\"middle\" fill=\"#15803d\">Next on 50 → Exodus 1</text><path d=\"M262 30 C 230 0, 190 0, 150 30\" fill=\"none\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"205\" y=\"12\" text-anchor=\"middle\" fill=\"#b91c1c\">Previous on 1 → Genesis 50</text><text x=\"215\" y=\"122\" text-anchor=\"middle\" fill=\"#475569\">at the very first or last chapter of the whole book, step() just stops</text></svg>\n```\n\n### Try it\n\nOpen the Bible, pick Genesis 50 and press Next. Press Previous twice. Open the Qur'an: no chapter picker.",
   "checks": [
    {
     "pane": "js",
     "label": "the Tanakh's contents",
     "test": "/const\\s+TANAKH\\s*=\\s*\\[/"
    },
    {
     "pane": "js",
     "label": "previous and next",
     "test": "/function\\s+step\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "back past chapter 1 goes to the last chapter of the book before",
     "test": "/chapter\\s*=\\s*book\\.sections\\[index\\]\\.chapters/"
    },
    {
     "pane": "html",
     "label": "a book picker",
     "test": "/id=\"section\"/"
    }
   ],
   "quiz": [
    {
     "q": "In step(-1) on Exodus 1, what happens?",
     "options": [
      "Nothing",
      "It goes to Genesis 50, the last chapter of the book before",
      "It goes to Genesis 1"
     ],
     "answer": 1,
     "why": "chapter becomes 0, so index moves back one book and chapter becomes that book's chapter count."
    },
    {
     "q": "Why does each Bible entry have both an id and a label?",
     "options": [
      "To save memory",
      "The API needs the name it knows (1 Samuel); readers see the Orthodox name (1 Kingdoms)",
      "Labels are translated by the API"
     ],
     "answer": 1,
     "why": "What a machine needs and what a person reads can differ; keep both."
    }
   ],
   "session": 0,
   "minutes": 20,
   "html": {
    "page": "<div class=\"sky\" aria-hidden=\"true\"><div class=\"sun\"></div><div class=\"dune far\"></div><div class=\"dune near\"></div></div>\n<header class=\"top\">\n  <h1>SuperBook</h1>\n  <p class=\"tagline\">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>\n</header>\n<main>\n  <div class=\"books\">\n    <button class=\"book tanakh\" data-book=\"tanakh\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><polygon points=\"50,14 82,70 18,70\"/><polygon points=\"50,86 18,30 82,30\"/></svg>\n      <span class=\"title\">Tanakh</span>\n      <span class=\"faith\">Judaism</span>\n    </button>\n    <button class=\"book bible\" data-book=\"bible\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><path d=\"M44 14h12v24h20v12H56v36H44V50H24V38h20z\"/></svg>\n      <span class=\"title\">Holy Bible</span>\n      <span class=\"faith\">Christianity</span>\n    </button>\n    <button class=\"book quran\" data-book=\"quran\">\n      <svg class=\"symbol\" viewBox=\"0 0 100 100\" aria-hidden=\"true\"><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\"/><rect x=\"27\" y=\"27\" width=\"46\" height=\"46\" transform=\"rotate(45 50 50)\"/><circle cx=\"50\" cy=\"50\" r=\"9\"/></svg>\n      <span class=\"title\">Qur'an</span>\n      <span class=\"faith\">Islam</span>\n    </button>\n  </div>\n</main>\n<dialog id=\"reader\" class=\"reader\">\n  <header>\n    <div><h2 id=\"readerTitle\"></h2><p id=\"readerFaith\" class=\"muted\"></p></div>\n    <button id=\"close\" class=\"close\" aria-label=\"Close book\">✕</button>\n  </header>\n  <div class=\"pickers\">\n    <label><span id=\"sectionLabel\">Book</span> <select id=\"section\"></select></label>\n    <label id=\"chapterWrap\"><span>Chapter</span> <select id=\"chapter\"></select></label>\n  </div>\n  <div id=\"verses\" class=\"verses\"></div>\n  <footer>\n    <button id=\"prev\">← <span>Previous</span></button>\n    <button id=\"next\"><span>Next</span> →</button>\n  </footer>\n</dialog>"
   },
   "js": {
    "books": "// Tables of contents, copied from the real src/books.js.\n// Tanakh: [name, chapters] in the Jewish order (Torah, Prophets, Writings). Names match Sefaria's API.\nconst TANAKH = [\n  [\"Genesis\", 50], [\"Exodus\", 40], [\"Leviticus\", 27], [\"Numbers\", 36], [\"Deuteronomy\", 34], [\"Joshua\", 24],\n  [\"Judges\", 21], [\"I Samuel\", 31], [\"II Samuel\", 24], [\"I Kings\", 22], [\"II Kings\", 25], [\"Isaiah\", 66],\n  [\"Jeremiah\", 52], [\"Ezekiel\", 48], [\"Hosea\", 14], [\"Joel\", 4], [\"Amos\", 9], [\"Obadiah\", 1],\n  [\"Jonah\", 4], [\"Micah\", 7], [\"Nahum\", 3], [\"Habakkuk\", 3], [\"Zephaniah\", 3], [\"Haggai\", 2],\n  [\"Zechariah\", 14], [\"Malachi\", 3], [\"Psalms\", 150], [\"Proverbs\", 31], [\"Job\", 42], [\"Song of Songs\", 8],\n  [\"Ruth\", 4], [\"Lamentations\", 5], [\"Ecclesiastes\", 12], [\"Esther\", 10], [\"Daniel\", 12], [\"Ezra\", 10],\n  [\"Nehemiah\", 13], [\"I Chronicles\", 29], [\"II Chronicles\", 36],\n];\n\n// Eastern Orthodox Bible: [id for bible-api.com, chapters, label]. The id is what the API understands; the label is what readers see.\nconst BIBLE = [\n  [\"Genesis\", 50], [\"Exodus\", 40], [\"Leviticus\", 27], [\"Numbers\", 36], [\"Deuteronomy\", 34],\n  [\"Joshua\", 24], [\"Judges\", 21], [\"Ruth\", 4], [\"1 Samuel\", 31, \"1 Kingdoms (1 Samuel)\"], [\"2 Samuel\", 24, \"2 Kingdoms (2 Samuel)\"],\n  [\"1 Kings\", 22, \"3 Kingdoms (1 Kings)\"], [\"2 Kings\", 25, \"4 Kingdoms (2 Kings)\"], [\"1 Chronicles\", 29], [\"2 Chronicles\", 36], [\"Prayer of Manasses\", 1, \"Prayer of Manasseh\"],\n  [\"1 Esdras\", 9], [\"Ezra\", 10, \"2 Esdras (Ezra)\"], [\"Nehemiah\", 13], [\"Tobit\", 14], [\"Judith\", 16],\n  [\"Esther\", 10], [\"1 Maccabees\", 16], [\"2 Maccabees\", 15], [\"3 Maccabees\", 7], [\"Psalms\", 150],\n  [\"Job\", 42], [\"Proverbs\", 31], [\"Ecclesiastes\", 12], [\"Song of Solomon\", 8, \"Song of Songs\"], [\"Wisdom\", 19, \"Wisdom of Solomon\"],\n  [\"Sirach\", 51], [\"Hosea\", 14], [\"Amos\", 9], [\"Micah\", 7], [\"Joel\", 3],\n  [\"Obadiah\", 1], [\"Jonah\", 4], [\"Nahum\", 3], [\"Habakkuk\", 3], [\"Zephaniah\", 3],\n  [\"Haggai\", 2], [\"Zechariah\", 14], [\"Malachi\", 4], [\"Isaiah\", 66], [\"Jeremiah\", 52],\n  [\"Baruch\", 5], [\"Lamentations\", 5], [\"Ezekiel\", 48], [\"Daniel\", 12], [\"sus\", 1, \"Susanna\"],\n  [\"Bel and the Dragon\", 1], [\"4 Maccabees\", 18, \"4 Maccabees (appendix)\"], [\"Matthew\", 28], [\"Mark\", 16], [\"Luke\", 24],\n  [\"John\", 21], [\"Acts\", 28], [\"Romans\", 16], [\"1 Corinthians\", 16], [\"2 Corinthians\", 13],\n  [\"Galatians\", 6], [\"Ephesians\", 6], [\"Philippians\", 4], [\"Colossians\", 4], [\"1 Thessalonians\", 5],\n  [\"2 Thessalonians\", 3], [\"1 Timothy\", 6], [\"2 Timothy\", 4], [\"Titus\", 3], [\"Philemon\", 1],\n  [\"Hebrews\", 13], [\"James\", 5], [\"1 Peter\", 5], [\"2 Peter\", 3], [\"1 John\", 5],\n  [\"2 John\", 1], [\"3 John\", 1], [\"Jude\", 1], [\"Revelation\", 22],\n];\n\nconst BOOKS = {\n  tanakh: {\n    sectionWord: 'Book',\n    sections: TANAKH.map(([name, chapters]) => ({ id: name, label: name, chapters })),\n  },\n  bible: {\n    sectionWord: 'Book',\n    sections: BIBLE.map(([id, chapters, label = id]) => ({ id, label, chapters })),\n  },\n  quran: {\n    sectionWord: 'Surah',\n    sections: Array.from({ length: 114 }, (_, i) => ({ id: i + 1, label: `Surah ${i + 1}`, chapters: 1 })),\n  },\n};",
    "reader": "const INFO = {\n  tanakh: { title: 'Tanakh', faith: 'Judaism' },\n  bible: { title: 'Holy Bible', faith: 'Christianity' },\n  quran: { title: \"Qur'an\", faith: 'Islam' },\n};\nlet current = { key: null, section: null, chapter: 1 };\n\nfunction openBook(key) {\n  const book = BOOKS[key];\n  current = { key, section: null, chapter: 1 };\n  $('reader').className = `reader ${key}`;\n  readerLabels();\n  $('reader').showModal();\n  fillSections();\n  goTo(book.sections[0].id, 1);\n}\n\n// The title, faith and picker label (in the current language from step 9)\nfunction readerLabels() {\n  const key = current.key;\n  if (!key) return;\n  const book = BOOKS[key];\n  $('readerTitle').textContent = INFO[key].title;\n  $('readerFaith').textContent = INFO[key].faith;\n  $('sectionLabel').textContent = book.sectionWord;\n}\n\nfunction fillSections() {\n  const book = BOOKS[current.key];\n  $('section').innerHTML = book.sections.map((s) => `<option value=\"${esc(s.id)}\">${esc(s.label)}</option>`).join('');\n}\n\nfunction fillChapters() {\n  const book = BOOKS[current.key];\n  const sec = book.sections.find((s) => String(s.id) === String(current.section));\n  $('chapterWrap').hidden = current.key === 'quran';          // a surah is read whole\n  $('chapter').innerHTML = Array.from({ length: sec.chapters }, (_, i) => `<option>${i + 1}</option>`).join('');\n  $('chapter').value = current.chapter;\n}\n\nfunction goTo(section, chapter) {\n  current.section = section;\n  current.chapter = chapter;\n  $('section').value = section;\n  fillChapters();\n  const sec = BOOKS[current.key].sections.find((s) => String(s.id) === String(section));\n  $('verses').innerHTML = `<p class=\"loading\">${esc(sec.label)} ${current.key === 'quran' ? '' : chapter}: the text arrives in the next session.</p>`;\n}\n\n// Previous / next: past the last chapter of a book, go on to the next book (and back)\nfunction step(dir) {\n  const book = BOOKS[current.key];\n  const i = book.sections.findIndex((s) => String(s.id) === String(current.section));\n  let chapter = current.chapter + dir;\n  let index = i;\n  if (chapter < 1) {\n    index = i - 1;\n    if (index < 0) return;                       // already at the very beginning\n    chapter = book.sections[index].chapters;     // the last chapter of the book before\n  } else if (chapter > book.sections[i].chapters) {\n    index = i + 1;\n    if (index >= book.sections.length) return;  // already at the very end\n    chapter = 1;\n  }\n  goTo(book.sections[index].id, chapter);\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst esc = (s) => String(s).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));\n\n// ---------- Reader ----------\ndocument.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));\n$('close').onclick = () => $('reader').close();\n// A click on the dark backdrop lands on the dialog itself: close it\n$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });\n$('section').onchange = (e) => goTo(e.target.value, 1);\n$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));\n$('prev').onclick = () => step(-1);\n$('next').onclick = () => step(1);"
   }
  }
 ],
 "finish": "### What you learned\n\n- A CSS scene with gradients and shaped boxes, symbols in inline SVG, and a modal `<dialog>`\n- Tables of contents and previous/next that crosses from book to book\n- `fetch` with `async`/`await`, readable errors, and guarding against responses that arrive late\n- Converting three APIs into one shape, and caching promises\n- Matching questions to topics: normalizing, stemming, weighted keywords and named books\n- Writing on a canvas: wrapping, sharp on every screen, clipped reveals, particles and a wind effect\n- Respecting reduced motion and screen readers\n- Text by key with an English fallback, and a right-to-left layout\n\n### Challenges\n\n1. **Search the chapter:** add a box in the reader that highlights a word in the verses (escape it first).\n2. **Remember your place:** save the last book and chapter, and offer to continue where you left off.\n3. **A new topic:** add one to `TOPICS` with its own keywords, and check that it doesn't steal questions from the others.\n4. **Name a passage:** recognize \"John 3\" in a question and open the reader there.\n5. **A third language:** add a small French pack with a few page texts and one topic, and watch everything else fall back to English.\n\nCompare yours with the [live site](https://theoyanvno.github.io/SuperBook/) and the [source code](https://github.com/TheoYanvno/SuperBook)."
};
