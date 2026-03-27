// Página informativa sobre los 16 tipos de personalidad MBTI
// Explica qué es el MBTI, las 4 dimensiones y muestra los 16 tipos agrupados

import { Link } from 'react-router-dom'
import '../../assets/styles/mbti.css'

// ── Data ─────────────────────────────────────────────────────
const DIMENSIONS = [
  {
    vs: 'E — I',
    title: 'Energía',
    left:  { letter: 'E', label: 'Extroversión', desc: 'Obtiene energía de las personas y el entorno.' },
    right: { letter: 'I', label: 'Introversión',  desc: 'Obtiene energía de la reflexión y la soledad.' },
  },
  {
    vs: 'S — N',
    title: 'Percepción',
    left:  { letter: 'S', label: 'Sensación',   desc: 'Confía en hechos concretos y la experiencia.' },
    right: { letter: 'N', label: 'Intuición',   desc: 'Confía en ideas, patrones y posibilidades.' },
  },
  {
    vs: 'T — F',
    title: 'Decisión',
    left:  { letter: 'T', label: 'Pensamiento', desc: 'Decide basándose en la lógica y el análisis.' },
    right: { letter: 'F', label: 'Sentimiento', desc: 'Decide considerando valores y el impacto humano.' },
  },
  {
    vs: 'J — P',
    title: 'Estilo de vida',
    left:  { letter: 'J', label: 'Juicio',       desc: 'Prefiere la planificación, el orden y las decisiones firmes.' },
    right: { letter: 'P', label: 'Percepción',   desc: 'Prefiere la flexibilidad, la espontaneidad y adaptarse.' },
  },
]

const GROUPS = [
  {
    name: 'Analistas (NT)',
    color: '#7c5cbf',
    types: [
      { code: 'INTJ', name: 'El Arquitecto',   desc: 'Visionario estratégico, independiente y determinado.' },
      { code: 'INTP', name: 'El Pensador',     desc: 'Analítico, curioso y amante de las teorías abstractas.' },
      { code: 'ENTJ', name: 'El Comandante',   desc: 'Líder nato, audaz y con visión de futuro.' },
      { code: 'ENTP', name: 'El Debatiente',   desc: 'Ingenioso, curioso y siempre dispuesto a cuestionar.' },
    ],
  },
  {
    name: 'Diplomáticos (NF)',
    color: '#4a9e6c',
    types: [
      { code: 'INFJ', name: 'El Consejero',    desc: 'Idealista profundo con una visión única del ser humano.' },
      { code: 'INFP', name: 'El Mediador',     desc: 'Poético, amable y guiado por sus valores internos.' },
      { code: 'ENFJ', name: 'El Protagonista', desc: 'Carismático e inspirador, siempre apoyando a los demás.' },
      { code: 'ENFP', name: 'El Activista',    desc: 'Entusiasta, creativo y lleno de energía social.' },
    ],
  },
  {
    name: 'Centinelas (SJ)',
    color: '#4891af',
    types: [
      { code: 'ISTJ', name: 'El Logístico',   desc: 'Responsable, metódico y de una fiabilidad inquebrantable.' },
      { code: 'ISFJ', name: 'El Defensor',    desc: 'Protector silencioso, cálido y enormemente dedicado.' },
      { code: 'ESTJ', name: 'El Ejecutivo',   desc: 'Gestor eficiente, organizado y orientado a resultados.' },
      { code: 'ESFJ', name: 'El Cónsul',      desc: 'Sociable, atento y siempre pendiente del bienestar ajeno.' },
    ],
  },
  {
    name: 'Exploradores (SP)',
    color: '#c47f30',
    types: [
      { code: 'ISTP', name: 'El Virtuoso',    desc: 'Hábil y curioso, resuelve problemas de forma práctica.' },
      { code: 'ISFP', name: 'El Aventurero',  desc: 'Artístico, libre y siempre abierto a nuevas experiencias.' },
      { code: 'ESTP', name: 'El Empresario',  desc: 'Enérgico y directo, vive y actúa en el presente.' },
      { code: 'ESFP', name: 'El Animador',    desc: 'Espontáneo y sociable, convierte el día a día en fiesta.' },
    ],
  },
]

// ── Page ─────────────────────────────────────────────────────
function MBTITypesPage() {
  return (
    <main className="container py-4 mbti-page">

      {/* ── Hero ── */}
      <section className="mbti-intro-card" aria-labelledby="types-title">
        <h1 id="types-title" className="mbti-section-title">Tipos de Personalidad MBTI</h1>
        <p>
          El <strong>MBTI</strong> (Myers-Briggs Type Indicator) es uno de los modelos de
          personalidad más reconocidos del mundo. Desarrollado por Isabel Briggs Myers y su
          madre Katharine Cook Briggs, se basa en la teoría del psicólogo Carl Jung.
        </p>
        <p>
          Clasifica la personalidad humana en <strong>16 tipos</strong> a partir de cuatro
          dimensiones bipolares. Cada persona se posiciona preferentemente en uno de los dos
          extremos de cada dimensión, lo que genera una combinación única de cuatro letras.
        </p>
        <Link className="mbti-btn-primary" to="/test-personalidad">
          Descubrir mi tipo
        </Link>
      </section>

      {/* ── 4 Dimensions ── */}
      <section aria-labelledby="dims-title">
        <h2 id="dims-title" className="mbti-section-subtitle mb-3">Las 4 dimensiones</h2>
        <div className="mbti-dimension-grid">
          {DIMENSIONS.map((dim) => (
            <article key={dim.vs} className="mbti-dimension-card">
              <p className="mbti-dimension-vs" aria-label={dim.title}>{dim.vs}</p>
              <p style={{ color: 'var(--color4)', fontWeight: 700, margin: 0 }}>{dim.title}</p>

              <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                <div>
                  <span className="mbti-dimension-pill">{dim.left.letter} — {dim.left.label}</span>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.84rem', opacity: 0.85 }}>{dim.left.desc}</p>
                </div>
                <div>
                  <span className="mbti-dimension-pill mbti-dimension-pill--alt">{dim.right.letter} — {dim.right.label}</span>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.84rem', opacity: 0.85 }}>{dim.right.desc}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 16 Types grouped ── */}
      <section aria-labelledby="all-types-title">
        <h2 id="all-types-title" className="mbti-section-subtitle mb-3">Los 16 tipos</h2>

        {GROUPS.map((group) => (
          <div key={group.name} style={{ marginBottom: '2rem' }}>
            <div className="mbti-group-header">
              <div
                className="mbti-group-dot"
                style={{ width: 14, height: 14, borderRadius: '50%', background: group.color, flexShrink: 0 }}
                aria-hidden="true"
              />
              <h3 className="mbti-group-name">{group.name}</h3>
            </div>

            <div className="mbti-types-grid">
              {group.types.map((t) => (
                <article key={t.code} className="mbti-type-card">
                  <span className="mbti-type-code">{t.code}</span>
                  <p className="mbti-type-name">{t.name}</p>
                  <p className="mbti-type-desc">{t.desc}</p>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── CTA ── */}
      <section className="mbti-cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">¿Cuál es tu tipo?</h2>
        <p style={{ maxWidth: 560, opacity: 0.85 }}>
          Responde el test de 10 preguntas y descubre qué tipo de personalidad encaja mejor
          contigo, junto con los personajes que lo comparten.
        </p>
        <Link className="mbti-btn-primary" to="/test-personalidad">
          Empezar Test
        </Link>
      </section>

    </main>
  )
}

export default MBTITypesPage
