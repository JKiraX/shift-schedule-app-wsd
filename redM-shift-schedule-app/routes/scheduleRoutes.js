const express = require('express');
const router = express.Router();

// GET /schedules
router.get('/schedules', async (req, res) => {
  const result = await db.query('SELECT * FROM public1.schedules');
  res.json(result.rows);
});

// POST /criteria
router.post('/criteria', async (req, res) => {
  const { user_id, day_of_week, max_shifts_per_week } = req.body;
  await db.query(
    'INSERT INTO public1.criteria (user_id, day_of_week, max_shifts_per_week) VALUES ($1, $2, $3)',
    [user_id, day_of_week, max_shifts_per_week]
  );
  res.sendStatus(201);
});

module.exports = router;