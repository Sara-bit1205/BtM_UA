/*Versión Supabase de la búsqueda.
Hace:

una búsqueda general (characters, universes, personality_tags)

una búsqueda específica de personajes

Esto está directamente relacionado con vuestra funcionalidad de “Buscar personaje, personalidad, tipo MBTI o categoría”.*/


const { getSupabase } = require('../config/db')

// GET /api/search?q=query
exports.search = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'La búsqueda debe tener al menos 2 caracteres' })
    }

    const supabase = getSupabase()

    // Buscar personajes
    const { data: characters, error: charError } = await supabase
      .from('characters')
      .select(`
        id, name, slug, cover_image, description,
        mbti_types(code, title),
        character_universe_categories(universe_categories(name))
      `)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(10)

    // Buscar universos
    const { data: universes, error: univError } = await supabase
      .from('universes')
      .select('*')
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .limit(10)

    // Buscar tags de personalidad
    const { data: tags, error: tagError } = await supabase
      .from('personality_tags')
      .select('*')
      .ilike('name', `%${q}%`)
      .limit(10)

    if (charError || univError || tagError) {
      throw charError || univError || tagError
    }

    res.json({
      characters: characters || [],
      universes: universes || [],
      personality_tags: tags || []
    })
  } catch (err) {
    console.error('Error en búsqueda:', err.message)
    res.status(500).json({ message: 'Error en búsqueda', error: err.message })
  }
}

// GET /api/search/characters?q=query
exports.searchCharacters = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'La búsqueda debe tener al menos 2 caracteres' })
    }

    const supabase = getSupabase()

    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title),
        character_universe_categories(universe_categories(*))
      `)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,story.ilike.%${q}%`)
      .order('name')

    if (error) throw error

    res.json(characters)
  } catch (err) {
    console.error('Error en búsqueda de personajes:', err.message)
    res.status(500).json({ message: 'Error en búsqueda', error: err.message })
  }
}
