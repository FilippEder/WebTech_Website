const pool = require('../../config/database/sequelize'); // Pfad ggf. anpassen

class MessageModel {
  /**
   * Fügt eine neue Nachricht in die Tabelle chat_messages ein.
   * @param {Object} messageData - Enthält die Eigenschaften:
   *   - conversationId: Nummer der Konversation
   *   - senderId: Nummer des sendenden Benutzers
   *   - messageContent: Der Textinhalt der Nachricht
   * @returns {Promise<Object>} - Das eingefügte Nachricht-Objekt (inklusive message_id und sent_at)
   */
  static async insertMessage(messageData) {
    const {conversationId, senderId, messageContent} = messageData;
    try {
      const queryText = `
        INSERT INTO chat_messages (conversation_id, sender_id, content)
        VALUES ($1, $2, $3) RETURNING *
      `;
      const result = await pool.query(queryText, [conversationId, senderId, messageContent]);
      return result.rows[0];
    } catch (error) {
      console.error('Error in insertMessage:', error);
      throw error;
    }
  }
  
  static async getMessagesByConversationId(conversationId) {
    try {
      console.log('Hole Nachrichten für conversationId:', conversationId);
      const queryText = `
        SELECT *
        FROM chat_messages
        WHERE conversation_id = $1
        ORDER BY sent_at ASC
      `;
      const result = await pool.query(queryText, [conversationId]);
      console.log('Ergebnis:', result.rows);
      return result.rows;
    } catch (error) {
      console.error('Error in getMessagesByConversationId:', error);
      throw error;
    }
  }
}

module.exports = MessageModel;

