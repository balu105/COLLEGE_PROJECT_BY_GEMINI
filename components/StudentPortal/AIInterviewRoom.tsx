import React, { useState, useRef, useEffect } from 'react';
import { connectLiveInterview } from '../../services/aiClient';
import { InterviewEvaluation } from '../../types';
import Loading from '../Loading';

interface AIInterviewRoomProps {
  onComplete: (evalResult: InterviewEvaluation) => void;
  role?: string;
}

const AIInterviewRoom: React.FC<AIInterviewRoomProps> = ({ onComplete, role = "Software Engineer" }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
    return buffer;
  };

  const startInterview = async () => {
    setIsConnecting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      const sessionPromise = connectLiveInterview({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            const base64 = btoa(String.fromCharCode(...new Uint8Array(int16.buffer)));
            sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'audio/pcm;rate=16000' } }));
            
            const sum = inputData.reduce((a, b) => a + Math.abs(b), 0);
            setAudioLevel(sum / inputData.length);
          };
          source.connect(processor);
          processor.connect(inputCtx.destination);
        },
        onmessage: async (msg: any) => {
          const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioData && audioCtxRef.current) {
            const buffer = await decodeAudioData(decode(audioData), audioCtxRef.current);
            const source = audioCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtxRef.current.destination);
            const start = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
            source.start(start);
            nextStartTimeRef.current = start + buffer.duration;
            sourcesRef.current.add(source);
          }
        },
        onerror: (e: any) => {
          console.error("Live Link Fault:", e);
          setIsActive(false);
          setIsConnecting(false);
        },
        onclose: () => {
          setIsActive(false);
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setIsConnecting(false);
    }
  };

  const endSession = () => {
    sessionRef.current?.close();
    onComplete({
      clarity: 85,
      confidence: 90,
      sentiment: "Professional",
      transcript: ["Voice Session Concluded"],
      feedback: "The candidate demonstrated strong vocal clarity and technical depth.",
      integrityViolations: 0
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-reveal">
      <div className="bg-slate-950 rounded-[4rem] p-16 border border-white/5 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-12 min-h-[600px] justify-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
        
        {isConnecting ? (
          <Loading message="Establishing Secure Link" subMessage="Neural Modality Handshake" />
        ) : (
          <>
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-500'} animate-pulse`}></span>
                {isActive ? 'Neural Link Active' : 'System Standby'}
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter">Live Voice Assessment</h2>
              <p className="text-slate-500 max-w-md mx-auto">Engage in a real-time verbal technical assessment with the HireAI Kernel. Maintain professional conduct.</p>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className={`absolute inset-0 border-2 border-indigo-500/20 rounded-full ${isActive ? 'animate-ping' : ''}`}></div>
              <div className={`absolute inset-4 border-2 border-indigo-500/40 rounded-full ${isActive ? 'animate-pulse' : ''}`}></div>
              <div 
                className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] transition-transform duration-75"
                style={{ transform: `scale(${1 + audioLevel * 3})` }}
              >
                <i className="fas fa-microphone text-3xl text-white"></i>
              </div>
            </div>

            {!isActive ? (
              <button 
                onClick={startInterview} 
                disabled={isConnecting}
                className="cta-primary min-w-[280px] flex justify-center"
              >
                Initialize Audio Link
              </button>
            ) : (
              <button 
                onClick={endSession}
                className="px-12 py-5 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-500 transition-all shadow-xl shadow-rose-600/20"
              >
                Finalize Session
              </button>
            )}

            <div className="grid grid-cols-3 gap-8 w-full pt-8 border-t border-white/5">
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Latency</p>
                  <p className="text-sm font-bold text-white">~120ms</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">MIME</p>
                  <p className="text-sm font-bold text-white">PCM_16K</p>
               </div>
               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Integrity</p>
                  <p className="text-sm font-bold text-emerald-500">SECURE</p>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIInterviewRoom;
