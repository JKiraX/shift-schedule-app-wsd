require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser'); // Add body-parser to parse JSON requests

const app = express();
const port = process.env.PORT || 3000; // Use the specified port or default to 3000

app.use(bodyParser.json()); // Use body-parser middleware

// Import the generateSchedules function
const { generateSchedules } = require('./redM-shift-schedule-app/utils/generateSchedules');

// API endpoint to generate schedules
app.post('/api/generate-schedule', async (req, res) => {
  const { month, year } = req.body; // Extract month and year from the request body

  try {
    await generateSchedules(month, year); // Call the generateSchedules function
    res.status(200).json({ message: 'Schedules generated successfully.' });
  } catch (error) {
    console.error('Error generating schedule:', error);
    res.status(500).json({ error: 'Failed to generate schedule' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
