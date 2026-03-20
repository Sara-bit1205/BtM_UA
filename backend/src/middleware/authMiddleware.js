/*Versión antigua de middleware para autenticar con JWT y usuario Mongo.
Lee el token, lo valida y mete el usuario en req.user.*/

const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Verifica el token JWT y adjunta el usuario a req.user
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado: token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select('-password')
    if (!req.user) return res.status(401).json({ message: 'No autorizado: usuario no encontrado' })
    next()
  } catch {
    return res.status(401).json({ message: 'No autorizado: token inválido' })
  }
}

module.exports = authMiddleware
