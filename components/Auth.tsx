import React, { useState } from 'react';
import { AuthStage, UserRole } from '../types';
import Loading from './Loading';

interface AuthProps {
  role: UserRole;
  stage: AuthStage;
  onToggle: (stage: AuthStage) => void;
  onSuccess: (userId: string) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ role, stage, onToggle, onSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState('');
  
  const isLogin = stage === AuthStage.LOGIN;

  const performHandshake = async (id: string) => {
    setIsProcessing(true);
    const steps = [
      'Establishing Secure Tunnel...',
      'Verifying Identity Tokens...',
      'Neural Handshake Synchronized.',
      'Decrypting User Vault...'
    ];

    for (const step of steps) {
      setHandshakeStep(step);
      await new Promise(r => setTimeout(r, 600));
    }

    onSuccess(id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    // Generate a consistent ID from email for demo persistence
    const userId = `u_${btoa(email).substring(0, 8).toLowerCase()}`;
    performHandshake(userId);
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login popup logic
    const googleId = `g_${Math.random().toString(36).substring(2, 10)}`;
    performHandshake(googleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7ff] via-[#ffffff] to-[#fff0f5] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Soft Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-200/20 blur-[120px] rounded-full animate-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-rose-100/30 blur-[120px] rounded-full animate-float [animation-delay:2s]"></div>

      {/* Back navigation */}
      {!isProcessing && (
        <button 
          onClick={onBack} 
          className="absolute top-8 left-8 flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all z-20 group"
        >
          <i className="fas fa-arrow-left text-[10px]"></i>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </button>
      )}

      <div className="w-full max-w-[500px] flex flex-col items-center animate-reveal relative z-10">
        {/* Purple Robot Icon Hub */}
        <div className="w-20 h-20 bg-[#5551ff] rounded-[2rem] flex items-center justify-center shadow-[0_15px_40px_rgba(85,81,255,0.3)] mb-8 transition-transform hover:rotate-6">
          <i className="fas fa-robot text-white text-3xl"></i>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-[2.75rem] font-black text-[#0a0d1a] tracking-tight-xl leading-none mb-2">
            {isLogin ? 'Welcome Back' : 'Join Infrastructure'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-[#5551ff] uppercase tracking-[0.2em]">
            <span className={`w-1.5 h-1.5 rounded-full bg-[#5551ff] ${isProcessing ? 'animate-ping' : 'animate-pulse'}`}></span>
            {isProcessing ? 'Neural Synchronization in Progress' : 'Cloud Pipeline Online'}
          </div>
        </div>

        {/* The White Card Hub */}
        <div className="bg-white rounded-[3.5rem] w-full p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-white/40 backdrop-blur-sm relative overflow-hidden min-h-[500px] flex flex-col">
          {isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-reveal">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-[2.5rem]"></div>
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-[2.5rem] border-t-transparent animate-spin"></div>
                <i className="fas fa-shield-halved absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl text-indigo-400"></i>
              </div>
              <div className="text-center space-y-2">
                <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{handshakeStep}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Proprietary Verification Protocol</p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-8 animate-reveal">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Cloud Identifier (Email)
                    </label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="id@hireai.io" 
                      className="w-full bg-[#f4f7fb] border-none rounded-2xl px-8 py-5 text-[#0a0d1a] font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Secure Passphrase
                    </label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      className="w-full bg-[#f4f7fb] border-none rounded-2xl px-8 py-5 text-[#0a0d1a] font-medium text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-300" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-5 bg-[#0a0d1a] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(10,13,26,0.15)]"
                >
                  Verify & Continue
                </button>
              </form>

              <div className="mt-10 space-y-8 animate-reveal">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-50"></div>
                  </div>
                  <span className="relative bg-white px-6 text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">
                    Social Identity Hub
                  </span>
                </div>

                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-4 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="Google" />
                  <span>Login with Google</span>
                </button>

                <div className="text-center pt-2">
                  <button 
                    onClick={() => onToggle(isLogin ? AuthStage.REGISTER : AuthStage.LOGIN)}
                    className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all"
                  >
                    {isLogin ? "Don't have an account? Join Now" : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;