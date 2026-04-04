const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/news', require('./routes/news'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/saved', require('./routes/saved'));

app.get('/', (req, res) => {
  res.json({ message: 'NovaNews API running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));