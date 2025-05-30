const ConversationModel = require('../../models/chat/conversation.model');

async function createConversation(listingId) {
  try {
    return await ConversationModel.newConversation(listingId);
  } catch (error) {
    console.error('Error in createConversation service:', error);
    throw error;
  }
}

module.exports = { createConversation };
