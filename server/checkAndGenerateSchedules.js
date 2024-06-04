// server/checkAndGenerateSchedules.js
const db = require('./db'); // Ensure this path is correct
const generateSchedules = require('./scheduleGenerator'); // Ensure this path is correct
const moment = require('moment');

async function checkAndGenerateSchedules() {
  const currentMonth = moment().format('YYYY-MM');
  const nextMonth = moment().add(1, 'months').format('YYYY-MM');

  try {
    const currentMonthSchedules = await db.any(`
      SELECT * FROM public1.schedules
      WHERE to_char(date, 'YYYY-MM') = $1
    `, [currentMonth]);

    const nextMonthSchedules = await db.any(`
      SELECT * FROM public1.schedules
      WHERE to_char(date, 'YYYY-MM') = $1
    `, [nextMonth]);

    if (currentMonthSchedules.length === 0) {
      console.log(`No schedules found for the current month (${currentMonth}). Generating schedules...`);
      await generateSchedules();
      console.log('Schedules generated successfully.');
    } else if (nextMonthSchedules.length === 0) {
      console.log(`No schedules found for the next month (${nextMonth}). Generating schedules for the next month...`);
      await generateSchedules();
      console.log('Schedules for the next month generated successfully.');
    } else {
      console.log(`Schedules already exist for the current month (${currentMonth}) and the next month (${nextMonth}).`);
    }
  } catch (error) {
    console.error('Error checking or generating schedules:', error);
  }
}

module.exports = checkAndGenerateSchedules;