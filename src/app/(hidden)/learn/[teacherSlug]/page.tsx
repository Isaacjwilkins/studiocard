"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  ArrowLeft, Play, CheckCircle2, Lock, 
  User, ChevronRight, LogOut, Loader2, X, Sparkles, Crown 
} from 'lucide-react';

export default function MotherCardPage() {
  const { teacherSlug } = useParams();
  
  // Content Data
  const [card, setCard] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // User Data
  const [student, setStudent] = useState<any>(null);
  const [progressSet, setProgressSet] = useState<Set<string>>(new Set());
  
  // Login Modal State
  const [showLogin, setShowLogin] = useState(false);
  const [handle, setHandle] = useState("");
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    const fetchData = async () => {
      // A. Get Card & Lessons
      const { data: cardData } = await supabase.from('teacher_cards').select('*').eq('slug', teacherSlug).single();
      if (!cardData) return;
      setCard(cardData);

      const { data: lessonData } = await supabase.from('lessons').select('*').eq('card_id', cardData.id).order('sort_order');
      setLessons(lessonData || []);

      // B. Check Login
      const storedId = localStorage.getItem('sc_student_id');
      if (storedId) {
        await fetchStudentData(storedId);
      }
      setLoading(false);
    };

    fetchData();
  }, [teacherSlug]);

  // 2. Fetch Student Profile & Progress
  const fetchStudentData = async (artistId: string) => {
    const { data: artist } = await supabase.from('artists').select('*').eq('id', artistId).single();
    if (artist) setStudent(artist);

    const { data: progressData } = await supabase.from('student_progress').select('lesson_id').eq('artist_id', artistId);
    const completedIds = new Set(progressData?.map((p: any) => p.lesson_id));
    setProgressSet(completedIds);
  };

  // 3. Login Action
  const handleLogin = async () => {
    setIsVerifying(true);
    setAuthError("");
    
    const cleanHandle = handle.replace('@', '').toLowerCase().trim();
    
    const { data: artist } = await supabase
      .from('artists')
      .select('id, passcode')
      .eq('slug', cleanHandle)
      .single();

    if (!artist || artist.passcode !== passcode) {
      setAuthError("Incorrect Handle or Passcode");
      setIsVerifying(false);
      return;
    }

    localStorage.setItem('sc_student_id', artist.id);
    await fetchStudentData(artist.id);
    setShowLogin(false);
    setIsVerifying(false);
  };

  // 4. Logout Action
  const handleLogout = () => {
    localStorage.removeItem('sc_student_id');
    setStudent(null);
    setProgressSet(new Set()); 
  };

  // Colors Helper
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-400">Loading...</div>;
  if (!card) return <div className="min-h-screen flex items-center justify-center">Card not found</div>;

  return (
    <div className="min-h-screen relative flex flex-col items-center p-4 md:p-8 pt-40 md:pt-48 overflow-hidden">
      
      {/* Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div 
           className="absolute -top-[20%] right-[10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40 animate-pulse" 
           style={{ backgroundColor: card.theme_color }} 
         />
      </div>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-black tracking-tight">Student Login</h3>
                <button onClick={() => setShowLogin(false)}><X size={20} className="opacity-50 hover:opacity-100" /></button>
              </div>
              <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 block">Handle</label>
                   <input 
                     placeholder="@leo-test" 
                     value={handle} 
                     onChange={(e) => setHandle(e.target.value)} 
                     className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold outline-none" 
                   />
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 block">Passcode</label>
                   <input 
                     type="password" 
                     placeholder="1234" 
                     value={passcode} 
                     onChange={(e) => setPasscode(e.target.value)} 
                     className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold tracking-[0.3em] outline-none" 
                   />
                </div>
                {authError && <p className="text-red-500 text-xs font-bold text-center">{authError}</p>}
                <button 
                  onClick={handleLogin} 
                  disabled={isVerifying} 
                  className="w-full py-4 bg-foreground text-background font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : "Login"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOTHER CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white/40 dark:bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden"
        style={{ boxShadow: `0 25px 50px -12px ${hexToRgba(card.theme_color, 0.15)}` }}
      >
        {/* HEADER AREA */}
        <div className="relative h-48 w-full overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 dark:to-black/60 z-10" />
           <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundColor: card.theme_color }} />
           {card.image_url && <img src={card.image_url} alt="Header" className="w-full h-full object-cover" />}
           
           {/* -- LEFT CONTROL: BACK -- */}
           <div className="absolute top-5 left-5 z-30">
             <Link 
                href="/learn" 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 hover:scale-105 transition-transform text-white"
             >
               <ArrowLeft size={18} />
             </Link>
           </div>

           {/* -- RIGHT CONTROL: USER/LOGIN -- */}
           <div className="absolute top-5 right-5 z-30">
             {student ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white">
                    <User size={14} className="opacity-80" />
                    <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[80px]">
                      {student.full_name}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white hover:bg-red-500/40 transition-colors"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
             ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="px-5 py-2.5 rounded-full bg-foreground text-background font-black text-[10px] uppercase tracking-widest shadow-lg hover:scale-105 transition-transform"
                >
                  Login
                </button>
             )}
           </div>

           {/* TITLE */}
           <div className="absolute bottom-6 left-8 z-20">
              <span className="px-3 py-1 rounded-md bg-foreground/90 text-background text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block">
                Course
              </span>
              <h1 className="text-4xl font-black tracking-tight text-foreground">{card.title}</h1>
           </div>
        </div>

        {/* BODY AREA */}
        <div className="p-8 pt-4">
           {/* Welcome Message */}
           <div className="mb-8">
             {student ? (
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                  Welcome back, {student.full_name.split(' ')[0]}
                </div>
             ) : null}
             <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
               {card.description}
             </p>
           </div>

           <div className="space-y-3">
             <AnimatePresence>
               {lessons.map((lesson, i) => {
                 const isCompleted = progressSet.has(lesson.id);
                 const prevLesson = lessons[i - 1];
                 const isUnlocked = i === 0 || (prevLesson && progressSet.has(prevLesson.id));
                 
                 // PRO LOGIC:
                 const isPro = lesson.is_premium;
                 // If Pro, user MUST be logged in to unlock (even if it's their turn)
                 const canAccess = isUnlocked && (!isPro || (isPro && student));
                 
                 const isNext = canAccess && !isCompleted;

                 return (
                   <motion.div
                     key={lesson.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 * i }}
                   >
                     <div
                       onClick={() => {
                          if (canAccess) window.location.href = `/learn/${teacherSlug}/${lesson.slug}`;
                          else if (isPro && !student) setShowLogin(true); // Trigger login if they click a Pro item
                       }}
                       className={`group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                         isPro 
                           ? 'bg-amber-500/5 border-amber-500/30 dark:border-amber-500/20' // Base Pro Style
                           : 'bg-transparent border-transparent' // Base Normal Style
                       } ${
                         isNext 
                           ? isPro 
                              ? 'bg-amber-500/10 shadow-lg scale-[1.02] border-amber-500/50 z-10' // Active Pro
                              : 'bg-white/80 dark:bg-zinc-800/80 border-white/40 shadow-lg scale-[1.02] z-10' // Active Normal
                           : isCompleted
                             ? 'opacity-60 hover:opacity-100 hover:bg-white/10'
                             : 'opacity-40 cursor-not-allowed hover:opacity-60'
                       }`}
                     >
                       {/* Icon Box */}
                       <div 
                         className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-lg ${
                            isCompleted ? 'bg-green-500 text-white shadow-green-500/30' :
                            isNext 
                              ? isPro ? 'bg-amber-500 text-white shadow-amber-500/40' : 'text-white'
                              : isPro ? 'bg-amber-900/20 text-amber-500' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                         }`}
                         style={isNext && !isPro ? { backgroundColor: card.theme_color } : {}}
                       >
                         {isCompleted ? <CheckCircle2 size={20} /> : isNext ? <Play size={20} fill="currentColor" /> : <Lock size={18} />}
                       </div>

                       <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-2 mb-0.5">
                            {isPro && (
                              <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                <Crown size={10} fill="currentColor" /> Pro
                              </span>
                            )}
                            <span className={`text-[10px] font-bold uppercase tracking-wider opacity-50 ${isPro ? 'text-amber-600 dark:text-amber-400' : ''}`}>
                              Lesson {i + 1}
                            </span>
                         </div>
                         <h3 className={`text-sm font-bold truncate ${isNext ? 'text-foreground' : 'text-zinc-500'} ${isPro && isNext ? 'text-amber-700 dark:text-amber-200' : ''}`}>
                           {lesson.title}
                         </h3>
                       </div>
                       
                       {/* Right Side Icons */}
                       {canAccess ? (
                          <ChevronRight size={16} className="opacity-30 group-hover:translate-x-1 transition-transform" />
                       ) : isPro && !student ? (
                          <div className="px-3 py-1 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wide shadow-md">
                            Login
                          </div>
                       ) : null}

                     </div>
                   </motion.div>
                 );
               })}
             </AnimatePresence>
           </div>
        </div>
      </motion.div>
    </div>
  );
}