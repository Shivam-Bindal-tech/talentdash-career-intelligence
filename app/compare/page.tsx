import { Metadata } from "next";
import CompareTool from "@/components/features/compare/compare-tool";
import { MOCK_SALARY_RECORDS } from "@/lib/mock-data";

interface ComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
  title: "Compare Compensation Packages | TalentDash",
  description: "Compare side-by-side salary packages, equity grants, and bonuses. See exact compensation deltas in INR and USD.",
  alternates: {
    canonical: "https://talentdash.com/compare",
  },
  openGraph: {
    title: "Compare Compensation Packages | TalentDash",
    description: "Compare side-by-side salary packages, equity grants, and bonuses. See exact compensation deltas in INR and USD.",
    url: "https://talentdash.com/compare",
    siteName: "TalentDash",
    type: "website",
  },
};

export default async function ComparePage({ searchParams }: ComparePageProps) {
  const params = await searchParams;

  const s1Id = (params.s1 as string) || "";
  const s2Id = (params.s2 as string) || "";
  const c1Slug = (params.c1 as string) || "";

  // 1. Resolve selected records on the server
  const record1 = (() => {
    if (s1Id) return MOCK_SALARY_RECORDS.find((r) => r.id === s1Id) || MOCK_SALARY_RECORDS[0];
    if (c1Slug) {
      return MOCK_SALARY_RECORDS.find((r) => r.company_slug === c1Slug) || MOCK_SALARY_RECORDS[0];
    }
    return MOCK_SALARY_RECORDS[0];
  })();

  const record2 = (() => {
    if (s2Id) return MOCK_SALARY_RECORDS.find((r) => r.id === s2Id) || MOCK_SALARY_RECORDS[1] || MOCK_SALARY_RECORDS[0];
    const defaultRec = MOCK_SALARY_RECORDS.find((r) => r.id !== record1.id);
    return defaultRec || MOCK_SALARY_RECORDS[0];
  })();

  // 2. Map all records to a lightweight payload containing only fields required for search/dropdown
  const dropdownItems = MOCK_SALARY_RECORDS.map((r) => ({
    id: r.id,
    company: r.company,
    company_slug: r.company_slug,
    role: r.role,
    level_standardized: r.level_standardized,
    location: r.location,
    experience_years: r.experience_years,
    total_compensation: r.total_compensation,
    currency: r.currency,
  }));

  return (
    <CompareTool 
      initialRecord1={record1}
      initialRecord2={record2}
      dropdownItems={dropdownItems}
      searchParams={params} 
    />
  );
}
