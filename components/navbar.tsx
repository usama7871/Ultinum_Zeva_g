'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { ChevronDown, Clock, Flame, LogOut, Menu, Package, ShoppingBag, Sparkles, User, X } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  cartQuantities?: Record<string, number>;
  onOpenCart?: () => void;
}

interface OrderSummary {
  id: string;
  boxSize: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

const CART_LABELS: Record<string, string> = {
  tomato: "Roasted Tomato & Basil",
  squash: "Golden Squash & Turmeric",
  mushroom: "Wild Truffle & Mushroom",
  bonebroth: "Sacred Bone Broth",
  detox: "Lemongrass Ginger Detox",
  cauliflower: "Golden Cauliflower",
};

function AuthControls({
  cartCount,
  cartQuantities,
  onOpenCart,
}: Pick<NavbarProps, "cartCount" | "cartQuantities" | "onOpenCart">) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { signOut } = useClerk();
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
    const cartItems = Object.entries(cartQuantities ?? {})
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id,
        quantity,
        name: CART_LABELS[id] ?? id,
      }));

    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className="flex min-h-11 items-center gap-2 rounded-full border border-amber-500/30 bg-stone-900/80 px-2 py-1.5 text-left hover:border-amber-400/60 transition-colors"
        >
          <img
            src={user.imageUrl}
            alt={`${user.fullName ?? "Member"}'s profile photo`}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-amber-500/50"
          />
          <span className="hidden lg:block max-w-28 truncate text-xs font-semibold text-amber-100">
            {user.firstName ?? "Member"}
          </span>
          <ChevronDown className={`h-4 w-4 text-amber-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-14 z-[60] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-amber-500/25 bg-stone-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-white/10 bg-amber-500/5 p-4">
              <img src={user.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500/40" />
              <div className="min-w-0">
                <p className="truncate font-serif text-lg font-bold text-amber-50">{user.fullName ?? "Tasting Member"}</p>
                <p className="truncate text-xs text-stone-400">{user.primaryEmailAddress?.emailAddress ?? "Verified member"}</p>
              </div>
            </div>

            <div className="space-y-4 p-4">
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <ShoppingBag className="h-4 w-4" /> Current Tasting Box
                  </h3>
                  <span className="text-xs text-stone-400">{cartCount ?? 0} jars</span>
                </div>
                {cartItems.length > 0 ? (
                  <div className="space-y-1.5">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex justify-between gap-3 text-xs text-stone-300">
                        <span className="truncate">{item.name}</span>
                        <span className="shrink-0 font-semibold text-amber-300">× {item.quantity}</span>
                      </div>
                    ))}
                    {cartItems.length > 3 && <p className="text-[11px] text-stone-500">More selections in your tasting box</p>}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">Your tasting box is waiting for a selection.</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onOpenCart?.();
                  }}
                  className="mt-3 min-h-10 w-full rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-stone-950 hover:bg-amber-400 transition-colors"
                >
                  Open Tasting Box
                </button>
              </section>

              <section className="border-t border-white/10 pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <Package className="h-4 w-4" /> Recent Orders
                  </h3>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-[11px] text-amber-300 hover:text-amber-200">
                    View all
                  </Link>
                </div>
                {ordersLoading ? (
                  <p className="text-xs text-stone-500">Loading order history…</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-stone-200">{order.boxSize}</p>
                          <p className="flex items-center gap-1 text-[11px] text-stone-500">
                            <Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-amber-300">${order.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">No previous orders yet.</p>
                )}
              </section>

              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="min-h-10 rounded-xl border border-white/10 px-3 py-2 text-center text-xs font-semibold text-stone-200 hover:border-amber-500/40 hover:text-amber-300 transition-colors">
                  Member Portal
                </Link>
                <button
                  type="button"
                  onClick={() => void signOut({ redirectUrl: "/" })}
                  className="flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-stone-400 hover:border-red-400/40 hover:text-red-300 transition-colors"
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
    <div className="flex items-center gap-2">
      <Link
        href="/sign-in"
        className="min-h-11 px-4 py-2.5 text-sm font-semibold rounded-full text-amber-200 hover:text-amber-400 transition-colors flex items-center gap-2"
      >
        <User className="w-4 h-4" />
        <span>Sign In</span>
      </Link>
      <Link
        href="/sign-up"
        className="min-h-11 px-4 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 flex items-center"
      >
        Join Club
      </Link>
    </div>
  );
}

export function Navbar({ cartCount = 0, cartQuantities, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-wide bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent block leading-none">
              ZIVA G
            </span>
            <span className="text-[10px] tracking-widest text-amber-400/70 font-semibold uppercase block">
              Artisanal Broths
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
          <a href="#flavors" className="transition-colors hover:text-amber-400">
            Tasting Menu
          </a>
          <a href="#kettle" className="transition-colors hover:text-amber-400">
            18h Simmer
          </a>
          <a href="#sourcing" className="transition-colors hover:text-amber-400">
            Sourcing
          </a>
          <a href="#reviews" className="transition-colors hover:text-amber-400">
            Reviews
          </a>
          <a href="#faq" className="transition-colors hover:text-amber-400">
            FAQ
          </a>
          <Link href="/dashboard" className="transition-colors hover:text-amber-400 flex items-center gap-1.5 text-xs text-amber-400/90 font-semibold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3 h-3" /> Member Portal
          </Link>
        </nav>

        {/* Action Buttons & Auth */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full glass-panel border border-white/15 text-amber-100 hover:border-amber-400/50 hover:text-amber-400 transition-all group"
            aria-label="Open Tasting Box Cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center shadow-md animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Controls */}
          {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
            <AuthControls cartCount={cartCount} cartQuantities={cartQuantities} onOpenCart={onOpenCart} />
          ) : (
            <button
              onClick={onOpenCart}
              className="min-h-11 px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20"
            >
              Build Tasting Box
            </button>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-amber-200 hover:bg-stone-800"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-stone-950 px-6 pt-4 pb-6 space-y-4">
          <a
            href="#flavors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Tasting Menu
          </a>
          <a
            href="#kettle"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            18h Simmer Process
          </a>
          <a
            href="#sourcing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Organic Sourcing
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            Reviews & Testimonials
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-200 hover:text-amber-400"
          >
            FAQ
          </a>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-amber-400"
          >
            Member Portal
          </Link>
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && (
              <AuthControls cartCount={cartCount} cartQuantities={cartQuantities} onOpenCart={onOpenCart} />
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCart) onOpenCart();
              }}
              className="w-full py-3 text-center text-sm font-bold rounded-xl bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20"
            >
              Build Tasting Box ({cartCount})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;