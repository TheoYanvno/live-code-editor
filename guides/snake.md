---
id: snake
title: Snake
blocks-html: page
blocks-css: base
blocks-js: setup, directions, state, food, rules, draw, loop, controls, go
goals: Draw a grid and shapes on a <canvas>; Keep game data separate from drawing; Run a game loop with setTimeout and stop it cleanly; Handle keyboard and swipe input through one function; Find and fix edge cases like the snake's tail; Save a best score with storage that can fail
prereqs: Basic HTML and CSS (elements, ids, a few properties); JavaScript variables, functions, if and for loops; Arrays and objects (you'll use them a lot)
---

## Session: A snake on the board

## Step: The page: a canvas, a score and a Start button
time: 10

Welcome! In this guide you'll rebuild my [Snake game](https://theoyanvno.github.io/snake-game/) from a blank page. By the end you'll have a snake that moves on its own, turns with the arrow keys or a swipe, eats food, grows, speeds up, and crashes into walls or itself.

Every game in a browser starts with something to draw on. We'll use a `<canvas>`: a rectangle of pixels you paint with JavaScript. Unlike normal HTML, nothing inside a canvas is an element you can click or style. You draw shapes, and the browser just remembers the colors of the pixels.

### What to write

In the **HTML** pane:

1. A header with the title and a score: `Score <strong id="score">0</strong>`. The `id` is how JavaScript will find that number later and change it.
2. A `<canvas id="board" width="400" height="400"></canvas>`. The `width` and `height` attributes set how many pixels the drawing has. (CSS can make it *look* bigger or smaller, but the drawing is still 400 x 400.)
3. A paragraph for messages, `<p id="message">`, and a `<button id="start">Start</button>`.

In the **CSS** pane, give the page a dark background, center everything with CSS Grid (`display: grid; place-items: center`), and give the canvas a background color so you can see it.

> Tip: `touch-action: none` on the canvas stops a phone from scrolling the page when you swipe on the board. We'll use swipes in step 11.

### Why it's built this way

Keeping the HTML small and giving each part an `id` makes the JavaScript simple: `document.getElementById('score')` finds the score in one line. Notice there's no snake in the HTML at all. The snake only exists as data in JavaScript, and the canvas is just where we paint it.

check: html | a <canvas> with id "board", 400 x 400 | /<canvas[^>]*id=["']board["'][^>]*>/ | Add <canvas id="board" width="400" height="400"></canvas>
check: html | the canvas is 400 pixels wide and tall | /<canvas(?=[^>]*width=["']?400)(?=[^>]*height=["']?400)[^>]*>/ | Give the canvas width="400" and height="400"
check: html | a score with id "score" | /id=["']score["']/
check: html | a Start button with id "start" | /<button[^>]*id=["']start["']/
check: html | a message area with id "message" | /id=["']message["']/
check: css | the canvas is styled | /canvas\s*\{[^}]*background/ | Add a canvas { background: ... } rule so you can see the board

```html page
<header class="bar">
  <h1>Snake</h1>
  <p>Score <strong id="score">0</strong></p>
</header>

<main>
  <canvas id="board" width="400" height="400"></canvas>
  <p id="message" class="message">Press Start</p>
  <div class="controls">
    <button id="start">Start</button>
  </div>
</main>
```

```css base
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: #10141c;
  color: #e8ecf2;
}

.bar {
  display: flex;
  gap: 24px;
  align-items: baseline;
}

h1 { margin: 0; }

canvas {
  display: block;
  max-width: 100%;
  height: auto;
  background: #182030;
  border-radius: 12px;
  touch-action: none;   /* swiping on the board shouldn't scroll the page */
}

.message {
  min-height: 1.5em;
  text-align: center;
  color: #9aa6b8;
}

.controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
}

button {
  font: inherit;
  font-weight: 700;
  padding: 8px 18px;
  border: 0;
  border-radius: 8px;
  background: #4ade80;
  color: #0b1a10;
  cursor: pointer;
}
```

quiz: Why does the canvas need `width` and `height` attributes even though CSS can resize it?
- [ ] CSS can't style a canvas
- [x] They set how many pixels the drawing has; CSS only changes how big it looks
- [ ] They make the canvas clickable
why: The attributes set the drawing's resolution. CSS can stretch or shrink it on screen, but you still draw on a 400 x 400 grid of pixels.

quiz: Why is there no snake anywhere in the HTML?
- [x] The snake only exists as data in JavaScript and gets painted onto the canvas
- [ ] HTML can't show green squares
- [ ] It's added later with innerHTML
why: The canvas is just pixels. The snake is an array in JavaScript, and `draw()` paints it.

## Step: Drawing the board
time: 12

Now let's paint on the canvas. In JavaScript you don't draw on the `<canvas>` element directly. You ask it for a **drawing context**, an object full of drawing commands:

```js
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';        // pick a color
ctx.fillRect(10, 10, 50, 30); // fill a rectangle: x, y, width, height
```

Canvas coordinates start at the **top-left corner**: `x` grows to the right and `y` grows *down* (the opposite of math class).

```svg The board in cells: x grows to the right, y grows down
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 165" width="380" height="165" font-family="system-ui, sans-serif" font-size="12"><defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2563eb"/></marker><marker id="b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#dc2626"/></marker></defs><text x="52" y="14" text-anchor="middle" fill="#55607a">0</text><text x="76" y="14" text-anchor="middle" fill="#55607a">1</text><text x="100" y="14" text-anchor="middle" fill="#55607a">2</text><text x="124" y="14" text-anchor="middle" fill="#55607a">3</text><text x="148" y="14" text-anchor="middle" fill="#55607a">4</text><text x="172" y="14" text-anchor="middle" fill="#55607a">5</text><text x="196" y="14" text-anchor="middle" fill="#55607a">6</text><text x="220" y="14" text-anchor="middle" fill="#55607a">7</text><text x="30" y="36" text-anchor="end" fill="#55607a">0</text><text x="30" y="60" text-anchor="end" fill="#55607a">1</text><text x="30" y="84" text-anchor="end" fill="#55607a">2</text><text x="30" y="108" text-anchor="end" fill="#55607a">3</text><text x="30" y="132" text-anchor="end" fill="#55607a">4</text><rect x="40" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="64" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="88" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="136" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="160" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="184" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="208" y="20" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="40" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="64" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="88" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="136" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="160" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="184" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="208" y="44" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="40" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="64" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="88" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="136" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="160" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="184" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="208" y="68" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="40" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="64" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="88" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="136" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="160" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="184" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="208" y="92" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="40" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="64" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="88" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="136" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="160" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="184" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="208" y="116" width="24" height="24" fill="none" stroke="#c9d1de"/><rect x="112" y="68" width="24" height="24" fill="#4ade80" stroke="#1f7a46"/><path d="M40 150 H230" stroke="#2563eb" stroke-width="2" marker-end="url(#a)"/><text x="236" y="154" fill="#2563eb">x grows right</text><path d="M262 20 V130" stroke="#dc2626" stroke-width="2" marker-end="url(#b)"/><text x="270" y="80" fill="#dc2626">y grows down</text><rect x="140" y="72" width="62" height="18" rx="4" fill="#ffffff" stroke="#1f7a46"/><text x="171" y="85" text-anchor="middle" fill="#1f7a46">x: 3, y: 2</text></svg>
```

### Thinking in cells, not pixels

Snake moves in whole squares, so we'll split the 400-pixel board into a 20 x 20 grid. Two constants describe it:

- `SIZE = 20`: how many cells across (and down)
- `CELL = canvas.width / SIZE`: how many pixels one cell is (400 / 20 = 20)

From now on, the game thinks in cells. A cell at column 3, row 5 is drawn at pixel `3 * CELL, 5 * CELL`. If you ever want a bigger board, you change `SIZE` and everything else follows.

### What to write

1. At the top of the JS pane, find the canvas and get its context, then define `SIZE` and `CELL`.
2. Write a `draw()` function that fills the whole board with the background color (`fillRect(0, 0, canvas.width, canvas.height)`), then draws faint grid lines with a `for` loop.
3. Call `draw()` once at the bottom.

Drawing a line on a canvas takes four calls: `beginPath()` to start, `moveTo(x, y)` to put the pen down, `lineTo(x, y)` to draw to a point, and `stroke()` to actually paint it.

> Tip: `rgba(255, 255, 255, 0.05)` is white at 5% opacity, so the grid is barely visible. Try 0.3 to see it clearly, then turn it back down.

check: js | gets the canvas with getElementById('board') | /getElementById\(\s*['"]board['"]\s*\)/
check: js | gets the 2D drawing context | /getContext\(\s*['"]2d['"]\s*\)/
check: js | SIZE and CELL constants | /const\s+SIZE\s*=[\s\S]*const\s+CELL\s*=/ | Add const SIZE = 20; and const CELL = canvas.width / SIZE;
check: js | a draw() function that fills the board | /function\s+draw\s*\([\s\S]*fillRect\(/
check: js | draw() is called | /^\s*draw\(\);?\s*$/m

```js setup
const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const SIZE = 20;                    // the board is 20 cells across and 20 down
const CELL = canvas.width / SIZE;   // so each cell is 400 / 20 = 20 pixels
```

```js draw
function draw() {
  // 1. Clear the board
  ctx.fillStyle = '#182030';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Faint grid lines so you can see the cells
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 1; i < SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, canvas.height);
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(canvas.width, i * CELL);
    ctx.stroke();
  }
}
```

```js go
draw();
```

quiz: On a canvas, which way does `y` grow?
- [ ] Up, like in math class
- [x] Down, from the top-left corner
- [ ] It depends on the canvas size
why: Canvas coordinates start at the top-left corner. `x` grows to the right and `y` grows down.

quiz: With `SIZE = 20` on a 400-pixel board, where is the cell at column 3, row 5 drawn?
- [ ] At pixel 3, 5
- [x] At pixel 60, 100
- [ ] At pixel 15, 25
why: Each cell is `CELL = 400 / 20 = 20` pixels, so column 3 is `3 * 20 = 60` and row 5 is `5 * 20 = 100`.

## Step: The snake is just a list of cells
time: 10

Here's the most important idea in this whole guide: **the snake is data, not a drawing.** It's an array of cells, head first:

```js
let snake = [
  { x: 10, y: 10 },   // head
  { x: 9, y: 10 },
  { x: 8, y: 10 },    // tail
];
```

Each cell is an object with an `x` (column) and `y` (row) in *cells*, not pixels. The drawing code reads this list and paints a square for each cell. The game rules, which we'll write next, only ever change the list.

```svg The snake array, head first, and the cells it fills on the board
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 150" width="360" height="150" font-family="system-ui, sans-serif" font-size="12"><rect x="10" y="20" width="105" height="30" rx="6" fill="#eef2f8" stroke="#94a3b8"/><text x="62" y="40" text-anchor="middle" font-family="monospace" font-size="11">{ x: 10, y: 10 }</text><text x="62" y="14" text-anchor="middle" fill="#55607a">head</text><rect x="125" y="20" width="105" height="30" rx="6" fill="#eef2f8" stroke="#94a3b8"/><text x="177" y="40" text-anchor="middle" font-family="monospace" font-size="11">{ x: 9, y: 10 }</text><text x="177" y="14" text-anchor="middle" fill="#55607a">index 1</text><rect x="240" y="20" width="105" height="30" rx="6" fill="#eef2f8" stroke="#94a3b8"/><text x="292" y="40" text-anchor="middle" font-family="monospace" font-size="11">{ x: 8, y: 10 }</text><text x="292" y="14" text-anchor="middle" fill="#55607a">tail</text><rect x="240" y="100" width="32" height="32" rx="6" fill="#22c55e"/><path d="M62 52 L256 98" stroke="#94a3b8" stroke-dasharray="3 3"/><rect x="206" y="100" width="32" height="32" rx="6" fill="#86efac"/><path d="M177 52 L222 98" stroke="#94a3b8" stroke-dasharray="3 3"/><rect x="172" y="100" width="32" height="32" rx="6" fill="#86efac"/><path d="M292 52 L188 98" stroke="#94a3b8" stroke-dasharray="3 3"/><text x="282" y="114" fill="#55607a">on the</text><text x="282" y="128" fill="#55607a">board</text></svg>
```

Why separate them? Because the rules get easy to think about: "move" means "add a cell at the front, remove one from the back," with no pixels involved. And you could swap the drawing for something else entirely (emoji, a 3D view) without touching the rules. My real Snake project keeps the rules in their own file so they can be tested without a browser.

### What to write

1. In a new block above `draw()`, create the `snake` array with three cells in the middle of the board.
2. In `draw()`, after the grid, loop over the snake with `snake.forEach((cell, i) => { ... })` and draw a rounded square for each cell at `cell.x * CELL, cell.y * CELL`. Make the head (`i === 0`) a slightly brighter green.

`ctx.roundRect(x, y, width, height, radius)` draws a rounded rectangle; follow it with `ctx.fill()`. Leaving a 1-pixel gap on each side (`+ 1` and `CELL - 2`) makes the segments look separate.

check: js | a snake array of { x, y } cells | /let\s+snake\s*=\s*\[\s*\{\s*x:/
check: js | draw() loops over the snake | /snake\.forEach\(/
check: js | each cell is drawn at cell.x * CELL | /cell\.x\s*\*\s*CELL/

```js state
// The snake is a list of cells, head first. Each cell is { x, y } in grid units, not pixels.
let snake = [
  { x: 10, y: 10 },   // head
  { x: 9, y: 10 },
  { x: 8, y: 10 },    // tail
];
```

```js draw
function draw() {
  // 1. Clear the board
  ctx.fillStyle = '#182030';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Faint grid lines so you can see the cells
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 1; i < SIZE; i++) {
    ctx.beginPath();
    ctx.moveTo(i * CELL, 0);
    ctx.lineTo(i * CELL, canvas.height);
    ctx.moveTo(0, i * CELL);
    ctx.lineTo(canvas.width, i * CELL);
    ctx.stroke();
  }

  // 3. The snake: one rounded square per cell, the head a little brighter
  snake.forEach((cell, i) => {
    ctx.fillStyle = i === 0 ? '#86efac' : '#4ade80';
    ctx.beginPath();
    ctx.roundRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2, 5);
    ctx.fill();
  });
}
```

quiz: What does each object in the `snake` array describe?
- [ ] The pixels of one square
- [x] One cell of the snake, as a column and row
- [ ] A color for each segment
why: Each item is `{ x, y }` in grid cells, head first. The drawing turns cells into pixels; the rules never think about pixels.

quiz: Why keep the snake as data instead of drawing it straight onto the canvas?
- [ ] Data uses less memory
- [x] The rules only change the list, and the drawing can be swapped without touching them
- [ ] Canvas can't draw squares in a loop
why: Separating data from drawing makes the rules simple to write and, later, to test.

## Step: Moving one cell at a time
time: 15

How does a snake move? Look closely at the game: the head goes forward one cell and every other segment moves into the spot of the segment in front of it. That sounds complicated, but there's a trick: **add a new head in front and remove the last cell.** Every cell in between stays exactly where it is, and it looks like the whole snake slid forward.

```svg Moving: add a new head in front, remove the tail. The middle stays put.
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 140" width="420" height="140" font-family="system-ui, sans-serif" font-size="12"><text x="10" y="30" fill="#334155" font-weight="600">Before</text><rect x="90" y="10" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="124" y="10" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="158" y="10" width="30" height="30" rx="6" fill="#22c55e" stroke="#64748b"/><text x="266" y="30" fill="#55607a"></text><text x="10" y="75" fill="#334155" font-weight="600">unshift + pop</text><rect x="90" y="55" width="30" height="30" rx="6" fill="none" stroke="#64748b" stroke-dasharray="4 3"/><rect x="124" y="55" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="158" y="55" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="192" y="55" width="30" height="30" rx="6" fill="#facc15" stroke="#64748b"/><text x="266" y="75" fill="#55607a">new head in, tail out</text><text x="10" y="120" fill="#334155" font-weight="600">After</text><rect x="124" y="100" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="158" y="100" width="30" height="30" rx="6" fill="#86efac" stroke="#64748b"/><rect x="192" y="100" width="30" height="30" rx="6" fill="#22c55e" stroke="#64748b"/><text x="266" y="120" fill="#55607a">the middle never moved</text></svg>
```

```js
snake.unshift(newHead); // add to the front of the array
snake.pop();            // remove from the end
```

### Directions as data

Instead of four `if` statements for up, down, left and right, we store how each direction changes `x` and `y`:

| direction | x change | y change |
|---|---|---|
| up | 0 | -1 |
| right | +1 | 0 |

So "the cell in front of the head" is always `{ x: head.x + d.x, y: head.y + d.y }`, whichever direction `d` is. Remember that `y` grows downward, which is why up is `-1`.

### What to write

1. A `DIRECTIONS` object with `up`, `down`, `left` and `right`, each `{ x, y }`.
2. A `direction` variable that starts as `'right'`.
3. A `step()` function that works out the new head from the current head and direction, then `unshift`s it and `pop`s the tail.
4. For now, make the Start button move the snake one cell per click: `document.getElementById('start').onclick = () => { step(); draw(); };`

Click Start a few times and watch the snake slide right. (It will happily leave the board; we'll fix that later.)

check: js | a DIRECTIONS object | /const\s+DIRECTIONS\s*=\s*\{[\s\S]*up:\s*\{\s*x:\s*0,\s*y:\s*-1\s*\}/ | up should be { x: 0, y: -1 } because y grows downward
check: js | a direction variable starting at 'right' | /let\s+direction\s*=\s*['"]right['"]/
check: js | step() adds a new head with unshift | /function\s+step\s*\([\s\S]*unshift\(/
check: js | step() removes the tail with pop | /function\s+step\s*\([\s\S]*\.pop\(\)/
check: js | the Start button calls step() | /getElementById\(\s*['"]start['"]\s*\)[\s\S]*step\(\)/

```js directions
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
```

```js state
// The snake is a list of cells, head first. Each cell is { x, y } in grid units, not pixels.
let snake = [
  { x: 10, y: 10 },   // head
  { x: 9, y: 10 },
  { x: 8, y: 10 },    // tail
];
let direction = 'right';
```

```js rules
// Move the snake one cell: add a new head in front, take the last cell off the tail.
function step() {
  const d = DIRECTIONS[direction];
  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
  snake.unshift(head);   // add to the front
  snake.pop();           // remove from the back
}
```

```js go
draw();
document.getElementById('start').onclick = () => { step(); draw(); };   // for now, each click moves one cell
```

quiz: How does the snake move one cell forward?
- [ ] Every segment's x and y is updated in a loop
- [x] A new head is added in front with `unshift` and the tail is removed with `pop`
- [ ] The whole array is rebuilt from scratch
why: The middle segments stay where they are. Adding a head and removing the tail looks exactly like the whole snake sliding forward.

quiz: Why is `up` stored as `{ x: 0, y: -1 }`?
- [ ] It's a typo; up should be +1
- [x] `y` grows downward, so moving up makes `y` smaller
- [ ] Negative numbers move faster
why: On a canvas `y` grows down, so going up subtracts 1 from `y`.
