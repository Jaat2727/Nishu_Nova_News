const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Summarize an article using Google's Gemma 3 27B model (via Gemini API)
router.post('/summarize', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Article title is required to generate a summary!' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

    const prompt = `Summarize this news article in exactly 2 clear, concise sentences that are easy for anyone to understand.
Title: ${title}
Description: ${description || 'No description provided'}
Summary:`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({ summary });
  } catch (error) {
    console.error('Gemma 3 error:', error.message || error);
    res.status(500).json({
      error: 'Failed to generate summary.',
      details: error.message || 'Unknown error from Gemma 3 API'
    });
  }
});

module.exports = router;