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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tasting Room
          </Link>
          <span className="text-xs px-3 py-1 rounded-full glass-panel-gold text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-2">
            <CircleUserRound className="w-3.5 h-3.5" /> {user?.firstName ?? "Tasting"} Member
          </span>
        </div>

        {/* Header */}
        <div className="space-y-2 border-b border-white/10 pb-6">
          <h1 className="font-serif text-4xl font-bold text-amber-50">Broth Club Member Portal</h1>
          <p className="text-xs text-stone-400">
            {user?.primaryEmailAddress?.emailAddress ?? "Manage your insulated box subscriptions, kettle dispatch, and tasting logs."}
          </p>
        </div>

        {/* Subscription Status & Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel-gold p-6 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Active Subscription</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-amber-50">{orders[0]?.boxSize ?? "No active box yet"}</h2>
            <p className="text-xs text-stone-300">{orders[0] ? `Latest status: ${orders[0].status}` : "Curate your first insulated delivery."}</p>
            <Link href="/#flavors" className="block w-full py-2.5 rounded-xl bg-amber-500 text-center text-stone-950 text-xs font-bold hover:bg-amber-400 transition-colors">
              {orders[0] ? "Build Another Tasting Box" : "Curate Your First Box"}
            </Link>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Total Simmered Jars Delivered</span>
            <p className="font-serif text-4xl font-bold text-amber-50">{orderStats.jars} Jars</p>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <Award className="w-4 h-4 text-amber-400" /> Total invested: ${orderStats.spend.toFixed(2)}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 font-semibold">Collagen Balance</span>
            <p className="font-serif text-4xl font-bold text-amber-50">{orderStats.collagen} g</p>
            <p className="text-xs text-stone-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bio-Available Marrow Extract
            </p>
          </div>
        </div>

        {/* Order History Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-bold text-amber-50 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" /> Recent Dispatch Orders
            </h2>
            <button
              onClick={fetchOrders}
              disabled={isRefreshing}
              className="min-h-11 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /> Refresh Dispatch Feed
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {isLoading ? (
            <div className="p-12 text-center text-xs text-stone-400">Loading your dispatch records...</div>
          ) : orders.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
              <p className="text-sm font-semibold text-stone-300">No active orders found.</p>
              <Link
                href="/#flavors"
                className="inline-block px-6 py-3 rounded-full bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
              >
                Curate Your First Tasting Box
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-amber-500/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-400 text-xs">{ord.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                        {ord.status}
                      </span>
                    </div>
                    <p className="font-serif font-bold text-lg text-amber-50">{ord.boxSize}</p>
                    <p className="text-xs text-stone-400">
                      Customer: {ord.customerName} ({ord.email})
                    </p>
                    {ord.items && ord.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {ord.items.map((it, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-stone-900 text-stone-300 border border-white/10"
                          >
                            {it.flavorName} × {it.quantity}
                          </span>
                        ))}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedOrderId(expandedOrderId === ord.id ? null : ord.id)}
                      className="mt-3 inline-flex min-h-10 items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300"
                    >
                      {expandedOrderId === ord.id ? "Hide order details" : "View order details"}
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedOrderId === ord.id ? "rotate-180" : ""}`} />
                    </button>
                    {expandedOrderId === ord.id && (
                      <div className="mt-3 space-y-1 rounded-xl border border-white/10 bg-stone-950/60 p-3 text-xs text-stone-400">
                        <p>Delivery: {ord.shippingAddress || "Temperature-controlled express shipping"}</p>
                        <p>Contact: {ord.email}</p>
                        <p>Order placed: {new Date(ord.createdAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>

                  <div className="text-left md:text-right space-y-1 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
                    <p className="font-serif font-bold text-2xl text-amber-400">${ord.totalPrice}</p>
                    <p className="text-[11px] text-stone-400 flex items-center md:justify-end gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(ord.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
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