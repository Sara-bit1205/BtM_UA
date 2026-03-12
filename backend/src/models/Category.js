const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    // Tipo: 'universe' | 'personality' | 'mbti'
    type: { type: String, enum: ['universe', 'personality', 'mbti'], required: true },
    description: { type: String },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Category', categorySchema)
