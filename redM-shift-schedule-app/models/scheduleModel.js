// const db = require("../../server/db");


// const createSchedule = async ({ startDate }) => {
//   try {
//     const query = `
//       INSERT INTO public.schedules (schedule_date, created_at, updated_at)
//       VALUES ($1, NOW(), NOW())
//       RETURNING schedule_id
//     `;
//     const values = [startDate.toISOString().split('T')[0]];

//     console.log('Executing query:', query);
//     console.log('With values:', values);

//     const result = await db.query(query, values);

//     if (!result) {
//       console.error('Query result is undefined or null');
//       throw new Error('Query result is undefined or null');
//     }

//     if (!result.rows) {
//       console.error('Query result.rows is undefined');
//       throw new Error('Query result.rows is undefined');
//     }

//     if (result.rows.length === 0) {
//       console.error('Query result.rows is empty');
//       throw new Error('Query result.rows is empty');
//     }

//     const schedule = result.rows[0];
//     console.log('Returned row:', schedule);
//     return schedule;
//   } catch (error) {
//     console.error('Error creating schedule:', error);
//     throw error;
//   }
// };
// const createAssignments = async (assignments) => {
//   const values = assignments.flatMap(({ schedule_id, user_id, shift_id }) => [
//     schedule_id,
//     user_id,
//     shift_id,
//   ]);

//   const placeholders = assignments
//     .map(
//       (_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
//     )
//     .join(",");

//   const batchQuery = `
//     INSERT INTO public.schedule_assignments (schedule_id, user_id, shift_id)
//     VALUES ${placeholders}
//   `;

//   try {
//     console.log('Executing batch insert query:', batchQuery);
//     console.log('With values:', values);

//     await db.query(batchQuery, values); // Use db.query instead of db.none
//     console.log("Assignments created successfully"); // Log successful assignments
//   } catch (error) {
//     console.error("Error creating assignments:", error); // Log any errors
//     throw error;
//   }
// };

// module.exports = { createSchedule, createAssignments };
