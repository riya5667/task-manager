import React from 'react';
import { FiCheckCircle, FiClock, FiAlertTriangle, FiZap, FiList } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, colorClass, gradientFrom, gradientTo }) => (
  <div className={`bg-card p-5 rounded-xl border border-border border-t-[3px] ${colorClass} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
    {/* Inner glow effect on hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br ${gradientFrom} ${gradientTo}`}></div>
    
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-muted text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
        <p className="text-4xl font-extrabold text-foreground tracking-tight">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo} bg-opacity-20`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
  </div>
);

const DashboardStats = ({ tasks }) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'DONE').length;
  // Combine TODO and IN_PROGRESS for 'active/pending'
  const pending = tasks.filter(t => t.status === 'TODO' || t.status === 'IN_PROGRESS').length;
  const highPriority = tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').length;
  const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-10">
      <StatCard icon={FiList} label="Total Tasks" value={total} colorClass="border-t-blue-500 hover:shadow-blue-500/10" gradientFrom="from-blue-500/80" gradientTo="to-blue-600/80" />
      <StatCard icon={FiCheckCircle} label="Completed" value={completed} colorClass="border-t-emerald-500 hover:shadow-emerald-500/10" gradientFrom="from-emerald-500/80" gradientTo="to-emerald-600/80" />
      <StatCard icon={FiClock} label="In Progress" value={pending} colorClass="border-t-amber-500 hover:shadow-amber-500/10" gradientFrom="from-amber-500/80" gradientTo="to-amber-600/80" />
      <StatCard icon={FiAlertTriangle} label="High Priority" value={highPriority} colorClass="border-t-red-500 hover:shadow-red-500/10" gradientFrom="from-red-500/80" gradientTo="to-red-600/80" />
      <StatCard icon={FiZap} label="Productivity" value={`${productivity}%`} colorClass="border-t-violet-500 hover:shadow-violet-500/10" gradientFrom="from-violet-500/80" gradientTo="to-indigo-600/80" />
    </div>
  );
};

export default DashboardStats;
