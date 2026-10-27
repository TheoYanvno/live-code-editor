// Code Tutor: step-by-step guides that teach how each of my projects is built, right next to the editor.
// The guide panel loads each step's starting code into the editor, explains what to write and why,
// checks your code, and can show or load the answer. Guides live in src/lessons/.
import { assemble, startOf, renderMarkdown, lineDiff, changedLines, runChecks, Progress } from './tutor-core.js';
import { GUIDES } from './lessons/index.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PANE_NAMES = { html: 'HTML', css: 'CSS', js: 'JavaScript' };

const progress = new Progress();
let editor;                 // { getCode, setCode, toast } from app.js
let guide = null;           // the open guide (assembled)
let at = 0;                 // the step on screen

const sameCode = (a, b) => ['html', 'css', 'js'].every((p) => (a[p] ?? '').trim() === (b[p] ?? '').trim());
const hasWork = (code) => Object.values(code).some((v) => v.trim());

export function initTutor(api) {
  editor = api;
  $('learn').onclick = () => (document.body.classList.contains('tutoring') ? close() : open());
  $('tutor').addEventListener('click', onClick);
  if (new URLSearchParams(location.search).has('learn') || sessionStorageGet('tutor-open')) open();
}

function sessionStorageGet(key) { try { return sessionStorage.getItem(key); } catch { return null; } }
function sessionStorageSet(key, value) { try { value ? sessionStorage.setItem(key, value) : sessionStorage.removeItem(key); } catch { /* ignore */ } }

function open() {
  document.body.classList.add('tutoring');
  $('learn').setAttribute('aria-pressed', 'true');
  sessionStorageSet('tutor-open', '1');
  showTab('guide');
  if (guide) showStep(); else showList();
}

function close() {
  document.body.classList.remove('tutoring');
  $('learn').setAttribute('aria-pressed', 'false');
  sessionStorageSet('tutor-open', '');
  if (document.querySelector('.tabs [data-pane="guide"][aria-pressed="true"]')) showTab('html');
}

function showTab(name) {
  const tab = document.querySelector(`.tabs [data-pane="${name}"]`);
  if (tab && getComputedStyle(document.querySelector('.tabs')).display !== 'none') tab.click();
}

// ---- the list of guides ----

function showList() {
  guide = null;
  const cards = GUIDES.map((g) => {
    const p = progress.get(g.id);
    const pct = g.steps ? Math.round((100 * p.done.length) / g.steps) : 0;
    const status = !g.available ? '<span class="soon">Coming soon</span>'
      : p.done.length ? `<span class="pct">${pct}% done</span>` : `<span class="pct">${g.steps} steps</span>`;
    return `<li class="guide-card${g.available ? '' : ' locked'}">
      <button ${g.available ? `data-open="${g.id}"` : 'disabled'}>
        <span class="g-emoji" aria-hidden="true">${g.emoji}</span>
        <span class="g-body"><strong>${esc(g.title)}</strong><span class="g-meta">${esc(g.level)} · ${esc(g.time)}</span>
        <span class="g-sum">${esc(g.summary)}</span></span>
        ${status}
      </button>${g.available && p.done.length ? `<span class="bar"><span style="width:${pct}%"></span></span>` : ''}
    </li>`;
  }).join('');
  $('tutor').innerHTML = `
    <header class="t-head"><h2>Learn to build my projects</h2>
      <p class="muted">Each guide rebuilds one of my portfolio projects from a blank page, one small step at a time.
      Read the step, write the code in the editor, then press <strong>Check my work</strong>. Stuck? Show or load the answer.</p></header>
    <ol class="guides">${cards}</ol>`;
  $('tutor').scrollTop = 0;
}

// ---- one guide ----

async function openGuide(id) {
  const entry = GUIDES.find((g) => g.id === id);
  $('tutor').innerHTML = '<p class="muted t-loading">Loading the guide…</p>';
  const data = (await entry.load()).default;
  guide = { ...entry, ...data, ...assemble(data.start, data.steps) };
  at = Math.min(progress.get(id).step, guide.steps.length);          // steps.length = the finish page
  loadStepCode(true);
  showStep();
}

/** Puts this step's starting code in the editor (asks first if the editor has different code). */
function loadStepCode(quiet = false) {
  if (at >= guide.steps.length) return;
  const start = startOf(guide, at);
  const now = editor.getCode();
  if (sameCode(now, start)) return;
  if (sameCode(now, guide.steps[at].code)) return;                     // already finished this step
  if (hasWork(now) && !confirm(`Load the starting code for step ${at + 1}? Your current code will be replaced (press Save first to keep it).`)) {
    if (!quiet) editor.toast('Kept your code');
    return;
  }
  editor.setCode(start);
}

function showStep() {
  if (at >= guide.steps.length) return showFinish();
  const step = guide.steps[at];
  const total = guide.steps.length;
  const done = progress.get(guide.id).done;
  progress.goTo(guide.id, at);
  $('tutor').innerHTML = `
    <header class="t-head">
      <button class="link" data-act="list">← All guides</button>
      <p class="t-guide">${guide.emoji} ${esc(guide.title)}</p>
      <div class="t-progress" aria-label="Step ${at + 1} of ${total}">
        ${guide.steps.map((s, i) => `<button class="dot${i === at ? ' here' : ''}${done.includes(i) ? ' done' : ''}" data-go="${i}" title="Step ${i + 1}: ${esc(s.title)}" aria-label="Step ${i + 1}: ${esc(s.title)}${done.includes(i) ? ' (done)' : ''}"></button>`).join('')}
      </div>
      <p class="t-count">Step ${at + 1} of ${total}${step.kind === 'read' ? ' · read-along' : ''}</p>
      <h2>${esc(step.title)}</h2>
    </header>
    <article class="t-body">${renderMarkdown(step.body)}</article>
    ${step.checks?.length ? `
    <section class="t-task">
      <h3>Your turn</h3>
      <ul class="checks">${step.checks.map((c, i) => `<li data-check="${i}"><span class="mark" aria-hidden="true">○</span> ${esc(c.label)}</li>`).join('')}</ul>
      <div class="t-actions">
        <button class="primary" data-act="check">Check my work</button>
        <button data-act="diff" aria-expanded="false">Show what changes</button>
        <button data-act="answer">Load the answer</button>
      </div>
      <div id="tDiff" class="t-diff" hidden></div>
      <p class="t-result" id="tResult" role="status"></p>
    </section>` : `
    <section class="t-task"><div class="t-actions">
      <button data-act="diff" aria-expanded="false">Show the code for this step</button>
      <button data-act="answer">Load it into the editor</button></div>
      <div id="tDiff" class="t-diff" hidden></div></section>`}
    <nav class="t-nav">
      <button data-act="prev" ${at === 0 ? 'disabled' : ''}>← Back</button>
      <button data-act="restart" class="link">Start this step over</button>
      <button data-act="next" class="primary">${at === total - 1 ? 'Finish' : 'Next step →'}</button>
    </nav>`;
  $('tutor').scrollTop = 0;
}

function showFinish() {
  progress.goTo(guide.id, guide.steps.length);
  const done = progress.get(guide.id).done.length;
  $('tutor').innerHTML = `
    <header class="t-head"><button class="link" data-act="list">← All guides</button>
      <p class="t-guide">${guide.emoji} ${esc(guide.title)}</p><h2>You built it! 🎉</h2>
      <p class="muted">${done} of ${guide.steps.length} steps checked off.</p></header>
    <article class="t-body">${renderMarkdown(guide.finish ?? '')}</article>
    <nav class="t-nav"><button data-act="prev">← Last step</button>
      <button data-act="reset" class="link">Reset this guide</button>
      <button data-act="list" class="primary">More guides</button></nav>`;
  $('tutor').scrollTop = 0;
}

function showDiff(button) {
  const box = $('tDiff');
  const open = box.hidden;
  box.hidden = !open;
  button.setAttribute('aria-expanded', String(open));
  if (!open) return;
  const before = startOf(guide, at);
  const after = guide.steps[at].code;
  box.innerHTML = ['html', 'css', 'js'].map((p) => {
    const diff = lineDiff(before[p], after[p]);
    if (!diff.some((d) => d.type !== 'same')) return '';
    return `<h4>${PANE_NAMES[p]}</h4><pre class="diff">${changedLines(diff).map((d) =>
      d.type === 'gap' ? '<span class="gap">⋯</span>' : `<span class="${d.type}">${d.type === 'add' ? '+' : d.type === 'del' ? '−' : ' '} ${esc(d.text)}</span>`).join('\n')}</pre>`;
  }).join('') || '<p class="muted">Nothing changes in the code for this step.</p>';
}

function check() {
  const results = runChecks(editor.getCode(), guide.steps[at].checks);
  results.forEach((r, i) => {
    const li = document.querySelector(`[data-check="${i}"]`);
    li.classList.toggle('ok', r.ok);
    li.classList.toggle('no', !r.ok);
    li.querySelector('.mark').textContent = r.ok ? '✓' : '✗';
    li.querySelector('.hint')?.remove();
    if (!r.ok && r.hint) li.insertAdjacentHTML('beforeend', `<span class="hint">${esc(r.hint)}</span>`);
  });
  const passed = results.every((r) => r.ok);
  $('tResult').textContent = passed ? 'Nice work! Everything for this step is there. Check the result, then go to the next step.'
    : `${results.filter((r) => r.ok).length} of ${results.length} so far. Read the hints, or press Show what changes.`;
  $('tResult').className = `t-result ${passed ? 'pass' : 'fail'}`;
  if (passed) {
    progress.complete(guide.id, at);
    document.querySelector(`.dot[data-go="${at}"]`)?.classList.add('done');
  }
}

function onClick(e) {
  const b = e.target.closest('button');
  if (!b) return;
  if (b.dataset.open) return openGuide(b.dataset.open);
  if (b.dataset.go) { at = Number(b.dataset.go); loadStepCode(); return showStep(); }
  switch (b.dataset.act) {
    case 'list': return showList();
    case 'check': return check();
    case 'diff': return showDiff(b);
    case 'answer':
      if (hasWork(editor.getCode()) && !confirm('Replace your code with the answer for this step?')) return;
      editor.setCode(guide.steps[at].code);
      if (!guide.steps[at].checks?.length) progress.complete(guide.id, at);
      return editor.toast('Answer loaded. Read through it, then go on.');
    case 'restart':
      if (!confirm('Start this step over with its starting code?')) return;
      return editor.setCode(startOf(guide, at));
    case 'prev': at = Math.max(0, at - 1); loadStepCode(); return showStep();
    case 'next':                       // keep the learner's own code: the next step builds on it
      if (!guide.steps[at].checks?.length) progress.complete(guide.id, at);
      at += 1;
      return showStep();
    case 'reset':
      if (!confirm(`Reset your progress in the ${guide.title} guide?`)) return;
      progress.reset(guide.id);
      at = 0;
      editor.setCode(guide.start);
      return showStep();
    default:
  }
}
