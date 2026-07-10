const express = require('express');
const router = express.Router();
const { sendMessage, getSessions, getSession, deleteSession, newSession } = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.post('/send', sendMessage);
router.post('/new', newSession);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSession);
router.delete('/sessions/:id', deleteSession);

module.exports = router;
