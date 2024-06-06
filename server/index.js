const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Ensure this path is correct
const generateSchedules = require('./scheduleGenerator'); // Ensure this path is correct
const checkAndGenerateSchedules = require('./checkAndGenerateSchedules'); // Import the check and generate function

const app = express();
app.use(bodyParser.json());

app.get('/schedules', async (req, res) => {
  const { date, dates } = req.query;

  if (!date && !dates) {
    return res.status(400).json({ message: 'Date or dates parameter is required' });
  }

  let dateList = [];
  if (date) {
    dateList = [date];
  } else if (dates) {
    dateList = dates.split(',');
  }

  try {
    const schedules = await db.any(`
      SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time 
      FROM public1.schedules s
      JOIN public1.users u ON s.user_id = u.user_id
      JOIN public1.shifts sh ON s.shift_id = sh.shift_id
      WHERE s.date IN ($1:csv)
    `, [dateList]);

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkAndGenerateSchedules(); // Check and generate schedules for the current month when the server starts
});
