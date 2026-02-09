"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Heart, Share2, Users, Smartphone, Music, Pause } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative flex flex-col items-center overflow-x-hidden pt-24 pb-20">

      {/* SHIMMER ANIMATION */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative w-full max-w-6xl px-6 mb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 z-10 mx-auto">

        {/* Left: Copy */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold text-xs uppercase tracking-widest mb-6">
            <Heart size={12} /> Your Digital Studio
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-6 leading-[0.95]">
            Turn Practice into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Performance.
            </span>
          </h1>

          <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            Practice happens in the dark. Nobody hears the progress until the recital.
            <span className="block mt-2 font-medium text-foreground">
              Record your wins. Share a private link. Get high-fives from family.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/students"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Have a Teacher Code? <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/teachers"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
            >
              I'm a Teacher
            </Link>
          </div>

          <p className="text-sm text-zinc-500 mt-6">
            Don't have a code?{" "}
            <Link href="/teachers" className="font-bold text-foreground hover:text-red-500 transition-colors underline underline-offset-2">
              Tell your music teacher to sign up for free.
            </Link>
          </p>
        </div>

        {/* Right: Interactive Demo Card */}
        <div className="flex-shrink-0 w-full max-w-sm lg:max-w-md">
          <InteractiveDemoCard />
        </div>
      </section>

      {/* 2. THE "REFRIGERATOR DOOR" CONCEPT */}
      <section className="w-full max-w-5xl px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-4">
            Like a refrigerator door for music.
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Remember hanging up that A+ drawing? Your Studio Card is where you post your musical wins for the whole family to hear.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <Music size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Record Your Wins</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Nailed that tricky passage? Record it. Your best work deserves to be heard, not forgotten.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <Share2 size={24} className="text-orange-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Share with Family</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Send Grandma a link. She can listen from Florida while you practice in Draper.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4">
              <Heart size={24} className="text-pink-500" />
            </div>
            <h3 className="font-bold text-lg mb-2">Get the High-Fives</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Watch the encouragement roll in. Nothing motivates like knowing people are listening.
            </p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Simple) */}
      <section className="w-full max-w-5xl px-6 mb-24">
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-12">
            Simple as 1-2-3
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-foreground text-background flex items-center justify-center font-black text-2xl">
                1
              </div>
              <h3 className="text-xl font-bold">Practice</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Do what you do best. Your teacher leaves notes on your card to guide you.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-foreground text-background flex items-center justify-center font-black text-2xl">
                2
              </div>
              <h3 className="text-xl font-bold">Record</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                When you're ready, hit record. Retry as many times as you want.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-foreground text-background flex items-center justify-center font-black text-2xl">
                3
              </div>
              <h3 className="text-xl font-bold">Share</h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                Your recording goes live on your personal website. Share it with anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SOCIAL PROOF / EMOTIONAL */}
      <section className="w-full max-w-5xl px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              99% of music happens in the practice room.
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              The recital is just the tip of the iceberg. All those hours of scales, all those breakthrough moments, all that growth—it usually disappears into thin air.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-bold text-foreground">Not anymore.</span> Studio Card captures the journey, not just the destination.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Users size={16} /> <span>Family listens together</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Smartphone size={16} /> <span>Works on any device</span>
              </div>
            </div>
          </div>

          {/* Visual: Grandma concept */}
          <div className="relative">
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200/50 dark:border-orange-800/30 p-8 flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">👵📱</div>
              <p className="text-xl font-bold text-foreground mb-2">"Is that my grandbaby?"</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Grandma in Florida, listening to your Für Elise on her morning coffee break.
              </p>
              <div className="mt-4 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 text-xs font-mono text-zinc-500">
                studiocard.live/eliza
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="w-full max-w-4xl px-6 mb-12">
        <div className="bg-foreground text-background rounded-[2.5rem] p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Ready to show off your hard work?
          </h2>
          <p className="text-lg opacity-80 mb-8 max-w-xl mx-auto">
            Get your teacher code and join your studio in 30 seconds. It's completely free for students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/students"
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-background text-foreground rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all"
            >
              Join Your Studio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/teachers"
              className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-background/30 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-background/10 transition-all"
            >
              I'm a Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Slug Navigator for returning users */}
      <section className="w-full max-w-md px-6">
        <SlugNavigator />
      </section>

    </main>
  );
}

// --- INTERACTIVE DEMO CARD ---
function InteractiveDemoCard() {
  const [playing, setPlaying] = useState<number | null>(null);

  const tracks = [
    { title: "Für Elise - Full Performance", date: "Today", duration: "2:34" },
    { title: "C Major Scale", date: "Yesterday", duration: "0:45" },
    { title: "Happy Birthday (for Grandma!)", date: "Last week", duration: "1:12" },
  ];

  const handlePlay = (index: number) => {
    setPlaying(playing === index ? null : index);
  };

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-pink-500/20 rounded-[3rem] blur-2xl opacity-60" />

      {/* Card */}
      <div className="relative rounded-[2rem] border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden bg-white dark:bg-zinc-900">
        {/* Shimmer */}
        <div className="absolute inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
        </div>

        {/* Browser Header */}
        <div className="h-10 border-b border-zinc-100 dark:border-white/5 flex items-center px-4 bg-zinc-50 dark:bg-zinc-800/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="ml-4 text-xs text-zinc-400 font-mono">
            studiocard.live/lizzy
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-900/10">
          {/* Profile */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-4xl mb-3 shadow-lg">
              EW
            </div>
            <h3 className="font-black text-xl text-foreground">Eliza's Card</h3>
            <p className="text-sm text-zinc-500">Piano Student • Ms. Johnson's Studio</p>
          </div>

          {/* Share Button */}
          <button className="w-full py-3 mb-4 rounded-xl bg-foreground text-background font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
            <Share2 size={14} /> Share with Family
          </button>

          {/* Tracks */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Recent Recordings</p>
            {tracks.map((track, i) => (
              <button
                key={i}
                onClick={() => handlePlay(i)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                  playing === i
                    ? 'bg-foreground text-background'
                    : 'bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  playing === i
                    ? 'bg-background text-foreground'
                    : 'bg-foreground text-background'
                }`}>
                  {playing === i ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${playing === i ? '' : 'text-foreground'}`}>
                    {track.title}
                  </div>
                  <div className={`text-xs ${playing === i ? 'opacity-70' : 'text-zinc-500'}`}>
                    {track.date} • {track.duration}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Teacher Note */}
          <div className="mt-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">
              From Ms. Johnson
            </p>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              "Great progress on Für Elise! Work on the left hand in measures 12-16 before our lesson."
            </p>
          </div>
        </div>

        {/* Viral Footer */}
        <div className="px-6 py-3 text-center border-t border-zinc-100 dark:border-white/5 bg-zinc-50/50 dark:bg-zinc-800/30">
          <p className="text-[10px] text-zinc-400">
            Powered by{' '}
            <span className="font-bold text-zinc-600 dark:text-zinc-300">Studio.Card</span>
            {' '}— Ask your teacher about it.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- SLUG NAVIGATOR ---
function SlugNavigator() {
  const [slug, setSlug] = useState('');

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) return;
    const cleanSlug = slug.trim().toLowerCase();
    window.location.href = `/${cleanSlug}`;
  };

  return (
    <div className="text-center space-y-4 py-8">
      <p className="text-sm text-zinc-500">
        Already have an account? Jump straight to your card.
      </p>

      <form onSubmit={handleGo} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            placeholder="enter your card"
            className="w-full lowercase bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-24 font-bold text-sm text-foreground placeholder:text-zinc-400 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!slug}
            className="absolute right-2 top-2 bottom-2 bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2"
          >
            Go <ArrowRight size={12} />
          </button>
        </div>

        <div className="mt-3 text-xs text-zinc-400">
          studiocard.live/<span className="font-mono text-foreground">{slug || 'your-card'}</span>
        </div>
      </form>
    </div>
  );
}
