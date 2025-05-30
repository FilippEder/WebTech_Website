const express = require('express');
const router = express.Router();
const postMessagesController = require('../../../controllers/chat-controllers/messages/post.messages.controller');
const authCheck = require('../../login/middleware/checkAuthentication.js');
router.use(authCheck);
router.post('/', postMessagesController);

module.exports = router;
