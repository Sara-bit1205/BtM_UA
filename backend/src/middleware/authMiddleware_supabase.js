/*Versión Supabase.
Hace tres cosas:

protect: exige token válido

admin: exige rol admin

optionalAuth: si hay token lo usa, si no sigue sin fallar

Esto sirve para proteger rutas como:

“solo autenticados”

“solo admin”

“público, pero con datos extra si hay sesión”*/

const jwt = require('jsonwebtoken')
const { getSupabase } = require('../config/db')

// Middleware para verificar JWT
exports.protect = async (req, res, next) => {
  try {
    // Obtener el token del header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' })
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Obtener el usuario de la BD
    const supabase = getSupabase()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, role, is_active')
      .eq('id', decoded.id)
      .single()

    if (error || !user || !user.is_active) {
      return res.status(401).json({ message: 'Usuario no válido o desactivado' })
    }

    // Agregar usuario al request
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' })
    }
    console.error('Error en autenticación:', err.message)
    res.status(401).json({ message: 'Token inválido' })
  }
}

// Middleware para verificar que sea admin
exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Solo administradores tienen acceso' })
  }
  next()
}

// Middleware opcional de autenticación (no requiere token)
exports.optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return next()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    const supabase = getSupabase()
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, username, role')
      .eq('id', decoded.id)
      .single()

    if (!error && user) {
      req.user = user
    }

    next()
  } catch (err) {
    // Si hay error con el token, continuar sin autenticación
    next()
  }
}
