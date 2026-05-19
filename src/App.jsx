import { useState, useEffect } from "react";

// ── Persistent storage using localStorage ──────────────────
const storage = {
  get: (key, fallback) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
};

const initialUsers = [
  { id: 1, name: "Admin User", email: "admin@company.com", password: "admin123", role: "admin", avatar: "AD", department: "Management", target: 0, status: "active", joined: "2026-01-01" },
  { id: 2, name: "Maria Santos", email: "maria@company.com", password: "agent123", role: "agent", avatar: "MS", department: "Sales", target: 50, status: "active", joined: "2026-01-15" },
  { id: 3, name: "James Reyes", email: "james@company.com", password: "agent123", role: "agent", avatar: "JR", department: "Support", target: 40, status: "active", joined: "2026-02-01" },
  { id: 4, name: "Ana Cruz", email: "ana@company.com", password: "agent123", role: "agent", avatar: "AC", department: "Sales", target: 45, status: "active", joined: "2026-02-10" },
  { id: 5, name: "Carlo Lim", email: "carlo@company.com", password: "agent123", role: "agent", avatar: "CL", department: "Operations", target: 35, status: "active", joined: "2026-03-01" },
];

const initialLeads = [
  { id: 1, name: "Acme Corp", contact: "John Doe", email: "john@acme.com", phone: "09171234567", status: "New", assignedTo: 2, value: 12000, notes: "Interested in enterprise plan", date: "2026-05-10" },
  { id: 2, name: "BrightTech", contact: "Sara Lee", email: "sara@bright.com", phone: "09181234567", status: "Follow-up", assignedTo: 3, value: 8500, notes: "Demo scheduled", date: "2026-05-12" },
  { id: 3, name: "Nova Solutions", contact: "Mike Tan", email: "mike@nova.com", phone: "09191234567", status: "Closed Won", assignedTo: 2, value: 22000, notes: "Signed contract", date: "2026-05-08" },
  { id: 4, name: "Globe Partners", contact: "Lia Gomez", email: "lia@globe.com", phone: "09201234567", status: "Negotiation", assignedTo: 4, value: 15000, notes: "Awaiting proposal", date: "2026-05-14" },
  { id: 5, name: "Summit Inc", contact: "Rex Bautista", email: "rex@summit.com", phone: "09211234567", status: "New", assignedTo: 5, value: 5000, notes: "Cold lead from LinkedIn", date: "2026-05-15" },
];

const today = new Date().toISOString().split("T")[0];

const initialAttendance = {
  2: [{ date: "2026-05-12", in: "08:01", out: "17:05", status: "Present" }, { date: "2026-05-13", in: "08:15", out: "17:00", status: "Present" }, { date: "2026-05-14", in: null, out: null, status: "Absent" }, { date: "2026-05-15", in: "07:58", out: "17:10", status: "Present" }],
  3: [{ date: "2026-05-12", in: "08:30", out: "17:00", status: "Late" }, { date: "2026-05-13", in: "08:05", out: "17:00", status: "Present" }, { date: "2026-05-14", in: "08:00", out: "17:00", status: "Present" }, { date: "2026-05-15", in: "08:20", out: "17:00", status: "Late" }],
  4: [{ date: "2026-05-12", in: "07:55", out: "17:00", status: "Present" }, { date: "2026-05-13", in: "08:00", out: "17:00", status: "Present" }, { date: "2026-05-14", in: "08:00", out: "17:00", status: "Present" }, { date: "2026-05-15", in: "08:00", out: "17:00", status: "Present" }],
  5: [{ date: "2026-05-12", in: "08:00", out: "17:00", status: "Present" }, { date: "2026-05-13", in: null, out: null, status: "Leave" }, { date: "2026-05-14", in: "08:10", out: "17:00", status: "Present" }, { date: "2026-05-15", in: "08:00", out: "17:00", status: "Present" }],
};

const initialPerformance = { 2: { calls: 38, deals: 5, revenue: 34000, tasks: 22 }, 3: { calls: 29, deals: 3, revenue: 18500, tasks: 18 }, 4: { calls: 42, deals: 6, revenue: 41000, tasks: 25 }, 5: { calls: 21, deals: 2, revenue: 10000, tasks: 15 } };

const initialBoardPosts = [
  { id: 1, author: "Maria Santos", avatar: "MS", category: "Idea", title: "Weekly team huddle", body: "Can we set a fixed 15-min standup every Monday morning?", date: "2026-05-17", pinned: true, reactions: { "👍": ["James Reyes", "Ana Cruz"], "❤️": ["Carlo Lim"], "🔥": [] }, comments: [{ author: "James Reyes", avatar: "JR", text: "Totally agree!", date: "2026-05-17" }] },
  { id: 2, author: "Carlo Lim", avatar: "CL", category: "Question", title: "Leave filing process?", body: "Where do we file our leave requests?", date: "2026-05-16", pinned: false, reactions: { "👍": ["Ana Cruz"], "❤️": [], "🔥": [] }, comments: [{ author: "Admin User", avatar: "AD", text: "Message me directly for now!", date: "2026-05-16" }] },
  { id: 3, author: "Ana Cruz", avatar: "AC", category: "Shoutout", title: "Big thanks to Maria!", body: "Shoutout to Maria for closing the Nova Solutions deal!", date: "2026-05-15", pinned: false, reactions: { "👍": ["Carlo Lim", "James Reyes"], "❤️": ["Admin User"], "🔥": ["James Reyes"] }, comments: [] },
];

const statusColors = { "New": "#3b82f6", "Follow-up": "#f59e0b", "Negotiation": "#8b5cf6", "Closed Won": "#10b981", "Closed Lost": "#ef4444" };
const attColors = { "Present": "#10b981", "Late": "#f59e0b", "Absent": "#ef4444", "Leave": "#8b5cf6" };
const catColors = { Idea: "#3b82f6", Question: "#f59e0b", Concern: "#ef4444", Shoutout: "#10b981", General: "#8b5cf6" };
const catIcons = { Idea: "💡", Question: "❓", Concern: "⚠️", Shoutout: "🏆", General: "💬" };

const s = {
  app: { fontFamily: "'DM Sans', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0", display: "flex" },
  sidebar: { width: 220, background: "#161b27", borderRight: "1px solid #1e2535", display: "flex", flexDirection: "column" },
  nav: { flex: 1, padding: "12px 8px", overflowY: "auto" },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, marginBottom: 2, cursor: "pointer", fontSize: 13, fontWeight: a ? 600 : 400, background: a ? "#1e3a5f" : "transparent", color: a ? "#60a5fa" : "#8899b4" }),
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  topbar: { background: "#161b27", borderBottom: "1px solid #1e2535", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  content: { flex: 1, padding: "28px", overflowY: "auto" },
  card: { background: "#161b27", borderRadius: 14, border: "1px solid #1e2535", padding: "20px 24px", marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 },
  grid4: { display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" },
  statCard: { background: "#161b27", borderRadius: 14, border: "1px solid #1e2535", padding: "20px 22px", flex: 1 },
  badge: (c) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c + "22", color: c }),
  btn: (v = "primary") => ({ padding: "9px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: v === "primary" ? "#3b82f6" : v === "danger" ? "#ef4444" : v === "success" ? "#10b981" : v === "ghost" ? "transparent" : "#1e2535", color: v === "ghost" ? "#8899b4" : "#fff" }),
  input: { width: "100%", background: "#0f1117", border: "1px solid #1e2535", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" },
  label: { fontSize: 12, color: "#4b5a78", fontWeight: 600, marginBottom: 5, display: "block" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, color: "#4b5a78", textTransform: "uppercase", borderBottom: "1px solid #1e2535" },
  td: { padding: "13px 14px", fontSize: 13, borderBottom: "1px solid #0f1117", color: "#c8d4e8" },
  avatar: (size = 36) => ({ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg,#3b82f6,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "#fff", flexShrink: 0 }),
  modal: { position: "fixed", inset: 0, background: "#000a", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modalBox: { background: "#161b27", borderRadius: 16, border: "1px solid #1e2535", padding: 28, width: 460, maxHeight: "90vh", overflowY: "auto" },
};

// ── Auth Pages ─────────────────────────────────────────────
function AuthPage({ users, setUsers, onLogin }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", department: "Sales", role: "agent" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleLogin = () => {
    setError("");
    const user = users.find(u => u.email.toLowerCase() === form.email.toLowerCase() && u.password === form.password);
    if (!user) return setError("Incorrect email or password.");
    if (user.status === "inactive") return setError("Your account has been deactivated. Contact your admin.");
    onLogin(user);
  };

  const handleSignup = () => {
    setError("");
    if (!form.name || !form.email || !form.password) return setError("Please fill in all fields.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return setError("An account with this email already exists.");
    const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const newUser = { id: Date.now(), name: form.name, email: form.email, password: form.password, role: "agent", avatar: initials, department: form.department, target: 40, status: "active", joined: today };
    const updated = [...users, newUser];
    setUsers(updated);
    storage.set("crm_users", updated);
    setSuccess("Account created! You can now sign in.");
    setMode("login");
    setForm(p => ({ ...p, password: "", confirm: "" }));
  };

  const handleForgot = () => {
    setError("");
    const user = users.find(u => u.email.toLowerCase() === form.email.toLowerCase());
    if (!user) return setError("No account found with that email.");
    setSuccess(`Password reminder: your password is "${user.password}". Please change it after logging in.`);
  };

  return (
    <div style={{ ...s.app, alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 60% 40%, #1e2f50 0%, #0f1117 70%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{ width: 400, background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>TeamCRM</div>
          <div style={{ fontSize: 13, color: "#4b5a78", marginTop: 4 }}>
            {mode === "login" ? "Sign in to your workspace" : mode === "signup" ? "Create your account" : "Reset your password"}
          </div>
        </div>

        {error && <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#ef4444" }}>{error}</div>}
        {success && <div style={{ background: "#10b98122", border: "1px solid #10b981", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#10b981" }}>{success}</div>}

        {mode === "signup" && (
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Full Name</label>
            <input style={s.input} placeholder="Maria Santos" value={form.name} onChange={e => f("name", e.target.value)} />
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Email</label>
          <input style={s.input} placeholder="you@company.com" value={form.email} onChange={e => f("email", e.target.value)} />
        </div>

        {mode !== "forgot" && (
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => f("password", e.target.value)} onKeyDown={e => mode === "login" && e.key === "Enter" && handleLogin()} />
          </div>
        )}

        {mode === "signup" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Confirm Password</label>
              <input style={s.input} type="password" placeholder="••••••••" value={form.confirm} onChange={e => f("confirm", e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Department</label>
              <select style={s.input} value={form.department} onChange={e => f("department", e.target.value)}>
                {["Sales", "Support", "Operations", "Management"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </>
        )}

        <button style={{ ...s.btn("primary"), width: "100%", padding: "12px", fontSize: 14, marginBottom: 14, background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
          onClick={mode === "login" ? handleLogin : mode === "signup" ? handleSignup : handleForgot}>
          {mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Info"}
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          {mode === "login" && <>
            <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>Create account</span>
            <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}>Forgot password?</span>
          </>}
          {mode !== "login" && <span style={{ color: "#3b82f6", cursor: "pointer" }} onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>← Back to sign in</span>}
        </div>
      </div>
    </div>
  );
}

// ── User Management (Admin) ────────────────────────────────
function UserManagement({ users, setUsers, currentUser }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "agent", department: "Sales", target: 40 });
  const [msg, setMsg] = useState("");
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = (updated) => { setUsers(updated); storage.set("crm_users", updated); };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.password) return setMsg("Please fill all fields.");
    if (users.find(u => u.email.toLowerCase() === form.email.toLowerCase())) return setMsg("Email already exists.");
    const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    save([...users, { id: Date.now(), ...form, avatar: initials, status: "active", joined: today }]);
    setAddOpen(false); setForm({ name: "", email: "", password: "", role: "agent", department: "Sales", target: 40 }); setMsg("");
  };

  const handleEdit = () => {
    if (!editUser.name || !editUser.email) return;
    const initials = editUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    save(users.map(u => u.id === editUser.id ? { ...editUser, avatar: initials } : u));
    setEditUser(null);
  };

  const handleToggle = (id) => save(users.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
  const handleDelete = (id) => { if (id === currentUser.id) return; save(users.filter(u => u.id !== id)); };
  const handleResetPassword = () => {
    if (!newPassword || newPassword.length < 6) return;
    save(users.map(u => u.id === resetUser.id ? { ...u, password: newPassword } : u));
    setResetUser(null); setNewPassword("");
  };

  const agents = users.filter(u => u.role === "agent");
  const admins = users.filter(u => u.role === "admin");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: "#4b5a78" }}>{users.length} total users · {admins.length} admin · {agents.length} agents</div>
        <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={() => setAddOpen(true)}>+ Add User</button>
      </div>

      {["admin", "agent"].map(role => (
        <div key={role} style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#4b5a78", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{role === "admin" ? "👑 Admins" : "👤 Agents"}</div>
          <div style={s.card}>
            <table style={s.table}>
              <thead><tr>{["User", "Email", "Department", "Status", "Joined", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>
                {users.filter(u => u.role === role).map(user => (
                  <tr key={user.id}>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={s.avatar(34)}>{user.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#fff" }}>{user.name} {user.id === currentUser.id && <span style={{ fontSize: 10, color: "#f59e0b" }}>(you)</span>}</div>
                          <div style={{ fontSize: 11, color: "#4b5a78" }}>{user.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{user.email}</td>
                    <td style={s.td}>{user.department}</td>
                    <td style={s.td}><span style={s.badge(user.status === "active" ? "#10b981" : "#ef4444")}>{user.status}</span></td>
                    <td style={s.td}>{user.joined}</td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={{ ...s.btn("secondary"), padding: "5px 10px", fontSize: 11 }} onClick={() => setEditUser({ ...user })}>Edit</button>
                        <button style={{ ...s.btn("secondary"), padding: "5px 10px", fontSize: 11 }} onClick={() => { setResetUser(user); setNewPassword(""); }}>🔑 Password</button>
                        {user.id !== currentUser.id && <button style={{ ...s.btn(user.status === "active" ? "danger" : "success"), padding: "5px 10px", fontSize: 11 }} onClick={() => handleToggle(user.id)}>{user.status === "active" ? "Deactivate" : "Activate"}</button>}
                        {user.id !== currentUser.id && <button style={{ ...s.btn("danger"), padding: "5px 10px", fontSize: 11 }} onClick={() => handleDelete(user.id)}>Delete</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Add User Modal */}
      {addOpen && (
        <div style={s.modal} onClick={() => setAddOpen(false)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 20 }}>➕ Add New User</div>
            {msg && <div style={{ background: "#ef444422", border: "1px solid #ef4444", borderRadius: 8, padding: "10px", marginBottom: 14, fontSize: 12, color: "#ef4444" }}>{msg}</div>}
            {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Password", "password", "password"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type={type} value={form[key]} onChange={e => f(key, e.target.value)} /></div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={form.role} onChange={e => f("role", e.target.value)}>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Department</label>
              <select style={s.input} value={form.department} onChange={e => f("department", e.target.value)}>
                {["Sales", "Support", "Operations", "Management"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Monthly Deal Target</label>
              <input style={s.input} type="number" value={form.target} onChange={e => f("target", parseInt(e.target.value) || 0)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn("secondary")} onClick={() => { setAddOpen(false); setMsg(""); }}>Cancel</button>
              <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={handleAdd}>Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div style={s.modal} onClick={() => setEditUser(null)}>
          <div style={s.modalBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 20 }}>✏️ Edit User</div>
            {[["Full Name", "name", "text"], ["Email", "email", "email"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type={type} value={editUser[key]} onChange={e => setEditUser(p => ({ ...p, [key]: e.target.value }))} /></div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Role</label>
              <select style={s.input} value={editUser.role} onChange={e => setEditUser(p => ({ ...p, role: e.target.value }))}>
                <option value="agent">Agent</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Department</label>
              <select style={s.input} value={editUser.department} onChange={e => setEditUser(p => ({ ...p, department: e.target.value }))}>
                {["Sales", "Support", "Operations", "Management"].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>Monthly Deal Target</label>
              <input style={s.input} type="number" value={editUser.target} onChange={e => setEditUser(p => ({ ...p, target: parseInt(e.target.value) || 0 }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn("secondary")} onClick={() => setEditUser(null)}>Cancel</button>
              <button style={s.btn("primary")} onClick={handleEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetUser && (
        <div style={s.modal} onClick={() => setResetUser(null)}>
          <div style={{ ...s.modalBox, width: 380 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 6 }}>🔑 Reset Password</div>
            <div style={{ fontSize: 13, color: "#4b5a78", marginBottom: 20 }}>Setting new password for <strong style={{ color: "#fff" }}>{resetUser.name}</strong></div>
            <div style={{ marginBottom: 20 }}>
              <label style={s.label}>New Password</label>
              <input style={s.input} type="password" placeholder="Min 6 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn("secondary")} onClick={() => setResetUser(null)}>Cancel</button>
              <button style={s.btn("primary")} onClick={handleResetPassword}>Update Password</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Profile / Settings ─────────────────────────────────────
function ProfileSettings({ currentUser, users, setUsers, onLogout }) {
  const [form, setForm] = useState({ name: currentUser.name, email: currentUser.email, department: currentUser.department });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [msg, setMsg] = useState({ profile: "", pw: "" });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const saveProfile = () => {
    const initials = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const updated = users.map(u => u.id === currentUser.id ? { ...u, ...form, avatar: initials } : u);
    setUsers(updated); storage.set("crm_users", updated);
    setMsg(p => ({ ...p, profile: "✅ Profile updated!" }));
    setTimeout(() => setMsg(p => ({ ...p, profile: "" })), 3000);
  };

  const savePassword = () => {
    const user = users.find(u => u.id === currentUser.id);
    if (pwForm.current !== user.password) return setMsg(p => ({ ...p, pw: "Current password is incorrect." }));
    if (pwForm.newPw.length < 6) return setMsg(p => ({ ...p, pw: "New password must be at least 6 characters." }));
    if (pwForm.newPw !== pwForm.confirm) return setMsg(p => ({ ...p, pw: "Passwords do not match." }));
    const updated = users.map(u => u.id === currentUser.id ? { ...u, password: pwForm.newPw } : u);
    setUsers(updated); storage.set("crm_users", updated);
    setPwForm({ current: "", newPw: "", confirm: "" });
    setMsg(p => ({ ...p, pw: "✅ Password changed successfully!" }));
    setTimeout(() => setMsg(p => ({ ...p, pw: "" })), 3000);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ ...s.card, display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
        <div style={s.avatar(64)}>{currentUser.avatar}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{currentUser.name}</div>
          <div style={{ fontSize: 13, color: "#4b5a78" }}>{currentUser.email}</div>
          <span style={s.badge(currentUser.role === "admin" ? "#f59e0b" : "#3b82f6")}>{currentUser.role === "admin" ? "👑 Admin" : "👤 Agent"}</span>
        </div>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Edit Profile</div>
        {msg.profile && <div style={{ background: "#10b98122", border: "1px solid #10b981", borderRadius: 8, padding: "10px", marginBottom: 14, fontSize: 12, color: "#10b981" }}>{msg.profile}</div>}
        {[["Full Name", "name", "text"], ["Email", "email", "email"]].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type={type} value={form[key]} onChange={e => f(key, e.target.value)} /></div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Department</label>
          <select style={s.input} value={form.department} onChange={e => f("department", e.target.value)}>
            {["Sales", "Support", "Operations", "Management"].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button style={s.btn("primary")} onClick={saveProfile}>Save Profile</button>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 18 }}>Change Password</div>
        {msg.pw && <div style={{ background: msg.pw.startsWith("✅") ? "#10b98122" : "#ef444422", border: `1px solid ${msg.pw.startsWith("✅") ? "#10b981" : "#ef4444"}`, borderRadius: 8, padding: "10px", marginBottom: 14, fontSize: 12, color: msg.pw.startsWith("✅") ? "#10b981" : "#ef4444" }}>{msg.pw}</div>}
        {[["Current Password", "current"], ["New Password", "newPw"], ["Confirm New Password", "confirm"]].map(([label, key]) => (
          <div key={key} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type="password" placeholder="••••••••" value={pwForm[key]} onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))} /></div>
        ))}
        <button style={s.btn("primary")} onClick={savePassword}>Update Password</button>
      </div>

      <div style={s.card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Account</div>
        <div style={{ fontSize: 13, color: "#4b5a78", marginBottom: 16 }}>Signed in as {currentUser.email}</div>
        <button style={s.btn("danger")} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

// ── Agent Overview ─────────────────────────────────────────
function AgentOverview({ agents, performance, attendance, leads }) {
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("revenue");
  const [selected, setSelected] = useState(null);
  const depts = ["All", ...Array.from(new Set(agents.map(a => a.department)))];
  const filtered = [...agents].filter(a => filterDept === "All" || a.department === filterDept).sort((a, b) => {
    if (sortBy === "revenue") return (performance[b.id]?.revenue || 0) - (performance[a.id]?.revenue || 0);
    if (sortBy === "deals") return (performance[b.id]?.deals || 0) - (performance[a.id]?.deals || 0);
    const ra = (attendance[a.id] || []).filter(r => r.status === "Present" || r.status === "Late").length;
    const rb = (attendance[b.id] || []).filter(r => r.status === "Present" || r.status === "Late").length;
    return rb - ra;
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {depts.map(d => <button key={d} onClick={() => setFilterDept(d)} style={{ padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filterDept === d ? "#3b82f6" : "#1e2535", color: filterDept === d ? "#fff" : "#8899b4" }}>{d}</button>)}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {[["revenue", "Revenue"], ["deals", "Deals"], ["attendance", "Attendance"]].map(([v, l]) => <button key={v} onClick={() => setSortBy(v)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: sortBy === v ? "#8b5cf6" : "#1e2535", color: sortBy === v ? "#fff" : "#8899b4" }}>{l}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {filtered.map((agent, rank) => {
          const perf = performance[agent.id] || {};
          const attRecs = attendance[agent.id] || [];
          const present = attRecs.filter(r => r.status === "Present" || r.status === "Late").length;
          const late = attRecs.filter(r => r.status === "Late").length;
          const absent = attRecs.filter(r => r.status === "Absent").length;
          const attRate = attRecs.length ? Math.round((present / attRecs.length) * 100) : 0;
          const att = Math.round(((perf.deals || 0) / (agent.target || 40)) * 100);
          const agentLeads = leads.filter(l => l.assignedTo === agent.id);
          const todayAtt = attRecs.find(r => r.date === today);
          return (
            <div key={agent.id} onClick={() => setSelected(agent)} style={{ background: "#161b27", borderRadius: 16, border: "1px solid #1e2535", padding: 22, cursor: "pointer" }}>
              {rank < 3 && sortBy === "revenue" && <div style={{ textAlign: "right", fontSize: 18 }}>{["🥇", "🥈", "🥉"][rank]}</div>}
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                <div style={s.avatar(50)}>{agent.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>{agent.name}</div>
                  <div style={{ fontSize: 12, color: "#4b5a78" }}>{agent.department}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={s.badge("#10b981")}>Active</span>
                    {todayAtt && <span style={s.badge(attColors[todayAtt.status] || "#4b5a78")}>{todayAtt.status}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[{ l: "Revenue", v: `₱${(perf.revenue || 0).toLocaleString()}`, c: "#10b981" }, { l: "Deals", v: perf.deals || 0, c: "#60a5fa" }, { l: "Calls", v: perf.calls || 0, c: "#a78bfa" }].map(m => (
                  <div key={m.l} style={{ background: "#0f1117", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: m.c }}>{m.v}</div>
                    <div style={{ fontSize: 10, color: "#4b5a78" }}>{m.l}</div>
                  </div>
                ))}
              </div>
              {[{ label: "TARGET", val: att, color: att >= 100 ? "#10b981" : att >= 70 ? "#f59e0b" : "#ef4444" }, { label: "ATTENDANCE", val: attRate, color: attRate >= 90 ? "#10b981" : attRate >= 70 ? "#f59e0b" : "#ef4444" }].map(bar => (
                <div key={bar.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: "#4b5a78", fontWeight: 600 }}>{bar.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 800, color: bar.color }}>{bar.val}%</span>
                  </div>
                  <div style={{ height: 6, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(bar.val, 100)}%`, background: bar.color, borderRadius: 99 }} /></div>
                </div>
              ))}
              <div style={{ background: "#0f1117", borderRadius: 10, padding: "10px" }}>
                <div style={{ fontSize: 10, color: "#4b5a78", marginBottom: 6 }}>PIPELINE</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {["New", "Follow-up", "Negotiation", "Closed Won"].map(st => { const c = agentLeads.filter(l => l.status === st).length; return c > 0 ? <span key={st} style={s.badge(statusColors[st])}>{st} {c}</span> : null; })}
                  {agentLeads.length === 0 && <span style={{ fontSize: 11, color: "#4b5a78" }}>No leads</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selected && (() => {
        const perf = performance[selected.id] || {};
        const attRecs = attendance[selected.id] || [];
        const present = attRecs.filter(r => r.status === "Present" || r.status === "Late").length;
        const att = Math.round(((perf.deals || 0) / (selected.target || 40)) * 100);
        const agentLeads = leads.filter(l => l.assignedTo === selected.id);
        return (
          <div style={{ position: "fixed", inset: 0, background: "#000b", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={() => setSelected(null)}>
            <div style={{ background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 32, width: 520, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", gap: 14, marginBottom: 24, alignItems: "center" }}>
                <div style={s.avatar(60)}>{selected.avatar}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{selected.name}</div><div style={{ fontSize: 13, color: "#4b5a78" }}>{selected.department} · {selected.email}</div></div>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", color: "#4b5a78", fontSize: 20, cursor: "pointer" }}>✕</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[{ l: "Revenue", v: `₱${(perf.revenue || 0).toLocaleString()}`, c: "#10b981" }, { l: "Deals", v: perf.deals || 0, c: "#60a5fa" }, { l: "Calls", v: perf.calls || 0, c: "#a78bfa" }, { l: "Tasks", v: perf.tasks || 0, c: "#f59e0b" }].map(m => (
                  <div key={m.l} style={{ background: "#0f1117", borderRadius: 10, padding: "12px", textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 800, color: m.c }}>{m.v}</div><div style={{ fontSize: 10, color: "#4b5a78", marginTop: 3 }}>{m.l}</div></div>
                ))}
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>Target Attainment</span><span style={{ fontSize: 14, fontWeight: 800, color: att >= 100 ? "#10b981" : "#f59e0b" }}>{att}%</span></div>
                <div style={{ height: 8, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(att, 100)}%`, background: att >= 100 ? "#10b981" : att >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} /></div>
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px", marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Attendance Log</div>
                {attRecs.map((r, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1e2535" }}><span style={{ fontSize: 12, color: "#8899b4" }}>{r.date}</span><span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span><span style={{ fontSize: 11, color: "#4b5a78" }}>{r.in ? `${r.in}–${r.out || "ongoing"}` : "—"}</span></div>)}
                <div style={{ marginTop: 8, fontSize: 12, color: "#4b5a78" }}>Rate: <span style={{ color: "#fff", fontWeight: 700 }}>{attRecs.length ? Math.round((present / attRecs.length) * 100) : 0}%</span></div>
              </div>
              <div style={{ background: "#0f1117", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Leads ({agentLeads.length})</div>
                {agentLeads.length === 0 && <div style={{ fontSize: 12, color: "#4b5a78" }}>No leads.</div>}
                {agentLeads.map(lead => <div key={lead.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1e2535" }}><span style={{ fontSize: 13, color: "#c8d4e8", fontWeight: 600 }}>{lead.name}</span><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span><span style={{ fontSize: 12, color: "#10b981", fontWeight: 700 }}>₱{lead.value.toLocaleString()}</span></div>)}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ── Freedom Board ──────────────────────────────────────────
function FreedomBoard({ boardPosts, setBoardPosts, currentUser, isAdmin }) {
  const [filterCat, setFilterCat] = useState("All");
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "Idea" });
  const [expandedPost, setExpandedPost] = useState(null);
  const [commentText, setCommentText] = useState({});
  const categories = ["All", "Idea", "Question", "Concern", "Shoutout", "General"];
  const filtered = boardPosts.filter(p => filterCat === "All" || p.category === filterCat).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.date) - new Date(a.date));

  const react = (postId, emoji) => setBoardPosts(prev => prev.map(p => { if (p.id !== postId) return p; const already = p.reactions[emoji]?.includes(currentUser.name); return { ...p, reactions: { ...p.reactions, [emoji]: already ? p.reactions[emoji].filter(n => n !== currentUser.name) : [...(p.reactions[emoji] || []), currentUser.name] } }; }));
  const comment = (postId) => { const text = commentText[postId]?.trim(); if (!text) return; setBoardPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, comments: [...p.comments, { author: currentUser.name, avatar: currentUser.avatar, text, date: today }] })); setCommentText(prev => ({ ...prev, [postId]: "" })); };
  const pin = (postId) => setBoardPosts(prev => prev.map(p => p.id !== postId ? p : { ...p, pinned: !p.pinned }));
  const del = (postId) => setBoardPosts(prev => prev.filter(p => p.id !== postId));
  const submit = () => { if (!newPost.title.trim() || !newPost.body.trim()) return; setBoardPosts(prev => [{ id: Date.now(), author: currentUser.name, avatar: currentUser.avatar, ...newPost, date: today, pinned: false, reactions: { "👍": [], "❤️": [], "🔥": [] }, comments: [] }, ...prev]); setNewPost({ title: "", body: "", category: "Idea" }); setNewPostOpen(false); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div><div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>📌 Freedom Board</div><div style={{ fontSize: 13, color: "#4b5a78", marginTop: 3 }}>Open space for the whole team</div></div>
        <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={() => setNewPostOpen(true)}>+ New Post</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {categories.map(cat => <button key={cat} onClick={() => setFilterCat(cat)} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filterCat === cat ? (catColors[cat] || "#3b82f6") : "#1e2535", color: filterCat === cat ? "#fff" : "#8899b4" }}>{cat !== "All" ? catIcons[cat] + " " : ""}{cat}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(post => {
          const isExp = expandedPost === post.id;
          const canDel = isAdmin || post.author === currentUser.name;
          return (
            <div key={post.id} style={{ background: "#161b27", borderRadius: 16, border: `1px solid ${post.pinned ? "#3b82f655" : "#1e2535"}`, overflow: "hidden" }}>
              {post.pinned && <div style={{ background: "#1e3a5f", padding: "6px 20px", display: "flex", gap: 6, alignItems: "center" }}><span>📌</span><span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa" }}>PINNED</span></div>}
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
                  <div style={{ display: "flex", gap: 4 }}>
                    {isAdmin && <button onClick={() => pin(post.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: post.pinned ? "#60a5fa" : "#4b5a78", padding: 4 }}>📌</button>}
                    {canDel && <button onClick={() => del(post.id)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 14, color: "#4b5a78", padding: 4 }}>🗑️</button>}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "#c8d4e8", lineHeight: 1.7, background: "#0f1117", borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>{post.body}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  {["👍", "❤️", "🔥"].map(emoji => { const count = post.reactions[emoji]?.length || 0; const reacted = post.reactions[emoji]?.includes(currentUser.name); return <button key={emoji} onClick={() => react(post.id, emoji)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 20, border: `1px solid ${reacted ? "#3b82f6" : "#1e2535"}`, background: reacted ? "#1e3a5f" : "#0f1117", cursor: "pointer", fontSize: 13, color: reacted ? "#60a5fa" : "#8899b4" }}>{emoji}{count > 0 && <span style={{ fontSize: 12, fontWeight: 600 }}>{count}</span>}</button>; })}
                  <button onClick={() => setExpandedPost(isExp ? null : post.id)} style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", fontSize: 12, color: "#4b5a78" }}>💬 {post.comments.length} {isExp ? "▲" : "▼"}</button>
                </div>
                {isExp && (
                  <div style={{ marginTop: 16, borderTop: "1px solid #1e2535", paddingTop: 16 }}>
                    {post.comments.map((c, i) => <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12 }}><div style={s.avatar(30)}>{c.avatar}</div><div style={{ flex: 1, background: "#0f1117", borderRadius: 10, padding: "9px 13px" }}><div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{c.author} <span style={{ fontSize: 10, color: "#4b5a78" }}>{c.date}</span></div><div style={{ fontSize: 13, color: "#c8d4e8" }}>{c.text}</div></div></div>)}
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <div style={s.avatar(30)}>{currentUser.avatar}</div>
                      <input style={{ ...s.input, flex: 1 }} placeholder="Write a comment…" value={commentText[post.id] || ""} onChange={e => setCommentText(p => ({ ...p, [post.id]: e.target.value }))} onKeyDown={e => e.key === "Enter" && comment(post.id)} />
                      <button style={{ ...s.btn("primary"), padding: "9px 14px" }} onClick={() => comment(post.id)}>Send</button>
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
          <div style={{ background: "#161b27", borderRadius: 20, border: "1px solid #1e2535", padding: 32, width: 500 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 20 }}>✍️ New Post</div>
            <div style={{ marginBottom: 14 }}>
              <label style={s.label}>Category</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["Idea", "Question", "Concern", "Shoutout", "General"].map(cat => <button key={cat} onClick={() => setNewPost(p => ({ ...p, category: cat }))} style={{ padding: "7px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: newPost.category === cat ? (catColors[cat] || "#3b82f6") : "#1e2535", color: newPost.category === cat ? "#fff" : "#8899b4" }}>{catIcons[cat]} {cat}</button>)}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}><label style={s.label}>Title</label><input style={s.input} placeholder="What's on your mind?" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} /></div>
            <div style={{ marginBottom: 20 }}><label style={s.label}>Message</label><textarea style={{ ...s.input, minHeight: 100, resize: "vertical" }} placeholder="Share with the team…" value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} /></div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={s.btn("secondary")} onClick={() => setNewPostOpen(false)}>Cancel</button>
              <button style={{ ...s.btn("primary"), background: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }} onClick={submit}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────
export default function CRM() {
  const [users, setUsers] = useState(() => storage.get("crm_users", initialUsers));
  const [leads, setLeads] = useState(() => storage.get("crm_leads", initialLeads));
  const [attendance, setAttendance] = useState(() => storage.get("crm_attendance", initialAttendance));
  const [performance] = useState(initialPerformance);
  const [boardPosts, setBoardPosts] = useState(() => storage.get("crm_board", initialBoardPosts));
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(null);
  const [leadModal, setLeadModal] = useState(null);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", contact: "", email: "", phone: "", status: "New", value: "", notes: "", assignedTo: "" });
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => { const t = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { storage.set("crm_leads", leads); }, [leads]);
  useEffect(() => { storage.set("crm_board", boardPosts); }, [boardPosts]);
  useEffect(() => { storage.set("crm_attendance", attendance); }, [attendance]);

  const handleLogin = (user) => { setCurrentUser(user); setActiveTab("dashboard"); };
  const handleLogout = () => { setCurrentUser(null); setClockedIn(false); setClockTime(null); };

  const handleClockIn = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    setClockedIn(true); setClockTime(now);
    setAttendance(prev => { const ex = prev[currentUser.id] || []; return { ...prev, [currentUser.id]: [...ex.filter(r => r.date !== today), { date: today, in: now, out: null, status: now > "08:15" ? "Late" : "Present" }] }; });
  };
  const handleClockOut = () => {
    const now = currentTime.toTimeString().slice(0, 5);
    setClockedIn(false);
    setAttendance(prev => ({ ...prev, [currentUser.id]: (prev[currentUser.id] || []).map(r => r.date === today ? { ...r, out: now } : r) }));
  };

  const getAiInsight = async () => {
    setAiLoading(true); setAiInsight("");
    const agents = users.filter(u => u.role === "agent");
    const totalRev = Object.values(performance).reduce((s, p) => s + p.revenue, 0);
    const totalDeals = Object.values(performance).reduce((s, p) => s + p.deals, 0);
    const top = agents.reduce((b, a) => (performance[a.id]?.revenue || 0) > (performance[b.id]?.revenue || 0) ? a : b, agents[0] || {});
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: `CRM analyst. Team: ₱${totalRev.toLocaleString()} revenue, ${totalDeals} deals, top: ${top?.name} (₱${performance[top?.id]?.revenue?.toLocaleString()}), ${leads.length} leads, ${leads.filter(l => l.status === "Closed Won").length} won. Give 3-4 sentence insight + 2 recommendations. Be direct.` }] }) });
      const data = await res.json();
      setAiInsight(data.content?.[0]?.text || "No insight available.");
    } catch { setAiInsight("Could not load AI insight."); }
    setAiLoading(false);
  };

  if (!currentUser) return <AuthPage users={users} setUsers={setUsers} onLogin={handleLogin} />;

  const isAdmin = currentUser.role === "admin";
  const agents = users.filter(u => u.role === "agent");
  const myLeads = leads.filter(l => l.assignedTo === currentUser.id);
  const myAtt = attendance[currentUser.id] || [];
  const myPerf = performance[currentUser.id] || {};
  const totalRev = Object.values(performance).reduce((s, p) => s + p.revenue, 0);
  const totalDeals = Object.values(performance).reduce((s, p) => s + p.deals, 0);

  const adminTabs = ["dashboard", "overview", "leads", "agents", "attendance", "performance", "automations", "board", "users", "settings"];
  const agentTabs = ["dashboard", "my-leads", "my-attendance", "my-performance", "board", "settings"];
  const tabs = isAdmin ? adminTabs : agentTabs;
  const tabLabels = { dashboard: "Dashboard", overview: "Agent Overview", leads: "Leads", agents: "Team", attendance: "Attendance", performance: "Performance", automations: "Automations", board: "Freedom Board", users: "User Management", settings: "My Profile", "my-leads": "My Leads", "my-attendance": "My Attendance", "my-performance": "My Performance" };
  const tabIcons = { dashboard: "📊", overview: "🪪", leads: "🎯", agents: "👥", attendance: "🕐", performance: "📈", automations: "⚙️", board: "📌", users: "👤", settings: "⚙️", "my-leads": "🎯", "my-attendance": "🕐", "my-performance": "📈" };

  const notifications = [
    { id: 1, text: "New lead assigned to you", type: "info", time: "09:00" },
    { id: 2, text: "BrightTech follow-up due today", type: "warning", time: "10:00" },
    { id: 3, text: "Nova Solutions deal closed!", type: "success", time: "11:30" },
  ];

  const renderContent = () => {
    if (activeTab === "board") return <FreedomBoard boardPosts={boardPosts} setBoardPosts={setBoardPosts} currentUser={currentUser} isAdmin={isAdmin} />;
    if (activeTab === "overview") return <AgentOverview agents={agents} performance={performance} attendance={attendance} leads={leads} />;
    if (activeTab === "users") return <UserManagement users={users} setUsers={setUsers} currentUser={currentUser} />;
    if (activeTab === "settings") return <ProfileSettings currentUser={currentUser} users={users} setUsers={setUsers} onLogout={handleLogout} />;

    if (isAdmin) {
      if (activeTab === "dashboard") return (
        <div>
          <div style={s.grid4}>
            {[{ l: "Total Revenue", v: `₱${totalRev.toLocaleString()}`, ch: "+12% this month", pos: true, i: "💰" }, { l: "Deals Closed", v: totalDeals, ch: "+3 this week", pos: true, i: "🤝" }, { l: "Active Leads", v: leads.filter(l => l.status !== "Closed Lost").length, ch: `${leads.filter(l => l.status === "New").length} new`, pos: true, i: "🎯" }, { l: "Team Size", v: users.length, ch: `${agents.length} agents`, pos: true, i: "👥" }].map((stat, i) => (
              <div key={i} style={s.statCard}><div style={{ fontSize: 22, marginBottom: 8 }}>{stat.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{stat.v}</div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 4 }}>{stat.l}</div><div style={{ fontSize: 12, color: stat.pos ? "#10b981" : "#ef4444", marginTop: 2 }}>{stat.ch}</div></div>
            ))}
          </div>
          <div style={s.grid2}>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Lead Pipeline</div>
              {["New", "Follow-up", "Negotiation", "Closed Won"].map(status => { const count = leads.filter(l => l.status === status).length; const pct = leads.length ? Math.round((count / leads.length) * 100) : 0; return <div key={status} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 12, color: "#8899b4" }}>{status}</span><span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{count}</span></div><div style={{ height: 6, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${pct}%`, background: statusColors[status], borderRadius: 99 }} /></div></div>; })}
            </div>
            <div style={s.card}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Top Performers</div>
              {[...agents].sort((a, b) => (performance[b.id]?.revenue || 0) - (performance[a.id]?.revenue || 0)).map((agent, i) => (
                <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, color: "#4b5a78", width: 16 }}>#{i + 1}</div>
                  <div style={s.avatar(32)}>{agent.avatar}</div>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{agent.name}</div><div style={{ fontSize: 11, color: "#4b5a78" }}>₱{(performance[agent.id]?.revenue || 0).toLocaleString()}</div></div>
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
        </div>
      );
      if (activeTab === "leads") return (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: "#4b5a78" }}>{leads.length} leads</div>
            <button style={s.btn("primary")} onClick={() => setAddLeadOpen(true)}>+ Add Lead</button>
          </div>
          <div style={s.card}>
            <table style={s.table}>
              <thead><tr>{["Company", "Contact", "Status", "Assigned To", "Value", "Date", ""].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{leads.map(lead => { const agent = users.find(u => u.id === lead.assignedTo); return (
                <tr key={lead.id} style={{ cursor: "pointer" }} onClick={() => setLeadModal(lead)}>
                  <td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td>
                  <td style={s.td}>{lead.contact}</td>
                  <td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td>
                  <td style={s.td}>{agent?.name || "Unassigned"}</td>
                  <td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td>
                  <td style={s.td}>{lead.date}</td>
                  <td style={s.td} onClick={e => { e.stopPropagation(); setLeads(p => p.filter(l => l.id !== lead.id)); }}><span style={{ color: "#ef4444", fontSize: 12, cursor: "pointer" }}>Remove</span></td>
                </tr>
              ); })}</tbody>
            </table>
          </div>
        </div>
      );
      if (activeTab === "agents") return (
        <div style={s.grid2}>
          {agents.map(agent => { const perf = performance[agent.id] || {}; const attRecs = attendance[agent.id] || []; const present = attRecs.filter(r => r.status === "Present" || r.status === "Late").length; return (
            <div key={agent.id} style={s.card}>
              <div style={{ display: "flex", gap: 14, marginBottom: 16 }}><div style={s.avatar(46)}>{agent.avatar}</div><div><div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{agent.name}</div><div style={{ fontSize: 12, color: "#4b5a78" }}>{agent.department} · {agent.email}</div><span style={s.badge("#10b981")}>Active</span></div></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[{ l: "Deals", v: perf.deals || 0 }, { l: "Revenue", v: `₱${(perf.revenue || 0).toLocaleString()}` }, { l: "Calls", v: perf.calls || 0 }, { l: "Attendance", v: `${present}/${attRecs.length}d` }].map(m => (
                  <div key={m.l} style={{ background: "#0f1117", borderRadius: 8, padding: "10px 14px" }}><div style={{ fontSize: 11, color: "#4b5a78" }}>{m.l}</div><div style={{ fontSize: 16, fontWeight: 700, color: "#fff", marginTop: 2 }}>{m.v}</div></div>
                ))}
              </div>
            </div>
          ); })}
        </div>
      );
      if (activeTab === "attendance") return (
        <div style={s.card}>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Agent</th>{["May 12", "May 13", "May 14", "May 15"].map(d => <th key={d} style={s.th}>{d}</th>)}<th style={s.th}>Rate</th></tr></thead>
            <tbody>{agents.map(agent => { const recs = attendance[agent.id] || []; const present = recs.filter(r => r.status === "Present" || r.status === "Late").length; return (
              <tr key={agent.id}>
                <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={s.avatar(28)}>{agent.avatar}</div><span style={{ fontWeight: 600, color: "#fff" }}>{agent.name}</span></div></td>
                {recs.map((r, i) => <td key={i} style={s.td}><span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span>{r.in && <div style={{ fontSize: 10, color: "#4b5a78", marginTop: 2 }}>{r.in}–{r.out || "—"}</div>}</td>)}
                <td style={s.td}><span style={{ fontWeight: 700, color: present >= 3 ? "#10b981" : "#f59e0b" }}>{recs.length ? Math.round((present / recs.length) * 100) : 0}%</span></td>
              </tr>
            ); })}</tbody>
          </table>
        </div>
      );
      if (activeTab === "performance") return (
        <div style={s.card}>
          <table style={s.table}>
            <thead><tr>{["Agent", "Calls", "Deals", "Revenue", "Tasks", "Target", "Attainment"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{agents.map(agent => { const perf = performance[agent.id] || {}; const att = Math.round(((perf.deals || 0) / (agent.target || 40)) * 100); return (
              <tr key={agent.id}>
                <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={s.avatar(30)}>{agent.avatar}</div><div><div style={{ fontWeight: 600, color: "#fff" }}>{agent.name}</div><div style={{ fontSize: 11, color: "#4b5a78" }}>{agent.department}</div></div></div></td>
                <td style={s.td}>{perf.calls || 0}</td><td style={s.td}>{perf.deals || 0}</td>
                <td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{(perf.revenue || 0).toLocaleString()}</span></td>
                <td style={s.td}>{perf.tasks || 0}</td><td style={s.td}>{agent.target}</td>
                <td style={s.td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ flex: 1, height: 6, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(att, 100)}%`, background: att >= 100 ? "#10b981" : att >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} /></div><span style={{ fontSize: 12, fontWeight: 700, color: att >= 100 ? "#10b981" : "#f59e0b" }}>{att}%</span></div></td>
              </tr>
            ); })}</tbody>
          </table>
        </div>
      );
      if (activeTab === "automations") return (
        <div>{[{ icon: "📧", name: "Follow-up Reminder", desc: "Auto-remind agents when a lead hasn't been contacted in 3 days", status: "Active" }, { icon: "⚠️", name: "Late Attendance Alert", desc: "Notify admin when an agent clocks in after 08:15", status: "Active" }, { icon: "🏆", name: "Deal Won Celebration", desc: "Post to team channel when a deal is closed", status: "Active" }, { icon: "📊", name: "Weekly Performance Report", desc: "Send performance summary every Monday 8AM", status: "Active" }, { icon: "🔁", name: "Lead Reassignment", desc: "Auto-reassign leads if agent is absent 2+ days", status: "Inactive" }].map((r, i) => (
          <div key={i} style={{ ...s.card, display: "flex", alignItems: "center", gap: 16 }}><div style={{ fontSize: 28 }}>{r.icon}</div><div style={{ flex: 1 }}><div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{r.name}</div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 3 }}>{r.desc}</div></div><span style={s.badge(r.status === "Active" ? "#10b981" : "#4b5a78")}>{r.status}</span></div>
        ))}</div>
      );
    } else {
      if (activeTab === "dashboard") return (
        <div>
          <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
            <div style={s.avatar(56)}>{currentUser.avatar}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Welcome, {currentUser.name.split(" ")[0]}!</div><div style={{ fontSize: 13, color: "#4b5a78" }}>{currentTime.toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div><div style={{ fontSize: 20, fontWeight: 700, color: "#60a5fa", marginTop: 4 }}>{currentTime.toLocaleTimeString()}</div></div>
            <div>{!clockedIn ? <button style={{ ...s.btn("success"), background: "#10b981" }} onClick={handleClockIn}>🟢 Clock In</button> : <button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
          </div>
          {clockedIn && <div style={{ ...s.card, background: "#0d2a1a", borderColor: "#10b981", marginBottom: 20 }}><div style={{ fontSize: 13, color: "#10b981" }}>✅ Clocked in at <strong>{clockTime}</strong>. Have a great day!</div></div>}
          <div style={s.grid4}>
            {[{ l: "My Deals", v: myPerf.deals || 0, i: "🤝" }, { l: "Revenue", v: `₱${(myPerf.revenue || 0).toLocaleString()}`, i: "💰" }, { l: "Calls", v: myPerf.calls || 0, i: "📞" }, { l: "My Leads", v: myLeads.length, i: "🎯" }].map((stat, i) => <div key={i} style={s.statCard}><div style={{ fontSize: 22, marginBottom: 6 }}>{stat.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{stat.v}</div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 4 }}>{stat.l}</div></div>)}
          </div>
          <div style={s.card}><div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 14 }}>My Leads</div>
            <table style={s.table}><thead><tr>{["Company", "Status", "Value", "Notes"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{myLeads.map(lead => <tr key={lead.id}><td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td><td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td><td style={s.td}>{lead.notes}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      );
      if (activeTab === "my-leads") return <div style={s.card}><table style={s.table}><thead><tr>{["Company", "Contact", "Status", "Value", "Notes"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead><tbody>{myLeads.map(lead => <tr key={lead.id}><td style={s.td}><span style={{ fontWeight: 600, color: "#fff" }}>{lead.name}</span></td><td style={s.td}>{lead.contact}</td><td style={s.td}><span style={s.badge(statusColors[lead.status] || "#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{ color: "#10b981", fontWeight: 600 }}>₱{lead.value.toLocaleString()}</span></td><td style={s.td}>{lead.notes}</td></tr>)}</tbody></table></div>;
      if (activeTab === "my-attendance") return (
        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>My Attendance</div>
            <div>{!clockedIn ? <button style={{ ...s.btn("success"), background: "#10b981" }} onClick={handleClockIn}>🟢 Clock In</button> : <button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
          </div>
          <table style={s.table}><thead><tr>{["Date", "Status", "In", "Out", "Hours"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{[...myAtt].reverse().map((r, i) => { const hrs = r.in && r.out ? ((parseInt(r.out.split(":")[0]) * 60 + parseInt(r.out.split(":")[1])) - (parseInt(r.in.split(":")[0]) * 60 + parseInt(r.in.split(":")[1]))) / 60 : 0; return <tr key={i}><td style={s.td}>{r.date}</td><td style={s.td}><span style={s.badge(attColors[r.status] || "#4b5a78")}>{r.status}</span></td><td style={s.td}>{r.in || "—"}</td><td style={s.td}>{r.out || "—"}</td><td style={s.td}>{hrs > 0 ? `${hrs.toFixed(1)}h` : "—"}</td></tr>; })}</tbody>
          </table>
        </div>
      );
      if (activeTab === "my-performance") {
        const att = Math.round(((myPerf.deals || 0) / (currentUser.target || 40)) * 100);
        return <div><div style={s.grid4}>{[{ l: "Deals", v: myPerf.deals || 0, i: "🤝" }, { l: "Revenue", v: `₱${(myPerf.revenue || 0).toLocaleString()}`, i: "💰" }, { l: "Calls", v: myPerf.calls || 0, i: "📞" }, { l: "Tasks", v: myPerf.tasks || 0, i: "✅" }].map((stat, i) => <div key={i} style={s.statCard}><div style={{ fontSize: 22, marginBottom: 6 }}>{stat.i}</div><div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{stat.v}</div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 4 }}>{stat.l}</div></div>)}</div>
          <div style={s.card}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Target Attainment</span><span style={{ fontSize: 20, fontWeight: 800, color: att >= 100 ? "#10b981" : "#f59e0b" }}>{att}%</span></div><div style={{ height: 12, background: "#1e2535", borderRadius: 99 }}><div style={{ height: "100%", width: `${Math.min(att, 100)}%`, background: att >= 100 ? "#10b981" : att >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99 }} /></div><div style={{ fontSize: 12, color: "#4b5a78", marginTop: 6 }}>{myPerf.deals} of {currentUser.target} deals</div></div></div>;
      }
    }
    return null;
  };

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={s.sidebar}>
        <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #1e2535" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>⚡ TeamCRM</div>
          <div style={{ fontSize: 11, color: "#4b5a78", marginTop: 2 }}>{isAdmin ? "Admin Panel" : "Agent Portal"}</div>
        </div>
        <div style={s.nav}>
          {tabs.map(tab => <div key={tab} style={s.navItem(activeTab === tab)} onClick={() => setActiveTab(tab)}><span style={{ fontSize: 15, width: 20, textAlign: "center" }}>{tabIcons[tab]}</span>{tabLabels[tab]}</div>)}
        </div>
        <div style={{ padding: "16px 12px", borderTop: "1px solid #1e2535" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={s.avatar(32)}>{currentUser.avatar}</div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#c8d4e8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: "#4b5a78" }}>{isAdmin ? "Administrator" : "Agent"}</div>
            </div>
            <button onClick={handleLogout} title="Sign out" style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 16, color: "#4b5a78" }}>🚪</button>
          </div>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{tabLabels[activeTab]}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 13, color: "#4b5a78" }}>{currentTime.toLocaleTimeString()}</div>
            <div style={{ position: "relative" }}>
              <button style={{ ...s.btn("ghost"), padding: "8px 12px" }} onClick={() => setShowNotif(!showNotif)}>🔔 <span style={{ background: "#ef4444", color: "#fff", borderRadius: 99, fontSize: 10, padding: "1px 5px" }}>{notifications.length}</span></button>
              {showNotif && <div style={{ position: "absolute", right: 0, top: 44, width: 280, background: "#161b27", border: "1px solid #1e2535", borderRadius: 12, padding: 12, zIndex: 50 }}>{notifications.map(n => <div key={n.id} style={{ padding: "8px 0", borderBottom: "1px solid #0f1117", fontSize: 12, color: "#c8d4e8" }}>{n.type === "warning" ? "⚠️" : n.type === "success" ? "✅" : "ℹ️"} {n.text}</div>)}</div>}
            </div>
          </div>
        </div>
        <div style={s.content}>{renderContent()}</div>
      </div>

      {leadModal && <div style={s.modal} onClick={() => setLeadModal(null)}><div style={s.modalBox} onClick={e => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}><div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>{leadModal.name}</div><button style={s.btn("ghost")} onClick={() => setLeadModal(null)}>✕</button></div>{[["Contact", leadModal.contact], ["Email", leadModal.email], ["Phone", leadModal.phone], ["Status", leadModal.status], ["Value", `₱${leadModal.value.toLocaleString()}`], ["Assigned To", users.find(u => u.id === leadModal.assignedTo)?.name || "Unassigned"], ["Date", leadModal.date], ["Notes", leadModal.notes]].map(([k, v]) => <div key={k} style={{ marginBottom: 12 }}><div style={s.label}>{k}</div><div style={{ fontSize: 13, color: "#c8d4e8" }}>{v}</div></div>)}</div></div>}

      {addLeadOpen && <div style={s.modal} onClick={() => setAddLeadOpen(false)}><div style={s.modalBox} onClick={e => e.stopPropagation()}><div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 20 }}>Add New Lead</div>{[["Company", "name", "text"], ["Contact Person", "contact", "text"], ["Email", "email", "email"], ["Phone", "phone", "text"], ["Value (₱)", "value", "number"], ["Notes", "notes", "text"]].map(([label, field, type]) => <div key={field} style={{ marginBottom: 14 }}><label style={s.label}>{label}</label><input style={s.input} type={type} value={newLead[field]} onChange={e => setNewLead(p => ({ ...p, [field]: e.target.value }))} /></div>)}<div style={{ marginBottom: 14 }}><label style={s.label}>Assign To</label><select style={s.input} value={newLead.assignedTo} onChange={e => setNewLead(p => ({ ...p, assignedTo: parseInt(e.target.value) }))}><option value="">Select agent…</option>{agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div><div style={{ display: "flex", gap: 10, marginTop: 20 }}><button style={s.btn("secondary")} onClick={() => setAddLeadOpen(false)}>Cancel</button><button style={s.btn("primary")} onClick={() => { setLeads(p => [...p, { ...newLead, id: Date.now(), status: "New", date: today, value: parseInt(newLead.value) || 0 }]); setAddLeadOpen(false); setNewLead({ name: "", contact: "", email: "", phone: "", status: "New", value: "", notes: "", assignedTo: "" }); }}>Add Lead</button></div></div></div>}
    </div>
  );
}
