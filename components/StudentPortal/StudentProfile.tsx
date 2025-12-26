import React, { useState, useRef } from 'react';
import { CandidateProfile } from '../../types';

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

  const fillDemoData = () => {
    const demoProfile: CandidateProfile = {
      ...profile,
      name: 'Alex Rivera',
      university: 'Stanford University',
      experience: 'Passionate full-stack developer with 3 years of experience in React and Node.js. Focused on building scalable cloud-native applications.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'AWS'],
      education: [{ school: 'Stanford', degree: 'B.S. Computer Science', year: '2019-2023' }],
      workExperience: [{ company: 'TechFlow', role: 'Frontend Engineer', duration: '2023-Present', description: 'Led the migration to React 19 and improved Lighthouse scores by 40%.' }],
      projects: [{ title: 'HireAI', description: 'An AI-powered recruitment ecosystem.', link: 'https://hireai.io' }],
      certificates: ['AWS Certified Solutions Architect']
    };
    setProfile(demoProfile);
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
    const current = Array.isArray(profile[field]) ? [...(profile[field] as any[])] : [];
    updateField(field, [...current, emptyItem]);
  };

  const removeItem = (field: 'education' | 'workExperience' | 'projects' | 'certificates' | 'skills', index: number) => {
    const current = Array.isArray(profile[field]) ? [...(profile[field] as any[])] : [];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      updateField(field, current);
    }
  };

  const addSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      const skills = Array.isArray(profile.skills) ? profile.skills : [];
      if (!skills.includes(newSkill.trim())) {
        updateField('skills', [...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const SectionHeader = ({ title, icon, color, onAdd }: { title: string, icon: string, color: string, onAdd?: () => void }) => (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 bg-white/5 text-indigo-400 rounded-2xl flex items-center justify-center border border-white/5`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
        <h3 className="text-xl font-black text-white tracking-tight uppercase">{title}</h3>
      </div>
      {isEditing && onAdd && (
        <button 
          onClick={onAdd}
          className={`px-4 py-2 bg-white/5 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5`}
        >
          <i className="fas fa-plus mr-2"></i> Append
        </button>
      )}
    </div>
  );

  const safeSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const safeEdu = Array.isArray(profile.education) ? profile.education : [];
  const safeExp = Array.isArray(profile.workExperience) ? profile.workExperience : [];

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-page-entry pb-32">
      <div className="hireai-card-solid p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="relative group">
            <div 
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`w-44 h-44 bg-slate-900 rounded-[3.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl border-4 border-white/5 overflow-hidden cursor-pointer group-hover:border-indigo-500/50 transition-all`}
            >
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-slate-700 font-black">{profile.name ? profile.name.charAt(0) : 'C'}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fas fa-camera text-2xl text-white"></i>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
          
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="space-y-4">
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Identity Name</label>
                    <input type="text" value={profile.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full Name" className="input-shell !py-3 !text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Universal Contact</label>
                    <input type="email" value={profile.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" className="input-shell !py-3 !text-lg" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <h2 className="text-6xl font-black text-white tracking-tighter">{profile.name || 'Incognito Candidate'}</h2>
                  <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] inline-block border border-indigo-500/20 shadow-xl">Level 4 Certified</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Abstract</label>
                {isEditing && (
                   <button onClick={fillDemoData} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white flex items-center transition-colors">
                     <i className="fas fa-wand-sparkles mr-2"></i> Synthesize Demo
                   </button>
                )}
              </div>
              {isEditing ? (
                <textarea value={profile.experience} onChange={(e) => updateField('experience', e.target.value)} placeholder="Architectural summary of your career..." className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 outline-none text-slate-300 font-medium focus:border-indigo-500/30 transition-all" rows={4} />
              ) : (
                <p className="text-slate-400 font-medium text-lg leading-relaxed">{profile.experience || 'Abstract undefined. Use edit mode to define identity.'}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
             <button 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className={`cta-primary min-w-[200px] justify-center ${isSaved ? 'bg-emerald-600 shadow-emerald-500/30' : ''}`}
             >
                {isSaved ? <><i className="fas fa-check"></i> <span>Synchronized</span></> : (isEditing ? 'Commit Profile' : 'Edit Identity')}
             </button>
             {!isEditing && (
               <button className="cta-secondary justify-center group">
                  <i className="fas fa-file-export text-indigo-400 group-hover:scale-110 transition-transform"></i>
                  <span>Export Vault Data</span>
               </button>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-12">
          {/* Technical Stack */}
          <div className="hireai-card-solid p-10 space-y-8">
            <SectionHeader title="Binary Mastery" icon="fa-microchip" color="indigo" />
            <div className="space-y-6">
              {isEditing && (
                <div className="relative">
                  <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={addSkill} placeholder="Neural Skill (Enter)" className="input-shell !py-3 !pr-12 text-xs" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600"><i className="fas fa-plus"></i></div>
                </div>
              )}
              <div className="flex flex-wrap gap-2.5">
                {safeSkills.length > 0 ? safeSkills.map((skill, i) => (
                  <span key={i} className="px-3.5 py-2 bg-white/5 border border-white/5 rounded-xl text-[11px] font-black text-slate-300 flex items-center space-x-3 transition-all hover:bg-white/10">
                    <span>{skill}</span>
                    {isEditing && <button onClick={() => removeItem('skills', i)} className="text-slate-600 hover:text-rose-500 transition-colors"><i className="fas fa-circle-xmark"></i></button>}
                  </span>
                )) : <p className="text-xs text-slate-600 italic">Mastery index empty.</p>}
              </div>
            </div>
          </div>

          {/* Academic Background */}
          <div className="hireai-card-solid p-10 space-y-8">
            <SectionHeader title="Academic Node" icon="fa-user-graduate" color="blue" onAdd={() => addItem('education', { school: '', degree: '', year: '' })} />
            <div className="space-y-10">
              {safeEdu.length > 0 ? safeEdu.map((edu, i) => (
                <div key={i} className="space-y-4 relative group/item">
                  {isEditing && <button onClick={() => removeItem('education', i)} className="absolute -right-2 -top-2 w-7 h-7 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all"><i className="fas fa-trash text-[10px]"></i></button>}
                  <input disabled={!isEditing} className={`w-full font-black text-white bg-transparent border-none p-0 focus:ring-0 text-lg uppercase tracking-tight ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-2 transition-all'}`} placeholder="Degree Specification" value={edu.degree} onChange={(e) => { const updated = [...safeEdu]; updated[i].degree = e.target.value; updateField('education', updated); }} />
                  <input disabled={!isEditing} className={`w-full text-xs text-slate-400 font-bold bg-transparent border-none p-0 focus:ring-0 uppercase tracking-widest ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-2 transition-all'}`} placeholder="Academy Name" value={edu.school} onChange={(e) => { const updated = [...safeEdu]; updated[i].school = e.target.value; updateField('education', updated); }} />
                  <input disabled={!isEditing} className={`w-full text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] bg-transparent border-none p-0 focus:ring-0 ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-2 transition-all'}`} placeholder="Timeline Hub" value={edu.year} onChange={(e) => { const updated = [...safeEdu]; updated[i].year = e.target.value; updateField('education', updated); }} />
                </div>
              )) : <p className="text-xs text-slate-600 italic">No nodes identified.</p>}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-12">
          {/* Experience Grid */}
          <div className="hireai-card-solid p-12 space-y-12">
            <SectionHeader title="Professional Timeline" icon="fa-business-time" color="purple" onAdd={() => addItem('workExperience', { company: '', role: '', duration: '', description: '' })} />
            <div className="space-y-16 relative">
              {safeExp.length > 0 && <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5"></div>}
              {safeExp.length > 0 ? safeExp.map((exp, i) => (
                <div key={i} className="relative pl-16 group/exp">
                  <div className="absolute left-[1.125rem] top-2 w-4 h-4 rounded-full bg-[#0a0d1a] border-4 border-indigo-500 group-hover/exp:scale-125 transition-transform z-10 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                  {isEditing && <button onClick={() => removeItem('workExperience', i)} className="absolute right-0 top-0 text-slate-600 hover:text-rose-500 transition-colors"><i className="fas fa-trash-can text-sm"></i></button>}
                  <div className="space-y-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <input disabled={!isEditing} className={`text-2xl font-black text-white bg-transparent border-none p-0 focus:ring-0 w-full md:w-auto tracking-tighter ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-3 transition-all'}`} placeholder="Executive Role" value={exp.role} onChange={(e) => { const updated = [...safeExp]; updated[i].role = e.target.value; updateField('workExperience', updated); }} />
                      <input disabled={!isEditing} className={`text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl border border-white/5 focus:ring-0 w-full md:w-auto ${!isEditing ? 'cursor-default' : ''}`} placeholder="Epoch Duration" value={exp.duration} onChange={(e) => { const updated = [...safeExp]; updated[i].duration = e.target.value; updateField('workExperience', updated); }} />
                    </div>
                    <input disabled={!isEditing} className={`text-sm font-black text-slate-400 uppercase tracking-[0.3em] bg-transparent border-none p-0 focus:ring-0 w-full ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-3 transition-all'}`} placeholder="Corporate Nexus" value={exp.company} onChange={(e) => { const updated = [...safeExp]; updated[i].company = e.target.value; updateField('workExperience', updated); }} />
                    <textarea disabled={!isEditing} className={`w-full text-base text-slate-400 font-medium leading-relaxed bg-transparent border-none p-0 focus:ring-0 resize-none ${!isEditing ? 'cursor-default' : 'hover:bg-white/5 rounded px-3 transition-all'}`} placeholder="Contribution logs..." rows={3} value={exp.description} onChange={(e) => { const updated = [...safeExp]; updated[i].description = e.target.value; updateField('workExperience', updated); }} />
                  </div>
                </div>
              )) : <div className="text-center py-20 opacity-20"><i className="fas fa-timeline text-5xl mb-6 block"></i><p className="text-sm font-black uppercase tracking-widest">Historical Data Empty</p></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;