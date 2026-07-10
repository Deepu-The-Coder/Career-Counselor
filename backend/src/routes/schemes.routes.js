const express = require('express');
const router = express.Router();
const { getSchemes, getScheme } = require('../controllers/schemes.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.get('/', getSchemes);
router.get('/:id', getScheme);

module.exports = router;
