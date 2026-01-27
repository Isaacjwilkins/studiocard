"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';

interface SongCardProps {
  song: {
    title: string;
    description: string;
    long_description?: string;
    release_date?: string;
    image_gallery?: string[]; // Supabase Array Column
    mood_tags?: string[];
    youtube_url?: string;
  };
  defaultExpanded?: boolean;
}

export default function SongCard({ song, defaultExpanded = false }: SongCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // We take the first image from the gallery array for the card cover
  const featuredImage = song.image_gallery && song.image_gallery.length > 0 
    ? song.image_gallery[0] 
    : null;

  const cinematicTransition = {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1]
  };

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl transition-all hover:bg-white/60 dark:hover:bg-black/60 shadow-xl cursor-pointer"
    >
      <div className="flex flex-col md:block">
        
        {/* IMAGE SECTION 
            - Mobile: Visible top banner
            - Desktop: Floated to the right 30%
        */}
        {featuredImage && (
          <div className="relative h-56 w-full overflow-hidden md:absolute md:right-0 md:top-0 md:bottom-0 md:h-full md:w-[30%] md:z-0">
            <motion.img
              layout
              src={featuredImage}
              alt={song.title}
              className="h-full w-full object-cover object-center transition-transform duration-1000 group-hover:scale-110"
            />
            {/* Multi-directional Gradients for mobile vs desktop */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/80 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-white/40 md:dark:via-black/40 md:to-white/80 md:dark:to-black/80 md:w-full" />
          </div>
        )}

        {/* CONTENT SECTION */}
        <motion.div 
          layout 
          className="relative z-10 p-6 md:p-10 md:pr-[35%]"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40 block mb-2">
            {song.mood_tags?.join(' • ') || "Original Work"}
          </span>
          
          <h4 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {song.title}
          </h4>

          <div className="flex items-center gap-2 mt-1 mb-4 md:mb-6 opacity-40">
            <Calendar size={10} strokeWidth={3} />
            <span className="text-[9px] font-bold uppercase tracking-widest">
              {song.release_date ? new Date(song.release_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recent"}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {!isExpanded && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="text-zinc-700 dark:text-zinc-400 max-w-lg leading-relaxed text-base md:text-lg"
              >
                {song.description}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={cinematicTransition}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-6">
                  <div className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed text-base md:text-lg max-w-xl">
                    {song.long_description || song.description}
                  </div>

                  {/* YouTube Link */}
                  {song.youtube_url && (
                    <div className="pt-2">
                      <a 
                        href={song.youtube_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()} 
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background dark:bg-white dark:text-black transition-all hover:scale-105 shadow-lg"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Listen Now</span>
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}