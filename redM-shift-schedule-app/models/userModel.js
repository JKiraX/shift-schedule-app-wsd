const db = require('../../db');

const getUsers = async () => {
  try {
    const query = 'SELECT user_id FROM public.users';
    const result = await db.any(query);
    console.log('Users fetched from database:', result); // Log the fetched users
    return result;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

module.exports = { getUsers };
