"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, Share2, Play, Pause, Globe, Instagram, Youtube, Check,
  Twitter, Linkedin, Facebook, Ghost, Music, CloudLightning, BadgeCheck, Star,
  Lock, Unlock, Mic, UploadCloud, Loader2, Trash2, StopCircle, X
} from 'lucide-react';

// --- Types ---
interface Track {
  id: string;
  title: string;
  release_date: string;
  audio_url: string;
  description: string | null;
  artist_id: string;
}

interface Artist {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  card_color: string | null;
  caption: string | null;
  passcode?: string;
  // Socials
  website: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
  snapchat: string | null;
  facebook: string | null;
  tiktok: string | null;
  spotify: string | null;
  apple_music: string | null;
  soundcloud: string | null;
  // Badges
  is_verified: boolean;
  is_premium: boolean;
}

const hexToRgba = (hex: string | null, alpha: number) => {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ArtistProfile({ artist: initialArtist, tracks: initialTracks }: { artist: Artist; tracks: Track[] }) {
  // Data State
  const [artist] = useState<Artist>(initialArtist);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  // UI State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Manager State
  const [showLogin, setShowLogin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [uploadMode, setUploadMode] = useState<"hidden" | "select" | "record" | "uploading">("hidden");

  // Recorder State
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [trackTitle, setTrackTitle] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. REFRESH DATA ---
  const refreshTracks = async () => {
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .eq("artist_id", artist.id)
      .order('created_at', { ascending: false });
    if (data) setTracks(data);
  };

  // --- 2. MANAGER ACTIONS ---
  const handleLogin = async () => {
    // Verify passcode against DB
    const { data } = await supabase
      .from('artists')
      .select('passcode')
      .eq('id', artist.id)
      .single();

    if (data && data.passcode === passcodeInput) {
      setIsManager(true);
      setShowLogin(false);
    } else {
      alert("Incorrect passcode");
    }
  };

  const deleteTrack = async (track: Track) => {
    if (!confirm("Are you sure you want to delete this track? This cannot be undone.")) return;

    // 1. Delete from DB
    const { error } = await supabase.from('tracks').delete().eq('id', track.id);
    if (error) {
      alert("Error deleting track: " + error.message);
      return;
    }

    // 2. (Optional) Delete from Storage - tricky to get path from URL, 
    // so we'll just remove the DB link for now to be safe and fast.

    // 3. Refresh
    await refreshTracks();
  };

  // --- 3. RECORDER LOGIC (Music Optimized) ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
        setUploadMode("select");
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setUploadMode("record");
      setRecordingDuration(0);
      timerRef.current = setInterval(() => setRecordingDuration(d => d + 1), 1000);
    } catch (err) { alert("Microphone access denied."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && uploadMode === "record") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const publishTrack = async () => {
    if (!audioBlob || !trackTitle) return;
    setUploadMode("uploading");

    try {
      const fileName = `${artist.id}/${Date.now()}.webm`;
      const { error: uploadError } = await supabase.storage.from("audio-tracks").upload(fileName, audioBlob);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("audio-tracks").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("tracks").insert([{
        artist_id: artist.id,
        title: trackTitle,
        audio_url: urlData.publicUrl,
        release_date: new Date().toISOString()
      }]);

      if (dbError) throw dbError;

      await refreshTracks();
      setAudioBlob(null);
      setPreviewUrl(null);
      setTrackTitle("");
      setUploadMode("hidden");
    } catch (err: any) {
      alert("Upload failed: " + err.message);
      setUploadMode("select");
    }
  };

  // --- RENDER HELPERS ---
  const glassStyle = {
    backgroundColor: hexToRgba(artist.card_color, 0.5),
    borderColor: hexToRgba(artist.card_color, 0.2),
  };

  const handlePlayToggle = (trackId: string) => {
    const audio = audioRefs.current[trackId];
    if (!audio) return;
    if (playingTrackId === trackId) {
      audio.pause();
      setPlayingTrackId(null);
    } else {
      if (playingTrackId && audioRefs.current[playingTrackId]) audioRefs.current[playingTrackId]?.pause();
      audio.play();
      setPlayingTrackId(trackId);
    }
  };

  const SocialLink = ({ href, icon: Icon, colorClass }: { href: string | null, icon: any, colorClass: string }) => {
    if (!href) return null;
    return (
      <a href={href} target="_blank" rel="noopener" className={`p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-all hover:scale-110 ${colorClass}`}>
        <Icon size={18} />
      </a>
    );
  };

  // --- SHARE FUNCTION ---
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `${artist.full_name} on WilkinStudio`,
      text: `Listen to ${artist.full_name}'s latest recordings.`,
      url: url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch (err) { console.error(err); }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div style={glassStyle} className="w-full max-w-4xl backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border transition-colors duration-500">

      {/* MANAGER LOGIN OVERLAY */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm uppercase tracking-widest">Artist Access</h3>
              <button onClick={() => setShowLogin(false)}><X size={20} /></button>
            </div>
            <input
              type="password"
              placeholder="Enter Passcode"
              className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl mb-3 font-bold text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
            />
            <button onClick={handleLogin} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl">Unlock Studio</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">

        {/* LEFT COLUMN: Artist Info */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative aspect-square w-full max-w-[240px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black/5">
            {artist.profile_image_url ? <Image src={artist.profile_image_url} alt={artist.full_name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Image</div>}
          </div>

          {/* Badges */}
          {(artist.is_verified || artist.is_premium) && (
            <div className="flex flex-wrap justify-center gap-2 my-1">
              {artist.is_verified && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5">
                  <BadgeCheck className="text-blue-500" size={14} strokeWidth={2.5} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">Verified</span>
                </div>
              )}
              {artist.is_premium && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/5">
                  <Star className="text-amber-500 fill-amber-500" size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">Premium</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => isManager ? setIsManager(false) : setShowLogin(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-widest transition-all"
          >
            {isManager ? <><Unlock size={14} /> Student Active</> : <><Lock size={14} /> Artist Login</>}
          </button>

{/* Share Button */}
<motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-foreground text-background text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span 
                  key="copied"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <Check size={14} /> Copied!
                </motion.span>
              ) : (
                <motion.span 
                  key="share"
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Share2 size={14} /> Share Profile
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Socials Block */}
          <div className="flex flex-wrap justify-center gap-2 w-full px-2">
            <SocialLink href={artist.instagram} icon={Instagram} colorClass="hover:text-pink-600" />
            <SocialLink href={artist.website} icon={Globe} colorClass="hover:text-indigo-500" />
            {/* Add other socials here as needed */}
          </div>
        </div>

        {/* RIGHT COLUMN: Content */}
        <div className="space-y-8 mt-4 md:mt-0">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-center md:text-left">{artist.full_name}</h1>
            <div className="h-1 w-20 bg-foreground rounded-full mx-auto md:mx-0" />
          </div>

          <div className="prose dark:prose-invert text-foreground/80 font-medium text-center md:text-left">
            {artist.bio || "No biography available."}
          </div>

          {/* STUDIO MANAGER PANEL */}
          {isManager && (
            <div className="bg-black/5 dark:bg-white/5 border border-foreground/10 p-6 rounded-3xl animate-in slide-in-from-top-4">
              {uploadMode === "hidden" ? (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={startRecording} className="flex flex-col items-center gap-2 p-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-colors">
                    <Mic size={24} /> <span className="text-xs font-black uppercase">Record</span>
                  </button>
                  <label className="flex flex-col items-center gap-2 p-6 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-2xl transition-colors cursor-pointer">
                    <UploadCloud size={24} /> <span className="text-xs font-black uppercase">Upload</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) { setAudioBlob(file); setPreviewUrl(URL.createObjectURL(file)); setUploadMode("select"); }
                    }} />
                  </label>
                </div>
              ) : uploadMode === "record" ? (
                <div className="text-center py-8">
                  <div className="text-4xl font-mono font-black text-red-500 animate-pulse mb-4">
                    {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
                  </div>
                  <button onClick={stopRecording}><StopCircle size={64} className="text-red-500" /></button>
                </div>
              ) : uploadMode === "select" ? (
                <div className="space-y-4">
                  <audio controls src={previewUrl!} className="w-full" />
                  <input
                    value={trackTitle}
                    onChange={(e) => setTrackTitle(e.target.value)}
                    placeholder="Track Title..."
                    className="w-full p-3 bg-white/50 dark:bg-black/50 rounded-xl font-bold"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setUploadMode("hidden")} className="flex-1 py-3 font-bold opacity-50">Cancel</button>
                    <button onClick={publishTrack} className="flex-1 py-3 bg-foreground text-background rounded-xl font-bold">Publish</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 gap-2 font-bold"><Loader2 className="animate-spin" /> Uploading...</div>
              )}
            </div>
          )}

          {/* TRACK LIST */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-50 mb-2">Recordings</h3>

            {!tracks.length ? <p className="italic opacity-50">No tracks yet.</p> : tracks.map((track) => {
              const isPlaying = playingTrackId === track.id;
              return (
                <div key={track.id} className={`relative p-4 rounded-2xl border transition-all ${isPlaying ? 'bg-white/20 border-foreground/20' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <button onClick={() => handlePlayToggle(track.id)} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                      </button>
                      <div>
                        <h4 className="font-bold text-lg">{track.title}</h4>
                        <p className="text-xs opacity-60 uppercase tracking-wider">{new Date(track.created_at || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href={track.audio_url} download className="p-2 opacity-40 hover:opacity-100 transition-opacity"><Download size={20} /></a>
                      {/* DELETE BUTTON (Only shows if Manager) */}
                      {isManager && (
                        <button onClick={() => deleteTrack(track)} className="p-2 text-red-500 opacity-60 hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                  <audio ref={(el) => { audioRefs.current[track.id] = el }} src={track.audio_url} onEnded={() => setPlayingTrackId(null)} className="hidden" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}