import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiCheckCircle, FiChevronLeft, FiChevronRight, FiList, FiTrello } from 'react-icons/fi';

import { useAuth } from '../hooks/useAuth';
import useTasks from '../hooks/useTasks.jsx';

import Navbar from '../components/Navbar/Navbar';
import DashboardStats from '../components/Dashboard/DashboardStats';
import EmptyState from '../components/Dashboard/EmptyState';
import TaskCard from '../components/TaskCard/TaskCard';
import TaskForm from '../components/TaskForm/TaskForm';
import SearchBar from '../components/SearchBar/SearchBar';
import Filters from '../components/Filters/Filters';
import Loader from '../components/Loader/Loader';
import TaskChart from '../components/Charts/TaskChart';
import KanbanBoard from '../components/KanbanBoard/KanbanBoard';
import QuickFilters from '../components/QuickFilters/QuickFilters';
import TaskDrawer from '../components/TaskDrawer/TaskDrawer';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    tasks, allTasks, loading, search, filters, pagination, activeQuickFilters,
    setSearch, setFilter, clearFilters, setPage, toggleQuickFilter,
    createTask, updateTask, updateTaskStatus, deleteTask, toggleStatus, bulkAction,
  } = useTasks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board'
  const [drawerTask, setDrawerTask] = useState(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
      if (e.key === 'n') { e.preventDefault(); setIsFormOpen(true); }
      if (e.key === '/') { e.preventDefault(); document.getElementById('search-input')?.focus(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEdit = (task) => {
    setDrawerTask(null);
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleFormSubmit = async (data) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleSelect = useCallback((id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === tasks.length) setSelectedIds([]);
    else setSelectedIds(tasks.map(t => t.id));
  };

  const handleBulkComplete = () => { bulkAction(selectedIds, 'COMPLETE'); setSelectedIds([]); };
  const handleBulkDelete = () => { bulkAction(selectedIds, 'DELETE'); setSelectedIds([]); };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    
    const taskId = active.id;
    let newStatus = over.id; // 'TODO', 'IN_PROGRESS', 'DONE'
    
    // If we dragged over another task, we need to get that task's status
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      newStatus = overTask.status;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus && ['TODO', 'IN_PROGRESS', 'DONE'].includes(newStatus)) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted text-sm mt-1">Manage your tasks efficiently</p>
        </div>

        {/* Stat Cards */}
        {loading && tasks.length === 0 ? <Loader type="stats" count={5} /> : <DashboardStats tasks={allTasks} />}

        {/* Chart */}
        {allTasks.length > 0 && <div className="mb-8"><TaskChart tasks={allTasks} /></div>}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Filters filters={filters} onChange={setFilter} onClear={clearFilters} />
          </div>

          {/* Task View Area */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-5 mb-6">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                <div className="w-full xl:max-w-md">
                  <SearchBar value={search} onChange={setSearch} />
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full xl:w-auto">
                  <div className="bg-muted-bg p-1 rounded-xl flex items-center border border-border w-full sm:w-auto flex-shrink-0">
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                    >
                      <FiList size={16} /> List
                    </button>
                    <button 
                      onClick={() => setViewMode('board')}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'board' ? 'bg-card text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                    >
                      <FiTrello size={16} /> Board
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto flex-shrink-0"
                  >
                    <FiPlus size={18} />
                    New Task <span className="hidden sm:inline text-xs opacity-70 font-mono ml-1">(N)</span>
                  </button>
                </div>
              </div>

              <div>
                <QuickFilters activeQuickFilters={activeQuickFilters} toggleQuickFilter={toggleQuickFilter} />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 mb-4 p-3 bg-muted-bg rounded-xl border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
                <span className="text-sm text-foreground font-medium">{selectedIds.length} selected</span>
                <div className="flex gap-2 ml-auto">
                  <button onClick={handleBulkComplete} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-success/10 hover:bg-success/20 text-success rounded-lg transition font-medium">
                    <FiCheckCircle size={14} /> Complete
                  </button>
                  <button onClick={handleBulkDelete} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-danger/10 hover:bg-danger/20 text-danger rounded-lg transition font-medium">
                    <FiTrash2 size={14} /> Delete
                  </button>
                  <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-border rounded-lg transition font-medium">
                    Clear
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <Loader type="tasks" count={5} />
            ) : tasks.length === 0 ? (
              <EmptyState onNewTask={() => setIsFormOpen(true)} />
            ) : (
              viewMode === 'board' ? (
                <KanbanBoard 
                  tasks={tasks}
                  onDragEnd={handleDragEnd}
                  onEdit={handleEdit}
                  onDelete={deleteTask}
                  onToggleComplete={toggleStatus}
                  onSelect={handleSelect}
                  selectedTasks={selectedIds}
                />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedIds.length === tasks.length && tasks.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-muted text-primary focus:ring-primary bg-muted-bg"
                    />
                    <label htmlFor="select-all" className="text-sm text-muted cursor-pointer font-medium">Select all</label>
                  </div>
                  
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <div key={task.id} onClick={(e) => {
                        // Prevent drawer if clicking buttons or checkbox
                        if (e.target.closest('button') || e.target.closest('input')) return;
                        setDrawerTask(task);
                      }} className="cursor-pointer">
                        <TaskCard
                          task={task}
                          onEdit={handleEdit}
                          onDelete={deleteTask}
                          onToggleComplete={toggleStatus}
                          onSelect={handleSelect}
                          isSelected={selectedIds.includes(task.id)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={() => setPage(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg bg-card border border-border hover:bg-muted-bg transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FiChevronLeft />
                      </button>
                      <span className="text-sm text-muted">
                        Page <span className="text-foreground font-semibold">{pagination.page}</span> of <span className="text-foreground font-semibold">{pagination.totalPages}</span>
                      </span>
                      <button
                        onClick={() => setPage(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-lg bg-card border border-border hover:bg-muted-bg transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )
            )}
          </div>
        </div>
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={editingTask}
      />

      <TaskDrawer 
        task={drawerTask}
        isOpen={!!drawerTask}
        onClose={() => setDrawerTask(null)}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Home;
