import { useState, useEffect, useRef, useMemo } from "react";

const HEADLINE = `mog · /mɒɡ/ · verb`;
const DEFINITION = `to masterfully transmogrify content from one form into another — reshaping, reformatting, and reimagining with effortless precision.`;

const BORDER_CHARS = ["░", "▒", "▓", "█"];

function randomBorder(len = 100) {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += BORDER_CHARS[Math.floor(Math.random() * BORDER_CHARS.length)];
  }
  return s;
}

function WelcomeModal({ onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [typedHeadline, setTypedHeadline] = useState("");
  const [headlineDone, setHeadlineDone] = useState(false);
  const [typedDef, setTypedDef] = useState("");
  const [defDone, setDefDone] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const headlineIdx = useRef(0);
  const defIdx = useRef(0);
  const topBorder = useMemo(() => randomBorder(), []);
  const bottomBorder = useMemo(() => randomBorder(), []);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Type out headline
  useEffect(() => {
    if (headlineDone) return;
    const timer = setInterval(() => {
      headlineIdx.current++;
      setTypedHeadline(HEADLINE.slice(0, headlineIdx.current));
      if (headlineIdx.current >= HEADLINE.length) {
        clearInterval(timer);
        setHeadlineDone(true);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [headlineDone]);

  // Type out definition after headline
  useEffect(() => {
    if (!headlineDone || defDone) return;
    const delay = setTimeout(() => {
      const timer = setInterval(() => {
        defIdx.current++;
        setTypedDef(DEFINITION.slice(0, defIdx.current));
        if (defIdx.current >= DEFINITION.length) {
          clearInterval(timer);
          setDefDone(true);
        }
      }, 20);
      return () => clearInterval(timer);
    }, 300);
    return () => clearTimeout(delay);
  }, [headlineDone, defDone]);

  // Show steps after definition
  useEffect(() => {
    if (!defDone) return;
    const timer = setTimeout(() => setShowSteps(true), 400);
    return () => clearTimeout(timer);
  }, [defDone]);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div className={`modal-overlay ${visible ? "modal-overlay-visible" : ""}`} onClick={handleDismiss}>
      <div className={`modal ${visible ? "modal-visible" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-border-top">{topBorder}</div>

        <div className="modal-body">
          <div className="modal-dict">
            <span className="modal-headline">
              {typedHeadline}
              {!headlineDone && <span className="modal-cursor">█</span>}
            </span>
            {headlineDone && (
              <div className="modal-definition">
                {typedDef}
                {!defDone && <span className="modal-cursor">█</span>}
              </div>
            )}
          </div>

          <div className="modal-divider">░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░</div>

          <div className="modal-intro">
            Works with plain text, markdown, CSV, longass LLM text dumps, and even WordPress blocks.
          </div>

          <div className={`modal-steps ${showSteps ? "modal-steps-visible" : ""}`}>
            <div className="modal-step">
              <span className="modal-step-num">░ 1</span>
              <span className="modal-step-text">Paste your <strong>content</strong></span>
            </div>
            <div className="modal-step-arrow">▒▒▒▒▒▒▒▒▒</div>
            <div className="modal-step">
              <span className="modal-step-num">░ 2</span>
              <span className="modal-step-text">Paste a <strong>layout template</strong></span>
            </div>
            <div className="modal-step-arrow">▒▒▒▒▒▒▒▒▒</div>
            <div className="modal-step">
              <span className="modal-step-num">░ 3</span>
              <span className="modal-step-text">Get <strong>content + layout</strong></span>
            </div>
          </div>

          <button className="modal-dismiss" onClick={handleDismiss}>
            █ GOT IT █
          </button>
        </div>

        <div className="modal-border-bottom">{bottomBorder}</div>
      </div>
    </div>
  );
}

export default WelcomeModal;
