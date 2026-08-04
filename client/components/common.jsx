"use client";
import { useState } from "react";
import { RISK_CONFIG } from "./data";

// ─── THEME & GLOBAL STYLES ───────────────────────────────────────────────────
export const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0A0A0F;
      --ink2: #1A1A2E;
      --surface: #F4F3EE;
      --surface2: #ECEAE0;
      --surface3: #E0DDD4;
      --white: #FFFFFF;
      --accent: #E8500A;
      --accent2: #FF7A3D;
      --gold: #C9A84C;
      --teal: #00897B;
      --sky: #2979C8;
      --red: #D32F2F;
      --green: #2E7D32;
      --amber: #E65100;
      --purple: #5E35B1;
      --border: rgba(10,10,15,0.10);
      --border2: rgba(10,10,15,0.06);
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
      --shadow: 0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.07);
      --shadow-lg: 0 20px 50px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08);
      --r: 14px;
      --r-sm: 8px;
      --r-lg: 22px;
      --ff-head: 'Syne', sans-serif;
      --ff-body: 'DM Sans', sans-serif;
    }

    html, body, #root {
      height: 100%; background: var(--surface); color: var(--ink);
      font-family: var(--ff-body); font-size: 15px; line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--surface2); }
    ::-webkit-scrollbar-thumb { background: var(--surface3); border-radius: 10px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideRight {
      from { transform: translateX(-20px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes progressFill {
      from { width: 0%; }
      to   { width: var(--target-width); }
    }
    @keyframes countUp {
      from { opacity: 0; transform: scale(0.8); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes ripple {
      from { transform: scale(0); opacity: 0.6; }
      to   { transform: scale(2.5); opacity: 0; }
    }

    .anim-fadeUp  { animation: fadeUp 0.5s ease forwards; }
    .anim-fadeIn  { animation: fadeIn 0.4s ease forwards; }
    .anim-slide   { animation: slideRight 0.4s ease forwards; }
    .anim-float   { animation: float 3s ease-in-out infinite; }

    button { cursor: pointer; font-family: var(--ff-body); }
    input, textarea, select { font-family: var(--ff-body); }

    /* Scrollable containers */
    .scroll-y { overflow-y: auto; }
  `}</style>
);

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
export const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    shield: <><path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5l-8-3z"/></>,
    home: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H14v-6h-4v6H4a1 1 0 01-1-1V9.5z"/></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    bot: <><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 11V7"/><circle cx="12" cy="5" r="2"/><path d="M8 15h1M15 15h1"/></>,
    task: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    chevronRight: <><polyline points="9 18 15 12 9 6"/></>,
    chevronDown: <><polyline points="6 9 12 15 18 9"/></>,
    chevronLeft: <><polyline points="15 18 9 12 15 6"/></>,
    alertTriangle: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    fileText: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
    send: <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    trash: <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    trendingUp: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="9" y1="22" x2="9" y2="2"/><line x1="15" y1="22" x2="15" y2="2"/><line x1="4" y1="6" x2="9" y2="6"/><line x1="4" y1="10" x2="9" y2="10"/><line x1="4" y1="14" x2="9" y2="14"/></>,
    logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/><path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── BUTTON ──────────────────────────────────────────────────────────────────
export const Btn = ({ children, variant = "primary", onClick, style = {}, icon, size = "md", disabled }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 7, border: "none",
    borderRadius: "var(--r-sm)", fontFamily: "var(--ff-body)", fontWeight: 600,
    transition: "all 0.18s", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    ...(size === "sm" ? { padding: "7px 14px", fontSize: 13 } :
        size === "lg" ? { padding: "13px 26px", fontSize: 15.5 } :
                        { padding: "10px 20px", fontSize: 14.5 }),
  };
  const variants = {
    primary: { background: "var(--ink)", color: "#fff" },
    accent:  { background: "var(--accent)", color: "#fff" },
    ghost:   { background: "transparent", color: "var(--ink)", border: "1.5px solid var(--border)" },
    soft:    { background: "var(--surface2)", color: "var(--ink)" },
    danger:  { background: "#FFEBEE", color: "#D32F2F" },
    teal:    { background: "#E0F2F1", color: "#00695C" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = "brightness(0.92)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "brightness(1)"; }}>
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
};

// ─── PASSWORD INPUT ───────────────────────────────────────────────────────────
export const PasswordInput = ({ inputStyle = {}, value, onChange, placeholder, onFocus, onBlur, id, name, autoComplete, iconColor = "rgba(255,255,255,0.45)" }) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        name={name}
        autoComplete={autoComplete}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ ...inputStyle, padding: "11px 42px 11px 14px" }}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow(s => !s)}
        style={{
          position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", padding: 6, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          lineHeight: 0,
        }}>
        <Icon name={show ? "eyeOff" : "eye"} size={17} color={iconColor} />
      </button>
    </div>
  );
};

// ─── BADGE ───────────────────────────────────────────────────────────────────
export const Badge = ({ risk }) => {
  const c = RISK_CONFIG[risk];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px",
      borderRadius: 20, background: c.bg, color: c.color,
      fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color }} />
      {c.label}
    </span>
  );
};

// ─── CARD ───────────────────────────────────────────────────────────────────
export const Card = ({ children, style = {}, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => hover && setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: "var(--r)", border: "1.5px solid var(--border2)",
        boxShadow: hov ? "var(--shadow)" : "var(--shadow-sm)",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hov ? "translateY(-1px)" : "none",
        ...style,
      }}>
      {children}
    </div>
  );
};

// ─── PROGRESS RING ────────────────────────────────────────────────────────────
export const ProgressRing = ({ pct, size = 80, stroke = 7 }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  const color = pct >= 75 ? "#2E7D32" : pct >= 40 ? "#E65100" : "#D32F2F";
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F0EEE8" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease", transform: "rotate(-90deg)", transformOrigin: "50% 50%" }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        style={{ fontSize: size * 0.22, fontWeight: 700, fontFamily: "var(--ff-head)", fill: color }}>
        {pct}%
      </text>
    </svg>
  );
};