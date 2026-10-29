---
id: bonfire
title: Bonfire Notes (blog)
blocks-html: page
blocks-css: base
blocks-js: site, ui, go
goals: Read posts written as Markdown files with a front matter block; Turn Markdown into HTML safely, including lists, tables and heading links; Build a home page, post pages, tag pages and newer/older links from data; Route between pages with the address after #; Generate an RSS feed and forward old links to moved posts; Draw an animated canvas background that respects reduced motion
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects); Template literals and array map, filter and sort; Regular expressions help (each one is explained)
---

## Session: Posts as text

## Step: A post is a text file
time: 15

Welcome! In this guide you'll rebuild my Dark Souls fan blog, [Bonfire Notes](https://theoyanvno.github.io/bonfire-notes/): posts written in Markdown, turned into a dark-themed site with tag pages, a table of contents on each post, an RSS feed and floating embers.

The real blog is a **static site generator**: a Python script reads Markdown files and writes HTML pages, which GitHub Pages serves. In this guide the same steps run in the browser, so you can see the result as you type. The last step shows the Python version.

Every post is a text file in two parts:

```svg A post file: front matter on top, Markdown below
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 190" font-family="sans-serif"><rect x="10" y="10" width="250" height="170" rx="6" fill="#171311" stroke="#d6a756"/><text x="22" y="32" font-size="11" fill="#d6a756" font-family="monospace">---</text><text x="22" y="48" font-size="11" fill="#e7e0d6" font-family="monospace">title: Boss Guide 2: Taurus Demon</text><text x="22" y="64" font-size="11" fill="#e7e0d6" font-family="monospace">date: 2026-10-09</text><text x="22" y="80" font-size="11" fill="#e7e0d6" font-family="monospace">tags: guide, bosses</text><text x="22" y="96" font-size="11" fill="#e7e0d6" font-family="monospace">summary: A huge demon on…</text><text x="22" y="112" font-size="11" fill="#d6a756" font-family="monospace">---</text><text x="22" y="134" font-size="11" fill="#a8998a" font-family="monospace">The Taurus Demon is the first…</text><text x="22" y="150" font-size="11" fill="#a8998a" font-family="monospace">## Before the fog</text><line x1="262" y1="70" x2="290" y2="70" stroke="#475569" stroke-width="2"/><text x="296" y="66" font-size="11">front matter:</text><text x="296" y="80" font-size="11">key: value lines</text><line x1="262" y1="142" x2="290" y2="142" stroke="#475569" stroke-width="2"/><text x="296" y="138" font-size="11">the body: Markdown</text><text x="296" y="152" font-size="11">turned into HTML</text></svg>
```

The **front matter** is a block between two `---` lines with `key: value` lines: the title, date, tags and a one-sentence summary. Everything after it is the **body**, written in Markdown.

`parseFrontMatter(raw)` splits the two with one regular expression:

| Part of the pattern | Matches |
|---|---|
| `^---\s*\n` | the opening `---` line at the very start |
| `([\s\S]*?)` | the front matter lines (as few as possible) |
| `\n---\s*\n` | the closing `---` line |
| `([\s\S]*)$` | everything else: the body |

Then each line is split at its **first** colon only, so a title like `Boss Guide 2: Taurus Demon` keeps its colon. A post without the block, or without a title or date, throws an `Error` with a message that says exactly what's missing: when you have dozens of posts, that tells you which file to fix.

For this guide, the "files" are an array of `{ name, text }` objects in the `site` block. Four real posts from the blog are included, shortened.

check: js | the posts as files | /const\s+FILES\s*=\s*\[/
check: js | a parseFrontMatter() function | /function\s+parseFrontMatter\s*\(/
check: js | only the first colon splits | /line\.indexOf\(\s*['"]:['"]\s*\)/
check: js | a title and date are required | /for\s*\(\s*const\s+required\s+of\s+\[\s*['"]title['"]\s*,\s*['"]date['"]\s*\]\s*\)/

quiz: Why split each front matter line at the first colon only?
- [ ] Splitting is faster that way
- [x] So values like "Boss Guide 2: Taurus Demon" keep their own colons
- [ ] Keys can't contain letters
why: Everything after the first colon is the value, whatever it contains.
quiz: Why throw an error naming the missing field instead of skipping a broken post?
- [ ] Errors make the site faster
- [x] A post silently missing from the site is hard to notice; a clear error says which file to fix
- [ ] Skipping is not possible in JavaScript
why: Failing loudly at build time beats a quiet gap readers find first.

```html page
<canvas id="embers" aria-hidden="true"></canvas>
<div id="progress" class="progress" aria-hidden="true"></div>
<header class="site-head">
  <a class="brand" href="#/"><span class="flame" aria-hidden="true"></span>Bonfire Notes</a>
  <nav>
    <a href="#/">Posts</a>
    <a href="#/feed">RSS</a>
  </nav>
</header>
<main id="page" class="wrap"></main>
<footer class="site-foot">
  <p>Bonfire Notes is an unofficial fan blog. Dark Souls is a trademark of its owners; this site is not affiliated with FromSoftware or Bandai Namco.</p>
</footer>
```

```css base
:root { --bg: #0c0a09; --panel: #171311; --text: #e7e0d6; --muted: #a8998a; --ember: #f97316; --gold: #d6a756; --line: #2b231e; }
* { box-sizing: border-box; }
html { background: var(--bg); }
body { margin: 0; color: var(--text); font-family: Georgia, "Iowan Old Style", serif; line-height: 1.7;
       background: radial-gradient(ellipse at 50% 120%, rgba(249, 115, 22, .18), transparent 60%), var(--bg); min-height: 100vh; }
#embers { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
.site-head, .wrap, .site-foot { position: relative; z-index: 1; }
a { color: var(--gold); }
.site-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 18px 24px; border-bottom: 1px solid var(--line); }
.brand { display: flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; font-size: 1.3rem; letter-spacing: .12em; text-transform: uppercase; }
.flame { width: 14px; height: 22px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: radial-gradient(circle at 50% 70%, #fde68a, #f97316 45%, #9a3412 80%);
         box-shadow: 0 0 14px #f97316; animation: flicker 1.6s infinite alternate; }
nav { display: flex; gap: 18px; font-family: system-ui, sans-serif; font-size: .9rem; }
nav a { color: var(--muted); text-decoration: none; }
.wrap { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; }
.hero { text-align: center; padding: 48px 0 24px; }
.hero h1 { font-size: clamp(2.2rem, 7vw, 3.6rem); margin: 0; font-weight: normal; letter-spacing: .04em; text-shadow: 0 0 30px rgba(249, 115, 22, .35); }
.hero p, .muted { color: var(--muted); }
.page-title { font-weight: normal; }
.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 10px 0 28px; }
.tag { font-family: system-ui, sans-serif; font-size: .8rem; text-decoration: none; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; }
.tag.active, .tag:hover { color: var(--bg); background: var(--gold); border-color: var(--gold); }
.tag.small { font-size: .72rem; padding: 1px 8px; }
.cards { display: grid; gap: 18px; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 22px 24px; }
.card h2 { margin: 4px 0 6px; font-weight: normal; font-size: 1.45rem; }
.card h2 a { color: var(--text); text-decoration: none; }
.card p { margin: 0; color: #cfc6ba; }
.meta { font-family: system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }
.tags { display: flex; gap: 6px; margin-top: 10px !important; flex-wrap: wrap; }
.post h1 { font-weight: normal; font-size: clamp(1.9rem, 5vw, 2.6rem); line-height: 1.2; margin: 6px 0 10px; }
.prose { font-size: 1.08rem; }
.prose h2 { font-weight: normal; color: var(--gold); margin-top: 2em; border-bottom: 1px solid var(--line); padding-bottom: 4px; }
.prose strong { color: #fff; }
.prose table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-family: system-ui, sans-serif; font-size: .88rem; }
.prose th, .prose td { border-bottom: 1px solid var(--line); padding: 7px 10px; text-align: left; vertical-align: top; }
.prose th { color: var(--gold); font-weight: 600; background: var(--panel); }
.raw { white-space: pre-wrap; font-size: .9rem; color: var(--muted); }
.toc { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 10px 16px; margin: 18px 0; font-family: system-ui, sans-serif; font-size: .9rem; }
.toc summary { cursor: pointer; color: var(--muted); }
.pager { display: flex; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--line); font-family: system-ui, sans-serif; font-size: .9rem; }
.feed { white-space: pre-wrap; word-break: break-all; font-size: .8rem; background: var(--panel); padding: 12px; border-radius: 6px; }
.progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; background: linear-gradient(90deg, #9a3412, var(--ember), #fde68a); z-index: 10; box-shadow: 0 0 8px var(--ember); }
.site-foot { text-align: center; color: var(--muted); font-family: system-ui, sans-serif; font-size: .78rem; padding: 24px 16px 40px; border-top: 1px solid var(--line); }
@keyframes flicker { from { transform: scale(1) rotate(-2deg); opacity: .9; } to { transform: scale(1.08, 1.15) rotate(2deg); opacity: 1; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } #embers { display: none; } }
```

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

```

```js go
// the list above is drawn as soon as the code runs
```

## Step: Slugs, reading time and order
time: 15

Each post needs an address. Its **slug** comes from the file name, minus the date and `.md`:

```svg The slug is the file name without its date
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 120" font-family="sans-serif"><rect x="10" y="15" width="410" height="30" rx="6" fill="#e2e8f0"/><text x="20" y="35" font-size="12" font-family="monospace"><tspan fill="#94a3b8">2026-10-09-</tspan><tspan fill="#1d4ed8" font-weight="700">taurus-demon-boss-guide</tspan><tspan fill="#94a3b8">.md</tspan></text><line x1="200" y1="45" x2="200" y2="70" stroke="#475569" stroke-width="2"/><rect x="70" y="72" width="290" height="30" rx="6" fill="#bbf7d0"/><text x="215" y="92" text-anchor="middle" font-size="12" font-family="monospace">#/post/taurus-demon-boss-guide</text><text x="215" y="116" text-anchor="middle" font-size="10" fill="#475569">the date prefix is dropped, so the address stays the same if the date changes</text></svg>
```

Dropping the date means a post's address doesn't change if you fix its date later. The real blog writes it to `posts/taurus-demon-boss-guide.html`; in this guide it becomes `#/post/taurus-demon-boss-guide`.

`slugify(text)` turns tags (and later, headings) into the same safe form: lowercase, only letters, digits and dashes. "Ornstein & Smough: A Guide!" becomes `ornstein-smough-a-guide`.

`loadPost(file)` builds one post object:

| Field | From |
|---|---|
| `title`, `date`, `summary` | the front matter |
| `slug` | the file name |
| `tags` | `guide, bosses` split at commas, each slugified |
| `words` | counting `\w+` matches in the body |

**Reading time** is the word count divided by 220 (a typical reading speed), rounded **up**, and never less than 1 minute: `Math.max(1, Math.ceil(words / 220))`.

**Order.** Dates are `YYYY-MM-DD` text, so they sort correctly as strings, and `b.date.localeCompare(a.date)` puts the newest first. `POSTS_LIST` is worked out once when the page loads.

### Try it

The page lists every loaded post with its date, reading time and slug, newest first.

check: js | a slugify() helper | /const\s+slugify\s*=/
check: js | the slug drops the date | /replace\(\s*\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}-\//
check: js | reading time, at least a minute | /Math\.max\(\s*1\s*,\s*Math\.ceil\(\s*post\.words\s*\/\s*220\s*\)\s*\)/
check: js | newest first | /b\.date\.localeCompare\(\s*a\.date\s*\)/

quiz: A post has 450 words. What reading time does it show?
- [ ] 2 min
- [x] 3 min, because 450 / 220 is about 2.05 and Math.ceil rounds up
- [ ] 0 min
why: Rounding up means a reader is never told a post is shorter than it is.
quiz: Why do "YYYY-MM-DD" dates sort correctly as plain text?
- [x] The year comes first and every part is zero-padded, so text order matches date order
- [ ] JavaScript converts them to numbers
- [ ] They don't; a date library is needed
why: "2026-09-29" < "2026-10-09" character by character, just like the dates.

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

// "Ornstein & Smough: A Guide!" -> "ornstein-smough-a-guide"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

function loadPost(file) {
  const { meta, body } = parseFrontMatter(file.text);
  return {
    title: meta.title,
    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text
    slug: file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),   // the file name without its date
    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),
    summary: meta.summary ?? '',
    body,
    words: (body.match(/\w+/g) ?? []).length,
  };
}

const readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute

// Newest first. The posts are worked out once, when the page loads.
const POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));
```

```js ui
const $ = (id) => document.getElementById(id);
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

// For now, just list what was loaded.
$('page').innerHTML = '<ol>' + POSTS_LIST.map((p) =>
  `<li>${p.title} · ${fmtDate(p.date)} · ${readingMinutes(p)} min · ${p.slug}</li>`).join('') + '</ol>';
```

## Step: A home page and a page for each post
time: 15

Now the blog gets real pages, all drawn from `POSTS_LIST`:

- **Home:** a welcome banner, then a card per post: date, reading time, title link, summary and tags.
- **Post:** the title, date and the body. For now the body is shown as plain text; the next session turns its Markdown into HTML.

**One page, many addresses.** The part of the address after `#` (the *hash*) can change without loading a new page, and the browser fires a `hashchange` event when it does. `route()` reads it and decides what to show:

| Address | Page |
|---|---|
| `#/` (or nothing) | home |
| `#/post/taurus-demon-boss-guide` | that post |
| `#/post/` with a slug that doesn't exist | "Post not found" |

Links are ordinary `<a href="#/post/…">` links, so the Back button, bookmarks and opening in a new tab all work, which is why this beats changing the page in an `onclick`.

**Escaping.** Titles and summaries go into HTML through `esc()`, which turns `<`, `>`, `&` and `"` into their HTML codes. These posts are your own writing, but a title with `<` in it would otherwise break the page.

### Try it

Click a post title; press Back; change the address to a slug that doesn't exist.

check: js | a card for each post | /const\s+card\s*=\s*\(\s*p\s*\)\s*=>/
check: js | a home page | /function\s+homePage\s*\(/
check: js | a page for one post | /function\s+postPage\s*\(/
check: js | pages follow the address | /addEventListener\(\s*['"]hashchange['"]\s*,\s*route\s*\)/

quiz: Why use links to #/post/… instead of onclick handlers that redraw the page?
- [ ] Hash links are faster
- [x] The address changes, so Back, bookmarks and new tabs work like on any website
- [ ] onclick doesn't work on links
why: route() runs for every address change, however it happened.
quiz: What does route() do with #/post/does-not-exist?
- [ ] Crashes
- [x] postPage() finds no post and returns a "Post not found" page
- [ ] Shows the first post
why: Every address gets a sensible page, including wrong ones.

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<span class="tag small">${esc(t)}</span>`).join('')}</p>
  </article>`;

function homePage() {
  return { title: null, html: `<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>
    <div class="cards">${POSTS_LIST.map(card).join('')}</div>` };
}

function postPage(slug) {
  const post = POSTS_LIST.find((p) => p.slug === slug);
  if (!post) return { title: 'Not found', html: '<h1 class="page-title">Post not found</h1><p><a href="#/">All posts</a></p>' };
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1>
    <pre class="raw">${esc(post.body)}</pre></article>
  ` };
}

// The address after # says which page to show: #/, #/post/<slug>.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  const page = kind === 'post' ? postPage(arg)
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
```

```js go
route();
```

## Session: From Markdown to HTML

## Step: Headings, paragraphs and inline styles
time: 20

Markdown is plain text with a few conventions, and turning it into HTML is the heart of any blog engine. This one works in **blocks**: the body is split at blank lines, and each block becomes one HTML element.

```svg Markdown blocks and the HTML each one becomes
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 166" font-family="sans-serif"><rect x="8" y="12" width="170" height="26" rx="5" fill="#171311"/><text x="16" y="29" font-size="10" fill="#e7e0d6" font-family="monospace">## Before the fog</text><line x1="178" y1="25" x2="196" y2="25" stroke="#475569" stroke-width="2"/><rect x="196" y="12" width="226" height="26" rx="5" fill="#e2e8f0"/><text x="204" y="29" font-size="10" font-family="monospace">&lt;h2 id="before-the-fog"&gt;…&lt;/h2&gt;</text><rect x="8" y="46" width="170" height="26" rx="5" fill="#171311"/><text x="16" y="63" font-size="10" fill="#e7e0d6" font-family="monospace">**Kill the archers** first</text><line x1="178" y1="59" x2="196" y2="59" stroke="#475569" stroke-width="2"/><rect x="196" y="46" width="226" height="26" rx="5" fill="#e2e8f0"/><text x="204" y="63" font-size="10" font-family="monospace">&lt;p&gt;&lt;strong&gt;Kill the archers&lt;/strong&gt; first&lt;/p&gt;</text><rect x="8" y="80" width="170" height="26" rx="5" fill="#171311"/><text x="16" y="97" font-size="10" fill="#e7e0d6" font-family="monospace">1. Run back</text><line x1="178" y1="93" x2="196" y2="93" stroke="#475569" stroke-width="2"/><rect x="196" y="80" width="226" height="26" rx="5" fill="#e2e8f0"/><text x="204" y="97" font-size="10" font-family="monospace">&lt;ol&gt;&lt;li&gt;Run back&lt;/li&gt;&lt;/ol&gt;</text><rect x="8" y="114" width="170" height="26" rx="5" fill="#171311"/><text x="16" y="131" font-size="10" fill="#e7e0d6" font-family="monospace">| Attack | Avoid |</text><line x1="178" y1="127" x2="196" y2="127" stroke="#475569" stroke-width="2"/><rect x="196" y="114" width="226" height="26" rx="5" fill="#e2e8f0"/><text x="204" y="131" font-size="10" font-family="monospace">&lt;table&gt;…&lt;/table&gt;</text><text x="215" y="156" text-anchor="middle" font-size="11" fill="#475569">text is escaped first, so only the Markdown rules can make HTML</text></svg>
```

| Markdown | HTML |
|---|---|
| `## Before the fog` (one line) | `<h2>` (and `###` gives `<h3>`) |
| any other block | `<p>`, with its lines joined |
| `**bold**` | `<strong>bold</strong>` |
| `*italic*` | `<em>italic</em>` |
| `[label](#/post/slug)` | `<a href="#/post/slug">label</a>` |

**Escape first, then convert.** `inline()` escapes the line *before* applying the rules. So any `<` someone typed becomes `&lt;`, and the only tags on the page are the ones the rules create. If it converted first and escaped after, it would escape its own `<strong>` tags too; if it never escaped, a post could contain a `<script>`.

**Safe links.** A link is only made if its address starts with `http://`, `https://` or `#/`. Otherwise the label is shown as plain text. That blocks addresses like `javascript:…`, which would run code when clicked.

The `.+?` in the patterns is **lazy**: it matches as little as possible, so `**a** and **b**` becomes two bold words, not one bold stretch from the first `**` to the last.

### Try it

Open a post: headings, bold text and links now render. Add a line with `<b>hi</b>` to a post's text: it shows the tags as text.

check: js | escaping comes first | /return\s+escapeHtml\(\s*text\s*\)/
check: js | bold text | /<strong>\$1<\/strong>/
check: js | only safe links become links | /\^\(https\?:\\\/\\\/\|#\\\/\)/
check: js | a markdownToHtml() function | /function\s+markdownToHtml\s*\(/

quiz: Why does inline() escape the text before applying the Markdown rules?
- [x] So typed HTML can't become real tags, while the rules can still add their own
- [ ] Escaping is faster on short strings
- [ ] Markdown requires it
why: The order matters: escape, then convert, so only the converter can create HTML.
quiz: What happens to [click me](javascript:alert(1))?
- [ ] It becomes a link that runs the code
- [x] No link is made: the label is shown as plain text, because the address isn't http(s) or #/
- [ ] The whole post is hidden
why: An allowlist of address starts keeps dangerous link types out.

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

// "Ornstein & Smough: A Guide!" -> "ornstein-smough-a-guide"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these
// rules make, and links may only go to http(s) addresses or pages on this site.
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => (/^(https?:\/\/|#\/)/.test(url) ? `<a href="${url}">${label}</a>` : label));
}

// Blocks are separated by blank lines; each block becomes a heading, a list, a table or a paragraph.
function markdownToHtml(md) {
  const html = md.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    const heading = /^(#{2,3})\s+(.+)$/.exec(block);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      return `<h${level}>${inline(heading[2])}</h${level}>`;
    }
    return `<p>${lines.map(inline).join(' ')}</p>`;
  }).join('\n');
  return html;
}

function loadPost(file) {
  const { meta, body } = parseFrontMatter(file.text);
  return {
    title: meta.title,
    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text
    slug: file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),   // the file name without its date
    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),
    summary: meta.summary ?? '',
    bodyHtml: markdownToHtml(body),
    words: (body.match(/\w+/g) ?? []).length,
  };
}

const readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute

// Newest first. The posts are worked out once, when the page loads.
const POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<span class="tag small">${esc(t)}</span>`).join('')}</p>
  </article>`;

function homePage() {
  return { title: null, html: `<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>
    <div class="cards">${POSTS_LIST.map(card).join('')}</div>` };
}

function postPage(slug) {
  const post = POSTS_LIST.find((p) => p.slug === slug);
  if (!post) return { title: 'Not found', html: '<h1 class="page-title">Post not found</h1><p><a href="#/">All posts</a></p>' };
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1>
    <div class="prose">${post.bodyHtml}</div></article>
  ` };
}

// The address after # says which page to show: #/, #/post/<slug>.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  const page = kind === 'post' ? postPage(arg)
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  scrollTo(0, 0);
}
addEventListener('hashchange', route);
```

## Step: Lists and tables
time: 20

Guides need lists and tables: steps to follow, attacks to dodge. Each is recognized by what **every line** of a block looks like:

| Block | Every line looks like | Becomes |
|---|---|---|
| bullet list | `- item` or `* item` | `<ul><li>…</li></ul>` |
| numbered list | `1. item` | `<ol><li>…</li></ol>` |
| table | `\| cell \| cell \|`, with a `\|---\|---\|` line second | `<table>` |

`lines.every(...)` asks "does every line match?", so a paragraph that happens to start with a dash isn't mistaken for a list.

**Tables.** The second line must be the separator (`/^\|[\s:|-]+\|$/`: only pipes, dashes, colons and spaces). `cells(row)` trims the outer pipes and splits on the inner ones. The first row becomes `<th>` header cells, the rest `<td>` cells. A header row that's completely empty (`| | |`, used for the Taurus Demon's info box) gets no `<thead>` at all. Each cell goes through `inline()`, so **bold** and links work inside tables too.

This is a small Markdown converter, not a complete one: it handles what the blog's posts use. The real blog uses the Python `markdown` library, which handles everything (and is tested by thousands of projects).

### Try it

Open the Taurus Demon guide: a numbered list and two tables. Open the beginner tips: a bullet list.

check: js | bullet lists | /<ul>\$\{lines\.map/
check: js | numbered lists | /<ol>\$\{lines\.map/
check: js | a table needs its separator line | /\/\^\\\|\[\\s:\|-\]\+\\\|\$\/\.test\(\s*lines\[1\]/
check: js | table cells | /const\s+cells\s*=\s*\(\s*row\s*\)\s*=>/

quiz: Why check that EVERY line starts with "- " before making a list?
- [ ] To be fast
- [x] So a paragraph that happens to begin with a dash isn't turned into a list
- [ ] Lists must have more than one item
why: A block is a list only if it's all list items.
quiz: How does the converter know a block is a table and not a paragraph with pipes in it?
- [x] The second line must be a separator like |---|---|
- [ ] It counts the pipes
- [ ] Tables must be at the end of a post
why: The separator line is what makes Markdown tables unambiguous.

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

// "Ornstein & Smough: A Guide!" -> "ornstein-smough-a-guide"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these
// rules make, and links may only go to http(s) addresses or pages on this site.
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => (/^(https?:\/\/|#\/)/.test(url) ? `<a href="${url}">${label}</a>` : label));
}

// Blocks are separated by blank lines; each block becomes a heading, a list, a table or a paragraph.
function markdownToHtml(md) {
  const html = md.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    const heading = /^(#{2,3})\s+(.+)$/.exec(block);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      return `<h${level}>${inline(heading[2])}</h${level}>`;
    }
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
    }
    // a table: rows of | cells |, with a |---|---| line under the header
    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|')) && /^\|[\s:|-]+\|$/.test(lines[1].trim())) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(lines[0]);
      const thead = head.some(Boolean) ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';
      const rows = lines.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      return `<table>${thead}<tbody>${rows}</tbody></table>`;
    }
    return `<p>${lines.map(inline).join(' ')}</p>`;
  }).join('\n');
  return html;
}

function loadPost(file) {
  const { meta, body } = parseFrontMatter(file.text);
  return {
    title: meta.title,
    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text
    slug: file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),   // the file name without its date
    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),
    summary: meta.summary ?? '',
    bodyHtml: markdownToHtml(body),
    words: (body.match(/\w+/g) ?? []).length,
  };
}

const readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute

// Newest first. The posts are worked out once, when the page loads.
const POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));
```

## Step: Heading links and a table of contents
time: 15

Long guides need a **table of contents**, and that needs every `##` heading to have an `id` to link to.

1. `uniqueId(text)` slugifies the heading: "The trick: the ladder" becomes `the-trick-the-ladder`.
2. If that id is already used in this post, it adds `-2`, `-3` and so on. A `Set` remembers what's been used; ids must be unique on a page.
3. Every `##` heading is also pushed into `headings`, which `markdownToHtml()` now returns along with the HTML.

The post page shows a folding `<details>` box, "In this post", when there are **more than two** `##` headings (a short post doesn't need one).

**Links inside a hash-routed page.** On a normal site a table of contents links to `#the-trick-the-ladder`. Here the hash already holds the route, so links are `#/post/taurus-demon-boss-guide/the-trick-the-ladder`. `route()` reads the third part and calls `scrollIntoView()` on that heading.

| Address | Shows |
|---|---|
| `#/post/first-hours-in-lordran` | the post, from the top |
| `#/post/first-hours-in-lordran/watch-your-stamina-not-your-health` | the post, scrolled to that heading |

### Try it

Open "Why Dark Souls Still Matters" or the beginner tips, open **In this post** and jump to a section. Each heading's link is shareable.

check: js | headings get unique ids | /const\s+uniqueId\s*=/
check: js | ## headings are collected | /if\s*\(\s*level\s*===\s*2\s*\)\s*headings\.push/
check: js | a table of contents for longer posts | /post\.headings\.length\s*>\s*2/
check: js | contents links scroll to the heading | /getElementById\(\s*section\s*\)\?\.scrollIntoView\(\)/

quiz: A post has two headings both called "Tips". What ids do they get?
- [ ] "tips" and "tips"
- [x] "tips" and "tips-2"
- [ ] "tips-1" and "tips-2"
why: The first keeps the plain slug; later duplicates get -2, -3… so every id is unique.
quiz: Why do table-of-contents links look like #/post/<slug>/<heading> instead of #<heading>?
- [x] The hash already holds the route, so the heading is added as a third part that route() reads
- [ ] Browsers don't support #heading links
- [ ] To make links shorter
why: One hash, two jobs: which page, and where on it.

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

// "Ornstein & Smough: A Guide!" -> "ornstein-smough-a-guide"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these
// rules make, and links may only go to http(s) addresses or pages on this site.
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => (/^(https?:\/\/|#\/)/.test(url) ? `<a href="${url}">${label}</a>` : label));
}

// Blocks are separated by blank lines. Returns the HTML and the post's ## headings for the table of contents.
function markdownToHtml(md) {
  const headings = [];
  const used = new Set();
  const uniqueId = (text) => {                       // two headings with the same text get -2, -3…
    const base = slugify(text) || 'section';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };
  const html = md.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    const heading = /^(#{2,3})\s+(.+)$/.exec(block);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      const id = uniqueId(heading[2]);
      if (level === 2) headings.push({ id, text: heading[2] });
      return `<h${level} id="${id}">${inline(heading[2])}</h${level}>`;
    }
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
    }
    // a table: rows of | cells |, with a |---|---| line under the header
    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|')) && /^\|[\s:|-]+\|$/.test(lines[1].trim())) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(lines[0]);
      const thead = head.some(Boolean) ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';
      const rows = lines.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      return `<table>${thead}<tbody>${rows}</tbody></table>`;
    }
    return `<p>${lines.map(inline).join(' ')}</p>`;
  }).join('\n');
  return { html, headings };
}

function loadPost(file) {
  const { meta, body } = parseFrontMatter(file.text);
  const { html, headings } = markdownToHtml(body);
  return {
    title: meta.title,
    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text
    slug: file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),   // the file name without its date
    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),
    summary: meta.summary ?? '',
    bodyHtml: html,
    headings,
    words: (body.match(/\w+/g) ?? []).length,
  };
}

const readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute

// Newest first. The posts are worked out once, when the page loads.
const POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<span class="tag small">${esc(t)}</span>`).join('')}</p>
  </article>`;

function homePage() {
  return { title: null, html: `<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>
    <div class="cards">${POSTS_LIST.map(card).join('')}</div>` };
}

function postPage(slug) {
  const post = POSTS_LIST.find((p) => p.slug === slug);
  if (!post) return { title: 'Not found', html: '<h1 class="page-title">Post not found</h1><p><a href="#/">All posts</a></p>' };
  const toc = post.headings.length > 2
    ? `<details class="toc"><summary>In this post</summary><ol>${post.headings.map((h) => `<li><a href="#/post/${post.slug}/${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>`
    : '';
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1>
    ${toc}
    <div class="prose">${post.bodyHtml}</div></article>
  ` };
}

// The address after # says which page to show: #/, #/post/<slug>.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  const page = kind === 'post' ? postPage(arg)
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  if (section) document.getElementById(section)?.scrollIntoView();   // a table-of-contents link
  else scrollTo(0, 0);
}
addEventListener('hashchange', route);
```

## Session: A real blog

## Step: Tags, newer and older, and not-found pages
time: 20

**Tag pages.** Every tag on a card is now a link to `#/tag/<tag>`. The home page gets a **tag cloud**: "all" plus every tag used, with the current one highlighted. `homePage(tag)` filters the posts and changes the heading to `Tagged "guide"`. A tag nobody uses gets the not-found page.

`allTags` is built the same way as categories elsewhere in my projects: `flatMap` to list every post's tags, a `Set` to remove duplicates, then `sort`.

**Newer and older.** At the bottom of each post, the pager links to its neighbors in `POSTS_LIST`. The list is newest first, so:

| Link | Post |
|---|---|
| ← newer | `POSTS_LIST[i - 1]` (none for the newest post) |
| older → | `POSTS_LIST[i + 1]` (none for the oldest post) |

Using `findIndex` instead of `find` gives the position `i` that both links need.

**Not found.** One `notFound()` page now serves every bad address: an unknown post or an unknown tag. It's friendly and links home ("That page has gone hollow").

### Try it

Click a tag on any card, then "all". Open the newest post and follow "older →" all the way down.

check: js | every tag has a page | /homePage\(\s*arg\s*\)/
check: js | a tag cloud | /const\s+tagCloud\s*=/
check: js | the post's position for the pager | /POSTS_LIST\.findIndex\(/
check: js | one not-found page | /const\s+notFound\s*=/

quiz: POSTS_LIST is sorted newest first. Which post is the "older →" link on post i?
- [ ] POSTS_LIST[i - 1]
- [x] POSTS_LIST[i + 1]
- [ ] POSTS_LIST[0]
why: Further down a newest-first list means older.
quiz: Why use findIndex() instead of find() in postPage()?
- [ ] findIndex is faster
- [x] The position is needed to find the newer and older neighbors
- [ ] find() can't search by slug
why: With the index, the neighbors are just i - 1 and i + 1.

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
  </article>`;

const allTags = [...new Set(POSTS_LIST.flatMap((p) => p.tags))].sort();
const tagCloud = (active) => `<nav class="tag-cloud" aria-label="Tags">
  <a href="#/" class="tag${active ? '' : ' active'}">all</a>
  ${allTags.map((t) => `<a href="#/tag/${t}" class="tag${t === active ? ' active' : ''}">${esc(t)}</a>`).join('')}</nav>`;

function homePage(tag = null) {
  const posts = tag ? POSTS_LIST.filter((p) => p.tags.includes(tag)) : POSTS_LIST;
  const top = tag ? `<h1 class="page-title">Tagged “${esc(tag)}”</h1>`
    : '<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>';
  return { title: tag ? `Tagged ${tag}` : null, html: `${top}${tagCloud(tag)}<div class="cards">${posts.map(card).join('')}</div>` };
}

function postPage(slug) {
  const i = POSTS_LIST.findIndex((p) => p.slug === slug);
  if (i < 0) return notFound();
  const post = POSTS_LIST[i];
  const newer = POSTS_LIST[i - 1];
  const older = POSTS_LIST[i + 1];
  const toc = post.headings.length > 2
    ? `<details class="toc"><summary>In this post</summary><ol>${post.headings.map((h) => `<li><a href="#/post/${post.slug}/${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>`
    : '';
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1><p class="tags">${post.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
    ${toc}
    <div class="prose">${post.bodyHtml}</div></article>
    <nav class="pager">${newer ? `<a href="#/post/${newer.slug}">← ${esc(newer.title)}</a>` : '<span></span>'}
      ${older ? `<a href="#/post/${older.slug}">${esc(older.title)} →</a>` : ''}</nav>` };
}

const notFound = () => ({ title: 'Not found', html: '<h1 class="page-title">Nothing here</h1><p>That page has gone hollow. <a href="#/">All posts</a></p>' });

// The address after # says which page to show: #/, #/post/<slug>, #/tag/<tag>.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  const page = kind === 'post' ? postPage(arg)
    : kind === 'tag' ? (allTags.includes(arg) ? homePage(arg) : notFound())
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  if (section) document.getElementById(section)?.scrollIntoView();   // a table-of-contents link
  else scrollTo(0, 0);
}
addEventListener('hashchange', route);
```

## Step: An RSS feed, and links that never break
time: 20

**RSS** is the format feed readers (and podcast apps, and some news sites) subscribe to: one XML file listing the latest posts. When a new post appears in it, subscribers hear about it.

```
<item>
  <title>Boss Guide 2: Taurus Demon</title>
  <link>https://theoyanvno.github.io/bonfire-notes/posts/taurus-demon-boss-guide.html</link>
  <pubDate>Fri, 09 Oct 2026 00:00:00 GMT</pubDate>
  <description>A huge demon on a narrow wall…</description>
</item>
```

`rss(posts)` builds it with template literals. Text goes through `escapeXml()` (XML breaks on a stray `&` just like HTML does), and `toUTCString()` writes the date in the format RSS expects. The **RSS** link in the header opens a page showing the feed, with a **Download feed.xml** link made from a `Blob`. (The editor's preview may block downloads; the text is shown either way.)

**Moved posts.** The real blog renamed some posts when it grew, and old links (bookmarks, other people's posts) still point to the old names. `REDIRECTS` maps old slugs to new ones:

```svg An old address forwards to the post that replaced it
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 110" font-family="sans-serif"><rect x="10" y="20" width="170" height="34" rx="6" fill="#fde2e1" stroke="#b91c1c"/><text x="95" y="42" text-anchor="middle" font-size="10" font-family="monospace">#/post/beginner-friendly-builds</text><line x1="180" y1="37" x2="240" y2="37" stroke="#475569" stroke-width="2"/><text x="210" y="30" text-anchor="middle" font-size="10">REDIRECTS</text><rect x="240" y="20" width="180" height="34" rx="6" fill="#bbf7d0" stroke="#15803d"/><text x="330" y="42" text-anchor="middle" font-size="10" font-family="monospace">#/post/lordran-guide-hub</text><text x="215" y="84" text-anchor="middle" font-size="11" fill="#475569">location.replace() swaps the address without adding a history entry,</text><text x="215" y="100" text-anchor="middle" font-size="11" fill="#475569">so the Back button doesn't bounce you into the old link again</text></svg>
```

`route()` checks it first and calls `location.replace()` with the page's own address and the new hash. Unlike setting `location.hash`, `replace()` doesn't add a history entry, so pressing Back doesn't land on the old address and bounce forward again. (The full address matters here: a bare `#/…` would be read against the editor's address, and the preview would try to leave.)

The real Python build goes one step further: it refuses to build if a redirect points to a post that doesn't exist, or if a live post still uses an old name. A test also checks that every link between posts points to a real page.

### Try it

Go to `#/post/beginner-friendly-builds`: you land on the guides hub. Press Back. Then open the RSS page.

check: js | an rss() function | /function\s+rss\s*\(/
check: js | XML text is escaped | /const\s+escapeXml\s*=/
check: js | old addresses for moved posts | /const\s+REDIRECTS\s*=/
check: js | forwarding without a history entry | /location\.replace\(/

quiz: Why use location.replace() for a redirect instead of setting location.hash?
- [ ] replace() is faster
- [x] It doesn't add a history entry, so Back doesn't return to the old address and bounce forward again
- [ ] location.hash can't be set in code
why: A redirect should be invisible in the history.
quiz: Why keep redirects for old post addresses at all?
- [ ] Search engines require them
- [x] Bookmarks and links on other sites still use the old addresses, and they should keep working
- [ ] To make the site load faster
why: Breaking every old link throws away readers who were trying to find you.

```js site
// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)
const FILES = [
  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---
title: Why Dark Souls Still Matters
date: 2026-09-28
tags: opinion, history
summary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.
---

When **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.

## A world that folds back on itself

You spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.

## Difficulty with a purpose

Dark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.

## Strangers who help

Players can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },

  { name: '2026-09-29-first-hours-in-lordran.md', text: `---
title: Your First Hours in Lordran: Beginner Tips
date: 2026-09-29
tags: guide, beginner
summary: The things I wish someone had told me before my first trip through the Undead Burg.
---

The first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.

## Bonfires are checkpoints with a cost

Resting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.

## Your souls are waiting where you fell

When you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.

## Watch your stamina, not your health

- Attacking, rolling, running and blocking all use stamina.
- The most common beginner death is swinging until the bar is empty.
- Always keep a little in reserve to roll away.` },

  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---
title: Boss Guide 2: Taurus Demon
date: 2026-10-09
tags: guide, bosses
summary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.
---

The Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.

| | |
|---|---|
| **Where** | The long stone wall in the Undead Burg |
| **Weak to** | Plunging attacks, fire (firebombs) |

## The trick: the ladder

1. **Turn around and run back** to the tower you came from.
2. **Climb the ladder** inside the tower to the top.
3. Wait for the demon to walk underneath you, then **drop down and attack**.

## Its attacks

| Attack | What it looks like | How to avoid it |
|---|---|---|
| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |
| Wide swing | Big horizontal swing | Roll through it toward its body |
| Leap | Jumps into the air and lands on you | Run sideways or forward under it |

Back to the [guides hub](#/post/lordran-guide-hub).` },

  { name: '2026-10-15-lordran-guide-hub.md', text: `---
title: Start Here: Lordran Guides Hub
date: 2026-10-15
tags: guide, beginner
summary: Every guide on the blog in one place, in the order you'll need them.
---

New to Dark Souls? Start with the tips, then take on the first big boss.

| Guide | What it covers |
|---|---|
| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |
| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |

*More guides are on the way.*` },
];
// Reads the '---' block at the top of a post into an object, and returns the rest as the body.
function parseFrontMatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error('Post is missing its --- front matter block');
  const meta = {};
  for (const line of match[1].split('\n')) {
    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const required of ['title', 'date']) {
    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);
  }
  return { meta, body: match[2] };
}

// "Ornstein & Smough: A Guide!" -> "ornstein-smough-a-guide"
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/[\s-]+/g, '-').replace(/^-|-$/g, '');

const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these
// rules make, and links may only go to http(s) addresses or pages on this site.
function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => (/^(https?:\/\/|#\/)/.test(url) ? `<a href="${url}">${label}</a>` : label));
}

// Blocks are separated by blank lines. Returns the HTML and the post's ## headings for the table of contents.
function markdownToHtml(md) {
  const headings = [];
  const used = new Set();
  const uniqueId = (text) => {                       // two headings with the same text get -2, -3…
    const base = slugify(text) || 'section';
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };
  const html = md.trim().split(/\n\s*\n/).map((block) => {
    const lines = block.split('\n');
    const heading = /^(#{2,3})\s+(.+)$/.exec(block);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      const id = uniqueId(heading[2]);
      if (level === 2) headings.push({ id, text: heading[2] });
      return `<h${level} id="${id}">${inline(heading[2])}</h${level}>`;
    }
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\s*\d+\.\s+/, ''))}</li>`).join('')}</ol>`;
    }
    // a table: rows of | cells |, with a |---|---| line under the header
    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|')) && /^\|[\s:|-]+\|$/.test(lines[1].trim())) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(lines[0]);
      const thead = head.some(Boolean) ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';
      const rows = lines.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');
      return `<table>${thead}<tbody>${rows}</tbody></table>`;
    }
    return `<p>${lines.map(inline).join(' ')}</p>`;
  }).join('\n');
  return { html, headings };
}

function loadPost(file) {
  const { meta, body } = parseFrontMatter(file.text);
  const { html, headings } = markdownToHtml(body);
  return {
    title: meta.title,
    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text
    slug: file.name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),   // the file name without its date
    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),
    summary: meta.summary ?? '',
    bodyHtml: html,
    headings,
    words: (body.match(/\w+/g) ?? []).length,
  };
}

const readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute

// Newest first. The posts are worked out once, when the page loads.
const POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));

// Old addresses of posts that moved. Visiting one forwards to the new post, so old links keep working.
const REDIRECTS = { 'beginner-friendly-builds': 'lordran-guide-hub', 'first-hours': 'first-hours-in-lordran' };

const SITE = { title: 'Bonfire Notes', url: 'https://theoyanvno.github.io/bonfire-notes', tagline: 'A Dark Souls fan blog' };
const escapeXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// An RSS feed: the format feed readers subscribe to, so they hear about new posts.
function rss(posts) {
  const items = posts.map((p) =>
    `<item><title>${escapeXml(p.title)}</title><link>${SITE.url}/posts/${p.slug}.html</link>`
    + `<guid>${SITE.url}/posts/${p.slug}.html</guid><pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>`
    + `<description>${escapeXml(p.summary)}</description></item>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${SITE.title}</title>`
    + `<link>${SITE.url}</link><description>${escapeXml(SITE.tagline)}</description>${items}</channel></rss>`;
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
  </article>`;

const allTags = [...new Set(POSTS_LIST.flatMap((p) => p.tags))].sort();
const tagCloud = (active) => `<nav class="tag-cloud" aria-label="Tags">
  <a href="#/" class="tag${active ? '' : ' active'}">all</a>
  ${allTags.map((t) => `<a href="#/tag/${t}" class="tag${t === active ? ' active' : ''}">${esc(t)}</a>`).join('')}</nav>`;

function homePage(tag = null) {
  const posts = tag ? POSTS_LIST.filter((p) => p.tags.includes(tag)) : POSTS_LIST;
  const top = tag ? `<h1 class="page-title">Tagged “${esc(tag)}”</h1>`
    : '<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>';
  return { title: tag ? `Tagged ${tag}` : null, html: `${top}${tagCloud(tag)}<div class="cards">${posts.map(card).join('')}</div>` };
}

function postPage(slug) {
  const i = POSTS_LIST.findIndex((p) => p.slug === slug);
  if (i < 0) return notFound();
  const post = POSTS_LIST[i];
  const newer = POSTS_LIST[i - 1];
  const older = POSTS_LIST[i + 1];
  const toc = post.headings.length > 2
    ? `<details class="toc"><summary>In this post</summary><ol>${post.headings.map((h) => `<li><a href="#/post/${post.slug}/${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>`
    : '';
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1><p class="tags">${post.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
    ${toc}
    <div class="prose">${post.bodyHtml}</div></article>
    <nav class="pager">${newer ? `<a href="#/post/${newer.slug}">← ${esc(newer.title)}</a>` : '<span></span>'}
      ${older ? `<a href="#/post/${older.slug}">${esc(older.title)} →</a>` : ''}</nav>` };
}

const notFound = () => ({ title: 'Not found', html: '<h1 class="page-title">Nothing here</h1><p>That page has gone hollow. <a href="#/">All posts</a></p>' });

function feedPage() {
  const xml = rss(POSTS_LIST);
  const url = URL.createObjectURL(new Blob([xml], { type: 'application/rss+xml' }));
  return { title: 'RSS feed', html: `<h1 class="page-title">RSS feed</h1><p><a href="${url}" download="feed.xml">Download feed.xml</a></p><pre class="feed">${esc(xml)}</pre>` };
}

// The address after # says which page to show: #/, #/post/<slug>, #/tag/<tag> or #/feed.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  if (kind === 'post' && REDIRECTS[arg]) return location.replace(`${location.href.split('#')[0]}#/post/${REDIRECTS[arg]}`);   // moved: forward, no history entry
  const page = kind === 'post' ? postPage(arg)
    : kind === 'tag' ? (allTags.includes(arg) ? homePage(arg) : notFound())
    : kind === 'feed' ? feedPage()
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  if (section) document.getElementById(section)?.scrollIntoView();   // a table-of-contents link
  else scrollTo(0, 0);
}
addEventListener('hashchange', route);
```

## Session: Atmosphere

## Step: Floating embers and a reading progress bar
time: 20

A Dark Souls blog should feel like resting at a bonfire. Behind the page, embers drift upward on a `<canvas>`.

```svg Each frame, every ember rises, sways, fades, and starts again at the bottom
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 170" font-family="sans-serif"><rect x="10" y="10" width="200" height="150" rx="6" fill="#0c0a09"/><circle cx="78" cy="40" r="3.1" fill="#fdba74" opacity="0.42"/><circle cx="33" cy="90" r="2.4" fill="#fdba74" opacity="0.64"/><circle cx="30" cy="86" r="1.6" fill="#fdba74" opacity="0.63"/><circle cx="98" cy="29" r="1.7" fill="#fdba74" opacity="0.38"/><circle cx="96" cy="127" r="1.8" fill="#fdba74" opacity="0.81"/><circle cx="60" cy="102" r="3.9" fill="#fdba74" opacity="0.69"/><circle cx="124" cy="72" r="3.9" fill="#fdba74" opacity="0.56"/><circle cx="28" cy="132" r="2.2" fill="#fdba74" opacity="0.83"/><circle cx="46" cy="35" r="2.3" fill="#fdba74" opacity="0.40"/><circle cx="167" cy="43" r="3.0" fill="#fdba74" opacity="0.44"/><circle cx="135" cy="68" r="2.9" fill="#fdba74" opacity="0.55"/><circle cx="31" cy="28" r="2.0" fill="#fdba74" opacity="0.37"/><circle cx="142" cy="76" r="2.3" fill="#fdba74" opacity="0.58"/><circle cx="125" cy="79" r="2.2" fill="#fdba74" opacity="0.60"/><circle cx="163" cy="111" r="2.1" fill="#fdba74" opacity="0.74"/><circle cx="123" cy="88" r="3.7" fill="#fdba74" opacity="0.64"/><circle cx="151" cy="57" r="4.0" fill="#fdba74" opacity="0.50"/><circle cx="41" cy="74" r="3.4" fill="#fdba74" opacity="0.58"/><circle cx="47" cy="84" r="1.6" fill="#fdba74" opacity="0.62"/><circle cx="140" cy="119" r="2.9" fill="#fdba74" opacity="0.77"/><circle cx="178" cy="61" r="3.2" fill="#fdba74" opacity="0.52"/><circle cx="127" cy="95" r="2.6" fill="#fdba74" opacity="0.67"/><circle cx="171" cy="143" r="2.7" fill="#fdba74" opacity="0.87"/><circle cx="140" cy="28" r="3.3" fill="#fdba74" opacity="0.37"/><circle cx="136" cy="149" r="3.6" fill="#fdba74" opacity="0.90"/><circle cx="71" cy="70" r="3.2" fill="#fdba74" opacity="0.56"/><path d="M110 150 C 100 120, 125 100, 110 70 C 98 45, 118 30, 110 15" fill="none" stroke="#f97316" stroke-dasharray="3 3"/><text x="225" y="34" font-size="11">each frame, every ember:</text><text x="225" y="54" font-size="11">• rises by its speed</text><text x="225" y="72" font-size="11">• sways with Math.sin(drift)</text><text x="225" y="90" font-size="11">• fades as it nears the top</text><text x="225" y="108" font-size="11">• starts again at the bottom</text><text x="225" y="134" font-size="11" fill="#475569">requestAnimationFrame runs</text><text x="225" y="150" font-size="11" fill="#475569">this about 60 times a second</text></svg>
```

Each ember is a small object: position, size, speed, a sway angle and how bright it can get. On every frame:

| Step | Code |
|---|---|
| clear the canvas | `ctx.clearRect(0, 0, w, h)` |
| move up | `e.y -= e.speed` |
| sway | `e.x += Math.sin(e.drift) * 0.4`, with `drift` growing a little each frame |
| fade near the top | brightness `= Math.min(1, e.y / h) * e.life` |
| draw a soft glow | a radial gradient from orange to transparent |
| recycle | off the top? `Object.assign(e, spawn())` puts it back at the bottom |

`requestAnimationFrame(tick)` asks the browser to run `tick` before the next screen refresh, about 60 times a second, and pauses automatically in hidden tabs. The number of embers scales with the window width (at most 70), so phones aren't overloaded. The canvas has `pointer-events: none` and sits behind the content, so it never gets in the way of clicks.

**Reduced motion.** If someone has turned off animations in their system settings, the embers never start, and CSS hides the canvas.

**Progress bar.** On post pages a thin glowing line at the top fills as you scroll: `scrollY` divided by how far the page *can* scroll (`scrollHeight - innerHeight`). The scroll listener is `{ passive: true }`, which promises the browser it won't block scrolling, so scrolling stays smooth.

### Try it

Watch the embers drift. Open a long post and scroll: the bar fills.

check: js | embers drawn on a canvas | /getContext\(\s*['"]2d['"]\s*\)/
check: js | an animation loop | /requestAnimationFrame\(\s*tick\s*\)/
check: js | no motion for people who turned it off | /prefers-reduced-motion/
check: js | a reading progress bar | /function\s+updateProgress\s*\(/

quiz: Why use requestAnimationFrame instead of setInterval for the embers?
- [x] It runs in step with the screen's refreshes and pauses in hidden tabs, so it's smoother and saves battery
- [ ] setInterval can't draw on a canvas
- [ ] It runs exactly 100 times a second
why: The browser schedules the frames, which is what animation needs.
quiz: What does the scroll listener's { passive: true } promise?
- [ ] That it runs only once
- [x] That it won't call preventDefault(), so the browser can scroll without waiting for it
- [ ] That it ignores fast scrolling
why: Passive listeners keep scrolling smooth.

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const fmtDate = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
};

const card = (p) => `
  <article class="card">
    <p class="meta"><time datetime="${p.date}">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>
    <h2><a href="#/post/${p.slug}">${esc(p.title)}</a></h2>
    <p>${esc(p.summary)}</p>
    <p class="tags">${p.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
  </article>`;

const allTags = [...new Set(POSTS_LIST.flatMap((p) => p.tags))].sort();
const tagCloud = (active) => `<nav class="tag-cloud" aria-label="Tags">
  <a href="#/" class="tag${active ? '' : ' active'}">all</a>
  ${allTags.map((t) => `<a href="#/tag/${t}" class="tag${t === active ? ' active' : ''}">${esc(t)}</a>`).join('')}</nav>`;

function homePage(tag = null) {
  const posts = tag ? POSTS_LIST.filter((p) => p.tags.includes(tag)) : POSTS_LIST;
  const top = tag ? `<h1 class="page-title">Tagged “${esc(tag)}”</h1>`
    : '<section class="hero"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>';
  return { title: tag ? `Tagged ${tag}` : null, html: `${top}${tagCloud(tag)}<div class="cards">${posts.map(card).join('')}</div>` };
}

function postPage(slug) {
  const i = POSTS_LIST.findIndex((p) => p.slug === slug);
  if (i < 0) return notFound();
  const post = POSTS_LIST[i];
  const newer = POSTS_LIST[i - 1];
  const older = POSTS_LIST[i + 1];
  const toc = post.headings.length > 2
    ? `<details class="toc"><summary>In this post</summary><ol>${post.headings.map((h) => `<li><a href="#/post/${post.slug}/${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></details>`
    : '';
  return { title: post.title, html: `<article class="post">
    <p class="meta"><time datetime="${post.date}">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>
    <h1>${esc(post.title)}</h1><p class="tags">${post.tags.map((t) => `<a href="#/tag/${t}" class="tag small">${esc(t)}</a>`).join('')}</p>
    ${toc}
    <div class="prose">${post.bodyHtml}</div></article>
    <nav class="pager">${newer ? `<a href="#/post/${newer.slug}">← ${esc(newer.title)}</a>` : '<span></span>'}
      ${older ? `<a href="#/post/${older.slug}">${esc(older.title)} →</a>` : ''}</nav>` };
}

const notFound = () => ({ title: 'Not found', html: '<h1 class="page-title">Nothing here</h1><p>That page has gone hollow. <a href="#/">All posts</a></p>' });

function feedPage() {
  const xml = rss(POSTS_LIST);
  const url = URL.createObjectURL(new Blob([xml], { type: 'application/rss+xml' }));
  return { title: 'RSS feed', html: `<h1 class="page-title">RSS feed</h1><p><a href="${url}" download="feed.xml">Download feed.xml</a></p><pre class="feed">${esc(xml)}</pre>` };
}

// The address after # says which page to show: #/, #/post/<slug>, #/tag/<tag> or #/feed.
function route() {
  const [, kind, arg, section] = /^#\/(post|tag|feed)?\/?([\w-]*)\/?([\w-]*)$/.exec(location.hash || '#/') ?? [];
  if (kind === 'post' && REDIRECTS[arg]) return location.replace(`${location.href.split('#')[0]}#/post/${REDIRECTS[arg]}`);   // moved: forward, no history entry
  const page = kind === 'post' ? postPage(arg)
    : kind === 'tag' ? (allTags.includes(arg) ? homePage(arg) : notFound())
    : kind === 'feed' ? feedPage()
    : homePage();
  $('page').innerHTML = page.html;
  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';
  if (section) document.getElementById(section)?.scrollIntoView();   // a table-of-contents link
  else scrollTo(0, 0);
  updateProgress();
}
addEventListener('hashchange', route);

// ---- floating embers: drawn on a canvas behind the page ----
(() => {
  const canvas = $('embers');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;   // no motion for people who turned it off
  const ctx = canvas.getContext('2d');
  let w, h;
  const resize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
  const spawn = (anywhere = false) => ({
    x: Math.random() * w, y: anywhere ? Math.random() * h : h + 10,
    r: Math.random() * 1.8 + 0.6, speed: Math.random() * 0.6 + 0.25,
    drift: Math.random() * Math.PI * 2, life: Math.random() * 0.6 + 0.4,
  });
  resize();
  addEventListener('resize', resize);
  const embers = Array.from({ length: Math.min(70, Math.floor(innerWidth / 18)) }, () => spawn(true));
  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    for (const e of embers) {
      e.y -= e.speed;
      e.drift += 0.02;
      e.x += Math.sin(e.drift) * 0.4;                     // a gentle side-to-side sway
      const fade = Math.min(1, e.y / h) * e.life;         // dimmer as it rises
      const glow = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
      glow.addColorStop(0, `rgba(253, 186, 116, ${fade})`);
      glow.addColorStop(1, 'rgba(249, 115, 22, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
      ctx.fill();
      if (e.y < -10) Object.assign(e, spawn());           // off the top: start again at the bottom
    }
    requestAnimationFrame(tick);
  };
  tick();
})();

// ---- reading progress bar: how far down the page you've scrolled ----
function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  $('progress').style.width = location.hash.startsWith('#/post/') && max > 0 ? `${(scrollY / max) * 100}%` : '0';
}
addEventListener('scroll', updateProgress, { passive: true });
```

## Finish

### What you learned

- Posts as text files with a front matter block, parsed with one regular expression
- Slugs from file names, reading time, and sorting by date strings
- A safe Markdown converter: escape first, allowlisted links, lists, tables and heading ids
- A table of contents from the post's own headings
- Hash routing for home, post, tag, feed and not-found pages, with newer and older links
- An RSS feed, and redirects that keep old links working
- A canvas particle animation and a scroll progress bar, both respecting reduced motion

### Challenges

1. **Blockquotes:** make blocks whose lines start with `> ` into `<blockquote>`.
2. **Search:** add a box that filters the cards by title and summary as you type.
3. **Code spans:** turn `` `text` `` into `<code>text</code>` (escape first, as always).
4. **Same-day order:** add an optional `time:` field and sort posts by date, then time.
5. **Link checker:** at load time, find every `#/post/…` link in every post and warn in the console if it points nowhere.

Compare yours with the [live blog](https://theoyanvno.github.io/bonfire-notes/) and the [source code](https://github.com/TheoYanvno/bonfire-notes).
