import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * 💰 PREMIUM UPGRADE - MANUAL PAYMENT PORTAL
 * Dosen Side: Instructions for QRIS & Transfer
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export default function Payment() {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [banks, setBanks] = useState([]);
  const [status, setStatus] = useState('idle'); // idle, pending, settled

  useEffect(() => {
    fetchPaymentRules();
  }, []);

  const fetchPaymentRules = async () => {
    try {
      const res = await fetch('/api/v1/admin/settings', { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) {
        setSettings(json.settings);
        try { setBanks(JSON.parse(json.settings.payment_banks || '[]')); } catch(e) { setBanks([]); }
      }
      
      // Check user's last payment status
      const pRes = await fetch('/api/v1/payments/history', { headers: { 'Authorization': `Bearer ${token}` } });
      const pJson = await pRes.json();
      if (pJson.success && pJson.data.length > 0) {
        setStatus(pJson.data[0].status);
      }
    } catch (e) { console.error("Payment Sync Error"); }
    setLoading(false);
  };

  const notifyAdmin = async () => {
     // Mock initiating a 'pending' status in database
     try {
        await fetch('/api/v1/payments/checkout', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
           body: JSON.stringify({ amount: settings.simulation_price || 150000 })
        });
        setStatus('pending');
        alert("PEMBERITAHUAN TERKIRIM: Admin sedang memvalidasi pembayaran Anda. Premium akan aktif dalam 1-12 jam.");
     } catch (e) { alert("Sistem Sibuk."); }
  };

  if (loading) return <div className="p-20 text-center animate-pulse italic font-black text-slate-400 uppercase">Synchronizing Payment Gateway...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in duration-700">
      
      {/* 🚀 HEADER */}
      <div className="text-center space-y-4">
         <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Upgrade to Premium</h1>
         <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Dapatkan akses simulasi tak terbatas seumur hidup</p>
      </div>

      {status === 'settled' ? (
        <div className="bg-emerald-600 p-20 rounded-[4rem] text-white text-center shadow-2xl shadow-emerald-500/30">
           <div className="text-6xl mb-8">👑</div>
           <h2 className="text-3xl font-black uppercase italic tracking-tighter">Akun Anda Sudah Premium</h2>
           <p className="mt-4 font-bold text-emerald-100 opacity-80 uppercase text-xs">Semua fitur simulasi Serdos 2025 telah terbuka.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           
           {/* 🟦 INSTRUCTIONS */}
           <div className="bg-white p-12 rounded-[4rem] shadow-3xl flex flex-col items-center text-center space-y-10 border border-slate-50">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-4 border-blue-600 pb-4">Scan QRIS (Otomatis)</h3>
              {settings.payment_qris_url ? (
                <div className="w-64 h-64 p-4 bg-slate-50 rounded-3xl shadow-inner border-2 border-slate-100">
                   <img src={settings.payment_qris_url} alt="QRIS" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-64 h-64 bg-slate-50 rounded-3xl flex items-center justify-center italic text-slate-300 font-bold text-[10px] uppercase">QRIS Belum Tersedia</div>
              )}
              <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">Gunakan m-Banking atau e-Wallet (Gopay/OVO/Dana) untuk memindai kode QR di atas.</p>
           </div>

           {/* 🟥 BANK TRANSFER */}
           <div className="bg-slate-900 p-12 rounded-[4rem] shadow-4xl text-white space-y-10">
              <h3 className="text-xs font-black uppercase tracking-widest border-b-4 border-amber-500 pb-4">Transfer Bank Manual</h3>
              <div className="space-y-6">
                 {banks.length === 0 ? <p className="text-[10px] italic text-slate-600 uppercase font-black">Admin belum mengisi daftar bank.</p> : banks.map((b, i) => (
                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <p className="text-[10px] font-black text-blue-400 uppercase">{b.name}</p>
                        <div className="flex justify-between items-center mt-2">
                           <span className="text-xl font-black font-mono tracking-tighter">{b.number}</span>
                           <button onClick={() => {navigator.clipboard.writeText(b.number); alert('Copied!');}} className="text-[9px] font-black uppercase text-slate-500 hover:text-white">Copy</button>
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 mt-2 uppercase">A/N: {b.holder}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* 📝 FINAL STEPS */}
           <div className="md:col-span-2 bg-blue-50 p-14 rounded-[4rem] border-2 border-blue-100 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                 <h4 className="text-xl font-black text-blue-900 uppercase italic leading-none">Total Pembayaran: Rp {(settings.simulation_price || 150000).toLocaleString()}</h4>
                 <p className="text-[10px] font-bold text-blue-600/60 uppercase max-w-lg leading-relaxed">PENTING: Mohon sertakan nama lengkap Anda atau email akun SDN di catatan transfer/QRIS untuk memudahkan Admin memverifikasi pembayaran Anda.</p>
              </div>
              <button 
                onClick={notifyAdmin} 
                disabled={status === 'pending'}
                className={`px-14 py-6 rounded-full font-black text-[10px] uppercase shadow-2xl transition-all ${status === 'pending' ? 'bg-slate-300 text-slate-500' : 'bg-blue-600 text-white shadow-blue-500/30 hover:scale-105 active:scale-95'}`}
              >
                 {status === 'pending' ? 'Menunggu Verifikasi Admin...' : 'Saya Sudah Bayar (Konfirmasi)'}
              </button>
           </div>

        </div>
      )}

      {/* ⚠️ DISCLAIMER */}
      <div className="text-center">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sistem Pembayaran Manual v1.0 • Verifikasi Dilakukan Dalam 1x24 Jam Kerja</p>
      </div>

    </div>
  );
}
