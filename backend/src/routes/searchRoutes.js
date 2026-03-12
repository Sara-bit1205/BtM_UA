const express = require('express')
const router = express.Router()
const { search } = require('../controllers/searchController')

// GET /api/search?query=&universe=&personality=&mbtiType=
router.get('/', search)

module.exports = router
