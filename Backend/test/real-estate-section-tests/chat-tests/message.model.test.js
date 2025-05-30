const { expect } = require('chai');
const pool = require('../../../../../../Backend/config/db'); // Pfad ggf. anpassen
const MessageModel = require('../../../../../../Backend/chat/message.model');

describe('MessageModel', function() {
  // Wir benötigen eine existierende Konversation (und damit indirekt einen gültigen Listing-Datensatz).
  // Hier erstellen wir in einem before‑Hook einen Dummy‑Listing und eine zugehörige Konversation.
  let conversationId;
  const dummyUserId = 1; // Vorausgesetzt: Es existiert ein Benutzer mit user_id 1

  before(async function() {
    // Erstelle ein Dummy‑Listing (der Fremdschlüssel user_id verweist auf einen existierenden Benutzer)
    const listingRes = await pool.query(
      `INSERT INTO listings (user_id, title, description)
       VALUES ($1, 'Test Listing for Conversation', 'Test listing for conversation creation')
       RETURNING listing_id`,
      [dummyUserId]
    );
    const listingId = listingRes.rows[0].listing_id;

    // Erstelle eine zugehörige Konversation
    const convRes = await pool.query(
      `INSERT INTO chat_conversations (listing_id)
       VALUES ($1)
       RETURNING conversation_id`,
      [listingId]
    );
    conversationId = convRes.rows[0].conversation_id;
  });

  // Vor jedem Test werden alle Nachrichten dieser Konversation gelöscht, damit die Tests unabhängig sind.
  beforeEach(async function() {
    await pool.query('DELETE FROM chat_messages WHERE conversation_id = $1', [conversationId]);
  });

  // Cleanup: Lösche das Dummy‑Listing (und damit über Cascade auch die zugehörige Konversation)
  after(async function() {
    await pool.query(
      `DELETE FROM listings WHERE listing_id IN (
         SELECT listing_id FROM listings WHERE title = $1
       )`,
      ['Test Listing for Conversation']
    );
    // Optional: Beende die DB-Verbindung, falls dies für deine Tests gewünscht ist
    // await pool.end();
  });

  describe('insertMessage', function() {
    it('should insert a new message using parameterized queries and return its id', async function() {
      // Arrange
      const messageData = { 
        conversationId, 
        senderId: dummyUserId, 
        messageContent: 'Test message' 
      };

      // Act
      const result = await MessageModel.insertMessage(messageData);

      // Assert
      expect(result).to.have.property('message_id');
      expect(result).to.have.property('content', 'Test message');
      expect(result).to.have.property('conversation_id', conversationId);
      expect(result).to.have.property('sender_id', dummyUserId);
    });
  });

  describe('getMessagesByConversationId', function() {
    it('should retrieve all messages for a given conversation in chronological order', async function() {
      // Arrange
      const messagesToInsert = [
        { conversationId, senderId: dummyUserId, messageContent: 'First message' },
        { conversationId, senderId: dummyUserId, messageContent: 'Second message' },
        { conversationId, senderId: dummyUserId, messageContent: 'Third message' }
      ];

      // Nachrichten nacheinander einfügen
      for (const msg of messagesToInsert) {
        await MessageModel.insertMessage(msg);
      }

      // Act
      const messages = await MessageModel.getMessagesByConversationId(conversationId);

      // Assert
      expect(messages).to.be.an('array').with.lengthOf(messagesToInsert.length);
      // Überprüfe, ob die Nachrichten chronologisch sortiert sind (sent_at aufsteigend)
      for (let i = 1; i < messages.length; i++) {
        const prevDate = new Date(messages[i - 1].sent_at);
        const currentDate = new Date(messages[i].sent_at);
        expect(currentDate >= prevDate).to.be.true;
      }
    });
  });

  describe('SQL Injection Protection', function() {
    it('should use parameterized queries in insertMessage to prevent SQL injection', async function() {
      // Arrange
      const maliciousContent = 'Test"; DROP TABLE chat_messages;--';
      const maliciousMessageData = { 
        conversationId, 
        senderId: dummyUserId, 
        messageContent: maliciousContent 
      };

      // Act
      const result = await MessageModel.insertMessage(maliciousMessageData);

      // Assert
      expect(result).to.have.property('message_id');
      expect(result).to.have.property('content', maliciousContent);

      // Optional: Versuche eine weitere Nachricht einzufügen, um zu verifizieren, dass die Tabelle nicht gelöscht wurde.
      const followUpMessageData = { 
        conversationId, 
        senderId: dummyUserId, 
        messageContent: 'Follow up message' 
      };
      const followUpResult = await MessageModel.insertMessage(followUpMessageData);
      expect(followUpResult).to.have.property('message_id');
    });
  });
});
