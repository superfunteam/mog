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
        <span className="header-decoration">░▒▓ WIMS.VC  ▓▒░</span>
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
