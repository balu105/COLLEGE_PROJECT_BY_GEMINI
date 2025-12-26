import { TechnicalScore, InterviewEvaluation, JRIReport, CandidateProfile } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

const callApi = async (action: string, payload: any) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      let errorMessage = `Kernel Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Response was not JSON (likely a Vercel 504 HTML timeout or 404)
        errorMessage = `Infrastructure Timeout: The neural request took too long or the gateway is unresponsive.`;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`HireAI API Error [${action}]:`, error);
    throw error;
  }
};

export const generateJobDescription = async (role: string): Promise<string> => {
  const data = await callApi('generateJobDescription', { role });
  return data.jobDescription;
};

export const analyzeResume = async (resumeText: string, targetRole: string = "Software Engineer", targetJD: string = "") => {
  return await callApi('analyzeResume', { resumeText, targetRole, targetJD });
};

export const generateTechnicalQuestions = async (role: string, skills: string[]) => {
  return await callApi('generateTechnicalQuestions', { role, skills });
};

export const generateCodingChallenge = async (role: string, skills: string[], language: string = 'javascript') => {
  return await callApi('generateCodingChallenge', { role, skills, language });
};

export const evaluateCode = async (challenges: any[], codes: string[], language: string = 'javascript') => {
  return await callApi('evaluateCode', { challenges, codes, language });
};

export const getNextInterviewQuestion = async (role: string, transcript: string[]): Promise<string> => {
  const data = await callApi('getNextInterviewQuestion', { role, transcript });
  return data.question;
};

export const evaluateInterview = async (transcript: string[]): Promise<InterviewEvaluation> => {
  return await callApi('evaluateInterview', { transcript });
};

export const calculateJRI = async (data: any): Promise<JRIReport> => {
  const result = await callApi('calculateJRI', { data });
  try {
    const parsed = typeof result.text === 'string' ? JSON.parse(result.text.replace(/```json\n?|```/g, '').trim()) : result;
    const sources = result.metadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Market Benchmark",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];
    
    return { ...parsed, groundingSources: sources };
  } catch (e) {
    console.error("Failed to parse JRI result", e);
    return result;
  }
};

// Live API for Browser-side usage
export const connectLiveInterview = async (callbacks: any) => {
  // Use the globally available API KEY as per instructions for direct WebSocket connection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are HireAI Kernel v4.0, a high-performance recruitment engine. Conduct a professional technical interview. Be probing, inquisitive, and maintain a high-level corporate tone.',
    },
  });
};
