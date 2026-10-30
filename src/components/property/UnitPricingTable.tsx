import CurrencyIcon from "@/components/common/CurrencyIcon";
import { formatPriceWithCommas } from "@/lib/utils";
import { UnitVariant } from "@/lib/supabase";

// Unit-wise pricing table (BHK / Penthouse rows) with the currency icon in front of each price.
export default function UnitPricingTable({ variants, currency }: { variants?: UnitVariant[]; currency?: string }) {
  if (!variants?.length) return null;
  return (
    <div className="col-span-full mt-4">
      <span className="font-medium block mb-2">Unit-wise pricing{currency ? ` (${currency})` : ""}</span>
      <div className="overflow-x-auto border rounded-md">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="text-left p-2">Type</th><th className="text-left p-2">Variant</th>
              <th className="text-left p-2">Area</th><th className="text-left p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{v.type}</td>
                <td className="p-2">{v.label || "—"}</td>
                <td className="p-2">{v.area || "—"}</td>
                <td className="p-2">
                  {v.price ? (
                    <span className="inline-flex items-center gap-1">
                      <CurrencyIcon code={currency || "INR"} className="h-3.5 w-3.5" />
                      {formatPriceWithCommas(v.price) || v.price}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
