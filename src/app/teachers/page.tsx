"use client";

import Link from "next/link";
import { CheckCircle2, Users, BarChart3, ShieldCheck, ArrowRight } from "lucide-react";

export default function TeachersPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      
      {/* 1. HERO: Professional & Clear */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400 mb-6">
          For Studio Owners
        </h2>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          The Modern Way to <br /> Track Progress.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Stop wondering if your students practiced. Studio Card gives you a centralized dashboard to hear their work, offer feedback, and keep them motivated between lessons.
        </p>
      </section>

      {/* 2. THE PROCESS (Grid) */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 mb-32">
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-lg">1</div>
            <div>
              <h3 className="text-xl font-bold mb-2">They Record</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">Students upload practice sessions from home using our simple interface.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-lg">2</div>
            <div>
              <h3 className="text-xl font-bold mb-2">You Listen</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">You get notified on your Teacher Dashboard. Listen to their audio instantly.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 font-bold text-lg">3</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Zero Admin</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">We handle the hosting, the website building, and the tech support. You just teach.</p>
            </div>
          </div>
        </div>

        {/* MOCK DASHBOARD VISUAL */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-black/50 p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-200 dark:border-white/10 pb-4">
              <span className="font-bold text-sm uppercase tracking-wider">Your Students</span>
              <Users size={16} className="text-zinc-400" />
            </div>
            {/* Mock List Items */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-white/5 border border-zinc-100 dark:border-white/5">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="flex-1">
                  <div className="h-2 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-1" />
                  <div className="h-2 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                </div>
                <div className="text-[10px] font-bold text-green-500">New Upload</div>
              </div>
            ))}
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
            Starting at just <span className="font-bold border-b-2 border-white/30 dark:border-black/30">$10/month</span>. 
            <br/>That's less than the price of a single lesson book.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left mt-12 mb-12">
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <BarChart3 className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Track Consistency</h4>
              <p className="text-sm opacity-70">See exactly when and how often your students are practicing.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <ShieldCheck className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Private & Safe</h4>
              <p className="text-sm opacity-70">Student profiles can be password protected for safety.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm">
              <CheckCircle2 className="mb-4 opacity-70" />
              <h4 className="font-bold mb-2">Easy Setup</h4>
              <p className="text-sm opacity-70">Send one link to your roster and you're done.</p>
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