---
id: sudoku
title: Sudoku Solver
blocks-html: page
blocks-css: base
blocks-js: data, parse, board, propagate, search, generate, ui, watch, go
goals: Build a 9 x 9 grid of inputs from JavaScript and read it back as data; Find every cell's row, column and box once and reuse it; Track possible digits with bitmasks and the & | ~ << operators; Solve by logic (constraint propagation) before guessing; Use recursion and backtracking on copies of the board; Make new puzzles that always have exactly one solution
prereqs: HTML, CSS and JavaScript basics (functions, loops, arrays); Arrays of arrays, Set and template literals; A Sudoku or two on paper helps: you'll teach the computer your own tricks
---

## Session: A grid you can type in

## Step: The page and a 9 x 9 grid
time: 15

Welcome! In this guide you'll rebuild my [Sudoku Solver](https://theoyanvno.github.io/sudoku-solver/) from a blank page. By the end it will check a puzzle as you type, solve any puzzle in a few milliseconds, replay its thinking step by step ("8 can only go in r6c2 in box 4"), and make brand-new puzzles at three levels that always have exactly one answer.

Start with the page. The HTML has a header with a status line, an empty `<div id="grid">`, and the buttons you'll wire up over the next steps. There are no cells in the HTML: typing 81 `<input>` tags by hand would be slow and easy to get wrong, so JavaScript makes them in a loop.

### What to write

- **HTML:** the header, `<div id="grid" class="grid">`, the buttons (Sample, Solve, Watch it solve, a level menu, New puzzle, Clear) and an empty `<ol id="log">` for later.
- **CSS:** `.grid` is a CSS Grid with `grid-template-columns: repeat(9, 40px)`. The `gap: 1px` over a gray background draws thin lines between cells. The thicker 3 x 3 lines come from `:nth-child()`: every 3rd and 6th cell in a row gets a dark right border, and rows 3 and 6 (cells 19-27 and 46-54) get a dark bottom border.
- **JavaScript:** `buildGrid()` runs a `for` loop from 0 to 80, creates an `<input>` with `document.createElement('input')`, keeps only one digit 1-9, and pushes each input into a `cells` array. `readGrid()` turns the inputs back into 81 numbers (0 for blank), and `showGrid()` does the reverse. The Sample button loads an easy puzzle, then a hard one.

### Why it's built this way

The grid on screen is just a view. The real puzzle is an array of 81 numbers, row by row: cell `i` is in row `Math.floor(i / 9)` and column `i % 9`. Every part of the solver works on that array, so it never has to touch the page, and the same code could run in a test or on a server.

| Cell number | Row | Column |
|---|---|---|
| 0 | 0 (top) | 0 (left) |
| 10 | 1 | 1 |
| 80 | 8 (bottom) | 8 (right) |

check: html | an element with id "grid" | /id=["']grid["']/ | Add <div id="grid" class="grid"></div>
check: css | the grid has 9 columns | /\.grid\s*\{[^}]*grid-template-columns:\s*repeat\(\s*9/ | Give .grid grid-template-columns: repeat(9, 40px)
check: js | a buildGrid() function | /function\s+buildGrid\s*\(/
check: js | a loop that runs 81 times | /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*81/ | for (let i = 0; i < 81; i++)
check: js | inputs created from JavaScript | /createElement\(\s*['"]input['"]\s*\)/
check: js | readGrid() turns the inputs into numbers | /function\s+readGrid\s*\(/

quiz: Why does JavaScript make the 81 cells instead of writing them in the HTML?
- [ ] Browsers limit how many inputs HTML can contain
- [x] A loop makes all 81 the same way with no typos, and gives each one its number
- [ ] Inputs made in HTML can't be typed in
why: The loop gives every cell the same setup and its index i, which the rest of the code relies on.
quiz: Cell 40 is in which row and column (counting from 0)?
- [x] Row 4, column 4
- [ ] Row 4, column 0
- [ ] Row 3, column 13
why: Math.floor(40 / 9) is 4 and 40 % 9 is 4: the center cell of the grid.

```html page
<header class="bar">
  <h1>Sudoku Solver</h1>
  <p id="status" class="status" role="status">Type a puzzle or press Sample</p>
</header>

<main>
  <div id="grid" class="grid" aria-label="Sudoku grid"></div>
  <div class="controls">
    <button id="sample">Sample</button>
    <button id="solve">Solve</button>
    <button id="watch">Watch it solve</button>
    <select id="level" aria-label="Difficulty">
      <option value="easy">Easy</option>
      <option value="medium" selected>Medium</option>
      <option value="hard">Hard</option>
    </select>
    <button id="new">New puzzle</button>
    <button id="clear">Clear</button>
  </div>
  <ol id="log" class="log"></ol>
</main>
```

```css base
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f4f6fa;
  color: #1c2430;
  display: grid;
  justify-items: center;
}
.bar { text-align: center; }
.bar h1 { margin: 16px 0 4px; }
.status { margin: 0 0 12px; color: #4b5563; min-height: 1.4em; }

/* 9 columns of 40px cells; thicker lines after every third row and column */
.grid {
  display: grid;
  grid-template-columns: repeat(9, 40px);
  border: 3px solid #1c2430;
  background: #94a3b8;
  gap: 1px;
}
.grid input {
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  border: 0;
  padding: 0;
  text-align: center;
  font-size: 20px;
  background: #fff;
  color: #1c2430;
}
.grid input:nth-child(9n + 3), .grid input:nth-child(9n + 6) { border-right: 2px solid #1c2430; }
.grid input:nth-child(n + 19):nth-child(-n + 27),
.grid input:nth-child(n + 46):nth-child(-n + 54) { border-bottom: 2px solid #1c2430; }
.grid input.given { font-weight: 700; background: #e8edf5; }
.grid input.solved { color: #1d4ed8; }
.grid input.guess { background: #ffedd5; }
.grid input.bad { background: #fde2e1; color: #b91c1c; }

.controls { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 14px 0; }
button, select { font: inherit; padding: 8px 12px; border-radius: 8px; border: 1px solid #1c2430; background: #fff; cursor: pointer; }
.log { max-width: 380px; max-height: 160px; overflow: auto; font-size: 14px; }
.log .guess { color: #c2410c; }
.log .backtrack { color: #b91c1c; }
```

```js ui
const gridEl = document.getElementById('grid');
const statusEl = document.getElementById('status');
const cells = [];
const SAMPLES = [
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy
  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard
];
let sampleNumber = 0;

function setStatus(text) { statusEl.textContent = text; }

function buildGrid() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only
      onChange();
    });
    gridEl.appendChild(input);
    cells.push(input);
  }
}

function readGrid() { return cells.map((c) => Number(c.value) || 0); }

function showGrid(grid, filledClass = 'given') {
  grid.forEach((v, i) => {
    cells[i].value = v || '';
    cells[i].className = v ? filledClass : '';
  });
}

function onChange() { setStatus(''); }

document.getElementById('sample').onclick = () => {
  const text = SAMPLES[sampleNumber++ % SAMPLES.length];
  showGrid([...text].map((ch) => Number(ch) || 0));
  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');
};
document.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };
```

```js go
buildGrid();
```

## Step: Rows, columns, boxes and peers
time: 15

Every Sudoku rule talks about the same three groups: a digit can appear once in each **row**, each **column** and each **3 x 3 box**. The solver will ask "which cells share a group with this one?" thousands of times, so we work it out once, before anything else runs, and keep the answers in two lists.

**PEERS** has one entry per cell: the 20 other cells it can't share a digit with. That's 8 in its row, 8 in its column, and 4 more in its box that weren't already counted.

```svg The 20 peers of cell r5c2: its row, its column and the rest of its box
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 200" font-family="sans-serif"><rect x="10" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="10" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="10" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="30" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="30" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="50" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="50" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="70" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="70" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="70" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="70" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="90" width="20" height="20" fill="#1d4ed8" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="90" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="110" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="110" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="110" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="110" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="130" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="130" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="150" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="150" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="10" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="30" y="170" width="20" height="20" fill="#c7ddff" stroke="#94a3b8" stroke-width="0.5"/><rect x="50" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="70" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="90" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="110" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="130" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="150" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><rect x="170" y="170" width="20" height="20" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5"/><line x1="10" y1="10" x2="10" y2="190" stroke="#1c2430" stroke-width="2"/><line x1="10" y1="10" x2="190" y2="10" stroke="#1c2430" stroke-width="2"/><line x1="70" y1="10" x2="70" y2="190" stroke="#1c2430" stroke-width="2"/><line x1="10" y1="70" x2="190" y2="70" stroke="#1c2430" stroke-width="2"/><line x1="130" y1="10" x2="130" y2="190" stroke="#1c2430" stroke-width="2"/><line x1="10" y1="130" x2="190" y2="130" stroke="#1c2430" stroke-width="2"/><line x1="190" y1="10" x2="190" y2="190" stroke="#1c2430" stroke-width="2"/><line x1="10" y1="190" x2="190" y2="190" stroke="#1c2430" stroke-width="2"/><rect x="210" y="40" width="16" height="16" fill="#1d4ed8"/><text x="232" y="53" font-size="12" fill="#1c2430">the cell (r5c2)</text><rect x="210" y="70" width="16" height="16" fill="#c7ddff" stroke="#94a3b8"/><text x="232" y="83" font-size="12" fill="#1c2430">its 20 peers</text><text x="210" y="118" font-size="11" fill="#475569">8 in the row</text><text x="210" y="134" font-size="11" fill="#475569">8 in the column</text><text x="210" y="150" font-size="11" fill="#475569">4 more in the box</text></svg>
```

**UNITS** is the 27 groups themselves (9 rows, then 9 columns, then 9 boxes), each a list of 9 cell numbers. `UNIT_NAMES` holds a readable name for each so the solver can explain itself later. `cellName(i)` turns a number into a name like `r5c2` (row 5, column 2, counting from 1 for people).

### Finding a cell's box

The box math is the only tricky part. `r - (r % 3)` rounds a row down to the top row of its box: rows 3, 4 and 5 all give 3. Do the same for the column and you have the box's top-left corner; `k / 3` and `k % 3` then walk its 9 cells.

A `Set` collects the peers because the row, column and box overlap: the cell itself shows up three times and some box cells show up twice. A `Set` keeps each number once, and `set.delete(i)` removes the cell itself.

### Try it

The `go` block now logs `PEERS[0].length` and `UNITS.length`. Open the console: you should see 20 and 27.

check: js | a PEERS list | /const\s+PEERS\s*=/
check: js | the cell isn't its own peer | /set\.delete\(\s*i\s*\)/ | Remove the cell itself with set.delete(i)
check: js | a UNITS list of rows, columns and boxes | /const\s+UNITS\s*=/
check: js | a cellName() helper | /const\s+cellName\s*=/

quiz: Why does each cell have 20 peers and not 24 (8 + 8 + 8)?
- [ ] The corners of the grid have fewer
- [x] Four of the box cells are already in the row or column, so they'd be counted twice
- [ ] Sudoku only checks 20 cells
why: The box shares 2 cells with the row and 2 with the column; the Set keeps them once, leaving 8 + 8 + 4.
quiz: Why compute PEERS once at the start instead of every time it's needed?
- [x] The answer never changes, and the solver asks for it thousands of times
- [ ] JavaScript can only run loops at startup
- [ ] It uses less memory than computing it each time
why: Peers depend only on the grid shape, not the puzzle, so working them out once saves repeating the same math.

```js data
// Cells are numbered 0-80, row by row: row = Math.floor(i / 9), column = i % 9.

// The 20 cells that share a row, column or 3 x 3 box with each cell. Worked out once.
const PEERS = Array.from({ length: 81 }, (_, i) => {
  const r = Math.floor(i / 9);
  const c = i % 9;
  const br = r - (r % 3);   // top row of this cell's box
  const bc = c - (c % 3);   // left column of this cell's box
  const set = new Set();
  for (let k = 0; k < 9; k++) {
    set.add(r * 9 + k);                                       // same row
    set.add(k * 9 + c);                                       // same column
    set.add((br + Math.floor(k / 3)) * 9 + bc + (k % 3));     // same box
  }
  set.delete(i);              // a cell isn't its own peer
  return [...set];
});

// The 27 units: 9 rows, 9 columns and 9 boxes, each a list of 9 cell numbers.
const UNITS = [
  ...Array.from({ length: 9 }, (_, r) => Array.from({ length: 9 }, (_, c) => r * 9 + c)),
  ...Array.from({ length: 9 }, (_, c) => Array.from({ length: 9 }, (_, r) => r * 9 + c)),
  ...Array.from({ length: 9 }, (_, b) =>
    Array.from({ length: 9 }, (_, k) => (Math.floor(b / 3) * 3 + Math.floor(k / 3)) * 9 + (b % 3) * 3 + (k % 3))),
];
const UNIT_NAMES = [
  ...Array.from({ length: 9 }, (_, i) => `row ${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `column ${i + 1}`),
  ...Array.from({ length: 9 }, (_, i) => `box ${i + 1}`),
];

const cellName = (i) => `r${Math.floor(i / 9) + 1}c${(i % 9) + 1}`;
```

```js go
buildGrid();
console.log('Cell r1c1 has', PEERS[0].length, 'peers, and there are', UNITS.length, 'units');
```

## Step: Reading a puzzle and catching mistakes
time: 15

People share Sudoku puzzles as 81 characters: digits for clues and `0` or `.` for blanks, like `53..7....6..195....` and so on. `parse(text)` turns that into the 81-number array, ignoring spaces, line breaks and `|` separators. If something's wrong it throws an `Error` with a message a person can act on: which character was unexpected, or how many cells it found instead of 81.

`conflicts(grid)` checks the rules. For every filled cell, it looks at its peers; any peer with the same digit is a conflict, and both cells go into a `Set`. Thanks to `PEERS`, this is two short loops instead of separate row, column and box checks.

Now the page can help while you type: `onChange()` runs on every keystroke, adds the `bad` class to conflicting cells with `classList.toggle('bad', ...)`, and explains the problem in the status line. The Sample button uses `parse()` too.

### Try it

Load the sample, then type a 5 into the empty cell right next to the 5 in the top row. Both 5s turn red. Delete it and they go back to normal.

| Input | parse() gives |
|---|---|
| `53..7....` + 72 more | an array of 81 numbers |
| `12x` | Error: Unexpected character "x" |
| `123` | Error: A puzzle needs 81 cells, but this has 3 |

check: js | a parse() function | /function\s+parse\s*\(/
check: js | parse() reports the wrong number of cells | /chars\.length\s*!==\s*81/
check: js | a conflicts() function | /function\s+conflicts\s*\(/
check: js | conflicting cells are marked "bad" | /classList\.toggle\(\s*['"]bad['"]/ | In onChange(), use c.classList.toggle('bad', bad.has(i))

quiz: Why does conflicts() put both cells of a clash in the Set?
- [ ] So the Set has an even number of items
- [x] Either one could be the mistake, so both are shown in red
- [ ] The solver needs both to start
why: The program can't know which 5 you meant; highlighting both lets you decide.
quiz: What should parse() do with a puzzle that has only 80 characters?
- [ ] Guess where the missing cell goes
- [x] Throw an error that says how many cells it found
- [ ] Add a 0 at the end
why: Guessing would quietly give a different puzzle; a clear error tells the person exactly what to fix.

```js parse
// Reads 81 characters: 1-9 for clues, 0 or . for blanks. Spaces, newlines and | are ignored.
function parse(text) {
  const chars = String(text).replace(/[\s|]/g, '').split('');
  const bad = chars.find((ch) => !/[0-9.]/.test(ch));
  if (bad) throw new Error(`Unexpected character "${bad}". Use 1-9 for clues and 0 or . for blanks.`);
  if (chars.length !== 81) throw new Error(`A puzzle needs 81 cells, but this has ${chars.length}.`);
  return chars.map((ch) => (/[1-9]/.test(ch) ? Number(ch) : 0));
}

// Every cell that has the same digit as one of its peers.
function conflicts(grid) {
  const bad = new Set();
  for (let i = 0; i < 81; i++) {
    if (!grid[i]) continue;
    for (const p of PEERS[i]) if (grid[p] === grid[i]) { bad.add(i); bad.add(p); }
  }
  return [...bad];
}
```

```js ui
const gridEl = document.getElementById('grid');
const statusEl = document.getElementById('status');
const cells = [];
const SAMPLES = [
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy
  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard
];
let sampleNumber = 0;

function setStatus(text) { statusEl.textContent = text; }

function buildGrid() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only
      onChange();
    });
    gridEl.appendChild(input);
    cells.push(input);
  }
}

function readGrid() { return cells.map((c) => Number(c.value) || 0); }

function showGrid(grid, filledClass = 'given') {
  grid.forEach((v, i) => {
    cells[i].value = v || '';
    cells[i].className = v ? filledClass : '';
  });
}

// Red cells: the same digit twice in a row, column or box.
function onChange() {
  const bad = new Set(conflicts(readGrid()));
  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));
  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');
}

document.getElementById('sample').onclick = () => {
  const text = SAMPLES[sampleNumber++ % SAMPLES.length];
  showGrid(parse(text));
  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');
};
document.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };
```

## Session: Solving by logic

## Step: Possible digits as bitmasks
time: 15

When you solve a Sudoku on paper, you pencil in the digits that could still go in each cell. The solver does the same thing, but instead of a list of digits it keeps **one number per cell** whose bits say which digits are possible. Bit 1 stands for digit 1, bit 2 for digit 2, up to bit 9 (bit 0 is never used, which keeps the math simple).

```svg One cell's candidates as a bitmask: bits 8, 5 and 2 are on
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 115" font-family="sans-serif"><rect x="10" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="25" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="25" y="22" text-anchor="middle" font-size="11" fill="#475569">9</text><rect x="42" y="30" width="30" height="30" fill="#bbf7d0" stroke="#475569"/><text x="57" y="51" text-anchor="middle" font-size="15" fill="#1c2430">1</text><text x="57" y="22" text-anchor="middle" font-size="11" fill="#475569">8</text><rect x="74" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="89" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="89" y="22" text-anchor="middle" font-size="11" fill="#475569">7</text><rect x="106" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="121" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="121" y="22" text-anchor="middle" font-size="11" fill="#475569">6</text><rect x="138" y="30" width="30" height="30" fill="#bbf7d0" stroke="#475569"/><text x="153" y="51" text-anchor="middle" font-size="15" fill="#1c2430">1</text><text x="153" y="22" text-anchor="middle" font-size="11" fill="#475569">5</text><rect x="170" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="185" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="185" y="22" text-anchor="middle" font-size="11" fill="#475569">4</text><rect x="202" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="217" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="217" y="22" text-anchor="middle" font-size="11" fill="#475569">3</text><rect x="234" y="30" width="30" height="30" fill="#bbf7d0" stroke="#475569"/><text x="249" y="51" text-anchor="middle" font-size="15" fill="#1c2430">1</text><text x="249" y="22" text-anchor="middle" font-size="11" fill="#475569">2</text><rect x="266" y="30" width="30" height="30" fill="#ffffff" stroke="#475569"/><text x="281" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="281" y="22" text-anchor="middle" font-size="11" fill="#475569">1</text><rect x="298" y="30" width="30" height="30" fill="#e2e8f0" stroke="#475569"/><text x="313" y="51" text-anchor="middle" font-size="15" fill="#1c2430">0</text><text x="313" y="22" text-anchor="middle" font-size="11" fill="#475569">-</text><text x="10" y="86" font-size="12" fill="#1c2430">bits 8, 5 and 2 are on: this cell could be 8, 5 or 2</text><text x="10" y="104" font-size="12" fill="#475569">bit 0 is never used, so digit d is simply bit d (1 &lt;&lt; d)</text></svg>
```

| Operation | Code | Meaning |
|---|---|---|
| everything possible | `ALL = 0b1111111110` | bits 1-9 on |
| is d possible? | `mask & (1 << d)` | not 0 means yes |
| rule d out | `mask &= ~(1 << d)` | turn bit d off |
| how many left? | `bitCount(mask)` | counts the 1 bits |

Why bits instead of arrays? Ruling a digit out is one tiny operation instead of searching and splicing an array, and copying the whole board for a guess (coming in session 3) is just copying 81 numbers.

### What to write

- `newBoard(grid)` makes `{ values, cands }`: every cell starts with `ALL`, then each clue is placed.
- `place(b, i, d)` puts `d` in cell `i`, clears that cell's candidates, and removes `d` from all 20 peers with `b.cands[p] &= ~(1 << d)`.
- `cloneBoard(b)` copies both arrays (used later for guessing).
- In the page, clicking an empty cell calls `showOptions(i)`, which tells you what could go there.

### Try it

Load the sample and click the empty cell in the top-left box. The status line lists its possible digits. Check it against the puzzle: are those really the only ones that fit?

check: js | ALL has bits 1-9 on | /const\s+ALL\s*=\s*0b1111111110/ | const ALL = 0b1111111110
check: js | a place() function | /function\s+place\s*\(/
check: js | placing a digit rules it out for every peer | /cands\[p\]\s*&=\s*~\(\s*1\s*<<\s*d\s*\)/ | for (const p of PEERS[i]) b.cands[p] &= ~(1 << d)
check: js | clicking a cell shows its options | /function\s+showOptions\s*\(/

quiz: A cell's mask is 0b0000100100. Which digits could go there?
- [x] 2 and 5
- [ ] 5 and 8
- [ ] 3 and 6
why: Counting from bit 0 on the right, bits 2 and 5 are on, and bit d means digit d.
quiz: What does b.cands[p] &= ~(1 << d) do?
- [ ] Adds d to cell p's candidates
- [x] Turns off bit d, so d is no longer possible in cell p
- [ ] Sets cell p to the digit d
why: ~(1 << d) has every bit on except d; AND-ing with it clears only bit d.

```js board
// Each cell keeps a bitmask of the digits that could still go there ("candidates").
// Bit d stands for digit d, so ALL has bits 1-9 on.
const ALL = 0b1111111110;

const bitCount = (m) => { let n = 0; while (m) { m &= m - 1; n++; } return n; };
const digitsOf = (m) => [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => m & (1 << d));

function newBoard(grid) {
  const b = { values: new Array(81).fill(0), cands: new Array(81).fill(ALL) };
  for (let i = 0; i < 81; i++) if (grid[i]) place(b, i, grid[i]);
  return b;
}

// Putting d in cell i: that cell is done, and none of its 20 peers can be d any more.
function place(b, i, d) {
  b.values[i] = d;
  b.cands[i] = 0;
  for (const p of PEERS[i]) b.cands[p] &= ~(1 << d);
}

const cloneBoard = (b) => ({ values: b.values.slice(), cands: b.cands.slice() });
```

```js ui
const gridEl = document.getElementById('grid');
const statusEl = document.getElementById('status');
const cells = [];
const SAMPLES = [
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy
  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard
];
let sampleNumber = 0;

function setStatus(text) { statusEl.textContent = text; }

function buildGrid() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only
      onChange();
    });
    input.addEventListener('focus', () => showOptions(i));
    gridEl.appendChild(input);
    cells.push(input);
  }
}

function readGrid() { return cells.map((c) => Number(c.value) || 0); }

function showGrid(grid, filledClass = 'given') {
  grid.forEach((v, i) => {
    cells[i].value = v || '';
    cells[i].className = v ? filledClass : '';
  });
}

// Red cells: the same digit twice in a row, column or box.
function onChange() {
  const bad = new Set(conflicts(readGrid()));
  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));
  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');
}

// When you click an empty cell, say which digits could still go there.
function showOptions(i) {
  if (cells[i].value) return;
  const options = digitsOf(newBoard(readGrid()).cands[i]);
  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);
}

document.getElementById('sample').onclick = () => {
  const text = SAMPLES[sampleNumber++ % SAMPLES.length];
  showGrid(parse(text));
  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');
};
document.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };
```

## Step: Rule one: only one digit fits
time: 15

The first trick everyone learns: if a cell has only **one** possible digit left, that's its answer. In bitmask terms, `bitCount(b.cands[i]) === 1`. Placing it rules that digit out of its peers, which can leave *another* cell with one option, so `propagate()` keeps looping until a whole pass changes nothing. This is called **constraint propagation**: each answer spreads new information to its neighbors.

`propagate()` also notices when the puzzle is impossible: an empty cell whose mask is 0 has nothing that can go there, so it returns `false`.

Each placement calls `log?.(...)` with what happened and why. The `?.` means "only if a log function was passed in": the Solve button doesn't need the log, but the Watch it solve button (session 3) will.

### What to write

- `propagate(b, log)` with a `while (changed)` loop around a pass over all 81 cells.
- The Solve button: build a board from the page, run `propagate()`, show the new digits in blue with `showResult()`, and say how many cells are still empty.

### Try it

Load the easy sample and press **Solve**. Rule one alone fills in a lot of cells, but probably not all of them. That's what the next step fixes.

check: js | a propagate() function | /function\s+propagate\s*\(/
check: js | a cell with one candidate gets that digit | /bitCount\(\s*b\.cands\[i\]\s*\)\s*===\s*1/
check: js | it repeats until nothing changes | /while\s*\(\s*changed\s*\)/ | Wrap the pass in while (changed) { changed = false; ... }
check: js | the Solve button is wired up | /getElementById\(\s*['"]solve['"]\s*\)\.onclick/

quiz: Why does propagate() loop until a whole pass changes nothing?
- [ ] To use up time so the result looks impressive
- [x] Each placed digit can leave other cells with a single option, which the next pass can fill
- [ ] JavaScript needs two passes to update an array
why: Answers unlock more answers; stopping after one pass would miss them.
quiz: What does it mean when an empty cell's mask becomes 0?
- [ ] The cell is solved
- [x] No digit can go there, so the board is impossible
- [ ] The cell can hold any digit
why: Every digit has been ruled out by its peers: something placed earlier was wrong.

```js propagate
// Fills in every cell the rules force, repeating until nothing changes.
// Returns false if the board turns out to be impossible.
function propagate(b, log) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < 81; i++) {
      if (b.values[i]) continue;
      if (!b.cands[i]) return false;                 // an empty cell with no options left
      if (bitCount(b.cands[i]) === 1) {              // only one fits
        const d = digitsOf(b.cands[i])[0];
        place(b, i, d);
        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });
        changed = true;
      }
    }
  }
  return true;
}
```

```js ui
const gridEl = document.getElementById('grid');
const statusEl = document.getElementById('status');
const cells = [];
const SAMPLES = [
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy
  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard
];
let sampleNumber = 0;

function setStatus(text) { statusEl.textContent = text; }

function buildGrid() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only
      onChange();
    });
    input.addEventListener('focus', () => showOptions(i));
    gridEl.appendChild(input);
    cells.push(input);
  }
}

function readGrid() { return cells.map((c) => Number(c.value) || 0); }

function showGrid(grid, filledClass = 'given') {
  grid.forEach((v, i) => {
    cells[i].value = v || '';
    cells[i].className = v ? filledClass : '';
  });
}

// Red cells: the same digit twice in a row, column or box.
function onChange() {
  const bad = new Set(conflicts(readGrid()));
  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));
  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');
}

// When you click an empty cell, say which digits could still go there.
function showOptions(i) {
  if (cells[i].value) return;
  const options = digitsOf(newBoard(readGrid()).cands[i]);
  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);
}

// Shows the digits the solver added, in blue, without touching the clues.
function showResult(start, values) {
  values.forEach((v, i) => { if (!start[i] && v) { cells[i].value = v; cells[i].className = 'solved'; } });
}

document.getElementById('sample').onclick = () => {
  const text = SAMPLES[sampleNumber++ % SAMPLES.length];
  showGrid(parse(text));
  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');
};
document.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };
document.getElementById('solve').onclick = () => {
  const start = readGrid();
  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }
  const b = newBoard(start);
  const ok = propagate(b);
  showResult(start, b.values);
  const left = b.values.filter((v) => !v).length;
  setStatus(!ok ? 'These clues contradict each other' : left ? `Logic filled what it could; ${left} cells are still empty` : 'Solved by logic alone!');
};
```

## Step: Rule two: only one spot for a digit
time: 20

The second trick looks at it the other way around. Take row 6: if the digit 8 can only go in **one** of its empty cells, it must go there, even if that cell has other candidates too. Sudoku players call this a "hidden single".

For every one of the 27 units and every digit 1-9, the code counts the cells where that digit is still possible:

| count | meaning |
|---|---|
| digit already placed | skip this digit |
| 0 | impossible: the digit has nowhere to go, return false |
| 1 | place it there |
| 2 or more | not decided yet |

That's three nested loops (units, digits, cells), but each one is short: 27 x 9 x 9 is only about 2,000 checks per pass.

With both rules, `propagate()` solves easy puzzles completely without ever guessing. The log message now names the unit too: "8 can only go in r6c2 in box 4".

### Try it

Load the easy sample and press **Solve**: it's solved by logic alone. Now press **Sample** again for the hard puzzle and **Solve**: logic gets stuck with cells still empty. Guessing comes next.

check: js | every unit is checked | /for\s*\(\s*let\s+u\s*=\s*0\s*;\s*u\s*<\s*UNITS\.length/
check: js | a digit with one spot goes there | /count\s*===\s*1/
check: js | a digit with no spot means a contradiction | /count\s*===\s*0\s*\)\s*return\s+false/

quiz: In row 6, the digit 8 is possible only in r6c2, which also allows 3 and 5. What goes in r6c2?
- [ ] Nothing yet: it still has three options
- [x] 8, because it has nowhere else to go in row 6
- [ ] 3, the smallest option
why: Row 6 needs an 8 somewhere, and r6c2 is the only place it fits.
quiz: Why do easy puzzles never need a guess?
- [x] They are made so that rules one and two can always find a next cell
- [ ] Easy puzzles have fewer rules
- [ ] The solver guesses silently
why: The generator (session 4) grades a puzzle easy or medium only if logic alone solves it.

```js propagate
// Fills in every cell the rules force, repeating until nothing changes:
//  - only one fits: a cell with a single candidate
//  - only one spot: a digit that fits in just one cell of a row, column or box
// Returns false if the board turns out to be impossible.
function propagate(b, log) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < 81; i++) {
      if (b.values[i]) continue;
      if (!b.cands[i]) return false;                 // an empty cell with no options left
      if (bitCount(b.cands[i]) === 1) {              // only one fits
        const d = digitsOf(b.cands[i])[0];
        place(b, i, d);
        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });
        changed = true;
      }
    }
    for (let u = 0; u < UNITS.length; u++) {
      for (let d = 1; d <= 9; d++) {
        let spot = -1;
        let count = 0;
        let placed = false;
        for (const i of UNITS[u]) {
          if (b.values[i] === d) { placed = true; break; }
          if (b.cands[i] & (1 << d)) { spot = i; count++; }
        }
        if (placed) continue;
        if (count === 0) return false;               // d has nowhere to go in this unit
        if (count === 1) {                           // only one spot for d
          place(b, spot, d);
          log?.({ type: 'hidden', index: spot, value: d, reason: `${d} can only go in ${cellName(spot)} in ${UNIT_NAMES[u]}` });
          changed = true;
        }
      }
    }
  }
  return true;
}
```

## Session: Guessing and backtracking

## Step: Spotting a dead end
time: 12

Hard puzzles get stuck: no cell has one option and no digit has one spot. Then the solver has to **guess**, and a wrong guess eventually produces an impossible board. Before writing the guessing code, we need a reliable way to notice "this board can't be finished".

`deadEnd(b)` checks two things:

1. An empty cell with no candidates left (mask 0).
2. A unit where some digit can't go anywhere. It ORs together every cell in the unit (placed digits as their bit, empty cells as their candidates). If the result isn't `ALL`, some digit is missing from the whole unit.

`propagate()` now ends with `return !deadEnd(b)`: true means "still possible", false means "give up on this board".

### Why check both?

The first catches cells that are squeezed out; the second catches digits that are squeezed out. A wrong guess can cause either, and catching it early saves the search from wandering down a branch that can never work.

check: js | a deadEnd() function | /function\s+deadEnd\s*\(/
check: js | each unit must still have room for every digit | /seen\s*!==\s*ALL/
check: js | propagate() reports dead ends | /return\s+!deadEnd\(\s*b\s*\)/ | End propagate() with return !deadEnd(b);

quiz: In a unit, the OR of all its cells is 0b1011111110. What does that tell you?
- [ ] The unit is solved
- [x] Digit 8 can't go anywhere in this unit, so the board is a dead end
- [ ] Digit 8 is placed twice
why: Bit 8 is off: no cell in the unit has 8 placed or possible.
quiz: Why catch dead ends as early as possible?
- [x] So the solver stops exploring a branch that can never be completed
- [ ] To make the console quieter
- [ ] Because the grid can only hold one dead end
why: Every extra step on a doomed branch is wasted work; noticing early makes backtracking fast.

```js propagate
// An empty cell with no candidates, or a digit with no place left in a unit,
// means an earlier guess was wrong.
function deadEnd(b) {
  for (let i = 0; i < 81; i++) if (!b.values[i] && !b.cands[i]) return true;
  for (const unit of UNITS) {
    let seen = 0;
    for (const i of unit) seen |= b.values[i] ? 1 << b.values[i] : b.cands[i];
    if (seen !== ALL) return true;
  }
  return false;
}

// Fills in every cell the rules force, repeating until nothing changes:
//  - only one fits: a cell with a single candidate
//  - only one spot: a digit that fits in just one cell of a row, column or box
// Returns false if the board turns out to be impossible.
function propagate(b, log) {
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < 81; i++) {
      if (b.values[i]) continue;
      if (!b.cands[i]) return false;                 // an empty cell with no options left
      if (bitCount(b.cands[i]) === 1) {              // only one fits
        const d = digitsOf(b.cands[i])[0];
        place(b, i, d);
        log?.({ type: 'single', index: i, value: d, reason: `only ${d} fits in ${cellName(i)}` });
        changed = true;
      }
    }
    for (let u = 0; u < UNITS.length; u++) {
      for (let d = 1; d <= 9; d++) {
        let spot = -1;
        let count = 0;
        let placed = false;
        for (const i of UNITS[u]) {
          if (b.values[i] === d) { placed = true; break; }
          if (b.cands[i] & (1 << d)) { spot = i; count++; }
        }
        if (placed) continue;
        if (count === 0) return false;               // d has nowhere to go in this unit
        if (count === 1) {                           // only one spot for d
          place(b, spot, d);
          log?.({ type: 'hidden', index: spot, value: d, reason: `${d} can only go in ${cellName(spot)} in ${UNIT_NAMES[u]}` });
          changed = true;
        }
      }
    }
  }
  return !deadEnd(b);
}
```

## Step: Guess, check, and undo
time: 20

Now the heart of the solver: a **recursive** `search(b)`.

1. Run `propagate()`. If it fails, this board is a dead end: return `null`.
2. If every cell is filled, return the board: solved.
3. Otherwise pick the empty cell with the **fewest** candidates (`bestCell`). With 2 options, a guess is right half the time; with 5, only a fifth.
4. For each candidate: copy the board, place the guess on the **copy**, and call `search()` on it. If that returns a board, pass it up. If not, count a backtrack and try the next digit.

```svg Backtracking: each guess runs on a copy, and a dead end just throws the copy away
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 190" font-family="sans-serif"><rect x="120" y="8" width="100" height="30" rx="6" fill="#e2e8f0"/><text x="170" y="28" text-anchor="middle" font-size="12">stuck: r3c7 = 4 or 9</text><line x1="150" y1="38" x2="80" y2="72" stroke="#475569" stroke-width="2"/><line x1="190" y1="38" x2="260" y2="72" stroke="#475569" stroke-width="2"/><rect x="20" y="72" width="120" height="30" rx="6" fill="#ffedd5"/><text x="80" y="92" text-anchor="middle" font-size="12">guess 4, propagate</text><rect x="200" y="72" width="120" height="30" rx="6" fill="#ffedd5"/><text x="260" y="92" text-anchor="middle" font-size="12">guess 9, propagate</text><line x1="80" y1="102" x2="80" y2="132" stroke="#475569" stroke-width="2"/><line x1="260" y1="102" x2="260" y2="132" stroke="#475569" stroke-width="2"/><rect x="20" y="132" width="120" height="30" rx="6" fill="#fde2e1"/><text x="80" y="152" text-anchor="middle" font-size="12">dead end: undo</text><rect x="200" y="132" width="120" height="30" rx="6" fill="#bbf7d0"/><text x="260" y="152" text-anchor="middle" font-size="12">solved</text><text x="170" y="182" text-anchor="middle" font-size="11" fill="#475569">each guess works on a copy, so undoing is just throwing the copy away</text></svg>
```

Working on copies is what makes undoing easy: the original board was never changed, so "undo" is simply moving on to the next digit. That's what `cloneBoard()` from step 4 was for.

`solve(grid)` wraps it all up and returns `{ solution, stats, steps }`. The stats count cells filled by each rule, guesses and backtracks. The Solve button now uses `solve()` and reports how long it took (usually a few milliseconds, even for hard puzzles).

### Try it

Load the hard sample and press **Solve**. Look at the status line: how many guesses and backtracks did it need?

check: js | a bestCell() function | /function\s+bestCell\s*\(/
check: js | a solve() function | /function\s+solve\s*\(/
check: js | guesses run on a copy of the board | /const\s+next\s*=\s*cloneBoard\(\s*b\s*\)/
check: js | wrong guesses are counted as backtracks | /stats\.backtracks\+\+/

quiz: Why guess in the cell with the fewest candidates?
- [ ] It is closest to the top of the grid
- [x] Fewer options means each guess is more likely to be right, and the search tree stays small
- [ ] It always has exactly two options
why: Two options means a 50% first try; picking a cell with many options multiplies the work.
quiz: Why does each guess happen on a copy of the board?
- [ ] Copies run faster in JavaScript
- [x] If the guess fails, the original is untouched, so undoing costs nothing
- [ ] The page needs a second grid to draw
why: No need to remember and reverse every change the guess caused; just drop the copy.

```js search
// The empty cell with the fewest candidates: guessing there has the best odds.
function bestCell(b) {
  let best = -1;
  let fewest = 10;
  for (let i = 0; i < 81; i++) {
    if (b.values[i]) continue;
    const n = bitCount(b.cands[i]);
    if (n < fewest) { fewest = n; best = i; if (n === 2) break; }
  }
  return best;
}

// Logic first; when it gets stuck, guess on a copy of the board and undo if it fails.
// Returns { solution, stats, steps } (solution is null when there isn't one).
function solve(grid, { record = false, order = null } = {}) {
  const stats = { singles: 0, hidden: 0, guesses: 0, backtracks: 0 };
  const steps = [];
  const log = (s) => {
    if (s.type === 'single') stats.singles++;
    if (s.type === 'hidden') stats.hidden++;
    if (record) steps.push(s);
  };
  if (conflicts(grid).length) return { solution: null, stats, steps };

  const search = (b) => {
    if (!propagate(b, log)) return null;
    if (b.values.every(Boolean)) return b;
    const i = bestCell(b);
    let digits = digitsOf(b.cands[i]);
    if (order) digits = order(digits);
    for (const d of digits) {
      stats.guesses++;
      if (record) steps.push({ type: 'guess', index: i, value: d, reason: `guess ${d} in ${cellName(i)} (${digits.length} options)`, snapshot: b.values.slice() });
      const next = cloneBoard(b);
      place(next, i, d);
      const result = search(next);
      if (result) return result;
      stats.backtracks++;
      if (record) steps.push({ type: 'backtrack', index: i, value: d, reason: `${d} in ${cellName(i)} led to a dead end, undo`, snapshot: b.values.slice() });
    }
    return null;
  };

  const result = search(newBoard(grid));
  return { solution: result ? result.values : null, stats, steps };
}
```

```js ui
const gridEl = document.getElementById('grid');
const statusEl = document.getElementById('status');
const cells = [];
const SAMPLES = [
  '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79',  // easy
  '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..',  // hard
];
let sampleNumber = 0;

function setStatus(text) { statusEl.textContent = text; }

function buildGrid() {
  for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.inputMode = 'numeric';
    input.maxLength = 1;
    input.setAttribute('aria-label', `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/[^1-9]/g, '').slice(-1);   // one digit, 1-9 only
      onChange();
    });
    input.addEventListener('focus', () => showOptions(i));
    gridEl.appendChild(input);
    cells.push(input);
  }
}

function readGrid() { return cells.map((c) => Number(c.value) || 0); }

function showGrid(grid, filledClass = 'given') {
  grid.forEach((v, i) => {
    cells[i].value = v || '';
    cells[i].className = v ? filledClass : '';
  });
}

// Red cells: the same digit twice in a row, column or box.
function onChange() {
  const bad = new Set(conflicts(readGrid()));
  cells.forEach((c, i) => c.classList.toggle('bad', bad.has(i)));
  setStatus(bad.size ? 'The red cells break a rule: the same digit twice in a row, column or box.' : '');
}

// When you click an empty cell, say which digits could still go there.
function showOptions(i) {
  if (cells[i].value) return;
  const options = digitsOf(newBoard(readGrid()).cands[i]);
  setStatus(options.length ? `${cellName(i)} could be ${options.join(', ')}` : `${cellName(i)} has no possible digit: check the clues`);
}

// Shows the digits the solver added, in blue, without touching the clues.
function showResult(start, values) {
  values.forEach((v, i) => { if (!start[i] && v) { cells[i].value = v; cells[i].className = 'solved'; } });
}

document.getElementById('sample').onclick = () => {
  const text = SAMPLES[sampleNumber++ % SAMPLES.length];
  showGrid(parse(text));
  setStatus(sampleNumber % 2 ? 'Sample 1: an easy puzzle' : 'Sample 2: a hard one');
};
document.getElementById('clear').onclick = () => { showGrid(new Array(81).fill(0)); setStatus('Cleared'); };
document.getElementById('solve').onclick = () => {
  const start = readGrid();
  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }
  const t0 = performance.now();
  const { solution, stats } = solve(start);
  const ms = (performance.now() - t0).toFixed(1);
  if (!solution) { setStatus('This puzzle has no solution'); return; }
  showResult(start, solution);
  setStatus(`Solved in ${ms} ms: ${stats.singles + stats.hidden} cells by logic, ${stats.guesses} guesses, ${stats.backtracks} backtracks`);
};
```

## Step: Watch it solve
time: 20

The solver already writes down every step when you pass `{ record: true }`: each "only one fits", "only one spot", guess and backtrack, with a reason. Guesses and backtracks also carry a **snapshot** of the board as it was before the guess, so the replay can show the board going back.

`watchSolve()` solves the puzzle first (it's fast), then replays the steps with `setTimeout`, one every 120 milliseconds (faster when there are hundreds of them):

| Step type | On the grid | In the log |
|---|---|---|
| single / hidden | the digit appears in blue | the reason, e.g. "only 4 fits in r2c3" |
| guess | restore the snapshot, then the guess in orange | "guess 4 in r3c7 (2 options)" in orange |
| backtrack | restore the snapshot (the guess disappears) | "…led to a dead end, undo" in red |

`clearTimeout(watchTimer)` at the start stops any replay that's already running, so pressing the button twice doesn't run two replays on top of each other.

### Try it

Load the hard sample and press **Watch it solve**. You'll see logic fill in cells, an orange guess, more logic, and maybe a red undo when a guess fails.

check: js | a watchSolve() function | /function\s+watchSolve\s*\(/
check: js | the solver records its steps | /record:\s*true/
check: js | steps replay one at a time | /setTimeout\(\s*tick/
check: js | the button is wired up | /getElementById\(\s*['"]watch['"]\s*\)\.onclick\s*=\s*watchSolve/

quiz: Why does the replay restore a snapshot on a backtrack?
- [x] Because the cells filled after the wrong guess were never part of the real answer
- [ ] To make the animation longer
- [ ] Snapshots are how the solver finds the next guess
why: Everything that followed the wrong guess depended on it, so the board goes back to how it was before.
quiz: Why call clearTimeout() at the start of watchSolve()?
- [ ] It makes setTimeout faster
- [x] So a second press stops the old replay instead of running two at once
- [ ] The browser requires it before setTimeout
why: Two replays would fight over the same cells; stopping the old one keeps it clean.

```js watch
const logEl = document.getElementById('log');
let watchTimer = null;

// Replays the solver's recorded steps one at a time, with the reason for each.
function watchSolve() {
  clearTimeout(watchTimer);
  const start = readGrid();
  if (conflicts(start).length) { setStatus('Fix the red cells first'); return; }
  const { solution, steps } = solve(start, { record: true });
  if (!solution) { setStatus('This puzzle has no solution'); return; }
  showGrid(start);
  logEl.innerHTML = '';
  let k = 0;
  const tick = () => {
    if (k >= steps.length) { setStatus(`Done: ${steps.length} steps`); return; }
    const s = steps[k++];
    if (s.snapshot) {
      // a guess or an undo: put the board back the way it was before that guess
      s.snapshot.forEach((v, i) => {
        if (start[i]) return;
        cells[i].value = v || '';
        cells[i].className = v ? 'solved' : '';
      });
    }
    if (s.type !== 'backtrack') {
      cells[s.index].value = s.value;
      cells[s.index].className = s.type === 'guess' ? 'guess' : 'solved';
    }
    const li = document.createElement('li');
    li.textContent = s.reason;
    li.className = s.type;
    logEl.prepend(li);
    setStatus(s.reason);
    watchTimer = setTimeout(tick, steps.length > 400 ? 15 : 120);   // long solves play faster
  };
  tick();
}

document.getElementById('watch').onclick = watchSolve;
```

## Session: Making new puzzles

## Step: Counting solutions, and randomness you can repeat
time: 15

A real Sudoku has **exactly one** solution. To make puzzles, we first need to check that. `countSolutions(grid, limit)` runs the same search as `solve()`, but when it finds a solution it counts it and keeps going, and it stops as soon as it reaches `limit`. With `limit = 2`, the answer is 0 (impossible), 1 (a proper puzzle) or 2 (more than one answer). It never needs to find all of them.

Making puzzles also needs randomness. `Math.random()` gives different numbers every time, which is great for players but bad for testing: a bug in one random puzzle may never show up again. `mulberry32(seed)` is a tiny **seeded** random number generator: the same seed always gives the same sequence, so a puzzle can be recreated from its seed and tests are repeatable.

`shuffle(list, rand)` is the Fisher-Yates shuffle: walk the list from the end and swap each item with a random earlier (or same) one. Every order is equally likely.

### Try it

In the console, try `countSolutions(new Array(81).fill(0))`: an empty grid has billions of solutions, but the answer is 2 because it stops there. Try `const r = mulberry32(42); r(); r();` twice: same numbers both times.

check: js | a countSolutions() function | /function\s+countSolutions\s*\(/
check: js | it stops at the limit | /count\s*>=\s*limit/
check: js | a seeded random number generator | /function\s+mulberry32\s*\(/
check: js | a shuffle() function | /function\s+shuffle\s*\(/

quiz: Why does countSolutions stop at 2?
- [ ] It can't count higher than 2
- [x] We only need to know whether there is more than one answer, and finding them all could take forever
- [ ] Sudoku puzzles have at most 2 solutions
why: Exactly one is what matters; the moment a second appears, the puzzle is ambiguous.
quiz: What is a seeded random number generator good for here?
- [ ] It makes puzzles harder
- [x] The same seed recreates the same puzzle, so tests and shared puzzles are repeatable
- [ ] It is faster than Math.random()
why: Repeatable randomness means a bug found with seed 42 shows up again every time you try seed 42.

```js generate
// Counts solutions, stopping at `limit`. A proper puzzle has exactly 1.
function countSolutions(grid, limit = 2) {
  if (conflicts(grid).length) return 0;
  let count = 0;
  const search = (b) => {
    if (count >= limit || !propagate(b)) return;
    if (b.values.every(Boolean)) { count++; return; }
    const i = bestCell(b);
    for (const d of digitsOf(b.cands[i])) {
      const next = cloneBoard(b);
      place(next, i, d);
      search(next);
      if (count >= limit) return;
    }
  };
  search(newBoard(grid));
  return count;
}

// A small seeded random number generator: the same seed always gives the same numbers.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle: every order is equally likely.
function shuffle(list, rand) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

## Step: Carving a puzzle with one answer
time: 15

Now the generator, in three steps:

1. **A random finished grid.** Solve an *empty* grid, but shuffle the candidate digits before each guess (`solve(..., { order })`). A different shuffle gives a different finished grid.
2. **Carve.** Visit the 81 cells in random order and blank each one. If the puzzle still has exactly one solution, leave it blank; if not, put the digit back. Stop when the clue count reaches the level's minimum.
3. **Grade.** Solve the result and look at the stats: easy and medium puzzles must need **no** guesses (medium just has fewer clues); hard ones must need at least one. If a grid doesn't fit the level, try another (up to 40).

```svg Carving: remove a clue, keep it out only if the puzzle still has one answer
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 348 135" font-family="sans-serif"><rect x="6" y="20" width="76" height="40" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="44" y="44" text-anchor="middle" font-size="11">full grid</text><line x1="82" y1="40" x2="90" y2="40" stroke="#475569" stroke-width="2"/><rect x="90" y="20" width="76" height="40" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="128" y="44" text-anchor="middle" font-size="11">remove a clue</text><line x1="166" y1="40" x2="174" y2="40" stroke="#475569" stroke-width="2"/><rect x="174" y="20" width="76" height="40" rx="6" fill="#fef9c3" stroke="#475569"/><text x="212" y="44" text-anchor="middle" font-size="11">still 1 solution?</text><line x1="250" y1="40" x2="258" y2="40" stroke="#475569" stroke-width="2"/><rect x="258" y="20" width="76" height="40" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="296" y="44" text-anchor="middle" font-size="11">keep it out</text><path d="M214 60 V88 H130 V60" fill="none" stroke="#b91c1c" stroke-width="2"/><text x="172" y="102" text-anchor="middle" font-size="11" fill="#b91c1c">no: put it back, try the next cell</text><text x="172" y="124" text-anchor="middle" font-size="11" fill="#475569">repeat for every cell in random order, stop at the level's clue count</text></svg>
```

| Level | Fewest clues | Guessing |
|---|---|---|
| Easy | 36 | none |
| Medium | 28 | none |
| Hard | 22 | at least one |

Pick a level and press **New puzzle**. It usually takes well under a second. Then press **Watch it solve** to see why it got the level it did.

check: js | a carve() function | /function\s+carve\s*\(/
check: js | a clue stays out only if there's still one answer | /countSolutions\(\s*puzzle\s*,\s*2\s*\)\s*===\s*1/
check: js | puzzles are graded by guessing | /stats\.guesses\s*===\s*0/
check: js | the New puzzle button is wired up | /getElementById\(\s*['"]new['"]\s*\)\.onclick/

quiz: While carving, removing a clue makes countSolutions return 2. What happens?
- [x] The clue is put back, because without it the puzzle would have two answers
- [ ] The puzzle is thrown away and carving starts over
- [ ] The clue stays out and the level goes up
why: Every clue left in the finished puzzle is one that keeps the answer unique.
quiz: How does the generator know a puzzle is "hard"?
- [ ] It has fewer than 30 clues
- [x] The solver needed at least one guess to finish it
- [ ] A random number decides
why: The grade comes from how the solver had to work, which matches how a person would experience it.

```js generate
// Counts solutions, stopping at `limit`. A proper puzzle has exactly 1.
function countSolutions(grid, limit = 2) {
  if (conflicts(grid).length) return 0;
  let count = 0;
  const search = (b) => {
    if (count >= limit || !propagate(b)) return;
    if (b.values.every(Boolean)) { count++; return; }
    const i = bestCell(b);
    for (const d of digitsOf(b.cands[i])) {
      const next = cloneBoard(b);
      place(next, i, d);
      search(next);
      if (count >= limit) return;
    }
  };
  search(newBoard(grid));
  return count;
}

// A small seeded random number generator: the same seed always gives the same numbers.
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Fisher-Yates shuffle: every order is equally likely.
function shuffle(list, rand) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const LEVELS = {
  easy: { minClues: 36, guesses: 'none' },     // lots of clues; logic is enough
  medium: { minClues: 28, guesses: 'none' },   // fewer clues, still no guessing
  hard: { minClues: 22, guesses: 'some' },     // needs at least one guess
};

// A random finished grid: solve an empty grid, trying digits in random order.
function randomSolution(rand) {
  return solve(new Array(81).fill(0), { order: (digits) => shuffle(digits, rand) }).solution;
}

// Removes clues in random order, putting one back whenever removing it allows a second solution.
function carve(solution, minClues, rand) {
  const puzzle = solution.slice();
  let clues = 81;
  for (const i of shuffle([...Array(81).keys()], rand)) {
    if (clues <= minClues) break;
    const keep = puzzle[i];
    puzzle[i] = 0;
    if (countSolutions(puzzle, 2) === 1) clues--;
    else puzzle[i] = keep;
  }
  return puzzle;
}

// Tries a few grids until one grades at the requested level.
function generate(level = 'medium', seed = Math.floor(Math.random() * 2 ** 31)) {
  const spec = LEVELS[level] ?? LEVELS.medium;
  const rand = mulberry32(seed);
  let best = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const puzzle = carve(randomSolution(rand), spec.minClues, rand);
    const { stats } = solve(puzzle);
    const fits = spec.guesses === 'none' ? stats.guesses === 0 : stats.guesses > 0;
    if (fits) return puzzle;
    best ??= puzzle;
  }
  return best;
}

document.getElementById('new').onclick = () => {
  const level = document.getElementById('level').value;
  const puzzle = generate(level);
  showGrid(puzzle);
  setStatus(`A new ${level} puzzle with ${puzzle.filter(Boolean).length} clues and exactly one solution`);
};
```

## Session: How the real project is built

## Step: How the real project is organized
time: 10
kind: read

You've now built the same solver that runs in my [Sudoku Solver](https://theoyanvno.github.io/sudoku-solver/). The real project splits it into files by job:

| File | What it does |
|---|---|
| `src/sudoku.js` | parsing, validation, propagation, backtracking, counting solutions: no page code at all |
| `src/generator.js` | random grids, carving, grading, the seeded random numbers |
| `src/app.js` | the grid, typing and arrow keys, the buttons, the replay and sharing puzzles in the URL |
| `test/*.test.js` | 18 tests run with `node --test` |

The biggest difference from this guide: the real solver keeps the board in a small `Board` class with methods (`place`, `propagate`, `deadEnd`, `bestCell`) instead of separate functions:

```js
class Board {
  place(i, d) {
    this.values[i] = d;
    this.cands[i] = 0;
    for (const p of PEERS[i]) this.cands[p] &= ~(1 << d);
  }
}
```

It's the same logic with `this.` in front, which keeps all the board operations in one place.

Because `sudoku.js` never touches the page, it can be tested in Node without a browser. Here's one of the real tests:

```js
test('solves a hard puzzle that needs guessing and backtracking', () => {
  const { solution, stats } = solve(parse(HARD));
  assert.ok(isSolved(solution));
  assert.ok(stats.guesses > 0);
  // the answer keeps every original clue
  parse(HARD).forEach((v, i) => v && assert.equal(solution[i], v));
});
```

The real app also has a few things this guide skipped: a `validate()` function with friendly messages (like "Only 16 clues: a Sudoku needs at least 17 to have a single answer"), **Check my answers** that underlines wrong entries without revealing the answers, arrow-key movement between cells, and puzzles shared in the URL (`…/sudoku-solver/#53..7....`).

## Finish

### What you learned

- Building a grid of inputs from JavaScript, and keeping the real puzzle as an array of 81 numbers
- Working out rows, columns, boxes and peers once, and reusing them everywhere
- Bitmasks: `&`, `|`, `~` and `<<` for fast sets of digits
- Constraint propagation with two rules, repeated until nothing changes
- Recursion and backtracking on copies, and choosing the guess with the best odds
- Recording steps so a program can explain itself
- Counting solutions with an early stop, seeded randomness and Fisher-Yates shuffling
- Generating content and grading it by how hard it was to solve

### Challenges

1. **Check my answers:** compare the grid with the solution and add a class to wrong cells, without showing the right digits.
2. **Pencil marks:** show each empty cell's candidates in tiny digits (hint: `newBoard(readGrid()).cands`).
3. **Arrow keys:** move focus between cells with the arrow keys (hint: `keydown`, and `cells[i ± 1]` or `cells[i ± 9]`).
4. **Share in the URL:** put the puzzle in `location.hash` and load it when the page opens.
5. **A third rule:** "naked pairs": two cells in a unit with the same two candidates mean no other cell in that unit can have them.

Compare your finished solver with the [live version](https://theoyanvno.github.io/sudoku-solver/) and the [source code](https://github.com/TheoYanvno/sudoku-solver).
