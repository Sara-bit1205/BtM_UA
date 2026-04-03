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
          cover_image
        ),
        audios (
          id,
          title,
          type,
          audio_url,
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
          cover_image
        ),
        audios (
          id,
          title,
          type,
          audio_url,
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
  }

}

export default characterService