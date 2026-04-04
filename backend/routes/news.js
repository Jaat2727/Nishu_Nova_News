const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get top headlines
router.get('/headlines', async (req, res) => {
  try {
    const { category, q } = req.query;
    
    let url = `https://newsapi.org/v2/top-headlines?language=en&apiKey=${process.env.NEWS_API_KEY}`;
    
    if (category) url += `&category=${category}`;
    if (q) url += `&q=${q}`;
    if (!category && !q) url += `&sources=bbc-news,cnn,the-verge`;

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

module.exports = router;