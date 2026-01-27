"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const links = [
    { name: "Studio", href: "/studio" },
    { name: "Pricing", href: "/pricing" },
    { name: "FAQ", href: "/faq" },
  ];

  const getDesktopLinkClasses = (isActive: boolean) => `
    relative text-[10px] font-black uppercase tracking-[0.3em] transition-all
    ${isActive ? "text-foreground" : "text-zinc-500 hover:text-foreground"}
  `;

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* TOP BAR */}
      <div className="w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO — Text Replacement */}
          <a href="/" className="hover:opacity-70 transition-opacity">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-foreground">
               studio<span className="text-red-500/80 dark:text-red-400">.</span>card
            </h1>
          </a>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">

            {/* Home — Hard Reload */}
            <a
              href="/"
              className={getDesktopLinkClasses(pathname === "/")}
            >
              Home
              {pathname === "/" && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
              )}
            </a>

            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getDesktopLinkClasses(isActive)}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="ml-4 pl-4 border-l border-white/10 text-zinc-500 hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* MOBILE NAV CONTROLS */}
          <div className="md:hidden flex items-center gap-5">
            
            {/* Mobile Theme Toggle (Icon Only) */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-zinc-500 hover:text-foreground transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 w-6 h-6 flex flex-col justify-center items-center gap-1.5"
            >
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col h-full pt-32 px-10">
              <div className="flex flex-col gap-8">

                {/* Mobile Home — Hard Reload */}
                <a
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className={`text-3xl font-bold tracking-tighter ${
                    pathname === "/" ? "text-foreground" : "text-zinc-400"
                  }`}
                >
                  Home
                </a>

                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-3xl font-bold tracking-tighter ${
                        isActive ? "text-foreground" : "text-zinc-400"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}