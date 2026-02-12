"use client";

import Link from "next/link";
import { Inbox, Users, Calendar, ShieldCheck, ArrowRight, Sparkles, Check, Clock, QrCode, Music, MapPin } from "lucide-react";
import Image from "next/image";
import AboutMeSection from "@/components/AboutMeSection";

export default function TeachersPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* 1. HERO */}
      <section className="max-w-4xl mx-auto text-center mb-24">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest mb-6">
          <Users size={12} /> For Private Teachers
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          The Modern Music Studio{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">
            in Your Pocket.
          </span>
        </h1>

        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Help encourage your students to love practice, because they love music.
          <span className="block mt-2 font-medium text-foreground">
            Hear what they are doing throughout the week, encourage them and send feedback.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/studio"
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
          >
            Start Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 px-8 py-4 border border-zinc-300 dark:border-zinc-700 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-white/10 transition-all"
          >
            View Pricing
          </Link>
        </div>

        <p className="text-sm text-zinc-500 mt-6">
          Free for your first 3 students. No credit card required.
        </p>
      </section>

      {/* 2. THE INBOX (Main Value Prop) */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 mb-32 items-center bg-white/50 dark:bg-white/5 backdrop-blur-2xl border border-zinc-200/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">

        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest">
            <Inbox size={12} /> Your Inbox
          </div>

          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            All your students.
            <br />
            <span className="text-zinc-500">One dashboard.</span>
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-indigo-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Wake Up to Recordings</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Students upload practice sessions overnight. You see them first thing in the morning.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Reply in Seconds</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Leave text notes or record voice feedback. Students see your guidance on their card.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                <Check size={18} className="text-green-500" />
              </div>
              <div>
                <h3 className="font-bold mb-1">Zero Admin</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  We handle the hosting, the tech, and the website. You just teach.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BROWSER WINDOW MOCKUP */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden relative group transform transition-transform hover:scale-[1.02]">
          {/* Browser Toolbar */}
          <div className="relative z-10 flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 ml-4">
              <div className="w-full max-w-sm mx-auto h-5 rounded-full bg-zinc-200/50 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Image Area */}
          <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-black/20">
            <Image
              src="/aaw2.png"
              alt="Dashboard Light"
              fill
              className="object-cover object-top dark:hidden"
            />
            <Image
              src="/aad2.png"
              alt="Dashboard Dark"
              fill
              className="object-cover object-top hidden dark:block"
            />
          </div>
        </div>
      </div>

      {/* 3. DIGITAL RECITAL SHOWCASE */}
      <section className="max-w-6xl mx-auto mb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 dark:from-purple-900/10 dark:via-indigo-900/10 dark:to-violet-900/10 backdrop-blur-2xl border border-purple-200/50 dark:border-purple-800/30 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">

          <div className="space-y-6 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest">
              <Sparkles size={12} /> New Feature
            </div>

            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Digital Recital Programs
              <br />
              <span className="text-purple-500">in 60 seconds.</span>
            </h2>

            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Create beautiful, shareable concert programs for your recitals and showcases.
              Attendees scan a QR code and instantly see the full program on their phones.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <QrCode size={16} className="text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">QR Code Sharing</h4>
                  <p className="text-sm text-zinc-500">Print or display the QR code at your venue. No app downloads needed.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Music size={16} className="text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Full Program Details</h4>
                  <p className="text-sm text-zinc-500">Student photos, pieces, composers, and estimated start times.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={16} className="text-purple-500" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Link to Student Cards</h4>
                  <p className="text-sm text-zinc-500">Attendees can tap to discover each student&apos;s full portfolio.</p>
                </div>
              </div>
            </div>

            <Link
              href="/studio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-sm transition-colors"
            >
              Create Your First Recital <ArrowRight size={16} />
            </Link>
          </div>

          {/* RECITAL PROGRAM MOCKUP */}
          <div className="relative md:order-1">
            {/* Phone Frame */}
            <div className="relative mx-auto w-[280px] md:w-[320px]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-[3rem] blur-3xl" />
              <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] border-[8px] border-zinc-800 dark:border-zinc-700 shadow-2xl overflow-hidden">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-zinc-800 dark:bg-zinc-700 rounded-b-2xl z-10" />

                {/* Program Content */}
                <div className="pt-8 pb-6 px-5 min-h-[480px] bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900">
                  {/* Header */}
                  <div className="text-center mb-6 pt-2">
                    <h3 className="text-lg font-black tracking-tight">Spring Recital 2026</h3>
                    <p className="text-xs text-zinc-500">Ms. Smith&apos;s Piano Studio</p>
                    <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} /> May 15, 3:00 PM
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> Community Hall
                      </span>
                    </div>
                  </div>

                  {/* Performers */}
                  <div className="space-y-2">
                    {[
                      { name: "Emily Chen", piece: "Fur Elise", composer: "Beethoven", color: "#6366f1" },
                      { name: "Jake Thompson", piece: "Minuet in G", composer: "Bach", color: "#8b5cf6" },
                      { name: "Sarah Kim", piece: "Sonatina Op. 36", composer: "Clementi", color: "#a855f7" },
                    ].map((performer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: performer.color }}
                        >
                          {performer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{performer.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">
                            {performer.piece} &bull; {performer.composer}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Intermission */}
                    <div className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-600" />
                        <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Intermission</span>
                        <div className="h-px w-8 bg-zinc-300 dark:bg-zinc-600" />
                      </div>
                    </div>

                    {[
                      { name: "Alex Rivera", piece: "Nocturne Op. 9", composer: "Chopin", color: "#ec4899" },
                    ].map((performer, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: performer.color }}
                        >
                          {performer.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{performer.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">
                            {performer.piece} &bull; {performer.composer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 text-center">
                    <p className="text-[10px] text-zinc-400">
                      Created with <span className="font-bold">studio<span className="text-purple-500">.</span>card</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating QR Code Badge */}
            <div className="absolute -left-4 md:-right-4 md:left-auto top-20 bg-white dark:bg-zinc-800 rounded-xl p-3 shadow-xl border border-zinc-200 dark:border-zinc-700 transform -rotate-6 md:rotate-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <QrCode size={32} className="text-white" />
              </div>
              <p className="text-[8px] font-bold text-center mt-1 text-zinc-500">SCAN ME</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURE GRID (New Features) */}
      <section className="max-w-5xl mx-auto mb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
            Everything you need to run a modern studio.
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Simple, private, and shareable. No social media risks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Digital Recital */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-800/30">
            <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
              <Calendar size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Digital Recital Programs</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Create beautiful shareable concert programs with QR codes. Perfect for recitals, showcases, and performances.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold">
              <Sparkles size={12} /> New Feature
            </div>
          </div>

          {/* Privacy */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-800/30">
            <div className="w-14 h-14 rounded-2xl bg-green-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Private & Safe</h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              No social media risks. All profiles are password-protected with 4-digit access codes. Safe, private links for families only.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 text-xs font-bold">
              <Check size={12} /> Built-in
            </div>
          </div>

          {/* Student Cards */}
          <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-orange-500/20">
              <Users size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Student Cards</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Each student gets their own beautiful profile page. They record, you review, families listen. Simple.
            </p>
          </div>

          {/* Feedback */}
          <div className="p-8 rounded-[2rem] bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-zinc-200/50 dark:border-white/10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Inbox size={28} />
            </div>
            <h3 className="text-2xl font-black mb-2">Voice & Text Feedback</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Leave notes and assignments directly on student cards. Or record a voice memo—they'll hear your guidance at home.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION */}
      <section className="w-full bg-zinc-900 dark:bg-white text-white dark:text-black py-20 px-6 rounded-[3rem] mb-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
            Unlimited students. One simple price.
          </h2>
          <p className="text-xl opacity-80 max-w-2xl mx-auto">
            <span className="font-bold border-b-2 border-white/30 dark:border-black/30">$29/month</span> for the full Studio Plan.
            <br />
            That's less than the price of one lesson.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left mt-12 mb-12 max-w-2xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-black/5 backdrop-blur-sm border border-white/10 dark:border-black/10">
              <div className="text-sm font-bold uppercase tracking-widest opacity-60 mb-2">Free Forever</div>
              <div className="text-4xl font-black mb-4">$0</div>
              <ul className="space-y-2 text-sm opacity-80">
                <li className="flex items-center gap-2"><Check size={14} /> 3 Students</li>
                <li className="flex items-center gap-2"><Check size={14} /> Student Cards</li>
                <li className="flex items-center gap-2"><Check size={14} /> Basic Inbox</li>
              </ul>
            </div>

            {/* Studio Plan */}
            <div className="p-6 rounded-2xl bg-white dark:bg-black text-black dark:text-white border-2 border-white dark:border-black relative">
              <div className="absolute -top-3 left-4 px-3 py-1 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">
                Popular
              </div>
              <div className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-2">Studio Plan</div>
              <div className="text-4xl font-black mb-4">$29<span className="text-lg font-medium text-zinc-400">/mo</span></div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> <strong>Unlimited</strong> Students</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Full Inbox + Voice Notes</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Digital Recitals</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-purple-500" /> Priority Support</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/studio"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-black text-black dark:text-white rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-xl"
            >
              Start Free Today <ArrowRight size={16} />
            </Link>
          </div>

          <p className="text-sm opacity-60">
            No credit card required. Upgrade anytime when you're ready.
          </p>
        </div>
      </section>

      {/* About Me Section */}
      <AboutMeSection />

    </main>
  );
}
