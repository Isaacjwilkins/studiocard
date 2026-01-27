import { Instagram, Youtube, Music2, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      {/* Outer bar: Full width frosted bar */}
      <div className="w-full border-t border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/80 backdrop-blur-xl py-4">
        
        {/* Inner Content: Centered and Tight */}
        <div className="flex flex-col items-center gap-4">
          
          {/* Icons: The Focal Point */}
          <div className="flex items-center gap-8">
            <a href="https://linkedin.com/in/isaacjwilkins" className="text-zinc-500 hover:text-foreground transition-all hover:scale-110" aria-label="LinkedIn">
              <Linkedin size={14} strokeWidth={2} />
            </a>
            <a href="https://linkedin.com/in/isaacjwilkins" className="text-zinc-500 hover:text-foreground transition-all hover:scale-110" aria-label="Instagram">
              <Instagram size={14} strokeWidth={2} />
            </a>
            <a href="https://linkedin.com/in/isaacjwilkins" className="text-zinc-500 hover:text-foreground transition-all hover:scale-110" aria-label="YouTube">
              <Youtube size={14} strokeWidth={2} />
            </a>
            <a href="https://linkedin.com/in/isaacjwilkins" className="text-zinc-500 hover:text-foreground transition-all hover:scale-110" aria-label="Spotify">
              <Music2 size={14} strokeWidth={2} />
            </a>
          </div>

          {/* Copyright: Subordinate and clean */}
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 opacity-70">
            &copy; 2026 Wilkins Studio
          </span>
          
        </div>
      </div>
    </footer>
  );
}