/**
 * VCF Buffer Decoder Utility
 * Handles decoding binary Buffer back to original VCF format
 */

/**
 * Decode binary buffer to UTF-8 string
 * @param {Buffer} buffer - The binary buffer from MongoDB
 * @returns {string} - Decoded VCF content
 */
const decodeVCFBuffer = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Invalid buffer provided');
  }

  try {
    // Convert buffer to UTF-8 string
    const vcfContent = buffer.toString('utf-8');
    return vcfContent;
  } catch (error) {
    throw new Error(`Failed to decode VCF buffer: ${error.message}`);
  }
};

/**
 * Decode Base64 encoded string to original content
 * @param {string} base64String - Base64 encoded VCF content
 * @returns {string} - Decoded VCF content
 */
const decodeVCFFromBase64 = (base64String) => {
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('Invalid base64 string provided');
  }

  try {
    // Create buffer from base64 and convert to UTF-8
    const buffer = Buffer.from(base64String, 'base64');
    return buffer.toString('utf-8');
  } catch (error) {
    throw new Error(`Failed to decode base64: ${error.message}`);
  }
};

/**
 * Validate VCF file format
 * @param {string} vcfContent - VCF file content
 * @returns {boolean} - True if valid VCF format
 */
const isValidVCF = (vcfContent) => {
  if (!vcfContent) return false;
  
  // Check for VCF header
  const hasFileFormat = vcfContent.includes('##fileformat=VCF');
  const hasHeaders = vcfContent.includes('#CHROM') || vcfContent.includes('##');
  
  return hasFileFormat || hasHeaders;
};

/**
 * Get VCF statistics from content
 * @param {string} vcfContent - VCF file content
 * @returns {object} - Statistics about the VCF file
 */
const getVCFStats = (vcfContent) => {
  const lines = vcfContent.split('\n');
  const headerLines = lines.filter(line => line.startsWith('##'));
  const columnHeaderLine = lines.find(line => line.startsWith('#CHROM'));
  const dataLines = lines.filter(line => line && !line.startsWith('#'));

  return {
    totalLines: lines.length,
    headerLines: headerLines.length,
    dataLines: dataLines.length,
    hasColumnHeader: !!columnHeaderLine,
    sizeBytes: Buffer.byteLength(vcfContent, 'utf-8'),
    sizeMB: (Buffer.byteLength(vcfContent, 'utf-8') / (1024 * 1024)).toFixed(2)
  };
};

module.exports = {
  decodeVCFBuffer,
  decodeVCFFromBase64,
  isValidVCF,
  getVCFStats
};
