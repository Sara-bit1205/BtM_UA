const MBTIResult = require('../models/MBTIResult')
const User = require('../models/User')
const mbtiService = require('../services/mbtiService')

// GET /api/mbti/questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = mbtiService.getQuestions()
    res.json(questions)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// POST /api/mbti/result  [user]
exports.submitResult = async (req, res) => {
  try {
    const { answers } = req.body
    const mbtiType = mbtiService.calculateMBTI(answers)

    // Guardar o actualizar el resultado del usuario
    await MBTIResult.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, mbtiType, answers },
      { upsert: true, new: true }
    )

    // Actualizar mbtiType en el perfil del usuario
    await User.findByIdAndUpdate(req.user._id, { mbtiType })

    res.json({ mbtiType })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
