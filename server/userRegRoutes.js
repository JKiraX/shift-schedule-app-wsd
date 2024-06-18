const express = require('express');
const router = express.Router();
const { addEmployee } = require("../server/userRegistration");

// Add Employee Route
router.post('/add-employee', addEmployee);

module.exports = router;