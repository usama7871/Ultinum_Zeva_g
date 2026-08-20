"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Package, ShieldCheck, RefreshCw, Calendar, Award, CircleUserRound, ChevronDown, AlertCircle } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

interface OrderData {
  id: string;
  customerName: string;
  email: string;
  boxSize: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress?: string | null;
  items: Array<{ id?: string; flavorName: string; quantity: number }>;
}

function DashboardContent() {
  const { user } = useUser();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const orderStats = useMemo(() => {
    const jars = orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );
    const spend = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const collagen = orders.reduce(
      (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + (item.flavorName.includes("Bone") ? item.quantity * 18 : item.quantity * 6), 0),
      0,
    );
    return { jars, spend, collagen };
  }, [orders]);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Unable to load your orders");
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        throw new Error(data.error || "Unable to load your orders");
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(err instanceof Error ? err.message : "Unable to load your orders");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => void fetchOrders(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans tactile-texture">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="skeuo-button px-4 py-2 rounded-full inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 hover:text-amber-400"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Room
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 neo-concave px-3 py-1.5 rounded-full">
               <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">Kettle Alerts</span>
               <button 
                onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                className={`w-8 h-4 rounded-full transition-all relative ${isNotificationsEnabled ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-stone-800'}`}
               >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-stone-950 transition-all ${isNotificationsEnabled ? 'left-4.5' : 'left-0.5'}`} />
               </button>
            </div>
            <span className="neo-convex px-4 py-1.5 rounded-full text-[10px] text-amber-400 font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
              <CircleUserRound className="w-4 h-4" /> {user?.firstName ?? "Tasting"} Member
            </span>
          </div>
        </div>

        {/* Profile Header Overhaul */}
        <div className="relative glass-panel rounded-[2.5rem] p-8 sm:p-12 border-white/5 flex flex-col md:flex-row items-center gap-10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl skeuo-button p-1 rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <img 
                src={user?.imageUrl} 
                alt="" 
                className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
               />
               <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl skeuo-button-gold flex items-center justify-center border-4 border-stone-950">
                  <Award className="w-5 h-5 text-stone-950" />
               </div>
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 relative">
            <div>
              <h1 className="font-serif text-5xl font-black text-amber-50 tracking-tighter leading-none mb-2">
                Connoisseur <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">{user?.firstName ?? "Portal"}</span>
              </h1>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-stone-500">Member ID: {user?.id.slice(-8).toUpperCase()}</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="neo-convex-sm px-4 py-1.5 rounded-full text-[10px] font-black text-amber-500/80 bg-stone-900/50">LEVEL 4 ARTISAN</span>
              <span className="neo-convex-sm px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-500/80 bg-stone-900/50">VERIFIED COLLECTOR</span>
              <span className="neo-convex-sm px-4 py-1.5 rounded-full text-[10px] font-black text-stone-400 bg-stone-900/50">JOINED {new Date(user?.createdAt || Date.now()).getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Subscription Status & Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="skeuo-button-gold p-8 rounded-3xl space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <RefreshCw className="w-24 h-24 rotate-12" />
            </div>
            <div className="flex items-center justify-between relative">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-900/60">Dispatch Tier</span>
              <span className="px-3 py-1 rounded-full bg-stone-950 text-amber-400 text-[10px] font-black border border-amber-500/20">
                ACTIVE
              </span>
            </div>
            <h2 className="font-serif text-3xl font-black text-stone-950 relative">{orders[0]?.boxSize ?? "NO ACTIVE BOX"}</h2>
            <div className="space-y-1 relative">
              <p className="text-[10px] font-black uppercase tracking-widest text-stone-900/60">Status Indicator</p>
              <p className="text-sm font-bold text-stone-900">{orders[0] ? orders[0].status : "Awaiting your curation"}</p>
            </div>
            <Link href="/#flavors" className="block w-full py-4 rounded-2xl bg-stone-950 text-center text-amber-400 text-[11px] font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-stone-950/20">
              Modify Subscription
            </Link>
          </div>

          <div className="neo-convex p-8 rounded-3xl space-y-4 border-white/5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Culinary History</span>
            <p className="font-serif text-5xl font-black text-amber-50 tracking-tighter">{orderStats.jars} <span className="text-2xl text-stone-500">Jars</span></p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Investment: ${orderStats.spend.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="neo-convex p-8 rounded-3xl space-y-4 border-white/5">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Marrow Balance</span>
            <p className="font-serif text-5xl font-black text-amber-50 tracking-tighter">{orderStats.collagen} <span className="text-2xl text-stone-500">Grams</span></p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Bio-Active Extraction
              </p>
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="font-serif text-3xl font-black text-amber-50 tracking-tight">Dispatch Archive</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60">Historical Culinary Record</p>
            </div>
            <button
              onClick={fetchOrders}
              disabled={isRefreshing}
              className="skeuo-button px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh Feed
            </button>
          </div>

          {error && (
            <div className="neo-convex border-red-500/20 bg-red-500/5 p-5 rounded-2xl flex items-center gap-3 text-[11px] font-bold text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0" /> {error}
            </div>
          )}

          {isLoading ? (
            <div className="p-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Accessing Archives...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="neo-convex p-20 rounded-[2.5rem] text-center space-y-6 border-white/5">
              <div className="w-16 h-16 rounded-3xl skeuo-button mx-auto flex items-center justify-center text-stone-700">
                <Package className="w-8 h-8" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-stone-400">No dispatch records found on this frequency.</p>
              <Link
                href="/#flavors"
                className="inline-block skeuo-button-gold px-10 py-4 text-[11px] font-black uppercase tracking-[0.25em]"
              >
                Curate Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((ord, idx) => (
                <div
                  key={ord.id}
                  className="group relative"
                >
                  {/* Timeline Line */}
                  {idx !== orders.length - 1 && (
                    <div className="absolute left-8 top-20 bottom-0 w-px bg-white/5 group-hover:bg-amber-500/20 transition-colors hidden sm:block" />
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">
                    {/* Timeline Date Circle */}
                    <div className="hidden sm:flex flex-col items-center pt-2">
                       <div className="w-16 h-16 rounded-2xl skeuo-button flex flex-col items-center justify-center group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-shadow">
                          <span className="text-[10px] font-black uppercase text-amber-500">
                            {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-xl font-black text-amber-50">
                            {new Date(ord.createdAt).toLocaleDateString("en-US", { day: "numeric" })}
                          </span>
                       </div>
                    </div>

                    {/* Order Card Overhaul */}
                    <div className="flex-1 neo-convex p-8 rounded-[2rem] border-white/5 group-hover:border-amber-500/20 transition-all">
                      <div className="flex flex-col lg:flex-row justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] font-black text-stone-500 tracking-tighter">#{ord.id.slice(-12).toUpperCase()}</span>
                            <span className="neo-convex-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-400 border-white/5">
                              {ord.status}
                            </span>
                          </div>
                          
                          <div>
                            <h3 className="font-serif text-2xl font-black text-amber-50 mb-1 group-hover:text-amber-400 transition-colors">{ord.boxSize}</h3>
                            <p className="text-[11px] font-black uppercase tracking-widest text-stone-500">Destination: {ord.shippingAddress?.split(',')[0] ?? "Secure Location"}</p>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {ord.items.map((it, i) => (
                              <div key={i} className="neo-concave px-3 py-1.5 rounded-xl border-white/5 flex items-center gap-2">
                                <span className="text-[10px] font-black text-amber-50/80 uppercase tracking-tight">{it.flavorName}</span>
                                <span className="w-5 h-5 rounded-md bg-amber-500/10 flex items-center justify-center text-[9px] font-black text-amber-500">×{it.quantity}</span>
                              </div>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-amber-400 transition-colors"
                          >
                            {expandedOrderId === ord.id ? "Minimize Dispatch Details" : "Expand Dispatch Details"}
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-500 ${expandedOrderId === ord.id ? "rotate-180" : ""}`} />
                          </button>

                          {expandedOrderId === ord.id && (
                            <div className="mt-4 neo-concave rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2">
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[10px] font-black uppercase tracking-[0.15em]">
                                  <div className="space-y-1">
                                    <p className="text-stone-600">Geographical Origin</p>
                                    <p className="text-stone-300">Culinary Lab #4, ZEVA_Jee G HQ</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-stone-600">Vessel Type</p>
                                    <p className="text-stone-300">Recyclable Insulated Glass</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-stone-600">Simmer Time</p>
                                    <p className="text-stone-300">18.4 Hours (Avg)</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-stone-600">Dispatch Log</p>
                                    <p className="text-stone-300">{new Date(ord.createdAt).toLocaleString()}</p>
                                  </div>
                               </div>
                            </div>
                          )}
                        </div>

                        <div className="lg:text-right flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 pt-6 lg:pt-0 border-t lg:border-t-0 border-white/5">
                          <p className="font-serif text-4xl font-black text-amber-50 group-hover:scale-110 transition-transform origin-right tracking-tighter">${ord.totalPrice}</p>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 flex items-center lg:justify-end gap-2">
                              <Calendar className="w-3.5 h-3.5 text-amber-500" />
                              {new Date(ord.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                            </p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center lg:justify-end gap-2 px-2 py-0.5 neo-convex-sm rounded">
                              <ShieldCheck className="w-3 h-3" /> SECURE DISPATCH
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function Dashboard() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="min-h-screen bg-stone-950 px-6 py-24 text-center text-stone-100">
        <div className="glass-panel mx-auto max-w-lg space-y-4 rounded-3xl p-10">
          <h1 className="font-serif text-3xl font-bold text-amber-50">Member Portal Setup Required</h1>
          <p className="text-sm leading-relaxed text-stone-400">
            Add your Clerk publishable key to the local environment file, restart the development server, and sign in to access your private dashboard.
          </p>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-stone-950 hover:bg-amber-400">
            Return to Tasting Room
          </Link>
        </div>
      </main>
    );
  }

  return <DashboardContent />;
}
