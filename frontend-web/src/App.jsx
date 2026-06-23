import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Navigation/Sidebar';
import DosenDashboard from './pages/Dosen/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SimulationWizard from './pages/Dosen/SimulationWizard';
import Portfolio from './pages/Dosen/Portfolio';
import Payment from './pages/Dosen/Payment';
import Login from './pages/Auth/Login';
import { RealtimeProvider } from './context/RealtimeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AIAssistant from './components/AIAssistant';

/**
 * SERDOS DIGITAL NUSANTARA - ROBUST ROLE-AWARE ROUTER (v7.0)
 * Eliminating role mismatches via case-insensitive validation and explicit segregation.
 * Vetted by AI - Manual Review Required by Senior Engineer/Manager
 */


const AppContent = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-6">
           <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
           <p className="text-[10px] font-black tracking-[0.5em] text-slate-900 uppercase">Verifying SDN Session...</p>
        </div>
      </div>
    );
  }

  // 🛡️ BOLD LOGIC: Case-Insensitive Role Mapping
  const userType = (user?.user_type || user?.role || '').toLowerCase();
  const isAdmin = isAuthenticated && userType === 'admin';
  const isDosen = isAuthenticated && userType === 'dosen';

  return (
    <div className={`flex h-screen overflow-hidden ${isAdmin ? 'bg-white' : 'bg-[#f8fafc]'}`}>
      
      {/* 🟢 NAVIGATION UNIT */}
      {isDosen && <Sidebar />}

      {/* 🔵 DYNAMIC CONSOLE PORTAL */}
      <main className={`flex-1 overflow-y-auto relative ${isDosen ? 'p-10' : 'p-0'} no-scrollbar`}>
        <div className={isDosen ? "max-w-7xl mx-auto" : "w-full h-full"}>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />

            {/* 🛡️ STRICT ROLE-GATED DASHBOARDS */}
            <Route
              path="/dashboard"
              element={
                !isAuthenticated ? <Navigate to="/login" replace /> : (
                  isAdmin ? <AdminDashboard /> : 
                  isDosen ? <DosenDashboard /> :
                  <div className="p-20 text-center font-black uppercase text-xs italic text-rose-500">Access Denied: Invalid Role Mapping</div>
                )
              }
            />

            {/* DOSEN EXCLUSIVE CHANNELS */}
            {isDosen && (
              <>
                <Route path="/simulation" element={<SimulationWizard />} />
                <Route path="/portfolios" element={<Portfolio />} />
                <Route path="/payments" element={<Payment />} />
              </>
            )}

            {/* Standard Redirects */}
            <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
            <Route path="*" element={<div className="h-full flex items-center justify-center text-slate-700 font-black uppercase text-xs">404: Endpoint Not Found</div>} />
          </Routes>
        </div>
      </main>

      {/* 🤖 GLOBAL INTELLIGENCE WIDGET */}
      {isDosen && (
        <div className="fixed bottom-0 right-0 z-[999]">
          <AIAssistant />
        </div>
      )}

      {/* 🍞 TOAST NOTIFICATIONS */}
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

    </div>
  );
};

const App = () => (
  <AuthProvider>
    <RealtimeProvider>
      <AppContent />
    </RealtimeProvider>
  </AuthProvider>
);

export default App;
