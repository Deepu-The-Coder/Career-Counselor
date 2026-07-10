const User = require('../models/User.model');
const Profile = require('../models/Profile.model');

// Family members share same email domain but have separate profiles
exports.getFamilyMembers = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json({ success: true, profile, message: 'Family feature: each family member registers separately and can share a household code.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching family data.' });
  }
};

exports.getFamilyStats = async (req, res) => {
  try {
    // Placeholder for family analytics
    const stats = {
      totalMembers: 1,
      assessmentsCompleted: 0,
      topCareerFields: [],
      totalSavedSchemes: 0,
      message: 'Invite family members to join CareerSaathi for collaborative guidance!'
    };
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching family stats.' });
  }
};
