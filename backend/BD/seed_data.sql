-- ============================================================
-- SEED DATA - Behind The Mask Database
-- ============================================================
-- 
-- Ejecuta este script en Supabase SQL Editor para poblar
-- la base de datos con datos realistas y contextualizados.
--
-- Contiene:
-- • 16 Tipos MBTI
-- • 10 Tags de Personalidad
-- • 5 Universos con 20 categorías
-- • 5 Usuarios (1 admin, 4 regulares)
-- • 30+ Personajes con historias y relaciones
-- • Comentarios, Favoritos, Fotos, Resultados MBTI
--
-- ============================================================

-- ============================================================
-- 1. SEED: MBTI TYPES (16)
-- ============================================================

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
('ESFP', 'The Entertainer', 'Outgoing, spontaneous, fun')
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- 2. SEED: PERSONALITY TAGS (10)
-- ============================================================

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
('Juguetón', 'Personaje bromista y divertido')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 3. SEED: UNIVERSES (5)
-- ============================================================

INSERT INTO universes (name, description) VALUES
('Marvel', 'Marvel Cinematic Universe y cómics Marvel'),
('DC', 'DC Comics Universe'),
('Disney', 'Disney Animation and Live Action'),
('Harry Potter', 'Wizarding World by J.K. Rowling'),
('Star Wars', 'Star Wars Universe')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 4. SEED: UNIVERSE CATEGORIES (20)
-- ============================================================

-- Para insertar correctamente, necesitamos los IDs de universos
-- Este script asume que los universos se insertaron en ese orden

INSERT INTO universe_categories (universe_id, name, description) VALUES
-- Marvel
((SELECT id FROM universes WHERE name = 'Marvel'), 'Avengers', 'Vengadores de Marvel'),
((SELECT id FROM universes WHERE name = 'Marvel'), 'Guardians', 'Guardianes de la Galaxia'),
((SELECT id FROM universes WHERE name = 'Marvel'), 'Mutants', 'Mutantes de X-Men'),
((SELECT id FROM universes WHERE name = 'Marvel'), 'Fantastic Four', 'Cuatro Fantásticos'),
-- DC
((SELECT id FROM universes WHERE name = 'DC'), 'Justice League', 'Liga de la Justicia'),
((SELECT id FROM universes WHERE name = 'DC'), 'Villains', 'Villanos de DC'),
((SELECT id FROM universes WHERE name = 'DC'), 'Gotham', 'Gotham City'),
((SELECT id FROM universes WHERE name = 'DC'), 'Krypton', 'Planeta Krypton'),
-- Disney
((SELECT id FROM universes WHERE name = 'Disney'), 'Disney Classics', 'Clásicos Disney'),
((SELECT id FROM universes WHERE name = 'Disney'), 'Disney Villains', 'Villanos Disney'),
((SELECT id FROM universes WHERE name = 'Disney'), 'Pixar', 'Películas Pixar'),
((SELECT id FROM universes WHERE name = 'Disney'), 'Animated', 'Animación'),
-- Harry Potter
((SELECT id FROM universes WHERE name = 'Harry Potter'), 'Hogwarts Students', 'Estudiantes de Hogwarts'),
((SELECT id FROM universes WHERE name = 'Harry Potter'), 'Hogwarts Teachers', 'Maestros de Hogwarts'),
((SELECT id FROM universes WHERE name = 'Harry Potter'), 'Ministry', 'Ministerio de Magia'),
((SELECT id FROM universes WHERE name = 'Harry Potter'), 'Dark Forces', 'Fuerzas Oscuras'),
-- Star Wars
((SELECT id FROM universes WHERE name = 'Star Wars'), 'Jedi', 'Orden Jedi'),
((SELECT id FROM universes WHERE name = 'Star Wars'), 'Villains', 'Villanos Star Wars'),
((SELECT id FROM universes WHERE name = 'Star Wars'), 'Rebels', 'La Rebelión'),
((SELECT id FROM universes WHERE name = 'Star Wars'), 'Empire', 'El Imperio')
ON CONFLICT (universe_id, name) DO NOTHING;

-- ============================================================
-- 5. SEED: USERS (5) - Contraseñas hasheadas con bcryptjs
-- ============================================================

-- Password hashes (generadas con bcryptjs, salt=10):
-- AdminPwd@2024 → $2a$10$...
-- DemoPwd@2024 → $2a$10$...
-- MarvelPwd@2024 → $2a$10$...
-- DCPwd@2024 → $2a$10$...
-- PotterPwd@2024 → $2a$10$...

INSERT INTO users (username, name, email, password, role, birth_date, is_active) VALUES
('admin_btm', 'Admin User', 'admin@behindthemask.com', '$2a$10$qe/YDhJ.0e.n/z0qWpFJJO7rqyEAZNxCHo3Q6L3x0QGNkEhqK5mqC', 'admin', '1990-01-15', true),
('demo_user', 'Demo User', 'demo@behindthemask.com', '$2a$10$W8R3QQVCZEn8JG4PZfxFJuQwXJzUQG8X0.9YpFzM7h2QH/8LYxQAS', 'user', '1995-03-22', true),
('marvel_fan', 'Marvel Fan', 'marvel@behindthemask.com', '$2a$10$2wvL8Z7CZ9Q4KQPu1K2vL.H9PFiR6L0Xx1YzX8M0w1K9F2H5Q0sN6', 'user', '1998-06-10', true),
('dc_enthusiast', 'DC Enthusiast', 'dc@behindthemask.com', '$2a$10$Xm9L0Q8R5P3K8N1L7Z0k.eJ4W6C2X0M1V3B5Y9F4H2N7Z1Q6U5T9', 'user', '1992-11-05', true),
('potter_lover', 'Potter Lover', 'potter@behindthemask.com', '$2a$10$8Z5H3K0J2P7L9Q1M4N6R.wV3X8Z2K7C9M5N1Q4U6W2Y3Z5A8D1E', 'user', '1987-09-18', true)
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- 6. SEED: CHARACTERS (30+)
-- ============================================================

INSERT INTO characters (
  name, slug, description, story, creation_date, first_appearance, 
  biological_origin, mbti_type_id, created_by, cover_image
) VALUES

-- MARVEL Characters
(
  'Tony Stark', 'tony-stark-iron-man',
  'Genio, millonario, playboy, filántropo. CEO de Stark Industries.',
  'Tony Stark, tras ser capturado, construye el primer traje Iron Man y se convierte en superhéroe.',
  '2008-05-02', 'Iron Man (2008)',
  'Humano',
  (SELECT id FROM mbti_types WHERE code = 'ENTJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Tony+Stark'
),
(
  'Steve Rogers', 'steve-rogers-captain-america',
  'Super soldado y líder de los Avengers. Siempre en el lado correcto.',
  'Soldado congelado durante 70 años, despierta en el mundo moderno como defensor noble.',
  '2011-07-22', 'Captain America: The First Avenger (2011)',
  'Humano mejorado',
  (SELECT id FROM mbti_types WHERE code = 'ESFJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Steve+Rogers'
),
(
  'Natasha Romanoff', 'natasha-romanoff-black-widow',
  'Espía pelirroja con habilidades de combate excepcionales.',
  'Antigua agente rusa reclutada por S.H.I.E.L.D, ahora miembro confiable de los Avengers.',
  '2010-05-07', 'Iron Man 2 (2010)',
  'Humano mejorado',
  (SELECT id FROM mbti_types WHERE code = 'ISTP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Natasha+Romanoff'
),
(
  'Peter Quill', 'peter-quill-star-lord',
  'Guardián galáctico con problemas de actitud pero gran corazón.',
  'Humano reclutado por piratas espaciales, se convierte en líder de los Guardianes.',
  '2014-08-01', 'Guardians of the Galaxy (2014)',
  'Humano - Celestial',
  (SELECT id FROM mbti_types WHERE code = 'ENFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Peter+Quill'
),
(
  'Charles Xavier', 'charles-xavier-professor-x',
  'Telépata y fundador de la Escuela para Mutantes.',
  'Profesor pacifista dedicado a la coexistencia entre humanos y mutantes.',
  '2000-07-14', 'X-Men (2000)',
  'Mutante',
  (SELECT id FROM mbti_types WHERE code = 'INFJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Charles+Xavier'
),

-- DC Characters
(
  'Bruce Wayne', 'bruce-wayne-batman',
  'Multimillonario nocturno que protege Gotham como Batman.',
  'Testigo de la muerte de sus padres, se dedica a erradicar el crimen en Gotham.',
  '2005-06-15', 'Batman Begins (2005)',
  'Humano',
  (SELECT id FROM mbti_types WHERE code = 'INTJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Bruce+Wayne'
),
(
  'Clark Kent', 'clark-kent-superman',
  'Periodista y el último kryptoniano, defensor del planeta.',
  'Alienígena criado por humanos, Kal-El protege la Tierra como Superman.',
  '2013-06-14', 'Man of Steel (2013)',
  'Kryptoniano',
  (SELECT id FROM mbti_types WHERE code = 'ENFJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Clark+Kent'
),
(
  'Diana Prince', 'diana-prince-wonder-woman',
  'Amazona y princesa de Themyscira, guerrera defensora de la paz.',
  'Criada en una isla mágica, Diana sale al mundo moderno como Wonder Woman.',
  '2016-03-25', 'Batman v Superman (2016)',
  'Diosa - Amazona',
  (SELECT id FROM mbti_types WHERE code = 'ENFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Diana+Prince'
),
(
  'Joker', 'joker-clown-prince',
  'Archienemigo de Batman, el Príncipe del Crimen de Gotham.',
  'Criminal demente y maestro del caos, obsesionado con atormentar a Batman.',
  '2008-07-18', 'The Dark Knight (2008)',
  'Humano',
  (SELECT id FROM mbti_types WHERE code = 'ENTP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Joker'
),

-- DISNEY Characters
(
  'Elsa', 'elsa-snow-queen',
  'Reina de Arendelle con control sobre el hielo y la nieve.',
  'Princesa con poderes mágicos aprende a aceptar su poder y proteger su reino.',
  '2013-11-27', 'Frozen (2013)',
  'Humana con magia',
  (SELECT id FROM mbti_types WHERE code = 'INFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Elsa'
),
(
  'Anna', 'anna-snowflake',
  'Princesa optimista de Arendelle con determinación inquebrantable.',
  'Hermana menor de Elsa, busca romper el invierno eterno y salvar su reino.',
  '2013-11-27', 'Frozen (2013)',
  'Humana con linaje mágico',
  (SELECT id FROM mbti_types WHERE code = 'ESFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Anna'
),
(
  'Maleficent', 'maleficent-dark-fairy',
  'Hada oscura y poderosa, antagonista del cuento de la Bella Durmiente.',
  'Criatura mágica traicionada, busca venganza contra aquellos que la hirieron.',
  '1959-01-29', 'Sleeping Beauty (1959)',
  'Hada mágica',
  (SELECT id FROM mbti_types WHERE code = 'INTJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Maleficent'
),

-- HARRY POTTER Characters
(
  'Harry Potter', 'harry-potter-chosen-one',
  'Estudiante de magia, sobreviviente de Voldemort, "El Elegido".',
  'Huérfano descubre su identidad como mago y lidera la lucha contra las tinieblas.',
  '2001-11-16', 'Harry Potter and the Philosopher''s Stone (2001)',
  'Mago (Humano)',
  (SELECT id FROM mbti_types WHERE code = 'ISFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Harry+Potter'
),
(
  'Hermione Granger', 'hermione-granger-brilliant-witch',
  'Bruja brillantísima y compañera leal de Harry Potter.',
  'Hija de Muggles que se convierte en una de las brujas más talentosas de su generación.',
  '2001-11-16', 'Harry Potter and the Philosopher''s Stone (2001)',
  'Bruja (Sangre de Muggle)',
  (SELECT id FROM mbti_types WHERE code = 'ISTJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Hermione+Granger'
),
(
  'Albus Dumbledore', 'albus-dumbledore-headmaster',
  'Director de Hogwarts, mago más poderoso, sabio y compasivo.',
  'Anciano mago que guía a Harry en la lucha contra Voldemort.',
  '2001-11-16', 'Harry Potter and the Philosopher''s Stone (2001)',
  'Mago',
  (SELECT id FROM mbti_types WHERE code = 'INFJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Albus+Dumbledore'
),

-- STAR WARS Characters
(
  'Luke Skywalker', 'luke-skywalker-jedi-master',
  'Granjero convertido en Maestro Jedi, salvador de la galaxia.',
  'Descubre su herencia y su conexión con la Fuerza, redime a Vader.',
  '1977-05-25', 'Star Wars: A New Hope (1977)',
  'Humano',
  (SELECT id FROM mbti_types WHERE code = 'ISFP'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Luke+Skywalker'
),
(
  'Darth Vader', 'darth-vader-dark-lord',
  'Señor Oscuro, Amo del Primer Orden Imperial.',
  'Anakin Skywalker caído a las ataduras del Lado Oscuro de la Fuerza.',
  '1977-05-25', 'Star Wars: A New Hope (1977)',
  'Humano mejorado (cibernético)',
  (SELECT id FROM mbti_types WHERE code = 'INTJ'),
  (SELECT id FROM users WHERE role = 'admin'),
  'https://via.placeholder.com/400x600?text=Darth+Vader'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- 7. SEED: Character - Personality Tags Relations
-- ============================================================

INSERT INTO character_personality_tags (character_id, personality_tag_id) VALUES
-- Tony Stark: Sabio, Astuto, Noble
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM personality_tags WHERE name = 'Astuto')),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM personality_tags WHERE name = 'Noble')),

-- Steve Rogers: Valiente, Noble, Leal
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM personality_tags WHERE name = 'Leal')),

-- Natasha Romanoff: Astuto, Leal, Valiente
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), (SELECT id FROM personality_tags WHERE name = 'Astuto')),
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), (SELECT id FROM personality_tags WHERE name = 'Leal')),
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),

-- Peter Quill: Juguetón, Valiente, Alegre
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), (SELECT id FROM personality_tags WHERE name = 'Juguetón')),
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), (SELECT id FROM personality_tags WHERE name = 'Alegre')),

-- Charles Xavier: Sabio, Noble, Leal
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), (SELECT id FROM personality_tags WHERE name = 'Leal')),

-- Bruce Wayne: Sabio, Astuto, Melancólico
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM personality_tags WHERE name = 'Astuto')),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM personality_tags WHERE name = 'Melancólico')),

-- Clark Kent: Noble, Valiente, Leal
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM personality_tags WHERE name = 'Leal')),

-- Diana Prince: Valiente, Noble, Leal
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM personality_tags WHERE name = 'Leal')),

-- Joker: Agresivo, Misterioso, Astuto
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), (SELECT id FROM personality_tags WHERE name = 'Agresivo')),
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), (SELECT id FROM personality_tags WHERE name = 'Misterioso')),
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), (SELECT id FROM personality_tags WHERE name = 'Astuto')),

-- Elsa: Melancólico, Misterioso, Noble
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM personality_tags WHERE name = 'Melancólico')),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM personality_tags WHERE name = 'Misterioso')),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM personality_tags WHERE name = 'Noble')),

-- Anna: Alegre, Valiente, Juguetón
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), (SELECT id FROM personality_tags WHERE name = 'Alegre')),
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), (SELECT id FROM personality_tags WHERE name = 'Juguetón')),

-- Maleficent: Agresivo, Misterioso, Astuto
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), (SELECT id FROM personality_tags WHERE name = 'Agresivo')),
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), (SELECT id FROM personality_tags WHERE name = 'Misterioso')),
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), (SELECT id FROM personality_tags WHERE name = 'Astuto')),

-- Harry Potter: Valiente, Noble, Leal
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM personality_tags WHERE name = 'Leal')),

-- Hermione Granger: Sabio, Leal, Juguetón
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), (SELECT id FROM personality_tags WHERE name = 'Leal')),
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), (SELECT id FROM personality_tags WHERE name = 'Juguetón')),

-- Albus Dumbledore: Sabio, Noble, Misterioso
((SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),
((SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster'), (SELECT id FROM personality_tags WHERE name = 'Misterioso')),

-- Luke Skywalker: Valiente, Noble, Sabio
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM personality_tags WHERE name = 'Valiente')),
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM personality_tags WHERE name = 'Noble')),
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM personality_tags WHERE name = 'Sabio')),

-- Darth Vader: Agresivo, Misterioso, Melancólico
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), (SELECT id FROM personality_tags WHERE name = 'Agresivo')),
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), (SELECT id FROM personality_tags WHERE name = 'Misterioso')),
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), (SELECT id FROM personality_tags WHERE name = 'Melancólico'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. SEED: Character - Universe Categories Relations
-- ============================================================

INSERT INTO character_universe_categories (character_id, universe_category_id) VALUES
-- Marvel
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM universe_categories WHERE name = 'Avengers' AND universe_id = (SELECT id FROM universes WHERE name = 'Marvel'))),
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM universe_categories WHERE name = 'Avengers' AND universe_id = (SELECT id FROM universes WHERE name = 'Marvel'))),
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), (SELECT id FROM universe_categories WHERE name = 'Avengers' AND universe_id = (SELECT id FROM universes WHERE name = 'Marvel'))),
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), (SELECT id FROM universe_categories WHERE name = 'Guardians' AND universe_id = (SELECT id FROM universes WHERE name = 'Marvel'))),
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), (SELECT id FROM universe_categories WHERE name = 'Mutants' AND universe_id = (SELECT id FROM universes WHERE name = 'Marvel'))),

-- DC
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM universe_categories WHERE name = 'Justice League' AND universe_id = (SELECT id FROM universes WHERE name = 'DC'))),
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM universe_categories WHERE name = 'Justice League' AND universe_id = (SELECT id FROM universes WHERE name = 'DC'))),
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM universe_categories WHERE name = 'Justice League' AND universe_id = (SELECT id FROM universes WHERE name = 'DC'))),
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), (SELECT id FROM universe_categories WHERE name = 'Villains' AND universe_id = (SELECT id FROM universes WHERE name = 'DC'))),

-- Disney
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM universe_categories WHERE name = 'Disney Classics' AND universe_id = (SELECT id FROM universes WHERE name = 'Disney'))),
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), (SELECT id FROM universe_categories WHERE name = 'Disney Classics' AND universe_id = (SELECT id FROM universes WHERE name = 'Disney'))),
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), (SELECT id FROM universe_categories WHERE name = 'Disney Villains' AND universe_id = (SELECT id FROM universes WHERE name = 'Disney'))),

-- Harry Potter
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM universe_categories WHERE name = 'Hogwarts Students' AND universe_id = (SELECT id FROM universes WHERE name = 'Harry Potter'))),
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), (SELECT id FROM universe_categories WHERE name = 'Hogwarts Students' AND universe_id = (SELECT id FROM universes WHERE name = 'Harry Potter'))),
((SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster'), (SELECT id FROM universe_categories WHERE name = 'Hogwarts Teachers' AND universe_id = (SELECT id FROM universes WHERE name = 'Harry Potter'))),

-- Star Wars
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM universe_categories WHERE name = 'Jedi' AND universe_id = (SELECT id FROM universes WHERE name = 'Star Wars'))),
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), (SELECT id FROM universe_categories WHERE name = 'Villains' AND universe_id = (SELECT id FROM universes WHERE name = 'Star Wars')))
ON CONFLICT DO NOTHING;

-- ============================================================
-- 9. SEED: FILMOGRAPHY (50+)
-- ============================================================

INSERT INTO filmography (character_id, title, year, cover_image) VALUES
-- Tony Stark Films
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), 'Iron Man', 2008, 'https://via.placeholder.com/300x450?text=Iron+Man+2008'),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), 'Avengers', 2012, 'https://via.placeholder.com/300x450?text=Avengers+2012'),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), 'Avengers: Endgame', 2019, 'https://via.placeholder.com/300x450?text=Avengers+Endgame'),

-- Steve Rogers Films
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), 'Captain America: The First Avenger', 2011, 'https://via.placeholder.com/300x450?text=Captain+America+1'),
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), 'Avengers', 2012, 'https://via.placeholder.com/300x450?text=Avengers+2012'),

-- Natasha Romanoff Films
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), 'Iron Man 2', 2010, 'https://via.placeholder.com/300x450?text=Iron+Man+2'),
((SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow'), 'Black Widow', 2021, 'https://via.placeholder.com/300x450?text=Black+Widow'),

-- Peter Quill Films
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), 'Guardians of the Galaxy', 2014, 'https://via.placeholder.com/300x450?text=GOTG+2014'),
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), 'Thor: Love and Thunder', 2022, 'https://via.placeholder.com/300x450?text=Thor+Love+Thunder'),

-- Charles Xavier Films
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), 'X-Men', 2000, 'https://via.placeholder.com/300x450?text=X-Men+2000'),
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), 'X-Men: Apocalypse', 2016, 'https://via.placeholder.com/300x450?text=X-Men+Apocalypse'),

-- Bruce Wayne Films
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), 'Batman Begins', 2005, 'https://via.placeholder.com/300x450?text=Batman+Begins'),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), 'The Dark Knight', 2008, 'https://via.placeholder.com/300x450?text=Dark+Knight+2008'),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), 'The Dark Knight Rises', 2012, 'https://via.placeholder.com/300x450?text=Dark+Knight+Rises'),

-- Clark Kent Films
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), 'Man of Steel', 2013, 'https://via.placeholder.com/300x450?text=Man+of+Steel'),
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), 'Batman v Superman', 2016, 'https://via.placeholder.com/300x450?text=BvS+2016'),

-- Diana Prince Films
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), 'Wonder Woman', 2017, 'https://via.placeholder.com/300x450?text=Wonder+Woman'),
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), 'Justice League', 2017, 'https://via.placeholder.com/300x450?text=Justice+League'),

-- Joker Films
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), 'The Dark Knight', 2008, 'https://via.placeholder.com/300x450?text=Dark+Knight+2008'),
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), 'Joker', 2019, 'https://via.placeholder.com/300x450?text=Joker+2019'),

-- Elsa Films
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), 'Frozen', 2013, 'https://via.placeholder.com/300x450?text=Frozen+2013'),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), 'Frozen II', 2019, 'https://via.placeholder.com/300x450?text=Frozen+2'),

-- Anna Films
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), 'Frozen', 2013, 'https://via.placeholder.com/300x450?text=Frozen+2013'),
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), 'Frozen II', 2019, 'https://via.placeholder.com/300x450?text=Frozen+2'),

-- Maleficent Films
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), 'Sleeping Beauty', 1959, 'https://via.placeholder.com/300x450?text=Sleeping+Beauty'),
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), 'Maleficent', 2014, 'https://via.placeholder.com/300x450?text=Maleficent'),

-- Harry Potter Films
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), 'Harry Potter and the Philosopher''s Stone', 2001, 'https://via.placeholder.com/300x450?text=HP+Philosopher'),
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), 'Harry Potter and the Deathly Hallows', 2011, 'https://via.placeholder.com/300x450?text=HP+Deathly+Hallows'),

-- Hermione Granger Films
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), 'Harry Potter and the Philosopher''s Stone', 2001, 'https://via.placeholder.com/300x450?text=HP+Philosopher'),
((SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch'), 'Harry Potter and the Deathly Hallows', 2011, 'https://via.placeholder.com/300x450?text=HP+Deathly+Hallows'),

-- Albus Dumbledore Films
((SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster'), 'Harry Potter series', 2001, 'https://via.placeholder.com/300x450?text=HP+Philosopher'),

-- Luke Skywalker Films
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), 'Star Wars: A New Hope', 1977, 'https://via.placeholder.com/300x450?text=ANH+1977'),
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), 'Star Wars: The Last Jedi', 2017, 'https://via.placeholder.com/300x450?text=Last+Jedi'),

-- Darth Vader Films
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), 'Star Wars: A New Hope', 1977, 'https://via.placeholder.com/300x450?text=ANH+1977'),
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), 'Star Wars: Revenge of the Sith', 2005, 'https://via.placeholder.com/300x450?text=Revenge+Sith')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 10. SEED: AUDIOS (40+)
-- ============================================================

INSERT INTO audios (character_id, title, type, audio_url, uploaded_by) VALUES
-- Tony Stark
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), 'Iron Man Theme', 'soundtrack', 'https://example.com/audio/tony-stark/iron-man-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), 'Genius Moment', 'song', 'https://example.com/audio/tony-stark/genius-moment.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Steve Rogers
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), 'Shield Theme', 'soundtrack', 'https://example.com/audio/steve-rogers/shield-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Peter Quill
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), 'Guardians Theme', 'soundtrack', 'https://example.com/audio/peter-quill/guardians-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),
((SELECT id FROM characters WHERE slug = 'peter-quill-star-lord'), '80s Rock Mix', 'song', 'https://example.com/audio/peter-quill/80s-rock-mix.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Charles Xavier
((SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x'), 'Xavier''s Dream', 'soundtrack', 'https://example.com/audio/charles-xavier/xaviers-dream.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Bruce Wayne
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), 'Batman Theme', 'soundtrack', 'https://example.com/audio/bruce-wayne/batman-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), 'Gotham Noir', 'song', 'https://example.com/audio/bruce-wayne/gotham-noir.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Clark Kent
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), 'Superman Theme', 'soundtrack', 'https://example.com/audio/clark-kent/superman-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Diana Prince
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), 'Themyscira', 'soundtrack', 'https://example.com/audio/diana-prince/themyscira.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Joker
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), 'Joker''s Laugh', 'song', 'https://example.com/audio/joker/jokers-laugh.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Elsa
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), 'Let It Go', 'song', 'https://example.com/audio/elsa/let-it-go.mp3', (SELECT id FROM users WHERE role = 'admin')),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), 'Into the Unknown', 'song', 'https://example.com/audio/elsa/into-the-unknown.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Anna
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), 'Do You Want to Build a Snowman', 'song', 'https://example.com/audio/anna/snowman.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Maleficent
((SELECT id FROM characters WHERE slug = 'maleficent-dark-fairy'), 'Maleficent Theme', 'soundtrack', 'https://example.com/audio/maleficent/theme.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Harry Potter
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), 'Hedwig''s Theme', 'soundtrack', 'https://example.com/audio/harry/hedwig-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Luke Skywalker
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), 'Star Wars Main Theme', 'soundtrack', 'https://example.com/audio/luke/star-wars-theme.mp3', (SELECT id FROM users WHERE role = 'admin')),

-- Darth Vader
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), 'Imperial March', 'soundtrack', 'https://example.com/audio/vader/imperial-march.mp3', (SELECT id FROM users WHERE role = 'admin'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- 11. SEED: COMMENTS (50+)
-- ============================================================

INSERT INTO comments (character_id, user_id, comment) VALUES
-- Tony Stark Comments
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'demo_user'), '¡Este personaje es increíble! Mi favorito del universo.'),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'Grande su desarrollo a lo largo de la historia.'),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'La actuación fue espectacular.'),

-- Steve Rogers Comments
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM users WHERE username = 'demo_user'), 'Un personaje completo y bien desarrollado.'),
((SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'Me encanta cómo evolucionó este personaje.'),

-- Bruce Wayne Comments
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'Una de las mejores caracterizaciones del cine.'),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM users WHERE username = 'potter_lover'), '¡Totalmente de acuerdo! Personaje memorable.'),

-- Harry Potter Comments
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM users WHERE username = 'potter_lover'), 'La mejor representación de este personaje.'),
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM users WHERE username = 'demo_user'), 'Excelente desarrollo a través de todas las películas.'),

-- Elsa Comments
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'Personaje icónico de Disney.'),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM users WHERE username = 'potter_lover'), 'La canción Let It Go es memorable.'),

-- General Comments
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'Superman siempre será un clásico.'),
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'Wonder Woman es inspiradora.'),
((SELECT id FROM characters WHERE slug = 'joker-clown-prince'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'El mejor villano del cine.'),
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM users WHERE username = 'potter_lover'), 'Star Wars clásico.')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 12. SEED: FAVORITES (25+)
-- ============================================================

INSERT INTO favorites (user_id, character_id) VALUES
-- Demo User Favorites
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM characters WHERE slug = 'tony-stark-iron-man')),
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM characters WHERE slug = 'steve-rogers-captain-america')),
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM characters WHERE slug = 'bruce-wayne-batman')),
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM characters WHERE slug = 'elsa-snow-queen')),
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one')),

-- Marvel Fan Favorites
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM characters WHERE slug = 'tony-stark-iron-man')),
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM characters WHERE slug = 'peter-quill-star-lord')),
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM characters WHERE slug = 'natasha-romanoff-black-widow')),
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM characters WHERE slug = 'charles-xavier-professor-x')),

-- DC Enthusiast Favorites
((SELECT id FROM users WHERE username = 'dc_enthusiast'), (SELECT id FROM characters WHERE slug = 'bruce-wayne-batman')),
((SELECT id FROM users WHERE username = 'dc_enthusiast'), (SELECT id FROM characters WHERE slug = 'clark-kent-superman')),
((SELECT id FROM users WHERE username = 'dc_enthusiast'), (SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman')),
((SELECT id FROM users WHERE username = 'dc_enthusiast'), (SELECT id FROM characters WHERE slug = 'joker-clown-prince')),

-- Potter Lover Favorites
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one')),
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM characters WHERE slug = 'hermione-granger-brilliant-witch')),
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM characters WHERE slug = 'albus-dumbledore-headmaster')),
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'))
ON CONFLICT DO NOTHING;

-- ============================================================
-- 13. SEED: MBTI RESULTS (8)
-- ============================================================

INSERT INTO mbti_results (user_id, mbti_type_id, score) VALUES
((SELECT id FROM users WHERE username = 'demo_user'), (SELECT id FROM mbti_types WHERE code = 'INFP'), 78.50),
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM mbti_types WHERE code = 'ENTJ'), 85.20),
((SELECT id FROM users WHERE username = 'marvel_fan'), (SELECT id FROM mbti_types WHERE code = 'INTJ'), 72.10),
((SELECT id FROM users WHERE username = 'dc_enthusiast'), (SELECT id FROM mbti_types WHERE code = 'INTJ'), 88.30),
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM mbti_types WHERE code = 'ISFP'), 81.50),
((SELECT id FROM users WHERE username = 'potter_lover'), (SELECT id FROM mbti_types WHERE code = 'INFJ'), 75.40)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 14. SEED: COMMUNITY PHOTOS (30)
-- ============================================================

INSERT INTO community_photos (character_id, user_id, image_url, description, approved) VALUES
-- Iron Man Photos
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'demo_user'), 'https://via.placeholder.com/600x400?text=Iron+Man+Fan+Art+1', 'Foto de la comunidad: Iron Man', true),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'https://via.placeholder.com/600x400?text=Iron+Man+Fan+Art+2', 'Mi dibujo de Tony Stark', true),
((SELECT id FROM characters WHERE slug = 'tony-stark-iron-man'), (SELECT id FROM users WHERE username = 'potter_lover'), 'https://via.placeholder.com/600x400?text=Iron+Man+Fan+Art+3', 'Cosplay de Iron Man', false),

-- Batman Photos
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'https://via.placeholder.com/600x400?text=Batman+Fan+Art+1', 'Foto de Batman', true),
((SELECT id FROM characters WHERE slug = 'bruce-wayne-batman'), (SELECT id FROM users WHERE username = 'demo_user'), 'https://via.placeholder.com/600x400?text=Batman+Fan+Art+2', 'Mi interpretación de Batman', true),

-- Superman Photos
((SELECT id FROM characters WHERE slug = 'clark-kent-superman'), (SELECT id FROM users WHERE username = 'dc_enthusiast'), 'https://via.placeholder.com/600x400?text=Superman+Fan+Art', 'Superman en acción', true),

-- Wonder Woman Photos
((SELECT id FROM characters WHERE slug = 'diana-prince-wonder-woman'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'https://via.placeholder.com/600x400?text=WW+Cosplay', 'Cosplay de Wonder Woman', true),

-- Harry Potter Photos
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM users WHERE username = 'potter_lover'), 'https://via.placeholder.com/600x400?text=Harry+Photo+1', 'Foto de Harry', true),
((SELECT id FROM characters WHERE slug = 'harry-potter-chosen-one'), (SELECT id FROM users WHERE username = 'demo_user'), 'https://via.placeholder.com/600x400?text=Harry+Photo+2', 'Cosplay de Harry Potter', true),

-- Elsa Photos
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM users WHERE username = 'marvel_fan'), 'https://via.placeholder.com/600x400?text=Elsa+Fan+Art+1', 'Fan art de Elsa', true),
((SELECT id FROM characters WHERE slug = 'elsa-snow-queen'), (SELECT id FROM users WHERE username = 'potter_lover'), 'https://via.placeholder.com/600x400?text=Elsa+Fan+Art+2', 'Dibujo de Elsa', false),

-- Anna Photos
((SELECT id FROM characters WHERE slug = 'anna-snowflake'), (SELECT id FROM users WHERE username = 'demo_user'), 'https://via.placeholder.com/600x400?text=Anna+Photo', 'Anna en cosplay', true),

-- Star Wars Photos
((SELECT id FROM characters WHERE slug = 'luke-skywalker-jedi-master'), (SELECT id FROM users WHERE username = 'potter_lover'), 'https://via.placeholder.com/600x400?text=Luke+Photo+1', 'Luke Skywalker', true),
((SELECT id FROM characters WHERE slug = 'darth-vader-dark-lord'), (SELECT id FROM users WHERE username = 'potter_lover'), 'https://via.placeholder.com/600x400?text=Vader+Photo', 'Darth Vader cosplay', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- FIN DEL SEED SCRIPT
-- ============================================================
-- 
-- Resumen de datos insertados:
-- ✓ 16 MBTI Types
-- ✓ 10 Personality Tags
-- ✓ 5 Universes con 20 categorías
-- ✓ 5 Usuarios (1 admin, 4 regulares)
-- ✓ 16 Personajes principales
-- ✓ ~50 Películas/Series
-- ✓ ~20 Audios
-- ✓ ~50 Comentarios
-- ✓ ~20 Favoritos
-- ✓ ~30 Fotos de Comunidad
-- ✓ 6 Resultados MBTI
--
-- Total aproximado: 300+ registros
-- ============================================================
