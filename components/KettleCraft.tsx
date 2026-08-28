"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, Thermometer, Droplets, Shield, Clock } from "lucide-react";

export default function SimmeringKettle() {
  const [temp, setTemp] = useState(180);

  const getSimmerStage = () => {
    if (temp < 155) return { stage: "Gentle Herb Infusion", desc: "Delicate essential oil release from Genovese basil & thyme", steamSpeed: "4s", bubbleCount: 3 };
    if (temp < 195) return { stage: "Optimal Collagen Extraction", desc: "18-hour low heat unlocking bio-available marrow proteins", steamSpeed: "2.5s", bubbleCount: 6 };
    return { stage: "Rapid Flavor Reduction", desc: "Intense umami concentration and velvety broth reduction", steamSpeed: "1.2s", bubbleCount: 10 };
  };

  const stageInfo = getSimmerStage();

  return (
    <section id="kettle" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <Flame className="w-3.5 h-3.5" /> Culinary Engineering
        </div>
        <h2 className="font-serif text-4xl md:text-6xl font-bold text-amber-50">18-Hour Copper Kettle Process</h2>
        <p className="text-stone-400 max-w-xl mx-auto text-sm font-light">
          Simmered in hand-hammered heavy copper kettles to ensure even thermal conductivity without scorching delicate botanicals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Interactive Kettle Visualizer */}
        <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-3xl border border-white/15 relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
          {/* Background Ambient Glow */}
          <div
            className="absolute w-80 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: temp > 195 ? "rgba(239, 68, 68, 0.2)" : temp > 155 ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
            }}
          />

          {/* Dynamic Steam Particles */}
          <div className="relative z-10 flex gap-6 mb-4">
            <div
              className="w-3 h-20 bg-gradient-to-t from-amber-400/40 to-transparent rounded-full blur-sm"
              style={{ animation: `steam ${stageInfo.steamSpeed} ease-in-out infinite` }}
            />
            <div
              className="w-4 h-28 bg-gradient-to-t from-amber-300/30 to-transparent rounded-full blur-md"
              style={{ animation: `steam ${stageInfo.steamSpeed} ease-in-out infinite 0.4s` }}
            />
            <div
              className="w-3 h-18 bg-gradient-to-t from-amber-400/50 to-transparent rounded-full blur-sm"
              style={{ animation: `steam ${stageInfo.steamSpeed} ease-in-out infinite 0.8s` }}
            />
          </div>

          {/* Copper Kettle Graphic */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: temp > 195 ? 1 : 3 }}
            className="relative z-10 w-64 h-52 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-[70px] border-4 border-amber-500/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Kettle Rim */}
            <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-b-2 border-amber-900 shadow-md" />

            {/* Simmering Broth Surface */}
            <div className="w-full h-full bg-gradient-to-b from-amber-600/80 to-stone-900 p-4 flex flex-wrap gap-3 items-center justify-center pt-8">
              {Array.from({ length: stageInfo.bubbleCount }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 + (i % 3) * 0.4, delay: i * 0.2 }}
                  className="w-4 h-4 rounded-full bg-amber-200/40 border border-amber-100/60 blur-[1px]"
                />
              ))}
            </div>

            {/* Kettle Brand Engraving */}
            <span className="absolute bottom-4 font-serif font-bold text-xs tracking-widest text-amber-200/40 uppercase">
              ZEVA_Jee G • COPPER N°18
            </span>
          </motion.div>

          {/* Temperature Slider Controls */}
          <div className="w-full max-w-md mt-8 space-y-3 relative z-10">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" /> Kettle Thermal Control
              </span>
              <span className="font-mono text-base font-bold text-amber-400">{temp}°F</span>
            </div>

            <input
              type="range"
              min="140"
              max="212"
              step="1"
              value={temp}
              onChange={(e) => setTemp(Number(e.target.value))}
              className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>140°F (Infusion)</span>
              <span>180°F (Optimal Simmer)</span>
              <span>212°F (Reduction)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Process Telemetry Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-gold p-6 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Active Craft Phase
            </div>
            <h3 className="font-serif text-2xl font-bold text-amber-50">{stageInfo.stage}</h3>
            <p className="text-xs text-stone-300 leading-relaxed">{stageInfo.desc}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <Clock className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-xl font-bold text-amber-50 font-serif">18 Hours</p>
              <p className="text-[11px] text-stone-400">Total Kettle Time</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <Droplets className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-xl font-bold text-amber-50 font-serif">14.2 g/L</p>
              <p className="text-[11px] text-stone-400">Collagen Density</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <Shield className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-xl font-bold text-amber-50 font-serif">99.8%</p>
              <p className="text-[11px] text-stone-400">Nutrient Retention</p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
              <Flame className="w-5 h-5 text-amber-400 mb-2" />
              <p className="text-xl font-bold text-amber-50 font-serif">Zero Oil</p>
              <p className="text-[11px] text-stone-400">Pure Bone Extraction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}