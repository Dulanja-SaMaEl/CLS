# Colombo Law Society (CLS) — Next.js Frontend (Vercel)

Production Next.js 14 App Router application configured for direct deployment on **Vercel**.

---

## 🚀 Deployment on Vercel (Step-by-Step)

1. Open your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`https://github.com/Dulanja-SaMaEl/CLS.git`).
4. In the **Configure Project** screen:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Click **Edit** and select **`frontend`**
   - **Build Command:** `next build` (Default)
   - **Output Directory:** `.next` (Default)
   - **Install Command:** `npm install` (Default)
5. Expand **Environment Variables** and add:
   - `NEXT_PUBLIC_API_URL`: The URL of your Render backend (e.g. `https://cls-backend.onrender.com`).
6. Click **Deploy**.

Vercel will build and deploy the frontend with global edge caching!

---

## 🛠️ Local Development

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
