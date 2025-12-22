
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
        await fetchAndSyncProfile(userId);
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };
    initAuth();
  }, []);

  const fetchAndSyncProfile = async (userId: string) => {
    setState(prev => ({ ...prev, isSyncing: true, isLoading: true }));
    
    try {
      let profile = await dbService.getProfile(userId);
      
      if (!profile) {
        const newProfile: CandidateProfile = {
          name: 'New Candidate',
          email: '',
          university: '',
          experience: '',
          skills: [],
          education: [],
          workExperience: [],
          projects: [],
          certificates: [],
          currentStage: AssessmentStage.PROCESS_GUIDE,
          isResumePassed: false,
          isCodingPassed: false,
          isInterviewPassed: false
        };
        await dbService.saveProfile(userId, newProfile);
        profile = newProfile;
      }
      
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

  const handleUpdateProfile = async (updatedProfile: CandidateProfile) => {
    const userId = dbService.getCurrentUserId();
    if (!userId) return;

    setState(prev => ({ ...prev, isSyncing: true, user: updatedProfile }));
    await dbService.saveProfile(userId, {
      ...updatedProfile,
      currentStage: state.assessmentStage,
      technicalResult: state.technical,
      interviewResult: state.interview
    });
    setState(prev => ({ ...prev, isSyncing: false }));
  };

  const setStage = (stage: AssessmentStage) => {
    if (state.role === UserRole.STUDENT) {
      if (stage === AssessmentStage.TECHNICAL_CODING && !state.user?.isResumePassed) return;
      if (stage === AssessmentStage.INTERVIEW && !state.user?.isCodingPassed) return;
      if (stage === AssessmentStage.RESULTS && !state.user?.isInterviewPassed) return;
    }
    
    setState(prev => ({ ...prev, assessmentStage: stage }));
    
    const userId = dbService.getCurrentUserId();
    if (userId && state.user) {
      dbService.saveProfile(userId, {
        ...state.user,
        currentStage: stage,
        technicalResult: state.technical,
        interviewResult: state.interview
      });
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

  if (state.isLoading) return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-6">
      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="font-black text-slate-900 tracking-tighter italic">Initializing HireAI Local Engine...</p>
    </div>
  );

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
        onSuccess={() => setState(prev => ({ ...prev, isAdminAuthenticated: true }))}
        onBack={() => setState(prev => ({ ...prev, role: UserRole.GUEST }))}
      />
    );
  }

  const renderAssessment = () => {
    switch (state.assessmentStage) {
      case AssessmentStage.PROCESS_GUIDE: return <StudentDashboard onStart={() => setStage(AssessmentStage.ROLE_SELECTION)} user={state.user} />;
      case AssessmentStage.PROFILE: return <StudentProfile onSave={handleUpdateProfile} user={state.user} />;
      case AssessmentStage.ROLE_SELECTION: return <RoleSelection onSelect={(role, jd) => { handleUpdateProfile({ ...state.user!, selectedRole: role, targetJD: jd }); setStage(AssessmentStage.RESUME); }} />;
      case AssessmentStage.RESUME: return <ResumeAnalyzer targetRole={state.user?.selectedRole} targetJD={state.user?.targetJD} onAnalyzed={(p) => { const passed = (p.resumeScore || 0) >= 70; handleUpdateProfile({ ...state.user!, ...p, isResumePassed: passed }); if (passed) setStage(AssessmentStage.TECHNICAL_CODING); }} />;
      case AssessmentStage.TECHNICAL_CODING: return <CodingAssessment role={state.user?.selectedRole || 'Developer'} skills={state.user?.skills || []} targetJD={state.user?.targetJD} onComplete={(t) => { const passed = t.score >= 60; setState(prev => ({ ...prev, technical: t })); handleUpdateProfile({ ...state.user!, isCodingPassed: passed, technicalResult: t }); if (passed) setStage(AssessmentStage.INTERVIEW); }} />;
      case AssessmentStage.INTERVIEW: return <AIInterviewRoom onComplete={(interview) => { setState(prev => ({ ...prev, interview })); handleUpdateProfile({ ...state.user!, isInterviewPassed: true, interviewResult: interview }); setStage(AssessmentStage.RESULTS); }} />;
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
    >
      {state.role === UserRole.ADMIN ? (state.assessmentStage === AssessmentStage.PROFILE ? <AdminProfile /> : <AdminDashboard />) : renderAssessment()}
    </Layout>
  );
};

export default App;
