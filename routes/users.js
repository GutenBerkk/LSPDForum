const express = require('express');
const { getDb } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - list all users (admin only)
router.get('/', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const users = await db.all('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Chyba při načítání uživatelů.' });
  }
});

// PUT /api/users/:id/role - change user role (admin only)
router.put('/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role musí být "user" nebo "admin".' });
    }

    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Uživatel nenalezen.' });
    }

    // Prevent demoting the last admin
    if (user.role === 'admin' && role === 'user') {
      const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', 'admin');
      if (adminCount.count <= 1) {
        return res.status(400).json({ error: 'Nelze odebrat roli poslednímu adminovi.' });
      }
    }

    await db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);

    const updated = await db.get('SELECT id, username, role, created_at FROM users WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Update role error:', err);
    res.status(500).json({ error: 'Chyba při změně role.' });
  }
});

// DELETE /api/users/:id - delete user (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE id = ?', req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Uživatel nenalezen.' });
    }

    // Prevent deleting self
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Nemůžete smazat svůj vlastní účet.' });
    }

    // Prevent deleting last admin
    if (user.role === 'admin') {
      const adminCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', 'admin');
      if (adminCount.count <= 1) {
        return res.status(400).json({ error: 'Nelze smazat posledního admina.' });
      }
    }

    // Delete user's submissions too
    await db.run('DELETE FROM recruitment_submissions WHERE user_id = ?', req.params.id);
    await db.run('DELETE FROM users WHERE id = ?', req.params.id);

    res.json({ message: 'Uživatel byl smazán.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: 'Chyba při mazání uživatele.' });
  }
});

module.exports = router;
