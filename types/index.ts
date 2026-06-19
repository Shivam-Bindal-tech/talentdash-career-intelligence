export type LevelStandardized =
  | "L3"
  | "L4"
  | "L5"
  | "L6"
  | "SDE-I"
  | "SDE-II"
  | "SDE-III"
  | "Staff"
  | "Principal"
  | "IC4"
  | "IC5";

export type Currency = "INR" | "USD" | "GBP" | "EUR";

export type Source = "CONTRIBUTOR" | "SCRAPED" | "AI_INFERRED";

export interface SalaryRecord {
  id: string;
  company: string; // normalized: lowercase + trimmed, e.g. "google"
  company_slug: string; // URL-safe slug, e.g. "google"
  role: string;
  level_standardized: LevelStandardized;
  location: string;
  currency: Currency;
  experience_years: number;
  base_salary: number; // annual base, in smallest unit (paise/cents)
  bonus: number; // annual bonus, in smallest unit, default 0
  stock: number; // annual stock, in smallest unit, default 0
  total_compensation: number; // computed base + bonus + stock, in smallest unit
  source: Source;
  confidence_score: number; // 0.0 - 1.0
  is_verified: boolean;
  submitted_at: string; // ISO date string
}

export interface CompanyMetadata {
  name: string; // Display name, e.g., "Google India" or "NVIDIA"
  slug: string; // URL-safe slug matching record.company_slug
  industry: string;
  headquarters: string;
  foundedYear: number;
  headcountRange: string;
  description: string;
}
