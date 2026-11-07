const express = require('express');
const router = express.Router();
const {
  applyForScholarship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.route('/')
  .post(protect, applyForScholarship);

router.get('/my-applications', protect, getMyApplications);

router.get('/admin/all', protect, adminOnly, getAllApplications);
router.put('/:id/status', protect, adminOnly, updateApplicationStatus);

module.exports = router;