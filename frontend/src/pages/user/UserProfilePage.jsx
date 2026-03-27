import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

// Panel de perfil del usuario (rol: user) con datos provisionales
function UserProfilePage() {
  const { user, logout } = useAuth()
  const dialogRef = useRef(null)

  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => dialogRef.current?.close()

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

      {/* ── MBTI invite dialog (se abre automáticamente si no tiene tipo MBTI) ── */}
      <dialog
        ref={dialogRef}
        className="mbti-invite-dialog"
        aria-labelledby="mbti-dialog-title"
        aria-describedby="mbti-dialog-desc"
        onClose={closeDialog}
      >
        <button
          className="mbti-invite-banner__close"
          onClick={closeDialog}
          aria-label="Cerrar"
          type="button"
        >
          ✕
        </button>
        <h2 id="mbti-dialog-title">¿Conoces tu tipo de personalidad?</h2>
        <p id="mbti-dialog-desc">
          Completa el test MBTI y descubre qué personajes comparten tu forma de ser.
          ¡Solo son 10 preguntas!
        </p>
        <div className="mbti-invite-banner__actions">
          <Link className="mbti-btn-primary" to="/test-personalidad" onClick={closeDialog}>
            Hacer el test
          </Link>
          <Link className="mbti-btn-secondary" to="/tipos-personalidad" onClick={closeDialog}>
            Ver los 16 tipos
          </Link>
        </div>
      </dialog>

      <nav className="profile-actions" aria-label="Acciones del perfil">
        <Link className="profile-action" to="/perfil/favoritos">MIS FAVORITOS</Link>
        <Link className="profile-action" to="/perfil/editar">EDITAR MIS DATOS</Link>
        <button className="profile-action" type="button" onClick={openDialog}>MI MBTI</button>
        <button className="profile-action" type="button">MIS FOTOS SUBIDAS</button>
        <button className="profile-action" type="button" onClick={logout}>LOGOUT</button>
        <button className="profile-action profile-action--danger" type="button">DARSE DE BAJA</button>
      </nav>
    </section>
  )
}

export default UserProfilePage
