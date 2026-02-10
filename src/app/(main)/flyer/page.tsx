"use client";

import { QRCodeSVG } from "qrcode.react";
import { Rocket, Clock, MapPin, Sparkles, TrendingUp, Zap } from "lucide-react";

export default function FlyerPage() {
  const careersUrl = "https://studiocard.live/careers";

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-zinc-950 dark:via-black dark:to-zinc-900">

      {/* FLYER CONTAINER - Optimized for 8.5x11 screenshot */}
      <div className="w-full max-w-[600px] aspect-[8.5/11] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-zinc-100 dark:border-zinc-800">

        {/* TOP GRADIENT BAR */}
        <div className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

        {/* CONTENT */}
        <div className="flex-1 flex flex-col p-8 md:p-10">

          {/* HEADER */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="mb-4">
              <span className="text-3xl font-black tracking-tighter">
                studio<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">.</span>card
              </span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-widest mb-6">
              <Rocket size={14} /> We're Hiring
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                Growth & Marketing
              </span>
              <br />
              Intern Wanted
            </h1>

            <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md mx-auto">
              Join an early-stage music-tech startup and get real experience for your resume.
            </p>
          </div>

          {/* DETAILS */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium">
              <Clock size={16} className="text-purple-500" /> 5-10 hrs/week
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium">
              <MapPin size={16} className="text-pink-500" /> Remote
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium">
              <TrendingUp size={16} className="text-orange-500" /> 3-6 months
            </span>
          </div>

          {/* HIGHLIGHTS */}
          <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-6 mb-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 text-center">
              What You'll Get
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                "Real startup experience",
                "Direct founder mentorship",
                "Flexible schedule",
                "Strong reference letter"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Zap size={14} className="text-purple-500 shrink-0" />
                  <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SPACER */}
          <div className="flex-1" />

          {/* QR CODE SECTION */}
          <div className="text-center">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-lg border border-zinc-100 dark:border-zinc-700 mb-4">
              <QRCodeSVG
                value={careersUrl}
                size={140}
                level="H"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#18181B"
              />
            </div>
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-400 mb-1">
              Scan to Apply
            </p>
            <p className="text-xs text-zinc-400 font-mono">
              studiocard.live/careers
            </p>
          </div>

        </div>

        {/* BOTTOM GRADIENT BAR */}
        <div className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />

      </div>

    </main>
  );
}
