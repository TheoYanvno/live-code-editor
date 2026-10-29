// Built from guides/bonfire.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "bonfire",
 "title": "Bonfire Notes (blog)",
 "goals": [
  "Read posts written as Markdown files with a front matter block",
  "Turn Markdown into HTML safely, including lists, tables and heading links",
  "Build a home page, post pages, tag pages and newer/older links from data",
  "Route between pages with the address after #",
  "Generate an RSS feed and forward old links to moved posts",
  "Draw an animated canvas background that respects reduced motion"
 ],
 "prereqs": [
  "HTML, CSS and JavaScript basics (functions, arrays, objects)",
  "Template literals and array map, filter and sort",
  "Regular expressions help (each one is explained)"
 ],
 "sessions": [
  {
   "title": "Posts as text",
   "from": 0,
   "to": 2
  },
  {
   "title": "From Markdown to HTML",
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
   "site": "",
   "ui": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "A post is a text file",
   "body": "Welcome! In this guide you'll rebuild my Dark Souls fan blog, [Bonfire Notes](https://theoyanvno.github.io/bonfire-notes/): posts written in Markdown, turned into a dark-themed site with tag pages, a table of contents on each post, an RSS feed and floating embers.\n\nThe real blog is a **static site generator**: a Python script reads Markdown files and writes HTML pages, which GitHub Pages serves. In this guide the same steps run in the browser, so you can see the result as you type. The last step shows the Python version.\n\nEvery post is a text file in two parts:\n\n```svg A post file: front matter on top, Markdown below\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 190\" font-family=\"sans-serif\"><rect x=\"10\" y=\"10\" width=\"250\" height=\"170\" rx=\"6\" fill=\"#171311\" stroke=\"#d6a756\"/><text x=\"22\" y=\"32\" font-size=\"11\" fill=\"#d6a756\" font-family=\"monospace\">---</text><text x=\"22\" y=\"48\" font-size=\"11\" fill=\"#e7e0d6\" font-family=\"monospace\">title: Boss Guide 2: Taurus Demon</text><text x=\"22\" y=\"64\" font-size=\"11\" fill=\"#e7e0d6\" font-family=\"monospace\">date: 2026-10-09</text><text x=\"22\" y=\"80\" font-size=\"11\" fill=\"#e7e0d6\" font-family=\"monospace\">tags: guide, bosses</text><text x=\"22\" y=\"96\" font-size=\"11\" fill=\"#e7e0d6\" font-family=\"monospace\">summary: A huge demon on…</text><text x=\"22\" y=\"112\" font-size=\"11\" fill=\"#d6a756\" font-family=\"monospace\">---</text><text x=\"22\" y=\"134\" font-size=\"11\" fill=\"#a8998a\" font-family=\"monospace\">The Taurus Demon is the first…</text><text x=\"22\" y=\"150\" font-size=\"11\" fill=\"#a8998a\" font-family=\"monospace\">## Before the fog</text><line x1=\"262\" y1=\"70\" x2=\"290\" y2=\"70\" stroke=\"#475569\" stroke-width=\"2\"/><text x=\"296\" y=\"66\" font-size=\"11\">front matter:</text><text x=\"296\" y=\"80\" font-size=\"11\">key: value lines</text><line x1=\"262\" y1=\"142\" x2=\"290\" y2=\"142\" stroke=\"#475569\" stroke-width=\"2\"/><text x=\"296\" y=\"138\" font-size=\"11\">the body: Markdown</text><text x=\"296\" y=\"152\" font-size=\"11\">turned into HTML</text></svg>\n```\n\nThe **front matter** is a block between two `---` lines with `key: value` lines: the title, date, tags and a one-sentence summary. Everything after it is the **body**, written in Markdown.\n\n`parseFrontMatter(raw)` splits the two with one regular expression:\n\n| Part of the pattern | Matches |\n|---|---|\n| `^---\\s*\\n` | the opening `---` line at the very start |\n| `([\\s\\S]*?)` | the front matter lines (as few as possible) |\n| `\\n---\\s*\\n` | the closing `---` line |\n| `([\\s\\S]*)$` | everything else: the body |\n\nThen each line is split at its **first** colon only, so a title like `Boss Guide 2: Taurus Demon` keeps its colon. A post without the block, or without a title or date, throws an `Error` with a message that says exactly what's missing: when you have dozens of posts, that tells you which file to fix.\n\nFor this guide, the \"files\" are an array of `{ name, text }` objects in the `site` block. Four real posts from the blog are included, shortened.",
   "checks": [
    {
     "pane": "js",
     "label": "the posts as files",
     "test": "/const\\s+FILES\\s*=\\s*\\[/"
    },
    {
     "pane": "js",
     "label": "a parseFrontMatter() function",
     "test": "/function\\s+parseFrontMatter\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "only the first colon splits",
     "test": "/line\\.indexOf\\(\\s*['\"]:['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "a title and date are required",
     "test": "/for\\s*\\(\\s*const\\s+required\\s+of\\s+\\[\\s*['\"]title['\"]\\s*,\\s*['\"]date['\"]\\s*\\]\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why split each front matter line at the first colon only?",
     "options": [
      "Splitting is faster that way",
      "So values like \"Boss Guide 2: Taurus Demon\" keep their own colons",
      "Keys can't contain letters"
     ],
     "answer": 1,
     "why": "Everything after the first colon is the value, whatever it contains."
    },
    {
     "q": "Why throw an error naming the missing field instead of skipping a broken post?",
     "options": [
      "Errors make the site faster",
      "A post silently missing from the site is hard to notice; a clear error says which file to fix",
      "Skipping is not possible in JavaScript"
     ],
     "answer": 1,
     "why": "Failing loudly at build time beats a quiet gap readers find first."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<canvas id=\"embers\" aria-hidden=\"true\"></canvas>\n<div id=\"progress\" class=\"progress\" aria-hidden=\"true\"></div>\n<header class=\"site-head\">\n  <a class=\"brand\" href=\"#/\"><span class=\"flame\" aria-hidden=\"true\"></span>Bonfire Notes</a>\n  <nav>\n    <a href=\"#/\">Posts</a>\n    <a href=\"#/feed\">RSS</a>\n  </nav>\n</header>\n<main id=\"page\" class=\"wrap\"></main>\n<footer class=\"site-foot\">\n  <p>Bonfire Notes is an unofficial fan blog. Dark Souls is a trademark of its owners; this site is not affiliated with FromSoftware or Bandai Namco.</p>\n</footer>"
   },
   "css": {
    "base": ":root { --bg: #0c0a09; --panel: #171311; --text: #e7e0d6; --muted: #a8998a; --ember: #f97316; --gold: #d6a756; --line: #2b231e; }\n* { box-sizing: border-box; }\nhtml { background: var(--bg); }\nbody { margin: 0; color: var(--text); font-family: Georgia, \"Iowan Old Style\", serif; line-height: 1.7;\n       background: radial-gradient(ellipse at 50% 120%, rgba(249, 115, 22, .18), transparent 60%), var(--bg); min-height: 100vh; }\n#embers { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }\n.site-head, .wrap, .site-foot { position: relative; z-index: 1; }\na { color: var(--gold); }\n.site-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; padding: 18px 24px; border-bottom: 1px solid var(--line); }\n.brand { display: flex; align-items: center; gap: 10px; color: var(--text); text-decoration: none; font-size: 1.3rem; letter-spacing: .12em; text-transform: uppercase; }\n.flame { width: 14px; height: 22px; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: radial-gradient(circle at 50% 70%, #fde68a, #f97316 45%, #9a3412 80%);\n         box-shadow: 0 0 14px #f97316; animation: flicker 1.6s infinite alternate; }\nnav { display: flex; gap: 18px; font-family: system-ui, sans-serif; font-size: .9rem; }\nnav a { color: var(--muted); text-decoration: none; }\n.wrap { max-width: 760px; margin: 0 auto; padding: 24px 20px 60px; }\n.hero { text-align: center; padding: 48px 0 24px; }\n.hero h1 { font-size: clamp(2.2rem, 7vw, 3.6rem); margin: 0; font-weight: normal; letter-spacing: .04em; text-shadow: 0 0 30px rgba(249, 115, 22, .35); }\n.hero p, .muted { color: var(--muted); }\n.page-title { font-weight: normal; }\n.tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 10px 0 28px; }\n.tag { font-family: system-ui, sans-serif; font-size: .8rem; text-decoration: none; color: var(--muted); border: 1px solid var(--line); border-radius: 999px; padding: 3px 12px; }\n.tag.active, .tag:hover { color: var(--bg); background: var(--gold); border-color: var(--gold); }\n.tag.small { font-size: .72rem; padding: 1px 8px; }\n.cards { display: grid; gap: 18px; }\n.card { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 22px 24px; }\n.card h2 { margin: 4px 0 6px; font-weight: normal; font-size: 1.45rem; }\n.card h2 a { color: var(--text); text-decoration: none; }\n.card p { margin: 0; color: #cfc6ba; }\n.meta { font-family: system-ui, sans-serif; font-size: .78rem; color: var(--muted); text-transform: uppercase; letter-spacing: .08em; }\n.tags { display: flex; gap: 6px; margin-top: 10px !important; flex-wrap: wrap; }\n.post h1 { font-weight: normal; font-size: clamp(1.9rem, 5vw, 2.6rem); line-height: 1.2; margin: 6px 0 10px; }\n.prose { font-size: 1.08rem; }\n.prose h2 { font-weight: normal; color: var(--gold); margin-top: 2em; border-bottom: 1px solid var(--line); padding-bottom: 4px; }\n.prose strong { color: #fff; }\n.prose table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-family: system-ui, sans-serif; font-size: .88rem; }\n.prose th, .prose td { border-bottom: 1px solid var(--line); padding: 7px 10px; text-align: left; vertical-align: top; }\n.prose th { color: var(--gold); font-weight: 600; background: var(--panel); }\n.raw { white-space: pre-wrap; font-size: .9rem; color: var(--muted); }\n.toc { background: var(--panel); border: 1px solid var(--line); border-radius: 6px; padding: 10px 16px; margin: 18px 0; font-family: system-ui, sans-serif; font-size: .9rem; }\n.toc summary { cursor: pointer; color: var(--muted); }\n.pager { display: flex; justify-content: space-between; gap: 16px; margin-top: 40px; padding-top: 18px; border-top: 1px solid var(--line); font-family: system-ui, sans-serif; font-size: .9rem; }\n.feed { white-space: pre-wrap; word-break: break-all; font-size: .8rem; background: var(--panel); padding: 12px; border-radius: 6px; }\n.progress { position: fixed; top: 0; left: 0; height: 3px; width: 0; background: linear-gradient(90deg, #9a3412, var(--ember), #fde68a); z-index: 10; box-shadow: 0 0 8px var(--ember); }\n.site-foot { text-align: center; color: var(--muted); font-family: system-ui, sans-serif; font-size: .78rem; padding: 24px 16px 40px; border-top: 1px solid var(--line); }\n@keyframes flicker { from { transform: scale(1) rotate(-2deg); opacity: .9; } to { transform: scale(1.08, 1.15) rotate(2deg); opacity: 1; } }\n@media (prefers-reduced-motion: reduce) { * { animation: none !important; } #embers { display: none; } }"
   },
   "js": {
    "site": "// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)\nconst FILES = [\n  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---\ntitle: Why Dark Souls Still Matters\ndate: 2026-09-28\ntags: opinion, history\nsummary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.\n---\n\nWhen **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.\n\n## A world that folds back on itself\n\nYou spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.\n\n## Difficulty with a purpose\n\nDark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.\n\n## Strangers who help\n\nPlayers can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },\n\n  { name: '2026-09-29-first-hours-in-lordran.md', text: `---\ntitle: Your First Hours in Lordran: Beginner Tips\ndate: 2026-09-29\ntags: guide, beginner\nsummary: The things I wish someone had told me before my first trip through the Undead Burg.\n---\n\nThe first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.\n\n## Bonfires are checkpoints with a cost\n\nResting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.\n\n## Your souls are waiting where you fell\n\nWhen you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.\n\n## Watch your stamina, not your health\n\n- Attacking, rolling, running and blocking all use stamina.\n- The most common beginner death is swinging until the bar is empty.\n- Always keep a little in reserve to roll away.` },\n\n  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---\ntitle: Boss Guide 2: Taurus Demon\ndate: 2026-10-09\ntags: guide, bosses\nsummary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.\n---\n\nThe Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.\n\n| | |\n|---|---|\n| **Where** | The long stone wall in the Undead Burg |\n| **Weak to** | Plunging attacks, fire (firebombs) |\n\n## The trick: the ladder\n\n1. **Turn around and run back** to the tower you came from.\n2. **Climb the ladder** inside the tower to the top.\n3. Wait for the demon to walk underneath you, then **drop down and attack**.\n\n## Its attacks\n\n| Attack | What it looks like | How to avoid it |\n|---|---|---|\n| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |\n| Wide swing | Big horizontal swing | Roll through it toward its body |\n| Leap | Jumps into the air and lands on you | Run sideways or forward under it |\n\nBack to the [guides hub](#/post/lordran-guide-hub).` },\n\n  { name: '2026-10-15-lordran-guide-hub.md', text: `---\ntitle: Start Here: Lordran Guides Hub\ndate: 2026-10-15\ntags: guide, beginner\nsummary: Every guide on the blog in one place, in the order you'll need them.\n---\n\nNew to Dark Souls? Start with the tips, then take on the first big boss.\n\n| Guide | What it covers |\n|---|---|\n| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |\n| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |\n\n*More guides are on the way.*` },\n];\n// Reads the '---' block at the top of a post into an object, and returns the rest as the body.\nfunction parseFrontMatter(raw) {\n  const match = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/.exec(raw);\n  if (!match) throw new Error('Post is missing its --- front matter block');\n  const meta = {};\n  for (const line of match[1].split('\\n')) {\n    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons\n    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();\n  }\n  for (const required of ['title', 'date']) {\n    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);\n  }\n  return { meta, body: match[2] };\n}\n",
    "go": "// the list above is drawn as soon as the code runs"
   }
  },
  {
   "title": "Slugs, reading time and order",
   "body": "Each post needs an address. Its **slug** comes from the file name, minus the date and `.md`:\n\n```svg The slug is the file name without its date\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 120\" font-family=\"sans-serif\"><rect x=\"10\" y=\"15\" width=\"410\" height=\"30\" rx=\"6\" fill=\"#e2e8f0\"/><text x=\"20\" y=\"35\" font-size=\"12\" font-family=\"monospace\"><tspan fill=\"#94a3b8\">2026-10-09-</tspan><tspan fill=\"#1d4ed8\" font-weight=\"700\">taurus-demon-boss-guide</tspan><tspan fill=\"#94a3b8\">.md</tspan></text><line x1=\"200\" y1=\"45\" x2=\"200\" y2=\"70\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"70\" y=\"72\" width=\"290\" height=\"30\" rx=\"6\" fill=\"#bbf7d0\"/><text x=\"215\" y=\"92\" text-anchor=\"middle\" font-size=\"12\" font-family=\"monospace\">#/post/taurus-demon-boss-guide</text><text x=\"215\" y=\"116\" text-anchor=\"middle\" font-size=\"10\" fill=\"#475569\">the date prefix is dropped, so the address stays the same if the date changes</text></svg>\n```\n\nDropping the date means a post's address doesn't change if you fix its date later. The real blog writes it to `posts/taurus-demon-boss-guide.html`; in this guide it becomes `#/post/taurus-demon-boss-guide`.\n\n`slugify(text)` turns tags (and later, headings) into the same safe form: lowercase, only letters, digits and dashes. \"Ornstein & Smough: A Guide!\" becomes `ornstein-smough-a-guide`.\n\n`loadPost(file)` builds one post object:\n\n| Field | From |\n|---|---|\n| `title`, `date`, `summary` | the front matter |\n| `slug` | the file name |\n| `tags` | `guide, bosses` split at commas, each slugified |\n| `words` | counting `\\w+` matches in the body |\n\n**Reading time** is the word count divided by 220 (a typical reading speed), rounded **up**, and never less than 1 minute: `Math.max(1, Math.ceil(words / 220))`.\n\n**Order.** Dates are `YYYY-MM-DD` text, so they sort correctly as strings, and `b.date.localeCompare(a.date)` puts the newest first. `POSTS_LIST` is worked out once when the page loads.\n\n### Try it\n\nThe page lists every loaded post with its date, reading time and slug, newest first.",
   "checks": [
    {
     "pane": "js",
     "label": "a slugify() helper",
     "test": "/const\\s+slugify\\s*=/"
    },
    {
     "pane": "js",
     "label": "the slug drops the date",
     "test": "/replace\\(\\s*\\/\\^\\\\d\\{4\\}-\\\\d\\{2\\}-\\\\d\\{2\\}-\\//"
    },
    {
     "pane": "js",
     "label": "reading time, at least a minute",
     "test": "/Math\\.max\\(\\s*1\\s*,\\s*Math\\.ceil\\(\\s*post\\.words\\s*\\/\\s*220\\s*\\)\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "newest first",
     "test": "/b\\.date\\.localeCompare\\(\\s*a\\.date\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "A post has 450 words. What reading time does it show?",
     "options": [
      "2 min",
      "3 min, because 450 / 220 is about 2.05 and Math.ceil rounds up",
      "0 min"
     ],
     "answer": 1,
     "why": "Rounding up means a reader is never told a post is shorter than it is."
    },
    {
     "q": "Why do \"YYYY-MM-DD\" dates sort correctly as plain text?",
     "options": [
      "The year comes first and every part is zero-padded, so text order matches date order",
      "JavaScript converts them to numbers",
      "They don't; a date library is needed"
     ],
     "answer": 0,
     "why": "\"2026-09-29\" < \"2026-10-09\" character by character, just like the dates."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "site": "// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)\nconst FILES = [\n  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---\ntitle: Why Dark Souls Still Matters\ndate: 2026-09-28\ntags: opinion, history\nsummary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.\n---\n\nWhen **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.\n\n## A world that folds back on itself\n\nYou spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.\n\n## Difficulty with a purpose\n\nDark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.\n\n## Strangers who help\n\nPlayers can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },\n\n  { name: '2026-09-29-first-hours-in-lordran.md', text: `---\ntitle: Your First Hours in Lordran: Beginner Tips\ndate: 2026-09-29\ntags: guide, beginner\nsummary: The things I wish someone had told me before my first trip through the Undead Burg.\n---\n\nThe first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.\n\n## Bonfires are checkpoints with a cost\n\nResting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.\n\n## Your souls are waiting where you fell\n\nWhen you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.\n\n## Watch your stamina, not your health\n\n- Attacking, rolling, running and blocking all use stamina.\n- The most common beginner death is swinging until the bar is empty.\n- Always keep a little in reserve to roll away.` },\n\n  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---\ntitle: Boss Guide 2: Taurus Demon\ndate: 2026-10-09\ntags: guide, bosses\nsummary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.\n---\n\nThe Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.\n\n| | |\n|---|---|\n| **Where** | The long stone wall in the Undead Burg |\n| **Weak to** | Plunging attacks, fire (firebombs) |\n\n## The trick: the ladder\n\n1. **Turn around and run back** to the tower you came from.\n2. **Climb the ladder** inside the tower to the top.\n3. Wait for the demon to walk underneath you, then **drop down and attack**.\n\n## Its attacks\n\n| Attack | What it looks like | How to avoid it |\n|---|---|---|\n| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |\n| Wide swing | Big horizontal swing | Roll through it toward its body |\n| Leap | Jumps into the air and lands on you | Run sideways or forward under it |\n\nBack to the [guides hub](#/post/lordran-guide-hub).` },\n\n  { name: '2026-10-15-lordran-guide-hub.md', text: `---\ntitle: Start Here: Lordran Guides Hub\ndate: 2026-10-15\ntags: guide, beginner\nsummary: Every guide on the blog in one place, in the order you'll need them.\n---\n\nNew to Dark Souls? Start with the tips, then take on the first big boss.\n\n| Guide | What it covers |\n|---|---|\n| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |\n| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |\n\n*More guides are on the way.*` },\n];\n// Reads the '---' block at the top of a post into an object, and returns the rest as the body.\nfunction parseFrontMatter(raw) {\n  const match = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/.exec(raw);\n  if (!match) throw new Error('Post is missing its --- front matter block');\n  const meta = {};\n  for (const line of match[1].split('\\n')) {\n    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons\n    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();\n  }\n  for (const required of ['title', 'date']) {\n    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);\n  }\n  return { meta, body: match[2] };\n}\n\n// \"Ornstein & Smough: A Guide!\" -> \"ornstein-smough-a-guide\"\nconst slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/[\\s-]+/g, '-').replace(/^-|-$/g, '');\n\nfunction loadPost(file) {\n  const { meta, body } = parseFrontMatter(file.text);\n  return {\n    title: meta.title,\n    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text\n    slug: file.name.replace(/^\\d{4}-\\d{2}-\\d{2}-/, '').replace(/\\.md$/, ''),   // the file name without its date\n    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),\n    summary: meta.summary ?? '',\n    body,\n    words: (body.match(/\\w+/g) ?? []).length,\n  };\n}\n\nconst readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute\n\n// Newest first. The posts are worked out once, when the page loads.\nconst POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));",
    "ui": "const $ = (id) => document.getElementById(id);\nconst fmtDate = (key) => {\n  const [y, m, d] = key.split('-').map(Number);\n  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });\n};\n\n// For now, just list what was loaded.\n$('page').innerHTML = '<ol>' + POSTS_LIST.map((p) =>\n  `<li>${p.title} · ${fmtDate(p.date)} · ${readingMinutes(p)} min · ${p.slug}</li>`).join('') + '</ol>';"
   }
  },
  {
   "title": "A home page and a page for each post",
   "body": "Now the blog gets real pages, all drawn from `POSTS_LIST`:\n\n- **Home:** a welcome banner, then a card per post: date, reading time, title link, summary and tags.\n- **Post:** the title, date and the body. For now the body is shown as plain text; the next session turns its Markdown into HTML.\n\n**One page, many addresses.** The part of the address after `#` (the *hash*) can change without loading a new page, and the browser fires a `hashchange` event when it does. `route()` reads it and decides what to show:\n\n| Address | Page |\n|---|---|\n| `#/` (or nothing) | home |\n| `#/post/taurus-demon-boss-guide` | that post |\n| `#/post/` with a slug that doesn't exist | \"Post not found\" |\n\nLinks are ordinary `<a href=\"#/post/…\">` links, so the Back button, bookmarks and opening in a new tab all work, which is why this beats changing the page in an `onclick`.\n\n**Escaping.** Titles and summaries go into HTML through `esc()`, which turns `<`, `>`, `&` and `\"` into their HTML codes. These posts are your own writing, but a title with `<` in it would otherwise break the page.\n\n### Try it\n\nClick a post title; press Back; change the address to a slug that doesn't exist.",
   "checks": [
    {
     "pane": "js",
     "label": "a card for each post",
     "test": "/const\\s+card\\s*=\\s*\\(\\s*p\\s*\\)\\s*=>/"
    },
    {
     "pane": "js",
     "label": "a home page",
     "test": "/function\\s+homePage\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a page for one post",
     "test": "/function\\s+postPage\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "pages follow the address",
     "test": "/addEventListener\\(\\s*['\"]hashchange['\"]\\s*,\\s*route\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why use links to #/post/… instead of onclick handlers that redraw the page?",
     "options": [
      "Hash links are faster",
      "The address changes, so Back, bookmarks and new tabs work like on any website",
      "onclick doesn't work on links"
     ],
     "answer": 1,
     "why": "route() runs for every address change, however it happened."
    },
    {
     "q": "What does route() do with #/post/does-not-exist?",
     "options": [
      "Crashes",
      "postPage() finds no post and returns a \"Post not found\" page",
      "Shows the first post"
     ],
     "answer": 1,
     "why": "Every address gets a sensible page, including wrong ones."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "ui": "const $ = (id) => document.getElementById(id);\nconst esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\nconst fmtDate = (key) => {\n  const [y, m, d] = key.split('-').map(Number);\n  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });\n};\n\nconst card = (p) => `\n  <article class=\"card\">\n    <p class=\"meta\"><time datetime=\"${p.date}\">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>\n    <h2><a href=\"#/post/${p.slug}\">${esc(p.title)}</a></h2>\n    <p>${esc(p.summary)}</p>\n    <p class=\"tags\">${p.tags.map((t) => `<span class=\"tag small\">${esc(t)}</span>`).join('')}</p>\n  </article>`;\n\nfunction homePage() {\n  return { title: null, html: `<section class=\"hero\"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>\n    <div class=\"cards\">${POSTS_LIST.map(card).join('')}</div>` };\n}\n\nfunction postPage(slug) {\n  const post = POSTS_LIST.find((p) => p.slug === slug);\n  if (!post) return { title: 'Not found', html: '<h1 class=\"page-title\">Post not found</h1><p><a href=\"#/\">All posts</a></p>' };\n  return { title: post.title, html: `<article class=\"post\">\n    <p class=\"meta\"><time datetime=\"${post.date}\">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>\n    <h1>${esc(post.title)}</h1>\n    <pre class=\"raw\">${esc(post.body)}</pre></article>\n  ` };\n}\n\n// The address after # says which page to show: #/, #/post/<slug>.\nfunction route() {\n  const [, kind, arg, section] = /^#\\/(post|tag|feed)?\\/?([\\w-]*)\\/?([\\w-]*)$/.exec(location.hash || '#/') ?? [];\n  const page = kind === 'post' ? postPage(arg)\n    : homePage();\n  $('page').innerHTML = page.html;\n  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';\n  scrollTo(0, 0);\n}\naddEventListener('hashchange', route);",
    "go": "route();"
   }
  },
  {
   "title": "Headings, paragraphs and inline styles",
   "body": "Markdown is plain text with a few conventions, and turning it into HTML is the heart of any blog engine. This one works in **blocks**: the body is split at blank lines, and each block becomes one HTML element.\n\n```svg Markdown blocks and the HTML each one becomes\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 166\" font-family=\"sans-serif\"><rect x=\"8\" y=\"12\" width=\"170\" height=\"26\" rx=\"5\" fill=\"#171311\"/><text x=\"16\" y=\"29\" font-size=\"10\" fill=\"#e7e0d6\" font-family=\"monospace\">## Before the fog</text><line x1=\"178\" y1=\"25\" x2=\"196\" y2=\"25\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"196\" y=\"12\" width=\"226\" height=\"26\" rx=\"5\" fill=\"#e2e8f0\"/><text x=\"204\" y=\"29\" font-size=\"10\" font-family=\"monospace\">&lt;h2 id=\"before-the-fog\"&gt;…&lt;/h2&gt;</text><rect x=\"8\" y=\"46\" width=\"170\" height=\"26\" rx=\"5\" fill=\"#171311\"/><text x=\"16\" y=\"63\" font-size=\"10\" fill=\"#e7e0d6\" font-family=\"monospace\">**Kill the archers** first</text><line x1=\"178\" y1=\"59\" x2=\"196\" y2=\"59\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"196\" y=\"46\" width=\"226\" height=\"26\" rx=\"5\" fill=\"#e2e8f0\"/><text x=\"204\" y=\"63\" font-size=\"10\" font-family=\"monospace\">&lt;p&gt;&lt;strong&gt;Kill the archers&lt;/strong&gt; first&lt;/p&gt;</text><rect x=\"8\" y=\"80\" width=\"170\" height=\"26\" rx=\"5\" fill=\"#171311\"/><text x=\"16\" y=\"97\" font-size=\"10\" fill=\"#e7e0d6\" font-family=\"monospace\">1. Run back</text><line x1=\"178\" y1=\"93\" x2=\"196\" y2=\"93\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"196\" y=\"80\" width=\"226\" height=\"26\" rx=\"5\" fill=\"#e2e8f0\"/><text x=\"204\" y=\"97\" font-size=\"10\" font-family=\"monospace\">&lt;ol&gt;&lt;li&gt;Run back&lt;/li&gt;&lt;/ol&gt;</text><rect x=\"8\" y=\"114\" width=\"170\" height=\"26\" rx=\"5\" fill=\"#171311\"/><text x=\"16\" y=\"131\" font-size=\"10\" fill=\"#e7e0d6\" font-family=\"monospace\">| Attack | Avoid |</text><line x1=\"178\" y1=\"127\" x2=\"196\" y2=\"127\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"196\" y=\"114\" width=\"226\" height=\"26\" rx=\"5\" fill=\"#e2e8f0\"/><text x=\"204\" y=\"131\" font-size=\"10\" font-family=\"monospace\">&lt;table&gt;…&lt;/table&gt;</text><text x=\"215\" y=\"156\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">text is escaped first, so only the Markdown rules can make HTML</text></svg>\n```\n\n| Markdown | HTML |\n|---|---|\n| `## Before the fog` (one line) | `<h2>` (and `###` gives `<h3>`) |\n| any other block | `<p>`, with its lines joined |\n| `**bold**` | `<strong>bold</strong>` |\n| `*italic*` | `<em>italic</em>` |\n| `[label](#/post/slug)` | `<a href=\"#/post/slug\">label</a>` |\n\n**Escape first, then convert.** `inline()` escapes the line *before* applying the rules. So any `<` someone typed becomes `&lt;`, and the only tags on the page are the ones the rules create. If it converted first and escaped after, it would escape its own `<strong>` tags too; if it never escaped, a post could contain a `<script>`.\n\n**Safe links.** A link is only made if its address starts with `http://`, `https://` or `#/`. Otherwise the label is shown as plain text. That blocks addresses like `javascript:…`, which would run code when clicked.\n\nThe `.+?` in the patterns is **lazy**: it matches as little as possible, so `**a** and **b**` becomes two bold words, not one bold stretch from the first `**` to the last.\n\n### Try it\n\nOpen a post: headings, bold text and links now render. Add a line with `<b>hi</b>` to a post's text: it shows the tags as text.",
   "checks": [
    {
     "pane": "js",
     "label": "escaping comes first",
     "test": "/return\\s+escapeHtml\\(\\s*text\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "bold text",
     "test": "/<strong>\\$1<\\/strong>/"
    },
    {
     "pane": "js",
     "label": "only safe links become links",
     "test": "/\\^\\(https\\?:\\\\\\/\\\\\\/\\|#\\\\\\/\\)/"
    },
    {
     "pane": "js",
     "label": "a markdownToHtml() function",
     "test": "/function\\s+markdownToHtml\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why does inline() escape the text before applying the Markdown rules?",
     "options": [
      "So typed HTML can't become real tags, while the rules can still add their own",
      "Escaping is faster on short strings",
      "Markdown requires it"
     ],
     "answer": 0,
     "why": "The order matters: escape, then convert, so only the converter can create HTML."
    },
    {
     "q": "What happens to [click me](javascript:alert(1))?",
     "options": [
      "It becomes a link that runs the code",
      "No link is made: the label is shown as plain text, because the address isn't http(s) or #/",
      "The whole post is hidden"
     ],
     "answer": 1,
     "why": "An allowlist of address starts keeps dangerous link types out."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "site": "// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)\nconst FILES = [\n  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---\ntitle: Why Dark Souls Still Matters\ndate: 2026-09-28\ntags: opinion, history\nsummary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.\n---\n\nWhen **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.\n\n## A world that folds back on itself\n\nYou spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.\n\n## Difficulty with a purpose\n\nDark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.\n\n## Strangers who help\n\nPlayers can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },\n\n  { name: '2026-09-29-first-hours-in-lordran.md', text: `---\ntitle: Your First Hours in Lordran: Beginner Tips\ndate: 2026-09-29\ntags: guide, beginner\nsummary: The things I wish someone had told me before my first trip through the Undead Burg.\n---\n\nThe first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.\n\n## Bonfires are checkpoints with a cost\n\nResting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.\n\n## Your souls are waiting where you fell\n\nWhen you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.\n\n## Watch your stamina, not your health\n\n- Attacking, rolling, running and blocking all use stamina.\n- The most common beginner death is swinging until the bar is empty.\n- Always keep a little in reserve to roll away.` },\n\n  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---\ntitle: Boss Guide 2: Taurus Demon\ndate: 2026-10-09\ntags: guide, bosses\nsummary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.\n---\n\nThe Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.\n\n| | |\n|---|---|\n| **Where** | The long stone wall in the Undead Burg |\n| **Weak to** | Plunging attacks, fire (firebombs) |\n\n## The trick: the ladder\n\n1. **Turn around and run back** to the tower you came from.\n2. **Climb the ladder** inside the tower to the top.\n3. Wait for the demon to walk underneath you, then **drop down and attack**.\n\n## Its attacks\n\n| Attack | What it looks like | How to avoid it |\n|---|---|---|\n| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |\n| Wide swing | Big horizontal swing | Roll through it toward its body |\n| Leap | Jumps into the air and lands on you | Run sideways or forward under it |\n\nBack to the [guides hub](#/post/lordran-guide-hub).` },\n\n  { name: '2026-10-15-lordran-guide-hub.md', text: `---\ntitle: Start Here: Lordran Guides Hub\ndate: 2026-10-15\ntags: guide, beginner\nsummary: Every guide on the blog in one place, in the order you'll need them.\n---\n\nNew to Dark Souls? Start with the tips, then take on the first big boss.\n\n| Guide | What it covers |\n|---|---|\n| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |\n| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |\n\n*More guides are on the way.*` },\n];\n// Reads the '---' block at the top of a post into an object, and returns the rest as the body.\nfunction parseFrontMatter(raw) {\n  const match = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/.exec(raw);\n  if (!match) throw new Error('Post is missing its --- front matter block');\n  const meta = {};\n  for (const line of match[1].split('\\n')) {\n    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons\n    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();\n  }\n  for (const required of ['title', 'date']) {\n    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);\n  }\n  return { meta, body: match[2] };\n}\n\n// \"Ornstein & Smough: A Guide!\" -> \"ornstein-smough-a-guide\"\nconst slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/[\\s-]+/g, '-').replace(/^-|-$/g, '');\n\nconst escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n\n// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these\n// rules make, and links may only go to http(s) addresses or pages on this site.\nfunction inline(text) {\n  return escapeHtml(text)\n    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')\n    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')\n    .replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g, (m, label, url) => (/^(https?:\\/\\/|#\\/)/.test(url) ? `<a href=\"${url}\">${label}</a>` : label));\n}\n\n// Blocks are separated by blank lines; each block becomes a heading, a list, a table or a paragraph.\nfunction markdownToHtml(md) {\n  const html = md.trim().split(/\\n\\s*\\n/).map((block) => {\n    const lines = block.split('\\n');\n    const heading = /^(#{2,3})\\s+(.+)$/.exec(block);\n    if (heading && lines.length === 1) {\n      const level = heading[1].length;\n      return `<h${level}>${inline(heading[2])}</h${level}>`;\n    }\n    return `<p>${lines.map(inline).join(' ')}</p>`;\n  }).join('\\n');\n  return html;\n}\n\nfunction loadPost(file) {\n  const { meta, body } = parseFrontMatter(file.text);\n  return {\n    title: meta.title,\n    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text\n    slug: file.name.replace(/^\\d{4}-\\d{2}-\\d{2}-/, '').replace(/\\.md$/, ''),   // the file name without its date\n    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),\n    summary: meta.summary ?? '',\n    bodyHtml: markdownToHtml(body),\n    words: (body.match(/\\w+/g) ?? []).length,\n  };\n}\n\nconst readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute\n\n// Newest first. The posts are worked out once, when the page loads.\nconst POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));",
    "ui": "const $ = (id) => document.getElementById(id);\nconst esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\nconst fmtDate = (key) => {\n  const [y, m, d] = key.split('-').map(Number);\n  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });\n};\n\nconst card = (p) => `\n  <article class=\"card\">\n    <p class=\"meta\"><time datetime=\"${p.date}\">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>\n    <h2><a href=\"#/post/${p.slug}\">${esc(p.title)}</a></h2>\n    <p>${esc(p.summary)}</p>\n    <p class=\"tags\">${p.tags.map((t) => `<span class=\"tag small\">${esc(t)}</span>`).join('')}</p>\n  </article>`;\n\nfunction homePage() {\n  return { title: null, html: `<section class=\"hero\"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>\n    <div class=\"cards\">${POSTS_LIST.map(card).join('')}</div>` };\n}\n\nfunction postPage(slug) {\n  const post = POSTS_LIST.find((p) => p.slug === slug);\n  if (!post) return { title: 'Not found', html: '<h1 class=\"page-title\">Post not found</h1><p><a href=\"#/\">All posts</a></p>' };\n  return { title: post.title, html: `<article class=\"post\">\n    <p class=\"meta\"><time datetime=\"${post.date}\">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>\n    <h1>${esc(post.title)}</h1>\n    <div class=\"prose\">${post.bodyHtml}</div></article>\n  ` };\n}\n\n// The address after # says which page to show: #/, #/post/<slug>.\nfunction route() {\n  const [, kind, arg, section] = /^#\\/(post|tag|feed)?\\/?([\\w-]*)\\/?([\\w-]*)$/.exec(location.hash || '#/') ?? [];\n  const page = kind === 'post' ? postPage(arg)\n    : homePage();\n  $('page').innerHTML = page.html;\n  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';\n  scrollTo(0, 0);\n}\naddEventListener('hashchange', route);"
   }
  },
  {
   "title": "Lists and tables",
   "body": "Guides need lists and tables: steps to follow, attacks to dodge. Each is recognized by what **every line** of a block looks like:\n\n| Block | Every line looks like | Becomes |\n|---|---|---|\n| bullet list | `- item` or `* item` | `<ul><li>…</li></ul>` |\n| numbered list | `1. item` | `<ol><li>…</li></ol>` |\n| table | `\\| cell \\| cell \\|`, with a `\\|---\\|---\\|` line second | `<table>` |\n\n`lines.every(...)` asks \"does every line match?\", so a paragraph that happens to start with a dash isn't mistaken for a list.\n\n**Tables.** The second line must be the separator (`/^\\|[\\s:|-]+\\|$/`: only pipes, dashes, colons and spaces). `cells(row)` trims the outer pipes and splits on the inner ones. The first row becomes `<th>` header cells, the rest `<td>` cells. A header row that's completely empty (`| | |`, used for the Taurus Demon's info box) gets no `<thead>` at all. Each cell goes through `inline()`, so **bold** and links work inside tables too.\n\nThis is a small Markdown converter, not a complete one: it handles what the blog's posts use. The real blog uses the Python `markdown` library, which handles everything (and is tested by thousands of projects).\n\n### Try it\n\nOpen the Taurus Demon guide: a numbered list and two tables. Open the beginner tips: a bullet list.",
   "checks": [
    {
     "pane": "js",
     "label": "bullet lists",
     "test": "/<ul>\\$\\{lines\\.map/"
    },
    {
     "pane": "js",
     "label": "numbered lists",
     "test": "/<ol>\\$\\{lines\\.map/"
    },
    {
     "pane": "js",
     "label": "a table needs its separator line",
     "test": "/\\/\\^\\\\\\|\\[\\\\s:\\|-\\]\\+\\\\\\|\\$\\/\\.test\\(\\s*lines\\[1\\]/"
    },
    {
     "pane": "js",
     "label": "table cells",
     "test": "/const\\s+cells\\s*=\\s*\\(\\s*row\\s*\\)\\s*=>/"
    }
   ],
   "quiz": [
    {
     "q": "Why check that EVERY line starts with \"- \" before making a list?",
     "options": [
      "To be fast",
      "So a paragraph that happens to begin with a dash isn't turned into a list",
      "Lists must have more than one item"
     ],
     "answer": 1,
     "why": "A block is a list only if it's all list items."
    },
    {
     "q": "How does the converter know a block is a table and not a paragraph with pipes in it?",
     "options": [
      "The second line must be a separator like |---|---|",
      "It counts the pipes",
      "Tables must be at the end of a post"
     ],
     "answer": 0,
     "why": "The separator line is what makes Markdown tables unambiguous."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "site": "// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)\nconst FILES = [\n  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---\ntitle: Why Dark Souls Still Matters\ndate: 2026-09-28\ntags: opinion, history\nsummary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.\n---\n\nWhen **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.\n\n## A world that folds back on itself\n\nYou spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.\n\n## Difficulty with a purpose\n\nDark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.\n\n## Strangers who help\n\nPlayers can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },\n\n  { name: '2026-09-29-first-hours-in-lordran.md', text: `---\ntitle: Your First Hours in Lordran: Beginner Tips\ndate: 2026-09-29\ntags: guide, beginner\nsummary: The things I wish someone had told me before my first trip through the Undead Burg.\n---\n\nThe first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.\n\n## Bonfires are checkpoints with a cost\n\nResting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.\n\n## Your souls are waiting where you fell\n\nWhen you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.\n\n## Watch your stamina, not your health\n\n- Attacking, rolling, running and blocking all use stamina.\n- The most common beginner death is swinging until the bar is empty.\n- Always keep a little in reserve to roll away.` },\n\n  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---\ntitle: Boss Guide 2: Taurus Demon\ndate: 2026-10-09\ntags: guide, bosses\nsummary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.\n---\n\nThe Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.\n\n| | |\n|---|---|\n| **Where** | The long stone wall in the Undead Burg |\n| **Weak to** | Plunging attacks, fire (firebombs) |\n\n## The trick: the ladder\n\n1. **Turn around and run back** to the tower you came from.\n2. **Climb the ladder** inside the tower to the top.\n3. Wait for the demon to walk underneath you, then **drop down and attack**.\n\n## Its attacks\n\n| Attack | What it looks like | How to avoid it |\n|---|---|---|\n| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |\n| Wide swing | Big horizontal swing | Roll through it toward its body |\n| Leap | Jumps into the air and lands on you | Run sideways or forward under it |\n\nBack to the [guides hub](#/post/lordran-guide-hub).` },\n\n  { name: '2026-10-15-lordran-guide-hub.md', text: `---\ntitle: Start Here: Lordran Guides Hub\ndate: 2026-10-15\ntags: guide, beginner\nsummary: Every guide on the blog in one place, in the order you'll need them.\n---\n\nNew to Dark Souls? Start with the tips, then take on the first big boss.\n\n| Guide | What it covers |\n|---|---|\n| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |\n| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |\n\n*More guides are on the way.*` },\n];\n// Reads the '---' block at the top of a post into an object, and returns the rest as the body.\nfunction parseFrontMatter(raw) {\n  const match = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/.exec(raw);\n  if (!match) throw new Error('Post is missing its --- front matter block');\n  const meta = {};\n  for (const line of match[1].split('\\n')) {\n    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons\n    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();\n  }\n  for (const required of ['title', 'date']) {\n    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);\n  }\n  return { meta, body: match[2] };\n}\n\n// \"Ornstein & Smough: A Guide!\" -> \"ornstein-smough-a-guide\"\nconst slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/[\\s-]+/g, '-').replace(/^-|-$/g, '');\n\nconst escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n\n// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these\n// rules make, and links may only go to http(s) addresses or pages on this site.\nfunction inline(text) {\n  return escapeHtml(text)\n    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')\n    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')\n    .replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g, (m, label, url) => (/^(https?:\\/\\/|#\\/)/.test(url) ? `<a href=\"${url}\">${label}</a>` : label));\n}\n\n// Blocks are separated by blank lines; each block becomes a heading, a list, a table or a paragraph.\nfunction markdownToHtml(md) {\n  const html = md.trim().split(/\\n\\s*\\n/).map((block) => {\n    const lines = block.split('\\n');\n    const heading = /^(#{2,3})\\s+(.+)$/.exec(block);\n    if (heading && lines.length === 1) {\n      const level = heading[1].length;\n      return `<h${level}>${inline(heading[2])}</h${level}>`;\n    }\n    if (lines.every((l) => /^\\s*[-*]\\s+/.test(l))) {\n      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\\s*[-*]\\s+/, ''))}</li>`).join('')}</ul>`;\n    }\n    if (lines.every((l) => /^\\s*\\d+\\.\\s+/.test(l))) {\n      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\\s*\\d+\\.\\s+/, ''))}</li>`).join('')}</ol>`;\n    }\n    // a table: rows of | cells |, with a |---|---| line under the header\n    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|')) && /^\\|[\\s:|-]+\\|$/.test(lines[1].trim())) {\n      const cells = (row) => row.trim().replace(/^\\||\\|$/g, '').split('|').map((c) => c.trim());\n      const head = cells(lines[0]);\n      const thead = head.some(Boolean) ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';\n      const rows = lines.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');\n      return `<table>${thead}<tbody>${rows}</tbody></table>`;\n    }\n    return `<p>${lines.map(inline).join(' ')}</p>`;\n  }).join('\\n');\n  return html;\n}\n\nfunction loadPost(file) {\n  const { meta, body } = parseFrontMatter(file.text);\n  return {\n    title: meta.title,\n    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text\n    slug: file.name.replace(/^\\d{4}-\\d{2}-\\d{2}-/, '').replace(/\\.md$/, ''),   // the file name without its date\n    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),\n    summary: meta.summary ?? '',\n    bodyHtml: markdownToHtml(body),\n    words: (body.match(/\\w+/g) ?? []).length,\n  };\n}\n\nconst readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute\n\n// Newest first. The posts are worked out once, when the page loads.\nconst POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));"
   }
  },
  {
   "title": "Heading links and a table of contents",
   "body": "Long guides need a **table of contents**, and that needs every `##` heading to have an `id` to link to.\n\n1. `uniqueId(text)` slugifies the heading: \"The trick: the ladder\" becomes `the-trick-the-ladder`.\n2. If that id is already used in this post, it adds `-2`, `-3` and so on. A `Set` remembers what's been used; ids must be unique on a page.\n3. Every `##` heading is also pushed into `headings`, which `markdownToHtml()` now returns along with the HTML.\n\nThe post page shows a folding `<details>` box, \"In this post\", when there are **more than two** `##` headings (a short post doesn't need one).\n\n**Links inside a hash-routed page.** On a normal site a table of contents links to `#the-trick-the-ladder`. Here the hash already holds the route, so links are `#/post/taurus-demon-boss-guide/the-trick-the-ladder`. `route()` reads the third part and calls `scrollIntoView()` on that heading.\n\n| Address | Shows |\n|---|---|\n| `#/post/first-hours-in-lordran` | the post, from the top |\n| `#/post/first-hours-in-lordran/watch-your-stamina-not-your-health` | the post, scrolled to that heading |\n\n### Try it\n\nOpen \"Why Dark Souls Still Matters\" or the beginner tips, open **In this post** and jump to a section. Each heading's link is shareable.",
   "checks": [
    {
     "pane": "js",
     "label": "headings get unique ids",
     "test": "/const\\s+uniqueId\\s*=/"
    },
    {
     "pane": "js",
     "label": "## headings are collected",
     "test": "/if\\s*\\(\\s*level\\s*===\\s*2\\s*\\)\\s*headings\\.push/"
    },
    {
     "pane": "js",
     "label": "a table of contents for longer posts",
     "test": "/post\\.headings\\.length\\s*>\\s*2/"
    },
    {
     "pane": "js",
     "label": "contents links scroll to the heading",
     "test": "/getElementById\\(\\s*section\\s*\\)\\?\\.scrollIntoView\\(\\)/"
    }
   ],
   "quiz": [
    {
     "q": "A post has two headings both called \"Tips\". What ids do they get?",
     "options": [
      "\"tips\" and \"tips\"",
      "\"tips\" and \"tips-2\"",
      "\"tips-1\" and \"tips-2\""
     ],
     "answer": 1,
     "why": "The first keeps the plain slug; later duplicates get -2, -3… so every id is unique."
    },
    {
     "q": "Why do table-of-contents links look like #/post/<slug>/<heading> instead of #<heading>?",
     "options": [
      "The hash already holds the route, so the heading is added as a third part that route() reads",
      "Browsers don't support #heading links",
      "To make links shorter"
     ],
     "answer": 0,
     "why": "One hash, two jobs: which page, and where on it."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "site": "// The posts, as Markdown files would be: a name and the text. (The real blog reads these from a posts/ folder.)\nconst FILES = [\n  { name: '2026-09-28-why-dark-souls-still-matters.md', text: `---\ntitle: Why Dark Souls Still Matters\ndate: 2026-09-28\ntags: opinion, history\nsummary: Fifteen years after it first lit the fire, Dark Souls still shapes how games are made. Here is why it holds up.\n---\n\nWhen **Dark Souls** came out in 2011, it had no tutorial pop-ups, no quest markers and no map. It dropped you into a dying world and trusted you to figure it out.\n\n## A world that folds back on itself\n\nYou spend hours climbing away from Firelink Shrine, then open a door or ride an elevator and realize you are right back where you started. Every shortcut feels like a discovery.\n\n## Difficulty with a purpose\n\nDark Souls is hard, but it is rarely unfair. Enemies telegraph their attacks, your stamina bar makes every swing a decision, and almost every death teaches you something.\n\n## Strangers who help\n\nPlayers can leave short messages on the ground for each other. Most are helpful, some are jokes, and a few are lies.` },\n\n  { name: '2026-09-29-first-hours-in-lordran.md', text: `---\ntitle: Your First Hours in Lordran: Beginner Tips\ndate: 2026-09-29\ntags: guide, beginner\nsummary: The things I wish someone had told me before my first trip through the Undead Burg.\n---\n\nThe first few hours of Dark Souls are the hardest, because you don't know the rules yet. Here is what helps the most.\n\n## Bonfires are checkpoints with a cost\n\nResting at a bonfire refills your health and your Estus Flasks, and sets where you come back after dying. But it also brings most enemies back to life.\n\n## Your souls are waiting where you fell\n\nWhen you die, you drop all your souls. Get back to that spot without dying and you pick them up again; die on the way and they're gone.\n\n## Watch your stamina, not your health\n\n- Attacking, rolling, running and blocking all use stamina.\n- The most common beginner death is swinging until the bar is empty.\n- Always keep a little in reserve to roll away.` },\n\n  { name: '2026-10-09-taurus-demon-boss-guide.md', text: `---\ntitle: Boss Guide 2: Taurus Demon\ndate: 2026-10-09\ntags: guide, bosses\nsummary: A huge demon on a narrow wall in the Undead Burg. Use the ladder behind you for free plunging attacks.\n---\n\nThe Taurus Demon is the first boss that can feel unfair. But it has a famous weakness, and once you know it, the fight is short.\n\n| | |\n|---|---|\n| **Where** | The long stone wall in the Undead Burg |\n| **Weak to** | Plunging attacks, fire (firebombs) |\n\n## The trick: the ladder\n\n1. **Turn around and run back** to the tower you came from.\n2. **Climb the ladder** inside the tower to the top.\n3. Wait for the demon to walk underneath you, then **drop down and attack**.\n\n## Its attacks\n\n| Attack | What it looks like | How to avoid it |\n|---|---|---|\n| Overhead slam | Raises its axe high, slams down | Roll to the side or between its legs |\n| Wide swing | Big horizontal swing | Roll through it toward its body |\n| Leap | Jumps into the air and lands on you | Run sideways or forward under it |\n\nBack to the [guides hub](#/post/lordran-guide-hub).` },\n\n  { name: '2026-10-15-lordran-guide-hub.md', text: `---\ntitle: Start Here: Lordran Guides Hub\ndate: 2026-10-15\ntags: guide, beginner\nsummary: Every guide on the blog in one place, in the order you'll need them.\n---\n\nNew to Dark Souls? Start with the tips, then take on the first big boss.\n\n| Guide | What it covers |\n|---|---|\n| [First hours](#/post/first-hours-in-lordran) | Bonfires, souls and stamina |\n| [Taurus Demon](#/post/taurus-demon-boss-guide) | The ladder trick and its attacks |\n\n*More guides are on the way.*` },\n];\n// Reads the '---' block at the top of a post into an object, and returns the rest as the body.\nfunction parseFrontMatter(raw) {\n  const match = /^---\\s*\\n([\\s\\S]*?)\\n---\\s*\\n([\\s\\S]*)$/.exec(raw);\n  if (!match) throw new Error('Post is missing its --- front matter block');\n  const meta = {};\n  for (const line of match[1].split('\\n')) {\n    const i = line.indexOf(':');                      // only the FIRST colon splits, so titles can contain colons\n    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();\n  }\n  for (const required of ['title', 'date']) {\n    if (!meta[required]) throw new Error(`Front matter needs a '${required}'`);\n  }\n  return { meta, body: match[2] };\n}\n\n// \"Ornstein & Smough: A Guide!\" -> \"ornstein-smough-a-guide\"\nconst slugify = (text) => text.toLowerCase().replace(/[^a-z0-9\\s-]/g, '').replace(/[\\s-]+/g, '-').replace(/^-|-$/g, '');\n\nconst escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\n\n// Bold, italics and links inside a line. The text is escaped FIRST, so the only HTML that can appear is what these\n// rules make, and links may only go to http(s) addresses or pages on this site.\nfunction inline(text) {\n  return escapeHtml(text)\n    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')\n    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')\n    .replace(/\\[([^\\]]+)\\]\\(([^)\\s]+)\\)/g, (m, label, url) => (/^(https?:\\/\\/|#\\/)/.test(url) ? `<a href=\"${url}\">${label}</a>` : label));\n}\n\n// Blocks are separated by blank lines. Returns the HTML and the post's ## headings for the table of contents.\nfunction markdownToHtml(md) {\n  const headings = [];\n  const used = new Set();\n  const uniqueId = (text) => {                       // two headings with the same text get -2, -3…\n    const base = slugify(text) || 'section';\n    let id = base;\n    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;\n    used.add(id);\n    return id;\n  };\n  const html = md.trim().split(/\\n\\s*\\n/).map((block) => {\n    const lines = block.split('\\n');\n    const heading = /^(#{2,3})\\s+(.+)$/.exec(block);\n    if (heading && lines.length === 1) {\n      const level = heading[1].length;\n      const id = uniqueId(heading[2]);\n      if (level === 2) headings.push({ id, text: heading[2] });\n      return `<h${level} id=\"${id}\">${inline(heading[2])}</h${level}>`;\n    }\n    if (lines.every((l) => /^\\s*[-*]\\s+/.test(l))) {\n      return `<ul>${lines.map((l) => `<li>${inline(l.replace(/^\\s*[-*]\\s+/, ''))}</li>`).join('')}</ul>`;\n    }\n    if (lines.every((l) => /^\\s*\\d+\\.\\s+/.test(l))) {\n      return `<ol>${lines.map((l) => `<li>${inline(l.replace(/^\\s*\\d+\\.\\s+/, ''))}</li>`).join('')}</ol>`;\n    }\n    // a table: rows of | cells |, with a |---|---| line under the header\n    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith('|')) && /^\\|[\\s:|-]+\\|$/.test(lines[1].trim())) {\n      const cells = (row) => row.trim().replace(/^\\||\\|$/g, '').split('|').map((c) => c.trim());\n      const head = cells(lines[0]);\n      const thead = head.some(Boolean) ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : '';\n      const rows = lines.slice(2).map((r) => `<tr>${cells(r).map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('');\n      return `<table>${thead}<tbody>${rows}</tbody></table>`;\n    }\n    return `<p>${lines.map(inline).join(' ')}</p>`;\n  }).join('\\n');\n  return { html, headings };\n}\n\nfunction loadPost(file) {\n  const { meta, body } = parseFrontMatter(file.text);\n  const { html, headings } = markdownToHtml(body);\n  return {\n    title: meta.title,\n    date: meta.date,                                    // 'YYYY-MM-DD' sorts correctly as text\n    slug: file.name.replace(/^\\d{4}-\\d{2}-\\d{2}-/, '').replace(/\\.md$/, ''),   // the file name without its date\n    tags: (meta.tags ?? '').split(',').map((t) => slugify(t)).filter(Boolean),\n    summary: meta.summary ?? '',\n    bodyHtml: html,\n    headings,\n    words: (body.match(/\\w+/g) ?? []).length,\n  };\n}\n\nconst readingMinutes = (post) => Math.max(1, Math.ceil(post.words / 220));   // about 220 words a minute\n\n// Newest first. The posts are worked out once, when the page loads.\nconst POSTS_LIST = FILES.map(loadPost).sort((a, b) => b.date.localeCompare(a.date));",
    "ui": "const $ = (id) => document.getElementById(id);\nconst esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');\nconst fmtDate = (key) => {\n  const [y, m, d] = key.split('-').map(Number);\n  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });\n};\n\nconst card = (p) => `\n  <article class=\"card\">\n    <p class=\"meta\"><time datetime=\"${p.date}\">${fmtDate(p.date)}</time> · ${readingMinutes(p)} min read</p>\n    <h2><a href=\"#/post/${p.slug}\">${esc(p.title)}</a></h2>\n    <p>${esc(p.summary)}</p>\n    <p class=\"tags\">${p.tags.map((t) => `<span class=\"tag small\">${esc(t)}</span>`).join('')}</p>\n  </article>`;\n\nfunction homePage() {\n  return { title: null, html: `<section class=\"hero\"><h1>Rest here a while.</h1><p>A Dark Souls fan blog: guides, lore and stories from Lordran.</p></section>\n    <div class=\"cards\">${POSTS_LIST.map(card).join('')}</div>` };\n}\n\nfunction postPage(slug) {\n  const post = POSTS_LIST.find((p) => p.slug === slug);\n  if (!post) return { title: 'Not found', html: '<h1 class=\"page-title\">Post not found</h1><p><a href=\"#/\">All posts</a></p>' };\n  const toc = post.headings.length > 2\n    ? `<details class=\"toc\"><summary>In this post</summary><ol>${post.headings.map((h) => `<li><a href=\"#/post/${post.slug}/${h.id}\">${esc(h.text)}</a></li>`).join('')}</ol></details>`\n    : '';\n  return { title: post.title, html: `<article class=\"post\">\n    <p class=\"meta\"><time datetime=\"${post.date}\">${fmtDate(post.date)}</time> · ${readingMinutes(post)} min read</p>\n    <h1>${esc(post.title)}</h1>\n    ${toc}\n    <div class=\"prose\">${post.bodyHtml}</div></article>\n  ` };\n}\n\n// The address after # says which page to show: #/, #/post/<slug>.\nfunction route() {\n  const [, kind, arg, section] = /^#\\/(post|tag|feed)?\\/?([\\w-]*)\\/?([\\w-]*)$/.exec(location.hash || '#/') ?? [];\n  const page = kind === 'post' ? postPage(arg)\n    : homePage();\n  $('page').innerHTML = page.html;\n  document.title = page.title ? `${page.title} · Bonfire Notes` : 'Bonfire Notes';\n  if (section) document.getElementById(section)?.scrollIntoView();   // a table-of-contents link\n  else scrollTo(0, 0);\n}\naddEventListener('hashchange', route);"
   }
  }
 ],
 "finish": "### What you learned\n\n- Posts as text files with a front matter block, parsed with one regular expression\n- Slugs from file names, reading time, and sorting by date strings\n- A safe Markdown converter: escape first, allowlisted links, lists, tables and heading ids\n- A table of contents from the post's own headings\n- Hash routing for home, post, tag, feed and not-found pages, with newer and older links\n- An RSS feed, and redirects that keep old links working\n- A canvas particle animation and a scroll progress bar, both respecting reduced motion\n\n### Challenges\n\n1. **Blockquotes:** make blocks whose lines start with `> ` into `<blockquote>`.\n2. **Search:** add a box that filters the cards by title and summary as you type.\n3. **Code spans:** turn `` `text` `` into `<code>text</code>` (escape first, as always).\n4. **Same-day order:** add an optional `time:` field and sort posts by date, then time.\n5. **Link checker:** at load time, find every `#/post/…` link in every post and warn in the console if it points nowhere.\n\nCompare yours with the [live blog](https://theoyanvno.github.io/bonfire-notes/) and the [source code](https://github.com/TheoYanvno/bonfire-notes)."
};
