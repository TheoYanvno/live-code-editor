---
id: quote
title: Quote & Joke Generator
blocks-html: page
blocks-css: base
blocks-js: data, picker, accounts, api, ui, go
goals: Keep content as an array of objects and pick from it at random without repeats; Make a "today's pick" that is the same for everyone without a server; Filter by category, animate text and respect reduced-motion settings; Save favorites that survive blocked storage; Build sign-up and log-in rules: validation, salted password hashing, sessions and lockouts; Put a whole REST API behind one function so the same rules run on a server and in the browser
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects); Arrow functions, template literals and array map and filter; async and await help in session 3
---

## Session: Quotes on a card

## Step: Content as data, and a random pick
time: 15

Welcome! In this guide you'll rebuild my [Quote & Joke Generator](https://theoyanvno.github.io/quote-and-joke-generator/): inspiring quotes and clean jokes, a punchline you reveal with a click, today's pick, categories, favorites, and accounts so your favorites follow you.

Everything starts with the **content as data**: an array of plain objects.

```svg A quote and a joke as objects: both have tags, so one filter works for both
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 150" font-family="sans-serif"><rect x="10" y="15" width="200" height="110" rx="8" fill="#eef2ff" stroke="#4f46e5"/><text x="22" y="36" font-size="12" font-weight="700">a quote</text><text x="22" y="56" font-size="11">text: "Well begun is half done."</text><text x="22" y="74" font-size="11">author: "Aristotle"</text><text x="22" y="92" font-size="11">source: "Politics"</text><text x="22" y="110" font-size="11">tags: ["motivation"]</text><rect x="220" y="15" width="200" height="110" rx="8" fill="#fff7ed" stroke="#ea580c"/><text x="232" y="36" font-size="12" font-weight="700">a joke</text><text x="232" y="56" font-size="11">setup: "Why did the scarecrow…"</text><text x="232" y="74" font-size="11">punchline: "He was outstanding…"</text><text x="232" y="92" font-size="11">tags: ["dad"]</text><text x="215" y="144" text-anchor="middle" font-size="11" fill="#475569">same tags field on both, so one filter works for quotes and jokes</text></svg>
```

The quotes come from public-domain sources, each with its author and where it's from; the jokes were written for the project. Adding one is adding an object, and nothing else in the code has to change.

**Picking without repeats.** `Math.floor(Math.random() * length)` picks a random index, but pressing "New one" and getting the same quote again feels broken. `nextIndex(length, last)` fixes that neatly:

```svg Pick from one fewer slot, then step over the last index
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 140" font-family="sans-serif"><rect x="20" y="20" width="44" height="34" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="42" y="42" text-anchor="middle" font-size="13">0</text><rect x="72" y="20" width="44" height="34" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="94" y="42" text-anchor="middle" font-size="13">1</text><rect x="124" y="20" width="44" height="34" rx="6" fill="#fde2e1" stroke="#475569"/><text x="146" y="42" text-anchor="middle" font-size="13">2</text><rect x="176" y="20" width="44" height="34" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="198" y="42" text-anchor="middle" font-size="13">3</text><rect x="228" y="20" width="44" height="34" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="250" y="42" text-anchor="middle" font-size="13">4</text><text x="124" y="72" text-anchor="middle" font-size="11" fill="#b91c1c">last shown: 2</text><rect x="46" y="92" width="44" height="34" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="68" y="114" text-anchor="middle" font-size="13">0</text><rect x="98" y="92" width="44" height="34" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="120" y="114" text-anchor="middle" font-size="13">1</text><rect x="150" y="92" width="44" height="34" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="172" y="114" text-anchor="middle" font-size="13">3</text><rect x="202" y="92" width="44" height="34" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="224" y="114" text-anchor="middle" font-size="13">4</text><text x="300" y="36" font-size="11">pick 0-3 from length - 1 = 4 slots</text><text x="300" y="54" font-size="11">then if pick >= last, add 1</text><text x="300" y="110" font-size="11" fill="#15803d">every other item is</text><text x="300" y="126" font-size="11" fill="#15803d">equally likely, never 2</text></svg>
```

1. Pick from `length - 1` slots instead of `length`.
2. If the pick is at or after the last index, add 1, which skips over it.

Every *other* item is equally likely, and the last one can never come up. No loop of "pick again until it's different" is needed.

The `rand` parameter defaults to `Math.random`, but a test can pass its own function to make the result predictable.

### What to write

- **HTML/CSS:** the whole page is here from the start: tabs, the card, buttons, the saved list and a log-in dialog you'll wire up later.
- **JavaScript:** `QUOTES`, `nextIndex()`, `show()` to put a quote on the card, and `next()` for the button.

### Try it

Press **New one** a few times: never the same quote twice in a row.

check: js | an array of quotes | /const\s+QUOTES\s*=\s*\[/
check: js | a nextIndex() function | /function\s+nextIndex\s*\(/
check: js | one fewer slot than items | /Math\.floor\(\s*rand\(\)\s*\*\s*\(\s*length\s*-\s*1\s*\)\s*\)/
check: js | step over the last pick | /if\s*\(\s*i\s*>=\s*last/

quiz: There are 5 quotes and the last one shown was index 2. nextIndex picks 3 from the 4 slots. Which quote is shown?
- [ ] Index 3
- [x] Index 4, because 3 is at or after the last index, so it steps up by one
- [ ] Index 2
why: Picks 0 and 1 stay; picks 2 and 3 become 3 and 4, so index 2 is never chosen.
quiz: Why keep quotes and jokes as data instead of writing them into the HTML?
- [ ] HTML can't hold quotes
- [x] The code can pick, filter, save and share any item the same way, and adding one is just adding an object
- [ ] It makes the page load faster
why: When content is data, features work for every item, including ones added later.

```html page
<main class="app">
  <div class="account" id="account" hidden>
    <span class="demo-badge" title="Accounts in this guide live in memory, in this page only">Demo</span>
    <span id="who" class="who" hidden></span>
    <button id="loginBtn" class="ghost">Log in</button>
    <button id="logoutBtn" class="ghost" hidden>Log out</button>
  </div>

  <header>
    <h1>Quote <span>&amp;</span> Joke</h1>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected="true" data-mode="quote">💬 Quotes</button>
      <button role="tab" aria-selected="false" data-mode="joke">😄 Jokes</button>
      <button role="tab" aria-selected="false" data-mode="fav">★ Saved</button>
    </div>
  </header>

  <section id="generator" class="card-area">
    <label class="filter">Category <select id="tag"></select></label>
    <article id="card" class="card" aria-live="polite">
      <p id="daily" class="daily" hidden>Today's pick</p>
      <p id="main" class="main"></p>
      <p id="sub" class="sub"></p>
      <button id="reveal" class="reveal" hidden>Reveal the punchline</button>
    </article>
    <div class="actions">
      <button id="next" class="primary">New one <kbd>Space</kbd></button>
      <button id="copy">Copy</button>
      <button id="save">☆ Save</button>
      <a id="share" target="_blank" rel="noopener">Share</a>
    </div>
    <p id="toast" class="toast" role="status"></p>
  </section>

  <section id="favorites" hidden>
    <p id="favWhere" class="fav-where"></p>
    <ul id="favList" class="fav-list"></ul>
    <p id="favEmpty" class="empty">Nothing saved yet. Tap ☆ Save on a quote or joke you like.</p>
  </section>
</main>

<dialog id="authDialog" aria-labelledby="authTitle">
  <form id="authForm" novalidate>
    <div class="auth-tabs" role="tablist">
      <button type="button" role="tab" data-auth="login" aria-selected="true">Log in</button>
      <button type="button" role="tab" data-auth="signup" aria-selected="false">Create account</button>
    </div>
    <h2 id="authTitle">Welcome back</h2>
    <p class="demo-note">This guide keeps accounts in memory, in this page only. Make up a username and password; don't reuse a real one.</p>
    <label for="username">Username</label>
    <input id="username" autocomplete="username" autocapitalize="none" spellcheck="false">
    <p class="field-error" id="usernameError"></p>
    <label for="password">Password</label>
    <input id="password" type="password" autocomplete="current-password">
    <p class="field-error" id="passwordError"></p>
    <p class="form-error" id="authError" role="alert"></p>
    <div class="auth-actions">
      <button type="button" id="authCancel">Cancel</button>
      <button type="submit" id="authSubmit" class="primary">Log in</button>
    </div>
  </form>
</dialog>
```

```css base
:root { --bg1: #4f46e5; --bg2: #db2777; --card: #fff; --text: #1f2937; --muted: #6b7280; }
* { box-sizing: border-box; }
[hidden] { display: none !important; }
body { margin: 0; min-height: 100vh; font-family: system-ui, sans-serif; color: var(--text); display: grid; place-items: center; padding: 16px;
       background: linear-gradient(135deg, var(--bg1), var(--bg2)); }
/* each tab sets its own two background colors */
body.joke { --bg1: #f59e0b; --bg2: #ef4444; }
body.fav { --bg1: #0ea5e9; --bg2: #6366f1; }
.app { width: min(680px, 100%); }
header { text-align: center; color: #fff; }
h1 { margin: 0 0 14px; font-size: clamp(2rem, 7vw, 3rem); letter-spacing: -.02em; }
h1 span { opacity: .7; }
.tabs { display: inline-flex; background: rgba(255,255,255,.2); border-radius: 999px; padding: 4px; gap: 4px; }
.tabs button { border: 0; background: transparent; color: #fff; font: inherit; font-weight: 600; padding: 8px 14px; border-radius: 999px; cursor: pointer; }
.tabs button[aria-selected="true"] { background: #fff; color: var(--text); }
.card-area, #favorites { margin-top: 20px; }
.filter { display: block; color: #fff; text-align: right; margin-bottom: 8px; }
.filter select { font: inherit; padding: 4px 8px; border-radius: 8px; border: 0; }
.card { background: var(--card); border-radius: 20px; padding: clamp(24px, 5vw, 44px); box-shadow: 0 20px 50px rgba(0,0,0,.25); min-height: 220px;
        display: flex; flex-direction: column; justify-content: center; }
.card.flip { animation: flip .45s ease; }
.main { font-size: clamp(1.25rem, 4vw, 1.7rem); line-height: 1.4; margin: 0; font-family: Georgia, serif; }
.main.typing::after { content: "▍"; animation: blink .7s steps(1) infinite; }
.sub { color: var(--muted); margin: 16px 0 0; font-size: 1rem; }
.sub.punch { color: var(--text); font-size: 1.3rem; font-weight: 700; animation: pop .35s ease; }
.daily { margin: 0 0 10px; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--bg2); }
.reveal { align-self: flex-start; margin-top: 16px; }
.actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 18px; }
button, .actions a { font: inherit; padding: 10px 18px; border-radius: 999px; border: 0; background: rgba(255,255,255,.9); color: var(--text); cursor: pointer; text-decoration: none; font-weight: 600; }
.primary { background: #111827; color: #fff; }
kbd { font-size: .7rem; opacity: .7; border: 1px solid currentColor; border-radius: 4px; padding: 0 4px; margin-left: 4px; }
.toast { text-align: center; color: #fff; min-height: 1.4em; margin: 10px 0 0; }
.fav-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }
.fav-list li { background: var(--card); border-radius: 14px; padding: 16px 18px; box-shadow: 0 8px 20px rgba(0,0,0,.15); display: flex; gap: 12px; justify-content: space-between; align-items: flex-start; }
.fav-list button { padding: 4px 10px; font-size: .85rem; background: #f3f4f6; }
.empty, .fav-where { color: #fff; text-align: center; }
.fav-where { margin: 0 0 12px; font-size: .9rem; }
.account { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 8px; color: #fff; font-size: .9rem; }
.who { font-weight: 600; }
.demo-badge { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border: 1px solid rgba(255,255,255,.7); border-radius: 999px; }
.demo-note { margin: 0 0 6px; padding: 8px 12px; background: #fffbeb; color: #92400e; border-radius: 10px; font-size: .82rem; }
button.ghost { background: rgba(255,255,255,.18); color: #fff; padding: 6px 14px; }
dialog { width: min(400px, calc(100% - 32px)); border: 0; border-radius: 20px; padding: 24px; box-shadow: 0 30px 80px rgba(0,0,0,.35); color: var(--text); }
dialog::backdrop { background: rgba(17,24,39,.55); }
dialog h2 { margin: 16px 0 4px; }
.auth-tabs { display: flex; background: #f3f4f6; border-radius: 999px; padding: 4px; }
.auth-tabs button { flex: 1; background: transparent; padding: 8px; }
.auth-tabs button[aria-selected="true"] { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.12); }
dialog label { display: block; font-weight: 600; font-size: .9rem; margin-top: 10px; }
dialog input { width: 100%; font: inherit; padding: 10px 12px; margin-top: 4px; border: 1px solid #d1d5db; border-radius: 10px; }
dialog input[aria-invalid="true"] { border-color: #dc2626; }
.field-error, .form-error { color: #dc2626; font-size: .85rem; margin: 4px 0 0; }
.form-error:not(:empty) { margin-top: 12px; padding: 8px 12px; background: #fef2f2; border-radius: 10px; }
.auth-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }
.auth-actions button:not(.primary) { background: #f3f4f6; }
@keyframes flip { from { transform: rotateX(70deg); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes pop { from { transform: scale(.85); opacity: 0; } to { transform: none; opacity: 1; } }
@keyframes blink { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
```

```js data
// Quotes: well-documented lines from public-domain sources. Jokes: original and clean.
const QUOTES = [
  { text: 'Well begun is half done.', author: 'Aristotle', source: 'Politics', tags: ['motivation'] },
  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu', source: 'Tao Te Ching', tags: ['motivation'] },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca', source: 'Letters to Lucilius', tags: ['wisdom', 'courage'] },
  { text: 'Well done is better than well said.', author: 'Benjamin Franklin', source: "Poor Richard's Almanack, 1737", tags: ['motivation'] },
  { text: 'Our life is frittered away by detail. Simplify, simplify.', author: 'Henry David Thoreau', source: 'Walden, 1854', tags: ['wisdom'] },
  { text: 'Courage is resistance to fear, mastery of fear, not absence of fear.', author: 'Mark Twain', source: "Pudd'nhead Wilson, 1894", tags: ['courage'] },
  { text: 'Always do right. This will gratify some people and astonish the rest.', author: 'Mark Twain', source: 'Note to a young people’s society, 1901', tags: ['character', 'funny'] },
  { text: 'The best way out is always through.', author: 'Robert Frost', source: 'A Servant to Servants, 1914', tags: ['courage'] },
];

const JOKES = [
  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.', tags: ['tech'] },
  { setup: 'Why did the function stop calling the other function?', punchline: 'It kept getting no return.', tags: ['tech'] },
  { setup: 'What do you call a fake noodle?', punchline: 'An impasta.', tags: ['dad'] },
  { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field.', tags: ['dad'] },
  { setup: 'Why can’t you trust an atom?', punchline: 'They make up everything.', tags: ['science'] },
  { setup: 'Why did the photon skip the hotel check-in?', punchline: 'It was traveling light.', tags: ['science'] },
  { setup: 'Why are hospital waiting rooms so quiet?', punchline: 'Everyone is being very patient.', tags: ['medical'] },
  { setup: 'Why did the sailor bring a bar of soap on deck?', punchline: 'He wanted to wash ashore.', tags: ['military'] },
];
```

```js picker
// A random index that is never the same as the last one (when there's a choice).
function nextIndex(length, last, rand = Math.random) {
  if (length <= 1) return 0;
  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items
  if (i >= last && last >= 0) i += 1;          // skip over the previous pick
  return i;
}

const formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;
```

```js ui
const $ = (id) => document.getElementById(id);
let current = null;                 // the item on the card

const pool = () => QUOTES;

function show(item) {
  current = item;
  $('main').textContent = `“${item.text}”`;
  $('sub').textContent = `— ${item.author}, ${item.source}`;
}

function next() {
  const items = pool();
  show(items[nextIndex(items.length, items.indexOf(current))]);
}

$('next').onclick = next;
```

```js go
next();
```

## Step: Jokes, and a punchline that waits
time: 15

A joke is funnier when you get a moment to guess. Jokes have a `setup` and a `punchline`, so the card shows the setup first with a **Reveal the punchline** button.

The tabs switch `mode` between `'quote'` and `'joke'`:

| Tab | `mode` | `body` class | Background |
|---|---|---|---|
| 💬 Quotes | `quote` | `quote` | indigo to pink |
| 😄 Jokes | `joke` | `joke` | amber to red |

The CSS gradient uses two custom properties, `--bg1` and `--bg2`, and `body.joke` changes them, so the whole page changes color with one class.

`show(item)` tells the two kinds apart by checking `item.setup`: a joke has one, a quote doesn't. For a joke it shows the setup and the button; `revealPunchline()` hides the button and shows the punchline in bold with a little pop animation.

The tabs use `role="tab"` and `aria-selected`, so screen readers announce which tab is chosen. CSS styles the selected one with `.tabs button[aria-selected="true"]`: the attribute that helps accessibility also drives the look.

### Try it

Switch to Jokes, read the setup, then reveal the punchline. Notice the background change.

check: js | a setMode() function | /function\s+setMode\s*\(/
check: js | the page knows which tab is on | /document\.body\.className\s*=\s*next/
check: js | jokes and quotes are told apart | /if\s*\(\s*item\.setup\s*\)/
check: js | a revealPunchline() function | /function\s+revealPunchline\s*\(/

quiz: How does show() know whether it was given a quote or a joke?
- [ ] It checks a type field
- [x] Jokes have a setup property and quotes don't
- [ ] It looks at the current tab
why: The shape of the object tells you what it is, so no extra field is needed.
quiz: Why set aria-selected on the tabs instead of only a CSS class?
- [x] Screen readers announce aria-selected, and CSS can style the same attribute, so one attribute serves both
- [ ] CSS classes don't work on buttons
- [ ] It's required for clicks
why: Using the accessibility attribute as the style hook keeps them from ever disagreeing.

```js picker
// A random index that is never the same as the last one (when there's a choice).
function nextIndex(length, last, rand = Math.random) {
  if (length <= 1) return 0;
  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items
  if (i >= last && last >= 0) i += 1;          // skip over the previous pick
  return i;
}

const formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;
const formatJoke = (j) => `${j.setup} ${j.punchline}`;
```

```js ui
const $ = (id) => document.getElementById(id);
let mode = 'quote';                 // 'quote', 'joke' or 'fav'
let current = null;                 // the item on the card

const pool = () => (mode === 'quote' ? QUOTES : JOKES);

function setMode(next) {
  mode = next;
  document.body.className = next;          // each tab has its own background colors
  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));
  const items = next === 'quote' ? QUOTES : JOKES;
  show(items[0]);
}

function show(item) {
  current = item;
  $('sub').className = 'sub';
  $('reveal').hidden = true;
  if (item.setup) {
    $('main').textContent = item.setup;
    $('sub').textContent = '';
    $('reveal').hidden = false;                // the punchline waits for a click
  } else {
    $('main').textContent = `“${item.text}”`;
    $('sub').textContent = `— ${item.author}, ${item.source}`;
  }
}

function next() {
  const items = pool();
  show(items[nextIndex(items.length, items.indexOf(current))]);
}

function revealPunchline() {
  if (!current?.setup) return;
  $('reveal').hidden = true;
  $('sub').className = 'sub punch';
  $('sub').textContent = current.punchline;
}

document.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
$('next').onclick = next;
$('reveal').onclick = revealPunchline;
```

```js go
setMode('quote');
```

## Step: Categories and today's pick
time: 15

**Categories.** Every item has `tags`, like `['courage', 'motivation']`. `allTags(items)` collects them for the menu: `flatMap` makes one list of every tag, a `Set` removes duplicates, and `sort` puts them in order. Add a joke tagged `'space'` and a Space category appears by itself. `filterByTag(items, tag)` keeps the items that have the tag, or all of them for "Everything".

**Today's pick.** Each tab opens on the same item for everyone all day, and a new one tomorrow, with no server and nothing saved:

```svg Today's pick: today's date, hashed into an index
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 428 105" font-family="sans-serif"><rect x="6" y="20" width="97" height="46" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="54" y="39" text-anchor="middle" font-size="11" font-weight="700">today's date</text><text x="54" y="56" text-anchor="middle" font-size="10">"2026-10-28"</text><line x1="103" y1="43" x2="111" y2="43" stroke="#475569" stroke-width="2"/><rect x="111" y="20" width="97" height="46" rx="6" fill="#fef9c3" stroke="#475569"/><text x="159" y="39" text-anchor="middle" font-size="11" font-weight="700">hash it</text><text x="159" y="56" text-anchor="middle" font-size="10">hash × 31 + char</text><line x1="208" y1="43" x2="216" y2="43" stroke="#475569" stroke-width="2"/><rect x="216" y="20" width="97" height="46" rx="6" fill="#ffedd5" stroke="#475569"/><text x="264" y="39" text-anchor="middle" font-size="11" font-weight="700">% length</text><text x="264" y="56" text-anchor="middle" font-size="10">an index</text><line x1="313" y1="43" x2="321" y2="43" stroke="#475569" stroke-width="2"/><rect x="321" y="20" width="97" height="46" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="369" y="39" text-anchor="middle" font-size="11" font-weight="700">today's pick</text><text x="369" y="56" text-anchor="middle" font-size="10">same for everyone</text><text x="214" y="92" text-anchor="middle" font-size="11" fill="#475569">no server and no saved state: every visitor works out the same answer, and tomorrow's date gives a new one</text></svg>
```

`dailyIndex(length, date)` turns the date into text like `"2026-10-28"` and **hashes** it: for each character, multiply the running total by 31 and add the character's code. `>>> 0` keeps the result a positive whole number. Then `hash % length` turns it into an index. The same date always gives the same number, and a different date gives a different one.

| Date | Text | Index (of 8) |
|---|---|---|
| any time today | the same | the same pick |
| tomorrow | one character changes | a different pick |

The card shows a "Today's pick" label when it's showing the daily item; pressing **New one** goes back to random picks from the chosen category.

check: js | the tags for the menu | /new\s+Set\(\s*items\.flatMap/
check: js | filter by category | /const\s+filterByTag\s*=/
check: js | a daily index from the date | /function\s+dailyIndex\s*\(/
check: js | each tab opens on today's pick | /show\(\s*items\[\s*dailyIndex\(\s*items\.length\s*\)\s*\]\s*,\s*true\s*\)/

quiz: Why can every visitor see the same daily pick without a server?
- [ ] The browser downloads it each morning
- [x] Everyone's browser hashes the same date and gets the same index
- [ ] It's saved in localStorage
why: A deterministic calculation on shared input gives a shared answer.
quiz: Why use a Set in allTags()?
- [x] To remove duplicate tags, since many items share the same ones
- [ ] To sort the tags
- [ ] Sets are required by select menus
why: flatMap lists every tag of every item; the Set keeps each one once.

```js picker
// A random index that is never the same as the last one (when there's a choice).
function nextIndex(length, last, rand = Math.random) {
  if (length <= 1) return 0;
  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items
  if (i >= last && last >= 0) i += 1;          // skip over the previous pick
  return i;
}

const formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;
const formatJoke = (j) => `${j.setup} ${j.punchline}`;

// Same item all day for everyone, a new one tomorrow: an index made from today's date.
function dailyIndex(length, date = new Date()) {
  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;   // >>> 0 keeps it a positive 32-bit number
  return hash % length;
}

const filterByTag = (items, tag) => (tag === 'all' ? items : items.filter((i) => i.tags.includes(tag)));
const allTags = (items) => [...new Set(items.flatMap((i) => i.tags))].sort();
```

```js ui
const $ = (id) => document.getElementById(id);
let mode = 'quote';                 // 'quote', 'joke' or 'fav'
let current = null;                 // the item on the card

const pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);

function setMode(next) {
  mode = next;
  document.body.className = next;          // each tab has its own background colors
  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));
  const items = next === 'quote' ? QUOTES : JOKES;
  $('tag').innerHTML = ['all', ...allTags(items)]
    .map((t) => `<option value="${t}">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');
  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick
}

function show(item, isDaily = false) {
  current = item;
  $('daily').hidden = !isDaily;
  $('sub').className = 'sub';
  $('reveal').hidden = true;
  if (item.setup) {
    $('main').textContent = item.setup;
    $('sub').textContent = '';
    $('reveal').hidden = false;                // the punchline waits for a click
  } else {
    $('main').textContent = `“${item.text}”`;
    $('sub').textContent = `— ${item.author}, ${item.source}`;
  }
}

function next() {
  const items = pool();
  show(items[nextIndex(items.length, items.indexOf(current))]);
}

function revealPunchline() {
  if (!current?.setup) return;
  $('reveal').hidden = true;
  $('sub').className = 'sub punch';
  $('sub').textContent = current.punchline;
}

document.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
$('tag').onchange = next;
$('next').onclick = next;
$('reveal').onclick = revealPunchline;
```

## Finish

### What you learned

- Content as an array of objects, and a random pick that never repeats
- A daily pick everyone shares, from a hash of the date
- Categories from tags with `flatMap` and `Set`
- A typewriter and a restartable CSS animation that respect reduced motion
- Copy, share and save, each working (or failing politely) when the browser says no
- Sign-up validation, salted slow password hashing, constant-time comparison
- Random session tokens stored as hashes, expiry, and lockouts after failed logins
- A REST API written as one function, so the same rules run on a server and in the browser

### Challenges

1. **More jokes:** add a category of your own and watch it appear in the menu.
2. **Show password:** add a Show/Hide button next to the password box (hint: switch the input's `type`).
3. **Read it aloud:** a 🔊 button that reads the card with `speechSynthesis.speak()`.
4. **Remember me:** keep the session token in `sessionStorage` (inside `try`/`catch`) so a reload keeps you logged in.
5. **Password strength:** show "weak", "okay" or "strong" while someone types a new password.

Compare yours with the [live version](https://theoyanvno.github.io/quote-and-joke-generator/) and the [source code](https://github.com/TheoYanvno/quote-and-joke-generator).
