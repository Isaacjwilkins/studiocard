"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, ChevronUp, ExternalLink, Clock, MapPin, Calendar } from "lucide-react";
import RecitalBackgrounds from "@/components/RecitalBackgrounds";

interface Performer {
  id: string;
  performer_name: string;
  performer_image_url: string | null;
  performer_bio: string | null;
  performer_card_slug: string | null;
  piece_title: string;
  composer: string | null;
  instrument: string | null;
  estimated_duration_minutes: number | null;
  is_intermission: boolean;
}

interface Recital {
  id: string;
  title: string;
  event_date: string | null;
  venue: string | null;
  custom_note: string | null;
  background_type: string;
  color_theme: string;
  recital_performers: Performer[];
}

interface Teacher {
  full_name: string;
  username: string;
}

export default function RecitalProgram({
  recital,
  teacher,
  sameInstrument,
  canCalculateStartTimes
}: {
  recital: Recital;
  teacher: Teacher;
  sameInstrument: string | null;
  canCalculateStartTimes: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Calculate start times if possible
  const getStartTimes = () => {
    if (!canCalculateStartTimes || !recital.event_date) return {};

    const times: Record<string, Date> = {};
    let currentTime = new Date(recital.event_date);

    recital.recital_performers.forEach((performer) => {
      times[performer.id] = new Date(currentTime);
      if (performer.estimated_duration_minutes) {
        currentTime = new Date(currentTime.getTime() + performer.estimated_duration_minutes * 60000);
      }
    });

    return times;
  };

  const startTimes = getStartTimes();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <RecitalBackgrounds type={recital.background_type} color={recital.color_theme} />

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            {recital.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
            {teacher.full_name}&apos;s Studio
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-zinc-500 mb-4">
            {recital.event_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDateTime(recital.event_date)}
              </span>
            )}
            {recital.venue && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {recital.venue}
              </span>
            )}
          </div>

          {sameInstrument && (
            <p className="text-sm text-zinc-500">
              {sameInstrument} Recital
            </p>
          )}

          {recital.custom_note && (
            <p className="mt-6 text-zinc-600 dark:text-zinc-400 italic max-w-md mx-auto">
              &ldquo;{recital.custom_note}&rdquo;
            </p>
          )}
        </motion.header>

        {/* Program */}
        <div className="space-y-3">
          {recital.recital_performers.map((performer, index) => (
            <motion.div
              key={performer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {performer.is_intermission ? (
                <div className="py-6 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-16 bg-zinc-300 dark:bg-zinc-700" />
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
                      Intermission
                    </span>
                    <div className="h-px w-16 bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                </div>
              ) : (
                <div
                  className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden cursor-pointer transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
                  onClick={() => setExpandedId(expandedId === performer.id ? null : performer.id)}
                >
                  {/* Collapsed View */}
                  <div className="p-4 flex items-center gap-4">
                    {performer.performer_image_url ? (
                      <img
                        src={performer.performer_image_url}
                        alt={performer.performer_name}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: recital.color_theme + "20" }}
                      >
                        <span
                          className="text-lg font-bold"
                          style={{ color: recital.color_theme }}
                        >
                          {performer.performer_name.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{performer.performer_name}</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                        {performer.piece_title}
                        {performer.composer && (
                          <span className="text-zinc-400 dark:text-zinc-500">
                            {" "}&bull; {performer.composer}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {!sameInstrument && performer.instrument && (
                        <span className="text-xs text-zinc-500 hidden sm:block">
                          {performer.instrument}
                        </span>
                      )}
                      {startTimes[performer.id] && (
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Clock size={12} />
                          {formatTime(startTimes[performer.id])}
                        </span>
                      )}
                      {expandedId === performer.id ? (
                        <ChevronUp size={18} className="text-zinc-400" />
                      ) : (
                        <ChevronDown size={18} className="text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {expandedId === performer.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                          <div className="flex flex-col sm:flex-row gap-4">
                            {performer.performer_image_url && (
                              <img
                                src={performer.performer_image_url}
                                alt={performer.performer_name}
                                className="w-24 h-24 rounded-xl object-cover mx-auto sm:mx-0"
                              />
                            )}
                            <div className="flex-1 text-center sm:text-left">
                              <h3 className="font-bold text-lg mb-1">
                                {performer.performer_name}
                              </h3>
                              {performer.performer_bio && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                                  {performer.performer_bio}
                                </p>
                              )}
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">{performer.piece_title}</span>
                                  {performer.composer && (
                                    <span className="text-zinc-500">
                                      {" "}by {performer.composer}
                                    </span>
                                  )}
                                </p>
                                {performer.instrument && (
                                  <p className="text-zinc-500">{performer.instrument}</p>
                                )}
                                {performer.estimated_duration_minutes && (
                                  <p className="text-zinc-500">
                                    ~{performer.estimated_duration_minutes} minutes
                                  </p>
                                )}
                                {startTimes[performer.id] && (
                                  <p className="text-zinc-500">
                                    Estimated start: {formatTime(startTimes[performer.id])}
                                  </p>
                                )}
                              </div>
                              {performer.performer_card_slug && (
                                <Link
                                  href={`/${performer.performer_card_slug}`}
                                  className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium hover:underline"
                                  style={{ color: recital.color_theme }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  View {performer.performer_name.split(" ")[0]}&apos;s Card
                                  <ExternalLink size={14} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            Created with
            <span className="font-bold">studio<span style={{ color: recital.color_theme }}>.</span>card</span>
          </Link>
        </motion.footer>
      </div>
    </div>
  );
}
