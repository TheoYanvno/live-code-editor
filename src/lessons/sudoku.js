// Built from guides/sudoku.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "sudoku",
 "title": "Sudoku Solver",
 "goals": [
  "Build a 9 x 9 grid of inputs from JavaScript and read it back as data",
  "Find every cell's row, column and box once and reuse it",
  "Track possible digits with bitmasks and the & | ~ << operators",
  "Solve by logic (constraint propagation) before guessing",
  "Use recursion and backtracking on copies of the board",
  "Make new puzzles that always have exactly one solution"
 ],
 "prereqs": [
  "HTML, CSS and JavaScript basics (functions, loops, arrays)",
  "Arrays of arrays, Set and template literals",
  "A Sudoku or two on paper helps: you'll teach the computer your own tricks"
 ],
 "sessions": [
  {
   "title": "A grid you can type in",
   "from": 0,
   "to": 2
  },
  {
   "title": "Solving by logic",
   "from": 3,
   "to": 5
  },
  {
   "title": "Guessing and backtracking",
   "from": 6,
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
   "parse": "",
   "board": "",
   "propagate": "",
   "search": "",
   "generate": "",
   "ui": "",
   "watch": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "The page and a 9 x 9 grid",
   "body": "Welcome! In this guide you'll rebuild my [Sudoku Solver](https://theoyanvno.github.io/sudoku-solver/) from a blank page. By the end it will check a puzzle as you type, solve any puzzle in a few milliseconds, replay its thinking step by step (\"8 can only go in r6c2 in box 4\"), and make brand-new puzzles at three levels that always have exactly one answer.\n\nStart with the page. The HTML has a header with a status line, an empty `<div id=\"grid\">`, and the buttons you'll wire up over the next steps. There are no cells in the HTML: typing 81 `<input>` tags by hand would be slow and easy to get wrong, so JavaScript makes them in a loop.\n\n### What to write\n\n- **HTML:** the header, `<div id=\"grid\" class=\"grid\">`, the buttons (Sample, Solve, Watch it solve, a level menu, New puzzle, Clear) and an empty `<ol id=\"log\">` for later.\n- **CSS:** `.grid` is a CSS Grid with `grid-template-columns: repeat(9, 40px)`. The `gap: 1px` over a gray background draws thin lines between cells. The thicker 3 x 3 lines come from `:nth-child()`: every 3rd and 6th cell in a row gets a dark right border, and rows 3 and 6 (cells 19-27 and 46-54) get a dark bottom border.\n- **JavaScript:** `buildGrid()` runs a `for` loop from 0 to 80, creates an `<input>` with `document.createElement('input')`, keeps only one digit 1-9, and pushes each input into a `cells` array. `readGrid()` turns the inputs back into 81 numbers (0 for blank), and `showGrid()` does the reverse. The Sample button loads an easy puzzle, then a hard one.\n\n### Why it's built this way\n\nThe grid on screen is just a view. The real puzzle is an array of 81 numbers, row by row: cell `i` is in row `Math.floor(i / 9)` and column `i % 9`. Every part of the solver works on that array, so it never has to touch the page, and the same code could run in a test or on a server.\n\n| Cell number | Row | Column |\n|---|---|---|\n| 0 | 0 (top) | 0 (left) |\n| 10 | 1 | 1 |\n| 80 | 8 (bottom) | 8 (right) |",
   "checks": [
    {
     "pane": "html",
     "label": "an element with id \"grid\"",
     "test": "/id=[\"']grid[\"']/",
     "hint": "Add <div id=\"grid\" class=\"grid\"></div>"
    },
    {
     "pane": "css",
     "label": "the grid has 9 columns",
     "test": "/\\.grid\\s*\\{[^}]*grid-template-columns:\\s*repeat\\(\\s*9/",
     "hint": "Give .grid grid-template-columns: repeat(9, 40px)"
    },
    {
     "pane": "js",
     "label": "a buildGrid() function",
     "test": "/function\\s+buildGrid\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a loop that runs 81 times",
     "test": "/for\\s*\\(\\s*let\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*81/",
     "hint": "for (let i = 0; i < 81; i++)"
    },
    {
     "pane": "js",
     "label": "inputs created from JavaScript",
     "test": "/createElement\\(\\s*['\"]input['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "readGrid() turns the inputs into numbers",
     "test": "/function\\s+readGrid\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why does JavaScript make the 81 cells instead of writing them in the HTML?",
     "options": [
      "Browsers limit how many inputs HTML can contain",
      "A loop makes all 81 the same way with no typos, and gives each one its number",
      "Inputs made in HTML can't be typed in"
     ],
     "answer": 1,
     "why": "The loop gives every cell the same setup and its index i, which the rest of the code relies on."
    },
    {
     "q": "Cell 40 is in which row and column (counting from 0)?",
     "options": [
      "Row 4, column 4",
      "Row 4, column 0",
      "Row 3, column 13"
     ],
     "answer": 0,
     "why": "Math.floor(40 / 9) is 4 and 40 % 9 is 4: the center cell of the grid."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<header class=\"bar\">\n  <h1>Sudoku Solver</h1>\n  <p id=\"status\" class=\"status\" role=\"status\">Type a puzzle or press Sample</p>\n</header>\n\n<main>\n  <div id=\"grid\" class=\"grid\" aria-label=\"Sudoku grid\"></div>\n  <div class=\"controls\">\n    <button id=\"sample\">Sample</button>\n    <button id=\"solve\">Solve</button>\n    <button id=\"watch\">Watch it solve</button>\n    <select id=\"level\" aria-label=\"Difficulty\">\n      <option value=\"easy\">Easy</option>\n      <option value=\"medium\" selected>Medium</option>\n      <option value=\"hard\">Hard</option>\n    </select>\n    <button id=\"new\">New puzzle</button>\n    <button id=\"clear\">Clear</button>\n  </div>\n  <ol id=\"log\" class=\"log\"></ol>\n</main>"
   },
   "css": {
    "base": "body {\n  margin: 0;\n  font-family: system-ui, sans-serif;\n  background: #f4f6fa;\n  color: #1c2430;\n  display: grid;\n  justify-items: center;\n}\n.bar { text-align: center; }\n.bar h1 { margin: 16px 0 4px; }\n.status { margin: 0 0 12px; color: #4b5563; min-height: 1.4em; }\n\n/* 9 columns of 40px cells; thicker lines after every third row and column */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(9, 40px);\n  border: 3px solid #1c2430;\n  background: #94a3b8;\n  gap: 1px;\n}\n.grid input {\n  box-sizing: border-box;\n  width: 40px;\n  height: 40px;\n  border: 0;\n  padding: 0;\n  text-align: center;\n  font-size: 20px;\n  background: #fff;\n  color: #1c2430;\n}\n.grid input:nth-child(9n + 3), .grid input:nth-child(9n + 6) { border-right: 2px solid #1c2430; }\n.grid input:nth-child(n + 19):nth-child(-n + 27),\n.grid input:nth-child(n + 46):nth-child(-n + 54) { border-bottom: 2px solid #1c2430; }\n.grid input.given { font-weight: 700; background: #e8edf5; }\n.grid input.solved { color: #1d4ed8; }\n.grid input.guess { background: #ffedd5; }\n.grid input.bad { background: #fde2e1; color: #b91c1c; }\n\n.controls { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 14px 0; }\nbutton, select { font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid #1c2430; background: #fff; cursor: pointer; }\n.log { max-width: 380px; max-height: 160px; overflow: auto; font-size: 14px; }\n.log .guess { color: #c2410c; }\n.log .backtrack { color: #b91c1c; }"
   },
   "js": {
    "ui": "const gridEl = document.getElementById('grid');\nconst statusEl = document.getElementById('status');\nconst cells = [];\nconst SAMPLES = [\n  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy\n  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard\n];\nlet sampleNumber = 0;\n\nfunction setStatus(text) { statusEl.textContent = text; }\n\nfunction buildGrid() {\n  for (let i = 0; i < 81; i++) {\n    const input = document.createElement('input');\n    input.inputMode = 'numeric';\n    input.maxLength = 1;\n    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);\n    input.addEventListener('input', () => {\n      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only\n      onChange();\n    });\n    gridEl.appendChild(input);\n    cells.push(input);\n  }\n}\n\nfunction readGrid() { return cells.map((c) => Number(c.value) || 0); }\n\nfunction showGrid(grid, filledClass = 'given') {\n  grid.forEach((v, i) => {\n    cells[i].value = v || '';\n    cells[i].className = v ? filledClass : '';\n  });\n}\n\nfunction onChange() { setStatus(''); }\n\ndocument.getElementById('sample').onclick = () => {\n  const text = SAMPLES[sampleNumber++ % SAMPLES.length];\n  showGrid([...text].map((ch) => Number(ch) || 0));\n  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');\n};\ndocument.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };",
    "go": "buildGrid();"
   }
  },
  {
   "title": "Rows, columns, boxes and peers",
   "body": "Every Sudoku rule talks about the same three groups: a digit can appear once in each **row**, each **column** and each **3 x 3 box**. The solver will ask \"which cells share a group with this one?\" thousands of times, so we work it out once, before anything else runs, and keep the answers in two lists.\n\n**PEERS** has one entry per cell: the 20 other cells it can't share a digit with. That's 8 in its row, 8 in its column, and 4 more in its box that weren't already counted.\n\n```svg The 20 peers of cell r5c2: its row, its column and the rest of its box\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 200\" font-family=\"sans-serif\"><rect x=\"10\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"10\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"10\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"30\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"30\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"50\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"50\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"70\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"70\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"70\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"70\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"90\" width=\"20\" height=\"20\" fill=\"#1d4ed8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"90\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"110\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"110\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"110\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"110\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"130\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"130\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"150\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"150\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"10\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"30\" y=\"170\" width=\"20\" height=\"20\" fill=\"#c7ddff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"50\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"90\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"110\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"130\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"150\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"170\" y=\"170\" width=\"20\" height=\"20\" fill=\"#ffffff\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><line x1=\"10\" y1=\"10\" x2=\"10\" y2=\"190\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"10\" y1=\"10\" x2=\"190\" y2=\"10\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"70\" y1=\"10\" x2=\"70\" y2=\"190\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"10\" y1=\"70\" x2=\"190\" y2=\"70\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"130\" y1=\"10\" x2=\"130\" y2=\"190\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"10\" y1=\"130\" x2=\"190\" y2=\"130\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"190\" y1=\"10\" x2=\"190\" y2=\"190\" stroke=\"#1c2430\" stroke-width=\"2\"/><line x1=\"10\" y1=\"190\" x2=\"190\" y2=\"190\" stroke=\"#1c2430\" stroke-width=\"2\"/><rect x=\"210\" y=\"40\" width=\"16\" height=\"16\" fill=\"#1d4ed8\"/><text x=\"232\" y=\"53\" font-size=\"12\" fill=\"#1c2430\">the cell (r5c2)</text><rect x=\"210\" y=\"70\" width=\"16\" height=\"16\" fill=\"#c7ddff\" stroke=\"#94a3b8\"/><text x=\"232\" y=\"83\" font-size=\"12\" fill=\"#1c2430\">its 20 peers</text><text x=\"210\" y=\"118\" font-size=\"11\" fill=\"#475569\">8 in the row</text><text x=\"210\" y=\"134\" font-size=\"11\" fill=\"#475569\">8 in the column</text><text x=\"210\" y=\"150\" font-size=\"11\" fill=\"#475569\">4 more in the box</text></svg>\n```\n\n**UNITS** is the 27 groups themselves (9 rows, then 9 columns, then 9 boxes), each a list of 9 cell numbers. `UNIT_NAMES` holds a readable name for each so the solver can explain itself later. `cellName(i)` turns a number into a name like `r5c2` (row 5, column 2, counting from 1 for people).\n\n### Finding a cell's box\n\nThe box math is the only tricky part. `r - (r % 3)` rounds a row down to the top row of its box: rows 3, 4 and 5 all give 3. Do the same for the column and you have the box's top-left corner; `k / 3` and `k % 3` then walk its 9 cells.\n\nA `Set` collects the peers because the row, column and box overlap: the cell itself shows up three times and some box cells show up twice. A `Set` keeps each number once, and `set.delete(i)` removes the cell itself.\n\n### Try it\n\nThe `go` block now logs `PEERS[0].length` and `UNITS.length`. Open the console: you should see 20 and 27.",
   "checks": [
    {
     "pane": "js",
     "label": "a PEERS list",
     "test": "/const\\s+PEERS\\s*=/"
    },
    {
     "pane": "js",
     "label": "the cell isn't its own peer",
     "test": "/set\\.delete\\(\\s*i\\s*\\)/",
     "hint": "Remove the cell itself with set.delete(i)"
    },
    {
     "pane": "js",
     "label": "a UNITS list of rows, columns and boxes",
     "test": "/const\\s+UNITS\\s*=/"
    },
    {
     "pane": "js",
     "label": "a cellName() helper",
     "test": "/const\\s+cellName\\s*=/"
    }
   ],
   "quiz": [
    {
     "q": "Why does each cell have 20 peers and not 24 (8 + 8 + 8)?",
     "options": [
      "The corners of the grid have fewer",
      "Four of the box cells are already in the row or column, so they'd be counted twice",
      "Sudoku only checks 20 cells"
     ],
     "answer": 1,
     "why": "The box shares 2 cells with the row and 2 with the column; the Set keeps them once, leaving 8 + 8 + 4."
    },
    {
     "q": "Why compute PEERS once at the start instead of every time it's needed?",
     "options": [
      "The answer never changes, and the solver asks for it thousands of times",
      "JavaScript can only run loops at startup",
      "It uses less memory than computing it each time"
     ],
     "answer": 0,
     "why": "Peers depend only on the grid shape, not the puzzle, so working them out once saves repeating the same math."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "data": "// Cells are numbered 0-80, row by row: row = Math.floor(i / 9), column = i % 9.\n\n// The 20 cells that share a row, column or 3 x 3 box with each cell. Worked out once.\nconst PEERS = Array.from({ length: 81 }, (_, i) => {\n  const r = Math.floor(i / 9);\n  const c = i % 9;\n  const br = r - (r % 3);   // top row of this cell's box\n  const bc = c - (c % 3);   // left column of this cell's box\n  const set = new Set();\n  for (let k = 0; k < 9; k++) {\n    set.add(r * 9 + k);                                       // same row\n    set.add(k * 9 + c);                                       // same column\n    set.add((br + Math.floor(k / 3)) * 9 + bc + (k % 3));     // same box\n  }\n  set.delete(i);              // a cell isn't its own peer\n  return [...set];\n});\n\n// The 27 units: 9 rows, 9 columns and 9 boxes, each a list of 9 cell numbers.\nconst UNITS = [\n  ...Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => r * 9 + c)),\n  ...Array.from({ length: 9 }, (_, c) => Array.from({ length: 9 }, (_, r) => r * 9 + c)),\n  ...Array.from({ length: 9 }, (_, b) =>\n    Array.from({ length: 9 }, (_, k) => (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3))),\n];\nconst UNIT_NAMES = [\n  ...Array.from({ length: 9 }, (_, i) => `row ${i + 1}`),\n  ...Array.from({ length: 9 }, (_, i) => `column ${i + 1}`),\n  ...Array.from({ length: 9 }, (_, i) => `box ${i + 1}`),\n];\n\nconst cellName = (i) => `r${Math.floor(i / 9) + 1}c${(i % 9) + 1}`;",
    "go": "buildGrid();\nconsole.log('Cell r1c1 has', PEERS[0].length, 'peers, and there are', UNITS.length, 'units');"
   }
  },
  {
   "title": "Reading a puzzle and catching mistakes",
   "body": "People share Sudoku puzzles as 81 characters: digits for clues and `0` or `.` for blanks, like `53..7....6..195....` and so on. `parse(text)` turns that into the 81-number array, ignoring spaces, line breaks and `|` separators. If something's wrong it throws an `Error` with a message a person can act on: which character was unexpected, or how many cells it found instead of 81.\n\n`conflicts(grid)` checks the rules. For every filled cell, it looks at its peers; any peer with the same digit is a conflict, and both cells go into a `Set`. Thanks to `PEERS`, this is two short loops instead of separate row, column and box checks.\n\nNow the page can help while you type: `onChange()` runs on every keystroke, adds the `bad` class to conflicting cells with `classList.toggle('bad', ...)`, and explains the problem in the status line. The Sample button uses `parse()` too.\n\n### Try it\n\nLoad the sample, then type a 5 into the empty cell right next to the 5 in the top row. Both 5s turn red. Delete it and they go back to normal.\n\n| Input | parse() gives |\n|---|---|\n| `53..7....` + 72 more | an array of 81 numbers |\n| `12x` | Error: Unexpected character \"x\" |\n| `123` | Error: A puzzle needs 81 cells, but this has 3 |",
   "checks": [
    {
     "pane": "js",
     "label": "a parse() function",
     "test": "/function\\s+parse\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "parse() reports the wrong number of cells",
     "test": "/chars\\.length\\s*!==\\s*81/"
    },
    {
     "pane": "js",
     "label": "a conflicts() function",
     "test": "/function\\s+conflicts\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "conflicting cells are marked \"bad\"",
     "test": "/classList\\.toggle\\(\\s*['\"]bad['\"]/",
     "hint": "In onChange(), use c.classList.toggle('bad', bad.has(i))"
    }
   ],
   "quiz": [
    {
     "q": "Why does conflicts() put both cells of a clash in the Set?",
     "options": [
      "So the Set has an even number of items",
      "Either one could be the mistake, so both are shown in red",
      "The solver needs both to start"
     ],
     "answer": 1,
     "why": "The program can't know which 5 you meant; highlighting both lets you decide."
    },
    {
     "q": "What should parse() do with a puzzle that has only 80 characters?",
     "options": [
      "Guess where the missing cell goes",
      "Throw an error that says how many cells it found",
      "Add a 0 at the end"
     ],
     "answer": 1,
     "why": "Guessing would quietly give a different puzzle; a clear error tells the person exactly what to fix."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "parse": "// Reads 81 characters: 1-9 for clues, 0 or . for blanks. Spaces, newlines and | are ignored.\nfunction parse(text) {\n  const chars = String(text).replace(/[\\s|]/g, '').split('');\n  const bad = chars.find((ch) => !/[0-9.]/.test(ch));\n  if (bad) throw new Error(`Unexpected character \"${bad}\". Use 1-9 for clues and 0 or . for blanks.`);\n  if (chars.length !== 81) throw new Error(`A puzzle needs 81 cells, but this has ${chars.length}.`);\n  return chars.map((ch) => (/[1-9]/.test(ch) ? Number(ch) : 0));\n}\n\n// Every cell that has the same digit as one of its peers.\nfunction conflicts(grid) {\n  const bad = new Set();\n  for (let i = 0; i < 81; i++) {\n    if (!grid[i]) continue;\n    for (const p of PEERS[i]) if (grid[p] === grid[i]) { bad.add(i); bad.add(p); }\n  }\n  return [...bad];\n}",
    "ui": "const gridEl = document.getElementById('grid');\nconst statusEl = document.getElementById('status');\nconst cells = [];\nconst SAMPLES = [\n  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy\n  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard\n];\nlet sampleNumber = 0;\n\nfunction setStatus(text) { statusEl.textContent = text; }\n\nfunction buildGrid() {\n  for (let i = 0; i < 81; i++) {\n    const input = document.createElement('input');\n    input.inputMode = 'numeric';\n    input.maxLength = 1;\n    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);\n    input.addEventListener('input', () => {\n      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only\n      onChange();\n    });\n    gridEl.appendChild(input);\n    cells.push(input);\n  }\n}\n\nfunction readGrid() { return cells.map((c) => Number(c.value) || 0); }\n\nfunction showGrid(grid, filledClass = 'given') {\n  grid.forEach((v, i) => {\n    cells[i].value = v || '';\n    cells[i].className = v ? filledClass : '';\n  });\n}\n\n// Red cells: the same digit twice in a row, column or box.\nfunction onChange() {\n  const bad = new Set(conflicts(readGrid()));\n  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));\n  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');\n}\n\ndocument.getElementById('sample').onclick = () => {\n  const text = SAMPLES[sampleNumber++ % SAMPLES.length];\n  showGrid(parse(text));\n  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');\n};\ndocument.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };"
   }
  },
  {
   "title": "Possible digits as bitmasks",
   "body": "When you solve a Sudoku on paper, you pencil in the digits that could still go in each cell. The solver does the same thing, but instead of a list of digits it keeps **one number per cell** whose bits say which digits are possible. Bit 1 stands for digit 1, bit 2 for digit 2, up to bit 9 (bit 0 is never used, which keeps the math simple).\n\n```svg One cell's candidates as a bitmask: bits 8, 5 and 2 are on\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 115\" font-family=\"sans-serif\"><rect x=\"10\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"25\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"25\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">9</text><rect x=\"42\" y=\"30\" width=\"30\" height=\"30\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"57\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">1</text><text x=\"57\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">8</text><rect x=\"74\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"89\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"89\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">7</text><rect x=\"106\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"121\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"121\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">6</text><rect x=\"138\" y=\"30\" width=\"30\" height=\"30\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"153\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">1</text><text x=\"153\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">5</text><rect x=\"170\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"185\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"185\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">4</text><rect x=\"202\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"217\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"217\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">3</text><rect x=\"234\" y=\"30\" width=\"30\" height=\"30\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"249\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">1</text><text x=\"249\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">2</text><rect x=\"266\" y=\"30\" width=\"30\" height=\"30\" fill=\"#ffffff\" stroke=\"#475569\"/><text x=\"281\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"281\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">1</text><rect x=\"298\" y=\"30\" width=\"30\" height=\"30\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"313\" y=\"51\" text-anchor=\"middle\" font-size=\"15\" fill=\"#1c2430\">0</text><text x=\"313\" y=\"22\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">-</text><text x=\"10\" y=\"86\" font-size=\"12\" fill=\"#1c2430\">bits 8, 5 and 2 are on: this cell could be 8, 5 or 2</text><text x=\"10\" y=\"104\" font-size=\"12\" fill=\"#475569\">bit 0 is never used, so digit d is simply bit d (1 &lt;&lt; d)</text></svg>\n```\n\n| Operation | Code | Meaning |\n|---|---|---|\n| everything possible | `ALL = 0b1111111110` | bits 1-9 on |\n| is d possible? | `mask & (1 << d)` | not 0 means yes |\n| rule d out | `mask &= ~(1 << d)` | turn bit d off |\n| how many left? | `bitCount(mask)` | counts the 1 bits |\n\nWhy bits instead of arrays? Ruling a digit out is one tiny operation instead of searching and splicing an array, and copying the whole board for a guess (coming in session 3) is just copying 81 numbers.\n\n### What to write\n\n- `newBoard(grid)` makes `{ values, cands }`: every cell starts with `ALL`, then each clue is placed.\n- `place(b, i, d)` puts `d` in cell `i`, clears that cell's candidates, and removes `d` from all 20 peers with `b.cands[p] &= ~(1 << d)`.\n- `cloneBoard(b)` copies both arrays (used later for guessing).\n- In the page, clicking an empty cell calls `showOptions(i)`, which tells you what could go there.\n\n### Try it\n\nLoad the sample and click the empty cell in the top-left box. The status line lists its possible digits. Check it against the puzzle: are those really the only ones that fit?",
   "checks": [
    {
     "pane": "js",
     "label": "ALL has bits 1-9 on",
     "test": "/const\\s+ALL\\s*=\\s*0b1111111110/",
     "hint": "const ALL = 0b1111111110"
    },
    {
     "pane": "js",
     "label": "a place() function",
     "test": "/function\\s+place\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "placing a digit rules it out for every peer",
     "test": "/cands\\[p\\]\\s*&=\\s*~\\(\\s*1\\s*<<\\s*d\\s*\\)/",
     "hint": "for (const p of PEERS[i]) b.cands[p] &= ~(1 << d)"
    },
    {
     "pane": "js",
     "label": "clicking a cell shows its options",
     "test": "/function\\s+showOptions\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "A cell's mask is 0b0000100100. Which digits could go there?",
     "options": [
      "2 and 5",
      "5 and 8",
      "3 and 6"
     ],
     "answer": 0,
     "why": "Counting from bit 0 on the right, bits 2 and 5 are on, and bit d means digit d."
    },
    {
     "q": "What does b.cands[p] &= ~(1 << d) do?",
     "options": [
      "Adds d to cell p's candidates",
      "Turns off bit d, so d is no longer possible in cell p",
      "Sets cell p to the digit d"
     ],
     "answer": 1,
     "why": "~(1 << d) has every bit on except d; AND-ing with it clears only bit d."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "board": "// Each cell keeps a bitmask of the digits that could still go there (\"candidates\").\n// Bit d stands for digit d, so ALL has bits 1-9 on.\nconst ALL = 0b1111111110;\n\nconst bitCount = (m) => { let n = 0; while (m) { m &= m - 1; n++; } return n; };\nconst digitsOf = (m) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => m & (1 << d));\n\nfunction newBoard(grid) {\n  const b = { values: new Array(81).fill(0), cands: new Array(81).fill(ALL) };\n  for (let i = 0; i < 81; i++) if (grid[i]) place(b, i, grid[i]);\n  return b;\n}\n\n// Putting d in cell i: that cell is done, and none of its 20 peers can be d any more.\nfunction place(b, i, d) {\n  b.values[i] = d;\n  b.cands[i] = 0;\n  for (const p of PEERS[i]) b.cands[p] &= ~(1 << d);\n}\n\nconst cloneBoard = (b) => ({ values: b.values.slice(), cands: b.cands.slice() });",
    "ui": "const gridEl = document.getElementById('grid');\nconst statusEl = document.getElementById('status');\nconst cells = [];\nconst SAMPLES = [\n  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy\n  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard\n];\nlet sampleNumber = 0;\n\nfunction setStatus(text) { statusEl.textContent = text; }\n\nfunction buildGrid() {\n  for (let i = 0; i < 81; i++) {\n    const input = document.createElement('input');\n    input.inputMode = 'numeric';\n    input.maxLength = 1;\n    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);\n    input.addEventListener('input', () => {\n      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only\n      onChange();\n    });\n    input.addEventListener('focus', () => showOptions(i));\n    gridEl.appendChild(input);\n    cells.push(input);\n  }\n}\n\nfunction readGrid() { return cells.map((c) => Number(c.value) || 0); }\n\nfunction showGrid(grid, filledClass = 'given') {\n  grid.forEach((v, i) => {\n    cells[i].value = v || '';\n    cells[i].className = v ? filledClass : '';\n  });\n}\n\n// Red cells: the same digit twice in a row, column or box.\nfunction onChange() {\n  const bad = new Set(conflicts(readGrid()));\n  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));\n  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');\n}\n\n// When you click an empty cell, say which digits could still go there.\nfunction showOptions(i) {\n  if (cells[i].value) return;\n  const options = digitsOf(newBoard(readGrid()).cands[i]);\n  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);\n}\n\ndocument.getElementById('sample').onclick = () => {\n  const text = SAMPLES[sampleNumber++ % SAMPLES.length];\n  showGrid(parse(text));\n  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');\n};\ndocument.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };"
   }
  },
  {
   "title": "Rule one: only one digit fits",
   "body": "The first trick everyone learns: if a cell has only **one** possible digit left, that's its answer. In bitmask terms, `bitCount(b.cands[i]) === 1`. Placing it rules that digit out of its peers, which can leave *another* cell with one option, so `propagate()` keeps looping until a whole pass changes nothing. This is called **constraint propagation**: each answer spreads new information to its neighbors.\n\n`propagate()` also notices when the puzzle is impossible: an empty cell whose mask is 0 has nothing that can go there, so it returns `false`.\n\nEach placement calls `log?.(...)` with what happened and why. The `?.` means \"only if a log function was passed in\": the Solve button doesn't need the log, but the Watch it solve button (session 3) will.\n\n### What to write\n\n- `propagate(b, log)` with a `while (changed)` loop around a pass over all 81 cells.\n- The Solve button: build a board from the page, run `propagate()`, show the new digits in blue with `showResult()`, and say how many cells are still empty.\n\n### Try it\n\nLoad the easy sample and press **Solve**. Rule one alone fills in a lot of cells, but probably not all of them. That's what the next step fixes.",
   "checks": [
    {
     "pane": "js",
     "label": "a propagate() function",
     "test": "/function\\s+propagate\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a cell with one candidate gets that digit",
     "test": "/bitCount\\(\\s*b\\.cands\\[i\\]\\s*\\)\\s*===\\s*1/"
    },
    {
     "pane": "js",
     "label": "it repeats until nothing changes",
     "test": "/while\\s*\\(\\s*changed\\s*\\)/",
     "hint": "Wrap the pass in while (changed) { changed = false; ... }"
    },
    {
     "pane": "js",
     "label": "the Solve button is wired up",
     "test": "/getElementById\\(\\s*['\"]solve['\"]\\s*\\)\\.onclick/"
    }
   ],
   "quiz": [
    {
     "q": "Why does propagate() loop until a whole pass changes nothing?",
     "options": [
      "To use up time so the result looks impressive",
      "Each placed digit can leave other cells with a single option, which the next pass can fill",
      "JavaScript needs two passes to update an array"
     ],
     "answer": 1,
     "why": "Answers unlock more answers; stopping after one pass would miss them."
    },
    {
     "q": "What does it mean when an empty cell's mask becomes 0?",
     "options": [
      "The cell is solved",
      "No digit can go there, so the board is impossible",
      "The cell can hold any digit"
     ],
     "answer": 1,
     "why": "Every digit has been ruled out by its peers: something placed earlier was wrong."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "propagate": "// Fills in every cell the rules force, repeating until nothing changes.\n// Returns false if the board turns out to be impossible.\nfunction propagate(b, log) {\n  let changed = true;\n  while (changed) {\n    changed = false;\n    for (let i = 0; i < 81; i++) {\n      if (b.values[i]) continue;\n      if (!b.cands[i]) return false;                 // an empty cell with no options left\n      if (bitCount(b.cands[i]) === 1) {              // only one fits\n        const d = digitsOf(b.cands[i])[0];\n        place(b, i, d);\n        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });\n        changed = true;\n      }\n    }\n  }\n  return true;\n}",
    "ui": "const gridEl = document.getElementById('grid');\nconst statusEl = document.getElementById('status');\nconst cells = [];\nconst SAMPLES = [\n  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy\n  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard\n];\nlet sampleNumber = 0;\n\nfunction setStatus(text) { statusEl.textContent = text; }\n\nfunction buildGrid() {\n  for (let i = 0; i < 81; i++) {\n    const input = document.createElement('input');\n    input.inputMode = 'numeric';\n    input.maxLength = 1;\n    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);\n    input.addEventListener('input', () => {\n      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only\n      onChange();\n    });\n    input.addEventListener('focus', () => showOptions(i));\n    gridEl.appendChild(input);\n    cells.push(input);\n  }\n}\n\nfunction readGrid() { return cells.map((c) => Number(c.value) || 0); }\n\nfunction showGrid(grid, filledClass = 'given') {\n  grid.forEach((v, i) => {\n    cells[i].value = v || '';\n    cells[i].className = v ? filledClass : '';\n  });\n}\n\n// Red cells: the same digit twice in a row, column or box.\nfunction onChange() {\n  const bad = new Set(conflicts(readGrid()));\n  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));\n  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');\n}\n\n// When you click an empty cell, say which digits could still go there.\nfunction showOptions(i) {\n  if (cells[i].value) return;\n  const options = digitsOf(newBoard(readGrid()).cands[i]);\n  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);\n}\n\n// Shows the digits the solver added, in blue, without touching the clues.\nfunction showResult(start, values) {\n  values.forEach((v, i) => { if (!start[i] && v) { cells[i].value = v; cells[i].className = 'solved'; } });\n}\n\ndocument.getElementById('sample').onclick = () => {\n  const text = SAMPLES[sampleNumber++ % SAMPLES.length];\n  showGrid(parse(text));\n  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');\n};\ndocument.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };\ndocument.getElementById('solve').onclick = () => {\n  const start = readGrid();\n  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }\n  const b = newBoard(start);\n  const ok = propagate(b);\n  showResult(start, b.values);\n  const left = b.values.filter((v) => !v).length;\n  setStatus(!ok ? 'These clues contradict each other' : left ? `Logic filled what it could; ${left} cells are still empty` : 'Solved by logic alone!');\n};"
   }
  },
  {
   "title": "Rule two: only one spot for a digit",
   "body": "The second trick looks at it the other way around. Take row 6: if the digit 8 can only go in **one** of its empty cells, it must go there, even if that cell has other candidates too. Sudoku players call this a \"hidden single\".\n\nFor every one of the 27 units and every digit 1-9, the code counts the cells where that digit is still possible:\n\n| count | meaning |\n|---|---|\n| digit already placed | skip this digit |\n| 0 | impossible: the digit has nowhere to go, return false |\n| 1 | place it there |\n| 2 or more | not decided yet |\n\nThat's three nested loops (units, digits, cells), but each one is short: 27 x 9 x 9 is only about 2,000 checks per pass.\n\nWith both rules, `propagate()` solves easy puzzles completely without ever guessing. The log message now names the unit too: \"8 can only go in r6c2 in box 4\".\n\n### Try it\n\nLoad the easy sample and press **Solve**: it's solved by logic alone. Now press **Sample** again for the hard puzzle and **Solve**: logic gets stuck with cells still empty. Guessing comes next.",
   "checks": [
    {
     "pane": "js",
     "label": "every unit is checked",
     "test": "/for\\s*\\(\\s*let\\s+u\\s*=\\s*0\\s*;\\s*u\\s*<\\s*UNITS\\.length/"
    },
    {
     "pane": "js",
     "label": "a digit with one spot goes there",
     "test": "/count\\s*===\\s*1/"
    },
    {
     "pane": "js",
     "label": "a digit with no spot means a contradiction",
     "test": "/count\\s*===\\s*0\\s*\\)\\s*return\\s+false/"
    }
   ],
   "quiz": [
    {
     "q": "In row 6, the digit 8 is possible only in r6c2, which also allows 3 and 5. What goes in r6c2?",
     "options": [
      "Nothing yet: it still has three options",
      "8, because it has nowhere else to go in row 6",
      "3, the smallest option"
     ],
     "answer": 1,
     "why": "Row 6 needs an 8 somewhere, and r6c2 is the only place it fits."
    },
    {
     "q": "Why do easy puzzles never need a guess?",
     "options": [
      "They are made so that rules one and two can always find a next cell",
      "Easy puzzles have fewer rules",
      "The solver guesses silently"
     ],
     "answer": 0,
     "why": "The generator (session 4) grades a puzzle easy or medium only if logic alone solves it."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "propagate": "// Fills in every cell the rules force, repeating until nothing changes:\n//  - only one fits: a cell with a single candidate\n//  - only one spot: a digit that fits in just one cell of a row, column or box\n// Returns false if the board turns out to be impossible.\nfunction propagate(b, log) {\n  let changed = true;\n  while (changed) {\n    changed = false;\n    for (let i = 0; i < 81; i++) {\n      if (b.values[i]) continue;\n      if (!b.cands[i]) return false;                 // an empty cell with no options left\n      if (bitCount(b.cands[i]) === 1) {              // only one fits\n        const d = digitsOf(b.cands[i])[0];\n        place(b, i, d);\n        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });\n        changed = true;\n      }\n    }\n    for (let u = 0; u < UNITS.length; u++) {\n      for (let d = 1; d <= 9; d++) {\n        let spot = -1;\n        let count = 0;\n        let placed = false;\n        for (const i of UNITS[u]) {\n          if (b.values[i] === d) { placed = true; break; }\n          if (b.cands[i] & (1 << d)) { spot = i; count++; }\n        }\n        if (placed) continue;\n        if (count === 0) return false;               // d has nowhere to go in this unit\n        if (count === 1) {                           // only one spot for d\n          place(b, spot, d);\n          log?.({ type: 'hidden', index: spot, value: d, reason: `${d} can only go in ${cellName(spot)} in ${UNIT_NAMES[u]}` });\n          changed = true;\n        }\n      }\n    }\n  }\n  return true;\n}"
   }
  },
  {
   "title": "Spotting a dead end",
   "body": "Hard puzzles get stuck: no cell has one option and no digit has one spot. Then the solver has to **guess**, and a wrong guess eventually produces an impossible board. Before writing the guessing code, we need a reliable way to notice \"this board can't be finished\".\n\n`deadEnd(b)` checks two things:\n\n1. An empty cell with no candidates left (mask 0).\n2. A unit where some digit can't go anywhere. It ORs together every cell in the unit (placed digits as their bit, empty cells as their candidates). If the result isn't `ALL`, some digit is missing from the whole unit.\n\n`propagate()` now ends with `return !deadEnd(b)`: true means \"still possible\", false means \"give up on this board\".\n\n### Why check both?\n\nThe first catches cells that are squeezed out; the second catches digits that are squeezed out. A wrong guess can cause either, and catching it early saves the search from wandering down a branch that can never work.",
   "checks": [
    {
     "pane": "js",
     "label": "a deadEnd() function",
     "test": "/function\\s+deadEnd\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "each unit must still have room for every digit",
     "test": "/seen\\s*!==\\s*ALL/"
    },
    {
     "pane": "js",
     "label": "propagate() reports dead ends",
     "test": "/return\\s+!deadEnd\\(\\s*b\\s*\\)/",
     "hint": "End propagate() with return !deadEnd(b);"
    }
   ],
   "quiz": [
    {
     "q": "In a unit, the OR of all its cells is 0b1011111110. What does that tell you?",
     "options": [
      "The unit is solved",
      "Digit 8 can't go anywhere in this unit, so the board is a dead end",
      "Digit 8 is placed twice"
     ],
     "answer": 1,
     "why": "Bit 8 is off: no cell in the unit has 8 placed or possible."
    },
    {
     "q": "Why catch dead ends as early as possible?",
     "options": [
      "So the solver stops exploring a branch that can never be completed",
      "To make the console quieter",
      "Because the grid can only hold one dead end"
     ],
     "answer": 0,
     "why": "Every extra step on a doomed branch is wasted work; noticing early makes backtracking fast."
    }
   ],
   "session": 2,
   "minutes": 12,
   "js": {
    "propagate": "// An empty cell with no candidates, or a digit with no place left in a unit,\n// means an earlier guess was wrong.\nfunction deadEnd(b) {\n  for (let i = 0; i < 81; i++) if (!b.values[i] && !b.cands[i]) return true;\n  for (const unit of UNITS) {\n    let seen = 0;\n    for (const i of unit) seen |= b.values[i] ? 1 << b.values[i] : b.cands[i];\n    if (seen !== ALL) return true;\n  }\n  return false;\n}\n\n// Fills in every cell the rules force, repeating until nothing changes:\n//  - only one fits: a cell with a single candidate\n//  - only one spot: a digit that fits in just one cell of a row, column or box\n// Returns false if the board turns out to be impossible.\nfunction propagate(b, log) {\n  let changed = true;\n  while (changed) {\n    changed = false;\n    for (let i = 0; i < 81; i++) {\n      if (b.values[i]) continue;\n      if (!b.cands[i]) return false;                 // an empty cell with no options left\n      if (bitCount(b.cands[i]) === 1) {              // only one fits\n        const d = digitsOf(b.cands[i])[0];\n        place(b, i, d);\n        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });\n        changed = true;\n      }\n    }\n    for (let u = 0; u < UNITS.length; u++) {\n      for (let d = 1; d <= 9; d++) {\n        let spot = -1;\n        let count = 0;\n        let placed = false;\n        for (const i of UNITS[u]) {\n          if (b.values[i] === d) { placed = true; break; }\n          if (b.cands[i] & (1 << d)) { spot = i; count++; }\n        }\n        if (placed) continue;\n        if (count === 0) return false;               // d has nowhere to go in this unit\n        if (count === 1) {                           // only one spot for d\n          place(b, spot, d);\n          log?.({ type: 'hidden', index: spot, value: d, reason: `${d} can only go in ${cellName(spot)} in ${UNIT_NAMES[u]}` });\n          changed = true;\n        }\n      }\n    }\n  }\n  return !deadEnd(b);\n}"
   }
  },
  {
   "title": "Guess, check, and undo",
   "body": "Now the heart of the solver: a **recursive** `search(b)`.\n\n1. Run `propagate()`. If it fails, this board is a dead end: return `null`.\n2. If every cell is filled, return the board: solved.\n3. Otherwise pick the empty cell with the **fewest** candidates (`bestCell`). With 2 options, a guess is right half the time; with 5, only a fifth.\n4. For each candidate: copy the board, place the guess on the **copy**, and call `search()` on it. If that returns a board, pass it up. If not, count a backtrack and try the next digit.\n\n```svg Backtracking: each guess runs on a copy, and a dead end just throws the copy away\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 340 190\" font-family=\"sans-serif\"><rect x=\"120\" y=\"8\" width=\"100\" height=\"30\" rx=\"6\" fill=\"#e2e8f0\"/><text x=\"170\" y=\"28\" text-anchor=\"middle\" font-size=\"12\">stuck: r3c7 = 4 or 9</text><line x1=\"150\" y1=\"38\" x2=\"80\" y2=\"72\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"190\" y1=\"38\" x2=\"260\" y2=\"72\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"20\" y=\"72\" width=\"120\" height=\"30\" rx=\"6\" fill=\"#ffedd5\"/><text x=\"80\" y=\"92\" text-anchor=\"middle\" font-size=\"12\">guess 4, propagate</text><rect x=\"200\" y=\"72\" width=\"120\" height=\"30\" rx=\"6\" fill=\"#ffedd5\"/><text x=\"260\" y=\"92\" text-anchor=\"middle\" font-size=\"12\">guess 9, propagate</text><line x1=\"80\" y1=\"102\" x2=\"80\" y2=\"132\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"260\" y1=\"102\" x2=\"260\" y2=\"132\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"20\" y=\"132\" width=\"120\" height=\"30\" rx=\"6\" fill=\"#fde2e1\"/><text x=\"80\" y=\"152\" text-anchor=\"middle\" font-size=\"12\">dead end: undo</text><rect x=\"200\" y=\"132\" width=\"120\" height=\"30\" rx=\"6\" fill=\"#bbf7d0\"/><text x=\"260\" y=\"152\" text-anchor=\"middle\" font-size=\"12\">solved</text><text x=\"170\" y=\"182\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">each guess works on a copy, so undoing is just throwing the copy away</text></svg>\n```\n\nWorking on copies is what makes undoing easy: the original board was never changed, so \"undo\" is simply moving on to the next digit. That's what `cloneBoard()` from step 4 was for.\n\n`solve(grid)` wraps it all up and returns `{ solution, stats, steps }`. The stats count cells filled by each rule, guesses and backtracks. The Solve button now uses `solve()` and reports how long it took (usually a few milliseconds, even for hard puzzles).\n\n### Try it\n\nLoad the hard sample and press **Solve**. Look at the status line: how many guesses and backtracks did it need?",
   "checks": [
    {
     "pane": "js",
     "label": "a bestCell() function",
     "test": "/function\\s+bestCell\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a solve() function",
     "test": "/function\\s+solve\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "guesses run on a copy of the board",
     "test": "/const\\s+next\\s*=\\s*cloneBoard\\(\\s*b\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "wrong guesses are counted as backtracks",
     "test": "/stats\\.backtracks\\+\\+/"
    }
   ],
   "quiz": [
    {
     "q": "Why guess in the cell with the fewest candidates?",
     "options": [
      "It is closest to the top of the grid",
      "Fewer options means each guess is more likely to be right, and the search tree stays small",
      "It always has exactly two options"
     ],
     "answer": 1,
     "why": "Two options means a 50% first try; picking a cell with many options multiplies the work."
    },
    {
     "q": "Why does each guess happen on a copy of the board?",
     "options": [
      "Copies run faster in JavaScript",
      "If the guess fails, the original is untouched, so undoing costs nothing",
      "The page needs a second grid to draw"
     ],
     "answer": 1,
     "why": "No need to remember and reverse every change the guess caused; just drop the copy."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "search": "// The empty cell with the fewest candidates: guessing there has the best odds.\nfunction bestCell(b) {\n  let best = -1;\n  let fewest = 10;\n  for (let i = 0; i < 81; i++) {\n    if (b.values[i]) continue;\n    const n = bitCount(b.cands[i]);\n    if (n < fewest) { fewest = n; best = i; if (n === 2) break; }\n  }\n  return best;\n}\n\n// Logic first; when it gets stuck, guess on a copy of the board and undo if it fails.\n// Returns { solution, stats, steps } (solution is null when there isn't one).\nfunction solve(grid, { record = false, order = null } = {}) {\n  const stats = { singles: 0, hidden: 0, guesses: 0, backtracks: 0 };\n  const steps = [];\n  const log = (s) => {\n    if (s.type === 'single') stats.singles++;\n    if (s.type === 'hidden') stats.hidden++;\n    if (record) steps.push(s);\n  };\n  if (conflicts(grid).length) return { solution: null, stats, steps };\n\n  const search = (b) => {\n    if (!propagate(b, log)) return null;\n    if (b.values.every(Boolean)) return b;\n    const i = bestCell(b);\n    let digits = digitsOf(b.cands[i]);\n    if (order) digits = order(digits);\n    for (const d of digits) {\n      stats.guesses++;\n      if (record) steps.push({ type: 'guess', index: i, value: d, reason: `guess ${d} in ${cellName(i)} (${digits.length} options)`, snapshot: b.values.slice() });\n      const next = cloneBoard(b);\n      place(next, i, d);\n      const result = search(next);\n      if (result) return result;\n      stats.backtracks++;\n      if (record) steps.push({ type: 'backtrack', index: i, value: d, reason: `${d} in ${cellName(i)} led to a dead end, undo`, snapshot: b.values.slice() });\n    }\n    return null;\n  };\n\n  const result = search(newBoard(grid));\n  return { solution: result ? result.values : null, stats, steps };\n}",
    "ui": "const gridEl = document.getElementById('grid');\nconst statusEl = document.getElementById('status');\nconst cells = [];\nconst SAMPLES = [\n  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy\n  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard\n];\nlet sampleNumber = 0;\n\nfunction setStatus(text) { statusEl.textContent = text; }\n\nfunction buildGrid() {\n  for (let i = 0; i < 81; i++) {\n    const input = document.createElement('input');\n    input.inputMode = 'numeric';\n    input.maxLength = 1;\n    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);\n    input.addEventListener('input', () => {\n      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only\n      onChange();\n    });\n    input.addEventListener('focus', () => showOptions(i));\n    gridEl.appendChild(input);\n    cells.push(input);\n  }\n}\n\nfunction readGrid() { return cells.map((c) => Number(c.value) || 0); }\n\nfunction showGrid(grid, filledClass = 'given') {\n  grid.forEach((v, i) => {\n    cells[i].value = v || '';\n    cells[i].className = v ? filledClass : '';\n  });\n}\n\n// Red cells: the same digit twice in a row, column or box.\nfunction onChange() {\n  const bad = new Set(conflicts(readGrid()));\n  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));\n  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');\n}\n\n// When you click an empty cell, say which digits could still go there.\nfunction showOptions(i) {\n  if (cells[i].value) return;\n  const options = digitsOf(newBoard(readGrid()).cands[i]);\n  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);\n}\n\n// Shows the digits the solver added, in blue, without touching the clues.\nfunction showResult(start, values) {\n  values.forEach((v, i) => { if (!start[i] && v) { cells[i].value = v; cells[i].className = 'solved'; } });\n}\n\ndocument.getElementById('sample').onclick = () => {\n  const text = SAMPLES[sampleNumber++ % SAMPLES.length];\n  showGrid(parse(text));\n  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');\n};\ndocument.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };\ndocument.getElementById('solve').onclick = () => {\n  const start = readGrid();\n  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }\n  const t0 = performance.now();\n  const { solution, stats } = solve(start);\n  const ms = (performance.now() - t0).toFixed(1);\n  if (!solution) { setStatus('This puzzle has no solution'); return; }\n  showResult(start, solution);\n  setStatus(`Solved in ${ms} ms: ${stats.singles + stats.hidden} cells by logic, ${stats.guesses} guesses, ${stats.backtracks} backtracks`);\n};"
   }
  },
  {
   "title": "Watch it solve",
   "body": "The solver already writes down every step when you pass `{ record: true }`: each \"only one fits\", \"only one spot\", guess and backtrack, with a reason. Guesses and backtracks also carry a **snapshot** of the board as it was before the guess, so the replay can show the board going back.\n\n`watchSolve()` solves the puzzle first (it's fast), then replays the steps with `setTimeout`, one every 120 milliseconds (faster when there are hundreds of them):\n\n| Step type | On the grid | In the log |\n|---|---|---|\n| single / hidden | the digit appears in blue | the reason, e.g. \"only 4 fits in r2c3\" |\n| guess | restore the snapshot, then the guess in orange | \"guess 4 in r3c7 (2 options)\" in orange |\n| backtrack | restore the snapshot (the guess disappears) | \"…led to a dead end, undo\" in red |\n\n`clearTimeout(watchTimer)` at the start stops any replay that's already running, so pressing the button twice doesn't run two replays on top of each other.\n\n### Try it\n\nLoad the hard sample and press **Watch it solve**. You'll see logic fill in cells, an orange guess, more logic, and maybe a red undo when a guess fails.",
   "checks": [
    {
     "pane": "js",
     "label": "a watchSolve() function",
     "test": "/function\\s+watchSolve\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "the solver records its steps",
     "test": "/record:\\s*true/"
    },
    {
     "pane": "js",
     "label": "steps replay one at a time",
     "test": "/setTimeout\\(\\s*tick/"
    },
    {
     "pane": "js",
     "label": "the button is wired up",
     "test": "/getElementById\\(\\s*['\"]watch['\"]\\s*\\)\\.onclick\\s*=\\s*watchSolve/"
    }
   ],
   "quiz": [
    {
     "q": "Why does the replay restore a snapshot on a backtrack?",
     "options": [
      "Because the cells filled after the wrong guess were never part of the real answer",
      "To make the animation longer",
      "Snapshots are how the solver finds the next guess"
     ],
     "answer": 0,
     "why": "Everything that followed the wrong guess depended on it, so the board goes back to how it was before."
    },
    {
     "q": "Why call clearTimeout() at the start of watchSolve()?",
     "options": [
      "It makes setTimeout faster",
      "So a second press stops the old replay instead of running two at once",
      "The browser requires it before setTimeout"
     ],
     "answer": 1,
     "why": "Two replays would fight over the same cells; stopping the old one keeps it clean."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "watch": "const logEl = document.getElementById('log');\nlet watchTimer = null;\n\n// Replays the solver's recorded steps one at a time, with the reason for each.\nfunction watchSolve() {\n  clearTimeout(watchTimer);\n  const start = readGrid();\n  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }\n  const { solution, steps } = solve(start, { record: true });\n  if (!solution) { setStatus('This puzzle has no solution'); return; }\n  showGrid(start);\n  logEl.innerHTML = '';\n  let k = 0;\n  const tick = () => {\n    if (k >= steps.length) { setStatus(`Done: ${steps.length} steps`); return; }\n    const s = steps[k++];\n    if (s.snapshot) {\n      // a guess or an undo: put the board back the way it was before that guess\n      s.snapshot.forEach((v, i) => {\n        if (start[i]) return;\n        cells[i].value = v || '';\n        cells[i].className = v ? 'solved' : '';\n      });\n    }\n    if (s.type !== 'backtrack') {\n      cells[s.index].value = s.value;\n      cells[s.index].className = s.type === 'guess' ? 'guess' : 'solved';\n    }\n    const li = document.createElement('li');\n    li.textContent = s.reason;\n    li.className = s.type;\n    logEl.prepend(li);\n    setStatus(s.reason);\n    watchTimer = setTimeout(tick, steps.length > 400 ? 15 : 120);   // long solves play faster\n  };\n  tick();\n}\n\ndocument.getElementById('watch').onclick = watchSolve;"
   }
  }
 ],
 "finish": "### What you learned\n\n- Building a grid of inputs from JavaScript, and keeping the real puzzle as an array of 81 numbers\n- Working out rows, columns, boxes and peers once, and reusing them everywhere\n- Bitmasks: `&`, `|`, `~` and `<<` for fast sets of digits\n- Constraint propagation with two rules, repeated until nothing changes\n- Recursion and backtracking on copies, and choosing the guess with the best odds\n- Recording steps so a program can explain itself\n- Counting solutions with an early stop, seeded randomness and Fisher-Yates shuffling\n- Generating content and grading it by how hard it was to solve\n\n### Challenges\n\n1. **Check my answers:** compare the grid with the solution and add a class to wrong cells, without showing the right digits.\n2. **Pencil marks:** show each empty cell's candidates in tiny digits (hint: `newBoard(readGrid()).cands`).\n3. **Arrow keys:** move focus between cells with the arrow keys (hint: `keydown`, and `cells[i ± 1]` or `cells[i ± 9]`).\n4. **Share in the URL:** put the puzzle in `location.hash` and load it when the page opens.\n5. **A third rule:** \"naked pairs\": two cells in a unit with the same two candidates mean no other cell in that unit can have them.\n\nCompare your finished solver with the [live version](https://theoyanvno.github.io/sudoku-solver/) and the [source code](https://github.com/TheoYanvno/sudoku-solver)."
};
