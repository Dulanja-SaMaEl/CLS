# Colombo Law Society (CLS) Official Portal

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20%2F%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)

Official web portal and administrative management platform for the **Colombo Law Society**, established in 1890 and the premier, largest branch association of the Bar Association of Sri Lanka (BASL) since 1975. Located at 129, Hulftsdorp Street, Superior Courts Enclave, Colombo 12.

---

## ✨ Features

### Public Portal
- **Monumental Heritage & Bar Identity:** High-craft dark aesthetic (`#0A0A0A`, warm sand `#E7E0D3`, and bronze `#C5A059`) celebrating 50 years of the charter.
- **Continuing Legal Education & Symposia (`/events`):** Calendar of academic conferences, masterclasses, and annual law dinners.
- **Event Image Showcase & Gallery (`/gallery`):** Interactive visual archive with fullscreen lightbox, category filtering, and featured highlight badges.
- **Executive Leadership & Honour Rolls (`/team`, `/past-presidents`, `/vice-presidents`):** Complete historical rolls of past presidents (1975–Present) and executive council officers.
- **Advocate Bar Portal (`/member`):** Digital Bar Pass, dues status, and member directory access.

### Executive Administration Console (`/admin`)
- **Executive Overview Dashboard (`/admin`):** High-level metrics, advocate counts, and quick actions.
- **Google Calendar-Style Event & Meeting Scheduler (`/admin/events`):** Interactive 7x6 month grid, day-click scheduling, ticket pricing, direct poster photo uploads, and virtual courtroom/meeting chambers (Zoom/Teams links).
- **Event Showcase Media Desk (`/admin/gallery`):** Upload high-resolution photos via drag-and-drop, link photos to scheduled events, and 1-click feature highlights.
- **Executive Council & Committee Editor (`/admin/committee`):** Customize officers, credentials, portrait photos, and portfolios.
- **Advocate Directory Manager (`/admin/members`):** Search, manage, and verify Supreme Court enrolment numbers.
- **Broadcast Dispatch Center (`/admin/broadcast`):** Dispatch SMS and Email announcements to the Bar.

---

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + Framer Motion
- **Database:** PostgreSQL / Supabase Relational Database (`supabase-schema.sql`)
- **API & Uploads:** Native Next.js Route Handlers (`/api/upload`, `/api/events`, `/api/gallery`, `/api/members`, `/api/committee`, `/api/broadcast`, `/api/settings`)
- **State & Local Persistence:** Persistent JSON/In-Memory database layer in `lib/db.ts`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Dulanja-SaMaEl/CLS.git
cd CLS
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Database Setup (Supabase / PostgreSQL)
1. Open your Supabase or PostgreSQL SQL editor.
2. Execute the queries inside `supabase-schema.sql` to initialize all 7 relational tables, indexes, RLS policies, and seed data.

---

## 🏛️ Colombo Law Society
- **Headquarters:** Colombo Law Society Hall, 129, Hulftsdorp Street, Colombo 12, Sri Lanka
- **Affiliation:** Bar Association of Sri Lanka (BASL)
- **Contact:** info@colombolawsociety.com | +94 71 192 3531
