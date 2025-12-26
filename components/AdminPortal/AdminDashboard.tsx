import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/dbService';
import { CandidateProfile } from '../../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await dbService.getAllProfiles();
    setCandidates(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const metrics = [
    { label: 'Talent Pool', val: candidates.length, trend: 'Total Nodes', icon: 'fa-users-viewfinder', color: 'bg-indigo-600' },
    { label: 'Active Pipeline', val: candidates.filter(c => c.isResumePassed).length, trend: 'Screened', icon: 'fa-bolt-lightning', color: 'bg-amber-600' },
    { label: 'Technical Clear', val: candidates.filter(c => c.isCodingPassed).length, trend: 'Verified', icon: 'fa-terminal', color: 'bg-emerald-600' },
    { label: 'Final Selected', val: candidates.filter(c => c.isInterviewPassed).length, trend: 'Vaulted', icon: 'fa-certificate', color: 'bg-rose-600' },
  ];

  const funnelData = [
    { name: 'Initial', value: candidates.length, color: '#6366f1' },
    { name: 'Passed Resume', value: candidates.filter(c => c.isResumePassed).length, color: '#f59e0b' },
    { name: 'Passed Coding', value: candidates.filter(c => c.isCodingPassed).length, color: '#10b981' },
    { name: 'Passed Interview', value: candidates.filter(c => c.isInterviewPassed).length, color: '#4f46e5' },
  ];

  if (selectedCandidate) {
    return (
      <div className="space-y-10 animate-reveal pb-32">
        <button onClick={() => setSelectedCandidate(null)} className="flex items-center gap-3 text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] transition-all">
          <i className="fas fa-chevron-left"></i>
          <span>Terminal Hub</span>
        </button>

        <div className="hireai-card-solid overflow-hidden">
          <div className="p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
             <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-4xl font-black border border-white/10 shadow-2xl">
                   {selectedCandidate.avatarUrl ? <img src={selectedCandidate.avatarUrl} className="w-full h-full object-cover" /> : selectedCandidate.name.charAt(0)}
                </div>
                <div className="space-y-2">
                   <h2 className="text-4xl font-black text-white tracking-tighter">{selectedCandidate.name}</h2>
                   <div className="flex gap-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedCandidate.selectedRole || 'Undefined Vector'}</span>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-l border-white/10 pl-4">{selectedCandidate.email}</span>
                   </div>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">JRI Precision</p>
                <p className="text-6xl font-black text-indigo-500 tracking-tighter">{selectedCandidate.resumeScore || 0}%</p>
             </div>
          </div>

          <div className="p-12 grid grid-cols-1 xl:grid-cols-2 gap-12">
             <div className="space-y-8">
                <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                   <i className="fas fa-file-shield text-indigo-400"></i>
                   Identity Payload
                </h3>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/5 max-h-80 overflow-y-auto custom-scrollbar text-sm text-slate-400 font-medium leading-relaxed whitespace-pre-wrap shadow-inner">
                   {selectedCandidate.resumeContent || 'Payload logs missing.'}
                </div>
             </div>

             <div className="space-y-8">
                <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                   <i className="fas fa-code text-emerald-400"></i>
                   Skill Node Samples
                </h3>
                <div className="space-y-6 max-h-80 overflow-y-auto custom-scrollbar pr-4">
                   {selectedCandidate.technicalResult?.solutions?.map((sol, i) => (
                     <div key={i} className="p-6 bg-[#020410] rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{sol.challengeTitle}</p>
                          <span className="text-[8px] font-bold text-slate-600 uppercase">JS Runtime</span>
                        </div>
                        <pre className="text-xs font-mono text-indigo-200/60 overflow-x-auto whitespace-pre-wrap">{sol.code}</pre>
                     </div>
                   )) || <p className="text-sm text-slate-600 italic py-10 text-center">Neural forge data empty.</p>}
                </div>
             </div>

             <div className="xl:col-span-2 space-y-8 pt-10 border-t border-white/5">
                <h3 className="text-xl font-black text-white flex items-center gap-4 uppercase tracking-tight">
                   <i className="fas fa-waveform text-rose-500"></i>
                   Session Transcript Logs
                </h3>
                <div className="bg-white/5 rounded-[3rem] border border-white/5 p-10 space-y-6 max-h-96 overflow-y-auto custom-scrollbar shadow-inner">
                   {selectedCandidate.interviewResult?.transcript?.map((line, i) => {
                     const isAI = line.startsWith('AI:');
                     return (
                       <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed ${isAI ? 'bg-white/5 text-slate-300 border border-white/5' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/10'}`}>
                             <div className="flex items-center gap-3 mb-2 opacity-60">
                                <i className={`fas ${isAI ? 'fa-robot' : 'fa-user'} text-[10px]`}></i>
                                <span className="text-[9px] font-black uppercase tracking-widest">{isAI ? 'KERNEL_CORE' : 'ENTITY_NODE'}</span>
                             </div>
                             {line.replace(/^(AI:|USER:)\s*/, '')}
                          </div>
                       </div>
                     );
                   }) || <p className="text-sm text-slate-600 italic text-center py-20">No conversation data retrieved.</p>}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-32 animate-reveal">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-indigo-400">
            <i className="fas fa-microchip text-2xl"></i>
            <span className="text-xs font-black uppercase tracking-[0.4em]">Enterprise Operational Node v4.0</span>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter">Command Terminal</h2>
          <p className="text-slate-500 font-medium text-lg">Managing high-fidelity talent pipelines globally.</p>
        </div>
        <button onClick={fetchData} className="cta-primary !py-4 px-8 shadow-none">
          <i className="fas fa-rotate mr-3"></i>
          <span>Recalibrate Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {metrics.map((m, i) => (
          <div key={i} className="hireai-card-solid p-10 group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 ${m.color} text-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform`}>
                <i className={`fas ${m.icon} text-lg`}></i>
              </div>
              <span className="text-[10px] font-black px-3 py-1.5 rounded-xl text-slate-500 bg-white/5 uppercase tracking-widest">{m.trend}</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 tracking-tighter">{m.val}</p>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 hireai-card-solid p-0 overflow-hidden flex flex-col border-white/10">
           <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Entity Records</h3>
              <span className="badge-node !text-slate-500">{candidates.length} Profiles Linked</span>
           </div>
           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-white/[0.03] text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5">
                       <th className="px-10 py-6">Entity</th>
                       <th className="px-10 py-6">Operational Phase</th>
                       <th className="px-10 py-6 text-center">JRI Index</th>
                       <th className="px-10 py-6 text-right">Vault</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {candidates.length === 0 ? (
                      <tr><td colSpan={4} className="px-10 py-32 text-center text-slate-600 italic">No nodes identified in proprietary vault.</td></tr>
                    ) : candidates.map((c, i) => (
                      <tr key={i} className="hover:bg-white/[0.03] transition-colors group">
                         <td className="px-10 py-6">
                            <div className="flex items-center gap-5">
                               <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-sm font-black border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                  {c.name.charAt(0)}
                               </div>
                               <div className="space-y-1">
                                  <p className="text-base font-black text-white tracking-tight">{c.name}</p>
                                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{c.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-6">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                               c.isInterviewPassed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                               c.isCodingPassed ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                               c.isResumePassed ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-white/5 text-slate-600 border-white/10'
                            }`}>
                               {c.isInterviewPassed ? 'Vaulted' : c.isCodingPassed ? 'Live Session' : c.isResumePassed ? 'Screened' : 'Standby'}
                            </span>
                         </td>
                         <td className="px-10 py-6 text-center font-black text-white text-lg tracking-tighter">
                            {c.resumeScore || 0}%
                         </td>
                         <td className="px-10 py-6 text-right">
                            <button onClick={() => setSelectedCandidate(c)} className="btn-console-pill !px-6 !py-2.5">
                               View Log
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="hireai-card-solid p-12 flex flex-col items-center">
          <h3 className="text-2xl font-black text-white mb-10 w-full text-left uppercase tracking-tight">Funnel Telemetry</h3>
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={funnelData} innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value" stroke="none">
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-12 grid grid-cols-1 gap-4 w-full">
              {funnelData.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: p.color}}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{p.name}</span>
                  </div>
                  <span className="text-sm font-black text-white tracking-tighter">{p.value} Nodes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;