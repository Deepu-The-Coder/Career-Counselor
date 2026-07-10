const express = require('express');
const router = express.Router();
const { reviewResume, getInterviewQuestions, buildResumeSuggestions } = require('../controllers/resume.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/review', reviewResume);
router.get('/interview-questions', getInterviewQuestions);
router.get('/suggestions', buildResumeSuggestions);

module.exports = router;
