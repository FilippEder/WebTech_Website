const { postMessage } = require('../../../services/chat/messages/post.messages.service');

module.exports = async function(req, res, next) {
  try {
    
    const { conversationId, messageContent } = req.body;
    const senderId = req.user_id;
    const result = await postMessage({ conversationId, senderId, messageContent });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
