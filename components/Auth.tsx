
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

    // Artificial delay for realism
    await new Promise(r => setTimeout(r, 800));

    try {
      if (isAdmin) {
        if (email === 'admin@hireai.io' && password === 'admin123') {
          onSuccess('admin_root');
        } else {
          setError('Invalid Admin Credentials.');
          setIsLoading(false);
        }
      } else {
        // Local Mock Registration/Login
        const userId = email.replace(/[^a-zA-Z0-9]/g, '_');
        onSuccess(userId);
      }
    } catch (err: any) {
      setError('Authentication failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-700 ${isAdmin ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-900 font-black text-sm tracking-tight">Accessing Secure Vault...</p>
          </div>
        </div>
      )}

      <button onClick={onBack} className={`absolute top-10 left-10 font-bold flex items-center space-x-2 z-10 ${isAdmin ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-indigo-600'}`}>
        <i className="fas fa-arrow-left"></i>
        <span>Return</span>
      </button>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-3">
          <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl mb-6 transition-all duration-500 ${isAdmin ? 'bg-emerald-600 shadow-emerald-500/20 rotate-12' : 'bg-indigo-600 shadow-indigo-500/20'}`}>
            <i className={`fas ${isAdmin ? 'fa-shield-keyhole' : 'fa-graduation-cap'} text-3xl text-white`}></i>
          </div>
          <h2 className={`text-4xl font-black tracking-tighter ${isAdmin ? 'text-white' : 'text-slate-900'}`}>
            {isAdmin ? 'Recruiter Login' : (stage === AuthStage.LOGIN ? 'Welcome Back' : 'Create Account')}
          </h2>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isAdmin ? 'text-emerald-500/60' : 'text-indigo-600/60'}`}>
            {isAdmin ? 'Authorized Portal' : 'Local Persistence Active'}
          </p>
        </div>

        <div className={`p-10 rounded-[3rem] border transition-all duration-500 ${isAdmin ? 'bg-slate-900/50 backdrop-blur-xl border-white/5 shadow-2xl' : 'bg-white border-slate-100 shadow-xl'}`}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center space-x-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}
            
            {stage === AuthStage.REGISTER && !isAdmin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="hireai-input" required />
              </div>
            )}
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className={`hireai-input ${isAdmin ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : ''}`} required />
            </div>
            <div className="space-y-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${isAdmin ? 'text-slate-500' : 'text-slate-400'}`}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`hireai-input ${isAdmin ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : ''}`} required />
            </div>

            <button type="submit" className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl ${isAdmin ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
              {isAdmin ? 'Unlock Dashboard' : (stage === AuthStage.LOGIN ? 'Sign In' : 'Join Pipeline')}
            </button>
          </form>

          {!isAdmin && (
            <div className="text-center pt-6">
              <p className="text-xs text-slate-500 font-bold">
                {stage === AuthStage.LOGIN ? "New to HireAI?" : "Existing Talent?"}
                <button onClick={() => onToggle(stage === AuthStage.LOGIN ? AuthStage.REGISTER : AuthStage.LOGIN)} className="ml-2 text-indigo-600 font-black">
                  {stage === AuthStage.LOGIN ? 'Create Account' : 'Log In'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
