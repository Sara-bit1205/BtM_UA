//HECHO 

import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
// import { supabase } from '../../lib/supabase'
import favoritesService from '../../services/favoritesService'
import { getAvatarUrl } from '../../lib/storage'
import '../../assets/styles/profile.css'
import '../../assets/styles/favorites.css'


function FavoritesPage() {
  const { profile } = useAuth()

  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const avatarUrl = useMemo(() => {
    return getAvatarUrl(profile?.avatar_path)
  }, [profile?.avatar_path])

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await favoritesService.getFavorites()
        setFavorites(data)
      } catch (error) {
        console.error('Error cargando favoritos:', error.message)
        setError('No se pudieron cargar los favoritos')
        setFavorites([])
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const handleRemove = async (characterId) => {
    try {
      await favoritesService.removeFavorite(characterId)

      setFavorites((prev) =>
        prev.filter((fav) => fav.characterId !== characterId)
      )
    } catch (error) {
      console.error('Error eliminando favorito:', error.message)
      setError('No se pudo eliminar el favorito')
    }
  }

  return (
    <section className="profile-page favorites-page">
      <header className="favorites-header">
        <article className="profile-card">
          <img
            className="profile-card__avatar"
            src={avatarUrl}
            alt={`Avatar de ${profile?.name || 'usuario'}`}
            onError={(e) => {
              e.currentTarget.src = getAvatarUrl()
            }}
          />

          <div className="profile-card__body">
            <p className="profile-card__username">{profile?.username || 'Usuario'}</p>

            <dl className="profile-card__details" aria-label="Datos del perfil">
              <div className="profile-card__row">
                <dt>Nombre:</dt>
                <dd>{profile?.name || '—'}</dd>
              </div>
              <div className="profile-card__row">
                <dt>Email:</dt>
                <dd>{profile?.email || '—'}</dd>
              </div>
              <div className="profile-card__row">
                <dt>Contraseña:</dt>
                <dd>********</dd>
              </div>
              <div className="profile-card__row">
                <dt>Fecha de nacimiento:</dt>
                <dd>{profile?.birth_date || '—'}</dd>
              </div>
            </dl>
          </div>
        </article>
      </header>

      <section className="favorites-section" aria-live="polite">
        <div className="favorites-section__title">MIS FAVORITOS</div>

        {loading ? (
          <p className="favorites-empty">Cargando favoritos...</p>
        ) : error ? (
          <p className="favorites-empty">{error}</p>
        ) : favorites.length === 0 ? (
          <p className="favorites-empty">Aún no tienes personajes en favoritos.</p>
        ) : (
          <div className="favorites-grid">
            {favorites.map((fav) => (
              <article className="favorite-card" key={fav.favoriteId}>
                <button
                  type="button"
                  className="favorite-card__remove"
                  aria-label={`Quitar ${fav.name} de favoritos`}
                  onClick={() => handleRemove(fav.characterId)}
                >
                  ×
                </button>

                <span className="favorite-card__like" aria-hidden="true">❤</span>

                <Link to={`/personaje/${fav.slug}`} className="favorite-card__avatar-wrapper">
                  {fav.image && (
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="favorite-card__avatar"
                    />
                  )}
                </Link>

                <p className="favorite-card__name">{fav.name}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="favorites-actions">
        <Link to="/perfil" className="favorites-back">
          ← Volver a mi perfil
        </Link>
      </div>
    </section>
  )
}

export default FavoritesPage