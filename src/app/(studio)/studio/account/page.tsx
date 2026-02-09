import { createClient } from "@/utils/supabase/server";
import { getStudioSettings } from "@/app/actions";
import AccountForm from "./AccountForm"; 

export const revalidate = 0;

export default async function StudioAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const result = await getStudioSettings();

  // Handle access errors gracefully
  if ('error' in result) {
    return (
      <main className="min-h-screen pt-24 pb-20 px-4 md:px-8 bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-10a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Access Denied</h1>
          <p className="text-zinc-500">
            You need to be logged in as a teacher to access this page.
          </p>
          <form action={async () => {
            'use server';
            const sb = await createClient();
            await sb.auth.signOut();
          }}>
            <button className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-all">
              Sign Out & Try Again
            </button>
          </form>
        </div>
      </main>
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