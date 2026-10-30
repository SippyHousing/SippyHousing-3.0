// import { useFieldArray, Control, Controller, FieldValues, Path } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { UnitVariant } from "@/lib/supabase";
// import { Plus, Trash2 } from "lucide-react";

// import { UNIT_VARIANT_TYPES } from "@/config/configurations";

// const UNIT_TYPES = UNIT_VARIANT_TYPES;

// type UnitVariantsInputProps<T extends FieldValues> = {
//   control: Control<T>;
//   name?: Path<T>;
// };

// export function UnitVariantsInput<T extends FieldValues>({
//   control,
//   name = "unit_variants" as Path<T>,
// }: UnitVariantsInputProps<T>) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: name as Path<T>,
//   });

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <Label>Unit variants (multiple sizes/prices per type)</Label>
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() =>
//             append(
//               { type: "1BHK", area: "", price: "", label: "" } as UnitVariant
//             )
//           }
//         >
//           <Plus className="h-4 w-4 mr-1" />
//           Add variant
//         </Button>
//       </div>
//       <p className="text-sm text-muted-foreground">
//         Use this when you have multiple variants per unit type (e.g. 2BHK Type A, Type B). Leave empty to use single area/price fields above.
//       </p>
//       {fields.length === 0 ? (
//         <p className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
//           No variants added. Click &quot;Add variant&quot; to add rows, or use the single BHK area/price fields above.
//         </p>
//       ) : (
//         <div className="space-y-3">
//           {fields.map((field, index) => (
//             <div
//               key={field.id}
//               className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end p-3 border rounded-md bg-muted/30"
//             >
//               <div className="md:col-span-2">
//                 <Label className="text-xs">Type</Label>
//                 <Controller
//                   control={control}
//                   name={`${name}.${index}.type` as Path<T>}
//                   defaultValue={(field as { type?: string }).type || "1BHK"}
//                   render={({ field: f }) => (
//                     <Select
//                       value={f.value as string}
//                       onValueChange={f.onChange}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {UNIT_TYPES.map((t) => (
//                           <SelectItem key={t} value={t}>
//                             {t}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label className="text-xs">Label (e.g. Type A)</Label>
//                 <Input
//                   placeholder="Optional"
//                   {...control.register(`${name}.${index}.label` as Path<T>)}
//                 />
//               </div>
//               <div className="md:col-span-3">
//                 <Label className="text-xs">Area</Label>
//                 <Input
//                   placeholder="e.g. 800 sq.ft"
//                   {...control.register(`${name}.${index}.area` as Path<T>)}
//                 />
//               </div>
//               <div className="md:col-span-3">
//                 <Label className="text-xs">Price</Label>
//                 <Input
//                   placeholder="e.g. ₹80 L"
//                   {...control.register(`${name}.${index}.price` as Path<T>)}
//                 />
//               </div>
//               <div className="md:col-span-1">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => remove(index)}
//                   className="text-destructive hover:text-destructive"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import { useFieldArray, Control, Controller, FieldValues, Path, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnitVariant } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";
import CurrencyIcon from "@/components/common/CurrencyIcon";

import { UNIT_VARIANT_TYPES } from "@/config/configurations";

type UnitVariantsInputProps<T extends FieldValues> = {
  control: Control<T>;
  name?: Path<T>;
  /** Types in the dropdown. Default = domestic list. International: pass INTERNATIONAL_UNIT_TYPES. */
  types?: readonly string[];
  /** Name of the form field that holds the selected currency (default "currency"). */
  currencyField?: string;
};

export function UnitVariantsInput<T extends FieldValues>({
  control,
  name = "unit_variants" as Path<T>,
  types,
  currencyField = "currency",
}: UnitVariantsInputProps<T>) {
  const UNIT_TYPES = types ?? UNIT_VARIANT_TYPES;
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as Path<T>,
  });
  // selected currency (undefined for domestic properties -> no icon, ₹ placeholder as before)
  const currency = useWatch({ control, name: currencyField as Path<T> }) as string | undefined;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Unit variants (multiple sizes/prices per type)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append(
              { type: UNIT_TYPES[0] ?? "1BHK", area: "", price: "", label: "" } as UnitVariant
            )
          }
        >
          <Plus className="h-4 w-4 mr-1" />
          Add variant
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        Add one row per unit type or variant (e.g. 2BHK Type A, 3BHK, Penthouse), each with its own area and price.
      </p>
      {fields.length === 0 ? (
        <p className="text-sm text-muted-foreground border border-dashed rounded-md p-4">
          No variants added. Click &quot;Add variant&quot; to add rows.
        </p>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-2 items-end p-3 border rounded-md bg-muted/30"
            >
              <div className="md:col-span-2">
                <Label className="text-xs">Type</Label>
                <Controller
                  control={control}
                  name={`${name}.${index}.type` as Path<T>}
                  defaultValue={((field as { type?: string }).type || UNIT_TYPES[0] || "1BHK") as never}
                  render={({ field: f }) => (
                    <Select
                      value={f.value as string}
                      onValueChange={f.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs">Label (e.g. Type A)</Label>
                <Input
                  placeholder="Optional"
                  {...control.register(`${name}.${index}.label` as Path<T>)}
                />
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs">Area</Label>
                <Input
                  placeholder="e.g. 800 sq.ft"
                  {...control.register(`${name}.${index}.area` as Path<T>)}
                />
              </div>
              <div className="md:col-span-3">
                <Label className="text-xs">Price{currency ? ` (${currency})` : ""}</Label>
                <div className="relative">
                  {currency && (
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                      <CurrencyIcon code={currency} />
                    </span>
                  )}
                  <Input
                    className={currency ? "pl-9" : ""}
                    placeholder={currency ? "e.g. 1,200,000" : "e.g. ₹80 L"}
                    {...control.register(`${name}.${index}.price` as Path<T>)}
                  />
                </div>
              </div>
              <div className="md:col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

