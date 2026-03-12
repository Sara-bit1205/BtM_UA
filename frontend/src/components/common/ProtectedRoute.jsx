import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Protege rutas según el rol del usuario autenticado.
// allowedRoles: array de roles permitidos, p.ej. ['user'] o ['admin']
function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />

  return <Outlet />
}

export default ProtectedRoute
