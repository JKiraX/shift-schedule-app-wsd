// server.js
// define routes and middleware for your Express server here

//NB: Run the command node server.js to run the server
require('dotenv').config(); // Load env. variables from .env file

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the specified port or default to 3000

const pgp = require('pg-promise')();

async function connectToDatabase() {
  try {
    const db = pgp({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: 5432, // Default PostgreSQL port
        database: process.env.DB_DATABASE
    });
    return db;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw error; // Rethrow the error to propagate it to the caller
  }
}

async function startServer() {
  try {
    const db = await connectToDatabase();
    console.log('Connected to the database');
    // Define routes and middleware here...

    // Pass the database connection to the generateSchedules function
    const { generateSchedules } = require('./redM-shift-schedule-app/utils/generateSchedules.js');
    await generateSchedules(4, 2024, db); // Example: Generate schedules for April 2024

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    // Handle the error gracefully or terminate the server
  }
}

startServer();
