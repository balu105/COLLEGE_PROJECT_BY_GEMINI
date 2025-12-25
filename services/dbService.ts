
import { CandidateProfile, AssessmentStage } from '../types';
import { supabase } from './supabaseClient';

const AUTH_KEY = 'hireai_active_session_token';
const USER_DATA_PREFIX = 'hireai_u_';

/**
 * Ensures a profile object is fully hydrated with all nested data structures.
 */
const initializeProfile = (profile: any, userId: string): CandidateProfile => {
  return {
    id: userId,
    email: profile?.email || '',
    name: profile?.name || 'Candidate',
    university: profile?.university || '',
    experience: profile?.experience || '',
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    education: Array.isArray(profile?.education) ? profile.education : [],
    workExperience: Array.isArray(profile?.workExperience) ? profile.workExperience : [],
    projects: Array.isArray(profile?.projects) ? profile.projects : [],
    certificates: Array.isArray(profile?.certificates) ? profile.certificates : [],
    isResumePassed: !!profile?.isResumePassed,
    isCodingPassed: !!profile?.isCodingPassed,
    isInterviewPassed: !!profile?.isInterviewPassed,
    currentStage: profile?.currentStage || AssessmentStage.PROCESS_GUIDE,
    // THE CRITICAL DATA BLOCKS
    technicalResult: profile?.technicalResult || null,
    interviewResult: profile?.interviewResult || null,
    resumeScore: profile?.resumeScore || 0,
    resumeFeedback: profile?.resumeFeedback || '',
    resumeContent: profile?.resumeContent || '',
    resumeFileName: profile?.resumeFileName || '',
    resumeFileType: profile?.resumeFileType || '',
    targetJD: profile?.targetJD || '',
    selectedRole: profile?.selectedRole || '',
    avatarUrl: profile?.avatarUrl || '',
    groundingSources: Array.isArray(profile?.groundingSources) ? profile.groundingSources : []
  } as CandidateProfile;
};

export const dbService = {
  getCurrentUserId(): string | null {
    return localStorage.getItem(AUTH_KEY);
  },

  setCurrentUserId(userId: string | null) {
    if (userId) {
      localStorage.setItem(AUTH_KEY, userId);
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  async getProfile(userId: string): Promise<CandidateProfile | null> {
    const cached = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    let profile: CandidateProfile | null = cached ? initializeProfile(JSON.parse(cached), userId) : null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const cloudBlob = data.data || {};
        profile = initializeProfile({ ...cloudBlob, ...data }, userId);
        localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(profile));
      }
    } catch (err) {
      console.error('Proprietary Sync Recovery Failed:', err);
    }

    return profile || initializeProfile({}, userId);
  },

  async getAllProfiles(): Promise<CandidateProfile[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data.map(d => initializeProfile({ ...d.data, ...d }, d.id));
    } catch (err) {
      console.error('Failed to fetch profiles:', err);
      return [];
    }
  },

  async saveProfile(userId: string, profile: CandidateProfile): Promise<boolean> {
    const safeProfile = initializeProfile(profile, userId);
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(safeProfile));

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: safeProfile.email,
          name: safeProfile.name,
          current_stage: safeProfile.currentStage,
          data: safeProfile,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase Persistence Error:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Network failure during cloud backup:', err);
      return false; 
    }
  }
};
