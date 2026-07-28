"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, CheckCircle, Sparkles, Truck, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";
import { BROTH_CATALOG } from "@/lib/catalog";

interface TastingBoxDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartQuantities: Record<string, number>;
  onUpdateQuantity: (id: string, delta: number) => void;
}

interface CompletedOrder {
  id: string;
  customerName: string;
  boxSize: string;
  totalPrice: number;
  status: string;
}

export default function TastingBoxDrawer({
  isOpen,
  onClose,
  cartQuantities,
  onUpdateQuantity,
}: TastingBoxDrawerProps) {
  const [boxSize, setBoxSize] = useState<"4-pack" | "8-pack">("4-pack");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const maxJars = boxSize === "4-pack" ? 4 : 8;
  const basePrice = boxSize === "4-pack" ? 68 : 118;

  const totalJarsSelected = Object.values(cartQuantities).reduce((a, b) => a + b, 0);

  // Macro calculation
  let totalCalories = 0;
  let totalProtein = 0;
  BROTH_CATALOG.forEach((item) => {
    const qty = cartQuantities[item.id] || 0;
    totalCalories += item.caloriesNum * qty;
    totalProtein += item.proteinNum * qty;
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalJarsSelected < 1) {
      alert("Please add at least 1 broth jar to your tasting box.");
      return;
    }

    setIsSubmitting(true);

    const itemsPayload = BROTH_CATALOG.filter((f) => (cartQuantities[f.id] || 0) > 0).map((f) => ({
      flavorId: f.id,
      flavorName: f.name,
      quantity: cartQuantities[f.id],
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName || "Guest Connoisseur",
          email: email || "connoisseur@zivag.com",
          boxSize,
          shippingAddress: shippingAddress || "Temperature Controlled Express Shipping",
          items: itemsPayload,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (data.success) {
        setCompletedOrder(data.order);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ["#F59E0B", "#D97706", "#991B1B", "#FFFBEB"],
        });
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg glass-panel border-l border-white/5 z-50 flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden tactile-texture"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-stone-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl skeuo-button flex items-center justify-center text-amber-500">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif font-black text-2xl text-amber-50 tracking-tight">Curation Studio</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/60">Artisanal Box Assembly</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="skeuo-button p-2.5 rounded-full text-stone-500 hover:text-amber-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {completedOrder ? (
              /* Order Confirmation Screen */
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-8 overflow-y-auto">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-24 h-24 rounded-full skeuo-button-gold flex items-center justify-center text-stone-950 shadow-[0_0_50px_rgba(245,158,11,0.4)]"
                >
                  <CheckCircle className="w-12 h-12" />
                </motion.div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500 animate-pulse-glow">Ritual Confirmed</span>
                  <h3 className="font-serif text-4xl font-black text-amber-50 tracking-tighter">Kettle Simmer Initiated</h3>
                  <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
                    Greetings, <strong className="text-amber-400">{completedOrder.customerName}</strong>. Your artisanal curation <span className="font-mono text-amber-500">#{completedOrder.id.slice(-6)}</span> has entered the 18-hour copper kettle cycle.
                  </p>
                </div>

                <div className="w-full neo-concave p-6 rounded-2xl text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Tier Selected</span>
                    <span className="text-xs font-bold text-amber-200">{completedOrder.boxSize}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Culinary Investment</span>
                    <span className="text-sm font-black text-amber-400 font-mono">${completedOrder.totalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Kitchen Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2 px-2 py-1 rounded-full neo-convex-sm">
                      <Sparkles className="w-3 h-3" /> {completedOrder.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClose();
                  }}
                  className="w-full skeuo-button-gold py-5 text-sm font-black uppercase tracking-[0.25em]"
                >
                  Return to Tasting Room
                </button>
              </div>
            ) : (
              /* Main Box Curation Form */
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Box Size Toggle */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">1. Select Culinary Tier</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setBoxSize("4-pack")}
                      className={`p-5 rounded-2xl border text-left transition-all duration-500 ${
                        boxSize === "4-pack"
                          ? "skeuo-button-gold"
                          : "neo-convex border-white/5 text-stone-500"
                      }`}
                    >
                      <span className={`block text-sm font-black uppercase tracking-tighter ${boxSize === "4-pack" ? "text-stone-950" : "text-amber-50/90"}`}>4-Pack Signature</span>
                      <span className={`block text-[10px] font-bold mt-1 ${boxSize === "4-pack" ? "text-stone-900/60" : "text-amber-500/50"}`}>$68 • 4 Insulated Jars</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoxSize("8-pack")}
                      className={`p-5 rounded-2xl border text-left transition-all duration-500 relative ${
                        boxSize === "8-pack"
                          ? "skeuo-button-gold"
                          : "neo-convex border-white/5 text-stone-500"
                      }`}
                    >
                      {boxSize !== "8-pack" && (
                        <span className="absolute -top-2 right-2 neo-convex-sm bg-amber-500 text-stone-950 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          Best Value
                        </span>
                      )}
                      <span className={`block text-sm font-black uppercase tracking-tighter ${boxSize === "8-pack" ? "text-stone-950" : "text-amber-50/90"}`}>8-Pack Reserve</span>
                      <span className={`block text-[10px] font-bold mt-1 ${boxSize === "8-pack" ? "text-stone-900/60" : "text-amber-500/50"}`}>$118 • 8 Insulated Jars</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Box Capacity</span>
                    <span className={`text-xs font-black font-mono ${totalJarsSelected === maxJars ? "text-emerald-400" : "text-amber-500"}`}>
                      {totalJarsSelected} / {maxJars} JARS
                    </span>
                  </div>
                  <div className="w-full h-3 neo-concave rounded-full p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(245,158,11,0.3)] ${
                        totalJarsSelected === maxJars ? "bg-emerald-400" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min((totalJarsSelected / maxJars) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Jar Selector List */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">2. Curation Menu</label>
                  <div className="space-y-3">
                    {BROTH_CATALOG.map((flavor) => {
                      const qty = cartQuantities[flavor.id] || 0;
                      return (
                        <div
                          key={flavor.id}
                          className="neo-convex p-4 rounded-2xl border border-white/5 flex items-center justify-between group transition-all hover:scale-[1.01]"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl neo-concave flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                              {flavor.emoji}
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-tight text-amber-50">{flavor.name}</p>
                              <p className="text-[10px] font-bold text-stone-500 mt-0.5">
                                {flavor.caloriesNum} KCAL • {flavor.proteinNum}G PRO
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 neo-concave p-1 rounded-xl">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(flavor.id, -1)}
                              disabled={qty === 0}
                              className="w-8 h-8 rounded-lg skeuo-button text-stone-400 hover:text-amber-500 disabled:opacity-20 flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-black text-sm text-amber-400 font-mono">{qty}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(flavor.id, 1)}
                              disabled={totalJarsSelected >= maxJars}
                              className="w-8 h-8 rounded-lg skeuo-button-gold text-stone-950 disabled:opacity-20 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Macro Summary Pill */}
                {totalJarsSelected > 0 && (
                  <div className="neo-convex p-5 rounded-2xl border-amber-500/10">
                    <p className="text-amber-500 font-black uppercase text-[9px] tracking-[0.25em] mb-3">Nutritional Profile</p>
                    <div className="flex justify-between items-center text-stone-400">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-amber-50">{totalCalories}</span>
                        <span className="text-[9px] font-black uppercase">Calories</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-amber-50">{totalProtein}g</span>
                        <span className="text-[9px] font-black uppercase">Protein</span>
                      </div>
                      <div className="w-px h-4 bg-white/10" />
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs font-bold text-amber-50">{totalJarsSelected * 16}oz</span>
                        <span className="text-[9px] font-black uppercase">Volume</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping & Customer Details */}
                <form onSubmit={handleCheckout} className="space-y-6 border-t border-white/5 pt-8">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80">3. Logistics & Ritual</label>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="CONNOISSEUR NAME"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full neo-concave px-5 py-4 rounded-xl text-[11px] font-bold tracking-widest text-amber-50 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 uppercase"
                    />
                    <input
                      type="email"
                      placeholder="SECURE EMAIL"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full neo-concave px-5 py-4 rounded-xl text-[11px] font-bold tracking-widest text-amber-50 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 uppercase"
                    />
                    <input
                      type="text"
                      placeholder="GEOGRAPHICAL DESTINATION"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full neo-concave px-5 py-4 rounded-xl text-[11px] font-bold tracking-widest text-amber-50 placeholder:text-stone-600 focus:outline-none focus:ring-1 focus:ring-amber-500/30 uppercase"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <Truck className="w-5 h-5 text-amber-500 shrink-0" />
                    <span className="text-[10px] font-bold text-stone-400 leading-normal uppercase tracking-tight">Insulated temperature-controlled dispatch within 24 hours.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || totalJarsSelected < 1}
                    className={`w-full py-5 rounded-full skeuo-button-gold font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${isSubmitting ? 'animate-pulse' : 'hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_rgba(245,158,11,0.2)]'}`}
                  >
                    {isSubmitting ? (
                      <span>Sealing Jars...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Confirm Curation (${basePrice})</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
