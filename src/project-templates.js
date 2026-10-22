// Bare-bones starting points shaped like Anthony's other projects: the page layout and empty
// function stubs only, no working logic. Pick one and build it up yourself.

const base = 'body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  background: #f5f5f5;\n  color: #222;\n}\n\nheader {\n  padding: 1rem 1.5rem;\n  background: #222;\n  color: white;\n}\n\nmain {\n  padding: 1.5rem;\n}\n\n.box {\n  border: 2px dashed #bbb;\n  border-radius: 8px;\n  padding: 1rem;\n  background: white;\n}';

export const PROJECT_TEMPLATES = {
  'p-gotham': {
    name: 'Gotham Hospital patient portal',
    html: '<header>\n  <h1>Hospital Patient Portal</h1>\n  <nav>Schedule · Patients · Providers</nav>\n</header>\n\n<main class="layout">\n  <section class="box" id="schedule">\n    <h2>Schedule</h2>\n    <!-- day / week / month view goes here -->\n  </section>\n\n  <aside class="box" id="patient">\n    <h2>Patient</h2>\n    <!-- patient details and documents go here -->\n  </aside>\n\n  <form class="box" id="booking">\n    <h2>Book an appointment</h2>\n    <!-- patient, provider, date and time fields -->\n  </form>\n</main>\n\n<footer>Staff</footer>',
    css: `${base}\n\n.layout {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 1rem;\n}\n\n#booking {\n  grid-column: 1 / -1;\n}`,
    js: '// Data\nconst providers = [];\nconst patients = [];\nconst appointments = [];\n\n// TODO: draw the schedule for a day, week or month\nfunction renderSchedule(view, date) {}\n\n// TODO: show one patient\'s details\nfunction showPatient(id) {}\n\n// TODO: check for clashes and save a new appointment\nfunction bookAppointment(details) {}',
  },

  'p-marvel': {
    name: 'Marvel character database',
    html: '<header>\n  <h1>Character Database</h1>\n</header>\n\n<main>\n  <div class="filters box">\n    <input placeholder="Search characters">\n    <!-- hero / villain / antihero filter -->\n  </div>\n\n  <section class="grid" id="characters">\n    <!-- one card per character -->\n  </section>\n\n  <dialog id="profile">\n    <!-- character profile -->\n  </dialog>\n</main>',
    css: `${base}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  gap: 1rem;\n  margin-top: 1rem;\n}`,
    js: '// Data: id, name, alignment, powers, team, first appearance\nconst characters = [];\n\n// TODO: filter by search text and alignment\nfunction filterCharacters(query, alignment) {}\n\n// TODO: draw the cards\nfunction renderCards(list) {}\n\n// TODO: open a character\'s profile\nfunction openProfile(id) {}',
  },

  'p-snake': {
    name: 'Snake game',
    html: '<header>\n  <h1>Snake</h1>\n  <p>Score: <span id="score">0</span> · Best: <span id="best">0</span></p>\n</header>\n\n<main>\n  <canvas id="board" width="400" height="400"></canvas>\n  <div class="controls">\n    <button id="start">Start</button>\n    <!-- speed and walls options -->\n  </div>\n</main>',
    css: `${base}\n\nmain {\n  display: grid;\n  place-items: center;\n  gap: 1rem;\n}\n\ncanvas {\n  background: #111;\n  border-radius: 8px;\n}`,
    js: "const canvas = document.getElementById('board');\nconst ctx = canvas.getContext('2d');\n\n// State\nlet snake = [];\nlet food = null;\nlet direction = 'right';\n\n// TODO: start a new game\nfunction start() {}\n\n// TODO: move the snake one step, eat food, check for crashes\nfunction step() {}\n\n// TODO: draw the board\nfunction draw() {}\n\n// TODO: arrow keys and swipes change direction\nfunction onKey(event) {}",
  },

  'p-chess': {
    name: 'Chess coach',
    html: '<header>\n  <h1>Chess Coach</h1>\n</header>\n\n<main class="layout">\n  <section id="board" class="board">\n    <!-- 8 x 8 squares -->\n  </section>\n\n  <aside class="box">\n    <h2>Coach</h2>\n    <p id="feedback">Make a move.</p>\n    <ol id="moves"></ol>\n  </aside>\n</main>',
    css: `${base}\n\n.layout {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 1.5rem;\n}\n\n.board {\n  display: grid;\n  grid-template-columns: repeat(8, 48px);\n  grid-template-rows: repeat(8, 48px);\n  border: 2px solid #333;\n}`,
    js: "// TODO: build the 64 squares\nfunction drawBoard() {}\n\n// TODO: list the legal moves for a piece\nfunction legalMoves(square) {}\n\n// TODO: let the computer pick a reply\nfunction computerMove() {}\n\n// TODO: grade the player's move and explain it\nfunction gradeMove(move) {}",
  },

  'p-superbook': {
    name: 'SuperBook (three books + ask the sand)',
    html: '<header>\n  <h1>SuperBook</h1>\n  <select aria-label="Language"><option>English</option></select>\n</header>\n\n<main>\n  <section class="shelf">\n    <button class="book">Tanakh</button>\n    <button class="book">Holy Bible</button>\n    <button class="book">Qur\'an</button>\n  </section>\n\n  <form class="box" id="ask">\n    <input placeholder="Ask a question">\n    <button>Ask</button>\n  </form>\n\n  <canvas id="sand" class="box"></canvas>\n</main>',
    css: `${base}\n\n.shelf {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n}\n\n.book {\n  width: 120px;\n  height: 170px;\n}\n\n#sand {\n  width: 100%;\n  height: 200px;\n  margin-top: 1rem;\n}`,
    js: '// TODO: open a book and load a chapter\nfunction openBook(name) {}\n\n// TODO: match a question to an answer\nfunction answer(question) {}\n\n// TODO: write the answer into the sand\nfunction writeInSand(text) {}',
  },

  'p-calendar': {
    name: 'Task calendar',
    html: '<header>\n  <h1>Task Calendar</h1>\n  <div class="now"><!-- time and weather --></div>\n</header>\n\n<main class="layout">\n  <section class="box">\n    <h2>Month</h2>\n    <div class="grid" id="days">\n      <!-- 42 day cells -->\n    </div>\n  </section>\n\n  <aside class="box">\n    <h2>Today</h2>\n    <form id="add"><!-- title, time, location, repeat --></form>\n    <ul id="tasks"></ul>\n  </aside>\n</main>',
    css: `${base}\n\nheader {\n  display: flex;\n  justify-content: space-between;\n}\n\n.layout {\n  display: grid;\n  grid-template-columns: 2fr 1fr;\n  gap: 1rem;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(7, 1fr);\n  gap: 4px;\n}`,
    js: '// Data: title, date, time, location, priority, repeat\nconst tasks = [];\n\n// TODO: the 6 x 7 grid of dates for a month\nfunction monthGrid(year, month) {}\n\n// TODO: which tasks fall on a day\nfunction tasksOn(date) {}\n\n// TODO: holidays on a day\nfunction holidaysOn(date) {}',
  },

  'p-bonfire': {
    name: 'Bonfire Notes (blog)',
    html: '<header>\n  <h1>Bonfire Notes</h1>\n  <nav>Home · Walkthrough · Boss guides · About</nav>\n</header>\n\n<main class="layout">\n  <article class="box">\n    <h2>Post title</h2>\n    <p class="meta">Date · Tags</p>\n    <!-- post content -->\n  </article>\n\n  <aside class="box">\n    <h3>Recent posts</h3>\n    <ul></ul>\n  </aside>\n</main>\n\n<footer>About this blog</footer>',
    css: `${base}\n\n.layout {\n  display: grid;\n  grid-template-columns: 3fr 1fr;\n  gap: 1rem;\n  max-width: 960px;\n  margin: 0 auto;\n}\n\n.meta {\n  color: #777;\n}`,
    js: '// Posts: title, date, tags, body (Markdown)\nconst posts = [];\n\n// TODO: list the latest posts\nfunction renderPostList() {}\n\n// TODO: show one post\nfunction showPost(slug) {}',
  },

  'p-quote': {
    name: 'Quote & joke generator',
    html: '<header>\n  <h1>Quote & Joke Generator</h1>\n  <!-- log in / create account -->\n</header>\n\n<main>\n  <div class="tabs">\n    <button>Quotes</button>\n    <button>Jokes</button>\n  </div>\n\n  <blockquote class="box" id="card">\n    <!-- the quote or joke -->\n  </blockquote>\n\n  <div class="actions">\n    <button>New one</button>\n    <button>Save</button>\n    <button>Share</button>\n  </div>\n\n  <section class="box" id="favorites">\n    <h2>Favorites</h2>\n  </section>\n</main>',
    css: `${base}\n\nmain {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.tabs, .actions {\n  display: flex;\n  gap: 0.5rem;\n  margin: 1rem 0;\n}`,
    js: "// Data: text, author, category\nconst quotes = [];\nconst jokes = [];\n\n// TODO: pick a random one from the current tab\nfunction next() {}\n\n// TODO: add to favorites\nfunction save(item) {}",
  },

  'p-sudoku': {
    name: 'Sudoku solver',
    html: '<header>\n  <h1>Sudoku Solver</h1>\n</header>\n\n<main class="layout">\n  <section id="grid" class="grid">\n    <!-- 81 cells -->\n  </section>\n\n  <aside class="box">\n    <button>Solve</button>\n    <button>Check</button>\n    <button>New puzzle</button>\n    <p id="explain"><!-- step-by-step explanation --></p>\n  </aside>\n</main>',
    css: `${base}\n\n.layout {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 1.5rem;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(9, 40px);\n  grid-template-rows: repeat(9, 40px);\n  border: 2px solid #333;\n}`,
    js: '// The puzzle: 81 numbers, 0 = empty\nlet board = new Array(81).fill(0);\n\n// TODO: draw the 81 cells\nfunction drawGrid() {}\n\n// TODO: solve the puzzle\nfunction solve(cells) {}\n\n// TODO: make a new puzzle with one solution\nfunction generate(level) {}',
  },

  'p-sticky': {
    name: 'Sticky notes + tasks',
    html: '<header>\n  <h1>Sticky Notes</h1>\n  <nav>Notes · Tasks</nav>\n  <input placeholder="Search">\n  <button>+ New note</button>\n</header>\n\n<main>\n  <section id="board" class="board">\n    <article class="note">\n      <div class="bar"><!-- colors, pin, delete --></div>\n      <input placeholder="Title">\n      <textarea placeholder="Write something…"></textarea>\n    </article>\n  </section>\n</main>',
    css: `${base}\n\nheader {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n\n.board {\n  position: relative;\n  min-height: 400px;\n}\n\n.note {\n  position: absolute;\n  width: 220px;\n  background: #fff3a3;\n  box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);\n}\n\n.bar {\n  height: 24px;\n  background: #f7e36b;\n}\n\n.note input, .note textarea {\n  width: 100%;\n  border: 0;\n  background: transparent;\n}`,
    js: '// Data\nconst notes = [];\nconst tasks = [];\n\n// TODO: add a note\nfunction addNote() {}\n\n// TODO: drag a note by its bar\nfunction enableDrag(note) {}\n\n// TODO: search notes\nfunction search(query) {}',
  },

};
