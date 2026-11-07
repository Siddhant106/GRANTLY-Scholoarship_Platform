const express = require('express');
const router = express.Router();
const { getAIScholarshipAdvice } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/recommendations', protect, getAIScholarshipAdvice);

module.exports = router;