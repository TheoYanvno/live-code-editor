// Starter projects for the template menu. All written for this project.

export const TEMPLATES = {
  hello: {
    name: 'Hello, click counter',
    html: '<main class="card">\n  <h1>Hello!</h1>\n  <p>Edit the HTML, CSS and JavaScript on the left.</p>\n  <button id="btn">Click me</button>\n</main>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #f4f1ea;\n}\n\n.card {\n  padding: 2rem;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 30px rgb(0 0 0 / 0.1);\n}',
    js: "let clicks = 0;\n\ndocument.getElementById('btn').addEventListener('click', () => {\n  clicks++;\n  document.querySelector('h1').textContent = `Clicked ${clicks} times`;\n  console.log('clicks:', clicks);\n});",
  },

  blank: { name: 'Blank', html: '', css: '', js: '' },

  cards: {
    name: 'Responsive card grid (CSS Grid)',
    html: '<h1>Plants</h1>\n<section class="grid">\n  <article><h2>Fern</h2><p>Loves shade and damp soil.</p></article>\n  <article><h2>Cactus</h2><p>Water it once a month.</p></article>\n  <article><h2>Basil</h2><p>Pinch the tops to keep it bushy.</p></article>\n  <article><h2>Pothos</h2><p>Hard to kill. Great first plant.</p></article>\n  <article><h2>Mint</h2><p>Grows fast; keep it in its own pot.</p></article>\n  <article><h2>Snake plant</h2><p>Fine in low light.</p></article>\n</section>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  margin: 2rem;\n  background: #f6f8f4;\n}\n\n/* As many 180px+ columns as fit, then they stretch to fill the row */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\n  gap: 1rem;\n}\n\narticle {\n  padding: 1rem 1.25rem;\n  background: white;\n  border-radius: 10px;\n  border-top: 4px solid #4c9a5b;\n  box-shadow: 0 2px 8px rgb(0 0 0 / 0.08);\n}\n\nh2 { margin: 0 0 0.25rem; font-size: 1.1rem; }\np { margin: 0; color: #555; }',
    js: '// Resize the result pane to watch the columns rearrange.\nconsole.log(document.querySelectorAll("article").length, "cards");',
  },

  todo: {
    name: 'To-do list (DOM and events)',
    html: '<h1>To do</h1>\n<form id="form">\n  <input id="task" placeholder="Add a task" autocomplete="off" required>\n  <button>Add</button>\n</form>\n<ul id="list"></ul>\n<p id="left"></p>',
    css: 'body { font-family: system-ui, sans-serif; max-width: 420px; margin: 2rem auto; }\nform { display: flex; gap: 0.5rem; }\ninput { flex: 1; padding: 0.5rem; }\nul { list-style: none; padding: 0; }\nli { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0; border-bottom: 1px solid #eee; }\nli.done span { text-decoration: line-through; color: #999; }\nli button { margin-left: auto; }',
    js: "const tasks = [{ text: 'Try the live editor', done: true }, { text: 'Build something', done: false }];\n\nfunction render() {\n  const list = document.getElementById('list');\n  list.innerHTML = '';\n  tasks.forEach((t, i) => {\n    const li = document.createElement('li');\n    li.className = t.done ? 'done' : '';\n    li.innerHTML = `<input type=\"checkbox\" ${t.done ? 'checked' : ''}><span></span><button>✕</button>`;\n    li.querySelector('span').textContent = t.text;\n    li.querySelector('input').onchange = () => { t.done = !t.done; render(); };\n    li.querySelector('button').onclick = () => { tasks.splice(i, 1); render(); };\n    list.append(li);\n  });\n  const left = tasks.filter((t) => !t.done).length;\n  document.getElementById('left').textContent = `${left} left`;\n}\n\ndocument.getElementById('form').onsubmit = (e) => {\n  e.preventDefault();\n  const input = document.getElementById('task');\n  tasks.push({ text: input.value, done: false });\n  input.value = '';\n  render();\n};\n\nrender();",
  },

  canvas: {
    name: 'Canvas animation',
    html: '<canvas id="c"></canvas>',
    css: 'html, body { margin: 0; height: 100%; background: #0e1726; }\ncanvas { display: block; width: 100%; height: 100%; }',
    js: "const canvas = document.getElementById('c');\nconst ctx = canvas.getContext('2d');\nconst balls = Array.from({ length: 25 }, () => ({\n  x: Math.random() * 300, y: Math.random() * 200,\n  vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,\n  r: 6 + Math.random() * 14, hue: Math.random() * 360,\n}));\n\nfunction frame() {\n  canvas.width = canvas.clientWidth;\n  canvas.height = canvas.clientHeight;\n  for (const b of balls) {\n    b.x += b.vx; b.y += b.vy;\n    if (b.x < b.r || b.x > canvas.width - b.r) b.vx *= -1;\n    if (b.y < b.r || b.y > canvas.height - b.r) b.vy *= -1;\n    ctx.fillStyle = `hsl(${b.hue} 80% 60%)`;\n    ctx.beginPath();\n    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);\n    ctx.fill();\n  }\n  requestAnimationFrame(frame);\n}\nframe();",
  },

  async: {
    name: 'Promises and async/await (console)',
    html: '<p>Open the console below to see the output.</p>',
    css: 'body { font-family: system-ui, sans-serif; margin: 2rem; }',
    js: "const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));\n\nasync function main() {\n  console.log('start');\n  const a = await wait(300, 'first');\n  console.log(a);\n\n  // run two at once and wait for both\n  const [b, c] = await Promise.all([wait(200, 'second'), wait(100, 'third')]);\n  console.log(b, c);\n\n  try {\n    await Promise.reject(new Error('something went wrong'));\n  } catch (err) {\n    console.warn('caught:', err.message);\n  }\n  console.log('done');\n}\n\nmain();",
  },
};
