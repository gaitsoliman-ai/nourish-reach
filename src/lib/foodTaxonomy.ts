export type FoodCategory =
  | "FRESH_END_OF_DAY"
  | "PREPARED_HOT"
  | "BAKED"
  | "PRODUCE"
  | "FROZEN"
  | "PACKAGED_NEAR_EXPIRY"
  | "EVENT_LEFTOVERS";

export const FOOD_CATEGORIES: { value: FoodCategory; label: string; hint: string; emoji: string }[] = [
  { value: "FRESH_END_OF_DAY", label: "Fresh — end of day", hint: "Made today, still good", emoji: "🥗" },
  { value: "PREPARED_HOT", label: "Prepared / hot meals", hint: "Cooked dishes, ready to eat", emoji: "🍛" },
  { value: "BAKED", label: "Bakery", hint: "Bread, pastries, cakes", emoji: "🥐" },
  { value: "PRODUCE", label: "Fruits & vegetables", hint: "Fresh produce", emoji: "🥕" },
  { value: "FROZEN", label: "Frozen food", hint: "Keep frozen until use", emoji: "❄️" },
  { value: "PACKAGED_NEAR_EXPIRY", label: "Packaged · near expiry", hint: "Sealed goods nearing date", emoji: "📦" },
  { value: "EVENT_LEFTOVERS", label: "Event / ceremony leftovers", hint: "Buffet, wedding, catering", emoji: "🎉" },
];

export type Packaging = "SEALED" | "WRAPPED" | "CONTAINER" | "OPEN_TRAY";
export const PACKAGING_OPTIONS: { value: Packaging; label: string; hint: string }[] = [
  { value: "SEALED", label: "Sealed packaging", hint: "Factory-sealed, untouched" },
  { value: "WRAPPED", label: "Plastic / foil wrapped", hint: "Individually wrapped portions" },
  { value: "CONTAINER", label: "Closed container", hint: "Boxed with a lid" },
  { value: "OPEN_TRAY", label: "Open tray / buffet", hint: "Was exposed at service" },
];

export const COMMON_ALLERGENS = [
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts",
  "Peanuts",
  "Soy",
  "Sesame",
  "Fish",
  "Shellfish",
  "Mustard",
];

export const labelForCategory = (c?: FoodCategory) =>
  FOOD_CATEGORIES.find((f) => f.value === c)?.label ?? "Food";
export const emojiForCategory = (c?: FoodCategory) =>
  FOOD_CATEGORIES.find((f) => f.value === c)?.emoji ?? "🍽️";
export const labelForPackaging = (p?: Packaging) =>
  PACKAGING_OPTIONS.find((x) => x.value === p)?.label ?? "—";

const CATEGORY_PHOTOS: Record<FoodCategory, string> = {
  FRESH_END_OF_DAY: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=70&auto=format&fit=crop",
  PREPARED_HOT: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=70&auto=format&fit=crop",
  BAKED: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70&auto=format&fit=crop",
  PRODUCE: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=70&auto=format&fit=crop",
  FROZEN: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=70&auto=format&fit=crop",
  PACKAGED_NEAR_EXPIRY: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=70&auto=format&fit=crop",
  EVENT_LEFTOVERS: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=70&auto=format&fit=crop",
};
export const photoForCategory = (c?: FoodCategory) =>
  (c && CATEGORY_PHOTOS[c]) || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=70&auto=format&fit=crop";
