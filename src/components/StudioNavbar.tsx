"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Sun, Moon, LayoutGrid, Users, Plus, User } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

export default function StudioNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  const isLoginPage = pathname === "/studio";

  // --- SCROLL LOGIC ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide logic (Only if menu is CLOSED)
      if (currentScrollY > lastScrollY && currentScrollY > 100 && !isOpen) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, isOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("teachers").select("username").eq("id", user.id).single();
        if (data) setUsername(data.username);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/studio");
  };

  const navLinks = [
    { name: "Home", href: "/studio/dashboard", icon: LayoutGrid },
    { name: "Students", href: username ? `/studio/${username}` : "#", icon: Users },
    { name: "Account", href: "/studio/account", icon: User },
  ];

  const getDesktopLinkClasses = (isActive: boolean) => `
    relative text-[10px] font-black uppercase tracking-[0.3em] transition-all
    ${isActive ? "text-foreground" : "text-zinc-500 hover:text-foreground"}
  `;

  // 🔴 CSS FIX: 
  // When 'isOpen' is true, we must NOT have 'backdrop-blur' or 'transform' on the parent <nav>.
  // We strictly keep it 'fixed top-0 w-full z-50' and nothing else.
  const navClasses = isOpen 
    ? "fixed top-0 w-full z-50" 
    : `fixed top-0 w-full z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full md:translate-y-0'}`;

  return (
    <nav className={navClasses}>
      
      {/* THE BAR: This inner div handles the blurred background */}
      <div className="w-full border-b border-white/10 dark:border-white/5 bg-white/60 dark:bg-black/80 backdrop-blur-xl relative z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 1. LOGO */}
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <h1 className="text-xl md:text-2xl font-black tracking-tighter text-foreground">
              studio<span className="text-purple-500">.</span>card
            </h1>
          </Link>

          {/* 2. DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            
            {!isLoginPage && (
              <>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.name} href={link.href} className={getDesktopLinkClasses(isActive)}>
                      {link.name}
                      {isActive && (
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full" />
                      )}
                    </Link>
                  );
                })}

                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

                <button onClick={handleLogout} className={getDesktopLinkClasses(false)}>
                  Log Out
                </button>
              </>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`ml-2 pl-4 ${!isLoginPage ? 'border-l border-white/10' : ''} text-zinc-500 hover:text-foreground transition-colors`}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>

          {/* 3. MOBILE TOGGLES */}
          <div className="md:hidden flex items-center gap-5">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="text-zinc-500 hover:text-foreground">
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {!isLoginPage && (
              <button onClick={() => setIsOpen(!isOpen)} className="relative z-50 w-6 h-6 flex flex-col justify-center gap-1.5">
                <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "rotate-45 translate-y-[4px]" : ""}`} />
                <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`} />
                <span className={`h-[1.5px] w-5 bg-foreground transition-all ${isOpen ? "-rotate-45 -translate-y-[4px]" : ""}`} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      {/* Because the parent <nav> is now "clean" (no transforms/filters), this fixed child will respect the viewport */}
      <AnimatePresence>
        {isOpen && !isLoginPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black backdrop-blur-3xl md:hidden"
          >
            <div className="flex flex-col h-full pt-24 px-8 overflow-y-auto pb-10">
              <div className="flex flex-col gap-6">
                
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)} 
                    className={`text-4xl font-black tracking-tighter flex items-center gap-4 ${pathname === link.href ? "text-foreground" : "text-zinc-400"}`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px w-20 bg-zinc-200 dark:bg-zinc-800 my-2" />

                <button 
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }} 
                  className="text-2xl font-bold tracking-tight text-red-500 flex items-center gap-2"
                >
                  Log Out <LogOut size={20} />
                </button>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}