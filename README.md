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
   - Set `VITE_API_BASE_URL=https://<node-render-domain>`

2. Backend (Render, recommended via Blueprint)
   - Use root `render.yaml` to create both services:
     - `pharmaguard-node` (Express API)
     - `pharmaguard-python` (FastAPI analysis)
   - In Render Dashboard: `New +` -> `Blueprint` -> select this repo -> apply `render.yaml`
   - After creation, set secret env vars in Render:
     - Node: `MONGO_URI`, `JWT_SECRET`, optional email/google keys
     - Python: optional `GROQ_API_KEY`
   - Ensure Node env has:
     - `FRONTEND_URL=https://<your-vercel-frontend-domain>`
     - `FRONTEND_URLS=https://<your-vercel-frontend-domain>,http://localhost:5173,http://localhost:3000`
     - `FASTAPI_URL=https://<python-render-domain>`
     - `BACKEND_BASE_URL=https://<node-render-domain>`

### Notes

- Backend now serves both auth and upload/analyze routes in one service.
- If FastAPI is unavailable, `/api/v1/analyze` returns fallback demo-safe CPIC-aligned results so UI flow remains functional.
