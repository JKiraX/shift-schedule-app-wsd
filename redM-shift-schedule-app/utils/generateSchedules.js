const moment = require('moment');
const userModel = require('../models/userModel');
const shiftModel = require('../models/shiftModel');
const scheduleModel = require('../models/scheduleModel');

const generateSchedules = async (month, year) => {
  try {
    // Validation
    if (!month || !year || month < 1 || month > 12 || year < 1900 || year > 2100) {
      throw new Error('Invalid month or year provided.');
    }

    const users = await userModel.getUsers();
    if (!users || users.length === 0) {
      throw new Error('No users found in the database.');
    }

    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    const schedule = await scheduleModel.createSchedule(startDate);

    const shifts = await shiftModel.getShifts();
    console.log('Shifts fetched from database:', shifts); // Log the fetched shifts

    if (!Array.isArray(shifts)) {
      throw new Error('Shifts data is not an array');
    }

    await assignShiftsToUsers(users, shifts, schedule, startDate, endDate);

    console.log('Schedules generated successfully.');
  } catch (error) {
    console.error('Error generating schedules:', error);
    throw error;
  }
};

const assignShiftsToUsers = async (users, shifts, schedule, startDate, endDate) => {
  const assignments = [];

  for (const user of users) {
    let daysWorked = 0;
    let consecutiveDays = 0;
    let currentDate = new Date(startDate);
    let lastShiftId = null;
    const assignedShiftsThisWeek = new Set();

    while (currentDate <= endDate) {
      let shiftId = null;
      for (const shift of shifts) {
        if (consecutiveDays < 3 && daysWorked < 5 && !assignedShiftsThisWeek.has(shift.shift_id)) {
          if (lastShiftId !== shift.shift_id) {
            shiftId = shift.shift_id;
            break;
          }
        }
      }

      if (shiftId) {
        assignments.push({ schedule_id: schedule.schedule_id, user_id: user.user_id, shift_id: shiftId });
        daysWorked++;
        consecutiveDays++;
        lastShiftId = shiftId;
        assignedShiftsThisWeek.add(shiftId);
      } else {
        consecutiveDays = 0;
        console.warn(`No shift assigned for user ${user.user_id} on date: ${currentDate}`);
      }

      if (consecutiveDays >= 3 || daysWorked >= 5) {
        consecutiveDays = 0;
        lastShiftId = null;
      }

      currentDate = moment(currentDate).add(1, 'days').toDate();
    }
  }

  await scheduleModel.createAssignments(assignments);
};

module.exports = { generateSchedules };
