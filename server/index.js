
const express = require("express");
const moment = require("moment-timezone");
const bodyParser = require("body-parser");
const db = require("./db");
const generateSchedules = require("./scheduleGenerator");
const checkAndGenerateSchedules = require("./checkAndGenerateSchedules");
const scheduleRoutes = require("./scheduleRoutes");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Define the rate limit rule
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

app.use(limiter);
app.use(bodyParser.json());
const SECRET_KEY = "your_secret_key";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", scheduleRoutes);

app.use('/api', scheduleRoutes);

app.get("/users", async (req, res) => {
  try {
    const users = await db.any(`
      SELECT user_id, user_name
      FROM public1.users
      WHERE admin = 1
      ORDER BY user_name
    `);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res, next) => {
  console.log('No route matched for', req.method, req.url);
  next();
});

app.get('/schedules', async (req, res) => {

  const { date, dates, userId } = req.query;

  if (!date && !dates) {
    return res
      .status(400)
      .json({ message: "Date or dates parameter is required" });
  }

  let dateList = [];
  if (date) {
    dateList = [date];
  } else if (dates) {
    dateList = dates.split(",");
  }

  try {
    let schedules;
    if (userId) {
      schedules = await db.any(
        `
        SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public1.schedules s
        JOIN public1.users u ON s.user_id = u.user_id
        JOIN public1.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.date IN ($1:csv) AND u.user_id = $2
      `,
        [dateList, userId]
      );
    } else {
      schedules = await db.any(
        `
        SELECT s.date, u.user_name AS user_name, sh.name AS shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public1.schedules s
        JOIN public1.users u ON s.user_id = u.user_id
        JOIN public1.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.date IN ($1:csv)
      `,
        [dateList]
      );
    }

    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await db.any(`
      SELECT user_id, user_name
      FROM public1.users
      WHERE admin = 1
      ORDER BY user_name
    `);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/schedules/id", async (req, res) => {
  const { date, shift_id } = req.query;

  if (!date || !shift_id) {
    return res.status(400).json({ error: "Both date and shift_id are required" });
  }

  try {
    const schedule = await db.oneOrNone(
      `
      SELECT schedules_id
      FROM public1.schedules
      WHERE date = $1 AND shift_id = $2
    `,
      [date, shift_id]
    );

    if (!schedule) {
      return res.status(404).json({ error: "No matching schedule found" });
    }

    res.json({ schedules_id: schedule.schedules_id });
  } catch (error) {
    console.error("Error fetching schedule_id:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/criteria", async (req, res) => {
  const { user_id, day_of_week, max_shifts_per_week } = req.body;
  try {
    const userExists = await db.oneOrNone(
      "SELECT 1 FROM public1.users WHERE user_id = $1",
      [user_id]
    );
    if (!userExists) {
      return res.status(400).json({ message: "User does not exist" });
    }
    await db.none(
      "INSERT INTO public1.criteria (user_id, day_of_week, max_shifts_per_week) VALUES ($1, $2, $3)",
      [user_id, day_of_week, max_shifts_per_week]
    );
    res.sendStatus(201);
  } catch (error) {
    console.error("Error inserting criteria:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/generate-schedules", async (req, res) => {
  try {
    await generateSchedules();
    res.status(200).send("Schedules generated successfully.");
  } catch (error) {
    console.error("Error generating schedules:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/report-leave", async (req, res) => {
  const { user_id, type_of_leave, justification, start_date, end_date } =
    req.body;
  const reportedAt = moment()
    .tz("Africa/Johannesburg")
    .format("YYYY-MM-DD HH:mm:ssZ");

  if (
    !user_id ||
    !type_of_leave ||
    !justification ||
    !start_date ||
    !end_date
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const query = `
      INSERT INTO public1.reports (user_id, type_of_leave, justification, start_date, end_date, reported_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [
      user_id,
      type_of_leave,
      justification,
      start_date,
      end_date,
      reportedAt,
    ];
    const result = await db.one(query, values);

    res.status(201).json(result);
  } catch (err) {
    console.error("Error reporting leave:", err);
    res.status(500).json({ error: "Failed to report leave" });
  }
});

app.put('/api/schedules/switch', async (req, res) => {
  const { date, shift_id, user_id } = req.body;
  
  console.log('Received switch request:', { date, shift_id, user_id });

  if (!date || !shift_id || !user_id) {
    return res.status(400).json({ error: "All fields (date, shift_id, user_id) are required" });
  }

  try {
    const parsedDate = date.split('-').slice(0, 3).join('-');
    const parsedShiftId = parseInt(shift_id, 10);

    console.log('Parsed data:', { parsedDate, parsedShiftId, user_id });

    // Check if the shift_id is valid
    const validShift = await db.oneOrNone('SELECT * FROM public1.shifts WHERE shift_id = $1', [parsedShiftId]);
    if (!validShift) {
      return res.status(400).json({ error: 'Invalid shift_id. This shift does not exist.' });
    }

    // Find the schedule
    const schedule = await db.oneOrNone(
      'SELECT * FROM public1.schedules WHERE date = $1 AND shift_id = $2',
      [parsedDate, parsedShiftId]
    );

    console.log('Schedule check result:', schedule);

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found for the given date and shift.' });
    }

    // Update the schedule
    const updatedSchedule = await db.one(
      'UPDATE public1.schedules SET user_id = $1 WHERE date = $2 AND shift_id = $3 RETURNING *',
      [user_id, parsedDate, parsedShiftId]
    );

    console.log('Updated schedule:', updatedSchedule);

    // Get the user name
    const userResult = await db.one('SELECT user_name FROM public1.users WHERE user_id = $1', [user_id]);
    
    const response = { ...updatedSchedule, user_name: userResult.user_name };
    console.log('Sending response:', response);

    res.json(response);
  } catch (error) {
    console.error('Error switching schedule:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.oneOrNone(
      "SELECT * FROM public1.users WHERE email = $1",
      [email]
    );
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.user_id }, SECRET_KEY, {
        expiresIn: "1h",
      });
      res.json({ token, user });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  checkAndGenerateSchedules();
});

