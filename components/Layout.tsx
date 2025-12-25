
import React from 'react';
import { AssessmentStage, CandidateProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentStage: AssessmentStage;
  setStage: (stage: AssessmentStage) => void;
  user: CandidateProfile | null;
  onLogout: () => void;
  isSyncing?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, currentStage, setStage, user, onLogout, isSyncing }) => {
  const isAdmin = !user;
  const isProfileActive = currentStage === AssessmentStage.PROFILE;

  const navigation = [
    { key: AssessmentStage.PROCESS_GUIDE, label: 'Dashboard', icon: 'fa-house', unlocked: true },
    { key: AssessmentStage.ROLE_SELECTION, label: 'Paths', icon: 'fa-compass', unlocked: true },
    { key: AssessmentStage.RESUME, label: 'Resume', icon: 'fa-file-shield', unlocked: !!user?.selectedRole },
    { key: AssessmentStage.TECHNICAL_CODING, label: 'Forge', icon: 'fa-code-branch', unlocked: !!user?.isResumePassed },
    { key: AssessmentStage.INTERVIEW, label: 'Interview', icon: 'fa-microphone-lines', unlocked: !!user?.isCodingPassed },
    { key: AssessmentStage.RESULTS, label: 'Report', icon: 'fa-chart-simple', unlocked: !!user?.isInterviewPassed },
  ];

  const adminNav = [
    { key: AssessmentStage.RESULTS, label: 'Fleet', icon: 'fa-tower-broadcast', unlocked: true },
    { key: AssessmentStage.PROCESS_GUIDE, label: 'Logs', icon: 'fa-list-check', unlocked: true },
  ];

  const currentNav = isAdmin ? adminNav : navigation;
  const progress = user?.isInterviewPassed ? 100 : user?.isCodingPassed ? 80 : user?.isResumePassed ? 50 : user?.selectedRole ? 25 : 5;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Dynamic Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-white/5 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStage(AssessmentStage.PROCESS_GUIDE)}>
              <div className="w-10 h-10 bg-gradient-to-tr from-slate-800 to-indigo-900 rounded-xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform">
                <i className="fas fa-terminal text-sm text-indigo-400"></i>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="font-black text-xl tracking-tighter leading-none">HireAI</span>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                  {isAdmin ? 'System Kernel' : 'Proprietary Core'}
                </span>
              </div>
            </div>

            {/* Desktop Module Switcher */}
            <nav className="hidden lg:flex items-center gap-1">
              {currentNav.map((item) => {
                const isActive = currentStage === item.key && !isProfileActive;
                const isLocked = !item.unlocked && !isAdmin;
                return (
                  <button
                    key={item.key}
                    disabled={isLocked}
                    onClick={() => setStage(item.key)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative
                      ${isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                      ${isLocked ? 'opacity-20 grayscale cursor-not-allowed' : ''}
                    `}
                  >
                    <i className={`fas ${isLocked ? 'fa-lock' : item.icon} text-[10px]`}></i>
                    <span className="font-bold text-[11px] tracking-tight uppercase tracking-widest">{item.label}</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Real-time Sync Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5">
              <span className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                {isSyncing ? 'Syncing...' : 'Vault Locked'}
              </span>
            </div>

            {/* User Identity Node */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <button 
                onClick={() => setStage(AssessmentStage.PROFILE)}
                className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left group ${isProfileActive ? 'bg-white/5 ring-1 ring-white/10' : ''}`}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-black truncate leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                    {isAdmin ? 'System Root' : user?.name || 'Candidate'}
                  </p>
                  <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-widest">Active Session</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden shadow-lg group-hover:border-indigo-500 transition-colors">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="font-black text-slate-400 text-sm">{isAdmin ? 'A' : (user?.name || 'C').charAt(0)}</span>
                  )}
                </div>
              </button>
              
              <button 
                onClick={onLogout}
                title="Secure Sign Out"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all shadow-sm"
              >
                <i className="fas fa-power-off text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Global Progress Baseline */}
        {!isAdmin && (
          <div className="h-[2px] w-full bg-slate-900 overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </header>

      {/* Main Experience Canvas */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
        
        {/* Environment Metadata Footer */}
        <footer className="py-12 text-center opacity-20 pointer-events-none select-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-[1px] bg-slate-400"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-slate-400">Vertex Recruitment v4.0 • Node Synced</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Layout;
