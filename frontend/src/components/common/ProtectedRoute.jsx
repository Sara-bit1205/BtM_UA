/*Este ProtectedRoute actúa como un guardián de las rutas privadas:
 primero espera a que termine de cargarse el estado de autenticación 
 (loading), luego comprueba si el usuario está autenticado mediante 
 Supabase (isAuthenticated) y, si no lo está, lo redirige al login; 
 si sí está autenticado pero no tiene el rol adecuado (role), lo envía
  a la página principal; y solo si cumple ambas condiciones (logueado y
   con rol permitido) permite el acceso a la ruta protegida renderizando
    su contenido (Outlet).*/

import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ allowedRoles = [] }) {
  const { loading, isAuthenticated, role } = useAuth()

  if (loading) return <div>Cargando...</div>

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute