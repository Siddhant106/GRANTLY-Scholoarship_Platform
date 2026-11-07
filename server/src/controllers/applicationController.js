const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');

// @desc    Apply for a scholarship
// @route   POST /api/applications
// @access  Private/Student
const applyForScholarship = async (req, res) => {
  try {
    const { scholarshipId, documentsUrl } = req.body;

    // Check if scholarship exists
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    // Check if user has already applied for this scholarship
    const existingApplication = await Application.findOne({
      student: req.user._id,
      scholarship: scholarshipId
    });

    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'You have already applied for this scholarship' });
    }

    // Create application
    const application = await Application.create({
      student: req.user._id,
      scholarship: scholarshipId,
      documentsUrl: documentsUrl || []
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in student's applications
// @route   GET /api/applications/my-applications
// @access  Private/Student
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate('scholarship', 'title provider amount deadline');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/admin/all
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .populate('student', 'name email profile')
      .populate('scholarship', 'title provider amount');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (Admin)
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Under Review', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForScholarship,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
};