const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// Autenticado (user o admin)
router.get('/me', authMiddleware, ctrl.getProfile)
router.put('/me', authMiddleware, ctrl.updateProfile)
router.delete('/me', authMiddleware, ctrl.deleteAccount)

// Favoritos (solo user)
router.get('/me/favorites', authMiddleware, roleMiddleware('user'), ctrl.getFavorites)
router.post('/me/favorites/:characterId', authMiddleware, roleMiddleware('user'), ctrl.addFavorite)
router.delete('/me/favorites/:characterId', authMiddleware, roleMiddleware('user'), ctrl.removeFavorite)

// Solo admin
router.get('/', authMiddleware, roleMiddleware('admin'), ctrl.getAll)

module.exports = router
