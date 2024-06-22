const express = require('express');
const viewDeleteUser = express.Router();
const db = require('./db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT user_id, user_name FROM dbuser');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM dbuser WHERE user_id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = viewDeleteUser;