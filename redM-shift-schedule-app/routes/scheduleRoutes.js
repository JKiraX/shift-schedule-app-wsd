const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const db = require('/New-Shift-Schedule-App/shift-schedule-app-wsd/db');

// Route to generate schedules
router.post('/generate-schedule', scheduleController.generateSchedules);

module.exports = router;
