
import { geminiService } from './geminiService';

export const generateJobDescription = async (role: string) => {
  const data = await geminiService.generateJobDescription(role);
  return data.jobDescription;
};

export const analyzeResume = async (resumeText: string, targetRole: string = "Software Engineer", targetJD: string = "") => {
  return geminiService.analyzeResume(resumeText, targetRole, targetJD);
};

export const generateTechnicalQuestions = async (role: string, skills: string[]) => {
  return geminiService.generateTechnicalQuestions(role, skills);
};

export const generateCodingChallenge = async (role: string, skills: string[], language: string = 'javascript') => {
  return geminiService.generateCodingChallenge(role, skills, language);
};

export const runCodeTests = async (challenge: any, code: string, language: string) => {
  return geminiService.runCodeTests(challenge, code, language);
};

export const evaluateCode = async (challenges: any[], codes: string[], language: string = 'javascript') => {
  return geminiService.evaluateCode(challenges, codes, language);
};

export const getNextInterviewQuestion = async (role: string, transcript: string[]) => {
  const data = await geminiService.getNextInterviewQuestion(role, transcript);
  return data.question;
};

export const evaluateInterview = async (transcript: string[]) => {
  return geminiService.evaluateInterview(transcript);
};

export const calculateJRI = async (data: any) => {
  return geminiService.calculateJRI(data);
};
