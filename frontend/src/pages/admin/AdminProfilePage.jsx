import { useRef,useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase.js'
import '../../assets/styles/profile.css'
import '../../assets/styles/mbti.css'

// Panel de administración (rol: admin)
// Accesos: Personajes, Categorías, Usuarios, Logout
function AdminProfilePage() {
  const { user, logout } = useAuth()
  const avatarUrl = useMemo(() => {
    const avatarPath = user?.avatar || 'default-avatar.jpg'

    const { data } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(avatarPath)

    return data.publicUrl
  }, [user?.avatar])


  return (
    <main>
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