import React, { useState, useEffect } from 'react';
import { evaluateCode, generateCodingChallenge } from '../../services/aiClient';
import { TechnicalScore, CodingSolution } from '../../types';
import Loading from '../Loading';

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
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <Loading message="Configuring Neural IDE" subMessage="Allocating Sandbox Memory" />
    </div>
  );

  if (submissionResult) return (
    <div className="max-w-3xl mx-auto py-8 md:py-12 text-center space-y-8 md:space-y-12 animate-reveal px-4">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-600 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl">
        <i className="fas fa-check text-3xl md:text-4xl"></i>
      </div>
      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Benchmarking Complete</h2>
        <div className="flex justify-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Score</p>
            <p className="text-3xl md:text-4xl font-black text-indigo-500">{submissionResult.score}%</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Anomalies</p>
            <p className="text-3xl md:text-4xl font-black text-white">{violations}</p>
          </div>
        </div>
        <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] text-xs md:text-sm text-slate-400 italic">
           "{submissionResult.feedback}"
        </div>
      </div>
      <button onClick={() => onComplete(submissionResult)} className="cta-primary w-full py-5 flex justify-center">
        Continue to Recruitment Verdict
      </button>
    </div>
  );

  const activeChallenge = challenges[activeIdx];

  return (
    <div className="flex flex-col h-full md:h-[calc(100vh-160px)] space-y-6 animate-reveal overflow-hidden relative">
      {isSubmitting && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center rounded-[1.5rem] md:rounded-[2.5rem]">
          <Loading message="Quantifying Skillset" subMessage="Neural Logic Verification" />
        </div>
      )}

      {/* Main Container - Column on Mobile, Row on Desktop */}
      <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-8 overflow-hidden">
        
        {/* Left/Top: Problem Description Panel */}
        <div className="w-full md:w-2/5 flex flex-col space-y-4 md:space-y-6 overflow-y-auto pr-0 md:pr-2 custom-scrollbar shrink-0 md:shrink">
          <div className="bg-white/5 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 p-6 md:p-8 space-y-6 md:space-y-8 shadow-sm">
             <div className="space-y-3 md:space-y-4">
                <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg text-[8px] md:text-[9px] font-black uppercase tracking-widest">Module {activeIdx + 1}</span>
                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">{activeChallenge?.title}</h3>
                <div className="h-px bg-white/5"></div>
             </div>
             
             <div className="space-y-3 md:space-y-4">
                <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest">Problem Specification</p>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium whitespace-pre-wrap">
                  {activeChallenge?.description}
                </p>
             </div>

             <div className="space-y-4 hidden md:block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logic Constraints</p>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <i className="fas fa-terminal text-emerald-500"></i>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Output Expectation</span>
                   </div>
                   <code className="text-[10px] font-mono font-black text-emerald-600">{activeChallenge?.examples?.[0]?.output || 'N/A'}</code>
                </div>
             </div>
          </div>
          
          <div className="hidden md:flex p-6 bg-amber-500/10 rounded-[2rem] border border-amber-500/20 items-start gap-4">
             <i className="fas fa-shield-halved text-amber-500 mt-1"></i>
             <div>
                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Proctoring Active</p>
                <p className="text-[10px] font-medium text-amber-500/80 leading-relaxed uppercase tracking-tight">
                  Session integrity detection is operational.
                </p>
             </div>
          </div>
        </div>

        {/* Right/Bottom: Neural Code Editor */}
        <div className="flex-1 min-h-[400px] flex flex-col bg-slate-950 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <div className="h-12 md:h-14 bg-slate-900/80 px-4 md:px-8 flex items-center justify-between border-b border-white/5 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 shrink-0">
               {challenges.map((_, i) => (
                 <button 
                  key={i} 
                  onClick={() => setActiveIdx(i)}
                  className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg text-[8px] md:text-[9px] font-black transition-all whitespace-nowrap ${activeIdx === i ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
                 >
                   TASK_{i+1}
                 </button>
               ))}
            </div>
            <div className="hidden sm:flex items-center gap-3 md:gap-4 shrink-0">
               <span className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-widest">JS RUNTIME</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          
          <textarea 
            className="flex-1 p-6 md:p-10 bg-transparent text-indigo-300 font-mono text-xs md:text-sm outline-none resize-none custom-scrollbar-dark selection:bg-indigo-500/20"
            value={codes[activeIdx]}
            spellCheck={false}
            autoFocus
            onChange={(e) => handleCodeChange(e.target.value)}
            placeholder="// Implement logic here..."
          />

          <div className="h-16 md:h-20 bg-slate-900/60 border-t border-white/5 px-4 md:px-8 flex items-center justify-between">
             <div className="flex items-center gap-4 md:gap-6">
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase">Integrity</span>
                  <span className="text-[9px] md:text-[10px] font-black text-white">{Math.max(0, 100 - violations * 5)}%</span>
                </div>
                <div className="w-px h-5 md:h-6 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-[7px] md:text-[8px] font-black text-slate-600 uppercase">Latency</span>
                  <span className="text-[9px] md:text-[10px] font-black text-emerald-500">12ms</span>
                </div>
             </div>
             
             <button 
               onClick={executeSubmission}
               disabled={isSubmitting}
               className="px-4 md:px-8 py-2 md:py-3 bg-indigo-600 text-white rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center"
             >
               {isSubmitting ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : <i className="fas fa-cloud-arrow-up mr-2"></i>}
               <span>Finalize</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;