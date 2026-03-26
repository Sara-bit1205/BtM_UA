import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/profile.css'

// Panel de administración (rol: admin)
// Accesos: Personajes, Categorías, Usuarios, Logout
function AdminProfilePage() {
  const { user, logout } = useAuth()

  return (
    <main>
      <section className="profile-page">
        <h1 className="profile-greeting">BUENOS DÍAS</h1>

        <article className="profile-card">
          <img
            className="profile-card__avatar"
            src={user?.avatar || '/default-avatar.png'}
            alt={`Avatar de ${user?.name || 'admin'}`}
          />
          <div className="profile-card__body">
            <p className="profile-card__username">{user?.username}</p>

            <dl className="profile-card__details" aria-label="Datos del perfil">
              <div className="profile-card__row">
                <dt>Nombre:</dt>
                <dd>{user?.name || '—'}</dd>
              </div>
              <div className="profile-card__row">
                <dt>Email:</dt>
                <dd>{user?.email || '—'}</dd>
              </div>
              <div className="profile-card__row">
                <dt>Contraseña:</dt>
                <dd>********</dd>
              </div>
              <div className="profile-card__row">
                <dt>Fecha de nacimiento:</dt>
                <dd>{user?.birthDate || user?.birth_date || '—'}</dd>
              </div>
            </dl>
          </div>
        </article>

        <nav className="profile-actions" aria-label="Acciones del perfil administrador">
          <Link className="profile-action" to="/admin/personajes">Listado de Personajes</Link>
          <Link className="profile-action" to="/admin/categorias">Listado de Categorías</Link>
          <Link className="profile-action" to="/admin/usuarios">Listado de Usuarios</Link>
          <button className="profile-action" onClick={logout}>Logout</button>
        </nav>
      </section>
    </main>
  )
}

export default AdminProfilePage