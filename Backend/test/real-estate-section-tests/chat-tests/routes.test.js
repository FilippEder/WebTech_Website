// real-estate-section-tests/chat-real-estate-section-tests/routes.test.js
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const app = express();

// JSON-Parsing aktivieren
app.use(express.json());

// Importiere die Routes
const postMessagesRoutes = require('../../../src/routes/chat/messages/post.messages.routes');
const getMessagesRoutes  = require('../../../src/routes/chat/messages/get.messages.routes');
const postConversationsRoutes = require('../../../src/routes/chat/conversations/post.conversations.routes');
const getConversationsRoutes  = require('../../../src/routes/chat/conversations/post.conversations.routes');
const deleteConversationsRoutes = require('../../../src/routes/chat/conversations/delete.conversations.routes');

// Binde die Routes an (achte auf die Reihenfolge – die Endpunkte sollten sich nicht überschneiden)
app.use('/messages', postMessagesRoutes);
app.use('/messages', getMessagesRoutes);
app.use('/conversations', postConversationsRoutes);
app.use('/conversations', getConversationsRoutes);
app.use('/conversations', deleteConversationsRoutes);

// Modelle für Testvorbereitung (zum Anlegen/Löschen von Daten)
const ListingModel = require('../../../src/models/realEstate/listing.model');

describe('Chat Routes', function() {
  let listingId;
  let conversationId;
  const dummyUserId = 1; // Vorausgesetzt, ein Benutzer mit dieser ID existiert

  // Globales Setup: Erstelle ein Dummy‑Listing und eine zugehörige Konversation
  before(async function() {
    const listingData = {
      user_id: dummyUserId,
      title: 'Test Listing for Routes',
      description: 'Listing for routes test'
    };
    const listing = await ListingModel.createListing(listingData);
    listingId = listing.listing_id;

    // Erstelle über den POST /conversations-Routen-Endpunkt eine Konversation
    const res = await request(app)
      .post('/conversations')
      .send({ listingId });
    // Wir erwarten hier ein Objekt mit conversation_id
    conversationId = res.body.conversation_id;
  });

  // Globales Cleanup: Lösche das Dummy‑Listing (über Cascade werden auch zugehörige Konversation und Nachrichten entfernt)
  after(async function() {
    await ListingModel.deleteListing(listingId);
  });

  describe('Messages Routes', function() {
    describe('POST /messages', function() {
      it('should create a new message and return the message object', async function() {
        const payload = {
          conversationId,
          senderId: dummyUserId,
          messageContent: 'Message via routes test'
        };

        const res = await request(app)
          .post('/messages')
          .send(payload)
          .expect(200);

        expect(res.body).to.have.property('message_id');
        expect(res.body).to.have.property('content', payload.messageContent);
        expect(res.body).to.have.property('conversation_id', conversationId);
        expect(res.body).to.have.property('sender_id', dummyUserId);
      });
    });

    describe('GET /messages', function() {
      beforeEach(async function() {
        // Säubere vorher alle Nachrichten in dieser Konversation
        const pool = require('../../../src/config/database/db');
        await pool.query('DELETE FROM chat_messages WHERE conversation_id = $1', [conversationId]);

        // Füge zwei Testnachrichten über den POST /messages-Endpunkt ein
        await request(app)
          .post('/messages')
          .send({ conversationId, senderId: dummyUserId, messageContent: 'First message' });
        // Kurze Pause, damit sich die Zeitstempel unterscheiden
        await new Promise(resolve => setTimeout(resolve, 10));
        await request(app)
          .post('/messages')
          .send({ conversationId, senderId: dummyUserId, messageContent: 'Second message' });
      });

      it('should retrieve all messages for the conversation in chronological order', async function() {
        const res = await request(app)
          .get('/messages')
          .query({ conversationId })
          .expect(200);

        expect(res.body).to.be.an('array').with.lengthOf(2);
        const [msg1, msg2] = res.body;
        expect(new Date(msg2.sent_at) >= new Date(msg1.sent_at)).to.be.true;
      });
    });
  });

  describe('Conversations Routes', function() {
    describe('POST /conversations', function() {
      it('should create a new conversation for a given listing', async function() {
        // Erstelle für diesen Test ein neues Listing
        const listingData = {
          user_id: dummyUserId,
          title: 'Test Listing for Conversation POST (Routes)',
          description: 'Test description'
        };
        const listing = await ListingModel.createListing(listingData);
        const newListingId = listing.listing_id;

        const res = await request(app)
          .post('/conversations')
          .send({ listingId: newListingId })
          .expect(200);

        expect(res.body).to.have.property('conversation_id');

        // Cleanup: Lösche das Test‑Listing (Cascade löscht auch die Konversation)
        await ListingModel.deleteListing(newListingId);
      });
    });

    describe('GET /conversations', function() {
      it('should retrieve a conversation by listingId', async function() {
        const res = await request(app)
          .get('/conversations')
          .query({ listingId })
          .expect(200);

        expect(res.body).to.have.property('conversation_id');
        expect(res.body).to.have.property('listing_id', listingId);
      });
    });

    describe('DELETE /conversations', function() {
      it('should delete a conversation by listingId', async function() {
        // Erstelle ein neues Listing und damit eine neue Konversation für den Lösch-Test
        const listingData = {
          user_id: dummyUserId,
          title: 'Test Listing for Conversation DELETE (Routes)',
          description: 'Test description'
        };
        const listing = await ListingModel.createListing(listingData);
        const delListingId = listing.listing_id;

        // Zuerst: Konversation via POST /conversations erstellen
        const createRes = await request(app)
          .post('/conversations')
          .send({ listingId: delListingId })
          .expect(200);
        expect(createRes.body).to.have.property('conversation_id');

        // Dann: Konversation löschen via DELETE /conversations
        const delRes = await request(app)
          .delete('/conversations')
          .send({ listingId: delListingId })
          .expect(200);
        expect(delRes.body).to.have.property('success', true);

        // Überprüfe, dass ein GET /conversations nun einen 404-Status zurückgibt
        await request(app)
          .get('/conversations')
          .query({ listingId: delListingId })
          .expect(404);

        // Cleanup: Lösche das Test‑Listing
        await ListingModel.deleteListing(delListingId);
      });
    });
  });
});

