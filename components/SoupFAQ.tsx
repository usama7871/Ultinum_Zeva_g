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
    question: "How should I store my ZEVA JEE™ soap bars?",
    answer: "Store bars in a cool, dry place away from direct sunlight. Keep the soap dry between uses using a draining soap dish to extend the life of each bar.",
    icon: <Thermometer className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "Are ZEVA JEE™ soaps safe for sensitive skin?",
    answer: "Yes. Each soap is made with gentle botanical ingredients and natural oils. Avoid use on broken skin and discontinue if irritation occurs.",
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "How are the soaps packaged for delivery?",
    answer: "Our soaps are wrapped in recyclable paper and shipped in eco-friendly insulation. Every order arrives ready to display or gift.",
    icon: <PackageCheck className="w-5 h-5 text-amber-400" />,
  },
  {
    question: "Can I try different scents before I commit to a full set?",
    answer: "Absolutely. Choose a curated sampler or mix-and-match bar sizes to discover your favorite botanical blend.",
    icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
  },
];

export default function SoupFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="zeva-section py-16 md:py-20 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-widest">
          <HelpCircle className="w-3.5 h-3.5" /> Care & Concierge
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-50">Frequently Asked Questions</h2>
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
