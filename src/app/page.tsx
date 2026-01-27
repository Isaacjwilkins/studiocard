"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const [muted, setMuted] = useState(true);

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
            e.target.playVideo();
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
    <main className="relative flex flex-col items-center">

      {/* 1. Hero Section - pt-20 on mobile (was 32) to bring buttons up, md:pt-16 on desktop */}
      <section className="relative w-full pt-20 md:pt-16">

        {/* Desktop Image - Flush with top */}
        <div className="hidden md:block relative w-full h-[78vh] overflow-hidden mb-8">
          <Image
            src="/hero.png"
            alt="Hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        {/* --- Listen Section --- */}
        {/* mb-40 on mobile for a larger gap to the next section, md:mb-24 for desktop */}
        <div className="flex flex-col items-center gap-6 mb-50 md:mb-24 px-6">
          {/* Mobile-optimized Label */}
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 dark:text-zinc-200 opacity-60md:hidden">
            Listen Now
          </span>


        <div className="flex flex-wrap justify-center gap-4">
          <Link href="#" className="px-8 py-3 bg-[#1DB954] text-white rounded-full font-bold hover:scale-105 transition-all text-xs uppercase tracking-widest">
            Spotify
          </Link>
          <Link href="#" className="px-8 py-3 bg-foreground text-background rounded-full font-bold hover:scale-105 transition-all text-xs uppercase tracking-widest">
            Apple Music
          </Link>
          <Link href="#" className="px-8 py-3 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold hover:bg-white/10 transition-all text-xs uppercase tracking-widest backdrop-blur-sm text-foreground">
            YouTube
          </Link>
        </div>
      </div>
    </section>

      {/* 2. About Section */ }
  <section className="w-full max-w-5xl py-24 px-6">
    <div className="max-w-2xl space-y-6 text-left">
      <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">New Single Coming Soon</h2>
      <h3 className="text-3xl md:text-5xl font-medium leading-tight tracking-tighter text-foreground">
        "Gethsemane"
      </h3>
      <p className="text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
      Let us joyfully celebrate His resurrection, for it was for the joy that was set before Him that He endured the cross. Visit churchofjesuschrist.org/welcome/easter
      </p>
    </div>
  </section>



{/* Featured Section (Youtube) */}
<section className="w-full max-w-5xl py-32 px-6">
  <div className="mb-16">
    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">
      Featured Arrangement
    </h2>

    {/* Title + Link */}
    <div className="flex items-center gap-4 mb-4">
      <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
        "Silent Night"
      </h3>

      <Link
        href="/music"
        className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-foreground hover:bg-foreground hover:text-background transition-all"
      >
        rightarrow
      </Link>
    </div>

    <p className="text-lg text-zinc-800 dark:text-zinc-200 max-w-2xl">
      Let us find Him in the stillness, for it was in the quiet of a humble stable
      that the Prince of Peace arrived to light the world. Visit
      churchofjesuschrist.org/
    </p>
  </div>

  <div className="relative aspect-video rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black">
    {muted && (
      <button
        onClick={handleUnmute}
        className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <span className="px-6 py-3 rounded-full border border-white/30 bg-black/60 text-white text-xs uppercase tracking-widest">
          Tap to unmute
        </span>
      </button>
    )}
    <iframe
      ref={iframeRef}
      className="w-full h-full"
      src="https://www.youtube.com/embed/yXWoKi5x3lw?autoplay=1&mute=1&enablejsapi=1&playsinline=1"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />
  </div>
</section>


  {/* Philosophy Section */}
<section className="w-full max-w-5xl py-48 text-right flex flex-col items-end px-6">
  <div className="max-w-xl space-y-6">
    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">
      My Belief
    </h2>
    <blockquote className="text-3xl md:text-5xl font-medium leading-tight tracking-tighter text-foreground">
      To Never Forget
    </blockquote>

    {/* Paragraph 1 */}
    <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
      To me, music is a sacred language—a way to revisit the moments in our history, 
      and your history, when words are not enough. There have been many times in my life when 
      in wonder He has taught me of infinity. To experience that illumination, and to feel your faculties expand is, in my opinion,
      life's sublimest experience. I craft these piano arrangements 
      to create a quiet space for the heart and soul to feel that again.
    </p>

    {/* Paragraph 2 */}
    <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
      Personally, I often travel back to what I understand as the Garden: to sit in the stillness, and to feel 
      the weight and the wonder of what took place there. To imagine the impossibility made possible. I believe there is 
      great power in remembrance—and greater power in never forgetting. 
      My hope is that these melodies serve as an echo of His love, 
      keeping the spirit of that sacrifice with you long after the final note, and always.
    </p>

  
  </div>


    <div className="relative mt-10 w-56 h-20">
      <Image src="/signature.png" alt="Signature" fill priority className="object-contain dark:hidden" />
      <Image src="/signaturew1.png" alt="Signature" fill priority className="object-contain hidden dark:block" />
    </div>
  </section>


    </main >
  );
}