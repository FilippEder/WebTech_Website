// setup-close.js
const pool = require('../../../src/config/database/db'); // Pfad ggf. anpassen

// Diese "after"-Hook wird einmal nach allen Tests ausgeführt.
after(function() {
  console.log('Schließe die Datenbankverbindungen (Pool)...');
  return pool.end();
});

