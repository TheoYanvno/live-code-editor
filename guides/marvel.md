---
id: marvel
title: Marvel Character Database
blocks-html: page
blocks-css: base
blocks-js: data, db, ui, go
goals: Design related SQL tables with keys, CHECK constraints and many-to-many link tables; Load data in one transaction with parameterized INSERTs; Search across tables with EXISTS, LIKE and a ranked ORDER BY CASE; Group and count with GROUP BY, HAVING and COUNT(DISTINCT); Show relationships from both sides with UNION and NOT EXISTS; Run a real SQLite database in the browser and keep the page apart from the SQL
prereqs: HTML, CSS and JavaScript basics (functions, arrays, objects, template literals); No SQL needed: every statement is explained the first time it appears
---

## Session: From data to a database

## Step: Characters as cards
time: 15

Welcome! In this guide you'll rebuild my [Marvel Character Database](https://theoyanvno.github.io/marvel-character-database/): a searchable wall of character cards, where clicking one opens a profile with their powers, teams, MCU appearances, relationships and rogues gallery. The real project has 214 characters; this guide uses 16 of them, copied from its data file.

The real app is **Python + SQL**: a Flask server keeps the data in a SQLite database and answers questions with SQL queries. Its live demo runs the same SQL **in the browser**, with SQLite compiled to WebAssembly. That's what you'll do here, so every query you write is real SQL running against a real database.

First, though, just data and cards. The `data` block holds `CHARACTERS`, an array of objects, one per character, with more fields than you need today: you'll use the rest as the guide goes on.

```svg One card, drawn from one character object
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 190" font-family="sans-serif"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c62828"/><stop offset="1" stop-color="#2a0909"/></linearGradient></defs><rect x="20" y="10" width="126" height="168" rx="12" fill="url(#cg)"/><text x="83" y="78" text-anchor="middle" font-size="38" font-weight="800" fill="#fff" opacity=".9">SM</text><rect x="98" y="18" width="40" height="15" rx="7" fill="#000" opacity=".45"/><text x="118" y="29" text-anchor="middle" font-size="8" fill="#bfdbfe">HERO</text><text x="30" y="150" font-size="12" font-weight="700" fill="#fff">Spider-Man</text><text x="30" y="166" font-size="9" fill="#fff" opacity=".85">Peter Parker · 1962</text><g font-size="11" fill="#1f2937"><line x1="146" y1="40" x2="200" y2="40" stroke="#64748b"/><text x="206" y="44">color: a gradient from their own color</text><line x1="120" y1="70" x2="200" y2="72" stroke="#64748b"/><text x="206" y="76">monogram: first letters of the name</text><line x1="140" y1="26" x2="200" y2="104" stroke="#64748b"/><text x="206" y="108">badge: hero, villain or antihero</text><line x1="110" y1="147" x2="200" y2="140" stroke="#64748b"/><text x="206" y="144">name, then real name and debut year</text></g></svg>
```

| Part of the card | Comes from |
|---|---|
| background | `color`, as a CSS variable `--c` that a gradient uses |
| big letters | `monogram("Doctor Strange")` gives `DS` |
| corner badge | `alignment`: hero, villain or antihero |
| name and line below | `hero_name`, `real_name`, `first_year` |

**Monograms.** `name.split(/[\s-]+/)` splits at spaces *and* dashes, so "Spider-Man" gives `["Spider", "Man"]`. Taking each word's first letter and keeping two gives `SM`.

**Escaping.** Every value goes through `esc()` before it goes into HTML, which turns `<`, `>`, `&` and quotes into HTML codes. This data is mine, but data you didn't write can contain `<script>`, and the habit costs nothing.

**One CSS variable per card.** `style="--c: #c62828"` sets a variable on that card only, and the stylesheet's `linear-gradient(160deg, var(--c), #000 140%)` uses it. Sixteen different colors, one CSS rule.

### Try it

You should see 16 cards in a grid, sorted by name.

check: js | the characters as data | /const\s+CHARACTERS\s*=\s*\[/
check: js | initials from a name | /const\s+monogram\s*=/ | Split the name at spaces and dashes, take each first letter, keep two.
check: js | a card() function | /function\s+card\s*\(/
check: html | a grid for the cards | /id="grid"/

quiz: What does monogram("Spider-Man") return, and why?
- [ ] "S", because a dash is not a space
- [x] "SM", because the split pattern /[\s-]+/ treats dashes like spaces
- [ ] "SPIDER"
why: The character class [\s-] matches a space or a dash.
quiz: Why set the card color with a CSS variable (--c) instead of writing a gradient into each card's style?
- [ ] Variables are faster to download
- [x] One CSS rule draws every card; each card only says which color is its own
- [ ] Inline styles cannot contain gradients
why: The design stays in the stylesheet; the data only supplies the color.

```html page
<header class="top">
  <h1>Marvel Character Database</h1>
  <p class="muted" id="count"></p>
</header>
<main class="layout" id="layout">
  <div id="grid" class="grid"></div>
</main>
<p class="note">Unofficial fan project for learning SQL. Not affiliated with or endorsed by Marvel. Stories are written in my own words.</p>
```

```css base
:root { --bg: #0b0d12; --panel: #151923; --line: #262c3a; --text: #e8eaf0; --muted: #9aa3b5; --hero: #3b82f6; --villain: #ef4444; --antihero: #a855f7; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font-family: system-ui, sans-serif; }
.top { padding: 20px 24px 10px; }
h1 { margin: 0; font-size: 1.7rem; letter-spacing: .02em; }
.muted { color: var(--muted); }
#q { width: 100%; max-width: 460px; margin: 8px 0; padding: 10px 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel); color: var(--text); font-size: 1rem; }
.sides { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
.sides button { border: 1px solid var(--line); background: var(--panel); color: var(--text); border-radius: 999px; padding: 6px 14px; cursor: pointer; }
.sides button.on { background: var(--text); color: var(--bg); }
.layout { display: grid; grid-template-columns: 1fr; gap: 18px; padding: 10px 24px 30px; transition: grid-template-columns .35s ease; }
.layout.open { grid-template-columns: minmax(150px, 1fr) minmax(260px, 1.4fr); }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; align-content: start; }
.card { position: relative; display: flex; flex-direction: column; justify-content: flex-end; aspect-ratio: 3 / 4; padding: 10px; border: 0; border-radius: 12px; overflow: hidden; cursor: pointer; text-align: left; color: #fff;
        background: linear-gradient(160deg, var(--c), #000 140%); box-shadow: 0 6px 18px rgba(0, 0, 0, .35); transition: transform .2s, outline-color .2s; outline: 3px solid transparent; }
.card:hover { transform: translateY(-3px); }
.card.selected { outline-color: #fff; }
.card .photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.card .photo + .initials { display: none; }
.card::after { content: ""; position: absolute; inset: 45% 0 0; background: linear-gradient(transparent, rgba(0, 0, 0, .75)); }
.initials { position: absolute; top: 18%; left: 0; right: 0; text-align: center; font-size: 2.6rem; font-weight: 800; opacity: .9; }
.name, .real, .badge { position: relative; z-index: 1; }
.name { font-weight: 700; }
.real { font-size: .8rem; opacity: .85; }
.badge { position: absolute; top: 8px; right: 8px; font-size: .65rem; text-transform: uppercase; letter-spacing: .06em; padding: 2px 7px; border-radius: 999px; background: rgba(0, 0, 0, .45); }
.badge.hero { color: #bfdbfe; } .badge.villain { color: #fecaca; } .badge.antihero { color: #e9d5ff; }
.profile { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; align-self: start; animation: slide .35s ease; }
.profile h2 { margin: 0; }
.profile h3 { margin: 18px 0 6px; font-size: .8rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.profile h4 { margin: 8px 0 2px; font-size: .9rem; }
.profile a { color: #93c5fd; }
.profile .portrait { width: 90px; border-radius: 10px; float: right; margin: 0 0 8px 12px; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { border: 1px solid var(--line); background: #1d2330; color: var(--text); border-radius: 999px; padding: 3px 10px; font-size: .8rem; cursor: pointer; }
.titles { margin: 0; padding-left: 20px; }
.titles small, .credit { color: var(--muted); }
.minis { display: flex; flex-wrap: wrap; gap: 8px; }
.mini { display: flex; align-items: center; gap: 6px; border: 0; border-radius: 8px; padding: 5px 9px 5px 5px; color: #fff; cursor: pointer; background: linear-gradient(160deg, var(--c), #000 160%); font-size: .8rem; }
.mini span { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 6px; background: rgba(0, 0, 0, .3); font-weight: 800; font-size: .7rem; }
.mini.off { background: #1d2330; color: var(--muted); padding-left: 9px; cursor: default; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; padding: 4px 24px; }
.stats > div { background: var(--panel); border: 1px solid var(--line); border-radius: 12px; padding: 10px 14px; }
.stats h3 { margin: 0 0 4px; font-size: .75rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
.stats ol { margin: 0; padding-left: 18px; font-size: .85rem; }
.error { color: #fca5a5; }
.note { color: var(--muted); font-size: .75rem; text-align: center; padding: 0 24px 24px; }
@keyframes slide { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: none; } }
@media (max-width: 640px) { .layout.open { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```

```js data
// 16 of the 214 characters, copied from the real data/characters.json (stories shortened).
// "titles" lists MCU movies and series; ["Daredevil", 2016] means a later season of a series.
const CHARACTERS = [
  {"hero_name": "Spider-Man", "real_name": "Peter Parker", "alignment": "hero", "first_appearance": "Amazing Fantasy #15", "first_year": 1962, "color": "#c62828", "origin": "A Queens high school student bitten by a radioactive spider during a science demonstration gains spider-like abilities. After he fails to stop a burglar who later kills his Uncle Ben, Peter learns that with great power comes great responsibility.", "powers": ["Superhuman strength", "Wall-crawling", "Spider-sense", "Enhanced agility", "Genius-level intellect"], "teams": ["Avengers", "Fantastic Four"], "relationships": [["Ben Parker", "family"], ["Mary Jane Watson", "romantic"], ["Venom", "enemy"], ["Iron Man", "friend", "mentor"], ["Doctor Strange", "friend"]], "mcu": {"actor": "Tom Holland", "titles": ["Captain America: Civil War", "Spider-Man: Homecoming", "Avengers: Infinity War", "Avengers: Endgame", "Spider-Man: Far From Home", "Spider-Man: No Way Home", "Spider-Man: Brand New Day"], "lore": "Recruited by Tony Stark for the Avengers' airport battle, Peter Parker juggles high school in Queens with life as Spider-Man. He loses his mentor in the war with Thanos, is unmasked to the world by Mysterio, and asks Doctor Strange for a spell that ends with everyone forgetting who Peter Parker is."}, "image": "night-skyline.svg", "image_credit": "Drawing made for this guide (stand-in for a real photo)"},
  {"hero_name": "Iron Man", "real_name": "Tony Stark", "alignment": "hero", "first_appearance": "Tales of Suspense #39", "first_year": 1963, "color": "#b71c1c", "origin": "Billionaire weapons maker Tony Stark is gravely wounded and captured by enemies who demand he build them a weapon. Instead he builds an armored suit that keeps him alive and lets him escape, then devotes his genius to protecting the world.", "powers": ["Powered armor", "Genius-level intellect", "Flight", "Energy repulsors"], "teams": ["Avengers"], "relationships": [["Pepper Potts", "romantic"], ["War Machine", "friend"], ["Iron Monger", "enemy"], ["Mandarin", "enemy"], ["Hulk", "friend"], ["Thanos", "enemy"]], "mcu": {"actor": "Robert Downey Jr.", "titles": ["Iron Man", "The Incredible Hulk", "Iron Man 2", "The Avengers", "Iron Man 3", "Avengers: Age of Ultron", "Captain America: Civil War", "Spider-Man: Homecoming", "Avengers: Infinity War", "Avengers: Endgame"], "lore": "Weapons maker Tony Stark builds his first armor to escape captivity in Afghanistan and then tells the world \"I am Iron Man.\" He helps found the Avengers, creates Ultron by mistake, splits the team over the Sokovia Accords and mentors Peter Parker. He dies using the Infinity Stones to wipe out Thanos and his army."}},
  {"hero_name": "Captain America", "real_name": "Steve Rogers", "alignment": "hero", "first_appearance": "Captain America Comics #1", "first_year": 1941, "color": "#1565c0", "origin": "A frail young man rejected by the Army volunteers for an experimental super-soldier serum during World War II and becomes the peak of human ability. Frozen in ice near the end of the war, he is revived decades later and leads the Avengers.", "powers": ["Super-soldier physiology", "Master tactician", "Expert hand-to-hand combat", "Vibranium shield"], "teams": ["Avengers"], "relationships": [["Winter Soldier", "friend"], ["Peggy Carter", "romantic"], ["Iron Man", "friend"], ["Red Skull", "enemy"], ["Thanos", "enemy"]], "mcu": {"actor": "Chris Evans", "titles": ["Captain America: The First Avenger", "The Avengers", "Captain America: The Winter Soldier", "Avengers: Age of Ultron", "Ant-Man", "Captain America: Civil War", "Spider-Man: Homecoming", "Avengers: Infinity War", "Avengers: Endgame"], "lore": "A frail Brooklyn volunteer turned super-soldier in 1943, Steve Rogers goes down in the Arctic stopping the Red Skull and wakes up almost 70 years later. He leads the Avengers, exposes HYDRA inside S.H.I.E.L.D."}},
  {"hero_name": "Black Widow", "real_name": "Natasha Romanoff", "alignment": "hero", "first_appearance": "Tales of Suspense #52", "first_year": 1964, "color": "#212121", "origin": "Trained from childhood in the Soviet Red Room program, Natasha becomes a master spy and assassin. She defects and joins S.H.I.E.L.D.", "powers": ["Master spy", "Expert hand-to-hand combat", "Peak human conditioning", "Marksmanship"], "teams": ["Avengers", "S.H.I.E.L.D."], "relationships": [["Hawkeye", "friend"], ["Yelena Belova", "family"], ["Winter Soldier", "romantic"], ["Captain America", "friend"], ["Thanos", "enemy"]], "mcu": {"actor": "Scarlett Johansson", "titles": ["Iron Man 2", "The Avengers", "Captain America: The Winter Soldier", "Avengers: Age of Ultron", "Captain America: Civil War", "Avengers: Infinity War", "Captain Marvel", "Avengers: Endgame", "Black Widow"], "lore": "Trained from childhood in the Red Room, Natasha Romanoff defects to S.H.I.E.L.D. and becomes a founding Avenger."}},
  {"hero_name": "Thor", "real_name": "Thor Odinson", "alignment": "hero", "first_appearance": "Journey into Mystery #83", "first_year": 1962, "color": "#546e7a", "origin": "The Norse god of thunder and prince of Asgard, son of Odin. Sent to Earth to learn humility, he becomes one of its greatest defenders, wielding the enchanted hammer Mjolnir that only the worthy can lift.", "powers": ["Superhuman strength", "Weather control", "Flight", "Near-immortality", "Mjolnir"], "teams": ["Avengers"], "relationships": [["Hela", "family"], ["Loki", "enemy"], ["Laufey", "enemy"], ["Thanos", "enemy"]], "mcu": {"actor": "Chris Hemsworth", "titles": ["Thor", "The Avengers", "Thor: The Dark World", "Avengers: Age of Ultron", "Doctor Strange", "Thor: Ragnarok", "Avengers: Infinity War", "Avengers: Endgame", "Thor: Love and Thunder"], "lore": "Banished to Earth by Odin to learn humility, the god of thunder becomes a founding Avenger. He loses his hammer, his eye, his father and his home world, then forges Stormbreaker to fight Thanos."}},
  {"hero_name": "Hulk", "real_name": "Bruce Banner", "alignment": "hero", "first_appearance": "The Incredible Hulk #1", "first_year": 1962, "color": "#2e7d32", "origin": "Physicist Bruce Banner is caught in the blast of a gamma bomb test while saving a teenager. Afterward, stress or anger transforms him into the Hulk, a creature whose strength grows the angrier he gets.", "powers": ["Superhuman strength", "Regeneration", "Durability", "Genius-level intellect"], "teams": ["Avengers"], "relationships": [["She-Hulk", "family"], ["Thor", "friend"], ["Red Hulk", "enemy"], ["Black Widow", "romantic"], ["Ultron", "enemy"]], "mcu": {"actor": "Mark Ruffalo (Edward Norton in The Incredible Hulk)", "titles": ["The Incredible Hulk", "The Avengers", "Iron Man 3", "Avengers: Age of Ultron", "Thor: Ragnarok", "Avengers: Infinity War", "Captain Marvel", "Avengers: Endgame", "Shang-Chi and the Legend of the Ten Rings", "She-Hulk: Attorney at Law", "Spider-Man: Brand New Day"], "lore": "Scientist Bruce Banner becomes the Hulk after a gamma experiment goes wrong and spends years on the run from General Ross. He joins the Avengers, is stranded as a gladiator on Sakaar, then merges his mind with the Hulk's body and uses the Avengers' gauntlet to bring back everyone Thanos erased."}},
  {"hero_name": "Doctor Strange", "real_name": "Stephen Strange", "alignment": "hero", "first_appearance": "Strange Tales #110", "first_year": 1963, "color": "#00695c", "origin": "A brilliant but arrogant surgeon loses the use of his hands in a car crash. Searching for a cure, he finds the Ancient One, learns the mystic arts and becomes Sorcerer Supreme, Earth's defender against magical threats.", "powers": ["Sorcery", "Astral projection", "Dimensional travel", "Genius-level intellect"], "teams": ["Avengers", "Defenders"], "relationships": [["Wong", "friend"], ["Dormammu", "enemy"], ["Mordo", "enemy"], ["Scarlet Witch", "enemy"]], "mcu": {"actor": "Benedict Cumberbatch", "titles": ["Doctor Strange", "Thor: Ragnarok", "Avengers: Infinity War", "Avengers: Endgame", "Spider-Man: No Way Home", "Doctor Strange in the Multiverse of Madness"], "lore": "A brilliant neurosurgeon whose hands are ruined in a car crash, Stephen Strange goes to Kamar-Taj for a cure and becomes a master of the mystic arts. He bargains with Dormammu, gives Thanos the Time Stone to save Tony Stark, casts the spell that cracks the multiverse in No Way Home and protects America Chavez from Wanda."}},
  {"hero_name": "Storm", "real_name": "Ororo Munroe", "alignment": "hero", "first_appearance": "Giant-Size X-Men #1", "first_year": 1975, "color": "#6a1b9a", "origin": "A mutant who can control the weather. Orphaned young, she survived as a thief in Cairo before being revered as a goddess in Kenya.", "powers": ["Weather control", "Flight", "Lightning generation"], "teams": ["X-Men", "Avengers"], "relationships": [["Wolverine", "friend"], ["Shadow King", "enemy"]], "mcu": {"note": "Not in the MCU yet. The X-Men are expected to arrive after Avengers: Doomsday."}},
  {"hero_name": "Loki", "real_name": "Loki Laufeyson", "alignment": "antihero", "first_appearance": "Journey into Mystery #85", "first_year": 1962, "color": "#33691e", "origin": "Born to the Frost Giant king Laufey and raised by Odin as Thor's brother, Loki becomes the god of mischief. Jealous of Thor, he schemes against Asgard and Earth, sometimes villain and sometimes reluctant ally.", "powers": ["Sorcery", "Shapeshifting", "Illusion casting", "Near-immortality"], "teams": [], "relationships": [["Thor", "family"], ["Odin", "family"], ["Enchantress", "friend"]], "mcu": {"actor": "Tom Hiddleston", "titles": ["Thor", "The Avengers", "Thor: The Dark World", "Thor: Ragnarok", "Avengers: Infinity War", "Avengers: Endgame", "Loki"], "lore": "Odin's adopted Frost Giant son tries to rule Earth with a Chitauri army, then slowly becomes Thor's ally until Thanos kills him. A 2012 variant escapes with the Tesseract, is arrested by the Time Variance Authority and ends up holding the branching timelines together from a throne at the end of time."}},
  {"hero_name": "Venom", "real_name": "Eddie Brock", "alignment": "antihero", "first_appearance": "The Amazing Spider-Man #300", "first_year": 1988, "color": "#111111", "origin": "An alien symbiote rejected by Spider-Man bonds with reporter Eddie Brock, who blames Spider-Man for ruining his career. Together they become Venom.", "powers": ["Superhuman strength", "Wall-crawling", "Shapeshifting", "Immune to spider-sense"], "teams": [], "relationships": [["Anne Weying", "romantic"]], "mcu": {"actor": "Tom Hardy", "titles": ["Spider-Man: No Way Home"], "lore": "Eddie Brock and his alien symbiote are briefly pulled into the MCU by Doctor Strange's spell and spend the time in a Mexican bar learning about the Avengers. When they're sent home, a small piece of the symbiote stays behind."}},
  {"hero_name": "Punisher", "real_name": "Frank Castle", "alignment": "antihero", "first_appearance": "The Amazing Spider-Man #129", "first_year": 1974, "color": "#212121", "origin": "After his family is killed in a mob shootout in Central Park, former Marine Frank Castle declares war on crime. Unlike most heroes, he is willing to kill, which puts him at odds with Spider-Man and Daredevil.", "powers": ["Marksmanship", "Expert hand-to-hand combat", "Master tactician"], "teams": [], "relationships": [["Daredevil", "enemy"], ["Spider-Man", "enemy"], ["Microchip", "friend"]], "mcu": {"actor": "Jon Bernthal", "titles": [["Daredevil", 2016], "The Punisher", "Daredevil: Born Again", "The Punisher: One Last Kill", "Spider-Man: Brand New Day"], "lore": "Marine veteran Frank Castle goes to war on crime after his wife and children are killed. He first clashes with Daredevil in Hell's Kitchen, returns in Born Again, and tries to walk away in One Last Kill until crime boss Ma Gnucci puts a price on his head."}},
  {"hero_name": "Wolverine", "real_name": "Logan (James Howlett)", "alignment": "antihero", "first_appearance": "The Incredible Hulk #181", "first_year": 1974, "color": "#f9a825", "origin": "A mutant born with retractable bone claws and a healing factor that slows his aging. A secret program bonded indestructible adamantium to his skeleton, and he later found purpose with the X-Men.", "powers": ["Regeneration", "Adamantium skeleton and claws", "Enhanced senses", "Expert hand-to-hand combat"], "teams": ["X-Men", "Avengers"], "relationships": [["Jean Grey", "romantic"], ["X-23", "family"]], "mcu": {"actor": "Hugh Jackman", "titles": ["Deadpool & Wolverine"], "lore": "Deadpool recruits a variant of Logan known as the worst Wolverine, a man who failed his own world's X-Men. Dropped into the Void by the Time Variance Authority, the two fight each other, then Cassandra Nova, and this Logan finds a reason to be a hero again."}},
  {"hero_name": "Green Goblin", "real_name": "Norman Osborn", "alignment": "villain", "first_appearance": "The Amazing Spider-Man #14", "first_year": 1964, "color": "#2e7d32", "origin": "Ruthless industrialist Norman Osborn is driven mad by an experimental formula and becomes the Green Goblin, attacking from a glider with pumpkin bombs. He discovers Spider-Man's identity and becomes his most personal enemy.", "powers": ["Superhuman strength", "Genius-level intellect", "Goblin glider and pumpkin bombs", "Regeneration"], "teams": ["Sinister Six", "Dark Avengers"], "relationships": [["Harry Osborn", "family"], ["Spider-Man", "enemy"]], "mcu": {"actor": "Willem Dafoe", "titles": ["Spider-Man: No Way Home"], "lore": "Pulled into the MCU from Sam Raimi's Spider-Man universe by Doctor Strange's broken spell, Norman Osborn loses control to his Goblin personality again. He kills May Parker, and three Spider-Men work together to cure him and send him home."}},
  {"hero_name": "Doctor Octopus", "real_name": "Otto Octavius", "alignment": "villain", "first_appearance": "The Amazing Spider-Man #3", "first_year": 1963, "color": "#558b2f", "origin": "Brilliant scientist Otto Octavius designs four mechanical arms to handle radioactive material. A lab accident fuses the arms to his body and his mind, and he turns his genius to crime as Doctor Octopus, one of Spider-Man's deadliest foes.", "powers": ["Mechanical tentacles", "Genius-level intellect", "Master tactician"], "teams": ["Sinister Six"], "relationships": [["Spider-Man", "enemy"], ["May Parker", "romantic"], ["Green Goblin", "friend"]], "mcu": {"actor": "Alfred Molina", "titles": ["Spider-Man: No Way Home"], "lore": "Another visitor from Raimi's universe, Otto Octavius attacks on a highway bridge and realizes this Peter is not the Spider-Man he knows. Once Peter fixes his inhibitor chip, Otto helps the Spider-Men and goes home reformed."}},
  {"hero_name": "Mysterio", "real_name": "Quentin Beck", "alignment": "villain", "first_appearance": "The Amazing Spider-Man #13", "first_year": 1964, "color": "#2e7d32", "origin": "A Hollywood special-effects expert and stuntman, Quentin Beck decides he can win fame faster as a villain. Behind his fishbowl helmet, he uses illusions, hypnotic gas and holograms to fool Spider-Man and the public.", "powers": ["Illusion casting", "Expert in special effects", "Master tactician"], "teams": ["Sinister Six"], "relationships": [["Spider-Man", "enemy"], ["Daredevil", "enemy"]], "mcu": {"actor": "Jake Gyllenhaal", "titles": ["Spider-Man: Far From Home"], "lore": "Former Stark Industries engineer Quentin Beck poses as a hero from another Earth and stages monster attacks with drone illusions. Spider-Man beats him, but his doctored video reveals Peter Parker's identity to the world."}},
  {"hero_name": "Thanos", "real_name": "Thanos", "alignment": "villain", "first_appearance": "The Invincible Iron Man #55", "first_year": 1973, "color": "#5e35b1", "origin": "A member of the Eternals born on Saturn's moon Titan, Thanos becomes obsessed with the embodiment of Death. He seeks cosmic power, most famously the Infinity Gems (Infinity Stones in the films), to reshape the universe.", "powers": ["Superhuman strength", "Durability", "Genius-level intellect", "Master tactician"], "teams": ["Black Order"], "relationships": [["Captain Marvel", "enemy"]], "mcu": {"actor": "Josh Brolin (Damion Poitras in The Avengers)", "titles": ["The Avengers", "Guardians of the Galaxy", "Avengers: Age of Ultron", "Avengers: Infinity War", "Avengers: Endgame"], "lore": "A Titan convinced that half of all life must die so the rest can thrive, Thanos sends Loki and the Chitauri against Earth and raises Gamora and Nebula as weapons. He collects all six Infinity Stones and wipes out half the universe with a snap."}},
];

// The MCU titles these characters appear in, in release order (the real file has all 61).
const MCU_TITLES = [
  {"title": "Iron Man", "year": 2008, "kind": "film"},
  {"title": "The Incredible Hulk", "year": 2008, "kind": "film"},
  {"title": "Iron Man 2", "year": 2010, "kind": "film"},
  {"title": "Thor", "year": 2011, "kind": "film"},
  {"title": "Captain America: The First Avenger", "year": 2011, "kind": "film"},
  {"title": "The Avengers", "year": 2012, "kind": "film"},
  {"title": "Iron Man 3", "year": 2013, "kind": "film"},
  {"title": "Thor: The Dark World", "year": 2013, "kind": "film"},
  {"title": "Captain America: The Winter Soldier", "year": 2014, "kind": "film"},
  {"title": "Guardians of the Galaxy", "year": 2014, "kind": "film"},
  {"title": "Avengers: Age of Ultron", "year": 2015, "kind": "film"},
  {"title": "Ant-Man", "year": 2015, "kind": "film"},
  {"title": "Daredevil", "year": 2015, "kind": "series"},
  {"title": "Captain America: Civil War", "year": 2016, "kind": "film"},
  {"title": "Doctor Strange", "year": 2016, "kind": "film"},
  {"title": "Spider-Man: Homecoming", "year": 2017, "kind": "film"},
  {"title": "Thor: Ragnarok", "year": 2017, "kind": "film"},
  {"title": "The Punisher", "year": 2017, "kind": "series"},
  {"title": "Avengers: Infinity War", "year": 2018, "kind": "film"},
  {"title": "Captain Marvel", "year": 2019, "kind": "film"},
  {"title": "Avengers: Endgame", "year": 2019, "kind": "film"},
  {"title": "Spider-Man: Far From Home", "year": 2019, "kind": "film"},
  {"title": "Black Widow", "year": 2021, "kind": "film"},
  {"title": "Shang-Chi and the Legend of the Ten Rings", "year": 2021, "kind": "film"},
  {"title": "Spider-Man: No Way Home", "year": 2021, "kind": "film"},
  {"title": "Loki", "year": 2021, "kind": "series"},
  {"title": "Doctor Strange in the Multiverse of Madness", "year": 2022, "kind": "film"},
  {"title": "Thor: Love and Thunder", "year": 2022, "kind": "film"},
  {"title": "She-Hulk: Attorney at Law", "year": 2022, "kind": "series"},
  {"title": "Deadpool & Wolverine", "year": 2024, "kind": "film"},
  {"title": "Daredevil: Born Again", "year": 2025, "kind": "series"},
  {"title": "Spider-Man: Brand New Day", "year": 2026, "kind": "film"},
  {"title": "The Punisher: One Last Kill", "year": 2026, "kind": "series"},
];

// The images folder. A real project keeps photo files here; this guide has one original drawing.
const SKYLINE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160">'
  + '<rect width="120" height="160" fill="#1e1b4b"/><circle cx="88" cy="34" r="14" fill="#fde68a"/>'
  + '<path d="M0 160V96h14V78h12v18h10V60h18v100zM58 160V88h16V70h10v20h12v-6h24v76z" fill="#0f172a"/>'
  + '<path d="M20 104h4v4h-4zM42 70h4v4h-4zM42 84h4v4h-4zM64 98h4v4h-4zM100 96h4v4h-4zM108 110h4v4h-4z" fill="#facc15"/></svg>';
const IMAGES = { 'night-skyline.svg': 'data:image/svg+xml,' + encodeURIComponent(SKYLINE) };
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<div class="card" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </div>`;
}

function drawGrid() {
  const list = [...CHARACTERS].sort((a, b) => a.hero_name.localeCompare(b.hero_name));
  $('grid').innerHTML = list.map(card).join('');
  $('count').textContent = `${list.length} characters`;
}


function start() {
  drawGrid();
}
```

```js go
start();
```

## Step: A real database in the page
time: 20

Now the cards come from SQL. The HTML loads **sql.js**, SQLite compiled to WebAssembly, from the same address the real live demo uses. `initSqlJs()` returns a *promise*: the browser downloads the database engine, and `.then()` runs your code once it's ready.

```svg One object becomes rows in several tables (the powers part comes next step)
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 200" font-family="sans-serif" font-size="10"><rect x="8" y="10" width="140" height="120" rx="6" fill="#0f172a"/><text x="16" y="28" fill="#e2e8f0" font-family="monospace">{ hero_name:</text><text x="24" y="42" fill="#fde68a" font-family="monospace">"Spider-Man",</text><text x="16" y="58" fill="#e2e8f0" font-family="monospace">  powers: [</text><text x="24" y="72" fill="#bbf7d0" font-family="monospace">"Wall-crawling",</text><text x="24" y="86" fill="#bbf7d0" font-family="monospace">"Spider-sense" ],</text><text x="16" y="102" fill="#e2e8f0" font-family="monospace">  teams: […], … }</text><line x1="148" y1="40" x2="196" y2="30" stroke="#475569" stroke-width="2"/><line x1="148" y1="78" x2="196" y2="140" stroke="#475569" stroke-width="2"/><rect x="196" y="10" width="226" height="50" rx="6" fill="#e2e8f0"/><text x="204" y="26" font-weight="700">characters</text><text x="204" y="42" font-family="monospace">id 1 · Spider-Man · Peter Parker · hero</text><rect x="196" y="72" width="104" height="70" rx="6" fill="#e2e8f0"/><text x="204" y="88" font-weight="700">powers</text><text x="204" y="104" font-family="monospace">3 Wall-crawling</text><text x="204" y="118" font-family="monospace">4 Spider-sense</text><rect x="310" y="72" width="112" height="70" rx="6" fill="#bbf7d0"/><text x="318" y="88" font-weight="700">character_powers</text><text x="318" y="104" font-family="monospace">1 → 3</text><text x="318" y="118" font-family="monospace">1 → 4</text><text x="215" y="170" text-anchor="middle" fill="#475569" font-size="11">one object becomes rows in several tables, joined by ids</text><text x="215" y="186" text-anchor="middle" fill="#475569" font-size="11">each power is stored once, however many characters have it</text></svg>
```

**The table.** `CREATE TABLE characters (…)` lists each column with a type and rules. The database enforces those rules on every row, whatever code inserts it:

| Rule | Meaning |
|---|---|
| `id INTEGER PRIMARY KEY AUTOINCREMENT` | a unique number for each row, given out automatically |
| `NOT NULL` | the column must have a value |
| `UNIQUE` | no two characters can share a `hero_name` |
| `CHECK (alignment IN ('hero', 'villain', 'antihero'))` | anything else, like `'heroo'`, is refused |

**Parameters, never pasted text.** Values go in with `?` placeholders: `run('INSERT … VALUES (?, ?, …)', [c.hero_name, …])`. The database receives the SQL and the values *separately*, so a value can never be mistaken for SQL. Building the string yourself, `"… VALUES ('" + name + "')"`, breaks on a name like *T'Challa* and lets anyone who controls the text rewrite your query. That attack is called **SQL injection**, and parameters stop it completely.

**One transaction.** `BEGIN` … `COMMIT` makes the whole load one unit: if any row fails (say a `CHECK`), `ROLLBACK` undoes everything, so you never end up with half a database.

**`rows(sql, params)`** is the helper that runs a query and returns plain objects, line for line the same as the real live demo's: prepare the statement, bind the parameters, `step()` through the results, `free()` it.

**A data layer.** The page calls `cards()`, never SQL itself. In the real project the same front end talks to either the Flask server or the in-browser database through those same function names.

### Try it

The cards look the same, but now `SELECT … ORDER BY hero_name` sorts them. Try changing it to `ORDER BY first_year`.

check: html | load SQLite in the page | /sql-wasm\.js/
check: js | a characters table | /CREATE\s+TABLE\s+characters/
check: js | the database checks the side | /CHECK\s*\(\s*alignment\s+IN/
check: js | values go in as ? parameters | /INSERT\s+INTO\s+characters\s*\([^)]*\)\s*VALUES\s*\(\s*\?/ | Write VALUES (?, ?, …) and pass the values as an array.
check: js | rows() runs a query | /function\s+rows\s*\(/
check: js | wait for SQLite to load | /initSqlJs\(/

quiz: Why pass values as ? parameters instead of building the SQL string yourself?
- [ ] It's shorter to type
- [x] The values never become part of the SQL, so a name with a quote can't break the query or rewrite it
- [ ] SQLite can't read strings
why: Parameters are the standard defense against SQL injection.
quiz: What happens if the 10th INSERT breaks a CHECK rule inside BEGIN … COMMIT?
- [ ] The first 9 rows stay
- [x] ROLLBACK undoes all of them, so the database is never half-loaded
- [ ] The rule is skipped
why: A transaction is all or nothing.

```html page
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
<header class="top">
  <h1>Marvel Character Database</h1>
  <p class="muted" id="count"></p>
</header>
<main class="layout" id="layout">
  <div id="grid" class="grid"></div>
</main>
<p class="note">Unofficial fan project for learning SQL. Not affiliated with or endorsed by Marvel. Stories are written in my own words.</p>
```

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const c of CHARACTERS) {
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin]);
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  cards: `SELECT id, hero_name, real_name, alignment, first_year, color FROM characters ORDER BY hero_name`,
};
// The data layer: the page only calls these, never SQL directly
const cards = () => rows(Q.cards);
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card" data-id="${c.id}" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards();
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}


function start() {
  drawGrid();
}
```

```js go
// Load SQLite, build the database, then draw the page
initSqlJs({ locateFile: (file) => SQLJS + file })
  .then((SQL) => {
    db = new SQL.Database();
    build();
    start();
  })
  .catch((err) => {
    $('grid').innerHTML = `<p class="error">Couldn't start the database: ${esc(err.message)}</p>`;
    console.error(err);
  });
```

## Session: Related tables

## Step: Powers, teams and a profile
time: 20

Spider-Man has five powers, and "Genius-level intellect" belongs to seven of the sixteen characters. Putting a list in one column (`"Wall-crawling, Spider-sense, …"`) makes it hard to ask "who has flight?" and lets the same power be spelled three ways. The relational answer is **three tables**:

```svg A many-to-many relationship through a link table
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 170" font-family="sans-serif" font-size="10"><rect x="8" y="40" width="112" height="65" rx="6" fill="#e2e8f0"/><text x="16" y="55" font-weight="700">characters</text><text x="16" y="71" font-family="monospace" font-size="9">id  PK</text><text x="16" y="86" font-family="monospace" font-size="9">hero_name</text><text x="16" y="101" font-family="monospace" font-size="9">alignment</text><rect x="158" y="40" width="116" height="65" rx="6" fill="#bbf7d0"/><text x="166" y="55" font-weight="700">character_powers</text><text x="166" y="71" font-family="monospace" font-size="9">character_id  FK</text><text x="166" y="86" font-family="monospace" font-size="9">power_id      FK</text><text x="166" y="101" font-family="monospace" font-size="9">PK (both)</text><rect x="312" y="40" width="110" height="50" rx="6" fill="#e2e8f0"/><text x="320" y="55" font-weight="700">powers</text><text x="320" y="71" font-family="monospace" font-size="9">id  PK</text><text x="320" y="86" font-family="monospace" font-size="9">name  UNIQUE</text><line x1="120" y1="72" x2="158" y2="72" stroke="#475569" stroke-width="2"/><text x="124" y="66" font-size="11">1</text><text x="148" y="66" font-size="11">∞</text><line x1="274" y1="86" x2="312" y2="86" stroke="#475569" stroke-width="2"/><text x="278" y="80" font-size="11">∞</text><text x="302" y="80" font-size="11">1</text><text x="215" y="140" text-anchor="middle" fill="#475569" font-size="11">many characters ⟷ many powers, through a link table</text><text x="215" y="158" text-anchor="middle" fill="#475569" font-size="11">the two-column key stops the same pair from being stored twice</text></svg>
```

- `powers`: each power **once**, with `name UNIQUE`.
- `character_powers`: one row per (character, power) pair. Both columns are **foreign keys** (`REFERENCES`), and `PRIMARY KEY (character_id, power_id)` makes the pair the key, so the same pair can't be stored twice.
- Teams work exactly the same way: `teams` and `character_teams`.

`getOrCreate('powers', name)` looks a power up and inserts it only the first time it's seen, returning its id either way. `lastId()` asks SQLite for `last_insert_rowid()`, the id it just gave out.

**Reading them back with a JOIN.** To list one character's powers:

```sql
SELECT p.name FROM powers p
JOIN character_powers cp ON cp.power_id = p.id
WHERE cp.character_id = ? ORDER BY p.name
```

`JOIN … ON` pairs each link row with the power it points to; `WHERE` keeps the rows for one character. `p` and `cp` are short aliases for the table names.

**The profile.** Clicking a card calls `select(id)`. `character(id)` runs three small queries (the character, their powers, their teams) and returns one object, and `drawProfile()` shows it in a panel. The layout gets an `open` class that changes its grid from one column to two, so the cards slide over and the profile appears beside them. Clicking the open card again closes it.

One click listener on `#grid` handles every card: `e.target.closest('.card')` finds the card that was clicked, even when the click lands on its name. That's **event delegation**, and it keeps working after the grid is redrawn.

### Try it

Click Spider-Man. Then click Thor, then Thor again.

check: js | a powers table | /CREATE\s+TABLE\s+powers/
check: js | a link table keyed by the pair | /PRIMARY\s+KEY\s*\(\s*character_id\s*,\s*power_id\s*\)/
check: js | add each power once | /function\s+getOrCreate\s*\(/
check: js | powers through a JOIN | /JOIN\s+character_powers\s+cp\s+ON\s+cp\.power_id\s*=\s*p\.id/
check: js | a profile | /function\s+drawProfile\s*\(/
check: html | a profile panel | /id="profile"/

quiz: Why store powers in their own table instead of a text column like "Flight, Sorcery"?
- [ ] Text columns can't hold commas
- [x] Each power is stored once, so it's spelled one way and "who has flight?" is a simple query
- [ ] SQLite has a limit of one word per column
why: Splitting lists into rows is called normalizing the data.
quiz: What does PRIMARY KEY (character_id, power_id) prevent?
- [ ] A character having two powers
- [x] The same character–power pair being stored twice
- [ ] Two characters sharing a power
why: The key is the pair, so each pair can appear once.

```html page
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
<header class="top">
  <h1>Marvel Character Database</h1>
  <p class="muted" id="count"></p>
</header>
<main class="layout" id="layout">
  <div id="grid" class="grid"></div>
  <aside id="profile" class="profile" hidden></aside>
</main>
<p class="note">Unofficial fan project for learning SQL. Not affiliated with or endorsed by Marvel. Stories are written in my own words.</p>
```

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL
);
CREATE TABLE powers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
-- many-to-many: a character has many powers, a power belongs to many characters
CREATE TABLE character_powers (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id     INTEGER NOT NULL REFERENCES powers(id),
  PRIMARY KEY (character_id, power_id)
);
CREATE TABLE teams (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE character_teams (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_id      INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (character_id, team_id)
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Find a power or team by name, adding it the first time it's seen
function getOrCreate(table, name) {
  const found = rows(`SELECT id FROM ${table} WHERE name = ?`, [name])[0];
  if (found) return found.id;
  run(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  return lastId();
}

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const c of CHARACTERS) {
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin]);
      const id = lastId();
      for (const p of c.powers) run('INSERT INTO character_powers VALUES (?, ?)', [id, getOrCreate('powers', p)]);
      for (const t of c.teams) run('INSERT INTO character_teams VALUES (?, ?)', [id, getOrCreate('teams', t)]);
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  cards: `SELECT id, hero_name, real_name, alignment, first_year, color FROM characters ORDER BY hero_name`,
  character: 'SELECT * FROM characters WHERE id = ?',
  powers: `SELECT p.name FROM powers p JOIN character_powers cp ON cp.power_id = p.id
           WHERE cp.character_id = ? ORDER BY p.name`,
  teams: `SELECT t.name FROM teams t JOIN character_teams ct ON ct.team_id = t.id
          WHERE ct.character_id = ? ORDER BY t.name`,
};
// The data layer: the page only calls these, never SQL directly
const cards = () => rows(Q.cards);
function character(id) {
  const [c] = rows(Q.character, [id]);
  if (!c) return null;
  return {
    ...c,
    powers: rows(Q.powers, [id]).map((r) => r.name),
    teams: rows(Q.teams, [id]).map((r) => r.name),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const state = { selected: null };

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card${state.selected === c.id ? ' selected' : ''}" data-id="${c.id}" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards();
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}

function drawProfile() {
  const p = state.selected && character(state.selected);
  $('profile').hidden = !p;
  $('layout').classList.toggle('open', Boolean(p));
  if (!p) return;
  $('profile').innerHTML = `
    <h2>${esc(p.hero_name)}</h2>
    <p class="muted">${esc(p.real_name)} · ${esc(p.alignment)} · first seen in ${esc(p.first_appearance)} (${p.first_year})</p>
    <h3>Origin</h3><p>${esc(p.origin)}</p>
    <h3>Powers</h3><div class="chips">${p.powers.map((x) => `<span class="chip">${esc(x)}</span>`).join('')}</div>
    <h3>Teams</h3><p>${p.teams.length ? p.teams.map(esc).join(', ') : '<span class="muted">None</span>'}</p>`;
}

function select(id) {
  state.selected = state.selected === id ? null : id;      // clicking the open card again closes it
  drawGrid();
  drawProfile();
}

$('grid').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) select(Number(c.dataset.id));
});

function start() {
  drawGrid();
}
```

## Step: Search across tables
time: 20

One box should find characters by **name, real name or power**: "flight" should find Iron Man, Storm and Thor even though none of them has "flight" in their name.

```sql
SELECT c.id, c.hero_name, …
FROM characters c
WHERE EXISTS (SELECT 1 FROM character_powers cp JOIN powers p ON p.id = cp.power_id
              WHERE cp.character_id = c.id AND p.name LIKE ?)
   OR c.hero_name LIKE ? OR c.real_name LIKE ?
GROUP BY c.id
ORDER BY CASE …
```

| Piece | What it does |
|---|---|
| `LIKE '%flight%'` | contains "flight", ignoring upper and lower case (for these letters) |
| `EXISTS (SELECT 1 …)` | true if the inner query finds *any* row: "this character has a matching power" |
| `c.id` inside the inner query | ties it to the character being checked (a *correlated* subquery) |
| `GROUP BY c.id` | one row per character |

`EXISTS` beats a plain `JOIN` here: a join would give Spider-Man once per matching power, while `EXISTS` only asks yes or no.

**Ranking.** Searching "spider" should put Spider-Man before Venom (whose power is "Immune to spider-sense"). `ORDER BY CASE` gives each row a bucket number:

```svg Each match gets a bucket number, then sorts by name
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 160" font-family="sans-serif"><rect x="10" y="14" width="30" height="32" rx="6" fill="#0f172a"/><text x="25" y="35" text-anchor="middle" fill="#fff" font-weight="700">0</text><rect x="46" y="14" width="374" height="32" rx="6" fill="#bbf7d0"/><text x="56" y="28" font-size="10" fill="#475569">hero name starts with "spider"</text><text x="56" y="41" font-size="11" font-weight="700">Spider-Man</text><rect x="10" y="56" width="30" height="32" rx="6" fill="#0f172a"/><text x="25" y="77" text-anchor="middle" fill="#fff" font-weight="700">1</text><rect x="46" y="56" width="374" height="32" rx="6" fill="#fde68a"/><text x="56" y="70" font-size="10" fill="#475569">hero or real name contains it</text><text x="56" y="83" font-size="11" font-weight="700">(none here)</text><rect x="10" y="98" width="30" height="32" rx="6" fill="#0f172a"/><text x="25" y="119" text-anchor="middle" fill="#fff" font-weight="700">2</text><rect x="46" y="98" width="374" height="32" rx="6" fill="#e2e8f0"/><text x="56" y="112" font-size="10" fill="#475569">only a power matches</text><text x="56" y="125" font-size="11" font-weight="700">Venom (Immune to spider-sense)</text><text x="215" y="150" text-anchor="middle" font-size="11" fill="#475569">ORDER BY CASE … gives each match a bucket number, then sorts by name inside each bucket</text></svg>
```

The `%` signs are added in JavaScript: `like = '%' + text + '%'` for "contains", `prefix = text + '%'` for "starts with". The query has seven `?` marks, so `cards()` passes seven values, in order.

A power chip in the profile is now a button: clicking it puts that power in the search box and searches.

### Try it

Search **flight**, **spider**, **peter**. Then try `x' OR 1=1 --`: nothing matches, because it's just text being searched for.

check: html | a search box | /id="q"/
check: js | powers matched with LIKE | /p\.name\s+LIKE\s+\?/
check: js | ranked with ORDER BY CASE | /ORDER\s+BY\s+CASE\s+WHEN\s+c\.hero_name\s+LIKE/
check: js | search as you type | /addEventListener\(\s*['"]input['"]/

quiz: Why use WHERE EXISTS (…) for the power match instead of joining the powers in?
- [ ] EXISTS is the only way to use LIKE
- [x] A join gives one row per matching power; EXISTS only asks whether at least one matches
- [ ] Joins don't work with aliases
why: Yes-or-no questions are what EXISTS is for.
quiz: Searching "spider", why does Spider-Man come before Venom?
- [ ] Alphabetical order
- [x] His hero name starts with the search, which is bucket 0; Venom only matches through a power, bucket 2
- [ ] He was added first
why: The CASE gives the bucket; the name only sorts within a bucket.

```html page
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
<header class="top">
  <h1>Marvel Character Database</h1>
  <p class="muted" id="count"></p>
  <input id="q" type="search" placeholder="Search a name, power or actor (try flight)" autocomplete="off" aria-label="Search characters">
</header>
<main class="layout" id="layout">
  <div id="grid" class="grid"></div>
  <aside id="profile" class="profile" hidden></aside>
</main>
<p class="note">Unofficial fan project for learning SQL. Not affiliated with or endorsed by Marvel. Stories are written in my own words.</p>
```

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL
);
CREATE TABLE powers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
-- many-to-many: a character has many powers, a power belongs to many characters
CREATE TABLE character_powers (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id     INTEGER NOT NULL REFERENCES powers(id),
  PRIMARY KEY (character_id, power_id)
);
CREATE TABLE teams (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE character_teams (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_id      INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (character_id, team_id)
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Find a power or team by name, adding it the first time it's seen
function getOrCreate(table, name) {
  const found = rows(`SELECT id FROM ${table} WHERE name = ?`, [name])[0];
  if (found) return found.id;
  run(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  return lastId();
}

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const c of CHARACTERS) {
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin]);
      const id = lastId();
      for (const p of c.powers) run('INSERT INTO character_powers VALUES (?, ?)', [id, getOrCreate('powers', p)]);
      for (const t of c.teams) run('INSERT INTO character_teams VALUES (?, ?)', [id, getOrCreate('teams', t)]);
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  // A name, real name or power (and later the MCU actor). Names that start with the search come first.
  search: `SELECT c.id, c.hero_name, c.real_name, c.alignment, c.first_year, c.color
          FROM characters c
          WHERE EXISTS (SELECT 1 FROM character_powers cp JOIN powers p ON p.id = cp.power_id
                        WHERE cp.character_id = c.id AND p.name LIKE ?)
             OR c.hero_name LIKE ? OR c.real_name LIKE ?
          GROUP BY c.id
          ORDER BY CASE WHEN c.hero_name LIKE ? THEN 0
                        WHEN c.hero_name LIKE ? OR c.real_name LIKE ? THEN 1
                        ELSE 2 END,
                   c.hero_name`,
  character: 'SELECT * FROM characters WHERE id = ?',
  powers: `SELECT p.name FROM powers p JOIN character_powers cp ON cp.power_id = p.id
           WHERE cp.character_id = ? ORDER BY p.name`,
  teams: `SELECT t.name FROM teams t JOIN character_teams ct ON ct.team_id = t.id
          WHERE ct.character_id = ? ORDER BY t.name`,
};
// The data layer: the page only calls these, never SQL directly
function cards(text = '') {
  const like = `%${text.trim()}%`;
  const prefix = `${text.trim()}%`;
  return rows(Q.search, [like, like, like, prefix, like, like]);
}
function character(id) {
  const [c] = rows(Q.character, [id]);
  if (!c) return null;
  return {
    ...c,
    powers: rows(Q.powers, [id]).map((r) => r.name),
    teams: rows(Q.teams, [id]).map((r) => r.name),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const state = { q: '', selected: null };

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card${state.selected === c.id ? ' selected' : ''}" data-id="${c.id}" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards(state.q);
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}

function drawProfile() {
  const p = state.selected && character(state.selected);
  $('profile').hidden = !p;
  $('layout').classList.toggle('open', Boolean(p));
  if (!p) return;
  $('profile').innerHTML = `
    <h2>${esc(p.hero_name)}</h2>
    <p class="muted">${esc(p.real_name)} · ${esc(p.alignment)} · first seen in ${esc(p.first_appearance)} (${p.first_year})</p>
    <h3>Origin</h3><p>${esc(p.origin)}</p>
    <h3>Powers</h3><div class="chips">${p.powers.map((x) => `<button class="chip" data-power="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <h3>Teams</h3><p>${p.teams.length ? p.teams.map(esc).join(', ') : '<span class="muted">None</span>'}</p>`;
}

function select(id) {
  state.selected = state.selected === id ? null : id;      // clicking the open card again closes it
  drawGrid();
  drawProfile();
}

$('grid').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) select(Number(c.dataset.id));
});
$('q').addEventListener('input', (e) => {
  state.q = e.target.value;
  drawGrid();
});
$('profile').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-power]');
  if (chip) {                               // a power chip searches for everyone who has it
    state.q = $('q').value = chip.dataset.power;
    drawGrid();
  }
});

function start() {
  drawGrid();
}
```

## Step: Heroes, villains and antiheroes
time: 15

Tabs above the cards: **All**, **Heroes**, **Villains**, **Antiheroes**, each with a count.

**Counting with GROUP BY.**

```sql
SELECT alignment, COUNT(*) AS total FROM characters GROUP BY alignment
```

`GROUP BY` puts rows with the same alignment together, and `COUNT(*)` counts each group: one query returns all three numbers. `sides()` turns the rows into `{ hero: 8, villain: 4, antihero: 4 }` with `Object.fromEntries`, and "All" is their sum.

**An optional filter in the same query.** The search gets one more line:

```sql
HAVING (? = '' OR c.alignment = ?)
```

Pass `''` and the first half is true for every row, so nothing is filtered; pass `'villain'` and only villains pass. One query handles both cases, instead of two copies that could drift apart. (It's `HAVING` because it comes after `GROUP BY`; `HAVING` filters groups the way `WHERE` filters rows.)

**Defensive input.** `cards()` only accepts the three real sides: anything else becomes `''`, everyone. The `CHECK` constraint protects the data; this protects the query.

The search and the tab **combine**: searching "goblin" on the Heroes tab finds nobody, because the Green Goblin is a villain.

check: js | count each side | /GROUP\s+BY\s+alignment/
check: js | an optional side filter | /HAVING\s*\(\s*\?\s*=\s*''\s+OR\s+c\.alignment\s*=\s*\?\s*\)/ | One line: HAVING (? = '' OR c.alignment = ?)
check: js | unknown sides mean everyone | /SIDES\.includes\(\s*side\s*\)/
check: js | the tabs | /function\s+drawSides\s*\(/

quiz: What does HAVING (? = '' OR c.alignment = ?) do when both parameters are ''?
- [ ] Finds nobody
- [x] Lets every character through, because '' = '' is true
- [ ] Causes an error
why: An empty side means "no filter", in a single query.
quiz: cards("", "nonsense") returns what?
- [ ] Nothing
- [x] Everyone, because unknown sides are turned into ''
- [ ] An error
why: Only the three real sides filter anything.

```html page
<script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
<header class="top">
  <h1>Marvel Character Database</h1>
  <p class="muted" id="count"></p>
  <input id="q" type="search" placeholder="Search a name, power or actor (try flight)" autocomplete="off" aria-label="Search characters">
  <nav id="sides" class="sides" aria-label="Sides"></nav>
</header>
<main class="layout" id="layout">
  <div id="grid" class="grid"></div>
  <aside id="profile" class="profile" hidden></aside>
</main>
<p class="note">Unofficial fan project for learning SQL. Not affiliated with or endorsed by Marvel. Stories are written in my own words.</p>
```

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL
);
CREATE TABLE powers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
-- many-to-many: a character has many powers, a power belongs to many characters
CREATE TABLE character_powers (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id     INTEGER NOT NULL REFERENCES powers(id),
  PRIMARY KEY (character_id, power_id)
);
CREATE TABLE teams (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE character_teams (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_id      INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (character_id, team_id)
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Find a power or team by name, adding it the first time it's seen
function getOrCreate(table, name) {
  const found = rows(`SELECT id FROM ${table} WHERE name = ?`, [name])[0];
  if (found) return found.id;
  run(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  return lastId();
}

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const c of CHARACTERS) {
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin]);
      const id = lastId();
      for (const p of c.powers) run('INSERT INTO character_powers VALUES (?, ?)', [id, getOrCreate('powers', p)]);
      for (const t of c.teams) run('INSERT INTO character_teams VALUES (?, ?)', [id, getOrCreate('teams', t)]);
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  // A name, real name or power (and later the MCU actor). Names that start with the search come first.
  search: `SELECT c.id, c.hero_name, c.real_name, c.alignment, c.first_year, c.color
          FROM characters c
          WHERE EXISTS (SELECT 1 FROM character_powers cp JOIN powers p ON p.id = cp.power_id
                        WHERE cp.character_id = c.id AND p.name LIKE ?)
             OR c.hero_name LIKE ? OR c.real_name LIKE ?
          GROUP BY c.id
          HAVING (? = '' OR c.alignment = ?)
          ORDER BY CASE WHEN c.hero_name LIKE ? THEN 0
                        WHEN c.hero_name LIKE ? OR c.real_name LIKE ? THEN 1
                        ELSE 2 END,
                   c.hero_name`,
  side_counts: 'SELECT alignment, COUNT(*) AS total FROM characters GROUP BY alignment',
  character: 'SELECT * FROM characters WHERE id = ?',
  powers: `SELECT p.name FROM powers p JOIN character_powers cp ON cp.power_id = p.id
           WHERE cp.character_id = ? ORDER BY p.name`,
  teams: `SELECT t.name FROM teams t JOIN character_teams ct ON ct.team_id = t.id
          WHERE ct.character_id = ? ORDER BY t.name`,
};
// The data layer: the page only calls these, never SQL directly
const SIDES = ['hero', 'villain', 'antihero'];
function cards(text = '', side = '') {
  const like = `%${text.trim()}%`;
  const prefix = `${text.trim()}%`;
  side = SIDES.includes(side) ? side : '';           // anything else means everyone
  return rows(Q.search, [like, like, like, side, side, prefix, like, like]);
}
const sides = () => Object.fromEntries(rows(Q.side_counts).map((r) => [r.alignment, r.total]));
function character(id) {
  const [c] = rows(Q.character, [id]);
  if (!c) return null;
  return {
    ...c,
    powers: rows(Q.powers, [id]).map((r) => r.name),
    teams: rows(Q.teams, [id]).map((r) => r.name),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const state = { q: '', side: '', selected: null };

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card${state.selected === c.id ? ' selected' : ''}" data-id="${c.id}" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards(state.q, state.side);
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}

const SIDE_LABEL = { hero: 'Heroes', villain: 'Villains', antihero: 'Antiheroes' };
function drawSides() {
  const counts = sides();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [['', 'All', total], ...Object.entries(SIDE_LABEL).map(([s, label]) => [s, label, counts[s] || 0])];
  $('sides').innerHTML = tabs.map(([s, label, n]) =>
    `<button data-side="${s}" class="${state.side === s ? 'on' : ''}">${label} <small>${n}</small></button>`).join('');
}

function drawProfile() {
  const p = state.selected && character(state.selected);
  $('profile').hidden = !p;
  $('layout').classList.toggle('open', Boolean(p));
  if (!p) return;
  $('profile').innerHTML = `
    <h2>${esc(p.hero_name)}</h2>
    <p class="muted">${esc(p.real_name)} · ${esc(p.alignment)} · first seen in ${esc(p.first_appearance)} (${p.first_year})</p>
    <h3>Origin</h3><p>${esc(p.origin)}</p>
    <h3>Powers</h3><div class="chips">${p.powers.map((x) => `<button class="chip" data-power="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <h3>Teams</h3><p>${p.teams.length ? p.teams.map(esc).join(', ') : '<span class="muted">None</span>'}</p>`;
}

function select(id) {
  state.selected = state.selected === id ? null : id;      // clicking the open card again closes it
  drawGrid();
  drawProfile();
}

$('grid').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) select(Number(c.dataset.id));
});
$('q').addEventListener('input', (e) => {
  state.q = e.target.value;
  drawGrid();
});
$('sides').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  state.side = b.dataset.side;
  drawSides();
  drawGrid();
});
$('profile').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-power]');
  if (chip) {                               // a power chip searches for everyone who has it
    state.q = $('q').value = chip.dataset.power;
    drawGrid();
  }
});

function start() {
  drawSides(); drawGrid();
}
```

## Session: Profiles

## Step: In the MCU
time: 20

Each profile gets an **In the MCU** section: who plays the character, their first appearance, a short story of their arc, and every movie and series they're in, in release order.

Two new tables, with the same many-to-many shape as powers:

| Table | Holds |
|---|---|
| `mcu_titles` | each movie or series once: `title UNIQUE`, `year`, `kind` (`CHECK` film or series). Ids are given in **release order**. |
| `mcu_roles` | one row per (character, title), plus an optional `year` |

**Why a year on the role?** The Punisher's first MCU appearance is *Daredevil* season 2, in **2016**, but the series started in 2015. The data says `["Daredevil", 2016]`, and the role stores 2016. Most roles leave it empty, and the query falls back to the title's year:

```sql
SELECT t.title, t.kind, COALESCE(r.year, t.year) AS year
FROM mcu_roles r JOIN mcu_titles t ON t.id = r.title_id
WHERE r.character_id = ?
ORDER BY COALESCE(r.year, t.year), t.id
```

`COALESCE(a, b)` gives the first value that isn't `NULL`. Sorting by that year, then by `t.id` (release order) for titles in the same year, means **the first row is their first appearance**: no separate query needed.

**Catching typos at load time.** If the data names a title that isn't in `mcu_titles`, `build()` throws an error naming the character and the title, instead of quietly dropping it.

**Characters not in the MCU yet** (like Storm) have a `note` instead, shown in place of the list.

The search also matches `c.mcu_actor`, so you can search for an actor.

### Try it

Open Spider-Man, then the Punisher, then Storm. Search **Hiddleston**.

check: js | an mcu_titles table | /CREATE\s+TABLE\s+mcu_titles/
check: js | which characters are in which titles | /CREATE\s+TABLE\s+mcu_roles/
check: js | a later season keeps its own year | /COALESCE\(\s*r\.year\s*,\s*t\.year\s*\)/
check: js | search by actor | /c\.mcu_actor\s+LIKE\s+\?/
check: js | the MCU section | /function\s+mcuSection\s*\(/

quiz: What does COALESCE(r.year, t.year) give for a role with no year of its own?
- [ ] NULL
- [x] The title's year
- [ ] Zero
why: COALESCE returns the first non-NULL value.
quiz: How does the profile know a character's first MCU appearance without another query?
- [ ] It's stored in its own column
- [x] The titles are sorted by year and release order, so it's the first row
- [ ] It picks the oldest title in the whole database
why: Good ordering turns "first" into "row 0".

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL,
  mcu_actor        TEXT,
  mcu_lore         TEXT,
  mcu_note         TEXT
);
CREATE TABLE powers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
-- many-to-many: a character has many powers, a power belongs to many characters
CREATE TABLE character_powers (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id     INTEGER NOT NULL REFERENCES powers(id),
  PRIMARY KEY (character_id, power_id)
);
CREATE TABLE teams (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE character_teams (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_id      INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (character_id, team_id)
);
CREATE TABLE mcu_titles (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,   -- ids follow release order
  title TEXT NOT NULL UNIQUE,
  year  INTEGER NOT NULL,
  kind  TEXT NOT NULL CHECK (kind IN ('film', 'series'))
);
-- year is only set when it differs from the title's year (a later season of a series)
CREATE TABLE mcu_roles (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title_id     INTEGER NOT NULL REFERENCES mcu_titles(id),
  year         INTEGER,
  PRIMARY KEY (character_id, title_id)
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Find a power or team by name, adding it the first time it's seen
function getOrCreate(table, name) {
  const found = rows(`SELECT id FROM ${table} WHERE name = ?`, [name])[0];
  if (found) return found.id;
  run(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  return lastId();
}

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const t of MCU_TITLES) run('INSERT INTO mcu_titles (title, year, kind) VALUES (?, ?, ?)', [t.title, t.year, t.kind]);
    for (const c of CHARACTERS) {
      const mcu = c.mcu || {};
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin, mcu_actor, mcu_lore, mcu_note)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin, mcu.actor ?? null, mcu.lore ?? null, mcu.note ?? null]);
      const id = lastId();
      for (const p of c.powers) run('INSERT INTO character_powers VALUES (?, ?)', [id, getOrCreate('powers', p)]);
      for (const t of c.teams) run('INSERT INTO character_teams VALUES (?, ?)', [id, getOrCreate('teams', t)]);
      for (const t of mcu.titles || []) {
        const [title, year] = typeof t === 'string' ? [t, null] : t;      // "Title", or ["Title", year] for a later season
        const found = rows('SELECT id FROM mcu_titles WHERE title = ?', [title])[0];
        if (!found) throw new Error(`${c.hero_name}: unknown MCU title "${title}"`);
        run('INSERT INTO mcu_roles (character_id, title_id, year) VALUES (?, ?, ?)', [id, found.id, year]);
      }
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  // A name, real name or power (and later the MCU actor). Names that start with the search come first.
  search: `SELECT c.id, c.hero_name, c.real_name, c.alignment, c.first_year, c.color
          FROM characters c
          WHERE EXISTS (SELECT 1 FROM character_powers cp JOIN powers p ON p.id = cp.power_id
                        WHERE cp.character_id = c.id AND p.name LIKE ?)
             OR c.hero_name LIKE ? OR c.real_name LIKE ? OR c.mcu_actor LIKE ?
          GROUP BY c.id
          HAVING (? = '' OR c.alignment = ?)
          ORDER BY CASE WHEN c.hero_name LIKE ? THEN 0
                        WHEN c.hero_name LIKE ? OR c.real_name LIKE ? THEN 1
                        ELSE 2 END,
                   c.hero_name`,
  side_counts: 'SELECT alignment, COUNT(*) AS total FROM characters GROUP BY alignment',
  character: 'SELECT * FROM characters WHERE id = ?',
  powers: `SELECT p.name FROM powers p JOIN character_powers cp ON cp.power_id = p.id
           WHERE cp.character_id = ? ORDER BY p.name`,
  teams: `SELECT t.name FROM teams t JOIN character_teams ct ON ct.team_id = t.id
          WHERE ct.character_id = ? ORDER BY t.name`,
  // Release order; the first row is their first MCU appearance
  mcu_titles: `SELECT t.title, t.kind, COALESCE(r.year, t.year) AS year
               FROM mcu_roles r JOIN mcu_titles t ON t.id = r.title_id
               WHERE r.character_id = ?
               ORDER BY COALESCE(r.year, t.year), t.id`,
};
// The data layer: the page only calls these, never SQL directly
const SIDES = ['hero', 'villain', 'antihero'];
function cards(text = '', side = '') {
  const like = `%${text.trim()}%`;
  const prefix = `${text.trim()}%`;
  side = SIDES.includes(side) ? side : '';           // anything else means everyone
  return rows(Q.search, [like, like, like, like, side, side, prefix, like, like]);
}
const sides = () => Object.fromEntries(rows(Q.side_counts).map((r) => [r.alignment, r.total]));
function character(id) {
  const [c] = rows(Q.character, [id]);
  if (!c) return null;
  return {
    ...c,
    powers: rows(Q.powers, [id]).map((r) => r.name),
    teams: rows(Q.teams, [id]).map((r) => r.name),
    mcu_titles: rows(Q.mcu_titles, [id]),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const state = { q: '', side: '', selected: null };

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card${state.selected === c.id ? ' selected' : ''}" data-id="${c.id}" style="--c: ${esc(c.color)}">
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards(state.q, state.side);
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}

const SIDE_LABEL = { hero: 'Heroes', villain: 'Villains', antihero: 'Antiheroes' };
function drawSides() {
  const counts = sides();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [['', 'All', total], ...Object.entries(SIDE_LABEL).map(([s, label]) => [s, label, counts[s] || 0])];
  $('sides').innerHTML = tabs.map(([s, label, n]) =>
    `<button data-side="${s}" class="${state.side === s ? 'on' : ''}">${label} <small>${n}</small></button>`).join('');
}

function mcuSection(p) {
  if (!p.mcu_titles.length) return `<h3>In the MCU</h3><p class="muted">${esc(p.mcu_note || 'Not in the MCU yet.')}</p>`;
  const first = p.mcu_titles[0];
  return `<h3>In the MCU</h3>
    <p><strong>Played by</strong> ${esc(p.mcu_actor)}<br><strong>First appearance</strong> ${esc(first.title)} (${first.year})</p>
    <p>${esc(p.mcu_lore)}</p>
    <ol class="titles">${p.mcu_titles.map((t) => `<li>${esc(t.title)} <small>${t.kind}, ${t.year}</small></li>`).join('')}</ol>`;
}

function drawProfile() {
  const p = state.selected && character(state.selected);
  $('profile').hidden = !p;
  $('layout').classList.toggle('open', Boolean(p));
  if (!p) return;
  $('profile').innerHTML = `
    <h2>${esc(p.hero_name)}</h2>
    <p class="muted">${esc(p.real_name)} · ${esc(p.alignment)} · first seen in ${esc(p.first_appearance)} (${p.first_year})</p>
    <h3>Origin</h3><p>${esc(p.origin)}</p>
    <h3>Powers</h3><div class="chips">${p.powers.map((x) => `<button class="chip" data-power="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <h3>Teams</h3><p>${p.teams.length ? p.teams.map(esc).join(', ') : '<span class="muted">None</span>'}</p>
    ${mcuSection(p)}`;
}

function select(id) {
  state.selected = state.selected === id ? null : id;      // clicking the open card again closes it
  drawGrid();
  drawProfile();
}

$('grid').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) select(Number(c.dataset.id));
});
$('q').addEventListener('input', (e) => {
  state.q = e.target.value;
  drawGrid();
});
$('sides').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  state.side = b.dataset.side;
  drawSides();
  drawGrid();
});
$('profile').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-power]');
  if (chip) {                               // a power chip searches for everyone who has it
    state.q = $('q').value = chip.dataset.power;
    drawGrid();
  }
});

function start() {
  drawSides(); drawGrid();
}
```

## Step: A photo slot on every card
time: 15

The real project lets me give any character a photo: put the file in the images folder, add `"image": "spider-man.jpg"` to their data, and the photo fills the card and the profile, with a credit. Characters without one keep their color card and initials.

**Check names when the database is built.** `checkImage(c)` runs for every character during `build()`:

| Check | Catches |
|---|---|
| no `/` or `\` in the name | paths like `../secret.png` or a full web address: it must be a plain file name |
| ends in an allowed extension | `spider-man.jgp` |
| the file is really in the folder | a name that doesn't match any file |

Each failure **throws an error with the character's name**, and because `build()` runs in a transaction, nothing is loaded. A typo stops the build with a clear message, instead of becoming a broken picture someone notices weeks later. (Here the "folder" is the `IMAGES` object in the `data` block; the real app checks the disk.)

**Showing it.** `photo(c)` returns an `<img>` when the character has one, and nothing otherwise. The card's CSS hides the initials when a photo comes right before them (`.photo + .initials`), and a dark gradient over the bottom keeps the name readable on any picture.

This guide gives Spider-Man an original drawing of a night skyline as a stand-in. In the real project, only photos I have the right to publish go in, credited on the profile.

### Try it

Spider-Man's card shows the skyline. In the `data` block, change his `image` to `"skyline.png"` and watch the build stop with his name in the error. Change it back.

check: js | an image column | /image\s+TEXT/
check: js | names are checked when building | /function\s+checkImage\s*\(/
check: js | no folders in the name | /name\.includes\(\s*['"]\/['"]\s*\)/
check: js | a photo or the initials | /const\s+photo\s*=/

quiz: Why check image names while building the database instead of letting the browser show a broken image?
- [ ] Browsers can't show broken images
- [x] The build fails right away with the character's name, so the mistake is found and fixed before anyone sees it
- [ ] It makes the images smaller
why: Failing early and loudly beats failing quietly later.
quiz: Why refuse names containing "/"?
- [ ] Slashes aren't allowed in any file name
- [x] So the value is always a plain file in the images folder, never a path elsewhere or a web address
- [ ] SQLite can't store slashes
why: The data decides which file, never where to look.

```js db
// SQLite compiled to WebAssembly (sql.js): a real SQL database running inside the page.
// The real project's live demo uses this same library, from the same address.
const SQLJS = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let db;
const SCHEMA = `
CREATE TABLE characters (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  hero_name        TEXT NOT NULL UNIQUE,
  real_name        TEXT,
  alignment        TEXT NOT NULL CHECK (alignment IN ('hero', 'villain', 'antihero')),
  first_appearance TEXT NOT NULL,
  first_year       INTEGER NOT NULL,
  color            TEXT NOT NULL,
  origin           TEXT NOT NULL,
  mcu_actor        TEXT,
  mcu_lore         TEXT,
  mcu_note         TEXT,
  image            TEXT,             -- optional photo: a file name in the images folder
  image_credit     TEXT
);
CREATE TABLE powers (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
-- many-to-many: a character has many powers, a power belongs to many characters
CREATE TABLE character_powers (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  power_id     INTEGER NOT NULL REFERENCES powers(id),
  PRIMARY KEY (character_id, power_id)
);
CREATE TABLE teams (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE character_teams (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  team_id      INTEGER NOT NULL REFERENCES teams(id),
  PRIMARY KEY (character_id, team_id)
);
CREATE TABLE mcu_titles (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,   -- ids follow release order
  title TEXT NOT NULL UNIQUE,
  year  INTEGER NOT NULL,
  kind  TEXT NOT NULL CHECK (kind IN ('film', 'series'))
);
-- year is only set when it differs from the title's year (a later season of a series)
CREATE TABLE mcu_roles (
  character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title_id     INTEGER NOT NULL REFERENCES mcu_titles(id),
  year         INTEGER,
  PRIMARY KEY (character_id, title_id)
);
`;
// Run a query with ? parameters and return the rows as plain objects
function rows(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const out = [];
  while (stmt.step()) out.push(stmt.getAsObject());
  stmt.free();
  return out;
}
const run = (sql, params = []) => db.run(sql, params);
const lastId = () => rows('SELECT last_insert_rowid() AS id')[0].id;

// Find a power or team by name, adding it the first time it's seen
function getOrCreate(table, name) {
  const found = rows(`SELECT id FROM ${table} WHERE name = ?`, [name])[0];
  if (found) return found.id;
  run(`INSERT INTO ${table} (name) VALUES (?)`, [name]);
  return lastId();
}

// The photo's file name, checked so a typo stops the build with the character's name, not a broken picture.
// (The real project allows .jpg, .jpeg, .png and .webp; this guide adds .svg for its drawing.)
const IMAGE_TYPES = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
function checkImage(c) {
  const name = c.image;
  if (!name) return null;
  if (name.includes('/') || name.includes('\\') || !IMAGE_TYPES.some((t) => name.toLowerCase().endsWith(t))) {
    throw new Error(`${c.hero_name}: image must be a file name ending in ${IMAGE_TYPES.join(', ')}, got "${name}"`);
  }
  if (!(name in IMAGES)) throw new Error(`${c.hero_name}: image "${name}" is not in the images folder`);
  return name;
}

// Create the tables and load every character inside one transaction: all of it goes in, or none of it
function build() {
  run('PRAGMA foreign_keys = ON');
  db.exec(SCHEMA);
  run('BEGIN');
  try {
    for (const t of MCU_TITLES) run('INSERT INTO mcu_titles (title, year, kind) VALUES (?, ?, ?)', [t.title, t.year, t.kind]);
    for (const c of CHARACTERS) {
      const mcu = c.mcu || {};
      run(`INSERT INTO characters (hero_name, real_name, alignment, first_appearance, first_year, color, origin, mcu_actor, mcu_lore, mcu_note, image, image_credit)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [c.hero_name, c.real_name, c.alignment, c.first_appearance, c.first_year, c.color, c.origin, mcu.actor ?? null, mcu.lore ?? null, mcu.note ?? null, checkImage(c), c.image_credit ?? null]);
      const id = lastId();
      for (const p of c.powers) run('INSERT INTO character_powers VALUES (?, ?)', [id, getOrCreate('powers', p)]);
      for (const t of c.teams) run('INSERT INTO character_teams VALUES (?, ?)', [id, getOrCreate('teams', t)]);
      for (const t of mcu.titles || []) {
        const [title, year] = typeof t === 'string' ? [t, null] : t;      // "Title", or ["Title", year] for a later season
        const found = rows('SELECT id FROM mcu_titles WHERE title = ?', [title])[0];
        if (!found) throw new Error(`${c.hero_name}: unknown MCU title "${title}"`);
        run('INSERT INTO mcu_roles (character_id, title_id, year) VALUES (?, ?, ?)', [id, found.id, year]);
      }
    }
    run('COMMIT');
  } catch (err) {
    run('ROLLBACK');
    throw err;
  }
}

// The app's queries, like the real sql/app_queries.sql. Values always go in as ? parameters.
const Q = {
  // A name, real name or power (and later the MCU actor). Names that start with the search come first.
  search: `SELECT c.id, c.hero_name, c.real_name, c.alignment, c.first_year, c.color, c.image
          FROM characters c
          WHERE EXISTS (SELECT 1 FROM character_powers cp JOIN powers p ON p.id = cp.power_id
                        WHERE cp.character_id = c.id AND p.name LIKE ?)
             OR c.hero_name LIKE ? OR c.real_name LIKE ? OR c.mcu_actor LIKE ?
          GROUP BY c.id
          HAVING (? = '' OR c.alignment = ?)
          ORDER BY CASE WHEN c.hero_name LIKE ? THEN 0
                        WHEN c.hero_name LIKE ? OR c.real_name LIKE ? THEN 1
                        ELSE 2 END,
                   c.hero_name`,
  side_counts: 'SELECT alignment, COUNT(*) AS total FROM characters GROUP BY alignment',
  character: 'SELECT * FROM characters WHERE id = ?',
  powers: `SELECT p.name FROM powers p JOIN character_powers cp ON cp.power_id = p.id
           WHERE cp.character_id = ? ORDER BY p.name`,
  teams: `SELECT t.name FROM teams t JOIN character_teams ct ON ct.team_id = t.id
          WHERE ct.character_id = ? ORDER BY t.name`,
  // Release order; the first row is their first MCU appearance
  mcu_titles: `SELECT t.title, t.kind, COALESCE(r.year, t.year) AS year
               FROM mcu_roles r JOIN mcu_titles t ON t.id = r.title_id
               WHERE r.character_id = ?
               ORDER BY COALESCE(r.year, t.year), t.id`,
};
// The data layer: the page only calls these, never SQL directly
const SIDES = ['hero', 'villain', 'antihero'];
function cards(text = '', side = '') {
  const like = `%${text.trim()}%`;
  const prefix = `${text.trim()}%`;
  side = SIDES.includes(side) ? side : '';           // anything else means everyone
  return rows(Q.search, [like, like, like, like, side, side, prefix, like, like]);
}
const sides = () => Object.fromEntries(rows(Q.side_counts).map((r) => [r.alignment, r.total]));
function character(id) {
  const [c] = rows(Q.character, [id]);
  if (!c) return null;
  return {
    ...c,
    powers: rows(Q.powers, [id]).map((r) => r.name),
    teams: rows(Q.teams, [id]).map((r) => r.name),
    mcu_titles: rows(Q.mcu_titles, [id]),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
// "Doctor Strange" -> "DS", "Spider-Man" -> "SM"
const monogram = (name) => name.split(/[\s-]+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const state = { q: '', side: '', selected: null };

// A photo if the character has one, otherwise their initials on the card color
const photo = (c, cls = 'photo') => (c.image ? `<img class="${cls}" src="${IMAGES[c.image]}" alt="">` : '');

// One card: the character's color, their initials, side, name and real name
function card(c) {
  return `<button class="card${state.selected === c.id ? ' selected' : ''}" data-id="${c.id}" style="--c: ${esc(c.color)}">
    ${photo(c)}
    <span class="initials">${esc(monogram(c.hero_name))}</span>
    <span class="badge ${esc(c.alignment)}">${esc(c.alignment)}</span>
    <span class="name">${esc(c.hero_name)}</span>
    <span class="real">${esc(c.real_name)} · ${c.first_year}</span>
  </button>`;
}

function drawGrid() {
  const list = cards(state.q, state.side);
  $('grid').innerHTML = list.length ? list.map(card).join('') : '<p class="muted">No characters match.</p>';
  $('count').textContent = `${list.length} character${list.length === 1 ? '' : 's'}`;
}

const SIDE_LABEL = { hero: 'Heroes', villain: 'Villains', antihero: 'Antiheroes' };
function drawSides() {
  const counts = sides();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const tabs = [['', 'All', total], ...Object.entries(SIDE_LABEL).map(([s, label]) => [s, label, counts[s] || 0])];
  $('sides').innerHTML = tabs.map(([s, label, n]) =>
    `<button data-side="${s}" class="${state.side === s ? 'on' : ''}">${label} <small>${n}</small></button>`).join('');
}

function mcuSection(p) {
  if (!p.mcu_titles.length) return `<h3>In the MCU</h3><p class="muted">${esc(p.mcu_note || 'Not in the MCU yet.')}</p>`;
  const first = p.mcu_titles[0];
  return `<h3>In the MCU</h3>
    <p><strong>Played by</strong> ${esc(p.mcu_actor)}<br><strong>First appearance</strong> ${esc(first.title)} (${first.year})</p>
    <p>${esc(p.mcu_lore)}</p>
    <ol class="titles">${p.mcu_titles.map((t) => `<li>${esc(t.title)} <small>${t.kind}, ${t.year}</small></li>`).join('')}</ol>`;
}

function drawProfile() {
  const p = state.selected && character(state.selected);
  $('profile').hidden = !p;
  $('layout').classList.toggle('open', Boolean(p));
  if (!p) return;
  $('profile').innerHTML = `
    ${photo(p, 'portrait')}
    <h2>${esc(p.hero_name)}</h2>
    <p class="muted">${esc(p.real_name)} · ${esc(p.alignment)} · first seen in ${esc(p.first_appearance)} (${p.first_year})</p>
    <h3>Origin</h3><p>${esc(p.origin)}</p>
    <h3>Powers</h3><div class="chips">${p.powers.map((x) => `<button class="chip" data-power="${esc(x)}">${esc(x)}</button>`).join('')}</div>
    <h3>Teams</h3><p>${p.teams.length ? p.teams.map(esc).join(', ') : '<span class="muted">None</span>'}</p>
    ${mcuSection(p)}
    ${p.image_credit ? `<p class="credit"><small>Photo: ${esc(p.image_credit)}</small></p>` : ''}`;
}

function select(id) {
  state.selected = state.selected === id ? null : id;      // clicking the open card again closes it
  drawGrid();
  drawProfile();
}

$('grid').addEventListener('click', (e) => {
  const c = e.target.closest('.card');
  if (c) select(Number(c.dataset.id));
});
$('q').addEventListener('input', (e) => {
  state.q = e.target.value;
  drawGrid();
});
$('sides').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  state.side = b.dataset.side;
  drawSides();
  drawGrid();
});
$('profile').addEventListener('click', (e) => {
  const chip = e.target.closest('[data-power]');
  if (chip) {                               // a power chip searches for everyone who has it
    state.q = $('q').value = chip.dataset.power;
    drawGrid();
  }
});

function start() {
  drawSides(); drawGrid();
}
```

## Finish

### What you learned

- Tables with primary keys, foreign keys, `UNIQUE`, `NOT NULL` and `CHECK` rules
- Many-to-many relationships through link tables with two-column keys
- Loading data in one transaction with `?` parameters, which stop SQL injection
- Searching across tables with `EXISTS` and `LIKE`, ranked with `ORDER BY CASE`
- `GROUP BY`, `HAVING`, `COUNT(DISTINCT)` and integer math for stats
- `COALESCE` for fallbacks, and an `UPDATE` with subqueries to link records
- Showing a pair stored once from both sides with `UNION` and `NOT EXISTS`
- A real SQLite database in the browser, behind a small data layer

### Challenges

1. **Teams search:** make the search match team names too (another `EXISTS`).
2. **Team pages:** click a team in a profile to list every member, with one `JOIN`.
3. **Characters on no team:** find them with `LEFT JOIN … WHERE ct.character_id IS NULL`.
4. **Years to the big screen:** show how many years passed between each character's comic debut and their first MCU title.
5. **A new character:** add one to `CHARACTERS` with a power that already exists and one that doesn't, and check that `powers` only grows by one.

Compare yours with the [live demo](https://theoyanvno.github.io/marvel-character-database/) and the [source code](https://github.com/TheoYanvno/marvel-character-database).
