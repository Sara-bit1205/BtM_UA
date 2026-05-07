/*Este servicio sirve para trabajar con la tabla characters de tu BBDD.

Hace estas cosas:

obtener todos los personajes
obtener uno por id
obtener uno por slug
crear
actualizar
borrar
buscar personajes por tipo MBTI

La diferencia con tu backend REST anterior es que ahora el frontend habla directamente con Supabase, sin pasar por rutas tipo:

/api/characters
/api/characters/:id*/

import { supabase } from '../lib/supabase'
import { getPublicUrl, STORAGE_BUCKETS, removeFiles } from '../lib/storage'
import { getRelationValue } from '../utils/relation'

//Es un objeto que agrupa funciones relacionadas con los personajes
const characterService = {
  //Obtenemos todos los personajes, con la posibilidad de filtrar por universo, tipo MBTI o búsqueda por nombre
  async getAll(params = {}) {
    //de la tabla characters, selecciona todas las columnas (*) y también los datos relacionados de las tablas universes y mbti_types 
    let query = supabase.from('characters')
      .select(`
        *,
        universes (
          id,
          name,
          description
        ),
        mbti_types (
          id,
          code,
          title,
          description
        )
      `)
      .order('created_at', { ascending: false }) //ordenamos por fecha de creación, los más nuevos primero

    //Hacemos condiciones:
    //Si params.universeId existe, añadimos un filtro por universo --> .eq (WHERE universe_id = ?)
    //Si params.mbtiTypeId existe, añadimos un filtro por tipo MBTI --> .eq (WHERE mbti_type_id = ?)
    //Si params.search existe, añadimos un filtro de búsqueda por nombre --> .ilike (Hace una búsqueda de texto sin distinguir mayúsculas/minúsculas. El % es un comodín que significa "cualquier cosa antes o después")
    if (params?.universeId) {
      query = query.eq('universe_id', params.universeId)
    }

    if (params?.mbtiTypeId) {
      query = query.eq('mbti_type_id', params.mbtiTypeId)
    }

    if (params?.search) {
      query = query.ilike('name', `%${params.search}%`)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  //Obtenemos un personaje por su id, incluyendo sus datos relacionados de universo, tipo MBTI, filmografía, audios y tags de personalidad
  async getById(id) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        universes (
          id,
          name,
          description
        ),
        mbti_types (
          id,
          code,
          title,
          description
        ),
        filmography (
          id,
          title,
          year,
          cover_path
        ),
        audios (
          id,
          title,
          type,
          audio_path,
          transcription,
          created_at
        ),
        character_personality_tags (
          id,
          personality_tags (
            id,
            name,
            description
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  //Obtenemos un personaje por su slug, incluyendo sus datos relacionados de universo, tipo MBTI, filmografía, audios y tags de personalidad
  //slug → es una versión del nombre que se usa en la URL, por ejemplo "harry-potter" en vez de "Harry Potter"
  async getBySlug(slug) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        universes (
          id,
          name,
          description
        ),
        mbti_types (
          id,
          code,
          title,
          description
        ),
        filmography (
          id,
          title,
          year,
          cover_path
        ),
        audios (
          id,
          title,
          type,
          audio_path,
          transcription,
          created_at
        ),
        character_personality_tags (
          id,
          personality_tags (
            id,
            name,
            description
          )
        )
      `)
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  },

  //Creamos un nuevo personaje, necesita un objeto con los valores a insertar (name, description, universe_id, mbti_type_id...)
  async create(values) {
    const { data, error } = await supabase
      .from('characters')
      .insert(values)
      .select()
      .single()

    if (error) throw error
    return data
  },

  //Actualizamos un personaje existente, necesita el id del personaje a actualizar y un objeto con los valores a actualizar (name, description, universe_id, mbti_type_id...)
  async update(id, values) {
    const { data, error } = await supabase
      .from('characters')
      .update(values)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  //Eliminamos un personaje, necesita el id del personaje a eliminar
  async remove(id) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getCharacterAssetPaths(characterId) {
    const [{ data: character, error: characterError }, { data: filmography, error: filmographyError }, { data: media, error: mediaError }, { data: audios, error: audiosError }] = await Promise.all([
      supabase.from('characters').select('cover_path').eq('id', characterId).single(),
      supabase.from('filmography').select('cover_path').eq('character_id', characterId),
      supabase.from('character_media').select('file_path').eq('character_id', characterId),
      supabase.from('audios').select('audio_path').eq('character_id', characterId),
    ])

    if (characterError) throw characterError
    if (filmographyError) throw filmographyError
    if (mediaError) throw mediaError
    if (audiosError) throw audiosError

    return {
      coverPath: character?.cover_path || null,
      filmCoverPaths: (filmography || []).map((item) => item.cover_path).filter(Boolean),
      mediaPaths: (media || []).map((item) => item.file_path).filter(Boolean),
      audioPaths: (audios || []).map((item) => item.audio_path).filter(Boolean),
    }
  },

  async removeFull(id) {
    const { coverPath, filmCoverPaths, mediaPaths, audioPaths } = await this.getCharacterAssetPaths(id)

    const deleteResults = await Promise.all([
      supabase.from('filmography').delete().eq('character_id', id),
      supabase.from('character_actors').delete().eq('character_id', id),
      supabase.from('character_media').delete().eq('character_id', id),
      supabase.from('audios').delete().eq('character_id', id),
      supabase.from('character_personality_tags').delete().eq('character_id', id),
      supabase.from('favorites').delete().eq('character_id', id),
      supabase.from('comments').delete().eq('character_id', id),
      supabase.from('characters').delete().eq('id', id),
    ])

    deleteResults.forEach(({ error }) => {
      if (error) throw error
    })

    const storageRemovals = []
    if (coverPath) storageRemovals.push(removeFiles(STORAGE_BUCKETS.characterCovers, [coverPath]))
    if (mediaPaths.length > 0) storageRemovals.push(removeFiles(STORAGE_BUCKETS.characterMedia, mediaPaths))
    if (audioPaths.length > 0) storageRemovals.push(removeFiles(STORAGE_BUCKETS.audioFiles, audioPaths))

    const uniqueFilmCoverPaths = [...new Set(filmCoverPaths)]
    for (const coverPathItem of uniqueFilmCoverPaths) {
      const { data: stillReferenced, error: referenceError } = await supabase
        .from('filmography')
        .select('id')
        .eq('cover_path', coverPathItem)
        .limit(1)

      if (referenceError) throw referenceError
      if (!stillReferenced || stillReferenced.length === 0) {
        storageRemovals.push(removeFiles(STORAGE_BUCKETS.filmsCover, [coverPathItem]))
      }
    }

    if (storageRemovals.length > 0) await Promise.all(storageRemovals)
    return true
  },

  //Obtenemos una lista de personajes que tienen un tipo de personalidad MBTI específico, necesita el código del tipo MBTI (por ejemplo "INTJ")
  async getByMBTI(mbtiCode) {
    //Primero obtenemos el id del tipo MBTI a partir de su código
    const { data: mbtiType, error: mbtiError } = await supabase
      .from('mbti_types')
      .select('id')
      .eq('code', mbtiCode)
      .single()

    if (mbtiError) throw mbtiError

    //Luego obtenemos los personajes que tienen ese mbti_type_id, incluyendo sus datos relacionados de universo y tipo MBTI
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        universes (
          id,
          name,
          description
        ),
        mbti_types (
          id,
          code,
          title,
          description
        )
      `)
      .eq('mbti_type_id', mbtiType.id)
      .order('name')

    if (error) throw error
    return data
  },

  async getFeatured(limit = 4) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        universes (
          id,
          name
        ),
        mbti_types (
          id,
          code,
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getCharacterOfTheDay() {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        *,
        universes (
          id,
          name
        ),
        mbti_types (
          id,
          code,
          title
        )
      `)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async getHomeCharacterOfTheDay() {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        name,
        slug,
        cover_path,
        universes (name),
        mbti_types (code)
      `)
      .order('name', { ascending: true })

    if (error) throw error
    if (!data || data.length === 0) return []

    return data.map((character) => ({
      slug: character.slug,
      nombre: character.name,
      universo: getRelationValue(character.universes, 'name') || 'Sin universo',
      mbti: getRelationValue(character.mbti_types, 'code') || '—',
      imagen: getPublicUrl(STORAGE_BUCKETS.characterCovers, character.cover_path),
    }))
  },

  async getHomePopularCharacters(limit = 6) {
    const { data: favoriteCountsData, error: favoriteCountsError } = await supabase
      .from('character_favorite_counts')
      .select('character_id, total_favorites')
      .order('total_favorites', { ascending: false })
      .limit(limit)

    if (favoriteCountsError) throw favoriteCountsError
    if (!favoriteCountsData || favoriteCountsData.length === 0) return []

    const personajesIdsOrdenados = favoriteCountsData.map((item) => item.character_id)

    const { data: charactersData, error: charactersError } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        slug,
        cover_path,
        universes ( name ),
        mbti_types ( code )
      `)
      .in('id', personajesIdsOrdenados)

    if (charactersError) throw charactersError

    return personajesIdsOrdenados
      .map((id) => charactersData.find((char) => char.id === id))
      .filter(Boolean)
      .map((char) => ({
        slug: char.slug,
        nombre: char.name,
        universo: getRelationValue(char.universes, 'name') || 'Sin universo',
        mbti: getRelationValue(char.mbti_types, 'code') || '—',
        imagen: getPublicUrl(STORAGE_BUCKETS.characterCovers, char.cover_path),
      }))
  },

  async getPopularMbtiTypes(limit = 2) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        mbti_type_id,
        mbti_types (
          code,
          title
        )
      `)

    if (error) throw error
    if (!data || data.length === 0) return []

    const contador = {}

    data.forEach((item) => {
      if (!item.mbti_type_id) return

      const code = getRelationValue(item.mbti_types, 'code')
      const title = getRelationValue(item.mbti_types, 'title')

      if (!contador[item.mbti_type_id]) {
        contador[item.mbti_type_id] = {
          tipo: code || '—',
          descripcion: title || 'Sin descripción',
          total: 1,
        }
      } else {
        contador[item.mbti_type_id].total += 1
      }
    })

    return Object.values(contador)
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  },

  async getDetailBySlug(slug) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        slug,
        description,
        story,
        creation_date,
        first_appearance,
        biological_origin,
        place_of_origin,
        psychological_analysis,
        cover_path,
        universes (
          name
        ),
        mbti_types (
          code,
          title
        )
      `)
      .eq('slug', slug)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    return {
      id: data.id,
      slug: data.slug,
      name: data.name,
      description: data.description,
      story: data.story,
      creationDate: data.creation_date,
      firstAppearance: data.first_appearance,
      procedence: data.place_of_origin,
      biologicalOrigin: data.biological_origin,
      psicologicalAnalisis: data.psychological_analysis,
      universe: getRelationValue(data.universes, 'name') || 'Sin universo',
      mbti: getRelationValue(data.mbti_types, 'code') || '—',
      mbtiTitle: getRelationValue(data.mbti_types, 'title') || '',
      image: getPublicUrl(STORAGE_BUCKETS.characterCovers, data.cover_path),
    }
  },

  async getFilmography(characterId) {
    const { data, error } = await supabase
      .from('filmography')
      .select(`
        id,
        title,
        year,
        cover_path
      `)
      .eq('character_id', characterId)
      .order('year', { ascending: true })

    if (error) throw error

    return (data || []).map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.year,
      coverPath: movie.cover_path,
      image: getPublicUrl(STORAGE_BUCKETS.filmsCover, movie.cover_path),
    }))
  },

  async getAvailableFilms() {
    const { data, error } = await supabase
      .from('filmography')
      .select(`
        title,
        year,
        cover_path
      `)
      .order('title', { ascending: true })

    if (error) throw error

    const uniq = []
    const seen = new Set()

    ;(data || []).forEach((item) => {
      const key = `${item.title?.trim().toLowerCase() || ''}-${item.year || ''}`
      if (!seen.has(key) && item.title) {
        seen.add(key)
        uniq.push({
          title: item.title,
          year: item.year,
          coverPath: item.cover_path,
        })
      }
    })

    return uniq
  },

  async getActors(characterId) {
    const { data, error } = await supabase
      .from('character_actors')
      .select(`
        id,
        actor_name,
        role_description,
        years_active,
        sort_order
      `)
      .eq('character_id', characterId)
      .order('sort_order', { ascending: true })

    if (error) throw error

    return (data || []).map((actor) => {
      let text = actor.actor_name

      if (actor.role_description) text += ` — ${actor.role_description}`
      if (actor.years_active) text += ` (${actor.years_active})`

      return {
        id: actor.id,
        actorName: actor.actor_name,
        text,
      }
    })
  },

  async getPersonalityTags(characterId) {
    const { data, error } = await supabase
      .from('character_personality_tags')
      .select(`
        id,
        personality_tags (
          id,
          name,
          description
        )
      `)
      .eq('character_id', characterId)

    if (error) throw error

    return (data || [])
      .map((item) => ({
        id: item.id,
        name: getRelationValue(item.personality_tags, 'name'),
        description: getRelationValue(item.personality_tags, 'description'),
      }))
      .filter((tag) => tag.name)
  },

  async getImages(characterId, characterName = 'Personaje') {
    const { data, error } = await supabase
      .from('character_media')
      .select(`
        id,
        type,
        title,
        file_path,
        sort_order,
        created_at
      `)
      .eq('character_id', characterId)
      .eq('type', 'image')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) throw error

    return (data || []).map((item) => ({
      id: item.id,
      title: item.title || characterName,
      filePath: item.file_path,
      image: getPublicUrl(STORAGE_BUCKETS.characterMedia, item.file_path),
    }))
  },

  async getAudios(characterId) {
    const { data, error } = await supabase
      .from('audios')
      .select(`
        id,
        title,
        type,
        audio_path,
        transcription,
        created_at
      `)
      .eq('character_id', characterId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return (data || []).map((audio) => ({
      id: audio.id,
      title: audio.title || 'Audio sin título',
      type: audio.type || 'soundtrack',
      audioPath: audio.audio_path,
      transcription: audio.transcription || '',
      url: getPublicUrl(STORAGE_BUCKETS.audioFiles, audio.audio_path),
    }))
  },

  async getCommunityPhotos(characterId) {
    const { data, error } = await supabase
      .from('community_photos')
      .select(`
        id,
        image_path,
        description,
        created_at,
        profiles ( username )
      `)
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((photo) => ({
      id: photo.id,
      description: photo.description || 'Foto de la comunidad',
      image: getPublicUrl(STORAGE_BUCKETS.gallery, photo.image_path),
      user: photo.profiles?.username || 'Usuario',
      date: new Date(photo.created_at).toLocaleDateString('es-ES'),
    }))
  },

  async getComments(characterId, currentUserId = null) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        comment,
        created_at,
        user_id,
        profiles (
          username,
          avatar_path
        )
      `)
      .eq('character_id', characterId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map((comment) => ({
      id: comment.id,
      user:
        comment.user_id === currentUserId
          ? 'Tú'
          : comment.profiles?.username || 'Usuario',
      userId: comment.user_id,
      isOwner: comment.user_id === currentUserId,
      avatar: comment.profiles?.avatar_path
        ? getPublicUrl(STORAGE_BUCKETS.avatars, comment.profiles.avatar_path)
        : null,
      time: new Date(comment.created_at).toLocaleDateString('es-ES'),
      text: comment.comment,
    }))
  },

  async deleteComment(commentId) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
    return true
  },

  //CLASIFICADOR
  //Lo que vamos a hacer ahora es transformar o poner los datos para poderlos mostrar

        //--- Proceso seguido ---
        // 1. Creamos un objeto vacío donde vamos a agrupar los personajes por universo
        // 2. Recorremos los datos obtenidos en busca de los universos y los personajes
        // 3. Para cada personaje, obtenemos el nombre del universo al que pertenece
        // Si ese universo no existe se crea dentro del objeto con un array vacío
        // y si ya existe, simplemente se añade el personaje a ese universo dentro del objeto
        // 4. Para cada personaje, también obtenemos su nombre, imagen y tipo de MBTI para mostrarlo en la tarjeta
        // 5. Al final, tendremos un objeto con la estructura { universo1: [personaje1, personaje2], universo2: [personaje3, personaje4], ... }
  async getClassificationGroups(categoria) {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        name,
        slug,
        cover_path,
        universes (name),
        mbti_types (code, title)
      `)

    if (error) throw error
    if (!data || data.length === 0) return []

    const clasificacion = {}

    data.forEach((personaje) => {
      let name = null

      switch (categoria) {
        case 'universos':
          name = getRelationValue(personaje.universes, 'name')
          break
        case 'personalidades':
          name = getRelationValue(personaje.mbti_types, 'code')
          break
        case 'psicologia':
          name = getRelationValue(personaje.mbti_types, 'code')
          break
        default:
          return
      }

      if (!name) return

      if (!clasificacion[name]) clasificacion[name] = []

      clasificacion[name].push({
        id: personaje.slug,
        nombre: personaje.name,
        imagen: getPublicUrl(STORAGE_BUCKETS.characterCovers, personaje.cover_path),
        mbti: getRelationValue(personaje.mbti_types, 'code') || '—',
      })
    })

    return Object.entries(clasificacion).map(([categoria, personajes]) => ({
      categoria,
      personajes,
    }))
  },

  
  async getAdminCharactersList() {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        slug,
        description,
        story,
        creation_date,
        first_appearance,
        biological_origin,
        place_of_origin,
        psychological_analysis,
        cover_path,
        universes (
          name
        ),
        mbti_types (
          code,
          title
        )
      `)

    if (error) throw error
    if (!data) return []

    return data.map((personaje) => ({
      id: personaje.id,
      name: personaje.name,
      slug: personaje.slug,
      descripcion: getRelationValue(personaje.mbti_types, 'code') || 'Desconocido',
      story: personaje.story,
      creation_date: personaje.creation_date,
      first_appearance: personaje.first_appearance,
      biological_origin: personaje.biological_origin,
      place_of_origin: personaje.place_of_origin,
      psychological_analysis: personaje.psychological_analysis,
      universe: getRelationValue(personaje.universes, 'name') || 'Desconocido',
      mbti: getRelationValue(personaje.mbti_types, 'code') || 'Desconocido',
      mbti_title: getRelationValue(personaje.mbti_types, 'title') || 'Desconocido',
      imagen: getPublicUrl(STORAGE_BUCKETS.characterCovers, personaje.cover_path),
    }))
  },

}

export default characterService