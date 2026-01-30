"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Check, Info } from 'lucide-react';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // We combine the extra fields into the "message" or "inquiry_type" for now 
    // since the database table structure is simple.
    const rawMessage = formData.get('message');
    const instrument = formData.get('instrument');
    const addons = formData.get('addons');
    
    const combinedMessage = `Instrument: ${instrument}\nAddons: ${addons}\n\nMessage: ${rawMessage}`;

    const { error } = await supabase.from('contact_inquiries').insert([{
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      inquiry_type: "Booking Request", // Hardcoded for this page
      message: combinedMessage,
    }]);

    if (!error) setSuccess(true);
    setLoading(false);
  }

  return (
    <main className="max-w-5xl mx-auto pt-32 pb-20 px-6">
      
      {/* Header */}
      <div className="text-center space-y-6 mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">Pricing</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Professional recording shouldn't require a label budget. 
          Literally walk in, play until you're happy with it, and walk out. 
          We will take care of everything else. 
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-32">
        
        {/* Core Offering */}
        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-xl flex flex-col">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">The Session</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black">$40</span>
              <span className="text-sm text-zinc-500 uppercase tracking-widest">/ Flat Rate</span>
            </div>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {["30 Minutes Studio Time", "Professional Mixing & Mastering", "Personal Artist Webpage", "MP3 File Delivery", "Piano Included (Steinway)"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm font-medium">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                  <Check size={12} strokeWidth={4} />
                </div>
                {item}
              </li>
            ))}
            <li className="flex items-center gap-3 text-sm font-medium opacity-60">
              <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                <Info size={12} />
              </div>
              Other instruments allowed*
            </li>
          </ul>
          <div className="text-[10px] text-zinc-500 leading-relaxed border-t border-zinc-200 dark:border-white/10 pt-4">
            *You may bring other acoustic instruments (violin, cello, guitar). 
            <br/>
            <span className="text-red-500/80 font-bold">Note:</span> Drums and full bands are currently not supported due to space and mic constraints.
          </div>
        </div>

        {/* Add-ons */}
        <div className="p-8 rounded-3xl border border-zinc-200 dark:border-white/5 bg-transparent flex flex-col">
          <h3 className="text-2xl font-bold mb-6">Optional Add-ons</h3>
          <div className="space-y-6 flex-1">
            
            <div className="flex justify-between items-start pb-6 border-b border-zinc-200 dark:border-white/5">
              <div>
                <h4 className="font-bold text-lg">Vocals</h4>
                <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">Microphone setup for singing while playing.</p>
              </div>
              <span className="font-mono text-xl">+ $15</span>
            </div>

            <div className="flex justify-between items-start pb-6 border-b border-zinc-200 dark:border-white/5">
              <div>
                <h4 className="font-bold text-lg">Distribution</h4>
                <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">We help put your song on Spotify, Apple Music, and Amazon.</p>
              </div>
              <span className="font-mono text-xl">+ $45</span>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-lg">Video</h4>
                <p className="text-sm text-zinc-500 mt-1 max-w-[200px]">A static camera recording of your performance.</p>
              </div>
              <span className="font-mono text-xl">+ $10</span>
            </div>

          </div>
        </div>
      </div>

      {/* Booking Form (Glassmorphism style recycled) */}
      <section id="book" className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Ready to start?</h2>
          <h3 className="text-3xl font-bold text-foreground">Book Your Time</h3>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
          {success ? (
            <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-green-500">Request Sent</span>
              <h4 className="text-3xl font-bold tracking-tight text-foreground">See you in the studio.</h4>
              <p className="text-zinc-700 dark:text-zinc-300 max-w-sm mx-auto">
                I'll review your request and email you shortly to confirm the exact time slot.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Name</label>
                  <input name="full_name" required placeholder="Jane Doe" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-2 text-foreground focus:border-foreground outline-none transition-colors placeholder:text-zinc-500/30" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Email</label>
                  <input name="email" type="email" required placeholder="jane@example.com" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-2 text-foreground focus:border-foreground outline-none transition-colors placeholder:text-zinc-500/30" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Instrument</label>
                <select name="instrument" className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-2 text-foreground focus:border-foreground outline-none transition-colors">
                  <option className="bg-white dark:bg-zinc-900" value="Piano">Just Piano</option>
                  <option className="bg-white dark:bg-zinc-900" value="Piano + Vocals">Piano + Vocals</option>
                  <option className="bg-white dark:bg-zinc-900" value="Other">Other Acoustic Instrument</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Interested Add-ons</label>
                <input name="addons" placeholder="e.g. Spotify Distribution, Video..." className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-800 py-2 text-foreground focus:border-foreground outline-none transition-colors placeholder:text-zinc-500/30" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Message / Preferred Times</label>
                <textarea name="message" rows={3} placeholder="I'm free on Tuesday afternoons..." className="w-full bg-white/5 dark:bg-black/20 border border-zinc-300 dark:border-zinc-800 p-4 rounded-xl text-foreground focus:border-foreground outline-none transition-all resize-none placeholder:text-zinc-500/30" />
              </div>

              <button disabled={loading} className="w-full py-4 bg-foreground text-background rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? "Sending..." : "Submit Booking Request"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}