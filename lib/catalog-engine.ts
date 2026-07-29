import { Category, Product, SoupAddOn, PortionSize, SpiceLevel } from "@/types/soup";

export const CATEGORIES: Category[] = [
  {
    id: "signature",
    name: "Signature Soups",
    slug: "signature-soups",
    description: "Our world-famous slow-simmered masterpieces.",
    icon: "🥣",
  },
  {
    id: "broths",
    name: "Broths & Tonics",
    slug: "broths-tonics",
    description: "Pure, nutrient-dense liquid gold for vitality.",
    icon: "🍵",
  },
  {
    id: "sides",
    name: "Sides & Breads",
    slug: "sides-breads",
    description: "The perfect companions for your soup ritual.",
    icon: "🥖",
  },
  {
    id: "drinks",
    name: "Elixirs & Drinks",
    slug: "drinks",
    description: "Refreshing pairings to cleanse the palate.",
    icon: "🥤",
  },
];

export const ADD_ONS: SoupAddOn[] = [
  { id: "garlic-bread", name: "Gourmet Garlic Bread", price: 6.5, category: "Bread" },
  { id: "croutons", name: "Artisanal Sourdough Croutons", price: 3.0, category: "Topping" },
  { id: "extra-cheese", name: "Aged Parmigiano Reggiano", price: 2.5, category: "Topping" },
  { id: "chili-oil", name: "House-Made Sichuan Chili Oil", price: 1.5, category: "Topping" },
];

export const SIZE_MULTIPLIERS: Record<PortionSize, number> = {
  BOWL_8OZ: 1,
  BOWL_16OZ: 1.75,
  FAMILY_32OZ: 3.2,
};

export const PRODUCTS: Product[] = [
  {
    id: "tomato",
    name: "Roasted Tomato & Basil Velvet",
    slug: "tomato-basil-velvet",
    tagline: "San Marzano excellence roasted with sweet garlic",
    description: "Rich, tangy, and velvety. Finished with cold-pressed Italian olive oil.",
    basePrice: 14.0,
    imageEmoji: "🍅",
    categoryId: "signature",
    dietaryTags: ["Vegan", "Gluten-Free", "Organic"],
    availableSizes: ["BOWL_8OZ", "BOWL_16OZ", "FAMILY_32OZ"],
    allowSpiceCustomization: true,
    macros: { calories: 180, protein: 6, carbs: 22, fat: 8 },
    attributes: { richness: 75, umami: 80, aromatics: 95, spiceBase: 20 },
    pairings: ["Warm Sourdough Focaccia", "Aged Goat Cheese"],
  },
  {
    id: "mushroom",
    name: "Wild Truffle & Mushroom Velvet",
    slug: "wild-truffle-mushroom",
    tagline: "Earthy Chanterelle & Portobello with black truffle",
    description: "Deep umami explosion blended with aged parmesan rind and fresh thyme.",
    basePrice: 18.0,
    imageEmoji: "🍄",
    categoryId: "signature",
    dietaryTags: ["Gluten-Free", "Chef Special"],
    availableSizes: ["BOWL_8OZ", "BOWL_16OZ", "FAMILY_32OZ"],
    allowSpiceCustomization: false,
    macros: { calories: 240, protein: 8, carbs: 18, fat: 16 },
    attributes: { richness: 92, umami: 98, aromatics: 90, spiceBase: 15 },
    pairings: ["Crispy Truffle Crostini", "Roasted Rosemary Sprouts"],
  },
  {
    id: "detox",
    name: "Spicy Lemongrass Ginger Detox",
    slug: "lemongrass-ginger-detox",
    tagline: "Thai coconut base with galangal & kaffir lime",
    description: "Vibrant, zesty, and invigorating. Cleanses the palate with restorative ginger heat.",
    basePrice: 15.0,
    imageEmoji: "🌿",
    categoryId: "broths",
    dietaryTags: ["Vegan", "Dairy-Free", "Keto"],
    availableSizes: ["BOWL_16OZ", "FAMILY_32OZ"],
    allowSpiceCustomization: true,
    macros: { calories: 130, protein: 4, carbs: 12, fat: 7 },
    attributes: { richness: 55, umami: 70, aromatics: 99, spiceBase: 85 },
    pairings: ["Steamed Jasmine Dumplings", "Lime Zest"],
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getCategory(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

export function calculateItemPrice(
  productId: string,
  size: PortionSize,
  addOns: SoupAddOn[]
): number {
  const product = getProduct(productId);
  if (!product) return 0;

  const basePrice = product.basePrice * SIZE_MULTIPLIERS[size];
  const addOnsPrice = addOns.reduce((sum, addOn) => sum + addOn.price, 0);

  return parseFloat((basePrice + addOnsPrice).toFixed(2));
}
