
/*
Hace lo mismo pero sobre la tabla universe_categories de Supabase.
Además comprueba si el usuario es admin antes de crear, editar o borrar.
  Permite:

  listar categorías

  ver una

  crear

  editar

  borrar
  */

const { getSupabase } = require('../config/db')

// GET /api/categories
exports.getAll = async (req, res) => {
  try {
    const supabase = getSupabase()

    const { data: categories, error } = await supabase
      .from('universe_categories')
      .select('*, universes(name)')
      .order('name')

    if (error) throw error

    res.json(categories)
  } catch (err) {
    console.error('Error al obtener categorías:', err.message)
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message })
  }
}

// GET /api/categories/universe/:universeId
exports.getByUniverse = async (req, res) => {
  try {
    const { universeId } = req.params
    const supabase = getSupabase()

    const { data: categories, error } = await supabase
      .from('universe_categories')
      .select('*')
      .eq('universe_id', universeId)
      .order('name')

    if (error) throw error

    res.json(categories)
  } catch (err) {
    console.error('Error al obtener categorías:', err.message)
    res.status(500).json({ message: 'Error al obtener categorías', error: err.message })
  }
}

// GET /api/categories/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params
    const supabase = getSupabase()

    const { data: category, error } = await supabase
      .from('universe_categories')
      .select('*, universes(name)')
      .eq('id', id)
      .single()

    if (error || !category) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    res.json(category)
  } catch (err) {
    console.error('Error al obtener categoría:', err.message)
    res.status(500).json({ message: 'Error al obtener categoría', error: err.message })
  }
}

// POST /api/categories (Admin)
exports.create = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const { universe_id, name, description } = req.body

    const supabase = getSupabase()

    const { data: newCategory, error } = await supabase
      .from('universe_categories')
      .insert([{
        universe_id,
        name,
        description: description || null
      }])
      .select()

    if (error) throw error

    res.status(201).json({
      message: 'Categoría creada',
      category: newCategory[0]
    })
  } catch (err) {
    console.error('Error al crear categoría:', err.message)
    res.status(500).json({ message: 'Error al crear categoría', error: err.message })
  }
}

// PUT /api/categories/:id (Admin)
exports.update = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const { id } = req.params
    const { name, description } = req.body

    const supabase = getSupabase()

    const { data: updated, error } = await supabase
      .from('universe_categories')
      .update({
        name: name || undefined,
        description: description || undefined
      })
      .eq('id', id)
      .select()

    if (error || !updated.length) {
      return res.status(404).json({ message: 'Categoría no encontrada' })
    }

    res.json({
      message: 'Categoría actualizada',
      category: updated[0]
    })
  } catch (err) {
    console.error('Error al actualizar categoría:', err.message)
    res.status(500).json({ message: 'Error al actualizar categoría', error: err.message })
  }
}

// DELETE /api/categories/:id (Admin)
exports.delete = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Solo administradores' })
    }

    const { id } = req.params
    const supabase = getSupabase()

    const { error } = await supabase
      .from('universe_categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Categoría eliminada' })
  } catch (err) {
    console.error('Error al eliminar categoría:', err.message)
    res.status(500).json({ message: 'Error al eliminar categoría', error: err.message })
  }
}
