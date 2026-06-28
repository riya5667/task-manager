const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  restoreTask,
  bulkAction,
} = require('../controllers/taskController');

// All task routes are protected
router.use(protect);

router
  .route('/')
  .get(getTasks)
  .post(
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('category', 'Category is required').not().isEmpty(),
      check('dueDate', 'Due date is required').not().isEmpty(),
    ],
    createTask
  );

router.patch('/bulk', bulkAction);

router
  .route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/restore', restoreTask);

module.exports = router;
