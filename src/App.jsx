import { useState, useRef, useEffect } from "react";

function App() {
  const [source, setSource] = useState(() => localStorage.getItem("mog-source") || "");
  const [template, setTemplate] = useState(() => localStorage.getItem("mog-template") || "");
  const [output, setOutput] = useState(() => localStorage.getItem("mog-output") || "");
  const [loading, setLoading] = useState(false);
  const [forbidReorder, setForbidReorder] = useState(() => localStorage.getItem("mog-forbidReorder") === "true");
  const [activeTab, setActiveTab] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => { localStorage.setItem("mog-source", source); }, [source]);
  useEffect(() => { localStorage.setItem("mog-template", template); }, [template]);
  useEffect(() => { localStorage.setItem("mog-output", output); }, [output]);
  useEffect(() => { localStorage.setItem("mog-forbidReorder", forbidReorder); }, [forbidReorder]);

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
        body: JSON.stringify({ source, template, forbidReorder }),
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
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={loading || !source.trim() || !template.trim()}
        >
          {loading ? "░░░ WORKING ░░░" : "MOG CONTENT"}
        </button>
      </header>

      <div className="columns">
        {/* COLUMN 1 — SOURCE */}
        <div className={`column ${activeTab === 0 ? "column-active" : ""}`} data-tab="0">
          <div className="column-header">
            <div className="column-label-row">
              <div className="column-label">░ Source Content</div>
              {source && <button className="btn-clear" onClick={() => setSource("")}>CLEAR</button>}
            </div>
            <div className="column-sub"><button className="link" onClick={() => loadFile(setSource)}>+ Upload file</button></div>
          </div>
          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste source content here..."
          />
          <label className="column-setting">
            <input
              type="checkbox"
              checked={forbidReorder}
              onChange={(e) => setForbidReorder(e.target.checked)}
            />
            <span>FORBID REORDER</span>
          </label>
        </div>

        {/* COLUMN 2 — TEMPLATE RAILS */}
        <div className={`column ${activeTab === 1 ? "column-active" : ""}`} data-tab="1">
          <div className="column-header">
            <div className="column-label-row">
              <div className="column-label">░ Template Rails</div>
              {template && <button className="btn-clear" onClick={() => setTemplate("")}>CLEAR</button>}
            </div>
            <div className="column-sub"><button className="link" onClick={() => loadFile(setTemplate)}>+ Upload file</button></div>
          </div>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Paste template rails here..."
          />
        </div>

        {/* COLUMN 3 — OUTPUT */}
        <div className={`column ${activeTab === 2 ? "column-active" : ""}`} data-tab="2">
          <div className="column-header">
            <div className="column-label-row">
              <div className="column-label">░ Output</div>
              {output && <button className="btn-clear" onClick={() => setOutput("")}>CLEAR</button>}
            </div>
            <div className="column-sub">█▓▒░░░░░░░░░░░░░░░░░░░▒▓█</div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="░░░ Output will stream here ░░░"
          />
          {output && (
            <div className="column-actions">
              <button className="btn" onClick={handleCopy}>[ COPY ]</button>
              <button className="btn" onClick={handleSave}>[ SAVE ]</button>
            </div>
          )}
        </div>
      </div>

      <footer className="footer">
        <span className="footer-decoration">▓▒░</span>
        <span className="footer-status">
          {loading ? "░▒▓ TRANSMOGRIFYING ▓▒░" : <><span className="status-dot" />API READY</>}
        </span>
        <span className="footer-decoration">wims.vc ░▒▓</span>
      </footer>

      <nav className="mobile-tabs">
        <button className={`mobile-tab ${activeTab === 0 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(0)}>
          ░ SRC
        </button>
        <button className={`mobile-tab ${activeTab === 1 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(1)}>
          █ RAILS
        </button>
        <button
          className="mobile-tab mobile-tab-mog"
          onClick={handleSubmit}
          disabled={loading || !source.trim() || !template.trim()}
        >
          {loading ? "▓▒░" : "▓ MOG"}
        </button>
        <button className={`mobile-tab ${activeTab === 2 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(2)}>
          ▒ OUT
        </button>
      </nav>
    </div>
  );
}

export default App;
