"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    Calendar, DollarSign, TrendingUp, Users,
    Plus, Clock, Lock, ArrowRight, HelpCircle,
    LayoutDashboard, Trash2, Sparkles, Settings
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import OnboardingModal from "@/components/OnboardingModal"; // 👈 1. Import the Modal

interface DashboardProps {
    teacher: any;
    students: any[];
    schedule: any[];
}

export default function DashboardClient({ teacher, students, schedule: initialSchedule }: DashboardProps) {
    // --- STATE ---
    const [showOnboarding, setShowOnboarding] = useState(false); // 👈 2. Add State for Modal

    // Capacity Logic
    const studentCount = students.length;
    const maxStudents = teacher.max_students || 5;
    const spotsLeft = Math.max(0, maxStudents - studentCount);
    const capacityPercent = Math.min((studentCount / maxStudents) * 100, 100);

    // Pro Check
    const isPro = ['pro', 'enterprise'].includes(teacher.subscription_tier);

    // --- REUSABLE COMPONENTS ---

    const ProStatsModule = ({ locked }: { locked: boolean }) => (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Income Tracker */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 border transition-all duration-500 group
                ${locked
                    ? 'bg-zinc-900 border-amber-500/30 shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10'
                }`}
            >
                {locked && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/5 pointer-events-none" />}

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-4 rounded-2xl ${locked ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'}`}>
                        <DollarSign size={24} strokeWidth={3} />
                    </div>
                    {locked && <Lock className="text-amber-500" size={20} />}
                </div>

                <h3 className={`font-bold text-xs uppercase tracking-widest mb-2 ${locked ? 'text-amber-500/80' : 'text-zinc-500'}`}>
                    Estimated Monthly Income
                </h3>

                {locked ? (
                    <div className="relative z-10">
                        <div className="text-5xl font-black tracking-tight blur-md opacity-40 select-none text-white">$0,000</div>
                        <Link href="/checkout" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                            Upgrade to Unlock <ArrowRight size={12} strokeWidth={3} />
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="text-5xl font-black tracking-tight text-foreground">$1,250.00</div>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={10} /> Pro Active
                        </div>
                    </div>
                )}
            </div>

            {/* Practice Stats */}
            <div className={`relative overflow-hidden rounded-[2.5rem] p-8 border transition-all duration-500
                ${locked
                    ? 'bg-zinc-900 border-amber-500/30 shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10'
                }`}
            >
                {locked && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-amber-500/5 pointer-events-none" />}

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`p-4 rounded-2xl ${locked ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'}`}>
                        <TrendingUp size={24} strokeWidth={3} />
                    </div>
                    {locked && <Lock className="text-amber-500" size={20} />}
                </div>

                <h3 className={`font-bold text-xs uppercase tracking-widest mb-2 ${locked ? 'text-amber-500/80' : 'text-zinc-500'}`}>
                    Student Practice Rate
                </h3>

                {locked ? (
                    <div className="relative z-10">
                        <div className="text-5xl font-black tracking-tight blur-md opacity-40 select-none text-white">88%</div>
                        <Link href="/checkout" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
                            Upgrade to Unlock <ArrowRight size={12} strokeWidth={3} />
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="text-5xl font-black tracking-tight text-foreground">142 Days</div>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-widest">
                            <Sparkles size={10} /> Pro Active
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-12">

            {/* 3. RENDER THE MODAL */}
            <AnimatePresence>
                {showOnboarding && (
                    <OnboardingModal
                        isOpen={showOnboarding}
                        onClose={() => setShowOnboarding(false)}
                        teacher={teacher}
                    />
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">Studio Dashboard</h1>
                <p className="text-zinc-500 font-bold text-lg">Welcome back, {teacher.full_name}.</p>
            </div>

            {/* ORDER LOGIC: Pro Users see stats first */}
            {isPro && <ProStatsModule locked={false} />}

            {/* WEEKLY SCHEDULE */}
            <ScheduleManager teacherId={teacher.id} students={students} initialSchedule={initialSchedule} />

            {/* ORDER LOGIC: Free Users see locked stats below */}
            {!isPro && <ProStatsModule locked={true} />}

            {/* CAPACITY */}
            <div className="bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 p-8 rounded-[2.5rem]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Users size={20} className="text-zinc-400" /> Studio Capacity
                        </h3>
                        <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">
                            Your plan includes {maxStudents} student slots
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${spotsLeft < 3 ? 'bg-amber-500 text-black border-amber-600' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500 border-zinc-300 dark:border-white/10'}`}>
                        {spotsLeft} Spots Available
                    </div>
                </div>

                <div className="h-4 w-full bg-white dark:bg-zinc-800 rounded-full overflow-hidden mb-4 border border-zinc-200 dark:border-white/5">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${spotsLeft === 0 ? 'bg-red-500' : 'bg-foreground'}`}
                        style={{ width: `${capacityPercent}%` }}
                    />
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-xs text-zinc-400 font-medium">
                        Using {studentCount} of {maxStudents} seats
                    </p>
                    <Link href="/studio/account" className="text-xs font-bold text-foreground hover:text-amber-500 transition-colors uppercase tracking-widest">
                        Manage Plan &rarr;
                    </Link>
                </div>
            </div>

            {/* 4. QUICK LINKS (UPDATED BUTTON) */}
            <div className="grid md:grid-cols-3 gap-4 pt-8 border-t border-zinc-200 dark:border-white/10">

                {/* 🔴 This is now a BUTTON that triggers the modal */}
                <button
                    onClick={() => setShowOnboarding(true)}
                    className="group p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-3xl shadow-sm hover:scale-[1.02] transition-all text-left"
                >
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center mb-4 shadow-lg">
                        <Plus size={24} strokeWidth={2.5} />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Onboard New Student</h4>
                    <p className="text-xs text-zinc-500 font-medium">
                        Or send the parents{" "}
                        <a
                            href="https://studiocard.live/onboarding"
                            className="font-bold text-amber-500 hover:text-amber-400 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            studiocard.live/onboarding
                        </a>
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
            console.error(error); // Debug log
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