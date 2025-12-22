
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const trendData = [
    { name: 'Mon', apps: 420 },
    { name: 'Tue', apps: 380 },
    { name: 'Wed', apps: 650 },
    { name: 'Thu', apps: 890 },
    { name: 'Fri', apps: 520 },
    { name: 'Sat', apps: 310 },
    { name: 'Sun', apps: 240 },
  ];

  const funnelData = [
    { name: 'Hired', value: 35, color: '#10b981' },
    { name: 'In Review', value: 45, color: '#6366f1' },
    { name: 'Screening', value: 15, color: '#f59e0b' },
    { name: 'Rejected', value: 5, color: '#ef4444' },
  ];

  const skillData = [
    { subject: 'Frontend', A: 120, fullMark: 150 },
    { subject: 'Backend', A: 98, fullMark: 150 },
    { subject: 'Cloud', A: 86, fullMark: 150 },
    { subject: 'AI/ML', A: 70, fullMark: 150 },
    { subject: 'DevOps', A: 110, fullMark: 150 },
  ];

  const metrics = [
    { label: 'Talent Pool', val: '12,842', trend: '+14%', icon: 'fa-users', color: 'bg-indigo-600' },
    { label: 'Mean JRI Score', val: '78.5', trend: '+2.1', icon: 'fa-chart-line', color: 'bg-emerald-600' },
    { label: 'Active Sessions', val: '1,042', trend: 'Live', icon: 'fa-bolt', color: 'bg-amber-500' },
    { label: 'System Health', val: '99.9%', trend: 'Stable', icon: 'fa-heartbeat', color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3 text-indigo-600">
            <i className="fas fa-chart-network text-xl"></i>
            <span className="text-xs font-black uppercase tracking-[0.3em]">Analytics Engine 3.0</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Executive Dashboard</h2>
          <p className="text-slate-500 font-medium">Real-time intelligence across the global hiring ecosystem.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <i className="fas fa-download mr-2"></i> Export Data
          </button>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all shadow-xl">
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 ${m.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                <i className={`fas ${m.icon}`}></i>
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${
                m.trend.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-500 bg-slate-50'
              }`}>
                {m.trend}
              </span>
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{m.val}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900">Application Velocity</h3>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="px-4 py-1.5 bg-white rounded-lg text-[10px] font-black shadow-sm">7 Days</span>
              <span className="px-4 py-1.5 text-[10px] font-black text-slate-400">30 Days</span>
            </div>
          </div>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: '700'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="apps" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={45}>
                   {trendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col items-center">
          <h3 className="text-xl font-black text-slate-900 mb-8 w-full text-left">Pipeline Funnel</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <PieChart width={220} height={220}>
                <Pie data={funnelData} innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value" animationBegin={0} animationDuration={1000}>
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                </Pie>
              </PieChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-900">82%</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Conversion</span>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 w-full">
              {funnelData.map((p, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100/50">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: p.color}}></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-800">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-8">Talent Domain Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#f1f5f9" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: '700' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Market Presence" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-slate-900">System Activity Feed</h3>
          <div className="space-y-6">
            {[
              { type: 'HIRE', user: 'Sarah Miller', msg: 'accepted Cloud Arch offer', time: '2m ago', icon: 'fa-check-circle', color: 'text-emerald-500' },
              { type: 'ALERT', user: 'Session 421', msg: 'tab-switch detected in technical', time: '15m ago', icon: 'fa-exclamation-triangle', color: 'text-rose-500' },
              { type: 'ASSESS', user: 'Kevin Tan', msg: 'completed interview with JRI 92', time: '1h ago', icon: 'fa-brain', color: 'text-indigo-500' },
              { type: 'JOIN', user: 'New User', msg: 'initialized talent profile', time: '3h ago', icon: 'fa-user-plus', color: 'text-blue-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-colors group-hover:bg-white`}>
                    <i className={`fas ${activity.icon} ${activity.color} text-sm`}></i>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{activity.user}</p>
                    <p className="text-xs text-slate-400 font-medium">{activity.msg}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
            View Full Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
