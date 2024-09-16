require('dotenv').config();
const pgp = require('pg-promise')();

const db = pgp({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432, 
  database: process.env.DB_DATABASE
});

db.connect()
  .then(obj => {
    obj.done(); 
   
  })
  .catch(error => {
    console.error('Error connecting to the database:', error.message);
  });


module.exports = db;
