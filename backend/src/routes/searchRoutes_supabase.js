const express = require('express')
const searchController = require('../controllers/searchController_supabase')

const router = express.Router()

// Búsqueda general
router.get('/', searchController.search)

// Búsqueda específica de personajes
router.get('/characters', searchController.searchCharacters)

module.exports = router
