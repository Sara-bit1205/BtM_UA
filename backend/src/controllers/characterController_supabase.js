/*Es bastante importante porque gestiona casi toda la lógica de la parte pública de personajes.
Hace:

listado completo

detalle por id

detalle por slug

personajes por MBTI

crear, editar y borrar personajes

añadir comentarios

obtener comentarios

Es decir: este archivo es el que alimentaría páginas como:

listado de personajes

ficha de personaje individual

comentarios de la comunidad*/

const { getSupabase } = require('../config/db')

// GET /api/characters
exports.getAll = async (req, res) => {
  try {
    const supabase = getSupabase()
    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title),
        character_universe_categories(universe_categories(*)),
        character_personality_tags(personality_tags(*))
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(characters)
  } catch (err) {
    console.error('Error al obtener personajes:', err.message)
    res.status(500).json({ message: 'Error al obtener personajes', error: err.message })
  }
}

// GET /api/characters/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const supabase = getSupabase()

    const { data: character, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title, description),
        character_universe_categories(universe_categories(*)),
        character_personality_tags(personality_tags(*)),
        filmography(*),
        audios(*),
        community_photos(*, users(username, avatar)),
        comments(*, users(username, avatar, id))
      `)
      .eq('id', id)
      .single()

    if (error || !character) {
      return res.status(404).json({ message: 'Personaje no encontrado' })
    }

    res.json(character)
  } catch (err) {
    console.error('Error al obtener personaje:', err.message)
    res.status(500).json({ message: 'Error al obtener personaje', error: err.message })
  }
}

// GET /api/characters/slug/:slug
exports.getBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    const supabase = getSupabase()

    const { data: character, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title, description),
        character_universe_categories(universe_categories(*)),
        character_personality_tags(personality_tags(*)),
        filmography(*),
        audios(*),
        community_photos(*, users(username, avatar)),
        comments(*, users(username, avatar, id))
      `)
      .eq('slug', slug)
      .single()

    if (error || !character) {
      return res.status(404).json({ message: 'Personaje no encontrado' })
    }

    res.json(character)
  } catch (err) {
    console.error('Error al obtener personaje por slug:', err.message)
    res.status(500).json({ message: 'Error al obtener personaje', error: err.message })
  }
}

// GET /api/characters/mbti/:code
exports.getByMBTI = async (req, res) => {
  try {
    const { code } = req.params
    const supabase = getSupabase()

    // Primero obtener el tipo MBTI
    const { data: mbtiType, error: mbtiError } = await supabase
      .from('mbti_types')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (mbtiError || !mbtiType) {
      return res.status(404).json({ message: 'Tipo MBTI no encontrado' })
    }

    // Luego obtener los personajes con ese tipo
    const { data: characters, error } = await supabase
      .from('characters')
      .select(`
        *,
        mbti_types(code, title),
        character_universe_categories(universe_categories(*))
      `)
      .eq('mbti_type_id', mbtiType.id)

    if (error) throw error

    res.json(characters)
  } catch (err) {
    console.error('Error al obtener personajes por MBTI:', err.message)
    res.status(500).json({ message: 'Error al obtener personajes', error: err.message })
  }
}

// POST /api/characters (Admin)
exports.create = async (req, res) => {
  try {
    const { name, slug, description, story, cover_image, first_appearance, biological_origin, mbti_type_id } = req.body
    const userId = req.user.id

    // Validar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden crear personajes' })
    }

    const supabase = getSupabase()

    // Verificar que el slug sea único
    const { data: existingSlug } = await supabase
      .from('characters')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingSlug) {
      return res.status(409).json({ message: 'El slug ya existe' })
    }

    const { data: newCharacter, error } = await supabase
      .from('characters')
      .insert([{
        name,
        slug,
        description,
        story,
        cover_image,
        first_appearance,
        biological_origin,
        mbti_type_id: mbti_type_id || null,
        created_by: userId
      }])
      .select()

    if (error) throw error

    res.status(201).json({
      message: 'Personaje creado exitosamente',
      character: newCharacter[0]
    })
  } catch (err) {
    console.error('Error al crear personaje:', err.message)
    res.status(500).json({ message: 'Error al crear personaje', error: err.message })
  }
}

// PUT /api/characters/:id (Admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { name, slug, description, story, cover_image, first_appearance, biological_origin, mbti_type_id } = req.body

    // Validar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden actualizar personajes' })
    }

    const supabase = getSupabase()

    // Si cambia el slug, verificar que sea único
    if (slug) {
      const { data: existingSlug } = await supabase
        .from('characters')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (existingSlug) {
        return res.status(409).json({ message: 'El slug ya existe' })
      }
    }

    const { data: updated, error } = await supabase
      .from('characters')
      .update({
        name: name || undefined,
        slug: slug || undefined,
        description: description || undefined,
        story: story || undefined,
        cover_image: cover_image || undefined,
        first_appearance: first_appearance || undefined,
        biological_origin: biological_origin || undefined,
        mbti_type_id: mbti_type_id || undefined
      })
      .eq('id', id)
      .select()

    if (error || !updated.length) {
      return res.status(404).json({ message: 'Personaje no encontrado' })
    }

    res.json({
      message: 'Personaje actualizado',
      character: updated[0]
    })
  } catch (err) {
    console.error('Error al actualizar personaje:', err.message)
    res.status(500).json({ message: 'Error al actualizar personaje', error: err.message })
  }
}

// DELETE /api/characters/:id (Admin)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params

    // Validar que sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores pueden eliminar personajes' })
    }

    const supabase = getSupabase()

    const { error } = await supabase
      .from('characters')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Personaje eliminado correctamente' })
  } catch (err) {
    console.error('Error al eliminar personaje:', err.message)
    res.status(500).json({ message: 'Error al eliminar personaje', error: err.message })
  }
}

// POST /api/characters/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params
    const { comment } = req.body
    const userId = req.user.id

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' })
    }

    const supabase = getSupabase()

    const { data: newComment, error } = await supabase
      .from('comments')
      .insert([{
        character_id: id,
        user_id: userId,
        comment: comment.trim()
      }])
      .select('*, users(username, avatar)')

    if (error) throw error

    res.status(201).json({
      message: 'Comentario agregado',
      comment: newComment[0]
    })
  } catch (err) {
    console.error('Error al agregar comentario:', err.message)
    res.status(500).json({ message: 'Error al agregar comentario', error: err.message })
  }
}

// GET /api/characters/:id/comments
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params
    const supabase = getSupabase()

    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, users(username, avatar, id)')
      .eq('character_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(comments)
  } catch (err) {
    console.error('Error al obtener comentarios:', err.message)
    res.status(500).json({ message: 'Error al obtener comentarios', error: err.message })
  }
}
