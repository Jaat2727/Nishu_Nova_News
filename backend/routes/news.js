const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get top headlines from NewsAPI
router.get('/headlines', async (req, res) => {
  try {
    const { category, q } = req.query;
    
    // Build the URL depending on what the user is searching for
    let url = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${process.env.NEWS_API_KEY}`;
    
    if (category) url += `&category=${category}`;
    if (q) url += `&q=${q}`;
    // Default to some popular sources if no specific topic is selected
    if (!category && !q) url += `&sources=bbc-news,cnn,the-verge`;

    // Await the API response
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from NewsAPI:', error.message);
    res.status(500).json({ error: 'Failed to fetch news. Maybe the API key is missing or expired?' });
  }
});

module.exports = router;