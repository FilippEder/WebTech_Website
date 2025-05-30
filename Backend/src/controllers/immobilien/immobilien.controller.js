/**
 * controllers/immobilien/immobilien.controller.js
 *
 * Controller für den Immobilien-Bereich.
 */
const immobilienService = require('../../services/immobilien/immobilien.service');
class ImmobilienController {
  async createImmobilie(req, res) {
    try {
      // Der JSON-Teil (als String) wird unter dem Key 'real_estate' erwartet
      const realEstateData = JSON.parse(req.body.real_estate);
      
      const user_id = req.user_id;
      // Falls Bilder hochgeladen wurden, füge deren Pfade (oder URLs) zum Objekt hinzu
      if (req.files && req.files.pictures) {
        // Beispiel: Speichere nur den Dateipfad; du kannst auch eine vollständige URL konstruieren
        const picturePaths = req.files.pictures.map(file => file.path);
        realEstateData.incoming_picture_urls = picturePaths;
      } else {
        // Wenn keine Bilder hochgeladen wurden, setze einen leeren Array-Wert
        realEstateData.incoming_picture_urls = [];
      }
      
      // Jetzt an den Service übergeben
      const immobilie = await immobilienService.createImmobilie(realEstateData, user_id);
      res.status(201).json(immobilie);
    } catch (error) {
      console.error('Fehler beim Erstellen der Immobilie:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  
  async getAllImmobilien(req, res) {
    try {
      // Verwende req.query als Kriterien. Wenn keine Filter vorhanden sind, ist criteria ein leeres Objekt.
      const immobilien = await immobilienService.getAllImmobilienByCriteria(req.query);
      res.json(immobilien);
    } catch (error) {
      console.error('Fehler beim Abrufen aller Immobilien:', error);
      res.status(500).json({ error: error.message });
    }
  }
  async getImmobilieByRealEstateId(req, res) {
    try {
      const listing = await immobilienService.getImmobilieByRealEstateId(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(listing);
    } catch (error) {
      console.error('Fehler beim Abrufen des Listings:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  
  async getImmobilieById(req, res) {
    try {
      
      const user_id = req.user_id;
      const immobilie = await immobilienService.getImmobilieById( user_id);
      if (!immobilie) {
        return res.status(404).json({ error: 'Listing not found' });
      }
      res.json(immobilie);
    } catch (error) {
      console.error('Fehler beim Abrufen des Listings:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  async updateImmobilie(req, res) {
    try {
      // Den JSON-Teil aus dem FormData auslesen und parsen
      const realEstateData = JSON.parse(req.body.real_estate);
      
      // Falls Bilder hochgeladen wurden, füge deren Pfade hinzu
      if (req.files && req.files.pictures) {
        const picturePaths = req.files.pictures.map(file => file.path);
        realEstateData.incoming_picture_urls = picturePaths;
      }
      
      // An den Service übergeben – dieser ruft dann das Model mit den vorbereiteten Daten auf
      const immobilie = await immobilienService.updateImmobilie(realEstateData);
      res.json(immobilie);
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Listings:', error);
      res.status(500).json({ error: error.message });
    }
  }
  
  
  async deleteImmobilie(req, res) {
    try {
      const { id } = req.params;
      // Hier wird zusätzlich der ownerId aus dem Request-Body erwartet
      
      const response = await immobilienService.deleteImmobilie(id);
      res.json(response);
    } catch (error) {
      console.error('Fehler beim Löschen des Listings:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ImmobilienController();
