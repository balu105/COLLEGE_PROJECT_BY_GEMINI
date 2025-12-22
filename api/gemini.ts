
import { GoogleGenAI, Type } from "@google/genai";

// Helper to clean and parse JSON from AI response
const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  try {
    // Remove markdown code blocks if the model included them
    const cleaned = text.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON Parse Error. Text received:", text);
    // Return a structured error or empty object instead of crashing
    return { error: "Failed to parse model response as JSON", raw: text };
  }
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  // 1. Validate API Key Presence
  if (!process.env.API_KEY) {
    console.error("CRITICAL: API_KEY is not defined in environment variables.");
    return res.status(500).json({ 
      error: 'API configuration error: Gemini API Key is missing. Please add API_KEY to your environment variables.' 
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    switch (action) {
      case 'generateJobDescription': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a concise, professional job description for the role: "${payload.role}". Focus on key technical responsibilities. Output ONLY valid JSON.`,
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
        // Use flash model for search grounding as per guidelines example
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Retrieve current 2025 industry standards for a "${payload.targetRole}" position. 
          Analyze this resume against those standards and this specific JD: ${payload.targetJD}. 
          Resume: ${payload.resumeText}
          Output the analysis as a JSON object with properties: name, skills (array), resumeScore (number 0-100), and resumeFeedback (string).`,
          config: {
            tools: [{ googleSearch: {} }],
            // When using search grounding, avoid responseMimeType: "application/json" 
            // to ensure citations/grounding metadata are handled correctly.
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
          contents: `Generate 5 technical MCQs for a "${payload.role}" role. Skills: ${payload.skills.join(", ")}. Output ONLY a JSON array.`,
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
          contents: `Generate a coding challenge for a "${payload.role}". Skills: ${payload.skills.join(", ")}. JD Context: ${payload.targetJD}. Output ONLY valid JSON.`,
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'evaluateCode': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Evaluate this code solution for the task: "${payload.question}". 
          Code: \n${payload.code}
          Evaluate for score (0-100), feedback, complexity, and whether it passed logical tests.`,
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'getNextInterviewQuestion': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `You are an AI Recruiter. 
          Role: ${payload.role}
          Transcript: \n${payload.transcript.join('\n')}
          Generate the next interview question. Keep it professional.`,
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
          contents: `Evaluate this interview transcript for clarity, confidence, and sentiment. Transcript: \n${payload.transcript.join('\n')}`,
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
          contents: `Evaluate this candidate profile for Job Readiness Index (JRI): ${JSON.stringify(payload.data)}. 
          Include current 2025 market demand levels in your reasoning.
          Output a JSON object with properties: overallScore, verdict (SELECTED, HIGHLY_RECOMMENDED, or NEEDS_GROWTH), decisionSummary, resumeQuality, technicalProficiency, communicationLevel, ethicalBehavior, and improvements (array of objects).`,
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
    console.error('Gemini API Error details:', error);
    // Return the error message to help debug in the frontend console
    return res.status(500).json({ 
      error: 'Backend request failed', 
      details: error.message || 'Unknown server error'
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
