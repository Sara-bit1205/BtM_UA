/*Versión antigua de usuario en Mongo.*/

const User = require('../models/User')

// GET /api/users/me  [user, admin]
exports.getProfile = async (req, res) => {
  res.json(req.user)
}

// PUT /api/users/me  [user]
exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, email },
      { new: true, runValidators: true, select: '-password' }
    )
    res.json(user)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/users/me  [user]
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Cuenta eliminada' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// GET /api/users/me/favorites  [user]
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites')
    res.json(user.favorites)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/users/me/favorites/:characterId  [user]
exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: req.params.characterId } },
      { new: true }
    ).populate('favorites')
    res.json(user.favorites)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE /api/users/me/favorites/:characterId  [user]
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: req.params.characterId } },
      { new: true }
    ).populate('favorites')
    res.json(user.favorites)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// GET /api/users  [admin]
exports.getAll = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
