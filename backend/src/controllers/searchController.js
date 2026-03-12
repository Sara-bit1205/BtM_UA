const Character = require('../models/Character')

// GET /api/search?query=&universe=&personality=&mbtiType=
exports.search = async (req, res) => {
  try {
    const { query, universe, personality, mbtiType } = req.query
    const filter = {}

    if (query) filter.$text = { $search: query }
    if (universe) filter.universe = new RegExp(universe, 'i')
    if (personality) filter.personality = new RegExp(personality, 'i')
    if (mbtiType) filter.mbtiType = mbtiType.toUpperCase()

    const characters = await Character.find(filter).populate('categories', 'name type')
    res.json(characters)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
