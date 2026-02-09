import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export const revalidate = 0;

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/studio?mode=signin");
  }

  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, username")
    .eq("id", user.id)
    .single();

  if (!teacher) {
    redirect("/studio?error=not_a_teacher");
  }

  const { data: students } = await supabase
    .from("artists")
    .select("id, full_name, slug, profile_image_url, is_private")
    .eq("teacher_id", teacher.id)
    .order("full_name", { ascending: true });

  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black tracking-tighter mb-2">Your Students</h1>
          <p className="text-zinc-500 font-medium">Manage your student profiles.</p>
        </div>

        {!students?.length ? (
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-200 dark:border-white/10">
            <p className="text-zinc-500">No students yet.</p>
            <Link href="/studio/dashboard" className="mt-4 inline-block text-sm font-bold text-indigo-500 hover:underline">
              Go to Dashboard to add students
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/${student.slug}`}
                className="block bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-zinc-200 dark:border-white/10 hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {student.profile_image_url && (
                      <img src={student.profile_image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">{student.full_name}</p>
                    <p className="text-xs text-zinc-500">/{student.slug}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    student.is_private
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-600'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-600'
                  }`}>
                    {student.is_private ? 'Private' : 'Public'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
