"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowDown } from 'lucide-react';

export default function Home() {
  // --- YouTube Logic (Preserved) ---
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);
  const [open, setOpen] = useState(false);


  const handleUnmute = () => {
    if (playerRef.current && playerRef.current.unMute) {
      playerRef.current.unMute();
      setMuted(false);
    }
  };

  useEffect(() => {
    const initYT = () => {
      if (!iframeRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (e: any) => {
            e.target.mute();
            // e.target.playVideo(); // Uncomment if you want auto-play
          }
        }
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initYT;
    } else {
      initYT();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className="relative flex flex-col items-center overflow-x-hidden">

      {/* 1. Title Section */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-6 z-10">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400">
            Welcome to
          </h2>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
            Wilkins Studio
          </h1>
          <p className="text-xl md:text-2xl text-zinc-700 dark:text-zinc-300 font-light max-w-2xl mx-auto leading-relaxed">
            Walk in, walk out. Total production to your own personal brand.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-6">
          <Link
            href="/pricing#book"
            className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Start Recording <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 animate-bounce opacity-50">
          <ArrowDown size={24} />
        </div>
      </section>

      {/* Combined Problem + Deliverable Section */}
      <section className="w-full bg-zinc-50/50 dark:bg-white/5 border-y border-zinc-200 dark:border-white/5 backdrop-blur-sm py-12 mt-30 mb-18 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-16">

          {/* Problem */}
          <div className="space-y-4">
            <h3 className="text-4xl font-bold tracking-tight text-foreground">
              <span className="text-red-500/80 dark:text-red-400">Music production</span> is expensive.
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Booking a commercial studio costs hundreds of dollars an hour. Buying your own microphones and interface takes time to learn and money to burn.
              <br /><br />
              Most musicians just want to capture their sound without the headache.
            </p>
          </div>

          {/* Deliverable */}
          <div className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">
              The Deliverable
            </h2>
            <h3 className="text-4xl font-bold tracking-tight text-foreground">
              We made it <span className="text-red-500/80 dark:text-red-400">way better</span>.
            </h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Booking a commercial studio costs hundreds of dollars an hour. Buying your own microphones and interface takes time to learn and money to burn.
              <br /><br />
              Most musicians just want to capture their sound without the headache.
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              More than just an audio file. You get a permanent digital stage.
            </p>
          </div>

        </div>
      </section>


      {/* 2.5 The Product Visuals (Grid of 3) */}
      <section className="w-full max-w-7xl px-6 mb-18 flex flex-col items-center">


        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">

          {/* Card 1 */}
          <div className="relative w-full aspect-[4/5] rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-700 group">
            <div className="h-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-6 flex flex-col items-center pt-8 space-y-3">
              <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="w-full mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background">
                  <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent ml-0.5" />
                </div>
                <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="hidden md:block relative w-full aspect-[4/5] rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-700 group delay-75">
            <div className="h-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-6 flex flex-col items-center pt-8 space-y-3">
              <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="w-full mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background">
                  <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent ml-0.5" />
                </div>
                <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="hidden md:block relative w-full aspect-[4/5] rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-700 group delay-150">
            <div className="h-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>
            </div>
            <div className="p-6 flex flex-col items-center pt-8 space-y-3">
              <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
              <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              <div className="w-full mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background">
                  <div className="w-0 h-0 border-l-[6px] border-l-current border-y-[4px] border-y-transparent ml-0.5" />
                </div>
                <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-foreground/20" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Pricing Module (Teaser) */}
      <section className="w-full bg-zinc-50/50 dark:bg-white/5 border-y border-zinc-200 dark:border-white/5 backdrop-blur-sm py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">
            Simple Pricing
          </h2>
          <h3 className="text-5xl font-black text-foreground">
            $40 <span className="text-xl font-medium text-zinc-500">/ session</span>
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto">
            You walk in, play, and walk out. Price includes the studio time, mixing, mastering, and your own custom artist page. Check out{" "}
            <Link
              href="/studio"
              className="font-semibold text-red-500 dark:text-red-400 hover:text-red-500/80 dark:hover:text-red-300 transition-colors"
            >
              The Studio
            </Link>{" "}
            for more information about how it works.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest text-foreground"
          >
            View Full Details
          </Link>
        </div>
      </section>



      {/* 3. Video Section (YouTube Logic) */}
      <section className="w-full max-w-5xl pt-16 px-6 mb-12">


        <div className="relative aspect-video rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-black">
          {muted && (
            <button
              onClick={handleUnmute}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors backdrop-blur-[2px]"
            >
              <span className="px-6 py-3 rounded-full border border-white/30 bg-black/60 text-white text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                Watch the Process
              </span>
            </button>
          )}
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            // REPLACE THIS ID with your actual explanation video ID when ready
            src="https://www.youtube.com/embed/yXWoKi5x3lw?autoplay=0&mute=1&enablejsapi=1&playsinline=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
      </section>


      {/* 5. Philosophy Section (Collapsed "About") */}
      <section className="w-full max-w-5xl px-6 py-12">
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/5 backdrop-blur-sm text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/60 dark:hover:bg-white/10 transition"
          >
            About {open ? "−" : "+"}
          </button>
        </div>

        {open && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* LEFT: Picture */}
            <div className="relative w-full md:w-auto">
              <Image
                src="/profile.png"
                alt="Isaac Wilkins"
                width={400}     // <-- set a natural width
                height={600}    // <-- set a natural height
                className="rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl"
                priority
              />
            </div>

            {/* RIGHT: Text */}
            <div className="text-right flex flex-col items-end">
              <div className="max-w-xl space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">
                  Our Belief
                </h2>
                <blockquote className="text-3xl md:text-5xl font-medium leading-tight tracking-tighter text-foreground">
                  Music as Art
                </blockquote>
                <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  To me, music is a sacred language—a way to revisit the moments in our history when words are not enough.
                  I created this studio to give everyone a chance to capture that language.
                </p>
                <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  My hope is that these recordings serve as an echo, keeping the spirit of your music alive
                  long after the final note is played.
                </p>

                {/* Plug for Wilkins Piano (External Link) */}
                <div className="pt-2">
                  <a
                    href="https://isaacwilkins.com/music"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5"
                  >
                    Listen to my work Here
                  </a>
                </div>
              </div>

              <div className="relative mt-10 w-56 h-20 opacity-80">
                <Image src="/signature.png" alt="Signature" fill priority className="object-contain dark:hidden" />
                <Image src="/signaturew1.png" alt="Signature" fill priority className="object-contain hidden dark:block" />
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}