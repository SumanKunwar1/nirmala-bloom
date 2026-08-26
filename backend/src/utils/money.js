import config from "../config/index.js";
import ApiError from "./ApiError.js";

const { baseCurrency, supportedCurrencies, fxRates } = config.payments;

/** Zero-decimal currencies — amounts are whole units, never subdivided. */
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "ISK"]);

/** Normalize + validate a currency code against the configured allow-list. */
export function normalizeCurrency(code) {
  const cur = String(code || baseCurrency).toUpperCase().trim();
  if (!supportedCurrencies.includes(cur)) {
    throw ApiError.badRequest(
      `Currency "${cur}" is not accepted. Supported: ${supportedCurrencies.join(", ")}`,
    );
  }
  return cur;
}

/** Units of the base currency per 1 unit of `currency`. */
export function fxRateFor(currency) {
  const rate = fxRates[normalizeCurrency(currency)];
  if (!Number.isFinite(rate) || rate <= 0) {
    throw ApiError.badRequest(`No exchange rate configured for ${currency}`);
  }
  return rate;
}

/** Convert an amount into the reporting base currency (rounded to whole units). */
export function toBaseAmount(amount, currency) {
  return Math.round(Number(amount) * fxRateFor(currency));
}

/**
 * Validate a donation amount and return everything downstream code needs.
 * Throws ApiError on anything a donor could plausibly get wrong.
 */
export function resolveAmount(rawAmount, rawCurrency) {
  const currency = normalizeCurrency(rawCurrency);
  const amount = Number(rawAmount);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw ApiError.badRequest("A valid donation amount is required");
  }
  if (amount > 100_000_000) {
    throw ApiError.badRequest("That amount is too large to process online — please contact us directly");
  }

  const rounded = ZERO_DECIMAL.has(currency) ? Math.round(amount) : Math.round(amount * 100) / 100;
  const fxRate = fxRateFor(currency);

  return {
    amount: rounded,
    currency,
    fxRate,
    baseAmount: Math.round(rounded * fxRate),
    baseCurrency,
  };
}

/** Smallest-unit integer (paisa/cents) — what most gateways want on the wire. */
export function toMinorUnits(amount, currency) {
  return ZERO_DECIMAL.has(String(currency).toUpperCase())
    ? Math.round(amount)
    : Math.round(amount * 100);
}

/** "Rs 25,000" / "$150.00" — for emails and receipts. */
export function formatMoney(amount, currency = baseCurrency) {
  const cur = String(currency).toUpperCase();
  const digits = ZERO_DECIMAL.has(cur) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: cur,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(amount);
  } catch {
    return `${cur} ${Number(amount).toLocaleString()}`;
  }
}

export { baseCurrency, supportedCurrencies };
