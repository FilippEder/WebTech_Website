/**
 * routes/immobilien/immobilien.routes.js
 *
 * Definiert alle REST-Endpunkte für den Immobilien-Bereich.
 */
const express = require('express');
const router = express.Router();
const immobilienController = require('../../controllers/immobilien/immobilien.controller');
const upload = require("../../config/multer-config");

const authCheck = require('../login/middleware/checkAuthentication');
router.use(authCheck);
// Endpunkt: Erstellen eines neuen Immobilienlistings
router.post('/', upload.fields([{ name: 'pictures', maxCount: 10 }]), immobilienController.createImmobilie);

// Endpunkt: Abrufen eines einzelnen Immobilienlistings anhand der real_estate_id
router.get('/detail/:id', immobilienController.getImmobilieByRealEstateId);

// Endpunkt: Abrufen aller Immobilienlistings
router.get('/', immobilienController.getAllImmobilien);

// Endpunkt: Abrufen eines einzelnen Immobilienlistings
router.get('/speziel', immobilienController.getImmobilieById);

// Endpunkt: Aktualisieren eines Immobilienlistings
router.put('/:id', upload.fields([{ name: 'pictures', maxCount: 10 }]), immobilienController.updateImmobilie);


// Endpunkt: Löschen eines Immobilienlistings
router.delete('/:id', immobilienController.deleteImmobilie);

module.exports = router;

