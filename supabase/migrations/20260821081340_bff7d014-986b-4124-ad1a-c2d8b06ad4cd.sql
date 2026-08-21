GRANT SELECT, INSERT, UPDATE ON public.site_content TO anon;

DROP POLICY IF EXISTS "Admins can write site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can update site content" ON public.site_content;
DROP POLICY IF EXISTS "Admins can insert site content" ON public.site_content;
DROP POLICY IF EXISTS "Anyone can read site content" ON public.site_content;

CREATE POLICY "Build mode: anyone can read site content"
ON public.site_content FOR SELECT USING (true);

CREATE POLICY "Build mode: anyone can create site content"
ON public.site_content FOR INSERT WITH CHECK (true);

CREATE POLICY "Build mode: anyone can update site content"
ON public.site_content FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage site media" ON storage.objects;
DROP POLICY IF EXISTS "Build mode: anyone can read site media" ON storage.objects;
DROP POLICY IF EXISTS "Build mode: anyone can upload site media" ON storage.objects;
DROP POLICY IF EXISTS "Build mode: anyone can update site media" ON storage.objects;
DROP POLICY IF EXISTS "Build mode: anyone can delete site media" ON storage.objects;

CREATE POLICY "Build mode: anyone can read site media"
ON storage.objects FOR SELECT USING (bucket_id = 'site-media');

CREATE POLICY "Build mode: anyone can upload site media"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Build mode: anyone can update site media"
ON storage.objects FOR UPDATE USING (bucket_id = 'site-media') WITH CHECK (bucket_id = 'site-media');

CREATE POLICY "Build mode: anyone can delete site media"
ON storage.objects FOR DELETE USING (bucket_id = 'site-media');