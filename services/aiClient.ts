
/**
 * Frontend API Wrapper
 * All calls are proxied through server-side /api/gemini for security.
 * NO Gemini SDK or process.env.API_KEY is referenced here.
 */

async function callApi(action: string, payload: any) {
  const response = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch from Gemini Proxy');
  }

  return response.json();
}

export const generateJobDescription = async (role: string) => {
  const data = await callApi('generateJobDescription', { role });
  return data.jobDescription;
};

export const analyzeResume = async (resumeText: string, targetRole: string = "Software Engineer", targetJD: string = "") => {
  return callApi('analyzeResume', { resumeText, targetRole, targetJD });
};

export const generateTechnicalQuestions = async (role: string, skills: string[]) => {
  return callApi('generateTechnicalQuestions', { role, skills });
};

export const generateCodingChallenge = async (role: string, skills: string[], targetJD: string = "") => {
  return callApi('generateCodingChallenge', { role, skills, targetJD });
};

export const evaluateCode = async (question: string, code: string) => {
  return callApi('evaluateCode', { question, code });
};

export const getNextInterviewQuestion = async (role: string, transcript: string[]) => {
  const data = await callApi('getNextInterviewQuestion', { role, transcript });
  return data.question;
};

export const evaluateInterview = async (transcript: string[]) => {
  return callApi('evaluateInterview', { transcript });
};

export const calculateJRI = async (data: any) => {
  return callApi('calculateJRI', { data });
};
