"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LevelStandardized } from "@/types";

interface FilterBarProps {
  roles: string[];
  locations: string[];
  levels: LevelStandardized[];
  initialFilters: {
    company: string;
    role: string;
    location: string;
    levels: string[];
    currency: "INR" | "USD";
  };
}

export default function FilterBar({
  roles,
  locations,
  levels,
  initialFilters,
}: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search input local state & debounce
  const [companyInput, setCompanyInput] = useState(initialFilters.company);
  
  // Level dropdown open state
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update query string
  const updateQuery = useCallback((updates: Record<string, string | string[] | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset page whenever filters change
    params.delete("page");

    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined) {
        params.delete(key);
      } else if (Array.isArray(val)) {
        if (val.length === 0) {
          params.delete(key);
        } else {
          params.set(key, val.join(","));
        }
      } else {
        if (val === "") {
          params.delete(key);
        } else {
          params.set(key, val);
        }
      }
    });

    router.push(`/salaries?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  // Sync input value with external URL changes (e.g. reset button or back button)
  useEffect(() => {
    setCompanyInput(initialFilters.company);
  }, [initialFilters.company]);

  // Debounced search for Company (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentCompany = searchParams.get("company") || "";
      if (companyInput !== currentCompany) {
        updateQuery({ company: companyInput || undefined });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [companyInput, searchParams, updateQuery]);

  // Close level dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLevelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuery({ role: e.target.value || undefined });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQuery({ location: e.target.value || undefined });
  };

  const handleLevelToggle = (lvl: string) => {
    const activeLevels = [...initialFilters.levels];
    const index = activeLevels.indexOf(lvl);
    if (index > -1) {
      activeLevels.splice(index, 1);
    } else {
      activeLevels.push(lvl);
    }
    updateQuery({ level: activeLevels });
  };

  const handleCurrencyToggle = (cur: "INR" | "USD") => {
    updateQuery({ currency: cur });
  };

  const handleClearAll = () => {
    setCompanyInput("");
    router.push("/salaries", { scroll: false });
  };

  // Determine if any filters are active (excluding currency)
  const isFiltered =
    initialFilters.company !== "" ||
    initialFilters.role !== "" ||
    initialFilters.location !== "" ||
    initialFilters.levels.length > 0;

  return (
    <div className="w-full bg-surface-bg border border-light-border rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Search by Company */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
          <label htmlFor="search-company" className="text-xs font-bold uppercase tracking-wider text-muted-text">
            Search Company
          </label>
          <input
            id="search-company"
            type="text"
            placeholder="e.g. Google, Amazon..."
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/80 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Role Dropdown */}
        <div className="col-span-1 md:col-span-3 flex flex-col gap-2">
          <label htmlFor="select-role" className="text-xs font-bold uppercase tracking-wider text-muted-text">
            Role
          </label>
          <select
            id="select-role"
            value={initialFilters.role}
            onChange={handleRoleChange}
            className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/80 transition-all cursor-pointer"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Level Multiselect Popover */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2 relative" ref={dropdownRef}>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-text">
            Levels
          </label>
          <button
            type="button"
            onClick={() => setLevelDropdownOpen(!levelDropdownOpen)}
            className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium flex items-center justify-between hover:bg-hover-gray/20 transition-all"
          >
            <span className="truncate">
              {initialFilters.levels.length === 0
                ? "All Levels"
                : `Selected (${initialFilters.levels.length})`}
            </span>
            <span className="text-neutral-gray text-xs ml-1 select-none">
              {levelDropdownOpen ? "▲" : "▼"}
            </span>
          </button>

          {levelDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-surface-bg border border-light-border rounded-lg shadow-lg max-h-60 overflow-y-auto p-3 flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-150">
              {levels.map((lvl) => {
                const checked = initialFilters.levels.includes(lvl);
                return (
                  <label
                    key={lvl}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-hover-gray text-sm text-body-text font-medium cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleLevelToggle(lvl)}
                      className="w-4 h-4 rounded border-light-border text-coral focus:ring-coral accent-coral cursor-pointer"
                    />
                    {lvl}
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <label htmlFor="select-location" className="text-xs font-bold uppercase tracking-wider text-muted-text">
            Location
          </label>
          <select
            id="select-location"
            value={initialFilters.location}
            onChange={handleLocationChange}
            className="w-full h-11 px-4 rounded-lg border border-light-border bg-white text-airbnb-black text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/80 transition-all cursor-pointer"
          >
            <option value="">All Cities</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Currency Switcher */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-text">
            Currency
          </label>
          <div className="flex bg-hover-gray/50 rounded-lg p-0.5 border border-light-border h-11 items-center">
            <button
              type="button"
              onClick={() => handleCurrencyToggle("INR")}
              className={`flex-1 h-9 rounded-md text-sm font-bold transition-all ${
                initialFilters.currency === "INR"
                  ? "bg-white text-airbnb-black shadow-sm"
                  : "text-neutral-gray hover:text-airbnb-black"
              }`}
            >
              INR (₹)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyToggle("USD")}
              className={`flex-1 h-9 rounded-md text-sm font-bold transition-all ${
                initialFilters.currency === "USD"
                  ? "bg-white text-airbnb-black shadow-sm"
                  : "text-neutral-gray hover:text-airbnb-black"
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Clear Filters CTA */}
      {isFiltered && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-bold text-coral hover:text-opacity-80 flex items-center gap-1 transition-colors select-none"
          >
            <span>Reset filters</span>
            <span className="text-neutral-gray">&#x2715;</span>
          </button>
        </div>
      )}
    </div>
  );
}
