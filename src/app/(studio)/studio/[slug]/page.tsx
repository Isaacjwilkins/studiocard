import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import TeacherDashboard from '@/components/TeacherDashboard'; 

export const revalidate = 0;

export default async function StudioDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Guard against file conflicts
  if (slug === 'account') return null;

  const supabase = await createClient();

  // 1. Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/studio?mode=signin");
  }

  // 2. Fetch Teacher Profile
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, username, full_name")
    .eq("username", slug) 
    .single();

  // 3. Security Check
  if (!teacher || teacher.id !== user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 text-center">
          <h1 className="text-2xl font-black text-red-500 mb-2">Access Denied</h1>
          <p className="text-zinc-500 font-medium mb-6">You do not have permission to manage this studio.</p>
          <a href="/studio" className="px-6 py-3 bg-foreground text-background rounded-xl font-bold text-sm uppercase tracking-widest">
            Go to My Studio
          </a>
        </div>
      </div>
    );
  }

  // 4. Fetch Students (Alphabetical Order)
  const { data: students } = await supabase
    .from('artists')
    .select('*')
    .eq('teacher_id', teacher.id)
    .order('full_name', { ascending: true }); // ALPHABETICAL SORT

  const studentIds = students?.map(s => s.id) || [];

  // 5. Fetch Recent Tracks (Limit 50 to keep it snappy)
  let allTracks: any[] = [];
  if (studentIds.length > 0) {
    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .in('artist_id', studentIds)
      .order('created_at', { ascending: false })
      .limit(50);
    allTracks = tracks || [];
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <TeacherDashboard 
        teacher={teacher} 
        students={students || []} 
        initialTracks={allTracks} 
      />
    </main>
  );
}