const prisma = require('../config/db');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for logged in user (with pagination, filter, sort)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const { status, category, priority, sortBy, sortOrder, search } = req.query;

    const where = {
      userId: req.user.id,
      isDeleted: false,
    };

    if (status && status !== 'ALL') where.status = status;
    if (category && category !== 'ALL') where.category = category;
    if (priority && priority !== 'ALL') where.priority = priority;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc'; // default
    }

    const total = await prisma.task.count({ where });

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      skip: startIndex,
      take: limit,
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        labels: true
      }
    });

    res.json({
      data: tasks,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isDeleted: false,
      },
      include: {
        activities: { orderBy: { createdAt: 'desc' } },
        labels: true
      }
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      throw new Error(errors.array()[0].msg);
    }

    const { title, description, status, priority, category, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        category,
        dueDate: new Date(dueDate),
        userId: req.user.id,
        activities: {
          create: { action: 'created' }
        }
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isDeleted: false,
      },
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, status, priority, category, dueDate } = req.body;

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: {
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        status: status !== undefined ? status : task.status,
        priority: priority !== undefined ? priority : task.priority,
        category: category !== undefined ? category : task.category,
        dueDate: dueDate !== undefined ? new Date(dueDate) : task.dueDate,
        activities: {
          create: { action: 'updated' }
        }
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isDeleted: false,
      },
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await prisma.task.update({
      where: { id: req.params.id },
      data: { 
        isDeleted: true,
        activities: { create: { action: 'deleted' } }
      },
    });

    res.json({ message: 'Task soft deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore soft deleted task
// @route   PATCH /api/tasks/:id/restore
// @access  Private
const restoreTask = async (req, res, next) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
        isDeleted: true,
      },
    });

    if (!task) {
      res.status(404);
      throw new Error('Deleted task not found');
    }

    const restoredTask = await prisma.task.update({
      where: { id: req.params.id },
      data: { 
        isDeleted: false,
        activities: { create: { action: 'restored' } }
      },
    });

    res.json(restoredTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk action (complete/delete)
// @route   PATCH /api/tasks/bulk
// @access  Private
const bulkAction = async (req, res, next) => {
  try {
    const { taskIds, action } = req.body; // action: 'COMPLETE' or 'DELETE'

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      res.status(400);
      throw new Error('No tasks provided');
    }

    if (action === 'COMPLETE') {
      await prisma.task.updateMany({
        where: {
          id: { in: taskIds },
          userId: req.user.id,
        },
        data: { status: 'DONE' },
      });
      res.json({ message: 'Tasks marked as completed' });
    } else if (action === 'DELETE') {
      await prisma.task.updateMany({
        where: {
          id: { in: taskIds },
          userId: req.user.id,
        },
        data: { isDeleted: true },
      });
      res.json({ message: 'Tasks soft deleted' });
    } else {
      res.status(400);
      throw new Error('Invalid bulk action');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  restoreTask,
  bulkAction,
};
