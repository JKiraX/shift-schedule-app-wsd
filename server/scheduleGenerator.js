// server/scheduleGenerator.js
const db = require('./db');
const moment = require('moment');

async function generateSchedules() {
  const users = await db.any('SELECT user_id FROM users');
  const shifts = await db.any('SELECT shift_id FROM shifts');
  const daysInMonth = moment().daysInMonth();
  const schedules = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment().date(day).format('YYYY-MM-DD');
    let userIndex = (day - 1) % users.length; // Rotate users

    for (const shift of shifts) {
      const user = users[userIndex];
      schedules.push({
        user_id: user.user_id,
        shift_id: shift.shift_id,
        date,
      });

      userIndex = (userIndex + 1) % users.length; // Move to the next user
    }
  }

  for (let i = 0; i < users.length; i++) {
    let userIndex = i;
    let workDays = 0;
    let consecutiveWorkDays = 0;
    let restDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment().date(day).format('YYYY-MM-DD');
      const dayOfWeek = moment().date(day).day(); // Sunday: 0, Monday: 1, ..., Saturday: 6

      // Check if user should rest
      if (consecutiveWorkDays === 3) {
        restDays++;
        consecutiveWorkDays = 0;
        continue;
      }

      // Ensure user works exactly 5 days and rests 2 days within a week
      if (workDays === 5 && restDays < 2) {
        restDays++;
        consecutiveWorkDays = 0;
        continue;
      }

      // Ensure rest days are not consecutive
      if (restDays === 2) {
        restDays = 0;
        workDays = 0;
      }

      const shift = shifts[(day + userIndex) % shifts.length];
      schedules.push({
        user_id: users[userIndex].user_id,
        shift_id: shift.shift_id,
        date,
      });

      consecutiveWorkDays++;
      workDays++;
    }
  }

  await db.tx(t => {
    const queries = [
      t.none('TRUNCATE TABLE schedules'),
      ...schedules.map(schedule =>
        t.none(
          'INSERT INTO schedules (user_id, shift_id, date) VALUES ($1, $2, $3)',
          [schedule.user_id, schedule.shift_id, schedule.date]
        )
      )
    ];
    return t.batch(queries);
  });
}


module.exports = generateSchedules;
