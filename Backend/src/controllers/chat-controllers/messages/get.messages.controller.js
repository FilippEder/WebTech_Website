const { getMessages } = require('../../../services/chat/messages/get.messages.service');

module.exports = async function(req, res, next) {
  try {
    const { conversationId } = req.query;
    if (!conversationId) {
      return res.status(400).json({ error: 'Missing conversationId query parameter' });
    }
    const messages = await getMessages(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};
