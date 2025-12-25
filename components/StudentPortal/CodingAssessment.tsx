
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { evaluateCode, generateCodingChallenge, runCodeTests } from '../../services/aiClient';
import { TechnicalScore, CodingSolution } from '../../types';

interface CodingAssessmentProps {
  role: string;
  skills: string[];
  targetJD?: string;
  onComplete: (score: TechnicalScore) => void;
}

const CodingAssessment: React.FC<CodingAssessmentProps> = ({ role, skills, targetJD, onComplete }) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [codes, setCodes] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
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
      
      // Capture the solutions (code details)
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
        solutions: solutions // NEW: Persisting the code itself
      };
      
      setSubmissionResult(scoreObj);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-slate-500 space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-xl"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 rounded-xl border-t-transparent animate-spin"></div>
      </div>
      <p className="font-black text-xs uppercase tracking-widest">Initializing Neural IDE...</p>
    </div>
  );

  if (submissionResult) return (
    <div className="max-w-2xl mx-auto py-20 text-center space-y-10 animate-page-entry">
      <div className="w-24 h-24 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl">
        <i className="fas fa-check text-4xl"></i>
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Test Completed</h2>
        <div className="flex items-center justify-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <i className="fas fa-database text-emerald-500"></i>
           <span>Source Code Snapshot Archiving...</span>
        </div>
        <p className="text-slate-500 text-lg">Performance Score: <span className="text-indigo-600 font-black">{submissionResult.score}%</span></p>
        <div className="p-6 bg-white border border-slate-200 rounded-3xl text-sm italic text-slate-600 shadow-sm">
           "{submissionResult.feedback}"
        </div>
      </div>
      <button onClick={() => onComplete(submissionResult)} className="hireai-button-primary w-full py-5">
        Proceed to Selection Verdict
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-160px)] animate-page-entry">
      <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <span className="font-black text-slate-900">Task {activeIdx + 1}</span>
           <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded text-[10px] font-black uppercase">{challenges[activeIdx]?.difficulty || 'Medium'}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
           <h3 className="text-xl font-black text-slate-900 leading-tight">{challenges[activeIdx]?.title}</h3>
           <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{challenges[activeIdx]?.description}</p>
           
           <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Example Input</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                 {challenges[activeIdx]?.examples?.[0]?.input || 'N/A'}
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Example Output</p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                 {challenges[activeIdx]?.examples?.[0]?.output || 'N/A'}
              </div>
           </div>
        </div>
      </div>

      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="flex-1 bg-slate-950 rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enterprise Compiler</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="flex gap-1">
                   {challenges.map((_, i) => (
                     <button key={i} onClick={() => setActiveIdx(i)} className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${activeIdx === i ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-500 hover:text-white'}`}>{i+1}</button>
                   ))}
                </div>
             </div>
          </div>
          <textarea 
            className="flex-1 p-8 bg-transparent text-indigo-300 font-mono text-sm outline-none resize-none custom-scrollbar-dark leading-relaxed"
            value={codes[activeIdx]}
            spellCheck={false}
            onChange={(e) => handleCodeChange(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 shrink-0">
           {showSubmitConfirm ? (
             <div className="flex-1 flex gap-3 animate-in slide-in-from-right-4">
                <button onClick={() => setShowSubmitConfirm(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-colors uppercase">Cancel</button>
                <button 
                  onClick={executeSubmission}
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/20"
                >
                  {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-arrow-up"></i>}
                  <span>Confirm Final Submission</span>
                </button>
             </div>
           ) : (
             <>
               <div className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                     <i className="fas fa-shield-virus text-rose-500"></i>
                     <span className="text-[10px] font-black text-slate-400 uppercase">Integrity Alerts: <span className="text-rose-600">{violations}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                     <i className="fas fa-lock"></i>
                     <span>Encrypted Session</span>
                  </div>
               </div>
               <button 
                onClick={() => setShowSubmitConfirm(true)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20"
               >
                <span>End Coding Session</span>
                <i className="fas fa-chevron-right text-[10px]"></i>
               </button>
             </>
           )}
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
