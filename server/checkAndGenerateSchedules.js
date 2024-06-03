// server/checkAndGenerateSchedules.js
const db = require('./db'); // Ensure this path is correct
const generateSchedules = require('./scheduleGenerator'); // Ensure this path is correct
const moment = require('moment');

async function checkAndGenerateSchedules() {
  const currentMonth = moment().format('YYYY-MM');
  try {
    const schedules = await db.any(`
      SELECT * FROM public1.schedules
      WHERE to_char(date, 'YYYY-MM') = $1
    `, [currentMonth]);

    if (schedules.length === 0) {
      console.log(`No schedules found for the current month (${currentMonth}). Generating schedules...`);
      await generateSchedules();
      console.log('Schedules generated successfully.');
    } else {
      console.log(`Schedules already exist for the current month (${currentMonth}).`);
    }
  } catch (error) {
    console.error('Error checking or generating schedules:', error);
  }
}

module.exports = checkAndGenerateSchedules;
