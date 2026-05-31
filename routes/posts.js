const express = require('express');
const { getDb } = require('../database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/posts - list all posts (public)
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ error: 'Chyba při načítání zpráv.' });
  }
});

// GET /api/posts/:id - get single post (public)
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const post = await db.get('SELECT * FROM posts WHERE id = ?', req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Zpráva nenalezena.' });
    }
    res.json(post);
  } catch (err) {
    console.error('Get post error:', err);
    res.status(500).json({ error: 'Chyba při načítání zprávy.' });
  }
});

// POST /api/posts - create post (admin only)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image, tag } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Titulek a obsah jsou povinné.' });
    }

    const db = getDb();
    const result = await db.run(
      'INSERT INTO posts (title, content, excerpt, author, image, tag) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, excerpt || content.substring(0, 150) + '...', req.user.username, image || null, tag || 'Informace']
    );

    const post = await db.get('SELECT * FROM posts WHERE id = ?', result.lastID);
    res.status(201).json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ error: 'Chyba při vytváření zprávy.' });
  }
});

// PUT /api/posts/:id - update post (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { title, content, excerpt, image, tag } = req.body;
    const db = getDb();
    const post = await db.get('SELECT * FROM posts WHERE id = ?', req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Zpráva nenalezena.' });
    }

    await db.run(
      'UPDATE posts SET title = ?, content = ?, excerpt = ?, image = ?, tag = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title || post.title,
        content || post.content,
        excerpt || (content ? content.substring(0, 150) + '...' : post.excerpt),
        image !== undefined ? image : post.image,
        tag || post.tag,
        req.params.id
      ]
    );

    const updated = await db.get('SELECT * FROM posts WHERE id = ?', req.params.id);
    res.json(updated);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ error: 'Chyba při aktualizaci zprávy.' });
  }
});

// DELETE /api/posts/:id - delete post (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const db = getDb();
    const post = await db.get('SELECT * FROM posts WHERE id = ?', req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Zpráva nenalezena.' });
    }

    await db.run('DELETE FROM posts WHERE id = ?', req.params.id);
    res.json({ message: 'Zpráva byla smazána.' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ error: 'Chyba při mazání zprávy.' });
  }
});

module.exports = router;
