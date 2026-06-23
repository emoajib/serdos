import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * 🎓 SUPREME ADMIN CONSOLE v5.1 - FULL OPERATIONAL
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export default function AdminDashboard() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ stats: {}, activities: [], users: [], audits: [], settings: {} });
  const [saveLoading, setSaveLoading] = useState(false);
  const [knowledge, setKnowledge] = useState({ title: '', file: null, uploading: false });

  useEffect(() => { refreshData(); }, [activeTab, token]);

  const refreshData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'summary') {
        const res = await fetch(`/api/v1/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } });
        const json = await res.json();
        if (json.success) setData(p => ({ ...p, stats: json.stats, activities: json.recent_activities, audits: json.audit_logs }));
      }
      
      if (activeTab === 'users') {
        const uRes = await fetch('/api/v1/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        const uData = await uRes.json();
        if (uData.success) setData(p => ({ ...p, users: uData.users }));
      }

      if (activeTab === 'settings') {
        const sRes = await fetch('/api/v1/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } });
        const sData = await sRes.json();
        if (sData.success) setData(p => ({ ...p, settings: sData.settings }));
      }
    } catch (e) { console.error("Admin Sync Error"); }
    setLoading(false);
  };

  const handleTogglePremium = async (userId) => {
    if(!window.confirm("Ubah Status Akses Premium User Ini?")) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/toggle-premium`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if ((await res.json()).success) refreshData();
    } catch (e) { alert("Toggle Gagal"); }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data.settings)
      });
      if ((await res.json()).success) alert("Aturan Sistem Diperbarui!");
    } catch (e) { alert("Update Gagal"); }
    setSaveLoading(false);
  };

  const handleUploadKnowledge = async (e) => {
    e.preventDefault();
    if (!knowledge.title || !knowledge.file) {
      alert("Judul dan file harus diisi!");
      return;
    }

    setKnowledge(prev => ({ ...prev, uploading: true }));

    const formData = new FormData();
    formData.append('title', knowledge.title);
    formData.append('file', knowledge.file);

    try {
      const resp = await fetch('http://127.0.0.1:5000/upload-knowledge', {
        method: 'POST',
        body: formData
      });

      const result = await resp.json();
      if (resp.ok) {
        alert("Knowledge berhasil diupload!");
        setKnowledge({ title: '', file: null, uploading: false });
      } else {
        alert("Upload gagal: " + result.error);
      }
    } catch (e) {
      alert("Error: " + e.message);
    }

    setKnowledge(prev => ({ ...prev, uploading: false }));
  };

  const handleLogout = () => {
    if(window.confirm("Keluar dari Sistem Admin?")) { logout(); navigate('/login'); }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-black">
      
      {/* 🌑 COMPACT SIDEBAR */}
      <aside className="w-64 border-r border-slate-100 min-h-screen p-8 flex flex-col shrink-0">
        <div className="mb-12 border-b border-slate-50 pb-8 text-center">
           <h2 className="text-xl font-black italic tracking-tighter uppercase leading-none">Admin <span className="text-blue-600">SDN</span></h2>
           <span className="text-[7px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2 block">System Console v5.1</span>
        </div>
        
        <nav className="flex-1 space-y-2">
            {[
              {id: 'summary', name: 'Dashboard', icon: '📊'},
              {id: 'users', name: 'Registry User', icon: '👥'},
              {id: 'knowledge', name: 'Knowledge Hub', icon: '📚'},
              {id: 'settings', name: 'Rule Registry', icon: '⚖️'},
              {id: 'audits', name: 'Audit Trail', icon: '📜'}
            ].map(t => (
             <button key={t.id} onClick={() => setActiveTab(t.id)} 
               className={`w-full text-left px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t.id ? 'bg-black text-white shadow-lg scale-105' : 'text-slate-400 hover:text-black hover:bg-slate-50'}`}>
                <span className="mr-3">{t.icon}</span> {t.name}
             </button>
           ))}
        </nav>

        <div className="pt-8 border-t border-slate-50">
           <button onClick={handleLogout} className="w-full text-left px-6 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
              🚪 Keluar Sesi
           </button>
        </div>
      </aside>

      {/* 📑 COMPACT CONTENT PANEL */}
      <section className="flex-1 p-12 overflow-y-auto">
        
        {activeTab === 'summary' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {l: 'Total Simulation', v: data.stats?.total_simulations, c: 'text-black'},
                  {l: 'Revenue', v: `Rp ${(data.stats?.total_revenue || 0).toLocaleString()}`, c: 'text-amber-600'},
                  {l: 'Pass Rate', v: `${((data.stats?.passed_count / data.stats.total_simulations || 0) * 100).toFixed(0)}%`, c: 'text-emerald-600'},
                  {l: 'Active Dosen', v: data.stats?.active_users, c: 'text-blue-600'}
                ].map((s,i) => (
                   <div key={i} className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                      <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">{s.l}</h4>
                      <div className={`text-4xl font-black italic tracking-tighter ${s.c}`}>{s.v}</div>
                   </div>
                ))}
             </div>

             <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-black mb-6 border-l-4 border-black pl-4 italic">Recent Logs</h3>
                <div className="space-y-4">
                   {data.audits?.slice(0, 8).map((log, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] border-b border-slate-50 pb-4 last:border-0 hover:bg-slate-50 transition-all p-2 rounded-lg">
                         <div className="flex items-center gap-4">
                            <span className="font-black text-black uppercase">{log.action || 'AUTH'}</span>
                            <span className="text-slate-400 font-bold">{log.description}</span>
                         </div>
                         <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
           <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-white border border-slate-100 rounded-[3rem] p-8">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-8 border-l-4 border-blue-600 pl-4">Registry User & Access</h3>
                 <table className="w-full text-left">
                    <thead>
                <tr className="text-sm font-black text-slate-600 uppercase tracking-widest border-b border-slate-200">
                           <th className="pb-6">Nama Dosen</th>
                           <th className="pb-6">Email</th>
                           <th className="pb-6 text-center">Simulasi</th>
                           <th className="pb-6 text-center">Status Akses</th>
                           <th className="pb-6 text-right">Aksi Manajemen</th>
                        </tr>
                    </thead>
                    <tbody className="text-[11px] font-bold">
                       {data.users.map((u, i) => (
                          <tr key={i} className="border-b border-slate-50">
                             <td className="py-4 text-black italic font-black">{u.name}</td>
                             <td className="py-4 text-slate-400 font-medium">{u.email}</td>
                             <td className="py-4 text-center">{u.simulations_count}</td>
                             <td className="py-4 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${u.is_premium ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                   {u.is_premium ? '👑 Premium' : 'Free Trial'}
                                </span>
                             </td>
                             <td className="py-4 text-right">
                                <button onClick={() => handleTogglePremium(u.id)} className="text-[9px] font-black uppercase text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full hover:bg-blue-600 hover:text-white transition-all">
                                   Verify / Toggle
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="animate-in slide-in-from-right-4">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-12">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-8 border-l-4 border-blue-600 pl-4">AI Knowledge Base Management</h3>
              <p className="text-sm text-slate-600 mb-8">Upload dokumen regulasi (PDF/DOCX) untuk memperkaya basis pengetahuan AI Asisten Serdos.</p>

              <form onSubmit={handleUploadKnowledge} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Judul Dokumen</label>
                  <input
                    type="text"
                    value={knowledge.title}
                    onChange={(e) => setKnowledge(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500"
                    placeholder="Contoh: Juknis Serdos 2025"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">File Dokumen (PDF/DOCX)</label>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => setKnowledge(prev => ({ ...prev, file: e.target.files[0] }))}
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={knowledge.uploading}
                  className="w-full py-6 bg-blue-600 text-white font-black rounded-full uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {knowledge.uploading ? 'UPLOADING...' : 'UPLOAD KE KNOWLEDGE BASE'}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-2xl animate-in slide-in-from-right-4">
              <form onSubmit={handleUpdateSettings} className="bg-white border border-slate-100 rounded-[3rem] p-12 space-y-10">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-black mb-10 border-l-4 border-amber-500 pl-4">Juknis 2025 Rule Registry</h3>
                 
                 <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">NAP Minimum Threshold</label>
                       <div className="flex items-center gap-6">
                          <input type="range" min="1" max="7" step="0.1" className="flex-1 accent-black" value={data.settings?.nap_threshold || 3.0} onChange={e => setData({...data, settings: {...data.settings, nap_threshold: e.target.value}})} />
                          <span className="text-3xl font-black italic">{parseFloat(data.settings?.nap_threshold || 3.0).toFixed(1)}</span>
                       </div>
                    </div>
                    
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">NPD Minimum Threshold</label>
                       <div className="flex items-center gap-6">
                          <input type="range" min="1" max="7" step="0.1" className="flex-1 accent-black" value={data.settings?.npd_threshold || 5.0} onChange={e => setData({...data, settings: {...data.settings, npd_threshold: e.target.value}})} />
                          <span className="text-3xl font-black italic">{parseFloat(data.settings?.npd_threshold || 5.0).toFixed(1)}</span>
                       </div>
                    </div>
                 </div>

                 <button disabled={saveLoading} className="w-full py-6 bg-black text-white font-black rounded-full uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">
                    {saveLoading ? 'UPDATING CORE SYSTEM...' : 'SAVE NEW POLICY RULES'}
                 </button>
              </form>
           </div>
        )}

        {loading && <div className="py-20 text-center animate-pulse italic font-black text-slate-400 text-[10px] uppercase">Syncing SDN Registry...</div>}
      </section>
    </div>
  );
}
