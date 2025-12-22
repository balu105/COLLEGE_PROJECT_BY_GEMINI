
import { GoogleGenAI, Type } from "@google/genai";

// Helper to clean and parse JSON from AI response
const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  try {
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error. Text received:", text);
    return { error: "Failed to parse model response as JSON", raw: text };
  }
};

export default async function handler(req: any, res: any) {
  // 1. Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 2. Strict Method Check
  if (req.method !== 'POST') {
    console.warn(`Attempted non-POST request: ${req.method} to /api/gemini`);
    return res.status(405).json({ error: 'Method not allowed. This endpoint only accepts POST requests.' });
  }

  const { action, payload } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ 
      error: 'API_KEY is missing in the server environment.' 
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    switch (action) {
      case 'generateJobDescription': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a concise, professional job description for: "${payload.role}". Focus on key technical responsibilities. Output ONLY valid JSON.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { jobDescription: { type: Type.STRING } },
              required: ["jobDescription"]
            }
          }
        });
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'analyzeResume': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Retrieve current 2025 standards for a "${payload.targetRole}". 
          Analyze this resume against those standards and JD: ${payload.targetJD}. 
          Resume: ${payload.resumeText}
          Output JSON: { "name": string, "skills": string[], "resumeScore": number, "resumeFeedback": string }`,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        
        return res.status(200).json({
          ...safeJsonParse(response.text),
          groundingSources: extractGrounding(response)
        });
      }

      case 'generateTechnicalQuestions': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate 5 technical MCQs for "${payload.role}". Skills: ${payload.skills.join(", ")}.`,
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'generateCodingChallenge': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Generate a coding challenge for: "${payload.role}". Skills: ${payload.skills.join(", ")}. JD: ${payload.targetJD}.`,
          config: {
            thinkingConfig: { thinkingBudget: 16384 },
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'evaluateCode': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Evaluate code for: "${payload.question}". Code: \n${payload.code}`,
          config: {
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'getNextInterviewQuestion': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `AI Recruiter. Role: ${payload.role}. History: \n${payload.transcript.join('\n')}`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { question: { type: Type.STRING } },
              required: ["question"]
            }
          }
        });
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'evaluateInterview': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Evaluate transcript: \n${payload.transcript.join('\n')}`,
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'calculateJRI': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Calculate JRI for: ${JSON.stringify(payload.data)}. Use 2025 market context.`,
          config: {
            tools: [{ googleSearch: {} }]
          }
        });
        return res.status(200).json({
          ...safeJsonParse(response.text),
          groundingSources: extractGrounding(response)
        });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}

function extractGrounding(response: any) {
  try {
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) return [];
    return chunks
      .map((chunk: any) => ({
        title: chunk.web?.title || 'External Source',
        uri: chunk.web?.uri
      }))
      .filter((s: any) => s.uri);
  } catch (e) {
    return [];
  }
}
