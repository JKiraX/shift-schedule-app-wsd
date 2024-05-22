require('dotenv').config();
const pgp = require('pg-promise')();

const db = pgp({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432, // Use the specified port or default to 5432
  database: process.env.DB_DATABASE
});

// Check if the database connection is successful
db.connect()
  .then(obj => {
    obj.done(); // success, release the connection;
    console.log('Database connection successful.');
  })
  .catch(error => {
    console.error('Error connecting to the database:', error.message);
  });

module.exports = db;
