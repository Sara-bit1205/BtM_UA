import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Panel de administración (rol: admin)
// Accesos: Personajes, Categorías, Usuarios, Logout
function AdminProfilePage() {
  const { logout } = useAuth()
  return (
    <main>
      <h1>Panel de Administración</h1>
      <nav>
        <Link to="/admin/personajes">Gestionar Personajes</Link>
        <Link to="/admin/categorias">Gestionar Categorías</Link>
        <Link to="/admin/usuarios">Listado de Usuarios</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </main>
  )
}

export default AdminProfilePage
