const express = require('express');
const { getDb } = require('../database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ========== QUESTIONS ==========

// GET /api/recruitment/questions - get all questions (auth required)
router.get('/questions', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const questions = await db.all('SELECT * FROM recruitment_questions ORDER BY sort_order ASC');
    res.json(questions);
  } catch (err) {
    console.error('Get questions error:', err);
    res.status(500).json({ error: 'Chyba při načítání otázek.' });
  }
});

// POST /api/recruitment/questions - add question (admin only)
router.post('/questions', requireAdmin, async (req, res) => {
  try {
    const { question, type, options, required } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Otázka je povinná.' });
    }

    const db = getDb();
    const maxOrder = await db.get('SELECT MAX(sort_order) as max FROM recruitment_questions');
    const sortOrder = (maxOrder.max || 0) + 1;

    const result = await db.run(
      'INSERT INTO recruitment_questions (question, type, options, sort_order, required) VALUES (?, ?, ?, ?, ?)',
      [question, type || 'text', options ? JSON.stringify(options) : null, sortOrder, required !== undefined ? required : 1]
    );

    const newQuestion = await db.get('SELECT * FROM recruitment_questions WHERE id = ?', result.lastID);
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error('Create question error:', err);
    res.status(500).json({ error: 'Chyba při vytváření otázky.' });
  }
});

// PUT /api/recruitment/questions/:id - edit question (admin only)
router.put('/questions/:id', requireAdmin, async (req, res) => {
  try {
    const { question, type, options, sort_order, required } = req.body;
    const db = getDb();
    const existing = await db.get('SELECT * FROM recruitment_questions WHERE id = ?', req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Otázka nenalezena.' });
    }

    await db.run(
      'UPDATE recruitment_questions SET question = ?, type = ?, options = ?, sort_order = ?, required = ? WHERE id = ?',
      [
        question || existing.question,
        type || existing.type,
        options ? JSON.stringify(options) : existing.options,
        sort_order !== undefined ? sort_order : existing.sort_order,
        required !== undefined ? required : existing.required,
        req.params.id
      ]
    );

    const updated = await db.get('SELECT * FROM recruitment_questions WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Update question error:', err);
    res.status(500).json({ error: 'Chyba při aktualizaci otázky.' });
  }
});

// DELETE /api/recruitment/questions/:id - delete question (admin only)
router.delete('/questions/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const existing = await db.get('SELECT * FROM recruitment_questions WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Otázka nenalezena.' });
    }

    await db.run('DELETE FROM recruitment_questions WHERE id = ?', req.params.id);
    res.json({ message: 'Otázka byla smazána.' });
  } catch (err) {
    console.error('Delete question error:', err);
    res.status(500).json({ error: 'Chyba při mazání otázky.' });
  }
});

// ========== SUBMISSIONS ==========

// POST /api/recruitment/submit - submit form (auth required)
router.post('/submit', requireAuth, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ error: 'Odpovědi jsou povinné.' });
    }

    const db = getDb();
    // Check if user already has a pending submission
    const existing = await db.get(
      'SELECT id FROM recruitment_submissions WHERE user_id = ? AND status = ?',
      [req.user.id, 'pending']
    );

    if (existing) {
      return res.status(409).json({ error: 'Již máte podanou přihlášku čekající na vyřízení.' });
    }

    const result = await db.run(
      'INSERT INTO recruitment_submissions (user_id, username, answers) VALUES (?, ?, ?)',
      [req.user.id, req.user.username, JSON.stringify(answers)]
    );

    res.status(201).json({ message: 'Přihláška byla úspěšně odeslána.', id: result.lastID });
  } catch (err) {
    console.error('Submit form error:', err);
    res.status(500).json({ error: 'Chyba při odesílání přihlášky.' });
  }
});

// GET /api/recruitment/submissions - list all submissions (admin only)
router.get('/submissions', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const submissions = await db.all('SELECT * FROM recruitment_submissions ORDER BY created_at DESC');

    // Parse JSON answers
    const parsed = submissions.map(s => ({
      ...s,
      answers: JSON.parse(s.answers)
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Get submissions error:', err);
    res.status(500).json({ error: 'Chyba při načítání přihlášek.' });
  }
});

// GET /api/recruitment/my-submissions - get user's own submissions
router.get('/my-submissions', requireAuth, async (req, res) => {
  try {
    const db = getDb();
    const submissions = await db.all(
      'SELECT * FROM recruitment_submissions WHERE user_id = ? ORDER BY created_at DESC',
      req.user.id
    );

    const parsed = submissions.map(s => ({
      ...s,
      answers: JSON.parse(s.answers)
    }));

    res.json(parsed);
  } catch (err) {
    console.error('Get my submissions error:', err);
    res.status(500).json({ error: 'Chyba při načítání vašich přihlášek.' });
  }
});

// PUT /api/recruitment/submissions/:id - approve/reject (admin only)
router.put('/submissions/:id', requireAdmin, async (req, res) => {
  try {
    const { status, admin_note } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status musí být "approved" nebo "rejected".' });
    }

    const db = getDb();
    const existing = await db.get('SELECT * FROM recruitment_submissions WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Přihláška nenalezena.' });
    }

    await db.run(
      'UPDATE recruitment_submissions SET status = ?, admin_note = ? WHERE id = ?',
      [status, admin_note || null, req.params.id]
    );

    const updated = await db.get('SELECT * FROM recruitment_submissions WHERE id = ?', req.params.id);
    res.json({ ...updated, answers: JSON.parse(updated.answers) });
  } catch (err) {
    console.error('Update submission error:', err);
    res.status(500).json({ error: 'Chyba při aktualizaci přihlášky.' });
  }
});

module.exports = router;
