
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
  const [showDescription, setShowDescription] = useState(true);
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
    <div className="h-[70vh] flex flex-col items-center justify-center text-slate-500 space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-2xl rotate-12"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-2xl border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="font-black text-sm uppercase tracking-widest text-slate-900">Virtual Machine Warming...</p>
        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Serializing Test Cases</p>
      </div>
    </div>
  );

  if (submissionResult) return (
    <div className="max-w-3xl mx-auto py-24 text-center space-y-12 animate-page-entry">
      <div className="w-28 h-28 bg-emerald-600 rounded-[3rem] flex items-center justify-center text-white mx-auto shadow-2xl ring-8 ring-emerald-50">
        <i className="fas fa-check text-5xl"></i>
      </div>
      <div className="space-y-6">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Code Submission Finalized</h2>
        <div className="flex items-center justify-center space-x-3 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
           <i className="fas fa-microchip text-indigo-500"></i>
           <span>Neural Snapshot Saved to Vault</span>
        </div>
        <div className="flex justify-center gap-12 py-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
            <p className="text-5xl font-black text-indigo-600">{submissionResult.score}%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Integrity</p>
            <p className="text-5xl font-black text-slate-900">{Math.max(0, 100 - violations * 5)}%</p>
          </div>
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] text-sm font-medium text-slate-600 shadow-sm italic leading-relaxed">
           "{submissionResult.feedback}"
        </div>
      </div>
      <button onClick={() => onComplete(submissionResult)} className="hireai-button-primary w-full py-6 text-lg">
        Proceed to Selection Verdict
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] space-y-6 animate-page-entry">
      {/* Dynamic Instruction Header */}
      <div className={`bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-500 ${showDescription ? 'max-h-[500px]' : 'max-h-20'}`}>
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-6">
              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Task {activeIdx + 1} of {challenges.length}</span>
              <h3 className="font-black text-slate-900 truncate max-w-md">{challenges[activeIdx]?.title}</h3>
           </div>
           <button 
            onClick={() => setShowDescription(!showDescription)}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
           >
             <i className={`fas fa-chevron-${showDescription ? 'up' : 'down'} text-xs`}></i>
           </button>
        </div>
        {showDescription && (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-2 duration-500">
             <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Problem Specification</p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                  {challenges[activeIdx]?.description}
                </p>
             </div>
             <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input/Output Protocol</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-950 rounded-2xl font-mono text-[11px] text-indigo-300">
                      <span className="text-[8px] block text-indigo-500/50 mb-1 uppercase tracking-widest">Input</span>
                      {challenges[activeIdx]?.examples?.[0]?.input || 'N/A'}
                    </div>
                    <div className="p-4 bg-slate-950 rounded-2xl font-mono text-[11px] text-emerald-400">
                      <span className="text-[8px] block text-emerald-500/50 mb-1 uppercase tracking-widest">Expected Output</span>
                      {challenges[activeIdx]?.examples?.[0]?.output || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                  <i className="fas fa-triangle-exclamation text-amber-500"></i>
                  <p className="text-[10px] font-bold text-amber-700 uppercase tracking-tight">Difficulty Level: <span className="font-black">{challenges[activeIdx]?.difficulty || 'Intermediate'}</span></p>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Full-Width Neural Editor */}
      <div className="flex-1 flex flex-col bg-slate-950 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
        <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5">
              {challenges.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveIdx(i)} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${activeIdx === i ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                >
                  UNIT_{i+1}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiler Online (V8)</span>
             </div>
             <div className="h-6 w-px bg-white/5"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">UTF-8 • JavaScript</span>
          </div>
        </div>
        <textarea 
          className="flex-1 p-12 bg-transparent text-indigo-300 font-mono text-base outline-none resize-none custom-scrollbar-dark leading-relaxed selection:bg-indigo-500/30"
          value={codes[activeIdx]}
          spellCheck={false}
          autoFocus
          onChange={(e) => handleCodeChange(e.target.value)}
          placeholder="// Initialize logic here..."
        />
        
        {/* IDE Bottom Bar */}
        <div className="px-8 py-5 border-t border-white/5 bg-slate-900/40 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Proctoring Metrics:</span>
              <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${violations > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-slate-400'}`}>
                ANOMALIES: {violations}
              </span>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={executeSubmission}
                disabled={isSubmitting}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-3"
              >
                {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
                <span>End Coding Session</span>
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
