import { supabase } from '@/lib/supabase';
import SongCard from '@/components/SongCard';
import EmailSignup from '@/components/EmailSignup';

export default async function MusicPage() {
  const { data: songs } = await supabase
    .from('music_catalog')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-4xl mx-auto pt-32 pb-20 px-6">
      {/* Header Section */}
      <section className="mb-12 space-y-8"> 
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            The Music
          </h2>
          <h3 className="text-4xl font-semibold tracking-tight text-foreground">
            Music as a Language.
          </h3>
          <div className="text-zinc-800 dark:text-zinc-200 space-y-4 max-w-2xl text-lg leading-relaxed">
            <p>
              To me, music has always been and always will be an expression, an escape, and a language worth learning. 
              All of my work is original composition or arrangement. 
            </p>
            <p>
              See below for a list of all my published music, as well as upcoming releases. 
              Stay in the loop by adding your email to the list below to get notified when they are out!
            </p>
          </div>
        </div>

        {/* Email Signup inserted right here after the text */}
        <div className="max-w-md">
          <EmailSignup />
        </div>
      </section>

      {/* Song Grid */}
      <div className="grid gap-8">
        {songs?.map((song, index) => (
          <SongCard 
            key={song.id} 
            song={song} 
            defaultExpanded={index === 0} 
          />
        ))}
      </div>
    </main>
  );
}