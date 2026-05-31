const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all divisions (public)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const divisions = await db.all('SELECT * FROM divisions ORDER BY sort_order ASC, id ASC');
    res.json(divisions);
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({ error: 'Chyba serveru.' });
  }
});

// POST new division (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, description, photo, sort_order } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Název oddělení je povinný.' });
    }

    const db = getDb();
    const result = await db.run(
      'INSERT INTO divisions (name, description, photo, sort_order) VALUES (?, ?, ?, ?)',
      [name, description || null, photo || null, sort_order || 0]
    );

    res.status(201).json({ id: result.lastID, message: 'Oddělení bylo přidáno.' });
  } catch (error) {
    console.error('Error creating division:', error);
    res.status(500).json({ error: 'Chyba serveru.' });
  }
});

// PUT update division (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description, photo, sort_order } = req.body;
    const db = getDb();

    if (!name) {
      return res.status(400).json({ error: 'Název oddělení je povinný.' });
    }

    const result = await db.run(
      'UPDATE divisions SET name = ?, description = ?, photo = ?, sort_order = ? WHERE id = ?',
      [name, description || null, photo || null, sort_order || 0, req.params.id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Oddělení nebylo nalezeno.' });
    }

    res.json({ message: 'Oddělení bylo aktualizováno.' });
  } catch (error) {
    console.error('Error updating division:', error);
    res.status(500).json({ error: 'Chyba serveru.' });
  }
});

// DELETE division (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const result = await db.run('DELETE FROM divisions WHERE id = ?', [req.params.id]);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Oddělení nebylo nalezeno.' });
    }

    res.json({ message: 'Oddělení bylo smazáno.' });
  } catch (error) {
    console.error('Error deleting division:', error);
    res.status(500).json({ error: 'Chyba serveru.' });
  }
});

module.exports = router;
