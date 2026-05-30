const express = require('express');
const { getDb } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// POST /api/contact - submit contact message (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Všechna pole jsou povinná.' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Neplatná emailová adresa.' });
    }

    const db = getDb();
    await db.run(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );

    res.status(201).json({ message: 'Zpráva byla úspěšně odeslána.' });
  } catch (err) {
    console.error('Contact submit error:', err);
    res.status(500).json({ error: 'Chyba při odesílání zprávy.' });
  }
});

// GET /api/contact - list all messages (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const messages = await db.all('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ error: 'Chyba při načítání zpráv.' });
  }
});

// PUT /api/contact/:id/read - mark as read (admin only)
router.put('/:id/read', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await db.run('UPDATE contact_messages SET read = 1 WHERE id = ?', req.params.id);
    res.json({ message: 'Označeno jako přečtené.' });
  } catch (err) {
    res.status(500).json({ error: 'Chyba.' });
  }
});

// DELETE /api/contact/:id - delete message (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    await db.run('DELETE FROM contact_messages WHERE id = ?', req.params.id);
    res.json({ message: 'Zpráva byla smazána.' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ error: 'Chyba při mazání zprávy.' });
  }
});

module.exports = router;
