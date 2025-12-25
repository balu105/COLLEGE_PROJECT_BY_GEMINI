
import React from 'react';
import { CandidateProfile } from '../../types';

interface StudentDashboardProps {
  onStart: () => void;
  user: CandidateProfile | null;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onStart, user }) => {
  const steps = [
    { 
      title: 'Target Calibration', 
      icon: 'fa-crosshairs', 
      status: user?.selectedRole ? 'completed' : 'ready', 
      color: 'indigo', 
      sub: 'Phase 01: Defining the Goal' 
    },
    { 
      title: 'Neural Scanning', 
      icon: 'fa-fingerprint', 
      status: user?.isResumePassed ? 'completed' : (user?.selectedRole ? 'ready' : 'locked'), 
      color: 'blue', 
      sub: 'Phase 02: Selection Threshold (70%)' 
    },
    { 
      title: 'Technical Forge', 
      icon: 'fa-terminal', 
      status: user?.isCodingPassed ? 'completed' : (user?.isResumePassed ? 'ready' : 'locked'), 
      color: 'indigo', 
      sub: 'Phase 03: Algorithmic Rigor (60%)' 
    },
    { 
      title: 'Session Interaction', 
      icon: 'fa-video', 
      status: user?.isCodingPassed ? 'ready' : (user?.isInterviewPassed ? 'completed' : 'locked'), 
      color: 'emerald', 
      sub: 'Phase 04: Behavioral Analysis' 
    },
  ];

  const timeline = [
    { event: 'Node Initialized', date: 'Just now', icon: 'fa-check', completed: true },
    { event: 'Resume Analysis', date: user?.isResumePassed ? 'Threshold Met' : (user?.resumeScore ? 'Below Threshold' : 'Awaiting Input'), icon: 'fa-file-shield', completed: user?.isResumePassed || false },
    { event: 'Code Verification', date: user?.isCodingPassed ? 'Protocol Passed' : 'Awaiting Verification', icon: 'fa-microchip', completed: user?.isCodingPassed || false },
    { event: 'Final Readiness', date: user?.isInterviewPassed ? 'Market Ready' : 'System Locked', icon: 'fa-award', completed: user?.isInterviewPassed || false },
  ];

  return (
    <div className="space-y-12 animate-page-entry">
      {/* Hero Mission Control Card */}
      <div className="bg-[#0b0f1a] rounded-[4rem] p-14 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(11,15,26,0.25)] border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/5 blur-[120px] rounded-full -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col xl:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8 text-center xl:text-left">
            <div className="inline-flex items-center gap-4 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] shadow-inner">
              <span className="w-2 h-2 bg-indigo-500 rounded-full pulse-soft"></span>
              <span>Proprietary Talent Pipeline Hub</span>
            </div>
            
            <h2 className="text-6xl font-black tracking-tighter leading-tight font-display">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Industry Footprint.</span>
            </h2>
            
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto xl:mx-0">
              Your assessment journey is a multi-stage neural gating process. Pass each industrial benchmark to unlock higher-tier technical verification.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center xl:justify-start">
              <button 
                onClick={onStart}
                className="px-14 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm hover:bg-indigo-500 transition-all flex items-center gap-4 shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] group"
              >
                <span>{user?.selectedRole ? 'Continue Pipeline Tasks' : 'Start Career Targeting'}</span>
                <i className="fas fa-arrow-right text-xs group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>
          </div>

          <div className="w-full xl:w-96 space-y-4">
            <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Neural Status</p>
              <p className="text-3xl font-black text-white tracking-tight">
                {user?.isCodingPassed ? 'Interview Ready' : user?.isResumePassed ? 'Forge Pending' : user?.selectedRole ? 'Scan Active' : 'Offline'}
              </p>
              
              <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Selection Prob.</span>
                  <span className="text-indigo-400">{user?.resumeScore || 0}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-1000" style={{width: `${user?.resumeScore || 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Funnel & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-950 tracking-tight font-display">Neural Gating Phases</h3>
            <div className="flex items-center gap-3">
               <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full animate-pulse"></span>
               <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tracking</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className={`hireai-card p-10 relative overflow-hidden group shadow-soft ${step.status === 'locked' ? 'opacity-50 grayscale-0 border-dashed bg-slate-50/50' : 'cursor-pointer'}`}>
                <div className={`absolute top-0 right-0 w-36 h-36 bg-${step.color}-600/5 rounded-full -mr-18 -mt-18 transition-transform group-hover:scale-150 duration-1000`}></div>
                
                <div className={`w-16 h-16 bg-${step.color}-50 text-${step.color}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-${step.color}-100/50`}>
                  <i className={`fas ${step.icon} text-2xl transition-transform group-hover:scale-110`}></i>
                </div>
                
                <div className="space-y-2">
                   <h4 className="text-xl font-black text-slate-950">{step.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{step.sub}</p>
                </div>
                
                <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-50">
                  <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${
                    step.status === 'ready' ? 'text-indigo-600' : step.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
                  }`}>
                    {step.status}
                  </span>
                  <div className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center transition-all shadow-sm ${
                    step.status === 'completed' ? 'bg-emerald-600 text-white' : (step.status === 'ready' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400')
                  }`}>
                    <i className={`fas ${step.status === 'completed' ? 'fa-check' : (step.status === 'ready' ? 'fa-play' : 'fa-lock')} text-sm`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Progress Timeline */}
        <div className="space-y-10">
          <h3 className="text-2xl font-black text-slate-950 tracking-tight font-display">Pipeline Activity</h3>
          <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-premium space-y-12 relative overflow-hidden">
            <div className="absolute left-16 top-28 bottom-28 w-[2px] bg-slate-100"></div>
            
            {timeline.map((item, i) => (
              <div key={i} className={`flex items-start gap-8 relative z-10 transition-opacity duration-700 ${!item.completed && i > 0 ? 'opacity-30' : ''}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs shadow-lg transition-all flex-shrink-0 ${
                  item.completed ? 'bg-indigo-600 text-white ring-8 ring-indigo-50' : 'bg-white border border-slate-200 text-slate-300'
                }`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="space-y-1.5 py-1">
                  <p className="text-sm font-black text-slate-950 leading-none">{item.event}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.date}</p>
                </div>
              </div>
            ))}

            <div className="pt-10 mt-6 border-t border-slate-100 text-center">
               <div className="bg-slate-950 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                  <i className="fas fa-shield-halved text-indigo-400 mb-4 text-2xl"></i>
                  <p className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-3">Verification Rules</p>
                  <ul className="text-[10px] text-slate-500 font-bold uppercase leading-loose text-left space-y-1 tracking-tight">
                     <li>• Resume benchmark: 70%+</li>
                     <li>• Logic correctness: 60%+</li>
                     <li>• Integrity violations: 0</li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
