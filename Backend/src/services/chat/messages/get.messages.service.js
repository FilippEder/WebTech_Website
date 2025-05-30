const MessageModel = require('../../../models/chat/message.model');

async function getMessages(conversationId) {
  try {
    return await MessageModel.getMessagesByConversationId(conversationId);
  } catch (error) {
    console.error('Error in getMessages service:', error);
    throw error;
  }
}

module.exports = { getMessages };
