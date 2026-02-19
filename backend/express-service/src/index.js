const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const uploadRoutes = require('./routes/upload.routes');

const app = express();

// Database connection middleware - ensures connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    return res.status(503).json({
      success: false,
      error: 'Database connection failed',
      message: error.message || 'Unable to connect to database. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

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
      status: 'GET /api/v1/records/:recordId/status',
      downloadVCF: 'GET /api/v1/records/:patientId/download',
      vcfContent: 'GET /api/v1/records/:patientId/vcf-content',
      vcfStats: 'GET /api/v1/records/:patientId/vcf-stats',
      updateResults: 'PUT /api/v1/records/:recordId/results'
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
