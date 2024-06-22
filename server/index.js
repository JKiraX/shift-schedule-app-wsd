const express = require('express');
const moment = require('moment-timezone');
const bodyParser = require('body-parser');
const db = require('./db'); // Ensure this path is correct
const generateSchedules = require('./scheduleGenerator'); // Ensure this path is correct
const checkAndGenerateSchedules = require('./checkAndGenerateSchedules'); // Import the check and generate function
const scheduleRoutes = require('./scheduleRoutes');
const employeeRoutes = require('./userRegRoutes');

const app = express();

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

app.use(bodyParser.json());

app.use('/api', employeeRoutes);

app.use('/api', scheduleRoutes);
app.use((req, res, next) => {
  console.log('No route matched for', req.method, req.url);
  next();
});

app.get('/schedules', async (req, res) => {
  const { date, dates, userId } = req.query;

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
    let schedules;
    if (userId) {
      schedules = await db.any(`
        SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public1.schedules s
        JOIN public1.users u ON s.user_id = u.user_id
        JOIN public1.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.date IN ($1:csv) AND u.user_id = $2
      `, [dateList, userId]);
    } else {
      schedules = await db.any(`
        SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public1.schedules s
        JOIN public1.users u ON s.user_id = u.user_id
        JOIN public1.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.date IN ($1:csv)
      `, [dateList]);
    }

    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await db.any(`
      SELECT user_id AS id, user_name AS name
      FROM public1.users
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
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

app.post('/api/report-leave', async (req, res) => {
  const { user_id, type_of_leave, justification, start_date, end_date } = req.body;
  const reportedAt = moment().tz('Africa/Johannesburg').format('YYYY-MM-DD HH:mm:ssZ');

  // Check if all required fields are provided
  if (!user_id || !type_of_leave || !justification || !start_date || !end_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert the leave report into the database
    const query = `
      INSERT INTO public1.reports (user_id, type_of_leave, justification, start_date, end_date, reported_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [user_id, type_of_leave, justification, start_date, end_date, reportedAt];
    const result = await db.one(query, values);

    res.status(201).json(result);
  } catch (err) {
    console.error('Error reporting leave:', err);
    res.status(500).json({ error: 'Failed to report leave' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkAndGenerateSchedules(); // Check and generate schedules for the current month when the server starts
});

