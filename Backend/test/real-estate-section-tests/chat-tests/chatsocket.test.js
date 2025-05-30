
const { expect } = require('chai');
const sinon = require('sinon');
const ChatSocket = require('../../../../../../Backend/chat/chatsocket/chatsocket.js'); // Passe den Pfad ggf. an

// Für Testfall 2: Annahme, dass ConversationModel existiert
const ConversationModel = require('../../../../../../Backend/chat/conversation.model.js');

describe('ChatSocket', function() {
  let chatSocket;
  let fakeSocket;
  let validMessage;

  beforeEach(function() {
    // Erzeuge einen Fake HTTP-Server (hier als leeres Objekt, da nur für die Initialisierung benötigt)
    const fakeHttpServer = {};
    chatSocket = new ChatSocket(fakeHttpServer);

    // Simuliere einen Socket (z. B. von Socket.IO) mit einer "emit"-Methode.
    // Siehe: https://socket.io/docs/v4/server-socket-instance/#socket-emit-eventname-args
    fakeSocket = {
      emit: sinon.spy()
    };

    // Für die Broadcast-Funktionalität wird chatSocket.io benötigt.
    // Wir simulieren dies mit einem Objekt, das ebenfalls über "emit" verfügt.
    chatSocket.io = {
      emit: sinon.spy()
    };

    // Definiere eine gültige Nachricht (Testfall 1, 6, 7)
    validMessage = {
      conversationId: 123,
      senderId: 1,
      messageContent: 'Hello, world!'
    };
  });

  describe('handleClientMessage', function() {
    /**
     * Testfall 1:
     * Erfolgreiches Senden einer Nachricht in einer bestehenden Konversation:
     * - Nachricht wird gespeichert (via postMessage) und anschließend an alle Clients broadcasted.
     */
    it('should save the message and broadcast to all clients when a valid message is sent', async function() {
      // ARRANGE:
      // Stub für postMessage, der die DB-Persistierung simuliert (s. z. B. MessageModel.insertMessage).
      // Hinweis: Falls handleClientMessage intern eine postMessage-Funktion aufruft,
      //          wird diese hier ersetzt. (Dokumentation der Promise-Rückgabe in Node.js: https://nodejs.org/api/promises.html)
      const postMessageStub = sinon.stub().resolves({ id: 1, ...validMessage });
      chatSocket.postMessage = postMessageStub;

      // Spy auf broadcastMessageToAllClients, um zu überprüfen, ob diese Methode aufgerufen wird.
      const broadcastSpy = sinon.spy(chatSocket, 'broadcastMessageToAllClients');

      // ACT:
      // Rufe handleClientMessage mit einem gültigen Message-Objekt auf.
      await chatSocket.handleClientMessage(fakeSocket, validMessage);

      // ASSERT:
      expect(postMessageStub.calledOnce).to.be.true;
      expect(broadcastSpy.calledOnce).to.be.true;
      expect(broadcastSpy.calledWith(validMessage)).to.be.true;

      // Dokumentation zu socket.emit: https://socket.io/docs/v4/server-socket-instance/#socket-emit-eventname-args
    });

    /**
     * Testfall 3:
     * Fehlende Pflichtfelder in der Nachricht:
     * - Wenn z. B. conversationId fehlt, soll ein Fehler ausgelöst werden.
     */
    it('should return an error if required fields are missing', async function() {
      // ARRANGE:
      // Erzeuge eine Nachricht ohne conversationId.
      const invalidMessage = {
        senderId: 1,
        messageContent: 'Incomplete message'
      };

      // Stub für postMessage, falls diese aufgerufen wird (sollte jedoch nicht erfolgen)
      chatSocket.postMessage = sinon.stub().resolves();

      // ACT & ASSERT:
      try {
        await chatSocket.handleClientMessage(fakeSocket, invalidMessage);
        // Falls kein Fehler geworfen wird, schlägt der Test fehl.
        expect.fail('Expected error for missing required fields, but none was thrown');
      } catch (error) {
        // Überprüfe, ob die Fehlermeldung einen Hinweis auf fehlende Felder enthält.
        expect(error.message).to.match(/missing/i);
      }
    });

    /**
     * Testfall 5:
     * Fehlerbehandlung bei Datenbankfehlern:
     * - Simuliere einen DB-Fehler, der von der postMessage-Funktion zurückgegeben wird.
     */
    it('should handle database errors gracefully', async function() {
      // ARRANGE:
      const dbError = new Error('Database error');
      chatSocket.postMessage = sinon.stub().rejects(dbError);

      // ACT & ASSERT:
      try {
        await chatSocket.handleClientMessage(fakeSocket, validMessage);
        expect.fail('Expected database error to be thrown');
      } catch (error) {
        expect(error).to.equal(dbError);
      }
    });

    /**
     * Testfall 6:
     * Gleichzeitiges Senden von Nachrichten durch beide Teilnehmer:
     * - Simuliere, dass zwei Clients nahezu gleichzeitig Nachrichten senden.
     */
    it('should handle simultaneous messages from both participants', async function() {
      // ARRANGE:
      // Erstelle zwei Fake-Sockets für zwei unterschiedliche Teilnehmer.
      const fakeSocket1 = { emit: sinon.spy() };
      const fakeSocket2 = { emit: sinon.spy() };

      // Setze chatSocket.io.emit (für Broadcast) als Spy.
      chatSocket.io.emit = sinon.spy();

      // Stub für postMessage, der für beide Nachrichten erfolgreich resolvt.
      const postMessageStub = sinon.stub().resolves({ id: 1, ...validMessage });
      chatSocket.postMessage = postMessageStub;

      // ACT:
      // Sende beide Nachrichten gleichzeitig.
      await Promise.all([
        chatSocket.handleClientMessage(fakeSocket1, validMessage),
        chatSocket.handleClientMessage(fakeSocket2, validMessage)
      ]);

      // ASSERT:
      expect(postMessageStub.calledTwice).to.be.true;
      // Hier wird angenommen, dass broadcastMessageToAllClients (bzw. io.emit) die Nachricht an alle gesendeten Clients verteilt.
      expect(chatSocket.io.emit.called).to.be.true;
    });
  });

  describe('broadcastMessageToAllClients', function() {
    /**
     * Testfall 7:
     * Überprüfung der Broadcast-Funktionalität:
     * - Prüfe, ob broadcastMessageToAllClients die Nachricht via io.emit an alle Clients sendet.
     */
    it('should broadcast message to all connected clients', function() {
      // ARRANGE:
      // validMessage ist bereits definiert.
      // chatSocket.io.emit wird als Spy genutzt (siehe beforeEach).

      // ACT:
      chatSocket.broadcastMessageToAllClients(validMessage);

      // ASSERT:
      expect(chatSocket.io.emit.calledOnce).to.be.true;
      // Hier wird davon ausgegangen, dass das Event den Namen 'chat message' trägt.
      expect(chatSocket.io.emit.calledWith('chat message', validMessage)).to.be.true;
    });
  });
});

describe('Conversation Retrieval', function() {
  /**
   * Testfall 2:
   * Wiedereröffnen einer existierenden Konversation:
   * - Wenn ein Benutzer eine bereits bestehende Konversation (zu einer Listing-ID) anfordert,
   *   muss dieselbe Konversation zurückgegeben werden.
   */
  it('should return the same conversation when reopened', async function() {
    // ARRANGE:
    const listingId = 456;
    const conversationData = {
      conversationId: 789,
      listingId: listingId,
      participants: [1, 2]
    };

    // Stub für ConversationModel.findConversationByListingId,
    // welcher die vorhandene Konversation zurückgibt.
    const findStub = sinon.stub(ConversationModel, 'findConversationByListingId').resolves(conversationData);

    // ACT:
    const conversation1 = await ConversationModel.findConversationByRequestId(listingId);
    const conversation2 = await ConversationModel.findConversationByRequestId(listingId);

    // ASSERT:
    expect(conversation1).to.deep.equal(conversationData);
    expect(conversation2).to.deep.equal(conversationData);

    // CLEANUP: Stub wiederherstellen
    findStub.restore();
  });
});

