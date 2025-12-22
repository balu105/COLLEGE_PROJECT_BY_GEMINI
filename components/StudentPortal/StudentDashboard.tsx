
import React from 'react';
import { CandidateProfile } from '../../types';

interface StudentDashboardProps {
  onStart: () => void;
  user: CandidateProfile | null;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onStart, user }) => {
  const steps = [
    { 
      title: 'Target Selection', 
      icon: 'fa-crosshairs', 
      status: user?.selectedRole ? 'completed' : 'ready', 
      color: 'indigo', 
      sub: 'Phase 01: Path Definition' 
    },
    { 
      title: 'Resume Lab', 
      icon: 'fa-file-invoice', 
      status: user?.isResumePassed ? 'completed' : (user?.selectedRole ? 'ready' : 'locked'), 
      color: 'blue', 
      sub: 'Phase 02: Selection Gate (70%)' 
    },
    { 
      title: 'Skill Forge', 
      icon: 'fa-terminal', 
      status: user?.isCodingPassed ? 'completed' : (user?.isResumePassed ? 'ready' : 'locked'), 
      color: 'purple', 
      sub: 'Phase 03: LeetCode (60%)' 
    },
    { 
      title: 'AI Interview', 
      icon: 'fa-comment-dots', 
      status: user?.isCodingPassed ? 'ready' : 'locked', 
      color: 'emerald', 
      sub: 'Phase 04: Communication' 
    },
  ];

  const timeline = [
    { event: 'Application Initialized', date: 'Just now', icon: 'fa-check', completed: true },
    { event: 'Resume Benchmark', date: user?.isResumePassed ? 'Passed' : (user?.resumeScore ? 'Score Below 70' : 'Awaiting Analysis'), icon: 'fa-file-signature', completed: user?.isResumePassed || false },
    { event: 'Technical Verification', date: user?.isCodingPassed ? 'Cleared' : 'Pending', icon: 'fa-code', completed: user?.isCodingPassed || false },
    { event: 'Employment Readiness', date: user?.isInterviewPassed ? 'Ready' : 'Locked', icon: 'fa-gavel', completed: user?.isInterviewPassed || false },
  ];

  return (
    <div className="space-y-12 pb-20 animate-page-entry">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-100/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full -ml-20 -mb-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border border-indigo-500/20">
                Talent Pipeline Active
              </span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter leading-none">
              Selection <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-indigo-500">Funnel Portal.</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
              Each stage is a gate. You must meet industry performance benchmarks to proceed to technical challenges and interviews.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onStart}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-indigo-700 transition-all flex items-center space-x-3 shadow-xl shadow-indigo-500/30 group"
              >
                <span>{user?.selectedRole ? 'Resume Selection Tasks' : 'Start Path Selection'}</span>
                <i className="fas fa-bolt group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 relative group">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Gate Status</p>
              <p className="text-3xl font-black text-white">
                {user?.isCodingPassed ? 'Interview' : user?.isResumePassed ? 'Skill Forge' : user?.selectedRole ? 'Resume Lab' : 'Pre-Selection'}
              </p>
              <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Selection Probability</span>
                  <span className="text-indigo-400">{user?.resumeScore || 0}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{width: `${user?.resumeScore || 0}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment Funnel</h3>
            <div className="flex items-center space-x-2">
               <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></span>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Gating</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className={`hireai-card p-10 relative overflow-hidden group ${step.status === 'locked' ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${step.color}-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125`}></div>
                <div className={`w-14 h-14 bg-${step.color}-50 text-${step.color}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner`}>
                  <i className={`fas ${step.icon} text-2xl`}></i>
                </div>
                <div className="space-y-1">
                   <h4 className="text-xl font-black text-slate-900">{step.title}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.sub}</p>
                </div>
                <div className="flex items-center justify-between mt-10">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    step.status === 'ready' ? 'text-indigo-500' : step.status === 'completed' ? 'text-emerald-500' : 'text-slate-400'
                  }`}>
                    {step.status}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    step.status === 'completed' ? 'bg-emerald-50 text-emerald-500' : (step.status === 'ready' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-50 text-slate-300')
                  }`}>
                    <i className={`fas ${step.status === 'completed' ? 'fa-check' : (step.status === 'ready' ? 'fa-arrow-right' : 'fa-lock')} text-sm`}></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Selection Pipeline</h3>
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10 relative">
            <div className="absolute left-14 top-24 bottom-24 w-px bg-slate-100"></div>
            {timeline.map((item, i) => (
              <div key={i} className={`flex items-start space-x-6 relative z-10 ${!item.completed && i > 0 ? 'opacity-40' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg transition-all ${
                  item.completed ? 'bg-indigo-600 text-white ring-4 ring-indigo-50' : 'bg-white border border-slate-200 text-slate-300'
                }`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-black text-slate-900">{item.event}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</p>
                </div>
              </div>
            ))}

            <div className="pt-8 mt-10 border-t border-slate-50 text-center">
               <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100/50">
                  <i className="fas fa-shield-check text-indigo-500 mb-3 text-xl"></i>
                  <p className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">System Gate Rules</p>
                  <ul className="text-[10px] text-indigo-700/70 font-medium leading-relaxed text-left space-y-1">
                     <li>• Resume score ≥ 70% to unlock Forge.</li>
                     <li>• Code correctness ≥ 60% for Interview.</li>
                     <li>• Re-upload resume anytime to improve.</li>
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
