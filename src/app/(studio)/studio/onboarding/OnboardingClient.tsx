"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    QrCode, ChevronRight, CheckCircle2, 
    ShieldCheck, Mic, Smartphone, ArrowLeft, X 
} from "lucide-react";
import Link from "next/link";

export default function OnboardingClient({ teacher }: { teacher: any }) {
    const [step, setStep] = useState(1);
    const [baseUrl, setBaseUrl] = useState("");

    // Get the actual domain for the QR code
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(window.location.origin);
        }
    }, []);

    // Steps Data
    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    // Navigation Handlers
    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="w-full max-w-lg relative bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl shadow-purple-500/10 border border-zinc-200 dark:border-white/5">
            
            {/* 1. Header & Progress */}
            <div className="mb-8 text-center">
                <div className="flex justify-between items-center mb-6">
                    {step > 1 ? (
                        <button onClick={prevStep} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                            <ArrowLeft size={20} />
                        </button>
                    ) : (
                        <Link href={`/studio/${teacher.username}`} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500">
                            <X size={20} />
                        </Link>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        Step {step} of {totalSteps}
                    </span>
                    <div className="w-9" /> {/* Spacer for centering */}
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                    />
                </div>
            </div>

            {/* 2. The Wizard Cards (Slider) */}
            <div className="relative overflow-hidden min-h-[420px]">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: SCAN */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-blue-500/10">
                                <QrCode size={40} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter">Scan to Start</h1>
                            <p className="text-zinc-500 font-medium px-4 text-sm leading-relaxed">
                                Ask the parent to scan this code with their phone camera to open the signup page.
                            </p>
                            
                            {/* QR Code Generated via API */}
                            <div className="p-4 bg-white rounded-3xl shadow-xl border border-zinc-100">
                                {baseUrl ? (
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${baseUrl}/students`}
                                        alt="Student Signup QR"
                                        className="w-40 h-40 rounded-xl" 
                                    />
                                ) : (
                                    <div className="w-40 h-40 bg-zinc-100 animate-pulse rounded-xl" />
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">or visit {baseUrl ? baseUrl.replace('https://', '') : '...'}/students</p>
                        </motion.div>
                    )}

                    {/* STEP 2: SETUP */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-purple-500/10">
                                <Smartphone size={40} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter">Create Profile</h1>
                            <p className="text-zinc-500 font-medium px-4 text-sm leading-relaxed">
                                Guide them to fill out their name and password. 
                                <br/><span className="text-foreground font-bold">Important:</span> They must enter this exact handle:
                            </p>

                            <div className="w-full max-w-xs bg-zinc-50 dark:bg-black/40 p-6 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Your Studio Handle</p>
                                <div className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 select-all">
                                    {teacher.username}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-4">
                                <ShieldCheck size={14} className="text-green-500" />
                                Secure & Private Registration
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: TRY IT */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-pink-100 dark:bg-pink-900/20 text-pink-600 rounded-3xl flex items-center justify-center mb-2 shadow-lg shadow-pink-500/10">
                                <Mic size={40} />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter">Try Practice Mode</h1>
                            <p className="text-zinc-500 font-medium px-4 text-sm leading-relaxed">
                                They are in! Ask the student to press the <span className="font-bold text-foreground">"Practice Mode"</span> button on their new profile.
                            </p>

                            <ul className="text-left space-y-3 bg-zinc-50 dark:bg-black/20 p-6 rounded-3xl border border-zinc-100 dark:border-white/5 shadow-sm w-full max-w-xs">
                                <li className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-6 h-6 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs shrink-0">1</div>
                                    Tap the Lock Icon
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs shrink-0">2</div>
                                    Enter new passcode
                                </li>
                                <li className="flex items-center gap-3 text-sm font-bold">
                                    <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs shrink-0">3</div>
                                    Record a 5s test clip
                                </li>
                            </ul>
                        </motion.div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -50, opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center text-center space-y-6 justify-center pb-12"
                        >
                            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-green-500/20 animate-bounce">
                                <CheckCircle2 size={48} />
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter">All Set!</h1>
                            <p className="text-zinc-500 font-medium px-4 max-w-xs text-sm leading-relaxed mb-6">
                                The student is now connected. Return to your roster to see the celebration!
                            </p>
                            
                            <Link 
                                href={`/studio/${teacher.username}`}
                                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full shadow-xl shadow-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-black uppercase tracking-widest text-xs"
                            >
                                Finish & Return
                            </Link>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* 3. Bottom Action Button (Only for Steps 1-3) */}
            {step < 4 && (
                <div className="pt-4">
                    <button 
                        onClick={nextStep}
                        className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        Next Step <ChevronRight size={14} />
                    </button>
                </div>
            )}

        </div>
    );
}