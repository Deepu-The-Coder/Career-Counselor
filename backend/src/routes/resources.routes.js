const express = require('express');
const router = express.Router();
const { getResources } = require('../controllers/resources.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getResources);

module.exports = router;
