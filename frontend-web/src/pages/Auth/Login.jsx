import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * 🏛️ COMPACT LOGIN GATEWAY - MINIMALIST WHITE
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
export default function Login() {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [captcha, setCaptcha] = useState({ a: 0, b: 0, answer: '' });

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
    generateCaptcha();
    if (emailRef.current) emailRef.current.focus();
  }, [isAuthenticated]);

  const generateCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ a, b, answer: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (parseInt(captcha.answer) !== (captcha.a + captcha.b)) {
      setError('CAPTCHA SALAH');
      generateCaptcha();
      return;
    }
    setLoading(true);
    try {
      const res = await login(formData.email, formData.password);
      if (!res.success) {
        setError(res.message || 'Gagal Login');
        generateCaptcha();
      }
    } catch (err) { setError('Kesalahan Koneksi'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* 🧾 COMPACT CARD */}
      <div className="w-full max-w-[380px] bg-white border border-slate-200 rounded-[2.5rem] p-10 md:p-12 shadow-xl animate-in fade-in duration-500">
        
        <div className="mb-8 text-center">
           <h1 className="text-2xl font-black text-black tracking-tighter uppercase italic">
            Serdos <span className="text-blue-600">Digital</span>
           </h1>
           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Authentication Gate</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-2 border-red-500 text-red-600 text-[9px] font-black uppercase tracking-widest">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-2">
             <label className="text-[9px] font-black text-black uppercase tracking-widest pl-1">Email</label>
             <input ref={emailRef} type="email" required placeholder="name@email.com" 
                className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent font-bold text-black text-xs outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300" 
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>

          <div className="space-y-2">
             <div className="flex justify-between items-center px-1">
                <label className="text-[9px] font-black text-black uppercase tracking-widest">Password</label>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[8px] font-bold text-slate-400 uppercase">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
             </div>
             <input type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                className="w-full p-4 bg-slate-50 rounded-2xl border border-transparent font-bold text-black text-xs outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300" 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] flex items-center justify-between border border-slate-100">
             <div className="space-y-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verify</label>
                <div className="text-xl font-black text-black italic tracking-tighter">{captcha.a} + {captcha.b} = ?</div>
             </div>
             <input type="number" required placeholder="..." 
                className="w-16 p-3 bg-white rounded-xl border border-slate-200 text-black font-black text-lg text-center outline-none focus:border-blue-500 transition-all" 
                value={captcha.answer} onChange={e => setCaptcha({...captcha, answer: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:translate-y-[-1px] active:translate-y-[0px] transition-all">
             {loading ? 'WAIT...' : 'LOGIN →'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-50 pt-6">
           <button onClick={() => alert("Check device")} className="text-[8px] font-black text-slate-300 uppercase tracking-widest hover:text-black transition-colors">Forgot Access?</button>
        </div>

      </div>

    </div>
  );
}
