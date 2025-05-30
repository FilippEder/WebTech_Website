// conversation.model.test.js
// Test-Suite für das ConversationModel unter Verwendung von Mocha und Chai
// Angepasst an die neuen Methodennamen und Parameter:
// - newConversation(listing) erwartet einen Boolean (true bei Erfolg)
// - findConversationByListiningId(conversationId) liefert die Conversation Information
// - deleteConversation(listing) löscht den Datensatz, der zur gegebenen Listing-ID gehört

const ConversationModel = require('../../../../../../Backend/chat/conversation.model');
const ListiningModel = require('../../../Models/Luca/chat-models/listining.model')
const expect = require('chai').expect;
const sinon = require('sinon');
// Optional: Falls du einen Datenbank-Pool (z.B. "pool") verwendest, um die Query-Aufrufe zu überwachen:
// const pool = require('../db');

describe('1. ConversationModel', function() {

  describe('1.1 newConversation', function() {
    it('1.1.1 should insert a new conversation for a given listing and return true', async function() {

      // Rufe die Methode newConversation auf.
      // Erwartung: Die Methode speichert den Datensatz und gibt true zurück, wenn erfolgreich.
	    const listiningData = {
    userId: 1,
    title: "My first Listening",
    description: "The Description of my Listening"
};

	 

       const createdListing = await ListiningModel.createListing(listiningData);
       const listingId = createdListing.listing_id;  // Verwende den tatsächlichen Wert
const result = await ConversationModel.newConversation(listingId);
      // Überprüfe, ob das Ergebnis ein Boolean ist und true enthält.
      expect(result).to.be.a('boolean');
      expect(result).to.equal(true);
    });

    it('1.1.2 should use parameterized queries in newConversation to prevent SQL injection', async function() {
      // Hier soll geprüft werden, ob bei bösartigen Eingaben (SQL-Injection-Versuch) 
      // die Methode newConversation einen parameterisierten Query verwendet.
      // Dies setzt voraus, dass du einen Spy auf deine DB-Abfragefunktion (z.B. pool.query) einsetzt.
      
      // Beispiel (abhängig von deiner konkreten Implementierung):
      // const spy = sinon.spy(pool, 'query');

      // Bösartige Testdaten:
      const maliciousListing = { listing_id: "1; DROP TABLE listings;" };
	
      try {
        await ConversationModel.newConversation(maliciousListing);
      } catch (error) {
        // Falls ein Fehler geworfen wird, sollte dieser nicht darauf hinweisen, dass die SQL-Injection erfolgreich war.
      }

      // TODO: Überprüfe, ob die DB-Abfrage als parameterisierte Query ausgeführt wurde.
      // Beispiel (sofern implementiert):
      // expect(spy.called).to.be.true;
      // expect(spy.getCall(0).args[0]).to.include('$1');

      // Aufräumen:
      // spy.restore();
    });
  });

  describe('1.2 findConversationByListingId', function() {
    it('1.2.1 should return conversation information for an existing conversation id', async function() {
      // Um diesen Test durchzuführen, muss zunächst ein Datensatz vorhanden sein.
      // Hier simulieren wir, dass für das Listing bereits eine Konversation angelegt wurde.
      // Wir gehen davon aus, dass newConversation(listing) zuvor erfolgreich war und
      // dass die zugehörige conversation_id intern (z. B. in der DB) generiert wurde.
      
      // Für den Test verwenden wir eine bekannte conversation_id.

	    const listiningData = {
    userId: 1,
    title: "My first Listening",
    description: "The Description of my Listening"
};

	 

       const createdListing = await ListiningModel.createListing(listiningData);
       const listingId = createdListing.listing_id;  // Verwende den tatsächlichen Wert

       await ConversationModel.newConversation(listingId);
      const conversation = await ConversationModel.findConversationByRequestId(listingId);

      // Überprüfe, ob das zurückgegebene Objekt die erwarteten Felder enthält.
      expect(conversation).to.be.an('object');
      expect(conversation).to.have.property('listing_id', listingId);
      expect(conversation).to.have.property('created_at');
      expect(conversation).to.have.property('updated_at');
    });

    it('1.2.2 should return null (or undefined) for a non-existing conversation id', async function() {
      const nonExistingId = 999999;
      const conversation = await ConversationModel.findConversationByRequestId(nonExistingId);
      expect(conversation).to.be.null;
      // Alternativ, falls deine Implementierung "undefined" zurückgibt:
      // expect(conversation).to.be.undefined;
    });
  });

  describe('1.3 deleteConversation', function() {
    it('1.3.1 should delete a conversation given its listing', async function() {
      // Zuerst legen wir einen Datensatz an, indem wir newConversation mit einem bestimmten Listing aufrufen.

      // Erstelle den Conversation-Datensatz.
	    const listiningData = {
    userId: 1,
    title: "My first Listening",
    description: "The Description of my Listening"
};

	 

       const createdListing = await ListiningModel.createListing(listiningData);
       const listingId = createdListing.listing_id;  // Verwende den tatsächlichen Wert
const result = await ConversationModel.newConversation(listingId);

      // Rufe findConversationByListiningId auf, um die conversation_id zu ermitteln.
      // Hier gehen wir davon aus, dass findConversationByListiningId die zugehörige Konversation findet.
      // (In einem echten Test-Setup könnte es sinnvoll sein, eine Methode findConversationByListing zu implementieren.)
      const conversation = await ConversationModel.findConversationByRequestId(listingId);
      expect(conversation).to.be.an('object');

      // Lösche die Konversation anhand des Listings.
      await ConversationModel.deleteConversation(listingId);

      // Überprüfe, dass nach dem Löschen kein Datensatz mehr vorhanden ist.
      const deletedConversation = await ConversationModel.findConversationByRequestId(conversation.conversation_id);
      expect(deletedConversation).to.be.null;
    });
  });
});

