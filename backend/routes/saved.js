const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Helper to create an auth-scoped Supabase client securely per-request
function getUserScopedSupabase(req) {
  const token = req.headers.authorization?.split(' ')[1];
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

// Save article
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, url, urlToImage, summary } = req.body;
    const supabase = getUserScopedSupabase(req);

    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{ user_id, title, description, url, urlToImage, summary }]);

    if (error) {
      console.error("Supabase error:", error.message);
      throw error;
    }
    res.json({ message: 'Article saved!', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save article', details: error.message });
  }
});

// Get saved articles for a user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const supabase = getUserScopedSupabase(req);

    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .eq('user_id', user_id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch saved articles', details: error.message });
  }
});

// Delete saved article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getUserScopedSupabase(req);

    const { error } = await supabase
      .from('saved_articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Article removed!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete article', details: error.message });
  }
});

module.exports = router;
