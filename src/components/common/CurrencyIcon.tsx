// import { IndianRupee, DollarSign, Euro, PoundSterling, JapaneseYen } from "lucide-react";
// import { getCurrency } from "@/config/international";

// // INR shows the rupee icon, USD the dollar icon... currencies without an icon in the
// // icon library (AED, SGD, THB...) show their own symbol, e.g. د.إ for AED.
// const ICONS = { INR: IndianRupee, USD: DollarSign, EUR: Euro, GBP: PoundSterling, JPY: JapaneseYen } as const;

// export default function CurrencyIcon({ code, className = "h-4 w-4" }: { code?: string; className?: string }) {
//   if (!code) return null;
//   const Icon = ICONS[code as keyof typeof ICONS];
//   if (Icon) return <Icon className={className} aria-label={code} />;
//   return (
//     <span className="inline-flex items-center justify-center font-semibold leading-none" style={{ fontSize: "0.85em" }} aria-label={code}>
//       {getCurrency(code)?.symbol ?? code}
//     </span>
//   );
// }

import { IndianRupee, DollarSign, Euro, PoundSterling, JapaneseYen } from "lucide-react";
import { getCurrency } from "@/config/international";

// UAE Dirham sign (a "D" with two bars), drawn as SVG so it takes the text colour and any size you give it.
const DirhamIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    role="img"
    aria-label="AED"
  >
    <path d="M7 4h5a7 8 0 0 1 0 16H7z" />
    <path d="M3 9.5h13.5M3 14.5h13.5" />
  </svg>
);

// INR = rupee icon, AED = dirham sign, USD = dollar icon ... Currencies without an icon show their symbol text.
const ICONS = {
  INR: IndianRupee,
  AED: DirhamIcon,
  USD: DollarSign,
  EUR: Euro,
  GBP: PoundSterling,
  JPY: JapaneseYen,
} as const;

export default function CurrencyIcon({ code, className = "h-4 w-4" }: { code?: string; className?: string }) {
  if (!code) return null;
  const Icon = ICONS[code as keyof typeof ICONS];
  if (Icon) return <Icon className={className} aria-label={code} />;
  return (
    <span className={`inline-flex items-center justify-center font-semibold leading-none ${className}`} style={{ fontSize: "0.85em" }} aria-label={code}>
      {getCurrency(code)?.symbol ?? code}
    </span>
  );
}