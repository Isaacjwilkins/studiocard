"use client";
import { useState } from 'react';
import { Check, Zap, ArrowRight, ExternalLink, School, MessageSquare } from 'lucide-react';

// Helper for rgba colors if needed, otherwise use hex/tailwind
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function PricingPage() {
  const [isPro, setIsPro] = useState(false);

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      
      {/* HEADER */}
      <div className="text-center space-y-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Simple Pricing
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">plan</span>.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          From solo practice to district-wide programs, we scale with your music.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-24 items-stretch">
        
        {/* 1. STUDENTS (Free) */}
        <div className="relative p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-xl flex flex-col h-full">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-foreground mb-2">Students</h3>
            <p className="text-sm text-zinc-500 font-medium mb-4">For the rising stars.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-foreground">$0</span>
              <span className="text-sm text-zinc-400 font-bold uppercase tracking-widest">/ Forever</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Custom Artist Profile", "Shareable Link", "Unlimited Plays", "Mobile Optimized"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-foreground">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <a href="/profile" className="w-full py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-foreground font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-center">
            Create Profile
          </a>
        </div>

        {/* 2. TEACHERS (Dynamic Standard/Pro) */}
        <div className={`relative p-8 rounded-[2.5rem] transition-all duration-500 flex flex-col h-full border-4 ${
          isPro 
          ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.4)]" 
          : "bg-zinc-700 dark:bg-white text-white dark:text-black border-red-500/20 shadow-2xl"
        }`}>
          
          {/* Most Popular Tag */}
          {!isPro && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
              Most Popular
            </div>
          )}

          {/* THE PRO TOGGLE BUTTON (Shimmering) */}
          <button 
            onClick={() => setIsPro(!isPro)}
            className={`absolute top-6 right-6 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest overflow-hidden transition-all active:scale-95 ${
              isPro 
              ? "bg-white text-indigo-600" 
              : "bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <Zap size={10} fill="currentColor" /> {isPro ? "Standard" : "Go Pro"}
            </span>
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer-fast pointer-events-none" />
          </button>

          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2">{isPro ? "Pro Teacher" : "Teachers"}</h3>
            <p className="text-sm opacity-70 font-medium mb-4">
              {isPro ? "For the power user." : "Manage your studio."}
            </p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                {isPro && <span className="text-2xl font-bold line-through opacity-40">$80</span>}
                <span className="text-5xl font-black">{isPro ? "$40" : "$10"}</span>
                <span className="text-sm opacity-60 font-bold uppercase tracking-widest">/ Month</span>
              </div>
              {!isPro && <p className="text-xs font-bold text-red-400 dark:text-red-600 uppercase tracking-wider">+ $5 / student</p>}
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            {(isPro 
              ? ["Expanded Dashboard", "Lossless Audio Quality", "Custom Domain Support", "Advanced Analytics", "Priority 24/7 Support"]
              : ["Teacher Dashboard", "Track Student Practice", "Private Feedback Notes", "Early Access to Features"]
            ).map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-left-2 duration-300">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isPro ? "bg-white/20" : "bg-white/20 dark:bg-black/10"}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>

          <a href="/connect" className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all text-center ${
            isPro 
            ? "bg-white text-indigo-600 hover:bg-zinc-100 shadow-xl" 
            : "bg-white dark:bg-black text-black dark:text-white hover:scale-105"
          }`}>
            {isPro ? "Claim Pro Access" : "Get Started"}
          </a>
        </div>

        {/* 3. INSTITUTIONAL (New Partnership Plan) */}
        <div className="relative p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col h-full group hover:border-blue-500/50 transition-colors">
          <div className="mb-6">
          
            <h3 className="text-2xl font-black text-foreground mb-2">Institutional</h3>
            <p className="text-sm text-zinc-500 font-medium mb-4">For schools & districts.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">Pricing Varies</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "District-Wide Licensing",
              "SSO & Roster Integration",
              "Admin Oversight Tools",
              "Custom Training Sessions",
              "Curriculum Alignment"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <a href="/connect" className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2">
            <MessageSquare size={14} /> Get a Quote
          </a>
        </div>

      </div>

      {/* SEPARATE: STUDIO LIVE LINK */}
      <section className="max-w-4xl mx-auto">
        <div className="p-8 md:p-12 rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-4 max-w-lg">
            <h3 className="text-3xl font-bold tracking-tight">Looking for something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">more?</span></h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Check out <strong className="text-foreground">studio.card <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500">live</span></strong>. Our ecosystem to have your music professionally recorded and produced. Beta testing is now open for educational partners.
            </p>
          </div>
          <a 
            href="https://studiocard.live" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
          >
            Visit studiocard.live <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* TAILWIND ANIMATION EXTENSION */}
      <style jsx global>{`
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-fast {
          animation: shimmer-fast 1.5s infinite;
        }
      `}</style>

    </main>
  );
}