
  create table "public"."artists" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "slug" text not null,
    "full_name" text not null,
    "bio" text,
    "profile_image_url" text,
    "is_active" boolean default true,
    "instagram" text,
    "website" text,
    "youtube" text,
    "twitter" text,
    "linkedin" text,
    "snapchat" text,
    "facebook" text,
    "tiktok" text,
    "spotify" text,
    "apple_music" text,
    "soundcloud" text,
    "is_verified" boolean default false,
    "is_premium" boolean default false,
    "card_color" text default '#ffffff'::text,
    "caption" text,
    "is_private" boolean default false,
    "teacher_id" uuid,
    "current_assignments" text,
    "current_note" text,
    "email" text,
    "phone_number" text,
    "parent_name" text,
    "is_pro" boolean default false,
    "access_code" text
      );


alter table "public"."artists" enable row level security;


  create table "public"."contact_inquiries" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "full_name" text not null,
    "inquiry_type" text,
    "message" text not null,
    "email" text
      );


alter table "public"."contact_inquiries" enable row level security;


  create table "public"."lesson_audios" (
    "id" uuid not null default gen_random_uuid(),
    "lesson_id" uuid,
    "title" text not null,
    "audio_url" text not null,
    "duration_seconds" integer default 0,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."lesson_audios" enable row level security;


  create table "public"."lesson_schedule" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "teacher_id" uuid,
    "student_id" uuid,
    "day_of_week" integer not null,
    "start_time" time without time zone not null,
    "duration_minutes" integer default 30,
    "notes" text
      );



  create table "public"."lessons" (
    "id" uuid not null default gen_random_uuid(),
    "card_id" uuid,
    "title" text not null,
    "description" text,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone default now(),
    "slug" text,
    "is_premium" boolean default false
      );


alter table "public"."lessons" enable row level security;


  create table "public"."music_catalog" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "title" text not null,
    "description" text,
    "mood_tags" text[],
    "youtube_url" text,
    "sheet_music_url" text,
    "spotify_url" text,
    "is_featured" boolean default false,
    "long_description" text,
    "image_gallery" text[] default '{}'::text[],
    "release_date" date
      );


alter table "public"."music_catalog" enable row level security;


  create table "public"."profile_requests" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone default now(),
    "request_type" text,
    "user_name" text,
    "user_passcode" text,
    "requested_changes" jsonb,
    "status" text default 'PENDING'::text
      );


alter table "public"."profile_requests" enable row level security;


  create table "public"."student_progress" (
    "id" uuid not null default gen_random_uuid(),
    "lesson_id" uuid,
    "completed_at" timestamp with time zone default now(),
    "artist_id" uuid
      );


alter table "public"."student_progress" enable row level security;


  create table "public"."subscribers" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "email" text not null,
    "status" text default 'active'::text
      );


alter table "public"."subscribers" enable row level security;


  create table "public"."subscription_codes" (
    "code" text not null,
    "tier" text not null,
    "is_used" boolean default false,
    "used_by" uuid
      );


alter table "public"."subscription_codes" enable row level security;


  create table "public"."teacher_cards" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "instrument" text not null,
    "description" text,
    "image_url" text,
    "theme_color" text default '#3b82f6'::text,
    "created_at" timestamp with time zone default now(),
    "slug" text
      );


alter table "public"."teacher_cards" enable row level security;


  create table "public"."teachers" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "slug" text,
    "passcode" text,
    "created_at" timestamp with time zone default now(),
    "email" text,
    "username" text,
    "subscription_tier" text default 'base'::text,
    "is_active" boolean default true,
    "max_students" integer default 5
      );


alter table "public"."teachers" enable row level security;


  create table "public"."tracks" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "artist_id" uuid not null,
    "title" text not null,
    "audio_url" text not null,
    "description" text,
    "release_date" date default CURRENT_DATE,
    "is_public" boolean default false
      );


alter table "public"."tracks" enable row level security;

CREATE UNIQUE INDEX artists_pkey ON public.artists USING btree (id);

CREATE INDEX artists_slug_idx ON public.artists USING btree (slug);

CREATE UNIQUE INDEX artists_slug_key ON public.artists USING btree (slug);

CREATE UNIQUE INDEX contact_inquiries_pkey ON public.contact_inquiries USING btree (id);

CREATE INDEX idx_artists_teacher_id ON public.artists USING btree (teacher_id);

CREATE INDEX idx_lessons_slug ON public.lessons USING btree (slug, card_id);

CREATE INDEX idx_progress_artist ON public.student_progress USING btree (artist_id);

CREATE INDEX idx_teacher_cards_slug ON public.teacher_cards USING btree (slug);

CREATE UNIQUE INDEX lesson_audios_pkey ON public.lesson_audios USING btree (id);

CREATE UNIQUE INDEX lesson_schedule_pkey ON public.lesson_schedule USING btree (id);

CREATE UNIQUE INDEX lessons_pkey ON public.lessons USING btree (id);

CREATE UNIQUE INDEX music_catalog_pkey ON public.music_catalog USING btree (id);

CREATE UNIQUE INDEX profile_requests_pkey ON public.profile_requests USING btree (id);

CREATE UNIQUE INDEX student_progress_pkey ON public.student_progress USING btree (id);

CREATE UNIQUE INDEX subscribers_email_key ON public.subscribers USING btree (email);

CREATE UNIQUE INDEX subscribers_pkey ON public.subscribers USING btree (id);

CREATE UNIQUE INDEX subscription_codes_pkey ON public.subscription_codes USING btree (code);

CREATE UNIQUE INDEX teacher_cards_pkey ON public.teacher_cards USING btree (id);

CREATE UNIQUE INDEX teacher_cards_slug_key ON public.teacher_cards USING btree (slug);

CREATE UNIQUE INDEX teachers_pkey ON public.teachers USING btree (id);

CREATE UNIQUE INDEX teachers_slug_key ON public.teachers USING btree (slug);

CREATE UNIQUE INDEX teachers_username_key ON public.teachers USING btree (username);

CREATE UNIQUE INDEX tracks_pkey ON public.tracks USING btree (id);

alter table "public"."artists" add constraint "artists_pkey" PRIMARY KEY using index "artists_pkey";

alter table "public"."contact_inquiries" add constraint "contact_inquiries_pkey" PRIMARY KEY using index "contact_inquiries_pkey";

alter table "public"."lesson_audios" add constraint "lesson_audios_pkey" PRIMARY KEY using index "lesson_audios_pkey";

alter table "public"."lesson_schedule" add constraint "lesson_schedule_pkey" PRIMARY KEY using index "lesson_schedule_pkey";

alter table "public"."lessons" add constraint "lessons_pkey" PRIMARY KEY using index "lessons_pkey";

alter table "public"."music_catalog" add constraint "music_catalog_pkey" PRIMARY KEY using index "music_catalog_pkey";

alter table "public"."profile_requests" add constraint "profile_requests_pkey" PRIMARY KEY using index "profile_requests_pkey";

alter table "public"."student_progress" add constraint "student_progress_pkey" PRIMARY KEY using index "student_progress_pkey";

alter table "public"."subscribers" add constraint "subscribers_pkey" PRIMARY KEY using index "subscribers_pkey";

alter table "public"."subscription_codes" add constraint "subscription_codes_pkey" PRIMARY KEY using index "subscription_codes_pkey";

alter table "public"."teacher_cards" add constraint "teacher_cards_pkey" PRIMARY KEY using index "teacher_cards_pkey";

alter table "public"."teachers" add constraint "teachers_pkey" PRIMARY KEY using index "teachers_pkey";

alter table "public"."tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."artists" add constraint "artists_slug_key" UNIQUE using index "artists_slug_key";

alter table "public"."artists" add constraint "artists_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL not valid;

alter table "public"."artists" validate constraint "artists_teacher_id_fkey";

alter table "public"."lesson_audios" add constraint "lesson_audios_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_audios" validate constraint "lesson_audios_lesson_id_fkey";

alter table "public"."lesson_schedule" add constraint "lesson_schedule_student_id_fkey" FOREIGN KEY (student_id) REFERENCES public.artists(id) ON DELETE SET NULL not valid;

alter table "public"."lesson_schedule" validate constraint "lesson_schedule_student_id_fkey";

alter table "public"."lesson_schedule" add constraint "lesson_schedule_teacher_id_fkey" FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE not valid;

alter table "public"."lesson_schedule" validate constraint "lesson_schedule_teacher_id_fkey";

alter table "public"."lessons" add constraint "lessons_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.teacher_cards(id) ON DELETE CASCADE not valid;

alter table "public"."lessons" validate constraint "lessons_card_id_fkey";

alter table "public"."student_progress" add constraint "student_progress_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON DELETE CASCADE not valid;

alter table "public"."student_progress" validate constraint "student_progress_artist_id_fkey";

alter table "public"."student_progress" add constraint "student_progress_lesson_id_fkey" FOREIGN KEY (lesson_id) REFERENCES public.lessons(id) ON DELETE CASCADE not valid;

alter table "public"."student_progress" validate constraint "student_progress_lesson_id_fkey";

alter table "public"."subscribers" add constraint "subscribers_email_key" UNIQUE using index "subscribers_email_key";

alter table "public"."subscription_codes" add constraint "subscription_codes_used_by_fkey" FOREIGN KEY (used_by) REFERENCES public.teachers(id) not valid;

alter table "public"."subscription_codes" validate constraint "subscription_codes_used_by_fkey";

alter table "public"."teacher_cards" add constraint "teacher_cards_slug_key" UNIQUE using index "teacher_cards_slug_key";

alter table "public"."teachers" add constraint "teachers_slug_key" UNIQUE using index "teachers_slug_key";

alter table "public"."teachers" add constraint "teachers_username_key" UNIQUE using index "teachers_username_key";

alter table "public"."tracks" add constraint "tracks_artist_id_fkey" FOREIGN KEY (artist_id) REFERENCES public.artists(id) not valid;

alter table "public"."tracks" validate constraint "tracks_artist_id_fkey";

grant delete on table "public"."artists" to "anon";

grant insert on table "public"."artists" to "anon";

grant references on table "public"."artists" to "anon";

grant select on table "public"."artists" to "anon";

grant trigger on table "public"."artists" to "anon";

grant truncate on table "public"."artists" to "anon";

grant update on table "public"."artists" to "anon";

grant delete on table "public"."artists" to "authenticated";

grant insert on table "public"."artists" to "authenticated";

grant references on table "public"."artists" to "authenticated";

grant select on table "public"."artists" to "authenticated";

grant trigger on table "public"."artists" to "authenticated";

grant truncate on table "public"."artists" to "authenticated";

grant update on table "public"."artists" to "authenticated";

grant delete on table "public"."artists" to "service_role";

grant insert on table "public"."artists" to "service_role";

grant references on table "public"."artists" to "service_role";

grant select on table "public"."artists" to "service_role";

grant trigger on table "public"."artists" to "service_role";

grant truncate on table "public"."artists" to "service_role";

grant update on table "public"."artists" to "service_role";

grant delete on table "public"."contact_inquiries" to "anon";

grant insert on table "public"."contact_inquiries" to "anon";

grant references on table "public"."contact_inquiries" to "anon";

grant select on table "public"."contact_inquiries" to "anon";

grant trigger on table "public"."contact_inquiries" to "anon";

grant truncate on table "public"."contact_inquiries" to "anon";

grant update on table "public"."contact_inquiries" to "anon";

grant delete on table "public"."contact_inquiries" to "authenticated";

grant insert on table "public"."contact_inquiries" to "authenticated";

grant references on table "public"."contact_inquiries" to "authenticated";

grant select on table "public"."contact_inquiries" to "authenticated";

grant trigger on table "public"."contact_inquiries" to "authenticated";

grant truncate on table "public"."contact_inquiries" to "authenticated";

grant update on table "public"."contact_inquiries" to "authenticated";

grant delete on table "public"."contact_inquiries" to "service_role";

grant insert on table "public"."contact_inquiries" to "service_role";

grant references on table "public"."contact_inquiries" to "service_role";

grant select on table "public"."contact_inquiries" to "service_role";

grant trigger on table "public"."contact_inquiries" to "service_role";

grant truncate on table "public"."contact_inquiries" to "service_role";

grant update on table "public"."contact_inquiries" to "service_role";

grant delete on table "public"."lesson_audios" to "anon";

grant insert on table "public"."lesson_audios" to "anon";

grant references on table "public"."lesson_audios" to "anon";

grant select on table "public"."lesson_audios" to "anon";

grant trigger on table "public"."lesson_audios" to "anon";

grant truncate on table "public"."lesson_audios" to "anon";

grant update on table "public"."lesson_audios" to "anon";

grant delete on table "public"."lesson_audios" to "authenticated";

grant insert on table "public"."lesson_audios" to "authenticated";

grant references on table "public"."lesson_audios" to "authenticated";

grant select on table "public"."lesson_audios" to "authenticated";

grant trigger on table "public"."lesson_audios" to "authenticated";

grant truncate on table "public"."lesson_audios" to "authenticated";

grant update on table "public"."lesson_audios" to "authenticated";

grant delete on table "public"."lesson_audios" to "service_role";

grant insert on table "public"."lesson_audios" to "service_role";

grant references on table "public"."lesson_audios" to "service_role";

grant select on table "public"."lesson_audios" to "service_role";

grant trigger on table "public"."lesson_audios" to "service_role";

grant truncate on table "public"."lesson_audios" to "service_role";

grant update on table "public"."lesson_audios" to "service_role";

grant delete on table "public"."lesson_schedule" to "anon";

grant insert on table "public"."lesson_schedule" to "anon";

grant references on table "public"."lesson_schedule" to "anon";

grant select on table "public"."lesson_schedule" to "anon";

grant trigger on table "public"."lesson_schedule" to "anon";

grant truncate on table "public"."lesson_schedule" to "anon";

grant update on table "public"."lesson_schedule" to "anon";

grant delete on table "public"."lesson_schedule" to "authenticated";

grant insert on table "public"."lesson_schedule" to "authenticated";

grant references on table "public"."lesson_schedule" to "authenticated";

grant select on table "public"."lesson_schedule" to "authenticated";

grant trigger on table "public"."lesson_schedule" to "authenticated";

grant truncate on table "public"."lesson_schedule" to "authenticated";

grant update on table "public"."lesson_schedule" to "authenticated";

grant delete on table "public"."lesson_schedule" to "service_role";

grant insert on table "public"."lesson_schedule" to "service_role";

grant references on table "public"."lesson_schedule" to "service_role";

grant select on table "public"."lesson_schedule" to "service_role";

grant trigger on table "public"."lesson_schedule" to "service_role";

grant truncate on table "public"."lesson_schedule" to "service_role";

grant update on table "public"."lesson_schedule" to "service_role";

grant delete on table "public"."lessons" to "anon";

grant insert on table "public"."lessons" to "anon";

grant references on table "public"."lessons" to "anon";

grant select on table "public"."lessons" to "anon";

grant trigger on table "public"."lessons" to "anon";

grant truncate on table "public"."lessons" to "anon";

grant update on table "public"."lessons" to "anon";

grant delete on table "public"."lessons" to "authenticated";

grant insert on table "public"."lessons" to "authenticated";

grant references on table "public"."lessons" to "authenticated";

grant select on table "public"."lessons" to "authenticated";

grant trigger on table "public"."lessons" to "authenticated";

grant truncate on table "public"."lessons" to "authenticated";

grant update on table "public"."lessons" to "authenticated";

grant delete on table "public"."lessons" to "service_role";

grant insert on table "public"."lessons" to "service_role";

grant references on table "public"."lessons" to "service_role";

grant select on table "public"."lessons" to "service_role";

grant trigger on table "public"."lessons" to "service_role";

grant truncate on table "public"."lessons" to "service_role";

grant update on table "public"."lessons" to "service_role";

grant delete on table "public"."music_catalog" to "anon";

grant insert on table "public"."music_catalog" to "anon";

grant references on table "public"."music_catalog" to "anon";

grant select on table "public"."music_catalog" to "anon";

grant trigger on table "public"."music_catalog" to "anon";

grant truncate on table "public"."music_catalog" to "anon";

grant update on table "public"."music_catalog" to "anon";

grant delete on table "public"."music_catalog" to "authenticated";

grant insert on table "public"."music_catalog" to "authenticated";

grant references on table "public"."music_catalog" to "authenticated";

grant select on table "public"."music_catalog" to "authenticated";

grant trigger on table "public"."music_catalog" to "authenticated";

grant truncate on table "public"."music_catalog" to "authenticated";

grant update on table "public"."music_catalog" to "authenticated";

grant delete on table "public"."music_catalog" to "service_role";

grant insert on table "public"."music_catalog" to "service_role";

grant references on table "public"."music_catalog" to "service_role";

grant select on table "public"."music_catalog" to "service_role";

grant trigger on table "public"."music_catalog" to "service_role";

grant truncate on table "public"."music_catalog" to "service_role";

grant update on table "public"."music_catalog" to "service_role";

grant delete on table "public"."profile_requests" to "anon";

grant insert on table "public"."profile_requests" to "anon";

grant references on table "public"."profile_requests" to "anon";

grant select on table "public"."profile_requests" to "anon";

grant trigger on table "public"."profile_requests" to "anon";

grant truncate on table "public"."profile_requests" to "anon";

grant update on table "public"."profile_requests" to "anon";

grant delete on table "public"."profile_requests" to "authenticated";

grant insert on table "public"."profile_requests" to "authenticated";

grant references on table "public"."profile_requests" to "authenticated";

grant select on table "public"."profile_requests" to "authenticated";

grant trigger on table "public"."profile_requests" to "authenticated";

grant truncate on table "public"."profile_requests" to "authenticated";

grant update on table "public"."profile_requests" to "authenticated";

grant delete on table "public"."profile_requests" to "service_role";

grant insert on table "public"."profile_requests" to "service_role";

grant references on table "public"."profile_requests" to "service_role";

grant select on table "public"."profile_requests" to "service_role";

grant trigger on table "public"."profile_requests" to "service_role";

grant truncate on table "public"."profile_requests" to "service_role";

grant update on table "public"."profile_requests" to "service_role";

grant delete on table "public"."student_progress" to "anon";

grant insert on table "public"."student_progress" to "anon";

grant references on table "public"."student_progress" to "anon";

grant select on table "public"."student_progress" to "anon";

grant trigger on table "public"."student_progress" to "anon";

grant truncate on table "public"."student_progress" to "anon";

grant update on table "public"."student_progress" to "anon";

grant delete on table "public"."student_progress" to "authenticated";

grant insert on table "public"."student_progress" to "authenticated";

grant references on table "public"."student_progress" to "authenticated";

grant select on table "public"."student_progress" to "authenticated";

grant trigger on table "public"."student_progress" to "authenticated";

grant truncate on table "public"."student_progress" to "authenticated";

grant update on table "public"."student_progress" to "authenticated";

grant delete on table "public"."student_progress" to "service_role";

grant insert on table "public"."student_progress" to "service_role";

grant references on table "public"."student_progress" to "service_role";

grant select on table "public"."student_progress" to "service_role";

grant trigger on table "public"."student_progress" to "service_role";

grant truncate on table "public"."student_progress" to "service_role";

grant update on table "public"."student_progress" to "service_role";

grant delete on table "public"."subscribers" to "anon";

grant insert on table "public"."subscribers" to "anon";

grant references on table "public"."subscribers" to "anon";

grant select on table "public"."subscribers" to "anon";

grant trigger on table "public"."subscribers" to "anon";

grant truncate on table "public"."subscribers" to "anon";

grant update on table "public"."subscribers" to "anon";

grant delete on table "public"."subscribers" to "authenticated";

grant insert on table "public"."subscribers" to "authenticated";

grant references on table "public"."subscribers" to "authenticated";

grant select on table "public"."subscribers" to "authenticated";

grant trigger on table "public"."subscribers" to "authenticated";

grant truncate on table "public"."subscribers" to "authenticated";

grant update on table "public"."subscribers" to "authenticated";

grant delete on table "public"."subscribers" to "service_role";

grant insert on table "public"."subscribers" to "service_role";

grant references on table "public"."subscribers" to "service_role";

grant select on table "public"."subscribers" to "service_role";

grant trigger on table "public"."subscribers" to "service_role";

grant truncate on table "public"."subscribers" to "service_role";

grant update on table "public"."subscribers" to "service_role";

grant delete on table "public"."subscription_codes" to "anon";

grant insert on table "public"."subscription_codes" to "anon";

grant references on table "public"."subscription_codes" to "anon";

grant select on table "public"."subscription_codes" to "anon";

grant trigger on table "public"."subscription_codes" to "anon";

grant truncate on table "public"."subscription_codes" to "anon";

grant update on table "public"."subscription_codes" to "anon";

grant delete on table "public"."subscription_codes" to "authenticated";

grant insert on table "public"."subscription_codes" to "authenticated";

grant references on table "public"."subscription_codes" to "authenticated";

grant select on table "public"."subscription_codes" to "authenticated";

grant trigger on table "public"."subscription_codes" to "authenticated";

grant truncate on table "public"."subscription_codes" to "authenticated";

grant update on table "public"."subscription_codes" to "authenticated";

grant delete on table "public"."subscription_codes" to "service_role";

grant insert on table "public"."subscription_codes" to "service_role";

grant references on table "public"."subscription_codes" to "service_role";

grant select on table "public"."subscription_codes" to "service_role";

grant trigger on table "public"."subscription_codes" to "service_role";

grant truncate on table "public"."subscription_codes" to "service_role";

grant update on table "public"."subscription_codes" to "service_role";

grant delete on table "public"."teacher_cards" to "anon";

grant insert on table "public"."teacher_cards" to "anon";

grant references on table "public"."teacher_cards" to "anon";

grant select on table "public"."teacher_cards" to "anon";

grant trigger on table "public"."teacher_cards" to "anon";

grant truncate on table "public"."teacher_cards" to "anon";

grant update on table "public"."teacher_cards" to "anon";

grant delete on table "public"."teacher_cards" to "authenticated";

grant insert on table "public"."teacher_cards" to "authenticated";

grant references on table "public"."teacher_cards" to "authenticated";

grant select on table "public"."teacher_cards" to "authenticated";

grant trigger on table "public"."teacher_cards" to "authenticated";

grant truncate on table "public"."teacher_cards" to "authenticated";

grant update on table "public"."teacher_cards" to "authenticated";

grant delete on table "public"."teacher_cards" to "service_role";

grant insert on table "public"."teacher_cards" to "service_role";

grant references on table "public"."teacher_cards" to "service_role";

grant select on table "public"."teacher_cards" to "service_role";

grant trigger on table "public"."teacher_cards" to "service_role";

grant truncate on table "public"."teacher_cards" to "service_role";

grant update on table "public"."teacher_cards" to "service_role";

grant delete on table "public"."teachers" to "anon";

grant insert on table "public"."teachers" to "anon";

grant references on table "public"."teachers" to "anon";

grant select on table "public"."teachers" to "anon";

grant trigger on table "public"."teachers" to "anon";

grant truncate on table "public"."teachers" to "anon";

grant update on table "public"."teachers" to "anon";

grant delete on table "public"."teachers" to "authenticated";

grant insert on table "public"."teachers" to "authenticated";

grant references on table "public"."teachers" to "authenticated";

grant select on table "public"."teachers" to "authenticated";

grant trigger on table "public"."teachers" to "authenticated";

grant truncate on table "public"."teachers" to "authenticated";

grant update on table "public"."teachers" to "authenticated";

grant delete on table "public"."teachers" to "service_role";

grant insert on table "public"."teachers" to "service_role";

grant references on table "public"."teachers" to "service_role";

grant select on table "public"."teachers" to "service_role";

grant trigger on table "public"."teachers" to "service_role";

grant truncate on table "public"."teachers" to "service_role";

grant update on table "public"."teachers" to "service_role";

grant delete on table "public"."tracks" to "anon";

grant insert on table "public"."tracks" to "anon";

grant references on table "public"."tracks" to "anon";

grant select on table "public"."tracks" to "anon";

grant trigger on table "public"."tracks" to "anon";

grant truncate on table "public"."tracks" to "anon";

grant update on table "public"."tracks" to "anon";

grant delete on table "public"."tracks" to "authenticated";

grant insert on table "public"."tracks" to "authenticated";

grant references on table "public"."tracks" to "authenticated";

grant select on table "public"."tracks" to "authenticated";

grant trigger on table "public"."tracks" to "authenticated";

grant truncate on table "public"."tracks" to "authenticated";

grant update on table "public"."tracks" to "authenticated";

grant delete on table "public"."tracks" to "service_role";

grant insert on table "public"."tracks" to "service_role";

grant references on table "public"."tracks" to "service_role";

grant select on table "public"."tracks" to "service_role";

grant trigger on table "public"."tracks" to "service_role";

grant truncate on table "public"."tracks" to "service_role";

grant update on table "public"."tracks" to "service_role";


  create policy "Allow public insert on artists"
  on "public"."artists"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public read access"
  on "public"."artists"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public read on artists"
  on "public"."artists"
  as permissive
  for select
  to public
using (true);



  create policy "Artists can insert own profile"
  on "public"."artists"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Artists can update own profile"
  on "public"."artists"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Artists can view own profile"
  on "public"."artists"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Public Artists Read"
  on "public"."artists"
  as permissive
  for select
  to public
using (true);



  create policy "Public artists are viewable by everyone"
  on "public"."artists"
  as permissive
  for select
  to public
using (true);



  create policy "Public profiles are visible to everyone"
  on "public"."artists"
  as permissive
  for select
  to public
using (true);



  create policy "Teachers can update their students"
  on "public"."artists"
  as permissive
  for update
  to public
using ((auth.uid() IN ( SELECT teachers.id
   FROM public.teachers
  WHERE (teachers.id = artists.teacher_id))));



  create policy "Users can update own profile"
  on "public"."artists"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users can update their own profile"
  on "public"."artists"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Allow public insert"
  on "public"."contact_inquiries"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public Contact Insert"
  on "public"."contact_inquiries"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public view audios"
  on "public"."lesson_audios"
  as permissive
  for select
  to public
using (true);



  create policy "Enable all for teachers"
  on "public"."lesson_schedule"
  as permissive
  for all
  to public
using ((auth.uid() = teacher_id))
with check ((auth.uid() = teacher_id));



  create policy "policy_delete_schedule"
  on "public"."lesson_schedule"
  as permissive
  for delete
  to public
using ((auth.uid() = teacher_id));



  create policy "policy_select_schedule"
  on "public"."lesson_schedule"
  as permissive
  for select
  to public
using ((auth.uid() = teacher_id));



  create policy "policy_update_schedule"
  on "public"."lesson_schedule"
  as permissive
  for update
  to public
using ((auth.uid() = teacher_id));



  create policy "Public view lessons"
  on "public"."lessons"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public read access"
  on "public"."music_catalog"
  as permissive
  for select
  to public
using (true);



  create policy "Public Catalog Read"
  on "public"."music_catalog"
  as permissive
  for select
  to public
using (true);



  create policy "Public can view music"
  on "public"."music_catalog"
  as permissive
  for select
  to public
using (true);



  create policy "Public Profile Request Insert"
  on "public"."profile_requests"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public insert progress"
  on "public"."student_progress"
  as permissive
  for insert
  to public
with check (true);



  create policy "Allow public select progress"
  on "public"."student_progress"
  as permissive
  for select
  to public
using (true);



  create policy "Public insert progress"
  on "public"."student_progress"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public select progress"
  on "public"."student_progress"
  as permissive
  for select
  to public
using (true);



  create policy "Anyone can subscribe"
  on "public"."subscribers"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public Subscriber Insert"
  on "public"."subscribers"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public view cards"
  on "public"."teacher_cards"
  as permissive
  for select
  to public
using (true);



  create policy "Public can view teachers"
  on "public"."teachers"
  as permissive
  for select
  to public
using (true);



  create policy "Public profiles are viewable by everyone"
  on "public"."teachers"
  as permissive
  for select
  to public
using (true);



  create policy "Teachers can manage own profile"
  on "public"."teachers"
  as permissive
  for all
  to public
using ((auth.uid() = id));



  create policy "Teachers can update own profile"
  on "public"."teachers"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Teachers can view own profile"
  on "public"."teachers"
  as permissive
  for select
  to public
using ((auth.uid() = id));



  create policy "Allow public update on tracks"
  on "public"."tracks"
  as permissive
  for update
  to public
using (true)
with check (true);



  create policy "Public Tracks Delete"
  on "public"."tracks"
  as permissive
  for delete
  to public
using (true);



  create policy "Public Tracks Insert"
  on "public"."tracks"
  as permissive
  for insert
  to public
with check (true);



  create policy "Public Tracks Read"
  on "public"."tracks"
  as permissive
  for select
  to public
using (true);



  create policy "Public tracks are viewable by everyone"
  on "public"."tracks"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER message AFTER INSERT OR UPDATE ON public.contact_inquiries FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request('https://hook.us2.make.com/k2y50fm836f6wgaitcydprl17kjcuawu', 'POST', '{"Content-type":"application/json"}', '{}', '5000');


