/*Versión Supabase de esa misma idea.
Gestiona:

perfil

actualizar perfil

favoritos

comprobar si un personaje es favorito

guardar/leer resultado MBTI

listado de usuarios para admin

cambiar rol

desactivar usuario

Este archivo encaja con vuestro panel de usuario y parte del panel de admin.*/

const { getSupabase } = require('../config/db')

// GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const supabase = getSupabase()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, name, role, avatar, birth_date, is_active, created_at')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (err) {
    console.error('Error al obtener perfil:', err.message)
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message })
  }
}

// PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, avatar, birth_date } = req.body

    const supabase = getSupabase()

    const { data: updated, error } = await supabase
      .from('users')
      .update({
        name: name || undefined,
        avatar: avatar || undefined,
        birth_date: birth_date || undefined,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()

    if (error || !updated.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({
      message: 'Perfil actualizado',
      user: updated[0]
    })
  } catch (err) {
    console.error('Error al actualizar perfil:', err.message)
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message })
  }
}

// GET /api/users/favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id
    const supabase = getSupabase()

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('characters(*)')
      .eq('user_id', userId)

    if (error) throw error

    // Extraer solo los personajes
    const characters = favorites.map(fav => fav.characters)

    res.json(characters)
  } catch (err) {
    console.error('Error al obtener favoritos:', err.message)
    res.status(500).json({ message: 'Error al obtener favoritos', error: err.message })
  }
}

// POST /api/users/favorites/:characterId
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { characterId } = req.params

    const supabase = getSupabase()

    // Verificar que el personaje existe
    const { data: character } = await supabase
      .from('characters')
      .select('id')
      .eq('id', characterId)
      .single()

    if (!character) {
      return res.status(404).json({ message: 'Personaje no encontrado' })
    }

    const { data: newFavorite, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: userId,
        character_id: characterId
      }])
      .select()

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ message: 'Ya está en tus favoritos' })
      }
      throw error
    }

    res.status(201).json({
      message: 'Agregado a favoritos',
      favorite: newFavorite[0]
    })
  } catch (err) {
    console.error('Error al agregar a favoritos:', err.message)
    res.status(500).json({ message: 'Error al agregar a favoritos', error: err.message })
  }
}

// DELETE /api/users/favorites/:characterId
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { characterId } = req.params

    const supabase = getSupabase()

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('character_id', characterId)

    if (error) throw error

    res.json({ message: 'Eliminado de favoritos' })
  } catch (err) {
    console.error('Error al eliminar de favoritos:', err.message)
    res.status(500).json({ message: 'Error al eliminar de favoritos', error: err.message })
  }
}

// GET /api/users/favorites/:characterId/check
exports.isFavorite = async (req, res) => {
  try {
    const userId = req.user.id
    const { characterId } = req.params

    const supabase = getSupabase()

    const { data: favorite } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('character_id', characterId)
      .single()

    res.json({
      is_favorite: !!favorite
    })
  } catch (err) {
    console.error('Error al verificar favorito:', err.message)
    res.status(500).json({ message: 'Error al verificar favorito', error: err.message })
  }
}

// GET /api/users/mbti-result
exports.getMBTIResult = async (req, res) => {
  try {
    const userId = req.user.id
    const supabase = getSupabase()

    const { data: result, error } = await supabase
      .from('mbti_results')
      .select('*, mbti_types(code, title, description)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    if (!result) {
      return res.status(404).json({ message: 'No hay resultado de MBTI' })
    }

    res.json(result)
  } catch (err) {
    console.error('Error al obtener resultado MBTI:', err.message)
    res.status(500).json({ message: 'Error al obtener resultado MBTI', error: err.message })
  }
}

// POST /api/users/mbti-result
exports.saveMBTIResult = async (req, res) => {
  try {
    const userId = req.user.id
    const { mbti_type_id, score } = req.body

    const supabase = getSupabase()

    const { data: newResult, error } = await supabase
      .from('mbti_results')
      .insert([{
        user_id: userId,
        mbti_type_id,
        score: score || null
      }])
      .select('*, mbti_types(code, title)')

    if (error) throw error

    res.status(201).json({
      message: 'Resultado MBTI guardado',
      result: newResult[0]
    })
  } catch (err) {
    console.error('Error al guardar resultado MBTI:', err.message)
    res.status(500).json({ message: 'Error al guardar resultado MBTI', error: err.message })
  }
}

// GET /api/users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const supabase = getSupabase()

    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, name, role, is_active, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json(users)
  } catch (err) {
    console.error('Error al obtener usuarios:', err.message)
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message })
  }
}

// PUT /api/users/:userId/role (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const { userId } = req.params
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' })
    }

    const supabase = getSupabase()

    const { data: updated, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)
      .select()

    if (error || !updated.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({
      message: 'Rol actualizado',
      user: updated[0]
    })
  } catch (err) {
    console.error('Error al actualizar rol:', err.message)
    res.status(500).json({ message: 'Error al actualizar rol', error: err.message })
  }
}

// PUT /api/users/:userId/deactivate (Admin)
exports.deactivateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const { userId } = req.params

    const supabase = getSupabase()

    const { data: updated, error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', userId)
      .select()

    if (error || !updated.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({
      message: 'Usuario desactivado',
      user: updated[0]
    })
  } catch (err) {
    console.error('Error al desactivar usuario:', err.message)
    res.status(500).json({ message: 'Error al desactivar usuario', error: err.message })
  }
}
