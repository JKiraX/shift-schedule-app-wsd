const db = require('./db'); // Make sure this path is correct

const addEmployee = async (req, res) => {
  console.log('addEmployee function called');
  console.log('Request body:', req.body);

  const { user_name, email, password, admin } = req.body;

  if (!user_name || !email || !password || admin === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log('Executing SELECT query...');
    const existingUser = await db.oneOrNone('SELECT * FROM public1.users WHERE email = $1', [email]);
    console.log('SELECT query result:', existingUser);

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    console.log('Executing INSERT query...');
    const newUser = await db.one(
      'INSERT INTO public1.users (user_name, email, password, admin) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_name, email, password, admin]
    );
    console.log('INSERT query result:', newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in addEmployee:', error);
    res.status(500).json({ error: "Failed to add employee", details: error.message });
  }
};

module.exports = {
  addEmployee
};