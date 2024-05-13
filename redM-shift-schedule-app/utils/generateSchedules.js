const moment = require('moment');

const generateSchedules = async (month, year, db) => {
  try {
    // Get the start and end dates for the given month
    const startDate = moment(`${year}-${month}-01`, 'YYYY-MM-DD').toDate();
    const endDate = moment(startDate).endOf('month').toDate();

    // Get all users
    const usersQuery = 'SELECT user_id FROM users';
    const { rows: users } = await db.query(usersQuery); // Use the database connection (db) to execute queries

    // Create a new schedule for the given month
    const createScheduleQuery = `
      INSERT INTO schedules (schedule_date, created_at, updated_at)
      VALUES ($1, NOW(), NOW())
      RETURNING schedule_id
    `;
    const { rows: [{ schedule_id: scheduleId }] } = await db.query(createScheduleQuery, [startDate]); // Use db.query to execute queries

    // Loop through each user
    for (const { user_id: userId } of users) {
      let daysWorked = 0;
      let currentDate = new Date(startDate);

      // Loop through each date in the month
      while (currentDate <= endDate) {
        // Check if the user should work on this date
        if (daysWorked < 3 || (daysWorked >= 5 && daysWorked < 7)) {
          // Get the shift ID for the current date
          const shiftId = await getShiftId(currentDate, db); // Pass db to the helper function

          // Insert schedule assignment into the schedule_assignments table
          const insertAssignmentQuery = `
            INSERT INTO schedule_assignments (schedule_id, user_id, shift_id)
            VALUES ($1, $2, $3)
          `;
          await db.query(insertAssignmentQuery, [scheduleId, userId, shiftId]); // Use db.query to execute queries

          daysWorked++;
        } else {
          daysWorked = 0;
        }

        currentDate = moment(currentDate).add(1, 'days').toDate();
      }
    }
  } catch (error) {
    console.error('Error generating schedules:', error);
  }
};

// Helper function to get the shift ID for a given date
const getShiftId = async (date, db) => { // Add db as an argument
  // Implement your logic to map the date to a shift ID based on the shifts table
  // For example, you could query the shifts table to find the shift that matches the time range
  // and return the corresponding shift_id
  const shiftQuery = `
    SELECT shift_id
    FROM shifts
    WHERE $1 BETWEEN start_time AND end_time
    ORDER BY shift_order
    LIMIT 1
  `;
  const { rows: [{ shift_id: shiftId }] } = await db.query(shiftQuery, [date]); // Use db.query to execute queries

  return shiftId || null;
};

module.exports = generateSchedules;
