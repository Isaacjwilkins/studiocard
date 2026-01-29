"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
    Check, Star, Zap, Music, ArrowRight,
    Crown, Sparkles, Loader2, AlertCircle
} from 'lucide-react';

export default function PricingPage() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch the Teacher Cards (Instruments)
    useEffect(() => {
        const fetchCards = async () => {
            const { data, error } = await supabase
                .from('teacher_cards')
                .select('*')
                .order('created_at');

            if (error) console.error("Error fetching cards:", error);
            setCards(data || []);
            setLoading(false);
        };
        fetchCards();
    }, []);

    // Helper for Colors
    const hexToRgba = (hex: string, alpha: number) => {
        if (!hex) return `rgba(0,0,0,${alpha})`;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        // REMOVED: bg-zinc-50 dark:bg-black (Now Transparent)
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center pt-32 pb-20 px-6">

            {/* Background Blobs (Optional - can remove if you want PURE transparency) */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />

            {/* HEADER */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-zinc-500"
                >
                    <Sparkles size={12} className="text-amber-500" /> Start Learning
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-6"
                >
                    Your Studio. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                        Anywhere.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed"
                >
                    Choose your instrument and start your journey today.
                    Track progress, get feedback, and unlock your potential.
                </motion.p>
            </div>

            {/* --- INSTRUMENT CATALOG --- */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32"
            >
                {loading ? (
                    // Skeletons
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-[2rem] bg-zinc-100/50 dark:bg-zinc-900/50 animate-pulse border border-zinc-200 dark:border-white/5" />
                    ))
                ) : cards.length > 0 ? (
                    cards.map((card) => (
                        <motion.div key={card.id} variants={item}>
                            <Link
                                href={`/learn/${card.slug}`}
                                className="group relative block h-full min-h-[280px] rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-white/10 transition-all hover:scale-[1.02] hover:shadow-2xl bg-white/40 dark:bg-black/40 backdrop-blur-xl"
                            >
                                {/* Image Background */}
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                    {card.image_url ? (
                                        <img src={card.image_url} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-800" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="relative z-20 h-full flex flex-col justify-end p-8">
                                    <div className="mb-auto">
                                        <span
                                            className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 text-white backdrop-blur-md border border-white/10"
                                            style={{ backgroundColor: hexToRgba(card.theme_color, 0.3) }}
                                        >
                                            {card.instrument}
                                        </span>
                                    </div>

                                    <h3 className="text-3xl font-black tracking-tight text-white mb-2 group-hover:translate-x-1 transition-transform">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm text-white/70 font-medium line-clamp-2 mb-4">
                                        {card.description}
                                    </p>

                                    <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest group-hover:text-white">
                                        Start Lesson <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                ) : (
                    // EMPTY STATE
                    <div className="col-span-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-[3rem] bg-white/5">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                            <Music size={32} className="text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No Instruments Yet</h3>
                        <p className="text-zinc-500 max-w-sm">
                            We haven't added any public courses yet. Check back soon or run the seed script!
                        </p>
                    </div>
                )}
            </motion.div>


            {/* --- PRICING SECTION --- */}
            <div className="w-full max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">Membership</h2>
                    <h3 className="text-4xl font-black tracking-tight">Unlock Pro Lessons</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">

                    {/* FREE CARD */}
                    <div className="p-8 rounded-[2.5rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200 dark:border-white/5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                                <Music size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Studio Basic</h4>
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Forever Free</p>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {['Access to Core Lessons', 'Progress Tracking', 'Basic Audio Player', 'Personal Dashboard'].map(feat => (
                                <li key={feat} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                                    <Check size={16} className="text-green-500" /> {feat}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-zinc-200 dark:border-zinc-700 font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                            Current Plan
                        </button>
                    </div>

                    {/* PRO CARD */}
                    <div className="relative p-8 rounded-[2.5rem] bg-black dark:bg-white text-white dark:text-black shadow-2xl scale-105 border border-transparent">
                        {/* Gradient Border Illusion */}
                        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 -z-10 blur-xl opacity-50" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 rounded-xl bg-amber-500 text-white shadow-lg shadow-amber-500/40">
                                <Crown size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Studio Pro</h4>
                                <p className="text-xs font-bold uppercase tracking-wider opacity-60">$10 / Month</p>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {['Everything in Basic', 'Unlock Pro Lessons', 'Advanced Techniques (Arpeggios)', 'Priority Feedback'].map(feat => (
                                <li key={feat} className="flex items-center gap-3 text-sm font-bold">
                                    <div className="p-0.5 rounded-full bg-amber-500 text-black">
                                        <Check size={10} strokeWidth={4} />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <Link
                            href="/pricing"
                            className="w-full py-4 rounded-xl bg-amber-500 text-black font-black text-xs uppercase tracking-widest hover:brightness-110 hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/25 inline-flex justify-center"
                        >
                            Get Started
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    );
}