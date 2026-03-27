// TODO: reemplazar datos locales por datos reales del usuario y la API
// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'
// import characterService from '../../services/characterService'

import { Link } from 'react-router-dom'
import '../../assets/styles/mbti.css'
import '../../assets/styles/home.css'

// ── Datos locales de prototipo ──────────────────────────────────────────────
const PROTOTYPE_MBTI_TYPE = 'INFJ'
const PROTOTYPE_MBTI_INFO = {
  name: 'El Consejero',
  desc: 'Idealista, empático y principista. Los INFJ tienen una visión profunda de la naturaleza humana y actúan para hacer el bien. Son raros pero profundamente comprometidos con sus valores.',
}
const PROTOTYPE_CHARACTERS = [
  {
    _id: '1',
    name: 'Galadriel',
    universe: 'El Señor de los Anillos',
    mbtiType: 'INFJ',
    image: 'https://placehold.co/300x400/1a1a2e/cff199?text=Galadriel',
    slug: 'galadriel',
  },
  {
    _id: '2',
    name: 'Aramis',
    universe: 'Los Tres Mosqueteros',
    mbtiType: 'INFJ',
    image: 'https://placehold.co/300x400/1a1a2e/cff199?text=Aramis',
    slug: 'aramis',
  },
  {
    _id: '3',
    name: 'Remus Lupin',
    universe: 'Harry Potter',
    mbtiType: 'INFJ',
    image: 'https://placehold.co/300x400/1a1a2e/cff199?text=Lupin',
    slug: 'remus-lupin',
  },
  {
    _id: '4',
    name: 'Will Graham',
    universe: 'Hannibal',
    mbtiType: 'INFJ',
    image: 'https://placehold.co/300x400/1a1a2e/cff199?text=Will+Graham',
    slug: 'will-graham',
  },
]
// ───────────────────────────────────────────────────────────────────────────

// Página Mi MBTI (PROTOTIPO):
// - Muestra datos locales para visualizar el diseño final de la página
// ── Lógica real (comentada) ──────────────────────────────────────────────
// function MyMBTIPage() {
//   const { user } = useAuth()
//   const navigate = useNavigate()
//   const [characters, setCharacters] = useState([])
//   const [loading, setLoading] = useState(false)
//
//   const mbtiType = user?.mbtiType
//   const info = mbtiType ? (MBTI_INFO[mbtiType] ?? { name: mbtiType, desc: '' }) : null
//
//   useEffect(() => {
//     // Verificación: si el usuario no tiene MBTI, redirigir al test
//     // if (!mbtiType) {
//     //   navigate('/test-personalidad')
//     //   return
//     // }
//
//     if (!mbtiType) return
//
//     setLoading(true)
//     characterService.getByMBTI(mbtiType)
//       .then((data) => setCharacters(Array.isArray(data) ? data.slice(0, 8) : []))
//       .catch(() => setCharacters([]))
//       .finally(() => setLoading(false))
//   }, [mbtiType, navigate])
// }
// ────────────────────────────────────────────────────────────────────────────

function MyMBTIPage() {
  const mbtiType = PROTOTYPE_MBTI_TYPE
  const info = PROTOTYPE_MBTI_INFO
  const characters = PROTOTYPE_CHARACTERS

  return (
    <main className="container py-4 mbti-page">
      {/* ── Type hero ── */}
      <section className="my-mbti-hero" aria-labelledby="my-mbti-title">
        <span className="mbti-type-badge" aria-label={`Tu tipo MBTI: ${mbtiType}`}>
          {mbtiType}
        </span>
        <h1 id="my-mbti-title" className="mbti-result-type-name">{info.name}</h1>
        <p className="mbti-result-description">{info.desc}</p>

        <div className="my-mbti-actions">
          <Link className="mbti-btn-secondary" to="/test-personalidad">
            Repetir el test
          </Link>
          <Link className="mbti-btn-primary" to="/tipos-personalidad">
            Explorar los 16 tipos
          </Link>
        </div>
      </section>

      {/* ── Related characters ── */}
      <section className="mbti-characters-section" aria-labelledby="chars-title">
        <h2 id="chars-title" className="mbti-section-subtitle">
          Personajes {mbtiType}
        </h2>

        <div className="row g-3 mbti-char-grid">
          {characters.map((ch) => (
            <div className="col-6 col-sm-4 col-md-3" key={ch._id}>
              <div className="card mbti-char-card">
                <Link className="nav-link" to={`/personaje/${ch.slug}`}>
                  <img
                    src={ch.image}
                    className="mbti-char-img"
                    alt={ch.name}
                  />
                </Link>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div style={{ minWidth: 0 }}>
                      <Link className="nav-link" to={`/personaje/${ch.slug}`}>
                        <h3 className="card-title mbti-char-name text-truncate">{ch.name}</h3>
                      </Link>
                      <Link className="nav-link" to="/tipos-personalidad">
                        <p className="card-text mb-0 mbti-char-universe text-truncate">{ch.universe}</p>
                      </Link>
                    </div>
                    <Link className="nav-link" to="/tipos-personalidad">
                      <span className="badge rounded-pill mbti-char-badge">{ch.mbtiType}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default MyMBTIPage
