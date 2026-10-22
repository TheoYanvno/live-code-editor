# Live Code Editor

**▶ [Open the editor](https://theoyanvno.github.io/live-code-editor/)**

Write HTML, CSS and JavaScript and see the result update as you type, like a small CodePen. It has a console that shows your `console.log` output and errors with line numbers, starter templates, links that share your code, and saves in the browser. No sign-up and no server.

**Tech:** vanilla JavaScript (ES modules) · HTML/CSS · sandboxed `<iframe srcdoc>` · `postMessage` · `CompressionStream` · `localStorage` · `node:test`

![The editor running a to-do list, with console output](docs/editor.png)

<img src="docs/phone.png" alt="The editor on a phone, showing the JS tab" width="300">

## Features

- **Live preview:** runs your code half a second after you stop typing (or turn off Auto-run and press Run / Ctrl+Enter)
- **Console panel:** `console.log`, `warn` and `error` output, uncaught errors and rejected promises, with the line number in the JS pane. Type an expression at the bottom to run it inside the page.
- **Share:** copies a link with your code compressed into it; opening the link loads the code
- **Save** projects by name in your browser (Ctrl+S), and your work is kept automatically as a draft between visits
- **Templates:** click counter, responsive CSS Grid cards, a to-do list, a canvas animation, and promises with async/await
- **Project skeletons:** bare-bones starting points shaped like my other projects (hospital portal, character database, Snake, chess coach, SuperBook, task calendar, blog, quote generator, Sudoku solver and sticky notes). Each has the page layout and empty function stubs, with no working code, so you can build it up yourself.
- Editor comforts: line numbers, Tab inserts spaces, new lines keep the indentation
- On a phone, tabs switch between HTML, CSS, JS and Result

## How it works

**Running your code safely.** The result is an `<iframe>` with `sandbox="allow-scripts"` and *without* `allow-same-origin`. Your code runs in its own unique origin, so it can't read the editor page, its saved projects or its cookies. Each run sets a fresh `srcdoc`, so timers and event listeners from the previous run don't pile up.

**Building the page** ([`src/preview.js`](src/preview.js)). Your HTML is wrapped in a page with the CSS in the `<head>` and the JS at the end of the `<body>`. If you write a full page with `<html>` or `<body>`, your structure is kept and the CSS and JS are added in the right places. A `</script>` inside your JS (in a string, for example) would end the script tag early, so it's escaped as `<\/script>`, which means the same thing in JavaScript.

**The console** ([`src/console-bridge.js`](src/console-bridge.js)). Because the frame is sandboxed, the editor can't see its console directly. A small script is added to the top of the page that wraps `console.log` and friends, listens for `error` and `unhandledrejection`, and sends each message to the editor with `postMessage`. Each run has a random id, and the editor ignores messages from older runs or from any other window. Values are turned into readable text (objects, arrays, Maps, elements, circular references) before they're sent.

**Error line numbers.** The browser reports a line in the whole generated page. The editor works out where your JS starts in that page and subtracts, so "JS line 3" matches line 3 in the JS pane.

**Share links** ([`src/share.js`](src/share.js)). The three panes are saved as JSON, compressed with the built-in `CompressionStream('deflate-raw')`, and written as URL-safe base64 after the `#`. The part after `#` is never sent to a server, so the code stays between you and the person you share it with.

**Saving** ([`src/storage.js`](src/storage.js)). Projects are stored in `localStorage`. Every read and write is wrapped in `try/catch`, because storage can be blocked in private windows; if saving isn't possible, you're told to use Share instead.

## Run it

No install needed. Serve the folder (ES modules don't load from `file://`):

```bash
npm start      # python3 -m http.server 8000, then open http://localhost:8000
npm test       # 22 tests (Node 18+)
```

| File | What it does |
|---|---|
| `src/app.js` | The editor UI: panes, running, console panel, templates, share, save |
| `src/preview.js` | Builds the preview page; debounce |
| `src/console-bridge.js` | The script injected into the preview, and value formatting |
| `src/share.js` | Compressing code into the URL and back |
| `src/storage.js` | Saved projects and the automatic draft |
| `src/templates.js` | Starter projects |
| `src/project-templates.js` | Bare-bones skeletons of my other projects |

Built with help from AI coding tools for planning, code review and tests.
