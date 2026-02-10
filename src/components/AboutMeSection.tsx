"use client";

import { useState } from "react";
import Image from "next/image";

export default function AboutMeSection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-12">
      <div className="flex justify-center">
        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-zinc-50/60 dark:bg-white/5 backdrop-blur-sm text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/60 dark:hover:bg-white/10 transition"
        >
          About Me {open ? "−" : "+"}
        </button>
      </div>

      {open && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="relative w-full md:w-auto">
            <Image
              src="/profile.png"
              alt="Isaac Wilkins"
              width={400}
              height={600}
              className="rounded-2xl border border-zinc-200 dark:border-white/10 shadow-xl"
              priority
            />
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="max-w-xl space-y-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">
                Our Belief
              </h2>
              <blockquote className="text-3xl md:text-5xl font-medium leading-tight tracking-tighter text-foreground">
                Music is a Journey
              </blockquote>
              <p className="text-lg text-zinc-800 dark:text-zinc-200 leading-relaxed">
                As a pianist and student myself, I know that 99% of music happens in the practice room.
                I built Studio Card so that the effort you put in doesn't disappear into thin air.
              </p>
              <div className="pt-2">
                <a
                  href="https://studiocard.live/isaac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5"
                >
                  Listen to my work Here
                </a>
              </div>
            </div>
            <div className="relative mt-10 w-56 h-20 opacity-80">
              <Image
                src="/signature.png"
                alt="Signature"
                fill
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/signaturew1.png"
                alt="Signature"
                fill
                priority
                className="object-contain hidden dark:block"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
