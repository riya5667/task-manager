import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiList, FiAlertCircle, FiTag } from 'react-icons/fi';

const FilterSection = ({ title, icon: Icon, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <div className="flex items-center space-x-2 text-foreground font-semibold text-sm">
          <Icon className="text-muted group-hover:text-primary transition-colors" size={14} />
          <span>{title}</span>
        </div>
        {isOpen ? <FiChevronUp size={14} className="text-muted" /> : <FiChevronDown size={14} className="text-muted" />}
      </button>
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const Filters = ({ filters, onChange, onClear }) => {
  const filterBtn = (key, value, label) => {
    const isActive = filters[key] === value;
    return (
      <button
        key={value}
        onClick={() => onChange(key, value)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          isActive
            ? 'bg-primary text-white shadow-sm shadow-primary/20 scale-[1.02]'
            : 'bg-muted-bg text-muted hover:bg-border hover:text-foreground'
        }`}
      >
        {label}
      </button>
    );
  };

  const hasActiveFilters = 
    filters.status !== 'ALL' || 
    filters.priority !== 'ALL' || 
    filters.category !== 'ALL';

  return (
    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-sm">
      <FilterSection title="Status" icon={FiList}>
        <div className="flex flex-wrap gap-2">
          {filterBtn('status', 'ALL', 'All')}
          {filterBtn('status', 'TODO', 'To Do')}
          {filterBtn('status', 'IN_PROGRESS', 'In Progress')}
          {filterBtn('status', 'DONE', 'Done')}
        </div>
      </FilterSection>

      <FilterSection title="Priority" icon={FiAlertCircle}>
        <div className="flex flex-wrap gap-2">
          {filterBtn('priority', 'ALL', 'All')}
          {filterBtn('priority', 'HIGH', 'High')}
          {filterBtn('priority', 'MEDIUM', 'Medium')}
          {filterBtn('priority', 'LOW', 'Low')}
        </div>
      </FilterSection>

      <FilterSection title="Category" icon={FiTag}>
        <div className="flex flex-wrap gap-2">
          {filterBtn('category', 'ALL', 'All')}
          {filterBtn('category', 'WORK', 'Work')}
          {filterBtn('category', 'PERSONAL', 'Personal')}
          {filterBtn('category', 'STUDY', 'Study')}
          {filterBtn('category', 'HEALTH', 'Health')}
          {filterBtn('category', 'OTHER', 'Other')}
        </div>
      </FilterSection>

      <div className="pt-2">
        <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Sort By</p>
        <select
          value={filters.sortBy}
          onChange={(e) => onChange('sortBy', e.target.value)}
          className="w-full p-2 bg-muted-bg border border-border rounded-lg focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm transition"
        >
          <option value="createdAt_desc">Newest First</option>
          <option value="createdAt_asc">Oldest First</option>
          <option value="priority_desc">Priority High → Low</option>
          <option value="dueDate_asc">Due Date (Soonest)</option>
        </select>
      </div>

      {hasActiveFilters && (
        <button 
          onClick={onClear}
          className="w-full flex items-center justify-center space-x-2 py-2 mt-4 text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
        >
          <FiX size={14} />
          <span>Clear filters</span>
        </button>
      )}
    </div>
  );
};

export default Filters;
