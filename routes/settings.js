const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all settings (public)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const settingsRows = await db.all('SELECT key, value FROM settings');
    const settings = {};
    settingsRows.forEach(row => {
      try {
        // Try parsing JSON if it's an array/object
        settings[row.key] = JSON.parse(row.value);
      } catch (e) {
        settings[row.key] = row.value;
      }
    });
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Chyba při načítání nastavení.' });
  }
});

// PUT update settings (admin only)
router.put('/', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const updates = req.body; // Expects object: { primary_color: '#...', logo_url: '...' }
    
    // We update each key sequentially
    for (const [key, rawValue] of Object.entries(updates)) {
      const value = typeof rawValue === 'object' ? JSON.stringify(rawValue) : rawValue;
      
      // Upsert
      await db.run(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, value]
      );
    }
    res.json({ message: 'Nastavení bylo úspěšně uloženo.' });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Chyba při ukládání nastavení.' });
  }
});

module.exports = router;
