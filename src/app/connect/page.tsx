"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, MessageSquare, HelpCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function ConnectPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // We stick to the existing 'contact_inquiries' table
    const { error } = await supabase.from('contact_inquiries').insert([{
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      inquiry_type: formData.get('inquiry_type'),
      message: formData.get('message'),
    }]);

    if (!error) {
        setSuccess(true);
    } else {
        console.error(error); // Basic error logging
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <section className="mb-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
           <Mail size={12} /> Contact Us
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground">
          Let's get in touch.
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Have questions about the platform? Need help setting up your teacher dashboard? We are here to help.
        </p>
      </section>

      {/* GRID LAYOUT: Contact Info + Form */}
      <div className="grid md:grid-cols-12 gap-12">
        
        {/* LEFT: Context / Info */}
        <div className="md:col-span-4 space-y-8">
            <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <HelpCircle size={20} className="text-blue-500" /> Support
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                    For technical issues or account help, please select "Technical Support" in the form. We usually respond within 24 hours.
                </p>
                <div className="h-px w-full bg-zinc-200 dark:bg-white/10 mb-6" />
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <MessageSquare size={20} className="text-green-500" /> Sales
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    <strong>For Music Schools:</strong> If you are looking to onboard more than 5 teachers, contact us for bulk pricing.
                </p>
            </div>
            
            <div className="p-6 rounded-3xl bg-red-500/80 text-white shadow-xl shadow-red-500/20">
                <h4 className="font-bold text-lg mb-2">Join the Community</h4>
                <p className="text-red-100 text-sm mb-4">Follow us for updates on new features and featured students.</p>
                <div className="flex gap-4 opacity-80">
                    <span className="text-xs font-bold uppercase tracking-widest">@studiocard</span>
                </div>
            </div>
        </div>

        {/* RIGHT: The Form */}
        <div className="md:col-span-8">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 dark:border-white/10 bg-white/50 dark:bg-black/40 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                {success ? (
                <div className="py-24 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 size={40} />
                    </div>
                    <h4 className="text-3xl font-black tracking-tight text-foreground">Message Sent!</h4>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                        Thanks for reaching out. We've received your inquiry and will get back to you shortly.
                    </p>
                    <button onClick={() => setSuccess(false)} className="text-sm font-bold underline decoration-2 underline-offset-4 decoration-zinc-300 hover:decoration-foreground transition-all">
                        Send another message
                    </button>
                </div>
                ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-3">Full Name</label>
                            <input 
                                name="full_name" 
                                required 
                                placeholder="Your Name" 
                                className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl py-4 px-4 font-medium text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-3">Email Address</label>
                            <input 
                                name="email" 
                                type="email" 
                                required 
                                placeholder="example@gmail.com" 
                                className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl py-4 px-4 font-medium text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-3">I need help with...</label>
                        <div className="relative">
                            <select 
                                name="inquiry_type" 
                                className="w-full appearance-none bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl py-4 px-4 font-medium text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                            >
                                <option value="Teacher Inquiry">Teacher Account Inquiry</option>
                                <option value="School Pricing">School / Bulk Pricing</option>
                                <option value="General">General Question</option>
                                <option value="Bug">Technical Support</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                <ArrowRight size={16} className="rotate-90" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-3">Message</label>
                        <textarea 
                            name="message" 
                            rows={5} 
                            required 
                            placeholder="Tell us a bit more about what you need..." 
                            className="w-full bg-zinc-50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-xl p-4 font-medium text-foreground focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" 
                        />
                    </div>

                    <div className="pt-2">
                        <button 
                            disabled={loading} 
                            className="w-full py-4 rounded-xl bg-foreground text-background font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Send Message"}
                        </button>
                    </div>

                </form>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}