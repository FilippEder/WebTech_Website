/**
 * models/immobilien/request.model.js
 *
 * Modell für "requests".
 */
const db = require('../../config/database/db');

class Request {
    constructor(data) {
        // Initialisiert alle Felder: request_id, listing_id, requester_id, message, status, created_at, updated_at.
        Object.assign(this, data);
    }
    
    /**
     * Fügt einen neuen Request hinzu.
     * @param {Object} data - Enthält listing_id, requester_id, message sowie optional status.
     * @returns {Object} Der neu erstellte Request.
     */
    static async create(data, user_id) {
        const queryText = `
            INSERT INTO requests (
                listing_id, requester_id, listing_type
            ) VALUES (
                         $1, $2, $3
                     ) RETURNING *`;
        const values = [
            data.listing_id,
            user_id,
            data.listing_type
        ];
        
        try {
            const result = await db.query(queryText, values);
            return new Request(result.rows[0]);
        } catch (error) {
            throw error;
        }
    }
    
    
    /**
     * Löscht einen Request.
     * @param {number} id - Die ID des zu löschenden Requests.
     * @param {number} requesterId - Die User-ID des Anfragenden (zur Überprüfung).
     * @returns {Object} Eine Bestätigungsmeldung.
     */
    static async delete(id, requesterId) {
        try {
            // Zunächst prüfen, ob der Request existiert und vom anfragenden User stammt.
            const checkQuery = `SELECT requester_id FROM requests WHERE request_id = $1`;
            const checkResult = await db.query(checkQuery, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error('Request not found');
            }
            if (checkResult.rows[0].requester_id !== requesterId) {
                throw new Error('Unauthorized deletion attempt');
            }
            const deleteQuery = `DELETE FROM requests WHERE request_id = $1`;
            await db.query(deleteQuery, [id]);
            return { message: 'Request deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Holt alle Requests für einen bestimmten Requester.
     * @param {number} requesterId - Die ID des Requesters.
     * @returns {Array} Eine Liste von Request-Objekten.
     */
    static async getAllByRequester(requesterId) {
        const queryText = 'SELECT * FROM requests WHERE requester_id = $1 ';
        try {
            const result = await db.query(queryText, [requesterId]);
            // Erstelle für jede Zeile ein neues Request-Objekt
            return result.rows.map(row => new Request(row));
        } catch (error) {
            throw error;
        }
    }
    
    
    /**
     * Holt alle Requests für einen bestimmten Eigentümer.
     * Es werden alle Immobilien (aus der Tabelle real_estate) ermittelt, die zum Eigentümer gehören,
     * und dann die Requests zurückgegeben, deren listing_id zu einer dieser Immobilien passt.
     * @param {number} ownerId - Die User-ID des Eigentümers.
     * @returns {Array} Eine Liste der zugehörigen Requests.
     */
    static async getAllForOwner(ownerId) {
        const queryText = `
            SELECT r.*
            FROM requests r
            INNER JOIN real_estate re ON r.listing_id = re.real_estate_id
            WHERE re.user_id = $1
           
        `;
        try {
            const result = await db.query(queryText, [ownerId]);
            return result.rows.map(row => new Request(row));
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Request;
