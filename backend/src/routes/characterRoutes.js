const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/characterController')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

// Públicas
router.get('/', ctrl.getAll)
router.get('/mbti/:mbtiType', ctrl.getByMBTI)
router.get('/:id', ctrl.getById)

// Solo admin
router.post('/', authMiddleware, roleMiddleware('admin'), ctrl.create)
router.put('/:id', authMiddleware, roleMiddleware('admin'), ctrl.update)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), ctrl.remove)

module.exports = router
