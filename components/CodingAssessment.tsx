
import React, { useState, useEffect, useCallback } from 'react';
import { evaluateCode, generateCodingChallenge } from '../services/geminiService';
import { TechnicalScore } from '../types';

interface CodingAssessmentProps {
  role: string;
  skills: string[];
  targetJD?: string;
  onComplete: (score: TechnicalScore) => void;
}

const CodingAssessment: React.FC<CodingAssessmentProps> = ({ role, skills, targetJD, onComplete }) => {
  const [challenge, setChallenge] = useState<any>(null);
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 mins
  const [violations, setViolations] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<TechnicalScore | null>(null);

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const data = await generateCodingChallenge(role, skills, targetJD);
        setChallenge(data);
        setCode(data.starterCode);
      } catch (err) {
        console.error("Failed to load challenge", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [role, skills, targetJD]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      setViolations(v => v + 1);
      alert("Proctoring Alert: Tab switching is monitored. This activity has been logged for evaluation.");
    }
  }, []);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const timer = setInterval(() => setTimeRemaining(t => t - 1), 1000);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(timer);
    };
  }, [handleVisibilityChange]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await evaluateCode(challenge?.title || "Role Based Task", code);
      const scoreObj: TechnicalScore = {
        score: result.score,
        total: 100,
        feedback: result.feedback,
        integrityViolations: violations
      };
      setSubmissionResult(scoreObj);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProceed = () => {
    if (submissionResult) {
      onComplete(submissionResult);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6 animate-pulse">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-xl font-black text-slate-900 tracking-tight">Forging Role Challenges</p>
          <p className="text-slate-500 font-medium">Configuring environment for {role}...</p>
        </div>
      </div>
    );
  }

  if (submissionResult) {
    const isPassed = submissionResult.score >= 60;
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-page-entry">
        <div className={`hireai-card p-12 border-2 ${isPassed ? 'border-indigo-500/20' : 'border-rose-500/20'} space-y-10`}>
          <div className="text-center space-y-4">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl ${isPassed ? 'bg-indigo-600 shadow-indigo-500/20' : 'bg-rose-600 shadow-rose-500/20'}`}>
              <i className={`fas ${isPassed ? 'fa-award' : 'fa-times-circle'} text-4xl`}></i>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isPassed ? 'Challenge Cleared!' : 'Skill Forge Result'}
            </h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto">
              {isPassed 
                ? 'Your algorithmic logic has met the industry standard. You are now invited to the behavioral interview phase.'
                : 'Your solution did not meet the required threshold for this role. Review the feedback and try again.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Score</p>
              <p className={`text-5xl font-black ${isPassed ? 'text-indigo-600' : 'text-rose-600'}`}>
                {submissionResult.score}<span className="text-xl text-slate-300 ml-1">/100</span>
              </p>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${isPassed ? 'bg-indigo-500' : 'bg-rose-500'}`} style={{ width: `${submissionResult.score}%` }}></div>
              </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl space-y-2">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Review</p>
               <p className="text-xs font-medium text-slate-600 leading-relaxed italic line-clamp-5">
                 "{submissionResult.feedback}"
               </p>
               <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-200">
                  <i className="fas fa-shield-halved text-amber-500 text-[10px]"></i>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Violations: {submissionResult.integrityViolations}</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-6">
            {isPassed ? (
              <button 
                onClick={handleProceed}
                className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all flex items-center justify-center space-x-3 shadow-xl"
              >
                <span>Connect with AI Recruiter</span>
                <i className="fas fa-comment-dots"></i>
              </button>
            ) : (
              <button 
                onClick={() => setSubmissionResult(null)}
                className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"
              >
                Retry Challenge
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-4 animate-page-entry">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Role</span>
            <span className="text-sm font-black text-slate-900">{role}</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="flex items-center space-x-2 text-slate-500 font-bold bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <i className="fas fa-clock text-indigo-500"></i>
            <span>{formatTime(timeRemaining)}</span>
          </div>
          <div className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2">
            <i className="fas fa-shield-halved"></i>
            <span>Monitoring Active</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-indigo-600 transition-all flex items-center space-x-3 shadow-lg"
        >
          {isSubmitting ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-cloud-upload"></i>}
          <span>Finalize Lab</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Dynamic Problem Description */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-y-auto p-10 space-y-6 shadow-sm custom-scrollbar">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Industry Lab Case</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{challenge?.title}</h2>
          </div>
          
          <div className="prose prose-slate max-w-none text-slate-600 font-medium leading-relaxed">
            <p className="whitespace-pre-wrap">{challenge?.description}</p>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
             <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider mb-4">Evaluation Criteria</h4>
             <ul className="space-y-3">
                {[
                  'Algorithmic Efficiency (Time/Space)',
                  'Code Readability & Cleanliness',
                  'Handling of Complex Edge Cases',
                  'Minimum Pass Score: 60/100'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-xs font-bold text-slate-500">
                     <i className="fas fa-check text-indigo-500"></i>
                     <span>{item}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-[#0f172a] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative border-4 border-slate-800/50">
          <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <div className="h-4 w-px bg-white/10 mx-2"></div>
              <div className="flex items-center space-x-2">
                <i className="fab fa-js text-yellow-400"></i>
                <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">assessment.js</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative font-mono text-sm group">
            <div className="absolute top-0 left-0 w-12 h-full text-center text-white/10 select-none border-r border-white/5 leading-7 py-4 pointer-events-none">
              {[...Array(25)].map((_, i) => <div key={i}>{i+1}</div>)}
            </div>
            <textarea
              className="w-full h-full bg-transparent text-indigo-50 p-4 pl-16 resize-none outline-none leading-7 placeholder:text-white/5 custom-scrollbar"
              spellCheck={false}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingAssessment;
