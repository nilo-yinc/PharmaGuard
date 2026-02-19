const express = require('express');
const multer = require('multer');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');

// Configure multer for file upload (store in memory)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only .vcf files
    if (file.originalname.endsWith('.vcf') || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only VCF files are allowed'), false);
    }
  }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  } else if (err) {
    // Other errors (e.g., from fileFilter)
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  next();
};

// Upload VCF file only (no analysis)
router.post('/upload', upload.single('vcfFile'), handleMulterError, uploadController.uploadVCF);

// Upload VCF file and trigger immediate analysis with FastAPI
router.post('/upload-and-analyze', upload.single('vcfFile'), handleMulterError, uploadController.uploadAndAnalyze);

// Trigger analysis for existing record
router.post('/records/:recordId/analyze', uploadController.triggerAnalysis);

// Get all records (with pagination)
router.get('/records', uploadController.getAllRecords);

// Get record by patient ID
router.get('/records/:patientId', uploadController.getRecordByPatientId);

// Get processing status
router.get('/records/:recordId/status', uploadController.getProcessingStatus);

// Update record with analysis results (called by FastAPI or internally)
router.put('/records/:recordId/results', uploadController.updateResults);

module.exports = router;
