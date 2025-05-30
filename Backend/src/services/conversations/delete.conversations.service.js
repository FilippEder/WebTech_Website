const ConversationModel = require('../../models/chat/conversation.model');

async function deleteConversation(listingId) {
  try {
    return await ConversationModel.deleteConversation(listingId);
  } catch (error) {
    console.error('Error in deleteConversation service:', error);
    throw error;
  }
}

module.exports = { deleteConversation };
