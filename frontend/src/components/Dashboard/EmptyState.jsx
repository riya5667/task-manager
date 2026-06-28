import React from 'react';
import { FiPlus } from 'react-icons/fi';

const EmptyState = ({ onNewTask }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-muted-bg/30">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150"></div>
      <div className="w-24 h-24 relative z-10 bg-card rounded-2xl shadow-xl shadow-black/5 flex items-center justify-center border border-border">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-2 text-foreground tracking-tight">Your task list is empty</h3>
    <p className="text-muted mb-8 max-w-sm">Capture what's on your mind. Create your first task to start tracking your productivity journey.</p>
    <button
      onClick={onNewTask}
      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5"
    >
      <FiPlus size={18} />
      Create your first task
    </button>
  </div>
);

export default EmptyState;
