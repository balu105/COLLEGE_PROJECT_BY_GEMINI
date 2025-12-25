
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { evaluateInterview, getNextInterviewQuestion } from '../../services/aiClient';
import { InterviewEvaluation } from '../../types';

interface AIInterviewRoomProps {
  onComplete: (evalResult: InterviewEvaluation) => void;
  role?: string;
}

enum InterviewState {
  SETUP = 'SETUP',
  ACTIVE = 'ACTIVE',
  COMPLETING = 'COMPLETING'
}

const AIInterviewRoom: React.FC<AIInterviewRoomProps> = ({ onComplete, role = "Software Engineer" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<InterviewState>(InterviewState.SETUP);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcription, setTranscription] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  
  const transcriptHistoryRef = useRef<string[]>([]);
  const violationsRef = useRef(0);
  const [violations, setViolations] = useState(0);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && phase === InterviewState.ACTIVE) {
      violationsRef.current += 1;
      setViolations(violationsRef.current);
      alert("Proctoring Alert: Tab switching detected. This activity is being logged in the session transcript.");
    }
  }, [phase]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  const fetchNextQuestion = async () => {
    setIsThinking(true);
    try {
      const question = await getNextInterviewQuestion(role, transcriptHistoryRef.current);
      setTranscription(prev => [...prev, { role: 'ai', text: question }]);
      transcriptHistoryRef.current.push(`AI: ${question}`);
    } catch (error) {
      console.error("Failed to get next question", error);
    } finally {
      setIsThinking(false);
    }
  };

  const startInterview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setPhase(InterviewState.ACTIVE);
      fetchNextQuestion();
    } catch (err) {
      alert("Camera and Microphone access are required for the AI Interview session capture.");
    }
  };

  const handleSend = async () => {
    if (!userInput.trim() || isThinking) return;
    
    const userMsg = userInput.trim();
    setTranscription(prev => [...prev, { role: 'user', text: userMsg }]);
    transcriptHistoryRef.current.push(`USER: ${userMsg}`);
    setUserInput('');

    // Limit interview to 8 turns for efficiency or end on command
    if (transcriptHistoryRef.current.length >= 8) {
      stopInterview();
    } else {
      fetchNextQuestion();
    }
  };

  const stopInterview = async () => {
    setPhase(InterviewState.COMPLETING);
    setIsSubmitting(true);
    
    try {
      // Evaluate the raw transcript
      const result = await evaluateInterview(transcriptHistoryRef.current);
      
      // Package the detailed session record
      const fullSessionRecord: InterviewEvaluation = {
        clarity: result.clarity || 0,
        confidence: result.confidence || 0,
        sentiment: result.sentiment || 'Neutral',
        feedback: result.feedback || 'Session concluded.',
        transcript: transcriptHistoryRef.current, // NEW: Full persistent transcript
        integrityViolations: violationsRef.current // NEW: Fraud detection logs
      };

      onComplete(fullSessionRecord);
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (phase === InterviewState.SETUP) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl text-center space-y-10">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl">
            <i className="fas fa-video text-3xl"></i>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interactive Assessment</h2>
            <p className="text-slate-500 font-medium">This session is recorded. Full audio-to-text transcripts and behavioral logs will be stored in your proprietary vault.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
             <i className="fas fa-shield-check text-indigo-500 text-xl"></i>
             <div className="text-left">
                <p className="text-[10px] font-black text-slate-900 uppercase">Proctoring Active</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Biometric and tab-switch monitoring enabled</p>
             </div>
          </div>
          <button onClick={startInterview} className="hireai-button-primary w-full py-5 text-lg">Initialize Secure Session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto h-[650px] animate-page-entry">
      <div className="space-y-4 h-full flex flex-col">
        <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
          <div className="absolute top-6 left-6 flex space-x-2">
            <div className="bg-red-600 px-3 py-1.5 rounded-xl text-white text-[10px] font-black tracking-widest flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              SESSION RECORDING
            </div>
            {violations > 0 && <div className="bg-amber-500 px-3 py-1.5 rounded-xl text-white text-[10px] font-black tracking-widest uppercase">Anomaly Logged</div>}
          </div>
        </div>
        <div className="bg-indigo-900/5 p-6 rounded-[2rem] border border-indigo-100 flex-1">
           <div className="flex items-center justify-between mb-3">
              <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Behavioral Intelligence</h4>
              <i className="fas fa-fingerprint text-indigo-400"></i>
           </div>
           <p className="text-xs text-slate-500 leading-relaxed">
             The engine is currently serializing your responses. Avoid switching windows or multitasking to ensure session integrity and maximum score.
           </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-black text-slate-900">Transcript Feed</h3>
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center">
            <i className="fas fa-circle text-[6px] mr-2"></i> Vault Connected
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {transcription.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-5 rounded-3xl text-sm ${msg.role === 'ai' ? 'bg-slate-100 text-slate-800' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-slate-50 p-4 rounded-2xl flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          {isSubmitting && <div className="text-center text-xs font-black text-indigo-600 animate-pulse uppercase tracking-widest mt-4">Committing Session to Vault...</div>}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100">
           <div className="relative">
              <input 
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Submit response to AI Recruiter..."
                disabled={isThinking || phase === InterviewState.COMPLETING}
                className="w-full hireai-input pr-16 bg-white"
              />
              <button 
                onClick={handleSend}
                disabled={!userInput.trim() || isThinking || phase === InterviewState.COMPLETING}
                className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
           </div>
           <div className="mt-3 flex justify-between items-center px-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Turns Captured: {Math.round((transcriptHistoryRef.current.length / 8) * 100)}%
              </p>
              <button onClick={stopInterview} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">
                End & Commit
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterviewRoom;
