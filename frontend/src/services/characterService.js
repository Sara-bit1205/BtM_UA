/*Este nuevo characterService deja de llamar a rutas REST del backend 
y pasa a consultar directamente Supabase, leyendo personajes desde la 
tabla characters y trayéndose sus relaciones como universo, tipo MBTI, 
filmografía, audios y etiquetas de personalidad. Además, ya no necesita 
tokens manuales porque Supabase usa la sesión activa para aplicar 
automáticamente los permisos definidos con RLS.*/

import { supabase } from '../lib/supabase'

const characterService = {
  async getAll(params = {}) {
    let query = supabase
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
      .order('created_at', { ascending: false })

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

  async create(values) {
    const { data, error } = await supabase
      .from('characters')
      .insert(values)
      .select()
      .single()

    if (error) throw error
    return data
  },

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

  async remove(id) {
    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getByMBTI(mbtiCode) {
    const { data: mbtiType, error: mbtiError } = await supabase
      .from('mbti_types')
      .select('id')
      .eq('code', mbtiCode)
      .single()

    if (mbtiError) throw mbtiError

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
}

export default characterService