const { PharmaGuardRecord } = require('../models');
const { decodeVCFBuffer, isValidVCF, getVCFStats } = require('../utils/vcfDecoder');

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

/**
 * Download original VCF file
 * @route GET /api/v1/records/:patientId/download
 */
const downloadVCFFile = async (req, res) => {
  try {
    const { patientId } = req.params;

    const record = await PharmaGuardRecord.findByPatientId(patientId);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found for this patient ID'
      });
    }

    if (!record.vcfBuffer) {
      return res.status(404).json({
        success: false,
        error: 'VCF file not found for this record'
      });
    }

    // Decode buffer to original content
    const vcfContent = decodeVCFBuffer(record.vcfBuffer);

    // Validate it's a proper VCF
    if (!isValidVCF(vcfContent)) {
      return res.status(500).json({
        success: false,
        error: 'Invalid VCF file format'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${record.fileName}"`);
    res.setHeader('Content-Length', record.vcfBuffer.length);
    
    // Send the decoded content
    res.send(vcfContent);

  } catch (error) {
    console.error('Error downloading VCF:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download VCF file',
      message: error.message
    });
  }
};

/**
 * Get VCF content as text (for preview)
 * @route GET /api/v1/records/:patientId/vcf-content
 */
const getVCFContent = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { preview } = req.query; // ?preview=true to get first 50 lines only

    const record = await PharmaGuardRecord.findByPatientId(patientId);
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found for this patient ID'
      });
    }

    if (!record.vcfBuffer) {
      return res.status(404).json({
        success: false,
        error: 'VCF file not found for this record'
      });
    }

    // Decode buffer to original content
    const vcfContent = decodeVCFBuffer(record.vcfBuffer);
    const stats = getVCFStats(vcfContent);

    // If preview mode, only return first 50 lines
    let content = vcfContent;
    if (preview === 'true') {
      const lines = vcfContent.split('\n').slice(0, 50);
      content = lines.join('\n');
    }

    res.json({
      success: true,
      data: {
        patientId: record.patientId,
        fileName: record.fileName,
        content: content,
        isPreview: preview === 'true',
        stats: stats
      }
    });

  } catch (error) {
    console.error('Error fetching VCF content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch VCF content',
      message: error.message
    });
  }
};

/**
 * Get VCF file statistics
 * @route GET /api/v1/records/:patientId/vcf-stats
 */
const getVCFFileStats = async (req, res) => {
  try {
    const { patientId } = req.params;

    const record = await PharmaGuardRecord.findByPatientId(patientId)
      .select('patientId fileName fileSize vcfBuffer uploadTimestamp');
    
    if (!record) {
      return res.status(404).json({
        success: false,
        error: 'Record not found for this patient ID'
      });
    }

    if (!record.vcfBuffer) {
      return res.status(404).json({
        success: false,
        error: 'VCF file not found for this record'
      });
    }

    // Decode and get stats
    const vcfContent = decodeVCFBuffer(record.vcfBuffer);
    const stats = getVCFStats(vcfContent);

    res.json({
      success: true,
      data: {
        patientId: record.patientId,
        fileName: record.fileName,
        uploadTimestamp: record.uploadTimestamp,
        fileSize: record.fileSize,
        vcfStats: stats
      }
    });

  } catch (error) {
    console.error('Error fetching VCF stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch VCF statistics',
      message: error.message
    });
  }
};

module.exports = {
  uploadVCF,
  getRecordByPatientId,
  getAllRecords,
  updateResults,
  getProcessingStatus,
  downloadVCFFile,
  getVCFContent,
  getVCFFileStats
};
