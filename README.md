## PharmaGuard

PharmaGuard is a pharmacogenomic risk prediction platform that accepts VCF input, analyzes selected drugs, and returns structured clinical risk insights.

### Monorepo Layout

- `frontend/` React + Vite app (deploy to Vercel)
- `backend/express-service/` unified Express API (deploy to Render)

### Local Development

1. Start backend:
   - `cd backend/express-service`
   - `copy .env.example .env`
   - `npm install`
   - `npm run dev`
2. Start frontend:
   - `cd frontend`
   - `copy .env.example .env`
   - `npm install`
   - `npm run dev`

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

### Deployment Targets

1. Frontend (Vercel)
   - Deploy from `frontend/`
   - Set `VITE_API_BASE_URL=https://<render-backend-domain>`
2. Backend (Render)
   - Deploy from `backend/express-service/`
   - Build: `npm install`
   - Start: `npm start`
   - Configure env vars from `backend/express-service/.env.example`

### Notes

- Backend now serves both auth and upload/analyze routes in one service.
- If FastAPI is unavailable, `/api/v1/analyze` returns fallback demo-safe CPIC-aligned results so UI flow remains functional.
