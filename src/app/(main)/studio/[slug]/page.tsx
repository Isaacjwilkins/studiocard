// src/app/studio/[slug]/page.tsx

import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
// IMPORTANT: No curly braces around TeacherDashboard
import TeacherDashboard from '@/components/TeacherDashboard'; 

export const revalidate = 0; 

export default async function TeacherPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: teacher, error: teacherError } = await supabase
    .from('teachers')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!teacher || teacherError) return notFound();

  const { data: students } = await supabase
    .from('artists')
    .select('*')
    .eq('teacher_id', teacher.id)
    .order('full_name', { ascending: true });

  const studentIds = students?.map(s => s.id) || [];

  let allTracks: any[] = [];
  if (studentIds.length > 0) {
    const { data: tracks } = await supabase
      .from('tracks')
      .select('*')
      .in('artist_id', studentIds)
      .order('created_at', { ascending: false });
    allTracks = tracks || [];
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      {/* This will now be defined */}
      <TeacherDashboard 
        teacher={teacher} 
        students={students || []} 
        initialTracks={allTracks} 
      />
    </main>
  );
}