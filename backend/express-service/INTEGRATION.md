# Express-FastAPI Integration Guide

## 🔗 Overview

This document explains how the Express.js service integrates with the FastAPI service for pharmacogenomic analysis.

## 🏗️ Architecture

```
┌──────────────┐
│   Frontend   │
│  (React.js)  │
└──────┬───────┘
       │ Upload VCF + Drugs
       ↓
┌──────────────────────────┐
│   Express.js Service     │
│   (Port 3001)            │
│  ┌────────────────────┐  │
│  │  Upload Handler    │  │
│  │  - Store VCF       │  │
│  │  - Create Record   │  │
│  └────────┬───────────┘  │
│           │              │
│  ┌────────▼───────────┐  │
│  │ FastAPI Service    │  │
│  │   Integration      │  │
│  │  - Send VCF Data   │  │
│  │  - Receive Results │  │
│  └────────┬───────────┘  │
└───────────┼──────────────┘
            │ HTTP POST
            ↓
┌──────────────────────────┐
│   FastAPI Service        │
│   (Port 8000)            │
│  ┌────────────────────┐  │
│  │  VCF Parser        │  │
│  │  Genotype Caller   │  │
│  │  Risk Calculator   │  │
│  │  LLM Generator     │  │
│  └────────┬───────────┘  │
└───────────┼──────────────┘
            │ Analysis Results
            ↓
┌──────────────────────────┐
│   Express.js Service     │
│  ┌────────────────────┐  │
│  │  Update MongoDB    │  │
│  │  - Save Results    │  │
│  │  - Update Status   │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

## 📡 API Endpoints

### 1. Upload VCF Only (No Analysis)

**POST** `/api/v1/upload`

Upload VCF file without triggering analysis.

**Form Data:**
- `vcfFile`: VCF file (required)
- `patientId`: Patient ID (required)

**Response:**
```json
{
  "success": true,
  "message": "VCF file uploaded successfully",
  "data": {
    "recordId": "65f...",
    "patientId": "PAT12345",
    "processingStatus": "pending"
  }
}
```

---

### 2. Upload VCF and Analyze (Recommended)

**POST** `/api/v1/upload-and-analyze`

Upload VCF file and immediately trigger FastAPI analysis.

**Form Data:**
- `vcfFile`: VCF file (required)
- `patientId`: Patient ID (required)
- `drugs`: Array of drug names (required)
  - Can be JSON string: `["WARFARIN", "CODEINE"]`
  - Or JSON array if sent properly

**Example using curl:**
```bash
curl -X POST http://localhost:3001/api/v1/upload-and-analyze \
  -F "vcfFile=@patient.vcf" \
  -F "patientId=PAT12345" \
  -F 'drugs=["WARFARIN","CODEINE","CLOPIDOGREL"]'
```

**Example using Postman:**
1. Method: POST
2. URL: `http://localhost:3001/api/v1/upload-and-analyze`
3. Body → form-data:
   - `vcfFile`: [Select .vcf file]
   - `patientId`: `PAT12345`
   - `drugs`: `["WARFARIN","CODEINE"]`

**Response (202 Accepted):**
```json
{
  "success": true,
  "message": "VCF file uploaded successfully. Analysis started.",
  "data": {
    "recordId": "65f1234...",
    "patientId": "PAT12345",
    "fileName": "patient.vcf",
    "processingStatus": "processing",
    "drugs": ["WARFARIN", "CODEINE"]
  }
}
```

---

### 3. Trigger Analysis for Existing Record

**POST** `/api/v1/records/:recordId/analyze`

Trigger analysis for a previously uploaded VCF file.

**Body:**
```json
{
  "drugs": ["WARFARIN", "CODEINE", "CLOPIDOGREL"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Analysis started",
  "data": {
    "recordId": "65f...",
    "patientId": "PAT12345",
    "processingStatus": "processing",
    "drugs": ["WARFARIN", "CODEINE"]
  }
}
```

---

### 4. Check Processing Status

**GET** `/api/v1/records/:recordId/status`

Check the current status of analysis.

**Response:**
```json
{
  "success": true,
  "data": {
    "recordId": "65f...",
    "patientId": "PAT12345",
    "processingStatus": "completed",
    "uploadTimestamp": "2026-02-20T..."
  }
}
```

**Status values:**
- `pending` - Uploaded, not analyzed
- `processing` - Currently being analyzed by FastAPI
- `completed` - Analysis finished successfully
- `failed` - Analysis failed (check errorMessage)

---

### 5. Get Results

**GET** `/api/v1/records/:patientId`

Get complete results for a patient.

**Response:**
```json
{
  "success": true,
  "data": {
    "patientId": "PAT12345",
    "fileName": "patient.vcf",
    "processingStatus": "completed",
    "results": [
      {
        "drug": "WARFARIN",
        "risk_assessment": {
          "risk_label": "high",
          "confidence_score": 0.95,
          "severity": "severe"
        },
        "pharmacogenomic_profile": {
          "primary_gene": "CYP2C9",
          "diplotype": "*1/*3",
          "phenotype": "Intermediate Metabolizer",
          "detected_variants": [...]
        },
        "llm_generated_explanation": "..."
      }
    ]
  }
}
```

---

## ⚙️ Configuration

### Environment Variables

**Express Service (`.env`):**
```bash
PORT=3001
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://...
FASTAPI_URL=http://localhost:8000
```

**FastAPI Service:**
Make sure it's running on port 8000 with `/analyze` endpoint.

---

## 🔄 Data Flow

### 1. Upload & Analysis Request
```javascript
// Client sends VCF + drugs
POST /api/v1/upload-and-analyze
- vcfFile: binary
- patientId: "PAT12345"
- drugs: ["WARFARIN"]
```

### 2. Express → MongoDB
```javascript
// Express stores VCF as Buffer
{
  patientId: "PAT12345",
  vcfBuffer: <Buffer...>,
  processingStatus: "processing"
}
```

### 3. Express → FastAPI
```javascript
// Express sends to FastAPI
POST http://localhost:8000/analyze
{
  "patient_id": "PAT12345",
  "drugs": ["WARFARIN"],
  "vcf_content": "##fileformat=VCFv4.1\n...",
  "record_id": "65f..."
}
```

### 4. FastAPI Processing
- Parse VCF file
- Call genotypes/diplotypes
- Calculate risk scores
- Generate LLM explanations
- Return results

### 5. FastAPI → Express (Background)
```javascript
// Background task updates MongoDB
{
  processingStatus: "completed",
  results: [...]
}
```

### 6. Frontend Polls Status
```javascript
// Frontend checks status
GET /api/v1/records/:recordId/status

// When completed, fetch results
GET /api/v1/records/:patientId
```

---

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend/express-service
npm install
```

This installs `axios` for HTTP requests to FastAPI.

### 2. Configure Environment

Update `.env`:
```bash
FASTAPI_URL=http://localhost:8000
```

For production:
```bash
FASTAPI_URL=https://your-fastapi-service.com
```

### 3. Start Services

**Terminal 1 - Express:**
```bash
cd backend/express-service
npm run dev
```

**Terminal 2 - FastAPI:**
```bash
cd backend/fastapi-service
uvicorn app.main:app --reload --port 8000
```

**Terminal 3 - Frontend:**
```bashmcd frontend
npm start
```

---

## 🧪 Testing the Integration

### Test 1: Health Check
```bash
curl http://localhost:3001/health
curl http://localhost:8000/health
```

### Test 2: Upload and Analyze
```bash
curl -X POST http://localhost:3001/api/v1/upload-and-analyze \
  -F "vcfFile=@test.vcf" \
  -F "patientId=TEST001" \
  -F 'drugs=["WARFARIN"]'
```

### Test 3: Check Status
```bash
# Get recordId from previous response
curl http://localhost:3001/api/v1/records/TEST001
```

---

## 🐛 Troubleshooting

### Issue: "FastAPI service unavailable"

**Solution:**
1. Check FastAPI is running: `curl http://localhost:8000/health`
2. Verify FASTAPI_URL in `.env`
3. Check firewall/network settings

### Issue: "Analysis timeout"

**Solution:**
- FastAPI has 60-second timeout
- Large VCF files may take longer
- Consider increasing timeout in `fastapiService.js`

### Issue: "Status stuck at 'processing'"

**Solution:**
1. Check FastAPI logs for errors
2. Check Express console for background task errors
3. Manually check MongoDB record

---

## 📊 Monitoring

### Express Logs
```bash
🚀 Starting background analysis for record: 65f...
📤 Sending analysis request to FastAPI for patient: PAT12345
   Drugs: WARFARIN, CODEINE
   VCF size: 1.24 KB
✅ Analysis completed for patient: PAT12345
   Results count: 2
```

### FastAPI Logs
Check FastAPI service output for processing details.

---

## 🔐 Production Considerations

1. **Authentication**: Add JWT tokens to FastAPI requests
2. **Rate Limiting**: Limit analysis requests per user
3. **Queue System**: Use Redis/Bull for large-scale processing
4. **Webhooks**: FastAPI can POST results back to Express
5. **Monitoring**: Add APM (Application Performance Monitoring)
6. **Error Handling**: Retry failed requests
7. **Caching**: Cache common genotype results

---

## 📝 Next Steps

- [ ] Add authentication between services
- [ ] Implement webhook callbacks from FastAPI
- [ ] Add queue system for batch processing
- [ ] Create admin dashboard for monitoring
- [ ] Add comprehensive error logging
- [ ] Implement result caching

---

## 🤝 Contributing

When modifying the integration:

1. Update this README
2. Test both services independently
3. Test integration end-to-end
4. Update API documentation
5. Add tests for new features

