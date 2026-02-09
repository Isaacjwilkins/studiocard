"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 
import OnboardingModal from "@/components/OnboardingModal";

export default function OnboardingPage() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      // 1. Check if a user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      let foundProfile = false;

      if (user) {
        // A. LOGGED IN: Try to fetch their real profile
        const { data, error } = await supabase
          .from("teachers")
          .select("id, username, full_name")
          .eq("id", user.id)
          .single();
        
        if (data && !error) {
            setTeacher(data);
            foundProfile = true;
        }
        // Fallback will trigger below if profile not found
      } 
      
      // B. FALLBACK / GUEST MODE
      // If we aren't logged in OR if the profile fetch failed, use Demo mode
      if (!foundProfile) {
        setTeacher({
            username: "example", 
            full_name: "Demo Studio",
            id: "guest"
        });
      }

      setLoading(false);
    };
    
    fetchTeacher();
  }, []);

  if (loading || !teacher) return null; 

  // Navigation Logic
  const handleClose = () => {
      // If we are in guest mode (or failed to load profile), go to login
      if (teacher.id === 'guest') {
          router.push('/studio');
      } else {
          // If we successfully loaded the profile, go to their roster
          router.push(`/studio/${teacher.username}`);
      }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-4">
      <OnboardingModal 
        isOpen={true} 
        onClose={handleClose} 
        teacher={teacher} 
      />
    </main>
  );
}