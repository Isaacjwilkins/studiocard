


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."artists" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "slug" "text" NOT NULL,
    "full_name" "text" NOT NULL,
    "bio" "text",
    "profile_image_url" "text",
    "is_active" boolean DEFAULT true,
    "instagram" "text",
    "website" "text",
    "youtube" "text",
    "twitter" "text",
    "linkedin" "text",
    "snapchat" "text",
    "facebook" "text",
    "tiktok" "text",
    "spotify" "text",
    "apple_music" "text",
    "soundcloud" "text",
    "is_verified" boolean DEFAULT false,
    "is_premium" boolean DEFAULT false,
    "card_color" "text" DEFAULT '#ffffff'::"text",
    "caption" "text",
    "passcode" "text",
    "is_private" boolean DEFAULT false,
    "teacher_id" "uuid",
    "current_assignments" "text",
    "current_note" "text",
    "email" "text",
    "phone_number" "text",
    "parent_name" "text",
    "is_pro" boolean DEFAULT false
);


ALTER TABLE "public"."artists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_inquiries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "full_name" "text" NOT NULL,
    "inquiry_type" "text",
    "message" "text" NOT NULL,
    "email" "text"
);


ALTER TABLE "public"."contact_inquiries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lesson_audios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lesson_id" "uuid",
    "title" "text" NOT NULL,
    "audio_url" "text" NOT NULL,
    "duration_seconds" integer DEFAULT 0,
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."lesson_audios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "card_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text",
    "sort_order" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "slug" "text",
    "is_premium" boolean DEFAULT false
);


ALTER TABLE "public"."lessons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."music_catalog" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "mood_tags" "text"[],
    "youtube_url" "text",
    "sheet_music_url" "text",
    "spotify_url" "text",
    "is_featured" boolean DEFAULT false,
    "long_description" "text",
    "image_gallery" "text"[] DEFAULT '{}'::"text"[],
    "release_date" "date"
);


ALTER TABLE "public"."music_catalog" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profile_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "request_type" "text",
    "user_name" "text",
    "user_passcode" "text",
    "requested_changes" "jsonb",
    "status" "text" DEFAULT 'PENDING'::"text"
);


ALTER TABLE "public"."profile_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."student_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lesson_id" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "artist_id" "uuid"
);


ALTER TABLE "public"."student_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."subscribers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "email" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text"
);


ALTER TABLE "public"."subscribers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teacher_cards" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "instrument" "text" NOT NULL,
    "description" "text",
    "image_url" "text",
    "theme_color" "text" DEFAULT '#3b82f6'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "slug" "text"
);


ALTER TABLE "public"."teacher_cards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."teachers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "passcode" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."teachers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tracks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "artist_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "audio_url" "text" NOT NULL,
    "description" "text",
    "release_date" "date" DEFAULT CURRENT_DATE,
    "is_public" boolean DEFAULT false
);


ALTER TABLE "public"."tracks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."artists"
    ADD CONSTRAINT "artists_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."contact_inquiries"
    ADD CONSTRAINT "contact_inquiries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lesson_audios"
    ADD CONSTRAINT "lesson_audios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."music_catalog"
    ADD CONSTRAINT "music_catalog_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profile_requests"
    ADD CONSTRAINT "profile_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."subscribers"
    ADD CONSTRAINT "subscribers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teacher_cards"
    ADD CONSTRAINT "teacher_cards_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teacher_cards"
    ADD CONSTRAINT "teacher_cards_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."teachers"
    ADD CONSTRAINT "teachers_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_pkey" PRIMARY KEY ("id");



CREATE INDEX "artists_slug_idx" ON "public"."artists" USING "btree" ("slug");



CREATE INDEX "idx_artists_teacher_id" ON "public"."artists" USING "btree" ("teacher_id");



CREATE INDEX "idx_lessons_slug" ON "public"."lessons" USING "btree" ("slug", "card_id");



CREATE INDEX "idx_progress_artist" ON "public"."student_progress" USING "btree" ("artist_id");



CREATE INDEX "idx_teacher_cards_slug" ON "public"."teacher_cards" USING "btree" ("slug");



CREATE OR REPLACE TRIGGER "message" AFTER INSERT OR UPDATE ON "public"."contact_inquiries" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://hook.us2.make.com/k2y50fm836f6wgaitcydprl17kjcuawu', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



ALTER TABLE ONLY "public"."lesson_audios"
    ADD CONSTRAINT "lesson_audios_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "public"."teacher_cards"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."student_progress"
    ADD CONSTRAINT "student_progress_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tracks"
    ADD CONSTRAINT "tracks_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id");



CREATE POLICY "Allow public insert" ON "public"."contact_inquiries" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public insert on artists" ON "public"."artists" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public insert progress" ON "public"."student_progress" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read access" ON "public"."music_catalog" FOR SELECT USING (true);



CREATE POLICY "Allow public read on artists" ON "public"."artists" FOR SELECT USING (true);



CREATE POLICY "Allow public select progress" ON "public"."student_progress" FOR SELECT USING (true);



CREATE POLICY "Allow public update on artists" ON "public"."artists" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Allow public update on tracks" ON "public"."tracks" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can subscribe" ON "public"."subscribers" FOR INSERT WITH CHECK (true);



CREATE POLICY "Enable update for teachers" ON "public"."artists" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Public Artists Read" ON "public"."artists" FOR SELECT USING (true);



CREATE POLICY "Public Catalog Read" ON "public"."music_catalog" FOR SELECT USING (true);



CREATE POLICY "Public Contact Insert" ON "public"."contact_inquiries" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Profile Request Insert" ON "public"."profile_requests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Subscriber Insert" ON "public"."subscribers" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Tracks Delete" ON "public"."tracks" FOR DELETE USING (true);



CREATE POLICY "Public Tracks Insert" ON "public"."tracks" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public Tracks Read" ON "public"."tracks" FOR SELECT USING (true);



CREATE POLICY "Public artists are viewable by everyone" ON "public"."artists" FOR SELECT USING (true);



CREATE POLICY "Public can view music" ON "public"."music_catalog" FOR SELECT USING (true);



CREATE POLICY "Public insert progress" ON "public"."student_progress" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public profiles are viewable by everyone" ON "public"."teachers" FOR SELECT USING (true);



CREATE POLICY "Public select progress" ON "public"."student_progress" FOR SELECT USING (true);



CREATE POLICY "Public tracks are viewable by everyone" ON "public"."tracks" FOR SELECT USING (true);



CREATE POLICY "Public view audios" ON "public"."lesson_audios" FOR SELECT USING (true);



CREATE POLICY "Public view cards" ON "public"."teacher_cards" FOR SELECT USING (true);



CREATE POLICY "Public view lessons" ON "public"."lessons" FOR SELECT USING (true);



CREATE POLICY "Teacher edit policy" ON "public"."artists" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Teachers can view own profile" ON "public"."teachers" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own profile" ON "public"."artists" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."artists" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_inquiries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lesson_audios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."music_catalog" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profile_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."student_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."subscribers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teacher_cards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."teachers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tracks" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."artists" TO "anon";
GRANT ALL ON TABLE "public"."artists" TO "authenticated";
GRANT ALL ON TABLE "public"."artists" TO "service_role";



GRANT ALL ON TABLE "public"."contact_inquiries" TO "anon";
GRANT ALL ON TABLE "public"."contact_inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."contact_inquiries" TO "service_role";



GRANT ALL ON TABLE "public"."lesson_audios" TO "anon";
GRANT ALL ON TABLE "public"."lesson_audios" TO "authenticated";
GRANT ALL ON TABLE "public"."lesson_audios" TO "service_role";



GRANT ALL ON TABLE "public"."lessons" TO "anon";
GRANT ALL ON TABLE "public"."lessons" TO "authenticated";
GRANT ALL ON TABLE "public"."lessons" TO "service_role";



GRANT ALL ON TABLE "public"."music_catalog" TO "anon";
GRANT ALL ON TABLE "public"."music_catalog" TO "authenticated";
GRANT ALL ON TABLE "public"."music_catalog" TO "service_role";



GRANT ALL ON TABLE "public"."profile_requests" TO "anon";
GRANT ALL ON TABLE "public"."profile_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."profile_requests" TO "service_role";



GRANT ALL ON TABLE "public"."student_progress" TO "anon";
GRANT ALL ON TABLE "public"."student_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."student_progress" TO "service_role";



GRANT ALL ON TABLE "public"."subscribers" TO "anon";
GRANT ALL ON TABLE "public"."subscribers" TO "authenticated";
GRANT ALL ON TABLE "public"."subscribers" TO "service_role";



GRANT ALL ON TABLE "public"."teacher_cards" TO "anon";
GRANT ALL ON TABLE "public"."teacher_cards" TO "authenticated";
GRANT ALL ON TABLE "public"."teacher_cards" TO "service_role";



GRANT ALL ON TABLE "public"."teachers" TO "anon";
GRANT ALL ON TABLE "public"."teachers" TO "authenticated";
GRANT ALL ON TABLE "public"."teachers" TO "service_role";



GRANT ALL ON TABLE "public"."tracks" TO "anon";
GRANT ALL ON TABLE "public"."tracks" TO "authenticated";
GRANT ALL ON TABLE "public"."tracks" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







