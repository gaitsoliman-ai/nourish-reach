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
