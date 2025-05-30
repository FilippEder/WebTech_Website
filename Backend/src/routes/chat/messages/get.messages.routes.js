const express = require('express');
const router = express.Router();
const getMessagesController = require('../../../controllers/chat-controllers/messages/get.messages.controller');

router.get('/', getMessagesController);

module.exports = router;
