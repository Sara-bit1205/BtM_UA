// Lógica de negocio del test MBTI

// Preguntas del test (extracto orientativo; reemplazar con el conjunto completo)
const QUESTIONS = [
  { id: 'q1', text: '¿Prefieres pasar tiempo en grupos de personas o en solitario?', dimension: 'EI', options: [{ label: 'En grupos', value: 'E' }, { label: 'En solitario', value: 'I' }] },
  { id: 'q2', text: '¿Te fijas más en los detalles concretos o en el panorama general?', dimension: 'SN', options: [{ label: 'Detalles', value: 'S' }, { label: 'Panorama general', value: 'N' }] },
  { id: 'q3', text: '¿Tomas decisiones basándote en la lógica o en los sentimientos?', dimension: 'TF', options: [{ label: 'Lógica', value: 'T' }, { label: 'Sentimientos', value: 'F' }] },
  { id: 'q4', text: '¿Prefieres tener las cosas planificadas o ser espontáneo?', dimension: 'JP', options: [{ label: 'Planificado', value: 'J' }, { label: 'Espontáneo', value: 'P' }] },
]

exports.getQuestions = () => QUESTIONS

// Calcula el tipo MBTI a partir de las respuestas
// answers: array de strings, p.ej. ['E', 'N', 'T', 'J']
exports.calculateMBTI = (answers) => {
  const count = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }
  answers.forEach((a) => { if (count[a] !== undefined) count[a]++ })

  return (
    (count.E >= count.I ? 'E' : 'I') +
    (count.S >= count.N ? 'S' : 'N') +
    (count.T >= count.F ? 'T' : 'F') +
    (count.J >= count.P ? 'J' : 'P')
  )
}
