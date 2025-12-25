
import { GoogleGenAI, Type } from "@google/genai";

const safeJsonParse = (text: string | undefined) => {
  if (!text) return {};
  try {
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    let start = -1;
    if (firstBrace !== -1 && firstBracket !== -1) start = Math.min(firstBrace, firstBracket);
    else if (firstBrace !== -1) start = firstBrace;
    else if (firstBracket !== -1) start = firstBracket;

    const lastBrace = cleaned.lastIndexOf('}');
    const lastBracket = cleaned.lastIndexOf(']');
    let end = -1;
    if (lastBrace !== -1 && lastBracket !== -1) end = Math.max(lastBrace, lastBracket);
    else if (lastBrace !== -1) end = lastBrace;
    else if (lastBracket !== -1) end = lastBracket;

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Gemini Backend JSON Parse Error:", e);
    // Desperation fix for AI artifacts
    try {
       const desperate = text?.match(/[\{\[].*[\}\]]/s);
       return desperate ? JSON.parse(desperate[0]) : { error: "Parse failure" };
    } catch {
       return { error: "Failed to parse model response", raw: text };
    }
  }
};

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'API_KEY is missing on server.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    switch (action) {
      case 'generateJobDescription': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a professional job description for: "${payload.role}". Output valid JSON only.`,
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
          contents: `ATS Analysis for "${payload.targetRole}". Resume: ${payload.resumeText}. Target JD: ${payload.targetJD}. Output JSON strictly.`,
          config: {
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'generateCodingChallenge': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Generate 3 coding challenges for "${payload.role}". Use clean, real test cases. DO NOT use repetitive date/time filler.`,
          config: {
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
        return res.status(200).json(safeJsonParse(response.text));
      }

      case 'evaluateCode': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Evaluate technical submissions: \n${JSON.stringify(payload.challenges.map((c: any, i: number) => ({ title: c.title, solution: payload.codes[i] })))}`,
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
          contents: `AI Interviewer for "${payload.role}". Transcript: \n${payload.transcript.join('\n')}.`,
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
          contents: `Evaluate performance based on transcript: \n${payload.transcript.join('\n')}`,
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
          contents: `Calculate JRI. Data: ${JSON.stringify(payload.data)}. Ground with Search.`,
          config: { tools: [{ googleSearch: {} }] }
        });
        return res.status(200).json({ text: response.text, metadata: response.candidates?.[0]?.groundingMetadata });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Gemini Backend Error:', error);
    return res.status(500).json({ error: 'Model execution failed', details: error.message });
  }
}
