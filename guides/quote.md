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

## Session: Delight and sharing

## Step: A typewriter, a card flip and a shortcut
time: 15

Small touches make the app feel alive.

**Typewriter.** `typeText(el, text, done)` shows one more letter every 22 milliseconds with `setInterval`, and a blinking cursor (`.typing::after`) while it types. When it finishes it calls `done()`: that's when a quote's author appears, or a joke's **Reveal** button. `clearInterval(typing)` at the start stops any typing that's still going, so pressing New one quickly never mixes two texts.

**Card flip.** The `.flip` class runs a short CSS animation. Adding a class that's already there does nothing, so `show()` removes it, reads `offsetWidth` (which makes the browser apply the change right away), and adds it again. That restarts the animation every time.

**Reduced motion.** Some people turn off animations in their system settings, because motion can cause dizziness or nausea. `matchMedia('(prefers-reduced-motion: reduce)')` reads that setting: then the text appears at once, and a CSS media query turns off the animations.

**Space bar.** Press Space for a new one, or to reveal a waiting punchline. The listener ignores Space while you're in a menu or a text field, where it means something else, and `preventDefault()` stops the page from scrolling.

| Key press | What happens |
|---|---|
| Space, punchline waiting | reveal it |
| Space, otherwise | a new item |
| Space in a field or menu | nothing extra (it types or opens the menu) |

check: js | a typewriter | /function\s+typeText\s*\(/
check: js | it respects reduced motion | /prefers-reduced-motion/
check: js | the flip animation restarts | /void\s+\$\(\s*['"]card['"]\s*\)\.offsetWidth/
check: js | a Space shortcut | /e\.code\s*===\s*['"]Space['"]/

quiz: Why does typeText() start with clearInterval(typing)?
- [ ] To make typing faster
- [x] So a new text stops the old one, instead of two timers typing into the same card
- [ ] clearInterval is required before setInterval
why: Without it, a quick double press would interleave letters from two items.
quiz: Why ignore the Space key when the focus is in a select or input?
- [x] There Space already does something (types a space, opens the menu), so the shortcut would get in the way
- [ ] Space doesn't work in inputs
- [ ] To save battery
why: Keyboard shortcuts must not take over keys that a focused control needs.

```js ui
const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode = 'quote';                 // 'quote', 'joke' or 'fav'
let current = null;                 // the item on the card
let typing = null;                  // the typewriter's timer

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

// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.
function typeText(el, text, done) {
  clearInterval(typing);
  if (reduced) { el.textContent = text; return done?.(); }
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  typing = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }
  }, 22);
}

function show(item, isDaily = false) {
  current = item;
  $('card').classList.remove('flip');
  void $('card').offsetWidth;                 // reading the size restarts the CSS animation
  $('card').classList.add('flip');
  $('daily').hidden = !isDaily;
  $('sub').className = 'sub';
  $('reveal').hidden = true;
  $('sub').textContent = '';
  if (item.setup) {
    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });
  } else {
    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });
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
// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)
addEventListener('keydown', (e) => {
  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (current?.setup && !$('reveal').hidden) revealPunchline();
    else next();
  }
});
```

## Step: Copy, share and save
time: 20

**Copy** uses `navigator.clipboard.writeText()`. It can be refused (some browsers and sandboxed pages don't allow it), so it's inside `try`/`catch` and a little toast message says which happened.

**Share** is a link to X's "post" page with the text in the URL. `encodeURIComponent()` makes quotes, `&` and other characters safe inside the link.

**Save** keeps favorites as text in `localStorage`. Like copying, storage can be blocked: private browsing, a browser setting, or a sandbox. **This editor's preview blocks it**, so the code keeps a copy in a variable too: favorites work for as long as the page is open, and the page never crashes. On a normal page they're remembered next time.

| Action | Browser feature | If it's not allowed |
|---|---|---|
| Copy | Clipboard API | "Copy not allowed here" |
| Share | a link with an encoded URL | (always works) |
| Save | `localStorage` | kept in memory instead |

The ★ Saved tab lists them with a ✕ to remove each one. The list is built with `innerHTML`, so each text goes through `esc()` first. These texts come from the app's own data, but escaping everything that goes into HTML is a habit worth keeping: it's what stops someone's typed text from becoming code.

The Save button shows **★ Saved** when the item on the card is already a favorite, and pressing it again removes it.

### Try it

Save two quotes and a joke, open ★ Saved, and remove one. Try Copy and Share.

check: js | saving survives blocked storage | /catch\s*\{\s*return\s+memorySaved/
check: js | a share link | /encodeURIComponent\(\s*asText\(\s*item\s*\)\s*\)/
check: js | copy to the clipboard | /navigator\.clipboard\.writeText\(/
check: js | the saved list is escaped | /\$\{\s*esc\(\s*f\.text\s*\)\s*\}/

quiz: Why does the save code keep a copy of favorites in a variable as well as localStorage?
- [ ] localStorage is slow
- [x] Storage can be blocked, and then the variable keeps the feature working instead of failing
- [ ] To share favorites between tabs
why: This preview is one such case: saving still works while the page is open.
quiz: What does encodeURIComponent() do for the share link?
- [ ] Shortens the text
- [x] Turns characters like spaces, quotes and & into codes that are safe inside a URL
- [ ] Encrypts the quote
why: Without it, an & in a quote would end the text parameter early.

```js ui
const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode = 'quote';                 // 'quote', 'joke' or 'fav'
let current = null;                 // the item on the card
let typing = null;                  // the typewriter's timer
let favorites = [];                 // [{ id?, text, kind }]
// Saved while logged out: kept in this browser. Storage can be blocked (this editor's preview blocks it),
// so a copy also lives in memory and the page keeps working.
let memorySaved = [];
const local = {
  get: () => { try { return JSON.parse(localStorage.getItem('qj-favorites')) ?? memorySaved; } catch { return memorySaved; } },
  set: (v) => { memorySaved = v; try { localStorage.setItem('qj-favorites', JSON.stringify(v)); } catch { /* blocked: memory only */ } },
};

const pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);
const asText = (item) => (item.setup ? formatJoke(item) : formatQuote(item));

function setMode(next) {
  mode = next;
  document.body.className = next;          // each tab has its own background colors
  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));
  $('generator').hidden = next === 'fav';
  $('favorites').hidden = next !== 'fav';
  if (next === 'fav') return renderFavorites();
  const items = next === 'quote' ? QUOTES : JOKES;
  $('tag').innerHTML = ['all', ...allTags(items)]
    .map((t) => `<option value="${t}">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');
  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick
}

// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.
function typeText(el, text, done) {
  clearInterval(typing);
  if (reduced) { el.textContent = text; return done?.(); }
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  typing = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }
  }, 22);
}

function show(item, isDaily = false) {
  current = item;
  $('card').classList.remove('flip');
  void $('card').offsetWidth;                 // reading the size restarts the CSS animation
  $('card').classList.add('flip');
  $('daily').hidden = !isDaily;
  $('sub').className = 'sub';
  $('reveal').hidden = true;
  $('sub').textContent = '';
  if (item.setup) {
    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });
  } else {
    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });
  }
  $('save').textContent = favorites.some((f) => f.text === asText(item)) ? '★ Saved' : '☆ Save';
  $('share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(asText(item))}`;
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

function toast(msg) {
  $('toast').textContent = msg;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { $('toast').textContent = ''; }, 1800);
}

function loadFavorites() {
  favorites = local.get().map((text) => ({ text }));
}

function toggleSave() {
  const text = asText(current);
  const saved = local.get().includes(text);
  local.set(saved ? local.get().filter((f) => f !== text) : [text, ...local.get()]);
  loadFavorites();
  $('save').textContent = saved ? '☆ Save' : '★ Saved';
  toast(saved ? 'Removed from saved' : 'Saved!');
}

// Saved text came from our data, but escape it anyway: anything going into innerHTML should be.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function renderFavorites() {
  $('favEmpty').hidden = favorites.length > 0;
  $('favList').innerHTML = favorites.map((f, i) => `<li><span>${esc(f.text)}</span><button data-i="${i}" aria-label="Remove">✕</button></li>`).join('');
  $('favWhere').textContent = 'Saved in this browser.';
}

document.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
$('tag').onchange = next;
$('next').onclick = next;
$('reveal').onclick = revealPunchline;
// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)
addEventListener('keydown', (e) => {
  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (current?.setup && !$('reveal').hidden) revealPunchline();
    else next();
  }
});
$('save').onclick = toggleSave;
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(asText(current)); toast('Copied to clipboard'); } catch { toast('Copy not allowed here'); }
};
$('favList').onclick = (e) => {
  const i = e.target.dataset.i;
  if (i === undefined) return;
  local.set(local.get().filter((f) => f !== favorites[Number(i)].text));
  loadFavorites();
  renderFavorites();
};
```

```js go
loadFavorites();
setMode('quote');
```

## Session: Accounts: the rules

## Step: Signing up and storing passwords safely
time: 20

Accounts let favorites follow you to any device. They also bring the most important rule in web development: **never store a password.** Store something you can check a password against, that can't be turned back into it.

**Checking the input first.** `validateSignup()` returns an object of field messages:

| Field | Rule |
|---|---|
| username | 3-20 letters, numbers or underscores; case doesn't matter (`Demo` = `demo`) |
| password | 8-128 characters, and not the same as the username |

Errors come back per field, so the page can show each message under the right box.

**Hashing.** A hash function turns a password into a fixed-length scramble that can't be reversed. But a plain hash has two problems: the same password always gives the same hash (so a leak shows who shares a password), and fast hashes can be guessed billions of times a second. So:

```svg A salted, slow hash: only the result is stored, never the password
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 160" font-family="sans-serif"><rect x="10" y="20" width="110" height="36" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="65" y="42" text-anchor="middle" font-size="11">password</text><rect x="10" y="70" width="110" height="36" rx="6" fill="#fef9c3" stroke="#475569"/><text x="65" y="92" text-anchor="middle" font-size="11">random salt</text><rect x="160" y="40" width="120" height="50" rx="6" fill="#ffedd5" stroke="#475569"/><text x="220" y="62" text-anchor="middle" font-size="11">PBKDF2-SHA256</text><text x="220" y="78" text-anchor="middle" font-size="10">210,000 rounds</text><line x1="120" y1="38" x2="160" y2="58" stroke="#475569" stroke-width="2"/><line x1="120" y1="88" x2="160" y2="72" stroke="#475569" stroke-width="2"/><line x1="280" y1="65" x2="310" y2="65" stroke="#475569" stroke-width="2"/><rect x="310" y="40" width="110" height="50" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="365" y="62" text-anchor="middle" font-size="10">pbkdf2$210000$</text><text x="365" y="78" text-anchor="middle" font-size="10">salt$hash</text><text x="215" y="126" text-anchor="middle" font-size="11" fill="#475569">only the right column is stored; the password itself never is</text><text x="215" y="144" text-anchor="middle" font-size="11" fill="#475569">a new salt per user means two people with the same password get different hashes</text></svg>
```

- A random **salt** (16 bytes from `crypto.getRandomValues()`) is mixed in for each user, and stored next to the hash.
- **PBKDF2** runs the hash 210,000 times, so each guess is slow for an attacker but still quick enough for one log-in.
- The stored text is `pbkdf2$210000$salt$hash`: everything needed to check a password later, and nothing that reveals it.

To check a password, `verify()` hashes it again with the stored salt and compares. The comparison looks at **every byte** even after finding a difference, so the time it takes doesn't give away how close a guess was.

This guide uses the browser's Web Crypto API (`crypto.subtle`), the same as the live demo. The real Node server uses **scrypt**, which also costs a lot of memory per guess.

`AccountService` holds the rules, and a `store` object holds the data. For this guide the store is in memory; the real app passes a SQLite store or an IndexedDB store with the same methods.

### Try it

Open the console: the `go` block checks a too-short username and password, then signs up a made-up demo user.

check: js | sign-up rules | /function\s+validateSignup\s*\(/
check: js | a random salt per password | /crypto\.getRandomValues\(\s*new\s+Uint8Array\(\s*16\s*\)\s*\)/
check: js | a slow, salted hash | /name:\s*['"]PBKDF2['"]/
check: js | the sign-up rule in the service | /async\s+signup\s*\(/

quiz: Why does every user get their own random salt?
- [ ] To make passwords longer
- [x] So two people with the same password get different hashes, and one precomputed table can't crack everyone
- [ ] Salts make hashing faster
why: With a salt, an attacker has to attack each account separately.
quiz: Why run the hash 210,000 times?
- [x] Each extra round makes every guess slower, which barely matters for one log-in but adds up for billions of guesses
- [ ] To make the hash longer
- [ ] Because one round might give the wrong answer
why: Slowness is the point: it's a cost paid once by you and billions of times by an attacker.

```js accounts
// Account rules, written so they don't care where data is stored (the real app runs them on a Node server
// with SQLite, and in the browser for the live demo).
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_DAYS = 30;

class AccountError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries
    Object.assign(this, extra);
  }
}

// Usernames ignore case: "Anthony" and "anthony" are the same account.
const normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();

function validateSignup({ username, password }) {
  const errors = {};
  const name = normalizeUsername(username);
  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';
  const pw = String(password ?? '');
  if (pw.length < 8) errors.password = 'Use at least 8 characters.';
  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';
  else if (pw.toLowerCase() === name) errors.password = "Your password can't be your username.";
  return errors;
}

// ---- passwords, with the browser's Web Crypto API ----
const ITERATIONS = 210_000;
const bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}

const passwords = {
  // a new random salt for every password, so two people with the same password get different hashes
  async hash(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;
  },
  async verify(password, stored) {
    const [scheme, iterations, salt, hash] = String(stored).split('$');
    if (scheme !== 'pbkdf2' || !hash) return false;
    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));
    const expected = b64ToBytes(hash);
    // compare every byte, so the time taken doesn't depend on where they differ
    let diff = actual.length ^ expected.length;
    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
  },
};

// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.
function memoryStore() {
  const state = { nextId: 1, users: [] };
  return {
    async createUser({ username, passwordHash, createdAt }) {
      const id = state.nextId++;
      state.users.push({ id, username, passwordHash, createdAt });
      return id;
    },
    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },
  };
}

class AccountService {
  constructor({ store, passwords, now = () => Date.now() }) {
    this.store = store;
    this.passwords = passwords;
    this.now = now;
  }

  async signup({ username, password }) {
    const errors = validateSignup({ username, password });
    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });
    const name = normalizeUsername(username);
    if (await this.store.userByName(name)) {
      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });
    }
    const passwordHash = await this.passwords.hash(password);
    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });
    return { user: { id, username: name } };
  }
}
```

```js go
loadFavorites();
setMode('quote');

// Try the rules in the console (made-up demo values only)
console.log(validateSignup({ username: 'ab', password: 'short' }));
const demo = new AccountService({ store: memoryStore(), passwords });
demo.signup({ username: 'Demo_User', password: 'not-a-real-pass' })
  .then((r) => console.log('signed up as', r.user.username));
```

## Step: Logging in, sessions and lockouts
time: 20

After signing up or logging in, the user gets a **session token**: 256 random bits, written in a URL-safe form. Every later request carries the token, and `userForToken()` finds whose it is.

| Piece | How |
|---|---|
| token | `crypto.getRandomValues()`: 32 random bytes, impossible to guess |
| stored | only a **SHA-256 hash** of the token, so a stolen copy of the data can't be used to log in |
| lifetime | 30 days; an expired session is deleted when it's next used |
| log out | delete the session; the token stops working at once |

**Brute force.** Someone could try thousands of passwords. The service counts failed logins per username: after **5** wrong passwords in **15 minutes**, logins for that name are refused with status **429** ("Too many failed attempts. Try again in 12 minutes.") until the window passes. A correct password clears the count.

**Not revealing who has an account.** "Wrong username or password" is the same message whether the username exists or not. And when it doesn't exist, the service still hashes the password before answering, so the response takes the same time either way. Otherwise an attacker could time the replies to find real usernames.

`#startSession`, `#checkLockout` and `#recordFailure` start with `#`, which makes them **private**: only code inside the class can call them.

### Try it

The console signs up a demo user, shows whose token it is, then tries 6 wrong passwords: four "Wrong username or password", then "Too many failed attempts", then 429.

check: js | session tokens | /const\s+tokens\s*=/
check: js | only a hash of the token is stored | /tokenHash:\s*await\s+this\.tokens\.hash\(\s*token\s*\)/
check: js | a log-in rule | /async\s+login\s*\(/
check: js | too many tries locks the name | /new\s+AccountError\(\s*429/

quiz: Why store only a hash of each session token?
- [ ] Hashes are shorter
- [x] If the stored data leaks, the hashes can't be used to log in, because the real tokens aren't there
- [ ] Tokens can't be stored as text
why: Same idea as passwords: keep only what lets you check a token, not the token itself.
quiz: Why does login() hash the password even when the username doesn't exist?
- [ ] To create the account
- [x] So the reply takes the same time either way, and timing can't reveal which usernames exist
- [ ] It's a mistake
why: A fast "no such user" answer would leak that the username is free.

```js accounts
// Account rules, written so they don't care where data is stored (the real app runs them on a Node server
// with SQLite, and in the browser for the live demo).
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_DAYS = 30;

class AccountError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries
    Object.assign(this, extra);
  }
}

// Usernames ignore case: "Anthony" and "anthony" are the same account.
const normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();

function validateSignup({ username, password }) {
  const errors = {};
  const name = normalizeUsername(username);
  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';
  const pw = String(password ?? '');
  if (pw.length < 8) errors.password = 'Use at least 8 characters.';
  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';
  else if (pw.toLowerCase() === name) errors.password = "Your password can't be your username.";
  return errors;
}

// ---- passwords, with the browser's Web Crypto API ----
const ITERATIONS = 210_000;
const bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}

const passwords = {
  // a new random salt for every password, so two people with the same password get different hashes
  async hash(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;
  },
  async verify(password, stored) {
    const [scheme, iterations, salt, hash] = String(stored).split('$');
    if (scheme !== 'pbkdf2' || !hash) return false;
    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));
    const expected = b64ToBytes(hash);
    // compare every byte, so the time taken doesn't depend on where they differ
    let diff = actual.length ^ expected.length;
    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
  },
};

// ---- session tokens: 256 random bits; only a SHA-256 hash of each one is stored ----
const tokens = {
  create() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  async hash(token) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(token))));
    return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
  },
};

// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.
function memoryStore() {
  const state = { nextId: 1, users: [], sessions: [], favorites: [], attempts: {} };
  return {
    async createUser({ username, passwordHash, createdAt }) {
      const id = state.nextId++;
      state.users.push({ id, username, passwordHash, createdAt });
      return id;
    },
    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },
    async userById(id) { return state.users.find((u) => u.id === id) ?? null; },
    async createSession(session) { state.sessions.push({ ...session }); },
    async session(tokenHash) { return state.sessions.find((s) => s.tokenHash === tokenHash) ?? null; },
    async deleteSession(tokenHash) { state.sessions = state.sessions.filter((s) => s.tokenHash !== tokenHash); },
    async attempts(key) { return state.attempts[key] ?? null; },
    async saveAttempts(key, value) { state.attempts[key] = { ...value }; },
    async clearAttempts(key) { delete state.attempts[key]; },
  };
}

class AccountService {
  constructor({ store, passwords, tokens, now = () => Date.now() }) {
    this.store = store;
    this.passwords = passwords;
    this.tokens = tokens;
    this.now = now;
  }

  async signup({ username, password }) {
    const errors = validateSignup({ username, password });
    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });
    const name = normalizeUsername(username);
    if (await this.store.userByName(name)) {
      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });
    }
    const passwordHash = await this.passwords.hash(password);
    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });
    return this.#startSession(id, name);
  }

  async login({ username, password }) {
    const name = normalizeUsername(username);
    const key = `login:${name}`;
    await this.#checkLockout(key);
    const user = name ? await this.store.userByName(name) : null;
    // hash even when the user doesn't exist, so the time taken doesn't reveal which usernames exist
    const ok = user
      ? await this.passwords.verify(String(password ?? ''), user.passwordHash)
      : (await this.passwords.hash(String(password ?? '')), false);
    if (!ok) {
      const left = await this.#recordFailure(key);
      throw new AccountError(401, left > 0 ? 'Wrong username or password.' : `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);
    }
    await this.store.clearAttempts(key);
    return this.#startSession(user.id, user.username);
  }

  async logout(token) {
    if (token) await this.store.deleteSession(await this.tokens.hash(token));
  }

  // the signed-in user for a session token, or null; expired sessions are removed
  async userForToken(token) {
    if (!token) return null;
    const tokenHash = await this.tokens.hash(token);
    const session = await this.store.session(tokenHash);
    if (!session) return null;
    if (session.expiresAt <= this.now()) {
      await this.store.deleteSession(tokenHash);
      return null;
    }
    const user = await this.store.userById(session.userId);
    return user ? { id: user.id, username: user.username } : null;
  }

  // ---- helpers (# makes them private to the class) ----
  async #startSession(userId, username) {
    const token = this.tokens.create();
    const expiresAt = this.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    await this.store.createSession({ tokenHash: await this.tokens.hash(token), userId, expiresAt });
    return { token, expiresAt, user: { id: userId, username } };
  }

  async #checkLockout(key) {
    const a = await this.store.attempts(key);
    if (!a) return;
    const windowMs = LOCKOUT_MINUTES * 60 * 1000;
    if (this.now() - a.firstAt > windowMs) return this.store.clearAttempts(key);
    if (a.count >= MAX_FAILED_LOGINS) {
      const minutes = Math.ceil((a.firstAt + windowMs - this.now()) / 60000);
      throw new AccountError(429, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);
    }
  }

  async #recordFailure(key) {
    const a = await this.store.attempts(key);
    const fresh = !a || this.now() - a.firstAt > LOCKOUT_MINUTES * 60 * 1000;
    const next = fresh ? { count: 1, firstAt: this.now() } : { ...a, count: a.count + 1 };
    await this.store.saveAttempts(key, next);
    return MAX_FAILED_LOGINS - next.count;
  }
}
```

```js go
loadFavorites();
setMode('quote');

// Try the rules in the console (made-up demo values only)
const demo = new AccountService({ store: memoryStore(), passwords, tokens });
(async () => {
  const s = await demo.signup({ username: 'demo_user', password: 'not-a-real-pass' });
  console.log('session token', s.token.slice(0, 8) + '…', 'belongs to', (await demo.userForToken(s.token)).username);
  for (let i = 0; i < 6; i++) await demo.login({ username: 'demo_user', password: 'wrong guess' }).catch((e) => console.log(e.status, e.message));
})();
```

## Session: An API in one function

## Step: A REST API as one function
time: 20

A real app talks to its server through an **API**: requests like `POST /api/login` with a JSON body, answered with a **status code** and JSON. This project's trick is to write the whole API as **one plain function**:

```svg One function, two homes: the Node server and the browser demo run the same API code
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 150" font-family="sans-serif"><rect x="10" y="20" width="120" height="44" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="70" y="38" text-anchor="middle" font-size="10">{ method, path,</text><text x="70" y="52" text-anchor="middle" font-size="10">body, token }</text><rect x="160" y="20" width="110" height="44" rx="6" fill="#fef9c3" stroke="#475569"/><text x="215" y="46" text-anchor="middle" font-size="11">handleApi()</text><rect x="300" y="20" width="120" height="44" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="360" y="38" text-anchor="middle" font-size="10">{ status, body,</text><text x="360" y="52" text-anchor="middle" font-size="10">session }</text><line x1="130" y1="42" x2="160" y2="42" stroke="#475569" stroke-width="2"/><line x1="270" y1="42" x2="300" y2="42" stroke="#475569" stroke-width="2"/><text x="110" y="96" text-anchor="middle" font-size="11">Node server: real HTTP,</text><text x="110" y="112" text-anchor="middle" font-size="11">HttpOnly cookie, SQLite</text><text x="320" y="96" text-anchor="middle" font-size="11">this guide and the live demo:</text><text x="320" y="112" text-anchor="middle" font-size="11">called directly in the browser</text><text x="215" y="140" text-anchor="middle" font-size="11" fill="#475569">the same rules and messages in both, because the API is just a function</text></svg>
```

`handleApi(service, request)` takes `{ method, path, body, token }` and returns `{ status, body, session }`. It never touches the network itself. The Node server turns real HTTP requests into that shape and sends the answer back; the live demo (and this guide) just calls the function directly. Either way, the validation, status codes and messages are identical.

| Method | Path | Answer |
|---|---|---|
| POST | `/api/signup` | `201` and a new session |
| POST | `/api/login` | `200` and a session, or `401` / `429` |
| POST | `/api/logout` | `200`, and the session is cleared |
| GET | `/api/me` | `{ user }`, or `{ user: null }` |
| GET | `/api/favorites` | your favorites, or `401` if you're not logged in |
| POST | `/api/favorites` | `201` and the saved favorite |
| POST | `/api/favorites/import` | how many were added |
| DELETE | `/api/favorites/:id` | `204`; you can only delete your own |

An `AccountError` becomes a status and an `{ error, fields }` body; anything unexpected becomes a `500` with a polite message, and the details go to the console, never to the user.

On the page side, `call(method, path, body)` sends a request, keeps the session token, and throws an `ApiError` for any status of 400 or more, so page code can use `try`/`catch`.

Favorites are added to the service and store too: saving the same text twice keeps one copy, and deleting checks the favorite belongs to you.

### Try it

The console asks for favorites without logging in (401) and sends a bad sign-up (400, with a message for each field).

check: js | the API is one function | /async\s+function\s+handleApi\s*\(/
check: js | routes by method and path | /const\s+route\s*=\s*`\$\{method\}\s+\$\{path\}`/
check: js | favorites need a log-in | /error\(\s*401/
check: js | the page's call() | /async\s+function\s+call\s*\(/

quiz: Why write the API as a function instead of directly in the server code?
- [ ] Functions run faster than servers
- [x] The same function can run behind a real server or right in the browser, so both behave exactly alike
- [ ] Servers can't call functions
why: Keeping HTTP at the edges means the rules are written, and tested, once.
quiz: A request asks to DELETE favorite 7, which belongs to someone else. What happens?
- [ ] It's deleted
- [x] The store only removes favorites with your user id, so nothing is removed and the API answers 404
- [ ] The other user is logged out
why: Every favorite query includes the signed-in user's id, so one user can never touch another's data.

```js accounts
// Account rules, written so they don't care where data is stored (the real app runs them on a Node server
// with SQLite, and in the browser for the live demo).
const MAX_FAILED_LOGINS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_DAYS = 30;

class AccountError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries
    Object.assign(this, extra);
  }
}

// Usernames ignore case: "Anthony" and "anthony" are the same account.
const normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();

function validateSignup({ username, password }) {
  const errors = {};
  const name = normalizeUsername(username);
  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';
  const pw = String(password ?? '');
  if (pw.length < 8) errors.password = 'Use at least 8 characters.';
  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';
  else if (pw.toLowerCase() === name) errors.password = "Your password can't be your username.";
  return errors;
}

// ---- passwords, with the browser's Web Crypto API ----
const ITERATIONS = 210_000;
const bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));
const b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));
}

const passwords = {
  // a new random salt for every password, so two people with the same password get different hashes
  async hash(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;
  },
  async verify(password, stored) {
    const [scheme, iterations, salt, hash] = String(stored).split('$');
    if (scheme !== 'pbkdf2' || !hash) return false;
    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));
    const expected = b64ToBytes(hash);
    // compare every byte, so the time taken doesn't depend on where they differ
    let diff = actual.length ^ expected.length;
    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
  },
};

// ---- session tokens: 256 random bits; only a SHA-256 hash of each one is stored ----
const tokens = {
  create() {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    return bytesToB64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  },
  async hash(token) {
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(token))));
    return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');
  },
};

// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.
function memoryStore() {
  const state = { nextId: 1, users: [], sessions: [], favorites: [], attempts: {} };
  return {
    async createUser({ username, passwordHash, createdAt }) {
      const id = state.nextId++;
      state.users.push({ id, username, passwordHash, createdAt });
      return id;
    },
    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },
    async userById(id) { return state.users.find((u) => u.id === id) ?? null; },
    async createSession(session) { state.sessions.push({ ...session }); },
    async session(tokenHash) { return state.sessions.find((s) => s.tokenHash === tokenHash) ?? null; },
    async deleteSession(tokenHash) { state.sessions = state.sessions.filter((s) => s.tokenHash !== tokenHash); },
    async attempts(key) { return state.attempts[key] ?? null; },
    async saveAttempts(key, value) { state.attempts[key] = { ...value }; },
    async clearAttempts(key) { delete state.attempts[key]; },
    async favorites(userId) {
      return state.favorites.filter((f) => f.userId === userId).sort((a, b) => b.id - a.id).map(({ id, kind, text }) => ({ id, kind, text }));
    },
    async addFavorite(userId, { text, kind }) {
      let fav = state.favorites.find((f) => f.userId === userId && f.text === text);   // the same text twice keeps one copy
      if (!fav) state.favorites.push((fav = { id: state.nextId++, userId, kind, text }));
      return { id: fav.id, kind: fav.kind, text: fav.text };
    },
    async removeFavorite(userId, id) {
      const before = state.favorites.length;
      state.favorites = state.favorites.filter((f) => !(f.id === id && f.userId === userId));   // only your own
      return state.favorites.length < before;
    },
  };
}

class AccountService {
  constructor({ store, passwords, tokens, now = () => Date.now() }) {
    this.store = store;
    this.passwords = passwords;
    this.tokens = tokens;
    this.now = now;
  }

  async signup({ username, password }) {
    const errors = validateSignup({ username, password });
    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });
    const name = normalizeUsername(username);
    if (await this.store.userByName(name)) {
      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });
    }
    const passwordHash = await this.passwords.hash(password);
    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });
    return this.#startSession(id, name);
  }

  async login({ username, password }) {
    const name = normalizeUsername(username);
    const key = `login:${name}`;
    await this.#checkLockout(key);
    const user = name ? await this.store.userByName(name) : null;
    // hash even when the user doesn't exist, so the time taken doesn't reveal which usernames exist
    const ok = user
      ? await this.passwords.verify(String(password ?? ''), user.passwordHash)
      : (await this.passwords.hash(String(password ?? '')), false);
    if (!ok) {
      const left = await this.#recordFailure(key);
      throw new AccountError(401, left > 0 ? 'Wrong username or password.' : `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);
    }
    await this.store.clearAttempts(key);
    return this.#startSession(user.id, user.username);
  }

  async logout(token) {
    if (token) await this.store.deleteSession(await this.tokens.hash(token));
  }

  // the signed-in user for a session token, or null; expired sessions are removed
  async userForToken(token) {
    if (!token) return null;
    const tokenHash = await this.tokens.hash(token);
    const session = await this.store.session(tokenHash);
    if (!session) return null;
    if (session.expiresAt <= this.now()) {
      await this.store.deleteSession(tokenHash);
      return null;
    }
    const user = await this.store.userById(session.userId);
    return user ? { id: user.id, username: user.username } : null;
  }

  // ---- favorites ----
  async favorites(userId) { return this.store.favorites(userId); }

  async addFavorite(userId, { text, kind }) {
    const t = String(text ?? '').trim();
    if (!t || t.length > 1000 || !['quote', 'joke'].includes(kind)) throw new AccountError(400, 'That favorite is not valid.');
    return this.store.addFavorite(userId, { text: t, kind });
  }

  async removeFavorite(userId, id) {
    if (!(await this.store.removeFavorite(userId, Number(id)))) throw new AccountError(404, 'That favorite was not found.');
  }

  // favorites saved while logged out move into the account; ones it already has are skipped
  async importFavorites(userId, items) {
    let added = 0;
    for (const item of Array.isArray(items) ? items : []) {
      const before = (await this.store.favorites(userId)).length;
      await this.addFavorite(userId, item).catch(() => {});
      if ((await this.store.favorites(userId)).length > before) added++;
    }
    return added;
  }

  // ---- helpers (# makes them private to the class) ----
  async #startSession(userId, username) {
    const token = this.tokens.create();
    const expiresAt = this.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    await this.store.createSession({ tokenHash: await this.tokens.hash(token), userId, expiresAt });
    return { token, expiresAt, user: { id: userId, username } };
  }

  async #checkLockout(key) {
    const a = await this.store.attempts(key);
    if (!a) return;
    const windowMs = LOCKOUT_MINUTES * 60 * 1000;
    if (this.now() - a.firstAt > windowMs) return this.store.clearAttempts(key);
    if (a.count >= MAX_FAILED_LOGINS) {
      const minutes = Math.ceil((a.firstAt + windowMs - this.now()) / 60000);
      throw new AccountError(429, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);
    }
  }

  async #recordFailure(key) {
    const a = await this.store.attempts(key);
    const fresh = !a || this.now() - a.firstAt > LOCKOUT_MINUTES * 60 * 1000;
    const next = fresh ? { count: 1, firstAt: this.now() } : { ...a, count: a.count + 1 };
    await this.store.saveAttempts(key, next);
    return MAX_FAILED_LOGINS - next.count;
  }
}
```

```js api
// The account API as one plain function: a request goes in, a response comes out.
// request:  { method, path, body, token }     response: { status, body, session? }
async function handleApi(service, { method, path, body = {}, token = null }) {
  try {
    const route = `${method} ${path}`;
    if (route === 'POST /api/signup') {
      const s = await service.signup(body);
      return { status: 201, body: { user: s.user }, session: { token: s.token } };
    }
    if (route === 'POST /api/login') {
      const s = await service.login(body);
      return { status: 200, body: { user: s.user }, session: { token: s.token } };
    }
    if (route === 'POST /api/logout') {
      await service.logout(token);
      return { status: 200, body: { ok: true }, session: { clear: true } };
    }
    const user = await service.userForToken(token);
    if (route === 'GET /api/me') return { status: 200, body: { user } };

    if (path.startsWith('/api/favorites')) {
      if (!user) return error(401, 'Please log in to see your saved favorites.');
      if (route === 'GET /api/favorites') return { status: 200, body: { favorites: await service.favorites(user.id) } };
      if (route === 'POST /api/favorites') return { status: 201, body: { favorite: await service.addFavorite(user.id, body) } };
      if (route === 'POST /api/favorites/import') return { status: 200, body: { added: await service.importFavorites(user.id, body.items) } };
      const match = /^DELETE \/api\/favorites\/(\d+)$/.exec(route);
      if (match) {
        await service.removeFavorite(user.id, Number(match[1]));
        return { status: 204, body: null };
      }
    }
    return error(404, 'Not found.');
  } catch (err) {
    if (err instanceof AccountError) return error(err.status, err.message, err.fields ? { fields: err.fields } : {});
    console.error(err);
    return error(500, 'Something went wrong on our end. Please try again.');
  }
}
const error = (status, message, extra = {}) => ({ status, body: { error: message, ...extra } });

class ApiError extends Error {
  constructor(status, body) {
    super(body?.error ?? `Request failed (${status})`);
    this.status = status;
    this.fields = body?.fields ?? {};
  }
}

// The page talks to the API through call(). Here it runs in the page itself, keeping the session token in a
// variable; a real server keeps it in an HttpOnly cookie that page scripts can't read at all.
const service = new AccountService({ store: memoryStore(), passwords, tokens });
let sessionToken = null;
async function call(method, path, body) {
  const res = await handleApi(service, { method, path, body, token: sessionToken });
  if (res.session) sessionToken = res.session.clear ? null : res.session.token;
  if (res.status >= 400) throw new ApiError(res.status, res.body);
  return res.body;
}
```

```js go
loadFavorites();
setMode('quote');

// Try the API in the console (made-up demo values only)
(async () => {
  console.log(await handleApi(service, { method: 'GET', path: '/api/favorites' }));          // 401: not logged in
  const r = await handleApi(service, { method: 'POST', path: '/api/signup', body: { username: 'x', password: 'short' } });
  console.log(r.status, r.body.fields);                                                        // 400 with field messages
})();
```

## Step: Log in, and favorites that follow you
time: 20

Now the page gets its account features: a **Log in** button, a dialog with *Log in* and *Create account* tabs, and favorites saved to the account.

**The dialog** is a `<dialog>` element: `showModal()` opens it on top of the page, dims everything behind it and keeps keyboard focus inside. `setAuthMode()` switches the title, the button text and the password field's `autocomplete` (`new-password` for sign-up, so password managers offer to make one; `current-password` for log-in, so they fill it in).

**Errors where they belong.** When the API answers 400 with `fields`, each message goes right under its box, and the box gets `aria-invalid="true"` so screen readers announce it. Other errors (wrong password, lockout) show at the bottom of the form.

**Favorites in the account.** When you're logged in, Save and remove go through `call()` to the API. When you log in, anything you'd saved before is sent to `/api/favorites/import`, so nothing is lost, and the toast says how many moved. Log out and you're back to favorites in this browser.

| | Logged out | Logged in |
|---|---|---|
| Save | this browser | `POST /api/favorites` |
| ★ Saved tab | this browser's list | `GET /api/favorites` |
| Remove | this browser | `DELETE /api/favorites/:id` |

Accounts in this guide live in memory, so they last until the preview reloads; the note in the dialog says so. Use made-up names and passwords.

### Try it

Save a quote while logged out. Create an account (try a 2-letter username first to see the field message): your saved quote moves into it. Log out, log back in with the wrong password a few times, then the right one.

check: js | the log-in dialog opens | /\$\(\s*['"]authDialog['"]\s*\)\.showModal\(\)/
check: js | field messages go under each box | /setAttribute\(\s*['"]aria-invalid['"]\s*,\s*['"]true['"]\s*\)/
check: js | saved favorites move into the account | /['"]\/api\/favorites\/import['"]/
check: js | log out | /\$\(\s*['"]logoutBtn['"]\s*\)\.onclick/

quiz: Why set autocomplete="new-password" on the sign-up form?
- [ ] It makes the password longer
- [x] Password managers then offer to create a strong password instead of filling in an old one
- [ ] It hides the password
why: The right autocomplete value lets the browser help with the right job.
quiz: What happens to favorites saved before logging in?
- [ ] They're deleted
- [x] They're sent to /api/favorites/import and added to the account, skipping duplicates
- [ ] They stay only in this browser
why: Moving them in means logging in never loses anything.

```js ui
const $ = (id) => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let mode = 'quote';                 // 'quote', 'joke' or 'fav'
let current = null;                 // the item on the card
let typing = null;                  // the typewriter's timer
let favorites = [];                 // [{ id?, text, kind }]
let user = null;                    // { id, username } when logged in
// Saved while logged out: kept in this browser. Storage can be blocked (this editor's preview blocks it),
// so a copy also lives in memory and the page keeps working.
let memorySaved = [];
const local = {
  get: () => { try { return JSON.parse(localStorage.getItem('qj-favorites')) ?? memorySaved; } catch { return memorySaved; } },
  set: (v) => { memorySaved = v; try { localStorage.setItem('qj-favorites', JSON.stringify(v)); } catch { /* blocked: memory only */ } },
};

const pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);
const asText = (item) => (item.setup ? formatJoke(item) : formatQuote(item));

function setMode(next) {
  mode = next;
  document.body.className = next;          // each tab has its own background colors
  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));
  $('generator').hidden = next === 'fav';
  $('favorites').hidden = next !== 'fav';
  if (next === 'fav') return renderFavorites();
  const items = next === 'quote' ? QUOTES : JOKES;
  $('tag').innerHTML = ['all', ...allTags(items)]
    .map((t) => `<option value="${t}">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');
  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick
}

// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.
function typeText(el, text, done) {
  clearInterval(typing);
  if (reduced) { el.textContent = text; return done?.(); }
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  typing = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }
  }, 22);
}

function show(item, isDaily = false) {
  current = item;
  $('card').classList.remove('flip');
  void $('card').offsetWidth;                 // reading the size restarts the CSS animation
  $('card').classList.add('flip');
  $('daily').hidden = !isDaily;
  $('sub').className = 'sub';
  $('reveal').hidden = true;
  $('sub').textContent = '';
  if (item.setup) {
    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });
  } else {
    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });
  }
  $('save').textContent = favorites.some((f) => f.text === asText(item)) ? '★ Saved' : '☆ Save';
  $('share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(asText(item))}`;
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

function toast(msg) {
  $('toast').textContent = msg;
  clearTimeout(toast.t);
  toast.t = setTimeout(() => { $('toast').textContent = ''; }, 1800);
}

const JOKE_TEXTS = new Set(JOKES.map(formatJoke));
const kindOf = (text) => (JOKE_TEXTS.has(text) ? 'joke' : 'quote');

// Logged in: the account's favorites. Logged out: this browser's.
async function loadFavorites() {
  if (user) {
    try { favorites = (await call('GET', '/api/favorites')).favorites; } catch (err) { toast(err.message); }
  } else {
    favorites = local.get().map((text) => ({ text, kind: kindOf(text) }));
  }
}

async function toggleSave() {
  const text = asText(current);
  const existing = favorites.find((f) => f.text === text);
  try {
    if (user) {
      if (existing) await call('DELETE', `/api/favorites/${existing.id}`);
      else await call('POST', '/api/favorites', { text, kind: current.setup ? 'joke' : 'quote' });
    } else {
      local.set(existing ? local.get().filter((f) => f !== text) : [text, ...local.get()]);
    }
    await loadFavorites();
  } catch (err) {
    return toast(err.message);
  }
  $('save').textContent = existing ? '☆ Save' : '★ Saved';
  toast(existing ? 'Removed from saved' : user ? 'Saved to your account!' : 'Saved!');
}

// Saved text came from our data, but escape it anyway: anything going into innerHTML should be.
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function renderFavorites() {
  $('favEmpty').hidden = favorites.length > 0;
  $('favList').innerHTML = favorites.map((f, i) => `<li><span>${esc(f.text)}</span><button data-i="${i}" aria-label="Remove">✕</button></li>`).join('');
  $('favWhere').textContent = user ? `Saved to ${user.username}'s account.` : 'Saved in this browser. Log in to keep them in an account.';
}

document.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });
$('tag').onchange = next;
$('next').onclick = next;
$('reveal').onclick = revealPunchline;
// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)
addEventListener('keydown', (e) => {
  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;
  if (e.code === 'Space') {
    e.preventDefault();
    if (current?.setup && !$('reveal').hidden) revealPunchline();
    else next();
  }
});
$('save').onclick = toggleSave;
$('copy').onclick = async () => {
  try { await navigator.clipboard.writeText(asText(current)); toast('Copied to clipboard'); } catch { toast('Copy not allowed here'); }
};
$('favList').onclick = async (e) => {
  const i = e.target.dataset.i;
  if (i === undefined) return;
  const fav = favorites[Number(i)];
  try {
    if (user) await call('DELETE', `/api/favorites/${fav.id}`);
    else local.set(local.get().filter((f) => f !== fav.text));
  } catch (err) { toast(err.message); }
  await loadFavorites();
  renderFavorites();
};

// ---- accounts: the log-in dialog ----
let authMode = 'login';

function setAuthMode(next) {
  authMode = next;
  document.querySelectorAll('[data-auth]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.auth === next)));
  $('authTitle').textContent = next === 'signup' ? 'Create your account' : 'Welcome back';
  $('authSubmit').textContent = next === 'signup' ? 'Create account' : 'Log in';
  $('password').autocomplete = next === 'signup' ? 'new-password' : 'current-password';
  clearAuthErrors();
}

function clearAuthErrors() {
  for (const f of ['username', 'password']) { $(`${f}Error`).textContent = ''; $(f).removeAttribute('aria-invalid'); }
  $('authError').textContent = '';
}

document.querySelectorAll('[data-auth]').forEach((b) => { b.onclick = () => setAuthMode(b.dataset.auth); });
$('loginBtn').onclick = () => { setAuthMode('login'); $('authForm').reset(); $('authDialog').showModal(); $('username').focus(); };
$('authCancel').onclick = () => $('authDialog').close();

$('authForm').onsubmit = async (e) => {
  e.preventDefault();
  clearAuthErrors();
  const body = { username: $('username').value.trim(), password: $('password').value };
  $('authSubmit').disabled = true;
  try {
    user = (await call('POST', authMode === 'signup' ? '/api/signup' : '/api/login', body)).user;
    // move anything saved before logging in into the account, so nothing is lost
    const pending = local.get().map((text) => ({ text, kind: kindOf(text) }));
    const moved = pending.length ? (await call('POST', '/api/favorites/import', { items: pending })).added : 0;
    local.set([]);
    $('authDialog').close();
    await afterAuthChange();
    toast(`${authMode === 'signup' ? 'Account created' : 'Logged in'} as ${user.username}.${moved ? ` ${moved} saved item${moved === 1 ? '' : 's'} moved to your account.` : ''}`);
  } catch (err) {
    if (!(err instanceof ApiError)) { $('authError').textContent = 'Something went wrong.'; return; }
    // the API names which field is wrong, so the message goes right under it
    for (const [field, message] of Object.entries(err.fields)) {
      $(`${field}Error`).textContent = message;
      $(field).setAttribute('aria-invalid', 'true');
    }
    if (!Object.keys(err.fields).length) $('authError').textContent = err.message;
  } finally {
    $('authSubmit').disabled = false;
  }
};

$('logoutBtn').onclick = async () => {
  try { await call('POST', '/api/logout', {}); } catch { /* the session is gone either way */ }
  user = null;
  await afterAuthChange();
  toast('Logged out.');
};

async function afterAuthChange() {
  $('who').hidden = !user;
  $('who').textContent = user ? `👤 ${user.username}` : '';
  $('loginBtn').hidden = !!user;
  $('logoutBtn').hidden = !user;
  await loadFavorites();
  if (mode === 'fav') renderFavorites();
  else if (current) $('save').textContent = favorites.some((f) => f.text === asText(current)) ? '★ Saved' : '☆ Save';
}
```

```js go
$('account').hidden = false;
afterAuthChange();
setMode('quote');
```

## Session: How the real project is built

## Step: The Node server, SQLite and the tests
time: 10
kind: read

You've now built the same app as my [Quote & Joke Generator](https://theoyanvno.github.io/quote-and-joke-generator/). The real project runs the same rules in two places:

| File | What it does |
|---|---|
| `src/data.js`, `src/picker.js` | the quotes and jokes, and the pure picking functions |
| `src/accounts/service.js` | the account rules you wrote |
| `src/accounts/routes.js` | `handleApi()`, shared by the server and the demo |
| `server/server.js` | a `node:http` server: real requests, cookies, security headers |
| `server/sqlite-store.js`, `sql/schema.sql` | SQLite storage with `node:sqlite` |
| `server/crypto.js` | scrypt password hashing and tokens |
| `src/accounts/browser-store.js` | IndexedDB storage and PBKDF2 for the live demo |

**scrypt on the server.** Node has scrypt built in. It's slow like PBKDF2 and also needs about 16 MB of memory per guess, which makes guessing on graphics cards far more expensive:

```js
export const passwords = {
  /** A new random salt for every password, so two people with the same password get different hashes. */
  async hash(password) {
    const salt = randomBytes(16);
    const key = await scryptAsync(String(password).normalize('NFKC'), salt, N, R, P);
    return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
  },
```

**HttpOnly cookies.** On the server, the session token goes in a cookie marked **HttpOnly** (page scripts can't read it, so injected code can't steal it) and **SameSite=Lax** (other sites can't send it along). That's something the browser-only demo can't do, which is why the demo is labeled as one.

**The database** enforces rules too, so even a bug can't break them:

```sql
CREATE TABLE IF NOT EXISTS favorites (
  id         INTEGER PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind       TEXT    NOT NULL CHECK (kind IN ('quote', 'joke')),
  text       TEXT    NOT NULL CHECK (length(text) BETWEEN 1 AND 1000),
  created_at INTEGER NOT NULL,
  UNIQUE (user_id, text)                    -- saving the same item twice keeps one copy
);
```

`ON DELETE CASCADE` removes a user's favorites and sessions with the account, and every query uses `?` placeholders, so typed text can never become SQL.

**More protection on the server:** each IP address gets at most 30 log-in and sign-up requests per 10 minutes, changes must be sent as JSON, requests from another site's `Origin` are refused, and only the app's own files are served (the database and server code return 404).

**Tests.** 27 tests run with `npm test`: the picker, the account rules against a real in-memory SQLite database, the HTTP API through a running server, and the browser demo with Web Crypto.

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
