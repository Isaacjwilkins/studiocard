"use client";

import { useState } from 'react';
import { 
  Sparkles, Share2, Palette, Music, User, Lock, 
  ArrowRight, ArrowDown, AtSign, GraduationCap, Loader2 
} from "lucide-react";
import { loginStudent, signupStudent } from '@/app/actions'; // Import your actions

const COLORS = [
  { name: "Ocean", hex: "#3b82f6", class: "bg-blue-500" },
  { name: "Sky", hex: "#0ea5e9", class: "bg-sky-500" },
  { name: "Indigo", hex: "#6366f1", class: "bg-indigo-500" },
  { name: "Violet", hex: "#8b5cf6", class: "bg-violet-500" },
  { name: "Fuchsia", hex: "#d946ef", class: "bg-fuchsia-500" },
  { name: "Pink", hex: "#ec4899", class: "bg-pink-500" },
  { name: "Rose", hex: "#f43f5e", class: "bg-rose-500" },
  { name: "Crimson", hex: "#dc2626", class: "bg-red-600" },
  { name: "Sunset", hex: "#f97316", class: "bg-orange-500" },
  { name: "Amber", hex: "#f59e0b", class: "bg-amber-500" },
];

export default function StudentsPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  
  // New Gradient Class
  const ACCENT_GRADIENT = "bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500";
  const ACCENT_SHADOW = "shadow-purple-500/30 hover:shadow-purple-500/50";

  // Form State
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('color', selectedColor);

    let result;
    if (mode === 'signup') {
      result = await signupStudent(formData);
    } else {
      result = await loginStudent(formData);
    }

    setLoading(false);

    if (result.error) {
      alert(result.error);
    } else if (result.success) {
      // Redirect to their card
      window.location.href = `/${result.slug}`;
    }
  };

  const scrollToForm = () => {
    document.getElementById("auth-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      
      {/* HERO */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles size={14} /> For Students
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          Show off your <br />
          <span className={`text-transparent bg-clip-text ${ACCENT_GRADIENT}`}>Super Skills.</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Create your own Studio Card, upload your songs, and share them with the world.
        </p>

        <button
          onClick={scrollToForm}
          className={`group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${ACCENT_GRADIENT} ${ACCENT_SHADOW}`}
        >
          <span className="text-xl font-black uppercase tracking-widest text-white">GO</span>
          <ArrowDown className="text-white group-hover:translate-y-1 transition-transform" strokeWidth={3} size={20} />
        </button>
      </section>

      {/* AUTH SECTION */}
      <section id="auth-form" className="max-w-xl mx-auto pt-16 border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-8">
          <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full mb-6">
            <button onClick={() => setMode('signup')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${mode === 'signup' ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>Sign Up</button>
            <button onClick={() => setMode('login')} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${mode === 'login' ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>Log In</button>
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-4">
            {mode === 'signup' ? "Create Your Card" : "Welcome Back"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
          
          {mode === 'signup' && (
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Full Name</label>
               <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                 <input name="fullName" required placeholder="Leo Piano" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
               </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
              {mode === 'signup' ? 'Choose your URL' : 'Your URL'}
            </label>
            <div className="relative">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input name="slug" required placeholder="leo-piano" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all lowercase" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Passcode (4 Digits)</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input name="passcode" type="password" maxLength={4} required placeholder="1234" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Teacher Code (Optional)</label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                  <input name="teacherSlug" placeholder="Enter Teacher's Code" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all" />
                </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 flex items-center gap-2"><Palette size={12} /> Theme Color</label>
                 <div className="flex flex-wrap gap-3">
                   {COLORS.map((c) => (
                     <button type="button" key={c.hex} onClick={() => setSelectedColor(c.hex)} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${c.class} ${selectedColor === c.hex ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground/20' : 'border-transparent'}`} />
                   ))}
                 </div>
              </div>
            </>
          )}

          <button
            disabled={loading}
            className={`w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${ACCENT_GRADIENT} ${ACCENT_SHADOW}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : (mode === 'signup' ? "Create Account" : "Enter Studio")}
          </button>
        </form>
      </section>
    </main>
  );
}