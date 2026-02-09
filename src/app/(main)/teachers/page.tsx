"use client";

import Link from "next/link";
import { Inbox, Users, Calendar, ShieldCheck, ArrowRight, Sparkles, Check, Clock } from "lucide-react";
import Image from "next/image";
import AboutMeSection from "@/components/AboutMeSection";

export default function TeachersPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* 1. HERO */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest mb-6">
          <Users size={12} /> For Private Studio Owners
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          The Modern Music Studio{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
            in Your Pocket.
          </span>
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Stop texting parents "Did they practice?"
          <span className="block mt-2 font-medium text-foreground">
            Wake up to recordings, not excuses. Listen and reply in seconds.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/studio"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Start Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            View Pricing
          </Link>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          Free for your first 3 students. No credit card required.
        </p>
      </section>

      {/* 2. THE INBOX (Main Value Prop) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-32 items-center bg-white/50 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <Inbox size={12} /> Your Inbox
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            All your students.
            <br />
            <span className="text-zinc-500">One dashboard.</span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Wake Up to Recordings</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Students upload practice sessions overnight. You see them first thing in the morning.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Reply in Seconds</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Leave text notes or record voice feedback. Students see your guidance on their card.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <Check size={18} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Zero Admin</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  We handle the hosting, the tech, and the website. You just teach.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BROWSER WINDOW MOCKUP */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden relative group transform transition-transform hover:scale-[1.02]">
          {/* Browser Toolbar */}
          <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 ml-4">
              <div className="w-full max-w-sm mx-auto h-5 rounded-full bg-zinc-200/50 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Image Area */}
          <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-black/20">
            <Image
              src="/aaw2.png"
              alt="Dashboard Light"
              fill
              className="object-cover object-top dark:hidden"
            />
            <Image
              src="/aad2.png"
              alt="Dashboard Dark"
              fill
              className="object-cover object-top hidden dark:block"
            />
          </div>
        </div>
      </div>

      {/* 3. FEATURE GRID (New Features) */}
      <section className="max-w-5xl mx-auto mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Everything you need to run a modern studio.
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Simple, private, and shareable. No social media risks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Digital Recital */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-800/30">
            <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
              <Calendar size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Digital Recitals</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Create a shareable concert program in one click. Perfect for end-of-year showcases or keeping students engaged over summer break.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 text-xs font-bold">
              <Sparkles size={12} /> Coming Soon
            </div>
          </div>

          {/* Privacy */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30">
            <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Private & Safe</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No social media risks. All profiles are password-protected with 4-digit access codes. Safe, private links for families only.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold">
              <Check size={12} /> Built-in
            </div>
          </div>

          {/* Student Cards */}
          <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Student Cards</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Each student gets their own beautiful profile page. They record, you review, families listen. Simple.
            </p>
          </div>

          {/* Feedback */}
          <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Inbox size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Voice & Text Feedback</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Leave notes and assignments directly on student cards. Or record a voice memo—they'll hear your guidance at home.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-20 px-6 rounded-[3rem] mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Unlimited students. One simple price.
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            <span className="font-bold border-b-2 border-white/30 dark:border-black/30">$29/month</span> for the full Studio Plan.
            <br />
            That's less than the price of one lesson.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mt-12 mb-12 max-w-2xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10">
              <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Free Forever</div>
              <div className="text-4xl font-black mb-4">$0</div>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center gap-2"><Check size={14} /> 3 Students</li>
                <li className="flex items-center gap-2"><Check size={14} /> Student Cards</li>
                <li className="flex items-center gap-2"><Check size={14} /> Basic Inbox</li>
              </ul>
            </div>

            {/* Studio Plan */}
            <div className="p-6 rounded-2xl bg-white dark:bg-black text-black dark:text-white border-2 border-white dark:border-black relative">
              <div className="absolute -top-3 left-4 px-3 py-1 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                Popular
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Studio Plan</div>
              <div className="text-4xl font-black mb-4">$29<span className="text-lg font-medium text-zinc-400">/mo</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> <strong>Unlimited</strong> Students</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Full Inbox + Voice Notes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Digital Recitals</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Priority Support</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              Start Free Today <ArrowRight size={16} />
            </Link>
          </div>

          <p className="text-sm opacity-60">
            No credit card required. Upgrade anytime when you're ready.
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <AboutMeSection />

    </main>
  );
}
