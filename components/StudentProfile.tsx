
import React, { useState, useRef, useEffect } from 'react';
import { CandidateProfile, EducationEntry, ExperienceEntry, ProjectEntry } from '../types';

interface StudentProfileProps {
  onSave: (profile: CandidateProfile) => void;
  user?: CandidateProfile | null;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ onSave, user }) => {
  const [profile, setProfile] = useState<CandidateProfile>(user || {
    name: '',
    email: '',
    university: '',
    experience: '',
    skills: [],
    education: [],
    workExperience: [],
    projects: [],
    certificates: []
  });

  const [isEditing, setIsEditing] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onSave(profile);
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const updateField = (field: keyof CandidateProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('avatarUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = (field: 'education' | 'workExperience' | 'projects' | 'certificates', emptyItem: any) => {
    const current = [...(profile[field] as any[])];
    updateField(field, [...current, emptyItem]);
  };

  const removeItem = (field: 'education' | 'workExperience' | 'projects' | 'certificates' | 'skills', index: number) => {
    const current = [...(profile[field] as any[])];
    current.splice(index, 1);
    updateField(field, current);
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      if (!profile.skills.includes(newSkill.trim())) {
        updateField('skills', [...profile.skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const SectionHeader = ({ title, icon, color, onAdd, field }: { title: string, icon: string, color: string, onAdd?: () => void, field?: any }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 bg-${color}-50 text-${color}-600 rounded-xl flex items-center justify-center`}>
          <i className={`fas ${icon}`}></i>
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
      </div>
      {isEditing && onAdd && (
        <button 
          onClick={onAdd}
          className={`px-3 py-1.5 bg-${color}-50 text-${color}-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-${color}-100 transition-colors`}
        >
          <i className="fas fa-plus mr-1"></i> Add
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-page-entry pb-32">
      <div className="bg-white rounded-[3.5rem] p-10 border border-slate-200/60 shadow-xl shadow-slate-200/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="relative group">
            <div 
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[3rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl border-8 border-white overflow-hidden cursor-pointer group-hover:opacity-90 transition-all`}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-black">{profile.name ? profile.name.charAt(0) : 'C'}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-camera text-2xl text-white"></i>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
          
          <div className="flex-1 text-center lg:text-left space-y-4">
            <div className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" value={profile.name} onChange={(e) => updateField('name', e.target.value)} placeholder="e.g. Alex Johnson" className="hireai-input !py-3 !text-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" value={profile.email} onChange={(e) => updateField('email', e.target.value)} placeholder="alex@example.com" className="hireai-input !py-3 !text-lg" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{profile.name || 'Anonymous Candidate'}</h2>
                  <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest inline-block">Talent Verified</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
              {isEditing ? (
                <textarea value={profile.experience} onChange={(e) => updateField('experience', e.target.value)} placeholder="Tell recruiters about your background..." className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-200 outline-none text-slate-700 font-medium" rows={3} />
              ) : (
                <p className="text-slate-500 font-medium text-lg leading-relaxed">{profile.experience || 'No bio provided yet.'}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={`px-10 py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-xl min-w-[180px] ${
                   isSaved ? 'bg-emerald-100 text-emerald-700' :
                   isEditing 
                   ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20' 
                   : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-900/20'
                }`}
             >
                {isSaved ? (
                  <span className="flex items-center space-x-2">
                    <i className="fas fa-check"></i>
                    <span>Profile Saved</span>
                  </span>
                ) : (
                  isEditing ? 'Confirm & Save' : 'Edit Profile'
                )}
             </button>
             {!isEditing && (
               <button className="px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-[1.5rem] font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center space-x-3">
                  <i className="fas fa-file-pdf text-rose-500"></i>
                  <span>Export Resume</span>
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
            <SectionHeader title="Technical Stack" icon="fa-brain" color="indigo" />
            <div className="space-y-4">
              {isEditing && (
                <div className="relative">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={addSkill} placeholder="Add skill (Press Enter)" className="hireai-input !py-3 !pr-12 text-xs" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300"><i className="fas fa-plus"></i></div>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0 ? profile.skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-black text-indigo-700 flex items-center space-x-2 animate-in zoom-in-95">
                    <span>{skill}</span>
                    {isEditing && <button onClick={() => removeItem('skills', i)} className="hover:text-rose-500 transition-colors"><i className="fas fa-times"></i></button>}
                  </span>
                )) : <p className="text-xs text-slate-400 italic">No skills added yet.</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
            <SectionHeader title="Academic Path" icon="fa-graduation-cap" color="blue" onAdd={() => addItem('education', { school: '', degree: '', year: '' })} />
            <div className="space-y-8">
              {profile.education.length > 0 ? profile.education.map((edu, i) => (
                <div key={i} className="space-y-3 relative group/item">
                  {isEditing && <button onClick={() => removeItem('education', i)} className="absolute -right-2 -top-2 w-6 h-6 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"><i className="fas fa-trash text-[10px]"></i></button>}
                  <input disabled={!isEditing} className={`w-full font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Degree Name" value={edu.degree} onChange={(e) => { const updated = [...profile.education]; updated[i].degree = e.target.value; updateField('education', updated); }} />
                  <input disabled={!isEditing} className={`w-full text-xs text-slate-500 font-bold bg-transparent border-none p-0 focus:ring-0 ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Institution Name" value={edu.school} onChange={(e) => { const updated = [...profile.education]; updated[i].school = e.target.value; updateField('education', updated); }} />
                  <input disabled={!isEditing} className={`w-full text-[10px] text-indigo-600 font-black uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Timeline" value={edu.year} onChange={(e) => { const updated = [...profile.education]; updated[i].year = e.target.value; updateField('education', updated); }} />
                </div>
              )) : <p className="text-xs text-slate-400 italic">No academic history provided.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm space-y-10">
            <SectionHeader title="Career Milestones" icon="fa-briefcase" color="purple" onAdd={() => addItem('workExperience', { company: '', role: '', duration: '', description: '' })} />
            <div className="space-y-12 relative">
              {profile.workExperience.length > 0 && <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100"></div>}
              {profile.workExperience.length > 0 ? profile.workExperience.map((exp, i) => (
                <div key={i} className="relative pl-14 group/exp">
                  <div className="absolute left-4 top-2 w-4 h-4 rounded-full bg-white border-4 border-purple-500 group-hover/exp:scale-125 transition-transform z-10"></div>
                  {isEditing && <button onClick={() => removeItem('workExperience', i)} className="absolute right-0 top-0 text-slate-300 hover:text-rose-500 transition-colors"><i className="fas fa-trash-alt text-sm"></i></button>}
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <input disabled={!isEditing} className={`text-xl font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-full md:w-auto ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Job Title" value={exp.role} onChange={(e) => { const updated = [...profile.workExperience]; updated[i].role = e.target.value; updateField('workExperience', updated); }} />
                      <input disabled={!isEditing} className={`text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 focus:ring-0 w-full md:w-auto ${!isEditing ? 'cursor-default' : ''}`} placeholder="Timeline" value={exp.duration} onChange={(e) => { const updated = [...profile.workExperience]; updated[i].duration = e.target.value; updateField('workExperience', updated); }} />
                    </div>
                    <input disabled={!isEditing} className={`text-sm font-black text-purple-600 uppercase tracking-widest bg-transparent border-none p-0 focus:ring-0 w-full ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Company Name" value={exp.company} onChange={(e) => { const updated = [...profile.workExperience]; updated[i].company = e.target.value; updateField('workExperience', updated); }} />
                    <textarea disabled={!isEditing} className={`w-full text-sm text-slate-500 font-medium leading-relaxed bg-transparent border-none p-0 focus:ring-0 resize-none ${!isEditing ? 'cursor-default' : 'hover:bg-slate-50 rounded px-1'}`} placeholder="Impact and responsibilities..." rows={2} value={exp.description} onChange={(e) => { const updated = [...profile.workExperience]; updated[i].description = e.target.value; updateField('workExperience', updated); }} />
                  </div>
                </div>
              )) : <div className="text-center py-10 opacity-40"><i className="fas fa-briefcase text-4xl mb-4 block"></i><p className="text-sm font-bold">No professional experience recorded.</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
