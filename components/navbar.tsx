'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { ChevronDown, Clock, Flame, LogOut, Menu, Package, ShoppingBag, Sparkles, User, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProduct } from '@/lib/catalog-engine';

interface NavbarProps {
  onOpenCart?: () => void;
}

interface OrderSummary {
  id: string;
  boxSize: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

function AuthControls({
  onOpenCart,
}: Pick<NavbarProps, "onOpenCart">) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
  const { items, totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !isSignedIn || orders.length > 0) return;

    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const response = await fetch("/api/orders");
        const data = await response.json();
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load profile orders:", error);
      } finally {
        setOrdersLoading(false);
      }
    };

    void loadOrders();
  }, [isOpen, isSignedIn, orders.length]);

  if (!isLoaded) return null;

  if (isSignedIn && user) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="flex min-h-11 items-center gap-2 rounded-full neo-convex px-2 py-1.5 text-left transition-all hover:scale-[1.02] active:scale-95"
        >
          <img
            src={user.imageUrl}
            alt={`${user.fullName ?? "Member"}'s profile photo`}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-amber-500/50 tactile-texture"
          />
          <span className="hidden lg:block max-w-28 truncate text-xs font-bold text-amber-100">
            {user.firstName ?? "Member"}
          </span>
          <ChevronDown className={`h-4 w-4 text-amber-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-14 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl glass-panel border-amber-500/20 shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="tactile-texture flex items-center gap-3 border-b border-white/10 bg-amber-500/10 p-4">
              <div className="relative">
                <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/40" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-amber-500 border-2 border-stone-950 flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-stone-950" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-lg font-bold text-amber-50">{user.fullName ?? "Tasting Member"}</p>
                <p className="truncate text-xs text-stone-400">{user.primaryEmailAddress?.emailAddress ?? "Verified member"}</p>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <section className="neo-concave rounded-xl p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-amber-500/80">
                    <ShoppingBag className="h-3.5 w-3.5" /> Current Selection
                  </h3>
                  <span className="text-[10px] font-bold text-stone-500">{totalItems} jars</span>
                </div>
                {items.length > 0 ? (
                  <div className="space-y-1.5">
                    {items.slice(0, 3).map((item) => {
                      const product = getProduct(item.productId);
                      return (
                        <div key={item.cartItemId} className="flex justify-between gap-3 text-xs text-stone-300">
                          <span className="truncate">{product?.name ?? item.productId}</span>
                          <span className="shrink-0 font-bold text-amber-400">× {item.quantity}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic">No jars selected yet...</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCart?.();
                  }}
                  className="mt-3 w-full skeuo-button-gold py-2 text-xs font-black uppercase tracking-wider"
                >
                  View Tasting Box
                </button>
              </section>

              <section className="border-t border-white/5 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-stone-400">
                    <Package className="h-3.5 w-3.5" /> Recent Orders
                  </h3>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[10px] font-bold text-amber-400/70 hover:text-amber-400">
                    See All
                  </Link>
                </div>
                {ordersLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-500/20 border-t-amber-500" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 text-[11px]">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-stone-200">{order.boxSize}</p>
                          <p className="flex items-center gap-1 text-[10px] text-stone-500">
                            <Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="shrink-0 neo-convex-sm px-1.5 py-0.5 rounded text-amber-300 font-mono">${order.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic">No orders history yet.</p>
                )}
              </section>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="skeuo-button py-2 text-center text-[11px] font-bold text-stone-200">
                  Portal
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut({ redirectUrl: "/" })}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/10 bg-red-500/5 py-2 text-[11px] font-bold text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        className="text-sm font-bold text-stone-400 hover:text-amber-400 transition-colors px-2"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="skeuo-button-gold px-5 py-2.5 text-xs font-black uppercase tracking-widest"
      >
        Join Club
      </Link>
    </div>
  );
}

export function Navbar({ onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-white/5 tactile-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl skeuo-button-gold flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
            <Flame className="w-6 h-6 text-stone-950" />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif font-black text-2xl tracking-tighter bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-transparent block leading-none">
              ZEVA_Jee G
            </span>
            <span className="text-[9px] tracking-[0.3em] text-amber-500/60 font-black uppercase block mt-0.5">
              Artisanal Broths
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 neo-concave p-1 rounded-full border border-white/5">
          {['flavors', 'kettle', 'sourcing', 'reviews', 'faq'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-stone-400 hover:text-amber-400 hover:neo-convex rounded-full transition-all duration-300"
            >
              {item === 'flavors' ? 'Menu' : item === 'kettle' ? 'Process' : item}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-5">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative skeuo-button p-2.5 rounded-full text-amber-400 hover:scale-110 active:scale-95 group"
            aria-label="Open Tasting Box Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full skeuo-button-gold border-2 border-stone-950 text-stone-950 font-black text-[10px] flex items-center justify-center shadow-lg animate-pulse-glow">
                {totalItems}
              </span>
            )}
          </button>

          {/* Auth Controls */}
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <AuthControls onOpenCart={onOpenCart} />
          ) : (
            <button
              onClick={onOpenCart}
              className="skeuo-button-gold px-6 py-2.5 text-xs font-black uppercase tracking-widest"
            >
              Build Box
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden skeuo-button p-2.5 text-amber-400"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 glass-panel px-6 py-8 space-y-6 animate-in slide-in-from-top-5 duration-500">
          <div className="grid grid-cols-1 gap-2">
            {['flavors', 'kettle', 'sourcing', 'reviews', 'faq'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMobileMenuOpen(false)}
                className="neo-convex p-4 rounded-xl text-sm font-bold text-stone-300 flex items-center justify-between group"
              >
                <span className="uppercase tracking-widest">{item}</span>
                <ChevronDown className="-rotate-90 h-4 w-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
              </a>
            ))}
          </div>
          
          <div className="pt-6 border-t border-white/10 space-y-4">
             {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
               <div className="flex justify-center">
                <AuthControls onOpenCart={onOpenCart} />
               </div>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCart) onOpenCart();
              }}
              className="w-full skeuo-button-gold py-4 text-sm font-black uppercase tracking-[0.2em]"
            >
              Build Tasting Box ({totalItems})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;