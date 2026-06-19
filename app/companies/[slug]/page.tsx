import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MOCK_SALARY_RECORDS } from "@/lib/mock-data";
import { COMPANY_METADATA } from "@/lib/config";
import { formatCurrency, convertCompensation, calculateMedian, getCompanyDisplayName } from "@/lib/utils";
import SalaryTable from "@/components/features/salary/salary-table";
import Pagination from "@/components/features/salary/pagination";

// Next.js 15 page props signature
interface CompanyPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 1. Static pre-generation of all unique company pages at build time
export async function generateStaticParams() {
  const slugs = Array.from(new Set(MOCK_SALARY_RECORDS.map((r) => r.company_slug)));
  return slugs.map((slug) => ({ slug }));
}

// 2. Dynamic SEO metadata generation
export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const companyRecords = MOCK_SALARY_RECORDS.filter((r) => r.company_slug === slug);

  if (companyRecords.length === 0) {
    return {
      title: "Company Not Found | TalentDash",
    };
  }

  const displayName = getCompanyDisplayName(slug);
  
  // Find distinct levels to show range
  const uniqueLevels = Array.from(new Set(companyRecords.map((r) => r.level_standardized))).sort();
  const levelText = uniqueLevels.length > 1 
    ? `${uniqueLevels[0]} to ${uniqueLevels[uniqueLevels.length - 1]}`
    : uniqueLevels[0] || "All Levels";

  const title = `${displayName} Salaries & Compensation — ${levelText} | TalentDash`;
  const description = `Analyze verified salaries, stock grants, and median compensation packages at ${displayName}. Verify level distributions based on ${companyRecords.length} records.`;
  const canonical = `https://talentdash.com/companies/${slug}`;

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

export default async function CompanyPage({ params, searchParams }: CompanyPageProps) {
  // Await the page parameters and query strings
  const { slug } = await params;
  const parsedSearchParams = await searchParams;

  // Filter records for this specific company
  const companyRecords = MOCK_SALARY_RECORDS.filter((r) => r.company_slug === slug);

  // Trigger 404 if company does not exist in our data
  if (companyRecords.length === 0) {
    notFound();
  }

  const displayName = getCompanyDisplayName(slug);
  const metadata = COMPANY_METADATA[slug] || {
    name: displayName,
    slug: slug,
    industry: "Technology",
    headquarters: "Bengaluru, India",
    foundedYear: 2020,
    headcountRange: "1,000 - 5,000",
    description: `${displayName} is a leading enterprise in the industry, offering premium compensation plans.`,
  };

  // Currency toggle parameter
  const filterCurrency = (parsedSearchParams.currency as "INR" | "USD" || "INR");

  // Sorting params for company's salary table
  const sortKey = (parsedSearchParams.sort as string || "total_compensation");
  const sortOrder = (parsedSearchParams.order as "asc" | "desc" || "desc");

  // Pagination params
  const currentPage = Math.max(1, parseInt(parsedSearchParams.page as string || "1", 10));
  const recordsPerPage = 25;

  // 3. Dynamic statistic calculations
  const totalRecords = companyRecords.length;
  
  // Calculate true statistical median (INR & USD mapped based on active currency)
  const convertedCompensations = companyRecords.map((r) =>
    convertCompensation(r.total_compensation, r.currency, filterCurrency)
  );
  const medianTotalComp = calculateMedian(convertedCompensations);

  const convertedBases = companyRecords.map((r) =>
    convertCompensation(r.base_salary, r.currency, filterCurrency)
  );
  const minBase = Math.min(...convertedBases);
  const maxBase = Math.max(...convertedBases);

  // 4. Level distribution calculation
  const levelCounts: Record<string, number> = {};
  companyRecords.forEach((r) => {
    levelCounts[r.level_standardized] = (levelCounts[r.level_standardized] || 0) + 1;
  });

  // Unique levels sorted by count or tier
  const sortedLevelDistribution = Object.entries(levelCounts)
    .map(([level, count]) => ({
      level,
      count,
      percentage: (count / totalRecords) * 100,
    }))
    .sort((a, b) => b.count - a.count); // Show highest frequency first

  // 5. Server-side sorting for this company's records table
  const sortedRecords = [...companyRecords].sort((a, b) => {
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

  // 6. Server-side pagination slicing
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  // 7. Dynamic Organization JSON-LD structured data for index optimization
  const companyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": metadata.name,
    "url": `https://talentdash.com/companies/${metadata.slug}`,
    "logo": `https://talentdash.com/logos/${metadata.slug}.svg`,
    "description": metadata.description,
    "foundingDate": String(metadata.foundedYear),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": metadata.headquarters
    },
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": metadata.headcountRange
    },
    "location": {
      "@type": "Place",
      "name": metadata.headquarters
    }
  };

  // Color mappings for distribution bar
  const getLevelColor = (level: string) => {
    const lvl = level.toUpperCase();
    if (lvl === "L3" || lvl === "SDE-I") return "bg-slate-500";
    if (lvl === "L4" || lvl === "SDE-II") return "bg-blue-500";
    if (lvl === "L5" || lvl === "SDE-III") return "bg-indigo-600";
    if (lvl === "L6" || lvl === "STAFF") return "bg-purple-600";
    if (lvl.includes("PRINCIPAL")) return "bg-sky-950";
    return "bg-gray-400";
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-airbnb-black font-sans pb-16">
      {/* Inject Organization JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
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
              className="text-sm font-semibold text-soft-dark-gray hover:text-coral transition-colors"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-6">
        {/* Breadcrumb navigation */}
        <div className="text-xs text-neutral-gray flex items-center gap-2 font-medium">
          <Link href="/salaries" className="hover:text-coral transition-colors">Salaries</Link>
          <span>&gt;</span>
          <span className="text-airbnb-black font-semibold truncate">{metadata.name}</span>
        </div>

        {/* Company Header Card */}
        <div className="bg-surface-bg border border-light-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="relative w-16 h-16 rounded-xl border border-light-border overflow-hidden bg-white shrink-0 flex items-center justify-center">
              <Image
                src={`/logos/${metadata.slug}.svg`}
                alt={`${metadata.name} logo`}
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-airbnb-black tracking-tight leading-none">
                  {metadata.name}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-coral/10 text-[#C62828] border border-coral/20">
                  {metadata.industry}
                </span>
              </div>
              <p className="text-sm text-soft-dark-gray leading-relaxed max-w-xl">
                {metadata.description}
              </p>
              
              <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-neutral-gray pt-1 font-medium">
                <div>
                  <span className="text-airbnb-black font-bold">HQ:</span> {metadata.headquarters}
                </div>
                <div>
                  <span className="text-airbnb-black font-bold">Founded:</span> {metadata.foundedYear}
                </div>
                <div>
                  <span className="text-airbnb-black font-bold">Employees:</span> {metadata.headcountRange}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-light-border">
            {/* Compare Button */}
            <Link
              href={`/compare?c1=${metadata.slug}`}
              className="w-full sm:w-auto flex items-center justify-center bg-white border border-light-border text-soft-dark-gray text-sm font-bold h-11 px-5 rounded-lg hover:bg-hover-gray transition-colors shrink-0"
            >
              Compare {metadata.name}
            </Link>
            {/* Currency Toggle inside company page */}
            <div className="w-full sm:w-auto flex bg-hover-gray/50 rounded-lg p-0.5 border border-light-border h-11 items-center shrink-0">
              <Link
                href={`/companies/${metadata.slug}?currency=INR`}
                scroll={false}
                className={`flex-1 sm:w-16 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                  filterCurrency === "INR"
                    ? "bg-white text-airbnb-black shadow-sm"
                    : "text-neutral-gray hover:text-airbnb-black"
                }`}
              >
                INR
              </Link>
              <Link
                href={`/companies/${metadata.slug}?currency=USD`}
                scroll={false}
                className={`flex-1 sm:w-16 text-center py-1.5 text-xs font-bold rounded-md transition-all ${
                  filterCurrency === "USD"
                    ? "bg-white text-airbnb-black shadow-sm"
                    : "text-neutral-gray hover:text-airbnb-black"
                }`}
              >
                USD
              </Link>
            </div>
          </div>
        </div>

        {/* Statistical Overview Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Median Compensation Card */}
          <div className="bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-text">
              Median Total Comp
            </div>
            <div className="text-3xl font-extrabold text-sky-700 tracking-tight">
              {formatCurrency(medianTotalComp, filterCurrency)}
            </div>
            <p className="text-xs text-neutral-gray leading-normal">
              Based on {totalRecords} verified salary submission{totalRecords > 1 ? "s" : ""}.
            </p>
          </div>

          {/* Range Card */}
          <div className="bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-text">
              Salary Range (Base)
            </div>
            <div className="text-2xl font-extrabold text-airbnb-black tracking-tight">
              {formatCurrency(minBase, filterCurrency)} – {formatCurrency(maxBase, filterCurrency)}
            </div>
            <p className="text-xs text-neutral-gray leading-normal">
              Minimum to maximum annual base salary range in the dataset.
            </p>
          </div>

          {/* Submission Counts Card */}
          <div className="bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-text">
              Data Confidence
            </div>
            <div className="text-2xl font-extrabold text-success-green tracking-tight flex items-center gap-1.5">
              <span>High Trust</span>
              <span className="text-sm font-bold bg-green-50 px-2 py-0.5 rounded border border-green-200">
                {totalRecords} records
              </span>
            </div>
            <p className="text-xs text-neutral-gray leading-normal">
              Salary records are fully structured and cross-validated.
            </p>
          </div>
        </div>

        {/* Level Distribution Bar Chart */}
        <div className="bg-surface-bg border border-light-border rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-airbnb-black">Level Distribution</h3>
            <span className="text-xs text-neutral-gray font-medium">Percent Share of Records</span>
          </div>

          {/* Stacked Horizontal Bar */}
          <div className="w-full h-5 rounded-full overflow-hidden flex bg-gray-100 border border-light-border select-none">
            {sortedLevelDistribution.map((item) => (
              <div
                key={item.level}
                style={{ width: `${item.percentage}%` }}
                className={`${getLevelColor(item.level)} h-full transition-all duration-300 relative group`}
                title={`${item.level}: ${item.percentage.toFixed(1)}% (${item.count} records)`}
              />
            ))}
          </div>

          {/* Legend Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-2">
            {sortedLevelDistribution.map((item) => (
              <div key={item.level} className="flex items-start gap-2 text-sm">
                <span className={`w-3.5 h-3.5 rounded-md mt-0.5 shrink-0 ${getLevelColor(item.level)}`} />
                <div className="flex flex-col">
                  <span className="font-bold text-airbnb-black">{item.level}</span>
                  <span className="text-xs text-neutral-gray">
                    {item.count} record{item.count > 1 ? "s" : ""} ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Salary Records List Table */}
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-xl text-airbnb-black">
            Verified Salaries Table ({totalRecords})
          </h3>
          <SalaryTable
            records={paginatedRecords}
            displayCurrency={filterCurrency}
            searchParams={parsedSearchParams}
          />
          {totalRecords > recordsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              limit={recordsPerPage}
              searchParams={parsedSearchParams}
            />
          )}
        </div>
      </main>
    </div>
  );
}
