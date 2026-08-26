/**
 * Currency presentation data for the donate form.
 *
 * The authoritative list of what we accept comes from the API
 * (`/payments/methods`); this only supplies the names, symbols and sensible
 * preset amounts so an overseas donor sees their own money, not a bare code.
 */

export type CurrencyInfo = {
  code: string;
  name: string;
  symbol: string;
  /** Country flag, for quick visual recognition in the picker. */
  flag: string;
  /** Suggested giving amounts, tuned per currency rather than converted. */
  presets: number[];
  /** Smallest amount worth processing after fees. */
  min: number;
  /** Currencies without minor units (no decimals). */
  zeroDecimal?: boolean;
};

export const CURRENCIES: Record<string, CurrencyInfo> = {
  NPR: {
    code: "NPR",
    name: "Nepali Rupee",
    symbol: "Rs",
    flag: "🇳🇵",
    presets: [500, 1000, 5000, 10000],
    min: 50,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    presets: [10, 25, 50, 100],
    min: 2,
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    presets: [10, 20, 50, 100],
    min: 2,
  },
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", presets: [10, 25, 50, 100], min: 2 },
  AUD: {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    presets: [15, 35, 75, 150],
    min: 3,
  },
  CAD: {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    presets: [15, 35, 75, 150],
    min: 3,
  },
  SGD: {
    code: "SGD",
    name: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    presets: [15, 35, 70, 140],
    min: 3,
  },
  AED: {
    code: "AED",
    name: "UAE Dirham",
    symbol: "AED",
    flag: "🇦🇪",
    presets: [50, 100, 250, 500],
    min: 10,
  },
  INR: {
    code: "INR",
    name: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    presets: [500, 1000, 2500, 5000],
    min: 50,
  },
  JPY: {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    presets: [1000, 3000, 5000, 10000],
    min: 100,
    zeroDecimal: true,
  },
};

const FALLBACK: CurrencyInfo = {
  code: "NPR",
  name: "Nepali Rupee",
  symbol: "Rs",
  flag: "🇳🇵",
  presets: [500, 1000, 5000, 10000],
  min: 50,
};

export function currencyInfo(code: string): CurrencyInfo {
  return (
    CURRENCIES[String(code).toUpperCase()] ?? { ...FALLBACK, code: String(code).toUpperCase() }
  );
}

/** Locale region → currency, so an overseas visitor lands on their own money. */
const REGION_CURRENCY: Record<string, string> = {
  NP: "NPR",
  US: "USD",
  GB: "GBP",
  AU: "AUD",
  CA: "CAD",
  SG: "SGD",
  AE: "AED",
  IN: "INR",
  JP: "JPY",
  NZ: "AUD",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  IE: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  FI: "EUR",
  GR: "EUR",
};

/**
 * Best guess at the visitor's currency from their browser locale.
 * Falls back to the site's base currency when the region is unknown or the
 * guessed currency is not one we accept.
 */
export function guessCurrency(accepted: string[], base = "NPR"): string {
  try {
    const locale = navigator.languages?.[0] ?? navigator.language ?? "";
    const region = new Intl.Locale(locale).maximize().region;
    const guess = region ? REGION_CURRENCY[region] : undefined;
    if (guess && accepted.includes(guess)) return guess;
  } catch {
    /* Intl.Locale is unavailable in some older browsers — fall through. */
  }
  return accepted.includes(base) ? base : (accepted[0] ?? base);
}

/** Format an amount in its own currency, e.g. "£25" / "Rs 5,000". */
export function formatMoney(amount: number, code: string, { decimals = false } = {}) {
  const info = currencyInfo(code);
  const fraction = info.zeroDecimal || !decimals ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: info.code,
      minimumFractionDigits: fraction,
      maximumFractionDigits: fraction,
    }).format(amount);
  } catch {
    return `${info.symbol} ${amount.toLocaleString(undefined, { maximumFractionDigits: fraction })}`;
  }
}

/** Round a preset to something that reads naturally in the target currency. */
export function tidyAmount(value: number) {
  if (value >= 10000) return Math.round(value / 1000) * 1000;
  if (value >= 1000) return Math.round(value / 100) * 100;
  if (value >= 100) return Math.round(value / 10) * 10;
  return Math.max(1, Math.round(value));
}
