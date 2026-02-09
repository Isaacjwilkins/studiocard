"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
    Music, Search, Save, Loader2, Play, Pause,
    ChevronDown, ChevronUp, Contact, Download,
    Settings, X, Sparkles, Lock as LockIcon, Camera, Upload, Mic
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import AudioFeedbackRecorder from "@/components/AudioFeedbackRecorder";

// --- CONFETTI COMPONENT (Internal) ---
function Confetti({ name, onClose }: { name: string, onClose: () => void }) {
    const particles = Array.from({ length: 50 });
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
            <div className="relative">
                {particles.map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
                        animate={{
                            opacity: 0,
                            x: (Math.random() - 0.5) * 800,
                            y: (Math.random() - 0.5) * 800,
                            scale: Math.random() * 1.5,
                            rotate: Math.random() * 360
                        }}
                        transition={{ duration: 90, ease: "easeOut" }}
                        className="absolute top-0 left-0 w-3 h-3 rounded-full"
                        style={{
                            backgroundColor: ['#FF0080', '#7928CA', '#0070F3', '#00DFD8'][Math.floor(Math.random() * 4)]
                        }}
                    />
                ))}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] shadow-2xl text-center border border-white/20 relative z-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                        <Sparkles className="text-white" size={40} />
                    </div>
                    <h2 className="text-3xl font-black mb-2">New Student!</h2>
                    <p className="text-zinc-500 mb-6 text-lg">
                        <span className="font-bold text-foreground">{name}</span> just joined your studio.
                    </p>
                    <button onClick={onClose} className="px-8 py-3 bg-foreground text-background font-bold rounded-xl uppercase tracking-widest text-xs">
                        Let's Go
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

// --- MAIN DASHBOARD ---
export default function TeacherDashboard({ teacher, students, initialTracks }: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [newStudentName, setNewStudentName] = useState<string | null>(null);

    // 1. Check for New Students (Joined in last 24h)
    useEffect(() => {
        const checkNewJoiners = () => {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentJoiner = students.find((s: any) => {
                const joinDate = new Date(s.created_at);
                return joinDate > oneDayAgo;
            });

            if (recentJoiner) {
                const seenKey = `seen_join_${recentJoiner.id}`;
                if (!localStorage.getItem(seenKey)) {
                    setNewStudentName(recentJoiner.full_name);
                    localStorage.setItem(seenKey, 'true');
                }
            }
        };
        checkNewJoiners();
    }, [students]);

    // 2. Search Filter
    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        const lowerQ = searchQuery.toLowerCase();
        return students.filter((s: any) =>
            s.full_name.toLowerCase().includes(lowerQ) ||
            s.slug.toLowerCase().includes(lowerQ)
        );
    }, [searchQuery, students]);

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Confetti Overlay */}
            <AnimatePresence>
                {newStudentName && (
                    <Confetti name={newStudentName} onClose={() => setNewStudentName(null)} />
                )}
            </AnimatePresence>

            {/* Header & Search */}
            <header className="flex flex-col gap-6 border-b border-zinc-200 dark:border-white/10 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter">{teacher.full_name}</h1>
                        <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mt-2">Studio Roster • {students.length} Students</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            placeholder="Find a student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    </div>
                </div>
            </header>

            {/* Student List */}
            <div className="space-y-4">
                {filteredStudents.length === 0 ? (
                    <div className="text-center py-20 opacity-50 font-bold uppercase tracking-widest">No students found</div>
                ) : (
                    filteredStudents.map((student: any) => (
                        <StudentRow
                            key={student.id}
                            student={student}
                            tracks={initialTracks.filter((t: any) => t.artist_id === student.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

// --- ROW COMPONENT ---
function StudentRow({ student, tracks }: any) {
    // Content State
    const [homework, setHomework] = useState(student.current_assignments || "");
    const [note, setNote] = useState(student.current_note || "");

    // Contact Info State (Editable)
    const [contactInfo, setContactInfo] = useState({
        parent_name: student.parent_name || "",
        email: student.email || "",
        phone_number: student.phone_number || "",
        access_code: student.access_code || ""
    });

    const [isSaving, setIsSaving] = useState(false);

    // Profile Image State
    const [profileImage, setProfileImage] = useState(student.profile_image_url || "");
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Audio Feedback State
    const [showAudioRecorder, setShowAudioRecorder] = useState(false);
    const [audioFeedbackUrl, setAudioFeedbackUrl] = useState(student.audio_feedback_url || "");

    // Layout State
    const [isExpanded, setIsExpanded] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const rowRef = useRef<HTMLDivElement>(null);

    // Audio State
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

    // Get last recording date
    const lastRecording = tracks.length > 0
        ? new Date(tracks[0].created_at).toLocaleDateString()
        : null;

    // Check for hash anchor on mount - expand and scroll if this student is targeted
    useEffect(() => {
        const hash = window.location.hash;
        if (hash === `#student-${student.id}`) {
            setIsExpanded(true);
            // Scroll into view after a brief delay for DOM to update
            setTimeout(() => {
                rowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [student.id]);

    // --- AUDIO HANDLERS ---
    const toggleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const speeds = [1, 1.5, 2];
        const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
        setPlaybackRate(speeds[nextIndex]);
        if (activeTrackId && audioRefs.current[activeTrackId]) {
            audioRefs.current[activeTrackId]!.playbackRate = speeds[nextIndex];
        }
    };

    const handlePlayToggle = (e: React.MouseEvent, trackId: string) => {
        e.stopPropagation();
        const audio = audioRefs.current[trackId];
        if (!audio) return;

        if (activeTrackId === trackId) {
            audio.pause();
            setActiveTrackId(null);
        } else {
            if (activeTrackId && audioRefs.current[activeTrackId]) {
                audioRefs.current[activeTrackId]?.pause();
            }
            audio.playbackRate = playbackRate;
            audio.play();
            setActiveTrackId(trackId);
        }
    };

    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>, trackId: string) => {
        if (trackId !== activeTrackId) return;
        const audio = e.currentTarget;
        if (audio.duration && isFinite(audio.duration)) {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>, trackId: string) => {
        e.stopPropagation();
        const newProgress = parseFloat(e.target.value);
        const audio = audioRefs.current[trackId];
        if (audio && audio.duration && isFinite(audio.duration)) {
            const newTime = (newProgress / 100) * audio.duration;
            audio.currentTime = newTime;
            setProgress(newProgress);
            setCurrentTime(newTime);
        }
    };

    // 2. FIXED: Explicitly defined handleLoadedMetadata
    const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLAudioElement>, trackId: string) => {
        if (trackId !== activeTrackId) return;
        const audio = e.currentTarget;
        if (isFinite(audio.duration)) {
            setDuration(audio.duration);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || !isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // --- PROFILE IMAGE UPLOAD ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);

        try {
            const fileName = `profiles/${student.id}-${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('audio-tracks')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('audio-tracks')
                .getPublicUrl(fileName);

            // Update local state
            setProfileImage(urlData.publicUrl);

            // Update database
            const { error: dbError } = await supabase
                .from('artists')
                .update({ profile_image_url: urlData.publicUrl })
                .eq('id', student.id);

            if (dbError) throw dbError;
        } catch (err: any) {
            alert("Upload failed: " + err.message);
        } finally {
            setIsUploadingImage(false);
        }
    };

    // --- SAVE ALL DATA ---
    const handleUpdate = async () => {
        setIsSaving(true);
        const { error } = await supabase
            .from('artists')
            .update({
                current_assignments: homework,
                current_note: note,
                parent_name: contactInfo.parent_name,
                email: contactInfo.email,
                phone_number: contactInfo.phone_number,
                access_code: contactInfo.access_code
            })
            .eq('id', student.id);

        if (error) {
            alert(error.message);
        }
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <motion.div
            ref={rowRef}
            id={`student-${student.id}`}
            layout
            initial={false}
            className="rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-lg overflow-hidden scroll-mt-24"
        >
            {/* HEADER */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-5 md:p-6 cursor-pointer flex items-center justify-between group hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
            >
                <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                    {/* Profile Image with Upload */}
                    <div className="relative group shrink-0">
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                            }}
                            disabled={isUploadingImage}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-white/10 overflow-hidden relative"
                        >
                            {profileImage ? (
                                <img src={profileImage} className="w-full h-full object-cover" alt={student.full_name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                    <Camera size={20} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                {isUploadingImage ? (
                                    <Loader2 className="text-white animate-spin" size={16} />
                                ) : (
                                    <Upload className="text-white" size={16} />
                                )}
                            </div>
                        </button>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg md:text-xl font-black tracking-tight truncate">{student.full_name}</h3>
                            {tracks.length > 0 && (
                                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500">
                                    {tracks.length} recordings
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                            <Link href={`/${student.slug}`} onClick={(e) => e.stopPropagation()} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-purple-500 transition-colors">
                                @{student.slug}
                            </Link>
                            {lastRecording && (
                                <span className="text-[10px] text-zinc-400">
                                    • Last: {lastRecording}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pl-4 flex items-center gap-4">
                    <div className="p-2 rounded-full bg-zinc-50 dark:bg-black/40 text-zinc-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>
            </div>

            {/* EXPANDABLE BODY */}
            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-8 md:px-8 md:pb-8 grid lg:grid-cols-12 gap-8 border-t border-zinc-100 dark:border-white/5 pt-8">

                            {/* LEFT COL: Contact & Tracks */}
                            <div className="lg:col-span-5 space-y-6">

                                {/* 1. Editable Contact Card */}
                                <div className="space-y-3">
                                    <button onClick={() => setShowContact(!showContact)} className="w-full p-4 flex items-center justify-between rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-100 dark:border-white/5 text-xs font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                                        <span className="flex items-center gap-2"><Contact size={14} /> Student Details</span>
                                        {showContact ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>

                                    <AnimatePresence>
                                        {showContact && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                                <div className="p-4 rounded-2xl bg-zinc-100/50 dark:bg-zinc-800/30 text-sm space-y-4 border border-zinc-200 dark:border-white/5">

                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase text-zinc-400">Parent</span>
                                                        <input
                                                            value={contactInfo.parent_name}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, parent_name: e.target.value })}
                                                            placeholder="Parent Name"
                                                            className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-purple-500 outline-none py-1 font-bold text-foreground w-full"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase text-zinc-400">Email</span>
                                                        <input
                                                            value={contactInfo.email}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                                            placeholder="Email Address"
                                                            className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-purple-500 outline-none py-1 font-bold text-foreground w-full"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                                        <span className="text-[10px] font-bold uppercase text-zinc-400">Phone</span>
                                                        <input
                                                            value={contactInfo.phone_number}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, phone_number: e.target.value })}
                                                            placeholder="(555) 555-5555"
                                                            className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-purple-500 outline-none py-1 font-bold text-foreground w-full"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-[80px_1fr] items-center gap-2">
                                                        {/* Access code for family viewing */}
                                                        <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center gap-1"><LockIcon size={10} /> Access Code</span>
                                                        <input
                                                            value={contactInfo.access_code}
                                                            onChange={(e) => setContactInfo({ ...contactInfo, access_code: e.target.value })}
                                                            placeholder="1234"
                                                            className="bg-transparent border-b border-zinc-300 dark:border-zinc-700 focus:border-purple-500 outline-none py-1 font-bold text-foreground w-full font-mono"
                                                        />
                                                    </div>

                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* 2. Tracks List */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recordings</h4>
                                        <span className="text-[10px] font-bold text-zinc-500">{tracks.length}</span>
                                    </div>

                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {tracks.map((track: any) => {
                                            const isPlaying = activeTrackId === track.id;
                                            return (
                                                <div key={track.id} className={`p-4 rounded-2xl transition-all ${isPlaying ? 'bg-zinc-900 text-white shadow-xl' : 'bg-zinc-50 dark:bg-black/40'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                                                            <button
                                                                onClick={(e) => handlePlayToggle(e, track.id)}
                                                                className={`w-10 h-10 flex items-center justify-center rounded-full shrink-0 transition-transform active:scale-95 ${isPlaying ? 'bg-white text-black' : 'bg-zinc-200 dark:bg-zinc-700'}`}
                                                            >
                                                                {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                            </button>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="text-sm font-bold truncate">{track.title}</p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[10px] opacity-60 uppercase">{new Date(track.created_at).toLocaleDateString()}</span>
                                                                    {/* Speed Toggle (Only Visible When Playing) */}
                                                                    {isPlaying && (
                                                                        <button
                                                                            onClick={toggleSpeed}
                                                                            className="px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-[9px] font-black uppercase tracking-widest ml-2 transition-colors"
                                                                        >
                                                                            {playbackRate}x
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <a href={track.audio_url} target="_blank" rel="noopener noreferrer" download className="p-2 opacity-50 hover:opacity-100"><Download size={16} /></a>
                                                    </div>

                                                    {isPlaying && (
                                                        <div className="flex items-center gap-3 mt-3 px-1 animate-in fade-in slide-in-from-top-1">
                                                            <span className="text-[10px] font-mono opacity-60 w-8 text-right">{formatTime(currentTime)}</span>
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                step="0.1"
                                                                value={progress}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => handleSeek(e, track.id)}
                                                                className="flex-1 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                                                            />
                                                            <span className="text-[10px] font-mono opacity-60 w-8">{formatTime(duration)}</span>
                                                        </div>
                                                    )}

                                                    <audio
                                                        ref={(el) => { audioRefs.current[track.id] = el }}
                                                        src={track.audio_url}
                                                        onTimeUpdate={(e) => handleTimeUpdate(e, track.id)}
                                                        onLoadedMetadata={(e) => handleLoadedMetadata(e, track.id)}
                                                        onEnded={() => { setActiveTrackId(null); setProgress(0); setPlaybackRate(1); }}
                                                        className="hidden"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COL: Editors */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                <div className="grid md:grid-cols-2 gap-4 h-full">
                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assignments</label>
                                        <textarea
                                            value={homework}
                                            onChange={(e) => setHomework(e.target.value)}
                                            placeholder="Add assignments here..."
                                            className="w-full flex-1 min-h-[160px] p-5 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-2xl text-sm font-bold text-zinc-700 dark:text-zinc-200 resize-none focus:ring-2 focus:ring-yellow-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2 flex flex-col">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Teacher's Note</label>
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Send a note right to your student's card!"
                                            className="w-full flex-1 min-h-[160px] p-5 bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 rounded-2xl text-sm font-medium italic text-zinc-600 dark:text-zinc-400 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
                                        />
                                    </div>
                                </div>
                                {/* Voice Note Button */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowAudioRecorder(true)}
                                        className="flex-1 py-4 rounded-2xl bg-purple-500 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors"
                                    >
                                        <Mic size={16} /> {audioFeedbackUrl ? 'Update Voice Note' : 'Send Voice Note'}
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={isSaving}
                                        className="flex-1 py-4 rounded-2xl bg-amber-500 text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2
                                            hover:brightness-105 hover:scale-[1.02] transition-all
                                            shadow-xl shadow-purple-500/10 shadow-amber-500/20
                                            ring-1 ring-zinc-300 dark:ring-zinc-700"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save All
                                    </button>
                                </div>

                                {/* Current Voice Note Indicator */}
                                {audioFeedbackUrl && (
                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 text-center">
                                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2">
                                            <Mic size={12} /> Voice note sent to student's card
                                        </p>
                                    </div>
                                )}

                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Audio Feedback Recorder Modal */}
            <AnimatePresence>
                {showAudioRecorder && (
                    <AudioFeedbackRecorder
                        artistId={student.id}
                        artistName={student.full_name}
                        onClose={() => setShowAudioRecorder(false)}
                        onSuccess={(url) => setAudioFeedbackUrl(url)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}