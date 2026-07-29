export type PortionSize = 'BOWL_8OZ' | 'BOWL_16OZ' | 'FAMILY_32OZ';
export type SpiceLevel = 'Mild' | 'Medium' | 'Hot' | 'Chef Extra Spicy';
export type DietaryTag = 'Vegan' | 'Gluten-Free' | 'Keto' | 'Dairy-Free' | 'Chef Special' | 'Organic';

export interface SoupAddOn {
  id: string;
  name: string;
  price: number;
  category: 'Bread' | 'Topping' | 'Drink' | 'Side';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  basePrice: number;
  imageEmoji: string;
  categoryId: string;
  dietaryTags: DietaryTag[];
  availableSizes: PortionSize[];
  allowSpiceCustomization: boolean;
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  attributes: {
    richness: number;
    umami: number;
    aromatics: number;
    spiceBase: number;
  };
  pairings: string[];
}

export interface CartItem {
  cartItemId: string; // Unique ID for the specific configuration
  productId: string;
  quantity: number;
  size: PortionSize;
  spiceLevel?: SpiceLevel;
  addOns: SoupAddOn[];
  specialInstructions?: string;
}

export interface UserActivity {
  recentlyViewedProductIds: string[];
  lastVisitedAt: string;
}

export type OrderStatus = 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  email: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  shippingFee: number;
  grandTotal: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}
