// Funciones de utilidad generales del backend

// Formatea un error de Mongoose en un mensaje legible
const formatMongoError = (err) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return `El valor '${err.keyValue[field]}' ya existe para el campo '${field}'`
  }
  return err.message
}

module.exports = { formatMongoError }
