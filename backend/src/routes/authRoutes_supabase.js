const express = require('express')
const authController = require('../controllers/authController_supabase')
const { protect } = require('../middleware/authMiddleware_supabase')

const router = express.Router()

// Rutas sin autenticación
router.post('/register', authController.register)
router.post('/login', authController.login)

// Rutas con autenticación
router.get('/profile', protect, authController.getProfile)
router.put('/profile', protect, authController.updateProfile)
router.post('/logout', protect, authController.logout)

module.exports = router
