const express = require('express');
const router = express.Router();
const postConversationsController = require('../../../controllers/chat-controllers/conversations/post.conversations.controller');

router.post('/', postConversationsController);

module.exports = router;
