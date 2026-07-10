const express = require('express');
const router = express.Router();
const { generateRoadmap, getRoadmaps, updateMilestone } = require('../controllers/roadmap.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/generate', generateRoadmap);
router.get('/', getRoadmaps);
router.patch('/milestone', updateMilestone);

module.exports = router;
