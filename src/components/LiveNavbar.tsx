"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, ChevronDown, ExternalLink } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Updated Main Links (Visible on Desktop)
  const mainLinks = [
    { name: "Locations", href: "/live/locations" },
    { name: "Pricing", href: "/live/pricing" },
  ];

  // Updated Hamburger/More Links
  const moreLinks = [
    { name: "Studio", href: "/live/studio" },
    { name: "Connect", href: "/live/connect" },
    { name: "studio.card", href: "https://studiocard.live", external: true }, // Kept Learn here as it fits the "App" side
  ];

  const getDesktopLinkClasses = (isActive: boolean) => `
    relative text-[10px] font-black uppercase tracking-[0.3em] transition-all
    ${isActive ? "text-foreground" : "text-zinc-500 hover:text-foreground"}
  `;

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO with SHIMMERING LIVE */}
          <a href="/" className="group hover:opacity-80 transition-opacity flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-foreground">
              studio<span className="text-emerald-500/80 dark:text-emerald-400">.</span>card
            </h1>
            
            {/* Shimmering LIVE Badge */}
            <div className="relative overflow-hidden px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">
              <span className="relative z-10 text-[8px] font-black tracking-widest text-green-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> LIVE
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -translate-x-full animate-shimmer" />
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            
            {/* HOME LINK */}
            <a href="/live" className={getDesktopLinkClasses(pathname === "/")}>
              Home
            </a>

            {/* MAIN LINKS (Locations, Pricing) */}
            {mainLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={getDesktopLinkClasses(isActive)}>
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* MORE DROPDOWN (Studio, Music, Connect) */}
            <div
              className="relative"
              onMouseEnter={() => setIsMoreOpen(true)}
              onMouseLeave={() => setIsMoreOpen(false)}
            >
              <button 
                className={`${getDesktopLinkClasses(
                  moreLinks.some(link => pathname.startsWith(link.href))
                )} flex items-center gap-1`}
              >
                More <ChevronDown size={10} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden p-2 flex flex-col gap-1"
                  >
                    {moreLinks.map((link) => (
                      link.external ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-between px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors
                            ${link.name === "Studio Live"
                              ? "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                              : "text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900"
                            }`}
                        >
                          {link.name} <ExternalLink size={10} />
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`block px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-colors ${pathname === link.href ? 'bg-zinc-100 dark:bg-zinc-900 text-foreground' : 'text-zinc-500 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-900'}`}
                        >
                          {link.name}
                        </Link>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-2 pl-4 border-l border-white/10 text-zinc-500 hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-5">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-zinc-500 hover:text-foreground">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="relative z-50 w-6 h-6 flex flex-col justify-center gap-1.5">
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-8 overflow-y-auto pb-10">
              <div className="flex flex-col gap-6">
                
                {/* MOBILE HOME */}
                <a href="/" onClick={() => setIsOpen(false)} className={`text-4xl font-black tracking-tighter ${pathname === "/" ? "text-foreground" : "text-zinc-400"}`}>
                  Home
                </a>

                {/* MOBILE MAIN LINKS */}
                {mainLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`text-4xl font-black tracking-tighter ${pathname === link.href ? "text-foreground" : "text-zinc-400"}`}>
                    {link.name}
                  </Link>
                ))}

                <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 my-2" />

                {/* MOBILE MORE LINKS */}
                {moreLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={`text-2xl font-bold tracking-tight ${pathname === link.href ? "text-foreground" : "text-zinc-500"}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shimmer Animation Style */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </nav>
  );
}