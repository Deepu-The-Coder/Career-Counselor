const express = require('express');
const router = express.Router();
const { getQuestions, submitAssessment, getLatestAssessment } = require('../controllers/assessment.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/questions', getQuestions);
router.post('/submit', submitAssessment);
router.get('/latest', getLatestAssessment);

module.exports = router;
