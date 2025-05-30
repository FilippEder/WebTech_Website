/**
 * controllers/immobilien/request.controller.js
 *
 * Controller für Anfragen im Immobilien-Bereich.
 */
const requestService = require('../../services/immobilien/request.service');

class RequestController {
  async createRequest(req, res) {
    try {
      const user_id = req.user_id;
      const request = await requestService.createRequest(req.body, user_id);
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  async deleteRequest(req, res) {
    try {
      const { id } = req.params;
      // Falls keine Authentifizierung implementiert ist, kann requesterId hier ggf. ausgelassen oder anderweitig bestimmt werden
      const response = await requestService.deleteRequest(id);
      res.json(response);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  /**
   * Holt alle Requests für einen bestimmten Requester.
   * Erwartet: req.params.requesterId
   */
  /**
   * Holt alle Requests für einen bestimmten Requester.
   * Erwartet: req.params.requesterId
   */
  async getAllRequestsByRequester(req, res) {
    try {
      const requesterId  = req.user_id;
      const requests = await requestService.getAllRequestsByRequester(requesterId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  
  
  
  /**
   * Holt alle Requests für einen bestimmten Eigentümer.
   * Erwartet: req.params.ownerId
   */
  async getAllRequestsForOwner(req, res) {
    try {
      const user_id = req.user_id;
      const requests = await requestService.getAllRequestsForOwner(user_id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new RequestController();
