const Profile = require('../models/Profile.model');

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'age', 'gender', 'education', 'location', 'interests', 'skills', 'languages', 'careerGoals', 'preferredCareerFields', 'familyBackground', 'bio'];
    const updates = {};
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Calculate profile completeness
    updates.profileComplete = calculateCompleteness({ ...req.body });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, profile, message: 'Profile updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: `Profile update error: ${err.message}` });
  }
};

exports.saveScheme = async (req, res) => {
  try {
    const { schemeId } = req.body;
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { savedSchemes: schemeId } }
    );
    res.json({ success: true, message: 'Scheme bookmarked!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving scheme.' });
  }
};

exports.removeScheme = async (req, res) => {
  try {
    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { savedSchemes: req.params.schemeId } }
    );
    res.json({ success: true, message: 'Scheme bookmark removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error removing scheme.' });
  }
};

function calculateCompleteness(data) {
  const fields = ['name', 'age', 'gender', 'education', 'location', 'interests', 'skills', 'careerGoals', 'preferredCareerFields', 'bio'];
  let filled = 0;
  fields.forEach(f => {
    const val = data[f];
    if (val && (typeof val !== 'object' || Object.keys(val).length > 0) && (!Array.isArray(val) || val.length > 0)) filled++;
  });
  return Math.round((filled / fields.length) * 100);
}
