const mongoose = require('mongoose')

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String },
    universe: { type: String, required: true },         // Disney, Marvel, DC…
    mbtiType: { type: String },                          // INTJ, ENFP…
    personality: { type: String },                       // descripción breve
    biography: { type: String },                         // historia y origen
    productions: [{ title: String, year: Number, type: String }], // películas/series
    actors: [{ name: String, adaptation: String }],
    analysis: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  },
  { timestamps: true }
)

// Índice de texto para búsqueda por nombre
characterSchema.index({ name: 'text', universe: 'text', mbtiType: 'text', personality: 'text' })

module.exports = mongoose.model('Character', characterSchema)
