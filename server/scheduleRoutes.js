const express = require('express');
const router = express.Router();
const db = require('./db');

// GET /api/schedules
router.get('/schedules', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM public1.schedules');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /api/criteria
router.post('/criteria', async (req, res) => {
  const { user_id, day_of_week, max_shifts_per_week } = req.body;
  try {
    await db.query(
      'INSERT INTO public1.criteria (user_id, day_of_week, max_shifts_per_week) VALUES ($1, $2, $3)',
      [user_id, day_of_week, max_shifts_per_week]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error('Error inserting criteria:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/users', async (req, res) => {
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

module.exports = router;