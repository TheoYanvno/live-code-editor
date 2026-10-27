# Writing a guide

Each guide is one Markdown file here. `npm run guides` turns them into the modules in `src/lessons/` that the tutor loads, and `npm test` checks that every step's answer passes its own checks.

````
---
id: snake                     # file name in src/lessons/ and the id in src/lessons/index.js
title: Snake
blocks-html: page             # the named blocks of code in each pane, in the order they appear
blocks-css: base
blocks-js: setup, state, rules, draw, loop, controls, go
---

## Step: Moving one cell at a time

Explanation in Markdown: paragraphs, ### headings, lists, > tips, `code`, **bold**,
[links](https://...) and ```js examples```.

check: js | a step() function | /function\s+step\s*\(/ | Hint shown when it's missing

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
- `check:` lines are what **Check my work** looks for: `pane | label | /regex/flags | hint`. Comments in the learner's code are ignored. Each check should fail on the step's starting code and pass on its answer; the tests make sure of both.
