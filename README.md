# TalentDash — Career Intelligence Platform

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/Shivam-Bindal-tech/talentdash-career-intelligence)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

TalentDash is a high-performance, data-first compensation search engine and career intelligence platform. Built from scratch using **Next.js 15**, **React Server Components (RSC)**, **TypeScript Strict Mode**, and **Tailwind CSS v4**, it delivers sub-second page loads, zero layout shifts, perfect SEO markup, and WCAG AA accessibility compliance.

---

## 🚀 Key Features

*   **Salary Database (`/salaries`):** Core search engine for verified compensation records featuring multi-select filters (role, level, location) and full server-side processing.
*   **Company Profiles (`/companies/[slug]`):** Static pre-rendered pages pre-calculating median compensation, level distribution, and verified salary tables.
*   **Comparison Engine (`/compare`):** Side-by-side candidate package comparison matrix calculating base, bonus, stock, and total comp deltas.
*   **Dual Currency Engine:** Direct currency conversion toggle supporting USD and INR formatting with Indian numbering conventions (Lakhs/Crores via `Intl.NumberFormat('en-IN')`).
*   **URL State Sync:** All filters, sorting, paginations, and compared records act as the single source of truth in the query parameters, surviving page refreshes.
*   **Strict Accessibility:** Passes WCAG AA contrast ratio standards (4.5:1 minimum) with semantic sequential headings.

---

## ⚡ Performance & Accessibility Metrics

TalentDash eliminates client-side hydration blocking and heavy main-thread scripting by handling search, filtering, and pagination on the server.

| Page | Performance | Accessibility | Best Practices | SEO | Total Blocking Time (TBT) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Salaries Page (`/salaries`)** | **86** | **100** | **100** | **100** | **294 ms** |
| **Compare Page (`/compare`)** | **88** | **100** | **100** | **100** | **259 ms** |
| **Company Page (`/companies/google`)** | **91** | **98** | **100** | **100** | **203 ms** |

### Key Optimizations:
1. **Server-side Compare Resolution:** Shifted candidate record resolution to the server, removing heavy client-side hooks and reducing TBT by **over 40%**.
2. **Reduced Hydration Payload:** Server-side mapping strips unused metadata from the 70-record dropdown list, reducing the JSON payload from **26.74 KB to 15.84 KB** (a **40.8% reduction**) and avoiding the serialization of **490 duplicate properties**.
3. **Contrast & Tag Alignment:** Remedied color contrast ratios on text elements and unified heading flows from `<h3>` to `<h2>` to achieve perfect audit scores.
4. **Static Pre-generation:** Pre-rendered 14 company pages at compile time via `generateStaticParams` for instantaneous loading.

---

## 📁 Folder Structure

```text
app/
  ├── layout.tsx            # Global HTML layout, Inter font, base SEO
  ├── page.tsx              # Rich-aesthetic product landing page
  ├── not-found.tsx         # Themed 404 page for invalid routes/slugs
  ├── salaries/
  │   └── page.tsx          # Server Component parsing search parameters & JSON-LD
  ├── companies/
  │   └── [slug]/
  │       └── page.tsx      # Static pre-rendered company profile page (SSG)
  └── compare/
      └── page.tsx          # RSC wrapper for comparing selected records
components/
  ├── features/
  │   ├── salary/
  │   │   ├── filter-bar.tsx     # Debounced Client Component capturing parameters
  │   │   ├── salary-table.tsx   # RSC rendering grid with server-sorting links
  │   │   └── pagination.tsx     # RSC rendering Prev/Next navigation
  │   └── compare/
  │       └── compare-tool.tsx   # Client component side-by-side delta matrix
lib/
  ├── config.ts             # Exchange rates & static company profile metadata
  ├── mock-data.ts          # 70-record normalized dataset with computed values
  └── utils.ts              # Mathematical median & lakh/crore currency formatting
types/
  └── index.ts              # Strict TypeScript interfaces matching schemas
```

---

## 🔍 SEO Features & Structured Data

*   **Dynamic Metadata:** Generates page-specific titles and meta descriptions (e.g., *"Staff Software Engineer Salaries at Amazon India | TalentDash"*).
*   **Open Graph & Canonical Mappings:** Fully optimized for social previews and duplicate indexing prevention.
*   **Structured Schema (JSON-LD):**
    *   `/salaries` generates a `Dataset` schema of listings.
    *   `/companies/[slug]` generates an `Organization` schema incorporating headquarters, founding date, employee headcount ranges, and description profiles.

---

## 💻 Getting Started

### Installation
```bash
npm install
```

### Running Locally (Development)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build and Start (Production)
```bash
npm run build
npm run start
```

---

## 📸 Screenshots

### Homepage
![Homepage](/public/screenshots/homepage.png)

### Salaries Page
![Salaries Page](/public/screenshots/salaries.png)

### Company Page
![Company Page](/public/screenshots/company.png)

### Compare Page
![Compare Page](/public/screenshots/compare.png)

---

## 👤 Author

*   **Author:** Shivam Bindal
*   **GitHub:** [@Shivam-Bindal-tech](https://github.com/Shivam-Bindal-tech)
