"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import {
  Sparkles, Heart, ArrowRight, Check,
  MapPin, Users, Radio, GraduationCap,
  Music, Loader2
} from "lucide-react";

export default function WelcomeSurveyPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teacher, setTeacher] = useState<{ id: string; full_name: string; username: string } | null>(null);
  const [answers, setAnswers] = useState({
    hearAboutUs: "",
    teachingExperience: "",
    studentCount: "",
    zipcode: "",
    instruments: [] as string[],
    goals: [] as string[]
  });

  useEffect(() => {
    const loadTeacher = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("teachers")
          .select("id, full_name, username")
          .eq("id", user.id)
          .single();
        if (data) setTeacher(data);
      }
    };
    loadTeacher();
  }, []);

  const firstName = teacher?.full_name?.split(" ")[0] || "there";

  const handleSubmit = async () => {
    if (!teacher) return;
    setLoading(true);

    const supabase = createClient();

    // Save survey responses to teacher record
    await supabase
      .from("teachers")
      .update({
        onboarding_completed: true,
        survey_data: answers
      })
      .eq("id", teacher.id);

    // Redirect to dashboard
    window.location.href = `/studio/${teacher.username}`;
  };

  const handleSkip = async () => {
    if (!teacher) return;
    setLoading(true);

    const supabase = createClient();
    await supabase
      .from("teachers")
      .update({ onboarding_completed: true })
      .eq("id", teacher.id);

    window.location.href = `/studio/${teacher.username}`;
  };

  const questions = [
    {
      id: "hearAboutUs",
      icon: Radio,
      title: "How did you hear about Studio.Card?",
      subtitle: "We'd love to know what brought you here!",
      options: [
        "Word of mouth",
        "Social media",
        "Google search",
        "Music teacher forum",
        "Conference/event",
        "Other"
      ],
      color: "from-purple-500 to-indigo-500"
    },
    {
      id: "teachingExperience",
      icon: GraduationCap,
      title: "How long have you been teaching?",
      subtitle: "No wrong answers—we welcome everyone.",
      options: [
        "Just starting out",
        "1-3 years",
        "4-10 years",
        "10+ years",
        "I teach at a school/institution"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: "studentCount",
      icon: Users,
      title: "How many students do you teach?",
      subtitle: "Roughly, at the moment.",
      options: [
        "1-5 students",
        "6-15 students",
        "16-30 students",
        "30+ students"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      id: "instruments",
      icon: Music,
      title: "What do you teach?",
      subtitle: "Select all that apply.",
      multi: true,
      options: [
        "Piano",
        "Guitar",
        "Violin/Viola",
        "Voice",
        "Drums/Percussion",
        "Woodwinds",
        "Brass",
        "Other"
      ],
      color: "from-pink-500 to-rose-500"
    },
    {
      id: "zipcode",
      icon: MapPin,
      title: "What's your zip code?",
      subtitle: "Helps us understand where our community is growing.",
      input: true,
      placeholder: "e.g., 90210",
      color: "from-amber-500 to-orange-500"
    }
  ];

  const currentQuestion = questions[step];
  const Icon = currentQuestion?.icon || Sparkles;
  const isLastStep = step === questions.length;

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-400 mb-2">
            <span>Getting to know you</span>
            <span>{step + 1} of {questions.length + 1}</span>
          </div>
          <div className="h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / (questions.length + 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Card */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
        >
          {isLastStep ? (
            // Final thank you screen
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Heart size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-3">
                Thanks, {firstName}!
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed max-w-sm mx-auto">
                Your feedback helps us build something special for music teachers like you. We're genuinely grateful you're here.
              </p>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : (
                  <>Enter My Studio <Sparkles size={16} /></>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Question header */}
              <div className={`h-32 bg-gradient-to-br ${currentQuestion.color} flex items-center justify-center`}>
                <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon size={32} className="text-white" />
                </div>
              </div>

              {/* Question content */}
              <div className="p-8">
                <h2 className="text-xl font-black tracking-tight mb-2">
                  {currentQuestion.title}
                </h2>
                <p className="text-sm text-zinc-500 mb-6">
                  {currentQuestion.subtitle}
                </p>

                {/* Input field */}
                {currentQuestion.input ? (
                  <input
                    type="text"
                    placeholder={currentQuestion.placeholder}
                    value={answers[currentQuestion.id as keyof typeof answers] as string}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  />
                ) : (
                  /* Options */
                  <div className="space-y-2">
                    {currentQuestion.options?.map((option) => {
                      const isMulti = currentQuestion.multi;
                      const currentValue = answers[currentQuestion.id as keyof typeof answers];
                      const isSelected = isMulti
                        ? (currentValue as string[]).includes(option)
                        : currentValue === option;

                      return (
                        <button
                          key={option}
                          onClick={() => {
                            if (isMulti) {
                              const arr = currentValue as string[];
                              if (arr.includes(option)) {
                                setAnswers({ ...answers, [currentQuestion.id]: arr.filter(o => o !== option) });
                              } else {
                                setAnswers({ ...answers, [currentQuestion.id]: [...arr, option] });
                              }
                            } else {
                              setAnswers({ ...answers, [currentQuestion.id]: option });
                            }
                          }}
                          className={`w-full p-4 rounded-xl text-left font-bold text-sm transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-500"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-2 border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                          }`}
                        >
                          {option}
                          {isSelected && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(Math.max(0, step - 1))}
                    className={`text-sm font-bold text-zinc-400 hover:text-zinc-600 transition-colors ${step === 0 ? 'invisible' : ''}`}
                  >
                    Back
                  </button>

                  <button
                    onClick={() => setStep(step + 1)}
                    className={`px-6 py-3 rounded-xl bg-gradient-to-r ${currentQuestion.color} text-white font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-2`}
                  >
                    {currentQuestion.multi
                      ? (answers[currentQuestion.id as keyof typeof answers] as string[]).length > 0 ? "Continue" : "Skip"
                      : answers[currentQuestion.id as keyof typeof answers] ? "Continue" : "Skip"
                    }
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Skip all */}
        {!isLastStep && (
          <div className="text-center mt-6">
            <button
              onClick={handleSkip}
              disabled={loading}
              className="text-xs font-bold text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              {loading ? "Loading..." : "Skip all & go to dashboard"}
            </button>
          </div>
        )}

        {/* Trust message */}
        <p className="text-center text-xs text-zinc-400 mt-8 max-w-sm mx-auto">
          We collect this info to improve Studio.Card for teachers like you. Your data is never sold and is always private.
        </p>
      </div>
    </main>
  );
}
