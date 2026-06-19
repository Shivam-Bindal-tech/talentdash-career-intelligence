"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SalaryRecord } from "@/types";
import { formatCurrency, convertCompensation, getCompanyDisplayName } from "@/lib/utils";

interface CompareDropdownItem {
  id: string;
  company: string;
  company_slug: string;
  role: string;
  level_standardized: string;
  location: string;
  experience_years: number;
  total_compensation: number;
  currency: "INR" | "USD" | "GBP" | "EUR";
}

interface CompareToolProps {
  initialRecord1: SalaryRecord;
  initialRecord2: SalaryRecord;
  dropdownItems: CompareDropdownItem[];
  searchParams: Record<string, string | string[] | undefined>;
}

export default function CompareTool({
  initialRecord1,
  initialRecord2,
  dropdownItems,
  searchParams,
}: CompareToolProps) {
  const router = useRouter();

  const initialCurrency = (searchParams.currency as "INR" | "USD") || "INR";

  // Dynamic state
  const [currency, setCurrency] = useState<"INR" | "USD">(initialCurrency);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [dropdown1Open, setDropdown1Open] = useState(false);
  const [dropdown2Open, setDropdown2Open] = useState(false);

  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);

  // Sync state with URL parameter changes
  useEffect(() => {
    setCurrency(initialCurrency);
  }, [initialCurrency]);

  // Click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref1.current && !ref1.current.contains(event.target as Node)) {
        setDropdown1Open(false);
      }
      if (ref2.current && !ref2.current.contains(event.target as Node)) {
        setDropdown2Open(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Server resolved records
  const record1 = initialRecord1;
  const record2 = initialRecord2;

  // Sync URL when records change
  const updateUrlParams = (updates: { s1?: string; s2?: string; currency?: string }) => {
    const params = new URLSearchParams();
    
    // Keep active records
    const activeS1 = updates.s1 !== undefined ? updates.s1 : (record1?.id || "");
    const activeS2 = updates.s2 !== undefined ? updates.s2 : (record2?.id || "");
    const activeCurrency = updates.currency !== undefined ? updates.currency : currency;

    if (activeS1) params.set("s1", activeS1);
    if (activeS2) params.set("s2", activeS2);
    params.set("currency", activeCurrency);

    router.push(`/compare?${params.toString()}`, { scroll: false });
  };

  const handleSelectRecord1 = (rec: CompareDropdownItem) => {
    setSearch1("");
    setDropdown1Open(false);
    updateUrlParams({ s1: rec.id });
  };

  const handleSelectRecord2 = (rec: CompareDropdownItem) => {
    setSearch2("");
    setDropdown2Open(false);
    updateUrlParams({ s2: rec.id });
  };

  const handleCurrencyToggle = (cur: "INR" | "USD") => {
    setCurrency(cur);
    updateUrlParams({ currency: cur });
  };

  // Filter records in dropdown list based on search term
  const filteredOptions1 = useMemo(() => {
    const term = search1.toLowerCase().trim();
    if (!term) return dropdownItems.slice(0, 10); // Show first 10 as default options
    return dropdownItems.filter(
      (r) =>
        r.company.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term) ||
        r.level_standardized.toLowerCase().includes(term)
    );
  }, [search1, dropdownItems]);

  const filteredOptions2 = useMemo(() => {
    const term = search2.toLowerCase().trim();
    if (!term) return dropdownItems.slice(0, 10);
    return dropdownItems.filter(
      (r) =>
        r.company.toLowerCase().includes(term) ||
        r.role.toLowerCase().includes(term) ||
        r.location.toLowerCase().includes(term) ||
        r.level_standardized.toLowerCase().includes(term)
    );
  }, [search2, dropdownItems]);

  // Math delta calculations (Record 1 - Record 2)
  const compValues = useMemo(() => {
    if (!record1 || !record2) return null;

    const base1 = convertCompensation(record1.base_salary, record1.currency, currency);
    const base2 = convertCompensation(record2.base_salary, record2.currency, currency);
    const baseDelta = base1 - base2;

    const bonus1 = convertCompensation(record1.bonus, record1.currency, currency);
    const bonus2 = convertCompensation(record2.bonus, record2.currency, currency);
    const bonusDelta = bonus1 - bonus2;

    const stock1 = convertCompensation(record1.stock, record1.currency, currency);
    const stock2 = convertCompensation(record2.stock, record2.currency, currency);
    const stockDelta = stock1 - stock2;

    const tc1 = convertCompensation(record1.total_compensation, record1.currency, currency);
    const tc2 = convertCompensation(record2.total_compensation, record2.currency, currency);
    const tcDelta = tc1 - tc2;

    const expDelta = record1.experience_years - record2.experience_years;

    return {
      base1, base2, baseDelta,
      bonus1, bonus2, bonusDelta,
      stock1, stock2, stockDelta,
      tc1, tc2, tcDelta,
      expDelta,
    };
  }, [record1, record2, currency]);

  // Determine winner (Higher TC in USD value for strict comparison accuracy)
  const winner = useMemo(() => {
    if (!record1 || !record2) return null;
    const tc1USD = convertCompensation(record1.total_compensation, record1.currency, "USD");
    const tc2USD = convertCompensation(record2.total_compensation, record2.currency, "USD");
    if (tc1USD > tc2USD) return 1;
    if (tc2USD > tc1USD) return 2;
    return null; // Tie
  }, [record1, record2]);

  // Render Delta row cells
  const renderDeltaCell = (delta: number, isCurrencyVal = true) => {
    if (delta === 0) {
      return <span className="text-neutral-gray font-medium">—</span>;
    }
    const isPositive = delta > 0;
    const colorClass = isPositive ? "text-success-green bg-green-50 px-2.5 py-0.5 rounded border border-green-200" : "text-error-red bg-red-50 px-2.5 py-0.5 rounded border border-red-200";
    const sign = isPositive ? "+" : "";
    
    const formattedVal = isCurrencyVal 
      ? formatCurrency(Math.abs(delta), currency) 
      : Math.abs(delta);

    return (
      <span className={`inline-flex items-center text-xs font-bold leading-normal ${colorClass}`}>
        {sign}{isPositive ? "" : "-"}{formattedVal}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg text-airbnb-black font-sans pb-16">
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
              className="text-sm font-bold text-coral border-b-2 border-coral pb-1 transition-colors"
            >
              Compare
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col gap-6">
        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-airbnb-black tracking-tight leading-none">
              Compensation Comparison
            </h1>
            <p className="text-sm text-soft-dark-gray">
              Compare salary, bonus, and equity side-by-side and calculate precise deltas.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex bg-hover-gray/50 rounded-lg p-0.5 border border-light-border h-11 items-center shrink-0 w-36 self-start sm:self-auto select-none">
            <button
              type="button"
              onClick={() => handleCurrencyToggle("INR")}
              className={`flex-1 h-9 rounded-md text-xs font-bold transition-all ${
                currency === "INR"
                  ? "bg-white text-airbnb-black shadow-sm"
                  : "text-neutral-gray hover:text-airbnb-black"
              }`}
            >
              INR
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyToggle("USD")}
              className={`flex-1 h-9 rounded-md text-xs font-bold transition-all ${
                currency === "USD"
                  ? "bg-white text-airbnb-black shadow-sm"
                  : "text-neutral-gray hover:text-airbnb-black"
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Selection Cards Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slot 1 Selector Card */}
          <div className="bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-4 relative" ref={ref1}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-text">Candidate Record A</span>
              {winner === 1 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-sky-700 border border-blue-200">
                  Higher TC
                </span>
              )}
            </div>

            {/* Custom Searchable Input Dropdown */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, role or level..."
                value={search1}
                onChange={(e) => {
                  setSearch1(e.target.value);
                  setDropdown1Open(true);
                }}
                onFocus={() => setDropdown1Open(true)}
                className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/80 transition-all placeholder:text-gray-400"
              />
              
              {dropdown1Open && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface-bg border border-light-border rounded-lg shadow-lg max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1 animate-in fade-in duration-150">
                  {filteredOptions1.length === 0 ? (
                    <span className="text-xs text-neutral-gray p-3">No matching records found</span>
                  ) : (
                    filteredOptions1.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => handleSelectRecord1(rec)}
                        className={`text-left p-2 rounded hover:bg-hover-gray transition-colors border-b border-light-border/20 last:border-b-0 flex flex-col gap-0.5 w-full ${
                          record1?.id === rec.id ? "bg-hover-gray/60 font-bold" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center w-full gap-2">
                          <span className="font-bold text-airbnb-black truncate text-sm">
                            {getCompanyDisplayName(rec.company)}
                          </span>
                          <span className="text-sky-700 font-bold text-xs shrink-0">
                            {formatCurrency(
                              convertCompensation(rec.total_compensation, rec.currency, currency),
                              currency
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full gap-2 text-neutral-gray text-xs">
                          <span className="truncate">
                            {rec.role} ({rec.level_standardized})
                          </span>
                          <span className="shrink-0 text-[11px]">
                            {rec.location} · {rec.experience_years}y
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Info display */}
            {record1 ? (
              <div className="flex items-center gap-4 pt-2 border-t border-light-border/60">
                <div className="relative w-12 h-12 rounded-lg border border-light-border overflow-hidden bg-white shrink-0 flex items-center justify-center">
                  <Image
                    src={`/logos/${record1.company_slug}.svg`}
                    alt={`${record1.company} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col truncate">
                  <h2 className="font-extrabold text-airbnb-black text-lg truncate leading-tight">
                    {getCompanyDisplayName(record1.company)}
                  </h2>
                  <p className="text-xs text-soft-dark-gray leading-normal truncate">
                    {record1.role} · <span className="font-semibold text-airbnb-black">{record1.level_standardized}</span>
                  </p>
                  <p className="text-[11px] text-neutral-gray leading-normal">
                    {record1.location} · {record1.experience_years} yrs exp
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-gray py-4">No record selected</p>
            )}
          </div>

          {/* Slot 2 Selector Card */}
          <div className="bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-4 relative" ref={ref2}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-text">Candidate Record B</span>
              {winner === 2 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-sky-700 border border-blue-200">
                  Higher TC
                </span>
              )}
            </div>

            {/* Custom Searchable Input Dropdown */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by company, role or level..."
                value={search2}
                onChange={(e) => {
                  setSearch2(e.target.value);
                  setDropdown2Open(true);
                }}
                onFocus={() => setDropdown2Open(true)}
                className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium focus:outline-none focus:ring-2 focus:ring-coral/80 transition-all placeholder:text-gray-400"
              />
              
              {dropdown2Open && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface-bg border border-light-border rounded-lg shadow-lg max-h-60 overflow-y-auto p-1.5 flex flex-col gap-1 animate-in fade-in duration-150">
                  {filteredOptions2.length === 0 ? (
                    <span className="text-xs text-neutral-gray p-3">No matching records found</span>
                  ) : (
                    filteredOptions2.map((rec) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => handleSelectRecord2(rec)}
                        className={`text-left p-2 rounded hover:bg-hover-gray transition-colors border-b border-light-border/20 last:border-b-0 flex flex-col gap-0.5 w-full ${
                          record2?.id === rec.id ? "bg-hover-gray/60 font-bold" : ""
                        }`}
                      >
                        <div className="flex justify-between items-center w-full gap-2">
                          <span className="font-bold text-airbnb-black truncate text-sm">
                            {getCompanyDisplayName(rec.company)}
                          </span>
                          <span className="text-sky-700 font-bold text-xs shrink-0">
                            {formatCurrency(
                              convertCompensation(rec.total_compensation, rec.currency, currency),
                              currency
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center w-full gap-2 text-neutral-gray text-xs">
                          <span className="truncate">
                            {rec.role} ({rec.level_standardized})
                          </span>
                          <span className="shrink-0 text-[11px]">
                            {rec.location} · {rec.experience_years}y
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Info display */}
            {record2 ? (
              <div className="flex items-center gap-4 pt-2 border-t border-light-border/60">
                <div className="relative w-12 h-12 rounded-lg border border-light-border overflow-hidden bg-white shrink-0 flex items-center justify-center">
                  <Image
                    src={`/logos/${record2.company_slug}.svg`}
                    alt={`${record2.company} logo`}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col truncate">
                  <h2 className="font-extrabold text-airbnb-black text-lg truncate leading-tight">
                    {getCompanyDisplayName(record2.company)}
                  </h2>
                  <p className="text-xs text-soft-dark-gray leading-normal truncate">
                    {record2.role} · <span className="font-semibold text-airbnb-black">{record2.level_standardized}</span>
                  </p>
                  <p className="text-[11px] text-neutral-gray leading-normal">
                    {record2.location} · {record2.experience_years} yrs exp
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-neutral-gray py-4">No record selected</p>
            )}
          </div>
        </div>

        {/* Breakdown Matrix Table */}
        {record1 && record2 && compValues ? (
          <div className="bg-surface-bg border border-light-border rounded-xl shadow-sm overflow-hidden mt-2">
            <table className="min-w-full divide-y divide-light-border table-fixed md:table-auto">
              <thead>
                <tr className="bg-hover-gray/40 border-b border-light-border text-xs font-bold uppercase tracking-wider text-muted-text">
                  <th className="py-4 px-6 text-left w-1/4">Metric</th>
                  <th className="py-4 px-6 text-left w-1/4">Record A ({getCompanyDisplayName(record1.company)})</th>
                  <th className="py-4 px-6 text-left w-1/4">Record B ({getCompanyDisplayName(record2.company)})</th>
                  <th className="py-4 px-6 text-left w-1/4">Delta (A - B)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-border text-sm text-body-text">
                {/* Company name */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Company</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{getCompanyDisplayName(record1.company)}</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{getCompanyDisplayName(record2.company)}</td>
                  <td className="py-4 px-6 text-neutral-gray">—</td>
                </tr>

                {/* Role */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Role</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record1.role}</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record2.role}</td>
                  <td className="py-4 px-6 text-neutral-gray">—</td>
                </tr>

                {/* Standardized Level */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Level</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {record1.level_standardized}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {record2.level_standardized}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-gray">—</td>
                </tr>

                {/* Location */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Location</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record1.location}</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record2.location}</td>
                  <td className="py-4 px-6 text-neutral-gray">—</td>
                </tr>

                {/* Experience */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Experience</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record1.experience_years} yrs</td>
                  <td className="py-4 px-6 font-medium text-airbnb-black">{record2.experience_years} yrs</td>
                  <td className="py-4 px-6 font-medium">
                    {renderDeltaCell(compValues.expDelta, false)}
                  </td>
                </tr>

                {/* Base Salary */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Base Salary</td>
                  <td className="py-4 px-6 font-bold text-airbnb-black">{formatCurrency(compValues.base1, currency)}</td>
                  <td className="py-4 px-6 font-bold text-airbnb-black">{formatCurrency(compValues.base2, currency)}</td>
                  <td className="py-4 px-6 font-medium">
                    {renderDeltaCell(compValues.baseDelta)}
                  </td>
                </tr>

                {/* Bonus */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Annual Bonus</td>
                  <td className="py-4 px-6 font-medium">{record1.bonus > 0 ? formatCurrency(compValues.bonus1, currency) : "—"}</td>
                  <td className="py-4 px-6 font-medium">{record2.bonus > 0 ? formatCurrency(compValues.bonus2, currency) : "—"}</td>
                  <td className="py-4 px-6 font-medium">
                    {renderDeltaCell(compValues.bonusDelta)}
                  </td>
                </tr>

                {/* Stock */}
                <tr className="hover:bg-hover-gray/10">
                  <td className="py-4 px-6 font-semibold text-airbnb-black">Stock (/yr)</td>
                  <td className="py-4 px-6 font-medium">{record1.stock > 0 ? formatCurrency(compValues.stock1, currency) : "—"}</td>
                  <td className="py-4 px-6 font-medium">{record2.stock > 0 ? formatCurrency(compValues.stock2, currency) : "—"}</td>
                  <td className="py-4 px-6 font-medium">
                    {renderDeltaCell(compValues.stockDelta)}
                  </td>
                </tr>

                {/* Total Compensation (Dominant Row) */}
                <tr className="bg-sky-50/20 font-bold border-t-2 border-light-border">
                  <td className="py-4.5 px-6 text-airbnb-black text-base font-extrabold">Total Comp</td>
                  <td className="py-4.5 px-6 text-sky-700 text-lg font-extrabold">{formatCurrency(compValues.tc1, currency)}</td>
                  <td className="py-4.5 px-6 text-sky-700 text-lg font-extrabold">{formatCurrency(compValues.tc2, currency)}</td>
                  <td className="py-4.5 px-6 font-extrabold">
                    {renderDeltaCell(compValues.tcDelta)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full bg-surface-bg border border-light-border rounded-xl py-20 px-6 text-center shadow-sm">
            <p className="text-sm text-neutral-gray">Please select two records to run comparison analysis.</p>
          </div>
        )}
      </main>
    </div>
  );
}
