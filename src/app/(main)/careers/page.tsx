"use client";

import { useState, useRef } from "react";
import {
  Rocket, Clock, Calendar, MapPin,
  Send, Loader2, CheckCircle2, Upload,
  Mail, User, MessageSquare, Link2,
  TrendingUp, Zap
} from "lucide-react";

import { submitInternshipApplication } from "@/app/actions";

export default function CareersPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const result = await submitInternshipApplication(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* HEADER */}
      <div className="text-center space-y-6 mb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-widest">
          <Rocket size={14} /> Join the Team
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
          Build the future of{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
            music education
          </span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          We're a scrappy music-tech startup looking for hungry, creative people who want real startup experience on their resume.
        </p>
      </div>

      {/* OPEN POSITION */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-500/20 shadow-2xl shadow-purple-500/10">

          {/* Badge */}
          <div className="absolute -top-4 left-8 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black uppercase tracking-widest shadow-lg">
            Now Hiring
          </div>

          {/* Role Header */}
          <div className="mb-8 pt-4">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Growth & Marketing Intern</h2>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Clock size={14} /> 5-10 hrs/week (Flexible)
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Calendar size={14} /> 3-6 months
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
                <MapPin size={14} /> Remote
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-6 mb-10">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-3">About the Role</h3>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
                We're looking for a creative, self-motivated intern to help us grow studio.card. You'll work directly with the founder on real marketing campaigns, growth experiments, and user acquisition strategies. Plus, the music-tech consumer industry is niche and growing. This is a ground-floor opportunity at an early-stage startup.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-3">What You'll Do</h3>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-300">
                {[
                  "Help develop and execute social media strategy",
                  "Create content that resonates with music teachers and students",
                  "Run growth experiments and analyze what works",
                  "Research and reach out to potential users and partners",
                  "Contribute ideas to product and go-to-market strategy"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Zap size={16} className="text-purple-500 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-3">What You'll Get</h3>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-300">
                {[
                  "Real startup experience for your resume and program applications",
                  "Direct mentorship from founders",
                  "Flexible hours that work around your schedule",
                  "Reference letter upon successful completion",
                  "Potential for extended role or future opportunities"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 size={16} className="text-green-500 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-zinc-400 mb-3">You Might Be a Fit If</h3>
              <ul className="space-y-3 text-zinc-600 dark:text-zinc-300">
                {[
                  "You're excited about startups and want hands-on experience",
                  "You're creative and not afraid to try new things",
                  "You have strong communication skills",
                  "You're self-motivated and can work independently",
                  "Bonus: You have a background in music or education"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <TrendingUp size={16} className="text-orange-500 mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Unpaid Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 mb-8">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Note:</strong> This is an unpaid internship, but we're committed to making it valuable for your career. You'll get real experience, mentorship, and a strong reference. As the company grows, there is potential for equity and commission on future sales. We are happy to discuss more in our interview!
            </p>
          </div>

        </div>
      </div>

      {/* APPLICATION FORM */}
      <div className="max-w-2xl mx-auto" id="apply">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Apply Now</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Drop your info below and we'll be in touch.
          </p>
        </div>

        {success ? (
          <div className="p-12 rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-2 border-green-200 dark:border-green-500/20 text-center">
            <div className="inline-flex p-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-2xl font-black mb-2">Application Received!</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Thanks for your interest. We'll review your application and get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 rounded-[2.5rem] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-xl space-y-6">

            {error && (
              <div className="p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  required
                  name="fullName"
                  type="text"
                  placeholder="Your name"
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="you@email.com"
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                LinkedIn Profile
              </label>
              <div className="relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                Resume (PDF)
              </label>
              <input
                ref={fileInputRef}
                name="resume"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl py-4 px-4 font-medium text-zinc-500 hover:border-purple-500 hover:text-purple-500 transition-all"
              >
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <Upload size={20} />
                </div>
                <span>{fileName || "Click to upload resume"}</span>
              </button>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                Why are you interested? (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-zinc-400" size={18} />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-medium outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} />
                  Submit Application
                </>
              )}
            </button>

          </form>
        )}
      </div>

    </main>
  );
}
