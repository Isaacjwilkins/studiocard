"use client";

import Link from "next/link";
import { CheckCircle2, Users, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function TeachersPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* 1. HERO: Professional & Clear */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400 mb-6">
          For Teachers
        </h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          The Modern Way to <br /> Track Progress.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Stop wondering if your students practiced. With studio.card you have a centralized dashboard to hear their work, offer feedback, and keep them motivated between lessons.
        </p>
      </section>

      {/* 2. THE PROCESS (Grid) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-32 items-center bg-white/50 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0 font-bold text-lg">1</div>
            <div>
              <h3 className="text-xl font-bold mb-2">They Record</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Students upload practice sessions from home based on the notes you leave them using our simple interface.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0 font-bold text-lg">2</div>
            <div>
              <h3 className="text-xl font-bold mb-2">You Teach</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">You get notified on your Teacher Dashboard. Listen to their audio instantly, and leave feedback just for them.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center shrink-0 font-bold text-lg">3</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Zero Admin</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">We handle the hosting, the website building, and the tech support. You just teach.</p>
            </div>
          </div>
        </div>

        {/* BROWSER WINDOW MOCKUP */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden relative group transform transition-transform hover:scale-[1.02]">

          {/* Browser Toolbar */}
          <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            {/* Window Controls */}
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>

            {/* Address Bar Skeleton */}
            <div className="flex-1 ml-4">
              <div className="w-full max-w-sm mx-auto h-5 rounded-full bg-zinc-200/50 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Image Area */}
          <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-black/20">
            {/* Light Mode Image (Hidden in Dark Mode) */}
            <Image
              src="/aaw2.png"
              alt="Dashboard Light"
              fill
              className="object-cover object-top dark:hidden"
            />

            {/* Dark Mode Image (Hidden in Light Mode) */}
            <Image
              src="/aad2.png"
              alt="Dashboard Dark"
              fill
              className="object-cover object-top hidden dark:block"
            />
          </div>
        </div>
      </div>

      {/* 3. BENEFITS & PRICING TEASER */}
      <section className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-20 px-6 rounded-[3rem]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Manage your entire studio.
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            Starting at just <span className="font-bold border-b-2 border-white/30 dark:border-black/30">$10/month</span> for a limited time.
            <br />That's less than the price of a single lesson book.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left mt-12 mb-12">
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <ShieldCheck className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Private & Safe</h4>
              <p className="text-sm opacity-70">All student profiles are password protected for safety. As the teacher, you decide what to see.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <BarChart3 className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Listen and Give Feedback</h4>
              <p className="text-sm opacity-70">Hear exactly what your students are practicing. Update their card with feedback and assignments anytime.  </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <CheckCircle2 className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Easy Setup</h4>
              <p className="text-sm opacity-70">It's literally set up in 10 seconds. Fill out the form at the beginning of one lesson, and you're live.</p>
            </div>
          </div>

          <Link href="/pricing" className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
            View Teacher Pricing <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </main>
  );
}