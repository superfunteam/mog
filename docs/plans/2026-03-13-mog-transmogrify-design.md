# MOG — Transmogrify Tool Design

**Goal:** A brutalist web tool that takes source content + template rails and uses Claude to transmogrify the content into the template format, repeating the template as many times as needed.

**Architecture:** Single-page Vite + React app with one Netlify serverless function. The function streams Claude responses via the Anthropic SDK through Netlify AI Gateway. Three-column layout: source, template, output.

**Tech Stack:** Vite, React, @anthropic-ai/sdk, Netlify Functions (streaming)

**Aesthetic:** Ultra brutalist — monospace fonts, black/white/gray only, `█▓▒░` ASCII art for all decoration, borders, shadows.

## Layout

Three equal full-height columns:
- **Col 1 (SOURCE):** File picker + textarea for raw content
- **Col 2 (RAILS):** File picker + textarea for template/mold
- **Col 3 (OUTPUT):** Copy button + Save button + read-only textarea with streaming output

Submit button triggers the API call. Output streams in token-by-token.

## Key Behavior

- Column 2 template is a **repeatable mold** — duplicated as many times as needed
- Column 1 content is **absolute law** — every word must be accounted for
- Output mirrors the plain text format of the template
- File pickers accept .txt, .md, .csv, .html, or any text file
- Real streaming via Anthropic SDK + ReadableStream response
