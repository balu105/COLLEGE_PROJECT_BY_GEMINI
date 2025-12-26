import React from 'react';
import { CandidateProfile } from '../../types';

interface StudentDashboardProps {
  onStart: () => void;
  user: CandidateProfile | null;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onStart, user }) => {
  const phases = [
    {
      id: '01',
      title: 'Target Calibration',
      subtitle: 'PHASE 01: DEFINING THE GOAL',
      status: 'READY',
      icon: 'fa-crosshairs',
      active: true,
      color: 'indigo'
    },
    {
      id: '02',
      title: 'Neural Scanning',
      subtitle: 'PHASE 02: SELECTION THRESHOLD (70%)',
      status: 'LOCKED',
      icon: 'fa-brain',
      active: false,
      color: 'slate'
    },
    {
      id: '03',
      title: 'Technical Forge',
      subtitle: 'PHASE 03: ALGORITHMIC RIGOR (60%)',
      status: 'LOCKED',
      icon: 'fa-terminal',
      active: false,
      color: 'slate'
    },
    {
      id: '04',
      title: 'Session Interaction',
      subtitle: 'PHASE 04: BEHAVIORAL ANALYSIS',
      status: 'LOCKED',
      icon: 'fa-video',
      active: false,
      color: 'slate'
    }
  ];

  const activityLog = [
    { title: 'Node Initialized', status: 'JUST NOW', icon: 'fa-check', completed: true },
    { title: 'Resume Analysis', status: 'AWAITING INPUT', icon: 'fa-file-lines', completed: false, current: true },
    { title: 'Code Verification', status: 'AWAITING VERIFICATION', icon: 'fa-code', completed: false },
    { title: 'Final Readiness', status: 'SYSTEM LOCKED', icon: 'fa-shield-lock', completed: false }
  ];

  return (
    <div className="space-y-16 animate-reveal">
      {/* High-Fidelity Hero Hub */}
      <div className="bg-[#0a0d1a] rounded-[3.5rem] p-16 md:p-24 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[120px] rounded-full -mr-60 -mt-60"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
               <span className="w-1.5 h-1.5 bg-[#5551ff] rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Proprietary Talent Pipeline Hub</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-[5rem] md:text-[6.5rem] font-black text-white leading-[0.9] tracking-tight-xl">
                Elevate Your<br />
                <span className="text-[#a5a2ff]">Industry Footprint.</span>
              </h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
                Your assessment journey is a multi-stage neural gating process. Pass each industrial benchmark to unlock higher-tier technical verification.
              </p>
            </div>

            <button 
              onClick={onStart}
              className="cta-primary !px-12 !py-6 !bg-[#5551ff] shadow-[0_20px_40px_-10px_rgba(85,81,255,0.4)]"
            >
              <span className="text-sm">Start Career Targeting</span>
              <i className="fas fa-arrow-right-long text-[10px] opacity-80"></i>
            </button>
          </div>

          {/* Neural Status Panel */}
          <div className="w-full lg:w-[460px] shrink-0">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-12 rounded-[3.5rem] space-y-12 shadow-2xl">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Neural Status</p>
                <p className="text-5xl font-black text-white tracking-tighter">Offline</p>
              </div>

              <div className="h-px bg-white/5"></div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Selection Prob.</p>
                   <p className="text-sm font-black text-indigo-400 tracking-widest">0%</p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500/20 w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left: Neural Gating Phases */}
        <div className="lg:col-span-2 space-y-12">
           <div className="flex items-center gap-6 px-4">
              <h3 className="text-3xl font-black text-[#020410] tracking-tight uppercase">Neural Gating Phases</h3>
              <div className="flex items-center gap-3">
                 <span className="w-2 h-2 bg-[#5551ff] rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Tracking</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {phases.map((phase) => (
                <div 
                  key={phase.id} 
                  className={`bg-slate-50 border border-slate-100 rounded-[3rem] p-10 flex flex-col justify-between min-h-[280px] group transition-all ${phase.active ? 'hover:shadow-2xl hover:border-indigo-100 hover:bg-white' : 'opacity-60 cursor-not-allowed'}`}
                >
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${phase.active ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-200 text-slate-400'}`}>
                        <i className={`fas ${phase.icon} text-lg`}></i>
                      </div>
                      <div className="w-24 h-24 bg-slate-100/50 rounded-full blur-2xl absolute -z-10 group-hover:bg-indigo-500/10 transition-colors"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{phase.subtitle}</p>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{phase.title}</h4>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-slate-100">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${phase.active ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {phase.status}
                    </span>
                    {phase.active && (
                      <button 
                        onClick={onStart}
                        className="w-10 h-10 bg-[#5551ff] rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform"
                      >
                        <i className="fas fa-play text-[10px]"></i>
                      </button>
                    )}
                    {!phase.active && (
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <i className="fas fa-lock text-[10px]"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: Pipeline Activity & Verification Rules */}
        <div className="space-y-12">
           <h3 className="text-3xl font-black text-[#020410] tracking-tight px-4 uppercase">Pipeline Activity</h3>
           <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-12 flex flex-col space-y-12 shadow-sm relative overflow-hidden">
              <div className="space-y-12 relative">
                {/* Timeline Line */}
                <div className="absolute left-[23px] top-6 bottom-6 w-px bg-slate-200"></div>
                
                {activityLog.map((log, i) => (
                  <div key={i} className="flex items-start gap-8 relative z-10">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-50 ${log.completed ? 'bg-indigo-600 text-white' : log.current ? 'bg-white text-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white text-slate-200 border-slate-100'}`}>
                      <i className={`fas ${log.icon} text-[10px]`}></i>
                    </div>
                    <div className="space-y-1">
                      <p className={`text-[11px] font-black uppercase tracking-tight ${log.completed || log.current ? 'text-slate-900' : 'text-slate-400'}`}>{log.title}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.status}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Verification Rules Card */}
              <div className="bg-[#020410] rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                    <i className="fas fa-shield-halved text-xs"></i>
                  </div>
                  <h5 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Verification Rules</h5>
                </div>
                
                <ul className="space-y-3">
                  {[
                    '- Resume Benchmark: 70%+',
                    '- Logic Correctness: 60%+',
                    '- Integrity Violations: 0'
                  ].map((rule, i) => (
                    <li key={i} className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-loose">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
           </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="flex items-center justify-center pt-10 pb-20">
        <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.5em]">
          HireAI Infrastructure V4.5.2 • Edge Protocol Secured
        </p>
      </div>
    </div>
  );
};

export default StudentDashboard;