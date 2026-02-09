"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, ChevronDown, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  // Slug input state
  const [slug, setSlug] = useState("");
  const [isSlugFocused, setIsSlugFocused] = useState(false);

  // --- SCROLL LOGIC ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isMobileOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isMobileOpen]);

  // Close desktop menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDesktopMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim()) return;
    const cleanSlug = slug.trim().toLowerCase();
    setSlug("");
    setIsMobileOpen(false);
    router.push(`/${cleanSlug}`);
  };

  const mainLinks = [
    { name: "Parents", href: "/parents" },
    { name: "Teachers", href: "/teachers" },
  ];

  const menuLinks = [
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
    { name: "Support", href: "/support" },
  ];

  const getDesktopLinkClasses = (isActive: boolean) => `
    relative text-[10px] font-black uppercase tracking-[0.3em] transition-all
    ${isActive ? "text-foreground" : "text-zinc-500 hover:text-foreground"}
  `;

  const navClasses = isMobileOpen
    ? "fixed top-0 w-full z-50"
    : `fixed top-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`;

  return (
    <nav className={navClasses}>
      <div className="w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LEFT: LOGO + SLUG INPUT (Desktop) */}
          <div className="flex items-center gap-4">
            <a href="/" className="hover:opacity-70 transition-opacity">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-foreground">
                studio<span className="text-red-500/80 dark:text-red-400">.</span>card
              </h1>
            </a>

            {/* Desktop Slug Input */}
            <form onSubmit={handleSlugSubmit} className="hidden lg:flex items-center">
              <div className="flex items-center h-8 rounded-lg bg-zinc-100/80 dark:bg-white/5 border border-zinc-200/50 dark:border-white/10 overflow-hidden transition-all duration-200"
                style={{ width: isSlugFocused ? '220px' : '140px' }}
              >
                <span className="pl-2 text-[10px] font-medium text-zinc-400 whitespace-nowrap">/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase())}
                  onFocus={() => setIsSlugFocused(true)}
                  onBlur={() => setIsSlugFocused(false)}
                  placeholder="go to card..."
                  className="w-full h-full px-1 text-xs font-medium bg-transparent outline-none text-foreground placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!slug.trim()}
                  className="h-full px-2 text-zinc-400 hover:text-foreground disabled:opacity-30 transition-colors"
                >
                  <ArrowRight size={12} />
                </button>
              </div>
            </form>
          </div>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className={getDesktopLinkClasses(pathname === "/")}>
              Home
              {pathname === "/" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
              )}
            </a>

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

            {/* Desktop Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-foreground transition-all"
              >
                More
                <ChevronDown size={12} className={`transition-transform ${isDesktopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDesktopMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-3 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {menuLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsDesktopMenuOpen(false)}
                          className={`block px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                            pathname === link.href
                              ? 'bg-zinc-100 dark:bg-zinc-800 text-foreground'
                              : 'text-zinc-500 hover:text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                          }`}
                        >
                          {link.name}
                        </Link>
                      ))}

                      <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

                      <Link
                        href="/students"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        Student Sign Up
                      </Link>

                      <Link
                        href="/studio"
                        onClick={() => setIsDesktopMenuOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      >
                        Teacher Login
                      </Link>
                    </div>
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

          {/* MOBILE TOGGLES */}
          <div className="md:hidden flex items-center gap-5">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-zinc-500 hover:text-foreground">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="relative z-50 text-foreground">
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Full Screen) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-8 overflow-y-auto pb-10">
              <div className="flex flex-col gap-6">

                {/* Mobile Slug Input - Prominent at top */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Go to a card
                  </p>
                  <form onSubmit={handleSlugSubmit} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                      <span className="pl-4 text-sm font-medium text-zinc-400">studiocard.live/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase())}
                        placeholder="your-card"
                        className="flex-1 h-full px-1 text-sm font-bold bg-transparent outline-none text-foreground placeholder:text-zinc-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!slug.trim()}
                      className="h-12 px-4 rounded-xl bg-foreground text-background font-bold text-sm disabled:opacity-30 transition-all"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </form>
                </div>

                <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

                <a href="/" onClick={() => setIsMobileOpen(false)} className={`text-4xl font-black tracking-tighter ${pathname === "/" ? "text-foreground" : "text-zinc-400"}`}>
                  Home
                </a>

                {mainLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileOpen(false)} className={`text-4xl font-black tracking-tighter ${pathname === link.href ? "text-foreground" : "text-zinc-400"}`}>
                    {link.name}
                  </Link>
                ))}

                <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 my-2" />

                {menuLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`text-2xl font-bold tracking-tight ${pathname === link.href ? "text-foreground" : "text-zinc-500"}`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 my-2" />

                <Link
                  href="/students"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-bold text-blue-500"
                >
                  Student Sign Up →
                </Link>

                <Link
                  href="/studio"
                  onClick={() => setIsMobileOpen(false)}
                  className="text-lg font-bold text-purple-500"
                >
                  Teacher Login →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
