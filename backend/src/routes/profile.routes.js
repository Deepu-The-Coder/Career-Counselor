const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, saveScheme, removeScheme } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/save-scheme', saveScheme);
router.delete('/scheme/:schemeId', removeScheme);

module.exports = router;
