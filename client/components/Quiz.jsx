"use client";
import { useState } from "react";
import { Icon } from "./common";
import { QUIZ_QUESTIONS } from "./data";

const Quiz = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [hover, setHover] = useState(null);
  const q = QUIZ_QUESTIONS[step];
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  const select = (val) => {
    const next = { ...answers, [q.id]: val };
    setAnswers(next);
    if (step < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s + 1), 300);
    } else {
      setTimeout(() => onComplete(next), 300);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--ink)", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <style>{`
        .quiz-opt:hover { transform: translateX(4px); border-color: var(--accent) !important; }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="shield" size={22} color="#fff" />
        </div>
        <span style={{ fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 22, color: "#fff" }}>
          Brand<span style={{ color: "var(--accent)" }}>Secure</span>
        </span>
      </div>

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: 560, background: "rgba(255,255,255,0.04)",
        border: "1.5px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "36px 36px 28px",
        animation: "fadeUp 0.4s ease",
      }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: "var(--accent)", borderRadius: 10, transition: "width 0.4s ease" }} />
          </div>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
            {step + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>

        <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 24, lineHeight: 1.3 }}>
          {q.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map(opt => (
            <button key={opt.value} className="quiz-opt"
              onClick={() => select(opt.value)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px", border: "1.5px solid rgba(255,255,255,0.1)",
                borderRadius: 12, background: answers[q.id] === opt.value ? "rgba(232,80,10,0.15)" : "rgba(255,255,255,0.04)",
                cursor: "pointer", transition: "all 0.18s", textAlign: "left",
                borderColor: answers[q.id] === opt.value ? "var(--accent)" : undefined,
              }}>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{opt.label}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)" }}>{opt.desc}</div>
              </div>
              <Icon name="chevronRight" size={16} color="rgba(255,255,255,0.35)" />
            </button>
          ))}
        </div>
      </div>

      <p style={{ marginTop: 18, fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>
        This helps us personalize your compliance roadmap
      </p>
    </div>
  );
};

export default Quiz;