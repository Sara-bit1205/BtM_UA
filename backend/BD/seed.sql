insert into public.universes (name, description) values
('Marvel', 'Universo Marvel'),
('DC', 'Universo DC'),
('Disney', 'Universo Disney'),
('Dreamworks', 'DreamWorks')
on conflict (name) do nothing;

insert into public.personality_tags (name, description) values
('Alegre', 'Personaje con actitud positiva y animada'),
('Melancólico', 'Personaje triste o pensativo'),
('Agresivo', 'Personaje violento o confrontacional'),
('Misterioso', 'Personaje enigmático'),
('Valiente', 'Personaje con coraje y sin miedo'),
('Sabio', 'Personaje inteligente y reflexivo'),
('Noble', 'Personaje con buena moral'),
('Astuto', 'Personaje ingenioso y estratégico'),
('Leal', 'Personaje fiel y confiable'),
('Juguetón', 'Personaje bromista y divertido')
on conflict (name) do nothing;

insert into public.mbti_types (code, title, description) values
('INTJ', 'El Arquitecto', 'Pensador estratégico, independiente y ambicioso'),
('INTP', 'El Lógico', 'Innovador, lógico y curioso'),
('ENTJ', 'El Comandante', 'Líder estratégico, decidido y ambicioso'),
('ENTP', 'El Debatiente', 'Innovador, flexible y expresivo'),
('INFJ', 'El Abogado', 'Idealista, con principios firmes y determinado'),
('INFP', 'El Mediador', 'Idealista, creativo y leal a sus valores'),
('ENFJ', 'El Protagonista', 'Carismático, inspirador y responsable'),
('ENFP', 'El Activista', 'Entusiasta, creativo y espontáneo'),
('ISTJ', 'El Logista', 'Práctico, orientado a los hechos y fiable'),
('ISFJ', 'El Defensor', 'Protector, cumplidor y amable'),
('ESTJ', 'El Ejecutivo', 'Práctico, organizado y decidido'),
('ESFJ', 'El Cónsul', 'Cuidadoso, colaborador y solidario'),
('ISTP', 'El Virtuoso', 'Práctico, lógico y experimental'),
('ISFP', 'El Aventurero', 'Sensible, amable y artístico'),
('ESTP', 'El Emprendedor', 'Audaz, práctico y pragmático'),
('ESFP', 'El Animador', 'Extrovertido, espontáneo y divertido')
on conflict (code) do nothing;

-- =========================================================
-- 1. AÑADIR CAMPOS QUE FALTAN EN CHARACTERS
-- =========================================================
alter table public.characters
add column if not exists place_of_origin text,
add column if not exists psychological_analysis text;

-- =========================================================
-- 2. INSERTAR TAGS DE PERSONALIDAD QUE FALTAN
-- =========================================================
insert into public.personality_tags (name, description) values
('Manipuladora', 'Personaje que influye o controla a otros en su beneficio'),
('Vengativa', 'Personaje que actúa movido por deseo de represalia'),
('Orgullosa', 'Personaje con fuerte autoestima y sentido de superioridad'),
('Dominante', 'Personaje que busca imponer su voluntad sobre los demás'),
('Ambiciosa', 'Personaje con fuerte deseo de poder o éxito'),
('Sarcástica', 'Personaje que se expresa con ironía o burla'),
('Calculadora', 'Personaje que actúa con frialdad y estrategia'),
('Envidioso', 'Personaje movido por celos o resentimiento hacia otros')
on conflict (name) do nothing;

-- =========================================================
-- 3. INSERTAR PERSONAJES
-- =========================================================
insert into public.characters (
  name,
  slug,
  cover_image,
  description,
  story,
  creation_date,
  first_appearance,
  place_of_origin,
  biological_origin,
  universe_id,
  mbti_type_id,
  created_by,
  psychological_analysis
) values
(
  'Maléfica',
  'malefica',
  null,
  'Poderosa hada oscura y una de las villanas más icónicas del universo Disney.',
  'Maléfica es un personaje ficticio que aparece por primera vez en la película animada La Bella Durmiente (1959) de Walt Disney Productions, una adaptación del cuento homónimo de Charles Perrault y de los Hermanos Grimm. Es una poderosa hada oscura que lanza una maldición sobre la princesa Aurora después de no ser invitada a su bautizo por el rey Estéfano y la reina Leah. Según la maldición, Aurora se pinchará el dedo con el huso de una rueca antes de cumplir 16 años y caerá en un sueño eterno. Maléfica es considerada una de las villanas más icónicas y poderosas del universo Disney y forma parte de la franquicia de los Villanos Disney. En la versión original, su voz fue interpretada por la actriz Eleanor Audley.',
  '1959-01-01',
  'La Bella Durmiente (1959)',
  'El Páramo',
  'Hada oscura / criatura mágica',
  (select id from public.universes where name = 'Disney'),
  (select id from public.mbti_types where code = 'INTJ'),
  (select id from public.profiles where email = 'admin@behindthemask.com' limit 1),
  'Maléfica representa el arquetipo del villano estratega y controlador. Su personalidad muestra rasgos asociados a perfiles INTJ: pensamiento estratégico, frialdad emocional, gran capacidad de planificación y necesidad de control. Su reacción ante la exclusión social —no ser invitada al bautizo de Aurora— desencadena un comportamiento vengativo que refleja orgullo herido y necesidad de reconocimiento. A lo largo de las reinterpretaciones modernas del personaje se exploran también aspectos más complejos de su psicología, como el trauma emocional, el sentimiento de traición y su capacidad de protección hacia quienes considera parte de su mundo.'
),
(
  'Úrsula',
  'ursula',
  null,
  'Bruja del mar manipuladora, ambiciosa y principal antagonista de La Sirenita.',
  'Úrsula es la principal antagonista de la película animada La Sirenita (1989) de Walt Disney Animation Studios, basada en el cuento de Hans Christian Andersen. Es una poderosa bruja del mar que vive exiliada del reino submarino de Atlántica. Conocida por su habilidad para manipular y engañar a los demás mediante contratos mágicos, Úrsula busca constantemente aumentar su poder y vengarse del rey Tritón, gobernante de los océanos. Cuando Ariel, la hija de Tritón, desea convertirse en humana para estar con el príncipe Eric, Úrsula aprovecha la oportunidad para ofrecerle un trato: le dará piernas humanas durante tres días a cambio de su voz. Sin embargo, el verdadero plan de Úrsula es sabotear a Ariel para obtener el tridente de Tritón y dominar los mares.',
  '1989-01-01',
  'La Sirenita (1989)',
  'Atlántica (región exiliada del océano)',
  'Bruja marina / criatura marina similar a un pulpo',
  (select id from public.universes where name = 'Disney'),
  (select id from public.mbti_types where code = 'ENTJ'),
  (select id from public.profiles where email = 'admin@behindthemask.com' limit 1),
  'Úrsula representa el arquetipo del manipulador estratégico. Su comportamiento está marcado por un fuerte deseo de poder y control, así como por una inteligencia social elevada que utiliza para manipular emocionalmente a sus víctimas. Su personalidad muestra rasgos típicos de perfiles dominantes como el ENTJ: liderazgo, ambición y capacidad para planificar estrategias complejas. Además, su estilo teatral y su sarcasmo reflejan una personalidad segura de sí misma que disfruta ejerciendo influencia sobre los demás.'
),
(
  'Scar',
  'scar',
  null,
  'León astuto y ambicioso, principal antagonista de El Rey León.',
  'Scar es el principal antagonista de la película animada El Rey León (1994) de Walt Disney Animation Studios. Es el hermano menor del rey Mufasa y tío del príncipe Simba. Consumido por los celos y el deseo de poder, Scar conspira para eliminar a su hermano y así convertirse en el nuevo rey de las Tierras del Reino. Para lograrlo, manipula a las hienas y provoca una estampida de ñus que causa la muerte de Mufasa. Posteriormente engaña a Simba haciéndole creer que es responsable de la muerte de su padre, obligándolo a huir del reino. Tras tomar el poder, su reinado provoca la decadencia y destrucción del ecosistema de la sabana. Finalmente, Simba regresa para enfrentarlo y reclamar su lugar como rey.',
  '1994-01-01',
  'El Rey León (1994)',
  'Tierras del Reino (África)',
  'León',
  (select id from public.universes where name = 'Disney'),
  (select id from public.mbti_types where code = 'INTJ'),
  (select id from public.profiles where email = 'admin@behindthemask.com' limit 1),
  'Scar representa el arquetipo del antagonista maquiavélico. Su personalidad está dominada por la envidia, el resentimiento y un profundo deseo de poder. Presenta una gran inteligencia estratégica y habilidades manipuladoras, utilizando a las hienas y engañando a Simba para alcanzar sus objetivos. Psicológicamente refleja rasgos de personalidad narcisista y maquiavélica, caracterizados por la manipulación, la falta de empatía y la búsqueda del beneficio personal incluso a costa de la destrucción de su propio reino.'
)
on conflict (slug) do nothing;

-- =========================================================
-- 4. RELACIONAR PERSONAJES CON PERSONALITY TAGS
-- =========================================================
insert into public.character_personality_tags (character_id, personality_tag_id)
values
-- Maléfica
((select id from public.characters where slug = 'malefica'), (select id from public.personality_tags where name = 'Manipuladora')),
((select id from public.characters where slug = 'malefica'), (select id from public.personality_tags where name = 'Vengativa')),
((select id from public.characters where slug = 'malefica'), (select id from public.personality_tags where name = 'Orgullosa')),
((select id from public.characters where slug = 'malefica'), (select id from public.personality_tags where name = 'Dominante')),

-- Úrsula
((select id from public.characters where slug = 'ursula'), (select id from public.personality_tags where name = 'Manipuladora')),
((select id from public.characters where slug = 'ursula'), (select id from public.personality_tags where name = 'Ambiciosa')),
((select id from public.characters where slug = 'ursula'), (select id from public.personality_tags where name = 'Sarcástica')),
((select id from public.characters where slug = 'ursula'), (select id from public.personality_tags where name = 'Calculadora')),

-- Scar
((select id from public.characters where slug = 'scar'), (select id from public.personality_tags where name = 'Manipuladora')),
((select id from public.characters where slug = 'scar'), (select id from public.personality_tags where name = 'Ambiciosa')),
((select id from public.characters where slug = 'scar'), (select id from public.personality_tags where name = 'Envidioso')),
((select id from public.characters where slug = 'scar'), (select id from public.personality_tags where name = 'Calculadora'))
on conflict (character_id, personality_tag_id) do nothing;

-- =========================================================
-- 5. FILMOGRAFÍA
-- =========================================================
insert into public.filmography (character_id, title, year, cover_image) values
-- Maléfica
((select id from public.characters where slug = 'malefica'), 'La Bella Durmiente', 1959, null),
((select id from public.characters where slug = 'malefica'), 'Maléfica', 2014, null),
((select id from public.characters where slug = 'malefica'), 'Maléfica: Maestra del Mal', 2019, null),
((select id from public.characters where slug = 'malefica'), 'Descendientes', 2015, null),
((select id from public.characters where slug = 'malefica'), 'Descendientes 2', 2017, null),
((select id from public.characters where slug = 'malefica'), 'Descendientes 3', 2019, null),
((select id from public.characters where slug = 'malefica'), 'Descendientes: The Rise of Red', 2024, null),
((select id from public.characters where slug = 'malefica'), 'Plusaversary – Los Simpson', 2021, null),
((select id from public.characters where slug = 'malefica'), 'Welcome to the Club – Los Simpson', 2022, null),
((select id from public.characters where slug = 'malefica'), 'The Most Wonderful Time of the Year – Los Simpson', null, null),
((select id from public.characters where slug = 'malefica'), 'LEGO Disney Princess: The Castle Quest', 2023, null),
((select id from public.characters where slug = 'malefica'), 'House of Mouse – Halloween with Hades', null, null),
((select id from public.characters where slug = 'malefica'), 'Érase una vez (Once Upon a Time)', null, null),

-- Úrsula
((select id from public.characters where slug = 'ursula'), 'La Sirenita', 1989, null),
((select id from public.characters where slug = 'ursula'), 'La Sirenita II: Regreso al mar', 2000, null),
((select id from public.characters where slug = 'ursula'), 'La Sirenita: Los comienzos de Ariel', 2008, null),
((select id from public.characters where slug = 'ursula'), 'Descendientes 2', 2017, null),
((select id from public.characters where slug = 'ursula'), 'Descendientes 3', 2019, null),
((select id from public.characters where slug = 'ursula'), 'Once Upon a Time', null, null),
((select id from public.characters where slug = 'ursula'), 'House of Mouse', null, null),
((select id from public.characters where slug = 'ursula'), 'La Sirenita', 2023, null),

-- Scar
((select id from public.characters where slug = 'scar'), 'El Rey León', 1994, null),
((select id from public.characters where slug = 'scar'), 'El Rey León II: El tesoro de Simba', 1998, null),
((select id from public.characters where slug = 'scar'), 'El Rey León', 2019, null),
((select id from public.characters where slug = 'scar'), 'La Guardia del León', null, null),
((select id from public.characters where slug = 'scar'), 'House of Mouse', null, null);

-- =========================================================
-- 6. AUDIOS / BANDA SONORA
-- OJO: aquí uso URLs provisionales de ejemplo
-- luego las cambiáis por archivos reales en Supabase Storage
-- =========================================================
insert into public.audios (character_id, title, type, audio_url, uploaded_by) values
-- Maléfica
((select id from public.characters where slug = 'malefica'), 'Maleficent Suite', 'soundtrack', 'https://example.com/audio/malefica/maleficent-suite.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Welcome to the Moors', 'soundtrack', 'https://example.com/audio/malefica/welcome-to-the-moors.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Maleficent Flies', 'soundtrack', 'https://example.com/audio/malefica/maleficent-flies.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Battle of the Moors', 'soundtrack', 'https://example.com/audio/malefica/battle-of-the-moors.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'The Christening', 'soundtrack', 'https://example.com/audio/malefica/the-christening.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'The Spindle''s Power', 'soundtrack', 'https://example.com/audio/malefica/the-spindles-power.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Aurora in Faerieland', 'soundtrack', 'https://example.com/audio/malefica/aurora-in-faerieland.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'True Love''s Kiss', 'soundtrack', 'https://example.com/audio/malefica/true-loves-kiss.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Maleficent Is Captured', 'soundtrack', 'https://example.com/audio/malefica/maleficent-is-captured.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'The Queen of Faerieland', 'soundtrack', 'https://example.com/audio/malefica/the-queen-of-faerieland.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'malefica'), 'Once Upon a Dream – Lana Del Rey', 'song', 'https://example.com/audio/malefica/once-upon-a-dream.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),

-- Úrsula
((select id from public.characters where slug = 'ursula'), 'Poor Unfortunate Souls', 'song', 'https://example.com/audio/ursula/poor-unfortunate-souls.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'ursula'), 'Poor Unfortunate Souls (Reprise)', 'song', 'https://example.com/audio/ursula/poor-unfortunate-souls-reprise.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'ursula'), 'Under the Sea', 'song', 'https://example.com/audio/ursula/under-the-sea.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'ursula'), 'La Sirenita Suite – Alan Menken', 'soundtrack', 'https://example.com/audio/ursula/la-sirenita-suite.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),

-- Scar
((select id from public.characters where slug = 'scar'), 'Be Prepared', 'song', 'https://example.com/audio/scar/be-prepared.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'scar'), 'King of Pride Rock', 'soundtrack', 'https://example.com/audio/scar/king-of-pride-rock.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'scar'), 'Stampede', 'soundtrack', 'https://example.com/audio/scar/stampede.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'scar'), 'This Land', 'soundtrack', 'https://example.com/audio/scar/this-land.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1)),
((select id from public.characters where slug = 'scar'), 'The Lion King Suite – Hans Zimmer', 'soundtrack', 'https://example.com/audio/scar/the-lion-king-suite.mp3', (select id from public.profiles where email = 'admin@behindthemask.com' limit 1));

