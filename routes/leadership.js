const express = require('express');
const { getDb } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/leadership - list all members (public)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const members = await db.all('SELECT * FROM leadership ORDER BY sort_order ASC');
    res.json(members);
  } catch (err) {
    console.error('Get leadership error:', err);
    res.status(500).json({ error: 'Chyba při načítání vedení.' });
  }
});

// POST /api/leadership - add member (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, rank, photo, sort_order } = req.body;

    if (!name || !rank) {
      return res.status(400).json({ error: 'Jméno a hodnost jsou povinné.' });
    }

    const db = getDb();
    const maxOrder = await db.get('SELECT MAX(sort_order) as max FROM leadership');
    const order = sort_order !== undefined ? sort_order : (maxOrder.max || 0) + 1;

    const result = await db.run(
      'INSERT INTO leadership (name, rank, photo, sort_order) VALUES (?, ?, ?, ?)',
      [name, rank, photo || null, order]
    );

    const member = await db.get('SELECT * FROM leadership WHERE id = ?', result.lastID);
    res.status(201).json(member);
  } catch (err) {
    console.error('Create leadership error:', err);
    res.status(500).json({ error: 'Chyba při přidávání člena vedení.' });
  }
});

// PUT /api/leadership/:id - edit member (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, rank, photo, sort_order } = req.body;
    const db = getDb();
    const existing = await db.get('SELECT * FROM leadership WHERE id = ?', req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Člen vedení nenalezen.' });
    }

    await db.run(
      'UPDATE leadership SET name = ?, rank = ?, photo = ?, sort_order = ? WHERE id = ?',
      [
        name || existing.name,
        rank || existing.rank,
        photo !== undefined ? photo : existing.photo,
        sort_order !== undefined ? sort_order : existing.sort_order,
        req.params.id
      ]
    );

    const updated = await db.get('SELECT * FROM leadership WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Update leadership error:', err);
    res.status(500).json({ error: 'Chyba při aktualizaci člena vedení.' });
  }
});

// DELETE /api/leadership/:id - remove member (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const existing = await db.get('SELECT * FROM leadership WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Člen vedení nenalezen.' });
    }

    await db.run('DELETE FROM leadership WHERE id = ?', req.params.id);
    res.json({ message: 'Člen vedení byl odstraněn.' });
  } catch (err) {
    console.error('Delete leadership error:', err);
    res.status(500).json({ error: 'Chyba při odstraňování člena vedení.' });
  }
});

module.exports = router;
