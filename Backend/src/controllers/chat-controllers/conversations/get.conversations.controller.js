const { getConversation } = require('../../../services/conversations/get.conversations.service');

module.exports = async function(req, res, next) {
  try {
    const { request_id } = req.query;
    if (!request_id) {
      return res.status(400).json({ error: 'Missing request_id query parameter' });
    }
    const conversation = await getConversation(request_id);
    if (conversation) {
      return res.status(200).json(conversation);
    }
    res.status(404).json({ error: 'Conversation not found' });
  } catch (error) {
    next(error);
  }
};
