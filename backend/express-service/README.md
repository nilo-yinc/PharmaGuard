# Express.js Service - PharmaGuard HealthTech

This is the Express.js backend service for PharmaGuard HealthTech application. It handles VCF file uploads and stores pharmacogenomic analysis results in MongoDB.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally and start the service
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Get your connection string

### 3. Configure Environment Variables

Create a `.env` file from the example:

```bash
copy .env.example .env
```

Update the `.env` file:

```env
PORT=3001
FRONTEND_URL=http://localhost:3000

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/pharma_guard
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharma_guard

# JWT Configuration
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d

# Node Environment
NODE_ENV=development
```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on **http://localhost:3001**

## 📁 Project Structure

```
src/
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   └── upload.controller.js   # Upload and record management
├── models/
│   ├── PharmaGuardRecord.model.js  # Main VCF record schema
│   ├── Patient.model.js            # Patient information
│   ├── Medication.model.js         # Medication database
│   ├── index.js                    # Model exports
│   └── README.md                   # Schema documentation
├── routes/
│   └── upload.routes.js    # API routes
├── middleware/             # Custom middleware
├── services/               # Business logic
├── utils/                  # Utility functions
└── index.js                # Application entry point
```

## 🗄️ Database Schema

### PharmaGuardRecord
The main schema for storing VCF files and analysis results.

**Key Fields:**
- `patientId`: Unique patient identifier (String, unique, indexed)
- `vcfBuffer`: VCF file content (Buffer, max 5MB)
- `uploadTimestamp`: Upload time (Date, ISO8601)
- `results`: Array of drug analysis results
  - `drug`: Drug name
  - `risk_assessment`: Risk level, confidence, severity
  - `pharmacogenomic_profile`: Gene, diplotype, phenotype, variants
  - `llm_generated_explanation`: AI-generated explanation
- `processingStatus`: 'pending' | 'processing' | 'completed' | 'failed'

See [`src/models/README.md`](src/models/README.md) for complete schema documentation.

## 🌐 API Endpoints

### Health Check
- **GET** `/` - API information and available endpoints
- **GET** `/health` - Health check with database status

### VCF File Upload & Records

#### Upload VCF File
**POST** `/api/v1/upload`

Upload a VCF file (max 5MB) for pharmacogenomic analysis.

**Form Data:**
- `vcfFile`: VCF file (required, .vcf extension)
- `patientId`: Patient identifier (required, unique)

**Response:**
```json
{
  "success": true,
  "message": "VCF file uploaded successfully",
  "data": {
    "recordId": "507f1f77bcf86cd799439011",
    "patientId": "PATIENT-001",
    "fileName": "sample.vcf",
    "fileSize": 1048576,
    "fileSizeMB": "1.00",
    "uploadTimestamp": "2026-02-19T10:30:00.000Z",
    "processingStatus": "pending"
  }
}
```

**Example Requests:**

```bash
# Using curl
curl -X POST http://localhost:3001/api/v1/upload \
  -F "vcfFile=@sample.vcf" \
  -F "patientId=PATIENT-001"

# Using Postman
# 1. Set method to POST
# 2. URL: http://localhost:3001/api/v1/upload
# 3. Body -> form-data
# 4. Add key "vcfFile" (type: File) and select your .vcf file
# 5. Add key "patientId" (type: Text) with value "PATIENT-001"
```

**JavaScript/Fetch:**
```javascript
const formData = new FormData();
formData.append('vcfFile', file); // file from input element
formData.append('patientId', 'PATIENT-001');

const response = await fetch('http://localhost:3001/api/v1/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

#### Get All Records
**GET** `/api/v1/records`

Get recent records with optional limit (excludes VCF buffer).

**Query Parameters:**
- `limit`: Number of records to return (default: 10)

**Example:**
```bash
curl http://localhost:3001/api/v1/records?limit=20
```

#### Get Record by Patient ID
**GET** `/api/v1/records/:patientId`

Get specific patient's record with analysis results.

**Example:**
```bash
curl http://localhost:3001/api/v1/records/PATIENT-001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "patientId": "PATIENT-001",
    "fileName": "sample.vcf",
    "fileSize": 1048576,
    "uploadTimestamp": "2026-02-19T10:30:00.000Z",
    "processingStatus": "completed",
    "results": [
      {
        "drug": "Warfarin",
        "risk_assessment": {
          "risk_label": "high",
          "confidence_score": 0.95,
          "severity": "severe"
        },
        "pharmacogenomic_profile": {
          "primary_gene": "CYP2C9",
          "diplotype": "*1/*3",
          "phenotype": "Intermediate Metabolizer",
          "detected_variants": [
            {
              "rsid": "rs1057910",
              "genotype": "A/C",
              "impact": "Reduced enzyme activity"
            }
          ]
        },
        "llm_generated_explanation": "Patient carries CYP2C9*3 variant which reduces warfarin metabolism..."
      }
    ]
  }
}
```

#### Get Processing Status
**GET** `/api/v1/records/:recordId/status`

Check the processing status of a specific record.

**Example:**
```bash
curl http://localhost:3001/api/v1/records/507f1f77bcf86cd799439011/status
```

#### Update Results (Internal - Called by FastAPI)
**PUT** `/api/v1/records/:recordId/results`

Update record with pharmacogenomic analysis results (typically called by FastAPI service).

**Request Body:**
```json
{
  "results": [
    {
      "drug": "Warfarin",
      "risk_assessment": {
        "risk_label": "high",
        "confidence_score": 0.95,
        "severity": "severe"
      },
      "pharmacogenomic_profile": {
        "primary_gene": "CYP2C9",
        "diplotype": "*1/*3",
        "phenotype": "Intermediate Metabolizer",
        "detected_variants": [
          {
            "rsid": "rs1057910",
            "genotype": "A/C",
            "impact": "Reduced enzyme activity"
          }
        ]
      },
      "llm_generated_explanation": "Patient carries CYP2C9*3 variant..."
    }
  ]
}
```

## 🧪 Testing

```bash
npm test
```

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `multer` - File upload handling
- `cors` - CORS middleware
- `helmet` - Security headers
- `morgan` - HTTP request logger
- `dotenv` - Environment variables
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-validator` - Request validation

### Development Dependencies
- `nodemon` - Auto-reload on changes
- `jest` - Testing framework
- `supertest` - HTTP assertion library

## 🔒 Security Features

- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ File size validation (max 5MB)
- ✅ File type validation (.vcf only)
- ✅ Unique patient ID enforcement
- ✅ Buffer size validation at schema level

## 🔄 Integration with FastAPI

This Express service handles file uploads and storage. The workflow is:

1. Client uploads VCF file → Express service
2. Express saves file to MongoDB → Returns record ID
3. Express triggers FastAPI for analysis (TODO)
4. FastAPI processes VCF → Calls Express to update results
5. Client polls Express for results

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/pharma_guard |
| `JWT_SECRET` | Secret key for JWT tokens | - |
| `JWT_EXPIRES_IN` | JWT token expiration | 7d |
| `NODE_ENV` | Environment mode | development |

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error: "MongooseServerSelectionError"**
- Make sure MongoDB is running: `mongod` or check MongoDB Atlas
- Verify connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

**Error: "Authentication failed"**
- Verify username and password in connection string
- Check database user permissions

### File Upload Issues

**Error: "File size exceeds 5MB limit"**
- VCF files must be under 5MB
- Compress or reduce file size

**Error: "Only VCF files are allowed"**
- Ensure file has `.vcf` extension
- Check file MIME type

**Error: "Record already exists for this patient ID"**
- Each patient can have only one record
- Use a different patient ID or delete existing record

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
