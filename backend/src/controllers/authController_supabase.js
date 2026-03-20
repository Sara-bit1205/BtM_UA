/*Es la versión equivalente pero pensada para la tabla users en Supabase.
Hace:

    registro

    login

    obtener perfil

    actualizar perfil

    logout “lógico”

Importante: aquí se ve claramente que no está usando Supabase Auth real, 
sino una tabla users propia con contraseña hasheada y JWT manual.*/

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getSupabase } = require('../config/db')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, email, password, name } = req.body

    // Validaciones básicas
    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, username y contraseña son requeridos' })
    }

    const supabase = getSupabase()

    // Verificar si el email ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado' })
    }

    // Verificar si el username ya existe
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existingUsername) {
      return res.status(409).json({ message: 'El username ya existe' })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    // Crear usuario
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        name: name || username,
        password: hashedPassword,
        role: 'user',
        is_active: true
      }])
      .select()

    if (error) throw error

    res.status(201).json({
      message: 'Registro exitoso',
      user: {
        id: newUser[0].id,
        username: newUser[0].username,
        email: newUser[0].email,
        role: newUser[0].role
      }
    })
  } catch (err) {
    console.error('Error en registro:', err.message)
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message })
  }
}

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' })
    }

    const supabase = getSupabase()

    // Buscar usuario por email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    // Verificar contraseña
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciales incorrectas' })
    }

    // Verificar si la cuenta está activa
    if (!user.is_active) {
      return res.status(403).json({ message: 'Cuenta desactivada. Contacta al administrador.' })
    }

    // Generar token
    const token = signToken(user.id)

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      },
      token
    })
  } catch (err) {
    console.error('Error en login:', err.message)
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message })
  }
}

// GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id // Del middleware de autenticación

    const supabase = getSupabase()
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      birth_date: user.birth_date,
      created_at: user.created_at
    })
  } catch (err) {
    console.error('Error al obtener perfil:', err.message)
    res.status(500).json({ message: 'Error al obtener perfil', error: err.message })
  }
}

// PUT /api/auth/profile
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
        birth_date: birth_date || undefined
      })
      .eq('id', userId)
      .select()

    if (error) throw error

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updated[0]
    })
  } catch (err) {
    console.error('Error al actualizar perfil:', err.message)
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message })
  }
}

// POST /api/auth/logout
exports.logout = async (req, res) => {
  // El logout se maneja en el frontend eliminando el token
  res.json({ message: 'Sesión cerrada correctamente' })
}
