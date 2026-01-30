"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function ConnectPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const { error } = await supabase.from('contact_inquiries').insert([{
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      inquiry_type: formData.get('inquiry_type'),
      message: formData.get('message'),
    }]);
    if (!error) setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
      {/* Header Section */}
      <section className="mb-24 space-y-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Let's create something</h2>
        <h3 className="text-4xl font-semibold text-foreground">Connect with me below.</h3>
        <div className="text-zinc-700 dark:text-zinc-300 max-w-2xl text-lg leading-relaxed">
          <p>Whether you're interested in private piano instruction, commissioning a custom arrangement, or simply sharing a thought—I'd love to hear from you!</p>
        </div>
      </section>

      {/* Glassmorphism Form Container */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl transition-all">
        {success ? (
          <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">
              Sent Successfully
            </span>
            <h4 className="text-3xl font-bold tracking-tight text-foreground">Message Received.</h4>
            <p className="text-zinc-700 dark:text-zinc-300 max-w-sm mx-auto">
              Thank you for reaching out. I usually respond within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Full Name</label>
                <input name="full_name" required placeholder="Isaac Wilkins" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-3 text-foreground focus:border-foreground outline-none transition-colors placeholder:text-zinc-600/30" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Email Address</label>
                <input name="email" type="email" required placeholder="hello@example.com" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-3 text-foreground focus:border-foreground outline-none transition-colors placeholder:text-zinc-600/30" />
              </div>
            </div>
            {/* ... other form fields using text-foreground for visibility ... */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Topic</label>
              <select name="inquiry_type" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-3 text-foreground focus:border-foreground outline-none transition-colors cursor-pointer">
                <option className="bg-white dark:bg-zinc-900">General Inquiry</option>
                <option className="bg-white dark:bg-zinc-900">Piano Lessons</option>
                <option className="bg-white dark:bg-zinc-900">Arrangement Commission</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Message</label>
              <textarea name="message" rows={4} required placeholder="How can I help?" className="w-full bg-white/5 dark:bg-black/20 border border-zinc-300 dark:border-zinc-800 p-6 rounded-xl text-foreground focus:border-foreground outline-none transition-all resize-none placeholder:text-zinc-600/30" />
            </div>
            <div className="flex justify-end pt-4">
              <button disabled={loading} className="group relative flex items-center gap-4 text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-1 text-foreground hover:opacity-50 transition-all disabled:opacity-30">
                {loading ? "Sending..." : "Send Inquiry"}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* REFINED: Editorial Profile Section */}
      <section className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Text Column */}
        <div className="md:col-span-7 space-y-8">
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400">About Me</h2>
            <h3 className="text-4xl font-semibold tracking-tight text-foreground">Isaac Wilkins</h3>
          </div>
          
          <div className="space-y-6 text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
            <p>
            Based in Provo, UT, Isaac is a composer and pianist focused primarily on solo arrangements. He began learning piano over 16 years ago, where he was classically trained and competed in national competitions for several years. He currently teaches several students, including as a volunteer for children at SFCC of United Way Provo.
            </p>
            <p>
            Beyond the piano, Isaac is a public health and economics student at BYU pursuing a career in medicine. His work in healthcare has included research and advocacy efforts across several institutions, including the Marriott School, Harvard Medical School, and Mass General Hospital. 
            </p>
          </div>
        </div>

        {/* Image Column */}
        <div className="md:col-span-5">
          <div className="relative aspect-[4/6] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700">
            <Image
              src="/profile.png"
              alt="Isaac Wilkins"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

     
    </main>
  );
}