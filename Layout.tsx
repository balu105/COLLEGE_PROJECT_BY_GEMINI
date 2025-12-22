
import React from 'react';
import { AssessmentStage, CandidateProfile } from './types';

interface LayoutProps {
  children: React.ReactNode;
  currentStage: AssessmentStage;
  setStage: (stage: AssessmentStage) => void;
  user: CandidateProfile | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentStage, setStage, user }) => {
  const isAdmin = !user && (currentStage === AssessmentStage.RESULTS || currentStage === AssessmentStage.PROCESS_GUIDE || currentStage === AssessmentStage.PROFILE); 
  const isProfileActive = currentStage === AssessmentStage.PROFILE;

  // Navigation defined by "Perspective"
  const studentStages = [
    { key: AssessmentStage.PROCESS_GUIDE, label: 'My Dashboard', icon: 'fa-th-large', sub: 'Home Base', unlocked: true },
    { key: AssessmentStage.ROLE_SELECTION, label: 'Targeting', icon: 'fa-crosshairs', sub: 'Role Selection', unlocked: true },
    { key: AssessmentStage.RESUME, label: 'Resume Lab', icon: 'fa-file-signature', sub: 'Selection Gate', unlocked: !!user?.selectedRole },
    { key: AssessmentStage.TECHNICAL_CODING, label: 'Skill Forge', icon: 'fa-microchip', sub: 'LeetCode Gate', unlocked: !!user?.isResumePassed },
    { key: AssessmentStage.INTERVIEW, label: 'AI Interview', icon: 'fa-comment-dots', sub: 'Personality', unlocked: !!user?.isCodingPassed },
    { key: AssessmentStage.RESULTS, label: 'Success Report', icon: 'fa-award', sub: 'Job Readiness', unlocked: !!user?.isInterviewPassed },
  ];

  const adminStages = [
    { key: AssessmentStage.RESULTS, label: 'Ecosystem Pulse', icon: 'fa-chart-network', sub: 'Global Intelligence', unlocked: true },
    { key: AssessmentStage.PROCESS_GUIDE, label: 'Audit Streams', icon: 'fa-fingerprint', sub: 'System Logs', unlocked: true },
  ];

  const currentStages = isAdmin ? adminStages : studentStages;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-20 transition-all duration-500">
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors ${isAdmin ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
              <i className={`fas ${isAdmin ? 'fa-shield-check' : 'fa-brain'} text-xl`}></i>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter leading-none">HireAI</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{isAdmin ? 'Admin Root' : 'Talent Portal'}</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6 ml-2">
            {isAdmin ? 'Management Console' : 'Selection Pipeline'}
          </div>
          {currentStages.map((s) => {
            const isActive = currentStage === s.key && !isProfileActive;
            const isUnlocked = isAdmin || (s as any).unlocked;
            return (
              <button
                key={s.key}
                disabled={!isUnlocked}
                onClick={() => setStage(s.key as AssessmentStage)}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative ${
                  isActive
                    ? `${isAdmin ? 'bg-emerald-600/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20'} translate-x-1`
                    : isUnlocked ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-700 opacity-40 cursor-not-allowed'
                }`}
              >
                {isActive && (
                   <div className={`absolute left-0 w-1 h-6 rounded-r-full ${isAdmin ? 'bg-emerald-500' : 'bg-white'}`}></div>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? (isAdmin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/20 text-white') 
                    : isUnlocked ? 'bg-slate-900 group-hover:bg-slate-800' : 'bg-slate-900/50'
                }`}>
                  <i className={`fas ${isUnlocked ? s.icon : 'fa-lock'} text-sm`}></i>
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="font-bold text-sm tracking-tight">{s.label}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-widest opacity-40 ${isActive ? 'opacity-100' : ''}`}>{s.sub}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Sidebar Footer based on Perspective */}
        <div className="p-6 border-t border-white/5">
          {isAdmin ? (
            <div className="bg-emerald-500/5 rounded-2xl p-5 border border-emerald-500/10">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-emerald-500/60 uppercase">Cloud Health</span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Uptime</span>
                    <span className="text-white">99.99%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{width: '99%'}}></div>
                  </div>
               </div>
            </div>
          ) : (
            <div className="bg-indigo-600/5 rounded-2xl p-5 border border-indigo-600/10">
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="text-slate-500 font-bold uppercase tracking-wider">Overall Progress</span>
                <span className="text-indigo-400 font-black">
                  {user?.isInterviewPassed ? '100' : user?.isCodingPassed ? '80' : user?.isResumePassed ? '50' : user?.selectedRole ? '25' : '10'}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                  style={{ width: `${user?.isInterviewPassed ? 100 : user?.isCodingPassed ? 80 : user?.isResumePassed ? 50 : user?.selectedRole ? 25 : 10}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-10 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium text-xs uppercase tracking-widest">{isAdmin ? 'Operational Suite' : 'Selection Process'}</span>
            <i className="fas fa-chevron-right text-[10px] text-slate-300"></i>
            <span className="text-slate-900 font-black text-lg">
              {isProfileActive ? 'My Profile' : currentStages.find((s) => s.key === currentStage)?.label}
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/50 shadow-inner">
              <i className="fas fa-clock text-slate-400 text-xs"></i>
              <span className="text-xs font-bold text-slate-600">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <div className="w-px h-6 bg-slate-200"></div>

            {/* Profile Navigation Button */}
            <button 
              onClick={() => setStage(AssessmentStage.PROFILE)}
              className={`flex items-center space-x-4 pl-2 p-1.5 rounded-2xl transition-all duration-300 group hover:bg-slate-100 ${isProfileActive ? 'bg-slate-100 ring-2 ring-indigo-500/10' : ''}`}
            >
              <div className="text-right hidden sm:block">
                <p className={`text-sm font-black leading-none mb-1 transition-colors ${isProfileActive ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                  {isAdmin ? 'System Root' : user?.name || 'Candidate Name'}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {isAdmin ? 'Super Admin' : user?.university || 'Academic Explorer'}
                </p>
              </div>
              <div className="relative">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 border-2 border-white overflow-hidden ${
                  isProfileActive 
                    ? 'scale-105 bg-indigo-600 rotate-3' 
                    : `${isAdmin ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-500 to-purple-600'} group-hover:scale-105 group-hover:-rotate-3`
                }`}>
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-black text-sm">{isAdmin ? 'A' : (user?.name || 'C').charAt(0)}</span>
                  )}
                </div>
                <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${isAdmin ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-10 animate-page-entry">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
