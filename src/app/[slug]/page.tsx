import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// This makes the page load fast by caching it, 
// revalidating only when you add new data (or set to 0 for instant updates)
export const revalidate = 60; 

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: artist } = await supabase.from('artists').select('full_name').eq('slug', params.slug).single();
  return { title: artist ? `${artist.full_name} | WilkinStudio` : 'Artist Not Found' };
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  // 1. Fetch Artist
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!artist) return notFound();

  // 2. Fetch their Tracks
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist_id', artist.id)
    .order('release_date', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-20 px-6 min-h-screen">
      
      {/* Navigation Back */}
      <div className="mb-8">
        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-foreground transition-colors">
          ← Back to Studio
        </Link>
      </div>

      {/* Artist Profile Header */}
      <div className="grid md:grid-cols-[1fr_200px] gap-8 items-start mb-16">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
            {artist.full_name}
          </h1>
          <div className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-xl whitespace-pre-wrap">
            {artist.bio}
          </div>
        </div>
        
        {/* Artist Photo */}
        {artist.profile_image_url && (
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src={artist.profile_image_url} 
              alt={artist.full_name}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Track List */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 mb-6">
          Recorded Sessions
        </h2>
        
        {tracks?.map((track) => (
          <div key={track.id} className="p-6 rounded-2xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-black/40 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-bold text-foreground">{track.title}</h3>
                <span className="text-[10px] font-mono opacity-50 uppercase">{track.release_date}</span>
              </div>
              
              {/* Custom Audio Player Styling */}
              <audio controls className="w-full h-8 mt-2 opacity-80 hover:opacity-100 transition-opacity">
                <source src={track.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              
              {track.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                  {track.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}