import { IndianRupee, DollarSign, Euro, PoundSterling, JapaneseYen } from "lucide-react";
import { getCurrency } from "@/config/international";

// INR shows the rupee icon, USD the dollar icon... currencies without an icon in the
// icon library (AED, SGD, THB...) show their own symbol, e.g. د.إ for AED.
const ICONS = { INR: IndianRupee, USD: DollarSign, EUR: Euro, GBP: PoundSterling, JPY: JapaneseYen } as const;

export default function CurrencyIcon({ code, className = "h-4 w-4" }: { code?: string; className?: string }) {
  if (!code) return null;
  const Icon = ICONS[code as keyof typeof ICONS];
  if (Icon) return <Icon className={className} aria-label={code} />;
  return (
    <span className="inline-flex items-center justify-center font-semibold leading-none" style={{ fontSize: "0.85em" }} aria-label={code}>
      {getCurrency(code)?.symbol ?? code}
    </span>
  );
}