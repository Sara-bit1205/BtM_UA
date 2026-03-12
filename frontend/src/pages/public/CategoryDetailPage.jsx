import { useParams } from 'react-router-dom'

// Detalle de una categoría específica
// Muestra: descripción, personajes populares, todos los personajes de la categoría
function CategoryDetailPage() {
  const { id } = useParams()
  return (
    <main>
      <h1>Categoría</h1>
    </main>
  )
}

export default CategoryDetailPage
