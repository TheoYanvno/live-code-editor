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
  },
  {
   "title": "Make it a game",
   "from": 4,
   "to": 7
  },
  {
   "title": "Polish, speed and phones",
   "from": 8,
   "to": 11
  },
  {
   "title": "How the real project is built",
   "from": 12,
   "to": 12
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
  },
  {
   "title": "The game loop",
   "body": "Real games don't wait for clicks: they run a **game loop**. Ours is simple: move, draw, then wait a moment and do it again.\n\n```svg The game loop: move, draw, schedule the next tick, wait, repeat\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 145\" width=\"420\" height=\"145\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><defs><marker id=\"m\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"#334155\"/></marker></defs><path d=\"M130 37 H175\" stroke=\"#334155\" stroke-width=\"2\" marker-end=\"url(#m)\"/><path d=\"M240 55 V95\" stroke=\"#334155\" stroke-width=\"2\" marker-end=\"url(#m)\"/><path d=\"M175 112 H130\" stroke=\"#334155\" stroke-width=\"2\" marker-end=\"url(#m)\"/><path d=\"M75 95 V55\" stroke=\"#334155\" stroke-width=\"2\" marker-end=\"url(#m)\"/><rect x=\"20\" y=\"20\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#eef2f8\" stroke=\"#64748b\"/><text x=\"75\" y=\"42\" text-anchor=\"middle\">step()</text><rect x=\"185\" y=\"20\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#eef2f8\" stroke=\"#64748b\"/><text x=\"240\" y=\"42\" text-anchor=\"middle\">draw()</text><rect x=\"185\" y=\"95\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#eef2f8\" stroke=\"#64748b\"/><text x=\"240\" y=\"117\" text-anchor=\"middle\">setTimeout(tick)</text><rect x=\"20\" y=\"95\" width=\"110\" height=\"34\" rx=\"17\" fill=\"#eef2f8\" stroke=\"#64748b\"/><text x=\"75\" y=\"117\" text-anchor=\"middle\">wait 150 ms</text><text x=\"300\" y=\"80\" fill=\"#55607a\">clearTimeout(timer)</text><text x=\"300\" y=\"96\" fill=\"#55607a\">stops the loop</text></svg>\n```\n\n```js\nfunction tick() {\n  step();\n  draw();\n  timer = setTimeout(tick, 150);   // run tick again in 150 milliseconds\n}\n```\n\n`setTimeout(fn, ms)` runs a function once after a delay. Because `tick` schedules itself again, it keeps going forever. Saving the id it returns in `timer` lets us stop it with `clearTimeout(timer)`.\n\n> Tip: why not `setInterval`? Later the snake speeds up as you score. With `setTimeout` each tick can choose a new delay, which `setInterval` can't do.\n\n### Starting a new game\n\nEach game should start from the same place, so move the starting values into a `newGame()` function. Declaring `let snake, direction, timer;` at the top (without values) and filling them in `newGame()` means pressing Start always resets everything.\n\n`start()` stops any loop that's already running (otherwise pressing Start twice would run two loops and the snake would move twice as fast), sets up a new game, and starts ticking.\n\n### What to write\n\n1. Replace the snake array with `let snake, direction, timer;` and a `newGame()` function that sets the snake (in the middle: `Math.floor(SIZE / 2)`) and the direction.\n2. A `tick()` function: step, draw, schedule the next tick.\n3. A `start()` function: `clearTimeout(timer)`, `newGame()`, `draw()`, `tick()`.\n4. At the bottom, call `newGame()` and `draw()` so the board isn't empty, and make the Start button call `start`.",
   "checks": [
    {
     "pane": "js",
     "label": "a newGame() function",
     "test": "/function\\s+newGame\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a tick() function that schedules itself with setTimeout",
     "test": "/function\\s+tick\\s*\\([\\s\\S]*setTimeout\\(\\s*tick/"
    },
    {
     "pane": "js",
     "label": "start() clears the old timer first",
     "test": "/function\\s+start\\s*\\([\\s\\S]*clearTimeout\\(\\s*timer\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "the Start button runs start",
     "test": "/getElementById\\(\\s*['\"]start['\"]\\s*\\)\\.(onclick\\s*=\\s*start|addEventListener\\(\\s*['\"]click['\"]\\s*,\\s*start)/"
    }
   ],
   "quiz": [
    {
     "q": "Why does `start()` call `clearTimeout(timer)` first?",
     "options": [
      "To reset the score",
      "So pressing Start twice doesn't run two loops and make the snake move twice as fast",
      "Because `setTimeout` only works once per page"
     ],
     "answer": 1,
     "why": "Each loop schedules itself again. Stopping the old one before starting a new one keeps exactly one loop running."
    },
    {
     "q": "Why use `setTimeout` instead of `setInterval` for the game loop?",
     "options": [
      "`setInterval` doesn't work in a canvas",
      "Each tick can choose a new delay, which the speed-up feature needs",
      "`setTimeout` is faster"
     ],
     "answer": 1,
     "why": "With `setTimeout`, every tick decides when the next one runs, so the delay can shrink as the score goes up."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "state": "let snake, direction, timer;\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n}",
    "loop": "// The game loop: move, draw, and wait a moment before the next move.\nfunction tick() {\n  step();\n  draw();\n  timer = setTimeout(tick, 150);\n}\n\nfunction start() {\n  clearTimeout(timer);    // never run two loops at once\n  newGame();\n  draw();\n  tick();\n}",
    "go": "newGame();\ndraw();\ndocument.getElementById('start').onclick = start;"
   }
  },
  {
   "title": "Steering with the keyboard",
   "body": "Time to take control. When a key is pressed, the browser fires a `keydown` event, and `event.key` tells you which key: `'ArrowUp'`, `'a'`, `' '` (space) and so on. A lookup object turns keys into directions:\n\n```js\nconst KEYS = { ArrowUp: 'up', w: 'up', /* ... */ };\n```\n\n### Two rules that make it feel right\n\n```svg Turns go into a queue, and a turn straight back is ignored\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 380 130\" width=\"380\" height=\"130\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><text x=\"10\" y=\"20\" fill=\"#334155\" font-weight=\"600\">Keys pressed between two moves:</text><rect x=\"10\" y=\"30\" width=\"60\" height=\"28\" rx=\"6\" fill=\"#dbeafe\" stroke=\"#2563eb\"/><text x=\"40\" y=\"49\" text-anchor=\"middle\">↑ up</text><rect x=\"76\" y=\"30\" width=\"60\" height=\"28\" rx=\"6\" fill=\"#dbeafe\" stroke=\"#2563eb\"/><text x=\"106\" y=\"49\" text-anchor=\"middle\">← left</text><text x=\"150\" y=\"49\" fill=\"#55607a\">queue = [up, left]</text><text x=\"10\" y=\"90\" fill=\"#334155\">move 1 uses <tspan font-weight=\"700\">up</tspan>, move 2 uses <tspan font-weight=\"700\">left</tspan>: no press is lost</text><text x=\"10\" y=\"118\" fill=\"#dc2626\">going right? pressing ← (the opposite) is ignored</text></svg>\n```\n\n1. **No reversing.** If you're going right and press left, the head would move into your own neck. So a turn to the *opposite* direction is ignored. An `OPPOSITE` object (`up` ↔ `down`, `left` ↔ `right`) makes this a one-line check.\n2. **A small queue of turns.** The snake only moves every 150 ms. If you press up and then left quickly, both presses happen before the next move. If we just set `direction` each time, the up would be lost. Instead we push turns into a `queue` (at most 2), and each `step()` takes the next one off the front with `queue.shift()`.\n\nThe \"no reversing\" check compares against the *last queued* direction, not the current one: `queue.at(-1) ?? direction`. (`at(-1)` is the last item in an array; `??` means \"if that's missing, use this instead\".)\n\n### What to write\n\n1. Add `OPPOSITE` under `DIRECTIONS`, and a `queue` variable that `newGame()` empties.\n2. At the start of `step()`, `if (queue.length) direction = queue.shift();`\n3. A `KEYS` object for the arrow keys and W/A/S/D, a `turn(name)` function with the two rules above, and a `keydown` listener that calls it.\n4. Call `e.preventDefault()` for game keys so the arrows don't scroll the page.\n\n> Tip: keys go to whatever has focus. **Click on the result once** so the game gets your key presses instead of the editor.",
   "checks": [
    {
     "pane": "js",
     "label": "an OPPOSITE lookup",
     "test": "/const\\s+OPPOSITE\\s*=/"
    },
    {
     "pane": "js",
     "label": "a queue of turns",
     "test": "/queue\\s*=\\s*\\[\\]/"
    },
    {
     "pane": "js",
     "label": "step() takes the next queued turn",
     "test": "/function\\s+step\\s*\\([\\s\\S]*queue\\.shift\\(\\)/"
    },
    {
     "pane": "js",
     "label": "a turn() function that refuses reversing",
     "test": "/function\\s+turn\\s*\\([\\s\\S]*OPPOSITE\\[/"
    },
    {
     "pane": "js",
     "label": "a keydown listener",
     "test": "/addEventListener\\(\\s*['\"]keydown['\"]/"
    },
    {
     "pane": "js",
     "label": "arrow keys don't scroll the page",
     "test": "/preventDefault\\(\\)/"
    }
   ],
   "quiz": [
    {
     "q": "You're moving right and press left. What happens?",
     "options": [
      "The snake turns around",
      "Nothing: a turn to the opposite direction is ignored",
      "The game ends"
     ],
     "answer": 1,
     "why": "Turning straight back would move the head into its own neck, so the opposite direction is ignored."
    },
    {
     "q": "Why do turns go into a queue instead of changing `direction` right away?",
     "options": [
      "Queues are faster than variables",
      "Two quick presses between moves both count instead of the first one being lost",
      "So the snake can turn twice in one move"
     ],
     "answer": 1,
     "why": "The snake only moves every 150 ms. A queue keeps both presses, and each move uses one of them."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "directions": "const DIRECTIONS = {\n  up: { x: 0, y: -1 },\n  down: { x: 0, y: 1 },\n  left: { x: -1, y: 0 },\n  right: { x: 1, y: 0 },\n};\nconst OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };",
    "state": "let snake, direction, queue, timer;\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n  queue = [];             // turns pressed since the last move\n}",
    "rules": "// Move the snake one cell: add a new head in front, take the last cell off the tail.\nfunction step() {\n  if (queue.length) direction = queue.shift();\n  const d = DIRECTIONS[direction];\n  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };\n  snake.unshift(head);   // add to the front\n  snake.pop();           // remove from the back\n}",
    "controls": "// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.\nconst KEYS = {\n  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',\n  w: 'up', s: 'down', a: 'left', d: 'right',\n};\n\nfunction turn(name) {\n  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued\n  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself\n  queue.push(name);\n}\n\ndocument.addEventListener('keydown', (e) => {\n  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];\n  if (!name) return;\n  e.preventDefault();     // stop the arrow keys from scrolling the page\n  turn(name);\n});"
   }
  },
  {
   "title": "Food, growing and the score",
   "body": "A snake needs something to chase. Food goes on a **random empty cell**, and that's harder than it sounds: if you just pick a random `x` and `y`, it might land on the snake. The reliable way is to list every free cell and pick one of those.\n\nTo check \"is this cell part of the snake?\" quickly, we put the snake's cells in a `Set` of strings like `\"10,10\"`. Looking something up in a Set is instant, while searching an array means checking every item.\n\n```js\nconst taken = new Set(snake.map((c) => `${c.x},${c.y}`));\ntaken.has('10,10');   // true or false\n```\n\n### Growing is just *not* removing the tail\n\nRemember that moving is \"add a head, remove the tail\"? When the snake eats, we add the head but **skip** removing the tail. The snake ends up one cell longer. That's the whole growing feature.\n\n### What to write\n\n1. Add `food` and `score` to the game state. `newGame()` sets `score = 0`, places the first food, and shows the score.\n2. A `placeFood()` function: build the `taken` Set, loop over every cell with two nested `for` loops, collect the free ones, and return a random one with `free[Math.floor(Math.random() * free.length)]`.\n3. A `showScore()` function that writes the score into `#score`.\n4. In `step()`, check whether the new head is on the food. If so, add 1 to the score and place new food; if not, `pop()` the tail as before.\n5. In `draw()`, draw the food as a red circle: `ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)`, then `fill()`.\n\n> Tip: `Math.random()` gives a number from 0 up to (but not including) 1. Multiplying by the length and rounding down with `Math.floor` gives a valid index every time.",
   "checks": [
    {
     "pane": "js",
     "label": "a placeFood() function",
     "test": "/function\\s+placeFood\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "it skips cells the snake is on (using a Set)",
     "test": "/new\\s+Set\\(/"
    },
    {
     "pane": "js",
     "label": "it picks a random free cell",
     "test": "/Math\\.floor\\(\\s*Math\\.random\\(\\)\\s*\\*\\s*\\w+\\.length\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "step() grows the snake when it eats",
     "test": "/function\\s+step\\s*\\([\\s\\S]*food[\\s\\S]*score\\s*(\\+=\\s*1|\\+\\+)/"
    },
    {
     "pane": "js",
     "label": "the food is drawn as a circle",
     "test": "/ctx\\.arc\\(/"
    }
   ],
   "quiz": [
    {
     "q": "How does the snake grow by one cell when it eats?",
     "options": [
      "It adds two heads",
      "It adds a head but skips removing the tail",
      "It copies the last segment"
     ],
     "answer": 1,
     "why": "Moving is add-a-head, remove-the-tail. Growing is the same move without removing the tail."
    },
    {
     "q": "Why does `placeFood()` build a list of free cells instead of picking random x and y?",
     "options": [
      "Random numbers are slow",
      "A random cell might land on the snake; picking from free cells always gives an empty one",
      "So food always appears near the head"
     ],
     "answer": 1,
     "why": "Listing the empty cells and picking one of them can never put food on the snake, and it also tells you when the board is full."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "state": "let snake, direction, queue, food, score, timer;\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n  queue = [];             // turns pressed since the last move\n  score = 0;\n  food = placeFood();\n  showScore();\n}",
    "food": "// Food goes on a random empty cell. List every free cell, then pick one.\nfunction placeFood() {\n  const taken = new Set(snake.map((c) => `${c.x},${c.y}`));\n  const free = [];\n  for (let y = 0; y < SIZE; y++) {\n    for (let x = 0; x < SIZE; x++) {\n      if (!taken.has(`${x},${y}`)) free.push({ x, y });\n    }\n  }\n  return free[Math.floor(Math.random() * free.length)] ?? null;   // null when the board is full\n}\n\nfunction showScore() {\n  document.getElementById('score').textContent = score;\n}",
    "rules": "// Move the snake one cell. Eating food makes it one cell longer.\nfunction step() {\n  if (queue.length) direction = queue.shift();\n  const d = DIRECTIONS[direction];\n  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };\n  const eating = food && head.x === food.x && head.y === food.y;\n\n  snake.unshift(head);\n  if (eating) {\n    score += 1;           // grow: keep the tail this time\n    showScore();\n    food = placeFood();\n  } else {\n    snake.pop();\n  }\n}",
    "draw": "function draw() {\n  // 1. Clear the board\n  ctx.fillStyle = '#182030';\n  ctx.fillRect(0, 0, canvas.width, canvas.height);\n\n  // 2. Faint grid lines so you can see the cells\n  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';\n  for (let i = 1; i < SIZE; i++) {\n    ctx.beginPath();\n    ctx.moveTo(i * CELL, 0);\n    ctx.lineTo(i * CELL, canvas.height);\n    ctx.moveTo(0, i * CELL);\n    ctx.lineTo(canvas.width, i * CELL);\n    ctx.stroke();\n  }\n\n  // 3. The food: a red circle in the middle of its cell\n  if (food) {\n    ctx.fillStyle = '#f87171';\n    ctx.beginPath();\n    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 3, 0, Math.PI * 2);\n    ctx.fill();\n  }\n\n  // 4. The snake: one rounded square per cell, the head a little brighter\n  snake.forEach((cell, i) => {\n    ctx.fillStyle = i === 0 ? '#86efac' : '#4ade80';\n    ctx.beginPath();\n    ctx.roundRect(cell.x * CELL + 1, cell.y * CELL + 1, CELL - 2, CELL - 2, 5);\n    ctx.fill();\n  });\n}"
   }
  },
  {
   "title": "Crashing (and winning)",
   "body": "A game needs a way to lose. The snake crashes when its new head would be:\n\n- **outside the board**: `x` or `y` is below 0, or `SIZE` or more\n- **on its own body**: any cell of the snake has the same `x` and `y`\n\n### The tricky part: the tail\n\nImagine the snake chasing its own tail in a tight square. On this move the head steps into the cell where the tail *is right now*, but the tail is about to move out of the way. That shouldn't count as a crash. So we check against the body **without its last cell**, `snake.slice(0, -1)`, unless the snake is eating (then the tail stays put, so it does count).\n\nThis is exactly the kind of edge case that's easy to get wrong and hard to notice by playing, which is why my real project has a test for it.\n\n### Telling the loop what happened\n\n`step()` now **returns** what happened: `'move'`, `'eat'`, `'crash'` or `'win'` (the snake filled the whole board, so there's nowhere left for food). `tick()` reads that and either keeps going or stops. Having one function decide and another react keeps both simple.\n\n### What to write\n\n1. An `over` flag in the game state.\n2. In `step()`, before moving, work out `hitWall` and `hitSelf`. If either is true, set `over = true` and `return 'crash'`.\n3. Return `'move'`, `'eat'`, or `'win'` when `placeFood()` returns `null`.\n4. In `tick()`, stop when the result is `'crash'` or `'win'` and show a message with a small `message(text)` function. Clear the message in `start()`.",
   "checks": [
    {
     "pane": "js",
     "label": "an over flag",
     "test": "/\\bover\\s*=\\s*(false|true)/"
    },
    {
     "pane": "js",
     "label": "crashing into the walls",
     "test": "/head\\.x\\s*<\\s*0[\\s\\S]*SIZE/",
     "hint": "Check head.x < 0, head.y < 0, head.x >= SIZE and head.y >= SIZE"
    },
    {
     "pane": "js",
     "label": "crashing into yourself (ignoring the tail)",
     "test": "/slice\\(\\s*0\\s*,\\s*-1\\s*\\)/",
     "hint": "Compare against snake.slice(0, -1), the body without the tail"
    },
    {
     "pane": "js",
     "label": "step() returns 'crash'",
     "test": "/return\\s+['\"]crash['\"]/"
    },
    {
     "pane": "js",
     "label": "tick() stops on a crash",
     "test": "/function\\s+tick\\s*\\([\\s\\S]*crash/"
    },
    {
     "pane": "js",
     "label": "a message() function",
     "test": "/function\\s+message\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "The head moves into the cell the tail is in right now. Is that a crash?",
     "options": [
      "Yes, always",
      "No, because the tail moves out of the way on the same move (unless the snake is eating)",
      "Only in no-walls mode"
     ],
     "answer": 1,
     "why": "The tail leaves that cell this move, so the body is checked without its last cell. When eating, the tail stays, so it does count."
    },
    {
     "q": "Why does `step()` return `'move'`, `'eat'`, `'crash'` or `'win'`?",
     "options": [
      "To print it in the console",
      "So `step()` decides what happened and `tick()` just reacts to it",
      "Because functions must return something"
     ],
     "answer": 1,
     "why": "One function decides and another reacts, which keeps both simple and easy to test."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "state": "let snake, direction, queue, food, score, over, timer;\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n  queue = [];             // turns pressed since the last move\n  score = 0;\n  over = false;\n  food = placeFood();\n  showScore();\n}",
    "rules": "// Move the snake one cell. Returns what happened: 'move', 'eat', 'crash' or 'win'.\nfunction step() {\n  if (queue.length) direction = queue.shift();\n  const d = DIRECTIONS[direction];\n  const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };\n  const eating = food && head.x === food.x && head.y === food.y;\n\n  // The tail moves out of the way this turn (unless we're growing), so it doesn't count as a hit\n  const body = eating ? snake : snake.slice(0, -1);\n  const hitWall = head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE;\n  const hitSelf = body.some((c) => c.x === head.x && c.y === head.y);\n  if (hitWall || hitSelf) {\n    over = true;\n    return 'crash';\n  }\n\n  snake.unshift(head);\n  if (!eating) {\n    snake.pop();\n    return 'move';\n  }\n  score += 1;             // grow: we kept the tail this time\n  showScore();\n  food = placeFood();\n  if (!food) {            // no empty cell left: you filled the board\n    over = true;\n    return 'win';\n  }\n  return 'eat';\n}",
    "loop": "// The game loop: move, draw, and wait a moment before the next move.\nfunction tick() {\n  const result = step();\n  draw();\n  if (result === 'crash') return message(`Game over! You scored ${score}. Press Start to play again.`);\n  if (result === 'win') return message('You filled the whole board. Amazing!');\n  timer = setTimeout(tick, 150);\n}\n\nfunction start() {\n  clearTimeout(timer);    // never run two loops at once\n  newGame();\n  message('');\n  draw();\n  tick();\n}\n\nfunction message(text) {\n  document.getElementById('message').textContent = text;\n}"
   }
  },
  {
   "title": "Best score, and the space bar",
   "body": "Players love beating their own record, so let's remember the best score. The browser's `localStorage` keeps small bits of text for a website, even after the page is closed:\n\n```js\nlocalStorage.setItem('snake-best', 12);\nlocalStorage.getItem('snake-best');   // \"12\" (always a string)\n```\n\n### Storage can fail, so plan for it\n\n`localStorage` throws an error in some situations: private browsing on some browsers, a full disk, or a page that isn't allowed to use storage. **This editor's result frame is one of those**: it's sandboxed for safety, so `localStorage` throws here. If we didn't handle that, the whole game would break.\n\nWrapping storage in `try { ... } catch {}` means: try it, and if it fails, carry on without it. Here the best score simply won't survive a refresh, but the game still works. In my real Snake game it saves normally.\n\n### Space to play again\n\nMaking players reach for the mouse after every game is annoying. If the space bar is pressed when no game is running (`over` is true, or the game hasn't started), start one.\n\n### What to write\n\n1. Add `Best <strong id=\"best\">0</strong>` next to the score in the HTML.\n2. A `best` variable that reads `localStorage` inside `try/catch` (use `Number(...) || 0` to turn the text into a number, and get 0 if it's missing).\n3. A `gameOver()` function: if `score > best`, update `best`, save it (inside `try/catch`), update the display, and show the message. Call it from `tick()` on a crash.\n4. `showScore()` also writes `best` into `#best`.\n5. In the `keydown` listener, start a game on space when `over || !timer`.",
   "checks": [
    {
     "pane": "html",
     "label": "a best score with id \"best\"",
     "test": "/id=[\"']best[\"']/"
    },
    {
     "pane": "js",
     "label": "reads the best score from localStorage",
     "test": "/localStorage\\.getItem\\(/"
    },
    {
     "pane": "js",
     "label": "storage is wrapped in try/catch",
     "test": "/try\\s*\\{[^}]*localStorage[^}]*\\}\\s*catch/"
    },
    {
     "pane": "js",
     "label": "a gameOver() function that saves a new best",
     "test": "/function\\s+gameOver\\s*\\([\\s\\S]*localStorage\\.setItem\\(/"
    },
    {
     "pane": "js",
     "label": "the space bar starts a game",
     "test": "/e\\.key\\s*===\\s*['\"] ['\"]/"
    }
   ],
   "quiz": [
    {
     "q": "Why is every use of `localStorage` wrapped in `try/catch`?",
     "options": [
      "It makes saving faster",
      "Storage can throw (private windows, sandboxed pages like this editor), and the game should keep working",
      "`localStorage` only works inside try blocks"
     ],
     "answer": 1,
     "why": "If storage fails, the catch lets the game carry on; the best score just won't be saved."
    },
    {
     "q": "What does `Number(localStorage.getItem('snake-best')) || 0` give when nothing is saved yet?",
     "options": [
      "`null`",
      "`NaN`",
      "`0`"
     ],
     "answer": 2,
     "why": "`getItem` returns `null`, `Number(null)` is `0`, and `|| 0` also covers anything that isn't a number."
    }
   ],
   "session": 2,
   "minutes": 15,
   "html": {
    "page": "<header class=\"bar\">\n  <h1>Snake</h1>\n  <p>Score <strong id=\"score\">0</strong> · Best <strong id=\"best\">0</strong></p>\n</header>\n\n<main>\n  <canvas id=\"board\" width=\"400\" height=\"400\"></canvas>\n  <p id=\"message\" class=\"message\">Press Start or the space bar</p>\n  <div class=\"controls\">\n    <button id=\"start\">Start</button>\n  </div>\n</main>"
   },
   "js": {
    "state": "let snake, direction, queue, food, score, over, timer;\n\n// The best score is kept in the browser. Storage can be blocked (private windows, and this editor's\n// sandboxed preview), so every use is wrapped in try/catch and the game works either way.\nlet best = 0;\ntry { best = Number(localStorage.getItem('snake-best')) || 0; } catch {}\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n  queue = [];             // turns pressed since the last move\n  score = 0;\n  over = false;\n  food = placeFood();\n  showScore();\n}",
    "food": "// Food goes on a random empty cell. List every free cell, then pick one.\nfunction placeFood() {\n  const taken = new Set(snake.map((c) => `${c.x},${c.y}`));\n  const free = [];\n  for (let y = 0; y < SIZE; y++) {\n    for (let x = 0; x < SIZE; x++) {\n      if (!taken.has(`${x},${y}`)) free.push({ x, y });\n    }\n  }\n  return free[Math.floor(Math.random() * free.length)] ?? null;   // null when the board is full\n}\n\nfunction showScore() {\n  document.getElementById('score').textContent = score;\n  document.getElementById('best').textContent = best;\n}",
    "loop": "// The game loop: move, draw, and wait a moment before the next move.\nfunction tick() {\n  const result = step();\n  draw();\n  if (result === 'crash') return gameOver();\n  if (result === 'win') return message('You filled the whole board. Amazing!');\n  timer = setTimeout(tick, 150);\n}\n\nfunction start() {\n  clearTimeout(timer);    // never run two loops at once\n  newGame();\n  message('');\n  draw();\n  tick();\n}\n\nfunction gameOver() {\n  if (score > best) {\n    best = score;\n    try { localStorage.setItem('snake-best', best); } catch {}\n  }\n  showScore();\n  message(`Game over! You scored ${score}. Press Start or space to play again.`);\n}\n\nfunction message(text) {\n  document.getElementById('message').textContent = text;\n}",
    "controls": "// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.\nconst KEYS = {\n  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',\n  w: 'up', s: 'down', a: 'left', d: 'right',\n};\n\nfunction turn(name) {\n  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued\n  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself\n  queue.push(name);\n}\n\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === ' ' && (over || !timer)) {   // space starts a game when none is running\n    e.preventDefault();\n    return start();\n  }\n  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];\n  if (!name) return;\n  e.preventDefault();     // stop the arrow keys from scrolling the page\n  turn(name);\n});"
   }
  },
  {
   "title": "Speed levels that get faster as you score",
   "body": "A constant 150 ms gets boring once you're good. Two improvements:\n\n1. **Levels.** A Speed menu with Slow, Normal and Fast, each a different delay between moves.\n2. **Speeding up.** Every 5 points, the delay drops by 5 ms, so a long game gets tense. A minimum (45 ms) stops it from becoming impossible.\n\nPutting the numbers in an object (`SPEEDS`) instead of scattering them through the code means you can tune the game in one place. The math lives in a small function:\n\n```js\nMath.max(45, base - Math.floor(score / 5) * 5)\n```\n\nRead it from the inside out: `Math.floor(score / 5)` is how many groups of 5 points you have (12 points → 2), times 5 ms each, taken off the base speed, but never below 45.\n\n### What to write\n\n1. A `<select id=\"speed\">` in the controls with three `<option>`s: `slow`, `normal` (selected) and `fast`.\n2. A `SPEEDS` object and a `tickMs()` function that reads the menu and applies the formula.\n3. Use `setTimeout(tick, tickMs())` in `tick()`, so every move uses the current speed.\n\n> Tip: try changing Speed in the middle of a game. Because `tickMs()` reads the menu every tick, it changes instantly.",
   "checks": [
    {
     "pane": "html",
     "label": "a speed menu with id \"speed\"",
     "test": "/<select[^>]*id=[\"']speed[\"']/"
    },
    {
     "pane": "html",
     "label": "slow, normal and fast options",
     "test": "/value=[\"']slow[\"'][\\s\\S]*value=[\"']normal[\"'][\\s\\S]*value=[\"']fast[\"']/"
    },
    {
     "pane": "js",
     "label": "a SPEEDS object",
     "test": "/const\\s+SPEEDS\\s*=/"
    },
    {
     "pane": "js",
     "label": "a tickMs() function with a minimum speed",
     "test": "/function\\s+tickMs\\s*\\([\\s\\S]*Math\\.max\\(/"
    },
    {
     "pane": "js",
     "label": "tick() uses tickMs()",
     "test": "/setTimeout\\(\\s*tick\\s*,\\s*tickMs\\(\\)\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "With a base delay of 150 ms and a score of 12, what is `Math.max(45, 150 - Math.floor(12 / 5) * 5)`?",
     "options": [
      "90",
      "140",
      "45"
     ],
     "answer": 1,
     "why": "`Math.floor(12 / 5)` is 2 groups of 5 points, `2 * 5` is 10 ms, and `150 - 10` is 140, which is above the 45 ms minimum."
    },
    {
     "q": "Why keep the speeds in one `SPEEDS` object?",
     "options": [
      "Objects run faster than numbers",
      "All the numbers you'd tune live in one place",
      "The `<select>` needs an object"
     ],
     "answer": 1,
     "why": "Tuning the game means changing one object instead of hunting through the code."
    }
   ],
   "session": 2,
   "minutes": 12,
   "html": {
    "page": "<header class=\"bar\">\n  <h1>Snake</h1>\n  <p>Score <strong id=\"score\">0</strong> · Best <strong id=\"best\">0</strong></p>\n</header>\n\n<main>\n  <canvas id=\"board\" width=\"400\" height=\"400\"></canvas>\n  <p id=\"message\" class=\"message\">Press Start or the space bar</p>\n  <div class=\"controls\">\n    <button id=\"start\">Start</button>\n    <label>Speed\n      <select id=\"speed\">\n        <option value=\"slow\">Slow</option>\n        <option value=\"normal\" selected>Normal</option>\n        <option value=\"fast\">Fast</option>\n      </select>\n    </label>\n  </div>\n</main>"
   },
   "js": {
    "loop": "// Milliseconds between moves for each level\nconst SPEEDS = { slow: 170, normal: 120, fast: 80 };\n\n// The snake gets 5 ms faster every 5 points, but never faster than 45 ms\nfunction tickMs() {\n  const base = SPEEDS[document.getElementById('speed').value] ?? SPEEDS.normal;\n  return Math.max(45, base - Math.floor(score / 5) * 5);\n}\n\n// The game loop: move, draw, and wait a moment before the next move.\nfunction tick() {\n  const result = step();\n  draw();\n  if (result === 'crash') return gameOver();\n  if (result === 'win') return message('You filled the whole board. Amazing!');\n  timer = setTimeout(tick, tickMs());\n}\n\nfunction start() {\n  clearTimeout(timer);    // never run two loops at once\n  newGame();\n  message('');\n  draw();\n  tick();\n}\n\nfunction gameOver() {\n  if (score > best) {\n    best = score;\n    try { localStorage.setItem('snake-best', best); } catch {}\n  }\n  showScore();\n  message(`Game over! You scored ${score}. Press Start or space to play again.`);\n}\n\nfunction message(text) {\n  document.getElementById('message').textContent = text;\n}"
   }
  },
  {
   "title": "Swipe controls for phones",
   "body": "Phones don't have arrow keys, so let's read swipes. A swipe is just two touch events: `touchstart` (finger down) and `touchend` (finger up). Compare where the finger started and where it ended:\n\n- `dx` = how far it moved sideways, `dy` = how far up or down\n- whichever is bigger tells you the direction: a mostly sideways swipe is left or right\n- the sign tells you which way: positive `dx` is right, positive `dy` is down\n\nA tiny movement is a tap, not a swipe, so ignore anything shorter than about 20 pixels.\n\n### Reusing what we built\n\nHere's the payoff for writing `turn(name)` as its own function in step 6: swipes call the exact same `turn()`, so they automatically get the no-reversing rule and the turn queue. No duplicated logic.\n\n> Tip: `{ passive: true }` on `touchstart` tells the browser we won't block scrolling from that listener, which keeps touch handling smooth. The `touch-action: none` CSS from step 1 is what stops the page from scrolling during a swipe.\n\n### What to write\n\n1. A `touchStart` variable to remember where the finger went down.\n2. A `touchstart` listener on the canvas that saves `e.touches[0].clientX` and `clientY`.\n3. A `touchend` listener that reads `e.changedTouches[0]`, works out `dx` and `dy`, ignores short ones, and calls `turn()`.\n\nYou can test this with your browser's developer tools: most have a \"device toolbar\" that simulates a phone and turns mouse drags into touches.",
   "checks": [
    {
     "pane": "js",
     "label": "a touchstart listener on the canvas",
     "test": "/canvas\\.addEventListener\\(\\s*['\"]touchstart['\"]/"
    },
    {
     "pane": "js",
     "label": "a touchend listener on the canvas",
     "test": "/canvas\\.addEventListener\\(\\s*['\"]touchend['\"]/"
    },
    {
     "pane": "js",
     "label": "compares sideways and up/down movement",
     "test": "/Math\\.abs\\(\\s*dx\\s*\\)\\s*>\\s*Math\\.abs\\(\\s*dy\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "swipes use the same turn() function",
     "test": "/touchend[\\s\\S]*turn\\(/"
    }
   ],
   "quiz": [
    {
     "q": "A finger moves 80 pixels right and 15 pixels up. Which way does the snake turn?",
     "options": [
      "Up",
      "Right",
      "Nothing, it's a tap"
     ],
     "answer": 1,
     "why": "The sideways movement (`dx` = 80) is bigger than the vertical one (`dy` = -15), and it's positive, so it's a right swipe."
    },
    {
     "q": "Why do swipes call the same `turn()` function as the keys?",
     "options": [
      "Swipes can't change variables directly",
      "They get the no-reversing rule and the turn queue for free, with no duplicated code",
      "`turn()` is the only function that can read touches"
     ],
     "answer": 1,
     "why": "Writing `turn(name)` once means every input (keys, swipes) follows the same rules."
    }
   ],
   "session": 2,
   "minutes": 15,
   "js": {
    "controls": "// Arrow keys and WASD. A turn is queued, so two quick presses between moves both count.\nconst KEYS = {\n  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',\n  w: 'up', s: 'down', a: 'left', d: 'right',\n};\n\nfunction turn(name) {\n  const last = queue.at(-1) ?? direction;    // where we'll be facing after the turns already queued\n  if (name === last || name === OPPOSITE[last] || queue.length >= 2) return;   // no reversing into yourself\n  queue.push(name);\n}\n\ndocument.addEventListener('keydown', (e) => {\n  if (e.key === ' ' && (over || !timer)) {   // space starts a game when none is running\n    e.preventDefault();\n    return start();\n  }\n  const name = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];\n  if (!name) return;\n  e.preventDefault();     // stop the arrow keys from scrolling the page\n  turn(name);\n});\n\n// Swipes on a phone: compare where the finger went down with where it came up.\nlet touchStart = null;\n\ncanvas.addEventListener('touchstart', (e) => {\n  const t = e.touches[0];\n  touchStart = { x: t.clientX, y: t.clientY };\n}, { passive: true });\n\ncanvas.addEventListener('touchend', (e) => {\n  if (!touchStart) return;\n  const t = e.changedTouches[0];\n  const dx = t.clientX - touchStart.x;\n  const dy = t.clientY - touchStart.y;\n  touchStart = null;\n  if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;   // a tap, not a swipe\n  if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 'right' : 'left');\n  else turn(dy > 0 ? 'down' : 'up');\n});"
   }
  },
  {
   "title": "A no-walls mode where the board wraps around",
   "body": "The last feature: a mode with no walls, where leaving one edge brings you back on the opposite side (like Pac-Man's tunnel).\n\n### The modulo trick\n\n```svg Wrapping around: (x + SIZE) % SIZE takes column -1 to column 19\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 100\" width=\"420\" height=\"100\" font-family=\"system-ui, sans-serif\" font-size=\"12\"><defs><marker id=\"w\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto\"><path d=\"M0 0L10 5L0 10z\" fill=\"#2563eb\"/></marker></defs><path d=\"M30 38 C 30 5, 185 5, 185 36\" fill=\"none\" stroke=\"#2563eb\" stroke-width=\"2\" marker-end=\"url(#w)\"/><rect x=\"20\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#22c55e\" stroke=\"#94a3b8\"/><text x=\"34\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">0</text><rect x=\"50\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"64\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">1</text><rect x=\"80\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"94\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">2</text><rect x=\"110\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"124\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">…</text><rect x=\"140\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"154\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">18</text><rect x=\"170\" y=\"40\" width=\"28\" height=\"28\" rx=\"4\" fill=\"#eef2f8\" stroke=\"#94a3b8\"/><text x=\"184\" y=\"88\" text-anchor=\"middle\" fill=\"#55607a\">19</text><text x=\"215\" y=\"50\" fill=\"#334155\">going left from column 0:</text><text x=\"215\" y=\"68\" font-family=\"monospace\">(-1 + 20) % 20 = 19</text></svg>\n```\n\nThe `%` operator gives the remainder after dividing. On a 20-cell board:\n\n- going right from column 19 gives column 20, and `20 % 20` is `0`: back on the left edge\n- going left from column 0 gives column -1. In JavaScript `-1 % 20` is `-1` (not 19!), so we add `SIZE` first: `(-1 + 20) % 20` is `19`\n\nSo one formula handles both edges: `(x + SIZE) % SIZE`. Do the same for `y`.\n\n### What to write\n\n1. A checkbox in the controls: `<label><input type=\"checkbox\" id=\"walls\" checked> Walls</label>`.\n2. A `walls` variable that `newGame()` reads from the checkbox.\n3. In `step()`, when walls are off, wrap the new head with the modulo formula, and only count `hitWall` when walls are on.\n\nNotice how little changed: one new variable and two lines in `step()`. That's the benefit of having all the rules in one place.",
   "checks": [
    {
     "pane": "html",
     "label": "a walls checkbox with id \"walls\"",
     "test": "/<input[^>]*type=[\"']checkbox[\"'][^>]*id=[\"']walls[\"']|<input[^>]*id=[\"']walls[\"'][^>]*type=[\"']checkbox[\"']/"
    },
    {
     "pane": "js",
     "label": "newGame() reads the checkbox",
     "test": "/walls\\s*=\\s*document\\.getElementById\\(\\s*['\"]walls['\"]\\s*\\)\\.checked/"
    },
    {
     "pane": "js",
     "label": "wrapping with (x + SIZE) % SIZE",
     "test": "/\\(\\s*head\\.x\\s*\\+\\s*SIZE\\s*\\)\\s*%\\s*SIZE/"
    },
    {
     "pane": "js",
     "label": "walls only count when they're on",
     "test": "/hitWall\\s*=\\s*walls\\s*&&/"
    }
   ],
   "quiz": [
    {
     "q": "On a 20-cell board in no-walls mode, the head goes left from column 0. What is `(-1 + 20) % 20`?",
     "options": [
      "-1",
      "0",
      "19"
     ],
     "answer": 2,
     "why": "Adding `SIZE` first keeps the number positive, so -1 wraps to column 19 on the right edge."
    },
    {
     "q": "Why add `SIZE` before taking the remainder?",
     "options": [
      "In JavaScript `-1 % 20` is `-1`, not 19",
      "It makes the board bigger",
      "Modulo only works on numbers over 20"
     ],
     "answer": 0,
     "why": "JavaScript keeps the sign in `%`, so `(x + SIZE) % SIZE` handles both edges with one formula."
    }
   ],
   "session": 2,
   "minutes": 15,
   "html": {
    "page": "<header class=\"bar\">\n  <h1>Snake</h1>\n  <p>Score <strong id=\"score\">0</strong> · Best <strong id=\"best\">0</strong></p>\n</header>\n\n<main>\n  <canvas id=\"board\" width=\"400\" height=\"400\"></canvas>\n  <p id=\"message\" class=\"message\">Press Start or the space bar</p>\n  <div class=\"controls\">\n    <button id=\"start\">Start</button>\n    <label>Speed\n      <select id=\"speed\">\n        <option value=\"slow\">Slow</option>\n        <option value=\"normal\" selected>Normal</option>\n        <option value=\"fast\">Fast</option>\n      </select>\n    </label>\n    <label><input type=\"checkbox\" id=\"walls\" checked> Walls</label>\n  </div>\n</main>"
   },
   "js": {
    "state": "let snake, direction, queue, food, score, over, walls, timer;\n\n// The best score is kept in the browser. Storage can be blocked (private windows, and this editor's\n// sandboxed preview), so every use is wrapped in try/catch and the game works either way.\nlet best = 0;\ntry { best = Number(localStorage.getItem('snake-best')) || 0; } catch {}\n\n// Everything a new game needs, so Start always begins from the same place\nfunction newGame() {\n  const mid = Math.floor(SIZE / 2);\n  snake = [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }];\n  direction = 'right';\n  queue = [];             // turns pressed since the last move\n  score = 0;\n  over = false;\n  walls = document.getElementById('walls').checked;\n  food = placeFood();\n  showScore();\n}",
    "rules": "// Move the snake one cell. Returns what happened: 'move', 'eat', 'crash' or 'win'.\nfunction step() {\n  if (queue.length) direction = queue.shift();\n  const d = DIRECTIONS[direction];\n  let head = { x: snake[0].x + d.x, y: snake[0].y + d.y };\n  if (!walls) head = { x: (head.x + SIZE) % SIZE, y: (head.y + SIZE) % SIZE };   // wrap around the edges\n  const eating = food && head.x === food.x && head.y === food.y;\n\n  // The tail moves out of the way this turn (unless we're growing), so it doesn't count as a hit\n  const body = eating ? snake : snake.slice(0, -1);\n  const hitWall = walls && (head.x < 0 || head.y < 0 || head.x >= SIZE || head.y >= SIZE);\n  const hitSelf = body.some((c) => c.x === head.x && c.y === head.y);\n  if (hitWall || hitSelf) {\n    over = true;\n    return 'crash';\n  }\n\n  snake.unshift(head);\n  if (!eating) {\n    snake.pop();\n    return 'move';\n  }\n  score += 1;             // grow: we kept the tail this time\n  showScore();\n  food = placeFood();\n  if (!food) {            // no empty cell left: you filled the board\n    over = true;\n    return 'win';\n  }\n  return 'eat';\n}"
   }
  },
  {
   "title": "How the real project is organized",
   "body": "You've built the whole game in one JavaScript pane, and it works. My real [Snake repository](https://github.com/TheoYanvno/snake-game) has the same features, organized for a bigger project. This step is read-only: no code to write, just how and why it's different.\n\n### 1. The rules live in their own file, with no DOM code\n\n`src/game.js` has `createGame()`, `turn()`, `step()` and `placeFood()`, but it never touches the page or the canvas. Instead of global variables, everything about one game is in a single object:\n\n```js\nexport function createGame({ width = 20, height = 20, rand = Math.random, walls = true } = {}) {\n  // ...\n  return { width, height, snake, direction: 'right', queue: [], food: null, score: 0, over: false, walls, rand };\n}\n\nstep(game);   // the function gets the game passed in instead of reading globals\n```\n\n`src/app.js` does the drawing, keys, swipes and buttons, and calls those functions. This split means the rules can run **outside a browser**, which makes the next part possible.\n\n### 2. The rules are tested automatically\n\n`test/game.test.js` uses Node's built-in test runner (`node --test`) to check 13 rules, including the tail edge case from step 8:\n\n```js\ntest('moving into the cell the tail is leaving is allowed', () => {\n  const g = createGame({ width: 10, height: 10 });\n  g.snake = [{ x: 5, y: 5 }, { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 5, y: 6 }];\n  g.direction = 'down';\n  g.food = { x: 0, y: 0 };\n  assert.equal(step(g), 'move');\n});\n```\n\nBecause the game is a plain object, a test can set up any situation directly (here, a snake curled into a square) instead of playing until it happens.\n\nThe food position is normally random, and random tests are flaky. So `createGame()` takes a `rand` option, and the tests pass a fake one that always returns the same number: `const fixed = (n) => () => n;`. Every run is identical. Handing a function the things it depends on, instead of letting it reach for `Math.random()` itself, is called **dependency injection**.\n\n### 3. Small polish you can add yourself\n\n- The canvas is drawn at the screen's real pixel density (`devicePixelRatio`) so it stays sharp on phones.\n- The game pauses when you switch to another tab (the `visibilitychange` event).\n- The best score is saved separately for each speed level, with walls on and off, and the Speed menu is locked during a game so a best score can't be set on Slow and kept on Fast.",
   "quiz": [
    {
     "q": "Why does the real project keep the rules in `src/game.js` with no DOM code?",
     "options": [
      "Files with DOM code are slower",
      "The rules can run outside a browser, so they can be tested automatically",
      "GitHub Pages requires it"
     ],
     "answer": 1,
     "why": "With no page or canvas code, Node's test runner can run the rules directly."
    },
    {
     "q": "Why does `createGame()` take a `rand` option?",
     "options": [
      "To make food appear faster",
      "Tests can pass a fake random function, so every run is the same",
      "So players can pick the food's color"
     ],
     "answer": 1,
     "why": "Random tests are flaky. A fixed `rand` makes the food land in the same place on every run."
    }
   ],
   "session": 3,
   "minutes": 10,
   "kind": "read"
  }
 ],
 "finish": "### What you learned\n\n- Drawing on a `<canvas>` with a 2D context, in cells instead of pixels\n- Keeping **data** (the snake array) separate from **drawing** (the `draw()` function)\n- Moving by adding a head and removing the tail, and growing by skipping the removal\n- A game loop with `setTimeout`, and why `start()` clears the old timer\n- Keyboard and swipe input that share one `turn()` function\n- Random placement with a `Set` of taken cells\n- Edge cases (the tail), return values that tell the loop what happened, and `try/catch` around storage\n- How a real project splits rules from the page so the rules can be tested\n\n### Challenges\n\n1. **Pause:** make the P key pause and resume (hint: `clearTimeout(timer)` to pause, `tick()` to resume).\n2. **Obstacles:** add a few rock cells that end the game when hit. Where would you check for them?\n3. **Golden food:** every fifth food is gold and worth 3 points.\n4. **Two players:** a second snake controlled with W/A/S/D while the first uses the arrows.\n\nCompare your finished game with the [live version](https://theoyanvno.github.io/snake-game/) and the [source code](https://github.com/TheoYanvno/snake-game)."
};
