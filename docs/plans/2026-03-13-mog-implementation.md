# MOG Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a brutalist three-column transmogrify tool that streams Claude responses via Netlify AI Gateway.

**Architecture:** Vite + React SPA with one Netlify serverless function. The function uses `@anthropic-ai/sdk` streaming (auto-configured by Netlify AI Gateway). Frontend reads the stream via `fetch` + `ReadableStream`.

**Tech Stack:** Vite, React, @anthropic-ai/sdk, Netlify Functions

---

### Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/App.css`

**Step 1: Create Vite project**

Run:
```bash
cd /Users/clark/Downloads/Source/mog
npm create vite@latest . -- --template react --no-interactive
```

If it complains about existing files, run with `--force` or answer prompts to overwrite.

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev -- --open
```

Expected: Default Vite + React page loads in browser. Kill the dev server after confirming.

**Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/ .gitignore
git commit -m "scaffold: init Vite + React project"
```

---

### Task 2: Install Anthropic SDK and set up Netlify function

**Files:**
- Create: `netlify/functions/transmogrify.mjs`

**Step 1: Install Anthropic SDK**

Run:
```bash
npm install @anthropic-ai/sdk
```

**Step 2: Create the serverless function**

Create `netlify/functions/transmogrify.mjs`:

```javascript
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are a content transmogrifier. You receive two inputs:

1. SOURCE CONTENT — raw text that is absolute law. Every single word, quote, fact, and detail must be accounted for in your output. Do not omit, summarize, or paraphrase anything.

2. TEMPLATE RAILS — a plain text template/mold that defines the FORMAT and STRUCTURE for the output. This template is REPEATABLE. If the source content has more items than the template shows, repeat the template pattern as many times as needed to cover ALL source content.

Your job:
- Take ALL content from the source (every word matters)
- Map it into the structure/format defined by the template rails
- Repeat the template pattern as many times as necessary
- Output plain text in the exact same format as the template
- Never drop content. Never add content that wasn't in the source.
- The template is a mold — the source content fills it.`;

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { source, template } = body;

  if (!source || !template) {
    return new Response("Missing source or template", { status: 400 });
  }

  const anthropic = new Anthropic();

  const stream = anthropic.messages.stream({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `=== SOURCE CONTENT ===\n${source}\n\n=== TEMPLATE RAILS ===\n${template}\n\n=== INSTRUCTIONS ===\nTransmogrify the source content into the template format. Repeat the template pattern as many times as needed. Account for every word in the source. Output ONLY the transmogrified result, no commentary.`,
      },
    ],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(new TextEncoder().encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(readableStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
};

export const config = {
  path: "/api/transmogrify",
};
```

**Step 3: Commit**

```bash
git add netlify/functions/transmogrify.mjs package.json package-lock.json
git commit -m "feat: add transmogrify serverless function with streaming"
```

---

### Task 3: Build the brutalist UI — App.css

**Files:**
- Modify: `src/App.css`
- Modify: `index.html` (add font)

**Step 1: Update index.html to use a monospace font from Google Fonts**

Replace the contents of `index.html` with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MOG — Transmogrify</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Step 2: Write App.css**

Replace `src/App.css` with the brutalist styles:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --black: #0a0a0a;
  --white: #f0f0f0;
  --gray: #2a2a2a;
  --mid: #666;
  --light: #ccc;
  --font: "JetBrains Mono", monospace;
}

html, body, #root {
  height: 100%;
  background: var(--black);
  color: var(--white);
  font-family: var(--font);
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ░░░ HEADER ░░░ */
.header {
  padding: 12px 20px;
  border-bottom: 2px solid var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header h1 {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 6px;
  text-transform: uppercase;
}

.header-decoration {
  font-size: 14px;
  color: var(--mid);
  letter-spacing: 2px;
}

/* ░░░ COLUMNS ░░░ */
.columns {
  display: flex;
  flex: 1;
  min-height: 0;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.column:not(:last-child) {
  border-right: 2px solid var(--white);
}

.column-header {
  padding: 10px 16px;
  border-bottom: 1px solid var(--gray);
  flex-shrink: 0;
}

.column-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.column-decoration {
  font-size: 10px;
  color: var(--mid);
  line-height: 1;
}

.column-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

/* ░░░ TEXTAREA ░░░ */
.column textarea {
  flex: 1;
  width: 100%;
  background: var(--black);
  color: var(--white);
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-family: var(--font);
  font-size: 13px;
  line-height: 1.6;
}

.column textarea::placeholder {
  color: var(--gray);
}

.column textarea:focus {
  background: #111;
}

/* ░░░ BUTTONS ░░░ */
.btn {
  background: var(--white);
  color: var(--black);
  border: none;
  padding: 4px 12px;
  font-family: var(--font);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: none;
}

.btn:hover {
  background: var(--black);
  color: var(--white);
  outline: 2px solid var(--white);
}

.btn:active {
  background: var(--mid);
  color: var(--black);
}

.btn-file {
  background: transparent;
  color: var(--mid);
  outline: 1px solid var(--gray);
}

.btn-file:hover {
  color: var(--white);
  outline: 1px solid var(--white);
  background: transparent;
}

/* ░░░ FOOTER / SUBMIT ░░░ */
.footer {
  border-top: 2px solid var(--white);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.btn-submit {
  background: var(--white);
  color: var(--black);
  padding: 10px 32px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 4px;
}

.btn-submit:disabled {
  background: var(--gray);
  color: var(--mid);
  cursor: not-allowed;
  outline: none;
}

.btn-submit:disabled:hover {
  background: var(--gray);
  color: var(--mid);
  outline: none;
}

.footer-status {
  font-size: 11px;
  color: var(--mid);
  letter-spacing: 2px;
}

.footer-decoration {
  font-size: 14px;
  color: var(--gray);
}

/* ░░░ LOADING ░░░ */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.loading .footer-status {
  animation: blink 1s infinite;
  color: var(--white);
}
```

**Step 3: Commit**

```bash
git add src/App.css index.html
git commit -m "style: brutalist UI with monospace + ASCII decoration"
```

---

### Task 4: Build the React component — App.jsx

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

**Step 1: Update main.jsx to be minimal**

Replace `src/main.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

**Step 2: Write App.jsx**

Replace `src/App.jsx`:

```jsx
import { useState, useRef } from "react";

function App() {
  const [source, setSource] = useState("");
  const [template, setTemplate] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef(null);

  const loadFile = (setter) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt,.md,.csv,.html,.xml,.json,.yaml,.yml,.rtf,.log,.text";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const text = await file.text();
        setter(text);
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!source.trim() || !template.trim()) return;

    setLoading(true);
    setOutput("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/transmogrify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, template }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        setOutput(`░░░ ERROR ${res.status} ░░░\n${await res.text()}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setOutput(result);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        setOutput(`░░░ ERROR ░░░\n${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
    }
  };

  const handleSave = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mog-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={"app" + (loading ? " loading" : "")}>
      <header className="header">
        <h1>█▓▒░ MOG ░▒▓█</h1>
        <span className="header-decoration">░▒▓ TRANSMOGRIFY ▓▒░</span>
      </header>

      <div className="columns">
        {/* COLUMN 1 — SOURCE */}
        <div className="column">
          <div className="column-header">
            <div className="column-label">░ Source Content</div>
            <div className="column-decoration">█▓▒░░░░░░░░░░░░░░░░░░░▒▓█</div>
            <div className="column-actions">
              <button className="btn btn-file" onClick={() => loadFile(setSource)}>
                [ SELECT FILE ]
              </button>
            </div>
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste source content or load a file..."
          />
        </div>

        {/* COLUMN 2 — TEMPLATE RAILS */}
        <div className="column">
          <div className="column-header">
            <div className="column-label">░ Template Rails</div>
            <div className="column-decoration">█▓▒░░░░░░░░░░░░░░░░░░░▒▓█</div>
            <div className="column-actions">
              <button className="btn btn-file" onClick={() => loadFile(setTemplate)}>
                [ SELECT FILE ]
              </button>
            </div>
          </div>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Paste template rails or load a file..."
          />
        </div>

        {/* COLUMN 3 — OUTPUT */}
        <div className="column">
          <div className="column-header">
            <div className="column-label">░ Output</div>
            <div className="column-decoration">█▓▒░░░░░░░░░░░░░░░░░░░▒▓█</div>
            <div className="column-actions">
              <button className="btn" onClick={handleCopy} disabled={!output}>
                [ COPY ]
              </button>
              <button className="btn" onClick={handleSave} disabled={!output}>
                [ SAVE ]
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="░░░ Output will stream here ░░░"
          />
        </div>
      </div>

      <footer className="footer">
        <span className="footer-decoration">▓▒░</span>
        <span className="footer-status">
          {loading ? "░▒▓ TRANSMOGRIFYING ▓▒░" : "READY"}
        </span>
        <button
          className="btn btn-submit"
          onClick={handleSubmit}
          disabled={loading || !source.trim() || !template.trim()}
        >
          {loading ? "░░░ WORKING ░░░" : "TRANSMOGRIFY"}
        </button>
        <span className="footer-decoration">░▒▓</span>
      </footer>
    </div>
  );
}

export default App;
```

**Step 3: Delete unused default files**

Remove Vite boilerplate files that are no longer needed:

```bash
rm -f src/index.css src/assets/react.svg public/vite.svg
```

**Step 4: Commit**

```bash
git add src/App.jsx src/main.jsx
git add -u
git commit -m "feat: three-column transmogrify UI with streaming + file picker"
```

---

### Task 5: Netlify config and deploy prep

**Files:**
- Create: `netlify.toml`

**Step 1: Create netlify.toml**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  node_bundler = "esbuild"
```

**Step 2: Verify build works**

Run:
```bash
npm run build
```

Expected: `dist/` directory created with built assets, no errors.

**Step 3: Commit**

```bash
git add netlify.toml
git commit -m "config: add netlify.toml for deploy"
```

---

### Task 6: Local testing with Netlify CLI

**Step 1: Install Netlify CLI if needed**

Run:
```bash
npm install -g netlify-cli@latest
```

**Step 2: Init and link the Netlify project**

Run:
```bash
netlify init
```

Follow prompts to create a new site or link to existing one.

**Step 3: Test locally**

Run:
```bash
netlify dev
```

Expected: App loads at localhost. Columns display correctly. File pickers work. Submit button is disabled until both columns have content.

Note: Streaming from Claude will only work after a production deploy activates the AI Gateway. Locally, you can verify the UI and that the function endpoint returns a response (it may error about missing API key — that's expected).

**Step 4: Deploy to production**

Run:
```bash
netlify deploy --prod
```

Expected: Site deploys, AI Gateway activates. Full streaming transmogrification works.

**Step 5: Final commit with any adjustments**

```bash
git add -A
git commit -m "chore: final adjustments after testing"
```
