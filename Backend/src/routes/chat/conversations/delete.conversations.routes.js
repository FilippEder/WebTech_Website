const express = require('express');
const router = express.Router();
const deleteConversationsController = require('../../../controllers/chat-controllers/conversations/delete.conversations.controller');

router.delete('/', deleteConversationsController);

module.exports = router;
