"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Sparkles, Plus, Check } from "lucide-react";

export interface FlavorDetail {
  id: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  notes: string[];
  calories: string;
  protein: string;
  imageEmoji: string;
  richness: number; // 1 - 100
  umami: number;
  aromatics: number;
  spice: number;
  pairing: string;
}

export const FLAVORS_DATA: FlavorDetail[] = [
  {
    id: "tomato",
    name: "Roasted Tomato & Basil Velvet",
    tagline: "San Marzano tomatoes roasted with sweet garlic & fresh basil",
    description: "Rich, tangy, and velvety. Finished with cold-pressed Italian olive oil and cracked black pepper.",
    color: "from-red-950/90 via-red-900/40 to-stone-950",
    notes: ["San Marzano Tomato", "Sweet Garlic", "Genovese Basil", "Extra Virgin Olive Oil"],
    calories: "180 kcal",
    protein: "6g Protein",
    imageEmoji: "🍅",
    richness: 75,
    umami: 80,
    aromatics: 95,
    spice: 20,
    pairing: "Warm Sourdough Focaccia & Aged Goat Cheese",
  },
  {
    id: "squash",
    name: "Golden Squash & Turmeric Broth",
    tagline: "Nourishing butternut squash infused with root turmeric & ginger",
    description: "Smooth, comforting, and mildly spiced. Designed to restore vitality and warm the body.",
    color: "from-amber-950/90 via-amber-900/40 to-stone-950",
    notes: ["Roasted Squash", "Fresh Turmeric", "Wild Honey", "Toasted Pepitas"],
    calories: "210 kcal",
    protein: "5g Protein",
    imageEmoji: "🎃",
    richness: 70,
    umami: 65,
    aromatics: 88,
    spice: 45,
    pairing: "Roasted Pumpkin Seeds & Honey Glazed Pecans",
  },
  {
    id: "mushroom",
    name: "Wild Truffle & Mushroom Velvet",
    tagline: "Earthy Chanterelle & Portobello mushrooms steeped with black truffle",
    description: "Deep umami explosion. A luxurious broth blended with aged parmesan rind and fresh thyme.",
    color: "from-stone-900/95 via-stone-850/40 to-stone-950",
    notes: ["Wild Chanterelles", "Black Truffle Oil", "Fresh Thyme", "Aged Parmesan"],
    calories: "240 kcal",
    protein: "8g Protein",
    imageEmoji: "🍄",
    richness: 92,
    umami: 98,
    aromatics: 90,
    spice: 15,
    pairing: "Crispy Truffle Crostini & Roasted Rosemary Sprouts",
  },
  {
    id: "bonebroth",
    name: "Sacred Bone Broth Elixir",
    tagline: "Slow-roasted marrow bones simmered 18 hours with star anise & rosemary",
    description: "Bio-available collagen power broth. Deep amber clarity packed with essential minerals.",
    color: "from-yellow-950/90 via-amber-950/40 to-stone-950",
    notes: ["Grass-Fed Beef Marrow", "Organic Rosemary", "Star Anise", "Sea Salt Flakes"],
    calories: "190 kcal",
    protein: "18g Protein",
    imageEmoji: "🍲",
    richness: 88,
    umami: 94,
    aromatics: 85,
    spice: 10,
    pairing: "Shaved Daikon Radish & Toasted Sesame Drops",
  },
  {
    id: "detox",
    name: "Spicy Lemongrass Ginger Detox",
    tagline: "Thai coconut base with galangal, kaffir lime & fresh bird's eye chili",
    description: "Vibrant, zesty, and invigorating. Cleanses the palate with restorative ginger heat.",
    color: "from-emerald-950/90 via-emerald-900/40 to-stone-950",
    notes: ["Thai Coconut Milk", "Wild Galangal", "Kaffir Lime", "Lemongrass"],
    calories: "130 kcal",
    protein: "4g Protein",
    imageEmoji: "🌿",
    richness: 55,
    umami: 70,
    aromatics: 99,
    spice: 85,
    pairing: "Steamed Jasmine Dumplings & Lime Zest",
  },
  {
    id: "cauliflower",
    name: "Silken Golden Cauliflower",
    tagline: "Toasted garlic & florets folded with white truffle essence & pine nuts",
    description: "Creamy without dairy. Silky, nutty profile with a delicate truffle kiss.",
    color: "from-stone-800/90 via-amber-950/30 to-stone-950",
    notes: ["Golden Cauliflower", "White Truffle", "Toasted Pine Nuts", "Chives"],
    calories: "160 kcal",
    protein: "7g Protein",
    imageEmoji: "🥣",
    richness: 82,
    umami: 85,
    aromatics: 82,
    spice: 10,
    pairing: "Charred Garlic Baguette & Olive Tapenade",
  },
];

interface FlavorEngineProps {
  onAddToCart?: (flavorId: string) => void;
}

export default function FlavorEngine({ onAddToCart }: FlavorEngineProps) {
  const [active, setActive] = useState<FlavorDetail>(FLAVORS_DATA[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(active.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <section id="flavors" className="relative py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Collection
        </div>
        <h2 className="font-serif text-4xl md:text-6xl font-bold text-amber-50">Sensory Tasting Room</h2>
        <p className="text-stone-400 max-w-xl mx-auto text-sm font-light">
          Explore our six signature broths, each slow-simmered for 18 hours to extract optimal nutrient density and flavor depth.
        </p>
      </div>

      {/* Flavor Selector Tabs */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {FLAVORS_DATA.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f)}
            className={`px-5 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
              active.id === f.id
                ? "bg-amber-500 text-stone-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-105"
                : "glass-panel text-stone-300 border-white/10 hover:border-amber-500/40"
            }`}
          >
            <span className="text-base">{f.imageEmoji}</span>
            <span>{f.name.split("&")[0]}</span>
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
          className={`glass-panel p-8 md:p-12 rounded-3xl border border-white/15 bg-gradient-to-br ${active.color} relative overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
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
                Flavor Spectrum Telemetry
              </p>

              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Richness & Body</span>
                    <span className="font-mono text-amber-300">{active.richness}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${active.richness}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Umami Depth</span>
                    <span className="font-mono text-amber-300">{active.umami}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${active.umami}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Herbal Aromatics</span>
                    <span className="font-mono text-amber-300">{active.aromatics}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400" style={{ width: `${active.aromatics}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-stone-300 mb-1">
                    <span>Ginger/Chili Heat</span>
                    <span className="font-mono text-amber-300">{active.spice}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-950 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${active.spice}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Broth Details */}
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/20">
                {active.calories}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/20">
                {active.protein}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" /> 18h Copper Kettle
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

            {/* Signature Ingredients */}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-amber-400/80 mb-3 font-semibold">
                Organic Farm Ingredients
              </p>
              <div className="flex flex-wrap gap-2">
                {active.notes.map((note, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-lg glass-panel text-stone-200 border border-white/10 flex items-center gap-1.5"
                  >
                    <Leaf className="w-3.5 h-3.5 text-amber-400" />
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Sommelier Pairing */}
            <div className="p-4 rounded-xl glass-panel border border-amber-500/20 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">Recommended Culinary Pairing</p>
              <p className="text-xs text-stone-200 font-medium">{active.pairing}</p>
            </div>

            {/* Quick Add CTA */}
            <button
              onClick={handleAdd}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Added to Tasting Box!</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add {active.name.split("&")[0]} to Box</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}