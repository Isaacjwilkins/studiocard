"use client";

import { useState } from "react";
import Image from "next/image";
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
    { name: "Home", href: "/" },
    { name: "Music", href: "/music" },
    { name: "Connect", href: "/connect" },
    // Added Studio Link with isExternal flag
    { name: "Studio", href: "https://your-studio-website.com", isExternal: true },
  ];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    setIsOpen(false);
  };

  // Shared classes for desktop links to keep it DRY and clean
  const getDesktopLinkClasses = (isActive: boolean) => `
    relative text-[10px] font-black uppercase tracking-[0.3em] transition-all
    ${isActive ? "text-foreground" : "text-zinc-500 hover:text-foreground"}
  `;

  return (
    <nav className="fixed top-0 w-full z-50">
      
      {/* 1. TOP BAR */}
      <div className="w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo also acts as a hard reload to Home */}
          <a href="/" className="relative w-28 sm:w-32 h-8 hover:opacity-70 transition-opacity">
            <Image src="/logo.png" alt="Logo" fill className="object-contain dark:hidden" priority />
            <Image src="/logow.png" alt="Logo" fill className="object-contain hidden dark:block" priority />
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => {
              const isActive = pathname === link.href;
              
              // Handle External Links (Studio) & Home (Hard Refresh)
              if (link.isExternal || link.name === "Home") {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    // Add target blank only for external links
                    target={link.isExternal ? "_blank" : undefined}
                    rel={link.isExternal ? "noopener noreferrer" : undefined}
                    className={getDesktopLinkClasses(isActive)}
                  >
                    {link.name}
                    {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />}
                  </a>
                );
              }

              // Standard Internal Links
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getDesktopLinkClasses(isActive)}
                >
                  {link.name}
                  {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />}
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

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 w-6 h-6 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            >
              <span className={`h-[1.5px] w-5 bg-foreground transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`h-[1.5px] w-5 bg-foreground transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MOBILE OVERLAY */}
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
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  
                  // Mobile: External Links & Home (Anchor Tag)
                  if (link.isExternal || link.name === "Home") {
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.isExternal ? "_blank" : undefined}
                        rel={link.isExternal ? "noopener noreferrer" : undefined}
                        onClick={() => setIsOpen(false)} // Close menu even on external click
                        className={`text-3xl font-bold tracking-tighter ${isActive ? "text-foreground" : "text-zinc-400"}`}
                      >
                        {link.name}
                      </a>
                    );
                  }

                  // Mobile: Other Links (Next.js Link)
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-3xl font-bold tracking-tighter ${isActive ? "text-foreground" : "text-zinc-400"}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                
                {/* Mobile Theme Toggle */}
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-4 pt-4 text-zinc-400"
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                    {theme === "dark" ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
                  </div>
                  <span className="text-lg font-medium tracking-tight">
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}