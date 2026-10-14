# Colombo Law Society (CLS) — Standalone REST API Backend

Production-ready Node.js, Express, and TypeScript REST API service designed for deployment on **Render** and connection to a **Supabase PostgreSQL** database.

---

## 🚀 Deployment on Render (Step-by-Step)

### Option 1: One-Click Blueprint (`render.yaml`)
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
2. Connect your GitHub repository (`https://github.com/Dulanja-SaMaEl/CLS.git`).
3. Render will automatically detect `backend/render.yaml` and configure the web service.

### Option 2: Manual Web Service Setup
1. In Render Dashboard, click **New +** -> **Web Service**.
2. Connect the `CLS` repository.
3. Configure the following service settings:
   - **Name:** `cls-backend`
   - **Region:** `Singapore` (closest to Sri Lanka)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (or Starter)

4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `DATABASE_URL`: Your Supabase PostgreSQL Connection String (`postgresql://postgres.xxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`)
   - `FRONTEND_URL`: Your Vercel frontend URL (e.g., `https://cls.vercel.app`)
   - `JWT_SECRET`: A secure random secret string
   - `TEXT_LK_API_TOKEN`: *(Optional)* Your Text.lk SMS bearer token for Sri Lanka Bar alerts

---

## 🛠️ Local Development

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

### 3. Start development server (with hot-reload)
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📚 REST API Routes

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & service uptime status |
| `/api/events` | `GET`, `POST` | List and schedule conferences & meetings |
| `/api/events/:id` | `GET`, `PUT`, `DELETE` | Event detail, rescheduling, cancellation |
| `/api/gallery` | `GET`, `POST` | Public showcase photos & photo uploader |
| `/api/gallery/:id` | `PUT`, `DELETE` | Toggle featured highlight & remove photo |
| `/api/members` | `GET`, `POST` | Advocate member directory & enrollment |
| `/api/members/:id` | `PUT`, `DELETE` | Update tier/status and remove advocate |
| `/api/committee` | `GET`, `POST`, `PUT`, `DELETE` | Executive council officer management |
| `/api/broadcast` | `GET`, `POST` | SMS (Text.lk) & Email announcement dispatch |
| `/api/upload` | `POST` | Multipart file uploads (images & posters) |
| `/api/settings` | `GET`, `PUT` | Society profile, address, and membership dues |
| `/api/auth/sign-in` | `POST` | Advocate/Admin authentication with JWT |
| `/api/auth/sign-up` | `POST` | Member self-enrollment registration |
| `/api/auth/me` | `GET` | Authenticated profile retrieval |
