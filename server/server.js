// server.js
// define routes and middleware for your Express server here

//NB: Run the command node server.js to run the server
require('dotenv').config(); // Load env. variables from .env file

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the specified port or default to 3000

const pgp = require('pg-promise')();
const db = pgp({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432, // Default PostgreSQL port
    database: process.env.DB_DATABASE
});

// Define routes and middleware here...

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
