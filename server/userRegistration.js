const db = require('./db');
const addEmployee = async (req, res) => {
  // Destructure the required fields from the request body
  const { user_name, email, password, admin } = req.body;

  // Check if any of the required fields are missing or if the admin field is undefined
  if (!user_name || !email || !password || admin === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if a user with the provided email already exists
    const existingUser = await db.query(
      "SELECT * FROM public1.users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      // If a user with the same email exists, return an error
      return res.status(400).json({ error: "User already exists" });
    }

    // Insert a new user into the database
    const result = await db.query(
      "INSERT INTO public1.users (user_name, email, password, admin) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_name, email, password, admin]
    );

    // Return the newly created user object with a 201 status code
    res.status(201).json(result.rows[0]);
  } catch (error) {
    // Log the error to the console
    console.error(error);

    // Return an error with a 500 status code
    res.status(500).json({ error: "Failed to add employee" });
  }
};

module.exports = { addEmployee };