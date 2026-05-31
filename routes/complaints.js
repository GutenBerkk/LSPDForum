const express = require('express');
const router = express.Router();
const { getDb } = require('../database');
const { requireAuth, requireRole, optionalAuth } = require('../middleware/auth');

// GET all complaints (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const db = getDb();
    const complaints = await db.all('SELECT * FROM complaints ORDER BY created_at DESC');
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Chyba serveru při načítání stížností.' });
  }
});

// POST new complaint (public or logged in user)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !subject || !message) {
      return res.status(400).json({ error: 'Vyplňte všechna povinná pole.' });
    }

    const userId = req.user ? req.user.id : null;
    const db = getDb();
    
    const result = await db.run(
      'INSERT INTO complaints (user_id, name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email || null, subject, message]
    );

    res.status(201).json({ 
      message: 'Stížnost byla úspěšně odeslána. Brzy se jí budeme věnovat.',
      id: result.lastID 
    });
  } catch (error) {
    console.error('Error creating complaint:', error);
    res.status(500).json({ error: 'Chyba serveru při odesílání stížnosti.' });
  }
});

// PUT update complaint status/note (admin only)
router.put('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { status, admin_note } = req.body;
    const db = getDb();

    // Dynamically build update query based on provided fields
    const updates = [];
    const params = [];
    
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (admin_note !== undefined) {
      updates.push('admin_note = ?');
      params.push(admin_note);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Žádná data k aktualizaci.' });
    }

    params.push(req.params.id);

    const result = await db.run(
      `UPDATE complaints SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Stížnost nebyla nalezena.' });
    }

    res.json({ message: 'Stížnost byla aktualizována.' });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ error: 'Chyba serveru při aktualizaci stížnosti.' });
  }
});

module.exports = router;
