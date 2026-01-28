"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  Download, Play, Pause, Globe, Instagram, CloudLightning, BadgeCheck, Star,
  Lock, Unlock, Mic, UploadCloud, Loader2, Trash2, StopCircle, X, 
  Eye, EyeOff, Music, Zap // <--- Added Music back here
} from 'lucide-react';
// --- Types ---
interface Track {
  id: string;
  title: string;
  release_date: string;
  audio_url: string;
  description: string | null;
  artist_id: string;
  created_at?: string;
  is_public: boolean; // Maps to your database column
}

interface Artist {
  id: string;
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  card_color: string | null;
  caption: string | null;
  current_note: string | null;
  current_assignments: string | null;
  passcode?: string;
  is_private: boolean;
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
  const [artist, setArtist] = useState<Artist>(initialArtist);
  const [tracks, setTracks] = useState<Track[]>(initialTracks);

  // UI State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Security State
  const [isPageLocked, setIsPageLocked] = useState(initialArtist.is_private);
  const [pageUnlockInput, setPageUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState(false);

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

  // --- ACTIONS ---

  const refreshTracks = async () => {
    const { data } = await supabase
      .from("tracks")
      .select("*")
      .eq("artist_id", artist.id)
      .order('created_at', { ascending: false });
    if (data) setTracks(data);
  };

  const handlePageUnlock = async () => {
    const { data } = await supabase.from('artists').select('passcode').eq('id', artist.id).single();
    if (data && data.passcode === pageUnlockInput) {
      setIsPageLocked(false);
      setUnlockError(false);
    } else {
      setUnlockError(true);
    }
  };

  const handleManagerLogin = async () => {
    const { data } = await supabase.from('artists').select('passcode').eq('id', artist.id).single();
    if (data && data.passcode === passcodeInput) {
      setIsManager(true);
      setShowLogin(false);
      setIsPageLocked(false);
    } else {
      alert("Incorrect passcode");
    }
  };

  // 1. TRACK VISIBILITY TOGGLE (Robust with Error Handling)
  const toggleTrackVisibility = async (track: Track) => {
    try {
      // Logic: If null/undefined, treat as FALSE (hidden), then toggle
      const currentStatus = track.is_public === true; 
      const newValue = !currentStatus;

      // Optimistic UI Update
      setTracks(currentTracks => 
        currentTracks.map(t => t.id === track.id ? { ...t, is_public: newValue } : t)
      );

      // Database Update
      const { error } = await supabase
        .from('tracks')
        .update({ is_public: newValue })
        .eq('id', track.id);

      // Error Handling
      if (error) {
        console.error("Supabase Save Error:", error.message);
        alert(`Could not save visibility: ${error.message}`);
        
        // Revert UI if save failed
        setTracks(currentTracks => 
          currentTracks.map(t => t.id === track.id ? { ...t, is_public: currentStatus } : t)
        );
      }
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("An unexpected error occurred.");
    }
  };

  const deleteTrack = async (track: Track) => {
    if (!confirm("Delete this track?")) return;
    const { error } = await supabase.from('tracks').delete().eq('id', track.id);
    if (error) alert("Error: " + error.message);
    else await refreshTracks();
  };

  // 2. FILTERING: Logic updated for default=false
  // If Manager: Show all tracks.
  // If Public: Show ONLY tracks where is_public === true.
  const displayedTracks = isManager 
    ? tracks 
    : tracks.filter(t => t.is_public === true); 

  // --- RECORDER ---
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false }
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
      
      // Default new uploads to FALSE (hidden) unless you want them public immediately
      const { error: dbError } = await supabase.from("tracks").insert([{
        artist_id: artist.id, 
        title: trackTitle, 
        audio_url: urlData.publicUrl, 
        release_date: new Date().toISOString(), 
        is_public: false // Default to Hidden
      }]);
      
      if (dbError) throw dbError;
      await refreshTracks();
      setAudioBlob(null); setPreviewUrl(null); setTrackTitle(""); setUploadMode("hidden");
    } catch (err: any) { alert("Upload failed: " + err.message); setUploadMode("select"); }
  };

  // --- HELPERS ---
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

  // --- RENDER ---
  return (
    <div style={glassStyle} className="relative w-full max-w-4xl backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border transition-colors duration-500 min-h-[600px]">

      {/* 1. LOCK SCREEN */}
      {isPageLocked && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-black p-6 text-center animate-in fade-in duration-700">
          <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-white/20">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Private Studio</h2>
            <p className="text-zinc-500 mb-6 font-medium">This profile is currently locked.</p>
            <div className="space-y-3">
              <input type="password" placeholder="Enter Passcode" value={pageUnlockInput} onChange={(e) => setPageUnlockInput(e.target.value)}
                className="w-full p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold text-center tracking-[0.3em] outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={handlePageUnlock} className="w-full py-4 bg-foreground text-background font-black uppercase tracking-widest rounded-xl hover:opacity-90">Unlock</button>
              {unlockError && <p className="text-red-500 text-xs font-bold animate-pulse">Incorrect Passcode</p>}
            </div>
          </div>
        </div>
      )}

      {/* 2. LOGIN MODAL */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm uppercase tracking-widest">Artist Access</h3>
              <button onClick={() => setShowLogin(false)}><X size={20} /></button>
            </div>
            <input type="password" placeholder="Enter Passcode"
              className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl mb-3 font-bold text-center tracking-[0.5em] outline-none focus:ring-2 focus:ring-blue-500"
              value={passcodeInput} onChange={(e) => setPasscodeInput(e.target.value)} />
            <button onClick={handleManagerLogin} className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl">Unlock Studio</button>
          </div>
        </div>
      )}

      {/* 4. MAIN LAYOUT GRID */}
      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">

        {/* --- LEFT COLUMN --- */}
        <div className="flex flex-col items-center space-y-4 w-full">

          {/* Profile Pic - Hidden on Mobile Manager */}
          <div className={`relative aspect-square w-full max-w-[240px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black/5 ${isManager ? 'hidden md:block' : 'block'}`}>
            {artist.profile_image_url ? <Image src={artist.profile_image_url} alt={artist.full_name} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center">No Image</div>}
          </div>

          {/* Badges - Hidden on Mobile Manager */}
          {(artist.is_verified || artist.is_premium) && (
            <div className={`flex flex-wrap justify-center gap-2 my-1 ${isManager ? 'hidden md:flex' : 'flex'}`}>
              {artist.is_verified && <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/10"><BadgeCheck className="text-blue-500" size={14} /><span className="text-[10px] font-bold uppercase text-foreground/80">5 Day Streak</span></div>}
              {artist.is_premium && <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/10"><Zap className="text-amber-500 fill-amber-500" size={12} /><span className="text-[10px] font-bold uppercase text-foreground/80">Pro</span></div>}
            </div>
          )}

          {/* Practice Mode Button - Always visible, mobile & desktop */}
          <button
            onClick={() => isManager ? setIsManager(false) : setShowLogin(true)}
            className={`flex items-center justify-center gap-2 mt-3 px-6 py-3 rounded-full
    bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500
    hover:from-indigo-400 hover:via-violet-400 hover:to-fuchsia-400
    text-white shadow-xl shadow-indigo-500/40
    text-xs font-black uppercase tracking-widest
    transition-all hover:scale-[1.02]
    flex`}
          >
            {isManager ? <Unlock size={16} /> : <Lock size={16} />}
            {isManager ? "Exit Practice Mode" : "Practice Mode"}
          </button>

          {/* Socials - Hidden on Mobile Manager */}
          <div className={`flex flex-wrap justify-center gap-2 w-full px-2 ${isManager ? 'hidden md:flex' : 'flex'}`}>
            <SocialLink href={artist.instagram} icon={Instagram} colorClass="hover:text-pink-600" />
            <SocialLink href={artist.website} icon={Globe} colorClass="hover:text-indigo-500" />
            {/* Add other socials */}
          </div>

          {/* STUDENT DASHBOARD - Always visible if Manager. Mobile: Appears here (top of flow). Desktop: Appears in Sidebar. */}
          {isManager && (artist.current_assignments || artist.current_note) && (
            <div className="w-full mt-2 space-y-4 animate-in slide-in-from-bottom-2">
              {artist.current_assignments && (
                <div
                  className="p-5 rounded-r-xl rounded-l-md shadow-sm border-y border-r border-l-[6px] bg-white dark:bg-zinc-900 transition-colors"
                  style={{ borderLeftColor: artist.card_color || '#000', borderColor: hexToRgba(artist.card_color, 0.2) }}
                >
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <CloudLightning size={12} style={{ color: artist.card_color || 'currentColor' }} /> Current Assignments
                  </h4>
                  <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">{artist.current_assignments}</p>
                </div>
              )}
              {artist.current_note && (
                <div
                  className="p-5 rounded-r-xl rounded-l-md shadow-sm border-y border-r border-l-[6px] bg-white dark:bg-zinc-900 transition-colors"
                  style={{ borderLeftColor: artist.card_color || '#000', borderColor: hexToRgba(artist.card_color, 0.1) }}
                >
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                    <Music size={12} style={{ color: artist.card_color || 'currentColor' }} /> Teacher's Note
                  </h4>
                  <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">"{artist.current_note}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="space-y-8 mt-4 md:mt-0 w-full min-w-0">

          {/* Name & Bio - Hidden on Mobile Manager (Name is in header) */}
          <div className={isManager ? 'hidden md:block' : 'block'}>
            <div className="mb-4 text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground break-words leading-tight">{artist.full_name}</h1>
              <div className="h-1 w-20 bg-foreground rounded-full mx-auto md:mx-0 mt-4" />
            </div>
            <div className="prose dark:prose-invert text-foreground/80 font-medium text-center md:text-left">
              {artist.bio || "No biography available."}
            </div>
          </div>

          {/* MANAGER STUDIO PANEL - Always visible if Manager */}
          {isManager && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl animate-in slide-in-from-top-4 shadow-sm">
              {uploadMode === "hidden" ? (
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={startRecording} className="flex flex-col items-center gap-2 p-6 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-2xl transition-colors">
                    <Mic size={24} /> <span className="text-xs font-black uppercase">Record</span>
                  </button>
                  <label className="flex flex-col items-center gap-2 p-6 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl transition-colors cursor-pointer">
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
                    className="w-full p-3 bg-zinc-100 dark:bg-black rounded-xl font-bold text-zinc-900 dark:text-white"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setUploadMode("hidden")} className="flex-1 py-3 font-bold opacity-50 text-zinc-900 dark:text-white">Cancel</button>
                    <button onClick={publishTrack} className="flex-1 py-3 bg-foreground text-background rounded-xl font-bold">Publish</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 gap-2 font-bold text-zinc-500"><Loader2 className="animate-spin" /> Uploading...</div>
              )}
            </div>
          )}

          {/* TRACK LIST - Always Visible */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] opacity-50 mb-2 text-center md:text-left">Recordings</h3>

            {!displayedTracks.length ? (
              <p className="italic opacity-50 text-center md:text-left">
                {isManager ? "No tracks yet." : "No public tracks available."}
              </p>
            ) : (
              displayedTracks.map((track) => {
                const isPlaying = playingTrackId === track.id;
                // Default to false (hidden) if null/undefined
                const isPublic = track.is_public === true;

                return (
                  <div key={track.id} className={`relative p-4 rounded-2xl border transition-all ${isPlaying ? 'bg-white/20 border-foreground/20' : 'bg-black/5 dark:bg-white/5 border-transparent'}`}>
                    <div className="flex items-center justify-between mb-3">

                      {/* Play Button & Title */}
                      <div className="flex items-center gap-4 overflow-hidden">
                        <button onClick={() => handlePlayToggle(track.id)} className="w-12 h-12 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg">
                          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                        </button>
                        <div className="min-w-0">
                          <h4 className={`font-bold text-lg truncate pr-2 ${!isPublic && isManager ? 'opacity-50' : ''}`}>
                            {track.title}
                          </h4>
                          <p className="text-xs opacity-60 uppercase tracking-wider">{new Date(track.created_at || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0 items-center">
                        {/* Download / Open in New Tab */}
                        <a
                          href={track.audio_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 opacity-40 hover:opacity-100 transition-opacity"
                        >
                          <Download size={20} />
                        </a>

                        {/* Manager Only Actions */}
                        {isManager && (
                          <>
                            {/* Visibility Toggle */}
                            <button
                              onClick={() => toggleTrackVisibility(track)}
                              className={`p-2 transition-all hover:bg-black/5 rounded-lg ${isPublic ? 'opacity-100 text-foreground' : 'opacity-100 text-red-500'}`}
                              title={isPublic ? "Public: Click to Hide" : "Hidden: Click to Show"}
                            >
                              {isPublic ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>

                            {/* Delete */}
                            <button onClick={() => deleteTrack(track)} className="p-2 text-red-500 opacity-60 hover:opacity-100 hover:bg-red-500/10 rounded-lg transition-all">
                              <Trash2 size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <audio ref={(el) => { audioRefs.current[track.id] = el }} src={track.audio_url} onEnded={() => setPlayingTrackId(null)} className="hidden" />
                  </div>
                );
              })
            )}
          </div>

          {/* PRIVACY TOGGLE - Redirects to Profiles Page */}
          {isManager && (
            <div className="pt-8 border-t border-foreground/10">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-foreground/5">
                <div className="flex items-center gap-3">
                  {artist.is_private ? <Lock size={20} className="text-red-500" /> : <Globe size={20} className="text-green-500" />}
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">Privacy</span>
                    <span className="text-xs opacity-60">{artist.is_private ? "Locked" : "Public"}</span>
                  </div>
                </div>
                <button
                  onClick={() => window.location.href = '/students'}
                  className="px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors bg-white/10 hover:bg-white/20 text-foreground"
                >
                  Manage
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}