/**
 * services/immobilien/immobilien.service.js
 *
 * Service für Immobilien-bezogene Operationen.
 */
const db = require('../../config/database/db');
const RealEstate = require('../../models/realEstate/real_estate.model');

class ImmobilienService {
  /**
   * Erstellt ein neues Immobilienlisting.
   * @param {Object} data - Enthält alle erforderlichen Felder für das Listing.
   * @returns {Object} Das neu erstellte Immobilienlisting.
   */
  async createImmobilie(data, user_id) {
    try {
      return await RealEstate.create(data, user_id);
    } catch (error) {
      throw error;
    }
  }
  
  async getAllImmobilienByCriteria(criteria) {
    let queryText = 'SELECT * FROM real_estate';
    let queryParams = [];
    let conditions = [];
    let paramIndex = 1;
    
    if (criteria.searchText) {
      conditions.push(`(LOWER(property_name) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex + 1}))`);
      queryParams.push(`%${criteria.searchText}%`);
      queryParams.push(`%${criteria.searchText}%`);
      paramIndex += 2;
    }
    if (criteria.type) {
      conditions.push(`type_name = $${paramIndex}`);
      queryParams.push(criteria.type);
      paramIndex++;
    }
    if (criteria.priceMin != null) {
      conditions.push(`rental_price >= $${paramIndex}`);
      queryParams.push(criteria.priceMin);
      paramIndex++;
    }
    if (criteria.priceMax != null) {
      conditions.push(`rental_price <= $${paramIndex}`);
      queryParams.push(criteria.priceMax);
      paramIndex++;
    }
    if (criteria.rentalPeriod != null) {
      conditions.push(`rental_period = $${paramIndex}`);
      queryParams.push(criteria.rentalPeriod);
      paramIndex++;
    }
    if (criteria.province) {
      conditions.push(`province_name = $${paramIndex}`);
      queryParams.push(criteria.province);
      paramIndex++;
    }
    if (criteria.city) {
      conditions.push(`city_name = $${paramIndex}`);
      queryParams.push(criteria.city);
      paramIndex++;
    }
    if (criteria.immediateAvailability !== undefined && criteria.immediateAvailability !== '') {
      conditions.push(`immediate_availability = $${paramIndex}`);
      queryParams.push(criteria.immediateAvailability);
      paramIndex++;
    }
    
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }
    queryText += ' ORDER BY created_at DESC';
    
    try {
      const result = await db.query(queryText, queryParams);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  
  
  /**
   * Holt ein einzelnes Immobilienlisting anhand seiner ID.
   * @param {number} id - Die ID des Listings.
   * @returns {Object} Das entsprechende Immobilienlisting.
   */
  async getImmobilieById(id) {
    const queryText = `SELECT * FROM real_estate WHERE user_id = $1`;
    try {
      const result = await db.query(queryText, [id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Aktualisiert ein bestehendes Immobilienlisting.
   * @param {number} id - Die ID des Listings.
   * @param {Object} data - Die zu ändernden Felder.
   * @returns {Object} Das aktualisierte Immobilienlisting.
   */
  async updateImmobilie( data) {
    try {
      return await RealEstate.update(data);
    } catch (error) {
      throw error;
    }
  }
  /**
   * Holt ein einzelnes Immobilienlisting anhand der real_estate_id.
   * @param {number} id - Die real_estate_id des Listings.
   * @returns {Object} Das entsprechende Immobilienlisting.
   */
  async getImmobilieByRealEstateId(id) {
    try {
      return await RealEstate.getImmobilieByRealEstateId(id);
    } catch (error) {
      throw error;
    }
  }
  
  
  /**
   * Löscht ein Immobilienlisting, sofern der anfragende User (owner) dazu berechtigt ist.
   * @param {number} id - Die ID des Listings.
   * @param {number} ownerId - Die User-ID des Besitzers.
   * @returns {Object} Eine Bestätigungsmeldung.
   */
  async deleteImmobilie(id) {
    try {
      return await RealEstate.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ImmobilienService();

