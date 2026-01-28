"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
    Users, Music, BookOpen, MessageSquare,
    Save, Loader2, Play, Pause, ExternalLink,
    Globe, EyeOff, Lock, ChevronDown, ChevronUp,
    Mail, Phone, UserRound, Contact
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function TeacherDashboard({ teacher, students, initialTracks }: any) {
    const [isLocked, setIsLocked] = useState(true);
    const [passcodeInput, setPasscodeInput] = useState("");
    const [error, setError] = useState("");

    if (isLocked) {
        return (
            <div className="max-w-md mx-auto mt-20 p-10 rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-2xl text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="text-red-500" size={32} />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">Studio Dashboard</h2>
                <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => { setPasscodeInput(e.target.value); setError(""); }}
                    className="w-full p-5 bg-zinc-100 dark:bg-black rounded-2xl text-center font-bold tracking-[0.5em] mb-4 outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="****"
                />
                {error && <p className="text-red-500 text-xs font-bold mb-4">{error}</p>}
                <button
                    onClick={() => passcodeInput === teacher.passcode ? setIsLocked(false) : setError("Invalid Passcode")}
                    className="w-full py-5 bg-foreground text-background dark:bg-white dark:text-black font-black uppercase tracking-widest rounded-2xl"
                >
                    Unlock Studio
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-white/10 pb-8">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{teacher.full_name}</h1>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-2">Studio Roster • {students.length} Students</p>
                </div>
            </header>

            <div className="space-y-4 mt-6">
                {students.map((student: any) => (
                    <StudentRow
                        key={student.id}
                        student={student}
                        tracks={initialTracks.filter((t: any) => t.artist_id === student.id)}
                    />
                ))}
            </div>
        </div>
    );
}

function StudentRow({ student, tracks }: any) {
    const [homework, setHomework] = useState(student.current_assignments || "");
    const [note, setNote] = useState(student.current_note || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Mobile Tucking State
    const [showContact, setShowContact] = useState(false);

    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlayToggle = (e: React.MouseEvent, track: any) => {
        e.stopPropagation(); // Prevents collapsing the row when clicking play
        if (activeTrackId === track.id) {
            audioRef.current?.pause();
            setActiveTrackId(null);
        } else {
            setActiveTrackId(track.id);
            if (audioRef.current) {
                audioRef.current.src = track.audio_url;
                audioRef.current.play();
            }
        }
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('artists')
            .update({ current_assignments: homework, current_note: note })
            .eq('id', student.id);

        if (error) alert(error.message);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <motion.div
            layout
            initial={false}
            className="rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-lg overflow-hidden"
        >
            <audio ref={audioRef} onEnded={() => setActiveTrackId(null)} className="hidden" />

            {/* 1. COMPACT HEADER (Always Visible) */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 md:p-8 cursor-pointer lg:cursor-default flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-white/10 overflow-hidden shrink-0">
                        {student.profile_image_url && <img src={student.profile_image_url} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <h3 className="text-xl md:text-2xl font-black tracking-tight">{student.full_name}</h3>
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/${student.slug}`}
                                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-200"
                            >
                                @{student.slug}
                            </Link>
                            {tracks.length > 0 && (
                                <span className="hidden md:flex items-center gap-1 text-[10px] font-black uppercase text-red-500">
                                    <Music size={10} /> {tracks.length} Tracks
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile-Only Indicator */}
                <div className="lg:hidden p-2 rounded-full bg-zinc-50 dark:bg-black/40 text-zinc-400">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {/* 2. EXPANDABLE CONTENT */}
            <AnimatePresence initial={false}>
                {(isExpanded || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden lg:!h-auto lg:!opacity-100"
                    >
                        <div className="px-5 pb-8 md:px-10 md:pb-10 grid lg:grid-cols-12 gap-8 border-t border-zinc-100 dark:border-white/5 pt-8">

                            {/* Profile & Music (Left) */}
                            <div className="lg:col-span-5 space-y-6">

                                {/* Contact Controls */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowContact(!showContact)}
                                        className="w-full p-4 flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-white/5 text-xs font-black uppercase tracking-widest text-zinc-500"
                                    >
                                        <span className="flex items-center gap-2"><Contact size={14} /> Contact Details</span>
                                        {showContact ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>

                                    <AnimatePresence>
                                        {showContact && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden space-y-2">
                                                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/30 text-sm space-y-3">
                                                    <div className="flex justify-between"><span className="opacity-50 font-medium">Parent</span> <span className="font-bold">{student.parent_name || "N/A"}</span></div>
                                                    <a href={`mailto:${student.email}`} className="flex justify-between hover:text-red-500"><span className="opacity-50 font-medium">Email</span> <span className="font-bold">{student.email || "N/A"}</span></a>
                                                    <a href={`tel:${student.phone_number}`} className="flex justify-between hover:text-red-500"><span className="opacity-50 font-medium">Phone</span> <span className="font-bold">{student.phone_number || "N/A"}</span></a>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Track List */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recordings</h4>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {tracks.map((track: any) => (
                                            <div key={track.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-black/40 flex items-center justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold truncate pr-4">{track.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {track.is_public ? <Globe size={10} className="text-green-500" /> : <EyeOff size={10} className="text-zinc-500" />}
                                                        <span className="text-[10px] text-zinc-400">{new Date(track.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => handlePlayToggle(e, track)} className="p-3 rounded-full bg-foreground text-background">
                                                    {activeTrackId === track.id ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Controls (Right) */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assignments</label>
                                        <textarea value={homework} onChange={(e) => setHomework(e.target.value)} className="w-full min-h-[150px] p-4 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl text-sm font-bold resize-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Teacher's Note</label>
                                        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full min-h-[150px] p-4 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl text-sm font-medium italic resize-none" />
                                    </div>
                                </div>
                                <button onClick={handleUpdate} disabled={isSaving} className="w-full py-5 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                    {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Records
                                </button>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}