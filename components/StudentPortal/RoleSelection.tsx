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
      desc: 'Enterprise-grade ecosystem engineering, Spring Boot micro-kernels, and robust backend infrastructure.', 
      icon: 'fa-mug-hot', 
      color: 'rose' 
    },
    { 
      id: 'python', 
      title: 'Python Developer', 
      desc: 'High-performance scripting, industrial web frameworks, and advanced automation pipelines.', 
      icon: 'fab fa-python', 
      color: 'blue' 
    },
    { 
      id: 'data-analysis', 
      title: 'Data Intelligence', 
      desc: 'SQL-driven neural insights, industrial visualization, and statistical modeling logic.', 
      icon: 'fa-chart-network', 
      color: 'emerald' 
    },
    { 
      id: 'mern', 
      title: 'Fullstack Systems', 
      desc: 'Full-cycle mastery of modern web architecture using high-availability JavaScript runtimes.', 
      icon: 'fa-layer-group', 
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
    <div className="max-w-6xl mx-auto space-y-16 animate-page-entry pb-32">
      <div className="text-center space-y-6">
        <span className="badge-node !text-indigo-400">Phase 01: System Calibration</span>
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Select Target Vector</h2>
        <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
          Initialize your recruitment trajectory by selecting a core technical domain or providing custom operational parameters.
        </p>
      </div>

      {!isCustom ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => onSelect(role.title, role.desc)}
                className="group hireai-card-solid p-12 text-left relative overflow-hidden transition-all hover:border-indigo-500/30"
              >
                <div className="absolute top-0 right-0 w-60 h-60 bg-indigo-500/5 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-700"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="space-y-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/5 text-indigo-400 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <i className={`fas ${role.icon} text-3xl`}></i>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-black text-white tracking-tight">{role.title}</h3>
                      <p className="text-base text-slate-500 font-medium leading-relaxed">{role.desc}</p>
                    </div>
                  </div>
                  <div className="mt-12 flex items-center space-x-3 text-indigo-400 font-black text-xs uppercase tracking-widest group-hover:translate-x-3 transition-all">
                    <span>Configure for {role.title}</span>
                    <i className="fas fa-arrow-right-long"></i>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="h-px w-32 bg-white/5 mb-10"></div>
            <button 
              onClick={() => setIsCustom(true)}
              className="px-12 py-6 bg-white/5 border-2 border-dashed border-white/10 text-slate-500 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:border-indigo-500/50 hover:text-white hover:bg-white/10 transition-all flex items-center space-x-4"
            >
              <i className="fas fa-plus"></i>
              <span>Define Proprietary Requirement</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto hireai-card-solid p-16 space-y-12 animate-rise">
          <button 
            onClick={() => setIsCustom(false)}
            className="text-[10px] font-black text-slate-500 hover:text-white flex items-center space-x-3 uppercase tracking-widest transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
            <span>Back to Template Vectors</span>
          </button>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vector Label (Role)</label>
              <div className="relative">
                <input 
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="input-shell !pr-44"
                  placeholder="e.g. Distributed Systems Engineer"
                />
                <button
                  onClick={handleGenerateJD}
                  disabled={!customRole || isGenerating}
                  className="absolute right-3 top-3 bottom-3 px-6 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center space-x-3"
                >
                  {isGenerating ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-microchip"></i>}
                  <span>AI Synthesis</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Vector Specification (JD)</label>
              <textarea 
                value={customJD}
                onChange={(e) => setCustomJD(e.target.value)}
                className="input-shell h-72 py-8 px-10 leading-relaxed placeholder:text-slate-700"
                placeholder="Declare comprehensive system requirements or use AI synthesis..."
              />
            </div>
          </div>

          <button
            onClick={handleCustomSubmit}
            disabled={!customRole || !customJD}
            className="cta-primary w-full py-6 text-lg uppercase justify-center shadow-none disabled:opacity-20"
          >
            <span>Execute Custom Sequence</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default RoleSelection;