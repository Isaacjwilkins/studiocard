"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download, Share2, Play, Pause, Globe, Instagram, Youtube, Check, 
  Twitter, Linkedin, Facebook, Ghost, Music, CloudLightning, BadgeCheck, Star
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  release_date: string;
  audio_url: string;
  description: string | null;
}

interface Artist {
  full_name: string;
  bio: string | null;
  profile_image_url: string | null;
  card_color: string | null;
  caption: string | null;
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
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function ArtistProfile({ artist, tracks }: { artist: Artist; tracks: Track[] }) {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

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
      if (playingTrackId && audioRefs.current[playingTrackId]) {
        audioRefs.current[playingTrackId]?.pause();
      }
      audio.play();
      setPlayingTrackId(trackId);
    }
  };

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

  const SocialLink = ({ href, icon: Icon, colorClass }: { href: string | null, icon: any, colorClass: string }) => {
    if (!href) return null;
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`p-3 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-foreground transition-all hover:scale-110 ${colorClass}`}
      >
        <Icon size={18} />
      </a>
    );
  };

  return (
    <div 
      style={glassStyle}
      className="w-full max-w-4xl backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden border transition-colors duration-500"
    >
        
      <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">
          
        {/* 1. Artist Column (Left) */}
        <div className="flex flex-col items-center space-y-4">
          
          {/* Circular Profile Picture */}
          <div className="relative aspect-square w-full max-w-[240px] rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black/5">
            {artist.profile_image_url ? (
              <Image 
                src={artist.profile_image_url} 
                alt={artist.full_name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">No Image</div>
            )}
          </div>

          {/* CAPTION (Normal text, above badges) */}
          {artist.caption && (
             <div className="text-center px-2">
                <p className="text-sm font-medium text-foreground/80 leading-snug">
                   {artist.caption}
                </p>
             </div>
          )}

          {/* Badges */}
          {(artist.is_verified || artist.is_premium) && (
            <div className="flex flex-wrap justify-center gap-2">
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
          
          {/* Spacer to push buttons down slightly */}
          <div className="h-1" />

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

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-2 pt-1 w-full px-2">
            <SocialLink href={artist.instagram} icon={Instagram} colorClass="hover:text-pink-600" />
            <SocialLink href={artist.snapchat} icon={Ghost} colorClass="hover:text-yellow-500" />
            <SocialLink href={artist.tiktok} icon={CloudLightning} colorClass="hover:text-black dark:hover:text-white" />
            <SocialLink href={artist.twitter} icon={Twitter} colorClass="hover:text-blue-400" />
            <SocialLink href={artist.youtube} icon={Youtube} colorClass="hover:text-red-600" />
            <SocialLink href={artist.linkedin} icon={Linkedin} colorClass="hover:text-blue-700" />
            <SocialLink href={artist.facebook} icon={Facebook} colorClass="hover:text-blue-600" />
            <SocialLink href={artist.spotify} icon={Music} colorClass="hover:text-green-500" />
            <SocialLink href={artist.apple_music} icon={Music} colorClass="hover:text-red-500" />
            <SocialLink href={artist.website} icon={Globe} colorClass="hover:text-indigo-500" />
          </div>
        </div>

        {/* 2. Details Column (Right) */}
        <div className="space-y-8 mt-4 md:mt-0">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-4 text-center md:text-left">
              {artist.full_name}
            </h1>
            <div className="h-1 w-20 bg-foreground rounded-full mx-auto md:mx-0" />
          </div>

          <div className="prose dark:prose-invert text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium text-center md:text-left">
            {artist.bio || "No biography available."}
          </div>

          {/* 3. Track List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-foreground/50 mb-2 text-center md:text-left">
              Recorded Works
            </h3>
            
            {!tracks || tracks.length === 0 ? (
              <p className="text-zinc-500 italic text-center md:text-left">No tracks released yet.</p>
            ) : (
              tracks.map((track) => {
                const isPlaying = playingTrackId === track.id;

                return (
                  <div 
                    key={track.id} 
                    className={`group relative p-4 rounded-2xl border transition-all duration-300 ${isPlaying ? 'bg-white/20 border-foreground/20 scale-[1.02] shadow-lg' : 'bg-black/5 dark:bg-white/5 border-transparent hover:border-foreground/10'}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePlayToggle(track.id)}
                              className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg shrink-0"
                            >
                                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                            </motion.button>
                            
                            <div>
                                <h4 className="font-bold text-foreground text-lg">{track.title}</h4>
                                <p className="text-xs text-foreground/60 uppercase tracking-wider">{track.release_date}</p>
                            </div>
                        </div>
                        
                        <a href={track.audio_url} download className="p-3 text-foreground/40 hover:text-foreground hover:bg-white/20 rounded-full transition-all">
                            <Download size={20} />
                        </a>
                    </div>

                    <audio 
                      ref={(el) => { audioRefs.current[track.id] = el }}
                      src={track.audio_url}
                      onEnded={() => setPlayingTrackId(null)}
                      onPause={() => setPlayingTrackId(null)}
                      onPlay={() => setPlayingTrackId(track.id)}
                      controls 
                      className="w-full mt-4 h-8 opacity-40 hover:opacity-100 transition-opacity mix-blend-multiply dark:mix-blend-screen" 
                    />

                    {track.description && (
                       <p className="mt-4 text-sm text-foreground/70 pl-2 leading-relaxed border-l-2 border-foreground/10 ml-6">{track.description}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}