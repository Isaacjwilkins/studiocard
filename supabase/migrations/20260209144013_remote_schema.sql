alter table "public"."artists" add column "audio_feedback_url" text;

alter table "public"."teachers" add column "onboarding_completed" boolean default false;

alter table "public"."teachers" add column "survey_data" jsonb;

CREATE INDEX idx_teachers_onboarding ON public.teachers USING btree (onboarding_completed);


  create policy "Allow public uploads"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'audio-tracks'::text));



  create policy "Public Audio Access"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'audio-tracks'::text));



  create policy "Public Audio Upload"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check ((bucket_id = 'audio-tracks'::text));



