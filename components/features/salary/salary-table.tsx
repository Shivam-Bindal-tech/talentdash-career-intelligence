import Link from "next/link";
import Image from "next/image";
import { SalaryRecord } from "@/types";
import { formatCurrency, convertCompensation, getCompanyDisplayName } from "@/lib/utils";

interface SalaryTableProps {
  records: SalaryRecord[];
  displayCurrency: "INR" | "USD";
  searchParams: Record<string, string | string[] | undefined>;
}

export default function SalaryTable({ records, displayCurrency, searchParams }: SalaryTableProps) {
  // Helper to build URL for sorting header links, resetting page to 1
  const getSortUrl = (columnKey: string) => {
    const currentSort = searchParams.sort as string || "total_compensation";
    const currentOrder = searchParams.order as string || "desc";
    
    // Toggle order if clicking the currently sorted column
    const nextOrder = currentSort === columnKey && currentOrder === "desc" ? "asc" : "desc";
    
    const params = new URLSearchParams();
    
    // Copy existing search params
    Object.entries(searchParams).forEach(([key, val]) => {
      if (val !== undefined && key !== "sort" && key !== "order" && key !== "page") {
        params.set(key, String(val));
      }
    });
    
    params.set("sort", columnKey);
    params.set("order", nextOrder);
    params.set("page", "1"); // Reset to page 1 on sort change
    
    return `/salaries?${params.toString()}`;
  };

  // Helper to render sort indicator icons
  const renderSortIcon = (columnKey: string) => {
    const currentSort = searchParams.sort as string || "total_compensation";
    const currentOrder = searchParams.order as string || "desc";

    if (currentSort !== columnKey) {
      return (
        <span className="text-gray-300 ml-1 inline-block shrink-0">
          ↕
        </span>
      );
    }
    return (
      <span className="text-coral ml-1 inline-block shrink-0 font-bold">
        {currentOrder === "desc" ? "↓" : "↑"}
      </span>
    );
  };

  // Helper to get Level Badge color class
  const getLevelBadgeClass = (level: string) => {
    const lvl = level.toUpperCase();
    if (lvl === "L3" || lvl === "SDE-I") {
      return "bg-slate-100 text-slate-800 border-slate-200/50";
    } else if (lvl === "L4" || lvl === "SDE-II") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    } else if (lvl === "L5" || lvl === "SDE-III") {
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    } else if (lvl === "L6" || lvl === "STAFF") {
      return "bg-purple-50 text-purple-700 border-purple-100";
    } else if (lvl.includes("PRINCIPAL")) {
      return "bg-navy-blue text-blue-50 border-blue-950";
    }
    return "bg-gray-100 text-gray-800 border-gray-200/50";
  };

  return (
    <div className="w-full bg-surface-bg border border-light-border rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto min-w-full">
        <table className="min-w-full divide-y divide-light-border table-fixed md:table-auto">
          <thead>
            <tr className="bg-hover-gray/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-text border-b border-light-border">
              {/* Company */}
              <th className="py-4 px-6 font-semibold select-none w-48 sm:w-auto">
                Company
              </th>
              
              {/* Role */}
              <th className="py-4 px-6 font-semibold select-none">
                Role
              </th>
              
              {/* Level */}
              <th className="py-4 px-6 font-semibold select-none">
                Level
              </th>
              
              {/* Location */}
              <th className="py-4 px-6 font-semibold select-none">
                Location
              </th>
              
              {/* Experience */}
              <th className="py-4 px-6 font-semibold select-none text-right">
                <Link
                  href={getSortUrl("experience_years")}
                  className="hover:text-airbnb-black flex items-center justify-end group transition-colors"
                >
                  Experience
                  {renderSortIcon("experience_years")}
                </Link>
              </th>
              
              {/* Base Salary */}
              <th className="py-4 px-6 font-semibold select-none text-right">
                <Link
                  href={getSortUrl("base_salary")}
                  className="hover:text-airbnb-black flex items-center justify-end group transition-colors"
                >
                  Base Salary
                  {renderSortIcon("base_salary")}
                </Link>
              </th>
              
              {/* Stock */}
              <th className="py-4 px-6 font-semibold select-none text-right">
                <Link
                  href={getSortUrl("stock")}
                  className="hover:text-airbnb-black flex items-center justify-end group transition-colors"
                >
                  Stock (/yr)
                  {renderSortIcon("stock")}
                </Link>
              </th>
              
              {/* Total Compensation */}
              <th className="py-4 px-6 font-semibold select-none text-right">
                <Link
                  href={getSortUrl("total_compensation")}
                  className="hover:text-airbnb-black flex items-center justify-end group transition-colors"
                >
                  Total Comp
                  {renderSortIcon("total_compensation")}
                </Link>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-border text-sm text-body-text bg-surface-bg">
            {records.map((record) => {
              const baseDisplay = convertCompensation(record.base_salary, record.currency, displayCurrency);
              const stockDisplay = record.stock > 0 
                ? convertCompensation(record.stock, record.currency, displayCurrency) 
                : 0;
              const tcDisplay = convertCompensation(record.total_compensation, record.currency, displayCurrency);

              return (
                <tr 
                  key={record.id} 
                  className="hover:bg-hover-gray transition-colors duration-150"
                  style={{ height: "65px" }} // Pre-allocate height to prevent CLS
                >
                  {/* Company Logo + Name */}
                  <td className="py-3.5 px-6 font-medium text-airbnb-black">
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-md border border-light-border overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={`/logos/${record.company_slug}.svg`}
                          alt={`${record.company} logo`}
                          width={24}
                          height={24}
                          className="object-contain"
                          priority={false}
                        />
                      </div>
                      <Link 
                        href={`/companies/${record.company_slug}`}
                        className="hover:text-coral transition-colors font-bold truncate max-w-[180px] sm:max-w-[220px]"
                        title={getCompanyDisplayName(record.company)}
                      >
                        {getCompanyDisplayName(record.company)}
                      </Link>
                    </div>
                  </td>
                  
                  {/* Role */}
                  <td className="py-3.5 px-6 font-medium truncate max-w-[150px]">
                    {record.role}
                  </td>
                  
                  {/* Level Badge */}
                  <td className="py-3.5 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getLevelBadgeClass(record.level_standardized)}`}>
                      {record.level_standardized}
                    </span>
                  </td>
                  
                  {/* Location */}
                  <td className="py-3.5 px-6 text-soft-dark-gray">
                    {record.location}
                  </td>
                  
                  {/* Experience */}
                  <td className="py-3.5 px-6 text-right font-medium text-airbnb-black">
                    {record.experience_years} yrs
                  </td>
                  
                  {/* Base Salary */}
                  <td className="py-3.5 px-6 text-right font-semibold text-airbnb-black">
                    {formatCurrency(baseDisplay, displayCurrency)}
                  </td>
                  
                  {/* Stock */}
                  <td className="py-3.5 px-6 text-right font-medium text-soft-dark-gray">
                    {stockDisplay > 0 ? formatCurrency(stockDisplay, displayCurrency) : "—"}
                  </td>
                  
                  {/* Total Compensation (Dominant) */}
                  <td className="py-3.5 px-6 text-right font-extrabold text-base text-sky-700">
                    {formatCurrency(tcDisplay, displayCurrency)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
