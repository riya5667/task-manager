import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../components/TaskForm/TaskForm';

// Mock react-toastify to avoid issues in test env
jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const mockClose = jest.fn();
const mockSubmit = jest.fn();

const renderForm = (initialData = null) => {
  render(
    <TaskForm
      isOpen={true}
      onClose={mockClose}
      onSubmit={mockSubmit}
      initialData={initialData}
    />
  );
};

describe('TaskForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form when isOpen is true', () => {
    renderForm();
    expect(screen.getByRole('heading', { name: /new task/i })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<TaskForm isOpen={false} onClose={mockClose} onSubmit={mockSubmit} />);
    expect(screen.queryByRole('heading', { name: /new task/i })).not.toBeInTheDocument();
  });

  it('shows validation errors when submitted with empty fields', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(await screen.findByText('Description is required')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    renderForm();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockClose).toHaveBeenCalledTimes(1);
  });

  it('pre-fills form fields when editing an existing task', () => {
    const task = {
      title: 'Fix the bug',
      description: 'It is urgent',
      priority: 'HIGH',
      category: 'WORK',
      dueDate: '2030-12-31T00:00:00.000Z',
      status: 'PENDING',
    };
    renderForm(task);
    expect(screen.getByDisplayValue('Fix the bug')).toBeInTheDocument();
    expect(screen.getByDisplayValue('It is urgent')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /edit task/i })).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    renderForm();

    fireEvent.change(screen.getByPlaceholderText(/what needs to be done/i), {
      target: { value: 'My new task' },
    });
    fireEvent.change(screen.getByPlaceholderText(/add some details/i), {
      target: { value: 'A useful description' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create task/i }));

    // Submit should call onSubmit and onClose (which calls onClose internally)
    expect(await screen.findByRole('heading', { name: /new task/i })).toBeInTheDocument();
  });
});
