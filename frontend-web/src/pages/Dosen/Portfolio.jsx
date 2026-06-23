import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRealtime } from '../../context/RealtimeContext';
import PremiumCard from '../../components/ui/PremiumCard';

/**
 * 🧑🏻‍🏫 PORTFOLIO MANAGEMENT v5.0 - SUPREME WHITE EDITION
 * FEATURES: Document Management, Real-time AI Analysis Tracking.
 * alignment: Matches Admin Console Aesthetic (Light Theme)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export default function Portfolio() {
  const { token, user } = useAuth();
  const echo = useRealtime();
  
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', file: null });

  useEffect(() => {
    fetchPortfolios();
  }, []);

  useEffect(() => {
    if (echo && user) {
      const channel = echo.private(`user.${user.id}`)
        .listen('PortfolioAnalyzed', (e) => {
          setPortfolios(prev => prev.map(p => 
            p.id === e.id 
              ? { ...p, status: e.status, similarity_score: e.similarity_score } 
              : p
          ));
        });

      return () => {
        echo.leave(`user.${user.id}`);
      };
    }
  }, [echo, user]);

  const fetchPortfolios = async () => {
    try {
      const resp = await fetch('/api/v1/portfolios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });
      const data = await resp.json();
      if (data.success) {
        setPortfolios(data.data);
      }
    } catch (err) { console.error('Failed to fetch portfolios:', err); }
    finally { setLoading(false); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file || !uploadData.title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('file', uploadData.file);

    try {
      const resp = await fetch('/api/v1/portfolios', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      const data = await resp.json();
      if (data.success) {
        setPortfolios([data.data, ...portfolios]);
        setShowUploadModal(false);
        setUploadData({ title: '', file: null });
      } else { alert(data.message || 'Upload gagal'); }
    } catch (err) { console.error('Upload error:', err); }
    finally { setUploading(false); }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-amber-100 text-amber-600 border-amber-200',
      analyzing: 'bg-blue-100 text-blue-600 border-blue-200 animate-pulse',
      completed: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      failed: 'bg-rose-100 text-rose-600 border-rose-200',
      lolos: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      peringatan: 'bg-amber-100 text-amber-600 border-amber-200',
      ditolak: 'bg-rose-100 text-rose-600 border-rose-200',
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border tracking-widest ${styles[status] || styles.pending}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* 🚀 SUPREME HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
            Vault <span className="text-blue-600">Portofolio</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.5em]">Centralized Academic Documents Storage</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-slate-900 text-white px-10 py-5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          + Upload Baru
        </button>
      </header>

      <div className="grid grid-cols-1 gap-10">
        <PremiumCard title="Digital Archive Items">
          {loading ? (
            <div className="py-20 text-center text-slate-300 italic font-black uppercase text-[10px] tracking-widest">Syncing Vault...</div>
          ) : portfolios.length === 0 ? (
            <div className="py-20 text-center text-slate-200 italic font-black uppercase text-[10px] tracking-widest border-2 border-dashed border-slate-50 rounded-[2.5rem]">
               No academic artifacts discovered.
            </div>
          ) : (
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                    <th className="pb-8 px-4">Title / Artifact</th>
                    <th className="pb-8 px-4">Timestamp</th>
                    <th className="pb-8 px-4 text-center">AI Similarity</th>
                    <th className="pb-8 px-4 text-right">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="text-slate-900 font-bold text-[12px]">
                  {portfolios.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-all group">
                      <td className="py-6 px-4">
                        <div className="flex items-center space-x-4">
                          <span className="text-xl bg-slate-50 w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 group-hover:scale-110 transition-transform">📄</span>
                          <span className="font-black italic text-slate-900">{p.title}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-slate-400">
                        {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-6 px-4 text-center">
                        {p.similarity_score !== null ? (
                          <div className={`text-lg font-black italic tracking-tighter ${p.similarity_score > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {p.similarity_score}%
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-300 uppercase italic font-black tracking-widest">Queueing...</span>
                        )}
                      </td>
                      <td className="py-6 px-4 text-right">
                        {getStatusBadge(p.status || 'pending')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </PremiumCard>
      </div>

      {/* 🏛️ MODERN UPLOAD MODAL (SUPREME LIGHT) */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-xl bg-slate-900/10">
          <div className="absolute inset-0" onClick={() => !uploading && setShowUploadModal(false)} />
          <div className="relative bg-white border border-slate-100 rounded-[3.5rem] max-w-xl w-full p-12 shadow-4xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-10">
               <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Upload Artifact</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Document Encryption Active</p>
            </div>
            
            <form onSubmit={handleUpload} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Artifact Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Research Narrative 2026"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold text-slate-900 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                  value={uploadData.title}
                  onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-4">Secure File (PDF/DOCX)</label>
                <div className="relative border-2 border-dashed border-slate-100 rounded-[2rem] p-10 text-center hover:border-blue-500/50 hover:bg-slate-50 transition-all cursor-pointer group">
                  <input 
                    type="file"
                    required
                    accept=".pdf,.docx,.doc"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={e => setUploadData({ ...uploadData, file: e.target.files[0] })}
                  />
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">📁</div>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest truncate max-w-xs mx-auto">
                    {uploadData.file ? uploadData.file.name : 'Drop secure artifact here'}
                  </p>
                  <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-2">Max 5MB • Encrypted Upload</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  disabled={uploading}
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-5 rounded-2xl bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={uploading || !uploadData.file || !uploadData.title}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {uploading ? 'Processing...' : 'Upload Artifact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
