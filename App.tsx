import React, { useState, useEffect } from 'react';
import { UserRole, AuthStage, AssessmentStage, AppState, CandidateProfile } from './types';
import { dbService } from './services/dbService';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Auth from './components/Auth';
import StudentProfile from './components/StudentPortal/StudentProfile';
import ResumeAnalyzer from './components/StudentPortal/ResumeAnalyzer';
import RoleSelection from './components/StudentPortal/RoleSelection';
import CodingAssessment from './components/StudentPortal/CodingAssessment';
import AIInterviewRoom from './components/StudentPortal/AIInterviewRoom';
import JRIReport from './components/StudentPortal/JRIReport';
import AdminDashboard from './components/AdminPortal/AdminDashboard';
import StudentDashboard from './components/StudentPortal/StudentDashboard';
import AdminProfile from './components/AdminPortal/AdminProfile';
import Loading from './components/Loading';

interface ExtendedAppState extends AppState {
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
}

const App: React.FC = () => {
  const [state, setState] = useState<ExtendedAppState>({
    role: UserRole.GUEST,
    authStage: AuthStage.LOGIN,
    assessmentStage: AssessmentStage.PROCESS_GUIDE,
    user: null,
    technical: null,
    interview: null,
    isAdminAuthenticated: false,
    isLoading: true,
    isSyncing: false
  });

  useEffect(() => {
    const initAuth = async () => {
      const userId = dbService.getCurrentUserId();
      if (userId) {
        if (userId === 'admin_root') {
          setState(prev => ({ 
            ...prev, 
            role: UserRole.ADMIN, 
            isAdminAuthenticated: true, 
            isLoading: false 
          }));
        } else {
          await fetchAndSyncProfile(userId);
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initAuth();
  }, []);

  const fetchAndSyncProfile = async (userId: string) => {
    setState(prev => ({ ...prev, isSyncing: true, isLoading: true }));
    
    try {
      const profile = await dbService.getProfile(userId);
      
      setState(prev => ({
        ...prev,
        role: UserRole.STUDENT,
        user: profile,
        technical: profile?.technicalResult || null,
        interview: profile?.interviewResult || null,
        assessmentStage: profile?.currentStage || AssessmentStage.PROCESS_GUIDE,
        isLoading: false,
        isSyncing: false
      }));
    } catch (err) {
      console.error("Profile sync failed:", err);
      setState(prev => ({ ...prev, isLoading: false, isSyncing: false }));
    }
  };

  const handleUpdateProfile = async (updatedFields: Partial<CandidateProfile>) => {
    if (!state.user) return;
    
    setState(prev => ({ ...prev, isSyncing: true }));
    
    const userId = dbService.getCurrentUserId();
    if (!userId) {
      setState(prev => ({ ...prev, isSyncing: false }));
      return;
    }

    const fullProfile: CandidateProfile = {
      ...state.user,
      ...updatedFields,
      technicalResult: updatedFields.technicalResult || state.user.technicalResult || state.technical,
      interviewResult: updatedFields.interviewResult || state.user.interviewResult || state.interview,
      currentStage: updatedFields.currentStage || state.assessmentStage
    };

    const success = await dbService.saveProfile(userId, fullProfile);
    
    setState(prev => ({ 
      ...prev, 
      user: fullProfile, 
      isSyncing: false,
      technical: fullProfile.technicalResult,
      interview: fullProfile.interviewResult,
      assessmentStage: fullProfile.currentStage || prev.assessmentStage
    }));
    
    return success;
  };

  const setStage = async (stage: AssessmentStage) => {
    setState(prev => ({ ...prev, assessmentStage: stage }));
    if (state.user) {
      await handleUpdateProfile({ currentStage: stage });
    }
  };

  const handleSignOut = () => {
    dbService.setCurrentUserId(null);
    setState({
      role: UserRole.GUEST,
      authStage: AuthStage.LOGIN,
      assessmentStage: AssessmentStage.PROCESS_GUIDE,
      user: null,
      technical: null,
      interview: null,
      isAdminAuthenticated: false,
      isLoading: false,
      isSyncing: false
    });
  };

  if (state.isLoading) {
    return (
      <Loading 
        message="HireAI Infrastructure" 
        subMessage="Synchronizing Vault Integrity" 
        fullScreen={true} 
      />
    );
  }

  if (state.role === UserRole.GUEST) {
    return <Landing onSelectRole={(role) => setState(prev => ({ ...prev, role }))} />;
  }

  if (state.role === UserRole.STUDENT && !state.user) {
    return (
      <Auth 
        role={state.role} 
        stage={state.authStage} 
        onToggle={(stage) => setState(prev => ({ ...prev, authStage: stage }))}
        onSuccess={(userId) => {
          dbService.setCurrentUserId(userId);
          fetchAndSyncProfile(userId);
        }}
        onBack={() => setState(prev => ({ ...prev, role: UserRole.GUEST }))}
      />
    );
  }

  if (state.role === UserRole.ADMIN && !state.isAdminAuthenticated) {
    return (
      <Auth 
        role={state.role} 
        stage={AuthStage.LOGIN} 
        onToggle={() => {}}
        onSuccess={() => {
          dbService.setCurrentUserId('admin_root');
          setState(prev => ({ ...prev, isAdminAuthenticated: true }));
        }}
        onBack={() => setState(prev => ({ ...prev, role: UserRole.GUEST }))}
      />
    );
  }

  const renderAssessment = () => {
    switch (state.assessmentStage) {
      case AssessmentStage.PROCESS_GUIDE: return <StudentDashboard onStart={() => setStage(AssessmentStage.ROLE_SELECTION)} user={state.user} />;
      case AssessmentStage.PROFILE: return <StudentProfile onSave={handleUpdateProfile} user={state.user} />;
      case AssessmentStage.ROLE_SELECTION: return <RoleSelection onSelect={(role, jd) => { handleUpdateProfile({ selectedRole: role, targetJD: jd, currentStage: AssessmentStage.RESUME }); }} />;
      case AssessmentStage.RESUME: return <ResumeAnalyzer targetRole={state.user?.selectedRole} targetJD={state.user?.targetJD} onAnalyzed={(p) => { const passed = (p.resumeScore || 0) >= 70; handleUpdateProfile({ ...p, isResumePassed: passed, currentStage: passed ? AssessmentStage.TECHNICAL_CODING : AssessmentStage.PROCESS_GUIDE }); }} />;
      case AssessmentStage.TECHNICAL_CODING: return <CodingAssessment role={state.user?.selectedRole || 'Developer'} skills={state.user?.skills || []} targetJD={state.user?.targetJD} onComplete={(t) => { const passed = t.score >= 60; handleUpdateProfile({ isCodingPassed: passed, technicalResult: t, currentStage: passed ? AssessmentStage.INTERVIEW : AssessmentStage.PROCESS_GUIDE }); }} />;
      case AssessmentStage.INTERVIEW: return <AIInterviewRoom role={state.user?.selectedRole} onComplete={(interview) => { handleUpdateProfile({ isInterviewPassed: true, interviewResult: interview, currentStage: AssessmentStage.RESULTS }); }} />;
      case AssessmentStage.RESULTS: return <JRIReport data={state} />;
      default: return null;
    }
  };

  return (
    <Layout 
      currentStage={state.assessmentStage} 
      setStage={setStage} 
      user={state.user} 
      onLogout={handleSignOut}
      isSyncing={state.isSyncing}
    >
      {state.role === UserRole.ADMIN ? (state.assessmentStage === AssessmentStage.PROFILE ? <AdminProfile /> : <AdminDashboard />) : renderAssessment()}
    </Layout>
  );
};

export default App;
