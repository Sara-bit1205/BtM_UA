import { supabase } from '../lib/supabase'
import { getPublicUrl, STORAGE_BUCKETS } from '../lib/storage'

const searchService = {
  async getSearchCharacters() {
    const { data, error } = await supabase
      .from('characters')
      .select(`
        id,
        name,
        slug,
        cover_path,
        universes ( name ),
        mbti_types ( code ),
        character_personality_tags (
          personality_tags ( name )
        )
      `)

    if (error) throw error
    if (!data) return []

    return data.map((c) => ({
      id: c.id,
      nombre: c.name,
      slug: c.slug,
      tipo: c.mbti_types?.code || 'N/A',
      universo: c.universes?.name || 'Desconocido',
      img: getPublicUrl(STORAGE_BUCKETS.characterCovers, c.cover_path),
      tags:
        c.character_personality_tags
          ?.map((t) => t.personality_tags?.name)
          .filter(Boolean) || [],
    }))
  },

  async getFilters() {
    const [universosRes, mbtiRes, tagsRes] = await Promise.all([
      supabase.from('universes').select('name').order('name'),
      supabase.from('mbti_types').select('code').order('code'),
      supabase.from('personality_tags').select('name').order('name'),
    ])

    if (universosRes.error) throw universosRes.error
    if (mbtiRes.error) throw mbtiRes.error
    if (tagsRes.error) throw tagsRes.error

    return {
      universos: (universosRes.data || []).map((u) => u.name),
      mbtis: (mbtiRes.data || []).map((m) => m.code),
      tags: (tagsRes.data || []).map((t) => t.name),
    }
  },
}

export default searchService