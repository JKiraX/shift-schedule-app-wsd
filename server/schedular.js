// server/scheduler.js
const cron = require('node-cron');
const generateSchedules = require('./scheduleGenerator'); // Import the schedule generator function

// Schedule the task to run at 00:00 (midnight) on the 1st day of every month
cron.schedule('0 0 1 * *', async () => {
  try {
    console.log('Running schedule generator for the new month...');
    await generateSchedules();
    console.log('Schedules generated successfully.');
  } catch (error) {
    console.error('Error generating schedules:', error);
  }
});

// Export the cron job for testing or other purposes
module.exports = cron;
