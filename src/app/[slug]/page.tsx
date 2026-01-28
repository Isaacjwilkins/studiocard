import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArtistProfile from '@/components/ArtistProfile'; // Import your new component

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: artist } = await supabase.from('artists').select('full_name').eq('slug', slug).single();
  return { title: artist ? `${artist.full_name} | WilkinStudio` : 'Artist Not Found' };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch Artist (including new social columns)
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!artist) return notFound();

  // Fetch Tracks
  const { data: tracks } = await supabase
    .from('tracks')
    .select('*')
    .eq('artist_id', artist.id)
    .order('release_date', { ascending: false });

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-6 pb-4 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-zinc-200/50 dark:from-zinc-900/50 to-transparent -z-10 blur-3xl" />

      
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
          studio.card Artist
        </div>
    

      {/* Render the Client Component */}
      <ArtistProfile artist={artist} tracks={tracks || []} />
    </main>
  );
}