const jwt = require('jsonwebtoken');
const { getDb } = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'lspd-secret-key-change-in-production';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Přístup odepřen. Přihlaste se prosím.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = await db.get('SELECT id, username, role FROM users WHERE id = ?', decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Uživatel nebyl nalezen.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Neplatný nebo expirovaný token.' });
  }
}

async function requireAdmin(req, res, next) {
  await requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Přístup odepřen. Vyžadována role admin.' });
    }
    next();
  });
}

// Optional auth - sets req.user if token present, but doesn't block
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    const user = await db.get('SELECT id, username, role FROM users WHERE id = ?', decoded.id);
    req.user = user || null;
  } catch {
    req.user = null;
  }
  next();
}

module.exports = { generateToken, requireAuth, requireAdmin, optionalAuth, JWT_SECRET };
