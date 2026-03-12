const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/mbtiController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// Pública
router.get('/questions', ctrl.getQuestions)

// Solo usuarios autenticados (user)
router.post('/result', authMiddleware, roleMiddleware('user'), ctrl.submitResult)

module.exports = router
