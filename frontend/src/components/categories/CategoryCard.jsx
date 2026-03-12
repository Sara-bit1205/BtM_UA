import { Link } from 'react-router-dom'

// Tarjeta de categoría (universo, personalidad o tipo MBTI)
function CategoryCard({ category }) {
  return (
    <div className="category-card">
      <Link to={`/categorias/${category._id}`}>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </Link>
    </div>
  )
}

export default CategoryCard
