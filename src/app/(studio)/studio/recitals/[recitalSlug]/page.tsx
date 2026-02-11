import { redirect, notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import RecitalEditorClient from "./RecitalEditorClient";

export const revalidate = 0;

export default async function RecitalEditorPage({
  params
}: {
  params: Promise<{ recitalSlug: string }>;
}) {
  const { recitalSlug } = await params;
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

  // Fetch Recital
  const { data: recital } = await supabase
    .from("recitals")
    .select(`
      *,
      recital_performers(*)
    `)
    .eq("teacher_id", teacher.id)
    .eq("slug", recitalSlug)
    .single();

  if (!recital) {
    notFound();
  }

  // Sort performers by sort_order
  const sortedPerformers = (recital.recital_performers || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  // Fetch teacher's students for the selector
  const { data: students } = await supabase
    .from("artists")
    .select("id, full_name, profile_image_url, bio, slug")
    .eq("teacher_id", teacher.id)
    .order("full_name");

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <RecitalEditorClient
        teacher={teacher}
        recital={{
          ...recital,
          recital_performers: sortedPerformers
        }}
        students={students || []}
      />
    </main>
  );
}
