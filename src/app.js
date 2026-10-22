import { buildDocument, debounce, jsStartLine } from './preview.js';
import { bridgeScript } from './console-bridge.js';
import { encodeProject, decodeProject } from './share.js';
import { TEMPLATES } from './templates.js';
import { PROJECT_TEMPLATES } from './project-templates.js';
import { Projects, suggestName } from './storage.js';

const projects = new Projects();

const $ = (id) => document.getElementById(id);
const editors = { html: $('html'), css: $('css'), js: $('js') };


const current = () => ({ html: editors.html.value, css: editors.css.value, js: editors.js.value });

function setProject(project) {
  for (const k of Object.keys(editors)) {
    editors[k].value = project[k] ?? '';
    updateGutter(editors[k]);
  }
  run();
}

// ---- running the code ----

let runId = '';

function run() {
  // A new srcdoc gives the code a fresh page every run, so old timers and listeners don't pile up
  const project = current();
  runId = Math.random().toString(36).slice(2);
  const draft = buildDocument(project, { head: bridgeScript(runId, 0) });
  const head = bridgeScript(runId, jsStartLine(draft, project.js));
  clearConsole();
  $('preview').srcdoc = buildDocument(project, { head });
  $('updated').textContent = `Updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' })}`;
}

const runSoon = debounce(run, 500);        // wait for a short pause in typing
const saveDraftSoon = debounce(() => projects.saveDraft(current()), 800);

// ---- console: messages from the preview frame ----

const counts = { error: 0, warn: 0 };

function addLog(level, text, line) {
  $('logs').querySelector('.empty')?.remove();
  const li = document.createElement('li');
  li.className = level;
  li.textContent = text;
  if (line) {
    const tag = document.createElement('span');
    tag.className = 'line';
    tag.textContent = `JS line ${line}`;
    li.append(tag);
  }
  $('logs').append(li);
  while ($('logs').children.length > 500) $('logs').firstChild.remove();
  $('logs').scrollTop = $('logs').scrollHeight;
  if (level in counts) { counts[level]++; showCounts(); }
}

function showCounts() {
  $('counts').innerHTML = (counts.error ? `<span class="e">${counts.error} ✕</span>` : '') + (counts.warn ? `<span class="w">${counts.warn} ⚠</span>` : '');
}

function clearConsole() {
  counts.error = 0;
  counts.warn = 0;
  showCounts();
  $('logs').innerHTML = '<li class="empty">Nothing logged yet. Try console.log() in the JS pane.</li>';
}

addEventListener('message', (e) => {
  // Only trust messages from the preview frame, and only from the current run
  if (e.source !== $('preview').contentWindow || !e.data || e.data.lce !== runId) return;
  const { level, text, line } = e.data;
  if (level === 'clear') return clearConsole();
  addLog(level, text, line);
});

$('clearConsole').onclick = clearConsole;
$('toggleConsole').onclick = () => {
  const collapsed = $('toggleConsole').closest('.console').classList.toggle('collapsed');
  $('toggleConsole').setAttribute('aria-expanded', String(!collapsed));
};
$('evalForm').onsubmit = (e) => {
  e.preventDefault();
  const code = $('evalInput').value.trim();
  if (!code) return;
  addLog('input', code);
  $('preview').contentWindow.postMessage({ lceEval: runId, code }, '*');
  $('evalInput').value = '';
};

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
    saveDraftSoon();
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

function toast(message) {
  $('toast').textContent = message;
  $('toast').classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $('toast').classList.remove('show'), 2200);
}

// ---- templates ----

const ALL_TEMPLATES = { ...TEMPLATES, ...PROJECT_TEMPLATES };
const group = (label, list) => {
  const g = document.createElement('optgroup');
  g.label = label;
  for (const [id, t] of Object.entries(list)) g.append(new Option(t.name, id));
  $('template').append(g);
};
group('Examples', TEMPLATES);
group('My projects (bare bones)', PROJECT_TEMPLATES);
$('template').onchange = () => {
  const t = ALL_TEMPLATES[$('template').value];
  $('template').value = '';
  if (!t) return;
  const hasWork = Object.values(current()).some((v) => v.trim());
  if (hasWork && !confirm(`Replace your code with "${t.name}"?`)) return;
  setProject(t);
  projects.saveDraft(t);
  history.replaceState(null, '', location.pathname);       // the old share link no longer matches
};

// ---- share: the code goes in the link itself ----

$('share').onclick = async () => {
  const hash = await encodeProject(current());
  const url = `${location.origin}${location.pathname}#${hash}`;
  history.replaceState(null, '', `#${hash}`);
  try {
    await navigator.clipboard.writeText(url);
    toast('Link copied. Anyone with it sees this code.');
  } catch {
    prompt('Copy this link:', url);                           // clipboard can be blocked
  }
};

// ---- saving in this browser ----

function saveProject() {
  const name = prompt('Save as:', suggestName(editors.html.value));
  if (name === null) return;
  try {
    toast(`Saved "${projects.save(name, current())}"`);
  } catch (err) {
    toast(err.message);
  }
}

function showSaved() {
  const list = projects.list();
  $('savedList').innerHTML = list.length ? '' : '<li class="none">Nothing saved yet. Press Save to keep a copy here.</li>';
  for (const p of list) {
    const li = document.createElement('li');
    li.innerHTML = '<span class="name"></span><time></time><button type="button" class="open">Open</button><button type="button" class="delete" aria-label="Delete">✕</button>';
    li.querySelector('.name').textContent = p.name;
    li.querySelector('time').textContent = new Date(p.savedAt).toLocaleDateString();
    li.querySelector('.open').onclick = () => {
      setProject(p);
      projects.saveDraft(p);
      history.replaceState(null, '', location.pathname);
      $('savedDialog').close();
      toast(`Opened "${p.name}"`);
    };
    li.querySelector('.delete').onclick = () => {
      if (!confirm(`Delete "${p.name}"?`)) return;
      projects.remove(p.name);
      showSaved();
    };
    $('savedList').append(li);
  }
  if (!$('savedDialog').open) $('savedDialog').showModal();
}

$('save').onclick = saveProject;
$('openSaved').onclick = showSaved;
addEventListener('keydown', (e) => {
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveProject(); }
});

addEventListener('hashchange', async () => {
  const shared = await decodeProject(location.hash);
  if (shared) setProject(shared);
});

// ---- tabs on small screens ----

document.querySelectorAll('.tabs button').forEach((b) => {
  b.onclick = () => {
    document.querySelectorAll('.tabs button').forEach((t) => t.setAttribute('aria-pressed', String(t === b)));
    document.querySelectorAll('.pane').forEach((p) => p.classList.toggle('active', p.dataset.pane === b.dataset.pane));
  };
});

// Open a shared link if there is one, then the last draft, then the starter template
const shared = await decodeProject(location.hash);
if (location.hash && !shared) toast('That share link looks incomplete, so the starter code is shown instead.');
setProject(shared ?? projects.draft() ?? TEMPLATES.hello);
