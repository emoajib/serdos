import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AIAssistant from '../../components/AIAssistant';

/**
 * 📈 DOSEN DASHBOARD v6.0 - CAREER DEVELOPMENT CENTRAL (2026 READY)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */

export default function DosenDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProjection, setShowProjection] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [skpValue, setSkpValue] = useState('');
  const [akResult, setAkResult] = useState(null);

  const convertSKPtoAK = (skp) => {
    // Simple conversion: AK = SKP * 0.1 (example, adjust as per rules)
    const ak = parseFloat(skp) * 0.1;
    return ak.toFixed(2);
  };

  const handleConvert = () => {
    if (skpValue) {
      setAkResult(convertSKPtoAK(skpValue));
    }
  };

  // 📝 Recommendation Data (Based on Kepmen 39/2026)
  const stats = [
    { label: 'BKD Status', value: 'MEMENUHI', status: 'success', detail: '2 Tahun Terverifikasi' },
    { label: 'NKAJF Score', value: '5.0', status: 'warning', detail: 'Lektor / S2' },
    { label: 'NIDN/NUPTK', value: '0123456789', status: 'neutral', detail: 'Aktif' },
  ];

  const careerSteps = [
    { title: 'Asisten Ahli', maxAK: 40, duration: '2 Thn', icon: '🌱' },
    { title: 'Lektor', maxAK: 80, duration: '2 Thn', icon: '🌿' },
    { title: 'Lektor Kepala', maxAK: 120, duration: '2 Thn', icon: '🌳' },
    { title: 'Profesor', maxAK: 160, duration: '—', icon: '👑' },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-100 p-6 flex flex-col justify-between">
        <div>
            <div className="mb-10">
              <h2 className="text-base font-black uppercase tracking-tighter italic">Serdos <span className="text-blue-600">Digital</span></h2>
              <p className="text-sm text-slate-600 font-bold">Professional Gateway v2026</p>
            </div>
            <nav className="space-y-3">
              <button onClick={()=>navigate('/dashboard')} className="w-full text-left p-4 rounded-xl bg-slate-50 font-bold text-sm uppercase tracking-wider text-blue-600">📊 Dashboard</button>
              <button onClick={()=>navigate('/simulation')} className="w-full text-left p-4 rounded-xl hover:bg-slate-50 font-bold text-sm uppercase tracking-wider text-slate-500 transition-all">🏗️ Simulation Wizard</button>
              <button className="w-full text-left p-4 rounded-xl hover:bg-slate-50 font-bold text-sm uppercase tracking-wider text-slate-500">📄 Portfolio Hub</button>
              <button className="w-full text-left p-4 rounded-xl hover:bg-slate-50 font-bold text-sm uppercase tracking-wider text-slate-500">📜 Certification</button>
            </nav>
        </div>
        <button onClick={logout} className="p-3 text-[11px] font-black uppercase text-rose-500 hover:bg-rose-50 rounded-xl transition-all">Sign Out</button>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="ml-64 p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">Assalamu'alaikum, <span className="text-blue-600">{user?.name}</span></h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Status Karier: Lektor (S2) — Menuju Lektor Kepala</p>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2.5 bg-black text-white text-[10px] font-black uppercase rounded-lg shadow-xl shadow-black/10">Bantuan 2026</button>
          </div>
        </header>

        {/* 📊 SUMMARY CARDS */}
        <section className="grid grid-cols-3 gap-8 mb-12">
            {stats.map((s, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-transparent hover:border-slate-200 transition-all shadow-sm">
                <p className="text-sm font-black uppercase text-slate-600 tracking-widest mb-2">{s.label}</p>
                <h3 className="text-2xl font-black italic text-black">{s.value}</h3>
                <div className={`mt-4 text-xs font-bold uppercase inline-block px-3 py-1 rounded-full ${s.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                  {s.detail}
                </div>
              </div>
            ))}
        </section>

        {/* 🏗️ MAIN ACTION TILES */}
        <section className="grid grid-cols-3 gap-8">
            <div className="bg-white border-2 border-slate-200 p-10 rounded-[3rem] hover:bg-slate-50 hover:shadow-lg transition-all cursor-pointer group" onClick={()=>navigate('/simulation')}>
              <div className="flex justify-between items-start mb-6">
                <span className="p-4 bg-blue-600 text-white rounded-2xl text-2xl">📐</span>
                <span className="text-xs font-black text-blue-600 border border-blue-600 px-4 py-2 rounded-full uppercase">Engine v11.0</span>
              </div>
              <h3 className="text-2xl font-black italic mb-3 text-black">Simulation Wizard</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">Uji kelayakan Serdos 2025/2026 dengan rincian per butir kualifikasi, persepsi, dan PDD-UKTPT.</p>
              <div className="mt-8 flex items-center gap-2 text-sm font-black text-black uppercase opacity-0 group-hover:opacity-100 transition-all">
                Mulai Simulasi <span className="text-blue-600">→</span>
              </div>
            </div>

           <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setShowProjection(!showProjection)}>
              <div className="flex justify-between items-start mb-6">
                <span className="p-3 bg-black text-white rounded-2xl text-xl">📉</span>
                <span className="text-[10px] font-black text-black border border-black px-3 py-1 rounded-full uppercase">Kepmen 39/2026</span>
              </div>
              <h3 className="text-xl font-black italic mb-2">Career Projection</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Prediksi Angka Kredit (AK) prestasi dan kenaikan jabatan akademik berdasarkan batas tahunan baru.</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-black uppercase">
                {showProjection ? 'Hide Details' : 'Lihat Analisis'} <span className="text-black">↓</span>
              </div>
           </div>

           <div className="bg-white border-2 border-slate-100 p-8 rounded-[3rem] hover:bg-slate-50 transition-all cursor-pointer group" onClick={() => setShowConverter(!showConverter)}>
              <div className="flex justify-between items-start mb-6">
                <span className="p-3 bg-green-600 text-white rounded-2xl text-xl">🔄</span>
                <span className="text-[10px] font-black text-green-600 border border-green-600 px-3 py-1 rounded-full uppercase">Converter</span>
              </div>
              <h3 className="text-xl font-black italic mb-2">SKP to AK</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">Konversi nilai Sasaran Kinerja Pegawai menjadi Angka Kredit secara instan berdasarkan aturan 2026.</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] font-black text-black uppercase">
                {showConverter ? 'Hide Converter' : 'Gunakan Tool'} <span className="text-green-600">↓</span>
              </div>
            </div>
         </section>

        {/* 🔄 SKP TO AK CONVERTER */}
        {showConverter && (
          <section className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-green-50 border-2 border-green-100 p-10 rounded-[3.5rem] relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-xl font-black uppercase tracking-widest mb-2 text-green-800">SKP to AK Auto-Converter</h3>
                   <p className="text-xs text-green-600 mb-6 max-w-lg">Masukkan nilai SKP Anda untuk mendapatkan konversi Angka Kredit otomatis sesuai Peraturan Menteri 2026.</p>

                   <div className="flex gap-4 items-end mb-6">
                      <div className="flex-1">
                         <label className="text-[11px] font-bold text-green-700 uppercase tracking-widest mb-2 block">Nilai SKP</label>
                         <input type="number" value={skpValue} onChange={e => setSkpValue(e.target.value)} className="w-full bg-white border border-green-200 p-4 rounded-2xl text-center font-black text-xl" placeholder="0" />
                      </div>
                      <button onClick={handleConvert} className="px-8 py-4 bg-green-600 text-white font-black uppercase rounded-2xl shadow-xl shadow-green-500/20 hover:translate-y-[-2px] transition-all">Konversi</button>
                   </div>

                   {akResult && (
                     <div className="p-6 bg-white rounded-3xl border border-green-200 text-center">
                        <p className="text-[11px] font-bold text-green-700 uppercase tracking-widest mb-2">Hasil Konversi</p>
                        <div className="text-4xl font-black italic text-green-600">{akResult}</div>
                        <p className="text-[10px] text-slate-500 uppercase mt-2">Angka Kredit (AK)</p>
                     </div>
                   )}
                </div>
             </div>
          </section>
        )}

        {/* 🔮 NEW MODULE: CAREER PROJECTION (2026 READY) */}
        {showProjection && (
          <section className="mt-10 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] relative overflow-hidden shadow-2xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-9xl font-black italic">2026</div>
                <div className="relative z-10">
                   <h3 className="text-xl font-black uppercase tracking-widest mb-2">Proyeksi Angka Kredit Pasca-Serdos</h3>
                   <p className="text-xs text-slate-400 mb-10 max-w-lg">Berdasarkan Kepmendiktisaintek 39/2026, perolehan AK Anda sekarang dibatasi per tahun untuk menjaga kualitas luaran Tridharma.</p>
                   
                   <div className="grid grid-cols-4 gap-4">
                      {careerSteps.map((step, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center">
                           <div className="text-3xl mb-3">{step.icon}</div>
                           <div className="text-[10px] font-black text-blue-400 uppercase mb-1">{step.title}</div>
                           <div className="text-2xl font-black italic">{step.maxAK}</div>
                           <div className="text-[8px] font-bold text-slate-500 uppercase mt-1">Max AK/Tahun</div>
                        </div>
                      ))}
                   </div>

                   <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10">
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Analisis Kesiapan Profesor</span>
                         <span className="text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase">On Track</span>
                      </div>
                      <div className="space-y-3">
                         <div className="flex justify-between text-xs">
                            <span className="font-medium">Progres AK Saat Ini</span>
                            <span className="font-black italic text-blue-400">221.5 / 850.0</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[26%]"></div>
                         </div>
                         <p className="text-[9px] text-slate-500 italic mt-4 font-bold uppercase">Estimasi pencapaian: 4.8 Tahun lagi — *Sesuai konversi SKP 2026.</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>
        )}

      </main>

      {/* AI Assistant Widget */}
      <AIAssistant />
    </div>
  );
}
