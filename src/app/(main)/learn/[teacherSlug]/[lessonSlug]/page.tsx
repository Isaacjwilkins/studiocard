"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { 
  Play, Pause, ArrowLeft, CheckCircle2, Lock, X, Loader2, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonPage() {
  const router = useRouter();
  const { teacherSlug, lessonSlug } = useParams();
  
  // Data
  const [lesson, setLesson] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State
  const [completedAudioIds, setCompletedAudioIds] = useState<Set<string>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Audio Player
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0-100 for slider
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Auth Inputs
  const [handle, setHandle] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // --- DYNAMIC INSTRUCTIONS LOGIC ---
  const getInstructions = () => {
    const total = tracks.length;
    const completed = completedAudioIds.size;
    
    if (completed === 0) return "Let's get started. Tap the first clip below to hear the basics.";
    if (completed < total) return `Great work! You've finished ${completed} of ${total}. Keep going!`;
    return "You're a natural! You've finished the lesson. Tap 'Complete' below to save your progress.";
  };

  useEffect(() => {
    if (!lessonSlug) return;
    const fetchData = async () => {
      // 1. Get Lesson
      const { data: lessonData } = await supabase
        .from('lessons')
        .select(`*, teacher_cards!inner(*)`)
        .eq('slug', lessonSlug)
        .eq('teacher_cards.slug', teacherSlug)
        .single();
      
      if (!lessonData) return;
      setLesson(lessonData);

      // 2. Get Audios
      const { data: audioData } = await supabase
        .from('lesson_audios')
        .select('*')
        .eq('lesson_id', lessonData.id)
        .order('sort_order');
      setTracks(audioData || []);

      // 3. Check Local Storage
      const storedId = localStorage.getItem('sc_student_id');
      if (storedId) {
        const { data: progress } = await supabase.from('student_progress').select('*').eq('artist_id', storedId).eq('lesson_id', lessonData.id).single();
        if (progress && audioData) setCompletedAudioIds(new Set(audioData.map((t: any) => t.id)));
      }
      setLoading(false);
    };
    fetchData();
  }, [lessonSlug, teacherSlug]);

  // Audio Handlers
  const toggleAudio = (id: string) => {
    const audio = audioRefs.current[id];
    if (playingTrackId === id) {
      audio?.pause();
      setPlayingTrackId(null);
    } else {
      if (playingTrackId) audioRefs.current[playingTrackId]?.pause();
      audio?.play();
      setPlayingTrackId(id);
    }
  };

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLAudioElement>, id: string) => {
    if (id !== playingTrackId) return;
    const audio = e.currentTarget;
    if (audio.duration) {
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const val = parseFloat(e.target.value);
    const audio = audioRefs.current[id];
    if (audio && audio.duration) {
       audio.currentTime = (val / 100) * audio.duration;
       setProgress(val);
    }
  };

  const handleEnded = (id: string) => {
    setPlayingTrackId(null);
    setProgress(0);
    setCompletedAudioIds(prev => new Set(prev).add(id));
  };

  // Auth & Complete
  const handleCompleteClick = () => {
    const storedId = localStorage.getItem('sc_student_id');
    if (storedId) submitProgress(storedId);
    else setShowLoginModal(true);
  };

  const handleLoginAndSubmit = async () => {
    setIsVerifying(true);
    setAuthError("");
    const cleanHandle = handle.replace('@', '').toLowerCase();
    const { data: artist } = await supabase.from('artists').select('id, passcode').eq('slug', cleanHandle).single();

    if (!artist || artist.passcode !== passcode) {
      setAuthError("Incorrect Handle or Passcode");
      setIsVerifying(false);
      return;
    }
    localStorage.setItem('sc_student_id', artist.id);
    setShowLoginModal(false);
    await submitProgress(artist.id);
  };

  const submitProgress = async (artistId: string) => {
    await supabase.from('student_progress').insert({ artist_id: artistId, lesson_id: lesson.id });
    router.push(`/learn/${teacherSlug}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;

  const allFinished = tracks.length > 0 && completedAudioIds.size === tracks.length;
  const themeColor = lesson?.teacher_cards?.theme_color || '#3b82f6';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      {/* Back Button */}
      <button onClick={() => router.back()} className="fixed top-6 left-6 z-40 p-3 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform">
        <ArrowLeft size={18} />
      </button>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight">Student Login</h3>
                <button onClick={() => setShowLoginModal(false)}><X size={20} className="opacity-50 hover:opacity-100" /></button>
              </div>
              <div className="space-y-4">
                <input placeholder="@leo-piano" value={handle} onChange={(e) => setHandle(e.target.value)} className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold outline-none" />
                <input type="password" placeholder="1234" value={passcode} onChange={(e) => setPasscode(e.target.value)} className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold tracking-[0.3em] outline-none" />
                {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
                <button onClick={handleLoginAndSubmit} disabled={isVerifying} className="w-full py-4 bg-foreground text-background font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2">
                  {isVerifying ? <Loader2 className="animate-spin" /> : "Verify & Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MAIN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md bg-white/60 dark:bg-black/60 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white/20 overflow-hidden"
      >
        {/* Purple Illusion */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div 
             className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full blur-[80px] opacity-30 animate-pulse" 
             style={{ backgroundColor: themeColor }} 
           />
        </div>

        <div className="relative z-10 text-center mb-8 mt-4">
          <span className="inline-block px-3 py-1 rounded-full bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">
            {lesson.teacher_cards.title}
          </span>
          <h1 className="text-3xl font-black tracking-tighter leading-none mb-4">{lesson.title}</h1>
          
          {/* Dynamic Instructions Panel */}
          <motion.div 
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="bg-white/40 dark:bg-zinc-800/40 backdrop-blur-md rounded-2xl p-4 border border-white/10"
          >
             <div className="flex items-start gap-3 text-left">
                <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <motion.p 
                   key={completedAudioIds.size} // Trigger animation on change
                   initial={{ opacity: 0, y: 5 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-sm font-medium text-foreground/80 leading-relaxed"
                >
                  {getInstructions()}
                </motion.p>
             </div>
          </motion.div>

        </div>

        <div className="space-y-3 mb-8 relative z-10">
          {tracks.map((track, i) => {
            const isPlaying = playingTrackId === track.id;
            const isDone = completedAudioIds.has(track.id);

            return (
              <div 
                key={track.id}
                className={`relative p-4 rounded-2xl transition-all duration-300 ${
                  isPlaying ? 'bg-white/80 dark:bg-zinc-800/80 shadow-xl scale-[1.02]' : 
                  isDone ? 'bg-green-500/10 border border-green-500/20' : 
                  'bg-white/20 dark:bg-white/5 border border-white/10 hover:bg-white/30'
                }`}
              >
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => toggleAudio(track.id)}
                     className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                       isPlaying ? 'bg-foreground text-background' : 'bg-white dark:bg-zinc-700'
                     }`}
                   >
                     {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                   </button>
                   
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-sm truncate">{track.title}</h4>
                     
                     {/* SCRUBBER (Only visible when playing) */}
                     {isPlaying ? (
                        <div className="flex items-center gap-2 mt-1 animate-in fade-in">
                           <input 
                             type="range" 
                             min="0" max="100" step="0.1"
                             value={progress}
                             onChange={(e) => handleSeek(e, track.id)}
                             className="w-full h-1 bg-zinc-300 rounded-full appearance-none accent-foreground cursor-pointer"
                           />
                        </div>
                     ) : (
                        <p className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-green-600' : 'opacity-40'}`}>
                          {isDone ? "Completed" : `Audio ${i + 1}`}
                        </p>
                     )}
                   </div>
                   
                   {isDone && !isPlaying && <CheckCircle2 size={18} className="text-green-500" />}
                </div>

                <audio 
                   ref={el => { audioRefs.current[track.id] = el }} 
                   src={track.audio_url} 
                   onTimeUpdate={(e) => handleTimeUpdate(e, track.id)}
                   onEnded={() => handleEnded(track.id)} 
                />
              </div>
            );
          })}
        </div>

        <button
          onClick={handleCompleteClick}
          disabled={!allFinished}
          className={`relative w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all overflow-hidden group ${
            allFinished 
              ? 'bg-foreground text-background shadow-lg hover:scale-[1.02]' 
              : 'bg-black/10 dark:bg-white/10 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {allFinished && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {allFinished ? <><CheckCircle2 size={16} /> Complete Lesson</> : <><Lock size={16} /> Locked</>}
          </span>
        </button>

      </motion.div>

      <style jsx global>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}</style>
    </div>
  );
}