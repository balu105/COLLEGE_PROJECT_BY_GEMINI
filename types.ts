
export enum UserRole {
  GUEST = 'GUEST',
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum AuthStage {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}

export enum AssessmentStage {
  PROCESS_GUIDE = 'PROCESS_GUIDE',
  PROFILE = 'PROFILE',
  RESUME = 'RESUME',
  ROLE_SELECTION = 'ROLE_SELECTION',
  TECHNICAL_CODING = 'TECHNICAL_CODING',
  INTERVIEW = 'INTERVIEW',
  RESULTS = 'RESULTS'
}

export interface EducationEntry {
  school: string;
  degree: string;
  year: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectEntry {
  title: string;
  description: string;
  link?: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface CodingSolution {
  challengeTitle: string;
  code: string;
  topic: string;
}

export interface CandidateProfile {
  name: string;
  email: string;
  university: string;
  experience: string;
  skills: string[];
  education: EducationEntry[];
  workExperience: ExperienceEntry[];
  projects: ProjectEntry[];
  certificates: string[];
  selectedRole?: string;
  targetJD?: string;
  currentStage?: AssessmentStage;
  avatarUrl?: string;
  resumeScore?: number;
  resumeFeedback?: string;
  resumeFileName?: string;
  resumeFileType?: string;
  resumeContent?: string;
  isResumePassed?: boolean;
  isCodingPassed?: boolean;
  isInterviewPassed?: boolean;
  technicalResult?: TechnicalScore | null;
  interviewResult?: InterviewEvaluation | null;
  groundingSources?: GroundingSource[];
}

export interface TechnicalScore {
  score: number;
  total: number;
  feedback: string;
  integrityViolations: number;
  solutions: CodingSolution[]; // Stores the actual code session data
}

export interface InterviewEvaluation {
  clarity: number;
  confidence: number;
  sentiment: string;
  transcript: string[]; // Stores the line-by-line conversation details
  feedback: string;
  integrityViolations: number;
}

export interface DomainImprovement {
  domain: string;
  score: number;
  gap: string;
  actionPlan: string[];
  suggestedResources: string[];
}

export interface JRIReport {
  overallScore: number;
  verdict: 'SELECTED' | 'HIGHLY_RECOMMENDED' | 'NEEDS_GROWTH';
  decisionSummary: string;
  resumeQuality: number;
  technicalProficiency: number;
  communicationLevel: number;
  ethicalBehavior: number;
  improvements: DomainImprovement[];
  groundingSources?: GroundingSource[];
}

export interface AppState {
  role: UserRole;
  authStage: AuthStage;
  assessmentStage: AssessmentStage;
  user: CandidateProfile | null;
  technical: TechnicalScore | null;
  interview: InterviewEvaluation | null;
}