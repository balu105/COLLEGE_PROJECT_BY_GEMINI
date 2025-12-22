
import React from 'react';

const AdminProfile: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500 pb-20">
      <div className="bg-white rounded-[3rem] p-12 border border-slate-200/60 shadow-xl shadow-slate-200/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-32 h-32 bg-slate-950 rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-white">
            A
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Administrator</h2>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Access Level: Level 10 (Root)</p>
          </div>
          <div className="flex space-x-4">
             <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black border border-emerald-100">Active Session</div>
             <div className="px-6 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black border border-indigo-100">Global Auth Enabled</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center">
            <i className="fas fa-shield-alt mr-3 text-indigo-500"></i>
            Security Credentials
          </h3>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">Multi-Factor Auth</p>
                <p className="text-[10px] text-slate-500">Enabled via Hardware Key</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                 <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-900">Auto-Logout</p>
                <p className="text-[10px] text-slate-500">30m inactivity trigger</p>
              </div>
              <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center px-1">
                 <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-sm space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center">
            <i className="fas fa-tools mr-3 text-amber-500"></i>
            System Preferences
          </h3>
          <div className="space-y-4">
             <button className="w-full p-5 rounded-2xl border border-slate-100 text-left hover:bg-slate-50 transition-all flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">Audit Log Retention</span>
                <i className="fas fa-chevron-right text-slate-300 text-[10px]"></i>
             </button>
             <button className="w-full p-5 rounded-2xl border border-slate-100 text-left hover:bg-slate-50 transition-all flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">API Usage Analytics</span>
                <i className="fas fa-chevron-right text-slate-300 text-[10px]"></i>
             </button>
             <button className="w-full p-5 rounded-2xl border border-slate-100 text-left hover:bg-slate-50 transition-all flex items-center justify-between">
                <span className="text-xs font-black text-slate-700">Model Configuration</span>
                <i className="fas fa-chevron-right text-slate-300 text-[10px]"></i>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
