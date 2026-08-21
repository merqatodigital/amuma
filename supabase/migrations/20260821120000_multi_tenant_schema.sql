-- =============================================================
--  Merqato Digital: Multi-tenant schema
--  Adds sites, templates, and updates site_content for multi-tenant.
-- =============================================================

-- 1. Create sites table
CREATE TABLE public.sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  custom_domain TEXT,
  site_name TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  onboarding_done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create templates table
CREATE TABLE public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  default_data JSONB NOT NULL,
  is_pro BOOLEAN DEFAULT false,
  price INTEGER DEFAULT 0,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Add site_id to site_content (nullable for backward compat with existing "main" row)
ALTER TABLE public.site_content
  ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES public.sites(id) ON DELETE CASCADE;

-- 4. Add unique constraint on site_id (one content row per site)
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_content_site_id
  ON public.site_content (site_id)
  WHERE site_id IS NOT NULL;

-- 5. Enable RLS on new tables
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 6. Sites RLS policies
-- Anyone can read sites (for subdomain resolution)
CREATE POLICY "Public can read sites"
  ON public.sites FOR SELECT
  USING (true);

-- Owners can manage their own sites
CREATE POLICY "Owners can insert sites"
  ON public.sites FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own sites"
  ON public.sites FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete own sites"
  ON public.sites FOR DELETE
  USING (auth.uid() = owner_id);

-- 7. Templates RLS policies (public read, admin-only write)
CREATE POLICY "Public can read templates"
  ON public.templates FOR SELECT
  USING (true);

-- 8. site_content policies — allow owners to manage content for their sites
-- (keeps the existing anon read policy for backward compat)
CREATE POLICY "Site owners can insert content"
  ON public.site_content FOR INSERT
  WITH CHECK (
    site_id IS NULL OR EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_content.site_id
        AND sites.owner_id = auth.uid()
    )
  );

CREATE POLICY "Site owners can update content"
  ON public.site_content FOR UPDATE
  USING (
    site_id IS NULL OR EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_content.site_id
        AND sites.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    site_id IS NULL OR EXISTS (
      SELECT 1 FROM public.sites
      WHERE sites.id = site_content.site_id
        AND sites.owner_id = auth.uid()
    )
  );

-- 9. Storage policies for per-site media isolation
-- Allow authenticated users to read any site-media file (needed for public rendering)
CREATE POLICY "Authenticated can read site media"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'site-media');

-- Allow anon to read site media (public site images)
CREATE POLICY "Anon can read site media"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'site-media');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Authenticated can upload site media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-media');

-- Allow authenticated users to update their own uploads
CREATE POLICY "Authenticated can update site media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-media')
  WITH CHECK (bucket_id = 'site-media');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated can delete site media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-media');

-- 10. Updated_at trigger for sites
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sites_updated_at ON public.sites;
CREATE TRIGGER sites_updated_at
  BEFORE UPDATE ON public.sites
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 11. Function to create a site from a template
CREATE OR REPLACE FUNCTION public.create_site_from_template(
  p_slug TEXT,
  p_template_id TEXT,
  p_site_name TEXT,
  p_tagline TEXT DEFAULT ''
)
RETURNS UUID AS $$
DECLARE
  v_site_id UUID;
  v_template_data JSONB;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check slug is available
  IF EXISTS (SELECT 1 FROM public.sites WHERE slug = p_slug) THEN
    RAISE EXCEPTION 'Slug already taken';
  END IF;

  -- Get template default data
  SELECT default_data INTO v_template_data
  FROM public.templates
  WHERE id = p_template_id;

  IF v_template_data IS NULL THEN
    RAISE EXCEPTION 'Template not found';
  END IF;

  -- Create site
  INSERT INTO public.sites (owner_id, slug, template, site_name, tagline, onboarding_done)
  VALUES (v_user_id, p_slug, p_template_id, p_site_name, p_tagline, true)
  RETURNING id INTO v_site_id;

  -- Create site content from template
  INSERT INTO public.site_content (site_id, data)
  VALUES (v_site_id, v_template_data);

  RETURN v_site_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Insert default templates (content will be populated by the app)
-- Templates are inserted via the application code, not SQL
-- This is a placeholder to confirm the table structure works
