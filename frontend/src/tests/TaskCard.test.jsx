import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard/TaskCard';

const mockTask = {
  id: 'task-123',
  title: 'Write unit tests',
  description: 'Make sure everything is covered',
  status: 'PENDING',
  priority: 'HIGH',
  category: 'WORK',
  dueDate: new Date('2030-12-31').toISOString(),
  isDeleted: false,
  createdAt: new Date().toISOString(),
};

const mockHandlers = {
  onEdit: jest.fn(),
  onDelete: jest.fn(),
  onToggleComplete: jest.fn(),
  onSelect: jest.fn(),
};

describe('TaskCard Component', () => {
  beforeEach(() => jest.clearAllMocks());

  const renderCard = (overrides = {}) => {
    render(
      <TaskCard
        task={{ ...mockTask, ...overrides }}
        {...mockHandlers}
        isSelected={false}
      />
    );
  };

  it('renders title and description', () => {
    renderCard();
    expect(screen.getByText('Write unit tests')).toBeInTheDocument();
    expect(screen.getByText('Make sure everything is covered')).toBeInTheDocument();
  });

  it('displays priority badge', () => {
    renderCard();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('displays category badge', () => {
    renderCard();
    expect(screen.getByText('WORK')).toBeInTheDocument();
  });

  it('calls onSelect when checkbox is clicked', () => {
    renderCard();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(mockHandlers.onSelect).toHaveBeenCalledWith('task-123');
  });

  it('shows checkbox as checked when isSelected is true', () => {
    render(
      <TaskCard task={mockTask} {...mockHandlers} isSelected={true} />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('applies completed styling when status is COMPLETED', () => {
    renderCard({ status: 'COMPLETED' });
    const title = screen.getByText('Write unit tests');
    expect(title.className).toContain('line-through');
  });

  it('calls onEdit when edit button is clicked', () => {
    renderCard();
    // Hover to reveal buttons
    const card = screen.getByText('Write unit tests').closest('.group');
    fireEvent.mouseEnter(card);
    fireEvent.click(screen.getByTitle('Edit'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockTask);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderCard();
    fireEvent.click(screen.getByTitle('Delete'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('task-123');
  });

  it('calls onToggleComplete when status toggle is clicked', () => {
    renderCard();
    fireEvent.click(screen.getByTitle('Toggle Status'));
    expect(mockHandlers.onToggleComplete).toHaveBeenCalledWith('task-123', 'PENDING');
  });
});
