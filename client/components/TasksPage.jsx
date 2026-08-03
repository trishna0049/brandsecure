"use client";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import { Badge, Btn, Card, Icon } from "./common";
import { taskFromApi } from "./data";

const TasksPage = ({ tasks, setTasks, stage }) => {
  const [filter, setFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [sortBy, setSortBy] = useState("deadline");
  const [editTask, setEditTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", category: "Compliance", risk: "medium", deadline: "", desc: "" });

  const categories = [...new Set(tasks.map(t => t.category))];

  const filtered = tasks
    .filter(t => {
      if (filter === "completed") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter(t => riskFilter === "all" || t.risk === riskFilter)
    .filter(t => catFilter === "all" || t.category === catFilter)
    .sort((a, b) => {
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === "risk") { const r = { high: 0, medium: 1, low: 2 }; return r[a.risk] - r[b.risk]; }
      return a.title.localeCompare(b.title);
    });

  const toggle = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Not Started" : "Completed";
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: newStatus, completed: newStatus === "Completed" } : t));
    try {
      await API.put(`/api/compliance/${id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to update task");
    }
  };
  const remove = async (id) => {
    try {
      await API.delete(`/api/compliance/${id}`);
      setTasks(ts => ts.filter(t => t.id !== id));
    } catch (err) {
      alert("Failed to delete task");
    }
  };
  const addTask = async () => {
    if (!newTask.title || !newTask.deadline) return;
    try {
      const res = await API.post("/api/compliance", {
        category: newTask.category,
        title: newTask.title,
        deadline: newTask.deadline,
      });
      setTasks(ts => [...ts, taskFromApi(res.data)]);
      setNewTask({ title: "", category: "Compliance", risk: "medium", deadline: "", desc: "" });
      setShowAdd(false);
    } catch (err) {
      alert("Failed to add task");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get("/api/compliance");
        setTasks((res.data?.data || []).map(taskFromApi));
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    })();
  }, []);

  const inputStyle = {
    width: "100%", padding: "9px 12px", border: "1.5px solid var(--border)",
    borderRadius: "var(--r-sm)", fontFamily: "var(--ff-body)", fontSize: 13.5,
    background: "var(--surface)", outline: "none",
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto" }}>
      {/* Header Row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["all", "pending", "completed"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
                borderColor: filter === f ? "var(--ink)" : "var(--border)",
                background: filter === f ? "var(--ink)" : "transparent",
                color: filter === f ? "#fff" : "var(--ink)",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "var(--ff-body)", textTransform: "capitalize",
                transition: "all 0.15s",
              }}>
              {f === "all" ? `All (${tasks.length})` :
               f === "completed" ? `Done (${tasks.filter(t => t.completed).length})` :
               `Pending (${tasks.filter(t => !t.completed).length})`}
            </button>
          ))}
        </div>
        <Btn variant="accent" icon="plus" onClick={() => setShowAdd(true)}>Add Task</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="all">All Risks</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ ...inputStyle, width: "auto", padding: "6px 10px" }}>
          <option value="deadline">Sort: Deadline</option>
          <option value="risk">Sort: Risk</option>
          <option value="title">Sort: Name</option>
        </select>
      </div>

      {/* Add Task Modal */}
      {showAdd && (
        <Card style={{ padding: 22, marginBottom: 18, border: "1.5px solid var(--accent)", animation: "fadeUp 0.3s ease" }}>
          <h3 style={{ fontFamily: "var(--ff-head)", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
            Add New Compliance Task
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ gridColumn: "1/-1" }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Task Title *</label>
              <input style={inputStyle} placeholder="e.g. File GSTR-1 Return"
                value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Category</label>
              <select style={inputStyle} value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}>
                {["Tax", "Registration", "Compliance", "Trademark", "HR", "Finance", "Agreements", "Formation"].map(c =>
                  <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Risk Level</label>
              <select style={inputStyle} value={newTask.risk} onChange={e => setNewTask(n => ({ ...n, risk: e.target.value }))}>
                <option value="high">High Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="low">Low Risk</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Deadline *</label>
              <input type="date" style={inputStyle} value={newTask.deadline}
                onChange={e => setNewTask(n => ({ ...n, deadline: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 5 }}>Description</label>
              <input style={inputStyle} placeholder="Brief description..."
                value={newTask.desc} onChange={e => setNewTask(n => ({ ...n, desc: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="accent" onClick={addTask} icon="plus">Add Task</Btn>
            <Btn variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      {/* Task List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "50px 0", color: "#aaa" }}>
            <Icon name="task" size={40} color="#ddd" />
            <p style={{ marginTop: 10, fontSize: 14 }}>No tasks match your filters.</p>
          </div>
        )}
        {filtered.map((t, i) => {
          const daysLeft = Math.ceil((new Date(t.deadline) - new Date()) / 86400000);
          const isOverdue = daysLeft < 0 && !t.completed;
          return (
            <Card key={t.id} style={{
              padding: "16px 20px",
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
              opacity: t.completed ? 0.65 : 1,
              borderLeft: isOverdue ? "3px solid #D32F2F" : t.completed ? "3px solid #2E7D32" : "3px solid transparent",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Checkbox */}
                <button onClick={() => toggle(t.id)}
                  style={{
                    width: 22, height: 22, borderRadius: 6, border: `2px solid ${t.completed ? "#2E7D32" : "#CCC"}`,
                    background: t.completed ? "#2E7D32" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, marginTop: 1, transition: "all 0.15s",
                  }}>
                  {t.completed && <Icon name="check" size={13} color="#fff" />}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 14.5, textDecoration: t.completed ? "line-through" : "none" }}>
                      {t.title}
                    </span>
                    <Badge risk={t.risk} />
                    <span style={{
                      background: "var(--surface2)", padding: "2px 8px", borderRadius: 20,
                      fontSize: 11.5, color: "#666",
                    }}>{t.category}</span>
                    {t.aiGenerated && (
                      <span style={{
                        background: "#E8EAF6", padding: "2px 8px", borderRadius: 20,
                        fontSize: 11.5, color: "#5E35B1", display: "flex", alignItems: "center", gap: 4,
                      }}>
                        <Icon name="sparkles" size={10} color="#5E35B1" /> AI
                      </span>
                    )}
                  </div>
                  {t.desc && <p style={{ fontSize: 12.5, color: "#777", marginBottom: 4 }}>{t.desc}</p>}
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: isOverdue ? "#D32F2F" : daysLeft <= 7 ? "#E65100" : "#888" }}>
                      <Icon name="calendar" size={13} />
                      {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `Due: ${new Date(t.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                    </span>
                  </div>
                </div>

                <button onClick={() => remove(t.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0, opacity: 0.5 }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                  <Icon name="trash" size={15} color="#D32F2F" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;