"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, MessageSquare, HelpCircle, Loader2, CheckCircle2, ChevronDown, Users, Wrench, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const { error: dbError } = await supabase.from('contact_inquiries').insert([{
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      inquiry_type: formData.get('inquiry_type'),
      message: formData.get('message'),
    }]);

    if (dbError) {
      setError("Something went wrong. Please try again or email us directly.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* HEADER */}
      <section className="max-w-3xl mx-auto mb-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
          <Mail size={12} /> Support
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground">
          How can we help?
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Have a question, running into an issue, or interested in Studio.Card for your school? We&apos;d love to hear from you.
        </p>
      </section>

      {/* QUICK LINKS */}
      <section className="max-w-4xl mx-auto mb-16">
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/faq" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
              <HelpCircle size={20} />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-blue-500 transition-colors">FAQ</h3>
            <p className="text-sm text-zinc-500">Find answers to common questions</p>
          </Link>

          <Link href="/teachers" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-purple-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
              <Users size={20} />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-purple-500 transition-colors">For Teachers</h3>
            <p className="text-sm text-zinc-500">Learn how Studio.Card works</p>
          </Link>

          <Link href="/parents" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-pink-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 flex items-center justify-center mb-4">
              <MessageSquare size={20} />
            </div>
            <h3 className="font-bold mb-1 group-hover:text-pink-500 transition-colors">For Parents</h3>
            <p className="text-sm text-zinc-500">How to view your child&apos;s card</p>
          </Link>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="max-w-2xl mx-auto">
        <div className="rounded-[2rem] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 md:p-10 shadow-xl">

          {success ? (
            <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-black tracking-tight">Message Sent!</h4>
              <p className="text-zinc-500 max-w-sm mx-auto">
                Thanks for reaching out. We typically respond within 24 hours.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="text-sm font-bold text-blue-500 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black tracking-tight mb-2">Send us a message</h2>
                <p className="text-sm text-zinc-500">We&apos;ll get back to you as soon as we can.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 pl-1">Your Name</label>
                    <input
                      name="full_name"
                      required
                      placeholder="Jane Smith"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 pl-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="jane@example.com"
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 pl-1">What can we help with?</label>
                  <div className="relative">
                    <select
                      name="inquiry_type"
                      className="w-full appearance-none bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-3 px-4 pr-10 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="General Question">General Question</option>
                      <option value="Technical Issue">Technical Issue / Bug Report</option>
                      <option value="Account Help">Account Help</option>
                      <option value="School Inquiry">School / Institution Inquiry</option>
                      <option value="Partnership">Partnership Opportunity</option>
                      <option value="Feedback">Feedback / Suggestion</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 pl-1">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us more about your question or issue..."
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Send Message"}
                </button>

              </form>
            </>
          )}
        </div>

        {/* Email fallback */}
        <p className="text-center text-sm text-zinc-400 mt-6">
          Or email us directly at{" "}
          <a href="mailto:support@studiocard.live" className="font-bold text-zinc-600 dark:text-zinc-300 hover:underline">
            support@studiocard.live
          </a>
        </p>
      </section>
    </main>
  );
}
