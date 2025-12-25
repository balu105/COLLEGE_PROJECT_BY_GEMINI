
import React, { useState } from 'react';
import { AuthStage, UserRole } from '../types';

interface AuthProps {
  role: UserRole;
  stage: AuthStage;
  onToggle: (stage: AuthStage) => void;
  onSuccess: (userId: string) => void;
  onBack: () => void;
}

const Auth: React.FC<AuthProps> = ({ role, stage, onToggle, onSuccess, onBack }) => {
  const isAdmin = role === UserRole.ADMIN;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulated network latency for cloud handshake
    await new Promise(r => setTimeout(r, 1500));

    try {
      if (isAdmin) {
        if (email === 'admin@hireai.io' && password === 'admin123') {
          onSuccess('admin_root');
        } else {
          setError('Invalid Recruiter Credentials. Access Denied.');
          setIsLoading(false);
        }
      } else {
        // Create a unique deterministic ID from the email
        const userId = btoa(email.toLowerCase()).substring(0, 16);
        onSuccess(userId);
      }
    } catch (err: any) {
      setError('Connection to auth server failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate real-world Google OAuth redirect and callback
    await new Promise(r => setTimeout(r, 2000));
    
    const simulatedGoogleId = "goog_" + Math.random().toString(36).substring(2, 10);
    onSuccess(simulatedGoogleId);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-all duration-700 ${isAdmin ? 'bg-[#0f172a]' : 'bg-[#f8fafc]'}`}>
      {/* Background Decorative Elements */}
      <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${isAdmin ? 'bg-emerald-500/10' : 'bg-indigo-500/10'}`}></div>
      <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${isAdmin ? 'bg-indigo-500/5' : 'bg-purple-500/5'}`}></div>

      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md animate-in fade-in">
          <div className="text-center space-y-8">
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-600/10 rounded-[2rem] rotate-12"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-[2rem] border-t-transparent animate-spin"></div>
              <i className="fas fa-shield-check absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl text-indigo-600"></i>
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 font-black text-lg tracking-tight">Authenticating...</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">Establishing Secure Handshake</p>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={onBack} 
        disabled={isLoading}
        className={`absolute top-10 left-10 font-bold flex items-center space-x-3 z-10 transition-colors ${isAdmin ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-indigo-600'}`}
      >
        <i className="fas fa-arrow-left text-xs"></i>
        <span className="text-xs uppercase tracking-widest font-black">Back to Home</span>
      </button>

      <div className="w-full max-w-md relative z-10 space-y-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl transition-all duration-700 ${isAdmin ? 'bg-emerald-600 shadow-emerald-500/20 rotate-12 scale-110' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
            <i className={`fas ${isAdmin ? 'fa-fingerprint' : 'fa-user-astronaut'} text-4xl text-white`}></i>
          </div>
          <div className="space-y-1">
            <h2 className={`text-4xl font-black tracking-tighter ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
              {isAdmin ? 'System Root' : (stage === AuthStage.LOGIN ? 'Welcome Back' : 'Create Account')}
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${isAdmin ? 'bg-emerald-500' : 'bg-indigo-500'}`}></span>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAdmin ? 'text-emerald-500/60' : 'text-indigo-400'}`}>
                Cloud Pipeline Online
              </p>
            </div>
          </div>
        </div>

        <div className={`p-10 rounded-[3.5rem] border transition-all duration-700 ${isAdmin ? 'bg-slate-900/50 backdrop-blur-2xl border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-wider flex items-center space-x-3 animate-in shake-in">
                <i className="fas fa-triangle-exclamation text-base"></i>
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              {stage === AuthStage.REGISTER && !isAdmin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Display Name</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Alex Rivera" className="hireai-input !rounded-2xl" required />
                </div>
              )}
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Cloud Identifier (Email)</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="id@hireai.io" className={`hireai-input !rounded-2xl ${isAdmin ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : ''}`} required />
              </div>
              <div className="space-y-2">
                <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Secure Passphrase</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`hireai-input !rounded-2xl ${isAdmin ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : ''}`} required />
              </div>
            </div>

            <button type="submit" className={`w-full py-5 rounded-2xl font-black text-base shadow-2xl transition-all active:scale-95 ${isAdmin ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/20'}`}>
              {isAdmin ? 'Unlock Operational Suite' : (stage === AuthStage.LOGIN ? 'Verify & Continue' : 'Initialize Talent Profile')}
            </button>
          </form>

          {!isAdmin && (
            <>
              <div className="flex items-center my-10">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="px-5 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Social Identity Hub</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={handleGoogleAuth}
                  className="w-full py-4 bg-white border border-slate-200 rounded-2xl font-black text-[11px] text-slate-700 uppercase tracking-widest hover:border-indigo-300 hover:bg-slate-50 transition-all flex items-center justify-center space-x-4 shadow-sm group"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"/>
                    <path fill="#34A853" d="M16.04 18.013c-1.09.593-2.325.896-3.618.896a6.953 6.953 0 0 1-6.837-5.009L1.444 17.02C3.415 21.056 7.57 24 12.422 24c3.15 0 6.015-1.006 8.242-2.731l-4.624-3.256Z"/>
                    <path fill="#4285F4" d="M23.511 12.218c0-.825-.067-1.636-.211-2.427H12v4.591h6.464c-.286 1.514-1.145 2.8-2.424 3.631l4.624 3.256C23.36 18.84 24 15.65 24 12.218h-.489Z"/>
                    <path fill="#FBBC05" d="M5.266 14.235a7.124 7.124 0 0 1 0-4.47L1.24 6.65a11.96 11.96 0 0 0 0 10.7l4.026-3.115Z"/>
                  </svg>
                  <span>{stage === AuthStage.LOGIN ? 'Login with Google' : 'Register with Google'}</span>
                </button>
              </div>

              <div className="text-center pt-10">
                <button 
                  onClick={() => onToggle(stage === AuthStage.LOGIN ? AuthStage.REGISTER : AuthStage.LOGIN)} 
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
                >
                  {stage === AuthStage.LOGIN ? "Don't have an account? Join Now" : "Already a member? Sign In"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
