const express = require('express')
const cors = require('cors')
const { connectDB } = require('./config/db')

const authRoutes = require('./routes/authRoutes_supabase')
const characterRoutes = require('./routes/characterRoutes_supabase')
const categoryRoutes = require('./routes/categoryRoutes_supabase')
const userRoutes = require('./routes/userRoutes_supabase')
const mbtiRoutes = require('./routes/mbtiRoutes_supabase')
const searchRoutes = require('./routes/searchRoutes_supabase')

// Conectar a Supabase
connectDB()

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json())

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Servidor funcionando correctamente', timestamp: new Date() })
})

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/mbti', mbtiRoutes)
app.use('/api/search', searchRoutes)

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({ 
    message: err.message || 'Error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

module.exports = app
