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
  const isAdmin = !user && currentStage !== AssessmentStage.PROCESS_GUIDE;
  
  const navigation = [
    { key: AssessmentStage.PROCESS_GUIDE, label: 'HUB', icon: 'fa-house', unlocked: true },
    { key: AssessmentStage.ROLE_SELECTION, label: 'TARGET', icon: 'fa-bullseye', unlocked: true },
    { key: AssessmentStage.RESUME, label: 'RESUME', icon: 'fa-lock', unlocked: !!user?.selectedRole },
    { key: AssessmentStage.TECHNICAL_CODING, label: 'FORGE', icon: 'fa-lock', unlocked: !!user?.isResumePassed },
    { key: AssessmentStage.INTERVIEW, label: 'INTERVIEW', icon: 'fa-lock', unlocked: !!user?.isCodingPassed },
    { key: AssessmentStage.RESULTS, label: 'VERDICT', icon: 'fa-lock', unlocked: !!user?.isInterviewPassed },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white relative text-slate-400 font-sans">
      {/* Precision Header - Re-engineered for Reference Fidelity */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#020410] border-b border-white/5 z-[100] px-10 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setStage(AssessmentStage.PROCESS_GUIDE)}>
          <div className="w-10 h-10 bg-[#5551ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(85,81,255,0.4)]">
            <i className="fas fa-terminal text-white text-xs"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tighter leading-none">HireAI</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">ENTERPRISE KERNEL</span>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <nav className="flex items-center bg-white/[0.05] border border-white/10 rounded-2xl p-1 gap-1">
          {navigation.map((item) => {
            const isActive = currentStage === item.key;
            const isLocked = !item.unlocked && !isAdmin;
            return (
              <button
                key={item.key}
                disabled={isLocked}
                onClick={() => setStage(item.key)}
                className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                  isActive 
                  ? 'bg-[#5551ff] text-white shadow-[0_0_20px_rgba(85,81,255,0.3)]' 
                  : 'text-slate-500 hover:text-white disabled:opacity-30'
                }`}
              >
                <i className={`fas ${isActive ? item.icon.replace('fa-lock', 'fa-house') : item.icon} text-[10px]`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Group */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.05] border border-white/10 rounded-xl">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Vault Locked</span>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right flex flex-col justify-center">
                <span className="text-[11px] font-black text-white uppercase tracking-tight leading-none">Candidate</span>
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest mt-1">GLOBAL PROFILE</span>
             </div>
             <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white text-xs font-black">
                {isAdmin ? 'A' : (user?.name || 'C').charAt(0).toUpperCase()}
             </div>
             <button 
              onClick={onLogout}
              className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-600 hover:text-rose-500 transition-all"
             >
               <i className="fas fa-power-off text-xs"></i>
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mt-20 px-10 py-16 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;