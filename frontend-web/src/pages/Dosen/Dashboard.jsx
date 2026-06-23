import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * 🧑🏻‍🏫 DOSEN DASHBOARD v11.0 - SUPREME WHITE EDITION
 * FEATURES: Clean Dashboard, Executive Summary, Parameter Verification.
 * alignment: Matches Admin Console Aesthetic (Light Theme)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export default function DosenDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ simulations: [], latest: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDosenData();
  }, []);

  const fetchDosenData = async () => {
    try {
      const res = await fetch('/api/v1/simulations', { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        setStats({ simulations: json.data, latest: json.data[0] || null });
      }
    } catch (e) { console.error("Dosen Sync Error"); }
    setLoading(false);
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
       <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black tracking-[0.3em] text-slate-900 uppercase">Synchronizing Console...</p>
       </div>
    </div>
  );

  const latestScore = stats.latest ? parseFloat(stats.latest.nap).toFixed(4) : "0.0000";
  const isLulus = stats.latest?.status === 'passed';

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700 pb-20">
      
      {/* 🌤️ SUPREME HEADER (LIGHT) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
         <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              Console <span className="text-blue-600">Dosen</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.5em]">Authorized Access: {user?.name}</p>
         </div>
         <button 
           onClick={() => navigate('/simulation')} 
           className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
           Simulasi Baru +
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
         
         {/* 💎 LATEST PERFORMANCE CARD (SUPREME LIGHT) */}
         <div className="md:col-span-8 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden group">
            <div className="relative z-10 h-full flex flex-col justify-between">
               <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-l-4 border-slate-900 pl-4">Capaian Terakhir</h3>
                  {stats.latest ? (
                    <div className="flex flex-col md:flex-row items-baseline gap-6">
                       <div className="text-8xl font-black text-slate-900 tracking-tighter italic">
                          {latestScore}
                       </div>
                       <div className="space-y-1">
                          <div className={`inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isLulus ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                             {isLulus ? '✓ LOLOS SERDOS' : '✗ BELUM LULUS'}
                          </div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Nilai Akhir Portofolio</p>
                       </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                       <p className="text-slate-300 italic font-black uppercase text-[10px] tracking-widest">Belum Ada Riwayat Simulasi</p>
                    </div>
                  )}
               </div>

               {stats.latest && (
                  <div className="mt-12 grid grid-cols-3 gap-6 pt-10 border-t border-slate-50">
                     <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Score</div>
                        <div className="text-sm font-black text-slate-900 uppercase italic">Verified</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Status</div>
                        <div className="text-sm font-black text-emerald-600 uppercase italic">Safe Portal</div>
                     </div>
                     <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Simulation Year</div>
                        <div className="text-sm font-black text-blue-600 uppercase italic">2026 Ready</div>
                     </div>
                  </div>
               )}
            </div>
         </div>

         {/* 📊 REGULATION PARAMETERS (SUPREME LIGHT) */}
         <div className="md:col-span-4 space-y-8">
            <div className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm h-full">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">System Thresholds</h3>
               <div className="space-y-8">
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Min NAP</span>
                        <span className="text-slate-900">4.20</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-900" style={{width: '60%'}}></div>
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Min NPD</span>
                        <span className="text-slate-900">4.50</span>
                     </div>
                     <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{width: '65%'}}></div>
                     </div>
                  </div>
                  <div className="pt-6">
                     <div className="p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                        <p className="text-[9px] font-bold text-slate-400 leading-relaxed italic uppercase">"Regulasi 2026: Semua narasi melalu i audit keaslian otomatis oleh sistem AI."</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>

      {/* 📜 RECENT HISTORY (SUPREME LIGHT) */}
      <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 shadow-sm">
         <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-4 italic border-l-4 border-slate-900 pl-6">
               Riwayat Audit
            </h3>
         </div>

         <div className="overflow-x-auto no-scrollbar">
            {stats.simulations.length > 0 ? (
               <table className="w-full text-left">
                  <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                     <th className="pb-6">Audit ID</th>
                     <th className="pb-6">Date Verified</th>
                     <th className="pb-6 text-center">Score (NAP)</th>
                     <th className="pb-6 text-center">Status</th>
                     <th className="pb-6 text-right">Action</th>
                  </tr>
                  </thead>
                  <tbody className="text-slate-900 font-bold text-[12px]">
                     {stats.simulations.map((s, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-all">
                           <td className="py-6 text-slate-400 text-[10px]">#AUD-{s.id}</td>
                           <td className="py-6 whitespace-nowrap text-slate-600">{new Date(s.created_at).toLocaleDateString()}</td>
                           <td className="py-6 text-center">
                              <span className="text-lg font-black italic tracking-tighter text-blue-600">{parseFloat(s.nap).toFixed(4)}</span>
                           </td>
                           <td className="py-6 text-center">
                              <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s.status === 'passed' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                 {s.status_code}
                              </span>
                           </td>
                           <td className="py-6 text-right">
                              <button onClick={() => navigate('/simulation')} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-all">
                                 Detailed Audit →
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="py-12 text-center text-slate-200 italic font-black uppercase text-[11px] tracking-widest">Digital records vault is empty.</div>
            )}
         </div>
      </div>

    </div>
  );
}
