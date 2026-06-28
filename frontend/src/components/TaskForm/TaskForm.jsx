import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiX } from 'react-icons/fi';

const getNowTime = () => {
  const now = new Date();
  return now.toTimeString().slice(0, 5); // "HH:MM"
};

const TaskForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'WORK',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: getNowTime(),
      status: 'TODO'
    }
  });

  useEffect(() => {
    if (initialData) {
      const d = initialData.dueDate ? new Date(initialData.dueDate) : new Date();
      reset({
        ...initialData,
        dueDate: d.toISOString().split('T')[0],
        dueTime: d.toTimeString().slice(0, 5),
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'WORK',
        dueDate: new Date().toISOString().split('T')[0],
        dueTime: getNowTime(),
        status: 'TODO'
      });
    }
  }, [initialData, reset, isOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const submitForm = (data) => {
    // Merge date + time into a single ISO datetime string
    const { dueDate, dueTime, ...rest } = data;
    const combinedDueDate = new Date(`${dueDate}T${dueTime || '00:00'}`).toISOString();
    onSubmit({ ...rest, dueDate: combinedDueDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card p-6 rounded-2xl w-full max-w-lg shadow-2xl relative border border-border animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-foreground transition p-1.5 rounded-full hover:bg-muted-bg">
          <FiX size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-foreground tracking-tight">{initialData ? 'Edit Task' : 'New Task'}</h2>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-foreground">Title</label>
            <input
              autoFocus
              {...register('title', { required: 'Title is required' })}
              className={`w-full p-2.5 rounded-xl bg-muted-bg border ${errors.title ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground placeholder-muted`}
              placeholder="What needs to be done?"
            />
            {errors.title && <p className="text-danger text-xs mt-1 font-medium">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 text-foreground">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows="3"
              className={`w-full p-2.5 rounded-xl bg-muted-bg border ${errors.description ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none text-foreground placeholder-muted`}
              placeholder="Add some details..."
            ></textarea>
            {errors.description && <p className="text-danger text-xs mt-1 font-medium">{errors.description.message}</p>}
          </div>

          {/* Priority + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Priority</label>
              <select {...register('priority')} className="w-full p-2.5 rounded-xl bg-muted-bg border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Category</label>
              <select {...register('category')} className="w-full p-2.5 rounded-xl bg-muted-bg border border-border focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground">
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
                <option value="STUDY">Study</option>
                <option value="HEALTH">Health</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Due Date + Due Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Due Date</label>
              <input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className={`w-full p-2.5 rounded-xl bg-muted-bg border ${errors.dueDate ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground [color-scheme:dark]`}
              />
              {errors.dueDate && <p className="text-danger text-xs mt-1 font-medium">{errors.dueDate.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5 text-foreground">Due Time</label>
              <input
                type="time"
                {...register('dueTime', { required: 'Due time is required' })}
                className={`w-full p-2.5 rounded-xl bg-muted-bg border ${errors.dueTime ? 'border-danger' : 'border-border'} focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all text-foreground [color-scheme:dark]`}
              />
              {errors.dueTime && <p className="text-danger text-xs mt-1 font-medium">{errors.dueTime.message}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-6 mt-6">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-medium text-muted hover:bg-muted-bg hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl font-medium text-white bg-primary hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5">
              {initialData ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
