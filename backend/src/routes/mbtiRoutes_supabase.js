const express = require('express')
const mbtiController = require('../controllers/mbtiController_supabase')

const router = express.Router()

// Rutas públicas
router.get('/', mbtiController.getAll)
router.get('/:code', mbtiController.getByCode)
router.get('/:id/characters', mbtiController.getCharactersByMBTI)

module.exports = router
