import { useState } from 'react'
import { Link } from 'react-router-dom'
// import { supabase } from '../../lib/supabase'
import { getPublicUrl, STORAGE_BUCKETS } from '../../lib/storage'
import { useAuth } from '../../context/AuthContext'
import characterService from '../../services/characterService'
import mbtiService from '../../services/mbtiService'
import '../../assets/styles/mbti.css'
import '../../assets/styles/home.css'

// function getCharacterCoverUrl(coverPath) {
//   if (!coverPath) return null
//   const { data } = supabase.storage.from('character-covers').getPublicUrl(coverPath)
//   return data.publicUrl
// }

// ── Static test data ────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1, dimension: 'EI',
    text: '¿Cómo prefieres recargar energías después de un día agotador?',
    options: [
      { label: 'Saliendo con amigos o haciendo planes sociales', value: 'E' },
      { label: 'Pasando tiempo solo/a en calma y tranquilidad', value: 'I' },
    ],
  },
  {
    id: 2, dimension: 'EI',
    text: 'Al conocer a alguien nuevo, normalmente...',
    options: [
      { label: 'Tomo la iniciativa y me presento sin dudar', value: 'E' },
      { label: 'Espero a que me hablen primero o actúo con cautela', value: 'I' },
    ],
  },
  {
    id: 3, dimension: 'SN',
    text: 'Al aprender algo nuevo, prefieres...',
    options: [
      { label: 'Ejemplos concretos y pasos detallados', value: 'S' },
      { label: 'Entender el concepto global antes que los detalles', value: 'N' },
    ],
  },
  {
    id: 4, dimension: 'SN',
    text: '¿En qué confías más?',
    options: [
      { label: 'La experiencia práctica y lo que ya ha funcionado', value: 'S' },
      { label: 'La intuición y las nuevas posibilidades', value: 'N' },
    ],
  },
  {
    id: 5, dimension: 'SN',
    text: 'Cuando describes algo a otra persona...',
    options: [
      { label: 'Usas detalles específicos y hechos concretos', value: 'S' },
      { label: 'Usas metáforas y hablas de ideas generales', value: 'N' },
    ],
  },
  {
    id: 6, dimension: 'TF',
    text: 'Al tomar una decisión difícil, priorizas...',
    options: [
      { label: 'La lógica y lo que es objetivamente correcto', value: 'T' },
      { label: 'El impacto emocional en las personas implicadas', value: 'F' },
    ],
  },
  {
    id: 7, dimension: 'TF',
    text: 'En un conflicto entre personas cercanas...',
    options: [
      { label: 'Buscas la solución más eficiente y justa', value: 'T' },
      { label: 'Intentas que todos se sientan escuchados y bien', value: 'F' },
    ],
  },
  {
    id: 8, dimension: 'JP',
    text: '¿Cómo tienes organizado tu espacio de trabajo o habitación?',
    options: [
      { label: 'Con todo en su sitio, ordenado y planificado', value: 'J' },
      { label: 'Algo caótico, pero sé dónde está cada cosa', value: 'P' },
    ],
  },
  {
    id: 9, dimension: 'JP',
    text: 'Ante un proyecto largo...',
    options: [
      { label: 'Me hago un plan y lo sigo paso a paso', value: 'J' },
      { label: 'Prefiero improvisar según van llegando las ideas', value: 'P' },
    ],
  },
  {
    id: 10, dimension: 'JP',
    text: 'Las fechas límite las ves como...',
    options: [
      { label: 'Algo que hay que cumplir siempre, sin excusas', value: 'J' },
      { label: 'Una orientación: siempre hay margen de flexibilidad', value: 'P' },
    ],
  },
]

const MBTI_INFO = {
  INTJ: { name: 'El Arquitecto',    desc: 'Estratégico, independiente y determinado. Los INTJ tienen una visión clara del futuro y trabajan metódicamente para alcanzar sus objetivos.' },
  INTP: { name: 'El Pensador',      desc: 'Analítico, original y reservado. Los INTP buscan la verdad lógica en todo y disfrutan explorando teorías e ideas abstractas.' },
  ENTJ: { name: 'El Comandante',    desc: 'Audaz, imaginativo y con fuerte voluntad. Los ENTJ son líderes naturales que planifican el camino hacia el éxito colectivo.' },
  ENTP: { name: 'El Debatiente',    desc: 'Inteligente, curioso y atrevido. Los ENTP disfrutan del debate intelectual y siempre buscan nuevos enfoques a los problemas.' },
  INFJ: { name: 'El Consejero',     desc: 'Idealista, empático y principista. Los INFJ tienen una visión profunda de la naturaleza humana y actúan para hacer el bien.' },
  INFP: { name: 'El Mediador',      desc: 'Poético, amable y altruista. Los INFP están siempre listos para apoyar una buena causa y defender sus valores más profundos.' },
  ENFJ: { name: 'El Protagonista',  desc: 'Carismático, empático y líder inspirador. Los ENFJ ven el potencial en los demás y les ayudan a crecer con genuina dedicación.' },
  ENFP: { name: 'El Activista',     desc: 'Entusiasta, creativo y sociable. Los ENFP ven la vida como un tapiz lleno de posibilidades y conexiones inesperadas.' },
  ISTJ: { name: 'El Logístico',     desc: 'Práctico, fiable y metódico. Los ISTJ son el pilar de cualquier organización, cumpliendo sus compromisos con precisión.' },
  ISFJ: { name: 'El Defensor',      desc: 'Dedicado, cálido y protector. Los ISFJ están siempre dispuestos a defender a quienes aman con perseverancia silenciosa.' },
  ESTJ: { name: 'El Ejecutivo',     desc: 'Organizado, leal y decidido. Los ESTJ son maestros en gestionar personas y recursos para que todo funcione bien.' },
  ESFJ: { name: 'El Cónsul',        desc: 'Cariñoso, social y popular. Los ESFJ son muy atentos a las necesidades de los demás y disfrutan creando un ambiente armonioso.' },
  ISTP: { name: 'El Virtuoso',      desc: 'Curioso y práctico, los ISTP exploran ideas y resuelven problemas con sus propias manos de forma ingeniosa y directa.' },
  ISFP: { name: 'El Aventurero',    desc: 'Flexible, encantador y artístico. Los ISFP buscan siempre nuevas experiencias para explorar la vida sensorialmente.' },
  ESTP: { name: 'El Empresario',    desc: 'Enérgico, perceptivo y directo. Los ESTP viven en el presente y prosperan en situaciones que exigen acción inmediata.' },
  ESFP: { name: 'El Animador',      desc: 'Espontáneo, entusiasta y sociable. Los ESFP son el alma de cualquier lugar, convirtiendo cada momento en una celebración.' },
}

// ── MBTI calculation ────────────────────────────────────────
function calculateMBTI(answers) {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  answers.forEach((v) => { counts[v]++ })
  return (
    (counts.E >= counts.I ? 'E' : 'I') +
    (counts.S >= counts.N ? 'S' : 'N') +
    (counts.T >= counts.F ? 'T' : 'F') +
    (counts.J >= counts.P ? 'J' : 'P')
  )
}

// ── Sub-components ───────────────────────────────────────────
function Intro({ onStart }) {
  return (
    <section className="mbti-intro-card" aria-labelledby="intro-title">
      <h1 id="intro-title" className="mbti-section-title">Test de Personalidad</h1>
      <p>
        El test MBTI (Myers-Briggs Type Indicator) clasifica la personalidad en 16 tipos basados
        en cuatro dimensiones: <strong>Energía</strong>, <strong>Percepción</strong>,{' '}
        <strong>Decisión</strong> y <strong>Estilo de vida</strong>.
      </p>
      <p>
        Responde <strong>10 preguntas</strong> con sinceridad — no hay respuestas correctas ni
        incorrectas. Al finalizar, descubrirás tu tipo y los personajes con los que compartes
        personalidad.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="mbti-btn-primary" onClick={onStart}>
          Empezar Test
        </button>
        <Link className="mbti-btn-secondary" to="/tipos-personalidad">
          Ver los 16 tipos
        </Link>
      </div>
    </section>
  )
}

function Question({ question, index, total, onAnswer }) {
  const pct = Math.round((index / total) * 100)
  return (
    <section aria-labelledby={`question-${question.id}`}>
      <div className="mbti-progress-wrap" aria-hidden="true">
        <div
          className="mbti-progress-bar"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Pregunta ${index + 1} de ${total}`}
        >
          <div className="mbti-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="mbti-progress-label">{index + 1} / {total}</span>
      </div>

      <div className="mbti-question-card" key={question.id}>
        <p id={`question-${question.id}`} className="mbti-question-text">
          {question.text}
        </p>
        <div className="mbti-options" role="list">
          {question.options.map((opt) => (
            <button
              key={opt.value}
              className="mbti-option"
              onClick={() => onAnswer(opt.value)}
              role="listitem"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

function Result({ mbtiType, characters, loadingChars, onRetake }) {
  const info = MBTI_INFO[mbtiType] ?? { name: mbtiType, desc: '' }

  return (
    <>
      <section className="mbti-result-hero" aria-labelledby="result-title">
        <span className="mbti-type-badge" aria-label={`Tipo MBTI: ${mbtiType}`}>
          {mbtiType}
        </span>
        <p id="result-title" className="mbti-result-type-name">{info.name}</p>
        <p className="mbti-result-description">{info.desc}</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button className="mbti-btn-secondary" onClick={onRetake}>
            Repetir test
          </button>
          <Link className="mbti-btn-primary" to="/tipos-personalidad">
            Explorar los 16 tipos
          </Link>
        </div>
      </section>

      <section className="mbti-characters-section" aria-labelledby="chars-title">
        <h2 id="chars-title" className="mbti-section-subtitle">
          Personajes {mbtiType}
        </h2>
        {loadingChars ? (
          <p className="text-center" style={{ opacity: 0.6 }}>Cargando personajes…</p>
        ) : characters.length === 0 ? (
          <p className="text-center" style={{ opacity: 0.6 }}>No hay personajes registrados para este tipo todavía.</p>
        ) : (
          <div className="row g-3">
            {characters.map((ch, idx) => {
              const imageUrl = getPublicUrl(STORAGE_BUCKETS.characterCovers, ch.cover_path)

              return (
                <div className="col-6 col-md-3" key={ch.id ?? idx}>
                  <div className="card popular-card">
                    <Link className="nav-link" to={`/personaje/${ch.slug ?? ch.id}`}>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          className="card-img-top popular-card-img"
                          alt={ch.name}
                        />
                      )}
                    </Link>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div style={{ minWidth: 0 }}>
                          <Link className="nav-link" to={`/personaje/${ch.slug ?? ch.id}`}>
                            <h3 className="card-title popular-card-title text-truncate">{ch.name}</h3>
                          </Link>
                          <p className="card-text mb-0 text-truncate">
                            {ch.universes?.name ?? ''}
                          </p>
                        </div>
                        <span className="badge rounded-pill home-mbti-badge-small">
                          {ch.mbti_types?.code ?? mbtiType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

// ── Main page ────────────────────────────────────────────────
function PersonalityTestPage() {
  const { isAuthenticated } = useAuth()
  const [phase, setPhase] = useState('intro')   // 'intro' | 'test' | 'result'
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [mbtiType, setMbtiType] = useState(null)
  const [characters, setCharacters] = useState([])
  const [loadingChars, setLoadingChars] = useState(false)

  const handleStart = () => {
    setAnswers([])
    setCurrentIndex(0)
    setMbtiType(null)
    setCharacters([])
    setPhase('test')
  }

  const handleAnswer = (value) => {
    const newAnswers = [...answers, value]
    setAnswers(newAnswers)

    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((i) => i + 1)
    } else {
      const type = calculateMBTI(newAnswers)
      setMbtiType(type)
      setPhase('result')

      // Persist result to database if authenticated
      if (isAuthenticated) {
        mbtiService.submitResult(newAnswers).catch(console.error)
      }

      // Fetch related characters
      setLoadingChars(true)
      characterService.getByMBTI(type)
        .then((data) => setCharacters(Array.isArray(data) ? data.slice(0, 8) : []))
        .catch(() => setCharacters([]))
        .finally(() => setLoadingChars(false))
    }
  }

  return (
    <main className="container py-4 mbti-page">
      {phase === 'intro' && <Intro onStart={handleStart} />}

      {phase === 'test' && (
        <Question
          question={QUESTIONS[currentIndex]}
          index={currentIndex}
          total={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      )}

      {phase === 'result' && mbtiType && (
        <Result
          mbtiType={mbtiType}
          characters={characters}
          loadingChars={loadingChars}
          onRetake={handleStart}
        />
      )}
    </main>
  )
}

export default PersonalityTestPage
