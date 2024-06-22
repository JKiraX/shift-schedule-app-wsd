const express = require("express");
const router = express.Router();
const { addEmployee } = require("./userRegistration");

router.post("/add-employee", async (req, res) => {
  console.log("Reached /add-employee route");
  try {
    await addEmployee(req, res);
  } catch (error) {
    console.error("Error in add-employee route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;