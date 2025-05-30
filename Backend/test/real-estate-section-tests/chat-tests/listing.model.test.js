const { expect } = require('chai');
const pool = require('../../../src/config/database/db'); // Pfad ggf. anpassen
const ListingModel = require('../../../src/models/realEstate/listing.model'); // Pfad ggf. anpassen

describe('ListingModel', function () {
  // Vor jedem Test: Tabelle leeren, damit keine alten Daten stören.
  beforeEach(async () => {
    // Es wird davon ausgegangen, dass die Tabelle "listings" existiert.
    await pool.query('DELETE FROM listings');
  });

  // Nach allen Tests die DB-Verbindung schließen.
  after(async () => {
  });

  describe('createListing', function () {
    it('sollte ein neues Listing anlegen und zurückgeben', async function () {
      // Arrange
      const listingData = {
        user_id: 1,
        title: 'Test Listing',
        description: 'Dies ist ein Testlisting.'
      };

      // Act
      const createdListing = await ListingModel.createListing(listingData);

      // Assert
      expect(createdListing).to.have.property('listing_id');
      expect(createdListing.user_id).to.equal(listingData.user_id);
      expect(createdListing.title).to.equal(listingData.title);
      expect(createdListing.description).to.equal(listingData.description);
    });
  });

  describe('getListingById', function () {
    it('sollte das Listing mit der angegebenen ID zurückgeben', async function () {
      // Arrange
      const listingData = {
        user_id: 1,
        title: 'Ein weiteres Testlisting',
        description: 'Testbeschreibung'
      };
      const createdListing = await ListingModel.createListing(listingData);
      const listingId = createdListing.listing_id;

      // Act
      const foundListing = await ListingModel.getListingById(listingId);

      // Assert
      expect(foundListing).to.deep.include({
        listing_id: listingId,
        user_id: listingData.user_id,
        title: listingData.title,
        description: listingData.description
      });
    });

    it('sollte null zurückgeben, wenn kein Listing gefunden wurde', async function () {
      // Act
      const listing = await ListingModel.getListingById(999999); // Annahme: Diese ID existiert nicht

      // Assert
      expect(listing).to.be.null;
    });
  });

  describe('getAllListings', function () {
    it('sollte alle Listings in absteigender Reihenfolge nach Erstellungsdatum zurückgeben', async function () {
      // Arrange
      const listing1 = await ListingModel.createListing({
        user_id: 1,
        title: 'Erstes Listing',
        description: 'Beschreibung 1'
      });
      const listing2 = await ListingModel.createListing({
        user_id: 1,
        title: 'Zweites Listing',
        description: 'Beschreibung 2'
      });

      // Act
      const allListings = await ListingModel.getAllListings();

      // Assert
      expect(allListings).to.be.an('array').with.lengthOf(2);
      // Da nach created_at DESC sortiert wird, sollte listing2 (das neuere) zuerst kommen.
      expect(allListings[0].listing_id).to.equal(listing2.listing_id);
      expect(allListings[1].listing_id).to.equal(listing1.listing_id);
    });
  });


  describe('deleteListing', function () {
    it('sollte ein Listing löschen und true zurückgeben', async function () {
      // Arrange
      const listingData = {
        user_id: 1,
        title: 'Zu löschendes Listing',
        description: 'Dieses Listing wird gelöscht.'
      };
      const createdListing = await ListingModel.createListing(listingData);
      const listingId = createdListing.listing_id;

      // Act
      const deleteResult = await ListingModel.deleteListing(listingId);

      // Assert
      expect(deleteResult).to.be.true;
      const foundListing = await ListingModel.getListingById(listingId);
      expect(foundListing).to.be.null;
    });
  });

  describe('getListingsByUserId', function () {
    it('sollte alle Listings eines bestimmten Nutzers zurückgeben', async function () {
      // Arrange
      const userId = 1;
      // Zwei Listings für userId  und ein Listing für einen anderen Nutzer anlegen.

      // Act
      const userListings = await ListingModel.getListingsByUserId(userId);

      // Assert
      expect(userListings).to.be.an('array').with.lengthOf(2);
      // Überprüfen, dass alle zurückgegebenen Listings die richtige user_id haben.
      userListings.forEach(listing => {
        expect(listing.user_id).to.equal(userId);
      });
      // Optionale Prüfung: Die Reihenfolge (nach created_at DESC) kann hier ebenfalls getestet werden.
    });
  });
});

