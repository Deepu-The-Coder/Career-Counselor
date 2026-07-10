const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'New Chat', trim: true },
  messages: [messageSchema],
  context: { type: String, default: 'general' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

chatSessionSchema.methods.addMessage = function (role, content) {
  this.messages.push({ role, content });
  if (this.messages.length === 2 && role === 'assistant') {
    const firstUserMsg = this.messages[0].content;
    this.title = firstUserMsg.substring(0, 50) + (firstUserMsg.length > 50 ? '...' : '');
  }
};

module.exports = mongoose.model('ChatSession', chatSessionSchema);
