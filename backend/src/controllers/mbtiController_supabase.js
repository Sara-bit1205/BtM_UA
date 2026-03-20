/*Versión Supabase.
En esta versión no se ve el cálculo del test, sino la parte de:

listar tipos MBTI

consultar un MBTI por código

obtener personajes asociados a un MBTI

O sea, sirve más para la parte informativa y de consulta del MBTI.*/

const { getSupabase } = require('../config/db')

// GET /api/mbti
exports.getAll = async (req, res) => {
  try {
    const supabase = getSupabase()

    const { data: mbtiTypes, error } = await supabase
      .from('mbti_types')
      .select('*')
      .order('code')

    if (error) throw error

    res.json(mbtiTypes)
  } catch (err) {
    console.error('Error al obtener tipos MBTI:', err.message)
    res.status(500).json({ message: 'Error al obtener tipos MBTI', error: err.message })
  }
}

// GET /api/mbti/:code
exports.getByCode = async (req, res) => {
  try {
    const { code } = req.params
    const supabase = getSupabase()

    const { data: mbtiType, error } = await supabase
      .from('mbti_types')
      .select(`
        *,
        characters(id, name, slug, cover_image, mbti_types(code))
      `)
      .eq('code', code.toUpperCase())
      .single()

    if (error || !mbtiType) {
      return res.status(404).json({ message: 'Tipo MBTI no encontrado' })
    }

    res.json(mbtiType)
  } catch (err) {
    console.error('Error al obtener tipo MBTI:', err.message)
    res.status(500).json({ message: 'Error al obtener tipo MBTI', error: err.message })
  }
}

// GET /api/mbti/:id/characters
exports.getCharactersByMBTI = async (req, res) => {
  try {
    const { id } = req.params
    const supabase = getSupabase()

    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title),
        character_universe_categories(universe_categories(*))
      `)
      .eq('mbti_type_id', id)
      .order('name')

    if (error) throw error

    res.json(characters)
  } catch (err) {
    console.error('Error al obtener personajes MBTI:', err.message)
    res.status(500).json({ message: 'Error al obtener personajes', error: err.message })
  }
}
