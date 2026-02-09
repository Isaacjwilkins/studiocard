import Link from 'next/link';
import { Instagram, Youtube, Music2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto">
      {/* Outer bar: Full width frosted bar */}
      <div className="w-full border-t border-white/20 dark:border-white/10 bg-white/60 dark:bg-black/80 backdrop-blur-xl py-6">

        {/* Inner Content: Centered */}
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-6">

          {/* Legal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/legal" className="hover:text-foreground transition-colors">
              Legal
            </Link>
            <Link href="/support" className="hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="hover:text-foreground transition-colors">
              FAQ
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-8">
            <a
              href="https://instagram.com/studiocard.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-foreground transition-all hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={2} />
            </a>
            <a
              href="https://youtube.com/@studiocard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-foreground transition-all hover:scale-110"
              aria-label="YouTube"
            >
              <Youtube size={16} strokeWidth={2} />
            </a>
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-foreground transition-all hover:scale-110"
              aria-label="Spotify"
            >
              <Music2 size={16} strokeWidth={2} />
            </a>
          </div>

          {/* Copyright */}
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-zinc-400 dark:text-zinc-500 opacity-70">
            &copy; {new Date().getFullYear()} studio<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-400">.</span>card
          </span>

        </div>
      </div>
    </footer>
  );
}
