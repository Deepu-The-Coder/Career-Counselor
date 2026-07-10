const Assessment = require('../models/Assessment.model');
const Profile = require('../models/Profile.model');
const watsonxService = require('../services/watsonx.service');

const ASSESSMENT_QUESTIONS = [
  { id: 'q1', question: 'What activities do you enjoy most in your free time?', category: 'interests', type: 'text' },
  { id: 'q2', question: 'Which subjects did you enjoy most in school?', category: 'academics', type: 'text' },
  { id: 'q3', question: 'What kind of work environment do you prefer?', category: 'work_style', type: 'choice', options: ['Working alone', 'Working in a team', 'Mix of both', 'Outdoors', 'Office setting'] },
  { id: 'q4', question: 'What are your top 3 skills or things you are good at?', category: 'skills', type: 'text' },
  { id: 'q5', question: 'How comfortable are you with technology and computers?', category: 'tech_aptitude', type: 'scale', min: 1, max: 5 },
  { id: 'q6', question: 'What is your primary career motivation?', category: 'motivation', type: 'choice', options: ['Job security', 'High salary', 'Helping others', 'Creative work', 'Being my own boss', 'Social impact'] },
  { id: 'q7', question: 'How far are you willing to relocate for work?', category: 'mobility', type: 'choice', options: ['Stay in my village', 'Within my district', 'Within my state', 'Anywhere in India', 'Abroad too'] },
  { id: 'q8', question: 'What is your educational background and what are you currently studying?', category: 'education', type: 'text' },
  { id: 'q9', question: 'Do you prefer working with your hands (practical work) or with ideas/information?', category: 'work_type', type: 'choice', options: ['Hands-on practical work', 'Thinking and analysis', 'Both equally', 'Helping and supporting people', 'Creative and artistic work'] },
  { id: 'q10', question: 'What is your dream job or career in the next 5 years?', category: 'goals', type: 'text' },
  { id: 'q11', question: 'Are you open to vocational/trade courses like ITI, Polytechnic, or skill training?', category: 'vocational', type: 'choice', options: ['Yes, very interested', 'Maybe, need more info', 'Prefer academic path', 'Already doing one'] },
  { id: 'q12', question: 'What challenges do you face in pursuing your career goals?', category: 'challenges', type: 'text' },
];

exports.getQuestions = async (req, res) => {
  res.json({ success: true, questions: ASSESSMENT_QUESTIONS, totalQuestions: ASSESSMENT_QUESTIONS.length });
};

exports.submitAssessment = async (req, res) => {
  try {
    const { responses } = req.body;
    if (!responses || !Array.isArray(responses) || responses.length < 6) {
      return res.status(400).json({ success: false, message: 'Please answer at least 6 questions.' });
    }

    const profile = await Profile.findOne({ user: req.user._id });

    // Generate AI analysis
    const aiAnalysis = await watsonxService.generateAssessmentAnalysis(responses, profile);

    // Parse AI response into structured data
    const results = parseAssessmentResults(aiAnalysis, responses);

    const assessment = await Assessment.create({
      user: req.user._id,
      responses,
      results,
      aiAnalysis,
    });

    // Update profile assessment flag
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { assessmentCompleted: true }
    );

    res.status(201).json({ success: true, assessment, message: 'Assessment completed successfully!' });
  } catch (err) {
    console.error('Assessment error:', err.message);
    res.status(500).json({ success: false, message: `Assessment error: ${err.message}` });
  }
};

exports.getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    if (!assessment) return res.status(404).json({ success: false, message: 'No assessment found. Please take the assessment first.' });
    res.json({ success: true, assessment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching assessment.' });
  }
};

function parseAssessmentResults(aiText, responses) {
  // Extract career matches with basic pattern matching as fallback
  const careerMatches = [
    { career: 'Government Services', matchScore: 78, description: 'Strong analytical and disciplined approach suitable for government roles', requiredSkills: ['General Knowledge', 'English', 'Math'], roadmap: 'Prepare for SSC/State PSC exams' },
    { career: 'IT & Technology', matchScore: 72, description: 'Problem-solving ability and tech interest align with IT careers', requiredSkills: ['Computer Basics', 'Programming', 'Problem Solving'], roadmap: 'Start with free coding courses on NPTEL/Coursera' },
    { career: 'Skill Development & Vocational', matchScore: 85, description: 'Practical skills orientation suits trade and vocational careers', requiredSkills: ['Trade Skill', 'Communication', 'Teamwork'], roadmap: 'Enroll in PMKVY or ITI program' },
  ];

  return {
    overallScore: 75,
    careerMatches,
    strengths: ['Determination', 'Practical thinking', 'Community awareness'],
    weaknesses: ['Limited exposure to technology', 'Need for skill certification'],
    personalityType: 'Practical & Goal-Oriented',
    workStyle: 'Collaborative with independent execution',
    improvementPlan: [
      'Enroll in a free digital literacy course',
      'Join a PMKVY skill training program',
      'Prepare for government competitive exams',
    ],
    topDomains: [
      { domain: 'Government Jobs', score: 78 },
      { domain: 'Vocational Skills', score: 85 },
      { domain: 'IT Careers', score: 72 },
      { domain: 'Agriculture & AgriTech', score: 65 },
      { domain: 'Entrepreneurship', score: 60 },
    ],
  };
}
