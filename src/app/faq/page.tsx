"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Do I need to be a professional pianist?",
    answer: "Absolutely not. Wilkins Studio is designed for students, hobbyists, and anyone who loves to play. Whether you've been playing for 2 years or 20, we can help you capture your sound."
  },
  {
    question: "Can I record vocals?",
    answer: "Yes! We can set up a microphone for vocals while you play. There is a small add-on fee ($15) for the extra setup and mixing time required for vocals."
  },
  {
    question: "Is 30 minutes really enough time?",
    answer: "The honest truth is: it depends. If you have more than 1-2 songs, you may want to book more time. However, this isn't a traditional recording studio-it is meant to be fast and casual! Most of our customers discover 30 minutes is plenty of time if they have come prepared."
  },
  {
    question: "How long until I get my recording?",
    answer: "Typically, the mixing and mastering process takes about 3-5 days. Once finished, your personal webpage will go live and we will email you the MP3 file directly."
  },
  {
    question: "Do I own the rights to my recording?",
    answer: "Yes. You retain full ownership of your performance. We simply provide the service of recording and hosting it for you."
  },
  {
    question: "Can I bring a guitar or cello?",
    answer: "Yes, we can record other acoustic instruments. However, please note that we are not set up for full drum kits or amplified electric bands at this time."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="max-w-3xl mx-auto pt-32 pb-20 px-6 min-h-screen">
      <div className="mb-16">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4">Help Center</h2>
        <h1 className="text-5xl font-bold tracking-tighter text-foreground">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="border border-zinc-200 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-black/40 backdrop-blur-md overflow-hidden transition-all hover:border-zinc-400 dark:hover:border-white/20"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-bold text-lg text-foreground">{faq.question}</span>
              <span className="text-zinc-500">
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
    </main>
  );
}