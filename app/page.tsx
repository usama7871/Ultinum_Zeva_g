"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/HeroSection";
import FlavorEngine from "@/components/FlavorEngine";
import IngredientMatrix from "@/components/IngredientMatrix";
import KettleCraft from "@/components/KettleCraft";
import TastingReviews from "@/components/TastingReviews";
import SoupFAQ from "@/components/SoupFAQ";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useCart } from "@/context/CartContext";

function AuthenticatedCartSync() {
  const { userId } = useAuth();
  const { items, clearCart } = useCart();
  const [hydrated, setHydrated] = useState(false);

  // Sync logic will be implemented in Phase 5 to handle complex CartItems
  // For now, we rely on localStorage persistence from CartProvider
  
  return null;
}

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <AuthenticatedCartSync />
      
      {/* Navbar handles cart state internally via useCart */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-grow space-y-12">
        <HeroSection onOpenCart={() => setIsCartOpen(true)} />
        <FlavorEngine />
        <KettleCraft />
        <IngredientMatrix />
        <TastingReviews />
        <SoupFAQ />
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
}
