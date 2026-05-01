import type { FoodCategory } from "@/lib/foodTaxonomy";

export interface DonationIntentPrefill {
  desc: string;
  qty: string;
  category: FoodCategory;
  pickupArea?: string;
}

const FOOD_KEYWORDS: { words: string[]; category: FoodCategory }[] = [
  { words: ["pasta", "spaghetti", "macaroni"], category: "PREPARED_HOT" },
  { words: ["rice", "biryani", "machboos", "curry"], category: "PREPARED_HOT" },
  { words: ["bread", "croissant", "pastry", "bakery", "cake"], category: "BAKED" },
  { words: ["salad", "vegetable", "produce", "fruit", "tomato", "lettuce"], category: "FRESH_END_OF_DAY" },
  { words: ["sandwich", "wrap"], category: "PREPARED_HOT" },
  { words: ["frozen", "ice cream"], category: "FROZEN" },
  { words: ["packaged", "canned", "expiry"], category: "PACKAGED_NEAR_EXPIRY" },
  { words: ["buffet", "wedding", "event", "catering", "leftover"], category: "EVENT_LEFTOVERS" },
];

/** Lightweight heuristic “NLP” for donor chat — no backend. */
export function parseDonationIntent(raw: string): DonationIntentPrefill | null {
  const text = raw.trim();
  if (!text) return null;

  const qtyMatch = text.match(/(\d+)\s*(portions?|meals?|boxes?|plates?|pieces?|servings?)?/i);
  const num = qtyMatch ? qtyMatch[1] : "";
  const unit = qtyMatch && qtyMatch[2] ? qtyMatch[2].toLowerCase() : "portions";
  const qty = num ? `${num} ${unit}` : "";

  const lower = text.toLowerCase();
  let category: FoodCategory = "PREPARED_HOT";
  for (const { words, category: cat } of FOOD_KEYWORDS) {
    if (words.some((w) => lower.includes(w))) {
      category = cat;
      break;
    }
  }

  let pickupArea: string | undefined;
  const near = text.match(/\bnear\s+(.+?)(?:\.|$|,)/i);
  if (near) pickupArea = near[1].trim();

  const desc =
    text.length > 120 ? text.slice(0, 117) + "…" : text;

  if (!qty && !desc) return null;

  return {
    desc: desc || "Donation from chat",
    qty: qty || "1 portions",
    category,
    pickupArea,
  };
}
