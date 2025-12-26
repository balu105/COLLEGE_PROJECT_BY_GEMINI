import React, { useEffect, useState } from 'react';
import { calculateJRI } from '../../services/aiClient';
import { JRIReport as JRIReportInterface } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Loading from '../Loading';

interface JRIReportProps {
  data: any;
}

const JRIReport: React.FC<JRIReportProps> = ({ data }) => {
  const [report, setReport] = useState<JRIReportInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await calculateJRI(data);
        setReport(result);
      } catch (err) {
        console.error("Report Generation Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <Loading message="Assembling Final Verdict" subMessage="Synthesizing multidimensional data points" />
      </div>
    );
  }

  if (!report) return (
    <div className="text-center py-32 hireai-card-solid max-w-2xl mx-auto space-y-8 border-rose-500/20">
      <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-[2rem] border border-rose-500/20 flex items-center justify-center mx-auto text-3xl">
         <i className="fas fa-exclamation-triangle"></i>
      </div>
      <div className="space-y-2">
         <h2 className="text-3xl font-black text-white tracking-tight">System Interruption</h2>
         <p className="text-slate-500 text-sm">Verdict generation sequence failed. Re-initialize connection.</p>
      </div>
      <button onClick={() => window.location.reload()} className="cta-secondary px-10">Retry Handshake</button>
    </div>
  );

  const chartData = [
    { subject: 'Technical', A: report.technicalProficiency, B: 85 },
    { subject: 'Comm', A: report.communicationLevel, B: 80 },
    { subject: 'Resume', A: report.resumeQuality, B: 75 },
    { subject: 'Integrity', A: report.ethicalBehavior, B: 90 },
  ];

  const verdictConfig = {
    SELECTED: { color: 'emerald', icon: 'fa-certificate', label: 'Primary Select', sub: 'High Fidelity Asset' },
    HIGHLY_RECOMMENDED: { color: 'indigo', icon: 'fa-award', label: 'High Potential', sub: 'Recommended Placement' },
    NEEDS_GROWTH: { color: 'amber', icon: 'fa-vial-circle-check', label: 'System Refinement', sub: 'Growth Vector Detected' },
  }[report.verdict as 'SELECTED' | 'HIGHLY_RECOMMENDED' | 'NEEDS_GROWTH'] || { color: 'slate', icon: 'fa-user-check', label: 'Analysis Complete', sub: 'Verdict Archived' };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-reveal pb-32">
      {/* Hero Verdict Card */}
      <div className={`hireai-card-solid overflow-hidden relative border-2 border-${verdictConfig.color}-500/20 shadow-2xl shadow-${verdictConfig.color}-500/5`}>
        <div className={`absolute top-0 right-0 w-[600px] h-[600px] bg-${verdictConfig.color}-500/5 blur-[100px] rounded-full -mr-60 -mt-60`}></div>
        <div className="p-16 relative z-10 flex flex-col xl:flex-row items-center justify-between gap-16">
          <div className="flex-1 space-y-10 text-center xl:text-left">
            <div className="badge-node !text-slate-400">
              <i className="fas fa-shield-check mr-3"></i> System Validated Verdict
            </div>
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
              {verdictConfig.label}
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-3xl leading-relaxed">
              {report.decisionSummary}
            </p>
          </div>
          <div className="text-center xl:border-l xl:border-white/5 xl:pl-16">
            <div className={`w-44 h-44 rounded-[3.5rem] bg-${verdictConfig.color}-600/10 flex items-center justify-center text-${verdictConfig.color}-500 shadow-2xl border border-${verdictConfig.color}-500/20 mb-10 mx-auto`}>
              <i className={`fas ${verdictConfig.icon} text-6xl`}></i>
            </div>
            <div className="space-y-2">
               <p className={`text-xs font-black text-${verdictConfig.color}-400 uppercase tracking-[0.4em]`}>{verdictConfig.sub}</p>
               <p className="text-7xl font-black text-white tracking-tighter">{report.overallScore}<span className="text-2xl text-slate-700 ml-2">JRI</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* Radar Chart Section */}
        <div className="xl:col-span-1 hireai-card-solid p-12 flex flex-col">
          <div className="mb-12">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Skill Spectrum</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Neural Benchmarking Results</p>
          </div>
          <div className="h-[380px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: '900' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Market" dataKey="B" stroke="rgba(255,255,255,0.1)" fill="rgba(255,255,255,0.05)" fillOpacity={0.6} />
                <Radar name="Candidate" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-10 flex justify-center gap-10">
             <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-white/10"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Market</span>
             </div>
             <div className="flex items-center space-x-3">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Identity</span>
             </div>
          </div>
        </div>

        {/* Growth roadmap section */}
        <div className="xl:col-span-2 space-y-12">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-3xl font-black text-white tracking-tight uppercase">Optimization Roadmap</h3>
            <div className="badge-node !bg-white/5 !border-white/10">
               Neural Logic Applied
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-8">
            {report.improvements.map((imp, i) => (
              <div key={i} className="hireai-card-solid p-12 hover:translate-x-2 transition-all hover:border-indigo-500/20">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center font-black border border-white/5 shadow-xl text-lg">
                        {imp.score}%
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{imp.domain}</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Growth Vector Identified</p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg font-medium text-slate-400 leading-relaxed italic border-l-4 border-indigo-500/20 pl-6">"{imp.gap}"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Action Plan</p>
                        <ul className="space-y-4">
                           {imp.actionPlan.map((a, j) => (
                             <li key={j} className="flex items-start space-x-4 text-sm font-bold text-slate-300">
                               <i className="fas fa-chevron-right text-indigo-500 mt-1 text-[10px]"></i>
                               <span>{a}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="space-y-6">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Knowledge Resources</p>
                        <div className="flex flex-wrap gap-3">
                           {imp.suggestedResources.map((r, k) => (
                             <span key={k} className="px-4 py-2 bg-white/5 text-indigo-400 rounded-xl text-[10px] font-black border border-white/5 uppercase tracking-widest">
                               {r}
                             </span>
                           ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search grounding section */}
          {report.groundingSources && report.groundingSources.length > 0 && (
            <div className="hireai-card-solid p-12 shadow-2xl shadow-indigo-500/10 space-y-8 border-indigo-500/20">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-indigo-400">
                     <i className="fas fa-radar text-xl animate-pulse"></i>
                     <h3 className="text-sm font-black uppercase tracking-[0.4em]">Live Intelligence Feeds</h3>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Synched</span>
                  </div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-6 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all flex items-center justify-between group"
                    >
                      <div className="flex-1 pr-4">
                        <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{source.title}</p>
                        <p className="text-[9px] text-slate-600 font-bold mt-1 uppercase tracking-widest">Verified External Node</p>
                      </div>
                      <i className="fas fa-arrow-up-right-from-square text-slate-700 group-hover:text-indigo-400 text-xs transition-colors"></i>
                    </a>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JRIReport;