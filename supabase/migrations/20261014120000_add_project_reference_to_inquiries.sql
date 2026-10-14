-- Optional portfolio Project ID on Start with Nagriva inquiries.
-- Backward compatible: every column is nullable, so existing rows and any
-- insert that omits these columns keep working unchanged.

ALTER TABLE "public"."inquiries"
  ADD COLUMN IF NOT EXISTS "project_reference" "text",
  ADD COLUMN IF NOT EXISTS "project_title" "text",
  ADD COLUMN IF NOT EXISTS "project_url" "text";

ALTER TABLE "public"."inquiries"
  DROP CONSTRAINT IF EXISTS "inquiries_project_reference_check",
  ADD CONSTRAINT "inquiries_project_reference_check" CHECK ((("project_reference" IS NULL) OR (("char_length"("project_reference") >= 1) AND ("char_length"("project_reference") <= 32)))),
  DROP CONSTRAINT IF EXISTS "inquiries_project_title_check",
  ADD CONSTRAINT "inquiries_project_title_check" CHECK ((("project_title" IS NULL) OR (("char_length"("project_title") >= 1) AND ("char_length"("project_title") <= 200)))),
  DROP CONSTRAINT IF EXISTS "inquiries_project_url_check",
  ADD CONSTRAINT "inquiries_project_url_check" CHECK ((("project_url" IS NULL) OR (("char_length"("project_url") <= 500) AND ("project_url" ~ '^https?://'::"text"))));
