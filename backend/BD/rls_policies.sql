-- ============================================================
-- Row Level Security (RLS) Setup para Behind The Mask
-- Ejecuta esto en tu Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. HABILITAR RLS EN TODAS LAS TABLAS
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE universes ENABLE ROW LEVEL SECURITY;
ALTER TABLE universe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_universe_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_personality_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE filmography ENABLE ROW LEVEL SECURITY;
ALTER TABLE audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE mbti_results ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. POLÍTICAS PARA TABLA: USERS
-- ============================================================

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  USING (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- ============================================================
-- 3. POLÍTICAS PARA TABLA: CHARACTERS (Público para lectura)
-- ============================================================

-- Todos pueden leer personajes
CREATE POLICY "Personajes públicos para lectura"
  ON characters
  FOR SELECT
  USING (true);

-- Solo admins pueden crear
CREATE POLICY "Solo admins crean personajes"
  ON characters
  FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- Solo admins pueden actualizar
CREATE POLICY "Solo admins actualizan personajes"
  ON characters
  FOR UPDATE
  USING (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- Solo admins pueden eliminar
CREATE POLICY "Solo admins eliminan personajes"
  ON characters
  FOR DELETE
  USING (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- ============================================================
-- 4. POLÍTICAS PARA TABLA: UNIVERSES (Público para lectura)
-- ============================================================

CREATE POLICY "Universos públicos para lectura"
  ON universes
  FOR SELECT
  USING (true);

-- ============================================================
-- 5. POLÍTICAS PARA TABLA: UNIVERSE_CATEGORIES (Público)
-- ============================================================

CREATE POLICY "Categorías públicas para lectura"
  ON universe_categories
  FOR SELECT
  USING (true);

-- ============================================================
-- 6. POLÍTICAS PARA TABLA: PERSONALITY_TAGS (Público)
-- ============================================================

CREATE POLICY "Tags públicos para lectura"
  ON personality_tags
  FOR SELECT
  USING (true);

-- ============================================================
-- 7. POLÍTICAS PARA TABLA: MBTI_TYPES (Público)
-- ============================================================

CREATE POLICY "MBTI tipos públicos para lectura"
  ON mbti_types
  FOR SELECT
  USING (true);

-- ============================================================
-- 8. POLÍTICAS PARA TABLA: CHARACTER_UNIVERSE_CATEGORIES
-- ============================================================

CREATE POLICY "Relaciones públicas para lectura"
  ON character_universe_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Admins manejan relaciones"
  ON character_universe_categories
  FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- ============================================================
-- 9. POLÍTICAS PARA TABLA: CHARACTER_PERSONALITY_TAGS
-- ============================================================

CREATE POLICY "Tags relaciones públicas"
  ON character_personality_tags
  FOR SELECT
  USING (true);

CREATE POLICY "Admins manejan tags relaciones"
  ON character_personality_tags
  FOR INSERT
  WITH CHECK (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- ============================================================
-- 10. POLÍTICAS PARA TABLA: FILMOGRAPHY (Público)
-- ============================================================

CREATE POLICY "Filmografía pública para lectura"
  ON filmography
  FOR SELECT
  USING (true);

-- ============================================================
-- 11. POLÍTICAS PARA TABLA: AUDIOS (Público)
-- ============================================================

CREATE POLICY "Audios públicos para lectura"
  ON audios
  FOR SELECT
  USING (true);

-- ============================================================
-- 12. POLÍTICAS PARA TABLA: COMMENTS
-- ============================================================

-- Todos pueden leer comentarios
CREATE POLICY "Comentarios públicos para lectura"
  ON comments
  FOR SELECT
  USING (true);

-- Usuarios autenticados pueden crear
CREATE POLICY "Usuarios autenticados crean comentarios"
  ON comments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Los propios usuarios pueden actualizar sus comentarios
CREATE POLICY "Usuarios actualizan propios comentarios"
  ON comments
  FOR UPDATE
  USING (
    auth.uid()::text = user_id::text
  );

-- Los propios usuarios pueden eliminar sus comentarios
CREATE POLICY "Usuarios eliminan propios comentarios"
  ON comments
  FOR DELETE
  USING (
    auth.uid()::text = user_id::text
  );

-- ============================================================
-- 13. POLÍTICAS PARA TABLA: COMMUNITY_PHOTOS
-- ============================================================

-- Solo fotos aprobadas son públicas
CREATE POLICY "Fotos aprobadas públicas"
  ON community_photos
  FOR SELECT
  USING (approved = true);

-- El propietario y admins ven sus propias fotos
CREATE POLICY "Usuarios ven propias fotos"
  ON community_photos
  FOR SELECT
  USING (
    auth.uid()::text = user_id::text OR
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- Usuarios autenticados pueden subir
CREATE POLICY "Usuarios suben fotos"
  ON community_photos
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
  );

-- Solo admins pueden actualizar
CREATE POLICY "Admins aprueban fotos"
  ON community_photos
  FOR UPDATE
  USING (
    auth.uid()::text IN (SELECT id::text FROM users WHERE role = 'admin')
  );

-- ============================================================
-- 14. POLÍTICAS PARA TABLA: FAVORITES
-- ============================================================

-- Los usuarios solo ven sus propios favoritos
CREATE POLICY "Usuarios ven propios favoritos"
  ON favorites
  FOR SELECT
  USING (
    auth.uid()::text = user_id::text
  );

-- Los usuarios crean sus propios favoritos
CREATE POLICY "Usuarios crean favoritos"
  ON favorites
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id::text
  );

-- Los usuarios eliminan sus propios favoritos
CREATE POLICY "Usuarios eliminan favoritos"
  ON favorites
  FOR DELETE
  USING (
    auth.uid()::text = user_id::text
  );

-- ============================================================
-- 15. POLÍTICAS PARA TABLA: MBTI_RESULTS
-- ============================================================

-- Los usuarios solo ven sus propios resultados
CREATE POLICY "Usuarios ven propios resultados MBTI"
  ON mbti_results
  FOR SELECT
  USING (
    auth.uid()::text = user_id::text
  );

-- Los usuarios crean sus propios resultados
CREATE POLICY "Usuarios guardan resultados MBTI"
  ON mbti_results
  FOR INSERT
  WITH CHECK (
    auth.uid()::text = user_id::text
  );

-- Los usuarios actualizan sus propios resultados
CREATE POLICY "Usuarios actualizan resultados MBTI"
  ON mbti_results
  FOR UPDATE
  USING (
    auth.uid()::text = user_id::text
  );

-- ============================================================
-- RESULTADO: Todas las tablas ahora tienen RLS habilitado y
-- políticas de seguridad apropiadas aplicadas ✅
-- ============================================================
