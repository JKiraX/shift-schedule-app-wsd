const db = require('./db');
const moment = require('moment');

async function generateSchedules() {
  console.log('Generating schedules...'); // Log start
  const users = await db.any('SELECT user_id FROM public1.users');
  const shifts = await db.any('SELECT shift_id, name FROM public1.shifts');
  const currentMonth = moment().month();  // Get current month (0-11)
  const currentYear = moment().year();    // Get current year (e.g., 2024)
  const daysInMonth = moment().daysInMonth(); // Get the number of days in the current month
  const schedules = [];

  const shiftsByName = shifts.reduce((map, shift) => {
    map[shift.name] = shift.shift_id;
    return map;
  }, {});

  for (let day = 1; day <= daysInMonth; day++) {
    const date = moment().year(currentYear).month(currentMonth).date(day).format('YYYY-MM-DD');
    const dayOfWeek = moment(date).day(); // Sunday: 0, Monday: 1, ..., Saturday: 6

    // Rotate through users
    let userIndex = day % users.length;

    for (const shift of shifts) {
      let assigned = false;

      // Check users for this shift
      for (let i = 0; i < users.length; i++) {
        const user = users[(userIndex + i) % users.length];

        // Get user schedules for this week
        const userSchedules = schedules.filter(s => s.user_id === user.user_id && moment(s.date).week() === moment(date).week());
        const workDays = userSchedules.length;
        const consecutiveWorkDays = userSchedules.reduce((acc, curr, idx, arr) => {
          if (idx === 0) return 1;
          const prev = arr[idx - 1];
          return moment(curr.date).diff(moment(prev.date), 'days') === 1 ? acc + 1 : 1;
        }, 1);

        const lastShift = userSchedules.length ? userSchedules[userSchedules.length - 1].shift_id : null;
        const lastShiftName = lastShift ? shifts.find(s => s.shift_id === lastShift).name : null;

        // Check if the user is already assigned to a shift on this date
        if (schedules.some(s => s.user_id === user.user_id && s.date === date)) {
          continue;
        }

        // Skip if the user cannot work this shift due to rest criteria
        if (
          (consecutiveWorkDays >= 3) ||
          (workDays >= 5) ||
          (lastShiftName && !canWorkNextShift(lastShiftName, shift.name))
        ) {
          continue;
        }

        // Assign the user to the shift
        schedules.push({
          user_id: user.user_id,
          shift_id: shift.shift_id,
          date,
        });

        assigned = true;
        break;
      }

      // If no user assigned to this shift, find the next available user and force assign
      if (!assigned) {
        for (let i = 0; i < users.length; i++) {
          const user = users[(userIndex + i) % users.length];
          // Ensure the user is not already assigned to a shift on this date
          if (!schedules.some(s => s.user_id === user.user_id && s.date === date)) {
            schedules.push({
              user_id: user.user_id,
              shift_id: shift.shift_id,
              date,
            });
            break;
          }
        }
      }

      userIndex = (userIndex + 1) % users.length;
    }
  }

  // Ensure everyone works 5 days in a week within the current month
  for (const user of users) {
    for (let weekStart = 0; weekStart < daysInMonth; weekStart += 7) {
      let workDays = schedules.filter(s => s.user_id === user.user_id && moment(s.date).month() === currentMonth && moment(s.date).year() === currentYear).length;

      while (workDays < 5) {
        const date = moment().year(currentYear).month(currentMonth).startOf('month').add(weekStart, 'days').add(workDays, 'days').format('YYYY-MM-DD');
        if (!schedules.find(s => s.user_id === user.user_id && s.date === date)) {
          schedules.push({
            user_id: user.user_id,
            shift_id: shiftsByName['8am-4pm'],
            date,
          });
          workDays++;
        }
      }
    }
  }
  console.log('Schedules to be inserted:', schedules); // Log schedules
  await db.tx(t => {
    const queries = [
      t.none('TRUNCATE TABLE public1.schedules'),
      ...schedules.map(schedule =>
        t.none(
          'INSERT INTO public1.schedules (user_id, shift_id, date) VALUES ($1, $2, $3)',
          [schedule.user_id, schedule.shift_id, schedule.date]
        )
      )
    ];
    return t.batch(queries);
  }).then(() => {
    console.log('Schedules generated and inserted successfully.'); // Log success
  }).catch(error => {
    console.error('Error inserting schedules:', error); // Log error
  });
}

// Function to check if a user can work the next shift considering rest periods
function canWorkNextShift(currentShift, nextShift) {
  const incompatibleShifts = {
    '2pm-10pm': ['6am-2pm', '8am-4pm'],
    '10pm-6am': ['6am-2pm', '8am-4pm', '2pm-10pm'],
  };

  return !incompatibleShifts[currentShift] || !incompatibleShifts[currentShift].includes(nextShift);
}

module.exports = generateSchedules;
