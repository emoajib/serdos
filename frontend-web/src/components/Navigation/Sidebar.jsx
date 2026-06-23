import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * 🧑🏻‍🏫 DOSEN NAVIGATION SIDEBAR v11.0 - SUPREME WHITE EDITION
 * FEATURES: Minimalist tabs, Clean Typography, Unified Admin Aesthetic.
 * alignment: Matches Admin Console Aesthetic (Light Theme)
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */
const Sidebar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari Sesi Aman DN?")) {
      logout();
      navigate('/login');
    }
  };

  const navItems = [
    { path: '/dashboard', icon: '📊', label: 'Console Hub' },
    { path: '/simulation', icon: '🚀', label: 'Simulation' },
    { path: '/portfolios', icon: '📑', label: 'Performance' },
    { path: '/payments', icon: '💳', label: 'Premium' },
  ];

  return (
    <aside className="w-80 bg-white border-r border-slate-100 h-screen p-10 flex flex-col shrink-0 overflow-y-auto relative no-scrollbar">
      
      {/* 🚀 BRANDING (CLEAN) */}
      <div className="mb-16 border-b border-slate-50 pb-8 text-center">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase text-slate-900 leading-none">
          Serdos <span className="text-blue-600">Digital</span>
        </h1>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-3 italic">Authorized Dosen</p>
      </div>

      {/* 🧭 NAV LINKS (SUPREME STYLE) */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-5 px-8 py-5 rounded-[1.5rem] transition-all text-[10px] font-black uppercase tracking-widest relative group overflow-hidden ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
            <span className="relative z-10">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* 🚪 USER CONTEXT & LOGOUT */}
      <div className="pt-10 border-t border-slate-100 space-y-6">
        <div className="flex items-center space-x-5 px-2">
           <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-900 text-xl uppercase shadow-sm">
              {user?.name?.charAt(0)}
           </div>
           <div className="overflow-hidden">
              <p className="text-[11px] font-black text-slate-900 uppercase leading-none truncate mb-1.5">{user?.name}</p>
              <div className="flex items-center gap-2">
                 <span className="text-[8px] font-black text-emerald-600 uppercase px-2 py-0.5 bg-emerald-50 rounded-md border border-emerald-100 italic">SECURE</span>
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">{user?.role}</p>
              </div>
           </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-5 px-8 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent"
        >
          <span className="text-xl">🚪</span>
          <span>Terminate Session</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
