"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import HeroSection from "@/components/HeroSection";
import FlavorEngine from "@/components/FlavorEngine";
import IngredientMatrix from "@/components/IngredientMatrix";
import KettleCraft from "@/components/KettleCraft";
import TastingReviews from "@/components/TastingReviews";
import SoupFAQ from "@/components/SoupFAQ";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/cart/CartDrawer";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar onOpenCart={() => setIsCartOpen(true)} />

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
