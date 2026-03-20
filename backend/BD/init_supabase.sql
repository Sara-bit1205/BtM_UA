-- ============================================================
-- Behind The Mask - Database Initialization Script (Supabase/PostgreSQL)
-- ============================================================

-- 1. UNIVERSES (Universos: Marvel, Disney, DC, etc.)
CREATE TABLE universes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. UNIVERSE_CATEGORIES (Subcategorías dentro de cada universo)
CREATE TABLE universe_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  universe_id UUID NOT NULL REFERENCES universes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(universe_id, name)
);

-- 3. PERSONALITY_TAGS (Personalidades: alegre, melancólico, agresivo)
CREATE TABLE personality_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. MBTI_TYPES (Tipos MBTI: INTJ, ENFP, etc.)
CREATE TABLE mbti_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(4) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. USERS (Usuarios y Administradores)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  birth_date DATE,
  avatar VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. CHARACTERS (Personajes)
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  cover_image VARCHAR(255),
  description TEXT,
  story TEXT,
  creation_date DATE,
  first_appearance VARCHAR(255),
  biological_origin VARCHAR(255),
  mbti_type_id UUID REFERENCES mbti_types(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHARACTER_UNIVERSE_CATEGORIES (Relación M:N - Personaje con Categorías del Universo)
CREATE TABLE character_universe_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  universe_category_id UUID NOT NULL REFERENCES universe_categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(character_id, universe_category_id)
);

-- 8. CHARACTER_PERSONALITY_TAGS (Relación M:N - Personaje con Tags de Personalidad)
CREATE TABLE character_personality_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  personality_tag_id UUID NOT NULL REFERENCES personality_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(character_id, personality_tag_id)
);

-- 9. FILMOGRAPHY (Películas o series del personaje)
CREATE TABLE filmography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  year INTEGER,
  cover_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. AUDIOS (Banda sonora o canciones)
CREATE TABLE audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('soundtrack', 'song')),
  audio_url VARCHAR(255) NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. COMMENTS (Comentarios de usuarios sobre personajes)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. COMMUNITY_PHOTOS (Galería de comunidad)
CREATE TABLE community_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url VARCHAR(255) NOT NULL,
  description TEXT,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. FAVORITES (Personajes favoritos del usuario)
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, character_id)
);

-- 14. MBTI_RESULTS (Resultados del test MBTI de usuarios)
CREATE TABLE mbti_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mbti_type_id UUID NOT NULL REFERENCES mbti_types(id) ON DELETE CASCADE,
  score DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- ÍNDICES para optimización de queries
-- ============================================================

CREATE INDEX idx_universe_categories_universe_id ON universe_categories(universe_id);
CREATE INDEX idx_characters_mbti_type_id ON characters(mbti_type_id);
CREATE INDEX idx_characters_created_by ON characters(created_by);
CREATE INDEX idx_characters_slug ON characters(slug);
CREATE INDEX idx_character_universe_categories_character_id ON character_universe_categories(character_id);
CREATE INDEX idx_character_personality_tags_character_id ON character_personality_tags(character_id);
CREATE INDEX idx_filmography_character_id ON filmography(character_id);
CREATE INDEX idx_audios_character_id ON audios(character_id);
CREATE INDEX idx_audios_uploaded_by ON audios(uploaded_by);
CREATE INDEX idx_comments_character_id ON comments(character_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_community_photos_character_id ON community_photos(character_id);
CREATE INDEX idx_community_photos_user_id ON community_photos(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_character_id ON favorites(character_id);
CREATE INDEX idx_mbti_results_user_id ON mbti_results(user_id);
CREATE INDEX idx_mbti_results_mbti_type_id ON mbti_results(mbti_type_id);

-- ============================================================
-- SEED DATA (Opcional - Datos iniciales)
-- ============================================================

-- Insertar MBTI Types
INSERT INTO mbti_types (code, title, description) VALUES
('INTJ', 'The Architect', 'Strategic thinker, independent, ambitious'),
('INTP', 'The Logician', 'Innovative, logical, curious'),
('ENTJ', 'The Commander', 'Strategic leader, decisive, ambitious'),
('ENTP', 'The Debater', 'Innovative, flexible, outspoken'),
('INFJ', 'The Advocate', 'Idealistic, principled, determined'),
('INFP', 'The Mediator', 'Idealistic, reliable, creative'),
('ENFJ', 'The Protagonist', 'Charismatic, inspiring, responsible'),
('ENFP', 'The Campaigner', 'Enthusiastic, creative, spontaneous'),
('ISTJ', 'The Logistician', 'Practical, fact-oriented, reliable'),
('ISFJ', 'The Defender', 'Protective, dutiful, kind'),
('ESTJ', 'The Executive', 'Practical, fact-oriented, decisive'),
('ESFJ', 'The Consul', 'Caring, dutiful, supportive'),
('ISTP', 'The Virtuoso', 'Practical, logical, experimental'),
('ISFP', 'The Adventurer', 'Sensitive, kind, artistic'),
('ESTP', 'The Entrepreneur', 'Bold, practical, pragmatic'),
('ESFP', 'The Entertainer', 'Outgoing, spontaneous, fun');

-- Insertar Personality Tags
INSERT INTO personality_tags (name, description) VALUES
('Alegre', 'Personaje con actitud positiva y animada'),
('Melancólico', 'Personaje triste o pensativo'),
('Agresivo', 'Personaje violento o confrontacional'),
('Misterioso', 'Personaje enigmático'),
('Valiente', 'Personaje courageous y sin miedo'),
('Sabio', 'Personaje inteligente y reflexivo'),
('Noble', 'Personaje con buena moral'),
('Astuto', 'Personaje ingenioso y estratégico'),
('Leal', 'Personaje fiel y confiable'),
('Juguetón', 'Personaje bromista y divertido');

-- Insertar Universos
INSERT INTO universes (name, description) VALUES
('Marvel', 'Marvel Cinematic Universe y cómics'),
('DC', 'DC Comics Universe'),
('Disney', 'Disney Animation and Live Action'),
('Harry Potter', 'Wizarding World'),
('Star Wars', 'Galaxia lejana');
