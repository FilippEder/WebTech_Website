const ConversationModel = require('../../models/chat/conversation.model');

async function getConversation(request_id) {
  try {
    return await ConversationModel.findConversationByRequestId(request_id);
  } catch (error) {
    console.error('Error in getConversation service:', error);
    throw error;
  }
}

module.exports = { getConversation };
