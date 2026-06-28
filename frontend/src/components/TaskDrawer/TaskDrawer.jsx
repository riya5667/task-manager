import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { FiX, FiClock, FiTag, FiAlertCircle, FiActivity } from 'react-icons/fi';

const TaskDrawer = ({ task, isOpen, onClose, onEdit }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs font-semibold text-muted bg-muted-bg px-2 py-1 rounded">
              TASK-{task.displayId || 'X'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-muted hover:text-foreground hover:bg-muted-bg rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{task.title}</h2>
            <p className="text-muted leading-relaxed whitespace-pre-wrap">{task.description || "No description provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiActivity size={12}/> Status</p>
              <div className="font-medium text-foreground">{task.status}</div>
            </div>
            
            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiAlertCircle size={12}/> Priority</p>
              <div className="font-medium text-foreground">{task.priority}</div>
            </div>

            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiTag size={12}/> Category</p>
              <div className="font-medium text-foreground">{task.category}</div>
            </div>

            <div>
              <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiClock size={12}/> Due Date</p>
              <div className="font-medium text-foreground">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy h:mm a') : 'None'}
              </div>
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <FiActivity /> Activity Log
            </h3>
            <div className="space-y-4">
              {task.activities && task.activities.length > 0 ? (
                task.activities.map(activity => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="mt-1 w-2 h-2 rounded-full bg-primary/50 shrink-0"></div>
                    <div>
                      <p className="text-foreground">Task <span className="font-semibold">{activity.action}</span></p>
                      <p className="text-xs text-muted mt-0.5">{format(new Date(activity.createdAt), 'MMM dd, h:mm a')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No recent activity.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted-bg/30">
          <button 
            onClick={() => { onClose(); onEdit(task); }}
            className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            Edit Task
          </button>
        </div>

      </div>
    </>
  );
};

export default TaskDrawer;
