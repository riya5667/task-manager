import React from 'react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { FiEdit2, FiTrash2, FiCheckCircle, FiCircle, FiArrowUp, FiArrowRight, FiArrowDown } from 'react-icons/fi';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, onSelect, isSelected }) => {
  const isDone = task.status === 'DONE';

  const getDueDateColor = (dateStr) => {
    const date = new Date(dateStr);
    if (isDone) return 'text-muted bg-muted/10';
    if (isPast(date) && !isToday(date)) return 'text-danger bg-danger/10';
    if (isToday(date)) return 'text-warning bg-warning/10';
    if (isTomorrow(date)) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-success bg-success/10';
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'HIGH': return { icon: FiArrowUp, color: 'text-danger', border: 'border-l-danger', bg: 'bg-danger/10' };
      case 'MEDIUM': return { icon: FiArrowRight, color: 'text-warning', border: 'border-l-warning', bg: 'bg-warning/10' };
      case 'LOW': return { icon: FiArrowDown, color: 'text-muted', border: 'border-l-muted', bg: 'bg-muted/10' };
      default: return { icon: FiArrowRight, color: 'text-muted', border: 'border-l-border', bg: 'bg-muted-bg' };
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'WORK': return 'text-blue-500 bg-blue-500/10';
      case 'PERSONAL': return 'text-emerald-500 bg-emerald-500/10';
      case 'STUDY': return 'text-violet-500 bg-violet-500/10';
      case 'HEALTH': return 'text-rose-500 bg-rose-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const priority = getPriorityConfig(task.priority);
  const PriorityIcon = priority.icon;

  return (
    <div className={`bg-card rounded-xl border border-border border-l-4 ${priority.border} transition-all duration-150 hover:-translate-y-[2px] hover:shadow-md hover:border-l-[5px] group relative ${isDone ? 'opacity-60' : ''}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="pt-1">
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={() => onSelect(task.id)}
            className="w-4 h-4 rounded border-muted text-primary focus:ring-primary bg-muted-bg"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-semibold text-muted bg-muted-bg px-1.5 py-0.5 rounded">
                TASK-{task.displayId || 'X'}
              </span>
              <h3 className={`font-semibold text-lg truncate ${isDone ? 'line-through text-muted' : 'text-foreground'}`}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onToggleComplete(task.id, task.status)} className="p-1.5 rounded hover:bg-muted-bg text-muted hover:text-success transition" title="Toggle Status">
                {isDone ? <FiCheckCircle /> : <FiCircle />}
              </button>
              <button onClick={() => onEdit(task)} className="p-1.5 rounded hover:bg-muted-bg text-muted hover:text-primary transition" title="Edit">
                <FiEdit2 />
              </button>
              <button onClick={() => onDelete(task.id)} className="p-1.5 rounded hover:bg-muted-bg text-muted hover:text-danger transition" title="Delete">
                <FiTrash2 />
              </button>
            </div>
          </div>
          
          <p className="text-muted text-sm mb-4 line-clamp-2 pr-12">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <div className={`flex items-center justify-center p-1 rounded ${priority.bg} ${priority.color}`} title={task.priority}>
              <PriorityIcon size={14} />
            </div>
            
            <span className={`px-2 py-1 rounded-md ${getCategoryColor(task.category)}`}>
              {task.category}
            </span>

            {task.labels && task.labels.map(label => (
              <span key={label.id} className="px-2 py-1 rounded-md text-foreground bg-muted-bg border border-border">
                {label.name}
              </span>
            ))}
            
            <span className={`px-2 py-1 rounded-md ${getDueDateColor(task.dueDate)} ml-auto`}>
              {format(new Date(task.dueDate), 'MMM dd')}
              {' • '}
              {format(new Date(task.dueDate), 'h:mm a')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
