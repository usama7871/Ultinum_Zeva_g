"use client";

import { motion } from "framer-motion";
import { Sprout, ShieldCheck, Flame, Droplets } from "lucide-react";

interface QualityPillar {
  icon: React.ReactNode;
  title: string;
  source: string;
  description: string;
}

const pillars: QualityPillar[] = [
  {
    icon: <Sprout className="w-6 h-6 text-ZEVA_Jee-gold" />,
    title: "100% Heirloom Farms",
    source: "Tuscany & Local Organic Co-ops",
    description: "Sun-ripened San Marzano tomatoes and organic squash sourced directly from small-batch sustainable farms.",
  },
  {
    icon: <Flame className="w-6 h-6 text-ZEVA_Jee-amber" />,
    title: "18-Hour Slow Simmer",
    source: "Copper Kettle Crafting",
    description: "Extremely low heat extraction unlocks rich collagen, complex aromatics, and deep umami depth.",
  },
  {
    icon: <Droplets className="w-6 h-6 text-ZEVA_Jee-gold" />,
    title: "Zero Preservatives",
    source: "Pure Small-Batch Batches",
    description: "Freshly sealed in eco-friendly glass jars. No added starches, seed oils, or artificial flavorings.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-ZEVA_Jee-amber" />,
    title: "Dietary Certified",
    source: "Gluten-Free & Organic",
    description: "Carefully formulated for modern lifestyles, with options for keto, paleo, and vegan dietary paths.",
  },
];

export default function IngredientMatrix() {
  return (
    <section id="sourcing" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="text-center mb-16 space-y-3">
        <h2 className="text-xs uppercase tracking-widest text-ZEVA_Jee-gold font-semibold">Uncompromising Quality</h2>
        <p className="font-serif text-4xl md:text-5xl font-bold text-ZEVA_Jee-cream">The ZEVA_Jee G Standard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-ZEVA_Jee-gold/40 transition-all hover:-translate-y-1 group"
          >
            <div className="w-12 h-12 rounded-xl bg-ZEVA_Jee-amber/10 border border-ZEVA_Jee-amber/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <h3 className="font-serif text-xl font-bold text-ZEVA_Jee-cream mb-1">{item.title}</h3>
            <p className="text-xs text-ZEVA_Jee-gold font-medium mb-3">{item.source}</p>
            <p className="text-sm text-ZEVA_Jee-cream/70 font-light leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}