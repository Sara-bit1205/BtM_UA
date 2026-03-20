const express = require('express')
const categoryController = require('../controllers/categoryController_supabase')
const { protect, admin } = require('../middleware/authMiddleware_supabase')

const router = express.Router()

// Rutas públicas
router.get('/', categoryController.getAll)
router.get('/universe/:universeId', categoryController.getByUniverse)
router.get('/:id', categoryController.getById)

// Rutas admin
router.post('/', protect, admin, categoryController.create)
router.put('/:id', protect, admin, categoryController.update)
router.delete('/:id', protect, admin, categoryController.delete)

module.exports = router
