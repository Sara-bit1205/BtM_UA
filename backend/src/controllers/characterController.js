/*Versión antigua de personajes con Mongo.*/


const Character = require('../models/Character')

// GET /api/characters
exports.getAll = async (req, res) => {
  try {
    const characters = await Character.find().populate('categories', 'name type')
    res.json(characters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/characters/:id
exports.getById = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id).populate('categories', 'name type')
    if (!character) return res.status(404).json({ message: 'Personaje no encontrado' })
    res.json(character)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/characters/mbti/:mbtiType
exports.getByMBTI = async (req, res) => {
  try {
    const characters = await Character.find({ mbtiType: req.params.mbtiType.toUpperCase() })
    res.json(characters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/characters  [admin]
exports.create = async (req, res) => {
  try {
    const character = await Character.create(req.body)
    res.status(201).json(character)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// PUT /api/characters/:id  [admin]
exports.update = async (req, res) => {
  try {
    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!character) return res.status(404).json({ message: 'Personaje no encontrado' })
    res.json(character)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/characters/:id  [admin]
exports.remove = async (req, res) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id)
    if (!character) return res.status(404).json({ message: 'Personaje no encontrado' })
    res.json({ message: 'Personaje eliminado' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
