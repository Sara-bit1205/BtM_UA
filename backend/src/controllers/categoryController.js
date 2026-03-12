const Category = require('../models/Category')

// GET /api/categories
exports.getAll = async (req, res) => {
  try {
    const categories = await Category.find()
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/categories/:id
exports.getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/categories  [admin]
exports.create = async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT /api/categories/:id  [admin]
exports.update = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/categories/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json({ message: 'Categoría eliminada' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
