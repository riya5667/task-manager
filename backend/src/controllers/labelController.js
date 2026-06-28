const prisma = require('../config/db');

// @desc    Get all labels for user
// @route   GET /api/labels
// @access  Private
const getLabels = async (req, res, next) => {
  try {
    const labels = await prisma.label.findMany(); // In a real app we'd scope this to user, but for now it's global
    res.json(labels);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a label
// @route   POST /api/labels
// @access  Private
const createLabel = async (req, res, next) => {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      res.status(400);
      throw new Error('Name and color are required');
    }
    const label = await prisma.label.create({
      data: { name, color },
    });
    res.status(201).json(label);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLabels,
  createLabel,
};
