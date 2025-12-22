
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { evaluateInterview } from '../services/geminiService';
import { InterviewEvaluation } from '../types';

interface AIInterviewRoomProps {
  onComplete: (evalResult: InterviewEvaluation) => void;
}

enum InterviewState {
  SETUP = 'SETUP',
  ACTIVE = 'ACTIVE',
  COMPLETING = 'COMPLETING'
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AIInterviewRoom: React.FC<AIInterviewRoomProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<InterviewState>(InterviewState.SETUP);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcription, setTranscription] = useState<{ role: 'ai' | 'user'; text: string }[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const transcriptHistoryRef = useRef<string[]>([]);
  const currentOutputTranscriptRef = useRef('');
  const currentInputTranscriptRef = useRef('');
  const violationsRef = useRef(0);
  const [violations, setViolations] = useState(0);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && phase === InterviewState.ACTIVE) {
      violationsRef.current += 1;
      setViolations(violationsRef.current);
      alert("Proctoring Alert: Tab switching detected. This activity is being logged.");
    }
  }, [phase]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleVisibilityChange]);

  const stopInterview = async () => {
    if (sessionRef.current) {
      sessionRef.current = null;
    }
    setPhase(InterviewState.COMPLETING);
    setIsSubmitting(true);
    
    try {
      const result = await evaluateInterview(transcriptHistoryRef.current);
      onComplete({
        ...result,
        transcript: transcriptHistoryRef.current,
        integrityViolations: violationsRef.current
      });
    } catch (error) {
      console.error("Evaluation failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startLiveSession = async (mediaStream: MediaStream) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextRef.current = outputAudioContext;

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: `You are an expert AI recruiter for HireAI. 
        Conduct a professional interview. Observe the candidate's presence via video. 
        Ask 3-4 specific technical or behavioral questions. 
        Conclude by saying "Thank you for your time, this concludes our interview."`,
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          const source = inputAudioContext.createMediaStreamSource(mediaStream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) { int16[i] = inputData[i] * 32768; }
            const pcmBase64 = encode(new Uint8Array(int16.buffer));
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: pcmBase64, mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);

          const interval = setInterval(() => {
            if (videoRef.current && canvasRef.current) {
              const canvas = canvasRef.current;
              const video = videoRef.current;
              canvas.width = 320;
              canvas.height = 180;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
              const base64Data = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } });
              });
            }
          }, 1000);
          (window as any)._interviewInterval = interval;
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audioBase64) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
            const audioBuffer = await decodeAudioData(decode(audioBase64), outputAudioContext, 24000, 1);
            const source = outputAudioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputAudioContext.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.outputTranscription) {
            currentOutputTranscriptRef.current += message.serverContent.outputTranscription.text;
          } else if (message.serverContent?.inputTranscription) {
            currentInputTranscriptRef.current += message.serverContent.inputTranscription.text;
          }

          if (message.serverContent?.turnComplete) {
            const userText = currentInputTranscriptRef.current.trim();
            const aiText = currentOutputTranscriptRef.current.trim();
            if (userText) {
              setTranscription(prev => [...prev, { role: 'user', text: userText }]);
              transcriptHistoryRef.current.push(`USER: ${userText}`);
            }
            if (aiText) {
              setTranscription(prev => [...prev, { role: 'ai', text: aiText }]);
              transcriptHistoryRef.current.push(`AI: ${aiText}`);
              if (aiText.toLowerCase().includes("concludes our interview")) {
                setTimeout(stopInterview, 3000);
              }
            }
            currentInputTranscriptRef.current = '';
            currentOutputTranscriptRef.current = '';
          }
        }
      }
    });
    sessionRef.current = sessionPromise;
  };

  const requestHardware = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setPhase(InterviewState.ACTIVE);
      startLiveSession(mediaStream);
    } catch (err) {
      setPermissionError("Access denied.");
    }
  };

  useEffect(() => {
    if (phase === InterviewState.ACTIVE && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => { if ((window as any)._interviewInterval) clearInterval((window as any)._interviewInterval); };
  }, [phase, stream]);

  if (phase === InterviewState.SETUP) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white rounded-[3rem] p-12 border border-slate-200 shadow-2xl text-center space-y-10">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl">
            <i className="fas fa-video text-3xl"></i>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Interview Session</h2>
            <p className="text-slate-500 font-medium">This session uses real-time multimodal analysis to evaluate communication and behavioral traits.</p>
          </div>
          <button onClick={requestHardware} className="hireai-button-primary w-full py-5 text-lg">Initialize Live Session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto h-[600px]">
      <div className="space-y-4">
        <div className="relative aspect-video bg-slate-950 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover mirror" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute top-6 left-6 flex space-x-2">
            <div className="bg-red-600 px-3 py-1.5 rounded-xl text-white text-[10px] font-black tracking-widest flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              LIVE PROCTORING
            </div>
            {violations > 0 && <div className="bg-amber-500 px-3 py-1.5 rounded-xl text-white text-[10px] font-black tracking-widest">VIOLATION DETECTED</div>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-slate-900">Live AI Recruiter</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypted Stream</span>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-slate-50/30">
          {transcription.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === 'ai' ? 'bg-white border border-slate-200 text-slate-800' : 'bg-indigo-600 text-white'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isSubmitting && <div className="text-center text-xs font-bold text-slate-400 animate-pulse">Processing Final Assessment...</div>}
        </div>
      </div>
    </div>
  );
};

export default AIInterviewRoom;
