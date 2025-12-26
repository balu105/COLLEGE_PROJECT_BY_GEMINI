import React from 'react';

interface LoadingProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  message = "Neural Processing...", 
  subMessage = "Aligning Proprietary Algorithms",
  fullScreen = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center text-center space-y-8 animate-reveal">
      <div className="relative w-24 h-24">
        {/* Animated Glow Rings */}
        <div className="absolute inset-0 border border-indigo-500/10 rounded-[2.5rem] rotate-12 animate-pulse"></div>
        <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-[2.5rem] -rotate-12 animate-pulse [animation-delay:200ms]"></div>
        
        {/* Core Spinner */}
        <div className="absolute inset-0 border-4 border-indigo-600/10 rounded-[2.5rem]"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-[2.5rem] border-t-transparent animate-spin-slow shadow-[0_0_30px_rgba(85,81,255,0.4)]"></div>
        
        {/* Center Icon */}
        <i className="fas fa-terminal absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-400"></i>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">{message}</h3>
        <div className="flex items-center justify-center gap-3">
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
          </div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{subMessage}</p>
        </div>
      </div>
      
      {/* Precision Checksums */}
      <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 w-full max-w-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[7px] font-black text-slate-600 uppercase">Latency</span>
          <span className="text-[9px] font-mono text-indigo-400/60">12.4ms</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[7px] font-black text-slate-600 uppercase">Integrity</span>
          <span className="text-[9px] font-mono text-emerald-400/60">VALID</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[7px] font-black text-slate-600 uppercase">Buffer</span>
          <span className="text-[9px] font-mono text-blue-400/60">SYNCED</span>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#020410] z-[999] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-ambient opacity-20"></div>
        <div className="glow-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"></div>
        <div className="scanline"></div>
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;