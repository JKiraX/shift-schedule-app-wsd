const express = require("express");
const moment = require("moment-timezone");
const bodyParser = require("body-parser");
const db = require("./db"); 
const sanitizeInput = require("express-sanitizer");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeInput());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});


app.get("/users", async (req, res) => {
  try {
    const users = await db.any(`
      SELECT u."Id" AS user_id, u."firstName" AS first_name, u."lastName" AS last_name
      FROM public.appuser u
      JOIN public.identityuserrole iur ON u."Id" = iur."UserId"
      WHERE iur."RoleId" = 2
      ORDER BY u."firstName";
    `);
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


app.get("/schedules", async (req, res) => {
  const { date, dates, userId } = req.query;

  if (!date && !dates) {
    return res.status(400).json({ message: "Date or dates parameter is required" });
  }

  let dateList = date ? [date] : dates.split(",");

  try {
    let query;
    let params;

    if (userId) {
      query = `
        SELECT s.work_date, u."firstName" AS first_name, u."lastName" AS last_name, sh.shift_name, sh.start_time, sh.end_time, s.user_id, s.shift_id
        FROM public.schedules s
        JOIN public.appuser u ON s.user_id = u."Id"
        JOIN public.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.work_date IN ($1:csv) AND s.user_id = $2
        ORDER BY s.work_date ASC, sh.start_time ASC
      `;
      params = [dateList, userId];
    } else {
      query = `
        SELECT s.work_date, u."firstName" AS first_name, u."lastName" AS last_name, sh.shift_name, sh.start_time, sh.end_time, s.user_id, s.shift_id
        FROM public.schedules s
        JOIN public.appuser u ON s.user_id = u."Id"
        JOIN public.shifts sh ON s.shift_id = sh.shift_id
        WHERE s.work_date IN ($1:csv)
        ORDER BY s.work_date ASC, sh.start_time ASC
      `;
      params = [dateList];
    }

    const schedules = await db.any(query, params);

    if (schedules.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No schedules found for the given date(s)" });
    }

    const formattedSchedules = schedules.map((schedule) => ({
      shift_name: schedule.shift_name,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      assigned_users: `${schedule.first_name} ${schedule.last_name}`,
      shift_id: schedule.shift_id,
      work_date: schedule.work_date 
    }));

    res.json({ success: true, data: formattedSchedules });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


app.post("/api/report-leave", async (req, res) => {
  const { user_id, type_of_leave, justification, start_date, end_date } = req.body;
  const reportedAt = moment().tz("Africa/Johannesburg").format("YYYY-MM-DD HH:mm:ssZ");

  if (!user_id || !type_of_leave || !justification || !start_date || !end_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await db.one(
      `
      INSERT INTO public.report_leave (user_id, type_of_leave, justification_message, start_date, end_date, reported_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [user_id, type_of_leave, justification, start_date, end_date, reportedAt]
    );

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: "Failed to report leave" });
  }
});

app.put("/api/update-overtime", async (req, res) => {
  const { userId, shiftId, workDate, overtimeHours } = req.body;

  if (!userId || !shiftId || !workDate || overtimeHours === undefined) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const result = await db.oneOrNone(
      `
      UPDATE public.schedules 
      SET schedule_hours = schedule_hours + $1 
      WHERE user_id = $2 AND shift_id = $3 AND work_date = $4 
      RETURNING *;
    `, [overtimeHours, userId, shiftId, workDate]
    );

    if (result) {
      res.status(200).json({ success: true, message: "Overtime hours updated successfully", data: result });
    } else {
      res.status(404).json({ success: false, error: "No matching schedule found. Please check your input and try again." });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update overtime hours", details: error.message });
  }
});


app.get("/api/shifts", async (req, res) => {
  try {
    const shifts = await db.any(`
      SELECT shift_id, shift_name, start_time, end_time 
      FROM public.shifts 
      ORDER BY start_time
    `);
    res.json({ success: true, data: shifts });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error", details: error.message });
  }
});


app.put("/api/schedules/switch", async (req, res) => {
  const { work_date, shift_id, current_user_id, new_user_id } = req.body;

  if (!work_date || !shift_id || !current_user_id || !new_user_id) {
    return res.status(400).json({
      success: false,
      error: "All fields (work_date, shift_id, current_user_id, new_user_id) are required",
    });
  }

  try {
    const validShift = await db.oneOrNone(
      `
      SELECT s.work_date, s.shift_id, s.user_id 
      FROM public.schedules s
      JOIN public.shifts sh ON s.shift_id = sh.shift_id
      WHERE s.work_date = $1 AND s.shift_id = $2 AND s.user_id = $3
    `, [work_date, shift_id, current_user_id]
    );

    if (!validShift) {
      return res.status(400).json({
        success: false,
        error: "Invalid shift or current user. This shift does not exist for the current user.",
      });
    }

    const updatedSchedule = await db.one(
      `
      UPDATE public.schedules 
      SET user_id = $1 
      WHERE work_date = $2 AND shift_id = $3 
      RETURNING *;
    `, [new_user_id, work_date, shift_id]
    );

    res.json({ success: true, data: updatedSchedule });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message
    });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  
});
