// Turns the guides in guides/*.md into src/lessons/*.js modules the tutor loads.
// Guides are written in Markdown with a few extra lines (see guides/README.md):
//   ## Step: Title          starts a step          ## Finish   the page shown at the end
//   kind: read              a read-along step (no checks)
//   check: js | label | /regex/flags | hint      something "Check my work" looks for
//   ```js blockName         code for the editor: sets that named block in the JS pane
//   remove: js blockName    removes a block
//   ## Session: Title       starts a session: a group of steps meant for one sitting
//   time: 15                minutes the step should take (the pace timer and the lesson plan use it)
//   quiz: Question?         a multiple-choice question, followed by "- [ ] wrong" / "- [x] right"
//                           options and an optional "why: explanation" line
// Any other ``` block is an example shown in the explanation (```svg Caption``` is a diagram).
// Run: node scripts/build-guides.js   (npm run guides)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const PANES = new Set(['html', 'css', 'js']);

export function parseGuide(text, file = 'guide') {
  const [, front, rest] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  if (!front) throw new Error(`${file}: missing --- front matter ---`);
  const meta = Object.fromEntries(front.split('\n').filter(Boolean).map((l) => {
    const i = l.indexOf(':');
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  }));
  const start = {};
  for (const pane of PANES) {
    const names = meta[`blocks-${pane}`];
    if (names) start[pane] = Object.fromEntries(names.split(',').map((n) => [n.trim(), '']));
  }

  const steps = [];
  const sessions = [];
  let finish = '';
  let current = null;                  // the step being read, or 'finish'
  let quiz = null;                     // the question being read
  const lines = rest.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const session = line.match(/^## Session:\s*(.+?)\s*$/);
    if (session) { sessions.push({ title: session[1], first: steps.length }); current = null; quiz = null; continue; }
    const heading = line.match(/^## (Step: (.+)|Finish)\s*$/);
    if (heading) {
      quiz = null;
      if (heading[2]) {
        current = { title: heading[2].trim(), body: [], checks: [], quiz: [] };
        if (sessions.length) current.session = sessions.length - 1;
        steps.push(current);
      } else current = 'finish';
      continue;
    }
    if (current === 'finish') { finish += `${line}\n`; continue; }
    if (!current) continue;

    const fence = line.match(/^```(\w+)\s+([\w-]+)\s*$/);
    if (fence && PANES.has(fence[1])) {
      const body = [];
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) body.push(lines[i]);
      if (i >= lines.length) throw new Error(`${file}: unclosed code block in "${current.title}"`);
      current[fence[1]] = { ...current[fence[1]], [fence[2]]: body.join('\n') };
      continue;
    }
    if (/^```/.test(line)) {                      // an example in the explanation: copy it through untouched
      current.body.push(line);
      for (i++; i < lines.length && !/^```\s*$/.test(lines[i]); i++) current.body.push(lines[i]);
      current.body.push('```');
      continue;
    }
    const q = line.match(/^quiz:\s*(.+)$/);
    if (q) { quiz = { q: q[1].trim(), options: [], answer: -1 }; current.quiz.push(quiz); continue; }
    const option = quiz && line.match(/^- \[( |x)\]\s+(.+)$/);
    if (option) {
      if (option[1] === 'x') {
        if (quiz.answer >= 0) throw new Error(`${file}: two right answers for "${quiz.q}"`);
        quiz.answer = quiz.options.length;
      }
      quiz.options.push(option[2].trim());
      continue;
    }
    const why = quiz && line.match(/^why:\s*(.+)$/);
    if (why) { quiz.why = why[1].trim(); quiz = null; continue; }
    if (quiz && line.trim()) quiz = null;           // anything else ends the question
    const time = line.match(/^time:\s*(\d+)\s*$/);
    if (time) { current.minutes = Number(time[1]); continue; }
    const kind = line.match(/^kind:\s*(\w+)\s*$/);
    if (kind) { current.kind = kind[1]; continue; }
    const remove = line.match(/^remove:\s*(html|css|js)\s+([\w-]+)\s*$/);
    if (remove) { current[remove[1]] = { ...current[remove[1]], [remove[2]]: null }; continue; }
    const check = line.match(/^check:\s*(html|css|js)\s*\|\s*(.+?)\s*\|\s*(\/.+\/[a-z]*)\s*(?:\|\s*(.+))?$/);
    if (check) {
      const [, pane, label, test, hint] = check;
      new RegExp(test.slice(1, test.lastIndexOf('/')), test.slice(test.lastIndexOf('/') + 1));   // fail the build on a bad regex
      current.checks.push({ pane, label, test, ...(hint ? { hint } : {}) });
      continue;
    }
    if (/^check:/.test(line)) throw new Error(`${file}: can't read this check line: ${line}`);
    current.body.push(line);
  }
  for (const s of steps) {
    s.body = s.body.join('\n').trim();
    if (!s.checks.length) delete s.checks;
    if (!s.quiz.length) delete s.quiz;
    for (const q of s.quiz ?? []) {
      if (q.options.length < 2 || q.answer < 0) throw new Error(`${file}: the question "${q.q}" in "${s.title}" needs options and one [x] right answer`);
    }
    for (const pane of PANES) {
      for (const name of Object.keys(s[pane] ?? {})) {
        if (start[pane] && !(name in start[pane])) throw new Error(`${file}: block "${pane} ${name}" in "${s.title}" isn't listed in blocks-${pane}`);
      }
    }
  }
  const list = (v) => (v ? v.split(';').map((x) => x.trim()).filter(Boolean) : []);
  return {
    id: meta.id, title: meta.title,
    goals: list(meta.goals), prereqs: list(meta.prereqs),
    sessions: sessions.map((x, n) => ({ title: x.title, from: x.first, to: (sessions[n + 1]?.first ?? steps.length) - 1 })),
    start, steps, finish: finish.trim(),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const name of readdirSync(`${root}guides`).filter((f) => f.endsWith('.md') && f !== 'README.md')) {
    const guide = parseGuide(readFileSync(`${root}guides/${name}`, 'utf8'), name);
    const out = `${root}src/lessons/${guide.id}.js`;
    writeFileSync(out, `// Built from guides/${name} by scripts/build-guides.js. Edit the guide, not this file.\nexport default ${JSON.stringify(guide, null, 1)};\n`);
    console.log(`${name} → src/lessons/${guide.id}.js (${guide.steps.length} steps)`);
  }
}
