/*La nueva versión de UserProfilePage toma los datos del profile cargado
 por AuthContext, muestra la información del usuario y, en vez de borrar 
 una cuenta desde una tabla inexistente, usa el servicio de usuario para 
 darla de baja de forma segura marcando is_active = false y cerrando 
 sesión después.*/

//MIGRADO

import { useRef, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase.js'
import userService from '../../services/userService'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

function UserProfilePage() {
  // de useAuth() --> sacamos profile y logout
  const { profile, logout } = useAuth()
  //sirve para hacer cosas como --> navigate('/') y así mandar al usuario a otras páginas
  const navigate = useNavigate()
  //Se guardan las referencias a cada <dialog> para poder abrirlos y cerrarlos desde JS
  const dialogRef = useRef(null)

  //Estados...
  const unsubscribeDialogRef = useRef(null)  
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)  //isUnsubscrived --> dice si ya se ha dado de baja
  const [loadingUnsubscribe, setLoadingUnsubscribe] = useState(false)  //loadingUnsubscribe --> dice si se está procesando la baja (para deshabilitar botones y mostrar texto de "Procesando...")
  const logoutDialogRef = useRef(null)  //logoutDialogRef --> referencia al diálogo de confirmación de logout
  const [loadingLogout, setLoadingLogout] = useState(false)  //loadingLogout --> dice si se está procesando el logout (para deshabilitar botones y mostrar texto de "Cerrando sesión...")
  

  //Si usuario no tiene foto de perfil --> se le da el default-avatar y si sí tiene se pone su profile.avatar
  //useMemo se usa para memorizar el resultado de la función que genera la URL del avatar, y solo recalcularla cuando profile?.avatar cambie. Así evitamos llamadas innecesarias a supabase.storage cada vez que se renderiza el componente.
  const avatarUrl = useMemo(() => {
    console.log('AVATAR EN DB:', profile?.avatar)

    if (!profile?.avatar) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl('default-avatar.jpg')

      console.log('DEFAULT URL:', data.publicUrl)
      return data.publicUrl
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(profile.avatar)

    console.log('AVATAR URL GENERADA:', data.publicUrl)

    return data.publicUrl
  }, [profile?.avatar])


  const openDialog = () => dialogRef.current?.showModal() //abre el <dialog>
  const closeDialog = () => dialogRef.current?.close() // lo cierra

  //cuando pulsa darse de baja --> inUnsuscribe = false y abre el popup
  const openUnsubscribe = () => {
    setIsUnsubscribed(false)
    unsubscribeDialogRef.current?.showModal()
  }

  //Cuando confirma que quiere darse de baja --> se llama a userService.deleteAccount() que marca is_active = false en la base de datos, y luego se muestra un mensaje de "Ha sido dado de baja correctamente..." y un botón para salir que cierra el popup y redirige a la página principal. Si hay error, se muestra una alerta.
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

  //Cuando usuario pulsa Salir del darse de baja --> se cierra el popup y se redirige a la página principal
  const handleFinalExit = async () => {
    unsubscribeDialogRef.current?.close()
    navigate('/')
  }

  const openLogoutDialog = () => logoutDialogRef.current?.showModal() //abre el popup de confirmación de logout
  const closeLogoutDialog = () => {
    if (!loadingLogout) logoutDialogRef.current?.close() //cierra el popup de confirmación de logout (solo si no se está procesando el logout, para evitar que el usuario cierre el popup mientras se está cerrando sesión)
  }

  //Confirmamos logout
  //activa loading, llama a logout(), manda al usuario a / (pag principal), si falla muestra error y quita el logout al final
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

    if (hora >= 6 && hora < 13){
      return 'BUENOS DÍAS' 
    } else if (hora >= 13 && hora < 21) {
      return 'BUENAS TARDES'
    } else {
      return 'BUENAS NOCHES'
    }
  })

  const saludoNombre = `${saludo}, ${profile?.username || 'usuario'}`

  //Si aún no hay datos del usuario, enseñas “Cargando perfil...”.
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
        {/* si url correcta muestra la imagen, si no muestra el avatar por defecto */}
        <img
          className="profile-card__avatar"
          src={avatarUrl}
          alt={`Avatar de ${profile?.name || 'usuario'}`}
          onError={(e) => {
            const { data } = supabase.storage.from('avatars').getPublicUrl('default-avatar.jpg')
            e.currentTarget.src = data.publicUrl
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
        <Link className="profile-action" to="/perfil/favoritos">MIS FAVORITOS</Link>
        <Link className="profile-action" to="/perfil/editar">EDITAR MIS DATOS</Link>
        <button className="profile-action" type="button" onClick={openDialog}>MI MBTI</button>
        <button className="profile-action" type="button">MIS FOTOS SUBIDAS</button>
        <button className="profile-action" type="button" onClick={openLogoutDialog}>LOGOUT</button>
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