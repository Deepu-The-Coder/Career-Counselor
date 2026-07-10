const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, trim: true },
  age: { type: Number, min: 10, max: 35 },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  education: {
    level: {
      type: String,
      enum: ['Below 8th', '8th Pass', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other'],
    },
    stream: { type: String, trim: true },
    currentClass: { type: String, trim: true },
    institution: { type: String, trim: true },
    percentage: { type: Number, min: 0, max: 100 },
  },
  location: {
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  interests: [{ type: String, trim: true }],
  skills: [{ type: String, trim: true }],
  languages: [{ type: String, trim: true }],
  careerGoals: { type: String, trim: true, maxlength: 500 },
  preferredCareerFields: [{ type: String }],
  familyBackground: {
    occupation: { type: String, trim: true },
    annualIncome: { type: String },
    familySize: { type: Number },
  },
  avatar: { type: String },
  bio: { type: String, maxlength: 300 },
  savedSchemes: [{ type: String }],
  savedResources: [{ type: String }],
  assessmentCompleted: { type: Boolean, default: false },
  profileComplete: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
