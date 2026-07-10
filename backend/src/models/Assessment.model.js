const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: [{
    questionId: String,
    question: String,
    answer: mongoose.Schema.Types.Mixed,
    category: String,
  }],
  results: {
    overallScore: { type: Number, default: 0 },
    careerMatches: [{
      career: String,
      matchScore: Number,
      description: String,
      requiredSkills: [String],
      roadmap: String,
    }],
    strengths: [String],
    weaknesses: [String],
    personalityType: String,
    workStyle: String,
    improvementPlan: [String],
    topDomains: [{
      domain: String,
      score: Number,
    }],
  },
  aiAnalysis: { type: String },
  completedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 },
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
