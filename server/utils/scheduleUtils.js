// // schedule generation logic 
// const { DBA, Shift } = require('../models');

// const generateSchedules = async () => {

//   const dbaCount = await DBA.count(); // get the total count of DBAs 
//   const daysInMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getDate(); // Get the number of days in the next month

//   // Constants
//   const numShiftsPerDay = 4;
//   const numDbasPerShift = 2;
//   const restPeriodDuration = 12 * 60 * 60 * 1000; // 12 hours rest period

//   // Loop through each month for the next 12 months
//   for (let month = new Date().getMonth(); month < new Date().getMonth() + 12; month++) {
    

//     // calculate the start date of the current month
//     const startDate = new Date();
//     startDate.setMonth(month);
//     startDate.setDate(1);
//     startDate.setHours(0, 0, 0, 0);

//     // Loop through each day in the current month
//     for (let day = 0; day < daysInMonth; day++) {
//         // calculate the start date of the current month
//       const date = new Date(startDate);
//       date.setDate(day + 1);

//       // Lopp through each shift of the day
//       for (let shift = 0; shift < numShiftsPerDay; shift++) {
//         // Calculating the start and end times of the shift
//         const shiftStart = new Date(date);
//         const shiftEnd = new Date(date);

//         const shiftDuration = 8; // hours
//         const shiftStartHour = shift * shiftDuration;
//         const shiftEndHour = shiftStartHour + shiftDuration;

//         shiftStart.setHours(shiftStartHour, 0, 0, 0);
//         shiftEnd.setHours(shiftEndHour, 0, 0, 0);

//         // Select employee at random
//         const dbas = [];
//         for (let i = 0; i < numDbasPerShift; i++) {
//           const dba = await DBA.findOne({
//             order: [['random()']], // Randomly select an employee
//           });
//           dbas.push(dba);
//         }

//         // assign to shift 
//         for (let dba of dbas) {
//             // create a shift record for the employee
//           await Shift.create({
//             dbaId: dba.id,
//             start: shiftStart,
//             end: shiftEnd,
//             date,
//           });

//           // Add rest period after the shift
//           const restStart = new Date(shiftEnd);
//           restStart.setHours(shiftEndHour + 1); // Add 1 hour after the shift
//           const restEnd = new Date(restStart);
//           restEnd.setHours(restStart.getHours() + restPeriodDuration / (60 * 60 * 1000));

//           // create a shift record for the rest period
//           await Shift.create({
//             dbaId: dba.id,
//             start: restStart,
//             end: restEnd,
//             date,
//           });
//         }
//       }
//     }
//   }
// };

// module.exports = { generateSchedules };