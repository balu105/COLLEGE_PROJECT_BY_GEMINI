
import React, { useState, useRef } from 'react';
import { analyzeResume } from '../../services/aiClient';
import { CandidateProfile } from '../../types';

interface ResumeAnalyzerProps {
  onAnalyzed: (profile: CandidateProfile) => void;
  targetRole?: string;
  targetJD?: string;
}

const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({ onAnalyzed, targetRole, targetJD }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<CandidateProfile | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualText, setManualText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    'Scanning Document...',
    'Initializing Neural Retrieval...',
    'Benchmarking Market Trends...',
    'Finalizing Alignment Score...'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const startAnalysis = async () => {
    setIsParsing(true);
    setUploadProgress(0);

    for (let i = 0; i < steps.length; i++) {
      setParseStep(steps[i]);
      setUploadProgress((i + 1) * (100 / steps.length));
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const textToAnalyze = isManualEntry ? manualText : "Resume: " + file?.name;
      const result = await analyzeResume(textToAnalyze, targetRole, targetJD);
      setAnalysisResult({
        ...result,
        resumeFileName: file?.name,
        resumeFileType: file?.type
      });
    } catch (err) {
      setError('Analysis failed.');
    } finally {
      setIsParsing(false);
    }
  };

  if (analysisResult) {
    const isPassed = (analysisResult.resumeScore || 0) >= 70;
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-page-entry">
        <div className={`hireai-card p-12 border-2 ${isPassed ? 'border-emerald-500/20' : 'border-rose-500/20'} space-y-10`}>
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {isPassed ? 'Selection Verified' : 'Refinement Required'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-8 rounded-3xl space-y-3 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Score</p>
              <p className="text-5xl font-black text-indigo-600">{analysisResult.resumeScore}%</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-3xl space-y-4">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Feedback</p>
               <p className="text-xs font-medium text-slate-600 italic">"{analysisResult.resumeFeedback}"</p>
            </div>
          </div>

          {analysisResult.groundingSources && analysisResult.groundingSources.length > 0 && (
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
               <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center">
                 <i className="fas fa-search-nodes mr-2"></i>
                 Retrieved Market References
               </p>
               <div className="flex flex-wrap gap-2">
                 {analysisResult.groundingSources.map((s, i) => (
                   <a key={i} href={s.uri} target="_blank" className="px-3 py-1.5 bg-white rounded-lg text-[10px] font-bold text-slate-600 hover:text-indigo-600 transition-colors border border-slate-200">
                     {s.title}
                   </a>
                 ))}
               </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              onClick={() => onAnalyzed(analysisResult)}
              className="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all"
            >
              Continue to Skill Forge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="hireai-card p-10 space-y-8 relative overflow-hidden">
        {isParsing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-12 text-center space-y-6">
             <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <h3 className="text-xl font-black text-slate-900">{parseStep}</h3>
          </div>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-900">Resume Benchmarking</h2>
          <button onClick={() => setIsManualEntry(!isManualEntry)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {isManualEntry ? 'Upload File' : 'Paste Text'}
          </button>
        </div>

        {isManualEntry ? (
          <textarea className="hireai-input h-64" placeholder="Skills, experience..." value={manualText} onChange={e => setManualText(e.target.value)} />
        ) : (
          <div onClick={() => fileInputRef.current?.click()} className="border-4 border-dashed border-slate-100 rounded-[3rem] p-16 flex flex-col items-center justify-center text-center space-y-4 cursor-pointer hover:bg-slate-50 transition-all">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <i className="fas fa-cloud-upload text-4xl text-slate-300"></i>
            <p className="font-bold text-slate-500">{file ? file.name : 'Drop Resume PDF/TXT'}</p>
          </div>
        )}

        <button onClick={startAnalysis} disabled={!file && !manualText} className="hireai-button-primary w-full py-6">
          Initialize AI Analysis
        </button>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
