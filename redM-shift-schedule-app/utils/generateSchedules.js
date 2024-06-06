// const moment = require('moment');
// const userModel = require('../models/userModel');
// const shiftModel = require('../models/shiftModel');
// const { createSchedule, createAssignments } = require('../models/scheduleModel');
// const db = require('../../db'); // Ensure this is imported if needed elsewhere

// const generateSchedulesForCurrentMonth = async (month, year) => {
//   try {
//     const currentMonthStartDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD');
//     const currentMonthEndDate = moment(currentMonthStartDate).endOf('month');
//     const users = await getUsers();
//     const shifts = await getShifts();
//     const currentDate = moment(currentMonthStartDate);

//     while (currentDate.isSameOrBefore(currentMonthEndDate, 'day')) {
//       const scheduleDate = currentDate.toDate();
//       const schedule = await createSchedule({ startDate: scheduleDate });

//       if (schedule) {
//         const assignments = assignShiftsToUsers(users, shifts, scheduleDate);
//         assignments.forEach(assignment => assignment.schedule_id = schedule.schedule_id);
//         await createAssignments(assignments);

//         // Print out the assignments for the current day
//         console.log(`Assignments for ${currentDate.format('dddd, YYYY-MM-DD')}:`);
//         assignments.forEach(assignment => {
//           const user = users.find(u => u.user_id === assignment.user_id);
//           const shift = shifts.find(s => s.shift_id === assignment.shift_id);
//           console.log(`User: ${user.user_name}, Shift: ${shift.shift_name}`);
//         });
//       } else {
//         console.warn(`No schedule created for ${currentDate.format('YYYY-MM-DD')}`);
//       }

//       currentDate.add(1, 'day');
//     }

//     console.log('Schedules generated and mapped for the current month');
//   } catch (error) {
//     console.error('Error generating schedules for the current month:', error);
//   }
// };

// const assignShiftsToUsers = (users, shifts, startDate) => {
//   const assignments = [];
//   const numDays = moment(startDate).daysInMonth();

//   for (let day = 0; day < numDays; day++) {
//     const currentDate = moment(startDate).add(day, 'days');

//     for (let i = 0; i < users.length; i++) {
//       const user = users[i];
//       const shift = shifts[i % shifts.length]; // Rotate through shifts

//       assignments.push({
//         schedule_id: null, // This will be set later
//         user_id: user.user_id,
//         shift_id: shift.shift_id,
//         date: currentDate.format('YYYY-MM-DD')
//       });
//     }
//   }

//   return assignments;
// };

// const getUsers = async () => {
//   try {
//     const users = await userModel.getUsers();
//     return users;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw error;
//   }
// };

// const getShifts = async () => {
//   try {
//     const shifts = await shiftModel.getShifts();
//     return shifts;
//   } catch (error) {
//     console.error('Error fetching shifts:', error);
//     throw error;
//   }
// };

// module.exports = { generateSchedulesForCurrentMonth };
