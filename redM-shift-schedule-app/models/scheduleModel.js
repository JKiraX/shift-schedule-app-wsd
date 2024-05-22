const db = require('../../db');

const createSchedule = async (startDate) => {
  const createScheduleQuery = `
    INSERT INTO public.schedules (schedule_date, created_at, updated_at)
    VALUES ($1, NOW(), NOW())
    RETURNING schedule_id
  `;
  try {
    const result = await db.one(createScheduleQuery, [startDate]);
    console.log('Schedule created with ID:', result.schedule_id); // Log the created schedule ID
    return result;
  } catch (error) {
    console.error('Error creating schedule:', error); // Log any errors
    throw error;
  }
};

const createAssignments = async (assignments) => {
  const values = assignments.flatMap(({ schedule_id, user_id, shift_id }) => [schedule_id, user_id, shift_id]);
  const placeholders = assignments.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(',');

  const batchQuery = `
    INSERT INTO public.schedule_assignments (schedule_id, user_id, shift_id)
    VALUES ${placeholders}
  `;

  try {
    await db.none(batchQuery, values);
    console.log('Assignments created successfully'); // Log successful assignments
  } catch (error) {
    console.error('Error creating assignments:', error); // Log any errors
    throw error;
  }
};

module.exports = { createSchedule, createAssignments };
