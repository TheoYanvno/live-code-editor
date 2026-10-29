// Built from guides/quote.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "quote",
 "title": "Quote & Joke Generator",
 "goals": [
  "Keep content as an array of objects and pick from it at random without repeats",
  "Make a \"today's pick\" that is the same for everyone without a server",
  "Filter by category, animate text and respect reduced-motion settings",
  "Save favorites that survive blocked storage",
  "Build sign-up and log-in rules: validation, salted password hashing, sessions and lockouts",
  "Put a whole REST API behind one function so the same rules run on a server and in the browser"
 ],
 "prereqs": [
  "HTML, CSS and JavaScript basics (functions, arrays, objects)",
  "Arrow functions, template literals and array map and filter",
  "async and await help in session 3"
 ],
 "sessions": [
  {
   "title": "Quotes on a card",
   "from": 0,
   "to": 2
  },
  {
   "title": "Delight and sharing",
   "from": 3,
   "to": 4
  },
  {
   "title": "Accounts: the rules",
   "from": 5,
   "to": 6
  },
  {
   "title": "An API in one function",
   "from": 7,
   "to": 8
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
   "data": "",
   "picker": "",
   "accounts": "",
   "api": "",
   "ui": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "Content as data, and a random pick",
   "body": "Welcome! In this guide you'll rebuild my [Quote & Joke Generator](https://theoyanvno.github.io/quote-and-joke-generator/): inspiring quotes and clean jokes, a punchline you reveal with a click, today's pick, categories, favorites, and accounts so your favorites follow you.\n\nEverything starts with the **content as data**: an array of plain objects.\n\n```svg A quote and a joke as objects: both have tags, so one filter works for both\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 150\" font-family=\"sans-serif\"><rect x=\"10\" y=\"15\" width=\"200\" height=\"110\" rx=\"8\" fill=\"#eef2ff\" stroke=\"#4f46e5\"/><text x=\"22\" y=\"36\" font-size=\"12\" font-weight=\"700\">a quote</text><text x=\"22\" y=\"56\" font-size=\"11\">text: \"Well begun is half done.\"</text><text x=\"22\" y=\"74\" font-size=\"11\">author: \"Aristotle\"</text><text x=\"22\" y=\"92\" font-size=\"11\">source: \"Politics\"</text><text x=\"22\" y=\"110\" font-size=\"11\">tags: [\"motivation\"]</text><rect x=\"220\" y=\"15\" width=\"200\" height=\"110\" rx=\"8\" fill=\"#fff7ed\" stroke=\"#ea580c\"/><text x=\"232\" y=\"36\" font-size=\"12\" font-weight=\"700\">a joke</text><text x=\"232\" y=\"56\" font-size=\"11\">setup: \"Why did the scarecrow…\"</text><text x=\"232\" y=\"74\" font-size=\"11\">punchline: \"He was outstanding…\"</text><text x=\"232\" y=\"92\" font-size=\"11\">tags: [\"dad\"]</text><text x=\"215\" y=\"144\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">same tags field on both, so one filter works for quotes and jokes</text></svg>\n```\n\nThe quotes come from public-domain sources, each with its author and where it's from; the jokes were written for the project. Adding one is adding an object, and nothing else in the code has to change.\n\n**Picking without repeats.** `Math.floor(Math.random() * length)` picks a random index, but pressing \"New one\" and getting the same quote again feels broken. `nextIndex(length, last)` fixes that neatly:\n\n```svg Pick from one fewer slot, then step over the last index\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 140\" font-family=\"sans-serif\"><rect x=\"20\" y=\"20\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"42\" y=\"42\" text-anchor=\"middle\" font-size=\"13\">0</text><rect x=\"72\" y=\"20\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"94\" y=\"42\" text-anchor=\"middle\" font-size=\"13\">1</text><rect x=\"124\" y=\"20\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#fde2e1\" stroke=\"#475569\"/><text x=\"146\" y=\"42\" text-anchor=\"middle\" font-size=\"13\">2</text><rect x=\"176\" y=\"20\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"198\" y=\"42\" text-anchor=\"middle\" font-size=\"13\">3</text><rect x=\"228\" y=\"20\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"250\" y=\"42\" text-anchor=\"middle\" font-size=\"13\">4</text><text x=\"124\" y=\"72\" text-anchor=\"middle\" font-size=\"11\" fill=\"#b91c1c\">last shown: 2</text><rect x=\"46\" y=\"92\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"68\" y=\"114\" text-anchor=\"middle\" font-size=\"13\">0</text><rect x=\"98\" y=\"92\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"120\" y=\"114\" text-anchor=\"middle\" font-size=\"13\">1</text><rect x=\"150\" y=\"92\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"172\" y=\"114\" text-anchor=\"middle\" font-size=\"13\">3</text><rect x=\"202\" y=\"92\" width=\"44\" height=\"34\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"224\" y=\"114\" text-anchor=\"middle\" font-size=\"13\">4</text><text x=\"300\" y=\"36\" font-size=\"11\">pick 0-3 from length - 1 = 4 slots</text><text x=\"300\" y=\"54\" font-size=\"11\">then if pick >= last, add 1</text><text x=\"300\" y=\"110\" font-size=\"11\" fill=\"#15803d\">every other item is</text><text x=\"300\" y=\"126\" font-size=\"11\" fill=\"#15803d\">equally likely, never 2</text></svg>\n```\n\n1. Pick from `length - 1` slots instead of `length`.\n2. If the pick is at or after the last index, add 1, which skips over it.\n\nEvery *other* item is equally likely, and the last one can never come up. No loop of \"pick again until it's different\" is needed.\n\nThe `rand` parameter defaults to `Math.random`, but a test can pass its own function to make the result predictable.\n\n### What to write\n\n- **HTML/CSS:** the whole page is here from the start: tabs, the card, buttons, the saved list and a log-in dialog you'll wire up later.\n- **JavaScript:** `QUOTES`, `nextIndex()`, `show()` to put a quote on the card, and `next()` for the button.\n\n### Try it\n\nPress **New one** a few times: never the same quote twice in a row.",
   "checks": [
    {
     "pane": "js",
     "label": "an array of quotes",
     "test": "/const\\s+QUOTES\\s*=\\s*\\[/"
    },
    {
     "pane": "js",
     "label": "a nextIndex() function",
     "test": "/function\\s+nextIndex\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "one fewer slot than items",
     "test": "/Math\\.floor\\(\\s*rand\\(\\)\\s*\\*\\s*\\(\\s*length\\s*-\\s*1\\s*\\)\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "step over the last pick",
     "test": "/if\\s*\\(\\s*i\\s*>=\\s*last/"
    }
   ],
   "quiz": [
    {
     "q": "There are 5 quotes and the last one shown was index 2. nextIndex picks 3 from the 4 slots. Which quote is shown?",
     "options": [
      "Index 3",
      "Index 4, because 3 is at or after the last index, so it steps up by one",
      "Index 2"
     ],
     "answer": 1,
     "why": "Picks 0 and 1 stay; picks 2 and 3 become 3 and 4, so index 2 is never chosen."
    },
    {
     "q": "Why keep quotes and jokes as data instead of writing them into the HTML?",
     "options": [
      "HTML can't hold quotes",
      "The code can pick, filter, save and share any item the same way, and adding one is just adding an object",
      "It makes the page load faster"
     ],
     "answer": 1,
     "why": "When content is data, features work for every item, including ones added later."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<main class=\"app\">\n  <div class=\"account\" id=\"account\" hidden>\n    <span class=\"demo-badge\" title=\"Accounts in this guide live in memory, in this page only\">Demo</span>\n    <span id=\"who\" class=\"who\" hidden></span>\n    <button id=\"loginBtn\" class=\"ghost\">Log in</button>\n    <button id=\"logoutBtn\" class=\"ghost\" hidden>Log out</button>\n  </div>\n\n  <header>\n    <h1>Quote <span>&amp;</span> Joke</h1>\n    <div class=\"tabs\" role=\"tablist\">\n      <button role=\"tab\" aria-selected=\"true\" data-mode=\"quote\">💬 Quotes</button>\n      <button role=\"tab\" aria-selected=\"false\" data-mode=\"joke\">😄 Jokes</button>\n      <button role=\"tab\" aria-selected=\"false\" data-mode=\"fav\">★ Saved</button>\n    </div>\n  </header>\n\n  <section id=\"generator\" class=\"card-area\">\n    <label class=\"filter\">Category <select id=\"tag\"></select></label>\n    <article id=\"card\" class=\"card\" aria-live=\"polite\">\n      <p id=\"daily\" class=\"daily\" hidden>Today's pick</p>\n      <p id=\"main\" class=\"main\"></p>\n      <p id=\"sub\" class=\"sub\"></p>\n      <button id=\"reveal\" class=\"reveal\" hidden>Reveal the punchline</button>\n    </article>\n    <div class=\"actions\">\n      <button id=\"next\" class=\"primary\">New one <kbd>Space</kbd></button>\n      <button id=\"copy\">Copy</button>\n      <button id=\"save\">☆ Save</button>\n      <a id=\"share\" target=\"_blank\" rel=\"noopener\">Share</a>\n    </div>\n    <p id=\"toast\" class=\"toast\" role=\"status\"></p>\n  </section>\n\n  <section id=\"favorites\" hidden>\n    <p id=\"favWhere\" class=\"fav-where\"></p>\n    <ul id=\"favList\" class=\"fav-list\"></ul>\n    <p id=\"favEmpty\" class=\"empty\">Nothing saved yet. Tap ☆ Save on a quote or joke you like.</p>\n  </section>\n</main>\n\n<dialog id=\"authDialog\" aria-labelledby=\"authTitle\">\n  <form id=\"authForm\" novalidate>\n    <div class=\"auth-tabs\" role=\"tablist\">\n      <button type=\"button\" role=\"tab\" data-auth=\"login\" aria-selected=\"true\">Log in</button>\n      <button type=\"button\" role=\"tab\" data-auth=\"signup\" aria-selected=\"false\">Create account</button>\n    </div>\n    <h2 id=\"authTitle\">Welcome back</h2>\n    <p class=\"demo-note\">This guide keeps accounts in memory, in this page only. Make up a username and password; don't reuse a real one.</p>\n    <label for=\"username\">Username</label>\n    <input id=\"username\" autocomplete=\"username\" autocapitalize=\"none\" spellcheck=\"false\">\n    <p class=\"field-error\" id=\"usernameError\"></p>\n    <label for=\"password\">Password</label>\n    <input id=\"password\" type=\"password\" autocomplete=\"current-password\">\n    <p class=\"field-error\" id=\"passwordError\"></p>\n    <p class=\"form-error\" id=\"authError\" role=\"alert\"></p>\n    <div class=\"auth-actions\">\n      <button type=\"button\" id=\"authCancel\">Cancel</button>\n      <button type=\"submit\" id=\"authSubmit\" class=\"primary\">Log in</button>\n    </div>\n  </form>\n</dialog>"
   },
   "css": {
    "base": ":root { --bg1: #4f46e5; --bg2: #db2777; --card: #fff; --text: #1f2937; --muted: #6b7280; }\n* { box-sizing: border-box; }\n[hidden] { display: none !important; }\nbody { margin: 0; min-height: 100vh; font-family: system-ui, sans-serif; color: var(--text); display: grid; place-items: center; padding: 16px;\n       background: linear-gradient(135deg, var(--bg1), var(--bg2)); }\n/* each tab sets its own two background colors */\nbody.joke { --bg1: #f59e0b; --bg2: #ef4444; }\nbody.fav { --bg1: #0ea5e9; --bg2: #6366f1; }\n.app { width: min(680px, 100%); }\nheader { text-align: center; color: #fff; }\nh1 { margin: 0 0 14px; font-size: clamp(2rem, 7vw, 3rem); letter-spacing: -.02em; }\nh1 span { opacity: .7; }\n.tabs { display: inline-flex; background: rgba(255,255,255,.2); border-radius: 999px; padding: 4px; gap: 4px; }\n.tabs button { border: 0; background: transparent; color: #fff; font: inherit; font-weight: 600; padding: 8px 14px; border-radius: 999px; cursor: pointer; }\n.tabs button[aria-selected=\"true\"] { background: #fff; color: var(--text); }\n.card-area, #favorites { margin-top: 20px; }\n.filter { display: block; color: #fff; text-align: right; margin-bottom: 8px; }\n.filter select { font: inherit; padding: 4px 8px; border-radius: 8px; border: 0; }\n.card { background: var(--card); border-radius: 20px; padding: clamp(24px, 5vw, 44px); box-shadow: 0 20px 50px rgba(0,0,0,.25); min-height: 220px;\n        display: flex; flex-direction: column; justify-content: center; }\n.card.flip { animation: flip .45s ease; }\n.main { font-size: clamp(1.25rem, 4vw, 1.7rem); line-height: 1.4; margin: 0; font-family: Georgia, serif; }\n.main.typing::after { content: \"▍\"; animation: blink .7s steps(1) infinite; }\n.sub { color: var(--muted); margin: 16px 0 0; font-size: 1rem; }\n.sub.punch { color: var(--text); font-size: 1.3rem; font-weight: 700; animation: pop .35s ease; }\n.daily { margin: 0 0 10px; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--bg2); }\n.reveal { align-self: flex-start; margin-top: 16px; }\n.actions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin-top: 18px; }\nbutton, .actions a { font: inherit; padding: 10px 18px; border-radius: 999px; border: 0; background: rgba(255,255,255,.9); color: var(--text); cursor: pointer; text-decoration: none; font-weight: 600; }\n.primary { background: #111827; color: #fff; }\nkbd { font-size: .7rem; opacity: .7; border: 1px solid currentColor; border-radius: 4px; padding: 0 4px; margin-left: 4px; }\n.toast { text-align: center; color: #fff; min-height: 1.4em; margin: 10px 0 0; }\n.fav-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 12px; }\n.fav-list li { background: var(--card); border-radius: 14px; padding: 16px 18px; box-shadow: 0 8px 20px rgba(0,0,0,.15); display: flex; gap: 12px; justify-content: space-between; align-items: flex-start; }\n.fav-list button { padding: 4px 10px; font-size: .85rem; background: #f3f4f6; }\n.empty, .fav-where { color: #fff; text-align: center; }\n.fav-where { margin: 0 0 12px; font-size: .9rem; }\n.account { display: flex; justify-content: flex-end; align-items: center; gap: 8px; margin-bottom: 8px; color: #fff; font-size: .9rem; }\n.who { font-weight: 600; }\n.demo-badge { font-size: .7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; padding: 2px 8px; border: 1px solid rgba(255,255,255,.7); border-radius: 999px; }\n.demo-note { margin: 0 0 6px; padding: 8px 12px; background: #fffbeb; color: #92400e; border-radius: 10px; font-size: .82rem; }\nbutton.ghost { background: rgba(255,255,255,.18); color: #fff; padding: 6px 14px; }\ndialog { width: min(400px, calc(100% - 32px)); border: 0; border-radius: 20px; padding: 24px; box-shadow: 0 30px 80px rgba(0,0,0,.35); color: var(--text); }\ndialog::backdrop { background: rgba(17,24,39,.55); }\ndialog h2 { margin: 16px 0 4px; }\n.auth-tabs { display: flex; background: #f3f4f6; border-radius: 999px; padding: 4px; }\n.auth-tabs button { flex: 1; background: transparent; padding: 8px; }\n.auth-tabs button[aria-selected=\"true\"] { background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.12); }\ndialog label { display: block; font-weight: 600; font-size: .9rem; margin-top: 10px; }\ndialog input { width: 100%; font: inherit; padding: 10px 12px; margin-top: 4px; border: 1px solid #d1d5db; border-radius: 10px; }\ndialog input[aria-invalid=\"true\"] { border-color: #dc2626; }\n.field-error, .form-error { color: #dc2626; font-size: .85rem; margin: 4px 0 0; }\n.form-error:not(:empty) { margin-top: 12px; padding: 8px 12px; background: #fef2f2; border-radius: 10px; }\n.auth-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; }\n.auth-actions button:not(.primary) { background: #f3f4f6; }\n@keyframes flip { from { transform: rotateX(70deg); opacity: 0; } to { transform: none; opacity: 1; } }\n@keyframes pop { from { transform: scale(.85); opacity: 0; } to { transform: none; opacity: 1; } }\n@keyframes blink { 50% { opacity: 0; } }\n@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }"
   },
   "js": {
    "data": "// Quotes: well-documented lines from public-domain sources. Jokes: original and clean.\nconst QUOTES = [\n  { text: 'Well begun is half done.', author: 'Aristotle', source: 'Politics', tags: ['motivation'] },\n  { text: 'A journey of a thousand miles begins with a single step.', author: 'Lao Tzu', source: 'Tao Te Ching', tags: ['motivation'] },\n  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca', source: 'Letters to Lucilius', tags: ['wisdom', 'courage'] },\n  { text: 'Well done is better than well said.', author: 'Benjamin Franklin', source: \"Poor Richard's Almanack, 1737\", tags: ['motivation'] },\n  { text: 'Our life is frittered away by detail. Simplify, simplify.', author: 'Henry David Thoreau', source: 'Walden, 1854', tags: ['wisdom'] },\n  { text: 'Courage is resistance to fear, mastery of fear, not absence of fear.', author: 'Mark Twain', source: \"Pudd'nhead Wilson, 1894\", tags: ['courage'] },\n  { text: 'Always do right. This will gratify some people and astonish the rest.', author: 'Mark Twain', source: 'Note to a young people’s society, 1901', tags: ['character', 'funny'] },\n  { text: 'The best way out is always through.', author: 'Robert Frost', source: 'A Servant to Servants, 1914', tags: ['courage'] },\n];\n\nconst JOKES = [\n  { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs.', tags: ['tech'] },\n  { setup: 'Why did the function stop calling the other function?', punchline: 'It kept getting no return.', tags: ['tech'] },\n  { setup: 'What do you call a fake noodle?', punchline: 'An impasta.', tags: ['dad'] },\n  { setup: 'Why did the scarecrow win an award?', punchline: 'He was outstanding in his field.', tags: ['dad'] },\n  { setup: 'Why can’t you trust an atom?', punchline: 'They make up everything.', tags: ['science'] },\n  { setup: 'Why did the photon skip the hotel check-in?', punchline: 'It was traveling light.', tags: ['science'] },\n  { setup: 'Why are hospital waiting rooms so quiet?', punchline: 'Everyone is being very patient.', tags: ['medical'] },\n  { setup: 'Why did the sailor bring a bar of soap on deck?', punchline: 'He wanted to wash ashore.', tags: ['military'] },\n];",
    "picker": "// A random index that is never the same as the last one (when there's a choice).\nfunction nextIndex(length, last, rand = Math.random) {\n  if (length <= 1) return 0;\n  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items\n  if (i >= last && last >= 0) i += 1;          // skip over the previous pick\n  return i;\n}\n\nconst formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;",
    "ui": "const $ = (id) => document.getElementById(id);\nlet current = null;                 // the item on the card\n\nconst pool = () => QUOTES;\n\nfunction show(item) {\n  current = item;\n  $('main').textContent = `“${item.text}”`;\n  $('sub').textContent = `— ${item.author}, ${item.source}`;\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\n$('next').onclick = next;",
    "go": "next();"
   }
  },
  {
   "title": "Jokes, and a punchline that waits",
   "body": "A joke is funnier when you get a moment to guess. Jokes have a `setup` and a `punchline`, so the card shows the setup first with a **Reveal the punchline** button.\n\nThe tabs switch `mode` between `'quote'` and `'joke'`:\n\n| Tab | `mode` | `body` class | Background |\n|---|---|---|---|\n| 💬 Quotes | `quote` | `quote` | indigo to pink |\n| 😄 Jokes | `joke` | `joke` | amber to red |\n\nThe CSS gradient uses two custom properties, `--bg1` and `--bg2`, and `body.joke` changes them, so the whole page changes color with one class.\n\n`show(item)` tells the two kinds apart by checking `item.setup`: a joke has one, a quote doesn't. For a joke it shows the setup and the button; `revealPunchline()` hides the button and shows the punchline in bold with a little pop animation.\n\nThe tabs use `role=\"tab\"` and `aria-selected`, so screen readers announce which tab is chosen. CSS styles the selected one with `.tabs button[aria-selected=\"true\"]`: the attribute that helps accessibility also drives the look.\n\n### Try it\n\nSwitch to Jokes, read the setup, then reveal the punchline. Notice the background change.",
   "checks": [
    {
     "pane": "js",
     "label": "a setMode() function",
     "test": "/function\\s+setMode\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "the page knows which tab is on",
     "test": "/document\\.body\\.className\\s*=\\s*next/"
    },
    {
     "pane": "js",
     "label": "jokes and quotes are told apart",
     "test": "/if\\s*\\(\\s*item\\.setup\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "a revealPunchline() function",
     "test": "/function\\s+revealPunchline\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "How does show() know whether it was given a quote or a joke?",
     "options": [
      "It checks a type field",
      "Jokes have a setup property and quotes don't",
      "It looks at the current tab"
     ],
     "answer": 1,
     "why": "The shape of the object tells you what it is, so no extra field is needed."
    },
    {
     "q": "Why set aria-selected on the tabs instead of only a CSS class?",
     "options": [
      "Screen readers announce aria-selected, and CSS can style the same attribute, so one attribute serves both",
      "CSS classes don't work on buttons",
      "It's required for clicks"
     ],
     "answer": 0,
     "why": "Using the accessibility attribute as the style hook keeps them from ever disagreeing."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "picker": "// A random index that is never the same as the last one (when there's a choice).\nfunction nextIndex(length, last, rand = Math.random) {\n  if (length <= 1) return 0;\n  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items\n  if (i >= last && last >= 0) i += 1;          // skip over the previous pick\n  return i;\n}\n\nconst formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;\nconst formatJoke = (j) => `${j.setup} ${j.punchline}`;",
    "ui": "const $ = (id) => document.getElementById(id);\nlet mode = 'quote';                 // 'quote', 'joke' or 'fav'\nlet current = null;                 // the item on the card\n\nconst pool = () => (mode === 'quote' ? QUOTES : JOKES);\n\nfunction setMode(next) {\n  mode = next;\n  document.body.className = next;          // each tab has its own background colors\n  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));\n  const items = next === 'quote' ? QUOTES : JOKES;\n  show(items[0]);\n}\n\nfunction show(item) {\n  current = item;\n  $('sub').className = 'sub';\n  $('reveal').hidden = true;\n  if (item.setup) {\n    $('main').textContent = item.setup;\n    $('sub').textContent = '';\n    $('reveal').hidden = false;                // the punchline waits for a click\n  } else {\n    $('main').textContent = `“${item.text}”`;\n    $('sub').textContent = `— ${item.author}, ${item.source}`;\n  }\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\nfunction revealPunchline() {\n  if (!current?.setup) return;\n  $('reveal').hidden = true;\n  $('sub').className = 'sub punch';\n  $('sub').textContent = current.punchline;\n}\n\ndocument.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });\n$('next').onclick = next;\n$('reveal').onclick = revealPunchline;",
    "go": "setMode('quote');"
   }
  },
  {
   "title": "Categories and today's pick",
   "body": "**Categories.** Every item has `tags`, like `['courage', 'motivation']`. `allTags(items)` collects them for the menu: `flatMap` makes one list of every tag, a `Set` removes duplicates, and `sort` puts them in order. Add a joke tagged `'space'` and a Space category appears by itself. `filterByTag(items, tag)` keeps the items that have the tag, or all of them for \"Everything\".\n\n**Today's pick.** Each tab opens on the same item for everyone all day, and a new one tomorrow, with no server and nothing saved:\n\n```svg Today's pick: today's date, hashed into an index\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 428 105\" font-family=\"sans-serif\"><rect x=\"6\" y=\"20\" width=\"97\" height=\"46\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"54\" y=\"39\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\">today's date</text><text x=\"54\" y=\"56\" text-anchor=\"middle\" font-size=\"10\">\"2026-10-28\"</text><line x1=\"103\" y1=\"43\" x2=\"111\" y2=\"43\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"111\" y=\"20\" width=\"97\" height=\"46\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"159\" y=\"39\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\">hash it</text><text x=\"159\" y=\"56\" text-anchor=\"middle\" font-size=\"10\">hash × 31 + char</text><line x1=\"208\" y1=\"43\" x2=\"216\" y2=\"43\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"216\" y=\"20\" width=\"97\" height=\"46\" rx=\"6\" fill=\"#ffedd5\" stroke=\"#475569\"/><text x=\"264\" y=\"39\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\">% length</text><text x=\"264\" y=\"56\" text-anchor=\"middle\" font-size=\"10\">an index</text><line x1=\"313\" y1=\"43\" x2=\"321\" y2=\"43\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"321\" y=\"20\" width=\"97\" height=\"46\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"369\" y=\"39\" text-anchor=\"middle\" font-size=\"11\" font-weight=\"700\">today's pick</text><text x=\"369\" y=\"56\" text-anchor=\"middle\" font-size=\"10\">same for everyone</text><text x=\"214\" y=\"92\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">no server and no saved state: every visitor works out the same answer, and tomorrow's date gives a new one</text></svg>\n```\n\n`dailyIndex(length, date)` turns the date into text like `\"2026-10-28\"` and **hashes** it: for each character, multiply the running total by 31 and add the character's code. `>>> 0` keeps the result a positive whole number. Then `hash % length` turns it into an index. The same date always gives the same number, and a different date gives a different one.\n\n| Date | Text | Index (of 8) |\n|---|---|---|\n| any time today | the same | the same pick |\n| tomorrow | one character changes | a different pick |\n\nThe card shows a \"Today's pick\" label when it's showing the daily item; pressing **New one** goes back to random picks from the chosen category.",
   "checks": [
    {
     "pane": "js",
     "label": "the tags for the menu",
     "test": "/new\\s+Set\\(\\s*items\\.flatMap/"
    },
    {
     "pane": "js",
     "label": "filter by category",
     "test": "/const\\s+filterByTag\\s*=/"
    },
    {
     "pane": "js",
     "label": "a daily index from the date",
     "test": "/function\\s+dailyIndex\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "each tab opens on today's pick",
     "test": "/show\\(\\s*items\\[\\s*dailyIndex\\(\\s*items\\.length\\s*\\)\\s*\\]\\s*,\\s*true\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why can every visitor see the same daily pick without a server?",
     "options": [
      "The browser downloads it each morning",
      "Everyone's browser hashes the same date and gets the same index",
      "It's saved in localStorage"
     ],
     "answer": 1,
     "why": "A deterministic calculation on shared input gives a shared answer."
    },
    {
     "q": "Why use a Set in allTags()?",
     "options": [
      "To remove duplicate tags, since many items share the same ones",
      "To sort the tags",
      "Sets are required by select menus"
     ],
     "answer": 0,
     "why": "flatMap lists every tag of every item; the Set keeps each one once."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "picker": "// A random index that is never the same as the last one (when there's a choice).\nfunction nextIndex(length, last, rand = Math.random) {\n  if (length <= 1) return 0;\n  let i = Math.floor(rand() * (length - 1));   // one fewer slot than there are items\n  if (i >= last && last >= 0) i += 1;          // skip over the previous pick\n  return i;\n}\n\nconst formatQuote = (q) => `“${q.text}” — ${q.author}${q.source ? `, ${q.source}` : ''}`;\nconst formatJoke = (j) => `${j.setup} ${j.punchline}`;\n\n// Same item all day for everyone, a new one tomorrow: an index made from today's date.\nfunction dailyIndex(length, date = new Date()) {\n  const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;\n  let hash = 0;\n  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;   // >>> 0 keeps it a positive 32-bit number\n  return hash % length;\n}\n\nconst filterByTag = (items, tag) => (tag === 'all' ? items : items.filter((i) => i.tags.includes(tag)));\nconst allTags = (items) => [...new Set(items.flatMap((i) => i.tags))].sort();",
    "ui": "const $ = (id) => document.getElementById(id);\nlet mode = 'quote';                 // 'quote', 'joke' or 'fav'\nlet current = null;                 // the item on the card\n\nconst pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);\n\nfunction setMode(next) {\n  mode = next;\n  document.body.className = next;          // each tab has its own background colors\n  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));\n  const items = next === 'quote' ? QUOTES : JOKES;\n  $('tag').innerHTML = ['all', ...allTags(items)]\n    .map((t) => `<option value=\"${t}\">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');\n  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick\n}\n\nfunction show(item, isDaily = false) {\n  current = item;\n  $('daily').hidden = !isDaily;\n  $('sub').className = 'sub';\n  $('reveal').hidden = true;\n  if (item.setup) {\n    $('main').textContent = item.setup;\n    $('sub').textContent = '';\n    $('reveal').hidden = false;                // the punchline waits for a click\n  } else {\n    $('main').textContent = `“${item.text}”`;\n    $('sub').textContent = `— ${item.author}, ${item.source}`;\n  }\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\nfunction revealPunchline() {\n  if (!current?.setup) return;\n  $('reveal').hidden = true;\n  $('sub').className = 'sub punch';\n  $('sub').textContent = current.punchline;\n}\n\ndocument.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });\n$('tag').onchange = next;\n$('next').onclick = next;\n$('reveal').onclick = revealPunchline;"
   }
  },
  {
   "title": "A typewriter, a card flip and a shortcut",
   "body": "Small touches make the app feel alive.\n\n**Typewriter.** `typeText(el, text, done)` shows one more letter every 22 milliseconds with `setInterval`, and a blinking cursor (`.typing::after`) while it types. When it finishes it calls `done()`: that's when a quote's author appears, or a joke's **Reveal** button. `clearInterval(typing)` at the start stops any typing that's still going, so pressing New one quickly never mixes two texts.\n\n**Card flip.** The `.flip` class runs a short CSS animation. Adding a class that's already there does nothing, so `show()` removes it, reads `offsetWidth` (which makes the browser apply the change right away), and adds it again. That restarts the animation every time.\n\n**Reduced motion.** Some people turn off animations in their system settings, because motion can cause dizziness or nausea. `matchMedia('(prefers-reduced-motion: reduce)')` reads that setting: then the text appears at once, and a CSS media query turns off the animations.\n\n**Space bar.** Press Space for a new one, or to reveal a waiting punchline. The listener ignores Space while you're in a menu or a text field, where it means something else, and `preventDefault()` stops the page from scrolling.\n\n| Key press | What happens |\n|---|---|\n| Space, punchline waiting | reveal it |\n| Space, otherwise | a new item |\n| Space in a field or menu | nothing extra (it types or opens the menu) |",
   "checks": [
    {
     "pane": "js",
     "label": "a typewriter",
     "test": "/function\\s+typeText\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "it respects reduced motion",
     "test": "/prefers-reduced-motion/"
    },
    {
     "pane": "js",
     "label": "the flip animation restarts",
     "test": "/void\\s+\\$\\(\\s*['\"]card['\"]\\s*\\)\\.offsetWidth/"
    },
    {
     "pane": "js",
     "label": "a Space shortcut",
     "test": "/e\\.code\\s*===\\s*['\"]Space['\"]/"
    }
   ],
   "quiz": [
    {
     "q": "Why does typeText() start with clearInterval(typing)?",
     "options": [
      "To make typing faster",
      "So a new text stops the old one, instead of two timers typing into the same card",
      "clearInterval is required before setInterval"
     ],
     "answer": 1,
     "why": "Without it, a quick double press would interleave letters from two items."
    },
    {
     "q": "Why ignore the Space key when the focus is in a select or input?",
     "options": [
      "There Space already does something (types a space, opens the menu), so the shortcut would get in the way",
      "Space doesn't work in inputs",
      "To save battery"
     ],
     "answer": 0,
     "why": "Keyboard shortcuts must not take over keys that a focused control needs."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "ui": "const $ = (id) => document.getElementById(id);\nconst reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;\nlet mode = 'quote';                 // 'quote', 'joke' or 'fav'\nlet current = null;                 // the item on the card\nlet typing = null;                  // the typewriter's timer\n\nconst pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);\n\nfunction setMode(next) {\n  mode = next;\n  document.body.className = next;          // each tab has its own background colors\n  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));\n  const items = next === 'quote' ? QUOTES : JOKES;\n  $('tag').innerHTML = ['all', ...allTags(items)]\n    .map((t) => `<option value=\"${t}\">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');\n  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick\n}\n\n// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.\nfunction typeText(el, text, done) {\n  clearInterval(typing);\n  if (reduced) { el.textContent = text; return done?.(); }\n  el.textContent = '';\n  el.classList.add('typing');\n  let i = 0;\n  typing = setInterval(() => {\n    el.textContent = text.slice(0, ++i);\n    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }\n  }, 22);\n}\n\nfunction show(item, isDaily = false) {\n  current = item;\n  $('card').classList.remove('flip');\n  void $('card').offsetWidth;                 // reading the size restarts the CSS animation\n  $('card').classList.add('flip');\n  $('daily').hidden = !isDaily;\n  $('sub').className = 'sub';\n  $('reveal').hidden = true;\n  $('sub').textContent = '';\n  if (item.setup) {\n    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });\n  } else {\n    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });\n  }\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\nfunction revealPunchline() {\n  if (!current?.setup) return;\n  $('reveal').hidden = true;\n  $('sub').className = 'sub punch';\n  $('sub').textContent = current.punchline;\n}\n\ndocument.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });\n$('tag').onchange = next;\n$('next').onclick = next;\n$('reveal').onclick = revealPunchline;\n// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)\naddEventListener('keydown', (e) => {\n  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;\n  if (e.code === 'Space') {\n    e.preventDefault();\n    if (current?.setup && !$('reveal').hidden) revealPunchline();\n    else next();\n  }\n});"
   }
  },
  {
   "title": "Copy, share and save",
   "body": "**Copy** uses `navigator.clipboard.writeText()`. It can be refused (some browsers and sandboxed pages don't allow it), so it's inside `try`/`catch` and a little toast message says which happened.\n\n**Share** is a link to X's \"post\" page with the text in the URL. `encodeURIComponent()` makes quotes, `&` and other characters safe inside the link.\n\n**Save** keeps favorites as text in `localStorage`. Like copying, storage can be blocked: private browsing, a browser setting, or a sandbox. **This editor's preview blocks it**, so the code keeps a copy in a variable too: favorites work for as long as the page is open, and the page never crashes. On a normal page they're remembered next time.\n\n| Action | Browser feature | If it's not allowed |\n|---|---|---|\n| Copy | Clipboard API | \"Copy not allowed here\" |\n| Share | a link with an encoded URL | (always works) |\n| Save | `localStorage` | kept in memory instead |\n\nThe ★ Saved tab lists them with a ✕ to remove each one. The list is built with `innerHTML`, so each text goes through `esc()` first. These texts come from the app's own data, but escaping everything that goes into HTML is a habit worth keeping: it's what stops someone's typed text from becoming code.\n\nThe Save button shows **★ Saved** when the item on the card is already a favorite, and pressing it again removes it.\n\n### Try it\n\nSave two quotes and a joke, open ★ Saved, and remove one. Try Copy and Share.",
   "checks": [
    {
     "pane": "js",
     "label": "saving survives blocked storage",
     "test": "/catch\\s*\\{\\s*return\\s+memorySaved/"
    },
    {
     "pane": "js",
     "label": "a share link",
     "test": "/encodeURIComponent\\(\\s*asText\\(\\s*item\\s*\\)\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "copy to the clipboard",
     "test": "/navigator\\.clipboard\\.writeText\\(/"
    },
    {
     "pane": "js",
     "label": "the saved list is escaped",
     "test": "/\\$\\{\\s*esc\\(\\s*f\\.text\\s*\\)\\s*\\}/"
    }
   ],
   "quiz": [
    {
     "q": "Why does the save code keep a copy of favorites in a variable as well as localStorage?",
     "options": [
      "localStorage is slow",
      "Storage can be blocked, and then the variable keeps the feature working instead of failing",
      "To share favorites between tabs"
     ],
     "answer": 1,
     "why": "This preview is one such case: saving still works while the page is open."
    },
    {
     "q": "What does encodeURIComponent() do for the share link?",
     "options": [
      "Shortens the text",
      "Turns characters like spaces, quotes and & into codes that are safe inside a URL",
      "Encrypts the quote"
     ],
     "answer": 1,
     "why": "Without it, an & in a quote would end the text parameter early."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "ui": "const $ = (id) => document.getElementById(id);\nconst reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;\nlet mode = 'quote';                 // 'quote', 'joke' or 'fav'\nlet current = null;                 // the item on the card\nlet typing = null;                  // the typewriter's timer\nlet favorites = [];                 // [{ id?, text, kind }]\n// Saved while logged out: kept in this browser. Storage can be blocked (this editor's preview blocks it),\n// so a copy also lives in memory and the page keeps working.\nlet memorySaved = [];\nconst local = {\n  get: () => { try { return JSON.parse(localStorage.getItem('qj-favorites')) ?? memorySaved; } catch { return memorySaved; } },\n  set: (v) => { memorySaved = v; try { localStorage.setItem('qj-favorites', JSON.stringify(v)); } catch { /* blocked: memory only */ } },\n};\n\nconst pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);\nconst asText = (item) => (item.setup ? formatJoke(item) : formatQuote(item));\n\nfunction setMode(next) {\n  mode = next;\n  document.body.className = next;          // each tab has its own background colors\n  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));\n  $('generator').hidden = next === 'fav';\n  $('favorites').hidden = next !== 'fav';\n  if (next === 'fav') return renderFavorites();\n  const items = next === 'quote' ? QUOTES : JOKES;\n  $('tag').innerHTML = ['all', ...allTags(items)]\n    .map((t) => `<option value=\"${t}\">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');\n  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick\n}\n\n// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.\nfunction typeText(el, text, done) {\n  clearInterval(typing);\n  if (reduced) { el.textContent = text; return done?.(); }\n  el.textContent = '';\n  el.classList.add('typing');\n  let i = 0;\n  typing = setInterval(() => {\n    el.textContent = text.slice(0, ++i);\n    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }\n  }, 22);\n}\n\nfunction show(item, isDaily = false) {\n  current = item;\n  $('card').classList.remove('flip');\n  void $('card').offsetWidth;                 // reading the size restarts the CSS animation\n  $('card').classList.add('flip');\n  $('daily').hidden = !isDaily;\n  $('sub').className = 'sub';\n  $('reveal').hidden = true;\n  $('sub').textContent = '';\n  if (item.setup) {\n    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });\n  } else {\n    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });\n  }\n  $('save').textContent = favorites.some((f) => f.text === asText(item)) ? '★ Saved' : '☆ Save';\n  $('share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(asText(item))}`;\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\nfunction revealPunchline() {\n  if (!current?.setup) return;\n  $('reveal').hidden = true;\n  $('sub').className = 'sub punch';\n  $('sub').textContent = current.punchline;\n}\n\nfunction toast(msg) {\n  $('toast').textContent = msg;\n  clearTimeout(toast.t);\n  toast.t = setTimeout(() => { $('toast').textContent = ''; }, 1800);\n}\n\nfunction loadFavorites() {\n  favorites = local.get().map((text) => ({ text }));\n}\n\nfunction toggleSave() {\n  const text = asText(current);\n  const saved = local.get().includes(text);\n  local.set(saved ? local.get().filter((f) => f !== text) : [text, ...local.get()]);\n  loadFavorites();\n  $('save').textContent = saved ? '☆ Save' : '★ Saved';\n  toast(saved ? 'Removed from saved' : 'Saved!');\n}\n\n// Saved text came from our data, but escape it anyway: anything going into innerHTML should be.\nconst esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\nfunction renderFavorites() {\n  $('favEmpty').hidden = favorites.length > 0;\n  $('favList').innerHTML = favorites.map((f, i) => `<li><span>${esc(f.text)}</span><button data-i=\"${i}\" aria-label=\"Remove\">✕</button></li>`).join('');\n  $('favWhere').textContent = 'Saved in this browser.';\n}\n\ndocument.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });\n$('tag').onchange = next;\n$('next').onclick = next;\n$('reveal').onclick = revealPunchline;\n// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)\naddEventListener('keydown', (e) => {\n  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;\n  if (e.code === 'Space') {\n    e.preventDefault();\n    if (current?.setup && !$('reveal').hidden) revealPunchline();\n    else next();\n  }\n});\n$('save').onclick = toggleSave;\n$('copy').onclick = async () => {\n  try { await navigator.clipboard.writeText(asText(current)); toast('Copied to clipboard'); } catch { toast('Copy not allowed here'); }\n};\n$('favList').onclick = (e) => {\n  const i = e.target.dataset.i;\n  if (i === undefined) return;\n  local.set(local.get().filter((f) => f !== favorites[Number(i)].text));\n  loadFavorites();\n  renderFavorites();\n};",
    "go": "loadFavorites();\nsetMode('quote');"
   }
  },
  {
   "title": "Signing up and storing passwords safely",
   "body": "Accounts let favorites follow you to any device. They also bring the most important rule in web development: **never store a password.** Store something you can check a password against, that can't be turned back into it.\n\n**Checking the input first.** `validateSignup()` returns an object of field messages:\n\n| Field | Rule |\n|---|---|\n| username | 3-20 letters, numbers or underscores; case doesn't matter (`Demo` = `demo`) |\n| password | 8-128 characters, and not the same as the username |\n\nErrors come back per field, so the page can show each message under the right box.\n\n**Hashing.** A hash function turns a password into a fixed-length scramble that can't be reversed. But a plain hash has two problems: the same password always gives the same hash (so a leak shows who shares a password), and fast hashes can be guessed billions of times a second. So:\n\n```svg A salted, slow hash: only the result is stored, never the password\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 160\" font-family=\"sans-serif\"><rect x=\"10\" y=\"20\" width=\"110\" height=\"36\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"65\" y=\"42\" text-anchor=\"middle\" font-size=\"11\">password</text><rect x=\"10\" y=\"70\" width=\"110\" height=\"36\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"65\" y=\"92\" text-anchor=\"middle\" font-size=\"11\">random salt</text><rect x=\"160\" y=\"40\" width=\"120\" height=\"50\" rx=\"6\" fill=\"#ffedd5\" stroke=\"#475569\"/><text x=\"220\" y=\"62\" text-anchor=\"middle\" font-size=\"11\">PBKDF2-SHA256</text><text x=\"220\" y=\"78\" text-anchor=\"middle\" font-size=\"10\">210,000 rounds</text><line x1=\"120\" y1=\"38\" x2=\"160\" y2=\"58\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"120\" y1=\"88\" x2=\"160\" y2=\"72\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"280\" y1=\"65\" x2=\"310\" y2=\"65\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"310\" y=\"40\" width=\"110\" height=\"50\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"365\" y=\"62\" text-anchor=\"middle\" font-size=\"10\">pbkdf2$210000$</text><text x=\"365\" y=\"78\" text-anchor=\"middle\" font-size=\"10\">salt$hash</text><text x=\"215\" y=\"126\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">only the right column is stored; the password itself never is</text><text x=\"215\" y=\"144\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">a new salt per user means two people with the same password get different hashes</text></svg>\n```\n\n- A random **salt** (16 bytes from `crypto.getRandomValues()`) is mixed in for each user, and stored next to the hash.\n- **PBKDF2** runs the hash 210,000 times, so each guess is slow for an attacker but still quick enough for one log-in.\n- The stored text is `pbkdf2$210000$salt$hash`: everything needed to check a password later, and nothing that reveals it.\n\nTo check a password, `verify()` hashes it again with the stored salt and compares. The comparison looks at **every byte** even after finding a difference, so the time it takes doesn't give away how close a guess was.\n\nThis guide uses the browser's Web Crypto API (`crypto.subtle`), the same as the live demo. The real Node server uses **scrypt**, which also costs a lot of memory per guess.\n\n`AccountService` holds the rules, and a `store` object holds the data. For this guide the store is in memory; the real app passes a SQLite store or an IndexedDB store with the same methods.\n\n### Try it\n\nOpen the console: the `go` block checks a too-short username and password, then signs up a made-up demo user.",
   "checks": [
    {
     "pane": "js",
     "label": "sign-up rules",
     "test": "/function\\s+validateSignup\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a random salt per password",
     "test": "/crypto\\.getRandomValues\\(\\s*new\\s+Uint8Array\\(\\s*16\\s*\\)\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "a slow, salted hash",
     "test": "/name:\\s*['\"]PBKDF2['\"]/"
    },
    {
     "pane": "js",
     "label": "the sign-up rule in the service",
     "test": "/async\\s+signup\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why does every user get their own random salt?",
     "options": [
      "To make passwords longer",
      "So two people with the same password get different hashes, and one precomputed table can't crack everyone",
      "Salts make hashing faster"
     ],
     "answer": 1,
     "why": "With a salt, an attacker has to attack each account separately."
    },
    {
     "q": "Why run the hash 210,000 times?",
     "options": [
      "Each extra round makes every guess slower, which barely matters for one log-in but adds up for billions of guesses",
      "To make the hash longer",
      "Because one round might give the wrong answer"
     ],
     "answer": 0,
     "why": "Slowness is the point: it's a cost paid once by you and billions of times by an attacker."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "accounts": "// Account rules, written so they don't care where data is stored (the real app runs them on a Node server\n// with SQLite, and in the browser for the live demo).\nconst MAX_FAILED_LOGINS = 5;\nconst LOCKOUT_MINUTES = 15;\nconst SESSION_DAYS = 30;\n\nclass AccountError extends Error {\n  constructor(status, message, extra = {}) {\n    super(message);\n    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries\n    Object.assign(this, extra);\n  }\n}\n\n// Usernames ignore case: \"Anthony\" and \"anthony\" are the same account.\nconst normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();\n\nfunction validateSignup({ username, password }) {\n  const errors = {};\n  const name = normalizeUsername(username);\n  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';\n  const pw = String(password ?? '');\n  if (pw.length < 8) errors.password = 'Use at least 8 characters.';\n  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';\n  else if (pw.toLowerCase() === name) errors.password = \"Your password can't be your username.\";\n  return errors;\n}\n\n// ---- passwords, with the browser's Web Crypto API ----\nconst ITERATIONS = 210_000;\nconst bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));\nconst b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));\n\nasync function pbkdf2(password, salt, iterations) {\n  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);\n  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));\n}\n\nconst passwords = {\n  // a new random salt for every password, so two people with the same password get different hashes\n  async hash(password) {\n    const salt = crypto.getRandomValues(new Uint8Array(16));\n    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;\n  },\n  async verify(password, stored) {\n    const [scheme, iterations, salt, hash] = String(stored).split('$');\n    if (scheme !== 'pbkdf2' || !hash) return false;\n    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));\n    const expected = b64ToBytes(hash);\n    // compare every byte, so the time taken doesn't depend on where they differ\n    let diff = actual.length ^ expected.length;\n    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];\n    return diff === 0;\n  },\n};\n\n// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.\nfunction memoryStore() {\n  const state = { nextId: 1, users: [] };\n  return {\n    async createUser({ username, passwordHash, createdAt }) {\n      const id = state.nextId++;\n      state.users.push({ id, username, passwordHash, createdAt });\n      return id;\n    },\n    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },\n  };\n}\n\nclass AccountService {\n  constructor({ store, passwords, now = () => Date.now() }) {\n    this.store = store;\n    this.passwords = passwords;\n    this.now = now;\n  }\n\n  async signup({ username, password }) {\n    const errors = validateSignup({ username, password });\n    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });\n    const name = normalizeUsername(username);\n    if (await this.store.userByName(name)) {\n      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });\n    }\n    const passwordHash = await this.passwords.hash(password);\n    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });\n    return { user: { id, username: name } };\n  }\n}",
    "go": "loadFavorites();\nsetMode('quote');\n\n// Try the rules in the console (made-up demo values only)\nconsole.log(validateSignup({ username: 'ab', password: 'short' }));\nconst demo = new AccountService({ store: memoryStore(), passwords });\ndemo.signup({ username: 'Demo_User', password: 'not-a-real-pass' })\n  .then((r) => console.log('signed up as', r.user.username));"
   }
  },
  {
   "title": "Logging in, sessions and lockouts",
   "body": "After signing up or logging in, the user gets a **session token**: 256 random bits, written in a URL-safe form. Every later request carries the token, and `userForToken()` finds whose it is.\n\n| Piece | How |\n|---|---|\n| token | `crypto.getRandomValues()`: 32 random bytes, impossible to guess |\n| stored | only a **SHA-256 hash** of the token, so a stolen copy of the data can't be used to log in |\n| lifetime | 30 days; an expired session is deleted when it's next used |\n| log out | delete the session; the token stops working at once |\n\n**Brute force.** Someone could try thousands of passwords. The service counts failed logins per username: after **5** wrong passwords in **15 minutes**, logins for that name are refused with status **429** (\"Too many failed attempts. Try again in 12 minutes.\") until the window passes. A correct password clears the count.\n\n**Not revealing who has an account.** \"Wrong username or password\" is the same message whether the username exists or not. And when it doesn't exist, the service still hashes the password before answering, so the response takes the same time either way. Otherwise an attacker could time the replies to find real usernames.\n\n`#startSession`, `#checkLockout` and `#recordFailure` start with `#`, which makes them **private**: only code inside the class can call them.\n\n### Try it\n\nThe console signs up a demo user, shows whose token it is, then tries 6 wrong passwords: four \"Wrong username or password\", then \"Too many failed attempts\", then 429.",
   "checks": [
    {
     "pane": "js",
     "label": "session tokens",
     "test": "/const\\s+tokens\\s*=/"
    },
    {
     "pane": "js",
     "label": "only a hash of the token is stored",
     "test": "/tokenHash:\\s*await\\s+this\\.tokens\\.hash\\(\\s*token\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "a log-in rule",
     "test": "/async\\s+login\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "too many tries locks the name",
     "test": "/new\\s+AccountError\\(\\s*429/"
    }
   ],
   "quiz": [
    {
     "q": "Why store only a hash of each session token?",
     "options": [
      "Hashes are shorter",
      "If the stored data leaks, the hashes can't be used to log in, because the real tokens aren't there",
      "Tokens can't be stored as text"
     ],
     "answer": 1,
     "why": "Same idea as passwords: keep only what lets you check a token, not the token itself."
    },
    {
     "q": "Why does login() hash the password even when the username doesn't exist?",
     "options": [
      "To create the account",
      "So the reply takes the same time either way, and timing can't reveal which usernames exist",
      "It's a mistake"
     ],
     "answer": 1,
     "why": "A fast \"no such user\" answer would leak that the username is free."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "accounts": "// Account rules, written so they don't care where data is stored (the real app runs them on a Node server\n// with SQLite, and in the browser for the live demo).\nconst MAX_FAILED_LOGINS = 5;\nconst LOCKOUT_MINUTES = 15;\nconst SESSION_DAYS = 30;\n\nclass AccountError extends Error {\n  constructor(status, message, extra = {}) {\n    super(message);\n    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries\n    Object.assign(this, extra);\n  }\n}\n\n// Usernames ignore case: \"Anthony\" and \"anthony\" are the same account.\nconst normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();\n\nfunction validateSignup({ username, password }) {\n  const errors = {};\n  const name = normalizeUsername(username);\n  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';\n  const pw = String(password ?? '');\n  if (pw.length < 8) errors.password = 'Use at least 8 characters.';\n  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';\n  else if (pw.toLowerCase() === name) errors.password = \"Your password can't be your username.\";\n  return errors;\n}\n\n// ---- passwords, with the browser's Web Crypto API ----\nconst ITERATIONS = 210_000;\nconst bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));\nconst b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));\n\nasync function pbkdf2(password, salt, iterations) {\n  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);\n  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));\n}\n\nconst passwords = {\n  // a new random salt for every password, so two people with the same password get different hashes\n  async hash(password) {\n    const salt = crypto.getRandomValues(new Uint8Array(16));\n    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;\n  },\n  async verify(password, stored) {\n    const [scheme, iterations, salt, hash] = String(stored).split('$');\n    if (scheme !== 'pbkdf2' || !hash) return false;\n    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));\n    const expected = b64ToBytes(hash);\n    // compare every byte, so the time taken doesn't depend on where they differ\n    let diff = actual.length ^ expected.length;\n    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];\n    return diff === 0;\n  },\n};\n\n// ---- session tokens: 256 random bits; only a SHA-256 hash of each one is stored ----\nconst tokens = {\n  create() {\n    const bytes = crypto.getRandomValues(new Uint8Array(32));\n    return bytesToB64(bytes).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');\n  },\n  async hash(token) {\n    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(token))));\n    return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');\n  },\n};\n\n// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.\nfunction memoryStore() {\n  const state = { nextId: 1, users: [], sessions: [], favorites: [], attempts: {} };\n  return {\n    async createUser({ username, passwordHash, createdAt }) {\n      const id = state.nextId++;\n      state.users.push({ id, username, passwordHash, createdAt });\n      return id;\n    },\n    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },\n    async userById(id) { return state.users.find((u) => u.id === id) ?? null; },\n    async createSession(session) { state.sessions.push({ ...session }); },\n    async session(tokenHash) { return state.sessions.find((s) => s.tokenHash === tokenHash) ?? null; },\n    async deleteSession(tokenHash) { state.sessions = state.sessions.filter((s) => s.tokenHash !== tokenHash); },\n    async attempts(key) { return state.attempts[key] ?? null; },\n    async saveAttempts(key, value) { state.attempts[key] = { ...value }; },\n    async clearAttempts(key) { delete state.attempts[key]; },\n  };\n}\n\nclass AccountService {\n  constructor({ store, passwords, tokens, now = () => Date.now() }) {\n    this.store = store;\n    this.passwords = passwords;\n    this.tokens = tokens;\n    this.now = now;\n  }\n\n  async signup({ username, password }) {\n    const errors = validateSignup({ username, password });\n    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });\n    const name = normalizeUsername(username);\n    if (await this.store.userByName(name)) {\n      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });\n    }\n    const passwordHash = await this.passwords.hash(password);\n    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });\n    return this.#startSession(id, name);\n  }\n\n  async login({ username, password }) {\n    const name = normalizeUsername(username);\n    const key = `login:${name}`;\n    await this.#checkLockout(key);\n    const user = name ? await this.store.userByName(name) : null;\n    // hash even when the user doesn't exist, so the time taken doesn't reveal which usernames exist\n    const ok = user\n      ? await this.passwords.verify(String(password ?? ''), user.passwordHash)\n      : (await this.passwords.hash(String(password ?? '')), false);\n    if (!ok) {\n      const left = await this.#recordFailure(key);\n      throw new AccountError(401, left > 0 ? 'Wrong username or password.' : `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);\n    }\n    await this.store.clearAttempts(key);\n    return this.#startSession(user.id, user.username);\n  }\n\n  async logout(token) {\n    if (token) await this.store.deleteSession(await this.tokens.hash(token));\n  }\n\n  // the signed-in user for a session token, or null; expired sessions are removed\n  async userForToken(token) {\n    if (!token) return null;\n    const tokenHash = await this.tokens.hash(token);\n    const session = await this.store.session(tokenHash);\n    if (!session) return null;\n    if (session.expiresAt <= this.now()) {\n      await this.store.deleteSession(tokenHash);\n      return null;\n    }\n    const user = await this.store.userById(session.userId);\n    return user ? { id: user.id, username: user.username } : null;\n  }\n\n  // ---- helpers (# makes them private to the class) ----\n  async #startSession(userId, username) {\n    const token = this.tokens.create();\n    const expiresAt = this.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;\n    await this.store.createSession({ tokenHash: await this.tokens.hash(token), userId, expiresAt });\n    return { token, expiresAt, user: { id: userId, username } };\n  }\n\n  async #checkLockout(key) {\n    const a = await this.store.attempts(key);\n    if (!a) return;\n    const windowMs = LOCKOUT_MINUTES * 60 * 1000;\n    if (this.now() - a.firstAt > windowMs) return this.store.clearAttempts(key);\n    if (a.count >= MAX_FAILED_LOGINS) {\n      const minutes = Math.ceil((a.firstAt + windowMs - this.now()) / 60000);\n      throw new AccountError(429, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);\n    }\n  }\n\n  async #recordFailure(key) {\n    const a = await this.store.attempts(key);\n    const fresh = !a || this.now() - a.firstAt > LOCKOUT_MINUTES * 60 * 1000;\n    const next = fresh ? { count: 1, firstAt: this.now() } : { ...a, count: a.count + 1 };\n    await this.store.saveAttempts(key, next);\n    return MAX_FAILED_LOGINS - next.count;\n  }\n}",
    "go": "loadFavorites();\nsetMode('quote');\n\n// Try the rules in the console (made-up demo values only)\nconst demo = new AccountService({ store: memoryStore(), passwords, tokens });\n(async () => {\n  const s = await demo.signup({ username: 'demo_user', password: 'not-a-real-pass' });\n  console.log('session token', s.token.slice(0, 8) + '…', 'belongs to', (await demo.userForToken(s.token)).username);\n  for (let i = 0; i < 6; i++) await demo.login({ username: 'demo_user', password: 'wrong guess' }).catch((e) => console.log(e.status, e.message));\n})();"
   }
  },
  {
   "title": "A REST API as one function",
   "body": "A real app talks to its server through an **API**: requests like `POST /api/login` with a JSON body, answered with a **status code** and JSON. This project's trick is to write the whole API as **one plain function**:\n\n```svg One function, two homes: the Node server and the browser demo run the same API code\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 150\" font-family=\"sans-serif\"><rect x=\"10\" y=\"20\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"70\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">{ method, path,</text><text x=\"70\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">body, token }</text><rect x=\"160\" y=\"20\" width=\"110\" height=\"44\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"215\" y=\"46\" text-anchor=\"middle\" font-size=\"11\">handleApi()</text><rect x=\"300\" y=\"20\" width=\"120\" height=\"44\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"360\" y=\"38\" text-anchor=\"middle\" font-size=\"10\">{ status, body,</text><text x=\"360\" y=\"52\" text-anchor=\"middle\" font-size=\"10\">session }</text><line x1=\"130\" y1=\"42\" x2=\"160\" y2=\"42\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"270\" y1=\"42\" x2=\"300\" y2=\"42\" stroke=\"#475569\" stroke-width=\"2\"/><text x=\"110\" y=\"96\" text-anchor=\"middle\" font-size=\"11\">Node server: real HTTP,</text><text x=\"110\" y=\"112\" text-anchor=\"middle\" font-size=\"11\">HttpOnly cookie, SQLite</text><text x=\"320\" y=\"96\" text-anchor=\"middle\" font-size=\"11\">this guide and the live demo:</text><text x=\"320\" y=\"112\" text-anchor=\"middle\" font-size=\"11\">called directly in the browser</text><text x=\"215\" y=\"140\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">the same rules and messages in both, because the API is just a function</text></svg>\n```\n\n`handleApi(service, request)` takes `{ method, path, body, token }` and returns `{ status, body, session }`. It never touches the network itself. The Node server turns real HTTP requests into that shape and sends the answer back; the live demo (and this guide) just calls the function directly. Either way, the validation, status codes and messages are identical.\n\n| Method | Path | Answer |\n|---|---|---|\n| POST | `/api/signup` | `201` and a new session |\n| POST | `/api/login` | `200` and a session, or `401` / `429` |\n| POST | `/api/logout` | `200`, and the session is cleared |\n| GET | `/api/me` | `{ user }`, or `{ user: null }` |\n| GET | `/api/favorites` | your favorites, or `401` if you're not logged in |\n| POST | `/api/favorites` | `201` and the saved favorite |\n| POST | `/api/favorites/import` | how many were added |\n| DELETE | `/api/favorites/:id` | `204`; you can only delete your own |\n\nAn `AccountError` becomes a status and an `{ error, fields }` body; anything unexpected becomes a `500` with a polite message, and the details go to the console, never to the user.\n\nOn the page side, `call(method, path, body)` sends a request, keeps the session token, and throws an `ApiError` for any status of 400 or more, so page code can use `try`/`catch`.\n\nFavorites are added to the service and store too: saving the same text twice keeps one copy, and deleting checks the favorite belongs to you.\n\n### Try it\n\nThe console asks for favorites without logging in (401) and sends a bad sign-up (400, with a message for each field).",
   "checks": [
    {
     "pane": "js",
     "label": "the API is one function",
     "test": "/async\\s+function\\s+handleApi\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "routes by method and path",
     "test": "/const\\s+route\\s*=\\s*`\\$\\{method\\}\\s+\\$\\{path\\}`/"
    },
    {
     "pane": "js",
     "label": "favorites need a log-in",
     "test": "/error\\(\\s*401/"
    },
    {
     "pane": "js",
     "label": "the page's call()",
     "test": "/async\\s+function\\s+call\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why write the API as a function instead of directly in the server code?",
     "options": [
      "Functions run faster than servers",
      "The same function can run behind a real server or right in the browser, so both behave exactly alike",
      "Servers can't call functions"
     ],
     "answer": 1,
     "why": "Keeping HTTP at the edges means the rules are written, and tested, once."
    },
    {
     "q": "A request asks to DELETE favorite 7, which belongs to someone else. What happens?",
     "options": [
      "It's deleted",
      "The store only removes favorites with your user id, so nothing is removed and the API answers 404",
      "The other user is logged out"
     ],
     "answer": 1,
     "why": "Every favorite query includes the signed-in user's id, so one user can never touch another's data."
    }
   ],
   "session": 3,
   "minutes": 20,
   "js": {
    "accounts": "// Account rules, written so they don't care where data is stored (the real app runs them on a Node server\n// with SQLite, and in the browser for the live demo).\nconst MAX_FAILED_LOGINS = 5;\nconst LOCKOUT_MINUTES = 15;\nconst SESSION_DAYS = 30;\n\nclass AccountError extends Error {\n  constructor(status, message, extra = {}) {\n    super(message);\n    this.status = status;          // an HTTP status code: 400 bad input, 401 wrong password, 409 taken, 429 too many tries\n    Object.assign(this, extra);\n  }\n}\n\n// Usernames ignore case: \"Anthony\" and \"anthony\" are the same account.\nconst normalizeUsername = (name) => String(name ?? '').trim().toLowerCase();\n\nfunction validateSignup({ username, password }) {\n  const errors = {};\n  const name = normalizeUsername(username);\n  if (!/^[a-z0-9_]{3,20}$/.test(name)) errors.username = 'Use 3-20 letters, numbers or underscores.';\n  const pw = String(password ?? '');\n  if (pw.length < 8) errors.password = 'Use at least 8 characters.';\n  else if (pw.length > 128) errors.password = 'Use 128 characters or fewer.';\n  else if (pw.toLowerCase() === name) errors.password = \"Your password can't be your username.\";\n  return errors;\n}\n\n// ---- passwords, with the browser's Web Crypto API ----\nconst ITERATIONS = 210_000;\nconst bytesToB64 = (bytes) => btoa(String.fromCharCode(...bytes));\nconst b64ToBytes = (text) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));\n\nasync function pbkdf2(password, salt, iterations) {\n  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(String(password).normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);\n  return new Uint8Array(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256));\n}\n\nconst passwords = {\n  // a new random salt for every password, so two people with the same password get different hashes\n  async hash(password) {\n    const salt = crypto.getRandomValues(new Uint8Array(16));\n    return `pbkdf2$${ITERATIONS}$${bytesToB64(salt)}$${bytesToB64(await pbkdf2(password, salt, ITERATIONS))}`;\n  },\n  async verify(password, stored) {\n    const [scheme, iterations, salt, hash] = String(stored).split('$');\n    if (scheme !== 'pbkdf2' || !hash) return false;\n    const actual = await pbkdf2(password, b64ToBytes(salt), Number(iterations));\n    const expected = b64ToBytes(hash);\n    // compare every byte, so the time taken doesn't depend on where they differ\n    let diff = actual.length ^ expected.length;\n    for (let i = 0; i < Math.min(actual.length, expected.length); i++) diff |= actual[i] ^ expected[i];\n    return diff === 0;\n  },\n};\n\n// ---- session tokens: 256 random bits; only a SHA-256 hash of each one is stored ----\nconst tokens = {\n  create() {\n    const bytes = crypto.getRandomValues(new Uint8Array(32));\n    return bytesToB64(bytes).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');\n  },\n  async hash(token) {\n    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(token))));\n    return [...digest].map((b) => b.toString(16).padStart(2, '0')).join('');\n  },\n};\n\n// Storage in memory, for this guide. The real app swaps in SQLite or IndexedDB with the same methods.\nfunction memoryStore() {\n  const state = { nextId: 1, users: [], sessions: [], favorites: [], attempts: {} };\n  return {\n    async createUser({ username, passwordHash, createdAt }) {\n      const id = state.nextId++;\n      state.users.push({ id, username, passwordHash, createdAt });\n      return id;\n    },\n    async userByName(name) { return state.users.find((u) => u.username === name) ?? null; },\n    async userById(id) { return state.users.find((u) => u.id === id) ?? null; },\n    async createSession(session) { state.sessions.push({ ...session }); },\n    async session(tokenHash) { return state.sessions.find((s) => s.tokenHash === tokenHash) ?? null; },\n    async deleteSession(tokenHash) { state.sessions = state.sessions.filter((s) => s.tokenHash !== tokenHash); },\n    async attempts(key) { return state.attempts[key] ?? null; },\n    async saveAttempts(key, value) { state.attempts[key] = { ...value }; },\n    async clearAttempts(key) { delete state.attempts[key]; },\n    async favorites(userId) {\n      return state.favorites.filter((f) => f.userId === userId).sort((a, b) => b.id - a.id).map(({ id, kind, text }) => ({ id, kind, text }));\n    },\n    async addFavorite(userId, { text, kind }) {\n      let fav = state.favorites.find((f) => f.userId === userId && f.text === text);   // the same text twice keeps one copy\n      if (!fav) state.favorites.push((fav = { id: state.nextId++, userId, kind, text }));\n      return { id: fav.id, kind: fav.kind, text: fav.text };\n    },\n    async removeFavorite(userId, id) {\n      const before = state.favorites.length;\n      state.favorites = state.favorites.filter((f) => !(f.id === id && f.userId === userId));   // only your own\n      return state.favorites.length < before;\n    },\n  };\n}\n\nclass AccountService {\n  constructor({ store, passwords, tokens, now = () => Date.now() }) {\n    this.store = store;\n    this.passwords = passwords;\n    this.tokens = tokens;\n    this.now = now;\n  }\n\n  async signup({ username, password }) {\n    const errors = validateSignup({ username, password });\n    if (Object.keys(errors).length) throw new AccountError(400, 'Please fix the highlighted fields.', { fields: errors });\n    const name = normalizeUsername(username);\n    if (await this.store.userByName(name)) {\n      throw new AccountError(409, 'That username is taken.', { fields: { username: 'That username is taken.' } });\n    }\n    const passwordHash = await this.passwords.hash(password);\n    const id = await this.store.createUser({ username: name, passwordHash, createdAt: this.now() });\n    return this.#startSession(id, name);\n  }\n\n  async login({ username, password }) {\n    const name = normalizeUsername(username);\n    const key = `login:${name}`;\n    await this.#checkLockout(key);\n    const user = name ? await this.store.userByName(name) : null;\n    // hash even when the user doesn't exist, so the time taken doesn't reveal which usernames exist\n    const ok = user\n      ? await this.passwords.verify(String(password ?? ''), user.passwordHash)\n      : (await this.passwords.hash(String(password ?? '')), false);\n    if (!ok) {\n      const left = await this.#recordFailure(key);\n      throw new AccountError(401, left > 0 ? 'Wrong username or password.' : `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes.`);\n    }\n    await this.store.clearAttempts(key);\n    return this.#startSession(user.id, user.username);\n  }\n\n  async logout(token) {\n    if (token) await this.store.deleteSession(await this.tokens.hash(token));\n  }\n\n  // the signed-in user for a session token, or null; expired sessions are removed\n  async userForToken(token) {\n    if (!token) return null;\n    const tokenHash = await this.tokens.hash(token);\n    const session = await this.store.session(tokenHash);\n    if (!session) return null;\n    if (session.expiresAt <= this.now()) {\n      await this.store.deleteSession(tokenHash);\n      return null;\n    }\n    const user = await this.store.userById(session.userId);\n    return user ? { id: user.id, username: user.username } : null;\n  }\n\n  // ---- favorites ----\n  async favorites(userId) { return this.store.favorites(userId); }\n\n  async addFavorite(userId, { text, kind }) {\n    const t = String(text ?? '').trim();\n    if (!t || t.length > 1000 || !['quote', 'joke'].includes(kind)) throw new AccountError(400, 'That favorite is not valid.');\n    return this.store.addFavorite(userId, { text: t, kind });\n  }\n\n  async removeFavorite(userId, id) {\n    if (!(await this.store.removeFavorite(userId, Number(id)))) throw new AccountError(404, 'That favorite was not found.');\n  }\n\n  // favorites saved while logged out move into the account; ones it already has are skipped\n  async importFavorites(userId, items) {\n    let added = 0;\n    for (const item of Array.isArray(items) ? items : []) {\n      const before = (await this.store.favorites(userId)).length;\n      await this.addFavorite(userId, item).catch(() => {});\n      if ((await this.store.favorites(userId)).length > before) added++;\n    }\n    return added;\n  }\n\n  // ---- helpers (# makes them private to the class) ----\n  async #startSession(userId, username) {\n    const token = this.tokens.create();\n    const expiresAt = this.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;\n    await this.store.createSession({ tokenHash: await this.tokens.hash(token), userId, expiresAt });\n    return { token, expiresAt, user: { id: userId, username } };\n  }\n\n  async #checkLockout(key) {\n    const a = await this.store.attempts(key);\n    if (!a) return;\n    const windowMs = LOCKOUT_MINUTES * 60 * 1000;\n    if (this.now() - a.firstAt > windowMs) return this.store.clearAttempts(key);\n    if (a.count >= MAX_FAILED_LOGINS) {\n      const minutes = Math.ceil((a.firstAt + windowMs - this.now()) / 60000);\n      throw new AccountError(429, `Too many failed attempts. Try again in ${minutes} minute${minutes === 1 ? '' : 's'}.`);\n    }\n  }\n\n  async #recordFailure(key) {\n    const a = await this.store.attempts(key);\n    const fresh = !a || this.now() - a.firstAt > LOCKOUT_MINUTES * 60 * 1000;\n    const next = fresh ? { count: 1, firstAt: this.now() } : { ...a, count: a.count + 1 };\n    await this.store.saveAttempts(key, next);\n    return MAX_FAILED_LOGINS - next.count;\n  }\n}",
    "api": "// The account API as one plain function: a request goes in, a response comes out.\n// request:  { method, path, body, token }     response: { status, body, session? }\nasync function handleApi(service, { method, path, body = {}, token = null }) {\n  try {\n    const route = `${method} ${path}`;\n    if (route === 'POST /api/signup') {\n      const s = await service.signup(body);\n      return { status: 201, body: { user: s.user }, session: { token: s.token } };\n    }\n    if (route === 'POST /api/login') {\n      const s = await service.login(body);\n      return { status: 200, body: { user: s.user }, session: { token: s.token } };\n    }\n    if (route === 'POST /api/logout') {\n      await service.logout(token);\n      return { status: 200, body: { ok: true }, session: { clear: true } };\n    }\n    const user = await service.userForToken(token);\n    if (route === 'GET /api/me') return { status: 200, body: { user } };\n\n    if (path.startsWith('/api/favorites')) {\n      if (!user) return error(401, 'Please log in to see your saved favorites.');\n      if (route === 'GET /api/favorites') return { status: 200, body: { favorites: await service.favorites(user.id) } };\n      if (route === 'POST /api/favorites') return { status: 201, body: { favorite: await service.addFavorite(user.id, body) } };\n      if (route === 'POST /api/favorites/import') return { status: 200, body: { added: await service.importFavorites(user.id, body.items) } };\n      const match = /^DELETE \\/api\\/favorites\\/(\\d+)$/.exec(route);\n      if (match) {\n        await service.removeFavorite(user.id, Number(match[1]));\n        return { status: 204, body: null };\n      }\n    }\n    return error(404, 'Not found.');\n  } catch (err) {\n    if (err instanceof AccountError) return error(err.status, err.message, err.fields ? { fields: err.fields } : {});\n    console.error(err);\n    return error(500, 'Something went wrong on our end. Please try again.');\n  }\n}\nconst error = (status, message, extra = {}) => ({ status, body: { error: message, ...extra } });\n\nclass ApiError extends Error {\n  constructor(status, body) {\n    super(body?.error ?? `Request failed (${status})`);\n    this.status = status;\n    this.fields = body?.fields ?? {};\n  }\n}\n\n// The page talks to the API through call(). Here it runs in the page itself, keeping the session token in a\n// variable; a real server keeps it in an HttpOnly cookie that page scripts can't read at all.\nconst service = new AccountService({ store: memoryStore(), passwords, tokens });\nlet sessionToken = null;\nasync function call(method, path, body) {\n  const res = await handleApi(service, { method, path, body, token: sessionToken });\n  if (res.session) sessionToken = res.session.clear ? null : res.session.token;\n  if (res.status >= 400) throw new ApiError(res.status, res.body);\n  return res.body;\n}",
    "go": "loadFavorites();\nsetMode('quote');\n\n// Try the API in the console (made-up demo values only)\n(async () => {\n  console.log(await handleApi(service, { method: 'GET', path: '/api/favorites' }));          // 401: not logged in\n  const r = await handleApi(service, { method: 'POST', path: '/api/signup', body: { username: 'x', password: 'short' } });\n  console.log(r.status, r.body.fields);                                                        // 400 with field messages\n})();"
   }
  },
  {
   "title": "Log in, and favorites that follow you",
   "body": "Now the page gets its account features: a **Log in** button, a dialog with *Log in* and *Create account* tabs, and favorites saved to the account.\n\n**The dialog** is a `<dialog>` element: `showModal()` opens it on top of the page, dims everything behind it and keeps keyboard focus inside. `setAuthMode()` switches the title, the button text and the password field's `autocomplete` (`new-password` for sign-up, so password managers offer to make one; `current-password` for log-in, so they fill it in).\n\n**Errors where they belong.** When the API answers 400 with `fields`, each message goes right under its box, and the box gets `aria-invalid=\"true\"` so screen readers announce it. Other errors (wrong password, lockout) show at the bottom of the form.\n\n**Favorites in the account.** When you're logged in, Save and remove go through `call()` to the API. When you log in, anything you'd saved before is sent to `/api/favorites/import`, so nothing is lost, and the toast says how many moved. Log out and you're back to favorites in this browser.\n\n| | Logged out | Logged in |\n|---|---|---|\n| Save | this browser | `POST /api/favorites` |\n| ★ Saved tab | this browser's list | `GET /api/favorites` |\n| Remove | this browser | `DELETE /api/favorites/:id` |\n\nAccounts in this guide live in memory, so they last until the preview reloads; the note in the dialog says so. Use made-up names and passwords.\n\n### Try it\n\nSave a quote while logged out. Create an account (try a 2-letter username first to see the field message): your saved quote moves into it. Log out, log back in with the wrong password a few times, then the right one.",
   "checks": [
    {
     "pane": "js",
     "label": "the log-in dialog opens",
     "test": "/\\$\\(\\s*['\"]authDialog['\"]\\s*\\)\\.showModal\\(\\)/"
    },
    {
     "pane": "js",
     "label": "field messages go under each box",
     "test": "/setAttribute\\(\\s*['\"]aria-invalid['\"]\\s*,\\s*['\"]true['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "saved favorites move into the account",
     "test": "/['\"]\\/api\\/favorites\\/import['\"]/"
    },
    {
     "pane": "js",
     "label": "log out",
     "test": "/\\$\\(\\s*['\"]logoutBtn['\"]\\s*\\)\\.onclick/"
    }
   ],
   "quiz": [
    {
     "q": "Why set autocomplete=\"new-password\" on the sign-up form?",
     "options": [
      "It makes the password longer",
      "Password managers then offer to create a strong password instead of filling in an old one",
      "It hides the password"
     ],
     "answer": 1,
     "why": "The right autocomplete value lets the browser help with the right job."
    },
    {
     "q": "What happens to favorites saved before logging in?",
     "options": [
      "They're deleted",
      "They're sent to /api/favorites/import and added to the account, skipping duplicates",
      "They stay only in this browser"
     ],
     "answer": 1,
     "why": "Moving them in means logging in never loses anything."
    }
   ],
   "session": 3,
   "minutes": 20,
   "js": {
    "ui": "const $ = (id) => document.getElementById(id);\nconst reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;\nlet mode = 'quote';                 // 'quote', 'joke' or 'fav'\nlet current = null;                 // the item on the card\nlet typing = null;                  // the typewriter's timer\nlet favorites = [];                 // [{ id?, text, kind }]\nlet user = null;                    // { id, username } when logged in\n// Saved while logged out: kept in this browser. Storage can be blocked (this editor's preview blocks it),\n// so a copy also lives in memory and the page keeps working.\nlet memorySaved = [];\nconst local = {\n  get: () => { try { return JSON.parse(localStorage.getItem('qj-favorites')) ?? memorySaved; } catch { return memorySaved; } },\n  set: (v) => { memorySaved = v; try { localStorage.setItem('qj-favorites', JSON.stringify(v)); } catch { /* blocked: memory only */ } },\n};\n\nconst pool = () => filterByTag(mode === 'quote' ? QUOTES : JOKES, $('tag').value);\nconst asText = (item) => (item.setup ? formatJoke(item) : formatQuote(item));\n\nfunction setMode(next) {\n  mode = next;\n  document.body.className = next;          // each tab has its own background colors\n  document.querySelectorAll('.tabs button').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === next)));\n  $('generator').hidden = next === 'fav';\n  $('favorites').hidden = next !== 'fav';\n  if (next === 'fav') return renderFavorites();\n  const items = next === 'quote' ? QUOTES : JOKES;\n  $('tag').innerHTML = ['all', ...allTags(items)]\n    .map((t) => `<option value=\"${t}\">${t === 'all' ? 'Everything' : t[0].toUpperCase() + t.slice(1)}</option>`).join('');\n  show(items[dailyIndex(items.length)], true);   // each tab opens on today's pick\n}\n\n// Types the text one letter at a time, then calls done(). Shown at once for people who turned off motion.\nfunction typeText(el, text, done) {\n  clearInterval(typing);\n  if (reduced) { el.textContent = text; return done?.(); }\n  el.textContent = '';\n  el.classList.add('typing');\n  let i = 0;\n  typing = setInterval(() => {\n    el.textContent = text.slice(0, ++i);\n    if (i >= text.length) { clearInterval(typing); el.classList.remove('typing'); done?.(); }\n  }, 22);\n}\n\nfunction show(item, isDaily = false) {\n  current = item;\n  $('card').classList.remove('flip');\n  void $('card').offsetWidth;                 // reading the size restarts the CSS animation\n  $('card').classList.add('flip');\n  $('daily').hidden = !isDaily;\n  $('sub').className = 'sub';\n  $('reveal').hidden = true;\n  $('sub').textContent = '';\n  if (item.setup) {\n    typeText($('main'), item.setup, () => { $('reveal').hidden = false; });\n  } else {\n    typeText($('main'), `“${item.text}”`, () => { $('sub').textContent = `— ${item.author}, ${item.source}`; });\n  }\n  $('save').textContent = favorites.some((f) => f.text === asText(item)) ? '★ Saved' : '☆ Save';\n  $('share').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(asText(item))}`;\n}\n\nfunction next() {\n  const items = pool();\n  show(items[nextIndex(items.length, items.indexOf(current))]);\n}\n\nfunction revealPunchline() {\n  if (!current?.setup) return;\n  $('reveal').hidden = true;\n  $('sub').className = 'sub punch';\n  $('sub').textContent = current.punchline;\n}\n\nfunction toast(msg) {\n  $('toast').textContent = msg;\n  clearTimeout(toast.t);\n  toast.t = setTimeout(() => { $('toast').textContent = ''; }, 1800);\n}\n\nconst JOKE_TEXTS = new Set(JOKES.map(formatJoke));\nconst kindOf = (text) => (JOKE_TEXTS.has(text) ? 'joke' : 'quote');\n\n// Logged in: the account's favorites. Logged out: this browser's.\nasync function loadFavorites() {\n  if (user) {\n    try { favorites = (await call('GET', '/api/favorites')).favorites; } catch (err) { toast(err.message); }\n  } else {\n    favorites = local.get().map((text) => ({ text, kind: kindOf(text) }));\n  }\n}\n\nasync function toggleSave() {\n  const text = asText(current);\n  const existing = favorites.find((f) => f.text === text);\n  try {\n    if (user) {\n      if (existing) await call('DELETE', `/api/favorites/${existing.id}`);\n      else await call('POST', '/api/favorites', { text, kind: current.setup ? 'joke' : 'quote' });\n    } else {\n      local.set(existing ? local.get().filter((f) => f !== text) : [text, ...local.get()]);\n    }\n    await loadFavorites();\n  } catch (err) {\n    return toast(err.message);\n  }\n  $('save').textContent = existing ? '☆ Save' : '★ Saved';\n  toast(existing ? 'Removed from saved' : user ? 'Saved to your account!' : 'Saved!');\n}\n\n// Saved text came from our data, but escape it anyway: anything going into innerHTML should be.\nconst esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');\nfunction renderFavorites() {\n  $('favEmpty').hidden = favorites.length > 0;\n  $('favList').innerHTML = favorites.map((f, i) => `<li><span>${esc(f.text)}</span><button data-i=\"${i}\" aria-label=\"Remove\">✕</button></li>`).join('');\n  $('favWhere').textContent = user ? `Saved to ${user.username}'s account.` : 'Saved in this browser. Log in to keep them in an account.';\n}\n\ndocument.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => setMode(b.dataset.mode); });\n$('tag').onchange = next;\n$('next').onclick = next;\n$('reveal').onclick = revealPunchline;\n// Space: a new one, or the punchline if it's waiting (but not while typing in a form field)\naddEventListener('keydown', (e) => {\n  if (e.target.matches('select, input') || mode === 'fav' || $('authDialog').open) return;\n  if (e.code === 'Space') {\n    e.preventDefault();\n    if (current?.setup && !$('reveal').hidden) revealPunchline();\n    else next();\n  }\n});\n$('save').onclick = toggleSave;\n$('copy').onclick = async () => {\n  try { await navigator.clipboard.writeText(asText(current)); toast('Copied to clipboard'); } catch { toast('Copy not allowed here'); }\n};\n$('favList').onclick = async (e) => {\n  const i = e.target.dataset.i;\n  if (i === undefined) return;\n  const fav = favorites[Number(i)];\n  try {\n    if (user) await call('DELETE', `/api/favorites/${fav.id}`);\n    else local.set(local.get().filter((f) => f !== fav.text));\n  } catch (err) { toast(err.message); }\n  await loadFavorites();\n  renderFavorites();\n};\n\n// ---- accounts: the log-in dialog ----\nlet authMode = 'login';\n\nfunction setAuthMode(next) {\n  authMode = next;\n  document.querySelectorAll('[data-auth]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.auth === next)));\n  $('authTitle').textContent = next === 'signup' ? 'Create your account' : 'Welcome back';\n  $('authSubmit').textContent = next === 'signup' ? 'Create account' : 'Log in';\n  $('password').autocomplete = next === 'signup' ? 'new-password' : 'current-password';\n  clearAuthErrors();\n}\n\nfunction clearAuthErrors() {\n  for (const f of ['username', 'password']) { $(`${f}Error`).textContent = ''; $(f).removeAttribute('aria-invalid'); }\n  $('authError').textContent = '';\n}\n\ndocument.querySelectorAll('[data-auth]').forEach((b) => { b.onclick = () => setAuthMode(b.dataset.auth); });\n$('loginBtn').onclick = () => { setAuthMode('login'); $('authForm').reset(); $('authDialog').showModal(); $('username').focus(); };\n$('authCancel').onclick = () => $('authDialog').close();\n\n$('authForm').onsubmit = async (e) => {\n  e.preventDefault();\n  clearAuthErrors();\n  const body = { username: $('username').value.trim(), password: $('password').value };\n  $('authSubmit').disabled = true;\n  try {\n    user = (await call('POST', authMode === 'signup' ? '/api/signup' : '/api/login', body)).user;\n    // move anything saved before logging in into the account, so nothing is lost\n    const pending = local.get().map((text) => ({ text, kind: kindOf(text) }));\n    const moved = pending.length ? (await call('POST', '/api/favorites/import', { items: pending })).added : 0;\n    local.set([]);\n    $('authDialog').close();\n    await afterAuthChange();\n    toast(`${authMode === 'signup' ? 'Account created' : 'Logged in'} as ${user.username}.${moved ? ` ${moved} saved item${moved === 1 ? '' : 's'} moved to your account.` : ''}`);\n  } catch (err) {\n    if (!(err instanceof ApiError)) { $('authError').textContent = 'Something went wrong.'; return; }\n    // the API names which field is wrong, so the message goes right under it\n    for (const [field, message] of Object.entries(err.fields)) {\n      $(`${field}Error`).textContent = message;\n      $(field).setAttribute('aria-invalid', 'true');\n    }\n    if (!Object.keys(err.fields).length) $('authError').textContent = err.message;\n  } finally {\n    $('authSubmit').disabled = false;\n  }\n};\n\n$('logoutBtn').onclick = async () => {\n  try { await call('POST', '/api/logout', {}); } catch { /* the session is gone either way */ }\n  user = null;\n  await afterAuthChange();\n  toast('Logged out.');\n};\n\nasync function afterAuthChange() {\n  $('who').hidden = !user;\n  $('who').textContent = user ? `👤 ${user.username}` : '';\n  $('loginBtn').hidden = !!user;\n  $('logoutBtn').hidden = !user;\n  await loadFavorites();\n  if (mode === 'fav') renderFavorites();\n  else if (current) $('save').textContent = favorites.some((f) => f.text === asText(current)) ? '★ Saved' : '☆ Save';\n}",
    "go": "$('account').hidden = false;\nafterAuthChange();\nsetMode('quote');"
   }
  }
 ],
 "finish": "### What you learned\n\n- Content as an array of objects, and a random pick that never repeats\n- A daily pick everyone shares, from a hash of the date\n- Categories from tags with `flatMap` and `Set`\n- A typewriter and a restartable CSS animation that respect reduced motion\n- Copy, share and save, each working (or failing politely) when the browser says no\n- Sign-up validation, salted slow password hashing, constant-time comparison\n- Random session tokens stored as hashes, expiry, and lockouts after failed logins\n- A REST API written as one function, so the same rules run on a server and in the browser\n\n### Challenges\n\n1. **More jokes:** add a category of your own and watch it appear in the menu.\n2. **Show password:** add a Show/Hide button next to the password box (hint: switch the input's `type`).\n3. **Read it aloud:** a 🔊 button that reads the card with `speechSynthesis.speak()`.\n4. **Remember me:** keep the session token in `sessionStorage` (inside `try`/`catch`) so a reload keeps you logged in.\n5. **Password strength:** show \"weak\", \"okay\" or \"strong\" while someone types a new password.\n\nCompare yours with the [live version](https://theoyanvno.github.io/quote-and-joke-generator/) and the [source code](https://github.com/TheoYanvno/quote-and-joke-generator)."
};
