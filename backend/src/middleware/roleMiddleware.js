// Devuelve un middleware que restringe el acceso a los roles indicados.
// Debe usarse después de authMiddleware.
// Ejemplo: router.delete('/:id', authMiddleware, roleMiddleware('admin'), controller)
const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ message: 'Acceso denegado: rol insuficiente' })
  }
  next()
}

module.exports = roleMiddleware
