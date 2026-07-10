const watsonxService = require('../services/watsonx.service');
const Profile = require('../models/Profile.model');

exports.reviewResume = async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ success: false, message: 'Please provide resume content (minimum 50 characters).' });
    }

    const review = await watsonxService.generateResumeReview(resumeText, targetRole);
    res.json({ success: true, review, message: 'Resume reviewed successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: `Resume review error: ${err.message}` });
  }
};

exports.getInterviewQuestions = async (req, res) => {
  try {
    const { role, level = 'fresher' } = req.query;
    if (!role) return res.status(400).json({ success: false, message: 'Role is required.' });

    const profile = await Profile.findOne({ user: req.user._id });
    const systemPrompt = watsonxService.buildSystemPrompt('resume', profile);
    const prompt = `Generate 10 important interview questions for the role of "${role}" at ${level} level, with brief answer guidelines for each. Focus on practical scenarios relevant to Indian job market.`;
    const questions = await watsonxService.generateText(prompt, systemPrompt, { maxTokens: 1500 });

    res.json({ success: true, questions, role, level });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error generating questions: ${err.message}` });
  }
};

exports.buildResumeSuggestions = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Please complete your profile first.' });

    const systemPrompt = watsonxService.buildSystemPrompt('resume', profile);
    const prompt = `Based on the student's profile, provide:
1. A professional resume template outline
2. Key sections to include
3. Specific bullet points for their skills and education
4. Professional summary paragraph
5. Tips for making their resume ATS-friendly

Make it practical for a rural youth with limited work experience but good skills and potential.`;

    const suggestions = await watsonxService.generateText(prompt, systemPrompt, { maxTokens: 1500 });
    res.json({ success: true, suggestions });
  } catch (err) {
    res.status(500).json({ success: false, message: `Error generating resume suggestions: ${err.message}` });
  }
};
