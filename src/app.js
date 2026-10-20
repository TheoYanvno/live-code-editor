import { buildDocument, debounce } from './preview.js';

const $ = (id) => document.getElementById(id);
const editors = { html: $('html'), css: $('css'), js: $('js') };

const STARTER = {
  html: '<main class="card">\n  <h1>Hello!</h1>\n  <p>Edit the HTML, CSS and JavaScript on the left.</p>\n  <button id="btn">Click me</button>\n</main>',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #f4f1ea;\n}\n\n.card {\n  padding: 2rem;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 8px 30px rgb(0 0 0 / 0.1);\n}',
  js: "let clicks = 0;\n\ndocument.getElementById('btn').addEventListener('click', () => {\n  clicks++;\n  document.querySelector('h1').textContent = `Clicked ${clicks} times`;\n});",
};

const current = () => ({ html: editors.html.value, css: editors.css.value, js: editors.js.value });

function setProject(project) {
  for (const k of Object.keys(editors)) {
    editors[k].value = project[k] ?? '';
    updateGutter(editors[k]);
  }
  run();
}

// ---- running the code ----

function run() {
  // A new srcdoc gives the code a fresh page every run, so old timers and listeners don't pile up
  $('preview').srcdoc = buildDocument(current());
  $('updated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;
}

const runSoon = debounce(run, 500);        // wait for a short pause in typing

// ---- the editors: line numbers, Tab key, Ctrl+Enter ----

function updateGutter(ta) {
  const lines = ta.value.split('\n').length;
  const gutter = ta.previousElementSibling;
  if (gutter.dataset.lines !== String(lines)) {
    gutter.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    gutter.dataset.lines = lines;
  }
}

for (const ta of Object.values(editors)) {
  ta.addEventListener('input', () => {
    updateGutter(ta);
    if ($('auto').checked) runSoon();
  });
  ta.addEventListener('scroll', () => { ta.previousElementSibling.scrollTop = ta.scrollTop; });
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      // Insert two spaces instead of moving focus (Esc then Tab still leaves the editor)
      if (ta.dataset.escaped) { delete ta.dataset.escaped; return; }
      e.preventDefault();
      document.execCommand('insertText', false, '  ') || ta.setRangeText('  ', ta.selectionStart, ta.selectionEnd, 'end');
    } else if (e.key === 'Escape') {
      ta.dataset.escaped = '1';
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runSoon.cancel();
      run();
    } else if (e.key === 'Enter') {
      // keep the indentation of the line above
      const before = ta.value.slice(0, ta.selectionStart);
      const indent = before.slice(before.lastIndexOf('\n') + 1).match(/^\s*/)[0];
      if (indent) {
        e.preventDefault();
        document.execCommand('insertText', false, '\n' + indent) || ta.setRangeText('\n' + indent, ta.selectionStart, ta.selectionEnd, 'end');
      }
    }
  });
}

$('run').onclick = () => { runSoon.cancel(); run(); };

// ---- tabs on small screens ----

document.querySelectorAll('.tabs button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('.tabs button').forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === b.dataset.pane));
  };
});

setProject(STARTER);
