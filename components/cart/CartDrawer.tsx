"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ShoppingBag, Plus, Minus, Trash2, 
  Sparkles, Truck, ShieldCheck, ChevronRight,
  Flame, Leaf, Info
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProduct, calculateItemPrice } from "@/lib/catalog-engine";
import { PortionSize, SpiceLevel } from "@/types/soup";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, subtotal, totalItems, updateItemConfig } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Free delivery threshold
  const FREE_DELIVERY_THRESHOLD = 100;
  const progressToFreeDelivery = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remainingForFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  const handleCheckout = async () => {
    setCheckoutError(null);
    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/cart/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            spiceLevel: item.spiceLevel,
            addOns: item.addOns.map((addOn) => addOn.id),
            specialInstructions: item.specialInstructions,
          })),
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.success || typeof data.whatsappUrl !== "string") {
        const message = data && typeof data.error === "string"
          ? data.error
          : "We could not prepare your WhatsApp order. Please try again.";
        throw new Error(message);
      }

      window.location.assign(data.whatsappUrl);
    } catch (error) {
      console.error("Failed to open WhatsApp checkout:", error);
      setCheckoutError(error instanceof Error ? error.message : "Network error. Please try again.");
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-stone-950 border-l border-white/10 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-amber-50">Your Selection</h2>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/5 text-stone-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="px-6 py-4 bg-amber-500/5 border-b border-white/5">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200/60">
                  {remainingForFreeDelivery > 0 
                    ? `Add $${remainingForFreeDelivery.toFixed(2)} more for Free Delivery`
                    : "Free Delivery Unlocked!"}
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  {progressToFreeDelivery.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-stone-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeDelivery}%` }}
                  className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center text-stone-700">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-stone-300">Your cart is empty</h3>
                    <p className="text-sm text-stone-500 mt-1">Discover our signature collection</p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const product = getProduct(item.productId);
                  if (!product) return null;
                  const itemPrice = calculateItemPrice(item.productId, item.size, item.addOns);

                  return (
                    <motion.div 
                      key={item.cartItemId}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group relative glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-stone-900 flex items-center justify-center text-4xl select-none">
                          {product.imageEmoji}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-bold text-amber-50 leading-tight">
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                                <span className="text-amber-400/80 font-mono">
                                  {item.size.replace('BOWL_', '').replace('FAMILY_', '')}
                                </span>
                                {item.spiceLevel && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-stone-700" />
                                    <span className="text-red-400/80">{item.spiceLevel}</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <button 
                              onClick={() => removeItem(item.cartItemId)}
                              className="p-1.5 text-stone-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-white/5">
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-amber-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-6 text-center text-xs font-mono font-bold text-amber-200">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="w-7 h-7 flex items-center justify-center text-stone-400 hover:text-amber-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-mono font-bold text-amber-400">
                                ${(itemPrice * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Add-ons mini chips */}
                      {item.addOns.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                          {item.addOns.map(addon => (
                            <span key={addon.id} className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/5">
                              + {addon.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 bg-stone-900/50 border-t border-white/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Subtotal</span>
                    <span className="font-mono text-stone-200">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>Estimated Shipping</span>
                    <span className="font-mono text-emerald-400">
                      {subtotal >= FREE_DELIVERY_THRESHOLD ? "FREE" : "$12.00"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/5">
                    <span className="text-sm font-bold text-amber-50">Grand Total</span>
                    <span className="text-lg font-mono font-bold text-amber-400">
                      ${(subtotal + (subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 12)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => void handleCheckout()}
                  disabled={isCheckingOut}
                  aria-busy={isCheckingOut}
                  className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:cursor-wait disabled:opacity-70 text-stone-950 font-black uppercase tracking-[0.2em] text-sm shadow-[0_20px_40px_rgba(245,158,11,0.2)] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{isCheckingOut ? "Opening WhatsApp..." : "Initiate Checkout"}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {checkoutError && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <span>{checkoutError}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 py-2 opacity-40">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Secure Culinary Pipeline</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
