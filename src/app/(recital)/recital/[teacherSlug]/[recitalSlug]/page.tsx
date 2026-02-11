import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import RecitalProgram from "./RecitalProgram";

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ teacherSlug: string; recitalSlug: string }>;
}) {
  const { teacherSlug, recitalSlug } = await params;

  // Find teacher by username
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, full_name, username")
    .eq("username", teacherSlug)
    .single();

  if (!teacher) return { title: "Recital Not Found" };

  // Find recital
  const { data: recital } = await supabase
    .from("recitals")
    .select("title")
    .eq("teacher_id", teacher.id)
    .eq("slug", recitalSlug)
    .eq("is_active", true)
    .single();

  if (!recital) return { title: "Recital Not Found" };

  return {
    title: `${recital.title} | ${teacher.full_name} | studio.card`,
    description: `Digital recital program for ${recital.title} by ${teacher.full_name}'s studio.`
  };
}

export default async function RecitalPage({
  params
}: {
  params: Promise<{ teacherSlug: string; recitalSlug: string }>;
}) {
  const { teacherSlug, recitalSlug } = await params;

  // Find teacher by username
  const { data: teacher } = await supabase
    .from("teachers")
    .select("id, full_name, username")
    .eq("username", teacherSlug)
    .single();

  if (!teacher) return notFound();

  // Find recital with performers
  const { data: recital } = await supabase
    .from("recitals")
    .select(`
      *,
      recital_performers(*)
    `)
    .eq("teacher_id", teacher.id)
    .eq("slug", recitalSlug)
    .eq("is_active", true)
    .single();

  if (!recital) return notFound();

  // Sort performers by sort_order
  const sortedPerformers = (recital.recital_performers || []).sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  // Check if all instruments are the same (for smart display)
  const instruments: string[] = sortedPerformers
    .filter((p: { is_intermission: boolean }) => !p.is_intermission)
    .map((p: { instrument: string | null }) => p.instrument)
    .filter((i: string | null): i is string => Boolean(i));
  const uniqueInstruments = [...new Set(instruments)];
  const sameInstrument: string | null = uniqueInstruments.length === 1 ? uniqueInstruments[0] : null;

  // Check if all performers have durations (for start time calculation)
  const allHaveDurations = sortedPerformers.every(
    (p: { is_intermission: boolean; estimated_duration_minutes: number | null }) =>
      p.is_intermission || p.estimated_duration_minutes
  );

  return (
    <RecitalProgram
      recital={{
        ...recital,
        recital_performers: sortedPerformers
      }}
      teacher={teacher}
      sameInstrument={sameInstrument}
      canCalculateStartTimes={allHaveDurations && recital.event_date}
    />
  );
}
