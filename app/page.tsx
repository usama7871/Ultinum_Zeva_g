"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/HeroSection";
import FlavorEngine from "@/components/FlavorEngine";
import IngredientMatrix from "@/components/IngredientMatrix";
import KettleCraft from "@/components/KettleCraft";
import TastingReviews from "@/components/TastingReviews";
import SoupFAQ from "@/components/SoupFAQ";
import Footer from "@/components/Footer";
import TastingBoxDrawer from "@/components/TastingBoxDrawer";

function AuthenticatedCartSync({
  cartQuantities,
  setCartQuantities,
}: {
  cartQuantities: Record<string, number>;
  setCartQuantities: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const { userId } = useAuth();
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);
  const previousUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      if (previousUserId.current) {
        window.setTimeout(() => setCartQuantities({}), 0);
      }
      previousUserId.current = null;
      return;
    }

    previousUserId.current = userId;

    const loadCart = async () => {
      try {
        const response = await fetch("/api/cart");
        const data = await response.json();
        if (data.success && Array.isArray(data.items)) {
          setCartQuantities(
            data.items.reduce((cart: Record<string, number>, item: { flavorId: string; quantity: number }) => {
              cart[item.flavorId] = item.quantity;
              return cart;
            }, {}),
          );
        }
      } catch (error) {
        console.error("Failed to load saved cart:", error);
      } finally {
        setHydratedFor(userId);
      }
    };

    void loadCart();
  }, [setCartQuantities, userId]);

  useEffect(() => {
    if (!userId || hydratedFor !== userId) return;

    const saveCart = async () => {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: Object.entries(cartQuantities).map(([flavorId, quantity]) => ({ flavorId, quantity })),
          }),
        });
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    };

    void saveCart();
  }, [cartQuantities, hydratedFor, userId]);

  return null;
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({
    tomato: 1,
    mushroom: 1,
    bonebroth: 1,
    squash: 1,
  });

  const totalCartCount = Object.values(cartQuantities).reduce((a, b) => a + b, 0);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartQuantities((prev) => {
      const current = prev[id] || 0;
      const updated = Math.max(0, current + delta);
      return { ...prev, [id]: updated };
    });
  };

  const handleAddToCart = (flavorId: string) => {
    handleUpdateQuantity(flavorId, 1);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
        <AuthenticatedCartSync cartQuantities={cartQuantities} setCartQuantities={setCartQuantities} />
      )}
      <Navbar
        cartCount={totalCartCount}
        cartQuantities={cartQuantities}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow space-y-12">
        <HeroSection onOpenCart={() => setIsCartOpen(true)} />
        <FlavorEngine onAddToCart={handleAddToCart} />
        <KettleCraft />
        <IngredientMatrix />
        <TastingReviews />
        <SoupFAQ />
      </main>

      <Footer />

      <TastingBoxDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartQuantities={cartQuantities}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
}