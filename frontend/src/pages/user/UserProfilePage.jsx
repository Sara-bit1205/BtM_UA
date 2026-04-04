/* La nueva versión de UserProfilePage toma los datos del profile cargado
 por AuthContext, muestra la información del usuario y, en vez de borrar
 una cuenta desde una tabla inexistente, usa el servicio de usuario para
 darla de baja de forma segura marcando is_active = false y cerrando
 sesión después. */

//HECHO

import { useRef, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase.js'
import userService from '../../services/userService'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

const DEFAULT_AVATAR = 'default-avatar.jpg'

function getAvatarFile(profile) {
  return profile?.avatar_path || profile?.avatar || DEFAULT_AVATAR
}

function getAvatarPublicUrl(filePath) {
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}

function UserProfilePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const dialogRef = useRef(null)
  const unsubscribeDialogRef = useRef(null)
  const logoutDialogRef = useRef(null)

  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)

  const avatarUrl = useMemo(() => {
    const avatarFile = getAvatarFile(profile)

    console.log('avatar_path:', profile?.avatar_path)
    console.log('avatar:', profile?.avatar)
    console.log('avatar final usado:', avatarFile)

    return getAvatarPublicUrl(avatarFile)
  }, [profile?.avatar_path, profile?.avatar])

  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => dialogRef.current?.close()

  const openUnsubscribe = () => {
    setIsUnsubscribed(false)
    unsubscribeDialogRef.current?.showModal()
  }

  const handleConfirmBaja = async () => {
    try {
      setLoadingUnsubscribe(true)
      await userService.deleteAccount()
      setIsUnsubscribed(true)
    } catch (error) {
      console.error('Error al dar de baja:', error.message)
      alert('No hemos podido procesar la baja. Inténtalo de nuevo.')
    } finally {
      setLoadingUnsubscribe(false)
    }
  }

  const handleFinalExit = async () => {
    unsubscribeDialogRef.current?.close()
    navigate('/')
  }

  const openLogoutDialog = () => logoutDialogRef.current?.showModal()

  const closeLogoutDialog = () => {
    if (!loadingLogout) logoutDialogRef.current?.close()
  }

  const handleConfirmLogout = async () => {
    try {
      setLoadingLogout(true)
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message)
      alert('No hemos podido procesar el cierre de sesión. Inténtalo de nuevo.')
    } finally {
      setLoadingLogout(false)
    }
  }

  const saludo = useMemo(() => {
    const hora = new Date().getHours()

    if (hora >= 6 && hora < 13) return 'BUENOS DÍAS'
    if (hora >= 13 && hora < 21) return 'BUENAS TARDES'
    return 'BUENAS NOCHES'
  }, [])

  const saludoNombre = `${saludo}, ${profile?.username || 'usuario'}`

  if (!profile) {
    return (
      <section className="profile-page">
        <p>Cargando perfil...</p>
      </section>
    )
  }


  return (
    <section className="profile-page">
      <h1 className="profile-greeting">{saludoNombre}</h1>

      <article className="profile-card">
        <img
          className="profile-card__avatar"
          src={avatarUrl}
          alt={`Avatar de ${profile?.name || 'usuario'}`}
          onError={(e) => {
            e.currentTarget.src = getAvatarPublicUrl(DEFAULT_AVATAR)
          }}
        />

        <div className="profile-card__body">
          <p className="profile-card__username">{profile.username}</p>

          <dl className="profile-card__details" aria-label="Datos del perfil">
            <div className="profile-card__row">
              <dt>Nombre:</dt>
              <dd>{profile.name || '—'}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Email:</dt>
              <dd>{profile.email || '—'}</dd>
            </div>
            <div className="profile-card__row">
              <dt>Contraseña:</dt>
              <dd>*************</dd>
            </div>
            <div className="profile-card__row">
              <dt>Fecha de nacimiento:</dt>
              <dd>{profile.birth_date || '—'}</dd>
            </div>
          </dl>
        </div>
      </article>

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
        <Link className="profile-action" to="/perfil/favoritos">
          MIS FAVORITOS
        </Link>

        <Link className="profile-action" to="/perfil/editar">
          EDITAR MIS DATOS
        </Link>

        <button className="profile-action" type="button" onClick={openDialog}>
          MI MBTI
        </button>

        <button className="profile-action" type="button">
          MIS FOTOS SUBIDAS
        </button>

        <button className="profile-action" type="button" onClick={openLogoutDialog}>
          LOGOUT
        </button>

        <button
          className="profile-action profile-action--danger"
          type="button"
          onClick={openUnsubscribe}
        >
          DARSE DE BAJA
        </button>
      </nav>

      <dialog ref={logoutDialogRef} className="mbti-invite-dialog modal-baja-personalizado">
        <div className="modal-baja-content">
          <h2 className="modal-baja-titulo">¿SEGURO QUE QUIERES CERRAR SESIÓN?</h2>

          <div className="modal-baja-acciones">
            <button
              className="btn-confirm"
              onClick={handleConfirmLogout}
              disabled={loadingLogout}
            >
              {loadingLogout ? 'CERRANDO SESIÓN...' : 'ACEPTAR'}
            </button>

            <button
              className="btn-cancel"
              onClick={closeLogoutDialog}
              disabled={loadingLogout}
            >
              CANCELAR
            </button>
          </div>
        </div>
      </dialog>

      <dialog ref={unsubscribeDialogRef} className="mbti-invite-dialog modal-baja-personalizado">
        <div className="modal-baja-content">
          {!isUnsubscribed ? (
            <>
              <h2 className="modal-baja-titulo">¿SEGURO QUE QUIERES DARTE DE BAJA?</h2>

              <div className="modal-baja-acciones">
                <button
                  className="btn-confirm"
                  onClick={handleConfirmBaja}
                  disabled={loadingUnsubscribe}
                >
                  {loadingUnsubscribe ? 'PROCESANDO...' : 'ACEPTAR'}
                </button>

                <button
                  className="btn-cancel"
                  onClick={() => unsubscribeDialogRef.current?.close()}
                  disabled={loadingUnsubscribe}
                >
                  CANCELAR
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="modal-baja-titulo">
                HA SIDO DADO DE BAJA CORRECTAMENTE, SERÁ REDIRIGIDO A LA PÁGINA PRINCIPAL
              </h2>

              <button className="btn-confirm" onClick={handleFinalExit}>
                SALIR
              </button>
            </>
          )}
        </div>
      </dialog>
    </section>
  )
}

export default UserProfilePage