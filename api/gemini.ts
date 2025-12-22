
import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, payload } = req.body;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    switch (action) {
      case 'generateJobDescription': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate a concise, professional job description for the role: "${payload.role}". Focus on key technical responsibilities.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { jobDescription: { type: Type.STRING } },
              required: ["jobDescription"]
            }
          }
        });
        return res.status(200).json(JSON.parse(response.text || '{}'));
      }

      case 'analyzeResume': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Retrieve current 2025 industry standards for a "${payload.targetRole}" position. 
          Analyze this resume against those retrieved standards and this specific JD: ${payload.targetJD}. 
          Resume: ${payload.resumeText}`,
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
        return res.status(200).json({
          ...JSON.parse(response.text || '{}'),
          groundingSources: extractGrounding(response)
        });
      }

      case 'generateTechnicalQuestions': {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Generate 5 technical MCQs for a "${payload.role}" role. Skills: ${payload.skills.join(", ")}.`,
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
        return res.status(200).json(JSON.parse(response.text || '[]'));
      }

      case 'generateCodingChallenge': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Generate a coding challenge for a "${payload.role}". Skills: ${payload.skills.join(", ")}. JD Context: ${payload.targetJD}`,
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
        return res.status(200).json(JSON.parse(response.text || '{}'));
      }

      case 'evaluateCode': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `Evaluate this solution for: "${payload.question}". Code: \n${payload.code}`,
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
        return res.status(200).json(JSON.parse(response.text || '{}'));
      }

      case 'getNextInterviewQuestion': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `You are an AI Recruiter. Current Transcript: \n${payload.transcript.join('\n')}\nGenerate the next insightful interview question for a "${payload.role}" position. Keep it conversational but professional.`,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { question: { type: Type.STRING } },
              required: ["question"]
            }
          }
        });
        return res.status(200).json(JSON.parse(response.text || '{}'));
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
        return res.status(200).json(JSON.parse(response.text || '{}'));
      }

      case 'calculateJRI': {
        const response = await ai.models.generateContent({
          model: "gemini-3-pro-preview",
          contents: `As a Hiring Board, evaluate this candidate: ${JSON.stringify(payload.data)}. 
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
        return res.status(200).json({
          ...JSON.parse(response.text || '{}'),
          groundingSources: extractGrounding(response)
        });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

function extractGrounding(response: any) {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return [];
  return chunks.map((chunk: any) => ({
    title: chunk.web?.title || 'External Source',
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri);
}
