// real-estate-section-models/listing.model.js

const db = require('../../config/database/db'); // Datenbankverbindung

class Listing {
  constructor(data) {
    Object.assign(this, data);
  }

  // Erstellt ein neues Listing
  static async create(data) {
    const queryText = `
      INSERT INTO listings (user_id, is_visual, title, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [data.user_id, data.is_visual, data.title, data.description];
    try {
      const result = await db.query(queryText, values);
      return new Listing(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Holt ein Listing nach ID
  static async getById(id) {
    const queryText = 'SELECT * FROM listings WHERE listing_id = $1;';
    try {
      const result = await db.query(queryText, [id]);
      if (result.rows.length === 0) {
        throw new Error('Listing not found');
      }
      return new Listing(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Holt alle Listings
  static async getAll() {
    const queryText = 'SELECT * FROM listings ORDER BY created_at DESC;';
    try {
      const result = await db.query(queryText);
      return result.rows.map(row => new Listing(row));
    } catch (error) {
      throw error;
    }
  }

  // Aktualisiert ein Listing
  static async update(id, data) {
    const queryText = `
      UPDATE listings
      SET user_id = $1, is_visual = $2, title = $3, description = $4, updated_at = CURRENT_TIMESTAMP
      WHERE listing_id = $5
      RETURNING *;
    `;
    const values = [data.user_id, data.is_visual, data.title, data.description, id];
    try {
      const result = await db.query(queryText, values);
      if (result.rows.length === 0) {
        throw new Error('Listing not found');
      }
      return new Listing(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }

  // Löscht ein Listing
  static async delete(id) {
    const queryText = 'DELETE FROM listings WHERE listing_id = $1 RETURNING *;';
    try {
      const result = await db.query(queryText, [id]);
      if (result.rows.length === 0) {
        throw new Error('Listing not found');
      }
      return new Listing(result.rows[0]);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Listing;

