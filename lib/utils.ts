import { Currency } from "@/types";
import { EXCHANGE_RATES } from "./config";

/**
 * Converts a compensation value from its original currency to a target currency (INR or USD).
 * Values in MOCK_SALARY_RECORDS are stored in their smallest units (paise/cents).
 * This function handles conversion and converts the output to the base unit (Rupees/Dollars).
 * 
 * @param amountInSmallestUnit The amount in cents/paise
 * @param fromCurrency The currency of the record (INR, USD, GBP, EUR)
 * @param toCurrency The target display currency (INR or USD)
 */
export function convertCompensation(
  amountInSmallestUnit: number,
  fromCurrency: Currency,
  toCurrency: "INR" | "USD"
): number {
  // Convert smallest unit to standard unit (paise -> INR, cents -> USD/GBP/EUR)
  const standardAmount = amountInSmallestUnit / 100;

  // If source and target are the same, return standard unit
  if (fromCurrency === toCurrency) {
    return standardAmount;
  }

  // Convert source currency to USD first
  const rateToUSD = EXCHANGE_RATES[fromCurrency] || 1.0;
  const amountInUSD = standardAmount * rateToUSD;

  // Convert USD to target currency
  if (toCurrency === "USD") {
    return amountInUSD;
  } else {
    // USD to INR
    const usdToInrRate = 1 / EXCHANGE_RATES.INR; // e.g. 1 / 0.012 = 83.333
    return amountInUSD * usdToInrRate;
  }
}

/**
 * Formats a standard unit currency amount to localized strings.
 * For INR, uses the Indian numbering system (Lakhs/Crores).
 * For USD, uses standard US currency format.
 */
export function formatCurrency(amount: number, currency: "INR" | "USD"): string {
  if (currency === "INR") {
    // Format INR to en-IN system: e.g. ₹42,00,000
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } else {
    // Format USD to en-US system: e.g. $50,400
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

/**
 * Computes the statistical median of an array of numbers.
 * True statistical median: sort and pick the middle value.
 */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Helper to get the correct standard name for a company slug.
 */
export function getCompanyDisplayName(slug: string): string {
  // Try to find in metadata first
  const formattedSlug = slug.toLowerCase().trim();
  
  const lookup: Record<string, string> = {
    google: "Google",
    amazon: "Amazon",
    microsoft: "Microsoft",
    meta: "Meta",
    nvidia: "NVIDIA",
    flipkart: "Flipkart",
    razorpay: "Razorpay",
    meesho: "Meesho",
    tcs: "TCS",
    infosys: "Infosys",
    wipro: "Wipro",
    zepto: "Zepto",
    stripe: "Stripe",
  };

  return lookup[formattedSlug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}
