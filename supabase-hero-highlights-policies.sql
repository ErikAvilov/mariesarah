-- Exécuter dans Supabase : SQL Editor

ALTER TABLE hero_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read hero_highlights"
  ON hero_highlights
  FOR SELECT
  USING (true);
