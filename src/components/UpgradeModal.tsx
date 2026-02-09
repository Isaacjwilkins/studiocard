"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, Users, Inbox, Zap, Loader2 } from "lucide-react";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to start checkout');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Upgrade error:', error);
            alert('Something went wrong. Please try again.');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden"
            >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-amber-500/5 pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
                >
                    <X size={20} className="text-zinc-400" />
                </button>

                {/* Content */}
                <div className="relative p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 mb-4">
                            <Sparkles size={32} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">
                            Unlock Unlimited Students
                        </h2>
                        <p className="text-zinc-500 mt-2">
                            You&apos;ve reached your free tier limit of 3 students.
                        </p>
                    </div>

                    {/* Price */}
                    <div className="text-center py-4">
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black">$29</span>
                            <span className="text-zinc-500 font-bold">/month</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 uppercase tracking-widest font-bold">
                            Studio Plan
                        </p>
                    </div>

                    {/* Benefits */}
                    <ul className="space-y-3">
                        {[
                            { icon: Users, text: "Unlimited Students", highlight: true },
                            { icon: Inbox, text: "Inbox: See all new recordings" },
                            { icon: Zap, text: "Priority Support" }
                        ].map((benefit, i) => (
                            <li
                                key={i}
                                className={`flex items-center gap-3 p-3 rounded-xl ${
                                    benefit.highlight
                                        ? 'bg-amber-500/10 border border-amber-500/20'
                                        : 'bg-zinc-100 dark:bg-zinc-800'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    benefit.highlight
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-zinc-200 dark:bg-zinc-700'
                                }`}>
                                    <benefit.icon size={16} />
                                </div>
                                <span className="font-bold text-sm">{benefit.text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/25 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                Upgrade Now
                                <Sparkles size={16} />
                            </>
                        )}
                    </button>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-zinc-400 uppercase tracking-widest">
                        Cancel anytime. No contracts.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
