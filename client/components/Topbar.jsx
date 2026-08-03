"use client";
import { Icon } from "./common";

const Topbar = ({ title, subtitle, tasks }) => {
  const pending = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date(Date.now() + 7 * 86400000)).length;
  return (
    <header style={{
      height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 32px", background: "#fff", borderBottom: "1.5px solid var(--border2)",
      position: "sticky", top: 0, zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 20, letterSpacing: -0.4 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12.5, color: "#888", marginTop: -1 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <Icon name="bell" size={20} color="#666" />
          {pending > 0 && (
            <span style={{
              position: "absolute", top: -5, right: -5, width: 16, height: 16,
              borderRadius: "50%", background: "var(--accent)", color: "#fff",
              fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{pending}</span>
          )}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "var(--ink2)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>F</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;