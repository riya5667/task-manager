const express = require('express');
const router = express.Router();
const { getLabels, createLabel } = require('../controllers/labelController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLabels).post(protect, createLabel);

module.exports = router;
