import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import mbtiService from '../../services/mbtiService'
import characterService from '../../services/characterService'
import '../../assets/styles/mbti.css'
import '../../assets/styles/home.css'

function getCharacterCoverUrl(coverPath) {
  if (!coverPath) return null
  const { data } = supabase.storage.from('character-covers').getPublicUrl(coverPath)
  return data.publicUrl
}

function MyMBTIPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [mbtiResult, setMbtiResult] = useState(null)
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingChars, setLoadingChars] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    let cancelled = false

    async function loadData() {
      try {
        setLoading(true)
        const results = await mbtiService.getMyResults()

        if (cancelled) return

        if (!results || results.length === 0) {
          navigate('/test-personalidad')
          return
        }

        const latest = results[0]
        setMbtiResult(latest)

        const mbtiCode = latest.mbti_types?.code
        if (!mbtiCode) return

        setLoadingChars(true)
        const chars = await characterService.getByMBTI(mbtiCode)
        if (!cancelled) {
          setCharacters(Array.isArray(chars) ? chars.slice(0, 8) : [])
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) {
          setLoading(false)
          setLoadingChars(false)
        }
      }
    }

    loadData()
    return () => { cancelled = true }
  }, [isAuthenticated, navigate])

  if (loading) {
    return (
      <main className="container py-4 mbti-page">
        <p className="text-center" style={{ opacity: 0.6, paddingTop: '3rem' }}>
          Cargando tu perfil MBTI…
        </p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="container py-4 mbti-page">
        <p className="text-center" style={{ color: 'var(--color3)', paddingTop: '3rem' }}>
          Ha ocurrido un error: {error}
        </p>
      </main>
    )
  }

  if (!mbtiResult) return null

  const mbtiCode = mbtiResult.mbti_types?.code ?? ''
  const mbtiName = mbtiResult.mbti_types?.title ?? mbtiCode
  const mbtiDesc = mbtiResult.mbti_types?.description ?? ''

  return (
    <main className="container py-4 mbti-page">
      {/* ── Type hero ── */}
      <section className="my-mbti-hero" aria-labelledby="my-mbti-title">
        <span className="mbti-type-badge" aria-label={`Tu tipo MBTI: ${mbtiCode}`}>
          {mbtiCode}
        </span>
        <h1 id="my-mbti-title" className="mbti-result-type-name">{mbtiName}</h1>
        <p className="mbti-result-description">{mbtiDesc}</p>

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
          Personajes {mbtiCode}
        </h2>

        {loadingChars ? (
          <p className="text-center" style={{ opacity: 0.6 }}>Cargando personajes…</p>
        ) : characters.length === 0 ? (
          <p className="text-center" style={{ opacity: 0.6 }}>
            No hay personajes registrados para este tipo todavía.
          </p>
        ) : (
          <div className="row g-3 mbti-char-grid">
            {characters.map((ch) => (
              <div className="col-6 col-sm-4 col-md-3" key={ch.id}>
                <div className="card mbti-char-card">
                  <Link className="nav-link" to={`/personaje/${ch.slug}`}>
                    <img
                      src={getCharacterCoverUrl(ch.cover_path)}
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
                        <p className="card-text mb-0 mbti-char-universe text-truncate">
                          {ch.universes?.name ?? ''}
                        </p>
                      </div>
                      <span className="badge rounded-pill mbti-char-badge">
                        {ch.mbti_types?.code ?? mbtiCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default MyMBTIPage
