// Built from guides/snake.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "snake",
 "title": "Snake",
 "goals": [
  "Draw a grid and shapes on a <canvas>",
  "Keep game data separate from drawing",
  "Run a game loop with setTimeout and stop it cleanly",
  "Handle keyboard and swipe input through one function",
  "Find and fix edge cases like the snake's tail",
  "Save a best score with storage that can fail"
 ],
 "prereqs": [
  "Basic HTML and CSS (elements, ids, a few properties)",
  "JavaScript variables, functions, if and for loops",
  "Arrays and objects (you'll use them a lot)"
 ],
 "sessions": [
  {
   "title": "A snake on the board",
   "from": 0,
   "to": 3
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
   "setup": "",
   "directions": "",
   "state": "",
   "food": "",
   "rules": "",
   "draw": "",
   "loop": "",
   "controls": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "The page: a canvas, a score and a Start button",
   "body": "Welcome! In this guide you'll rebuild my [Snake game](https://theoyanvno.github.io/snake-game/) from a blank page. By the end you'll have a snake that moves on its own, turns with the arrow keys or a swipe, eats food, grows, speeds up, and crashes into walls or itself.\n\nEvery game in a browser starts with something to draw on. We'll use a `<canvas>`: a rectangle of pixels you paint with JavaScript. Unlike normal HTML, nothing inside a canvas is an element you can click or style. You draw shapes, and the browser just remembers the colors of the pixels.\n\n### What to write\n\nIn the **HTML** pane:\n\n1. A header with the title and a score: `Score <strong id=\"score\">0</strong>`. The `id` is how JavaScript will find that number later and change it.\n2. A `<canvas id=\"board\" width=\"400\" height=\"400\"></canvas>`. The `width` and `height` attributes set how many pixels the drawing has. (CSS can make it *look* bigger or smaller, but the drawing is still 400 x 400.)\n3. A paragraph for messages, `<p id=\"message\">`, and a `<button id=\"start\">Start</button>`.\n\nIn the **CSS** pane, give the page a dark background, center everything with CSS Grid (`display: grid; place-items: center`), and give the canvas a background color so you can see it.\n\n> Tip: `touch-action: none` on the canvas stops a phone from scrolling the page when you swipe on the board. We'll use swipes in step 11.\n\n### Why it's built this way\n\nKeeping the HTML small and giving each part an `id` makes the JavaScript simple: `document.getElementById('score')` finds the score in one line. Notice there's no snake in the HTML at all. The snake only exists as data in JavaScript, and the canvas is just where we paint it.",
   "checks": [
    {
     "pane": "html",
     "label": "a <canvas> with id \"board\", 400 x 400",
     "test": "/<canvas[^>]*id=[\"']board[\"'][^>]*>/",
     "hint": "Add <canvas id=\"board\" width=\"400\" height=\"400\"></canvas>"
    },
    {
     "pane": "html",
     "label": "the canvas is 400 pixels wide and tall",
     "test": "/<canvas(?=[^>]*width=[\"']?400)(?=[^>]*height=[\"']?400)[^>]*>/",
     "hint": "Give the canvas width=\"400\" and height=\"400\""
    },
    {
     "pane": "html",
     "label": "a score with id \"score\"",
     "test": "/id=[\"']score[\"']/"
    },
    {
     "pane": "html",
     "label": "a Start button with id \"start\"",
     "test": "/<button[^>]*id=[\"']start[\"']/"
    },
    {
     "pane": "html",
     "label": "a message area with id \"message\"",
     "test": "/id=[\"']message[\"']/"
    },
    {
     "pane": "css",
     "label": "the canvas is styled",
     "test": "/canvas\\s*\\{[^}]*background/",
     "hint": "Add a canvas { background: ... } rule so you can see the board"
    }
   ],
   "quiz": [
    {
     "q": "Why does the canvas need `width` and `height` attributes even though CSS can resize it?",
     "options": [
      "CSS can't style a canvas",
      "They set how many pixels the drawing has; CSS only changes how big it looks",
      "They make the canvas clickable"
     ],
     "answer": 1,
     "why": "The attributes set the drawing's resolution. CSS can stretch or shrink it on screen, but you still draw on a 400 x 400 grid of pixels."
    },
    {
     "q": "Why is there no snake anywhere in the HTML?",
     "options": [
      "The snake only exists as data in JavaScript and gets painted onto the canvas",
      "HTML can't show green squares",
      "It's added later with innerHTML"
     ],
     "answer": 0,
     "why": "The canvas is just pixels. The snake is an array in JavaScript, and `draw()` paints it."
    }
   ],
   "session": 0,
   "minutes": 10,
   "html": {
    "page": "<header class=\"bar\">\n  <h1>Snake</h1>\n  <p>Score <strong id=\"score\">0</strong></p>\n</header>\n\n<main>\n  <canvas id=\"board\" width=\"400\" height=\"400\"></canvas>\n  <p id=\"message\" class=\"message\">Press Start</p>\n  <div class=\"controls\">\n    <button id=\"start\">Start</button>\n  </div>\n</main>"
   },
   "css": {
    "base": "body {\n  margin: 0;\n  min-height: 100vh;\n  display: grid;\n  place-items: center;\n  font-family: system-ui, sans-serif;\n  background: #10141c;\n  color: #e8ecf2;\n}\n\n.bar {\n  display: flex;\n  gap: 24px;\n  align-items: baseline;\n}\n\nh1 { margin: 0; }\n\ncanvas {\n  display: block;\n  max-width: 100%;\n  height: auto;\n  background: #182030;\n  border-radius: 12px;\n  touch-action: none;   /* swiping on the board shouldn't scroll the page */\n}\n\n.message {\n  min-height: 1.5em;\n  text-align: center;\n  color: #9aa6b8;\n}\n\n.controls {\n  display: flex;\n  gap: 12px;\n  justify-content: center;\n  align-items: center;\n}\n\nbutton {\n  font: inherit;\n  font-weight: 700;\n  padding: 8px 18px;\n  border: 0;\n  border-radius: 8px;\n  background: #4ade80;\n  color: #0b1a10;\n  cursor: pointer;\n}"
   }
  },
  {
   "title": "Drawing the board",
   "body": "Now let's paint on the canvas. In JavaScript you don't draw on the `<canvas>` element directly. You ask it for a **drawing context**, an object full of drawing commands:\n\n```js\nconst ctx = canvas.getContext('2d');\nctx.fillStyle = 'red';        // pick a color\nctx.fillRect(10, 10, 50, 30); // fill a rectangle: x, y, width, height\n```\n\nCanvas coordinates start at the **top-left corner**: `x` grows to the right and `y` grows *down* (the opposite of math class).\n\n```svg The board in cells: x grows to the right, y grows down\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 380 165\" width=\"380\" height=\"165\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><defs><marker id=\"a\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"#2563eb\"/></marker><marker id=\"b\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"#dc2626\"/></marker></defs><text x=\"52\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">0</text><text x=\"76\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">1</text><text x=\"100\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">2</text><text x=\"124\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">3</text><text x=\"148\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">4</text><text x=\"172\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">5</text><text x=\"196\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">6</text><text x=\"220\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">7</text><text x=\"30\" y=\"36\" text-anchor=\"end\" fill=\"#55607a\">0</text><text x=\"30\" y=\"60\" text-anchor=\"end\" fill=\"#55607a\">1</text><text x=\"30\" y=\"84\" text-anchor=\"end\" fill=\"#55607a\">2</text><text x=\"30\" y=\"108\" text-anchor=\"end\" fill=\"#55607a\">3</text><text x=\"30\" y=\"132\" text-anchor=\"end\" fill=\"#55607a\">4</text><rect x=\"40\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"64\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"88\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"136\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"160\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"184\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"208\" y=\"20\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"40\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"64\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"88\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"136\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"160\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"184\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"208\" y=\"44\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"40\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"64\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"88\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"136\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"160\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"184\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"208\" y=\"68\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"40\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"64\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"88\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"136\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"160\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"184\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"208\" y=\"92\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"40\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"64\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"88\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"136\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"160\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"184\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"208\" y=\"116\" width=\"24\" height=\"24\" fill=\"none\" stroke=\"#c9d1de\"/><rect x=\"112\" y=\"68\" width=\"24\" height=\"24\" fill=\"#4ade80\" stroke=\"#1f7a46\"/><path d=\"M40 150 H230\" stroke=\"#2563eb\" stroke-width=\"2\" marker-end=\"url(#a)\"/><text x=\"236\" y=\"154\" fill=\"#2563eb\">x grows right</text><path d=\"M262 20 V130\" stroke=\"#dc2626\" stroke-width=\"2\" marker-end=\"url(#b)\"/><text x=\"270\" y=\"80\" fill=\"#dc2626\">y grows down</text><rect x=\"140\" y=\"72\" width=\"62\" height=\"18\" rx=\"4\" fill=\"#ffffff\" stroke=\"#1f7a46\"/><text x=\"171\" y=\"85\" text-anchor=\"middle\" fill=\"#1f7a46\">x: 3, y: 2</text></svg>\n```\n\n### Thinking in cells, not pixels\n\nSnake moves in whole squares, so we'll split the 400-pixel board into a 20 x 20 grid. Two constants describe it:\n\n- `SIZE = 20`: how many cells across (and down)\n- `CELL = canvas.width / SIZE`: how many pixels one cell is (400 / 20 = 20)\n\nFrom now on, the game thinks in cells. A cell at column 3, row 5 is drawn at pixel `3 * CELL, 5 * CELL`. If you ever want a bigger board, you change `SIZE` and everything else follows.\n\n### What to write\n\n1. At the top of the JS pane, find the canvas and get its context, then define `SIZE` and `CELL`.\n2. Write a `draw()` function that fills the whole board with the background color (`fillRect(0, 0, canvas.width, canvas.height)`), then draws faint grid lines with a `for` loop.\n3. Call `draw()` once at the bottom.\n\nDrawing a line on a canvas takes four calls: `beginPath()` to start, `moveTo(x, y)` to put the pen down, `lineTo(x, y)` to draw to a point, and `stroke()` to actually paint it.\n\n> Tip: `rgba(255, 255, 255, 0.05)` is white at 5% opacity, so the grid is barely visible. Try 0.3 to see it clearly, then turn it back down.",
   "checks": [
    {
     "pane": "js",
     "label": "gets the canvas with getElementById('board')",
     "test": "/getElementById\\(\\s*['\"]board['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "gets the 2D drawing context",
     "test": "/getContext\\(\\s*['\"]2d['\"]\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "SIZE and CELL constants",
     "test": "/const\\s+SIZE\\s*=[\\s\\S]*const\\s+CELL\\s*=/",
     "hint": "Add const SIZE = 20; and const CELL = canvas.width / SIZE;"
    },
    {
     "pane": "js",
     "label": "a draw() function that fills the board",
     "test": "/function\\s+draw\\s*\\([\\s\\S]*fillRect\\(/"
    },
    {
     "pane": "js",
     "label": "draw() is called",
     "test": "/^\\s*draw\\(\\);?\\s*$/m"
    }
   ],
   "quiz": [
    {
     "q": "On a canvas, which way does `y` grow?",
     "options": [
      "Up, like in math class",
      "Down, from the top-left corner",
      "It depends on the canvas size"
     ],
     "answer": 1,
     "why": "Canvas coordinates start at the top-left corner. `x` grows to the right and `y` grows down."
    },
    {
     "q": "With `SIZE = 20` on a 400-pixel board, where is the cell at column 3, row 5 drawn?",
     "options": [
      "At pixel 3, 5",
      "At pixel 60, 100",
      "At pixel 15, 25"
     ],
     "answer": 1,
     "why": "Each cell is `CELL = 400 / 20 = 20` pixels, so column 3 is `3 * 20 = 60` and row 5 is `5 * 20 = 100`."
    }
   ],
   "session": 0,
   "minutes": 12,
   "js": {
    "setup": "const canvas = document.getElementById('board');\nconst ctx = canvas.getContext('2d');\nconst SIZE = 20;                    // the board is 20 cells across and 20 down\nconst CELL = canvas.width / SIZE;   // so each cell is 400 / 20 = 20 pixels",
    "draw": "function draw() {\n  // 1. Clear the board\n  ctx.fillStyle = '#182030';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  // 2. Faint grid lines so you can see the cells\n  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';\n  for (let i = 1; i < SIZE; i++) {\n    ctx.beginPath();\n    ctx.moveTo(i * CELL, 0);\n    ctx.lineTo(i * CELL, canvas.height);\n    ctx.moveTo(0, i * CELL);\n    ctx.lineTo(canvas.width, i * CELL);\n    ctx.stroke();\n  }\n}",
    "go": "draw();"
   }
  },
  {
   "title": "The snake is just a list of cells",
   "body": "Here's the most important idea in this whole guide: **the snake is data, not a drawing.** It's an array of cells, head first:\n\n```js\nlet snake = [\n  { x: 10, y: 10 },   // head\n  { x: 9, y: 10 },\n  { x: 8, y: 10 },    // tail\n];\n```\n\nEach cell is an object with an `x` (column) and `y` (row) in *cells*, not pixels. The drawing code reads this list and paints a square for each cell. The game rules, which we'll write next, only ever change the list.\n\n```svg The snake array, head first, and the cells it fills on the board\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 360 150\" width=\"360\" height=\"150\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><rect x=\"10\" y=\"20\" width=\"105\" height=\"30\" rx=\"6\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"62\" y=\"40\" text-anchor=\"middle\" font-family=\"monospace\" font-size=\"11\">{ x: 10, y: 10 }</text><text x=\"62\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">head</text><rect x=\"125\" y=\"20\" width=\"105\" height=\"30\" rx=\"6\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"177\" y=\"40\" text-anchor=\"middle\" font-family=\"monospace\" font-size=\"11\">{ x: 9, y: 10 }</text><text x=\"177\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">index 1</text><rect x=\"240\" y=\"20\" width=\"105\" height=\"30\" rx=\"6\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"292\" y=\"40\" text-anchor=\"middle\" font-family=\"monospace\" font-size=\"11\">{ x: 8, y: 10 }</text><text x=\"292\" y=\"14\" text-anchor=\"middle\" fill=\"#55607a\">tail</text><rect x=\"240\" y=\"100\" width=\"32\" height=\"32\" rx=\"6\" fill=\"#22c55e\"/><path d=\"M62 52 L256 98\" stroke=\"#94a3b8\" stroke-dasharray=\"3 3\"/><rect x=\"206\" y=\"100\" width=\"32\" height=\"32\" rx=\"6\" fill=\"#86efac\"/><path d=\"M177 52 L222 98\" stroke=\"#94a3b8\" stroke-dasharray=\"3 3\"/><rect x=\"172\" y=\"100\" width=\"32\" height=\"32\" rx=\"6\" fill=\"#86efac\"/><path d=\"M292 52 L188 98\" stroke=\"#94a3b8\" stroke-dasharray=\"3 3\"/><text x=\"282\" y=\"114\" fill=\"#55607a\">on the</text><text x=\"282\" y=\"128\" fill=\"#55607a\">board</text></svg>\n```\n\nWhy separate them? Because the rules get easy to think about: \"move\" means \"add a cell at the front, remove one from the back,\" with no pixels involved. And you could swap the drawing for something else entirely (emoji, a 3D view) without touching the rules. My real Snake project keeps the rules in their own file so they can be tested without a browser.\n\n### What to write\n\n1. In a new block above `draw()`, create the `snake` array with three cells in the middle of the board.\n2. In `draw()`, after the grid, loop over the snake with `snake.forEach((cell, i) => { ... })` and draw a rounded square for each cell at `cell.x * CELL, cell.y * CELL`. Make the head (`i === 0`) a slightly brighter green.\n\n`ctx.roundRect(x, y, width, height, radius)` draws a rounded rectangle; follow it with `ctx.fill()`. Leaving a 1-pixel gap on each side (`+ 1` and `CELL - 2`) makes the segments look separate.",
   "checks": [
    {
     "pane": "js",
     "label": "a snake array of { x, y } cells",
     "test": "/let\\s+snake\\s*=\\s*\\[\\s*\\{\\s*x:/"
    },
    {
     "pane": "js",
     "label": "draw() loops over the snake",
     "test": "/snake\\.forEach\\(/"
    },
    {
     "pane": "js",
     "label": "each cell is drawn at cell.x * CELL",
     "test": "/cell\\.x\\s*\\*\\s*CELL/"
    }
   ],
   "quiz": [
    {
     "q": "What does each object in the `snake` array describe?",
     "options": [
      "The pixels of one square",
      "One cell of the snake, as a column and row",
      "A color for each segment"
     ],
     "answer": 1,
     "why": "Each item is `{ x, y }` in grid cells, head first. The drawing turns cells into pixels; the rules never think about pixels."
    },
    {
     "q": "Why keep the snake as data instead of drawing it straight onto the canvas?",
     "options": [
      "Data uses less memory",
      "The rules only change the list, and the drawing can be swapped without touching them",
      "Canvas can't draw squares in a loop"
     ],
     "answer": 1,
     "why": "Separating data from drawing makes the rules simple to write and, later, to test."
    }
   ],
   "session": 0,
   "minutes": 10,
   "js": {
    "state": "// The snake is a list of cells, head first. Each cell is { x, y } in grid units, not pixels.\nlet snake = [\n  { x: 10, y: 10 },   // head\n  { x: 9, y: 10 },\n  { x: 8, y: 10 },    // tail\n];",
    "draw": "function draw() {\n  // 1. Clear the board\n  ctx.fillStyle = '#182030';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  // 2. Faint grid lines so you can see the cells\n  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';\n  for (let i = 1; i < SIZE; i++) {\n    ctx.beginPath();\n    ctx.moveTo(i * CELL, 0);\n    ctx.lineTo(i * CELL, canvas.height);\n    ctx.moveTo(0, i * CELL);\n    ctx.lineTo(canvas.width, i * CELL);\n    ctx.stroke();\n  }\n\n  // 3. The snake: one rounded square per cell, the head a little brighter\n  snake.forEach((cell, i) => {\n    ctx.fillStyle = i === 0 ? '#86efac' : '#4ade80';\n    ctx.beginPath();\n    ctx.roundRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2, 5);\n    ctx.fill();\n  });\n}"
   }
  },
  {
   "title": "Moving one cell at a time",
   "body": "How does a snake move? Look closely at the game: the head goes forward one cell and every other segment moves into the spot of the segment in front of it. That sounds complicated, but there's a trick: **add a new head in front and remove the last cell.** Every cell in between stays exactly where it is, and it looks like the whole snake slid forward.\n\n```svg Moving: add a new head in front, remove the tail. The middle stays put.\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 140\" width=\"420\" height=\"140\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><text x=\"10\" y=\"30\" fill=\"#334155\" font-weight=\"600\">Before</text><rect x=\"90\" y=\"10\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"124\" y=\"10\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"158\" y=\"10\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#22c55e\" stroke=\"#64748b\"/><text x=\"266\" y=\"30\" fill=\"#55607a\"></text><text x=\"10\" y=\"75\" fill=\"#334155\" font-weight=\"600\">unshift + pop</text><rect x=\"90\" y=\"55\" width=\"30\" height=\"30\" rx=\"6\" fill=\"none\" stroke=\"#64748b\" stroke-dasharray=\"4 3\"/><rect x=\"124\" y=\"55\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"158\" y=\"55\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"192\" y=\"55\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#facc15\" stroke=\"#64748b\"/><text x=\"266\" y=\"75\" fill=\"#55607a\">new head in, tail out</text><text x=\"10\" y=\"120\" fill=\"#334155\" font-weight=\"600\">After</text><rect x=\"124\" y=\"100\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"158\" y=\"100\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#86efac\" stroke=\"#64748b\"/><rect x=\"192\" y=\"100\" width=\"30\" height=\"30\" rx=\"6\" fill=\"#22c55e\" stroke=\"#64748b\"/><text x=\"266\" y=\"120\" fill=\"#55607a\">the middle never moved</text></svg>\n```\n\n```js\nsnake.unshift(newHead); // add to the front of the array\nsnake.pop();            // remove from the end\n```\n\n### Directions as data\n\nInstead of four `if` statements for up, down, left and right, we store how each direction changes `x` and `y`:\n\n| direction | x change | y change |\n|---|---|---|\n| up | 0 | -1 |\n| right | +1 | 0 |\n\nSo \"the cell in front of the head\" is always `{ x: head.x + d.x, y: head.y + d.y }`, whichever direction `d` is. Remember that `y` grows downward, which is why up is `-1`.\n\n### What to write\n\n1. A `DIRECTIONS` object with `up`, `down`, `left` and `right`, each `{ x, y }`.\n2. A `direction` variable that starts as `'right'`.\n3. A `step()` function that works out the new head from the current head and direction, then `unshift`s it and `pop`s the tail.\n4. For now, make the Start button move the snake one cell per click: `document.getElementById('start').onclick = () => { step(); draw(); };`\n\nClick Start a few times and watch the snake slide right. (It will happily leave the board; we'll fix that later.)",
   "checks": [
    {
     "pane": "js",
     "label": "a DIRECTIONS object",
     "test": "/const\\s+DIRECTIONS\\s*=\\s*\\{[\\s\\S]*up:\\s*\\{\\s*x:\\s*0,\\s*y:\\s*-1\\s*\\}/",
     "hint": "up should be { x: 0, y: -1 } because y grows downward"
    },
    {
     "pane": "js",
     "label": "a direction variable starting at 'right'",
     "test": "/let\\s+direction\\s*=\\s*['\"]right['\"]/"
    },
    {
     "pane": "js",
     "label": "step() adds a new head with unshift",
     "test": "/function\\s+step\\s*\\([\\s\\S]*unshift\\(/"
    },
    {
     "pane": "js",
     "label": "step() removes the tail with pop",
     "test": "/function\\s+step\\s*\\([\\s\\S]*\\.pop\\(\\)/"
    },
    {
     "pane": "js",
     "label": "the Start button calls step()",
     "test": "/getElementById\\(\\s*['\"]start['\"]\\s*\\)[\\s\\S]*step\\(\\)/"
    }
   ],
   "quiz": [
    {
     "q": "How does the snake move one cell forward?",
     "options": [
      "Every segment's x and y is updated in a loop",
      "A new head is added in front with `unshift` and the tail is removed with `pop`",
      "The whole array is rebuilt from scratch"
     ],
     "answer": 1,
     "why": "The middle segments stay where they are. Adding a head and removing the tail looks exactly like the whole snake sliding forward."
    },
    {
     "q": "Why is `up` stored as `{ x: 0, y: -1 }`?",
     "options": [
      "It's a typo; up should be +1",
      "`y` grows downward, so moving up makes `y` smaller",
      "Negative numbers move faster"
     ],
     "answer": 1,
     "why": "On a canvas `y` grows down, so going up subtracts 1 from `y`."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "directions": "const DIRECTIONS = {\n  up: { x: 0, y: -1 },\n  down: { x: 0, y: 1 },\n  left: { x: -1, y: 0 },\n  right: { x: 1, y: 0 },\n};",
    "state": "// The snake is a list of cells, head first. Each cell is { x, y } in grid units, not pixels.\nlet snake = [\n  { x: 10, y: 10 },   // head\n  { x: 9, y: 10 },\n  { x: 8, y: 10 },    // tail\n];\nlet direction = 'right';",
    "rules": "// Move the snake one cell: add a new head in front, take the last cell off the tail.\nfunction step() {\n  const d = DIRECTIONS[direction];\n  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };\n  snake.unshift(head);   // add to the front\n  snake.pop();           // remove from the back\n}",
    "go": "draw();\ndocument.getElementById('start').onclick = () => { step(); draw(); };   // for now, each click moves one cell"
   }
  }
 ],
 "finish": ""
};
