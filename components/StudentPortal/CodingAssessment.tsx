
import React, { useState, useEffect } from 'react';
import { evaluateCode, generateCodingChallenge } from '../../services/aiClient';
import { TechnicalScore, CodingSolution } from '../../types';

interface CodingAssessmentProps {
  role: string;
  skills: string[];
  targetJD?: string;
  onComplete: (score: TechnicalScore) => void;
}

const CodingAssessment: React.FC<CodingAssessmentProps> = ({ role, skills, onComplete }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [violations, setViolations] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<TechnicalScore | null>(null);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const data = await generateCodingChallenge(role, skills);
      setChallenges(data || []);
      setCodes(data.map((c: any) => c.starterCode || ''));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    const handleBlur = () => { if (!submissionResult) setViolations(v => v + 1); };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  const handleCodeChange = (val: string) => {
    const next = [...codes];
    next[activeIdx] = val;
    setCodes(next);
  };

  const executeSubmission = async () => {
    setIsSubmitting(true);
    try {
      const result = await evaluateCode(challenges, codes);
      
      const solutions: CodingSolution[] = challenges.map((c, i) => ({
        challengeTitle: c.title,
        code: codes[i],
        topic: c.topic || 'General'
      }));

      const scoreObj: TechnicalScore = {
        score: result.score || 0,
        total: 100,
        feedback: result.feedback || "Evaluation complete.",
        integrityViolations: violations,
        solutions: solutions
      };
      
      setSubmissionResult(scoreObj);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-2xl rotate-12"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-2xl border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="font-black text-sm uppercase tracking-widest text-slate-900">Configuring Neural IDE...</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Allocating Sandbox Memory</p>
      </div>
    </div>
  );

  if (submissionResult) return (
    <div className="max-w-3xl mx-auto py-12 text-center space-y-12 animate-page-entry">
      <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl">
        <i className="fas fa-check text-4xl"></i>
      </div>
      <div className="space-y-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Benchmarking Complete</h2>
        <div className="flex justify-center gap-12">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Score</p>
            <p className="text-4xl font-black text-indigo-600">{submissionResult.score}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Anomalies</p>
            <p className="text-4xl font-black text-slate-900">{violations}</p>
          </div>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-[2rem] text-sm text-slate-600 shadow-sm italic">
           "{submissionResult.feedback}"
        </div>
      </div>
      <button onClick={() => onComplete(submissionResult)} className="hireai-button-primary w-full py-5">
        Continue to Recruitment Verdict
      </button>
    </div>
  );

  const activeChallenge = challenges[activeIdx];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] space-y-6 animate-page-entry overflow-hidden">
      <div className="flex flex-1 gap-8 overflow-hidden">
        {/* Left: Problem Description Panel */}
        <div className="w-2/5 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 space-y-8 shadow-sm">
             <div className="space-y-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Module {activeIdx + 1}</span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">{activeChallenge?.title}</h3>
                <div className="h-px bg-slate-100"></div>
             </div>
             
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem Specification</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                  {activeChallenge?.description}
                </p>
             </div>

             <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Constraint</p>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <i className="fas fa-microchip text-indigo-500"></i>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Input Sequence</span>
                     </div>
                     <code className="text-[10px] font-mono font-black text-indigo-600">{activeChallenge?.examples?.[0]?.input || 'N/A'}</code>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <i className="fas fa-terminal text-emerald-500"></i>
                        <span className="text-[10px] font-black text-slate-600 uppercase">Expected Output</span>
                     </div>
                     <code className="text-[10px] font-mono font-black text-emerald-600">{activeChallenge?.examples?.[0]?.output || 'N/A'}</code>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
             <i className="fas fa-shield-halved text-amber-500 mt-1"></i>
             <div>
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Proctoring Protocol</p>
                <p className="text-[10px] font-medium text-amber-700 leading-relaxed uppercase tracking-tight">
                  Tab visibility and anomaly detection are active. Persistent violations will disqualify the session.
                </p>
             </div>
          </div>
        </div>

        {/* Right: Neural Code Editor */}
        <div className="flex-1 flex flex-col bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="h-14 bg-slate-900/80 px-8 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-2">
               {challenges.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setActiveIdx(i)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${activeIdx === i ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                 >
                   TASK_{i+1}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-4">
               <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Environment: JavaScript (Node.js)</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          
          <textarea 
            className="flex-1 p-10 bg-transparent text-indigo-300 font-mono text-sm outline-none resize-none custom-scrollbar-dark selection:bg-indigo-500/20"
            value={codes[activeIdx]}
            spellCheck={false}
            autoFocus
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="// Implement logic here..."
          />

          <div className="h-20 bg-slate-900/60 border-t border-white/5 px-8 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-600 uppercase">Integrity Score</span>
                  <span className="text-[10px] font-black text-white">{Math.max(0, 100 - violations * 5)}%</span>
                </div>
                <div className="w-px h-6 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-600 uppercase">Latency</span>
                  <span className="text-[10px] font-black text-emerald-500">12ms</span>
                </div>
             </div>
             
             <button 
               onClick={executeSubmission}
               disabled={isSubmitting}
               className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
             >
               {isSubmitting ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-cloud-arrow-up mr-2"></i>}
               Finalize Submission
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
