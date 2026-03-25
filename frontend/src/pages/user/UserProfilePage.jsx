import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/profile.css'

// Panel de perfil del usuario (rol: user) con datos provisionales
function UserProfilePage() {
  const { user, logout } = useAuth()
  return (
    <section className="profile-page">
      <h1 className="profile-greeting">BUENOS DÍAS</h1>

      <article className="profile-card">
        <img
          className="profile-card__avatar"
          src={user.avatar}
          alt={`Avatar de ${user.name}`}
        />

        <div className="profile-card__body">
          <p className="profile-card__username">{user.username}</p>

          <dl className="profile-card__details" aria-label="Datos del perfil">
            <div className="profile-card__row">
              <dt>Nombre:</dt>
              <dd>{user.name}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Email:</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Contraseña:</dt>
              <dd>********</dd>
            </div>
            <div className="profile-card__row">
              <dt>Fecha de nacimiento:</dt>
              <dd>{user.birthDate || '—'}</dd>
            </div>
          </dl>
        </div>
      </article>

      <nav className="profile-actions" aria-label="Acciones del perfil">
        <Link className="profile-action" to="/perfil/favoritos">MIS FAVORITOS</Link>
        <Link className="profile-action" to="/perfil/editar">EDITAR MIS DATOS</Link>
        <Link className="profile-action" to="/perfil/mi-mbti">MI MBTI</Link>
        <button className="profile-action" type="button">MIS FOTOS SUBIDAS</button>
        <button className="profile-action" type="button" onClick={logout}>LOGOUT</button>
        <button className="profile-action profile-action--danger" type="button">DARSE DE BAJA</button>
      </nav>
    </section>
  )
}

export default UserProfilePage
