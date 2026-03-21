-- =========================================================
-- Behind The Mask - Esquema completo para Supabase
-- =========================================================

-- =========================================================
-- LIMPIAR: Eliminar todas las tablas y funciones
-- =========================================================
drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_universes_updated_at on public.universes;
drop trigger if exists set_personality_tags_updated_at on public.personality_tags;
drop trigger if exists set_mbti_types_updated_at on public.mbti_types;
drop trigger if exists set_characters_updated_at on public.characters;
drop trigger if exists set_filmography_updated_at on public.filmography;
drop trigger if exists set_comments_updated_at on public.comments;
drop trigger if exists set_community_photos_updated_at on public.community_photos;
drop trigger if exists set_mbti_results_updated_at on public.mbti_results;
drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.set_updated_at();
drop function if exists public.handle_new_user();
drop function if exists public.is_admin() cascade;

drop table if exists public.mbti_results cascade;
drop table if exists public.favorites cascade;
drop table if exists public.community_photos cascade;
drop table if exists public.comments cascade;
drop table if exists public.audios cascade;
drop table if exists public.filmography cascade;
drop table if exists public.character_personality_tags cascade;
drop table if exists public.characters cascade;
drop table if exists public.profiles cascade;
drop table if exists public.mbti_types cascade;
drop table if exists public.personality_tags cascade;
drop table if exists public.universes cascade;

create extension if not exists pgcrypto;

-- =========================================================
-- 1. PROFILES
-- Datos extra del usuario
-- El login real vive en auth.users
-- =========================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  name text,
  email text unique,
  role text not null default 'user' check (role in ('user', 'admin')),
  birth_date date,
  avatar text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 2. UNIVERSOS
-- Grupo fijo de la web: UNIVERSO
-- Los valores sí se pueden crear/editar/borrar
-- =========================================================
create table public.universes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 3. TAGS DE PERSONALIDAD
-- Grupo fijo de la web: PERSONALIDAD
-- Los valores sí se pueden crear/editar/borrar
-- =========================================================
create table public.personality_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 4. TIPOS MBTI
-- Grupo fijo de la web: PERSONALIDAD MBTI
-- Recomendación: mantener los 16 tipos estándar
-- =========================================================
create table public.mbti_types (
  id uuid primary key default gen_random_uuid(),
  code varchar(4) not null unique,
  title text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 5. PERSONAJES
-- Cada personaje pertenece a 1 universo y 1 MBTI
-- =========================================================
create table public.characters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  cover_image text,
  description text,
  story text,
  creation_date date,
  first_appearance text,
  biological_origin text,
  universe_id uuid references public.universes(id) on delete set null,
  mbti_type_id uuid references public.mbti_types(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 6. RELACIÓN PERSONAJE - TAG PERSONALIDAD
-- Un personaje puede tener varias personalidades
-- =========================================================
create table public.character_personality_tags (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  personality_tag_id uuid not null references public.personality_tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (character_id, personality_tag_id)
);

-- =========================================================
-- 7. FILMOGRAFÍA
-- Si se borra el personaje, se borra su filmografía
-- =========================================================
create table public.filmography (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  title text not null,
  year integer,
  cover_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 8. AUDIOS
-- Si se borra el personaje, se borran sus audios
-- Si se borra el usuario que lo subió, el audio permanece
-- pero uploaded_by pasa a null
-- =========================================================
create table public.audios (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  title text not null,
  type text not null check (type in ('soundtrack', 'song')),
  audio_url text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 9. COMENTARIOS
-- Si se borra el personaje o el usuario, se borran
-- =========================================================
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 10. FOTOS DE LA COMUNIDAD
-- Si se borra el personaje o el usuario, se borran
-- =========================================================
create table public.community_photos (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references public.characters(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text not null,
  description text,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 11. FAVORITOS
-- Si se borra el personaje o el usuario, se borran
-- =========================================================
create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, character_id)
);

-- =========================================================
-- 12. RESULTADOS MBTI DEL USUARIO
-- Si quieres solo un resultado actual por usuario,
-- añade: unique(user_id)
-- =========================================================
create table public.mbti_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mbti_type_id uuid not null references public.mbti_types(id) on delete cascade,
  score numeric(5,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- ÍNDICES
-- =========================================================
create index idx_characters_universe_id on public.characters(universe_id);
create index idx_characters_mbti_type_id on public.characters(mbti_type_id);
create index idx_characters_created_by on public.characters(created_by);
create index idx_characters_slug on public.characters(slug);

create index idx_character_personality_tags_character_id
  on public.character_personality_tags(character_id);

create index idx_character_personality_tags_personality_tag_id
  on public.character_personality_tags(personality_tag_id);

create index idx_filmography_character_id on public.filmography(character_id);
create index idx_audios_character_id on public.audios(character_id);
create index idx_audios_uploaded_by on public.audios(uploaded_by);

create index idx_comments_character_id on public.comments(character_id);
create index idx_comments_user_id on public.comments(user_id);

create index idx_community_photos_character_id on public.community_photos(character_id);
create index idx_community_photos_user_id on public.community_photos(user_id);

create index idx_favorites_user_id on public.favorites(user_id);
create index idx_favorites_character_id on public.favorites(character_id);

create index idx_mbti_results_user_id on public.mbti_results(user_id);
create index idx_mbti_results_mbti_type_id on public.mbti_results(mbti_type_id);

-- =========================================================
-- FUNCIÓN: updated_at automático
-- =========================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================================================
-- TRIGGERS: updated_at
-- =========================================================
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger set_universes_updated_at
before update on public.universes
for each row execute procedure public.set_updated_at();

create trigger set_personality_tags_updated_at
before update on public.personality_tags
for each row execute procedure public.set_updated_at();

create trigger set_mbti_types_updated_at
before update on public.mbti_types
for each row execute procedure public.set_updated_at();

create trigger set_characters_updated_at
before update on public.characters
for each row execute procedure public.set_updated_at();

create trigger set_filmography_updated_at
before update on public.filmography
for each row execute procedure public.set_updated_at();

create trigger set_comments_updated_at
before update on public.comments
for each row execute procedure public.set_updated_at();

create trigger set_community_photos_updated_at
before update on public.community_photos
for each row execute procedure public.set_updated_at();

create trigger set_mbti_results_updated_at
before update on public.mbti_results
for each row execute procedure public.set_updated_at();

-- =========================================================
-- FUNCIÓN: crear profile automáticamente al registrarse
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, username, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'name', '')
  );
  return new;
end;
$$;

-- =========================================================
-- TRIGGER: crear profile cuando nace un usuario en auth.users
-- =========================================================
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- =========================================================
-- RLS
-- =========================================================
alter table public.profiles enable row level security;
alter table public.universes enable row level security;
alter table public.personality_tags enable row level security;
alter table public.mbti_types enable row level security;
alter table public.characters enable row level security;
alter table public.character_personality_tags enable row level security;
alter table public.filmography enable row level security;
alter table public.audios enable row level security;
alter table public.comments enable row level security;
alter table public.community_photos enable row level security;
alter table public.favorites enable row level security;
alter table public.mbti_results enable row level security;

-- =========================================================
-- POLICIES: PROFILES
-- =========================================================
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- =========================================================
-- POLICIES: LECTURA PÚBLICA
-- =========================================================
create policy "universes_public_read"
on public.universes
for select
using (true);

create policy "personality_tags_public_read"
on public.personality_tags
for select
using (true);

create policy "mbti_types_public_read"
on public.mbti_types
for select
using (true);

create policy "characters_public_read"
on public.characters
for select
using (true);

create policy "character_personality_tags_public_read"
on public.character_personality_tags
for select
using (true);

create policy "filmography_public_read"
on public.filmography
for select
using (true);

create policy "audios_public_read"
on public.audios
for select
using (true);

create policy "comments_public_read"
on public.comments
for select
using (true);

-- Solo fotos aprobadas visibles públicamente
create policy "community_photos_public_read_approved"
on public.community_photos
for select
using (approved = true);

-- =========================================================
-- POLICIES: COMMENTS
-- =========================================================
create policy "comments_insert_own"
on public.comments
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "comments_update_own"
on public.comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "comments_delete_own"
on public.comments
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- POLICIES: COMMUNITY PHOTOS
-- =========================================================
create policy "community_photos_owner_read"
on public.community_photos
for select
to authenticated
using (auth.uid() = user_id);

create policy "community_photos_insert_own"
on public.community_photos
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "community_photos_delete_own"
on public.community_photos
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- POLICIES: FAVORITES
-- =========================================================
create policy "favorites_select_own"
on public.favorites
for select
to authenticated
using (auth.uid() = user_id);

create policy "favorites_insert_own"
on public.favorites
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "favorites_delete_own"
on public.favorites
for delete
to authenticated
using (auth.uid() = user_id);

-- =========================================================
-- POLICIES: MBTI RESULTS
-- =========================================================
create policy "mbti_results_select_own"
on public.mbti_results
for select
to authenticated
using (auth.uid() = user_id);

create policy "mbti_results_insert_own"
on public.mbti_results
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "mbti_results_update_own"
on public.mbti_results
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- =========================================================
-- FUNCIÓN AUXILIAR: saber si el usuario autenticado es admin
-- =========================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

-- =========================================================
-- PROFILES: admin puede ver todos los perfiles
-- =========================================================
create policy "admins_select_all_profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

-- =========================================================
-- CHARACTERS: admin CRUD
-- =========================================================
create policy "admins_insert_characters"
on public.characters
for insert
to authenticated
with check (public.is_admin());

create policy "admins_update_characters"
on public.characters
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins_delete_characters"
on public.characters
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- UNIVERSES: admin CRUD
-- =========================================================
create policy "admins_insert_universes"
on public.universes
for insert
to authenticated
with check (public.is_admin());

create policy "admins_update_universes"
on public.universes
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins_delete_universes"
on public.universes
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- PERSONALITY_TAGS: admin CRUD
-- =========================================================
create policy "admins_insert_personality_tags"
on public.personality_tags
for insert
to authenticated
with check (public.is_admin());

create policy "admins_update_personality_tags"
on public.personality_tags
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins_delete_personality_tags"
on public.personality_tags
for delete
to authenticated
using (public.is_admin());

-- =========================================================
-- CHARACTER_PERSONALITY_TAGS: admin CRUD
-- Necesario para asignar/quitar personalidades a personajes
-- =========================================================
create policy "admins_insert_character_personality_tags"
on public.character_personality_tags
for insert
to authenticated
with check (public.is_admin());

create policy "admins_update_character_personality_tags"
on public.character_personality_tags
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins_delete_character_personality_tags"
on public.character_personality_tags
for delete
to authenticated
using (public.is_admin());

