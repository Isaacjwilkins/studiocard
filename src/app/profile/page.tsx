"use client";

import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { supabase } from '@/lib/supabase';
import { User, Palette, Lock, Globe, Instagram, Youtube, Smile, Music, CheckCircle2, Loader2, Camera, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Preset Colors & Icons
const COLORS = [
  { name: "Ocean", hex: "#3b82f6", class: "bg-blue-500" },
  { name: "Sunset", hex: "#f97316", class: "bg-orange-500" },
  { name: "Berry", hex: "#ec4899", class: "bg-pink-500" },
  { name: "Forest", hex: "#10b981", class: "bg-emerald-500" },
  { name: "Royal", hex: "#8b5cf6", class: "bg-violet-500" },
  { name: "Midnight", hex: "#1e293b", class: "bg-slate-800" },
];
const ICONS = ["🚀", "🎹", "🎸", "🎤", "🎧", "🌟", "🔥", "🎵", "🐶", "🐱", "🦁"];

export default function ProfilePage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Photo & Cropping State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    passcode: '',
    bio: '',
    color: COLORS[0].hex,
    icon: ICONS[0],
    isPrivate: false,
    socials: { instagram: '', youtube: '', tiktok: '' }
  });

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageToCrop(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const createCroppedImage = async () => {
    if (!imageToCrop || !croppedAreaPixels) return;
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.src = imageToCrop;
    await new Promise((resolve) => (img.onload = resolve));
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;
    ctx?.drawImage(
      img,
      croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height,
      0, 0, 400, 400
    );
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    setFormData({ ...formData, icon: base64Image });
    setImageToCrop(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      request_type: isSignUp ? 'NEW_USER' : 'UPDATE_PROFILE',
      user_name: formData.fullName,
      user_passcode: formData.passcode,
      requested_changes: { ...formData },
      status: 'PENDING'
    };

    const { error } = await supabase.from('profile_requests').insert([payload]);
    
    if (error) {
      await supabase.from('contact_inquiries').insert([{
        full_name: formData.fullName,
        email: "profile-update@system.local",
        message: JSON.stringify(payload)
      }]);
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <main className="min-h-screen pt-32 px-6 flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 dark:bg-green-900/30 p-8 rounded-full mb-6 text-green-600 dark:text-green-400">
          <CheckCircle2 size={64} />
        </motion.div>
        <h1 className="text-4xl font-black mb-4">Request Sent!</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
          {isSignUp ? "Welcome to the club! We are building your page now." : "We've got your changes. Your profile will update shortly."}
        </p>
        <button onClick={() => setSuccess(false)} className="mt-8 px-8 py-3 bg-foreground text-background rounded-full font-bold uppercase tracking-widest text-xs">
          Back to Form
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-3xl mx-auto">
      
      {/* CROP MODAL */}
      <AnimatePresence>
        {imageToCrop && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-sm">Crop Your Photo</h3>
                <button onClick={() => setImageToCrop(null)}><X size={20} /></button>
              </div>
              <div className="relative h-80 w-full bg-zinc-200">
                <Cropper
                  image={imageToCrop}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="p-8 space-y-6">
                <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-blue-600" />
                <button onClick={createCroppedImage} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">
                  Save Crop
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
          {isSignUp ? "Create Your Card" : "Edit Your Profile"}
        </h1>
        <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full">
          <button onClick={() => setIsSignUp(false)} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${!isSignUp ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>Update Existing</button>
          <button onClick={() => setIsSignUp(true)} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${isSignUp ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>New Sign Up</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
        
        {/* IDENTITY */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Your Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input required value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="Leo Piano" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input required value={formData.passcode} onChange={(e) => setFormData({...formData, passcode: e.target.value})} placeholder="1234" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

        {/* THEME & AVATAR */}
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 flex items-center gap-2"><Palette size={12} /> Theme Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button key={c.hex} type="button" onClick={() => setFormData({...formData, color: c.hex})} className={`w-10 h-10 rounded-full transition-transform hover:scale-110 border-2 ${c.class} ${formData.color === c.hex ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground/20' : 'border-transparent'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 flex items-center gap-2"><Smile size={12} /> Avatar or Photo</label>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {ICONS.map((icon) => (
                <button key={icon} type="button" onClick={() => setFormData({...formData, icon})} className={`aspect-square rounded-xl flex items-center justify-center text-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${formData.icon === icon ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>{icon}</button>
              ))}
              <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`aspect-square rounded-xl flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden relative group ${formData.icon.startsWith('data:') ? 'ring-2 ring-blue-500' : ''}`}
              >
                {formData.icon.startsWith('data:') ? <img src={formData.icon} alt="User upload" className="w-full h-full object-cover" /> : <Camera className="text-zinc-400" size={20} />}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Plus className="text-white" size={16} /></div>
              </button>
            </div>
            <p className="text-[10px] font-medium text-zinc-500 italic pl-4">* Tap the camera to upload & crop your own picture!</p>
          </div>
        </div>

        {/* BIO & SOCIALS */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Mini Bio and Socials (optional)</label>
          <textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} placeholder="I've been playing piano for 3 years. I love Jazz and Minecraft music." rows={3} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input value={formData.socials.instagram} onChange={(e) => setFormData({...formData, socials: {...formData.socials, instagram: e.target.value}})} placeholder="Instagram" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-pink-500 outline-none" />
             </div>
             <div className="relative">
                <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input value={formData.socials.youtube} onChange={(e) => setFormData({...formData, socials: {...formData.socials, youtube: e.target.value}})} placeholder="YouTube" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none" />
             </div>
             <div className="relative">
                <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                <input value={formData.socials.tiktok} onChange={(e) => setFormData({...formData, socials: {...formData.socials, tiktok: e.target.value}})} placeholder="TikTok" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-white outline-none" />
             </div>
          </div>
        </div>

        {/* PRIVACY TOGGLE */}
        <div className="flex items-center justify-between bg-zinc-100 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${formData.isPrivate ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {formData.isPrivate ? <Lock size={18} /> : <Globe size={18} />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-foreground">{formData.isPrivate ? 'Private Profile' : 'Public Profile'}</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{formData.isPrivate ? 'Only people with passcode can view' : 'Anyone can view your card'}</p>
            </div>
          </div>
          <button type="button" onClick={() => setFormData({...formData, isPrivate: !formData.isPrivate})} className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.isPrivate ? 'bg-red-500' : 'bg-green-500'}`}>
            <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${formData.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <button disabled={loading} className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-3">
          {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Start My Studio Card" : "Save Changes")}
        </button>

      </form>
    </main>
  );
}