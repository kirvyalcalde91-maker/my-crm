
bash

cat > /mnt/user-data/outputs/team-crm.jsx << 'ENDOFFILE'
import { useState, useEffect } from "react";

const initialAgents = [
  { id: 1, name: "Maria Santos", email: "maria@company.com", role: "agent", avatar: "MS", department: "Sales", target: 50, status: "active" },
  { id: 2, name: "James Reyes", email: "james@company.com", role: "agent", avatar: "JR", department: "Support", target: 40, status: "active" },
  { id: 3, name: "Ana Cruz", email: "ana@company.com", role: "agent", avatar: "AC", department: "Sales", target: 45, status: "active" },
  { id: 4, name: "Carlo Lim", email: "carlo@company.com", role: "agent", avatar: "CL", department: "Operations", target: 35, status: "active" },
];

const initialLeads = [
  { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", phone: "09171234567", status: "New", assignedTo: 1, value: 12000, notes: "Interested in enterprise plan", date: "2026-05-10" },
  { id: 2, name: "BrightTech", contact: "Sara Lee", email: "sara@bright.com", phone: "09181234567", status: "Follow-up", assignedTo: 2, value: 8500, notes: "Demo scheduled", date: "2026-05-12" },
  { id: 3, name: "Nova Solutions", contact: "Mike Tan", email: "mike@nova.com", phone: "09191234567", status: "Closed Won", assignedTo: 1, value: 22000, notes: "Signed contract", date: "2026-05-08" },
  { id: 4, name: "Globe Partners", contact: "Lia Gomez", email: "lia@globe.com", phone: "09201234567", status: "Negotiation", assignedTo: 3, value: 15000, notes: "Awaiting proposal", date: "2026-05-14" },
  { id: 5, name: "Summit Inc", contact: "Rex Bautista", email: "rex@summit.com", phone: "09211234567", status: "New", assignedTo: 4, value: 5000, notes: "Cold lead from LinkedIn", date: "2026-05-15" },
];

const today = new Date().toISOString().split("T")[0];

const initialAttendance = {
  1: [
    { date: "2026-05-12", in: "08:01", out: "17:05", status: "Present" },
    { date: "2026-05-13", in: "08:15", out: "17:00", status: "Present" },
    { date: "2026-05-14", in: null, out: null, status: "Absent" },
    { date: "2026-05-15", in: "07:58", out: "17:10", status: "Present" },
  ],
  2: [
    { date: "2026-05-12", in: "08:30", out: "17:00", status: "Late" },
    { date: "2026-05-13", in: "08:05", out: "17:00", status: "Present" },
    { date: "2026-05-14", in: "08:00", out: "17:00", status: "Present" },
    { date: "2026-05-15", in: "08:20", out: "17:00", status: "Late" },
  ],
  3: [
    { date: "2026-05-12", in: "07:55", out: "17:00", status: "Present" },
    { date: "2026-05-13", in: "08:00", out: "17:00", status: "Present" },
    { date: "2026-05-14", in: "08:00", out: "17:00", status: "Present" },
    { date: "2026-05-15", in: "08:00", out: "17:00", status: "Present" },
  ],
  4: [
    { date: "2026-05-12", in: "08:00", out: "17:00", status: "Present" },
    { date: "2026-05-13", in: null, out: null, status: "Leave" },
    { date: "2026-05-14", in: "08:10", out: "17:00", status: "Present" },
    { date: "2026-05-15", in: "08:00", out: "17:00", status: "Present" },
  ],
};

const initialPerformance = {
  1: { calls: 38, deals: 5, revenue: 34000, tasks: 22 },
  2: { calls: 29, deals: 3, revenue: 18500, tasks: 18 },
  3: { calls: 42, deals: 6, revenue: 41000, tasks: 25 },
  4: { calls: 21, deals: 2, revenue: 10000, tasks: 15 },
};

const initialBoardPosts = [
  { id: 1, author: "Maria Santos", avatar: "MS", category: "Idea", title: "Weekly team huddle", body: "Can we set a fixed 15-min standup every Monday morning? Would help us sync before the week starts!", date: "2026-05-17", pinned: true, reactions: { "👍": ["James Reyes", "Ana Cruz"], "❤️": ["Carlo Lim"], "🔥": [] }, comments: [{ author: "James Reyes", avatar: "JR", text: "Totally agree, I've been wanting this too!", date: "2026-05-17" }] },
  { id: 2, author: "Carlo Lim", avatar: "CL", category: "Question", title: "Leave filing process?", body: "Hey team, where do we file our leave requests? Is there a form or do we just message the admin directly?", date: "2026-05-16", pinned: false, reactions: { "👍": ["Ana Cruz"], "❤️": [], "🔥": [] }, comments: [{ author: "Admin User", avatar: "AD", text: "Hi Carlo! Just message me directly for now.", date: "2026-05-16" }] },
  { id: 3, author: "Ana Cruz", avatar: "AC", category: "Shoutout", title: "Big thanks to Maria!", body: "Shoutout to Maria for closing the Nova Solutions deal! That was a tough one and she pulled it off. Let's gooo!", date: "2026-05-15", pinned: false, reactions: { "👍": ["Carlo Lim", "James Reyes"], "❤️": ["Admin User", "Carlo Lim"], "🔥": ["James Reyes", "Ana Cruz"] }, comments: [] },
  { id: 4, author: "James Reyes", avatar: "JR", category: "Concern", title: "Internet is slow in the afternoon", body: "Not sure if it's just me but the connection gets really sluggish after 2pm. Affects my calls with clients.", date: "2026-05-14", pinned: false, reactions: { "👍": ["Carlo Lim"], "❤️": [], "🔥": [] }, comments: [{ author: "Admin User", avatar: "AD", text: "Thanks for flagging James, I'll check with the IT team.", date: "2026-05-14" }] },
];

const statusColors = { "New": "#3b82f6", "Follow-up": "#f59e0b", "Negotiation": "#8b5cf6", "Closed Won": "#10b981", "Closed Lost": "#ef4444" };
const attColors = { "Present": "#10b981", "Late": "#f59e0b", "Absent": "#ef4444", "Leave": "#8b5cf6" };
const catColors = { Idea: "#3b82f6", Question: "#f59e0b", Concern: "#ef4444", Shoutout: "#10b981", General: "#8b5cf6" };
const catIcons = { Idea: "💡", Question: "❓", Concern: "⚠️", Shoutout: "🏆", General: "💬" };

// ---- STYLES ----
const s = {
  app: { fontFamily: "'DM Sans', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0", display: "flex" },
  sidebar: { width: 220, background: "#161b27", borderRight: "1px solid #1e2535", display: "flex", flexDirection: "column" },
  logo: { padding: "24px 20px 20px", borderBottom: "1px solid #1e2535" },
  logoText: { fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" },
  logoSub: { fontSize: 11, color: "#4b5a78", marginTop: 2 },
  nav: { flex: 1, padding: "12px 8px", overflowY: "auto" },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer", fontSize: 13.5, fontWeight: active ? 600 : 400, background: active ? "#1e3a5f" : "transparent", color: active ? "#60a5fa" : "#8899b4" }),
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { background: "#161b27", borderBottom: "1px solid #1e2535", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  topbarTitle: { fontSize: 18, fontWeight: 700, color: "#fff" },
  avatar: (size = 36) => ({ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }),
  content: { flex: 1, padding: "28px", overflowY: "auto" },
  card: { background: "#161b27", borderRadius: 14, border: "1px solid #1e2535", padding: "20px 24px", marginBottom: 20 },
  statCard: { background: "#161b27", borderRadius: 14, border: "1px solid #1e2535", padding: "20px 22px", flex: 1 },
  statVal: { fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#4b5a78", marginTop: 6, fontWeight: 500 },
  statChange: (pos) => ({ fontSize: 12, color: pos ? "#10b981" : "#ef4444", marginTop: 4 }),
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  grid4: { display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" },
  badge: (color) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: color + "22", color: color }),
  btn: (variant = "primary") => ({
    padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
    background: variant === "primary" ? "#3b82f6" : variant === "danger" ? "#ef4444" : variant === "ghost" ? "transparent" : "#1e2535",
    color: variant === "ghost" ? "#8899b4" : "#fff",
  }),
  input: { width: "100%", background: "#0f1117", border: "1px solid #1e2535", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 12, color: "#4b5a78", fontWeight: 600, marginBottom: 5, display: "block" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "#4b5a78", textTransform: "uppercase", borderBottom: "1px solid #1e2535" },
  td: { padding: "13px 14px", fontSize: 13, borderBottom: "1px solid #0f1117", color: "#c8d4e8" },
  modal: { position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modalBox: { background: "#161b27", borderRadius: 16, border: "1px solid #1e2535", padding: 28, width: 440, maxHeight: "85vh", overflowY: "auto" },
};

// ============================================================
// SUB-COMPONENTS (defined outside main to avoid hook errors)
// ============================================================

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("admin@company.com");
  const [password, setPassword] = useState("admin123");
  return (
    <div style={{ ...s.app, alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 60% 40%, #1e2f50 0%, #0f1117 70%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ width: 380, background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>TeamCRM</div>
          <div style={{ fontSize: 13, color: "#4b5a78", marginTop: 4 }}>Sign in to your workspace</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Email</label>
          <input style={s.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={s.label}>Password</label>
          <input style={s.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button style={{ ...s.btn("primary"), width: "100%", padding: "12px", fontSize: 14 }} onClick={() => onLogin(email, password)}>Sign In</button>
        <div style={{ marginTop: 20, fontSize: 12, color: "#4b5a78", textAlign: "center" }}>
          <b style={{ color: "#6b80a0" }}>Admin:</b> admin@company.com / admin123<br />
          <b style={{ color: "#6b80a0" }}>Agent:</b> maria@company.com / agent123
        </div>
      </div>
    </div>
  );
}

function AgentOverview({ agents, performance, attendance, leads, isAdmin }) {
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("revenue");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const depts = ["All", ...Array.from(new Set(agents.map(a => a.department)))];

  const filtered = [...agents]
    .filter(a => filterDept === "All" || a.department === filterDept)
    .sort((a, b) => {
      if (sortBy === "revenue") return (performance[b.id]?.revenue || 0) - (performance[a.id]?.revenue || 0);
      if (sortBy === "deals") return (performance[b.id]?.deals || 0) - (performance[a.id]?.deals || 0);
      if (sortBy === "attendance") {
        const ra = (attendance[a.id] || []).filter(r => r.status === "Present" || r.status === "Late").length;
        const rb = (attendance[b.id] || []).filter(r => r.status === "Present" || r.status === "Late").length;
        return rb - ra;
      }
      return 0;
    });

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {depts.map(d => (
            <button key={d} onClick={() => setFilterDept(d)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filterDept === d ? "#3b82f6" : "#1e2535", color: filterDept === d ? "#fff" : "#8899b4" }}>{d}</button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#4b5a78" }}>Sort by:</span>
          {[["revenue", "Revenue"], ["deals", "Deals"], ["attendance", "Attendance"]].map(([val, label]) => (
            <button key={val} onClick={() => setSortBy(val)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: sortBy === val ? "#8b5cf6" : "#1e2535", color: sortBy === val ? "#fff" : "#8899b4" }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map((agent, rank) => {
          const perf = performance[agent.id] || {};
          const attRecs = attendance[agent.id] || [];
          const presentDays = attRecs.filter(r => r.status === "Present" || r.status === "Late").length;
          const lateDays = attRecs.filter(r => r.status === "Late").length;
          const absentDays = attRecs.filter(r => r.status === "Absent").length;
          const attRate = attRecs.length ? Math.round((presentDays / attRecs.length) * 100) : 0;
          const attainment = Math.round(((perf.deals || 0) / (agent.target || 40)) * 100);
          const agentLeads = leads.filter(l => l.assignedTo === agent.id);
          const todayAtt = attRecs.find(r => r.date === "2026-05-15");
          const rankIcons = ["🥇", "🥈", "🥉"];

          return (
            <div key={agent.id} onClick={() => setSelectedAgent(agent)}
              style={{ background: "#161b27", borderRadius: 16, border: "1px solid #1e2535", padding: 22, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              {rank < 3 && sortBy === "revenue" && <div style={{ position: "absolute", top: 14, right: 14, fontSize: 20 }}>{rankIcons[rank]}</div>}
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={s.avatar(52)}>{agent.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>{agent.name}</div>
                  <div style={{ fontSize: 12, color: "#4b5a78", marginTop: 2 }}>{agent.department}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={s.badge("#10b981")}>Active</span>
                    {todayAtt && <span style={s.badge(attColors[todayAtt.status] || "#4b5a78")}>Today: {todayAtt.status}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
                {[{ label: "Revenue", val: `₱${(perf.revenue || 0).toLocaleString()}`, color: "#10b981" }, { label: "Deals", val: perf.deals || 0, color: "#60a5fa" }, { label: "Calls", val: perf.calls || 0, color: "#a78bfa" }].map(m => (
                  <div key={m.label} style={{ background: "#0f1117", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: 10, color: "#4b5a78", marginTop: 2 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#4b5a78", fontWeight: 600 }}>TARGET</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444" }}>{attainment}%</span>
                </div>
                <div style={{ height: 7, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(attainment, 100)}%`, background: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "#4b5a78", fontWeight: 600 }}>ATTENDANCE</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: attRate >= 90 ? "#10b981" : attRate >= 70 ? "#f59e0b" : "#ef4444" }}>{attRate}%</span>
                </div>
                <div style={{ height: 7, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${attRate}%`, background: attRate >= 90 ? "#10b981" : attRate >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: "#10b981" }}>✓ {presentDays} present</span>
                  {lateDays > 0 && <span style={{ fontSize: 10, color: "#f59e0b" }}>⏰ {lateDays} late</span>}
                  {absentDays > 0 && <span style={{ fontSize: 10, color: "#ef4444" }}>✗ {absentDays} absent</span>}
                </div>
              </div>
              <div style={{ background: "#0f1117", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: "#4b5a78", fontWeight: 600, marginBottom: 8 }}>PIPELINE</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["New", "Follow-up", "Negotiation", "Closed Won"].map(st => {
                    const count = agentLeads.filter(l => l.status === st).length;
                    return count > 0 ? <span key={st} style={s.badge(statusColors[st] || "#4b5a78")}>{st} {count}</span> : null;
                  })}
                  {agentLeads.length === 0 && <span style={{ fontSize: 11, color: "#4b5a78" }}>No leads</span>}
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#4b5a78", textAlign: "right" }}>Click to view full profile →</div>
            </div>
          );
        })}
      </div>

      {selectedAgent && (() => {
        const ag = selectedAgent;
        const perf = performance[ag.id] || {};
        const attRecs = attendance[ag.id] || [];
        const presentDays = attRecs.filter(r => r.status === "Present" || r.status === "Late").length;
        const attainment = Math.round(((perf.deals || 0) / (ag.target || 40)) * 100);
        const agentLeads = leads.filter(l => l.assignedTo === ag.id);
        return (
          <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setSelectedAgent(null)}>
            <div style={{ background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 32, width: 560, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "center" }}>
                <div style={s.avatar(64)}>{ag.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{ag.name}</div>
                  <div style={{ fontSize: 13, color: "#4b5a78" }}>{ag.department} · {ag.email}</div>
                </div>
                <button onClick={() => setSelectedAgent(null)} style={{ background: "transparent", border: "none", color: "#4b5a78", fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[{ label: "Revenue", val: `₱${(perf.revenue || 0).toLocaleString()}`, color: "#10b981" }, { label: "Deals", val: perf.deals || 0, color: "#60a5fa" }, { label: "Calls", val: perf.calls || 0, color: "#a78bfa" }, { label: "Tasks", val: perf.tasks || 0, color: "#f59e0b" }].map(m => (
                  <div key={m.label} style={{ background: "#0f1117", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
                    <div style={{ fontSize: 10, color: "#4b5a78", marginTop: 3 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Target Attainment</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444" }}>{attainment}%</span>
                </div>
                <div style={{ height: 8, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(attainment, 100)}%`, background: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: "#4b5a78", marginTop: 5 }}>{perf.deals} of {ag.target} deals</div>
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Attendance Log</div>
                {attRecs.map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1e2535" }}>
                    <span style={{ fontSize: 12, color: "#8899b4" }}>{r.date}</span>
                    <span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span>
                    <span style={{ fontSize: 11, color: "#4b5a78" }}>{r.in ? `${r.in} – ${r.out || "ongoing"}` : "—"}</span>
                  </div>
                ))}
                <div style={{ marginTop: 8, fontSize: 12, color: "#4b5a78" }}>Rate: <span style={{ color: "#fff", fontWeight: 700 }}>{attRecs.length ? Math.round((presentDays / attRecs.length) * 100) : 0}%</span></div>
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Leads ({agentLeads.length})</div>
                {agentLeads.length === 0 && <div style={{ fontSize: 12, color: "#4b5a78" }}>No leads assigned.</div>}
                {agentLeads.map(lead => (
                  <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #1e2535" }}>
                    <span style={{ fontSize: 13, color: "#c8d4e8", fontWeight: 600 }}>{lead.name}</span>
                    <span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span>
                    <span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>₱{lead.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function FreedomBoard({ boardPosts, setBoardPosts, currentUser, isAdmin }) {
  const [filterCat, setFilterCat] = useState("All");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "Idea" });
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const categories = ["All", "Idea", "Question", "Concern", "Shoutout", "General"];

  const filtered = boardPosts
    .filter(p => filterCat === "All" || p.category === filterCat)
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date) - new Date(a.date));

  const handleReact = (postId, emoji) => {
    setBoardPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const already = p.reactions[emoji]?.includes(currentUser.name);
      return { ...p, reactions: { ...p.reactions, [emoji]: already ? p.reactions[emoji].filter(n => n !== currentUser.name) : [...(p.reactions[emoji] || []), currentUser.name] } };
    }));
  };

  const handleComment = (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;
    setBoardPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: [...p.comments, { author: currentUser.name, avatar: currentUser.avatar, text, date: today }] }));
    setCommentText(prev => ({ ...prev, [postId]: "" }));
  };

  const handlePin = (postId) => setBoardPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, pinned: !p.pinned }));
  const handleDelete = (postId) => setBoardPosts(prev => prev.filter(p => p.id !== postId));

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;
    setBoardPosts(prev => [{ id: Date.now(), author: currentUser.name, avatar: currentUser.avatar, category: newPost.category, title: newPost.title, body: newPost.body, date: today, pinned: false, reactions: { "👍": [], "❤️": [], "🔥": [] }, comments: [] }, ...prev]);
    setNewPost({ title: "", body: "", category: "Idea" });
    setNewPostOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>📌 Freedom Board</div>
          <div style={{ fontSize: 13, color: "#4b5a78", marginTop: 3 }}>Open space for the whole team — ask, share, shoutout, or speak up!</div>
        </div>
        <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", padding: "10px 20px" }} onClick={() => setNewPostOpen(true)}>+ New Post</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filterCat === cat ? (catColors[cat] || "#3b82f6") : "#1e2535", color: filterCat === cat ? "#fff" : "#8899b4" }}>{cat !== "All" ? catIcons[cat] + " " : ""}{cat}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#4b5a78" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🗒️</div>
            <div style={{ fontSize: 14 }}>No posts yet. Be the first to share something!</div>
          </div>
        )}
        {filtered.map(post => {
          const isExpanded = expandedPost === post.id;
          const canDelete = isAdmin || post.author === currentUser.name;
          return (
            <div key={post.id} style={{ background: "#161b27", borderRadius: 16, border: `1px solid ${post.pinned ? "#3b82f655" : "#1e2535"}`, overflow: "hidden" }}>
              {post.pinned && (
                <div style={{ background: "linear-gradient(90deg,#1e3a5f,#162032)", padding: "6px 20px", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12 }}>📌</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>PINNED BY ADMIN</span>
                </div>
              )}
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <div style={s.avatar(40)}>{post.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{post.author}</span>
                      <span style={s.badge(catColors[post.category] || "#4b5a78")}>{catIcons[post.category]} {post.category}</span>
                      <span style={{ fontSize: 11, color: "#4b5a78" }}>{post.date}</span>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginTop: 6 }}>{post.title}</div>
                  </div>
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    {isAdmin && <button onClick={() => handlePin(post.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: post.pinned ? "#60a5fa" : "#4b5a78", padding: 4 }}>📌</button>}
                    {canDelete && <button onClick={() => handleDelete(post.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: "#4b5a78", padding: 4 }}>🗑️</button>}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#c8d4e8", lineHeight: 1.7, background: "#0f1117", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>{post.body}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  {["👍", "❤️", "🔥"].map(emoji => {
                    const count = post.reactions[emoji]?.length || 0;
                    const reacted = post.reactions[emoji]?.includes(currentUser.name);
                    return (
                      <button key={emoji} onClick={() => handleReact(post.id, emoji)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, border: `1px solid ${reacted ? "#3b82f6" : "#1e2535"}`, background: reacted ? "#1e3a5f" : "#0f1117", cursor: "pointer", fontSize: 13, color: reacted ? "#60a5fa" : "#8899b4" }}>
                        {emoji} {count > 0 && <span style={{ fontSize: 12, fontWeight: 600 }}>{count}</span>}
                      </button>
                    );
                  })}
                  <button onClick={() => setExpandedPost(isExpanded ? null : post.id)} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#4b5a78" }}>
                    💬 {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""} {isExpanded ? "▲" : "▼"}
                  </button>
                </div>
                {isExpanded && (
                  <div style={{ marginTop: 16, borderTop: "1px solid #1e2535", paddingTop: 16 }}>
                    {post.comments.length === 0 && <div style={{ fontSize: 12, color: "#4b5a78", marginBottom: 14 }}>No comments yet.</div>}
                    {post.comments.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                        <div style={s.avatar(30)}>{c.avatar}</div>
                        <div style={{ flex: 1, background: "#0f1117", borderRadius: 10, padding: "9px 13px" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{c.author}</span>
                            <span style={{ fontSize: 10, color: "#4b5a78" }}>{c.date}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#c8d4e8", lineHeight: 1.6 }}>{c.text}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
                      <div style={s.avatar(30)}>{currentUser.avatar}</div>
                      <input style={{ ...s.input, flex: 1 }} placeholder="Write a comment…" value={commentText[post.id] || ""} onChange={e => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleComment(post.id)} />
                      <button style={{ ...s.btn("primary"), padding: "9px 14px", flexShrink: 0 }} onClick={() => handleComment(post.id)}>Send</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {newPostOpen && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setNewPostOpen(false)}>
          <div style={{ background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 32, width: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 20 }}>✍️ New Post</div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Category</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Idea", "Question", "Concern", "Shoutout", "General"].map(cat => (
                  <button key={cat} onClick={() => setNewPost(p => ({ ...p, category: cat }))} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: newPost.category === cat ? (catColors[cat] || "#3b82f6") : "#1e2535", color: newPost.category === cat ? "#fff" : "#8899b4" }}>{catIcons[cat]} {cat}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Title</label>
              <input style={s.input} placeholder="What's on your mind?" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Message</label>
              <textarea style={{ ...s.input, minHeight: 100, resize: "vertical" }} placeholder="Share your thoughts with the team…" value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn("secondary")} onClick={() => setNewPostOpen(false)}>Cancel</button>
              <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={handleSubmitPost}>Post to Board</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// MAIN CRM COMPONENT
// ============================================================
export default function CRM() {
  const [view, setView] = useState("login");
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [agents, setAgents] = useState(initialAgents);
  const [leads, setLeads] = useState(initialLeads);
  const [attendance, setAttendance] = useState(initialAttendance);
  const [performance] = useState(initialPerformance);
  const [boardPosts, setBoardPosts] = useState(initialBoardPosts);
  const [notifications] = useState([
    { id: 1, text: "James Reyes was late today", type: "warning", time: "08:30" },
    { id: 2, text: "Nova Solutions deal closed!", type: "success", time: "09:15" },
    { id: 3, text: "Follow-up due: BrightTech", type: "info", time: "10:00" },
  ]);
  const [showNotif, setShowNotif] = useState(false);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [leadModal, setLeadModal] = useState(null);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", contact: "", email: "", phone: "", status: "New", value: "", notes: "" });
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", department: "Sales", target: 40 });
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const allUsers = [
    { id: 0, name: "Admin User", email: "admin@company.com", password: "admin123", role: "admin", avatar: "AD" },
    ...agents.map(a => ({ ...a, password: "agent123" })),
  ];

  const handleLogin = (email, password) => {
    const user = allUsers.find(u => u.email === email && u.password === password);
    if (user) { setCurrentUser(user); setView("app"); setActiveTab("dashboard"); }
    else alert("Invalid credentials. Try admin@company.com / admin123");
  };

  const handleClockIn = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    setClockedIn(true); setClockTime(now);
    setAttendance(prev => {
      const existing = prev[currentUser.id] || [];
      return { ...prev, [currentUser.id]: [...existing.filter(r => r.date !== today), { date: today, in: now, out: null, status: now > "08:15" ? "Late" : "Present" }] };
    });
  };

  const handleClockOut = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    setClockedIn(false);
    setAttendance(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).map(r => r.date === today ? { ...r, out: now } : r) }));
  };

  const getAiInsight = async () => {
    setAiLoading(true); setAiInsight("");
    const totalRevenue = Object.values(performance).reduce((s, p) => s + p.revenue, 0);
    const totalDeals = Object.values(performance).reduce((s, p) => s + p.deals, 0);
    const topAgent = agents.reduce((best, a) => (performance[a.id]?.revenue || 0) > (performance[best.id]?.revenue || 0) ? a : best, agents[0]);
    const prompt = `You are a CRM analyst. Team summary: Total revenue: ₱${totalRevenue.toLocaleString()}, Deals closed: ${totalDeals}, Top performer: ${topAgent.name} (₱${performance[topAgent.id]?.revenue.toLocaleString()}), Leads: ${leads.length} total, ${leads.filter(l => l.status === "Closed Won").length} won. Give 3-4 sentences of insight and 2 actionable recommendations. Be direct.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      setAiInsight(data.content?.[0]?.text || "No insight available.");
    } catch { setAiInsight("Could not load AI insight."); }
    setAiLoading(false);
  };

  if (view === "login") return <LoginPage onLogin={handleLogin} />;

  const isAdmin = currentUser?.role === "admin";
  const myLeads = leads.filter(l => l.assignedTo === currentUser?.id);
  const myAttendance = attendance[currentUser?.id] || [];
  const myPerf = performance[currentUser?.id] || {};
  const totalRevenue = Object.values(performance).reduce((s, p) => s + p.revenue, 0);
  const totalDeals = Object.values(performance).reduce((s, p) => s + p.deals, 0);

  const tabsAdmin = ["dashboard", "overview", "leads", "agents", "attendance", "performance", "automations", "board"];
  const tabsAgent = ["dashboard", "my-leads", "my-attendance", "my-performance", "board"];
  const tabs = isAdmin ? tabsAdmin : tabsAgent;
  const tabLabels = { dashboard: "Dashboard", overview: "Agent Overview", leads: "Leads", agents: "Team", attendance: "Attendance", performance: "Performance", automations: "Automations", board: "Freedom Board", "my-leads": "My Leads", "my-attendance": "My Attendance", "my-performance": "My Performance" };
  const tabIcons = { dashboard: "📊", overview: "🪪", leads: "🎯", agents: "👥", attendance: "🕐", performance: "📈", automations: "⚙️", board: "📌", "my-leads": "🎯", "my-attendance": "🕐", "my-performance": "📈" };

  const renderContent = () => {
    if (activeTab === "board") return <FreedomBoard boardPosts={boardPosts} setBoardPosts={setBoardPosts} currentUser={currentUser} isAdmin={isAdmin} />;
    if (activeTab === "overview") return <AgentOverview agents={agents} performance={performance} attendance={attendance} leads={leads} isAdmin={isAdmin} />;

    if (isAdmin) {
      if (activeTab === "dashboard") return (
        <div>
          <div style={s.grid4}>
            {[{ label: "Total Revenue", val: `₱${totalRevenue.toLocaleString()}`, change: "+12% this month", pos: true, icon: "💰" }, { label: "Deals Closed", val: totalDeals, change: "+3 this week", pos: true, icon: "🤝" }, { label: "Active Leads", val: leads.filter(l => l.status !== "Closed Lost").length, change: `${leads.filter(l => l.status === "New").length} new`, pos: true, icon: "🎯" }, { label: "Team Present", val: `${agents.length - 1}/${agents.length}`, change: "1 absent today", pos: false, icon: "👥" }].map((stat, i) => (
              <div key={i} style={s.statCard}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{stat.icon}</div>
                <div style={s.statVal}>{stat.val}</div>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={s.statChange(stat.pos)}>{stat.change}</div>
              </div>
            ))}
          </div>
          <div style={s.grid2}>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Lead Pipeline</div>
              {["New", "Follow-up", "Negotiation", "Closed Won"].map(status => {
                const count = leads.filter(l => l.status === status).length;
                const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
                return (
                  <div key={status} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#8899b4" }}>{status}</span>
                      <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: statusColors[status], borderRadius: 99 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Top Performers</div>
              {[...agents].sort((a, b) => (performance[b.id]?.revenue || 0) - (performance[a.id]?.revenue || 0)).map((agent, i) => (
                <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "#4b5a78", width: 16 }}>#{i + 1}</div>
                  <div style={s.avatar(32)}>{agent.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{agent.name}</div>
                    <div style={{ fontSize: 11, color: "#4b5a78" }}>₱{(performance[agent.id]?.revenue || 0).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>{performance[agent.id]?.deals || 0} deals</div>
                </div>
              ))}
            </div>
          </div>
          <div style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>🤖 AI Team Insight</div>
              <button style={s.btn("secondary")} onClick={getAiInsight} disabled={aiLoading}>{aiLoading ? "Analyzing..." : "Generate Insight"}</button>
            </div>
            {aiInsight ? <div style={{ fontSize: 13, color: "#c8d4e8", lineHeight: 1.8, background: "#0f1117", borderRadius: 10, padding: "14px 18px" }}>{aiInsight}</div> : <div style={{ fontSize: 13, color: "#4b5a78" }}>Click "Generate Insight" for an AI-powered team analysis.</div>}
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>🔔 Notifications</div>
            {notifications.map(n => (
              <div key={n.id} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: "1px solid #0f1117" }}>
                <div style={{ fontSize: 16 }}>{n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : "ℹ️"}</div>
                <div><div style={{ fontSize: 13, color: "#c8d4e8" }}>{n.text}</div><div style={{ fontSize: 11, color: "#4b5a78", marginTop: 2 }}>{n.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      );

      if (activeTab === "leads") return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: "#4b5a78" }}>{leads.length} total leads</div>
            <button style={s.btn("primary")} onClick={() => setAddLeadOpen(true)}>+ Add Lead</button>
          </div>
          <div style={s.card}>
            <table style={s.table}>
              <thead><tr>{["Company", "Contact", "Status", "Assigned To", "Value", "Date", "Action"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{leads.map(lead => {
                const agent = agents.find(a => a.id === lead.assignedTo);
                return (
                  <tr key={lead.id} style={{ cursor: "pointer" }} onClick={() => setLeadModal(lead)}>
                    <td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td>
                    <td style={s.td}>{lead.contact}</td>
                    <td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td>
                    <td style={s.td}>{agent?.name || "Unassigned"}</td>
                    <td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td>
                    <td style={s.td}>{lead.date}</td>
                    <td style={s.td} onClick={e => { e.stopPropagation(); setLeads(prev => prev.filter(l => l.id !== lead.id)); }}><span style={{ color: "#ef4444", fontSize: 12, cursor: "pointer" }}>Remove</span></td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        </div>
      );

      if (activeTab === "agents") return (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
            <button style={s.btn("primary")} onClick={() => setAddAgentOpen(true)}>+ Add Agent</button>
          </div>
          <div style={s.grid2}>
            {agents.map(agent => {
              const perf = performance[agent.id] || {};
              const attRecs = attendance[agent.id] || [];
              const presentDays = attRecs.filter(r => r.status === "Present" || r.status === "Late").length;
              return (
                <div key={agent.id} style={s.card}>
                  <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                    <div style={s.avatar(46)}>{agent.avatar}</div>
                    <div><div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{agent.name}</div><div style={{ fontSize: 12, color: "#4b5a78" }}>{agent.department} · {agent.email}</div><span style={s.badge("#10b981")}>Active</span></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[{ label: "Deals", val: perf.deals || 0 }, { label: "Revenue", val: `₱${(perf.revenue || 0).toLocaleString()}` }, { label: "Calls", val: perf.calls || 0 }, { label: "Attendance", val: `${presentDays}/${attRecs.length}d` }].map(m => (
                      <div key={m.label} style={{ background: "#0f1117", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: "#4b5a78" }}>{m.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2 }}>{m.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );

      if (activeTab === "attendance") return (
        <div style={s.card}>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Agent</th>{["May 12", "May 13", "May 14", "May 15"].map(d => <th key={d} style={s.th}>{d}</th>)}<th style={s.th}>Rate</th></tr></thead>
            <tbody>{agents.map(agent => {
              const recs = attendance[agent.id] || [];
              const present = recs.filter(r => r.status === "Present" || r.status === "Late").length;
              return (
                <tr key={agent.id}>
                  <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={s.avatar(28)}>{agent.avatar}</div><span style={{ fontWeight: 600, color: "#fff" }}>{agent.name}</span></div></td>
                  {recs.map((r, i) => <td key={i} style={s.td}><span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span>{r.in && <div style={{ fontSize: 10, color: "#4b5a78", marginTop: 3 }}>{r.in}–{r.out || "—"}</div>}</td>)}
                  <td style={s.td}><div style={{ fontWeight: 700, color: present >= 3 ? "#10b981" : "#f59e0b" }}>{recs.length ? Math.round((present / recs.length) * 100) : 0}%</div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      );

      if (activeTab === "performance") return (
        <div style={s.card}>
          <table style={s.table}>
            <thead><tr>{["Agent", "Calls", "Deals", "Revenue", "Tasks", "Target", "Attainment"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{agents.map(agent => {
              const perf = performance[agent.id] || {};
              const attainment = Math.round(((perf.deals || 0) / (agent.target || 40)) * 100);
              return (
                <tr key={agent.id}>
                  <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={s.avatar(30)}>{agent.avatar}</div><div><div style={{ fontWeight: 600, color: "#fff" }}>{agent.name}</div><div style={{ fontSize: 11, color: "#4b5a78" }}>{agent.department}</div></div></div></td>
                  <td style={s.td}>{perf.calls}</td><td style={s.td}>{perf.deals}</td>
                  <td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{perf.revenue?.toLocaleString()}</span></td>
                  <td style={s.td}>{perf.tasks}</td><td style={s.td}>{agent.target}</td>
                  <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 6, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(attainment, 100)}%`, background: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} /></div><span style={{ fontSize: 12, fontWeight: 700, color: attainment >= 100 ? "#10b981" : "#f59e0b" }}>{attainment}%</span></div></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      );

      if (activeTab === "automations") return (
        <div>{[{ icon: "📧", name: "Follow-up Reminder", desc: "Auto-remind agents when a lead hasn't been contacted in 3 days", status: "Active" }, { icon: "⚠️", name: "Late Attendance Alert", desc: "Notify admin when an agent clocks in after 08:15", status: "Active" }, { icon: "🏆", name: "Deal Won Celebration", desc: "Post to team channel when a deal is closed", status: "Active" }, { icon: "📊", name: "Weekly Performance Report", desc: "Send performance summary every Monday 8AM", status: "Active" }, { icon: "🔁", name: "Lead Reassignment", desc: "Auto-reassign leads if agent is absent 2+ days", status: "Inactive" }].map((r, i) => (
          <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 28 }}>{r.icon}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{r.name}</div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 3 }}>{r.desc}</div></div>
            <span style={s.badge(r.status === "Active" ? "#10b981" : "#4b5a78")}>{r.status}</span>
          </div>
        ))}</div>
      );
    } else {
      // AGENT VIEWS
      if (activeTab === "dashboard") return (
        <div>
          <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={s.avatar(56)}>{currentUser.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Welcome, {currentUser.name.split(" ")[0]}!</div>
              <div style={{ fontSize: 13, color: "#4b5a78" }}>{currentTime.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#60a5fa", marginTop: 4 }}>{currentTime.toLocaleTimeString()}</div>
            </div>
            <div>{!clockedIn ? <button style={{ ...s.btn("primary"), background: "#10b981" }} onClick={handleClockIn}>🟢 Clock In</button> : <button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
          </div>
          {clockedIn && clockTime && <div style={{ ...s.card, background: "#0d2a1a", borderColor: "#10b981", marginBottom: 20 }}><div style={{ fontSize: 13, color: "#10b981" }}>✅ Clocked in at <strong>{clockTime}</strong>. Have a great day!</div></div>}
          <div style={s.grid4}>
            {[{ label: "My Deals", val: myPerf.deals || 0, icon: "🤝" }, { label: "Revenue", val: `₱${(myPerf.revenue || 0).toLocaleString()}`, icon: "💰" }, { label: "Calls", val: myPerf.calls || 0, icon: "📞" }, { label: "My Leads", val: myLeads.length, icon: "🎯" }].map((stat, i) => (
              <div key={i} style={s.statCard}><div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div><div style={s.statVal}>{stat.val}</div><div style={s.statLabel}>{stat.label}</div></div>
            ))}
          </div>
          <div style={s.card}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>My Leads</div>
            <table style={s.table}>
              <thead><tr>{["Company", "Status", "Value", "Notes"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{myLeads.map(lead => <tr key={lead.id}><td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td><td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td><td style={s.td}>{lead.notes}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      );

      if (activeTab === "my-leads") return (
        <div style={s.card}>
          <table style={s.table}>
            <thead><tr>{["Company", "Contact", "Status", "Value", "Notes"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{myLeads.map(lead => <tr key={lead.id}><td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td><td style={s.td}>{lead.contact}</td><td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td><td style={s.td}>{lead.notes}</td></tr>)}</tbody>
          </table>
        </div>
      );

      if (activeTab === "my-attendance") return (
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>My Attendance Log</div>
            <div>{!clockedIn ? <button style={{ ...s.btn("primary"), background: "#10b981" }} onClick={handleClockIn}>🟢 Clock In</button> : <button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
          </div>
          <table style={s.table}>
            <thead><tr>{["Date", "Status", "Time In", "Time Out", "Hours"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{[...myAttendance].reverse().map((r, i) => {
              const hours = r.in && r.out ? ((parseInt(r.out.split(":")[0]) * 60 + parseInt(r.out.split(":")[1])) - (parseInt(r.in.split(":")[0]) * 60 + parseInt(r.in.split(":")[1]))) / 60 : 0;
              return <tr key={i}><td style={s.td}>{r.date}</td><td style={s.td}><span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span></td><td style={s.td}>{r.in || "—"}</td><td style={s.td}>{r.out || "—"}</td><td style={s.td}>{hours > 0 ? `${hours.toFixed(1)}h` : "—"}</td></tr>;
            })}</tbody>
          </table>
        </div>
      );

      if (activeTab === "my-performance") {
        const attainment = Math.round(((myPerf.deals || 0) / (currentUser.target || 40)) * 100);
        return (
          <div>
            <div style={s.grid4}>
              {[{ label: "Deals Closed", val: myPerf.deals || 0, icon: "🤝" }, { label: "Revenue", val: `₱${(myPerf.revenue || 0).toLocaleString()}`, icon: "💰" }, { label: "Calls Made", val: myPerf.calls || 0, icon: "📞" }, { label: "Tasks Done", val: myPerf.tasks || 0, icon: "✅" }].map((stat, i) => (
                <div key={i} style={s.statCard}><div style={{ fontSize: 22, marginBottom: 6 }}>{stat.icon}</div><div style={s.statVal}>{stat.val}</div><div style={s.statLabel}>{stat.label}</div></div>
              ))}
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Target Attainment</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#8899b4" }}>{myPerf.deals} of {currentUser.target} deals</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: attainment >= 100 ? "#10b981" : "#f59e0b" }}>{attainment}%</span>
              </div>
              <div style={{ height: 12, background: "#1e2535", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(attainment, 100)}%`, background: attainment >= 100 ? "#10b981" : attainment >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} />
              </div>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={s.sidebar}>
        <div style={s.logo}>
          <div style={s.logoText}>⚡ TeamCRM</div>
          <div style={s.logoSub}>{isAdmin ? "Admin Panel" : "Agent Portal"}</div>
        </div>
        <div style={s.nav}>
          {tabs.map(tab => (
            <div key={tab} style={s.navItem(activeTab === tab)} onClick={() => setActiveTab(tab)}>
              <span style={s.navIcon}>{tabIcons[tab]}</span>{tabLabels[tab]}
            </div>
          ))}
        </div>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2535" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={s.avatar(32)}>{currentUser.avatar}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#c8d4e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: "#4b5a78" }}>{isAdmin ? "Administrator" : "Agent"}</div>
            </div>
            <div style={{ fontSize: 16, cursor: "pointer", color: "#4b5a78" }} onClick={() => { setCurrentUser(null); setView("login"); }}>🚪</div>
          </div>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={s.topbarTitle}>{tabLabels[activeTab]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, color: "#4b5a78" }}>{currentTime.toLocaleTimeString()}</div>
            <div style={{ position: "relative" }}>
              <button style={{ ...s.btn("ghost"), padding: "8px 12px" }} onClick={() => setShowNotif(!showNotif)}>
                🔔 <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 5px", marginLeft: 2 }}>{notifications.length}</span>
              </button>
              {showNotif && (
                <div style={{ position: "absolute", right: 0, top: 44, width: 280, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 12, zIndex: 50 }}>
                  {notifications.map(n => <div key={n.id} style={{ padding: "8px 0", borderBottom: "1px solid #0f1117", fontSize: 12, color: "#c8d4e8" }}>{n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : "ℹ️"} {n.text}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={s.content}>{renderContent()}</div>
      </div>

      {leadModal && (
        <div style={s.modal} onClick={() => setLeadModal(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{leadModal.name}</div>
              <button style={s.btn("ghost")} onClick={() => setLeadModal(null)}>✕</button>
            </div>
            {[["Contact", leadModal.contact], ["Email", leadModal.email], ["Phone", leadModal.phone], ["Status", leadModal.status], ["Value", `₱${leadModal.value.toLocaleString()}`], ["Assigned To", agents.find(a => a.id === leadModal.assignedTo)?.name], ["Date", leadModal.date], ["Notes", leadModal.notes]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 12 }}><div style={s.label}>{k}</div><div style={{ fontSize: 13, color: "#c8d4e8" }}>{v}</div></div>
            ))}
          </div>
        </div>
      )}

      {addLeadOpen && (
        <div style={s.modal} onClick={() => setAddLeadOpen(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Add New Lead</div>
            {[["Company Name", "name", "text"], ["Contact Person", "contact", "text"], ["Email", "email", "email"], ["Phone", "phone", "text"], ["Value (₱)", "value", "number"], ["Notes", "notes", "text"]].map(([label, field, type]) => (
              <div key={field} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type={type} value={newLead[field]} onChange={e => setNewLead(p => ({ ...p, [field]: e.target.value }))} /></div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Assign To</label>
              <select style={s.input} onChange={e => setNewLead(p => ({ ...p, assignedTo: parseInt(e.target.value) }))}>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={s.btn("secondary")} onClick={() => setAddLeadOpen(false)}>Cancel</button>
              <button style={s.btn("primary")} onClick={() => { setLeads(prev => [...prev, { ...newLead, id: Date.now(), status: "New", date: today, value: parseInt(newLead.value) || 0, assignedTo: newLead.assignedTo || agents[0]?.id }]); setAddLeadOpen(false); setNewLead({ name: "", contact: "", email: "", phone: "", status: "New", value: "", notes: "" }); }}>Add Lead</button>
            </div>
          </div>
        </div>
      )}

      {addAgentOpen && (
        <div style={s.modal} onClick={() => setAddAgentOpen(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Add New Agent</div>
            {[["Full Name", "name"], ["Email", "email"]].map(([label, field]) => (
              <div key={field} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} value={newAgent[field]} onChange={e => setNewAgent(p => ({ ...p, [field]: e.target.value }))} /></div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Department</label>
              <select style={s.input} value={newAgent.department} onChange={e => setNewAgent(p => ({ ...p, department: e.target.value }))}>
                {["Sales", "Support", "Operations"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Monthly Deal Target</label>
              <input style={s.input} type="number" value={newAgent.target} onChange={e => setNewAgent(p => ({ ...p, target: parseInt(e.target.value) }))} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button style={s.btn("secondary")} onClick={() => setAddAgentOpen(false)}>Cancel</button>
              <button style={s.btn("primary")} onClick={() => { const initials = newAgent.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2); setAgents(prev => [...prev, { ...newAgent, id: Date.now(), role: "agent", avatar: initials, status: "active" }]); setAddAgentOpen(false); setNewAgent({ name: "", email: "", department: "Sales", target: 40 }); }}>Add Agent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
ENDOFFILE
echo "Done"