const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const emailService = require('../services/emailService')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'El email ya está registrado' })

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const user = await User.create({ username, email, password, verificationToken })

    await emailService.sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({ message: 'Registro exitoso. Revisa tu correo para verificar la cuenta.' })
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message })
  }
}

// GET /api/auth/verify/:token
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token })
    if (!user) return res.status(400).json({ message: 'Token de verificación inválido' })

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    res.json({ message: 'Cuenta verificada correctamente' })
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Cuenta no verificada. Revisa tu correo.' })
    }

    const token = signToken(user._id)
    const userData = { _id: user._id, username: user.username, email: user.email, role: user.role, mbtiType: user.mbtiType }
    res.json({ user: userData, token })
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor', error: err.message })
  }
}
