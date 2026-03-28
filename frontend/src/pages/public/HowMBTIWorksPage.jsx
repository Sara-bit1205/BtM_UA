// Página teórica: explica cómo se procesan las respuestas del test MBTI
// y qué lógica determina el tipo resultante

import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../assets/styles/mbti.css'

const STEPS = [
  {
    n: 1,
    title: 'Responder las preguntas',
    body: 'El test consta de 10 preguntas. Cada una está asociada a una de las 4 dimensiones del MBTI (E/I, S/N, T/F, J/P). No hay respuestas correctas ni incorrectas: simplemente escoge la opción que describe mejor tu forma de ser habitual.',
  },
  {
    n: 2,
    title: 'Asignación de letras',
    body: 'Cada opción que eliges suma un punto a una de las dos letras de su dimensión. Por ejemplo, si eliges una respuesta de tipo "E", se suma un punto a Extroversión; si eliges "I", se suma un punto a Introversión.',
  },
  {
    n: 3,
    title: 'Conteo por dimensión',
    body: 'Al finalizar todas las preguntas, se cuentan los puntos acumulados en cada extremo de cada dimensión: E vs I, S vs N, T vs F y J vs P.',
  },
  {
    n: 4,
    title: 'Determinación del tipo',
    body: 'En cada dimensión se selecciona la letra con mayor puntuación. Si hay empate, se elige la primera por convención del modelo. Las cuatro letras ganadoras se combinan, formando el tipo MBTI resultante (por ejemplo, INFJ o ESTP).',
  },
  {
    n: 5,
    title: 'Interpretación del resultado',
    body: 'El tipo obtenido se contrasta con las descripciones de los 16 perfiles MBTI. El resultado refleja tus preferencias cognitivas y de comportamiento, y se usa para relacionarte con personajes que comparten esas mismas preferencias.',
  },
]

const DIMENSION_LOGIC = [
  { dim: 'E / I', label: 'Energía',        q: '2 preguntas', example: 'Si obtienes 1 E y 1 I → empate → se asigna E' },
  { dim: 'S / N', label: 'Percepción',     q: '3 preguntas', example: 'Si obtienes 2 N y 1 S → se asigna N' },
  { dim: 'T / F', label: 'Decisión',       q: '2 preguntas', example: 'Si obtienes 2 T y 0 F → se asigna T' },
  { dim: 'J / P', label: 'Estilo de vida', q: '3 preguntas', example: 'Si obtienes 1 J y 2 P → se asigna P' },
]

function HowMBTIWorksPage() {
  return (
    <main className="container py-4 mbti-page">

      {/* ── Hero ── */}
      <section className="mbti-intro-card" aria-labelledby="how-title">
        <h1 id="how-title" className="mbti-section-title">Cómo se calculan los resultados</h1>
        <p>
          El test utiliza una lógica sencilla y transparente para determinar tu tipo de
          personalidad. Aquí te explicamos cada paso del proceso, desde que respondes la
          primera pregunta hasta que se genera tu resultado.
        </p>
      </section>

      {/* ── Step by step ── */}
      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className="mbti-section-subtitle mb-3">El proceso paso a paso</h2>
        <ol className="mbti-steps" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {STEPS.map((s) => (
            <li key={s.n} className="mbti-step">
              <div className="mbti-step-number" aria-hidden="true">{s.n}</div>
              <div className="mbti-step-content">
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Dimension breakdown ── */}
      <section aria-labelledby="dims-detail-title">
        <h2 id="dims-detail-title" className="mbti-section-subtitle mb-3">
          Distribución de preguntas por dimensión
        </h2>

        <div className="mbti-info-block mb-3" role="note">
          <p>
            Las 10 preguntas no se distribuyen uniformemente para que el test sea más natural
            y evite que el usuario identifique el patrón de cada dimensión.
          </p>
        </div>

        <div className="mbti-dimension-grid">
          {DIMENSION_LOGIC.map((d) => (
            <article key={d.dim} className="mbti-dimension-card">
              <p className="mbti-dimension-vs">{d.dim}</p>
              <p style={{ color: 'var(--color4)', fontWeight: 700, margin: 0 }}>{d.label}</p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.85rem', opacity: 0.85 }}>
                {d.q} del test
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: 'var(--color3)' }}>
                Ej: {d.example}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Formula ── */}
      <section aria-labelledby="formula-title">
        <h2 id="formula-title" className="mbti-section-subtitle mb-3">La fórmula del resultado</h2>

        <div className="mbti-formula-card" aria-label="Fórmula de cálculo del tipo MBTI">
          <p className="mbti-formula-caption">
            El tipo final se construye concatenando la letra ganadora de cada dimensión:
          </p>

          <div className="mbti-formula" role="img" aria-label="Tipo igual a E o I, más S o N, más T o F, más J o P">
            {[['E','I','Energía'],['S','N','Percepción'],['T','F','Decisión'],['J','P','Estilo']].map(([a, b, dim], i, arr) => (
              <Fragment key={dim}>
                <div className="mbti-formula__block">
                  <div className="mbti-formula__letters-row">
                    <span className="mbti-formula__letter mbti-formula__letter--a">{a}</span>
                    <span className="mbti-formula__sep">/</span>
                    <span className="mbti-formula__letter mbti-formula__letter--b">{b}</span>
                  </div>
                  <span className="mbti-formula__dim">{dim}</span>
                </div>
                {i < arr.length - 1 && <span className="mbti-formula__plus" aria-hidden="true">+</span>}
              </Fragment>
            ))}
            <span className="mbti-formula__equals" aria-hidden="true">=</span>
            <div className="mbti-formula__result">
              <span className="mbti-formula__result-text">TIPO</span>
              <span className="mbti-formula__dim">16 posibles</span>
            </div>
          </div>

          <p className="mbti-formula-note">
            En caso de empate en una dimensión, se toma la primera letra listada
            (E, S, T o J) por convención del modelo estándar.
          </p>
        </div>
      </section>

      {/* ── Important note ── */}
      <section aria-labelledby="note-title">
        <h2 id="note-title" className="mbti-section-subtitle mb-3">Nota importante</h2>
        <div className="mbti-info-block" role="note">
          <p>
            Este test es una aproximación didáctica al modelo MBTI. Los resultados buscan
            orientarte y divertirte conectando tu personalidad con personajes populares. No
            pretende ser un diagnóstico psicológico oficial. Para una evaluación profesional,
            consulta a un psicólogo o utiliza instrumentos certificados.
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mbti-cta-section" aria-labelledby="cta-title">
        <h2 id="cta-title">¿Listo para descubrir tu tipo?</h2>
        <p style={{ maxWidth: 540, opacity: 0.85 }}>
          Ahora que sabes cómo funciona el cálculo, pon a prueba tu personalidad y encuentra
          los personajes que más se parecen a ti.
        </p>
        <Link className="mbti-btn-primary" to="/test-personalidad">
          Empezar Test
        </Link>
      </section>

    </main>
  )
}

export default HowMBTIWorksPage
