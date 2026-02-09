"use client";

import { useState, useRef, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { supabase } from '@/lib/supabase';
import { signupStudent, loginStudent } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Palette, Music, User,
  Lock, Globe, Instagram, Youtube,
  CheckCircle2, Loader2, Camera, X,
  Upload, GraduationCap, AtSign, ArrowDown, ChevronDown, ArrowRight
} from "lucide-react";

// --- CONSTANTS ---
const COLORS = [
  { name: "Ocean", hex: "#3b82f6", class: "bg-blue-500" },
  { name: "Sky", hex: "#0ea5e9", class: "bg-sky-500" },
  { name: "Indigo", hex: "#6366f1", class: "bg-indigo-500" },
  { name: "Violet", hex: "#8b5cf6", class: "bg-violet-500" },
  { name: "Fuchsia", hex: "#d946ef", class: "bg-fuchsia-500" },
  { name: "Pink", hex: "#ec4899", class: "bg-pink-500" },
  { name: "Rose", hex: "#f43f5e", class: "bg-rose-500" },
  { name: "Crimson", hex: "#dc2626", class: "bg-red-600" },
  { name: "Sunset", hex: "#f97316", class: "bg-orange-500" },
  { name: "Amber", hex: "#f59e0b", class: "bg-amber-500" },
  { name: "Gold", hex: "#eab308", class: "bg-yellow-500" },
  { name: "Lime", hex: "#84cc16", class: "bg-lime-500" },
  { name: "Forest", hex: "#10b981", class: "bg-emerald-500" },
  { name: "Teal", hex: "#14b8a6", class: "bg-teal-500" },
  { name: "Cyan", hex: "#06b6d4", class: "bg-cyan-500" },
  { name: "Slate", hex: "#64748b", class: "bg-slate-500" },
  { name: "Midnight", hex: "#1e293b", class: "bg-slate-800" },
  { name: "Black", hex: "#000000", class: "bg-black" },
];

const base64ToBlob = async (url: string) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return blob;
};

export default function StudentsPage() {
  // --- STATE ---
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auth State
  const [isVerified, setIsVerified] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);

  // Form Toggles
  const [showSocials, setShowSocials] = useState(false);

  // Photo State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // Data State
  const [creds, setCreds] = useState({ fullName: '', passcode: '', slug: '', teacherSlug: '' });
  const [formData, setFormData] = useState({
    bio: '',
    color: COLORS[0].hex,
    icon: '',
    isPrivate: false,
    accessCode: '1234',
    socials: {
      instagram: '', youtube: '', tiktok: '',
      website: '', twitter: '', linkedin: '',
      snapchat: '', facebook: '', spotify: '',
      apple_music: '', soundcloud: ''
    }
  });

  // --- HANDLERS ---

  const scrollToForm = () => {
    const element = document.getElementById("profile-editor");
    if (!element) return;
    const yOffset = -20;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

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
    if (!ctx) return;
    canvas.width = 400; canvas.height = 400;
    ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, 400, 400);
    const base64Image = canvas.toDataURL('image/jpeg', 0.8);
    setFormData({ ...formData, icon: base64Image });
    setImageToCrop(null);
  };

  // --- LOGIC: HELPER TO FIND TEACHER ID ---
  const resolveTeacherId = async (slug: string) => {
    if (!slug) return null;
    const { data, error } = await supabase
      .from('teachers')
      .select('id')
      .eq('username', slug)
      .single();

    if (error || !data) {
      return null;
    }
    return data.id;
  };

  // --- REPLACE THIS FUNCTION IN src/app/students/page.tsx ---
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append('slug', creds.slug);
      formPayload.append('passcode', creds.passcode);

      // 1. Call Server Action to Log In
      const result = await loginStudent(formPayload);

      if (result.error) throw new Error("Server Action Error: " + result.error);

      // 2. CHECK AUTH SESSION
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Auth Session Missing. Auth Error: " + (authError?.message || "User is null"));
      }

      // 3. FETCH PROFILE BY ID (with teacher info)
      const { data: artist, error: fetchError } = await supabase
        .from('artists')
        .select(`*, teachers:teacher_id(username)`)
        .eq('id', user.id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(`SUPABASE FETCH ERROR: ${fetchError.message} (Code: ${fetchError.code})`);
      }

      if (!artist) {
        throw new Error(`NO ARTIST ROW FOUND. User ID ${user.id} exists in Auth, but not in 'artists' table.`);
      }

      setArtistId(artist.id);
      setIsVerified(true);

      // Extract teacher username from joined data
      const teacherUsername = (artist.teachers as { username: string } | null)?.username || '';

      setCreds({
        ...creds,
        fullName: artist.full_name,
        teacherSlug: teacherUsername
      });

      setFormData({
        bio: artist.bio || '',
        color: artist.card_color || COLORS[0].hex,
        icon: artist.profile_image_url || '',
        isPrivate: artist.is_private === true,
        accessCode: artist.access_code || '1234',
        socials: {
          instagram: artist.instagram || '',
          youtube: artist.youtube || '',
          tiktok: artist.tiktok || '',
          website: artist.website || '',
          twitter: artist.twitter || '',
          linkedin: artist.linkedin || '',
          snapchat: artist.snapchat || '',
          facebook: artist.facebook || '',
          spotify: artist.spotify || '',
          apple_music: artist.apple_music || '',
          soundcloud: artist.soundcloud || ''
        }
      });

      const hasSocials = [artist.instagram, artist.youtube, artist.tiktok, artist.website].some(s => s && s.length > 0);
      if (hasSocials) setShowSocials(true);

    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC: SUBMIT (Signup OR Update) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let targetUserId = artistId;
      let finalProfileImage = formData.icon;

      // 1. RESOLVE TEACHER ID FIRST
      const resolvedTeacherId = await resolveTeacherId(creds.teacherSlug);

      // SCENARIO A: SIGNUP
      if (mode === 'signup' && !isVerified) {
        const formPayload = new FormData();
        formPayload.append('fullName', creds.fullName);
        formPayload.append('passcode', creds.passcode);
        formPayload.append('slug', creds.slug);

        // Pass these just in case server action uses them
        formPayload.append('teacherSlug', creds.teacherSlug);
        formPayload.append('color', formData.color);
        formPayload.append('accessCode', formData.accessCode || '1234');

        const result = await signupStudent(formPayload);

        if (result.error) {
          throw new Error(result.error);
        }

        targetUserId = result.userId || null;
        setArtistId(targetUserId);
      }

      // SCENARIO B: IMAGE UPLOAD
      if (targetUserId && formData.icon && formData.icon.startsWith('data:image')) {
        finalProfileImage = await uploadProfileImage(targetUserId, formData.icon);
      }

      // SCENARIO C: FORCE UPDATE DB
      if (targetUserId) {
        const { error: updateError } = await supabase
          .from('artists')
          .update({
            full_name: creds.fullName,
            card_color: formData.color,
            profile_image_url: finalProfileImage,
            bio: formData.bio,
            is_private: formData.isPrivate,
            access_code: formData.accessCode,
            teacher_id: resolvedTeacherId,
            instagram: formData.socials.instagram || null,
            youtube: formData.socials.youtube || null,
            tiktok: formData.socials.tiktok || null,
            website: formData.socials.website || null,
          })
          .eq('id', targetUserId);

        if (updateError) throw updateError;
      }

      setSuccess(true);

    } catch (err: any) {
      alert("Action failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper: Upload Image
  const uploadProfileImage = async (uid: string, base64Data: string) => {
    const fileBlob = await base64ToBlob(base64Data);
    const fileName = `profiles/${uid}-${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from('audio-tracks')
      .upload(fileName, fileBlob, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from('audio-tracks').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  // --- RENDER ---
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 overflow-hidden">

      {/* HERO SECTION */}
      <section className="max-w-4xl mx-auto text-center mb-12 animate-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-widest mb-6">
          <Sparkles size={14} /> For Students
        </div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-foreground mb-8">
          Show off your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500">Super Skills.</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10">
          Practicing is hard work. You deserve to show it off! Create your own Studio Card, upload your songs, and share them with your friends and family.
        </p>

        <button
          onClick={scrollToForm}
          className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full shadow-xl shadow-purple-500/30 hover:scale-105 hover:shadow-purple-500/50 transition-all duration-300 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
        >
          <span className="text-xl font-black uppercase tracking-widest text-white">GO</span>
          <ArrowDown className="text-white group-hover:translate-y-1 transition-transform" strokeWidth={3} size={20} />
        </button>
      </section>

      {/* 3. PROFILE EDITOR / ONBOARDING */}
      <section id="profile-editor" className="max-w-3xl mx-auto pt-16 border-t border-zinc-200 dark:border-zinc-800">

        {/* CROP MODAL */}
        <AnimatePresence>
          {imageToCrop && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                  <h3 className="font-black uppercase tracking-widest text-sm">Crop Your Photo</h3>
                  <button onClick={() => setImageToCrop(null)}><X size={20} /></button>
                </div>
                <div className="relative h-80 w-full bg-zinc-200">
                  <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                </div>
                <div className="p-8 space-y-6">
                  <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-blue-600" />
                  <button onClick={createCroppedImage} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Save Crop</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SUCCESS VIEW */}
        {success ? (
          <div className="flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-100 dark:bg-green-900/30 p-8 rounded-full mb-6 text-green-600 dark:text-green-400"><CheckCircle2 size={64} /></motion.div>
            <h1 className="text-4xl font-black mb-4">You're All Set!</h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mb-8">Your studio card is ready to rock. Time to start practicing!</p>
            <div className="flex gap-4">
              <button onClick={() => setSuccess(false)} className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-full font-bold uppercase tracking-widest text-xs">Edit Again</button>
              <button onClick={() => window.location.href = `/${creds.slug || ''}`} className="px-8 py-3 bg-foreground text-background rounded-full font-bold uppercase tracking-widest text-xs">Back Home</button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-full mb-6">
                <button onClick={() => { setMode('signup'); setIsVerified(false); }} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${mode === 'signup' ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>Sign Up</button>
                <button onClick={() => { setMode('login'); setIsVerified(false); }} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${mode === 'login' ? 'bg-white dark:bg-zinc-700 shadow-md text-foreground' : 'text-zinc-500'}`}>Edit Profile</button>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{mode === 'signup' ? "Create Your Card" : "Edit Your Profile"}</h2>
            </div>

            <div className="space-y-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all">

              {/* LOGIN FORM */}
              {!isVerified && mode === 'login' ? (
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Your URL (Slug)</label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input required value={creds.slug} onChange={(e) => setCreds({ ...creds, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="leo-piano" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all lowercase" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Passcode</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input required type="password" value={creds.passcode} onChange={(e) => setCreds({ ...creds, passcode: e.target.value })} placeholder="1234" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                      </div>
                    </div>
                  </div>
                  <button disabled={loading} className="w-full py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest hover:scale-[1.01] transition-transform flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" /> : <>Log In to Edit <ArrowRight size={16} /></>}
                  </button>
                </form>
              ) : (
                /* FULL FORM (Signup OR Editing) */
                <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">

                  {/* CREDENTIALS SECTION */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input required value={creds.fullName} onChange={(e) => setCreds({ ...creds, fullName: e.target.value })} placeholder="Leo Piano" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                      </div>
                    </div>

                    {/* Passcode only needed for Signup */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Passcode</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input required disabled={mode === 'login'} value={creds.passcode} onChange={(e) => setCreds({ ...creds, passcode: e.target.value })} placeholder="1234" className={`w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${mode === 'login' ? 'opacity-50' : ''}`} />
                      </div>
                    </div>

                    {/* Slug is fixed if editing */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Your Custom URL (Slug)</label>
                      <div className="relative">
                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input required disabled={mode === 'login'} value={creds.slug} onChange={(e) => setCreds({ ...creds, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="leo-piano" className={`w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all ${mode === 'login' ? 'opacity-50' : ''}`} />
                      </div>
                    </div>

                    {/* Teacher Code - Locked when editing, required for signup */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">
                        Teacher Code {mode === 'signup' ? '(Required)' : '(Locked)'}
                      </label>
                      <div className="relative">
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                          value={creds.teacherSlug}
                          onChange={(e) => setCreds({ ...creds, teacherSlug: e.target.value })}
                          placeholder="Enter Teacher's Slug"
                          disabled={mode === 'login'}
                          required={mode === 'signup'}
                          className={`w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none focus:ring-2 focus:ring-purple-500 transition-all ${mode === 'login' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        {mode === 'login' && creds.teacherSlug && (
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                        )}
                      </div>
                      {mode === 'login' && (
                        <p className="text-[10px] text-zinc-500 pl-4">Teacher assignment cannot be changed.</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

                  {/* THEME & PHOTO */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 flex items-center gap-2"><Palette size={12} /> Theme Color</label>
                      <div className="flex flex-wrap gap-3">
                        {COLORS.map((c) => (
                          <button type="button" key={c.hex} onClick={() => setFormData({ ...formData, color: c.hex })} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 ${c.class} ${formData.color === c.hex ? 'border-foreground scale-110 ring-2 ring-offset-2 ring-foreground/20' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4 flex items-center gap-2"><Camera size={12} /> Profile Photo (Recommended)</label>
                      <div className="flex items-center gap-6">
                        <div className="relative group shrink-0">
                          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                          <button type="button" onClick={() => fileInputRef.current?.click()} className={`w-24 h-24 rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 shadow-xl flex items-center justify-center relative transition-all hover:scale-105 ${!formData.icon ? 'border-dashed border-zinc-300' : ''}`}>
                            {formData.icon ? <img src={formData.icon} alt="Profile" className="w-full h-full object-cover" /> : <User className="text-zinc-300" size={32} />}
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Upload className="text-white" size={20} /></div>
                          </button>
                        </div>
                        <div className="space-y-2">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors">Select Image</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BIO & SOCIALS */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Mini Bio</label>
                    <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us about yourself..." rows={3} className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" />

                    <button type="button" onClick={() => setShowSocials(!showSocials)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-foreground transition-colors pl-4 mt-6">
                      {showSocials ? "Hide Social Links" : "Add Social Links"} <ChevronDown size={14} className={`transition-transform duration-300 ${showSocials ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showSocials && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            <div className="relative"><Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} /><input value={formData.socials.instagram} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, instagram: e.target.value } })} placeholder="Instagram" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-pink-500 outline-none" /></div>
                            <div className="relative"><Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} /><input value={formData.socials.youtube} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, youtube: e.target.value } })} placeholder="YouTube" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-red-500 outline-none" /></div>
                            <div className="relative"><Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} /><input value={formData.socials.website} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, website: e.target.value } })} placeholder="Website" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                            <div className="relative"><Music className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} /><input value={formData.socials.tiktok} onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, tiktok: e.target.value } })} placeholder="TikTok" className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-xl py-3 pl-10 pr-3 text-sm font-medium focus:ring-2 focus:ring-black outline-none" /></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <button type="button" onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })} className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.isPrivate ? 'bg-red-500' : 'bg-green-500'}`}>
                      <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform duration-300 ${formData.isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* GRANDMA ACCESS CODE (Only Visible if Private) */}
                  {formData.isPrivate && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-4">Grandma Access Code</label>
                      <input
                        value={formData.accessCode}
                        onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                        placeholder="1234"
                        className="w-full bg-zinc-50 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-4 pr-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                      <p className="text-[10px] text-zinc-500 pl-4">Share this code with family so they can view the profile.</p>
                    </div>
                  )}

                  <button
                    disabled={loading}
                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : (mode === 'signup' ? "Create Card" : "Save Changes")}
                  </button>

                </form>
              )}
            </div>
          </>
        )}
      </section>

    </main>
  );
}