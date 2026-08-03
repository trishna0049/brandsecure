"use client";
import { Icon } from "./common";
import { STAGE_LABELS, PAGES } from "./data";

const Sidebar = ({ page, setPage, stage, onLogout }) => {
  const stageInfo = STAGE_LABELS[stage] || STAGE_LABELS["pre-revenue"];
  return (
    <aside style={{
      width: 230, height: "100vh", position: "fixed", left: 0, top: 0, zIndex: 100,
      background: "var(--ink)", display: "flex", flexDirection: "column",
      padding: "28px 0 24px",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 22px 24px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="shield" size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--ff-head)", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: -0.5 }}>
            Brand<span style={{ color: "var(--accent)" }}>Secure</span>
          </span>
        </div>
      </div>

      {/* Stage badge */}
      <div style={{ padding: "14px 22px 18px" }}>
        <div style={{
          background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: stageInfo.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 1 }}>Your Stage</div>
            <div style={{ fontSize: 13, color: "#fff", fontWeight: 600 }}>{stageInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 10px" }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11,
              padding: "10px 12px", borderRadius: 10, border: "none",
              background: page === p.id ? "rgba(232,80,10,0.2)" : "transparent",
              color: page === p.id ? "var(--accent2)" : "rgba(255,255,255,0.55)",
              fontFamily: "var(--ff-body)", fontWeight: page === p.id ? 600 : 400,
              fontSize: 14, marginBottom: 2, cursor: "pointer",
              transition: "all 0.15s",
              borderLeft: page === p.id ? "3px solid var(--accent)" : "3px solid transparent",
            }}
            onMouseEnter={e => { if (page !== p.id) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
            onMouseLeave={e => { if (page !== p.id) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}>
            <Icon name={p.icon} size={17} />
            {p.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "0 10px" }}>
        <button onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 11,
            padding: "10px 12px", borderRadius: 10, border: "none",
            background: "transparent", color: "rgba(255,255,255,0.35)",
            fontFamily: "var(--ff-body)", fontSize: 13, cursor: "pointer",
            transition: "color 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.35)"}>
          <Icon name="logout" size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;