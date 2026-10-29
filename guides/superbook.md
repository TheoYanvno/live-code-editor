---
id: superbook
title: SuperBook
blocks-html: page
blocks-css: base
blocks-js: lang, books, reader, topics, ask, sand, ui
goals: Lay out a scene in CSS and draw simple symbols in SVG; Load chapters from three public web APIs with fetch, async and await, and handle slow or failed requests; Turn three different API answers into one shape, and cache them; Match a free-typed question to a topic by normalizing, stemming and scoring keywords; Animate text being written into sand on a canvas, with particles and a wind effect; Switch the page between languages, including right-to-left Hebrew
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects, template literals); Arrow functions and array map, filter and some; Promises help: async and await are explained in step 3
---

## Session: Three books in the desert

## Step: A desert with three books
time: 15

Welcome! In this guide you'll rebuild my [SuperBook](https://theoyanvno.github.io/SuperBook/): three books resting in a desert at dusk, the **Tanakh**, the **Holy Bible** and the **Qur'an**. Click one to read it, chapter by chapter, loaded live from free public APIs. Ask a question about how they differ and the answer is **written into the sand**, letter by letter.

This first step is the scene:

```svg The scene is layers of CSS gradients behind three buttons
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 190" font-family="sans-serif" font-size="11"><defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a4a"/><stop offset=".55" stop-color="#8a3b5c"/><stop offset="1" stop-color="#f7c873"/></linearGradient></defs><rect x="10" y="10" width="220" height="170" rx="8" fill="url(#sk)"/><circle cx="120" cy="112" r="22" fill="#fde68a" opacity=".9"/><ellipse cx="110" cy="190" rx="150" ry="62" fill="#c8924d"/><ellipse cx="140" cy="200" rx="140" ry="44" fill="#e9c98f"/><rect x="70" y="60" width="26" height="36" rx="3" fill="#2b4fb3"/><rect x="107" y="60" width="26" height="36" rx="3" fill="#a33232"/><rect x="144" y="60" width="26" height="36" rx="3" fill="#1f7a43"/><g fill="#1f2937"><text x="244" y="30">.sky  fixed, behind everything</text><text x="244" y="52">  linear-gradient: night to sunset</text><text x="244" y="80">.sun  radial-gradient circle</text><text x="244" y="108">.dune  wide ellipses: border-radius</text><text x="244" y="124">  50% 50% 0 0 / 100% 100% 0 0</text><text x="244" y="152">.book  buttons with an SVG symbol,</text><text x="244" y="168">  a spine shadow and a hover lift</text></g></svg>
```

- **The sky** is a `div` with `position: fixed; inset: 0; z-index: -1`, so it fills the window behind everything and stays put when the page scrolls. A `linear-gradient` goes from night purple to sunset gold.
- **The sun** is a circle drawn with a `radial-gradient` that fades to transparent at the edge, so it glows.
- **The dunes** are very wide boxes with `border-radius: 50% 50% 0 0 / 100% 100% 0 0`: before the slash is the horizontal radius of each corner, after it the vertical one. Rounding only the top corners, as tall as the box, makes a smooth hill.

**The books are buttons**, not `div`s: they can be reached with Tab and pressed with Enter or Space, with no extra code. Each has a cover symbol in inline SVG:

```svg Each cover symbol is two or three simple shapes
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 170" font-family="sans-serif"><g transform="translate(20 10)"><rect width="110" height="110" rx="8" fill="#0f172a"/><svg x="5" y="5" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#e8c46a" stroke-width="4"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg><text x="55" y="132" text-anchor="middle" font-size="10">two triangles, one upside down</text></g><g transform="translate(160 10)"><rect width="110" height="110" rx="8" fill="#0f172a"/><svg x="5" y="5" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#e8c46a" stroke-width="4"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg><text x="55" y="132" text-anchor="middle" font-size="10">one path: 12 corners</text></g><g transform="translate(300 10)"><rect width="110" height="110" rx="8" fill="#0f172a"/><svg x="5" y="5" width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="#e8c46a" stroke-width="4"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg><text x="55" y="132" text-anchor="middle" font-size="10">two squares, one turned 45°</text></g><text x="215" y="162" text-anchor="middle" font-size="11" fill="#475569">each symbol is a few shapes in a 100 × 100 box, drawn with a stroke</text></svg>
```

The SVGs have `fill: none` and a gold `stroke`, so they're drawn as outlines, and `aria-hidden="true"`, because the title under them already says which book it is.

**The reader** is a `<dialog>`. `showModal()` opens it on top of the page, dims everything behind it with the `::backdrop`, keeps keyboard focus inside it, and closes on Escape. A click on the dark backdrop lands on the dialog element itself, so `e.target === $('reader')` means "clicked outside the content": close it.

### Try it

Hover a book; open each one; close with ✕, Escape and a click outside.

check: html | three books as buttons | /class="book tanakh"/
check: html | a dialog for reading | /<dialog id="reader"/
check: js | open it on top of the page | /showModal\(\)/
check: js | an openBook() function | /function\s+openBook\s*\(/

quiz: Why make the books <button>s instead of clickable <div>s?
- [ ] Buttons are faster to draw
- [x] Buttons can be reached with Tab and pressed from the keyboard, with no extra code
- [ ] Divs can't have click listeners
why: Use the element that already behaves the way you need.
quiz: What does showModal() give you that setting the dialog visible with CSS does not?
- [ ] Nothing
- [x] A backdrop, focus kept inside the dialog, and closing on Escape
- [ ] Automatic loading of the text
why: The browser handles the hard parts of a modal for you.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div id="verses" class="verses"></div>
</dialog>
```

```css base
:root { --ink: #2b1a0e; --sand: #e9c98f; --sand-dark: #c89a55; --tanakh: #1e3a8a; --bible: #7f1d1d; --quran: #14532d; --gold: #e8c46a; }
* { box-sizing: border-box; }
body { margin: 0; min-height: 100vh; font-family: Georgia, "Times New Roman", serif; color: #fff7e6; background: #2a1a3a; overflow-x: hidden; }
.sky { position: fixed; inset: 0; z-index: -1; background: linear-gradient(#2a1a4a 0%, #8a3b5c 40%, #f08a4b 62%, #f7c873 72%); }
.sun { position: absolute; left: 50%; top: 52%; width: 140px; height: 140px; margin-left: -70px; border-radius: 50%; background: radial-gradient(circle, #fff3c4, #f7b955 60%, transparent 70%); }
.dune { position: absolute; left: -10%; right: -10%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; }
.dune.far { bottom: 0; height: 38%; background: linear-gradient(#d9a35c, #b77b3a); }
.dune.near { bottom: -6%; height: 30%; left: -30%; background: linear-gradient(var(--sand), var(--sand-dark)); }
.top { text-align: center; padding: 28px 16px 6px; position: relative; }
h1 { margin: 0; font-size: clamp(2.2rem, 7vw, 3.4rem); letter-spacing: .08em; text-shadow: 0 2px 14px rgba(0, 0, 0, .35); }
.tagline { max-width: 560px; margin: 6px auto 0; opacity: .92; }
.lang { position: absolute; top: 12px; inset-inline-end: 14px; font-size: .85rem; }
.lang select, .ask input, .pickers select { font: inherit; border-radius: 8px; border: 1px solid #c8a46a; background: #fffaf0; color: var(--ink); padding: 6px 8px; }
main { max-width: 900px; margin: 0 auto; padding: 18px 16px 40px; }
.books { display: flex; justify-content: center; gap: clamp(12px, 4vw, 36px); flex-wrap: wrap; margin: 14px 0 26px; }
.book { width: 150px; height: 200px; border: 0; border-radius: 6px 12px 12px 6px; cursor: pointer; color: var(--gold); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
        box-shadow: inset 8px 0 0 rgba(0, 0, 0, .25), 0 14px 22px rgba(0, 0, 0, .35); transition: transform .25s; font: inherit; }
.book:hover, .book:focus-visible { transform: translateY(-8px) rotate(-1deg); }
.book.tanakh { background: linear-gradient(135deg, #2b4fb3, var(--tanakh)); }
.book.bible { background: linear-gradient(135deg, #a33232, var(--bible)); }
.book.quran { background: linear-gradient(135deg, #1f7a43, var(--quran)); }
.symbol { width: 70px; height: 70px; fill: none; stroke: var(--gold); stroke-width: 4; stroke-linejoin: round; }
.title { font-size: 1.15rem; font-weight: bold; }
.faith { font-size: .8rem; opacity: .85; }
.ask label { display: block; text-align: center; font-size: 1.4rem; margin-bottom: 8px; text-shadow: 0 1px 8px rgba(0, 0, 0, .4); }
.ask .row { display: flex; gap: 8px; }
.ask input { flex: 1; padding: 10px 12px; }
button { font: inherit; }
.ask button, .smooth, .reader footer button { border: 0; border-radius: 8px; padding: 8px 16px; background: #6b3f1d; color: #fff7e6; cursor: pointer; }
.answer, .sand-wrap { margin-top: 16px; border-radius: 14px; color: var(--ink);
        background: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, .25) 0 1px, transparent 2px) 0 0 / 7px 7px, linear-gradient(#efd3a0, #ddb67a); box-shadow: inset 0 2px 10px rgba(110, 70, 20, .35); }
.answer { padding: 14px 20px; }
.answer h3 { margin: 0 0 8px; }
.sand-wrap { padding: 6px; }
#sand { display: block; width: 100%; height: 0; }
.smooth { margin: 6px auto 8px; display: block; }
.reader { width: min(760px, 94vw); max-height: 88vh; border: 0; border-radius: 14px; padding: 0; color: var(--ink); background: #fdf6e7; display: flex; flex-direction: column; }
.reader:not([open]) { display: none; }
.reader::backdrop { background: rgba(20, 10, 30, .6); }
.reader header { display: flex; justify-content: space-between; align-items: start; padding: 16px 20px 6px; color: #fff7e6; }
.reader.tanakh header { background: var(--tanakh); } .reader.bible header { background: var(--bible); } .reader.quran header { background: var(--quran); }
.reader h2 { margin: 0; }
.muted { margin: 2px 0 8px; opacity: .8; }
.close { background: none; border: 0; color: inherit; font-size: 1.3rem; cursor: pointer; }
.pickers { display: flex; flex-wrap: wrap; gap: 12px; padding: 10px 20px; border-bottom: 1px solid #ead9b8; }
.verses { overflow-y: auto; padding: 8px 20px; flex: 1; line-height: 1.6; }
.verse sup { color: #a0682d; margin-inline-end: 3px; }
.original { display: block; font-size: 1.15rem; color: #4b3621; margin-top: 2px; }
.loading { color: #7a5a3a; font-style: italic; }
.reader footer { display: flex; justify-content: space-between; padding: 10px 20px 14px; border-top: 1px solid #ead9b8; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
```

```js reader
const INFO = {
  tanakh: { title: 'Tanakh', faith: 'Judaism' },
  bible: { title: 'Holy Bible', faith: 'Christianity' },
  quran: { title: "Qur'an", faith: 'Islam' },
};

function openBook(key) {
  $('reader').className = `reader ${key}`;            // the header takes the book's color
  $('readerTitle').textContent = INFO[key].title;
  $('readerFaith').textContent = INFO[key].faith;
  $('verses').innerHTML = '<p class="loading">The pages arrive in the next sessions.</p>';
  $('reader').showModal();
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
```

## Step: A table of contents
time: 20

Each book needs a **table of contents**: its books (or surahs) and how many chapters each has. The `books` block holds the real lists from SuperBook:

| Book | Contents | Order |
|---|---|---|
| Tanakh | 39 books, as `[name, chapters]` | the Jewish order: Torah, Prophets, Writings |
| Holy Bible | 79 entries covering the Eastern Orthodox Bible, as `[api id, chapters, label]` | the Septuagint order, then the New Testament |
| Qur'an | 114 surahs, each read whole | for now just numbered; their names come from the web in step 4 |

The Bible's entries have a separate **label** because the API and the reader want different names: the API knows `1 Samuel`, but Orthodox Bibles call it `1 Kingdoms`. `([id, chapters, label = id]) => …` destructures each entry and uses the id when there's no label.

`BOOKS` gives all three the same fields (`sections`, `sectionWord`), so one reader works for any of them.

**Two pickers.** Opening a book fills the first `<select>` with its sections, and `fillChapters()` fills the second with `1 … n` for the chosen one. A surah is read whole, so the chapter picker is hidden for the Qur'an.

**Previous and next cross books.** `step(dir)` adds `+1` or `-1` to the chapter, and when that runs off either end of a book, moves to the neighbouring book:

```svg Next and Previous continue into the next or previous book
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 130" font-family="sans-serif" font-size="11"><rect x="10" y="20" width="180" height="40" rx="6" fill="#e2e8f0"/><text x="20" y="38" font-weight="700">Genesis</text><text x="20" y="53">chapters 1 … 50</text><rect x="240" y="20" width="180" height="40" rx="6" fill="#e2e8f0"/><text x="250" y="38" font-weight="700">Exodus</text><text x="250" y="53">chapters 1 … 40</text><path d="M150 50 C 190 90, 230 90, 262 52" fill="none" stroke="#15803d" stroke-width="2"/><text x="200" y="98" text-anchor="middle" fill="#15803d">Next on 50 → Exodus 1</text><path d="M262 30 C 230 0, 190 0, 150 30" fill="none" stroke="#b91c1c" stroke-width="2"/><text x="205" y="12" text-anchor="middle" fill="#b91c1c">Previous on 1 → Genesis 50</text><text x="215" y="122" text-anchor="middle" fill="#475569">at the very first or last chapter of the whole book, step() just stops</text></svg>
```

### Try it

Open the Bible, pick Genesis 50 and press Next. Press Previous twice. Open the Qur'an: no chapter picker.

check: js | the Tanakh's contents | /const\s+TANAKH\s*=\s*\[/
check: js | previous and next | /function\s+step\s*\(/
check: js | back past chapter 1 goes to the last chapter of the book before | /chapter\s*=\s*book\.sections\[index\]\.chapters/
check: html | a book picker | /id="section"/

quiz: In step(-1) on Exodus 1, what happens?
- [ ] Nothing
- [x] It goes to Genesis 50, the last chapter of the book before
- [ ] It goes to Genesis 1
why: chapter becomes 0, so index moves back one book and chapter becomes that book's chapter count.
quiz: Why does each Bible entry have both an id and a label?
- [ ] To save memory
- [x] The API needs the name it knows (1 Samuel); readers see the Orthodox name (1 Kingdoms)
- [ ] Labels are translated by the API
why: What a machine needs and what a person reads can differ; keep both.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js books
// Tables of contents, copied from the real src/books.js.
// Tanakh: [name, chapters] in the Jewish order (Torah, Prophets, Writings). Names match Sefaria's API.
const TANAKH = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34], ["Joshua", 24],
  ["Judges", 21], ["I Samuel", 31], ["II Samuel", 24], ["I Kings", 22], ["II Kings", 25], ["Isaiah", 66],
  ["Jeremiah", 52], ["Ezekiel", 48], ["Hosea", 14], ["Joel", 4], ["Amos", 9], ["Obadiah", 1],
  ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3], ["Haggai", 2],
  ["Zechariah", 14], ["Malachi", 3], ["Psalms", 150], ["Proverbs", 31], ["Job", 42], ["Song of Songs", 8],
  ["Ruth", 4], ["Lamentations", 5], ["Ecclesiastes", 12], ["Esther", 10], ["Daniel", 12], ["Ezra", 10],
  ["Nehemiah", 13], ["I Chronicles", 29], ["II Chronicles", 36],
];

// Eastern Orthodox Bible: [id for bible-api.com, chapters, label]. The id is what the API understands; the label is what readers see.
const BIBLE = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31, "1 Kingdoms (1 Samuel)"], ["2 Samuel", 24, "2 Kingdoms (2 Samuel)"],
  ["1 Kings", 22, "3 Kingdoms (1 Kings)"], ["2 Kings", 25, "4 Kingdoms (2 Kings)"], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Prayer of Manasses", 1, "Prayer of Manasseh"],
  ["1 Esdras", 9], ["Ezra", 10, "2 Esdras (Ezra)"], ["Nehemiah", 13], ["Tobit", 14], ["Judith", 16],
  ["Esther", 10], ["1 Maccabees", 16], ["2 Maccabees", 15], ["3 Maccabees", 7], ["Psalms", 150],
  ["Job", 42], ["Proverbs", 31], ["Ecclesiastes", 12], ["Song of Solomon", 8, "Song of Songs"], ["Wisdom", 19, "Wisdom of Solomon"],
  ["Sirach", 51], ["Hosea", 14], ["Amos", 9], ["Micah", 7], ["Joel", 3],
  ["Obadiah", 1], ["Jonah", 4], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3],
  ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4], ["Isaiah", 66], ["Jeremiah", 52],
  ["Baruch", 5], ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12], ["sus", 1, "Susanna"],
  ["Bel and the Dragon", 1], ["4 Maccabees", 18, "4 Maccabees (appendix)"], ["Matthew", 28], ["Mark", 16], ["Luke", 24],
  ["John", 21], ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13],
  ["Galatians", 6], ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5],
  ["2 Thessalonians", 3], ["1 Timothy", 6], ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1],
  ["Hebrews", 13], ["James", 5], ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5],
  ["2 John", 1], ["3 John", 1], ["Jude", 1], ["Revelation", 22],
];

const BOOKS = {
  tanakh: {
    sectionWord: 'Book',
    sections: TANAKH.map(([name, chapters]) => ({ id: name, label: name, chapters })),
  },
  bible: {
    sectionWord: 'Book',
    sections: BIBLE.map(([id, chapters, label = id]) => ({ id, label, chapters })),
  },
  quran: {
    sectionWord: 'Surah',
    sections: Array.from({ length: 114 }, (_, i) => ({ id: i + 1, label: `Surah ${i + 1}`, chapters: 1 })),
  },
};
```

```js reader
const INFO = {
  tanakh: { title: 'Tanakh', faith: 'Judaism' },
  bible: { title: 'Holy Bible', faith: 'Christianity' },
  quran: { title: "Qur'an", faith: 'Islam' },
};
let current = { key: null, section: null, chapter: 1 };

function openBook(key) {
  const book = BOOKS[key];
  current = { key, section: null, chapter: 1 };
  $('reader').className = `reader ${key}`;
  readerLabels();
  $('reader').showModal();
  fillSections();
  goTo(book.sections[0].id, 1);
}

// The title, faith and picker label (in the current language from step 9)
function readerLabels() {
  const key = current.key;
  if (!key) return;
  const book = BOOKS[key];
  $('readerTitle').textContent = INFO[key].title;
  $('readerFaith').textContent = INFO[key].faith;
  $('sectionLabel').textContent = book.sectionWord;
}

function fillSections() {
  const book = BOOKS[current.key];
  $('section').innerHTML = book.sections.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
}

function fillChapters() {
  const book = BOOKS[current.key];
  const sec = book.sections.find((s) => String(s.id) === String(current.section));
  $('chapterWrap').hidden = current.key === 'quran';          // a surah is read whole
  $('chapter').innerHTML = Array.from({ length: sec.chapters }, (_, i) => `<option>${i + 1}</option>`).join('');
  $('chapter').value = current.chapter;
}

function goTo(section, chapter) {
  current.section = section;
  current.chapter = chapter;
  $('section').value = section;
  fillChapters();
  const sec = BOOKS[current.key].sections.find((s) => String(s.id) === String(section));
  $('verses').innerHTML = `<p class="loading">${esc(sec.label)} ${current.key === 'quran' ? '' : chapter}: the text arrives in the next session.</p>`;
}

// Previous / next: past the last chapter of a book, go on to the next book (and back)
function step(dir) {
  const book = BOOKS[current.key];
  const i = book.sections.findIndex((s) => String(s.id) === String(current.section));
  let chapter = current.chapter + dir;
  let index = i;
  if (chapter < 1) {
    index = i - 1;
    if (index < 0) return;                       // already at the very beginning
    chapter = book.sections[index].chapters;     // the last chapter of the book before
  } else if (chapter > book.sections[i].chapters) {
    index = i + 1;
    if (index >= book.sections.length) return;  // already at the very end
    chapter = 1;
  }
  goTo(book.sections[index].id, chapter);
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
```

## Session: Reading from the web

## Step: Fetching a chapter
time: 20

SuperBook doesn't store any scripture. Each chapter is **loaded when you open it**, from free public APIs, using public-domain translations. The Bible comes from [bible-api.com](https://bible-api.com), in the World English Bible:

```text
https://bible-api.com/Genesis%201?translation=web
→ { "verses": [ { "verse": 1, "text": "In the beginning, God created the heavens and the earth.\n" }, … ] }
```

**`async` and `await`.** `fetch()` returns a *promise*: a value that arrives later. Inside an `async` function, `await` pauses that function until the value arrives, without freezing the page, so the code reads top to bottom like ordinary code.

**Errors are normal on the web.** A request can fail (no connection) or come back with an error status. `fetch` only throws for the first kind, so `fetchJson()` checks `res.ok` and throws a readable message itself, with a special one for **429 Too Many Requests**, which free APIs send when you click too fast. `goTo()` wraps everything in `try … catch` and shows the message in the reader instead of breaking.

**The reader may move on.** Click Next three times quickly and three requests are in flight. If the first one is slow, it could arrive *last* and overwrite the chapter you're actually on. So before drawing, `goTo()` checks the chapter it loaded is still the current one:

```js
if (id !== `${current.key}|${current.section}|${current.chapter}`) return;   // the reader moved on while this loaded
```

Each verse is shown with its number in a `<sup>`, and its text goes through `esc()`: it comes from someone else's server, so it's never put into the page as HTML.

### Try it

Open the Bible and page through. (The Tanakh and the Qur'an come in the next step.)

check: js | one function for every request | /async\s+function\s+fetchJson\s*\(/
check: js | a readable error for "too many requests" | /res\.status\s*===\s*429/
check: js | the Bible from bible-api.com | /bible-api\.com/
check: js | ignore a chapter the reader has left | /if\s*\(\s*id\s*!==\s*`/

quiz: fetch() gets a 404 response. What happens without the res.ok check?
- [ ] fetch throws an error
- [x] Nothing throws: the code carries on with an error page as if it were the chapter
- [ ] The browser retries
why: fetch only rejects when the request itself fails; checking res.ok is your job.
quiz: Why compare the loaded id with the current chapter before drawing?
- [ ] To save memory
- [x] A slow, older request could finish last and overwrite the chapter the reader is actually on
- [ ] Because ids change after loading
why: Responses don't always come back in the order they were asked for.

```js books
// Tables of contents, copied from the real src/books.js.
// Tanakh: [name, chapters] in the Jewish order (Torah, Prophets, Writings). Names match Sefaria's API.
const TANAKH = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34], ["Joshua", 24],
  ["Judges", 21], ["I Samuel", 31], ["II Samuel", 24], ["I Kings", 22], ["II Kings", 25], ["Isaiah", 66],
  ["Jeremiah", 52], ["Ezekiel", 48], ["Hosea", 14], ["Joel", 4], ["Amos", 9], ["Obadiah", 1],
  ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3], ["Haggai", 2],
  ["Zechariah", 14], ["Malachi", 3], ["Psalms", 150], ["Proverbs", 31], ["Job", 42], ["Song of Songs", 8],
  ["Ruth", 4], ["Lamentations", 5], ["Ecclesiastes", 12], ["Esther", 10], ["Daniel", 12], ["Ezra", 10],
  ["Nehemiah", 13], ["I Chronicles", 29], ["II Chronicles", 36],
];

// Eastern Orthodox Bible: [id for bible-api.com, chapters, label]. The id is what the API understands; the label is what readers see.
const BIBLE = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31, "1 Kingdoms (1 Samuel)"], ["2 Samuel", 24, "2 Kingdoms (2 Samuel)"],
  ["1 Kings", 22, "3 Kingdoms (1 Kings)"], ["2 Kings", 25, "4 Kingdoms (2 Kings)"], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Prayer of Manasses", 1, "Prayer of Manasseh"],
  ["1 Esdras", 9], ["Ezra", 10, "2 Esdras (Ezra)"], ["Nehemiah", 13], ["Tobit", 14], ["Judith", 16],
  ["Esther", 10], ["1 Maccabees", 16], ["2 Maccabees", 15], ["3 Maccabees", 7], ["Psalms", 150],
  ["Job", 42], ["Proverbs", 31], ["Ecclesiastes", 12], ["Song of Solomon", 8, "Song of Songs"], ["Wisdom", 19, "Wisdom of Solomon"],
  ["Sirach", 51], ["Hosea", 14], ["Amos", 9], ["Micah", 7], ["Joel", 3],
  ["Obadiah", 1], ["Jonah", 4], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3],
  ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4], ["Isaiah", 66], ["Jeremiah", 52],
  ["Baruch", 5], ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12], ["sus", 1, "Susanna"],
  ["Bel and the Dragon", 1], ["4 Maccabees", 18, "4 Maccabees (appendix)"], ["Matthew", 28], ["Mark", 16], ["Luke", 24],
  ["John", 21], ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13],
  ["Galatians", 6], ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5],
  ["2 Thessalonians", 3], ["1 Timothy", 6], ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1],
  ["Hebrews", 13], ["James", 5], ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5],
  ["2 John", 1], ["3 John", 1], ["Jude", 1], ["Revelation", 22],
];

// Every API call goes through here, so a failed request always becomes a readable error
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status === 429 ? 'Reading too fast: wait a few seconds and try again.' : 'Could not load this page.');
  return res.json();
}

const BOOKS = {
  tanakh: {
    sectionWord: 'Book',
    sections: TANAKH.map(([name, chapters]) => ({ id: name, label: name, chapters })),
  },
  bible: {
    sectionWord: 'Book',
    sections: BIBLE.map(([id, chapters, label = id]) => ({ id, label, chapters })),
    async load(section, chapter) {
      const data = await fetchJson(`https://bible-api.com/${encodeURIComponent(`${section} ${chapter}`)}?translation=web`);
      return data.verses.map((x) => ({ n: x.verse, text: x.text.replace(/\s+/g, ' ').trim() }));
    },
  },
  quran: {
    sectionWord: 'Surah',
    sections: Array.from({ length: 114 }, (_, i) => ({ id: i + 1, label: `Surah ${i + 1}`, chapters: 1 })),
  },
};
```

```js reader
const INFO = {
  tanakh: { title: 'Tanakh', faith: 'Judaism' },
  bible: { title: 'Holy Bible', faith: 'Christianity' },
  quran: { title: "Qur'an", faith: 'Islam' },
};
let current = { key: null, section: null, chapter: 1 };

function openBook(key) {
  const book = BOOKS[key];
  current = { key, section: null, chapter: 1 };
  $('reader').className = `reader ${key}`;
  readerLabels();
  $('reader').showModal();
  fillSections();
  goTo(book.sections[0].id, 1);
}

// The title, faith and picker label (in the current language from step 9)
function readerLabels() {
  const key = current.key;
  if (!key) return;
  const book = BOOKS[key];
  $('readerTitle').textContent = INFO[key].title;
  $('readerFaith').textContent = INFO[key].faith;
  $('sectionLabel').textContent = book.sectionWord;
}

function fillSections() {
  const book = BOOKS[current.key];
  $('section').innerHTML = book.sections.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
}

function fillChapters() {
  const book = BOOKS[current.key];
  const sec = book.sections.find((s) => String(s.id) === String(current.section));
  $('chapterWrap').hidden = current.key === 'quran';          // a surah is read whole
  $('chapter').innerHTML = Array.from({ length: sec.chapters }, (_, i) => `<option>${i + 1}</option>`).join('');
  $('chapter').value = current.chapter;
}

async function goTo(section, chapter) {
  const book = BOOKS[current.key];
  current.section = section;
  current.chapter = chapter;
  $('section').value = section;
  fillChapters();
  if (!book.load) {
    $('verses').innerHTML = '<p class="loading">This book\'s text arrives in the next step.</p>';
    return;
  }
  const id = `${current.key}|${section}|${chapter}`;
  $('verses').innerHTML = `<p class="loading">${'Turning the page…'}</p>`;
  try {
    const verses = await book.load(section, chapter);
    if (id !== `${current.key}|${current.section}|${current.chapter}`) return;   // the reader moved on while this loaded
    $('verses').innerHTML = verses.map((x) => `<p class="verse"><sup>${x.n}</sup> ${esc(x.text)}</p>`).join('');
    $('verses').scrollTop = 0;
  } catch (err) {
    if (id !== `${current.key}|${current.section}|${current.chapter}`) return;
    $('verses').innerHTML = `<p class="loading">${esc(err.message)} ${'Check your internet connection and try again.'}</p>`;
  }
}

// Previous / next: past the last chapter of a book, go on to the next book (and back)
function step(dir) {
  const book = BOOKS[current.key];
  const i = book.sections.findIndex((s) => String(s.id) === String(current.section));
  let chapter = current.chapter + dir;
  let index = i;
  if (chapter < 1) {
    index = i - 1;
    if (index < 0) return;                       // already at the very beginning
    chapter = book.sections[index].chapters;     // the last chapter of the book before
  } else if (chapter > book.sections[i].chapters) {
    index = i + 1;
    if (index >= book.sections.length) return;  // already at the very end
    chapter = 1;
  }
  goTo(book.sections[index].id, chapter);
}
```

## Step: Three APIs, one shape
time: 20

The other two books come from other services, and every API answers in its own format:

```svg Each load() turns its API's answer into the same shape
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 170" font-family="sans-serif" font-size="11"><rect x="10" y="10" width="230" height="36" rx="6" fill="#dbeafe"/><text x="18" y="25" font-weight="700">Sefaria (Tanakh)</text><text x="18" y="39" font-family="monospace" font-size="9">versions[] of text arrays, light HTML</text><line x1="240" y1="28" x2="290" y2="76" stroke="#475569" stroke-width="2"/><rect x="10" y="54" width="230" height="36" rx="6" fill="#fee2e2"/><text x="18" y="69" font-weight="700">bible-api.com (Bible)</text><text x="18" y="83" font-family="monospace" font-size="9">verses[]: { verse, text }</text><line x1="240" y1="72" x2="290" y2="76" stroke="#475569" stroke-width="2"/><rect x="10" y="98" width="230" height="36" rx="6" fill="#dcfce7"/><text x="18" y="113" font-weight="700">alquran.cloud (Qur'an)</text><text x="18" y="127" font-family="monospace" font-size="9">data[]: two editions of ayahs[]</text><line x1="240" y1="116" x2="290" y2="76" stroke="#475569" stroke-width="2"/><rect x="290" y="52" width="130" height="48" rx="6" fill="#0f172a"/><text x="298" y="70" fill="#fde68a" font-family="monospace" font-size="10">[{ n, text,</text><text x="298" y="86" fill="#fde68a" font-family="monospace" font-size="10">   original, dir }]</text><text x="215" y="160" text-anchor="middle" font-size="11" fill="#475569">each load() turns its API's answer into one shape, so the reader draws them all the same way</text></svg>
```

| Book | API | Notes |
|---|---|---|
| Tanakh | [Sefaria](https://www.sefaria.org) | asks for two versions in one request: the JPS 1917 English and the Hebrew; the text has light HTML (footnotes, `<big>`) that `clean()` strips |
| Qur'an | [alquran.cloud](https://alquran.cloud) | one request returns two editions: the Arabic (Uthmani script) and Pickthall's English; the surah list is its own request |

Every `load()` returns **the same shape**, `[{ n, text, original, dir }]`, so the reader has one way to draw verses whichever book they came from. Adding a fourth book would mean writing one more `load()`, not changing the reader. The original Hebrew or Arabic is shown under each verse with `dir="rtl"` and a `lang` attribute, so it runs right to left and screen readers pronounce it correctly; a checkbox turns it off.

**`clean()`** removes footnotes first (they'd otherwise leave their text in the verse), turns `<br>` into spaces, drops every other tag, and squeezes repeated spaces.

**A cache.** Paging back to a chapter you've read shouldn't download it again. `cache` is a `Map` from a chapter id like `bible|John|3` to the **promise** of its verses. Storing the promise, not the result, means two quick clicks on the same chapter share one request. If the request fails, `cache.delete(id)` forgets it, so trying again really tries again.

**Loading the surah list.** The Qur'an's `sections` start as `null`; the first time the book is opened, `loadSections()` fills them from the API, with names like *1. Al-Faatiha (The Opening)*.

### Try it

Open all three books. Turn the original language off and on. Close and reopen a book: no new request.

check: js | the Tanakh from Sefaria | /sefaria\.org\/api\/v3\/texts/
check: js | strip Sefaria's HTML | /function\s+clean\s*\(/
check: js | a cache | /new\s+Map\(\)/
check: js | a failed load isn't kept | /cache\.delete\(\s*id\s*\)/
check: js | two Qur'an editions in one request | /editions\/quran-uthmani,en\.pickthall/

quiz: Why does every load() return [{ n, text, original, dir }] instead of the API's own data?
- [ ] The APIs require it
- [x] The reader then draws verses one way for every book, and a new source only needs a new load()
- [ ] It makes the requests smaller
why: Convert at the edge; keep the inside of the app simple.
quiz: Why does the cache store the promise rather than waiting and storing the verses?
- [ ] Promises are smaller
- [x] A second click before the first request finishes reuses it instead of starting another
- [ ] Maps can only hold promises
why: The promise stands for the request, finished or not.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
    <label id="originalWrap" class="check"><input type="checkbox" id="original" checked> <span>Original language</span></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js books
// Tables of contents, copied from the real src/books.js.
// Tanakh: [name, chapters] in the Jewish order (Torah, Prophets, Writings). Names match Sefaria's API.
const TANAKH = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34], ["Joshua", 24],
  ["Judges", 21], ["I Samuel", 31], ["II Samuel", 24], ["I Kings", 22], ["II Kings", 25], ["Isaiah", 66],
  ["Jeremiah", 52], ["Ezekiel", 48], ["Hosea", 14], ["Joel", 4], ["Amos", 9], ["Obadiah", 1],
  ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3], ["Haggai", 2],
  ["Zechariah", 14], ["Malachi", 3], ["Psalms", 150], ["Proverbs", 31], ["Job", 42], ["Song of Songs", 8],
  ["Ruth", 4], ["Lamentations", 5], ["Ecclesiastes", 12], ["Esther", 10], ["Daniel", 12], ["Ezra", 10],
  ["Nehemiah", 13], ["I Chronicles", 29], ["II Chronicles", 36],
];

// Eastern Orthodox Bible: [id for bible-api.com, chapters, label]. The id is what the API understands; the label is what readers see.
const BIBLE = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31, "1 Kingdoms (1 Samuel)"], ["2 Samuel", 24, "2 Kingdoms (2 Samuel)"],
  ["1 Kings", 22, "3 Kingdoms (1 Kings)"], ["2 Kings", 25, "4 Kingdoms (2 Kings)"], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Prayer of Manasses", 1, "Prayer of Manasseh"],
  ["1 Esdras", 9], ["Ezra", 10, "2 Esdras (Ezra)"], ["Nehemiah", 13], ["Tobit", 14], ["Judith", 16],
  ["Esther", 10], ["1 Maccabees", 16], ["2 Maccabees", 15], ["3 Maccabees", 7], ["Psalms", 150],
  ["Job", 42], ["Proverbs", 31], ["Ecclesiastes", 12], ["Song of Solomon", 8, "Song of Songs"], ["Wisdom", 19, "Wisdom of Solomon"],
  ["Sirach", 51], ["Hosea", 14], ["Amos", 9], ["Micah", 7], ["Joel", 3],
  ["Obadiah", 1], ["Jonah", 4], ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3],
  ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4], ["Isaiah", 66], ["Jeremiah", 52],
  ["Baruch", 5], ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12], ["sus", 1, "Susanna"],
  ["Bel and the Dragon", 1], ["4 Maccabees", 18, "4 Maccabees (appendix)"], ["Matthew", 28], ["Mark", 16], ["Luke", 24],
  ["John", 21], ["Acts", 28], ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13],
  ["Galatians", 6], ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5],
  ["2 Thessalonians", 3], ["1 Timothy", 6], ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1],
  ["Hebrews", 13], ["James", 5], ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5],
  ["2 John", 1], ["3 John", 1], ["Jude", 1], ["Revelation", 22],
];

// Every API call goes through here, so a failed request always becomes a readable error
async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status === 429 ? 'Reading too fast: wait a few seconds and try again.' : 'Could not load this page.');
  return res.json();
}

// Sefaria returns light HTML (footnotes, <big>, <br>); keep plain text only
function clean(html) {
  return String(html)
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<i class="footnote">.*?<\/i>/g, '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&thinsp;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const JPS = 'english|The Holy Scriptures: A New Translation (JPS 1917)';

const BOOKS = {
  tanakh: {
    sectionWord: 'Book',
    sections: TANAKH.map(([name, chapters]) => ({ id: name, label: name, chapters })),
    // Every load returns the same shape: [{ n, text, original, dir }]
    async load(section, chapter) {
      const ref = encodeURIComponent(`${section}.${chapter}`);
      const data = await fetchJson(`https://www.sefaria.org/api/v3/texts/${ref}?version=${encodeURIComponent(JPS)}&version=hebrew`);
      const hebrew = data.versions.find((x) => x.actualLanguage === 'he' || x.language === 'he')?.text ?? [];
      const english = data.versions.find((x) => x.actualLanguage !== 'he' && x.language !== 'he')?.text ?? [];
      return english.map((text, i) => ({ n: i + 1, text: clean(text), original: clean(hebrew[i] ?? ''), dir: 'rtl' }));
    },
  },
  bible: {
    sectionWord: 'Book',
    sections: BIBLE.map(([id, chapters, label = id]) => ({ id, label, chapters })),
    async load(section, chapter) {
      const data = await fetchJson(`https://bible-api.com/${encodeURIComponent(`${section} ${chapter}`)}?translation=web`);
      return data.verses.map((x) => ({ n: x.verse, text: x.text.replace(/\s+/g, ' ').trim() }));
    },
  },
  quran: {
    sectionWord: 'Surah',
    sections: null,                 // the 114 surahs are listed by the API, the first time the book is opened
    async loadSections() {
      const data = await fetchJson('https://api.alquran.cloud/v1/surah');
      return data.data.map((s) => ({ id: s.number, label: `${s.number}. ${s.englishName} (${s.englishNameTranslation})`, chapters: 1 }));
    },
    // One request asks for two editions at once: the Arabic text and Pickthall's English
    async load(section) {
      const [arabic, english] = (await fetchJson(`https://api.alquran.cloud/v1/surah/${section}/editions/quran-uthmani,en.pickthall`)).data;
      return english.ayahs.map((a, i) => ({ n: a.numberInSurah, text: a.text, original: arabic.ayahs[i].text.replace(/^\uFEFF/, ''), dir: 'rtl' }));
    },
  },
};
```

```js reader
const INFO = {
  tanakh: { title: 'Tanakh', faith: 'Judaism' },
  bible: { title: 'Holy Bible', faith: 'Christianity' },
  quran: { title: "Qur'an", faith: 'Islam' },
};
let current = { key: null, section: null, chapter: 1 };
const cache = new Map();            // chapter id → the promise of its verses

async function openBook(key) {
  const book = BOOKS[key];
  current = { key, section: null, chapter: 1 };
  $('reader').className = `reader ${key}`;
  readerLabels();
  $('verses').innerHTML = `<p class="loading">${'Opening…'}</p>`;
  $('reader').showModal();
  if (!book.sections) {
    try {
      book.sections = await book.loadSections();
    } catch (err) {
      $('verses').innerHTML = `<p class="loading">${esc(err.message)} ${'Check your internet connection and try again.'}</p>`;
      return;
    }
  }
  fillSections();
  goTo(book.sections[0].id, 1);
}

// The title, faith and picker label (in the current language from step 9)
function readerLabels() {
  const key = current.key;
  if (!key) return;
  const book = BOOKS[key];
  $('readerTitle').textContent = INFO[key].title;
  $('readerFaith').textContent = INFO[key].faith;
  $('sectionLabel').textContent = book.sectionWord;
}

function fillSections() {
  const book = BOOKS[current.key];
  $('section').innerHTML = book.sections.map((s) => `<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
}

function fillChapters() {
  const book = BOOKS[current.key];
  const sec = book.sections.find((s) => String(s.id) === String(current.section));
  $('chapterWrap').hidden = current.key === 'quran';          // a surah is read whole
  $('chapter').innerHTML = Array.from({ length: sec.chapters }, (_, i) => `<option>${i + 1}</option>`).join('');
  $('chapter').value = current.chapter;
}

async function goTo(section, chapter) {
  const book = BOOKS[current.key];
  current.section = section;
  current.chapter = chapter;
  $('section').value = section;
  fillChapters();
  const id = `${current.key}|${section}|${chapter}`;
  $('verses').innerHTML = `<p class="loading">${'Turning the page…'}</p>`;
  try {
    if (!cache.has(id)) cache.set(id, book.load(section, chapter));    // the promise, so two quick clicks share one request
    const verses = await cache.get(id);
    if (id !== `${current.key}|${current.section}|${current.chapter}`) return;   // the reader moved on while this loaded
    const showOriginal = $('original').checked;
    $('originalWrap').hidden = !verses.some((x) => x.original);
    $('verses').innerHTML = verses.map((x) => `<p class="verse"><sup>${x.n}</sup> ${esc(x.text)}${showOriginal && x.original
      ? `<span class="original" dir="${x.dir}" lang="${current.key === 'quran' ? 'ar' : 'he'}">${esc(x.original)}</span>` : ''}</p>`).join('');
    $('verses').scrollTop = 0;
  } catch (err) {
    cache.delete(id);                // don't keep a failure: the next try asks again
    if (id !== `${current.key}|${current.section}|${current.chapter}`) return;
    $('verses').innerHTML = `<p class="loading">${esc(err.message)} ${'Check your internet connection and try again.'}</p>`;
  }
}

// Previous / next: past the last chapter of a book, go on to the next book (and back)
function step(dir) {
  const book = BOOKS[current.key];
  const i = book.sections.findIndex((s) => String(s.id) === String(current.section));
  let chapter = current.chapter + dir;
  let index = i;
  if (chapter < 1) {
    index = i - 1;
    if (index < 0) return;                       // already at the very beginning
    chapter = book.sections[index].chapters;     // the last chapter of the book before
  } else if (chapter > book.sections[i].chapters) {
    index = i + 1;
    if (index >= book.sections.length) return;  // already at the very end
    chapter = 1;
  }
  goTo(book.sections[index].id, chapter);
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
$('original').onchange = () => goTo(current.section, current.chapter);
```

## Session: Ask the sand

## Step: Matching a question to a topic
time: 20

The sand answers questions like *"How do the Bible and the Qur'an see Jesus?"* There's no AI here: the `topics` block holds 8 of the real app's 76 topics, each with a short, neutral answer for each book and a list of **keywords** that point to it. Matching a free-typed question to a topic takes three steps.

**1. Normalize.** `normalize()` makes different ways of writing the same thing identical:

| Change | Example |
|---|---|
| lowercase, accents and vowel marks removed | `Qur'ān` → `qurʾan` |
| one spelling | `Koran`, `Qur'an`, `Coran` → `quran` |
| only letters and digits, single spaces | `Jesus?` → `jesus` |
| padded with a space at each end | `" how old is the torah "` |

The padding matters: `q.includes(' age ')` matches the word *age* but not *page* or *stage*.

**2. Stem.** `stem()` trims common English endings, so *prophets*, *praying* and *prayed* match *prophet* and *pray*. It runs until nothing changes: *miracles* → *miracle* → *miracl*. It's applied to the question **and** the keywords the same way, so they meet in the middle.

**3. Score.** Every keyword found in the question adds points:

```svg Specific keywords are worth more than general ones
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 160" font-family="sans-serif"><text x="12" y="20" font-size="11" font-family="monospace">question: " how old is the torah "</text><rect x="10" y="32" width="410" height="28" rx="6" fill="#bbf7d0"/><text x="20" y="50" font-family="monospace" font-size="11">"how old"</text><text x="170" y="50" font-size="11">specific, 2 words</text><text x="410" y="50" text-anchor="end" font-size="11" font-weight="700">3 points</text><rect x="10" y="66" width="410" height="28" rx="6" fill="#bbf7d0"/><text x="20" y="84" font-family="monospace" font-size="11">"age"</text><text x="170" y="84" font-size="11">specific, 1 word</text><text x="410" y="84" text-anchor="end" font-size="11" font-weight="700">2 points</text><rect x="10" y="100" width="410" height="28" rx="6" fill="#fde68a"/><text x="20" y="118" font-family="monospace" font-size="11">"~old", "~when"</text><text x="170" y="118" font-size="11">weak, general</text><text x="410" y="118" text-anchor="end" font-size="11" font-weight="700">1 point in all</text><text x="215" y="150" text-anchor="middle" font-size="11" fill="#475569">longer phrases are more specific, so they are worth more; the highest total wins</text></svg>
```

A keyword's points are its word count + 1, because longer phrases are more specific. Words marked `~` are **weak** (*when*, *old*, *church*): together they're worth just 1 point, so a general word never outweighs a specific one. `rank()` sorts the topics by score; JavaScript's sort is **stable**, so on a tie the topic listed first wins.

The keywords are prepared **once**, when the page loads (`PREPARED`), not on every question.

### Try it

For now the sand shows the scores. Ask *How old is the Torah?*, *praying*, *Koran and heaven*.

check: html | a question box | /id="question"/
check: js | normalize() | /function\s+normalize\s*\(/
check: js | stem() | /function\s+stem\s*\(/
check: js | weak words are worth 1 | /weak\s*\?\s*1\s*:/
check: js | rank() scores every topic | /function\s+rank\s*\(/

quiz: Why pad the normalized question with a space at each end?
- [ ] It looks nicer
- [x] So includes(" age ") finds the word age but not page or stage
- [ ] Stemming needs it
why: Spaces mark word edges, even for the first and last word.
quiz: Why are weak words like "when" worth only 1 point in total?
- [ ] They are rare
- [x] They appear in all kinds of questions, so they shouldn't outweigh a specific word
- [ ] Stemming changes them
why: General words only break ties when nothing specific matches.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
  <form id="askForm" class="ask">
    <label for="question">Ask the sand</label>
    <div class="row">
      <input id="question" autocomplete="off" placeholder="Ask anything, e.g. How do the Bible and the Qur'an see Jesus?">
      <button>Ask</button>
    </div>
  </form>
  <section id="answer" class="answer" aria-live="polite"></section>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
    <label id="originalWrap" class="check"><input type="checkbox" id="original" checked> <span>Original language</span></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js topics
// 8 of the 76 topics, copied from the real src/topics.js.
//   kind: "book" → answers are labeled Tanakh / Bible / Qur'an; "faith" → Judaism / Christianity / Islam
//   keywords → words and phrases that point to the topic; "~" marks a weak, general word
const TOPICS = [
  {"id": "profile", "title": "About the book", "kind": "book", "keywords": ["~what is", "~tell me about", "~describe", "~explain", "~about", "~introduce"], "tanakh": "The Tanakh is the Hebrew Bible, the scripture of Judaism: 24 books in three parts, the Torah (Teaching), Nevi'im (Prophets) and Ketuvim (Writings). It tells of creation, God's covenant with Abraham and the people of Israel, the Exodus, the Law given at Sinai, the kings, the exile to Babylon and the return. It was written mostly in Hebrew over many centuries.", "bible": "The Christian Bible has two parts. The Old Testament contains the Hebrew scriptures (39 books in the Protestant count), and the New Testament (27 books, written in Greek in the 1st century CE) tells of the life, death and resurrection of Jesus and the early church. Eastern Orthodox Bibles have 76 books, Catholic Bibles 73 and Protestant Bibles 66; the difference is in the Old Testament.", "quran": "The Qur'an is the scripture of Islam: 114 surahs (chapters) and 6,236 verses in Arabic. Muslims believe it is the word of God revealed to the Prophet Muhammad through the angel Gabriel between 610 and 632 CE. It calls people to worship one God, retells the stories of earlier prophets and gives guidance for life."},
  {"id": "differences", "title": "How the books differ", "kind": "book", "keywords": ["~difference", "~different", "~differ", "~compare", "~comparison", "~contrast", "~versus", "~vs", "~distinguish", "~unique", "~similar", "~similarity", "~same"], "shared": "All three worship the God of Abraham and share many figures, such as Adam, Noah, Abraham, Moses and David. They differ in who is speaking, what story they tell, and which revelation they see as final.", "tanakh": "Mostly narrative, law, poetry and prophecy written by people about God, telling one long story of the people of Israel. Written over roughly a thousand years. Judaism does not accept the New Testament or the Qur'an as scripture.", "bible": "Keeps the Hebrew scriptures as the Old Testament and adds the New Testament about Jesus, whom Christians see as the fulfillment of those scriptures. The New Testament was written within about 50 years and includes Gospels, a history (Acts), letters and a prophecy (Revelation).", "quran": "Speaks almost entirely as God addressing Muhammad and humanity, often using \"We.\" It retells earlier prophets' stories briefly, as lessons, instead of in historical order. It affirms the Torah, Psalms and Gospel as earlier revelations but teaches that the Qur'an is the final, preserved one. Revealed over 23 years."},
  {"id": "age", "title": "How old each book is", "kind": "book", "keywords": ["how old", "how many years", "~old", "oldest", "older", "age", "ancient", "~when", "when was", "when did", "how long ago", "date", "dated", "century", "years ago", "newest", "newer", "first written", "timeline", "which came first"], "tanakh": "The oldest of the three. Jewish tradition dates the giving of the Torah at Sinai to more than 3,000 years ago. Scholars date its oldest parts, such as early poems, to around 1000 BCE or before, with most books written and edited between about 800 and 400 BCE. Daniel was finished around 165 BCE.", "bible": "Its Old Testament is the Tanakh. The New Testament is about 1,900–2,000 years old: Paul's letters came first, from about 50 CE, then the Gospels (about 65–100 CE) and Revelation (about 95 CE). Its 27-book list was first given in full in 367 CE.", "quran": "The newest of the three, about 1,400 years old: revealed from 610 to 632 CE and gathered into one standard text under Caliph Uthman around 650 CE."},
  {"id": "jesus", "title": "Jesus", "kind": "faith", "keywords": ["jesus", "christ", "isa", "son of god", "crucifixion", "crucified", "cross", "resurrection", "rose from the dead", "virgin birth", "nazareth", "born", "birth", "jesus born", "divine jesus", "jesus die"], "tanakh": "Jesus does not appear in the Tanakh. Judaism generally sees him as a Jewish teacher of the 1st century, not the Messiah and not divine.", "bible": "Jesus is the Son of God and the Messiah, born of the virgin Mary, who taught, healed, died by crucifixion for the sins of the world and rose from the dead.", "quran": "Jesus (Isa) is one of the greatest prophets and the Messiah, born of the virgin Mary, who performed miracles. He is not divine, and the Qur'an (4:157) says he was not killed or crucified; most Muslims believe God raised him up and that he will return."},
  {"id": "creation", "title": "Creation, Adam and Eve", "kind": "faith", "keywords": ["creation", "created", "create", "adam", "eve", "hawwa", "garden", "eden", "universe", "genesis", "first man", "first woman", "world", "six days", "forbidden fruit", "evolution", "science"], "tanakh": "Genesis opens with God creating the world in six days and resting on the seventh. God forms Adam and Eve and places them in the Garden of Eden until they disobey and are sent out.", "bible": "Christians share the Genesis account; the Gospel of John adds that all things were made through the Word (Jesus). Many Christians believe Adam's disobedience passed on \"original sin.\" Many Christians read Genesis alongside science; others read it more literally.", "quran": "Creation took place in six days (or periods). Adam and his wife live in the Garden, eat from the forbidden tree, repent, and are forgiven, so Islam does not teach original sin. Adam is the first prophet."},
  {"id": "afterlife", "title": "The afterlife", "kind": "faith", "keywords": ["afterlife", "heaven", "hell", "paradise", "jannah", "jahannam", "die", "death", "olam haba", "soul", "after death", "purgatory", "gehenna", "eternal life"], "tanakh": "The Tanakh says little about it; it speaks of Sheol, the place of the dead. Later Judaism developed belief in Olam Ha-Ba (the World to Come) and the resurrection of the dead, with emphasis on how to live this life.", "bible": "Eternal life with God in heaven for those saved through Jesus, and separation from God in hell. Catholics also believe in purgatory, a final purification before heaven.", "quran": "After the Day of Judgment, people go to Paradise (Jannah), described as gardens with rivers, or Hell (Jahannam), according to their faith and deeds and by God's mercy."},
  {"id": "worship", "title": "Prayer and worship", "kind": "faith", "keywords": ["pray", "prayer", "worship", "~synagogue", "~church", "~mosque", "service", "communion", "eucharist", "mass", "last supper", "sacrament", "salah", "salat", "how often", "times a day", "direction", "qibla", "kneel", "bow"], "tanakh": "Jews traditionally pray three times a day (morning, afternoon and evening), facing Jerusalem, and gather in synagogues, especially on the Sabbath.", "bible": "Christians gather in churches, usually on Sunday, for worship with Bible readings, prayer, songs and communion. The Lord's Prayer is shared by nearly all Christians.", "quran": "Muslims pray five times a day (salah) facing the Kaaba in Mecca, with set movements of standing, bowing and prostrating, and gather in mosques for Friday prayer (Jumu'ah)."},
  {"id": "fasting", "title": "Fasting", "kind": "faith", "keywords": ["fast", "fasting", "ramadan", "yom kippur fast", "lent", "not eat", "starve", "sawm"], "tanakh": "The main fast is Yom Kippur, about 25 hours with no food or drink, devoted to prayer and repentance. Tisha B'Av, mourning the Temple's destruction, is another full fast.", "bible": "Jesus fasted 40 days in the wilderness. Many Christians fast or give something up during the 40 days of Lent before Easter; Orthodox Christians keep many fast days through the year.", "quran": "Fasting (sawm) in the month of Ramadan is one of the Five Pillars: no food, drink or marital relations from dawn to sunset for 29–30 days, with exceptions for the sick, travelers and others."},
];
```

```js ask
const BOOK_KEYS = ['tanakh', 'bible', 'quran'];

// One spelling for words people write several ways
const SPELLINGS = [
  [/qur['’ʾ]?an|koran|coran/g, 'quran'],
  [/mohammed|mohammad|muhammed|mohamed/g, 'muhammad'],
  [/['’ʾʿ]/g, ''],                    // what's → whats
];

/** Lowercase, no accents or vowel marks, one spelling, only letters, digits and single spaces, padded with spaces. */
function normalize(text) {
  let s = String(text).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  for (const [pattern, replacement] of SPELLINGS) s = s.replace(pattern, replacement);
  return ` ${s.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `;
}

// Light stemming: enough to match plurals and verb forms ("prophets", "praying" → "prophet", "pray")
function stemOnce(word) {
  if (word.length <= 4 || !/^[a-z0-9]+$/.test(word)) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 5) return word.slice(0, -2);
  if (word.endsWith('es') && /(ch|sh|x|ss)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us')) return word.slice(0, -1);
  if (word.endsWith('e')) return word.slice(0, -1);
  return word;
}
function stem(word) {
  for (let next = stemOnce(word); next !== word; next = stemOnce(word)) word = next;   // miracles → miracle → miracl
  return word;
}
const stemText = (normalized) => ` ${normalized.trim().split(' ').map(stem).join(' ')} `;

// Keywords are prepared once: normalized, stemmed, and worth more the more words they have. Weak ones ("~") are worth 1.
const PREPARED = TOPICS.map((topic) => ({
  topic,
  keywords: topic.keywords.map((k) => {
    const weak = k.startsWith('~');
    const phrase = stemText(normalize(weak ? k.slice(1) : k));
    return { phrase, weak, points: weak ? 1 : phrase.trim().split(' ').length + 1 };
  }),
}));

/** Scores every topic. Longer phrases count more, and all the weak words together count 1 point. */
function rank(question) {
  const q = stemText(normalize(question));
  return PREPARED.map(({ topic, keywords }) => {
    let score = 0, weakHit = 0;
    for (const k of keywords) {
      if (!q.includes(k.phrase)) continue;
      if (k.weak) weakHit = 1;
      else score += k.points;
    }
    return { topic, score: score + weakHit };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);     // sort is stable: earlier topics win ties
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
$('original').onchange = () => goTo(current.section, current.chapter);

// ---------- Ask the sand (for now: which topics the question matches, and their scores) ----------
$('askForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('question').value.trim();
  if (!q) return;
  const ranked = rank(q);
  $('answer').innerHTML = `<h3>Topics for “${esc(q)}”</h3>` + (ranked.length
    ? `<ol>${ranked.map((r) => `<li>${esc(r.topic.title)}: ${r.score} point${r.score === 1 ? '' : 's'}</li>`).join('')}</ol>`
    : '<p>No topic matches.</p>');
});
```

## Step: Which books, and the answer
time: 20

*"What does Judaism teach about the afterlife?"* should answer for Judaism only. `findBooks()` looks for words that name a book or its faith:

| Book | Some of its words |
|---|---|
| Tanakh | torah, tanakh, jewish, judaism, hebrew bible |
| Bible | bible, gospel, new testament, christian |
| Qur'an | quran, islam, muslim |

One trap: *"hebrew bible"* contains *bible*. So after checking the Tanakh's words, those phrases are removed from the question before the Bible's words are checked.

**Building the answer.** `compose(topic, books)` makes the paragraphs:

1. what all three share (`shared`), when two or more books are compared;
2. one paragraph per book, labeled **Tanakh / Bible / Qur'an** for topics about the books themselves, or **Judaism / Christianity / Islam** for beliefs and practice (the topic's `kind`);
3. a note, if the topic has one.

The title says which books were compared: *Jesus · Christianity vs Islam*.

**When no topic matches.** *"Tell me about the Torah"* only matches weak words, so the **profile** topic wins; if the question names a book, it describes that book (or, naming two, how they differ). Anything else gets a friendly **fallback** suggesting questions the sand can answer. A fallback is better than the closest wrong answer.

These rules are the same as the real app's: for every sample question in this guide, `answer()` gives the same topic and books as SuperBook itself.

### Try it

*How do the Bible and the Qur'an see Jesus?* · *Tell me about the Torah* · *Tell me about the Bible and the Quran* · *When was the Hebrew Bible written?* · *xyzzy*

check: js | which books a question names | /function\s+findBooks\s*\(/
check: js | "hebrew bible" isn't the Bible | /hebrew \(bible\|scriptures\)/
check: js | the paragraphs for some or all books | /function\s+compose\s*\(/
check: js | answer() puts it together | /function\s+answer\s*\(/

quiz: Why remove "hebrew bible" from the question after checking the Tanakh's words?
- [ ] It's too long
- [x] Otherwise the word "bible" inside it would also select the Christian Bible
- [ ] The Tanakh has no other words
why: Check the longer phrase first, then take it out.
quiz: "Tell me about the Torah" matches only weak words. What does the sand answer?
- [ ] The fallback
- [x] The profile of the Tanakh, because the question names a book
- [ ] Every topic
why: A named book with no topic means "describe this book".

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
  <form id="askForm" class="ask">
    <label for="question">Ask the sand</label>
    <div class="row">
      <input id="question" autocomplete="off" placeholder="Ask anything, e.g. How do the Bible and the Qur'an see Jesus?">
      <button>Ask</button>
    </div>
  </form>
  <section id="answer" class="answer" aria-live="polite"></section>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
    <label id="originalWrap" class="check"><input type="checkbox" id="original" checked> <span>Original language</span></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js ask
const BOOK_KEYS = ['tanakh', 'bible', 'quran'];

// One spelling for words people write several ways
const SPELLINGS = [
  [/qur['’ʾ]?an|koran|coran/g, 'quran'],
  [/mohammed|mohammad|muhammed|mohamed/g, 'muhammad'],
  [/['’ʾʿ]/g, ''],                    // what's → whats
];

/** Lowercase, no accents or vowel marks, one spelling, only letters, digits and single spaces, padded with spaces. */
function normalize(text) {
  let s = String(text).toLowerCase().normalize('NFD').replace(/\p{M}/gu, '');
  for (const [pattern, replacement] of SPELLINGS) s = s.replace(pattern, replacement);
  return ` ${s.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()} `;
}

// Light stemming: enough to match plurals and verb forms ("prophets", "praying" → "prophet", "pray")
function stemOnce(word) {
  if (word.length <= 4 || !/^[a-z0-9]+$/.test(word)) return word;
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
  if (word.endsWith('ed') && word.length > 5) return word.slice(0, -2);
  if (word.endsWith('es') && /(ch|sh|x|ss)es$/.test(word)) return word.slice(0, -2);
  if (word.endsWith('s') && !word.endsWith('ss') && !word.endsWith('us')) return word.slice(0, -1);
  if (word.endsWith('e')) return word.slice(0, -1);
  return word;
}
function stem(word) {
  for (let next = stemOnce(word); next !== word; next = stemOnce(word)) word = next;   // miracles → miracle → miracl
  return word;
}
const stemText = (normalized) => ` ${normalized.trim().split(' ').map(stem).join(' ')} `;

// Keywords are prepared once: normalized, stemmed, and worth more the more words they have. Weak ones ("~") are worth 1.
const PREPARED = TOPICS.map((topic) => ({
  topic,
  keywords: topic.keywords.map((k) => {
    const weak = k.startsWith('~');
    const phrase = stemText(normalize(weak ? k.slice(1) : k));
    return { phrase, weak, points: weak ? 1 : phrase.trim().split(' ').length + 1 };
  }),
}));

/** Scores every topic. Longer phrases count more, and all the weak words together count 1 point. */
function rank(question) {
  const q = stemText(normalize(question));
  return PREPARED.map(({ topic, keywords }) => {
    let score = 0, weakHit = 0;
    for (const k of keywords) {
      if (!q.includes(k.phrase)) continue;
      if (k.weak) weakHit = 1;
      else score += k.points;
    }
    return { topic, score: score + weakHit };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);     // sort is stable: earlier topics win ties
}

// Words that name a book or its faith. "hebrew bible" is removed before looking for "bible".
const BOOK_WORDS = {
  tanakh: ['tanakh', 'tanach', 'torah', 'hebrew bible', 'hebrew scriptures', 'jewish', 'jews', 'jew', 'judaism', 'talmud'],
  bible: ['bible', 'new testament', 'old testament', 'gospel', 'gospels', 'christian', 'christians', 'christianity'],
  quran: ['quran', 'islam', 'islamic', 'muslim', 'muslims'],
};

function findBooks(question) {
  let q = normalize(question);
  const found = [];
  for (const book of BOOK_KEYS) {
    if (BOOK_WORDS[book].some((w) => q.includes(` ${w} `))) found.push(book);
    if (book === 'tanakh') {
      q = q.replace(/ hebrew (bible|scriptures) /g, ' ');
    }
  }
  return found;
}

const LABELS = {
  book: { tanakh: 'Tanakh', bible: 'Bible', quran: "Qur'an" },
  faith: { tanakh: 'Judaism', bible: 'Christianity', quran: 'Islam' },
};
const label = (kind, book) => LABELS[kind][book];

/** The paragraphs for a topic, for some or all of the books */
function compose(topic, books = BOOK_KEYS) {
  const kind = topic.kind ?? 'faith';
  const text = (field) => topic[field];
  const answer = [];
  if (topic.shared && books.length > 1) answer.push(text('shared'));
  for (const book of books) answer.push(`${label(kind, book)}: ${text(book)}`);
  if (topic.note) answer.push(text('note'));
  const names = books.map((b) => label(kind, b));
  const title = books.length === BOOK_KEYS.length ? text('title')
    : books.length === 1 ? `${text('title')} · ${names[0]}`
    : `${text('title')} · ${names.join(` ${'vs'} `)}`;
  return { title, answer };
}

const FALLBACK = {
  title: 'Ask me about…',
  answer: ["The sand doesn't know that one yet.", 'Try a question about how old the books are, Jesus, creation, the afterlife, prayer or fasting. Name one or two books to compare just those.'],
};
const fallback = () => FALLBACK;

const PROFILE = TOPICS.find((x) => x.id === 'profile');
const DIFFERENCES = TOPICS.find((x) => x.id === 'differences');

function answer(question) {
  if (normalize(question).trim().length < 2) return fallback();
  const named = findBooks(question);
  const books = named.length ? named : BOOK_KEYS;
  const [best] = rank(question);
  // "Tell me about the Torah", "What is Islam?": no other topic, so describe the book (or how the named ones differ)
  if ((!best || best.topic.id === 'profile') && named.length) {
    return named.length > 1 ? compose(DIFFERENCES, books) : compose(PROFILE, books);
  }
  if (!best || best.topic.id === 'profile') return fallback();
  return compose(best.topic, books);
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
$('original').onchange = () => goTo(current.section, current.chapter);

// ---------- Ask the sand ----------
$('askForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('question').value.trim();
  if (!q) return;
  const topic = answer(q);
  $('answer').innerHTML = `<h3>${esc(topic.title)}</h3>` + topic.answer.map((p) => `<p>${esc(p)}</p>`).join('');
});
```

## Session: Writing in the sand

## Step: Letters pressed into sand
time: 20

Now the answer is **written into the sand** on a `<canvas>`, line by line, as if by a finger.

```svg A groove is two copies of the text, revealed by a growing clip
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 150" font-family="Comic Sans MS, cursive"><rect x="10" y="10" width="410" height="80" rx="8" fill="#e6c48a"/><text x="31" y="61.5" font-size="30" fill="rgba(255,240,205,.85)">Ask the sand</text><text x="30" y="60" font-size="30" fill="rgba(120,72,28,.9)">Ask the</text><rect x="148" y="24" width="2" height="48" fill="#b91c1c"/><g font-family="sans-serif" font-size="11" fill="#1f2937"><text x="16" y="110">1. light copy, 1 px right and 1.5 px down: the lit edge of the groove</text><text x="16" y="126">2. dark copy on top: the shadowed inside</text><text x="16" y="142">3. a clip rectangle grows each frame (red line), revealing the letters</text></g></svg>
```

**Wrapping.** A canvas doesn't wrap text, so `wrap()` does: it adds words to a line while `ctx.measureText(line).width` still fits, then starts a new line. Paragraphs get a blank line between them. The canvas's height is then set to fit every line.

**Sharp on every screen.** A phone may have 3 screen pixels per CSS pixel (`devicePixelRatio`). The canvas gets that many more pixels (`canvas.width = width * dpr`), stays the same size on the page, and `ctx.setTransform(dpr, …)` scales all drawing up to match. Without this, text on a canvas looks blurry.

**The groove.** Each line is drawn twice: a light copy 1 px right and 1.5 px down (the lit edge), then a dark copy on top (the shadowed inside). Together they look pressed in.

**Writing it.** Each line is a **job** with a start time; one line starts when the line before it is finished. On every animation frame, `draw()` works out how many pixels of each line should be visible by now, and `ctx.clip()` limits drawing to a rectangle that wide. The writing speed is 900 px a second, but faster for long answers, so none takes more than about 9 seconds. `requestAnimationFrame(draw)` asks the browser to call `draw` again before the next screen refresh, until every line is written.

**Screen readers** can't read a canvas, so the same answer goes into a visually hidden paragraph with `aria-live="polite"`, which is read out when it changes.

The sand must be **visible before writing**: a hidden element has no width to measure. And when the window is resized, the answer is redrawn at the new width, all at once.

### Try it

Ask a question and watch it being written. Make the window narrower: the lines re-wrap.

check: html | a canvas in the sand | /<canvas\s+id="sand"/
check: js | a SandWriter class | /class\s+SandWriter/
check: js | sharp on high-density screens | /devicePixelRatio/
check: js | wrap lines to the width | /measureText\(/
check: js | reveal each line with a clip | /ctx\.clip\(\)/
check: js | one frame at a time | /requestAnimationFrame\(\s*draw\s*\)/

quiz: Why draw each line twice, offset slightly?
- [ ] To make it bolder
- [x] A light copy below and a dark copy on top look like a groove pressed into the sand
- [ ] Canvas text needs two passes
why: Light from above: a lit lower edge and a shadowed inside.
quiz: Why does the canvas get width × devicePixelRatio pixels?
- [ ] To use less memory
- [x] So it has one canvas pixel per screen pixel and stays sharp on high-density screens
- [ ] Because CSS pixels are larger on desktops
why: The page size stays the same; only the drawing gets more detail.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
  <form id="askForm" class="ask">
    <label for="question">Ask the sand</label>
    <div class="row">
      <input id="question" autocomplete="off" placeholder="Ask anything, e.g. How do the Bible and the Qur'an see Jesus?">
      <button>Ask</button>
    </div>
  </form>
  <div id="sandWrap" class="sand-wrap" hidden>
    <canvas id="sand"></canvas>
    <p id="spoken" class="sr-only" aria-live="polite"></p>
  </div>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
    <label id="originalWrap" class="check"><input type="checkbox" id="original" checked> <span>Original language</span></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js sand
// Writes text into the sand on a <canvas>: letters appear as grooves pressed into the dune, one line at a time.
class SandWriter {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frame = null;
  }

  // Break paragraphs into lines that fit the width, with a blank line between paragraphs
  wrap(paragraphs, font, maxWidth) {
    const ctx = this.ctx;
    ctx.font = font;
    const lines = [];
    paragraphs.forEach((p, i) => {
      let line = '';
      for (const word of p.split(' ')) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
        else line = test;
      }
      lines.push(line);
      if (i < paragraphs.length - 1) lines.push('');
    });
    return lines;
  }

  write(title, paragraphs) {
    cancelAnimationFrame(this.frame);
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const size = width < 500 ? 17 : 21;
    const font = `${size}px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`;
    const titleFont = `bold ${size + 8}px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`;
    const pad = 24, lineH = size * 1.55;
    const lines = this.wrap(paragraphs, font, width - pad * 2);
    const titleLines = this.wrap([title], titleFont, width - pad * 2);
    const titleH = (size + 8) * 1.6 + (titleLines.length - 1) * (size + 8) * 1.3;
    const height = pad * 2 + titleH + lines.length * lineH;
    // Sharp on high-density screens: more canvas pixels than CSS pixels, then scale the drawing up to match
    this.canvas.style.height = `${height}px`;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Each line is a job that is revealed from its start, one after another
    const x = pad;
    const jobs = titleLines.map((text, i) => ({ text, font: titleFont, x, y: pad + size + 6 + i * (size + 8) * 1.3 }));
    lines.forEach((text, i) => jobs.push({ text, font, x, y: pad + titleH + (i + 0.8) * lineH }));
    for (const job of jobs) { ctx.font = job.font; job.width = ctx.measureText(job.text).width; }
    // 900 px per second, but faster for long answers so none takes more than about 9 seconds
    const textWidth = jobs.reduce((sum, job) => sum + job.width, 0);
    const speed = Math.max(900, textWidth / (9 - jobs.length * 0.06));
    let offset = 0;
    for (const job of jobs) {
      job.start = offset;
      offset += job.width / speed * 1000 + 60;
    }
    const total = offset;
    const start = performance.now();

    // A groove: a light edge just below, the dark letters on top, so they look pressed in
    const groove = (job, upTo) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(job.x - 4, job.y - 60, upTo + 8, 90);
      ctx.clip();
      ctx.font = job.font;
      ctx.fillStyle = 'rgba(255, 240, 205, 0.85)';
      ctx.fillText(job.text, job.x + 1, job.y + 1.5);
      ctx.fillStyle = 'rgba(120, 72, 28, 0.9)';
      ctx.fillText(job.text, job.x, job.y);
      ctx.restore();
    };

    const draw = (now) => {
      const t = now - start;
      ctx.clearRect(0, 0, width, height);
      for (const job of jobs) {
        const elapsed = t - job.start;
        if (elapsed <= 0) continue;
        const shown = Math.min(job.width, (elapsed / 1000) * speed);
        groove(job, shown);
      }
      if (t < total) this.frame = requestAnimationFrame(draw);
    };
    this.frame = requestAnimationFrame(draw);
  }
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
$('original').onchange = () => goTo(current.section, current.chapter);

// ---------- Ask the sand ----------
const writer = new SandWriter($('sand'));
let lastTopic = null;
let lastQuestion = null;

function ask(question) {
  const topic = answer(question);
  lastTopic = topic;
  lastQuestion = question;
  $('spoken').textContent = `${topic.title}. ${topic.answer.join(' ')}`;     // screen readers get the answer as text
  $('sandWrap').hidden = false;                    // visible first, so the canvas has a width to measure
  writer.write(topic.title, topic.answer);
  $('sandWrap').scrollIntoView({ behavior: false ? 'auto' : 'smooth', block: 'start' });
}

$('askForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('question').value.trim();
  if (q) ask(q);
});

// Redraw at the new width when the window is resized or a phone is turned (no animation the second time)
let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (lastTopic) writer.write(lastTopic.title, lastTopic.answer); }, 200);
});
```

## Step: Grains, wind and reduced motion
time: 15

Three finishing touches.

**Flying grains.** While a line is being written, each frame adds three grains at the tip of the "finger", each with a random speed up and back. Every frame, each grain moves by its speed, gravity adds a little to its downward speed (`g.vy += 0.12`), and its `life` drops a little. The grain is drawn as a tiny square, fading with its life, and removed when its life runs out. The animation keeps running until the writing is done **and** the last grain has settled.

**The wind.** *Let the wind smooth the sand* copies the canvas into a second, off-screen canvas. For 25 frames, it clears the sand and draws the copy a little further right and a little fainter (`globalAlpha`), so the writing blows away. Then the sand is hidden.

**Reduced motion.** Some people turn off animations in their system settings, for comfort or because motion makes them unwell. `matchMedia('(prefers-reduced-motion: reduce)')` tells the page, and then:

| | Normal | Reduced motion |
|---|---|---|
| writing | letter by letter | the whole answer at once (`t = total`) |
| grains | yes | none |
| wind | blows away | cleared at once |
| scrolling to the answer | smooth | jumps |

check: js | grains thrown by the finger | /this\.grains\.push\(/
check: js | respect reduced motion | /prefers-reduced-motion/
check: js | the wind smooths the sand | /smooth\(\s*done/
check: html | a wind button | /id="smooth"/

quiz: With reduced motion on, how does write() show the answer?
- [ ] It doesn't show it
- [x] It treats the time as already finished, so every line is drawn at once
- [ ] It writes more slowly
why: Same result, no motion.
quiz: Why keep animating after the last line is written?
- [ ] To use the CPU
- [x] Grains thrown in the last frames are still flying and need to land
- [ ] The canvas needs it
why: The loop stops when the writing is done and no grains are left.

```html page
<div class="sky" aria-hidden="true"><div class="sun"></div><div class="dune far"></div><div class="dune near"></div></div>
<header class="top">
  <h1>SuperBook</h1>
  <p class="tagline">Three sacred books of the Abrahamic faiths. Open a book to read it, or ask the sand a question.</p>
</header>
<main>
  <div class="books">
    <button class="book tanakh" data-book="tanakh">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><polygon points="50,14 82,70 18,70"/><polygon points="50,86 18,30 82,30"/></svg>
      <span class="title">Tanakh</span>
      <span class="faith">Judaism</span>
    </button>
    <button class="book bible" data-book="bible">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><path d="M44 14h12v24h20v12H56v36H44V50H24V38h20z"/></svg>
      <span class="title">Holy Bible</span>
      <span class="faith">Christianity</span>
    </button>
    <button class="book quran" data-book="quran">
      <svg class="symbol" viewBox="0 0 100 100" aria-hidden="true"><rect x="27" y="27" width="46" height="46"/><rect x="27" y="27" width="46" height="46" transform="rotate(45 50 50)"/><circle cx="50" cy="50" r="9"/></svg>
      <span class="title">Qur'an</span>
      <span class="faith">Islam</span>
    </button>
  </div>
  <form id="askForm" class="ask">
    <label for="question">Ask the sand</label>
    <div class="row">
      <input id="question" autocomplete="off" placeholder="Ask anything, e.g. How do the Bible and the Qur'an see Jesus?">
      <button>Ask</button>
    </div>
  </form>
  <div id="sandWrap" class="sand-wrap" hidden>
    <canvas id="sand"></canvas>
    <p id="spoken" class="sr-only" aria-live="polite"></p>
    <button id="smooth" class="smooth" type="button">Let the wind smooth the sand</button>
  </div>
</main>
<dialog id="reader" class="reader">
  <header>
    <div><h2 id="readerTitle"></h2><p id="readerFaith" class="muted"></p></div>
    <button id="close" class="close" aria-label="Close book">✕</button>
  </header>
  <div class="pickers">
    <label><span id="sectionLabel">Book</span> <select id="section"></select></label>
    <label id="chapterWrap"><span>Chapter</span> <select id="chapter"></select></label>
    <label id="originalWrap" class="check"><input type="checkbox" id="original" checked> <span>Original language</span></label>
  </div>
  <div id="verses" class="verses"></div>
  <footer>
    <button id="prev">← <span>Previous</span></button>
    <button id="next"><span>Next</span> →</button>
  </footer>
</dialog>
```

```js sand
// Writes text into the sand on a <canvas>: letters appear as grooves pressed into the dune, one line at a time.
class SandWriter {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.frame = null;
    this.grains = [];
  }

  // Break paragraphs into lines that fit the width, with a blank line between paragraphs
  wrap(paragraphs, font, maxWidth) {
    const ctx = this.ctx;
    ctx.font = font;
    const lines = [];
    paragraphs.forEach((p, i) => {
      let line = '';
      for (const word of p.split(' ')) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
        else line = test;
      }
      lines.push(line);
      if (i < paragraphs.length - 1) lines.push('');
    });
    return lines;
  }

  write(title, paragraphs, { reducedMotion = false } = {}) {
    cancelAnimationFrame(this.frame);
    const dpr = window.devicePixelRatio || 1;
    const width = this.canvas.clientWidth;
    const size = width < 500 ? 17 : 21;
    const font = `${size}px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`;
    const titleFont = `bold ${size + 8}px "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive`;
    const pad = 24, lineH = size * 1.55;
    const lines = this.wrap(paragraphs, font, width - pad * 2);
    const titleLines = this.wrap([title], titleFont, width - pad * 2);
    const titleH = (size + 8) * 1.6 + (titleLines.length - 1) * (size + 8) * 1.3;
    const height = pad * 2 + titleH + lines.length * lineH;
    // Sharp on high-density screens: more canvas pixels than CSS pixels, then scale the drawing up to match
    this.canvas.style.height = `${height}px`;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Each line is a job that is revealed from its start, one after another
    const x = pad;
    const jobs = titleLines.map((text, i) => ({ text, font: titleFont, x, y: pad + size + 6 + i * (size + 8) * 1.3 }));
    lines.forEach((text, i) => jobs.push({ text, font, x, y: pad + titleH + (i + 0.8) * lineH }));
    for (const job of jobs) { ctx.font = job.font; job.width = ctx.measureText(job.text).width; }
    // 900 px per second, but faster for long answers so none takes more than about 9 seconds
    const textWidth = jobs.reduce((sum, job) => sum + job.width, 0);
    const speed = Math.max(900, textWidth / (9 - jobs.length * 0.06));
    let offset = 0;
    for (const job of jobs) {
      job.start = offset;
      offset += job.width / speed * 1000 + 60;
    }
    const total = offset;
    const start = performance.now();
    this.grains = [];

    // A groove: a light edge just below, the dark letters on top, so they look pressed in
    const groove = (job, upTo) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(job.x - 4, job.y - 60, upTo + 8, 90);
      ctx.clip();
      ctx.font = job.font;
      ctx.fillStyle = 'rgba(255, 240, 205, 0.85)';
      ctx.fillText(job.text, job.x + 1, job.y + 1.5);
      ctx.fillStyle = 'rgba(120, 72, 28, 0.9)';
      ctx.fillText(job.text, job.x, job.y);
      ctx.restore();
    };

    const draw = (now) => {
      const t = reducedMotion ? total : now - start;
      ctx.clearRect(0, 0, width, height);
      for (const job of jobs) {
        const elapsed = t - job.start;
        if (elapsed <= 0) continue;
        const shown = Math.min(job.width, (elapsed / 1000) * speed);
        groove(job, shown);
        if (shown < job.width && !reducedMotion) {
          // the "finger" throws a few grains up and back
          for (let k = 0; k < 3; k++) {
            this.grains.push({ x: job.x + shown, y: job.y - 6, vx: -Math.random() * 1.6, vy: -Math.random() * 2.2, life: 1 });
          }
        }
      }
      for (const g of this.grains) {
        g.x += g.vx; g.y += g.vy; g.vy += 0.12; g.life -= 0.03;          // fly, fall and fade
        ctx.fillStyle = `rgba(150, 100, 45, ${Math.max(g.life, 0)})`;
        ctx.fillRect(g.x, g.y, 1.6, 1.6);
      }
      this.grains = this.grains.filter((g) => g.life > 0);
      if (t < total || this.grains.length) this.frame = requestAnimationFrame(draw);
    };
    this.frame = requestAnimationFrame(draw);
  }

  // The wind sweeps the writing away: a copy of the canvas slides right and fades out
  smooth(done, reducedMotion = false) {
    cancelAnimationFrame(this.frame);
    const { canvas, ctx } = this;
    if (reducedMotion) { ctx.clearRect(0, 0, canvas.width, canvas.height); done?.(); return; }
    const copy = document.createElement('canvas');
    copy.width = canvas.width;
    copy.height = canvas.height;
    copy.getContext('2d').drawImage(canvas, 0, 0);
    let step = 0;
    const blow = () => {
      step++;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, 1 - step / 25);
      ctx.drawImage(copy, step * 6, 0);
      ctx.globalAlpha = 1;
      if (step < 25) this.frame = requestAnimationFrame(blow);
      else { ctx.clearRect(0, 0, canvas.width, canvas.height); done?.(); }
    };
    blow();
  }
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Reader ----------
document.querySelectorAll('.book').forEach((el) => el.addEventListener('click', () => openBook(el.dataset.book)));
$('close').onclick = () => $('reader').close();
// A click on the dark backdrop lands on the dialog itself: close it
$('reader').addEventListener('click', (e) => { if (e.target === $('reader')) $('reader').close(); });
$('section').onchange = (e) => goTo(e.target.value, 1);
$('chapter').onchange = (e) => goTo(current.section, Number(e.target.value));
$('prev').onclick = () => step(-1);
$('next').onclick = () => step(1);
$('original').onchange = () => goTo(current.section, current.chapter);

// ---------- Ask the sand ----------
const writer = new SandWriter($('sand'));
let lastTopic = null;
let lastQuestion = null;

function ask(question) {
  const topic = answer(question);
  lastTopic = topic;
  lastQuestion = question;
  $('spoken').textContent = `${topic.title}. ${topic.answer.join(' ')}`;     // screen readers get the answer as text
  $('sandWrap').hidden = false;                    // visible first, so the canvas has a width to measure
  writer.write(topic.title, topic.answer, { reducedMotion });
  $('sandWrap').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

$('askForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('question').value.trim();
  if (q) ask(q);
});

// Redraw at the new width when the window is resized or a phone is turned (no animation the second time)
let resizeTimer;
addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => { if (lastTopic) writer.write(lastTopic.title, lastTopic.answer, { reducedMotion: true }); }, 200);
});

$('smooth').onclick = () => {
  lastTopic = null;
  lastQuestion = null;
  writer.smooth(() => { $('sandWrap').hidden = true; }, reducedMotion);
};
```

## Finish

### What you learned

- A CSS scene with gradients and shaped boxes, symbols in inline SVG, and a modal `<dialog>`
- Tables of contents and previous/next that crosses from book to book
- `fetch` with `async`/`await`, readable errors, and guarding against responses that arrive late
- Converting three APIs into one shape, and caching promises
- Matching questions to topics: normalizing, stemming, weighted keywords and named books
- Writing on a canvas: wrapping, sharp on every screen, clipped reveals, particles and a wind effect
- Respecting reduced motion and screen readers
- Text by key with an English fallback, and a right-to-left layout

### Challenges

1. **Search the chapter:** add a box in the reader that highlights a word in the verses (escape it first).
2. **Remember your place:** save the last book and chapter, and offer to continue where you left off.
3. **A new topic:** add one to `TOPICS` with its own keywords, and check that it doesn't steal questions from the others.
4. **Name a passage:** recognize "John 3" in a question and open the reader there.
5. **A third language:** add a small French pack with a few page texts and one topic, and watch everything else fall back to English.

Compare yours with the [live site](https://theoyanvno.github.io/SuperBook/) and the [source code](https://github.com/TheoYanvno/SuperBook).
