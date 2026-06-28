import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const TaskChart = ({ tasks }) => {
  const [view, setView] = useState('week'); // 'week' or 'month'
  const daysCount = view === 'week' ? 7 : 30;

  // Generate data based on view
  const data = Array.from({ length: daysCount }).map((_, i) => {
    const date = subDays(new Date(), (daysCount - 1) - i);
    const dateStr = format(date, 'MMM dd');
    const completedOnDate = tasks.filter(t => 
      t.status === 'DONE' && 
      format(new Date(t.createdAt), 'MMM dd') === dateStr 
    ).length;

    return {
      name: dateStr,
      Completed: completedOnDate,
    };
  });

  const totalCompleted = data.reduce((acc, curr) => acc + curr.Completed, 0);

  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-96 flex flex-col relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10">
        <h3 className="text-lg font-semibold text-foreground tracking-tight">Productivity Trend</h3>
        <div className="bg-muted-bg p-1 rounded-lg flex text-xs font-medium border border-border">
          <button 
            onClick={() => setView('week')}
            className={`px-3 py-1 rounded-md transition-all ${view === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            This Week
          </button>
          <button 
            onClick={() => setView('month')}
            className={`px-3 py-1 rounded-md transition-all ${view === 'month' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
          >
            This Month
          </button>
        </div>
      </div>
      
      {tasks.length <= 2 && totalCompleted === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 bg-muted-bg rounded-full flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <p className="text-foreground font-medium mb-1">Not much happened yet</p>
          <p className="text-muted text-sm max-w-[200px]">Complete a few tasks to see your productivity trend.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="currentColor" strokeOpacity={0.05} strokeDasharray="4 4" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="currentColor" 
                strokeOpacity={0.4} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }} 
                dy={10} 
                minTickGap={20}
              />
              <YAxis 
                stroke="currentColor" 
                strokeOpacity={0.4} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'currentColor', opacity: 0.6 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '8px', color: 'var(--color-foreground)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#8B5CF6', fontWeight: 600 }}
                labelStyle={{ color: 'var(--color-muted)', marginBottom: '4px' }}
                cursor={{ stroke: 'currentColor', strokeOpacity: 0.1, strokeWidth: 2 }}
              />
              <Area 
                type="monotone" 
                dataKey="Completed" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorCompleted)" 
                activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TaskChart;
