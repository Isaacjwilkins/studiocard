"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Users, Inbox, Send, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherName: string;
  username: string;
}

export default function WelcomeModal({ isOpen, onClose, teacherName, username }: WelcomeModalProps) {
  const [step, setStep] = useState(0);

  const firstName = teacherName.split(" ")[0] || "there";

  const steps = [
    {
      icon: Sparkles,
      title: `Welcome, ${firstName}!`,
      description: "You've just created your studio. Let's get you set up in 60 seconds.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: Users,
      title: "Add Your First Student",
      description: "Click 'Onboard New Student' to create a profile card for your student. They'll get their own URL to share with family.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Inbox,
      title: "Your Inbox",
      description: "When students upload recordings, they appear in your Inbox. You can listen, mark as read, and track their progress.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Send,
      title: "Send Feedback",
      description: "Leave notes, assignments, or voice feedback for each student. They'll see it on their card.",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden"
          >
            {/* Header with gradient */}
            <div className={`relative h-40 bg-gradient-to-br ${currentStep.color} flex items-center justify-center`}>
              <motion.div
                key={step}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Icon size={40} className="text-white" />
              </motion.div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>

              {/* Step indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === step ? "w-6 bg-white" : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="text-2xl font-black tracking-tight mb-3">
                  {currentStep.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                  {currentStep.description}
                </p>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleNext}
                  className={`w-full py-4 rounded-xl bg-gradient-to-r ${currentStep.color} text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2`}
                >
                  {step === steps.length - 1 ? (
                    <>Get Started <Check size={16} /></>
                  ) : (
                    <>Next <ArrowRight size={16} /></>
                  )}
                </button>

                {step === steps.length - 1 && (
                  <p className="text-xs text-zinc-500">
                    Your studio URL:{" "}
                    <Link href={`/studio/${username}`} className="font-bold text-purple-500 hover:underline">
                      studiocard.live/studio/{username}
                    </Link>
                  </p>
                )}

                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
