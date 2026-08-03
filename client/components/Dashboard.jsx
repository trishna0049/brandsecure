"use client";
import { Badge, Btn, Card, Icon, ProgressRing } from "./common";
import { RISK_CONFIG, STAGE_LABELS } from "./data";

const Dashboard = ({ tasks, setTasks, stage, setPage }) => {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending   = total - completed;
  const overdue   = tasks.filter(t => !t.completed && new Date(t.deadline) < new Date()).length;
  const score     = total === 0 ? 0 : Math.round((completed / total) * 100);

  const upcoming = [...tasks].filter(t => !t.completed)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 5);

  const byCategory = tasks.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || { total: 0, done: 0 });
    acc[t.category].total++;
    if (t.completed) acc[t.category].done++;
    return acc;
  }, {});

  const riskCounts = {
    high: tasks.filter(t => t.risk === "high" && !t.completed).length,
    medium: tasks.filter(t => t.risk === "medium" && !t.completed).length,
    low: tasks.filter(t => t.risk === "low" && !t.completed).length,
  };

  const stageInfo = STAGE_LABELS[stage];
  const delaysInDays = (deadline) => {
    const d = Math.ceil((new Date(deadline) - new Date()) / 86400000);
    if (d < 0) return { text: `${Math.abs(d)}d overdue`, color: "#D32F2F" };
    if (d === 0) return { text: "Due today", color: "#E65100" };
    if (d <= 7) return { text: `${d}d left`, color: "#E65100" };
    return { text: `${d}d left`, color: "#2E7D32" };
  };

  const statCards = [
    { label: "Compliance Score", value: score + "%", icon: "award", color: "var(--teal)", bg: "#E0F2F1" },
    { label: "Total Tasks", value: total, icon: "task", color: "var(--sky)", bg: "#E3F2FD" },
    { label: "Completed", value: completed, icon: "check", color: "#2E7D32", bg: "#E8F5E9" },
    { label: "Overdue", value: overdue, icon: "alertTriangle", color: "#D32F2F", bg: "#FFEBEE" },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1080, margin: "0 auto" }}>

      {/* Stage Banner */}
      <div style={{
        background: `linear-gradient(135deg, var(--ink), var(--ink2))`,
        borderRadius: "var(--r-lg)", padding: "22px 28px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        animation: "fadeUp 0.4s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: stageInfo.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name={stageInfo.icon} size={24} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>Your Startup Stage</p>
            <h2 style={{ fontFamily: "var(--ff-head)", fontSize: 20, fontWeight: 700, color: "#fff" }}>{stageInfo.label}</h2>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <ProgressRing pct={score} size={72} stroke={6} />
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>Compliance Score</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {statCards.map((s, i) => (
          <Card key={i} style={{ padding: "18px 20px", animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name={s.icon} size={18} color={s.color} />
              </div>
            </div>
            <div style={{ fontFamily: "var(--ff-head)", fontSize: 26, fontWeight: 800, color: "var(--ink)" }}>{s.value}</div>
            <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
        {/* Upcoming Tasks */}
        <Card style={{ padding: 22, animation: "fadeUp 0.4s ease 0.2s both" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 15 }}>Upcoming Deadlines</h3>
            <Btn variant="ghost" size="sm" onClick={() => setPage("tasks")}>View All</Btn>
          </div>
          {upcoming.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 0", color: "#aaa", fontSize: 13 }}>
              🎉 All tasks completed!
            </div>
          ) : (
            upcoming.map(t => {
              const dl = delaysInDays(t.deadline);
              return (
                <div key={t.id} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 0", borderBottom: "1px solid var(--border2)",
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                    <div style={{ fontSize: 11.5, color: "#999", marginTop: 1 }}>{t.category}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <Badge risk={t.risk} />
                    <span style={{ fontSize: 12, color: dl.color, fontWeight: 600, whiteSpace: "nowrap" }}>{dl.text}</span>
                  </div>
                </div>
              );
            })
          )}
        </Card>

        {/* Risk Breakdown */}
        <Card style={{ padding: 22, animation: "fadeUp 0.4s ease 0.25s both" }}>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Risk Breakdown (Pending)</h3>
          {["high", "medium", "low"].map(r => {
            const c = RISK_CONFIG[r];
            const count = riskCounts[r];
            const maxVal = Math.max(...Object.values(riskCounts), 1);
            const pct = Math.round((count / maxVal) * 100);
            return (
              <div key={r} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{c.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{count} tasks</span>
                </div>
                <div style={{ height: 6, background: "#F0EEE8", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 10, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 20, borderTop: "1px solid var(--border2)", paddingTop: 16 }}>
            <h4 style={{ fontFamily: "var(--ff-head)", fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#666" }}>By Category</h4>
            {Object.entries(byCategory).slice(0, 4).map(([cat, data]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12.5, flex: 1, color: "#555" }}>{cat}</span>
                <div style={{ width: 80, height: 4, background: "#F0EEE8", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(data.done / data.total) * 100}%`, background: "var(--teal)", borderRadius: 10 }} />
                </div>
                <span style={{ fontSize: 12, color: "#888", minWidth: 30, textAlign: "right" }}>{data.done}/{data.total}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Action */}
      <Card style={{ padding: "18px 22px", animation: "fadeUp 0.4s ease 0.3s both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="zap" size={20} color="var(--accent)" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: 14 }}>Have a legal document to analyze?</p>
            <p style={{ fontSize: 12.5, color: "#888" }}>Paste any legal text and our AI will break it down and generate compliance tasks automatically.</p>
          </div>
          <Btn variant="accent" icon="bot" onClick={() => setPage("ai")}>Open AI Assistant</Btn>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;