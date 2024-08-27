// const express = require('express');
// const router = express.Router();
// const db = require('./db');

// // GET /api/schedules
// router.get('/schedules', async (req, res) => {
//   const { date, dates, userId } = req.query;

//   if (!date && !dates) {
//     return res.status(400).json({ message: 'Date or dates parameter is required' });
//   }

//   let dateList = [];
//   if (date) {
//     dateList = [date];
//   } else if (dates) {
//     dateList = dates.split(',');
//   }

//   try {
//     let schedules;
//     if (userId) {
//       schedules = await db.any(`
//         SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
//         FROM public1.schedules s
//         JOIN public1.users u ON s.user_id = u.user_id
//         JOIN public1.shifts sh ON s.shift_id = sh.shift_id
//         WHERE s.date IN ($1:csv) AND u.user_id = $2
//       `, [dateList, userId]);
//     } else {
//       schedules = await db.any(`
//         SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
//         FROM public1.schedules s
//         JOIN public1.users u ON s.user_id = u.user_id
//         JOIN public1.shifts sh ON s.shift_id = sh.shift_id
//         WHERE s.date IN ($1:csv)
//       `, [dateList]);
//     }

//     res.json(schedules);
//   } catch (error) {
//     console.error('Error fetching schedules:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });
// // POST /api/criteria
// router.post('/criteria', async (req, res) => {
//   const { user_id, day_of_week, max_shifts_per_week } = req.body;
//   try {
//     await db.query(
//       'INSERT INTO public1.criteria (user_id, day_of_week, max_shifts_per_week) VALUES ($1, $2, $3)',
//       [user_id, day_of_week, max_shifts_per_week]
//     );
//     res.sendStatus(201);
//   } catch (error) {
//     console.error('Error inserting criteria:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// router.get('/users', async (req, res) => {
//   try {
//     const users = await db.any(`
//       SELECT user_id AS id, user_name AS name
//       FROM public1.users
//     `);
//     res.json(users);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// router.post('/report-leave', async (req, res) => {
//   const { user_id, type_of_leave, justification, start_date, end_date } = req.body;

//   if (!user_id || !type_of_leave || !justification || !start_date || !end_date) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     await db.none(
//       'INSERT INTO public1.reports (user_id, type_of_leave, justification, start_date, end_date) VALUES ($1, $2, $3, $4, $5)',
//       [user_id, type_of_leave, justification, start_date, end_date]
//     );
//     res.status(201).json({ message: 'Leave reported successfully.' });
//   } catch (error) {
//     console.error('Error reporting leave:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// module.exports = router;