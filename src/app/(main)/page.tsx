"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Play, Share2,
  Mic2, Home as HomeIcon, Video, UserCheck, Square, Flame, Check, Music, CloudLightning
} from 'lucide-react';

// --- MOCK DATA (Students with Multiple Tracks) ---
const MOCK_STUDENTS = [
  {
    name: "Leo P.",
    handle: "leo-piano",
    color: "#f59e0b", // Amber
    avatar: "🎹",
    imageColor: "bg-amber-100",
    tracks: [
      { title: "Minuet in G", date: "Today" },
      { title: "G Major Scales", date: "Yesterday" }
    ]
  },
  {
    name: "Maya S.",
    handle: "maya-sings",
    color: "#8b5cf6", // Violet
    avatar: "🎤",
    premium: true,
    imageColor: "bg-violet-100",
    tracks: [
      { title: "Recital Piece", date: "2h ago" },
      { title: "Vocal Warmups", date: "1d ago" },
      { title: "Sight Reading", date: "3d ago" }
    ]
  },
  {
    name: "Sammy J.",
    handle: "sam-drums",
    color: "#3b82f6", // Blue
    avatar: "🥁",
    imageColor: "bg-blue-100",
    tracks: [
      { title: "Weekly Rhythms", date: "Today" }
    ]
  }
];

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Home() {
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



  function SlugNavigator() {
    const [slug, setSlug] = useState('');

    const handleGo = (e: React.FormEvent) => {
      e.preventDefault();
      if (!slug) return;

      // .trim() removes accidental spaces, .toLowerCase() handles the casing
      const cleanSlug = slug.trim().toLowerCase();

      window.location.href = `https://studiocard.live/${cleanSlug}`;
    };

    return (
      <div className="w-full max-w-md mx-auto text-center space-y-8 py-12">
        <div className="space-y-2">

          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Already have an account? Jump straight to your card.
          </p>
        </div>

        <form onSubmit={handleGo} className="relative group">
          <div className="relative flex items-center">
            {/* The Input */}
            <input
              type="text"
              value={slug}
              // Force the state to stay lowercase
              onChange={(e) => setSlug(e.target.value.toLowerCase())}
              placeholder="enter your slug"
              // The 'lowercase' class visually forces the text to look lowercase even if caps-lock is on
              className="w-full lowercase bg-zinc-100/50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl py-4 pl-5 pr-24 font-bold text-sm text-foreground placeholder:normal-case placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
            />

            {/* The Button (Absolute positioned inside the input) */}
            <button
              type="submit"
              disabled={!slug}
              className="absolute right-2 top-2 bottom-2 bg-foreground text-background hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all flex items-center gap-2"
            >
              Go <ArrowRight size={12} />
            </button>
          </div>

          {/* Helper Text */}
          <div className="mt-4 flex justify-center gap-2 text-xs font-medium text-zinc-400">
            <span>try:</span>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-foreground font-mono">
              studiocard.live/{slug || 'your-slug'}
            </span>
          </div>
        </form>
      </div>
    );
  }

  //useEffect(() => {
  //const initYT = () => {
  //if (!iframeRef.current || !window.YT) return;
  //playerRef.current = new window.YT.Player(iframeRef.current, {
  //events: {
  //onReady: (e: any) => {
  //e.target.mute();
  //}
  //}
  //});
  //};


  //if (!window.YT) {
  //    const tag = document.createElement('script');
  //      tag.src = "https://www.youtube.com/iframe_api";
  //    const firstScriptTag = document.getElementsByTagName('script')[0];
  //  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  //window.onYouTubeIframeAPIReady = initYT;
  //  } else {
  //  initYT();
  // }

  //   return () => {
  //   if (playerRef.current && playerRef.current.destroy) {
  //   playerRef.current.destroy();
  //      }
  //   };
  // }, []);




  return (
    <main className="relative flex flex-col items-center overflow-x-hidden pt-26 pb-20">

      {/* SHIMMER ANIMATION STYLE (Global for this page) */}
      <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-12deg); }
            100% { transform: translateX(150%) skewX(-12deg); }
          }
          .animate-shimmer {
            animation: shimmer 3s infinite linear;
          }
      `}</style>

      {/* 1. NARRATIVE HERO */}
      <section className="relative w-full max-w-5xl px-6 mb-32 flex flex-col items-center text-center z-10 mx-auto">
        {/* Header always first */}
        <h2 className="order-1 text-xs font-bold uppercase tracking-[0.4em] text-zinc-500 dark:text-zinc-400 mb-6">
          Make Your Practice Official
        </h2>

        {/* Title always second */}
        <h1 className="order-2 text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
          Turn your{" "}
          <span className="text-red-500/80 dark:text-red-400">practice</span>{" "}
          room into a{" "}
          <span className="text-foreground md:text-red-500/80 dark:md:text-red-400">stage</span>.
          <br />
        </h1>

        {/* PARAGRAPH: Hidden on mobile, shown on medium screens and up */}
        <p className="hidden md:block order-3 text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed mb-10">
          Bridge the gap between lessons. Send your recordings to your teacher, get feedback, and share your wins with the people who care.
        </p>

        {/* SLUG NAVIGATOR: Order 3 on mobile (takes the paragraph's spot), Order 5 on desktop */}
        <div className="order-3 md:order-5 w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <SlugNavigator />
        </div>

        {/* BUTTONS: Order 4 on both */}
        <div className="order-4 flex flex-wrap justify-center gap-4 mt-8 md:mt-0 mb-8 md:mb-16">
          <Link href="/students" className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Sign Up <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/teachers" className="group flex items-center gap-3 px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
            For Teachers
          </Link>
        </div>
      </section>



      {/* 2. THE JOURNEY (Visual Timeline) */}
      <div className="w-full max-w-5xl px-6 md:px-12 py-16 md:py-8 rounded-[3rem] border-y border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-white/5 backdrop-blur-sm shadow-2xl relative mb-24">

        {/* The Vertical Guide Line */}
        <div className="absolute left-10 md:left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-zinc-400 dark:via-zinc-600 to-transparent md:-translate-x-1/2 opacity-50" />

        {/* STEP 1: PRACTICE (Home/Warm) */}
        <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
          {/* Timeline Dot */}
          <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-foreground rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

          {/* Text Content */}
          <div className="pl-16 md:pl-0 md:text-right md:pr-12">
            <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
              <span className="md:hidden">01.</span> Step 01
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">You Practice It.</h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              You know what to do. Master your scales, polish that sonata, and get ready to show what you can do, all guided by
              your teacher: both at your lesson, and at home through studio.card.
            </p>
            <div className="flex md:justify-end gap-4">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-black text-foreground">25</div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Mins Today</div>
              </div>
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 self-center" />
              <div className="flex flex-col items-center">
                <div className="text-2xl font-black text-orange-500">12</div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold tracking-tighter">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Desktop Visual: The Practice Card */}
          <div className="pl-16 md:pl-8">
            <div className="h-[380px] w-full max-w-[320px] transform group-hover:rotate-1 transition-transform duration-500">
              <PracticeCardComponent
                artist={{
                  name: "Alex Rivers",
                  handle: "arivers",
                  color: "#f59e0b", // Amber/Orange
                  imageColor: "bg-orange-500",
                  avatar: "🎹"
                }}
              />
            </div>
          </div>
        </div>

        {/* STEP 2: CAPTURE (Studio/Cool) */}
        <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
          {/* Timeline Dot */}
          <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-zinc-400 rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

          {/* Desktop Visual: The Recording Card */}
          <div className="pl-16 md:pl-0 md:text-right md:pr-12 hidden md:block">
            <div className="h-[380px] w-full max-w-[320px] ml-auto transform group-hover:-rotate-1 transition-transform duration-500">
              <RecordingCardComponent
                artist={{
                  name: "Alex Rivers",
                  handle: "arivers",
                  color: "#f59e0b", // Indigo
                  imageColor: "bg-orange-500",
                  avatar: "🎙️"
                }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="pl-16 md:pl-8">
            <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
              <span className="md:hidden">02.</span> Step 02
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-4">You Capture It.</h3>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Record your practice session right when you feel ready. Retry as many times as you want. No pressure, no scheduling—just you and your instrument.
            </p>
            <div className="space-y-3">
              <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <UserCheck size={16} /> Sends directly to your Teacher
              </p>
              <p className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                <Mic2 size={16} /> Studio-grade audio processing
              </p>
            </div>
          </div>

          {/* Mobile Visual: The Recording Card (Smaller) */}
          <div className="pl-16 md:hidden">
            <div className="h-[320px] w-full">
              <RecordingCardComponent
                artist={{
                  name: "Alex Rivers",
                  handle: "arivers",
                  color: "#6366f1",
                  imageColor: "bg-indigo-500",
                  avatar: "🎙️"
                }}
              />
            </div>
          </div>
        </div>

        {/* STEP 3: THE CARD (Card Stack Visual) */}
        <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 pb-8 group">
          <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-foreground border-2 border-foreground rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-125" />

          {/* Left Side: Content */}
          <div className="pl-16 md:pl-0 md:text-right md:pr-12">
            <div className="inline-flex items-center gap-2 mb-3 text-foreground font-mono text-xs uppercase tracking-widest font-bold">
              <span className="md:hidden">03.</span> Step 03
            </div>
            <h3 className="text-3xl font-black text-foreground mb-4">You go live instantly.</h3>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
              Your recording instantly publishes to your personal <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">studio.card</span>.
            </p>
            <p className="text-sm text-zinc-500 mb-2">
              Share your link with family and friends to show off your hard work. And if you don't love it, keep it private and to yourself. Your teacher gets everything automatically.
            </p>
          </div>

          {/* Right Side: THE CARDS STACK */}
          <div className="pl-16 md:pl-8 relative h-[500px] flex items-center justify-center">

            {/* 1. LEO (Left/Back) */}
            <div className="absolute left-0 md:-left-8 top-20 w-64 md:w-72 aspect-[4/5] -rotate-6 scale-90 z-10 opacity-90 transition-transform hover:-translate-y-4 hover:z-30">
              <CardComponent artist={MOCK_STUDENTS[0]} />
            </div>

            {/* 2. SAMMY (Right/Back) */}
            <div className="absolute right-0 md:-right-8 top-20 w-64 md:w-72 aspect-[4/5] rotate-6 scale-90 z-10 opacity-90 transition-transform hover:-translate-y-4 hover:z-30">
              <CardComponent artist={MOCK_STUDENTS[2]} />
            </div>

            {/* 3. MAYA (Center/Front) */}
            <div className="absolute top-0 w-64 md:w-72 aspect-[4/5] z-20 shadow-2xl transition-transform hover:-translate-y-2 hover:scale-[1.02]">
              <CardComponent artist={MOCK_STUDENTS[1]} />
            </div>

          </div>
        </div>
      </div>






      {/* 3. STEP 3: THE STAGE (Bleeding Out Wider) */}
      {/* This section breaks out of the previous container to feel huge */}
      <section className="w-full max-w-[90rem] px-6 mb-12 flex flex-col items-center">

        {/* Centered Header */}
        <div className="text-center mb-16 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Boom.
          </div>
          <h3 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">
            We Build Your Stage.
          </h3>
          <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light">
            Your recording instantly publishes to your personal <strong>Studio Card</strong>. Share it with family and friends via studiocard.live/<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">you</span>
          </p>
        </div>

        {/* MASSIVE CENTERED BROWSERS */}
        <div className="relative w-full h-[300px] md:h-[600px] flex items-center justify-center group perspective-[2000px]">

          {/* 1. Back Window (Context) - Tilted Left */}
          <div className="absolute w-[85%] md:w-[65%] aspect-video rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden opacity-60 scale-95 origin-center transition-all duration-700 -rotate-3 -translate-x-8 md:-translate-x-16 group-hover:-translate-x-24 group-hover:-rotate-6 group-hover:scale-90">
            <div className="h-6 md:h-10 border-b border-zinc-100/50 dark:border-white/5 flex items-center px-4 gap-2 bg-zinc-50/50 dark:bg-zinc-800/50">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-400/50" />
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-400/50" />
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-400/50" />
            </div>
            <div className="relative w-full h-full bg-zinc-100 dark:bg-zinc-800">
              {/* LIGHT MODE IMAGE */}
              <Image
                src="/webcard1d.png"
                alt="Website Preview Back"
                fill
                className="object-cover object-top opacity-80 dark:hidden"
              />
              {/* DARK MODE IMAGE - Update filename if needed */}
              <Image
                src="/webcard1.png"
                alt="Website Preview Back Dark"
                fill
                className="object-cover object-top opacity-80 hidden dark:block"
              />
            </div>
          </div>

          {/* 2. Front Window (Hero) - Tilted Right */}
          <div className="absolute w-[90%] md:w-[70%] aspect-video rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-[0_0_50px_rgba(0,0,0,0.1)] overflow-hidden z-20 transition-all duration-700 rotate-2 translate-x-4 md:translate-x-8 group-hover:translate-x-12 group-hover:rotate-3 group-hover:scale-[1.02]">
            <div className="h-8 md:h-12 border-b border-zinc-100/50 dark:border-white/5 flex items-center px-4 gap-2 bg-zinc-50/80 dark:bg-zinc-900/80 backdrop-blur-sm">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-400" />
              <div className="ml-4 px-3 py-1 rounded-md bg-zinc-100 dark:bg-white/10 flex-1 max-w-xs flex items-center">
                <div className="h-1.5 md:h-2 w-24 bg-zinc-300 dark:bg-white/20 rounded-full" />
              </div>
            </div>
            <div className="relative w-full h-full bg-white dark:bg-black">
              {/* LIGHT MODE IMAGE */}
              <Image
                src="/webcard1.png"
                alt="Website Preview Front"
                fill
                className="object-cover object-top dark:hidden"
              />
              {/* DARK MODE IMAGE - Update filename if needed */}
              <Image
                src="/webcard1d.png"
                alt="Website Preview Front Dark"
                fill
                className="object-cover object-top hidden dark:block"
              />
              {/* ✨✨ NEW: PREMIUM SHIMMER OVERLAY ✨✨ */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </div>

              {/* Optional: Subtle static gloss reflection for extra glass feel */}
              <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-50" />
            </div>
          </div>

        </div>


      </section>

      <section className="relative w-full max-w-5xl px-6 mb-32 flex flex-col items-center text-center z-10">

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/students" className="group flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            I'm a Student <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/teachers" className="group flex items-center gap-3 px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10 transition-all">
            For Teachers
          </Link>
        </div>
      </section>



      {/* 
  <section className="w-full max-w-5xl pt-12 px-6 mb-12 text-center">
    <div className="mb-10 space-y-3">
      <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">
        Demo
      </h2>
      <h3 className="text-4xl md:text-5xl font-black tracking-tighter flex items-center justify-center gap-3">
        See it in Action 
      </h3>
    </div>

    <div className="relative aspect-video rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-black">
      {muted && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors backdrop-blur-[2px]"
        >
          <span className="px-6 py-3 rounded-full border border-white/30 bg-black/60 text-white text-xs uppercase tracking-widest hover:scale-105 transition-transform">
            Start Demo Video
          </span>
        </button>
      )}
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        src="https://www.youtube.com/embed/yXWoKi5x3lw?autoplay=0&mute=1&enablejsapi=1&playsinline=1"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
    </div>
  </section>

  */}

      {/* 5. PHILOSOPHY SECTION */}
      <section className="w-full max-w-5xl px-6 py-12">
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(!open)}
            className="px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/5 backdrop-blur-sm text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/60 dark:hover:bg-white/10 transition"
          >
            About Me {open ? "−" : "+"}
          </button>
        </div>

        {open && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative w-full md:w-auto">
              <Image src="/profile.png" alt="Isaac Wilkins" width={400} height={600} className="rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl" priority />
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="max-w-xl space-y-6">
                <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">Our Belief</h2>
                <blockquote className="text-3xl md:text-5xl font-medium leading-tight tracking-tighter text-foreground">Music is a Journey</blockquote>
                <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                  As a pianist and student myself, I know that 99% of music happens in the practice room.
                  I built Studio Card so that the effort you put in doesn't disappear into thin air.
                </p>
                <div className="pt-2">
                  <a href="https://isaacwilkins.com/music" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5">
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
    </main >
  );
}

// --- SUB-COMPONENT FOR REUSABILITY IN THE STACK ---
function CardComponent({ artist }: { artist: any }) {
  return (
    <div className="relative w-full h-full rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden bg-white dark:bg-black flex flex-col">
      {/* Dynamic Color Tint */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.15]" style={{ backgroundColor: artist.color }} />
      {/* Shimmer */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Browser Header */}
      <div className="h-8 border-b border-zinc-100/50 dark:border-white/5 flex items-center px-4 relative z-20 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="ml-3 text-[8px] text-zinc-400 font-mono">studio.card/{artist.handle}</div>
      </div>

      {/* Body */}
      <div className="relative w-full flex-1 p-4 flex flex-col items-center">
        {/* Inner Gradient */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: `linear-gradient(to bottom, ${hexToRgba(artist.color, 0.1)}, transparent)` }} />

        {/* Card Content */}
        <div className="relative z-10 w-full h-full backdrop-blur-md rounded-[1.5rem] p-4 shadow-xl flex flex-col items-center text-center border overflow-hidden" style={{ backgroundColor: hexToRgba(artist.color, 0.4), borderColor: hexToRgba(artist.color, 0.2) }}>

          <div className={`w-16 h-16 rounded-full ${artist.imageColor} mb-2 relative overflow-hidden shadow-2xl border-4 border-white/10 flex items-center justify-center shrink-0`}>
            <span className="text-3xl">{artist.avatar || "🎵"}</span>
          </div>

          <div className="text-[9px] font-medium text-foreground/70 mb-2 leading-tight px-2 shrink-0">"Consistent practice makes permanent."</div>

          <div className="w-full py-1.5 mb-2 rounded-lg bg-foreground text-background text-[8px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-md opacity-90 shrink-0">
            <Share2 size={8} /> Share
          </div>

          <div className="font-black text-lg text-foreground tracking-tight mb-2 shrink-0">{artist.name}</div>

          <div className="w-full flex flex-col gap-2 overflow-y-auto no-scrollbar flex-1 min-h-0">
            {artist.tracks?.map((track: any, t: number) => (
              <div key={t} className="w-full bg-white/40 dark:bg-black/20 rounded-lg p-1.5 flex items-center gap-2 border border-white/10 shadow-sm shrink-0">
                <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center shadow-md shrink-0">
                  <Play size={8} fill="currentColor" className="ml-0.5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-bold text-[10px] truncate text-foreground">{track.title}</div>
                  <div className="text-[8px] text-foreground/60 truncate">{track.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function RecordingCardComponent({ artist }: { artist: any }) {
  return (
    <div className="relative w-full h-full rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden bg-white dark:bg-black flex flex-col">
      {/* Dynamic Color Tint */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.15]" style={{ backgroundColor: artist.color }} />

      {/* Shimmer */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent animate-shimmer" />
      </div>

      {/* Browser Header */}
      <div className="h-8 border-b border-zinc-100/50 dark:border-white/5 flex items-center justify-between px-4 relative z-20 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <div className="text-[8px] text-zinc-400 font-mono tracking-tighter uppercase font-bold">Live Session</div>
        </div>
      </div>

      {/* Body */}
      <div className="relative w-full flex-1 p-4 flex flex-col items-center">
        {/* Inner Gradient */}
        <div className="absolute inset-0 z-0 opacity-20" style={{ background: `linear-gradient(to bottom, ${hexToRgba(artist.color, 0.1)}, transparent)` }} />

        {/* Card Content */}
        <div className="relative z-10 w-full h-full backdrop-blur-md rounded-[1.5rem] p-4 shadow-xl flex flex-col items-center text-center border overflow-hidden" style={{ backgroundColor: hexToRgba(artist.color, 0.4), borderColor: hexToRgba(artist.color, 0.2) }}>

          {/* Pulsing Avatar */}
          <div className="relative mb-3 shrink-0">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
            <div className={`w-16 h-16 rounded-full ${artist.imageColor} relative overflow-hidden shadow-2xl border-4 border-white/20 flex items-center justify-center`}>
              <span className="text-3xl">{artist.avatar || "🎙️"}</span>
            </div>
          </div>

          <div className="font-black text-lg text-foreground tracking-tight leading-tight shrink-0">
            {artist.name}
          </div>
          <div className="text-[9px] font-bold text-red-500 dark:text-red-400 uppercase tracking-[0.2em] mb-4 shrink-0 animate-pulse">
            Recording...
          </div>

          {/* Waveform Visualizer */}
          <div className="w-full flex-1 flex items-center justify-center gap-1 px-4 mb-4">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6, 0.2].map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-foreground/80 rounded-full animate-waveform"
                style={{
                  height: `${height * 100}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="w-full flex flex-col gap-2 shrink-0">
            <div className="text-[10px] font-mono text-foreground/60 tabular-nums">02:45 / 04:00</div>
            <div className="w-full py-2 rounded-lg bg-red-500 text-white text-[8px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-transform">
              <Square size={8} fill="currentColor" /> Stop Recording
            </div>
          </div>
        </div>
      </div>

      {/* CSS for the Waveform Animation */}
      <style>{`
        @keyframes waveform {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1.2); }
        }
        .animate-waveform {
          animation: waveform 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}


function PracticeCardComponent({ artist }: { artist: any }) {
  // You can pass these in via the 'artist' prop, or hardcode them here
  const lightImage = artist.lightImage || "/path/to/your-light-image.png";
  const darkImage = artist.darkImage || "/path/to/your-dark-image.png";

  return (
    <div className="relative w-full h-full rounded-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-hidden bg-white dark:bg-black flex flex-col text-left">
      {/* Dynamic Color Tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.15]"
        style={{ backgroundColor: artist.color }}
      />

      {/* Browser Header (Traffic Lights) */}
      <div className="h-8 border-b border-zinc-100/50 dark:border-white/5 flex items-center px-4 relative z-20 shrink-0 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="ml-3 text-[8px] text-zinc-400 font-mono italic">
          studio.card/{artist.id || "alexrivers"}
        </div>
      </div>

      {/* Body - Image Container */}
      <div className="relative w-full flex-1 bg-zinc-50 dark:bg-zinc-900 overflow-hidden group">
        {/* Light Mode Image */}
        <img
          src="IMG_1996 3.jpg"
          alt="Practice Session Light"
          className="w-full h-full object-cover block dark:hidden"
        />

        {/* Dark Mode Image */}
        <img
          src={"IMG_1997 3.jpg"}
          alt="Practice Session Dark"
          className="w-full h-full object-cover hidden dark:block"
        />
      </div>
    </div>
  );
}