
import React, { useState } from 'react';
import { generateJobDescription } from '../../services/aiClient';

interface RoleSelectionProps {
  onSelect: (role: string, jd: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect }) => {
  const [isCustom, setIsCustom] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [customJD, setCustomJD] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const roles = [
    { 
      id: 'java', 
      title: 'Java Developer', 
      desc: 'Focus on enterprise-grade applications, Spring Boot microservices, multithreading, and robust backend architecture.', 
      icon: 'fa-mug-hot', 
      color: 'rose' 
    },
    { 
      id: 'python', 
      title: 'Python Developer', 
      desc: 'Expertise in scalable scripting, Django/Flask web frameworks, automation, and backend integration.', 
      icon: 'fa-brands fa-python', 
      color: 'blue' 
    },
    { 
      id: 'data-analysis', 
      title: 'Data Analysis', 
      desc: 'Specializing in SQL-driven insights, data visualization, statistical modeling, and actionable business intelligence.', 
      icon: 'fa-magnifying-glass-chart', 
      color: 'emerald' 
    },
    { 
      id: 'mern', 
      title: 'MERN Stack Developer', 
      desc: 'Full-stack mastery of MongoDB, Express, React, and Node.js for modern, high-performance web applications.', 
      icon: 'fa-cubes', 
      color: 'indigo' 
    }
  ];

  const handleGenerateJD = async () => {
    if (!customRole.trim()) return;
    setIsGenerating(true);
    try {
      const jd = await generateJobDescription(customRole);
      setCustomJD(jd);
    } catch (err) {
      console.error("Failed to generate JD", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSubmit = () => {
    if (customRole.trim() && customJD.trim()) {
      onSelect(customRole, customJD);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-page-entry pb-20">
      <div className="text-center space-y-4">
        <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.25em]">Phase 01: Targeting</span>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Select Your Career Path</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Choose one of the core industry tracks or define a specialized target to calibrate your AI assessment.
        </p>
      </div>

      {!isCustom ? (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => onSelect(role.title, role.desc)}
                className="group hireai-card p-10 text-left relative overflow-hidden transition-all hover:scale-[1.02]"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-${role.color}-500/5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="space-y-6">
                    <div className={`w-16 h-16 bg-${role.color}-50 text-${role.color}-600 rounded-2xl flex items-center justify-center shadow-inner`}>
                      <i className={`fas ${role.icon} text-2xl`}></i>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900">{role.title}</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">{role.desc}</p>
                    </div>
                  </div>
                  <div className="mt-10 flex items-center space-x-2 text-indigo-600 font-black text-xs uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    <span>Configure Assessment for {role.title}</span>
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="h-px w-24 bg-slate-200 mb-8"></div>
            <button 
              onClick={() => setIsCustom(true)}
              className="px-10 py-5 bg-white border-2 border-dashed border-slate-200 text-slate-500 rounded-3xl font-black text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all flex items-center space-x-3"
            >
              <i className="fas fa-plus"></i>
              <span>Define Custom Role & Job Description</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto hireai-card p-12 space-y-8 animate-in slide-in-from-bottom-4">
          <button 
            onClick={() => setIsCustom(false)}
            className="text-xs font-black text-slate-400 hover:text-slate-600 flex items-center space-x-2"
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back to Standard Roles</span>
          </button>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Title</label>
              <div className="relative">
                <input 
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="hireai-input pr-36"
                  placeholder="e.g. Senior Data Platform Engineer"
                />
                <button
                  onClick={handleGenerateJD}
                  disabled={!customRole || isGenerating}
                  className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center space-x-2"
                >
                  {isGenerating ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-wand-magic-sparkles"></i>}
                  <span>AI Autocomplete</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Description (JD)</label>
              <textarea 
                value={customJD}
                onChange={(e) => setCustomJD(e.target.value)}
                className="hireai-input h-64 py-6 px-8 leading-relaxed placeholder:text-slate-300"
                placeholder="Manually enter or auto-generate the description of your target role..."
              />
            </div>
          </div>

          <button
            onClick={handleCustomSubmit}
            disabled={!customRole || !customJD}
            className="hireai-button-primary w-full py-5 text-lg"
          >
            <i className="fas fa-rocket"></i>
            <span>Initialize Custom Assessment</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;
