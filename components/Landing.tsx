
import React from 'react';
import { UserRole } from '../types';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden relative">
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/5 blur-[120px] rounded-full"></div>

      <nav className="container mx-auto px-8 py-10 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
            <i className="fas fa-terminal text-sm"></i>
          </div>
          <span className="text-2xl font-black tracking-tighter">HireAI</span>
        </div>
        <div className="hidden md:flex items-center space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          <a href="#" className="hover:text-white transition-colors">Core Infrastructure</a>
          <a href="#" className="hover:text-white transition-colors">Security</a>
          <button onClick={() => onSelectRole(UserRole.ADMIN)} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
            Internal Console
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-8 pt-20 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
            <span>Proprietary Recruitment Node v4.0</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.95]">
            Engineered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-indigo-400">
              For Precision.
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            A high-performance recruitment ecosystem developed for objective skill quantification and adaptive interview automation. Built for the modern enterprise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
            <button
              onClick={() => onSelectRole(UserRole.STUDENT)}
              className="w-full sm:w-auto px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-3"
            >
              <span>Initialize Career Hub</span>
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
            <button
              onClick={() => onSelectRole(UserRole.ADMIN)}
              className="w-full sm:w-auto px-12 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
            >
              <span>Admin Gateway</span>
            </button>
          </div>

          <div className="pt-20 border-t border-white/5">
             <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em]">Developed & Maintained by Alex Rivera</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
