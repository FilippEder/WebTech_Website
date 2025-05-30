const express = require('express');
const router = express.Router();
const requestController = require('../../controllers/immobilien/request.controller');

const authCheck = require('../login/middleware/checkAuthentication');
router.use(authCheck);

// Neuen Endpunkt hinzufügen: Alle Requests für einen bestimmten Requester abrufen
router.get('/requester', requestController.getAllRequestsByRequester);

// Bestehende Endpunkte:
router.get('/owner', requestController.getAllRequestsForOwner);
router.post('/', requestController.createRequest);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
