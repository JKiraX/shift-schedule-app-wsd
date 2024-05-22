// require('dotenv').config(); // Ensure this is at the top
// const { Pool } = require('pg');
// const { generateSchedules, getShiftId } = require('./redM-shift-schedule-app/utils/generateSchedules');

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// async function testDatabaseConnection() {
//   try {
//     const client = await pool.connect();
//     console.log('Database connection established successfully.');
//     client.release();
//   } catch (error) {
//     console.error('Error establishing database connection:', error);
//   }
// }

// async function testGenerateSchedules() {
//   try {
//     await testDatabaseConnection();

//     const month = 5;
//     const year = 2024;
//     await generateSchedules(month, year, pool);

//     // Since getShiftId requires specific arguments, adjust the testing accordingly
//     // Example, you need to pass shiftIds, consecutiveDays, daysWorked, assignedShiftsThisWeek, lastShiftId
//     // This is just a placeholder; adjust according to your actual test data
//     const shiftIds = [{ shift_id: 1 }, { shift_id: 2 }, { shift_id: 3 }];
//     const consecutiveDays = 2;
//     const daysWorked = 3;
//     const assignedShiftsThisWeek = new Set([1]);
//     const lastShiftId = 2;

//     const shiftId = getShiftId(shiftIds, consecutiveDays, daysWorked, assignedShiftsThisWeek, lastShiftId);
//     console.log(`Shift ID: ${shiftId}`);

//     console.log('Tests completed successfully!');
//   } catch (error) {
//     console.error('Error during testing:', error);
//   } finally {
//     await pool.end();
//   }
// }

// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '****' : 'Not set');
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_DATABASE:', process.env.DB_DATABASE);

// testGenerateSchedules();
