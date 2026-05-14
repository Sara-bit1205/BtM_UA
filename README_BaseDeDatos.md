# Información de la Base de Datos y Supabase

> Documentación técnica completa de la infraestructura de base de datos del proyecto **Behind The Mask (BtM)**.  
> Proyecto Supabase: `UA_Web` · ID: `jdthbbjskzkunjpwwzvh` · Región: `eu-central-1` · Motor: PostgreSQL 17.6.1 · Estado: `ACTIVE_HEALTHY`

---

## Índice

1. [Información General del Proyecto](#1-información-general-del-proyecto)
2. [Autenticación (Supabase Auth)](#2-autenticación-supabase-auth)
3. [Esquema de la Base de Datos](#3-esquema-de-la-base-de-datos)
   - [Tablas del sistema público](#tablas-del-sistema-público)
4. [Row Level Security (RLS)](#4-row-level-security-rls)
   - [Función auxiliar `is_admin()`](#función-auxiliar-is_admin)
   - [Políticas por tabla](#políticas-por-tabla)
5. [Storage (Almacenamiento de Archivos)](#5-storage-almacenamiento-de-archivos)
   - [Buckets](#buckets)
   - [Políticas de Storage](#políticas-de-storage)
6. [Funciones y Triggers](#6-funciones-y-triggers)
7. [Diagrama de Relaciones](#7-diagrama-de-relaciones)

---

## 1. Información General del Proyecto

| Parámetro              | Valor                              |
|------------------------|------------------------------------|
| Nombre del proyecto    | `UA_Web`                           |
| ID del proyecto        | `jdthbbjskzkunjpwwzvh`             |
| Host de la base datos  | `db.jdthbbjskzkunjpwwzvh.supabase.co` |
| Región                 | `eu-central-1` (Frankfurt, Europa) |
| Motor de BD            | PostgreSQL 17.6.1                  |
| Estado                 | `ACTIVE_HEALTHY`                   |
| RLS activado           | Sí — en todas las tablas públicas  |
| Número de tablas       | 14 (schema `public`)               |
| Número de buckets      | 7                                  |

---

## 2. Autenticación (Supabase Auth)

Supabase Auth gestiona el ciclo completo de registro, inicio de sesión y sesiones de usuario mediante JWT. La integración con la tabla `profiles` se realiza automáticamente a través de un trigger.

### Flujo de registro

1. El usuario se registra desde el frontend mediante `supabase.auth.signUp()`.
2. Supabase Auth crea una entrada en la tabla interna `auth.users`.
3. El trigger `on_auth_user_created` se activa automáticamente (`AFTER INSERT ON auth.users`).
4. El trigger ejecuta la función `handle_new_user()`, que inserta un registro en `public.profiles` con el `id`, `email` y `username` del nuevo usuario.

### Flujo de inicio de sesión

- Autenticación por **email + contraseña** mediante `supabase.auth.signInWithPassword()`.
- Supabase devuelve un **JWT (access token)** y un **refresh token**.
- El JWT es verificado automáticamente por las políticas RLS en cada petición a la base de datos.

### Roles de usuario

El sistema define dos roles gestionados en la columna `role` de la tabla `profiles`:

| Rol       | Descripción                                                                 |
|-----------|-----------------------------------------------------------------------------|
| `user`    | Usuario estándar. Puede gestionar sus propios datos (favoritos, comentarios, fotos, MBTI). |
| `admin`   | Administrador. Tiene acceso total de escritura sobre el contenido editorial de la plataforma. |

> La función `is_admin()` consulta `public.profiles` para verificar si el usuario autenticado tiene `role = 'admin'` y `is_active = true`, y es utilizada en todas las políticas RLS de administración.

### Eliminación de cuenta

La función `borrar_mi_cuenta()` permite al usuario autenticado eliminar su propia cuenta de `auth.users`. Esto produce una eliminación en cascada que borra su registro en `public.profiles` (gracias a la FK `profiles.id → auth.users.id`).

---

## 3. Esquema de la Base de Datos

A continuación se describe en detalle cada una de las 14 tablas del schema `public`.

---

### `profiles`

Almacena los datos del perfil de cada usuario registrado. Se sincroniza con `auth.users` mediante la FK en `id`.

| Columna           | Tipo                    | Restricciones                            | Descripción                                 |
|-------------------|-------------------------|------------------------------------------|---------------------------------------------|
| `id`              | `uuid`                  | PK · FK → `auth.users.id`               | Identificador único del usuario             |
| `username`        | `text`                  | NOT NULL · UNIQUE                        | Nombre de usuario único en la plataforma    |
| `name`            | `text`                  | Nullable                                 | Nombre real del usuario                     |
| `email`           | `text`                  | NOT NULL · UNIQUE                        | Correo electrónico del usuario              |
| `role`            | `text`                  | CHECK (`'user'` \| `'admin'`) · DEFAULT `'user'` | Rol del usuario en la plataforma   |
| `birth_date`      | `date`                  | Nullable                                 | Fecha de nacimiento                         |
| `is_active`       | `boolean`               | DEFAULT `true`                           | Indica si la cuenta está activa             |
| `avatar_path`     | `text`                  | Nullable                                 | Ruta del avatar en el bucket `avatars`      |
| `theme`           | `text`                  | DEFAULT `'default'`                      | Tema visual seleccionado por el usuario     |
| `font_size`       | `text`                  | DEFAULT `'100'`                          | Tamaño de fuente de accesibilidad           |
| `accessible_font` | `boolean`               | Nullable                                 | Indica si se usa fuente accesible           |
| `created_at`      | `timestamptz`           | DEFAULT `now()`                          | Fecha de creación del perfil                |
| `updated_at`      | `timestamptz`           | DEFAULT `now()`                          | Última actualización (trigger automático)   |

**Registros actuales:** 8  
**RLS habilitado:** Sí

---

### `universes`

Catálogo de universos ficticios a los que pertenecen los personajes (ej.: Marvel, DC, anime, etc.).

| Columna       | Tipo          | Restricciones        | Descripción                                    |
|---------------|---------------|----------------------|------------------------------------------------|
| `id`          | `uuid`        | PK · DEFAULT `gen_random_uuid()` | Identificador único          |
| `name`        | `text`        | NOT NULL · UNIQUE    | Nombre del universo                            |
| `description` | `text`        | Nullable             | Descripción del universo                       |
| `image_path`  | `text`        | Nullable             | Ruta de imagen en el bucket `universes_images` |
| `created_at`  | `timestamptz` | DEFAULT `now()`      | Fecha de creación                              |
| `updated_at`  | `timestamptz` | DEFAULT `now()`      | Última actualización (trigger automático)      |

**Registros actuales:** 4  
**RLS habilitado:** Sí

---

### `personality_tags`

Catálogo de etiquetas de personalidad que pueden asignarse a personajes (ej.: "empático", "introvertido", "líder").

| Columna       | Tipo          | Restricciones        | Descripción                         |
|---------------|---------------|----------------------|-------------------------------------|
| `id`          | `uuid`        | PK · DEFAULT `gen_random_uuid()` | Identificador único   |
| `name`        | `text`        | NOT NULL · UNIQUE    | Nombre de la etiqueta               |
| `description` | `text`        | Nullable             | Descripción de la etiqueta          |
| `created_at`  | `timestamptz` | DEFAULT `now()`      | Fecha de creación                   |
| `updated_at`  | `timestamptz` | DEFAULT `now()`      | Última actualización                |

**Registros actuales:** 64  
**RLS habilitado:** Sí

---

### `mbti_types`

Los 16 tipos de personalidad MBTI, con su código, título y descripción.

| Columna       | Tipo          | Restricciones              | Descripción                          |
|---------------|---------------|----------------------------|--------------------------------------|
| `id`          | `uuid`        | PK · DEFAULT `gen_random_uuid()` | Identificador único            |
| `code`        | `varchar`     | NOT NULL · UNIQUE          | Código MBTI (ej.: `INTJ`, `ENFP`)    |
| `title`       | `text`        | Nullable                   | Título descriptivo del tipo          |
| `description` | `text`        | Nullable                   | Descripción del tipo de personalidad |
| `created_at`  | `timestamptz` | DEFAULT `now()`            | Fecha de creación                    |
| `updated_at`  | `timestamptz` | DEFAULT `now()`            | Última actualización                 |

**Registros actuales:** 16  
**RLS habilitado:** Sí

---

### `characters`

Tabla principal de personajes de la plataforma. Contiene toda la información editorial y narrativa.

| Columna                 | Tipo          | Restricciones                                  | Descripción                                         |
|-------------------------|---------------|------------------------------------------------|-----------------------------------------------------|
| `id`                    | `uuid`        | PK · DEFAULT `gen_random_uuid()`               | Identificador único del personaje                   |
| `name`                  | `text`        | NOT NULL                                       | Nombre del personaje                                |
| `slug`                  | `text`        | NOT NULL · UNIQUE                              | Slug URL-friendly para rutas                        |
| `description`           | `text`        | Nullable                                       | Descripción breve                                   |
| `story`                 | `text`        | Nullable                                       | Historia extensa del personaje                      |
| `creation_date`         | `text`        | Nullable                                       | Fecha de creación del personaje (editorial)         |
| `first_appearance`      | `text`        | Nullable                                       | Primera aparición en obra                           |
| `biological_origin`     | `text`        | Nullable                                       | Origen biológico o especie                          |
| `place_of_origin`       | `text`        | Nullable                                       | Lugar de origen                                     |
| `psychological_analysis`| `text`        | Nullable                                       | Análisis psicológico del personaje                  |
| `cover_path`            | `text`        | Nullable                                       | Ruta de portada en bucket `character-covers`        |
| `universe_id`           | `uuid`        | FK → `universes.id`                            | Universo al que pertenece el personaje              |
| `mbti_type_id`          | `uuid`        | FK → `mbti_types.id`                           | Tipo MBTI asignado al personaje                     |
| `created_by`            | `uuid`        | FK → `profiles.id`                             | Administrador que creó el personaje                 |
| `created_at`            | `timestamptz` | DEFAULT `now()`                                | Fecha de creación                                   |
| `updated_at`            | `timestamptz` | DEFAULT `now()`                                | Última actualización (trigger automático)           |

**Registros actuales:** 21  
**RLS habilitado:** Sí

---

### `character_personality_tags`

Tabla de unión (*join table*) entre `characters` y `personality_tags`. Implementa la relación N:M entre personajes y etiquetas de personalidad.

| Columna               | Tipo   | Restricciones                              | Descripción                    |
|-----------------------|--------|--------------------------------------------|--------------------------------|
| `id`                  | `uuid` | PK · DEFAULT `gen_random_uuid()`           | Identificador único            |
| `character_id`        | `uuid` | FK → `characters.id`                       | Personaje asociado             |
| `personality_tag_id`  | `uuid` | FK → `personality_tags.id`                 | Etiqueta de personalidad       |

**Registros actuales:** 78  
**RLS habilitado:** Sí

---

### `filmography`

Obras (películas, series, videojuegos, etc.) en las que aparece cada personaje.

| Columna        | Tipo          | Restricciones                        | Descripción                                      |
|----------------|---------------|--------------------------------------|--------------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                              |
| `character_id` | `uuid`        | FK → `characters.id`                 | Personaje al que pertenece la obra               |
| `title`        | `text`        | NOT NULL                             | Título de la obra                                |
| `year`         | `integer`     | Nullable                             | Año de estreno o publicación                     |
| `cover_path`   | `text`        | Nullable                             | Ruta de portada de la obra en bucket `films-cover` |
| `created_at`   | `timestamptz` | DEFAULT `now()`                      | Fecha de creación del registro                   |
| `updated_at`   | `timestamptz` | DEFAULT `now()`                      | Última actualización (trigger automático)        |

**Registros actuales:** 152  
**RLS habilitado:** Sí

---

### `audios`

Pistas de audio asociadas a personajes (bandas sonoras o canciones características).

| Columna        | Tipo          | Restricciones                               | Descripción                                      |
|----------------|---------------|---------------------------------------------|--------------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`            | Identificador único                              |
| `character_id` | `uuid`        | FK → `characters.id`                        | Personaje al que pertenece el audio              |
| `title`        | `text`        | NOT NULL                                    | Título de la pista                               |
| `type`         | `text`        | CHECK (`'soundtrack'` \| `'song'`)          | Tipo de audio                                    |
| `uploaded_by`  | `uuid`        | FK → `profiles.id`                          | Administrador que subió el audio                 |
| `audio_path`   | `text`        | Nullable                                    | Ruta del archivo en bucket `audio-files`         |
| `transcription`| `text`        | Nullable                                    | Transcripción o letra de la pista                |
| `created_at`   | `timestamptz` | DEFAULT `now()`                             | Fecha de creación                                |

**Registros actuales:** 24  
**RLS habilitado:** Sí

---

### `comments`

Comentarios publicados por usuarios en las páginas de personajes.

| Columna        | Tipo          | Restricciones                        | Descripción                                   |
|----------------|---------------|--------------------------------------|-----------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                           |
| `character_id` | `uuid`        | FK → `characters.id`                 | Personaje comentado                           |
| `user_id`      | `uuid`        | FK → `profiles.id`                   | Usuario que publicó el comentario             |
| `comment`      | `text`        | NOT NULL                             | Contenido del comentario                      |
| `created_at`   | `timestamptz` | DEFAULT `now()`                      | Fecha de publicación                          |
| `updated_at`   | `timestamptz` | DEFAULT `now()`                      | Última modificación (trigger automático)      |

**Registros actuales:** 3  
**RLS habilitado:** Sí

---

### `community_photos`

Fotografías o imágenes subidas por la comunidad de usuarios, asociadas a personajes y sujetas a moderación.

| Columna        | Tipo          | Restricciones                        | Descripción                                          |
|----------------|---------------|--------------------------------------|------------------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                                  |
| `character_id` | `uuid`        | FK → `characters.id`                 | Personaje al que está asociada la foto               |
| `user_id`      | `uuid`        | FK → `profiles.id`                   | Usuario que subió la foto                            |
| `description`  | `text`        | Nullable                             | Descripción de la imagen                             |
| `approved`     | `boolean`     | DEFAULT `false`                      | Estado de moderación (pendiente/aprobada)            |
| `image_path`   | `text`        | Nullable                             | Ruta de la imagen en bucket `gallery`                |
| `created_at`   | `timestamptz` | DEFAULT `now()`                      | Fecha de publicación                                 |
| `updated_at`   | `timestamptz` | DEFAULT `now()`                      | Última modificación (trigger automático)             |

**Registros actuales:** 50  
**RLS habilitado:** Sí

---

### `favorites`

Lista de personajes marcados como favoritos por cada usuario.

| Columna        | Tipo          | Restricciones                        | Descripción                        |
|----------------|---------------|--------------------------------------|------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                |
| `user_id`      | `uuid`        | FK → `profiles.id`                   | Usuario propietario del favorito   |
| `character_id` | `uuid`        | FK → `characters.id`                 | Personaje marcado como favorito    |
| `created_at`   | `timestamptz` | DEFAULT `now()`                      | Fecha en que se añadió             |

**Registros actuales:** 8  
**RLS habilitado:** Sí

---

### `mbti_results`

Resultados del test de personalidad MBTI realizados por los usuarios.

| Columna        | Tipo          | Restricciones                        | Descripción                                        |
|----------------|---------------|--------------------------------------|----------------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                                |
| `user_id`      | `uuid`        | FK → `profiles.id`                   | Usuario que realizó el test                        |
| `mbti_type_id` | `uuid`        | FK → `mbti_types.id`                 | Tipo MBTI resultante del test                      |
| `score`        | `numeric`     | Nullable                             | Puntuación o porcentaje de compatibilidad obtenido |
| `created_at`   | `timestamptz` | DEFAULT `now()`                      | Fecha en que se realizó el test                    |
| `updated_at`   | `timestamptz` | DEFAULT `now()`                      | Última actualización (trigger automático)          |

**Registros actuales:** 6  
**RLS habilitado:** Sí

---

### `character_media`

Galería multimedia (imágenes y vídeos) de cada personaje, gestionada por administradores.

| Columna        | Tipo          | Restricciones                            | Descripción                                          |
|----------------|---------------|------------------------------------------|------------------------------------------------------|
| `id`           | `uuid`        | PK · DEFAULT `gen_random_uuid()`         | Identificador único                                  |
| `character_id` | `uuid`        | FK → `characters.id`                     | Personaje al que pertenece el archivo                |
| `type`         | `text`        | CHECK (`'image'` \| `'video'`)           | Tipo de archivo multimedia                           |
| `title`        | `text`        | Nullable                                 | Título del archivo                                   |
| `description`  | `text`        | Nullable                                 | Descripción del contenido                            |
| `file_path`    | `text`        | Nullable                                 | Ruta del archivo en bucket `character-media`         |
| `uploaded_by`  | `uuid`        | FK → `profiles.id`                       | Administrador que subió el archivo                   |
| `is_featured`  | `boolean`     | DEFAULT `false`                          | Indica si el elemento destaca en la galería          |
| `sort_order`   | `integer`     | DEFAULT `0`                              | Orden de presentación en la galería                  |
| `created_at`   | `timestamptz` | DEFAULT `now()`                          | Fecha de creación                                    |
| `updated_at`   | `timestamptz` | DEFAULT `now()`                          | Última actualización (trigger automático)            |

**Registros actuales:** 75  
**RLS habilitado:** Sí

---

### `character_actors`

Actores o dobladores asociados a cada personaje en distintos medios.

| Columna           | Tipo          | Restricciones                        | Descripción                                         |
|-------------------|---------------|--------------------------------------|-----------------------------------------------------|
| `id`              | `uuid`        | PK · DEFAULT `gen_random_uuid()`     | Identificador único                                 |
| `character_id`    | `uuid`        | FK → `characters.id`                 | Personaje al que se asocia el actor                 |
| `actor_name`      | `text`        | NOT NULL                             | Nombre del actor/doblador                           |
| `role_description`| `text`        | Nullable                             | Descripción del rol desempeñado                     |
| `years_active`    | `text`        | Nullable                             | Años en los que estuvo activo en el papel           |
| `sort_order`      | `integer`     | DEFAULT `0`                          | Orden de presentación                               |
| `created_at`      | `timestamptz` | DEFAULT `now()`                      | Fecha de creación                                   |
| `updated_at`      | `timestamptz` | DEFAULT `now()`                      | Última actualización (trigger automático)           |

**Registros actuales:** 55  
**RLS habilitado:** Sí

---

## 4. Row Level Security (RLS)

**RLS (Row Level Security)** está habilitado en todas las tablas del schema `public`. Esto significa que cada operación SQL (SELECT, INSERT, UPDATE, DELETE) pasa por una evaluación de políticas antes de acceder a los datos, independientemente del rol con que se haga la petición.

### Función auxiliar `is_admin()`

Esta función es la pieza central del modelo de autorización de administradores. Es invocada por todas las políticas de escritura de contenido editorial.

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

**Comportamiento:** Devuelve `true` únicamente si el usuario actualmente autenticado (`auth.uid()`) tiene `role = 'admin'` **y** `is_active = true` en la tabla `profiles`. Si el usuario no está autenticado, la función devuelve `false`.

---

### Políticas por tabla

#### Patrones de política

Existen dos patrones principales aplicados consistentemente:

**Patrón A — Contenido editorial (administrado por admins):**
- `SELECT` → público (sin autenticación)
- `INSERT` → solo admins (`is_admin()`)
- `UPDATE` → solo admins (`is_admin()`)
- `DELETE` → solo admins (`is_admin()`)

**Patrón B — Datos personales (propiedad del usuario):**
- `SELECT` → solo el propietario (`auth.uid() = user_id`)
- `INSERT` → solo el propietario (`auth.uid() = user_id`)
- `UPDATE` → solo el propietario (`auth.uid() = user_id`)
- `DELETE` → solo el propietario (`auth.uid() = user_id`)

---

#### `audios` — Patrón A

| Política                  | Operación | Roles          | Condición               |
|---------------------------|-----------|----------------|-------------------------|
| `audios_public_read`      | SELECT    | `public`       | `true` (sin restricción) |
| `admins_insert_audios`    | INSERT    | `authenticated`| `is_admin()`            |
| `admins_update_audios`    | UPDATE    | `authenticated`| `is_admin()`            |
| `admins_delete_audios`    | DELETE    | `authenticated`| `is_admin()`            |

---

#### `character_actors` — Patrón A

| Política                              | Operación | Roles          | Condición                |
|---------------------------------------|-----------|----------------|--------------------------|
| `character_actors_public_read`        | SELECT    | `public`       | `true`                   |
| `admins_insert_character_actors`      | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_character_actors`      | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_character_actors`      | DELETE    | `authenticated`| `is_admin()`             |

---

#### `character_media` — Patrón A

| Política                            | Operación | Roles          | Condición                |
|-------------------------------------|-----------|----------------|--------------------------|
| `character_media_public_read`       | SELECT    | `public`       | `true`                   |
| `admins_insert_character_media`     | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_character_media`     | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_character_media`     | DELETE    | `authenticated`| `is_admin()`             |

---

#### `character_personality_tags` — Patrón A

| Política                                        | Operación | Roles          | Condición                |
|-------------------------------------------------|-----------|----------------|--------------------------|
| `character_personality_tags_public_read`        | SELECT    | `public`       | `true`                   |
| `admins_insert_character_personality_tags`      | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_character_personality_tags`      | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_character_personality_tags`      | DELETE    | `authenticated`| `is_admin()`             |

---

#### `characters` — Patrón A

| Política                     | Operación | Roles          | Condición                |
|------------------------------|-----------|----------------|--------------------------|
| `characters_public_read`     | SELECT    | `public`       | `true`                   |
| `admins_insert_characters`   | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_characters`   | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_characters`   | DELETE    | `authenticated`| `is_admin()`             |

---

#### `comments` — Patrón A+B mixto

Los comentarios son públicos para lectura, pero cada usuario solo puede gestionar los suyos propios.

| Política                   | Operación | Roles          | Condición                        |
|----------------------------|-----------|----------------|----------------------------------|
| `comments_public_read`     | SELECT    | `public`       | `true`                           |
| `comments_insert_own`      | INSERT    | `authenticated`| `auth.uid() = user_id`           |
| `comments_update_own`      | UPDATE    | `authenticated`| `auth.uid() = user_id`           |
| `comments_delete_own`      | DELETE    | `authenticated`| `auth.uid() = user_id`           |

---

#### `community_photos` — Patrón B (lectura pública)

| Política                          | Operación | Roles          | Condición                        |
|-----------------------------------|-----------|----------------|----------------------------------|
| `community_photos_public_read`    | SELECT    | `public`       | `true`                           |
| `community_photos_insert_own`     | INSERT    | `authenticated`| `auth.uid() = user_id`           |
| `community_photos_delete_own`     | DELETE    | `authenticated`| `auth.uid() = user_id`           |

---

#### `favorites` — Patrón B (privado)

Los favoritos son estrictamente privados: solo el propietario puede verlos.

| Política                  | Operación | Roles          | Condición                        |
|---------------------------|-----------|----------------|----------------------------------|
| `favorites_select_own`    | SELECT    | `authenticated`| `auth.uid() = user_id`           |
| `favorites_insert_own`    | INSERT    | `authenticated`| `auth.uid() = user_id`           |
| `favorites_delete_own`    | DELETE    | `authenticated`| `auth.uid() = user_id`           |

---

#### `filmography` — Patrón A

| Política                      | Operación | Roles          | Condición                |
|-------------------------------|-----------|----------------|--------------------------|
| `filmography_public_read`     | SELECT    | `public`       | `true`                   |
| `admins_insert_filmography`   | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_filmography`   | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_filmography`   | DELETE    | `authenticated`| `is_admin()`             |

---

#### `mbti_results` — Patrón B (privado)

Los resultados del test MBTI son exclusivamente privados por usuario.

| Política                     | Operación | Roles          | Condición                        |
|------------------------------|-----------|----------------|----------------------------------|
| `mbti_results_select_own`    | SELECT    | `authenticated`| `auth.uid() = user_id`           |
| `mbti_results_insert_own`    | INSERT    | `authenticated`| `auth.uid() = user_id`           |
| `mbti_results_update_own`    | UPDATE    | `authenticated`| `auth.uid() = user_id`           |

---

#### `mbti_types` — Solo lectura pública

| Política                  | Operación | Roles    | Condición |
|---------------------------|-----------|----------|-----------|
| `mbti_types_public_read`  | SELECT    | `public` | `true`    |

---

#### `personality_tags` — Patrón A

| Política                           | Operación | Roles          | Condición                |
|------------------------------------|-----------|----------------|--------------------------|
| `personality_tags_public_read`     | SELECT    | `public`       | `true`                   |
| `admins_insert_personality_tags`   | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_personality_tags`   | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_personality_tags`   | DELETE    | `authenticated`| `is_admin()`             |

---

#### `profiles` — Patrón mixto con tres capas de acceso

La tabla de perfiles implementa tres niveles de acceso diferenciados:

| Política                        | Operación | Roles          | Condición                        | Descripción                                       |
|---------------------------------|-----------|----------------|----------------------------------|---------------------------------------------------|
| `profiles_public_read_basic`    | SELECT    | `public`       | `true`                           | Cualquier visitante puede leer datos básicos      |
| `profiles_select_own`           | SELECT    | `authenticated`| `auth.uid() = id`                | El usuario autenticado puede ver su propio perfil completo |
| `admins_select_all_profiles`    | SELECT    | `authenticated`| `is_admin()`                     | Los admins pueden ver todos los perfiles          |
| `profiles_update_own`           | UPDATE    | `authenticated`| `auth.uid() = id`                | Solo el propio usuario puede actualizar su perfil |

---

#### `universes` — Patrón A

| Política                    | Operación | Roles          | Condición                |
|-----------------------------|-----------|----------------|--------------------------|
| `universes_public_read`     | SELECT    | `public`       | `true`                   |
| `admins_insert_universes`   | INSERT    | `authenticated`| `is_admin()`             |
| `admins_update_universes`   | UPDATE    | `authenticated`| `is_admin()`             |
| `admins_delete_universes`   | DELETE    | `authenticated`| `is_admin()`             |

---

## 5. Storage (Almacenamiento de Archivos)

Supabase Storage gestiona los archivos estáticos de la plataforma a través de buckets. Todos los buckets están configurados como **públicos**, lo que permite la lectura de URLs directas sin autenticación, manteniendo la escritura restringida mediante políticas.

### Buckets

| Bucket              | Acceso público | Límite de tamaño | MIME permitidos | Creado el         | Uso en la plataforma                         |
|---------------------|:--------------:|:----------------:|:---------------:|-------------------|----------------------------------------------|
| `audio-files`       | ✅             | Sin límite       | Sin restricción | 2026-04-03        | Pistas de audio de personajes                |
| `avatars`           | ✅             | Sin límite       | Sin restricción | 2026-03-24        | Fotos de perfil de usuarios                  |
| `character-covers`  | ✅             | Sin límite       | Sin restricción | 2026-04-03        | Imágenes de portada de personajes            |
| `character-media`   | ✅             | Sin límite       | Sin restricción | 2026-04-03        | Galería multimedia de personajes (imágenes y vídeos) |
| `films-cover`       | ✅             | Sin límite       | Sin restricción | 2026-04-03        | Portadas de obras de la filmografía          |
| `gallery`           | ✅             | Sin límite       | Sin restricción | 2026-04-03        | Fotografías de la comunidad de usuarios      |
| `universes_images`  | ✅             | Sin límite       | Sin restricción | 2026-04-08        | Imágenes representativas de universos        |

> Las URLs de los archivos públicos siguen el patrón:  
> `https://jdthbbjskzkunjpwwzvh.supabase.co/storage/v1/object/public/{bucket}/{path}`

---

### Políticas de Storage

Las políticas de storage se aplican sobre la tabla interna `storage.objects`. Siguen el mismo modelo que las políticas RLS de datos: lectura pública + escritura autenticada.

#### Lectura pública (SELECT — todos los buckets)

| Política                               | Bucket            | Roles    | Condición                                |
|----------------------------------------|-------------------|----------|------------------------------------------|
| `public can view audio`                | `audio-files`     | `public` | `bucket_id = 'audio-files'`             |
| `public can view avatars`              | `avatars`         | `public` | `bucket_id = 'avatars'`                 |
| `public can view covers`               | `character-covers`| `public` | `bucket_id = 'character-covers'`        |
| `public can view media`                | `character-media` | `public` | `bucket_id = 'character-media'`         |
| `public can view films-cover`          | `films-cover`     | `public` | `bucket_id = 'films-cover'`             |
| `public can view gallery images`       | `gallery`         | `public` | `bucket_id = 'gallery'`                 |
| `public can view universes_images`     | `universes_images`| `public` | `bucket_id = 'universes_images'`        |

#### Subida de archivos (INSERT — usuarios autenticados)

| Política                                       | Bucket            | Roles          | Condición                                |
|------------------------------------------------|-------------------|----------------|------------------------------------------|
| `authenticated users can upload audio`         | `audio-files`     | `authenticated`| `bucket_id = 'audio-files'`             |
| `authenticated users can upload avatars`       | `avatars`         | `authenticated`| `bucket_id = 'avatars'`                 |
| `authenticated users can upload covers`        | `character-covers`| `authenticated`| `bucket_id = 'character-covers'`        |
| `authenticated users can upload media`         | `character-media` | `authenticated`| `bucket_id = 'character-media'`         |
| `authenticated users can upload films-cover`   | `films-cover`     | `authenticated`| `bucket_id = 'films-cover'`             |
| `authenticated users can upload gallery images`| `gallery`         | `authenticated`| `bucket_id = 'gallery'`                 |
| `authenticated users can upload universes_images` | `universes_images` | `authenticated` | `bucket_id = 'universes_images'`    |

#### Actualización de archivos (UPDATE)

| Política                              | Bucket    | Roles          | Condición                    |
|---------------------------------------|-----------|----------------|------------------------------|
| `authenticated users can update avatars` | `avatars` | `authenticated` | `bucket_id = 'avatars'`  |

#### Gestión propia (DELETE/SELECT sobre archivos propios — bucket `gallery`)

| Política                                            | Operación      | Roles          | Condición              |
|-----------------------------------------------------|----------------|----------------|------------------------|
| `Solo usuarios registrados pueden borrar fotos` (×2) | DELETE, SELECT | `authenticated`| `auth.uid() = owner`   |

---

## 6. Funciones y Triggers

### Funciones definidas en el schema `public`

#### `is_admin()` → `boolean`

Verifica si el usuario autenticado actualmente es un administrador activo.

```sql
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;
```

#### `handle_new_user()` → `trigger`

Se ejecuta al crear un nuevo usuario en `auth.users`. Inserta automáticamente un perfil en `public.profiles`.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data ->> 'name', '')
  );
  RETURN new;
END;
$$;
```

#### `borrar_mi_cuenta()` → `void`

Permite al usuario autenticado eliminar su propia cuenta de `auth.users`. La FK en cascada elimina también su registro en `public.profiles`.

```sql
CREATE OR REPLACE FUNCTION public.borrar_mi_cuenta()
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
```

#### `set_updated_at()` → `trigger`

Función genérica de trigger que actualiza la columna `updated_at` con la marca de tiempo actual antes de cualquier operación UPDATE.

```sql
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;
```

---

### Triggers definidos

#### Trigger de autenticación (schema `auth`)

| Trigger               | Tabla        | Evento         | Timing | Función ejecutada       |
|-----------------------|--------------|----------------|--------|--------------------------|
| `on_auth_user_created`| `auth.users` | INSERT         | AFTER  | `handle_new_user()`      |

#### Triggers de `updated_at` (schema `public`)

| Trigger                          | Tabla               | Evento | Timing |
|----------------------------------|---------------------|--------|--------|
| `set_profiles_updated_at`        | `profiles`          | UPDATE | BEFORE |
| `set_characters_updated_at`      | `characters`        | UPDATE | BEFORE |
| `set_universes_updated_at`       | `universes`         | UPDATE | BEFORE |
| `set_personality_tags_updated_at`| `personality_tags`  | UPDATE | BEFORE |
| `set_mbti_types_updated_at`      | `mbti_types`        | UPDATE | BEFORE |
| `set_mbti_results_updated_at`    | `mbti_results`      | UPDATE | BEFORE |
| `set_filmography_updated_at`     | `filmography`       | UPDATE | BEFORE |
| `set_comments_updated_at`        | `comments`          | UPDATE | BEFORE |
| `set_community_photos_updated_at`| `community_photos`  | UPDATE | BEFORE |
| `set_character_media_updated_at` | `character_media`   | UPDATE | BEFORE |

---

## 7. Diagrama de Relaciones

```
auth.users (Supabase Auth)
    │
    │ on_auth_user_created (trigger AFTER INSERT)
    ▼
profiles ◄──────────────────────────────────────────────────────┐
    │                                                            │
    │ user_id / created_by / uploaded_by                        │
    ▼                                                            │
┌───────────────────────────────────────────────────┐           │
│                   characters                      │           │
│  ├── universe_id ──────────────► universes        │           │
│  ├── mbti_type_id ─────────────► mbti_types       │           │
│  └── created_by ────────────────────────────────────► profiles│
└───────────────────────────────────────────────────┘           │
    │                                                            │
    ├──► character_personality_tags ◄──► personality_tags       │
    ├──► filmography                                             │
    ├──► audios (uploaded_by ─────────────────────────────────► profiles)
    ├──► character_media (uploaded_by ────────────────────────► profiles)
    ├──► character_actors                                        │
    ├──► comments (user_id ──────────────────────────────────► profiles)
    ├──► community_photos (user_id ──────────────────────────► profiles)
    ├──► favorites (user_id ─────────────────────────────────► profiles)
    └──► mbti_results (user_id ──────────────────────────────► profiles)
                        └── mbti_type_id ────────────────────► mbti_types
```

---

*Documento generado a partir de los metadatos reales del proyecto Supabase `UA_Web` mediante consultas directas a la base de datos PostgreSQL 17.6.1.*
