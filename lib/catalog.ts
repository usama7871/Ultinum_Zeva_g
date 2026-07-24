export interface BrothCatalogItem {
  id: string;
  name: string;
  emoji: string;
  caloriesNum: number;
  proteinNum: number;
}

export const BROTH_CATALOG: BrothCatalogItem[] = [
  { id: "tomato", name: "Roasted Tomato & Basil Velvet", emoji: "🍅", caloriesNum: 180, proteinNum: 6 },
  { id: "squash", name: "Golden Squash & Turmeric Broth", emoji: "🎃", caloriesNum: 210, proteinNum: 5 },
  { id: "mushroom", name: "Wild Truffle & Mushroom Velvet", emoji: "🍄", caloriesNum: 240, proteinNum: 8 },
  { id: "bonebroth", name: "Sacred Bone Broth Elixir", emoji: "🍲", caloriesNum: 190, proteinNum: 18 },
  { id: "detox", name: "Spicy Lemongrass Ginger Detox", emoji: "🌿", caloriesNum: 130, proteinNum: 4 },
  { id: "cauliflower", name: "Silken Golden Cauliflower", emoji: "🥣", caloriesNum: 160, proteinNum: 7 },
];

export const BOX_PRICES = {
  "4-pack": 68,
  "8-pack": 118,
} as const;

export const BOX_CAPACITY = {
  "4-pack": 4,
  "8-pack": 8,
} as const;

export function getCatalogItem(flavorId: string) {
  return BROTH_CATALOG.find((item) => item.id === flavorId);
}

export function calculateCartTotals(items: Array<{ flavorId: string; quantity: number }>) {
  return items.reduce(
    (totals, item) => {
      const flavor = getCatalogItem(item.flavorId);
      if (!flavor) return totals;
      totals.jars += item.quantity;
      totals.calories += flavor.caloriesNum * item.quantity;
      totals.protein += flavor.proteinNum * item.quantity;
      return totals;
    },
    { jars: 0, calories: 0, protein: 0 },
  );
}