const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Ensure this path is correct
const checkAndGenerateSchedules = require('./checkAndGenerateSchedules'); // Import the check and generate function
const scheduleRoutes = require('./scheduleRoutes'); // Import the schedule routes

const app = express();
app.use(bodyParser.json());

// Use the schedule routes
// app.use('/', scheduleRoutes);
// app.use('/api', scheduleRoutes);
app.get('/schedules', async (req, res) => {
  const { date } = req.query;
  console.log(`Fetching schedules for date: ${date}`); // Debug log
  try {
    const schedules = await db.any(`
      SELECT s.schedules_id, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time 
      FROM public1.schedules s
      JOIN public1.users u ON s.user_id = u.user_id
      JOIN public1.shifts sh ON s.shift_id = sh.shift_id
      WHERE s.date = $1
    `, [date]);
    console.log(`Schedules found: ${schedules.length}`); // Debug log
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules found for this date' });
    }
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/criteria', async (req, res) => {
  const { user_id, day_of_week, max_shifts_per_week } = req.body;
  try {
    const userExists = await db.oneOrNone('SELECT 1 FROM public1.users WHERE user_id = $1', [user_id]);
    if (!userExists) {
      return res.status(400).json({ message: 'User does not exist' });
    }
    await db.none(
      'INSERT INTO public1.criteria (user_id, day_of_week, max_shifts_per_week) VALUES ($1, $2, $3)',
      [user_id, day_of_week, max_shifts_per_week]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error('Error inserting criteria:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/generate-schedules', async (req, res) => {
  try {
    await generateSchedules();
    res.status(200).send('Schedules generated successfully.');
  } catch (error) {
    console.error('Error generating schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkAndGenerateSchedules(); // Check and generate schedules for the current month when the server starts
});
