interface FormatNumberOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  compact?: boolean;
}
export function formatNumber(
  value: number | string | null | undefined,
  options: FormatNumberOptions = {},
): string {
  const numberValue = typeof value === "string" ? parseFloat(value) : value;
  if (
    isNaN(numberValue as number) ||
    numberValue === null ||
    numberValue === undefined
  ) {
    return "";
  }
  const {
    currency,
    locale = "en-US",
    minimumFractionDigits,
    maximumFractionDigits,
    compact = false,
  } = options;
  const style: "decimal" | "currency" = currency ? "currency" : "decimal";
  const formatterOptions: Intl.NumberFormatOptions = {
    style: style,
    currency: currency,
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
    notation: compact ? "compact" : "standard",
  };
  Object.keys(formatterOptions).forEach((key) => {
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
    return String(numberValue);
  }
}
