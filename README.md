# TalentDash — Career Intelligence Platform

TalentDash is a high-performance, data-first career intelligence platform designed to serve structured, comparable, and decision-ready compensation data at internet scale.

Unlike a generic job board, TalentDash operates as a compensation search engine. It is built from scratch using **Next.js 15**, **React Server Components (RSC)**, **TypeScript Strict Mode**, and **Tailwind CSS v4** to deliver sub-second page loads, zero layout shifts, search-optimized semantic markup, and perfect accessibility compliance.

---

## 🚀 Key Features

*   **Salary Intelligence Dashboard (`/salaries`):** Core search engine for verified compensation records with advanced filtering (role, level, location) and multi-select filters.
*   **Company Profiles (`/companies/[slug]`):** Static pre-rendered pages pre-generating all median compensation statistics, level distribution charts, and verified salary tables.
*   **Compensation Comparison Tool (`/compare`):** Side-by-side candiate packages comparison matrix, calculating exact compensation deltas (base, bonus, stock, and total comp) in multiple currencies.
*   **Currency Conversion:** Global display toggle with support for Lakhs and Crores numbering conventions (`Intl.NumberFormat('en-IN')`) for Indian Rupees (INR) alongside standard United States Dollars (USD).
*   **URL State Synchronization:** Search parameters act as the single source of truth—all filters, sort configurations, paginations, and compared selections are persisted in the query string and survive page refreshes.
*   **SEO Optimization:** Unique canonical mappings, Open Graph tags, automated meta tags, and structured JSON-LD (Dataset and Organization schemas).
*   **Accessibility Improvements:** Passes WCAG AA contrast ratio standards (4.5:1 minimum) and maintains a strict sequential descending heading order (`h1` -> `h2`).
*   **Server Components Architecture:** Keeps client-side bundle footprints negligible by processing all data filtering, sorting, pagination, and currency conversions on the server.

---

## 🛠️ Tech Stack

*   **Core Framework:** Next.js 15.1.0 (App Router)
*   **Library:** React 19.2.4
*   **Language:** TypeScript 5.x (Strict Mode)
*   **Styling:** Tailwind CSS v4.0.0
*   **Deployment Target:** Vercel

---

## ⚡ Performance & Accessibility Optimizations

TalentDash has been optimized to eliminate client-side hydration blocking and main-thread work. The results of the Lighthouse audits show:

| Page | Performance | Accessibility | Best Practices | SEO | Total Blocking Time (TBT) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Salaries Page (`/salaries`)** | **86** | **100** | **100** | **100** | **294 ms** |
| **Compare Page (`/compare`)** | **88** | **100** | **100** | **100** | **259 ms** |
| **Company Page (`/companies/google`)** | **91** | **98** | **100** | **100** | **203 ms** |

### Key Optimizations Implemented:
1.  **Server-side Compare Resolution:**matched and resolved candidate comparison records on the server (`app/compare/page.tsx`) by parsing query parameters. This removed client-side hooks and selection recalculations, reducing TBT by **over 40%**.
2.  **Reduced Hydration Payload:** Server-side mapping strips unused metadata from the 70-record dropdown list, reducing the JSON payload from **26.74 KB to 15.84 KB** (a **40.8% reduction**) and avoiding the serialization/hydration of **490 duplicate properties**.
3.  **Lighthouse & Accessibility Remediation:** Adjusted color tokens globally in `app/globals.css` and badges to meet strict WCAG AA 4.5:1 contrast standards, and unified card heading tag flows from `<h3>` to `<h2>` to resolve heading order violations.
4.  **Static Pre-generation (generateStaticParams):** Pre-rendered 14 company pages at compile time, achieving instantaneous load times.

---

## 📁 Folder Structure

```
app/
  ├── layout.tsx            # Global HTML layout, Inter font configuration, SEO base
  ├── page.tsx              # Rich-aesthetic product landing page introducing TalentDash
  ├── not-found.tsx         # Themed 404 page for invalid routes and unrecognized slugs
  ├── salaries/
  │   └── page.tsx          # Flagship Server Component parsing query parameters and JSON-LD
  ├── companies/
  │   └── [slug]/
  │       └── page.tsx      # Static pre-rendered company profile page (generateStaticParams)
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
  ├── config.ts             # Exchange rates configuration and static company profile lookup
  ├── mock-data.ts          # 70-record normalized dataset with computed values at runtime
  └── utils.ts              # Mathematical median calculations and lakh/crore formatting
types/
  └── index.ts              # Strict TypeScript interfaces matching TalentDash contracts
```

---

## 🔍 SEO Features

*   **Dynamic Metadata:** `generateMetadata()` generates page-specific semantic titles and meta descriptions (e.g. *"Staff Software Engineer Salaries at Amazon India | TalentDash"*).
*   **Open Graph Tags:** Embedded metadata for rich previews on social shares, including site name, description, title, URL, and page type.
*   **Canonical URLs:** Custom alternates dynamically mapped to prevent duplicate indexing across long-tail filter chains.
*   **JSON-LD Structured Data:**
    *   `/salaries` generates a `Dataset` schema containing active listings.
    *   `/companies/[slug]` generates an `Organization` schema incorporating headquarters, founding date, employee headcount ranges, and description profiles.

---

## 💻 Getting Started

### Installation
Clone this repository and install dependencies:
```bash
npm install
```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open your browser to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📦 Build Commands

### Compile Production Build
To compile the production bundles and generate static route parameter bindings:
```bash
npm run build
```

### Start Production Server
To run the production Next.js server locally:
```bash
npm run start
```

---

## 📸 Screenshots

Below are placeholders for the primary layouts of the TalentDash Career Intelligence Platform:

### Homepage
*Placeholder for Homepage Layout*
![Homepage Placeholder](/public/screenshots/homepage-placeholder.png)

### Salaries Page
*Placeholder for Salaries Page & Filters Layout*
![Salaries Page Placeholder](/public/screenshots/salaries-placeholder.png)

### Company Page
*Placeholder for Company Profiles & Level Distribution Charts*
![Company Page Placeholder](/public/screenshots/company-placeholder.png)

### Compare Page
*Placeholder for Side-by-side Delta Checks Matrix*
![Compare Page Placeholder](/public/screenshots/compare-placeholder.png)

---

## 👤 Author

*   **Author:** Shivam Bindal
*   **GitHub:** [Shivam-Bindal-tech](https://github.com/Shivam-Bindal-tech)
