import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { taskService } from '../services/taskService';
import { toast } from 'react-toastify';
import { isPast, isThisWeek } from 'date-fns';

const DEFAULT_FILTERS = {
  status: 'ALL',
  priority: 'ALL',
  category: 'ALL',
  sortBy: 'createdAt_desc',
};

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // unfiltered, for dashboard stats
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [activeQuickFilters, setActiveQuickFilters] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const debounceRef = useRef(null);

  const fetchTasks = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const [sortBy, sortOrder] = filters.sortBy.split('_');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.status !== 'ALL' && { status: filters.status }),
        ...(filters.priority !== 'ALL' && { priority: filters.priority }),
        ...(filters.category !== 'ALL' && { category: filters.category }),
      };
      const { data } = await taskService.getTasks(params);
      setTasks(data.data);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  const fetchAllTasks = useCallback(async () => {
    try {
      const { data } = await taskService.getTasks({ limit: 1000 });
      setAllTasks(data.data);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTasks(search);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [search, filters, pagination.page]);

  useEffect(() => {
    fetchAllTasks();
  }, [tasks]);

  const createTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success('Task created!');
      fetchTasks(search);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const { data } = await taskService.updateTask(id, taskData);
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Task updated!');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const { data } = await taskService.updateTask(id, { status });
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    } catch (err) {
      toast.error('Failed to move task');
      // Revert if failed by refetching
      fetchTasks(search);
    }
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));

    const toastId = toast(
      <div className="flex items-center gap-3">
        <span>Task deleted.</span>
        <button
          onClick={() => undoDelete(id, toastId)}
          className="px-2 py-1 bg-white/20 rounded text-sm font-semibold hover:bg-white/30 transition"
        >
          Undo
        </button>
      </div>,
      { autoClose: 5000 }
    );

    setTimeout(async () => {
      try {
        await taskService.deleteTask(id);
        fetchAllTasks();
      } catch (_) {
        toast.error('Delete failed, restoring task');
        setTasks(prev => [...prev, taskToDelete]);
      }
    }, 5000);
  };

  const undoDelete = async (id, toastId) => {
    toast.dismiss(toastId);
    try {
      await taskService.restoreTask(id);
      fetchTasks(search);
      toast.success('Task restored!');
    } catch (_) {
      toast.error('Failed to restore task');
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
      const { data } = await taskService.updateTask(id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      fetchAllTasks();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const bulkAction = async (taskIds, action) => {
    try {
      await taskService.bulkAction({ taskIds, action });
      toast.success(`${taskIds.length} tasks ${action === 'COMPLETE' ? 'completed' : 'deleted'}!`);
      fetchTasks(search);
    } catch (err) {
      toast.error('Bulk action failed');
    }
  };

  const setFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleQuickFilter = (id) => {
    setActiveQuickFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const setPage = (page) => setPagination(prev => ({ ...prev, page }));

  // Apply quick filters locally on the fetched page
  let displayTasks = [...tasks];
  if (activeQuickFilters.includes('overdue')) {
    displayTasks = displayTasks.filter(t => t.status !== 'DONE' && isPast(new Date(t.dueDate)));
  }
  if (activeQuickFilters.includes('due_week')) {
    displayTasks = displayTasks.filter(t => isThisWeek(new Date(t.dueDate)));
  }
  if (activeQuickFilters.includes('high_priority')) {
    displayTasks = displayTasks.filter(t => t.priority === 'HIGH');
  }

  return {
    tasks: displayTasks, allTasks, loading, search, filters, pagination, activeQuickFilters,
    setSearch, setFilter, clearFilters, setPage, toggleQuickFilter,
    createTask, updateTask, updateTaskStatus, deleteTask, toggleStatus, bulkAction,
  };
};

export default useTasks;
