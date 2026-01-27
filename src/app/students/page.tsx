"use client";

import Link from "next/link";
import { Sparkles, Share2, Palette, Music4, ArrowRight, User } from "lucide-react";

export default function StudentsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      
      {/* 1. HERO: High Energy */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles size={14} /> For Students
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          Show off your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">
            Super Skills.
          </span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
          Practicing is hard work. You deserve to show it off! Create your own Studio Card, upload your songs, and share them with your friends and family.
        </p>
      </section>

      {/* 2. THREE FUN FEATURES */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-32">
        
        {/* Feature 1: Share */}
        <div className="p-8 rounded-3xl bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-100 dark:border-orange-500/20 hover:-translate-y-2 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
            <Share2 size={28} />
          </div>
          <h3 className="text-2xl font-black text-orange-900 dark:text-orange-100 mb-3">Send to Grandma</h3>
          <p className="text-orange-800/70 dark:text-orange-200/70 font-medium">
            No more boring video files. Send a cool link that works on any phone. Your family can listen to your recital piece anywhere!
          </p>
        </div>

        {/* Feature 2: Customize */}
        <div className="p-8 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border-2 border-purple-100 dark:border-purple-500/20 hover:-translate-y-2 transition-transform md:translate-y-8">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
            <Palette size={28} />
          </div>
          <h3 className="text-2xl font-black text-purple-900 dark:text-purple-100 mb-3">Pick Your Look</h3>
          <p className="text-purple-800/70 dark:text-purple-200/70 font-medium">
            Blue? Pink? Green? You choose the colors. Pick your own avatar icon. Make your card look exactly like YOU.
          </p>
        </div>

        {/* Feature 3: Feel like a Pro */}
        <div className="p-8 rounded-3xl bg-cyan-50 dark:bg-cyan-900/10 border-2 border-cyan-100 dark:border-cyan-500/20 hover:-translate-y-2 transition-transform">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500 text-white flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
            <Music4 size={28} />
          </div>
          <h3 className="text-2xl font-black text-cyan-900 dark:text-cyan-100 mb-3">Be the Star</h3>
          <p className="text-cyan-800/70 dark:text-cyan-200/70 font-medium">
            See your name and your songs on a real website. It feels professional because it IS professional.
          </p>
        </div>

      </div>

      {/* 3. CTA */}
      <section className="max-w-4xl mx-auto text-center px-6 py-16 rounded-[3rem] bg-zinc-900 dark:bg-white text-white dark:text-black relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-500 blur-[100px] opacity-30" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500 blur-[100px] opacity-30" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            Ready to start?
          </h2>
          <p className="text-lg opacity-80 max-w-lg mx-auto">
            It's completely free for students. Grab a parent and set up your profile in 2 minutes.
          </p>
          <Link href="/profile" className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
            Build My Profile <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </main>
  );
}