---
id: chess
title: Chess Coach
blocks-html: page
blocks-css: base
blocks-js: board, moves, rules, ai, coach, ui, go
goals: Store a chess position as data and read it from FEN; Generate every legal move, including check, castling, en passant and promotion; Score a position with piece values and piece-square tables; Search ahead with negamax and alpha-beta pruning; Grade a player's move by comparing it with the best move; Explain mistakes in plain language and sum up a game
prereqs: JavaScript functions, arrays, objects and arrow functions; Recursion (a function that calls itself) helps; Knowing how the chess pieces move
---

## Session: A board you can click

## Step: A position as data, drawn as a board
time: 15

Welcome! In this guide you'll rebuild my [Chess Coach](https://theoyanvno.github.io/chess-coach/) from a blank page: a chess game with every rule, a computer opponent that looks ahead, and a coach that grades each of your moves ("Blunder: your queen on h5 can be taken by the knight on f6") and writes a report at the end.

It starts the same way as every board game: **the position is data, and the page just draws it.** A chess position is an object:

| Field | Example | Meaning |
|---|---|---|
| `board` | 64 items | `'P'`, `'n'`, … or `null`; uppercase is white |
| `turn` | `'w'` | whose move it is |
| `castling` | `'KQkq'` | who can still castle, and on which side |
| `ep` | `-1` | the en passant square, if a pawn just jumped two |
| `halfmove`, `fullmove` | `0`, `1` | counters for the fifty-move rule and move numbers |

Chess players write positions as **FEN**, one line of text. The start position is `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`: the pieces rank by rank from the top, with digits for runs of empty squares, then the other fields. `fromFen()` reads it: it splits on spaces, then walks the piece letters, pushing `null` for each empty square.

```svg Square numbers: 0 is a8 in the top left, 63 is h1 in the bottom right
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 270" font-family="sans-serif"><rect x="20" y="10" width="30" height="30" fill="#eeddb8"/><text x="35" y="29" text-anchor="middle" font-size="11" fill="#1c2430">0</text><rect x="50" y="10" width="30" height="30" fill="#b08458"/><rect x="80" y="10" width="30" height="30" fill="#eeddb8"/><rect x="110" y="10" width="30" height="30" fill="#b08458"/><rect x="140" y="10" width="30" height="30" fill="#eeddb8"/><rect x="170" y="10" width="30" height="30" fill="#b08458"/><rect x="200" y="10" width="30" height="30" fill="#eeddb8"/><rect x="230" y="10" width="30" height="30" fill="#b08458"/><text x="245" y="29" text-anchor="middle" font-size="11" fill="#1c2430">7</text><rect x="20" y="40" width="30" height="30" fill="#b08458"/><rect x="50" y="40" width="30" height="30" fill="#eeddb8"/><rect x="80" y="40" width="30" height="30" fill="#b08458"/><rect x="110" y="40" width="30" height="30" fill="#eeddb8"/><rect x="140" y="40" width="30" height="30" fill="#b08458"/><rect x="170" y="40" width="30" height="30" fill="#eeddb8"/><rect x="200" y="40" width="30" height="30" fill="#b08458"/><rect x="230" y="40" width="30" height="30" fill="#eeddb8"/><rect x="20" y="70" width="30" height="30" fill="#eeddb8"/><rect x="50" y="70" width="30" height="30" fill="#b08458"/><rect x="80" y="70" width="30" height="30" fill="#eeddb8"/><rect x="110" y="70" width="30" height="30" fill="#b08458"/><rect x="140" y="70" width="30" height="30" fill="#eeddb8"/><rect x="170" y="70" width="30" height="30" fill="#b08458"/><rect x="200" y="70" width="30" height="30" fill="#eeddb8"/><rect x="230" y="70" width="30" height="30" fill="#b08458"/><rect x="20" y="100" width="30" height="30" fill="#b08458"/><rect x="50" y="100" width="30" height="30" fill="#eeddb8"/><rect x="80" y="100" width="30" height="30" fill="#b08458"/><rect x="110" y="100" width="30" height="30" fill="#eeddb8"/><text x="125" y="119" text-anchor="middle" font-size="11" fill="#1c2430">27</text><rect x="140" y="100" width="30" height="30" fill="#b08458"/><rect x="170" y="100" width="30" height="30" fill="#eeddb8"/><rect x="200" y="100" width="30" height="30" fill="#b08458"/><rect x="230" y="100" width="30" height="30" fill="#eeddb8"/><rect x="20" y="130" width="30" height="30" fill="#eeddb8"/><rect x="50" y="130" width="30" height="30" fill="#b08458"/><rect x="80" y="130" width="30" height="30" fill="#eeddb8"/><rect x="110" y="130" width="30" height="30" fill="#b08458"/><rect x="140" y="130" width="30" height="30" fill="#eeddb8"/><text x="155" y="149" text-anchor="middle" font-size="11" fill="#1c2430">36</text><rect x="170" y="130" width="30" height="30" fill="#b08458"/><rect x="200" y="130" width="30" height="30" fill="#eeddb8"/><rect x="230" y="130" width="30" height="30" fill="#b08458"/><rect x="20" y="160" width="30" height="30" fill="#b08458"/><rect x="50" y="160" width="30" height="30" fill="#eeddb8"/><rect x="80" y="160" width="30" height="30" fill="#b08458"/><rect x="110" y="160" width="30" height="30" fill="#eeddb8"/><rect x="140" y="160" width="30" height="30" fill="#b08458"/><rect x="170" y="160" width="30" height="30" fill="#eeddb8"/><rect x="200" y="160" width="30" height="30" fill="#b08458"/><rect x="230" y="160" width="30" height="30" fill="#eeddb8"/><rect x="20" y="190" width="30" height="30" fill="#eeddb8"/><rect x="50" y="190" width="30" height="30" fill="#b08458"/><rect x="80" y="190" width="30" height="30" fill="#eeddb8"/><rect x="110" y="190" width="30" height="30" fill="#b08458"/><rect x="140" y="190" width="30" height="30" fill="#eeddb8"/><rect x="170" y="190" width="30" height="30" fill="#b08458"/><rect x="200" y="190" width="30" height="30" fill="#eeddb8"/><rect x="230" y="190" width="30" height="30" fill="#b08458"/><rect x="20" y="220" width="30" height="30" fill="#b08458"/><text x="35" y="239" text-anchor="middle" font-size="11" fill="#1c2430">56</text><rect x="50" y="220" width="30" height="30" fill="#eeddb8"/><rect x="80" y="220" width="30" height="30" fill="#b08458"/><rect x="110" y="220" width="30" height="30" fill="#eeddb8"/><rect x="140" y="220" width="30" height="30" fill="#b08458"/><rect x="170" y="220" width="30" height="30" fill="#eeddb8"/><rect x="200" y="220" width="30" height="30" fill="#b08458"/><text x="215" y="239" text-anchor="middle" font-size="11" fill="#1c2430">62</text><rect x="230" y="220" width="30" height="30" fill="#eeddb8"/><text x="245" y="239" text-anchor="middle" font-size="11" fill="#1c2430">63</text><text x="35" y="264" text-anchor="middle" font-size="11" fill="#475569">a</text><text x="65" y="264" text-anchor="middle" font-size="11" fill="#475569">b</text><text x="95" y="264" text-anchor="middle" font-size="11" fill="#475569">c</text><text x="125" y="264" text-anchor="middle" font-size="11" fill="#475569">d</text><text x="155" y="264" text-anchor="middle" font-size="11" fill="#475569">e</text><text x="185" y="264" text-anchor="middle" font-size="11" fill="#475569">f</text><text x="215" y="264" text-anchor="middle" font-size="11" fill="#475569">g</text><text x="245" y="264" text-anchor="middle" font-size="11" fill="#475569">h</text><text x="10" y="29" text-anchor="middle" font-size="11" fill="#475569">8</text><text x="10" y="59" text-anchor="middle" font-size="11" fill="#475569">7</text><text x="10" y="89" text-anchor="middle" font-size="11" fill="#475569">6</text><text x="10" y="119" text-anchor="middle" font-size="11" fill="#475569">5</text><text x="10" y="149" text-anchor="middle" font-size="11" fill="#475569">4</text><text x="10" y="179" text-anchor="middle" font-size="11" fill="#475569">3</text><text x="10" y="209" text-anchor="middle" font-size="11" fill="#475569">2</text><text x="10" y="239" text-anchor="middle" font-size="11" fill="#475569">1</text><text x="270" y="40" font-size="12" fill="#1c2430">0 = a8 (top left)</text><text x="270" y="60" font-size="12" fill="#1c2430">7 = h8</text><text x="270" y="80" font-size="12" fill="#1c2430">56 = a1, 63 = h1</text><text x="270" y="110" font-size="12" fill="#475569">row = Math.floor(i / 8)</text><text x="270" y="128" font-size="12" fill="#475569">column = i % 8</text><text x="270" y="158" font-size="12" fill="#475569">one row down = i + 8</text><text x="270" y="176" font-size="12" fill="#475569">white pawns move i - 8</text></svg>
```

### What to write

- **HTML:** the header with a status line, `<div id="board">`, and the side panel you'll use later (level menu, Hint, New game, the coach feed and a report box).
- **CSS:** `.board` is a CSS Grid with `repeat(8, 1fr)` and `aspect-ratio: 1`, so it stays square at any width. Light and dark squares get their colors; extra classes (`sel`, `target`, `check`, `hint`) are ready for later steps.
- **JavaScript:** `fromFen()`, and a `render()` that runs a loop over the 64 squares, makes a `<button>` for each (so it can be clicked and reached with the keyboard), colors it light or dark, and puts in the piece from `GLYPH`.

The pieces are Unicode chess symbols (♚ ♛ ♜ ♝ ♞ ♟). Using the solid shapes for both sides and coloring them with CSS (`.piece.w` is white with a dark outline) keeps them looking the same on every system.

check: html | the board element | /id=["']board["']/ | Add <div id="board" class="board"></div>
check: css | an 8-column grid | /\.board\s*\{[^}]*grid-template-columns:\s*repeat\(\s*8/ | Give .board grid-template-columns: repeat(8, 1fr)
check: js | a fromFen() function | /function\s+fromFen\s*\(/
check: js | render() draws all 64 squares | /for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*64/
check: js | piece symbols | /const\s+GLYPH\s*=/

quiz: In the FEN "4k3/8/…", what does the 4 mean?
- [x] Four empty squares, then the black king
- [ ] The king is on the 4th rank
- [ ] Four black kings
why: Digits stand for runs of empty squares, so the top rank is four empties, the king (k), then three empties.
quiz: Why keep the position as data instead of reading it back from the page?
- [ ] Reading the page is not allowed
- [x] The computer will try thousands of positions that are never drawn, so the rules must work on plain data
- [ ] Data uses fewer colors
why: The search in session 3 plays out moves on copies of the data; the page only ever shows the real game.

```html page
<header>
  <h1>Chess Coach</h1>
  <p id="status" class="status" role="status"></p>
</header>

<main>
  <div id="board" class="board" aria-label="Chess board"></div>
  <aside>
    <div class="controls">
      <label>Opponent
        <select id="level">
          <option value="easy">Easy</option>
          <option value="medium" selected>Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <button id="hint">💡 Hint</button>
      <button id="new">New game</button>
    </div>
    <h2>Coach</h2>
    <ol id="feed" class="feed"></ol>
    <div id="report" class="report" hidden></div>
  </aside>
</main>
```

```css base
body { margin: 0; font-family: system-ui, sans-serif; background: #f4f1ea; color: #1c2430; }
header { text-align: center; }
header h1 { margin: 14px 0 4px; }
.status { margin: 0 0 10px; color: #4b5563; min-height: 1.4em; }
main { display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; padding: 0 12px 20px; }
[hidden] { display: none !important; }

/* 8 equal columns; aspect-ratio keeps the board square on any screen */
.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: min(92vw, 400px);
  aspect-ratio: 1;
  border: 3px solid #3b2f22;
}
.sq { position: relative; border: 0; padding: 0; display: grid; place-items: center; font-size: clamp(22px, 8vw, 38px); cursor: pointer; }
.sq.light { background: #eeddb8; }
.sq.dark { background: #b08458; }
.sq.last { box-shadow: inset 0 0 0 100px rgba(250, 220, 60, 0.35); }
.sq.sel { box-shadow: inset 0 0 0 3px #1d4ed8; }
.sq.target::after { content: ''; position: absolute; width: 26%; height: 26%; border-radius: 50%; background: rgba(29, 78, 216, 0.45); }
.sq.capture { box-shadow: inset 0 0 0 4px rgba(185, 28, 28, 0.7); }
.sq.check { background: #f87171; }
.sq.hint { box-shadow: inset 0 0 0 4px #16a34a; }
.piece { line-height: 1; pointer-events: none; }
.piece.w { color: #fff; text-shadow: 0 0 2px #000, 0 0 1px #000; }
.piece.b { color: #111; }

aside { width: min(92vw, 340px); }
aside h2 { font-size: 1rem; margin: 6px 0; }
.controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
button, select { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid #1c2430; background: #fff; cursor: pointer; }
.feed { list-style: none; padding: 0; margin: 0; max-height: 340px; overflow: auto; }
.note { background: #fff; border-left: 4px solid #94a3b8; border-radius: 6px; padding: 6px 10px; margin-bottom: 8px; }
.note p { margin: 4px 0; font-size: 14px; }
.note.great { border-color: #16a34a; }
.note.good { border-color: #65a30d; }
.note.warn { border-color: #d97706; }
.note.bad { border-color: #b91c1c; }
.note.tip { border-color: #1d4ed8; }
.report { background: #fff; border-radius: 8px; padding: 8px 12px; margin-top: 10px; }
```

```js board
// Squares are numbered 0-63 row by row from the top: 0 = a8, 7 = h8, 56 = a1, 63 = h1.
// Pieces are letters: uppercase = white (P N B R Q K), lowercase = black, null = empty.
const FILES = 'abcdefgh';
const sqName = (i) => FILES[i % 8] + (8 - Math.floor(i / 8));
const colorOf = (p) => (p ? (p === p.toUpperCase() ? 'w' : 'b') : null);
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// FEN describes a whole position in one line: the pieces rank by rank, whose turn it is,
// castling rights, the en passant square and two move counters.
function fromFen(fen) {
  const [placement, turn, castling, ep, half, full] = fen.trim().split(/\s+/);
  const board = [];
  for (const ch of placement.replace(/\//g, '')) {
    if (/\d/.test(ch)) for (let k = 0; k < Number(ch); k++) board.push(null);   // a digit = that many empty squares
    else board.push(ch);
  }
  return {
    board,
    turn,
    castling: castling === '-' ? '' : castling,
    ep: ep === '-' ? -1 : FILES.indexOf(ep[0]) + (8 - Number(ep[1])) * 8,
    halfmove: Number(half ?? 0),
    fullmove: Number(full ?? 1),
  };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);

function render() {
  const board = $('board');
  board.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;
}

$('new').onclick = () => {
  state = fromFen(START_FEN);
  render();
};
```

```js go
render();
```

## Step: Moving around the board with step()
time: 10

Every piece's movement is "go this many columns and rows". With squares numbered 0-63, it's tempting to just add numbers (one square right is `+1`, one row down is `+8`). But that breaks at the edges: `+1` from h8 (square 7) lands on a7 (square 8), on the other side of the board.

`step(i, df, dr)` does it safely. It turns the square into a column (`i % 8`) and row (`Math.floor(i / 8)`), adds the steps, and returns **-1** if the result is off the board. Every move generator from here on uses it, so no piece can ever wrap around an edge.

Then each piece's movement is just a list of steps:

| List | Steps | Used by |
|---|---|---|
| `KNIGHT` | 8 L-shapes like `[1, 2]` | knights |
| `KING` | the 8 neighbors | kings |
| `ROOK_DIRS` | right, left, down, up | rooks and queens |
| `BISHOP_DIRS` | the 4 diagonals | bishops and queens |

Remember the rows count **down** from the top (row 0 is rank 8), so for white "forward" is `dr = -1`.

### Try it

The `go` block logs where a knight on g1 (square 62) can jump. Open the console: you should see e2, f3 and h3. The other five L-shapes fall off the board and come back as -1, which the `filter` removes.

check: js | a step() helper | /function\s+step\s*\(/
check: js | off the board returns -1 | /\?\s*-1\s*:/ | return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f;
check: js | the knight's jumps | /const\s+KNIGHT\s*=/
check: js | the rook's directions | /const\s+ROOK_DIRS\s*=/

quiz: Why not move one square right by just adding 1 to the square number?
- [ ] Adding is slow
- [x] From the h-file it would wrap around to the a-file on the next row
- [ ] Square numbers can't be added
why: h8 + 1 is a7. step() works in columns and rows, so it can tell the move went off the edge.
quiz: Rows count down from the top. Which dr moves a white pawn forward?
- [ ] dr = 1
- [x] dr = -1
- [ ] dr = 8
why: White starts at the bottom (rows 6-7) and moves toward row 0, so each step forward is one row up: -1.

```js board
// Squares are numbered 0-63 row by row from the top: 0 = a8, 7 = h8, 56 = a1, 63 = h1.
// Pieces are letters: uppercase = white (P N B R Q K), lowercase = black, null = empty.
const FILES = 'abcdefgh';
const sqName = (i) => FILES[i % 8] + (8 - Math.floor(i / 8));
const colorOf = (p) => (p ? (p === p.toUpperCase() ? 'w' : 'b') : null);
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// FEN describes a whole position in one line: the pieces rank by rank, whose turn it is,
// castling rights, the en passant square and two move counters.
function fromFen(fen) {
  const [placement, turn, castling, ep, half, full] = fen.trim().split(/\s+/);
  const board = [];
  for (const ch of placement.replace(/\//g, '')) {
    if (/\d/.test(ch)) for (let k = 0; k < Number(ch); k++) board.push(null);   // a digit = that many empty squares
    else board.push(ch);
  }
  return {
    board,
    turn,
    castling: castling === '-' ? '' : castling,
    ep: ep === '-' ? -1 : FILES.indexOf(ep[0]) + (8 - Number(ep[1])) * 8,
    halfmove: Number(half ?? 0),
    fullmove: Number(full ?? 1),
  };
}

const fileOf = (i) => i % 8;
const rankOf = (i) => Math.floor(i / 8);   // the board row: 0 is rank 8 at the top

// One step from square i: df columns to the right, dr rows down. -1 means "off the board".
function step(i, df, dr) {
  const f = fileOf(i) + df;
  const r = rankOf(i) + dr;
  return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f;
}

const KNIGHT = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
const KING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
const ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
```

```js go
render();
// Try it: where can the knight on g1 (square 62) jump?
console.log('A knight on g1 can jump to', KNIGHT.map(([df, dr]) => step(62, df, dr)).filter((i) => i >= 0).map(sqName).join(', '));
```

## Step: Click a piece, click a square
time: 15

Now make it playable, without rules for the moment. The first click picks up one of your pieces (`selected`), the second click moves it. If you click another of your own pieces instead, that one is picked up instead.

The important function is **`makeMove(s, m)`**: it returns a **new** state with the move made, and never changes the old one. It copies the board with `s.board.slice()`, moves the piece, and flips the turn. That might seem fussy now, but it's what makes the computer opponent possible: it will try thousands of moves on copies, and the real game is never touched.

A move is an object too: `{ from, to, piece, captured }`, with more fields to come (`promotion`, `castle`, `enPassant`, `double`).

### What to write

- `movesFrom(i)`: for now, every square that doesn't hold one of your own pieces.
- `render()` adds the classes: `sel` on the picked-up square, `target` (a dot) or `capture` (a red ring) on squares you can move to, `last` on the previous move.
- `play(move)` makes the move and redraws; a click handler on the whole board finds which square was clicked with `e.target.closest('.sq')`.

One listener on the board, instead of 64, is called **event delegation**: it also keeps working after `render()` replaces all the squares.

check: js | a makeMove() function | /function\s+makeMove\s*\(/
check: js | it copies the board first | /s\.board\.slice\(\)/
check: js | a play() function | /function\s+play\s*\(/
check: js | one click listener on the board | /\$\(\s*['"]board['"]\s*\)\.addEventListener\(\s*['"]click['"]/

quiz: Why does makeMove() return a new state instead of changing the old one?
- [x] So the computer can try moves on copies without disturbing the real game
- [ ] JavaScript arrays can't be changed
- [ ] It uses less memory
why: Search means "what if": trying a move, looking at the result, then trying another from the same start.
quiz: Why put one click listener on the board instead of one on each square?
- [ ] Buttons can't have listeners
- [x] render() rebuilds the squares, and a single board listener keeps working through that
- [ ] It makes the squares bigger
why: With event delegation, e.target.closest(".sq") finds the square, however many times it was redrawn.

```js rules
// Returns a NEW state with the move made. The old state is never changed:
// the computer will try thousands of moves on copies without disturbing the real game.
function makeMove(s, m) {
  const b = s.board.slice();
  b[m.to] = b[m.from];
  b[m.from] = null;
  return { ...s, board: b, turn: s.turn === 'w' ? 'b' : 'w' };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;

// For now any square that doesn't hold one of your own pieces. Real rules come next session.
const movesFrom = (i) => [...Array(64).keys()]
  .filter((to) => to !== i && colorOf(state.board[to]) !== state.turn)
  .map((to) => ({ from: i, to, piece: state.board[i], captured: state.board[to] }));

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  render();
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq) return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  render();
};
```

```js go
render();
```

## Session: The rules of chess

## Step: How the pieces move
time: 20

Time for real rules. `pseudoMoves(s)` lists every move each piece of the side to move **could** make: "pseudo" because it doesn't yet check whether the move leaves your own king in check (that's step 6).

There are only two kinds of movement:

- **Jumpers** (knight, king): try each step in the list once. If the square is on the board and doesn't hold your own piece, it's a move (a capture if an enemy is there).
- **Sliders** (rook, bishop, queen): for each direction, keep stepping until you leave the board or hit a piece. An empty square is a move; an enemy piece is a capture and then you stop; your own piece just stops you.

```svg A rook slides until something is in the way: it can capture the enemy knight but not pass its own pawn
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 225" font-family="sans-serif"><rect x="10" y="10" width="26" height="26" fill="#eeddb8"/><rect x="36" y="10" width="26" height="26" fill="#b08458"/><rect x="62" y="10" width="26" height="26" fill="#eeddb8"/><rect x="88" y="10" width="26" height="26" fill="#b08458"/><rect x="114" y="10" width="26" height="26" fill="#eeddb8"/><rect x="140" y="10" width="26" height="26" fill="#b08458"/><rect x="166" y="10" width="26" height="26" fill="#eeddb8"/><rect x="192" y="10" width="26" height="26" fill="#b08458"/><rect x="10" y="36" width="26" height="26" fill="#b08458"/><rect x="36" y="36" width="26" height="26" fill="#eeddb8"/><rect x="62" y="36" width="26" height="26" fill="#b08458"/><rect x="88" y="36" width="26" height="26" fill="#fca5a5"/><rect x="114" y="36" width="26" height="26" fill="#b08458"/><rect x="140" y="36" width="26" height="26" fill="#eeddb8"/><rect x="166" y="36" width="26" height="26" fill="#b08458"/><rect x="192" y="36" width="26" height="26" fill="#eeddb8"/><rect x="10" y="62" width="26" height="26" fill="#eeddb8"/><rect x="36" y="62" width="26" height="26" fill="#b08458"/><rect x="62" y="62" width="26" height="26" fill="#eeddb8"/><rect x="88" y="62" width="26" height="26" fill="#93c5fd"/><rect x="114" y="62" width="26" height="26" fill="#eeddb8"/><rect x="140" y="62" width="26" height="26" fill="#b08458"/><rect x="166" y="62" width="26" height="26" fill="#eeddb8"/><rect x="192" y="62" width="26" height="26" fill="#b08458"/><rect x="10" y="88" width="26" height="26" fill="#b08458"/><rect x="36" y="88" width="26" height="26" fill="#eeddb8"/><rect x="62" y="88" width="26" height="26" fill="#b08458"/><rect x="88" y="88" width="26" height="26" fill="#93c5fd"/><rect x="114" y="88" width="26" height="26" fill="#b08458"/><rect x="140" y="88" width="26" height="26" fill="#eeddb8"/><rect x="166" y="88" width="26" height="26" fill="#b08458"/><rect x="192" y="88" width="26" height="26" fill="#eeddb8"/><rect x="10" y="114" width="26" height="26" fill="#93c5fd"/><rect x="36" y="114" width="26" height="26" fill="#93c5fd"/><rect x="62" y="114" width="26" height="26" fill="#93c5fd"/><rect x="88" y="114" width="26" height="26" fill="#b08458"/><rect x="114" y="114" width="26" height="26" fill="#93c5fd"/><rect x="140" y="114" width="26" height="26" fill="#93c5fd"/><rect x="166" y="114" width="26" height="26" fill="#eeddb8"/><rect x="192" y="114" width="26" height="26" fill="#b08458"/><rect x="10" y="140" width="26" height="26" fill="#b08458"/><rect x="36" y="140" width="26" height="26" fill="#eeddb8"/><rect x="62" y="140" width="26" height="26" fill="#b08458"/><rect x="88" y="140" width="26" height="26" fill="#93c5fd"/><rect x="114" y="140" width="26" height="26" fill="#b08458"/><rect x="140" y="140" width="26" height="26" fill="#eeddb8"/><rect x="166" y="140" width="26" height="26" fill="#b08458"/><rect x="192" y="140" width="26" height="26" fill="#eeddb8"/><rect x="10" y="166" width="26" height="26" fill="#eeddb8"/><rect x="36" y="166" width="26" height="26" fill="#b08458"/><rect x="62" y="166" width="26" height="26" fill="#eeddb8"/><rect x="88" y="166" width="26" height="26" fill="#93c5fd"/><rect x="114" y="166" width="26" height="26" fill="#eeddb8"/><rect x="140" y="166" width="26" height="26" fill="#b08458"/><rect x="166" y="166" width="26" height="26" fill="#eeddb8"/><rect x="192" y="166" width="26" height="26" fill="#b08458"/><rect x="10" y="192" width="26" height="26" fill="#b08458"/><rect x="36" y="192" width="26" height="26" fill="#eeddb8"/><rect x="62" y="192" width="26" height="26" fill="#b08458"/><rect x="88" y="192" width="26" height="26" fill="#93c5fd"/><rect x="114" y="192" width="26" height="26" fill="#b08458"/><rect x="140" y="192" width="26" height="26" fill="#eeddb8"/><rect x="166" y="192" width="26" height="26" fill="#b08458"/><rect x="192" y="192" width="26" height="26" fill="#eeddb8"/><text x="101" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#1d4ed8">R</text><text x="179" y="132" text-anchor="middle" font-size="14" font-weight="700" fill="#1d4ed8">P</text><text x="101" y="54" text-anchor="middle" font-size="14" font-weight="700" fill="#b91c1c">n</text><text x="230" y="40" font-size="12" fill="#1c2430">The rook slides in 4 directions</text><rect x="230" y="55" width="14" height="14" fill="#93c5fd"/><text x="250" y="67" font-size="12">squares it can reach</text><rect x="230" y="80" width="14" height="14" fill="#fca5a5"/><text x="250" y="92" font-size="12">enemy piece: capture, then stop</text><text x="230" y="120" font-size="12">own pawn on g4: stop before it</text><text x="230" y="150" font-size="12" fill="#475569">bishops use the 4 diagonals,</text><text x="230" y="166" font-size="12" fill="#475569">queens use all 8 directions</text></svg>
```

The queen needs no code of her own: she's a rook and a bishop together, `[...ROOK_DIRS, ...BISHOP_DIRS]`. Pawns are different enough to get their own step next.

`add()` builds each move object. `captured: b[to]` records what was on the target square (or `null`), which the computer and coach will use a lot.

### Try it

`movesFrom()` now uses `pseudoMoves()`. Click a knight: two dots. Click a rook: nothing (it's boxed in). Pawns can't move yet.

check: js | a pseudoMoves() function | /function\s+pseudoMoves\s*\(/
check: js | sliders keep going until blocked | /while\s*\(\s*to\s*>=\s*0\s*\)/
check: js | the queen uses both kinds of direction | /\[\s*\.\.\.ROOK_DIRS\s*,\s*\.\.\.BISHOP_DIRS\s*\]/
check: js | clicks use the real moves | /pseudoMoves\(\s*state\s*\)\.filter/

quiz: A bishop slides toward an enemy pawn two squares away. Which squares can it move to in that direction?
- [ ] Only the empty square
- [x] The empty square and the pawn's square (a capture), then it stops
- [ ] Every square until the edge of the board
why: An enemy piece can be captured, but the bishop can't jump over it.
quiz: Why does the queen have no movement code of her own?
- [ ] Queens are handled by the king code
- [x] She moves like a rook and a bishop combined, so she uses both direction lists
- [ ] The queen can't move until step 7
why: Reusing the two lists keeps the rules short and means one fix to slider code fixes all three pieces.

```js moves
// Every move each piece could make, before checking whether it leaves your own king in check.
function pseudoMoves(s) {
  const moves = [];
  const b = s.board;
  const me = s.turn;
  const them = me === 'w' ? 'b' : 'w';
  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });

  for (let from = 0; from < 64; from++) {
    const p = b[from];
    if (!p || colorOf(p) !== me) continue;
    const type = p.toUpperCase();
    if (type === 'P') continue;                               // pawns come in the next step
    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction
      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {
        const to = step(from, df, dr);
        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);
      }
    } else {                                                     // sliders: keep going until something is in the way
      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];
      for (const [df, dr] of dirs) {
        let to = step(from, df, dr);
        while (to >= 0) {
          if (!b[to]) add(from, to);
          else { if (colorOf(b[to]) === them) add(from, to); break; }
          to = step(to, df, dr);
        }
      }
    }
  }
  return moves;
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;

// The moves the piece on square i can make (we'll rule out moving into check in step 6).
const movesFrom = (i) => pseudoMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  render();
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq) return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  render();
};
```

## Step: Pawns
time: 15

Pawns are the most rule-heavy piece:

| Rule | Code |
|---|---|
| move one square forward, only onto an empty square | `one = step(from, 0, dir)` and `!b[one]` |
| two squares from the starting row, if both are empty | `rankOf(from) === startRow` |
| capture one square diagonally forward | `for (const df of [-1, 1])` |
| reaching the last row promotes | `pushOrPromote()` adds Q, R, B and N versions |

`dir` is -1 for white and +1 for black, so one piece of code handles both colors.

A two-square jump is marked `double: true`, and `makeMove()` now records the square it skipped over as `ep`. That's for en passant in the next step. `makeMove()` also handles promotion (`m.promotion || b[m.from]` puts the new piece on the square) and keeps the move counters: `halfmove` goes back to 0 after any capture or pawn move, which is how the fifty-move rule will be counted.

In this version a promoting pawn always becomes a queen when you click (the click handler picks the `Q` move). Letting the player choose is one of the challenges at the end.

### Try it

Push some pawns, including a two-square jump. Try to capture straight ahead: you can't.

check: js | pawns have a starting row for the double step | /startRow/
check: js | promotion moves | /promotion:\s*me\s*===\s*['"]w['"]/
check: js | makeMove records the en passant square | /ep:\s*m\.double/

quiz: Why does pushOrPromote() add four moves when a pawn reaches the last row?
- [ ] The pawn moves four times
- [x] The player can promote to a queen, rook, bishop or knight, and each is a different move
- [ ] To slow down the computer
why: Usually a queen is best, but sometimes a knight gives check or a rook avoids stalemate, so all four are real choices.
quiz: Why does halfmove go back to 0 after a pawn move or capture?
- [x] The fifty-move rule counts moves since the last capture or pawn move
- [ ] To show whose turn it is
- [ ] Pawns can only move every fifty moves
why: Those are the only moves that can't be undone, so the rule counts from the last one.

```js moves
// Every move each piece could make, before checking whether it leaves your own king in check.
function pseudoMoves(s) {
  const moves = [];
  const b = s.board;
  const me = s.turn;
  const them = me === 'w' ? 'b' : 'w';
  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });

  for (let from = 0; from < 64; from++) {
    const p = b[from];
    if (!p || colorOf(p) !== me) continue;
    const type = p.toUpperCase();
    if (type === 'P') {
      const dir = me === 'w' ? -1 : 1;                         // white moves up the board (toward row 0)
      const startRow = me === 'w' ? 6 : 1;
      const lastRow = me === 'w' ? 0 : 7;
      const pushOrPromote = (to, extra = {}) => {
        if (rankOf(to) === lastRow) for (const promo of 'QRBN') add(from, to, { ...extra, promotion: me === 'w' ? promo : promo.toLowerCase() });
        else add(from, to, extra);
      };
      const one = step(from, 0, dir);
      if (one >= 0 && !b[one]) {
        pushOrPromote(one);
        const two = step(from, 0, 2 * dir);
        if (rankOf(from) === startRow && !b[two]) add(from, two, { double: true });
      }
      for (const df of [-1, 1]) {                               // pawns capture diagonally
        const to = step(from, df, dir);
        if (to < 0) continue;
        if (b[to] && colorOf(b[to]) === them) pushOrPromote(to);
      }
      continue;
    }
    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction
      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {
        const to = step(from, df, dr);
        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);
      }
    } else {                                                     // sliders: keep going until something is in the way
      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];
      for (const [df, dr] of dirs) {
        let to = step(from, df, dr);
        while (to >= 0) {
          if (!b[to]) add(from, to);
          else { if (colorOf(b[to]) === them) add(from, to); break; }
          to = step(to, df, dr);
        }
      }
    }
  }
  return moves;
}
```

```js rules
// Returns a NEW state with the move made. The old state is never changed:
// the computer will try thousands of moves on copies without disturbing the real game.
function makeMove(s, m) {
  const b = s.board.slice();
  const me = s.turn;
  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece
  b[m.from] = null;
  return {
    ...s,
    board: b,
    turn: me === 'w' ? 'b' : 'w',
    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over
    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,
    fullmove: s.fullmove + (me === 'b' ? 1 : 0),
  };
}
```

## Step: Check and legal moves
time: 20

The most important rule: **you may never leave your own king attacked.** That covers moving into check, ignoring a check, and moving a "pinned" piece that was shielding your king.

There's an elegant way to handle all three at once: make each pseudo move on a copy, and throw it away if your king is attacked afterward.

```svg One filter makes moves legal: try each move on a copy and drop it if your king is attacked
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 428 145" font-family="sans-serif"><rect x="6" y="20" width="96" height="42" rx="6" fill="#e2e8f0" stroke="#475569"/><text x="54" y="45" text-anchor="middle" font-size="11">every possible move</text><line x1="102" y1="41" x2="110" y2="41" stroke="#475569" stroke-width="2"/><rect x="110" y="20" width="96" height="42" rx="6" fill="#fef9c3" stroke="#475569"/><text x="158" y="45" text-anchor="middle" font-size="11">make it on a copy</text><line x1="206" y1="41" x2="214" y2="41" stroke="#475569" stroke-width="2"/><rect x="214" y="20" width="96" height="42" rx="6" fill="#ffedd5" stroke="#475569"/><text x="262" y="45" text-anchor="middle" font-size="11">is my king attacked?</text><line x1="310" y1="41" x2="318" y2="41" stroke="#475569" stroke-width="2"/><rect x="318" y="20" width="96" height="42" rx="6" fill="#bbf7d0" stroke="#475569"/><text x="366" y="45" text-anchor="middle" font-size="11">legal move</text><path d="M266 62 V92" stroke="#b91c1c" stroke-width="2"/><text x="266" y="108" text-anchor="middle" font-size="11" fill="#b91c1c">yes: throw the move away</text><text x="214" y="134" text-anchor="middle" font-size="11" fill="#475569">this one filter handles pins, moving into check and escaping check</text></svg>
```

**`isAttacked(s, sq, by)`** asks "can side `by` capture on square `sq`?" Instead of generating every enemy move, it looks **outward from the square**: is there an enemy knight a knight's jump away? An enemy pawn diagonally in front? Slide along the rook lines: is the first piece an enemy rook or queen? Along the diagonals: a bishop or queen? That's much faster, and it matters because this runs for every move the computer considers.

Then:

- `inCheck(s)` is "is the side to move's king attacked?"
- `legalMoves(s)` is `pseudoMoves(s)` filtered by `!inCheck(makeMove(s, m), s.turn)`

The board now turns the king's square red when it's in check, and the status says "(check!)". Clicks use `legalMoves()`, so pinned pieces can't move and you must answer a check.

check: js | an isAttacked() function | /function\s+isAttacked\s*\(/
check: js | a legalMoves() function | /function\s+legalMoves\s*\(/
check: js | moves that leave your king attacked are removed | /!inCheck\(\s*makeMove\(\s*s\s*,\s*m\s*\)\s*,\s*s\.turn\s*\)/
check: js | clicks use legal moves only | /legalMoves\(\s*state\s*\)\.filter/

quiz: Why does isAttacked() look outward from the square instead of listing all the enemy's moves?
- [x] It gives the same answer with far less work, and it runs for every move the computer tries
- [ ] Enemy moves can't be listed
- [ ] It only works for kings
why: Checking a handful of directions and jumps is much cheaper than generating 30-40 enemy moves.
quiz: Your bishop is pinned: it stands between your king and an enemy rook. What does legalMoves() do with the bishop's moves?
- [ ] Allows them, because bishops move diagonally
- [x] Removes them, because after each one your king would be attacked by the rook
- [ ] Removes the rook
why: The filter tries each move on a copy; with the bishop gone the rook sees the king, so the move is dropped.

```js rules
// Returns a NEW state with the move made. The old state is never changed:
// the computer will try thousands of moves on copies without disturbing the real game.
function makeMove(s, m) {
  const b = s.board.slice();
  const me = s.turn;
  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece
  b[m.from] = null;
  return {
    ...s,
    board: b,
    turn: me === 'w' ? 'b' : 'w',
    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over
    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,
    fullmove: s.fullmove + (me === 'b' ? 1 : 0),
  };
}

// Is square sq attacked by side `by`? Look outward FROM the square for each kind of attacker.
function isAttacked(s, sq, by) {
  const b = s.board;
  const is = (i, type) => i >= 0 && b[i] && colorOf(b[i]) === by && b[i].toUpperCase() === type;
  const pr = by === 'w' ? 1 : -1;        // a white pawn attacks upward, so it sits one row below the square
  if (is(step(sq, -1, pr), 'P') || is(step(sq, 1, pr), 'P')) return true;
  for (const [df, dr] of KNIGHT) if (is(step(sq, df, dr), 'N')) return true;
  for (const [df, dr] of KING) if (is(step(sq, df, dr), 'K')) return true;
  const slide = (dirs, types) => dirs.some(([df, dr]) => {
    let i = step(sq, df, dr);
    while (i >= 0) {
      if (b[i]) return colorOf(b[i]) === by && types.includes(b[i].toUpperCase());
      i = step(i, df, dr);
    }
    return false;
  });
  return slide(ROOK_DIRS, 'RQ') || slide(BISHOP_DIRS, 'BQ');
}

const kingSquare = (s, color) => s.board.indexOf(color === 'w' ? 'K' : 'k');
const inCheck = (s, color = s.turn) => isAttacked(s, kingSquare(s, color), color === 'w' ? 'b' : 'w');

// A move is legal if, after making it, your own king is not attacked.
function legalMoves(s) {
  return pseudoMoves(s).filter((m) => !inCheck(makeMove(s, m), s.turn));
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  render();
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq) return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  render();
};
```

## Step: Castling, en passant and the end of the game
time: 20

Three special rules finish the game of chess.

**Castling.** The king moves two squares toward a rook and the rook jumps over it. It's allowed only if: neither has moved (tracked in `castling`, like `'KQkq'`), the squares between them are empty, and the king isn't in check, doesn't pass through an attacked square, and doesn't land on one. `pseudoMoves()` adds it as a king move with `castle: 'K'` or `'Q'`; `makeMove()` moves the rook as well.

Castling rights are lost for good: moving the king strips both, and a rook moving from (or being captured on) its corner strips that side. That's the `strip()` loop in `makeMove()`.

**En passant.** Right after a pawn jumps two squares, an enemy pawn beside it may capture it as if it had moved one. `ep` (set in step 5) is the skipped square; a pawn that can capture diagonally onto it gets an `enPassant: true` move. The captured pawn isn't on the target square but beside it, so `makeMove()` removes the pawn one row behind.

**The end.** `gameResult(s)` decides if the game is over:

| Situation | Result |
|---|---|
| no legal moves, in check | checkmate: the other side wins |
| no legal moves, not in check | stalemate: a draw |
| 100 half-moves with no capture or pawn move | draw by the fifty-move rule |
| only kings, or king and one knight or bishop | draw: nobody can checkmate |

### Try it

Play 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7: the status says White wins by checkmate. Then press New game and try castling: develop the knight and bishop, then click the king and the square two to its right.

check: js | castling moves | /castle:\s*['"]K['"]/
check: js | en passant captures | /enPassant:\s*true/
check: js | castling moves the rook too | /if\s*\(\s*m\.castle\s*\)/
check: js | a gameResult() function | /function\s+gameResult\s*\(/

quiz: Why does gameResult() check inCheck() when there are no legal moves?
- [x] To tell checkmate (a win) from stalemate (a draw)
- [ ] To see whose turn it is
- [ ] Because the king can always move
why: No moves while in check is checkmate; no moves while safe is stalemate.
quiz: After en passant, which square does makeMove() empty besides the one the pawn left?
- [ ] The square the pawn moved to
- [x] The square of the captured pawn, one row behind the target square
- [ ] The rook's corner
why: The captured pawn jumped past the target square, so it sits beside the capturing pawn, not on the target.

```js moves
// Every move each piece could make, before checking whether it leaves your own king in check.
function pseudoMoves(s) {
  const moves = [];
  const b = s.board;
  const me = s.turn;
  const them = me === 'w' ? 'b' : 'w';
  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });

  for (let from = 0; from < 64; from++) {
    const p = b[from];
    if (!p || colorOf(p) !== me) continue;
    const type = p.toUpperCase();
    if (type === 'P') {
      const dir = me === 'w' ? -1 : 1;                         // white moves up the board (toward row 0)
      const startRow = me === 'w' ? 6 : 1;
      const lastRow = me === 'w' ? 0 : 7;
      const pushOrPromote = (to, extra = {}) => {
        if (rankOf(to) === lastRow) for (const promo of 'QRBN') add(from, to, { ...extra, promotion: me === 'w' ? promo : promo.toLowerCase() });
        else add(from, to, extra);
      };
      const one = step(from, 0, dir);
      if (one >= 0 && !b[one]) {
        pushOrPromote(one);
        const two = step(from, 0, 2 * dir);
        if (rankOf(from) === startRow && !b[two]) add(from, two, { double: true });
      }
      for (const df of [-1, 1]) {                               // pawns capture diagonally
        const to = step(from, df, dir);
        if (to < 0) continue;
        if (b[to] && colorOf(b[to]) === them) pushOrPromote(to);
        else if (to === s.ep) add(from, to, { enPassant: true, captured: me === 'w' ? 'p' : 'P' });
      }
      continue;
    }
    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction
      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {
        const to = step(from, df, dr);
        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);
      }
      if (type === 'K') {   // castling: king on its home square, rights not lost, squares between empty and not attacked
        const row = me === 'w' ? 7 : 0;
        const home = row * 8 + 4;
        if (from === home && !isAttacked(s, home, them)) {
          const [kSide, qSide] = me === 'w' ? ['K', 'Q'] : ['k', 'q'];
          if (s.castling.includes(kSide) && !b[home + 1] && !b[home + 2]
              && !isAttacked(s, home + 1, them) && !isAttacked(s, home + 2, them)) add(from, home + 2, { castle: 'K' });
          if (s.castling.includes(qSide) && !b[home - 1] && !b[home - 2] && !b[home - 3]
              && !isAttacked(s, home - 1, them) && !isAttacked(s, home - 2, them)) add(from, home - 2, { castle: 'Q' });
        }
      }
    } else {                                                     // sliders: keep going until something is in the way
      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];
      for (const [df, dr] of dirs) {
        let to = step(from, df, dr);
        while (to >= 0) {
          if (!b[to]) add(from, to);
          else { if (colorOf(b[to]) === them) add(from, to); break; }
          to = step(to, df, dr);
        }
      }
    }
  }
  return moves;
}
```

```js rules
// Returns a NEW state with the move made. The old state is never changed:
// the computer will try thousands of moves on copies without disturbing the real game.
function makeMove(s, m) {
  const b = s.board.slice();
  const me = s.turn;
  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece
  b[m.from] = null;
  if (m.enPassant) b[m.to + (me === 'w' ? 8 : -8)] = null;    // the captured pawn is beside, not on, the target
  if (m.castle) {                                             // castling moves the rook too
    const row = me === 'w' ? 56 : 0;
    if (m.castle === 'K') { b[row + 5] = b[row + 7]; b[row + 7] = null; }
    else { b[row + 3] = b[row]; b[row] = null; }
  }
  let castling = s.castling;
  const strip = (chars) => { for (const c of chars) castling = castling.replace(c, ''); };
  if (m.piece === 'K') strip('KQ');
  if (m.piece === 'k') strip('kq');
  for (const sq of [m.from, m.to]) {                          // a rook moving or being captured loses that side
    if (sq === 63) strip('K');
    if (sq === 56) strip('Q');
    if (sq === 7) strip('k');
    if (sq === 0) strip('q');
  }
  return {
    board: b,
    turn: me === 'w' ? 'b' : 'w',
    castling,
    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over
    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,
    fullmove: s.fullmove + (me === 'b' ? 1 : 0),
  };
}

// Is square sq attacked by side `by`? Look outward FROM the square for each kind of attacker.
function isAttacked(s, sq, by) {
  const b = s.board;
  const is = (i, type) => i >= 0 && b[i] && colorOf(b[i]) === by && b[i].toUpperCase() === type;
  const pr = by === 'w' ? 1 : -1;        // a white pawn attacks upward, so it sits one row below the square
  if (is(step(sq, -1, pr), 'P') || is(step(sq, 1, pr), 'P')) return true;
  for (const [df, dr] of KNIGHT) if (is(step(sq, df, dr), 'N')) return true;
  for (const [df, dr] of KING) if (is(step(sq, df, dr), 'K')) return true;
  const slide = (dirs, types) => dirs.some(([df, dr]) => {
    let i = step(sq, df, dr);
    while (i >= 0) {
      if (b[i]) return colorOf(b[i]) === by && types.includes(b[i].toUpperCase());
      i = step(i, df, dr);
    }
    return false;
  });
  return slide(ROOK_DIRS, 'RQ') || slide(BISHOP_DIRS, 'BQ');
}

const kingSquare = (s, color) => s.board.indexOf(color === 'w' ? 'K' : 'k');
const inCheck = (s, color = s.turn) => isAttacked(s, kingSquare(s, color), color === 'w' ? 'b' : 'w');

// A move is legal if, after making it, your own king is not attacked.
function legalMoves(s) {
  return pseudoMoves(s).filter((m) => !inCheck(makeMove(s, m), s.turn));
}

// Checkmate, stalemate, the fifty-move rule and kings that can't be mated.
function gameResult(s) {
  const moves = legalMoves(s);
  if (!moves.length) {
    return inCheck(s)
      ? { over: true, winner: s.turn === 'w' ? 'b' : 'w', reason: 'checkmate' }
      : { over: true, winner: null, reason: 'stalemate' };
  }
  if (s.halfmove >= 100) return { over: true, winner: null, reason: 'fifty-move rule' };
  const pieces = s.board.filter(Boolean).map((p) => p.toUpperCase()).filter((p) => p !== 'K');
  if (pieces.length === 0 || (pieces.length === 1 && 'NB'.includes(pieces[0]))) {
    return { over: true, winner: null, reason: 'insufficient material' };
  }
  return { over: false };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  const result = gameResult(state);
  if (result.over) {
    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;
  } else {
    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
  }
  return result;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  render();
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq) return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  render();
};
```

## Session: A computer opponent

## Step: Scoring a position
time: 15

A chess program needs a way to say "how good is this position?" as a number. This is the **evaluation**, and it's measured in **centipawns**: 100 is one pawn.

The first part is material. The real app uses these values:

| Piece | Value |
|---|---|
| Pawn | 100 |
| Knight | 320 |
| Bishop | 330 |
| Rook | 500 |
| Queen | 900 |

The second part is **piece-square tables** (`PST`): for each kind of piece, 64 bonuses (or penalties) for standing on each square. Knights get +20 in the center and -50 in the corners ("a knight on the rim is dim"), pawns get more as they advance, and the king gets a bonus for hiding behind its pawns. The tables are written from white's side of the board, so black's pieces look up the mirrored square: the same column, row `7 - row`.

`evaluate(s)` adds everything up from **white's point of view**: white's pieces count plus, black's count minus. 0 means equal, +300 means white is roughly a knight ahead.

### Try it

The console shows the start position's score: 0, because the position is perfectly balanced. In the console, try `evaluate(fromFen('4k3/8/8/8/8/8/8/3QK3 w - - 0 1'))`: white has an extra queen, so it's about +900.

check: js | piece values | /const\s+VALUES\s*=/
check: js | piece-square tables | /const\s+PST\s*=/
check: js | an evaluate() function | /function\s+evaluate\s*\(/
check: js | black looks up the mirrored square | /\(\s*7\s*-\s*Math\.floor\(\s*i\s*\/\s*8\s*\)\s*\)\s*\*\s*8/

quiz: evaluate() returns -350. What does that mean?
- [x] Black is ahead by about a knight or bishop
- [ ] White is ahead by 350 pawns
- [ ] The game is over
why: Scores are from white's side in centipawns, so negative is good for black, and 350 is a bit more than a minor piece.
quiz: What do piece-square tables add that material alone can't?
- [ ] They count the pieces
- [x] They reward good squares, like knights in the center, so the computer develops its pieces sensibly
- [ ] They make moves legal
why: With material only, every non-capturing move scores the same and the computer would shuffle pieces at random.

```js ai
// Piece values in centipawns: 100 = one pawn.
const VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
const MATE = 100000;

// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.
// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.
const PST = {
  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,
      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,
      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,
      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,
      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,
      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],
};

// The score in centipawns from white's point of view: positive is good for white.
function evaluate(s) {
  let score = 0;
  s.board.forEach((p, i) => {
    if (!p) return;
    const type = p.toUpperCase();
    const white = colorOf(p) === 'w';
    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black
    score += (white ? 1 : -1) * (VALUES[type] + pst);
  });
  return score;
}
```

```js go
render();
console.log('The start position scores', evaluate(state), '(0 = equal)');
```

## Step: Looking ahead with negamax and alpha-beta
time: 20

To choose a move, the computer imagines each move, then the opponent's best reply, then its own best answer, and so on, `depth` moves deep. This is a recursive `search()`.

**Negamax.** One trick keeps it short: a position that's +200 for me is -200 for my opponent. So `search()` always scores from the side to move's point of view, and a move's score is **minus** the score of the position it leads to. The same function works for both players.

- No legal moves: checkmate scores `-MATE + ply` (being mated sooner is worse), stalemate scores 0.
- `depth` 0: return the evaluation, flipped for black.
- Otherwise: try every move and keep the best.

**Alpha-beta pruning.** Searching every move to depth 3 is about 30 x 30 x 30 = 27,000 positions. Alpha-beta skips lines that can't matter: `alpha` is the best score I'm already sure of, `beta` the best my opponent is sure of. As soon as one reply shows a move is worse than one I already have, the rest of that move's replies don't matter.

```svg Alpha-beta: once one reply proves move B is worse than move A, the rest of B can be skipped
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 200" font-family="sans-serif"><rect x="160" y="8" width="100" height="28" rx="6" fill="#e2e8f0"/><text x="210" y="27" text-anchor="middle" font-size="12">your move</text><line x1="190" y1="36" x2="105" y2="70" stroke="#475569" stroke-width="2"/><line x1="230" y1="36" x2="315" y2="70" stroke="#475569" stroke-width="2"/><rect x="50" y="70" width="110" height="28" rx="6" fill="#bbf7d0"/><text x="105" y="89" text-anchor="middle" font-size="12">move A: worst = +1</text><rect x="260" y="70" width="110" height="28" rx="6" fill="#ffedd5"/><text x="315" y="89" text-anchor="middle" font-size="12">move B: ?</text><line x1="85" y1="98" x2="60" y2="130" stroke="#475569"/><line x1="125" y1="98" x2="150" y2="130" stroke="#475569"/><text x="60" y="146" text-anchor="middle" font-size="12">+1</text><text x="150" y="146" text-anchor="middle" font-size="12">+3</text><line x1="295" y1="98" x2="270" y2="130" stroke="#475569"/><line x1="335" y1="98" x2="360" y2="130" stroke="#94a3b8" stroke-dasharray="4 3"/><text x="270" y="146" text-anchor="middle" font-size="12" fill="#b91c1c">-2</text><text x="360" y="146" text-anchor="middle" font-size="12" fill="#94a3b8">skipped</text><text x="210" y="176" text-anchor="middle" font-size="11" fill="#475569">their reply to B already makes B worse (-2) than A (+1),</text><text x="210" y="192" text-anchor="middle" font-size="11" fill="#475569">so B's other replies don't matter: that branch is "pruned"</text></svg>
```

`rankMoves(s, depth)` scores every legal move and sorts them best first. The coach will use that list too. For now `chooseMove()` plays the top one.

You play white. After your move, `play()` sets `busy`, shows "Computer is thinking…", and calls `computerMove()` with `setTimeout`, so the page can draw the message before the search starts.

### Try it

Play a move. Black answers. Hang a piece (put your queen where a pawn can take it) and watch the computer take it.

check: js | a search() function | /function\s+search\s*\(/
check: js | alpha-beta cut-off | /if\s*\(\s*score\s*>=\s*beta\s*\)\s*return\s+beta/
check: js | moves ranked best first | /function\s+rankMoves\s*\(/
check: js | the computer answers your move | /setTimeout\(\s*computerMove/

quiz: Why is a move's score minus the score of the position after it?
- [ ] Scores are always negative
- [x] The next position is scored for the opponent, and what's good for them is bad for you
- [ ] To make the numbers smaller
why: That's the "nega" in negamax: one function scores positions for whoever is to move.
quiz: What does alpha-beta pruning change about the result?
- [ ] It finds a different, weaker move
- [x] Nothing: it finds the same best move, just without searching lines that can't change the answer
- [ ] It makes the computer play randomly
why: Pruned branches are ones that provably can't beat a move already found.

```js ai
// Piece values in centipawns: 100 = one pawn.
const VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
const MATE = 100000;

// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.
// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.
const PST = {
  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,
      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,
      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,
      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,
      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,
      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],
};

// The score in centipawns from white's point of view: positive is good for white.
function evaluate(s) {
  let score = 0;
  s.board.forEach((p, i) => {
    if (!p) return;
    const type = p.toUpperCase();
    const white = colorOf(p) === 'w';
    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black
    score += (white ? 1 : -1) * (VALUES[type] + pst);
  });
  return score;
}

// Negamax with alpha-beta: the best score the side to move can force, looking `depth` moves ahead.
// "Nega" because my score is minus my opponent's score, so one function works for both sides.
function search(s, depth, alpha = -Infinity, beta = Infinity, ply = 0) {
  const moves = legalMoves(s);
  if (!moves.length) return inCheck(s) ? -MATE + ply : 0;   // checkmated (sooner is worse) or stalemate
  if (depth === 0) return (s.turn === 'w' ? 1 : -1) * evaluate(s);
  for (const m of moves) {
    const score = -search(makeMove(s, m), depth - 1, -beta, -alpha, ply + 1);
    if (score >= beta) return beta;      // the opponent would never allow this line: stop looking
    if (score > alpha) alpha = score;    // the best we've found so far
  }
  return alpha;
}

// Every legal move with its score, best first.
function rankMoves(s, depth) {
  return legalMoves(s)
    .map((move) => ({ move, score: -search(makeMove(s, move), depth - 1, -Infinity, Infinity, 1) }))
    .sort((a, b) => b.score - a.score);
}

function chooseMove(s, depth = 2) {
  return rankMoves(s, depth)[0].move;
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;
let busy = false;              // true while the computer is thinking

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  const result = gameResult(state);
  if (result.over) {
    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;
  } else if (busy) {
    $('status').textContent = 'Computer is thinking…';
  } else {
    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
  }
  return result;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  const result = render();
  if (!result.over && state.turn === 'b') {   // you play white; the computer answers
    busy = true;
    render();
    setTimeout(computerMove, 30);              // let the page show "thinking…" first
  }
}

function computerMove() {
  const move = chooseMove(state, 2);
  busy = false;
  play(move);
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq || busy || state.turn !== 'w') return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  busy = false;
  render();
};
```

```js go
render();
```

## Step: Faster and smarter, with levels
time: 15

Two improvements make the search much stronger, then levels make it fun for everyone.

**Move ordering.** Alpha-beta prunes most when the best move is tried first. A good guess: captures of valuable pieces by cheap ones (a pawn taking a queen) come first. This is called MVV-LVA, "most valuable victim, least valuable attacker". `ordered()` sorts the moves by that score before searching.

**Quiescence search.** If the search stops right after "my queen takes your knight", it thinks it's a knight ahead, without seeing that a pawn takes the queen back. `quiesce()` keeps searching **captures only** at the end until the position is quiet. Its first line, the "stand pat" score, says that you don't have to capture: if the position is already good enough, stop.

**Levels.**

| Level | Looks ahead | Randomness |
|---|---|---|
| Easy | 1 move | picks any move within 150 centipawns of the best |
| Medium | 2 moves | within 40 |
| Hard | 3 moves | always the best |

`chooseMove()` keeps every move whose score is close enough to the best and picks one at random, so easier levels make human-like slips.

### Try it

Choose Hard from the Opponent menu and play. It takes a moment longer and punishes loose pieces. Easy sometimes misses a free capture.

check: js | a quiescence search | /function\s+quiesce\s*\(/
check: js | moves are ordered before searching | /const\s+ordered\s*=/
check: js | three levels | /const\s+LEVELS\s*=/
check: js | the menu picks the level | /chooseMove\(\s*state\s*,\s*\$\(\s*['"]level['"]\s*\)\.value\s*\)/

quiz: Why search captures past the depth limit in quiesce()?
- [ ] To find checkmates
- [x] So the computer doesn't stop in the middle of a trade and misjudge who is ahead
- [ ] Captures are the only legal moves at the end
why: Stopping after "queen takes knight" without seeing "pawn takes queen" is called the horizon effect.
quiz: How does Easy play weaker on purpose?
- [x] It looks one move ahead and picks randomly among moves within 150 centipawns of the best
- [ ] It skips its turn sometimes
- [ ] It plays illegal moves
why: A shallow search plus a little randomness makes believable mistakes instead of silly ones.

```js ai
// Piece values in centipawns: 100 = one pawn.
const VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
const MATE = 100000;

// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.
// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.
const PST = {
  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,
      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,
      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,
      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,
      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,
      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,
      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],
};

// The score in centipawns from white's point of view: positive is good for white.
function evaluate(s) {
  let score = 0;
  s.board.forEach((p, i) => {
    if (!p) return;
    const type = p.toUpperCase();
    const white = colorOf(p) === 'w';
    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black
    score += (white ? 1 : -1) * (VALUES[type] + pst);
  });
  return score;
}

// Captures of valuable pieces by cheap ones first (MVV-LVA). Good moves first = far more pruning.
const orderScore = (m) => (m.captured ? 10 * VALUES[m.captured.toUpperCase()] - VALUES[m.piece.toUpperCase()] : 0) + (m.promotion ? 800 : 0);
const ordered = (moves) => moves.sort((a, b) => orderScore(b) - orderScore(a));

// At the end of the search, keep looking at captures only, so we never stop in the middle of a trade.
function quiesce(s, alpha, beta, depth = 0) {
  const stand = (s.turn === 'w' ? 1 : -1) * evaluate(s);
  if (stand >= beta) return beta;
  if (stand > alpha) alpha = stand;
  if (depth > 6) return alpha;
  for (const m of ordered(legalMoves(s).filter((x) => x.captured || x.promotion))) {
    const score = -quiesce(makeMove(s, m), -beta, -alpha, depth + 1);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

// Negamax with alpha-beta: the best score the side to move can force, looking `depth` moves ahead.
function search(s, depth, alpha = -Infinity, beta = Infinity, ply = 0) {
  const moves = legalMoves(s);
  if (!moves.length) return inCheck(s) ? -MATE + ply : 0;   // checkmated (sooner is worse) or stalemate
  if (depth === 0) return quiesce(s, alpha, beta);
  for (const m of ordered(moves)) {
    const score = -search(makeMove(s, m), depth - 1, -beta, -alpha, ply + 1);
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

// Every legal move with its score, best first.
function rankMoves(s, depth) {
  return ordered(legalMoves(s))
    .map((move) => ({ move, score: -search(makeMove(s, move), depth - 1, -Infinity, Infinity, 1) }))
    .sort((a, b) => b.score - a.score);
}

// Easier levels look less far ahead and sometimes pick a slightly worse move on purpose.
const LEVELS = {
  easy: { depth: 1, randomness: 150 },
  medium: { depth: 2, randomness: 40 },
  hard: { depth: 3, randomness: 0 },
};

function chooseMove(s, level = 'medium', rand = Math.random) {
  const { depth, randomness } = LEVELS[level] ?? LEVELS.medium;
  const ranked = rankMoves(s, depth);
  const choices = ranked.filter((r) => r.score >= ranked[0].score - randomness);
  return choices[Math.floor(rand() * choices.length)].move;
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;
let busy = false;              // true while the computer is thinking

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  const result = gameResult(state);
  if (result.over) {
    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;
  } else if (busy) {
    $('status').textContent = 'Computer is thinking…';
  } else {
    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
  }
  return result;
}

function play(move) {
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  const result = render();
  if (!result.over && state.turn === 'b') {   // you play white; the computer answers
    busy = true;
    render();
    setTimeout(computerMove, 30);              // let the page show "thinking…" first
  }
}

function computerMove() {
  const move = chooseMove(state, $('level').value);
  busy = false;
  play(move);
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq || busy || state.turn !== 'w') return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  busy = false;
  render();
};
```

## Session: The coach

## Step: Grading every move
time: 20

Here's what makes this more than a chess game: after each of your moves, the coach tells you how good it was and why.

The idea is simple once you have `rankMoves()`. Before your move, score every legal move. The best one's score minus your move's score is how much you **lost**:

```svg The grade comes from the centipawns your move lost compared with the best move
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" font-family="sans-serif"><rect x="20" y="40" width="380" height="16" rx="8" fill="#e2e8f0"/><rect x="20.0" y="40" width="15.0" height="16" fill="#16a34a" opacity="0.75"/><text x="20.0" y="34" font-size="10" fill="#1c2430">0</text><text x="22.0" y="74" font-size="10" fill="#16a34a">Best</text><rect x="35.0" y="40" width="65.0" height="16" fill="#16a34a" opacity="0.75"/><text x="35.0" y="34" font-size="10" fill="#1c2430">15</text><text x="37.0" y="88" font-size="10" fill="#16a34a">Excellent</text><rect x="100.0" y="40" width="80.0" height="16" fill="#65a30d" opacity="0.75"/><text x="100.0" y="34" font-size="10" fill="#1c2430">80</text><text x="102.0" y="74" font-size="10" fill="#65a30d">Good</text><rect x="180.0" y="40" width="160.0" height="16" fill="#d97706" opacity="0.75"/><text x="180.0" y="34" font-size="10" fill="#1c2430">160</text><text x="182.0" y="88" font-size="10" fill="#d97706">Inaccuracy</text><rect x="340.0" y="40" width="60.0" height="16" fill="#b91c1c" opacity="0.75"/><text x="340.0" y="34" font-size="10" fill="#1c2430">320</text><text x="342.0" y="74" font-size="10" fill="#b91c1c">Mistake</text><text x="345" y="74" font-size="10" fill="#b91c1c">Blunder: 320+</text><text x="210" y="118" text-anchor="middle" font-size="11" fill="#475569">centipawns lost compared with the best move (100 = one pawn)</text></svg>
```

| Loss | Grade |
|---|---|
| 0 | Best |
| up to 15 | Excellent |
| up to 80 | Good |
| up to 160 | Inaccuracy |
| up to 320 | Mistake |
| more | Blunder |

Mates are special: if you had a forced checkmate and played something else, that's a Blunder whatever the numbers say.

`reviewMove(before, move)` returns `{ grade, loss, name, bestName, messages }`. The messages explain in plain words: a missed checkmate ("Look for checks first!"), a move that walks into one, "Nf3 was stronger here", or "That matches the coach's top choice". `moveName()` writes moves the way chess books do: `Nf3`, `exd5`, `O-O`, `e8=Q`, with `+` for check and `#` for mate.

`play()` now calls `coachReview()` for your moves (not the computer's) and puts a note at the top of the feed, colored by the grade.

### Try it

Play a normal opening move: Best or Good. Then leave your queen where a pawn can take it and see the grade.

check: js | the grade scale | /const\s+GRADES\s*=/
check: js | a reviewMove() function | /function\s+reviewMove\s*\(/
check: js | loss is best minus played | /best\.score\s*-\s*played\.score/
check: js | reviews appear in the feed | /function\s+coachReview\s*\(/

quiz: The best move scores +40 and yours scores -90. What is the grade?
- [ ] Good (loss 50)
- [x] Inaccuracy (loss 130)
- [ ] Blunder (loss 900)
why: 40 - (-90) = 130 centipawns lost, which is between 80 and 160.
quiz: Why does the coach grade against the best move instead of the position's score?
- [x] A bad position isn't your fault this move; what matters is whether you made the most of it
- [ ] Position scores are always 0
- [ ] It's faster
why: Losing 50 in a lost position is still a good move if every other move loses more.

```js coach
const NAMES = { P: 'pawn', N: 'knight', B: 'bishop', R: 'rook', Q: 'queen', K: 'king' };
const nameOf = (p) => NAMES[p.toUpperCase()];
const isMate = (score) => Math.abs(score) > MATE - 100;
const same = (a, b) => a.from === b.from && a.to === b.to && (a.promotion || '') === (b.promotion || '');

// Short move names like Nf3, exd5, O-O, e8=Q and Qxf7#.
function moveName(s, m) {
  let name;
  if (m.castle) name = m.castle === 'K' ? 'O-O' : 'O-O-O';
  else {
    const type = m.piece.toUpperCase();
    const x = m.captured ? 'x' : '';
    name = type === 'P'
      ? (x ? FILES[fileOf(m.from)] : '') + x + sqName(m.to) + (m.promotion ? '=' + m.promotion.toUpperCase() : '')
      : type + x + sqName(m.to);
  }
  const next = makeMove(s, m);
  if (inCheck(next)) name += legalMoves(next).length ? '+' : '#';
  return name;
}

// Grades by how many centipawns your move lost compared with the best move.
const GRADES = [
  { max: 0, label: 'Best', tone: 'great' },
  { max: 15, label: 'Excellent', tone: 'great' },
  { max: 80, label: 'Good', tone: 'good' },
  { max: 160, label: 'Inaccuracy', tone: 'warn' },
  { max: 320, label: 'Mistake', tone: 'bad' },
  { max: Infinity, label: 'Blunder', tone: 'bad' },
];
const gradeFor = (loss) => GRADES.find((g) => loss <= g.max);

// Scores every move from the position before yours, then compares yours with the best.
function reviewMove(before, move) {
  const ranked = rankMoves(before, 2);
  const best = ranked[0];
  const played = ranked.find((r) => same(r.move, move));
  const loss = Math.max(0, best.score - played.score);
  const grade = isMate(best.score) && best.score > 0 && !isMate(played.score) ? gradeFor(Infinity) : gradeFor(loss);
  const bestName = moveName(before, best.move);
  const messages = [];

  if (isMate(best.score) && best.score > 0 && !same(best.move, move)) {
    messages.push({ good: false, text: `You had a forced checkmate starting with ${bestName}. Look for checks first!` });
  }
  if (isMate(played.score) && played.score < 0) {
    messages.push({ good: false, text: 'This move lets your opponent force checkmate. Before moving, ask: "What checks does my opponent have?"' });
  }
  if (!messages.length) {
    if (same(best.move, move)) messages.push({ good: true, text: 'That matches the coach’s top choice.' });
    else if (loss > 80) messages.push({ good: false, text: `${bestName} was stronger here. What does ${bestName} attack or defend?` });
    else messages.push({ good: true, text: `About as strong as the top move (${bestName}).` });
  }
  return { grade, loss, name: moveName(before, move), bestName, messages };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;
let busy = false;              // true while the computer is thinking
let reviews = [];              // the coach's review of each of your moves

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  const result = gameResult(state);
  if (result.over) {
    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;
  } else if (busy) {
    $('status').textContent = 'Computer is thinking…';
  } else {
    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
  }
  return result;
}

function play(move, byYou = true) {
  const before = state;
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  if (byYou) coachReview(before, move);
  const result = render();
  if (!result.over && state.turn === 'b') {   // you play white; the computer answers
    busy = true;
    render();
    setTimeout(computerMove, 30);              // let the page show "thinking…" first
  }
}

function computerMove() {
  const move = chooseMove(state, $('level').value);
  busy = false;
  play(move, false);
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq || busy || state.turn !== 'w') return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

// Shows the coach's grade and explanation at the top of the feed.
function coachReview(before, move) {
  const r = reviewMove(before, move);
  reviews.push(r);
  const note = document.createElement('li');
  note.className = `note ${r.grade.tone}`;
  note.innerHTML = `<strong>${r.name}: ${r.grade.label}</strong>` + r.messages.map((m) => `<p>${m.good ? '✅' : '⚠️'} ${m.text}</p>`).join('');
  $('feed').prepend(note);
}

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  busy = false;
  reviews = [];
  $('feed').innerHTML = '';
  render();
};
```

## Step: Hints, hanging pieces and the game report
time: 15

Three more coaching tools.

**Hanging pieces.** The most common beginner mistake is leaving a piece where it can be taken for free. `hangingPiece(after, side)` asks the search for the opponent's best reply right after your move: if it's a capture of your piece, that piece was hanging. When your move also lost at least 120 centipawns, the coach says exactly what happened: "Your queen on h5 can be taken by the knight on f6. Check that every piece is protected before you move."

**Hints.** The 💡 button calls `hint(state)`. It warns if you're in check, then pretends it's your opponent's turn (a copy with `turn` flipped) to see if they're threatening one of your pieces. Finally it points at the piece the best move uses ("Consider moving your knight from g1"), and outlines that square on the board, without giving the whole move away.

**The game report.** When the game ends, `gameReport()` counts each grade and turns your average loss into an accuracy score: `Math.round(100 * Math.exp(-avgLoss / 250))`. No loss is 100%, an average loss of 250 is about 37%, and it never drops below 0. Each loss is capped at 1,000 first, so one huge blunder can't swamp a whole game.

| Average loss | Accuracy |
|---|---|
| 0 | 100% |
| 25 | 90% |
| 100 | 67% |
| 250 | 37% |

### Try it

Press 💡 Hint at the start. Then play a short game to the end, for example the four-move checkmate from step 7, and read your report.

check: js | a hangingPiece() function | /function\s+hangingPiece\s*\(/
check: js | a hint() function | /function\s+hint\s*\(/
check: js | accuracy from the average loss | /Math\.exp\(\s*-avgLoss\s*\/\s*250\s*\)/
check: js | the Hint button is wired up | /\$\(\s*['"]hint['"]\s*\)\.onclick/

quiz: How does hint() find out what your opponent is threatening?
- [ ] It asks the player
- [x] It searches a copy of the position with the turn flipped, as if the opponent could move now
- [ ] It looks at the last move only
why: Flipping the turn on a copy lets the same search code answer "what would they do if it were their move?"
quiz: Why cap each move's loss at 1,000 before averaging?
- [x] So one huge blunder (like missing mate, worth 100,000) doesn't make every other move irrelevant
- [ ] Because the scale only goes to 1,000
- [ ] To make the game shorter
why: Mate scores are enormous; without a cap a single miss would push accuracy to 0.

```js coach
const NAMES = { P: 'pawn', N: 'knight', B: 'bishop', R: 'rook', Q: 'queen', K: 'king' };
const nameOf = (p) => NAMES[p.toUpperCase()];
const isMate = (score) => Math.abs(score) > MATE - 100;
const same = (a, b) => a.from === b.from && a.to === b.to && (a.promotion || '') === (b.promotion || '');

// Short move names like Nf3, exd5, O-O, e8=Q and Qxf7#.
function moveName(s, m) {
  let name;
  if (m.castle) name = m.castle === 'K' ? 'O-O' : 'O-O-O';
  else {
    const type = m.piece.toUpperCase();
    const x = m.captured ? 'x' : '';
    name = type === 'P'
      ? (x ? FILES[fileOf(m.from)] : '') + x + sqName(m.to) + (m.promotion ? '=' + m.promotion.toUpperCase() : '')
      : type + x + sqName(m.to);
  }
  const next = makeMove(s, m);
  if (inCheck(next)) name += legalMoves(next).length ? '+' : '#';
  return name;
}

// Grades by how many centipawns your move lost compared with the best move.
const GRADES = [
  { max: 0, label: 'Best', tone: 'great' },
  { max: 15, label: 'Excellent', tone: 'great' },
  { max: 80, label: 'Good', tone: 'good' },
  { max: 160, label: 'Inaccuracy', tone: 'warn' },
  { max: 320, label: 'Mistake', tone: 'bad' },
  { max: Infinity, label: 'Blunder', tone: 'bad' },
];
const gradeFor = (loss) => GRADES.find((g) => loss <= g.max);

// After a move, can the side to move now take one of `side`'s pieces? (their best reply, if it's a capture)
function hangingPiece(after, side) {
  const m = rankMoves(after, 1)[0]?.move;
  return m && m.captured && colorOf(m.captured) === side ? m : null;
}

// Scores every move from the position before yours, then compares yours with the best.
function reviewMove(before, move) {
  const ranked = rankMoves(before, 2);
  const best = ranked[0];
  const played = ranked.find((r) => same(r.move, move));
  const loss = Math.max(0, best.score - played.score);
  const grade = isMate(best.score) && best.score > 0 && !isMate(played.score) ? gradeFor(Infinity) : gradeFor(loss);
  const bestName = moveName(before, best.move);
  const messages = [];

  if (isMate(best.score) && best.score > 0 && !same(best.move, move)) {
    messages.push({ good: false, text: `You had a forced checkmate starting with ${bestName}. Look for checks first!` });
  }
  if (isMate(played.score) && played.score < 0) {
    messages.push({ good: false, text: 'This move lets your opponent force checkmate. Before moving, ask: "What checks does my opponent have?"' });
  }
  const threat = hangingPiece(makeMove(before, move), before.turn);
  if (threat && loss >= 120) {
    messages.push({ good: false, text: `Your ${nameOf(threat.captured)} on ${sqName(threat.to)} can be taken by the ${nameOf(threat.piece)} on ${sqName(threat.from)}. Check that every piece is protected before you move.` });
  }
  if (!messages.length) {
    if (same(best.move, move)) messages.push({ good: true, text: 'That matches the coach’s top choice.' });
    else if (loss > 80) messages.push({ good: false, text: `${bestName} was stronger here. What does ${bestName} attack or defend?` });
    else messages.push({ good: true, text: `About as strong as the top move (${bestName}).` });
  }
  return { grade, loss, name: moveName(before, move), bestName, messages };
}

// A hint before you move: warn about threats, then point at the piece the best move uses.
function hint(s) {
  const best = rankMoves(s, 2)[0];
  const notes = [];
  if (inCheck(s)) notes.push('You are in check: move the king, block, or capture the checking piece.');
  const flipped = { ...s, turn: s.turn === 'w' ? 'b' : 'w', ep: -1 };     // pretend it's their turn
  if (!inCheck(flipped)) {
    const threat = hangingPiece(flipped, s.turn);
    if (threat) notes.push(`Watch out: your ${nameOf(threat.captured)} on ${sqName(threat.to)} is under attack.`);
  }
  notes.push(`Consider moving your ${nameOf(best.move.piece)} from ${sqName(best.move.from)}.`);
  return { move: best.move, notes };
}

// Accuracy: 100% when you never lose anything, sliding down as the average loss grows.
function gameReport(reviews) {
  const counts = {};
  for (const r of reviews) counts[r.grade.label] = (counts[r.grade.label] || 0) + 1;
  const avgLoss = reviews.reduce((sum, r) => sum + Math.min(r.loss, 1000), 0) / reviews.length;
  const accuracy = Math.round(100 * Math.exp(-avgLoss / 250));
  return { accuracy, counts };
}
```

```js ui
const $ = (id) => document.getElementById(id);
const GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black
let state = fromFen(START_FEN);
let selected = null;           // the square you clicked first
let lastMove = null;
let busy = false;              // true while the computer is thinking
let reviews = [];              // the coach's review of each of your moves
let hintSquares = [];

// The moves the piece on square i can really make.
const movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);

function render() {
  const board = $('board');
  board.innerHTML = '';
  const targets = selected === null ? [] : movesFrom(selected);
  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;
  for (let i = 0; i < 64; i++) {
    const sq = document.createElement('button');
    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
    sq.className = `sq ${dark ? 'dark' : 'light'}`;
    sq.dataset.i = i;
    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));
    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');
    if (i === selected) sq.classList.add('sel');
    const t = targets.find((m) => m.to === i);
    if (t) sq.classList.add(t.captured ? 'capture' : 'target');
    if (i === checkSq) sq.classList.add('check');
    if (hintSquares.includes(i)) sq.classList.add('hint');
    const p = state.board[i];
    if (p) sq.innerHTML = `<span class="piece ${colorOf(p)}">${GLYPH[p.toUpperCase()]}</span>`;
    board.appendChild(sq);
  }
  const result = gameResult(state);
  if (result.over) {
    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;
  } else if (busy) {
    $('status').textContent = 'Computer is thinking…';
  } else {
    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;
  }
  return result;
}

function play(move, byYou = true) {
  const before = state;
  state = makeMove(state, move);
  lastMove = move;
  selected = null;
  hintSquares = [];
  if (byYou) coachReview(before, move);
  const result = render();
  if (result.over) return showReport();
  if (!result.over && state.turn === 'b') {   // you play white; the computer answers
    busy = true;
    render();
    setTimeout(computerMove, 30);              // let the page show "thinking…" first
  }
}

function computerMove() {
  const move = chooseMove(state, $('level').value);
  busy = false;
  play(move, false);
}

$('board').addEventListener('click', (e) => {
  const sq = e.target.closest('.sq');
  if (!sq || busy || state.turn !== 'w') return;
  const i = Number(sq.dataset.i);
  // second click: a move to this square? (a promoting pawn always becomes a queen here)
  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));
  if (move) return play(move);
  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece
  render();
});

// Shows the coach's grade and explanation at the top of the feed.
function coachReview(before, move) {
  const r = reviewMove(before, move);
  reviews.push(r);
  const note = document.createElement('li');
  note.className = `note ${r.grade.tone}`;
  note.innerHTML = `<strong>${r.name}: ${r.grade.label}</strong>` + r.messages.map((m) => `<p>${m.good ? '✅' : '⚠️'} ${m.text}</p>`).join('');
  $('feed').prepend(note);
}

$('hint').onclick = () => {
  if (busy || state.turn !== 'w' || gameResult(state).over) return;
  const h = hint(state);
  hintSquares = [h.move.from];
  const note = document.createElement('li');
  note.className = 'note tip';
  note.innerHTML = '<strong>💡 Hint</strong>' + h.notes.map((t) => `<p>${t}</p>`).join('');
  $('feed').prepend(note);
  render();
};

function showReport() {
  if (!reviews.length) return;
  const { accuracy, counts } = gameReport(reviews);
  $('report').innerHTML = `<h2>Game report</h2><p>Accuracy: <strong>${accuracy}%</strong></p>`
    + `<p>${Object.entries(counts).map(([k, n]) => `${k}: ${n}`).join(' · ')}</p>`;
  $('report').hidden = false;
}

$('new').onclick = () => {
  state = fromFen(START_FEN);
  selected = null;
  lastMove = null;
  busy = false;
  reviews = [];
  $('feed').innerHTML = '';
  hintSquares = [];
  $('report').hidden = true;
  render();
};
```

## Finish

### What you learned

- Keeping a game as data (a 64-square board plus a few fields) and reading positions from FEN
- Safe board movement with column and row steps, and direction lists for every piece
- Making a move on a copy, and using that to filter pseudo moves into legal ones
- Check, pins, castling, en passant, promotion, checkmate and stalemate
- Evaluating positions with material and piece-square tables
- Negamax search with alpha-beta pruning, move ordering and quiescence
- Grading moves by centipawn loss and explaining them in plain language

### Challenges

1. **Promotion picker:** when a pawn reaches the last row, ask which piece to promote to (hint: show the Q, R, B and N moves).
2. **Take it back:** keep a list of past states and add an Undo button that goes back to your last move.
3. **Play as black:** add a color menu; flip the board by drawing the squares in reverse order and let the computer move first.
4. **Opening advice:** add a message when a knight or bishop leaves its starting square in the first 10 moves.
5. **Perft:** write `perft(s, depth)` and check that the start position gives 20, 400 and 8,902.

Compare your finished coach with the [live version](https://theoyanvno.github.io/chess-coach/) and the [source code](https://github.com/TheoYanvno/chess-coach).
