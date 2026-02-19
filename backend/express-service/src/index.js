const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Import routes
const uploadRoutes = require('./routes/upload.routes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PharmaGuard Express API',
    service: 'Express.js',
    version: '1.0.0',
    database: 'MongoDB',
    endpoints: {
      upload: 'POST /api/v1/upload',
      records: 'GET /api/v1/records',
      patientRecord: 'GET /api/v1/records/:patientId',
      status: 'GET /api/v1/records/:recordId/status'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'express-service',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/v1', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Express server running on http://localhost:${PORT}`);
  console.log(`📚 Service: PharmaGuard Express API`);
});

module.exports = app;
