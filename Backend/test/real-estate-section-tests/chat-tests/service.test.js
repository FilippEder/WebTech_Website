// real-estate-section-tests/chat-services.test.js
const { expect } = require('chai');
const pool = require('../../../../../../Backend/config/db');
const ListingModel = require('../../../Models/Luca/chat-models/listining.model');
const ConversationModel = require('../../../../../../Backend/chat/conversation.model');
const MessageModel = require('../../../../../../Backend/chat/message.model');

// Service-Module (wir nehmen an, dass diese Funktionen exportiert werden)
const { postMessage } = require('../../../../../../Backend/chat/services/messages/post.messages.service');
const { getMessages } = require('../../../../../../Backend/chat/services/messages/get.messages.service');
const { createConversation } = require('../../../../../../Backend/chat/services/conversations/post.conversations.service');
const { getConversation } = require('../../../../../../Backend/chat/services/conversations/get.conversations.service');
const { deleteConversation } = require('../../../../../../Backend/chat/services/conversations/delete.conversations.service');

describe('Conversation Services', function() {
  let listingId;
  let conversation; // aktueller Konversationsdatensatz
  const dummyUserId = 1; // Es muss ein Benutzer mit user_id 1 in der Test-DB existieren

  // Erzeuge einen Dummy‑Listing als Basis für alle Konversationstests
  before(async function() {
    const listing = await ListingModel.createListing({
      user_id: dummyUserId,
      title: 'Service Test Listing for Conversations',
      description: 'Test listing for conversation service real-estate-section-tests'
    });
    listingId = listing.listing_id;
  });

  // Lösche am Ende den Dummy‑Listing (über Cascade werden auch Konversation und zugehörige Nachrichten entfernt)
  after(async function() {
    await pool.query('DELETE FROM listings WHERE listing_id = $1', [listingId]);
  });

  describe('POST Conversation Service', function() {
    it('should create a new conversation for a given listing', async function() {
      const result = await createConversation(listingId);
      expect(result).to.be.true;
      // Überprüfe, ob die Konversation in der DB existiert
      conversation = await ConversationModel.findConversationByRequestId(listingId);
      expect(conversation).to.be.an('object');
      expect(conversation).to.have.property('listing_id', listingId);
    });
  });

  describe('GET Conversation Service', function() {
    before(async function() {
      // Sicherstellen, dass eine Konversation existiert
      if (!conversation) {
        await createConversation(listingId);
        conversation = await ConversationModel.findConversationByRequestId(listingId);
      }
    });
    it('should retrieve the conversation for a given listing', async function() {
      const conv = await getConversation(listingId);
      expect(conv).to.be.an('object');
      expect(conv).to.have.property('listing_id', listingId);
    });
  });

  describe('DELETE Conversation Service', function() {
    before(async function() {
      // Sicherstellen, dass eine Konversation existiert
      if (!conversation) {
        await createConversation(listingId);
        conversation = await ConversationModel.findConversationByRequestId(listingId);
      }
    });
    it('should delete the conversation for a given listing', async function() {
      const result = await deleteConversation(listingId);
      expect(result).to.be.true;
      const conv = await ConversationModel.findConversationByRequestId(listingId);
      expect(conv).to.be.null;
    });
  });
});

describe('Message Services', function() {
  let listingId, conversationId;
  const dummyUserId = 1;

  // Für die Nachrichtentests: Erzeuge einen Dummy‑Listing und eine dazugehörige Konversation
  before(async function() {
    const listing = await ListingModel.createListing({
      user_id: dummyUserId,
      title: 'Service Test Listing for Messages',
      description: 'Test listing for message service real-estate-section-tests'
    });
    listingId = listing.listing_id;
    // Erstelle über den Conversation-Service eine Konversation
    await createConversation(listingId);
    const conversation = await ConversationModel.findConversationByRequestId(listingId);
    conversationId = conversation.conversation_id;
  });

  after(async function() {
    // Lösche den Dummy‑Listing (Cascade löscht auch Konversation und Nachrichten)
    await pool.query('DELETE FROM listings WHERE listing_id = $1', [listingId]);
  });

  describe('POST Message Service', function() {
    it('should post a new message and return its details', async function() {
      const messageContent = 'Hello from message service test';
      const result = await postMessage({
        conversationId,
        senderId: dummyUserId,
        messageContent
      });
      expect(result).to.have.property('message_id');
      expect(result).to.have.property('content', messageContent);
      expect(result).to.have.property('conversation_id', conversationId);
      expect(result).to.have.property('sender_id', dummyUserId);
    });
  });

  describe('GET Message Service', function() {
    // Vor dem Test: Säubere die Nachrichten und füge mehrere Testnachrichten ein
    before(async function() {
      await pool.query('DELETE FROM chat_messages WHERE conversation_id = $1', [conversationId]);
      const messages = [
        { conversationId, senderId: dummyUserId, messageContent: 'First message' },
        { conversationId, senderId: dummyUserId, messageContent: 'Second message' },
        { conversationId, senderId: dummyUserId, messageContent: 'Third message' }
      ];
      for (const msg of messages) {
        await postMessage(msg);
      }
    });
    it('should retrieve all messages for a given conversation in chronological order', async function() {
      const messages = await getMessages(conversationId);
      expect(messages).to.be.an('array').with.lengthOf(3);
      // Prüfe, ob die Nachrichten chronologisch sortiert sind (sent_at aufsteigend)
      for (let i = 1; i < messages.length; i++) {
        const prevDate = new Date(messages[i - 1].sent_at);
        const currentDate = new Date(messages[i].sent_at);
        expect(currentDate >= prevDate).to.be.true;
      }
    });
  });
});

