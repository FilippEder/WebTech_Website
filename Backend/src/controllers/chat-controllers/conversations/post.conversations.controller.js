const { createConversation } = require('../../../services/conversations/post.conversations.service');
const ConversationModel = require('../../../models/chat/conversation.model');

module.exports = async function(req, res, next) {
  try {
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ error: 'Missing listingId in request body' });
    }
    console.log('listingId is:', listingId);
    // Erstelle die Konversation über den Service
    const created = await createConversation(listingId);
    
  } catch (error) {
    next(error);
  }
};
