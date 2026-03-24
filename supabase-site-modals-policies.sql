-- Exécuter dans Supabase : SQL Editor
-- Lecture publique du modal actif (optionnel si pas de RLS sur la table)

ALTER TABLE site_modals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site modals"
  ON site_modals
  FOR SELECT
  USING (true);
