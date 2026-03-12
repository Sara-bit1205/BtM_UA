import { useParams } from 'react-router-dom'

// Página enciclopédica de un personaje individual (estilo Wikipedia)
// Secciones: historia y origen, universo, rasgos de personalidad,
// producciones, actores, análisis e impacto cultural
function CharacterDetailPage() {
  const { id } = useParams()
  return (
    <main>
      <h1>Personaje</h1>
    </main>
  )
}

export default CharacterDetailPage
