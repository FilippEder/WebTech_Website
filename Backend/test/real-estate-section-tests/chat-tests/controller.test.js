// real-estate-section-tests/chat-real-estate-section-tests/chat-controllers.test.js
const { expect } = require('chai');
const request = require('supertest');
const express = require('express');
const app = express();

// Middleware für JSON-Parsing
app.use(express.json());

// Importiere die Controller
const postMessagesController = require('../../../src/controllers/chat-controllers/messages/post.messages.controller');
const getMessagesController  = require('../../../src/controllers/chat-controllers/messages/get.messages.controller');
const postConversationsController = require('../../../src/controllers/chat-controllers/conversations/post.conversations.controller');
const getConversationsController  = require('../../../src/controllers/chat-controllers/conversations/get.conversations.controller');
const deleteConversationsController = require('../../../src/controllers/chat-controllers/conversations/delete.conversations.controller');

// Binde die Controller als Routen ein
app.post('/messages', postMessagesController);
app.get('/messages', getMessagesController);
app.post('/conversations', postConversationsController);
app.get('/conversations', getConversationsController);
app.delete('/conversations', deleteConversationsController);

// Modelle für Testvorbereitung (Daten anlegen/löschen)
const ListingModel = require('../../../src/models/realEstate/listing.model');

describe('Chat Controllers', function () {
  // Gemeinsame Testdaten
  let listingId;
  let conversationId;
  const dummyUserId = 1; // Vorausgesetzt: Ein Benutzer mit dieser ID existiert

  // Globales Setup: Erstelle ein Dummy‑Listing und eine zugehörige Konversation,
  // die von den meisten Tests genutzt werden.
  before(async function () {
    // Erstelle ein Dummy‑Listing
    const listingData = {
      user_id: dummyUserId,
      title: 'Test Listing for Controller',
      description: 'Listing for controller real-estate-section-tests'
    };
    const listing = await ListingModel.createListing(listingData);
    listingId = listing.listing_id;

    // Erstelle über den Conversations-POST-Controller eine neue Konversation
    // (Alternativ kannst du auch direkt das Model verwenden.)
    const res = await request(app)
      .post('/conversations')
      .send({ listingId });
    // Es wird angenommen, dass der Controller im Erfolgsfall ein Objekt mit conversation_id zurückgibt.
    conversationId = res.body.conversation_id;
    // Falls der Controller nicht direkt die ID zurückgibt, kannst du alternativ:
    // const conv = await ConversationModel.findConversationByListingId(listingId);
    // conversationId = conv.conversation_id;
  });

  // Globales Cleanup: Lösche das Dummy‑Listing (über Cascade werden zugehörige Konversation und Nachrichten entfernt)
  after(async function () {
    await ListingModel.deleteListing(listingId);
  });

  describe('Messages Controllers', function () {
    describe('POST /messages', function () {
      it('should insert a new message and return the created message object', async function () {
        // Arrange
        const messagePayload = {
          conversationId,
          senderId: dummyUserId,
          messageContent: 'Hello from controller!'
        };

        // Act
        const res = await request(app)
          .post('/messages')
          .send(messagePayload)
          .expect(200);

        // Assert
        expect(res.body).to.have.property('message_id');
        expect(res.body).to.have.property('content', messagePayload.messageContent);
        expect(res.body).to.have.property('conversation_id', conversationId);
        expect(res.body).to.have.property('sender_id', dummyUserId);
      });
    });

    describe('GET /messages', function () {
      // Vor jedem GET-Test: Säubere (lösche) Nachrichten dieser Konversation und füge Testnachrichten ein.
      beforeEach(async function () {
        const pool = require('../../../src/config/database/db');
        await pool.query('DELETE FROM chat_messages WHERE conversation_id = $1', [conversationId]);

        // Füge einige Nachrichten ein (über den POST-Controller)
        await request(app)
          .post('/messages')
          .send({ conversationId, senderId: dummyUserId, messageContent: 'First message' });
        // Eine kleine Pause, um unterschiedliche Zeitstempel zu erhalten
        await new Promise(resolve => setTimeout(resolve, 10));
        await request(app)
          .post('/messages')
          .send({ conversationId, senderId: dummyUserId, messageContent: 'Second message' });
      });

      it('should retrieve all messages for a given conversation in chronological order', async function () {
        // Act
        const res = await request(app)
          .get('/messages')
          .query({ conversationId })
          .expect(200);

        // Assert
        expect(res.body).to.be.an('array').with.lengthOf(2);
        const [msg1, msg2] = res.body;
        expect(new Date(msg2.sent_at) >= new Date(msg1.sent_at)).to.be.true;
      });
    });
  });

  describe('Conversations Controllers', function () {
    describe('POST /conversations', function () {
      it('should create a new conversation for a given listing', async function () {
        // Arrange: Erstelle ein neues Listing für diesen Test
        const listingData = {
          user_id: dummyUserId,
          title: 'Test Listing for Conversation POST',
          description: 'Test listing description'
        };
        const listing = await ListingModel.createListing(listingData);
        const newListingId = listing.listing_id;

        // Act
        const res = await request(app)
          .post('/conversations')
          .send({ listingId: newListingId })
          .expect(200);

        // Assert
        expect(res.body).to.have.property('conversation_id');

        // Cleanup: Lösche das Listing (und die zugehörige Konversation via Cascade)
        await ListingModel.deleteListing(newListingId);
      });
    });

    describe('GET /conversations', function () {
      it('should retrieve a conversation by listingId', async function () {
        // Act
        const res = await request(app)
          .get('/conversations')
          .query({ listingId })
          .expect(200);

        // Assert
        expect(res.body).to.have.property('conversation_id');
        expect(res.body).to.have.property('listing_id', listingId);
      });
    });

    describe('DELETE /conversations', function () {
      it('should delete a conversation by listingId', async function () {
        // Arrange: Erstelle ein neues Listing und damit eine neue Konversation für diesen Test
        const listingData = {
          user_id: dummyUserId,
          title: 'Test Listing for Conversation DELETE',
          description: 'Test description'
        };
        const listing = await ListingModel.createListing(listingData);
        const delListingId = listing.listing_id;

        // Erstelle die Konversation via POST-Endpoint
        const createRes = await request(app)
          .post('/conversations')
          .send({ listingId: delListingId })
          .expect(200);
        expect(createRes.body).to.have.property('conversation_id');

        // Act: Lösche die Konversation
        // (Hier wird angenommen, dass der DELETE-Controller den listingId im Body erhält.)
        const delRes = await request(app)
          .delete('/conversations')
          .send({ listingId: delListingId })
          .expect(200);
        expect(delRes.body).to.have.property('success', true);

        // Optionale Überprüfung: GET sollte nun einen 404-Status liefern, wenn keine Konversation gefunden wird.
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

