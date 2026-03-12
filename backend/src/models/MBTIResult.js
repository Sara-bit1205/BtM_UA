const mongoose = require('mongoose')

// Almacena el resultado del test MBTI de cada usuario
const mbtiResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    mbtiType: { type: String, required: true },  // p.ej. "INTJ"
    answers: [{ questionId: String, value: String }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('MBTIResult', mbtiResultSchema)
