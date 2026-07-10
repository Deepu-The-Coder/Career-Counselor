const ChatSession = require('../models/ChatSession.model');
const Profile = require('../models/Profile.model');
const watsonxService = require('../services/watsonx.service');

exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, context = 'general' } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    // Get user profile for personalization
    const profile = await Profile.findOne({ user: req.user._id });

    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, user: req.user._id });
    }
    if (!session) {
      session = new ChatSession({ user: req.user._id, context });
    }

    // Add user message
    session.addMessage('user', message.trim());

    // Generate AI response
    let aiResponse = '';
    try {
      aiResponse = await watsonxService.generateChat(
        session.messages.map(m => ({ role: m.role, content: m.content })),
        profile ? {
          name: profile.name,
          education: profile.education,
          location: profile.location,
          interests: profile.interests,
          skills: profile.skills,
          careerGoals: profile.careerGoals,
          preferredCareerFields: profile.preferredCareerFields,
        } : null,
        context
      );
    } catch (err) {
      aiResponse = `I’m here to help with your career questions. Since the AI service is temporarily unavailable, please share your education level, interests, and career goal so I can guide you with practical next steps.`;
    }

    if (!aiResponse || !aiResponse.trim()) {
      aiResponse = `I can still help you explore career options. Share your education level, interests, and career goal, and I’ll suggest practical steps, courses, or government schemes that fit your background.`;
    }

    // Add assistant response
    session.addMessage('assistant', aiResponse);
    await session.save();

    res.json({
      success: true,
      response: aiResponse,
      sessionId: session._id,
      messageCount: session.messages.length,
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ success: false, message: `AI service error: ${err.message}` });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ user: req.user._id, isActive: true })
      .select('title context messages createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    const sessionList = sessions.map(s => ({
      id: s._id,
      title: s.title,
      context: s.context,
      messageCount: s.messages.length,
      lastMessage: s.messages[s.messages.length - 1]?.content.substring(0, 80) || '',
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    res.json({ success: true, sessions: sessionList });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching sessions.' });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ _id: req.params.id, user: req.user._id });
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching session.' });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await ChatSession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isActive: false }
    );
    res.json({ success: true, message: 'Chat session deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting session.' });
  }
};

exports.newSession = async (req, res) => {
  try {
    const { context = 'general' } = req.body;
    const session = new ChatSession({ user: req.user._id, context });
    await session.save();
    res.status(201).json({ success: true, sessionId: session._id, message: 'New session created.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating session.' });
  }
};
