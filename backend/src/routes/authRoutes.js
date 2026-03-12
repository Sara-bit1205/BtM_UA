const express = require('express')
const router = express.Router()
const { register, verifyEmail, login } = require('../controllers/authController')

// POST   /api/auth/register
router.post('/register', register)

// GET    /api/auth/verify/:token
router.get('/verify/:token', verifyEmail)

// POST   /api/auth/login
router.post('/login', login)

module.exports = router
