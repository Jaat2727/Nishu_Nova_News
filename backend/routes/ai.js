const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/summarize', async (req, res) => {
  try {
    const { title, description } = req.body;

    const prompt = `Summarize this news article in exactly 2 sentences:
    Title: ${title}
    Description: ${description || title}`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ 
          parts: [{ text: prompt }] 
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const summary = response.data.candidates[0].content.parts[0].text;
    res.json({ summary });
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;