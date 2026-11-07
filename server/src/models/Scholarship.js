const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a scholarship title'],
    trim: true
  },
  provider: {
    type: String,
    required: [true, 'Please add the provider name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  amount: {
    type: Number,
    required: [true, 'Please specify the scholarship amount']
  },
  deadline: {
    type: Date,
    required: [true, 'Please specify the application deadline']
  },
  eligibility: {
    educationLevel: { type: [String], required: true }, // e.g., ['Undergraduate', 'Postgraduate']
    fieldOfStudy: { type: [String], default: [] },       // e.g., ['Computer Science', 'Engineering']
    maxFamilyIncome: { type: Number, default: null },
    category: { type: [String], default: [] }            // e.g., ['General', 'OBC', 'SC', 'ST']
  },
  link: {
    type: String,
    required: [true, 'Please add the application or official website link']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);