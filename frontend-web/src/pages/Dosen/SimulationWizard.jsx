import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * 🎓 SERDOS SIMULATION WIZARD v15.2 - SUPREME WHITE EDITION
 * FEATURES: AI Fraud Guard v2026, Dynamic Weights, Clean Executive UI.
 * alignment: Matches Admin Console Aesthetic (Light Theme)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */

const ITEMS = {
  ATASAN: [
    {c:'P', t:'Pengumpulan dokumen pembelajaran (RPS, handout, rubrik penilaian dan contoh soal).', lo:'tidak lengkap', hi:'lengkap'},
    {c:'P', t:'Penyelenggaraan perkuliahan menurut standar jumlah tatap muka dan/atau daring.', lo:'tidak pernah', hi:'lengkap'},
    {c:'P', t:'Kepatuhan terhadap etika/norma akademik yang ditetapkan lembaga.', lo:'RENDAH', hi:'TINGGI'},
    {c:'P', t:'Penyerahan nilai mahasiswa sesuai dengan jadwal yang telah ditetapkan.', lo:'TERLAMBAT', hi:'TEPAT WAKTU'},
    {c:'P', t:'Menyediakan cukup waktu dalam pembimbingan mahasiswa.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Hasil evaluasi kepuasan mahasiswa terhadap pelayanan dosen.', lo:'BURUK', hi:'BAIK'},
    {c:'F', t:'Penguasaan bidang ilmu dan keahlian yang menjadi tugas pokoknya.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Kemampuan menjelaskan bidang ilmunya secara kontekstual.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Penguasaan bidang ilmu termasuk referensi yang dimilikinya.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Kesiapan melakukan refleksi dan diskusi (sharing) dengan kolega.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Produktivitas dalam menghasilkan karya tulis ilmiah.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Keterlibatan dalam kegiatan ilmiah/organisasi profesi.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Keteladanan dan konsistensi dalam kata dan tindakan.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Kemampuan mengendalikan diri dalam berbagai situasi dan kondisi.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'S', t:'Kemampuan berkomunikasi lisan dan tulisan.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Kesiapan menerima kritik, saran, dan pendapat orang lain.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Pergaulan dengan teman sejawat, karyawan, mahasiswa dan masyarakat.', lo:'BURUK', hi:'BAIK'},
  ],
  DIRI: [
    {c:'P', t:'Menggunakan materi dan perangkat pembelajaran secara konsisten tiap tahun.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Menyelenggarakan perkuliahan secara teratur sesuai dengan kalender akademik.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Mengelola kelas sesuai dengan kondisi mahasiswa dan waktu pembelajaran.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Memanfaatkan media dan teknologi pembelajaran secara maksimal.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Menilai hasil belajar mahasiswa secara subjektif.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Menyediakan cukup waktu dalam pembimbingan mahasiswa.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Penguasaan bidang ilmu yang menjadi keahlian sesuai dengan tugas pokok.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Kemampuan menunjukkan keterkaitan antara teori dengan aplikasinya.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Pemutakhiran bidang ilmu dan referensi melalui akses teknologi.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Melakukan refleksi dan diskusi (sharing) bidang ilmu dengan kolega.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Keterlibatan dalam kegiatan ilmiah/organisasi profesi.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Keteladanan dan konsistensi dalam kata dan tindakan.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Kemampuan mengendalikan diri dalam berbagai situasi dan kondisi.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Kemampuan berkomunikasi lisan dan tulisan.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Kesiapan menerima kritik, saran, dan pendapat orang lain.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'S', t:'Pergaulan dengan kalangan sejawat, karyawan, dan masyarakat.', lo:'BURUK', hi:'BAIK'},
  ],
  SEJAWAT: [
    {c:'P', t:'Kinerja dalam mengajar dan mengelola kelas.', lo:'BURUK', hi:'BAIK'},
    {c:'P', t:'Pemanfaatan media dan teknologi mutakhir dalam pembelajaran.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Kedisiplinan dalam mengajar.', lo:'RENDAH', hi:'TINGGI'},
    {c:'F', t:'Mengajar sesuai dengan bidang ilmunya.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Mengikuti perkembangan dan menguasai bidang ilmunya.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'F', t:'Keteguhan pendirian di saat diskusi.', lo:'Lemah', hi:'Kuat'},
    {c:'F', t:'Produktivitas dalam penelitian/kajian/desain.', lo:'RENDAH', hi:'TINGGI'},
    {c:'K', t:'Kearifan dalam mengambil keputusan.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Keteladanan dan konsistensi dalam kata dan tindakan.', lo:'RENDAH', hi:'TINGGI'},
    {c:'K', t:'Kemampuan mengendalikan diri.', lo:'RENDAH', hi:'TINGGI'},
    {c:'K', t:'Berteman berdasarkan kepentingan diri sendiri.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'S', t:'Kemampuan berkomunikasi dengan lisan dan tulisan.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Sikap dalam menerima kritik dan saran.', lo:'Tertutup', hi:'Terbuka'},
    {c:'S', t:'Pergaulan di kalangan sejawat dan mahasiswa.', lo:'Buruk', hi:'Baik'},
  ],
  MHS:[
    {c:'P', t:'Penyampaian materi dalam proses pembelajaran.', lo:'tidak memotivasi', hi:'memotivasi'},
    {c:'P', t:'Pemberian materi mengikuti kemauan dosen.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'P', t:'Pemanfaatan strategi dan media pembelajaran.', lo:'TIDAK SESUAI', hi:'SESUAI'},
    {c:'P', t:'Penilaian hasil belajar mahasiswa.', lo:'OBJEKTIF', hi:'SUBJEKTIF'},
    {c:'F', t:'Struktur materi yang diajarkan.', lo:'ACAK', hi:'RUNTUT'},
    {c:'F', t:'Penguasaan bidang ilmu yang diajarkan.', lo:'DANGKAL', hi:'DALAM'},
    {c:'F', t:'Materi yang diajarkan dan referensinya.', lo:'USANG', hi:'TERKINI'},
    {c:'K', t:'Memberikan keteladanan dalam bersikap.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'K', t:'Pengendalian diri dalam berbagai situasi.', lo:'TIDAK MAMPU', hi:'MAMPU'},
    {c:'K', t:'Pilih kasih dalam memperlakukan mahasiswa.', lo:'TIDAK PERNAH', hi:'SELALU'},
    {c:'S', t:'Kemampuan berkomunikasi lisan dan tulisan.', lo:'RENDAH', hi:'TINGGI'},
    {c:'S', t:'Sikap dalam menerima kritik dari mahasiswa.', lo:'TERTUTUP', hi:'TERBUKA'},
    {c:'S', t:'Interaksi dengan mahasiswa.', lo:'KAKU', hi:'LUWES'},
  ],
  PDD: {
    pengajaran: ['Penguasaan materi', 'Kesesuaian dengan CPMK', 'Interaksi pembelajaran', 'Asesmen capaian', 'Kreativitas penyampaian'],
    penelitian: ['Makna penelitian', 'Kesesuaian bidang ilmu', 'Inovasi', 'Kategori publikasi', 'Keberlanjutan'],
    pengabdian: ['Makna PkM', 'Tingkat dampak', 'Kemampuan kerjasama', 'Konsistensi keilmuan', 'Kontribusi kegiatan'],
  }
};

const CC = {P:'#3b82f6',F:'#f59e0b',K:'#10b981',S:'#ec4899'};
const CL = {P:'Pedagogik',F:'Profesional',K:'Kepribadian',S:'Sosial'};

export default function SimulationWizard() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [step, setStep] = useState(0);
  const [activeSub, setActiveSub] = useState({ sej: 0, mhs: 0, ased: 0 });
  const [isAuditing, setIsAuditing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  
  const countWords = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const [data, setData] = useState({
    jabatan: '', pendidikan: '', tugasBelajar: 'TIDAK',
    karyaFenomenal: '',
    props: { p: 50, r: 40, a: 10 }, 
    narrative: { penelitian: '', pkm: '' },
    scores: {
      atas: Array(17).fill(null),
      diri: Array(16).fill(null),
      sej: [Array(14).fill(null), Array(14).fill(null), Array(14).fill(null)],
      mhs: [Array(13).fill(null), Array(13).fill(null), Array(13).fill(null), Array(13).fill(null), Array(13).fill(null)],
      ased: [
        { pengajaran: Array(5).fill(null), penelitian: Array(5).fill(null), pengabdian: Array(5).fill(null) },
        { pengajaran: Array(5).fill(null), penelitian: Array(5).fill(null), pengabdian: Array(5).fill(null) }
      ]
    }
  });

  const getAvg = (arr = []) => {
    if (!arr) return 0;
    const valid = arr.filter(v => v !== null && v !== '');
    return valid.length ? valid.reduce((a, b) => a + parseFloat(b), 0) / valid.length : 0;
  };

  const calculateFinal = () => {
    const NKAJF_T = {2:{1:4,2:5}, 3:{1:5,2:6}, 4:{1:6,2:7}, 5:{2:7}};
    let nkajf = (data.jabatan && data.pendidikan !== '') ? (NKAJF_T[data.jabatan]?.[data.pendidikan] || 0) : 0;
    if(data.tugasBelajar === 'YA') nkajf = Math.max(nkajf - 1, 1);

    const sAtas = getAvg(data.scores.atas);
    const sDiri = getAvg(data.scores.diri);
    const sSej = (getAvg(data.scores.sej[0]) + getAvg(data.scores.sej[1]) + getAvg(data.scores.sej[2])) / 3;
    const sMhs = data.tugasBelajar === 'YA' ? 4.0 : (getAvg(data.scores.mhs[0]) + getAvg(data.scores.mhs[1]) + getAvg(data.scores.mhs[2]) + getAvg(data.scores.mhs[3]) + getAvg(data.scores.mhs[4])) / 5;
    const npd = (sAtas + sDiri + sSej + sMhs) / 4;

    const getNA = (asedor) => {
      const p = getAvg(asedor.pengajaran) * (data.props.p/100);
      const r = getAvg(asedor.penelitian) * (data.props.r/100);
      const a = getAvg(asedor.pengabdian) * (data.props.a/100);
      return p + r + a;
    };
    const na1 = getNA(data.scores.ased[0]), na2 = getNA(data.scores.ased[1]);
    const npdd = (na1 + na2) / 2;
    const nap = (nkajf * 0.35) + (npd * 0.1) + (npdd * 0.55);

    return { nkajf, npd, npdd, nap, na1, na2 };
  };

  const res = calculateFinal();
  const simScore = aiResult?.similarity_score || 0;
  const isFraud = simScore > 0.60;
  const isWarning = simScore > 0.40 && simScore <= 0.60;

  const isLulus = res.npd >= 4.5 && res.na1 >= 4.0 && res.na2 >= 4.0 && res.nap >= 4.2 && !isFraud;

  const handleScoreChange = (cat, subIdx, itemIdx, value) => {
    let val = value === null ? null : parseFloat(value);
    if (isWarning && val > 3) val = 3;
    if (isFraud) val = 1;

    const newData = JSON.parse(JSON.stringify(data));
    if (subIdx === null) newData.scores[cat][itemIdx] = val;
    else if (cat === 'ased') newData.scores.ased[subIdx][itemIdx.type][itemIdx.idx] = val;
    else newData.scores[cat][subIdx][itemIdx] = val;
    setData(newData);
  };

  const getInputValue = (i) => {
    if (step === 1) return data.scores.atas[i];
    if (step === 2) return data.scores.diri[i];
    if (step === 3) return data.scores.sej[activeSub.sej]?.[i];
    if (step === 4) return data.scores.mhs[activeSub.mhs]?.[i];
    return null;
  };

  return (
    <div className="bg-[#f8fafc] text-slate-900 min-h-screen font-sans pb-20 overflow-x-hidden">
      
      {/* 🌤️ SUPREME HEADER (LIGHT) */}
      <header className="bg-white border-b border-slate-200 py-10 px-10 flex justify-between items-center shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
             AI Compliance Active v2026
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Simulation <span className="text-blue-600">Wizard</span></h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Authorized Dosen Console</p>
        </div>
        <button onClick={() => navigate('/dashboard')} className="bg-slate-900 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">← Dashboard</button>
      </header>

      <div className="max-w-7xl mx-auto px-10 mt-10">
        
        {/* 📊 PROGRESS TRACKER */}
        <div className="w-full h-1.5 bg-slate-200 mb-10 rounded-full overflow-hidden">
           <div className="h-full bg-blue-600 transition-all duration-700" style={{width: `${(step + 1) / 7 * 100}%`}}></div>
        </div>

        <nav className="flex bg-white border border-slate-200 p-2 rounded-[2rem] shadow-sm mb-12 overflow-x-auto no-scrollbar gap-1">
          {['Identity', 'Atasan', 'Diri', 'Sejawat', 'MHS', 'Asesor', 'Result'].map((n, i) => (
            <button key={i} onClick={() => setStep(i)} className={`flex-1 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all ${step === i ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}>
              {i+1}. {n}
            </button>
          ))}
        </nav>

        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
             <div className="md:col-span-4 space-y-8">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-l-4 border-slate-900 pl-4">Digital Identity</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jabatan Fungsional</label>
                        <select value={data.jabatan} onChange={e=>setData({...data, jabatan:e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500/10">
                           <option value="">— Pilih —</option>
                           <option value="2">Asisten Ahli</option><option value="3">Lektor</option><option value="4">Lektor Kepala</option><option value="5">Guru Besar</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pendidikan Tertinggi</label>
                        <select value={data.pendidikan} onChange={e=>setData({...data, pendidikan:e.target.value})} className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl font-bold outline-none">
                           <option value="">— Pilih —</option>
                           <option value="0">S1 / Diploma</option><option value="1">S2 / Magister</option><option value="2">S3 / Doktor</option>
                        </select>
                      </div>
                   </div>
                </div>
             </div>

             <div className="md:col-span-8 space-y-8">
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-l-4 border-slate-900 pl-4">Narrative Artifacts</h3>
                   <textarea value={data.karyaFenomenal} onChange={e=>setData({...data, karyaFenomenal:e.target.value})} rows="4" className="w-full bg-slate-50 border border-slate-100 p-6 rounded-3xl text-sm font-medium outline-none focus:bg-white transition-all" placeholder="Statement Karya Fenomenal..." />
                   
                   <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <textarea value={data.narrative.penelitian} onChange={e=>setData({...data, narrative:{...data.narrative, penelitian:e.target.value}})} className="w-full h-32 bg-slate-50 border border-slate-100 p-6 rounded-3xl text-sm outline-none" placeholder="Narasi Penelitian..." />
                      <textarea value={data.narrative.pkm} onChange={e=>setData({...data, narrative:{...data.narrative, pkm:e.target.value}})} className="w-full h-32 bg-slate-50 border border-slate-100 p-6 rounded-3xl text-sm outline-none" placeholder="Narasi PkM..." />
                   </div>
                   
                   <button onClick={()=>setStep(1)} className="w-full mt-10 py-6 bg-blue-600 text-white font-black rounded-3xl uppercase tracking-widest text-[11px] shadow-lg hover:bg-blue-700 transition-all">Proceed to Evaluation →</button>
                </div>
             </div>
          </div>
        )}

        {(step >= 1 && step <= 5) && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
             <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm relative">
                <div className="flex justify-between items-center mb-10">
                   <div className="space-y-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Perception Phase {step}</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Multi-Rater Compliance Analysis</p>
                   </div>
                   <div className="flex gap-2">
                       {step === 3 && [0,1,2].map(i=>(<button key={i} onClick={()=>setActiveSub({...activeSub, sej:i})} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${activeSub.sej===i?'bg-blue-600 text-white shadow-lg':'bg-slate-100 text-slate-400 hover:text-slate-900'}`}>COLLEAGUE {i+1}</button>))}
                       {step === 5 && [0,1].map(i=>(<button key={i} onClick={()=>setActiveSub({...activeSub, ased:i})} className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${activeSub.ased===i?'bg-blue-600 text-white shadow-lg':'bg-slate-100 text-slate-400 hover:text-slate-900'}`}>ASESOR {i+1}</button>))}
                   </div>
                </div>

                <div className="border border-slate-100 rounded-[2.5rem] overflow-hidden">
                   <table className="w-full">
                      <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                         <tr><th className="p-7 text-left">Academic Indicator</th><th className="p-7 text-right w-64">Score Dial (1-7)</th></tr>
                      </thead>
                      <tbody>
                         {(step===1?ITEMS.ATASAN:step===2?ITEMS.DIRI:step===3?ITEMS.SEJAWAT:step===4?ITEMS.MHS:ITEMS.PDD[activeSub.ased === 0 ? 'pengajaran' : 'penelitian']).map((it, i) => (
                           <tr key={i} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-all">
                              <td className="p-7">
                                 <div className="text-slate-900 font-bold text-sm leading-relaxed mb-1">{typeof it === 'string' ? it : it.t}</div>
                                 {it.lo && <p className="text-[10px] font-bold text-slate-300 uppercase italic">{it.lo} — {it.hi}</p>}
                              </td>
                              <td className="p-7 text-right">
                                 <div className="flex gap-1 justify-end">
                                   {[1,2,3,4,5,6,7].map(val => {
                                      const cur = step === 5 ? (data.scores.ased[activeSub.ased]?.[activeSub.ased === 0 ? 'pengajaran' : 'penelitian']?.[i]) : getInputValue(i);
                                      const isSel = cur === val;
                                      return (
                                        <button key={val} onClick={()=>handleScoreChange(step===1?'atas':step===2?'diri':step===3?'sej':step===4?'mhs':'ased', step===1||step===2?null:step===3?activeSub.sej:step===4?activeSub.mhs:activeSub.ased, step===5?{type:activeSub.ased===0?'pengajaran':'penelitian',idx:i}:i, val)} className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${isSel ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-300'}`}>
                                          {val}
                                        </button>
                                      );
                                   })}
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
                
                <div className="flex gap-4 mt-12">
                   <button onClick={()=>setStep(step-1)} className="flex-1 py-5 bg-white text-slate-400 border border-slate-200 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-all">← Back</button>
                   <button onClick={()=>setStep(step+1)} className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">Continue to Stage {step+1} →</button>
                </div>
             </div>
          </div>
        )}

        {step === 6 && (
           <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-700">
              <div className={`p-16 rounded-[4rem] text-center border-2 ${isLulus ? 'border-emerald-100 bg-white':'border-rose-100 bg-white'} shadow-2xl relative overflow-hidden`}>
                 <div className="text-[100px] font-black tracking-tighter text-slate-900 leading-none mb-4">{res.nap.toFixed(4)}</div>
                 <div className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Nilai Akhir Portofolio (NAP)</div>
                 
                 <div className={`mt-10 inline-flex items-center gap-4 px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest ${isLulus?'bg-emerald-500 text-white':'bg-rose-500 text-white shadow-xl shadow-rose-500/20'}`}>
                    {isLulus ? '🏅 Certificate Status: PASSED' : '⚠️ STATUS: NOT PASSED'}
                 </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <button onClick={() => window.print()} className="py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">Print Digital Report</button>
                 <button onClick={() => setStep(0)} className="py-6 bg-white border border-slate-200 text-slate-400 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:text-slate-900 transition-all">Restart Simulation</button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}
