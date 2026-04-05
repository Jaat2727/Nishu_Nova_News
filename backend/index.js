const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables early (I learned this keeps secrets safe!)
dotenv.config();

const app = express();

// Allow frontend to talk to backend without browser blocks
app.use(cors());
app.use(express.json()); // Parses incoming JSON data

// API Routes
app.use('/api/news', require('./routes/news'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/saved', require('./routes/saved'));

// Simple health check route
app.get('/', (req, res) => {
  res.json({ message: 'NovaNews API running! Everything looks good here. 🚀' });
});

// Global error handler just in case something breaks
app.use((err, req, res, next) => {
  console.error('Whoops, an error occurred:', err);
  res.status(500).json({ error: 'Internal Server Error. Please try again later!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));