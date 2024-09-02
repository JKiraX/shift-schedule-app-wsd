const express = require("express");
const moment = require("moment-timezone");
const bodyParser = require("body-parser");
const db = require("./db"); // Assuming `db` is your pg-promise instance
// const rateLimit = require("express-rate-limit");
const sanitizeInput = require("express-sanitizer");
const cors = require("cors");
const app = express();

// // Define the rate limit rule
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });

app.use(cors());
// app.use(limiter);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  console.log("Sanitized Request headers:", req.headers);
  console.log("Sanitized Request body:", req.body);
  console.log("Sanitized Request query:", req.query);
  next();
});

// GET users route
app.get("/users", async (req, res) => {
  try {
    console.log("Fetching users...");
    const users = await db.any(`
        SELECT u."Id" AS user_id, u."firstName" AS first_name, u."lastName" AS last_name
        FROM public.appuser u
        JOIN public.identityuserrole iur ON u."Id" = iur."UserId"
        WHERE iur."RoleId" = 2
        ORDER BY u."firstName";

    `);
    console.log("Fetched users:", users);
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// GET schedules route
app.get("/schedules", async (req, res) => {
  const { date, dates, userId } = req.query;

  console.log("Received request with params:", { date, dates, userId });

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

  console.log("Date list:", dateList);

  try {
    let schedules;
    let query;
    let params;

    if (userId) {
      query = `
        SELECT s.work_date, u."firstName" AS first_name, u."lastName" AS last_name, sh.shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public.schedules s
        JOIN public.appuser u ON s.user_id = u."Id"
        JOIN public.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.work_date IN ($1:csv) AND s.user_id = $2
        ORDER BY s.work_date ASC, sh.start_time ASC
      `;
      params = [dateList, userId];
    } else {
      query = `
        SELECT s.work_date, u."firstName" AS first_name, u."lastName" AS last_name, sh.shift_name, sh.start_time, sh.end_time, s.user_id
        FROM public.schedules s
        JOIN public.appuser u ON s.user_id = u."Id"
        JOIN public.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.work_date IN ($1:csv)
        ORDER BY s.work_date ASC, sh.start_time ASC
      `;
      params = [dateList];
    }

    console.log("Executing query:", query);
    console.log("With parameters:", params);

    schedules = await db.any(query, params);

    console.log("Fetched schedules:", schedules);

    if (schedules.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No schedules found for the given date(s)",
      });
    }

    // Map data to align with ShiftCard props
    const formattedSchedules = schedules.map((schedule) => ({
      shift_name: schedule.shift_name,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      assigned_users: `${schedule.first_name} ${schedule.last_name}`,
    }));

    res.json({ success: true, data: formattedSchedules });
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// POST report leave route
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
    const result = await db.one(
      `
      INSERT INTO public.report_leave (user_id, type_of_leave, justification_message, start_date, end_date, reported_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `,
      [user_id, type_of_leave, justification, start_date, end_date, reportedAt]
    );

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error("Error reporting leave:", err);
    res.status(500).json({ error: "Failed to report leave" });
  }
});

// PUT switch schedule route
app.put("/api/schedules/switch", async (req, res) => {
  const { work_date, shift_id, current_user_id, new_user_id } = req.body;

  if (!work_date || !shift_id || !current_user_id || !new_user_id) {
    return res
      .status(400)
      .json({
        error:
          "All fields (work_date, shift_id, current_user_id, new_user_id) are required",
      });
  }

  try {
    // Check if the shift exists
    const validShift = await db.oneOrNone(
      `
      SELECT * FROM public.schedules WHERE work_date = $1 AND shift_id = $2 AND user_id = $3
    `,
      [work_date, shift_id, current_user_id]
    );

    if (!validShift) {
      return res
        .status(400)
        .json({
          error:
            "Invalid shift or current user. This shift does not exist for the current user.",
        });
    }

    // Update the schedule with the new user
    const updatedSchedule = await db.one(
      `
      UPDATE public.schedules SET user_id = $1 WHERE work_date = $2 AND shift_id = $3 RETURNING *;
    `,
      [new_user_id, work_date, shift_id]
    );

    res.json({ success: true, data: updatedSchedule });
  } catch (error) {
    console.error("Error switching schedule:", error);
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
});

// 404 handler
app.use((req, res, next) => {
  console.log("No route matched for", req.method, req.url);
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
