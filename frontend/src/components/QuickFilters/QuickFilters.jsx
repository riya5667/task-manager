import React from 'react';

const QuickFilters = ({ activeQuickFilters, toggleQuickFilter }) => {
  const quickFilters = [
    { id: 'overdue', label: 'Overdue' },
    { id: 'due_week', label: 'Due This Week' },
    { id: 'high_priority', label: 'High Priority' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted font-medium mr-2">Quick Filters:</span>
      {quickFilters.map((qf) => {
        const isActive = activeQuickFilters.includes(qf.id);
        return (
          <button
            key={qf.id}
            onClick={() => toggleQuickFilter(qf.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              isActive 
                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20' 
                : 'bg-transparent text-muted border-border hover:border-muted hover:text-foreground'
            }`}
          >
            {qf.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickFilters;
