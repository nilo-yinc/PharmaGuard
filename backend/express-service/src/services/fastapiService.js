const axios = require('axios');

/**
 * FastAPI Service Integration
 * Handles communication with FastAPI analysis service
 */

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

/**
 * Send VCF data to FastAPI for pharmacogenomic analysis
 * @param {Object} data - Analysis request data
 * @param {string} data.patientId - Patient identifier
 * @param {string[]} data.drugs - Array of drug names to analyze
 * @param {Buffer} data.vcfBuffer - VCF file buffer
 * @param {string} data.recordId - MongoDB record ID
 * @returns {Promise<Object>} - Analysis results from FastAPI
 */
const analyzeVCF = async ({ patientId, drugs, vcfBuffer, recordId }) => {
  try {
    console.log(`📤 Sending analysis request to FastAPI for patient: ${patientId}`);
    console.log(`   Drugs: ${drugs.join(', ')}`);
    console.log(`   VCF size: ${(vcfBuffer.length / 1024).toFixed(2)} KB`);

    // Convert buffer to base64 or UTF-8 string for transmission
    const vcfContent = vcfBuffer.toString('utf-8');

    // Prepare request payload matching FastAPI schema
    const requestData = {
      patient_id: patientId,
      drugs: drugs,
      vcf_content: vcfContent,
      record_id: recordId
    };

    // Send POST request to FastAPI /analyze endpoint
    const response = await axios.post(
      `${FASTAPI_URL}/analyze`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 second timeout
      }
    );

    console.log(`✅ Analysis completed for patient: ${patientId}`);
    console.log(`   Results count: ${response.data.results?.length || 0}`);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    console.error(`❌ FastAPI analysis failed:`, error.message);

    if (error.response) {
      // FastAPI returned an error response
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data:`, error.response.data);

      return {
        success: false,
        error: 'FastAPI analysis failed',
        message: error.response.data?.detail || error.message,
        statusCode: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      console.error(`   No response from FastAPI service`);

      return {
        success: false,
        error: 'FastAPI service unavailable',
        message: 'Could not connect to analysis service. Please try again later.'
      };
    } else {
      // Error in request setup
      return {
        success: false,
        error: 'Request setup failed',
        message: error.message
      };
    }
  }
};

/**
 * Check if FastAPI service is available
 * @returns {Promise<boolean>} - True if service is available
 */
const checkFastAPIHealth = async () => {
  try {
    const response = await axios.get(`${FASTAPI_URL}/health`, {
      timeout: 5000
    });
    return response.status === 200;
  } catch (error) {
    console.error(`FastAPI health check failed:`, error.message);
    return false;
  }
};

/**
 * Transform FastAPI response to match MongoDB schema
 * @param {Object} fastapiResponse - Response from FastAPI
 * @returns {Array} - Formatted results for MongoDB
 */
const transformFastAPIResults = (fastapiResponse) => {
  if (!fastapiResponse.results || !Array.isArray(fastapiResponse.results)) {
    return [];
  }

  return fastapiResponse.results.map(result => ({
    drug: result.drug,
    risk_assessment: {
      risk_label: result.risk_assessment.risk_label,
      confidence_score: result.risk_assessment.confidence_score,
      severity: result.risk_assessment.severity
    },
    pharmacogenomic_profile: {
      primary_gene: result.pharmacogenomic_profile.primary_gene,
      diplotype: result.pharmacogenomic_profile.diplotype,
      phenotype: result.pharmacogenomic_profile.phenotype,
      detected_variants: result.pharmacogenomic_profile.detected_variants || []
    },
    llm_generated_explanation: 
      typeof result.llm_generated_explanation === 'string' 
        ? result.llm_generated_explanation 
        : `${result.llm_generated_explanation?.summary || ''}\n\n${result.llm_generated_explanation?.mechanism || ''}`
  }));
};

module.exports = {
  analyzeVCF,
  checkFastAPIHealth,
  transformFastAPIResults,
  FASTAPI_URL
};
