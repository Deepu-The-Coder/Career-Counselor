const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careerPath: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  milestones: [{
    step: Number,
    title: String,
    description: String,
    duration: String,
    resources: [String],
    skills: [String],
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    completedAt: Date,
  }],
  totalDuration: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  aiGenerated: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', roadmapSchema);
