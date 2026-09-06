


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


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blog_authors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "bio" "text",
    "avatar_path" "text",
    "avatar_alt" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_authors" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_post_tags" (
    "post_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."blog_post_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "excerpt" "text",
    "content" "text" NOT NULL,
    "cover_image_path" "text",
    "cover_image_alt" "text",
    "category_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "published_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "seo_title" "text",
    "seo_description" "text",
    "author_id" "uuid",
    CONSTRAINT "blog_posts_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'published'::"text"]))),
    CONSTRAINT "blog_posts_status_published_at_check" CHECK (((("status" = 'draft'::"text") AND ("published_at" IS NULL)) OR (("status" = 'published'::"text") AND ("published_at" IS NOT NULL))))
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."blog_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."blog_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."call_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "call_method" "text" DEFAULT 'whatsapp'::"text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "call_bookings_call_method_check" CHECK (("call_method" = ANY (ARRAY['whatsapp'::"text", 'google-meet'::"text", 'skype'::"text"]))),
    CONSTRAINT "call_bookings_name_check" CHECK ((("char_length"("name") >= 1) AND ("char_length"("name") <= 120))),
    CONSTRAINT "call_bookings_phone_check" CHECK ((("char_length"("phone") >= 8) AND ("char_length"("phone") <= 20))),
    CONSTRAINT "call_bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'booked'::"text", 'done'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."call_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedbacks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "author_name" "text" NOT NULL,
    "author_role" "text",
    "author_company" "text",
    "author_avatar_url" "text",
    "content" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "published_at" timestamp with time zone,
    CONSTRAINT "feedbacks_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'published'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."feedbacks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inquiries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "company" "text",
    "need" "text" NOT NULL,
    "project_description" "text" NOT NULL,
    "budget" "text",
    "preferred_contact" "text" NOT NULL,
    "phone" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "inquiries_budget_check" CHECK ((("budget" IS NULL) OR ("budget" = ANY (ARRAY['Under 3000 DH'::"text", '3000 DH – 5000 DH'::"text", '5000 DH – 10000 DH'::"text", '10000 DH+'::"text", 'Not sure yet'::"text"])))),
    CONSTRAINT "inquiries_email_check" CHECK (("email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'::"text")),
    CONSTRAINT "inquiries_full_name_check" CHECK ((("char_length"("full_name") >= 1) AND ("char_length"("full_name") <= 120))),
    CONSTRAINT "inquiries_need_check" CHECK (("need" = ANY (ARRAY['New Website'::"text", 'Website Redesign'::"text", 'E-commerce Website'::"text", 'Landing Page'::"text"]))),
    CONSTRAINT "inquiries_phone_check" CHECK ((("phone" IS NULL) OR (("char_length"("phone") >= 8) AND ("char_length"("phone") <= 20)))),
    CONSTRAINT "inquiries_preferred_contact_check" CHECK (("preferred_contact" = ANY (ARRAY['Email'::"text", 'WhatsApp'::"text", 'Phone'::"text"]))),
    CONSTRAINT "inquiries_project_description_check" CHECK ((("char_length"("project_description") >= 1) AND ("char_length"("project_description") <= 5000))),
    CONSTRAINT "inquiries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'replied'::"text", 'done'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."inquiries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_inquiries" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "description" "text" NOT NULL,
    "whatsapp" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "project_inquiries_description_check" CHECK ((("char_length"("description") >= 1) AND ("char_length"("description") <= 2000))),
    CONSTRAINT "project_inquiries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'contacted'::"text", 'done'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "project_inquiries_whatsapp_check" CHECK ((("char_length"("whatsapp") >= 8) AND ("char_length"("whatsapp") <= 20)))
);


ALTER TABLE "public"."project_inquiries" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blog_authors"
    ADD CONSTRAINT "blog_authors_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."blog_authors"
    ADD CONSTRAINT "blog_authors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_authors"
    ADD CONSTRAINT "blog_authors_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."blog_post_tags"
    ADD CONSTRAINT "blog_post_tags_pkey" PRIMARY KEY ("post_id", "tag_id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."blog_tags"
    ADD CONSTRAINT "blog_tags_name_unique" UNIQUE ("name");



ALTER TABLE ONLY "public"."blog_tags"
    ADD CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_tags"
    ADD CONSTRAINT "blog_tags_slug_unique" UNIQUE ("slug");



ALTER TABLE ONLY "public"."call_bookings"
    ADD CONSTRAINT "call_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedbacks"
    ADD CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inquiries"
    ADD CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_inquiries"
    ADD CONSTRAINT "project_inquiries_pkey" PRIMARY KEY ("id");



CREATE INDEX "blog_post_tags_tag_id_idx" ON "public"."blog_post_tags" USING "btree" ("tag_id");



CREATE INDEX "blog_posts_author_id_idx" ON "public"."blog_posts" USING "btree" ("author_id");



CREATE INDEX "blog_posts_category_id_idx" ON "public"."blog_posts" USING "btree" ("category_id");



CREATE INDEX "blog_posts_published_at_idx" ON "public"."blog_posts" USING "btree" ("published_at" DESC);



CREATE INDEX "blog_posts_status_idx" ON "public"."blog_posts" USING "btree" ("status");



CREATE INDEX "feedbacks_created_at_idx" ON "public"."feedbacks" USING "btree" ("created_at" DESC);



CREATE INDEX "feedbacks_status_idx" ON "public"."feedbacks" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "set_blog_authors_updated_at" BEFORE UPDATE ON "public"."blog_authors" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_blog_categories_updated_at" BEFORE UPDATE ON "public"."blog_categories" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_blog_posts_updated_at" BEFORE UPDATE ON "public"."blog_posts" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_blog_tags_updated_at" BEFORE UPDATE ON "public"."blog_tags" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."blog_post_tags"
    ADD CONSTRAINT "blog_post_tags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."blog_posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_post_tags"
    ADD CONSTRAINT "blog_post_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."blog_tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."blog_authors"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."blog_categories"("id") ON DELETE SET NULL;



CREATE POLICY "Anyone can submit feedback" ON "public"."feedbacks" FOR INSERT TO "authenticated", "anon" WITH CHECK (("status" = 'pending'::"text"));



CREATE POLICY "Anyone can view published feedbacks" ON "public"."feedbacks" FOR SELECT TO "authenticated", "anon" USING (("status" = 'published'::"text"));



CREATE POLICY "Public can read blog authors" ON "public"."blog_authors" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read blog categories" ON "public"."blog_categories" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read blog post tags" ON "public"."blog_post_tags" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read blog tags" ON "public"."blog_tags" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read published blog posts" ON "public"."blog_posts" FOR SELECT TO "authenticated", "anon" USING (("status" = 'published'::"text"));



CREATE POLICY "Public can submit feedback" ON "public"."feedbacks" FOR INSERT TO "authenticated", "anon" WITH CHECK (("status" = 'pending'::"text"));



CREATE POLICY "Public can view published feedbacks" ON "public"."feedbacks" FOR SELECT TO "authenticated", "anon" USING (("status" = 'published'::"text"));



CREATE POLICY "anon can create call bookings" ON "public"."call_bookings" FOR INSERT TO "anon" WITH CHECK (("status" = 'pending'::"text"));



CREATE POLICY "anon can create inquiries" ON "public"."inquiries" FOR INSERT TO "anon" WITH CHECK (("status" = 'pending'::"text"));



CREATE POLICY "anon can create project inquiries" ON "public"."project_inquiries" FOR INSERT TO "anon" WITH CHECK (("status" = 'pending'::"text"));



CREATE POLICY "authenticated can delete call bookings" ON "public"."call_bookings" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "authenticated can delete inquiries" ON "public"."inquiries" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "authenticated can delete project inquiries" ON "public"."project_inquiries" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "authenticated can update call bookings" ON "public"."call_bookings" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "authenticated can update inquiries" ON "public"."inquiries" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "authenticated can update project inquiries" ON "public"."project_inquiries" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "authenticated can view call bookings" ON "public"."call_bookings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated can view inquiries" ON "public"."inquiries" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "authenticated can view project inquiries" ON "public"."project_inquiries" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."blog_authors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_post_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."call_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedbacks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inquiries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_inquiries" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."blog_authors" TO "anon";
GRANT ALL ON TABLE "public"."blog_authors" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_authors" TO "service_role";



GRANT ALL ON TABLE "public"."blog_categories" TO "anon";
GRANT ALL ON TABLE "public"."blog_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_categories" TO "service_role";



GRANT ALL ON TABLE "public"."blog_post_tags" TO "anon";
GRANT ALL ON TABLE "public"."blog_post_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_post_tags" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON TABLE "public"."blog_tags" TO "anon";
GRANT ALL ON TABLE "public"."blog_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_tags" TO "service_role";



GRANT ALL ON TABLE "public"."call_bookings" TO "anon";
GRANT ALL ON TABLE "public"."call_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."call_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."feedbacks" TO "anon";
GRANT ALL ON TABLE "public"."feedbacks" TO "authenticated";
GRANT ALL ON TABLE "public"."feedbacks" TO "service_role";



GRANT ALL ON TABLE "public"."inquiries" TO "anon";
GRANT ALL ON TABLE "public"."inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."inquiries" TO "service_role";



GRANT ALL ON TABLE "public"."project_inquiries" TO "anon";
GRANT ALL ON TABLE "public"."project_inquiries" TO "authenticated";
GRANT ALL ON TABLE "public"."project_inquiries" TO "service_role";









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































drop extension if exists "pg_net";

drop policy "Public can read blog authors" on "public"."blog_authors";

drop policy "Public can read blog categories" on "public"."blog_categories";

drop policy "Public can read blog post tags" on "public"."blog_post_tags";

drop policy "Public can read published blog posts" on "public"."blog_posts";

drop policy "Public can read blog tags" on "public"."blog_tags";

drop policy "Anyone can submit feedback" on "public"."feedbacks";

drop policy "Anyone can view published feedbacks" on "public"."feedbacks";

drop policy "Public can submit feedback" on "public"."feedbacks";

drop policy "Public can view published feedbacks" on "public"."feedbacks";


  create policy "Public can read blog authors"
  on "public"."blog_authors"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read blog categories"
  on "public"."blog_categories"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read blog post tags"
  on "public"."blog_post_tags"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read published blog posts"
  on "public"."blog_posts"
  as permissive
  for select
  to anon, authenticated
using ((status = 'published'::text));



  create policy "Public can read blog tags"
  on "public"."blog_tags"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Anyone can submit feedback"
  on "public"."feedbacks"
  as permissive
  for insert
  to anon, authenticated
with check ((status = 'pending'::text));



  create policy "Anyone can view published feedbacks"
  on "public"."feedbacks"
  as permissive
  for select
  to anon, authenticated
using ((status = 'published'::text));



  create policy "Public can submit feedback"
  on "public"."feedbacks"
  as permissive
  for insert
  to anon, authenticated
with check ((status = 'pending'::text));



  create policy "Public can view published feedbacks"
  on "public"."feedbacks"
  as permissive
  for select
  to anon, authenticated
using ((status = 'published'::text));
