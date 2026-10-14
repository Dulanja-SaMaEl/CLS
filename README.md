# Colombo Law Society (CLS) Official Portal

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Backend-Express%20%2F%20Node.js-lightgrey?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20%2F%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

Official web portal and administrative management platform for the **Colombo Law Society**, established in 1890 and the premier, largest branch association of the Bar Association of Sri Lanka (BASL) since 1975. Located at 129, Hulftsdorp Street, Superior Courts Enclave, Colombo 12.

---

## 🏛️ Monorepo Architecture

This repository is structured as a production monorepo containing two decoupled services:

```
CLS/
├── frontend/                     # Next.js 14 App Router (Deployed on Vercel)
│   ├── app/                      # Public portals, /events, /gallery, and /admin
│   ├── components/               # Navbars, footers, calendar widgets, lightboxes
│   ├── public/                   # Official Sri Lankan legal imagery & brand crests
│   ├── package.json
│   └── README.md                 # Detailed Vercel deployment guide
│
├── backend/                      # Node.js + Express + TypeScript (Deployed on Render)
│   ├── src/
│   │   ├── config/               # Supabase PostgreSQL connection & fallback
│   │   ├── controllers/          # Events, gallery, members, committee, broadcasts
│   │   ├── routes/               # Express REST API routes (/api/...)
│   │   └── server.ts             # Express entrypoint
│   ├── render.yaml               # 1-Click Render Blueprint configuration
│   ├── package.json
│   └── README.md                 # Detailed Render deployment guide
│
├── supabase-schema.sql           # Complete PostgreSQL DDL & Seed Data for Supabase
└── README.md                     # Monorepo documentation
```

---

## 🚀 Cloud Deployment Guide

### 1. Database (Supabase)
1. Open your [Supabase Dashboard](https://supabase.com) and create a new project.
2. Go to **SQL Editor** -> **New Query**.
3. Copy and paste the full contents of `supabase-schema.sql` and click **Run**.
4. Retrieve your connection string from **Project Settings** -> **Database**.

---

### 2. Backend Service (Render)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** -> **Web Service**.
2. Connect your GitHub repository: `https://github.com/Dulanja-SaMaEl/CLS.git`.
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: Your Supabase connection string.
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g. `https://cls.vercel.app`).
   - `JWT_SECRET`: Random secure string.

---

### 3. Frontend Web App (Vercel)
1. In your [Vercel Dashboard](https://vercel.com), click **Add New...** -> **Project**.
2. Import `https://github.com/Dulanja-SaMaEl/CLS.git`.
3. In project settings:
   - **Framework:** `Next.js`
   - **Root Directory:** `frontend`
4. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your Render backend URL (e.g. `https://cls-backend.onrender.com`).
5. Click **Deploy**.

---

## 💻 Local Development

Run both services locally:

### Option A: From root using npm scripts
```bash
# Run Frontend (http://localhost:3000)
npm run dev:frontend

# In a second terminal, run Backend (http://localhost:5000)
npm run dev:backend
```

### Option B: Standalone folders
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

---

## 🏛️ Colombo Law Society
- **Headquarters:** Colombo Law Society Hall, 129, Hulftsdorp Street, Colombo 12, Sri Lanka
- **Affiliation:** Bar Association of Sri Lanka (BASL)
- **Contact:** info@colombolawsociety.com | +94 71 192 3531
