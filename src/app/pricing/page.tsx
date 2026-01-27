"use client";
import { Check, Zap, ArrowRight, ExternalLink } from 'lucide-react';

export default function PricingPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      
      {/* HEADER */}
      <div className="text-center space-y-6 mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
          Simple Pricing
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          Choose your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">path</span>.
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Whether you're learning your first song or managing a full studio, we have a plan for you.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-24 items-start">
        
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

        {/* 2. TEACHERS (Standard) - Highlighted */}
        <div className="relative p-8 rounded-[2.5rem] bg-zinc-900 dark:bg-white text-white dark:text-black shadow-2xl scale-105 z-10 flex flex-col h-full border-4 border-red-500/20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2">Teachers</h3>
            <p className="text-sm opacity-70 font-medium mb-4">Manage your studio.</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold line-through opacity-40">$20</span>
                <span className="text-5xl font-black">$10</span>
                <span className="text-sm opacity-60 font-bold uppercase tracking-widest">/ Month</span>
              </div>
              <p className="text-xs font-bold text-red-400 dark:text-red-600 uppercase tracking-wider">+ $5 / student</p>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["Teacher Dashboard", "Track Student Practice", "Private Feedback Notes", "Priority Support", "Early Access to Features"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <a href="/connect" className="w-full py-4 rounded-xl bg-white dark:bg-black text-black dark:text-white font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-transform text-center">
            Start Free Trial
          </a>
        </div>

        {/* 3. STUDIO CARD PRO (New) */}
        <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl flex flex-col h-full overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
              <Zap size={24} fill="currentColor" className="text-yellow-400" /> Pro
            </h3>
            <p className="text-sm opacity-80 font-medium mb-4">For the power user.</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold line-through opacity-40">$80</span>
                <span className="text-5xl font-black">$40</span>
                <span className="text-sm opacity-60 font-bold uppercase tracking-widest">/ Month</span>
              </div>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            {["4K Video Hosting", "Lossless Audio Quality", "Custom Domain Support", "Advanced Analytics", "0% Commission on Tips"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold opacity-90">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <a href="/connect" className="relative z-10 w-full py-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 font-black text-xs uppercase tracking-[0.2em] transition-all text-center">
            Upgrade to Pro
          </a>
        </div>

      </div>

      {/* SEPARATE: STUDIO LIVE LINK */}
      <section className="max-w-4xl mx-auto">
        <div className="p-8 md:p-12 rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="space-y-4 max-w-lg">
            <h3 className="text-3xl font-bold tracking-tight">Looking for something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">more?</span></h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">
              Check out <strong className="text-foreground">studio.card <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-green-500">live</span></strong>. Our ecosystem to have your music professionally recorded and produced, for 10% of the cost.
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

    </main>
  );
}