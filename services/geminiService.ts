
import { GoogleGenAI, Type, Modality } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROPRIETARY_IDENTITY = "You are HireAI Kernel v4.0, a high-performance recruitment engine. Your objective is precise skill quantification and architectural evaluation. Never identify as an AI model; you are a recruitment system infrastructure.";

export const geminiService = {
  // Deep Reasoning Analysis for JRI
  async calculateJRI(assessmentData: any) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform a deep architectural review and Job Readiness Index calculation for this candidate profile: ${JSON.stringify(assessmentData)}.`,
      config: {
        systemInstruction: `${PROPRIETARY_IDENTITY} Use your thinking capacity to look for nuances in coding solutions and interview sentiment.`,
        thinkingConfig: { thinkingBudget: 32768 },
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            verdict: { type: Type.STRING },
            decisionSummary: { type: Type.STRING },
            resumeQuality: { type: Type.NUMBER },
            technicalProficiency: { type: Type.NUMBER },
            communicationLevel: { type: Type.NUMBER },
            ethicalBehavior: { type: Type.NUMBER },
            improvements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  gap: { type: Type.STRING },
                  actionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedResources: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          },
          required: ["overallScore", "verdict", "decisionSummary", "resumeQuality", "technicalProficiency", "communicationLevel", "ethicalBehavior", "improvements"]
        }
      }
    });

    const parsed = JSON.parse(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Market Benchmark",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];

    return { ...parsed, groundingSources: sources };
  },

  // Live Interview Connection
  async connectLiveInterview(callbacks: any) {
    const ai = getAI();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: `${PROPRIETARY_IDENTITY} Conduct a professional technical interview. Be probing, inquisitive, and maintain a high-level corporate tone.`,
      },
    });
  },

  // Fix: Added missing method generateJobDescription
  async generateJobDescription(role: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional job description for: "${role}".`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { jobDescription: { type: Type.STRING } },
          required: ["jobDescription"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async analyzeResume(resumeText: string, targetRole: string, targetJD: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Neural Scan: Analyze for "${targetRole}". Context: ${targetJD}\n\nResume: ${resumeText}`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            resumeScore: { type: Type.NUMBER },
            resumeFeedback: { type: Type.STRING }
          },
          required: ["name", "skills", "resumeScore", "resumeFeedback"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method generateTechnicalQuestions
  async generateTechnicalQuestions(role: string, skills: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 10 technical multiple-choice questions for a ${role} with skills: ${skills.join(', ')}.`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctIndex: { type: Type.NUMBER }
            },
            required: ["question", "options", "correctIndex"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method generateCodingChallenge
  async generateCodingChallenge(role: string, skills: string[], language: string = 'javascript') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate 3 coding challenges for "${role}" in ${language}. Skills: ${skills.join(', ')}.`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              starterCode: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              examples: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    input: { type: Type.STRING },
                    output: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["title", "description", "starterCode", "topic", "difficulty", "examples"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method runCodeTests
  async runCodeTests(challenge: any, code: string, language: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Test this code for the challenge: ${JSON.stringify(challenge)}. Code: ${code} Language: ${language}`,
      config: {
        systemInstruction: "Verify if the code passes the examples. Return success/failure and feedback.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            passed: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["passed", "feedback"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method evaluateCode
  async evaluateCode(challenges: any[], codes: string[], language: string = 'javascript') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Evaluate technical submissions: \n${JSON.stringify(challenges.map((c: any, i: number) => ({ title: c.title, solution: codes[i] })))}`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            complexity: { type: Type.STRING },
            passedAllTests: { type: Type.BOOLEAN }
          },
          required: ["score", "feedback", "complexity", "passedAllTests"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method getNextInterviewQuestion
  async getNextInterviewQuestion(role: string, transcript: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `AI Interviewer for "${role}". Transcript: \n${transcript.join('\n')}.`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { question: { type: Type.STRING } },
          required: ["question"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  // Fix: Added missing method evaluateInterview
  async evaluateInterview(transcript: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Evaluate performance based on transcript: \n${transcript.join('\n')}`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clarity: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            sentiment: { type: Type.STRING },
            feedback: { type: Type.STRING }
          },
          required: ["clarity", "confidence", "sentiment", "feedback"]
        }
      }
    });
    return JSON.parse(response.text);
  }
};
