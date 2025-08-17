/**
 * Interface for the optional formatting configurations for the formatNumber function.
 */
interface FormatNumberOptions {
  currency?: string; // The currency code (e.g., 'USD', 'EUR', 'NGN'). If provided, styles as currency.
  locale?: string; // The locale string (e.g., 'en-US', 'de-DE', 'fr-FR'). Defaults to 'en-US'.
  minimumFractionDigits?: number; // The minimum number of fraction digits to use.
  maximumFractionDigits?: number; // The maximum number of fraction digits to use.
  compact?: boolean; // If true, uses compact notation (e.g., "1.2K" instead of "1,200").
}

/**
 * Formats a number into a localized string, optionally with currency and fixed decimal places.
 * Uses Intl.NumberFormat for robust and culturally aware formatting.
 *
 * @param {number | string} value - The number to format. Can be a number or a string that can be parsed to a number.
 * @param {FormatNumberOptions} [options] - Optional formatting configurations.
 * @returns {string} The formatted number string.
 */
export function formatNumber(
  value: number | string | null | undefined, // Explicitly allow null/undefined for value
  options: FormatNumberOptions = {},
): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  // Handle non-numeric or invalid inputs gracefully
  if (
    isNaN(numberValue as number) ||
    numberValue === null ||
    numberValue === undefined
  ) {
    return ""; // Return empty string for invalid inputs
  }

  const {
    currency,
    locale = "en-US", // Default locale
    minimumFractionDigits,
    maximumFractionDigits,
    compact = false,
  } = options;

  // Determine the primary style (decimal or currency)
  const style: "decimal" | "currency" = currency ? "currency" : "decimal";

  const formatterOptions: Intl.NumberFormatOptions = {
    style: style, // This will be 'decimal' or 'currency'
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    notation: compact ? "compact" : "standard", // 'compact' notation is separate from style
  };

  // Remove undefined options to let Intl.NumberFormat use its defaults
  Object.keys(formatterOptions).forEach((key) => {
    // Cast to 'any' temporarily for index signature access
    if ((formatterOptions as any)[key] === undefined) {
      delete (formatterOptions as any)[key];
    }
  });

  try {
    return new Intl.NumberFormat(locale, formatterOptions).format(
      numberValue as number,
    );
  } catch (error) {
    console.error("Error formatting number:", error);
    return String(numberValue); // Fallback to basic string conversion
  }
}

// --- Examples of usage: ---
// console.log("Basic formatting:", formatNumber(1234567.89));
// console.log("Nigerian Naira:", formatNumber(18520000, { currency: 'NGN', locale: 'en-NG', minimumFractionDigits: 0 }));
// console.log("US Dollars:", formatNumber(1234.56, { currency: 'USD', locale: 'en-US', maximumFractionDigits: 2 }));
// console.log("Euros (German locale):", formatNumber(9876.54, { currency: 'EUR', locale: 'de-DE' }));
// console.log("Compact notation (US):", formatNumber(1234567, { compact: true, locale: 'en-US' }));
// console.log("Compact notation (German):", formatNumber(1234567, { compact: true, locale: 'de-DE' }));
// console.log("Fixed decimal places:", formatNumber(3.14159, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
// console.log("String input:", formatNumber("250000.75", { currency: 'USD' }));
// console.log("Invalid input (string):", formatNumber("abc"));
// console.log("Invalid input (null):", formatNumber(null));
// console.log("Invalid input (undefined):", formatNumber(undefined));
