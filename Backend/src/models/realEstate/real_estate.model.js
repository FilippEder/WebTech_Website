/**
 * models/immobilien/real_estate.model.js
 *
 * Modell für "real_estate".
 */
const db = require('../../config/database/db');

class RealEstate {
    constructor(data) {
        // Initialisiert alle Felder: real_estate_id, user_id, category_name, type_name, property_name,
        // description, property_address, city_name, province_name, rental_price, rental_period,
        // advance_payment, immediate_availability, status, incoming_picture_urls, type_attributes, created_at, updated_at.
        Object.assign(this, data);
    }

    /**
 * Fügt einen neuen Immobilien-Eintrag hinzu.
 * @param {Object} data - Alle erforderlichen Felder für einen neuen Eintrag.
 * @returns {Object} Der neu erstellte Eintrag.
 */
static async create(data, user_id) {
    const queryText = `
        INSERT INTO real_estate (
            user_id, category_name, type_name, property_name,
            description, property_address, city_name, province_name,
            rental_price, rental_period, advance_payment, immediate_availability,
            status, incoming_picture_urls, type_attributes
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
        ) RETURNING *`;
    
    // Konvertiere die Arrays/Objekte in gültiges JSON
    const values = [
        user_id,
        data.category_name,
        data.type_name,
        data.property_name,
        data.description,
        data.property_address,
        data.city_name,
        data.province_name,
        data.rental_price,
        data.rental_period,
        data.advance_payment,
        data.immediate_availability,
        data.status,
        JSON.stringify(data.incoming_picture_urls),  // JSON-Stringify hier
        JSON.stringify(data.type_attributes)         // JSON-Stringify hier
    ];

    try {
        const result = await db.query(queryText, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
    
    
    /**
     * Aktualisiert einen bestehenden Immobilien-Eintrag.
     * @param {Object} data - Die zu ändernden Felder, inklusive real_estate_id.
     * @returns {Object} Das aktualisierte Immobilienlisting.
     */
    static async update(data) {
        const queryText = `
        UPDATE real_estate
        SET
            user_id = $1,
            category_name = $2,
            type_name = $3,
            property_name = $4,
            description = $5,
            property_address = $6,
            city_name = $7,
            province_name = $8,
            rental_price = $9,
            rental_period = $10,
            advance_payment = $11,
            immediate_availability = $12,
            status = $13,
            incoming_picture_urls = $14,
            type_attributes = $15,
            updated_at = CURRENT_TIMESTAMP
        WHERE real_estate_id = $16
        RETURNING *`;
        
        const values = [
            data.user_id,
            data.category_name,
            data.type_name,
            data.property_name,
            data.description,
            data.property_address,
            data.city_name,
            data.province_name,
            data.rental_price,
            data.rental_period,
            data.advance_payment,
            data.immediate_availability,
            data.status,
            JSON.stringify(data.incoming_picture_urls),
            data.type_attributes ? JSON.stringify(data.type_attributes) : JSON.stringify({}),
            data.real_estate_id  // Hier wird die ID aus dem Objekt verwendet
        ];
        
        
        try {
            const result = await db.query(queryText, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Holt ein einzelnes Immobilienlisting anhand seiner real_estate_id.
     * @param {number} id - Die real_estate_id des Listings.
     * @returns {Object} Das entsprechende Immobilienlisting.
     */
    static async getImmobilieByRealEstateId(id) {
        const queryText = `SELECT * FROM real_estate WHERE real_estate_id = $1`;
        try {
            const result = await db.query(queryText, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }


    /**
     * Löscht einen Immobilien-Eintrag.
     * @param {number} id - Die ID des zu löschenden Eintrags.
     * @param {number} ownerId - Die User-ID des Besitzers (zur Überprüfung).
     * @returns {Object} Eine Bestätigungsmeldung.
     */
    static async delete(id) {
        try {
           
            const deleteQuery = `DELETE FROM real_estate WHERE real_estate_id = $1`;
            await db.query(deleteQuery, [id]);
            return { message: 'Listing deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = RealEstate;

