
import React from 'react';
import { UserRole } from '../types';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Animated Gradients */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>

      <nav className="container mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <i className="fas fa-brain text-xl"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter">HireAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors">Solutions</a>
          <a href="#" className="hover:text-white transition-colors">Company</a>
          <button onClick={() => onSelectRole(UserRole.ADMIN)} className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all">
            Recruiter Access
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest animate-bounce">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
            <span>V2.0 is now live</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1]">
            Next-Gen Hiring <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Starts with AI.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Unified ecosystem for objective skill assessment, proctored testing, and multimodal interviews. Empowering the future workforce.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button
              onClick={() => onSelectRole(UserRole.STUDENT)}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-500/40 transition-all flex items-center justify-center space-x-3 group"
            >
              <span>Get Started as Talent</span>
              <i className="fas fa-rocket group-hover:translate-x-1 transition-transform"></i>
            </button>
            <button
              onClick={() => onSelectRole(UserRole.ADMIN)}
              className="w-full sm:w-auto px-10 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center space-x-3"
            >
              <span>Employer Portal</span>
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Successful Placements', val: '12k+' },
            { label: 'AI Assessments', val: '500k+' },
            { label: 'Interview Hours', val: '2.5M' },
            { label: 'Partner Orgs', val: '150+' },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-3xl font-black text-indigo-400">{stat.val}</div>
              <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Landing;
