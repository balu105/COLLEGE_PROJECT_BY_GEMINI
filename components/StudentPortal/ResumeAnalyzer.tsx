import React, { useState, useRef } from 'react';
import { analyzeResume } from '../../services/aiClient';
import { CandidateProfile } from '../../types';
import Loading from '../Loading';

interface ResumeAnalyzerProps {
  onAnalyzed: (profile: CandidateProfile) => void;
  targetRole?: string;
  targetJD?: string;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onAnalyzed, targetRole, targetJD }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [manualText, setManualText] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CandidateProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    'Scanning Document...', 
    'Initializing Neural Retrieval...', 
    'Benchmarking Market Trends...', 
    'Finalizing Alignment Score...'
  ];

  const startAnalysis = async () => {
    if (!file && !manualText) return;
    
    setIsParsing(true);
    setError(null);

    // Simulated visualization of steps while awaiting API
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx < steps.length) {
        setParseStep(steps[stepIdx]);
        stepIdx++;
      }
    }, 1000);

    try {
      const text = isManualEntry ? manualText : "Resume Content Ingested: " + (file?.name || "Candidate_Asset.pdf") + ". [Automated Extraction Placeholder]";
      const result = await analyzeResume(text, targetRole || "Software Engineer", targetJD || "");
      
      if (!result || result.error) {
        throw new Error(result?.error || "Neural kernel returned an invalid response.");
      }

      const hydratedResult: CandidateProfile = { 
        name: result.name || 'Candidate',
        email: '', 
        university: '',
        experience: '',
        skills: result.skills || [],
        education: [],
        workExperience: [],
        projects: [],
        certificates: [],
        ...result, 
        resumeContent: text, 
        resumeFileName: file?.name || 'Manual_Entry'
      };
      
      setAnalysisResult(hydratedResult);
    } catch (err: any) {
      console.error("AI Analysis Failed:", err);
      setError(err.message || "Neural scan failed. Please verify infrastructure integrity.");
    } finally {
      clearInterval(stepInterval);
      setIsParsing(false);
    }
  };

  if (analysisResult) {
    const isPassed = (analysisResult.resumeScore || 0) >= 70;
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-reveal">
        <div className={`hireai-card-solid p-16 border-2 ${isPassed ? 'border-emerald-500/20' : 'border-rose-500/20'} space-y-12 relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 w-64 h-64 bg-${isPassed ? 'emerald' : 'rose'}-500/5 blur-[80px] rounded-full -mr-32 -mt-32`}></div>
          
          <div className="text-center space-y-4 relative z-10">
             <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${isPassed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                <i className={`fas ${isPassed ? 'fa-check-double' : 'fa-triangle-exclamation'} text-2xl`}></i>
             </div>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">
              {isPassed ? 'Selection Verified' : 'Refinement Required'}
            </h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">Neural Assessment Result v4.0</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/5 text-center flex flex-col justify-center space-y-4 shadow-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alignment Score</p>
              <p className={`text-7xl font-black ${isPassed ? 'text-emerald-500' : 'text-amber-500'}`}>{analysisResult.resumeScore || 0}%</p>
            </div>
            <div className="bg-white/5 p-12 rounded-[3rem] border border-white/5 space-y-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Cognitive Feedback</p>
              <p className="text-base font-medium text-slate-400 leading-relaxed italic">"{analysisResult.resumeFeedback || 'Analysis summary unavailable.'}"</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <button onClick={() => onAnalyzed(analysisResult)} className="cta-primary w-full py-6 text-lg justify-center shadow-none">
              {isPassed ? 'Advance to Skill Forge' : 'Acknowledge Result'}
            </button>
            {!isPassed && (
              <button onClick={() => setAnalysisResult(null)} className="cta-secondary w-full py-6 text-sm justify-center">
                Return to Data Injection
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-reveal">
      <div className="bg-[#0a0d1a] border border-white/10 rounded-[4rem] p-16 space-y-12 relative overflow-hidden min-h-[600px] flex flex-col justify-center shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
        {isParsing && (
          <div className="absolute inset-0 bg-[#020410]/95 backdrop-blur-3xl z-30 flex flex-col items-center justify-center p-12 text-center">
            <Loading message={parseStep || 'Connecting Kernel'} subMessage="Parsing Binary Document Data" />
          </div>
        )}

        {error && (
          <div className="p-8 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] flex items-start gap-6 animate-reveal">
            <i className="fas fa-triangle-exclamation text-rose-500 mt-1"></i>
            <div className="space-y-2">
              <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Neural Scan Error</p>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter">Neural Identity Scan</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Phase 02: Resource Analysis</p>
          </div>
          <button 
            onClick={() => setIsManualEntry(!isManualEntry)} 
            className="text-[10px] font-black text-[#5551ff] hover:text-white uppercase tracking-widest transition-all px-4 py-2 bg-[#5551ff]/5 rounded-xl border border-[#5551ff]/20"
          >
            {isManualEntry ? 'Toggle File Link' : 'Toggle Manual Entry'}
          </button>
        </div>

        {isManualEntry ? (
          <textarea 
            className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] h-80 py-8 px-10 leading-relaxed outline-none focus:border-[#5551ff]/30 transition-all text-slate-300 font-medium placeholder:text-slate-700" 
            placeholder="Inject comprehensive professional history log here..." 
            value={manualText} 
            onChange={e => setManualText(e.target.value)} 
          />
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()} 
            className="border-2 border-dashed border-white/10 rounded-[3.5rem] p-24 flex flex-col items-center justify-center text-center space-y-8 cursor-pointer hover:bg-white/[0.03] hover:border-[#5551ff]/40 transition-all group relative bg-white/[0.01]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="hidden" 
              accept=".pdf,.txt,.doc,.docx"
            />
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.03)] border border-white/10">
               <i className="fas fa-file-arrow-up text-3xl text-slate-400"></i>
            </div>
            <div className="space-y-3">
              <p className="font-black text-white tracking-tight text-2xl">
                {file ? file.name : 'Drop Resume PDF/TXT'}
              </p>
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">Proprietary Data Ingestion System</p>
            </div>
          </div>
        )}

        <button 
          onClick={startAnalysis} 
          disabled={(!file && !manualText) || isParsing} 
          className="w-full py-6 bg-[#5551ff] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#6662ff] hover:shadow-[0_20px_40px_rgba(85,81,255,0.3)] disabled:opacity-20 transition-all flex items-center justify-center gap-4"
        >
          {isParsing ? 'Initializing Neural Kernel...' : 'INITIALIZE AI ANALYSIS'}
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
