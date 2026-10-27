// Built from guides/chess.md by scripts/build-guides.js. Edit the guide, not this file.
export default {
 "id": "chess",
 "title": "Chess Coach",
 "goals": [
  "Store a chess position as data and read it from FEN",
  "Generate every legal move, including check, castling, en passant and promotion",
  "Score a position with piece values and piece-square tables",
  "Search ahead with negamax and alpha-beta pruning",
  "Grade a player's move by comparing it with the best move",
  "Explain mistakes in plain language and sum up a game"
 ],
 "prereqs": [
  "JavaScript functions, arrays, objects and arrow functions",
  "Recursion (a function that calls itself) helps",
  "Knowing how the chess pieces move"
 ],
 "sessions": [
  {
   "title": "A board you can click",
   "from": 0,
   "to": 2
  },
  {
   "title": "The rules of chess",
   "from": 3,
   "to": 6
  },
  {
   "title": "A computer opponent",
   "from": 7,
   "to": 9
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
   "board": "",
   "moves": "",
   "rules": "",
   "ai": "",
   "coach": "",
   "ui": "",
   "go": ""
  }
 },
 "steps": [
  {
   "title": "A position as data, drawn as a board",
   "body": "Welcome! In this guide you'll rebuild my [Chess Coach](https://theoyanvno.github.io/chess-coach/) from a blank page: a chess game with every rule, a computer opponent that looks ahead, and a coach that grades each of your moves (\"Blunder: your queen on h5 can be taken by the knight on f6\") and writes a report at the end.\n\nIt starts the same way as every board game: **the position is data, and the page just draws it.** A chess position is an object:\n\n| Field | Example | Meaning |\n|---|---|---|\n| `board` | 64 items | `'P'`, `'n'`, … or `null`; uppercase is white |\n| `turn` | `'w'` | whose move it is |\n| `castling` | `'KQkq'` | who can still castle, and on which side |\n| `ep` | `-1` | the en passant square, if a pawn just jumped two |\n| `halfmove`, `fullmove` | `0`, `1` | counters for the fifty-move rule and move numbers |\n\nChess players write positions as **FEN**, one line of text. The start position is `rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1`: the pieces rank by rank from the top, with digits for runs of empty squares, then the other fields. `fromFen()` reads it: it splits on spaces, then walks the piece letters, pushing `null` for each empty square.\n\n```svg Square numbers: 0 is a8 in the top left, 63 is h1 in the bottom right\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 270\" font-family=\"sans-serif\"><rect x=\"20\" y=\"10\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><text x=\"35\" y=\"29\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">0</text><rect x=\"50\" y=\"10\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"80\" y=\"10\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"110\" y=\"10\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"140\" y=\"10\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"170\" y=\"10\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"200\" y=\"10\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"230\" y=\"10\" width=\"30\" height=\"30\" fill=\"#b08458\"/><text x=\"245\" y=\"29\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">7</text><rect x=\"20\" y=\"40\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"50\" y=\"40\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"80\" y=\"40\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"110\" y=\"40\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"40\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"170\" y=\"40\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"200\" y=\"40\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"230\" y=\"40\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"20\" y=\"70\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"50\" y=\"70\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"80\" y=\"70\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"110\" y=\"70\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"140\" y=\"70\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"170\" y=\"70\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"200\" y=\"70\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"230\" y=\"70\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"20\" y=\"100\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"50\" y=\"100\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"80\" y=\"100\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"110\" y=\"100\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><text x=\"125\" y=\"119\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">27</text><rect x=\"140\" y=\"100\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"170\" y=\"100\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"200\" y=\"100\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"230\" y=\"100\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"20\" y=\"130\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"50\" y=\"130\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"80\" y=\"130\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"110\" y=\"130\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"140\" y=\"130\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><text x=\"155\" y=\"149\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">36</text><rect x=\"170\" y=\"130\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"200\" y=\"130\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"230\" y=\"130\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"20\" y=\"160\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"50\" y=\"160\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"80\" y=\"160\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"110\" y=\"160\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"160\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"170\" y=\"160\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"200\" y=\"160\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"230\" y=\"160\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"20\" y=\"190\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"50\" y=\"190\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"80\" y=\"190\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"110\" y=\"190\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"140\" y=\"190\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"170\" y=\"190\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"200\" y=\"190\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"230\" y=\"190\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"20\" y=\"220\" width=\"30\" height=\"30\" fill=\"#b08458\"/><text x=\"35\" y=\"239\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">56</text><rect x=\"50\" y=\"220\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"80\" y=\"220\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"110\" y=\"220\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"220\" width=\"30\" height=\"30\" fill=\"#b08458\"/><rect x=\"170\" y=\"220\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><rect x=\"200\" y=\"220\" width=\"30\" height=\"30\" fill=\"#b08458\"/><text x=\"215\" y=\"239\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">62</text><rect x=\"230\" y=\"220\" width=\"30\" height=\"30\" fill=\"#eeddb8\"/><text x=\"245\" y=\"239\" text-anchor=\"middle\" font-size=\"11\" fill=\"#1c2430\">63</text><text x=\"35\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">a</text><text x=\"65\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">b</text><text x=\"95\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">c</text><text x=\"125\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">d</text><text x=\"155\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">e</text><text x=\"185\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">f</text><text x=\"215\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">g</text><text x=\"245\" y=\"264\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">h</text><text x=\"10\" y=\"29\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">8</text><text x=\"10\" y=\"59\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">7</text><text x=\"10\" y=\"89\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">6</text><text x=\"10\" y=\"119\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">5</text><text x=\"10\" y=\"149\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">4</text><text x=\"10\" y=\"179\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">3</text><text x=\"10\" y=\"209\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">2</text><text x=\"10\" y=\"239\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">1</text><text x=\"270\" y=\"40\" font-size=\"12\" fill=\"#1c2430\">0 = a8 (top left)</text><text x=\"270\" y=\"60\" font-size=\"12\" fill=\"#1c2430\">7 = h8</text><text x=\"270\" y=\"80\" font-size=\"12\" fill=\"#1c2430\">56 = a1, 63 = h1</text><text x=\"270\" y=\"110\" font-size=\"12\" fill=\"#475569\">row = Math.floor(i / 8)</text><text x=\"270\" y=\"128\" font-size=\"12\" fill=\"#475569\">column = i % 8</text><text x=\"270\" y=\"158\" font-size=\"12\" fill=\"#475569\">one row down = i + 8</text><text x=\"270\" y=\"176\" font-size=\"12\" fill=\"#475569\">white pawns move i - 8</text></svg>\n```\n\n### What to write\n\n- **HTML:** the header with a status line, `<div id=\"board\">`, and the side panel you'll use later (level menu, Hint, New game, the coach feed and a report box).\n- **CSS:** `.board` is a CSS Grid with `repeat(8, 1fr)` and `aspect-ratio: 1`, so it stays square at any width. Light and dark squares get their colors; extra classes (`sel`, `target`, `check`, `hint`) are ready for later steps.\n- **JavaScript:** `fromFen()`, and a `render()` that runs a loop over the 64 squares, makes a `<button>` for each (so it can be clicked and reached with the keyboard), colors it light or dark, and puts in the piece from `GLYPH`.\n\nThe pieces are Unicode chess symbols (♚ ♛ ♜ ♝ ♞ ♟). Using the solid shapes for both sides and coloring them with CSS (`.piece.w` is white with a dark outline) keeps them looking the same on every system.",
   "checks": [
    {
     "pane": "html",
     "label": "the board element",
     "test": "/id=[\"']board[\"']/",
     "hint": "Add <div id=\"board\" class=\"board\"></div>"
    },
    {
     "pane": "css",
     "label": "an 8-column grid",
     "test": "/\\.board\\s*\\{[^}]*grid-template-columns:\\s*repeat\\(\\s*8/",
     "hint": "Give .board grid-template-columns: repeat(8, 1fr)"
    },
    {
     "pane": "js",
     "label": "a fromFen() function",
     "test": "/function\\s+fromFen\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "render() draws all 64 squares",
     "test": "/for\\s*\\(\\s*let\\s+i\\s*=\\s*0\\s*;\\s*i\\s*<\\s*64/"
    },
    {
     "pane": "js",
     "label": "piece symbols",
     "test": "/const\\s+GLYPH\\s*=/"
    }
   ],
   "quiz": [
    {
     "q": "In the FEN \"4k3/8/…\", what does the 4 mean?",
     "options": [
      "Four empty squares, then the black king",
      "The king is on the 4th rank",
      "Four black kings"
     ],
     "answer": 0,
     "why": "Digits stand for runs of empty squares, so the top rank is four empties, the king (k), then three empties."
    },
    {
     "q": "Why keep the position as data instead of reading it back from the page?",
     "options": [
      "Reading the page is not allowed",
      "The computer will try thousands of positions that are never drawn, so the rules must work on plain data",
      "Data uses fewer colors"
     ],
     "answer": 1,
     "why": "The search in session 3 plays out moves on copies of the data; the page only ever shows the real game."
    }
   ],
   "session": 0,
   "minutes": 15,
   "html": {
    "page": "<header>\n  <h1>Chess Coach</h1>\n  <p id=\"status\" class=\"status\" role=\"status\"></p>\n</header>\n\n<main>\n  <div id=\"board\" class=\"board\" aria-label=\"Chess board\"></div>\n  <aside>\n    <div class=\"controls\">\n      <label>Opponent\n        <select id=\"level\">\n          <option value=\"easy\">Easy</option>\n          <option value=\"medium\" selected>Medium</option>\n          <option value=\"hard\">Hard</option>\n        </select>\n      </label>\n      <button id=\"hint\">💡 Hint</button>\n      <button id=\"new\">New game</button>\n    </div>\n    <h2>Coach</h2>\n    <ol id=\"feed\" class=\"feed\"></ol>\n    <div id=\"report\" class=\"report\" hidden></div>\n  </aside>\n</main>"
   },
   "css": {
    "base": "body { margin: 0; font-family: system-ui, sans-serif; background: #f4f1ea; color: #1c2430; }\nheader { text-align: center; }\nheader h1 { margin: 14px 0 4px; }\n.status { margin: 0 0 10px; color: #4b5563; min-height: 1.4em; }\nmain { display: flex; flex-wrap: wrap; gap: 18px; justify-content: center; padding: 0 12px 20px; }\n[hidden] { display: none !important; }\n\n/* 8 equal columns; aspect-ratio keeps the board square on any screen */\n.board {\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  width: min(92vw, 400px);\n  aspect-ratio: 1;\n  border: 3px solid #3b2f22;\n}\n.sq { position: relative; border: 0; padding: 0; display: grid; place-items: center; font-size: clamp(22px, 8vw, 38px); cursor: pointer; }\n.sq.light { background: #eeddb8; }\n.sq.dark { background: #b08458; }\n.sq.last { box-shadow: inset 0 0 0 100px rgba(250, 220, 60, 0.35); }\n.sq.sel { box-shadow: inset 0 0 0 3px #1d4ed8; }\n.sq.target::after { content: ''; position: absolute; width: 26%; height: 26%; border-radius: 50%; background: rgba(29, 78, 216, 0.45); }\n.sq.capture { box-shadow: inset 0 0 0 4px rgba(185, 28, 28, 0.7); }\n.sq.check { background: #f87171; }\n.sq.hint { box-shadow: inset 0 0 0 4px #16a34a; }\n.piece { line-height: 1; pointer-events: none; }\n.piece.w { color: #fff; text-shadow: 0 0 2px #000, 0 0 1px #000; }\n.piece.b { color: #111; }\n\naside { width: min(92vw, 340px); }\naside h2 { font-size: 1rem; margin: 6px 0; }\n.controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }\nbutton, select { font: inherit; padding: 6px 10px; border-radius: 8px; border: 1px solid #1c2430; background: #fff; cursor: pointer; }\n.feed { list-style: none; padding: 0; margin: 0; max-height: 340px; overflow: auto; }\n.note { background: #fff; border-left: 4px solid #94a3b8; border-radius: 6px; padding: 6px 10px; margin-bottom: 8px; }\n.note p { margin: 4px 0; font-size: 14px; }\n.note.great { border-color: #16a34a; }\n.note.good { border-color: #65a30d; }\n.note.warn { border-color: #d97706; }\n.note.bad { border-color: #b91c1c; }\n.note.tip { border-color: #1d4ed8; }\n.report { background: #fff; border-radius: 8px; padding: 8px 12px; margin-top: 10px; }"
   },
   "js": {
    "board": "// Squares are numbered 0-63 row by row from the top: 0 = a8, 7 = h8, 56 = a1, 63 = h1.\n// Pieces are letters: uppercase = white (P N B R Q K), lowercase = black, null = empty.\nconst FILES = 'abcdefgh';\nconst sqName = (i) => FILES[i % 8] + (8 - Math.floor(i / 8));\nconst colorOf = (p) => (p ? (p === p.toUpperCase() ? 'w' : 'b') : null);\nconst START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';\n\n// FEN describes a whole position in one line: the pieces rank by rank, whose turn it is,\n// castling rights, the en passant square and two move counters.\nfunction fromFen(fen) {\n  const [placement, turn, castling, ep, half, full] = fen.trim().split(/\\s+/);\n  const board = [];\n  for (const ch of placement.replace(/\\//g, '')) {\n    if (/\\d/.test(ch)) for (let k = 0; k < Number(ch); k++) board.push(null);   // a digit = that many empty squares\n    else board.push(ch);\n  }\n  return {\n    board,\n    turn,\n    castling: castling === '-' ? '' : castling,\n    ep: ep === '-' ? -1 : FILES.indexOf(ep[0]) + (8 - Number(ep[1])) * 8,\n    halfmove: Number(half ?? 0),\n    fullmove: Number(full ?? 1),\n  };\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;\n}\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  render();\n};",
    "go": "render();"
   }
  },
  {
   "title": "Moving around the board with step()",
   "body": "Every piece's movement is \"go this many columns and rows\". With squares numbered 0-63, it's tempting to just add numbers (one square right is `+1`, one row down is `+8`). But that breaks at the edges: `+1` from h8 (square 7) lands on a7 (square 8), on the other side of the board.\n\n`step(i, df, dr)` does it safely. It turns the square into a column (`i % 8`) and row (`Math.floor(i / 8)`), adds the steps, and returns **-1** if the result is off the board. Every move generator from here on uses it, so no piece can ever wrap around an edge.\n\nThen each piece's movement is just a list of steps:\n\n| List | Steps | Used by |\n|---|---|---|\n| `KNIGHT` | 8 L-shapes like `[1, 2]` | knights |\n| `KING` | the 8 neighbors | kings |\n| `ROOK_DIRS` | right, left, down, up | rooks and queens |\n| `BISHOP_DIRS` | the 4 diagonals | bishops and queens |\n\nRemember the rows count **down** from the top (row 0 is rank 8), so for white \"forward\" is `dr = -1`.\n\n### Try it\n\nThe `go` block logs where a knight on g1 (square 62) can jump. Open the console: you should see e2, f3 and h3. The other five L-shapes fall off the board and come back as -1, which the `filter` removes.",
   "checks": [
    {
     "pane": "js",
     "label": "a step() helper",
     "test": "/function\\s+step\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "off the board returns -1",
     "test": "/\\?\\s*-1\\s*:/",
     "hint": "return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f;"
    },
    {
     "pane": "js",
     "label": "the knight's jumps",
     "test": "/const\\s+KNIGHT\\s*=/"
    },
    {
     "pane": "js",
     "label": "the rook's directions",
     "test": "/const\\s+ROOK_DIRS\\s*=/"
    }
   ],
   "quiz": [
    {
     "q": "Why not move one square right by just adding 1 to the square number?",
     "options": [
      "Adding is slow",
      "From the h-file it would wrap around to the a-file on the next row",
      "Square numbers can't be added"
     ],
     "answer": 1,
     "why": "h8 + 1 is a7. step() works in columns and rows, so it can tell the move went off the edge."
    },
    {
     "q": "Rows count down from the top. Which dr moves a white pawn forward?",
     "options": [
      "dr = 1",
      "dr = -1",
      "dr = 8"
     ],
     "answer": 1,
     "why": "White starts at the bottom (rows 6-7) and moves toward row 0, so each step forward is one row up: -1."
    }
   ],
   "session": 0,
   "minutes": 10,
   "js": {
    "board": "// Squares are numbered 0-63 row by row from the top: 0 = a8, 7 = h8, 56 = a1, 63 = h1.\n// Pieces are letters: uppercase = white (P N B R Q K), lowercase = black, null = empty.\nconst FILES = 'abcdefgh';\nconst sqName = (i) => FILES[i % 8] + (8 - Math.floor(i / 8));\nconst colorOf = (p) => (p ? (p === p.toUpperCase() ? 'w' : 'b') : null);\nconst START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';\n\n// FEN describes a whole position in one line: the pieces rank by rank, whose turn it is,\n// castling rights, the en passant square and two move counters.\nfunction fromFen(fen) {\n  const [placement, turn, castling, ep, half, full] = fen.trim().split(/\\s+/);\n  const board = [];\n  for (const ch of placement.replace(/\\//g, '')) {\n    if (/\\d/.test(ch)) for (let k = 0; k < Number(ch); k++) board.push(null);   // a digit = that many empty squares\n    else board.push(ch);\n  }\n  return {\n    board,\n    turn,\n    castling: castling === '-' ? '' : castling,\n    ep: ep === '-' ? -1 : FILES.indexOf(ep[0]) + (8 - Number(ep[1])) * 8,\n    halfmove: Number(half ?? 0),\n    fullmove: Number(full ?? 1),\n  };\n}\n\nconst fileOf = (i) => i % 8;\nconst rankOf = (i) => Math.floor(i / 8);   // the board row: 0 is rank 8 at the top\n\n// One step from square i: df columns to the right, dr rows down. -1 means \"off the board\".\nfunction step(i, df, dr) {\n  const f = fileOf(i) + df;\n  const r = rankOf(i) + dr;\n  return f < 0 || f > 7 || r < 0 || r > 7 ? -1 : r * 8 + f;\n}\n\nconst KNIGHT = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];\nconst KING = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];\nconst ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];\nconst BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];",
    "go": "render();\n// Try it: where can the knight on g1 (square 62) jump?\nconsole.log('A knight on g1 can jump to', KNIGHT.map(([df, dr]) => step(62, df, dr)).filter((i) => i >= 0).map(sqName).join(', '));"
   }
  },
  {
   "title": "Click a piece, click a square",
   "body": "Now make it playable, without rules for the moment. The first click picks up one of your pieces (`selected`), the second click moves it. If you click another of your own pieces instead, that one is picked up instead.\n\nThe important function is **`makeMove(s, m)`**: it returns a **new** state with the move made, and never changes the old one. It copies the board with `s.board.slice()`, moves the piece, and flips the turn. That might seem fussy now, but it's what makes the computer opponent possible: it will try thousands of moves on copies, and the real game is never touched.\n\nA move is an object too: `{ from, to, piece, captured }`, with more fields to come (`promotion`, `castle`, `enPassant`, `double`).\n\n### What to write\n\n- `movesFrom(i)`: for now, every square that doesn't hold one of your own pieces.\n- `render()` adds the classes: `sel` on the picked-up square, `target` (a dot) or `capture` (a red ring) on squares you can move to, `last` on the previous move.\n- `play(move)` makes the move and redraws; a click handler on the whole board finds which square was clicked with `e.target.closest('.sq')`.\n\nOne listener on the board, instead of 64, is called **event delegation**: it also keeps working after `render()` replaces all the squares.",
   "checks": [
    {
     "pane": "js",
     "label": "a makeMove() function",
     "test": "/function\\s+makeMove\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "it copies the board first",
     "test": "/s\\.board\\.slice\\(\\)/"
    },
    {
     "pane": "js",
     "label": "a play() function",
     "test": "/function\\s+play\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "one click listener on the board",
     "test": "/\\$\\(\\s*['\"]board['\"]\\s*\\)\\.addEventListener\\(\\s*['\"]click['\"]/"
    }
   ],
   "quiz": [
    {
     "q": "Why does makeMove() return a new state instead of changing the old one?",
     "options": [
      "So the computer can try moves on copies without disturbing the real game",
      "JavaScript arrays can't be changed",
      "It uses less memory"
     ],
     "answer": 0,
     "why": "Search means \"what if\": trying a move, looking at the result, then trying another from the same start."
    },
    {
     "q": "Why put one click listener on the board instead of one on each square?",
     "options": [
      "Buttons can't have listeners",
      "render() rebuilds the squares, and a single board listener keeps working through that",
      "It makes the squares bigger"
     ],
     "answer": 1,
     "why": "With event delegation, e.target.closest(\".sq\") finds the square, however many times it was redrawn."
    }
   ],
   "session": 0,
   "minutes": 15,
   "js": {
    "rules": "// Returns a NEW state with the move made. The old state is never changed:\n// the computer will try thousands of moves on copies without disturbing the real game.\nfunction makeMove(s, m) {\n  const b = s.board.slice();\n  b[m.to] = b[m.from];\n  b[m.from] = null;\n  return { ...s, board: b, turn: s.turn === 'w' ? 'b' : 'w' };\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\n\n// For now any square that doesn't hold one of your own pieces. Real rules come next session.\nconst movesFrom = (i) => [...Array(64).keys()]\n  .filter((to) => to !== i && colorOf(state.board[to]) !== state.turn)\n  .map((to) => ({ from: i, to, piece: state.board[i], captured: state.board[to] }));\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  render();\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq) return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  render();\n};",
    "go": "render();"
   }
  },
  {
   "title": "How the pieces move",
   "body": "Time for real rules. `pseudoMoves(s)` lists every move each piece of the side to move **could** make: \"pseudo\" because it doesn't yet check whether the move leaves your own king in check (that's step 6).\n\nThere are only two kinds of movement:\n\n- **Jumpers** (knight, king): try each step in the list once. If the square is on the board and doesn't hold your own piece, it's a move (a capture if an enemy is there).\n- **Sliders** (rook, bishop, queen): for each direction, keep stepping until you leave the board or hit a piece. An empty square is a move; an enemy piece is a capture and then you stop; your own piece just stops you.\n\n```svg A rook slides until something is in the way: it can capture the enemy knight but not pass its own pawn\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 430 225\" font-family=\"sans-serif\"><rect x=\"10\" y=\"10\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"36\" y=\"10\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"62\" y=\"10\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"88\" y=\"10\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"114\" y=\"10\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"10\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"166\" y=\"10\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"192\" y=\"10\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"10\" y=\"36\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"36\" y=\"36\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"62\" y=\"36\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"88\" y=\"36\" width=\"26\" height=\"26\" fill=\"#fca5a5\"/><rect x=\"114\" y=\"36\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"140\" y=\"36\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"166\" y=\"36\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"192\" y=\"36\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"10\" y=\"62\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"36\" y=\"62\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"62\" y=\"62\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"88\" y=\"62\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"114\" y=\"62\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"62\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"166\" y=\"62\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"192\" y=\"62\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"10\" y=\"88\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"36\" y=\"88\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"62\" y=\"88\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"88\" y=\"88\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"114\" y=\"88\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"140\" y=\"88\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"166\" y=\"88\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"192\" y=\"88\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"10\" y=\"114\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"36\" y=\"114\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"62\" y=\"114\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"88\" y=\"114\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"114\" y=\"114\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"140\" y=\"114\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"166\" y=\"114\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"192\" y=\"114\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"10\" y=\"140\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"36\" y=\"140\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"62\" y=\"140\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"88\" y=\"140\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"114\" y=\"140\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"140\" y=\"140\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"166\" y=\"140\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"192\" y=\"140\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"10\" y=\"166\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"36\" y=\"166\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"62\" y=\"166\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"88\" y=\"166\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"114\" y=\"166\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"140\" y=\"166\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"166\" y=\"166\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"192\" y=\"166\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"10\" y=\"192\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"36\" y=\"192\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"62\" y=\"192\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"88\" y=\"192\" width=\"26\" height=\"26\" fill=\"#93c5fd\"/><rect x=\"114\" y=\"192\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"140\" y=\"192\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><rect x=\"166\" y=\"192\" width=\"26\" height=\"26\" fill=\"#b08458\"/><rect x=\"192\" y=\"192\" width=\"26\" height=\"26\" fill=\"#eeddb8\"/><text x=\"101\" y=\"132\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#1d4ed8\">R</text><text x=\"179\" y=\"132\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#1d4ed8\">P</text><text x=\"101\" y=\"54\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#b91c1c\">n</text><text x=\"230\" y=\"40\" font-size=\"12\" fill=\"#1c2430\">The rook slides in 4 directions</text><rect x=\"230\" y=\"55\" width=\"14\" height=\"14\" fill=\"#93c5fd\"/><text x=\"250\" y=\"67\" font-size=\"12\">squares it can reach</text><rect x=\"230\" y=\"80\" width=\"14\" height=\"14\" fill=\"#fca5a5\"/><text x=\"250\" y=\"92\" font-size=\"12\">enemy piece: capture, then stop</text><text x=\"230\" y=\"120\" font-size=\"12\">own pawn on g4: stop before it</text><text x=\"230\" y=\"150\" font-size=\"12\" fill=\"#475569\">bishops use the 4 diagonals,</text><text x=\"230\" y=\"166\" font-size=\"12\" fill=\"#475569\">queens use all 8 directions</text></svg>\n```\n\nThe queen needs no code of her own: she's a rook and a bishop together, `[...ROOK_DIRS, ...BISHOP_DIRS]`. Pawns are different enough to get their own step next.\n\n`add()` builds each move object. `captured: b[to]` records what was on the target square (or `null`), which the computer and coach will use a lot.\n\n### Try it\n\n`movesFrom()` now uses `pseudoMoves()`. Click a knight: two dots. Click a rook: nothing (it's boxed in). Pawns can't move yet.",
   "checks": [
    {
     "pane": "js",
     "label": "a pseudoMoves() function",
     "test": "/function\\s+pseudoMoves\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "sliders keep going until blocked",
     "test": "/while\\s*\\(\\s*to\\s*>=\\s*0\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "the queen uses both kinds of direction",
     "test": "/\\[\\s*\\.\\.\\.ROOK_DIRS\\s*,\\s*\\.\\.\\.BISHOP_DIRS\\s*\\]/"
    },
    {
     "pane": "js",
     "label": "clicks use the real moves",
     "test": "/pseudoMoves\\(\\s*state\\s*\\)\\.filter/"
    }
   ],
   "quiz": [
    {
     "q": "A bishop slides toward an enemy pawn two squares away. Which squares can it move to in that direction?",
     "options": [
      "Only the empty square",
      "The empty square and the pawn's square (a capture), then it stops",
      "Every square until the edge of the board"
     ],
     "answer": 1,
     "why": "An enemy piece can be captured, but the bishop can't jump over it."
    },
    {
     "q": "Why does the queen have no movement code of her own?",
     "options": [
      "Queens are handled by the king code",
      "She moves like a rook and a bishop combined, so she uses both direction lists",
      "The queen can't move until step 7"
     ],
     "answer": 1,
     "why": "Reusing the two lists keeps the rules short and means one fix to slider code fixes all three pieces."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "moves": "// Every move each piece could make, before checking whether it leaves your own king in check.\nfunction pseudoMoves(s) {\n  const moves = [];\n  const b = s.board;\n  const me = s.turn;\n  const them = me === 'w' ? 'b' : 'w';\n  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });\n\n  for (let from = 0; from < 64; from++) {\n    const p = b[from];\n    if (!p || colorOf(p) !== me) continue;\n    const type = p.toUpperCase();\n    if (type === 'P') continue;                               // pawns come in the next step\n    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction\n      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {\n        const to = step(from, df, dr);\n        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);\n      }\n    } else {                                                     // sliders: keep going until something is in the way\n      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];\n      for (const [df, dr] of dirs) {\n        let to = step(from, df, dr);\n        while (to >= 0) {\n          if (!b[to]) add(from, to);\n          else { if (colorOf(b[to]) === them) add(from, to); break; }\n          to = step(to, df, dr);\n        }\n      }\n    }\n  }\n  return moves;\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\n\n// The moves the piece on square i can make (we'll rule out moving into check in step 6).\nconst movesFrom = (i) => pseudoMoves(state).filter((m) => m.from === i);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move`;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  render();\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq) return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  render();\n};"
   }
  },
  {
   "title": "Pawns",
   "body": "Pawns are the most rule-heavy piece:\n\n| Rule | Code |\n|---|---|\n| move one square forward, only onto an empty square | `one = step(from, 0, dir)` and `!b[one]` |\n| two squares from the starting row, if both are empty | `rankOf(from) === startRow` |\n| capture one square diagonally forward | `for (const df of [-1, 1])` |\n| reaching the last row promotes | `pushOrPromote()` adds Q, R, B and N versions |\n\n`dir` is -1 for white and +1 for black, so one piece of code handles both colors.\n\nA two-square jump is marked `double: true`, and `makeMove()` now records the square it skipped over as `ep`. That's for en passant in the next step. `makeMove()` also handles promotion (`m.promotion || b[m.from]` puts the new piece on the square) and keeps the move counters: `halfmove` goes back to 0 after any capture or pawn move, which is how the fifty-move rule will be counted.\n\nIn this version a promoting pawn always becomes a queen when you click (the click handler picks the `Q` move). Letting the player choose is one of the challenges at the end.\n\n### Try it\n\nPush some pawns, including a two-square jump. Try to capture straight ahead: you can't.",
   "checks": [
    {
     "pane": "js",
     "label": "pawns have a starting row for the double step",
     "test": "/startRow/"
    },
    {
     "pane": "js",
     "label": "promotion moves",
     "test": "/promotion:\\s*me\\s*===\\s*['\"]w['\"]/"
    },
    {
     "pane": "js",
     "label": "makeMove records the en passant square",
     "test": "/ep:\\s*m\\.double/"
    }
   ],
   "quiz": [
    {
     "q": "Why does pushOrPromote() add four moves when a pawn reaches the last row?",
     "options": [
      "The pawn moves four times",
      "The player can promote to a queen, rook, bishop or knight, and each is a different move",
      "To slow down the computer"
     ],
     "answer": 1,
     "why": "Usually a queen is best, but sometimes a knight gives check or a rook avoids stalemate, so all four are real choices."
    },
    {
     "q": "Why does halfmove go back to 0 after a pawn move or capture?",
     "options": [
      "The fifty-move rule counts moves since the last capture or pawn move",
      "To show whose turn it is",
      "Pawns can only move every fifty moves"
     ],
     "answer": 0,
     "why": "Those are the only moves that can't be undone, so the rule counts from the last one."
    }
   ],
   "session": 1,
   "minutes": 15,
   "js": {
    "moves": "// Every move each piece could make, before checking whether it leaves your own king in check.\nfunction pseudoMoves(s) {\n  const moves = [];\n  const b = s.board;\n  const me = s.turn;\n  const them = me === 'w' ? 'b' : 'w';\n  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });\n\n  for (let from = 0; from < 64; from++) {\n    const p = b[from];\n    if (!p || colorOf(p) !== me) continue;\n    const type = p.toUpperCase();\n    if (type === 'P') {\n      const dir = me === 'w' ? -1 : 1;                         // white moves up the board (toward row 0)\n      const startRow = me === 'w' ? 6 : 1;\n      const lastRow = me === 'w' ? 0 : 7;\n      const pushOrPromote = (to, extra = {}) => {\n        if (rankOf(to) === lastRow) for (const promo of 'QRBN') add(from, to, { ...extra, promotion: me === 'w' ? promo : promo.toLowerCase() });\n        else add(from, to, extra);\n      };\n      const one = step(from, 0, dir);\n      if (one >= 0 && !b[one]) {\n        pushOrPromote(one);\n        const two = step(from, 0, 2 * dir);\n        if (rankOf(from) === startRow && !b[two]) add(from, two, { double: true });\n      }\n      for (const df of [-1, 1]) {                               // pawns capture diagonally\n        const to = step(from, df, dir);\n        if (to < 0) continue;\n        if (b[to] && colorOf(b[to]) === them) pushOrPromote(to);\n      }\n      continue;\n    }\n    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction\n      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {\n        const to = step(from, df, dr);\n        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);\n      }\n    } else {                                                     // sliders: keep going until something is in the way\n      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];\n      for (const [df, dr] of dirs) {\n        let to = step(from, df, dr);\n        while (to >= 0) {\n          if (!b[to]) add(from, to);\n          else { if (colorOf(b[to]) === them) add(from, to); break; }\n          to = step(to, df, dr);\n        }\n      }\n    }\n  }\n  return moves;\n}",
    "rules": "// Returns a NEW state with the move made. The old state is never changed:\n// the computer will try thousands of moves on copies without disturbing the real game.\nfunction makeMove(s, m) {\n  const b = s.board.slice();\n  const me = s.turn;\n  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece\n  b[m.from] = null;\n  return {\n    ...s,\n    board: b,\n    turn: me === 'w' ? 'b' : 'w',\n    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over\n    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,\n    fullmove: s.fullmove + (me === 'b' ? 1 : 0),\n  };\n}"
   }
  },
  {
   "title": "Check and legal moves",
   "body": "The most important rule: **you may never leave your own king attacked.** That covers moving into check, ignoring a check, and moving a \"pinned\" piece that was shielding your king.\n\nThere's an elegant way to handle all three at once: make each pseudo move on a copy, and throw it away if your king is attacked afterward.\n\n```svg One filter makes moves legal: try each move on a copy and drop it if your king is attacked\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 428 145\" font-family=\"sans-serif\"><rect x=\"6\" y=\"20\" width=\"96\" height=\"42\" rx=\"6\" fill=\"#e2e8f0\" stroke=\"#475569\"/><text x=\"54\" y=\"45\" text-anchor=\"middle\" font-size=\"11\">every possible move</text><line x1=\"102\" y1=\"41\" x2=\"110\" y2=\"41\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"110\" y=\"20\" width=\"96\" height=\"42\" rx=\"6\" fill=\"#fef9c3\" stroke=\"#475569\"/><text x=\"158\" y=\"45\" text-anchor=\"middle\" font-size=\"11\">make it on a copy</text><line x1=\"206\" y1=\"41\" x2=\"214\" y2=\"41\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"214\" y=\"20\" width=\"96\" height=\"42\" rx=\"6\" fill=\"#ffedd5\" stroke=\"#475569\"/><text x=\"262\" y=\"45\" text-anchor=\"middle\" font-size=\"11\">is my king attacked?</text><line x1=\"310\" y1=\"41\" x2=\"318\" y2=\"41\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"318\" y=\"20\" width=\"96\" height=\"42\" rx=\"6\" fill=\"#bbf7d0\" stroke=\"#475569\"/><text x=\"366\" y=\"45\" text-anchor=\"middle\" font-size=\"11\">legal move</text><path d=\"M266 62 V92\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"266\" y=\"108\" text-anchor=\"middle\" font-size=\"11\" fill=\"#b91c1c\">yes: throw the move away</text><text x=\"214\" y=\"134\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">this one filter handles pins, moving into check and escaping check</text></svg>\n```\n\n**`isAttacked(s, sq, by)`** asks \"can side `by` capture on square `sq`?\" Instead of generating every enemy move, it looks **outward from the square**: is there an enemy knight a knight's jump away? An enemy pawn diagonally in front? Slide along the rook lines: is the first piece an enemy rook or queen? Along the diagonals: a bishop or queen? That's much faster, and it matters because this runs for every move the computer considers.\n\nThen:\n\n- `inCheck(s)` is \"is the side to move's king attacked?\"\n- `legalMoves(s)` is `pseudoMoves(s)` filtered by `!inCheck(makeMove(s, m), s.turn)`\n\nThe board now turns the king's square red when it's in check, and the status says \"(check!)\". Clicks use `legalMoves()`, so pinned pieces can't move and you must answer a check.",
   "checks": [
    {
     "pane": "js",
     "label": "an isAttacked() function",
     "test": "/function\\s+isAttacked\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "a legalMoves() function",
     "test": "/function\\s+legalMoves\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "moves that leave your king attacked are removed",
     "test": "/!inCheck\\(\\s*makeMove\\(\\s*s\\s*,\\s*m\\s*\\)\\s*,\\s*s\\.turn\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "clicks use legal moves only",
     "test": "/legalMoves\\(\\s*state\\s*\\)\\.filter/"
    }
   ],
   "quiz": [
    {
     "q": "Why does isAttacked() look outward from the square instead of listing all the enemy's moves?",
     "options": [
      "It gives the same answer with far less work, and it runs for every move the computer tries",
      "Enemy moves can't be listed",
      "It only works for kings"
     ],
     "answer": 0,
     "why": "Checking a handful of directions and jumps is much cheaper than generating 30-40 enemy moves."
    },
    {
     "q": "Your bishop is pinned: it stands between your king and an enemy rook. What does legalMoves() do with the bishop's moves?",
     "options": [
      "Allows them, because bishops move diagonally",
      "Removes them, because after each one your king would be attacked by the rook",
      "Removes the rook"
     ],
     "answer": 1,
     "why": "The filter tries each move on a copy; with the bishop gone the rook sees the king, so the move is dropped."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "rules": "// Returns a NEW state with the move made. The old state is never changed:\n// the computer will try thousands of moves on copies without disturbing the real game.\nfunction makeMove(s, m) {\n  const b = s.board.slice();\n  const me = s.turn;\n  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece\n  b[m.from] = null;\n  return {\n    ...s,\n    board: b,\n    turn: me === 'w' ? 'b' : 'w',\n    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over\n    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,\n    fullmove: s.fullmove + (me === 'b' ? 1 : 0),\n  };\n}\n\n// Is square sq attacked by side `by`? Look outward FROM the square for each kind of attacker.\nfunction isAttacked(s, sq, by) {\n  const b = s.board;\n  const is = (i, type) => i >= 0 && b[i] && colorOf(b[i]) === by && b[i].toUpperCase() === type;\n  const pr = by === 'w' ? 1 : -1;        // a white pawn attacks upward, so it sits one row below the square\n  if (is(step(sq, -1, pr), 'P') || is(step(sq, 1, pr), 'P')) return true;\n  for (const [df, dr] of KNIGHT) if (is(step(sq, df, dr), 'N')) return true;\n  for (const [df, dr] of KING) if (is(step(sq, df, dr), 'K')) return true;\n  const slide = (dirs, types) => dirs.some(([df, dr]) => {\n    let i = step(sq, df, dr);\n    while (i >= 0) {\n      if (b[i]) return colorOf(b[i]) === by && types.includes(b[i].toUpperCase());\n      i = step(i, df, dr);\n    }\n    return false;\n  });\n  return slide(ROOK_DIRS, 'RQ') || slide(BISHOP_DIRS, 'BQ');\n}\n\nconst kingSquare = (s, color) => s.board.indexOf(color === 'w' ? 'K' : 'k');\nconst inCheck = (s, color = s.turn) => isAttacked(s, kingSquare(s, color), color === 'w' ? 'b' : 'w');\n\n// A move is legal if, after making it, your own king is not attacked.\nfunction legalMoves(s) {\n  return pseudoMoves(s).filter((m) => !inCheck(makeMove(s, m), s.turn));\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\n\n// The moves the piece on square i can really make.\nconst movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    if (i === checkSq) sq.classList.add('check');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  render();\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq) return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  render();\n};"
   }
  },
  {
   "title": "Castling, en passant and the end of the game",
   "body": "Three special rules finish the game of chess.\n\n**Castling.** The king moves two squares toward a rook and the rook jumps over it. It's allowed only if: neither has moved (tracked in `castling`, like `'KQkq'`), the squares between them are empty, and the king isn't in check, doesn't pass through an attacked square, and doesn't land on one. `pseudoMoves()` adds it as a king move with `castle: 'K'` or `'Q'`; `makeMove()` moves the rook as well.\n\nCastling rights are lost for good: moving the king strips both, and a rook moving from (or being captured on) its corner strips that side. That's the `strip()` loop in `makeMove()`.\n\n**En passant.** Right after a pawn jumps two squares, an enemy pawn beside it may capture it as if it had moved one. `ep` (set in step 5) is the skipped square; a pawn that can capture diagonally onto it gets an `enPassant: true` move. The captured pawn isn't on the target square but beside it, so `makeMove()` removes the pawn one row behind.\n\n**The end.** `gameResult(s)` decides if the game is over:\n\n| Situation | Result |\n|---|---|\n| no legal moves, in check | checkmate: the other side wins |\n| no legal moves, not in check | stalemate: a draw |\n| 100 half-moves with no capture or pawn move | draw by the fifty-move rule |\n| only kings, or king and one knight or bishop | draw: nobody can checkmate |\n\n### Try it\n\nPlay 1. e4 e5 2. Bc4 Nc6 3. Qh5 Nf6 4. Qxf7: the status says White wins by checkmate. Then press New game and try castling: develop the knight and bishop, then click the king and the square two to its right.",
   "checks": [
    {
     "pane": "js",
     "label": "castling moves",
     "test": "/castle:\\s*['\"]K['\"]/"
    },
    {
     "pane": "js",
     "label": "en passant captures",
     "test": "/enPassant:\\s*true/"
    },
    {
     "pane": "js",
     "label": "castling moves the rook too",
     "test": "/if\\s*\\(\\s*m\\.castle\\s*\\)/"
    },
    {
     "pane": "js",
     "label": "a gameResult() function",
     "test": "/function\\s+gameResult\\s*\\(/"
    }
   ],
   "quiz": [
    {
     "q": "Why does gameResult() check inCheck() when there are no legal moves?",
     "options": [
      "To tell checkmate (a win) from stalemate (a draw)",
      "To see whose turn it is",
      "Because the king can always move"
     ],
     "answer": 0,
     "why": "No moves while in check is checkmate; no moves while safe is stalemate."
    },
    {
     "q": "After en passant, which square does makeMove() empty besides the one the pawn left?",
     "options": [
      "The square the pawn moved to",
      "The square of the captured pawn, one row behind the target square",
      "The rook's corner"
     ],
     "answer": 1,
     "why": "The captured pawn jumped past the target square, so it sits beside the capturing pawn, not on the target."
    }
   ],
   "session": 1,
   "minutes": 20,
   "js": {
    "moves": "// Every move each piece could make, before checking whether it leaves your own king in check.\nfunction pseudoMoves(s) {\n  const moves = [];\n  const b = s.board;\n  const me = s.turn;\n  const them = me === 'w' ? 'b' : 'w';\n  const add = (from, to, extra = {}) => moves.push({ from, to, piece: b[from], captured: b[to], ...extra });\n\n  for (let from = 0; from < 64; from++) {\n    const p = b[from];\n    if (!p || colorOf(p) !== me) continue;\n    const type = p.toUpperCase();\n    if (type === 'P') {\n      const dir = me === 'w' ? -1 : 1;                         // white moves up the board (toward row 0)\n      const startRow = me === 'w' ? 6 : 1;\n      const lastRow = me === 'w' ? 0 : 7;\n      const pushOrPromote = (to, extra = {}) => {\n        if (rankOf(to) === lastRow) for (const promo of 'QRBN') add(from, to, { ...extra, promotion: me === 'w' ? promo : promo.toLowerCase() });\n        else add(from, to, extra);\n      };\n      const one = step(from, 0, dir);\n      if (one >= 0 && !b[one]) {\n        pushOrPromote(one);\n        const two = step(from, 0, 2 * dir);\n        if (rankOf(from) === startRow && !b[two]) add(from, two, { double: true });\n      }\n      for (const df of [-1, 1]) {                               // pawns capture diagonally\n        const to = step(from, df, dir);\n        if (to < 0) continue;\n        if (b[to] && colorOf(b[to]) === them) pushOrPromote(to);\n        else if (to === s.ep) add(from, to, { enPassant: true, captured: me === 'w' ? 'p' : 'P' });\n      }\n      continue;\n    }\n    if (type === 'N' || type === 'K') {                         // jumpers: one step in each direction\n      for (const [df, dr] of type === 'N' ? KNIGHT : KING) {\n        const to = step(from, df, dr);\n        if (to >= 0 && colorOf(b[to]) !== me) add(from, to);\n      }\n      if (type === 'K') {   // castling: king on its home square, rights not lost, squares between empty and not attacked\n        const row = me === 'w' ? 7 : 0;\n        const home = row * 8 + 4;\n        if (from === home && !isAttacked(s, home, them)) {\n          const [kSide, qSide] = me === 'w' ? ['K', 'Q'] : ['k', 'q'];\n          if (s.castling.includes(kSide) && !b[home + 1] && !b[home + 2]\n              && !isAttacked(s, home + 1, them) && !isAttacked(s, home + 2, them)) add(from, home + 2, { castle: 'K' });\n          if (s.castling.includes(qSide) && !b[home - 1] && !b[home - 2] && !b[home - 3]\n              && !isAttacked(s, home - 1, them) && !isAttacked(s, home - 2, them)) add(from, home - 2, { castle: 'Q' });\n        }\n      }\n    } else {                                                     // sliders: keep going until something is in the way\n      const dirs = type === 'R' ? ROOK_DIRS : type === 'B' ? BISHOP_DIRS : [...ROOK_DIRS, ...BISHOP_DIRS];\n      for (const [df, dr] of dirs) {\n        let to = step(from, df, dr);\n        while (to >= 0) {\n          if (!b[to]) add(from, to);\n          else { if (colorOf(b[to]) === them) add(from, to); break; }\n          to = step(to, df, dr);\n        }\n      }\n    }\n  }\n  return moves;\n}",
    "rules": "// Returns a NEW state with the move made. The old state is never changed:\n// the computer will try thousands of moves on copies without disturbing the real game.\nfunction makeMove(s, m) {\n  const b = s.board.slice();\n  const me = s.turn;\n  b[m.to] = m.promotion || b[m.from];                   // a promoting pawn turns into the new piece\n  b[m.from] = null;\n  if (m.enPassant) b[m.to + (me === 'w' ? 8 : -8)] = null;    // the captured pawn is beside, not on, the target\n  if (m.castle) {                                             // castling moves the rook too\n    const row = me === 'w' ? 56 : 0;\n    if (m.castle === 'K') { b[row + 5] = b[row + 7]; b[row + 7] = null; }\n    else { b[row + 3] = b[row]; b[row] = null; }\n  }\n  let castling = s.castling;\n  const strip = (chars) => { for (const c of chars) castling = castling.replace(c, ''); };\n  if (m.piece === 'K') strip('KQ');\n  if (m.piece === 'k') strip('kq');\n  for (const sq of [m.from, m.to]) {                          // a rook moving or being captured loses that side\n    if (sq === 63) strip('K');\n    if (sq === 56) strip('Q');\n    if (sq === 7) strip('k');\n    if (sq === 0) strip('q');\n  }\n  return {\n    board: b,\n    turn: me === 'w' ? 'b' : 'w',\n    castling,\n    ep: m.double ? (m.from + m.to) / 2 : -1,               // the square a double-step pawn skipped over\n    halfmove: m.captured || m.piece.toUpperCase() === 'P' ? 0 : s.halfmove + 1,\n    fullmove: s.fullmove + (me === 'b' ? 1 : 0),\n  };\n}\n\n// Is square sq attacked by side `by`? Look outward FROM the square for each kind of attacker.\nfunction isAttacked(s, sq, by) {\n  const b = s.board;\n  const is = (i, type) => i >= 0 && b[i] && colorOf(b[i]) === by && b[i].toUpperCase() === type;\n  const pr = by === 'w' ? 1 : -1;        // a white pawn attacks upward, so it sits one row below the square\n  if (is(step(sq, -1, pr), 'P') || is(step(sq, 1, pr), 'P')) return true;\n  for (const [df, dr] of KNIGHT) if (is(step(sq, df, dr), 'N')) return true;\n  for (const [df, dr] of KING) if (is(step(sq, df, dr), 'K')) return true;\n  const slide = (dirs, types) => dirs.some(([df, dr]) => {\n    let i = step(sq, df, dr);\n    while (i >= 0) {\n      if (b[i]) return colorOf(b[i]) === by && types.includes(b[i].toUpperCase());\n      i = step(i, df, dr);\n    }\n    return false;\n  });\n  return slide(ROOK_DIRS, 'RQ') || slide(BISHOP_DIRS, 'BQ');\n}\n\nconst kingSquare = (s, color) => s.board.indexOf(color === 'w' ? 'K' : 'k');\nconst inCheck = (s, color = s.turn) => isAttacked(s, kingSquare(s, color), color === 'w' ? 'b' : 'w');\n\n// A move is legal if, after making it, your own king is not attacked.\nfunction legalMoves(s) {\n  return pseudoMoves(s).filter((m) => !inCheck(makeMove(s, m), s.turn));\n}\n\n// Checkmate, stalemate, the fifty-move rule and kings that can't be mated.\nfunction gameResult(s) {\n  const moves = legalMoves(s);\n  if (!moves.length) {\n    return inCheck(s)\n      ? { over: true, winner: s.turn === 'w' ? 'b' : 'w', reason: 'checkmate' }\n      : { over: true, winner: null, reason: 'stalemate' };\n  }\n  if (s.halfmove >= 100) return { over: true, winner: null, reason: 'fifty-move rule' };\n  const pieces = s.board.filter(Boolean).map((p) => p.toUpperCase()).filter((p) => p !== 'K');\n  if (pieces.length === 0 || (pieces.length === 1 && 'NB'.includes(pieces[0]))) {\n    return { over: true, winner: null, reason: 'insufficient material' };\n  }\n  return { over: false };\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\n\n// The moves the piece on square i can really make.\nconst movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    if (i === checkSq) sq.classList.add('check');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  const result = gameResult(state);\n  if (result.over) {\n    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;\n  } else {\n    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;\n  }\n  return result;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  render();\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq) return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  render();\n};"
   }
  },
  {
   "title": "Scoring a position",
   "body": "A chess program needs a way to say \"how good is this position?\" as a number. This is the **evaluation**, and it's measured in **centipawns**: 100 is one pawn.\n\nThe first part is material. The real app uses these values:\n\n| Piece | Value |\n|---|---|\n| Pawn | 100 |\n| Knight | 320 |\n| Bishop | 330 |\n| Rook | 500 |\n| Queen | 900 |\n\nThe second part is **piece-square tables** (`PST`): for each kind of piece, 64 bonuses (or penalties) for standing on each square. Knights get +20 in the center and -50 in the corners (\"a knight on the rim is dim\"), pawns get more as they advance, and the king gets a bonus for hiding behind its pawns. The tables are written from white's side of the board, so black's pieces look up the mirrored square: the same column, row `7 - row`.\n\n`evaluate(s)` adds everything up from **white's point of view**: white's pieces count plus, black's count minus. 0 means equal, +300 means white is roughly a knight ahead.\n\n### Try it\n\nThe console shows the start position's score: 0, because the position is perfectly balanced. In the console, try `evaluate(fromFen('4k3/8/8/8/8/8/8/3QK3 w - - 0 1'))`: white has an extra queen, so it's about +900.",
   "checks": [
    {
     "pane": "js",
     "label": "piece values",
     "test": "/const\\s+VALUES\\s*=/"
    },
    {
     "pane": "js",
     "label": "piece-square tables",
     "test": "/const\\s+PST\\s*=/"
    },
    {
     "pane": "js",
     "label": "an evaluate() function",
     "test": "/function\\s+evaluate\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "black looks up the mirrored square",
     "test": "/\\(\\s*7\\s*-\\s*Math\\.floor\\(\\s*i\\s*\\/\\s*8\\s*\\)\\s*\\)\\s*\\*\\s*8/"
    }
   ],
   "quiz": [
    {
     "q": "evaluate() returns -350. What does that mean?",
     "options": [
      "Black is ahead by about a knight or bishop",
      "White is ahead by 350 pawns",
      "The game is over"
     ],
     "answer": 0,
     "why": "Scores are from white's side in centipawns, so negative is good for black, and 350 is a bit more than a minor piece."
    },
    {
     "q": "What do piece-square tables add that material alone can't?",
     "options": [
      "They count the pieces",
      "They reward good squares, like knights in the center, so the computer develops its pieces sensibly",
      "They make moves legal"
     ],
     "answer": 1,
     "why": "With material only, every non-capturing move scores the same and the computer would shuffle pieces at random."
    }
   ],
   "session": 2,
   "minutes": 15,
   "js": {
    "ai": "// Piece values in centipawns: 100 = one pawn.\nconst VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };\nconst MATE = 100000;\n\n// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.\n// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.\nconst PST = {\n  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,\n      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],\n  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,\n      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],\n  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,\n      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],\n  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,\n      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],\n  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,\n      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],\n  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,\n      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],\n};\n\n// The score in centipawns from white's point of view: positive is good for white.\nfunction evaluate(s) {\n  let score = 0;\n  s.board.forEach((p, i) => {\n    if (!p) return;\n    const type = p.toUpperCase();\n    const white = colorOf(p) === 'w';\n    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black\n    score += (white ? 1 : -1) * (VALUES[type] + pst);\n  });\n  return score;\n}",
    "go": "render();\nconsole.log('The start position scores', evaluate(state), '(0 = equal)');"
   }
  },
  {
   "title": "Looking ahead with negamax and alpha-beta",
   "body": "To choose a move, the computer imagines each move, then the opponent's best reply, then its own best answer, and so on, `depth` moves deep. This is a recursive `search()`.\n\n**Negamax.** One trick keeps it short: a position that's +200 for me is -200 for my opponent. So `search()` always scores from the side to move's point of view, and a move's score is **minus** the score of the position it leads to. The same function works for both players.\n\n- No legal moves: checkmate scores `-MATE + ply` (being mated sooner is worse), stalemate scores 0.\n- `depth` 0: return the evaluation, flipped for black.\n- Otherwise: try every move and keep the best.\n\n**Alpha-beta pruning.** Searching every move to depth 3 is about 30 x 30 x 30 = 27,000 positions. Alpha-beta skips lines that can't matter: `alpha` is the best score I'm already sure of, `beta` the best my opponent is sure of. As soon as one reply shows a move is worse than one I already have, the rest of that move's replies don't matter.\n\n```svg Alpha-beta: once one reply proves move B is worse than move A, the rest of B can be skipped\n<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 420 200\" font-family=\"sans-serif\"><rect x=\"160\" y=\"8\" width=\"100\" height=\"28\" rx=\"6\" fill=\"#e2e8f0\"/><text x=\"210\" y=\"27\" text-anchor=\"middle\" font-size=\"12\">your move</text><line x1=\"190\" y1=\"36\" x2=\"105\" y2=\"70\" stroke=\"#475569\" stroke-width=\"2\"/><line x1=\"230\" y1=\"36\" x2=\"315\" y2=\"70\" stroke=\"#475569\" stroke-width=\"2\"/><rect x=\"50\" y=\"70\" width=\"110\" height=\"28\" rx=\"6\" fill=\"#bbf7d0\"/><text x=\"105\" y=\"89\" text-anchor=\"middle\" font-size=\"12\">move A: worst = +1</text><rect x=\"260\" y=\"70\" width=\"110\" height=\"28\" rx=\"6\" fill=\"#ffedd5\"/><text x=\"315\" y=\"89\" text-anchor=\"middle\" font-size=\"12\">move B: ?</text><line x1=\"85\" y1=\"98\" x2=\"60\" y2=\"130\" stroke=\"#475569\"/><line x1=\"125\" y1=\"98\" x2=\"150\" y2=\"130\" stroke=\"#475569\"/><text x=\"60\" y=\"146\" text-anchor=\"middle\" font-size=\"12\">+1</text><text x=\"150\" y=\"146\" text-anchor=\"middle\" font-size=\"12\">+3</text><line x1=\"295\" y1=\"98\" x2=\"270\" y2=\"130\" stroke=\"#475569\"/><line x1=\"335\" y1=\"98\" x2=\"360\" y2=\"130\" stroke=\"#94a3b8\" stroke-dasharray=\"4 3\"/><text x=\"270\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"#b91c1c\">-2</text><text x=\"360\" y=\"146\" text-anchor=\"middle\" font-size=\"12\" fill=\"#94a3b8\">skipped</text><text x=\"210\" y=\"176\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">their reply to B already makes B worse (-2) than A (+1),</text><text x=\"210\" y=\"192\" text-anchor=\"middle\" font-size=\"11\" fill=\"#475569\">so B's other replies don't matter: that branch is \"pruned\"</text></svg>\n```\n\n`rankMoves(s, depth)` scores every legal move and sorts them best first. The coach will use that list too. For now `chooseMove()` plays the top one.\n\nYou play white. After your move, `play()` sets `busy`, shows \"Computer is thinking…\", and calls `computerMove()` with `setTimeout`, so the page can draw the message before the search starts.\n\n### Try it\n\nPlay a move. Black answers. Hang a piece (put your queen where a pawn can take it) and watch the computer take it.",
   "checks": [
    {
     "pane": "js",
     "label": "a search() function",
     "test": "/function\\s+search\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "alpha-beta cut-off",
     "test": "/if\\s*\\(\\s*score\\s*>=\\s*beta\\s*\\)\\s*return\\s+beta/"
    },
    {
     "pane": "js",
     "label": "moves ranked best first",
     "test": "/function\\s+rankMoves\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "the computer answers your move",
     "test": "/setTimeout\\(\\s*computerMove/"
    }
   ],
   "quiz": [
    {
     "q": "Why is a move's score minus the score of the position after it?",
     "options": [
      "Scores are always negative",
      "The next position is scored for the opponent, and what's good for them is bad for you",
      "To make the numbers smaller"
     ],
     "answer": 1,
     "why": "That's the \"nega\" in negamax: one function scores positions for whoever is to move."
    },
    {
     "q": "What does alpha-beta pruning change about the result?",
     "options": [
      "It finds a different, weaker move",
      "Nothing: it finds the same best move, just without searching lines that can't change the answer",
      "It makes the computer play randomly"
     ],
     "answer": 1,
     "why": "Pruned branches are ones that provably can't beat a move already found."
    }
   ],
   "session": 2,
   "minutes": 20,
   "js": {
    "ai": "// Piece values in centipawns: 100 = one pawn.\nconst VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };\nconst MATE = 100000;\n\n// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.\n// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.\nconst PST = {\n  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,\n      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],\n  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,\n      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],\n  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,\n      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],\n  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,\n      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],\n  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,\n      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],\n  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,\n      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],\n};\n\n// The score in centipawns from white's point of view: positive is good for white.\nfunction evaluate(s) {\n  let score = 0;\n  s.board.forEach((p, i) => {\n    if (!p) return;\n    const type = p.toUpperCase();\n    const white = colorOf(p) === 'w';\n    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black\n    score += (white ? 1 : -1) * (VALUES[type] + pst);\n  });\n  return score;\n}\n\n// Negamax with alpha-beta: the best score the side to move can force, looking `depth` moves ahead.\n// \"Nega\" because my score is minus my opponent's score, so one function works for both sides.\nfunction search(s, depth, alpha = -Infinity, beta = Infinity, ply = 0) {\n  const moves = legalMoves(s);\n  if (!moves.length) return inCheck(s) ? -MATE + ply : 0;   // checkmated (sooner is worse) or stalemate\n  if (depth === 0) return (s.turn === 'w' ? 1 : -1) * evaluate(s);\n  for (const m of moves) {\n    const score = -search(makeMove(s, m), depth - 1, -beta, -alpha, ply + 1);\n    if (score >= beta) return beta;      // the opponent would never allow this line: stop looking\n    if (score > alpha) alpha = score;    // the best we've found so far\n  }\n  return alpha;\n}\n\n// Every legal move with its score, best first.\nfunction rankMoves(s, depth) {\n  return legalMoves(s)\n    .map((move) => ({ move, score: -search(makeMove(s, move), depth - 1, -Infinity, Infinity, 1) }))\n    .sort((a, b) => b.score - a.score);\n}\n\nfunction chooseMove(s, depth = 2) {\n  return rankMoves(s, depth)[0].move;\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\nlet busy = false;              // true while the computer is thinking\n\n// The moves the piece on square i can really make.\nconst movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    if (i === checkSq) sq.classList.add('check');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  const result = gameResult(state);\n  if (result.over) {\n    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;\n  } else if (busy) {\n    $('status').textContent = 'Computer is thinking…';\n  } else {\n    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;\n  }\n  return result;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  const result = render();\n  if (!result.over && state.turn === 'b') {   // you play white; the computer answers\n    busy = true;\n    render();\n    setTimeout(computerMove, 30);              // let the page show \"thinking…\" first\n  }\n}\n\nfunction computerMove() {\n  const move = chooseMove(state, 2);\n  busy = false;\n  play(move);\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq || busy || state.turn !== 'w') return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  busy = false;\n  render();\n};",
    "go": "render();"
   }
  },
  {
   "title": "Faster and smarter, with levels",
   "body": "Two improvements make the search much stronger, then levels make it fun for everyone.\n\n**Move ordering.** Alpha-beta prunes most when the best move is tried first. A good guess: captures of valuable pieces by cheap ones (a pawn taking a queen) come first. This is called MVV-LVA, \"most valuable victim, least valuable attacker\". `ordered()` sorts the moves by that score before searching.\n\n**Quiescence search.** If the search stops right after \"my queen takes your knight\", it thinks it's a knight ahead, without seeing that a pawn takes the queen back. `quiesce()` keeps searching **captures only** at the end until the position is quiet. Its first line, the \"stand pat\" score, says that you don't have to capture: if the position is already good enough, stop.\n\n**Levels.**\n\n| Level | Looks ahead | Randomness |\n|---|---|---|\n| Easy | 1 move | picks any move within 150 centipawns of the best |\n| Medium | 2 moves | within 40 |\n| Hard | 3 moves | always the best |\n\n`chooseMove()` keeps every move whose score is close enough to the best and picks one at random, so easier levels make human-like slips.\n\n### Try it\n\nChoose Hard from the Opponent menu and play. It takes a moment longer and punishes loose pieces. Easy sometimes misses a free capture.",
   "checks": [
    {
     "pane": "js",
     "label": "a quiescence search",
     "test": "/function\\s+quiesce\\s*\\(/"
    },
    {
     "pane": "js",
     "label": "moves are ordered before searching",
     "test": "/const\\s+ordered\\s*=/"
    },
    {
     "pane": "js",
     "label": "three levels",
     "test": "/const\\s+LEVELS\\s*=/"
    },
    {
     "pane": "js",
     "label": "the menu picks the level",
     "test": "/chooseMove\\(\\s*state\\s*,\\s*\\$\\(\\s*['\"]level['\"]\\s*\\)\\.value\\s*\\)/"
    }
   ],
   "quiz": [
    {
     "q": "Why search captures past the depth limit in quiesce()?",
     "options": [
      "To find checkmates",
      "So the computer doesn't stop in the middle of a trade and misjudge who is ahead",
      "Captures are the only legal moves at the end"
     ],
     "answer": 1,
     "why": "Stopping after \"queen takes knight\" without seeing \"pawn takes queen\" is called the horizon effect."
    },
    {
     "q": "How does Easy play weaker on purpose?",
     "options": [
      "It looks one move ahead and picks randomly among moves within 150 centipawns of the best",
      "It skips its turn sometimes",
      "It plays illegal moves"
     ],
     "answer": 0,
     "why": "A shallow search plus a little randomness makes believable mistakes instead of silly ones."
    }
   ],
   "session": 2,
   "minutes": 15,
   "js": {
    "ai": "// Piece values in centipawns: 100 = one pawn.\nconst VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };\nconst MATE = 100000;\n\n// Piece-square tables, from white's side of the board (index 0 = a8): bonuses for good squares.\n// Knights love the center, pawns want to advance, the king wants to hide behind its pawns.\nconst PST = {\n  P: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,\n      0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],\n  N: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,\n      -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],\n  B: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,\n      -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],\n  R: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,\n      -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],\n  Q: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,\n      0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],\n  K: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,\n      -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20],\n};\n\n// The score in centipawns from white's point of view: positive is good for white.\nfunction evaluate(s) {\n  let score = 0;\n  s.board.forEach((p, i) => {\n    if (!p) return;\n    const type = p.toUpperCase();\n    const white = colorOf(p) === 'w';\n    const pst = PST[type][white ? i : (7 - Math.floor(i / 8)) * 8 + (i % 8)];   // mirror the table for black\n    score += (white ? 1 : -1) * (VALUES[type] + pst);\n  });\n  return score;\n}\n\n// Captures of valuable pieces by cheap ones first (MVV-LVA). Good moves first = far more pruning.\nconst orderScore = (m) => (m.captured ? 10 * VALUES[m.captured.toUpperCase()] - VALUES[m.piece.toUpperCase()] : 0) + (m.promotion ? 800 : 0);\nconst ordered = (moves) => moves.sort((a, b) => orderScore(b) - orderScore(a));\n\n// At the end of the search, keep looking at captures only, so we never stop in the middle of a trade.\nfunction quiesce(s, alpha, beta, depth = 0) {\n  const stand = (s.turn === 'w' ? 1 : -1) * evaluate(s);\n  if (stand >= beta) return beta;\n  if (stand > alpha) alpha = stand;\n  if (depth > 6) return alpha;\n  for (const m of ordered(legalMoves(s).filter((x) => x.captured || x.promotion))) {\n    const score = -quiesce(makeMove(s, m), -beta, -alpha, depth + 1);\n    if (score >= beta) return beta;\n    if (score > alpha) alpha = score;\n  }\n  return alpha;\n}\n\n// Negamax with alpha-beta: the best score the side to move can force, looking `depth` moves ahead.\nfunction search(s, depth, alpha = -Infinity, beta = Infinity, ply = 0) {\n  const moves = legalMoves(s);\n  if (!moves.length) return inCheck(s) ? -MATE + ply : 0;   // checkmated (sooner is worse) or stalemate\n  if (depth === 0) return quiesce(s, alpha, beta);\n  for (const m of ordered(moves)) {\n    const score = -search(makeMove(s, m), depth - 1, -beta, -alpha, ply + 1);\n    if (score >= beta) return beta;\n    if (score > alpha) alpha = score;\n  }\n  return alpha;\n}\n\n// Every legal move with its score, best first.\nfunction rankMoves(s, depth) {\n  return ordered(legalMoves(s))\n    .map((move) => ({ move, score: -search(makeMove(s, move), depth - 1, -Infinity, Infinity, 1) }))\n    .sort((a, b) => b.score - a.score);\n}\n\n// Easier levels look less far ahead and sometimes pick a slightly worse move on purpose.\nconst LEVELS = {\n  easy: { depth: 1, randomness: 150 },\n  medium: { depth: 2, randomness: 40 },\n  hard: { depth: 3, randomness: 0 },\n};\n\nfunction chooseMove(s, level = 'medium', rand = Math.random) {\n  const { depth, randomness } = LEVELS[level] ?? LEVELS.medium;\n  const ranked = rankMoves(s, depth);\n  const choices = ranked.filter((r) => r.score >= ranked[0].score - randomness);\n  return choices[Math.floor(rand() * choices.length)].move;\n}",
    "ui": "const $ = (id) => document.getElementById(id);\nconst GLYPH = { K: '♚', Q: '♛', R: '♜', B: '♝', N: '♞', P: '♟' };   // solid shapes; CSS colors them white or black\nlet state = fromFen(START_FEN);\nlet selected = null;           // the square you clicked first\nlet lastMove = null;\nlet busy = false;              // true while the computer is thinking\n\n// The moves the piece on square i can really make.\nconst movesFrom = (i) => legalMoves(state).filter((m) => m.from === i);\n\nfunction render() {\n  const board = $('board');\n  board.innerHTML = '';\n  const targets = selected === null ? [] : movesFrom(selected);\n  const checkSq = inCheck(state) ? kingSquare(state, state.turn) : -1;\n  for (let i = 0; i < 64; i++) {\n    const sq = document.createElement('button');\n    const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;\n    sq.className = `sq ${dark ? 'dark' : 'light'}`;\n    sq.dataset.i = i;\n    sq.setAttribute('aria-label', sqName(i) + (state.board[i] ? ` ${state.board[i]}` : ''));\n    if (lastMove && (i === lastMove.from || i === lastMove.to)) sq.classList.add('last');\n    if (i === selected) sq.classList.add('sel');\n    const t = targets.find((m) => m.to === i);\n    if (t) sq.classList.add(t.captured ? 'capture' : 'target');\n    if (i === checkSq) sq.classList.add('check');\n    const p = state.board[i];\n    if (p) sq.innerHTML = `<span class=\"piece ${colorOf(p)}\">${GLYPH[p.toUpperCase()]}</span>`;\n    board.appendChild(sq);\n  }\n  const result = gameResult(state);\n  if (result.over) {\n    $('status').textContent = result.winner ? `${result.winner === 'w' ? 'White' : 'Black'} wins by ${result.reason}!` : `Draw by ${result.reason}.`;\n  } else if (busy) {\n    $('status').textContent = 'Computer is thinking…';\n  } else {\n    $('status').textContent = `${state.turn === 'w' ? 'White' : 'Black'} to move${inCheck(state) ? ' (check!)' : ''}`;\n  }\n  return result;\n}\n\nfunction play(move) {\n  state = makeMove(state, move);\n  lastMove = move;\n  selected = null;\n  const result = render();\n  if (!result.over && state.turn === 'b') {   // you play white; the computer answers\n    busy = true;\n    render();\n    setTimeout(computerMove, 30);              // let the page show \"thinking…\" first\n  }\n}\n\nfunction computerMove() {\n  const move = chooseMove(state, $('level').value);\n  busy = false;\n  play(move);\n}\n\n$('board').addEventListener('click', (e) => {\n  const sq = e.target.closest('.sq');\n  if (!sq || busy || state.turn !== 'w') return;\n  const i = Number(sq.dataset.i);\n  // second click: a move to this square? (a promoting pawn always becomes a queen here)\n  const move = selected === null ? null : movesFrom(selected).find((m) => m.to === i && (!m.promotion || 'Qq'.includes(m.promotion)));\n  if (move) return play(move);\n  selected = colorOf(state.board[i]) === state.turn ? i : null;   // first click: pick up your own piece\n  render();\n});\n\n$('new').onclick = () => {\n  state = fromFen(START_FEN);\n  selected = null;\n  lastMove = null;\n  busy = false;\n  render();\n};"
   }
  }
 ],
 "finish": "### What you learned\n\n- Keeping a game as data (a 64-square board plus a few fields) and reading positions from FEN\n- Safe board movement with column and row steps, and direction lists for every piece\n- Making a move on a copy, and using that to filter pseudo moves into legal ones\n- Check, pins, castling, en passant, promotion, checkmate and stalemate\n- Evaluating positions with material and piece-square tables\n- Negamax search with alpha-beta pruning, move ordering and quiescence\n- Grading moves by centipawn loss and explaining them in plain language\n\n### Challenges\n\n1. **Promotion picker:** when a pawn reaches the last row, ask which piece to promote to (hint: show the Q, R, B and N moves).\n2. **Take it back:** keep a list of past states and add an Undo button that goes back to your last move.\n3. **Play as black:** add a color menu; flip the board by drawing the squares in reverse order and let the computer move first.\n4. **Opening advice:** add a message when a knight or bishop leaves its starting square in the first 10 moves.\n5. **Perft:** write `perft(s, depth)` and check that the start position gives 20, 400 and 8,902.\n\nCompare your finished coach with the [live version](https://theoyanvno.github.io/chess-coach/) and the [source code](https://github.com/TheoYanvno/chess-coach)."
};
