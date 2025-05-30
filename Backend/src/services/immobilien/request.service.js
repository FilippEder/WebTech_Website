/**
 * services/immobilien/request.service.js
 *
 * Service für Request-bezogene Operationen.
 */
const Request = require('../../models/realEstate/request.model');

class RequestService {
  /**
   * Erstellt einen neuen Request.
   * @param {Object} data - Enthält listing_id, requester_id, message und optional status.
   * @returns {Object} Der neu erstellte Request.
   */
  async createRequest(data, user_id) {
    try {
      return await Request.create(data, user_id);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Löscht einen Request, sofern der anfragende User (requester) berechtigt ist.
   * @param {number} id - Die ID des Requests.
   * @param {number} requesterId - Die User-ID des Anfragenden.
   * @returns {Object} Eine Bestätigungsmeldung.
   */
  async deleteRequest(id, requesterId) {
    try {
      return await Request.delete(id, requesterId);
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Holt alle Requests für einen bestimmten Requester.
   * @param {number} requesterId - Die ID des Requesters.
   * @returns {Array} Eine Liste von Request-Objekten.
   */
  async getAllRequestsByRequester(requesterId) {
    try {
      return Request.getAllByRequester(requesterId);
    } catch (error) {
      throw error;
    }
  }
  
  
  /**
   * Holt alle Requests für einen bestimmten Eigentümer.
   * @param {number} ownerId - Die User-ID des Eigentümers.
   * @returns {Array} Eine Liste der zugehörigen Requests.
   */
  async getAllRequestsForOwner(ownerId) {
    try {
      return Request.getAllForOwner(ownerId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RequestService();
