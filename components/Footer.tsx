"use client";

import { useState } from "react";
import { Flame, Send, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  return (
    <footer className="zeva-footer border-t border-white/10 bg-stone-950/80 backdrop-blur-xl py-12 md:py-16 px-6 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 text-sm text-stone-400 pb-12 border-b border-white/10">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 text-stone-950" />
            </div>
            <span className="font-serif font-bold text-2xl text-amber-50">ZEVA_Jee G</span>
          </div>
          <p className="text-xs text-stone-300 font-light max-w-sm leading-relaxed">
            Crafting luxury, organic slow-simmered broths in small batches. Delivered in eco-friendly insulated glass packaging directly to your doorstep.
          </p>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3 text-xs">
          <p className="font-serif font-bold text-amber-200 text-sm">Culinary Experience</p>
          <ul className="space-y-2">
            <li><a href="#flavors" className="hover:text-amber-400 transition-colors">Tasting Room</a></li>
            <li><a href="#kettle" className="hover:text-amber-400 transition-colors">18h Simmer Science</a></li>
            <li><a href="#sourcing" className="hover:text-amber-400 transition-colors">Organic Sourcing</a></li>
            <li><a href="#reviews" className="hover:text-amber-400 transition-colors">Chef Reviews</a></li>
            <li><a href="#faq" className="hover:text-amber-400 transition-colors">FAQ & Storage</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="md:col-span-4 space-y-3">
          <p className="font-serif font-bold text-amber-200 text-sm">The Broth Gazette</p>
          <p className="text-xs text-stone-400">Receive private invitations to seasonal reserve kettle batches.</p>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-2.5 rounded-xl bg-stone-900 border border-white/15 text-xs text-stone-100 focus:outline-none focus:border-amber-500 flex-1"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shrink-0"
            >
              {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          {subscribed && <p className="text-[11px] text-emerald-400">Subscribed to private reserve alerts!</p>}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} ZEVA_Jee G Artisanal Broths. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-stone-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-stone-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-stone-300 transition-colors">Sourcing Certification</a>
        </div>
      </div>
    </footer>
  );
}