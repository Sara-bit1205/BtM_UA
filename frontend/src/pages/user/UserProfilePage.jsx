import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Panel de perfil del usuario (rol: user)
// Accesos: Favoritos, Editar Mis Datos, Mi MBTI, Logout, Darse de Baja
function UserProfilePage() {
  const { user, logout } = useAuth()
  return (
    <main>
      <h1>Hola, {user?.username}</h1>
      <nav>
        <Link to="/perfil/favoritos">Mis Favoritos</Link>
        <Link to="/perfil/editar">Editar Mis Datos</Link>
        <Link to="/perfil/mi-mbti">Mi MBTI</Link>
        <button onClick={logout}>Logout</button>
      </nav>
    </main>
  )
}

export default UserProfilePage
