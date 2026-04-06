const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Helper function to create an auth-scoped Supabase client securely per-request
// This ensures users can only access their own data!
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

// Save a new article to the database
router.post('/', async (req, res) => {
  try {
    const { user_id, title, description, url, urlToImage, summary } = req.body;
    
    if (!user_id || !title || !url) {
      return res.status(400).json({ error: 'Missing required article details!' });
    }

    const supabase = getUserScopedSupabase(req);

    // Insert the article into the 'saved_articles' table.
    // Note: the backend database column is 'urltoimage' (all lowercase)
    const { data, error } = await supabase
      .from('saved_articles')
      .insert([{ user_id, title, description, url, urltoimage: urlToImage, summary }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error.message);
      throw error;
    }
    
    res.status(201).json({ message: 'Article saved successfully!', data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save article', details: error.message });
  }
});

// Get all saved articles for the logged-in user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const supabase = getUserScopedSupabase(req);

    // Fetch all articles where user_id matches, and show newest ones first!
    const { data, error } = await supabase
      .from('saved_articles')
      .select('*')
      .eq('user_id', user_id)
      // Note: Assuming there's a created_at column. Usually Supabase adds this by default!
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      // If order fails because created_at doesn't exist, we fallback
      if (error.code === '42703') {
          const fallbackQuery = await supabase.from('saved_articles').select('*').eq('user_id', user_id);
          if (fallbackQuery.error) throw fallbackQuery.error;
          return res.json(fallbackQuery.data);
      }
      throw error;
    }
    
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch saved articles', details: error.message });
  }
});

// Delete a saved article
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
