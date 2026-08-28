"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, ArrowDown, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

interface HeroSectionProps {
  onOpenCart?: () => void;
}

export default function HeroSection({ onOpenCart }: HeroSectionProps) {
  const handleOrderClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#D97706", "#F59E0B", "#991B1B", "#FFFBEB"],
    });
    if (onOpenCart) onOpenCart();
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Steam Particles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none flex gap-10">
        <div className="w-2 h-20 bg-gradient-to-t from-amber-400/40 to-transparent rounded-full animate-steam-rise blur-sm" />
        <div className="w-3 h-24 bg-gradient-to-t from-amber-300/30 to-transparent rounded-full animate-steam-rise blur-md [animation-delay:1s]" />
        <div className="w-2 h-16 bg-gradient-to-t from-amber-500/40 to-transparent rounded-full animate-steam-rise blur-sm [animation-delay:2s]" />
      </div>

      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-gold border border-amber-500/40 text-amber-400 text-xs uppercase tracking-widest font-semibold shadow-lg shadow-amber-500/10"
        >
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>18-Hour Copper Kettle Crafted Daily</span>
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-amber-50 leading-none"
        >
          Pure Broths. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
            Artisanal Soul.
          </span>
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base md:text-xl text-stone-300 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Elevating organic comfort food into a luxury culinary ritual. Crafted with heirloom farm ingredients and simmered 18 hours in copper kettles.
        </motion.p>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={handleOrderClick}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-bold text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Build Tasting Box</span>
          </button>

          <a
            href="#flavors"
            className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border border-white/20 text-stone-200 font-medium text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <span>See Tasting Menu</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-6 pt-6 text-xs text-amber-400/80 font-medium"
        >
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Organic Farms
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-amber-400" /> Bio-Available Collagen
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Eco Insulated Glass Jars</span>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-500"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
}