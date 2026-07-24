"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Thermometer, ShieldCheck, RefreshCw, PackageCheck } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How should I store and reheat my Ziva G broth jars?",
    answer: "Keep jars refrigerated upon arrival. Once opened, consume within 7 days. To reheat, pour desired portion into a small stainless steel saucepan and warm gently over low-medium heat until steam rises. Avoid boiling rapidly to preserve delicate aromatics and collagen structure.",
    icon: <Thermometer className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "How are the jars shipped to ensure fresh delivery?",
    answer: "Every Ziva G tasting box is packed in recyclable thermal insulation with non-toxic gel ice packs. Jars arrive cold and sealed tightly in heavy-gauge European glass.",
    icon: <PackageCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "What makes the 18-hour copper kettle simmer unique?",
    answer: "Copper conducts heat uniformly, preventing scorching while maintaining a consistent low extraction temperature. This gentle 18-hour process draws out deep bone collagen, mineral salts, and rich herbal terpenes without degrading nutrient vitality.",
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "Can I swap flavors or pause my Broth Club subscription?",
    answer: "Absoluty! Members can swap signature broths, change delivery frequencies (weekly, bi-weekly, or monthly), or pause orders at any time directly through the Member Portal.",
    icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
  },
];

export default function SoupFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" /> Care & Concierge
        </div>
        <h2 className="font-serif text-4xl md:text-5xl font-bold text-amber-50">Frequently Asked Questions</h2>
        <p className="text-stone-400 text-sm font-light max-w-lg mx-auto">
          Everything you need to know about our slow kettle crafting, shipping, and storage.
        </p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-serif font-bold text-base md:text-lg text-amber-50 hover:text-amber-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                    {item.icon}
                  </div>
                  <span>{item.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-xs md:text-sm text-stone-300 font-light leading-relaxed border-t border-white/5">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
