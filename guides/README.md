# Writing a guide

Each guide is one Markdown file here. `npm run guides` turns them into the modules in `src/lessons/` that the tutor loads, and `npm test` checks that every step's answer passes its own checks.

````
---
id: snake                     # file name in src/lessons/ and the id in src/lessons/index.js
title: Snake
goals: Draw on a canvas; Run a game loop; Keep rules separate from drawing   # shown in the lesson plan
prereqs: Basic HTML and CSS; Variables, functions and arrays in JavaScript
blocks-html: page             # the named blocks of code in each pane, in the order they appear
blocks-css: base
blocks-js: setup, state, rules, draw, loop, controls, go
---

## Session: A snake that moves  # a group of steps for one sitting; each session is one push

## Step: Moving one cell at a time
time: 12                      # minutes the step should take: the pace timer and lesson plan use it

Explanation in Markdown: paragraphs, ### headings, lists, > tips, `code`, **bold**,
| tables |, [links](https://...) and ```js examples```.

```svg How the head moves: a new cell in front, the tail cell removed
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">...</svg>
```

check: js | a step() function | /function\s+step\s*\(/ | Hint shown when it's missing

quiz: Why does moving only change the two ends of the array?
- [ ] Arrays can't be changed in the middle
- [x] Every middle segment takes the place of the one in front of it, so they don't need to change
- [ ] The tail moves twice as fast as the head
why: Adding a head and removing the tail gives the same cells as moving every segment forward.

```js rules
function step() {
  // the full new version of the "rules" block after this step
}
```

## Step: How the real project is organized
kind: read                    # a read-along step: no checks, nothing to type

## Finish
What you learned, and some challenges.
````

- A code block whose info string is a pane and a block name (`js rules`) sets that block's code for this step. Blocks keep their place, so a step only lists the blocks it changes. `remove: js rules` deletes one.
- Any other code block is an example shown in the explanation.
- `## Session:` groups steps into sittings. The lesson plan lists sessions with their planned minutes, and each session ends with a working project, so it's also how a guide is published: one session per push.
- `time:` is how many minutes a step should take. The ⏱ pace timer compares the learner's time with it.
- `quiz:` asks a multiple-choice question after the step. Mark the right option `- [x]`, give at least three options and a `why:` line. Every step you write code in needs at least one question.
- ```` ```svg Caption ```` is a diagram. It's shown as an image (so nothing in it can run) with the caption underneath. Every guide needs at least three.
- `check:` lines are what **Check my work** looks for: `pane | label | /regex/flags | hint`. Comments in the learner's code are ignored. Each check should fail on the step's starting code and pass on its answer; the tests make sure of both.
