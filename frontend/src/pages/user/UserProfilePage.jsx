import { useRef,useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase.js'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

function UserProfilePage() {
  const { user, logout } = useAuth()
  const dialogRef = useRef(null)
  const unsubscribeDialogRef = useRef(null)
  const [isUnsubscribed, setIsUnsubscribed] = useState(false)
  const avatarUrl = useMemo(() => {
    const avatarPath = user?.avatar || 'default-avatar.jpg'

    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(avatarPath)

    return data.publicUrl
  }, [user?.avatar])

  const openDialog = () => dialogRef.current?.showModal()
  const closeDialog = () => dialogRef.current?.close()

  const openUnsubscribe = () => {
    setIsUnsubscribed(false) // Resetear al primer paso
    unsubscribeDialogRef.current?.showModal()
  }
  
  const handleConfirmBaja = async () => {
    try {
      const { error } = await supabase
        .from('users') 
        .delete()
        .eq('id', user.id);

      if (error) throw error;

      // Si todo va bien, mostramos el mensaje de éxito en el modal
      setIsUnsubscribed(true);
      
    } catch (error) {
      console.error("Error al dar de baja:", error.message);
      alert("No hemos podido procesar la baja. Inténtalo de nuevo.");
    }
  };

  const handleFinalExit = () => {
    unsubscribeDialogRef.current?.close()
    logout() // Redirige al inicio
  }

  return (
    <section className="profile-page">
      <h1 className="profile-greeting">BUENOS DÍAS</h1>

      <article className="profile-card">
        <img
          className="profile-card__avatar"
          src={avatarUrl}
          alt={`Avatar de ${user?.name || 'usuario'}`}
          onError={(e) => {
            const { data } = supabase
              .storage
              .from('avatars')
              .getPublicUrl('default-avatar.jpg')

            e.currentTarget.src = data.publicUrl
          }}
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
              <dd>*************</dd>
            </div>
            <div className="profile-card__row">
              <dt>Fecha de nacimiento:</dt>
              <dd>{user.birth_date || '—'}</dd>
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
         <button className="profile-action" type="button" onClick={logout}>LOGOUT</button> 
        <button className="profile-action profile-action--danger" type="button" onClick={() => {
            setIsUnsubscribed(false); 
            unsubscribeDialogRef.current?.showModal();
          }}>DARSE DE BAJA</button> 
      </nav>

     
      <dialog ref={unsubscribeDialogRef} className="mbti-invite-dialog modal-baja-personalizado">
        <div className="modal-baja-content">
          {!isUnsubscribed ? (
            <>
              <h2 className="modal-baja-titulo">¿SEGURO QUE QUIERES DARTE DE BAJA?</h2>
              <div className="modal-baja-acciones">
                <button className="btn-confirm" onClick={handleConfirmBaja}>
                  ACEPTAR
                </button>
                <button className="btn-cancel" onClick={() => unsubscribeDialogRef.current?.close()}>
                  CANCELAR
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="modal-baja-titulo">
                HA SIDO DADO DE BAJA CORRECTAMENTE, SERÁ REDIRIGIDO A LA PÁGINA PRINCIPAL
              </h2>
              <button className="btn-confirm" onClick={logout}>
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