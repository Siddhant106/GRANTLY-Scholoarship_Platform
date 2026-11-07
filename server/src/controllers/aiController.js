const { GoogleGenAI } = require('@google/genai');
const Scholarship = require('../models/Scholarship');

// @desc    Get AI-powered scholarship recommendations & advice
// @route   POST /api/ai/recommendations
// @access  Private/Student
const getAIScholarshipAdvice = async (req, res) => {
  try {
    // Initialize Google GenAI SDK inside the function to ensure process.env is fully loaded
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const { studentQuery } = req.body;
    const userProfile = req.user.profile;

    const scholarships = await Scholarship.find({}).limit(10);

    const prompt = `
      You are an expert AI scholarship advisor for "Grantly" (Unified Scholarship Discovery & Management Platform).
      Student Profile:
      - Education Level: ${userProfile.educationLevel || 'Not specified'}
      - Field of Study: ${userProfile.fieldOfStudy || 'Not specified'}
      - Family Income: ${userProfile.familyIncome || 'Not specified'}
      - Category: ${userProfile.category || 'Not specified'}

      Available Scholarships in Database:
      ${JSON.stringify(scholarships)}

      Student's Query/Prompt: "${studentQuery || 'Suggest the best scholarships for my profile.'}"

      Provide clear, encouraging, and structured advice pointing out matching opportunities and eligibility tips.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    res.status(200).json({
      success: true,
      advice: response.text
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAIScholarshipAdvice
};