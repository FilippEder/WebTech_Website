
const pool = require('../../config/database/sequelize');


class ConversationModel {
  /**
   * Erstellt eine neue Konversation für das gegebene Listing.
   * @param {number} requestId - Die Listing-ID, für die eine Konversation erstellt werden soll.
   * @returns {Promise<boolean>} - Gibt true zurück, wenn die Konversation erfolgreich erstellt wurde.
   */

  static async newConversation(requestId) {
    try {
      const queryText =
        'INSERT INTO chat_conversations (request_id) VALUES ($1) RETURNING *';
      // pool.query gibt ein Promise zurück, welches ein Objekt mit einem "rows"-Array enthält.
      await pool.query(queryText, [requestId]);
	    
      return true;
    } catch (error) {
      console.error('Error in newConversation:', error);
      throw error;
    }
  }

  /**
   * Sucht eine Konversation anhand der Listing-ID.
   * @param {number} requestId - Die Listing-ID, zu der die Konversation gefunden werden soll.
   * @returns {Promise<Object|null>} - Gibt das Konversationsobjekt zurück (das aus dem "rows"-Array der Query stammt),
   *                                    oder null, falls keine Konversation gefunden wurde.
   */
  static async findConversationByRequestId(requestId) {
    try {
      const queryText =
        'SELECT * FROM chat_conversations WHERE request_id = $1';
      const result = await pool.query(queryText, [requestId]);
      // pool.query gibt ein Objekt zurück, das ein Array "rows" enthält.
      if (result.rows.length > 0) {
        return   result.rows[0];
      }
      return null;
    } catch (error) {
      console.error('Error in findConversationByListingId:', error);
      throw error;
    }
  }

  /**
   * Löscht eine Konversation anhand der Listing-ID.
   * @param {number} requestId - Die Listing-ID, zu der die Konversation gelöscht werden soll.
   * @returns {Promise<boolean>} - Gibt true zurück, wenn die Konversation erfolgreich gelöscht wurde.
   */
  static async deleteConversation(requestId) {
    try {
      const queryText =
        'DELETE FROM chat_conversations WHERE request_id = $1';
      await pool.query(queryText, [requestId]);
      return true;
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      throw error;
    }
  }
}

module.exports = ConversationModel;

