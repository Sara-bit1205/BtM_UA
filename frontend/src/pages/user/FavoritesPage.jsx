import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../assets/styles/profile.css'
import '../../assets/styles/favorites.css'
import luffyImg from '../../assets/images/luffy.jpg'
import ascoImg from '../../assets/images/asco-intensamente-1.webp'
import captainAmericaImg from '../../assets/images/captainAmerica.jpg'
import remyImg from '../../assets/images/remy.jpg'
import stitchImg from '../../assets/images/stitch.jpg'
import elsaImg from '../../assets/images/elsa.png'

const mockFavorites = [
  {
    id: 'luffy',
    name: 'Luffy',
    image: luffyImg
  },
  {
    id: 'asco',
    name: 'Desagrado',
    image: ascoImg
  },
  {
    id: 'captain-america',
    name: 'Captain America',
    image: captainAmericaImg
  },
  {
    id: 'remy',
    name: 'Remy',
    image: remyImg
  },
  {
    id: 'stitch',
    name: 'Stitch',
    image: stitchImg
  },
  {
    id: 'elsa',
    name: 'Elsa',
    image: elsaImg
  }
]

// Página de favoritos del usuario (datos provisionales sin backend)
function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState(mockFavorites)

  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
  }

  return (
    <section className="profile-page favorites-page">
      <header className="favorites-header">
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
      </header>

      <section className="favorites-section" aria-live="polite">
        <div className="favorites-section__title">MIS FAVORITOS</div>

        <div className="favorites-grid">
          {favorites.map((fav) => (
            <article className="favorite-card" key={fav.id}>
              <button
                type="button"
                className="favorite-card__remove"
                aria-label={`Quitar ${fav.name} de favoritos`}
                onClick={() => handleRemove(fav.id)}
              >
                ×
              </button>

              <span className="favorite-card__like" aria-hidden="true">❤</span>

              <div className="favorite-card__avatar-wrapper">
                <img src={fav.image} alt={fav.name} className="favorite-card__avatar" />
              </div>
              <p className="favorite-card__name">{fav.name}</p>
            </article>
          ))}
        </div>

        {favorites.length === 0 && (
          <p className="favorites-empty">Aún no tienes personajes en favoritos.</p>
        )}
      </section>

      <div className="favorites-actions">
        <Link to="/perfil" className="favorites-back">
          ← Volver a mi perfil
        </Link>
        <p className="favorites-hint">Contenido y personajes de ejemplo; la conexión al backend se activará más adelante.</p>
      </div>
    </section>
  )
}

export default FavoritesPage
