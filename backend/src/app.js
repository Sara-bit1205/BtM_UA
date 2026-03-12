const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const characterRoutes = require('./routes/characterRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const userRoutes = require('./routes/userRoutes')
const mbtiRoutes = require('./routes/mbtiRoutes')
const searchRoutes = require('./routes/searchRoutes')

connectDB()

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/characters', characterRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/mbti', mbtiRoutes)
app.use('/api/search', searchRoutes)

module.exports = app
