import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function StudioHome() {
  const supabase = await createClient();

  // 1. Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/studio?mode=signin");
  }

  // 2. Fetch Teacher Profile (Based on Auth ID)
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, username, full_name, subscription_tier, subscription_status, max_students")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    // Logged in user is not a teacher (could be a student trying to access studio)
    redirect("/studio?error=not_a_teacher");
  }

  // 3. Fetch Students (For capacity & dropdowns)
  const { data: students } = await supabase
    .from("artists")
    .select("id, full_name, profile_image_url")
    .eq("teacher_id", teacher.id);

  // 4. Fetch Schedule
  const { data: schedule } = await supabase
    .from("lesson_schedule")
    .select("*")
    .eq("teacher_id", teacher.id);

  // 5. Fetch Feed (Recent tracks from all students)
  const studentIds = (students || []).map(s => s.id);
  let feedTracks: {
    id: string;
    title: string;
    audio_url: string;
    created_at: string;
    is_read: boolean;
    artist_id: string;
    artist_name: string;
    artist_image: string | null;
  }[] = [];
  let unreadCount = 0;

  if (studentIds.length > 0) {
    const { data: tracks } = await supabase
      .from("tracks")
      .select("id, title, audio_url, created_at, is_read, artist_id")
      .in("artist_id", studentIds)
      .order("created_at", { ascending: false })
      .limit(20);

    if (tracks) {
      feedTracks = tracks.map(track => {
        const artist = (students || []).find(s => s.id === track.artist_id);
        return {
          ...track,
          is_read: track.is_read ?? false,
          artist_name: artist?.full_name || "Unknown",
          artist_image: artist?.profile_image_url || null
        };
      });
      unreadCount = feedTracks.filter(t => !t.is_read).length;
    }
  }

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <DashboardClient
        teacher={teacher}
        students={students || []}
        schedule={schedule || []}
        feedTracks={feedTracks}
        unreadCount={unreadCount}
      />
    </main>
  );
}