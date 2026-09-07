-- ============================================================
-- Nagriva Blog — demo/test seed
-- Run this once in the Supabase Dashboard: SQL Editor
-- (Role: postgres → bypasses RLS, so the anon-read test page can see the rows.)
-- Idempotent: safe to re-run.
--
-- Does NOT modify schema, RLS policies, storage policies, or migrations.
-- Covers are intentionally left NULL → the /blog page shows its graceful
-- fallback block until images are added to the public `blog-covers` bucket.
-- ============================================================

begin;

-- ---------- Categories ----------
insert into public.blog_categories (name, slug, description)
values
  ('Web Design',              'web-design',              'Articles about visual design, layout, and crafting interfaces.'),
  ('Development',             'development',             'Technical notes on building fast, reliable websites.'),
  ('E-commerce',              'e-commerce',              'Turning browsers into buyers with focused online stores.'),
  ('Business',                'business',                'Strategy, positioning, and growing a credible online presence.')
on conflict (name) do nothing;

-- ---------- Author ----------
insert into public.blog_authors (name, slug, bio, avatar_path, avatar_alt)
values (
  'Redouane Ait El-Hadj',
  'redouane-ait-el-hadj',
  'Founder of Nagriva. Designer and developer focused on clear, intentional digital work.',
  null,
  null
)
on conflict (name) do nothing;

-- ---------- Tags ----------
insert into public.blog_tags (name, slug)
values
  ('Design',   'design'),
  ('Process',  'process'),
  ('Performance', 'performance')
on conflict (name) do nothing;

-- ---------- Published posts ----------
insert into public.blog_posts (
  title, slug, excerpt, content, cover_image_path, cover_image_alt,
  category_id, author_id, status, published_at, seo_title, seo_description
)
select
  'Why great websites start with one clear sentence',
  'why-great-websites-start-with-one-clear-sentence',
  'Most projects fail on the first page. Before layout, before colors, a website needs a single clear sentence about what it is for.',
  E'<p>Every Nagriva project starts the same way: with one sentence that the whole website is meant to prove.</p>\n<p>That sentence is not a tagline. It is the outcome the visitor should believe by the time they leave — that this business is credible, that this offer is clear, and that taking the next step is safe.</p>\n<p>Once that sentence is right, layout, structure, and copy naturally fall into place. When it is missing, every later decision drifts.</p>',
  null, null,
  (select id from public.blog_categories where slug = 'web-design'),
  (select id from public.blog_authors where slug = 'redouane-ait-el-hadj'),
  'published',
  now() - interval '4 days',
  'Why great websites start with one clear sentence',
  'Most projects fail on the first page. Before layout, a website needs a single clear sentence about what it is for.'
on conflict (slug) do nothing;

insert into public.blog_posts (
  title, slug, excerpt, content, cover_image_path, cover_image_alt,
  category_id, author_id, status, published_at, seo_title, seo_description
)
select
  'The fastest site is the one that knows what to leave out',
  'the-fastest-site-is-the-one-that-knows-what-to-leave-out',
  'Performance is a design decision. Cutting what does not earn its place beats every caching trick.',
  E'<p>Speed feels like an engineering problem until you look at what is actually weighing the page down.</p>\n<p>Most of the time it is not code — it is an unexamined decision. An extra script, a hero image that never shows, a feature nobody asked for.</p>\n<p>We treat performance as a weekly design review: does this piece earn its bytes? If not, it goes.</p>',
  null, null,
  (select id from public.blog_categories where slug = 'development'),
  (select id from public.blog_authors where slug = 'redouane-ait-el-hadj'),
  'published',
  now() - interval '2 days',
  'The fastest site is the one that knows what to leave out',
  'Performance is a design decision. Cutting what does not earn its place beats every caching trick.'
on conflict (slug) do nothing;

insert into public.blog_posts (
  title, slug, excerpt, content, cover_image_path, cover_image_alt,
  category_id, author_id, status, published_at, seo_title, seo_description
)
select
  'A store that feels trustworthy in the first five seconds',
  'a-store-that-feels-trustworthy-in-the-first-five-seconds',
  'Trust decides e-commerce before price ever gets a chance. Here is what we build so the first impression proves it.',
  E'<p>Online buyers decide fast. In the first few seconds they are not comparing prices — they are checking whether this store is real.</p>\n<p>Clear product presentation, honest delivery details, a calm checkout, and a presence that looks maintained are what turn that first glance into a purchase.</p>\n<p>Nail the basics and the store sells itself; miss them and no discount will save you.</p>',
  null, null,
  (select id from public.blog_categories where slug = 'e-commerce'),
  (select id from public.blog_authors where slug = 'redouane-ait-el-hadj'),
  'published',
  now() - interval '6 hours',
  'A store that feels trustworthy in the first five seconds',
  'Trust decides e-commerce before price ever gets a chance.'
on conflict (slug) do nothing;

insert into public.blog_posts (
  title, slug, excerpt, content, cover_image_path, cover_image_alt,
  category_id, author_id, status, published_at, seo_title, seo_description
)
select
  'Being good is not always enough: the visibility gap',
  'being-good-is-not-always-enough-the-visibility-gap',
  'In Morocco, having the skill is only the beginning. The harder part is being seen, trusted, and chosen consistently.',
  E'<p>We have met a lot of excellent businesses that stay invisible because nobody can find them, understand them, or trust them quickly.</p>\n<p>That gap is not about talent. It is about showing up online in a way that matches the quality of the work.</p>\n<p>A credible digital presence closes that gap. This article is about how we do it.</p>',
  null, null,
  (select id from public.blog_categories where slug = 'business'),
  (select id from public.blog_authors where slug = 'redouane-ait-el-hadj'),
  'published',
  now() - interval '1 hour',
  'Being good is not always enough: the visibility gap',
  'In Morocco, having the skill is only the beginning. The harder part is being seen, trusted, and chosen consistently.'
on conflict (slug) do nothing;

-- ---------- A draft that must NEVER appear on /blog ----------
insert into public.blog_posts (
  title, slug, excerpt, content, cover_image_path, cover_image_alt,
  category_id, author_id, status, published_at, seo_title, seo_description
)
select
  'This is a draft and should never show on the blog',
  'draft-never-published',
  'Draft posts must never appear on the public blog page.',
  '<p>If you can see this, the status filter is broken.</p>',
  null, null,
  (select id from public.blog_categories where slug = 'development'),
  (select id from public.blog_authors where slug = 'redouane-ait-el-hadj'),
  'draft',
  null,
  'Draft post',
  'Draft post'
on conflict (slug) do nothing;

-- ---------- Tag links (demonstrates /blog/tag/:slug compatibility) ----------
insert into public.blog_post_tags (post_id, tag_id)
select p.id, t.id
from public.blog_posts p
join public.blog_tags t on t.slug = 'design'
where p.slug = 'why-great-websites-start-with-one-clear-sentence'
on conflict (post_id, tag_id) do nothing;

insert into public.blog_post_tags (post_id, tag_id)
select p.id, t.id
from public.blog_posts p
join public.blog_tags t on t.slug = 'performance'
where p.slug = 'the-fastest-site-is-the-one-that-knows-what-to-leave-out'
on conflict (post_id, tag_id) do nothing;

commit;

-- ---------- Verify ----------
select 'categories' as what, count(*) from public.blog_categories
union all select 'authors', count(*) from public.blog_authors
union all select 'published posts', count(*) from public.blog_posts where status = 'published'
union all select 'draft posts', count(*) from public.blog_posts where status = 'draft';