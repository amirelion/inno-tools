const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { json } = require('body-parser');

// Import your routes
const toolRoutes = require('../server/dist/routes/tools').default;
const recommendationRoutes = require('../server/dist/routes/recommendations').default;

// Create and configure express app
const app = express();
app.use(cors());
app.use(json());

// Log environment variables (for debugging)
console.log('Environment variables loaded:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('OPENAI_API_KEY first 5 chars:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 5) + '...' : 'not set');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Mount your routes
app.use('/api/tools', toolRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create server
const server = createServer(app);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app; 