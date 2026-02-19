const { PharmaGuardRecord } = require('../models');

/**
 * Upload VCF file and create a new PharmaGuardRecord
 * @route POST /api/v1/upload
 */
const uploadVCF = async (req, res) => {
  try {
    const { patientId } = req.body;
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No VCF file uploaded'
      });
    }

    // Validate patient ID
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required'
      });
    }

    // Check if record already exists for this patient
    const existingRecord = await PharmaGuardRecord.findByPatientId(patientId);
    if (existingRecord) {
      return res.status(409).json({
        success: false,
        error: 'Record already exists for this patient ID'
      });
    }

    // Validate file size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (req.file.size > MAX_SIZE) {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
    }

    // Create new record with VCF file
    const record = new PharmaGuardRecord({
      patientId,
      vcfBuffer: req.file.buffer,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      processingStatus: 'pending'
    });

    await record.save();

    // TODO: Trigger FastAPI processing here
    // Send VCF to FastAPI for analysis
    // await sendToFastAPI(record._id, req.file.buffer);

    res.status(201).json({
      success: true,
      message: 'VCF file uploaded successfully',
      data: {
        recordId: record._id,
        patientId: record.patientId,
        fileName: record.fileName,
        fileSize: record.fileSize,
        fileSizeMB: record.fileSizeMB,
        uploadTimestamp: record.uploadTimestamp,
        processingStatus: record.processingStatus
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload VCF file',
      message: error.message
    });
  }
};

/**
 * Get record by patient ID
 * @route GET /api/v1/records/:patientId
 */
const getRecordByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const record = await PharmaGuardRecord.findByPatientId(patientId)
      .select('-vcfBuffer'); // Exclude large buffer from response

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found for this patient ID'
      });
    }

    res.json({
      success: true,
      data: record
    });

  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch record',
      message: error.message
    });
  }
};

/**
 * Get all recent records
 * @route GET /api/v1/records
 */
const getAllRecords = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const records = await PharmaGuardRecord.getRecentRecords(limit);

    res.json({
      success: true,
      count: records.length,
      data: records
    });

  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch records',
      message: error.message
    });
  }
};

/**
 * Update record with analysis results
 * @route PUT /api/v1/records/:recordId/results
 */
const updateResults = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { results } = req.body;

    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        success: false,
        error: 'Results array is required'
      });
    }

    const record = await PharmaGuardRecord.findById(recordId);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    await record.addResults(results);

    res.json({
      success: true,
      message: 'Results updated successfully',
      data: {
        recordId: record._id,
        patientId: record.patientId,
        resultsCount: record.results.length,
        processingStatus: record.processingStatus
      }
    });

  } catch (error) {
    console.error('Error updating results:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update results',
      message: error.message
    });
  }
};

/**
 * Get processing status
 * @route GET /api/v1/records/:recordId/status
 */
const getProcessingStatus = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await PharmaGuardRecord.findById(recordId)
      .select('patientId processingStatus errorMessage uploadTimestamp');

    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }

    res.json({
      success: true,
      data: {
        recordId: record._id,
        patientId: record.patientId,
        processingStatus: record.processingStatus,
        errorMessage: record.errorMessage,
        uploadTimestamp: record.uploadTimestamp
      }
    });

  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch processing status',
      message: error.message
    });
  }
};

module.exports = {
  uploadVCF,
  getRecordByPatientId,
  getAllRecords,
  updateResults,
  getProcessingStatus
};
