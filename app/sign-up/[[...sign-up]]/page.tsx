import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-950 relative overflow-hidden">
      {/* Glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-md space-y-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400/80 hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tasting Room
        </Link>

        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-gold text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Join The Tasting Club
          </div>
          <h1 className="font-serif text-3xl font-bold text-amber-50">Create Your Account</h1>
          <p className="text-xs text-amber-100/60 mt-1">Unlock exclusive reserve batches, priority shipping & custom box curation</p>
        </div>

        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                card: "glass-panel border border-white/10 shadow-2xl rounded-2xl",
                headerTitle: "text-amber-50 font-serif",
                headerSubtitle: "text-amber-100/60",
                formButtonPrimary: "bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
}
