"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Sparkles, Plus, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useUserActivity } from "@/context/UserActivityContext";
import { PRODUCTS, getProduct } from "@/lib/catalog-engine";
import { PortionSize } from "@/types/soup";

export default function FlavorEngine() {
  const { addItem } = useCart();
  const { logProductVisit } = useUserActivity();
  
  const [activeId, setActiveId] = useState(PRODUCTS[0].id);
  const active = getProduct(activeId)!;
  
  const [selectedSize, setSelectedSize] = useState<PortionSize>("BOWL_16OZ");
  const [added, setAdded] = useState(false);

  const sizeLabels: Record<PortionSize, string> = {
    BOWL_8OZ: "Single Bar",
    BOWL_16OZ: "Double Bar",
    FAMILY_32OZ: "Gift Set",
  };

  useEffect(() => {
    logProductVisit(activeId);
  }, [activeId, logProductVisit]);

  const handleAdd = () => {
    addItem({
      productId: active.id,
      quantity: 1,
      size: selectedSize,
      spiceLevel: undefined,
      addOns: [],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section id="flavors" className="zeva-section relative py-16 md:py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Botanical Soap Collection
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-amber-50">ZEVA JEE™ Soap Rituals</h2>
        <p className="text-stone-400 max-w-xl mx-auto text-sm font-light">
          Discover handcrafted botanical soaps with natural ingredients and skin-loving formulas for every day.
        </p>
      </div>

      {/* Flavor Selector Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {PRODUCTS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveId(f.id)}
            className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
              active.id === f.id
                ? "bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-105"
                : "glass-panel text-stone-300 border-white/10 hover:border-amber-500/40"
            }`}
          >
            <span className="text-base">{f.imageEmoji}</span>
            <span>{f.name}</span>
          </button>
        ))}
      </div>

      {/* Active Flavor Showcase Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className={`glass-panel p-6 md:p-8 rounded-3xl border border-white/15 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 items-center`}
        >
          {/* Left Side: Visual Emoji & Radar Bars */}
          <div className="relative flex flex-col items-center justify-center space-y-6">
            <div className="absolute w-72 h-72 bg-amber-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="relative text-[130px] md:text-[170px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] select-none cursor-pointer"
            >
              {active.imageEmoji}
            </motion.div>

            {/* Flavor Spectrum Metrics */}
            <div className="w-full max-w-sm glass-panel p-5 rounded-2xl border border-white/10 space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1">
                Botanical Profile
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Botanical Strength</span>
                    <span className="font-mono text-amber-300">{active.attributes.richness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${active.attributes.richness}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Aroma Depth</span>
                    <span className="font-mono text-amber-300">{active.attributes.umami}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${active.attributes.umami}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Texture & Lather</span>
                    <span className="font-mono text-amber-300">{active.attributes.aromatics}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${active.attributes.aromatics}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Purity Score</span>
                    <span className="font-mono text-amber-300">{active.attributes.spiceBase}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${active.attributes.spiceBase}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Broth Details */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/20">
                Handcrafted Blend
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/20">
                Natural Botanicals
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Small-Batch Craft
              </span>
            </div>

            <div>
              <h3 className="font-serif text-3xl md:text-5xl font-bold text-amber-50 leading-tight">
                {active.name}
              </h3>
              <p className="text-amber-400 font-medium italic mt-2 text-sm">{active.tagline}</p>
            </div>

            <p className="text-stone-300 leading-relaxed font-light text-sm md:text-base">
              {active.description}
            </p>

            {/* Customization Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Bar Size</label>
                <div className="flex flex-col gap-1.5">
                  {active.availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-[10px] px-3 py-2 rounded-lg border text-left transition-all ${
                        selectedSize === size 
                          ? "bg-amber-500/10 border-amber-500/50 text-amber-200" 
                          : "border-white/5 text-stone-500 hover:border-white/10"
                      }`}
                    >
                      {sizeLabels[size]}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Signature Ingredients */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-400/80 mb-3 font-semibold">
                Organic Farm Ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {active.dietaryTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-1 rounded bg-white/5 text-stone-300 border border-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Add CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Ritual</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Curate Selection — ${active.basePrice.toFixed(2)}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
