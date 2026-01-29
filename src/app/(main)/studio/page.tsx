"use client";

import Link from "next/link";
import { Mic2, Wand2, Globe, ArrowRight, Music2, CheckCircle2, Home, Share2, Archive } from "lucide-react";

export default function StudioPage() {
    return (
        <main className="relative flex flex-col items-center overflow-x-hidden pt-32 pb-20">

            {/* 1. Narrative Header */}
            <section className="w-full max-w-3xl px-6 text-center mb-24 relative z-10">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-red-500/80 dark:text-red-400 mb-8">
                    The Studio.
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    If you have always had something you wanted to record, now is your time.
                    And this is so much more than just a recording. It's like your own personal brand.
                    So, what happens next? Let's get started...
                </p>
            </section>

            {/* TIMELINE CONTAINER (Frosted Glass Wrapper) */}
            <div className="w-full max-w-5xl px-6 md:px-12 py-16 md:py-24 rounded-[3rem]
  border-y border-zinc-200 dark:border-white/5
  bg-zinc-50/50 dark:bg-white/5
  backdrop-blur-sm
  shadow-2xl
  relative mb-24">
                {/* The Vertical Guide Line */}
                <div className="absolute left-10 md:left-1/2 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-zinc-400 dark:via-zinc-600 to-transparent md:-translate-x-1/2 opacity-50" />

                {/* STEP 1: PRACTICE (New) */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
                    {/* Timeline Dot */}
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-foreground rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

                    {/* Left Side: Content */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12">
                        <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <span className="md:hidden">01.</span> Step 01
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">You Perfect It.</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            This part happens at home. You take the time to learn your song, practice the dynamics, and get comfortable with the piece.
                        </p>
                        <p className="mt-4 text-sm text-zinc-500">
                            There is no rush here. When you feel ready to capture it, that's when you book your time.
                        </p>
                    </div>

                    {/* Right Side: Visual */}
                    <div className="pl-16 md:pl-8">
                        <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group-hover:border-foreground/20 transition-colors">
                            <Home size={32} className="text-foreground mb-4" />
                            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Location: Your Home</p>
                            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/5 opacity-50 select-none">01</div>
                        </div>
                    </div>
                </div>

                {/* STEP 2: THE SESSION */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-zinc-400 rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

                    {/* Left Side: Visual (Swapped) */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12 hidden md:block">
                        <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group-hover:border-foreground/20 transition-colors">
                            <div className="flex justify-end mb-4"><Mic2 size={32} className="text-foreground" /></div>
                            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Location: WilkinStudio</p>
                            <div className="absolute -left-4 -bottom-4 text-9xl font-black text-foreground/5 opacity-50 select-none">02</div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="pl-16 md:pl-8">
                        <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <span className="md:hidden">02.</span> Step 02
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">You Walk In.</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            No setup. No sound check headaches. You arrive at the studio in Provo, sit down at a perfectly tuned Yamaha piano, and just play.
                        </p>
                        <p className="mt-4 text-sm text-zinc-500">
                            Bring your sheet music, bring a friend, or just bring yourself. You have 30 minutes to capture your best performance.
                        </p>
                    </div>

                    {/* Mobile Visual */}
                    <div className="pl-16 md:hidden">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                            <Mic2 size={24} className="text-foreground mb-2" />
                            <p className="text-xs text-zinc-400">Location: WilkinStudio</p>
                        </div>
                    </div>
                </div>

                {/* STEP 3: THE POLISH */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-zinc-400 rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

                    {/* Left Side: Content */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12">
                        <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <span className="md:hidden">03.</span> Step 03
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">We Polish.</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            You go home. We go to work. Using professional mastering tools, we clean up the audio, balance the dynamics, and ensure it sounds like a cinematic recording.
                        </p>
                        <ul className="mt-4 space-y-2 text-sm text-zinc-500 md:justify-end md:flex md:flex-col">
                            <li className="flex items-center md:justify-end gap-2"><CheckCircle2 size={12} className="text-green-500" /> Noise Reduction</li>
                            <li className="flex items-center md:justify-end gap-2"><CheckCircle2 size={12} className="text-green-500" /> Dynamic Compression</li>
                            <li className="flex items-center md:justify-end gap-2"><CheckCircle2 size={12} className="text-green-500" /> Reverb & Atmosphere</li>
                        </ul>
                    </div>

                    {/* Right Side: Visual */}
                    <div className="pl-16 md:pl-8">
                        <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group-hover:border-foreground/20 transition-colors">
                            <Wand2 size={32} className="text-foreground mb-4" />
                            <div className="space-y-2">
                                <div className="h-2 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                <div className="h-2 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                                <div className="h-2 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/5 opacity-50 select-none">03</div>
                        </div>
                    </div>
                </div>

                {/* STEP 4: THE REVEAL (The Digital Stage) */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-foreground border-2 border-foreground rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-125" />

                    {/* Left Side: Visual (Preview Card) */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12 hidden md:block">
                        <div className="relative aspect-square rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-700">
                            <div className="h-8 border-b border-zinc-100 dark:border-zinc-800 flex items-center px-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-red-400" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                                    <div className="w-2 h-2 rounded-full bg-green-400" />
                                </div>
                            </div>
                            <div className="p-6 flex flex-col items-center pt-8 space-y-3">
                                <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                                <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                                <div className="w-full mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-foreground" />
                                    <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="pl-16 md:pl-8">
                        <div className="inline-flex items-center gap-2 mb-3 text-foreground font-mono text-xs uppercase tracking-widest font-bold">
                            <span className="md:hidden">04.</span> Step 04
                        </div>
                        <h3 className="text-3xl font-black text-foreground mb-4">Boom. Your Digital Stage.</h3>
                        <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                            This is what makes us different. We build you a <span className="text-foreground font-bold border-b-2 border-foreground/20">permanent home</span> on the web.
                        </p>
                        <p className="text-sm text-zinc-500 mb-2">
                            You get a custom URL (e.g. <em>wilkinstudio.com/your-name</em>) featuring your photo, your bio, your social links, and your mastered track.
                        </p>
                    </div>

                    {/* Mobile Visual */}
                    <div className="pl-16 md:hidden">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                            <Music2 size={24} className="text-foreground mb-2" />
                            <p className="text-xs text-zinc-400">Website Generation Complete</p>
                        </div>
                    </div>
                </div>

                {/* STEP 5: SHARING (Elaboration 1) */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 mb-32 group">
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-zinc-400 rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

                    {/* Left Side: Content */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12">
                        <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <span className="md:hidden">05.</span> Step 05
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">You Share It.</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            Forget sending clunky Google Drive links that expire or require permissions. Your page is public, beautiful, and ready to share instantly via text, email, or social media.
                        </p>
                    </div>

                    {/* Right Side: Visual */}
                    <div className="pl-16 md:pl-8">
                        <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group-hover:border-foreground/20 transition-colors">
                            <Share2 size={32} className="text-foreground mb-4" />
                            <div className="flex gap-2">
                                <div className="h-8 w-24 bg-blue-500/20 rounded-md" />
                                <div className="h-8 w-8 bg-green-500/20 rounded-full" />
                                <div className="h-8 w-8 bg-pink-500/20 rounded-full" />
                            </div>
                            <div className="absolute -right-4 -bottom-4 text-9xl font-black text-foreground/5 opacity-50 select-none">05</div>
                        </div>
                    </div>
                </div>

                {/* STEP 6: ARCHIVE (Elaboration 2) */}
                <div className="relative grid md:grid-cols-2 gap-8 md:gap-16 pb-8 group">
                    <div className="absolute left-10 md:left-1/2 w-4 h-4 bg-background border-2 border-zinc-400 rounded-full -translate-x-[7.5px] md:-translate-x-1/2 mt-1.5 z-10 group-hover:scale-125 transition-transform duration-500" />

                    {/* Left Side: Visual (Swapped) */}
                    <div className="pl-16 md:pl-0 md:text-right md:pr-12 hidden md:block">
                        <div className="p-8 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 relative overflow-hidden group-hover:border-foreground/20 transition-colors">
                            <div className="flex justify-end mb-4"><Archive size={32} className="text-foreground" /></div>
                            <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">Status: Preserved</p>
                            <div className="absolute -left-4 -bottom-4 text-9xl font-black text-foreground/5 opacity-50 select-none">06</div>
                        </div>
                    </div>

                    {/* Right Side: Content */}
                    <div className="pl-16 md:pl-8">
                        <div className="inline-flex items-center gap-2 mb-3 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                            <span className="md:hidden">06.</span> Step 06
                        </div>
                        <h3 className="text-3xl font-bold text-foreground mb-4">We Preserve It.</h3>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            We also email you the mastered high-quality audio files directly. This means you have a permanent backup of your work on your own hard drive, forever.
                        </p>
                    </div>

                    {/* Mobile Visual */}
                    <div className="pl-16 md:hidden">
                        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                            <Archive size={24} className="text-foreground mb-2" />
                            <p className="text-xs text-zinc-400">Files Sent</p>
                        </div>
                    </div>
                </div>

            </div>

            {/* THE "GO GLOBAL" UPGRADE (Detached Section) */}
            <section className="w-full max-w-4xl px-6 mb-24">
                <div className="p-10 md:p-16 rounded-[2.5rem] bg-black text-white border border-zinc-800 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
                        <div className="space-y-6 max-w-lg">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-green-900/30 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-widest">
                                <Globe size={12} />
                                Optional Upgrade
                            </div>
                            <h3 className="text-4xl font-bold">Want to go Global?</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                For a small additional fee, we handle the metadata, artwork formatting, and distribution to push your recording to Spotify, Apple Music, and Amazon.
                            </p>
                            <Link href="/pricing" className="text-white font-bold underline underline-offset-4 decoration-zinc-600 hover:decoration-white transition-all">
                                View Distribution Pricing →
                            </Link>
                        </div>

                        {/* Platform Icons */}
                        <div className="flex flex-col gap-4 min-w-[140px]">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-[10px] font-black text-black">Sp</div>
                                <span className="font-bold text-sm">Spotify</span>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                                <div className="w-8 h-8 rounded-full bg-[#FA243C] flex items-center justify-center text-[10px] font-black text-white border border-black/20">Am</div>
                                <span className="font-bold text-sm">Apple Music</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="w-full text-center px-6">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-8">
                    Your stage is waiting.
                </h2>
                <Link
                    href="/pricing"
                    className="group inline-flex items-center gap-3 px-10 py-5 bg-foreground text-background rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl hover:scale-105"
                >
                    Book Your Session. <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </section>

        </main>
    );
}