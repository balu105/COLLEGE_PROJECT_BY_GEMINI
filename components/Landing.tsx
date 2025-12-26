import React from 'react';
import { UserRole } from '../types';

interface LandingProps {
  onSelectRole: (role: UserRole) => void;
}

const Landing: React.FC<LandingProps> = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-[#020410] relative flex flex-col overflow-hidden selection:bg-brand-indigo/30 font-sans">
      {/* Neural Atmosphere Layer */}
      <div className="neural-bg">
        <div className="bg-grid-ambient opacity-20"></div>
        <div className="glow-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] opacity-[0.15]"></div>
        <div className="scanline"></div>
      </div>
      
      {/* Precision Header Navigation */}
      <header className="relative z-50 flex items-center justify-between px-6 md:px-24 py-10 w-full">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-[#5551ff] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(85,81,255,0.3)] border border-white/10">
            <i className="fas fa-terminal text-white text-sm"></i>
          </div>
          <span className="text-2xl font-black text-white tracking-tighter leading-none">HireAI</span>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Core Infrastructure</span>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer">Security</span>
          </div>
          <button 
            onClick={() => onSelectRole(UserRole.ADMIN)}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all"
          >
            Internal Console
          </button>
        </div>
      </header>

      {/* Hero Central Hub */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 -mt-10">
        <div className="animate-reveal max-w-5xl w-full space-y-12">
          {/* Node Specification Badge */}
          <div className="inline-flex items-center px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] backdrop-blur-md">
            Proprietary Recruitment Node V4.0
          </div>
          
          {/* Engineered Headline */}
          <div className="space-y-0">
            <h1 className="text-[4.5rem] md:text-[8.5rem] font-black tracking-[-0.05em] leading-[0.9] text-white">
              Engineered<br />
              <span className="text-[#a5a2ff]">For Precision.</span>
            </h1>
          </div>
          
          <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
            A high-performance recruitment ecosystem developed for objective skill quantification and adaptive interview automation. Built for the modern enterprise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <div className="relative group">
              {/* Outer Glow Effect */}
              <div className="absolute inset-0 bg-indigo-600/30 blur-2xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <button
                onClick={() => onSelectRole(UserRole.STUDENT)}
                className="relative cta-primary !px-12 !py-6 !bg-[#5551ff] shadow-[0_20px_40px_-10px_rgba(85,81,255,0.4)]"
              >
                <span className="text-sm">Initialize Career Hub</span>
                <i className="fas fa-chevron-right text-[10px] opacity-80"></i>
              </button>
            </div>
            
            <button
              onClick={() => onSelectRole(UserRole.ADMIN)}
              className="px-12 py-6 bg-white/[0.03] border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest text-white hover:bg-white/[0.08] transition-all"
            >
              Admin Gateway
            </button>
          </div>
        </div>
      </main>

      {/* Corporate Footer Linkage */}
      <footer className="relative z-10 pb-12 text-center w-full px-10">
        <div className="max-w-7xl mx-auto">
          <div className="h-px w-full bg-white/5 mb-8"></div>
          <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.4em]">
            Developed & Maintained By Sasy Rivers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;