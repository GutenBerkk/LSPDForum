const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../database');
const { generateToken, requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Jméno a heslo jsou povinné.' });
    }

    if (username.length < 3) {
      return res.status(400).json({ error: 'Jméno musí mít alespoň 3 znaky.' });
    }

    if (password.length < 5) {
      return res.status(400).json({ error: 'Heslo musí mít alespoň 5 znaků.' });
    }

    const db = getDb();
    const existingUser = await db.get('SELECT id FROM users WHERE username = ?', username);
    if (existingUser) {
      return res.status(409).json({ error: 'Uživatel s tímto jménem již existuje.' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

    const user = { id: result.lastID, username, role: 'user' };
    const token = generateToken(user);

    res.status(201).json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Chyba při registraci.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Jméno a heslo jsou povinné.' });
    }

    const db = getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', username);
    if (!user) {
      return res.status(401).json({ error: 'Nesprávné jméno nebo heslo.' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Nesprávné jméno nebo heslo.' });
    }

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Chyba při přihlášení.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
