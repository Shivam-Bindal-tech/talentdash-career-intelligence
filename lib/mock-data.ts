import { SalaryRecord } from "@/types";

// Raw records without total_compensation, which we will compute programmatically
const RAW_SALARY_RECORDS = [
  // --- GOOGLE (8 records) ---
  {
    id: "g1-f40b-4eb1-b3b2-4d2c8ea3db18",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "L3" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 180000000, // ₹18,00,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 120000000,       // ₹12,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-05-10T10:30:00Z",
  },
  {
    id: "g2-6415-4672-921a-e9fa7b55928d",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "L4" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 260000000, // ₹26,00,000 in paise
    bonus: 35000000,        // ₹3,50,000 in paise
    stock: 220000000,       // ₹22,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.9,
    is_verified: true,
    submitted_at: "2026-04-12T14:22:00Z",
  },
  {
    id: "g3-d144-4cb6-86eb-95629fe6caab",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "L5" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 6,
    base_salary: 380000000, // ₹38,00,000 in paise
    bonus: 50000000,        // ₹5,00,000 in paise
    stock: 450000000,       // ₹45,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.98,
    is_verified: true,
    submitted_at: "2026-06-01T09:15:00Z",
  },
  {
    id: "g4-256f-4091-a1b4-2ad95feee6b2",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "L6" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 10,
    base_salary: 550000000, // ₹55,00,000 in paise
    bonus: 90000000,        // ₹9,00,000 in paise
    stock: 800000000,       // ₹80,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.75,
    is_verified: true,
    submitted_at: "2026-03-20T11:45:00Z",
  },
  {
    id: "g5-76e3-46c5-a6e5-42a926fe5753",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "Principal" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 15,
    base_salary: 950000000, 
    bonus: 200000000,
    stock: 2500000000,
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-05-30T16:10:00Z",
  },
  {
    id: "g6-b9a3-4a1a-a3a2-fb9f82d2c140",
    company: "google",
    company_slug: "google",
    role: "Product Manager",
    level_standardized: "L4" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 240000000, // ₹24,00,000 in paise
    bonus: 30000000,        // ₹3,00,000 in paise
    stock: 180000000,       // ₹18,00,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.65,
    is_verified: false,
    submitted_at: "2026-06-05T07:22:00Z",
  },
  {
    id: "g7-7b2a-4db3-ae18-f29db42d76a7",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "L4" as const,
    location: "San Francisco",
    currency: "USD" as const,
    experience_years: 2,
    base_salary: 16500000, // $165,000 in cents
    bonus: 2500000,        // $25,000 in cents
    stock: 9000000,        // $90,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.97,
    is_verified: true,
    submitted_at: "2026-05-18T18:30:00Z",
  },
  {
    id: "g8-1c4b-4bda-be9a-a82f8d22384a",
    company: "google",
    company_slug: "google",
    role: "Software Engineer",
    level_standardized: "Principal" as const,
    location: "San Francisco",
    currency: "USD" as const,
    experience_years: 16,
    base_salary: 35000000, // $350,000 in cents
    bonus: 10000000,       // $100,000 in cents
    stock: 55000000,       // $550,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.99,
    is_verified: true,
    submitted_at: "2026-06-12T20:05:00Z",
  },

  // --- AMAZON (8 records) ---
  {
    id: "a1-9a1b-4cd2-b3b3-5e2d9eb4db28",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 160000000, // ₹16,00,000 in paise
    bonus: 40000000,        // ₹4,00,000 in paise
    stock: 50000000,        // ₹5,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.92,
    is_verified: true,
    submitted_at: "2026-05-22T12:00:00Z",
  },
  {
    id: "a2-7b2c-461a-9fa8-e9f0862b740e",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 280000000, // ₹28,00,000 in paise
    bonus: 50000000,        // ₹5,00,000 in paise
    stock: 140000000,       // ₹14,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-06-03T15:45:00Z",
  },
  {
    id: "a3-d7c3-4d43-9ba8-4c12bb92ea12",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 8,
    base_salary: 450000000, // ₹45,00,000 in paise
    bonus: 30000000,        // ₹3,00,000 in paise (Lower cash bonus at L6)
    stock: 480000000,       // ₹48,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.68,
    is_verified: true,
    submitted_at: "2026-02-18T09:12:00Z",
  },
  {
    id: "a4-23be-46e2-9b2f-98a2feee71aa",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "Staff" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 12,
    base_salary: 650000000,  // ₹65,00,000 in paise
    bonus: 0,                // NO BONUS case
    stock: 950000000,        // ₹95,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.93,
    is_verified: true,
    submitted_at: "2026-05-15T14:40:00Z",
  },
  {
    id: "a5-1d4a-4ba3-ae9e-9d2cb3db5e11",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "Principal" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 16,
    base_salary: 950000000,  // ₹95,00,000 in paise
    bonus: 0,                // NO BONUS case
    stock: 2200000000,       // ₹2.2 Crore in paise = 2,20,00,000 INR = 2,200,000,000 paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-06-11T10:15:00Z",
  },
  {
    id: "a6-a3d8-4b7e-91c2-19e42cb23b12",
    company: "amazon",
    company_slug: "amazon",
    role: "Product Manager",
    level_standardized: "SDE-II" as const, // Maps to SDE-II (L5 PM)
    location: "Hyderabad",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 260000000, // ₹26,00,000 in paise
    bonus: 40000000,        // ₹4,00,000 in paise
    stock: 120000000,       // ₹12,00,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.72,
    is_verified: true,
    submitted_at: "2026-05-02T13:10:00Z",
  },
  {
    id: "a7-b1a9-46be-8f3a-a12bdfd04ab9",
    company: "amazon",
    company_slug: "amazon",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Seattle",
    currency: "USD" as const,
    experience_years: 3,
    base_salary: 16000000, // $160,000 in cents
    bonus: 2000000,        // $20,000 in cents
    stock: 7500000,        // $75,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-06-10T17:40:00Z",
  },
  {
    id: "a8-12ab-4cc1-8e9a-77ffc2dd99ff",
    company: "amazon",
    company_slug: "amazon",
    role: "Data Analyst",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 110000000, // ₹11,00,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 0,               // NO STOCK case
    source: "SCRAPED" as const,
    confidence_score: 0.58,
    is_verified: false,
    submitted_at: "2026-04-30T09:50:00Z",
  },

  // --- MICROSOFT (7 records) ---
  {
    id: "m1-6f1a-4ab2-92c2-be5d86ca3b10",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Software Engineer",
    level_standardized: "L5" as const, // L59 SDE-I
    location: "Hyderabad",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 175000000, // ₹17,50,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 80000000,        // ₹8,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.91,
    is_verified: true,
    submitted_at: "2026-06-08T11:00:00Z",
  },
  {
    id: "m2-8e1c-4b3d-9fa2-fe1a9862b2a1",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Software Engineer",
    level_standardized: "L6" as const, // L61/L62 SDE-II
    location: "Hyderabad",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 285000000, // ₹28,50,000 in paise
    bonus: 35000000,        // ₹3,50,000 in paise
    stock: 180000000,       // ₹18,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-05-19T14:15:00Z",
  },
  {
    id: "m3-db14-46c5-92ff-1ad92bfe6a72",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Software Engineer",
    level_standardized: "Staff" as const, // L63/L64 Senior
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 9,
    base_salary: 420000000, // ₹42,00,000 in paise
    bonus: 50000000,        // ₹5,00,000 in paise
    stock: 350000000,       // ₹35,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.77,
    is_verified: true,
    submitted_at: "2026-04-10T10:00:00Z",
  },
  {
    id: "m4-2d9f-409c-a7a7-ad926fea7b09",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Software Engineer",
    level_standardized: "Principal" as const, // L65+
    location: "Hyderabad",
    currency: "INR" as const,
    experience_years: 14,
    base_salary: 720000000,  // ₹72,00,000 in paise
    bonus: 120000000,        // ₹12,00,000 in paise
    stock: 1500000000,       // ₹1.5 Crore in paise = 1,50,00,000 INR = 1,500,000,000 paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-05-25T13:40:00Z",
  },
  {
    id: "m5-7be3-46c9-ae02-ab26df9eb5a1",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Product Manager",
    level_standardized: "L6" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 6,
    base_salary: 310000000, // ₹31,00,000 in paise
    bonus: 40000000,        // ₹4,00,000 in paise
    stock: 160000000,       // ₹16,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.89,
    is_verified: true,
    submitted_at: "2026-06-04T12:00:00Z",
  },
  {
    id: "m6-9c3f-42e1-a3f2-bcdd2fea5c12",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Software Engineer",
    level_standardized: "L6" as const,
    location: "Redmond",
    currency: "USD" as const,
    experience_years: 4,
    base_salary: 17200000, // $172,000 in cents
    bonus: 2200000,        // $22,000 in cents
    stock: 6000000,        // $60,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.97,
    is_verified: true,
    submitted_at: "2026-06-09T09:30:00Z",
  },
  {
    id: "m7-1d2a-46be-9fa8-ad92b2ff89cc",
    company: "microsoft",
    company_slug: "microsoft",
    role: "Data Analyst",
    level_standardized: "L5" as const,
    location: "Noida",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 135000000, // ₹13,50,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 45000000,        // ₹4,50,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.62,
    is_verified: false,
    submitted_at: "2026-05-12T15:20:00Z",
  },

  // --- META (6 records) ---
  {
    id: "me1-4f1a-46cd-ae3b-a26bdf9e7611",
    company: "meta",
    company_slug: "meta",
    role: "Software Engineer",
    level_standardized: "L4" as const, // E4
    location: "London",
    currency: "GBP" as const,
    experience_years: 3,
    base_salary: 9500000,  // £95,000 in pence
    bonus: 1000000,        // £10,000 in pence
    stock: 5500000,        // £55,000 in pence
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-06-07T16:15:00Z",
  },
  {
    id: "me2-8be3-4ab6-8fa7-e9fa62ff2ab4",
    company: "meta",
    company_slug: "meta",
    role: "Software Engineer",
    level_standardized: "L5" as const, // E5
    location: "London",
    currency: "GBP" as const,
    experience_years: 7,
    base_salary: 13500000, // £135,000 in pence
    bonus: 2000000,        // £20,000 in pence
    stock: 12000000,       // £120,000 in pence
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-05-24T11:45:00Z",
  },
  {
    id: "me3-d14c-42e5-a3f2-1ad2bfea6b28",
    company: "meta",
    company_slug: "meta",
    role: "Software Engineer",
    level_standardized: "L4" as const, // E4
    location: "Menlo Park",
    currency: "USD" as const,
    experience_years: 2,
    base_salary: 17500000, // $175,000 in cents
    bonus: 1750000,        // $17,500 in cents
    stock: 9000000,        // $90,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.98,
    is_verified: true,
    submitted_at: "2026-06-11T13:20:00Z",
  },
  {
    id: "me4-23fe-46b9-92c2-ab26dfeb5a11",
    company: "meta",
    company_slug: "meta",
    role: "Software Engineer",
    level_standardized: "L5" as const, // E5
    location: "Menlo Park",
    currency: "USD" as const,
    experience_years: 6,
    base_salary: 21500000, // $215,000 in cents
    bonus: 3200000,        // $32,000 in cents
    stock: 16500000,       // $165,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.97,
    is_verified: true,
    submitted_at: "2026-06-13T10:00:00Z",
  },
  {
    id: "me5-7b2a-4db5-9e1e-2ad96ffeb512",
    company: "meta",
    company_slug: "meta",
    role: "Product Manager",
    level_standardized: "L5" as const, // E5 PM
    location: "Menlo Park",
    currency: "USD" as const,
    experience_years: 7,
    base_salary: 20500000, // $205,000 in cents
    bonus: 2500000,        // $25,000 in cents
    stock: 13500000,       // $135,000 in cents
    source: "SCRAPED" as const,
    confidence_score: 0.74,
    is_verified: true,
    submitted_at: "2026-03-15T15:30:00Z",
  },
  {
    id: "me6-6c1f-4bda-be9a-a82f8d2238ff",
    company: "meta",
    company_slug: "meta",
    role: "Software Engineer",
    level_standardized: "Staff" as const, // E6
    location: "Menlo Park",
    currency: "USD" as const,
    experience_years: 11,
    base_salary: 27000000, // $270,000 in cents
    bonus: 5400000,        // $54,000 in cents
    stock: 32000000,       // $320,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.99,
    is_verified: true,
    submitted_at: "2026-06-12T16:00:00Z",
  },

  // --- NVIDIA (6 records) ---
  {
    id: "n1-f40b-46be-9ab2-ad92ffeb7611",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Software Engineer",
    level_standardized: "IC4" as const, // Senior
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 7,
    base_salary: 360000000, // ₹36,00,000 in paise
    bonus: 40000000,        // ₹4,00,000 in paise
    stock: 350000000,       // ₹35,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.92,
    is_verified: true,
    submitted_at: "2026-05-18T10:15:00Z",
  },
  {
    id: "n2-8be3-46bd-9fa7-a26bdf9e5a12",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Software Engineer",
    level_standardized: "IC5" as const, // Staff
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 12,
    base_salary: 580000000,  // ₹58,00,000 in paise
    bonus: 80000000,         // ₹8,00,000 in paise
    stock: 1200000000,       // ₹1.2 Crore in paise = 1,20,00,000 INR = 1,200,000,000 paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-06-02T13:45:00Z",
  },
  {
    id: "n3-d14c-4eb2-ae2b-1ad92bfe5a89",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Software Engineer",
    level_standardized: "IC4" as const,
    location: "Santa Clara",
    currency: "USD" as const,
    experience_years: 6,
    base_salary: 20000000, // $200,000 in cents
    bonus: 3000000,        // $30,000 in cents
    stock: 24000000,       // $240,000 in cents (High stock appreciation)
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.97,
    is_verified: true,
    submitted_at: "2026-06-06T15:20:00Z",
  },
  {
    id: "n4-2d9f-46b9-ae7b-ab26df9e76aa",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Hardware Engineer",
    level_standardized: "IC4" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 8,
    base_salary: 380000000, // ₹38,00,000 in paise
    bonus: 45000000,        // ₹4,50,000 in paise
    stock: 280000000,       // ₹28,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.71,
    is_verified: true,
    submitted_at: "2026-03-12T11:00:00Z",
  },
  {
    id: "n5-7be3-46c5-a2a9-adb6dfeb5a11",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Software Engineer",
    level_standardized: "Principal" as const,
    location: "Santa Clara",
    currency: "USD" as const,
    experience_years: 15,
    base_salary: 31000000, // $310,000 in cents
    bonus: 6000000,        // $60,000 in cents
    stock: 68000000,       // $680,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.98,
    is_verified: true,
    submitted_at: "2026-06-12T17:10:00Z",
  },
  {
    id: "n6-9c3f-42e5-ad2b-bcddfea5a123",
    company: "nvidia",
    company_slug: "nvidia",
    role: "Data Analyst",
    level_standardized: "IC4" as const,
    location: "Pune",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 195000000, // ₹19,50,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 80000000,        // ₹8,00,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.64,
    is_verified: false,
    submitted_at: "2026-05-30T10:00:00Z",
  },

  // --- FLIPKART (6 records) ---
  {
    id: "f1-f40b-46cd-9fa2-ab26df9ea111",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 145000000, // ₹14,50,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 40000000,        // ₹4,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-06-04T08:30:00Z",
  },
  {
    id: "f2-8be3-46c5-9fa8-a2d9ffeb5a22",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 240000000, // ₹24,00,000 in paise
    bonus: 25000000,        // ₹2,50,000 in paise
    stock: 90000000,        // ₹9,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.92,
    is_verified: true,
    submitted_at: "2026-05-17T11:45:00Z",
  },
  {
    id: "f3-d14c-4eb9-ae7b-1ad9dfeb5a88",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 7,
    base_salary: 380000000, // ₹38,00,000 in paise
    bonus: 45000000,        // ₹4,50,000 in paise
    stock: 220000000,       // ₹22,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-06-01T15:20:00Z",
  },
  {
    id: "f4-2d9f-46b5-ae2b-ab26dfeb76bb",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Product Manager",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 280000000, // ₹28,00,000 in paise
    bonus: 35000000,        // ₹3,50,000 in paise
    stock: 120000000,       // ₹12,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.76,
    is_verified: true,
    submitted_at: "2026-04-22T14:10:00Z",
  },
  {
    id: "f5-7be3-46c2-a2a9-adb9dfeb5a22",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Software Engineer",
    level_standardized: "Staff" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 11,
    base_salary: 580000000, // ₹58,00,000 in paise
    bonus: 60000000,        // ₹6,00,000 in paise
    stock: 450000000,       // ₹45,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-05-28T16:00:00Z",
  },
  {
    id: "f6-9c3f-42e1-ad7b-bcddfeb5a124",
    company: "flipkart",
    company_slug: "flipkart",
    role: "Data Analyst",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 105000000, // ₹10,50,000 in paise
    bonus: 10000000,        // ₹1,00,000 in paise
    stock: 20000000,        // ₹2,00,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.61,
    is_verified: false,
    submitted_at: "2026-05-15T09:45:00Z",
  },

  // --- RAZORPAY (5 records) ---
  {
    id: "r1-f40b-46cd-9fa8-ab26dfeb5a11",
    company: "razorpay",
    company_slug: "razorpay",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 130000000, // ₹13,00,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 30000000,        // ₹3,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.93,
    is_verified: true,
    submitted_at: "2026-06-05T11:20:00Z",
  },
  {
    id: "r2-8be3-46c9-9fa2-a2d9dfeb5a33",
    company: "razorpay",
    company_slug: "razorpay",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 220000000, // ₹22,00,000 in paise
    bonus: 25000000,        // ₹2,50,000 in paise
    stock: 75000000,        // ₹7,50,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-05-20T14:30:00Z",
  },
  {
    id: "r3-d14c-4eb5-ae2b-1ad9dfeb5a99",
    company: "razorpay",
    company_slug: "razorpay",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 7,
    base_salary: 355000000, // ₹35,50,000 in paise
    bonus: 40000000,        // ₹4,00,000 in paise
    stock: 180000000,       // ₹18,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.97,
    is_verified: true,
    submitted_at: "2026-06-01T10:00:00Z",
  },
  {
    id: "r4-2d9f-46b5-ae2b-ab26dfeb5a77",
    company: "razorpay",
    company_slug: "razorpay",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Remote",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 240000000, // ₹24,00,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 60000000,        // ₹6,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.78,
    is_verified: true,
    submitted_at: "2026-04-18T16:22:00Z",
  },
  {
    id: "r5-7be3-46c5-a2a9-adb9dfeb5a33",
    company: "razorpay",
    company_slug: "razorpay",
    role: "Product Manager",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 250000000, // ₹25,00,000 in paise
    bonus: 30000000,        // ₹3,00,000 in paise
    stock: 100000000,       // ₹10,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.88,
    is_verified: true,
    submitted_at: "2026-06-03T12:00:00Z",
  },

  // --- MEESHO (5 records) ---
  {
    id: "ms1-f40b-46cd-9fa8-ab26dfeb5a22",
    company: "meesho",
    company_slug: "meesho",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 140000000, // ₹14,00,000 in paise
    bonus: 10000000,        // ₹1,00,000 in paise
    stock: 30000000,        // ₹3,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.91,
    is_verified: true,
    submitted_at: "2026-06-02T09:00:00Z",
  },
  {
    id: "ms2-8be3-46c9-9fa2-a2d9dfeb5a44",
    company: "meesho",
    company_slug: "meesho",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 245000000, // ₹24,50,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 80000000,        // ₹8,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.93,
    is_verified: true,
    submitted_at: "2026-05-18T13:45:00Z",
  },
  {
    id: "ms3-d14c-4eb5-ae2b-1ad9dfeb5a11",
    company: "meesho",
    company_slug: "meesho",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 7,
    base_salary: 375000000, // ₹37,50,000 in paise
    bonus: 30000000,        // ₹3,00,000 in paise
    stock: 200000000,       // ₹20,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-05-30T11:15:00Z",
  },
  {
    id: "ms4-2d9f-46b5-ae2b-ab26dfeb5a88",
    company: "meesho",
    company_slug: "meesho",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 220000000, // ₹22,00,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 60000000,        // ₹6,00,000 in paise
    source: "SCRAPED" as const,
    confidence_score: 0.75,
    is_verified: true,
    submitted_at: "2026-03-24T10:00:00Z",
  },
  {
    id: "ms5-7be3-46c5-a2a9-adb9dfeb5a44",
    company: "meesho",
    company_slug: "meesho",
    role: "Data Analyst",
    level_standardized: "SDE-I" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 95000000,  // ₹9,50,000 in paise
    bonus: 8000000,         // ₹80,00,000 in paise? Wait, 80k is 8000000 paise
    stock: 15000000,        // ₹1,50,000 in paise
    source: "AI_INFERRED" as const,
    confidence_score: 0.63,
    is_verified: false,
    submitted_at: "2026-05-04T15:30:00Z",
  },

  // --- TCS (5 records) ---
  {
    id: "t1-f40b-46cd-9fa8-ab26dfeb5a33",
    company: "tcs",
    company_slug: "tcs",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const, // Ninja SDE
    location: "Pune",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 36000000, // ₹3,60,000 in paise
    bonus: 0,              // NO BONUS
    stock: 0,              // NO STOCK
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.9,
    is_verified: true,
    submitted_at: "2026-06-03T09:00:00Z",
  },
  {
    id: "t2-8be3-46c9-9fa2-a2d9dfeb5a55",
    company: "tcs",
    company_slug: "tcs",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const, // Digital SDE
    location: "Pune",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 70000000, // ₹7,00,000 in paise
    bonus: 5000000,        // ₹50,000 in paise
    stock: 0,              // NO STOCK
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.92,
    is_verified: true,
    submitted_at: "2026-05-15T13:20:00Z",
  },
  {
    id: "t3-d14c-4eb5-ae2b-1ad9dfeb5a22",
    company: "tcs",
    company_slug: "tcs",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const, // Systems Engineer
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 110000000, // ₹11,00,000 in paise
    bonus: 8000000,         // ₹80,000 in paise
    stock: 0,               // NO STOCK
    source: "SCRAPED" as const,
    confidence_score: 0.69,
    is_verified: true,
    submitted_at: "2026-04-12T10:15:00Z",
  },
  {
    id: "t4-2d9f-46b5-ae2b-ab26dfeb5a99",
    company: "tcs",
    company_slug: "tcs",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const, // IT Analyst
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 8,
    base_salary: 165000000, // ₹16,50,000 in paise
    bonus: 12000000,        // ₹1,20,000 in paise
    stock: 0,               // NO STOCK
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-05-28T14:40:00Z",
  },
  {
    id: "t5-7be3-46c5-a2a9-adb9dfeb5a55",
    company: "tcs",
    company_slug: "tcs",
    role: "Software Engineer",
    level_standardized: "Staff" as const, // Consultant
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 12,
    base_salary: 260000000, // ₹26,00,000 in paise
    bonus: 25000000,        // ₹2,50,000 in paise
    stock: 0,               // NO STOCK
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.91,
    is_verified: true,
    submitted_at: "2026-06-02T16:00:00Z",
  },

  // --- INFOSYS (4 records) ---
  {
    id: "i1-f40b-46cd-9fa8-ab26dfeb5a44",
    company: "infosys",
    company_slug: "infosys",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const, // Systems Engineer
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 38000000, // ₹3,80,000 in paise
    bonus: 3000000,        // ₹30,000 in paise
    stock: 0,              // NO STOCK
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.89,
    is_verified: true,
    submitted_at: "2026-06-01T09:45:00Z",
  },
  {
    id: "i2-8be3-46c9-9fa2-a2d9dfeb5a66",
    company: "infosys",
    company_slug: "infosys",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const, // Technology Analyst
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 85000000, // ₹8,50,000 in paise
    bonus: 7000000,        // ₹70,000 in paise
    stock: 0,              // NO STOCK
    source: "SCRAPED" as const,
    confidence_score: 0.72,
    is_verified: true,
    submitted_at: "2026-03-18T14:15:00Z",
  },
  {
    id: "i3-d14c-4eb5-ae2b-1ad9dfeb5a33",
    company: "infosys",
    company_slug: "infosys",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const, // Technology Lead
    location: "Mysuru",
    currency: "INR" as const,
    experience_years: 7,
    base_salary: 140000000, // ₹14,00,000 in paise
    bonus: 10000000,        // ₹1,00,000 in paise
    stock: 20000000,        // ₹2,00,000 in paise (ESOP)
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.93,
    is_verified: true,
    submitted_at: "2026-05-22T10:10:00Z",
  },
  {
    id: "i4-2d9f-46b5-ae2b-ab26dfeb5a00",
    company: "infosys",
    company_slug: "infosys",
    role: "Product Manager",
    level_standardized: "SDE-II" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 5,
    base_salary: 160000000, // ₹16,00,000 in paise
    bonus: 15000000,        // ₹1,50,000 in paise
    stock: 0,               // NO STOCK
    source: "AI_INFERRED" as const,
    confidence_score: 0.65,
    is_verified: false,
    submitted_at: "2026-04-20T11:30:00Z",
  },

  // --- WIPRO (4 records) ---
  {
    id: "w1-f40b-46cd-9fa8-ab26dfeb5a55",
    company: "wipro",
    company_slug: "wipro",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const, // Project Engineer
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 35000000, // ₹3,50,000 in paise
    bonus: 2500000,        // ₹25,00,0 paise? Wait, 25k is 2500000 paise
    stock: 0,
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.88,
    is_verified: true,
    submitted_at: "2026-06-02T10:00:00Z",
  },
  {
    id: "w2-8be3-46c9-9fa2-a2d9dfeb5a77",
    company: "wipro",
    company_slug: "wipro",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const, // Senior Project Engineer
    location: "Hyderabad",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 80000000, // ₹8,00,000 in paise
    bonus: 6000000,        // ₹60,000 in paise
    stock: 0,
    source: "SCRAPED" as const,
    confidence_score: 0.7,
    is_verified: true,
    submitted_at: "2026-03-22T15:20:00Z",
  },
  {
    id: "w3-d14c-4eb5-ae2b-1ad9dfeb5a44",
    company: "wipro",
    company_slug: "wipro",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const, // Team Leader
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 8,
    base_salary: 150000000, // ₹15,00,000 in paise
    bonus: 12000000,        // ₹1,20,000 in paise
    stock: 0,
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.92,
    is_verified: true,
    submitted_at: "2026-05-24T11:00:00Z",
  },
  {
    id: "w4-2d9f-46b5-ae2b-ab26dfeb5a11",
    company: "wipro",
    company_slug: "wipro",
    role: "Data Analyst",
    level_standardized: "SDE-I" as const,
    location: "Kochi",
    currency: "INR" as const,
    experience_years: 2,
    base_salary: 62000000, // ₹6,20,000 in paise
    bonus: 4000000,        // ₹40,000 in paise
    stock: 0,
    source: "AI_INFERRED" as const,
    confidence_score: 0.61,
    is_verified: false,
    submitted_at: "2026-04-12T13:40:00Z",
  },

  // --- ZEPTO (4 records) ---
  {
    id: "z1-f40b-46cd-9fa8-ab26dfeb5a66",
    company: "zepto",
    company_slug: "zepto",
    role: "Software Engineer",
    level_standardized: "SDE-I" as const,
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 1,
    base_salary: 135000000, // ₹13,50,000 in paise
    bonus: 10000000,        // ₹1,00,000 in paise
    stock: 25000000,        // ₹2,50,000 in paise (ESOP)
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.94,
    is_verified: true,
    submitted_at: "2026-06-03T11:30:00Z",
  },
  {
    id: "z2-8be3-46c9-9fa2-a2d9dfeb5a88",
    company: "zepto",
    company_slug: "zepto",
    role: "Software Engineer",
    level_standardized: "SDE-II" as const,
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 3,
    base_salary: 230000000, // ₹23,00,000 in paise
    bonus: 20000000,        // ₹2,00,000 in paise
    stock: 60000000,        // ₹6,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-05-14T15:22:00Z",
  },
  {
    id: "z3-d14c-4eb5-ae2b-1ad9dfeb5a55",
    company: "zepto",
    company_slug: "zepto",
    role: "Software Engineer",
    level_standardized: "SDE-III" as const,
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 6,
    base_salary: 360000000, // ₹36,00,000 in paise
    bonus: 35000000,        // ₹3,50,000 in paise
    stock: 150000000,       // ₹15,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.96,
    is_verified: true,
    submitted_at: "2026-06-01T12:00:00Z",
  },
  {
    id: "z4-2d9f-46b5-ae2b-ab26dfeb5a22",
    company: "zepto",
    company_slug: "zepto",
    role: "Product Manager",
    level_standardized: "SDE-II" as const,
    location: "Mumbai",
    currency: "INR" as const,
    experience_years: 4,
    base_salary: 240000000, // ₹24,00,000 in paise
    bonus: 30000000,        // ₹3,00,000 in paise
    stock: 0,               // NO STOCK case
    source: "SCRAPED" as const,
    confidence_score: 0.77,
    is_verified: true,
    submitted_at: "2026-04-18T10:00:00Z",
  },

  // --- STRIPE (1 record - Single Record Company edge case) ---
  {
    id: "s1-f40b-46cd-9fa8-ab26dfeb5a77",
    company: "stripe",
    company_slug: "stripe",
    role: "Software Engineer",
    level_standardized: "L4" as const, // L4/IC4 SDE-II
    location: "San Francisco",
    currency: "USD" as const,
    experience_years: 3,
    base_salary: 17800000, // $178,000 in cents
    bonus: 2200000,        // $22,000 in cents
    stock: 8500000,        // $85,000 in cents
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.98,
    is_verified: true,
    submitted_at: "2026-06-14T09:00:00Z",
  },

  // --- LONG COMPANY NAME EDGE CASE (1 record) ---
  {
    id: "l1-f40b-46cd-9fa8-ab26dfeb5a88",
    company: "advanced-micro-devices-semiconductors-international-corporation",
    company_slug: "advanced-micro-devices-semiconductors-international-corporation",
    role: "Software Engineer",
    level_standardized: "L5" as const,
    location: "Bengaluru",
    currency: "INR" as const,
    experience_years: 6,
    base_salary: 320000000, // ₹32,00,000 in paise
    bonus: 4000000,        // ₹40,000 in paise (small bonus)
    stock: 120000000,       // ₹12,00,000 in paise
    source: "CONTRIBUTOR" as const,
    confidence_score: 0.95,
    is_verified: true,
    submitted_at: "2026-06-15T10:00:00Z",
  },
];

// Helper to compute total_compensation dynamically at runtime
// total_compensation = base_salary + bonus + stock
export const MOCK_SALARY_RECORDS: SalaryRecord[] = RAW_SALARY_RECORDS.map((rec) => {
  const base = rec.base_salary;
  const bonus = rec.bonus;
  const stock = rec.stock;
  return {
    ...rec,
    total_compensation: base + bonus + stock,
  };
});
