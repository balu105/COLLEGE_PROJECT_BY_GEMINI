
import React, { useEffect, useState } from 'react';
import { calculateJRI } from '../../services/aiClient';
import { JRIReport as JRIReportInterface } from '../../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="text-center space-y-6">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-8 border-indigo-100 rounded-[2.5rem] rotate-12"></div>
            <div className="absolute inset-0 border-8 border-indigo-600 rounded-[2.5rem] border-t-transparent animate-spin"></div>
            <i className="fas fa-building-circle-check absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl text-indigo-600"></i>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Board Review</h2>
            <p className="text-slate-500 font-medium">Analyzing results against 1M+ industry profiles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return (
    <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-200">
      <i className="fas fa-exclamation-triangle text-rose-500 text-4xl mb-4"></i>
      <p className="font-black text-slate-900">Analysis Interrupted</p>
      <p className="text-slate-500 text-sm">Could not generate report. Please try again.</p>
    </div>
  );

  const chartData = [
    { subject: 'Technical', A: report.technicalProficiency, B: 85 },
    { subject: 'Comm', A: report.communicationLevel, B: 80 },
    { subject: 'Resume', A: report.resumeQuality, B: 75 },
    { subject: 'Integrity', A: report.ethicalBehavior, B: 90 },
  ];

  const verdictConfig = {
    SELECTED: { color: 'emerald', icon: 'fa-check-double', label: 'Offer Highly Likely', sub: 'Top Tier Candidate' },
    HIGHLY_RECOMMENDED: { color: 'indigo', icon: 'fa-award', label: 'Strong Alignment', sub: 'Recommended for Shortlist' },
    NEEDS_GROWTH: { color: 'amber', icon: 'fa-seedling', label: 'Developing Talent', sub: 'Skills Refinement Needed' },
  }[report.verdict as 'SELECTED' | 'HIGHLY_RECOMMENDED' | 'NEEDS_GROWTH'] || { color: 'slate', icon: 'fa-user', label: 'Review Complete', sub: 'Score Logged' };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-page-entry pb-20">
      {/* Hero Verdict Card */}
      <div className={`bg-white rounded-[3.5rem] overflow-hidden relative border-2 border-${verdictConfig.color}-100 shadow-2xl shadow-${verdictConfig.color}-500/5`}>
        <div className={`absolute top-0 right-0 w-[400px] h-[400px] bg-${verdictConfig.color}-500/5 rounded-full -mr-40 -mt-40`}></div>
        <div className="p-12 relative z-10 flex flex-col lg:row items-center justify-between gap-12">
          <div className="flex-1 space-y-6">
            <div className={`inline-flex items-center px-4 py-1.5 bg-${verdictConfig.color}-50 text-${verdictConfig.color}-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-${verdictConfig.color}-100`}>
              <i className="fas fa-microchip mr-2"></i> Neural Evaluation Result
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {verdictConfig.label}
            </h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
              {report.decisionSummary}
            </p>
          </div>
          <div className="text-center">
            <div className={`w-36 h-36 rounded-[3rem] bg-${verdictConfig.color}-600 flex items-center justify-center text-white shadow-2xl shadow-${verdictConfig.color}-600/30 ring-8 ring-${verdictConfig.color}-50 mb-6 mx-auto`}>
              <i className={`fas ${verdictConfig.icon} text-5xl`}></i>
            </div>
            <div className="space-y-1">
               <p className={`text-xs font-black text-${verdictConfig.color}-600 uppercase tracking-widest`}>{verdictConfig.sub}</p>
               <p className="text-5xl font-black text-slate-900">{report.overallScore}<span className="text-xl text-slate-300 ml-1">JRI</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Radar Chart Section */}
        <div className="lg:col-span-1 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900">Skill Radar</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Benchmarked vs Industry</p>
          </div>
          <div className="h-[320px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Market" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.1} />
                <Radar name="Candidate" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-center space-x-6">
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-slate-200"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase">Market</span>
             </div>
             <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-black text-indigo-500 uppercase">You</span>
             </div>
          </div>
        </div>

        {/* Improvements Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Growth Roadmap</h3>
            <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
               AI Personalized
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {report.improvements.map((imp, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:translate-x-1 transition-all">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                        {imp.score}%
                      </div>
                      <h4 className="text-xl font-black text-slate-900">{imp.domain}</h4>
                    </div>
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-lg">Gap Detected</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed italic">"{imp.gap}"</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50">
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Action Plan</p>
                        <ul className="space-y-2">
                           {imp.actionPlan.map((a, j) => (
                             <li key={j} className="flex items-start space-x-2 text-xs font-bold text-slate-700">
                               <i className="fas fa-arrow-right text-indigo-400 mt-1 text-[8px]"></i>
                               <span>{a}</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                     <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Suggested Skill-Up</p>
                        <div className="flex flex-wrap gap-2">
                           {imp.suggestedResources.map((r, k) => (
                             <span key={k} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black">
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

          {/* Search Grounding Section */}
          {report.groundingSources && report.groundingSources.length > 0 && (
            <div className="bg-slate-950 p-10 rounded-[3rem] shadow-2xl shadow-indigo-500/10 space-y-6">
               <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-indigo-400">
                     <i className="fas fa-globe-americas"></i>
                     <h3 className="text-sm font-black uppercase tracking-widest">Live Market Intelligence</h3>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <p className="text-[11px] font-black text-white group-hover:text-indigo-400 transition-colors line-clamp-1">{source.title}</p>
                        <p className="text-[9px] text-slate-500 font-bold mt-1">Verified Resource</p>
                      </div>
                      <i className="fas fa-external-link-alt text-slate-700 group-hover:text-indigo-400 text-xs transition-colors"></i>
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
