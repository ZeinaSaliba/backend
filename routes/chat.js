const express = require('express');
const router = express.Router();
const chatController = require('../contorllers/chatController');

router.get('/chatList/:userId', chatController.chatList);
router.get('/chat/:chatId', chatController.getMessages);
router.post('/addMessage/:chatId', chatController.addMessage);

module.exports = router;