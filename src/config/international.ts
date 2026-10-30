// Everything the international property form needs in ONE place.
// Add a currency or a unit type here and the whole form + details page picks it up.

export interface Currency { code: string; name: string; symbol: string; }

export const CURRENCIES: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);
export const getCurrency = (code?: string) => CURRENCIES.find((c) => c.code === code);

// Multi-select "Configurations" options (custom ones can still be typed in)
export const INTERNATIONAL_CONFIGURATIONS = [
  "Studio", "1BHK", "2BHK", "3BHK", "4BHK", "5BHK", "6BHK", "Penthouse", "Duplex", "Villa", "Townhouse",
];

// Rows of the multi-price table (one row per type / variant, as many as needed)
export const INTERNATIONAL_UNIT_TYPES = INTERNATIONAL_CONFIGURATIONS;
