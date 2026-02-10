"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Play, Pause, Music, ExternalLink } from 'lucide-react';

interface Artist {
  id: string;
  full_name: string;
  slug: string;
  profile_image_url: string | null;
  card_color: string | null;
  bio: string | null;
  caption: string | null;
}

interface Track {
  id: string;
  title: string;
  audio_url: string;
  created_at: string;
}

interface LiveCardPreviewProps {
  artist: Artist | null;
  tracks: Track[];
}

export default function LiveCardPreview({ artist, tracks }: LiveCardPreviewProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback if no artist found
  if (!artist) {
    return (
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
    );
  }

  const cardColor = artist.card_color || '#ec4899';
  const initials = artist.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handlePlay = (track: Track) => {
    if (playingId === track.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(track.audio_url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingId(null);
      setPlayingId(track.id);
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${cardColor}, #ec4899, #f43f5e)` }}
      />

      {/* Card Container */}
      <div
        className="relative aspect-[4/5] rounded-[2rem] p-1"
        style={{ background: `linear-gradient(135deg, ${cardColor}, #ec4899, #f43f5e)` }}
      >
        <div className="w-full h-full rounded-[1.75rem] bg-zinc-900 flex flex-col text-white overflow-hidden">

          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-[10px] font-mono text-zinc-500">studiocard.live/{artist.slug}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col items-center">
            {/* Profile */}
            <div className="text-center mb-4">
              {artist.profile_image_url ? (
                <img
                  src={artist.profile_image_url}
                  alt={artist.full_name}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3 ring-4 ring-white/10"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black text-white ring-4 ring-white/10"
                  style={{ background: `linear-gradient(135deg, ${cardColor}, #f43f5e)` }}
                >
                  {initials}
                </div>
              )}
              <h3 className="text-xl font-black">{artist.full_name}</h3>
              {artist.caption && (
                <p className="text-white/50 text-xs mt-1">{artist.caption}</p>
              )}
            </div>

            {/* Tracks */}
            <div className="w-full space-y-2 mt-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Recent Recordings
              </p>

              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <button
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className={`w-full h-12 rounded-xl flex items-center px-4 gap-3 transition-all ${
                      playingId === track.id
                        ? 'bg-white text-zinc-900'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      playingId === track.id ? 'bg-zinc-900 text-white' : 'bg-white/20'
                    }`}>
                      {playingId === track.id ? (
                        <Pause size={12} />
                      ) : (
                        <Play size={12} className="ml-0.5" />
                      )}
                    </div>
                    <span className="text-sm font-medium truncate">{track.title}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4 text-white/30 text-sm">
                  No recordings yet
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-4">
            <Link
              href={`/${artist.slug}`}
              className="w-full py-3 rounded-xl bg-white text-zinc-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              View Full Card <ExternalLink size={12} />
            </Link>
          </div>

          {/* Live indicator */}
          <div className="px-4 py-2 text-center border-t border-white/5 bg-zinc-800/30">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-white/40 font-medium">Live Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
        A Real Student
      </div>
    </div>
  );
}
