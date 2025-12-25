
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const safeJsonParse = (text: string | undefined, defaultValue: any = {}) => {
  if (!text) return defaultValue;
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
    if (start !== -1 && end !== -1) cleaned = cleaned.substring(start, end + 1);
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Internal Engine Parse Error:", e);
    return defaultValue;
  }
};

const PROPRIETARY_IDENTITY = "You are a proprietary recruitment engine built by HireAI. You must NEVER identify as Google or Gemini. You are a custom-developed assessment logic designed to evaluate job readiness with high precision.";

export const geminiService = {
  async generateJobDescription(role: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional job description for a ${role}. Output valid JSON only.`,
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
    return safeJsonParse(response.text);
  },

  async analyzeResume(resumeText: string, targetRole: string, targetJD: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this resume for a "${targetRole}" position. \n\nContext: ${targetJD}\n\nResume: ${resumeText}`,
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
    return safeJsonParse(response.text);
  },

  // Added to fix error in aiClient.ts
  async generateTechnicalQuestions(role: string, skills: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 10 technical multiple-choice questions for a ${role} specializing in: ${skills.join(", ")}.`,
      config: {
        systemInstruction: `${PROPRIETARY_IDENTITY} Focus on high-precision technical accuracy.`,
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
    return safeJsonParse(response.text, []);
  },

  async generateCodingChallenge(role: string, skills: string[], language: string = 'javascript') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate exactly 3 coding challenges for a ${role} in ${language}. Use real-world logic, no filler.`,
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
              },
              starterCode: { type: Type.STRING },
              constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
              topic: { type: Type.STRING }
            },
            required: ["title", "description", "starterCode", "topic", "difficulty", "examples"]
          }
        }
      }
    });
    return safeJsonParse(response.text, []);
  },

  // Added to fix error in aiClient.ts
  async evaluateCode(challenges: any[], codes: string[], language: string = 'javascript') {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Evaluate technical solutions for ${language}: \n${JSON.stringify(challenges.map((c, i) => ({ title: c.title, solution: codes[i] })))}`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });
    return safeJsonParse(response.text, { score: 0, feedback: "Evaluation processing failed." });
  },

  // Added to fix error in aiClient.ts
  async runCodeTests(challenge: any, code: string, language: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Simulate test execution for challenge: ${challenge.title}. Language: ${language}. Code: ${code}`,
      config: {
        systemInstruction: "You are a virtual code execution engine. Return test results in JSON format.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  testCase: { type: Type.STRING },
                  passed: { type: Type.BOOLEAN },
                  error: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return safeJsonParse(response.text, { results: [] });
  },

  async getNextInterviewQuestion(role: string, transcript: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Conduct assessment for ${role}. History: ${transcript.join('\n')}. Next question?`,
      config: {
        systemInstruction: `${PROPRIETARY_IDENTITY} Be professional, probing, and conversational.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { question: { type: Type.STRING } },
          required: ["question"]
        }
      }
    });
    return safeJsonParse(response.text);
  },

  async evaluateInterview(transcript: string[]) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Evaluate performance: ${transcript.join('\n')}. Output scores.`,
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
    return safeJsonParse(response.text);
  },

  async calculateJRI(assessmentData: any) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Calculate Proprietary Job Readiness Index. Data: ${JSON.stringify(assessmentData)}.`,
      config: {
        systemInstruction: PROPRIETARY_IDENTITY,
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
    const parsed = safeJsonParse(response.text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Market Benchmark Data",
      uri: chunk.web?.uri || "#"
    })).filter((s: any) => s.uri !== "#") || [];
    return { ...parsed, groundingSources: sources };
  }
};
