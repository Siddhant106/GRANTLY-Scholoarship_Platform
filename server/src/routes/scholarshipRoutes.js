const express = require('express');
const router = express.Router();
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
} = require('../controllers/scholarshipController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getScholarships)
  .post(protect, adminOnly, createScholarship);

router.route('/:id')
  .get(getScholarshipById)
  .put(protect, adminOnly, updateScholarship)
  .delete(protect, adminOnly, deleteScholarship);

module.exports = router;