const express = require('express');
const router = express.Router();
const { getFamilyMembers, getFamilyStats } = require('../controllers/family.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/members', getFamilyMembers);
router.get('/stats', getFamilyStats);

module.exports = router;
