const { generateSchedules: generateSchedulesUtil } = require('../utils/generateSchedules');

const generateSchedulesController = async (req, res) => {
  const { month, year } = req.body;
  try {
    await generateSchedulesUtil(month, year);
    res.status(200).json({ message: 'Schedules generated successfully.' });
  } catch (error) {
    console.error('Error generating schedules:', error);
    res.status(500).json({ error: 'Failed to generate schedules.' });
  }
};

module.exports = { generateSchedules: generateSchedulesController };
