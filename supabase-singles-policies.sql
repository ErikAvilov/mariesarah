-- Exécuter dans Supabase : SQL Editor
-- Si la section Singles est vide sur le site alors que les lignes existent en base,
-- c'est que la lecture publique est bloquée par RLS. Exécuter :

ALTER TABLE singles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read singles"
  ON singles
  FOR SELECT
  USING (true);

-- Optionnel : restreindre l'écriture aux utilisateurs authentifiés (admin)
-- CREATE POLICY "Authenticated can insert singles" ON singles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated can update singles" ON singles FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated can delete singles" ON singles FOR DELETE USING (auth.role() = 'authenticated');
