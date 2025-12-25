
import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/dbService';
import { CandidateProfile } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
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
    { label: 'Talent Pool', val: candidates.length, trend: 'Total', icon: 'fa-users', color: 'bg-indigo-600' },
    { label: 'Active Pipeline', val: candidates.filter(c => c.isResumePassed).length, trend: 'Screened', icon: 'fa-bolt', color: 'bg-amber-500' },
    { label: 'Cleared Technical', val: candidates.filter(c => c.isCodingPassed).length, trend: 'Verified', icon: 'fa-code', color: 'bg-emerald-600' },
    { label: 'Completed Interview', val: candidates.filter(c => c.isInterviewPassed).length, trend: 'Final', icon: 'fa-check-double', color: 'bg-rose-500' },
  ];

  const funnelData = [
    { name: 'Initial', value: candidates.length, color: '#6366f1' },
    { name: 'Passed Resume', value: candidates.filter(c => c.isResumePassed).length, color: '#f59e0b' },
    { name: 'Passed Coding', value: candidates.filter(c => c.isCodingPassed).length, color: '#10b981' },
    { name: 'Passed Interview', value: candidates.filter(c => c.isInterviewPassed).length, color: '#4f46e5' },
  ];

  if (selectedCandidate) {
    return (
      <div className="space-y-8 animate-page-entry pb-20">
        <button onClick={() => setSelectedCandidate(null)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-colors">
          <i className="fas fa-arrow-left"></i>
          <span>Back to Global Fleet</span>
        </button>

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white text-3xl font-black">
                   {selectedCandidate.avatarUrl ? <img src={selectedCandidate.avatarUrl} className="w-full h-full object-cover" /> : selectedCandidate.name.charAt(0)}
                </div>
                <div>
                   <h2 className="text-3xl font-black text-slate-900">{selectedCandidate.name}</h2>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{selectedCandidate.selectedRole || 'Role Pending'}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">JRI Readiness</p>
                <p className="text-4xl font-black text-indigo-600">{selectedCandidate.resumeScore || 0}%</p>
             </div>
          </div>

          <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
             {/* Resume Section */}
             <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                   <i className="fas fa-file-invoice text-indigo-500"></i>
                   Source Resume
                </h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 max-h-60 overflow-y-auto custom-scrollbar text-xs text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                   {selectedCandidate.resumeContent || 'No resume content available.'}
                </div>
             </div>

             {/* Coding Section */}
             <div className="space-y-6">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                   <i className="fas fa-code text-emerald-500"></i>
                   Skill Forge Snapshot
                </h3>
                <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                   {selectedCandidate.technicalResult?.solutions?.map((sol, i) => (
                     <div key={i} className="p-4 bg-slate-950 rounded-xl border border-white/5 space-y-2">
                        <p className="text-[10px] font-black text-indigo-400 uppercase">{sol.challengeTitle}</p>
                        <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto">{sol.code}</pre>
                     </div>
                   )) || <p className="text-sm text-slate-400 italic">No code samples synchronized.</p>}
                </div>
             </div>

             {/* Interview Section */}
             <div className="lg:col-span-2 space-y-6 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                   <i className="fas fa-microphone-lines text-rose-500"></i>
                   Assessment Transcript
                </h3>
                <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                   {selectedCandidate.interviewResult?.transcript?.map((line, i) => {
                     const isAI = line.startsWith('AI:');
                     return (
                       <div key={i} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl text-[11px] font-medium ${isAI ? 'bg-white text-slate-700 border border-slate-200' : 'bg-indigo-600 text-white shadow-lg'}`}>
                             {line.replace(/^(AI:|USER:)\s*/, '')}
                          </div>
                       </div>
                     );
                   }) || <p className="text-sm text-slate-400 italic text-center py-10">No interview history archived.</p>}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 animate-page-entry">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-indigo-600">
            <i className="fas fa-chart-network text-xl"></i>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Operational Node v4.0</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ecosystem Monitor</h2>
          <p className="text-slate-500 font-medium">Synchronized with Supabase Cloud Vault.</p>
        </div>
        <button onClick={fetchData} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20">
          <i className="fas fa-sync-alt animate-spin-slow"></i>
          <span>Live Sync</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 ${m.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                <i className={`fas ${m.icon}`}></i>
              </div>
              <span className="text-[10px] font-black px-2 py-1 rounded-lg text-slate-400 bg-slate-50">{m.trend}</span>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{m.val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-0 rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <h3 className="text-xl font-black text-slate-900">Active Talent Profiles</h3>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{candidates.length} Entities Indexed</span>
           </div>
           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                       <th className="px-8 py-4">Candidate</th>
                       <th className="px-8 py-4">Status</th>
                       <th className="px-8 py-4 text-center">JRI</th>
                       <th className="px-8 py-4 text-right">Vault</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {candidates.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No candidates found in cloud vault.</td></tr>
                    ) : candidates.map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                         <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                               <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white text-xs font-black">
                                  {c.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-slate-900">{c.name}</p>
                                  <p className="text-[10px] font-bold text-slate-400">{c.email}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                               c.isInterviewPassed ? 'bg-emerald-100 text-emerald-700' :
                               c.isCodingPassed ? 'bg-indigo-100 text-indigo-700' :
                               c.isResumePassed ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                            }`}>
                               {c.isInterviewPassed ? 'Selected' : c.isCodingPassed ? 'Interviewing' : c.isResumePassed ? 'Screened' : 'Pending'}
                            </span>
                         </td>
                         <td className="px-8 py-5 text-center font-black text-slate-900">
                            {c.resumeScore || 0}%
                         </td>
                         <td className="px-8 py-5 text-right">
                            <button onClick={() => setSelectedCandidate(c)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm">
                               View Record
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 mb-8 w-full text-left">Funnel Integrity</h3>
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={funnelData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" animationBegin={0} animationDuration={1000}>
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-8 grid grid-cols-2 gap-3 w-full">
              {funnelData.map((p, i) => (
                <div key={i} className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100/50">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: p.color}}></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-800 uppercase tracking-tighter">{p.name}</span>
                    <span className="text-[9px] text-slate-400 font-bold">{p.value} Profiles</span>
                  </div>
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
