const Roadmap = require('../models/Roadmap.model');
const Profile = require('../models/Profile.model');
const watsonxService = require('../services/watsonx.service');

exports.generateRoadmap = async (req, res) => {
  try {
    const { careerPath } = req.body;
    if (!careerPath) return res.status(400).json({ success: false, message: 'Career path is required.' });

    const profile = await Profile.findOne({ user: req.user._id });
    const aiRoadmap = await watsonxService.generateRoadmap(careerPath, profile);

    const milestones = parseRoadmapMilestones(careerPath, aiRoadmap);

    const roadmap = await Roadmap.create({
      user: req.user._id,
      careerPath,
      title: `${careerPath} Career Roadmap`,
      description: aiRoadmap.substring(0, 300),
      milestones,
      totalDuration: '12-18 months',
      difficulty: 'Beginner',
      aiGenerated: true,
    });

    res.status(201).json({ success: true, roadmap, aiRoadmap, message: 'Roadmap generated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: `Roadmap generation error: ${err.message}` });
  }
};

exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, roadmaps });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching roadmaps.' });
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const { roadmapId, milestoneIndex, status } = req.body;
    const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user._id });
    if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found.' });

    if (roadmap.milestones[milestoneIndex]) {
      roadmap.milestones[milestoneIndex].status = status;
      if (status === 'completed') roadmap.milestones[milestoneIndex].completedAt = new Date();
      await roadmap.save();
    }

    res.json({ success: true, roadmap, message: 'Milestone updated!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating milestone.' });
  }
};

function parseRoadmapMilestones(careerPath, aiText) {
  const defaultMilestones = {
    'Software Developer': [
      { step: 1, title: 'Learn Basics of Computers', description: 'Master computer fundamentals, typing, and internet usage', duration: '1 month', skills: ['Computer Basics', 'Internet'], resources: ['NPTEL free courses', 'YouTube - CS50'] },
      { step: 2, title: 'Learn HTML/CSS & Web Basics', description: 'Build your first webpage', duration: '2 months', skills: ['HTML', 'CSS', 'Web Design'], resources: ['freeCodeCamp', 'W3Schools', 'YouTube tutorials'] },
      { step: 3, title: 'JavaScript Fundamentals', description: 'Learn programming logic with JavaScript', duration: '2 months', skills: ['JavaScript', 'Programming Logic'], resources: ['freeCodeCamp', 'JavaScript.info'] },
      { step: 4, title: 'Backend & Database', description: 'Learn Node.js and MongoDB basics', duration: '3 months', skills: ['Node.js', 'MongoDB', 'REST APIs'], resources: ['NPTEL', 'MongoDB University (free)'] },
      { step: 5, title: 'Build Projects & Portfolio', description: 'Create 3 real-world projects to showcase', duration: '2 months', skills: ['Problem Solving', 'Portfolio Building'], resources: ['GitHub', 'Project ideas from YouTube'] },
      { step: 6, title: 'Apply for Jobs & Internships', description: 'Prepare resume, attend interviews, apply on job portals', duration: '2 months', skills: ['Resume Writing', 'Interview Skills'], resources: ['Naukri.com', 'Internshala', 'LinkedIn'] },
    ],
  };

  const genericMilestones = [
    { step: 1, title: 'Foundation & Awareness', description: `Learn about the ${careerPath} field and understand requirements`, duration: '1 month', skills: ['Research', 'Basic Knowledge'], resources: ['YouTube', 'SWAYAM', 'Google'] },
    { step: 2, title: 'Skill Development', description: 'Enroll in relevant training program or online course', duration: '3 months', skills: ['Core Skills', 'Practical Training'], resources: ['PMKVY Centers', 'NPTEL', 'Coursera (free audit)'] },
    { step: 3, title: 'Certification', description: 'Earn recognized certification in your field', duration: '2 months', skills: ['Certification Preparation'], resources: ['Skill India Portal', 'Government ITI', 'NSDC'] },
    { step: 4, title: 'Practical Experience', description: 'Internship, apprenticeship, or hands-on project work', duration: '3 months', skills: ['Real-world Application'], resources: ['Internshala', 'National Apprenticeship Portal'] },
    { step: 5, title: 'Government Scheme Support', description: 'Apply for relevant government schemes and financial support', duration: '1 month', skills: ['Documentation', 'Application Process'], resources: ['India.gov.in', 'PMKVY Portal', 'National Scholarship Portal'] },
    { step: 6, title: 'Job Application & Interview', description: 'Prepare resume, practice interviews, and apply to jobs', duration: '2 months', skills: ['Communication', 'Interview Skills', 'Resume Writing'], resources: ['Naukri.com', 'Indeed', 'LinkedIn', 'State Employment Portal'] },
  ];

  return defaultMilestones[careerPath] || genericMilestones;
}
