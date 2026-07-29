"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, SoupAddOn, PortionSize, SpiceLevel } from "@/types/soup";
import { calculateItemPrice } from "@/lib/catalog-engine";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "cartItemId">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  updateItemConfig: (cartItemId: string, updates: Partial<Pick<CartItem, "size" | "spiceLevel" | "addOns">>) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ziva_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from storage", e);
      }
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("ziva_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, "cartItemId">) => {
    setItems((prev) => {
      // Check if an identical item exists (same product, size, spice, and add-ons)
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.size === newItem.size &&
          item.spiceLevel === newItem.spiceLevel &&
          JSON.stringify(item.addOns.map((a) => a.id).sort()) ===
            JSON.stringify(newItem.addOns.map((a) => a.id).sort())
      );

      if (existingItemIndex > -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += newItem.quantity;
        return updated;
      }

      const cartItemId = crypto.randomUUID();
      return [...prev, { ...newItem, cartItemId }];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const updateItemConfig = (
    cartItemId: string,
    updates: Partial<Pick<CartItem, "size" | "spiceLevel" | "addOns">>
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, ...updates } : item))
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, item) => {
    const price = calculateItemPrice(item.productId, item.size, item.addOns);
    return sum + price * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemConfig,
        clearCart,
        subtotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
