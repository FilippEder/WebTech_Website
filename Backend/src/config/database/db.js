// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'marketplace_db',
    password: 'oY638fHYJRkmQ93bm',
    port: 5432,
});

module.exports = pool;