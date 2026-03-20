const express = require('express')
const characterController = require('../controllers/characterController_supabase')
const { protect, admin } = require('../middleware/authMiddleware_supabase')
const { optionalAuth } = require('../middleware/authMiddleware_supabase')

const router = express.Router()

// Rutas públicas
router.get('/', characterController.getAll)
router.get('/slug/:slug', characterController.getBySlug)
router.get('/:id', characterController.getById)
router.get('/mbti/:code', characterController.getByMBTI)

// Comentarios (públicos para lectura, autenticado para escritura)
router.get('/:id/comments', characterController.getComments)
router.post('/:id/comments', protect, characterController.addComment)

// Rutas admin
router.post('/', protect, admin, characterController.create)
router.put('/:id', protect, admin, characterController.update)
router.delete('/:id', protect, admin, characterController.remove)

module.exports = router
