const Scholarship = require('../models/Scholarship');
const { redisClient } = require('../config/redis');

// @desc    Get all scholarships with optional filtering & Redis caching
// @route   GET /api/scholarships
// @access  Public
const getScholarships = async (req, res) => {
  try {
    const { educationLevel, fieldOfStudy, category } = req.query;
    
    // Build query object dynamically based on filters
    let query = {};
    if (educationLevel) {
      query['eligibility.educationLevel'] = educationLevel;
    }
    if (fieldOfStudy) {
      query['eligibility.fieldOfStudy'] = fieldOfStudy;
    }
    if (category) {
      query['eligibility.category'] = category;
    }

    // Check Redis Cache if client is open/connected
    const cacheKey = `scholarships:${JSON.stringify(req.query)}`;
    if (redisClient.isOpen) {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.status(200).json({
          success: true,
          source: 'cache',
          count: JSON.parse(cachedData).length,
          data: JSON.parse(cachedData)
        });
      }
    }

    // Fetch from MongoDB
    const scholarships = await Scholarship.find(query);

    // Store results in Redis cache for 60 seconds
    if (redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 60, JSON.stringify(scholarships));
    }

    res.status(200).json({
      success: true,
      source: 'database',
      count: scholarships.length,
      data: scholarships
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
const getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new scholarship
// @route   POST /api/scholarships
// @access  Private/Admin
const createScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.create(req.body);
    
    // Invalidate old scholarship cache keys on new creation
    if (redisClient.isOpen) {
      const keys = await redisClient.keys('scholarships:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    res.status(201).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a scholarship
// @route   PUT /api/scholarships/:id
// @access  Private/Admin
const updateScholarship = async (req, res) => {
  try {
    let scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Invalidate cache
    if (redisClient.isOpen) {
      const keys = await redisClient.keys('scholarships:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    res.status(200).json({ success: true, data: scholarship });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private/Admin
const deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    await scholarship.deleteOne();

    // Invalidate cache
    if (redisClient.isOpen) {
      const keys = await redisClient.keys('scholarships:*');
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    }

    res.status(200).json({ success: true, message: 'Scholarship removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship
};