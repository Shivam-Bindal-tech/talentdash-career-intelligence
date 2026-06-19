import { Metadata } from "next";
import Link from "next/link";
import { MOCK_SALARY_RECORDS } from "@/lib/mock-data";
import { LevelStandardized } from "@/types";
import { convertCompensation, getCompanyDisplayName } from "@/lib/utils";
import FilterBar from "@/components/features/salary/filter-bar";
import SalaryTable from "@/components/features/salary/salary-table";
import Pagination from "@/components/features/salary/pagination";

// Strict Next.js 15 Page Props interface
interface SalariesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Dynamic SEO Metadata Generation based on searchParams
export async function generateMetadata({ searchParams }: SalariesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const company = params.company as string || "";
  const role = params.role as string || "";

  let title = "Software Engineer & PM Salaries | TalentDash";
  let description = "Explore decision-ready compensation intelligence. Find base salary, stock, and total compensation distributions.";

  if (company && role) {
    const formattedCompany = getCompanyDisplayName(company);
    title = `${role} Salaries at ${formattedCompany} | TalentDash`;
    description = `Compare ${role} compensation records at ${formattedCompany}. Verify base salary, stock, and bonus statistics.`;
  } else if (company) {
    const formattedCompany = getCompanyDisplayName(company);
    title = `Verified Salaries at ${formattedCompany} | TalentDash`;
    description = `Analyze verified salaries, stock grants, and median compensation statistics at ${formattedCompany}.`;
  } else if (role) {
    title = `${role} Compensation Listings | TalentDash`;
    description = `Discover base salary ranges, average stock, and total compensation distribution for ${role} positions.`;
  }

  const canonical = `https://talentdash.com/salaries${
    company ? `?company=${company}` : ""
  }`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "TalentDash",
      type: "website",
    },
  };
}

export default async function SalariesPage({ searchParams }: SalariesPageProps) {
  // Await searchParams as required by Next.js 15 App Router
  const params = await searchParams;

  // Extract raw query filters
  const filterCompany = (params.company as string || "").toLowerCase().trim();
  const filterRole = (params.role as string || "").trim();
  const filterLocation = (params.location as string || "").trim();
  const filterCurrency = (params.currency as "INR" | "USD" || "INR");
  
  // Parse levels multiselect
  const rawLevels = params.level as string || "";
  const filterLevels = rawLevels ? rawLevels.split(",") : [];

  // Parse sorting params
  const sortKey = (params.sort as string || "total_compensation");
  const sortOrder = (params.order as "asc" | "desc" || "desc");

  // Parse pagination params
  const currentPage = Math.max(1, parseInt(params.page as string || "1", 10));
  const recordsPerPage = 25;

  // 1. DYNAMIC DROPDOWNS: Extract unique roles and locations from the entire dataset
  const uniqueRoles = Array.from(new Set(MOCK_SALARY_RECORDS.map((r) => r.role))).sort();
  const uniqueLocations = Array.from(new Set(MOCK_SALARY_RECORDS.map((r) => r.location))).sort();
  
  // List of all valid levels standardized enum options
  const allLevels: LevelStandardized[] = [
    "L3", "L4", "L5", "L6",
    "SDE-I", "SDE-II", "SDE-III",
    "Staff", "Principal",
    "IC4", "IC5"
  ];

  // 2. SERVER-SIDE FILTERING
  const filteredRecords = MOCK_SALARY_RECORDS.filter((record) => {
    // Company filter (partial match)
    if (filterCompany && !record.company.toLowerCase().includes(filterCompany)) {
      return false;
    }
    // Role filter (exact match)
    if (filterRole && record.role !== filterRole) {
      return false;
    }
    // Location filter (exact match)
    if (filterLocation && record.location !== filterLocation) {
      return false;
    }
    // Levels filter (multi-select match)
    if (filterLevels.length > 0 && !filterLevels.includes(record.level_standardized)) {
      return false;
    }
    return true;
  });

  // 3. SERVER-SIDE SORTING (using normalized USD values to maintain absolute sorting correctness)
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortKey === "total_compensation") {
      valA = convertCompensation(a.total_compensation, a.currency, "USD");
      valB = convertCompensation(b.total_compensation, b.currency, "USD");
    } else if (sortKey === "base_salary") {
      valA = convertCompensation(a.base_salary, a.currency, "USD");
      valB = convertCompensation(b.base_salary, b.currency, "USD");
    } else if (sortKey === "stock") {
      valA = convertCompensation(a.stock, a.currency, "USD");
      valB = convertCompensation(b.stock, b.currency, "USD");
    } else if (sortKey === "experience_years") {
      valA = a.experience_years;
      valB = b.experience_years;
    }

    if (sortOrder === "asc") {
      return valA - valB;
    } else {
      return valB - valA;
    }
  });

  // 4. SERVER-SIDE PAGINATION
  const totalRecords = sortedRecords.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = sortedRecords.slice(startIndex, startIndex + recordsPerPage);

  // 5. DYNAMIC JSON-LD structured data dataset generation
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "name": `TalentDash Verified Compensation Database ${
      filterCompany ? `for ${getCompanyDisplayName(filterCompany)}` : ""
    }`,
    "description": `Comprehensive directory of structured software engineering, PM, and data analyst compensation files${
      filterCompany ? ` at ${getCompanyDisplayName(filterCompany)}` : ""
    }. Covers base salary, stock, and bonuses.`,
    "url": `https://talentdash.com/salaries?currency=${filterCurrency}`,
    "license": "https://creativecommons.org/licenses/by/4.0/",
    "creator": {
      "@type": "Organization",
      "name": "TalentDash",
      "url": "https://talentdash.com"
    },
    "hasPart": paginatedRecords.slice(0, 5).map((rec) => ({
      "@type": "PropertyValueSpecification",
      "name": `${rec.role} (${rec.level_standardized})`,
      "value": convertCompensation(rec.total_compensation, rec.currency, filterCurrency)
    }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-airbnb-black font-sans pb-16">
      {/* Inject Dynamic JSON-LD dataset schema for SEO indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
      />

      {/* Global Navigation Header */}
      <header className="border-b border-light-border bg-surface-bg sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 flex items-center justify-center bg-coral text-white font-bold rounded-lg text-lg group-hover:scale-[1.02] transition-transform">
              T
            </div>
            <span className="font-bold text-xl tracking-tight text-airbnb-black">
              Talent<span className="text-coral">Dash</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/salaries"
              className="text-sm font-bold text-coral border-b-2 border-coral pb-1 transition-colors"
            >
              Salaries
            </Link>
            <Link
              href="/compare"
              className="text-sm font-semibold text-soft-dark-gray hover:text-coral transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>

      {/* Flagship Body Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-6">
        {/* Title Heading Area */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-airbnb-black tracking-tight leading-tight">
            {filterCompany ? (
              <>
                Compensation Records at{" "}
                <span className="text-coral">{getCompanyDisplayName(filterCompany)}</span>
              </>
            ) : (
              "Compensation Intelligence Database"
            )}
          </h1>
          <p className="text-base text-soft-dark-gray">
            Explore verified, structured salary packages. Filter by role, level, location, and toggle currencies.
          </p>
        </div>

        {/* Filter Bar Component */}
        <FilterBar
          roles={uniqueRoles}
          locations={uniqueLocations}
          levels={allLevels}
          initialFilters={{
            company: params.company as string || "",
            role: filterRole,
            location: filterLocation,
            levels: filterLevels,
            currency: filterCurrency,
          }}
        />

        {/* Render Table or Empty State */}
        {totalRecords === 0 ? (
          <div className="w-full bg-surface-bg border border-light-border rounded-xl py-16 px-6 text-center shadow-sm flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-coral/10 text-coral flex items-center justify-center text-xl font-bold select-none">
              !
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-bold text-lg text-airbnb-black">No records found for these filters</h2>
              <p className="text-sm text-neutral-gray max-w-md mx-auto">
                No compensation records match your active selections. Try resetting your search query or removing filters.
              </p>
            </div>
            <Link
              href="/salaries"
              className="mt-2 bg-coral text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
            >
              Clear All Filters
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Core Table */}
            <SalaryTable
              records={paginatedRecords}
              displayCurrency={filterCurrency}
              searchParams={params}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalRecords}
                limit={recordsPerPage}
                searchParams={params}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
export const revalidate = 3600; // Enable ISR (cache rebuild hourly)
