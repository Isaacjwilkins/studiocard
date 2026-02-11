import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import RecitalsClient from "./RecitalsClient";

export const revalidate = 0;

export default async function RecitalsPage() {
  const supabase = await createClient();

  // Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/studio?mode=signin");
  }

  // Fetch Teacher Profile
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, username, full_name")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    redirect("/studio?error=not_a_teacher");
  }

  // Fetch Recitals with performer count
  const { data: recitals } = await supabase
    .from("recitals")
    .select(`
      id,
      title,
      slug,
      event_date,
      venue,
      is_active,
      created_at,
      recital_performers(id)
    `)
    .eq("teacher_id", teacher.id)
    .order("created_at", { ascending: false });

  // Transform to include performer count
  const recitalsWithCount = (recitals || []).map(recital => ({
    id: recital.id,
    title: recital.title,
    slug: recital.slug,
    event_date: recital.event_date,
    venue: recital.venue,
    is_active: recital.is_active,
    created_at: recital.created_at,
    performer_count: recital.recital_performers?.length || 0
  }));

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <RecitalsClient
        teacher={teacher}
        recitals={recitalsWithCount}
      />
    </main>
  );
}
