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

// Upload VCF file
router.post('/upload', upload.single('vcfFile'), uploadController.uploadVCF);

// Get all records (with pagination)
router.get('/records', uploadController.getAllRecords);

// Get record by patient ID
router.get('/records/:patientId', uploadController.getRecordByPatientId);

// Get processing status
router.get('/records/:recordId/status', uploadController.getProcessingStatus);

// Update record with analysis results (called by FastAPI or internally)
router.put('/records/:recordId/results', uploadController.updateResults);

module.exports = router;
