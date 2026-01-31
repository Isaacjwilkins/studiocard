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
    .select("id, username, full_name, subscription_tier, max_students")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    // Logged in user is not a teacher (could be a student trying to access studio)
    redirect("/studio?error=not_a_teacher"); 
  }

  // 3. Fetch Students (For capacity & dropdowns)
  const { data: students } = await supabase
    .from("artists")
    .select("id, full_name")
    .eq("teacher_id", teacher.id);

  // 4. Fetch Schedule
  const { data: schedule } = await supabase
    .from("lesson_schedule")
    .select("*")
    .eq("teacher_id", teacher.id);

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <DashboardClient 
        teacher={teacher} 
        students={students || []} 
        schedule={schedule || []} 
      />
    </main>
  );
}