import { Heart, Eye, Share2, Lock, Bell, Smartphone, Play, Download, Star, Users, Music } from 'lucide-react';
import Link from 'next/link';
import AboutMeSection from "@/components/AboutMeSection";

export const metadata = {
  title: 'For Parents | Studio.Card',
  description: 'Stay connected to your child\'s music journey. View practice recordings, see teacher feedback, and celebrate progress together.',
};

export default function ParentsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">

      {/* HERO */}
      <section className="max-w-4xl mx-auto text-center mb-24 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold text-xs uppercase tracking-widest">
          <Heart size={14} /> For Parents
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
          Watch them <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">grow.</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Studio.Card gives you a window into your child&apos;s musical journey. Listen to their practice recordings, see what their teacher is working on with them, and celebrate every milestone together.
        </p>
      </section>

      {/* WHAT IS IT */}
      <section className="max-w-5xl mx-auto mb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Your child&apos;s digital music portfolio
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Think of it like a digital refrigerator door for their music. Every week, your child records their practice and uploads it to their personal Studio Card. You get a link like <span className="font-mono text-pink-500">studiocard.live/emma</span> where you can listen anytime.
            </p>
            <ul className="space-y-4">
              {[
                "Hear their latest practice recordings",
                "See what songs they're working on",
                "Read notes and feedback from their teacher",
                "Share progress with grandparents and family"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0">
                    <Heart size={10} className="text-white" />
                  </div>
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-1">
              <div className="w-full h-full rounded-[1.75rem] bg-zinc-900 flex flex-col items-center justify-center text-white p-8">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
                  <Music size={32} />
                </div>
                <p className="text-2xl font-black mb-1">Emma&apos;s Card</p>
                <p className="text-white/60 text-sm mb-6">Piano Student</p>
                <div className="w-full space-y-3">
                  <div className="h-12 rounded-xl bg-white/10 flex items-center px-4 gap-3">
                    <Play size={16} className="text-pink-400" />
                    <span className="text-sm font-medium">Für Elise - Week 4</span>
                  </div>
                  <div className="h-12 rounded-xl bg-white/10 flex items-center px-4 gap-3">
                    <Play size={16} className="text-pink-400" />
                    <span className="text-sm font-medium">C Major Scale</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO VIEW */}
      <section className="max-w-5xl mx-auto mb-24">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12">How to View Your Child&apos;s Card</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-pink-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
              <Share2 size={28} />
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 font-black text-sm flex items-center justify-center mx-auto">1</div>
            <h3 className="text-xl font-bold">Get Their Link</h3>
            <p className="text-zinc-500">
              Ask your child&apos;s music teacher for their Studio Card link. It&apos;ll look something like <span className="font-mono text-pink-500">studiocard.live/emma</span>
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
              <Lock size={28} />
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 font-black text-sm flex items-center justify-center mx-auto">2</div>
            <h3 className="text-xl font-bold">Enter Access Code</h3>
            <p className="text-zinc-500">
              If their profile is private, you&apos;ll need a 4-digit access code. The teacher or your child can share this with you.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
              <Eye size={28} />
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 font-black text-sm flex items-center justify-center mx-auto">3</div>
            <h3 className="text-xl font-bold">Listen & Support</h3>
            <p className="text-zinc-500">
              Play their recordings, read teacher notes, and celebrate their progress. You can even download recordings to keep forever.
            </p>
          </div>
        </div>
      </section>

      {/* WHY PARENTS LOVE IT */}
      <section className="max-w-5xl mx-auto mb-24">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-[3rem] p-8 md:p-12 border border-pink-100 dark:border-pink-900/30">
          <h2 className="text-3xl font-black tracking-tight mb-8">Why Parents Love Studio.Card</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Smartphone,
                title: "Listen Anywhere",
                description: "Open their card on your phone during your commute, or share the link with grandparents across the country. Their music goes wherever you go."
              },
              {
                icon: Eye,
                title: "See Real Progress",
                description: "Compare recordings from month 1 to month 6. Hearing the improvement over time is incredibly rewarding for the whole family."
              },
              {
                icon: Bell,
                title: "Stay in the Loop",
                description: "See what their teacher is assigning and what feedback they're giving. You'll know exactly how to support practice at home."
              },
              {
                icon: Download,
                title: "Keep Forever",
                description: "Download any recording with one click. These are memories you'll treasure—their first recital piece, their breakthrough moment."
              },
              {
                icon: Star,
                title: "Celebrate Milestones",
                description: "When they nail that difficult passage or finish their first song, you'll be the first to know. Share their wins with the whole family."
              },
              {
                icon: Users,
                title: "Involve Everyone",
                description: "Grandma can listen. Dad can listen from work. The whole family stays connected to their musical journey, even from afar."
              }
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/50 dark:bg-black/20">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm shrink-0">
                  <benefit.icon size={24} className="text-pink-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT PARENTS SAY */}
      <section className="max-w-4xl mx-auto mb-24">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12">What Parents Are Saying</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              quote: "I used to ask 'how was practice?' and get a shrug. Now I actually hear what she's working on. It's changed how we talk about music at home.",
              name: "Sarah M.",
              child: "Parent of a 10-year-old pianist"
            },
            {
              quote: "My mom lives in Florida and we're in New York. She listens to every recording my son uploads. It's become their special thing.",
              name: "Michael T.",
              child: "Parent of an 8-year-old violinist"
            },
            {
              quote: "I downloaded her first complete song performance. I'm keeping that forever. This is exactly what I wished existed when I was learning.",
              name: "Jennifer L.",
              child: "Parent of a 12-year-old guitarist"
            },
            {
              quote: "The teacher feedback is so helpful. Now I know what to encourage during practice instead of just saying 'keep going!'",
              name: "David K.",
              child: "Parent of a 7-year-old cellist"
            }
          ].map((testimonial, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-700 dark:text-zinc-300 mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              <div>
                <p className="font-bold text-sm">{testimonial.name}</p>
                <p className="text-xs text-zinc-500">{testimonial.child}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto mb-24">
        <h2 className="text-3xl font-black tracking-tight text-center mb-12">Common Questions</h2>

        <div className="space-y-6">
          {[
            {
              q: "Do I need to create an account?",
              a: "No! Parents don't need an account. Just visit your child's Studio Card link and enter the access code if the profile is private. That's it."
            },
            {
              q: "Is my child's profile safe?",
              a: "Yes. Profiles can be set to private, requiring a 4-digit access code to view. Only people with the code can see recordings. You control who has access."
            },
            {
              q: "Can I download recordings?",
              a: "Yes! Every recording has a download button so you can save special performances to your phone or computer. These are yours to keep forever."
            },
            {
              q: "How do I get the access code?",
              a: "Ask your child's music teacher or your child directly. They set the code and can share it with trusted family members."
            },
            {
              q: "Does this cost me anything?",
              a: "No. Parents access their child's card for free. The teacher handles any subscription costs if they have one."
            },
            {
              q: "Can I share the link with family?",
              a: "Absolutely! Share the link and access code with grandparents, aunts, uncles—anyone you want to include in your child's musical journey."
            }
          ].map((faq, i) => (
            <div key={i} className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center">
        <div className="p-8 md:p-12 rounded-[2rem] bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          <h2 className="text-3xl font-black mb-4">Ready to listen?</h2>
          <p className="text-pink-100 mb-8 max-w-md mx-auto">
            Get your child&apos;s Studio Card link from their music teacher and start following their progress today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/faq"
              className="px-8 py-4 bg-white text-pink-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
            >
              Learn More
            </Link>
            <Link
              href="/support"
              className="px-8 py-4 bg-pink-600 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform border-2 border-white/30"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <AboutMeSection />

    </main>
  );
}
