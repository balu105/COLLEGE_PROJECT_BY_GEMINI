
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const extractGrounding = (response: any) => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks.map((chunk: any) => ({
    title: chunk.web?.title || 'External Source',
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri);
};

export const generateJobDescription = async (role: string) => {
  // Fix: Instantiate GoogleGenAI inside the function to ensure it uses the current process.env.API_KEY.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a concise, professional job description for the role: "${role}". Focus on key technical responsibilities.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { jobDescription: { type: Type.STRING } },
        required: ["jobDescription"]
      }
    }
  });
  return JSON.parse(response.text).jobDescription;
};

export const analyzeResume = async (resumeText: string, targetRole: string = "Software Engineer", targetJD: string = "") => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Fix: Switched from gemini-3-pro-image-preview to gemini-3-pro-preview because nano-banana models 
  // do not support responseMimeType or responseSchema.
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview", 
    contents: `Retrieve current 2025 industry standards for a "${targetRole}" position. 
    Analyze this resume against those retrieved standards and this specific JD: ${targetJD}. 
    Resume: ${resumeText}`,
    config: {
      tools: [{ googleSearch: {} }],
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
  
  const result = JSON.parse(response.text);
  return {
    ...result,
    groundingSources: extractGrounding(response)
  };
};

export const generateTechnicalQuestions = async (role: string, skills: string[]) => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 technical MCQs for a "${role}" role. Skills: ${skills.join(", ")}.`,
    config: {
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
};

export const generateCodingChallenge = async (role: string, skills: string[], targetJD: string = "") => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a coding challenge for a "${role}". Skills: ${skills.join(", ")}. JD Context: ${targetJD}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          starterCode: { type: Type.STRING },
          testCase: { type: Type.STRING }
        },
        required: ["title", "description", "starterCode", "testCase"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const evaluateCode = async (question: string, code: string) => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Evaluate this solution for: "${question}". Code: \n${code}`,
    config: {
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
};

export const evaluateInterview = async (transcript: string[]) => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Evaluate this interview transcript for clarity, confidence, and sentiment. Transcript: \n${transcript.join('\n')}`,
    config: {
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
};

export const calculateJRI = async (data: any) => {
  // Fix: Instantiate GoogleGenAI inside the function.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Fix: Switched from gemini-3-pro-image-preview to gemini-3-pro-preview to support JSON response formatting.
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `As a Hiring Board, evaluate this candidate: ${JSON.stringify(data)}. 
    Retrieve the latest salary range and demand levels for this role to include in the summary.`,
    config: {
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
              },
              required: ["domain", "score", "gap", "actionPlan", "suggestedResources"]
            }
          }
        },
        required: ["overallScore", "verdict", "decisionSummary", "resumeQuality", "technicalProficiency", "communicationLevel", "ethicalBehavior", "improvements"]
      }
    }
  });
  
  const result = JSON.parse(response.text);
  return {
    ...result,
    groundingSources: extractGrounding(response)
  };
};
