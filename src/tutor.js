// Code Tutor: step-by-step guides that teach how each of my projects is built, right next to the editor.
// Each guide opens with a lesson plan (goals and sessions with planned minutes). The guide panel
// loads each step's starting code into the editor, explains what to write and why (with diagrams),
// checks your code, can show or load the answer, asks a short quiz, and times each step against
// its plan so you can keep your pace. Guides live in src/lessons/.
import { assemble, startOf, renderMarkdown, lineDiff, changedLines, runChecks, Progress, lessonPlan, pace, clock, gradeQuiz } from './tutor-core.js';
import { GUIDES } from './lessons/index.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PANE_NAMES = { html: 'HTML', css: 'CSS', js: 'JavaScript' };

const progress = new Progress();
let editor;                 // { getCode, setCode, toast } from app.js
let guide = null;           // the open guide (assembled)
let at = 0;                 // the step on screen
let timer = null;           // the pace timer's interval
let lastTick = 0;           // when the timer last counted
let unsaved = 0;            // seconds counted but not saved yet

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
  stopTimer();
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
  stopTimer();
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
  const p = progress.get(id);
  at = Math.min(p.step, guide.steps.length);          // steps.length = the finish page
  if (!p.done.length && !Object.keys(p.time).length) return showPlan();   // first visit: the lesson plan
  loadStepCode(true);
  showStep();
}

// ---- the pace timer: counts time on a step while the guide is open and the tab is visible ----

function startTimer() {
  stopTimer();
  lastTick = Date.now();
  timer = setInterval(() => {
    const now = Date.now();
    if (!document.hidden && document.body.classList.contains('tutoring')) unsaved += (now - lastTick) / 1000;
    lastTick = now;
    if (unsaved >= 15) saveTime();
    showPace();
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
  timer = null;
  saveTime();
}

function saveTime() {
  if (guide && unsaved > 0 && at < guide.steps.length) progress.addTime(guide.id, at, unsaved);
  unsaved = 0;
}

function showPace() {
  const chip = $('tPace');
  if (!chip || !guide || at >= guide.steps.length) return;
  const planned = guide.steps[at].minutes ?? 0;
  const spent = (progress.get(guide.id).time[at] ?? 0) + unsaved;
  const { status } = pace(planned, spent);
  chip.className = `pace ${status}`;
  chip.querySelector('.p-time').textContent = clock(spent);
  const note = { early: 'plenty of time', on: 'on pace', over: 'a little over, keep going', long: 'stuck? try a hint or Show what changes', none: '' }[status];
  chip.querySelector('.p-note').textContent = note;
  chip.style.setProperty('--fill', `${Math.min(100, Math.round((100 * spent) / Math.max(1, planned * 60)))}%`);
}

document.addEventListener('visibilitychange', () => { lastTick = Date.now(); if (document.hidden) saveTime(); });
window.addEventListener('pagehide', saveTime);

// ---- the lesson plan ----

const mins = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? ` ${m % 60} min` : ''}` : `${m} min`);

function showPlan() {
  stopTimer();
  const plan = lessonPlan(guide);
  const p = progress.get(guide.id);
  const spentIn = (x) => x.steps.reduce((t, st) => t + (p.time[st.index] ?? 0), 0);
  const quizCount = guide.steps.reduce((t, st) => t + (st.quiz?.length ?? 0), 0);
  const started = p.done.length || Object.keys(p.time).length;
  $('tutor').innerHTML = `
    <header class="t-head"><button class="link" data-act="list">← All guides</button>
      <p class="t-guide">${guide.emoji} ${esc(guide.title)}</p><h2>Lesson plan</h2>
      <p class="muted">${guide.steps.length} steps in ${plan.sessions.length} session${plan.sessions.length > 1 ? 's' : ''} · about ${mins(plan.minutes)} · ${quizCount} quiz questions</p></header>
    <article class="t-body">
      ${guide.goals?.length ? `<h3>By the end you'll be able to</h3><ul>${guide.goals.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
      ${guide.prereqs?.length ? `<h3>Before you start</h3><ul>${guide.prereqs.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : ''}
      <h3>Sessions</h3>
      <p>Take one session per sitting. Each one ends at a point where your project works, so it's a good place to stop.</p>
      <ol class="plan">${plan.sessions.map((x, n) => {
        const spent = spentIn(x);
        const pct = Math.min(100, Math.round((100 * spent) / Math.max(1, x.minutes * 60)));
        return `<li class="plan-session">
          <div class="ps-head"><strong>Session ${n + 1}: ${esc(x.title)}</strong><span class="muted">${mins(x.minutes)}${spent ? ` · you: ${clock(spent)}` : ''}</span></div>
          <span class="ps-bar" aria-hidden="true"><span data-fill="${pct}"></span></span>
          <ul class="ps-steps">${x.steps.map((st) => `<li><button class="link" data-go="${st.index}">${st.index + 1}. ${esc(st.title)}</button>
            <span class="muted">${st.minutes ? `${st.minutes} min` : ''}${p.done.includes(st.index) ? ' ✓' : ''}</span></li>`).join('')}</ul>
        </li>`;
      }).join('')}</ol>
      <h3>How pacing works</h3>
      <p>Each step has a planned time. The ⏱ pace timer at the top of a step counts while the guide is open and turns amber when you go over. That's fine: it's a nudge to try a hint or <strong>Show what changes</strong>, not a test. Each step ends with a short quiz to check you understood the idea, not just the code.</p>
    </article>
    <nav class="t-nav"><span></span>
      <button data-act="start" class="primary">${started ? 'Continue' : 'Start step 1'} →</button></nav>`;
  for (const el of document.querySelectorAll('.ps-bar [data-fill]')) el.style.width = `${el.dataset.fill}%`;
  $('tutor').scrollTop = 0;
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
  stopTimer();
  if (at >= guide.steps.length) return showFinish();
  const step = guide.steps[at];
  const total = guide.steps.length;
  const p = progress.get(guide.id);
  const done = p.done;
  const plan = lessonPlan(guide);
  const sn = plan.sessions.findIndex((x) => at >= x.from && at <= x.to);
  progress.goTo(guide.id, at);
  $('tutor').innerHTML = `
    <header class="t-head">
      <button class="link" data-act="list">← All guides</button>
      <p class="t-guide">${guide.emoji} ${esc(guide.title)} <button class="link" data-act="plan">📋 Lesson plan</button></p>
      <div class="t-progress" aria-label="Step ${at + 1} of ${total}">
        ${guide.steps.map((s, i) => `<button class="dot${i === at ? ' here' : ''}${done.includes(i) ? ' done' : ''}" data-go="${i}" title="Step ${i + 1}: ${esc(s.title)}" aria-label="Step ${i + 1}: ${esc(s.title)}${done.includes(i) ? ' (done)' : ''}"></button>`).join('')}
      </div>
      <p class="t-count">${plan.sessions.length > 1 ? `Session ${sn + 1} of ${plan.sessions.length}: ${esc(plan.sessions[sn].title)} · ` : ''}Step ${at + 1} of ${total}${step.kind === 'read' ? ' · read-along' : ''}</p>
      <h2>${esc(step.title)}</h2>
      ${step.minutes ? `<p id="tPace" class="pace" role="timer" aria-live="off"><span class="p-fill" aria-hidden="true"></span>⏱ <span class="p-time">0:00</span> of about ${step.minutes} min · <span class="p-note"></span></p>` : ''}
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
    ${step.quiz?.length ? `
    <section class="t-quiz">
      <h3>Quick quiz</h3>
      ${step.quiz.map((q, k) => quizQuestion(q, k, p.quiz[`${at}.${k}`])).join('')}
    </section>` : ''}
    <nav class="t-nav">
      <button data-act="prev" ${at === 0 ? 'disabled' : ''}>← Back</button>
      <button data-act="restart" class="link">Start this step over</button>
      <button data-act="next" class="primary">${at === total - 1 ? 'Finish' : 'Next step →'}</button>
    </nav>`;
  $('tutor').scrollTop = 0;
  showPace();
  startTimer();
}

function quizQuestion(q, k, picked) {
  const answered = picked !== undefined;
  return `<div class="q${answered ? ' answered' : ''}" data-q="${k}">
    <p class="q-text">${renderInline(q.q)}</p>
    <div class="q-options" role="group" aria-label="Answers">${q.options.map((o, n) => {
      const cls = answered ? (n === q.answer ? ' right' : n === picked ? ' wrong' : '') : '';
      return `<button class="q-opt${cls}" data-quiz="${k}" data-opt="${n}" ${answered ? 'disabled' : ''}>${renderInline(o)}</button>`;
    }).join('')}</div>
    ${answered ? `<p class="q-why ${picked === q.answer ? 'pass' : 'fail'}">${picked === q.answer ? '✓ Right.' : '✗ Not quite.'} ${q.why ? renderInline(q.why) : ''}</p>` : ''}
  </div>`;
}

/** Markdown for one line (quiz text): bold, code and links, without a wrapping paragraph. */
const renderInline = (text) => renderMarkdown(text).replace(/^<p>|<\/p>$/g, '');

function answerQuiz(k, n) {
  const key = `${at}.${k}`;
  const p = progress.answer(guide.id, key, n);
  const q = guide.steps[at].quiz[k];
  document.querySelector(`.q[data-q="${k}"]`).outerHTML = quizQuestion(q, k, p.quiz[key]);
}

function showFinish() {
  stopTimer();
  progress.goTo(guide.id, guide.steps.length);
  const p = progress.get(guide.id);
  const done = p.done.length;
  const plan = lessonPlan(guide);
  const quiz = gradeQuiz(guide.steps, p.quiz);
  const spent = progress.totalTime(guide.id);
  $('tutor').innerHTML = `
    <header class="t-head"><button class="link" data-act="list">← All guides</button>
      <p class="t-guide">${guide.emoji} ${esc(guide.title)}</p><h2>You built it! 🎉</h2></header>
    <dl class="t-stats">
      <div><dt>Steps checked off</dt><dd>${done} of ${guide.steps.length}</dd></div>
      <div><dt>Quiz</dt><dd>${quiz.answered ? `${quiz.right} of ${quiz.answered} right (${quiz.percent}%)` : 'not taken'}${quiz.answered < quiz.total ? ` · ${quiz.total - quiz.answered} unanswered` : ''}</dd></div>
      <div><dt>Your time</dt><dd>${clock(spent)} <span class="muted">(plan: about ${mins(plan.minutes)})</span></dd></div>
    </dl>
    <p><button class="link" data-act="plan">📋 See your time for each session</button></p>
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
  if (b.dataset.quiz) return answerQuiz(Number(b.dataset.quiz), Number(b.dataset.opt));
  if (b.dataset.go) { saveTime(); at = Number(b.dataset.go); loadStepCode(); return showStep(); }
  switch (b.dataset.act) {
    case 'list': return showList();
    case 'plan': return showPlan();
    case 'start': at = Math.min(at, guide.steps.length); loadStepCode(true); return showStep();
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
    case 'prev': saveTime(); at = Math.max(0, at - 1); loadStepCode(); return showStep();
    case 'next':                       // keep the learner's own code: the next step builds on it
      saveTime();
      if (!guide.steps[at].checks?.length) progress.complete(guide.id, at);
      at += 1;
      return showStep();
    case 'reset':
      if (!confirm(`Reset your progress in the ${guide.title} guide?`)) return;
      unsaved = 0;
      progress.reset(guide.id);
      at = 0;
      editor.setCode(guide.start);
      return showStep();
    default:
  }
}
