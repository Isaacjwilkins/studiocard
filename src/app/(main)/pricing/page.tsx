"use client";
import { Check, Sparkles, ArrowRight, HelpCircle, MessageSquare } from 'lucide-react';
import Link from "next/link";

export default function PricingPage() {
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
          Start free with 3 students. Upgrade anytime for unlimited.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-24 items-stretch">

        {/* 1. FREE TIER */}
        <div className="relative p-8 rounded-[2.5rem] bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-white/10 shadow-xl flex flex-col h-full">
          {/* HEADER */}
          <div className="mb-6">
            <h3 className="text-2xl font-black mb-2">Free</h3>
            <p className="text-sm text-zinc-500 font-medium mb-4">Perfect for getting started.</p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">$0</span>
              <span className="text-sm text-zinc-500 font-bold uppercase tracking-widest">/ forever</span>
            </div>
          </div>

          {/* FEATURES */}
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "Up to 3 Students",
              "Student Profile Cards",
              "Audio Recording & Upload",
              "Shareable Links",
              "Teacher Dashboard"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/studio"
            className="w-full py-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-black text-xs uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        {/* 2. STUDIO PLAN */}
        <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-4 border-transparent shadow-2xl scale-[1.03] flex flex-col h-full">
          {/* GRADIENT GLOW */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 -z-10 blur-xl opacity-50" />

          {/* POPULAR BADGE */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
            <Sparkles size={10} /> Most Popular
          </div>

          {/* HEADER */}
          <div className="mb-6 pt-2">
            <h3 className="text-2xl font-black mb-2">Studio Plan</h3>
            <p className="text-sm text-white/70 font-medium mb-4">For growing studios.</p>

            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">$29</span>
              <span className="text-sm text-white/60 font-bold uppercase tracking-widest">/ month</span>
            </div>
          </div>

          {/* FEATURES */}
          <ul className="space-y-4 mb-8 flex-1">
            {[
              "Unlimited Students",
              "Everything in Free",
              "Inbox: See All New Recordings",
              "Send Feedback to Students",
              "Priority Support"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Check size={14} strokeWidth={3} />
                </div>
                {item}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href="/studio"
            className="w-full py-4 rounded-xl bg-white text-indigo-700 hover:bg-white/90 font-black text-xs uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center gap-2 shadow-lg"
          >
            Purchase <Sparkles size={14} />
          </Link>
        </div>

        {/* 3. INSTITUTIONAL */}
        <div className="relative p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-zinc-800/50 border-2 border-dashed border-zinc-200 dark:border-white/10 flex flex-col h-full group hover:border-blue-500/50 transition-colors">
          <div className="mb-6">
            <h3 className="text-2xl font-black text-foreground mb-2">Institutional</h3>
            <p className="text-sm text-zinc-500 font-medium mb-4">For schools & districts.</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-foreground">Custom</span>
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
          <Link href="/support" className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-700 transition-all text-center flex items-center justify-center gap-2">
            <MessageSquare size={14} /> Get a Quote
          </Link>
        </div>

      </div>

      {/* HAVE QUESTIONS? */}
      <section className="max-w-4xl mx-auto">
        <div className="p-8 md:p-12 rounded-[3rem] border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <HelpCircle size={28} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">Have questions?</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Check out our FAQ or reach out to our support team. We&apos;re here to help you get started.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/faq"
              className="px-6 py-3 rounded-xl bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 font-bold text-xs uppercase tracking-widest transition-colors text-center"
            >
              View FAQ
            </Link>
            <Link
              href="/support"
              className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 font-bold text-xs uppercase tracking-widest transition-colors text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
