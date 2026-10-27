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

## Session: Make it a game

## Step: The game loop
time: 15

Real games don't wait for clicks: they run a **game loop**. Ours is simple: move, draw, then wait a moment and do it again.

```svg The game loop: move, draw, schedule the next tick, wait, repeat
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 145" width="420" height="145" font-family="system-ui, sans-serif" font-size="12"><defs><marker id="m" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#334155"/></marker></defs><path d="M130 37 H175" stroke="#334155" stroke-width="2" marker-end="url(#m)"/><path d="M240 55 V95" stroke="#334155" stroke-width="2" marker-end="url(#m)"/><path d="M175 112 H130" stroke="#334155" stroke-width="2" marker-end="url(#m)"/><path d="M75 95 V55" stroke="#334155" stroke-width="2" marker-end="url(#m)"/><rect x="20" y="20" width="110" height="34" rx="17" fill="#eef2f8" stroke="#64748b"/><text x="75" y="42" text-anchor="middle">step()</text><rect x="185" y="20" width="110" height="34" rx="17" fill="#eef2f8" stroke="#64748b"/><text x="240" y="42" text-anchor="middle">draw()</text><rect x="185" y="95" width="110" height="34" rx="17" fill="#eef2f8" stroke="#64748b"/><text x="240" y="117" text-anchor="middle">setTimeout(tick)</text><rect x="20" y="95" width="110" height="34" rx="17" fill="#eef2f8" stroke="#64748b"/><text x="75" y="117" text-anchor="middle">wait 150 ms</text><text x="300" y="80" fill="#55607a">clearTimeout(timer)</text><text x="300" y="96" fill="#55607a">stops the loop</text></svg>
```

```js
function tick() {
  step();
  draw();
  timer = setTimeout(tick, 150);   // run tick again in 150 milliseconds
}
```

`setTimeout(fn, ms)` runs a function once after a delay. Because `tick` schedules itself again, it keeps going forever. Saving the id it returns in `timer` lets us stop it with `clearTimeout(timer)`.

> Tip: why not `setInterval`? Later the snake speeds up as you score. With `setTimeout` each tick can choose a new delay, which `setInterval` can't do.

### Starting a new game

Each game should start from the same place, so move the starting values into a `newGame()` function. Declaring `let snake, direction, timer;` at the top (without values) and filling them in `newGame()` means pressing Start always resets everything.

`start()` stops any loop that's already running (otherwise pressing Start twice would run two loops and the snake would move twice as fast), sets up a new game, and starts ticking.

### What to write

1. Replace the snake array with `let snake, direction, timer;` and a `newGame()` function that sets the snake (in the middle: `Math.floor(SIZE / 2)`) and the direction.
2. A `tick()` function: step, draw, schedule the next tick.
3. A `start()` function: `clearTimeout(timer)`, `newGame()`, `draw()`, `tick()`.
4. At the bottom, call `newGame()` and `draw()` so the board isn't empty, and make the Start button call `start`.

check: js | a newGame() function | /function\s+newGame\s*\(/
check: js | a tick() function that schedules itself with setTimeout | /function\s+tick\s*\([\s\S]*setTimeout\(\s*tick/
check: js | start() clears the old timer first | /function\s+start\s*\([\s\S]*clearTimeout\(\s*timer\s*\)/
check: js | the Start button runs start | /getElementById\(\s*['"]start['"]\s*\)\.(onclick\s*=\s*start|addEventListener\(\s*['"]click['"]\s*,\s*start)/

```js state
let snake, direction, timer;

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
}
```

```js loop
// The game loop: move, draw, and wait a moment before the next move.
function tick() {
  step();
  draw();
  timer = setTimeout(tick, 150);
}

function start() {
  clearTimeout(timer);    // never run two loops at once
  newGame();
  draw();
  tick();
}
```

```js go
newGame();
draw();
document.getElementById('start').onclick = start;
```

quiz: Why does `start()` call `clearTimeout(timer)` first?
- [ ] To reset the score
- [x] So pressing Start twice doesn't run two loops and make the snake move twice as fast
- [ ] Because `setTimeout` only works once per page
why: Each loop schedules itself again. Stopping the old one before starting a new one keeps exactly one loop running.

quiz: Why use `setTimeout` instead of `setInterval` for the game loop?
- [ ] `setInterval` doesn't work in a canvas
- [x] Each tick can choose a new delay, which the speed-up feature needs
- [ ] `setTimeout` is faster
why: With `setTimeout`, every tick decides when the next one runs, so the delay can shrink as the score goes up.

## Step: Steering with the keyboard
time: 20

Time to take control. When a key is pressed, the browser fires a `keydown` event, and `event.key` tells you which key: `'ArrowUp'`, `'a'`, `' '` (space) and so on. A lookup object turns keys into directions:

```js
const KEYS = { ArrowUp: 'up', w: 'up', /* ... */ };
```

### Two rules that make it feel right

```svg Turns go into a queue, and a turn straight back is ignored
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 130" width="380" height="130" font-family="system-ui, sans-serif" font-size="12"><text x="10" y="20" fill="#334155" font-weight="600">Keys pressed between two moves:</text><rect x="10" y="30" width="60" height="28" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="40" y="49" text-anchor="middle">↑ up</text><rect x="76" y="30" width="60" height="28" rx="6" fill="#dbeafe" stroke="#2563eb"/><text x="106" y="49" text-anchor="middle">← left</text><text x="150" y="49" fill="#55607a">queue = [up, left]</text><text x="10" y="90" fill="#334155">move 1 uses <tspan font-weight="700">up</tspan>, move 2 uses <tspan font-weight="700">left</tspan>: no press is lost</text><text x="10" y="118" fill="#dc2626">going right? pressing ← (the opposite) is ignored</text></svg>
```

1. **No reversing.** If you're going right and press left, the head would move into your own neck. So a turn to the *opposite* direction is ignored. An `OPPOSITE` object (`up` ↔ `down`, `left` ↔ `right`) makes this a one-line check.
2. **A small queue of turns.** The snake only moves every 150 ms. If you press up and then left quickly, both presses happen before the next move. If we just set `direction` each time, the up would be lost. Instead we push turns into a `queue` (at most 2), and each `step()` takes the next one off the front with `queue.shift()`.

The "no reversing" check compares against the *last queued* direction, not the current one: `queue.at(-1) ?? direction`. (`at(-1)` is the last item in an array; `??` means "if that's missing, use this instead".)

### What to write

1. Add `OPPOSITE` under `DIRECTIONS`, and a `queue` variable that `newGame()` empties.
2. At the start of `step()`, `if (queue.length) direction = queue.shift();`
3. A `KEYS` object for the arrow keys and W/A/S/D, a `turn(name)` function with the two rules above, and a `keydown` listener that calls it.
4. Call `e.preventDefault()` for game keys so the arrows don't scroll the page.

> Tip: keys go to whatever has focus. **Click on the result once** so the game gets your key presses instead of the editor.

check: js | an OPPOSITE lookup | /const\s+OPPOSITE\s*=/
check: js | a queue of turns | /queue\s*=\s*\[\]/
check: js | step() takes the next queued turn | /function\s+step\s*\([\s\S]*queue\.shift\(\)/
check: js | a turn() function that refuses reversing | /function\s+turn\s*\([\s\S]*OPPOSITE\[/
check: js | a keydown listener | /addEventListener\(\s*['"]keydown['"]/
check: js | arrow keys don't scroll the page | /preventDefault\(\)/

```js directions
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };
```

```js state
let snake, direction, queue, timer;

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
  queue = [];             // turns pressed since the last move
}
```

```js rules
// Move the snake one cell: add a new head in front, take the last cell off the tail.
function step() {
  if (queue.length) direction = queue.shift();
  const d = DIRECTIONS[direction];
  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
  snake.unshift(head);   // add to the front
  snake.pop();           // remove from the back
}
```

```js controls
// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.
const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
};

function turn(name) {
  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued
  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself
  queue.push(name);
}

document.addEventListener('keydown', (e) => {
  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
  if (!name) return;
  e.preventDefault();     // stop the arrow keys from scrolling the page
  turn(name);
});
```

quiz: You're moving right and press left. What happens?
- [ ] The snake turns around
- [x] Nothing: a turn to the opposite direction is ignored
- [ ] The game ends
why: Turning straight back would move the head into its own neck, so the opposite direction is ignored.

quiz: Why do turns go into a queue instead of changing `direction` right away?
- [ ] Queues are faster than variables
- [x] Two quick presses between moves both count instead of the first one being lost
- [ ] So the snake can turn twice in one move
why: The snake only moves every 150 ms. A queue keeps both presses, and each move uses one of them.

## Step: Food, growing and the score
time: 20

A snake needs something to chase. Food goes on a **random empty cell**, and that's harder than it sounds: if you just pick a random `x` and `y`, it might land on the snake. The reliable way is to list every free cell and pick one of those.

To check "is this cell part of the snake?" quickly, we put the snake's cells in a `Set` of strings like `"10,10"`. Looking something up in a Set is instant, while searching an array means checking every item.

```js
const taken = new Set(snake.map((c) => `${c.x},${c.y}`));
taken.has('10,10');   // true or false
```

### Growing is just *not* removing the tail

Remember that moving is "add a head, remove the tail"? When the snake eats, we add the head but **skip** removing the tail. The snake ends up one cell longer. That's the whole growing feature.

### What to write

1. Add `food` and `score` to the game state. `newGame()` sets `score = 0`, places the first food, and shows the score.
2. A `placeFood()` function: build the `taken` Set, loop over every cell with two nested `for` loops, collect the free ones, and return a random one with `free[Math.floor(Math.random() * free.length)]`.
3. A `showScore()` function that writes the score into `#score`.
4. In `step()`, check whether the new head is on the food. If so, add 1 to the score and place new food; if not, `pop()` the tail as before.
5. In `draw()`, draw the food as a red circle: `ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)`, then `fill()`.

> Tip: `Math.random()` gives a number from 0 up to (but not including) 1. Multiplying by the length and rounding down with `Math.floor` gives a valid index every time.

check: js | a placeFood() function | /function\s+placeFood\s*\(/
check: js | it skips cells the snake is on (using a Set) | /new\s+Set\(/
check: js | it picks a random free cell | /Math\.floor\(\s*Math\.random\(\)\s*\*\s*\w+\.length\s*\)/
check: js | step() grows the snake when it eats | /function\s+step\s*\([\s\S]*food[\s\S]*score\s*(\+=\s*1|\+\+)/
check: js | the food is drawn as a circle | /ctx\.arc\(/

```js state
let snake, direction, queue, food, score, timer;

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
  queue = [];             // turns pressed since the last move
  score = 0;
  food = placeFood();
  showScore();
}
```

```js food
// Food goes on a random empty cell. List every free cell, then pick one.
function placeFood() {
  const taken = new Set(snake.map((c) => `${c.x},${c.y}`));
  const free = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? null;   // null when the board is full
}

function showScore() {
  document.getElementById('score').textContent = score;
}
```

```js rules
// Move the snake one cell. Eating food makes it one cell longer.
function step() {
  if (queue.length) direction = queue.shift();
  const d = DIRECTIONS[direction];
  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
  const eating = food && head.x === food.x && head.y === food.y;

  snake.unshift(head);
  if (eating) {
    score += 1;           // grow: keep the tail this time
    showScore();
    food = placeFood();
  } else {
    snake.pop();
  }
}
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

  // 3. The food: a red circle in the middle of its cell
  if (food) {
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. The snake: one rounded square per cell, the head a little brighter
  snake.forEach((cell, i) => {
    ctx.fillStyle = i === 0 ? '#86efac' : '#4ade80';
    ctx.beginPath();
    ctx.roundRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2, 5);
    ctx.fill();
  });
}
```

quiz: How does the snake grow by one cell when it eats?
- [ ] It adds two heads
- [x] It adds a head but skips removing the tail
- [ ] It copies the last segment
why: Moving is add-a-head, remove-the-tail. Growing is the same move without removing the tail.

quiz: Why does `placeFood()` build a list of free cells instead of picking random x and y?
- [ ] Random numbers are slow
- [x] A random cell might land on the snake; picking from free cells always gives an empty one
- [ ] So food always appears near the head
why: Listing the empty cells and picking one of them can never put food on the snake, and it also tells you when the board is full.

## Step: Crashing (and winning)
time: 20

A game needs a way to lose. The snake crashes when its new head would be:

- **outside the board**: `x` or `y` is below 0, or `SIZE` or more
- **on its own body**: any cell of the snake has the same `x` and `y`

### The tricky part: the tail

Imagine the snake chasing its own tail in a tight square. On this move the head steps into the cell where the tail *is right now*, but the tail is about to move out of the way. That shouldn't count as a crash. So we check against the body **without its last cell**, `snake.slice(0, -1)`, unless the snake is eating (then the tail stays put, so it does count).

This is exactly the kind of edge case that's easy to get wrong and hard to notice by playing, which is why my real project has a test for it.

### Telling the loop what happened

`step()` now **returns** what happened: `'move'`, `'eat'`, `'crash'` or `'win'` (the snake filled the whole board, so there's nowhere left for food). `tick()` reads that and either keeps going or stops. Having one function decide and another react keeps both simple.

### What to write

1. An `over` flag in the game state.
2. In `step()`, before moving, work out `hitWall` and `hitSelf`. If either is true, set `over = true` and `return 'crash'`.
3. Return `'move'`, `'eat'`, or `'win'` when `placeFood()` returns `null`.
4. In `tick()`, stop when the result is `'crash'` or `'win'` and show a message with a small `message(text)` function. Clear the message in `start()`.

check: js | an over flag | /\bover\s*=\s*(false|true)/
check: js | crashing into the walls | /head\.x\s*<\s*0[\s\S]*SIZE/ | Check head.x < 0, head.y < 0, head.x >= SIZE and head.y >= SIZE
check: js | crashing into yourself (ignoring the tail) | /slice\(\s*0\s*,\s*-1\s*\)/ | Compare against snake.slice(0, -1), the body without the tail
check: js | step() returns 'crash' | /return\s+['"]crash['"]/
check: js | tick() stops on a crash | /function\s+tick\s*\([\s\S]*crash/
check: js | a message() function | /function\s+message\s*\(/

```js state
let snake, direction, queue, food, score, over, timer;

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
  queue = [];             // turns pressed since the last move
  score = 0;
  over = false;
  food = placeFood();
  showScore();
}
```

```js rules
// Move the snake one cell. Returns what happened: 'move', 'eat', 'crash' or 'win'.
function step() {
  if (queue.length) direction = queue.shift();
  const d = DIRECTIONS[direction];
  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
  const eating = food && head.x === food.x && head.y === food.y;

  // The tail moves out of the way this turn (unless we're growing), so it doesn't count as a hit
  const body = eating ? snake : snake.slice(0, -1);
  const hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;
  const hitSelf = body.some((c) => c.x === head.x && c.y === head.y);
  if (hitWall || hitSelf) {
    over = true;
    return 'crash';
  }

  snake.unshift(head);
  if (!eating) {
    snake.pop();
    return 'move';
  }
  score += 1;             // grow: we kept the tail this time
  showScore();
  food = placeFood();
  if (!food) {            // no empty cell left: you filled the board
    over = true;
    return 'win';
  }
  return 'eat';
}
```

```js loop
// The game loop: move, draw, and wait a moment before the next move.
function tick() {
  const result = step();
  draw();
  if (result === 'crash') return message(`Game over! You scored ${score}. Press Start to play again.`);
  if (result === 'win') return message('You filled the whole board. Amazing!');
  timer = setTimeout(tick, 150);
}

function start() {
  clearTimeout(timer);    // never run two loops at once
  newGame();
  message('');
  draw();
  tick();
}

function message(text) {
  document.getElementById('message').textContent = text;
}
```

quiz: The head moves into the cell the tail is in right now. Is that a crash?
- [ ] Yes, always
- [x] No, because the tail moves out of the way on the same move (unless the snake is eating)
- [ ] Only in no-walls mode
why: The tail leaves that cell this move, so the body is checked without its last cell. When eating, the tail stays, so it does count.

quiz: Why does `step()` return `'move'`, `'eat'`, `'crash'` or `'win'`?
- [ ] To print it in the console
- [x] So `step()` decides what happened and `tick()` just reacts to it
- [ ] Because functions must return something
why: One function decides and another reacts, which keeps both simple and easy to test.

## Session: Polish, speed and phones

## Step: Best score, and the space bar
time: 15

Players love beating their own record, so let's remember the best score. The browser's `localStorage` keeps small bits of text for a website, even after the page is closed:

```js
localStorage.setItem('snake-best', 12);
localStorage.getItem('snake-best');   // "12" (always a string)
```

### Storage can fail, so plan for it

`localStorage` throws an error in some situations: private browsing on some browsers, a full disk, or a page that isn't allowed to use storage. **This editor's result frame is one of those**: it's sandboxed for safety, so `localStorage` throws here. If we didn't handle that, the whole game would break.

Wrapping storage in `try { ... } catch {}` means: try it, and if it fails, carry on without it. Here the best score simply won't survive a refresh, but the game still works. In my real Snake game it saves normally.

### Space to play again

Making players reach for the mouse after every game is annoying. If the space bar is pressed when no game is running (`over` is true, or the game hasn't started), start one.

### What to write

1. Add `Best <strong id="best">0</strong>` next to the score in the HTML.
2. A `best` variable that reads `localStorage` inside `try/catch` (use `Number(...) || 0` to turn the text into a number, and get 0 if it's missing).
3. A `gameOver()` function: if `score > best`, update `best`, save it (inside `try/catch`), update the display, and show the message. Call it from `tick()` on a crash.
4. `showScore()` also writes `best` into `#best`.
5. In the `keydown` listener, start a game on space when `over || !timer`.

check: html | a best score with id "best" | /id=["']best["']/
check: js | reads the best score from localStorage | /localStorage\.getItem\(/
check: js | storage is wrapped in try/catch | /try\s*\{[^}]*localStorage[^}]*\}\s*catch/
check: js | a gameOver() function that saves a new best | /function\s+gameOver\s*\([\s\S]*localStorage\.setItem\(/
check: js | the space bar starts a game | /e\.key\s*===\s*['"] ['"]/

```html page
<header class="bar">
  <h1>Snake</h1>
  <p>Score <strong id="score">0</strong> · Best <strong id="best">0</strong></p>
</header>

<main>
  <canvas id="board" width="400" height="400"></canvas>
  <p id="message" class="message">Press Start or the space bar</p>
  <div class="controls">
    <button id="start">Start</button>
  </div>
</main>
```

```js state
let snake, direction, queue, food, score, over, timer;

// The best score is kept in the browser. Storage can be blocked (private windows, and this editor's
// sandboxed preview), so every use is wrapped in try/catch and the game works either way.
let best = 0;
try { best = Number(localStorage.getItem('snake-best')) || 0; } catch {}

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
  queue = [];             // turns pressed since the last move
  score = 0;
  over = false;
  food = placeFood();
  showScore();
}
```

```js food
// Food goes on a random empty cell. List every free cell, then pick one.
function placeFood() {
  const taken = new Set(snake.map((c) => `${c.x},${c.y}`));
  const free = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? null;   // null when the board is full
}

function showScore() {
  document.getElementById('score').textContent = score;
  document.getElementById('best').textContent = best;
}
```

```js loop
// The game loop: move, draw, and wait a moment before the next move.
function tick() {
  const result = step();
  draw();
  if (result === 'crash') return gameOver();
  if (result === 'win') return message('You filled the whole board. Amazing!');
  timer = setTimeout(tick, 150);
}

function start() {
  clearTimeout(timer);    // never run two loops at once
  newGame();
  message('');
  draw();
  tick();
}

function gameOver() {
  if (score > best) {
    best = score;
    try { localStorage.setItem('snake-best', best); } catch {}
  }
  showScore();
  message(`Game over! You scored ${score}. Press Start or space to play again.`);
}

function message(text) {
  document.getElementById('message').textContent = text;
}
```

```js controls
// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.
const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
};

function turn(name) {
  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued
  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself
  queue.push(name);
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && (over || !timer)) {   // space starts a game when none is running
    e.preventDefault();
    return start();
  }
  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
  if (!name) return;
  e.preventDefault();     // stop the arrow keys from scrolling the page
  turn(name);
});
```

quiz: Why is every use of `localStorage` wrapped in `try/catch`?
- [ ] It makes saving faster
- [x] Storage can throw (private windows, sandboxed pages like this editor), and the game should keep working
- [ ] `localStorage` only works inside try blocks
why: If storage fails, the catch lets the game carry on; the best score just won't be saved.

quiz: What does `Number(localStorage.getItem('snake-best')) || 0` give when nothing is saved yet?
- [ ] `null`
- [ ] `NaN`
- [x] `0`
why: `getItem` returns `null`, `Number(null)` is `0`, and `|| 0` also covers anything that isn't a number.

## Step: Speed levels that get faster as you score
time: 12

A constant 150 ms gets boring once you're good. Two improvements:

1. **Levels.** A Speed menu with Slow, Normal and Fast, each a different delay between moves.
2. **Speeding up.** Every 5 points, the delay drops by 5 ms, so a long game gets tense. A minimum (45 ms) stops it from becoming impossible.

Putting the numbers in an object (`SPEEDS`) instead of scattering them through the code means you can tune the game in one place. The math lives in a small function:

```js
Math.max(45, base - Math.floor(score / 5) * 5)
```

Read it from the inside out: `Math.floor(score / 5)` is how many groups of 5 points you have (12 points → 2), times 5 ms each, taken off the base speed, but never below 45.

### What to write

1. A `<select id="speed">` in the controls with three `<option>`s: `slow`, `normal` (selected) and `fast`.
2. A `SPEEDS` object and a `tickMs()` function that reads the menu and applies the formula.
3. Use `setTimeout(tick, tickMs())` in `tick()`, so every move uses the current speed.

> Tip: try changing Speed in the middle of a game. Because `tickMs()` reads the menu every tick, it changes instantly.

check: html | a speed menu with id "speed" | /<select[^>]*id=["']speed["']/
check: html | slow, normal and fast options | /value=["']slow["'][\s\S]*value=["']normal["'][\s\S]*value=["']fast["']/
check: js | a SPEEDS object | /const\s+SPEEDS\s*=/
check: js | a tickMs() function with a minimum speed | /function\s+tickMs\s*\([\s\S]*Math\.max\(/
check: js | tick() uses tickMs() | /setTimeout\(\s*tick\s*,\s*tickMs\(\)\s*\)/

```html page
<header class="bar">
  <h1>Snake</h1>
  <p>Score <strong id="score">0</strong> · Best <strong id="best">0</strong></p>
</header>

<main>
  <canvas id="board" width="400" height="400"></canvas>
  <p id="message" class="message">Press Start or the space bar</p>
  <div class="controls">
    <button id="start">Start</button>
    <label>Speed
      <select id="speed">
        <option value="slow">Slow</option>
        <option value="normal" selected>Normal</option>
        <option value="fast">Fast</option>
      </select>
    </label>
  </div>
</main>
```

```js loop
// Milliseconds between moves for each level
const SPEEDS = { slow: 170, normal: 120, fast: 80 };

// The snake gets 5 ms faster every 5 points, but never faster than 45 ms
function tickMs() {
  const base = SPEEDS[document.getElementById('speed').value] ?? SPEEDS.normal;
  return Math.max(45, base - Math.floor(score / 5) * 5);
}

// The game loop: move, draw, and wait a moment before the next move.
function tick() {
  const result = step();
  draw();
  if (result === 'crash') return gameOver();
  if (result === 'win') return message('You filled the whole board. Amazing!');
  timer = setTimeout(tick, tickMs());
}

function start() {
  clearTimeout(timer);    // never run two loops at once
  newGame();
  message('');
  draw();
  tick();
}

function gameOver() {
  if (score > best) {
    best = score;
    try { localStorage.setItem('snake-best', best); } catch {}
  }
  showScore();
  message(`Game over! You scored ${score}. Press Start or space to play again.`);
}

function message(text) {
  document.getElementById('message').textContent = text;
}
```

quiz: With a base delay of 150 ms and a score of 12, what is `Math.max(45, 150 - Math.floor(12 / 5) * 5)`?
- [ ] 90
- [x] 140
- [ ] 45
why: `Math.floor(12 / 5)` is 2 groups of 5 points, `2 * 5` is 10 ms, and `150 - 10` is 140, which is above the 45 ms minimum.

quiz: Why keep the speeds in one `SPEEDS` object?
- [ ] Objects run faster than numbers
- [x] All the numbers you'd tune live in one place
- [ ] The `<select>` needs an object
why: Tuning the game means changing one object instead of hunting through the code.

## Step: Swipe controls for phones
time: 15

Phones don't have arrow keys, so let's read swipes. A swipe is just two touch events: `touchstart` (finger down) and `touchend` (finger up). Compare where the finger started and where it ended:

- `dx` = how far it moved sideways, `dy` = how far up or down
- whichever is bigger tells you the direction: a mostly sideways swipe is left or right
- the sign tells you which way: positive `dx` is right, positive `dy` is down

A tiny movement is a tap, not a swipe, so ignore anything shorter than about 20 pixels.

### Reusing what we built

Here's the payoff for writing `turn(name)` as its own function in step 6: swipes call the exact same `turn()`, so they automatically get the no-reversing rule and the turn queue. No duplicated logic.

> Tip: `{ passive: true }` on `touchstart` tells the browser we won't block scrolling from that listener, which keeps touch handling smooth. The `touch-action: none` CSS from step 1 is what stops the page from scrolling during a swipe.

### What to write

1. A `touchStart` variable to remember where the finger went down.
2. A `touchstart` listener on the canvas that saves `e.touches[0].clientX` and `clientY`.
3. A `touchend` listener that reads `e.changedTouches[0]`, works out `dx` and `dy`, ignores short ones, and calls `turn()`.

You can test this with your browser's developer tools: most have a "device toolbar" that simulates a phone and turns mouse drags into touches.

check: js | a touchstart listener on the canvas | /canvas\.addEventListener\(\s*['"]touchstart['"]/
check: js | a touchend listener on the canvas | /canvas\.addEventListener\(\s*['"]touchend['"]/
check: js | compares sideways and up/down movement | /Math\.abs\(\s*dx\s*\)\s*>\s*Math\.abs\(\s*dy\s*\)/
check: js | swipes use the same turn() function | /touchend[\s\S]*turn\(/

```js controls
// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.
const KEYS = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', s: 'down', a: 'left', d: 'right',
};

function turn(name) {
  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued
  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself
  queue.push(name);
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && (over || !timer)) {   // space starts a game when none is running
    e.preventDefault();
    return start();
  }
  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
  if (!name) return;
  e.preventDefault();     // stop the arrow keys from scrolling the page
  turn(name);
});

// Swipes on a phone: compare where the finger went down with where it came up.
let touchStart = null;

canvas.addEventListener('touchstart', (e) => {
  const t = e.touches[0];
  touchStart = { x: t.clientX, y: t.clientY };
}, { passive: true });

canvas.addEventListener('touchend', (e) => {
  if (!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  touchStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;   // a tap, not a swipe
  if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');
  else turn(dy > 0 ? 'down' : 'up');
});
```

quiz: A finger moves 80 pixels right and 15 pixels up. Which way does the snake turn?
- [ ] Up
- [x] Right
- [ ] Nothing, it's a tap
why: The sideways movement (`dx` = 80) is bigger than the vertical one (`dy` = -15), and it's positive, so it's a right swipe.

quiz: Why do swipes call the same `turn()` function as the keys?
- [ ] Swipes can't change variables directly
- [x] They get the no-reversing rule and the turn queue for free, with no duplicated code
- [ ] `turn()` is the only function that can read touches
why: Writing `turn(name)` once means every input (keys, swipes) follows the same rules.

## Step: A no-walls mode where the board wraps around
time: 15

The last feature: a mode with no walls, where leaving one edge brings you back on the opposite side (like Pac-Man's tunnel).

### The modulo trick

```svg Wrapping around: (x + SIZE) % SIZE takes column -1 to column 19
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="420" height="100" font-family="system-ui, sans-serif" font-size="12"><defs><marker id="w" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#2563eb"/></marker></defs><path d="M30 38 C 30 5, 185 5, 185 36" fill="none" stroke="#2563eb" stroke-width="2" marker-end="url(#w)"/><rect x="20" y="40" width="28" height="28" rx="4" fill="#22c55e" stroke="#94a3b8"/><text x="34" y="88" text-anchor="middle" fill="#55607a">0</text><rect x="50" y="40" width="28" height="28" rx="4" fill="#eef2f8" stroke="#94a3b8"/><text x="64" y="88" text-anchor="middle" fill="#55607a">1</text><rect x="80" y="40" width="28" height="28" rx="4" fill="#eef2f8" stroke="#94a3b8"/><text x="94" y="88" text-anchor="middle" fill="#55607a">2</text><rect x="110" y="40" width="28" height="28" rx="4" fill="#eef2f8" stroke="#94a3b8"/><text x="124" y="88" text-anchor="middle" fill="#55607a">…</text><rect x="140" y="40" width="28" height="28" rx="4" fill="#eef2f8" stroke="#94a3b8"/><text x="154" y="88" text-anchor="middle" fill="#55607a">18</text><rect x="170" y="40" width="28" height="28" rx="4" fill="#eef2f8" stroke="#94a3b8"/><text x="184" y="88" text-anchor="middle" fill="#55607a">19</text><text x="215" y="50" fill="#334155">going left from column 0:</text><text x="215" y="68" font-family="monospace">(-1 + 20) % 20 = 19</text></svg>
```

The `%` operator gives the remainder after dividing. On a 20-cell board:

- going right from column 19 gives column 20, and `20 % 20` is `0`: back on the left edge
- going left from column 0 gives column -1. In JavaScript `-1 % 20` is `-1` (not 19!), so we add `SIZE` first: `(-1 + 20) % 20` is `19`

So one formula handles both edges: `(x + SIZE) % SIZE`. Do the same for `y`.

### What to write

1. A checkbox in the controls: `<label><input type="checkbox" id="walls" checked> Walls</label>`.
2. A `walls` variable that `newGame()` reads from the checkbox.
3. In `step()`, when walls are off, wrap the new head with the modulo formula, and only count `hitWall` when walls are on.

Notice how little changed: one new variable and two lines in `step()`. That's the benefit of having all the rules in one place.

check: html | a walls checkbox with id "walls" | /<input[^>]*type=["']checkbox["'][^>]*id=["']walls["']|<input[^>]*id=["']walls["'][^>]*type=["']checkbox["']/
check: js | newGame() reads the checkbox | /walls\s*=\s*document\.getElementById\(\s*['"]walls['"]\s*\)\.checked/
check: js | wrapping with (x + SIZE) % SIZE | /\(\s*head\.x\s*\+\s*SIZE\s*\)\s*%\s*SIZE/
check: js | walls only count when they're on | /hitWall\s*=\s*walls\s*&&/

```html page
<header class="bar">
  <h1>Snake</h1>
  <p>Score <strong id="score">0</strong> · Best <strong id="best">0</strong></p>
</header>

<main>
  <canvas id="board" width="400" height="400"></canvas>
  <p id="message" class="message">Press Start or the space bar</p>
  <div class="controls">
    <button id="start">Start</button>
    <label>Speed
      <select id="speed">
        <option value="slow">Slow</option>
        <option value="normal" selected>Normal</option>
        <option value="fast">Fast</option>
      </select>
    </label>
    <label><input type="checkbox" id="walls" checked> Walls</label>
  </div>
</main>
```

```js state
let snake, direction, queue, food, score, over, walls, timer;

// The best score is kept in the browser. Storage can be blocked (private windows, and this editor's
// sandboxed preview), so every use is wrapped in try/catch and the game works either way.
let best = 0;
try { best = Number(localStorage.getItem('snake-best')) || 0; } catch {}

// Everything a new game needs, so Start always begins from the same place
function newGame() {
  const mid = Math.floor(SIZE / 2);
  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];
  direction = 'right';
  queue = [];             // turns pressed since the last move
  score = 0;
  over = false;
  walls = document.getElementById('walls').checked;
  food = placeFood();
  showScore();
}
```

```js rules
// Move the snake one cell. Returns what happened: 'move', 'eat', 'crash' or 'win'.
function step() {
  if (queue.length) direction = queue.shift();
  const d = DIRECTIONS[direction];
  let head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
  if (!walls) head = { x: (head.x + SIZE) % SIZE, y: (head.y + SIZE) % SIZE };   // wrap around the edges
  const eating = food && head.x === food.x && head.y === food.y;

  // The tail moves out of the way this turn (unless we're growing), so it doesn't count as a hit
  const body = eating ? snake : snake.slice(0, -1);
  const hitWall = walls && (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE);
  const hitSelf = body.some((c) => c.x === head.x && c.y === head.y);
  if (hitWall || hitSelf) {
    over = true;
    return 'crash';
  }

  snake.unshift(head);
  if (!eating) {
    snake.pop();
    return 'move';
  }
  score += 1;             // grow: we kept the tail this time
  showScore();
  food = placeFood();
  if (!food) {            // no empty cell left: you filled the board
    over = true;
    return 'win';
  }
  return 'eat';
}
```

quiz: On a 20-cell board in no-walls mode, the head goes left from column 0. What is `(-1 + 20) % 20`?
- [ ] -1
- [ ] 0
- [x] 19
why: Adding `SIZE` first keeps the number positive, so -1 wraps to column 19 on the right edge.

quiz: Why add `SIZE` before taking the remainder?
- [x] In JavaScript `-1 % 20` is `-1`, not 19
- [ ] It makes the board bigger
- [ ] Modulo only works on numbers over 20
why: JavaScript keeps the sign in `%`, so `(x + SIZE) % SIZE` handles both edges with one formula.
