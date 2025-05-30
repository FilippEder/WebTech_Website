const MessageModel = require('../../../models/chat/message.model');

async function postMessage({ conversationId, senderId, messageContent }) {
  try {
    return await MessageModel.insertMessage({ conversationId, senderId, messageContent });
  } catch (error) {
    console.error('Error in postMessage service:', error);
    throw error;
  }
}

module.exports = { postMessage };
