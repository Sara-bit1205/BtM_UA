import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { supabase } from '../../lib/supabase.js'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

// Panel de administración (rol: admin)
// Accesos: Personajes, Categorías, Usuarios, Logout
function AdminProfilePage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const logoutDialogRef = useRef(null)  //logoutDialogRef --> referencia al diálogo de confirmación de logout
  const [loadingLogout, setLoadingLogout] = useState(false)  //loadingLogout --> dice si se está procesando el logout (para deshabilitar botones y mostrar texto de "Cerrando sesión...")
    

  const avatarUrl = useMemo(() => {
    // console.log('AVATAR EN DB:', profile?.avatar)

    if (!profile?.avatar) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl('default-avatar.jpg')

      // console.log('DEFAULT URL:', data.publicUrl)
      return data.publicUrl
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(profile.avatar)

    // console.log('AVATAR URL GENERADA:', data.publicUrl)

    return data.publicUrl
  }, [profile?.avatar])

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
      resetTheme()
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
    <main>
      <section className="profile-page">
            <h1 className="profile-greeting">{saludoNombre}</h1>
      
            <article className="profile-card">
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

            </dl>
          </div>
        </article>

        <nav className="profile-actions" aria-label="Acciones del perfil administrador">
          <Link className="profile-action" to="/admin/lista-personajes">
            Listado de Personajes
          </Link>
          <Link className="profile-action" to="/admin/categorias">
            Listado de Categorías
          </Link>
          <Link className="profile-action" to="/admin/usuarios">
            Listado de Usuarios
          </Link>
          <button className="profile-action profile-action--danger" type="button" onClick={openLogoutDialog}>LOGOUT</button>
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

      </section>
    </main>
  )
}

export default AdminProfilePage