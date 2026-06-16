import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://bhowczbpnijslzilvegr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJob3djemJwbmlqc2x6aWx2ZWdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNTU5MDcsImV4cCI6MjA5NDgzMTkwN30.JvuhrVHrbyWJP0Sdww-VRbwAT00ylVTcH8DKAASWnmk";
const H = {"Content-Type":"application/json","apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"return=representation"};
const db = {
  get: async(t,q="")=>{try{const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{headers:H});return r.json();}catch{return[];}},
  post: async(t,b)=>{try{const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:H,body:JSON.stringify(b)});return r.json();}catch{return null;}},
  patch: async(t,q,b)=>{try{const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{method:"PATCH",headers:H,body:JSON.stringify(b)});return r.json();}catch{return null;}},
  del: async(t,q)=>{try{await fetch(`${SUPABASE_URL}/rest/v1/${t}?${q}`,{method:"DELETE",headers:H});}catch{}},
  upsert: async(t,b,oc)=>{try{const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?on_conflict=${oc}`,{method:"POST",headers:{...H,"Prefer":"resolution=merge-duplicates,return=representation"},body:JSON.stringify(b)});return r.json();}catch{return null;}},
};

const today = new Date().toISOString().split("T")[0];
const statusColors = {"New":"#3b82f6","Follow-up":"#f59e0b","Negotiation":"#8b5cf6","Closed Won":"#10b981","Closed Lost":"#ef4444"};
const attColors = {"Present":"#10b981","Late":"#f59e0b","Absent":"#ef4444","Leave":"#8b5cf6"};
const catColors = {Idea:"#3b82f6",Question:"#f59e0b",Concern:"#ef4444",Shoutout:"#10b981",General:"#8b5cf6"};
const catIcons = {Idea:"💡",Question:"❓",Concern:"⚠️",Shoutout:"🏆",General:"💬"};
const presetAvatars = ["🧑‍💼","👩‍💼","🧑‍💻","👩‍💻","🦸","🦸‍♀️","🧑‍🚀","👨‍🏫","👩‍🏫","🐯","🦊","🐼","🦁","🐸","🎯","🚀","💼","🌟","🎓","⚡"];
const CAMP_COLORS = ["#3b82f6","#10b981","#8b5cf6","#f59e0b","#ef4444","#ec4899","#06b6d4","#84cc16"];

const s = {
  app:{fontFamily:"'DM Sans',sans-serif",background:"#0f1117",minHeight:"100vh",color:"#e2e8f0",display:"flex"},
  sidebar:{width:230,background:"#161b27",borderRight:"1px solid #1e2535",display:"flex",flexDirection:"column"},
  nav:{flex:1,padding:"12px 8px",overflowY:"auto"},
  navItem:(a,col)=>({display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,marginBottom:2,cursor:"pointer",fontSize:13,fontWeight:a?600:400,background:a?((col||"#3b82f6")+"22"):"transparent",color:a?(col||"#60a5fa"):"#8899b4"}),
  main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  topbar:{background:"#161b27",borderBottom:"1px solid #1e2535",padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"space-between"},
  content:{flex:1,padding:"28px",overflowY:"auto"},
  card:{background:"#161b27",borderRadius:14,border:"1px solid #1e2535",padding:"20px 24px",marginBottom:20},
  grid2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20},
  grid4:{display:"flex",gap:14,marginBottom:20,flexWrap:"wrap"},
  statCard:{background:"#161b27",borderRadius:14,border:"1px solid #1e2535",padding:"20px 22px",flex:1,minWidth:130},
  badge:(c)=>({display:"inline-block",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600,background:c+"22",color:c}),
  btn:(v="primary")=>({padding:"9px 18px",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:v==="primary"?"#3b82f6":v==="danger"?"#ef4444":v==="success"?"#10b981":v==="ghost"?"transparent":"#1e2535",color:v==="ghost"?"#8899b4":"#fff"}),
  input:{width:"100%",background:"#0f1117",border:"1px solid #1e2535",borderRadius:8,padding:"10px 14px",color:"#e2e8f0",fontSize:13,outline:"none",boxSizing:"border-box"},
  label:{fontSize:12,color:"#4b5a78",fontWeight:600,marginBottom:5,display:"block"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",padding:"12px 14px",fontSize:11,fontWeight:700,color:"#4b5a78",textTransform:"uppercase",borderBottom:"1px solid #1e2535"},
  td:{padding:"13px 14px",fontSize:13,borderBottom:"1px solid #0f1117",color:"#c8d4e8"},
  avatar:(sz=36)=>({width:sz,height:sz,borderRadius:"50%",background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*0.35,fontWeight:700,color:"#fff",flexShrink:0}),
  modal:{position:"fixed",inset:0,background:"#000a",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100},
  mbox:{background:"#161b27",borderRadius:16,border:"1px solid #1e2535",padding:28,width:460,maxHeight:"90vh",overflowY:"auto"},
};

function cc(campaigns,cid){const idx=campaigns.findIndex(c=>c.id===cid);return CAMP_COLORS[idx%CAMP_COLORS.length]||"#3b82f6";}
function ProfilePic({user,size=36}){if(!user)return<div style={s.avatar(size)}>?</div>;if(user.photo)return<img src={user.photo} alt="av" style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",flexShrink:0}}/>;if(user.preset)return<div style={{width:size,height:size,borderRadius:"50%",background:"#1e2535",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.45,flexShrink:0}}>{user.preset}</div>;return<div style={s.avatar(size)}>{user.avatar||"?"}</div>;}
function Spinner(){return<div style={{padding:60,textAlign:"center",color:"#4b5a78"}}>Loading...</div>;}
function ErrBox({msg}){return msg?<div style={{background:"#ef444422",border:"1px solid #ef4444",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#ef4444"}}>{msg}</div>:null;}
function OkBox({msg}){return msg?<div style={{background:"#10b98122",border:"1px solid #10b981",borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:13,color:"#10b981"}}>{msg}</div>:null;}

function AuthPage({onLogin,campaigns}){
  const[mode,setMode]=useState("login");
  const[email,setEmail]=useState("");const[password,setPassword]=useState("");
  const[selectedCampaign,setSelectedCampaign]=useState("");
  const[error,setError]=useState("");const[success,setSuccess]=useState("");const[loading,setLoading]=useState(false);
  const handleLogin=async()=>{
    setError("");setLoading(true);
    const data=await db.get("users",`email=eq.${encodeURIComponent(email)}&select=*`);
    setLoading(false);
    if(!data||data.length===0)return setError("No account found with that email.");
    const user=data[0];
    if(user.password!==password)return setError("Incorrect password.");
    if(user.status==="inactive")return setError("Account deactivated. Contact your admin.");
    if(user.role==="admin"){onLogin(user,null);return;}
    if(!selectedCampaign)return setError("Please select your campaign.");
    if(String(user.campaign_id)!==String(selectedCampaign))return setError("Incorrect campaign. Check with your admin.");
    const campaign=campaigns.find(c=>String(c.id)===String(selectedCampaign));
    onLogin(user,campaign);
  };
  const handleForgot=async()=>{
    setError("");setLoading(true);
    const data=await db.get("users",`email=eq.${encodeURIComponent(email)}&select=*`);
    setLoading(false);
    if(!data||data.length===0)return setError("No account found.");
    setSuccess(`Password hint: "${data[0].password}" — please change it after logging in.`);
  };
  return(
    <div style={{...s.app,alignItems:"center",justifyContent:"center",background:"radial-gradient(ellipse at 60% 40%,#1e2f50 0%,#0f1117 70%)"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{width:420,background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:40}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:32,marginBottom:8}}>⚡</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff"}}>TeamCRM</div>
          <div style={{fontSize:13,color:"#4b5a78",marginTop:4}}>{mode==="login"?"Sign in to your workspace":"Forgot your password?"}</div>
        </div>
        <ErrBox msg={error}/><OkBox msg={success}/>
        <div style={{marginBottom:14}}><label style={s.label}>Email</label><input style={s.input} placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>mode==="login"&&e.key==="Enter"&&handleLogin()}/></div>
        {mode==="login"&&<>
          <div style={{marginBottom:14}}><label style={s.label}>Password</label><input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()}/></div>
          <div style={{marginBottom:24}}>
            <label style={s.label}>Campaign <span style={{color:"#4b5a78",fontWeight:400,fontSize:11}}>(agents only — admins skip)</span></label>
            <select style={s.input} value={selectedCampaign} onChange={e=>setSelectedCampaign(e.target.value)}>
              <option value="">— Select your campaign —</option>
              {campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </>}
        {mode==="forgot"&&<div style={{marginBottom:24}}/>}
        <button style={{...s.btn("primary"),width:"100%",padding:"12px",fontSize:14,marginBottom:16,background:"linear-gradient(135deg,#3b82f6,#8b5cf6)",opacity:loading?0.7:1}} onClick={mode==="login"?handleLogin:handleForgot} disabled={loading}>
          {loading?"Please wait...":mode==="login"?"Sign In":"Get Hint"}
        </button>
        <div style={{textAlign:"center",fontSize:12}}>
          {mode==="login"?<span style={{color:"#3b82f6",cursor:"pointer"}} onClick={()=>{setMode("forgot");setError("");setSuccess("");}}>Forgot password?</span>
            :<span style={{color:"#3b82f6",cursor:"pointer"}} onClick={()=>{setMode("login");setError("");setSuccess("");}}>← Back to sign in</span>}
        </div>
        <div style={{marginTop:24,padding:14,background:"#0f1117",borderRadius:10,fontSize:11,color:"#4b5a78",textAlign:"center",lineHeight:1.7}}>🔒 Access is by invite only.<br/>Contact your administrator to get an account.</div>
      </div>
    </div>
  );
}

function CampaignManager({campaigns,allUsers,refreshAll}){
  const[addOpen,setAddOpen]=useState(false);const[editCamp,setEditCamp]=useState(null);
  const[form,setForm]=useState({name:"",description:""});
  const[err,setErr]=useState("");const[ok,setOk]=useState("");
  const flash=(m,isOk)=>{isOk?setOk(m):setErr(m);setTimeout(()=>{setOk("");setErr("");},3000);};
  const handleAdd=async()=>{if(!form.name.trim())return setErr("Name required.");await db.post("campaigns",{name:form.name,description:form.description,created_at:new Date().toISOString()});setAddOpen(false);setForm({name:"",description:""});refreshAll();flash("Campaign created!",true);};
  const handleEdit=async()=>{await db.patch("campaigns",`id=eq.${editCamp.id}`,{name:editCamp.name,description:editCamp.description});setEditCamp(null);refreshAll();flash("Updated!",true);};
  const handleDelete=async(id)=>{if(allUsers.filter(u=>u.campaign_id===id).length>0)return flash("Remove all agents first.");await db.del("campaigns",`id=eq.${id}`);refreshAll();};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>🏢 Campaign Manager</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Create and manage campaigns</div></div>
        <button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={()=>{setAddOpen(true);setForm({name:"",description:""});}}>+ New Campaign</button>
      </div>
      <OkBox msg={ok}/><ErrBox msg={err}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {campaigns.map((camp,idx)=>{
          const color=CAMP_COLORS[idx%CAMP_COLORS.length];
          const members=allUsers.filter(u=>u.campaign_id===camp.id);
          return(
            <div key={camp.id} style={{background:"#161b27",borderRadius:16,border:`2px solid ${color}44`,padding:22}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:10,height:10,borderRadius:"50%",background:color}}/><div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{camp.name}</div></div>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={()=>setEditCamp({...camp})} style={{...s.btn("secondary"),padding:"5px 9px",fontSize:11}}>✏️</button>
                  <button onClick={()=>handleDelete(camp.id)} style={{...s.btn("danger"),padding:"5px 9px",fontSize:11}}>🗑️</button>
                </div>
              </div>
              <div style={{fontSize:12,color:"#4b5a78",marginBottom:12}}>{camp.description||"No description"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{background:"#0f1117",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:"#4b5a78"}}>Members</div><div style={{fontSize:18,fontWeight:800,color,marginTop:2}}>{members.length}</div></div>
                <div style={{background:"#0f1117",borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:"#4b5a78"}}>Agents</div><div style={{fontSize:18,fontWeight:800,color:"#c8d4e8",marginTop:2}}>{members.filter(u=>u.role==="agent").length}</div></div>
              </div>
              {members.length>0&&<div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:5}}>{members.map(u=><div key={u.id} title={u.name} style={{width:28,height:28,borderRadius:"50%",background:color+"33",border:`1px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color}}>{u.avatar}</div>)}</div>}
            </div>
          );
        })}
        {campaigns.length===0&&<div style={{...s.card,textAlign:"center",color:"#4b5a78",padding:"40px"}}><div style={{fontSize:32,marginBottom:8}}>🏢</div><div>No campaigns yet.</div></div>}
      </div>
      {addOpen&&<div style={s.modal} onClick={()=>setAddOpen(false)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>🏢 New Campaign</div><ErrBox msg={err}/>
        <div style={{marginBottom:14}}><label style={s.label}>Name *</label><input style={s.input} placeholder="e.g. Debt Relief, Mortgage, Solar..." value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
        <div style={{marginBottom:20}}><label style={s.label}>Description</label><input style={s.input} value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setAddOpen(false)}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={handleAdd}>Create</button></div>
      </div></div>}
      {editCamp&&<div style={s.modal} onClick={()=>setEditCamp(null)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>✏️ Edit Campaign</div>
        <div style={{marginBottom:14}}><label style={s.label}>Name</label><input style={s.input} value={editCamp.name} onChange={e=>setEditCamp(p=>({...p,name:e.target.value}))}/></div>
        <div style={{marginBottom:20}}><label style={s.label}>Description</label><input style={s.input} value={editCamp.description||""} onChange={e=>setEditCamp(p=>({...p,description:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setEditCamp(null)}>Cancel</button><button style={s.btn("primary")} onClick={handleEdit}>Save</button></div>
      </div></div>}
    </div>
  );
}

function UserManagement({currentUser,refreshUsers,allUsers,campaigns}){
  const[addOpen,setAddOpen]=useState(false);const[editUser,setEditUser]=useState(null);const[resetUser,setResetUser]=useState(null);const[newPw,setNewPw]=useState("");
  const[form,setForm]=useState({name:"",email:"",password:"",role:"agent",department:"Sales",target:40,campaign_id:""});
  const[err,setErr]=useState("");const[ok,setOk]=useState("");
  const flash=(m,isOk)=>{isOk?setOk(m):setErr(m);setTimeout(()=>{setOk("");setErr("");},3000);};
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const handleAdd=async()=>{
    if(!form.name||!form.email||!form.password)return setErr("Fill all required fields.");
    if(allUsers.find(u=>u.email.toLowerCase()===form.email.toLowerCase()))return setErr("Email already exists.");
    const initials=form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    await db.post("users",{...form,avatar:initials,status:"active",joined:today,campaign_id:form.campaign_id||null});
    refreshUsers();setAddOpen(false);setForm({name:"",email:"",password:"",role:"agent",department:"Sales",target:40,campaign_id:""});flash("User added!",true);
  };
  const handleEdit=async()=>{
    const initials=editUser.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    await db.patch("users",`id=eq.${editUser.id}`,{name:editUser.name,email:editUser.email,role:editUser.role,department:editUser.department,target:editUser.target,avatar:initials,campaign_id:editUser.campaign_id||null});
    refreshUsers();setEditUser(null);flash("Updated!",true);
  };
  const handleToggle=async(user)=>{await db.patch("users",`id=eq.${user.id}`,{status:user.status==="active"?"inactive":"active"});refreshUsers();};
  const handleDelete=async(id)=>{if(id===currentUser.id)return;await db.del("users",`id=eq.${id}`);refreshUsers();};
  const handleResetPw=async()=>{if(!newPw||newPw.length<6)return setErr("Min 6 chars.");await db.patch("users",`id=eq.${resetUser.id}`,{password:newPw});setResetUser(null);setNewPw("");flash("Password updated!",true);};
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div style={{fontSize:13,color:"#4b5a78"}}>{allUsers.length} users · {allUsers.filter(u=>u.role==="admin").length} admin · {allUsers.filter(u=>u.role==="agent").length} agents</div>
        <button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={()=>setAddOpen(true)}>+ Add User</button>
      </div>
      <OkBox msg={ok}/><ErrBox msg={err}/>
      {["admin","agent"].map(role=>(
        <div key={role} style={{marginBottom:28}}>
          <div style={{fontSize:12,fontWeight:700,color:"#4b5a78",marginBottom:10,textTransform:"uppercase",letterSpacing:1}}>{role==="admin"?"👑 Admins":"👤 Agents"}</div>
          <div style={s.card}><table style={s.table}>
            <thead><tr>{["User","Email","Campaign","Dept","Status","Actions"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{allUsers.filter(u=>u.role===role).map(user=>{
              const camp=campaigns.find(c=>c.id===user.campaign_id);const cColor=camp?cc(campaigns,camp.id):"#4b5a78";
              return(<tr key={user.id}>
                <td style={s.td}><div style={{display:"flex",alignItems:"center",gap:10}}><ProfilePic user={user} size={30}/><div><div style={{fontWeight:600,color:"#fff"}}>{user.name}{user.id===currentUser.id&&<span style={{fontSize:10,color:"#f59e0b",marginLeft:5}}>(you)</span>}</div><div style={{fontSize:10,color:"#4b5a78"}}>{user.role}</div></div></div></td>
                <td style={s.td}>{user.email}</td>
                <td style={s.td}>{camp?<span style={s.badge(cColor)}>{camp.name}</span>:<span style={{color:"#4b5a78"}}>—</span>}</td>
                <td style={s.td}>{user.department}</td>
                <td style={s.td}><span style={s.badge(user.status==="active"?"#10b981":"#ef4444")}>{user.status}</span></td>
                <td style={s.td}><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  <button style={{...s.btn("secondary"),padding:"4px 8px",fontSize:11}} onClick={()=>setEditUser({...user})}>Edit</button>
                  <button style={{...s.btn("secondary"),padding:"4px 8px",fontSize:11}} onClick={()=>{setResetUser(user);setNewPw("");}}>🔑</button>
                  {user.id!==currentUser.id&&<button style={{...s.btn(user.status==="active"?"danger":"success"),padding:"4px 8px",fontSize:11}} onClick={()=>handleToggle(user)}>{user.status==="active"?"Deactivate":"Activate"}</button>}
                  {user.id!==currentUser.id&&<button style={{...s.btn("danger"),padding:"4px 8px",fontSize:11}} onClick={()=>handleDelete(user.id)}>Del</button>}
                </div></td>
              </tr>);
            })}</tbody>
          </table></div>
        </div>
      ))}
      {addOpen&&<div style={s.modal} onClick={()=>setAddOpen(false)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>➕ Add User</div><ErrBox msg={err}/>
        {[["Full Name","name","text"],["Email","email","email"],["Password","password","password"]].map(([l,k,t])=><div key={k} style={{marginBottom:14}}><label style={s.label}>{l}</label><input style={s.input} type={t} value={form[k]} onChange={e=>f(k,e.target.value)}/></div>)}
        <div style={{marginBottom:14}}><label style={s.label}>Role</label><select style={s.input} value={form.role} onChange={e=>f("role",e.target.value)}><option value="agent">Agent</option><option value="admin">Admin</option></select></div>
        <div style={{marginBottom:14}}><label style={s.label}>Campaign</label><select style={s.input} value={form.campaign_id} onChange={e=>f("campaign_id",e.target.value)}><option value="">— None —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={s.label}>Department</label><select style={s.input} value={form.department} onChange={e=>f("department",e.target.value)}>{["Sales","Support","Operations","Management"].map(d=><option key={d}>{d}</option>)}</select></div>
        <div style={{marginBottom:20}}><label style={s.label}>Transfer Target</label><input style={s.input} type="number" value={form.target} onChange={e=>f("target",parseInt(e.target.value)||0)}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setAddOpen(false)}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={handleAdd}>Add</button></div>
      </div></div>}
      {editUser&&<div style={s.modal} onClick={()=>setEditUser(null)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>✏️ Edit User</div>
        {[["Full Name","name","text"],["Email","email","email"]].map(([l,k,t])=><div key={k} style={{marginBottom:14}}><label style={s.label}>{l}</label><input style={s.input} type={t} value={editUser[k]} onChange={e=>setEditUser(p=>({...p,[k]:e.target.value}))}/></div>)}
        <div style={{marginBottom:14}}><label style={s.label}>Role</label><select style={s.input} value={editUser.role} onChange={e=>setEditUser(p=>({...p,role:e.target.value}))}><option value="agent">Agent</option><option value="admin">Admin</option></select></div>
        <div style={{marginBottom:14}}><label style={s.label}>Campaign</label><select style={s.input} value={editUser.campaign_id||""} onChange={e=>setEditUser(p=>({...p,campaign_id:e.target.value||null}))}><option value="">— None —</option>{campaigns.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={s.label}>Department</label><select style={s.input} value={editUser.department} onChange={e=>setEditUser(p=>({...p,department:e.target.value}))}>{["Sales","Support","Operations","Management"].map(d=><option key={d}>{d}</option>)}</select></div>
        <div style={{marginBottom:20}}><label style={s.label}>Target</label><input style={s.input} type="number" value={editUser.target} onChange={e=>setEditUser(p=>({...p,target:parseInt(e.target.value)||0}))}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setEditUser(null)}>Cancel</button><button style={s.btn("primary")} onClick={handleEdit}>Save</button></div>
      </div></div>}
      {resetUser&&<div style={s.modal} onClick={()=>setResetUser(null)}><div style={{...s.mbox,width:360}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:6}}>🔑 Reset Password</div>
        <div style={{fontSize:13,color:"#4b5a78",marginBottom:18}}>For <strong style={{color:"#fff"}}>{resetUser.name}</strong></div><ErrBox msg={err}/>
        <div style={{marginBottom:20}}><label style={s.label}>New Password (min 6)</label><input style={s.input} type="password" value={newPw} onChange={e=>setNewPw(e.target.value)}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setResetUser(null)}>Cancel</button><button style={s.btn("primary")} onClick={handleResetPw}>Update</button></div>
      </div></div>}
    </div>
  );
}

function ProfileSettings({currentUser,allUsers,refreshUsers,onLogout,campaigns}){
  const me=allUsers.find(u=>u.id===currentUser.id)||currentUser;
  const[form,setForm]=useState({name:me.name,email:me.email,department:me.department});
  const[pwForm,setPwForm]=useState({current:"",newPw:"",confirm:""});
  const[msg,setMsg]=useState({p:"",pw:""});
  const[showPresets,setShowPresets]=useState(false);
  const flash=(k,m)=>{setMsg(p=>({...p,[k]:m}));setTimeout(()=>setMsg(p=>({...p,[k]:""})),3000);};
  const myCamp=campaigns.find(c=>c.id===me.campaign_id);
  const handlePhoto=(e)=>{const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024)return flash("p","Max 2MB.");const reader=new FileReader();reader.onload=async(ev)=>{await db.patch("users",`id=eq.${me.id}`,{photo:ev.target.result,preset:null});refreshUsers();flash("p","✅ Photo updated!");};reader.readAsDataURL(file);};
  const handlePreset=async(emoji)=>{await db.patch("users",`id=eq.${me.id}`,{preset:emoji,photo:null});refreshUsers();setShowPresets(false);flash("p","✅ Avatar updated!");};
  const removePhoto=async()=>{await db.patch("users",`id=eq.${me.id}`,{photo:null,preset:null});refreshUsers();};
  const saveProfile=async()=>{const initials=form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);await db.patch("users",`id=eq.${me.id}`,{...form,avatar:initials});refreshUsers();flash("p","✅ Profile updated!");};
  const savePassword=async()=>{
    if(pwForm.current!==me.password)return flash("pw","Current password incorrect.");
    if(pwForm.newPw.length<6)return flash("pw","Min 6 characters.");
    if(pwForm.newPw!==pwForm.confirm)return flash("pw","Passwords do not match.");
    await db.patch("users",`id=eq.${me.id}`,{password:pwForm.newPw});refreshUsers();setPwForm({current:"",newPw:"",confirm:""});flash("pw","✅ Password changed!");
  };
  return(
    <div style={{maxWidth:560}}>
      <div style={{...s.card,display:"flex",gap:20,alignItems:"center"}}>
        <div style={{position:"relative"}}><ProfilePic user={me} size={80}/>{(me.photo||me.preset)&&<button onClick={removePhoto} style={{position:"absolute",top:-4,right:-4,background:"#ef4444",border:"none",borderRadius:"50%",width:20,height:20,color:"#fff",fontSize:11,cursor:"pointer"}}>✕</button>}</div>
        <div><div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{me.name}</div><div style={{fontSize:13,color:"#4b5a78"}}>{me.email}</div>
          <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
            <span style={s.badge(me.role==="admin"?"#f59e0b":"#3b82f6")}>{me.role==="admin"?"👑 Admin":"👤 Agent"}</span>
            {myCamp&&<span style={s.badge(cc(campaigns,myCamp.id))}>🏢 {myCamp.name}</span>}
          </div>
        </div>
      </div>
      <div style={s.card}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:16}}>🖼️ Profile Picture</div>
        {msg.p&&(msg.p.startsWith("✅")?<OkBox msg={msg.p}/>:<ErrBox msg={msg.p}/>)}
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <label style={{...s.btn("primary"),cursor:"pointer"}}>📷 Upload<input type="file" accept="image/*" onChange={handlePhoto} style={{display:"none"}}/></label>
          <button style={s.btn("secondary")} onClick={()=>setShowPresets(!showPresets)}>😀 Avatar</button>
        </div>
        {showPresets&&<div style={{marginTop:14,display:"flex",flexWrap:"wrap",gap:8}}>{presetAvatars.map(e=><button key={e} onClick={()=>handlePreset(e)} style={{width:44,height:44,borderRadius:10,border:me.preset===e?"2px solid #3b82f6":"2px solid #1e2535",background:"#0f1117",fontSize:24,cursor:"pointer"}}>{e}</button>)}</div>}
      </div>
      <div style={s.card}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:16}}>Edit Profile</div>
        {[["Full Name","name","text"],["Email","email","email"]].map(([l,k,t])=><div key={k} style={{marginBottom:14}}><label style={s.label}>{l}</label><input style={s.input} type={t} value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/></div>)}
        <div style={{marginBottom:20}}><label style={s.label}>Department</label><select style={s.input} value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))}>{["Sales","Support","Operations","Management"].map(d=><option key={d}>{d}</option>)}</select></div>
        <button style={s.btn("primary")} onClick={saveProfile}>Save Profile</button>
      </div>
      <div style={s.card}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:16}}>Change Password</div>
        {msg.pw&&(msg.pw.startsWith("✅")?<OkBox msg={msg.pw}/>:<ErrBox msg={msg.pw}/>)}
        {[["Current Password","current"],["New Password","newPw"],["Confirm","confirm"]].map(([l,k])=><div key={k} style={{marginBottom:14}}><label style={s.label}>{l}</label><input style={s.input} type="password" placeholder="••••••••" value={pwForm[k]} onChange={e=>setPwForm(p=>({...p,[k]:e.target.value}))}/></div>)}
        <button style={s.btn("primary")} onClick={savePassword}>Update Password</button>
      </div>
      <div style={s.card}>
        <div style={{fontSize:15,fontWeight:700,color:"#fff",marginBottom:8}}>Account</div>
        <div style={{fontSize:13,color:"#4b5a78",marginBottom:16}}>Signed in as {me.email}</div>
        <button style={s.btn("danger")} onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  );
}

function LineChart({data,color="#10b981",valueKey="deals"}){
  const vals=data.map(d=>d[valueKey]);const max=Math.max(...vals)||1;const min=Math.min(...vals);
  const w=480,h=110,pad=10;
  const pts=vals.map((v,i)=>{const x=pad+(i/(vals.length-1))*(w-pad*2);const y=pad+(1-(v-min)/(max-min||1))*(h-pad*2);return`${x},${y}`;}).join(" ");
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:100}}>
      <defs><linearGradient id={`g${valueKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`${pad},${h-pad} ${pts} ${w-pad},${h-pad}`} fill={`url(#g${valueKey})`}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {vals.map((v,i)=>{const x=pad+(i/(vals.length-1))*(w-pad*2);const y=pad+(1-(v-min)/(max-min||1))*(h-pad*2);return<circle key={i} cx={x} cy={y} r="4" fill={color} stroke="#161b27" strokeWidth="2"/>;} )}
    </svg>
  );
}

const trendData=[{day:"Mon",deals:2},{day:"Tue",deals:4},{day:"Wed",deals:3},{day:"Thu",deals:6},{day:"Fri",deals:8},{day:"Sat",deals:3},{day:"Today",deals:5}];

function FreedomBoard({currentUser,isAdmin,campaignId}){
  const[posts,setPosts]=useState([]);const[loading,setLoading]=useState(true);
  const[filterCat,setFilterCat]=useState("All");const[newPostOpen,setNewPostOpen]=useState(false);
  const[newPost,setNewPost]=useState({title:"",body:"",category:"Idea"});
  const[expanded,setExpanded]=useState(null);const[commentText,setCommentText]=useState({});
  const categories=["All","Idea","Question","Concern","Shoutout","General"];
  const load=async()=>{
    setLoading(true);
    const q=isAdmin?"order=pinned.desc,id.desc":`campaign_id=eq.${campaignId}&order=pinned.desc,id.desc`;
    const d=await db.get("board_posts",q);setPosts(d||[]);setLoading(false);
  };
  useEffect(()=>{load();},[campaignId]);
  const filtered=posts.filter(p=>filterCat==="All"||p.category===filterCat);
  const react=async(post,emoji)=>{const r={...post.reactions};const already=r[emoji]?.includes(currentUser.name);r[emoji]=already?r[emoji].filter(n=>n!==currentUser.name):[...(r[emoji]||[]),currentUser.name];await db.patch("board_posts",`id=eq.${post.id}`,{reactions:r});load();};
  const comment=async(post)=>{const text=commentText[post.id]?.trim();if(!text)return;const comments=[...(post.comments||[]),{author:currentUser.name,avatar:currentUser.avatar,text,date:today}];await db.patch("board_posts",`id=eq.${post.id}`,{comments});setCommentText(p=>({...p,[post.id]:""}));load();};
  const pin=async(post)=>{await db.patch("board_posts",`id=eq.${post.id}`,{pinned:!post.pinned});load();};
  const del=async(id)=>{await db.del("board_posts",`id=eq.${id}`);load();};
  const submit=async()=>{if(!newPost.title.trim()||!newPost.body.trim())return;await db.post("board_posts",{...newPost,author:currentUser.name,avatar:currentUser.avatar,date:today,pinned:false,campaign_id:campaignId||null,reactions:{"👍":[],"❤️":[],"🔥":[]},comments:[]});setNewPost({title:"",body:"",category:"Idea"});setNewPostOpen(false);load();};
  if(loading)return<Spinner/>;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>📌 Freedom Board</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Open space for the team</div></div>
        <button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={()=>setNewPostOpen(true)}>+ New Post</button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>{categories.map(cat=><button key={cat} onClick={()=>setFilterCat(cat)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filterCat===cat?(catColors[cat]||"#3b82f6"):"#1e2535",color:filterCat===cat?"#fff":"#8899b4"}}>{cat!=="All"?catIcons[cat]+" ":""}{cat}</button>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(post=>{
          const isExp=expanded===post.id;const canDel=isAdmin||post.author===currentUser.name;
          return(
            <div key={post.id} style={{background:"#161b27",borderRadius:16,border:`1px solid ${post.pinned?"#3b82f655":"#1e2535"}`,overflow:"hidden"}}>
              {post.pinned&&<div style={{background:"#1e3a5f",padding:"6px 20px",display:"flex",gap:6}}><span>📌</span><span style={{fontSize:11,fontWeight:700,color:"#60a5fa"}}>PINNED</span></div>}
              <div style={{padding:"20px 22px"}}>
                <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                  <div style={s.avatar(40)}>{post.avatar}</div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><span style={{fontSize:14,fontWeight:700,color:"#fff"}}>{post.author}</span><span style={s.badge(catColors[post.category]||"#4b5a78")}>{catIcons[post.category]} {post.category}</span><span style={{fontSize:11,color:"#4b5a78"}}>{post.date}</span></div>
                    <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0",marginTop:6}}>{post.title}</div>
                  </div>
                  <div style={{display:"flex",gap:4}}>
                    {isAdmin&&<button onClick={()=>pin(post)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,color:post.pinned?"#60a5fa":"#4b5a78",padding:4}}>📌</button>}
                    {canDel&&<button onClick={()=>del(post.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,color:"#4b5a78",padding:4}}>🗑️</button>}
                  </div>
                </div>
                <div style={{fontSize:14,color:"#c8d4e8",lineHeight:1.7,background:"#0f1117",borderRadius:10,padding:"12px 16px",marginBottom:14}}>{post.body}</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  {["👍","❤️","🔥"].map(emoji=>{const count=post.reactions?.[emoji]?.length||0;const reacted=post.reactions?.[emoji]?.includes(currentUser.name);return<button key={emoji} onClick={()=>react(post,emoji)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:20,border:`1px solid ${reacted?"#3b82f6":"#1e2535"}`,background:reacted?"#1e3a5f":"#0f1117",cursor:"pointer",fontSize:13,color:reacted?"#60a5fa":"#8899b4"}}>{emoji}{count>0&&<span style={{fontSize:12,fontWeight:600}}>{count}</span>}</button>;})}
                  <button onClick={()=>setExpanded(isExp?null:post.id)} style={{marginLeft:"auto",background:"transparent",border:"none",cursor:"pointer",fontSize:12,color:"#4b5a78"}}>💬 {(post.comments||[]).length} {isExp?"▲":"▼"}</button>
                </div>
                {isExp&&<div style={{marginTop:16,borderTop:"1px solid #1e2535",paddingTop:16}}>
                  {(post.comments||[]).map((c,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:12}}><div style={s.avatar(30)}>{c.avatar}</div><div style={{flex:1,background:"#0f1117",borderRadius:10,padding:"9px 13px"}}><div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:3}}>{c.author} <span style={{fontSize:10,color:"#4b5a78"}}>{c.date}</span></div><div style={{fontSize:13,color:"#c8d4e8"}}>{c.text}</div></div></div>)}
                  <div style={{display:"flex",gap:10,marginTop:8}}>
                    <div style={s.avatar(30)}>{currentUser.avatar}</div>
                    <input style={{...s.input,flex:1}} placeholder="Write a comment…" value={commentText[post.id]||""} onChange={e=>setCommentText(p=>({...p,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&comment(post)}/>
                    <button style={{...s.btn("primary"),padding:"9px 14px"}} onClick={()=>comment(post)}>Send</button>
                  </div>
                </div>}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"48px 0",color:"#4b5a78"}}><div style={{fontSize:36,marginBottom:8}}>🗒️</div><div>No posts yet.</div></div>}
      </div>
      {newPostOpen&&<div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setNewPostOpen(false)}><div style={{background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:32,width:500}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:20}}>✍️ New Post</div>
        <div style={{marginBottom:14}}><label style={s.label}>Category</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{["Idea","Question","Concern","Shoutout","General"].map(cat=><button key={cat} onClick={()=>setNewPost(p=>({...p,category:cat}))} style={{padding:"7px 12px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:newPost.category===cat?(catColors[cat]||"#3b82f6"):"#1e2535",color:newPost.category===cat?"#fff":"#8899b4"}}>{catIcons[cat]} {cat}</button>)}</div></div>
        <div style={{marginBottom:14}}><label style={s.label}>Title</label><input style={s.input} placeholder="What's on your mind?" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))}/></div>
        <div style={{marginBottom:20}}><label style={s.label}>Message</label><textarea style={{...s.input,minHeight:100,resize:"vertical"}} value={newPost.body} onChange={e=>setNewPost(p=>({...p,body:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setNewPostOpen(false)}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={submit}>Post</button></div>
      </div></div>}
    </div>
  );
}

function ScriptsLibrary({isAdmin,currentUser,campaignId}){
  const[scripts,setScripts]=useState([]);const[loading,setLoading]=useState(true);
  const[filterCat,setFilterCat]=useState("All");const[search,setSearch]=useState("");
  const[addOpen,setAddOpen]=useState(false);const[editScript,setEditScript]=useState(null);
  const[expanded,setExpanded]=useState(null);
  const[form,setForm]=useState({title:"",category:"Call Script",content:"",tags:""});
  const cats=["All","Call Script","Objection Handler","Onboarding"];
  const cCol={"Call Script":"#3b82f6","Objection Handler":"#ef4444","Onboarding":"#10b981"};
  const cIco={"Call Script":"📞","Objection Handler":"🛡️","Onboarding":"🎓"};
  const load=async()=>{setLoading(true);const q=isAdmin?"order=id.desc":`campaign_id=eq.${campaignId}&order=id.desc`;const d=await db.get("scripts",q);setScripts(d||[]);setLoading(false);};
  useEffect(()=>{load();},[campaignId]);
  const filtered=scripts.filter(sc=>(filterCat==="All"||sc.category===filterCat)&&(!search||sc.title.toLowerCase().includes(search.toLowerCase())||sc.content?.toLowerCase().includes(search.toLowerCase())));
  const save=async()=>{
    if(!form.title||!form.content)return;
    const tags=form.tags.split(",").map(t=>t.trim().toLowerCase()).filter(Boolean);
    if(editScript){await db.patch("scripts",`id=eq.${editScript.id}`,{...form,tags});setEditScript(null);}
    else{await db.post("scripts",{...form,tags,created_by:currentUser.name,date:today,campaign_id:campaignId||null});setAddOpen(false);}
    setForm({title:"",category:"Call Script",content:"",tags:""});load();
  };
  if(loading)return<Spinner/>;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>📋 Scripts Library</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Call scripts and guides</div></div>
        {isAdmin&&<button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={()=>{setAddOpen(true);setEditScript(null);setForm({title:"",category:"Call Script",content:"",tags:""});}}>+ Add Script</button>}
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap",alignItems:"center"}}>
        <input style={{...s.input,maxWidth:240}} placeholder="🔍 Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(cat=><button key={cat} onClick={()=>setFilterCat(cat)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filterCat===cat?(cCol[cat]||"#3b82f6"):"#1e2535",color:filterCat===cat?"#fff":"#8899b4"}}>{cat!=="All"?cIco[cat]+" ":""}{cat}</button>)}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {filtered.map(sc=>(
          <div key={sc.id} style={{background:"#161b27",borderRadius:14,border:"1px solid #1e2535",padding:"18px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{fontSize:24}}>{cIco[sc.category]||"📄"}</div>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:15,color:"#fff"}}>{sc.title}</div><div style={{display:"flex",gap:8,marginTop:4,flexWrap:"wrap"}}><span style={s.badge(cCol[sc.category]||"#4b5a78")}>{sc.category}</span>{(sc.tags||[]).map(t=><span key={t} style={{fontSize:10,color:"#4b5a78",background:"#0f1117",padding:"2px 8px",borderRadius:10}}>#{t}</span>)}</div></div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>navigator.clipboard?.writeText(sc.content)} style={{...s.btn("secondary"),padding:"6px 10px",fontSize:12}}>📋</button>
                {isAdmin&&<button onClick={()=>{setEditScript(sc);setForm({title:sc.title,category:sc.category,content:sc.content,tags:(sc.tags||[]).join(", ")});}} style={{...s.btn("secondary"),padding:"6px 10px",fontSize:12}}>✏️</button>}
                {isAdmin&&<button onClick={async()=>{await db.del("scripts",`id=eq.${sc.id}`);load();}} style={{...s.btn("danger"),padding:"6px 10px",fontSize:12}}>🗑️</button>}
                <button onClick={()=>setExpanded(expanded===sc.id?null:sc.id)} style={{...s.btn("ghost"),padding:"6px 10px"}}>{expanded===sc.id?"▲":"▼"}</button>
              </div>
            </div>
            {expanded===sc.id&&<div style={{marginTop:14,background:"#0f1117",borderRadius:10,padding:"14px 16px",whiteSpace:"pre-wrap",fontSize:13,color:"#c8d4e8",lineHeight:1.8,fontFamily:"monospace"}}>{sc.content}</div>}
          </div>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:"40px 0",color:"#4b5a78"}}><div style={{fontSize:28,marginBottom:8}}>📭</div><div>No scripts found.</div></div>}
      </div>
      {(addOpen||editScript)&&<div style={s.modal} onClick={()=>{setAddOpen(false);setEditScript(null);}}><div style={{background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:32,width:540,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>{editScript?"✏️ Edit":"➕ New"} Script</div>
        <div style={{marginBottom:14}}><label style={s.label}>Title</label><input style={s.input} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
        <div style={{marginBottom:14}}><label style={s.label}>Category</label><div style={{display:"flex",gap:8}}>{["Call Script","Objection Handler","Onboarding"].map(cat=><button key={cat} onClick={()=>setForm(p=>({...p,category:cat}))} style={{padding:"7px 12px",borderRadius:8,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:form.category===cat?(cCol[cat]||"#3b82f6"):"#1e2535",color:form.category===cat?"#fff":"#8899b4"}}>{cIco[cat]} {cat}</button>)}</div></div>
        <div style={{marginBottom:14}}><label style={s.label}>Content</label><textarea style={{...s.input,minHeight:180,resize:"vertical",fontFamily:"monospace"}} value={form.content} onChange={e=>setForm(p=>({...p,content:e.target.value}))}/></div>
        <div style={{marginBottom:20}}><label style={s.label}>Tags (comma separated)</label><input style={s.input} value={form.tags} onChange={e=>setForm(p=>({...p,tags:e.target.value}))}/></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>{setAddOpen(false);setEditScript(null);}}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={save}>Save</button></div>
      </div></div>}
    </div>
  );
}

function TransferredLeads({currentUser,allUsers,isAdmin,performance,setPerformance,campaignId}){
  const[transfers,setTransfers]=useState([]);const[loading,setLoading]=useState(true);
  const[submitOpen,setSubmitOpen]=useState(false);const[filterStatus,setFilterStatus]=useState("All");
  const[form,setForm]=useState({firstName:"",lastName:"",phone:"",state:"",hasLoan:false,agreedService:false,monthlyPayment:"250"});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const sc={Pending:"#f59e0b",Successful:"#10b981",Unsuccessful:"#ef4444"};
  const load=async()=>{
    setLoading(true);
    const d=await db.get("transfers","order=id.desc");
    const campAgentIds=isAdmin?null:allUsers.filter(u=>u.role==="agent"&&String(u.campaign_id)===String(campaignId)).map(a=>a.id);
    const filtered=isAdmin?d:(d||[]).filter(t=>campAgentIds.includes(t.agent_id));
    setTransfers(filtered||[]);setLoading(false);
  };
  useEffect(()=>{load();},[campaignId,isAdmin]);
  const mine=isAdmin?transfers:transfers.filter(t=>t.agent_id===currentUser.id);
  const filtered=mine.filter(t=>filterStatus==="All"||t.status===filterStatus);
  const handleSubmit=async()=>{
    if(!form.firstName||!form.lastName||!form.phone||!form.state)return alert("Fill all required fields.");
    await db.post("transfers",{agent_id:currentUser.id,agent_name:currentUser.name,agent_avatar:currentUser.avatar,first_name:form.firstName,last_name:form.lastName,phone:form.phone,state:form.state,has_loan:form.hasLoan,agreed_service:form.agreedService,monthly_payment:parseFloat(form.monthlyPayment)||250,status:"Pending",date:today,time:new Date().toLocaleTimeString(),campaign_id:campaignId||null});
    setSubmitOpen(false);setForm({firstName:"",lastName:"",phone:"",state:"",hasLoan:false,agreedService:false,monthlyPayment:"250"});load();
  };
  const handleTag=async(t,status)=>{
    await db.patch("transfers",`id=eq.${t.id}`,{status,reviewed_by:currentUser.name});
    if(status==="Successful"){
      const cur=await db.get("performance",`user_id=eq.${t.agent_id}`);
      if(cur&&cur.length>0){await db.patch("performance",`user_id=eq.${t.agent_id}`,{deals:(cur[0].deals||0)+1,revenue:(cur[0].revenue||0)+(t.monthly_payment*12)});}
      else{await db.post("performance",{user_id:t.agent_id,deals:1,revenue:t.monthly_payment*12,calls:0,tasks:0});}
      setPerformance(prev=>({...prev,[t.agent_id]:{...(prev[t.agent_id]||{}),deals:((prev[t.agent_id]?.deals)||0)+1}}));
    }
    load();
  };
  if(loading)return<Spinner/>;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>🔄 Transferred Leads</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Submit and track buffered transfers</div></div>
        {!isAdmin&&<button style={{...s.btn("primary"),background:"linear-gradient(135deg,#10b981,#3b82f6)"}} onClick={()=>setSubmitOpen(true)}>+ Submit Transfer</button>}
      </div>
      <div style={s.grid4}>{[{l:"Total",v:mine.length,c:"#60a5fa",i:"📋"},{l:"Successful",v:mine.filter(t=>t.status==="Successful").length,c:"#10b981",i:"✅"},{l:"Pending",v:mine.filter(t=>t.status==="Pending").length,c:"#f59e0b",i:"⏳"},{l:"Unsuccessful",v:mine.filter(t=>t.status==="Unsuccessful").length,c:"#ef4444",i:"❌"}].map((stat,i)=><div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:6}}>{stat.i}</div><div style={{fontSize:26,fontWeight:800,color:stat.c}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>)}</div>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>{["All","Pending","Successful","Unsuccessful"].map(st=><button key={st} onClick={()=>setFilterStatus(st)} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filterStatus===st?(sc[st]||"#3b82f6"):"#1e2535",color:filterStatus===st?"#fff":"#8899b4"}}>{st}</button>)}</div>
      <div style={s.card}>{filtered.length===0?<div style={{textAlign:"center",padding:"30px 0",color:"#4b5a78"}}><div style={{fontSize:28,marginBottom:8}}>📭</div><div>No transfers.</div></div>:(
        <table style={s.table}>
          <thead><tr>{[isAdmin?"Agent":null,"Lead","Phone","State","Loan","Monthly","Status","Date",isAdmin?"Action":null].filter(Boolean).map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(t=>(
            <tr key={t.id}>
              {isAdmin&&<td style={s.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{...s.avatar(26),fontSize:9}}>{t.agent_avatar}</div><span style={{fontWeight:600,color:"#fff",fontSize:12}}>{t.agent_name}</span></div></td>}
              <td style={s.td}><span style={{fontWeight:600,color:"#fff"}}>{t.first_name} {t.last_name}</span></td>
              <td style={s.td}>{t.phone}</td><td style={s.td}>{t.state}</td>
              <td style={s.td}><span style={s.badge(t.has_loan?"#10b981":"#ef4444")}>{t.has_loan?"Yes":"No"}</span></td>
              <td style={s.td}>${t.monthly_payment}/mo</td>
              <td style={s.td}><span style={s.badge(sc[t.status]||"#4b5a78")}>{t.status}</span></td>
              <td style={s.td}><div style={{fontSize:12}}>{t.date}</div></td>
              {isAdmin&&<td style={s.td}>{t.status==="Pending"?<div style={{display:"flex",gap:5}}><button style={{...s.btn("success"),padding:"4px 9px",fontSize:11}} onClick={()=>handleTag(t,"Successful")}>✅</button><button style={{...s.btn("danger"),padding:"4px 9px",fontSize:11}} onClick={()=>handleTag(t,"Unsuccessful")}>❌</button></div>:<span style={{fontSize:11,color:"#4b5a78"}}>{t.reviewed_by}</span>}</td>}
            </tr>
          ))}</tbody>
        </table>
      )}</div>
      {submitOpen&&<div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setSubmitOpen(false)}><div style={{background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:32,width:500,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:6}}>🔄 Submit Transfer</div>
        <div style={{fontSize:13,color:"#4b5a78",marginBottom:20}}>Fill in lead info for management review</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={s.label}>First Name *</label><input style={s.input} placeholder="John" value={form.firstName} onChange={e=>f("firstName",e.target.value)}/></div>
          <div><label style={s.label}>Last Name *</label><input style={s.input} placeholder="Smith" value={form.lastName} onChange={e=>f("lastName",e.target.value)}/></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
          <div><label style={s.label}>Phone *</label><input style={s.input} placeholder="(555) 123-4567" value={form.phone} onChange={e=>f("phone",e.target.value)}/></div>
          <div><label style={s.label}>State *</label><input style={s.input} placeholder="California" value={form.state} onChange={e=>f("state",e.target.value)}/></div>
        </div>
        <div style={{marginBottom:14}}><label style={s.label}>Monthly Payment ($)</label><input style={s.input} type="number" value={form.monthlyPayment} onChange={e=>f("monthlyPayment",e.target.value)}/></div>
        <div style={{background:"#0f1117",borderRadius:12,padding:16,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:12}}>Qualifications</div>
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginBottom:12}}><input type="checkbox" checked={form.hasLoan} onChange={e=>f("hasLoan",e.target.checked)} style={{width:16,height:16,accentColor:"#3b82f6"}}/><div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>Has $15k Personal Loan</div></div></label>
          <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><input type="checkbox" checked={form.agreedService} onChange={e=>f("agreedService",e.target.checked)} style={{width:16,height:16,accentColor:"#3b82f6"}}/><div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:600}}>Agreed @ ${form.monthlyPayment}/mo</div></div></label>
        </div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setSubmitOpen(false)}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#10b981,#3b82f6)",flex:1}} onClick={handleSubmit}>Submit</button></div>
      </div></div>}
    </div>
  );
}

function CoachingSessions({currentUser,allUsers,isAdmin,campaignId}){
  const[sessions,setSessions]=useState([]);const[loading,setLoading]=useState(true);
  const[addOpen,setAddOpen]=useState(false);const[expanded,setExpanded]=useState(null);
  const[commentText,setCommentText]=useState({});const[filterAgent,setFilterAgent]=useState("All");
  const[form,setForm]=useState({agentId:"",topic:"",notes:"",actionItems:"",rating:"3"});
  const campAgents=allUsers.filter(u=>u.role==="agent"&&(isAdmin||String(u.campaign_id)===String(campaignId)));
  const rc={1:"#ef4444",2:"#f59e0b",3:"#3b82f6",4:"#8b5cf6",5:"#10b981"};
  const rl={1:"Needs Work",2:"Below Avg",3:"Average",4:"Good",5:"Excellent"};
  const load=async()=>{setLoading(true);const d=await db.get("coaching","order=id.desc");const f2=isAdmin?d:(d||[]).filter(c=>campAgents.find(a=>a.id===c.agent_id));setSessions(f2||[]);setLoading(false);};
  useEffect(()=>{load();},[campaignId]);
  const mine=isAdmin?sessions:sessions.filter(c=>c.agent_id===currentUser.id);
  const filtered=mine.filter(c=>filterAgent==="All"||c.agent_id===parseInt(filterAgent));
  const handleAdd=async()=>{
    if(!form.agentId||!form.topic)return alert("Select agent and topic.");
    const agent=allUsers.find(u=>u.id===parseInt(form.agentId));
    await db.post("coaching",{agent_id:parseInt(form.agentId),agent_name:agent?.name,agent_avatar:agent?.avatar,coach_name:currentUser.name,topic:form.topic,notes:form.notes,action_items:form.actionItems.split("\n").filter(Boolean),rating:parseInt(form.rating),date:today,comments:[],campaign_id:campaignId||null});
    setAddOpen(false);setForm({agentId:"",topic:"",notes:"",actionItems:"",rating:"3"});load();
  };
  const handleComment=async(session)=>{const text=commentText[session.id]?.trim();if(!text)return;const comments=[...(session.comments||[]),{author:currentUser.name,avatar:currentUser.avatar,text,date:today}];await db.patch("coaching",`id=eq.${session.id}`,{comments});setCommentText(p=>({...p,[session.id]:""}));load();};
  if(loading)return<Spinner/>;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>🎓 Coaching Sessions</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Track coaching and progress</div></div>
        {isAdmin&&<button style={{...s.btn("primary"),background:"linear-gradient(135deg,#8b5cf6,#3b82f6)"}} onClick={()=>setAddOpen(true)}>+ Add Session</button>}
      </div>
      {isAdmin&&<div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button onClick={()=>setFilterAgent("All")} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filterAgent==="All"?"#3b82f6":"#1e2535",color:filterAgent==="All"?"#fff":"#8899b4"}}>All</button>
        {campAgents.map(a=><button key={a.id} onClick={()=>setFilterAgent(String(a.id))} style={{padding:"7px 14px",borderRadius:20,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filterAgent===String(a.id)?"#8b5cf6":"#1e2535",color:filterAgent===String(a.id)?"#fff":"#8899b4"}}>{a.name.split(" ")[0]}</button>)}
      </div>}
      {filtered.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#4b5a78"}}><div style={{fontSize:40,marginBottom:10}}>🎓</div><div>No sessions yet.</div></div>}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(session=>{const isExp=expanded===session.id;return(
          <div key={session.id} style={{background:"#161b27",borderRadius:16,border:"1px solid #1e2535",padding:"20px 24px"}}>
            <div style={{display:"flex",gap:14,marginBottom:14,alignItems:"flex-start"}}>
              <div style={{...s.avatar(46),background:"linear-gradient(135deg,#8b5cf6,#3b82f6)"}}>{session.agent_avatar}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{session.topic}</div>
                <div style={{fontSize:12,color:"#4b5a78",marginTop:3}}>Agent: <span style={{color:"#c8d4e8"}}>{session.agent_name}</span> · Coach: <span style={{color:"#c8d4e8"}}>{session.coach_name}</span> · {session.date}</div>
                <div style={{display:"flex",gap:8,marginTop:6}}><span style={s.badge(rc[session.rating]||"#3b82f6")}>{"⭐".repeat(session.rating)} {rl[session.rating]}</span><span style={{fontSize:11,color:"#4b5a78"}}>💬 {(session.comments||[]).length}</span></div>
              </div>
              <button onClick={()=>setExpanded(isExp?null:session.id)} style={{...s.btn("ghost"),padding:"6px 10px"}}>{isExp?"▲":"▼"}</button>
            </div>
            {isExp&&<div>
              {session.notes&&<div style={{background:"#0f1117",borderRadius:10,padding:"14px 16px",marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:"#4b5a78",marginBottom:8}}>📝 NOTES</div><div style={{fontSize:13,color:"#c8d4e8",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{session.notes}</div></div>}
              {(session.action_items||[]).length>0&&<div style={{background:"#0f1117",borderRadius:10,padding:"14px 16px",marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:"#4b5a78",marginBottom:8}}>✅ ACTION ITEMS</div>{session.action_items.map((item,i)=><div key={i} style={{fontSize:13,color:"#c8d4e8",marginBottom:6}}><span style={{color:"#8b5cf6",fontWeight:700}}>{i+1}.</span> {item}</div>)}</div>}
              <div style={{borderTop:"1px solid #1e2535",paddingTop:14}}>
                <div style={{fontSize:11,fontWeight:700,color:"#4b5a78",marginBottom:10}}>COMMENTS</div>
                {(session.comments||[]).map((c,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10}}><div style={s.avatar(30)}>{c.avatar}</div><div style={{flex:1,background:"#0f1117",borderRadius:10,padding:"9px 13px"}}><div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:3}}>{c.author} <span style={{fontSize:10,color:"#4b5a78"}}>{c.date}</span></div><div style={{fontSize:13,color:"#c8d4e8"}}>{c.text}</div></div></div>)}
                <div style={{display:"flex",gap:10,marginTop:8}}>
                  <div style={s.avatar(30)}>{currentUser.avatar}</div>
                  <input style={{...s.input,flex:1}} placeholder="Add a comment…" value={commentText[session.id]||""} onChange={e=>setCommentText(p=>({...p,[session.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleComment(session)}/>
                  <button style={{...s.btn("primary"),padding:"9px 14px"}} onClick={()=>handleComment(session)}>Send</button>
                </div>
              </div>
            </div>}
          </div>
        );})}
      </div>
      {addOpen&&<div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>setAddOpen(false)}><div style={{background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:32,width:540,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:20}}>🎓 New Session</div>
        <div style={{marginBottom:14}}><label style={s.label}>Agent *</label><select style={s.input} value={form.agentId} onChange={e=>setForm(p=>({...p,agentId:e.target.value}))}><option value="">Select agent…</option>{campAgents.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
        <div style={{marginBottom:14}}><label style={s.label}>Topic *</label><input style={s.input} value={form.topic} onChange={e=>setForm(p=>({...p,topic:e.target.value}))}/></div>
        <div style={{marginBottom:14}}><label style={s.label}>Notes</label><textarea style={{...s.input,minHeight:100,resize:"vertical"}} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
        <div style={{marginBottom:14}}><label style={s.label}>Action Items (one per line)</label><textarea style={{...s.input,minHeight:80,resize:"vertical"}} value={form.actionItems} onChange={e=>setForm(p=>({...p,actionItems:e.target.value}))}/></div>
        <div style={{marginBottom:22}}><label style={s.label}>Rating</label><div style={{display:"flex",gap:8}}>{[1,2,3,4,5].map(r=><button key={r} onClick={()=>setForm(p=>({...p,rating:String(r)}))} style={{flex:1,padding:"10px 0",borderRadius:8,border:`2px solid ${form.rating===String(r)?rc[r]:"#1e2535"}`,background:form.rating===String(r)?rc[r]+"22":"#0f1117",cursor:"pointer",fontSize:12,fontWeight:700,color:form.rating===String(r)?rc[r]:"#4b5a78"}}>{"⭐".repeat(r)}<div style={{fontSize:9,marginTop:3}}>{rl[r]}</div></button>)}</div></div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>setAddOpen(false)}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#8b5cf6,#3b82f6)",flex:1}} onClick={handleAdd}>Save</button></div>
      </div></div>}
    </div>
  );
}

function Newsletter({isAdmin,currentUser}){
  const[posts,setPosts]=useState([]);const[loading,setLoading]=useState(true);
  const[addOpen,setAddOpen]=useState(false);const[editPost,setEditPost]=useState(null);
  const[form,setForm]=useState({title:"",body:"",image:null});
  const load=async()=>{setLoading(true);const d=await db.get("newsletter","order=id.desc");setPosts(d||[]);setLoading(false);};
  useEffect(()=>{load();},[]);
  const handleImage=(e)=>{const file=e.target.files[0];if(!file)return;if(file.size>5*1024*1024)return alert("Max 5MB.");const reader=new FileReader();reader.onload=(ev)=>setForm(p=>({...p,image:ev.target.result}));reader.readAsDataURL(file);};
  const handleSave=async()=>{
    if(!form.title.trim())return alert("Add a title.");
    if(editPost){await db.patch("newsletter",`id=eq.${editPost.id}`,{title:form.title,body:form.body,image:form.image,updated_at:new Date().toISOString()});setEditPost(null);}
    else{await db.post("newsletter",{title:form.title,body:form.body,image:form.image,author:currentUser.name,created_at:new Date().toISOString()});setAddOpen(false);}
    setForm({title:"",body:"",image:null});load();
  };
  if(loading)return<Spinner/>;
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><div style={{fontSize:22,fontWeight:800,color:"#fff"}}>📰 Newsletter</div><div style={{fontSize:13,color:"#4b5a78",marginTop:3}}>Team updates and announcements</div></div>
        {isAdmin&&<button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={()=>{setAddOpen(true);setEditPost(null);setForm({title:"",body:"",image:null});}}>+ New Post</button>}
      </div>
      {posts.length===0&&<div style={{textAlign:"center",padding:"60px 0",color:"#4b5a78"}}><div style={{fontSize:40,marginBottom:10}}>📰</div><div>No posts yet.</div></div>}
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        {posts.map(post=>(
          <div key={post.id} style={{background:"#161b27",borderRadius:16,border:"1px solid #1e2535",overflow:"hidden"}}>
            {post.image&&<img src={post.image} alt="newsletter" style={{width:"100%",maxHeight:380,objectFit:"cover",display:"block"}}/>}
            <div style={{padding:"22px 26px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:10}}>
                <div><div style={{fontSize:20,fontWeight:800,color:"#fff",marginBottom:4}}>{post.title}</div><div style={{fontSize:12,color:"#4b5a78"}}>By <span style={{color:"#c8d4e8"}}>{post.author}</span> · {post.created_at?new Date(post.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}):""}</div></div>
                {isAdmin&&<div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>{setEditPost(post);setForm({title:post.title,body:post.body,image:post.image});}} style={{...s.btn("secondary"),padding:"6px 12px",fontSize:12}}>✏️</button>
                  <button onClick={async()=>{await db.del("newsletter",`id=eq.${post.id}`);load();}} style={{...s.btn("danger"),padding:"6px 12px",fontSize:12}}>🗑️</button>
                </div>}
              </div>
              {post.body&&<div style={{fontSize:14,color:"#c8d4e8",lineHeight:1.8,whiteSpace:"pre-wrap",borderTop:"1px solid #1e2535",paddingTop:14,marginTop:10}}>{post.body}</div>}
            </div>
          </div>
        ))}
      </div>
      {(addOpen||editPost)&&<div style={{position:"fixed",inset:0,background:"#000b",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={()=>{setAddOpen(false);setEditPost(null);}}><div style={{background:"#161b27",borderRadius:20,border:"1px solid #1e2535",padding:32,width:560,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:20}}>{editPost?"✏️ Edit":"📰 New"} Post</div>
        <div style={{marginBottom:14}}><label style={s.label}>Title *</label><input style={s.input} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/></div>
        <div style={{marginBottom:14}}><label style={s.label}>Message</label><textarea style={{...s.input,minHeight:140,resize:"vertical"}} value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))}/></div>
        <div style={{marginBottom:20}}>
          <label style={s.label}>Image (optional)</label>
          <label style={{...s.btn("secondary"),cursor:"pointer",display:"inline-block",marginBottom:8}}>📷 Upload<input type="file" accept="image/*" onChange={handleImage} style={{display:"none"}}/></label>
          {form.image&&<div style={{marginTop:8,position:"relative",display:"inline-block"}}><img src={form.image} alt="preview" style={{maxWidth:"100%",maxHeight:200,borderRadius:10,display:"block"}}/><button onClick={()=>setForm(p=>({...p,image:null}))} style={{position:"absolute",top:6,right:6,background:"#ef4444",border:"none",borderRadius:"50%",width:24,height:24,color:"#fff",fontSize:12,cursor:"pointer"}}>✕</button></div>}
        </div>
        <div style={{display:"flex",gap:10}}><button style={s.btn("secondary")} onClick={()=>{setAddOpen(false);setEditPost(null);}}>Cancel</button><button style={{...s.btn("primary"),background:"linear-gradient(135deg,#3b82f6,#8b5cf6)"}} onClick={handleSave}>Publish</button></div>
      </div></div>}
    </div>
  );
}

function CampaignOverview({campaign,campaigns,allUsers,performance,attendance,agentStatuses,leads}){
  const color=cc(campaigns,campaign.id);
  const campAgents=allUsers.filter(u=>u.role==="agent"&&String(u.campaign_id)===String(campaign.id));
  const totalTransfers=campAgents.reduce((s,a)=>(performance[a.id]?.deals||0)+s,0);
  const now=Date.now();
  const statusDot={Online:"#10b981","On Break":"#f59e0b",Offline:"#ef4444"};
  const campLeads=leads.filter(l=>campAgents.find(a=>a.id===l.assigned_to));
  return(
    <div>
      <div style={{...s.card,borderColor:color+"66",background:`linear-gradient(135deg,${color}11,#161b27)`,marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:48,height:48,borderRadius:12,background:color+"33",border:`2px solid ${color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏢</div>
          <div>
            <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{campaign.name}</div>
            <div style={{fontSize:13,color:"#4b5a78",marginTop:2}}>{campaign.description||"No description"} · {campAgents.length} agents</div>
          </div>
        </div>
      </div>
      <div style={s.grid4}>
        {[{l:"Total Transfers",v:totalTransfers,c:color,i:"🔄"},{l:"Agents",v:campAgents.length,c:"#60a5fa",i:"👥"},{l:"Active Leads",v:campLeads.filter(l=>l.status!=="Closed Lost").length,c:"#10b981",i:"🎯"},{l:"Present Today",v:campAgents.filter(a=>(attendance[a.id]||[]).find(r=>r.date===today&&(r.status==="Present"||r.status==="Late"))).length,c:"#f59e0b",i:"🕐"}].map((stat,i)=>(
          <div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:6}}>{stat.i}</div><div style={{fontSize:26,fontWeight:800,color:stat.c}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>
        ))}
      </div>
      <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>👥 Agents</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12,marginBottom:24}}>
        {campAgents.map(agent=>{
          const perf=performance[agent.id]||{};
          const attRecs=attendance[agent.id]||[];
          const present=attRecs.filter(r=>r.status==="Present"||r.status==="Late").length;
          const attRate=attRecs.length?Math.round((present/attRecs.length)*100):0;
          const att=Math.round(((perf.deals||0)/(agent.target||40))*100);
          const st=agentStatuses[agent.id];
          const isRecent=st&&(now-new Date(st.updated_at).getTime())<30000;
          const status=isRecent?st.status:"Offline";
          let breakDisplay=null;
          if(status==="On Break"&&st?.break_started){const bs=Math.floor((now-new Date(st.break_started).getTime())/1000);breakDisplay=`${Math.floor(bs/60).toString().padStart(2,"0")}:${(bs%60).toString().padStart(2,"0")}`;}
          return(
            <div key={agent.id} style={{background:"#161b27",borderRadius:14,border:`1px solid ${status==="Online"?color+"44":status==="On Break"?"#f59e0b44":"#1e2535"}`,padding:16}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <div style={{position:"relative"}}><ProfilePic user={agent} size={38}/><div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:statusDot[status]||"#ef4444",border:"2px solid #161b27"}}/></div>
                <div style={{flex:1}}><div style={{fontWeight:700,color:"#fff",fontSize:13}}>{agent.name}</div><div style={{fontSize:11,color:"#4b5a78"}}>{agent.department}</div></div>
                <span style={s.badge(statusDot[status]||"#ef4444")}>{status}</span>
              </div>
              {status==="On Break"&&breakDisplay&&<div style={{background:"#f59e0b22",border:"1px solid #f59e0b55",borderRadius:8,padding:"4px 10px",marginBottom:8,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:"#f59e0b"}}>⏱️ Break</span><span style={{fontSize:13,fontWeight:800,color:"#f59e0b",fontFamily:"monospace"}}>{breakDisplay}</span></div>}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                {[{l:"Transfers",v:perf.deals||0,c:color},{l:"Attend.",v:`${attRate}%`,c:attRate>=90?"#10b981":attRate>=70?"#f59e0b":"#ef4444"}].map(m=><div key={m.l} style={{background:"#0f1117",borderRadius:7,padding:"7px 9px"}}><div style={{fontSize:9,color:"#4b5a78"}}>{m.l}</div><div style={{fontSize:14,fontWeight:800,color:m.c,marginTop:1}}>{m.v}</div></div>)}
              </div>
              <div style={{marginTop:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontSize:9,color:"#4b5a78"}}>TARGET</span><span style={{fontSize:10,fontWeight:700,color:att>=100?"#10b981":att>=70?"#f59e0b":"#ef4444"}}>{att}%</span></div><div style={{height:4,background:"#1e2535",borderRadius:99}}><div style={{height:"100%",width:`${Math.min(att,100)}%`,background:att>=100?"#10b981":att>=70?"#f59e0b":"#ef4444",borderRadius:99}}/></div></div>
            </div>
          );
        })}
        {campAgents.length===0&&<div style={{...s.card,textAlign:"center",color:"#4b5a78"}}><div style={{fontSize:28,marginBottom:8}}>👥</div><div>No agents assigned.</div></div>}
      </div>
      <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>📊 Performance</div>
      <div style={s.card}><table style={s.table}>
        <thead><tr>{["Agent","Transfers","Target","Attainment","Attendance"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
        <tbody>{campAgents.map(agent=>{
          const perf=performance[agent.id]||{};const att=Math.round(((perf.deals||0)/(agent.target||40))*100);
          const attRecs=attendance[agent.id]||[];const present=attRecs.filter(r=>r.status==="Present"||r.status==="Late").length;
          const attRate=attRecs.length?Math.round((present/attRecs.length)*100):0;
          return(<tr key={agent.id}>
            <td style={s.td}><div style={{display:"flex",alignItems:"center",gap:8}}><ProfilePic user={agent} size={26}/><div style={{fontWeight:600,color:"#fff",fontSize:13}}>{agent.name}</div></div></td>
            <td style={s.td}><span style={{fontWeight:800,color:color,fontSize:16}}>{perf.deals||0}</span></td>
            <td style={s.td}>{agent.target}</td>
            <td style={s.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:"#1e2535",borderRadius:99}}><div style={{height:"100%",width:`${Math.min(att,100)}%`,background:att>=100?"#10b981":att>=70?"#f59e0b":"#ef4444",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:att>=100?"#10b981":"#f59e0b"}}>{att}%</span></div></td>
            <td style={s.td}><span style={{fontSize:13,fontWeight:600,color:attRate>=90?"#10b981":attRate>=70?"#f59e0b":"#ef4444"}}>{attRate}%</span></td>
          </tr>);
        })}</tbody>
      </table></div>
    </div>
  );
}

export default function CRM(){
  const[currentUser,setCurrentUser]=useState(null);
  const[currentCampaign,setCurrentCampaign]=useState(null);
  const[activeTab,setActiveTab]=useState("dashboard");
  const[campaigns,setCampaigns]=useState([]);
  const[allUsers,setAllUsers]=useState([]);
  const[leads,setLeads]=useState([]);
  const[attendance,setAttendance]=useState({});
  const[performance,setPerformance]=useState({});
  const[agentStatuses,setAgentStatuses]=useState({});
  const[myStatus,setMyStatus]=useState("Online");
  const[breakStart,setBreakStart]=useState(null);
  const[breakElapsed,setBreakElapsed]=useState(0);
  const[clockedIn,setClockedIn]=useState(false);
  const[clockTime,setClockTime]=useState(null);
  const[addLeadOpen,setAddLeadOpen]=useState(false);
  const[newLead,setNewLead]=useState({name:"",contact:"",email:"",phone:"",status:"New",value:"",notes:"",assignedTo:""});
  const[leadModal,setLeadModal]=useState(null);
  const[aiInsight,setAiInsight]=useState("");
  const[aiLoading,setAiLoading]=useState(false);
  const[currentTime,setCurrentTime]=useState(new Date());
  const[showNotif,setShowNotif]=useState(false);
  const[appLoading,setAppLoading]=useState(true);

  useEffect(()=>{const t=setInterval(()=>setCurrentTime(new Date()),1000);return()=>clearInterval(t);},[]);

  useEffect(()=>{
    if(myStatus==="On Break"&&breakStart){const t=setInterval(()=>setBreakElapsed(Math.floor((Date.now()-breakStart)/1000)),1000);return()=>clearInterval(t);}
    else{setBreakElapsed(0);setBreakStart(null);}
  },[myStatus,breakStart]);

  const handleSetStatus=(st)=>{setMyStatus(st);if(st==="On Break")setBreakStart(Date.now());else{setBreakStart(null);setBreakElapsed(0);}};
  const fmt=(secs)=>`${Math.floor(secs/60).toString().padStart(2,"0")}:${(secs%60).toString().padStart(2,"0")}`;

  const refreshUsers=useCallback(async()=>{const d=await db.get("users","order=id.asc&select=*");setAllUsers(d||[]);},[]);

  const loadData=useCallback(async()=>{
    setAppLoading(true);
    const[camps,usersData,leadsData,attData,perfData,statusData]=await Promise.all([
      db.get("campaigns","order=id.asc"),
      db.get("users","order=id.asc&select=*"),
      db.get("leads","order=id.desc&select=*"),
      db.get("attendance","order=date.desc&select=*"),
      db.get("performance","select=*"),
      db.get("agent_statuses","select=*"),
    ]);
    setCampaigns(Array.isArray(camps)?camps:[]);
    setAllUsers(Array.isArray(usersData)?usersData:[]);
    setLeads(Array.isArray(leadsData)?leadsData:[]);
    const attMap={};(Array.isArray(attData)?attData:[]).forEach(r=>{if(!attMap[r.user_id])attMap[r.user_id]=[];attMap[r.user_id].push(r);});setAttendance(attMap);
    const perfMap={};(Array.isArray(perfData)?perfData:[]).forEach(p=>{perfMap[p.user_id]=p;});setPerformance(perfMap);
    const statusMap={};(Array.isArray(statusData)?statusData:[]).forEach(s=>{statusMap[s.user_id]=s;});setAgentStatuses(statusMap);
    setAppLoading(false);
  },[]);

  useEffect(()=>{loadData();},[loadData]);

  useEffect(()=>{
    if(!currentUser)return;
    const broadcast=async()=>{
      await db.upsert("agent_statuses",{user_id:currentUser.id,status:myStatus,name:currentUser.name,avatar:currentUser.avatar,updated_at:new Date().toISOString(),break_started:myStatus==="On Break"&&breakStart?new Date(breakStart).toISOString():null},"user_id");
      const d=await db.get("agent_statuses","select=*");const m={};(Array.isArray(d)?d:[]).forEach(s=>{m[s.user_id]=s;});setAgentStatuses(m);
    };
    broadcast();const t=setInterval(broadcast,10000);return()=>clearInterval(t);
  },[currentUser,myStatus,breakStart]);

  const handleLogin=(user,campaign)=>{setCurrentUser(user);setCurrentCampaign(campaign);setMyStatus("Online");setActiveTab("dashboard");};
  const handleLogout=async()=>{
    if(currentUser)await db.upsert("agent_statuses",{user_id:currentUser.id,status:"Offline",name:currentUser.name,avatar:currentUser.avatar,updated_at:new Date().toISOString()},"user_id");
    setCurrentUser(null);setCurrentCampaign(null);setClockedIn(false);setClockTime(null);setMyStatus("Online");
  };
  const handleClockIn=async()=>{
    const now=currentTime.toTimeString().slice(0,5);
    const[h,m]=now.split(":").map(Number);const mins=h*60+m;
    const status=(mins>=1380&&mins<=1395)||mins<480?"Present":"Late";
    setClockedIn(true);setClockTime(now);
    await db.post("attendance",{user_id:currentUser.id,date:today,time_in:now,status});loadData();
  };
  const handleClockOut=async()=>{
    const now=currentTime.toTimeString().slice(0,5);setClockedIn(false);
    const myAtt=await db.get("attendance",`user_id=eq.${currentUser.id}&date=eq.${today}&order=id.desc&limit=1`);
    if(myAtt&&myAtt.length>0)await db.patch("attendance",`id=eq.${myAtt[0].id}`,{time_out:now});loadData();
  };
  const refreshAll=useCallback(async()=>{await loadData();},[loadData]);

  const getAiInsight=async()=>{
    setAiLoading(true);setAiInsight("");
    const totalT=Object.values(performance).reduce((s,p)=>s+(p.deals||0),0);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:`CRM analyst. ${campaigns.length} campaigns, ${totalT} total transfers, ${leads.length} leads, ${allUsers.filter(u=>u.role==="agent").length} agents. Per campaign: ${campaigns.map(c=>{const ags=allUsers.filter(u=>u.campaign_id===c.id);const t=ags.reduce((s,a)=>(performance[a.id]?.deals||0)+s,0);return`${c.name}: ${t} transfers, ${ags.length} agents`;}).join("; ")}. Give 3-4 sentence insight + 2 recommendations. Be direct.`}]})});
      const data=await res.json();setAiInsight(data.content?.[0]?.text||"No insight.");
    }catch{setAiInsight("Could not load AI insight.");}
    setAiLoading(false);
  };

  if(!currentUser)return<AuthPage onLogin={handleLogin} campaigns={campaigns}/>;
  if(appLoading)return(<div style={{...s.app,alignItems:"center",justifyContent:"center"}}><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/><div style={{textAlign:"center",color:"#4b5a78"}}><div style={{fontSize:36,marginBottom:12}}>⚡</div><div style={{fontSize:16,fontWeight:700,color:"#fff"}}>TeamCRM</div><div style={{marginTop:8}}>Connecting...</div></div></div>);

  const isAdmin=currentUser.role==="admin";
  const agents=allUsers.filter(u=>u.role==="agent");
  const campaignId=isAdmin?null:currentUser.campaign_id;
  const myLeads=leads.filter(l=>l.assigned_to===currentUser.id);
  const myAtt=attendance[currentUser.id]||[];
  const myPerf=performance[currentUser.id]||{};
  const totalTransfers=Object.values(performance).reduce((s,p)=>s+(p.deals||0),0);
  const statusDot={Online:"#10b981","On Break":"#f59e0b",Offline:"#ef4444"};

  const campTabKeys=campaigns.map(c=>`camp_${c.id}`);
  const adminCoreTabs=["dashboard","realtime","leads","transfers","attendance","performance","coaching","automations","board","scripts","newsletter","campaigns","users","settings"];
  const adminTabs=[...campTabKeys,...adminCoreTabs];
  const agentTabs=["dashboard","my-leads","my-attendance","my-performance","transfers","coaching","board","scripts","newsletter","settings"];
  const tabs=isAdmin?adminTabs:agentTabs;

  const tabLabels={
    dashboard:"Dashboard",realtime:"Live Monitor",leads:"Leads",transfers:"Transfers",
    attendance:"Attendance",performance:"Performance",coaching:"Coaching",automations:"Automations",
    board:"Freedom Board",scripts:"Scripts Library",newsletter:"Newsletter",campaigns:"Campaigns",
    users:"User Management",settings:"My Profile",
    "my-leads":"My Leads","my-attendance":"My Attendance","my-performance":"My Performance",
    ...Object.fromEntries(campaigns.map(c=>[`camp_${c.id}`,c.name]))
  };
  const tabIcons={
    dashboard:"📊",realtime:"🟢",leads:"🎯",transfers:"🔄",attendance:"🕐",performance:"📈",
    coaching:"🎓",automations:"⚙️",board:"📌",scripts:"📋",newsletter:"📰",campaigns:"🏢",
    users:"👤",settings:"⚙️","my-leads":"🎯","my-attendance":"🕐","my-performance":"📈",
    ...Object.fromEntries(campaigns.map(c=>[`camp_${c.id}`,"🏢"]))
  };

  const renderContent=()=>{
    const statusDot={Online:"#10b981","On Break":"#f59e0b",Offline:"#ef4444"};
    // Campaign overview tabs
    if(activeTab.startsWith("camp_")){
      const campId=parseInt(activeTab.replace("camp_",""));
      const camp=campaigns.find(c=>c.id===campId);
      if(!camp)return null;
      return<CampaignOverview campaign={camp} campaigns={campaigns} allUsers={allUsers} performance={performance} attendance={attendance} agentStatuses={agentStatuses} leads={leads}/>;
    }
    if(activeTab==="board")return<FreedomBoard currentUser={currentUser} isAdmin={isAdmin} campaignId={campaignId}/>;
    if(activeTab==="scripts")return<ScriptsLibrary isAdmin={isAdmin} currentUser={currentUser} campaignId={campaignId}/>;
    if(activeTab==="transfers")return<TransferredLeads currentUser={currentUser} allUsers={allUsers} isAdmin={isAdmin} performance={performance} setPerformance={setPerformance} campaignId={campaignId}/>;
    if(activeTab==="coaching")return<CoachingSessions currentUser={currentUser} allUsers={allUsers} isAdmin={isAdmin} campaignId={campaignId}/>;
    if(activeTab==="newsletter")return<Newsletter isAdmin={isAdmin} currentUser={currentUser}/>;
    if(activeTab==="campaigns")return<CampaignManager campaigns={campaigns} allUsers={allUsers} refreshAll={refreshAll}/>;
    if(activeTab==="users")return isAdmin?<UserManagement currentUser={currentUser} refreshUsers={refreshUsers} allUsers={allUsers} campaigns={campaigns}/>:<div style={{textAlign:"center",padding:80,color:"#4b5a78"}}><div style={{fontSize:40}}>🔒</div><div style={{marginTop:12}}>Admin only.</div></div>;
    if(activeTab==="settings")return<ProfileSettings currentUser={currentUser} allUsers={allUsers} refreshUsers={refreshUsers} onLogout={handleLogout} campaigns={campaigns}/>;

    if(activeTab==="realtime"){
      const now=Date.now();
      const statusDot={Online:"#10b981","On Break":"#f59e0b",Offline:"#ef4444"};
      return(
        <div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",marginBottom:4}}>🟢 Live Monitor</div>
          <div style={{fontSize:13,color:"#4b5a78",marginBottom:20}}>Real-time agent status · refreshes every 10s</div>
          <div style={s.grid4}>
            {[{l:"Online",v:agents.filter(a=>{const st=agentStatuses[a.id];return st&&st.status==="Online"&&(now-new Date(st.updated_at).getTime())<30000;}).length,c:"#10b981",i:"🟢"},{l:"On Break",v:agents.filter(a=>{const st=agentStatuses[a.id];return st&&st.status==="On Break"&&(now-new Date(st.updated_at).getTime())<30000;}).length,c:"#f59e0b",i:"🟡"},{l:"Offline",v:agents.filter(a=>{const st=agentStatuses[a.id];return !st||st.status==="Offline"||(now-new Date(st.updated_at).getTime())>=30000;}).length,c:"#ef4444",i:"🔴"},{l:"Total",v:agents.length,c:"#60a5fa",i:"👥"}].map((stat,i)=><div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:6}}>{stat.i}</div><div style={{fontSize:28,fontWeight:800,color:stat.c}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>)}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {agents.map(agent=>{
              const st=agentStatuses[agent.id];const isRecent=st&&(now-new Date(st.updated_at).getTime())<30000;
              const status=isRecent?st.status:"Offline";
              const todayAtt=(attendance[agent.id]||[]).find(r=>r.date===today);
              const perf=performance[agent.id]||{};
              const camp=campaigns.find(c=>c.id===agent.campaign_id);
              const cColor=camp?cc(campaigns,camp.id):"#4b5a78";
              let breakDisplay=null;
              if(status==="On Break"&&st?.break_started){const bs=Math.floor((now-new Date(st.break_started).getTime())/1000);breakDisplay=`${Math.floor(bs/60).toString().padStart(2,"0")}:${(bs%60).toString().padStart(2,"0")}`;}
              return(
                <div key={agent.id} style={{background:"#161b27",borderRadius:14,border:`1px solid ${status==="Online"?"#10b98144":status==="On Break"?"#f59e0b44":"#1e2535"}`,padding:16}}>
                  <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                    <div style={{position:"relative"}}><ProfilePic user={agent} size={38}/><div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:statusDot[status]||"#ef4444",border:"2px solid #161b27"}}/></div>
                    <div style={{flex:1}}><div style={{fontWeight:700,color:"#fff",fontSize:13}}>{agent.name}</div>{camp&&<span style={s.badge(cColor)}>{camp.name}</span>}</div>
                    <span style={s.badge(statusDot[status]||"#ef4444")}>{status}</span>
                  </div>
                  {status==="On Break"&&breakDisplay&&<div style={{background:"#f59e0b22",border:"1px solid #f59e0b55",borderRadius:7,padding:"4px 10px",marginBottom:7,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:11,color:"#f59e0b"}}>⏱️ Break</span><span style={{fontSize:13,fontWeight:800,color:"#f59e0b",fontFamily:"monospace"}}>{breakDisplay}</span></div>}
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {[{l:"Att.",v:todayAtt?.status||"Not in",c:todayAtt?attColors[todayAtt.status]:"#ef4444"},{l:"In",v:todayAtt?.time_in||"—",c:"#c8d4e8"},{l:"Transfers",v:perf.deals||0,c:cColor},{l:"Active",v:isRecent?"Yes":"No",c:isRecent?"#10b981":"#4b5a78"}].map(m=><div key={m.l} style={{background:"#0f1117",borderRadius:6,padding:"6px 8px"}}><div style={{fontSize:9,color:"#4b5a78"}}>{m.l}</div><div style={{fontSize:12,fontWeight:700,color:m.c,marginTop:1}}>{m.v}</div></div>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if(isAdmin){
      if(activeTab==="dashboard")return(
        <div>
          <div style={s.grid4}>
            {[{l:"Total Transfers",v:totalTransfers,c:"#10b981",i:"🔄"},{l:"Active Leads",v:leads.filter(l=>l.status!=="Closed Lost").length,c:"#60a5fa",i:"🎯"},{l:"Campaigns",v:campaigns.length,c:"#8b5cf6",i:"🏢"},{l:"Total Agents",v:agents.length,c:"#f59e0b",i:"👥"}].map((stat,i)=>(
              <div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:8}}>{stat.i}</div><div style={{fontSize:28,fontWeight:800,color:stat.c}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>
            ))}
          </div>
          <div style={s.card}>
            <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>📈 Team Transfer Trend</div>
            <div style={{fontSize:12,color:"#4b5a78",marginBottom:10}}>All campaigns combined</div>
            <LineChart data={trendData} color="#10b981" valueKey="deals"/>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>{trendData.map((d,i)=><span key={i} style={{fontSize:10,color:"#4b5a78",flex:1,textAlign:"center"}}>{d.day}</span>)}</div>
          </div>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>📊 Campaign Breakdown <span style={{fontSize:12,color:"#4b5a78",fontWeight:400}}>(click to view details)</span></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginBottom:20}}>
            {campaigns.map((camp,idx)=>{
              const color=CAMP_COLORS[idx%CAMP_COLORS.length];
              const cAgents=agents.filter(a=>a.campaign_id===camp.id);
              const cTransfers=cAgents.reduce((s,a)=>(performance[a.id]?.deals||0)+s,0);
              const presentToday=cAgents.filter(a=>(attendance[a.id]||[]).find(r=>r.date===today&&(r.status==="Present"||r.status==="Late"))).length;
              const nowMs=Date.now();
              const onlineNow=cAgents.filter(a=>{const st=agentStatuses[a.id];return st&&st.status!=="Offline"&&(nowMs-new Date(st.updated_at).getTime())<30000;}).length;
              return(
                <div key={camp.id} onClick={()=>setActiveTab(`camp_${camp.id}`)} style={{background:"#161b27",borderRadius:14,border:`2px solid ${color}44`,padding:18,cursor:"pointer"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div style={{width:10,height:10,borderRadius:"50%",background:color}}/><div style={{fontSize:15,fontWeight:800,color:"#fff"}}>{camp.name}</div></div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                    {[{l:"Transfers",v:cTransfers,c:color},{l:"Agents",v:cAgents.length,c:"#60a5fa"},{l:"Present",v:presentToday,c:"#10b981"},{l:"Online",v:onlineNow,c:"#10b981"}].map(m=><div key={m.l} style={{background:"#0f1117",borderRadius:7,padding:"8px 9px"}}><div style={{fontSize:9,color:"#4b5a78"}}>{m.l}</div><div style={{fontSize:16,fontWeight:800,color:m.c,marginTop:1}}>{m.v}</div></div>)}
                  </div>
                  <div style={{marginTop:10,fontSize:11,color:"#4b5a78",textAlign:"right"}}>View details →</div>
                </div>
              );
            })}
            {campaigns.length===0&&<div style={{...s.card,textAlign:"center",color:"#4b5a78"}}><div style={{fontSize:28,marginBottom:8}}>🏢</div><div>No campaigns yet. Go to Campaigns tab to create one.</div></div>}
          </div>
          <div style={s.card}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><div style={{fontSize:14,fontWeight:700,color:"#fff"}}>🤖 AI Team Insight</div><button style={s.btn("secondary")} onClick={getAiInsight} disabled={aiLoading}>{aiLoading?"Analyzing...":"Generate Insight"}</button></div>
            {aiInsight?<div style={{fontSize:13,color:"#c8d4e8",lineHeight:1.8,background:"#0f1117",borderRadius:10,padding:"14px 18px"}}>{aiInsight}</div>:<div style={{fontSize:13,color:"#4b5a78"}}>Click "Generate Insight" for AI-powered analysis across all campaigns.</div>}
          </div>
        </div>
      );
      if(activeTab==="leads")return(
        <div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><div style={{fontSize:13,color:"#4b5a78"}}>{leads.length} leads</div><button style={s.btn("primary")} onClick={()=>setAddLeadOpen(true)}>+ Add Lead</button></div>
          <div style={s.card}><table style={s.table}><thead><tr>{["Company","Contact","Campaign","Status","Assigned","Value","Date",""].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{leads.map(lead=>{const agent=allUsers.find(u=>u.id===lead.assigned_to);const camp=campaigns.find(c=>c.id===agent?.campaign_id);const cColor=camp?cc(campaigns,camp.id):"#4b5a78";return(
              <tr key={lead.id} style={{cursor:"pointer"}} onClick={()=>setLeadModal(lead)}>
                <td style={s.td}><span style={{fontWeight:600,color:"#fff"}}>{lead.name}</span></td>
                <td style={s.td}>{lead.contact}</td>
                <td style={s.td}>{camp?<span style={s.badge(cColor)}>{camp.name}</span>:<span style={{color:"#4b5a78"}}>—</span>}</td>
                <td style={s.td}><span style={s.badge(statusColors[lead.status]||"#4b5a78")}>{lead.status}</span></td>
                <td style={s.td}>{agent?.name||"—"}</td>
                <td style={s.td}><span style={{color:"#10b981",fontWeight:600}}>₱{(lead.value||0).toLocaleString()}</span></td>
                <td style={s.td}>{lead.date}</td>
                <td style={s.td} onClick={async e=>{e.stopPropagation();await db.del("leads",`id=eq.${lead.id}`);loadData();}}><span style={{color:"#ef4444",fontSize:12,cursor:"pointer"}}>Remove</span></td>
              </tr>
            );})}</tbody>
          </table></div>
        </div>
      );
      if(activeTab==="attendance")return(
        <div style={s.card}><table style={s.table}>
          <thead><tr>{["Agent","Campaign","Date","Status","In","Out"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{agents.flatMap(agent=>{const recs=attendance[agent.id]||[];const camp=campaigns.find(c=>c.id===agent.campaign_id);const cColor=camp?cc(campaigns,camp.id):"#4b5a78";return recs.slice(0,3).map((r,i)=>(
            <tr key={`${agent.id}-${i}`}>
              {i===0&&<td style={{...s.td,verticalAlign:"top"}} rowSpan={Math.min(recs.length,3)}><div style={{display:"flex",alignItems:"center",gap:8}}><ProfilePic user={agent} size={26}/><span style={{fontWeight:600,color:"#fff",fontSize:12}}>{agent.name}</span></div></td>}
              {i===0&&<td style={{...s.td,verticalAlign:"top"}} rowSpan={Math.min(recs.length,3)}>{camp?<span style={s.badge(cColor)}>{camp.name}</span>:<span style={{color:"#4b5a78"}}>—</span>}</td>}
              <td style={s.td}>{r.date}</td>
              <td style={s.td}><span style={s.badge(attColors[r.status]||"#4b5a78")}>{r.status}</span></td>
              <td style={s.td}>{r.time_in||"—"}</td>
              <td style={s.td}>{r.time_out||"—"}</td>
            </tr>
          ));})}</tbody>
        </table></div>
      );
      if(activeTab==="performance")return(
        <div style={s.card}><table style={s.table}>
          <thead><tr>{["Agent","Campaign","Transfers","Target","Attainment","Attendance"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
          <tbody>{agents.map(agent=>{
            const perf=performance[agent.id]||{};const att=Math.round(((perf.deals||0)/(agent.target||40))*100);
            const attRecs=attendance[agent.id]||[];const present=attRecs.filter(r=>r.status==="Present"||r.status==="Late").length;
            const attRate=attRecs.length?Math.round((present/attRecs.length)*100):0;
            const camp=campaigns.find(c=>c.id===agent.campaign_id);const cColor=camp?cc(campaigns,camp.id):"#4b5a78";
            return(<tr key={agent.id}>
              <td style={s.td}><div style={{display:"flex",alignItems:"center",gap:8}}><ProfilePic user={agent} size={28}/><div><div style={{fontWeight:600,color:"#fff"}}>{agent.name}</div><div style={{fontSize:10,color:"#4b5a78"}}>{agent.department}</div></div></div></td>
              <td style={s.td}>{camp?<span style={s.badge(cColor)}>{camp.name}</span>:<span style={{color:"#4b5a78"}}>—</span>}</td>
              <td style={s.td}><span style={{fontWeight:800,color:"#10b981",fontSize:16}}>{perf.deals||0}</span></td>
              <td style={s.td}>{agent.target}</td>
              <td style={s.td}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:6,background:"#1e2535",borderRadius:99}}><div style={{height:"100%",width:`${Math.min(att,100)}%`,background:att>=100?"#10b981":att>=70?"#f59e0b":"#ef4444",borderRadius:99}}/></div><span style={{fontSize:12,fontWeight:700,color:att>=100?"#10b981":"#f59e0b"}}>{att}%</span></div></td>
              <td style={s.td}><span style={{fontWeight:600,color:attRate>=90?"#10b981":attRate>=70?"#f59e0b":"#ef4444"}}>{attRate}%</span></td>
            </tr>);
          })}</tbody>
        </table></div>
      );
      if(activeTab==="automations")return(<div>{[{icon:"📧",name:"Follow-up Reminder",desc:"Auto-remind agents when a lead hasn't been contacted in 3 days",status:"Active"},{icon:"⚠️",name:"Late Attendance Alert",desc:"Notify admin when agent clocks in after 11:15 PM",status:"Active"},{icon:"🏆",name:"Transfer Success",desc:"Notify when a transfer is marked successful",status:"Active"},{icon:"📊",name:"Weekly Report",desc:"Send performance summary every Monday 8AM",status:"Active"},{icon:"🔁",name:"Lead Reassignment",desc:"Auto-reassign leads if agent is absent 2+ days",status:"Inactive"}].map((r,i)=>(
        <div key={i} style={{...s.card,display:"flex",alignItems:"center",gap:16}}><div style={{fontSize:28}}>{r.icon}</div><div style={{flex:1}}><div style={{fontWeight:700,color:"#fff",fontSize:14}}>{r.name}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:3}}>{r.desc}</div></div><span style={s.badge(r.status==="Active"?"#10b981":"#4b5a78")}>{r.status}</span></div>
      ))}</div>);
    } else {
      if(activeTab==="dashboard")return(
        <div>
          <div style={{...s.card,display:"flex",alignItems:"center",gap:20,marginBottom:20,flexWrap:"wrap"}}>
            <ProfilePic user={allUsers.find(u=>u.id===currentUser.id)||currentUser} size={56}/>
            <div style={{flex:1}}>
              <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>Welcome, {currentUser.name.split(" ")[0]}!</div>
              {currentCampaign&&<div style={{marginTop:4}}><span style={s.badge(cc(campaigns,currentCampaign.id))}>🏢 {currentCampaign.name}</span></div>}
              <div style={{fontSize:13,color:"#4b5a78",marginTop:4}}>{currentTime.toLocaleDateString("en-PH",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div>
              <div style={{fontSize:20,fontWeight:700,color:"#60a5fa",marginTop:4}}>{currentTime.toLocaleTimeString()}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,alignItems:"flex-end"}}>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{["Online","On Break","Offline"].map(st=><button key={st} onClick={()=>handleSetStatus(st)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${myStatus===st?statusDot[st]:"#1e2535"}`,background:myStatus===st?statusDot[st]+"22":"transparent",cursor:"pointer",fontSize:11,fontWeight:600,color:myStatus===st?statusDot[st]:"#4b5a78"}}>{st==="Online"?"🟢":st==="On Break"?"🟡":"🔴"} {st}</button>)}</div>
              {myStatus==="On Break"&&<div style={{background:"#f59e0b22",border:"1px solid #f59e0b",borderRadius:10,padding:"5px 14px",fontSize:13,fontWeight:700,color:"#f59e0b"}}>⏱️ {fmt(breakElapsed)}</div>}
              <div>{!clockedIn?<button style={{...s.btn("success"),background:"#10b981"}} onClick={handleClockIn}>🟢 Clock In</button>:<button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
            </div>
          </div>
          {clockedIn&&<div style={{...s.card,background:"#0d2a1a",borderColor:"#10b981",marginBottom:20}}><div style={{fontSize:13,color:"#10b981"}}>✅ Clocked in at <strong>{clockTime}</strong>. Have a great day!</div></div>}
          <div style={s.grid4}>{[{l:"My Transfers",v:myPerf.deals||0,i:"🔄"},{l:"Calls",v:myPerf.calls||0,i:"📞"},{l:"My Leads",v:myLeads.length,i:"🎯"},{l:"Tasks",v:myPerf.tasks||0,i:"✅"}].map((stat,i)=><div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:6}}>{stat.i}</div><div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>)}</div>
          <div style={s.card}><div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:14}}>My Leads</div>
            <table style={s.table}><thead><tr>{["Company","Status","Value","Notes"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
              <tbody>{myLeads.map(lead=><tr key={lead.id}><td style={s.td}><span style={{fontWeight:600,color:"#fff"}}>{lead.name}</span></td><td style={s.td}><span style={s.badge(statusColors[lead.status]||"#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{color:"#10b981",fontWeight:600}}>₱{(lead.value||0).toLocaleString()}</span></td><td style={s.td}>{lead.notes}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      );
      if(activeTab==="my-leads")return<div style={s.card}><table style={s.table}><thead><tr>{["Company","Contact","Status","Value"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead><tbody>{myLeads.map(lead=><tr key={lead.id}><td style={s.td}><span style={{fontWeight:600,color:"#fff"}}>{lead.name}</span></td><td style={s.td}>{lead.contact}</td><td style={s.td}><span style={s.badge(statusColors[lead.status]||"#4b5a78")}>{lead.status}</span></td><td style={s.td}><span style={{color:"#10b981",fontWeight:600}}>₱{(lead.value||0).toLocaleString()}</span></td></tr>)}</tbody></table></div>;
      if(activeTab==="my-attendance")return(
        <div style={s.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>My Attendance</div>
            <div>{!clockedIn?<button style={{...s.btn("success"),background:"#10b981"}} onClick={handleClockIn}>🟢 Clock In</button>:<button style={s.btn("danger")} onClick={handleClockOut}>🔴 Clock Out</button>}</div>
          </div>
          <table style={s.table}><thead><tr>{["Date","Status","In","Out"].map(h=><th key={h} style={s.th}>{h}</th>)}</tr></thead>
            <tbody>{[...myAtt].sort((a,b)=>b.date?.localeCompare(a.date)).map((r,i)=><tr key={i}><td style={s.td}>{r.date}</td><td style={s.td}><span style={s.badge(attColors[r.status]||"#4b5a78")}>{r.status}</span></td><td style={s.td}>{r.time_in||"—"}</td><td style={s.td}>{r.time_out||"—"}</td></tr>)}</tbody>
          </table>
        </div>
      );
      if(activeTab==="my-performance"){
        const att=Math.round(((myPerf.deals||0)/(currentUser.target||40))*100);
        return<div><div style={s.grid4}>{[{l:"Transfers",v:myPerf.deals||0,i:"🔄"},{l:"Calls",v:myPerf.calls||0,i:"📞"},{l:"Tasks",v:myPerf.tasks||0,i:"✅"}].map((stat,i)=><div key={i} style={s.statCard}><div style={{fontSize:22,marginBottom:6}}>{stat.i}</div><div style={{fontSize:28,fontWeight:800,color:"#fff"}}>{stat.v}</div><div style={{fontSize:12,color:"#4b5a78",marginTop:4}}>{stat.l}</div></div>)}</div>
          <div style={s.card}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:14,fontWeight:700,color:"#fff"}}>Target Attainment</span><span style={{fontSize:20,fontWeight:800,color:att>=100?"#10b981":"#f59e0b"}}>{att}%</span></div><div style={{height:12,background:"#1e2535",borderRadius:99}}><div style={{height:"100%",width:`${Math.min(att,100)}%`,background:att>=100?"#10b981":att>=70?"#f59e0b":"#ef4444",borderRadius:99}}/></div><div style={{fontSize:12,color:"#4b5a78",marginTop:6}}>{myPerf.deals||0} of {currentUser.target||40} transfers</div></div></div>;
      }
    }
    return null;
  };

  return(
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={s.sidebar}>
        <div style={{padding:"20px 16px 16px",borderBottom:"1px solid #1e2535"}}>
          <div style={{fontSize:17,fontWeight:800,color:"#fff"}}>⚡ TeamCRM</div>
          <div style={{fontSize:11,color:"#4b5a78",marginTop:2}}>{isAdmin?"Admin Panel":currentCampaign?.name||"Agent Portal"}</div>
        </div>
        <div style={s.nav}>
          {isAdmin&&campaigns.length>0&&(
            <div style={{marginBottom:6}}>
              <div style={{fontSize:10,fontWeight:700,color:"#4b5a78",padding:"6px 12px 4px",textTransform:"uppercase",letterSpacing:1}}>📊 Campaigns</div>
              {campaigns.map((c,idx)=>{const color=CAMP_COLORS[idx%CAMP_COLORS.length];const tabKey=`camp_${c.id}`;return<div key={tabKey} style={s.navItem(activeTab===tabKey,color)} onClick={()=>setActiveTab(tabKey)}><div style={{width:8,height:8,borderRadius:"50%",background:color,flexShrink:0}}/><span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span></div>;})}
              <div style={{height:1,background:"#1e2535",margin:"6px 4px 8px"}}/>
            </div>
          )}
          {tabs.filter(t=>!t.startsWith("camp_")).map(tab=><div key={tab} style={s.navItem(activeTab===tab)} onClick={()=>setActiveTab(tab)}><span style={{fontSize:14,width:20,textAlign:"center"}}>{tabIcons[tab]}</span>{tabLabels[tab]}</div>)}
        </div>
        <div style={{padding:"14px 12px",borderTop:"1px solid #1e2535"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{position:"relative"}}><ProfilePic user={allUsers.find(u=>u.id===currentUser.id)||currentUser} size={30}/><div style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:statusDot[myStatus]||"#ef4444",border:"2px solid #161b27"}}/></div>
            <div style={{flex:1,overflow:"hidden"}}><div style={{fontSize:12,fontWeight:600,color:"#c8d4e8",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{currentUser.name}</div><div style={{fontSize:10,color:statusDot[myStatus]||"#4b5a78"}}>● {isAdmin?"Admin":myStatus}</div></div>
            <button onClick={handleLogout} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:15,color:"#4b5a78"}}>🚪</button>
          </div>
        </div>
      </div>
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={{fontSize:17,fontWeight:700,color:"#fff",display:"flex",alignItems:"center",gap:10}}>
            {activeTab.startsWith("camp_")&&(()=>{const c=campaigns.find(camp=>camp.id===parseInt(activeTab.replace("camp_","")));const color=c?cc(campaigns,c.id):"#3b82f6";return c?<><div style={{width:10,height:10,borderRadius:"50%",background:color}}/>{c.name}</>:null;})()}
            {!activeTab.startsWith("camp_")&&tabLabels[activeTab]}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:13,color:"#4b5a78"}}>{currentTime.toLocaleTimeString()}</div>
            <div style={{position:"relative"}}>
              <button style={{...s.btn("ghost"),padding:"7px 12px"}} onClick={()=>setShowNotif(!showNotif)}>🔔 <span style={{background:"#ef4444",color:"#fff",borderRadius:99,fontSize:10,padding:"1px 5px"}}>3</span></button>
              {showNotif&&<div style={{position:"absolute",right:0,top:42,width:280,background:"#161b27",border:"1px solid #1e2535",borderRadius:12,padding:12,zIndex:50}}>{[{t:"Transfer pending review",type:"warning"},{t:"Follow-up due today",type:"info"},{t:"Coaching session added",type:"success"}].map((n,i)=><div key={i} style={{padding:"8px 0",borderBottom:"1px solid #0f1117",fontSize:12,color:"#c8d4e8"}}>{n.type==="warning"?"⚠️":n.type==="success"?"✅":"ℹ️"} {n.t}</div>)}</div>}
            </div>
          </div>
        </div>
        <div style={s.content}>{renderContent()}</div>
      </div>

      {leadModal&&<div style={s.modal} onClick={()=>setLeadModal(null)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><div style={{fontSize:17,fontWeight:800,color:"#fff"}}>{leadModal.name}</div><button style={s.btn("ghost")} onClick={()=>setLeadModal(null)}>✕</button></div>
        {[["Contact",leadModal.contact],["Email",leadModal.email],["Phone",leadModal.phone],["Status",leadModal.status],["Value",`₱${(leadModal.value||0).toLocaleString()}`],["Assigned To",allUsers.find(u=>u.id===leadModal.assigned_to)?.name||"—"],["Date",leadModal.date],["Notes",leadModal.notes]].map(([k,v])=><div key={k} style={{marginBottom:12}}><div style={s.label}>{k}</div><div style={{fontSize:13,color:"#c8d4e8"}}>{v||"—"}</div></div>)}
      </div></div>}

      {addLeadOpen&&<div style={s.modal} onClick={()=>setAddLeadOpen(false)}><div style={s.mbox} onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:800,color:"#fff",marginBottom:20}}>Add New Lead</div>
        {[["Company","name","text"],["Contact","contact","text"],["Email","email","email"],["Phone","phone","text"],["Value (₱)","value","number"],["Notes","notes","text"]].map(([label,field,type])=><div key={field} style={{marginBottom:14}}><label style={s.label}>{label}</label><input style={s.input} type={type} value={newLead[field]||""} onChange={e=>setNewLead(p=>({...p,[field]:e.target.value}))}/></div>)}
        <div style={{marginBottom:14}}><label style={s.label}>Assign To</label><select style={s.input} value={newLead.assignedTo} onChange={e=>setNewLead(p=>({...p,assignedTo:parseInt(e.target.value)}))}>
          <option value="">Select agent…</option>{agents.map(a=>{const camp=campaigns.find(c=>c.id===a.campaign_id);return<option key={a.id} value={a.id}>{a.name}{camp?` (${camp.name})`:""}</option>;})}
        </select></div>
        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button style={s.btn("secondary")} onClick={()=>setAddLeadOpen(false)}>Cancel</button>
          <button style={s.btn("primary")} onClick={async()=>{await db.post("leads",{name:newLead.name,contact:newLead.contact,email:newLead.email,phone:newLead.phone,status:"New",assigned_to:newLead.assignedTo||null,value:parseFloat(newLead.value)||0,notes:newLead.notes,date:today});setAddLeadOpen(false);setNewLead({name:"",contact:"",email:"",phone:"",status:"New",value:"",notes:"",assignedTo:""});loadData();}}>Add Lead</button>
        </div>
      </div></div>}
    </div>
  );
}