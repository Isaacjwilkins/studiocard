import { createClient } from "@/utils/supabase/server";
import { getStudioSettings } from "@/app/actions";
import AccountForm from "./AccountForm"; 

export const revalidate = 0;

export default async function StudioAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const result = await getStudioSettings();

  // --- DEBUGGING SCREEN ---
  if ('error' in result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-black font-mono">
        <div className="max-w-2xl w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-red-200">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Debug: Access Denied</h1>
          
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <p className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Auth Status</p>
              <p>{user ? `Logged In as ${user.email}` : "Not Logged In"}</p>
              <p className="text-xs text-zinc-400 mt-1">ID: {user?.id}</p>
            </div>

            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <p className="font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Server Action Result</p>
              <pre className="text-red-500 whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl">
              <strong>Hypothesis:</strong> You are likely logged in as a Student/Artist (from previous testing). 
              Student IDs exist in the `artists` table, not the `teachers` table.
            </div>

            {/* FORCE LOGOUT BUTTON */}
            <form action={async () => {
              'use server';
              const sb = await createClient();
              await sb.auth.signOut();
            }}>
              <button className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all">
                Force Log Out
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If successful, render the normal page
  return (
    <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black flex justify-center">
      <AccountForm 
        teacher={result.teacher} 
        studentCount={result.studentCount} 
        authEmail={result.email || ''} 
      />
    </main>
  );
}