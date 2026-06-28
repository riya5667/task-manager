import React, { useState } from 'react';
import { DndContext, closestCenter, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from '../TaskCard/TaskCard';

const SortableTaskItem = ({ task, onEdit, onDelete, onToggleComplete, onSelect, isSelected }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mb-3 touch-none">
      <TaskCard 
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleComplete={onToggleComplete}
        onSelect={onSelect}
        isSelected={isSelected}
      />
    </div>
  );
};

const KanbanColumn = ({ id, title, tasks, onEdit, onDelete, onToggleComplete, onSelect, selectedTasks }) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="bg-muted-bg/50 rounded-xl p-4 flex flex-col h-full border border-border">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <span className="bg-muted-bg text-muted text-xs font-bold px-2 py-1 rounded-full border border-border">
          {tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="flex-1 overflow-y-auto pr-1 -mr-1 min-h-[150px]">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskItem 
              key={task.id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onSelect={onSelect}
              isSelected={selectedTasks.includes(task.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const KanbanBoard = ({ tasks, onDragEnd, onEdit, onDelete, onToggleComplete, onSelect, selectedTasks }) => {
  const [activeId, setActiveId] = useState(null);

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEndWithReset = (event) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEndWithReset}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
        <KanbanColumn 
          id="TODO" 
          title="To Do" 
          tasks={todoTasks} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onSelect={onSelect}
          selectedTasks={selectedTasks}
        />
        <KanbanColumn 
          id="IN_PROGRESS" 
          title="In Progress" 
          tasks={inProgressTasks} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onSelect={onSelect}
          selectedTasks={selectedTasks}
        />
        <KanbanColumn 
          id="DONE" 
          title="Done" 
          tasks={doneTasks} 
          onEdit={onEdit} 
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          onSelect={onSelect}
          selectedTasks={selectedTasks}
        />
      </div>

      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask ? (
          <div className="rotate-2 scale-105 shadow-2xl cursor-grabbing">
            <TaskCard 
              task={activeTask}
              onEdit={() => {}}
              onDelete={() => {}}
              onToggleComplete={() => {}}
              onSelect={() => {}}
              isSelected={selectedTasks.includes(activeTask.id)}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
