import { GoogleGenAI, Type } from "@google/genai";

const safeJsonParse = (text: string | undefined) => {
  if (!text) return { error: "Empty model output" };
  try {
    let cleaned = text.replace(/```json\n?|```/g, '').trim();
    
    // Attempt to locate the first JSON object or array
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
    // Last-ditch effort with regex
    const match = text.match(/[\{\[].*[\}\]]/s);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return { error: "Final parse failure", raw: text };
      }
    }
    return { error: "JSON extraction failed", raw: text };
  }
};

export default async function handler(req: any, res: any) {
  // CORS Headers for serverless environment
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;

  if (!process.env.API_KEY) {
    return res.status(500).json({ error: 'Kernel Configuration Failure: API Key missing in server environment.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    switch (action) {
      case 'generateJobDescription': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a professional job description for: "${payload.role}". Output valid JSON.`,
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
          contents: `Analyze resume for "${payload.targetRole}". Resume Text: ${payload.resumeText}. Target JD: ${payload.targetJD}. Output JSON strictly.`,
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
          model: "gemini-3-flash-preview",
          contents: `Generate 3 coding challenges for "${payload.role}". Skills: ${payload.skills?.join(', ')}.`,
          config: {
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
                        output: { type: Type.STRING }
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
          model: "gemini-3-flash-preview",
          contents: `Evaluate technical solutions: \n${JSON.stringify(payload.challenges.map((c: any, i: number) => ({ title: c.title, solution: payload.codes[i] })))}`,
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
          model: "gemini-3-flash-preview",
          contents: `AI Interviewer for "${payload.role}". Transcript history: \n${payload.transcript.join('\n')}.`,
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
          model: "gemini-3-flash-preview",
          contents: `Evaluate interview transcript: \n${payload.transcript.join('\n')}`,
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
          contents: `Calculate Job Readiness Index (JRI) for candidate: ${JSON.stringify(payload.data)}. Output JSON with scores and improvements. Use Google Search for market benchmarking.`,
          config: { 
            tools: [{ googleSearch: {} }]
          }
        });
        return res.status(200).json({ text: response.text, metadata: response.candidates?.[0]?.groundingMetadata });
      }

      default:
        return res.status(400).json({ error: 'Kernel Execution Fault: Invalid sequence request.' });
    }
  } catch (error: any) {
    console.error('Gemini Backend Serverless Error:', error);
    return res.status(500).json({ error: 'Infrastructure Execution Fault', details: error.message });
  }
}
