const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const fs = require('fs');

// Import server routes
const toolsRoutePath = path.join(__dirname, 'dist/routes/tools.js');
const recommendationsRoutePath = path.join(__dirname, 'dist/routes/recommendations.js');

// Create and configure express app
const app = express();
app.use(cors());
app.use(json());

// Log environment variables (for debugging)
console.log('Environment variables loaded:');
console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Mount API routes if available
try {
  if (fs.existsSync(toolsRoutePath)) {
    const toolRoutes = require(toolsRoutePath).default;
    app.use('/api/tools', toolRoutes);
  }
  
  if (fs.existsSync(recommendationsRoutePath)) {
    const recommendationRoutes = require(recommendationsRoutePath).default;
    app.use('/api/recommendations', recommendationRoutes);
  }
} catch (error) {
  console.error('Error loading routes:', error);
}

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export as a serverless function
module.exports = app; 