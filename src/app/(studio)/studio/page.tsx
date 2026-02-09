"use client";

import { useState } from 'react';
import { loginTeacher, signupTeacher, requestPasswordReset } from '@/app/actions';
import {
    Loader2, ArrowRight, ArrowLeft, CheckCircle2,
    Mail, Lock, User, AtSign,
    LayoutDashboard, ShieldCheck
} from "lucide-react";

export default function StudioAuthPage() {
    const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resetSent, setResetSent] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

        try {
            if (mode === 'forgot') {
                const result = await requestPasswordReset(payload);
                if (result.error) {
                    setError(result.error);
                } else {
                    setResetSent(true);
                }
                setLoading(false);
                return;
            }

            let result;
            if (mode === 'signin') {
                result = await loginTeacher(payload);
            } else {
                result = await signupTeacher(payload);
            }

            if (result.error) {
                setError(result.error);
                setLoading(false);
            } else if (result.username) {
                // New users go to welcome survey, returning users go to dashboard
                if ('isNewUser' in result && result.isNewUser) {
                    window.location.href = `/studio/welcome`;
                } else {
                    window.location.href = `/studio/${result.username}`;
                }
            } else {
                setError("Account accessed, but studio handle is missing.");
                setLoading(false);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (mode === 'forgot') return 'Reset Password';
        if (mode === 'signin') return 'Welcome Back.';
        return 'Start Your Studio.';
    };

    const getSubtitle = () => {
        if (mode === 'forgot') return 'Enter your email and we\'ll send you a reset link.';
        if (mode === 'signin') return 'Log in to manage your students and content.';
        return 'Create your account to start building.';
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-black relative overflow-hidden">

            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-widest mb-6 border border-purple-200 dark:border-purple-800">
                        <LayoutDashboard size={14} /> Teacher Studio
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-foreground mb-2">
                        {getTitle()}
                    </h1>
                    <p className="text-zinc-500 font-medium">
                        {getSubtitle()}
                    </p>
                </div>

                {/* Toggle - Hide for forgot mode */}
                {mode !== 'forgot' && (
                    <div className="flex bg-white dark:bg-zinc-900 p-1 rounded-2xl mb-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
                        <button
                            onClick={() => { setMode('signin'); setError(null); }}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${mode === 'signin' ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode('signup'); setError(null); }}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${mode === 'signup' ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground shadow-sm' : 'text-zinc-400 hover:text-zinc-600'}`}
                        >
                            Sign Up
                        </button>
                    </div>
                )}

                {/* Back link for forgot mode */}
                {mode === 'forgot' && !resetSent && (
                    <button
                        onClick={() => { setMode('signin'); setError(null); setResetSent(false); }}
                        className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </button>
                )}

                {/* Reset Success Message */}
                {mode === 'forgot' && resetSent ? (
                    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3 className="text-xl font-black">Check Your Email</h3>
                        <p className="text-zinc-500 text-sm">
                            We&apos;ve sent a password reset link to <strong className="text-foreground">{formData.email}</strong>. Click the link in the email to reset your password.
                        </p>
                        <button
                            onClick={() => { setMode('signin'); setResetSent(false); setFormData({ ...formData, email: '' }); }}
                            className="text-sm font-bold text-purple-600 hover:text-purple-500 transition-colors"
                        >
                            Return to Sign In
                        </button>
                    </div>
                ) : (
                    /* Form */
                    <form onSubmit={handleSubmit} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl space-y-6">

                        {mode === 'signup' && (
                            <div className="space-y-6 animate-in slide-in-from-left-4 fade-in">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Jane Doe"
                                            className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Username/Slug */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Studio Handle</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                        <input
                                            required
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                            placeholder="piano-studio"
                                            className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all lowercase"
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-400 pl-4">Your URL: studiocard.live/studio/<span className="text-purple-500 font-bold">{formData.username || 'username'}</span></p>
                                </div>

                            </div>
                        )}

                        {/* Email Field - Always shown */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="teacher@example.com"
                                    className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field - Hidden for forgot mode */}
                        {mode !== 'forgot' && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        required
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Forgot Password Link - Only on signin */}
                        {mode === 'signin' && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => { setMode('forgot'); setError(null); }}
                                    className="text-xs font-bold text-zinc-400 hover:text-purple-500 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold text-center animate-pulse">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-purple-500/20 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                mode === 'forgot' ? 'Send Reset Link' :
                                mode === 'signin' ? <>Log In <ArrowRight size={16} /></> :
                                <>Create Account <ShieldCheck size={16} /></>
                            )}
                        </button>

                    </form>
                )}

                {/* Footer Link */}
                <div className="text-center mt-8">
                    <a href="/students" className="text-xs font-bold text-zinc-400 hover:text-foreground transition-colors uppercase tracking-widest">
                        Are you a student?
                    </a>
                </div>

            </div>
        </main>
    );
}
