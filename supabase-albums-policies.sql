-- Exécuter dans Supabase : SQL Editor
-- Lecture publique des albums et des pistes (page d'accueil)

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE album_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read albums"
  ON albums
  FOR SELECT
  USING (true);

CREATE POLICY "Public can read album_tracks"
  ON album_tracks
  FOR SELECT
  USING (true);

-- Optionnel : politiques INSERT/UPDATE/DELETE pour les comptes authentifiés (admin)
-- CREATE POLICY "Authenticated can manage albums" ON albums FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated can manage album_tracks" ON album_tracks FOR ALL
--   USING (auth.role() = 'authenticated')
--   WITH CHECK (auth.role() = 'authenticated');
