// const express = require('express');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { Pool } = require('pg');
// require('dotenv').config();
 
// const app = express();
// const port = 3001;
 
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });
 
// app.use(bodyParser.json());
 
// // User login endpoint
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
//     if (userResult.rows.length > 0) {
//       const user = userResult.rows[0];
//       const validPassword = await bcrypt.compare(password, user.password);
//       if (validPassword) {
//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
//         res.json({ token, user: { id: user.id, username: user.username } });
//       } else {
//         res.status(401).json({ error: 'Invalid password' });
//       }
//     } else {
//       res.status(401).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
 
// // // User registration endpoint (for completeness)
// // app.post('/register', async (req, res) => {
// //   const { username, password } = req.body;
// //   try {
// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const result = await pool.query(
// //       'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
// //       [username, hashedPassword]
// //     );
// //     res.json(result.rows[0]);
// //   } catch (error) {
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });
 
// // app.listen(port, () => {
// //   console.log(`Server running on port ${port}`);
// // });
 