import { useState, useRef, useEffect, useCallback } from "react";
import sampleSource from "./sample-source.js";
import sampleTemplate from "./sample-template.js";

function App() {
  const [source, setSource] = useState(() => localStorage.getItem("mog-source") || "");
  const [template, setTemplate] = useState(() => localStorage.getItem("mog-template") || "");
  const [output, setOutput] = useState(() => localStorage.getItem("mog-output") || "");
  const [loading, setLoading] = useState(false);
  const [forbidReorder, setForbidReorder] = useState(() => localStorage.getItem("mog-forbidReorder") === "true");
  const [activeTab, setActiveTab] = useState(0);
  const [logoText, setLogoText] = useState("█▓▒░ MOG ░▒▓█");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(null);
  const shuffleRef = useRef(null);
  const outputRef = useRef(null);

  const LOGO_DEFAULT = "█▓▒░ MOG ░▒▓█";
  const GLYPHS = ["█", "▓", "▒", "░"];

  const startShuffle = () => {
    shuffleRef.current = setInterval(() => {
      const left = Array.from({ length: 4 }, () => GLYPHS[Math.random() * 4 | 0]).join("");
      const right = Array.from({ length: 4 }, () => GLYPHS[Math.random() * 4 | 0]).join("");
      setLogoText(`${left} MOG ${right}`);
    }, 80);
  };

  const stopShuffle = () => {
    clearInterval(shuffleRef.current);
    shuffleRef.current = null;
    setLogoText(LOGO_DEFAULT);
  };

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

  const fillBar = (len, max, width = 20) => {
    const fill = Math.min(Math.round((len / max) * width), width);
    return "█".repeat(fill) + "░".repeat(width - fill);
  };

  const loadSample = () => {
    setSource(sampleSource);
    setTemplate(sampleTemplate);
    setOutput("");
  };

  const handleSubmit = async () => {
    if (!source.trim() || !template.trim()) return;

    setLoading(true);
    setOutput("");
    startShuffle();

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/transmogrify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, template, forbidReorder }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        stopShuffle();
        setOutput(`░░░ ERROR ${res.status} ░░░\n${await res.text()}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";
      let first = true;
      let pending = "";
      let rafId = null;

      const flush = () => {
        if (pending) {
          result += pending;
          pending = "";
          setOutput(result);
          if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
          }
        }
        rafId = requestAnimationFrame(flush);
      };
      rafId = requestAnimationFrame(flush);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (first) { stopShuffle(); setStreaming(true); first = false; }
        pending += decoder.decode(value, { stream: true });
      }

      cancelAnimationFrame(rafId);
      result += pending;
      setOutput(result);
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    } catch (err) {
      stopShuffle();
      if (err.name !== "AbortError") {
        setOutput(`░░░ ERROR ░░░\n${err.message}`);
      }
    } finally {
      setLoading(false);
      setStreaming(false);
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
        <h1>{logoText}</h1>
        <div className="header-actions">
          <button className="btn-clear" onClick={loadSample} disabled={loading}>Sample</button>
          <button
            className="btn"
            onClick={handleSubmit}
            disabled={loading || !source.trim() || !template.trim()}
          >
            {loading ? "░░░ WORKING ░░░" : "MOG CONTENT"}
          </button>
        </div>
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
            <div className="column-fill">{fillBar(source.length, 50000)}</div>
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
            <div className="column-fill">{fillBar(template.length, 10000)}</div>
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
            <div className="column-sub"><span className="link-static">Ready for input</span></div>
            <div className="column-fill">{fillBar(output.length, Math.max(source.length, 1))}</div>
          </div>
          <textarea
            ref={outputRef}
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
          <span className={`status-dot ${streaming ? "status-dot-active" : ""}`} />
          {loading ? "MOGGING" : "API READY"}
          {loading && <span className="dots" />}
        </span>
        <span className="footer-decoration">wims.vc ░▒▓</span>
      </footer>

      <nav className="mobile-tabs">
        <button className={`mobile-tab ${activeTab === 0 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(0)}>
          {activeTab === 0 ? "█" : "░"} SRC
        </button>
        <button className={`mobile-tab ${activeTab === 1 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(1)}>
          {activeTab === 1 ? "█" : "░"} RAILS
        </button>
        <button className={`mobile-tab ${activeTab === 2 ? "mobile-tab-active" : ""}`} onClick={() => setActiveTab(2)}>
          {activeTab === 2 ? "█" : "░"} OUT
        </button>
      </nav>
    </div>
  );
}

export default App;
