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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-stone-950 border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-stone-900/50">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-xl text-amber-50">Build Your Tasting Box</h2>
                  <p className="text-xs text-amber-400/80">Fresh 18-hour copper kettle broths</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {completedOrder ? (
              /* Order Confirmation Screen */
              <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6 overflow-y-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">Order Confirmed</span>
                  <h3 className="font-serif text-3xl font-bold text-amber-50">Kettle Simmer Initiated!</h3>
                  <p className="text-sm text-stone-300 max-w-sm mx-auto">
                    Thank you, <strong className="text-amber-400">{completedOrder.customerName}</strong>! Your order <span className="font-mono text-amber-300">{completedOrder.id}</span> has been dispatched to our culinary team.
                  </p>
                </div>

                <div className="w-full glass-panel p-6 rounded-2xl text-left space-y-3 text-xs text-stone-300">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400">Selection:</span>
                    <span className="font-semibold text-amber-200">{completedOrder.boxSize}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-stone-400">Total Investment:</span>
                    <span className="font-bold text-amber-400 text-sm">${completedOrder.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Status:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> {completedOrder.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    onClose();
                  }}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold hover:scale-105 transition-all shadow-xl"
                >
                  Return to Tasting Room
                </button>
              </div>
            ) : (
              /* Main Box Curation Form */
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Box Size Toggle */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold">1. Choose Box Tier</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setBoxSize("4-pack")}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        boxSize === "4-pack"
                          ? "glass-panel-gold border-amber-500 text-amber-50"
                          : "glass-panel border-white/10 text-stone-400 hover:border-amber-500/40"
                      }`}
                    >
                      <span className="block text-sm font-bold text-amber-50">4-Pack Signature</span>
                      <span className="block text-xs text-amber-400 font-medium">$68 • 4 Insulated Jars</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBoxSize("8-pack")}
                      className={`p-4 rounded-2xl border text-left transition-all relative ${
                        boxSize === "8-pack"
                          ? "glass-panel-gold border-amber-500 text-amber-50"
                          : "glass-panel border-white/10 text-stone-400 hover:border-amber-500/40"
                      }`}
                    >
                      <span className="absolute -top-2.5 right-3 bg-amber-500 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Save 15%
                      </span>
                      <span className="block text-sm font-bold text-amber-50">8-Pack Reserve</span>
                      <span className="block text-xs text-amber-400 font-medium">$118 • 8 Insulated Jars</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-300">Box Capacity</span>
                    <span className={totalJarsSelected === maxJars ? "text-emerald-400" : "text-amber-400"}>
                      {totalJarsSelected} / {maxJars} Jars Selected
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        totalJarsSelected === maxJars ? "bg-emerald-400" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min((totalJarsSelected / maxJars) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Jar Selector List */}
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold">2. Select Your Signature Broths</label>
                  <div className="space-y-2">
                    {BROTH_CATALOG.map((flavor) => {
                      const qty = cartQuantities[flavor.id] || 0;
                      return (
                        <div
                          key={flavor.id}
                          className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{flavor.emoji}</span>
                            <div>
                              <p className="text-xs font-bold text-stone-100">{flavor.name}</p>
                              <p className="text-[11px] text-stone-400">
                                {flavor.caloriesNum} kcal • {flavor.proteinNum}g protein
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(flavor.id, -1)}
                              disabled={qty === 0}
                              className="w-7 h-7 rounded-lg bg-stone-800 border border-white/10 hover:bg-stone-700 disabled:opacity-30 text-stone-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs text-amber-300">{qty}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(flavor.id, 1)}
                              disabled={totalJarsSelected >= maxJars}
                              className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center font-bold transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Macro Summary Pill */}
                {totalJarsSelected > 0 && (
                  <div className="glass-panel-gold p-4 rounded-xl text-xs space-y-1">
                    <p className="text-amber-300 font-bold uppercase text-[10px] tracking-widest">Tasting Box Nutrients</p>
                    <div className="flex justify-between text-stone-200">
                      <span>Total Energy: <strong className="text-amber-100">{totalCalories} kcal</strong></span>
                      <span>Total Protein: <strong className="text-amber-100">{totalProtein}g</strong></span>
                    </div>
                  </div>
                )}

                {/* Shipping & Customer Details */}
                <form onSubmit={handleCheckout} className="space-y-4 border-t border-white/10 pt-4">
                  <label className="text-xs uppercase tracking-wider text-amber-400 font-semibold">3. Delivery Details</label>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="email"
                      placeholder="Email Address (for tracking)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Shipping Address (City, State, Zip)"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-stone-900 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Ships chilled in insulated recyclable glass packaging</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || totalJarsSelected < 1}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    {isSubmitting ? (
                      <span>Cooking & Sealing...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Confirm Tasting Box (${basePrice})</span>
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
