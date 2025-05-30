const express = require('express');
const router = express.Router();
const getConversationsController = require('../../../controllers/chat-controllers/conversations/get.conversations.controller');

router.get('/', getConversationsController);

module.exports = router;
