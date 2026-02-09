"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
    Calendar, Users,
    Plus, Clock, HelpCircle,
    LayoutDashboard, Trash2, Settings,
    Inbox, ArrowRight, Music, CheckCircle, X, Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingModal from "@/components/OnboardingModal";
import UpgradeModal from "@/components/UpgradeModal";
import { markTrackAsRead } from "@/app/actions";

interface FeedTrack {
    id: string;
    title: string;
    audio_url: string;
    created_at: string;
    is_read: boolean;
    artist_id: string;
    artist_name: string;
    artist_image: string | null;
    artist_slug: string | null;
}

interface DashboardProps {
    teacher: any;
    students: any[];
    schedule: any[];
    feedTracks: FeedTrack[];
    unreadCount: number;
}

export default function DashboardClient({ teacher, students, schedule: initialSchedule, feedTracks: initialFeedTracks, unreadCount: initialUnreadCount }: DashboardProps) {
    const searchParams = useSearchParams();

    // --- STATE ---
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);
    const [feedTracks, setFeedTracks] = useState<FeedTrack[]>(initialFeedTracks);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    // Check for upgrade success param
    useEffect(() => {
        if (searchParams.get('upgrade') === 'success') {
            setShowSuccessBanner(true);
            // Remove the query param from URL without refresh
            window.history.replaceState({}, '', '/studio/dashboard');
        }
    }, [searchParams]);

    // Capacity Logic
    const studentCount = students.length;
    const maxStudents = teacher.max_students || 3;
    const spotsLeft = Math.max(0, maxStudents - studentCount);
    const capacityPercent = Math.min((studentCount / maxStudents) * 100, 100);

    // Subscription Check
    const isStudioPlan = teacher.subscription_status === 'active' || teacher.subscription_tier === 'studio';
    const isFree = !isStudioPlan;

    // Handle onboard button click - check limits
    const handleOnboardClick = () => {
        if (isFree && studentCount >= maxStudents) {
            setShowUpgrade(true);
        } else {
            setShowOnboarding(true);
        }
    };

    // Handle clicking on a track - mark as read
    const handleTrackClick = async (track: FeedTrack) => {
        if (!track.is_read) {
            await markTrackAsRead(track.id);
            setFeedTracks(prev =>
                prev.map(t => t.id === track.id ? { ...t, is_read: true } : t)
            );
        }
    };

    // --- INBOX MODULE ---
    const InboxModule = () => (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-sm overflow-hidden mb-8">
            <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-indigo-500 text-white">
                            <Inbox size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Inbox</h3>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                Recent student recordings
                            </p>
                        </div>
                    </div>
                    {feedTracks.filter(t => !t.is_read).length > 0 && (
                        <div className="px-3 py-1 rounded-full bg-indigo-500 text-white text-xs font-black">
                            {feedTracks.filter(t => !t.is_read).length} new
                        </div>
                    )}
                </div>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-white/5">
                {feedTracks.length === 0 ? (
                    <div className="p-8 text-center">
                        <Inbox size={48} className="mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                        <p className="text-zinc-500 font-medium">No recordings yet</p>
                        <p className="text-xs text-zinc-400 mt-1">
                            Recordings from your students will appear here
                        </p>
                    </div>
                ) : (
                    feedTracks.map(track => (
                        <Link
                            key={track.id}
                            href={`/studio/${teacher.username}#student-${track.artist_id}`}
                            onClick={() => handleTrackClick(track)}
                            className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
                        >
                            {/* Unread indicator */}
                            <div className="w-2 h-2 shrink-0">
                                {!track.is_read && (
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                )}
                            </div>

                            {/* Student avatar */}
                            <div className="w-10 h-10 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                                {track.artist_image ? (
                                    <img src={track.artist_image} alt={track.artist_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Music size={16} className="text-zinc-400" />
                                    </div>
                                )}
                            </div>

                            {/* Track info */}
                            <div className="flex-1 min-w-0">
                                <p className={`font-bold truncate ${!track.is_read ? '' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {track.title}
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {track.artist_name} &bull; {new Date(track.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Arrow indicator */}
                            <ArrowRight size={16} className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                    ))
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12">

            {/* MODALS */}
            <AnimatePresence>
                {showOnboarding && (
                    <OnboardingModal
                        isOpen={showOnboarding}
                        onClose={() => setShowOnboarding(false)}
                        teacher={teacher}
                    />
                )}
                {showUpgrade && (
                    <UpgradeModal
                        isOpen={showUpgrade}
                        onClose={() => setShowUpgrade(false)}
                    />
                )}
            </AnimatePresence>

            {/* SUCCESS BANNER */}
            <AnimatePresence>
                {showSuccessBanner && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 mb-8"
                    >
                        <button
                            onClick={() => setShowSuccessBanner(false)}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={18} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Welcome to the Studio Plan!</h3>
                                <p className="text-white/80">
                                    You now have unlimited students. Your subscription is active.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">Studio Dashboard</h1>
                    <p className="text-zinc-500 font-bold text-lg">Welcome back, {teacher.full_name}.</p>
                </div>

                {/* Plan Badge */}
                {isStudioPlan ? (
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-purple-500/20">
                        <Sparkles size={20} />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Studio Plan</p>
                            <p className="font-black">Unlimited Students</p>
                        </div>
                    </div>
                ) : (
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        <Users size={20} className="text-zinc-400" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Free Plan</p>
                            <p className="font-bold text-foreground">{studentCount}/{maxStudents} Students</p>
                        </div>
                    </div>
                )}
            </div>

            {/* WELCOME BANNER - Show for new teachers with no students */}
            {studentCount === 0 && (
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-8 md:p-12 text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black mb-3">Welcome to Studio.Card!</h2>
                        <p className="text-white/80 mb-6 max-w-lg">
                            You&apos;re all set up. Now let&apos;s add your first student. They&apos;ll get their own profile page where they can record and share their practice.
                        </p>
                        <button
                            onClick={handleOnboardClick}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg"
                        >
                            <Plus size={18} /> Add Your First Student
                        </button>
                    </div>
                </div>
            )}

            {/* INBOX - Recent Student Recordings */}
            {studentCount > 0 && <InboxModule />}

            {/* WEEKLY SCHEDULE */}
            <ScheduleManager teacherId={teacher.id} students={students} initialSchedule={initialSchedule} />

            {/* CAPACITY / STUDIO PLAN STATUS */}
            {isStudioPlan ? (
                /* STUDIO PLAN - Celebration Card */
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 rounded-[2.5rem] p-8 text-white">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                <Sparkles size={32} className="text-amber-300" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-1">Unlimited Access</h3>
                                <p className="text-white/70 text-sm font-medium">
                                    You have <span className="font-bold text-white">{studentCount} students</span> in your studio
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {['Unlimited Students', 'Full Inbox', 'Priority Support'].map((benefit) => (
                                <span key={benefit} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-bold backdrop-blur-sm">
                                    <CheckCircle size={12} /> {benefit}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                        <p className="text-xs text-white/50 font-medium uppercase tracking-widest">
                            Studio Plan &bull; Active Subscription
                        </p>
                        <Link href="/studio/account" className="text-xs font-bold text-white/80 hover:text-white transition-colors uppercase tracking-widest">
                            Manage Account &rarr;
                        </Link>
                    </div>
                </div>
            ) : (
                /* FREE PLAN - Capacity with Upgrade CTA */
                <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Users size={20} className="text-zinc-400" /> Studio Capacity
                            </h3>
                            <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                                Free plan &bull; {maxStudents} student limit
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${spotsLeft === 0 ? 'bg-red-500 text-white border-red-600' : spotsLeft < 2 ? 'bg-amber-500 text-black border-amber-600' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-white/10'}`}>
                            {spotsLeft === 0 ? 'At Limit' : `${spotsLeft} Spot${spotsLeft !== 1 ? 's' : ''} Left`}
                        </div>
                    </div>

                    <div className="h-4 w-full bg-white dark:bg-zinc-800 rounded-full overflow-hidden mb-4 border border-zinc-200 dark:border-white/5">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${spotsLeft === 0 ? 'bg-red-500' : 'bg-foreground'}`}
                            style={{ width: `${capacityPercent}%` }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-xs text-zinc-400 font-medium">
                            {studentCount} of {maxStudents} students
                        </p>

                        {/* Upgrade CTA */}
                        <button
                            onClick={() => setShowUpgrade(true)}
                            className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md shadow-amber-500/20"
                        >
                            <Sparkles size={14} />
                            Unlock Unlimited
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* QUICK LINKS */}
            <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-zinc-200 dark:border-white/10">

                {/* Onboard button - checks student limit */}
                <button
                    onClick={handleOnboardClick}
                    className={`group p-6 rounded-3xl shadow-sm hover:scale-[1.02] transition-all text-left ${
                        isStudioPlan
                            ? 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800/50'
                            : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10'
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                        isStudioPlan
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                            : 'bg-amber-500 text-black'
                    }`}>
                        <Plus size={24} strokeWidth={2.5} />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Onboard New Student</h4>
                    <p className="text-xs text-zinc-500 font-medium">
                        {isStudioPlan ? (
                            <>Add unlimited students to your studio</>
                        ) : (
                            <>
                                {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} remaining` : 'Upgrade for more students'}
                            </>
                        )}
                    </p>
                </button>

                <QuickLink
                    href="/faq"
                    icon={HelpCircle}
                    title="Help & FAQ"
                    desc="Guides on using the studio."
                    color="bg-zinc-500 text-white"
                />
                <QuickLink
                    href="/support"
                    icon={LayoutDashboard}
                    title="Contact Support"
                    desc="Get help with your account."
                    color="bg-indigo-500 text-white"
                />
            </div>

        </div>
    );
}

// --- SUB-COMPONENTS ---

function QuickLink({ href, icon: Icon, title, desc, color }: any) {
    return (
        <Link href={href} className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm hover:scale-[1.02] transition-all">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-lg`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
            <h4 className="font-bold text-sm mb-1">{title}</h4>
            <p className="text-xs text-zinc-500 font-medium">{desc}</p>
        </Link>
    );
}

// --- SCHEDULE MANAGER COMPONENT ---
function ScheduleManager({ teacherId, students, initialSchedule }: any) {
    const [schedule, setSchedule] = useState(initialSchedule);
    const [isAdding, setIsAdding] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [day, setDay] = useState("1");
    const [time, setTime] = useState("15:00");
    const [studentId, setStudentId] = useState("");

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleAddSlot = async () => {
        if (!studentId) return alert("Select a student");
        setLoading(true);

        const newSlot = {
            teacher_id: teacherId,
            student_id: studentId,
            day_of_week: parseInt(day),
            start_time: time,
            duration_minutes: 30
        };

        const { data, error } = await supabase
            .from("lesson_schedule")
            .insert([newSlot])
            .select()
            .single();

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            setSchedule([...schedule, data]);
            setIsAdding(false);
            setStudentId("");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this lesson slot?")) return;

        const oldSchedule = [...schedule];
        setSchedule(schedule.filter((s: any) => s.id !== id));

        const { error } = await supabase.from("lesson_schedule").delete().eq("id", id);
        if (error) {
            alert("Failed to delete");
            setSchedule(oldSchedule);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[2.5rem] shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-zinc-100 dark:border-white/5">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-zinc-400" /> Weekly Schedule
                    </h3>
                    <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">Manage your recurring lessons</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >
                    {isAdding ? <Settings size={14} /> : <Plus size={14} />} {isAdding ? "Cancel" : "Add Slot"}
                </button>
            </div>

            {/* Add Slot Form */}
            {isAdding && (
                <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 grid md:grid-cols-4 gap-4 animate-in slide-in-from-top-4 border-b border-zinc-100 dark:border-white/5">
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500">
                        {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                    </select>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500" />
                    <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="p-3 rounded-xl bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500">
                        <option value="">Select Student...</option>
                        {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                    </select>
                    <button onClick={handleAddSlot} disabled={loading} className="p-3 bg-amber-500 text-black font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                        {loading ? "Saving..." : "Confirm Add"}
                    </button>
                </div>
            )}

            {/* Calendar Grid */}
            <div className="grid md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-zinc-100 dark:divide-white/5">
                {days.map((dayName, index) => {
                    const dayLessons = schedule
                        .filter((s: any) => s.day_of_week === index)
                        .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));

                    return (
                        <div key={dayName} className="min-h-[180px] p-4 flex flex-col gap-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">{dayName.substring(0, 3)}</h4>

                            {dayLessons.length === 0 ? (
                                <div className="flex-1 border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-xl flex items-center justify-center opacity-50">
                                    <span className="text-[10px] text-zinc-300 font-bold uppercase">-</span>
                                </div>
                            ) : (
                                dayLessons.map((lesson: any) => {
                                    const studentName = students.find((s: any) => s.id === lesson.student_id)?.full_name || "Unknown";
                                    return (
                                        <div key={lesson.id} className="group relative p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl text-left hover:scale-[1.02] transition-transform shadow-sm">
                                            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-300 mb-1 flex items-center gap-1">
                                                <Clock size={10} /> {lesson.start_time.substring(0, 5)}
                                            </p>
                                            <p className="text-xs font-bold truncate">{studentName}</p>

                                            {/* Delete Button (Hover) */}
                                            <button
                                                onClick={() => handleDelete(lesson.id)}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex shadow-md hover:bg-red-600 transition-colors z-10"
                                                title="Remove"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}