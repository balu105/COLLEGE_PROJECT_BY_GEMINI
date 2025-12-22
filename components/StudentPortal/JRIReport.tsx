
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
        console.error(err);
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
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recruiter Board Review</h2>
            <p className="text-slate-500 font-medium">Analyzing alignment with industry benchmarks...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const chartData = [
    { subject: 'Tech', A: report.technicalProficiency, B: 85, fullMark: 100 },
    { subject: 'Comm', A: report.communicationLevel, B: 85, fullMark: 100 },
    { subject: 'Resume', A: report.resumeQuality, B: 85, fullMark: 100 },
    { subject: 'Ethics', A: report.ethicalBehavior, B: 95, fullMark: 100 },
  ];

  const verdictConfig = {
    SELECTED: { color: 'emerald', icon: 'fa-check-double', label: 'Offer Extended', sub: 'Top 1% Talent' },
    HIGHLY_RECOMMENDED: { color: 'indigo', icon: 'fa-award', label: 'Strong Fit', sub: 'Waitlisted / Recommended' },
    NEEDS_GROWTH: { color: 'amber', icon: 'fa-seedling', label: 'Potential Candidate', sub: 'Development Required' },
  }[report.verdict as 'SELECTED' | 'HIGHLY_RECOMMENDED' | 'NEEDS_GROWTH'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-page-entry pb-20">
      <div className={`hireai-card overflow-hidden relative group border-${verdictConfig?.color}-200`}>
        <div className={`absolute top-0 right-0 w-80 h-80 bg-${verdictConfig?.color}-500/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110`}></div>
        <div className="p-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-1.5 bg-${verdictConfig?.color}-100 text-${verdictConfig?.color}-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                Official Board Verdict
              </span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {verdictConfig?.label}
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              {report.decisionSummary}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 rounded-[3rem] bg-${verdictConfig?.color}-600 flex items-center justify-center text-white shadow-2xl shadow-${verdictConfig?.color}-500/30 ring-8 ring-${verdictConfig?.color}-50 mb-4`}>
              <i className={`fas ${verdictConfig?.icon} text-4xl`}></i>
            </div>
            <div className="text-center">
               <p className={`text-sm font-black text-${verdictConfig?.color}-600 uppercase tracking-widest`}>{verdictConfig?.sub}</p>
               <p className="text-4xl font-black text-slate-900 mt-2">{report.overallScore}<span className="text-lg text-slate-300 ml-1">JRI</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 hireai-card p-8 flex flex-col">
          <h3 className="text-lg font-black text-slate-900 mb-2">Industry Alignment</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-8">Vs. Market Benchmark (85)</p>
          <div className="h-[300px] flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: '800' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="Benchmark" dataKey="B" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.1} />
                <Radar name="You" dataKey="A" stroke={report.verdict === 'NEEDS_GROWTH' ? '#f59e0b' : '#4f46e5'} fill={report.verdict === 'NEEDS_GROWTH' ? '#f59e0b' : '#4f46e5'} fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-black text-slate-900">Personalized Growth Roadmap</h3>
          <div className="grid grid-cols-1 gap-6">
            {report.improvements.map((imp, i) => (
              <div key={i} className="hireai-card p-8 border-l-8 border-l-amber-500 hover:translate-x-1 transition-all">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-black text-slate-900">{imp.domain} Proficiency</h4>
                    <span className="text-xs font-bold text-amber-600">Score: {imp.score}%</span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 italic">"{imp.gap}"</p>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Plan</p>
                        <ul className="text-xs font-bold text-slate-700 space-y-1">
                           {imp.actionPlan.map((a, j) => <li key={j}>• {a}</li>)}
                        </ul>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resources</p>
                        <ul className="text-xs font-bold text-indigo-600 space-y-1">
                           {imp.suggestedResources.map((r, k) => <li key={k} className="hover:underline cursor-pointer">🔗 {r}</li>)}
                        </ul>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {report.groundingSources && report.groundingSources.length > 0 && (
            <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
               <div className="flex items-center space-x-3">
                  <i className="fas fa-globe text-indigo-400"></i>
                  <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Verified Market Retrieval</h3>
               </div>
               <div className="flex flex-wrap gap-3">
                  {report.groundingSources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-indigo-300 transition-all flex items-center space-x-2"
                    >
                      <i className="fas fa-link text-[8px]"></i>
                      <span>{source.title}</span>
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
