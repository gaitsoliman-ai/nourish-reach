import { Check } from "lucide-react";
import type { FoodCategory } from "@/lib/foodTaxonomy";
import { categoryCardFallbackSrc, categoryPublicCardSrc } from "@/lib/foodTaxonomy";

export function FoodCategoryCard({
  value,
  label,
  hint,
  selected,
  onSelect,
}: {
  value: FoodCategory;
  label: string;
  hint: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative text-left p-3 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md ${
        selected
          ? "border-2 border-[#02db96] bg-[#02db96]/10"
          : "border border-border bg-card hover:border-[#02db96]/40"
      }`}
    >
      {selected && (
        <span
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#02db96] text-white shadow-sm"
          aria-hidden
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      )}
      <img
        src={categoryPublicCardSrc(value)}
        alt={label}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = categoryCardFallbackSrc(value);
        }}
        className="w-12 h-12 rounded-full object-cover mb-3"
      />
      <div className="text-sm font-semibold leading-tight pr-7">{label}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{hint}</div>
    </button>
  );
}
