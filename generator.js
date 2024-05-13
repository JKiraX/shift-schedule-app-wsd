// // generator.js
// const cron = require('node-cron');
// const generateSchedules = require('./redM-shift-schedule-app/utils/generateSchedules.js');

// // Schedule the task to run on the 28th of every month at midnight
// const schedulingTask = cron.schedule('0 0 28 *', async () => {
//   const currentDate = new Date();
//   const month = currentDate.getMonth() + 1; // Months are zero-based
//   const year = currentDate.getFullYear();

//   try {
//     await generateSchedules(month, year);
//     console.log('Schedules generated successfully');
//   } catch (error) {
//     console.error('Error generating schedules:', error);
//   }
// });

// // Start the scheduled task
// schedulingTask.start();