const express = require('express')
const userController = require('../controllers/userController_supabase')
const { protect, admin } = require('../middleware/authMiddleware_supabase')

const router = express.Router()

// Rutas autenticadas para el usuario
router.get('/profile', protect, userController.getProfile)
router.put('/profile', protect, userController.updateProfile)

// Favoritos
router.get('/favorites', protect, userController.getFavorites)
router.post('/favorites/:characterId', protect, userController.addFavorite)
router.delete('/favorites/:characterId', protect, userController.removeFavorite)
router.get('/favorites/:characterId/check', protect, userController.isFavorite)

// MBTI
router.get('/mbti-result', protect, userController.getMBTIResult)
router.post('/mbti-result', protect, userController.saveMBTIResult)

// Rutas admin
router.get('/', protect, admin, userController.getAllUsers)
router.put('/:userId/role', protect, admin, userController.updateUserRole)
router.put('/:userId/deactivate', protect, admin, userController.deactivateUser)

module.exports = router
