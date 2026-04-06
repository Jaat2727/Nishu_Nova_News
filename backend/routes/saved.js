/**
 * saved.js — Backend routes for managing bookmarked articles.
 *
 * These routes let users:
 *   POST /         → Save a new article (with category)
 *   GET /:user_id  → Get all saved articles for a user (newest first)
 *   DELETE /:id    → Remove a saved article by its ID
 *
 * Security: Each route creates a Supabase client scoped to the
 *   user's JWT token. This means Row Level Security (RLS) will
 *   automatically enforce that users can only touch their own data.
 */

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

/**
 * Creates a Supabase client that carries the user's JWT.
 * This way, RLS policies on the database enforce per-user access.
 */
function getUserScopedSupabase(req) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    }
  );
}

/* ──────────── POST / — Save a new article ──────────── */
router.post('/', async (req, res) => {
  try {
    // Pull all fields from the request body
    const { user_id, title, description, url, urlToImage, summary, category } = req.body;

    // Basic validation
    if (!user_id || !title || !url) {
      return res.status(400).json({ error: 'Missing required fields: user_id, title, url' });
    }

    const supabase = getUserScopedSupabase(req);

    // Insert the article. Note: DB column is "urltoimage" (all lowercase).
    // .select() at the end returns the inserted row so the frontend can use it.
    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{
        user_id,
        title,
        description,
        url,
        urltoimage: urlToImage,    // mapped from camelCase → lowercase DB column
        summary,
        category: category || 'general'  // default to 'general' if not provided
      }])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      throw error;
    }

    res.status(201).json({ message: 'Article saved!', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save article', details: error.message });
  }
});

/* ──────────── GET /:user_id — Fetch all saved articles ──────────── */
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const supabase = getUserScopedSupabase(req);

    // Fetch articles for this user, newest first, max 100
    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Fetch saved error:', error);
    res.status(500).json({ error: 'Failed to fetch saved articles', details: error.message });
  }
});

/* ──────────── DELETE /:id — Remove a saved article ──────────── */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getUserScopedSupabase(req);

    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Article removed from library!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article', details: error.message });
  }
});

module.exports = router;
