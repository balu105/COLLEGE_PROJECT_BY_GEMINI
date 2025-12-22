
import { CandidateProfile, AssessmentStage } from '../types';

const STORAGE_KEY = 'hireai_profiles';
const AUTH_KEY = 'hireai_current_user_id';

export const dbService = {
  // Helper to get current local session
  getCurrentUserId(): string | null {
    return localStorage.getItem(AUTH_KEY);
  },

  setCurrentUserId(userId: string | null) {
    if (userId) localStorage.setItem(AUTH_KEY, userId);
    else localStorage.removeItem(AUTH_KEY);
  },

  async getProfile(userId: string): Promise<CandidateProfile | null> {
    try {
      const allProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const data = allProfiles[userId];
      
      if (!data) return null;
      
      return {
        ...data,
        currentStage: data.currentStage as AssessmentStage
      };
    } catch (err) {
      console.error('Local Storage Read Error:', err);
      return null;
    }
  },

  async saveProfile(userId: string, profile: CandidateProfile): Promise<boolean> {
    try {
      const allProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      allProfiles[userId] = {
        ...profile,
        last_updated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProfiles));
      return true;
    } catch (err) {
      console.error('Local Storage Write Error:', err);
      return false;
    }
  }
};
