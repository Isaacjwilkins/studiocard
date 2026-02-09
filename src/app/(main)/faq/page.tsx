"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Minus, ExternalLink, Mail, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What exactly is a Studio Card?",
    answer: "Think of it as your digital music portfolio. It's a dedicated webpage (studiocard.live/your-name) where you can showcase your bio, your profile picture, and most importantly, your practice history. It makes your hard work visible to your teacher and family."
  },
  {
    question: "Is it really free for students?",
    answer: "Yes. Our mission is to encourage music education. Students can create a profile, upload recordings, and share their link completely for free. We charge teachers and 'Pro' users for advanced features to keep the lights on."
  },
  {
    question: "How do I record my practice?",
    answer: "You don't need fancy equipment. You can record directly from your phone or computer using our upload tool. If you have professional files from a DAW (like Logic or GarageBand), you can upload those too."
  },
  {
    question: "Who can see my profile?",
    answer: "That is up to you! You can set your profile to 'Public' (anyone with the link can see) or 'Private'. Private profiles require a simple passcode to view, so you can safely share it with only Grandma if you prefer. Your teacher has access to all of your recordings so they can be in the loop."
  },
  {
    question: "I'm a teacher. How do I see my students' work?",
    answer: "When you sign up for a Teacher Account, you get a Dashboard. We will help you set this up; if you've lost access reach out to our support and we will get it back up and running asap. You can invite your students to join your 'Studio', and whenever they upload a new practice session, it automatically appears in your feed for review. Then you can leave your comments right there!"
  },
  {
    question: "What is the difference between Studio Card and Studio Live?",
    answer: "Studio Card (this website) is for asynchronous updates—posting recordings of your practice from the week. Studio Live is our sister platform specifically for real-time, high-quality broadcasting of recitals and lessons."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-20 px-6 min-h-screen flex flex-col">
      
      {/* HEADER */}
      <div className="text-center mb-16">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Help Center</h2>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground mb-6">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
          Everything you need to know about setting up your card and sharing your music.
        </p>
      </div>

      {/* FAQ LIST */}
      <div className="space-y-4 mb-24">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="border border-zinc-200 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-zinc-400 dark:hover:border-white/20"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-lg text-foreground pr-8">{faq.question}</span>
              <span className="text-zinc-500 shrink-0">
                {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* HELPFUL LINKS SECTION */}
      <div className="border-t border-zinc-200 dark:border-white/10 pt-16">
        <h3 className="text-2xl font-black tracking-tight mb-8">Still need help?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          
          <Link href="/pricing" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-zinc-400 transition-colors">
            <div className="mb-4 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <h4 className="font-bold mb-1 group-hover:underline">Pricing & Plans</h4>
            <p className="text-sm text-zinc-500">View student and teacher options.</p>
          </Link>

          <a href="mailto:support@studiocard.com" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-zinc-400 transition-colors">
            <div className="mb-4 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h4 className="font-bold mb-1 group-hover:underline">Contact Support</h4>
            <p className="text-sm text-zinc-500">Email us directly for help.</p>
          </a>

          <a href="https://studiocard.live" target="_blank" rel="noopener noreferrer" className="group p-6 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-zinc-400 transition-colors">
            <div className="mb-4 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <h4 className="font-bold mb-1 group-hover:underline">Studio Live</h4>
            <p className="text-sm text-zinc-500">Visit our live streaming platform.</p>
          </a>

        </div>
      </div>

    </main>
  );
}